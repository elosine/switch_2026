#!/usr/bin/env node
// beat_saw.js — A SAWTOOTH OF BEATING PAIRS under ONE constant sine (SW-14, RUNNING_LOG §119, 2026-11-09): the player's long tone on a lane,
// rising from the unison along a LINE of beats a second (his pace), pair after pair — each starts again at the unison — while ONE static sine
// brick holds the pitch across them all; the long tone is cut into BREATHS by the morph's rule (his: a quarter shorter, a little jitter),
// each breath re-articulating ON the cents the gliss had reached. The beating in Hz, the cents derived at the pitch (beat_pair.js's rule).
//
//   node tools/beat_saw.js --score <name> --lane alto_sax --pitch F4 --start 16 --sine-start 15 --sine 6.25 --fade 1000 --note ff
//        --pairs "0:0,10:5,16:9|h6 ; 0:0,15:6|h2.5 ; 0:0,15.4:7,18.4:10|h2.5 ; 0:0,17.5:5|h2.5" [--gap 1] [--breath 4.5,0.75] [--seed N] [--replace] [--dry]
//     --pairs   pairs separated by ';' — each a line t:beats,t:beats,… (seconds from the pair's start · beats a second) and |h<seconds> its hold
//     --gap     the silence between two pairs (the sax breathes there; the sine holds)
//     --sine    the sine's mark, a name or a number (6.25 = ff + 1 dB on the 4 dB ladder) · --fade its rise from silence in ms
//     --breath  aim,jitter in seconds — a breath is aim ± jitter, the gap between breaths 0.75 … 1.2 s, a remainder under 1.5 s is not a note
//     --replace the lane's sine bricks, curve-A objects over them and the notes under them are taken out first
// THE SORTING: a piece's tool (its lanes, its save); the brick and the notes are the engine's and the stack's objects, as beat_pair.js writes them.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const r1 = (x) => Math.round(x * 10) / 10, r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000;
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const markNum = (t) => { const i = MARKS.indexOf(String(t)); if (i >= 0) return i; if (!Number.isFinite(+t)) die('a mark is ppp … fff or a number'); return +t; };
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const keyOf = (t) => { if (Number.isFinite(+t)) return Math.round(+t); const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(String(t).trim()); if (!m) die('a pitch is a note name (F4) or a MIDI number'); return NAMES.indexOf(m[1].toUpperCase()) + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12 * (+m[3] + 1); };
const pn = (m) => NAMES[((Math.round(m) % 12) + 12) % 12] + (Math.floor(Math.round(m) / 12) - 1);
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const centsFor = (midi, beats) => 1200 * Math.log2((hz(midi) + beats) / hz(midi));   // the player OVER the sine

const name = arg('score'); if (!name) die('--score <name>');
const file = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(file)) die('no such score: scores/' + name + '.json');
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const LANES = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'sine_behaviours.json'), 'utf8')).lanes;
const laneArg = String(arg('lane', 'alto_sax')).toLowerCase();
const lane = TRACKS.findIndex((t, k) => [String(k), t.id, t.short, t.label, t.instKey].some((x) => String(x || '').toLowerCase() === laneArg));
if (lane < 0) die('--lane: none of ' + TRACKS.map((t) => t.id).join(', '));
const instKey = TRACKS[lane].instKey, inst = INSTRUMENTS[instKey], L = LANES[instKey];
if (!inst || !L) die('the lane ' + laneArg + ' has no part in the sines (bank/sine_behaviours.json)');
const midi = keyOf(arg('pitch') || die('--pitch')), sineMark = markNum(arg('sine', 'ff')), noteMark = arg('note', 'ff');
if (!MARKS.includes(noteMark)) die('--note: one of ' + MARKS.join(' '));
const start = +arg('start', 16), sineStart = +arg('sine-start', start - 1), fadeMs = Math.round(+arg('fade', 1000)), gapPairs = +arg('gap', 1);
const [bAim, bJit] = String(arg('breath', '4.5,0.75')).split(',').map(Number);
const seed0 = +arg('seed', 23); let seed = seed0; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
// --hold lo,hi: every peak held for a time rolled in that range (his word 2026-11-09, §121: 1.8 … 2.6 s), over a pair's own |h
const holdR = arg('hold') ? String(arg('hold')).split(',').map(Number) : null;
if (holdR && (holdR.length !== 2 || holdR.some((x) => !(x >= 0)) || holdR[1] < holdR[0])) die('--hold lo,hi in seconds');
const pairs = String(arg('pairs') || die('--pairs')).split(';').map((q) => { const [ln, h] = q.trim().split('|'); const pts = ln.split(',').map((x) => x.split(':').map(Number)); if (pts.some((p) => p.length !== 2 || !Number.isFinite(p[0]) || !(p[1] >= 0))) die('--pairs: t:beats,…|h<s>'); return { pts, hold: h ? +h.replace(/^h/, '') : 2.5 }; });
const y = r3(10 * MARKS.indexOf(noteMark) / 7), vel = Math.round(127 * y / 10);   // the page's own rule for a mark (beat_pair.js §268)

const s = JSON.parse(fs.readFileSync(file, 'utf8'));
let nextId = s.nextId || (Math.max(0, ...s.objects.map((o) => +((/-(\d+)$/.exec(o.id || '') || [])[1] || 0))) + 1);
if (has('replace')) {
    const bricks = s.objects.filter((o) => o.layer === lane && o.midiModel === 'elecSine');
    const spans = bricks.map((b) => [b.startTime, b.endTime]);
    const under = (o) => spans.some(([a, b]) => (o.startSeconds != null ? o.startSeconds : o.startTime) >= a - 0.01 && (o.endSeconds != null ? o.endSeconds : o.endTime) <= b + 0.01);
    const gone = s.objects.filter((o) => bricks.includes(o) || (o.type === 'waveCurve' && ((o.layer === lane && o.sonifyNote != null && under(o)) || (o.curveName === 'A' && under(o)))));
    s.objects = s.objects.filter((o) => !gone.includes(o));
    console.log('replaced: ' + gone.length + ' object(s) taken out (' + bricks.length + ' sine brick(s), the notes and curve-A objects under them)');
}
// the pairs: a note (in breaths) per pair; the bend sampled every 0.25 s
let t = start; const notes = [], said = [];
pairs.forEach((P, pi) => {
    if (holdR) P.hold = r1(holdR[0] + rnd() * (holdR[1] - holdR[0]));   // the peak held for a rolled while (§121)
    const line = P.pts.map(([tt, h]) => [tt, h]); const lastT = line[line.length - 1][0]; const len = r3(lastT + P.hold);
    if (P.hold > 0) line.push([len, line[line.length - 1][1]]);
    const bend = []; line.forEach(([tt, h], i) => { if (i > 0) { const [t0, h0] = line[i - 1]; if (h0 !== h) for (let x = t0 + 0.25; x < tt - 1e-6; x += 0.25) bend.push([r3(x), r1(centsFor(midi, h0 + (h - h0) * (x - t0) / (tt - t0)))]); } bend.push([r3(tt), r1(centsFor(midi, h))]); });
    const far = Math.max(...bend.map((p) => p[1]));
    if (far > 100 * (inst.playerBendSt != null ? inst.playerBendSt : 1)) die('pair ' + (pi + 1) + ': ' + far + ' c is past the player\'s reach');
    const at = (x) => { if (x <= bend[0][0]) return bend[0][1]; for (let i = 1; i < bend.length; i++) if (x <= bend[i][0]) { const [ta, ca] = bend[i - 1], [tb, cb] = bend[i]; return ca + (cb - ca) * (x - ta) / Math.max(1e-9, tb - ta); } return bend[bend.length - 1][1]; };
    // the breaths
    const spans = []; let u = 0;
    while (u < len - 0.05) { let bl = bAim + (rnd() * 2 - 1) * bJit; if (u + bl > len) bl = len - u; if (bl < 1.5) break; spans.push([r3(u), r3(u + bl)]); u = u + bl + 0.75 + rnd() * 0.45; }
    const pairId = 'pair-' + (pi + 1);
    spans.forEach(([a, b], k) => {
        const inner = bend.filter((p) => p[0] > a + 1e-6 && p[0] < b - 1e-6).map(([tt, c]) => [r3(tt - a), c]);
        const mb = [[0, r1(at(a))]].concat(inner, [[r3(b - a), r1(at(b))]]);
        notes.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: lane, startSeconds: r3(t + a), endSeconds: r3(t + b),
            nodes: [{ pos: 0, y, smooth: 0.25 }, { pos: 1, y, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }], color: '#607D8B', fillMode: 'bottom', opacity: 0.55,
            performanceNotes: pn(midi) + ' · ' + pairId + ' ' + P.pts.map((p) => p[1]).join(' → ') + ' beats/s · breath ' + (k + 1) + ' of ' + spans.length + ': ' + mb[0][1] + ' → ' + mb[mb.length - 1][1] + ' c · ' + noteMark,
            properties: { sine: { brick: null, who: 'player', kind: 'saw', pair: pi + 1, cents: far, seed: seed0, take: '', was: { technique: L.voice, morphBend: null, sonifyMode: 'plain', velAbs: null, cc7Abs: null, endSeconds: r3(t + b) }, keyOffset: 0, breath: { k: k + 1, n: spans.length, fromCents: mb[0][1], toCents: mb[mb.length - 1][1] } } },
            sonifyNote: midi, technique: L.voice, recVel: vel, velAbs: vel, cc7Abs: { lo: 127, hi: 127 }, morphBend: mb });
    });
    said.push(pairId + ' ' + r3(t) + ' → ' + r3(t + len) + ' s: ' + P.pts.map(([tt, h]) => h + ' at +' + tt + ' s').join(' → ') + ', held ' + P.hold + ' s · bend to ' + far + ' c · ' + spans.length + ' breath(s): ' + spans.map(([a, b]) => r1(b - a) + ' s').join(' '));
    t = r3(t + len + gapPairs);
});
const sineEnd = r3(t - gapPairs), zid = 'zn-' + (nextId++);
notes.forEach((n) => { n.properties.sine.brick = zid; });
const brick = { id: zid, type: 'zone', layer: lane, startTime: sineStart, endTime: sineEnd, zoneFunction: 'elec', midiModel: 'elecSine', color: '#7B1FA2', opacity: 0.35, zoneHeight: 0.2, yOffset: 0.08, player: '', instrument: '',
    elec: { midi, gliss: { kind: 'none', from: 0, to: 0 }, level: { mode: 'flat', mark: String(sineMark) }, label: 'the tone the sax beats against', fadeInMs: fadeMs, track: { on: false } },
    properties: { sine: { note: notes.length ? notes[0].id : null }, beat: { pitch: midi, hz: r2(hz(midi)), who: 'player', side: 'over', shape: 'saw', pairs: pairs.map((P) => ({ line: P.pts, holdS: P.hold })), gapS: gapPairs, sine: sineMark, note: noteMark, velocity: vel, fadeInMs: fadeMs, breath: { aimS: bAim, jitterS: bJit }, seed: seed0 } } };
s.objects.push(brick, ...notes);
s.objects.sort((p, q) => (p.startTime != null ? p.startTime : p.startSeconds) - (q.startTime != null ? q.startTime : q.startSeconds));
console.log(TRACKS[lane].label + ' ' + pn(midi) + ' (' + r2(hz(midi)) + ' Hz) · the sine ' + sineStart + ' → ' + sineEnd + ' s at mark ' + sineMark + ', in over ' + fadeMs + ' ms · the note ' + noteMark + ' (velocity ' + vel + ') · breaths ' + bAim + ' ± ' + bJit + ' s · seed ' + seed0);
console.log(said.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.nextId = nextId; s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json — ' + s.objects.length + ' objects · File ▾ → Reload in the page');
