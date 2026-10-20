#!/usr/bin/env node
// shift_after.js — EVERYTHING FROM A TIME ON, MOVED AS ONE BLOCK (RUNNING_LOG §288; DEC-80). His words, of the three body problem
// shortened: *"just move everything up keep everything as is and just move it up and just keep the gap between … the end of the three
// body problem and the beginning of the trill."* Every object of a score that BEGINS at or after --from is moved by --by seconds
// (negative = earlier): its own times, and the absolute times its records hold — a petal hit's `properties.petalHit.at`, a later
// section's tag `properties.section.at` (so that tools/insert_section.js --replace puts that section back where it now is), a beating
// note's `properties.sine.was.endSeconds`. Nothing else of an object changes: a trill's midiSnippet, a bend, a gliss, a pattern are
// relative to their object (checked on the piece, §288: no other field holds an absolute time).
//
//   node tools/shift_after.js --score piece-3BodyRedo --from 149 --by -25.693 [--dry] [--unsaved-ok]
//
// It refuses an object that begins before --from and runs past it (a block cannot be cut through a brick), a move that would land the
// block on what stays (the first moved object before the last unmoved one's end), and a working copy of the score with unsaved
// changes (CTRL+S or Reload first; --unsaved-ok at HIS word). File ▾ → Reload in the page after it. THE SORTING: the piece's.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const NAME = arg('score', ''), FROM = +arg('from', NaN), BY = +arg('by', NaN), DRY = has('dry');
if (!NAME || !Number.isFinite(FROM) || !Number.isFinite(BY) || !BY) { console.error('usage: node tools/shift_after.js --score <name> --from <seconds> --by <seconds, negative = earlier> [--dry]'); process.exit(2); }
const file = path.join(ROOT, 'scores', NAME + '.json'), work = path.join(ROOT, 'scores', NAME + '-work.json');
if (!fs.existsSync(file)) { console.error('no such score: scores/' + NAME + '.json'); process.exit(2); }
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
if (fs.existsSync(work)) {
  let same = false; try { same = JSON.stringify(JSON.parse(fs.readFileSync(work, 'utf8')).objects) === JSON.stringify(s.objects); } catch (e) { same = false; }
  if (!same && !DRY && !has('unsaved-ok')) { console.error('the page holds a working copy of ' + NAME + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (or --unsaved-ok at HIS word)'); process.exit(3); }
}
const r3 = (x) => Math.round(x * 1000) / 1000;
const st = (o) => (o.startTime != null ? o.startTime : o.startSeconds), en = (o) => (o.endTime != null ? o.endTime : o.endSeconds);
const timed = (s.objects || []).filter((o) => Number.isFinite(st(o)));
const moved = timed.filter((o) => st(o) >= FROM), stay = timed.filter((o) => st(o) < FROM);
const across = stay.filter((o) => en(o) > FROM);
if (across.length) { console.error(across.length + ' objects begin before ' + FROM + ' s and run past it — a block cannot be cut through them: ' + across.slice(0, 6).map((o) => o.id + ' ' + st(o) + '–' + en(o)).join(' · ')); process.exit(4); }
if (!moved.length) { console.error('nothing begins at or after ' + FROM + ' s'); process.exit(1); }
const stayEnd = stay.length ? Math.max(...stay.map(en)) : 0, first = Math.min(...moved.map(st));
if (first + BY < stayEnd - 1e-6) { console.error('the block would land on what stays: its first object at ' + r3(first + BY) + ' s, before ' + r3(stayEnd) + ' s where the rest ends'); process.exit(4); }
const n = { petalHit: 0, section: 0, was: 0 }, sections = {};
for (const o of moved) {
  for (const k of ['startSeconds', 'endSeconds', 'startTime', 'endTime']) if (Number.isFinite(o[k])) o[k] = r3(o[k] + BY);
  const p = o.properties || {};
  if (p.petalHit && Number.isFinite(p.petalHit.at)) { p.petalHit.at = r3(p.petalHit.at + BY); n.petalHit++; }
  if (p.section && Number.isFinite(p.section.at)) { const was = p.section.at; p.section = Object.assign({}, p.section, { at: r3(was + BY) }); sections[p.section.name] = was + ' → ' + p.section.at; n.section++; }
  if (p.sine && p.sine.was && Number.isFinite(p.sine.was.endSeconds)) { p.sine.was.endSeconds = r3(p.sine.was.endSeconds + BY); n.was++; }
}
const marks = (s.markers || []).filter((m) => Number.isFinite(m.time) && m.time >= FROM); marks.forEach((m) => { m.time = r3(m.time + BY); });
console.log('SHIFT ' + NAME + ': ' + moved.length + ' objects from ' + FROM + ' s on moved by ' + BY + ' s (' + stay.length + ' stay) · the block now ' + r3(first + BY) + ' → ' + r3(Math.max(...moved.map(en))) + ' s · ' + r3(first + BY - stayEnd) + ' s after the end of what stays (' + r3(stayEnd) + ' s)'
  + '\n  records moved with them: ' + n.petalHit + ' petal hits · ' + n.section + ' section tags (' + (Object.keys(sections).map((k) => k + ' ' + sections[k]).join(' · ') || 'none') + ') · ' + n.was + ' kept ends' + (marks.length ? ' · ' + marks.length + ' markers' : ''));
if (DRY) { console.log('(dry — nothing written)'); process.exit(0); }
s.metadata = Object.assign({}, s.metadata, { modified: new Date().toISOString() });
if (Array.isArray(s.metadata.sections)) s.metadata.sections = s.metadata.sections.map((x) => (sections[x.name] ? Object.assign({}, x, { at: r3(x.at + BY), command: String(x.command || '').replace(/--at [\d.]+/, '--at ' + r3(x.at + BY)) }) : x));
fs.writeFileSync(file, JSON.stringify(s, null, 1) + '\n');
console.log('scores/' + NAME + '.json written — the score ends at ' + r3(Math.max(...(s.objects || []).filter((o) => Number.isFinite(en(o))).map(en))) + ' s · File ▾ → Reload in the page');
