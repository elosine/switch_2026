#!/usr/bin/env node
// build_ctpt_page.js — THE COUNTERPOINT'S PAGE (s2-ctpt-heads), built with every decision taken on it so far (the Switch~ piece RUNNING_LOG §369 on).
//   node tools/build_ctpt_page.js      (run from the repo root)
// A decision of his on this page is a line added here; the page is then built again by this one file.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), SCORE = 'piece-FirstDraft-Final-B-noFadeAt96';
const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', SCORE + '.json'), 'utf8'));

// THE BEAMED GROUPS [from, to, part] — THE BEAMING THRESHOLD (his, §369): two notes of a part no farther apart than the clarinet's pair at
// 217.37 → 217.70 (0.329 s) are beamed; and the pairs he has since named one by one (§374).
const BEAMS = [
  [205.99, 206.29, 0],     // flute: the two 16ths (the D5 doubled before them is out of the save, §376)
  [209.80, 210.45, 0],     // flute: three
  [220.30, 220.73, 0],     // flute: a tongue ram and a staccato, 0.39 s apart — his word, §374 ("You can beam the 2 starting at 220.27")
  [233.97, 234.15, 0],     // flute: the staccato and the jet whistle a fast 16th after it (the first jet whistle is out of the save, §376)
  [248.93, 249.46, 0],     // flute: a tongue ram and a staccato, 0.49 s apart — his word, §374 ("The 2 at 248.8 can be beamed")
  [206.40, 206.70, 1],     // clarinet
  [217.36, 217.71, 1],     // clarinet: THE PAIR HE NAMED
  [223.39, 223.74, 1],     // clarinet
];
// THE GRACE-NOTE PICKUPS [the grace note, its main note] (his, §369 · §371): its own flag and stroke, stood off to the left, no slur, no beam;
// no go line, dynamic or gestural curve of its own (one curve, on the main note)
const GRACES = [
  ['wc-2742', 'wc-2743'],   // the clarinet, 230.37 → 230.42
];

const args = ['tools/notate_section.js', '--score', SCORE, '--w0', '199', '--w1', '254', '--parts', '0-6', '--alone', '199-254', '--exp', '--noFitMark', '--timeSpacing',
  '--id', 's2-ctpt-heads', '--label', 'Section 2 - the counterpoint, 200 to 253 s: note heads at their played times (a working page)'];
const graceIds = new Set(GRACES.map(g => g[0]));
for (const [a, b, part] of BEAMS) {
  args.push('--beam', a + '-' + b + '@' + part);
  // A BEAMED GROUP's REGIME (his, §374 — the tubas' rule, the lineage's D43 · D49): the head's LEFT EDGE is the moment, on the gestural curve's
  // go time, and there is NO go line (a go line marks a head that stands off its moment; these do not)
  for (const o of save.objects) if (o.type === 'waveCurve' && o.layer === part && o.startSeconds >= a - 1e-9 && o.startSeconds <= b + 1e-9 && !graceIds.has(o.id))
    args.push('--hand', o.id + ':' + JSON.stringify({ nhAnchor: 'leftEdge', goLine: false }));
}
// THE DYNAMICS (his, §384): every note its own mark, except a note that follows the one before within 0.2 s — it shares that note's mark
// (the save says which: properties.dyn.tied, written by tools/dyn_deal.js --tie)
for (const o of save.objects) if (o.type === 'waveCurve' && o.startSeconds >= 199 && o.startSeconds < 254 && o.properties && o.properties.dyn && o.properties.dyn.tied && !graceIds.has(o.id))
  args.push('--hand', o.id + ':' + JSON.stringify({ dynMark: false }));
for (const [g, m] of GRACES) args.push('--hand', g + ':' + JSON.stringify({ grace: true, pickupTo: m, goLine: false, dynMark: false }), '--noGc', g);

const r = spawnSync('node', args, { cwd: ROOT, encoding: 'utf8' });
console.log((r.stdout + r.stderr).split('\n').filter(l => /READY|FAILED|INVALID|Error|beam bm|--hand|usage|not an event/i.test(l)).join('\n').slice(0, 4000));
// [§382] WHAT ON THE PAGE HAS NO RULE YET — printed by the build itself, before anyone looks at the picture (tools/no_rule_list.js)
console.log(spawnSync('node', ['tools/no_rule_list.js', 's2-ctpt-heads'], { cwd: ROOT, encoding: 'utf8' }).stdout);
