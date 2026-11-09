#!/usr/bin/env node
// beat_saw.js — A SAWTOOTH OF BEATING PAIRS on a lane (SW-14 · SW-15 · SW-18 · SW-19; RUNNING_LOG §119 … §123, 2026-11-09): the player's long
// tone and a sine at the same pitch, pair after pair, each pair beginning at the UNISON and rising along a line of BEATS A SECOND (his pace),
// the peak held, a gap, the next. WHO MOVES is the lane's (bank/sine_behaviours.json `who`): a `player` lane bends its note under ONE constant
// sine; a `sine` lane (the bowed crotale — a bar cannot bend; the flute at F6 — a bend of cents no one can place) holds its note STRAIGHT and
// the sine glides, one brick a pair. The long tone is cut into held tones by bank/breath_rules.json (a wind's breath · a string's bow · a
// crotale's bowing), each re-articulating on the cents the gliss had reached. The beating in Hz, the cents derived at the pitch.
//
//   DICTATED:  node tools/beat_saw.js --score <name> --lane alto_sax --pitch F4 --start 16 --pairs "0:0,10:5,16:9 ; 0:0,15:6" [--hold 1.8,2.6]
//   ROLLED:    node tools/beat_saw.js --score <name> --lane clarinet --pitch F5 --start 26.4 --roll --until 95 [--seed N]
//              the pairs by bank/beat_saw.json — shapes A (the fast finish) and B (the slow low one) alternating, every number rolled
//   BOTH:      [--sine <mark>] [--note <mark>] [--fade ms] [--sine-start s] [--gap lo,hi] [--breath aim,jitter] [--avoid] [--replace] [--dry]
//     --sine / --note   the marks, else bank/beat_saw.json's for the lane · --fade the sine's rise from silence (ms)
//     --sine-start      where a constant sine begins (a player lane; else one second before --start)
//     --avoid           the ensemble rule: no inhalation within breath_rules' ensembleMinGapS of another lane's (read from the save) — a held
//                       tone is stretched or shortened inside its range to clear it; what could not be cleared is said
//     --replace         this lane's sine bricks and the notes under them are taken out first
// THE SORTING: a piece's tool (its lanes, its saves, its data files); the objects it writes are the stack's notes and the engine's sine brick.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(2); };
const r1 = (x) => Math.round(x * 10) / 10, r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000;
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const markNum = (t) => { const i = MARKS.indexOf(String(t)); if (i >= 0) return i; if (!Number.isFinite(+t)) die('a mark is ppp … fff or a number'); return +t; };
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const keyOf = (t) => { if (Number.isFinite(+t)) return Math.round(+t); const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(String(t).trim()); if (!m) die('a pitch is a note name (F4) or a MIDI number'); return NAMES.indexOf(m[1].toUpperCase()) + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12 * (+m[3] + 1); };
const pn = (m) => NAMES[((Math.round(m) % 12) + 12) % 12] + (Math.floor(Math.round(m) / 12) - 1);
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const centsFor = (midi, beats) => 1200 * Math.log2((hz(midi) + beats) / hz(midi));   // the moving one OVER the still one
const roll = (rnd, r) => r[0] + rnd() * (r[1] - r[0]);

// ---- the data ----
const name = arg('score'); if (!name) die('--score <name>');
const file = path.join(ROOT, 'scores', name + '.json'); if (!fs.existsSync(file)) die('no such score: scores/' + name + '.json');
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const LANES = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'sine_behaviours.json'), 'utf8')).lanes;
const BR = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'breath_rules.json'), 'utf8'));
const SAW = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'beat_saw.json'), 'utf8'));
const laneArg = String(arg('lane', 'alto_sax')).toLowerCase();
const lane = TRACKS.findIndex((t, k) => [String(k), t.id, t.short, t.label, t.instKey].some((x) => String(x || '').toLowerCase() === laneArg));
if (lane < 0) die('--lane: none of ' + TRACKS.map((t) => t.id).join(', '));
const instKey = TRACKS[lane].instKey, inst = INSTRUMENTS[instKey], L = LANES[instKey];
if (!inst || !L) die('the lane ' + laneArg + ' has no part in the sines (bank/sine_behaviours.json)');
const WHO = L.who === 'sine' ? 'sine' : 'player', SOCT = +L.sineOctave || 0, SCENTS = +L.sineCents || 0;
const sounding = keyOf(arg('pitch') || die('--pitch'));                 // the pitch HE names: the sounding one
const key = sounding - SOCT, sineMidi = Math.round((sounding + SCENTS / 100) * 10000) / 10000;   // the player's key · the sine's pitch
const tech = inst.techniques.find((t) => t.key === L.voice) || die('the voice ' + L.voice + ' is not in the recipe of ' + instKey);
const lo = tech.rangeLow != null ? tech.rangeLow : inst.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : inst.rangeHigh;
if (key < lo || key > hi) die(pn(key) + ' is outside ' + L.voice + ' (' + pn(lo) + ' … ' + pn(hi) + ')');
const sineMark = markNum(arg('sine', SAW.sineMarks[instKey] != null ? SAW.sineMarks[instKey] : 'f')), noteMark = arg('note', SAW.noteMarks[instKey] || 'f');
if (!MARKS.includes(noteMark)) die('--note: one of ' + MARKS.join(' '));
const start = +arg('start', 16), fadeMs = Math.round(+arg('fade', SAW.fadeInMs || 1000));
const sineStart = r3(+arg('sine-start', start - 1));
const gapR = arg('gap') ? String(arg('gap')).split(',').map(Number) : SAW.gapS;
const holdR = arg('hold') ? String(arg('hold')).split(',').map(Number) : SAW.holdS;
// each lane its own stream unless a seed is said (five lanes rolled alike on one seed, §123)
const seed0 = +arg('seed', 23 + lane * 101); let seed = seed0; const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const breathOverride = arg('breath') ? String(arg('breath')).split(',').map(Number) : null;
// --cresc from,to (SW-24, §127): the note's dynamic SHAPED from one mark to the other over each pair (the stack performs a shape through the fader),
// the sine's level a HAIRPIN over the same span, its distance from the note kept (the lane's sine mark less the note's mark), capped at fff;
// --one: a pair is ONE held tone (no breath cut) — a crescendo is sung in one breath
const cresc = arg('cresc') ? String(arg('cresc')).split(',') : null;
if (cresc && (cresc.length !== 2 || !cresc.every((m) => MARKS.includes(m)))) die('--cresc from,to — two marks, ppp … fff');
const one = has('one');
const sineLevel = () => { if (!cresc) return { mode: 'flat', mark: String(sineMark) }; const off = sineMark - MARKS.indexOf(noteMark), c = (m) => Math.max(-10, Math.min(7, Math.round((MARKS.indexOf(m) + off) * 100) / 100)); return { mode: 'hairpin', mark: String(c(cresc[0])), to: String(c(cresc[1])) }; };
const dynCol = (mark) => { const i = MARKS.indexOf(mark); return i < 3 ? 'p' : i <= 4 ? 'mf' : 'f'; };
const isString = /violin|viola|cello|bass/.test(instKey), isCrotale = WHO === 'sine' && /vib|crot|perc|glock/.test(instKey);
const y = r3(10 * MARKS.indexOf(noteMark) / 7), vel = Math.round(127 * y / 10);   // the page's own rule for a mark (beat_pair.js §268)

// ---- the pairs: dictated, or rolled by SW-15's two shapes ----
let pairs;
if (has('roll')) {
    const until = +arg('until', 95), orderRolled = SAW.startWith == null && rnd() < 0.5;
    pairs = []; let t = start, k = orderRolled ? 1 : 0;
    while (t < until - 5) {
        const shape = SAW.order[k % SAW.order.length], S = SAW[shape]; let pts;
        if (shape === 'A') { const P = r1(roll(rnd, S.peakHz)), K = r1(P * S.kneeShare), p1 = roll(rnd, S.pace1SPerHz), p2 = roll(rnd, S.pace2SPerHz); const t1 = r1(K * p1), t2 = r1(t1 + (P - K) * p2); pts = [[0, 0], [t1, K], [t2, P]]; }
        else { const P = r1(roll(rnd, S.peakHz)), p = roll(rnd, S.paceSPerHz); pts = [[0, 0], [r1(P * p), P]]; }
        const hold = r1(roll(rnd, holdR)), len = pts[pts.length - 1][0] + hold;
        if (t + len > until + 3) break;
        pairs.push({ pts, hold, shape }); t += len + roll(rnd, gapR); k++;
    }
    if (!pairs.length) die('--roll: no room for a pair before --until ' + until);
} else {
    pairs = String(arg('pairs') || die('--pairs or --roll')).split(';').map((q) => { const [ln, h] = q.trim().split('|'); const pts = ln.split(',').map((x) => x.split(':').map(Number)); if (pts.some((p) => p.length !== 2 || !Number.isFinite(p[0]) || !(p[1] >= 0))) die('--pairs: t:beats,…|h<s>'); return { pts, hold: h ? +h.replace(/^h/, '') : r1(roll(rnd, holdR)), shape: 'dictated' }; });
}

// ---- the save; the other lanes' inhalations (for --avoid) ----
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
let nextId = s.nextId || (Math.max(0, ...s.objects.map((o) => +((/-(\d+)$/.exec(o.id || '') || [])[1] || 0))) + 1);
if (has('replace')) {
    const bricks = s.objects.filter((o) => o.layer === lane && o.midiModel === 'elecSine');
    const spans = bricks.map((b) => [b.startTime, b.endTime]);
    const under = (o) => spans.some(([a, b]) => (o.startSeconds != null ? o.startSeconds : o.startTime) >= a - 0.01 && (o.endSeconds != null ? o.endSeconds : o.endTime) <= b + 0.01);
    const gone = s.objects.filter((o) => bricks.includes(o) || (o.type === 'waveCurve' && ((o.layer === lane && o.sonifyNote != null && under(o)) || (o.curveName === 'A' && o.layer >= 13 && under(o)))));
    s.objects = s.objects.filter((o) => !gone.includes(o));
    console.log('replaced: ' + gone.length + ' object(s) taken out (' + bricks.length + ' sine brick(s), the notes and curve-A objects under them)');
}
const others = [];   // the inhalation times of the other lanes: the midpoint of each short gap between two notes on a lane
if (has('avoid')) {
    const byLane = {};
    for (const o of s.objects) if (o.type === 'waveCurve' && o.sonifyNote != null && o.layer !== lane && o.layer < 12) (byLane[o.layer] = byLane[o.layer] || []).push(o);
    for (const arr of Object.values(byLane)) { arr.sort((p, q) => p.startSeconds - q.startSeconds); for (let i = 1; i < arr.length; i++) { const g = arr[i].startSeconds - arr[i - 1].endSeconds; if (g > 0 && g < 2) others.push(r3((arr[i - 1].endSeconds + arr[i].startSeconds) / 2)); } }
}
const MINGAP = BR.ensembleMinGapS || 1.5; let unclear = 0;

// ---- the held tones of one pair: a wind's breaths · a string's bows · a crotale's bowings ----
let heldCount = 0;
function cut(len, t0) {
    const spans = []; let u = 0;
    if (one) return [[0, r3(len)]];
    if (isCrotale && !breathOverride) {   // bowings of about targetS, never past ceilingS, gapS between (Approaching's beating section)
        const C = BR.crotale || { ceilingS: 8, targetS: 5.8, gapS: 0.6 };
        while (u < len - 0.05) { let bl = Math.min(C.ceilingS, C.targetS * (0.8 + rnd() * 0.4)); if (u + bl > len) bl = len - u; if (bl < 0.8) break; spans.push([r3(u), r3(u + bl)]); u = u + bl + C.gapS; }
        return spans;
    }
    const ceilRow = isString ? BR.bowCeilingS : (BR.ceilingS.find((q) => key >= q.lo && key <= q.hi) || BR.ceilingS[BR.ceilingS.length - 1]);
    const ceil = ceilRow[dynCol(noteMark)], gapRange = isString ? BR.bowChangeS : BR.inhaleS;
    while (u < len - 0.05) {
        heldCount++;
        const share = heldCount % BR.shortEvery === 0 ? BR.shortShare : BR.heldShare;
        let bl = breathOverride ? breathOverride[0] + (rnd() * 2 - 1) * (breathOverride[1] || 0) : ceil * roll(rnd, share);
        const gap = roll(rnd, gapRange);
        if (others.length && !breathOverride) {   // the ensemble rule: this inhalation clear of every other lane's by MINGAP — slide inside the range
            const clear = (b) => others.every((x) => Math.abs(t0 + u + b + gap / 2 - x) >= MINGAP);
            if (!clear(bl)) { const lo2 = ceil * share[0], hi2 = ceil * share[1]; let found = null; for (let d = 0.1; d <= hi2 - lo2 && found == null; d += 0.1) { if (bl + d <= hi2 && clear(bl + d)) found = bl + d; else if (bl - d >= lo2 && clear(bl - d)) found = bl - d; } if (found != null) bl = found; else unclear++; }
        }
        if (u + bl > len) bl = len - u;
        if (bl < BR.minLastS) break;
        spans.push([r3(u), r3(u + bl)]);
        u = u + bl + gap;
    }
    return spans;
}

// ---- the build ----
let t = start; const notes = [], bricks = [], said = [];
pairs.forEach((P, pi) => {
    const line = P.pts.map(([tt, h]) => [tt, h]); const lastT = line[line.length - 1][0]; const len = r3(lastT + P.hold);
    if (P.hold > 0) line.push([len, line[line.length - 1][1]]);
    const movingMidi = WHO === 'sine' ? sineMidi : key;
    const bend = []; line.forEach(([tt, h], i) => { if (i > 0) { const [t0, h0] = line[i - 1]; if (h0 !== h) for (let x = t0 + 0.25; x < tt - 1e-6; x += 0.25) bend.push([r3(x), r1(centsFor(movingMidi, h0 + (h - h0) * (x - t0) / (tt - t0)))]); } bend.push([r3(tt), r1(centsFor(movingMidi, h))]); });
    const far = Math.max(...bend.map((p) => p[1]));
    if (WHO === 'player' && far > 100 * (inst.playerBendSt != null ? inst.playerBendSt : 1)) die('pair ' + (pi + 1) + ': ' + far + ' c is past the player\'s reach');
    const at = (x) => { if (x <= bend[0][0]) return bend[0][1]; for (let i = 1; i < bend.length; i++) if (x <= bend[i][0]) { const [ta, ca] = bend[i - 1], [tb, cb] = bend[i]; return ca + (cb - ca) * (x - ta) / Math.max(1e-9, tb - ta); } return bend[bend.length - 1][1]; };
    // A BEND PAST THE SAMPLER'S WHEEL (§127, the cello's 115 c at F2 for 6 beats/s): the note is played on a key as many semitones UP as needed and
    // its bend re-based from there (the string quartet's rule, beat_pair.js / sine_go.js rekeyChain's one-key case) — the written note is the same
    const rangeC = 100 * (inst.bendRangeSt > 0 ? inst.bendRangeSt : 1), keyOff = WHO === 'player' && far > rangeC ? Math.ceil((far - rangeC) / 100) : 0;
    if (keyOff && (key + keyOff > hi)) die('pair ' + (pi + 1) + ': the re-key to ' + pn(key + keyOff) + ' is outside ' + L.voice);
    const spans = cut(len, t), pairId = 'pair-' + (pi + 1), zid = WHO === 'sine' ? 'zn-' + (nextId++) : null;
    spans.forEach(([a, b], k) => {
        const yFrom = cresc ? r3(10 * MARKS.indexOf(cresc[0]) / 7) : y, yTo = cresc ? r3(10 * MARKS.indexOf(cresc[1]) / 7) : y;
        const n = { id: 'wc-' + (nextId++), type: 'waveCurve', layer: lane, startSeconds: r3(t + a), endSeconds: r3(t + b),
            nodes: [{ pos: 0, y: yFrom, smooth: 0.25 }, { pos: 1, y: yTo, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }], color: '#607D8B', fillMode: 'bottom', opacity: 0.55,
            properties: { sine: { brick: zid, who: WHO, kind: P.shape, pair: pi + 1, cents: WHO === 'player' ? far : 0, seed: seed0, take: '', was: { technique: L.voice, morphBend: null, sonifyMode: 'plain', velAbs: null, cc7Abs: null, endSeconds: r3(t + b) }, keyOffset: 0, held: { k: k + 1, n: spans.length } } },
            sonifyNote: key, technique: L.voice };
        if (!cresc) Object.assign(n, { recVel: vel, velAbs: vel, cc7Abs: { lo: 127, hi: 127 } });   // a flat tone keeps its struck sound (beat_pair's rule); a shaped one is the law's
        if (WHO === 'player') {   // the bend, the piece of the whole this held tone covers, re-based; it re-enters on the cents reached
            const inner = bend.filter((p) => p[0] > a + 1e-6 && p[0] < b - 1e-6).map(([tt, c]) => [r3(tt - a), c]);
            n.morphBend = [[0, r1(at(a))]].concat(inner, [[r3(b - a), r1(at(b))]]);
            if (keyOff) { n.sonifyNote = key + keyOff; n.morphBend = n.morphBend.map(([tt, c]) => [tt, r1(c - 100 * keyOff)]); n.properties.sine.keyOffset = keyOff; n.properties.sine.written = key; }
            n.properties.sine.held.fromCents = n.morphBend[0][1]; n.properties.sine.held.toCents = n.morphBend[n.morphBend.length - 1][1];
            n.performanceNotes = pn(key) + ' · ' + pairId + ' ' + P.pts.map((p) => p[1]).join(' → ') + ' beats/s · held tone ' + (k + 1) + ' of ' + spans.length + ': ' + n.morphBend[0][1] + ' → ' + n.morphBend[n.morphBend.length - 1][1] + ' c · ' + (cresc ? cresc[0] + ' → ' + cresc[1] : noteMark);
        } else {   // THE PITCH STANDS STILL (his word, SW-19: the crotale cannot bend; the flute at F6 holds) — the sine glides instead
            n.performanceNotes = pn(key) + (SOCT ? ' (sounds ' + pn(sounding) + ')' : '') + ' STRAIGHT · ' + pairId + ' the sine ' + P.pts.map((p) => p[1]).join(' → ') + ' beats/s · held ' + (k + 1) + ' of ' + spans.length + ' · ' + (cresc ? cresc[0] + ' → ' + cresc[1] : noteMark);
        }
        notes.push(n);
    });
    if (WHO === 'sine') {   // one sine brick a pair: its gliss the pair's line, in cents at the sine's pitch (eight points at the most)
        const gl = line.map(([tt, h]) => [r3(tt / len), r1(centsFor(sineMidi, h))]).slice(0, 8);
        bricks.push({ id: zid, type: 'zone', layer: lane, startTime: r3(t), endTime: r3(t + len), zoneFunction: 'elec', midiModel: 'elecSine', color: '#7B1FA2', opacity: 0.35, zoneHeight: 0.2, yOffset: 0.08, player: '', instrument: '',
            elec: { midi: sineMidi, gliss: { kind: 'line', from: 0, to: gl[gl.length - 1][1], points: gl }, level: sineLevel(), label: 'the sine glides, ' + pn(sounding) + ' holds', fadeInMs: fadeMs, track: { on: false } },
            properties: { sine: { note: notes.length ? notes[notes.length - spans.length].id : null }, beat: { pitch: key, sounding, hz: r2(hz(sineMidi)), who: 'sine', side: 'over', shape: P.shape, line: P.pts, holdS: P.hold, farCents: far, sine: sineMark, note: noteMark, velocity: vel, fadeInMs: fadeMs, seed: seed0 } } });
    }
    said.push(pairId + ' (' + P.shape + ') ' + r3(t) + ' → ' + r3(t + len) + ' s: ' + P.pts.map(([tt, h]) => h + ' at +' + tt + ' s').join(' → ') + ', held ' + P.hold + ' s · ' + (WHO === 'sine' ? 'the sine' : 'the bend') + ' to ' + far + ' c · ' + spans.length + ' held tone(s): ' + spans.map(([a, b]) => r1(b - a) + ' s').join(' '));
    t = r3(t + len + (pi < pairs.length - 1 ? roll(rnd, gapR) : 0));
});
const sineEnd = r3(t);
if (WHO === 'player') {   // ONE constant sine across every pair (his "keep the sine constant")
    const zid = 'zn-' + (nextId++); notes.forEach((n) => { n.properties.sine.brick = zid; });
    bricks.push({ id: zid, type: 'zone', layer: lane, startTime: sineStart, endTime: sineEnd, zoneFunction: 'elec', midiModel: 'elecSine', color: '#7B1FA2', opacity: 0.35, zoneHeight: 0.2, yOffset: 0.08, player: '', instrument: '',
        elec: { midi: sineMidi, gliss: { kind: 'none', from: 0, to: 0 }, level: sineLevel(), label: 'the tone ' + TRACKS[lane].label + ' beats against', fadeInMs: fadeMs, track: { on: false } },
        properties: { sine: { note: notes.length ? notes[0].id : null }, beat: { pitch: key, hz: r2(hz(key)), who: 'player', side: 'over', shape: has('roll') ? 'saw-rolled' : 'saw', pairs: pairs.map((P) => ({ line: P.pts, holdS: P.hold, shape: P.shape })), gapS: gapR, sine: sineMark, note: noteMark, velocity: vel, fadeInMs: fadeMs, breath: breathOverride ? { aimS: breathOverride[0], jitterS: breathOverride[1] || 0 } : { rules: 'bank/breath_rules.json' }, seed: seed0 } } });
}
s.objects.push(...bricks, ...notes);
s.objects.sort((p, q) => (p.startTime != null ? p.startTime : p.startSeconds) - (q.startTime != null ? q.startTime : q.startSeconds));
console.log(TRACKS[lane].label + ' ' + pn(sounding) + (SOCT ? ' (the key ' + pn(key) + ')' : '') + ' (' + r2(hz(sounding)) + ' Hz) · WHO MOVES: ' + (WHO === 'sine' ? 'THE SINE (the ' + TRACKS[lane].label.toLowerCase() + ' holds straight)' : 'the player') + ' · the sine' + (WHO === 'player' ? ' ' + sineStart + ' → ' + sineEnd + ' s constant' : ' a brick a pair') + ' at mark ' + sineMark + ', in over ' + fadeMs + ' ms · the note ' + noteMark + ' (velocity ' + vel + ') · ' + (isCrotale ? 'bowings ~' + (BR.crotale || {}).targetS + ' s' : (isString ? 'bows' : 'breaths') + ' by bank/breath_rules.json') + (has('avoid') ? ' · avoiding ' + others.length + ' inhalation(s) of other lanes' + (unclear ? ' (' + unclear + ' could not be cleared)' : '') : '') + ' · seed ' + seed0);
console.log(said.join('\n'));
if (has('dry')) { console.log('(dry: nothing written)'); process.exit(0); }
s.nextId = nextId; s.metadata = s.metadata || {}; s.metadata.modified = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(s));
console.log('written: scores/' + name + '.json — ' + s.objects.length + ' objects · File ▾ → Reload in the page');
