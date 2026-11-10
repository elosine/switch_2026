#!/usr/bin/env node
// vol_fix.js — ONE LOUDNESS SCALE ACROSS THE PARTS OF A PASSAGE (his task 2026-11-10, RUNNING_LOG §136: "get a better balanced volume … as long as
// the p's across these are the same and the fff's are the same"). A PLAYED-IN note (sonifyMode `plain`) sounds at the velocity he struck
// (`recVel`) — the same velocity is a different loudness on every instrument. This tool reads each note's WRITTEN dynamic (its height, the
// page's own rule: y = recVel / 127 · 10) and writes the velocity that makes THAT dynamic on THIS instrument by the dynamics law's ladder
// (`TextureDyn.ladderVel` through the measured curves of bank/velocity_remap.json — cello · flute · clarinet · alto sax · violin · piano).
// Nothing else of the note changes: not its height (the notation), not its time, not its technique. The played velocity is kept in
// properties.volFix for the way back (--undo).
//
//   node tools/vol_fix.js --score <name> --from 195 [--to 253] [--lanes flute,clarinet,…] [--undo] [--dry]
//
// An instrument WITHOUT a measured curve (the pitched lane's mallet voices — the glockenspiel here) gets the ladder's ANCHOR velocity
// (65 + 62 · level): the right order of dynamics, not the ensemble's decibels — said in the report. THE SORTING: a piece's tool.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const name = arg('score') || die('--score <name>'), from = +arg('from', 0), to = +arg('to', 1e9);
const file = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(file)) die('no such score');
const only = arg('lanes') ? String(arg('lanes')).split(',') : null;
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
const measured = (k) => !!(REMAP.instruments && REMAP.instruments[k]);
const stats = {};
let n = 0;
for (const o of s.objects) {
    if (o.type !== 'waveCurve' || o.sonifyNote == null || o.startSeconds < from || o.startSeconds > to) continue;
    const t = TRACKS[o.layer]; if (!t || t.elec) continue;
    if (only && !only.includes(t.instKey) && !only.includes(t.id)) continue;
    const st = stats[t.instKey] = stats[t.instKey] || { notes: 0, before: [], after: [], measured: measured(t.instKey), marks: {} };
    if (has('undo')) {
        if (!o.properties || !o.properties.volFix) continue;
        const f = o.properties.volFix; st.before.push(o.velAbs); o.velAbs = f.velAbsBefore; if (o.velAbs == null) delete o.velAbs; st.after.push(o.recVel); delete o.properties.volFix; st.notes++; n++; continue;
    }
    if (o.sonifyMode !== 'plain') continue;   // a shaped note is already the law's
    if (!st.measured && !has('anchor-unmeasured')) { st.skipped = (st.skipped || 0) + 1; continue; }   // no curve: the anchor scale would push a glockenspiel to 127 — left as played unless asked
    const played = o.velAbs != null ? o.velAbs : (o.recVel != null ? o.recVel : Math.round((o.nodes && o.nodes[0] ? o.nodes[0].y : 5) / 10 * 127));
    const y = o.nodes && o.nodes[0] ? o.nodes[0].y : played / 127 * 10;   // the written dynamic: the height
    const level = Math.max(0, Math.min(1, y / 10)), mark = MARKS[Math.max(0, Math.min(7, Math.round(level * 7)))];
    const v = Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, t.instKey, o.sonifyNote, level))));
    o.properties = o.properties || {};
    if (!o.properties.volFix) o.properties.volFix = { recVel: o.recVel, velAbsBefore: o.velAbs != null ? o.velAbs : null, level: Math.round(level * 1000) / 1000, mark, when: '2026-11-10', how: st.measured ? 'the ladder through the measured curve' : 'the anchor velocity (no measured curve)' };
    st.before.push(played); st.after.push(v); st.marks[mark] = (st.marks[mark] || 0) + 1;
    o.velAbs = v; st.notes++; n++;
}
const mean = (a) => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null;
for (const [k, st] of Object.entries(stats)) {
    if (!st.notes) { if (st.skipped) console.log(k.padEnd(12) + st.skipped + ' note(s) LEFT AS PLAYED — no measured curve for this instrument (--anchor-unmeasured would put them on the anchor scale)'); continue; }
    console.log(k.padEnd(12) + st.notes + ' note(s) · velocity ' + mean(st.before) + ' → ' + mean(st.after) + ' (mean) · ' + (st.measured ? 'the measured curve' : 'UNMEASURED — the anchor scale') + (has('undo') ? ' · undone' : ' · marks: ' + Object.entries(st.marks).sort((a, b) => MARKS.indexOf(a[0]) - MARKS.indexOf(b[0])).map(([m, c]) => m + ' ' + c).join(', ')));
}
console.log(n + ' note(s) ' + (has('undo') ? 'restored' : 'put on the ladder') + ' in ' + from + ' … ' + (to > 1e8 ? 'end' : to) + ' s');
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json · File ▾ → Reload in the page');
