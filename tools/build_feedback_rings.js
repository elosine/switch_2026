#!/usr/bin/env node
// build_feedback_rings.js — THE FEEDBACK-RINGS AUDITION (his word 2026-10-07, DEC-40 · RUNNING_LOG §201 route (b) · §203): the feedback
// with its STRINGS AS RINGING PARTIALS (`fbRes` 1 — a Ringz at the string's pitch, unity at its resonance, instead of a comb) on a few of
// his chord shapes (bank/harmonies.json), THREE WAYS each: (i) the ONE LOOP (fbOwn 0), the strings ringing 1.5 s — a partial in a loop
// takes off alone, the amp shared: the strongest wins, as a guitar's feedback picks one note · (ii) the one loop with the strings ringing
// 6 s — a deeper resonance, a slower fall after the loop is broken · (iii) EACH STRING SINGS (fbOwn 1) — a chord of clipped partials.
// The other dials are the shelf's row BASE (7: the slow bloom). Bricks GAP s apart (his word: "two or three seconds" — the tails overlap).
// It writes — 3 × N presets into bank/presets.json (fr001a · fr001b · fr001c …; `deal: false`, `audition: feedback-rings`; a second run
// replaces only its own) · the score scores/<name>.json, a NEW file · the sheet docs/auditions/<name>.md.
//   node tools/build_feedback_rings.js [--name audition-feedback-rings] [--n 6] [--shapes 1,5,12] [--base 7] [--gap 3] [--cap 14000] [--replace] [--render] [--port 5500]
// --shapes   which rows of the bank's chord shapes (1-based, in the bank's order); else the first N
// --render   sends the plan to the engine with render 1 — ONLY on an engine STARTED AFTER fbRes went into electronics/sc/process.scd
//            (2026-10-07, §203): an older one leaves the dial out and renders the combs under the partials' names.
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its bank, its shapes, its presets, its scores) — the piece's. The switch is the engine's.
'use strict';
const path = require('path');
const K = require('./audition_kit.js');
const NAME = K.arg('name', 'audition-feedback-rings'), N = Math.max(1, +K.arg('n', 6)), BASE = +K.arg('base', 7), GAP = +K.arg('gap', 3), CAP_MS = +K.arg('cap', 14000), PORT = +K.arg('port', 5500);
const WHICH = K.arg('shapes', '') ? String(K.arg('shapes', '')).split(',').map((s) => +s).filter((n) => n > 0) : null;
const TAG = 'feedback-rings';
const COMMAND = 'node tools/build_feedback_rings.js --name ' + NAME + (WHICH ? ' --shapes ' + WHICH.join(',') : ' --n ' + N) + ' --base ' + BASE + ' --gap ' + GAP + ' --cap ' + CAP_MS;

const all = (((K.readJson(path.join(K.ROOT, 'bank', 'harmonies.json')).banks || {}).chordShapes || {}).entries || []).filter((e) => Array.isArray(e.pitches) && e.pitches.length);
if (!all.length) { console.error('no chord shapes in bank/harmonies.json (banks.chordShapes.entries)'); process.exit(4); }
const shapes = WHICH ? WHICH.map((n) => all[n - 1]).filter(Boolean) : all.slice(0, N);
const shelf = (K.readJson(path.join(K.ROOT, 'bank', 'candidates.json')).rows || []).find((r) => r.n === BASE);
if (!shelf || !shelf.setting || shelf.setting.effect !== 'feedback') { console.error('row ' + BASE + ' of bank/candidates.json is not a kept setting of the feedback'); process.exit(2); }
const base = Object.assign({}, shelf.setting.args);
['fbS1', 'fbS2', 'fbS3', 'fbS4', 'fbS5', 'fbS6', 'fbOwn', 'fbRes', 'fbRing'].forEach((k) => { delete base[k]; });
const baseSays = 'bloom ' + base.fbBloom + ' s · hold ' + base.fbHold + ' s · drive ' + base.fbDrive + ' · tone ' + base.fbTone + ' Hz';

// THE THREE WAYS
const WAYS = [
  { s: 'a', short: 'one loop · ring 1.5', name: 'ONE LOOP, the strings as partials ringing 1.5 s — the strongest wins', args: { fbOwn: 0, fbRes: 1, fbRing: 1.5 } },
  { s: 'b', short: 'one loop · ring 6', name: 'ONE LOOP, the strings as partials ringing 6 s — a deeper resonance', args: { fbOwn: 0, fbRes: 1, fbRing: 6 } },
  { s: 'c', short: 'each sings · partials', name: 'EACH STRING SINGS, as partials — a chord of clipped partials', args: { fbOwn: 1, fbRes: 1, fbRing: 1.5 } },
];

// THE PRESETS: a shape → the six strings, three ways
const presets = [], rows = [];
shapes.forEach((sh) => {
  const pitches = sh.pitches.slice().sort((a, b) => a - b), six = pitches.slice(0, 6), strings = {};
  for (let i = 0; i < 6; i++) strings['fbS' + (i + 1)] = i < six.length ? K.hz(six[i]) : 0;
  const id = String(sh.id).replace(/[^A-Za-z0-9]/g, ''), left = pitches.length - six.length;
  WAYS.forEach((w) => {
    const key = 'fr' + id.replace(/^cs/, '') + w.s;
    presets.push({ key, name: sh.id + ' ' + sh.name + ' — ' + w.name + ' · on ' + six.map(K.noteName).join(' ') + (left > 0 ? ' (the lowest six of ' + pitches.length + ')' : '') + ' · ' + baseSays,
      effect: 'feedback', class: 'time', capMs: CAP_MS, args: Object.assign({}, base, w.args, strings) });
    rows.push({ sh, w, key, six, left });
  });
});

// THE SCORE: shape by shape, the three ways in a row, every GAP seconds, each on another impulse and on that impulse's lane
const pick = K.spread(K.impulses()), Z = K.zoneMaker(), objects = [];
rows.forEach((r, i) => {
  const smp = pick(i), t = 1 + i * GAP;
  objects.push(Z.zone(smp.lane >= 0 ? smp.lane : 0, t, { name: smp.name, label: r.sh.id + ' ' + r.w.short, variants: { [smp.name]: r.key + '-tail' } }));
  r.smp = smp; r.t = t;
});
const END = 1 + (rows.length - 1) * GAP + CAP_MS / 1000 + 1;

const NOTE = 'THE FEEDBACK-RINGS AUDITION (DEC-40 · RUNNING_LOG §201 route (b) · §203): the feedback with its strings as RINGING PARTIALS (fbRes 1) on ' + shapes.length + ' of his chord shapes, three ways each — the one loop with the strings ringing 1.5 s (the strongest wins) · the one loop ringing 6 s · each string singing (a chord of clipped partials); the other dials the shelf\'s row ' + BASE + '. Bricks ' + GAP + ' s apart — the tails overlap. Every brick asks for <impulse>~fr<NNN><a|b|c>-tail; the engine renders them when the plan is sent with render — ONLY an engine started after 2026-10-07 §203 knows fbRes. The sheet: docs/auditions/' + NAME + '.md. Written by tools/build_feedback_rings.js; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, 'tools/build_feedback_rings.js', K.flag('replace'));
const P = K.writePresets(TAG, presets, 'the feedback with its strings as ringing partials on ' + shapes.length + ' chord shapes, three ways each; the other dials the shelf\'s row ' + BASE + ', the cap ' + CAP_MS + ' ms', COMMAND);

// THE SHEET
const sheet = [
  '# ' + NAME + ' — the feedback with its strings as ringing partials, on your chord shapes',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §201 · §203; DEC-40).*',
  '',
  '**What it is:** ' + shapes.length + ' of your chord shapes, three bricks each. A string is no longer a comb (every harmonic of its pitch) but ONE RINGING PARTIAL — a resonant filter at its pitch. **a** the one loop, strings ringing 1.5 s: a partial in a loop takes off by itself, and the shared amp lets the strongest win — as a guitar\'s feedback picks one note. **b** the same loop, strings ringing 6 s: a deeper resonance, a slower fall after the loop is broken. **c** each string sings (its own amp): a chord of clipped partials. The other dials are the shelf\'s row ' + BASE + ' (' + baseSays + '). Bricks ' + GAP + ' s apart — the tails overlap.',
  '',
  '**To hear it:** the engine RESTARTED (one started after 2026-10-07 — the switch is new code) · F5 · File ▾ → Experiments → `' + NAME + '` · play from 0 (the renders are in the bank when the plan was sent with render; else a purple brick → **render all planned**). The score is ' + K.clock(END) + ' long.',
  '',
  '| brick | at | shape | way | strings | impulse | preset |',
  '|---|---|---|---|---|---|---|',
].concat(rows.map((r) => '| **' + r.sh.id + ' ' + r.w.short + '** | ' + K.clock(r.t) + ' (' + r.t + ' s) | ' + r.sh.name + ' | ' + r.w.name + ' | ' + r.six.map(K.noteName).join(' ') + (r.left > 0 ? ' (+' + r.left + ')' : '') + ' | `' + r.smp.name + '` | `' + r.key + '` |'))
  .concat(['', '**To keep one:** the sample it makes is `<impulse>~fr<NNN><a|b|c>-tail` in the bank; a return brick anywhere can ask for it — its panel → Processed as → the preset, envelope `tail`; or its row in `bank/presets.json` is copied onto the shelf at your word. On any process brick the switch is in the feedback row: **a string is** — a comb · one ringing partial; and **string ring**.', '']).join('\n');
const sheetFile = K.writeSheet(NAME, sheet);

rows.forEach((r) => console.log((r.sh.id + ' ' + r.w.short).padEnd(30) + String(r.t).padStart(4) + ' s  ' + r.smp.name.padEnd(16) + r.six.map(K.noteName).join(' ')));
console.log(K.rel(file) + ' written — ' + objects.length + ' return bricks (' + shapes.length + ' shapes × 3), ' + K.clock(END) + ' long · ' + K.rel(sheetFile) + ' · File ▾ → Experiments → ' + NAME);
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): his engine must be one started after fbRes went in (2026-10-07) — then this tool again with --replace --render, or a purple brick → "render all planned".');
