#!/usr/bin/env node
// return_level.js — EVERY RETURN BRICK OF A STRETCH AT ONE WRITTEN LEVEL.
//
// (composer 2026-10-10, DEC-142 · DEC-147, RUNNING_LOG §371 · §376: of the audition's bricks, "change all of them to dynamic level,
// written a mark, and then FFF … that's been a consistent change throughout all the bricks"; then of the piece: "opening effects to FFF")
//
// A return brick's dynamic (PLAN 1.4, 11.3) is `elec.dyn`: absent = AS PLAYED (the sample at the level the microphone caught it);
// `mode: mark` = WRITTEN — the engine brings each sample to that mark of the ladder against its own loudness. This tool sets the Level
// of every return brick that starts in the stretch to written, the mark given; a shape or anything else a brick's dynamic holds stays;
// nothing else of a brick moves. `--played` takes the dynamic off again (as played).
//
//   node tools/return_level.js --score <name> --mark fff [--from 0] [--to 37] [--played] [--dry] [--unsaved-ok]
//
// IT WRITES THE SCORE (a working copy of the page that differs refuses it); then File ▾ → Reload in the page, BEFORE any Save.
// No render is needed: the level is applied when the brick is played.
'use strict';
const fs = require('fs'), path = require('path');
const K = require('./audition_kit.js');
const ROOT = K.ROOT, has = K.flag, arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : d; };
const die = (msg, code) => { console.error(msg); process.exit(code || 2); };
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];

const name = arg('score'), mark = arg('mark'), played = has('played');
if (!name || (!played && !MARKS.includes(mark))) die('usage: node tools/return_level.js --score <name> --mark ppp…fff [--from 0] [--to 37] [--played] [--dry]');
const file = path.join(ROOT, 'scores', name.replace(/\.json$/, '') + '.json');
if (!fs.existsSync(file)) die('no such score: ' + K.rel(file));
const text = fs.readFileSync(file, 'utf8'), save = JSON.parse(text);
const FORMS = { compact: (o) => JSON.stringify(o), compactNl: (o) => JSON.stringify(o) + '\n', one: (o) => JSON.stringify(o, null, 1), oneNl: (o) => JSON.stringify(o, null, 1) + '\n' };
const form = Object.keys(FORMS).find((k) => FORMS[k](save) === text) || 'oneNl';
const working = file.replace(/\.json$/, '-work.json');
if (!has('unsaved-ok') && fs.existsSync(working)) {
    const strip = (o) => { const c = Object.assign({}, o); delete c.midiSnippet; delete c.mutedBy; Object.keys(c).forEach((k) => { if (k[0] === '_') delete c[k]; }); return c; };
    const essence = (s) => { try { return JSON.stringify((JSON.parse(s).objects || []).map(strip)); } catch (e) { return s; } };
    if (essence(fs.readFileSync(working, 'utf8')) !== essence(text) && !has('dry')) die('the page holds a working copy of ' + path.basename(file) + ' with UNSAVED changes — Save (CTRL+S) or Reload there first.', 3);
}

const from = +arg('from', 0), to = arg('to') == null ? Infinity : +arg('to');
const bricks = save.objects.filter((z) => z.type === 'zone' && z.midiModel === 'elecPlay' && z.elec && z.startTime >= from && z.startTime < to);
if (!bricks.length) die('no return brick starts in [' + from + ', ' + (to === Infinity ? 'end' : to) + ') of ' + K.rel(file), 1);
const was = {};
for (const z of bricks) {
    const k = z.elec.dyn ? (z.elec.dyn.mode === 'mark' ? 'written ' + z.elec.dyn.mark : String(z.elec.dyn.mode)) : 'as played';
    was[k] = (was[k] || 0) + 1;
    if (played) delete z.elec.dyn; else z.elec.dyn = Object.assign({}, z.elec.dyn || {}, { mode: 'mark', mark });
}
console.log(K.rel(file) + ' [' + from + ', ' + (to === Infinity ? 'end' : to) + '): ' + bricks.length + ' return bricks → ' + (played ? 'as played' : 'written ' + mark)
    + ' · they were: ' + Object.keys(was).map((k) => k + ' ' + was[k]).join(' · '));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
fs.writeFileSync(file, FORMS[form](save));
console.log('written — in the page: File ▾ → Reload, BEFORE any Save');
