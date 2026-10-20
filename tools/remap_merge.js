#!/usr/bin/env node
// remap_merge.js — put freshly built dynamics curves INTO bank/velocity_remap.json without losing the carried ones
// (the new-piece protocol's 5.5; RUNNING_LOG §42, 2026-10-04).
//
//   node tools/build_remap_card.js --only bass_clarinet,viola --out <scratch>/remap_new.json
//   node tools/remap_merge.js --from <scratch>/remap_new.json --only bass_clarinet,viola [--dry]
//
// WHY IT EXISTS. tools/build_remap_card.js rebuilds the WHOLE file from the card. This rack's card holds a full
// velocity ladder only for the instruments measured here; the cello's curve is piece #6's, carried, and its three
// cross-check notes would rebuild it as "not remapped". So a run is built to a scratch file and merged by name.
//
// THE CC7 LAW — the fader curve that SHAPES A HELD NOTE (docs/DYNAMICS_LAW.md; without one a drawn note's height moves
// nothing). build_remap_card reads it from piece #6's bank/balance.json, which is not here. It is KONTAKT's law, not an
// instrument's: piece #6 measured the english horn, the cello and the double bass within 0.4 dB of one another at
// every point from CC7 44 up (−27.5 · −17.7 · −10.9 · −5.1 · 0 dB at 44 · 64 · 84 · 104 · 127), and piece #5 measured
// THESE VERY bass clarinet and viola instances on the same line (−17.5 and −17.9 dB at CC7 64). So:
//   the bass clarinet · the viola   piece #5's own measured curve (septet_2026/bank/velocity_remap.json), from its git
//   any other Kontakt instrument    the cello's curve already in the file — --cc7-from cello
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes('--dry');
const FROM = arg('from', null), ONLY = (arg('only', '') || '').split(',').filter(Boolean), CC7_FROM = arg('cc7-from', null);
if (!FROM || !ONLY.length) { console.error('usage: node tools/remap_merge.js --from <built.json> --only key,key [--cc7-from cello] [--dry]'); process.exit(2); }
const OUT = path.join(ROOT, 'bank', 'velocity_remap.json');
const cur = JSON.parse(fs.readFileSync(OUT, 'utf8')), neu = JSON.parse(fs.readFileSync(path.resolve(FROM), 'utf8'));
if (JSON.stringify(cur.scale) !== JSON.stringify(neu.scale)) console.warn('WARNING: the two files\' scales differ — ' + JSON.stringify(neu.scale).slice(0, 80));
let P5 = null;
try { P5 = JSON.parse(execFileSync('git', ['-C', path.resolve(ROOT, '..', 'septet_2026'), 'show', 'HEAD:bank/velocity_remap.json'], { encoding: 'utf8', maxBuffer: 1 << 26 })); } catch (e) { /* piece #5 not on this machine */ }

for (const key of ONLY) {
  const e = neu.instruments[key]; if (!e) { console.error(key + ': not in ' + FROM + ' (' + (neu.notRemapped && neu.notRemapped[key] || 'absent') + ')'); process.exit(1); }
  if (!e.cc7Curve) {
    const p5 = P5 && P5.instruments && P5.instruments[key] && P5.instruments[key].cc7Curve;
    if (p5 && !CC7_FROM) { e.cc7Curve = p5.map(p => ({ cc7: p.cc7, delta: p.delta })); e.cc7Note = 'the fader law that SHAPES A HELD NOTE (D13), MEASURED IN PIECE #5 on this very instance (septet_2026 bank/velocity_remap.json, its sweep of 2026-09-07) and relative to CC7 127 — carried 2026-10-04; it is Kontakt\'s law, the cello\'s line within 0.4 dB.'; }
    else if (CC7_FROM && cur.instruments[CC7_FROM] && cur.instruments[CC7_FROM].cc7Curve) { e.cc7Curve = cur.instruments[CC7_FROM].cc7Curve.map(p => Object.assign({}, p)); e.cc7Note = 'the fader law that SHAPES A HELD NOTE (D13): KONTAKT\'s, taken from the ' + CC7_FROM + '\'s measured curve (piece #6) — not measured on this instrument; three Kontakt instruments measured within 0.4 dB of it.'; }
    else { console.error(key + ': no CC7 law to give it — a drawn note\'s height would not move it'); process.exit(1); }
  }
  e.mergedAt = new Date().toISOString(); e.cardRun = neu.cardGeneratedAt || null;
  cur.instruments[key] = e;
  if (cur.notRemapped) delete cur.notRemapped[key];
  cur.clamps = (cur.clamps || []).filter(c => c.inst !== key).concat((neu.clamps || []).filter(c => c.inst === key));
  console.log('  ' + key.padEnd(15) + 'own span ' + e.measuredSpanDb + ' dB · register spread at fff ' + e.registerSpreadAtFffDb + ' dB · clamps ' + e.clampedLow + ' low / ' + e.clampedHigh + ' high · CC7 law ' + e.cc7Curve.length + ' points');
}
cur._decibel = (cur._decibel ? cur._decibel + ' ' : '') + 'MERGED ' + new Date().toISOString().slice(0, 10) + ' (tools/remap_merge.js, RUNNING_LOG §42): ' + ONLY.join(' · ') + ' built from THIS rack\'s card; every other instrument as carried.';
console.log('instruments now: ' + Object.keys(cur.instruments).join(' · '));
if (DRY) { console.log('dry run — nothing written'); process.exit(0); }
fs.writeFileSync(OUT, JSON.stringify(cur, null, 1) + '\n');
console.log('wrote bank/velocity_remap.json');
