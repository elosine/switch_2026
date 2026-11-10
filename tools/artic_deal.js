#!/usr/bin/env node
// artic_deal.js — THE ARTICULATION DEAL (PLAN 1d, 2026-11-10; RUNNING_LOG §145): his chosen articulations (bank/artic_deal.json, from SW-35)
// distributed into a section's played-in notes. Per LANE, the section is cut into TIME CONTAINERS rolled by Cage's hexagram (the lineage's
// roll — Approaching's three-body section, the harmony roll §139), each container dealt the next articulation of a shuffled deck (exhaustive,
// re-shuffled when spent, never the same twice in a row); every note inside the container takes it. His rules: a pitch outside the
// articulation's RANGE is folded by octaves into it, or, when the range cannot take it, the note is dealt the next articulation that can
// ("swaps"); the articulations that want a LONGER note (flz, bow overpressure) GROW a short note toward longMinS within the lane's room
// (the next note's start less a hair), or take another articulation when there is no room. A deck entry with a `lane` MOVES the note to
// that lane (the percussionist's unpitched strikes among the glockenspiel's) — its pitch becomes a key of the strike, the nearest in range.
// Every change is kept under properties.artic.was; --undo restores. The written dynamics (recVel · velAbs) are not touched — the level map
// per articulation (1e) follows.
//
//   node tools/artic_deal.js --score <save> --from 195 --to 253 [--out <save>] [--seed N] [--deck bank/artic_deal.json] [--lanes flute,violin]
//                            [--min 1.5 --max 6] [--markers] [--dry] [--undo] [--in-place]
//   writes scores/<out>.json (default <score>-artics; --in-place writes the save itself) · File ▾ → Open in the page
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const r3 = (x) => Math.round(x * 1000) / 1000;
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const pn = (m) => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const Roll = require(path.join(ROOT, 'score', 'public', 'three_body_roll.js'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const DECK = JSON.parse(fs.readFileSync(path.resolve(ROOT, arg('deck', 'bank/artic_deal.json')), 'utf8'));
const name = arg('score') || die('--score'), from = +arg('from', 0), to = +arg('to', 1e9), seed = +arg('seed', 17);
const MIN = +arg('min', DECK.containerS.min), MAX = +arg('max', DECK.containerS.max), LONG_MIN = +arg('long-min', DECK.longMinS), ROOM_SHARE = DECK.longRoomShare || 0.6;
const LONG = new Set(DECK.long || []);
const file = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(file)) die('no such score: ' + name);
const outName = has('in-place') ? name : arg('out', name + '-artics'), outFile = path.join(ROOT, 'scores', outName + '.json');
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
let nextId = s.nextId || (Math.max(0, ...s.objects.map((o) => +((/-(\d+)$/.exec(o.id || '') || [])[1] || 0))) + 1);
const laneIndex = (id) => { const i = TRACKS.findIndex((t) => t.id === id); if (i < 0) die('no lane ' + id); return i; };
const onlyLanes = arg('lanes') ? arg('lanes').split(',') : null;

if (has('undo')) {
    let n = 0; s.objects = s.objects.filter((o) => !(o.type === 'marker' && o.properties && o.properties.articDeal));
    for (const o of s.objects) { const w = o.properties && o.properties.artic && o.properties.artic.was; if (!w) continue; o.technique = w.technique; o.endSeconds = w.endSeconds; o.layer = w.layer; o.sonifyNote = w.sonifyNote; delete o.properties.artic; n++; }
    console.log(n + ' note(s) restored'); if (!has('dry')) { fs.writeFileSync(outFile, JSON.stringify(s)); console.log('written: scores/' + outName + '.json'); } process.exit(0);
}

const rnd = Roll.mulberry32(seed);
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const techOf = (instKey, key) => (INSTRUMENTS[instKey] || { techniques: [] }).techniques.find((q) => q.key === key);
const rangeOf = (instKey, q) => { const I = INSTRUMENTS[instKey]; return [q.rangeLow != null ? q.rangeLow : I.rangeLow, q.rangeHigh != null ? q.rangeHigh : I.rangeHigh]; };
const fold = (p, lo, hi) => { let x = p; while (x < lo) x += 12; while (x > hi) x -= 12; return x >= lo && x <= hi ? x : null; };
// the keys of a by-key voice, whatever shape the recipe gives them: [{midi, label}] (a strike's table), [60, 62 …], or {midi: label} / {label: midi}
// a by-key voice whose keys are still "pending" (a string) has NO key table: its pitch is folded into the range instead
const keyList = (q) => { const k = q.keys; if (!k || typeof k !== 'object') return []; if (Array.isArray(k)) return k.map((x) => (typeof x === 'number' ? x : x && x.midi)).filter((x) => Number.isFinite(x)); const ks = Object.keys(k).map(Number); if (ks.every(Number.isFinite)) return ks; return Object.values(k).map(Number).filter(Number.isFinite); };
const nearestKey = (p, q) => { const ks = keyList(q); if (!ks.length) return null; return ks.reduce((b, k) => Math.abs(k - p) < Math.abs(b - p) ? k : b, ks[0]); };

const notesAll = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.startSeconds >= from && o.startSeconds < to && !TRACKS[o.layer].elec);
const report = []; let changed = 0, grown = 0, swapped = 0, folded = 0, moved = 0; const tally = {};
const markers = [];
for (const [laneId, deckRaw] of Object.entries(DECK.decks)) {
    if (onlyLanes && !onlyLanes.includes(laneId)) continue;
    const L = laneIndex(laneId), instKey = TRACKS[L].instKey;
    // the deck, resolved: { key, technique (recipe), instKey (of the lane it plays on), lane (index), moves }
    const deck = [];
    for (const e of deckRaw) {
        const key = typeof e === 'string' ? e : e.technique, toLane = typeof e === 'string' ? null : e.lane;
        const li = toLane ? laneIndex(toLane) : L, ik = TRACKS[li].instKey, q = techOf(ik, key);
        if (!q) { report.push(laneId + ': "' + key + '" is not a technique of ' + ik + ' — left out of the deck'); continue; }
        if (q.placed === false) report.push(laneId + ': "' + key + '" is in the deck but NOT PLACED in the rack (it will not sound until it is)');
        deck.push({ key, q, instKey: ik, lane: li, moves: li !== L, range: rangeOf(ik, q) });
    }
    if (!deck.length) { report.push(laneId + ': empty deck'); continue; }
    const notes = notesAll.filter((o) => o.layer === L).sort((a, b) => a.startSeconds - b.startSeconds);
    if (!notes.length) { report.push(laneId + ': no notes in ' + from + ' … ' + to + ' s'); continue; }
    // the containers, this lane's own roll
    const containers = []; let t = from;
    while (t < to - 0.01) { const h = Roll.hexagram(rnd); let len = r3(MIN + (h.n - 1) / 63 * (MAX - MIN)); if (to - (t + len) < MIN) len = r3(to - t); containers.push({ start: r3(t), end: r3(t + len), hex: h.n, glyph: h.glyph }); t = r3(t + len); }
    let pile = [], last = null;
    for (const c of containers) { if (!pile.length) { pile = shuffle(deck); if (last && pile[0] === last) pile.push(pile.shift()); } c.deal = pile.shift(); last = c.deal; }
    // the notes
    for (let i = 0; i < notes.length; i++) {
        const o = notes[i], c = containers.find((x) => o.startSeconds >= x.start && o.startSeconds < x.end); if (!c) continue;
        const was = (o.properties && o.properties.artic && o.properties.artic.was) || { technique: o.technique, endSeconds: o.endSeconds, layer: o.layer, sonifyNote: o.sonifyNote };
        const dur = was.endSeconds - o.startSeconds, next = notes[i + 1], room = next ? next.startSeconds - 0.03 - o.startSeconds : LONG_MIN;
        // the candidates: the container's deal first, then the rest of the deck in its order — the first that can take the note
        const order = [c.deal, ...deck.filter((d) => d !== c.deal)];
        let pick = null, pitch = was.sonifyNote, end = was.endSeconds, how = '';
        for (const d of order) {
            let p = was.sonifyNote;
            if (d.moves || d.q.kind === 'key' || (d.q.keys && d.q.keys.length)) { p = nearestKey(was.sonifyNote, d.q); if (p == null) p = fold(was.sonifyNote, d.range[0], d.range[1]); if (p == null) p = d.range[0]; if (!d.moves) how += 'keyed '; }   // a by-key voice (the strings' behind-the-bridge pizzicato, a strike): the pitch becomes its nearest KEY
            else if (p < d.range[0] || p > d.range[1]) { const f = fold(p, d.range[0], d.range[1]); if (f == null) { if (d === c.deal) how += 'range '; continue; } p = f; how += 'folded '; }
            let e = was.endSeconds;
            if (LONG.has(d.key) && dur < LONG_MIN) { if (room >= LONG_MIN * ROOM_SHARE) { e = r3(o.startSeconds + Math.min(LONG_MIN, room)); how += 'grown '; } else { if (d === c.deal) how += 'no-room '; continue; } }
            pick = d; pitch = p; end = e; if (d !== c.deal) how += 'swapped(' + c.deal.key + '→' + d.key + ') '; break;
        }
        if (!pick) { report.push(laneId + ' ' + r3(o.startSeconds) + ' s ' + pn(was.sonifyNote) + ': no articulation of the deck can take it — left as it was'); continue; }
        if (/folded/.test(how)) folded++; if (/grown/.test(how)) grown++; if (/swapped/.test(how)) swapped++; if (pick.moves) moved++;
        o.properties = o.properties || {}; o.properties.artic = { was, deal: pick.key, container: containers.indexOf(c) + 1, how: how.trim() };
        if (o.technique !== pick.key || o.endSeconds !== end || o.layer !== pick.lane || o.sonifyNote !== pitch) changed++;
        o.technique = pick.key; o.endSeconds = end; o.layer = pick.lane; o.sonifyNote = pitch;
        tally[laneId] = tally[laneId] || {}; tally[laneId][pick.key] = (tally[laneId][pick.key] || 0) + 1;
    }
    if (has('markers')) for (const c of containers) markers.push({ id: 'mk-' + (nextId++), type: 'marker', layer: L, time: c.start, label: c.deal.key + ' ' + c.glyph, color: '#00897B', groupId: 'artic-deal', performanceNotes: laneId + ': ' + c.deal.key + ' · container ' + (containers.indexOf(c) + 1) + ', hexagram ' + c.hex + ', ' + r3(c.end - c.start) + ' s', properties: { articDeal: true } });
    console.log(laneId.padEnd(11) + containers.length + ' containers · ' + notes.length + ' notes · ' + Object.entries(tally[laneId] || {}).map(([k, n]) => k + ' ' + n).join(', '));
}
s.objects = s.objects.filter((o) => !(o.type === 'marker' && o.properties && o.properties.articDeal)); s.objects.push(...markers);
s.objects.sort((p, q) => (p.startTime != null ? p.startTime : p.startSeconds != null ? p.startSeconds : p.time) - (q.startTime != null ? q.startTime : q.startSeconds != null ? q.startSeconds : q.time));
console.log(notesAll.length + ' notes in ' + from + ' … ' + to + ' s · ' + changed + ' changed · ' + grown + ' grown · ' + folded + ' folded · ' + swapped + ' swapped · ' + moved + ' moved to another lane · seed ' + seed);
for (const r of report) console.log('  ! ' + r);
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.nextId = nextId; s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString(); if (!has('in-place')) s.metadata.title = outName;
fs.writeFileSync(outFile, JSON.stringify(s));
console.log('written: scores/' + outName + '.json · File ▾ → Open in the page');
