#!/usr/bin/env node
// stems_plan.js — THE DEMO RECORDING, step 1 (PLAN § 2r; his briefs SW-165 · SW-166; RUNNING_LOG §452 … §455): the whole piece's
// captured playback cut into ONE MIDI FILE PER TECHNIQUE PER WRITTEN DYNAMIC of every rack track — the stems.
//
//   node tools/stems_plan.js --score <save> [--capture midi/<save>.capture.json] [--rack reaper/switch_rack.rpp] [--dry]
//
// In:  the capture (tools/capture_composer_midi.js — the composer's own ▶, message by message, with expect.notes: each sounding note's
//      id · port · channel · pitch · onset) and the save (each note's technique and written velocity).
// How: every note-on of the capture is given to its note of the save (port · channel · pitch · onset within 3 ms — export_midi.js' own
//      matching), and its note-off is the next one on that slot. THE KEY of a stem = the rack track · the technique · the written
//      dynamic's name — the band of the note's WRITTEN velocity (recVel) in this piece's dynamicBands; a note whose dynamic is a curve
//      (no plain velocity: the long shaped tones) is `shape`.
//      THE TRACK of a stem = the rack track whose input takes that port and channel (the channel's own track if there is one, else the
//      port's all-channel track).
//      A stem's file holds ITS notes and EVERY non-note message of its port (the CC7s, the curves, the bends), so a stem alone sounds
//      as it does in the whole.
// Out: midi/<save>/stems/NN <track> - <technique> - <dyn>.mid   (60 BPM / 960 PPQ, format 0 — one beat = one second)
//      midi/<save>/stems.json                                    (track · port · channel · technique · dynamic · notes · first and last second)
// Refuses to write if a note of the save has no note-on in the capture, or a note-on has no note of the save.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { portOf, readRack, writeType0, kindOf } = require('./lib/rack_layout.js');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const score = arg('score') || (console.error('--score <save>'), process.exit(2));
const capFile = arg('capture', 'midi/' + score + '.capture.json');
const rackFile = arg('rack', 'reaper/switch_rack.rpp');
const DRY = process.argv.includes('--dry');
const lc = s => String(s || '').toLowerCase();
const TOL = 0.003;

const cap = JSON.parse(fs.readFileSync(path.join(ROOT, capFile), 'utf8'));
const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', score + '.json'), 'utf8'));
const { meta, events, expect } = cap;
const nowMtime = fs.statSync(path.join(ROOT, 'scores', score + '.json')).mtime.toISOString();
if (meta.scoreMtime && meta.scoreMtime !== nowMtime) console.warn('WARN: ' + score + '.json was saved again after the capture (' + meta.scoreMtime + ' → ' + nowMtime + ') — capture again');
const BANDS = require(path.join(ROOT, 'notation', 'lib', 'rules.js')).loadContainer(ROOT).engraving.layout.dynamicBands;
const markOf = v => (BANDS.find(b => v <= b.max) || BANDS[BANDS.length - 1]).mark;
const byId = new Map(save.objects.map(o => [o.id, o]));
const fails = [];

// 1 · every note-on to its note of the save; its note-off = the next off on its slot
const sorted = events.map((e, i) => ({ i, port: lc(e[0]), t: e[1], b: e[2], kind: kindOf(e[2]) })).sort((a, b) => a.t - b.t || a.i - b.i);
const onIdx = new Map(), offIdx = new Map();
for (const e of sorted) {
  if (e.kind !== 'on' && e.kind !== 'off') continue;
  const k = e.port + '|' + (e.b[0] & 15) + '|' + e.b[1], M = e.kind === 'on' ? onIdx : offIdx;
  (M.get(k) || M.set(k, []).get(k)).push(e);
}
// the rack: which track takes a port and channel
const rack = readRack(rackFile).map((t, i) => Object.assign(t, { n: i + 1, port: t.midi ? portOf(t.name) : null }));
for (const t of rack) if (t.midi && !t.port) fails.push('rack track "' + t.name + '" has a MIDI input but no port in tools/lib/rack_layout.js');
const trackFor = (port, ch) => {
  const T = rack.filter(t => t.port && lc(t.port) === lc(port));
  return T.find(t => t.midi.channel === ch + 1) || T.find(t => t.midi.channel === 0) || null;
};
const stems = new Map();   // key → { port, ch, technique, dyn, layer, ev: [], notes, t0, t1 }
const missing = []; let octaved = 0;
for (const n of expect.notes) {
  let k = lc(n.port) + '|' + n.ch + '|' + n.pitch;
  let on = (onIdx.get(k) || []).find(e => !e.used && Math.abs(e.t - n.t0) <= TOL);
  if (!on) {   // a technique the composer SENDS at another octave (the clarinet's slap, two octaves down for the bass clarinet's sampler): the same port · channel · onset, the same pitch class
    for (let d = -36; d <= 36 && !on; d += 12) { if (!d) continue; const k2 = lc(n.port) + '|' + n.ch + '|' + (n.pitch + d); on = (onIdx.get(k2) || []).find(e => !e.used && Math.abs(e.t - n.t0) <= TOL); if (on) { k = k2; octaved++; } }
  }
  if (!on) { missing.push(n.id + '@' + n.t0.toFixed(3)); continue; }
  on.used = true;
  const off = (offIdx.get(k) || []).find(e => !e.used && e.t >= on.t);
  if (!off) { fails.push('note ' + n.id + ' is never closed'); continue; }
  off.used = true;
  const o = byId.get(n.id);
  if (!o) { fails.push('note ' + n.id + ' of the capture is not in the save'); continue; }
  const plain = o.sonifyMode === 'plain' && o.recVel != null;
  const dyn = plain ? markOf(o.recVel) : 'shape';
  const technique = o.technique || 'ord';
  const track = trackFor(n.port, n.ch);
  if (!track) { fails.push('no rack track takes ' + n.port + ' channel ' + (n.ch + 1) + ' (' + technique + ')'); continue; }
  const key = track.n + '|' + technique + '|' + dyn;   // the channels of one track that carry one technique (the curve channels) are ONE stem
  const s = stems.get(key) || stems.set(key, { port: n.port, track, chs: new Set(), technique, dyn, layers: new Set(), ev: [], notes: 0, t0: Infinity, t1: -Infinity, vels: new Set() }).get(key);
  s.ev.push(on, off); s.notes++; s.chs.add(n.ch + 1); s.layers.add(o.layer); if (plain) s.vels.add(o.recVel);
  s.t0 = Math.min(s.t0, on.t); s.t1 = Math.max(s.t1, off.t);
}
if (missing.length) fails.push(missing.length + ' notes of the save have no note-on in the capture: ' + missing.slice(0, 6).join(', '));
const strayOn = sorted.filter(e => e.kind === 'on' && !e.used);
if (strayOn.length) fails.push(strayOn.length + ' note-ons belong to no note of the save, e.g. ' + strayOn.slice(0, 4).map(e => e.port + ' ch' + ((e.b[0] & 15) + 1) + ' ' + e.b[1] + '@' + e.t.toFixed(3)).join(', '));
if ((expect.snippets || []).some(s => s.notes.length)) fails.push('the save has snippet zones (trills, beatings) — this tool does not cut them yet');

// 2 · the other messages, the order
const other = new Map();   // port → every non-note message
for (const e of sorted) if (e.kind !== 'on' && e.kind !== 'off') (other.get(e.port) || other.set(e.port, []).get(e.port)).push(e);
const ORDER = ['shape'].concat(BANDS.map(b => b.mark));
const list = [...stems.values()];
if (fails.length) { console.error('STEMS REFUSED:\n  ' + fails.join('\n  ')); process.exit(1); }
list.sort((a, b) => a.track.n - b.track.n || (a.technique < b.technique ? -1 : a.technique > b.technique ? 1 : 0) || ORDER.indexOf(a.dyn) - ORDER.indexOf(b.dyn));

// 3 · write
const dir = path.join(ROOT, 'midi', score, 'stems');
const safe = s => s.replace(/[\\/:*?"<>|]/g, '_');
const rows = list.map((s, k) => {
  const name = String(k + 1).padStart(2, '0') + ' ' + safe(s.track.name) + ' - ' + safe(s.technique) + ' - ' + s.dyn;
  const ev = s.ev.concat(other.get(lc(s.port)) || []).sort((a, b) => a.t - b.t || a.i - b.i).map(e => ({ t: e.t, kind: e.kind, bytes: e.b }));
  return { n: k + 1, name, file: 'midi/' + score + '/stems/' + name + '.mid', track: s.track.name, trackN: s.track.n, port: s.port, channels: [...s.chs].sort((a, b) => a - b), technique: s.technique, dyn: s.dyn,
    writtenVelocities: [...s.vels].sort((a, b) => a - b), layers: [...s.layers].sort((a, b) => a - b), notes: s.notes, messages: ev.length, t0: +s.t0.toFixed(3), t1: +s.t1.toFixed(3), ev };
});
if (!DRY) {
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  for (const r of rows) writeType0(path.join(ROOT, r.file), r.name, r.ev);
}
const perTrack = new Map(); for (const r of rows) perTrack.set(r.track, (perTrack.get(r.track) || 0) + 1);
const passes = Math.max(...perTrack.values());
const lastOff = Math.max(...rows.map(r => r.t1));
const out = { score, capture: capFile, capturedAt: meta.capturedAt, scoreMtime: nowMtime, rack: rackFile, bands: BANDS, notes: rows.reduce((a, r) => a + r.notes, 0), lastOff: +lastOff.toFixed(3),
  passes, stems: rows.map(r => { const c = Object.assign({}, r); delete c.ev; return c; }) };
if (!DRY) fs.writeFileSync(path.join(ROOT, 'midi', score, 'stems.json'), JSON.stringify(out, null, 1));

// 4 · report
console.log((DRY ? 'DRY — ' : '') + rows.length + ' stems · ' + out.notes + ' notes of ' + expect.notes.length + ' · ' + perTrack.size + ' rack tracks · the last note-off ' + out.lastOff + ' s');
let prev = '';
for (const r of rows) {
  if (r.track !== prev) { console.log('  ' + String(r.trackN).padStart(2) + ' ' + r.track + ' (' + r.port + ')'); prev = r.track; }
  console.log('       ' + String(r.n).padStart(2) + '  ch ' + r.channels.join(',').padEnd(6) + '  ' + r.technique.padEnd(28) + r.dyn.padEnd(6) + String(r.notes).padStart(5) + ' notes  ' + String(r.t0).padStart(8) + ' … ' + r.t1);
}
if (octaved) console.log('  ' + octaved + ' notes are sent at another octave than written (matched by pitch class)');
console.log('  the most stems on one track: ' + passes + ' (' + [...perTrack].filter(([, c]) => c === passes).map(([n]) => n).join(', ') + ') — the passes a per-track render needs');
if (!DRY) console.log('  midi/' + score + '/stems/ · midi/' + score + '/stems.json');
