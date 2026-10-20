#!/usr/bin/env node
// build_drone_section.js — THE DRONE SECTION as a save the composer score opens (PLAN.md § 1.7, 15.4; DEC-48 … DEC-54; RUNNING_LOG
// §240 … §249). Running order step 15.
//
//   node tools/build_drone_section.js [--score drone-section] [--from drone-start-mics] [--seed 1] [--entry his|rolled]
//                                     [--replace] [--dry] [--unsaved-ok] [--render] [--port 5500]
//
// What it writes, and nothing else — ONE SECTION, from a seed, every number from bank/drone_section.json (HIS data; this tool never
// writes it and refuses a file that does not add up):
//   · THE RECORDINGS — per player THREE (his word of 2026-10-08, §251 — four at the layout): the first HIS (the first note on the
//     player's lane in --from, his score, kept as he played it) and two more ROLLED (a NOTE of the player's multiphonic — the technique,
//     a key from his list by the round robin, his velocity — as long as its window); over each a MIC OPENING, its window drawn 6 … 9 s,
//     named <player>-drone-<k>; each later recording 25 … 45 s after the previous one's start, drawn again until no two players' openings
//     begin within 3 s and every opening begins before recording.lastStartS (his word: all before 120 s); all inside the section.
//   · THE DRONES — a recording's STRING on its lane: the first 30 s after its window ENDS (the engine's hold and the render — his word
//     of 2026-10-08; 20 s from the opening's start at the layout, §246), each 10 … 40 s then a rest 0 … 20 s, until the player's next
//     string begins (one drone a lane at a time — the drones of the recording before go on until the new one is rendered) and never past the end; each a
//     RETURN brick asking for its recording through a preset of its own (dn<NN> in bank/presets.json: the icy stage, read in order from
//     a START drawn as a fraction of the recording's longest sounding region — resolved by the engine at the render — looping, no
//     pitch change, the stretch alone, rand 0.2; the window · the pace band · the overlaps band · the grain size steady or a shape over
//     the drone — EVERY DIAL ITS OWN EXHAUSTIVE ROUND ROBIN, a value drawn inside the band; ended by a SHAPE: a fade in 1 … 2 s, the
//     drone's ABSOLUTE length, a fade out 1 … 2 s, one in five up to 6 s); written drone.level (f since his word of 2026-10-08, for the
//     demo recording; mp at the layout).
//   · THE KEEP RULE — a seed is kept if the density (parts sounding, read every second) reaches 5 once and its mean is ≤ 3.5; else the
//     next seed, up to keep.tries. --dry prints the roll, the drones with their draws and the density line, and writes nothing.
//   · THE SHEET docs/DRONE_SECTION.md and, with --render, the plan sent to the engine (render 1) — ONLY useful once the recordings are
//     in the bank (his pass): a drone's render needs its recording; the page sends the plan itself at every pass.
// It refuses to write over a score it did not make, over a working copy with unsaved changes, a piece-… name, a --from score without a
// note on every player's lane, and a key outside its technique's range. GENERATED — re-run it rather than hand-edit: another seed is
// another section; a number changed in bank/drone_section.json is heard after --replace and File ▾ → Reload — no engine restart.
// THE SORTING: this tool knows the piece (its lanes, its recipes, its bank, its presets, his score) — the piece's. The stage, the regions,
// the plan's shaped row are the engine's (electronics/sc/process.scd · bank.scd, 15.2).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const K = require('./audition_kit.js');
const ROOT = K.ROOT, TOOL = 'tools/build_drone_section.js', TAG = 'drone-section';
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const CFG = K.readJson(path.join(ROOT, 'bank', 'drone_section.json'));
const ENTRY = arg('entry', (CFG.recording && CFG.recording.entry) || 'his');
const NAME = arg('score', ENTRY === 'rolled' ? 'drone-section-demo' : 'drone-section'), FROM = arg('from', (CFG.recording && CFG.recording.entryScore) || '');
const OUT = path.join(ROOT, 'scores', NAME + '.json'), DRY = has('dry'), PORT = +arg('port', 5500);
const SEED = Math.max(1, Math.round(+arg('seed', CFG.seed || 1)) || 1);
const r3 = (x) => Math.round(x * 1000) / 1000, r2 = (x) => Math.round(x * 100) / 100;
if (/[\\/]piece-/.test(OUT)) { console.error('refusing a piece-… name'); process.exit(3); }
if (!['his', 'rolled'].includes(ENTRY)) { console.error('--entry his | rolled'); process.exit(2); }

// ---- the stack: the lanes, the recipes, the microphones, the ladder, the presets ----------------------------------------------
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const ROUTE = K.readJson(path.join(ROOT, 'bank', 'elec_route.json'));
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const REMAP = K.readJson(path.join(ROOT, 'bank', 'velocity_remap.json'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const velFor = (instKey, midi, mark) => Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, instKey, midi, MARKS.indexOf(mark) / (MARKS.length - 1)))));
const MF = 5.714285714285714;   // the written height of mf (4/7 of the 0–10 scale), as build_drone_sources.js writes a held note

// ---- the data file, checked --------------------------------------------------------------------------------------------------
const fail = (m) => { console.error('bank/drone_section.json: ' + m); process.exit(2); };
const range = (v, what) => { if (!Array.isArray(v) || v.length !== 2 || !(+v[0] <= +v[1])) fail(what + ' must be [lo, hi]'); return [+v[0], +v[1]]; };
const R = CFG.recording || {}, D = CFG.drone || {}, KEEP = CFG.keep || {}, LEN = +CFG.lengthS;
if (!(LEN > 30)) fail('lengthS');
const REC_LEN = range(R.lengthS, 'recording.lengthS'), REC_GAP = range(R.laterGapS, 'recording.laterGapS'), REC_N = Math.max(1, Math.round(+R.perPlayer || 3)), REC_APART = +R.minApartS || 3, PRE = (+R.preMs || 100) / 1000;
const REC_LAST = +R.lastStartS || LEN;   // every recording's opening begins before this (his word of 2026-10-08: all before 120 s)
if (!(REC_LAST > REC_GAP[0] && REC_LAST <= LEN)) fail('recording.lastStartS must be inside the section and past one gap');
if (!(D.firstAfterEndS != null)) fail('drone.firstAfterEndS (the time from a window\'s END to its first drone — firstAfterOpenS, from the START, is gone since 2026-10-08)');
const DR_LEN = range(D.lengthS, 'drone.lengthS'), DR_REST = range(D.restS, 'drone.restS'), DR_FIRST = +D.firstAfterEndS || 30, FADE = range(D.fadeS, 'drone.fadeS'), FADE_MAX = +D.fadeMaxS || FADE[1], FADE_LONG = +(D.fadeLongShare != null ? D.fadeLongShare : 0.2);
// DEC-56 (his word of 2026-10-08): after the first drone of a player's LAST recording the sources are rolled among the player's recordings;
// the LAST drone of each part runs to the end with a long fade out
const ANY_SRC = (D.afterLastRecording || 'own') === 'any', LAST_FADE = +(D.lastFadeOutS || 0);
if (!['own', 'any'].includes(D.afterLastRecording || 'own')) fail("drone.afterLastRecording must be 'own' or 'any'");
if (!(LAST_FADE >= 0)) fail('drone.lastFadeOutS');
if (!MARKS.includes(D.level)) fail('drone.level must be a mark');
const PACE = (CFG.pace && CFG.pace.bands) || [], OV = (CFG.overlaps && CFG.overlaps.bands) || [], WINS = CFG.windows || [];
if (!PACE.length || !OV.length || WINS.length < 1) fail('pace.bands, overlaps.bands and windows are needed');
PACE.forEach((b, i) => range(b, 'pace.bands[' + i + ']')); OV.forEach((b, i) => range(b, 'overlaps.bands[' + i + ']'));
const SETS = (CFG.grainSize && CFG.grainSize.sets) || {}, MODES = (CFG.grainSize && CFG.grainSize.modes) || { steady: 2, rising: 1, falling: 1, arch: 1 };
for (const w of WINS) { if (!SETS[w.set] || !SETS[w.set].length) fail('window ' + w.name + ' names a grain-size set the file does not have: ' + w.set); SETS[w.set].forEach((b, i) => range(b.band, 'grainSize.sets.' + w.set + '[' + i + '].band')); }
const PLAYERS = (CFG.players || []).map((p) => {
    const lane = TRACKS.findIndex((t) => t.instKey === p.lane);
    if (lane < 0) fail('player ' + p.name + ': no lane has the recipe key ' + p.lane);
    if (!ROUTE.players.some((q) => q.name === p.name)) fail('player ' + p.name + ' has no microphone (bank/elec_route.json players)');
    const s = (CFG.sources || {})[p.name];
    if (!s) fail('no source for ' + p.name);
    const I = INSTRUMENTS[s.inst]; if (!I) fail(p.name + ': no recipe ' + s.inst);
    const tech = (I.techniques || []).find((q) => q.key === s.technique);
    if (!tech) fail(p.name + ': the lane ' + s.inst + ' has no technique ' + s.technique + ' — its keys: ' + I.techniques.map((q) => q.key).join(' · '));
    const lo = tech.rangeLow != null ? tech.rangeLow : I.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : I.rangeHigh;
    const keys = Array.isArray(s.keys) ? s.keys.map(Number) : [+s.key];
    for (const k of keys) if (!(k >= lo && k <= hi)) fail(p.name + ': key ' + k + ' is outside ' + s.technique + "'s range " + lo + ' … ' + hi);
    const srcLane = TRACKS.findIndex((t) => t.instKey === s.inst);
    if (srcLane !== lane) fail(p.name + ': the source is on the lane ' + s.inst + ', the player on ' + p.lane);
    return { name: p.name, label: p.label || p.name, lane, inst: s.inst, technique: s.technique, keys, vel: s.vel, srcLabel: s.label || s.technique, range: [lo, hi] };
});
if (PLAYERS.length < 1) fail('players');

// ---- the seeded draws and the exhaustive round robin --------------------------------------------------------------------------
const U = (rnd, lo, hi) => lo + rnd() * (hi - lo);
const shuffled = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// none twice before all have come (a weight = how many times an item comes in one lap); the next lap in another order
function Robin(items, rnd, weights) {
    const lap = []; items.forEach((it, i) => { const w = Math.max(1, Math.round(weights ? +weights[i] || 1 : 1)); for (let k = 0; k < w; k++) lap.push(it); });
    let order = [], at = 0;
    return { next() { if (at >= order.length) { order = shuffled(lap, rnd); at = 0; } return order[at++]; }, lapSize: lap.length };
}

// ---- THE ROLL — one section from a seed -------------------------------------------------------------------------------------
function roll(seed, entries) {
    const rnd = K.mulberry32(seed);
    const robins = {
        window: Robin(WINS, rnd, WINS.map((w) => w.weight)), pace: Robin(PACE.map((b, i) => i), rnd, (CFG.pace.weights || [])), overlaps: Robin(OV.map((b, i) => i), rnd, (CFG.overlaps.weights || [])),
        size: Object.fromEntries(Object.entries(SETS).map(([k, bands]) => [k, Robin(bands.map((b, i) => i), rnd, bands.map((b) => b.weight))])),
        mode: Robin(Object.keys(MODES), rnd, Object.values(MODES)),
        fade: Robin(['n', 'n', 'n', 'n', 'long'].slice(0, Math.max(2, Math.round(1 / Math.max(0.05, FADE_LONG)))), rnd),
        key: Object.fromEntries(PLAYERS.map((p) => [p.name, Robin(p.keys, rnd)])),
    };
    // THE RECORDINGS: his entry (or a rolled one), then two more a player, 25 … 45 s apart, no two players' openings within 3 s, every
    // opening before REC_LAST (his word: all before 120 s — the gaps as they are, drawn again until they land before it)
    const recs = [];
    const order = shuffled(PLAYERS, rnd);
    let t0 = 1;
    for (const p of order) {
        const e = entries[p.name];
        let first;
        if (e) first = { player: p, k: 1, noteStart: e.start, noteEnd: e.end, key: e.key, technique: e.technique, entry: 'his', noteId: e.id };
        else { const key = robins.key[p.name].next(); first = { player: p, k: 1, noteStart: t0, key, technique: p.technique, entry: 'rolled' }; t0 += U(rnd, 3, 8); }
        first.windowS = r2(U(rnd, REC_LEN[0], REC_LEN[1])); first.openS = r3(first.noteStart - PRE);
        if (first.entry === 'rolled') first.noteEnd = r3(first.noteStart + first.windowS - PRE);
        if (first.openS > REC_LAST) { console.error(p.label + "'s entry opens at " + first.openS + ' s — past recording.lastStartS ' + REC_LAST + ' s (his entries are the first notes of ' + (FROM || NAME) + ')'); process.exit(4); }
        recs.push(first);
        let prev = first;
        for (let k = 2; k <= REC_N; k++) {
            let r = null;
            for (let tries = 0; tries < 60 && !r; tries++) {
                const openS = r3(prev.openS + U(rnd, REC_GAP[0], REC_GAP[1])), windowS = r2(U(rnd, REC_LEN[0], REC_LEN[1]));
                if (openS + windowS > LEN) break;
                if (openS > REC_LAST) continue;   // past his line: draw the gap again
                if (recs.some((q) => Math.abs(q.openS - openS) < REC_APART)) continue;
                r = { player: p, k, openS, windowS, noteStart: r3(openS + PRE), noteEnd: r3(openS + windowS), key: robins.key[p.name].next(), technique: p.technique, entry: 'rolled' };
            }
            if (!r) break;   // past the end, or no room: fewer recordings for this player (the check says so)
            recs.push(r); prev = r;
        }
    }
    recs.sort((a, b) => a.openS - b.openS);
    recs.forEach((r) => { r.name = r.player.name + '-drone-' + r.k; });
    // THE DRONES: a string per recording
    const drones = [];
    const sizeLine = (mode, a, z, ms) => mode === 'rising' ? a + '@0,' + z + '@' + ms : mode === 'falling' ? z + '@0,' + a + '@' + ms : a + '@0,' + z + '@' + Math.round(ms / 2) + ',' + a + '@' + ms;
    // THE SOURCE ROLL (DEC-56): after the first drone of a player's LAST recording, each further drone takes ANY of the player's
    // recordings — an exhaustive round robin per player, none twice before all; before that a string plays its own recording
    const srcRobin = Object.fromEntries(PLAYERS.map((p) => [p.name, Robin(recs.filter((q) => q.player === p), rnd)]));
    let gi = 0;
    for (const r of recs) {
        const mine = recs.filter((q) => q.player === r.player).sort((a, b) => a.k - b.k), next = mine.find((q) => q.k === r.k + 1), last = !next;
        // the string begins DR_FIRST after the window ENDS and runs until the player's NEXT recording is rendered (its window end + DR_FIRST)
        const limit = Math.min(LEN, next ? next.openS + next.windowS + DR_FIRST : LEN);
        let t = r.openS + r.windowS + DR_FIRST, n = 0;
        while (t < limit - 3) {
            const lenS = r2(U(rnd, DR_LEN[0], DR_LEN[1])), end = r2(Math.min(t + lenS, limit));
            const fin = r2(robins.fade.next() === 'long' ? U(rnd, FADE[1], FADE_MAX) : U(rnd, FADE[0], FADE[1]));
            const fout = r2(robins.fade.next() === 'long' ? U(rnd, FADE[1], FADE_MAX) : U(rnd, FADE[0], FADE[1]));
            if (end - t < fin + fout + 1) break;
            if (last && LAST_FADE > 0 && LEN - t < fin + LAST_FADE + 1) break;   // no room left for the last drone's long fade: the one before is the last
            const w = robins.window.next(), pi = robins.pace.next(), oi = robins.overlaps.next();
            const factor = r2(U(rnd, PACE[pi][0], PACE[pi][1])), speed = Math.round(10000 / factor) / 10000, overlaps = Math.round(U(rnd, OV[oi][0], OV[oi][1]));
            const set = SETS[w.set], mode = robins.mode.next();
            let size;
            if (mode === 'steady') { const si = robins.size[w.set].next(), b = set[si]; size = { mode, band: b.band, name: b.name, s: r2(U(rnd, b.band[0], b.band[1])) }; }
            else {
                const lo = set[0].band, hi = set[set.length - 1].band, a = r2(U(rnd, lo[0], lo[1])), z = r2(U(rnd, hi[0], hi[1])), ms = Math.round((end - t) * 1000);
                size = { mode, from: a, to: z, line: sizeLine(mode, a, z, ms) };
            }
            const src = (last && ANY_SRC && n > 0) ? srcRobin[r.player.name].next() : r;
            drones.push({ rec: r, src, n: ++n, i: ++gi, start: r2(t), end, lengthS: r2(end - t), fadeInS: fin, fadeOutS: fout, window: w, paceBand: pi, factor, speed, ovBand: oi, overlaps, size, startFrac: r2(rnd()) });
            t = r2(end + U(rnd, DR_REST[0], DR_REST[1]));
        }
        // THE LAST DRONE OF THE PART (DEC-56): it runs to the section's end and fades out LAST_FADE — longer than drawn if the end is further
        if (last && LAST_FADE > 0 && n > 0) {
            const d = drones[drones.length - 1];
            d.end = LEN; d.lengthS = r2(LEN - d.start); d.fadeOutS = LAST_FADE; d.last = true;
            if (d.size.mode !== 'steady') d.size.line = sizeLine(d.size.mode, d.size.from, d.size.to, Math.round(d.lengthS * 1000));
        }
    }
    // THE DENSITY: parts sounding, read every second
    const secs = Math.ceil(LEN), dens = new Array(secs).fill(0);
    for (const d of drones) for (let s = Math.floor(d.start); s < Math.min(secs, Math.ceil(d.end)); s++) if (s + 0.5 >= d.start && s + 0.5 < d.end) dens[s]++;
    const max = Math.max(0, ...dens), mean = dens.reduce((a, b) => a + b, 0) / secs;
    const line = []; for (let s = 0; s < secs; s += 5) line.push(String(Math.max(...dens.slice(s, s + 5))));
    const kept = max >= (+KEEP.reachParts || 5) && mean <= (+KEEP.meanPartsMax || 3.5);
    return { seed, recs, drones, density: { max, mean: r2(mean), line: line.join('') }, kept };
}

// ---- his entry: the first note on each player's lane in --from (or in the score itself) ------------------------------------
function entriesFrom(file) {
    const save = K.readJson(file), notes = (save.objects || []).filter((o) => o.type === 'waveCurve' && !(o.properties && o.properties.droneSim));
    const out = {};
    for (const p of PLAYERS) {
        const n = notes.filter((o) => o.layer === p.lane).sort((a, b) => a.startSeconds - b.startSeconds)[0];
        if (!n) { console.error(K.rel(file) + ' has no note on the ' + p.label + "'s lane (" + p.lane + ') — his entry is the first note there'); process.exit(4); }
        out[p.name] = { id: n.id, start: +n.startSeconds, end: +n.endSeconds, key: n.sonifyNote, technique: n.technique };
    }
    return { save, entries: out };
}

// ---- the score's frame and the refusals ------------------------------------------------------------------------------------
let base, entries = {};
if (ENTRY === 'his') {
    const from = path.join(ROOT, 'scores', (FROM || NAME) + '.json');
    if (!fs.existsSync(from)) { console.error('his entry score is not there: ' + K.rel(from) + ' (F5 · a new score · one note per player · CTRL+S; --from <name>)'); process.exit(4); }
    const got = entriesFrom(from); base = got.save; entries = got.entries;
} else base = K.readJson(path.join(ROOT, 'scores', 'decibel.json'));
if (!DRY && fs.existsSync(OUT)) {
    let old = null; try { old = K.readJson(OUT); } catch (e) { old = null; }
    const mine = !!(old && old.metadata && old.metadata.builtBy === TOOL), onlyNotes = !!(old && (old.objects || []).every((o) => o.type === 'waveCurve'));
    if (!mine && !onlyNotes) { console.error(K.rel(OUT) + ' is there and this tool did not make it — not written over (--score another name)'); process.exit(3); }
    if (mine && !has('replace')) { console.error(K.rel(OUT) + ' is there already — --replace at his word (another seed is another section)'); process.exit(3); }
    const WORK = path.join(ROOT, 'scores', NAME + '-work.json');
    if (fs.existsSync(WORK) && !has('unsaved-ok')) {
        let same = false; try { same = JSON.stringify(K.readJson(WORK).objects) === JSON.stringify(old.objects); } catch (e) { same = false; }
        if (!same) { console.error('the page holds a working copy of ' + NAME + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (--unsaved-ok at his word)'); process.exit(3); }
    }
}

// ---- the keep loop --------------------------------------------------------------------------------------------------------
let rolled = null, tries = 0;
for (let s = SEED; s < SEED + Math.max(1, +KEEP.tries || 200); s++) { tries++; rolled = roll(s, entries); if (rolled.kept) break; }
if (!rolled.kept) { console.error('no seed from ' + SEED + ' in ' + tries + ' tries reaches ' + KEEP.reachParts + ' parts with a mean under ' + KEEP.meanPartsMax + ' — the ranges in bank/drone_section.json cannot make it'); process.exit(5); }

// ---- the objects ----------------------------------------------------------------------------------------------------------
const zone = (id, model, layer, start, end, color, yOffset, elec, props) => ({
    id, type: 'zone', layer, startTime: r3(start), endTime: r3(end), player: '', instrument: '', zoneFunction: 'elec', midiModel: model,
    ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
    responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color, opacity: 0.35, yOffset, zoneHeight: 0.2,
    performanceNotes: '', properties: props || {}, elec,
});
const keep = (base.objects || []).filter((o) => !(o.properties && (o.properties.rec || o.properties.drone || o.properties.droneSim)));   // his, and anything not this tool's
let nextId = Math.max(+base.nextId || 1, ...keep.map((o) => +String(o.id).replace(/^\D+/, '') || 0).map((n) => n + 1));
const objects = keep.slice(), presets = [], nn = (i) => String(i).padStart(2, '0');
const paceOf = (d) => '1/' + Math.round(d.factor), sizeOf = (d) => (d.size.mode === 'steady' ? d.size.name + ' ' + d.size.s + ' s' : d.size.mode + ' ' + d.size.from + ' → ' + d.size.to + ' s');
for (const r of rolled.recs) {
    if (r.entry === 'rolled') {
        const vel = typeof r.player.vel === 'number' ? Math.max(1, Math.min(127, Math.round(r.player.vel))) : velFor(r.player.inst, r.key, MARKS.includes(r.player.vel) ? r.player.vel : 'mf');
        objects.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: r.player.lane, startSeconds: r3(r.noteStart), endSeconds: r3(r.noteEnd),
            nodes: [{ pos: 0, y: MF, smooth: 0.25 }, { pos: 1, y: MF, smooth: 0.25 }], segments: [{ model: 'bezier', slope: 0 }],
            color: '#4F7942', fillMode: 'bottom', opacity: 0.5, performanceNotes: 'DURATION LINE — hold the multiphonic through the microphone\'s window (' + r.windowS + ' s)', properties: { droneSim: { player: r.player.name, k: r.k } },
            sonifyNote: r.key, technique: r.technique, velAbs: vel });
        r.noteId = objects[objects.length - 1].id;
    }
    objects.push(zone('zn-' + (nextId++), 'elecOpen', r.player.lane, r.openS, r.openS + r.windowS, CFG.colors.recording, 0,
        { name: r.name, category: R.category || 'drone-rec', player: r.player.name, label: (CFG.labels.recording || 'REC') + r.k + ' · ' + r.windowS + ' s' },
        { rec: { player: r.player.name, k: r.k, name: r.name, openS: r.openS, windowS: r.windowS, entry: r.entry, noteId: r.noteId, key: r.key } }));
}
for (const d of rolled.drones) {
    const key = 'dn' + nn(d.i), ms = Math.round(d.lengthS * 1000);
    const args = Object.assign({}, CFG.stage, { icSpeed: d.speed, icFromMs: CFG.regions && CFG.regions.spanInside === false ? Math.round(d.startFrac * d.rec.windowS * 1000) : 'region@' + d.startFrac, icWin: d.size.mode === 'steady' ? d.size.s : d.size.line, icOverlaps: d.overlaps, icEnv: d.window.icEnv });
    const src = d.src || d.rec, from = src === d.rec ? '' : ' ← ' + (CFG.labels.recording || 'REC') + src.k;   // the source, when rolled (DEC-56)
    presets.push({ key, name: (CFG.labels.drone || 'D') + d.n + ' of ' + d.rec.name + (src === d.rec ? '' : ' from ' + src.name) + ' · ' + d.window.name + ' · ' + paceOf(d) + ' · ov ' + d.overlaps + ' · ' + sizeOf(d) + ' · ' + d.lengthS + ' s, in ' + d.fadeInS + ' out ' + d.fadeOutS + (d.last ? ' (the last of the part)' : ''),
        effect: 'icy', class: 'time', end: 'shape', atkMs: Math.round(d.fadeInS * 1000), durMs: ms, relMs: Math.round(d.fadeOutS * 1000), curve: +D.curve || 0, args });
    objects.push(zone('zn-' + (nextId++), 'elecPlay', d.rec.player.lane, d.start, d.end, CFG.colors.drone, 1,
        { name: src.name, label: (CFG.labels.drone || 'D') + d.n + from + ' · ' + d.window.name + ' · ' + paceOf(d) + ' · ov ' + d.overlaps + ' · ' + sizeOf(d) + (d.last ? ' · out ' + d.fadeOutS + ' s' : ''), variants: { [src.name]: key + '-shape' }, dyn: { mode: 'mark', mark: D.level } },
        { drone: { player: d.rec.player.name, rec: d.rec.k, src: src.k, last: !!d.last, n: d.n, i: d.i, key, lengthS: d.lengthS, fadeInS: d.fadeInS, fadeOutS: d.fadeOutS, window: { name: d.window.name, icEnv: d.window.icEnv, set: d.window.set },
            pace: { band: PACE[d.paceBand], factor: d.factor, speed: d.speed }, overlaps: { band: OV[d.ovBand], n: d.overlaps }, size: d.size, startFrac: d.startFrac } }));
}
objects.sort((a, b) => (a.startTime != null ? a.startTime : a.startSeconds) - (b.startTime != null ? b.startTime : b.startSeconds));

// ---- say it ----------------------------------------------------------------------------------------------------------------
const command = 'node ' + TOOL + ' --score ' + NAME + (ENTRY === 'his' ? ' --from ' + (FROM || NAME) : ' --entry rolled') + ' --seed ' + SEED + ' --replace';
console.log('THE DRONE SECTION — seed ' + SEED + (rolled.seed !== SEED ? ' → kept ' + rolled.seed + ' (the ' + tries + 'th tried: the ones before never reached ' + KEEP.reachParts + ' parts or ran too thick)' : ' kept at once') + ' · ' + LEN + ' s · ' + rolled.recs.length + ' recordings · ' + rolled.drones.length + ' drones · density up to ' + rolled.density.max + ', mean ' + rolled.density.mean);
for (const p of PLAYERS) {
    const mine = rolled.recs.filter((r) => r.player === p);
    console.log('  ' + p.label.padEnd(14) + mine.map((r) => (CFG.labels.recording || 'REC') + r.k + ' ' + (r.entry === 'his' ? 'HIS' : 'key ' + r.key) + ' @ ' + r.openS.toFixed(1) + ' s (' + r.windowS + ' s)').join(' · '));
}
for (const d of rolled.drones) console.log('  D' + String(d.i).padStart(2) + '  ' + (d.src === d.rec ? d.rec.name : d.rec.name + ' ← ' + d.src.k).padEnd(14) + String(d.start.toFixed(1)).padStart(6) + ' → ' + String(d.end.toFixed(1)).padStart(6) + ' s  ' + d.window.name.padEnd(15) + paceOf(d).padEnd(6) + 'ov ' + String(d.overlaps).padEnd(3) + sizeOf(d).padEnd(26) + 'fade ' + d.fadeInS + '/' + d.fadeOutS + '  start ' + d.startFrac);
console.log('  the density, the most parts in each 5 s: ' + rolled.density.line);
if (DRY) { console.log('(--dry: nothing written)'); process.exit(0); }

// ---- write: the score, the presets, the sheet, the plan --------------------------------------------------------------------
const now = new Date().toISOString();
const save = Object.assign({}, base, { objects, markers: base.markers || [], nextId, metadata: Object.assign({}, base.metadata || {}, { modified: now, builtBy: TOOL,
    note: 'THE DRONE SECTION (PLAN.md § 1.7; DEC-48 … DEC-54): ' + rolled.recs.length + ' recordings (' + (ENTRY === 'his' ? 'the entries his, from ' + (FROM || NAME) : 'all rolled — a stand-in') + ') and ' + rolled.drones.length + ' drones from seed ' + rolled.seed + '. Written by ' + TOOL + '; his from then on. Each drone asks for <player>-drone-<k>~dn<NN>-shape; the sheet: docs/DRONE_SECTION.md.',
    droneSection: { seedAsked: SEED, seedUsed: rolled.seed, tries, lengthS: LEN, entry: ENTRY, from: ENTRY === 'his' ? (FROM || NAME) : '', command, made: now, recordings: rolled.recs.length, drones: rolled.drones.length, density: rolled.density } }) });
if (!save.tracks) save.tracks = TRACKS;
fs.writeFileSync(OUT, JSON.stringify(save, null, 1) + '\n');
const P = K.writePresets(TAG, presets, 'the drone section — a preset per drone: the icy stage, a start as a fraction of the recording\'s longest region, ended by a shape (' + presets.length + ' drones, seed ' + rolled.seed + ')', command);
const sheet = [
    '# ' + NAME + ' — the drone section, seed ' + rolled.seed,
    '',
    '*Written by `' + command + '` — rendered from the tool, never edited by hand (PLAN.md § 1.7; DEC-48 … DEC-54; RUNNING_LOG §249).*',
    '',
    '**What it is:** ' + LEN + ' s. Each player records a multiphonic ' + REC_N + ' times — the first ' + (ENTRY === 'his' ? 'HIS (the note you played in `' + (FROM || NAME) + '`, kept as it is)' : 'rolled, a stand-in') + ', the others at rolled times ' + REC_GAP[0] + ' … ' + REC_GAP[1] + ' s apart, every opening before ' + REC_LAST + ' s, a note of the multiphonic as long as its window (the DURATION LINE in the part); a microphone opens over each for ' + REC_LEN[0] + ' … ' + REC_LEN[1] + ' s. Every recording becomes a string of DRONES on its lane with your `icy` — read in order from a start drawn inside the recording\'s longest sounding region, looping, no pitch change — each ' + DR_LEN[0] + ' … ' + DR_LEN[1] + ' s with a fade of ' + FADE[0] + ' … ' + FADE[1] + ' s (one in five up to ' + FADE_MAX + ' s), then a rest of ' + DR_REST[0] + ' … ' + DR_REST[1] + ' s; the first ' + DR_FIRST + ' s after its window ends (the render), the string going on until the player\'s next recording is rendered' + (ANY_SRC ? '; after the first drone of a player\'s last recording, each further drone takes any of the player\'s recordings (a round robin, none twice before all)' : '') + (LAST_FADE > 0 ? '; the last drone of each part runs to the end and fades out ' + LAST_FADE + ' s' : '') + '. Every dial its own exhaustive round robin: the window (' + WINS.map((w) => w.name).join(' · ') + ') · the pace (' + PACE.map((b) => '1/' + b[0] + ' … 1/' + b[1]).join(' · ') + ') · the overlaps (' + OV.map((b) => b[0] + ' … ' + b[1]).join(' · ') + ') · the grain size, steady in a band of the window\'s set or a shape over the drone. Written `' + D.level + '`. The seed is kept because the density reaches ' + rolled.density.max + ' parts and averages ' + rolled.density.mean + ' (the rule: ≥ ' + KEEP.reachParts + ' once, mean ≤ ' + KEEP.meanPartsMax + ').',
    '',
    '**To play it:** the engine restarted after 2026-10-08 (the regions, the shaped row, the buffer as long as the source) · F5 · File ▾ → Experiments → `' + NAME + '` · play from 0 with the engine up — the recordings land (the window: `regions ·` lines), the drones render after each (`process ·` lines with `the start … of the longest region`); then play from 0 again: the drones. A drone asked for before its render plays NOTHING (said in the window), never the recording.',
    '',
    '**The recordings** (opening start · window · the note):',
    '',
    '| player | ' + Array.from({ length: REC_N }, (_, i) => i + 1).join(' | ') + ' |',
    '|---|' + '---|'.repeat(REC_N),
].concat(PLAYERS.map((p) => '| ' + p.label + ' | ' + rolled.recs.filter((r) => r.player === p).map((r) => K.clock(r.openS) + ' (' + r.openS.toFixed(1) + ' s) · ' + r.windowS + ' s · ' + (r.entry === 'his' ? 'HIS' : 'key ' + r.key + ' ' + K.noteName(r.key))).join(' | ') + ' |'))
    .concat(['', '**The drones:**', '', '| # | recording | from → to | window | pace | overlaps | grain size | fades | start |', '|---|---|---|---|---|---|---|---|---|'])
    .concat(rolled.drones.map((d) => '| D' + d.i + (d.last ? ' (last)' : '') + ' | `' + d.rec.name + '`' + (d.src === d.rec ? '' : ' ← `' + d.src.name + '`') + ' | ' + K.clock(d.start) + ' → ' + K.clock(d.end) + ' (' + d.lengthS + ' s) | ' + d.window.name + ' | ' + paceOf(d) + ' | ' + d.overlaps + ' | ' + sizeOf(d) + ' | ' + d.fadeInS + ' / ' + d.fadeOutS + ' s | ' + d.startFrac + ' of the region |'))
    .concat(['', '**The density** (the most parts sounding in each 5 s): `' + rolled.density.line + '`', '', '**To change it:** a number in `bank/drone_section.json`, then `' + command + '`, then File ▾ → Reload. Another seed: `--seed N`. The free multiphonics between the recordings are yours, in post (DEC-53).', '']).join('\n');
const sheetFile = path.join(ROOT, 'docs', 'DRONE_SECTION.md');
fs.writeFileSync(sheetFile, sheet.replace(/\r\n/g, '\n'));
console.log(K.rel(OUT) + ' — ' + objects.length + ' objects (' + rolled.recs.length + ' openings, ' + rolled.recs.filter((r) => r.entry === 'rolled').length + ' simulated notes, ' + rolled.drones.length + ' drone bricks) · ' + K.rel(sheetFile));
if (fs.existsSync(path.join(ROOT, 'scores', NAME + '-work.json'))) console.log('NOTE — the page holds a working copy of ' + NAME + ' from before: File ▾ → Reload drops it and opens this one.');
if (has('render')) K.sendPlan(K.planLines(objects.filter((o) => o.properties && o.properties.drone), P), PORT);
else console.log('the plan was NOT sent (no --render): the page sends it at his pass, and the drones render as each recording lands.');
