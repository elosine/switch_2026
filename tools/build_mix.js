#!/usr/bin/env node
// build_mix.js — THE DEMO'S MIX PROJECT as text (PLAN 2r step 2). A NEW Reaper project; the rack is never read or written.
//
//   node tools/build_mix.js --score piece-FirstDraft-Final-D-ctptCello          # write it; REFUSES if it exists
//   node tools/build_mix.js --score <save> --dry                                # report only
//   node tools/build_mix.js --score <save> --force                              # overwrite (ONLY before he has mixed in it)
//
// WHAT IT WRITES, next to the stems' audio (H:/switch_2026/audio/demo/<save>/<save>-mix.rpp):
//   INSTRUMENTS (the bus for step 5's level line)
//     one folder per instrument (its bus)
//       a track per stem, its audio at its own place in time
//       under it a thin MUTED track with the stem's MIDI, for spotting a note; hidden from the mixer
//   ELEC (the folder for step 4) with the four lanes, empty
//   the master
// The project runs at 60 BPM because the stems' MIDI files are written at 60: one beat = one second, so the MIDI lands on its audio.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const has = n => process.argv.includes('--' + n);
const score = arg('score');
if (!score) { console.error('usage: node tools/build_mix.js --score <save> [--dry] [--force]'); process.exit(1); }

// the rack track → the instrument's bus, in score order. A track not named here stops the build.
const INSTRUMENTS = [
  { name: 'Flute', color: [120, 170, 220], tracks: ['Flute SI2', 'Fluteb SI2'] },
  { name: 'Clarinet', color: [90, 190, 170], tracks: ['Clarinet SI2', 'Clarinet XS', 'Bass Clarinet XS'] },
  { name: 'Alto Sax', color: [130, 190, 100], tracks: ['Alto Sax SI2', 'Alto Sax SI2 b'] },
  { name: 'Percussion', color: [210, 170, 80], tracks: t => / ARO$/.test(t) },
  { name: 'Mallets', color: [220, 140, 80], tracks: ['Vibraphone XS', 'Crotales RM', 'Glockenspiel RM', 'Xylophone RM', 'Marimba RM'] },
  { name: 'Piano', color: [210, 110, 110], tracks: ['Piano Kontakt', 'PianoPlucked Kontakt', 'PianoHarm PP2', 'PianoMute PP2'] },
  { name: 'Violin', color: [190, 120, 200], tracks: ['Violin XS'] },
  { name: 'Cello', color: [140, 120, 210], tracks: ['Cello XS'] },
];
const owns = (ins, t) => (typeof ins.tracks === 'function' ? ins.tracks(t) : ins.tracks.includes(t));

const dir = path.join(ROOT, 'midi', score);
const audio = JSON.parse(fs.readFileSync(path.join(dir, 'stems_audio.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'stems.json'), 'utf8'));
const planBy = new Map(plan.stems.map(s => [s.n, s]));
const stems = Object.values(audio.stems).sort((a, b) => a.n - b.n);

const problems = [];
for (const s of stems) {
  if (!INSTRUMENTS.some(i => owns(i, s.track))) problems.push('no instrument for track: ' + s.track);
  if (!fs.existsSync(s.file)) problems.push('audio missing: ' + s.file);
  const p = planBy.get(s.n);
  if (!p) problems.push('not in stems.json: ' + s.name);
  else if (!fs.existsSync(path.join(ROOT, p.file))) problems.push('MIDI missing: ' + p.file);
  if (!(s.at >= 0) || !(s.len > 0)) problems.push('bad place or length: ' + s.name);
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

const end = Math.ceil(Math.max(...stems.map(s => s.at + s.len))) + 2;
const guid = () => '{' + crypto.randomUUID().toUpperCase() + '}';
const q = s => '"' + String(s).replace(/"/g, "'") + '"';
const col = ([r, g, b]) => 0x1000000 | (b << 16) | (g << 8) | r;

const rows = [];
rows.push({ name: 'INSTRUMENTS', level: 0, color: [170, 170, 170] });
for (const ins of INSTRUMENTS) {
  const mine = stems.filter(s => owns(ins, s.track));
  if (!mine.length) continue;
  rows.push({ name: ins.name, level: 1, color: ins.color, collapsed: true });
  for (const s of mine) {
    rows.push({ name: s.name, level: 2, color: ins.color, item: { pos: s.at, len: s.len, name: s.name, kind: 'WAVE', file: s.file } });
    rows.push({ name: 'MIDI - ' + s.name, level: 2, color: ins.color, midi: true,
      item: { pos: 0, len: end, name: 'MIDI - ' + s.name, kind: 'MIDI', file: path.join(ROOT, planBy.get(s.n).file) } });
  }
}
rows.push({ name: 'ELEC', level: 0, color: [100, 100, 100] });
const elecFile = path.join(dir, 'elec_stems.json');   // step 4 (tools/elec_stems.js): the four lanes and the sine tones; absent = the four lanes empty
if (fs.existsSync(elecFile)) {
  for (const s of JSON.parse(fs.readFileSync(elecFile, 'utf8')).stems) {
    if (!fs.existsSync(s.file)) { console.error('audio missing: ' + s.file); process.exit(1); }
    rows.push({ name: s.name, level: 1, color: s.kind === 'sine' ? [130, 150, 170] : [100, 100, 100], item: { pos: s.at, len: s.len, name: s.name, kind: 'WAVE', file: s.file } });
  }
} else for (let i = 1; i <= 4; i++) rows.push({ name: 'Elec ' + i, level: 1, color: [100, 100, 100] });

const out = ['<REAPER_PROJECT 0.1 "7.82/win64" ' + Math.floor(Date.now() / 1000) + ' 0', '  SAMPLERATE 48000 0 0', '  TEMPO 60 4 4 0'];
rows.forEach((r, i) => {
  const next = i + 1 < rows.length ? rows[i + 1].level : 0;
  const d = next - r.level;
  const isbus = d > 0 ? '1 1' : d < 0 ? '2 ' + d : '0 0';
  out.push('  <TRACK ' + guid(), '    NAME ' + q(r.name), '    PEAKCOL ' + col(r.color), '    VOLPAN 1 0 -1 -1 1',
    '    MUTESOLO ' + (r.midi ? 1 : 0) + ' 0 0', '    SHOWINMIX ' + (r.midi ? 0 : 1) + ' 0.6667 0.5 1 0.5 0 0 0');
  if (r.midi) out.push('    TRACKHEIGHT 24 0 0 0 0 0');
  out.push('    ISBUS ' + isbus, '    BUSCOMP ' + (r.collapsed ? 2 : 0) + ' 0 0 0 0', '    NCHAN 2', '    MAINSEND 1 0', '    TRACKID ' + guid());
  if (r.item) {
    out.push('    <ITEM', '      POSITION ' + r.item.pos.toFixed(6), '      LENGTH ' + r.item.len.toFixed(6), '      NAME ' + q(r.item.name),
      '      IGUID ' + guid(), '      GUID ' + guid(), '      <SOURCE ' + r.item.kind, '        FILE ' + q(r.item.file), '      >', '    >');
  }
  out.push('  >');
});
out.push('>', '');

const file = path.join(path.dirname(audio.dir), score + '-mix.rpp');
const report = { file, tracks: rows.length, stems: stems.length, midi: rows.filter(r => r.midi).length, instruments: rows.filter(r => r.level === 1 && r.collapsed).map(r => r.name), endS: end };
if (has('dry')) { console.log(JSON.stringify(report, null, 1)); process.exit(0); }
if (fs.existsSync(file) && !has('force')) { console.error('REFUSED, the mix project exists (it may hold his faders): ' + file); process.exit(1); }
fs.writeFileSync(file, out.join('\r\n'), 'utf8');
console.log(JSON.stringify(report, null, 1));
