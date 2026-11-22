#!/usr/bin/env node
// build_s3_page.js — THE FINAL SECTION'S PAGE (s3-phase), Section 3, 277.8 … 480 s: the phase form (the Switch~ piece RUNNING_LOG §433).
//   node tools/build_s3_page.js      (run from the repo root)
// HIS BRIEF is SW-163: the tubas' multi-tempo notation — each part's tempo mark, the beat lines, the tempo-change marks, a bouncing ball in
// each part — plus accel. / decel. (the word, a dashed line, the new tempo); f throughout, each crescendo a curve (the green, the full lane),
// f marked again after it. A FIRST BUILD for his review. Every decision taken on the page is a line added HERE.
//
// WHAT IT READS: the save's notes (each carries properties.phaseForm: player · hit · step · k) · bank/phase_form.json (the holds and the
// glides) · bank/tuplet_chunks.json dynamics.marks (the written dynamics, his of 2026-11-19).
// WHAT IT WRITES: the page through tools/notate_section.js (the notes as PLAIN NOTES, the beams, the dynamics' hands — in a file of
// arguments), then the page's overlays: `beatGrid` (a line and a ball on every beat) · `tempo` · `tempoSpan` (accel. / decel.) · `cresc`.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), SCORE = 'piece-FirstDraft-Final-D-ctptCello', W0 = 254, W1 = 482, ID = 's3-phase';
const LABEL = 'Section 3 - THE PHASE SECTION, first build (254 to 482 s)';
const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', SCORE + '.json'), 'utf8'));
const FORM = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'phase_form.json'), 'utf8'));
const DYN = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'tuplet_chunks.json'), 'utf8')).dynamics;
const BALL = JSON.parse(fs.readFileSync(path.join(ROOT, 'notation', 'registry', 'rules.json'), 'utf8')).objects.gcBall.beatPreset;   // the tubas' motion (§435)
const TS = JSON.parse(fs.readFileSync(path.join(ROOT, 'notation', 'registry', 'rules.json'), 'utf8')).objects.tempoSpan;

// ---- THE NUMBERS (the AI's for this first build — his to move)
const EPS = 0.02;            // a beat this close before a step's start belongs to the step
const MARK_OFF_SS = 6;       // accel. / decel. on a beat that also carries a tempo mark stands this far to its right
const CRESC_SAMPLES = 101;   // the lineage's least (a curve never fewer than 101 points)
// A BEAT'S WRITTEN VALUE (no rule of his yet — the tuplet notation of Section 3 is open): 2 or 3 to the beat = eighths (one beam);
// 4 and more = sixteenths (two beams — the lineage's 'nothing shorter than a 16th', #5 §528). Three over two beats = quarters, no beam.

// THE STACCATO DOT (his words 2026-11-22, §437 'yes on strings no on glock' · §438 'piano yes stacatto dot'): the violin's, the cello's and the piano's notes carry
// the dot, as the winds' staccato does by its own row; the glockenspiel's do not. The gap is the staccato unit's own.
const DOT_PARTS = new Set([5, 6, 7]), DOT_GAP = (((require(path.join(ROOT, 'notation', 'lib', 'rules.js')).loadContainer(ROOT).engraving || {}).layout || {}).devices || {}).byTechnique.staccato.nhDotGapSs;

// ---- THE NOTES, per part
const notes = save.objects.filter(o => o.type === 'waveCurve' && o.properties && o.properties.phaseForm && o.sonifyNote != null && o.startSeconds >= W0 && o.startSeconds < W1)
  .sort((a, b) => a.startSeconds - b.startSeconds);
const PARTS = [...new Set(notes.map(o => o.layer))].sort((a, b) => a - b);
const byPart = new Map(PARTS.map(p => [p, notes.filter(o => o.layer === p)]));

// ---- THE BEATS, per part: the time of every hit. A hit's first note (k 0) says its time; a hit with no first note (the second beat of a
// group over two beats) lies between its neighbours.
const beatsOf = new Map();
for (const p of PARTS) {
  const at = new Map();
  for (const o of byPart.get(p)) { const f = o.properties.phaseForm; if (f.k === 0 && !at.has(f.hit)) at.set(f.hit, o.startSeconds); }
  const hs = [...at.keys()].sort((a, b) => a - b), beats = [];
  for (let i = 0; i < hs.length; i++) {
    beats.push(at.get(hs[i]));
    if (i + 1 < hs.length) for (let h = hs[i] + 1; h < hs[i + 1]; h++) beats.push(at.get(hs[i]) + (at.get(hs[i + 1]) - at.get(hs[i])) * (h - hs[i]) / (hs[i + 1] - hs[i]));
  }
  beatsOf.set(p, beats.map(t => +t.toFixed(4)));
}
const firstBeatFrom = (p, t) => beatsOf.get(p).find(b => b >= t - EPS);
const bpmOver = (p, a, b) => { const bs = beatsOf.get(p).filter(t => t >= a - EPS && t <= b + EPS); return bs.length >= 2 ? 60 * (bs.length - 1) / (bs[bs.length - 1] - bs[0]) : null; };
const bpmAt = (p, t) => { const bs = beatsOf.get(p); let i = bs.findIndex(b => b >= t - EPS); if (i < 0) i = bs.length - 1; const a = Math.max(0, i - 1), b = Math.min(bs.length - 1, i + 1); return b > a ? 60 * (b - a) / (bs[b] - bs[a]) : null; };

// ---- THE TEMPO MARKS and the CHANGES, per part, from the form's steps
const overlays = [], log = [];
const r1 = x => Math.round(x * 10) / 10;
let nTempo = 0, nSpan = 0;
for (const p of PARTS) {
  let last = null; const marked = new Set();
  const mark = (t, bpm) => { if (t == null || bpm == null || (last != null && Math.abs(r1(bpm) - r1(last)) < 0.05)) return; overlays.push({ id: 'ov-s3-tempo-p' + p + '-' + Math.round(t * 1000), kind: 'tempo', target: { t, part: p }, value: { bpm: r1(bpm) }, provenance: 'authored' }); marked.add(t); last = bpm; nTempo++; };
  FORM.steps.forEach((st, i) => {
    const b0 = firstBeatFrom(p, st.from);
    if (st.kind === 'hold') { mark(b0, st.unison || bpmOver(p, st.from, st.to) || bpmAt(p, st.from)); return; }
    const next = FORM.steps[i + 1], b1 = firstBeatFrom(p, st.to) != null ? firstBeatFrom(p, st.to) : beatsOf.get(p)[beatsOf.get(p).length - 1];
    const target = next && next.kind === 'hold' ? (next.unison || bpmOver(p, next.from, next.to) || bpmAt(p, next.from)) : (!next && st.toUnison ? st.toUnison : bpmAt(p, st.to));
    const nBeats = beatsOf.get(p).filter(b => b >= b0 - 1e-6 && b <= b1 + 1e-6).length - 1;
    if (b0 != null && target != null && last != null && nBeats >= (TS.minBeats || 2) && Math.abs(r1(target) - r1(last)) >= 0.05) {
      overlays.push({ id: 'ov-s3-tspan-p' + p + '-' + Math.round(b0 * 1000), kind: 'tempoSpan', target: { part: p, span: [b0, b1] }, value: Object.assign({ word: target > last ? 'accel.' : 'decel.' }, marked.has(b0) ? { dx0Ss: MARK_OFF_SS } : {}), provenance: 'authored' }); nSpan++;
    }
    if (!next || next.kind !== 'hold') mark(b1, target);   // a change that runs into another change (or into the end): the tempo reached, said where it is reached
  });
}

// ---- THE TICKS and THE BALLS — THE TUBAS' WAY (his word 2026-11-22, §434: 'let's use the Tuba's way. Small black ticks … the magenta ball, same size as
// the tuba piece'): on every beat a small black tick above the staff (objects.tick) and the gestural curve's own ball (magenta, 5 px), in flight
// for exactly that beat — the tubas' per-part ball (#3 day 36: a `gc` device on the part's chunk, its duration the beat)
let nBeat = 0; const beatDevs = [];
for (const p of PARTS) { const bs = beatsOf.get(p);
  bs.forEach((t, i) => { const unit = +(i + 1 < bs.length ? bs[i + 1] - t : t - bs[i - 1]).toFixed(4);
    beatDevs.push({ part: p, at: t, unit }); nBeat++; }); }

// ---- THE DYNAMICS (his marks, bank/tuplet_chunks.json): f at the start · each 'f < fff' a CURVE (the green, the full lane) · the dynamic
// written again on the first note after a curve's end ('sub. f' in the data; his SW-163: 'just end the curve and put 1F in the next spot') ·
// the last curve's fff, held to the end, written where it is reached. Every other note writes no dynamic.
const dynNote = new Set(); let nCresc = 0;
for (const m of DYN.marks) for (const p of PARTS) {
  if (/</.test(m.text)) { const n = CRESC_SAMPLES; overlays.push({ id: 'ov-s3-cresc-p' + p + '-' + Math.round(m.t * 1000), kind: 'cresc', target: { part: p, span: [m.t, m.to] },
    value: { samples: Array.from({ length: n }, (_, i) => +(i / (n - 1)).toFixed(4)), fullHeight: true, fit: m.text + ' — ' + (m.why || '') }, provenance: 'authored' }); nCresc++; continue; }
  if (m.text === 'fff') continue;   // the held fff stands at its curve's end already (below)
  const o = byPart.get(p).find(x => x.startSeconds >= m.t - EPS); if (o) dynNote.add(o.id);
}
// [his word 2026-11-22, §438: 'f at the beginning and fff at the end of the curves centered on the start/end time'] each curve's two dynamics, CENTERED on its start and its end
for (const m of DYN.marks) if (/</.test(m.text)) { const [a, b] = m.text.split('<').map(x => x.trim()); for (const p of PARTS) for (const [t, mark] of [[m.t, a], [m.to, b]])
  overlays.push({ id: 'ov-s3-dyn-p' + p + '-' + Math.round(t * 1000), kind: 'dynAt', target: { part: p, t }, value: { mark }, provenance: 'authored' }); }

// ---- THE GROUPS: the notes of one hit (one beat, or a group over two beats)
const args = [], groups = new Map();
for (const o of notes) { const f = o.properties.phaseForm, k = o.layer + ':' + f.hit; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(o); }
const census = {}, grouped = new Set(), GROUPS = [];
for (const [k, g] of groups) { const f = g[0].properties.phaseForm; census[f.step] = (census[f.step] || 0) + 1;
  if (g.length < 2 || new Set(g.map(o => o.startSeconds.toFixed(3))).size < g.length) continue;
  GROUPS.push({ key: k.replace(':', '-'), notes: g, step: f.step }); for (const o of g) grouped.add(o.id); }
const nBeam = GROUPS.length;
const dotOf = o => DOT_PARTS.has(o.layer) ? { nhDot: true, nhDotGapSs: DOT_GAP } : {};
// ---- A HAND ON EVERY SINGLE NOTE: its dynamic (the mark's notes alone write one) · no gestural curve of its own (the ball on the beat is the cue) ·
// the head's LEFT EDGE on its moment and no go line (the plain note's own already)
for (const o of notes) if (!grouped.has(o.id)) args.push('--hand', o.id + ':' + JSON.stringify(Object.assign({ dynMark: dynNote.has(o.id) ? 'band' : false, gc: false, goLine: false, nhAnchor: 'leftEdge' }, dotOf(o))));
const argsFile = path.join(require('os').tmpdir(), ID + '.args.json');   // generated on every run — not the record
fs.writeFileSync(argsFile, JSON.stringify(args));

const cmd = ['tools/notate_section.js', '--score', SCORE, '--w0', String(W0), '--w1', String(W1), '--parts', '0-7', '--alone', W0 + '-' + W1, '--exp', '--noFitMark', '--timeSpacing',
  '--partName', '4:Glock', '--id', ID, '--label', LABEL];
for (const p of PARTS) cmd.push('--plainNotes', p + ':' + W0 + ':' + W1);
cmd.push('--argsFile', argsFile);
const r = spawnSync('node', cmd, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 });
const outp = (r.stdout + r.stderr).split('\n');
console.log(outp.filter(l => /READY|FAILED|INVALID|Error|usage|not an event|needs |GEOMETRY|!!/i.test(l)).join('\n').slice(0, 3000));
if (r.status !== 0) { console.log(outp.slice(-12).join('\n')); process.exit(r.status || 1); }

// ---- THE OVERLAYS, into the page the extractor wrote
const irPath = path.join(ROOT, 'notation', 'ir', ID + '.ir.json'), ir = JSON.parse(fs.readFileSync(irPath, 'utf8'));
ir.overlays = ir.overlays.filter(o => !/^ov-s3-/.test(o.id)).concat(overlays);
ir.layoutPolicy = Object.assign(ir.layoutPolicy || {}, { tempoRowSs: TS.rowSs });   // the tempo row on top of everything, one height (§438)
// THE GROUPS AS CLUSTERS (#4 day 23, figures.cluster — the one figure that carries a tuplet). Each group its own cluster on a grid of sixteenths:
// 4 to the beat, or 8 over two beats. HIS RULES (SW-164, §436): a group inside one beat takes the PLAIN number (5); a group over two beats the RATIO
// (3:2 · 5:4 · 7:4 · 9:8 · 11:8); no bracket, the number centered over the group (rules.json objects.tuplet.look.bracket). 2, 4 and 8 to the beat take none.
// THE ACCIDENTAL HOLDS FOR ITS GROUP (his 'accidentals per group', §438): a note whose sign already stands in its group writes none; a note that
// takes the sign back writes a natural.
{ const evOf = new Map(ir.events.map(e => [e.source.objectId, e])); let nNum = 0, nAccOut = 0, nNat = 0;
  for (const G of GROUPS) { const g = G.notes, two = G.step % 1 !== 0, N = Math.round(two ? G.step * 2 : G.step), U = two ? 8 : 4;
    const unit = +((g[1].startSeconds - g[0].startSeconds) * N / U).toFixed(6), plain = !two && (N === 2 || N === 4 || N === 8);
    const beams = two ? (N <= 3 ? 0 : N <= 7 ? 1 : 2) : (N <= 3 ? 1 : N <= 7 ? 2 : 3), text = two ? N + ':' + (N <= 3 ? 2 : N <= 7 ? 4 : 8) : String(N);
    if (!plain) nNum++; const seen = new Map();
    for (const o of g) { const e = evOf.get(o.id); if (!e) continue; const k = o.properties.phaseForm.k, sp = (e.pitch || {}).spelled || {}, pk = sp.step + sp.octave, acc = {};
      if (seen.has(pk)) { if (seen.get(pk) === (sp.alter || 0)) { if (sp.alter) { acc.noAcc = true; nAccOut++; } } else if (!sp.alter) { acc.accForce = 'natural'; nNat++; } }
      seen.set(pk, sp.alter || 0);
      const dev = Object.assign({ goLine: false, gc: false, dynMark: dynNote.has(o.id) ? 'band' : false, nhUnit: true, nhStem: 'beam', nhAnchor: 'leftEdge', nhHead: 'filled', nhHeadScale: 1, ringBar: false,
        nhDot: false, beamGroup: 's3-' + G.key + 'a', clusterId: 's3-' + G.key, beamUnit: unit, beamPos: +(k * U / N).toFixed(4), beamLevels: Math.max(1, beams), beamSubdivision: 4 },
        o.technique === 'staccato' ? { nhDot: true, nhDotGapSs: DOT_GAP } : {}, dotOf(o), acc,
        plain ? { noteUnits: U / N, noteBeams: beams } : { tupletGroup: 's3-' + G.key + '-tp', tupletNum: N, tupletDen: U, tupletStartPos: 0, tupletSlot: k, tupletText: text, tupletValue: beams === 0 ? 4 : beams === 1 ? 8 : 16, noteBeams: Math.max(1, beams), beamHasTuplet: true },
        beams === 0 ? { groupNoBeam: true } : {});
      ir.overlays.push({ id: 'ov-s3-cl-' + e.id, kind: 'engraving', target: { event: e.id }, value: { device: dev }, provenance: 'authored' }); } }
  console.log('groups ' + GROUPS.length + ' · with a number ' + nNum + ' · accidentals left out (already in the group) ' + nAccOut + ' · naturals written ' + nNat); }
// THE TICKS and THE BALLS, the tubas' way (#3 day 36): each beat a `gc` device on the chunk that holds its moment (else the last one before it)
{ const chOf = new Map(); for (const c of ir.chunks) { c.devices = (c.devices || []).filter(d => !/^dev-s3-beat-/.test(d.id)); if (!chOf.has(c.part)) chOf.set(c.part, []); chOf.get(c.part).push(c); }
  for (const list of chOf.values()) list.sort((a, b) => a.span[0] - b.span[0]);
  for (const b of beatDevs) { const list = chOf.get(b.part) || []; let c = list.find(x => b.at >= x.span[0] - 1e-6 && b.at < x.span[1] + 1e-6); if (!c) for (const x of list) if (x.span[0] <= b.at + 1e-6) c = x; if (!c) c = list[0];
    if (c) c.devices.push({ id: 'dev-s3-beat-p' + b.part + '-' + Math.round(b.at * 1000), kind: 'gc', mode: 'landing', at: b.at, preset: Object.assign({}, BALL, { duration: b.unit }), provenance: 'derived' }); } }
fs.writeFileSync(irPath, JSON.stringify(ir));   // compact: 4600 notes and 2200 overlays

console.log('parts ' + PARTS.join(' · ') + ' · notes ' + notes.length + ' · beats ' + nBeat + ' · tempo marks ' + nTempo + ' · accel. / decel. ' + nSpan + ' · crescendo curves ' + nCresc + ' · dynamics written ' + dynNote.size + ' · beamed groups ' + nBeam);
console.log('groups by notes-to-the-beat: ' + Object.keys(census).sort((a, b) => a - b).map(s => s + ' × ' + census[s]).join(' · '));
for (const p of PARTS) console.log('  part ' + p + ': ' + overlays.filter(o => o.target.part === p && (o.kind === 'tempo' || o.kind === 'tempoSpan')).sort((a, b) => (a.target.t != null ? a.target.t : a.target.span[0]) - (b.target.t != null ? b.target.t : b.target.span[0]))
  .map(o => o.kind === 'tempo' ? o.target.t.toFixed(1) + ' = ' + o.value.bpm : o.target.span[0].toFixed(1) + ' ' + o.value.word + ' → ' + o.target.span[1].toFixed(1)).join(' | '));
