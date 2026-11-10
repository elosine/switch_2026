#!/usr/bin/env node
// uvi_part_gain.js — a UVI part's VOLUME KNOB set as text, in dB (the volume standard, 2026-11-10, RUNNING_LOG §148 · §149). The knob is the
// PROGRAM's Gain inside the part (factory 1 = 0 dB on every part) — NOT the Part's Gain: that one IS CC7's target (the baseline's +6 dB is
// "the value CC7 = 127 leaves a part at", and the composer sends CC7 127 before every plain note, so a Part gain edit is undone at the
// first note — found when the first gains pass changed nothing, §149). A voice that measures louder or softer than its instrument's
// ordinary gets the difference here; the velocities stay what he wrote and the samples keep their character. Decode → rewrite → encode
// --push (the plugin reloads) → read back.
//
//   node tools/uvi_part_gain.js "<track>" <part,part,…> <gainDb>          # the program's gain becomes this (0 = factory)
//   node tools/uvi_part_gain.js "<track>" <part,part,…> <gainDb> --part   # the PART's Gain instead (6 = the baseline) — CC7 owns it; for a reset
//   node tools/uvi_part_gain.js "<track>" --table                         # one line per part: program gain · part gain, in dB
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const args = process.argv.slice(2), dry = args.includes('--dry'), PART = args.includes('--part'), ADD = args.includes('--add');   // --add: the value is ADDED to the part's present program gain
const [track] = args;
if (!track) { console.error('usage: uvi_part_gain.js "<track>" <parts> <dB> [--part] | "<track>" --table'); process.exit(2); }
const STATE = path.join(__dirname, 'uvi_state.js');
const run = (a) => { const r = cp.spawnSync(process.execPath, [STATE, ...a], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); } return r.stdout; };
const xml = path.join(os.tmpdir(), 'uvi_gain_' + process.pid + '.xml');
run(['decode', track, xml]);
let s = fs.readFileSync(xml, 'utf8');
const dB = (g) => (g > 0 ? Math.round(20 * Math.log10(g) * 100) / 100 : -150);
const parts = () => [...s.matchAll(/<Part\b[^>]*DisplayName="Part (\d+)"[^>]*>/g)].map((m) => { const end = s.indexOf('</Part>', m.index); const pm = /<Program\b[^>]*>/.exec(s.slice(m.index, end)); return { no: +m[1], index: m.index, tag: m[0], end, prog: pm ? { index: m.index + pm.index, tag: pm[0] } : null }; });
const gainOf = (tag) => dB(+(/ Gain="([^"]*)"/.exec(tag) || [])[1]);
const progName = (p) => (/ DisplayName="([^"]*)"/.exec(p.prog ? p.prog.tag : '') || [])[1];
if (args[1] === '--table') { for (const p of parts()) if (p.prog) console.log(String(p.no).padStart(2) + '  ' + (progName(p) || '?').replace(/&amp;/g, '&').padEnd(44) + 'program ' + String(gainOf(p.prog.tag)).padStart(6) + ' dB · part ' + String(gainOf(p.tag)).padStart(6) + ' dB'); fs.unlinkSync(xml); process.exit(0); }
const want = String(args[1] || '').split(',').map(Number).filter((n) => n >= 1 && n <= 16), val = +args[2];
if (!want.length || !Number.isFinite(val)) { console.error('usage: uvi_part_gain.js "<track>" <parts> <dB> [--part]'); process.exit(2); }
const lin = Math.pow(10, val / 20).toFixed(7);
for (const p of parts().sort((a, b) => b.no - a.no)) {   // highest first: offsets above stay valid
    if (!want.includes(p.no)) continue;
    if (PART) { console.log(track + ' · part ' + p.no + ' (' + (progName(p) || '(empty)').replace(/&amp;/g, '&') + '): PART gain ' + gainOf(p.tag) + ' → ' + val + ' dB'); const nt = p.tag.replace(/ Gain="[^"]*"/, ' Gain="' + lin + '"'); s = s.slice(0, p.index) + nt + s.slice(p.index + p.tag.length); continue; }
    if (!p.prog) { console.log(track + ' · part ' + p.no + ': empty — no program to set'); continue; }
    const target = ADD ? Math.round((gainOf(p.prog.tag) + val) * 10) / 10 : val, linHere = Math.pow(10, target / 20).toFixed(7);
    console.log(track + ' · part ' + p.no + ' (' + (progName(p) || '?').replace(/&amp;/g, '&') + '): program gain ' + gainOf(p.prog.tag) + ' → ' + target + ' dB');
    const nt = p.prog.tag.replace(/ Gain="[^"]*"/, ' Gain="' + linHere + '"'); s = s.slice(0, p.prog.index) + nt + s.slice(p.prog.index + p.prog.tag.length);
}
if (dry) { fs.unlinkSync(xml); console.log('(dry: nothing pushed)'); process.exit(0); }
fs.writeFileSync(xml, s);
console.log(run(['encode', track, xml, '--push']).trim().split('\n').pop());
fs.unlinkSync(xml);
