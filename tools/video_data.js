#!/usr/bin/env node
// video_data.js — THE VIDEO'S DATA on the score's clock (the Switch~ piece SW-168, RUNNING_LOG §519; his "yes, hook up the tremolo data").
//
//   node tools/video_data.js [--score piece-FirstDraft-Final-D-ctptCello]   → bank/video_data.json
//
// THE TREMOLO (§518): the opening's electronics are the four players of Sound Lab 2025-04-08c, each a TREMOLO on the stretched bed —
// its speed from the player's density in the session, its depth from the player's loudness, its accents, its hardness, its place in the
// field (H:/switch_2026/audio/set-2025-04-08c/keep/opening/ · bank/set/2025-04-08c/tremolo/trem-Dbr-r3-t078.8-…-<part>-….json).
// Where each one SOUNDS is read from the save: a player's own stem brick (Elec 2 · 3 · 4 · 1, 17 … 89 s) and the orchestrated mix
// (Elec 1, 85 … 144 s), where a voice is on only while its player was within 6 dB of their own median loudness in the session — the
// mix's own rule (live-electronics-engine/corpus/orchestrate_mix.py), redone here from the session's analysis.
// Out: every value at RATE a second of score time, 0 … the piece's end: per player  on (0 … 1, the brick's fades and the mix's gate) ·
// speed (Hz) · depth (0.65 … 1) · hardness · azimuth (degrees) · and the accents (score seconds, where the player sounds).
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const SCORE = arg('score', 'piece-FirstDraft-Final-D-ctptCello');
const OPEN = 'H:/switch_2026/audio/set-2025-04-08c/keep/opening';
const TREM = path.join(ROOT, 'bank/set/2025-04-08c/tremolo');
const RATE = 10, END = 487;
const PLAYERS = ['archtop', 'baritone-guitar', 'drums', 'piano'];

const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', SCORE + '.json'), 'utf8'));
const bricks = save.objects.filter(o => o.type === 'zone' && o.midiModel === 'elecMaterial');
const analysis = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank/set/2025-04-08c/analysis.json'), 'utf8'));
const mixJ = JSON.parse(fs.readFileSync(path.join(OPEN, 'opening-mix-orchestrated-9m45.json'), 'utf8'));

// a brick's level at score time t (0 … 1): its fades; the material's own time m = t - start + offset
const brickAt = (b, t) => {
  if (t < b.startTime || t > b.endTime) return 0;
  const fi = (+b.elec.fadeInMs || 30) / 1000, fo = (+b.elec.fadeOutMs || 30) / 1000;
  return Math.min(1, (t - b.startTime) / fi, (b.endTime - t) / fo);
};
const matT = (b, t) => t - b.startTime + (+b.elec.offsetMs || 0) / 1000;

// the mix's gate per player, per second of material time (orchestrate_mix.py: loudness 1/s, smoothed over 3 s, on within floor_db of the
// player's own median; the gate then faded over fade_s)
const gateOf = part => {
  const p = Object.values(analysis.parts).find(x => x.part === part), T = p.loudness_curve_db.length;
  const loud = p.loudness_curve_db.map(v => Math.max(-80, Math.min(0, v)));
  const act = loud.filter(v => v > -70).sort((a, b) => a - b), med = act[Math.floor(act.length / 2)];
  const secs = mixJ.seconds + 2, raw = [];
  for (let s = 0; s < secs; s++) raw.push(loud[(s + mixJ.from_s) % T]);
  const sm = raw.map((_, i) => { let a = 0, n = 0; for (let k = i - 1; k <= i + 1; k++) if (k >= 0 && k < raw.length) { a += raw[k]; n++; } return a / n; });
  const on = sm.map(v => v >= med + mixJ.floor_db ? 1 : 0), k = Math.max(1, Math.round(mixJ.fade_s));
  return m => { const i = Math.floor(m); let a = 0, n = 0; for (let j = i - Math.floor(k / 2); j <= i + Math.ceil(k / 2); j++) if (j >= 0 && j < on.length) { a += on[j]; n++; } return n ? a / n : 0; };
};

const curve = (arr, rate, m) => { const x = m * rate, i = Math.floor(x); if (i < 0) return arr[0]; if (i >= arr.length - 1) return arr[arr.length - 1]; return arr[i] + (arr[i + 1] - arr[i]) * (x - i); };
const N = END * RATE + 1, r3 = x => Math.round(x * 1000) / 1000;
const out = { _about: 'tools/video_data.js — the video\'s data on the score\'s clock (RUNNING_LOG §519). Generated; never edited by hand.', score: SCORE, rate: RATE, end: END, players: [] };

for (const part of PLAYERS) {
  const trem = JSON.parse(fs.readFileSync(path.join(TREM, 'trem-Dbr-r3-t078.8-x625-trimmed-' + part + '-from150s-s2-20-d65-100.json'), 'utf8'));
  const mv = mixJ.voices.find(v => v.part === part), gate = gateOf(part);
  const stem = bricks.find(b => b.elec.name === 'stem-' + part + '-continuous'), mix = bricks.find(b => b.elec.name === 'opening-mix-orchestrated-9m45');
  const on = [], speed = [], depth = [], hard = [], az = [];
  for (let i = 0; i < N; i++) {
    const t = i / RATE, ls = stem ? brickAt(stem, t) : 0, lm = mix ? brickAt(mix, t) * gate(matT(mix, t)) : 0;
    const b = ls >= lm ? stem : mix, m = b ? matT(b, t) : 0, lv = Math.max(ls, lm);
    on.push(r3(lv));
    speed.push(r3(lv > 0 ? curve(trem.speed_hz, trem.curve_rate, m) : 0));
    depth.push(r3(lv > 0 ? curve(trem.depth, trem.curve_rate, m) : 0));
    hard.push(r3(lv > 0 ? curve(trem.hardness, trem.curve_rate, m) : 0));
    az.push(r3(mv.azimuth_deg + (mv.move ? mv.move.swing_deg * Math.sin(2 * Math.PI * m / mv.move.period_s + mv.move.phase_deg * Math.PI / 180) : 0)));
  }
  // the accents, in score time, where this player sounds (from the stem, then from the mix)
  const accents = [];
  for (const b of [stem, mix]) if (b) for (const a of trem.accents_s) {
    const t = a - (+b.elec.offsetMs || 0) / 1000 + b.startTime;
    if (t >= b.startTime && t <= b.endTime && on[Math.round(t * RATE)] > 0.3 && !accents.some(x => Math.abs(x - t) < 0.02)) accents.push(r3(t));
  }
  accents.sort((a, b) => a - b);
  out.players.push({ part, on, speed, depth, hardness: hard, azimuth: az, accents });
  console.log(part.padEnd(16) + 'sounds ' + (on.filter(v => v > 0.3).length / RATE).toFixed(0) + ' s · ' + accents.length + ' accents · speed ' + Math.min(...speed.filter(v => v)).toFixed(1) + ' … ' + Math.max(...speed).toFixed(1) + ' Hz');
}
// ---------------------------------------------------------------- THE INSTRUMENTS (§521; his "let's do the other five following the instruments")
// Read from the SCORE, not the audio: the save's notes are exact and the same every time. Five ropes, the ensemble in five groups:
// the winds (flute · clarinet · alto sax) · the percussion (the battery and the mallets) · the piano · the violin · the cello.
// Their "speed", like a tremolo's: in Section 1 the BEATING against the sine (the beats a second of the note's own breath, its cents
// from the sine tone, the sine's pitch from its brick); elsewhere how BUSY the group is (onsets a second over 1.5 s, against the group's own
// busiest). Their "depth" the written velocity; their accents the notes written f and up (velocity 96+), their hardness the velocity.
// Kept in the players' shape (speed 2 … 20, depth 0.65 … 1, hardness 1.5 … 4.5) so the page drives them as it drives the tremolo.
const GROUPS = [['winds', [0, 1, 2]], ['percussion', [3, 4]], ['piano', [5]], ['violin', [6]], ['cello', [7]]];
const notes = save.objects.filter(o => o.type === 'waveCurve');
const vel = o => +(o.recVel || o.velAbs || (o.properties && o.properties.parity && o.properties.parity.written) || 80);
const beatsAt = (o, tt) => {
  const sn = o.properties && o.properties.sine; if (!sn || !sn.breath) return null;
  const br = save.objects.find(z => z.id === sn.brick); if (!br || !br.elec) return null;
  const u = Math.max(0, Math.min(1, (tt - o.startSeconds) / Math.max(0.01, o.endSeconds - o.startSeconds)));
  const c = sn.breath.fromCents + (sn.breath.toCents - sn.breath.fromCents) * u, fs0 = 440 * Math.pow(2, (+br.elec.midi - 69) / 12);
  return fs0 * Math.abs(Math.pow(2, c / 1200) - 1);
};
out.groups = [];
for (const [name, layers] of GROUPS) {
  const mine = notes.filter(o => layers.includes(o.layer)).sort((a, b) => a.startSeconds - b.startSeconds);
  const rate = new Float32Array(N);
  for (const o of mine) { const i0 = Math.round((o.startSeconds - 0.75) * RATE), i1 = Math.round((o.startSeconds + 0.75) * RATE); for (let i = Math.max(0, i0); i <= Math.min(N - 1, i1); i++) rate[i] += 1 / 1.5; }
  const sorted = Array.from(rate).filter(v => v > 0).sort((a, b) => a - b), top = sorted[Math.floor(sorted.length * 0.95)] || 1;
  const on = [], speed = [], depth = [], hard = [], az = [];
  let k0 = 0;
  for (let i = 0; i < N; i++) {
    const tt = i / RATE;
    while (k0 < mine.length && mine[k0].endSeconds + 1 < tt) k0++;
    let sounding = 0, v = 0, beat = null;
    for (let k = k0; k < mine.length && mine[k].startSeconds <= tt; k++) {
      const o = mine[k]; if (tt > o.endSeconds + 1) continue;
      const lvl = tt <= o.endSeconds ? 1 : 1 - (tt - o.endSeconds);       // a second's release after the note
      sounding = Math.max(sounding, lvl); v = Math.max(v, vel(o) * lvl);
      const b = tt <= o.endSeconds ? beatsAt(o, tt) : null; if (b != null) beat = Math.max(beat || 0, b);
    }
    const busy = beat != null ? Math.min(1, beat / 10) : Math.min(1, rate[i] / top);
    on.push(r3(sounding)); speed.push(r3(sounding ? 2 + 18 * busy : 0));
    depth.push(r3(sounding ? 0.65 + 0.35 * Math.min(1, v / 127) : 0)); hard.push(r3(sounding ? 1.5 + 3 * Math.min(1, v / 127) : 0)); az.push(0);
  }
  const accents = [];
  for (const o of mine) if (vel(o) >= 96 && !accents.some(x => Math.abs(x - o.startSeconds) < 0.12)) accents.push(r3(o.startSeconds));
  out.groups.push({ part: name, on, speed, depth, hardness: hard, azimuth: az, accents });
  console.log(name.padEnd(16) + 'sounds ' + (on.filter(x => x > 0.3).length / RATE).toFixed(0) + ' s · ' + accents.length + ' accents (f and up) · busiest ' + top.toFixed(1) + ' onsets a second');
}
fs.writeFileSync(path.join(ROOT, 'bank', 'video_data.json'), JSON.stringify(out));
console.log('→ bank/video_data.json (' + (fs.statSync(path.join(ROOT, 'bank', 'video_data.json')).size / 1024).toFixed(0) + ' KB)');
