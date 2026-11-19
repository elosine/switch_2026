#!/usr/bin/env node
// tuplet_render.js — write THE TUPLET CHUNKS (bank/tuplet_chunks.json) into a composer save: the phase form's single strikes of the source
// save are replaced by the strikes the tuplet workshop plays (workshop/tuplets/tuplets.js — the ONE copy of the draw), everything else of the
// save (the electronics bricks, the other sections) carried as it is. SW-50, 2026-11-18: his word — hear the tuplets WITH the electronics.
//
//   node tools/tuplet_render.js [--from piece-Section03-H-addTuplets] [--to piece-Section03-X-tuplets]
//
// The source save is never written. The target is an EXPERIMENTAL save this tool owns: it is overwritten on every run (it carries
// metadata.tupletRender); a file of that name NOT made by this tool is refused. Each note keeps the source note's lane, pitch, technique
// and velocity; properties.phaseForm gains { step, k, band } so a tuplet's notes can be found again.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const T = require(path.join(ROOT, 'workshop', 'tuplets', 'tuplets.js'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const FROM = arg('from', 'piece-Section03-H-addTuplets'), TO = arg('to', 'piece-Section03-X-tuplets');
const form = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'phase_form.json'), 'utf8'));
const db = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'tuplet_chunks.json'), 'utf8'));
const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', FROM + '.json'), 'utf8'));
const out = path.join(ROOT, 'scores', TO + '.json');
if (fs.existsSync(out)) { let m = null; try { m = JSON.parse(fs.readFileSync(out, 'utf8')).metadata; } catch (e) {} if (!m || !m.tupletRender) { console.error('refusing: scores/' + TO + '.json exists and was not made by this tool'); process.exit(2); } }

const isHit = (o) => o.type === 'waveCurve' && o.properties && o.properties.phaseForm && form.players.indexOf(o.properties.phaseForm.player) >= 0;
const by = {}, tmpl = {}; form.players.forEach((p) => { by[p] = []; });
for (const o of src.objects) if (isHit(o)) by[o.properties.phaseForm.player].push(o);
form.players.forEach((p) => { by[p].sort((a, b) => a.startSeconds - b.startSeconds); tmpl[p] = by[p]; });
const hits = {}; form.players.forEach((p) => { hits[p] = by[p].map((o) => o.startSeconds); });
const per = T.build(hits, form.players, db);
// THE HARMONIES AND THE ARTICULATION SET (SW-51): the takes and the routes as the workshop's server gives them (one copy of each rule)
const I = new Function(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + ';return INSTRUMENTS')();
const KEY = { flute: 'flute', clarinet: 'clarinet', alto_sax: 'alto_sax', glockenspiel: 'bowed_vibraphone', piano: 'piano', violin: 'violin', cello: 'cello' }, routes = {};
for (const p of form.players) { const inst = I[KEY[p]], tech = {}; for (const q of inst.techniques) tech[q.key] = { lo: q.rangeLow != null ? q.rangeLow : inst.rangeLow, hi: q.rangeHigh != null ? q.rangeHigh : inst.rangeHigh }; routes[p] = { lane: form.voices[p].layer, home: form.voices[p].technique, homeKey: form.voices[p].midi, tech }; }
const snaps = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels.strikes || {}, takes = {};
for (const name of Object.keys(snaps)) { const lanes = {}; for (const v of ((snaps[name].state || {}).voices || [])) { if (v.skip || v.pitch == null) continue; for (const l of [v.lane].concat(v.also || [])) if (l != null && l >= 0) (lanes[l] = lanes[l] || []).push(v.pitch); } takes[name] = { lanes }; }
const set = (db.sets || T.SETS)[db.artic] || T.SETS.staccato;

const r3 = (x) => Math.round(x * 1000) / 1000;
let nextId = src.nextId || 1; const notes = []; let fastest = 0;
form.players.forEach((p) => {
  const ev = per[p]; let prevK = null, prevL = null;
  ev.forEach((e, i) => {
    const o = JSON.parse(JSON.stringify(tmpl[p][e.src])), gap = i + 1 < ev.length ? ev[i + 1].t - e.t : 0.3;
    if (i) fastest = Math.max(fastest, 1 / (e.t - ev[i - 1].t));
    o.id = 'wc-' + (nextId++); o.startSeconds = r3(e.t); o.endSeconds = r3(e.t + Math.max(0.03, Math.min(form.noteSeconds || 0.12, gap * 0.6)));
    o.properties.phaseForm = Object.assign({}, o.properties.phaseForm, { step: e.step, k: e.k || 0, band: e.plain ? null : (e.band || null) });
    if (set[p] && routes[p].tech[set[p]]) o.technique = set[p];
    if (db.dynamics && db.dynamics.points) { const lv = T.levelFor(db, p, e.t, prevL); prevL = lv; o.recVel = T.velOf(lv, 'save'); o.properties.phaseForm.level = Math.round(lv * 100) / 100; }   // SW-66: the dynamic of its moment (mf 100 … fff 127; p 83)
    const keys = T.keysAt(db, takes, routes, set, p, e.t, prevK); prevK = keys;
    keys.forEach((k, j) => { const n = j ? JSON.parse(JSON.stringify(o)) : o; if (j) n.id = 'wc-' + (nextId++); n.sonifyNote = k; notes.push(n); });
  });
});
const kept = src.objects.filter((o) => !isHit(o));
// the written dynamics as markers (for his eye in the composer score and for the notation's cut later): one per mark of db.dynamics.marks
for (const m of ((db.dynamics && db.dynamics.marks) || [])) notes.push({ id: 'mk-' + (nextId++), type: 'marker', layer: 0, time: m.t, label: 'dyn ' + m.text, color: '#ffffff', groupId: 'phase-dynamics', performanceNotes: 'the players\' dynamic (bank/tuplet_chunks.json → dynamics): ' + m.text + ' at ' + m.t + (m.why ? ' — ' + m.why : ''), properties: { dynamic: m } });
const save = Object.assign({}, src, { objects: kept.concat(notes), nextId });
save.metadata = Object.assign({}, src.metadata, { modified: new Date().toISOString(), tupletRender: { from: FROM, chunks: db.chunks.length, at: new Date().toISOString(), note: 'EXPERIMENTAL — made by tools/tuplet_render.js from bank/tuplet_chunks.json; overwritten on every run' } });
fs.writeFileSync(out, JSON.stringify(save));
const single = form.players.reduce((n, p) => n + hits[p].length, 0);
console.log('scores/' + TO + '.json  ← ' + FROM + ' (untouched) · ' + db.chunks.length + ' chunks · ' + (db.harmonies || []).length + ' harmonies · the set "' + (db.artic || 'staccato') + '" · ' + single + ' single strikes → ' + notes.length + ' notes · fastest ' + fastest.toFixed(2) + ' a second · ' + kept.length + ' other objects carried');
