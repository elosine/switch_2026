#!/usr/bin/env node
// build_ctpt_page.js — THE COUNTERPOINT'S PAGE (s2-ctpt-heads), built with every decision taken on it so far (the Switch~ piece RUNNING_LOG §369 on).
//   node tools/build_ctpt_page.js      (run from the repo root)
// THE RECIPE is docs/NOTATION_SCHEME.md § 2b. The FLUTE was worked by him note by note (its groups are written out below); the parts in
// AUTO_PARTS are built BY THE RULES he settled on the flute (§387) — nothing of theirs is written out here, so a rule that changes rebuilds them.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), SCORE = 'piece-FirstDraft-Final-B-noFadeAt96', W0 = 199, W1 = 254;
const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', SCORE + '.json'), 'utf8'));
const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'notation', 'registry', 'techniques.json'), 'utf8'));
const DEV = (((require(path.join(ROOT, 'notation', 'lib', 'rules.js')).loadContainer(ROOT).engraving || {}).layout || {}).devices || {}).byTechnique || {};

// ---- THE RULES' NUMBERS (his, on the flute)
const BEAM_S = 0.33;    // THE BEAMING MEASURE: the clarinet's pair at 217.37 → 217.70 (§369)
const GRACE_S = 0.06;   // a note this close before another is its GRACE-NOTE PICKUP (§369 · §371; his two cases: 0.049 s and less)
const SAME_S = 0.01;    // under this, two notes are at ONE INSTANT — never a rhythm; listed for him (tools/no_rule_list.js)

// ---- THE FLUTE, by his word, group by group
const BEAMS = [
  [205.99, 206.29, 0],     // the two 16ths (the D5 doubled before them is out of the save, §376)
  [209.80, 210.45, 0],     // three
  [220.30, 220.73, 0],     // a tongue ram and a staccato, 0.39 s apart — his word, §374 ("You can beam the 2 starting at 220.27")
  [233.97, 234.15, 0],     // the staccato and the jet whistle a fast 16th after it (the first jet whistle is out of the save, §376)
  [248.93, 249.46, 0],     // a tongue ram and a staccato, 0.49 s apart — his word, §374 ("The 2 at 248.8 can be beamed")
];
const GRACES = [];         // [the grace note, its main note]

// ---- THE OTHER PARTS, by the rules (§387): clarinet · alto sax · violin. (The piano and the percussion are taken separately — his word.)
const AUTO_PARTS = [1, 2, 6];
// a SHORT note is one that takes a flag (its technique's look says so) or, with no look yet, a one-shot; a HELD note (a white head) is never
// beamed by rule — a short note running into a held one is LISTED for him, not beamed (§387: the clarinet's 206.41 → 206.70 looked wrong)
const isShort = tech => { const d = DEV[tech]; return d ? /^flag/.test(String(d.nhStem || '')) : ((T.techniques || {})[tech] || {}).family === 'oneshot'; };
for (const part of AUTO_PARTS) {
  const ns = save.objects.filter(o => o.type === 'waveCurve' && o.layer === part && o.sonifyNote != null && o.startSeconds >= W0 && o.startSeconds < W1).sort((a, b) => a.startSeconds - b.startSeconds);
  const graceOf = new Set(); let run = [];
  const close = () => { const times = [...new Set(run.map(o => o.startSeconds.toFixed(3)))]; if (times.length >= 2) BEAMS.push([+(run[0].startSeconds - 0.004).toFixed(3), +(run[run.length - 1].startSeconds + 0.004).toFixed(3), part]); run = []; };
  for (let i = 0; i < ns.length; i++) { const o = ns[i], p = ns[i - 1], g = p ? o.startSeconds - p.startSeconds : Infinity;
    if (g < SAME_S) { if (run.length) run.push(o); continue; }                                      // one instant: with its twin, whatever that is in
    if (g <= GRACE_S) { GRACES.push([p.id, o.id]); graceOf.add(p.id); if (run.length && run[run.length - 1] === p) run.pop(); close(); if (isShort(o.technique)) run = [o]; continue; }
    if (g <= BEAM_S && isShort(p.technique) && isShort(o.technique) && !graceOf.has(p.id)) { if (!run.length) run = [p]; run.push(o); continue; }
    close(); if (isShort(o.technique)) run = [o]; }
  close();
}

const args = ['tools/notate_section.js', '--score', SCORE, '--w0', String(W0), '--w1', String(W1), '--parts', '0-7', '--alone', W0 + '-' + W1, '--exp', '--noFitMark', '--timeSpacing',
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
for (const o of save.objects) if (o.type === 'waveCurve' && o.startSeconds >= W0 && o.startSeconds < W1 && o.properties && o.properties.dyn && o.properties.dyn.tied && !graceIds.has(o.id))
  args.push('--hand', o.id + ':' + JSON.stringify({ dynMark: false }));
// THE GRACE-NOTE PICKUPS (his, §369 · §371 · §374): its own flag and stroke, stood off to the left, no slur, no beam, its stem down to the main
// note's; no go line, dynamic or gestural curve of its own (one curve, on the main note)
for (const [g, m] of GRACES) args.push('--hand', g + ':' + JSON.stringify({ grace: true, pickupTo: m, goLine: false, dynMark: false }), '--noGc', g);

// ---- HIS OWN WORD ON SINGLE NOTES of the parts built by rule (each with its entry)
const HANDS = {
  // §392 (2026-11-22), the alto sax at 206.48, a double-tongued F5 0.07 s long: 'Let's change that double-tongued note to a grace note, black note head,
  // just your typical grace note that we've been using, but you can keep the slashes and the … DT' — at its own time (the next note is 0.26 s on)
  'wc-2762': { grace: true, graceTremolo: true, nhHead: 'filled', nhStem: 'flag16', nhStemRule: 'flagClear' },
};
for (const [id, h] of Object.entries(HANDS)) args.push('--hand', id + ':' + JSON.stringify(h));

const r = spawnSync('node', args, { cwd: ROOT, encoding: 'utf8' });
const outp = (r.stdout + r.stderr).split('\n');
console.log(outp.filter(l => /READY|FAILED|INVALID|Error|usage|not an event/i.test(l)).join('\n').slice(0, 3000));
console.log('beamed groups: ' + [0].concat(AUTO_PARTS).map(p => 'part ' + p + ' ' + BEAMS.filter(b => b[2] === p).length).join(' · ') + ' · grace pickups: ' + GRACES.length + (GRACES.length ? ' (' + GRACES.map(g => g[0]).join(' · ') + ')' : ''));
// [§382] WHAT ON THE PAGE HAS NO RULE YET — printed by the build itself, before anyone looks at the picture (tools/no_rule_list.js)
console.log(spawnSync('node', ['tools/no_rule_list.js', 's2-ctpt-heads', '--parts', '0,1,2,6'], { cwd: ROOT, encoding: 'utf8' }).stdout);
