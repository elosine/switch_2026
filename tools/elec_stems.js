#!/usr/bin/env node
// elec_stems.js — THE ELECTRONICS AS STEMS (PLAN 2r step 4): the four electronics lanes (the material bricks) and the sine tones of each
// player's lane, each one audio file, rendered OFFLINE by SuperCollider through the engine's own code (tools/elec_stems.scd).
//
//   node tools/elec_stems.js --score piece-FirstDraft-Final-D-ctptCello
//
// Out: H:/switch_2026/audio/demo/<save>/elec/*.wav · midi/<save>/elec_stems.json (each file, where it starts, its length, its peak).
// THE STEMS ARE DRY: before the engine's master bus (its high-pass, glue and limiter), which belongs to the whole mix, not to one lane.
// The messages are built as le_material.js and le_sine.js build them for a start at the brick's own beginning.
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SCLANG = 'C:/Program Files/SuperCollider-3.14.1/sclang.exe';
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const score = arg('score');
if (!score) { console.error('usage: node tools/elec_stems.js --score <save>'); process.exit(1); }

const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', score + '.json'), 'utf8'));
const audio = JSON.parse(fs.readFileSync(path.join(ROOT, 'midi', score, 'stems_audio.json'), 'utf8'));
const route = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const OUT = path.join(path.dirname(audio.dir), 'elec');
const LANES = save.tracks.map(t => String(t && (t.name || t.id) || t));
const LABEL = { flute: 'Flute', clarinet: 'Clarinet', alto_sax: 'Alto Sax', percussion: 'Percussion', vibraphone: 'Mallets', piano: 'Piano', violin: 'Violin', cello: 'Cello' };

const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000;
const markNum = x => { const i = MARKS.indexOf(String(x == null ? '' : x).trim()); if (i >= 0) return i; return Number.isFinite(+x) && String(x).trim() !== '' ? Math.max(-10, Math.min(7, +x)) : 4; };
const wire = (pts, lenMs, fmt, most) => {
  const p = pts.slice(0, most);
  if (p.length === 1 || p.every(x => x[1] === p[0][1])) return fmt(p[0][1]);
  return p.map((x, i) => (i === p.length - 1 && x[0] >= 1 - 1e-6 ? 'end' : Math.round(x[0] * lenMs)) + ':' + fmt(x[1])).join(',');
};
const levelPts = (z, kinds) => {
  const lv = z.elec.level || {}, m = markNum(lv.mark == null ? 'mf' : lv.mark);
  if (!kinds.includes(lv.mode || 'flat')) throw new Error('a level this tool does not know (' + lv.mode + ') on ' + z.id);
  return lv.mode === 'hairpin' ? [[0, m], [1, markNum(lv.to == null ? m : lv.to)]] : [[0, m]];
};
const material = z => {
  const e = z.elec, lengthMs = Math.max(50, Math.round((z.endTime - z.startTime) * 1000));
  return { t: r3(z.startTime), name: String(e.name).replace(/[^A-Za-z0-9_~-]/g, '').slice(0, 64), offsetMs: r1(+e.offsetMs || 0), lengthMs,
    fadeInMs: Math.max(2, Math.round(+e.fadeInMs || 30)), fadeOutMs: Math.max(2, Math.round(+e.fadeOutMs || 30)), gainDb: r1(+e.gainDb || 0),
    level: wire(levelPts(z, ['flat', 'hairpin']), lengthMs, v => String(r2(v)), 16) };
};
const sine = z => {
  const e = z.elec, lengthMs = Math.max(50, Math.round((z.endTime - z.startTime) * 1000)), g = e.gliss || {};
  if (e.track && e.track.on) throw new Error('a sine that follows a player: ' + z.id);
  if (!['none', 'line', undefined].includes(g.kind)) throw new Error('a gliss this tool does not know (' + g.kind + ') on ' + z.id);
  const m = { t: r3(z.startTime), midi: Math.round(+e.midi * 10000) / 10000, lengthMs, level: wire(levelPts(z, ['flat', 'hairpin']), lengthMs, v => String(r2(v)), 8) };
  if (g.kind === 'line') {
    const p = (g.points || []).map(x => [Math.max(0, Math.min(1, +x[0])), Math.max(-2400, Math.min(2400, +x[1]))]).sort((a, b) => a[0] - b[0]);
    if (p.length >= 2 && p.some(x => x[1] !== 0)) m.gliss = wire(p, lengthMs, v => String(r1(v)), 8);
  }
  if (+e.fadeInMs > 0) m.fadeInMs = Math.max(2, Math.min(30000, Math.round(+e.fadeInMs)));
  if (+e.fadeOutMs > 0) m.fadeOutMs = Math.max(2, Math.min(60000, Math.round(+e.fadeOutMs)));
  return m;
};

const zones = save.objects.filter(o => o.type === 'zone');
const stems = [];
const add = (kind, name, file, list, make) => {
  if (!list.length) return;
  const at = Math.max(0, Math.floor(Math.min(...list.map(z => z.startTime))) - 1);
  const len = Math.ceil(Math.max(...list.map(z => z.endTime))) + 1 - at;
  stems.push({ kind, name, file, at, len, items: list.slice().sort((a, b) => a.startTime - b.startTime).map(make) });
};
LANES.forEach((lane, i) => {
  if (/^elec\d$/.test(lane)) add('material', 'Elec ' + lane.slice(4), 'E' + lane.slice(4) + '-Elec' + lane.slice(4) + '.wav', zones.filter(z => z.layer === i && z.midiModel === 'elecMaterial'), material);
});
LANES.forEach((lane, i) => {
  add('sine', 'Sine - ' + (LABEL[lane] || lane), 'S' + (i + 1) + '-Sine-' + lane + '.wav', zones.filter(z => z.layer === i && z.midiModel === 'elecSine'), sine);
});
const placed = stems.reduce((n, s) => n + s.items.length, 0), wanted = zones.filter(z => z.midiModel === 'elecMaterial' || z.midiModel === 'elecSine').length;
if (placed !== wanted) { console.error('bricks placed ' + placed + ' of ' + wanted + ': a material off the electronics lanes or a sine on them'); process.exit(1); }

fs.mkdirSync(OUT, { recursive: true });
const jobFile = path.join(OUT, 'job.json');
fs.writeFileSync(jobFile, JSON.stringify({ dir: OUT.replace(/\\/g, '/'), materials: path.join(ROOT, 'bank', 'materials.json').replace(/\\/g, '/'), stems }));
const lv = Object.entries(route.level || {}).filter(([k, v]) => !k.startsWith('_') && typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
const t0 = Date.now();
const r = spawnSync(SCLANG, [path.join(__dirname, 'elec_stems.scd')], { encoding: 'utf8', maxBuffer: 1 << 26, timeout: 40 * 60 * 1000, env: Object.assign({}, process.env, { LE_STEMS_JOB: jobFile.replace(/\\/g, '/'), LE_LEVEL: lv }) });
const said = (r.stdout || '').split(/\r?\n/).filter(l => /ELEC_STEMS|ERROR|LE_ERROR/.test(l));
console.log(said.join('\n'));
if (r.status !== 0 || !said.some(l => l.includes('ELEC_STEMS DONE'))) { console.error('the render failed (exit ' + r.status + ')\n' + (r.stdout || '').slice(-1500)); process.exit(1); }

// each file read back: its length and its sample peak
function readBack(file) {
  const fd = fs.openSync(file, 'r'), head = Buffer.alloc(12); fs.readSync(fd, head, 0, 12, 0);
  let pos = 12, fmt = null, data = null; const size = fs.fstatSync(fd).size;
  while (pos + 8 <= size && !data) {
    const h = Buffer.alloc(8); fs.readSync(fd, h, 0, 8, pos);
    const id = h.toString('latin1', 0, 4), n = h.readUInt32LE(4);
    if (id === 'fmt ') { const b = Buffer.alloc(16); fs.readSync(fd, b, 0, 16, pos + 8); fmt = { ch: b.readUInt16LE(2), sr: b.readUInt32LE(4), bits: b.readUInt16LE(14) }; }
    if (id === 'data') data = { at: pos + 8, n: Math.min(n, size - pos - 8) };
    pos += 8 + n + (n & 1);
  }
  if (!fmt || !data || fmt.bits !== 32) throw new Error('not a 32-bit float WAV: ' + file);
  let peak = 0; const buf = Buffer.alloc(1 << 22);
  for (let off = 0; off < data.n;) {
    const got = fs.readSync(fd, buf, 0, Math.min(buf.length, data.n - off), data.at + off);
    if (!got) break;
    for (let i = 0; i + 4 <= got; i += 4) { const v = Math.abs(buf.readFloatLE(i)); if (v > peak) peak = v; }
    off += got;
  }
  fs.closeSync(fd);
  return { seconds: data.n / (fmt.ch * 4 * fmt.sr), peakDb: peak > 0 ? 20 * Math.log10(peak) : -Infinity };
}
const list = stems.map(s => {
  const f = path.join(OUT, s.file), b = readBack(f);
  console.log(s.name.padEnd(20) + ' at ' + String(s.at).padStart(3) + ' s · ' + b.seconds.toFixed(1).padStart(6) + ' s · peak ' + b.peakDb.toFixed(1) + ' dB · ' + s.items.length + ' brick(s)');
  return { name: s.name, kind: s.kind, file: f, at: s.at, len: r3(b.seconds), peakDb: r2(b.peakDb), bricks: s.items.length };
});
fs.unlinkSync(jobFile);
fs.writeFileSync(path.join(ROOT, 'midi', score, 'elec_stems.json'), JSON.stringify({ score, dir: OUT, dry: true, stems: list }, null, 1));
console.log('done in ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
