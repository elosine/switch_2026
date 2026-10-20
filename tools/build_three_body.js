#!/usr/bin/env node
// build_three_body.js — THE THREE BODY PROBLEM, as a save the composer score opens (PLAN.md 1.6 · 14.2 · 14.3 · 14.5;
// docs/THREE_BODY.md; DEC-36 … 36e; RUNNING_LOG §188 … §191).
//
//   node tools/build_three_body.js [--seed 1] [--out scores/three-body.json] [--replace] [--dry] [--unsaved-ok]
//
// What it writes, and nothing else — ONE SECTION, from a seed:
//   · THE ROLL (score/public/three_body_roll.js; the numbers bank/three_body.json): every player — the five and the three computer
//     players — their nine containers, each length a hexagram; a close pass always with company (his "b": the next seed otherwise).
//   · THE FIVE PLAYERS' CONTAINERS, drawn on their lanes: a plain zone with the state's NAME and its colour — the ROUGH SYMBOL
//     (his word: rough for now; the drawn kind comes with the notation). Its label: the state, whom it listens to, its length,
//     its hexagram.
//   · THE FIVE, SIMULATED (score/public/three_body_sim.js): the players run together by the four states' rules; each onset is a
//     NOTE on the player's lane — one of that player's own impulse sounds (the techniques and keys of the opening's notes, the
//     score `sim.source`), `sim.noteMs` long, at the dynamic `sim.dyn` on the lane's ladder. A note says WHY it is where it is
//     (its performance note: its state and its role — pace · beat · after · bet · unprompted · rejoin).
//   · THE THREE COMPUTER PLAYERS' CONTAINERS: a PERFORMER brick each (the engine's fifth object, electronics/score/
//     le_performer.js) at the bottom of a lane — its state, whom it listens to, its PALETTE (processed impulses already rendered
//     in the bank, of the players named in `computer[].from`), its dynamic, the rules as the engine's dials. Played with the
//     engine up, each brick sends one message and the ENGINE decides, sound by sound, from what it hears.
// It refuses to write over a score it did not make, over a working copy with unsaved changes, and never a piece-… name.
// GENERATED — re-run it rather than hand-edit: another seed is another section; a number changed in bank/three_body.json is
// heard after  --replace  and File ▾ → Reload. --dry prints the roll and the counts and writes nothing.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const Roll = require(path.join(ROOT, 'score', 'public', 'three_body_roll.js')), Sim = require(path.join(ROOT, 'score', 'public', 'three_body_sim.js'));
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.join(ROOT, arg('out', 'scores/three-body.json')), NAME = path.basename(OUT, '.json'), DRY = has('dry');
const SEED = Math.max(1, Math.round(+arg('seed', 1)) || 1);
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
if (/[\\/]piece-/.test(OUT)) { console.error('refusing a piece-… name'); process.exit(3); }
if (!DRY && fs.existsSync(OUT)) {
    let mine = false; try { mine = !!JSON.parse(fs.readFileSync(OUT, 'utf8')).metadata.threeBody; } catch (e) { mine = false; }
    if (!mine) { console.error(rel(OUT) + ' is there and this tool did not make it — it is not written over'); process.exit(3); }
    if (!has('replace')) { console.error(rel(OUT) + ' is there already — --replace at his word (another seed is another section)'); process.exit(3); }
    const WORK = path.join(path.dirname(OUT), NAME + '-work.json');
    if (fs.existsSync(WORK) && !has('unsaved-ok')) {
        let same = false; try { same = JSON.stringify(JSON.parse(fs.readFileSync(WORK, 'utf8')).objects) === JSON.stringify(JSON.parse(fs.readFileSync(OUT, 'utf8')).objects); } catch (e) { same = false; }
        if (!same) { console.error('the page holds a working copy of ' + NAME + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (--unsaved-ok at his word)'); process.exit(3); }
    }
}

const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'three_body.json'), 'utf8'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const lane = (k) => { const l = TRACKS.findIndex((t) => t.instKey === k); if (l < 0) throw new Error('no lane of ' + k + ' in the composer score'); return l; };
const velFor = (instKey, midi, mark) => Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, instKey, midi, MARKS.indexOf(mark) / (MARKS.length - 1)))));
const r3 = (x) => Math.round(x * 1000) / 1000;
const shuffled = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const HUMANS = CFG.players.map((p) => p.name), COMPUTER = CFG.computer.map((c) => c.id), ALL = HUMANS.concat(COMPUTER);
for (const p of CFG.players) if (!ROUTE.players.some((q) => q.name === p.name)) throw new Error('bank/three_body.json names a player the engine does not know: ' + p.name + ' (bank/elec_route.json players)');
const LABEL = CFG.labels || Roll.NAMES, COLOR = CFG.colors || {};

// ---- the roll, and who listens to whom ----------------------------------------------------------------------------------
// THE FIT (his "let's try 110 seconds", 2026-10-06, DEC-37): --fit N, or the data's `fitS` — from the seed asked on, the KEPT roll whose
// length lands nearest N (Roll.rollFit, the check re-rolls the same way); 0 = the seed as it is. The ranges stay his; only the seed is chosen.
const FIT = has('fit') ? Math.max(0, +arg('fit', 0) || 0) : Math.max(0, +CFG.fitS || 0);
const rolled = FIT > 0 ? Roll.rollFit(CFG, ALL, SEED, FIT) : Roll.rollKept(CFG, ALL, SEED);
Roll.targets(rolled, HUMANS, HUMANS, rolled.seedUsed);        // the five listen to the five
Roll.targets(rolled, COMPUTER, ALL, rolled.seedUsed + 1);     // the three computer players to all eight
const by = Object.fromEntries(rolled.players.map((p) => [p.name, p]));

// ---- the five, simulated ----------------------------------------------------------------------------------------------------
const sim = Sim.run({ players: HUMANS.map((n) => by[n]), rules: CFG.rules, seed: rolled.seedUsed, stepMs: (CFG.sim && CFG.sim.stepMs) || 5 });

// each player's own impulse sounds: the techniques and keys of the opening's tagged notes, lane by lane
const SRC = (CFG.sim && CFG.sim.source) || 'piece-sec01-a', srcFile = path.join(ROOT, 'scores', SRC + '.json');
const srcNotes = JSON.parse(fs.readFileSync(srcFile, 'utf8')).objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.impulse);
const vocab = {}, turn = {};
CFG.players.forEach((p, i) => {
    const lanes = p.lanes.map(lane), seen = new Set(), list = [];
    for (const n of srcNotes) if (lanes.includes(n.layer)) { const k = n.layer + '|' + n.technique + '|' + n.sonifyNote; if (!seen.has(k)) { seen.add(k); list.push({ lane: n.layer, technique: n.technique, key: n.sonifyNote }); } }
    if (!list.length) throw new Error('the score ' + SRC + ' holds no impulse note of ' + p.name + ' — the simulated player has no sound');
    for (const v of list) { const I = INSTRUMENTS[TRACKS[v.lane].instKey]; if (!I || !I.techniques.some((t) => t.key === v.technique)) throw new Error(p.name + ': ' + v.technique + ' is not a technique of ' + TRACKS[v.lane].instKey); }
    vocab[p.name] = shuffled(list.sort((a, b) => (a.lane - b.lane) || String(a.technique).localeCompare(b.technique) || (a.key - b.key)), Roll.mulberry32((rolled.seedUsed * 9973 + (i + 1) * 101) >>> 0));
    turn[p.name] = 0;
});

const ROLE = { pace: 'its own pace', beat: 'a beat after', after: 'just after', bet: 'a bet before', unprompted: 'unprompted', rejoin: 'rejoins as a cluster breaks', 'rejoin-alone': 'rejoins — no cluster came' };
let nextId = 1;
const objects = [];
const zone = (o) => Object.assign({ id: 'zn-' + (nextId++), type: 'zone', layer: 0, startTime: 0, endTime: 1, player: '', instrument: '', zoneFunction: '', midiModel: '',
    ostinatoParams: { smooth: 0.7, speed: 1, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '', responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02,
    midiSnippet: null, color: '#9E9E9E', opacity: 0.3, yOffset: 0, zoneHeight: 0.16, performanceNotes: '', properties: {} }, o);
const stateName = (c) => (c.state === 'change' ? 'change: ' + LABEL[c.from] + ' → ' + LABEL[c.to] : LABEL[c.state]);
const listensTo = (c) => (c.state === 'approaching' || c.state === 'closePass' ? c.target : c.state === 'change' ? (c.to === 'approaching' || c.to === 'closePass' ? c.target : c.targetFrom) : '') || '';
const rollText = (c) => (c.endCap ? 'to the end' : (c.hexSilence ? 'silence ' + c.silenceS.toFixed(1) + ' s ' + String.fromCodePoint(0x4DC0 + c.hexSilence - 1) + ' ' + c.hexSilence + ' + ' : '') + String.fromCodePoint(0x4DC0 + c.hex - 1) + ' ' + c.hex);

// ---- the five players' containers: the rough symbols -------------------------------------------------------------------
for (const p of CFG.players) for (const c of by[p.name].containers) {
    const tg = listensTo(c);
    objects.push(zone({ layer: lane(p.lanes[0]), startTime: c.start, endTime: c.end, zoneFunction: 'tb', color: COLOR[c.state] || '#9E9E9E',
        player: stateName(c) + (tg ? ' → ' + tg : ''), instrument: (c.end - c.start).toFixed(1) + ' s · ' + rollText(c),
        performanceNotes: 'THE THREE BODY PROBLEM — ' + p.label + ': ' + stateName(c),
        properties: { tb: { player: p.name, index: c.index, state: c.state, from: c.from || '', to: c.to || '', target: c.target || '', targetFrom: c.targetFrom || '', hex: c.hex || 0, lines: c.lines || '',
            hexSilence: c.hexSilence || 0, silenceS: c.silenceS || 0, seed: rolled.seedUsed } } }));
}

// ---- the five players' notes ------------------------------------------------------------------------------------------------
const noteS = ((CFG.sim && CFG.sim.noteMs) || 150) / 1000, dyn = (CFG.sim && CFG.sim.dyn) || 'f';
for (const o of sim.onsets) {
    const v = vocab[o.player][turn[o.player]++ % vocab[o.player].length], instKey = TRACKS[v.lane].instKey;
    const why = LABEL[o.rule] + ' · ' + ROLE[o.role] + (o.ref ? ' ' + o.ref : '') + (o.role === 'bet' ? (o.hit ? ' — hit' : ' — MISS') + (o.errMs != null ? ' (' + (o.errMs > 0 ? '+' : '') + o.errMs + ' ms)' : '') : '');
    objects.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: v.lane, startSeconds: o.t, endSeconds: r3(o.t + noteS),
        nodes: [{ pos: 0, y: 10, smooth: 0.25 }, { pos: 1, y: 10, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
        color: COLOR[o.rule] || '#607D8B', fillMode: 'bottom', opacity: 0.55, performanceNotes: why,
        properties: { tb: { player: o.player, state: o.state, rule: o.rule, role: o.role, gen: o.gen, ref: o.ref || '', hit: o.role === 'bet' ? !!o.hit : undefined } },
        sonifyNote: v.key, technique: v.technique, sonifyMode: 'plain', recVel: velFor(instKey, v.key, dyn) });
}

// ---- the three computer players: their palettes, their containers ----------------------------------------------------------
const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'samples', 'index.json'), 'utf8')).samples || [];
const presets = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'presets.json'), 'utf8')).presets || [];
const dealt = new Set(presets.filter((p) => p.deal !== false).map((p) => p.key));
const E = CFG.electronics || {}, envs = new Set(E.envelopes && E.envelopes.length ? E.envelopes : ['tail']);
const split = (name) => { const v = String(name).split('~')[1] || '', i = v.lastIndexOf('-'); return i > 0 ? { key: v.slice(0, i), env: v.slice(i + 1) } : { key: v, env: '' }; };
const R = CFG.rules || {}, flat = (o, map) => Object.fromEntries(Object.entries(map).filter(([k, v]) => v != null && Number.isFinite(+v)).map(([k, v]) => [k, +v]));
const two = (x, i) => (Array.isArray(x) ? x[i] : null);
// the piece's rules under the engine's own names (electronics/sc/performer.scd perfDefaults)
const DIALS = flat(null, { gapLo: two((R.pace || {}).gapMs, 0), gapHi: two((R.pace || {}).gapMs, 1), jitter: (R.pace || {}).jitter,
    beatLo: two((R.approaching || {}).beatMs, 0), beatHi: two((R.approaching || {}).beatMs, 1), holdMs: (R.approaching || {}).holdMs, depthA: (R.approaching || {}).depth,
    waitALo: two((R.approaching || {}).waitMs, 0), waitAHi: two((R.approaching || {}).waitMs, 1),
    tightLo: two((R.closePass || {}).tightMs, 0), tightHi: two((R.closePass || {}).tightMs, 1), betLo: two((R.closePass || {}).betMs, 0), betHi: two((R.closePass || {}).betMs, 1),
    missMs: (R.closePass || {}).missMs, beforeShare: (R.closePass || {}).beforeShare, selfMs: (R.closePass || {}).selfMs, depthC: (R.closePass || {}).depth,
    waitCLo: two((R.closePass || {}).waitMs, 0), waitCHi: two((R.closePass || {}).waitMs, 1), predictLo: two((R.closePass || {}).predictMs, 0), predictHi: two((R.closePass || {}).predictMs, 1),
    windowMs: (R.breakRejoin || {}).windowMs, count: (R.breakRejoin || {}).count, breakGapMs: (R.breakRejoin || {}).breakGapMs,
    enterLo: two((R.breakRejoin || {}).enterMs, 0), enterHi: two((R.breakRejoin || {}).enterMs, 1), guardMs: R.guardMs });
// THE SOURCES (DEC-37): `electronics.sources` 'score' = only the samples the source score CAPTURES (its openings' names — the impulse
// bank, so the computer players draw on the same batch the five play); 'bank' or absent = every impulse of the player in the bank.
const SRC_NAMES = new Set(JSON.parse(fs.readFileSync(srcFile, 'utf8')).objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecOpen' && o.elec && o.elec.name).map((o) => o.elec.name));
const FROM_SCORE = String(E.sources || 'bank') === 'score';
const palettes = {};
CFG.computer.forEach((cp, i) => {
    // the renders in the bank: a processed impulse of one of this computer player's players, under a dealt preset and one of the envelopes
    const poolAll = index.filter((r) => r.kind === 'processed' && r.planned && cp.from.includes(r.player) && /-impulse-\d+$/.test(String(r.source || ''))
        && !/_d[A-Za-z0-9]+$/.test(r.name) && dealt.has(split(r.name).key) && envs.has(split(r.name).env) && fs.existsSync(path.join(ROOT, 'bank', 'samples', r.file)));
    let pool = FROM_SCORE ? poolAll.filter((r) => SRC_NAMES.has(r.source)) : poolAll;
    if (FROM_SCORE && !pool.length && poolAll.length) { console.warn('  ! ' + cp.id + ': no rendered variant yet of the samples ' + SRC + ' captures for ' + cp.from.join(' · ') + ' — the palette from the bank\'s earlier impulses THIS ONCE; run again after his pass'); pool = poolAll; }
    const size = Math.max(1, +E.paletteSize || 18), rnd = Roll.mulberry32((rolled.seedUsed * 6151 + (i + 1) * 389) >>> 0), pal = [], perSource = {}, usedKey = new Set();
    const cap = Math.ceil(size / Math.max(1, new Set(pool.map((r) => r.source)).size));
    // spread: no preset twice, the impulses evenly — then whatever is left, if the palette is not full
    for (const pass of [0, 1]) for (const r of shuffled(pool, rnd)) {
        if (pal.length >= size) break;
        if (pal.includes(r.name)) continue;
        const k = split(r.name).key;
        if (pass === 0 && (usedKey.has(k) || (perSource[r.source] || 0) >= cap)) continue;
        pal.push(r.name); usedKey.add(k); perSource[r.source] = (perSource[r.source] || 0) + 1;
    }
    if (!pal.length) console.warn('  ! ' + cp.id + ': the bank holds no rendered variant of ' + cp.from.join(' · ') + ' — its bricks have NO PALETTE and will be silent');
    palettes[cp.id] = pal;
    for (const c of by[cp.id].containers) {
        const elec = { id: cp.id, state: c.state, pal, mark: E.mark || 'mf', seed: rolled.seedUsed * 10 + i + 1, ear: E.ear === 'mic' ? 'mic' : 'sim', dials: DIALS, label: '' };
        if (c.state === 'change') { elec.from = c.from; elec.to = c.to; }
        if (c.target) elec.target = c.target;
        if (c.targetFrom) elec.targetFrom = c.targetFrom;
        if (c.state === 'breakRejoin') elec.silenceMs = Math.round((c.silenceS || 0) * 1000);
        objects.push(zone({ layer: lane(cp.lane), startTime: c.start, endTime: c.end, zoneFunction: 'elec', midiModel: 'elecPerformer', color: COLOR[c.state] || '#546E7A', opacity: 0.35, yOffset: 1, zoneHeight: 0.16,
            performanceNotes: 'THE THREE BODY PROBLEM — the computer player ' + cp.id + ' (' + cp.label + '): ' + stateName(c),
            properties: { tb: { player: cp.id, index: c.index, state: c.state, hex: c.hex || 0, lines: c.lines || '', hexSilence: c.hexSilence || 0, seed: rolled.seedUsed } }, elec }));
    }
});

// ---- what was made, said ------------------------------------------------------------------------------------------------------
const table = Roll.table(rolled), per = {};
for (const o of sim.onsets) per[o.player] = (per[o.player] || 0) + 1;
const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');
const command = 'node tools/build_three_body.js --seed ' + rolled.seedAsked + (rolled.fitS ? ' --fit ' + rolled.fitS : '') + (arg('out') ? ' --out ' + arg('out') : '') + ' --replace';
console.log('THE THREE BODY PROBLEM — seed ' + rolled.seedAsked + (rolled.fitS ? ' → fit to ' + rolled.fitS + ' s: seed ' + rolled.seedUsed : rolled.seedUsed !== rolled.seedAsked ? ' (kept: ' + rolled.seedUsed + ', the ' + rolled.tries + 'th tried — a close pass was alone before)' : '') + ' · ' + rolled.lengthS.toFixed(1) + ' s (' + mmss(rolled.lengthS) + ')');
table.forEach((l) => console.log('  ' + l));
console.log('the five, simulated: ' + sim.onsets.length + ' notes — ' + HUMANS.map((n) => n + ' ' + (per[n] || 0)).join(' · '));
console.log('  by what made them: ' + Object.entries(sim.counts).map(([k, v]) => k + ' ' + v).join(' · '));
CFG.computer.forEach((cp) => console.log('  ' + cp.id + ' (' + cp.label + '): ' + palettes[cp.id].length + ' processed impulses — ' + palettes[cp.id].slice(0, 4).join(' · ') + (palettes[cp.id].length > 4 ? ' …' : '')));
if (DRY) { console.log('(--dry: nothing written)'); process.exit(0); }

const now = new Date().toISOString();
const save = {
    version: 1, layoutVersion: 8, tracks: TRACKS, assets: {},
    metadata: { created: now, modified: now,
        note: 'THE THREE BODY PROBLEM (PLAN 1.6; docs/THREE_BODY.md) — one section from seed ' + rolled.seedUsed + ', ' + mmss(rolled.lengthS) + ': every player runs ONE ORBIT — far apart · approaching · close pass · break and rejoin · far apart, the change between two a container of its own — on time containers rolled by hexagrams. The five players\' containers are the labelled zones at the top of their lanes; their NOTES are a simulation by the four states\' rules (a note\'s performance note says why it is where it is). The three computer players (e1 the winds\' samples · e2 the percussion\'s · e3 the strings\') are the bricks at the bottom of three lanes: with the engine up they LISTEN and decide sound by sound — the engine\'s window says why. GENERATED by tools/build_three_body.js: another seed is another section.',
        threeBody: { seedAsked: rolled.seedAsked, seedUsed: rolled.seedUsed, tries: rolled.tries, lengthS: rolled.lengthS, fitS: rolled.fitS || 0, source: SRC, sources: FROM_SCORE ? 'score' : 'bank', command, made: now, notes: sim.onsets.length, counts: sim.counts, perPlayer: per,
            table: rolled.players.flatMap((p) => p.containers.map((c) => [p.name, c.index, c.state, c.from || '', c.to || '', c.start, c.end, c.hex || 0, c.hexSilence || 0, c.silenceS || 0, c.target || '', c.targetFrom || ''])),
            tableColumns: ['player', 'index', 'state', 'from', 'to', 'start', 'end', 'hexagram', 'hexagramSilence', 'silenceS', 'target', 'targetFrom'], palettes, rules: sim.rules } },
    objects, markers: [], databases: {}, nextId, viewport: { pixelsPerSecond: 30, scrollOffset: 0 },
};
fs.writeFileSync(OUT, JSON.stringify(save, null, 1) + '\n');
console.log(rel(OUT) + ' — ' + CFG.players.length * 9 + ' containers of the five · ' + sim.onsets.length + ' notes · ' + CFG.computer.length * 9 + ' performer bricks');
console.log('again, the same: ' + command);
