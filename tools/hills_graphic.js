#!/usr/bin/env node
// tools/hills_graphic.js — THE HILLS AS A GRAPHIC SCORE in the composer score (SW-39, 2026-11-10: "a graphic score … higher lanes …
// combine several lanes, like 4 of those lanes … and a variety of sizes: shorter hills, taller hills, up and then straight down, like
// sawtooth type, ones that plateau, almost square wave type"). No app change: a waveCurve with NO pitch is silent (sonify_core skips it),
// so a tall shape is drawn as four silent curves, one per lane, each lane showing its own horizontal BAND of the height (the bottom lane
// 0 … ¼, the next ¼ … ½ …), filled to the lane's floor — stacked, they read as one silhouette four lanes high. The shape is sampled every
// --step seconds so the bands clip it exactly. Beside the picture, the SOUND: the cello's shaped notes (the law's Rules 1 · 2, as
// tools/cello_hills.js writes them) on the pitches given, so each shape is heard as a tremolo swell while the cursor crosses it.
//
//   node tools/hills_graphic.js [--save piece-Section03-w_cello-hills-01] [--out piece-Section03-w_cello-hills-graphic-01]
//                               [--lanes 3,4,5,6] [--cello 7] [--pitches 50,57] [--technique trem_vel] [--catalog-from 480] [--gap 4] [--step 0.5]
//
// 1. THE PETAL HILLS: read from the save's shaped notes (their properties.hills.nodes: time · dB · level), interpolated smoothly, drawn
//    tall; the sounding notes are kept as they are.
// 2. THE CATALOG, from --catalog-from: the shapes below, one after another, each a marker, a tall picture, and a sounding pair.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DynTable = require(path.join(ROOT, 'score', 'public', 'dyn_table.js')), TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const args = process.argv.slice(2), arg = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000, clamp01 = (x) => Math.max(0, Math.min(1, x));

const SAVE = arg('save', 'piece-Section03-w_cello-hills-01').replace(/\.json$/, ''), OUT = arg('out', 'piece-Section03-w_cello-hills-graphic-01');
const LANES = String(arg('lanes', '3,4,5,6')).split(',').map(Number), CELLO = +arg('cello', 7), INST = 'cello';
const PITCHES = String(arg('pitches', '50,57')).split(',').map(Number), TECH = arg('technique', 'trem_vel');
const CAT_FROM = +arg('catalog-from', 480), GAP = +arg('gap', 4), STEP = +arg('step', 0.5);
const COLOR = '#8E6BB0';

const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', SAVE + '.json'), 'utf8'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
let nextId = save.nextId || 1;
const out = [];

// ---- the picture: a shape h(u) in 0 … 1 over [t0, t1], as N silent band-curves on LANES (the first lane the TOP band)
function picture(t0, t1, h, label, props) {
    const N = LANES.length, n = Math.max(2, Math.round((t1 - t0) / STEP) + 1);
    LANES.forEach((lane, idx) => {
        const band = N - 1 - idx, a = band / N, b = (band + 1) / N;
        const nodes = [];
        for (let i = 0; i < n; i++) { const u = i / (n - 1); nodes.push({ pos: r3(u), y: r2(10 * clamp01((h(u) - a) / (b - a))), smooth: 0 }); }
        out.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: lane, startSeconds: r2(t0), endSeconds: r2(t1), nodes,
            segments: nodes.slice(1).map(() => ({ model: 'power', slope: 0 })), color: COLOR, fillMode: 'bottom', opacity: 0.5,
            performanceNotes: 'GRAPHIC · ' + label + ' · band ' + (band + 1) + ' of ' + N + ' (silent — no pitch)',
            properties: Object.assign({ graphic: { label, band: band + 1, of: N, tool: 'tools/hills_graphic.js' } }, props || {}) });
    });
}
// ---- the sound: one shaped note per pitch, the shape's own breakpoints [u, level(mark, fractional)], lo … hi its written range
function sound(t0, t1, pts, lo, hi, smooth, label, props) {
    const L = lo / 7, H = hi / 7;
    PITCHES.forEach((pitch) => {
        out.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: CELLO, startSeconds: r2(t0), endSeconds: r2(t1),
            nodes: pts.map(([u, m]) => ({ pos: r3(u), y: Math.max(0.05, r2(10 * DynTable.height(REMAP, INST, m / 7, L, H))), smooth })),
            segments: pts.slice(1).map(() => ({ model: smooth ? 'bezier' : 'power', slope: 0 })), color: COLOR, fillMode: 'bottom', opacity: 0.55,
            performanceNotes: label + ' · ' + TECH + ' · ' + MARKS[lo] + ' … ' + MARKS[hi], properties: Object.assign({ shape: { label } }, props || {}),
            sonifyNote: pitch, technique: TECH, velAbs: TextureDyn.mfVel(REMAP, INST, pitch), cc7Abs: DynTable.range(REMAP, INST, L, H) });
    });
}
const marker = (t, label, notes, end) => out.push({ id: 'mk-' + (nextId++), type: 'marker', layer: 0, time: r2(t), label, color: COLOR, groupId: 'hills-graphic', performanceNotes: notes, properties: { hillsGraphic: true, end: r2(end) } });

// ---- 1. the petal hills, from the save's shaped notes
const hills = save.objects.filter((o) => o.type === 'waveCurve' && o.layer === CELLO && o.properties && o.properties.hills);
if (hills.length) {
    const H = hills[0], P = H.properties.hills, pts = P.nodes.map(([t, db, lvl]) => [t, lvl]), t0 = H.startSeconds, t1 = H.endSeconds;
    const lo = Math.min(...pts.map((p) => p[1])), hi = Math.max(...pts.map((p) => p[1]));
    const at = (t) => {                      // a cosine ease between the recorded nodes — the drawn bezier's look
        if (t <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [ta, va] = pts[i - 1], [tb, vb] = pts[i], w = (t - ta) / Math.max(1e-9, tb - ta); return va + (vb - va) * (1 - Math.cos(Math.PI * w)) / 2; } return pts[pts.length - 1][1];
    };
    picture(t0, t1, (u) => (at(t0 + u * (t1 - t0)) - lo) / Math.max(1e-9, hi - lo), 'the petal hills ' + t0 + ' … ' + t1 + ' s', { source: P.source });
    console.log('the petal hills drawn tall:', t0, '…', t1, 's,', pts.length, 'nodes; the sounding notes kept (' + hills.length + ')');
}

// ---- 2. the catalog of shapes: [name, seconds, lo, hi, breakpoints [u, 0…1], smooth, why]
const CAT = [
    ['short hill', 6, 'p', 'mp', [[0, 0], [0.5, 1], [1, 0]], 0.25, 'a small swell'],
    ['short hill, tall', 6, 'p', 'f', [[0, 0], [0.5, 1], [1, 0]], 0.25, 'the same width, twice the climb'],
    ['medium hill', 15, 'p', 'mf', [[0, 0], [0.5, 1], [1, 0]], 0.25, ''],
    ['medium hill, tall', 15, 'pp', 'ff', [[0, 0], [0.5, 1], [1, 0]], 0.25, ''],
    ['long hill', 30, 'p', 'mf', [[0, 0], [0.5, 1], [1, 0]], 0.25, ''],
    ['long hill, tallest', 30, 'ppp', 'fff', [[0, 0], [0.5, 1], [1, 0]], 0.25, 'the whole ladder'],
    ['sawtooth, short', 10, 'p', 'f', [[0, 0], [0.96, 1], [1, 0]], 0, 'a slow climb, then straight down'],
    ['sawtooth, long', 25, 'p', 'f', [[0, 0], [0.98, 1], [1, 0]], 0, ''],
    ['reverse sawtooth, short', 10, 'p', 'f', [[0, 0], [0.04, 1], [1, 0]], 0, 'straight up, then a slow fall'],
    ['reverse sawtooth, long', 25, 'p', 'f', [[0, 0], [0.02, 1], [1, 0]], 0, ''],
    ['square, short', 12, 'p', 'f', [[0, 0], [0.15, 1], [0.85, 1], [1, 0]], 0, 'up in 2 s, a plateau of 8, down in 2'],
    ['square, long', 28, 'p', 'f', [[0, 0], [0.14, 1], [0.86, 1], [1, 0]], 0, 'up in 4 s, a plateau of 20, down in 4'],
    ['plateau, rounded', 40, 'pp', 'f', [[0, 0], [0.15, 1], [0.85, 1], [1, 0]], 0.25, 'a soft rise of 6 s, 28 s on top, a soft fall'],
    ['slow up, quick down', 18, 'p', 'f', [[0, 0], [0.83, 1], [1, 0]], 0.25, 'a 15 s climb, down in 3'],
    ['quick up, slow down', 18, 'p', 'f', [[0, 0], [0.17, 1], [1, 0]], 0.25, 'up in 3, a 15 s fall'],
    ['double hill', 20, 'p', 'f', [[0, 0], [0.25, 1], [0.5, 0.35], [0.75, 1], [1, 0]], 0.25, 'two peaks, a valley at mp between'],
    ['hill with a shoulder', 24, 'p', 'f', [[0, 0], [0.3, 0.6], [0.5, 0.6], [0.7, 1], [1, 0]], 0.25, 'a rise, a ledge, the top, down'],
    ['stair up, straight down', 16, 'p', 'f', [[0, 0], [0.3, 0.33], [0.32, 0.33], [0.6, 0.66], [0.62, 0.66], [0.9, 1], [0.97, 1], [1, 0]], 0, 'three steps, then the drop'],
];
let t = CAT_FROM;
const rows = [];
CAT.forEach(([name, secs, lo, hi, bp, smooth, why], i) => {
    const t0 = t, t1 = t + secs, L = MARKS.indexOf(lo), Hh = MARKS.indexOf(hi);
    const label = String(i + 1).padStart(2, '0') + ' ' + name;
    const shape = (u) => { for (let k = 1; k < bp.length; k++) if (u <= bp[k][0]) { const [ua, va] = bp[k - 1], [ub, vb] = bp[k], w = (u - ua) / Math.max(1e-9, ub - ua); return smooth ? va + (vb - va) * (1 - Math.cos(Math.PI * w)) / 2 : va + (vb - va) * w; } return bp[bp.length - 1][1]; };
    picture(t0, t1, shape, label, { catalog: { i: i + 1, name, seconds: secs, lo, hi, why } });
    sound(t0, t1, bp.map(([u, v]) => [u, L + (Hh - L) * v]), L, Hh, smooth, label, { catalog: { i: i + 1, name, seconds: secs, lo, hi } });
    marker(t0, label, name + ' · ' + secs + ' s · ' + lo + ' … ' + hi + (why ? ' · ' + why : ''), t1);
    rows.push({ i: i + 1, t: t0, name, secs, lo, hi, why });
    t = t1 + GAP;
});

save.objects.push(...out);
save.nextId = nextId;
save.metadata = Object.assign({}, save.metadata, { modified: new Date().toISOString(), derivedFrom: SAVE, tool: 'tools/hills_graphic.js' });
const outFile = path.join(ROOT, 'scores', OUT + '.json');
if (fs.existsSync(outFile) && !args.includes('--replace')) throw new Error(outFile + ' exists — --replace to rewrite it');
fs.writeFileSync(outFile, JSON.stringify(save, null, 1));
const sheet = ['# THE HILLS AS A GRAPHIC SCORE — `scores/' + OUT + '.json` (SW-39)', '',
    'Four lanes (' + LANES.join(', ') + ') carry one tall silhouette each shape, silent; the cello (lane ' + CELLO + ') sounds it as a tremolo swell on ' + PITCHES.join(' + ') + ' (' + TECH + '). The petal hills first (275 … 465 s), then the catalog from ' + CAT_FROM + ' s.', '',
    '| # | at | shape | seconds | written | what it is |', '|---|---|---|---|---|---|',
    ...rows.map((r) => '| ' + r.i + ' | ' + r.t + ' s | ' + r.name + ' | ' + r.secs + ' | ' + r.lo + ' … ' + r.hi + ' | ' + r.why + ' |')];
fs.mkdirSync(path.join(ROOT, 'docs', 'workshops'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'workshops', OUT + '.md'), sheet.join('\n') + '\n');
console.log('wrote scores/' + OUT + '.json —', out.length, 'objects added; the catalog', CAT.length, 'shapes', CAT_FROM, '…', r2(t - GAP), 's · the sheet docs/workshops/' + OUT + '.md');
rows.forEach((r) => console.log(String(r.i).padStart(2), String(r.t).padStart(6) + 's', r.name.padEnd(26), String(r.secs).padStart(3) + ' s', r.lo + ' … ' + r.hi));
