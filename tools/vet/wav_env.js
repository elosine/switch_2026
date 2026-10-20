// wav_env.js — the level of a WAV over time (peak dB per STEP ms window, both channels maxed), so a file's own pulse is seen.
//   node wav_env.js <file.wav> [stepMs=40] [fromS=0] [toS=8]
'use strict';
const fs = require('fs');
const f = process.argv[2], STEP = +(process.argv[3] || 40), FROM = +(process.argv[4] || 0), TO = +(process.argv[5] || 8);
const b = fs.readFileSync(f);
let p = 12, fmt = null, data = null;
while (p + 8 <= b.length) {
  const id = b.toString('ascii', p, p + 4), sz = b.readUInt32LE(p + 4);
  if (id === 'fmt ') fmt = { tag: b.readUInt16LE(p + 8), ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22) };
  if (id === 'data') { data = { off: p + 8, len: Math.min(sz, b.length - p - 8) }; break; }
  p += 8 + sz + (sz & 1);
}
if (!fmt || !data) { console.error('not a plain WAV: ' + f); process.exit(2); }
const { ch, sr, bits, tag } = fmt, bps = bits / 8, frames = Math.floor(data.len / (bps * ch));
const rd = (i, c) => { const o = data.off + (i * ch + c) * bps; if (tag === 3 || bits === 32 && tag !== 1) return b.readFloatLE(o); if (bits === 16) return b.readInt16LE(o) / 32768; if (bits === 24) return ((b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)) << 8 >> 8) / 8388608; return b.readInt32LE(o) / 2147483648; };
const dB = (v) => (v > 0 ? Math.round(20 * Math.log10(v) * 10) / 10 : -150);
const step = Math.round(sr * STEP / 1000), out = [];
let peakAll = 0;
for (let s = Math.floor(FROM * sr); s < Math.min(frames, TO * sr); s += step) {
  let pk = 0;
  for (let i = s; i < Math.min(s + step, frames); i++) for (let c = 0; c < ch; c++) { const v = Math.abs(rd(i, c)); if (v > pk) pk = v; }
  if (pk > peakAll) peakAll = pk;
  out.push([Math.round(s / sr * 100) / 100, dB(pk)]);
}
const vals = out.map((x) => x[1]), mx = Math.max(...vals), mn = Math.min(...vals);
console.log(f.replace(/^.*[\\/]/, '') + ' — ' + ch + ' ch · ' + sr + ' Hz · ' + bits + '-bit (tag ' + tag + ') · ' + Math.round(frames / sr * 100) / 100 + ' s · peak ' + dB(peakAll) + ' dB · in ' + FROM + ' … ' + TO + ' s: max ' + mx + ' · min ' + mn + ' · ' + out.filter((x) => x[1] < mx - 6).length + ' of ' + out.length + ' windows more than 6 dB under the max');
console.log(out.map(([t, v]) => t.toFixed(2) + ':' + v).join(' '));
