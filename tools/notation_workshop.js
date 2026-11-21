#!/usr/bin/env node
// notation_workshop.js — THE NOTATION WORKSHOP's own small server (the Switch~ piece RUNNING_LOG §269, his words 2026-11-20: "can we build
// a notation workshop for this, just the piano staff, if I can have a zoom so spaces between noteheads will shrink/grow, and a playback speed
// slider and then I'll take a phrase at a time and at the zoom level for the videos" · "yes sideways stretch, and can I set loop points too").
//
//   node C:\Users\jwloy\GitHub\switch_2026\tools\notation_workshop.js        → http://localhost:5650/
//
// It LOOKS and LISTENS only: the figures are still taken in the chat and kept in notation/hand/<page>.units.json. The page it shows is the
// notation app's own — the same layout of the whole ensemble (so every fit decision is the score's), cut to the piano's band by the SVG's
// viewBox. THE SIDEWAYS STRETCH is the view's window: how many seconds stand across the width; the heads keep their size.
//
// Routes: GET /            the page (workshop/notation/index.html)
//         GET /view?page=&t0=&span=&w=    { svg, x0, pps, band:[y,h], w, window:[a,b] } — the piano band of that window, w px wide
//         GET /audio       the piano solo's sound (a 16-bit cut of the players' render, made once; Range) — its second 0 is score time A0
//         GET /info        { a0, a1, pages, window }
//         POST /clip       { page, t0, span, w, k, a, b, rate, loops, gap } → a film of what the page shows; { file, url }
//         GET /clips/…     the films (notation/video/clips/)
// The engine is re-read when the page's IR or the notation code changes on disk — no restart after a figure is taken.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { spawn, spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'workshop', 'notation');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const PORT = +(process.env.PORT || arg('port', 5650));
const PART = +arg('part', 5);                                   // the piano's lane
const PAGES = arg('pages', 's2-piano-solo,s2-piano-solo-played,s2-piano-solo-heads,gravity-proto,gravity-proto-strobe,gravity-proto-strip,burst,chords-few,chords-some,chords-many,chords-sets,both-between,both-inner,both-across').split(',');
const SRC_AUDIO = path.join(ROOT, arg('audio', 'notation/audio/piece-Section03-H-addTuplets.wav'));   // the players' render; its piano solo is the first draft's, note for note (§266)
const A0 = +arg('a0', 146), A1 = +arg('a1', 258);               // the cut's span in score time
const CUT = path.join(ROOT, 'notation', 'audio', 'cuts', 'workshop-piano-' + A0 + '-' + A1 + '.wav');
const CLIPS = path.join(ROOT, 'notation', 'video', 'clips');
const BAND = arg('band', '546,204').split(',').map(Number);     // the piano's band in the 1080 frame: top, height (stems and beams inside)
const send = (res, code, body, type) => { res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(body); };
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

// ---------------------------------------------------------------- the engine, re-read when its files change
const WATCH = ['notation/lib/layout.js', 'notation/lib/render.js', 'notation/lib/static_page.js', 'notation/lib/coords.js', 'notation/lib/chord_column.js',
  'notation/lib/glyphs.json', 'notation/registry/rules.json', 'notation/registry/container.json', 'notation/registry/ensemble.json', 'notation/registry/techniques.json'];
// [§273] THE PROTOTYPE PAGE (bank/gravity_proto.json): one hand's notes of one window, read from another page's IR
const PROTO = 'gravity-proto', protoOf = () => rd('bank/gravity_proto.json');
// [§290] AN EXCERPT PAGE ('burst', bank/burst_proto.json): only the notes each hand plays inside its own span, both staves
const EXCERPTS = { burst: 'bank/burst_proto.json', 'chords-few': 'bank/chord_changes.json', 'chords-some': 'bank/chord_changes.json', 'chords-many': 'bank/chord_changes.json', chords: 'bank/chord_changes.json', 'chords-sets': 'bank/chord_changes.json', both: 'bank/gravity_both.json', 'both-between': 'bank/gravity_both.json', 'both-inner': 'bank/gravity_both.json', 'both-across': 'bank/gravity_both.json' };
const stampOf = page => WATCH.concat(EXCERPTS[page] ? [EXCERPTS[page], 'notation/ir/' + rd(EXCERPTS[page]).page + '.ir.json'] : page.startsWith(PROTO) ? ['bank/gravity_proto.json', 'notation/ir/' + protoOf().page + '.ir.json'] : ['notation/ir/' + page + '.ir.json']).map(f => { try { return fs.statSync(path.join(ROOT, f)).mtimeMs; } catch (e) { return 0; } }).join('|');
const ENG = new Map();
function engine(page) {
  if (!PAGES.includes(page)) throw new Error('no such page: ' + page);
  const stamp = stampOf(page), have = ENG.get(page);
  if (have && have.stamp === stamp) return have;
  for (const k of Object.keys(require.cache)) if (k.includes(path.sep + 'notation' + path.sep)) delete require.cache[k];
  const lib = n => require(path.join(ROOT, 'notation', 'lib', n));
  const Coords = lib('coords.js'), Layout = lib('layout.js'), StaticPage = lib('static_page.js'), Fit = lib('fit.js');
  const glyphs = rd('notation/lib/glyphs.json'), C = lib('rules.js').loadContainer(ROOT), ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json');
  let ir, proto = null, chords = null, both = null, keepNone = false, strikeSpan = null;   // strikeSpan: the strike's first and last note, kept though its notes are not drawn (§300)
  if (page.startsWith(PROTO)) {
    proto = protoOf(); proto.flow = Object.assign({}, proto.flow, { style: page === PROTO ? ((proto.flow || {}).style || 'ribbon') : page.slice(PROTO.length + 1) });   // [§282] the page's name says how the inner movement is drawn
    ir = rd('notation/ir/' + proto.page + '.ir.json');
    const staff = new Map(); for (const o of ir.overlays || []) if (o.kind === 'engraving' && o.target && o.target.event && o.value) staff.set(o.target.event, o.value.staff || 0);
    const want = proto.hand === 'L' ? 1 : 0, keep = new Set(ir.events.filter(ev => (staff.get(ev.id) || 0) === want && ev.onset >= proto.window[0] && ev.onset <= proto.window[1]).map(ev => ev.id));
    // [§301 — his "put in the proper chord changes in there, even if they were going to be shown earlier"] pitchSets: the shapes on this page are
    // each hand's PITCH SETS (§294, bank/chord_changes.json) — both hands, on their own staves — not the one hand's two shapes of §276
    if (proto.pitchSets) { const cc = rd('bank/chord_changes.json'); proto.noShapes = true; proto._sets = cc.sets; proto._hands = { R: [], L: [] };
      for (const ev of ir.events) if (ev.onset >= cc.window[0] && ev.onset <= cc.window[1]) proto._hands[(staff.get(ev.id) || 0) === 1 ? 'L' : 'R'].push({ t: ev.onset, midi: ev.pitch.midi, sp: ev.pitch.spelled }); }
    proto._played = ir.events.filter(ev => keep.has(ev.id));   // the hand's notes of the window, whole — the flow and the shapes are read from these
    // [§279 — his "take out the ref noteheads"] refHeads false: the arc's own played notes are not drawn (the lead-in and lead-out notes stay)
    if (proto.refHeads === false) for (const id of [].concat(proto.in || [], proto.impact || [], proto.out || [])) keep.delete('ev-' + id);
    if (proto.leadHeads === false) keep.clear();
    // [§291 — his "can you put them in just after, just the burst ones, just after the ribbon"] also: the notes of proto.also (each hand's own span),
    // as plain heads on their own staves — the burst that follows the flow, both hands
    if (proto.also) for (const ev of ir.events) { const wnd = proto.also[(staff.get(ev.id) || 0) === 1 ? 'L' : 'R']; if (wnd && ev.onset >= wnd[0] && ev.onset <= wnd[1]) { strikeSpan = strikeSpan ? [Math.min(strikeSpan[0], ev.onset), Math.max(strikeSpan[1], ev.onset)] : [ev.onset, ev.onset]; if (proto.alsoHeads !== false) keep.add(ev.id); } }   // [§280 — his "take out the lead in and lead out notes too"] no played note is drawn at all
    ir.events = ir.events.filter(ev => keep.has(ev.id));
    ir.overlays = (ir.overlays || []).filter(o => !(o.target && o.target.event) || keep.has(o.target.event));
    ir.chunks = (ir.chunks || []).map(c => Object.assign({}, c, { events: (c.events || []).filter(id => keep.has(id)) })).filter(c => c.events.length);
  } else if (EXCERPTS[page]) {
    const ex = rd(EXCERPTS[page]); ir = rd('notation/ir/' + ex.page + '.ir.json');
    const staff = new Map(); for (const o of ir.overlays || []) if (o.kind === 'engraving' && o.target && o.target.event && o.value) staff.set(o.target.event, o.value.staff || 0);
    const inSpan = ev => { const w = ex.hands ? ex.hands[(staff.get(ev.id) || 0) === 1 ? 'L' : 'R'] : ex.window; return !!w && ev.onset >= w[0] && ev.onset <= w[1]; };
    // [§293] the chord-change pages: the same notes, read per hand for the shapes (tools/chord_changes.js); the page's name carries the alternative
    if (page.startsWith('chords-')) chords = { cfg: ex, span: ex.spans[page.slice(7)], sets: page === 'chords-sets', hands: { R: [], L: [] } };
    // [§295] ONE GESTURE FOR BOTH HANDS (bank/gravity_both.json): the notes of the gesture (both hands, for its busyness), each hand's notes of
    // the longer stretch (for its pitch sets), and NO played note drawn
    // [§300 — his "you can remove those notes out of there"] the strike's notes give the curtain its place and are not drawn (curtain.heads false)
    if (page === 'burst') { const on = ir.events.filter(inSpan).map(ev => ev.onset); if (on.length) strikeSpan = [Math.min(...on), Math.max(...on)]; if (ex.curtain && ex.curtain.heads === false) keepNone = true; }
    if (page.startsWith('both-')) {
      const cc = rd('bank/chord_changes.json'), handOf = ev => (staff.get(ev.id) || 0) === 1 ? 'L' : 'R';
      both = { cfg: ex, lane: ex.lanes[page.slice(5)], sets: cc.sets, played: ir.events.filter(inSpan).map(ev => ({ id: ev.id, onset: ev.onset, vel: ev.vel, pitch: ev.pitch })), hands: { R: [], L: [] } };
      for (const ev of ir.events) if (ev.onset >= cc.window[0] && ev.onset <= cc.window[1]) both.hands[handOf(ev)].push({ t: ev.onset, midi: ev.pitch.midi, sp: ev.pitch.spelled });
      keepNone = true;
    }
    if (chords) for (const ev of ir.events) if (inSpan(ev)) chords.hands[(staff.get(ev.id) || 0) === 1 ? 'L' : 'R'].push({ t: ev.onset, midi: ev.pitch.midi, sp: ev.pitch.spelled });
    const keep = new Set(keepNone ? [] : ir.events.filter(inSpan).map(ev => ev.id));
    ir.events = ir.events.filter(ev => keep.has(ev.id));
    ir.overlays = (ir.overlays || []).filter(o => !(o.target && o.target.event) || keep.has(o.target.event));
    ir.chunks = (ir.chunks || []).map(c => Object.assign({}, c, { events: (c.events || []).filter(id => keep.has(id)) })).filter(c => c.events.length);
  } else ir = rd('notation/ir/' + page + '.ir.json');
  // the frame is the notation app's and the film's (tools/export_video.js): every part, 1080 high — only the picture is cut to the piano
  const ENS = Layout.ensembleFor(ens, (C.realizations || {})['video-jury']);
  const ensPart = p => (ENS && ENS.parts.find(q => q.part === p)) || null;
  const PARTS = ENS ? ENS.parts.map(p => p.part) : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const model = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: PARTS, ensemble: ENS, techniques: T, fitBoxes: Fit.boxesFor(C, ENS, PARTS) }, (C.engraving && C.engraving.layout) || {},
    chords ? { ottavaLedgerThreshold: 1e6 } : {}));   // [§294] the chord pages: no 8va folding — the faint heads at pitch, as the shapes are
  const rz = (C.realizations || {})['video-jury'] || {}, H = (C.frame && C.frame.heightPx) || 1080;
  const FRAME = Coords.ensembleFrame(PARTS, { heightPx: H, lanes: rz.lanes || { padTopPx: 8, padBotPx: 8, gapPx: 4 }, staffHeightPx: (C.staff && C.staff.staffHeightPx) || 31.6,
    grandStaff: ((C.engraving || {}).layout || {}).grandStaff, weightOf: ENS ? (p => (ensPart(p) && ensPart(p).weight) || 1) : undefined,
    stavesOf: p => (ensPart(p) && ensPart(p).staves && ensPart(p).staves.length) || 1, ensemble: ENS });
  const LO = (C.engraving && C.engraving.layout) || {};
  const e = { stamp, Coords, StaticPage, glyphs, C, ENS, ir, model, H, FRAME, EDGES: Coords.edgesOf(C), band: (proto && proto.band) || BAND,
    chords, both, strikeSpan, Gc: lib('gc.js'), ChordColumn: lib('chord_column.js'), gaps: { toHead: LO.accGapColumn != null ? LO.accGapColumn : 0.1, between: (LO.chordColumn && LO.chordColumn.minLateralGap) || 0.1 },
    proto: proto && Object.assign({}, proto, { preset: (C.animated && C.animated.gc && C.animated.gc.preset) || lib('gc.js').DEFAULT_PRESET, look: lib('gc.js').LOOK }) };
  ENG.set(page, e);
  return e;
}
function viewOf(page, t0, span, w, opts) {
  opts = opts || {};
  const e = engine(page);
  const view = e.Coords.makeView(Object.assign({ widthPx: w, heightPx: e.H, window: [t0, t0 + span], systems: e.FRAME.systems, ssPerSystem: e.FRAME.ssPerSystem }, e.EDGES));
  const srcEnd = e.ir.source.window[1];
  let svg = e.StaticPage.staticPageSvg({ model: e.model, view, glyphs: e.glyphs, C: e.C, srcEnd, reshow: 0, ownsEnd: t0 + span >= srcEnd - 1e-9, ensemble: e.ENS, edgeBar: false });
  // the piano's band only: the SVG keeps its own coordinates, the viewBox cuts the picture
  // [§272] the two staves' top and bottom lines (the frame's own y), read from the piano's system — for the gravity marks drawn over the page
  const staves = [];
  { const re = new RegExp('<g class="sys sys-p' + PART + '"[^>]*>([\\s\\S]*?)</g>', 'g'); let m; const ys = [];
    while ((m = re.exec(svg))) { const rr = /<rect x="[\d.]+" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g; let q; while ((q = rr.exec(m[1]))) if (+q[3] < 1.5 && +q[2] > 100) ys.push(+q[1]); }
    ys.sort((a, b) => a - b);
    for (let i = 0; i + 4 < ys.length; i += 5) staves.push([ys[i], ys[i + 4]]); }
  const x0 = view.xOfSeconds(t0);
  // [§274] the prototype's lighter heads, in the picture itself (so the film has them too): every glyph stamp right of the music's start
  let protoOut;
  if (e.proto) {
    const op = e.proto.headOpacity;
    if (op > 0 && op < 1) svg = svg.replace(/<g transform="translate\(([\d.]+) /g, (m, x) => +x > x0 - 4 ? '<g opacity="' + op + '" transform="translate(' + x + ' ' : m);
    protoOut = Object.assign({}, e.proto, { headOpacity: 1, arcBand: e.band, _played: undefined, _hands: undefined, _sets: undefined });
  }
  // [§293] THE CHORD-CHANGE PAGES: the played notes faint, each hand's shapes boxed on its own staff where they begin
  let chordsOut;
  if (e.chords && staves.length) {
    const op = e.chords.cfg.headOpacity, pps = (view.xOfSeconds(t0 + span) - x0) / span, xOf = s => x0 + (s - t0) * pps;
    if (op > 0 && op < 1) svg = svg.replace(/<g transform="translate\(([\d.]+) /g, (m, x) => +x > x0 - 4 ? '<g opacity="' + op + '" transform="translate(' + x + ' ' : m);
    delete require.cache[require.resolve('./chord_changes.js')];
    const CC = require('./chord_changes.js'); chordsOut = { span: e.chords.span, hands: {} };
    let add = '';
    for (const h of ['R', 'L']) { const all = e.chords.sets ? CC.persistent(e.chords.hands[h], e.chords.cfg.sets) : CC.segment(e.chords.hands[h], e.chords.span), shapes = all.filter(s => !s.brief);
      if (e.chords.sets) chordsOut.brief = (chordsOut.brief || []).concat(all.filter(s => s.brief).map(s => ({ hand: h, at: +s.at.toFixed(3), notes: s.set.length }))); add += CC.draw({ shapes, xOf, staff: h === 'R' ? staves[0] : staves[staves.length - 1], glyphs: e.glyphs, ChordColumn: e.ChordColumn, gaps: e.gaps });
      chordsOut.hands[h] = shapes.map(s => ({ at: +s.at.toFixed(3), pitches: s.set.length, cluster: s.cluster, pushed: s.pushed })); }
    svg = svg.replace(/<\/svg>\s*$/, add + '</svg>');
  }
  // [§295] ONE GESTURE FOR BOTH HANDS: the ribbon in its lane (the page's name says which), each hand's shapes on its own staff
  if (e.both && staves.length) {
    const B = e.both, A = B.cfg.arc, pps = (view.xOfSeconds(t0 + span) - x0) / span, xOf = s => x0 + (s - t0) * pps, ids = f => B.played.filter(f).map(p => p.id.replace(/^ev-/, ''));
    const preset = (e.C.animated && e.C.animated.gc && e.C.animated.gc.preset) || e.Gc.DEFAULT_PRESET, look = e.Gc.LOOK;
    const P = { band: B.cfg.band, arcBand: B.lane.arcBand, coverFrom: B.cfg.coverFrom, arc: A, noShapes: true, flow: Object.assign({}, B.cfg.flow, { ribbonMaxPx: B.lane.ribbonMaxPx }),
      in: ids(p => p.onset < A.bounce - 0.03), impact: ids(p => Math.abs(p.onset - A.bounce) <= 0.03), out: ids(p => p.onset > A.bounce + 0.03) };
    delete require.cache[require.resolve('./gravity_furniture.js')]; delete require.cache[require.resolve('./chord_changes.js')];
    const f = require('./gravity_furniture.js')({ proto: P, ir: { events: B.played }, glyphs: e.glyphs, ChordColumn: e.ChordColumn, Gc: e.Gc, xOf, staff: staves[staves.length - 1], w, preset, look, gaps: e.gaps });
    // each hand's pitch sets (§294): the one in use at the gesture's start is SAID there; a change inside the gesture stands at its own moment
    const CC = require('./chord_changes.js'); let add = f.svg; const said = {};
    for (const h of ['R', 'L']) {
      const all = CC.persistent(B.hands[h], B.sets).filter(s => !s.brief), cur = all.filter(s => s.at <= A.t0).pop(), inside = all.filter(s => s.at > A.t0 && s.at <= A.t1);
      const shapes = (cur ? [Object.assign({}, cur, { at: A.t0 })] : []).concat(inside);
      add += CC.draw({ shapes, xOf, staff: h === 'R' ? staves[0] : staves[staves.length - 1], glyphs: e.glyphs, ChordColumn: e.ChordColumn, gaps: e.gaps });
      said[h] = shapes.map(s => +s.at.toFixed(3));
    }
    svg = svg.replace(/<\/svg>\s*$/, add + '</svg>');
    protoOut = { arc: A, preset, look, flow: P.flow, arcY: f.arcY, ribbon: f.ribbon, headOpacity: 1, shapesAt: said };
    e.bandOut = B.cfg.band;
  }
  // [§296] THE SCATTERED STRIKE's CURTAIN (the page 'burst'): a transparent block over the stretch where the strike's notes fall, at least
  // minSs wide, over the whole grand staff; the pebbles that rise and drop in it are the page's animation — their places are given here
  let strike;
  if ((page === 'burst' || (e.proto && e.proto.curtain)) && staves.length && e.strikeSpan) {   // [§297] also on the prototype page: the curtain over its third part, the burst's notes
    const ex = page === 'burst' ? rd(EXCERPTS.burst) : e.proto, K = Object.assign({ minSs: 6, padSs: 0.8, overSs: 3, pebbles: 11, prepS: 0.605, fallS: 0.38 }, ex.curtain || {});
    const pps = (view.xOfSeconds(t0 + span) - x0) / span, xOf = s => x0 + (s - t0) * pps, ss = (staves[0][1] - staves[0][0]) / 4;
    const a = e.strikeSpan[0], b = e.strikeSpan[1];
    const xa = xOf(a) - K.padSs * ss, xb = Math.max(xOf(b) + (K.padSs + 1.1) * ss, xa + K.minSs * ss), yT = staves[0][0] - K.overSs * ss, yB = staves[staves.length - 1][1] + K.overSs * ss;
    svg = svg.replace(/<\/svg>\s*$/, '<rect x="' + xa.toFixed(1) + '" y="' + yT.toFixed(1) + '" width="' + (xb - xa).toFixed(1) + '" height="' + (yB - yT).toFixed(1) + '" fill="' + (K.fill || '#5b7fa6') + '" fill-opacity="' + (K.opacity != null ? K.opacity : 0.13) + '" stroke="' + (K.fill || '#5b7fa6') + '" stroke-opacity="0.45" stroke-width="0.6"/></svg>');
    // [§299 — HIS WORD: "nail the physics of exactly as I described, throwing a handful of pebbles into the air … they sort of hang … there's a
    // clear impact point, but it'll be a little bit scattered"] THE THROW IS A REAL ONE: each pebble flies a PARABOLA (what gravity alone
    // gives a thrown thing: height = H · 4u(1 − u) over its flight) — fast off the hand, slowing to a hang at the top, falling faster and
    // faster. A handful leaves ONE hand at ONE moment with nearly one speed: each pebble's flight time differs from the others' by a few
    // per cent (flightSpread), so they land nearly together, a little scattered in time and across the floor; each then takes one small
    // bounce (bounce = how much of its speed it keeps) and lies still. THE IMPACT — the handful's landing — is the moment the cursor
    // reaches the MIDDLE of the curtain; the throw begins one flight time before it. The pebbles are synthesi-alpha's species (§298).
    delete require.cache[require.resolve('./substrate.js')];
    const SUB = require('./substrate.js'), species = SUB.species.includes(opts.sub) ? opts.sub : (K.species || 'boulders'), nR = Math.max(3, Math.min(400, Math.round(opts.n || K.density || 16)));
    const R = SUB.rng(23), gauss = () => { let u = 0; while (u === 0) u = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * R()); };
    const floor = yB - 5, H = (floor - yT) - 10, xm = (xa + xb) / 2, T = K.flightS != null ? K.flightS : 1.0, sp = K.flightSpread != null ? K.flightSpread : 0.05, rocks = [];
    for (let i = 0; i < nR; i++) {
      const k = Math.max(0.8, 1 + gauss() * sp), r = (K.sizePx != null ? K.sizePx : 2.6) * (0.7 + R() * 0.75);
      rocks.push({ d: SUB.shape(species, r, 3000 + i), r: +r.toFixed(2), T: +(T * k).toFixed(3), H: +(H * Math.min(1, k * k * 0.9)).toFixed(1), dly: +((R() - 0.5) * 0.03).toFixed(3),
        xh: +Math.max(xa + 5, Math.min(xb - 5, xm + gauss() * (xb - xa) * (K.pileSpread != null ? K.pileSpread : 0.1))).toFixed(1),   /* [§302] the handful at rest: spread along the floor, not one clump */ yh: +(R() * 6).toFixed(1), xl: +Math.max(xa + 5, Math.min(xb - 5, xm + gauss() * (xb - xa) * (K.landSpread != null ? K.landSpread : 0.17))).toFixed(1),
        spin: +((R() - 0.5) * 900).toFixed(0), gray: Math.round(17 + R() * 50) });
    }
    strike = { t0: a, t1: b, xa, xb, yT, yB, floor, species, stroked: !!SUB.stroked[species], impact: +(t0 + (xm - x0) / pps).toFixed(3), flightS: T, bounce: K.bounce != null ? K.bounce : 0.28, rocks, all: SUB.species };
  }
  // [§276] THE PROTOTYPE'S FURNITURE — the arc, the flow strip under the staff, the shapes (tools/gravity_furniture.js) — in the picture itself
  let band = e.bandOut || e.band;
  if (e.proto && staves.length) {
    delete require.cache[require.resolve('./gravity_furniture.js')];
    const pps = (view.xOfSeconds(t0 + span) - x0) / span;
    const f = require('./gravity_furniture.js')({ proto: e.proto, ir: { events: e.proto._played || e.ir.events }, glyphs: e.glyphs, ChordColumn: e.ChordColumn, Gc: e.Gc, xOf: s => x0 + (s - t0) * pps, staff: staves[staves.length - 1], w, preset: e.proto.preset, look: e.proto.look, gaps: e.gaps });
    svg = svg.replace(/<\/svg>\s*$/, f.svg + '</svg>');
    if (e.proto.pitchSets) {
      // the set each hand is using when the ribbon begins is SAID there, though it began earlier; a change later on the page stands at its own moment
      delete require.cache[require.resolve('./chord_changes.js')];
      const CC = require('./chord_changes.js'), A = e.proto.arc, xOf2 = s => x0 + (s - t0) * pps, said = {}; let addSets = '';
      for (const h of ['R', 'L']) {
        const all = CC.persistent(e.proto._hands[h], e.proto._sets).filter(s => !s.brief), cur = all.filter(s => s.at <= A.t0).pop(), later = all.filter(s => s.at > A.t0 && s.at <= e.proto.window[1]);
        const shapes = (cur ? [Object.assign({}, cur, { at: A.t0 })] : []).concat(later);
        addSets += CC.draw({ shapes, xOf: xOf2, staff: h === 'R' ? staves[0] : staves[staves.length - 1], glyphs: e.glyphs, ChordColumn: e.ChordColumn, gaps: e.gaps });
        said[h] = shapes.map(s => ({ at: +s.at.toFixed(3), from: s.set[0].midi, to: s.set[s.set.length - 1].midi }));
      }
      // [§305 — his "let's put in 29 there"] THE STUTTER, the prototype's middle part (proto.stutter): its keys written once as plain notes on
      // the hand's staff, then catalog sign 29 — the running shake marks GROWING: each mark taller and heavier than the one before, to the end
      if (e.proto.stutter) {
        const U = Object.assign({ stepSs: 2.1, half: [0.7, 2.3], width: [0.7, 2.2], gapSs: 0.9 }, e.proto.stutter), st = U.hand === 'L' ? staves[staves.length - 1] : staves[0], ss = (st[1] - st[0]) / 4;
        const keys = [...new Map(e.proto._hands[U.hand].filter(n => U.midis.includes(n.midi)).map(n => [n.midi, n])).values()].sort((p, q) => p.midi - q.midi), shp = [{ at: U.t0, set: keys }];
        if (keys.length) {
          addSets += CC.draw({ shapes: shp, xOf: xOf2, staff: st, glyphs: e.glyphs, ChordColumn: e.ChordColumn, gaps: e.gaps, box: false });
          const xA = shp[0].x1 + U.gapSs * ss, xB = xOf2(U.t1), yM = shp[0].yMid, n = Math.max(2, Math.floor((xB - xA) / (U.stepSs * ss)) + 1);
          for (let i = 0; i < n; i++) { const k = n > 1 ? i / (n - 1) : 1, x = xA + (xB - xA) * (n > 1 ? i / (n - 1) : 0), h = (U.half[0] + (U.half[1] - U.half[0]) * k) * ss, wd = U.width[0] + (U.width[1] - U.width[0]) * k;
            addSets += '<path d="M' + (x - 0.55 * ss).toFixed(1) + ' ' + (yM - h).toFixed(1) + ' Q' + (x + 0.45 * ss).toFixed(1) + ' ' + yM.toFixed(1) + ' ' + (x - 0.55 * ss).toFixed(1) + ' ' + (yM + h).toFixed(1) + '" fill="none" stroke="#111" stroke-width="' + wd.toFixed(2) + '" stroke-linecap="round"/>'; }
        }
      }
      svg = svg.replace(/<\/svg>\s*$/, () => addSets + '</svg>'); protoOut.sets = said;
    }
    band = [e.band[0], e.band[1] + f.extraH]; protoOut.shapes = f.shapes; protoOut.flags = f.flags; protoOut.arcY = f.arcY; protoOut.ribbon = f.ribbon;
  }
  svg = svg.replace(/^<svg([^>]*?) width="[\d.]+" height="[\d.]+" viewBox="[^"]*"/, '<svg$1 viewBox="0 ' + band[0] + ' ' + w + ' ' + band[1] + '" preserveAspectRatio="xMinYMin meet"');
  return { svg, staves, x0, pps: (view.xOfSeconds(t0 + span) - x0) / span, band, proto: protoOut, chords: chordsOut, strike, w, window: [t0, t0 + span], srcWindow: e.ir.source.window };
}

// ---------------------------------------------------------------- the sound: one cut, made once
function ensureCut() {
  if (fs.existsSync(CUT)) return true;
  if (!fs.existsSync(SRC_AUDIO)) return false;
  fs.mkdirSync(path.dirname(CUT), { recursive: true });
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(A0), '-t', String(A1 - A0), '-i', SRC_AUDIO, '-c:a', 'pcm_s16le', CUT]);
  return r.status === 0;
}
function sendFile(req, res, file, type) {
  let st; try { st = fs.statSync(file); } catch (e) { return send(res, 404, '{"error":"not found"}'); }
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (m) {
    const a = m[1] ? +m[1] : 0, b = m[2] ? Math.min(+m[2], st.size - 1) : st.size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': 'bytes ' + a + '-' + b + '/' + st.size, 'Accept-Ranges': 'bytes', 'Content-Length': b - a + 1 });
    return fs.createReadStream(file, { start: a, end: b }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': st.size });
  fs.createReadStream(file).pipe(res);
}

// ---------------------------------------------------------------- the film of what the page shows
const FONT_FILES = ['CrimsonPro-Light.ttf', 'CrimsonPro-LightItalic.ttf'].map(f => path.join(ROOT, 'notation', 'app', 'fonts', f)).concat(['C:/Windows/Fonts/seguisym.ttf']).filter(p => fs.existsSync(p));
const atempo = r => { const f = []; let x = r; while (x < 0.5) { f.push('atempo=0.5'); x /= 0.5; } while (x > 2) { f.push('atempo=2'); x /= 2; } f.push('atempo=' + x.toFixed(4)); return f.join(','); };
const ff = args => new Promise((ok, no) => { const p = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] }); let err = ''; p.stderr.on('data', d => { err += d; }); p.on('close', c => c === 0 ? ok() : no(new Error(err.slice(-400)))); });
// [§283 — his "a certian amount of the balls area should be visible outside the ribbon"] the ball's radius: the GC's own, or ballOverRibbon times
// the ribbon's half width where it rides plus 2 px, whichever is larger (the page computes the same)
function ballR(p, s) {
  const base = p.look.ballRadiusPx, rb = p.ribbon; if (!rb || !rb.length) return base;
  let h = rb[rb.length - 1][1]; for (let i = 1; i < rb.length; i++) if (s <= rb[i][0]) { const a = rb[i - 1], b = rb[i], u = b[0] > a[0] ? (s - a[0]) / (b[0] - a[0]) : 0; h = a[1] + (b[1] - a[1]) * Math.max(0, Math.min(1, u)); break; }
  return Math.max(base, ((p.flow && p.flow.ballOverRibbon) || 1.35) * h + 2);
}
async function makeClip(q) {
  const { Resvg } = require('@resvg/resvg-js');
  const page = q.page, t0 = +q.t0, span = +q.span, w = Math.round(+q.w), rate = Math.min(2, Math.max(0.2, +q.rate || 1));
  const a = Math.max(t0, +q.a), b = Math.min(t0 + span, +q.b);
  if (!(b > a)) throw new Error('the loop points must lie inside what the page shows');
  const loops = Math.max(1, Math.round(+q.loops || 1)), gap = Math.max(0, +q.gap || 0), fps = 30;
  const v = viewOf(page, t0, span, w);
  const outW = Math.floor(Math.min(1600, Math.max(640, w * (+q.k || 1))) / 2) * 2;
  let svg = v.svg.replace('<svg', '<svg width="' + w + '" height="' + v.band[1] + '"');
  // [§274] THE PROTOTYPE'S ARC IN THE FILM: the GC's own curve (notation/lib/gc.js) from the arc's first note through the impact to its last,
  // the ring at the impact — drawn into the picture; the ball is drawn on each frame
  let ballY = null;
  if (v.proto) {
    const Gc = require(path.join(ROOT, 'notation', 'lib', 'gc.js')), A = v.proto.arc, L = v.proto.look;
    const GP = Gc.params(Object.assign({}, v.proto.preset, { duration: A.t1 - A.t0, descentRatio: 100 * (A.bounce - A.t0) / (A.t1 - A.t0) }));
    const imp = v.proto.arcY.imp, apex = v.proto.arcY.apex, xs = s => v.x0 + (s - t0) * v.pps;
    const yOf = s => { const f = Gc.heightFrac(GP, s - A.bounce); return f == null ? null : imp - f * (imp - apex); };
    const pts = []; for (let i = 0; i <= 200; i++) { const s = A.t0 + (A.t1 - A.t0) * i / 200; pts.push(xs(s).toFixed(2) + ',' + yOf(s).toFixed(2)); }
    ballY = s => (s < A.t0 || s > A.t1) ? null : (yOf(s) - v.band[0]);
  }
  const img = new Resvg(svg, { fitTo: { mode: 'width', value: outW }, background: 'white', font: { loadSystemFonts: false, fontFiles: FONT_FILES, defaultFontFamily: 'Crimson Pro Light' } }).render();
  const W = img.width, H2 = Math.floor(img.height / 2) * 2, base = Buffer.from(img.pixels), sc = W / w;
  const dur = (b - a) / rate, n = Math.max(1, Math.round(dur * fps));
  fs.mkdirSync(CLIPS, { recursive: true });
  const tag = s => String(+(+s).toFixed(2)).replace('.', '-');
  const name = 'ws_' + page + '_' + tag(a) + '_' + tag(b) + (rate !== 1 ? '_r' + tag(rate) : '') + (loops > 1 ? '_x' + loops : '');
  const one = path.join(CLIPS, name + '.one.mp4'), out = path.join(CLIPS, name + '.mp4');
  const args = ['-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', W + 'x' + H2, '-r', String(fps), '-i', 'pipe:0'];
  const hasAudio = ensureCut();
  if (hasAudio) args.push('-ss', String(a - A0), '-t', String(b - a), '-i', CUT, '-af', atempo(rate) + ',apad=pad_dur=' + gap);
  args.push('-vf', 'tpad=stop_mode=clone:stop_duration=' + gap, '-t', (dur + gap).toFixed(3), '-c:v', 'libx264', '-crf', '22', '-pix_fmt', 'yuv420p');
  if (hasAudio) args.push('-c:a', 'aac', '-b:a', '128k');
  args.push(one);
  await new Promise((ok, no) => {
    const p = spawn('ffmpeg', args, { stdio: ['pipe', 'ignore', 'pipe'] }); let err = ''; p.stderr.on('data', d => { err += d; });
    p.on('close', c => c === 0 ? ok() : no(new Error(err.slice(-400)))); p.stdin.on('error', () => {});
    let i = 0;
    const next = () => {
      while (i < n) {
        const t = a + (i / fps) * rate, x = Math.round((v.x0 + (t - t0) * v.pps) * sc), fr = Buffer.from(base.subarray(0, W * H2 * 4));
        for (let dx = -1; dx <= 1; dx++) { const xx = x + dx; if (xx < 0 || xx >= W) continue; for (let y = 0; y < H2; y++) { const o = (y * W + xx) * 4; fr[o] = 255; fr[o + 1] = 21; fr[o + 2] = 160; fr[o + 3] = 255; } }
        if (ballY) { const by = ballY(t); if (by != null) { const cx = (v.x0 + (t - t0) * v.pps) * sc, cy = by * sc, r = ballR(v.proto, t) * sc, r2 = r * r, ro = r + 1.6 * sc, ro2 = ro * ro;   // [§283] the ball larger than the ribbon under it, a white rim round it
          for (let yy = Math.max(0, Math.floor(cy - ro)); yy <= Math.min(H2 - 1, Math.ceil(cy + ro)); yy++) for (let xx = Math.max(0, Math.floor(cx - ro)); xx <= Math.min(W - 1, Math.ceil(cx + ro)); xx++) {
            const d2 = (xx - cx) * (xx - cx) + (yy - cy) * (yy - cy); if (d2 > ro2) continue; const o = (yy * W + xx) * 4;
            if (d2 <= r2) { fr[o] = 255; fr[o + 1] = 21; fr[o + 2] = 160; } else { fr[o] = 255; fr[o + 1] = 255; fr[o + 2] = 255; } fr[o + 3] = 255; } } }
        i++;
        if (!p.stdin.write(fr)) { p.stdin.once('drain', next); return; }
      }
      p.stdin.end();
    };
    next();
  });
  if (loops > 1) await ff(['-y', '-v', 'error', '-stream_loop', String(loops - 1), '-i', one, '-c', 'copy', '-movflags', '+faststart', out]);
  else fs.copyFileSync(one, out);
  fs.unlinkSync(one);
  // the hand-off to the chat: "send the clip" = this file
  fs.writeFileSync(path.join(CLIPS, 'latest.json'), JSON.stringify({ file: out, page, a, b, rate, loops, gap, t0, span, made: new Date().toISOString() }, null, 1));
  return { file: out, url: '/clips/' + path.basename(out), seconds: +((dur + gap) * loops).toFixed(1) };
}

// ---------------------------------------------------------------- the server
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost'), q = Object.fromEntries(u.searchParams);
  try {
    if (u.pathname === '/' || u.pathname === '/index.html') return send(res, 200, fs.readFileSync(path.join(DIR, 'index.html')), 'text/html; charset=utf-8');
    // [§303] the catalog pages beside the workshop: /pages/<name> = workshop/<name>/index.html, /pages/<name>/<file> = a file beside it
    { const pm = /^\/pages\/([a-z0-9_-]+)(?:\/([a-z0-9_.-]+))?$/i.exec(u.pathname); if (pm) { const pf = path.join(ROOT, 'workshop', pm[1], pm[2] || 'index.html'); if (!fs.existsSync(pf)) return send(res, 404, '{"error":"not found"}'); return send(res, 200, fs.readFileSync(pf), /\.js$/.test(pf) ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8'); } }
    if (u.pathname === '/info') return send(res, 200, JSON.stringify({ a0: A0, a1: A1, pages: PAGES, window: engine(PAGES[0]).ir.source.window, audio: ensureCut() }));
    if (u.pathname === '/view') return send(res, 200, JSON.stringify(viewOf(q.page || PAGES[0], +q.t0, Math.max(0.5, +q.span || 6), Math.max(300, Math.round(+q.w || 1400)), { sub: q.sub, n: +q.n || 0 })));
    if (u.pathname === '/proto') return send(res, 200, JSON.stringify(protoOf()));
    if (u.pathname === '/excerpt') return send(res, 200, JSON.stringify(EXCERPTS[q.name] ? rd(EXCERPTS[q.name]) : {}));
    if (u.pathname === '/marks') { const mf = path.join(ROOT, 'bank', 'gravity_sort.json'); return send(res, 200, fs.existsSync(mf) ? fs.readFileSync(mf) : '{"walls":[],"arcs":[]}'); }   // [§272] the gravity sorting (tools/gravity_sort.js)
    if (u.pathname === '/audio') { if (!ensureCut()) return send(res, 404, '{"error":"no audio render"}'); return sendFile(req, res, CUT, 'audio/wav'); }
    if (u.pathname.startsWith('/clips/')) return sendFile(req, res, path.join(CLIPS, path.basename(u.pathname)), 'video/mp4');
    if (u.pathname === '/clip' && req.method === 'POST') {
      let body = ''; req.on('data', d => { body += d; });
      req.on('end', () => { makeClip(JSON.parse(body || '{}')).then(r => send(res, 200, JSON.stringify(r)), e => send(res, 500, JSON.stringify({ error: String(e.message || e) }))); });
      return;
    }
    send(res, 404, '{"error":"not found"}');
  } catch (e) { send(res, 500, JSON.stringify({ error: String(e.message || e) })); }
}).listen(PORT, () => console.log('the notation workshop → http://localhost:' + PORT + '/'));
