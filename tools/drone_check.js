#!/usr/bin/env node
// drone_check.js — THE DRONE SECTION'S ONE CHECK (PLAN.md § 1.7, 15.4 g; RUNNING_LOG §249): on a score tools/build_drone_section.js made,
// against bank/drone_section.json and bank/presets.json —
//     three recordings a player (four at the layout; his word of 2026-10-08, §251), the first his (when his entries were read) · the
//     later ones 25 … 45 s after the previous, no two players' openings within 3 s, every opening before recording.lastStartS (120 s) ·
//     the first drone ≥ 30 s after its window ENDS (drone.firstAfterEndS) · one drone a lane at a time · after the first drone of a
//     player's last recording the sources rolled among the player's recordings, none twice before all (DEC-56) · the last drone of
//     each part to the section's end with its long fade out (drone.lastFadeOutS) · every band of
//     every dial used before any repeats (the window · the pace band · the overlaps band) · the fades and lengths in range · the
//     density reaches 5 and averages ≤ 3.5 · every drone's preset present, ended by a shape, its absolute length the drone's, its
//     start a fraction of a region · the plan's line for a drone as the kit sends it: thirteen fields, "<ms>ms", the fraction whole.
//   node tools/drone_check.js [--score drone-section]
// It ends DRONE_CHECK PASS (exit 0) or DRONE_CHECK FAIL (exit 1) and names each check. No engine, no server, no sound.
// THE SORTING: the piece's (its score, its data, its presets).
'use strict';
const fs = require('fs'), path = require('path');
const K = require('./audition_kit.js');
const ROOT = K.ROOT, NAME = K.arg('score', 'drone-section');
const CFG = K.readJson(path.join(ROOT, 'bank', 'drone_section.json')), P = K.readJson(K.PRESETS);
const file = path.join(ROOT, 'scores', NAME + '.json');
if (!fs.existsSync(file)) { console.error('no such score: ' + K.rel(file)); process.exit(2); }
const S = K.readJson(file), objects = S.objects || [];
const fails = [];
const check = (what, ok, detail) => { console.log('  ' + (ok ? 'ok   ' : 'FAIL ') + what + ' — ' + detail); if (!ok) fails.push(what); };
const r2 = (x) => Math.round(x * 100) / 100;
const R = CFG.recording, D = CFG.drone, LEN = +CFG.lengthS;
const recs = objects.filter((o) => o.properties && o.properties.rec).map((o) => Object.assign({ z: o }, o.properties.rec));
const drones = objects.filter((o) => o.properties && o.properties.drone).map((o) => Object.assign({ z: o }, o.properties.drone));
const meta = (S.metadata && S.metadata.droneSection) || {};
console.log('DRONE_CHECK ' + NAME + ' — ' + recs.length + ' recordings · ' + drones.length + ' drones · seed ' + (meta.seedUsed || '?') + (meta.entry ? ' · entry ' + meta.entry : ''));
check('the score is this tool\'s', S.metadata && S.metadata.builtBy === 'tools/build_drone_section.js', String(S.metadata && S.metadata.builtBy));

// the recordings
const byPlayer = {};
for (const p of CFG.players) byPlayer[p.name] = recs.filter((r) => r.player === p.name).sort((a, b) => a.k - b.k);
check(R.perPlayer + ' recordings a player', CFG.players.every((p) => byPlayer[p.name].length === R.perPlayer), CFG.players.map((p) => p.name + ' ' + byPlayer[p.name].length).join(' · '));
if (meta.entry === 'his') check('the first recording of each player is HIS note, with an opening over it', CFG.players.every((p) => byPlayer[p.name][0] && byPlayer[p.name][0].entry === 'his' && objects.some((o) => o.id === byPlayer[p.name][0].noteId && o.type === 'waveCurve' && !(o.properties && o.properties.droneSim))), CFG.players.map((p) => p.name + ' ' + (byPlayer[p.name][0] ? byPlayer[p.name][0].entry + ' ' + byPlayer[p.name][0].noteId : 'none')).join(' · '));
const gaps = [];
for (const p of CFG.players) for (let i = 1; i < byPlayer[p.name].length; i++) gaps.push(r2(byPlayer[p.name][i].openS - byPlayer[p.name][i - 1].openS));
check('a later recording ' + R.laterGapS[0] + ' … ' + R.laterGapS[1] + ' s after the previous one\'s start', gaps.every((g) => g >= R.laterGapS[0] - 0.01 && g <= R.laterGapS[1] + 0.01), gaps.join(' · '));
const sorted = recs.slice().sort((a, b) => a.openS - b.openS);
let apart = Infinity; for (let i = 1; i < sorted.length; i++) apart = Math.min(apart, r2(sorted[i].openS - sorted[i - 1].openS));
check('no two openings begin within ' + R.minApartS + ' s', apart >= R.minApartS, 'the closest ' + apart + ' s');
check('every window ' + R.lengthS[0] + ' … ' + R.lengthS[1] + ' s, every recording inside the section', recs.every((r) => r.windowS >= R.lengthS[0] && r.windowS <= R.lengthS[1] && r.openS >= 0 && r.openS + r.windowS <= LEN + 0.01), recs.map((r) => r.windowS).join(' '));
check('every opening is a mic opening over its note, named <player>-drone-<k>', recs.every((r) => r.z.midiModel === 'elecOpen' && r.z.elec && r.z.elec.name === r.player + '-drone-' + r.k && Math.abs(r.z.startTime - r.openS) < 0.002 && objects.some((o) => o.id === r.noteId && o.layer === r.z.layer && o.startSeconds >= r.openS && o.startSeconds < r.openS + 1)), recs.map((r) => r.z.elec && r.z.elec.name).join(' '));
check('a rolled recording\'s note is its player\'s multiphonic on a key of his list', recs.filter((r) => r.entry === 'rolled').every((r) => { const n = objects.find((o) => o.id === r.noteId), s = CFG.sources[r.player]; return n && n.technique === s.technique && (s.keys || [s.key]).includes(n.sonifyNote) && Math.abs(n.endSeconds - (r.openS + r.windowS)) < 0.01; }), recs.filter((r) => r.entry === 'rolled').map((r) => r.player + r.k + ':' + r.key).join(' '));

// the drones
const recOf = (d) => recs.find((r) => r.player === d.player && r.k === d.rec);
check('every opening begins before ' + R.lastStartS + ' s (his line: all the recordings before it)', R.lastStartS == null || recs.every((r) => r.openS <= +R.lastStartS), 'the last at ' + Math.max(...recs.map((r) => r.openS)).toFixed(1) + ' s');
check('the first drone of a recording ≥ ' + D.firstAfterEndS + ' s after its window ends (the render)', drones.every((d) => { const r = recOf(d); return r && d.z.startTime >= r.openS + r.windowS + D.firstAfterEndS - 0.01; }), drones.filter((d) => d.n === 1).map((d) => r2(d.z.startTime - recOf(d).openS - recOf(d).windowS)).join(' '));
let overlapOnLane = 0;
for (const p of CFG.players) { const mine = drones.filter((d) => d.player === p.name).sort((a, b) => a.z.startTime - b.z.startTime); for (let i = 1; i < mine.length; i++) if (mine[i].z.startTime < mine[i - 1].z.endTime - 0.001) overlapOnLane++; }
check('one drone a lane at a time', overlapOnLane === 0, overlapOnLane + ' overlaps');
// DEC-56: the source roll after the first drone of a player's last recording; the last drone of each part
const LAST_FADE = +(D.lastFadeOutS || 0), ANY = (D.afterLastRecording || 'own') === 'any';
const srcOk = [], lastOk = [];
for (const p of CFG.players) {
    const mine = drones.filter((d) => d.player === p.name).sort((a, b) => a.z.startTime - b.z.startTime), lastK = Math.max(...byPlayer[p.name].map((r) => r.k));
    const tail = mine.filter((d) => d.rec === lastK), before = mine.filter((d) => d.rec !== lastK);
    const own = before.every((d) => (d.src || d.rec) === d.rec) && (!tail.length || (tail[0].src || tail[0].rec) === lastK);
    const rolled = tail.slice(1).map((d) => d.src || d.rec), lap = rolled.slice(0, R.perPlayer);
    srcOk.push(own && (!ANY ? rolled.every((k) => k === lastK) : new Set(lap).size === Math.min(R.perPlayer, lap.length)));
    const L = mine[mine.length - 1];
    lastOk.push(LAST_FADE <= 0 || (L && L.last && Math.abs(L.z.endTime - LEN) < 0.01 && Math.abs(L.fadeOutS - LAST_FADE) < 0.01 && L.lengthS >= L.fadeInS + LAST_FADE + 1 - 0.01 && mine.filter((d) => d.last).length === 1));
}
check((ANY ? 'after the first drone of a player\'s last recording the sources are rolled — every recording of the player before any repeats; before it, its own' : 'every drone plays its own recording'), srcOk.every(Boolean), CFG.players.map((p) => p.name + ' ' + drones.filter((d) => d.player === p.name).sort((a, b) => a.z.startTime - b.z.startTime).map((d) => d.src || d.rec).join('')).join(' · '));
check('the last drone of each part runs to the section\'s end and fades out ' + LAST_FADE + ' s (one a part)', lastOk.every(Boolean), drones.filter((d) => d.last).map((d) => d.player + ' ' + d.lengthS + ' s, out ' + d.fadeOutS).join(' · '));
check('every drone ' + D.lengthS[0] + ' … ' + D.lengthS[1] + ' s (a cut one shorter; the last of a part longer, to the end), fades ' + D.fadeS[0] + ' … ' + D.fadeMaxS + ' s, inside the section', drones.every((d) => d.lengthS >= d.fadeInS + d.fadeOutS + 1 && (d.last || d.lengthS <= D.lengthS[1] + 0.01) && d.fadeInS >= D.fadeS[0] && d.fadeInS <= D.fadeMaxS && d.fadeOutS >= D.fadeS[0] && (d.last || d.fadeOutS <= D.fadeMaxS) && d.z.endTime <= LEN + 0.01), drones.map((d) => d.lengthS).join(' '));
const rests = [];
for (const p of CFG.players) { const mine = drones.filter((d) => d.player === p.name).sort((a, b) => a.z.startTime - b.z.startTime); for (let i = 1; i < mine.length; i++) if (mine[i].rec === mine[i - 1].rec) rests.push(r2(mine[i].z.startTime - mine[i - 1].z.endTime)); }
check('a rest of ' + D.restS[0] + ' … ' + D.restS[1] + ' s between a recording\'s drones', rests.every((g) => g >= D.restS[0] - 0.01 && g <= D.restS[1] + 0.01), rests.join(' ') || 'no two drones of one recording');
// the round robins: the first lap of each dial holds every band once
const firstLap = (seq, n) => new Set(seq.slice(0, n)).size === Math.min(n, seq.length);
const seq = drones.slice().sort((a, b) => a.i - b.i);
check('the windows: every one used before any repeats', firstLap(seq.map((d) => d.window.name), CFG.windows.length), seq.slice(0, CFG.windows.length).map((d) => d.window.name).join(' · '));
check('the pace bands: every one used before any repeats', firstLap(seq.map((d) => d.pace.band.join('-')), CFG.pace.bands.length), seq.slice(0, CFG.pace.bands.length).map((d) => '1/' + Math.round(d.pace.factor)).join(' · '));
check('the overlaps bands: every one used before any repeats', firstLap(seq.map((d) => d.overlaps.band.join('-')), CFG.overlaps.bands.length), seq.slice(0, CFG.overlaps.bands.length).map((d) => d.overlaps.n).join(' · '));
check('the pace inside 1/' + CFG.pace.bands[0][0] + ' … 1/' + CFG.pace.bands[CFG.pace.bands.length - 1][1] + ', the overlaps inside their bands', drones.every((d) => d.pace.factor >= d.pace.band[0] - 0.01 && d.pace.factor <= d.pace.band[1] + 0.01 && d.overlaps.n >= d.overlaps.band[0] && d.overlaps.n <= d.overlaps.band[1]), 'ok');
const sizes = drones.map((d) => { const set = CFG.grainSize.sets[d.window.set], lo = set[0].band[0], hi = set[set.length - 1].band[1]; return d.size.mode === 'steady' ? (d.size.s >= d.size.band[0] && d.size.s <= d.size.band[1]) : (d.size.from >= lo && d.size.from <= hi && d.size.to >= lo && d.size.to <= hi && typeof d.size.line === 'string'); });
check('the grain size inside its window\'s set, steady in a band or a shape between the set\'s ends', sizes.every(Boolean), drones.map((d) => d.size.mode[0]).join(''));
const modes = {}; for (const d of drones) modes[d.size.mode] = (modes[d.size.mode] || 0) + 1;
check('steady and the three shapes all come', ['steady', 'rising', 'falling', 'arch'].every((m) => modes[m] > 0), JSON.stringify(modes));
// the density
const secs = Math.ceil(LEN), dens = new Array(secs).fill(0);
for (const d of drones) for (let s = 0; s < secs; s++) if (s + 0.5 >= d.z.startTime && s + 0.5 < d.z.endTime) dens[s]++;
const dmax = Math.max(...dens), dmean = r2(dens.reduce((a, b) => a + b, 0) / secs);
check('the density reaches ' + CFG.keep.reachParts + ' and averages ≤ ' + CFG.keep.meanPartsMax, dmax >= CFG.keep.reachParts && dmean <= CFG.keep.meanPartsMax, 'up to ' + dmax + ' · mean ' + dmean + (meta.density ? ' (the builder said ' + meta.density.max + ' · ' + meta.density.mean + ')' : ''));
// the presets and the bricks
const pre = drones.map((d) => ({ d, p: P.presets.find((x) => x.key === d.key) }));
check('every drone has its preset: icy, ended by a shape, the drone\'s own absolute length and fades, the start a fraction of a region', pre.every(({ d, p }) => p && p.effect === 'icy' && p.end === 'shape' && p.audition === 'drone-section' && p.deal === false && Math.abs(p.durMs - d.lengthS * 1000) < 1 && Math.abs(p.atkMs - d.fadeInS * 1000) < 1 && Math.abs(p.relMs - d.fadeOutS * 1000) < 1 && String(p.args.icFromMs).startsWith('region@') && p.args.icLoop === 1 && p.args.icMix === 1 && p.args.icPitch === 0 && p.args.icEnv === d.window.icEnv), pre.filter(({ p }) => !p).map(({ d }) => d.key).join(' ') || 'all ' + pre.length);
check('every drone brick asks for its source recording through its preset, written ' + D.level, drones.every((d) => d.z.midiModel === 'elecPlay' && d.z.elec && d.z.elec.name === d.player + '-drone-' + (d.src || d.rec) && d.z.elec.variants && d.z.elec.variants[d.z.elec.name] === d.key + '-shape' && d.z.elec.dyn && d.z.elec.dyn.mode === 'mark' && d.z.elec.dyn.mark === D.level && d.z.layer === recOf(d).z.layer), drones.slice(0, 3).map((d) => d.z.elec.name + '~' + d.z.elec.variants[d.z.elec.name]).join(' · '));
check('the envelope "shape" is in bank/presets.json', !!(P.envelopes && P.envelopes.shape), JSON.stringify(P.envelopes && P.envelopes.shape && Object.keys(P.envelopes.shape)));
// the plan's line, as the kit sends it
const lines = K.planLines(drones.map((d) => d.z), P), f = (lines[0] || '').split(';');
check('the plan\'s line for a drone: thirteen fields — shape · "<ms>ms" · the fall · the curve — the fraction and a line whole', lines.length === drones.length && f.length === 13 && f[3] === 'shape' && /^\d+ms$/.test(f[5]) && f[9].includes('icFromMs:region@') && lines.every((l) => l.split(';').length === 13), String(lines[0]));
console.log(fails.length ? 'DRONE_CHECK FAIL — ' + fails.join(' · ') : 'DRONE_CHECK PASS');
process.exit(fails.length ? 1 : 0);
