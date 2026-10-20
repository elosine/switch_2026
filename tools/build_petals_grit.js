#!/usr/bin/env node
// build_petals_grit.js — THE PETALS-GRIT AUDITION (his word 2026-10-07, DEC-40 · RUNNING_LOG §201 route (a) · §202): his petals of
// resonance (the ORIGINAL, his set line) STACKED with the chain's later stages, in ONE preset each — the chain is one SynthDef with every
// stage in a fixed order and a mix on each (process.scd line 60), the petals BEFORE the drive, the pedals (overdrive · fuzz · octave ·
// cab), the feedback and the reverbs; the engine reads `effect` as a label only (the args are the controls). So a preset whose args
// turn on two mixes is a stack — no engine change. SEVEN bricks, all on ONE impulse (the one his set line was first heard on), each
// 17 s apart: G0 the reference (the petals alone) · G1 overdrive mild · G2 overdrive hard · G3 fuzz · G4 fuzz + cabinet · G5 the ring
// into the ONE-LOOP feedback with no strings (the "found" row: the loop sustains the petals' own spectrum, the amp's grit, held 6 s)
// · G6 the ring into greyhole. The single-effect rule of DEC-21 was a choice for the dealt variety, not a limit of the chain.
// It writes — 7 presets into bank/presets.json (pg01 … pg07; `deal: false`, `audition: petals-grit`: never dealt; a second run
// replaces only its own) · the score scores/<name>.json, a NEW file · the sheet docs/auditions/<name>.md.
//   node tools/build_petals_grit.js [--name audition-petals-grit] [--impulse bcl-impulse-1] [--replace] [--render] [--port 5500]
// --render   sends the plan to the engine with render 1 (an engine started after the petals stages — any since 2026-10-06 §151).
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its bank, its presets, its scores) — the piece's. The stages are the engine's.
'use strict';
const K = require('./audition_kit.js');
const NAME = K.arg('name', 'audition-petals-grit'), IMP = K.arg('impulse', 'bcl-impulse-1'), PORT = +K.arg('port', 5500);
const TAG = 'petals-grit', CAP_MS = 16000, GAP_S = 17;
const COMMAND = 'node tools/build_petals_grit.js --name ' + NAME + ' --impulse ' + IMP;

// HIS SET LINE (the foot of SynthDef_petalsOfResonance.scd; pair 1 of audition-petals)
const PETALS = { poMix: 1, poFund: 35, poFirst: 5, poSpread: 1.33, poOffset: 8.1, poRingLo: 7, poRingHi: 15, poInLen: 1 };

// THE SEVEN — a name, what is stacked after the petals, the dials (the engine's control names; each stage's mix turns it on)
const STACKS = [
  { key: 'pg01', short: 'G0 reference', name: 'G0 REFERENCE — the petals alone, his set line', what: 'nothing: the petals as heard in audition-petals pair 1', args: {} },
  { key: 'pg02', short: 'G1 overdrive mild', name: 'G1 OVERDRIVE MILD — the ring through a Tube-Screamer-like clip, drive 4, tone 3 kHz', what: 'overdrive · drive 4 · tone 3000 Hz', args: { odMix: 1, odDrive: 4, odTone: 3000 } },
  { key: 'pg03', short: 'G2 overdrive hard', name: 'G2 OVERDRIVE HARD — the same clip, drive 20, tone 2.5 kHz', what: 'overdrive · drive 20 · tone 2500 Hz', args: { odMix: 1, odDrive: 20, odTone: 2500 } },
  { key: 'pg04', short: 'G3 fuzz', name: 'G3 FUZZ — a biased hard clip (a transistor fuzz), gain 30, bias 0.2, tone 3 kHz', what: 'fuzz · gain 30 · bias 0.2 · tone 3000 Hz', args: { fzMix: 1, fzGain: 30, fzBias: 0.2, fzTone: 3000 } },
  { key: 'pg05', short: 'G4 fuzz + cab', name: 'G4 FUZZ + CABINET — the fuzz, then a speaker: low 80 Hz, presence +3 dB, roll-off 5 kHz', what: 'fuzz · gain 30 · bias 0.2 · tone 4000 Hz → cabinet · low 80 · presence +3 · high 5000', args: { fzMix: 1, fzGain: 30, fzBias: 0.2, fzTone: 4000, cabMix: 1, cabLow: 80, cabPres: 3, cabHigh: 5000 } },
  { key: 'pg06', short: 'G5 → one loop', name: 'G5 THE RING INTO THE ONE-LOOP FEEDBACK, no strings — the loop sustains the petals\' own spectrum through the amp; bloom 1 s, held 6 s, drive 6, climb 0.3, wobble 0.4', what: 'feedback · one loop · no strings (the "found" row) · bloom 1 s · hold 6 s · drive 6 · tone 2500 · path 12 ms · climb 0.3 · wobble 0.4', args: { fbMix: 1, fbOwn: 0, fbBloom: 1, fbHold: 6, fbDrive: 6, fbTone: 2500, fbPath: 12, fbClimb: 0.3, fbWobble: 0.4, fbS1: 0, fbS2: 0, fbS3: 0, fbS4: 0, fbS5: 0, fbS6: 0 } },
  { key: 'pg07', short: 'G6 → greyhole', name: 'G6 THE RING INTO GREYHOLE — 0.4 s, size 1, feedback 0.7, 70 % wet', what: 'greyhole · time 0.4 s · damp 0.2 · size 1 · diffusion 0.7 · feedback 0.7 · mod 0.1 at 2 Hz · mix 0.7', args: { ghMix: 0.7, ghTime: 0.4, ghDamp: 0.2, ghSize: 1, ghDiff: 0.7, ghFb: 0.7, ghModDepth: 0.1, ghModFreq: 2 } },
];

// THE PRESETS
const presets = STACKS.map((s) => ({ key: s.key, name: s.name, effect: 'petalsOrig', class: 'time', capMs: CAP_MS, args: Object.assign({}, PETALS, s.args) }));

// THE SCORE: the seven in a row, every one on the same impulse, on that impulse's lane
const smp = K.impulses().find((r) => r.name === IMP);
if (!smp) { console.error('no captured impulse named ' + IMP + ' in the bank'); process.exit(1); }
const lane = smp.lane >= 0 ? smp.lane : 0, Z = K.zoneMaker(), objects = [], rows = [];
let t = 1;
STACKS.forEach((s) => {
  objects.push(Z.zone(lane, t, { name: smp.name, label: s.short, variants: { [smp.name]: s.key + '-tail' } }));
  rows.push({ s, t });
  t += GAP_S;
});

const NOTE = 'THE PETALS-GRIT AUDITION (DEC-40 · RUNNING_LOG §201 route (a) · §202): his petals of resonance (the original, his set line) STACKED with a later stage of the chain in one preset each — the reference, overdrive mild and hard, fuzz, fuzz + cabinet, the ring into the one-loop feedback with no strings, the ring into greyhole; all seven on ' + IMP + '. Every brick asks for ' + IMP + '~pg<NN>-tail; the engine renders them from the bank when the plan is sent with render (a purple brick → render all planned). The sheet: docs/auditions/' + NAME + '.md. Written by tools/build_petals_grit.js; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, 'tools/build_petals_grit.js', K.flag('replace'));
const P = K.writePresets(TAG, presets, 'his petals (the original, his set line) stacked with a later stage of the chain — seven, all on ' + IMP, COMMAND);

// THE SHEET
const sheet = [
  '# ' + NAME + ' — the petals with grit: your set line stacked with the chain\'s later stages',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §201 · §202; DEC-40).*',
  '',
  '**What it is:** seven bricks, ALL on `' + IMP + '`, your petals set line every time (fund 35 Hz · first partial 5 · spread 1.33 · bank B +8.1 st · ring 7 … 15 s). G0 is the petals alone; each of the others is the same ring sent on through ONE later stage of the chain, in the same render — the chain stacks when two mixes are on. Nothing new in the engine.',
  '',
  '**To hear it:** F5 · File ▾ → Experiments → `' + NAME + '` · play from 0 (the renders are in the bank when the plan was sent with render; else a purple brick → **render all planned**). The score is ' + K.clock(t) + ' long.',
  '',
  '| brick | at | after the petals | preset |',
  '|---|---|---|---|',
].concat(rows.map((r) => '| **' + r.s.short + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | ' + r.s.what + ' | `' + r.s.key + '` |'))
  .concat(['', '**To keep one:** the sample it makes is `' + IMP + '~pg<NN>-tail` in the bank; a return brick anywhere can ask for it — its panel → Processed as → the preset `G<n> …`, envelope `tail`; or its row in `bank/presets.json` is copied onto the shelf at your word. A stack is a preset whose args turn on more than one mix — any brick\'s JSON box can do the same by hand.', '']).join('\n');
const sheetFile = K.writeSheet(NAME, sheet);

rows.forEach((r) => console.log(r.s.short.padEnd(20) + String(r.t).padStart(5) + ' s  ' + r.s.what));
console.log(K.rel(file) + ' written — ' + objects.length + ' return bricks on ' + IMP + ', ' + K.clock(t) + ' long · ' + K.rel(sheetFile) + ' · File ▾ → Experiments → ' + NAME);
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): in the page, a purple brick → "render all planned".');
