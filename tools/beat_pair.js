#!/usr/bin/env node
// beat_pair.js — BEATING PAIRS INTO A SCORE (RUNNING_LOG §265 … §270; DEC-60 · 61 · 62): a player's long note and a STATIC SINE
// BRICK over it at the same pitch, the note BENT so that the pair beats along a line said in BEATS A SECOND (Hz), turned into cents
// at the note's own pitch. His words: *"Let's start over … just give me one note"* — the beating section built up by hand, pair by
// pair, in his own score; then *"help me organize and then devise a way to roll"* — the three SHAPES of bank/beat_shapes.json.
//
// ROLLED — his rules (bank/beat_shapes.json, a _doc line on every number):
//   node tools/beat_pair.js --score sec04-a-beating --roll --pitches D#2,D2,D#2 [--start 4] [--replace] [--seed N]
//     per pitch: a GAP (a plain roll) · a SHAPE (upHold · downHold · upPlateauDown) · a PEAK (leaning low) · where a descent ENDS ·
//     each part's length = its minimum + an extra that leans short (the smaller of two rolls). The pair's length is the SUM of its
//     parts — never rolled; past maxLengthS it is rolled again. The beating never changes faster than the fastest pace.
//     --take <name> [--n 2]   instead of --pitches: this lane's pitch in a TAKE of the Strikes drawer, --n pairs of it
//     the PEAK is rolled under what the PLAYER can reach at the pitch (the recipe's playerBendSt: a clarinet's semitone at F2 = 5 Hz)
//     --start   where the first pair begins (else after the last object on the lane, a gap rolled)
//     --replace the pairs already on the lane (sine bricks and the notes under them) are taken out first — a RE-ROLL
//     --seed    the same seed, the same roll (printed, and kept on every brick)
// DICTATED — one pair, said outright:
//   node tools/beat_pair.js --score sec04-a-beating --pitch D2 --from 12 --to 2 [--at 0.667] [--dur 16,25] [--start s | --gap 4,7]
//     --from · --to   the beating at the note's START and at its DESTINATION (0 = the unison); there at --at of the length, held
// RE-LEVEL — the pairs already on a lane take new marks, nothing rolled:
//   node tools/beat_pair.js --score sec04-a-beating --lane mal --relevel --sine mp --note mp
// RE-GAP — the pairs on a lane stay as they are, every gap between two of them rolled again (the rules' gapS, or --gap lo,hi):
//   node tools/beat_pair.js --score sec04-a-beating --lane mal --regap
// DROP — the lane's last pair taken out · or a whole CHORD's pairs (a pair says its chord: properties.beat.take — `opening`, or
// the take it was rolled from), the later pairs closing up with their own gaps:
//   node tools/beat_pair.js --score sec04-a-beating --lane mal --droplast
//   node tools/beat_pair.js --score sec04-a-beating --lane mal --droptake beating04
//   node tools/beat_pair.js --score sec04-a-beating --lane mal --dropat 177.08        (the one pair beginning nearest that time)
// ALL:  [--lane cello] [--side over|under] [--sine fff] [--note p] [--vel N] [--dry]
//     --side    the player over (sharp of) the sine, or under — over by default (under a low cello note is below its C string)
//     --sine · --note   the written marks; without them the lane's own (bank/beat_shapes.json `levels.lanes`), else the rules' default
//     --vel     the note's velocity outright; without it THE PAGE'S OWN RULE for the mark (p 37 · mp 55 — what his hand makes in the
//               page; §268 · §274: the calibrated ladder's p is 57 for the cello, not used here)
// A LANE WHOSE SINE MOVES (bank/sine_behaviours.json `who: sine` — the bowed crotales, --lane mal): the same shapes, but the bar
// holds and is RE-BOWED under the brick (bowings of about targetS, never past ceilingS, gapS between — bank/beating_section.json's
// row for the lane) and the SINE glides (the brick's gliss, a line). There a pitch is the SOUNDING one (F#7 = the key F#5).
// The note is the lane's long-tone voice (bank/sine_behaviours.json), DRAWN (its own curve channel), its struck sound kept
// (velAbs · cc7Abs — the GO's rule). A bend past the sampler's measured range is RE-KEYED — the string quartet's rule,
// score/public/sine_go.js rekeyChain: the key moved, the bend re-based, a chain with 5 ms overlaps where one key cannot hold it.
// The notes carry properties.sine as the GO writes it (∿ off makes one plain note again); the brick carries properties.beat —
// the shape, its parts, the line, the seed. The sine brick: flat, no gliss, Follow off (it sounds for its whole span).
// THE PAGE: the base is the NEWER of the save and the page's working copy (his unsaved edits kept); the result is written as the
// save — File ▾ → Reload shows it. THE SORTING: the piece's (his score, his rules).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SineSim = require(path.join(ROOT, 'score', 'public', 'sine_sim.js')), SineGo = require(path.join(ROOT, 'score', 'public', 'sine_go.js'));
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m, c) => { console.error(m); process.exit(c || 2); };
const r1 = (x) => Math.round(x * 10) / 10, r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000, up10 = (x) => Math.ceil(x * 10 - 1e-9) / 10;
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const range = (t, what) => { const a = String(t).split(',').map(Number); if (a.some((x) => !Number.isFinite(x)) || a.length > 2) die('--' + what + ' wants a number or lo,hi'); return a.length === 1 ? [a[0], a[0]] : a; };
const keyOf = (t) => { if (Number.isFinite(+t)) return Math.round(+t); const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(String(t).trim()); if (!m) die('a pitch is a note name (D2 · D#2 · Eb2) or a MIDI key: ' + t); return { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1].toUpperCase()] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12 * (+m[3] + 1); };
const SHAPE_SAY = { upHold: 'up + hold', downHold: 'down + hold', upPlateauDown: 'up + plateau + down', dictated: 'dictated' };

const RULES = Object.assign({ levels: { sine: 'fff', note: 'p' }, gapS: [4, 7], shapes: { upHold: 1, downHold: 1, upPlateauDown: 1 }, peakHz: [3, 10], floorHz: 0.6, endMaxShare: 0.5,
    paceSPerHz: [2.5, 6], holdMinS: 2.5, holdExtraMaxS: 8, maxLengthS: 60 }, fs.existsSync(path.join(ROOT, 'bank', 'beat_shapes.json')) ? readJson('bank/beat_shapes.json') : {});

// ---- ONE SHAPE, ROLLED: -> { shape, peakHz, endHz, parts: [{ kind, fromHz, toHz, s, paceSPerHz? }], lengthS, tries } ----------------
// capHz: the fastest beating THIS PLAYER can reach at THIS pitch (the recipe's playerBendSt — a clarinettist's semitone at F2 is 5 beats
// a second); the peak is rolled under it (§276). null: no cap (the cello's reach is an octave; a gliding sine has none).
function rollShape(rnd, R, capHz) {
    const lean = () => Math.min(rnd(), rnd());   // the smaller of two rolls: short and low are common, long and high rare
    const pick = (w) => { const ks = Object.keys(w).filter((k) => +w[k] > 0); let x = rnd() * ks.reduce((a, k) => a + +w[k], 0); for (const k of ks) { x -= +w[k]; if (x < 0) return k; } return ks[ks.length - 1]; };
    const hiP = capHz != null ? Math.min(R.peakHz[1], capHz) : R.peakHz[1], loP = Math.min(R.peakHz[0], hiP);
    for (let tries = 1; tries <= 500; tries++) {
        const shape = pick(R.shapes), peak = Math.min(hiP, r1(loP + (hiP - loP) * lean()));
        const end = r1(R.floorHz + Math.max(0, peak * R.endMaxShare - R.floorHz) * rnd());
        const parts = [];
        const ramp = (kind, a, b) => { const pace = R.paceSPerHz[0] + (R.paceSPerHz[1] - R.paceSPerHz[0]) * lean(), s = up10(Math.abs(b - a) * pace); parts.push({ kind, fromHz: a, toHz: b, s, paceSPerHz: r2(s / Math.abs(b - a)) }); };
        const flat = (kind, h) => parts.push({ kind, fromHz: h, toHz: h, s: up10(R.holdMinS + R.holdExtraMaxS * lean()) });
        if (shape === 'upHold') { ramp('rise', 0, peak); flat('hold', peak); }
        else if (shape === 'downHold') { ramp('fall', peak, end); flat('hold', end); }
        else { ramp('rise', 0, peak); flat('plateau', peak); ramp('fall', peak, end); flat('hold', end); }
        const lengthS = r1(parts.reduce((a, q) => a + q.s, 0));
        if (lengthS <= R.maxLengthS) return { shape, peakHz: peak, endHz: shape === 'upHold' ? null : end, parts, lengthS, tries };
    }
    die('no shape under ' + R.maxLengthS + ' s in 500 rolls — bank/beat_shapes.json');
}
const lineOf = (parts) => { let t = 0; const line = [[0, parts[0].fromHz]]; for (const q of parts) { t = r3(t + q.s); line.push([t, q.toHz]); } return line; };

// ---- the stack ------------------------------------------------------------------------------------------------------------------
const name = arg('score'); if (!name) die('--score <name>');
const file = path.join(ROOT, 'scores', name + '.json'), work = path.join(ROOT, 'scores', name + '-work.json');
if (!fs.existsSync(file)) die('no such score: scores/' + name + '.json');
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const REMAP = readJson('bank/velocity_remap.json'), LANES = readJson('bank/sine_behaviours.json').lanes;
const laneArg = String(arg('lane', 'cello')).toLowerCase();
const lane = TRACKS.findIndex((t, k) => [String(k), t.id, t.short, t.label, t.instKey].some((x) => String(x || '').toLowerCase() === laneArg));
if (lane < 0) die('--lane: none of ' + TRACKS.map((t) => t.short || t.id).join(', '));
const instKey = TRACKS[lane].instKey, inst = INSTRUMENTS[instKey], L = LANES[instKey];
if (!inst || !L) die('the lane ' + laneArg + ' has no part in the sines (bank/sine_behaviours.json)');
const tech = inst.techniques.find((t) => t.key === L.voice), lo = tech.rangeLow != null ? tech.rangeLow : inst.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : inst.rangeHigh;
const sign = arg('side', 'over') === 'under' ? -1 : 1;
// WHO MOVES (bank/sine_behaviours.json): a `player` lane — the note is bent, the sine static · a `sine` lane (the bowed crotales: a
// bar cannot bend) — the player holds, RE-BOWING, and the SINE glides along the same shape (his word, §272: "the crotales don't
// bend, so we'll bend the sine instead. But the same patterns"). On such a lane a pitch is the SOUNDING one — the sine's, what the
// brick shows: a crotale sounds sineOctave above its key.
const WHO = L.who === 'sine' ? 'sine' : 'player', SOCT = +L.sineOctave || 0, SCENTS = +L.sineCents || 0;
const BOW = Object.assign({ ceilingS: 8, targetS: 5.8, gapS: 0.6 }, ((readJson('bank/beating_section.json').players || []).find((p) => p.lane === instKey)) || {});   // one bowing of a bar: the beating section's numbers
const laneLevels = (RULES.levels.lanes && RULES.levels.lanes[instKey]) || {};
const sineMark = arg('sine', laneLevels.sine || RULES.levels.sine), noteMark = arg('note', laneLevels.note || RULES.levels.note);
if (!MARKS.includes(sineMark) || !MARKS.includes(noteMark)) die('--sine and --note: one of ' + MARKS.join(' '));
const rangeC = 100 * (inst.bendRangeSt > 0 ? inst.bendRangeSt : 1);

// the base: the newer of the save and the page's working copy — his unsaved edits are kept
const useWork = fs.existsSync(work) && fs.statSync(work).mtimeMs > fs.statSync(file).mtimeMs;
const s = JSON.parse(fs.readFileSync(useWork ? work : file, 'utf8'));
const startOf = (o) => (o.startTime != null ? o.startTime : o.startSeconds), endOf = (o) => (o.endTime != null ? o.endTime : o.endSeconds);
// THE NOTE'S LOUDNESS IS THE PAGE'S OWN RULE FOR A WRITTEN MARK (§274): the height the page gives the mark (p 2.9 · mp 4.3 — a tenth of
// 10 × mark / 7) and, for a plain note, velocity = height / 10 × 127 (p 37 · mp 55). It is what HIS hand makes when he sets a note's
// dynamic in the page — his ear set the pairs with it (§268; the calibrated ladder's p for the cello is 57, not used here).
const m = MARKS.indexOf(noteMark), y = Math.round(m / 7 * 100) / 10;
const vel = arg('vel') != null ? Math.max(1, Math.min(127, Math.round(+arg('vel')))) : Math.max(1, Math.min(127, Math.round(y / 10 * 127)));
const out = [useWork ? '(the base: HIS working copy — unsaved edits kept)' : '(the base: the save)'];
if (has('relevel')) {
    // --relevel: the pairs ALREADY on the lane take --sine and --note (else the lane's own marks, bank/beat_shapes.json); nothing is rolled
    const bricks = s.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecSine' && o.layer === lane);
    const under = s.objects.filter((o) => o.type === 'waveCurve' && o.layer === lane && o.sonifyNote != null && bricks.some((z) => startOf(o) < z.endTime + 0.01 && endOf(o) > z.startTime - 0.01));
    bricks.forEach((z) => { z.elec.level = Object.assign({}, z.elec.level, { mode: 'flat', mark: sineMark }); delete z.elec.level.to; if (z.properties && z.properties.beat) z.properties.beat.sine = sineMark; });
    under.forEach((o) => { o.recVel = vel; if (o.velAbs != null) o.velAbs = vel; (o.nodes || []).forEach((n) => { n.y = y; }); });
    console.log(out.concat(TRACKS[lane].label + ' — ' + bricks.length + ' sine bricks now ' + sineMark + ' · ' + under.length + ' notes now ' + noteMark + ' (velocity ' + vel + ')').join('\n'));
    if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
    s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(s));
    console.log('written: scores/' + name + '.json · File ▾ → Reload in the page');
    process.exit(0);
}
if (has('replace')) {
    const bricks = s.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecSine' && o.layer === lane);
    const under = s.objects.filter((o) => o.type === 'waveCurve' && o.layer === lane && bricks.some((z) => startOf(o) < z.endTime + 0.01 && endOf(o) > z.startTime - 0.01));
    s.objects = s.objects.filter((o) => !bricks.includes(o) && !under.includes(o));
    out.push('--replace: ' + bricks.length + ' sine bricks and ' + under.length + ' notes under them taken off the ' + TRACKS[lane].label + ' lane');
}
if (arg('droptake') || arg('dropat') != null) {
    // --droptake <chord>: every pair of that chord (properties.beat.take: opening · a take's name) is taken off the lane, and the pairs
    // after it CLOSE UP — each keeps its shape, its length, its pitch and the gap that stood before it; the lane's first entry stays
    // --dropat <seconds>: the ONE pair that begins nearest that time (within 4 s) — he reads a time off the page — the same closing up
    const chord = arg('droptake') || ('the pair at ' + arg('dropat') + ' s');
    const bricks = s.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecSine' && o.layer === lane).sort((a, b) => a.startTime - b.startTime);
    if (bricks.some((z) => !(z.properties && z.properties.beat && z.properties.beat.take))) die('a pair on the ' + TRACKS[lane].label + ' lane does not say its chord (properties.beat.take) — the page may hold an older state: File ▾ → Reload, then again');
    const near = arg('dropat') != null ? bricks.slice().sort((a, b) => Math.abs(a.startTime - +arg('dropat')) - Math.abs(b.startTime - +arg('dropat')))[0] : null;
    if (arg('dropat') != null && (!near || Math.abs(near.startTime - +arg('dropat')) > 4)) die('no pair on the ' + TRACKS[lane].label + ' lane begins within 4 s of ' + arg('dropat') + ' s (the nearest: ' + (near ? near.startTime : 'none') + ')');
    const dead = near ? [near] : bricks.filter((z) => z.properties.beat.take === chord), keep = bricks.filter((z) => !dead.includes(z));
    if (near) out.push('at ' + arg('dropat') + ' s: ' + SineGo.pn(Math.round(near.elec.midi)) + ' ' + near.startTime + ' → ' + near.endTime + ' s (' + near.properties.beat.take + ', ' + SHAPE_SAY[near.properties.beat.shape] + ')');
    const notesOf = (z) => s.objects.filter((o) => o.type === 'waveCurve' && o.layer === lane && o.properties && o.properties.sine && o.properties.sine.brick === z.id);
    const gone = dead.reduce((a, z) => a.concat(z, notesOf(z)), []);
    s.objects = s.objects.filter((o) => !gone.includes(o));
    let prevEnd = null;
    keep.forEach((z) => {
        if (prevEnd != null) {
            const gap = z.properties.beat.gapS != null ? z.properties.beat.gapS : r1(RULES.gapS[0] + Math.random() * (RULES.gapS[1] - RULES.gapS[0])), shift = r3(prevEnd + gap - z.startTime);
            if (shift) { notesOf(z).forEach((o) => { o.startSeconds = r3(o.startSeconds + shift); o.endSeconds = r3(o.endSeconds + shift); }); z.startTime = r3(z.startTime + shift); z.endTime = r3(z.endTime + shift); }
        }
        prevEnd = z.endTime;
    });
    const firstOf = {}; keep.forEach((z) => { if (firstOf[z.properties.beat.take] == null) firstOf[z.properties.beat.take] = z.startTime; });
    console.log(out.concat(TRACKS[lane].label + ' — ' + dead.length + ' pairs of ' + chord + ' taken out (' + (gone.length - dead.length) + ' notes) · ' + keep.length + ' pairs left: ' + Object.keys(firstOf).map((k) => k + ' ' + firstOf[k]).join(' · ') + ' · ends ' + (prevEnd != null ? prevEnd : 0)).join('\n'));
    if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
    s.objects.sort((a, b) => startOf(a) - startOf(b));
    s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(s));
    console.log('written: scores/' + name + '.json · File ▾ → Reload in the page');
    process.exit(0);
}
if (has('droplast')) {
    // --droplast: the lane's LAST pair is taken out — its sine brick and the notes bound to it
    const bricks = s.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecSine' && o.layer === lane).sort((a, b) => a.startTime - b.startTime);
    if (!bricks.length) die('no pair on the ' + TRACKS[lane].label + ' lane');
    const z = bricks[bricks.length - 1], gone = s.objects.filter((o) => o === z || (o.type === 'waveCurve' && o.layer === lane && o.properties && o.properties.sine && o.properties.sine.brick === z.id));
    s.objects = s.objects.filter((o) => !gone.includes(o));
    console.log(out.concat(TRACKS[lane].label + ' — the last pair taken out: ' + SineGo.pn(Math.round(z.elec.midi)) + ' ' + z.startTime + ' → ' + z.endTime + ' s (' + (gone.length - 1) + ' notes + its sine) · ' + (bricks.length - 1) + ' pairs left, the lane ends at ' + (bricks.length > 1 ? bricks[bricks.length - 2].endTime : 0) + ' s').join('\n'));
    if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
    s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(s));
    console.log('written: scores/' + name + '.json · File ▾ → Reload in the page');
    process.exit(0);
}
if (has('regap')) {
    // --regap: the pairs on the lane keep their shapes, lengths and pitches; every GAP between two of them is rolled again in the
    // rules' range (or --gap lo,hi) and the later pairs move as blocks. The lane's first entry stays where it is.
    const gR = range(arg('gap', RULES.gapS.join(',')), 'gap');
    const bricks = s.objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecSine' && o.layer === lane).sort((a, b) => a.startTime - b.startTime);
    const notesOf = (z) => s.objects.filter((o) => o.type === 'waveCurve' && o.layer === lane && o.properties && o.properties.sine && o.properties.sine.brick === z.id);
    const loose = s.objects.filter((o) => o.type === 'waveCurve' && o.layer === lane && !bricks.some((z) => o.properties && o.properties.sine && o.properties.sine.brick === z.id)).length;
    let prevEnd = null; const gaps = [];
    bricks.forEach((z, i) => {
        if (i > 0) {
            const gap = r1(gR[0] + Math.random() * (gR[1] - gR[0])), shift = r3(prevEnd + gap - z.startTime);
            notesOf(z).forEach((o) => { o.startSeconds = r3(o.startSeconds + shift); o.endSeconds = r3(o.endSeconds + shift); });
            z.startTime = r3(z.startTime + shift); z.endTime = r3(z.endTime + shift);
            if (z.properties && z.properties.beat) z.properties.beat.gapS = gap;
            gaps.push(gap);
        }
        prevEnd = z.endTime;
    });
    console.log(out.concat(TRACKS[lane].label + ' — ' + bricks.length + ' pairs, ' + gaps.length + ' gaps rolled again in ' + gR.join(' … ') + ' s: ' + gaps.join(' · ') + ' → ' + bricks.map((z) => z.startTime + '–' + z.endTime).join(' · ')
        + (loose ? ' · (' + loose + ' notes on the lane belong to no pair: not moved)' : '')).join('\n'));
    if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
    s.objects.sort((a, b) => startOf(a) - startOf(b));
    s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(s));
    console.log('written: scores/' + name + '.json · File ▾ → Reload in the page');
    process.exit(0);
}
let nextId = +s.nextId || 1;

// ---- ONE PAIR's objects from a line of [seconds, beats a second] -------------------------------------------------------------------
function pair(pitch, start, line, beat, rnd) {
    const midi = pitch - SOCT, sineMidi = Math.round((midi + SOCT + SCENTS / 100) * 10000) / 10000;   // the player's KEY · the sine's pitch
    if (midi < lo || midi > hi) die(SineGo.pn(midi) + ' is outside ' + L.voice + ' (' + SineGo.pn(lo) + ' … ' + SineGo.pn(hi) + ')');
    const len = line[line.length - 1][0], end = r3(start + len);
    if (WHO === 'sine') {
        // THE SINE MOVES: the shape is the brick's gliss — a line of [fraction, cents] at the sine's own pitch (eight points at the most);
        // the player re-bows under it: bowings of about targetS, never past ceilingS, gapS between
        const c = (b) => (b > 0 ? r2(SineSim.centsFor(sineMidi, b, sign)) : 0), points = line.map(([t, h]) => [r3(t / len), c(h)]).slice(0, 8);
        let n = Math.max(1, Math.round((len + BOW.gapS) / (BOW.targetS + BOW.gapS)));
        while ((len - (n - 1) * BOW.gapS) / n > BOW.ceilingS) n++;
        const total = len - (n - 1) * BOW.gapS; let w = Array.from({ length: n }, () => 1 + 0.2 * ((rnd ? rnd() : Math.random()) - 0.5));
        if (w.some((x) => total * x / w.reduce((a, b) => a + b, 0) > BOW.ceilingS)) w = w.map(() => 1);
        const sum = w.reduce((a, b) => a + b, 0), v = vel != null ? vel : Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, instKey, midi, m / 7))));
        const ids = w.map(() => 'wc-' + (nextId++)), zid = 'zn-' + (nextId++), far = Math.max(...points.map((p) => Math.abs(p[1])));
        const say = SineGo.pn(midi) + ' (sounding ' + SineGo.pn(pitch) + ') · ' + SHAPE_SAY[beat.shape] + ' · the sine glides: ' + line.map((p) => p[1]).join(' → ') + ' beats/s · ' + noteMark;
        let t = start;
        const notes = w.map((x, k) => { const a = r3(t), b = k === n - 1 ? end : r3(t + total * x / sum); t = b + BOW.gapS;
            return { id: ids[k], type: 'waveCurve', layer: lane, startSeconds: a, endSeconds: b, nodes: [{ pos: 0, y, smooth: 0.25 }, { pos: 1, y, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
                color: '#607D8B', fillMode: 'bottom', opacity: 0.55, performanceNotes: say + ' · bowing ' + (k + 1) + ' of ' + n,
                properties: { sine: { brick: zid, who: 'sine', kind: beat.shape, cents: far, seed: beat.seed != null ? beat.seed : null, take: '', was: { technique: L.voice, morphBend: null, sonifyMode: 'plain', velAbs: null, cc7Abs: null } } },
                sonifyNote: midi, technique: L.voice, sonifyMode: 'plain', recVel: v }; });
        const zone = SineGo.sineZone(zid, lane, start, end, { midi: sineMidi, gliss: { kind: 'line', from: points[0][1], to: points[points.length - 1][1], points }, level: { mode: 'flat', mark: sineMark }, label: '' }, ids[0]);
        zone.properties.sine.notes = ids;
        zone.properties.beat = Object.assign({ pitch: sineMidi, key: midi, hz: r2(SineSim.hz(sineMidi)), who: 'sine', side: sign > 0 ? 'over' : 'under', line, lengthS: len, farCents: far, bowings: n, sine: sineMark, note: noteMark, velocity: v }, beat);
        s.objects.push(...notes, zone);
        return { start, end, len, say: 'the SINE glides, ' + far + ' c at the most (at ' + r2(SineSim.hz(sineMidi)) + ' Hz) · the bar re-bowed ×' + n + ' (' + notes.map((o) => r1(o.endSeconds - o.startSeconds)).join(' ') + ' s, ' + BOW.gapS + ' s between) · key ' + SineGo.pn(midi) + ' · velocity ' + v + ' · sine ' + sineMark };
    }
    // beats a second -> cents at this pitch; a moving part is sampled every 0.25 s (straight in Hz is a curve in cents)
    const cents = (b) => (b > 0 ? r1(SineSim.centsFor(midi, b, sign)) : 0), bend = [];
    line.forEach(([t, h], i) => {
        if (i > 0) { const [t0, h0] = line[i - 1]; if (h0 !== h) for (let x = t0 + 0.25; x < t - 1e-6; x += 0.25) bend.push([r3(x), cents(h0 + (h - h0) * (x - t0) / (t - t0))]); }
        bend.push([r3(t), cents(h)]);
    });
    const far = Math.max(...bend.map((p) => Math.abs(p[1])));
    if (far > 100 * (inst.playerBendSt != null ? inst.playerBendSt : 1)) die(far + ' c is past the player\'s reach (' + inst.playerBendSt + ' st, sandbox/instruments.js)');
    const segs = SineGo.rekeyChain(bend, len, rangeC), off = segs.find((sg) => midi + sg.keyOffset < lo || midi + sg.keyOffset > hi);
    if (off) die('the re-key would need ' + SineGo.pn(midi + off.keyOffset) + ', outside ' + L.voice + ' (' + SineGo.pn(lo) + ' … ' + SineGo.pn(hi) + ')');
    const v = vel != null ? vel : Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, instKey, midi, m / 7))));
    const firstId = 'wc-' + (nextId++), ids = segs.slice(1).map(() => 'wc-' + (nextId++)), zid = 'zn-' + (nextId++);
    const say = SineGo.pn(midi) + ' · ' + SHAPE_SAY[beat.shape] + ' · ' + line.map((p) => p[1]).join(' → ') + ' beats/s · ' + noteMark;
    const was = { technique: L.voice, morphBend: null, sonifyMode: 'plain', velAbs: null, cc7Abs: null, endSeconds: end };
    const notes = segs.map((sg, k) => ({ id: k === 0 ? firstId : ids[k - 1], type: 'waveCurve', layer: lane,
        startSeconds: r3(start + sg.startS), endSeconds: r3(start + sg.endS + (k < segs.length - 1 ? SineGo.REKEY_OVERLAP_S : 0)),
        nodes: [{ pos: 0, y, smooth: 0.25 }, { pos: 1, y, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }], color: '#607D8B', fillMode: 'bottom', opacity: 0.55,
        performanceNotes: say + (segs.length > 1 ? ' · key ' + (k + 1) + ' of ' + segs.length : ''),
        properties: { sine: Object.assign({ brick: zid, who: 'player', kind: beat.shape, cents: sign * far, seed: beat.seed != null ? beat.seed : null, take: '', was, keyOffset: sg.keyOffset },
            segs.length > 1 ? { segment: { of: firstId, k: k + 1, n: segs.length } } : {}, k === 0 && segs.length > 1 ? { chain: ids } : {}) },
        sonifyNote: midi + sg.keyOffset, technique: L.voice, recVel: v, velAbs: v, cc7Abs: { lo: 127, hi: 127 }, morphBend: sg.bend }));
    const zone = SineGo.sineZone(zid, lane, start, end, { midi: sineMidi, gliss: { kind: 'none', from: 0, to: 0 }, level: { mode: 'flat', mark: sineMark }, label: '' }, firstId);
    zone.properties.beat = Object.assign({ pitch: midi, hz: r2(SineSim.hz(midi)), who: 'player', side: sign > 0 ? 'over' : 'under', line, lengthS: len, farCents: far, sine: sineMark, note: noteMark, velocity: v }, beat);
    s.objects.push(...notes, zone);
    const keys = segs.length > 1 ? 're-keyed ×' + segs.length + ' (' + notes.map((n) => SineGo.pn(n.sonifyNote)).join(' → ') + ', seams at ' + notes.slice(1).map((n) => n.startSeconds).join(' · ') + ' s)'
        : segs[0].keyOffset ? 'one note, played on ' + SineGo.pn(midi + segs[0].keyOffset) + ' (the wheel ' + segs[0].bend[0][1] + ' → ' + segs[0].bend[segs[0].bend.length - 1][1] + ' c)' : 'one note, inside the sampler\'s ±' + r3(rangeC / 100) + ' st';
    return { start, end, len, say: 'the bend up to ' + far + ' c · ' + keys + ' · velocity ' + v + ' · sine ' + sineMark };
}

if (has('roll')) {
    // ---- ROLLED: a gap, a shape, per pitch ----
    let pitches;
    if (arg('take')) {
        // --take <name> [--n 2]: the pitches from a TAKE of the Strikes drawer (bank/panel_snapshots.json) — this lane's pitch in it, round
        // robin where the take gives the lane several, --n pairs; brought into the voice's range by octaves. On a lane whose sine moves the
        // take's pitch is the KEY the player plays (the sounding pitch = that + sineOctave).
        const snaps = readJson('bank/panel_snapshots.json'), t = snaps.panels && snaps.panels.strikes && snaps.panels.strikes[arg('take')];
        if (!t) die('no take named "' + arg('take') + '" — the Strikes drawer\'s: ' + (Object.keys((snaps.panels && snaps.panels.strikes) || {}).join(', ') || '(none)'));
        const mine = SineGo.takeChord(t.state, TRACKS).filter((c) => c.lane === lane).map((c) => SineGo.fit(c.midi, lo, hi));
        if (!mine.length || mine.some((x) => x == null)) die('the take "' + arg('take') + '" holds no pitch for the ' + TRACKS[lane].label + ' inside ' + L.voice);
        pitches = Array.from({ length: Math.max(1, Math.round(+arg('n', mine.length))) }, (_, i) => mine[i % mine.length] + SOCT);
        out.push('the take "' + arg('take') + '": ' + TRACKS[lane].label + ' ' + mine.map((x) => SineGo.pn(x) + (SOCT ? ' (sounding ' + SineGo.pn(x + SOCT) + ')' : '')).join(' · '));
    } else pitches = String(arg('pitches', arg('pitch', '')) || '').split(',').map((x) => x.trim()).filter(Boolean).map(keyOf);
    if (!pitches.length) die('--roll wants --pitches D#2,D2,… (his, by hand) or --take <name> [--n 2]');
    const reachC = 100 * (inst.playerBendSt != null ? inst.playerBendSt : 1) - 2;
    const seed = Math.max(1, Math.round(+arg('seed', 1 + Math.floor(Math.random() * 99999)))), gapR = range(arg('gap', RULES.gapS.join(',')), 'gap');
    let at = arg('start') != null ? +arg('start') : null, lastEnd = Math.max(0, ...s.objects.filter((o) => o.layer === lane).map(endOf));
    out.push('seed ' + seed + ' · the rules: bank/beat_shapes.json');
    pitches.forEach((midi, i) => {
        const rnd = SineSim.mulberry32((Math.imul(seed, 2654435761) + Math.imul(i + 1, 40503)) >>> 0);
        const gap = at != null && i === 0 ? null : r1(gapR[0] + rnd() * (gapR[1] - gapR[0]));
        const cap = WHO === 'player' ? Math.floor(SineSim.beats(midi - SOCT, reachC) * 10) / 10 : null, capped = cap != null && cap < RULES.peakHz[1];
        const start = r3(gap == null ? at : lastEnd + gap), sh = rollShape(rnd, RULES, capped ? cap : null);
        const p = pair(midi, start, lineOf(sh.parts), { shape: sh.shape, peakHz: sh.peakHz, endHz: sh.endHz, parts: sh.parts, gapS: gap, seed, n: i + 1, take: arg('take') || 'opening' }, rnd);   // take: which chord the pair belongs to (§281 — the chords are moved as groups by it)
        lastEnd = p.end;
        out.push((i + 1) + ' · ' + SineGo.pn(midi) + ' · ' + SHAPE_SAY[sh.shape].toUpperCase() + ' · peak ' + sh.peakHz + (sh.endHz != null ? ', ends at ' + sh.endHz : '') + ' beats/s · ' + (gap != null ? 'gap ' + gap + ' s · ' : '') + p.start + ' → ' + p.end + ' s (' + p.len + ' s)',
            '    ' + sh.parts.map((q) => q.kind + ' ' + (q.fromHz === q.toHz ? 'at ' + q.toHz : q.fromHz + ' → ' + q.toHz) + ' · ' + q.s + ' s' + (q.paceSPerHz ? ' (' + q.paceSPerHz + ' s per Hz)' : '')).join('  |  '),
            '    ' + p.say + (capped ? ' · THE PEAK ROLLED UNDER ' + cap + ' beats/s — the player\'s reach (' + inst.playerBendSt + ' st) at this pitch' : ''));
    });
} else {
    // ---- DICTATED: from → to, there at --at, held ----
    const midi = keyOf(arg('pitch') != null ? arg('pitch') : die('--pitch (or --roll --pitches …)'));
    const fromHz = +arg('from', 0), toHz = +arg('to', 0), at = Math.max(0.05, Math.min(1, +arg('at', 2 / 3)));
    if (!(fromHz >= 0) || !(toHz >= 0)) die('--from and --to: beats a second, 0 or more');
    const lastEnd = Math.max(0, ...s.objects.filter((o) => o.layer === lane).map(endOf)), gR = range(arg('gap', RULES.gapS.join(',')), 'gap'), dR = range(arg('dur', '16,25'), 'dur');
    const gap = arg('start') != null ? null : r1(gR[0] + Math.random() * (gR[1] - gR[0]));
    const start = r3(arg('start') != null ? +arg('start') : lastEnd + gap), len = r1(dR[0] + Math.random() * (dR[1] - dR[0])), tAt = r3(len * at);
    const p = pair(midi, start, at >= 1 ? [[0, fromHz], [len, toHz]] : [[0, fromHz], [tAt, toHz], [len, toHz]], { shape: 'dictated', fromHz, toHz, at: r3(at), gapS: gap });
    out.push(TRACKS[lane].label + ' ' + SineGo.pn(midi) + ' · ' + p.start + ' → ' + p.end + ' s (' + p.len + ' s rolled' + (gap != null ? ', after a gap of ' + gap + ' s rolled' : '') + ')',
        '    ' + fromHz + ' → ' + toHz + ' beats/s, there at ' + r3(start + tAt) + ' s, held · ' + p.say);
}
console.log(out.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.objects.sort((a, b) => startOf(a) - startOf(b));
s.nextId = nextId; s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json — ' + s.objects.length + ' objects · File ▾ → Reload in the page');
