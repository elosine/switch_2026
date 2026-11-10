#!/usr/bin/env node
// uvi_script_attr.js — ANY attribute of an SI2 part's script block set as text (2026-11-10, RUNNING_LOG §147): decode the running instance,
// rewrite the attribute on <ScriptProcessor Name="EventProcessor0" …> of the named parts, encode --push (the plugin reloads), read back.
// uvi_dynamic.js does this for one attribute (Dynamic); this one is for the others. The need: the flute's and the clarinet's Flatterzunge
// presets ship with MidiModeMenu="2" — the EXPRESSION MODE "Mod Wheel", so velocity moves nothing and the wheel at 0 leaves them 40 dB down.
// The Ordinario's (and the sax's Flatterzunge's) MidiModeMenu="1" is "Velocity" — the lineage's rule (uvi.md § 4: the velocity IS the dynamic).
//
//   node tools/uvi_script_attr.js "<track>" <part,part,…> <Attribute> <value> [--dry]
//   node tools/uvi_script_attr.js "<track>" --table <Attribute>            # one line per part: the attribute's value
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const args = process.argv.slice(2), dry = args.includes('--dry');
const [track] = args;
const STATE = path.join(__dirname, 'uvi_state.js');
const run = (a) => { const r = cp.spawnSync(process.execPath, [STATE, ...a], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); } return r.stdout; };
const xml = path.join(os.tmpdir(), 'uvi_attr_' + process.pid + '.xml');
if (!track) { console.error('usage: uvi_script_attr.js "<track>" <parts> <Attribute> <value> | "<track>" --table <Attribute>'); process.exit(2); }
run(['decode', track, xml]);
let s = fs.readFileSync(xml, 'utf8');
const partBlocks = () => [...s.matchAll(/<Part\b[^>]*DisplayName="Part (\d+)"[^>]*>/g)].map((m) => ({ no: +m[1], start: m.index, end: s.indexOf('</Part>', m.index) }));
if (args[1] === '--table') {
    const attr = args[2]; if (!attr) { console.error('--table <Attribute>'); process.exit(2); }
    for (const p of partBlocks()) { const b = s.slice(p.start, p.end); const prog = (/<Program\b[^>]*DisplayName="([^"]*)"/.exec(b) || [])[1]; if (!prog) continue; const v = (new RegExp('<ScriptProcessor\\b[^>]*? ' + attr + '="([^"]*)"').exec(b) || [])[1]; console.log(String(p.no).padStart(2) + '  ' + prog.replace(/&amp;/g, '&').padEnd(40) + attr + ' = ' + v); }
    fs.unlinkSync(xml); process.exit(0);
}
const parts = String(args[1] || '').split(',').map(Number).filter((n) => n >= 1 && n <= 16), attr = args[2], value = args[3];
if (!parts.length || !attr || value == null) { console.error('usage: uvi_script_attr.js "<track>" <parts> <Attribute> <value>'); process.exit(2); }
let edits = 0;
for (const p of partBlocks().sort((a, b) => b.no - a.no)) {   // highest first: offsets above stay valid
    if (!parts.includes(p.no)) continue;
    const b = s.slice(p.start, p.end); const m = /<ScriptProcessor\b[^>]*>/.exec(b); if (!m) { console.error('part ' + p.no + ': no script block'); process.exit(1); }
    const re = new RegExp('( ' + attr + '=")([^"]*)(")'); const hit = re.exec(m[0]); if (!hit) { console.error('part ' + p.no + ': no attribute ' + attr + ' on its script block'); process.exit(1); }
    const prog = (/<Program\b[^>]*DisplayName="([^"]*)"/.exec(b) || [])[1] || '?';
    console.log(track + ' · part ' + p.no + ' (' + prog.replace(/&amp;/g, '&') + '): ' + attr + ' ' + hit[2] + ' → ' + value);
    const tag = m[0].replace(re, '$1' + value + '$3');
    s = s.slice(0, p.start + m.index) + tag + s.slice(p.start + m.index + m[0].length); edits++;
}
if (dry) { fs.unlinkSync(xml); console.log('(dry: nothing pushed)'); process.exit(0); }
fs.writeFileSync(xml, s);
console.log(run(['encode', track, xml, '--push']).trim().split('\n').pop());
fs.unlinkSync(xml);
console.log(edits + ' part(s) edited');
