#!/usr/bin/env node
// build_petals_spectrum.js — THE PETALS-SPECTRUM AUDITION (his word 2026-10-07, DEC-41 · RUNNING_LOG §207): a VARIETY of filter-bank
// settings for his petals of resonance (the original), the fundamentals running the spectrum from pretty low to relatively high, in
// order — N bricks, GAP s apart, each a drawn setting (seeded): the fundamental placed evenly on a log scale from FLO to FHI Hz (a little
// jitter), the first partial, the spread, bank B's offset and the ring drawn from the ranges his file names. SOME CLEAN, SOME OVERDRIVEN:
// about half the bricks are the petals alone; the rest carry one of the four grits he kept from audition-petals-grit (DEC-41: overdrive
// mild · overdrive hard · fuzz · the ring into the one-loop feedback), dealt round robin. Each brick on another captured impulse (another
// player each time), unless --impulse pins one.
// It writes — N presets into bank/presets.json (ps01 … ; `deal: false`, `audition: petals-spectrum`; a second run replaces only its own)
// · the score scores/<name>.json, a NEW file · the sheet docs/auditions/<name>.md.
//   node tools/build_petals_spectrum.js [--name audition-petals-spectrum] [--n 56] [--gap 6] [--seed 1] [--flo 25] [--fhi 400]
//                                       [--clean 0.5] [--impulse <name>] [--replace] [--render] [--port 5500]
// --render   sends the plan to the engine with render 1 (any engine started after 2026-10-06 §151 has the petals; the grits are older).
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its bank, its presets, its scores) — the piece's. The stages are the engine's.
'use strict';
const K = require('./audition_kit.js');
const NAME = K.arg('name', 'audition-petals-spectrum'), N = Math.max(2, +K.arg('n', 56)), GAP = +K.arg('gap', 6), SEED = +K.arg('seed', 1);
const FLO = +K.arg('flo', 25), FHI = +K.arg('fhi', 400), CLEAN = Math.min(1, Math.max(0, +K.arg('clean', 0.5))), IMP = K.arg('impulse', ''), PORT = +K.arg('port', 5500);
const TAG = 'petals-spectrum', CAP_MS = 16000;
const COMMAND = 'node tools/build_petals_spectrum.js --name ' + NAME + ' --n ' + N + ' --gap ' + GAP + ' --seed ' + SEED + ' --flo ' + FLO + ' --fhi ' + FHI + ' --clean ' + CLEAN + (IMP ? ' --impulse ' + IMP : '');

// THE FOUR GRITS HE KEPT (audition-petals-grit G1 · G2 · G3 · G5 — the shelf's rows 8 … 11)
const GRITS = [
  { key: 'od-mild', short: 'overdrive mild', args: { odMix: 1, odDrive: 4, odTone: 3000 } },
  { key: 'od-hard', short: 'overdrive hard', args: { odMix: 1, odDrive: 20, odTone: 2500 } },
  { key: 'fuzz', short: 'fuzz', args: { fzMix: 1, fzGain: 30, fzBias: 0.2, fzTone: 3000 } },
  { key: 'loop', short: '→ one loop', args: { fbMix: 1, fbOwn: 0, fbBloom: 1, fbHold: 6, fbDrive: 6, fbTone: 2500, fbPath: 12, fbClimb: 0.3, fbWobble: 0.4, fbS1: 0, fbS2: 0, fbS3: 0, fbS4: 0, fbS5: 0, fbS6: 0 } },
];

// THE SETTINGS: the fundamental up the spectrum, the rest drawn
const rnd = K.mulberry32(SEED * 2654435761 + 4111);
const u = (lo, hi, dec) => +(lo + rnd() * (hi - lo)).toFixed(dec);
const lo = Math.log(FLO), hi = Math.log(FHI);
const settings = [];
for (let i = 0; i < N; i++) {
  const pos = (i + 0.5) / N + (rnd() - 0.5) * 0.6 / N;   // evenly up the log scale, a little jitter inside the step
  const fund = +Math.exp(lo + (hi - lo) * Math.min(1, Math.max(0, pos))).toFixed(1);
  const ringLo = u(7, 10, 1), ringHi = Math.min(15, +(ringLo + u(1.5, 5, 1)).toFixed(1));
  settings.push({ fund, first: u(1, 5, 2), spread: u(0.33, 1.33, 2), offset: u(2, 8, 2), ringLo, ringHi });
}
// which carry a grit: a seeded choice of about (1 − CLEAN) of them, the four grits dealt round robin over those
const gritAt = settings.map(() => rnd() >= CLEAN);
let g = 0;
settings.forEach((s, i) => { s.grit = gritAt[i] ? GRITS[g++ % GRITS.length] : null; });

const nn = (i) => String(i + 1).padStart(2, '0');
const dials = (s) => 'fund ' + s.fund + ' Hz · first partial ' + s.first + ' · spread ' + s.spread + ' · bank B +' + s.offset + ' st · ring ' + s.ringLo + ' … ' + s.ringHi + ' s';
const lowest = (s) => Math.round(s.fund * s.first), highest = (s) => Math.round(s.fund * (s.first + s.spread * 12) * Math.pow(2, s.offset / 12));
const args = (s) => Object.assign({ poMix: 1, poFund: s.fund, poFirst: s.first, poSpread: s.spread, poOffset: s.offset, poRingLo: s.ringLo, poRingHi: s.ringHi, poInLen: 1 }, s.grit ? s.grit.args : {});

// THE PRESETS
const presets = settings.map((s, i) => ({ key: 'ps' + nn(i), name: (i + 1) + ' · ' + (s.grit ? s.grit.short.toUpperCase() : 'CLEAN') + ' — petals · ' + dials(s) + ' (partials ' + lowest(s) + ' … ' + highest(s) + ' Hz)', effect: 'petalsOrig', class: 'time', capMs: CAP_MS, args: args(s) }));

// THE SCORE: in order up the spectrum, every GAP seconds, each on another impulse (or the one pinned)
const all = K.impulses(), pinned = IMP ? all.find((r) => r.name === IMP) : null;
if (IMP && !pinned) { console.error('no captured impulse named ' + IMP + ' in the bank'); process.exit(1); }
const pick = K.spread(all), Z = K.zoneMaker(), objects = [], rows = [];
settings.forEach((s, i) => {
  const smp = pinned || pick(i), t = 1 + i * GAP;
  objects.push(Z.zone(smp.lane >= 0 ? smp.lane : 0, t, { name: smp.name, label: (i + 1) + ' · ' + Math.round(s.fund) + ' Hz' + (s.grit ? ' · ' + s.grit.short : ''), variants: { [smp.name]: 'ps' + nn(i) + '-tail' } }));
  rows.push({ i, s, smp, t });
});
const END = 1 + (N - 1) * GAP + CAP_MS / 1000 + 1;

const NOTE = 'THE PETALS-SPECTRUM AUDITION (DEC-41 · RUNNING_LOG §207): ' + N + ' settings of his petals of resonance (the original), the fundamental running up the spectrum from ' + FLO + ' to ' + FHI + ' Hz in order, the other dials drawn (seed ' + SEED + '); about half clean, the rest through one of the four grits he kept (overdrive mild · overdrive hard · fuzz · the one loop), round robin; a brick every ' + GAP + ' s, each on another captured impulse. Every brick asks for <impulse>~ps<NN>-tail; the engine renders them when the plan is sent with render. The sheet: docs/auditions/' + NAME + '.md. Written by tools/build_petals_spectrum.js; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, 'tools/build_petals_spectrum.js', K.flag('replace'));
const P = K.writePresets(TAG, presets, 'his petals (the original) across the spectrum — ' + N + ' settings, the fundamental ' + FLO + ' … ' + FHI + ' Hz in order, about half with one of the four kept grits (seed ' + SEED + ')', COMMAND);

// THE SHEET
const sheet = [
  '# ' + NAME + ' — the petals across the spectrum: ' + N + ' filter-bank settings, some clean, some overdriven',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §207; DEC-41).*',
  '',
  '**What it is:** ' + N + ' settings of your petals (the original), in order from a fundamental of ' + FLO + ' Hz up to ' + FHI + ' Hz; the first partial, the spread, bank B\'s offset and the ring drawn from the ranges your file names. About half are the petals alone; the others go on through one of the four grits you kept from `audition-petals-grit` — overdrive mild · overdrive hard · fuzz · the ring into the one-loop feedback — dealt in turn. A brick every ' + GAP + ' s, each on another captured impulse (another player each time). The score is ' + K.clock(END) + ' long.',
  '',
  '**To hear it:** F5 · File ▾ → Experiments → `' + NAME + '` · play from 0.',
  '',
  '| brick | at | fund Hz | partials Hz | first partial | spread | bank B + st | ring s | after the petals | impulse | preset |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
].concat(rows.map((r) => '| **' + (r.i + 1) + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | ' + r.s.fund + ' | ' + lowest(r.s) + ' … ' + highest(r.s) + ' | ' + r.s.first + ' | ' + r.s.spread + ' | ' + r.s.offset + ' | ' + r.s.ringLo + ' … ' + r.s.ringHi + ' | ' + (r.s.grit ? r.s.grit.short : 'clean') + ' | `' + r.smp.name + '` — ' + (K.PLAYERS[r.smp.player] || r.smp.player) + ' | `ps' + nn(r.i) + '` |'))
  .concat(['', '**To keep one:** its row in `bank/presets.json` (`ps<NN>`) onto the shelf at your word, or a return brick anywhere → Processed as → `<number> · …`, envelope `tail`. The "partials" column is the lowest partial of bank A to the highest of bank B.', '']).join('\n');
const sheetFile = K.writeSheet(NAME, sheet);

rows.forEach((r) => console.log(String(r.i + 1).padStart(2) + '  ' + String(r.t).padStart(4) + ' s  ' + String(r.s.fund).padStart(6) + ' Hz  ' + (r.s.grit ? r.s.grit.short : 'clean').padEnd(15) + r.smp.name.padEnd(16) + ' partials ' + lowest(r.s) + ' … ' + highest(r.s)));
console.log(K.rel(file) + ' written — ' + N + ' return bricks, ' + rows.filter((r) => !r.s.grit).length + ' clean · ' + rows.filter((r) => r.s.grit).length + ' with a grit, ' + K.clock(END) + ' long · ' + K.rel(sheetFile) + ' · File ▾ → Experiments → ' + NAME);
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): in the page, a purple brick → "render all planned".');
