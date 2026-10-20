#!/usr/bin/env node
// beating_check.js — THE BEATING SECTION'S ONE CHECK (PLAN.md § 1.8, 16.2 d; RUNNING_LOG §260): on a score
// tools/build_beating_section.js made, against bank/beating_section.json —
//     the roll reproduces (the same seed makes the same objects) · the start's notes and bricks are there, unchanged but for the
//     window · every phrase inside its bands and the section, a rest after it inside its bands · no note longer than its
//     player's ceiling, a wind's gap between two notes of a phrase, none for a bow · ONE sine brick a phrase, over the whole of it,
//     every note bound to it and it to them · every pitch the take's · the crescendo phrases: shaped notes that rise across the
//     phrase and say so · every sine brick a window · the density reaches its mark and averages under its cap.
//   node tools/beating_check.js [--score beating-section]
// It ends BEATING_CHECK PASS (exit 0) or BEATING_CHECK FAIL (exit 1) and names each check. No engine, no server, no sound.
// A score SAVED BY THE PAGE since it was built has lost its build record (the page's save keeps no metadata of a tool) and has the
// page's own stamps on its objects: the reproduction is then not compared, and the check says so.
// THE SORTING: the piece's (its score, its data).
'use strict';
const fs = require('fs'), path = require('path');
const K = require('./audition_kit.js'), B = require('./build_beating_section.js'), SineSim = require(path.join(K.ROOT, 'score', 'public', 'sine_sim.js')), SineGo = require(path.join(K.ROOT, 'score', 'public', 'sine_go.js'));
const ROOT = K.ROOT, NAME = K.arg('score', 'beating-section');
const file = path.join(ROOT, 'scores', NAME + '.json');
if (!fs.existsSync(file)) { console.error('no such score: ' + K.rel(file)); process.exit(2); }
const S = B.load(), CFG = S.CFG, SAVE = K.readJson(file), objects = SAVE.objects || [], meta = (SAVE.metadata && SAVE.metadata.beatingSection) || null;
const fails = [];
const check = (what, ok, detail) => { console.log('  ' + (ok ? 'ok   ' : 'FAIL ') + what + ' — ' + detail); if (!ok) fails.push(what); };
const r2 = (x) => Math.round(x * 100) / 100, MARKS = B.MARKS;
const notes = objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.properties && o.properties.phrase);
const bricks = objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecSine' && o.properties && o.properties.phrase);
const sines = objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecSine');
console.log('BEATING_CHECK ' + NAME + ' — ' + bricks.length + ' phrases · ' + notes.length + ' rolled notes · ' + sines.length + ' sine bricks in all · seed ' + (meta ? meta.seedUsed : '? (saved by the page since)'));

// the roll reproduces
if (meta) {
    const rolled = B.roll(S, meta.seedUsed), again = B.make(S, rolled);
    check('the same seed makes the same section', rolled.kept && JSON.stringify(again.objects) === JSON.stringify(objects) && again.nextId === SAVE.nextId, 'seed ' + meta.seedUsed + ' → ' + again.objects.length + ' objects against the file\'s ' + objects.length);
    check('the score is this tool\'s', SAVE.metadata.builtBy === B.TOOL, String(SAVE.metadata.builtBy));
} else console.log('  --   the same seed makes the same section — NOT COMPARED: the page has saved this score since it was built (its build record is gone)');

// the start
const base = K.readJson(path.join(ROOT, 'scores', CFG.start.from + '.json'));
const startOf = (o) => (o.startTime != null ? o.startTime : o.startSeconds);
const strip = (o) => { const c = JSON.parse(JSON.stringify(o)); if (c.elec) delete c.elec.track; if (c.properties) delete c.properties.start; delete c.midiSnippet; delete c.mutedBy; return JSON.stringify(c); };
const wantStart = (base.objects || []).filter((o) => startOf(o) < S.START), haveStart = wantStart.map((o) => objects.find((x) => x.id === o.id));
const redoLane = (o) => S.REDO.some((p) => p.lane === o.layer);   // a redo player's start notes and bricks are the GO's again (§263): present, not compared
check('the start is `' + CFG.start.from + '` as it is, to ' + S.START + ' s — but for the window' + (S.REDO.length ? ' and the ' + S.REDO.map((p) => p.label).join(' / ') + ' redo' : ''),
    haveStart.every(Boolean) && wantStart.every((o, i) => { if (redoLane(o)) return true; const a = JSON.parse(strip(o)), b = JSON.parse(strip(haveStart[i])); delete a.midiSnippet; delete b.midiSnippet; return JSON.stringify(a) === JSON.stringify(b); }),
    wantStart.length + ' objects of the start · ' + haveStart.filter(Boolean).length + ' found' + (S.REDO.length ? ' · ' + wantStart.filter(redoLane).length + ' of them redone' : ''));

// the phrases
const byPlayer = {};
for (const p of S.PLAYERS) byPlayer[p.inst] = bricks.filter((z) => z.properties.phrase.player === p.inst).sort((a, b) => a.startTime - b.startTime);
const lens = bricks.map((z) => r2(z.endTime - z.startTime)), loL = S.LB[0][0], hiL = S.LB[S.LB.length - 1][1];
check('every phrase ' + loL + ' … ' + hiL + ' s (one cut by the end: at least ' + S.MIN + ' s), inside ' + S.START + ' … ' + S.LEN + ' s, on its player\'s lane',
    bricks.every((z) => { const L = z.endTime - z.startTime, cut = Math.abs(z.endTime - S.LEN) < 0.011; return z.startTime >= S.START - 0.001 && z.endTime <= S.LEN + 0.011 && L <= hiL + 0.011 && (cut ? L >= S.MIN - 0.011 : L >= loL - 0.011) && z.layer === S.PLAYERS.find((p) => p.inst === z.properties.phrase.player).lane; }), lens.join(' '));
const rests = [];
for (const p of S.PLAYERS) for (let i = 1; i < byPlayer[p.inst].length; i++) rests.push(r2(byPlayer[p.inst][i].startTime - byPlayer[p.inst][i - 1].endTime));
check('a rest of ' + S.RB[0][0] + ' … ' + S.RB[S.RB.length - 1][1] + ' s between a player\'s phrases', rests.every((g) => g >= S.RB[0][0] - 0.011 && g <= S.RB[S.RB.length - 1][1] + 0.011), rests.join(' '));
check('every player has a part', S.PLAYERS.every((p) => byPlayer[p.inst].length > 0), S.PLAYERS.map((p) => p.label + ' ' + byPlayer[p.inst].length).join(' · '));

// the notes: the breath model
const notesOf = (z) => notes.filter((o) => o.properties.phrase.i === z.properties.phrase.i).sort((a, b) => a.startSeconds - b.startSeconds);
let longest = 0, badLen = [], badGap = [], badSpan = [];
for (const z of bricks) {
    const P = z.properties.phrase, ns = notesOf(z);
    ns.forEach((o, k) => {
        const L = o.endSeconds - o.startSeconds; longest = Math.max(longest, L);
        if (L > P.ceilingS + 0.002) badLen.push(o.id + ' ' + r2(L) + ' > ' + P.ceilingS);
        const seam = !!(o.properties.sine && o.properties.sine.segment && o.properties.sine.segment.of !== o.id);   // a re-keyed segment: the seam is checked below, not as a breath
        if (k > 0 && !seam) { const g = o.startSeconds - ns[k - 1].endSeconds; if (Math.abs(g - P.gapS) > 0.06 && !(g > P.gapS)) badGap.push(o.id + ' ' + r2(g)); if (P.gapS === 0 && Math.abs(g) > 0.002) badGap.push(o.id + ' ' + r2(g)); }
    });
    if (!ns.length || Math.abs(ns[0].startSeconds - z.startTime) > 0.002 || Math.abs(ns[ns.length - 1].endSeconds - z.endTime) > 0.002) badSpan.push(z.id);
}
check('no note longer than its player\'s breath or bow', badLen.length === 0, badLen.join(' · ') || 'the longest ' + r2(longest) + ' s · the ceilings ' + S.PLAYERS.map((p) => p.label + ' ' + ((byPlayer[p.inst][0] || { properties: { phrase: {} } }).properties.phrase.ceilingS)).join(' · '));
check('between two notes of a phrase: a wind\'s gap, the crotales\' own, none for a bow', badGap.length === 0, badGap.join(' · ') || S.PLAYERS.map((p) => p.label + ' ' + ((byPlayer[p.inst][0] || { properties: { phrase: {} } }).properties.phrase.gapS) + ' s').join(' · '));
check('a phrase begins with its first note and ends with its last', badSpan.length === 0, badSpan.join(' ') || 'all ' + bricks.length);

// one sine a phrase, bound both ways
const bound = bricks.every((z) => { const ns = notesOf(z), ids = (z.properties.sine && z.properties.sine.notes) || []; return ns.length === ids.length && ns.every((o) => ids.includes(o.id) && o.properties.sine && o.properties.sine.brick === z.id); });
const onePer = notes.every((o) => bricks.filter((z) => z.id === (o.properties.sine || {}).brick).length === 1) && new Set(bricks.map((z) => z.properties.phrase.i)).size === bricks.length;
check('ONE sine brick a phrase: every note bound to it, and it names them', bound && onePer, notes.length + ' notes under ' + bricks.length + ' bricks');
check('every sine brick is a WINDOW (Follow on) — the start\'s too', sines.every((z) => z.elec && z.elec.track && z.elec.track.on === true), sines.filter((z) => z.elec && z.elec.track && z.elec.track.on).length + ' of ' + sines.length);
check('the crotales\' brick says how long one glide lasts; a bending player\'s sine holds its pitch', bricks.every((z) => { const p = S.PLAYERS.find((q) => q.inst === z.properties.phrase.player); return p.who === 'sine' ? (z.elec.gliss.kind !== 'none' && z.elec.gliss.overS > 0) : z.elec.gliss.kind === 'none'; }),
    bricks.filter((z) => z.elec.gliss.kind !== 'none').map((z) => z.elec.gliss.kind + ' ' + z.elec.gliss.from + '→' + z.elec.gliss.to + ' over ' + z.elec.gliss.overS + ' s').slice(0, 3).join(' · '));
check('every phrase\'s brick is written at its player\'s own mark, else the section\'s', bricks.every((z) => { const p = S.PLAYERS.find((q) => q.inst === z.properties.phrase.player); return z.elec.level && z.elec.level.mode === 'flat' && z.elec.level.mark === (p.sineLevel || S.SINE_LEVEL); }),
    S.PLAYERS.map((p) => p.label + ' ' + (p.sineLevel || S.SINE_LEVEL)).join(' · '));
// a gliding sine's farthest beating, in beats a second, inside its lane's band — by the brick's own pitch (the same beat is more cents the lower the note)
const glides = bricks.filter((z) => S.cfg.lanes[z.properties.phrase.player].who === 'sine'), beatOff = [];
for (const z of glides) { const L = S.cfg.lanes[z.properties.phrase.player], band = L.beatHz || [3, 30], far = Math.max(Math.abs(z.elec.gliss.from), Math.abs(z.elec.gliss.to)), b = r2(SineSim.beats(z.elec.midi, far)); if (b < band[0] - 0.6 || b > band[1] + 0.6 || (L.side === 'over' && Math.min(z.elec.gliss.from, z.elec.gliss.to) < 0) || (L.side === 'under' && Math.max(z.elec.gliss.from, z.elec.gliss.to) > 0)) beatOff.push(z.properties.phrase.player + ' ' + z.id + ' ' + b + '/s'); }
check('a gliding sine beats inside its lane\'s band of beats a second, on the side its lane says', beatOff.length === 0, beatOff.join(' · ') || glides.map((z) => z.properties.phrase.player + ' ' + K.noteName(Math.round(z.elec.midi)) + ' ' + Math.max(Math.abs(z.elec.gliss.from), Math.abs(z.elec.gliss.to)) + ' c = ' + r2(SineSim.beats(z.elec.midi, Math.max(Math.abs(z.elec.gliss.from), Math.abs(z.elec.gliss.to)))) + '/s').join(' · '));

// the pitches: the take's
const pc = (m) => ((Math.round(m) % 12) + 12) % 12;
const keyOf = (o) => o.sonifyNote - ((o.properties.sine && o.properties.sine.keyOffset) || 0);   // a re-keyed segment's WRITTEN key (its MIDI key is moved, the bend re-based)
const takeOk = notes.every((o) => S.chord.some((n) => n.lane === o.layer && pc(n.midi) === pc(keyOf(o)))) && bricks.every((z) => { const ns = notesOf(z), L = S.cfg.lanes[z.properties.phrase.player]; return ns.length && Math.abs(z.elec.midi - (keyOf(ns[0]) + (+L.sineOctave || 0) + (+L.sineCents || 0) / 100)) < 0.0001; });
check('every pitch is the take\'s, and every sine stands on its player\'s sounding pitch', takeOk, S.PLAYERS.map((p) => p.label + ' ' + K.noteName(keyOf(notes.find((o) => o.layer === p.lane) || { sonifyNote: 0, properties: {} }))).join(' · ') + ' (the take "' + CFG.take + '")');
// THE RE-KEY (§263 — the string quartet's rule): every chain in the score — the start's redo and the phrases' — its segments in order,
// 5 ms overlaps, every bend inside the sampler's range, the SOUNDING pitch continuous at each seam, the brick over the whole chain
const chains = objects.filter((o) => o.type === 'waveCurve' && o.properties && o.properties.sine && Array.isArray(o.properties.sine.chain));
const chainBad = [];
let seams = 0, worstSeam = 0, farthest = 0;
for (const o of chains) {
    const inst = S.INSTRUMENTS[S.TRACKS[o.layer].instKey], R = 100 * (inst.bendRangeSt || 1), segs = [o].concat(o.properties.sine.chain.map((id) => objects.find((x) => x.id === id)));
    if (segs.some((x) => !x)) { chainBad.push(o.id + ' a segment missing'); continue; }
    const z = objects.find((x) => x.id === o.properties.sine.brick), last = segs[segs.length - 1].endSeconds;
    if (!z) chainBad.push(o.id + ' no brick');
    else if (z.properties && z.properties.sine && Array.isArray(z.properties.sine.notes)) {   // a phrase's brick: over the whole phrase, and it names the segments
        if (!segs.every((x) => z.properties.sine.notes.includes(x.id)) || z.startTime > o.startSeconds + 0.002 || z.endTime < last - 0.002) chainBad.push(o.id + ' the phrase\'s brick does not hold the chain');
    } else if (Math.abs(z.startTime - o.startSeconds) > 0.002 || Math.abs(z.endTime - last) > 0.002) chainBad.push(o.id + ' the brick does not span the chain');
    segs.forEach((x, k) => {
        const bend = x.morphBend || [];
        if (!bend.length || bend.some((p) => Math.abs(p[1]) > R + 1e-6)) chainBad.push(x.id + ' a bend past the sampler\'s ±' + R + ' c');
        farthest = Math.max(farthest, ...bend.map((p) => Math.abs(p[1] + ((x.properties.sine.keyOffset || 0) - (o.properties.sine.keyOffset || 0)) * 100)));
        if (k > 0) {
            const p = segs[k - 1], ov = p.endSeconds - x.startSeconds; seams++;
            if (Math.abs(ov - SineGo.REKEY_OVERLAP_S) > 0.0015) chainBad.push(x.id + ' overlap ' + r2(ov * 1000) + ' ms');
            const before = (p.properties.sine.keyOffset || 0) * 100 + SineGo.bendAt(p.morphBend, x.startSeconds - p.startSeconds), after = (x.properties.sine.keyOffset || 0) * 100 + SineGo.bendAt(x.morphBend, 0);
            worstSeam = Math.max(worstSeam, Math.abs(before - after));
            if (Math.abs(before - after) > 1.5) chainBad.push(x.id + ' the pitch jumps ' + r2(before - after) + ' c at the seam');
        }
    });
}
check('every re-keyed chain: the brick over the whole, 5 ms overlaps, every bend inside the sampler\'s range, the sounding pitch continuous at each seam', chainBad.length === 0,
    chainBad.slice(0, 4).join(' · ') || chains.length + ' chains · ' + seams + ' seams · the worst jump ' + r2(worstSeam) + ' c · the farthest bend ' + r2(farthest) + ' c from the written key');
const bendBand = S.PLAYERS.filter((p) => p.who === 'player' && S.cfg.lanes[p.inst].beatHz).map((p) => { const L = S.cfg.lanes[p.inst], mine = objects.filter((o) => o.type === 'waveCurve' && o.layer === p.lane && o.properties && o.properties.sine && !(o.properties.sine.segment && o.properties.sine.segment.of !== o.id));
    const off = mine.filter((o) => { const b = SineSim.beats(keyOf(o), Math.abs(o.properties.sine.cents)); return Math.abs(o.properties.sine.cents) > 1 && (b < L.beatHz[0] - 0.6 || b > L.beatHz[1] + 0.6) && !['hold', 'waver'].includes(o.properties.sine.kind) || (L.side === 'over' && o.properties.sine.cents < 0); });
    return { p, mine, off }; });
check('a bending player drawn in beats a second: its farthest offset inside its band at its own pitch, on its side', bendBand.every((b) => b.off.length === 0),
    bendBand.map((b) => b.p.label + ': ' + b.mine.map((o) => Math.abs(o.properties.sine.cents) + ' c = ' + r2(SineSim.beats(keyOf(o), Math.abs(o.properties.sine.cents))) + '/s').join(', ') + (b.off.length ? ' OFF ' + b.off.map((o) => o.id).join(' ') : '')).join(' ‖ ') || 'none');
check('every note is its lane\'s long-tone voice, bent or held as the GO drew it', notes.every((o) => { const p = S.PLAYERS.find((q) => q.lane === o.layer); return o.technique === p.voice && o.properties.sine.who === p.who && (p.who === 'player' ? Array.isArray(o.morphBend) && o.morphBend.length >= 2 : !o.morphBend); }), notes.length + ' notes');

// the crescendo phrases
const cres = bricks.filter((z) => z.properties.phrase.cresc), want = Math.max(0, Math.round(+S.C.n || 0));
const shaped = (o) => !o.sonifyMode && o.cc7Abs && o.cc7Abs.hi >= o.cc7Abs.lo && o.velAbs > 0 && Array.isArray(o.properties.simLevel);
const rises = cres.every((z) => {
    const ns = notesOf(z), m0 = MARKS.indexOf(z.properties.phrase.cresc.from), m1 = MARKS.indexOf(z.properties.phrase.cresc.to);
    if (!ns.every(shaped)) return false;
    const line = ns.map((o) => o.properties.simLevel);
    return Math.abs(line[0][0][1] - m0) < 0.02 && Math.abs(line[line.length - 1][1][1] - m1) < 0.02 && line.every((l, k) => l[1][1] >= l[0][1] && (k === 0 || l[0][1] >= line[k - 1][1][1] - 0.001));
});
check(want + ' crescendo phrases, on different players who bend: every note shaped (struck at mf, the fader between its two written dynamics), rising across the phrase, and saying so',
    cres.length === want && new Set(cres.map((z) => z.properties.phrase.player)).size === cres.length && rises && cres.every((z) => S.PLAYERS.find((p) => p.inst === z.properties.phrase.player).bends),
    cres.map((z) => z.properties.phrase.player + ' ' + z.startTime + ' … ' + z.endTime + ' s: ' + notesOf(z).map((o) => o.properties.simLevel.map((x) => x[1]).join('→')).join(' | ') + ' · CC7 ' + notesOf(z).map((o) => o.cc7Abs.lo + '–' + o.cc7Abs.hi).join(' ')).join(' ‖ ') || 'none');
check('the other notes are struck at the written dynamic and say nothing (a steady level)', notes.filter((o) => !bricks.find((z) => z.id === o.properties.sine.brick).properties.phrase.cresc).every((o) => o.recVel > 0 && !o.properties.simLevel), 'written ' + CFG.level);

// the density of the rolled part
const a = Math.floor(S.START), secs = Math.ceil(S.LEN) - a, dens = new Array(secs).fill(0);
for (const o of notes) for (let s = 0; s < secs; s++) if (s + a + 0.5 >= o.startSeconds && s + a + 0.5 < o.endSeconds) dens[s]++;
const dmax = Math.max(...dens), dmean = r2(dens.reduce((x, y) => x + y, 0) / secs);
check('the density reaches ' + S.D.reach + ' and averages ≤ ' + S.D.meanMax, dmax >= S.D.reach && dmean <= S.D.meanMax, 'up to ' + dmax + ' · mean ' + dmean + (meta ? ' (the builder said ' + meta.density.max + ' · ' + meta.density.mean + ')' : ''));
console.log(fails.length ? 'BEATING_CHECK FAIL — ' + fails.join(' · ') : 'BEATING_CHECK PASS');
process.exit(fails.length ? 1 : 0);
