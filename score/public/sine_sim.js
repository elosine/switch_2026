// sine_sim.js — THE SIMULATED PLAYER AGAINST A SINE: which behaviour, how far, in which shape (PLAN.md 1.5 · 12.4; DEC-35 · 35b;
// RUNNING_LOG §179). His words: *"the musician will pitch bend against and beat with sine tone, only the percussion, playing bowed
// crotales, will have the sine gliss against their steady pitch … these will be up to player discresion so we can simulate some
// behaviors like gliss up 1/4 tone over the duration of sine etc"* — and, asked how far: *"this is simulated player behavior, so a
// variety, for perc, we can do about to 30hz depending on frequency and do a variety of up to unison, down to unison up and down
// from unison etc."*
//
// A PURE module (the accel calculator's pattern): no DOM, no MIDI, no score. It is handed a lane's instrument, a pitch, a length and
// a seeded random, and gives back ONE DRAW:
//     { who, voice, kind, cents, sineMidi, bend, gliss, beatsFrom, beatsTo, say }
//   who 'player'   the sine holds; `bend` is the NOTE's line — [[seconds from the note's start, cents against its key] …], the very
//                  field the stack's note player already streams as pitch bend (`morphBend`, the morph notes' — composer.html
//                  tickCurvePlayback: pre-armed before the note, streamed through the instrument's measured range, centred after)
//   who 'sine'     the player holds; `gliss` is the SINE BRICK's — { kind: to | from | through | around, from, to } in cents
//                  (electronics/score/le_sine.js)
//   sineMidi       the sine's pitch: the note's key, plus the lane's sineOctave and sineCents (a crotale sounds two octaves above its key)
//   A lane may give its range as `beatHz` instead of `cents` — BEATS A SECOND, turned into cents at the note's own pitch (the same
//   beat is more cents the lower the note — 30 a second is 48 c on a C6 crotale and 590 c on the cello's D2); for a bending player
//   as for a gliding sine. `side` 'over' | 'under' fixes the side (absent: a coin); a gliding sine with a side never crosses the
//   pitch (no `through`). The cello is `beatHz` [25, 35] over since 2026-10-08 (RUNNING_LOG §262 · §263): the CELLO bends, the
//   sine static — a bend past the sampler's ±1 st is RE-KEYED by the GO (sine_go.js rekeyChain, the string quartet's rule), so the
//   draw is capped by the PLAYER's limit only (opts.limitCents = playerBendSt × 100).
// The numbers are the piece's — bank/sine_behaviours.json, read through config(); DEFAULTS below is the same file's shape, so the
// module stands without it. The same seed, the same draw: a save reproduces what he heard.
//   node tools/sine_check.js   checks it.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.SineSim = factory();
}(typeof self !== 'undefined' ? self : this, function () {
'use strict';

const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const DEFAULTS = {
    lanes: {},
    player: { kinds: { toUnison: 4, fromUnison: 2, through: 2, hold: 1, waver: 1 }, settle: [0.55, 0.9], leave: [0.1, 0.4], ease: { linear: 2, in: 1, out: 1 } },
    sine: { kinds: { to: 4, from: 2, through: 2, around: 2 } },
    level: 'mf',
};
const r1 = (x) => Math.round(x * 10) / 10, r3 = (x) => Math.round(x * 1000) / 1000;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
// the beating a detune of c cents makes against a pitch, in beats a second
const beats = (m, c) => Math.abs(hz(m) * (Math.pow(2, c / 1200) - 1));
// the cents that make b beats a second against a pitch — above it (sign +) or below (−)
const centsFor = (m, b, sign) => { const f = hz(m); return sign >= 0 ? 1200 * Math.log2(1 + b / f) : 1200 * Math.log2(Math.max(1e-6, 1 - b / f)); };

// the piece's file over the defaults: a lane, or a section's field, replaces the default's
function config(file) {
    const f = file && typeof file === 'object' ? file : {};
    return { lanes: Object.assign({}, DEFAULTS.lanes, f.lanes || {}), player: Object.assign({}, DEFAULTS.player, f.player || {}),
        sine: Object.assign({}, DEFAULTS.sine, f.sine || {}), level: f.level != null ? f.level : DEFAULTS.level,
        track: f.track && typeof f.track === 'object' ? f.track : null };   // PLAN 1.8 · 16.1: what a NEW brick's Follow is (null: it sounds for its whole span)
}
// one name from { name: weight }
function pick(weights, rnd) {
    const keys = Object.keys(weights || {}).filter((k) => +weights[k] > 0);
    if (!keys.length) return null;
    let x = rnd() * keys.reduce((s, k) => s + +weights[k], 0);
    for (const k of keys) { x -= +weights[k]; if (x < 0) return k; }
    return keys[keys.length - 1];
}
const between = (r, rnd) => (Array.isArray(r) ? +r[0] + (+r[1] - +r[0]) * rnd() : +r);
// a move from (t0, v0) to (t1, v1): straight — two points — or eased: five points on a curve (in: slow, then quick · out: quick, then slow)
function eased(t0, v0, t1, v1, ease) {
    if (ease !== 'in' && ease !== 'out') return [[t0, v0], [t1, v1]];
    const p = ease === 'in' ? 2 : 0.5, out = [];
    for (let i = 0; i <= 4; i++) { const x = i / 4; out.push([t0 + (t1 - t0) * x, v0 + (v1 - v0) * Math.pow(x, p)]); }
    return out;
}
const tidy = (pts) => pts.map((p) => [r3(p[0]), r1(p[1])]).filter((p, i, a) => i === 0 || p[0] > a[i - 1][0]);

// a player's bend: the note's own line, seconds from its start against cents from its key
//   o: { settle, leave, ease, far } — the fractions and the shape already drawn
function playerBend(kind, c, lenS, o) {
    o = o || {};
    const len = Math.max(0.05, +lenS || 0);
    switch (kind) {
        case 'toUnison': { const s = Math.max(0.05, Math.min(1, o.settle != null ? o.settle : 0.75)); return tidy(eased(0, c, s * len, 0, o.ease).concat(s < 1 ? [[len, 0]] : [])); }
        case 'fromUnison': { const h = Math.max(0, Math.min(0.95, o.leave != null ? o.leave : 0.25)); return tidy((h > 0 ? [[0, 0]] : []).concat(eased(h * len, 0, len, c, o.ease))); }
        case 'through': return tidy(eased(0, c, len, -c * (o.far != null ? o.far : 0.6), o.ease));
        case 'hold': return tidy([[0, c], [len, c]]);
        case 'waver': return tidy([[0, 0], [len * 0.25, c], [len * 0.5, -c * 0.8], [len * 0.75, c * 0.5], [len, 0]]);
        default: return tidy([[0, 0], [len, 0]]);
    }
}

// ONE DRAW for a note: cfg (config()'s) · the lane's instrument key · the note's key · its length in seconds · a seeded random ·
// opts.limitCents (the instrument's own limit; 100 where it says nothing). null: this lane is not one of the file's.
function draw(cfg, instKey, midi, lenS, rnd, opts) {
    const L = cfg && cfg.lanes && cfg.lanes[instKey];
    if (!L) return null;
    const limit = Math.max(1, (opts && opts.limitCents != null ? +opts.limitCents : 100) - 2);
    const sineMidi = Math.round((+midi + (+L.sineOctave || 0) + (+L.sineCents || 0) / 100) * 10000) / 10000;
    // above or below: a coin — unless the lane says `side` (the cello, 2026-10-08: 30 beats a second UNDER a D2 would put the sine near 40 Hz)
    const sign = L.side === 'over' ? 1 : L.side === 'under' ? -1 : (rnd() < 0.5 ? -1 : 1), where = sign < 0 ? 'under' : 'over';
    if (L.who === 'sine') {
        // a lane with a `side` keeps the sine on that side: no `through` (a crossing would take the cello's sine far under its D2)
        const kindsOf = L.side ? Object.fromEntries(Object.entries(cfg.sine.kinds).filter(([k]) => k !== 'through')) : cfg.sine.kinds;
        const kind = pick(kindsOf, rnd) || 'to';
        const b = Math.max(0.2, between(L.beatHz || [3, 30], rnd)), c = r1(centsFor(sineMidi, b, sign)), far = 0.3 + 0.7 * rnd();
        const gliss = kind === 'to' ? { kind, from: c, to: 0 } : kind === 'from' ? { kind, from: 0, to: c } : kind === 'through' ? { kind, from: c, to: r1(-c * far) } : { kind: 'around', from: c, to: 0 };
        const ends = kind === 'to' ? [c, 0] : kind === 'from' ? [0, c] : kind === 'through' ? [c, gliss.to] : [0, c];
        const say = { to: 'the sine starts ' + Math.abs(c) + ' c ' + where + ' and arrives', from: 'the sine starts on the pitch and leaves to ' + Math.abs(c) + ' c ' + where,
            through: 'the sine crosses from ' + Math.abs(c) + ' c ' + where + ' to ' + Math.abs(gliss.to) + ' c on the other side', around: 'the sine goes out to ' + Math.abs(c) + ' c ' + where + ' and back' }[kind];
        return { who: 'sine', voice: L.voice, kind, cents: c, sineMidi, bend: null, gliss, beatsFrom: r1(beats(sineMidi, ends[0])), beatsTo: r1(beats(sineMidi, ends[1])), say };
    }
    // a sided player never crosses the pitch either (the cello bending UP from its D2: below is its C string) — no `through`
    const pKinds = L.side ? Object.fromEntries(Object.entries(cfg.player.kinds).filter(([k]) => k !== 'through')) : cfg.player.kinds;
    const kind = pick(pKinds, rnd) || 'toUnison';
    // the range: `cents` as it was, or `beatHz` — BEATS A SECOND, turned into cents at this note's own pitch (§262 · §263: the same
    // beat is more cents the lower the note — 30 a second is 590 c on the cello's D2, 48 c on a C6); the draws in the same order either way
    const band = L.beatHz || L.cents || [8, 50], lo = +band[0], hi = +band[1];
    let c = lo + (hi - lo) * rnd();
    if (kind === 'hold') c = L.beatHz ? lo * (0.1 + 0.25 * rnd()) : lo + (hi - lo) * 0.35 * rnd();   // a steady offset is a small one (in beats: a tenth to a third of the band's floor)
    if (kind === 'waver') c = L.beatHz ? lo * (0.1 + 0.2 * rnd()) : lo + (hi - lo) * 0.3 * rnd();
    if (L.beatHz) c = Math.abs(centsFor(sineMidi, Math.max(0.2, c), sign));
    // the limit is the PLAYER's (opts.limitCents = playerBendSt); the sampler's range is the re-key's business (sine_go.js rekeyChain)
    c = r1(Math.min(c, limit)) * sign;
    const o = { settle: between(cfg.player.settle, rnd), leave: between(cfg.player.leave, rnd), ease: pick(cfg.player.ease, rnd) || 'linear', far: 0.3 + 0.7 * rnd() };
    const bend = playerBend(kind, c, lenS, o), cs = bend.map((p) => p[1]);
    const say = { toUnison: 'starts ' + Math.abs(c) + ' c ' + where + ' and finds the pitch at ' + Math.round(o.settle * 100) + ' %', fromUnison: 'holds the pitch for ' + Math.round(o.leave * 100) + ' %, then drifts ' + Math.abs(c) + ' c ' + where,
        through: 'crosses from ' + Math.abs(c) + ' c ' + where + ' to ' + Math.abs(r1(c * o.far)) + ' c on the other side', hold: 'holds ' + Math.abs(c) + ' c ' + where, waver: 'wavers ' + Math.abs(c) + ' c around the pitch' }[kind];
    return { who: 'player', voice: L.voice, kind, cents: c, sineMidi, bend, gliss: null,
        beatsFrom: r1(beats(sineMidi, cs[0])), beatsTo: r1(beats(sineMidi, cs[cs.length - 1])), ease: o.ease, say: say + (o.ease !== 'linear' && kind !== 'hold' && kind !== 'waver' ? ' (' + o.ease + ')' : '') };
}

return { DEFAULTS, mulberry32, hz, beats, centsFor, config, pick, eased, playerBend, draw };
}));
