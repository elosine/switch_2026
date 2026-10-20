// three_body_sim.js — THE THREE BODY PROBLEM: THE SIMULATED PLAYERS (PLAN.md 1.6 · 14.5; docs/THREE_BODY.md § 2 · § 5; DEC-36c;
// RUNNING_LOG §190). His instruction, the four states, as rules a simulated player follows:
//   FAR APART          *"keep your own pace. Play and ignore other activity or play as if you're playing solo."*
//   APPROACHING        *"Choose a player or a type of sound. And when you hear then play, wait a beat, and then play, then repeat,
//                      listen, hear, play"*
//   CLOSE PASS         *"Choose a player or several players in a cluster and try to play just before or just after their onsets …
//                      as close as you can to the players without playing at the same time."*
//   BREAK AND REJOIN   *"Break. Then after a silence. Try to join the texture just after a cluster has broken up."*
//
// A PURE module (sine_sim.js's pattern): no DOM, no MIDI, no score. It is handed the players with their rolled containers
// (three_body_roll.js — each with its target) and the piece's rules (bank/three_body.json `rules`), and runs them TOGETHER, in
// time order, every `stepMs`: what one plays the others hear. It gives back the ONSETS — who, when, in which state, and WHY.
//
//   ThreeBodySim.run({ players, rules, seed, stepMs }) -> { onsets: [{ t, player, state, rule, role, gen, ref, hit?, errMs? }], counts }
//
// THE RULES (the engine's computer players follow the same ones, live — electronics/sc/performer.scd):
//   pace         far apart: a gap drawn once per far container (gapMs), kept within ± jitter — a clock. It hears nothing.
//   beat         approaching: on the target's onset, wait a beat (beatMs), then one sound; never within holdMs of its own last.
//   after        close pass: beatless — tightMs after the onset.
//   bet          close pass, beforeShare of the time: the target's NEXT onset is predicted from its last two, and the sound is
//                played betMs BEFORE the prediction. A prediction more than missMs wrong is a MISS — an air shot (`hit` false).
//                The guess is the metaphor's: a far-apart player is a clock and can be anticipated; a close pass cannot.
//   unprompted   a listener who has heard nothing to answer for waitMs plays one sound on their own (so silence never locks).
//   rejoin       break and rejoin: silence for the rolled time; then, once `count` onsets of two players or more have fallen inside windowMs (a cluster)
//                and nothing follows for breakGapMs (it broke), one sound within enterMs, and its own pace from there. With no
//                cluster it enters at the last third of the container (`rejoin-alone`).
//   A CHANGE     is its own container: each decision in it is a coin weighted by how far through it the player is — the state
//                before at its start, the state after at its end.
//   depth        an answer to an answer to an answer … stops: a sound of generation `depth` is not answered (gen 0 = unprompted,
//                pace, rejoin). Without it two close-passing players would answer each other for ever.
//   guardMs      never WITH — the close pass's: a sound of it that would land inside guardMs of another's is moved to just after it.
// The same seed, the same section.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ThreeBodySim = factory();
}(typeof self !== 'undefined' ? self : this, function () {
'use strict';

const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const r3 = (x) => Math.round(x * 1000) / 1000;

const DEFAULTS = {
    pace: { gapMs: [2500, 6000], jitter: 0.08 },
    approaching: { beatMs: [300, 900], holdMs: 400, depth: 3, waitMs: [2500, 6000] },
    closePass: { tightMs: [60, 150], betMs: [40, 120], missMs: 250, beforeShare: 0.5, selfMs: 150, depth: 2, waitMs: [900, 2400], predictMs: [150, 3000] },
    breakRejoin: { windowMs: 1500, count: 3, breakGapMs: 450, enterMs: [40, 220] },
    guardMs: 25,
};
function rulesOf(r) {
    const o = {};
    for (const k of Object.keys(DEFAULTS)) o[k] = (typeof DEFAULTS[k] === 'object') ? Object.assign({}, DEFAULTS[k], (r && r[k]) || {}) : (r && r[k] != null ? r[k] : DEFAULTS[k]);
    return o;
}
const listens = (s) => s === 'approaching' || s === 'closePass';

function run(opts) {
    const R = rulesOf(opts.rules), dt = Math.max(1, +opts.stepMs || 5) / 1000, seed = Math.max(1, Math.round(+opts.seed) || 1);
    const ms = (range, rnd) => (range[0] + (range[1] - range[0]) * rnd()) / 1000;   // a draw from a range of milliseconds, in seconds
    const onsets = [];
    const P = opts.players.map((pl, i) => ({ name: pl.name, C: pl.containers, ci: -1, c: null, rnd: mulberry32((seed * 1000003 + (i + 1) * 7919) >>> 0),
        gap: null, nextPace: null, waitUntil: null, lastOwn: -1e9, queue: [], heard: {}, anyLast: null, anyPrev: null, bet: null, armed: false, rejoined: false, silenceEnd: 0 }));
    const end = Math.max(...P.map((p) => p.C[p.C.length - 1].end));

    // the listening rule a container holds (its own, or the one a change goes to / comes from) — whose waitMs times the unprompted sound
    const listenRule = (c) => (listens(c.state) ? c.state : c.state === 'change' ? (listens(c.to) ? c.to : listens(c.from) ? c.from : null) : null);
    const paces = (p) => { const c = p.c; return c.state === 'far' || (c.state === 'change' && (c.from === 'far' || c.to === 'far')) || (c.state === 'breakRejoin' && p.rejoined); };
    // the rule that decides at time t: the container's state — in a change, a coin weighted by the place in it
    const rule = (p, t) => {
        const c = p.c;
        if (c.state !== 'change') return c.state === 'breakRejoin' && p.rejoined ? 'far' : c.state;
        if (c.from === 'breakRejoin') return 'far';   // back from the break it already keeps its own pace
        const w = (t - c.start) / Math.max(1e-6, c.end - c.start);
        return p.rnd() < w ? c.to : c.from;
    };
    const targetFor = (p, r) => { const c = p.c; return c.state === 'change' ? (r === c.to ? c.target : c.targetFrom) : c.target; };
    const lastOwn = (p) => p.queue.reduce((m, q) => Math.max(m, q.t), p.lastOwn);

    const enter = (p, t) => {
        const c = p.c;
        if (c.state === 'far') { p.gap = ms(R.pace.gapMs, p.rnd); if (p.nextPace == null || p.nextPace < t) p.nextPace = t + p.gap * (0.15 + 0.85 * p.rnd()); }
        if (c.state === 'approaching' || c.state === 'closePass') p.nextPace = null;
        if (c.state === 'breakRejoin') { p.queue = []; p.bet = null; p.armed = false; p.rejoined = false; p.silenceEnd = c.start + (c.silenceS || 0); p.nextPace = null; }
        const lr = listenRule(c);
        p.waitUntil = lr ? t + ms(R[lr].waitMs, p.rnd) : null;
    };

    // what a player does on hearing another's onset
    const hear = (q, who, at, gen) => {
        (q.heard[who] = q.heard[who] || []).push(at); if (q.heard[who].length > 4) q.heard[who].shift();
        const prevAny = q.anyLast; q.anyPrev = prevAny; q.anyLast = at;
        if (q.bet && (q.bet.who === who || q.bet.who === 'cluster')) {   // the bet's answer: was the next onset where it was predicted?
            // (the answer may come BEFORE the bet has sounded — the target was early: the sound is committed and lands late, a miss)
            const err = at - q.bet.predicted, known = { errMs: Math.round(err * 1000), hit: Math.abs(err) * 1000 <= R.closePass.missMs };
            Object.assign(q.bet.play, known); if (q.bet.onset) Object.assign(q.bet.onset, known);
            q.bet = null;
        }
        if (!q.c) return;
        const r = rule(q, at);
        if (!listens(r)) return;
        const tg = targetFor(q, r) || 'any';
        if (!(tg === who || tg === 'any' || tg === 'cluster')) return;
        const K = R[r];
        if (gen >= K.depth) return;
        const own = lastOwn(q);
        if (r === 'approaching') {
            const at2 = at + ms(K.beatMs, q.rnd);
            if ((at2 - own) * 1000 >= K.holdMs) q.queue.push({ t: at2, gen: gen + 1, role: 'beat', ref: who, rule: r });
            return;
        }
        // close pass: a bet before the next onset, or just after this one
        const prev = tg === 'cluster' ? prevAny : (q.heard[who].length > 1 ? q.heard[who][q.heard[who].length - 2] : null);
        if (q.rnd() < K.beforeShare && prev != null) {
            const iv = (at - prev) * 1000;
            if (iv >= K.predictMs[0] && iv <= K.predictMs[1]) {
                const predicted = at + iv / 1000, at2 = predicted - ms(K.betMs, q.rnd);
                if (at2 >= at + (R.guardMs + 10) / 1000 && (at2 - own) * 1000 >= K.selfMs) {
                    const play = { t: at2, gen: gen + 1, role: 'bet', ref: who, rule: r, predicted };
                    q.queue.push(play); q.bet = { who: tg === 'cluster' ? 'cluster' : who, predicted, play };
                    return;
                }
            }
        }
        const at2 = at + ms(K.tightMs, q.rnd);
        if ((at2 - own) * 1000 >= K.selfMs) q.queue.push({ t: at2, gen: gen + 1, role: 'after', ref: who, rule: r });
    };

    for (let t = 0; t < end; t += dt) {
        for (const p of P) {
            // 1 · the container
            while (p.ci < p.C.length - 1 && (p.ci < 0 || t >= p.C[p.ci].end)) { p.ci++; p.c = p.C[p.ci]; enter(p, t); }
            const c = p.c;
            // 2 · its own pace
            if (paces(p) && p.nextPace != null && t >= p.nextPace) {
                if (rule(p, p.nextPace) === 'far') p.queue.push({ t: Math.max(t, p.nextPace), gen: 0, role: 'pace', rule: 'far' });
                p.nextPace += (p.gap || ms(R.pace.gapMs, p.rnd)) * (1 + (p.rnd() * 2 - 1) * R.pace.jitter);
            }
            // 3 · a listener who has heard nothing to answer
            if (p.waitUntil != null && t >= p.waitUntil) {
                const r = rule(p, t), lr = listenRule(c);
                if (listens(r) && !p.queue.length) p.queue.push({ t: t + dt, gen: 0, role: 'unprompted', rule: r });
                p.waitUntil = lr ? t + ms(R[lr].waitMs, p.rnd) : null;
            }
            // 4 · the break: silence, then in as a cluster breaks up
            if (c.state === 'breakRejoin' && !p.rejoined && t >= p.silenceEnd) {
                const B = R.breakRejoin;
                let n = 0, last = -1e9; const who = new Set();
                for (let i = onsets.length - 1; i >= 0; i--) { const o = onsets[i]; if (t - o.t > B.windowMs / 1000) break; if (o.player !== p.name) { n++; who.add(o.player); if (o.t > last) last = o.t; } }
                if (n >= B.count && who.size >= 2) p.armed = true;   // a cluster: several sounds close together, of more than one player
                const broke = p.armed && (t - last) * 1000 >= B.breakGapMs, alone = t >= p.silenceEnd + (c.end - p.silenceEnd) * 2 / 3;
                if (broke || alone) {
                    const at2 = t + ms(B.enterMs, p.rnd);
                    p.queue.push({ t: at2, gen: 0, role: broke ? 'rejoin' : 'rejoin-alone', rule: 'breakRejoin' });
                    p.rejoined = true; p.gap = ms(R.pace.gapMs, p.rnd); p.nextPace = at2 + p.gap;
                }
            }
            // 5 · what is due sounds — never WITH another
            if (p.queue.length) {
                p.queue.sort((a, b) => a.t - b.t);
                while (p.queue.length && p.queue[0].t <= t + dt) {
                    const play = p.queue[0];
                    if (c.state === 'breakRejoin' && !p.rejoined) { p.queue.shift(); continue; }   // the break is silent
                    let moved = false;   // the guard is the close pass's: far apart ignores the others
                    for (let i = onsets.length - 1; play.rule === 'closePass' && i >= 0 && onsets[i].t > play.t - 0.5; i--) {
                        const o = onsets[i];
                        if (o.player !== p.name && Math.abs(o.t - play.t) * 1000 < R.guardMs) { play.t = o.t + (R.guardMs + 15 * p.rnd()) / 1000; moved = true; }
                    }
                    if (moved && play.t > t + dt) break;   // moved past this step: it sounds in its own
                    p.queue.shift();
                    const o = { t: r3(play.t), player: p.name, state: c.state, rule: play.rule || c.state, role: play.role, gen: play.gen, ref: play.ref || '' };
                    if (c.state === 'change') { o.from = c.from; o.to = c.to; }
                    if (play.role === 'bet') { o.hit = play.hit === true; o.errMs = play.errMs == null ? null : play.errMs; if (p.bet && p.bet.play === play) p.bet.onset = o; }   // errMs null: the target never played again
                    onsets.push(o);
                    p.lastOwn = play.t;
                    const lr = listenRule(c);
                    if (lr) p.waitUntil = play.t + ms(R[lr].waitMs, p.rnd);
                    for (const q of P) if (q !== p) hear(q, p.name, play.t, play.gen);
                }
            }
        }
    }
    onsets.sort((a, b) => a.t - b.t);
    const counts = {};
    for (const o of onsets) { const k = o.role === 'bet' ? (o.hit ? 'bet-hit' : 'bet-miss') : o.role; counts[k] = (counts[k] || 0) + 1; }
    return { onsets, counts, lengthS: end, rules: R };
}

return { DEFAULTS, rulesOf, run, mulberry32 };
}));
