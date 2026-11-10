#!/usr/bin/env node
// uvi_set_channel.js — a UVI part's MIDI CHANNEL set as text (the MIDI shore-up, 2026-11-10, RUNNING_LOG §143): decode the running
// instance (tools/uvi_state.js), rewrite the part's MidiChannel attribute, encode --push, read back. The one edit uvi_state.js lacked;
// the need: the Prepared Piano 2 parts listened on channels 3 · 4 · 5 (piece 4's) while this piece's recipe and tracks say 6 (harmonics)
// and 7 (muted) — a track that filters channel 6 passes channel-6 notes to a part that listens on 3: silence.
//
//   node tools/uvi_set_channel.js "PianoHarm PP2" 1 6        # part 1 (as UVI numbers them, 1 … 16) to MIDI channel 6
//   node tools/uvi_set_channel.js "PianoHarm PP2" 1 6 --dry  # say what would change, push nothing
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const [track, partArg, chArg] = process.argv.slice(2);
const dry = process.argv.includes('--dry');
if (!track || !partArg || !chArg) { console.error('usage: uvi_set_channel.js "<track>" <part 1..16> <channel 1..16> [--dry]'); process.exit(2); }
const partNo = +partArg, ch = +chArg;
if (!(partNo >= 1 && partNo <= 16) || !(ch >= 1 && ch <= 16)) { console.error('part and channel are 1 … 16'); process.exit(2); }
const STATE = path.join(__dirname, 'uvi_state.js');
const xml = path.join(os.tmpdir(), 'uvi_set_channel_' + process.pid + '.xml');
const run = (args) => { const r = cp.spawnSync(process.execPath, [STATE, ...args], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); } return r.stdout; };
run(['decode', track, xml]);
let s = fs.readFileSync(xml, 'utf8');
const tags = [...s.matchAll(/<Part\b[^>]*>/g)];
const tag = tags[partNo - 1];
if (!tag) { console.error('the instance has serialized only ' + tags.length + ' part(s); part ' + partNo + ' is not among them'); process.exit(1); }
const m = /( MidiChannel=")(\d+)(")/.exec(tag[0]);
if (!m) { console.error('no MidiChannel attribute on part ' + partNo); process.exit(1); }
const prog = (/DisplayName="([^"]*)"/.exec(s.slice(tag.index, s.indexOf('</Part>', tag.index)).replace(/^<Part\b[^>]*>/, '')) || [])[1] || '(empty)';
console.log(track + ' · part ' + partNo + ' (' + prog.replace(/&amp;/g, '&') + '): MIDI channel ' + (+m[2] + 1) + ' → ' + ch);
if (dry) { fs.unlinkSync(xml); process.exit(0); }
const newTag = tag[0].replace(/( MidiChannel=")(\d+)(")/, '$1' + (ch - 1) + '$3');
s = s.slice(0, tag.index) + newTag + s.slice(tag.index + tag[0].length);
fs.writeFileSync(xml, s);
console.log(run(['encode', track, xml, '--push']).trim().split('\n').pop());
fs.unlinkSync(xml);
const info = JSON.parse(run(['info', track]));
const p = info.parts[partNo - 1];
console.log('read back: part ' + partNo + ' ch' + (p.midiChannel + 1) + ' ' + (p.program || '(empty)') + (p.midiChannel + 1 === ch ? ' ✓' : ' ✗ NOT SET'));
