#!/usr/bin/env node
// gravity_sort.js — THE FIRST SORTING of the piano solo for the gravity notation (SW-83; the Switch~ piece RUNNING_LOG §271 · §272):
// which of the played notes are FIXED STRUCTURES (his jabs and strikes — "bearing walls") and which belong to a FLOW that runs into a
// point of gravity and out of it (a GC with a long arc), hand by hand. The AI's marking from timing, size and loudness — HIS TO CORRECT.
//
//   node tools/gravity_sort.js [--page s2-piano-solo-played] [--t0 146 --t1 253]      → bank/gravity_sort.json
//
// The rules (each number is in the file's `params`, his to move):
//   · an EVENT = one hand's notes within chordS of each other; a MOMENT = both hands' notes within chordS.
//   · a WALL = a moment that stands ALONE (silence of loneGapS before and after), or is STRONG (mean loudness >= wallMean with
//     >= wallNotes notes), or OPENS after a silence (>= loneGapS before, mean >= openMean, >= 2 notes).
//   · a RUN = one hand's events with less than runGapS between them. Its BOUNCE = its heaviest event (the sum of its notes'
//     loudness). ARC IN = the run's start → the bounce; ARC OUT = the bounce → the run's end. A run of fewer than minRun events has no arc.
// The hand is the page's own (the --pianoHands split: staff 0 = right, 1 = left), read from the IR.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const page = arg('page', 's2-piano-solo-played'), T0 = +arg('t0', 146), T1 = +arg('t1', 253);
const P = { chordS: 0.04, loneGapS: 0.4, wallMean: 104, wallNotes: 3, openMean: 100, runGapS: 0.5, minRun: 3, minArcS: 0.15 };
for (const k of Object.keys(P)) if (arg(k) != null) P[k] = +arg(k);

const ir = JSON.parse(fs.readFileSync(path.join(ROOT, 'notation', 'ir', page + '.ir.json'), 'utf8'));
const staffOf = new Map();
for (const o of ir.overlays || []) if (o.kind === 'engraving' && o.target && o.target.event && o.value && o.value.staff != null) staffOf.set(o.target.event, o.value.staff);
const notes = ir.events.filter(e => e.onset >= T0 && e.onset < T1 && e.pitch && e.pitch.midi != null)
  .map(e => ({ id: e.id.replace(/^ev-/, ''), t: e.onset, midi: e.pitch.midi, vel: e.vel != null ? e.vel : 64, hand: staffOf.get(e.id) === 1 ? 'L' : 'R' }))
  .sort((a, b) => a.t - b.t || a.midi - b.midi);
const r2 = x => +x.toFixed(3);
const group = list => { const g = []; for (const n of list) { const x = g[g.length - 1]; if (x && n.t - x.t1 < P.chordS) { x.notes.push(n); x.t1 = n.t; } else g.push({ t: n.t, t1: n.t, notes: [n] }); }
  for (const x of g) { x.n = x.notes.length; x.sum = x.notes.reduce((s, n) => s + n.vel, 0); x.mean = Math.round(x.sum / x.n); x.max = Math.max(...x.notes.map(n => n.vel)); } return g; };

// the moments (both hands) and the walls
const moments = group(notes);
moments.forEach((m, i) => {
  const before = i ? m.t - moments[i - 1].t1 : 99, after = i < moments.length - 1 ? moments[i + 1].t - m.t1 : 99;
  m.lone = before >= P.loneGapS && after >= P.loneGapS && m.n >= 2;
  m.strong = m.mean >= P.wallMean && m.n >= P.wallNotes;
  m.opener = before >= P.loneGapS && m.mean >= P.openMean && m.n >= 2;
  m.wall = m.lone || m.strong || m.opener;
  m.hands = [...new Set(m.notes.map(n => n.hand))].sort().join('');
});
const walls = moments.filter(m => m.wall).map(m => ({ t: r2(m.t), t1: r2(m.t1), hands: m.hands, n: m.n, mean: m.mean, why: m.lone ? 'alone' : m.opener && !m.strong ? 'opens after a silence' : m.opener ? 'strong, opens after a silence' : 'strong', ids: m.notes.map(n => n.id) }));

// the runs and their arcs, hand by hand
const arcs = [];
for (const hand of ['R', 'L']) {
  const ev = group(notes.filter(n => n.hand === hand));
  let run = [];
  const close = () => {
    if (run.length >= P.minRun) {
      const b = run.reduce((a, x) => (x.sum > a.sum ? x : a)), t0 = run[0].t, t1 = run[run.length - 1].t1;
      arcs.push({ hand, t0: r2(t0), bounce: r2(b.t), t1: r2(t1), in: b.t - t0 >= P.minArcS, out: t1 - b.t >= P.minArcS, events: run.length, notes: run.reduce((s, x) => s + x.n, 0), bounceNotes: b.n, bounceMean: b.mean });
    }
    run = [];
  };
  for (const x of ev) { if (run.length && x.t - run[run.length - 1].t1 >= P.runGapS) close(); run.push(x); }
  close();
}
arcs.sort((a, b) => a.t0 - b.t0);

const out = {
  _doc: 'THE FIRST SORTING for the gravity notation (SW-83; RUNNING_LOG §272) — made by tools/gravity_sort.js from the page ' + page + '; the AI\'s marking by timing, size and loudness, HIS TO CORRECT. walls = the fixed structures; arcs = one flow of one hand: t0 (its first note) → bounce (its heaviest event) → t1 (its last note). hands: R = right (upper staff), L = left (lower staff).',
  page, window: [T0, T1], params: P, made: new Date().toISOString(),
  loudness: moments.map(m => [r2(m.t), m.n, m.mean, m.max]),
  walls, arcs,
};
fs.writeFileSync(path.join(ROOT, 'bank', 'gravity_sort.json'), JSON.stringify(out, null, 1) + '\n');
console.log('bank/gravity_sort.json — ' + notes.length + ' notes · ' + moments.length + ' moments · ' + walls.length + ' walls (' + walls.filter(w => w.why === 'alone').length + ' alone) · ' + arcs.length + ' arcs (R ' + arcs.filter(a => a.hand === 'R').length + ' · L ' + arcs.filter(a => a.hand === 'L').length + ')');
