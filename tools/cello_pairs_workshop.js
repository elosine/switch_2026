#!/usr/bin/env node
// tools/cello_pairs_workshop.js — A LISTENING WORKSHOP OF TWO-STRING CELLO TREMOLOS (SW-38, 2026-11-10: "a variety of intervals … what's
// natural for the fingers on the three sets of two strings … the small one, the big stretch … move the hand position a little …
// have the workshop sample kind of jump around … a random assortment so I can hear what they sound like").
//
//   node tools/cello_pairs_workshop.js [--out piece-Section03-w_cello-pairs-01] [--base piece-Section03-w_cello] [--seed 3]
//                                      [--technique trem_vel] [--level mf] [--each 4] [--gap 1.5] [--lane 7]
//
// THE CATALOG: the cello's four strings C2 · G2 · D3 · A3 (36 · 43 · 50 · 57), three adjacent pairs. A double stop is the lower string
// stopped p semitones up and the upper string q semitones up (0 = open); its interval is 7 + q − p. The hand's natural shapes, by
// position: the open fifth · the unison (the lower string's 4th finger / thumb a fifth up, the upper open) · the seconds and thirds
// (the lower stopped 3 … 6 up, the upper open) · the fourth (2, 0) · the sixths and the seventh (one finger apart across the strings,
// 1 … 4) · the octave (0, 5 — the big stretch). Each shape is heard in a low position and again shifted up the fingerboard (both
// fingers +5 or +7), so the same interval comes from a different place. Every sample is a plain STRUCK pair (the law: the velocity is
// the dynamic, main channel, both notes at once) on the tremolo voice, --each seconds long, a marker naming it. The order is a seeded
// shuffle; the sheet is printed and written beside the save. Writes a NEW save from the base's tracks with the cello alone, from 0 s.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'], NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const pn = (m) => NAMES[m % 12] + (Math.floor(m / 12) - 1);
const args = process.argv.slice(2), arg = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const OUT = arg('out', 'piece-Section03-w_cello-pairs-01'), BASE = arg('base', 'piece-Section03-w_cello').replace(/\.json$/, '');
const SEED = +arg('seed', 3), TECH = arg('technique', 'trem_vel'), LEVEL = MARKS.indexOf(arg('level', 'mf')), EACH = +arg('each', 4), GAP = +arg('gap', 1.5), LANE = +arg('lane', 7), INST = 'cello';
const mulberry32 = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const rnd = mulberry32(SEED * 2654435761 + 7);

const STRINGS = [['C', 36], ['G', 43], ['D', 50], ['A', 57]];
const PAIRS = [[0, 1], [1, 2], [2, 3]];   // lower–upper: C–G · G–D · D–A
const INTERVAL = { 0: 'unison', 1: 'minor 2nd', 2: 'major 2nd', 3: 'minor 3rd', 4: 'major 3rd', 5: 'perfect 4th', 6: 'tritone', 7: 'perfect 5th', 8: 'minor 6th', 9: 'major 6th', 10: 'minor 7th', 11: 'major 7th', 12: 'octave' };
// the shapes [p, q, how], then the same shape shifted up (a position change) where it still reads as a hand
const SHAPES = [
    [0, 0, 'both open'], [7, 0, 'lower stopped a fifth up, upper open — the hand high'], [6, 0, 'lower stopped 6 up, upper open — a tight 2nd'],
    [5, 0, 'lower stopped 5 up, upper open'], [4, 0, 'lower stopped 4 up, upper open'], [3, 0, 'lower stopped 3 up, upper open'],
    [2, 0, 'lower stopped 2 up, upper open'], [1, 2, 'one finger apart across the strings'], [1, 3, 'two fingers apart across'], [1, 4, 'three fingers apart — a stretch'],
    [0, 5, 'lower open, upper stopped 5 up — the big stretch'],
];
const SHIFTS = [0, 5, 7];   // a low position, then up a fourth, then a fifth
const catalog = [];
PAIRS.forEach(([a, b]) => {
    const [ln, lo] = STRINGS[a], [un, uo] = STRINGS[b];
    SHAPES.forEach(([p, q, how]) => {
        SHIFTS.forEach((sh) => {
            if (sh > 0 && (p === 0 || q === 0) && !(p === 0 && q === 0) && p + q < 2) return;   // an open string cannot shift
            if (sh > 0 && (p === 0 && q === 5)) return;                                         // nor the big stretch's open string
            if (sh > 0 && p === 0 && q === 0) return;
            if (sh === 7 && p >= 5) return;                                                      // too far up for the lower string's 4th finger
            const L = lo + p + (p > 0 ? sh : 0), U = uo + q + (q > 0 ? sh : 0), iv = U - L;
            if (iv < 0 || iv > 12) return;
            catalog.push({ pair: ln + '–' + un, p: p + (p > 0 ? sh : 0), q: q + (q > 0 ? sh : 0), L, U, iv, how: how + (sh ? ' · shifted up ' + sh : ''), pos: sh === 0 ? 'low position' : sh === 5 ? 'fourth higher' : 'fifth higher' });
        });
    });
});
// not exhaustive (his word): one of each (pair, interval, position band), then --per of them per pair drawn at random — the open fifth,
// the unison, the tight 2nd and the octave always among them, the rest a draw
const PER = +arg('per', 8);
const seen = new Set(), uniq = [];
catalog.forEach((c) => { const k = c.pair + '|' + c.iv + '|' + c.pos; if (!seen.has(k)) { seen.add(k); uniq.push(c); } });
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const picked = [];
PAIRS.forEach(([a, b]) => {
    const mine = uniq.filter((c) => c.pair === STRINGS[a][0] + '–' + STRINGS[b][0]);
    const must = mine.filter((c) => c.pos === 'low position' && (c.iv === 7 || c.iv === 0 || c.iv === 1 || c.iv === 12));
    const rest = shuffle(mine.filter((c) => !must.includes(c)));
    picked.push(...must, ...rest.slice(0, Math.max(0, PER - must.length)));
});
// the random assortment: shuffled, a low one then a high one by chance
shuffle(picked);

const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', BASE + '.json'), 'utf8'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
const vel = (midi) => Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, INST, midi, LEVEL / 7))));
let nextId = 1, t = 1;
const objects = [], rows = [];
picked.forEach((c, i) => {
    const label = String(i + 1).padStart(2, '0') + ' ' + c.pair + ' · ' + INTERVAL[c.iv] + ' · ' + pn(c.L) + '+' + pn(c.U);
    for (const [midi, which] of [[c.L, 'lower ' + c.pair.split('–')[0] + ' string'], [c.U, 'upper ' + c.pair.split('–')[1] + ' string']]) {
        objects.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: LANE, startSeconds: r2(t), endSeconds: r2(t + EACH),
            nodes: [{ pos: 0, y: r2(LEVEL / 7 * 10), smooth: 0.25 }, { pos: 1, y: r2(LEVEL / 7 * 10), smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
            color: '#607D8B', fillMode: 'bottom', opacity: 0.55, performanceNotes: label + ' — ' + which + ' (' + c.how + ')',
            properties: { pairs: { i: i + 1, pair: c.pair, interval: c.iv, p: c.p, q: c.q, pos: c.pos } },
            sonifyNote: midi, technique: TECH, sonifyMode: 'plain', recVel: vel(midi) });
    }
    objects.push({ id: 'mk-' + (nextId++), type: 'marker', layer: 0, time: r2(t), label: label, color: '#00796B', groupId: 'pairs', performanceNotes: c.how + ' · ' + c.pos, properties: { pairs: true, end: r2(t + EACH) } });
    rows.push({ i: i + 1, t: r2(t), ...c });
    t += EACH + GAP;
});
const save = { version: base.version, layoutVersion: base.layoutVersion, tracks: base.tracks, assets: {}, metadata: { created: new Date().toISOString(), modified: new Date().toISOString(), tool: 'tools/cello_pairs_workshop.js', seed: SEED, note: 'THE CELLO PAIRS WORKSHOP (SW-38): two-string tremolos, every natural shape on the three string pairs, shuffled' },
    objects, markers: [], databases: base.databases || {}, nextId, viewport: { pixelsPerSecond: 8, scrollOffset: 0 } };
fs.writeFileSync(path.join(ROOT, 'scores', OUT + '.json'), JSON.stringify(save, null, 1));
const sheet = ['# THE CELLO PAIRS WORKSHOP — `scores/' + OUT + '.json` (seed ' + SEED + ', ' + TECH + ' at ' + MARKS[LEVEL] + ', ' + EACH + ' s each)', '',
    'Two-string tremolos on the cello, one hand shape at a time, in a shuffled order (SW-38). `p` / `q` = semitones the lower / upper string is stopped (0 = open).', '',
    '| # | at | strings | interval | notes | p · q | the hand | position |', '|---|---|---|---|---|---|---|---|',
    ...rows.map((r) => '| ' + r.i + ' | ' + r.t + ' s | ' + r.pair + ' | ' + INTERVAL[r.iv] + ' | ' + pn(r.L) + ' + ' + pn(r.U) + ' | ' + r.p + ' · ' + r.q + ' | ' + r.how + ' | ' + r.pos + ' |')];
fs.mkdirSync(path.join(ROOT, 'docs', 'workshops'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'workshops', OUT + '.md'), sheet.join('\n') + '\n');
console.log('wrote scores/' + OUT + '.json —', rows.length, 'pairs,', r2(t), 's · the sheet docs/workshops/' + OUT + '.md');
rows.forEach((r) => console.log(String(r.i).padStart(2), String(r.t).padStart(6) + 's', r.pair.padEnd(4), INTERVAL[r.iv].padEnd(12), (pn(r.L) + '+' + pn(r.U)).padEnd(8), r.pos));
function r2(x) { return Math.round(x * 100) / 100; }
