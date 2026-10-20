#!/usr/bin/env node
// insert_section.js — A BUILT SECTION INTO A PIECE SCORE at a time (his word 2026-10-06: "insert into the score piece-sec01-b at 39
// seconds"; RUNNING_LOG §198; PLAN.md 1.6 item 14.7). Every object of the section's score — the five's containers, their notes, the
// computer players' bricks — is copied into the piece score with NEW ids (from the piece's nextId) and its times moved by `at`;
// each copy is tagged  properties.section = { name, at }  so the whole insertion can be taken out again (--replace: the earlier
// insertion of the same section is removed first — a re-roll, a new length, then the same command). The piece's own objects are
// not touched. The insertion is recorded in  metadata.sections  (name · at · lengthS · seed · the command) — BUT the page's own save
// drops custom metadata (as it drops metadata.deal, RUNNING_LOG §199): the RECORD that lasts is the objects' properties.section tags,
// and --replace works from them.
//
//   node tools/insert_section.js --from three-body --into piece-sec01-b --at 39 [--replace] [--dry] [--unsaved-ok]
//
// It refuses a working copy of the piece score with unsaved changes (CTRL+S or Reload there first; --unsaved-ok at HIS word), a
// section that is already in the score (--replace), and a time under 0. Reload the piece score in the page after it (File ▾ → Reload).
// THE SORTING: this tool knows the piece's saves — it is the piece's.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FROM = arg('from', ''), INTO = arg('into', ''), AT = +arg('at', NaN), DRY = has('dry'), REPLACE = has('replace');
if (!FROM || !INTO || !Number.isFinite(AT) || AT < 0) { console.error('usage: node tools/insert_section.js --from <section score> --into <piece score> --at <seconds> [--replace] [--dry]'); process.exit(2); }
const srcFile = path.join(ROOT, 'scores', FROM + '.json'), dstFile = path.join(ROOT, 'scores', INTO + '.json');
for (const f of [srcFile, dstFile]) if (!fs.existsSync(f)) { console.error('no such score: ' + path.relative(ROOT, f)); process.exit(2); }
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
const r3 = (x) => Math.round(x * 1000) / 1000;

const src = JSON.parse(fs.readFileSync(srcFile, 'utf8')), dst = JSON.parse(fs.readFileSync(dstFile, 'utf8'));
{   // the page's working copy of the piece score: a refusal only when it holds something the save does not (tools/impulse.js, §85)
  const WORK = path.join(ROOT, 'scores', INTO + '-work.json');
  if (fs.existsSync(WORK)) {
    let same = false; try { same = JSON.stringify(JSON.parse(fs.readFileSync(WORK, 'utf8')).objects) === JSON.stringify(dst.objects); } catch (e) { same = false; }
    if (!same && !DRY && !has('unsaved-ok')) { console.error('the page holds a working copy of ' + INTO + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (or --unsaved-ok at HIS word: the page\'s Reload then drops them)'); process.exit(3); }
    if (!same) console.log('(THE PAGE HOLDS UNSAVED CHANGES of ' + INTO + ' — ' + (DRY ? 'this dry run is of the SAVE' : 'written over at his word; Reload in the page after this') + ')');
  }
}
if (JSON.stringify(src.tracks) !== JSON.stringify(dst.tracks)) console.log('NOTE: the two scores\' track lists differ — the lanes are copied by number');

// the earlier insertion of this section, if any
const already = (dst.objects || []).filter((o) => o.properties && o.properties.section && o.properties.section.name === FROM);
if (already.length && !REPLACE) { console.error(INTO + ' already holds ' + already.length + ' objects of the section ' + FROM + ' (at ' + already[0].properties.section.at + ' s) — --replace to take them out and insert again'); process.exit(3); }
const kept = (dst.objects || []).filter((o) => !(o.properties && o.properties.section && o.properties.section.name === FROM));

// the copies: new ids, the times moved, the tag
let nextId = Math.max(+dst.nextId || 1, ...kept.map((o) => +String(o.id).replace(/^[a-z]+-/, '') || 0).map((n) => n + 1));
const idOf = (old) => (String(old).match(/^[a-z]+-/) || ['ob-'])[0] + (nextId++);
const map = new Map(), copies = [];
for (const o of src.objects || []) {
  const c = JSON.parse(JSON.stringify(o));
  map.set(o.id, c.id = idOf(o.id));
  if (c.type === 'waveCurve') { c.startSeconds = r3(c.startSeconds + AT); c.endSeconds = r3(c.endSeconds + AT); }
  else { if (c.startTime != null) c.startTime = r3(c.startTime + AT); if (c.endTime != null) c.endTime = r3(c.endTime + AT); }
  c.properties = Object.assign({}, c.properties || {}, { section: { name: FROM, at: AT } });
  copies.push(c);
}
for (const c of copies) {   // a reference by id inside a copy follows the new ids (none in the three body section; kept for any section)
  for (const k of ['ratioSourceZoneId', 'groupId', 'sourceZoneId']) if (c[k] && map.has(c[k])) c[k] = map.get(c[k]);
  // a sine and its notes know each other by id (properties.sine: a note's brick · a brick's note and notes · a re-keyed chain and its
  // first — sine_go.js, tools/beat_pair.js): the copies must know each other, not objects of the piece that happen to bear the old ids (§286)
  const sn = c.properties && c.properties.sine;
  if (sn) {
    const m = (id) => (map.has(id) ? map.get(id) : id), t = Object.assign({}, sn);
    for (const k of ['brick', 'note']) if (t[k]) t[k] = m(t[k]);
    for (const k of ['notes', 'chain']) if (Array.isArray(t[k])) t[k] = t[k].map(m);
    if (t.segment && t.segment.of) t.segment = Object.assign({}, t.segment, { of: m(t.segment.of) });
    if (t.was && t.was.endSeconds != null) t.was = Object.assign({}, t.was, { endSeconds: r3(+t.was.endSeconds + AT) });   // a time kept in a record moves with its note (§288)
    c.properties.sine = t;
  }
}
const ends = copies.map((c) => (c.type === 'waveCurve' ? c.endSeconds : c.endTime)).filter(Number.isFinite);
const starts = copies.map((c) => (c.type === 'waveCurve' ? c.startSeconds : c.startTime)).filter(Number.isFinite);
const notes = copies.filter((c) => c.type === 'waveCurve').length, zones = copies.filter((c) => c.type === 'zone').length;
const pieceEnd = Math.max(0, ...kept.map((o) => (o.type === 'waveCurve' ? o.endSeconds : o.endTime) || 0));
const meta = src.metadata || {}, sec = meta.threeBody || {};
console.log('INSERT ' + FROM + ' → ' + INTO + ' at ' + AT + ' s: ' + copies.length + ' objects (' + notes + ' notes · ' + zones + ' zones) over ' + Math.min(...starts).toFixed(2) + ' … ' + Math.max(...ends).toFixed(2) + ' s'
  + (sec.seedUsed ? ' · the section\'s roll: seed ' + sec.seedUsed + (sec.fitS ? ' (fit ' + sec.fitS + ')' : '') + ', ' + sec.lengthS + ' s' : '')
  + ' · the piece\'s own ' + kept.length + ' objects end at ' + pieceEnd.toFixed(2) + ' s' + (Math.min(...starts) < pieceEnd ? ' — THE SECTION OVERLAPS THEM' : ' — a gap of ' + (Math.min(...starts) - pieceEnd).toFixed(2) + ' s')
  + (already.length ? ' · the earlier insertion (' + already.length + ' objects at ' + already[0].properties.section.at + ' s) taken out' : ''));
const seen = new Set(); for (const o of kept.concat(copies)) { if (seen.has(o.id)) { console.error('two objects would share the id ' + o.id); process.exit(5); } seen.add(o.id); }
if (DRY) { console.log('(dry — nothing written)'); process.exit(0); }

dst.objects = kept.concat(copies);
dst.nextId = nextId;
const now = new Date().toISOString();
const command = 'node tools/insert_section.js --from ' + FROM + ' --into ' + INTO + ' --at ' + AT + ' --replace';
dst.metadata = Object.assign({}, dst.metadata, { modified: now,
  sections: ((dst.metadata || {}).sections || []).filter((s) => s.name !== FROM).concat([{ name: FROM, at: AT, lengthS: sec.lengthS || r3(Math.max(...ends) - AT), seedAsked: sec.seedAsked, seedUsed: sec.seedUsed, fitS: sec.fitS || 0, objects: copies.length, inserted: now, command }]) });
for (let tries = 0; ; tries++) {   // the score file may be held an instant by the page's autosave or the server's read (deal_variants.js)
  try { fs.writeFileSync(dstFile, JSON.stringify(dst, null, 1) + '\n'); break; }
  catch (e) { if (tries >= 5) throw e; console.log('(the score file is held by another process — again in 300 ms)'); Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300); }
}
console.log(rel(dstFile) + ' written — ' + dst.objects.length + ' objects, nextId ' + nextId + '; recorded in metadata.sections. Reload it in the composer page (File ▾ → Reload). Again, after a re-roll: ' + command);
