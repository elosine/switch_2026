#!/usr/bin/env node
// elec_pan.js — WHERE EACH ELECTRONICS LANE SOUNDS, left to right, as it is heard (the Switch~ piece RUNNING_LOG §542; his "a little bit more
// correspondence between what I'm hearing the spatialization of the electronics to what I see … a single bead that follows the panning data
// that goes from left node to right node and back and forth").
//
//   node tools/elec_pan.js [--score piece-FirstDraft-Final-D-ctptCello] [--rate 30]   → bank/elec_pan.json
//
// Read from the lane's own stem (tools/elec_stems.js: the dry render of each electronics lane, stereo, 32-bit float), not from the grains'
// recipe: the BALANCE of its two channels in short windows — (right energy − left energy) ÷ (right + left), −1 all left … +1 all right — so it is
// what the ear gets, whatever made it. A window too quiet to place (60 dB under the lane's loudest) is null. Score time = the stem's "at" + its time.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const SCORE = arg('score', 'piece-FirstDraft-Final-D-ctptCello'), RATE = +arg('rate', 30);
const stems = JSON.parse(fs.readFileSync(path.join(ROOT, 'midi', SCORE, 'elec_stems.json'), 'utf8')).stems.filter(s => s.kind === 'material');
const out = { _about: 'tools/elec_pan.js — each electronics lane\'s left-right balance as heard, from its stem; generated', rate: RATE, lanes: {} };
for (const s of stems) {
  const lane = +/Elec (\d)/.exec(s.name)[1];
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', s.file, '-f', 'f32le', '-acodec', 'pcm_f32le', '-ac', '2', '-ar', '48000', '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) { console.error(s.name + ': ' + r.stderr); continue; }
  const x = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.length / 4), win = Math.round(48000 / RATE), nWin = Math.floor(x.length / 2 / win);
  const eL = new Float64Array(nWin), eR = new Float64Array(nWin); let top = 0;
  for (let w = 0; w < nWin; w++) { let a = 0, b = 0; for (let i = w * win; i < (w + 1) * win; i++) { a += x[2 * i] ** 2; b += x[2 * i + 1] ** 2; } eL[w] = a; eR[w] = b; top = Math.max(top, a + b); }
  const floor = top * 1e-6, bal = [];
  for (let w = 0; w < nWin; w++) bal.push(eL[w] + eR[w] < floor ? null : Math.round(((eR[w] - eL[w]) / (eR[w] + eL[w])) * 1000) / 1000);
  // [§577 — his "a rope only follows the one stem"] and each window's LOUDNESS, in dB under the lane's loudest window
  const db = []; for (let w = 0; w < nWin; w++) db.push(Math.round(10 * Math.log10((eL[w] + eR[w]) / top + 1e-12)));
  out.lanes[lane] = { t0: s.at, n: nWin, b: bal, db };
  const v = bal.filter(b => b != null), mean = v.reduce((a, b) => a + b, 0) / v.length, sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length);
  console.log(s.name.padEnd(8) + ' from ' + s.at + ' s · ' + nWin + ' windows · balance mean ' + mean.toFixed(2) + ' spread ' + sd.toFixed(2) + ' · range ' + Math.min(...v).toFixed(2) + ' … ' + Math.max(...v).toFixed(2));
}
fs.writeFileSync(path.join(ROOT, 'bank', 'elec_pan.json'), JSON.stringify(out));
console.log('→ bank/elec_pan.json');
