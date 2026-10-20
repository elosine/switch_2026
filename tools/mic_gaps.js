#!/usr/bin/env node
// mic_gaps.js — A PLAYER HAS ONE MICROPHONE: its openings never overlap each other, and never run into that player's own trill.
// (decibel RUNNING_LOG §393, DEC-161 — his words: "the mic openings shouldn't be overlapping … we need to make sure the live electronics
// reflect that. And also the cello at 151. The mic opening shouldn't bleed into the start of the trill. Maybe a little bit of a gap before."
// The rule itself is his of 2026-10-08, RUNNING_LOG §237: "it's fine if the petals of resonance overlap the trill, but the mic opening
// shouldn't overlap the trill part" — the ring may run on, the microphone may not.)
//
//   node tools/mic_gaps.js --score <name> [--from s] [--to s] [--gap 0.1] [--min 0.3] [--dry]
//
// WHAT IT DOES. For every MIC OPENING (a zone, midiModel elecOpen) whose start lies in --from … --to: the same PLAYER's next opening or next
// trill that begins before this opening has ended — or closer to its end than --gap — makes this opening END --gap seconds before it.
// A player is a microphone, not a lane: the percussionist's two lanes are one (bank/elec_route.json players[].ports). The opening keeps
// its start (so its note stays where it was inside it) and is never made shorter than --min. What it was is kept on the zone
// (properties.micGap.was), and a second run changes nothing.
//
// WHY THE SCORE AND NOT THE PAGE OR THE ENGINE. The composer page tells the engine an opening's own start and length (/le/open … lengthMs,
// electronics/score/le_objects.js) and the notation draws the same zone (the cutter's --mics): the zone IS the microphone's window. One
// edit of the save is seen by all three.
//
// --dry reports and writes nothing. It WRITES THE SCORE otherwise (compact, as the page saves it): File ▾ → Reload in the composer page
// BEFORE any Save — a save from a page that has not reloaded writes the page's older copy back over this (it is how the fix of §237 was lost).
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && i + 1 < process.argv.length ? process.argv[i + 1] : d; };
const flag = k => process.argv.includes('--' + k);
const r3 = x => Math.round(x * 1000) / 1000;

const score = arg('score', null);
if (!score) { console.error('which score?  node tools/mic_gaps.js --score <name> [--from s] [--to s] [--gap 0.1] [--dry]'); process.exit(2); }
const file = path.join(ROOT, 'scores', score + '.json'), work = path.join(ROOT, 'scores', score + '-work.json');
if (!fs.existsSync(file)) { console.error('no score ' + file); process.exit(2); }
const raw = fs.readFileSync(file, 'utf8');
const save = JSON.parse(raw);
const FROM = +arg('from', 0), TO = +arg('to', Infinity), GAP = +arg('gap', 0.1), MIN = +arg('min', 0.3), DRY = flag('dry');

// a working copy that differs = unsaved edits in the page: this tool would be written over by the page's next save, or write over them
const essence = t => { try { const d = JSON.parse(t); if (d && d.metadata) { delete d.metadata.modified; delete d.metadata.created; } if (d) delete d.viewport; return JSON.stringify(d); } catch (e) { return t; } };
if (!DRY && fs.existsSync(work) && essence(fs.readFileSync(work, 'utf8')) !== essence(raw)) {
  console.error('REFUSED: ' + score + ' has unsaved edits in the composer page (its working copy differs from the save) — save or reload the page first'); process.exit(1);
}

// a lane's PLAYER: the microphone its instrument's port sends into (bank/elec_route.json players[].ports)
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const INSTRUMENTS = new Function(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\nreturn INSTRUMENTS;')();
const TRACKS = save.tracks || [];
const playerOfLane = L => { const inst = (TRACKS[L] && INSTRUMENTS[TRACKS[L].instKey]) || {}; return (ROUTE.players.find(p => (p.ports || [p.port]).includes(inst.port)) || {}).name || ''; };
const label = L => (TRACKS[L] && (TRACKS[L].short || TRACKS[L].label)) || ('lane ' + L);

const zones = (save.objects || []).filter(o => o.type === 'zone');
const things = zones.filter(o => o.midiModel === 'elecOpen' || o.midiModel === 'trill')
  .map(o => ({ o, kind: o.midiModel === 'trill' ? 'trill' : 'opening', player: (o.midiModel === 'elecOpen' && o.elec && o.elec.player) || playerOfLane(o.layer) }))
  .filter(x => x.player).sort((a, b) => a.o.startTime - b.o.startTime);
const opens = things.filter(x => x.kind === 'opening' && x.o.startTime >= FROM - 1e-9 && x.o.startTime < TO);

let changed = 0, stuck = 0, inside = 0;
const lines = [];
for (const x of opens) {
  const O = x.o;
  // this player's own trill already sounding when the opening begins: nothing a shorter opening can cure
  const under = things.find(y => y.kind === 'trill' && y.player === x.player && y.o.startTime <= O.startTime + 1e-9 && y.o.endTime > O.startTime + 1e-9);
  if (under) { inside++; lines.push('  INSIDE A TRILL  ' + x.player + ' · ' + O.id + ' (' + ((O.elec && O.elec.name) || '') + ') opens at ' + O.startTime.toFixed(3) + ' s while its own trill ' + under.o.id + ' sounds (' + under.o.startTime.toFixed(3) + ' → ' + under.o.endTime.toFixed(3) + ') — left; his to move'); continue; }
  const next = things.filter(y => y.o !== O && y.player === x.player && y.o.startTime > O.startTime + 1e-6 && y.o.startTime < O.endTime + GAP - 1e-6)[0];
  if (!next) continue;
  const want = r3(next.o.startTime - GAP), floor = r3(O.startTime + MIN), end = Math.max(want, floor);
  if (end >= O.endTime - 1e-9) continue;
  const was = O.endTime;
  const what = x.player + ' · ' + O.id + ' on ' + label(O.layer) + ' (' + ((O.elec && O.elec.name) || '') + ') ' + O.startTime.toFixed(3) + ' → ' + was.toFixed(3) + ' s  meets its ' + (next.kind === 'trill' ? 'trill ' : 'next opening ') + next.o.id + ' on ' + label(next.o.layer) + ' at ' + next.o.startTime.toFixed(3) + ' s';
  if (end > want + 1e-9) { stuck++; lines.push('  TOO CLOSE  ' + what + ' — ends at ' + end.toFixed(3) + ' (its least length, ' + Math.round(MIN * 1000) + ' ms); the gap left is ' + Math.round((next.o.startTime - end) * 1000) + ' ms, not ' + Math.round(GAP * 1000)); }
  else lines.push('  shortened  ' + what + ' — now ends ' + end.toFixed(3) + ' s (' + Math.round((end - O.startTime) * 1000) + ' ms long, was ' + Math.round((was - O.startTime) * 1000) + '), ' + Math.round(GAP * 1000) + ' ms before it');
  if (!DRY) {
    O.endTime = end;
    O.properties = O.properties || {};
    O.properties.micGap = { was: (O.properties.micGap && O.properties.micGap.was) || was, gapS: GAP, before: next.o.id, by: 'tools/mic_gaps.js' };
  }
  changed++;
}

console.log(score + ' · ' + opens.length + ' mic opening(s)' + (Number.isFinite(TO) || FROM ? ' in ' + FROM + ' … ' + (Number.isFinite(TO) ? TO : 'the end') + ' s' : '') + ' · the gap ' + Math.round(GAP * 1000) + ' ms');
for (const l of lines) console.log(l);
console.log(changed ? (DRY ? '  WOULD shorten ' : '  shortened ') + changed + ' opening(s)' + (stuck ? ' (' + stuck + ' too close for the whole gap)' : '') : '  every opening is clear of its player\'s next opening and trill');
if (inside) console.log('  ' + inside + ' opening(s) begin inside their own player\'s trill — not changed');
if (!DRY && changed) {
  fs.writeFileSync(file, JSON.stringify(save) + (raw.endsWith('\n') ? '\n' : ''));
  console.log('  WROTE ' + path.relative(ROOT, file).replace(/\\/g, '/') + ' — in the composer page: File ▾ → Reload BEFORE any Save');
}
