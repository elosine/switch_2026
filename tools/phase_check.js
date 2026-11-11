#!/usr/bin/env node
// tools/phase_check.js — the phase engine's numbers asserted without a browser (SW-42; RUNNING_LOG §165).
//   node tools/phase_check.js
'use strict';
const path = require('path');
const PE = require(path.join(__dirname, '..', 'score', 'public', 'phase_engine.js'));
let fails = 0; const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fails++; };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-3);
const streams = [0, 1, 2, 3].map((lane, i) => ({ i, lane, durMs: 120 }));

console.log('1. a hold at 60 for 10 s: 10 attacks a stream, every second, together');
let R = PE.run({ bpm: 60, segments: [{ kind: 'hold', seconds: 10 }] }, streams);
ok(R.events.length === 40, '40 events'); ok(R.events.filter((e) => e.stream === 0).every((e, k) => near(e.t, k + 1)), 'stream 1 at 1, 2, … 10 s');
ok(near(R.final.phases[0], 10), 'phase 10 beats'); ok(R.events[0].durS === 0.12, 'the articulation\'s own length');

console.log('2. neighbors: a shift to tempi 60 · 61.2 · 62.4 · 63.6 over 30 s, no phase target → plain ramps');
R = PE.run({ bpm: 60, segments: [{ kind: 'shift', seconds: 30, target: { kind: 'tempi:neighbors', amount: 2 } }] }, streams);
ok(R.segments[0].to.join() === '60,61.2,62.4,63.6', 'the target tempi ' + R.segments[0].to.join(' '));
ok(R.segments[0].k.every((k) => k === 0), 'no bulge'); ok(near(R.final.phases[3], 30 / 60 * (60 + 63.6) / 2), 'stream 4 travelled (60+63.6)/2 beats a minute');
ok(near(R.final.tempi[3], 63.6), 'arrives at 63.6');

console.log('3. converge: from those tempi back to unison, ALIGNED, over 20 s — every stream ends on an integer beat');
R = PE.run({ bpm: 60, segments: [{ kind: 'shift', seconds: 30, target: { kind: 'tempi:neighbors', amount: 2 } }, { kind: 'shift', seconds: 20, target: { kind: 'unison' } }] }, streams);
ok(R.final.phases.every((p) => near(PE.frac(p), 0, 1e-4) || near(PE.frac(p), 1, 1e-4)), 'phases ' + R.final.phases.map((p) => PE.frac(p).toFixed(4)).join(' '));
ok(R.final.tempi.every((t) => near(t, 60)), 'all at 60'); ok(!R.segments[1].warn.length, 'no warning: ' + R.segments[1].k.join(' '));
const last = R.events.filter((e) => e.t > 49.9); ok(last.length === 4 && last.every((e) => near(e.t, 50, 0.01)), 'the four streams attack together at 50 s');

console.log('4. a phase fan reached by a shift: offsets 0 · ¼ · ½ · ¾ at the end, tempo 60');
R = PE.run({ bpm: 60, segments: [{ kind: 'shift', seconds: 24, target: { kind: 'phase:fan' } }] }, streams);
ok(R.final.phases.map((p) => PE.frac(p).toFixed(3)).join() === '0.000,0.250,0.500,0.750' || R.final.phases.map((p) => (PE.frac(p) + 1e-9).toFixed(3)).join() === '0.000,0.250,0.500,0.750', 'fractions ' + R.final.phases.map((p) => PE.frac(p).toFixed(3)).join(' '));
ok(R.final.tempi.every((t) => near(t, 60)), 'back at 60 — the bulge did it: k ' + R.segments[0].k.join(' '));

console.log('5. a phase target too far for the time: refused with a warning, ramp kept');
R = PE.run({ bpm: 60, segments: [{ kind: 'shift', seconds: 0.5, target: { kind: 'phase:fan' } }] }, streams);
ok(R.segments[0].warn.length > 0, 'warned: ' + (R.segments[0].warn[0] || ''));

console.log('6. a cut to ratios 3:4:5 then a hold of 12 s: stream 2 at 80, stream 3 at 100; the cycle realigns at 3 s');
R = PE.run({ bpm: 60, segments: [{ kind: 'cut', target: { kind: 'tempi:ratios', ratios: '3:4:5' } }, { kind: 'hold', seconds: 12 }] }, streams);
ok(R.segments[0].to.join() === '60,80,100,60', 'tempi ' + R.segments[0].to.join(' ')); ok(R.events.filter((e) => e.stream === 1).length === 16, 'stream 2: 16 attacks in 12 s');
ok(R.events.filter((e) => near(e.t, 3, 1e-6)).length === 4, 'all four streams meet at 3 s (60 · 80 · 100 · 60 realign every 3 s)');

console.log('7. the LOCK: 10 s into a 30 s neighbors shift — the rest held at 60 with the lags kept; the capture names them');
const plan = { bpm: 60, segments: [{ kind: 'shift', seconds: 30, target: { kind: 'tempi:neighbors', amount: 2 } }, { kind: 'hold', seconds: 10 }] };
const L = PE.lockAt(plan, streams, 10);
ok(L.plan.segments.length === 4, 'segments: ' + L.plan.segments.map((s) => s.kind + ' ' + s.seconds).join(' · '));
const R2 = PE.run(L.plan, streams);
const before = PE.run(plan, streams);
ok(R2.events.filter((e) => e.t <= 10).length === before.events.filter((e) => e.t <= 10).length, 'the first 10 s unchanged');
ok(R2.events.filter((e) => e.t > 10.5 && e.t < 30).every((e) => near(e.tempo, 60)), 'after the lock every stream runs at 60');
ok(near(R2.end, 40), 'the plan still ends at 40 s'); ok(L.capture.offsets.length === 4 && L.capture.offsets[0] === 0, 'captured offsets ' + L.capture.offsets.join(' '));
const S = PE.stateAt(plan, streams, 10); ok(near(S.tempi[3], 60 + 3.6 / 3), 'stream 4 at 10 s: ' + S.tempi[3]);

console.log('8. a cycle strategy: every tempo a multiple of 5 (a 12 s cycle)');
const st = PE.resolve({ kind: 'tempi:cycle', cycle: 12, amount: 10, seed: 3 }, 7, 60);
ok(st.tempi.every((t) => near(t % 5, 0) || near(t % 5, 5)), 'tempi ' + st.tempi.join(' '));

console.log(fails ? '\n' + fails + ' FAILED' : '\nall green');
process.exit(fails ? 1 : 0);
