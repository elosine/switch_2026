// node tools/port/scratch/cello_ctpt.js   — run from the repo root. THE CELLO'S TAKE BROUGHT THROUGH THE COUNTERPOINT'S STEPS (RUNNING_LOG §414).
// His take is in HIS save `piece-FirstDraft-Final-C-cello` (47 notes, 200.65 … 251.99 s, never touched here). The work is done in a copy,
// `piece-FirstDraft-Final-D-ctptCello`, which becomes the copy the notation reads. Only the cello's lane (7) is changed.
//  1 THE HARMONY — the section's own roll (tools/harmony_roll.js --contrast, 0.5 … 1.5 s, seed 17: the same containers and the same deal the other
//    parts carry) run on a temporary file that holds the cello's notes alone, its pitches then copied in.
//  2 THE TECHNIQUES — tools/artic_deal.js --scatter on the cello's deck (bank/artic_deal.json: the violin's five).
//  3 THE DYNAMICS — tools/dyn_deal.js p · f · fff, notes within 0.2 s sharing one.
//  4 THE LEVELS — each note sent by the VIOLIN's map for the same technique (the same library and presets); NOT measured on the cello.
//  5 BEHIND THE BRIDGE — written on the nearest open string (C2 G2 D3 A3), as the violin's (§397).
const fs = require('fs'), { spawnSync } = require('child_process');
const SRC = 'piece-FirstDraft-Final-C-cello', DST = 'piece-FirstDraft-Final-D-ctptCello', TMP = '_tmp_cello_harm';
const P = n => 'scores/' + n + '.json', rd = n => JSON.parse(fs.readFileSync(P(n), 'utf8')), run = a => { const r = spawnSync('node', a, { encoding: 'utf8' }); const o = (r.stdout + r.stderr).split('\n').filter(l => l.trim()); console.log('   ' + o.slice(-3).join('\n   ').slice(0, 700)); if (r.status) throw new Error('failed: ' + a.join(' ')); };
const inWin = o => o.type === 'waveCurve' && o.sonifyNote != null && o.startSeconds >= 199 && o.startSeconds < 254;
const src = rd(SRC), cello = src.objects.filter(o => inWin(o) && o.layer === 7);
console.log('1 the harmony — ' + cello.length + ' cello notes');
const t = JSON.parse(JSON.stringify(src)); t.objects = JSON.parse(JSON.stringify(cello)); fs.writeFileSync(P(TMP), JSON.stringify(t));
run(['tools/harmony_roll.js', '--score', TMP, '--from', '200', '--to', '253', '--takes', 'SW-ctpt-%02d:1-16', '--contrast', '--min', '0.5', '--max', '1.5', '--long-lo', '1.1', '--short-hi', '0.8', '--seed', '17']);
const hm = new Map(rd(TMP).objects.filter(o => o.type === 'waveCurve').map(o => [o.id, o])); fs.unlinkSync(P(TMP));
const dst = JSON.parse(JSON.stringify(src)); let ch = 0;
for (const o of dst.objects) { if (!inWin(o) || o.layer !== 7) continue; const h = hm.get(o.id); if (!h) throw new Error('no harmony for ' + o.id); if (h.sonifyNote !== o.sonifyNote) ch++; o.sonifyNote = h.sonifyNote; o.properties = Object.assign({}, o.properties, { harmony: h.properties.harmony }); }
fs.writeFileSync(P(DST), JSON.stringify(dst)); console.log('   ' + ch + ' pitches fitted · written: ' + P(DST));
console.log('2 the techniques'); run(['tools/artic_deal.js', '--score', DST, '--from', '199', '--to', '254', '--lanes', 'cello', '--scatter', '--seed', '1124', '--in-place']);
console.log('3 the dynamics'); run(['tools/dyn_deal.js', '--score', DST, '--from', '199', '--to', '254', '--levels', 'p,f,fff', '--seed', '1125', '--lanes', 'cello', '--tie', '0.2', '--out', DST]);
console.log('4 the levels, 5 the open strings');
const j = rd(DST), map = {};
for (const o of j.objects) if (inWin(o) && o.layer === 6 && o.properties && o.properties.parity) (map[o.technique] = map[o.technique] || {})[o.recVel] = [o.velAbs == null ? null : o.velAbs, o.cc7Plain == null ? null : o.cc7Plain];
const OPEN = [36, 43, 50, 57], tally = {}; let miss = 0, moved = 0;
for (const o of j.objects) { if (!inWin(o) || o.layer !== 7) continue; tally[o.technique] = (tally[o.technique] || 0) + 1;
  if (o.technique === 'pizz_behind_bridge_vel') { const n = OPEN.reduce((b, k) => Math.abs(k - o.sonifyNote) < Math.abs(b - o.sonifyNote) ? k : b, OPEN[0]); if (n !== o.sonifyNote) { o.properties.openString = { was: o.sonifyNote, why: '§414: behind the bridge is written on the open string' }; o.sonifyNote = n; moved++; } }
  const m = map[o.technique] && map[o.technique][o.recVel]; if (!m) { miss++; continue; }
  if (m[0] != null) o.velAbs = m[0]; if (m[1] != null) o.cc7Plain = m[1];
  o.properties.parity = { written: o.recVel, velAbs: m[0], cc7: m[1], releveled: '§414: sent by the VIOLIN\'s level map for this technique — not measured on the cello' }; }
fs.writeFileSync(P(DST), JSON.stringify(j));
console.log('   ' + JSON.stringify(tally) + ' · behind the bridge moved to an open string: ' + moved + ' · without a level from the violin: ' + miss);
