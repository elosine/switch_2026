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
const PAGES = arg('pages', 's2-piano-solo,s2-piano-solo-played,s2-piano-solo-heads,gravity-proto,gravity-proto-strobe,gravity-proto-strip').split(',');
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
const stampOf = page => WATCH.concat(page.startsWith(PROTO) ? ['bank/gravity_proto.json', 'notation/ir/' + protoOf().page + '.ir.json'] : ['notation/ir/' + page + '.ir.json']).map(f => { try { return fs.statSync(path.join(ROOT, f)).mtimeMs; } catch (e) { return 0; } }).join('|');
const ENG = new Map();
function engine(page) {
  if (!PAGES.includes(page)) throw new Error('no such page: ' + page);
  const stamp = stampOf(page), have = ENG.get(page);
  if (have && have.stamp === stamp) return have;
  for (const k of Object.keys(require.cache)) if (k.includes(path.sep + 'notation' + path.sep)) delete require.cache[k];
  const lib = n => require(path.join(ROOT, 'notation', 'lib', n));
  const Coords = lib('coords.js'), Layout = lib('layout.js'), StaticPage = lib('static_page.js'), Fit = lib('fit.js');
  const glyphs = rd('notation/lib/glyphs.json'), C = lib('rules.js').loadContainer(ROOT), ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json');
  let ir, proto = null;
  if (page.startsWith(PROTO)) {
    proto = protoOf(); proto.flow = Object.assign({}, proto.flow, { style: page === PROTO ? ((proto.flow || {}).style || 'ribbon') : page.slice(PROTO.length + 1) });   // [§282] the page's name says how the inner movement is drawn
    ir = rd('notation/ir/' + proto.page + '.ir.json');
    const staff = new Map(); for (const o of ir.overlays || []) if (o.kind === 'engraving' && o.target && o.target.event && o.value) staff.set(o.target.event, o.value.staff || 0);
    const want = proto.hand === 'L' ? 1 : 0, keep = new Set(ir.events.filter(ev => (staff.get(ev.id) || 0) === want && ev.onset >= proto.window[0] && ev.onset <= proto.window[1]).map(ev => ev.id));
    proto._played = ir.events.filter(ev => keep.has(ev.id));   // the hand's notes of the window, whole — the flow and the shapes are read from these
    // [§279 — his "take out the ref noteheads"] refHeads false: the arc's own played notes are not drawn (the lead-in and lead-out notes stay)
    if (proto.refHeads === false) for (const id of [].concat(proto.in || [], proto.impact || [], proto.out || [])) keep.delete('ev-' + id);
    if (proto.leadHeads === false) keep.clear();   // [§280 — his "take out the lead in and lead out notes too"] no played note is drawn at all
    ir.events = ir.events.filter(ev => keep.has(ev.id));
    ir.overlays = (ir.overlays || []).filter(o => !(o.target && o.target.event) || keep.has(o.target.event));
    ir.chunks = (ir.chunks || []).map(c => Object.assign({}, c, { events: (c.events || []).filter(id => keep.has(id)) })).filter(c => c.events.length);
  } else ir = rd('notation/ir/' + page + '.ir.json');
  // the frame is the notation app's and the film's (tools/export_video.js): every part, 1080 high — only the picture is cut to the piano
  const ENS = Layout.ensembleFor(ens, (C.realizations || {})['video-jury']);
  const ensPart = p => (ENS && ENS.parts.find(q => q.part === p)) || null;
  const PARTS = ENS ? ENS.parts.map(p => p.part) : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const model = Layout.layoutSection(ir, glyphs, Object.assign({ m4AttackLines: false, frameParts: PARTS, ensemble: ENS, techniques: T, fitBoxes: Fit.boxesFor(C, ENS, PARTS) }, (C.engraving && C.engraving.layout) || {}));
  const rz = (C.realizations || {})['video-jury'] || {}, H = (C.frame && C.frame.heightPx) || 1080;
  const FRAME = Coords.ensembleFrame(PARTS, { heightPx: H, lanes: rz.lanes || { padTopPx: 8, padBotPx: 8, gapPx: 4 }, staffHeightPx: (C.staff && C.staff.staffHeightPx) || 31.6,
    grandStaff: ((C.engraving || {}).layout || {}).grandStaff, weightOf: ENS ? (p => (ensPart(p) && ensPart(p).weight) || 1) : undefined,
    stavesOf: p => (ensPart(p) && ensPart(p).staves && ensPart(p).staves.length) || 1, ensemble: ENS });
  const LO = (C.engraving && C.engraving.layout) || {};
  const e = { stamp, Coords, StaticPage, glyphs, C, ENS, ir, model, H, FRAME, EDGES: Coords.edgesOf(C), band: (proto && proto.band) || BAND,
    Gc: lib('gc.js'), ChordColumn: lib('chord_column.js'), gaps: { toHead: LO.accGapColumn != null ? LO.accGapColumn : 0.1, between: (LO.chordColumn && LO.chordColumn.minLateralGap) || 0.1 },
    proto: proto && Object.assign({}, proto, { preset: (C.animated && C.animated.gc && C.animated.gc.preset) || lib('gc.js').DEFAULT_PRESET, look: lib('gc.js').LOOK }) };
  ENG.set(page, e);
  return e;
}
function viewOf(page, t0, span, w) {
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
    protoOut = Object.assign({}, e.proto, { headOpacity: 1, arcBand: e.band, _played: undefined });
  }
  // [§276] THE PROTOTYPE'S FURNITURE — the arc, the flow strip under the staff, the shapes (tools/gravity_furniture.js) — in the picture itself
  let band = e.band;
  if (e.proto && staves.length) {
    delete require.cache[require.resolve('./gravity_furniture.js')];
    const pps = (view.xOfSeconds(t0 + span) - x0) / span;
    const f = require('./gravity_furniture.js')({ proto: e.proto, ir: { events: e.proto._played || e.ir.events }, glyphs: e.glyphs, ChordColumn: e.ChordColumn, Gc: e.Gc, xOf: s => x0 + (s - t0) * pps, staff: staves[staves.length - 1], w, preset: e.proto.preset, look: e.proto.look, gaps: e.gaps });
    svg = svg.replace(/<\/svg>\s*$/, f.svg + '</svg>');
    band = [e.band[0], e.band[1] + f.extraH]; protoOut.shapes = f.shapes; protoOut.flags = f.flags; protoOut.arcY = f.arcY; protoOut.ribbon = f.ribbon;
  }
  svg = svg.replace(/^<svg([^>]*?) width="[\d.]+" height="[\d.]+" viewBox="[^"]*"/, '<svg$1 viewBox="0 ' + band[0] + ' ' + w + ' ' + band[1] + '" preserveAspectRatio="xMinYMin meet"');
  return { svg, staves, x0, pps: (view.xOfSeconds(t0 + span) - x0) / span, band, proto: protoOut, w, window: [t0, t0 + span], srcWindow: e.ir.source.window };
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
    if (u.pathname === '/info') return send(res, 200, JSON.stringify({ a0: A0, a1: A1, pages: PAGES, window: engine(PAGES[0]).ir.source.window, audio: ensureCut() }));
    if (u.pathname === '/view') return send(res, 200, JSON.stringify(viewOf(q.page || PAGES[0], +q.t0, Math.max(0.5, +q.span || 6), Math.max(300, Math.round(+q.w || 1400)))));
    if (u.pathname === '/proto') return send(res, 200, JSON.stringify(protoOf()));
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
