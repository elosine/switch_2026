#!/usr/bin/env node
// phase_form_render.js — write THE PHASE FORM (bank/phase_form.json) into a save as struck notes, one per hit per player (RUNNING_LOG §214).
// The same arithmetic as the workshop page's plan runner (workshop/phase/index.html: runPlan · planBulge · tickShift): each player's phase
// is integrated in 2 ms steps through holds and glides; a glide's tempo ramp is straight in bpm with a sine bulge sized so the player
// lands on the target's beat (unison: all on one beat; a set: its flam offsets) — his cheat made exact (§185). The form ends with ONE strike
// in unison at the last mark; nothing after.
//
//   node tools/phase_form_render.js --from piece-Section03-G-GrainBaseAlign --to piece-Section03-H-addTuplets [--dry]
//
// What it writes: a waveCurve note per hit on the player's lane (technique · sonifyNote · recVel from phase_form.json's voices; 0.12 s long)
// in the group 'phase-form', a marker per step with its label, into a COPY of the source save (his saves are never edited in place).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const FROM = arg('from') || 'piece-Section03-G-GrainBaseAlign', TO = arg('to') || 'piece-Section03-H-addTuplets';
const FORM = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'phase_form.json'), 'utf8'));

// the sets, read from the page by name (one source)
const page = fs.readFileSync(path.join(ROOT, 'workshop', 'phase', 'index.html'), 'utf8');
const js = page.match(/<script>([\s\S]*)<\/script>/)[1];
const setsSrc = js.match(/const GRID_MS[\s\S]*?\n}\n/)[0];
const ctx = {}; vm.runInNewContext(setsSrc + '\nOUT = { SETS, GRID_MS };', ctx);
const SETS = ctx.OUT.SETS, GRID_MS = ctx.OUT.GRID_MS;
const setByName = (n) => { const s = SETS.find((x) => x.name === n); if (!s) throw new Error('no set ' + n); return s; };
const gridOf = (s) => s.grid || GRID_MS;
const N = FORM.players.length;

// rates in hits per ms
const unisonRates = (bpm) => FORM.players.map(() => bpm / 60000);
const fanRates = (key, bpm, unit) => FORM.rulers[key].map((m) => bpm * (1 + m * unit / 100) / 60000);
const setRates = (s) => s.per.map((p) => 1 / (p * gridOf(s)));

// the segments: rA (and rB, toSet, noAlign for a glide), in ms from the form's start
const T0 = FORM.steps[0].from;
let prevR = null;
const segs = FORM.steps.map((st) => {
  const g = { kind: st.kind, from: (st.from - T0) * 1000, ms: (st.to - st.from) * 1000, label: st.label };
  if (st.kind === 'hold') {
    g.rA = st.fan ? fanRates(st.fan, st.bpm, st.unitPct) : st.set ? setRates(setByName(st.set)) : unisonRates(st.unison);
  } else {
    g.rA = prevR;
    if (st.toSet) { g.toSet = setByName(st.toSet); g.rB = setRates(g.toSet); }
    else if (st.toFan) { g.rB = fanRates(st.toFan, st.bpm, st.unitPct); g.noAlign = true; }
    else g.rB = unisonRates(st.toUnison);
  }
  prevR = g.rB || g.rA;
  return g;
});
const TOTAL = segs.reduce((s, g) => s + g.ms, 0);

// the streams
const streams = FORM.players.map((p) => ({ phase: 1, beat: 1, hits: [] }));   // beat 1 at the start: everyone together on the first hit
const anchor = FORM.players.indexOf('piano');
function planBulge(g, el) {
  const left = g.ms - (el - g.from);
  if (left <= 0 || g.noAlign) { g.bulge = streams.map(() => 0); g.bulgeFrom = el; g.bulgeMs = Math.max(1, left); return; }
  const rNow = streams.map((s, i) => g.rA[i] + (g.rB[i] - g.rA[i]) * ((el - g.from) / g.ms));
  const pred = streams.map((s, i) => s.phase + left * (rNow[i] + g.rB[i]) / 2);
  // a set: its flam offsets; a unison: the BEAT AT THE MARK — every phase a whole number at the glide's end (the nearest one), the piano too
  const target = streams.map((s, i) => g.toSet ? (1 - ((g.toSet.off[i] || 0) * gridOf(g.toSet)) / (g.toSet.per[i] * gridOf(g.toSet))) : Math.round(pred[i]));
  g.bulge = streams.map((s, i) => { let d = (target[i] - pred[i]) % 1; if (d > 0.5) d -= 1; if (d <= -0.5) d += 1; return d * Math.PI / (2 * left); });
  g.bulgeFrom = el; g.bulgeMs = left;
}
function rateAt(g, el, i) {
  if (g.kind !== 'glide') return g.rA[i];
  const u = Math.max(0, Math.min(1, (el - g.from) / g.ms)); let r = g.rA[i] + (g.rB[i] - g.rA[i]) * u;
  if (g.bulge) { const v = (el - g.bulgeFrom) / g.bulgeMs; if (v > 0 && v < 1) r += g.bulge[i] * Math.sin(Math.PI * v); }
  return r;
}
const STEP = 2; let t = 0, si = 0;
while (t < TOTAL + 1) {
  const tn = Math.min(t + STEP, TOTAL + 1);
  while (si < segs.length - 1 && t >= segs[si].from + segs[si].ms) si++;
  const g = segs[si];
  if (g.kind === 'glide' && !g.bulge) planBulge(g, t);
  streams.forEach((s, i) => {
    const r = rateAt(g, t, i), ph = s.phase + r * (tn - t);
    while (ph >= s.beat) { s.hits.push(t + (s.beat - s.phase) / r); s.beat++; }
    s.phase = ph;
  });
  t = tn;
}
// the end: one strike in unison at the last mark, nothing after
const LAST = (FORM.end.lastHitAt - T0) * 1000;
streams.forEach((s) => { s.hits = s.hits.filter((h) => h < LAST - 5); s.hits.push(LAST); });

// into the save
const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', FROM + '.json'), 'utf8'));
let nextId = src.nextId || 1; const objs = [];
const r3 = (x) => Math.round(x * 1000) / 1000;
FORM.players.forEach((p, i) => {
  const v = FORM.voices[p];
  streams[i].hits.forEach((h) => {
    const at = r3(T0 + h / 1000);
    objs.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: v.layer, startSeconds: at, endSeconds: r3(at + FORM.noteSeconds),
      nodes: [{ pos: 0, y: 8.7, smooth: 0.25 }, { pos: 1, y: 8.7, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
      color: '#607D8B', fillMode: 'bottom', opacity: 0.55, groupId: 'phase-form',
      properties: { phaseForm: { player: p, hit: streams[i].hits.indexOf(h) } },
      sonifyNote: v.midi, technique: v.technique, sonifyMode: 'plain', recVel: FORM.velocity });
  });
});
FORM.steps.forEach((st) => {
  objs.push({ id: 'mk-' + (nextId++), type: 'marker', layer: 0, time: st.from, label: 'Φ ' + st.label, color: '#2e9e8e', groupId: 'phase-form',
    performanceNotes: 'the phase form (bank/phase_form.json): ' + st.label + ' · ' + st.from + ' → ' + st.to, properties: { phaseForm: true } });
});
objs.push({ id: 'mk-' + (nextId++), type: 'marker', layer: 0, time: FORM.end.lastHitAt, label: 'Φ the last hit · unison 120', color: '#ffd166', groupId: 'phase-form', performanceNotes: FORM.end.note, properties: { phaseForm: true } });

const perLane = {}; objs.filter((o) => o.type === 'waveCurve').forEach((o) => { perLane[o.layer] = (perLane[o.layer] || 0) + 1; });
console.log('hits per player:', FORM.players.map((p, i) => p + ' ' + streams[i].hits.length).join(' · '));
console.log('first hits (s):', FORM.players.map((p, i) => r3(T0 + streams[i].hits[0] / 1000)).join(' '), '· last hits (s):', FORM.players.map((p, i) => r3(T0 + streams[i].hits[streams[i].hits.length - 1] / 1000)).join(' '));
const at341 = FORM.players.map((p, i) => { const h = streams[i].hits.map((x) => T0 + x / 1000).filter((x) => Math.abs(x - 341.08) < 0.05); return h.length ? r3(h[0]) : '—'; });
console.log('the hit nearest 341.08 per player:', at341.join(' '));
console.log('markers:', objs.filter((o) => o.type === 'marker').length, '· notes:', objs.filter((o) => o.type === 'waveCurve').length);
if (has('dry')) { console.log('dry — nothing written'); process.exit(0); }
src.objects = src.objects.concat(objs); src.nextId = nextId;
const out = path.join(ROOT, 'scores', TO + '.json');
if (fs.existsSync(out)) { console.error('refusing: ' + out + ' exists'); process.exit(2); }
fs.writeFileSync(out, JSON.stringify(src));
console.log('written: scores/' + TO + '.json  (from ' + FROM + ', untouched)');
