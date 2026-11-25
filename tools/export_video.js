#!/usr/bin/env node
// export_video.js — the notation page, frame by frame, into an mp4.
//
// PHASE 2.2 of docs/plans/VIDEO_BUILD_PLAN.md. One transport `t` drives
// everything: layout + render give the STATIC page, animobj.frameSvg(t) gives
// the moving layer, and the two are composited and piped straight into
// ffmpeg's stdin — no staged PNGs, no disk churn.
//
//   node tools/export_video.js --ir db1 --view video --fps 30 \
//        --audio notation/audio/piece-final-draft-001.wav --out out.mp4
//        [--z 2] [--t0 S --t1 S] [--probe 703.5,710.2 --probeDir dir]
//        [--cut notation/video/cut-list.json] [--fade 8] [--fadeMode dip|cross]
//        (--fade 0 = hard cuts)
//
// THE PAGE CACHE (2.1's profile, and the whole reason this is fast): resvg
// spends 131 ms parsing a 234 KB page SVG and 13 ms actually drawing it. The
// static page does not change for the 360 frames of a 12 s page — only the
// overlay does. So each page is rasterized ONCE and every frame composites a
// small overlay over the cached pixels. 64 page rasters for the whole piece.
//
// FONTS: never let the rasterizer resolve by family. Windows carries
// CrimsonPro-VariableFont_wght.ttf as "Crimson Pro" and the page asks for
// "Crimson Pro Light" — a system lookup silently draws weight 400 instead of
// the repo's Light 300. loadSystemFonts:false + explicit files, always.

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const Coords = require(path.join(ROOT, 'notation', 'lib', 'coords.js'));
const Layout = require(path.join(ROOT, 'notation', 'lib', 'layout.js'));
const Render = require(path.join(ROOT, 'notation', 'lib', 'render.js'));
const Splice = require(path.join(ROOT, 'notation', 'lib', 'splice.js'));
const AnimObj = require(path.join(ROOT, 'notation', 'lib', 'animobj.js'));
const StaticPage = require(path.join(ROOT, 'notation', 'lib', 'static_page.js'));
const { Resvg } = require('@resvg/resvg-js');

// ---------------------------------------------------------------- args
function arg(name, def) { const i = process.argv.indexOf('--' + name); return i >= 0 ? process.argv[i + 1] : def; }
const irId = arg('ir', 'db1');
const viewMode = arg('view', 'video');            // video | zoom
const fps = parseFloat(arg('fps', '30'));
const zoomZ = parseFloat(arg('z', '0')) || null;
const audio = arg('audio', null);
const outFile = arg('out', null);
const tStart = arg('t0') != null ? parseFloat(arg('t0')) : null;
const tEnd = arg('t1') != null ? parseFloat(arg('t1')) : null;
const probes = (arg('probe', '') || '').split(',').filter(Boolean).map(Number);
const probeDir = arg('probeDir', path.join(ROOT, 'notation', 'video', 'probe'));
const dumpPage = arg('dumpPage');
const screenJson = arg('screenJson', null);   // [2c.4] dump the screen plan + the clamp report (+ --screenHtml: every page's SVG), then stop
const fadeFrames = Math.max(0, Math.round(parseFloat(arg('fade', '8')) || 0));   // W2: 0 = hard cuts
const fadeMode = arg('fadeMode', 'dip');                                        // dip | cross
if (!outFile && !probes.length && dumpPage == null && !screenJson) {
  console.error('usage: export_video.js --ir <id> --view video|zoom --fps N --audio <wav> --out <mp4>');
  console.error('       (or --probe t1,t2,... --probeDir <dir> to write single frames instead)');
  console.error('       (or --dumpPage N [--dumpTo file.svg] to write one static page SVG)');
  process.exit(2);
}

// ---------------------------------------------------------------- load
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const glyphs = rd('notation/lib/glyphs.json');
const pageRules = rd('notation/registry/page_rules.json');
const C = require(path.join(ROOT, 'notation', 'lib', 'rules.js')).loadContainer(ROOT);
// [PLAN 2k, D55 / M5 — 2026-09-16] the ensemble, REALIZED: this export is the presentation score (a full score read together), so the
// bass clarinet is in C on a bass clef (registry realizations.video-jury.ensemble); the working page keeps the default B♭ treble.
const ens = rd('notation/registry/ensemble.json');
const T = rd('notation/registry/techniques.json');
const ir = rd(path.join('notation', 'ir', irId + '.ir.json'));
let score = null;
try { score = rd(path.join('scores', ir.source.score + '.json')); } catch (e) { score = null; }

// day 40 (demo videos): --parts 0,1 renders a subset of lanes through the
// sparse-lane path (PP fix B). DEFAULT = the jury frame: every part.
// [PLAN 2i.10.1, the septet frame — 2026-09-16, RUNNING_LOG §558] the frame's parts, weights and staves come from the ensemble
// registry exactly as notation.html fills FRAME_PARTS at init (the probe of §556 drew the tuba's T1–T10 and no piano).
const ENS = Layout.ensembleForPage(Layout.ensembleFor(ens, (C.realizations || {})['video-jury']), ir);   // [the Switch~ piece §468] a page's omitParts, as the app reads them
const ensPart = p => (ENS && ENS.parts.find(q => q.part === p)) || null;
const FRAME_PARTS = (arg('parts', '') || '').split(',').filter(Boolean).map(Number);
if (!FRAME_PARTS.length) FRAME_PARTS.push(...(ENS ? ENS.parts.map(p => p.part) : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
// [2e.4] the ladder's fit: the frame's lane boxes in ss (notation/lib/fit.js — the geometry the tools use too)
const Fit = require(path.join(ROOT, 'notation', 'lib', 'fit.js'));
const model = Layout.layoutSection(ir, glyphs, Object.assign(
  { m4AttackLines: false, frameParts: FRAME_PARTS, ensemble: ENS, techniques: T, fitBoxes: Fit.boxesFor(C, ENS, FRAME_PARTS) },
  (C.engraving && C.engraving.layout) || {}));

// ------------------------------------------------- the app's video geometry
// Mirrors notation.html renderContainerView() exactly. Any drift here is a
// drift between the video and what the composer approved on screen.
const rz = (C.realizations || {})['video-jury'] || {};
const lanes = rz.lanes || { padTopPx: 8, padBotPx: 8, gapPx: 4 };
const W = (C.frame && C.frame.widthPx) || 1920;
const H = (C.frame && C.frame.heightPx) || 1080;
const pageSeconds = +arg('pageSeconds', 0) || (ir.layoutPolicy && ir.layoutPolicy.pageSeconds > 0 ? +ir.layoutPolicy.pageSeconds : 0) || (C.timeScale && C.timeScale.defaults && C.timeScale.defaults.trance) || 12;   // [§366] a page's own pace (layoutPolicy.pageSeconds), else the registry's
// [2a.1 on the page] lanes WEIGHTED by the ensemble (the piano's grand staff = 2): lanePx is one weight unit, each lane's staff
// scale follows its weight, and a multi-staff part's staves are placed at the registry's inter-staff gap.
// [PLAN 2b.1.2 — 2026-09-17] those fifteen lines now live in Coords.ensembleFrame, which the PRINT exporter calls too (it had
// the pre-2a.1 copy — §552's six equal lanes and no piano). Proven unchanged here: seven dumped pages byte-identical.
const FRAME = Coords.ensembleFrame(FRAME_PARTS, {
  heightPx: H, lanes, staffHeightPx: (C.staff && C.staff.staffHeightPx) || 31.6,
  grandStaff: ((C.engraving || {}).layout || {}).grandStaff,
  weightOf: ENS ? (p => (ensPart(p) && ensPart(p).weight) || 1) : undefined,
  stavesOf: p => (ensPart(p) && ensPart(p).staves && ensPart(p).staves.length) || 1,
  ensemble: ENS,   // [2a] the joined lane (the percussionist's brace) is read from it
});
const systems = FRAME.systems, ssPerSystem = FRAME.ssPerSystem, lanePx = FRAME.lanePx;
// Z is the ZOOM FACTOR, not a mode flag. It was gated on viewMode==='zoom',
// which made a CUT render its V-TOP/V-BOT halves from an UNZOOMED 1080-tall
// frame — 63 zoom segments instead of 129, and the close-ups would have been
// the top half of the wide shot. Caught by a dry run before any pixels.
// [2i.10.2] the septet cut renders its close-ups at the registry's video-cut zoom (1.85: the strings fit a 1080 frame)
const CUT_RZ = (C.realizations || {})['video-cut'] || null;
const Z = zoomZ || (CUT_RZ && CUT_RZ.zoomZ) || ((C.realizations || {})['zoom-working'] || {}).zoomZ || 2;
// [2c.2] THE SCREEN PLAN: page_rules.screenPlan 'tile' = the constant sweep (Splice.tilePages) — absent = planPages, the overlap
const TILE = pageRules.screenPlan === 'tile';
// [LGMF 2e.2, §409] THE LEAD-IN (page_rules.leadInS — his 4 s for the presentation score): the tiled screen opens LEAD seconds before
// the IR's start, every page still one span; the film starts there and its audio is delayed by the same. Absent = 0, as before.
const LEAD = TILE ? Splice.leadInOf(pageRules, (C.realizations || {})['video-jury']) : 0;
const SRC0 = ir.source.window[0] - LEAD;
const pages = TILE ? Splice.tilePages(ir, pageRules, pageSeconds, SRC0) : Splice.planPages(ir, pageRules, pageSeconds);
const srcEnd = ir.source.window[1];
// the edge rules a tiled screen page renders by (render.js opts.screenEdges); `first` = the window opens at the screen's start
const screenEdgesAt = t0 => TILE ? { edge: pageRules.edge || {}, first: t0 <= SRC0 + 1e-9, clampGoLine: pageRules.clampGoLine } : undefined;
// [2e.2, §411] the animated devices under the same edge rules — only when the table names them (`anim:<kind>`); absent = the frame as before
const ANIM_EDGE = TILE && Object.keys(pageRules.edge || {}).some(k => k.startsWith('anim:')) ? pageRules.edge : null;

// [§404 on the page] THE BUFFER AFTER THE CLEF: each page's window opens page_rules.musicStartBufferSs staff spaces early (never before
// the IR's start), so the page — and its turn, at window[1] — runs that much earlier, as renderContainerView draws it
const bufSs = TILE ? 0 : (pageRules.musicStartBufferSs || 0);   // [2c.2] no buffer on a tiled screen: t0 IS the page's start
// [2c.1] the frame's edges — the gutter and the two margins — from the registry, through the reader the app uses
const EDGES = Coords.edgesOf(C);
const pxPerSecPage = Coords.musicPx(W, EDGES) / pageSeconds;
const bufSec = bufSs > 0 && ssPerSystem > 0 ? bufSs * (lanePx / ssPerSystem) / pxPerSecPage : 0;
// [2c.1] THE RIGHT MARGIN HOLDS THE OVERHANG: ink may enter it, never pass the frame (registry prefatory.overhangSs; absent = no check)
const overhangSs = C.prefatory && C.prefatory.overhangSs;
if (overhangSs > 0 && EDGES.marginRightPx < overhangSs * (lanePx / ssPerSystem)) {
  console.error('right margin ' + EDGES.marginRightPx + ' px cannot hold the ' + overhangSs + ' ss overhang (' +
    (overhangSs * lanePx / ssPerSystem).toFixed(1) + ' px at this staff)'); process.exit(2);
}
const pageT0Of = i => Math.max(SRC0, pages[i].t0 - bufSec);
function baseCfgFor(pageIdx) {
  const t0 = pageT0Of(pageIdx);
  return Object.assign({
    widthPx: W, heightPx: H, window: [t0, t0 + pageSeconds],
    systems, ssPerSystem,
  }, EDGES);
}
const pageContaining = t => {
  let best = 0;
  for (let i = 0; i < pages.length; i++) if (pages[i].t0 <= t) best = i; else break;
  return best;
};

// THE TURN SEQUENCE — from notation.html drawOverlayFrame(). A segment is held
// until t reaches min(window[1], srcEnd) and then HARD-CUTS. The two modes turn
// on different things, and getting this wrong is the difference between the film
// the composer approved and a different one:
//
//   video — turn to the NEXT PAGE. Pages do NOT tile at pageSeconds: planPages
//           breaks on musical rules and the window is a fixed span from p.t0, so
//           a break that falls early makes the successor start BEFORE the turn,
//           and that music appears on both pages. MEASURED on db1: 64 pages, and
//           8 of the 63 gaps are short — 10.018, 10.642, 10.718, 10.802, 10.882,
//           11.598, 11.982, 11.988 s — 7.37 s of overlap in total. Dividing t by
//           pageSeconds is right for the first 55 pages and wrong for the rest,
//           cumulatively, which is the worst way for it to be wrong.
//
//   zoom  — pageIdx never advances (`state.zoomT0 = w1`); the window steps by
//           its own span, pageSeconds / Z = 6 s, CONTIGUOUSLY and with no regard
//           for page boundaries. That is D1's "~6 s per system, sweeping at 2x".
//
// One deliberate departure, and the only one: in zoom the app leaves `pageIdx`
// wherever video mode left it, so `reshow`/`ownsEnd` come from a stale page.
// That is a UI artifact of ←/→ doubling as the zoom step, not a design — here
// they come from the page CONTAINING each window's start.
function buildSegments(mode) {
  const out = [];
  let tCur = LEAD ? SRC0 : 0;   // [2e.2] the film opens at the lead-in
  if (mode === 'zoom') {
    const probe = Coords.zoomCfg(baseCfgFor(0), Z, 0);
    const span = probe.window[1] - probe.window[0];
    // [the Switch~ piece §267 — his SHIFT+arrows in the app, "to keep my passage on the same page"] --zoomAnchor T: the zoom pages are
    // shifted so that one of them OPENS at T (the app's pan, to any time); the film must start at or after the first such page
    if (arg('zoomAnchor') != null) { const anc = parseFloat(arg('zoomAnchor')); if (Number.isFinite(anc) && anc >= tCur) tCur = anc - Math.floor((anc - tCur) / span) * span; }
    for (let s = 0; tCur < srcEnd && s < 100000; s++) {
      const pi = pageContaining(tCur);
      const cfg = Coords.zoomCfg(baseCfgFor(pi), Z, tCur);
      const end = Math.min(cfg.window[1], srcEnd);
      out.push({ t0: tCur, t1: end, view: Coords.makeView(cfg),
        reshow: pages[pi].reshow, ownsEnd: end >= srcEnd - 1e-9, screenEdges: screenEdgesAt(cfg.window[0]) });
      tCur = tCur + span;
    }
  } else {
    for (let i = 0; i < pages.length; i++) {
      // [2i.10.1] the buffered window turns at its own end · [2c.2] a tiled page turns AT its tω
      const end = TILE ? pages[i].t1 : Math.min(pageT0Of(i) + pageSeconds, srcEnd);
      if (end <= tCur) continue;
      out.push({ t0: tCur, t1: end, view: Coords.makeView(baseCfgFor(i)),
        reshow: pages[i].reshow, ownsEnd: i === pages.length - 1, screenEdges: screenEdgesAt(pageT0Of(i)) });
      tCur = end;
    }
  }
  return out;
}
const SEGS = { video: buildSegments('video'), zoom: null };
const segsOf = m => (m === 'zoom' ? (SEGS.zoom || (SEGS.zoom = buildSegments('zoom'))) : SEGS.video);
const segments = segsOf(viewMode);
const pieceEnd = segments.length ? segments[segments.length - 1].t1 : srcEnd;
const segAtIn = (list, t) => {
  for (let i = 0; i < list.length; i++) if (t < list[i].t1) return i;
  return Math.max(0, list.length - 1);
};
const segAt = t => segAtIn(segments, t);

// ---------------------------------------------------------------- static page
// The page itself lives in notation/lib/static_page.js so the PRINT exporter
// draws the identical page (day 37). Proven: all 64 db1 static SVGs are
// byte-identical across this change.
// [the Switch~ piece §468 — his "we need the waveform of the demo in the score"] THE ELEC LANE'S WAVEFORM (notation/lib/elec_wave.js, bank/elec_wave.json), on every page
const ElecWave = require(path.join(ROOT, 'notation', 'lib', 'elec_wave.js'));
const ELEC_WAVE = (() => { try { return { wave: rd('bank/elec_wave.json'), rule: rd('notation/registry/rules.json').objects.elecWave }; } catch (e) { return null; } })();
// [§468] THE PAGE'S FURNITURE in the film (layoutPolicy.furniture — the piano solo's ribbons, curtains, repeats, chord symbols; §361 had them in the app only): asked of the
// workshop's own code for the window, as the app's server route does; drawn in the frame's coordinates and scaled with the zoom
const FURN = ir.layoutPolicy && ir.layoutPolicy.furniture;
const furnCache = new Map();
function furnitureOf(view, zoomed) {
  if (!FURN) return null;
  const key = (zoomed ? 'z' : 'v') + view.window[0];
  if (furnCache.has(key)) return furnCache.get(key);
  const Zf = zoomed ? Z : 1, v = require('./notation_workshop.js').viewOf(FURN, view.window[0], view.window[1] - view.window[0], W / Zf, { real: true });
  const clip = '<defs><clipPath id="wkclip"><rect x="' + (v.x0 - 2).toFixed(1) + '" y="0" width="' + (v.w - v.x0 + 2).toFixed(1) + '" height="4000"/></clipPath></defs>';
  const add = '<g class="furniture"' + (Zf !== 1 ? ' transform="scale(' + Zf + ')"' : '') + '>' + clip + (v.adds || []).map(a => '<g clip-path="url(#wkclip)">' + a + '</g>').join('') + '</g>';
  const out = { Z: Zf, add, protos: v.protos || [], strikes: v.strikes || [] };
  furnCache.set(key, out);
  return out;
}
// [§469 — his "the bottom is cut here too … you're not getting the full image into the frame"] A GROUP'S CLOSE-UP DRAWS ONLY ITS OWN PARTS: the other systems (their staves,
// clefs, notes and words) are left off its page and their motion off its overlay, so the frame can take all the room its own ink needs without a neighbor's in it.
// The layout and every position are unchanged. Not used by the solo's framed close-up, which keeps every staff (his word: "keep the staff lines").
const inKeep = (keep, key) => String(key).split(/[+:]/).some(x => keep.includes(parseInt(x, 10)));
function keepOnly(svg, keep) {
  if (!keep) return svg;
  let out = svg, from = 0;
  for (let guard = 0; guard < 1000; guard++) {
    const re = /<g class="sys sys-p([^"]+)"/g; re.lastIndex = from; let m, cut = null;
    while ((m = re.exec(out))) if (!inKeep(keep, m[1])) { cut = m.index; break; }
    if (cut == null) break;
    const tag = /<g[\s>]|<\/g>/g; tag.lastIndex = cut; let depth = 0, end = -1, x;
    while ((x = tag.exec(out))) { depth += x[0] === '</g>' ? -1 : 1; if (depth === 0) { end = x.index + 4; break; } }
    if (end < 0) break;
    out = out.slice(0, cut) + out.slice(end); from = cut;
  }
  return out;
}
function staticSvg(i, list, keep) {
  const seg = (list || segments)[i], zoomed = (list || segments) === SEGS.zoom || (!list && viewMode === 'zoom'), F = furnitureOf(seg.view, zoomed);
  const wave = ELEC_WAVE ? ElecWave.svg(seg.view, ELEC_WAVE.wave, ELEC_WAVE.rule) : '';
  return keepOnly(StaticPage.staticPageSvg({
    model, view: seg.view, glyphs, C, srcEnd,
    reshow: seg.reshow, ownsEnd: seg.ownsEnd, ensemble: ENS,   // [2i.10.1] the labels, brackets and brace
    screenEdges: seg.screenEdges,   // [2c.2] a tiled screen page's edge rules (undefined off the tile plan)
    append: ((keep && !keep.includes(8) ? '' : wave) + (F ? F.add : '')) || undefined,
    finalBar: arg('finalBar', 'off') === 'on',   // [§479] the piece's final double bar, on the section that ends the piece (tools/make_film.js)
  }), keep);
}
// [§468] THE FURNITURE'S MOTION: the ball on the ribbons and the thrown pebbles — notation.html's furnitureFrameSvg, the same curves
function furnitureFrameSvg(F, view, t) {
  if (!F || !((F.protos && F.protos.length) || (F.strikes && F.strikes.length))) return '';
  const Z = F.Z || 1, cl = u => Math.max(0, Math.min(1, u)), out = [];
  for (const K of F.strikes || []) { const e = K.bounce;
    for (const p of K.rocks) {
      const tl = p.tl != null ? p.tl : K.impact - K.flightS + p.dly, u = (t - tl) / p.T, yl = p.yl || 0; let x, y, air;
      if (u < 0) { x = p.xh; y = K.floor - p.yh; air = 0; }
      else if (u <= 1) { x = p.xh + (p.xl - p.xh) * u; y = K.floor - yl - p.H * 4 * u * (1 - u); air = t - tl; }
      else { const tb = t - tl - p.T, Tb = p.T * e, ub = tb / Tb, dx = (p.xl - p.xh) * e * 0.5;
        if (ub < 1) { x = p.xl + dx * ub; y = K.floor - yl - p.H * e * e * 4 * ub * (1 - ub); air = p.T + tb; } else { x = p.xl + dx; y = K.floor - yl; air = p.T + Tb; } }
      const c = 'rgb(' + p.gray + ',' + p.gray + ',' + p.gray + ')';
      out.push('<path d="' + p.d + '" transform="translate(' + x.toFixed(1) + ' ' + (y - p.r * 0.6).toFixed(1) + ') rotate(' + (p.spin * air).toFixed(0) + ')" ' + (K.stroked ? 'fill="none" stroke="' + c + '" stroke-width="0.6"' : 'fill="' + c + '"') + '/>');
    } }
  for (const p of F.protos || []) { const a = p.arc; if (t < a.t0 || t > a.t1 || !p.arcY) continue;
    const pr = p.preset, dp = 1 + (pr.ictus / 1000) * 20, ap = 1 + pr.stiffness / 50, rb = pr.damping / 100; let fr;
    if (p.wave) { const wkA = [].concat(p.sharp || 1), shpK = (h, wk) => wk === 1 ? h : Math.pow(h, wk) / (Math.pow(h, wk) + Math.pow(1 - h, wk));
      if (t <= a.bounce) { const d = a.bounce - a.t0; fr = shpK((1 + Math.cos(Math.PI * cl(d > 0 ? (t - a.t0) / d : 1))) / 2, wkA[0]); }
      else { const d2 = a.t1 - a.bounce; fr = rb * shpK((1 - Math.cos(Math.PI * cl(d2 > 0 ? (t - a.bounce) / d2 : 1))) / 2, wkA[wkA.length - 1]); } }
    else if (t <= a.bounce) { const d = a.bounce - a.t0; fr = 1 - Math.pow(cl(d > 0 ? (t - a.t0) / d : 1), dp); }
    else { const d = a.t1 - a.bounce; fr = rb * (1 - Math.pow(1 - cl(d > 0 ? (t - a.bounce) / d : 1), ap)); }
    let r = p.look.ballRadiusPx; const rbn = p.ribbon;
    if (rbn && rbn.length) { let h = rbn[rbn.length - 1][1]; for (let i = 1; i < rbn.length; i++) if (t <= rbn[i][0]) { const q0 = rbn[i - 1], q1 = rbn[i], u2 = q1[0] > q0[0] ? (t - q0[0]) / (q1[0] - q0[0]) : 0; h = q0[1] + (q1[1] - q0[1]) * cl(u2); break; }
      r = Math.max(r, ((p.flow && p.flow.ballOverRibbon) || 1.35) * h + 2); }
    out.push('<circle cx="' + (view.xOfSeconds(t) / Z).toFixed(1) + '" cy="' + (p.arcY.imp - fr * (p.arcY.imp - p.arcY.apex)).toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + p.look.color + '" stroke="#fff" stroke-width="1.6"/>'); }
  // a pebble in flight stays in the music's area, off the clefs (the page's own signs are clipped the same way)
  const cx = view.musicX0Px / Z - 2;
  return '<defs><clipPath id="fmclip"><rect x="' + cx.toFixed(1) + '" y="0" width="' + (view.widthPx / Z - cx).toFixed(1) + '" height="4000"/></clipPath></defs><g class="furniture-motion" clip-path="url(#fmclip)"' + (Z !== 1 ? ' transform="scale(' + Z + ')"' : '') + '>' + out.join('') + '</g>';
}

// ---------------------------------------------------------------- rasterizer
const FONTS = ['CrimsonPro-Light.ttf', 'CrimsonPro-LightItalic.ttf']
  .map(f => path.join(ROOT, 'notation', 'app', 'fonts', f));
// [RUNNING_LOG §699 — his eye on the film: "13 (E▯1)" — "some kind of font got dropped"] THE SIGNS IN A TEXT: Crimson Pro has no ♭ ♯ ♮
// (U+266D · 266F · 266E), and with loadSystemFonts off the rasterizer had nothing to fall back to — every partial on an E♭ or a D♭
// fundamental drew the missing-glyph box in the film (the app's Chrome falls back to a system symbol font, so the page looked right).
// The symbol font Chrome uses on this machine is loaded BY FILE, as a fallback only (the family asked for stays Crimson Pro Light).
const SYMBOL_FONTS = ['C:/Windows/Fonts/seguisym.ttf'].filter(p => fs.existsSync(p));
if (!SYMBOL_FONTS.length) console.warn('  !! no symbol font found (C:/Windows/Fonts/seguisym.ttf) — a ♭ ♯ ♮ in a text will draw as a box');
FONTS.push(...SYMBOL_FONTS);
const fontOpt = { loadSystemFonts: false, fontFiles: FONTS, defaultFontFamily: 'Crimson Pro Light' };
function raster(svg, background) {
  const opts = { fitTo: { mode: 'original' }, font: fontOpt };
  if (background) opts.background = background;
  const img = new Resvg(svg, opts).render();
  return { px: img.pixels, w: img.width, h: img.height };
}

// ---------------------------------------------------------------- anim layer
const _dev = Layout.deviceResolver(ir, (C.engraving || {}).layout || {});
const animInstances = AnimObj.collect(ir, score, C.animated, {
  parts: FRAME_PARTS, meta: false,         // D4: META off; day 40: scoped to the rendered lanes
  deviceOf: _dev,
  staffExtentOf: Layout.staffExtentResolver(ENS),   // [§645] the beat ball over a staff's own outer lines
  // day 40: the meters ride the DRAWN curve (layout.drawnLevelSamples is the
  // one source) — the video stays pixel-congruent with the app by sharing it
  drawnOf: e => Layout.drawnLevelSamples(e, _dev(e) || {}),
}).filter(i => i.part === undefined || FRAME_PARTS.includes(i.part));   // day 40: no instance may reference an undrawn lane
function overlaySvg(view, t, furn, keep) {
  const inner = AnimObj.frameSvg(keep ? animInstances.filter(a => a.part === undefined || inKeep(keep, a.part)) : animInstances, view, t, C.animated, ANIM_EDGE ? { edge: ANIM_EDGE } : undefined) + (furn ? furnitureFrameSvg(furn, view, t) : '');
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + view.widthPx + '" height="' + view.heightPx +
    '" viewBox="0 0 ' + view.widthPx + ' ' + view.heightPx + '">' + inner + '</svg>';
}

// source-over onto a copy of the cached page.
//
// THE OVERLAY IS PREMULTIPLIED, and this loop used to say "straight alpha".
// MEASURED day 36 (post-clear): resvg returns premultiplied RGBA — a bare
// <rect fill="#F04B00" opacity="0.3"/> comes back as RGB (72,23,0) A 76, the
// colour already multiplied by its alpha. Doing `over*na + base*ia` on that
// applies the alpha a SECOND time:  C·a·a + base·(1-a)  instead of
// C·a + base·(1-a). Every TRANSLUCENT animated element therefore contributed
// only `a` of its own colour and composited as a grey smudge — the morph
// meters measured (198,157,139) where the app draws (248,173,139). That was
// the composer's "strange shadow" in WISHLIST W1. Opaque elements took the
// a===255 fast path and were always exact, which is why the magenta cursor
// looked right and nothing else gave it away.
//
// Premultiplied source-over is `over + base*(1-a)` — no na term. Safe in a
// Buffer: premultiplied RGB <= alpha, so over[i] + base[i]*(1-a) <= 255 and
// nothing can wrap. The base is the page raster built with background:'white',
// so its alpha is 255 everywhere (premultiplied == straight for it), and out's
// alpha bytes are never written, so the buffer stays opaque RGBA for ffmpeg.
//
// NOTE the static page never went through here (it is one resvg pass with an
// opaque background), which is why PHASE 5's --dumpPage pixel proof passed:
// that proof covers the STATIC page only, not the animated layer.
function composite(base, over) {
  const out = Buffer.from(base);
  for (let i = 0; i < out.length; i += 4) {
    const a = over[i + 3];
    if (a === 0) continue;
    if (a === 255) { out[i] = over[i]; out[i + 1] = over[i + 1]; out[i + 2] = over[i + 2]; continue; }
    const ia = 1 - a / 255;
    out[i] = over[i] + out[i] * ia;
    out[i + 1] = over[i + 1] + out[i + 1] * ia;
    out[i + 2] = over[i + 2] + out[i + 2] * ia;
  }
  return out;
}

// ---------------------------------------------------------------- page cache
// One cache PER MODE: a cut alternates between the video page and the zoom
// segment, and a single slot would re-rasterize on every switch. Two slots cost
// 8.3 MB + 16.6 MB and make the 19 switches of a cut free.
let pageRasters = 0;
const CACHE = { video: { idx: -1, px: null }, zoom: { idx: -1, px: null } };
function pageFor(i, mode, keep) {
  const ck = mode + (keep ? ':' + keep.join(',') : ''), c = CACHE[ck] || (CACHE[ck] = { idx: -1, px: null }), list = segsOf(mode);
  if (i !== c.idx) { c.px = raster(staticSvg(i, list, keep), 'white').px; c.idx = i; pageRasters++; }
  return { px: c.px, view: list[i].view };
}
function frameRGBA(tIn, mode, keep) {
  // [2i.10.5] past the material's end the picture HOLDS (the cursor at the end, as the page rests when its playback stops) while the
  // audio's tail rings: the septet render runs 5.1 s past the IR (624.0 last note · 625 material · 630.1 WAV) — render with --t1 <WAV length>
  const t = Math.min(tIn, srcEnd);
  const m = mode || viewMode;
  const list = segsOf(m);
  const { px, view } = pageFor(segAtIn(list, t), m, keep);
  const ov = raster(overlaySvg(view, t, furnitureOf(view, m === 'zoom'), keep), null);
  return composite(px, ov.px);
}
// take rows [y0, y0+h) out of a W-wide RGBA buffer — the zoom master's halves
function cropRows(px, y0, h) {
  const rowBytes = W * 4;
  return px.subarray(y0 * rowBytes, (y0 + h) * rowBytes);
}
// [PLAN 2i.10.2 — 2026-09-16, RUNNING_LOG §558] THE CLOSE-UPS AS GROUPS (registry realizations.video-cut.halves). The tuba's fixed
// y = 1080 split works for ten equal lanes; the septet's are unequal (it fell 58 px inside Vn1). Each close-up is a group of parts:
// its lanes are centred in the frame, and every row outside the group — above its top neighbour's lane bottom, or from its own lane
// bottom down — is paper. The zoom master's geometry is page-invariant (only the window moves), so the rows are fixed for the film.
const HALVES = (() => {
  // [the Switch~ piece §468] --groups '{"V-TOP":[0,1,2]}': the close-ups of THIS section (tools/make_film.js)
  const hv = arg('groups') ? JSON.parse(arg('groups')) : (CUT_RZ && CUT_RZ.halves);
  if (!hv) return null;
  const zv = Coords.makeView(Coords.zoomCfg(baseCfgFor(0), Z, pageT0Of(0)));
  const MH = Math.round(H * Z);
  // [PLAN 2h.7.1 — 2026-09-17] a --parts subset can leave a half with no drawn part (Vn1 + Va: both V-BOT): skip it here, fail only if a cut uses it
  const ext = Object.entries(hv).filter(([, ps]) => Array.isArray(ps)).map(([name, ps]) => {
    const ss = zv.systems.filter(s => ps.includes(s.part));
    if (!ss.length) return null;
    return { name, top: Math.min(...ss.map(s => s.yTopPx)), bot: Math.max(...ss.map(s => s.yBotPx)) };
  }).filter(Boolean).sort((a, b) => a.top - b.top);
  const out = {};
  // [decibel PLAN 2.14 — 2026-10-10, RUNNING_LOG §424] THE GROUPS MAY SHARE A LANE. Five lanes do not split into two groups that both fill
  // the frame; this piece's groups are the top three and the bottom three, the percussionist's lane in both. So a group's paper is set by
  // the LANES, not by the group before it: `lo` = the bottom of the lane just above the group (0 if none), `hi` = the group's own bottom
  // (the master's end if no lane lies below). For groups that partition the lanes — pieces #5 · #6 — this is the rule as it was.
  // [the Switch~ piece §469 — his "the bottom is cut here too … you're not getting the full image into the frame"] A GROUP REACHES TO ITS NEIGHBORS' STAFF LINES, not to its own
  // lane's box: what is written outside a staff (dynamics, words, the ball's curves, ledger notes) lies in the lane's margin and was cut there. Paper begins one staff space
  // short of the nearest outer line of the staff above and of the staff below (the ELEC lane, which has no staff, by its lane). The frame is centred on that band; when the band
  // is taller than the frame, on the group's own staves. --groupBands prints each band's height at x1, for the caller to choose a zoom that fits.
  const EPS = 0.5;
  // the systems that carry staff lines: a grand staff's own staves ("5:0", "5:1"), not the lane that holds them ("5"); a joined lane's members, not the join ("3+4").
  // A staff's half-height is its registry entry's (the percussion's four single lines 2 ss apart = 3 ss); the ELEC lane has none and counts by its box.
  const keyOf = s => String(s.part), numOf = s => parseInt(keyOf(s), 10);
  const staffSys = zv.systems.filter(s => !keyOf(s).includes('+') && !zv.systems.some(q => keyOf(q).startsWith(keyOf(s) + ':')));
  const halfOf = s => (keyOf(s).includes(':') ? 2 : Coords.staffHalfSs(ensPart(numOf(s))));
  const lines = s => (numOf(s) === 8 ? [s.yTopPx, s.yBotPx] : [s.yMidPx - halfOf(s) * s.ssPx, s.yMidPx + halfOf(s) * s.ssPx]);
  ext.forEach((e) => {
    const ps = hv[e.name], own = staffSys.filter(s => ps.includes(numOf(s))), oth = staffSys.filter(s => !ps.includes(numOf(s)));
    const gTop = Math.min(...own.map(s => lines(s)[0])), gBot = Math.max(...own.map(s => lines(s)[1]));
    const above = oth.filter(s => lines(s)[1] <= gTop + EPS), below = oth.filter(s => lines(s)[0] >= gBot - EPS);
    const lo = above.length ? Math.ceil(Math.max(...above.map(s => lines(s)[1] + s.ssPx))) : 0;
    const hi = below.length ? Math.floor(Math.min(...below.map(s => lines(s)[0] - s.ssPx))) : MH;
    const ss = own[0].ssPx, gx = Math.round(zv.musicX0Px) - 2;
    out[e.name] = { lo: 0, hi: MH, y0: Math.round((hi - lo <= H ? (lo + hi) / 2 : (gTop + gBot) / 2) - H / 2), top: e.top, bot: e.bot, band: hi - lo, keep: ps,
      gutterX: gx, gutterRows: [Math.floor(gTop - 1.5 * ss), Math.ceil(gBot + 1.5 * ss)] };
  });
  // [the Switch~ piece §468] A FRAMED CLOSE-UP: { rows: [a, b], at: y, paste: [c, d], pasteAt: y2 } — the master's rows a … b stand at y, and rows c … d (the ELEC lane) at y2; the rest is paper
  Object.entries(hv).filter(([, v]) => !Array.isArray(v)).forEach(([name, v]) => { out[name] = v; });
  return out;
})();
if (arg('groupDebug') != null) {   // [§469] the close-up geometry, for a look
  const zv = Coords.makeView(Coords.zoomCfg(baseCfgFor(0), Z, pageT0Of(0)));
  console.log(JSON.stringify(zv.systems.map(s => ({ p: s.part, top: Math.round(s.yTopPx), mid: Math.round(s.yMidPx), bot: Math.round(s.yBotPx), ss: +s.ssPx.toFixed(2), keys: Object.keys(s).filter(k => typeof s[k] !== 'function').join(',') }))));
  console.log(JSON.stringify((ENS.parts || []).map(p => [p.part, p.staff || null])));
  console.log(JSON.stringify(HALVES));
  process.exit(0);
}
if (arg('groupBands') != null) {   // [§469] each group's band at x1, then stop
  console.log(JSON.stringify(Object.fromEntries(Object.entries(HALVES || {}).filter(([, h]) => h.band).map(([n, h]) => [n, Math.round(h.band / Z)]))));
  process.exit(0);
}
function cropHalf(px, h) {
  const rowBytes = W * 4, MH = px.length / rowBytes, out = Buffer.alloc(H * rowBytes, 255);
  if (h.rows) {
    const put = (a, b, y) => { for (let r = a; r < b && r < MH; r++) { const q = y + r - a; if (q >= 0 && q < H) out.set(px.subarray(r * rowBytes, (r + 1) * rowBytes), q * rowBytes); } };
    put(h.rows[0], h.rows[1], h.at);
    // the gutter (clefs and names) keeps only the group's own: a neighbor's clef reaches further than its staff
    // [§469] several columns, the widest first: [{ x, rows }] — the names and the braces keep only the group's own; the clefs may keep more
    for (const gc of [].concat(h.gutter || [])) for (let y = h.at; y < h.at + h.rows[1] - h.rows[0] && y < H; y++) if (y < gc.rows[0] || y >= gc.rows[1]) out.fill(255, y * rowBytes, y * rowBytes + gc.x * 4);
    if (h.paste) put(h.paste[0], h.paste[1], h.pasteAt);
    return out;
  }
  for (let y = 0; y < H; y++) {
    const sy = h.y0 + y;
    if (sy < h.lo || sy >= h.hi || sy < 0 || sy >= MH) continue;
    out.set(px.subarray(sy * rowBytes, (sy + 1) * rowBytes), y * rowBytes);
    if (h.gutterRows && (sy < h.gutterRows[0] || sy >= h.gutterRows[1])) out.fill(255, y * rowBytes, y * rowBytes + h.gutterX * 4);
  }
  return out;
}

// ---------------------------------------------------------------- [2c.4] THE SCREEN PLAN, DUMPED
// ONE source for the geometry, as export_print's --planJson is for print: tools/check_screen_edges.js reads the pages, their
// windows and x mapping, the edge registry and the clamp report from HERE rather than re-deriving them, and measures the SVGs
// written by --screenHtml in Chrome. The pages are the film's own segments (the --view's), drawn by the film's own staticSvg.
if (screenJson) {
  const htmlOut = arg('screenHtml', null);
  const kindsInModel = [...new Set(model.systems.flatMap(s => (s.items || []).map(it => it.k)))].sort();
  const svgs = [];
  const out = {
    ir: irId, view: viewMode, tile: TILE, pageSeconds, srcStart: SRC0, srcEnd,
    edges: EDGES, edge: pageRules.edge || null,
    kinds: { point: Render.POINT_KINDS, long: Render.LONG_KINDS, furniture: Render.FURNITURE_KINDS, other: ['tuplet'] }, kindsInModel,
    pages: segments.map((seg, i) => {
      const rep = [];
      svgs.push(StaticPage.staticPageSvg({ model, view: seg.view, glyphs, C, srcEnd, reshow: seg.reshow, ownsEnd: seg.ownsEnd,
        ensemble: ENS, screenEdges: seg.screenEdges, edgeReport: rep }));
      const v = seg.view;
      return { n: i + 1, t0: seg.t0, t1: seg.t1, w0: v.window[0], w1: v.window[1], x0: v.musicX0Px, x1: v.musicX1Px,
        pps: v.pxPerSecond, widthPx: v.widthPx, heightPx: v.heightPx, first: !!(seg.screenEdges && seg.screenEdges.first), ownsEnd: seg.ownsEnd, clamps: rep };
    }),
  };
  // [2e.2] THE FRAME PROBE (§410: the animated devices meet the edge on EVERY page, per frame): each page's overlay at its first and
  // last moment, t0 + ε and tω − ε, for check_screen_edges to measure — only when the table names the animated kinds
  const EPSF = 1 / 60;
  const frames = !ANIM_EDGE ? [] : segments.flatMap((seg, i) => [seg.t0 + EPSF, seg.t1 - EPSF].filter(t => t > seg.t0 && t < seg.t1).map(t =>
    ({ n: i + 1, t, x0: seg.view.musicX0Px, svg: overlaySvg(seg.view, t) })));
  if (LEAD) out.leadIn = LEAD;   // [2e.2] the dump names the lead-in and the frame probe only when they exist (absent = the dump as before)
  if (ANIM_EDGE) out.frames = frames.map(f => ({ n: f.n, t: f.t, x0: f.x0 }));
  fs.writeFileSync(screenJson, JSON.stringify(out, null, 1));
  if (htmlOut) fs.writeFileSync(htmlOut, '<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}.page{display:block}' +
    '@font-face{font-family:"Crimson Pro Light";src:url("' + ('file:///' + FONTS[0].split(path.sep).join('/')) + '")}</style></head><body>\n' +
    svgs.map((s, i) => '<div class="page" data-n="' + (i + 1) + '">' + s + '</div>').join('\n') +
    frames.map(f => '\n<div class="frame" data-n="' + f.n + '" data-t="' + f.t + '" data-x0="' + f.x0 + '">' + f.svg + '</div>').join('') + '\n</body></html>');
  console.log('screen plan -> ' + screenJson + '  (' + out.pages.length + ' ' + viewMode + ' pages' + (TILE ? ', tiled' : ', planned') + ')' + (htmlOut ? '  + ' + htmlOut : ''));
  process.exit(0);
}

// ---------------------------------------------------------------- dump mode
// 2.4's evidence: write ONE page's static SVG so it can be rasterized and
// diffed against the same page pulled out of the running app. A pixel match
// is the proof that this Node path and the app draw the same picture.
if (dumpPage != null) {
  const i = parseInt(dumpPage, 10);
  const out = arg('dumpTo', path.join(probeDir, irId + '-page' + i + '.svg'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  // [the Switch~ piece §502] --frameAt T: the page WITH its moving layer at T (the ball, the pebbles in flight) — an instructions image of the motion
  let dumped = staticSvg(i);
  if (arg('frameAt') != null) { const sg = segments[i], ov = overlaySvg(sg.view, +arg('frameAt'), furnitureOf(sg.view, viewMode === 'zoom')); dumped = dumped.replace(/<\/svg>\s*$/, ov.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') + '</svg>'); }
  fs.writeFileSync(out, dumped);
  const seg = segments[i];
  console.log('segment ' + i + '  window ' + seg.view.window[0].toFixed(2) + '–' + seg.view.window[1].toFixed(2) +
    ' s  held ' + seg.t0.toFixed(2) + '–' + seg.t1.toFixed(2) + ' s  reshow ' + (seg.reshow ? seg.reshow.length : 0) +
    '  ownsEnd ' + seg.ownsEnd + '  -> ' + out);
  process.exit(0);
}

// ---------------------------------------------------------------- probe mode
if (probes.length) {
  fs.mkdirSync(probeDir, { recursive: true });
  let PNG = null;
  try { PNG = require('pngjs').PNG; } catch (e) { PNG = null; }
  for (const t of probes) {
    const half = arg('half');   // [2i.10.2] --half V-TOP|V-BOT: probe a close-up as the cut draws it
    const rgba = half ? srcBuf(half, t) : frameRGBA(t);
    const name = irId + '_' + (half || viewMode) + '_t' + t.toFixed(3).replace('.', '-');
    if (PNG) {
      const p = new PNG({ width: W, height: !half && viewMode === 'zoom' ? Math.round(H * Z) : H });
      rgba.copy(p.data);
      fs.writeFileSync(path.join(probeDir, name + '.png'), PNG.sync.write(p));
    } else {
      fs.writeFileSync(path.join(probeDir, name + '.rgba'), rgba);
    }
    console.log('probe t=' + t.toFixed(3) + '  page ' + segAt(t) + '  -> ' + name + (PNG ? '.png' : '.rgba'));
  }
  console.log(pageRasters + ' page raster(s)');
  process.exit(0);
}

// ---------------------------------------------------------------- the cut
// PHASE 4. The plan said "assemble by frame index from the FINISHED renders",
// which was a cost assumption from when a render was thought to take hours.
// It takes six minutes, so the cut is RENDERED, not spliced: every frame is
// first-generation. Splicing would have made the close-ups THIRD generation
// (V-TOP/V-BOT are already a re-encode of the zoom master), and a 19-branch
// trim/concat filtergraph buffers gigabytes waiting for its turn.
// Nothing about the CONTENT changes — same cut list, same frame indices, same
// master WAV laid under it untouched, so V-CUT still cannot drift.
let cutMap = null;   // frame index -> 'V-MAIN' | 'V-TOP' | 'V-BOT'
const cutPath = arg('cut');
if (cutPath) {
  const cl = JSON.parse(fs.readFileSync(path.isAbsolute(cutPath) ? cutPath : path.join(ROOT, cutPath), 'utf8'));
  if (cl.fps !== fps) console.log('  !! cut list is ' + cl.fps + ' fps and this render is ' + fps);
  cutMap = cl.timeline.slice();
  for (let i = 1; i < cutMap.length; i++) {
    if (cutMap[i].f0 !== cutMap[i - 1].f1) throw new Error('cut list is not contiguous at entry ' + i);
  }
}

const t0 = tStart != null ? tStart : (LEAD ? SRC0 : 0);   // [2e.2] a full render opens at the lead-in
const t1 = tEnd != null ? tEnd : pieceEnd;
const nFrames = Math.round((t1 - t0) * fps);
const outH = cutMap ? H : (viewMode === 'zoom' ? H * Z : H);

if (cutMap) {
  // The cut list was built against the material end (751.92 s); this render
  // runs to the page sweep's end. Rather than leave the tail unassigned, the
  // FINAL entry is extended — it is a wide V-MAIN shot, and D5's shape is
  // "closes wide so the final crescendo stays on the full ensemble".
  // Compare against the ABSOLUTE end frame, not nFrames: for a partial render
  // (--t0 88 --t1 95) nFrames is 210 and extending the last segment to 210 would
  // destroy the map. Both branches are about the FULL timeline.
  const endFrame = Math.round(t1 * fps);
  const last = cutMap[cutMap.length - 1];
  if (last.f1 < endFrame) {
    console.log('  cut list ends at frame ' + last.f1 + ', render ends at ' + endFrame + ' — extending the final ' +
      last.src + ' segment by ' + (endFrame - last.f1) + ' frames (' + ((endFrame - last.f1) / fps).toFixed(2) + ' s)');
    last.f1 = endFrame;
  } else if (last.f1 > endFrame) {
    console.log('  cut list runs past the render end (' + last.f1 + ' > ' + endFrame + ') — the tail is simply not reached');
  }
}
let cutIdx = 0;
function srcAtFrame(k) {
  while (cutIdx < cutMap.length - 1 && k >= cutMap[cutIdx].f1) cutIdx++;
  while (cutIdx > 0 && k < cutMap[cutIdx].f0) cutIdx--;
  return cutMap[cutIdx].src;
}

// ---------------------------------------------------------------- the fade
// W2 (composer, day 36): "some very quick and subtle transitions when they cut
// to the zoomed part. Maybe a short fade." PHASE 4.3 built hard cuts and said
// "crossfades only if asked" — this IS the ask, so it adds a decision rather
// than overturning one.
//
// THE TRAP, named in the plan: a dissolve must NOT change the frame count, or
// PHASE 5's duration equality breaks. So it blends ACROSS the existing
// boundary — the window is CENTRED on the cut frame, [f - n/2, f + n/2) — and
// no frame is ever inserted or dropped. Both ends of every close-up get one:
// an asymmetric fade reads as a mistake.
//
// Frame 0 is the start of the film, not a cut, and the extended final segment
// is not one either, so only the interior boundaries dissolve.
const blends = [];
if (cutMap && fadeFrames > 0) {
  const half = fadeFrames / 2;
  for (let i = 1; i < cutMap.length; i++) {
    const f = cutMap[i].f0;
    // never spill past a neighbouring cut, and never before the first frame
    const a = Math.max(Math.round(f - half), cutMap[i - 1].f0, 0);
    const b = Math.min(Math.round(f + half), cutMap[i].f1);
    if (b - a >= 2) blends.push({ a: a, b: b, f: f, from: cutMap[i - 1].src, to: cutMap[i].src });
  }
}
let blendIdx = 0;
function blendAt(k) {
  while (blendIdx < blends.length && k >= blends[blendIdx].b) blendIdx++;
  while (blendIdx > 0 && k < blends[blendIdx - 1].b) blendIdx--;
  const w = blends[blendIdx];
  return (w && k >= w.a && k < w.b) ? w : null;
}
function srcBuf(src, t) {
  if (src === 'V-MAIN') return frameRGBA(t, 'video');
  const full = frameRGBA(t, 'zoom', HALVES && HALVES[src] && HALVES[src].keep);
  if (HALVES && !HALVES[src]) throw new Error('video-cut half ' + src + ' names no drawn part');
  return HALVES ? cropHalf(full, HALVES[src]) : cropRows(full, src === 'V-BOT' ? H : 0, H);   // the tuba: the y=1080 gap, measured
}
// linear cross-dissolve; w is the weight of B. Both buffers are opaque RGBA, so
// the alpha bytes lerp 255->255 and stay 255. +0.5 rounds instead of truncating,
// which would bias every dissolve fractionally dark.
function mix(A, B, w) {
  const out = Buffer.allocUnsafe(A.length), v = 1 - w;
  for (let i = 0; i < out.length; i++) out[i] = A[i] * v + B[i] * w + 0.5;
  return out;
}
// DIP, and why it is the default. A cross-dissolve superimposes the two sources,
// and here they are THE SAME NOTATION AT TWO SCALES — so the mid-dissolve frame
// carries two complete sets of staff lines and, worst of all, TWO CURSORS, since
// the wide and zoomed playheads sit at different x. Measured on the first
// boundary (f=2740) before any full render: it reads as a double exposure, not a
// transition. Dipping through paper instead shows only ONE source at a time, so
// nothing ever doubles — the ink falls away and the new scale rises out of it.
// It is also cheaper: one source per frame instead of two.
//
// The dip never reaches blank paper. Over an 8-frame window the deepest frame
// sits at 0.875, so the notation thins to about an eighth of its ink and comes
// back; there is no white flash.
function toward(buf, wht) {
  const out = Buffer.allocUnsafe(buf.length), v = 1 - wht, add = 255 * wht;
  for (let i = 0; i < out.length; i++) out[i] = buf[i] * v + add + 0.5;
  return out;
}
function cutFrame(k, t) {
  // ABSOLUTE frame index — the cut list is indexed from t=0, while k counts from
  // --t0. They are the same only for a full render; a partial one would take its
  // sources from the wrong segments entirely. The blend windows are in the same
  // absolute frames, so a partial render of one boundary transitions identically.
  const kAbs = Math.round(t * fps);
  const w = blendAt(kAbs);
  if (!w) return srcBuf(srcAtFrame(kAbs), t);
  if (fadeMode === 'dip') {
    const half = Math.max(w.f - w.a, w.b - w.f);
    const d = 1 - Math.abs(kAbs + 0.5 - w.f) / half;
    // strictly one source per frame: the outgoing shot up to the cut, the
    // incoming shot from the cut on. Nothing is ever superimposed.
    return toward(srcBuf(kAbs + 0.5 < w.f ? w.from : w.to, t), Math.max(0, d));
  }
  // alpha hits exactly 0.5 at the cut frame, so the boundary is the midpoint
  return mix(srcBuf(w.from, t), srcBuf(w.to, t), (kAbs - w.a + 0.5) / (w.b - w.a));
}
const ff = ['-y',
  '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', W + 'x' + outH, '-r', String(fps), '-i', 'pipe:0'];
// [2e.2] a film that opens before the piece's 0 (the lead-in) DELAYS its audio by the difference; a partial render from t0 >= 0 seeks it
// [RUNNING_LOG §696 — his 'sound is not synced' on the whole film] the delay is REAL SILENCE in the stream (adelay), not a timestamp offset: -itsoffset
// leaves the audio stream starting at 4 s (an MP4 edit list) and a player that ignores it starts the sound at 0 — four seconds early. Both
// streams now start at 0 in every player. (The partial renders seek with -ss and were always right — the test films.)
if (audio) ff.push(...(t0 < 0 ? [] : ['-ss', String(t0)]), '-i', audio, ...(t0 < 0 ? ['-af', 'adelay=' + Math.round(-t0 * 1000) + ':all=1'] : []), '-c:a', 'aac', '-b:a', '256k', '-shortest');
ff.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', outFile);

console.log('export_video: ' + irId + ' · ' + (cutMap ? 'CUT (' + cutMap.length + ' segments, ' + segsOf('zoom').length + ' zoom segs, ' + (fadeFrames > 0 ? blends.length + ' x ' + fadeFrames + '-frame ' + fadeMode : 'hard cuts') + ')' : viewMode + (viewMode === 'zoom' ? ' x' + Z : '')) +
  ' · ' + W + 'x' + outH + ' · ' + fps + ' fps');
console.log('  ' + pages.length + ' pages, ' + segments.length + ' turn segments, material ends ' + srcEnd + ' s');
console.log('  frames ' + nFrames + '  (' + t0.toFixed(2) + '–' + t1.toFixed(2) + ' s)');

const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'inherit', 'inherit'] });
proc.on('error', e => { console.error('ffmpeg failed to start: ' + e.message); process.exit(1); });
proc.stdin.on('error', () => { });   // ffmpeg may close early on --shortest

let k = 0;
const started = Date.now();
function pump() {
  while (k < nFrames) {
    const t = t0 + k / fps;
    const buf = cutMap ? cutFrame(k, t) : frameRGBA(t);
    k++;
    if (k % (fps * 30) === 0 || k === nFrames) {
      const el = (Date.now() - started) / 1000;
      console.log('  ' + k + '/' + nFrames + '  t=' + t.toFixed(1) + 's  ' +
        (k / el).toFixed(1) + ' fps  eta ' + (((nFrames - k) / (k / el)) / 60).toFixed(1) + ' min  ' +
        pageRasters + ' page rasters');
    }
    if (!proc.stdin.write(buf)) { proc.stdin.once('drain', pump); return; }
  }
  proc.stdin.end();
}
pump();
proc.on('close', code => {
  const el = (Date.now() - started) / 1000;
  console.log('done in ' + (el / 60).toFixed(1) + ' min · ' + (nFrames / el).toFixed(1) + ' fps · ' +
    pageRasters + ' page rasters for ' + nFrames + ' frames · ffmpeg exit ' + code);
});
