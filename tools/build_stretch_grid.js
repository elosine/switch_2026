#!/usr/bin/env node
// build_stretch_grid.js — THE STRETCH GRID (his words 2026-10-08, RUNNING_LOG §240; PLAN 10.13; the drones): the two dials of his `icy`
// that he will NOT vary in the music — OVERLAPS (how many grains sound at once) and RAND (how far each grain is cut from the read
// point) — as a small grid on ONE held sound, a few seconds a brick, so he picks ONE pair as the standard setting from then on.
// Everything else is the reference (his icy live of 2015: pace 1/30 · window 0.6 s · expodec) and his decisions: no pitch change ·
// read in order from 0, looping · the stretch alone (mix 1). The grain window, the grain size and the pace are the three he varies
// himself (file B, `audition-drones`); `audition-stretch-dials` is the long form of this (20 s a brick, one dial at a time).
// It writes — the presets into bank/presets.json (dg01 … ; `deal: false`, `audition: stretch-grid` — never dealt; a second run replaces
// only its own) · the score as a NEW file · the sheet docs/auditions/<name>.md.
//   node tools/build_stretch_grid.js [--name audition-stretch-grid] [--input bcl-mp-1] [--len 5000] [--gap 1]
//                                    [--overlaps 4,8,17,40] [--rand 0,0.2,0.5] [--replace] [--render] [--port 5500]
// --render   sends the plan with render 1 to the engine through the score server (an engine started after the loop went in — 2026-10-06).
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its bank, its presets, its scores) — the piece's. The stage is the engine's.
'use strict';
const path = require('path');
const K = require('./audition_kit.js');
const NAME = K.arg('name', 'audition-stretch-grid'), PORT = +K.arg('port', 5500);
const INPUT = K.arg('input', 'bcl-mp-1'), TARGET_MS = +K.arg('len', 5000), GAP_S = +K.arg('gap', 1);
const OVERLAPS = K.arg('overlaps', '4,8,17,40').split(',').map(Number), RANDS = K.arg('rand', '0,0.2,0.5').split(',').map(Number);
const TAG = 'stretch-grid', TOOL = 'tools/build_stretch_grid.js';
const COMMAND = 'node ' + TOOL + ' --name ' + NAME + ' --input ' + INPUT + ' --len ' + TARGET_MS + ' --gap ' + GAP_S + ' --overlaps ' + OVERLAPS.join(',') + ' --rand ' + RANDS.join(',');
const REF = { icMix: 1, icSpeed: 0.0333, icFromMs: 0, icWin: 0.6, icOverlaps: 17, icRand: 0.2, icPitch: 0, icEnv: 4, icLoop: 1 };

// THE INPUT — as the bank holds it (the latest take)
const INDEX = K.readJson(path.join(K.ROOT, 'bank', 'samples', 'index.json')).samples || [];
const row = INDEX.filter((r) => r.name === INPUT).sort((a, b) => String(b.captured).localeCompare(String(a.captured)))[0];
if (!row) { console.error(INPUT + ' is not in the bank — play scores/drone-sources through with the engine up first (bank/samples/index.json)'); process.exit(4); }
const inp = { name: INPUT, lane: row.lane >= 0 ? row.lane : 0, lengthMs: +row.lengthMs || 0 };
// a tail render runs the source's length plus capMs (process.scd: total = srcDur/rate + capMs) — so the cap is the target less the source
const capMs = Math.max(1000, Math.round(TARGET_MS - inp.lengthMs));
const nn = (i) => String(i).padStart(2, '0');

// THE GRID — by overlaps, then rand
const presets = [], objects = [], rows = [], Z = K.zoneMaker();
let t = 1;
OVERLAPS.forEach((ov) => RANDS.forEach((rd) => {
  const n = rows.length + 1, key = 'dg' + nn(n), args = Object.assign({}, REF, { icOverlaps: ov, icRand: rd });
  presets.push({ key, name: 'G' + n + ' overlaps ' + ov + ' · rand ' + rd + ' · pace 1/30 · window 0.6 s · expodec · looping from 0 · on ' + inp.name, effect: 'icy', class: 'time', capMs, args });
  objects.push(Z.zone(inp.lane, t, { name: inp.name, label: 'G' + n + ' · ov ' + ov + ' · rand ' + rd, variants: { [inp.name]: key + '-tail' } }));
  rows.push({ n, t, ov, rd, key });
  t += TARGET_MS / 1000 + GAP_S;
}));
const len = t;

// WRITE — the score, the presets, the sheet
const NOTE = 'THE STRETCH GRID (RUNNING_LOG §240; PLAN 10.13): his icy on ONE input, ' + inp.name + ' — overlaps ' + OVERLAPS.join(' · ') + ' × rand ' + RANDS.join(' · ') + ', ' + (TARGET_MS / 1000) + ' s a brick, everything else the reference (pace 1/30 · window 0.6 s · expodec · looping from 0 · no pitch change). He picks ONE pair as the standard setting. Every brick asks for ' + inp.name + '~dg<NN>-tail. The sheet: docs/auditions/' + NAME + '.md. Written by ' + TOOL + '; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, TOOL, K.flag('replace'));
const P = K.writePresets(TAG, presets, 'the stretch grid — overlaps × rand on one held sound (' + rows.length + ' bricks)', COMMAND);
const sheet = [
  '# ' + NAME + ' — overlaps × rand on one held sound: the pair you will not vary',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §240; PLAN 10.13).*',
  '',
  '**What it is:** ' + rows.length + ' bricks on ONE input, `' + inp.name + '` (' + Math.round(inp.lengthMs) + ' ms), ' + (TARGET_MS / 1000) + ' s each, ' + GAP_S + ' s apart. A grid of the two dials you will not vary in the music — **overlaps** (' + OVERLAPS.join(' · ') + ') × **rand** (' + RANDS.join(' · ') + ') — everything else the reference: pace 1/30 · window 0.6 s · expodec · reading in order from 0 and looping · no pitch change · the stretch alone. The grain window, the grain size and the pace are yours to vary afterwards.',
  '',
  '**To hear it:** F5 · File ▾ → Experiments → `' + NAME + '` · play from 0 (rendered from the tool; if a brick plays dry, a purple brick → **render all planned**). The score is ' + K.clock(len) + ' long.',
  '',
  '**What to listen for:** overlaps — few and each grain is heard as a pulse, a flutter; from about 8 they merge; 40 is a dense chorus (the loudness is compensated). rand — 0 is a strict grid, a buzz or comb colour at the window rate; 0.2 breaks it; 0.5 smears the read point by half a window, a blur.',
  '',
  '| brick | at | overlaps | rand | preset |',
  '|---|---|---|---|---|',
].concat(rows.map((r) => '| **G' + r.n + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | ' + r.ov + ' | ' + r.rd + ' | `' + r.key + '` |'))
  .concat(['', '**To keep one:** say its brick — its overlaps and rand become the reference of the next file. Its sample is `' + inp.name + '~dg<NN>-tail` in the bank; the whole setting is the preset\'s row in `bank/presets.json`.', '']).join('\n');
const s = K.writeSheet(NAME, sheet);

rows.forEach((r) => console.log('G' + String(r.n).padStart(2) + '  ' + String(r.t.toFixed(0)).padStart(4) + ' s  overlaps ' + String(r.ov).padEnd(3) + ' rand ' + r.rd));
console.log(K.rel(file) + ' — ' + objects.length + ' bricks, ' + K.clock(len) + ' · ' + K.rel(s));
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): in the page, a purple brick → "render all planned".');
