// phase_engine.js — THE PHASE MACHINE'S ENGINE, pure (the Switch~ piece, SW-42, 2026-11-11; RUNNING_LOG §165). Loads in the browser
// (window.PhaseEngine) and in node (module.exports) from the same file, as multitempo.js does; tools/phase_check.js asserts the numbers.
//
// WHAT THIS IS. N pulse STREAMS (one per player lane), each re-articulating one note (or chord) of a strikes-drawer take. Each stream has a
// TEMPO T (BPM) and a PHASE P (beats elapsed, real); it attacks whenever P crosses an integer. The ensemble moves through a PLAN of SEGMENTS:
//
//   hold   D s      every tempo constant; the phases run on                      (a state held — unison, a phase pattern, a multi-tempo)
//   shift  D s      every stream glides from its tempo to the target's over D s, and — when the target names PHASES — arrives with exactly
//                   that phase pattern: the glide is a straight ramp T0 → T1 plus a parabolic BULGE k·u(1−u) whose size is solved so the
//                   beats travelled land on the wanted fraction (the nearest achievable count); no phase target → k = 0, a plain ramp
//   cut             an instant jump to the target's tempi (and phases, if named) — the quick cross-cut
//
// A TARGET is a STATE: { tempi: [BPM per stream], offsets: [0 … 1 per stream] | null } — made by a STRATEGY (his "shuffle"; a seed re-rolls):
//   unison          every tempo = bpm; offsets all 0 (aligned) — or offsets kept (align: false): "converge at the same tempo"
//   phase:fan       tempo bpm, offsets i / N (a fan of equal lags)      phase:random   seeded fractions      phase:pairs   0 · ½ alternating
//   phase:canon     offsets i · δ (δ = amount, a fraction of a beat)
//   tempi:neighbors each a step above its neighbor: bpm · (1 + amount% · i) — his first idea ("everyone accelerates at a pace slightly
//                   greater than its neighbor"); stream 0 stays
//   tempi:ratios    'r1:r2:…' → bpm · r_i / r_1, cycled over the streams (the multitempo rig's small-integer sets: a REPEATING pattern)
//   tempi:spread    evenly from −amount% to +amount%          tempi:random   seeded within ± amount%
//   tempi:cycle     seeded within ± amount%, then SNAPPED so every tempo is a multiple of 60 / C (C = cycle seconds): the whole pattern
//                   repeats every C seconds ("ones that repeat on a 12-second cycle")
//   state           a saved favorite, by name (the panel resolves it)
//
//   resolve(target, N, bpm, favorites) → { tempi, offsets }
//   run(plan, streams)                 → { events: [{ t, stream, n, durS }], segments: [{ i, kind, t0, t1, from, to, k, warn }], end }
//   lockAt(plan, streams, tSec)        → a NEW plan: the segment under tSec cut at tSec, the rest of it a HOLD at the reference tempo with the
//                                        phases as they stand (his LOCK), the later segments untouched; and the captured state
//   stateAt(plan, streams, tSec)       → { tempi, phases, offsets } at that moment (the CAPTURE)
//
// The attacks of a segment are found by crossing: P(u) is analytic — P0 + D/60 · (T0 u + ΔT u²/2 + k (u²/2 − u³/3)) — and strictly
// increasing while T stays positive, so each integer n in (P(0), P(1)] has one u, found by bisection to 1e-7. A bulge that would drive a
// tempo under 20 % of its ramp is refused as a phase target that D seconds cannot reach — the segment reports `warn` and runs with k = 0.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.PhaseEngine = factory();
}(typeof self !== 'undefined' ? self : this, function () {
'use strict';
const r3 = (x) => Math.round(x * 1000) / 1000, r4 = (x) => Math.round(x * 10000) / 10000;
const frac = (x) => x - Math.floor(x);
const mulberry32 = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const STRATEGIES = ['unison', 'phase:fan', 'phase:random', 'phase:pairs', 'phase:canon', 'tempi:neighbors', 'tempi:ratios', 'tempi:spread', 'tempi:random', 'tempi:cycle', 'state'];
const KINDS = ['hold', 'shift', 'cut'];

// ---- a target → a state
function resolve(target, N, bpm, favorites) {
    const t = target || { kind: 'unison' }, kind = t.kind || 'unison', amt = +t.amount, seed = (+t.seed || 1) | 0;
    const rnd = mulberry32(seed * 2654435761 + 11);
    const same = () => Array.from({ length: N }, () => bpm);
    let tempi = same(), offsets = null, note = '';
    switch (kind) {
        case 'unison': offsets = t.align === false ? null : Array.from({ length: N }, () => 0); note = t.align === false ? 'one tempo, the phases as they fall' : 'one tempo, aligned'; break;
        case 'phase:fan': offsets = Array.from({ length: N }, (_, i) => r4(i / N)); note = 'a fan: lags of 1/' + N + ' beat'; break;
        case 'phase:random': offsets = Array.from({ length: N }, (_, i) => i === 0 ? 0 : r4(rnd())); note = 'random lags, seed ' + seed; break;
        case 'phase:pairs': offsets = Array.from({ length: N }, (_, i) => (i % 2) * 0.5); note = 'two groups, half a beat apart'; break;
        case 'phase:canon': { const d = isFinite(amt) && amt > 0 ? amt : 0.25; offsets = Array.from({ length: N }, (_, i) => r4(frac(i * d))); note = 'a canon: each ' + d + ' beat behind the last'; break; }
        case 'tempi:neighbors': { const pct = isFinite(amt) ? amt : 2; tempi = Array.from({ length: N }, (_, i) => r3(bpm * (1 + pct / 100 * i))); note = 'each ' + pct + '% above its neighbor, the first stays'; break; }
        case 'tempi:ratios': {
            const terms = String(t.ratios || t.amount || '3:4:5').split(':').map((x) => parseInt(x, 10)).filter((x) => x > 0);
            const r1 = terms[0] || 1; tempi = Array.from({ length: N }, (_, i) => r3(bpm * (terms[i % terms.length] || r1) / r1)); note = 'ratios ' + terms.join(':') + ' against ' + bpm; break;
        }
        case 'tempi:spread': { const pct = isFinite(amt) ? amt : 5; tempi = Array.from({ length: N }, (_, i) => r3(bpm * (1 + (N > 1 ? (-pct + 2 * pct * i / (N - 1)) : 0) / 100))); note = 'spread evenly ±' + pct + '%'; break; }
        case 'tempi:random': { const pct = isFinite(amt) ? amt : 5; tempi = Array.from({ length: N }, () => r3(bpm * (1 + pct / 100 * (2 * rnd() - 1)))); note = 'random within ±' + pct + '%, seed ' + seed; break; }
        case 'tempi:cycle': {
            const C = isFinite(+t.cycle) && +t.cycle > 0 ? +t.cycle : 12, pct = isFinite(amt) ? amt : 8, q = 60 / C;   // every tempo a multiple of q BPM → every stream realigns at C seconds
            tempi = Array.from({ length: N }, () => { const raw = bpm * (1 + pct / 100 * (2 * rnd() - 1)); return r3(Math.max(q, Math.round(raw / q) * q)); });
            note = 'repeats every ' + C + ' s (tempi in steps of ' + r3(q) + '), seed ' + seed; break;
        }
        case 'state': {
            const f = favorites && favorites[t.name];
            if (!f) { note = 'no favorite named "' + t.name + '"'; break; }
            const fb = +f.bpm || bpm;
            if (Array.isArray(f.tempi)) tempi = Array.from({ length: N }, (_, i) => r3(+f.tempi[i % f.tempi.length] || fb));
            else tempi = Array.from({ length: N }, () => fb);
            if (Array.isArray(f.offsets)) offsets = Array.from({ length: N }, (_, i) => r4(frac(+f.offsets[i % f.offsets.length] || 0)));
            note = 'favorite "' + t.name + '"' + (f.note ? ' — ' + f.note : ''); break;
        }
        default: note = 'unknown strategy ' + kind;
    }
    return { tempi, offsets, note, kind };
}

// ---- one stream through one segment: the tempo profile and the phase
// T(u) = T0 + dT u + k u (1 − u);  P(u) = P0 + D/60 · (T0 u + dT u²/2 + k (u²/2 − u³/3))
function profile(T0, T1, P0, D, wantFrac) {
    const dT = T1 - T0, Bnat = D / 60 * (T0 + T1) / 2;
    let k = 0, B = Bnat, warn = '';
    if (wantFrac != null) {
        // the count of beats whose end-fraction is wantFrac, nearest the natural count
        // the bulge's extreme sits at u = ½: T(½) = (T0 + T1) / 2 + k / 4 — a candidate is REFUSED when it would push the tempo under half
        // or over one and a half times the ramp's mean (a glide, not a lurch); the nearest acceptable count wins, none → a warning, k = 0
        const base = Math.floor(P0 + Bnat) - 1, mean = (T0 + T1) / 2, cands = [];
        for (let n = base - 1; n <= base + 3; n++) { const cand = n + wantFrac - P0; if (cand > 0) cands.push(cand); }
        cands.sort((a, b) => Math.abs(a - Bnat) - Math.abs(b - Bnat));
        let took = false;
        for (const cand of cands) {
            const kk = 6 * (60 * cand / D - mean), tMid = mean + kk / 4;
            if (tMid >= 0.5 * mean && tMid <= 1.5 * mean) { B = cand; k = kk; took = true; break; }
        }
        if (!took) { warn = 'the phase target needs more than ' + r3(D) + ' s at this tempo'; k = 0; B = Bnat; }
    }
    const P = (u) => P0 + D / 60 * (T0 * u + dT * u * u / 2 + k * (u * u / 2 - u * u * u / 3));
    const T = (u) => T0 + dT * u + k * u * (1 - u);
    return { P, T, k, B, warn, P1: P(1), T1 };
}
function crossings(pf, D, t0) {   // every integer n in (P(0), P(1)] → its time, by bisection on u
    const out = [], a = pf.P(0), b = pf.P(1);
    for (let n = Math.floor(a) + 1; n <= Math.floor(b); n++) {
        let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (pf.P(m) < n) lo = m; else hi = m; }
        const u = (lo + hi) / 2; out.push({ t: t0 + u * D, n, T: pf.T(u) });
    }
    return out;
}

// ---- the plan, run: events for every stream
//   plan    { bpm, noteBeats (null → the stream's own durMs), segments: [{ kind, seconds, target, take? }], favorites? }
//   streams [{ i, lane, durMs }] — one per stream (the take's lanes); `durMs` the articulation's own length
//   from    an initial state { tempi, phases } (default: unison at bpm, phases 0)
function run(plan, streams, from) {
    const N = streams.length, bpm = +plan.bpm || 60, favorites = plan.favorites || {};
    let tempi = (from && from.tempi) ? from.tempi.slice() : Array.from({ length: N }, () => bpm);
    let phases = (from && from.phases) ? from.phases.slice() : Array.from({ length: N }, () => 0);
    const events = [], segs = []; let t = 0;
    (plan.segments || []).forEach((sg, si) => {
        const kind = KINDS.indexOf(sg.kind) >= 0 ? sg.kind : 'hold', D = Math.max(0, +sg.seconds || 0);
        const st = (kind === 'hold') ? null : resolve(sg.target, N, bpm, favorites);
        const rec = { i: si, kind, t0: r3(t), t1: r3(t + D), from: tempi.slice(), to: st ? st.tempi.slice() : tempi.slice(), offsets: st ? st.offsets : null, k: [], warn: [], note: st ? st.note : 'held', take: sg.take || null };
        if (kind === 'cut') {
            tempi = st.tempi.slice();
            if (st.offsets) phases = phases.map((p, i) => Math.floor(p) + st.offsets[i]);
            // a cut has no duration of its own: it sets the state the NEXT segment runs from (a cut followed by a hold is the usual shape)
            rec.t1 = rec.t0; segs.push(rec); return;
        }
        for (let i = 0; i < N; i++) {
            const T1 = st ? st.tempi[i] : tempi[i], want = (st && st.offsets) ? st.offsets[i] : null;
            const pf = D > 0 ? profile(tempi[i], T1, phases[i], D, want) : { P: () => phases[i], T: () => tempi[i], k: 0, warn: '', P1: phases[i], T1 };
            rec.k.push(r3(pf.k)); if (pf.warn) rec.warn.push('stream ' + (i + 1) + ': ' + pf.warn);
            if (D > 0) crossings(pf, D, t).forEach((c) => {
                const durS = plan.noteBeats ? plan.noteBeats * 60 / c.T : (streams[i].durMs || 100) / 1000;
                events.push({ t: r4(c.t), stream: i, lane: streams[i].lane, n: c.n, durS: r4(Math.max(0.03, durS)), tempo: r3(c.T), seg: si });
            });
            phases[i] = pf.P1; tempi[i] = pf.T1;
        }
        t += D; segs.push(rec);
    });
    events.sort((a, b) => a.t - b.t || a.stream - b.stream);
    return { events, segments: segs, end: r3(t), final: { tempi: tempi.slice(), phases: phases.slice() } };
}

// ---- the state at a moment (the CAPTURE): the tempi, the phases, and the offsets relative to stream 1
function stateAt(plan, streams, tSec, from) {
    const N = streams.length, bpm = +plan.bpm || 60, favorites = plan.favorites || {};
    let tempi = (from && from.tempi) ? from.tempi.slice() : Array.from({ length: N }, () => bpm);
    let phases = (from && from.phases) ? from.phases.slice() : Array.from({ length: N }, () => 0);
    let t = 0, segIndex = -1, segU = 0;
    for (const [si, sg] of (plan.segments || []).entries()) {
        const kind = KINDS.indexOf(sg.kind) >= 0 ? sg.kind : 'hold', D = Math.max(0, +sg.seconds || 0);
        const st = (kind === 'hold') ? null : resolve(sg.target, N, bpm, favorites);
        if (kind === 'cut') { tempi = st.tempi.slice(); if (st.offsets) phases = phases.map((p, i) => Math.floor(p) + st.offsets[i]); continue; }
        if (tSec <= t + D || si === plan.segments.length - 1) {
            const u = D > 0 ? Math.max(0, Math.min(1, (tSec - t) / D)) : 1;
            const out = { tempi: [], phases: [] };
            for (let i = 0; i < N; i++) {
                const T1 = st ? st.tempi[i] : tempi[i], want = (st && st.offsets) ? st.offsets[i] : null;
                const pf = D > 0 ? profile(tempi[i], T1, phases[i], D, want) : { P: () => phases[i], T: () => tempi[i] };
                out.tempi.push(r3(pf.T(u))); out.phases.push(pf.P(u));
            }
            segIndex = si; segU = u;
            const ref = out.phases[0] || 0;
            out.offsets = out.phases.map((p) => r4(frac(p - ref)));
            out.segment = segIndex; out.u = r4(segU); out.t = r3(tSec);
            return out;
        }
        for (let i = 0; i < N; i++) {
            const T1 = st ? st.tempi[i] : tempi[i], want = (st && st.offsets) ? st.offsets[i] : null;
            const pf = D > 0 ? profile(tempi[i], T1, phases[i], D, want) : { P1: phases[i], T1 };
            phases[i] = pf.P1; tempi[i] = pf.T1;
        }
        t += D;
    }
    const ref = phases[0] || 0;
    return { tempi: tempi.map(r3), phases, offsets: phases.map((p) => r4(frac(p - ref))), segment: segIndex, u: 1, t: r3(tSec) };
}

// ---- his LOCK: the plan cut at tSec — the segment under it ends there, a HOLD at the reference tempo takes the rest of its time with the
// phases as they stand (every stream snaps to `bpm`, keeping its lag), the later segments follow unchanged. Returns the new plan and the
// state captured (a phase favorite's shape: bpm · offsets).
function lockAt(plan, streams, tSec, from) {
    const S = stateAt(plan, streams, tSec, from), segs = plan.segments || [], si = S.segment;
    if (si < 0) return { plan, state: S };
    const sg = segs[si], D = Math.max(0, +sg.seconds || 0), t0 = segs.slice(0, si).reduce((s, x) => s + (x.kind === 'cut' ? 0 : Math.max(0, +x.seconds || 0)), 0);
    const done = Math.max(0, Math.min(D, tSec - t0)), rest = Math.max(0, D - done);
    const head = Object.assign({}, sg, { seconds: r3(done), target: sg.kind === 'hold' ? sg.target : { kind: 'state', name: '__lock_from__' }, locked: true });
    // the glide so far is reproduced exactly by a shift to the state reached (tempi AND phases), then held at the reference tempo
    const favorites = Object.assign({}, plan.favorites || {}, { __lock_from__: { bpm: +plan.bpm || 60, tempi: S.tempi, offsets: S.phases.map((p) => r4(frac(p))) } });
    const hold = { kind: 'cut', seconds: 0, target: { kind: 'unison', align: false }, locked: true };
    const tail = { kind: 'hold', seconds: r3(rest), locked: true, note: 'LOCKED at ' + r3(tSec) + ' s' };
    const out = Object.assign({}, plan, { favorites, segments: segs.slice(0, si).concat(sg.kind === 'hold' ? [head] : [head, hold], [tail], segs.slice(si + 1)) });
    const capture = { kind: 'phase', bpm: +plan.bpm || 60, offsets: S.offsets, tempi: S.tempi, at: r3(tSec), note: 'captured at ' + r3(tSec) + ' s' };
    return { plan: out, state: S, capture };
}

return { resolve, run, stateAt, lockAt, profile, crossings, STRATEGIES, KINDS, frac };
}));
