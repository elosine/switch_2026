// rack_layout.js — the rack's tracks as the MIDI tools read them: ONE copy (taken out of tools/export_midi.js 2026-11-22 for
// tools/stems_plan.js, PLAN 2r step 1). The track NAME → its loopMIDI port; the .rpp's tracks with their MIDI inputs; a format-0 file.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const { PPQ } = require('../midi_out.js');

// the rack's track NAME → the loopMIDI port it plays (the names are his; a new or renamed track must be added here)
const RACK_PORT = {   // THE SWITCH~ RACK (re-pointed 2026-11-14 at the first render here; the map is tools/rack_alive.js's PLAN)
  'Flute SI2': 'SWFlute', 'Fluteb SI2': 'SWFluteb', 'Clarinet SI2': 'SWClar', 'Alto Sax SI2': 'SWSax', 'Alto Sax SI2 b': 'SWSaxb',
  'Clarinet XS': 'SWFluteb', 'Bass Clarinet XS': 'SWFluteb',   // the clarinet's triple tongue and slap, SWFluteb channels 11 · 12 (journal §2, 2026-11-22)
  'Vibraphone XS': 'SWVibes', 'Crotales RM': 'SWCrotales', 'Glockenspiel RM': 'SWGlock', 'Xylophone RM': 'SWXylo', 'Marimba RM': 'SWMarimba',
  'Piano Kontakt': 'SWPiano', 'PianoPlucked Kontakt': 'SWPiano', 'PianoHarm PP2': 'SWPiano', 'PianoMute PP2': 'SWPiano',
  'Violin XS': 'SWViolin', 'Cello XS': 'SWCello',
};
const portOf = name => RACK_PORT[name] || (/ ARO$/.test(name) ? 'SWPerc' : null);   // every `… ARO` track is one SWPerc channel

function readRack(file) {
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split(/\r?\n/);
  const tracks = []; let depth = 0, cur = null, at = 0;
  for (const raw of lines) {
    const l = raw.trim();
    if (l.startsWith('<TRACK')) { cur = { name: '', rec: null }; tracks.push(cur); at = depth + 1; }
    if (l.startsWith('<')) depth++;
    if (cur && depth === at) {
      if (l.startsWith('NAME ')) cur.name = l.slice(5).replace(/^"(.*)"$/, '$1');
      if (l.startsWith('MIDI_INPUT_CHANMAP ')) cur.chanmap = +l.split(/\s+/)[1];   // the track's input sends every message on to ONE channel (RUNNING_LOG §456)
      if (l.startsWith('REC ')) { const f = l.split(/\s+/).map(Number); cur.rec = { armed: f[1], input: f[2] }; }
    }
    if (l === '>') { depth--; if (cur && depth < at) cur = null; }
  }
  // REC input: 4096 + device × 32 + channel (0 = all) for a MIDI input; anything below 4096 is audio
  for (const t of tracks) {
    const inp = t.rec ? t.rec.input : -1;
    t.midi = inp >= 4096 ? { device: (inp - 4096) >> 5, channel: (inp - 4096) & 31 } : null;
  }
  return tracks;
}

// a format-0 file: one track holding the 60 BPM tempo, the name and the events (ranked off · cc · bend · on at a tick, as midi_out.js)
function writeType0(abs, name, events) {
  const vlq = n => { const o = [n & 0x7f]; n >>= 7; while (n > 0) { o.unshift((n & 0x7f) | 0x80); n >>= 7; } return o; };
  const rank = k => (k === 'off' ? 0 : k === 'cc' ? 1 : k === 'bend' ? 2 : 3);
  const ev = events.map(e => ({ tick: Math.round(e.t * PPQ), kind: e.kind, bytes: e.bytes })).sort((x, y) => x.tick - y.tick || rank(x.kind) - rank(y.kind));
  const data = [0x00, 0xff, 0x51, 0x03, 0x0f, 0x42, 0x40, 0x00, 0xff, 0x03, ...vlq(name.length), ...Buffer.from(name, 'ascii')];
  let last = 0;
  for (const e of ev) { data.push(...vlq(Math.max(0, e.tick - last)), ...e.bytes); last = e.tick; }
  data.push(0x00, 0xff, 0x2f, 0x00);
  const u32 = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
  fs.writeFileSync(abs, Buffer.concat([Buffer.from('MThd'), Buffer.from([0, 0, 0, 6, 0, 0, 0, 1, (PPQ >> 8) & 255, PPQ & 255]), Buffer.from('MTrk'), Buffer.from(u32(data.length)), Buffer.from(data)]));
}

const kindOf = b => { const s = b[0] & 0xF0; return s === 0x80 || (s === 0x90 && b[2] === 0) ? 'off' : s === 0x90 ? 'on' : s === 0xE0 ? 'bend' : 'cc'; };

module.exports = { RACK_PORT, portOf, readRack, writeType0, kindOf };
