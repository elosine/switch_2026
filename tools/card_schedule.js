#!/usr/bin/env node
// card_schedule.js — THE INSTRUMENT CARD's timetable, FOR THIS RACK (the new-piece protocol's 5.3; RUNNING_LOG §42,
// 2026-10-04). Re-made from piece #6's (its PLAN 1b.2, 2026-09-19): the same output shape — probes/balance_probe.ps1
// plays it, probes/analyze_card.py reads it — but the notes come from THIS piece's recipe, not from piece #6's
// bank/balance.json (which stayed there).
//
//   node tools/card_schedule.js [--out probes/card_schedule.json] [--only key,key] [--print]
//
// WHAT IS MEASURED, and why only this (his word 2026-10-04: "let's … not repeat work" — RUNNING_LOG §29):
//   NEW, never measured        the bass flute · the four Ricotti mallets · six percussion instruments
//   RE-LEVELLED                the bass clarinet · the viola — piece #5 balanced them RELATIVELY; this puts them on
//                              piece #6's absolute scale
//   A CROSS-CHECK, 40 seconds  the cello · the wood blocks · the bass drum alt — measured in piece #6 on these very
//                              instances, on the very pitches used here, with the very trims now on their faders. If
//                              they read here what they read there, the chain of this rack IS piece #6's proven chain,
//                              and its bank/reference.json may be carried. If not, that is the finding.
//
// HOW A NOTE IS PLAYED — as the PIECE plays it (piece #6's lesson, its PLAN 1b.4: "measure on the channels the piece plays"):
//   a HELD instrument (the four Xsample)   its ordinary voice, on CURVE CHANNEL A (channel 2) with CC7 127 and its CC0 —
//                                          the composer score sends every drawn note there (the capture of §35)
//   a STRUCK instrument (mallets, percussion)   on the patch's own channel, NO CC7 and no CC0: Spitfire's plugin binds
//                                          CC7 to its gain, and a Kontakt slot's CC7 is its volume — a probe that sent
//                                          it would rewrite his mix
// Held notes: 4 s and a 3 s tail, three pitches × velocities 24 · 64 · 100 · 127, and one BEND note (the bend range).
// Struck notes: 0.2 s and a 5 s tail (a crotale and a cymbal ring), three keys × 127 · 64.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.join(ROOT, arg('out', 'probes/card_schedule.json'));
const ONLY = (arg('only', '') || '').split(',').filter(Boolean);
const PRINT = process.argv.includes('--print');
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});

const VELS = [24, 64, 100, 127], STRUCK_VELS = [127, 64], BEND_VEL = 100;
const LEAD_IN = 3000, PRE = 300, HOLD = 4000, TAIL = 3000, STRUCK_HOLD = 200, STRUCK_TAIL = 5000, INST_GAP = 1500;

// the HELD instruments: the lane key, its three pitches (low · middle · high of the ordinary voice's measured zone), its velocities
const HELD = [
  { key: 'bass_flute',    pitches: [50, 67, 84], vels: VELS, bend: true },
  { key: 'bass_clarinet', pitches: [36, 50, 63], vels: VELS, bend: true },
  { key: 'viola',         pitches: [50, 69, 86], vels: VELS, bend: true },
  { key: 'cello',         pitches: [48, 60, 71], vels: [127], bend: false, check: 'piece #6 card, run 30-REC-260919_1140: integrated −30.00 · −30.73 · −36.20 dB at its trim −3.87' },
];
// the MALLETS: one main patch per instrument (the catalog's technique key), three keys across its range
const MALLETS = [
  { inst: 'crotales',     tech: 'crot_main_metal', pitches: [62, 72, 82] },
  { inst: 'glockenspiel', tech: 'glock_main_hard', pitches: [57, 69, 82] },
  { inst: 'xylophone',    tech: 'xylo_main',       pitches: [55, 74, 93] },
  { inst: 'marimba',      tech: 'mar_main',        pitches: [38, 66, 94] },
];
// the PERCUSSION: `keys` named = piece #6's own keys (the cross-check); otherwise three plain HITS, one per beater where there are three
const PERC = [
  { slug: 'bongos' }, { slug: 'shime_daiko' }, { slug: 'china_cymbals' }, { slug: 'small_metals_spring_coil' }, { slug: 'susp_cymbals_bright' }, { slug: 'toms_high' },
  { slug: 'wood_blocks',   keys: [36, 48, 56], check: 'piece #6 card, run 30-REC-260919_0833: loudest 400 ms −22.46 · −22.04 · −25.87 dB at trim +15.43 → −30.84 · −30.42 · −34.25 at +7.05' },
  { slug: 'bass_drum_alt', keys: [36, 48, 55], check: 'piece #6 card, run 30-REC-260919_0833: loudest 400 ms −20.92 · −20.90 · −24.04 dB at trim +5.60 → −30.81 · −30.79 · −33.93 at −4.29' },
];

const notes = []; let t = LEAD_IN;
const push = (o, hold, tail) => { notes.push(Object.assign({ i: notes.length, tPreMs: t - PRE, tOnMs: t, tOffMs: t + hold }, o)); t += hold + tail; };
const want = k => !ONLY.length || ONLY.includes(k);

for (const H of HELD) {
  if (!want(H.key)) continue;
  const R = INSTRUMENTS[H.key], tech = R.techniques.find(x => x.key === R.ordinary);
  if (!tech) throw new Error('no ordinary voice for ' + H.key);
  const ch = (R.channels && Array.isArray(R.channels.curve) && R.channels.curve.length) ? R.channels.curve[0] : 1;   // curve copy A
  for (const p of H.pitches) if (p < tech.rangeLow || p > tech.rangeHigh) throw new Error(H.key + ': pitch ' + p + ' outside ' + tech.rangeLow + '–' + tech.rangeHigh);
  const base = { inst: H.key, label: R.label, tech: tech.key, techLabel: tech.label, port: tech.port || R.port, ch, cc0: tech.cc0 != null ? tech.cc0 : null, ks: null, cc7: 127 };
  t += INST_GAP;
  for (const pitch of H.pitches) for (const vel of H.vels) push(Object.assign({}, base, { role: 'card', pitch, vel, anchor: vel === 64, ...(H.check ? { check: H.check } : {}) }), HOLD, TAIL);
  if (H.bend) { const mid = H.pitches[1]; push(Object.assign({}, base, { role: 'bend', pitch: mid, vel: BEND_VEL, bend: 8192 + Math.round(0.5 * 8191), fraction: 0.5, bendResetMs: t + HOLD + 400 }), HOLD, TAIL); }
}
const L = INSTRUMENTS.bowed_vibraphone;
for (const M of MALLETS) {
  if (!want(M.inst)) continue;
  const q = L.techniques.find(x => x.key === M.tech); if (!q) throw new Error('no mallet patch ' + M.tech);
  const I = (L.malletInstruments || []).find(x => x.slug === M.inst) || {};
  for (const p of M.pitches) if (p < q.rangeLow || p > q.rangeHigh) throw new Error(M.tech + ': key ' + p + ' outside ' + q.rangeLow + '–' + q.rangeHigh);
  t += INST_GAP;
  for (const pitch of M.pitches) for (const vel of STRUCK_VELS) push({ role: 'perc', inst: M.inst, label: I.name || M.inst, tech: q.key, techLabel: q.label, port: q.port, ch: q.channel, cc0: null, ks: null, cc7: null, pitch, vel, anchor: vel === 127 }, STRUCK_HOLD, STRUCK_TAIL);
}
const P = INSTRUMENTS.percussion;
for (const X of PERC) {
  if (!want(X.slug)) continue;
  const A = (P.aroInstruments || []).find(a => a.slug === X.slug); if (!A) throw new Error('percussion: ' + X.slug + ' is not in the selection');
  const techs = P.techniques.filter(q => q.channel === A.channel && Array.isArray(q.keys) && (q.key === X.slug || q.key.startsWith(X.slug + '_')));
  let picks = [];
  if (X.keys) picks = X.keys.map(k => ({ midi: k, q: techs.find(q => q.keys.some(e => e.midi === k)) || techs[0] }));
  else {
    const isHit = e => /hit/i.test(e.label) && !/damp|chok|mute|rim|roll|flam|rake|swell|scrape|bow/i.test(e.label);
    for (const q of techs) { const e = q.keys.find(isHit); if (e && picks.length < 3) picks.push({ midi: e.midi, q }); }                       // one plain hit per beater
    for (const q of techs) for (const e of q.keys) if (picks.length < 3 && isHit(e) && !picks.some(x => x.midi === e.midi)) picks.push({ midi: e.midi, q });   // then more hits
    for (const q of techs) for (const e of q.keys) if (picks.length < 3 && !picks.some(x => x.midi === e.midi)) picks.push({ midi: e.midi, q });               // then anything
  }
  t += INST_GAP;
  for (const k of picks) for (const vel of STRUCK_VELS) {
    const e = k.q.keys.find(z => z.midi === k.midi);
    push({ role: 'perc', inst: X.slug, label: A.name, tech: k.q.key, techLabel: k.q.label + (e ? ' · ' + e.label : ''), port: A.port || P.port, ch: A.channel, cc0: null, ks: null, cc7: null, pitch: k.midi, vel, anchor: vel === 127, ...(X.check ? { check: X.check } : {}) }, STRUCK_HOLD, STRUCK_TAIL);
  }
}

const totalMs = t + 2000;
const out = {
  generatedAt: new Date().toISOString(), planItem: '5.3', piece: 'decibel',
  what: 'the instrument card for the Decibel rack: absolute loudness per instrument, pitch and velocity, measured two ways',
  standard: 'K-20 (Katz / SMPTE RP 200); loudness ITU-R BS.1770. REC at unity: every level is dBFS AT THE MASTER (bank/reference.json — piece #6\'s, carried; the cross-check rows prove it for this rack).',
  vels: VELS, percVels: STRUCK_VELS, held: HELD.map(h => h.key), mallets: MALLETS.map(m => m.inst), percussion: PERC.map(p => p.slug),
  timing: { leadInMs: LEAD_IN, preMs: PRE, holdMs: HOLD, tailMs: TAIL, struckHoldMs: STRUCK_HOLD, struckTailMs: STRUCK_TAIL, instGapMs: INST_GAP },
  leadInMs: LEAD_IN,
  comparison: { to: 'nothing — this rack has no earlier measurement', expectedOffsetDb: 0 },
  totalMs, notes,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
const byInst = {}; for (const n of notes) byInst[n.inst] = (byInst[n.inst] || 0) + 1;
console.log('THE INSTRUMENT CARD — ' + notes.length + ' notes · ' + Math.floor(totalMs / 60000) + ':' + String(Math.round((totalMs % 60000) / 1000)).padStart(2, '0'));
console.log('  ' + Object.entries(byInst).map(([k, v]) => k + ' ' + v).join(' · '));
console.log('wrote ' + path.relative(ROOT, OUT));
if (PRINT) for (const n of notes) console.log(((n.tOnMs / 1000).toFixed(1)).padStart(7) + ' s  ' + String(n.label).padEnd(26) + String(n.port).padEnd(13) + 'ch' + String(n.ch).padEnd(3) + 'key ' + String(n.pitch).padStart(3) + ' vel ' + String(n.vel).padStart(3) + '  ' + n.role + (n.cc0 != null ? ' cc0 ' + n.cc0 : '') + '  ' + (n.techLabel || ''));
