#!/usr/bin/env node
// solo_to_score.js — THE PIANO SOLO'S WORKING VERSION AS A PAGE OF THE REAL SCORE (the Switch~ piece RUNNING_LOG §361, his words 2026-11-21:
// "let's go ahead and implement … the piano solo into the real score").
//
//   node C:\Users\jwloy\GitHub\switch_2026\tools\solo_to_score.js
//
// The working version is two things: (1) the page of standard figures with the notes a gesture replaces NOT drawn, and (2) the signs drawn over
// it (ribbons · pebble drops · repeats · chord symbols · the dynamic, hairpin and slur). This tool writes (1) as a page of the notation app,
// notation/ir/s2-piano-solo-final.ir.json — the workshop's own filtered page, cut at the solo's end, written at pitch (no 8va). The page says
// `layoutPolicy.furniture: "work"`, and the app asks the score server for (2) as it draws each window (/api/notation/furniture).
//
// RUN IT AGAIN after a change to bank/piano_solo_work.json that hides or shows notes, or to notation/hand/s2-piano-solo.units.json (after the
// two notate_section builds of that page). A change to a gesture's shape alone needs no run: the signs are drawn live.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ID = 's2-piano-solo-final', LABEL = 'Section 2 - THE PIANO SOLO, final draft (148 to 196 s)', END = 199;
const e = require('./notation_workshop.js').engine('work');
const ir = JSON.parse(JSON.stringify(e.ir));
const keep = new Set(ir.events.filter(ev => ev.onset < END).map(ev => ev.id));
ir.events = ir.events.filter(ev => keep.has(ev.id));
ir.overlays = (ir.overlays || []).filter(o => !(o.target && o.target.event) || keep.has(o.target.event));
ir.chunks = (ir.chunks || []).map(c => Object.assign({}, c, { events: (c.events || []).filter(id => keep.has(id)) })).filter(c => c.events.length);
ir.id = ID;
ir.source = Object.assign({}, ir.source, { window: [ir.source.window[0], END] });
ir.layoutPolicy = Object.assign({}, ir.layoutPolicy, { noOttava: true, furniture: 'work' }, e.work.cfg.pageSeconds > 0 ? { pageSeconds: +e.work.cfg.pageSeconds } : {});   // [§366] the solo's own pace (bank/piano_solo_work.json pageSeconds)
ir.provenance = Object.assign({}, ir.provenance, { build: 'tools/solo_to_score.js — from the workshop\'s working version (bank/piano_solo_work.json over ' + e.work.cfg.base + '); not a notate_section build, so the app\'s refresh leaves it alone' });
fs.writeFileSync(path.join(ROOT, 'notation', 'ir', ID + '.ir.json'), JSON.stringify(ir, null, 1) + '\n');
const ixf = path.join(ROOT, 'notation', 'ir', 'index.json'), ix = JSON.parse(fs.readFileSync(ixf, 'utf8'));
const base = ix.irs.find(x => x.id === e.work.cfg.base) || {};
const entry = { id: ID, label: LABEL, score: base.score, window: ir.source.window, profile: base.profile || 'trance' };
const at = ix.irs.findIndex(x => x.id === ID); if (at >= 0) ix.irs[at] = entry; else ix.irs.push(entry);
fs.writeFileSync(ixf, JSON.stringify(ix, null, 1) + '\n');
console.log('READY: ' + ID + ' — ' + ir.events.length + ' notes drawn (' + (e.work.played.filter(p => p.onset < END).length - ir.events.length) + ' replaced by a gesture or hidden) · in the picker as "' + LABEL + '"');
