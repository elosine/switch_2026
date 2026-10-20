#!/usr/bin/env node
// build_petals_loop.js — THE PETALS-LOOP AUDITION (his word 2026-10-07, DEC-40 · RUNNING_LOG §201 route (c) · §203): his petals of
// resonance (the ORIGINAL, his set line) with THE LOOP AROUND THE BANK — the bank's sound through an amp (tanh) and back into the bank, a
// guitar's feedback with his 26 partials as the string (`poBloom` the seconds to lift the ring 60 dB · `poDrive` the amp · `poHold` the
// seconds the loop is held, then broken — the bank rings down on its own). EIGHT bricks on ONE impulse, GAP s apart (his word: "two or
// three seconds" — the tails overlap, 20 … 30 s each): L0 the reference (no loop) · L1 … L3 the bloom 4 · 2 · 1 s at drive 6 · L4 · L5
// drive 15 · 30 at bloom 2 · L6 a long hold (15 s) · L7 fast, hard and short (bloom 0.5 · drive 20 · hold 5).
// It writes — 8 presets into bank/presets.json (pl01 … pl08; `deal: false`, `audition: petals-loop`; a second run replaces only its
// own) · the score scores/<name>.json, a NEW file · the sheet docs/auditions/<name>.md.
//   node tools/build_petals_loop.js [--name audition-petals-loop] [--impulse bcl-impulse-1] [--gap 3] [--replace] [--render] [--port 5500]
// --render   sends the plan to the engine with render 1 — ONLY on an engine STARTED AFTER the loop went into electronics/sc/process.scd
//            (2026-10-07, §203): an older one leaves the unknown dials out and banks the plain petals under the loop's names.
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its bank, its presets, its scores) — the piece's. The loop is the engine's.
'use strict';
const K = require('./audition_kit.js');
const NAME = K.arg('name', 'audition-petals-loop'), IMP = K.arg('impulse', 'bcl-impulse-1'), GAP_S = +K.arg('gap', 3), PORT = +K.arg('port', 5500);
const TAG = 'petals-loop';
const COMMAND = 'node tools/build_petals_loop.js --name ' + NAME + ' --impulse ' + IMP + ' --gap ' + GAP_S;

// HIS SET LINE (the foot of SynthDef_petalsOfResonance.scd; pair 1 of audition-petals)
const PETALS = { poMix: 1, poFund: 35, poFirst: 5, poSpread: 1.33, poOffset: 8.1, poRingLo: 7, poRingHi: 15, poInLen: 1 };

// THE EIGHT — bloom (s to lift 60 dB; 0 = no loop) · drive (the amp) · hold (s the loop is held)
const SET = [
  { key: 'pl01', short: 'L0 reference', bloom: 0, drive: 6, hold: 0, what: 'no loop — the petals alone (his set line)' },
  { key: 'pl02', short: 'L1 bloom 4 · drive 6', bloom: 4, drive: 6, hold: 8, what: 'a slow lift: 60 dB in 4 s · the amp at 6 · held 8 s' },
  { key: 'pl03', short: 'L2 bloom 2 · drive 6', bloom: 2, drive: 6, hold: 8, what: '60 dB in 2 s · the amp at 6 · held 8 s' },
  { key: 'pl04', short: 'L3 bloom 1 · drive 6', bloom: 1, drive: 6, hold: 8, what: 'a fast lift: 60 dB in 1 s · the amp at 6 · held 8 s' },
  { key: 'pl05', short: 'L4 bloom 2 · drive 15', bloom: 2, drive: 15, hold: 8, what: '60 dB in 2 s · the amp HARDER at 15 · held 8 s' },
  { key: 'pl06', short: 'L5 bloom 2 · drive 30', bloom: 2, drive: 30, hold: 8, what: '60 dB in 2 s · the amp at 30, a fuzz · held 8 s' },
  { key: 'pl07', short: 'L6 long hold 15 s', bloom: 2, drive: 10, hold: 15, what: '60 dB in 2 s · the amp at 10 · held 15 s, then the ring' },
  { key: 'pl08', short: 'L7 fast · hard · short', bloom: 0.5, drive: 20, hold: 5, what: '60 dB in half a second · the amp at 20 · held 5 s' },
];
const capOf = (s) => (s.bloom > 0 ? s.hold + PETALS.poRingHi + 2 : PETALS.poRingHi + 1) * 1000;   // the hold, then the bank's whole ring (his fade sits at hold + ring-to)

// THE PRESETS
const presets = SET.map((s) => ({ key: s.key, name: s.short.replace(/^L\d /, (m) => m) + ' — petals, his set line, THE LOOP: bloom ' + s.bloom + ' s · drive ' + s.drive + ' · hold ' + s.hold + ' s', effect: 'petalsOrig', class: 'time', capMs: capOf(s),
  args: Object.assign({}, PETALS, { poBloom: s.bloom, poDrive: s.drive, poHold: s.hold }) }));

// THE SCORE: the eight in a row, every one on the same impulse, on that impulse's lane
const smp = K.impulses().find((r) => r.name === IMP);
if (!smp) { console.error('no captured impulse named ' + IMP + ' in the bank'); process.exit(1); }
const lane = smp.lane >= 0 ? smp.lane : 0, Z = K.zoneMaker(), objects = [], rows = [];
let t = 1;
SET.forEach((s) => {
  objects.push(Z.zone(lane, t, { name: smp.name, label: s.short, variants: { [smp.name]: s.key + '-tail' } }));
  rows.push({ s, t });
  t += GAP_S;
});
const END = t - GAP_S + Math.max(...SET.map((s) => capOf(s) / 1000)) + 1;

const NOTE = 'THE PETALS-LOOP AUDITION (DEC-40 · RUNNING_LOG §201 route (c) · §203): his petals of resonance (the original, his set line) with THE LOOP AROUND THE BANK — an amp in a loop with his 26 partials as the string: the bloom (s to lift 60 dB), the amp\'s drive, the hold (s, then the loop is broken and the bank rings down). Eight bricks ' + GAP_S + ' s apart on ' + IMP + ' — the tails overlap. Every brick asks for ' + IMP + '~pl<NN>-tail; the engine renders them from the bank when the plan is sent with render — ONLY an engine started after 2026-10-07 §203 knows the loop. The sheet: docs/auditions/' + NAME + '.md. Written by tools/build_petals_loop.js; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, 'tools/build_petals_loop.js', K.flag('replace'));
const P = K.writePresets(TAG, presets, 'his petals (the original, his set line) with the loop around the bank — eight settings of bloom · drive · hold, all on ' + IMP, COMMAND);

// THE SHEET
const sheet = [
  '# ' + NAME + ' — the loop around the petals: your set line with an amp behind it',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §201 · §203; DEC-40).*',
  '',
  '**What it is:** eight bricks, ALL on `' + IMP + '`, your petals set line every time (fund 35 Hz · first partial 5 · spread 1.33 · bank B +8.1 st · ring 7 … 15 s), with THE LOOP: the bank\'s sound goes through an amp (a soft clip) and back into the bank — a guitar\'s feedback with your 26 partials as the string. **Bloom** is how long the loop takes to lift the ring 60 dB; **drive** is the amp\'s clipping (the ceiling the bloom meets, and the grit); **hold** is how long the loop is held from the start — then it is broken and the bank rings down on its own. L0 has no loop. The bricks are ' + GAP_S + ' s apart, so the tails overlap.',
  '',
  '**To hear it:** the engine RESTARTED (it must be one started after 2026-10-07 — the loop is new code) · F5 · File ▾ → Experiments → `' + NAME + '` · play from 0 (the renders are in the bank when the plan was sent with render; else a purple brick → **render all planned**). The score is ' + K.clock(END) + ' long.',
  '',
  '| brick | at | bloom s | drive | hold s | preset |',
  '|---|---|---|---|---|---|',
].concat(rows.map((r) => '| **' + r.s.short + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | ' + (r.s.bloom || '—') + ' | ' + r.s.drive + ' | ' + (r.s.hold || '—') + ' | `' + r.s.key + '` |'))
  .concat(['', '**To keep one:** the sample it makes is `' + IMP + '~pl<NN>-tail` in the bank; a return brick anywhere can ask for it — its panel → Processed as → the preset `L<n> …`, envelope `tail`; or its row in `bank/presets.json` is copied onto the shelf at your word. On any process brick the three dials are in the `petalsOrig` row: loop: bloom · loop: amp drive · loop: hold.', '']).join('\n');
const sheetFile = K.writeSheet(NAME, sheet);

rows.forEach((r) => console.log(r.s.short.padEnd(24) + String(r.t).padStart(4) + ' s  ' + r.s.what));
console.log(K.rel(file) + ' written — ' + objects.length + ' return bricks on ' + IMP + ', ' + K.clock(END) + ' long · ' + K.rel(sheetFile) + ' · File ▾ → Experiments → ' + NAME);
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): his engine must be one started after the loop went in (2026-10-07) — then this tool again with --replace --render, or a purple brick → "render all planned".');
