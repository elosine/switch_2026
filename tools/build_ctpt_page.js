#!/usr/bin/env node
// build_ctpt_page.js — THE COUNTERPOINT'S PAGE (s2-ctpt-heads), built with every decision taken on it so far (the Switch~ piece RUNNING_LOG §369).
//   node tools/build_ctpt_page.js      (run from the repo root)
// A decision of his on this page is a line added here; the page is then built again by this one file.
const { spawnSync } = require('child_process');
const args = ['tools/notate_section.js', '--score', 'piece-FirstDraft-Final-B-noFadeAt96', '--w0', '199', '--w1', '254', '--parts', '0-6', '--alone', '199-254', '--exp', '--noFitMark', '--timeSpacing',
  '--id', 's2-ctpt-heads', '--label', 'Section 2 - the counterpoint, 200 to 253 s: note heads at their played times (a working page)',
  // THE BEAMING THRESHOLD (his, §369): two notes of a part no farther apart than the clarinet's pair at 217.37 → 217.70 (0.329 s) are beamed
  '--beam', '205.9985-206.29@0', '--beam', '209.80-210.45@0', '--beam', '233.97-234.08@0',   // (the flute's first: its two 16ths — the note before them is their grace pickup, §371)
  '--beam', '206.40-206.70@1', '--beam', '217.36-217.71@1', '--beam', '223.39-223.74@1',
  // THE GRACE-NOTE PICKUPS (his, §369 · §371): the note before is a grace note that leads to the next — its own flag and stroke, stood off to
  // the left, no slur, no beam; no go line, dynamic or gestural curve of its own (one curve, on the main note)
  ...[['wc-2742', 'wc-2743'],   // the clarinet, 230.37 → 230.42
      ['wc-2692', 'wc-2691']]   // the flute, 205.998 → the two 16ths of 206.00 · 206.28
    .flatMap(([g, m]) => ['--hand', g + ':' + JSON.stringify({ grace: true, pickupTo: m, goLine: false, dynMark: false }), '--noGc', g])];
const r = spawnSync('node', args, { encoding: 'utf8' });
console.log((r.stdout + r.stderr).split('\n').filter(l => /READY|FAILED|INVALID|Error|beam|hand|grace|usage/i.test(l)).join('\n').slice(0, 2500));
