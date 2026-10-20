#!/usr/bin/env node
// build_drone_sources.js — THE DRONE SOURCES as a save the composer score opens (PLAN.md 10.13 steps 1 · 2; DEC-34 · 34b;
// RUNNING_LOG §170). The held sounds the players give the electronics to stretch into drones with his `icy`: one NOTE per input
// on its lane, with its technique and key, and a MIC OPENING over it — the opening's length is the cap on the sample. Played
// through once with the engine up (start_electronics.bat), the engine records each window, crops it (the attack, to −45 dB, the
// 80 ms fade) and banks it under the row's name; the two audition builders then make their bricks from those samples.
//
//   node tools/build_drone_sources.js [--replace] [--out scores/drone-sources.json]
//
// THE DATA IS THE PIECE'S: bank/drone_sources.json — a row per input (name · inst · technique · key · label), the timing
// (startS · gapS · holdS · preMs · windowS). Change a row there, run this again with --replace, File ▾ → Reload in the page.
// The note is build_first_object.js's shape (a waveCurve at mf, its technique the recipe's key); the opening is the engine's
// elecOpen zone with every field the composer's createZone gives a zone. It refuses to write over a score unless --replace, and
// never a piece-… name. THE SORTING: this tool knows the piece (its lanes, its recipes, its bank) — it is the piece's.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const REPLACE = process.argv.includes('--replace');
const OUT = path.join(ROOT, arg('out', 'scores/drone-sources.json'));
if (/[\\/]piece-/.test(OUT)) { console.error('refusing a piece-… name'); process.exit(3); }
if (fs.existsSync(OUT) && !REPLACE) { console.error(path.relative(ROOT, OUT) + ' exists — this tool never writes over a score without --replace'); process.exit(3); }

const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'drone_sources.json'), 'utf8'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const MF = 5.714285714285714;   // the written height of mf (4/7 of the 0–10 scale)
const r3 = (x) => Math.round(x * 1000) / 1000;

const playerOf = (port) => (ROUTE.players || []).find((p) => p.port === port || (Array.isArray(p.ports) && p.ports.includes(port)));
const zone = (id, model, layer, start, end, color, yOffset, elec) => ({
  id, type: 'zone', layer, startTime: r3(start), endTime: r3(end), player: '', instrument: '', zoneFunction: 'elec', midiModel: model,
  ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
  responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color, opacity: 0.35, yOffset, zoneHeight: 0.2,
  performanceNotes: '', properties: {}, elec,
});

const objects = [], rows = [];
let nextId = 1, t = +D.startS || 2;
const seen = new Set();
for (const x of D.inputs) {
  if (seen.has(x.name)) throw new Error('two inputs named ' + x.name);
  seen.add(x.name);
  const lane = TRACKS.findIndex((tr) => tr.instKey === x.inst);
  if (lane < 0) throw new Error(x.name + ': no lane has the recipe key ' + x.inst);
  const I = INSTRUMENTS[x.inst];
  const tech = (I.techniques || []).find((q) => q.key === x.technique);
  if (!tech) throw new Error(x.name + ': the lane ' + x.inst + ' has no technique ' + x.technique + ' — its keys: ' + I.techniques.map((q) => q.key).join(' · '));
  const lo = tech.rangeLow != null ? tech.rangeLow : I.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : I.rangeHigh;
  if (x.key < lo || x.key > hi) throw new Error(x.name + ': key ' + x.key + ' is outside ' + x.technique + "'s range " + lo + ' … ' + hi);
  const port = tech.port || I.port, player = playerOf(port);
  if (!player) throw new Error(x.name + ': no microphone on ' + port + ' (bank/elec_route.json players)');
  const hold = +(x.holdS || D.holdS || 5), pre = (+D.preMs || 100) / 1000, win = +(x.windowS || D.windowS || 6);
  objects.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: lane, startSeconds: r3(t), endSeconds: r3(t + hold),
    nodes: [{ pos: 0, y: MF, smooth: 0.25 }, { pos: 1, y: MF, smooth: 0.25 }], segments: [{ model: 'bezier', slope: 0 }],
    color: '#4F7942', fillMode: 'bottom', opacity: 0.5, performanceNotes: x.label, properties: {}, sonifyNote: x.key, technique: x.technique });
  objects.push(zone('zn-' + (nextId++), 'elecOpen', lane, t - pre, t - pre + win, '#00897B', 0, { name: x.name, category: D.category || 'drone', player: player.name }));
  rows.push({ t, lane, label: TRACKS[lane].label, tech: tech.label || x.technique, key: x.key, name: x.name, player: player.name, hold, win });
  t += +D.gapS || 8;
}

const now = new Date().toISOString();
const save = {
  version: 1, layoutVersion: 8, tracks: TRACKS, assets: {},
  metadata: { created: now, modified: now, note: 'THE DRONE SOURCES (PLAN.md 10.13; DEC-34): ' + rows.length + ' held notes, one per input of bank/drone_sources.json, a mic opening over each — played through once with the engine up, the nine samples are in the bank under the rows\' names. GENERATED by tools/build_drone_sources.js; a change goes into bank/drone_sources.json, then the tool with --replace, then File ▾ → Reload.' },
  objects, markers: [], databases: {}, nextId, viewport: { pixelsPerSecond: 60, scrollOffset: 0 },
};
fs.writeFileSync(OUT, JSON.stringify(save, null, 1) + '\n');
const work = OUT.replace(/\.json$/, '-work.json');
rows.forEach((r) => console.log(String(r.t.toFixed(1)).padStart(6) + ' s  lane ' + r.lane + ' ' + r.label.padEnd(14) + r.name.padEnd(18) + 'key ' + String(r.key).padEnd(4) + r.tech + '  · ' + r.hold + ' s, the window ' + r.win + ' s, mic ' + r.player));
console.log(path.relative(ROOT, OUT) + ' — ' + rows.length + ' notes and ' + rows.length + ' openings over ' + (t - (+D.gapS || 8) + (+D.windowS || 6)).toFixed(0) + ' s. Open it in the page: File ▾ → Experiments → ' + path.basename(OUT, '.json') + '; play from 0 with the engine up.');
if (fs.existsSync(work)) console.log('NOTE: the page holds a working copy (' + path.relative(ROOT, work) + ') — File ▾ → Reload drops it for this file.');
