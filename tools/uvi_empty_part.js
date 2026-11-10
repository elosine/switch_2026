#!/usr/bin/env node
// uvi_empty_part.js — a UVI part EMPTIED as text (the MIDI shore-up, 2026-11-10, RUNNING_LOG §143): the <Program> block taken out of the
// part, so it holds nothing and plays nothing — what the GUI's "clear part" does. Needed after an experiment left dead clones in an
// instance (the flute's `b`, parts 7 · 8 · 9), because a dead clone with a program NAME is what tools/apply_uvi_parts.js would place a
// technique on. Decode → remove → encode --push (which reloads the plugin) → read back.
//
//   node tools/uvi_empty_part.js "Fluteb SI2" 7,8,9 [--dry]
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const [track, list] = process.argv.slice(2); const dry = process.argv.includes('--dry');
if (!track || !list) { console.error('usage: uvi_empty_part.js "<track>" <part,part,…> [--dry]'); process.exit(2); }
const parts = list.split(',').map(Number).filter((n) => n >= 1 && n <= 16).sort((a, b) => b - a);   // highest first: offsets above stay valid
const STATE = path.join(__dirname, 'uvi_state.js');
const run = (a) => { const r = cp.spawnSync(process.execPath, [STATE, ...a], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); } return r.stdout; };
const xml = path.join(os.tmpdir(), 'uvi_empty_' + process.pid + '.xml');
run(['decode', track, xml]);
let s = fs.readFileSync(xml, 'utf8');
for (const no of parts) {
    const tag = [...s.matchAll(/<Part\b[^>]*>/g)].find((m) => new RegExp(' DisplayName="Part ' + no + '"').test(m[0]));
    if (!tag) { console.log('part ' + no + ': not serialized — nothing to empty'); continue; }
    const end = s.indexOf('</Part>', tag.index), i = s.indexOf('<Program', tag.index);
    if (i < 0 || i > end) { console.log('part ' + no + ': already empty'); continue; }
    const j = s.indexOf('</Program>', i) + '</Program>'.length;
    const name = (/DisplayName="([^"]*)"/.exec(s.slice(i, s.indexOf('>', i))) || [])[1];
    console.log('part ' + no + ': "' + (name || '?').replace(/&amp;/g, '&') + '" taken out (' + (j - i) + ' bytes)');
    s = s.slice(0, i) + s.slice(j);
}
if (dry) { fs.unlinkSync(xml); console.log('(dry: nothing pushed)'); process.exit(0); }
fs.writeFileSync(xml, s);
console.log(run(['encode', track, xml, '--push']).trim().split('\n').pop());
fs.unlinkSync(xml);
const info = JSON.parse(run(['info', track]));
console.log('read back: ' + info.parts.map((p) => p.part.replace('Part ', '') + ':' + (p.program ? p.program.replace(/&amp;/g, '&').slice(0, 24) : '—')).join(' · '));
