#!/usr/bin/env node
// elec_offline.js — THE ELECTRONICS LANES RENDERED OFFLINE: every material brick of a save (midiModel 'elecMaterial') laid on one
// timeline from the fund's files, exactly as the engine plays it (electronics/sc/material.scd · electronics/score/le_material.js):
// the file from offsetMs for the brick's length, at the file's own rate, a quarter-sine fade at both edges, the plain gainDb trim,
// a flat mark of the ladder (mf = the file as mastered). Written for the first listening copy of the piece, 2026-11-14 — a brick
// has no live input, so the offline sum IS what the engine streams (a hairpin or a drawn curve is NOT followed here: its start mark
// is used and the brick is named in the report).
//
//   node tools/elec_offline.js --score <save> [--out notation/audio/raw/<save>-elec-float.wav] [--end S] [--sr 48000] [--stepDb 6]
//
// Out: a 32-bit float stereo WAV at --sr (Reaper's 48 kHz, so it sums with the players' render sample for sample), 0 → --end
// (default: the last brick's end + 6 s). Nothing of the save is written; the fund is only read.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const score = arg('score', null); if (!score) { console.error('--score <save>'); process.exit(2); }
const SR = +arg('sr', 48000), STEP = +arg('stepDb', 6);
const OUT = path.join(ROOT, arg('out', 'notation/audio/raw/' + score + '-elec-float.wav'));
const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', score + '.json'), 'utf8'));
const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'materials.json'), 'utf8'));
const row = Object.fromEntries(idx.materials.map(m => [m.name, m]));
const MARKS = ['niente', 'ppp', 'pp', 'p', 'mf', 'f', 'ff', 'fff'];   // mf = 4 = the file as mastered; each step ±stepDb (material.scd)
const markDb = m => { if (m == null) return 0; const n = typeof m === 'number' ? m : MARKS.indexOf(String(m)); if (n < 0) return 0; return n === 0 ? -96 : (n - 4) * STEP; };
const bricks = save.objects.filter(o => o.type === 'zone' && o.midiModel === 'elecMaterial' && o.elec && o.elec.name).sort((a, b) => a.startTime - b.startTime);
if (!bricks.length) { console.error('no material bricks in ' + score); process.exit(1); }
const notFollowed = [], missing = [];
const inputs = [], filters = []; let nIn = 0;
bricks.forEach((z, i) => {
  const e = z.elec, r = row[e.name];
  if (!r) { missing.push(e.name); return; }
  const file = path.isAbsolute(r.file) ? r.file : path.join(idx.root, r.file);
  const len = Math.max(0.05, z.endTime - z.startTime), off = (+e.offsetMs || 0) / 1000;
  const fi = Math.max(0.002, (+e.fadeInMs || 30) / 1000), fo = Math.max(0.002, (+e.fadeOutMs || 30) / 1000);
  const lv = e.level || {}; if (lv.mode && lv.mode !== 'flat') notFollowed.push(e.name + ' @' + z.startTime + ' (' + lv.mode + ')');
  const db = (+e.gainDb || 0) + markDb(lv.mark == null ? 'mf' : lv.mark);
  const k = nIn++; inputs.push('-ss', off.toFixed(3), '-t', len.toFixed(3), '-i', file);
  const delay = Math.round(z.startTime * 1000);
  filters.push(`[${k}:a]aformat=sample_fmts=fltp:channel_layouts=stereo,aresample=${SR},afade=t=in:st=0:d=${fi.toFixed(3)}:curve=qsin,afade=t=out:st=${Math.max(0, len - fo).toFixed(3)}:d=${fo.toFixed(3)}:curve=qsin,volume=${db.toFixed(2)}dB,adelay=${delay}|${delay}[b${k}]`);
  console.log(`lane ${z.layer}  ${String(z.startTime).padStart(8)} → ${String(z.endTime).padStart(8)}  ${e.name}  from ${off.toFixed(2)} s  ${len.toFixed(2)} s  ${db ? (db > 0 ? '+' : '') + db.toFixed(1) + ' dB' : 'as mastered'}`);
});
if (missing.length) { console.error('NOT IN THE FUND: ' + missing.join(', ')); process.exit(1); }
const end = +arg('end', Math.max(...bricks.map(z => z.endTime)) + 6);
const n = filters.length;
const graph = filters.join(';') + ';' + filters.map((_, k) => `[b${k}]`).join('') + `amix=inputs=${n}:normalize=0:duration=longest,apad=whole_dur=${end.toFixed(3)},atrim=0:${end.toFixed(3)}[out]`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const args = ['-y', '-v', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-c:a', 'pcm_f32le', '-ar', String(SR), OUT];
execFileSync('ffmpeg', args, { stdio: 'inherit' });
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=sample_rate,channels,duration_ts', '-of', 'json', OUT], { encoding: 'utf8' })).streams[0];
console.log(`\n${n} bricks → ${path.relative(ROOT, OUT)} · ${(probe.duration_ts / probe.sample_rate).toFixed(3)} s · ${probe.channels} ch · ${probe.sample_rate} Hz · float`);
if (notFollowed.length) console.log('level NOT followed (start mark used): ' + notFollowed.join(' · '));
