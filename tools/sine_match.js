#!/usr/bin/env node
// sine_match.js — THE SINE TONES SET FOR THE BEATING (PLAN 2r, RUNNING_LOG §461). Beating is deepest when the two tones that beat are equally
// loud, and what beats against the sine is the player's PARTIAL at that pitch, not the player's whole sound. So: a narrow band round each sine's
// pitch, read on the player's long-note stem and on the sine's stem, every 100 ms while the player sounds; the sine's gain = the middle of the
// differences. Reads the live gains from a JSON file; writes the answer; touches nothing.
//
//   node tools/sine_match.js --score <save> --gains <live.json>      { "Sine - Flute": { playerDb, sineDb }, … } (each path's whole gain)
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const score = arg('score'), gains = JSON.parse(fs.readFileSync(arg('gains'), 'utf8'));
const dir = path.join(ROOT, 'midi', score), SR = 48000, HOP = 4800, Q = 10, SKIP = 0.3;
const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', score + '.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'stems.json'), 'utf8'));
const audio = JSON.parse(fs.readFileSync(path.join(dir, 'stems_audio.json'), 'utf8'));
const elec = JSON.parse(fs.readFileSync(path.join(dir, 'elec_stems.json'), 'utf8'));
const PAIRS = [['Sine - Flute', 'Fluteb SI2', 0], ['Sine - Clarinet', 'Clarinet SI2', 1], ['Sine - Alto Sax', 'Alto Sax SI2 b', 2], ['Sine - Mallets', 'Crotales RM', 4], ['Sine - Violin', 'Violin XS', 6], ['Sine - Cello', 'Cello XS', 7]];
const median = a => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r2 = x => Math.round(x * 100) / 100;

function readWav(file) {
  const b = fs.readFileSync(file); let p = 12, d = null;
  while (p + 8 <= b.length && !d) { const id = b.toString('latin1', p, p + 4), n = b.readUInt32LE(p + 4); if (id === 'data') d = [p + 8, Math.min(n, b.length - p - 8)]; p += 8 + n + (n & 1); }
  const f = new Float32Array(d[1] >> 2); for (let i = 0; i < f.length; i++) f[i] = b.readFloatLE(d[0] + i * 4);
  return f;
}
// the band's power per 100 ms hop from frame i0 to i1 (the filter settles over 100 ms before i0)
function bandHops(f, i0, i1, hz) {
  const w = 2 * Math.PI * hz / SR, al = Math.sin(w) / (2 * Q), a0 = 1 + al, b0 = al / a0, b2 = -al / a0, a1 = -2 * Math.cos(w) / a0, a2 = (1 - al) / a0;
  const st = [0, 0, 0, 0], out = []; let acc = 0, n = 0;
  for (let i = Math.max(0, i0 - HOP); i < i1; i++) {
    const inside = i >= i0;
    for (let c = 0; c < 2; c++) {
      const x = i * 2 + c < f.length ? f[i * 2 + c] : 0, o = c * 2, y = b0 * x + st[o];
      st[o] = -a1 * y + st[o + 1]; st[o + 1] = b2 * x - a2 * y;
      if (inside) acc += y * y;
    }
    if (inside && ++n === HOP) { out.push(acc / (2 * HOP)); acc = 0; n = 0; }
  }
  return out;
}
function notes(evt) {
  const open = new Map(), out = [];
  for (const l of fs.readFileSync(evt, 'utf8').split(/\r?\n/)) {
    const v = l.trim().split(/\s+/).map(Number); if (v.length < 4) continue;
    const k = (v[1] & 0xF0), key = (v[1] & 15) + ':' + v[2];
    if (k === 0x90 && v[3] > 0) open.set(key, v[0] / 960); else if ((k === 0x80 || k === 0x90) && open.has(key)) { out.push([open.get(key), v[0] / 960]); open.delete(key); }
  }
  return out;
}
const dB = p => 10 * Math.log10(Math.max(p, 1e-14));
const within = (a, lim) => a.filter(x => Math.abs(x) <= lim).length / Math.max(1, a.length);
const res = [];
for (const [name, track, lane] of PAIRS) {
  const st = plan.stems.find(s => s.track === track && s.dyn === 'shape'), pa = audio.stems[st.n], sa = elec.stems.find(s => s.name === name), g = gains[name];
  const P = readWav(pa.file), S = readWav(sa.file), N = notes(path.join(ROOT, st.file.replace(/\.mid$/, '.evt'))), diffs = [];
  for (const z of save.objects.filter(o => o.type === 'zone' && o.midiModel === 'elecSine' && o.layer === lane)) {
    const hz = 440 * Math.pow(2, (+z.elec.midi - 69) / 12);
    for (const [on, off] of N) {
      const a = Math.max(on + SKIP, z.startTime + SKIP), b = Math.min(off - 0.1, z.endTime - 0.1);
      if (b - a < 0.2) continue;
      const pH = bandHops(P, Math.round((a - pa.at) * SR), Math.round((b - pa.at) * SR), hz), sH = bandHops(S, Math.round((a - sa.at) * SR), Math.round((b - sa.at) * SR), hz);
      for (let i = 0; i < Math.min(pH.length, sH.length); i++) {
        const pd = dB(pH[i]) + g.playerDb, sd = dB(sH[i]) + g.sineDb;
        if (pd > -90 && sd > -90) diffs.push(pd - sd);
      }
    }
  }
  if (diffs.length < 20) throw new Error(name + ': only ' + diffs.length + ' readings');
  const move = median(diffs), after = diffs.map(d => d - move), sorted = after.slice().sort((x, y) => x - y);
  res.push({ name, track, readings: diffs.length, sineOverPartialDb: r2(-move), moveDb: r2(move), newSineDb: r2(g.sineDb + move), within3Before: r2(within(diffs, 3)), within3After: r2(within(after, 3)), within6After: r2(within(after, 6)), spreadLowDb: r2(sorted[Math.floor(sorted.length * 0.1)]), spreadHighDb: r2(sorted[Math.floor(sorted.length * 0.9)]) });
  const x = res[res.length - 1];
  console.log(name.padEnd(17) + ' sine vs partial ' + String(x.sineOverPartialDb).padStart(7) + ' dB · move ' + String(x.moveDb).padStart(7) + ' · within 3 dB: ' + Math.round(x.within3Before * 100) + '% → ' + Math.round(x.within3After * 100) + '% · 10…90% of the time ' + x.spreadLowDb + ' … ' + x.spreadHighDb + ' · ' + x.readings + ' readings');
}
fs.writeFileSync(path.join(dir, 'sine_match.json'), JSON.stringify({ score, computed: new Date().toISOString(), band: 'Q ' + Q, sines: res }, null, 1));
