#!/usr/bin/env node
// uvi_dynamic.js — the "Dynamic Amount" dial of SI2 parts, set as TEXT on a decoded UVI XML (the how-to `uvi.md` § 4; piece 5's
// RACK_SETTINGS § 1 and its §56 · §85: the factory 0.70 spans ~5 dB from the quietest velocity to the loudest, 1.00 spans 23–32 dB;
// set it on the main part AND every curve copy). Written 2026-10-20 (RUNNING_LOG §18).
//
//   node tools/uvi_dynamic.js <in.xml> <out.xml> <partNo,partNo,…> [--value 1]     # the parts by their DISPLAY number (Part 1 = 1)
//   node tools/uvi_dynamic.js <in.xml> --table                                        # one line per part: its Dynamic
//
// The attribute lives once per part: <Part Name="Part N-1" … DisplayName="Part N"> … <ScriptProcessor Name="EventProcessor0" … Dynamic="…">.
// Every edit is asserted (the part found once, the attribute found once inside it); nothing else in the XML is touched.
'use strict';
const fs = require('fs');
const args = process.argv.slice(2);
const inFile = args[0]; if (!inFile) { console.error('usage: uvi_dynamic.js <in.xml> <out.xml> <parts> [--value 1] | <in.xml> --table'); process.exit(2); }
let xml = fs.readFileSync(inFile, 'utf8');
const partBlocks = () => {
  const out = []; const re = /<Part Name="Part (\d+)"[^>]*DisplayName="Part (\d+)"[^>]*>/g; let m;
  const starts = []; while ((m = re.exec(xml))) starts.push({ idx: m.index, n: +m[2] });
  for (let i = 0; i < starts.length; i++) { const end = i + 1 < starts.length ? starts[i + 1].idx : xml.length; out.push({ n: starts[i].n, a: starts[i].idx, z: end }); }
  return out;
};
if (args.includes('--table')) {
  for (const p of partBlocks()) { const s = xml.slice(p.a, p.z); const d = (s.match(/<ScriptProcessor Name="EventProcessor0"[^>]*\bDynamic="([^"]*)"/) || [])[1]; const prog = (s.match(/DisplayName="([^"]*)"[^>]*>\s*<Program/) || s.match(/<Program [^>]*DisplayName="([^"]*)"/) || [])[1]; console.log('Part ' + String(p.n).padEnd(3) + ' Dynamic ' + String(d == null ? '—' : (+d).toFixed(2)).padEnd(5) + ' ' + (prog || '')); }
  process.exit(0);
}
const outFile = args[1], parts = (args[2] || '').split(',').map(Number).filter(Boolean);
const vi = args.indexOf('--value'), value = vi >= 0 ? String(+args[vi + 1]) : '1';
if (!outFile || !parts.length) { console.error('usage: uvi_dynamic.js <in.xml> <out.xml> <partNo,…> [--value 1]'); process.exit(2); }
const blocks = partBlocks(); let edits = 0;
for (const n of parts) {
  const hits = blocks.filter(b => b.n === n); if (hits.length !== 1) throw new Error('Part ' + n + ': found ' + hits.length + ' times');
  const b = hits[0]; const s = xml.slice(b.a, b.z);
  const re = /(<ScriptProcessor Name="EventProcessor0"[^>]*\bDynamic=")([^"]*)(")/g; const c = (s.match(re) || []).length;
  if (c !== 1) throw new Error('Part ' + n + ': Dynamic found ' + c + ' times (is a program loaded in it?)');
  const t = s.replace(re, (_, a, old, z) => { edits++; return a + value + z; });
  xml = xml.slice(0, b.a) + t + xml.slice(b.z);
  for (const o of blocks) { if (o.a > b.a) { o.a += t.length - s.length; o.z += t.length - s.length; } else if (o === b) o.z = b.a + t.length; }
}
fs.writeFileSync(outFile, xml);
console.log('Dynamic = ' + value + ' on part(s) ' + parts.join(', ') + ' — ' + edits + ' edit(s) → ' + outFile);
