#!/usr/bin/env node
// build_beating_section.js — THE BEATING SECTION as a save the composer score opens (PLAN.md § 1.8, 16.2; DEC-58 · 58b · 58c;
// RUNNING_LOG §255 … §260). Running order step 16.
//
//   node tools/build_beating_section.js [--score beating-section] [--seed 1] [--replace] [--dry] [--unsaved-ok]
//
// What it writes, and nothing else — ONE SECTION, from a seed, every number from bank/beating_section.json (HIS data; this tool never
// writes it and refuses a file that does not add up):
//   · THE START — the score named there (sine-demo, his word: "I'll keep that as the start") COPIED as it is up to start.toS: its
//     notes, its sine bricks, its curve; every one of its bricks made a WINDOW (Follow on). That score is read, never written.
//   · THE PHRASES — from there to lengthS, per player: a PHRASE (its length drawn inside a band), a rest (drawn inside a band), a
//     phrase … — the bands dealt as exhaustive round robins, none twice before all have come; a phrase cut by the end is kept only
//     if phrase.minS of it is left.
//   · THE NOTES — a phrase's notes by THE BREATH MODEL (score/public/beating_calc.js — the module, not a copy): dealBreaths cuts
//     the phrase at marks about breath.targetShare of the player's ceiling apart (± jitter, never past the ceiling at the written
//     dynamic); breathSpans puts a wind's gap before each mark, none for a bow. The model has no row for a bowed crotale: that
//     player's ceiling, usual length and gap are in the data file, and a span the model left longer than that ceiling is cut again.
//     Each note: the take's pitch for its player (SineGo.takeChord · applyChord), then THE GO (SineGo.convert — the lane's
//     senza-vibrato voice, a bend drawn for the player; the crotales hold and their SINE glisses).
//   · ONE SINE BRICK A PHRASE — over the whole phrase, a WINDOW (elec.track.on): the engine arms it, the sine enters with each
//     breath's first sound and holds through the gaps (electronics/sc/track.scd). Its notes know it and it knows them
//     (properties.sine); the crotales' brick says how long ONE glide lasts (gliss.overS) — the engine begins it again at each bowing.
//   · THE TWO CRESCENDO PHRASES — his test of the tracker: crescendos.n phrases, chosen by the seed among the players who bend, on
//     different players, whose notes are SHAPED from → to across the whole phrase (docs/DYNAMICS_LAW.md: struck at mf, the fader
//     between the two written dynamics' table values) and SAY their level to the simulated ear (properties.simLevel) — the sine
//     under them rises with them, as far as the tracker's cap.
//   · THE KEEP RULE — a seed is kept if, in the rolled part, the players sounding (read every second) reach density.reach once and
//     average ≤ density.meanMax; else the next seed, up to density.tries. --dry prints the roll and writes nothing.
//   · THE SHEET docs/BEATING_SECTION.md.
// It refuses to write over a score it did not make, over a working copy with unsaved changes, and a piece-… name. GENERATED — re-run
// it rather than hand-edit: another seed is another section; a number changed in bank/beating_section.json is heard after --replace
// and File ▾ → Reload — no engine restart. `node tools/beating_check.js` checks what it wrote (it calls make() here for the same seed).
// THE SORTING: this tool knows the piece (its lanes, its recipes, the take, the behaviours, the breath model) — the piece's. The
// window, the gate, the follow are the engine's (electronics/sc/track.scd · electronics/score/le_sine.js, 16.1).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const K = require('./audition_kit.js');
const ROOT = K.ROOT, TOOL = 'tools/build_beating_section.js';
const SineSim = require(path.join(ROOT, 'score', 'public', 'sine_sim.js')), SineGo = require(path.join(ROOT, 'score', 'public', 'sine_go.js'));
const BC = require(path.join(ROOT, 'score', 'public', 'beating_calc.js'));
const DynTable = require(path.join(ROOT, 'score', 'public', 'dyn_table.js')), TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const r3 = (x) => Math.round(x * 1000) / 1000, r2 = (x) => Math.round(x * 100) / 100;
const U = (rnd, lo, hi) => lo + rnd() * (hi - lo);
const shuffled = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// none twice before all have come; the next lap in another order (build_drone_section.js's)
function Robin(items, rnd) { let order = [], at = 0; return { next() { if (at >= order.length) { order = shuffled(items, rnd); at = 0; } return order[at++]; } }; }

// ---- the stack and the data file, read and checked --------------------------------------------------------------------------
function load() {
    const CFG = K.readJson(path.join(ROOT, 'bank', 'beating_section.json'));
    const fail = (m) => { throw new Error('bank/beating_section.json: ' + m); };
    const range = (v, what) => { if (!Array.isArray(v) || v.length !== 2 || !(+v[0] <= +v[1])) fail(what + ' must be [lo, hi]'); return [+v[0], +v[1]]; };
    const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
    const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
    const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
    const REMAP = K.readJson(path.join(ROOT, 'bank', 'velocity_remap.json'));
    const cfg = SineSim.config(K.readJson(path.join(ROOT, 'bank', 'sine_behaviours.json')));
    const LEN = +CFG.lengthS, START = +(CFG.start && CFG.start.toS);
    if (!(LEN > 20)) fail('lengthS');
    if (!(START >= 0 && START < LEN)) fail('start.toS must be inside the section');
    if (!CFG.start || !CFG.start.from) fail('start.from (the score the section begins with)');
    const P = CFG.phrase || {}, LB = (P.lengthBands || []).map((b, i) => range(b, 'phrase.lengthBands[' + i + ']')), RB = (P.restBands || []).map((b, i) => range(b, 'phrase.restBands[' + i + ']'));
    if (!LB.length || !RB.length) fail('phrase.lengthBands and phrase.restBands are needed');
    const FIRST = range(P.firstInS || [0, 0], 'phrase.firstInS'), MIN = +(P.minS != null ? P.minS : 8);
    const B = CFG.breath || {}, JIT = +(B.jitter != null ? B.jitter : 0.35), SHARE = +(B.targetShare != null ? B.targetShare : 0.8);
    if (!(SHARE > 0.2 && SHARE <= 1)) fail('breath.targetShare must be 0.2 … 1');
    if (!MARKS.includes(CFG.level)) fail('level must be a mark');
    const SINE_LEVEL = CFG.sineLevel != null ? CFG.sineLevel : CFG.level;
    if (!MARKS.includes(SINE_LEVEL)) fail('sineLevel must be a mark');
    const C = CFG.crescendos || { n: 0 };
    if (+C.n > 0 && !(MARKS.includes(C.from) && MARKS.includes(C.to))) fail('crescendos.from and .to must be marks');
    const D = CFG.density || {};
    const snaps = K.readJson(path.join(ROOT, 'bank', 'panel_snapshots.json')), take = snaps.panels && snaps.panels.strikes && snaps.panels.strikes[CFG.take];
    if (!take) fail('the take "' + CFG.take + '" is not in bank/panel_snapshots.json (the Strikes drawer\'s takes)');
    const chord = SineGo.takeChord(take.state, TRACKS);
    const PLAYERS = (CFG.players || []).map((p) => {
        const lane = TRACKS.findIndex((t) => t.instKey === p.lane), I = INSTRUMENTS[p.lane], L = cfg.lanes[p.lane];
        if (lane < 0 || !I) fail('player ' + p.lane + ': no lane has that recipe key');
        if (!L) fail('player ' + p.lane + ' has no part in the sines (bank/sine_behaviours.json lanes)');
        const tech = (I.techniques || []).find((t) => t.key === L.voice);
        if (!tech) fail(p.lane + ': its voice ' + L.voice + ' is not one of the instrument\'s techniques');
        const cand = chord.filter((n) => n.lane === lane);
        if (!cand.length) fail('the take "' + CFG.take + '" holds no pitch for ' + p.lane);
        const lo = tech.rangeLow != null ? tech.rangeLow : I.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : I.rangeHigh;
        if (p.sineLevel != null && !MARKS.includes(p.sineLevel)) fail('player ' + p.lane + ': sineLevel must be a mark');
        // bends: the INSTRUMENT can bend (a crescendo phrase is drawn among these) — not `who`: the cello's sine moves in the simulation
        // (bank/sine_behaviours.json, its row) and the cellist bends in concert; the crescendo candidates stay the same, the seed's picks hold
        return { inst: p.lane, label: p.label || p.lane, lane, who: L.who, bends: +I.playerBendSt > 0, voice: L.voice, range: [lo, hi], ordinary: I.ordinary,
            ceilingS: p.ceilingS, targetS: p.targetS, gapS: p.gapS, sineLevel: p.sineLevel != null ? p.sineLevel : null };
    });
    if (!PLAYERS.length) fail('players');
    const REDO = (CFG.start.redo || []).map((k) => { const p = PLAYERS.find((q) => q.inst === k); if (!p) fail('start.redo names ' + k + ', not one of players[]'); return p; });
    return { CFG, INSTRUMENTS, TRACKS, REMAP, cfg, chord, PLAYERS, REDO, LEN, START, LB, RB, FIRST, MIN, JIT, SHARE, SINE_LEVEL, C, D };
}

// ---- a phrase cut into notes by the breath model -------------------------------------------------------------------------------
// -> { spans: [[from, to] …] inside the phrase (seconds from its start), ceil, gapS, target }
function breathsOf(S, p, lengthS, level01, seed) {
    const c = BC.ceilingFor(p.inst, level01), ceil = p.ceilingS > 0 ? Math.min(+p.ceilingS, c.seconds) : c.seconds, gapS = p.gapS != null ? +p.gapS : c.gapS;
    const target = Math.min(ceil, p.targetS > 0 ? +p.targetS : ceil * S.SHARE);
    let marks = BC.dealBreaths({ length: lengthS, inst: p.inst, level: level01, target, jitter: S.JIT, seed });
    // a span longer than THIS player's ceiling — the model's own may be longer (it has no row for a bowed crotale) — is cut again, near its middle
    const rnd = K.mulberry32((seed ^ 0x5bd1e995) >>> 0);
    for (let guard = 0; guard < 50; guard++) {
        const edges = [0].concat(marks, [lengthS]), i = edges.findIndex((e, k) => k > 0 && e - edges[k - 1] > ceil + 1e-6);
        if (i < 0) break;
        marks = marks.concat([r3(edges[i - 1] + (edges[i] - edges[i - 1]) * U(rnd, 0.42, 0.58))]).sort((a, b) => a - b);
    }
    return { spans: BC.breathSpans('designated', marks, lengthS, gapS), ceil, gapS, target };
}

// ---- THE ROLL — the phrases of one section, from a seed ---------------------------------------------------------------------
function roll(S, seed) {
    const rnd = K.mulberry32(seed), level = MARKS.indexOf(S.CFG.level);
    const lenRobin = Robin(S.LB.map((b, i) => i), rnd), restRobin = Robin(S.RB.map((b, i) => i), rnd);
    const phrases = [];
    for (const p of shuffled(S.PLAYERS, rnd)) {
        let t = S.START + U(rnd, S.FIRST[0], S.FIRST[1]), n = 0;
        for (;;) {
            const li = lenRobin.next();
            let len = U(rnd, S.LB[li][0], S.LB[li][1]), cut = false;
            if (t + len > S.LEN) { len = S.LEN - t; cut = true; }
            if (len < S.MIN) break;
            const ri = restRobin.next(), rest = U(rnd, S.RB[ri][0], S.RB[ri][1]);
            phrases.push({ player: p, n: ++n, start: r2(t), end: r2(t + len), lenBand: li, restBand: ri, restAfter: r2(rest), cut });
            t = r2(t + len) + rest;
            if (cut) break;
        }
    }
    phrases.sort((a, b) => a.start - b.start || a.player.lane - b.player.lane).forEach((ph, i) => { ph.i = i + 1; });
    // THE CRESCENDO PHRASES: among the players who bend, on different players, by the seed
    const want = Math.max(0, Math.round(+S.C.n || 0)), took = new Set();
    for (const ph of shuffled(phrases.filter((ph) => ph.player.bends && ph.end - ph.start >= 12), rnd)) {
        if (took.size >= want) break;
        if (took.has(ph.player.inst)) continue;
        took.add(ph.player.inst); ph.cresc = { from: S.C.from, to: S.C.to };
    }
    // THE NOTES, by the breath model — at the written dynamic (a crescendo phrase: at its louder end, the shorter breath)
    for (const ph of phrases) {
        const lv = ph.cresc ? Math.max(MARKS.indexOf(ph.cresc.from), MARKS.indexOf(ph.cresc.to)) : level;
        const b = breathsOf(S, ph.player, r3(ph.end - ph.start), lv / 7, (Math.imul(seed, 7919) + ph.i * 104729) | 0);
        ph.ceil = b.ceil; ph.gapS = b.gapS; ph.target = r2(b.target);
        ph.notes = b.spans.map((s) => [r3(ph.start + s[0]), r3(ph.start + s[1])]);
    }
    // THE DENSITY: players sounding, read every second of the rolled part
    const a = Math.floor(S.START), secs = Math.ceil(S.LEN) - a, dens = new Array(secs).fill(0);
    for (const ph of phrases) for (const [x, y] of ph.notes) for (let s = Math.max(0, Math.floor(x) - a); s < secs && s + a < y; s++) if (s + a + 0.5 >= x && s + a + 0.5 < y) dens[s]++;
    const max = Math.max(0, ...dens), mean = dens.reduce((x, y) => x + y, 0) / Math.max(1, secs);
    const line = []; for (let s = 0; s < secs; s += 5) line.push(String(Math.max(...dens.slice(s, s + 5))));
    const kept = max >= (+S.D.reach || 5) && mean <= (+S.D.meanMax || 3.5);
    return { seed, phrases, density: { max, mean: r2(mean), line: line.join(''), fromS: a }, kept, crescendos: phrases.filter((ph) => ph.cresc).length };
}
function rollKept(S, seed) {
    let rolled = null, tries = 0;
    for (let s = seed; s < seed + Math.max(1, +S.D.tries || 200); s++) { tries++; rolled = roll(S, s); if (rolled.kept) break; }
    return { rolled, tries };
}

// ---- THE OBJECTS — the start copied, the phrases made, the take, the GO --------------------------------------------------------
function make(S, rolled) {
    const base = K.readJson(path.join(ROOT, 'scores', S.CFG.start.from + '.json'));
    const startOf = (o) => (o.startTime != null ? o.startTime : o.startSeconds);
    // the start: its objects as they are, up to toS — every sine brick a window
    const objects = JSON.parse(JSON.stringify((base.objects || []).filter((o) => startOf(o) < S.START)));
    for (const o of objects) {
        o.properties = Object.assign({}, o.properties, { start: S.CFG.start.from });
        if (o.type === 'zone' && o.midiModel === 'elecSine' && o.elec) {
            o.elec.track = { on: true };
            const p = S.PLAYERS.find((q) => q.lane === o.layer);   // a player's own mark on its start bricks too (§263)
            if (p && p.sineLevel) o.elec.level = Object.assign({}, o.elec.level, { mode: 'flat', mark: p.sineLevel });
        }
    }
    let nextId = Math.max(+base.nextId || 1, ...objects.map((o) => (+String(o.id).replace(/^\D+/, '') || 0) + 1));
    // THE START'S REDO (§263): these players' notes of the start go through the GO again — the current behaviours, this seed; a
    // brick already there is re-pitched and keeps its span; a bend past the sampler's range is re-keyed (the chain's segments carry the start's tag)
    const redoNotes = objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && S.REDO.some((p) => p.lane === o.layer) && !(o.properties.sine && o.properties.sine.segment && o.properties.sine.segment.of !== o.id));
    const redo = redoNotes.length ? SineGo.convert(redoNotes, { objects, instruments: S.INSTRUMENTS, tracks: S.TRACKS, cfg: S.cfg, seed: rolled.seed, take: S.CFG.take, newId: () => 'zn-' + (nextId++), newNoteId: () => 'wc-' + (nextId++) }) : { done: [], skipped: [], lines: [] };
    if (redo.done.length !== redoNotes.length) throw new Error('the start\'s redo made ' + redo.done.length + ' of ' + redoNotes.length + ': ' + redo.skipped.map((s) => s.why).join(' · '));
    const level = MARKS.indexOf(S.CFG.level), notes = [], bricks = [];
    const velFor = (inst, midi, mark) => Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(S.REMAP, inst, midi, mark / 7))));
    for (const ph of rolled.phrases) {
        const p = ph.player, label = (S.CFG.labels && S.CFG.labels.phrase || 'P') + ph.n, m0 = ph.cresc ? MARKS.indexOf(ph.cresc.from) : level, m1 = ph.cresc ? MARKS.indexOf(ph.cresc.to) : level;
        const markAt = (t) => m0 + (m1 - m0) * (t - ph.start) / Math.max(1e-6, ph.end - ph.start);
        const mine = ph.notes.map(([a, b], k) => {
            const o = { id: 'wc-' + (nextId++), type: 'waveCurve', layer: p.lane, startSeconds: a, endSeconds: b,
                nodes: [{ pos: 0, y: r2(level / 7 * 10), smooth: 0.25 }, { pos: 1, y: r2(level / 7 * 10), smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
                color: ph.cresc ? (S.CFG.colors && S.CFG.colors.crescendo) || '#8E6BB0' : (S.CFG.colors && S.CFG.colors.note) || '#607D8B', fillMode: 'bottom', opacity: 0.55,
                performanceNotes: label + ' · ' + (k + 1) + ' of ' + ph.notes.length + (ph.cresc ? ' · ' + ph.cresc.from + ' → ' + ph.cresc.to + ' across the phrase' : ''),
                properties: { phrase: { i: ph.i, player: p.inst, n: ph.n, k: k + 1, of: ph.notes.length } }, sonifyNote: 60, technique: p.ordinary, sonifyMode: 'plain', recVel: 80 };
            if (ph.cresc) o._marks = [r2(markAt(a)), r2(markAt(b))];
            return o;
        });
        // the phrase's ONE brick — a window over the whole phrase; the crotales' says how long one glide lasts
        const gliss = { kind: 'none', from: 0, to: 0 };
        if (p.who === 'sine') gliss.overS = ph.target;
        const z = SineGo.sineZone('zn-' + (nextId++), p.lane, ph.start, ph.end, { midi: 60, gliss, level: { mode: 'flat', mark: p.sineLevel || S.SINE_LEVEL }, label: label + (ph.cresc ? ' cresc' : ''), track: { on: true } }, mine[0].id);
        z.properties = { sine: { notes: mine.map((o) => o.id), phrase: ph.i },
            phrase: { i: ph.i, player: p.inst, n: ph.n, startS: ph.start, endS: ph.end, notes: mine.length, lengthBand: S.LB[ph.lenBand], restAfterS: ph.restAfter, ceilingS: ph.ceil, gapS: ph.gapS, cresc: ph.cresc || null } };
        for (const o of mine) o.properties.sine = { brick: z.id };
        objects.push(...mine, z); notes.push(...mine); bricks.push(z);
    }
    // the take's pitches, then each note's own strike or shape, then THE GO (the voice, the bend; the crotales' sine glisses)
    const took = SineGo.applyChord(notes, S.chord, S.CFG.take);
    if (took.left.length) throw new Error('the take "' + S.CFG.take + '" left lanes without a pitch: ' + took.left.join(' '));
    for (const o of notes) {
        const p = S.PLAYERS.find((q) => q.lane === o.layer), pitch = SineGo.fit(Math.round(+o.sonifyNote), p.range[0] != null ? p.range[0] : 0, p.range[1] != null ? p.range[1] : 127);
        if (pitch == null) throw new Error(SineGo.pn(o.sonifyNote) + ' has no octave inside ' + p.inst + '\'s ' + p.voice);
        if (o._marks) {
            // A SHAPED NOTE (docs/DYNAMICS_LAW.md Rules 1 · 2): struck at mf for its pitch, the fader between its own two written dynamics' table values,
            // each end drawn on its table value — and it SAYS its level to the simulated ear, in marks
            const [a, b] = o._marks, lo = Math.min(a, b) / 7, hi = Math.max(a, b) / 7;
            delete o.sonifyMode; delete o.recVel;
            o.velAbs = TextureDyn.mfVel(S.REMAP, p.inst, pitch);
            o.cc7Abs = DynTable.range(S.REMAP, p.inst, lo, hi);
            o.nodes = [a, b].map((m, k) => ({ pos: k, y: Math.max(0.05, r2(10 * DynTable.height(S.REMAP, p.inst, m / 7, lo, hi))), smooth: 0.25 }));
            o.properties.simLevel = [[0, a], [1, b]];
        } else o.recVel = velFor(p.inst, pitch, level);
        delete o._marks;
    }
    const go = SineGo.convert(notes, { objects, instruments: S.INSTRUMENTS, tracks: S.TRACKS, cfg: S.cfg, seed: rolled.seed, take: S.CFG.take, newId: () => 'zn-' + (nextId++), newNoteId: () => 'wc-' + (nextId++) });
    if (go.done.length !== notes.length) throw new Error('the GO made ' + go.done.length + ' of ' + notes.length + ': ' + go.skipped.map((s) => s.why).join(' · '));
    objects.sort((a, b) => startOf(a) - startOf(b));
    return { base, objects, nextId, notes, bricks, go, redo };
}

const paceOf = (ph) => ph.notes.map(([a, b]) => r2(b - a).toFixed(1)).join(' ');
function sheet(S, rolled, made, name, command) {
    const C = S.CFG, dens = rolled.density, brickOf = (ph) => made.bricks.find((z) => z.properties.phrase.i === ph.i);
    const how = (ph) => { const z = brickOf(ph), n = made.notes.filter((o) => o.properties.phrase.i === ph.i), kinds = n.map((o) => o.properties.sine.kind + (o.properties.sine.chain ? ' (' + Math.abs(o.properties.sine.cents) + ' c, re-keyed ×' + (o.properties.sine.chain.length + 1) + ')' : '')); return ph.player.who === 'sine' ? 'the sine: ' + z.elec.gliss.kind + ' ' + z.elec.gliss.from + ' → ' + z.elec.gliss.to + ' c, each bowing' : kinds.join(' · '); };
    const redoLine = S.REDO.length ? ' The start\'s ' + S.REDO.map((p) => p.label).join(' and ') + ' notes went through the GO again here (`start.redo`): ' + (made.redo.lines || []).join(' | ') + '.' : '';
    return [
        '# ' + name + ' — the beating section, seed ' + rolled.seed,
        '',
        '*Written by `' + command + '` — rendered from the tool, never edited by hand (PLAN.md § 1.8; DEC-58 … 58c; RUNNING_LOG §255 … §260).*',
        '',
        '**What it is:** ' + S.LEN + ' s. The players hold long tones against sines and bend until the pair beats. It begins with `' + C.start.from + '` as it is (0 … ' + S.START + ' s — your word: "I\'ll keep that as the start"); from there each player plays PHRASES on the take `' + C.take + '`: a phrase ' + S.LB[0][0] + ' … ' + S.LB[S.LB.length - 1][1] + ' s, then a rest ' + S.RB[0][0] + ' … ' + S.RB[S.RB.length - 1][1] + ' s. Inside a phrase the player re-breathes (or re-bows) by the breath model — ' + S.PLAYERS.map((p) => { const ph = rolled.phrases.find((x) => x.player === p); return p.label + ' ≤ ' + (ph ? ph.ceil : '?') + ' s' + (ph && ph.gapS ? ', ' + ph.gapS + ' s between' : ''); }).join(' · ') + '. Over each phrase lies ONE sine brick, written `' + S.SINE_LEVEL + '`' + (S.PLAYERS.some((p) => p.sineLevel) ? ' (' + S.PLAYERS.filter((p) => p.sineLevel).map((p) => 'the ' + p.label + '\'s `' + p.sineLevel + '`').join(', ') + ')' : '') + ' — and every brick is a WINDOW: the sine is silent until its player sounds, comes in with them, follows their rise and fall, holds through a breath and goes when they stop. The crotales hold their pitch and their SINE glides, again at each bowing. A bend past the sampler\'s ±1 st is RE-KEYED (the string quartet\'s rule: the key moves, the bend re-based, a 5 ms overlap at the seam) — "re-keyed ×n" below.' + redoLine,
        '',
        '**The test — the crescendo phrases:** ' + (rolled.phrases.filter((ph) => ph.cresc).map((ph) => ph.player.label + ' ' + (C.labels.phrase || 'P') + ph.n + ' at ' + K.clock(ph.start) + ' … ' + K.clock(ph.end) + ' (' + ph.start.toFixed(1) + ' … ' + ph.end.toFixed(1) + ' s), ' + ph.cresc.from + ' → ' + ph.cresc.to).join(' · ') || 'none') + '. The player\'s notes rise across the whole phrase; the sine under them should rise with them (the tracker moves it by at most ±8 dB — `bank/elec_route.json` `sine.track.capDb`).',
        '',
        '**To play it:** the engine restarted after 2026-10-08 (it has the tracker) · F5 · File ▾ → Experiments → `' + name + '` · play from 0 with the engine up. The engine\'s window says each entry: `sine · … ENTERED — the sine comes in with it`.',
        '',
        '**The phrases:**',
        '',
        '| # | player | from → to | notes (s each) | how they beat |',
        '|---|---|---|---|---|',
    ].concat(rolled.phrases.map((ph) => '| ' + (C.labels.phrase || 'P') + ph.n + (ph.cresc ? ' cresc' : '') + ' | ' + ph.player.label + ' | ' + K.clock(ph.start) + ' → ' + K.clock(ph.end) + ' (' + r2(ph.end - ph.start) + ' s) | ' + paceOf(ph) + ' | ' + how(ph) + ' |'))
        .concat(['', '**The density** (the most players sounding in each 5 s, from ' + dens.fromS + ' s): `' + dens.line + '` — up to ' + dens.max + ', mean ' + dens.mean + ' (the rule: ≥ ' + S.D.reach + ' once, mean ≤ ' + S.D.meanMax + ').',
            '', '**To change it:** a number in `bank/beating_section.json`, then `' + command + '`, then File ▾ → Reload. Another seed: `--seed N`. The balance of the sines against the players is the one mark `level` (or `sineLevel`, the sines alone; a player\'s own `sineLevel` on its row, that player\'s sines alone). How far a pair beats: `bank/sine_behaviours.json` — a bending player\'s `cents`, a gliding sine\'s `beatHz` (beats a second, by the pitch). Your takes by range: select the notes of a range → `take ▾` → `∿ sines`, or `node tools/sine_go.js --score ' + name + ' --from 40 --to 75 --take <name>` — a phrase\'s brick is re-pitched, not replaced.', '']).join('\n');
}

function main() {
    const has = (k) => process.argv.includes('--' + k), arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
    let S;
    try { S = load(); } catch (e) { console.error(String(e.message)); process.exit(2); }
    const NAME = arg('score', 'beating-section'), OUT = path.join(ROOT, 'scores', NAME + '.json'), DRY = has('dry');
    const SEED = Math.max(1, Math.round(+arg('seed', S.CFG.seed || 1)) || 1);
    if (/^piece-/.test(NAME)) { console.error('refusing a piece-… name'); process.exit(3); }
    if (NAME === S.CFG.start.from) { console.error('refusing to write over the start score itself (' + NAME + ')'); process.exit(3); }
    if (!fs.existsSync(path.join(ROOT, 'scores', S.CFG.start.from + '.json'))) { console.error('the start score is not there: scores/' + S.CFG.start.from + '.json'); process.exit(4); }
    if (!DRY && fs.existsSync(OUT)) {
        let old = null; try { old = K.readJson(OUT); } catch (e) { old = null; }
        const mine = !!(old && ((old.metadata && old.metadata.builtBy === TOOL) || (old.objects || []).some((o) => o.properties && o.properties.phrase)));
        if (!mine) { console.error(K.rel(OUT) + ' is there and this tool did not make it — not written over (--score another name)'); process.exit(3); }
        if (!has('replace')) { console.error(K.rel(OUT) + ' is there already — --replace at his word (another seed is another section)'); process.exit(3); }
        const WORK = path.join(ROOT, 'scores', NAME + '-work.json');
        if (fs.existsSync(WORK) && !has('unsaved-ok')) {
            let same = false; try { same = JSON.stringify(K.readJson(WORK).objects) === JSON.stringify(old.objects); } catch (e) { same = false; }
            if (!same) { console.error('the page holds a working copy of ' + NAME + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (--unsaved-ok at his word)'); process.exit(3); }
        }
    }
    const { rolled, tries } = rollKept(S, SEED);
    if (!rolled.kept) { console.error('no seed from ' + SEED + ' in ' + tries + ' tries reaches ' + S.D.reach + ' players with a mean of ' + S.D.meanMax + ' or under (the last: up to ' + rolled.density.max + ', mean ' + rolled.density.mean + ') — the ranges in bank/beating_section.json cannot make it'); process.exit(5); }
    let made;
    try { made = make(S, rolled); } catch (e) { console.error(String(e.message)); process.exit(4); }
    const command = 'node ' + TOOL + (NAME !== 'beating-section' ? ' --score ' + NAME : '') + ' --seed ' + SEED + ' --replace';
    console.log('THE BEATING SECTION — seed ' + SEED + (rolled.seed !== SEED ? ' → kept ' + rolled.seed + ' (the ' + tries + 'th tried)' : ' kept at once') + ' · ' + S.LEN + ' s · the start `' + S.CFG.start.from + '` to ' + S.START + ' s · '
        + rolled.phrases.length + ' phrases · ' + made.notes.length + ' notes · ' + rolled.crescendos + ' crescendo phrases · density up to ' + rolled.density.max + ', mean ' + rolled.density.mean);
    for (const p of S.PLAYERS) {
        const mine = rolled.phrases.filter((ph) => ph.player === p);
        console.log('  ' + p.label.padEnd(14) + mine.map((ph) => (S.CFG.labels.phrase || 'P') + ph.n + (ph.cresc ? '<' : '') + ' ' + ph.start.toFixed(1) + '–' + ph.end.toFixed(1) + ' (' + ph.notes.length + ')').join(' · '));
    }
    console.log('  the density, the most players in each 5 s from ' + rolled.density.fromS + ' s: ' + rolled.density.line);
    if (DRY) { console.log('(--dry: nothing written)'); return; }
    const now = new Date().toISOString();
    const save = Object.assign({}, made.base, { objects: made.objects, markers: made.base.markers || [], nextId: made.nextId, metadata: { created: now, modified: now, builtBy: TOOL,
        note: 'THE BEATING SECTION (PLAN.md § 1.8; DEC-58 … 58c): `' + S.CFG.start.from + '` as the start (0 … ' + S.START + ' s), then ' + rolled.phrases.length + ' phrases of breathed notes on the take "' + S.CFG.take + '", one sine brick a phrase, every brick a window (Follow on), ' + rolled.crescendos + ' crescendo phrases — seed ' + rolled.seed + '. Written by ' + TOOL + '; the sheet: docs/BEATING_SECTION.md.',
        beatingSection: { seedAsked: SEED, seedUsed: rolled.seed, tries, lengthS: S.LEN, start: S.CFG.start.from, startToS: S.START, take: S.CFG.take, command, made: now, phrases: rolled.phrases.length, notes: made.notes.length, crescendos: rolled.crescendos, density: rolled.density } } });
    if (!save.tracks) save.tracks = S.TRACKS;
    fs.writeFileSync(OUT, JSON.stringify(save, null, 1) + '\n');
    const sheetFile = path.join(ROOT, 'docs', 'BEATING_SECTION.md');
    fs.writeFileSync(sheetFile, sheet(S, rolled, made, NAME, command).replace(/\r\n/g, '\n'));
    console.log(K.rel(OUT) + ' — ' + made.objects.length + ' objects (' + made.notes.length + ' rolled notes, ' + made.bricks.length + ' phrase bricks, the start\'s ' + (made.objects.length - made.notes.length - made.bricks.length) + ') · ' + K.rel(sheetFile));
    if (fs.existsSync(path.join(ROOT, 'scores', NAME + '-work.json'))) console.log('NOTE — the page holds a working copy of ' + NAME + ' from before: File ▾ → Reload drops it and opens this one.');
}

module.exports = { TOOL, MARKS, load, roll, rollKept, make, breathsOf };
if (require.main === module) main();
