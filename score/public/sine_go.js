// sine_go.js — THE GO: selected played notes become SINE TONES and a simulated player beating against them (PLAN.md 1.5 · 12.5;
// DEC-35 · 35b; RUNNING_LOG §180). His words: *"I play. bricks appear in composer score, I make a take for this ensemble, I select
// played notes in composer, select a take, press go, played in bricks are replaced with sine tone generation and a rough performer
// simulation via midi"* — and of the takes: *"I would select bricks in composer score, different sections, different takes."*
//
// IN THE PAGE the three steps are on THE HARMONY STRIP (harmony_sel.js — the strip at the top right whenever notes are selected):
//     1 · select the played notes          2 · take ▾ — the take's pitch for each note's player (the strip's own, as it was)
//     3 · ∿ sines — THE GO (this file's button, with its seed; ∿ off takes it back; the strip's `back` takes it back too)
// Another selection, another take, GO again: several takes across a section. GO again on the same notes with another seed draws
// other behaviours and keeps each brick's own level (a curve he attached stays).
//
// WHAT THE GO DOES TO ONE NOTE (convert, below — the same in the page and in tools/sine_go.js):
//   · its lane's VOICE — the technique the simulated player holds a long tone on (bank/sine_behaviours.json `lanes`);
//     its pitch stays what it is (the take's), brought into that voice's range by octaves where it must
//   · a SINE BRICK (`elecSine`, electronics/score/le_sine.js) on the same lane over the note's span, at the note's SOUNDING pitch
//   · WHO MOVES, by the lane: a `player` lane — the note gets a BEND, a line of cents drawn by score/public/sine_sim.js, written as the
//     note's own `morphBend` (the field the stack's note player already streams as pitch bend); the note becomes a DRAWN note so
//     the bend is on its own curve channel and bends nothing else (harmony_sel.js's rule, §318 of piece #6: its struck sound kept by
//     velAbs · cc7Abs) · a `sine` lane (the bowed crotales) — the note holds and the BRICK gets a gliss
//   · what the note was is kept ON THE NOTE (`properties.sine.was`), with the brick's id, the kind drawn and the seed
//   · THE RE-KEY (2026-10-08, RUNNING_LOG §263 — the string quartet's rule, #1): a bend past the SAMPLER's measured range
//     (bendRangeSt; the Xsample strings ±1 st) makes the note a CHAIN — the first note shortened, the others new notes after it on the
//     same lane, each at a moved key with the bend re-based against it, the previous ending 5 ms after the next begins; the brick
//     spans the whole chain; every segment carries `properties.sine.segment { of, k, n }` and `keyOffset`, the first its `chain`.
//     ∿ off, or a GO again, dissolves the chain first. The draw is capped by the PLAYER's range (playerBendSt) only.
// A lane the file does not name is left alone (the unpitched percussion: no pitch to beat against).
//
// NO GROUP: in this stack a group moves by its META shape; a shape per note would bury the META lane. A note and its brick lie on
// one lane over one span — a box selection takes both.
//
// The first half is PURE (no DOM): takeChord · applyChord · convert · unconvert — `node tools/sine_check.js` checks it,
// tools/sine_go.js and tools/build_sine_demo.js use it. The second half (install) is the page's: the strip's three controls.
(function (root, factory) {
    const node = typeof module === 'object' && module.exports;
    const api = factory(node ? require('./sine_sim.js') : root.SineSim);
    if (node) module.exports = api;
    else { root.SineGo = api; api.install(root); }
}(typeof self !== 'undefined' ? self : this, function (SineSim) {
'use strict';

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const pn = (m) => { const n = Math.round(+m), c = Math.round((+m - n) * 100); return NAMES[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1) + (c ? (c > 0 ? ' +' : ' −') + Math.abs(c) + 'c' : ''); };
const r3 = (x) => Math.round(x * 1000) / 1000;
const copy = (x) => (x == null ? null : JSON.parse(JSON.stringify(x)));
const SEATS = ['bowed_vibraphone'];   // the strikes drawer's second seats (strike_drawer.js EXTRA_SEATS): a row past the lanes plays on that instrument's lane
const SINE = { color: '#1E88E5', yOffset: 0.75 };   // the brick's look (le_sine.js MODELS.elecSine) — a builder has no page to ask

const isNote = (o, lanes) => !!(o && o.type === 'waveCurve' && o.sonifyNote != null && o.layer >= 0 && o.layer < lanes);
const r1 = (x) => Math.round(x * 10) / 10;

// ---- THE RE-KEY — the string quartet's rule (#1; #5 RUNNING_LOG §150; morph.js REKEY_OVERLAP_S; this piece's §263) ----
// A sampler bends so far (the instrument's MEASURED bendRangeSt — the Xsample strings ±1 st, RPN ignored). Where a drawn bend passes
// that range the note becomes a CHAIN: the key moves, the bend is re-based against the new key, the previous key ends 5 ms after the
// next begins (the seam hidden — "no seam", #4's verdict). The key chosen at each seam is the one with the most room in the direction
// of travel: a bend rising from D plays D# with the wheel full-flat and bends up ("two semitones per segment" at ±1 st), as #1 did.
const REKEY_OVERLAP_S = 0.005;   // the previous key ends this long after the next begins
const REKEY_STEP_S = 0.05;       // the chain's bend sampled every 50 ms (#1's step; beating_calc.js stepS)
const REKEY_EDGE_C = 1;          // the bend rides to this many cents inside the sampler's edge before the key moves
const bendAt = (bp, dt) => { if (!bp || !bp.length) return 0; if (dt <= bp[0][0]) return +bp[0][1]; for (let i = 1; i < bp.length; i++) if (dt <= bp[i][0]) { const a = bp[i - 1], b = bp[i]; return +a[1] + (dt - a[0]) / Math.max(1e-6, b[0] - a[0]) * (+b[1] - a[1]); } return +bp[bp.length - 1][1]; };
// -> [{ keyOffset, startS, endS, bend: [[dt, cents]…] }] — ONE entry, the bend as it was, when it never passes the range
function rekeyChain(bend, lenS, rangeCents) {
    const R = Math.max(1, +rangeCents - REKEY_EDGE_C), L = Math.max(0.05, +lenS || 0);
    if (!bend || !bend.length || bend.every((p) => Math.abs(+p[1]) <= R)) return [{ keyOffset: 0, startS: 0, endS: L, bend: bend || [] }];
    const inside = (raw, k) => Math.abs(raw - k * 100) <= R + 1e-9;
    const times = []; for (let t = 0; t < L - 1e-9; t += REKEY_STEP_S) times.push(r3(t)); times.push(r3(L));
    const segs = []; let cur = null, prevT = null, prevRaw = null;
    // the key for a cents value moving in a direction: among the semitones that hold it, the one with the most room ahead
    const open = (t, raw, dir) => { let k = Math.round(raw / 100), best = -Infinity; for (let j = Math.floor((raw - R) / 100); j <= Math.ceil((raw + R) / 100); j++) { if (!inside(raw, j)) continue; const room = R - dir * (raw - j * 100); if (room > best) { best = room; k = j; } } cur = { keyOffset: k, startS: t, endS: L, bend: [] }; };
    times.forEach((t, i) => {
        const raw = bendAt(bend, t);
        if (cur && !inside(raw, cur.keyOffset)) {
            // THE SEAM: where the line crossed the edge between the last sample and this one — the old key ends ON the edge there,
            // the new key begins there at the same cents (the sounding pitch continuous; the tick holds a line's last value)
            const k = cur.keyOffset, edge = raw - k * 100 > 0 ? k * 100 + R : k * 100 - R;
            const f = Math.max(0, Math.min(1, (edge - prevRaw) / ((raw - prevRaw) || 1e-9))), tx = r3(prevT + f * (t - prevT));
            if (tx > cur.startS) cur.bend.push([r3(tx - cur.startS), r1(edge - k * 100)]);
            cur.endS = tx; segs.push(cur); cur = null;
            open(tx, edge, Math.sign(raw - prevRaw) || 1);
            cur.bend.push([0, r1(edge - cur.keyOffset * 100)]);
        }
        if (!cur) {
            const nxt = i + 1 < times.length ? bendAt(bend, times[i + 1]) : raw;
            open(t, raw, Math.sign(nxt - raw) || (prevRaw != null ? Math.sign(raw - prevRaw) : 0) || 1);
        }
        if (t > cur.startS || !cur.bend.length) cur.bend.push([r3(t - cur.startS), r1(raw - cur.keyOffset * 100)]);
        prevT = t; prevRaw = raw;
    });
    segs.push(cur);
    return segs.filter((sg) => sg.endS > sg.startS);
}
// a chain's level across a segment [a, b] of the note (fractions): a two-node curve and a told level (simLevel) are re-based; anything else is copied whole
function rebaseLevel(target, base, a, b) {
    const n = base.nodes;
    if (Array.isArray(n) && n.length === 2) { const y = (x) => +n[0].y + (+n[1].y - +n[0].y) * x; target.nodes = [Object.assign({}, n[0], { pos: 0, y: Math.round(y(a) * 100) / 100 }), Object.assign({}, n[1], { pos: 1, y: Math.round(y(b) * 100) / 100 })]; }
    const s = base.properties && base.properties.simLevel;
    if (Array.isArray(s) && s.length === 2 && s[0].length === 2) { const m = (x) => +s[0][1] + (+s[1][1] - +s[0][1]) * x; target.properties.simLevel = [[0, Math.round(m(a) * 100) / 100], [1, Math.round(m(b) * 100) / 100]]; }
}
// a chain's first note back to one note: its segments gone, its end and its key restored (a GO again, or ∿ off)
function dissolve(o, ctx) {
    const s = o && o.properties && o.properties.sine; if (!s || (!Array.isArray(s.chain) && !s.keyOffset)) return [];
    const gone = [];
    if (!Array.isArray(s.chain)) s.chain = [];   // ONE note at a moved key (a bend that fits a single neighbouring key): no segments, the key to restore
    s.chain.forEach((id) => { const x = ctx.objects.find((q) => q.id === id); if (!x) return; gone.push(x); if (ctx.removeNote) ctx.removeNote(x); else ctx.objects.splice(ctx.objects.indexOf(x), 1); });
    const z = ctx.objects.find((x) => x.type === 'zone' && x.midiModel === 'elecSine' && x.id === s.brick);
    if (z && z.properties && z.properties.sine && Array.isArray(z.properties.sine.notes)) z.properties.sine.notes = z.properties.sine.notes.filter((id) => !s.chain.includes(id));
    if (s.was && s.was.endSeconds != null) o.endSeconds = s.was.endSeconds;
    if (s.keyOffset) o.sonifyNote = o.sonifyNote - s.keyOffset;
    delete s.chain; delete s.segment; delete s.keyOffset;
    return gone;
}
const shortOf = (tracks, l) => { const t = tracks[l]; return t ? (t.short || t.label || t.id) : 'lane ' + l; };
// a pitch brought into [lo, hi] by octaves — or null
const fit = (p, lo, hi) => { let x = +p, n = 0; while (x < lo && n < 9) { x += 12; n++; } while (x > hi && n > -9) { x -= 12; n--; } return x >= lo && x <= hi ? x : null; };

// ---- a take, read as it is stored (bank/panel_snapshots.json, panels.strikes[name].state — the strikes drawer's own state()) ----
// -> the chord as it sounds: [{ lane, midi }] in the take's voice order — each voice on its player (its pitch folded as the take
// says, or its stand-in) and on every doubling; a drawer row past the lanes is a second seat, on its instrument's lane
function takeChord(state, tracks) {
    const laneOf = (row) => { if (!Number.isInteger(row) || row < 0) return -1; if (row < tracks.length) return row; const k = SEATS[row - tracks.length]; return k ? tracks.findIndex((t) => t.instKey === k) : -1; };
    const out = [];
    ((state && state.voices) || []).slice().sort((a, b) => (a.i || 0) - (b.i || 0)).forEach((v) => {
        const one = (r) => { const l = laneOf(r.lane); if (l < 0 || r.skip) return; const m = r.standIn != null ? +r.standIn : +v.pitch + 12 * (+r.fold || 0); if (Number.isFinite(m)) out.push({ lane: l, midi: Math.round(m) }); };
        one(v); (v.also || []).forEach(one);
    });
    return out;
}

// what a note was before its first take, kept ON the note — harmony_sel.js's `remember`, the same shape, so its `back` restores it
function remember(o) {
    if (o.hq && o.hq.was) return;
    o.hq = Object.assign(o.hq || {}, { was: { sonifyNote: o.sonifyNote, morphBend: copy(o.morphBend), sonifyMode: o.sonifyMode != null ? o.sonifyMode : null,
        velAbs: o.velAbs != null ? o.velAbs : null, cc7Abs: copy(o.cc7Abs), performanceNotes: o.performanceNotes != null ? o.performanceNotes : null } });
}
// a take's chord onto notes — the harmony strip's rule (harmony_sel.js apply): in time order, each note the next of ITS lane's pitches,
// round robin; a lane the take does not hold is left as it is
function applyChord(notes, chord, name) {
    const by = {}, next = {}, done = [], left = new Set();
    chord.forEach((n) => { (by[n.lane] = by[n.lane] || []).push(n); });
    notes.slice().sort((a, b) => a.startSeconds - b.startSeconds || a.layer - b.layer).forEach((o) => {
        const cand = by[o.layer];
        if (!cand || !cand.length) { left.add(o.layer); return; }
        const k = next[o.layer] || 0, n = cand[k % cand.length]; next[o.layer] = k + 1;
        remember(o);
        o.sonifyNote = Math.round(n.midi);
        Object.assign(o.hq, { take: name, midi: o.sonifyNote, cents: 0, dealt: { midi: o.sonifyNote, partial: null } });
        o.performanceNotes = (String(o.performanceNotes || '').replace(/ · ← take "[^"]*"/g, '') + ' · ← take "' + name + '"').replace(/^ · /, '');
        done.push(o);
    });
    return { done, left: Array.from(left) };
}

// a zone as the composer's createZone makes one (tools/build_first_object.js lists the same fields)
function sineZone(id, layer, start, end, elec, noteId) {
    return { id, type: 'zone', layer, startTime: r3(start), endTime: r3(end), player: '', instrument: '', zoneFunction: 'elec', midiModel: 'elecSine',
        ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
        responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color: SINE.color, opacity: 0.35, yOffset: SINE.yOffset, zoneHeight: 0.2,
        performanceNotes: '', properties: { sine: { note: noteId } }, elec };
}

// ---- THE GO, on notes that already hold their pitches ----
// ctx: { objects, instruments, tracks, cfg, seed, newId }      cfg = SineSim.config(the piece's file) · newId() -> a fresh zone id
// -> { done: [{ note, zone, draw, isNew }], skipped: [{ note, why }], lines: [what happened, a line a note] }
function convert(notes, ctx) {
    const T = ctx.tracks, I = ctx.instruments, cfg = ctx.cfg, seed = Math.max(1, Math.round(+ctx.seed || 1));
    const done = [], skipped = [], lines = [], seen = new Set();   // seen: the phrase bricks already re-pitched in this GO
    notes.filter((o) => isNote(o, T.length)).sort((a, b) => a.startSeconds - b.startSeconds || a.layer - b.layer).forEach((o, i) => {
        const instKey = (T[o.layer] || {}).instKey, inst = I[instKey], L = cfg.lanes[instKey];
        const skip = (why) => { skipped.push({ note: o, why }); lines.push(shortOf(T, o.layer) + ' ' + o.startSeconds.toFixed(2) + ' s — left alone: ' + why); };
        if (!inst || !L) return skip('this lane has no part in the sines (bank/sine_behaviours.json)');
        const tech = (inst.techniques || []).find((t) => t.key === L.voice);
        if (!tech) return skip('its voice "' + L.voice + '" is not one of this instrument\'s');
        if (o.properties && o.properties.sine && o.properties.sine.segment && o.properties.sine.segment.of !== o.id) return skip('a re-keyed segment of ' + o.properties.sine.segment.of + ' — the GO works on the chain\'s first note');
        dissolve(o, ctx);   // a GO again on a re-keyed chain: one note again first
        const lo = tech.rangeLow != null ? tech.rangeLow : inst.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : inst.rangeHigh;
        const was = (o.properties && o.properties.sine && o.properties.sine.was) || { technique: o.technique != null ? o.technique : null, morphBend: copy(o.morphBend),
            sonifyMode: o.sonifyMode != null ? o.sonifyMode : null, velAbs: o.velAbs != null ? o.velAbs : null, cc7Abs: copy(o.cc7Abs), endSeconds: o.endSeconds };
        const pitch = fit(Math.round(+o.sonifyNote), lo != null ? lo : 0, hi != null ? hi : 127);
        if (pitch == null) return skip(pn(o.sonifyNote) + ' has no octave inside ' + L.voice + ' (' + pn(lo) + ' … ' + pn(hi) + ')');
        const len = Math.max(0.05, o.endSeconds - o.startSeconds), span = [o.startSeconds, o.endSeconds];
        // the draw's cap is the PLAYER's range (the recipe's playerBendSt); the SAMPLER's (bendRangeSt, measured) is met by the re-key below
        const limit = 100 * (inst.playerBendSt != null ? inst.playerBendSt : 1);
        const rangeC = 100 * (inst.bendRangeSt != null && inst.bendRangeSt > 0 ? inst.bendRangeSt : 1);
        const rnd = SineSim.mulberry32((Math.imul(seed, 2654435761) + Math.imul(o.layer + 1, 40503) + Math.imul(i + 1, 7919)) >>> 0);
        const d = SineSim.draw(cfg, instKey, pitch, len, rnd, { limitCents: limit });
        remember(o);
        // the note
        o.sonifyNote = pitch; o.technique = L.voice;
        if (d.who === 'player') {
            o.morphBend = d.bend.map((p) => [Math.min(p[0], r3(len)), p[1]]);
            if (was.sonifyMode === 'plain' || o.sonifyMode === 'plain') {   // a bent note is DRAWN — its own curve channel; a struck note keeps its sound (velAbs · cc7Abs)
                delete o.sonifyMode;
                if (o.velAbs == null && o.cc7Abs == null) { o.velAbs = o.recVel != null ? Math.round(+o.recVel) : 100; o.cc7Abs = { lo: 127, hi: 127 }; }
            }
        }   // else the player HOLDS (the bowed crotales): the note's sound is left exactly as it is — the brick below carries the gliss
        // its brick: the one it has, or a new one
        const have = o.properties && o.properties.sine && ctx.objects.find((z) => z.type === 'zone' && z.midiModel === 'elecSine' && z.id === o.properties.sine.brick);
        const gliss = d.gliss ? { kind: d.gliss.kind, from: d.gliss.from, to: d.gliss.to } : { kind: 'none', from: 0, to: 0 };
        let zone = have, isNew = false;
        // PLAN 1.8 · 16.2 c: A PHRASE'S BRICK — one sine over several notes (the brick names them: properties.sine.notes). The GO on one of
        // its notes RE-PITCHES that brick and leaves its span alone; the gliss is the first of its notes' in this GO (the engine begins it
        // again at each entry), and how long one glide lasts (gliss.overS) is kept
        const shared = !!(zone && zone.properties && zone.properties.sine && Array.isArray(zone.properties.sine.notes) && zone.properties.sine.notes.length > 1);
        if (zone && zone.elec && zone.elec.gliss && zone.elec.gliss.overS != null && gliss.kind !== 'none') gliss.overS = zone.elec.gliss.overS;
        if (shared) { if (!seen.has(zone.id)) { seen.add(zone.id); zone.elec = Object.assign({}, zone.elec, { midi: d.sineMidi, gliss }); } }
        else if (zone) { zone.layer = o.layer; zone.startTime = r3(span[0]); zone.endTime = r3(span[1]); zone.elec = Object.assign({}, zone.elec, { midi: d.sineMidi, gliss }); }
        else {
            const elec = { midi: d.sineMidi, gliss, level: { mode: 'flat', mark: cfg.level || 'mf' }, label: '' };
            if (cfg.track && cfg.track.on) elec.track = { on: true };   // PLAN 1.8 · 16.1: a new brick is a WINDOW where the piece says so (bank/sine_behaviours.json `track`)
            zone = sineZone(ctx.newId(), o.layer, span[0], span[1], elec, o.id); ctx.objects.push(zone); isNew = true;
        }
        o.properties = Object.assign({}, o.properties, { sine: { brick: zone.id, who: d.who, kind: d.kind, cents: d.cents, seed, take: (o.hq && o.hq.take) || ctx.take || '', was } });
        // THE RE-KEY: a player's bend past the sampler's range → the note becomes a chain of notes, the first of them this one
        const segs = d.who === 'player' ? rekeyChain(o.morphBend, len, rangeC) : [];
        const segments = [];
        // ONE key holds the whole bend, but not the written one (0 → 160 c: the key a semitone up, the wheel from full-flat — #1's
        // own case): the note stays one note, at the moved key, its bend re-based (§268 — the first build left it at the written
        // key and the sampler would have clipped it at its edge)
        if (segs.length === 1 && segs[0].keyOffset) { o.sonifyNote = pitch + segs[0].keyOffset; o.morphBend = segs[0].bend; o.properties.sine.keyOffset = segs[0].keyOffset; }
        if (segs.length > 1) {
            const base = copy(o), n = segs.length, newNoteId = ctx.newNoteId || (() => String(ctx.newId()).replace(/^zn/, 'wc'));
            segs.forEach((sg, k) => {
                const x = k === 0 ? o : copy(base);
                if (k > 0) { x.id = newNoteId(); delete x._els; }
                x.startSeconds = r3(span[0] + sg.startS); x.endSeconds = r3(span[0] + sg.endS + (k < n - 1 ? REKEY_OVERLAP_S : 0));
                x.sonifyNote = pitch + sg.keyOffset; x.morphBend = sg.bend;
                rebaseLevel(x, base, sg.startS / len, sg.endS / len);
                x.properties = Object.assign({}, x.properties, { sine: Object.assign({}, base.properties.sine, { keyOffset: sg.keyOffset, segment: { of: o.id, k: k + 1, n } }) });
                if (k > 0) { ctx.objects.push(x); segments.push(x); }
            });
            o.properties.sine.chain = segments.map((x) => x.id);
            if (shared || (zone.properties && zone.properties.sine && Array.isArray(zone.properties.sine.notes))) {   // a phrase's brick names its notes: the segments after their first
                const list = zone.properties.sine.notes, at = list.indexOf(o.id);
                list.splice(at < 0 ? list.length : at + 1, 0, ...segments.map((x) => x.id));
            }
        }
        done.push({ note: o, zone, draw: d, isNew, segments });
        lines.push(shortOf(T, o.layer) + ' ' + pn(pitch) + (d.sineMidi !== pitch ? ' (the sine ' + pn(d.sineMidi) + ')' : '') + ' · ' + d.say + ' · beats ' + d.beatsFrom + ' → ' + d.beatsTo + ' /s'
            + (segments.length || (segs.length === 1 && segs[0].keyOffset) ? ' · RE-KEYED ×' + segs.length + ' (the sampler ±' + (rangeC / 100) + ' st; keys ' + segs.map((s) => (s.keyOffset >= 0 ? '+' : '') + s.keyOffset).join(' ') + ')' : ''));
    });
    return { done, skipped, lines };
}

// ---- and back: the note's voice, bend and sound as before the GO, its brick gone (the pitch stays — the take's) ----
// ctx: { objects, removeZone? }
function unconvert(notes, ctx) {
    const undone = [], firsts = new Map();
    // a re-keyed segment stands for its chain's first note; a chain is undone once
    notes.forEach((o) => { const s = o && o.properties && o.properties.sine; if (!s) return; const f = s.segment && s.segment.of !== o.id ? ctx.objects.find((x) => x.id === s.segment.of) : o; if (f && f.properties && f.properties.sine && !firsts.has(f.id)) firsts.set(f.id, f); });
    firsts.forEach((o) => {
        const s = o.properties.sine;
        dissolve(o, ctx);
        const w = s.was || {};
        if (w.technique != null) o.technique = w.technique; else delete o.technique;
        if (w.morphBend) o.morphBend = copy(w.morphBend); else delete o.morphBend;
        if (w.sonifyMode != null) o.sonifyMode = w.sonifyMode; else delete o.sonifyMode;
        if (w.velAbs != null) o.velAbs = w.velAbs; else delete o.velAbs;
        if (w.cc7Abs) o.cc7Abs = copy(w.cc7Abs); else delete o.cc7Abs;
        const z = ctx.objects.find((x) => x.type === 'zone' && x.midiModel === 'elecSine' && x.id === s.brick);
        if (z) { if (ctx.removeZone) ctx.removeZone(z); else ctx.objects.splice(ctx.objects.indexOf(z), 1); }
        const p = Object.assign({}, o.properties); delete p.sine; o.properties = p;
        undone.push(o);
    });
    return undone;
}

// =====================================================================================================================
// THE PAGE — the harmony strip's three controls. Composer, TRACKS, META_LAYER, INSTRUMENTS are script-level consts of
// composer.html, read as free identifiers.
function install(root) {
    if (typeof document === 'undefined') return;
    const C_ = () => (typeof Composer !== 'undefined' ? Composer : (root.Composer || null));
    const T_ = () => (typeof TRACKS !== 'undefined' ? TRACKS : (root.TRACKS || []));
    const I_ = () => (typeof INSTRUMENTS !== 'undefined' ? INSTRUMENTS : (root.INSTRUMENTS || {}));
    const LANES = () => (typeof META_LAYER !== 'undefined' ? META_LAYER : T_().length);
    const BTN = 'font:inherit;padding:1px 7px;border:1px solid #b9b4a6;border-radius:3px;background:#fbfaf6;color:#333;cursor:pointer';
    let cfg = null;
    const loadCfg = () => (cfg ? Promise.resolve(cfg) : fetch('/bank/sine_behaviours.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
        .then((f) => { cfg = SineSim.config(f); if (!f) say('bank/sine_behaviours.json was not read — no lane has a part in the sines', true); return cfg; }));
    const say = (msg, bad) => { const H = root.HarmonySel; if (H && H.say) H.say(msg, !!bad); else { const C = C_(); if (C && C.saveStatus) C.saveStatus.textContent = msg; } };
    const selected = () => { const C = C_(); return C ? (C.selectedObjects || []).filter((o) => isNote(o, LANES()) && C.objects.includes(o)) : []; };
    const redraw = (o) => { const C = C_(); try { if (o.type === 'waveCurve') C.renderWaveCurve(o); else C.renderZone(o); } catch (e) { console.warn('[sine_go] render:', e); } };
    const wrap = () => { const C = C_(); if (typeof C.curveDirty === 'function') C.curveDirty(); C.markDirty(); const H = root.HarmonySel; if (H && H.refresh) H.refresh(); };

    const api = this;
    api.go = async function (seedArg) {
        const C = C_(); if (!C) return null;
        const notes = selected();
        if (!notes.length) { say('∿ sines: select the played notes first — then take ▾ for their pitches, then ∿ sines', true); return null; }
        const c = await loadCfg(), box = document.getElementById('sgSeed'), seed = Math.max(1, Math.round(+seedArg || (box && +box.value) || 1));
        C.pushUndoState();
        const removeNote = (x) => {   // a re-keyed segment taken off the page (a GO again dissolves the chain first)
            if (x._els) { if (x._els.group) x._els.group.remove(); if (x._els.groups) x._els.groups.forEach((g) => g.remove()); }
            if (C.elementCache && C.elementCache.delete) C.elementCache.delete(x.id);
            const i = C.objects.indexOf(x); if (i >= 0) C.objects.splice(i, 1);
        };
        const r = api.convert(notes, { objects: C.objects, instruments: I_(), tracks: T_(), cfg: c, seed, newId: () => C.generateId('zn'), newNoteId: () => C.generateId('wc'), removeNote });
        r.done.forEach((d) => { redraw(d.note); (d.segments || []).forEach(redraw); redraw(d.zone); });
        wrap();
        const players = new Set(r.done.map((d) => d.note.layer)).size;
        say(r.done.length ? '∿ ' + r.done.length + (r.done.length === 1 ? ' note' : ' notes') + ' → ' + r.done.length + (r.done.length === 1 ? ' sine' : ' sines') + ' on ' + players + (players === 1 ? ' player' : ' players') + ' · seed ' + seed
            + (r.skipped.length ? ' · ' + r.skipped.length + ' left alone' : '') + ' · ' + r.lines.slice(0, 6).join(' | ') + (r.lines.length > 6 ? ' | …' : '')
            : '∿ sines: nothing made — ' + (r.lines[0] || 'no note of a lane that has a part'), !r.done.length);
        console.log('[sine_go] seed ' + seed + '\n  ' + r.lines.join('\n  '));
        return r;
    };
    api.off = function (quiet) {
        const C = C_(); if (!C) return [];
        const notes = selected().filter((o) => o.properties && o.properties.sine);
        if (!notes.length) { if (!quiet) say('∿ off: none of the selected notes has a sine', true); return []; }
        C.pushUndoState();
        const removeObj = (z) => {   // a brick, or a re-keyed segment
            if (z._els) { if (z._els.group) z._els.group.remove(); if (z._els.groups) z._els.groups.forEach((g) => g.remove()); }
            if (C.elementCache && C.elementCache.delete) C.elementCache.delete(z.id);
            const i = C.objects.indexOf(z); if (i >= 0) C.objects.splice(i, 1);
        };
        const u = api.unconvert(notes, { objects: C.objects, removeZone: removeObj, removeNote: removeObj });
        u.forEach(redraw);
        wrap();
        if (!quiet) say('∿ off: ' + u.length + (u.length === 1 ? ' note' : ' notes') + ' back to the voice and the sound before the sines — the bricks gone, the pitches kept');
        return u;
    };

    const controls = (el) => {
        if (!el || el.querySelector('#sgBox')) return;
        const box = document.createElement('span'); box.id = 'sgBox';
        box.style.cssText = 'display:inline-flex;gap:5px;align-items:center;border-left:1px solid #cfcabc;padding-left:8px';
        box.title = 'PLAN 1.5: the selected notes become SINE TONES with a simulated player beating against them — each note its lane\'s senza-vibrato voice, a sine brick over it, a bend drawn for the player (the bowed crotales hold: their sine glisses). First take ▾ for the pitches, then ∿ sines.';
        box.innerHTML = '<button type="button" id="sgGo" style="' + BTN + ';border-color:#1E88E5;color:#0d5ea8" title="THE GO: a sine brick and a drawn bend for every selected note — again with another seed draws other behaviours and keeps each brick\'s level">∿ sines</button>'
            + '<label style="color:#6a6a60">seed <input id="sgSeed" type="number" min="1" step="1" value="1" style="width:44px;font:inherit;padding:0 3px;border:1px solid #b9b4a6;border-radius:3px;background:#fff;color:#333" title="the seed of the behaviours — the same seed on the same notes draws the same; ENTER is the GO"></label>'
            + '<button type="button" id="sgOff" style="' + BTN + '" title="take the sines off the selected notes: the bricks gone, the voice and the sound as before — the pitches stay">∿ off</button>';
        const status = el.querySelector('#hqStatus');
        if (status) el.insertBefore(box, status); else el.appendChild(box);
        box.querySelector('#sgGo').addEventListener('click', () => { api.go(); });
        box.querySelector('#sgSeed').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); api.go(); } });
        box.querySelector('#sgOff').addEventListener('click', () => { api.off(false); });
    };
    const hook = () => {
        const H = root.HarmonySel;
        if (!H || H._sgHooked) return !!H;
        H._sgHooked = true;
        const ensure = H.ensure;
        H.ensure = function () { const el = ensure.apply(this, arguments); controls(el); return el; };
        if (H.el) controls(H.el);
        const back = H.back;   // the strip's `back` takes the sines off too, then restores the pitches as it always did
        H.back = function () { try { api.off(true); } catch (e) { console.warn('[sine_go] off:', e); } return back.apply(this, arguments); };
        return true;
    };
    if (!hook()) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(hook, 0)); else setTimeout(hook, 0); }
}

return { isNote, fit, takeChord, applyChord, remember, sineZone, convert, unconvert, install, pn, rekeyChain, bendAt, REKEY_OVERLAP_S, REKEY_STEP_S, REKEY_EDGE_C };
}));
