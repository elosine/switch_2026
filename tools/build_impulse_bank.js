#!/usr/bin/env node
// build_impulse_bank.js — THE IMPULSE BANK as a save the composer score opens (his word 2026-10-06, DEC-37; PLAN.md 1.6 item 14.7;
// RUNNING_LOG §193). A bigger batch of impulses with a wider pitch variety, for the electronics to draw on — first for the three
// body problem (its five simulated players' attacks AND its three computer players' processed sounds), then wherever the piece
// asks. One NOTE per row of bank/impulse_bank.json on its lane, with its technique and key, and a MIC OPENING over it named
// <player>-impulse-<n> (the opening's name is the sample's identity in the bank); the players round robin, `gapS` apart. Then,
// `returnsAfterS` after the last opening, PART TWO: `variantsPerSample` RETURN BRICKS per sample, plain, `variantGapS` apart —
// tools/deal_variants.js deals each a preset of bank/presets.json (--env tail), and the page's plan at his pass has the engine
// render each sample's variants right after its capture (electronics/sc/process.scd planTake). Played through once with the
// engine up (start_electronics.bat), the batch is in the bank and its processed versions follow; part two is a listening of them
// — he may stop after the captures, the renders complete on their own.
//
//   node tools/build_impulse_bank.js [--replace] [--out scores/impulse-bank.json] [--dyn f] [--dry]
//   then:  node tools/deal_variants.js --score impulse-bank --env tail --seed 1
//
// THE DATA IS THE PIECE'S: bank/impulse_bank.json — a row per impulse (n · technique · key · label; `inst` on a row where the
// player's second instrument is meant), the timing, the dynamic. Change a row there, run this again with --replace, deal again,
// File ▾ → Reload in the page. The note is build_three_body.js's shape (a STRUCK note: the velocity is the dynamic, from the lane's
// ladder — DYNAMICS_LAW Rule 4); the opening and the return are the engine's zones with every field createZone gives a zone.
// It refuses to write over a score it did not make, over a working copy with unsaved changes, and never a piece-… name.
// THE SORTING: this tool knows the piece (its lanes, its recipes, its microphones, its bank) — it is the piece's.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const has = (k) => process.argv.includes('--' + k);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
// --retake (RUNNING_LOG §194): a CAPTURE AID — only the rows whose sample is NOT in the bank's index yet, re-timed from the start,
// no part two; written to scores/impulse-bank-retake.json. The samples' names are the same, so impulse-bank stays the source score.
const RETAKE = has('retake');
const OUT = path.join(ROOT, arg('out', RETAKE ? 'scores/impulse-bank-retake.json' : 'scores/impulse-bank.json')), NAME = path.basename(OUT, '.json'), DRY = has('dry');
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');
if (/[\\/]piece-/.test(OUT)) { console.error('refusing a piece-… name'); process.exit(3); }
if (!DRY && fs.existsSync(OUT)) {
  let mine = false; try { mine = !!JSON.parse(fs.readFileSync(OUT, 'utf8')).metadata.impulseBank; } catch (e) { mine = false; }
  if (!mine) { console.error(rel(OUT) + ' is there and this tool did not make it — it is not written over'); process.exit(3); }
  if (!has('replace')) { console.error(rel(OUT) + ' is there already — --replace at his word'); process.exit(3); }
  const WORK = path.join(path.dirname(OUT), NAME + '-work.json');
  if (fs.existsSync(WORK) && !has('unsaved-ok')) {
    let same = false; try { same = JSON.stringify(JSON.parse(fs.readFileSync(WORK, 'utf8')).objects) === JSON.stringify(JSON.parse(fs.readFileSync(OUT, 'utf8')).objects); } catch (e) { same = false; }
    if (!same) { console.error('the page holds a working copy of ' + NAME + ' with UNSAVED changes — Save (CTRL+S) or Reload there first (--unsaved-ok at his word)'); process.exit(3); }
  }
}

const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'impulse_bank.json'), 'utf8'));
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const DYN = arg('dyn', D.dyn || 'f');
if (!MARKS.includes(DYN)) { console.error('"' + DYN + '" is no dynamic — one of ' + MARKS.join(' ')); process.exit(2); }
const velFor = (instKey, midi, mark) => Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, instKey, midi, MARKS.indexOf(mark) / (MARKS.length - 1)))));
const r3 = (x) => Math.round(x * 1000) / 1000;
const playerOf = (port) => (ROUTE.players || []).find((p) => p.port === port || (Array.isArray(p.ports) && p.ports.includes(port)));

let nextId = 1;
const zone = (model, layer, start, end, elec) => ({
  id: 'zn-' + (nextId++), type: 'zone', layer, startTime: r3(start), endTime: r3(end), player: '', instrument: '', zoneFunction: 'elec', midiModel: model,
  ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
  responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color: model === 'elecPlay' ? '#8E24AA' : '#00897B', opacity: 0.35,
  yOffset: model === 'elecPlay' ? 1 : 0, zoneHeight: 0.2, performanceNotes: '', properties: {}, elec,
});

// ---- the rows, checked, in the order they are played: round robin across the players ------------------------------------
const order = Object.keys(D.players), seen = new Set();
let rows = [];
const most = Math.max(...order.map((p) => D.players[p].rows.length));
for (let i = 0; i < most; i++) for (const p of order) {
  const P = D.players[p], x = P.rows[i];
  if (!x) continue;
  const instKey = x.inst || P.inst, I = INSTRUMENTS[instKey];
  if (!I) throw new Error(p + ' ' + x.n + ': no recipe ' + instKey + ' in sandbox/instruments.js');
  const lane = TRACKS.findIndex((tr) => tr.instKey === instKey);
  if (lane < 0) throw new Error(p + ' ' + x.n + ': no lane has the recipe key ' + instKey);
  const tech = (I.techniques || []).find((q) => q.key === x.technique);
  if (!tech) throw new Error(p + ' ' + x.n + ': ' + instKey + ' has no technique ' + x.technique + ' — its keys: ' + I.techniques.map((q) => q.key).join(' · '));
  const lo = tech.rangeLow != null ? tech.rangeLow : I.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : I.rangeHigh;
  if (x.key < lo || x.key > hi) throw new Error(p + ' ' + x.n + ': key ' + x.key + ' is outside ' + x.technique + "'s range " + lo + ' … ' + hi);
  if (Array.isArray(tech.keys) && tech.keys.length && !tech.keys.some((k) => k.midi === x.key)) throw new Error(p + ' ' + x.n + ': ' + x.technique + ' has no key ' + x.key + ' — its keys: ' + tech.keys.map((k) => k.midi + ' ' + k.label).join(' · '));
  const port = tech.port || I.port, player = playerOf(port);
  if (!player) throw new Error(p + ' ' + x.n + ': no microphone on ' + port + ' (bank/elec_route.json players)');
  if (player.name !== p) throw new Error(p + ' ' + x.n + ': the port ' + port + ' is the microphone of ' + player.name + ', not of ' + p);
  const name = p + '-impulse-' + x.n;
  if (seen.has(name)) throw new Error('two rows named ' + name);
  seen.add(name);
  const keyLabel = Array.isArray(tech.keys) ? (tech.keys.find((k) => k.midi === x.key) || {}).label || '' : '';
  rows.push({ p, n: x.n, name, instKey, lane, tech, key: x.key, label: x.label || '', keyLabel, vel: velFor(instKey, x.key, DYN), player: player.name });
}

if (RETAKE) {   // only what the bank does not hold yet
  // the index is written by the engine after every capture and render — read it with a few tries, and REFUSE rather than take a
  // half-written file for an empty bank (RUNNING_LOG §196: one such read made a retake of all 68)
  const ix = (() => {
    const p = path.join(ROOT, 'bank', 'samples', 'index.json');
    for (let i = 0; i < 6; i++) { try { return JSON.parse(fs.readFileSync(p, 'utf8')).samples || []; } catch (e) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300); } }
    console.error('the bank\'s index could not be read (the engine was writing it?) — nothing written; try again'); process.exit(4);
  })();
  const before = rows.length;
  rows = rows.filter((r) => !ix.some((x) => x.name === r.name && x.kind !== 'processed'));
  console.log('--retake: ' + rows.length + ' of ' + before + ' impulses are not in the bank yet — those only, no part two');
  if (!rows.length) { console.log('nothing to retake'); process.exit(0); }
}

// ---- part one: the notes and their openings ----------------------------------------------------------------------------------
const objects = [];
const noteS = (+D.noteMs || 150) / 1000, pre = (+D.preMs || 100) / 1000, win = (+D.windowMs || 500) / 1000, gap = +D.gapS || 1.4;
let t = +D.startS || 2;
rows.forEach((r, i) => {
  r.t = r3(t);
  objects.push({ id: 'wc-' + (nextId++), type: 'waveCurve', layer: r.lane, startSeconds: r.t, endSeconds: r3(r.t + noteS),
    nodes: [{ pos: 0, y: 10, smooth: 0.25 }, { pos: 1, y: 10, smooth: 0.25 }], segments: [{ model: 'power', slope: 0 }],
    color: '#4F7942', fillMode: 'bottom', opacity: 0.5, performanceNotes: 'impulse ' + r.n + ' — ' + r.label + (r.keyLabel ? ' (' + r.keyLabel + ')' : ''), properties: {},
    sonifyNote: r.key, technique: r.tech.key, sonifyMode: 'plain', recVel: r.vel, impulse: { n: r.n, slot: i + 1, name: r.name } });
  objects.push(zone('elecOpen', r.lane, Math.max(0, r.t - pre), r.t - pre + win, { name: r.name, category: D.category || 'impulse', player: r.player }));
  t += gap;
});
const capturesEnd = r3(t - gap + win);

// ---- part two: the returns, dealt their presets by tools/deal_variants.js -----------------------------------------------------
const perSample = RETAKE ? 0 : Math.max(0, Math.round(+D.variantsPerSample || 0)), vgap = +D.variantGapS || 0.6;
let t2 = r3(capturesEnd + (+D.returnsAfterS || 4));
const part2Start = t2;
if (perSample) rows.forEach((r) => {
  for (let v = 0; v < perSample; v++) { objects.push(zone('elecPlay', r.lane, t2, t2 + 0.5, { name: r.name })); t2 = r3(t2 + vgap); }
  t2 = r3(t2 + vgap);
});
const endS = perSample ? r3(t2) : capturesEnd;

// ---- the say, and the write --------------------------------------------------------------------------------------------------
rows.forEach((r) => console.log(String(r.t.toFixed(1)).padStart(6) + ' s  ' + r.name.padEnd(16) + TRACKS[r.lane].label.padEnd(12) + String(r.tech.key).padEnd(30) + 'key ' + String(r.key).padEnd(4) + 'vel ' + String(r.vel).padEnd(4) + r.label + (r.keyLabel ? ' (' + r.keyLabel + ')' : '')));
const perPlayer = order.map((p) => p + ' ' + rows.filter((r) => r.p === p).length).join(' · ');
console.log(rows.length + ' impulses (' + perPlayer + '), the captures over 0 … ' + capturesEnd.toFixed(1) + ' s at ' + DYN + '; part two ' + (perSample ? perSample + ' returns a sample from ' + part2Start.toFixed(1) + ' s to ' + endS.toFixed(1) + ' s' : 'none'));
if (DRY) { console.log('(dry — nothing written)'); process.exit(0); }

const now = new Date().toISOString();
const save = {
  version: 1, layoutVersion: 8, tracks: TRACKS, assets: {},
  metadata: { created: now, modified: now,
    note: 'THE IMPULSE BANK (DEC-37; PLAN.md 1.6, 14.7): ' + rows.length + ' impulses, one per row of bank/impulse_bank.json, a mic opening over each — played through once with the engine up, the batch is in the bank under the rows\' names (' + order.map((p) => p + '-impulse-' + Math.min(...D.players[p].rows.map((x) => x.n)) + ' … ' + Math.max(...D.players[p].rows.map((x) => x.n))).join(' · ') + '). Part two, from ' + part2Start.toFixed(1) + ' s: ' + perSample + ' return bricks per sample, each dealt a preset (tools/deal_variants.js) — the processed versions, rendered by the engine right after each capture. GENERATED by tools/build_impulse_bank.js; a change goes into bank/impulse_bank.json, then the tool with --replace, the deal again, File ▾ → Reload.',
    impulseBank: { dyn: DYN, count: rows.length, retake: RETAKE, capturesEndS: capturesEnd, part2StartS: part2Start, endS, variantsPerSample: perSample, command: 'node tools/build_impulse_bank.js --dyn ' + DYN + (RETAKE ? ' --retake' : '') + (has('replace') ? ' --replace' : ''),
      rows: rows.map((r) => [r.name, r.t, r.instKey, r.tech.key, r.key, r.vel]) } },
  objects, markers: [], databases: {}, nextId, viewport: { pixelsPerSecond: 60, scrollOffset: 0 },
};
fs.writeFileSync(OUT, JSON.stringify(save, null, 1) + '\n');
console.log(rel(OUT) + ' written — ' + rows.length + ' notes, ' + rows.length + ' openings, ' + rows.length * perSample + ' returns; ' + endS.toFixed(0) + ' s. Next: node tools/deal_variants.js --score ' + NAME + ' --env tail --seed 1; then his pass: File ▾ → Experiments → ' + NAME + ', play from 0 with the engine up.');
const work = OUT.replace(/\.json$/, '-work.json');
if (fs.existsSync(work)) console.log('NOTE: the page holds a working copy (' + rel(work) + ') — File ▾ → Reload drops it for this file.');
