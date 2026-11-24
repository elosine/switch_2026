#!/usr/bin/env node
// mix_balance.js — THE DEMO'S FIRST BALANCE (PLAN 2r step 5), computed from tools/mix_measure.js. Writes numbers only; build_mix.js places them.
//
//   node tools/mix_balance.js --score piece-FirstDraft-Final-D-ctptCello
//
// (a) THE STEM FADERS: each written dynamic at one level. THE LADDER (RUNNING_LOG §459): the plan's "middle of the stems at that dynamic" is kept
//     for p, f and fff, the dynamics nearly every stem plays. The other five are read off the straight lines through those three, because ppp · pp ·
//     mp · mf are one stem each (the piano) and ff is seven, and their own middles fall out of order (ppp above p, ff above fff).
//     A stem within 1.5 dB of its target is left alone. A shaped long note has no written dynamic: the six are leveled among themselves.
// (b) THE LEVEL LINE on INSTRUMENTS, a step per section: the section's lowest dynamic stands 3 dB above the electronics' usual level there.
//     Written as the ELEC bus turned down by the largest step and the line at or below 0 dB, so no fader or envelope runs past its range.
// (c) THE SINE TONES move WITH their player: each keeps the level it had against that player's long note in the rack (ELEC RETURN's fader counted),
//     because the beating depends on the two being matched.
// (d) THE MASTER: the whole mix summed here, its sample peak brought to -1 dB.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const score = arg('score');
if (!score) { console.error('usage: node tools/mix_balance.js --score <save>'); process.exit(1); }
const dir = path.join(ROOT, 'midi', score);
const M = JSON.parse(fs.readFileSync(path.join(dir, 'mix_measure.json'), 'utf8'));
const audio = JSON.parse(fs.readFileSync(path.join(dir, 'stems_audio.json'), 'utf8'));
const elec = JSON.parse(fs.readFileSync(path.join(dir, 'elec_stems.json'), 'utf8'));
const MARGIN = 3, LEAVE = 1.5, MAXUP = 12, CEILING = -1, SR = 48000;
const ELEC_RETURN_DB = -5;   // the rack's ELEC RETURN fader, read from reaper/switch_rack.rpp 2026-11-23
const SINE_PLAYER = { 'Sine - Flute': 'Fluteb SI2', 'Sine - Clarinet': 'Clarinet SI2', 'Sine - Alto Sax': 'Alto Sax SI2 b', 'Sine - Mallets': 'Crotales RM', 'Sine - Violin': 'Violin XS', 'Sine - Cello': 'Cello XS' };
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const median = a => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r2 = x => Math.round(x * 100) / 100;
const amp = db => Math.pow(10, db / 20);

// (a) the ladder and the faders
const mid = d => median(M.stems.filter(s => s.dyn === d).map(s => s.levelDb));
const P = mid('p'), F = mid('f'), FFF = mid('fff'), low = (F - P) / 3, high = (FFF - F) / 2;
const target = { ppp: P - 2 * low, pp: P - low, p: P, mp: P + low, mf: P + 2 * low, f: F, ff: F + high, fff: FFF, shape: mid('shape') };
for (const k of Object.keys(target)) target[k] = r2(target[k]);
const capped = [];
const stems = M.stems.map(s => {
  const gap = target[s.dyn] - s.levelDb;
  let db = Math.abs(gap) <= LEAVE ? 0 : gap;
  if (db > MAXUP) { capped.push(s.name + ' asked +' + db.toFixed(1)); db = MAXUP; }
  return { n: s.n, name: s.name, track: s.track, dyn: s.dyn, levelDb: s.levelDb, faderDb: r2(db), afterDb: r2(s.levelDb + db) };
});

// (b) the steps
const sections = M.sections.map((s, i) => {
  const dyns = [...new Set(M.stems.filter(x => x.sections[i] > 0).map(x => x.dyn))];
  const written = dyns.filter(d => d !== 'shape'), pool = written.length ? written : dyns;
  const lowest = pool.slice().sort((a, b) => target[a] - target[b])[0];
  return { name: s.name, from: s.from, to: s.to, elecUsualDb: s.elecUsualDb, lowest, lowestDb: target[lowest], stepDb: r2(s.elecUsualDb + MARGIN - target[lowest]) };
});
const maxStep = Math.max(...sections.map(s => s.stepDb)), elecBusDb = r2(-maxStep);
sections.forEach(s => { s.lineDb = r2(s.stepDb - maxStep); });
const line = [[0, sections[0].lineDb]];
for (let i = 1; i < sections.length; i++) { line.push([r2(sections[i].from - 1), sections[i - 1].lineDb]); line.push([sections[i].from, sections[i].lineDb]); }
const lineAt = t => { if (t <= line[0][0]) return line[0][1]; for (let i = 1; i < line.length; i++) if (t <= line[i][0]) { const a = line[i - 1], b = line[i]; return a[1] + (b[1] - a[1]) * (t - a[0]) / Math.max(1e-6, b[0] - a[0]); } return line[line.length - 1][1]; };

// (c) the sine tones: their player's fader + the step of the first section, on top of ELEC RETURN's level (the ELEC bus's turn-down is shared)
const elecFaders = elec.stems.map(s => {
  if (s.kind !== 'sine') return { name: s.name, faderDb: 0 };
  const shape = stems.find(x => x.track === SINE_PLAYER[s.name] && x.dyn === 'shape');
  if (!shape) throw new Error('no long-note stem for ' + s.name);
  return { name: s.name, faderDb: r2(ELEC_RETURN_DB + shape.faderDb + sections[0].stepDb) };
});

// (d) the whole mix summed
const total = Math.ceil(Math.max(...elec.stems.map(s => s.at + s.len), ...Object.values(audio.stems).map(s => s.at + s.len))) * SR;
const L = new Float32Array(total), R = new Float32Array(total);
function mixIn(file, at, gainOf) {
  const fd = fs.openSync(file, 'r'), size = fs.fstatSync(fd).size; let pos = 12, d = null;
  while (pos + 8 <= size && !d) { const h = Buffer.alloc(8); fs.readSync(fd, h, 0, 8, pos); const id = h.toString('latin1', 0, 4), n = h.readUInt32LE(4); if (id === 'data') d = { at: pos + 8, n: Math.min(n, size - pos - 8) }; pos += 8 + n + (n & 1); }
  const ab = new ArrayBuffer(1 << 22), buf = Buffer.from(ab), f = new Float32Array(ab); let off = 0, w = Math.round(at * SR);
  while (off < d.n) {
    const got = fs.readSync(fd, buf, 0, Math.min(buf.length, d.n - off), d.at + off); if (got < 8) break;
    const use = got - (got % 8), frames = use / 8;
    for (let i = 0; i < frames && w < total; i += 480) {
      const g = gainOf(w / SR), e = Math.min(frames, i + 480);
      for (let j = i; j < e && w < total; j++, w++) { L[w] += f[2 * j] * g; R[w] += f[2 * j + 1] * g; }
    }
    off += use;
  }
  fs.closeSync(fd);
}
for (const s of stems) { const a = audio.stems[s.n], base = amp(s.faderDb); mixIn(a.file, a.at, t => base * amp(lineAt(t))); }
for (const s of elec.stems) { const g = amp((elecFaders.find(x => x.name === s.name).faderDb) + elecBusDb); mixIn(s.file, s.at, () => g); }
let peak = 0, at = 0;
for (let i = 0; i < total; i++) { const m = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (m > peak) { peak = m; at = i / SR; } }
const peakDb = 20 * Math.log10(peak), masterDb = r2(CEILING - peakDb);

const out = { score, computed: new Date().toISOString(), margin: MARGIN, target, elecBusDb, instrumentsLine: line, masterDb, mixPeakBeforeMasterDb: r2(peakDb), mixPeakAtS: r2(at), sections, stems, elecFaders, capped };
fs.writeFileSync(path.join(dir, 'mix_balance.json'), JSON.stringify(out, null, 1));

// the card
const moved = stems.filter(s => s.faderDb !== 0), most = moved.slice().sort((a, b) => Math.abs(b.faderDb) - Math.abs(a.faderDb)).slice(0, 12);
const c = ['# The demo mix, first balance (generated by `tools/mix_balance.js`)', '', 'Save: `' + score + '`', '', '## One level per written dynamic', '',
  MARKS.map(d => '- ' + d + ' = ' + target[d] + ' dB').join('\n'), '- long shaped notes = ' + target.shape + ' dB', '',
  moved.length + ' of ' + stems.length + ' stems moved; the rest were within ' + LEAVE + ' dB.', '', 'The largest moves:', '', most.map(s => '- ' + s.name + ': ' + (s.faderDb > 0 ? '+' : '') + s.faderDb + ' dB').join('\n'), '',
  '## The players against the electronics', '', sections.map(s => '- **' + s.name + '** (' + s.from + ' to ' + s.to + ' s): electronics usually at ' + s.elecUsualDb + ' dB, lowest dynamic ' + s.lowest + ', players raised ' + s.stepDb + ' dB against the electronics').join('\n'), '',
  '## The master', '', 'Mix peak before the master ' + r2(peakDb) + ' dB at ' + r2(at) + ' s. Master fader ' + masterDb + ' dB, for a peak of ' + CEILING + ' dB.', ''];
if (capped.length) c.push('## Held at +' + MAXUP + ' dB', '', capped.map(x => '- ' + x).join('\n'), '');
fs.writeFileSync(path.join(ROOT, 'docs', 'DEMO_MIX_CARD.md'), c.join('\n'));
console.log(c.join('\n'));
