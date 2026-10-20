#!/usr/bin/env node
// build_petals.js — THE PETALS AUDITION (his word 2026-10-06, DEC-32 · PLAN 10.3 · RUNNING_LOG §151): his petals of resonance, the
// ORIGINAL beside the CLEANED path, in PAIRS — N settings (20), each heard twice in a row on ONE captured impulse: first his SynthDef
// as it is (the effect `petalsOrig`), then the cleaned signal path (the effect `petals`), the same dials. Pair 1 is HIS OWN set line
// (the a.set(...) at the foot of his file); the others are drawn, seeded, from the ranges his file names — fund 35 … 150 Hz · first
// partial 2 … 5 · bank offset 2 … 8 semitones · spread 0.33 … 1.33 · ring 7 … 15 s. The pairs move through the bank's impulses:
// another player and another impulse each time. Nothing overlaps: a brick starts a second and a half after the ring before it.
// It writes — 2N presets into bank/presets.json (pet01o · pet01c …; `deal: false`: never dealt onto the main score; a second run
// replaces only its own) · the score scores/<name>.json, a NEW file · the sheet docs/auditions/<name>.md (pair · times · impulse · dials).
//   node tools/build_petals.js [--name audition-petals] [--n 20] [--seed 1] [--replace] [--render] [--port 5500]
// --render   sends the plan to the engine with render 1 — it needs an engine STARTED AFTER the petals went into electronics/sc/process.scd
//            (an older one leaves the unknown dials out and banks the bare impulse under the petals' names). Without it: in the page,
//            a purple brick → "render all planned".
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its bank, its presets, its scores) — the piece's. The two effects are the engine's.
'use strict';
const K = require('./audition_kit.js');
const NAME = K.arg('name', 'audition-petals'), N = Math.max(1, +K.arg('n', 20)), SEED = +K.arg('seed', 1), PORT = +K.arg('port', 5500);
const TAG = 'petals', CAP_MS = 16000, TAIL_S = 1.5;
const COMMAND = 'node tools/build_petals.js --name ' + NAME + ' --n ' + N + ' --seed ' + SEED;

// THE SETTINGS: his own line first, then the draws
const rnd = K.mulberry32(SEED * 2654435761 + 1013);
const u = (lo, hi, dec) => +(lo + rnd() * (hi - lo)).toFixed(dec);
const settings = [{ fund: 35, first: 5, spread: 1.33, offset: 8.1, ringLo: 7, ringHi: 15, his: true }];
while (settings.length < N) {
  const ringLo = u(7, 10, 1), ringHi = Math.min(15, +(ringLo + u(1.5, 5, 1)).toFixed(1));
  settings.push({ fund: u(35, 150, 1), first: u(2, 5, 2), spread: u(0.33, 1.33, 2), offset: u(2, 8, 2), ringLo, ringHi });
}
settings.length = N;
const dials = (s) => 'fund ' + s.fund + ' Hz · first partial ' + s.first + ' · spread ' + s.spread + ' · bank B +' + s.offset + ' st · ring ' + s.ringLo + ' … ' + s.ringHi + ' s';
const args = (pre, s) => ({ [pre + 'Mix']: 1, [pre + 'Fund']: s.fund, [pre + 'First']: s.first, [pre + 'Spread']: s.spread, [pre + 'Offset']: s.offset, [pre + 'RingLo']: s.ringLo, [pre + 'RingHi']: s.ringHi, [pre + 'InLen']: 1 });
const nn = (i) => String(i + 1).padStart(2, '0');

// THE PRESETS: a pair per setting
const presets = [];
settings.forEach((s, i) => {
  const tail = s.his ? ' (his own set line)' : '';
  presets.push({ key: 'pet' + nn(i) + 'o', name: 'P' + nn(i) + ' ORIGINAL — petals, his SynthDef as it is · ' + dials(s) + tail, effect: 'petalsOrig', class: 'time', capMs: CAP_MS, args: args('po', s) });
  presets.push({ key: 'pet' + nn(i) + 'c', name: 'P' + nn(i) + ' CLEANED — petals, the cleaned path · ' + dials(s) + tail, effect: 'petals', class: 'time', capMs: CAP_MS, args: args('pt', s) });
});

// THE SCORE: original · cleaned, then the next pair; each on the pair's impulse, on that impulse's lane
const pick = K.spread(K.impulses()), Z = K.zoneMaker(), objects = [], rows = [];
let t = 1;
settings.forEach((s, i) => {
  const smp = pick(i), gap = Math.ceil((s.ringHi + TAIL_S) * 2) / 2, lane = smp.lane >= 0 ? smp.lane : 0;
  const tO = t, tC = t + gap;
  objects.push(Z.zone(lane, tO, { name: smp.name, label: 'P' + nn(i) + ' orig', variants: { [smp.name]: 'pet' + nn(i) + 'o-tail' } }));
  objects.push(Z.zone(lane, tC, { name: smp.name, label: 'P' + nn(i) + ' clean', variants: { [smp.name]: 'pet' + nn(i) + 'c-tail' } }));
  rows.push({ i, s, smp, tO, tC });
  t = tC + gap;
});

const NOTE = 'THE PETALS AUDITION (DEC-32 · PLAN 10.3 · RUNNING_LOG §151): his petals of resonance in ' + N + ' PAIRS — the same setting twice in a row on one captured impulse, first his original SynthDef (petalsOrig), then the cleaned signal path (petals). Pair 1 is his own set line; the others are drawn (seed ' + SEED + ') from the ranges his file names. Every brick asks for <impulse>~pet<NN>o-tail or …c-tail; the engine renders them from the bank when the plan is sent with render (a purple brick → render all planned). The sheet: docs/auditions/' + NAME + '.md. Written by tools/build_petals.js; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, 'tools/build_petals.js', K.flag('replace'));
const P = K.writePresets(TAG, presets, 'his petals of resonance, the original beside the cleaned path — ' + N + ' pairs (pair 1 his own set line; seed ' + SEED + ')', COMMAND);

// THE SHEET
const sheet = [
  '# ' + NAME + ' — the petals of resonance: your original beside the cleaned path',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §151; DEC-32; PLAN 10.3).*',
  '',
  '**What it is:** ' + N + ' pairs. Each pair is ONE setting heard twice in a row on ONE impulse — first **orig** (your SynthDef as it is), then **clean** (the cleaned signal path). Pair 1 is your own set line from the foot of your file; pairs 2 … ' + N + ' are drawn from the ranges your file names.',
  '',
  '**To hear it:** the engine restarted · F5 · File ▾ → Experiments → `' + NAME + '` · click any purple brick → **render all planned** (' + (2 * N) + ' renders; wait for the engine\'s window to go quiet) · play from 0. The score is ' + K.clock(t) + ' long.',
  '',
  '**What differs inside a pair** (everything else is the same):',
  '',
  '- **the ring** — orig: all 26 partials sink together, at one time between the two ring numbers · clean: each partial has its own ring between them, so the chord thins out partial by partial.',
  '- **the wobble** — orig: the 26 wobble speeds are the same in every render, all starting together · clean: drawn fresh at every render, each starting somewhere else.',
  '- **the attack** — orig: your 20 ms fade-in on what goes in (the microphone\'s gate) · clean: no fade-in — the impulse hits the bank as it is.',
  '- **the ending** — orig: your limiter and your fade (cut a third of a second after the longer ring number) · clean: it rings out until it is 60 dB under its peak.',
  '',
  '| pair | orig at | clean at | impulse | fund Hz | first partial | spread | bank B + st | ring s | presets |',
  '|---|---|---|---|---|---|---|---|---|---|',
].concat(rows.map((r) => '| **P' + nn(r.i) + '**' + (r.s.his ? ' *(your set line)*' : '') + ' | ' + K.clock(r.tO) + ' (' + r.tO + ' s) | ' + K.clock(r.tC) + ' (' + r.tC + ' s) | `' + r.smp.name + '` — ' + (K.PLAYERS[r.smp.player] || r.smp.player) + ' | ' + r.s.fund + ' | ' + r.s.first + ' | ' + r.s.spread + ' | ' + r.s.offset + ' | ' + r.s.ringLo + ' … ' + r.s.ringHi + ' | `pet' + nn(r.i) + 'o` · `pet' + nn(r.i) + 'c` |'))
  .concat(['', '**To keep one:** the sample it makes is `<impulse>~pet<NN>o-tail` / `…c-tail` in the bank; a return brick anywhere can ask for it — its panel → Processed as → the preset `P<NN> ORIGINAL` / `P<NN> CLEANED`, envelope `tail`. A brick\'s whole setting is its preset\'s row in `bank/presets.json`.', '']).join('\n');
const sheetFile = K.writeSheet(NAME, sheet);

rows.forEach((r) => console.log('P' + nn(r.i) + '  ' + String(r.tO).padStart(6) + ' s · ' + String(r.tC).padStart(6) + ' s  lane ' + r.smp.lane + '  ' + r.smp.name.padEnd(16) + dials(r.s) + (r.s.his ? '  (his set line)' : '')));
console.log(K.rel(file) + ' written — ' + objects.length + ' return bricks, ' + N + ' pairs, ' + K.clock(t) + ' long · ' + K.rel(sheetFile) + ' · File ▾ → Experiments → ' + NAME);
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): in the page, a purple brick → "render all planned" — with an engine started after the petals stages.');
