// three_body_roll.js — THE THREE BODY PROBLEM: THE ROLL (PLAN.md 1.6 · 14.2; docs/THREE_BODY.md § 3; DEC-36c … 36e; RUNNING_LOG §188).
// His words: *"let's do, like cage and roll some I Ching time containers … roll each player reasonable time containers for each
// part. And then we'll end cap with free."* — *"1 orbit per player longer containers; b change can be its own time container"* —
// and, asked whether a close pass must find company: *"b"*.
//
// A PURE module (sine_sim.js's pattern): no DOM, no score, no file. It is handed the piece's numbers (bank/three_body.json) and a
// seed, and gives back every player's NINE CONTAINERS —
//     far apart · change · approaching · change · close pass · change · break-and-rejoin · change · far apart
// — each length rolled by a HEXAGRAM, as Cage rolled his charts: six lines, each THREE COINS (heads 3, tails 2; a line's sum
// 6 … 9 — 6 · 8 broken, 7 · 9 whole; the moving lines 6 · 9 are kept in the record and not used), the two trigrams looked up in
// the King Wen table → a number 1 … 64, read across the container's range:  lo + (n − 1) / 63 · (hi − lo)  seconds. The coins
// come from ONE seeded stream, the players in order: one seed, one section, exactly.
//
//   ThreeBodyRoll.hexagram(rnd)                    -> { n: 1 … 64, lines: [6 … 9] × 6 (bottom first), glyph: '䷀' … }
//   ThreeBodyRoll.roll(cfg, names, seed)           -> { seed, players: [{ name, containers: [{ index, state, from?, to?, start, end,
//                                                       hex, lines, lo, hi, silenceS?, hexSilence? }] }] }
//   ThreeBodyRoll.company(roll, overlapS)          -> { ok, lonely: [names] }   — every close pass overlaps another's close pass or approaching
//   ThreeBodyRoll.rollKept(cfg, names, seed)       -> the first roll from `seed` on that keeps the constraint: { …roll, seedAsked, seedUsed, tries }
//   ThreeBodyRoll.targets(roll, who, candidates, seed) -> the same containers with a TARGET on each that listens (below)
//   ThreeBodyRoll.table(roll)                      -> lines of text, one a container
// THE LENGTH of the section is not rolled: it is the last player's return to far apart + the end cap (cfg.endCapS), or cfg.lengthS
// where that is later. A change container says what it is between:  from · to  (far → approaching, …).
// A break-and-rejoin is TWO rolls: its silence (silenceS) and its rejoining; its length is their sum.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.ThreeBodyRoll = factory();
}(typeof self !== 'undefined' ? self : this, function () {
'use strict';

const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const r3 = (x) => Math.round(x * 1000) / 1000;

const STATES = ['far', 'change', 'approaching', 'change', 'closePass', 'change', 'breakRejoin', 'change', 'far'];
// the eight trigrams, each by its three lines BOTTOM FIRST (1 whole · 0 broken), in the order of the book's key
const TRIGRAMS = ['111', '100', '010', '001', '000', '011', '101', '110'];   // Ch'ien · Chên · K'an · Kên · K'un · Sun · Li · Tui
// the King Wen number: KING_WEN[lower][upper]
const KING_WEN = [
    [1, 34, 5, 26, 11, 9, 14, 43],
    [25, 51, 3, 27, 24, 42, 21, 17],
    [6, 40, 29, 4, 7, 59, 64, 47],
    [33, 62, 39, 52, 15, 53, 56, 31],
    [12, 16, 8, 23, 2, 20, 35, 45],
    [44, 32, 48, 18, 46, 57, 50, 28],
    [13, 55, 63, 22, 36, 37, 30, 49],
    [10, 54, 60, 41, 19, 61, 38, 58],
];

function hexagram(rnd) {
    const lines = [];
    for (let i = 0; i < 6; i++) { let s = 0; for (let c = 0; c < 3; c++) s += rnd() < 0.5 ? 2 : 3; lines.push(s); }   // 6 … 9
    const bit = (v) => (v % 2 ? '1' : '0');   // 7 · 9 whole, 6 · 8 broken
    const lower = TRIGRAMS.indexOf(lines.slice(0, 3).map(bit).join('')), upper = TRIGRAMS.indexOf(lines.slice(3).map(bit).join(''));
    const n = KING_WEN[lower][upper];
    return { n, lines, glyph: String.fromCodePoint(0x4DC0 + n - 1) };
}
const across = (n, range) => r3(range[0] + (n - 1) / 63 * (range[1] - range[0]));

function roll(cfg, names, seed) {
    const R = cfg.rangesS, rnd = mulberry32(Math.max(1, Math.round(+seed) || 1));
    const players = names.map((name) => {
        const containers = []; let t = 0;
        STATES.forEach((state, index) => {
            const c = { index, state, start: r3(t) };
            if (state === 'change') { c.from = STATES[index - 1]; c.to = STATES[index + 1]; }
            if (index === STATES.length - 1) { c.end = c.start; c.hex = 0; c.lines = ''; c.endCap = true; }   // its end is the section's: set below
            else if (state === 'breakRejoin') {
                const hs = hexagram(rnd), hr = hexagram(rnd);
                c.silenceS = across(hs.n, R.breakSilence); c.hexSilence = hs.n; c.linesSilence = hs.lines.join('');
                c.hex = hr.n; c.lines = hr.lines.join(''); c.lo = R.breakRejoin[0]; c.hi = R.breakRejoin[1];
                c.end = r3(t + c.silenceS + across(hr.n, R.breakRejoin));
            } else {
                const range = state === 'change' ? (c.to === 'breakRejoin' ? R.changeToBreak : R.change) : R[state], h = hexagram(rnd);
                c.hex = h.n; c.lines = h.lines.join(''); c.lo = range[0]; c.hi = range[1];
                c.end = r3(t + across(h.n, range));
            }
            t = c.end; containers.push(c);
        });
        return { name, containers };
    });
    // THE END CAP: the section ends endCapS after the LAST player has come back to far apart — or at lengthS, where the piece names one
    // and it is later. So the last far apart is never shorter than the cap, and a seed with long rolls is not cut.
    const latest = Math.max(...players.map((p) => p.containers[STATES.length - 1].start)), cap = +cfg.endCapS > 0 ? +cfg.endCapS : 20;
    const len = r3(Math.max(+cfg.lengthS || 0, latest + cap));
    players.forEach((p) => { p.containers[STATES.length - 1].end = len; });
    return { seed: Math.max(1, Math.round(+seed) || 1), lengthS: len, players };
}

const overlap = (a, b) => Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
// his "b": every player's close pass overlaps ANOTHER player's close pass or approaching by overlapS at the least
function company(rolled, overlapS) {
    const need = overlapS == null ? 3 : +overlapS, lonely = [];
    for (const p of rolled.players) {
        const cp = p.containers.find((c) => c.state === 'closePass');
        const met = rolled.players.some((q) => q !== p && q.containers.some((c) => (c.state === 'closePass' || c.state === 'approaching') && overlap(cp, c) >= need));
        if (!met) lonely.push(p.name);
    }
    return { ok: lonely.length === 0, lonely };
}
// THE FIT (DEC-37, 2026-10-06 — his "let's try 110 seconds"): from `seed` on, the KEPT roll whose length lands nearest `fitS` seconds,
// among cfg.constraint.tries kept rolls (200); the ranges stay as written — only the seed is chosen. seedAsked stays the seed given.
function rollFit(cfg, names, seed, fitS) {
    let best = rollKept(cfg, names, seed), s = best.seedUsed + 1;
    const tries = Math.max(1, Math.round(+((cfg.constraint || {}).tries) || 200));
    for (let n = 1; n < tries; n++) { const r = rollKept(cfg, names, s); if (Math.abs(r.lengthS - fitS) < Math.abs(best.lengthS - fitS)) best = r; s = r.seedUsed + 1; }
    return Object.assign(best, { seedAsked: Math.max(1, Math.round(+seed) || 1), fitS: +fitS });
}

function rollKept(cfg, names, seed) {
    const k = cfg.constraint || {}, tries = k.kind === 'company' ? Math.max(1, +k.tries || 200) : 1, s0 = Math.max(1, Math.round(+seed) || 1);
    for (let i = 0; i < tries; i++) {
        const r = roll(cfg, names, s0 + i);
        if (k.kind !== 'company' || company(r, k.overlapS).ok) return Object.assign(r, { seedAsked: s0, seedUsed: s0 + i, tries: i + 1 });
    }
    throw new Error('no roll in ' + tries + ' seeds from ' + s0 + ' gives every close pass its company — widen the ranges or loosen the constraint (bank/three_body.json)');
}

// WHO A PLAYER LISTENS TO. His words: approaching — "Choose a player or a type of sound"; close pass — "Choose a player, or several
// players in a cluster". For each player named in `who`: a target for its approaching and one for its close pass, drawn (seeded)
// among `candidates`, weighted by how much each candidate SOUNDS while the listening lasts (far apart sounds all the time; a
// break hardly at all). Half the close passes take the CLUSTER — whoever plays. A change carries the targets of the two states
// it is between (target: the state it goes to · targetFrom: the state it leaves).
const SOUNDS = { far: 1, change: 0.6, approaching: 0.6, closePass: 0.8, breakRejoin: 0.2 };
function targets(rolled, who, candidates, seed) {
    const rnd = mulberry32((Math.max(1, Math.round(+seed) || 1) * 7919) >>> 0);
    const by = Object.fromEntries(rolled.players.map((p) => [p.name, p]));
    const pick = (self, span) => {
        const w = candidates.filter((n) => n !== self && by[n]).map((n) => [n, by[n].containers.reduce((s, c) => s + overlap(span, c) * (SOUNDS[c.state] || 0), 0)]).filter((x) => x[1] > 0);
        const sum = w.reduce((s, x) => s + x[1], 0);
        if (!w.length || sum <= 0) return 'any';
        let u = rnd() * sum;
        for (const [n, v] of w) { u -= v; if (u <= 0) return n; }
        return w[w.length - 1][0];
    };
    for (const name of who) {
        const p = by[name]; if (!p) continue;
        const C = p.containers, ap = C[2], cp = C[4];
        const tA = pick(name, { start: C[1].start, end: ap.end }), tC = rnd() < 0.5 ? 'cluster' : pick(name, { start: C[3].start, end: C[5].end });
        ap.target = tA; cp.target = tC;
        C[1].target = tA;                       // far → approaching
        C[3].targetFrom = tA; C[3].target = tC; // approaching → close pass
        C[5].targetFrom = tC;                   // close pass → the break
    }
    return rolled;
}

const NAMES = { far: 'far apart', change: 'change', approaching: 'approaching', closePass: 'close pass', breakRejoin: 'break and rejoin' };
function table(rolled) {
    const out = [];
    for (const p of rolled.players) for (const c of p.containers) {
        out.push(p.name.padEnd(5) + String(c.index + 1) + '  ' + (NAMES[c.state] + (c.state === 'change' ? ' (' + NAMES[c.from] + ' → ' + NAMES[c.to] + ')' : '')).padEnd(46)
            + c.start.toFixed(1).padStart(6) + ' … ' + c.end.toFixed(1).padStart(6) + ' s  ' + (c.end - c.start).toFixed(1).padStart(5) + ' s  '
            + (c.endCap ? 'the end cap' : 'hexagram ' + (c.hexSilence ? c.hexSilence + ' (silence ' + c.silenceS.toFixed(1) + ' s) + ' : '') + c.hex)
            + (c.target ? '  → ' + c.target : '') + (c.targetFrom ? '  (from ' + c.targetFrom + ')' : ''));
    }
    return out;
}

return { STATES, NAMES, KING_WEN, TRIGRAMS, mulberry32, hexagram, across, roll, company, rollKept, rollFit, targets, table, overlap };
}));
