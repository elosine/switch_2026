#!/usr/bin/env node
// harmony_roll.js — A HARMONIC RHYTHM ROLLED AS TIME CONTAINERS, the chords drawn exhaustively from the drawer's takes (his word 2026-11-10,
// RUNNING_LOG §139: "a relatively healthy or brisk pace of harmonic change … 1.5 s minimum, 3.5 s maximum … SW-ctpt 1 through 16, a random draw
// for each chord change, but exhaustive — run through all 16 before you redraw a same chord"). The containers are rolled as Approaching rolled
// its three-body section (its three_body_roll.js, carried in this stack): a HEXAGRAM per container by Cage's three coins, 1 … 64 read across
// the range  lo + (n − 1) / 63 · (hi − lo)  — the lineage's time-container roll. At each container's start the next take of a shuffled deck;
// the deck re-shuffled when spent (its first never the last one dealt). Every played-in note inside a container takes a pitch of the take:
// the take's voice ON ITS LANE nearest the note's own pitch (the contour kept); a lane the take did not place gets the harmony's nearest
// pitch folded into the voice's range. A marker at each container start names the take. The old pitch is kept (properties.harmony.was);
// --undo restores. Nothing else of the note changes.
//
//   node tools/harmony_roll.js --score <name> --from 200 --to 253 --takes "SW-ctpt-%02d:1-16" [--min 1.5] [--max 3.5] [--seed N] [--undo] [--dry]
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const r3 = (x) => Math.round(x * 1000) / 1000;
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const pn = (m) => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const Roll = require(path.join(ROOT, 'score', 'public', 'three_body_roll.js'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const SNAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels.strikes;
const name = arg('score') || die('--score'), from = +arg('from', 0), to = +arg('to', 1e9), MIN = +arg('min', 1.5), MAX = +arg('max', 3.5), seed = +arg('seed', 17);
const file = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(file)) die('no such score');
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
let nextId = s.nextId || (Math.max(0, ...s.objects.map((o) => +((/-(\d+)$/.exec(o.id || '') || [])[1] || 0))) + 1);

if (has('undo')) {
    let n = 0; s.objects = s.objects.filter((o) => !(o.type === 'marker' && o.properties && o.properties.harmonyRoll));
    for (const o of s.objects) if (o.properties && o.properties.harmony && o.properties.harmony.was != null && o.startSeconds >= from && o.startSeconds <= to) { o.sonifyNote = o.properties.harmony.was; delete o.properties.harmony; n++; }
    console.log(n + ' note(s) restored, the markers taken out'); if (!has('dry')) { fs.writeFileSync(file, JSON.stringify(s)); console.log('written: scores/' + name + '.json · File ▾ → Reload'); } process.exit(0);
}

// the takes: "SW-ctpt-%02d:1-16" or a comma list
const spec = arg('takes') || die('--takes'); let takeNames;
{ const m = /^(.*)%02d(.*):(\d+)-(\d+)$/.exec(spec); if (m) { takeNames = []; for (let i = +m[3]; i <= +m[4]; i++) takeNames.push(m[1] + String(i).padStart(2, '0') + m[2]); } else takeNames = spec.split(','); }
const takes = takeNames.map((k) => { const t = SNAP[k]; if (!t || !t.state) die('no take ' + k); const byLane = {}, all = []; for (const v of t.state.voices || []) { if (v.pitch == null) continue; all.push(v.pitch); if (v.lane >= 0) (byLane[v.lane] = byLane[v.lane] || []).push(v.pitch); } return { name: k, byLane, all: [...new Set(all)].sort((a, b) => a - b) }; });

// the containers: a hexagram each across [MIN, MAX]; the last absorbs a short remainder
const rnd = Roll.mulberry32(seed);
const containers = []; let t = from;
while (t < to - 0.01) { const h = Roll.hexagram(rnd); let len = r3(MIN + (h.n - 1) / 63 * (MAX - MIN)); if (to - (t + len) < MIN) len = r3(to - t); containers.push({ start: r3(t), end: r3(t + len), hex: h.n, glyph: h.glyph }); t = r3(t + len); }
// the deck: exhaustive, re-shuffled when spent, no take twice in a row
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
let deck = [], last = null;
for (const c of containers) { if (!deck.length) { deck = shuffle(takes); if (last && deck[0] === last) deck.push(deck.shift()); } c.take = deck.shift(); last = c.take; }

// the pitches
const notes = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.startSeconds >= from && o.startSeconds < to && !TRACKS[o.layer].elec);
const fold = (p, lo, hi) => { while (p < lo) p += 12; while (p > hi) p -= 12; return p < lo ? lo : p; };
const rangeOf = (o) => { const inst = INSTRUMENTS[TRACKS[o.layer].instKey], q = inst.techniques.find((x) => x.key === o.technique) || {}; return [q.rangeLow != null ? q.rangeLow : inst.rangeLow, q.rangeHigh != null ? q.rangeHigh : inst.rangeHigh]; };
let changed = 0, unplacedLane = 0; const perLane = {};
for (const c of containers) {
    const T = c.take; c.notes = 0;
    for (const o of notes) {
        if (o.startSeconds < c.start || o.startSeconds >= c.end) continue;
        const [lo, hi] = rangeOf(o), own = T.byLane[o.layer];
        let cands = own && own.length ? own.map((p) => fold(p, lo, hi)) : T.all.map((p) => fold(p, lo, hi));
        if (!own || !own.length) unplacedLane++;
        const was = o.sonifyNote, pick = cands.reduce((b, p) => (Math.abs(p - was) < Math.abs(b - was) || (Math.abs(p - was) === Math.abs(b - was) && p < b) ? p : b), cands[0]);
        o.properties = o.properties || {}; if (!o.properties.harmony) o.properties.harmony = { was }; o.properties.harmony.take = T.name; o.properties.harmony.container = containers.indexOf(c) + 1;
        if (pick !== o.sonifyNote) changed++; o.sonifyNote = pick; c.notes++; perLane[o.layer] = (perLane[o.layer] || 0) + 1;
    }
}
// the markers (the earlier roll's taken out first)
s.objects = s.objects.filter((o) => !(o.type === 'marker' && o.properties && o.properties.harmonyRoll));
for (const c of containers) s.objects.push({ id: 'mk-' + (nextId++), type: 'marker', layer: 0, time: c.start, label: c.take.name.replace(/^SW-/, '') + ' ' + c.glyph, color: '#8E24AA', groupId: 'harmony-roll', performanceNotes: 'harmony ' + c.take.name + ' · container ' + (containers.indexOf(c) + 1) + ', hexagram ' + c.hex + ', ' + r3(c.end - c.start) + ' s', properties: { harmonyRoll: true, take: c.take.name, hex: c.hex, end: c.end } });
s.objects.sort((p, q) => (p.startTime != null ? p.startTime : p.startSeconds != null ? p.startSeconds : p.time) - (q.startTime != null ? q.startTime : q.startSeconds != null ? q.startSeconds : q.time));
console.log(containers.length + ' containers over ' + from + ' … ' + to + ' s (seed ' + seed + '; ' + MIN + ' … ' + MAX + ' s by hexagram): ' + containers.map((c) => r3(c.end - c.start)).join(' '));
console.log('the deal: ' + containers.map((c) => c.take.name.replace(/^SW-ctpt-/, '')).join(' '));
console.log(notes.length + ' notes · ' + changed + ' pitches changed · ' + unplacedLane + ' note(s) on a lane the take left unplaced (the harmony\'s nearest pitch, folded) · by lane: ' + Object.entries(perLane).map(([l, n]) => TRACKS[l].id + ' ' + n).join(', '));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.nextId = nextId; s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json · File ▾ → Reload in the page');
