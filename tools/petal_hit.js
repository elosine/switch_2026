#!/usr/bin/env node
// petal_hit.js — THE PETAL HIT (his pattern, 2026-10-07, DEC-44 · RUNNING_LOG §216): a trill runs to its end; AT ITS END another
// player plays a short note INTO THE MICROPHONE, and that capture comes back through ONE OF THE PETALS OF RESONANCE — a setting of
// his bank (bank/petals_bank.json), ROLLED EXHAUSTIVELY by the petals roll's own algorithm (tools/build_petals_roll.js `roll`: a
// seeded shuffle, none twice until all 26 are used; the grit after it in his proportions). Notated precisely: a cue at the trill's end.
//
// What ONE hit is in the score (three objects on the player's lane, as tools/impulse.js makes an impulse):
//   · the NOTE — the player's impulse technique (the bass clarinet's slap), the technique's middle key, 150 ms, the dynamic's velocity
//     (mf by default, through the ladder); in the real piece the live instrument
//   · the MIC OPENING over it — 100 ms before, 500 ms long; the sample named <player>-petal-<k>, category impulse
//   · the RETURN at the note (`--gap` s after it) — plain behaviour, the sample processed as preset pp<k> under the `tail` envelope: the
//     k-th roll of the piece's petals sequence (seed fixed by the FIRST hit; every later hit continues it — exhaustive by construction)
//   The preset pp<k> is written into bank/presets.json (`deal: false`, `audition: piece-petals`): never dealt, kept by a generation.
//   The record: `properties.petalHit` on the three objects (k · the seed · the roll's setting and grit · what it follows · the command).
//
//   node tools/petal_hit.js --score <name> --after <trill zone id | note id> [--player auto | bcl] [--tech slap] [--dyn mf] [--level ff] [--gap 0] [--seed 1] [--dry]
//       --player auto (the default): a free player — with a microphone, not the one whose trill just ended, nothing of his sounding
//                from the hit to 0.6 s after; among the free the one whose last hit is the oldest. His impulse technique (impulses.json row 1).
//       --note   the hit's key outright, or `mid` (the technique's middle); absent: SPREAD across the technique's range — five bands in
//                a seeded order per player, a seeded key inside the band (§220: "more varied pitches and across the range")
//       --dyn    the PLAYER's mark: how hard the note is hit (the ladder's velocity for the technique)
//       --level  the ELECTRONICS' mark: the return's written dynamic (elec.dyn — the petals played at that mark against the render's
//                own loudness, step 11.3); absent = as played, the render's own level. "the filter too quiet" → --level ff (his word, §218)
//   node tools/petal_hit.js --score <name> --at <seconds> --player bcl …                 at a time instead
//   node tools/petal_hit.js --score <name> --off <k>                                      hit k out again (its three objects and its preset)
//   … --k <n>                                                                            re-place slot n of the sequence (its roll, its preset key) after --off n
//
// THE RENDER: the engine renders the capture's petals variant right after the capture (the plan the page sends at a pass's first
// frame). On the FIRST pass through a new hit the return plays the capture RAW (the render is being made, `late` in the engine's
// window); from the second pass it plays the petals at the brick. A concert has one pass: the gap, or a real-time petals path, is a
// design point (docs/NITS.md).
// IT WRITES THE SCORE. The working copy's guard compares the objects WITHOUT the page's live stamps (a trill's `midiSnippet`, a
// note's `mutedBy`) — those are the page's, not his edits; anything else unsaved refuses the tool (CTRL+S or File ▾ → Reload first;
// `--unsaved-ok` at his word only). THE SORTING: the piece's (its lanes, its save, its route table, its bank); the roll is the piece's too.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const K = require('./audition_kit.js');
const { roll } = require('./build_petals_roll.js');
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !/^--/.test(process.argv[i + 1]) ? process.argv[i + 1] : d; };
const die = (msg, code) => { console.error(msg); process.exit(code || 2); };
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const TAG = 'piece-petals', CAP_MS = 16000, LEN_S = 0.150, BEFORE_S = 0.1, WINDOW_S = 0.5;   // the impulse standard (tools/impulse.js) and the petals' cap (build_petals_roll.js)
const NAMES = { 'od-hard': 'overdrive hard', 'od-mild': 'overdrive mild', fuzz: 'fuzz', loop: '→ one loop', clean: 'clean' };

const name = arg('score');
if (!name) die('usage: node tools/petal_hit.js --score <name> (--after <id> | --at <s>) --player bcl [--tech slap] [--dyn mf] [--gap 0] [--seed 1] [--dry] | --off <k>');
const file = path.join(ROOT, 'scores', name.replace(/\.json$/, '') + '.json');
if (!fs.existsSync(file)) die('no such score: ' + path.relative(ROOT, file));
const save = JSON.parse(fs.readFileSync(file, 'utf8'));
const TRACKS = save.tracks;
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const BANK = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'petals_bank.json'), 'utf8'));
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));

// the page's working copy — his unsaved edits are not written over; the page's own live stamps are not edits
const working = file.replace(/\.json$/, '-work.json');
if (!has('unsaved-ok') && fs.existsSync(working)) {
    const strip = (o) => { const c = Object.assign({}, o); delete c.midiSnippet; delete c.mutedBy; Object.keys(c).forEach((k) => { if (k[0] === '_') delete c[k]; }); return c; };
    const essence = (s) => { try { const o = JSON.parse(s); return JSON.stringify((o.objects || []).map(strip)); } catch (e) { return s; } };
    const same = essence(fs.readFileSync(working, 'utf8')) === essence(fs.readFileSync(file, 'utf8'));
    if (!same && !has('dry')) die('the page holds a working copy of ' + path.basename(file) + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (or --unsaved-ok at his word).', 3);
    console.log(same ? '(the working copy differs from the save only by the page\'s own stamps, if at all; Reload in the page after this)' : '(THE PAGE HOLDS UNSAVED CHANGES — this dry run is of the SAVE, not of what the page shows)');
}

const hits = () => save.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecPlay' && o.properties && o.properties.petalHit).sort((a, b) => a.properties.petalHit.k - b.properties.petalHit.k);
const out = [], command = 'node tools/petal_hit.js ' + process.argv.slice(2).filter((x) => x !== '--dry').join(' ');

if (arg('off') != null) {
    const k = +arg('off');
    const gone = save.objects.filter((o) => o.properties && o.properties.petalHit && o.properties.petalHit.k === k);
    if (!gone.length) die('no petal hit ' + k + ' in ' + name + ' (' + hits().length + ' hits: ' + hits().map((h) => h.properties.petalHit.k).join(', ') + ')', 1);
    save.objects = save.objects.filter((o) => !gone.includes(o));
    out.push('petal hit ' + k + ' off: ' + gone.map((o) => o.id + ' ' + (o.midiModel || o.type)).join(' · '));
    if (!has('dry')) {   // its preset too — the tag's rows re-written without it
        const P = K.readJson(K.PRESETS), rows = P.presets.filter((p) => p.audition === TAG && p.key !== 'pp' + String(k).padStart(2, '0')).map((p) => { const c = Object.assign({}, p); delete c.deal; delete c.audition; return c; });
        K.writePresets(TAG, rows, 'the piece\'s petal hits — the petals of resonance rolled exhaustively at the trills\' ends (DEC-44)', command);
    }
} else {
    // WHEN: the end of what it follows, or a time
    let T, follows = null;
    if (arg('after')) {
        follows = save.objects.find((o) => o.id === arg('after'));
        if (!follows) die('no object ' + arg('after') + ' in the score');
        T = follows.type === 'zone' ? follows.endTime : follows.endSeconds;
        if (T == null) die(arg('after') + ' has no end');
    } else if (arg('at') != null) T = +arg('at');
    else die('--after <id> or --at <seconds>');
    T = Math.round(T * 1000) / 1000;
    // WHO: the player — by the route's name, his short name or the lane; or AUTO (his word, §219: "just choose an available player"):
    // a player with a microphone who is NOT the one whose trill just ended and has nothing sounding from the hit to 0.6 s after it
    // (a note or a trill on any of his lanes — the percussionist owns two); among the free, the one whose last hit is the oldest.
    // Each player's hit is his IMPULSE technique (bank/impulses.json row 1, his dictation: slap · slap · taiko sticks · Bartók · gettato).
    const IMP1 = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'impulses.json'), 'utf8'))['1'] || [];
    const laneOfInst = (instKey) => TRACKS.findIndex((t) => t.instKey === instKey);
    const playerOfLane = (L) => { const inst = INSTRUMENTS[TRACKS[L].instKey] || {}; return (ROUTE.players.find((p) => (p.ports || [p.port]).includes(inst.port)) || {}).name || ''; };
    const defaultHit = (pl) => { const slot = IMP1.find((q) => laneOfInst(q.lane) >= 0 && playerOfLane(laneOfInst(q.lane)) === pl); return slot ? { lane: laneOfInst(slot.lane), tech: slot.tech } : null; };
    const who = String(arg('player', 'auto')).toLowerCase();
    let lane, player, chosen = '';
    if (who === 'auto') {
        const a = T + 0.01, b = T + 0.6;
        const busyLane = (L) => save.objects.some((o) => o.layer === L && ((o.type === 'waveCurve' && o.sonifyNote != null && o.endSeconds > a && o.startSeconds < b) || (o.type === 'zone' && o.midiModel === 'trill' && o.endTime > a && o.startTime < b)));
        const trilling = follows ? playerOfLane(follows.layer) : '';
        const lastUse = {}; hits().forEach((h) => { lastUse[(h.properties.petalHit.player) || String(h.elec && h.elec.name || '').split('-')[0]] = h.properties.petalHit.k; });
        const cands = ROUTE.players.map((p) => p.name).filter((n) => n !== trilling && defaultHit(n)).filter((n) => !TRACKS.some((t, L) => playerOfLane(L) === n && busyLane(L)));
        if (!cands.length) die('no player is free at ' + T.toFixed(3) + ' s (' + (trilling ? trilling + ' trilling; ' : '') + 'every other microphone busy)');
        cands.sort((x, y) => (lastUse[x] || 0) - (lastUse[y] || 0));
        player = cands[0]; lane = defaultHit(player).lane; chosen = ' (free: ' + cands.join(' ') + ')';
    } else {
        lane = TRACKS.findIndex((t) => [t.id, t.short, t.label, t.instKey].map((x) => String(x || '').toLowerCase()).includes(who) || (ROUTE.players.find((p) => p.name === who) || {}).port === (INSTRUMENTS[t.instKey] || {}).port);
        if (lane < 0) die('--player: no lane for "' + who + '" (auto, or one of ' + TRACKS.map((t) => t.short).join(', ') + ')');
        player = playerOfLane(lane);
        if (!player) die(TRACKS[lane].label + ' has no microphone in bank/elec_route.json');
    }
    const inst = INSTRUMENTS[TRACKS[lane].instKey];
    const techKey = arg('tech', (defaultHit(player) || {}).tech || 'slap'), tech = (inst.techniques || []).find((q) => q.key === techKey);
    if (!tech) die(TRACKS[lane].label + ' has no technique "' + techKey + '" — one of: ' + (inst.techniques || []).map((q) => q.key).join(', '));
    // THE ZONE a technique really sounds in, where the recipe's range is the instrument's whole: the Xsample slap presets (SWEEP_LIST #3:
    // the bass flute's measured 48 … 64 — and 64 gave a silent capture on 2026-10-07, §221, so 63); a key outside is a FUNCTION KEY
    // … and the viola's Bartók pizzicato (§229: key 93, the recipe's top, captured 80 ms at −56 LUFS — no sound; the impulse bank's keys were
    // 50 · 65 · 80, and hit 6 at 51 captured −26 LUFS): 50 … 80
    const ZONES = { bass_flute: { slap: [48, 63] }, viola: { bartok_vel: [50, 79] } };
    const zn = (ZONES[TRACKS[lane].instKey] || {})[tech.key];
    const lo = zn ? zn[0] : tech.rangeLow != null ? tech.rangeLow : inst.rangeLow, hi = zn ? zn[1] : tech.rangeHigh != null ? tech.rangeHigh : inst.rangeHigh;
    // THE PITCH (§220, his word: "more varied pitches and across the range of that instrument"): the technique's range cut into five
    // BANDS; a player's successive hits take the bands in a seeded order, none twice until all five are used, and a seeded key inside
    // the band — so one player's hits walk the whole range. `--note <key>` says it outright; `--note mid` the middle (as before).
    const prevAll = hits(), kSlot = arg('k') != null ? Math.round(+arg('k')) : (prevAll.length ? prevAll[prevAll.length - 1].properties.petalHit.k + 1 : 1);
    const mine = prevAll.filter((h) => ((h.properties.petalHit.player) || String(h.elec && h.elec.name || '').split('-')[0]) === player).map((h) => h.properties.petalHit.k).concat([kSlot]).sort((x, y) => x - y);
    const prevMine = mine.indexOf(kSlot);   // this slot's place among the player's slots: the band walks the range in that order; the key inside is the SLOT's (a re-placed slot draws its own, never another slot's — §221)
    const spreadKey = () => {
        const BANDS = 5, seed0 = (prevAll.length ? prevAll[0].properties.petalHit.seed : Math.max(1, Math.round(+arg('seed', 1))));
        const rnd = K.mulberry32(seed0 * 7919 + ROUTE.players.findIndex((p) => p.name === player) * 101 + Math.floor(prevMine / BANDS) * 13);
        const order = [...Array(BANDS).keys()]; for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
        const band = order[prevMine % BANDS], w = (hi - lo + 1) / BANDS;
        const r2 = K.mulberry32(seed0 * 7919 + kSlot * 31 + ROUTE.players.findIndex((p) => p.name === player) * 101 + 1);
        return Math.min(hi, Math.max(lo, Math.round(lo + band * w + r2() * (w - 1))));
    };
    let note = arg('note') != null ? (arg('note') === 'mid' ? Math.round((lo + hi) / 2) : +arg('note')) : spreadKey();
    if (Array.isArray(tech.keys) && tech.keys.length && !tech.keys.some((q) => q.midi === note)) note = tech.keys.reduce((b, q) => (Math.abs(q.midi - note) < Math.abs(b.midi - note) ? q : b), tech.keys[0]).midi;   // a by-key voice: the nearest key it has
    const dyn = arg('dyn', 'mf');
    if (!MARKS.includes(dyn)) die('--dyn: a mark (' + MARKS.join(' ') + ')');
    const vel = Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, TRACKS[lane].instKey, note, MARKS.indexOf(dyn) / (MARKS.length - 1)))));
    const gap = +arg('gap', 0);
    const level = arg('level', '');
    if (level && !MARKS.includes(level)) die('--level: a mark (' + MARKS.join(' ') + ')');
    // THE ROLL: the k-th of the piece's sequence; the seed is the first hit's
    const prev = hits(), k = arg('k') != null ? Math.round(+arg('k')) : (prev.length ? prev[prev.length - 1].properties.petalHit.k + 1 : 1);   // --k: re-place THIS slot of the sequence (after --off k)
    if (prev.some((h) => h.properties.petalHit.k === k)) die('petal hit ' + k + ' exists — --off ' + k + ' first');
    const seed = prev.length ? prev[0].properties.petalHit.seed : Math.max(1, Math.round(+arg('seed', 1)));
    if (prev.length && arg('seed') != null && +arg('seed') !== seed) die('the piece\'s petals sequence runs on seed ' + seed + ' since hit 1 — --seed changes nothing after it (--off every hit to start over)');
    // slot k of the sequence — unless the score already uses that setting (the pool changed under earlier hits: #52 retired 2026-10-08,
    // and the shuffle shifted): then the first setting after it in the sequence that no hit has yet — none twice, whatever the pool did
    // (a LAP is the pool's length: past it the sequence starts over, as the roll does — "none twice" holds within a lap)
    const lap = Math.floor((k - 1) / BANK.settings.length), lapK = (h) => Math.floor((h.properties.petalHit.k - 1) / BANK.settings.length);
    const used = new Set(prev.filter((h) => h.properties.petalHit.k !== k && lapK(h) === lap).map((h) => h.properties.petalHit.setting));
    const seq = roll(BANK, Math.max(k, BANK.settings.length * (lap + 1)), seed);
    let d = seq[k - 1];
    if (used.has(d.setting.n)) { const lapSeq = seq.slice(lap * BANK.settings.length, (lap + 1) * BANK.settings.length); const alt = lapSeq.slice((k - 1) % BANK.settings.length + 1).find((x) => !used.has(x.setting.n)) || lapSeq.find((x) => !used.has(x.setting.n)); if (alt) { console.log('slot ' + k + ' rolled petals #' + d.setting.n + ', already in the piece — the next unused of the sequence taken: #' + alt.setting.n); d = alt; } }
    const key = 'pp' + String(k).padStart(2, '0');
    const args = Object.assign({ poMix: 1, poFund: d.setting.fund, poFirst: d.setting.first, poSpread: d.setting.spread, poOffset: d.setting.offset, poRingLo: d.setting.ringLo, poRingHi: d.setting.ringHi, poInLen: 1 }, d.effect === 'clean' ? {} : BANK.effects.dials[d.effect]);
    const preset = { key, name: 'petal hit ' + k + ' · ' + NAMES[d.effect].toUpperCase() + ' — petals #' + d.setting.n + ' · fund ' + d.setting.fund + ' Hz · first partial ' + d.setting.first + ' · spread ' + d.setting.spread + ' · bank B +' + d.setting.offset + ' st · ring ' + d.setting.ringLo + ' … ' + d.setting.ringHi + ' s', effect: 'petalsOrig', class: 'time', capMs: CAP_MS, args };
    // THE OBJECTS
    let nextId = Math.max(+save.nextId || 1, 1 + save.objects.reduce((m, o) => { const q = /-(\d+)$/.exec(String(o.id || '')); return q ? Math.max(m, +q[1]) : m; }, 0));
    const smp = player + '-petal-' + k;
    const rec = { k, seed, player, setting: d.setting.n, fund: d.setting.fund, effect: d.effect, preset: key, sample: smp, after: follows ? follows.id : null, at: T, command };
    const y = Math.max(1, Math.round((vel / 127) * 100) / 10);
    const noteObj = { id: 'wc-' + (nextId++), type: 'waveCurve', layer: lane, startSeconds: T, endSeconds: Math.round((T + LEN_S) * 1000) / 1000,
        nodes: [{ pos: 0, y, smooth: 0.25 }, { pos: 1, y, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }], color: '#607D8B', fillMode: 'bottom', opacity: 0.55,
        performanceNotes: 'petal hit ' + k + ' — into the microphone, at the end of the trill', properties: { petalHit: rec }, sonifyNote: note, technique: tech.key, sonifyMode: 'plain', recVel: vel };
    const zone = (start, end, elec, model, yOffset) => ({ id: 'zn-' + (nextId++), type: 'zone', layer: lane, startTime: Math.round(start * 1000) / 1000, endTime: Math.round(end * 1000) / 1000, player: '', instrument: '', zoneFunction: 'elec', midiModel: model,
        ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '', responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null,
        color: model === 'elecPlay' ? '#8E24AA' : '#00897B', opacity: 0.35, yOffset, zoneHeight: 0.2, performanceNotes: '', properties: { petalHit: rec }, elec });
    const open = zone(Math.max(0, T - BEFORE_S), T - BEFORE_S + WINDOW_S, { name: smp, category: 'impulse', player }, 'elecOpen', 0);
    // THE OPENING NEVER OVERLAPS ITS PLAYER'S NEXT TRILL OR NEXT OPENING (his word 2026-10-08, RUNNING_LOG §237): the ring may run into the
    // trill, the microphone may not — the opening ends 40 ms before whichever comes first, the note kept inside (never under 300 ms)
    {
        const myLanes = TRACKS.map((t, i) => i).filter((i) => playerOfLane(i) === player);
        const nextStart = Math.min(...save.objects.filter((o) => o.type === 'zone' && (o.midiModel === 'trill' || o.midiModel === 'elecOpen') && myLanes.includes(o.layer) && o.startTime > open.startTime && o.startTime < open.endTime).map((o) => o.startTime));
        if (Number.isFinite(nextStart)) { const end = Math.round(Math.max(open.startTime + 0.3, nextStart - 0.04) * 1000) / 1000; if (end < open.endTime) { out.push('  the mic opening shortened to ' + Math.round((end - open.startTime) * 1000) + ' ms: the ' + player + '\'s next trill or opening begins at ' + nextStart + ' s'); open.endTime = end; } }
    }
    const ret = zone(T + gap, T + gap + 0.5, Object.assign({ name: smp, label: 'petal ' + k + ' · #' + d.setting.n + ' ' + Math.round(d.setting.fund) + ' Hz' + (d.effect === 'clean' ? '' : ' · ' + NAMES[d.effect]), variants: { [smp]: key + '-tail' } }, level ? { dyn: { mode: 'mark', mark: level } } : {}), 'elecPlay', 1);
    save.objects.push(noteObj, open, ret);
    save.nextId = nextId;
    out.push('petal hit ' + k + (follows ? ' after ' + follows.id + (follows.trill ? ' (the trill)' : '') : '') + ' at ' + T.toFixed(3) + ' s — ' + TRACKS[lane].label + chosen + ' ' + tech.label + ' key ' + note + ' vel ' + vel + ' (' + dyn + ') 150 ms · mic ' + smp + ' (' + open.startTime + ' → ' + open.endTime + ') · return ' + ret.id + ' at ' + ret.startTime + ' s: ' + key + ' = petals #' + d.setting.n + ' ' + d.setting.fund + ' Hz · ' + NAMES[d.effect] + (level ? ' · played ' + level : ' · as played') + ' · seed ' + seed);
    if (!has('dry')) {
        const P = K.readJson(K.PRESETS), rows = P.presets.filter((p) => p.audition === TAG && p.key !== key).map((p) => { const c = Object.assign({}, p); delete c.deal; delete c.audition; return c; }).concat([preset]);
        K.writePresets(TAG, rows, 'the piece\'s petal hits — the petals of resonance rolled exhaustively at the trills\' ends (DEC-44); seed ' + seed, command);
    }
}
console.log(out.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
save.metadata = save.metadata || {}; save.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(save, null, 1) + '\n');
console.log('written: ' + path.relative(ROOT, file) + ' — in the page: F5 (NOT Reload: the page reads bank/presets.json only at its load, and a preset it does not know is left out of the plan — §217); a pass with the engine up captures the hit and renders its petals (the first pass plays it raw, the second the petals).');
