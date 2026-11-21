#!/usr/bin/env node
// no_rule_list.js — WHAT ON THIS PAGE HAS NO RULE YET (the Switch~ piece RUNNING_LOG §381 · §382; his words 2026-11-21: "If there's uncertainty
// or if there's no rules, then it just needs to be flagged to me so that we can develop a rule instead of just improvising … than me needing
// to catch it on the back end after it's been written in").
//
//   node tools/no_rule_list.js <page id> [--parts 0,1]      (run from the repo root; a page's builder runs it itself)
//
// It reads the page and the rules and LISTS, before anyone looks at the picture, everything on it that was drawn WITHOUT a decision of his:
//   1  a playing technique with no look of its own (drawn by the provisional family look: a black or a white head and its bar)
//   2  a technique with no word decided (and no sign that says it)
//   3  two notes of one part at the same instant (one player cannot play both; on one pitch only one sounds)
//   4  a note just before another that is not yet a grace-note pickup
//   5  two notes a little wider apart than the beaming measure, not beamed
// Each line gives the part, the first time it happens, and how often. These go to him as QUESTIONS. It changes nothing.
// What it cannot see: a mark placed by a number that is not a row — that is tools/check_rules.js part (3) (the literals) and part (10) (measured).
'use strict';
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..');
const rd = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const id = process.argv[2]; if (!id || id.startsWith('--')) { console.error('usage: node tools/no_rule_list.js <page id> [--parts 0,1]'); process.exit(2); }
const C = require(path.join(ROOT, 'notation', 'lib', 'rules.js')).loadContainer(ROOT), T = rd('notation/registry/techniques.json'), ens = rd('notation/registry/ensemble.json'), ir = rd('notation/ir/' + id + '.ir.json');
const DEV = (((C.engraving || {}).layout || {}).devices || {}).byTechnique || {}, only = arg('parts', null) ? new Set(arg('parts').split(',').map(Number)) : null;
const BEAM_S = +arg('beam', 0.33), WIDE_S = +arg('wide', 0.5), GRACE_S = +arg('grace', 0.06), SAME_S = 0.01;
const nameOf = p => { const e = (ens.parts || []).find(x => x.part === p); return (e && (e.short || e.name)) || ('part ' + p); };
const partOf = new Map(); for (const c of ir.chunks || []) for (const e of c.events || []) partOf.set(e, c.part);
const hand = new Map(); for (const o of ir.overlays || []) if (o.target && o.target.event && o.value && o.value.device) hand.set(o.target.event, Object.assign(hand.get(o.target.event) || {}, o.value.device));
const byPart = new Map(); for (const e of ir.events) { const p = partOf.get(e.id); if (p == null || (only && !only.has(p))) continue; if (!byPart.has(p)) byPart.set(p, []); byPart.get(p).push(e); }
const t2 = x => x.toFixed(2), out = [];
const group = (rows, key) => { const m = new Map(); for (const r of rows) { const k = key(r); if (!m.has(k)) m.set(k, []); m.get(k).push(r); } return m; };
for (const [p, evs0] of [...byPart.entries()].sort((a, b) => a[0] - b[0])) {
  const evs = evs0.slice().sort((a, b) => a.onset - b.onset), P = nameOf(p), lines = [];
  // 1 · 2 — the techniques
  for (const [tech, list] of group(evs, e => e.technique)) {
    if (tech === 'ord' || tech == null) continue;
    const d = DEV[tech], tt = (T.techniques || {})[tech] || {};
    if (!d) lines.push('1  NO LOOK OF ITS OWN: "' + (tt.label || tech) + '" — ' + list.length + ' note(s), first at ' + t2(list[0].onset) + ' s; drawn as a plain ' + (tt.family === 'oneshot' ? 'black' : 'white') + ' head and its bar');
    const word = (d && (d.instrText || d.instrFirst || d.techText)) || tt.notate, sign = d && (d.nhDot || d.techSymbol || d.nhArtic);
    if (!word && !sign) lines.push('2  NO WORD AND NO SIGN: "' + (tt.label || tech) + '" — ' + list.length + ' note(s), first at ' + t2(list[0].onset) + ' s');
  }
  // 3 · 4 · 5 — the pairs
  const same = [], near = [], wide = [];
  for (let i = 1; i < evs.length; i++) { const a = evs[i - 1], b = evs[i], g = b.onset - a.onset, ha = hand.get(a.id) || {}, hb = hand.get(b.id) || {};
    if (g < SAME_S) same.push(a.onset);
    else if (g <= GRACE_S) { if (!ha.grace) near.push(a.onset); }
    else if (g > BEAM_S && g <= WIDE_S && !(ha.beamGroup && ha.beamGroup === hb.beamGroup)) wide.push([a.onset, g]);
    else if (g <= BEAM_S && !(ha.beamGroup && ha.beamGroup === hb.beamGroup) && !ha.grace) wide.push([a.onset, g, true]); }
  if (same.length) lines.push('3  TWO NOTES AT ONE INSTANT: ' + same.length + ' — at ' + same.map(t2).join(' · ') + ' s');
  if (near.length) lines.push('4  A NOTE JUST BEFORE ANOTHER, NOT A GRACE NOTE: ' + near.length + ' — at ' + near.map(t2).join(' · ') + ' s');
  const under = wide.filter(w => w[2]), over = wide.filter(w => !w[2]);
  if (under.length) lines.push('5a WITHIN THE BEAMING MEASURE (' + BEAM_S + ' s) AND NOT BEAMED: ' + under.length + ' — ' + under.map(w => t2(w[0]) + ' (' + w[1].toFixed(2) + ')').join(' · '));
  if (over.length) lines.push('5b A LITTLE WIDER THAN THE MEASURE, NOT BEAMED: ' + over.length + ' — ' + over.map(w => t2(w[0]) + ' (' + w[1].toFixed(2) + ')').join(' · '));
  if (lines.length) out.push([P + ' (part ' + p + ', ' + evs.length + ' notes)', lines]);
}
console.log('NO RULE YET — ' + id + (only ? ' · parts ' + [...only].join(',') : '') + ' — ' + out.reduce((n, o) => n + o[1].length, 0) + ' question(s)');
for (const [h, lines] of out) { console.log('  ' + h); for (const l of lines) console.log('     ' + l); }
if (!out.length) console.log('  nothing: every technique has its look and its word, and no pair of notes is undecided.');
