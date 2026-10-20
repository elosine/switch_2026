#!/usr/bin/env node
// current_trims — the trim each instrument's track carries NOW, as JSON on stdout: { "<instrument key>": dB }.
//
//   node tools/current_trims.js
//
// Pitched instruments: the recipe's `balanceDb` (sandbox/instruments.js). Percussion: bank/perc_rack.json, by catalog key —
// the same two sources tools/compute_trims.js reads as "current". A source that is absent contributes nothing.
//
// Read by probes/analyze_card.py, which stamps the value on every row it measures (`trimAtMeasurementDb`), so that
// compute_trims.js corrects from the trim that was IN FORCE when the row was measured and can never apply a correction
// twice (piece #6's RUNNING_LOG §87 and its NITS; the harvest's H-17).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const out = {};
try {
    const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
    for (const [key, I] of Object.entries(INSTRUMENTS)) out[key] = (I && I.balanceDb != null) ? +I.balanceDb : 0;
} catch (e) { console.error('current_trims: the recipe could not be read — ' + e.message); process.exit(2); }
try {
    const PERC = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'perc_rack.json'), 'utf8'));
    for (const t of (PERC.tracks || [])) if (t.catalog && t.trimDb != null) out[t.catalog] = +t.trimDb;
} catch (e) { /* no percussion rack store yet */ }
process.stdout.write(JSON.stringify(out));
