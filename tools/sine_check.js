#!/usr/bin/env node
// sine_check.js — THE SIMULATED PLAYER AND THE GO, HEADLESS (PLAN.md 1.5 · 12.4 · 12.5; RUNNING_LOG §179 · §180): the two pure modules
// (score/public/sine_sim.js · sine_go.js) against the piece's own file (bank/sine_behaviours.json) and its own instruments
// (sandbox/instruments.js) — no page, no engine, no MIDI.
//   THE FILE      every lane names a voice its instrument has; who moves is said
//   THE DRAW      a player's bend: inside its range and the instrument's limit, in time order, ending where its kind says; through the
//                 note player's own 14-bit arithmetic and back within a cent · the crotales: the SINE moves, two octaves and 17 cents
//                 above the key, its farthest beating inside 3 … 30 a second · the same seed the same draw · every kind turns up
//   THE TAKE      a take's state read as the drawer stores it: the fold, a stand-in, a doubling, a skipped voice, a second seat
//   THE GO        five played notes and one on the unpitched lane: five sines, one left alone; each note its voice, a pitch in its
//                 range, the bend ON the note and the note drawn with its struck sound kept; the crotale holds and its brick glisses ·
//                 the same seed twice is the same score · again with another seed: the same bricks, their level kept · and back
//   THE BRICK     what the GO wrote is a brick the engine's module reads: its message and its label (le_sine.js under a stub window)
//   node tools/sine_check.js          exit 0: SINE_CHECK PASS · 1: FAIL, each check named
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SineSim = require(path.join(ROOT, 'score', 'public', 'sine_sim.js')), SineGo = require(path.join(ROOT, 'score', 'public', 'sine_go.js'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'sine_behaviours.json'), 'utf8'));
const cfg = SineSim.config(FILE);

let fails = 0;
const check = (what, ok, detail) => { console.log('  ' + (ok ? 'ok   ' : 'FAIL ') + what + ' — ' + detail); if (!ok) fails++; };
const laneOf = (k) => TRACKS.findIndex((t) => t.instKey === k);
const limitOf = (k) => 100 * (INSTRUMENTS[k].playerBendSt != null ? INSTRUMENTS[k].playerBendSt : 1);   // the GO's cap: the PLAYER's range (§263); the sampler's is the re-key's
const rangeOf = (k) => 100 * (INSTRUMENTS[k].bendRangeSt > 0 ? INSTRUMENTS[k].bendRangeSt : 1);
// the note player's own arithmetic (composer.html tickCurvePlayback): cents -> the 14-bit bend through the instrument's measured range, and back
const bend14 = (c, st) => Math.max(0, Math.min(16383, Math.round(8192 + (Math.round(c) / (100 * st)) * 8192)));
const back = (v, st) => (v - 8192) / 8192 * 100 * st;

console.log('SINE_CHECK the file:');
const players = Object.keys(cfg.lanes).filter((k) => cfg.lanes[k].who === 'player'), sines = Object.keys(cfg.lanes).filter((k) => cfg.lanes[k].who === 'sine');
check('every lane of the file is a lane of the score, and names a voice its instrument has',
    Object.keys(cfg.lanes).every((k) => laneOf(k) >= 0 && INSTRUMENTS[k] && INSTRUMENTS[k].techniques.some((t) => t.key === cfg.lanes[k].voice)),
    Object.keys(cfg.lanes).map((k) => TRACKS[laneOf(k)].short + ' ' + cfg.lanes[k].voice + ' (' + cfg.lanes[k].who + ')').join(' · '));
check('four players bend (the cello in beats a second, re-keyed past its sampler — §263); on the mallets the sine moves; the unpitched lane has no part',
    players.length === 4 && sines.join() === 'bowed_vibraphone' && !cfg.lanes.percussion && Array.isArray(cfg.lanes.cello.beatHz) && cfg.lanes.cello.side === 'over', players.join(' · ') + ' | ' + sines.join(' · '));

console.log('SINE_CHECK the draw:');
const MID = { bass_flute: 64, bass_clarinet: 50, viola: 65, cello: 50, bowed_vibraphone: 67 };
let worstRange = 0, worstBack = 0, shapeBad = [], n = 0, beatBad = [], beatMin = 99, beatMax = 0;
const kinds = {}, signs = { '-1': 0, 1: 0 };
for (const k of players) for (let s = 1; s <= 150; s++) {
    const len = 3 + (s % 7), d = SineSim.draw(cfg, k, MID[k], len, SineSim.mulberry32(s * 977 + laneOf(k)), { limitCents: limitOf(k) });
    n++; kinds[d.kind] = (kinds[d.kind] || 0) + 1; signs[Math.sign(d.cents)]++;
    const cs = d.bend.map((p) => p[1]), ts = d.bend.map((p) => p[0]), st = INSTRUMENTS[k].bendRangeSt, L = cfg.lanes[k];
    if (L.beatHz) {   // a lane in beats a second: its farthest offset inside the band AT ITS PITCH (hold · waver are a fraction of it), on its side
        const b = SineSim.beats(MID[k], d.cents), hw = d.kind === 'hold' || d.kind === 'waver';
        beatMin = Math.min(beatMin, b); beatMax = Math.max(beatMax, b);
        if ((!hw && (b < L.beatHz[0] - 0.6 || b > L.beatHz[1] + 0.6)) || (L.side === 'over' && d.cents < 0) || Math.abs(d.cents) > limitOf(k)) beatBad.push(k + '#' + s + ' ' + d.kind + ' ' + d.cents + 'c = ' + b.toFixed(1) + '/s');
    } else worstRange = Math.max(worstRange, ...cs.map(Math.abs));
    cs.forEach((c) => { if (Math.abs(c) <= rangeOf(k)) worstBack = Math.max(worstBack, Math.abs(back(bend14(c, st), st) - c)); });   // past the sampler's range the GO re-keys: the tick never sees it
    const inOrder = ts.every((t, i) => i === 0 || t > ts[i - 1]) && ts[0] === 0 && Math.abs(ts[ts.length - 1] - len) < 1e-9;
    const ends = d.kind === 'toUnison' ? cs[cs.length - 1] === 0 && cs[0] !== 0 : d.kind === 'fromUnison' ? cs[0] === 0 && cs[cs.length - 1] !== 0
        : d.kind === 'through' ? Math.sign(cs[0]) === -Math.sign(cs[cs.length - 1]) : d.kind === 'hold' ? cs.every((c) => c === cs[0]) : cs[0] === 0 && cs[cs.length - 1] === 0;
    if (!inOrder || !ends || d.who !== 'player' || d.gliss || d.sineMidi !== MID[k]) shapeBad.push(k + '#' + s + ' ' + d.kind);
}
check('a player\'s bend in cents stays inside its range and the player\'s limit', worstRange <= 50 && worstRange <= 98, n + ' draws: the farthest ' + worstRange + ' cents (the file 8 … 50; the players\' limit 100)');
check('the cello, in beats a second: its farthest offset inside ' + cfg.lanes.cello.beatHz.join(' … ') + ' a second at its own pitch, always above, under the player\'s ' + (limitOf('cello') / 100) + ' st', beatBad.length === 0,
    beatBad.length ? beatBad.slice(0, 5).join(', ') : '150 draws on D3: ' + beatMin.toFixed(1) + ' … ' + beatMax.toFixed(1) + ' /s (hold · waver a fraction)');
check('it is in time order over the note\'s length and ends where its kind says; the sine sits on the note\'s own pitch', shapeBad.length === 0, shapeBad.length ? shapeBad.slice(0, 5).join(', ') : 'toUnison ends on the pitch · fromUnison starts on it · through changes side · hold is steady · waver comes home');
check('through the note player\'s 14-bit bend and back, it is the same within a cent', worstBack <= 1, 'the worst difference ' + worstBack.toFixed(2) + ' cents (the player rounds to a cent, then to 1/8192 of the range)');
check('every kind turns up, above and below', ['toUnison', 'fromUnison', 'through', 'hold', 'waver'].every((x) => kinds[x] > 0) && signs[-1] > 100 && signs[1] > 100, JSON.stringify(kinds) + ' · under ' + signs[-1] + ' · over ' + signs[1]);
const sk = {}; let sBad = [], bMin = 99, bMax = 0;
for (let s = 1; s <= 200; s++) {
    const key = 60 + (s % 25), d = SineSim.draw(cfg, 'bowed_vibraphone', key, 6, SineSim.mulberry32(s * 131), { limitCents: 0 });
    sk[d.gliss.kind] = (sk[d.gliss.kind] || 0) + 1;
    const far = Math.max(d.beatsFrom, d.beatsTo); bMin = Math.min(bMin, far); bMax = Math.max(bMax, far);
    const own = d.kind === 'to' || d.kind === 'through' ? d.beatsFrom : d.beatsTo;   // the end the drawn cents stand at (a crossing's far side, as many cents ABOVE, beats a little faster than below)
    if (d.who !== 'sine' || d.bend || Math.abs(d.sineMidi - (key + 24.17)) > 1e-6 || far < 2.9 || far > 30.6 || Math.abs(SineSim.beats(d.sineMidi, d.cents) - own) > 0.06) sBad.push('#' + s + ' ' + d.kind + ' ' + far);
}
check('the crotales: the SINE moves, two octaves and 17 cents above the key, its farthest beating inside 3 … 30 a second', sBad.length === 0 && ['to', 'from', 'through', 'around'].every((x) => sk[x] > 0),
    sBad.length ? sBad.slice(0, 5).join(', ') : '200 draws over the 25 keys: ' + JSON.stringify(sk) + ' · the farthest beating ' + bMin + ' … ' + bMax + ' /s');
check('30 beats a second is fewer cents the higher the crotale', Math.abs(SineSim.centsFor(84.17, 30, 1) - 48.4) < 0.5 && Math.abs(SineSim.centsFor(108.17, 30, 1) - 12.3) < 0.3,
    'at the lowest key (sounding C6) ' + SineSim.centsFor(84.17, 30, 1).toFixed(1) + ' c · at the highest (sounding C8) ' + SineSim.centsFor(108.17, 30, 1).toFixed(1) + ' c');
// THE RE-KEY (§263 — the string quartet's rule): a bend past the sampler's range becomes a chain of keys
console.log('SINE_CHECK the re-key:');
{
    const R = rangeOf('cello'), rising = [[0, 0], [2, 0], [10, 600]], chain = SineGo.rekeyChain(rising, 10, R), edge = R - SineGo.REKEY_EDGE_C;
    const inside = chain.every((sg) => sg.bend.every((p) => Math.abs(p[1]) <= edge + 1e-9)), keysUp = chain.every((sg, i) => i === 0 || sg.keyOffset > chain[i - 1].keyOffset);
    let worst = 0; chain.forEach((sg, i) => { if (!i) return; const p = chain[i - 1], before = p.keyOffset * 100 + p.bend[p.bend.length - 1][1], after = sg.keyOffset * 100 + sg.bend[0][1]; worst = Math.max(worst, Math.abs(before - after)); });
    check('a bend rising 0 → 600 c on the cello: a chain of keys, the first a semitone UP with the wheel full-flat (D → D#, as #1 did), every bend inside the sampler\'s ±' + R + ' c, the pitch continuous at each seam',
        chain.length >= 3 && chain[0].keyOffset === 1 && Math.abs(chain[0].bend[0][1] + 100) < 0.2 && inside && keysUp && worst <= 0.2 && Math.abs(chain[chain.length - 1].endS - 10) < 1e-9,
        chain.length + ' keys: ' + chain.map((sg) => (sg.keyOffset >= 0 ? '+' : '') + sg.keyOffset + ' st ' + sg.startS + '…' + sg.endS + ' s (' + sg.bend[0][1] + ' → ' + sg.bend[sg.bend.length - 1][1] + ' c)').join(' · ') + ' · the worst jump ' + worst.toFixed(2) + ' c');
    const falling = SineGo.rekeyChain([[0, 590], [8, 0]], 8, R), small = SineGo.rekeyChain([[0, 48], [5, 0]], 5, R);
    const lastF = falling[falling.length - 1], soundsAtEnd = lastF.keyOffset * 100 + lastF.bend[lastF.bend.length - 1][1];
    check('a bend falling from +590 c SOUNDS the written pitch at its end (on whichever key holds it); a bend inside the range is ONE note, untouched',
        falling.length >= 3 && Math.abs(soundsAtEnd) < 0.2 && falling.every((sg, i) => i === 0 || sg.keyOffset < falling[i - 1].keyOffset)
        && small.length === 1 && small[0].keyOffset === 0 && small[0].bend.length === 2,
        'falling: ' + falling.map((sg) => (sg.keyOffset >= 0 ? '+' : '') + sg.keyOffset).join(' ') + ', ending at ' + soundsAtEnd.toFixed(1) + ' c · small: ' + small.length + ' note, the bend as drawn');
}
const one = (s) => JSON.stringify(SineSim.draw(cfg, 'viola', 65, 5, SineSim.mulberry32(s), { limitCents: 100 }));
check('the same seed, the same draw; another seed, another', one(7) === one(7) && [1, 2, 3, 4, 5].some((s) => one(s) !== one(7)), JSON.parse(one(7)).say);

console.log('SINE_CHECK the take:');
const state = { strikeId: 'hs::harm:chordShapes:x', cfg: {}, rowKeys: {}, voices: [
    { i: 0, pitch: 38, lane: 5, fold: 0, tech: 'senza_vel', standIn: null, skip: false, also: [{ lane: 1, tech: 'senza_vel', fold: 1, standIn: null, skip: false }] },
    { i: 1, pitch: 75, lane: 1, fold: -1, tech: 'senza_vel', standIn: null, skip: false, also: [] },
    { i: 2, pitch: 76, lane: 0, fold: 0, tech: 'vib_vel', standIn: null, skip: false, also: [] },
    { i: 3, pitch: 77, lane: 4, fold: 0, tech: 'senza_vel', standIn: null, skip: true, also: [] },
    { i: 4, pitch: 78, lane: 6, fold: 0, tech: 'crot_bowed', standIn: null, skip: false, also: [] },
    { i: 5, pitch: 90, lane: 2, fold: 0, tech: 'main', standIn: 43, skip: false, also: [] },
    { i: 6, pitch: 60, lane: -1, fold: 0, tech: null, standIn: null, skip: false, also: [] }] };
const chord = SineGo.takeChord(state, TRACKS);
check('a take as the drawer stores it: the fold, a doubling, a stand-in, a second seat on its lane; a skipped or unplaced voice gives nothing',
    JSON.stringify(chord) === JSON.stringify([{ lane: 5, midi: 38 }, { lane: 1, midi: 50 }, { lane: 1, midi: 63 }, { lane: 0, midi: 76 }, { lane: 3, midi: 78 }, { lane: 2, midi: 43 }]),
    chord.map((c) => TRACKS[c.lane].short + ' ' + SineGo.pn(c.midi)).join(' · '));

console.log('SINE_CHECK the go:');
const note = (id, lane, start, len, key, tech) => ({ id, type: 'waveCurve', layer: lane, startSeconds: start, endSeconds: start + len, nodes: [{ pos: 0, y: 10, smooth: 0.25 }, { pos: 1, y: 10, smooth: 0.25 }],
    segments: [{ model: 'power', slope: 0 }], color: '#607D8B', fillMode: 'bottom', opacity: 0.55, performanceNotes: 'TAKE', properties: {}, sonifyNote: key, technique: tech, sonifyMode: 'plain', recVel: 88 });
const fresh = () => [note('wc-1', 0, 1, 6, 60, 'vib_vel'), note('wc-2', 1, 2, 7, 60, 'slap'), note('wc-3', 2, 3, 5, 43, 'main'), note('wc-4', 3, 4, 8, 72, 'crot_main_metal'),
    note('wc-5', 4, 5, 6, 60, 'bartok_vel'), note('wc-6', 5, 6, 9, 60, 'gettato_vel'), note('wc-7', 1, 12, 4, 60, 'slap')];
const run = (seed, objects) => { let id = 100; const notes = objects.filter((o) => o.type === 'waveCurve'); return SineGo.convert(notes, { objects, instruments: INSTRUMENTS, tracks: TRACKS, cfg, seed, newId: () => 'zn-' + (id++) }); };
let objs = fresh();
const a = SineGo.applyChord(objs, chord, 'demo');
check('the take onto the notes: each its lane\'s pitch, round robin where a lane holds two; the lane the take lacks left as it is',
    objs.map((o) => o.sonifyNote).join() === '76,50,43,78,60,38,63' && a.left.join() === '4' && objs[0].hq.was.sonifyNote === 60 && objs[0].hq.take === 'demo' && /← take "demo"/.test(objs[0].performanceNotes),
    objs.map((o) => TRACKS[o.layer].short + ' ' + SineGo.pn(o.sonifyNote)).join(' · ') + ' · left: ' + a.left.map((l) => TRACKS[l].short).join());
SineGo.applyChord(objs, [{ lane: 0, midi: 70 }], 'second');
check('a second take never overwrites what a note was before the first', objs[0].sonifyNote === 70 && objs[0].hq.was.sonifyNote === 60 && objs[0].hq.take === 'second', 'now ' + objs[0].sonifyNote + ' · was ' + objs[0].hq.was.sonifyNote);
objs = fresh(); SineGo.applyChord(objs, chord, 'demo');
let r = run(1, objs);
const bricks = objs.filter((o) => o.type === 'zone');
check('six notes of pitched lanes become six sines; the unpitched one is left alone, and says why', r.done.length === 6 && r.skipped.length === 1 && r.skipped[0].note.id === 'wc-3' && bricks.length === 6,
    r.done.length + ' sines · left alone: ' + r.skipped.map((s) => s.note.id + ' (' + s.why + ')').join());
const inRange = r.done.every((d) => { const I = INSTRUMENTS[TRACKS[d.note.layer].instKey], t = I.techniques.find((x) => x.key === d.note.technique); return d.note.technique === cfg.lanes[TRACKS[d.note.layer].instKey].voice && d.note.sonifyNote >= t.rangeLow && d.note.sonifyNote <= t.rangeHigh; });
check('each note takes its lane\'s voice, its pitch inside that voice\'s range', inRange, r.done.map((d) => TRACKS[d.note.layer].short + ' ' + d.note.technique + ' ' + SineGo.pn(d.note.sonifyNote)).join(' · '));
const pl = r.done.filter((d) => d.draw.who === 'player'), cr = r.done.filter((d) => d.draw.who === 'sine');
const keyOf = (o) => o.sonifyNote - ((o.properties.sine && o.properties.sine.keyOffset) || 0), chainEnd = (d) => (d.segments && d.segments.length ? d.segments[d.segments.length - 1].endSeconds : d.note.endSeconds);
check('a player\'s bend is ON the note, the note drawn with its struck sound kept — and its brick holds the pitch',
    pl.length === 5 && pl.every((d) => Array.isArray(d.note.morphBend) && d.note.morphBend.length >= 2 && !('sonifyMode' in d.note) && d.note.velAbs === 88 && d.note.cc7Abs.lo === 127 && d.note.cc7Abs.hi === 127
        && d.zone.elec.gliss.kind === 'none' && d.zone.elec.midi === keyOf(d.note) && d.note.morphBend[d.note.morphBend.length - 1][0] <= d.note.endSeconds - d.note.startSeconds + 1e-9),
    pl.map((d) => TRACKS[d.note.layer].short + ' ' + d.draw.kind + ' ' + d.draw.cents + 'c').join(' · '));
const vc = r.done.find((d) => TRACKS[d.note.layer].instKey === 'cello');
check('the cello\'s D2 (§263): the bend a tritone, the note RE-KEYED into a chain in the objects — the first note shortened, each segment at its moved key, 5 ms overlaps, the written key kept on every segment, the brick over the whole',
    !!vc && Math.abs(vc.draw.cents) > 400 && vc.segments.length >= 2 && vc.note.properties.sine.chain.length === vc.segments.length && vc.segments.every((x) => objs.includes(x) && x.layer === vc.note.layer && keyOf(x) === 38 && x.properties.sine.segment.of === vc.note.id && x.technique === 'senza_vel' && x.velAbs === 88)
        && [vc.note].concat(vc.segments).every((x, k, a) => k === 0 || Math.abs(a[k - 1].endSeconds - x.startSeconds - SineGo.REKEY_OVERLAP_S) < 1e-6) && vc.zone.endTime === chainEnd(vc) && vc.zone.startTime === vc.note.startSeconds,
    vc ? vc.draw.cents + ' c · ' + (1 + vc.segments.length) + ' keys: ' + [vc.note].concat(vc.segments).map((x) => SineGo.pn(x.sonifyNote) + ' ' + x.startSeconds + '…' + x.endSeconds).join(' · ') : '(no cello note)');
check('the crotale HOLDS — no bend, still as it was struck — and its brick glisses, two octaves and 17 cents above the key',
    cr.length === 1 && !('morphBend' in cr[0].note) && cr[0].note.sonifyMode === 'plain' && !('velAbs' in cr[0].note) && cr[0].zone.elec.gliss.kind !== 'none' && Math.abs(cr[0].zone.elec.midi - (78 + 24.17)) < 1e-6,
    cr.length ? 'key ' + SineGo.pn(cr[0].note.sonifyNote) + ' · the sine ' + SineGo.pn(cr[0].zone.elec.midi) + ' · ' + JSON.stringify(cr[0].zone.elec.gliss) + ' · ' + cr[0].draw.say : '(none)');
check('a brick lies over its note (a chain: over the whole of it), on its lane, and each knows the other', r.done.every((d) => d.zone.layer === d.note.layer && d.zone.startTime === d.note.startSeconds && d.zone.endTime === chainEnd(d) && d.zone.midiModel === 'elecSine'
    && d.zone.zoneFunction === 'elec' && d.zone.properties.sine.note === d.note.id && d.note.properties.sine.brick === d.zone.id && d.zone.elec.level.mark === 'mf'), bricks.map((z) => z.id + '←' + z.properties.sine.note).join(' · '));
const o2 = fresh(); SineGo.applyChord(o2, chord, 'demo'); run(1, o2);
check('the same seed on the same notes is the same score, to the byte', JSON.stringify(o2) === JSON.stringify(objs), JSON.stringify(objs).length + ' characters, equal');
const idsBefore = bricks.map((z) => z.id).join(), kindsBefore = r.done.map((d) => d.draw.kind + d.draw.cents).join();
bricks[0].elec.level = { mode: 'curve', mark: 'p', curveRef: 'A' }; bricks[0].elec.label = 'his';
r = run(2, objs);
check('again with another seed: the same bricks, other behaviours, a brick\'s own level and label kept', objs.filter((o) => o.type === 'zone').map((z) => z.id).join() === idsBefore && r.done.every((d) => !d.isNew)
    && r.done.map((d) => d.draw.kind + d.draw.cents).join() !== kindsBefore && bricks[0].elec.level.curveRef === 'A' && bricks[0].elec.label === 'his' && objs[0].properties.sine.was.technique === 'vib_vel' && objs[1].properties.sine.was.technique === 'slap',
    'seed 2: ' + r.done.map((d) => TRACKS[d.note.layer].short + ' ' + d.draw.kind).join(' · '));
const u = SineGo.unconvert(objs.filter((o) => o.type === 'waveCurve'), { objects: objs });
const n2 = objs.find((o) => o.id === 'wc-2');
const n6 = objs.find((o) => o.id === 'wc-6');
check('and back: the voice and the sound as before, the bricks gone, the pitch kept — the cello\'s chain ONE note again, its end and its key restored', u.length === 6 && !objs.some((o) => o.type === 'zone') && n2.technique === 'slap' && n2.sonifyMode === 'plain' && !('morphBend' in n2) && !('velAbs' in n2) && !('cc7Abs' in n2)
    && !('sine' in n2.properties) && n2.sonifyNote === 50 && n2.hq.was.sonifyNote === 60 && objs.filter((o) => o.type === 'waveCurve').length === 7 && n6.sonifyNote === 38 && n6.endSeconds === 15 && !('sine' in n6.properties),
    u.length + ' notes back · the bass clarinet: ' + n2.technique + ' ' + n2.sonifyMode + ' ' + SineGo.pn(n2.sonifyNote) + ' (before its take ' + SineGo.pn(n2.hq.was.sonifyNote) + ') · the cello ' + SineGo.pn(n6.sonifyNote) + ' to ' + n6.endSeconds + ' s, ' + objs.filter((o) => o.type === 'waveCurve').length + ' notes in all');
const far = [note('wc-9', 1, 1, 5, 75, 'slap'), note('wc-10', 0, 1, 5, 20, 'vib_vel')]; r = run(1, far);
check('a pitch outside the voice\'s range comes in by octaves', far[0].sonifyNote === 63 && far[1].sonifyNote === 56 && r.done.length === 2, 'D#5 on the bass clarinet → ' + SineGo.pn(far[0].sonifyNote) + ' · G#0 on the bass flute → ' + SineGo.pn(far[1].sonifyNote));

console.log('SINE_CHECK the brick:');
const sent = [], doc = { createElement: () => ({ children: [], appendChild() {}, addEventListener() {}, setAttribute() {} }) };
const win = { addEventListener() {}, document: doc, LE: { cfg: { players: [] }, ready: Promise.resolve(), playerOf: () => null, send: (kind, data) => { sent.push({ kind, data }); return Promise.resolve(null); } } };
const ctx = vm.createContext({ window: win, LE: win.LE, document: doc, fetch: () => Promise.resolve({ ok: false }), performance: { now: () => 0 }, setTimeout, clearTimeout, console, Promise });
for (const f of ['le_objects.js', 'le_sine.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, 'electronics', 'score', f), 'utf8'), ctx, { filename: f });
const LEO = win.LEObjects;
objs = fresh(); SineGo.applyChord(objs, chord, 'demo'); r = run(1, objs);
const cz = r.done.find((d) => d.draw.who === 'sine').zone, pz = r.done.find((d) => d.draw.who === 'player').zone;
const cm = LEO.sineMessage(cz, null, 0), pm = LEO.sineMessage(pz, null, 0);
check('what the GO wrote is a brick the engine\'s module reads: the crotale\'s message has its pitch, its length and its gliss; a player\'s holds', LEO.is(cz) && cm.midi === 102.17 && cm.lengthMs === 8000 && /^0:-?\d/.test(cm.gliss || '') && cm.level === '4'
    && pm.midi === pz.elec.midi && !('gliss' in pm) && cz.color === LEO.MODELS.elecSine.color && cz.yOffset === LEO.MODELS.elecSine.yOffset, JSON.stringify(cm) + ' | ' + LEO.sineLabel(cz) + ' | ' + LEO.sineLabel(pz));

console.log(fails ? 'SINE_CHECK FAIL — ' + fails + ' check(s)' : 'SINE_CHECK PASS');
process.exit(fails ? 1 : 0);
