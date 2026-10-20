#!/usr/bin/env node
// build_sine_demo.js — THE SINE TONES, as a save the composer score opens (PLAN.md 1.5 · 12.6; RUNNING_LOG §181).
//
//   node tools/build_sine_demo.js [--out scores/sine-demo.json] [--seed 1] [--replace]
//
// What it writes, and nothing else:
//   · A SAMPLE TAKE in the Strikes drawer's own shape — bank/panel_snapshots.json, panels.strikes["take-01-sine-demo"]: his chord
//     shape cs-054 (D2 and a cluster D#5 · E5 · F5 · F#5), one pitch a player, by range: cello D2 · bass clarinet D#4 (folded an
//     octave down) · bass flute E5 · viola F5 · crotales F#5 (it sounds two octaves up). A SAMPLE — his own takes he makes in the
//     drawer. A name that is already there is NEVER written over (the file's contract): it is read and used.
//   · FIFTEEN PLAYED-IN NOTES, three a player on the five pitched lanes, 2 … 38 s, each 6 … 9 s, overlapping across the lanes — the
//     SHAPE of his playing-in (the lane's ordinary voice, one pitch a lane, struck at 80), not his playing.
//   · THE GO on all of them (score/public/sine_go.js — what  take ▾  and  ∿ sines  do in the page): each note its lane's pitch from
//     the take, the senza-vibrato voice, a sine brick over it, a bend drawn for the player — the crotales hold and their sine glisses.
//   · CURVE A, one long swell over the whole stretch (a reference curve on the curve window A); every second brick FOLLOWS it,
//     the others hold mf — both of a brick's level modes are in the file.
// Played with the engine up (start_electronics.bat) and the rack: the sines from the engine, the players from the rack.
// It refuses to write over a score it finds (--replace at his word) and never a piece-… name. GENERATED — re-run it rather than
// hand-edit; a change to the behaviours (bank/sine_behaviours.json) or to the seed gives another file.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SineSim = require(path.join(ROOT, 'score', 'public', 'sine_sim.js')), SineGo = require(path.join(ROOT, 'score', 'public', 'sine_go.js'));
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.join(ROOT, arg('out', 'scores/sine-demo.json'));
if (/[\\/]piece-/.test(OUT)) { console.error('refusing a piece-… name'); process.exit(3); }
if (fs.existsSync(OUT) && !has('replace')) { console.error(path.relative(ROOT, OUT) + ' is there already — --replace at his word (it may hold his edits)'); process.exit(3); }

const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const cfg = SineSim.config(JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'sine_behaviours.json'), 'utf8')));
const lane = (k) => { const l = TRACKS.findIndex((t) => t.instKey === k); if (l < 0) throw new Error('no lane of ' + k); return l; };
const SEED = Math.max(1, Math.round(+arg('seed', 1)));

// ---- the sample take --------------------------------------------------------------------------------------------------
const TAKE = 'take-01-sine-demo', SHAPE = 'cs-054';
const snapFile = path.join(ROOT, 'bank', 'panel_snapshots.json'), snaps = JSON.parse(fs.readFileSync(snapFile, 'utf8'));
snaps.panels = snaps.panels || {}; snaps.panels.strikes = snaps.panels.strikes || {};
let wroteTake = false;
if (!snaps.panels.strikes[TAKE]) {
    const shape = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'harmonies.json'), 'utf8')).banks.chordShapes.entries.find((e) => e.id === SHAPE);
    if (!shape) throw new Error('no chord shape ' + SHAPE + ' in bank/harmonies.json');
    // one pitch a player, by range: the lowest to the cello, then up — the bass clarinet's folded into its range
    const WHO = ['cello', 'bass_clarinet', 'bass_flute', 'viola', 'bowed_vibraphone'];
    if (shape.pitches.length !== WHO.length) throw new Error(SHAPE + ' has ' + shape.pitches.length + ' pitches; this builder deals five');
    const voices = shape.pitches.map((p, i) => {
        const k = WHO[i], I = INSTRUMENTS[k], tech = I.techniques.find((t) => t.key === cfg.lanes[k].voice), f = SineGo.fit(p, tech.rangeLow, tech.rangeHigh);
        if (f == null) throw new Error(SineGo.pn(p) + ' has no octave in ' + k + '\'s ' + tech.key);
        return { i, pitch: p, lane: lane(k), fold: (f - p) / 12, tech: tech.key, standIn: null, piano: false, solo: false, slot: i, skip: false, also: [] };
    });
    const strikeId = 'hs::harm:chordShapes:' + SHAPE;   // the drawer's id for one of his chord shapes (harm_source.js harmId · morph_panel.js pitchOptionGroups)
    snaps.panels.strikes[TAKE] = { comment: 'A SAMPLE take for the sine tones (PLAN 1.5 · 12.6) — his chord shape ' + SHAPE + ' "' + shape.name + '", one pitch a player by range. Written by tools/build_sine_demo.js; his own takes he makes in the drawer.',
        state: { strikeId, cfg: { strikeId, voicing: 'original', order: 'played', transpose: 0 }, rowKeys: {}, voices }, saved: new Date().toISOString() };
    wroteTake = true;
}
const chord = SineGo.takeChord(snaps.panels.strikes[TAKE].state, TRACKS);

// ---- the played-in notes: three a player, the lane's ordinary voice, one pitch a lane (the rhythm is the point, not the pitch) ----
const PLAYED = [
    ['bass_flute', 60, [[2.0, 8.5], [14.0, 21.0], [27.0, 35.0]]],
    ['bass_clarinet', 48, [[4.0, 11.0], [16.5, 22.5], [29.5, 36.0]]],
    ['bowed_vibraphone', 72, [[6.0, 14.0], [20.0, 26.0], [31.0, 38.0]]],
    ['viola', 60, [[3.0, 9.0], [12.0, 19.5], [24.0, 32.0]]],
    ['cello', 48, [[5.0, 13.5], [18.0, 25.0], [28.0, 37.0]]],
];
let nextId = 1;
const objects = [];
for (const [k, key, spans] of PLAYED) for (const [a, b] of spans) {
    objects.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: lane(k), startSeconds: a, endSeconds: b,
        nodes: [{ pos: 0, y: 10, smooth: 0.25 }, { pos: 1, y: 10, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
        color: '#607D8B', fillMode: 'bottom', opacity: 0.55, performanceNotes: 'TAKE', properties: {}, sonifyNote: key, technique: INSTRUMENTS[k].ordinary, sonifyMode: 'plain', recVel: 80 });
}
const notes = objects.slice();

// ---- the GO: the take's pitches, then the sines ---------------------------------------------------------------------
const took = SineGo.applyChord(notes, chord, TAKE);
const r = SineGo.convert(notes, { objects, instruments: INSTRUMENTS, tracks: TRACKS, cfg, seed: SEED, take: TAKE, newId: () => 'zn-' + (nextId++) });
if (r.done.length !== notes.length) throw new Error('the GO made ' + r.done.length + ' of ' + notes.length + ': ' + r.skipped.map((s) => s.why).join(' · '));

// ---- curve A: one long swell; every second brick follows it -----------------------------------------------------------
const CURVE_A = 7;   // composer.html CURVE_LAYERS[0] · CURVE_NAMES[7] = 'A' · CURVE_COLORS[7]
objects.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: CURVE_A, startSeconds: 0, endSeconds: 40,
    nodes: [{ pos: 0, y: 2, smooth: 0 }, { pos: 0.55, y: 8.5, smooth: 0 }, { pos: 1, y: 2.5, smooth: 0 }], segments: [{ model: 'bezier', slope: 0 }, { model: 'bezier', slope: 0 }],
    color: '#C2410C', fillMode: 'line', opacity: 0.45, performanceNotes: 'the sines\' swell — the bricks that follow curve A read their level from it', properties: {}, curveName: 'A' });
r.done.forEach((d, i) => { if (i % 2 === 0) d.zone.elec.level = { mode: 'curve', mark: 'mf', curveRef: 'A' }; });

const now = new Date().toISOString();
const save = {
    version: 1, layoutVersion: 8, tracks: TRACKS, assets: {},
    metadata: { created: now, modified: now,
        note: 'THE SINE TONES (PLAN 1.5 · 12.6) — fifteen played-in notes on the five pitched lanes, the take "' + TAKE + '" applied, the GO at seed ' + SEED + ': a sine brick over every note, a bend drawn for each player, the crotales\' sine glissing; curve A a swell that every second brick follows. Play it with the engine up and the rack. GENERATED by tools/build_sine_demo.js.',
        sineGo: [{ at: now, take: TAKE, seed: SEED, from: 0, to: 40, notes: r.done.map((d) => d.note.id), command: 'node tools/build_sine_demo.js --seed ' + SEED }] },
    objects, markers: [], databases: {}, nextId, viewport: { pixelsPerSecond: 30, scrollOffset: 0 },
};
if (wroteTake) fs.writeFileSync(snapFile, JSON.stringify(snaps, null, 2) + '\n');
fs.writeFileSync(OUT, JSON.stringify(save, null, 1) + '\n');
console.log(path.relative(ROOT, OUT) + ' — ' + notes.length + ' notes · ' + r.done.length + ' sine bricks · curve A · seed ' + SEED);
console.log((wroteTake ? 'the take WRITTEN: ' : 'the take found (not written over): ') + TAKE + ' · ' + chord.map((n) => (TRACKS[n.lane].short || n.lane) + ' ' + SineGo.pn(n.midi)).join(' · ')
    + (took.left.length ? ' · left: ' + took.left.join() : ''));
r.lines.forEach((l, i) => console.log('  ' + r.done[i].note.startSeconds.toFixed(1).padStart(5) + ' s  ' + l + (i % 2 === 0 ? '  [level: curve A]' : '  [level: mf]')));
