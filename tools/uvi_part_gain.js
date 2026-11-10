#!/usr/bin/env node
// uvi_part_gain.js — a UVI part's GAIN set as text, in dB (the volume standard, 2026-11-10, RUNNING_LOG §148): the per-articulation
// "volume knob" he asked for. The baseline (uvi_edit.js baseline) leaves every part at +6 dB (Gain="1.9952623", the value CC7 = 127
// leaves a part at); a voice that measures louder or softer than its instrument's ordinary gets that difference folded into ITS part's
// gain, so the velocities stay what he wrote and the samples keep their character. Decode → rewrite Gain on the parts → encode --push
// (the plugin reloads) → read back.
//
//   node tools/uvi_part_gain.js "<track>" <part,part,…> <gainDb>          # absolute: the part's gain becomes this (e.g. 6 = the baseline)
//   node tools/uvi_part_gain.js "<track>" <part,part,…> <deltaDb> --rel   # relative to the baseline +6 dB (−4 → +2 dB)
//   node tools/uvi_part_gain.js "<track>" --table                         # one line per part: its gain in dB
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const args = process.argv.slice(2), dry = args.includes('--dry'), rel = args.includes('--rel');
const [track] = args;
if (!track) { console.error('usage: uvi_part_gain.js "<track>" <parts> <dB> [--rel] | "<track>" --table'); process.exit(2); }
const STATE = path.join(__dirname, 'uvi_state.js'), BASE_DB = 6;
const run = (a) => { const r = cp.spawnSync(process.execPath, [STATE, ...a], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); } return r.stdout; };
const xml = path.join(os.tmpdir(), 'uvi_gain_' + process.pid + '.xml');
run(['decode', track, xml]);
let s = fs.readFileSync(xml, 'utf8');
const tags = () => [...s.matchAll(/<Part\b[^>]*DisplayName="Part (\d+)"[^>]*>/g)].map((m) => ({ no: +m[1], index: m.index, tag: m[0] }));
const dBof = (tag) => { const g = +(/ Gain="([^"]*)"/.exec(tag) || [])[1]; return g > 0 ? Math.round(20 * Math.log10(g) * 100) / 100 : -150; };
const progOf = (t) => (/<Program\b[^>]*DisplayName="([^"]*)"/.exec(s.slice(t.index, s.indexOf('</Part>', t.index))) || [])[1];
if (args[1] === '--table') { for (const t of tags()) { const p = progOf(t); if (p) console.log(String(t.no).padStart(2) + '  ' + p.replace(/&amp;/g, '&').padEnd(44) + String(dBof(t.tag)).padStart(7) + ' dB'); } fs.unlinkSync(xml); process.exit(0); }
const parts = String(args[1] || '').split(',').map(Number).filter((n) => n >= 1 && n <= 16), val = +args[2];
if (!parts.length || !Number.isFinite(val)) { console.error('usage: uvi_part_gain.js "<track>" <parts> <dB> [--rel]'); process.exit(2); }
const wantDb = rel ? BASE_DB + val : val, lin = Math.pow(10, wantDb / 20).toFixed(7);
for (const t of tags().sort((a, b) => b.no - a.no)) {
    if (!parts.includes(t.no)) continue;
    console.log(track + ' · part ' + t.no + ' (' + (progOf(t) || '(empty)').replace(/&amp;/g, '&') + '): gain ' + dBof(t.tag) + ' → ' + wantDb + ' dB');
    const nt = t.tag.replace(/ Gain="[^"]*"/, ' Gain="' + lin + '"');
    s = s.slice(0, t.index) + nt + s.slice(t.index + t.tag.length);
}
if (dry) { fs.unlinkSync(xml); console.log('(dry: nothing pushed)'); process.exit(0); }
fs.writeFileSync(xml, s);
console.log(run(['encode', track, xml, '--push']).trim().split('\n').pop());
fs.unlinkSync(xml);
