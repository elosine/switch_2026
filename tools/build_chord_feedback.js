#!/usr/bin/env node
// build_chord_feedback.js — THE FEEDBACK ON HIS CHORD SHAPES (his word 2026-10-06, DEC-32 · PLAN 10.12 · RUNNING_LOG §151): every chord
// shape of bank/harmonies.json (banks.chordShapes — the two-pianos piece's, his voicings), IN THE BANK'S ORDER, one return brick each:
// the feedback's six strings tuned to the shape's pitches as he voiced them (fewer than six notes: the other strings off; more than
// six: its LOWEST six, said on the sheet), every other dial ONE kept setting of the shelf — bank/candidates.json row 7, "slow bloom",
// unless --base names another. Each brick on another captured impulse (another player and another impulse each time); nothing overlaps.
// It writes — a preset per shape into bank/presets.json (cs001 …; `deal: false`: never dealt onto the main score; a second run
// replaces only its own) · the score scores/<name>.json, a NEW file · the sheet docs/auditions/<name>.md (shape · notes · strings · impulse).
//   node tools/build_chord_feedback.js [--name audition-feedback-chords] [--base 7] [--gap 10] [--cap 12000] [--replace] [--render] [--port 5500]
// --cap      the ring-out's cap in ms past the impulse's end (12000: the bloom, the hold and the ring-down whole; the shelf's row 7 was
//            heard cut at 1700 — `--cap 1700 --gap 3.5` makes that)
// The presets carry fbOwn: 1 — EVERY STRING SINGS (electronics/sc/process.scd): in the feedback's one loop only strings that share a
// harmonic take off, and a chord shape with no octave in it just rings down (measured on these 54: none bloomed).
// --render   sends the plan to the engine with render 1 — it needs an engine STARTED AFTER fbOwn went into electronics/sc/process.scd
//            (an older one leaves the dial out and renders the one loop); without it: a purple brick → render all planned
// --replace  rewrites a score THIS tool made; never another.
// THE SORTING: this tool knows the piece (its harmonies, its shelf, its bank, its scores) — the piece's. The feedback is the engine's, untouched.
'use strict';
const path = require('path');
const K = require('./audition_kit.js');
const NAME = K.arg('name', 'audition-feedback-chords'), BASE = +K.arg('base', 7), GAP = +K.arg('gap', 10), CAP_MS = +K.arg('cap', 12000), PORT = +K.arg('port', 5500);
const TAG = 'feedback-chords';
const COMMAND = 'node tools/build_chord_feedback.js --name ' + NAME + ' --base ' + BASE + ' --gap ' + GAP + ' --cap ' + CAP_MS;

const shapes = (((K.readJson(path.join(K.ROOT, 'bank', 'harmonies.json')).banks || {}).chordShapes || {}).entries || []).filter((e) => Array.isArray(e.pitches) && e.pitches.length);
if (!shapes.length) { console.error('no chord shapes in bank/harmonies.json (banks.chordShapes.entries)'); process.exit(4); }
const shelf = (K.readJson(path.join(K.ROOT, 'bank', 'candidates.json')).rows || []).find((r) => r.n === BASE);
if (!shelf || !shelf.setting || shelf.setting.effect !== 'feedback') { console.error('row ' + BASE + ' of bank/candidates.json is not a kept setting of the feedback'); process.exit(2); }
const base = Object.assign({}, shelf.setting.args, { fbOwn: 1 });   // EVERY STRING SINGS: in the one loop a chord with no octave in it never blooms (measured on these 54, §151)
['fbS1', 'fbS2', 'fbS3', 'fbS4', 'fbS5', 'fbS6'].forEach((k) => { delete base[k]; });
const baseSays = 'bloom ' + base.fbBloom + ' s · hold ' + base.fbHold + ' s · drive ' + base.fbDrive + ' · tone ' + base.fbTone + ' Hz';

// THE PRESETS: a shape → the six strings
const presets = [], rowsOut = [];
shapes.forEach((sh) => {
  const all = sh.pitches.slice().sort((a, b) => a - b), six = all.slice(0, 6), strings = {};
  for (let i = 0; i < 6; i++) strings['fbS' + (i + 1)] = i < six.length ? K.hz(six[i]) : 0;
  const key = String(sh.id).replace(/[^A-Za-z0-9]/g, ''), left = all.length - six.length;
  presets.push({ key, name: sh.id + ' ' + sh.name + ' — feedback on ' + six.map(K.noteName).join(' ') + (left > 0 ? ' (the lowest six of ' + all.length + ')' : '') + ' · ' + baseSays,
    effect: 'feedback', class: 'time', capMs: CAP_MS, args: Object.assign({}, base, strings) });
  rowsOut.push({ sh, key, all, six, strings, left });
});

// THE SCORE: one brick per shape, in the bank's order, every GAP seconds, each on another impulse and on that impulse's lane
const pick = K.spread(K.impulses()), Z = K.zoneMaker(), objects = [];
rowsOut.forEach((r, i) => {
  const smp = pick(i), t = 1 + i * GAP, full = r.sh.id + ' ' + r.sh.name;
  const label = full.length <= 44 ? full : r.sh.id + ' ' + r.all.length + ' notes [' + r.sh.intervals[0] + ' … ' + r.sh.intervals[r.sh.intervals.length - 1] + ']';
  objects.push(Z.zone(smp.lane >= 0 ? smp.lane : 0, t, { name: smp.name, label, variants: { [smp.name]: r.key + '-tail' } }));
  r.smp = smp; r.t = t;
});
const END = 1 + rowsOut.length * GAP;

const NOTE = 'THE FEEDBACK ON HIS CHORD SHAPES (DEC-32 · PLAN 10.12 · RUNNING_LOG §151): the ' + rowsOut.length + ' chord shapes of bank/harmonies.json, in the bank\'s order, one return each every ' + GAP + ' s from 1 s — the feedback\'s six strings tuned to the shape\'s pitches as he voiced them (the lowest six of a larger shape), every other dial the shelf\'s row ' + BASE + ' ("' + (shelf.remark || '') + '"), each on another captured impulse. Every brick asks for <impulse>~cs<NNN>-tail; the engine renders them from the bank when the plan is sent with render (a purple brick → render all planned). The sheet: docs/auditions/' + NAME + '.md. Written by tools/build_chord_feedback.js; his from then on.';
const file = K.writeScore(NAME, objects, Z.nextId(), NOTE, 'tools/build_chord_feedback.js', K.flag('replace'));
const P = K.writePresets(TAG, presets, 'the feedback on his ' + rowsOut.length + ' chord shapes (bank/harmonies.json), the other dials the shelf\'s row ' + BASE + ', the cap ' + CAP_MS + ' ms', COMMAND);

// THE SHEET
const sheet = [
  '# ' + NAME + ' — the feedback on your chord shapes',
  '',
  '*Written by `' + COMMAND + '` — rendered from the tool, never edited by hand (RUNNING_LOG §151; DEC-32; PLAN 10.12).*',
  '',
  '**What it is:** your ' + rowsOut.length + ' chord shapes (`bank/harmonies.json` — the two-pianos piece\'s), all of them, in the bank\'s order, one brick each. The feedback\'s six strings are tuned to the shape\'s notes as you voiced them; a shape with fewer than six notes leaves the other strings off; a shape with more than six takes its lowest six. Everything else is one setting: the shelf\'s row ' + BASE + ', *"' + (shelf.remark || '') + '"* — ' + baseSays + '. Each brick is excited by another impulse.',
  '',
  '**Every string sings:** the feedback as first built only takes off where two strings share a harmonic (the open guitar\'s two E\'s); on these shapes it just rang down. So these presets use the feedback\'s second way, `the strings: each string sings` — every note of the shape blooms from what the impulse gave it, up to its own amp; the notes the impulse excites most arrive first.',
  '',
  '**To hear it:** the engine restarted · F5 · File ▾ → Experiments → `' + NAME + '` · click any purple brick → **render all planned** (' + rowsOut.length + ' renders; wait for the engine\'s window to go quiet) · play from 0. A brick every ' + GAP + ' s; the score is ' + K.clock(END) + ' long.',
  '',
  '| # | at | shape | its notes | the strings, Hz | impulse | preset |',
  '|---|---|---|---|---|---|---|',
].concat(rowsOut.map((r, i) => '| ' + (i + 1) + ' | ' + K.clock(r.t) + ' (' + r.t + ' s) | **' + r.sh.id + '** ' + r.sh.name + ' | ' + r.all.map(K.noteName).join(' ') + (r.left > 0 ? ' — **the lowest six sound: ' + r.six.map(K.noteName).join(' ') + '**' : '') + ' | ' + r.six.map(K.hz).join(' · ') + ' | `' + r.smp.name + '` — ' + (K.PLAYERS[r.smp.player] || r.smp.player) + ' | `' + r.key + '` |'))
  .concat(['', '**To keep one:** the sample it makes is `<impulse>~' + 'cs<NNN>-tail` in the bank; a return brick anywhere can ask for it — its panel → Processed as → the preset named by the shape, envelope `tail`. Another base setting: `--base <the shelf\'s row>`; the short cut the shelf\'s row 7 was heard with: `--cap 1700 --gap 3.5` (both with `--replace`).', '']).join('\n');
const sheetFile = K.writeSheet(NAME, sheet);

rowsOut.forEach((r, i) => console.log(String(i + 1).padStart(3) + '  ' + String(r.t).padStart(5) + ' s  lane ' + r.smp.lane + '  ' + r.smp.name.padEnd(16) + (r.sh.id + ' ' + r.sh.name).padEnd(46) + r.six.map(K.noteName).join(' ') + (r.left > 0 ? '  (lowest six of ' + r.all.length + ')' : '')));
console.log(K.rel(file) + ' written — ' + objects.length + ' return bricks, one per shape, ' + K.clock(END) + ' long · ' + K.rel(sheetFile) + ' · File ▾ → Experiments → ' + NAME);
if (K.flag('render')) K.sendPlan(K.planLines(objects, P), PORT);
else console.log('the plan was NOT sent (no --render): in the page, a purple brick → "render all planned".');
