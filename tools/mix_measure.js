#!/usr/bin/env node
// mix_measure.js — THE DEMO'S MEASUREMENT (PLAN 2r step 5): reads the audio stems and writes what the balance is computed from.
//
//   node tools/mix_measure.js --score piece-FirstDraft-Final-D-ctptCello
//
// A STEM'S LEVEL (his measure, RUNNING_LOG §152): each note's loudest 400 ms, K-weighted (BS.1770, 10 ms hops), and the stem's middle value.
// THE ELECTRONICS: the four material lanes summed, their 400 ms loudness every 10 ms, kept per section as the level they are at or under 75 % of the
// time they sound (not their peak, because a swell's top is composed).
// Out: midi/<save>/mix_measure.json. Nothing is changed.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const score = arg('score');
if (!score) { console.error('usage: node tools/mix_measure.js --score <save>'); process.exit(1); }
const dir = path.join(ROOT, 'midi', score);
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'stems.json'), 'utf8'));
const audio = JSON.parse(fs.readFileSync(path.join(dir, 'stems_audio.json'), 'utf8'));
const elec = JSON.parse(fs.readFileSync(path.join(dir, 'elec_stems.json'), 'utf8'));
const PPQ = 960, SR = 48000, HOP = 480, WIN = 40;   // the stems' MIDI is 60 BPM at 960 per beat: a tick is 1/960 s
const SECTIONS = [{ name: 'the sine tones', from: 12, to: 146 }, { name: 'the piano solo', from: 148, to: 196 }, { name: 'the counterpoint', from: 200, to: 253 }, { name: 'the phase section', from: 277.8, to: 480 }];

function wavInfo(fd) {
  const size = fs.fstatSync(fd).size; let pos = 12, fmt = null, data = null;
  while (pos + 8 <= size && !data) {
    const h = Buffer.alloc(8); fs.readSync(fd, h, 0, 8, pos);
    const id = h.toString('latin1', 0, 4), n = h.readUInt32LE(4);
    if (id === 'fmt ') { const b = Buffer.alloc(16); fs.readSync(fd, b, 0, 16, pos + 8); fmt = { tag: b.readUInt16LE(0), ch: b.readUInt16LE(2), sr: b.readUInt32LE(4), bits: b.readUInt16LE(14) }; }
    if (id === 'data') data = { at: pos + 8, n: Math.min(n, size - pos - 8) };
    pos += 8 + n + (n & 1);
  }
  if (!fmt || !data || fmt.bits !== 32 || fmt.ch !== 2 || fmt.sr !== SR) throw new Error('expected 48 kHz stereo 32-bit: ' + JSON.stringify(fmt));
  return data;
}
// calls fn(L, R, count) with successive stretches of the file
function eachBlock(file, fn) {
  const fd = fs.openSync(file, 'r'), d = wavInfo(fd), ab = new ArrayBuffer(1 << 22), buf = Buffer.from(ab), f = new Float32Array(ab);
  let off = 0;
  while (off < d.n) {
    const want = Math.min(buf.length, d.n - off), got = fs.readSync(fd, buf, 0, want, d.at + off);
    if (got < 8) break;
    const use = got - (got % 8);
    fn(f, use / 8);
    off += use;
  }
  fs.closeSync(fd);
  return d.n / 8;
}
// BS.1770 at 48 kHz, two biquads per channel
function kFilter() {
  const s = new Float64Array(16);
  return (x, c) => {
    const o = c * 8;
    const y = 1.53512485958697 * x + s[o]; s[o] = -2.69169618940638 * x + 1.69065929318241 * y + s[o + 1]; s[o + 1] = 1.19839281085285 * x - 0.73248077421585 * y;
    const z = y + s[o + 2]; s[o + 2] = -2 * y + 1.99004745483398 * z + s[o + 3]; s[o + 3] = y - 0.99007225036621 * z;
    return z;
  };
}
// the file's K-weighted energy per 10 ms hop, as a running sum (so any 400 ms is one subtraction)
function energy(file) {
  const k = kFilter(); let acc = 0, n = 0, peak = 0; const hops = [];
  eachBlock(file, (f, frames) => {
    for (let i = 0; i < frames; i++) {
      const a = f[2 * i], b = f[2 * i + 1], m = Math.max(Math.abs(a), Math.abs(b)); if (m > peak) peak = m;
      const l = k(a, 0), r = k(b, 1); acc += l * l + r * r;
      if (++n === HOP) { hops.push(acc / HOP); acc = 0; n = 0; }
    }
  });
  const sum = new Float64Array(hops.length + 1);
  for (let i = 0; i < hops.length; i++) sum[i + 1] = sum[i] + hops[i];
  return { sum, hops: hops.length, peakDb: peak > 0 ? 20 * Math.log10(peak) : -200 };
}
const lufs = p => (p > 1e-20 ? -0.691 + 10 * Math.log10(p) : -200);
const median = a => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r2 = x => Math.round(x * 100) / 100;

function notesOf(evtFile) {
  const open = new Map(), out = [];
  for (const line of fs.readFileSync(evtFile, 'utf8').split(/\r?\n/)) {
    const f = line.trim().split(/\s+/).map(Number);
    if (f.length < 4 || f.some(x => !Number.isFinite(x))) continue;
    const [tick, st, p, v] = f, kind = st & 0xF0, key = (st & 15) + ':' + p;
    if (kind === 0x90 && v > 0) { if (!open.has(key)) open.set(key, []); open.get(key).push(tick / PPQ); }
    else if (kind === 0x80 || (kind === 0x90 && v === 0)) { const q = open.get(key); if (q && q.length) out.push({ on: q.shift(), off: tick / PPQ }); }
  }
  for (const q of open.values()) for (const on of q) out.push({ on, off: on + 0.4 });
  return out.sort((a, b) => a.on - b.on);
}

const t0 = Date.now(), stems = [];
for (const p of plan.stems) {
  const a = audio.stems[p.n], e = energy(a.file);
  const notes = notesOf(path.join(ROOT, p.file.replace(/\.mid$/, '.evt')));
  if (notes.length !== p.notes) throw new Error(p.name + ': ' + notes.length + ' notes read, ' + p.notes + ' in the plan');
  const levels = notes.map(x => {
    const first = Math.max(0, Math.round((x.on - a.at) * SR / HOP)), last = Math.max(first, Math.round((x.off - a.at) * SR / HOP) - WIN);
    let best = 0;
    for (let h = first; h <= last && h < e.hops; h++) { const end = Math.min(e.hops, h + WIN), v = (e.sum[end] - e.sum[h]) / WIN; if (v > best) best = v; }
    return lufs(best);
  }).filter(v => v > -120);
  if (!levels.length) throw new Error(p.name + ': no note measured');
  stems.push({ n: p.n, name: p.name, track: p.track, technique: p.technique, dyn: p.dyn, notes: p.notes, levelDb: r2(median(levels)), lowDb: r2(Math.min(...levels)), highDb: r2(Math.max(...levels)), peakDb: r2(e.peakDb),
    t0: p.t0, t1: p.t1, sections: SECTIONS.map(s => notes.filter(x => x.on >= s.from && x.on < s.to).length) });
  if (stems.length % 20 === 0) console.log(stems.length + ' of ' + plan.stems.length + ' stems · ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
}

// the electronics summed
const total = Math.ceil(Math.max(...elec.stems.map(s => s.at + s.len))) * SR, L = new Float32Array(total), R = new Float32Array(total);
for (const s of elec.stems.filter(x => x.kind === 'material')) {   // the sine tones are left out: they move with their players (mix_balance.js)
  let w = Math.round(s.at * SR);
  eachBlock(s.file, (f, frames) => { for (let i = 0; i < frames && w < total; i++, w++) { L[w] += f[2 * i]; R[w] += f[2 * i + 1]; } });
}
const k = kFilter(), hopE = []; let acc = 0;
for (let i = 0; i < total; i++) { const l = k(L[i], 0), r = k(R[i], 1); acc += l * l + r * r; if ((i + 1) % HOP === 0) { hopE.push(acc / HOP); acc = 0; } }
const sum = new Float64Array(hopE.length + 1); for (let i = 0; i < hopE.length; i++) sum[i + 1] = sum[i] + hopE[i];
const sections = SECTIONS.map(s => {
  const vals = [];
  for (let h = Math.round(s.from * 100); h + WIN <= Math.min(hopE.length, Math.round(s.to * 100)); h++) { const v = lufs((sum[h + WIN] - sum[h]) / WIN); if (v > -60) vals.push(v); }
  vals.sort((a, b) => a - b);
  return { name: s.name, from: s.from, to: s.to, elecUsualDb: vals.length ? r2(vals[Math.floor(vals.length * 0.75)]) : null, elecMiddleDb: vals.length ? r2(vals[vals.length >> 1]) : null, elecTopDb: vals.length ? r2(vals[vals.length - 1]) : null, soundingShare: r2(vals.length / Math.max(1, (s.to - s.from) * 100)) };
});
fs.writeFileSync(path.join(dir, 'mix_measure.json'), JSON.stringify({ score, measured: new Date().toISOString(), sections, stems }, null, 1));
console.log('done in ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
const dyns = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff', 'shape'];
for (const d of dyns) { const g = stems.filter(s => s.dyn === d).map(s => s.levelDb); if (g.length) console.log(d.padEnd(6) + String(g.length).padStart(3) + ' stems · middle ' + median(g).toFixed(1) + ' · from ' + Math.min(...g).toFixed(1) + ' to ' + Math.max(...g).toFixed(1)); }
for (const s of sections) console.log(s.name.padEnd(18) + ' elec usual ' + s.elecUsualDb + ' · middle ' + s.elecMiddleDb + ' · top ' + s.elecTopDb + ' · sounding ' + s.soundingShare);
for (let i = 0; i < SECTIONS.length; i++) { const c = {}; for (const s of stems) if (s.sections[i]) c[s.dyn] = (c[s.dyn] || 0) + s.sections[i]; console.log(SECTIONS[i].name.padEnd(18) + ' notes by dynamic ' + JSON.stringify(c)); }
