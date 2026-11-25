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
// [§526 — his "let's make sure we give a rope to every instrument"] seven: each instrument its own rope; the percussion's two lanes (the
// battery and the mallets — the crotales in Section 1) one rope
const GROUPS = [['flute', [0]], ['clarinet', [1]], ['alto sax', [2]], ['percussion', [3, 4]], ['piano', [5]], ['violin', [6]], ['cello', [7]]];
const notes = save.objects.filter(o => o.type === 'waveCurve');
const vel = o => +(o.recVel || o.velAbs || (o.properties && o.properties.parity && o.properties.parity.written) || 80);
const beatsAt = (o, tt) => {
  const sn = o.properties && o.properties.sine; if (!sn) return null;
  if (!sn.breath) {                                           // [§522] no breath written: the note's own text, "0 → 6.4 beats/s", ramped across the note
    const m = /([\d.]+)\s*beats\/s/.exec(o.performanceNotes || ''); if (!m) return null;
    return +m[1] * Math.max(0, Math.min(1, (tt - o.startSeconds) / Math.max(0.01, o.endSeconds - o.startSeconds)));
  }
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
    let sounding = 0, v = 0, beat = null, dyn = 0;
    for (let k = k0; k < mine.length && mine[k].startSeconds <= tt; k++) {
      const o = mine[k]; if (tt > o.endSeconds + 1) continue;
      const lvl = tt <= o.endSeconds ? 1 : 1 - (tt - o.endSeconds);       // a second's release after the note
      sounding = Math.max(sounding, lvl); v = Math.max(v, vel(o) * lvl);
      // [§524 — his "especially for the crescendos … the ropes hardly move at all"] the note's own written dynamic curve (its nodes, 0 … 10:
      // p is 2.9, fff 10), read where the note is — a crescendo grows as the note goes
      const u = Math.max(0, Math.min(1, (tt - o.startSeconds) / Math.max(0.01, o.endSeconds - o.startSeconds))), nd = o.nodes || [];
      let y = nd.length ? nd[0].y : 7; for (let q = 0; q + 1 < nd.length; q++) if (u >= nd[q].pos && u <= nd[q + 1].pos) y = nd[q].y + (nd[q + 1].y - nd[q].y) * (u - nd[q].pos) / Math.max(1e-6, nd[q + 1].pos - nd[q].pos);
      if (nd.length && u >= nd[nd.length - 1].pos) y = nd[nd.length - 1].y;
      dyn = Math.max(dyn, y / 10 * lvl);
      const b = tt <= o.endSeconds ? beatsAt(o, tt) : null; if (b != null) beat = Math.max(beat || 0, b);
    }
    // [§522 — his "the instrumental ones barely move"] full speed at 7 beats a second (was 10), and the busyness lifted by a square root
    // [§524] the beating: a floor of a quarter the moment a pair sounds, full at 6 beats a second; and a crescendo drives the speed too
    // [§526 — his "less vigorous … more corresponding to the increasing beating … so you can see the change"] the beating drives the speed
    // ALONE and IN PROPORTION: 0 … 8 beats a second is 0.05 … 1 of full speed, a straight line; the crescendo now drives only the size
    const busy = beat != null ? Math.min(1, 0.05 + beat / 8) : Math.max(Math.sqrt(Math.min(1, rate[i] / top)), dyn * 0.6);
    on.push(r3(sounding)); speed.push(r3(sounding ? 2 + 18 * busy : 0));
    depth.push(r3(sounding ? 0.65 + 0.35 * Math.min(1, dyn || v / 127) : 0)); hard.push(r3(sounding ? 1.5 + 3 * Math.min(1, v / 127) : 0)); az.push(0);
  }
  const accents = [];
  for (const o of mine) if (vel(o) >= 96 && !accents.some(x => Math.abs(x - o.startSeconds) < 0.12)) accents.push(r3(o.startSeconds));
  out.groups.push({ part: name, on, speed, depth, hardness: hard, azimuth: az, accents });
  console.log(name.padEnd(16) + 'sounds ' + (on.filter(x => x > 0.3).length / RATE).toFixed(0) + ' s · ' + accents.length + ' accents (f and up) · busiest ' + top.toFixed(1) + ' onsets a second');
}
// ---------------------------------------------------------------- THE PIANO SOLO'S EVENTS (§529; his SW-169 and "the pulse is based on all the
// things from the piano. So every like strike is sending a kind of slightly different pulse … the ribbons … a wider, broader motion for the
// curve parts. And then the pulse comes on the impact … the repeated ones are … shakes … the falling pebbles … a bigger, slower upswing and then a whip")
// From bank/piano_solo_done.json (the figures as he settled them) and the save's piano notes: each event a kind, its times, its strength 0 … 1.
{
  const solo = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'piano_solo_done.json'), 'utf8')), G = solo.gestures;
  const pn = notes.filter(o => o.layer === 5 && o.startSeconds >= 147 && o.startSeconds <= 197).sort((a, b) => a.startSeconds - b.startSeconds);
  const v01 = o => Math.min(1, vel(o) / 127), within = (o, a, b) => o.startSeconds >= a - 0.05 && o.startSeconds <= b + 0.05;
  const strength = (a, b) => { const m = pn.filter(o => within(o, a, b)); return m.length ? Math.max(...m.map(v01)) : 0.7; };
  const ev = [];
  for (const g of G) {
    if (g.kind === 'ribbon') ev.push({ k: 'ribbon', t0: r3(g.t0), t1: r3(g.t1), hit: g.bounce != null ? r3(g.bounce) : null, s: r3(strength(g.t0, g.t1)) });
    if (g.kind === 'stutter') ev.push({ k: 'shake', t0: r3(g.t0), t1: r3(g.t1), hand: g.hand, s: r3(strength(g.t0, g.t1)) });
    if (g.kind === 'strike') {                                   // the pebbles land where the run is loudest: its notes' times weighted by velocity squared
      const m = pn.filter(o => within(o, g.t0, g.t1)); let sw = 0, st = 0; for (const o of m) { const w = v01(o) ** 2; sw += w; st += w * o.startSeconds; }
      ev.push({ k: 'pebbles', t0: r3(g.t0), t1: r3(g.t1), hit: r3(g.impact || (sw ? st / sw : (g.t0 + g.t1) / 2)), s: r3(strength(g.t0, g.t1)) });
    }
  }
  // the standard figures: every onset outside a gesture, a chord (onsets within 40 ms) one pulse, its strength the loudest note
  const inGesture = o => G.some(g => ['ribbon', 'stutter', 'strike'].includes(g.kind) && within(o, g.t0, g.t1));
  let last = null;
  for (const o of pn) {
    if (inGesture(o)) continue;
    if (last && o.startSeconds - last.t < 0.04) { last.s = Math.max(last.s, r3(v01(o))); continue; }
    last = { k: 'note', t: r3(o.startSeconds), s: r3(v01(o)) }; ev.push(last);
  }
  ev.sort((a, b) => (a.t0 ?? a.t) - (b.t0 ?? b.t));
  out.solo = { t0: 148.2, t1: 196.3, events: ev };
  const n = {}; ev.forEach(e => n[e.k] = (n[e.k] || 0) + 1);
  console.log('the solo          ' + Object.entries(n).map(([k, c]) => c + ' ' + k).join(' · '));
}
fs.writeFileSync(path.join(ROOT, 'bank', 'video_data.json'), JSON.stringify(out));
console.log('→ bank/video_data.json (' + (fs.statSync(path.join(ROOT, 'bank', 'video_data.json')).size / 1024).toFixed(0) + ' KB)');
