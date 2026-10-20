#!/usr/bin/env node
// build_drone_auditions.js — THE TWO DRONE LISTENING FILES (his words 2026-10-06, DEC-34 · 34b; PLAN.md 10.13 e; RUNNING_LOG §171):
// the held sounds of bank/drone_sources.json (captured by his pass of scores/drone-sources) stretched into drones with his `icy`.
//   FILE A — `audition-stretch-dials`: ONE input (the bass clarinet multiphonic), the REFERENCE (his icy live of 2015: pace 1/30 ·
//            window 0.6 s · 17 overlaps · rand 0.2 · expodec; from 0, looping), then ONE DIAL CHANGED AT A TIME — overlaps 2 · 4 · 8 · 40,
//            rand 0 · 0.1 · 0.3 · 0.6 · 1 — and THE SEAM: the reference at pace ½ for 30 s, so the loop's join is heard twice.
//            The determination behind it is RUNNING_LOG §168: these are the dials that change a stretch's sound beside the three he varies.
//   FILE B — `audition-drones`: the NINE inputs × 8 bricks = 72, an ASSORTMENT of the three things he varies — the grain window (Hann
//            + his ten), the grain size (0.15 · 0.5 · 1.2 s) and the read head's pace (¼ · 1/10 · 1/30 · 1/100) — dealt so every window
//            comes 6 or 7 times, every size 24, every pace 18, each input's eight distinct; by input, fast to slow. Overlaps · rand at
//            the reference; no pitch change (his word). Each brick 20 s (the render's cap = 20 s minus the source's length).
// It writes — the presets into bank/presets.json (da01 … da11 · dr01 … dr72; `deal: false`, `audition: drones` — never dealt onto the
// main score; a second run replaces only its own) · the two scores as NEW files · the two sheets docs/auditions/<name>.md.
//   node tools/build_drone_auditions.js [--a audition-stretch-dials] [--b audition-drones] [--input bcl-mp-1] [--len 20000] [--gap 2]
//                                       [--replace] [--render] [--port 5500]
// --render   sends the plan with render 1 — ONLY to an engine started after the loop went into electronics/sc/process.scd (an older one
//            drops the unknown dial and banks a holding stretch under the looping name). Without it: a purple brick → "render all planned".
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its bank, its presets, its scores, its inputs) — the piece's. The stage and its loop are the engine's.
'use strict';
const path = require('path');
const K = require('./audition_kit.js');
const A_NAME = K.arg('a', 'audition-stretch-dials'), B_NAME = K.arg('b', 'audition-drones'), PORT = +K.arg('port', 5500);
const INPUT_A = K.arg('input', 'bcl-mp-1'), TARGET_MS = +K.arg('len', 20000), GAP_S = +K.arg('gap', 2);
const TAG = 'drones', TOOL = 'tools/build_drone_auditions.js';
const COMMAND = 'node ' + TOOL + ' --a ' + A_NAME + ' --b ' + B_NAME + ' --input ' + INPUT_A + ' --len ' + TARGET_MS + ' --gap ' + GAP_S;
const ENVS = ['Hann (built in)', '3-stage linear', 'Blackman', 'Blackman-Harris', 'expodec', 'gauss', 'Hamming', 'hanning', 'quasi-gauss', 'rexpodec', 'tri'];
const PACES = [{ label: '1/4', speed: 0.25 }, { label: '1/10', speed: 0.1 }, { label: '1/30', speed: 0.0333 }, { label: '1/100', speed: 0.01 }];
const SIZES = [0.15, 0.5, 1.2];
const REF = { icMix: 1, icSpeed: 0.0333, icFromMs: 0, icWin: 0.6, icOverlaps: 17, icRand: 0.2, icPitch: 0, icEnv: 4, icLoop: 1 };

// THE INPUTS — bank/drone_sources.json's rows, as the bank holds them (the latest take of each)
const D = K.readJson(path.join(K.ROOT, 'bank', 'drone_sources.json'));
const INDEX = K.readJson(path.join(K.ROOT, 'bank', 'samples', 'index.json')).samples || [];
const rowOf = (name) => INDEX.filter((r) => r.name === name).sort((a, b) => String(b.captured).localeCompare(String(a.captured)))[0];
const inputs = D.inputs.map((x) => {
  const r = rowOf(x.name);
  if (!r) { console.error(x.name + ' is not in the bank — play scores/drone-sources through with the engine up first (bank/samples/index.json)'); process.exit(4); }
  return { name: x.name, label: x.label, lane: r.lane >= 0 ? r.lane : 0, lengthMs: +r.lengthMs || 0, player: r.player };
});
const inA = inputs.find((x) => x.name === INPUT_A);
if (!inA) { console.error('--input ' + INPUT_A + ' is not one of the drone sources: ' + inputs.map((x) => x.name).join(' · ')); process.exit(2); }
// a tail render runs the source's length plus capMs (process.scd: total = srcDur/rate + capMs) — so the cap is the target less the source
const capFor = (inp, totalMs) => Math.max(1000, Math.round(totalMs - inp.lengthMs));
const paceLabel = (sp) => { const p = PACES.find((q) => Math.abs(q.speed - sp) < 1e-6); return p ? p.label : (sp >= 1 ? sp + '×' : '1/' + Math.round(1 / sp)); };
const dials = (a) => 'pace ' + paceLabel(a.icSpeed) + ' · window ' + a.icWin + ' s · ' + a.icOverlaps + ' overlaps · rand ' + a.icRand + ' · ' + ENVS[a.icEnv] + (a.icLoop ? ' · looping from 0' : ' · held at the end');
const nn = (i) => String(i).padStart(2, '0');
const presets = [], Z = K.zoneMaker();

// FILE A — one input, one dial at a time
const aList = [
  { tag: 'ref', what: 'THE REFERENCE — his icy live (2015), looping from 0', args: {} },
  ...[2, 4, 8, 40].map((ov) => ({ tag: 'ov ' + ov, what: 'overlaps ' + ov + ' (the reference has 17)', args: { icOverlaps: ov } })),
  ...[0, 0.1, 0.3, 0.6, 1].map((rd) => ({ tag: 'rand ' + rd, what: 'rand ' + rd + ' (the reference has 0.2)', args: { icRand: rd } })),
  { tag: 'seam ½ · 30 s', what: 'THE SEAM — the reference at pace ½ for 30 s: the loop joins at about 10 and 20 s', args: { icSpeed: 0.5 }, totalMs: 30000 },
];
const objA = [], rowsA = [];
let t = 1;
aList.forEach((v, i) => {
  const n = i + 1, key = 'da' + nn(n), args = Object.assign({}, REF, v.args), total = v.totalMs || TARGET_MS;
  presets.push({ key, name: 'A' + n + ' ' + v.what + ' · ' + dials(args) + ' · on ' + inA.name, effect: 'icy', class: 'time', capMs: capFor(inA, total), args });
  objA.push(Z.zone(inA.lane, t, { name: inA.name, label: 'A' + n + ' ' + v.tag, variants: { [inA.name]: key + '-tail' } }));
  rowsA.push({ n, t, v, args, key, total });
  t += total / 1000 + GAP_S;
});
const lenA = t;

// FILE B — the nine inputs, eight bricks each: a balanced assortment of grain window × grain size × pace
const objB = [], rowsB = [];
t = 1;
inputs.forEach((inp, i) => {
  const combos = [];
  for (let j = 0; j < 8; j++) combos.push({ env: (i * 8 + j) % ENVS.length, size: SIZES[(i + j) % SIZES.length], pace: PACES[(j + 2 * i) % PACES.length] });
  combos.sort((a, b) => b.pace.speed - a.pace.speed || a.size - b.size);   // within an input: fast to slow, then small to large
  combos.forEach((c) => {
    const n = rowsB.length + 1, key = 'dr' + nn(n), args = Object.assign({}, REF, { icSpeed: c.pace.speed, icWin: c.size, icEnv: c.env });
    presets.push({ key, name: 'B' + n + ' ' + inp.name + ' · ' + dials(args), effect: 'icy', class: 'time', capMs: capFor(inp, TARGET_MS), args });
    objB.push(Z.zone(inp.lane, t, { name: inp.name, label: 'B' + n + ' · ' + c.pace.label + ' · ' + c.size + ' s · ' + ENVS[c.env], variants: { [inp.name]: key + '-tail' } }));
    rowsB.push({ n, t, inp, c, key, args });
    t += TARGET_MS / 1000 + GAP_S;
  });
});
const lenB = t;

// the balance, said
const count = (xs, f) => xs.reduce((m, x) => { const k = f(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const envCounts = count(rowsB, (r) => ENVS[r.c.env]), sizeCounts = count(rowsB, (r) => r.c.size + ' s'), paceCounts = count(rowsB, (r) => r.c.pace.label);

// WRITE — the scores, the presets, the sheets
const NOTE_A = 'FILE A OF THE DRONES (DEC-34 · 34b; PLAN 10.13; RUNNING_LOG §171): his icy on ONE input, ' + inA.name + ' — the reference (his icy live of 2015, looping from 0), then one dial changed at a time: overlaps 2 · 4 · 8 · 40, rand 0 · 0.1 · 0.3 · 0.6 · 1, and the seam (pace ½, 30 s). Every brick asks for ' + inA.name + '~da<NN>-tail; the engine renders them from the bank when the plan is sent (a purple brick → render all planned, with an engine started after the loop went in). The sheet: docs/auditions/' + A_NAME + '.md. Written by ' + TOOL + '; his from then on.';
const NOTE_B = 'FILE B OF THE DRONES (DEC-34 · 34b; PLAN 10.13; RUNNING_LOG §171): the nine held sounds × 8 = 72 drones with his icy — an assortment of the grain window (Hann + his ten), the grain size (0.15 · 0.5 · 1.2 s) and the read head\'s pace (1/4 · 1/10 · 1/30 · 1/100), by input, fast to slow; overlaps 17 · rand 0.2 · looping from 0 · no pitch change. Every brick asks for <input>~dr<NN>-tail. The sheet: docs/auditions/' + B_NAME + '.md. Written by ' + TOOL + '; his from then on.';
const fileA = K.writeScore(A_NAME, objA, Z.nextId(), NOTE_A, TOOL, K.flag('replace'));
const fileB = K.writeScore(B_NAME, objB, Z.nextId(), NOTE_B, TOOL, K.flag('replace'));
const P = K.writePresets(TAG, presets, 'the drone auditions — A: icy\'s other dials on one input (' + rowsA.length + ' bricks); B: the nine held sounds × grain window × grain size × pace (' + rowsB.length + ' bricks)', COMMAND);

const who = (inp) => '`' + inp.name + '` — ' + inp.label + ' (' + Math.round(inp.lengthMs) + ' ms)';
const sheetA = [
  '# ' + A_NAME + ' — icy\'s other dials, one at a time, on one held sound',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §171; DEC-34 · 34b; PLAN 10.13).*',
  '',
  '**What it is:** ' + rowsA.length + ' bricks on ONE input, ' + who(inA) + '. Brick A1 is the reference — your *icy live* of 2015 (pace 1/30 · window 0.6 s · 17 overlaps · rand 0.2 · expodec), reading the source in order from 0 and looping. Every other brick changes ONE dial from it. The grain window, the grain size and the pace — the three you vary yourself — are the same in every brick but the last.',
  '',
  '**To hear it:** the engine restarted (the loop is new code) · F5 · File ▾ → Experiments → `' + A_NAME + '` · click any purple brick → **render all planned** (' + rowsA.length + ' renders of 20 … 30 s; wait for the engine\'s window to go quiet) · play from 0. The score is ' + K.clock(lenA) + ' long.',
  '',
  '**What to listen for:**',
  '',
  '- **overlaps** (A2 … A5) — how many grains sound at once. Few (2 · 4) and each grain\'s envelope is heard as a pulse, a flutter; from about 8 they merge; 40 is a dense chorus. The loudness is compensated — what changes is the texture.',
  '- **rand** (A6 … A10) — how far each grain is cut from the read point, as a fraction of the window. 0 is a strict grid: a buzz or comb colour at the window rate; 0.1 … 0.3 breaks it; 0.6 … 1 smears the head\'s place by a whole window — a blur, a chorusing.',
  '- **the seam** (A11) — the reference at pace ½ for 30 s: a ' + Math.round(inA.lengthMs) + ' ms source laps every ' + (Math.round(inA.lengthMs * 2 / 100) / 10) + ' s, so the loop\'s join — the end of the sound meeting its beginning — is heard many times. If it is heard as a bump, the source\'s crop and fades for a loop are the next item (10.13 f).',
  '',
  '| brick | at | what changes | pace | window | overlaps | rand | grain env | length | preset |',
  '|---|---|---|---|---|---|---|---|---|---|',
].concat(rowsA.map((r) => '| **A' + r.n + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | ' + r.v.what + ' | ' + paceLabel(r.args.icSpeed) + ' | ' + r.args.icWin + ' s | ' + r.args.icOverlaps + ' | ' + r.args.icRand + ' | ' + ENVS[r.args.icEnv] + ' | ' + Math.round(r.total / 1000) + ' s | `' + r.key + '` |'))
  .concat(['', '**To keep one:** its sample is `' + inA.name + '~da<NN>-tail` in the bank; any return brick can ask for it — its panel → Processed as → the preset `A<N> …`, envelope `tail`. The whole setting is the preset\'s row in `bank/presets.json`.', '']).join('\n');
const sheetB = [
  '# ' + B_NAME + ' — the nine held sounds stretched into drones: grain window × grain size × pace',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §171; DEC-34 · 34b; PLAN 10.13).*',
  '',
  '**What it is:** ' + rowsB.length + ' drones, ' + (rowsB.length / inputs.length) + ' on each of the nine held sounds, each 20 s. An assortment of the three things you vary: the **grain window** (Warp1\'s Hann and your ten: ' + Object.keys(envCounts).map((k) => k + ' ×' + envCounts[k]).join(', ') + '), the **grain size** (' + Object.keys(sizeCounts).map((k) => k + ' ×' + sizeCounts[k]).join(', ') + ') and the **pace** of the read head (' + Object.keys(paceCounts).map((k) => k + ' ×' + paceCounts[k]).join(', ') + '). Each input\'s eight are distinct and run fast to slow. Everything else is the reference: 17 overlaps · rand 0.2 · reading in order from 0 and looping · no pitch change.',
  '',
  '**To hear it:** the engine restarted (the loop is new code) · F5 · File ▾ → Experiments → `' + B_NAME + '` · click any purple brick → **render all planned** (' + rowsB.length + ' renders of 20 s, two at a time — a few minutes; wait for the engine\'s window to go quiet) · play from 0, or from an input\'s first brick. The score is ' + K.clock(lenB) + ' long.',
  '',
  '**The inputs, in order:** ' + inputs.map((x, i) => '**' + (i + 1) + '.** ' + who(x) + ' at ' + K.clock(rowsB[i * 8].t)).join(' · '),
  '',
  '| brick | at | input | pace | grain size | grain env | preset |',
  '|---|---|---|---|---|---|---|',
].concat(rowsB.map((r) => '| **B' + r.n + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | `' + r.inp.name + '` — ' + (K.PLAYERS[r.inp.player] || r.inp.player) + ' | ' + r.c.pace.label + ' | ' + r.c.size + ' s | ' + ENVS[r.c.env] + ' | `' + r.key + '` |'))
  .concat(['', '**To keep one:** its sample is `<input>~dr<NN>-tail` in the bank; any return brick can ask for it — its panel → Processed as → the preset `B<N> …`, envelope `tail`. A pace, a size or a window you like on one input goes onto another input by hand in the panel (the icy effect\'s dials), or as a row of the next file.', '']).join('\n');
const sA = K.writeSheet(A_NAME, sheetA), sB = K.writeSheet(B_NAME, sheetB);

rowsA.forEach((r) => console.log('A' + String(r.n).padStart(2) + '  ' + String(r.t.toFixed(0)).padStart(4) + ' s  ' + r.v.what.padEnd(62) + dials(r.args)));
console.log(K.rel(fileA) + ' — ' + objA.length + ' bricks, ' + K.clock(lenA) + ' · ' + K.rel(sA));
rowsB.forEach((r) => console.log('B' + String(r.n).padStart(2) + '  ' + String(r.t.toFixed(0)).padStart(4) + ' s  lane ' + r.inp.lane + '  ' + r.inp.name.padEnd(18) + r.c.pace.label.padEnd(6) + (r.c.size + ' s').padEnd(7) + ENVS[r.c.env]));
console.log(K.rel(fileB) + ' — ' + objB.length + ' bricks, ' + K.clock(lenB) + ' · ' + K.rel(sB));
console.log('the balance of B — windows: ' + Object.keys(envCounts).map((k) => k + ' ' + envCounts[k]).join(', ') + ' · sizes: ' + Object.keys(sizeCounts).map((k) => k + ' ' + sizeCounts[k]).join(', ') + ' · paces: ' + Object.keys(paceCounts).map((k) => k + ' ' + paceCounts[k]).join(', '));
if (K.flag('render')) K.sendPlan(K.planLines(objA.concat(objB), P), PORT);
else console.log('the plan was NOT sent (no --render): in the page, a purple brick → "render all planned" — with an engine started AFTER the loop went into electronics/sc/process.scd.');
