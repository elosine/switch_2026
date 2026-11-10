#!/usr/bin/env node
// rack_alive.js — THE ALIVE MAP OF THE RACK: every port, every channel that could hold a voice, one note each, the receiving track's
// peak read in Reaper (tools/artic_probe.js behind it — part_meter.ps1 plays, part_meter.lua meters). A channel that reads nothing
// holds no live voice, whatever the recipe says. His ask (2026-11-10, RUNNING_LOG §143): "a very thorough review of all the things
// that got missed" — this is the ground truth the review stands on; the protocol's container 4 gets it as a gate.
//
//   node tools/rack_alive.js [--only SWFlute,SWPerc] [--dur 1.0] [--gap 2.0]
//   → probes/rack_alive/<stamp>.json (the numbers) · probes/rack_alive/latest.md (the table) · the table on stdout
//
// THE PLAN below is THIS piece's (the SWITCH~ rack, 2026-11-10): a row per port — or per TRACK where several tracks share a port
// (the piano's four, the percussion's eight) — with the note each instrument can sound and the channels worth asking. Edit the rows
// when the rack changes; the tool never guesses from the recipe.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const DUR = arg('dur', '1.0'), GAP = arg('gap', '3.2')   /* ≥ 3: the alignment needs the items farther apart than the player's start jitter (artic_probe.js) */;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const PERC = [['Bongos ARO', 1], ['Shime Daiko ARO', 2], ['Bass Drum Alt ARO', 3], ['Wood Blocks ARO', 4], ['China Cymbal ARO', 5], ['Spring Coil ARO', 6], ['Suspended Cymbals ARO', 7], ['Toms ARO', 8], ['Brake Drums ARO', 9], ['Bass Drum ARO', 10], ['Tam Tams ARO', 11], ['Snare ARO', 12]];
const PLAN = [
    { port: 'SWFlute', note: 72, channels: range(1, 16) },
    { port: 'SWFluteb', note: 72, channels: range(1, 8) },
    { port: 'SWClar', note: 67, channels: range(1, 16) },
    { port: 'SWSax', note: 65, channels: range(1, 16) },
    { port: 'SWSaxb', note: 65, channels: range(1, 16) },
    { port: 'SWVibes', note: 72, channels: range(1, 6) },
    { port: 'SWCrotales', note: 84, channels: range(1, 10) },
    { port: 'SWGlock', note: 84, channels: range(1, 13) },
    { port: 'SWXylo', note: 72, channels: range(1, 11) },
    { port: 'SWMarimba', note: 60, channels: range(1, 9) },
    { port: 'SWViolin', note: 69, channels: range(1, 6) },
    { port: 'SWCello', note: 48, channels: range(1, 6) },
    { port: 'SWPiano', track: 'Piano Kontakt', note: 60, channels: range(1, 8) },
    { port: 'SWPiano', track: 'PianoPlucked Kontakt', note: 60, channels: range(1, 8) },
    { port: 'SWPiano', track: 'PianoHarm PP2', note: 60, channels: range(1, 8) },
    { port: 'SWPiano', track: 'PianoMute PP2', note: 60, channels: range(1, 8) },
    ...PERC.map(([track, ch]) => ({ port: 'SWPerc', track, note: 36, channels: [ch] })),   // ARO All-in-One: C2 (36) is the first hit of every selected instrument
];
const only = arg('only') ? arg('only').split(',') : null;
const rows = PLAN.filter((r) => !only || only.includes(r.port) || only.includes(r.track));
const out = { stamp: new Date().toISOString(), dur: +DUR, gap: +GAP, rows: [] };
const md = ['# RACK ALIVE — ' + out.stamp.slice(0, 16).replace('T', ' ') + ' · one note per channel, the track\'s peak in dB (SILENT = nothing read)', '', '| port | track | ch → peak dB |', '|---|---|---|'];
for (const r of rows) {
    const items = r.channels.map((c) => 'note=' + r.note + ' ch=' + c).join(' ; ');
    const a = ['tools/artic_probe.js', '--port', r.port, '--items', items, '--dur', DUR, '--gap', GAP]; if (r.track) a.push('--track', r.track);
    const p = cp.spawnSync(process.execPath, a, { cwd: ROOT, encoding: 'utf8' });
    const lines = (p.stdout || '').split('\n'); const head = lines.find((l) => / on /.test(l)) || ''; const track = head.split(' on ')[0] || r.track || '?';
    const res = {};
    for (const l of lines) { const m = /ch=(\d+)\s+(-?[\d.]+)\s/.exec(l); if (m) res[+m[1]] = +m[2]; }
    if (!Object.keys(res).length) { const err = (p.stderr || p.stdout || '').trim().split('\n').pop(); out.rows.push({ ...r, track, error: err }); md.push('| ' + r.port + ' | ' + track + ' | ERROR ' + err + ' |'); console.log(r.port, track, 'ERROR', err); continue; }
    const cells = r.channels.map((c) => c + ':' + (res[c] == null ? '?' : res[c] <= -60 ? '—' : res[c]));
    out.rows.push({ ...r, track, peaks: res });
    md.push('| ' + r.port + ' | ' + track + ' | ' + cells.join(' · ') + ' |');
    console.log(r.port.padEnd(11) + (track + '').padEnd(22) + cells.join(' '));
}
const dir = path.join(ROOT, 'probes', 'rack_alive'); fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, out.stamp.replace(/[:.]/g, '-') + '.json'), JSON.stringify(out));
const table = only ? 'latest-partial.md' : 'latest.md';   // a --only run never overwrites the whole rack's table
fs.writeFileSync(path.join(dir, table), md.join('\n') + '\n');
console.log('written: probes/rack_alive/' + table);
