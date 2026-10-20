#!/usr/bin/env node
// impulse.js — THE IMPULSES (running order step 8; RUNNING_LOG §71; his dictation 2026-10-05): the NEXT FIVE notes of his recorded
// rhythm, one per player, each given its technique, a pitch in the middle of that technique's range, and a MIC OPENING over it
// named <player>-impulse-<N>, category `impulse` — the name is the sample's identity through the piece (and its buffer's, in the
// engine). The rhythm is his: he played it into the Rec lane (lane 0, the bass flute); the notes are MOVED to the players' lanes,
// the rest of the rhythm stays where it is. The dictation lives in bank/impulses.json — a row per impulse number, five slots.
//   node tools/impulse.js --score piece-sec01-a --n 1 [--dry] [--redo] [--dyn mf|played]
// The score file is written in place (he has saved: a working copy of it refuses the tool; --dry runs on the save anyway). Reload it in the page after.
// --redo (DEC-29, 2026-10-05): impulse N is in the score already — its RETURNS are replaced from the row as it now reads; the notes
//   and the openings stay. A row's return may carry  shuffle: <seed>  — its samples in ANOTHER ORDER for each player, none twice.
// THE IMPULSES' OWN DYNAMICS (PLAN 1.4 · 11.5, 2026-10-06): an impulse is no longer forced to velocity 127. A row of bank/impulses.json may
//   say  "dyn": "mf"  (a mark, ppp … fff — the lane's LADDER velocity for that pitch, through bank/velocity_remap.json where the instrument
//   has a measured curve, the written anchor where it has none) or  "dyn": "played"  (the velocity he recorded is KEPT); a slot may say its
//   own. Absent: mf. --dyn on the command line stands for the row's. The length stays the standard's 150 ms.
//   --redo re-applies a dynamic ONLY where one is said (the row's, a slot's, or --dyn): the notes of rows that say none are not touched.
// THE SORTING: this tool knows the piece (its lanes, its save, its route table) — it is the piece's, not the engine's.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes('--dry'), REDO = process.argv.includes('--redo');
const N = String(arg('n', '1')), NAME = arg('score', '');
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const CLI_DYN = arg('dyn', '');
if (CLI_DYN && CLI_DYN !== 'played' && !MARKS.includes(CLI_DYN)) { console.error('--dyn: a mark (' + MARKS.join(' ') + ') or "played"'); process.exit(2); }
const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
if (!NAME) { console.error('which score?  --score piece-sec01-a'); process.exit(2); }
const FILE = path.join(ROOT, 'scores', NAME + '.json');
if (!fs.existsSync(FILE)) { console.error('no such score: ' + path.relative(ROOT, FILE)); process.exit(2); }
{   // the page's working copy: a refusal only when it holds something the save does not (§85: identical = nothing unsaved)
  const WORK = path.join(ROOT, 'scores', NAME + '-work.json');
  if (fs.existsSync(WORK)) {
    let same = false; try { same = JSON.stringify(JSON.parse(fs.readFileSync(WORK, 'utf8')).objects) === JSON.stringify(JSON.parse(fs.readFileSync(FILE, 'utf8')).objects); } catch (e) { same = false; }
    if (!same && !DRY) { console.error('the page holds a working copy of ' + NAME + ' with UNSAVED changes — Save (CTRL+S) or Reload there first'); process.exit(3); }
    console.log(same ? "(the working copy is identical to the save: nothing unsaved; Reload in the page after this)" : '(THE PAGE HOLDS UNSAVED CHANGES — this dry run is of the SAVE, not of what the page shows)');
  }
}

const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const html = fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8');
const TRACKS = vm.runInNewContext(html.match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const PLAN = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'impulses.json'), 'utf8'));
const ROW = PLAN[N], slots = Array.isArray(ROW) ? ROW : (ROW && ROW.slots), RETURN = Array.isArray(ROW) ? null : (ROW && ROW.return);   // §78: a row may name notes he placed himself, and a return around each
if (!Array.isArray(slots) || !slots.length) { console.error('bank/impulses.json has no row "' + N + '" — his dictation goes there first'); process.exit(2); }

const REC_LANE = 0;                 // the Rec lane: his rhythm lands on the bass flute's lane
const STD_DYN = 'mf', STD_LEN_S = 0.150;   // THE STANDARD: 150 ms long whatever he played (his word 2026-10-05, RUNNING_LOG §74). Until 11.5 it was also "10 of 10" — velocity 127 on every technique; now the DYNAMIC is the row's (above), mf where none is said
// the lane's ladder velocity for a mark at a pitch — DYNAMICS_LAW Rule 4's velAbs, by the stack's one helper (node-loadable)
const TextureDyn = require(path.join(ROOT, 'score', 'public', 'texture_dyn.js'));
const REMAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'velocity_remap.json'), 'utf8'));
const velFor = (instKey, midi, mark) => Math.max(1, Math.min(127, Math.round(TextureDyn.ladderVel(REMAP, instKey, midi, MARKS.indexOf(mark) / (MARKS.length - 1)))));
const BEFORE_S = 0.1, WINDOW_S = 0.5;   // the opening: 100 ms before the onset, 500 ms long (the M key's default, RUNNING_LOG §64)

const save = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const objects = save.objects || [];
const pool = objects.filter((o) => o.type === 'waveCurve' && o.layer === REC_LANE && !o.impulse).sort((a, b) => a.startSeconds - b.startSeconds);
const placed = slots.every((q) => q.noteId);   // §78: his own placement — the notes are on their lanes already; the tool tags, opens, returns
if (!placed && pool.length < slots.length) { console.error('the Rec lane holds ' + pool.length + ' unassigned note(s); impulse ' + N + ' needs ' + slots.length); process.exit(4); }
const already = objects.some((o) => o.impulse && String(o.impulse.n) === N);
if (already && !REDO) { console.error('impulse ' + N + ' is already in ' + NAME + ' (--redo replaces its returns from the row)'); process.exit(4); }
if (REDO && !already) { console.error('--redo: impulse ' + N + ' is not in ' + NAME + ' yet'); process.exit(4); }

let nextId = +save.nextId || (objects.length + 1);
const zone = (layer, start, end, elec, model) => ({
  id: 'zn-' + (nextId++), type: 'zone', layer, startTime: start, endTime: end, player: '', instrument: '', zoneFunction: 'elec', midiModel: model || 'elecOpen',
  ostinatoParams: { smooth: 0.7, speed: 1.0, stretch: 1.5 }, chordMarkers: [], ratioMarkers: [], ratioSourceZoneId: '', ratioGroup: '',
  responseDelayMs: 0, jitterMs: 8, driftFactor: 0.02, midiSnippet: null, color: model === 'elecPlay' ? '#8E24AA' : '#00897B', opacity: 0.35, yOffset: model === 'elecPlay' ? 1 : 0, zoneHeight: 0.2,
  performanceNotes: '', properties: {}, elec,
});

const rows = [];
slots.forEach((slot, i) => {
  const lane = TRACKS.findIndex((t) => t.instKey === slot.lane);
  const inst = INSTRUMENTS[slot.lane];
  if (lane < 0 || !inst) throw new Error('slot ' + (i + 1) + ': no lane plays ' + slot.lane);
  const own = slot.noteId ? objects.find((o) => o.id === slot.noteId && o.type === 'waveCurve') : null;
  if (slot.noteId && !own) throw new Error('slot ' + (i + 1) + ': no note ' + slot.noteId + ' in ' + NAME);
  if (own && own.layer !== lane) throw new Error('slot ' + (i + 1) + ': ' + slot.noteId + ' is on lane ' + own.layer + ', not ' + slot.lane);
  const tech = (inst.techniques || []).find((q) => q.key === (slot.tech || (own && own.technique)));
  if (!tech) throw new Error('slot ' + (i + 1) + ': ' + slot.lane + ' has no technique "' + slot.tech + '"');
  const lo = tech.rangeLow != null ? tech.rangeLow : inst.rangeLow, hi = tech.rangeHigh != null ? tech.rangeHigh : inst.rangeHigh;
  let note = slot.note != null && slot.note !== 'mid' ? +slot.note : (own ? +own.sonifyNote : Math.round((lo + hi) / 2));   // his own note keeps its pitch (§79)
  if (Array.isArray(tech.keys) && tech.keys.length && !tech.keys.some((k) => k.midi === note)) note = tech.keys[Math.floor(tech.keys.length / 2)].midi;   // a by-key voice: the middle KEY
  const player = (ROUTE.players.find((p) => (p.ports || [p.port]).includes(inst.port)) || {}).name || '';   // a player may own several ports (the percussionist's two lanes)
  const wc = own || pool[i];
  // 11.5: the dynamic — the slot's, else --dyn, else the row's, else mf for a new impulse; under --redo nothing unless one is said
  const dyn = slot.dyn || CLI_DYN || (ROW && !Array.isArray(ROW) && ROW.dyn) || (REDO ? '' : STD_DYN);
  if (dyn && dyn !== 'played' && !MARKS.includes(dyn)) throw new Error('slot ' + (i + 1) + ': "' + dyn + '" is no dynamic — a mark (' + MARKS.join(' ') + ') or "played"');
  const wasVel = wc.recVel != null ? wc.recVel : 100;
  const vel = !dyn ? null : dyn === 'played' ? wasVel : velFor(slot.lane, note, dyn);
  const name = (player || slot.lane) + '-impulse-' + N;
  const have = REDO ? objects.find((o) => o.type === 'zone' && o.midiModel === 'elecOpen' && o.layer === lane && o.elec && o.elec.name === name) : null;   // --redo: the opening that is there stays
  const open = have || zone(lane, Math.max(0, wc.startSeconds - BEFORE_S), wc.startSeconds - BEFORE_S + WINDOW_S, { name, category: 'impulse', player });
  // the return around the note (§78): a region ±regionMs about the note's onset, the engine rolls inside it (behaviour 'ar')
  const who = player || slot.lane;
  const nameOf = (q) => (q === '*' ? '*' : who + '-' + q);   // §89: '*' = every sample in the bank, not this player's alone
  const samples = (RETURN && RETURN.samples || []).slice();
  if (RETURN && RETURN.shuffle != null && !samples.includes('*')) {   // DEC-29: the row's samples in ANOTHER ORDER for each player (the seed and the slot), none twice
    const rnd = mulberry32((+RETURN.shuffle || 0) * 7919 + i + 1);
    for (let a = samples.length - 1; a > 0; a--) { const b = Math.floor(rnd() * (a + 1)); [samples[a], samples[b]] = [samples[b], samples[a]]; }
  }
  const nAll = (() => { try { return Math.max(1, (JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'samples', 'index.json'), 'utf8')).samples || []).filter((r) => r.kind !== 'processed').length); } catch (e) { return 1; } })();   // '*' = every CAPTURED sample: a render or a plan's variant is not one (§103 · §116)
  const nLinks = samples.includes('*') ? nAll : samples.length;
  const ret = !RETURN ? null : RETURN.behaviour === 'arChain'   // §87: a region from regionMs before the note to regionMs after it plus 0.5 s per further sample
    ? zone(lane, Math.max(0, wc.startSeconds - (RETURN.regionMs || 400) / 1000), wc.startSeconds + (RETURN.regionMs || 400) / 1000 + 0.5 * Math.max(0, nLinks - 1), { name: nameOf(samples[0]), names: samples.map(nameOf), behaviour: 'arChain' }, 'elecPlay')
    : RETURN.behaviour === 'chain'   // §82: the chain starts AT the note and runs 0.5 s per sample, the samples in the row's order (or the shuffle's)
    ? zone(lane, wc.startSeconds, wc.startSeconds + 0.5 * nLinks, { name: nameOf(samples[0]), names: samples.map(nameOf), behaviour: 'chain' }, 'elecPlay')
    : zone(lane, Math.max(0, wc.startSeconds - (RETURN.regionMs || 400) / 1000), wc.startSeconds + (RETURN.regionMs || 400) / 1000,
    { name: who + '-' + RETURN.sample, behaviour: RETURN.behaviour || 'ar' }, 'elecPlay');
  // --redo: the returns that sit at this note now, whatever they are — an elecPlay on this lane starting from the region before the note to just after it
  const old = REDO ? objects.filter((o) => o.type === 'zone' && o.midiModel === 'elecPlay' && o.layer === lane && o.startTime >= wc.startSeconds - 0.45 && o.startTime <= wc.startSeconds + 0.05) : [];
  if (note < lo || note > hi) { if (own) console.warn('slot ' + (i + 1) + ': HIS key ' + note + ' is outside ' + tech.label + ' (' + lo + '–' + hi + ') — kept, it may be silent'); else throw new Error('slot ' + (i + 1) + ': key ' + note + ' is outside ' + tech.label + ' (' + lo + '–' + hi + ')'); }   // the preset's own range, never the instrument's
  rows.push({ vel, dyn, wasVel, slot: i + 1, at: wc.startSeconds, lane: TRACKS[lane].label, tech: tech.label, note, player: player || '(no microphone)', name, noteId: wc.id, openId: open.id, ret: ret ? (ret.elec.names ? ret.elec.names.join(' + ') : ret.elec.name) + ' ~ ' + ret.elec.behaviour : '',
    old: old.map((o) => o.id + ' ' + ((o.elec || {}).behaviour || '') + ' ' + ((o.elec || {}).names || [(o.elec || {}).name]).join('+')).join(', ') });
  if (!DRY) {
    if (!REDO) {
      wc.layer = lane; wc.sonifyNote = note; wc.technique = tech.key; wc.sonifyMode = 'plain';
      wc.endSeconds = Math.round((wc.startSeconds + STD_LEN_S) * 1000) / 1000;   // the standard length
      wc.impulse = { n: +N, slot: i + 1, name };
    }
    if (vel != null) {   // the dynamic: the velocity, the tile's height in step with it (a struck note's height IS its velocity), and what was asked, on the note
      const y = Math.max(1, Math.round((vel / 127) * 100) / 10);
      wc.recVel = vel;
      wc.nodes = [{ pos: 0, y, smooth: 0.25 }, { pos: 1, y, smooth: 0.25 }];
      wc.impulse = Object.assign({}, wc.impulse, { dyn });
    }
    old.forEach((o) => objects.splice(objects.indexOf(o), 1));
    if (!have) objects.push(open);
    if (ret) objects.push(ret);
  }
});
rows.forEach((r) => console.log('impulse ' + N + '.' + r.slot + '  ' + r.at.toFixed(3) + ' s  ' + r.lane.padEnd(11) + r.tech.padEnd(34) + 'key ' + String(r.note).padEnd(4) + (r.vel == null ? 'vel ' + r.wasVel + ' (kept)' : 'vel ' + r.vel + ' (' + r.dyn + (r.vel !== r.wasVel ? ', was ' + r.wasVel : '') + ')').padEnd(24) + r.name.padEnd(18) + (r.player === '(no microphone)' ? '  NO MICROPHONE' : '') + (r.ret ? '  return ' + r.ret : '') + (r.old ? '  REPLACES ' + r.old : '')));
if (DRY) { console.log('(dry — nothing written)'); process.exit(0); }
save.nextId = nextId;
save.metadata = Object.assign({}, save.metadata, { modified: new Date().toISOString() });
fs.writeFileSync(FILE, JSON.stringify(save, null, 1) + '\n');
console.log(path.relative(ROOT, FILE) + ' written — ' + (REDO ? rows.length + ' notes kept, ' + rows.filter((r) => r.old).length + ' returns replaced' : rows.length + ' notes ' + (placed ? 'tagged' : 'moved') + ', ' + rows.length + ' openings placed' + (RETURN ? ', ' + rows.length + ' returns placed' : '')) + '. Reload it in the composer page.');
