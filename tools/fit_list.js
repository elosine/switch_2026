#!/usr/bin/env node
// fit_list.js — WHAT ON THIS PAGE DOES NOT FIT ITS LANE AND WAS LEFT WHERE IT STOOD (the Switch~ piece RUNNING_LOG §401).
//   node tools/fit_list.js <page id> [--parts 0,1,2,6]      (run from the repo root; the counterpoint's builder runs it itself)
// THE STANDING RULE is the fit ladder (rules.json `ladder`; notation/lib/fit.js; LGMF PLAN 2e.4): a note's column that leaves its part's lane
// is (1) closed up, (3) its words and marks flipped to the other side, (2) made a size smaller, (3) flipped whole — and when none of that
// fits it KEEPS ITS PLACE and is reported (rung 8), marked "fit?" in red on the page. A working page built with --noFitMark hides the red
// mark, so this list is where those are seen. Each line: the part, the time, how far it passes the lane, what it holds. It changes nothing.
'use strict';
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..'), lib = n => require(path.join(ROOT, 'notation', 'lib', n));
const L = lib('layout.js'), R = lib('rules.js'), F = lib('fit.js'), rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const id = process.argv[2]; if (!id || id.startsWith('--')) { console.error('usage: node tools/fit_list.js <page id> [--parts 0,1]'); process.exit(2); }
const pi = process.argv.indexOf('--parts'), only = pi > 0 ? new Set(process.argv[pi + 1].split(',').map(Number)) : null;
const C = R.loadContainer(ROOT), g = rd('notation/lib/glyphs.json'), ens = rd('notation/registry/ensemble.json'), T = rd('notation/registry/techniques.json'), ir = rd('notation/ir/' + id + '.ir.json');
const E = L.ensembleFor(ens, (C.realizations || {})['video-jury']), P = E.parts.map(p => p.part), boxes = F.boxesFor(C, E, P);
const m = L.layoutSection(ir, g, Object.assign({ m4AttackLines: false, frameParts: P, ensemble: E, techniques: T, fitBoxes: boxes }, (C.engraving && C.engraving.layout) || {}));
const nameOf = p => { const e = (ens.parts || []).find(x => x.part === p); return (e && (e.short || e.name)) || ('part ' + p); };
const rows = (m.fit || []).filter(r => !only || only.has(r.part)), bad = rows.filter(r => r.rung === 8 && !r.override);
console.log('THE FIT — ' + id + ': ' + rows.length + ' column(s) left their lane; the ladder placed ' + (rows.length - bad.length) + '; ' + bad.length + ' DO NOT FIT and stand where they stood');
for (const p of [...new Set(bad.map(r => r.part))].sort((a, b) => a - b)) console.log('  ' + nameOf(p) + ': ' + bad.filter(r => r.part === p).map(r => (+r.t).toFixed(2) + ' (' + r.by.replace(/ ss past the /g, ' ').replace('bottom', 'below').replace('top', 'above') + ')').join(' · '));
