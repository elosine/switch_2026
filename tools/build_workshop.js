#!/usr/bin/env node
// build_workshop.js — THE WORKSHOP FOR TRANSFORMING A SAMPLE, as a save the composer score opens (PLAN 1.3 · 10.1; RUNNING_LOG §103;
// his notes DEC-16 · 16b · 16c).
//
//   node tools/build_workshop.js [--source bfl-impulse-1] [--out scores/workshop-bfl-slap.json] [--force]
//
// One lane — the source's player's — and a chain on it, "I am sitting in a room" style: each brick is made FROM the one before.
//    2 s   a RETURN of the source as it is — the bass flute's tongue slap, bfl-impulse-1
//    9 s   stage 1   ~1   COMB                — the slap finds a pitch; ended by a SHAPE of 600 ms (a struck object)
//   16 s   stage 2   ~2   GREYHOLE, small     — a room rings; ended by its TAIL
//   23 s   stage 3   ~3   FREEZE + smear      — the ring held; a shape of 1.5 s
//   30 s   stage 4   ~4   JPVERB              — a hall on what was held; its tail
// The four stages are PROCESS bricks (midiModel elecProcess — electronics/score/le_process.js), written UNRENDERED: select one,
// its panel has Source · Effect · the dials · Ends by · Render · ▶. Render them IN ORDER, with the engine up (a stage is made
// from the one before); each render is banked as bank/samples/<source>~<n>.wav and the brick then plays it where it sits.
// THE SCHEME IS A PROPOSAL — the effects, their order and every dial are his to rewrite in the panels.
// It REFUSES to write over a score that exists (his renders and his changes live in it): --force says he means it.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const SRC = arg('source', 'bfl-impulse-1');
const OUT = path.join(ROOT, arg('out', 'scores/workshop-bfl-slap.json'));
if (/[\\/]piece-/.test(OUT)) { console.error('refusing a piece-… name'); process.exit(3); }
if (fs.existsSync(OUT) && !process.argv.includes('--force')) {
  console.error(path.relative(ROOT, OUT) + ' exists — it holds his renders and his changes. Nothing written. (--force to write over it)');
  process.exit(4);
}

const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const INDEX = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'samples', 'index.json'), 'utf8'));

const row = INDEX.samples.find((r) => r.name === SRC);
if (!row) { console.error(SRC + ' is not in bank/samples/index.json — capture it first'); process.exit(5); }
const player = ROUTE.players.find((p) => p.name === row.player);
if (!player) throw new Error('the route table has no player ' + row.player);
const ports = player.ports || [player.port];
const lane = TRACKS.findIndex((t) => ports.includes((INSTRUMENTS[t.instKey] || {}).port));
if (lane < 0) throw new Error('no lane plays on ' + ports.join(', '));

const zone = (id, model, start, end, color, yOffset, elec) => ({
  id, type: 'zone', layer: lane, startTime: start, endTime: end, player: '', instrument: '', zoneFunction: 'elec', midiModel: model,
  ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
  responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color, opacity: 0.35, yOffset, zoneHeight: 0.2,
  performanceNotes: '', properties: {}, elec,
});
const SHAPE = (atkMs, durMs, relMs, curve) => ({ end: 'shape', atkMs, durMs, relMs, curve, floorDb: -60, capMs: 8000, gainDb: 0, match: 1 });
const TAIL = (capMs) => ({ end: 'tail', atkMs: 2, durMs: 600, relMs: 600, curve: -4, floorDb: -60, capMs, gainDb: 0, match: 1 });
// THE SCHEME — a proposal (RUNNING_LOG §100 · §103): a pitch · a room · the ring held · a hall
const STAGES = [
  { label: 'a pitch', effect: 'comb', args: { combMix: 1, combTime: 0.012, combFb: 0.85 }, ends: SHAPE(2, 600, 600, -4) },
  { label: 'a room', effect: 'greyhole', args: { ghMix: 0.7, ghTime: 0.1, ghSize: 0.5, ghFb: 0.8, ghDiff: 0.7, ghDamp: 0.2 }, ends: TAIL(8000) },
  { label: 'held', effect: 'freeze', args: { freezeAtMs: 120, smear: 6 }, ends: SHAPE(20, 1500, 800, -2) },
  { label: 'a hall', effect: 'jpverb', args: { jpMix: 0.6, jpT60: 3, jpSize: 1.5, jpDamp: 0.3, jpLow: 1, jpMid: 1, jpHigh: 0.8 }, ends: TAIL(8000) },
];
const START = 2, STEP = 7, len = Math.max(0.2, (row.lengthMs || 500) / 1000);
const objects = [zone('zn-1', 'elecPlay', START, Math.round((START + len) * 1000) / 1000, '#8E24AA', 1, { name: SRC })];
STAGES.forEach((s, i) => {
  const at = START + STEP * (i + 1), source = i === 0 ? SRC : SRC + '~' + i, out = SRC + '~' + (i + 1);
  const length = s.ends.end === 'shape' ? s.ends.durMs / 1000 : 1;   // until it is rendered; then the brick is as long as its sample
  objects.push(zone('zn-' + (i + 2), 'elecProcess', at, at + length, '#EF6C00', 0.5,
    Object.assign({ source, out, label: s.label, effect: s.effect, args: s.args, rendered: null }, s.ends)));
});
const now = new Date().toISOString();
const save = {
  version: 1, layoutVersion: 8, tracks: TRACKS, assets: {},
  metadata: { created: now, modified: now, note: 'THE WORKSHOP (PLAN 1.3 · 10.1) — ' + SRC + ' and a chain of four transformations of it, each made from the one before (a pitch · a room · held · a hall). Select a stage, Render it from its panel with the engine up — in order — then play. The scheme is a proposal: every effect and dial is his. First written by tools/build_workshop.js; his from then on.' },
  objects, markers: [], databases: {}, nextId: objects.length + 3, viewport: { pixelsPerSecond: 100, scrollOffset: 0 },
};
fs.writeFileSync(OUT, JSON.stringify(save, null, 1) + '\n');
console.log(path.relative(ROOT, OUT) + ' — on ' + TRACKS[lane].label + ' (lane ' + lane + '):');
console.log('  ' + START.toFixed(1) + ' s  the return of ' + SRC + ' (' + Math.round(row.lengthMs) + ' ms)');
objects.slice(1).forEach((z) => console.log('  ' + z.startTime.toFixed(1) + ' s  ' + z.elec.out + ' = ' + z.elec.effect + ' ← ' + z.elec.source + ' · ' + z.elec.end + ' — ' + z.elec.label));
