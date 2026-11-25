#!/usr/bin/env node
// elec_wave.js — THE WAVEFORM FOR THE SCORE'S ELEC LANE (RUNNING_LOG §468). The electronics of the demo as he mixed them: the ten electronics stems at the mix
// project's LIVE faders (each track · its ELEC or SINES folder) and the master's line, summed, the peak of every 20 ms. Reads Reaper through the bridge, writes
// bank/elec_wave.json. Changes nothing in the project.
//
//   node tools/elec_wave.js --score piece-FirstDraft-Final-D-ctptCello
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const score = arg('score');
if (!score) { console.error('usage: node tools/elec_wave.js --score <save>'); process.exit(1); }
const elec = JSON.parse(fs.readFileSync(path.join(ROOT, 'midi', score, 'elec_stems.json'), 'utf8'));
const SR = 48000, RATE = 100, HOP = SR / RATE, FULL = 10000;

const lua = `local function db(v) return 20 * math.log(math.max(v, 1e-9), 10) end
local out, m, plines = {}, reaper.GetMasterTrack(0), {}
for i = 0, reaper.CountTracks(0) - 1 do
  local t = reaper.GetTrack(0, i)
  local _, n = reaper.GetTrackName(t)
  if n:find('^Elec ') or n:find('^Sine ') then
    local p = reaper.GetParentTrack(t)
    local _, pn = reaper.GetTrackName(p)
    out[n] = { db = db(reaper.GetMediaTrackInfo_Value(t, 'D_VOL')) + db(reaper.GetMediaTrackInfo_Value(p, 'D_VOL')), parent = pn }
    -- [§485] the folder's own volume line (ELEC's last-section step, §475), read once per folder
    if not plines[pn] then
      local pe, pl = reaper.GetTrackEnvelopeByName(p, 'Volume'), {}
      if pe then
        local pm = reaper.GetEnvelopeScalingMode(pe)
        for q = 0, reaper.CountEnvelopePoints(pe) - 1 do local _, tm, v = reaper.GetEnvelopePoint(pe, q); pl[#pl + 1] = { tm, db(reaper.ScaleFromEnvelopeMode(pm, v)) } end
      end
      plines[pn] = pl
    end
  end
end
local e, line = reaper.GetTrackEnvelopeByName(m, 'Volume'), {}
if e then
  local mode = reaper.GetEnvelopeScalingMode(e)
  for p = 0, reaper.CountEnvelopePoints(e) - 1 do
    local _, time, v = reaper.GetEnvelopePoint(e, p)
    line[#line + 1] = { time, db(reaper.ScaleFromEnvelopeMode(mode, v)) }
  end
end
return { tracks = out, plines = plines, line = line, master = db(reaper.GetMediaTrackInfo_Value(m, 'D_VOL')) }`;
const r = spawnSync(process.execPath, [path.join(__dirname, 'reaper_job.js'), '-e', lua], { encoding: 'utf8', env: Object.assign({}, process.env, { REAPER_PROJECT: score + '-mix' }) });
const live = JSON.parse(r.stdout).result;
if (!live || !live.tracks) { console.error('the bridge gave no levels: ' + r.stdout.slice(0, 300)); process.exit(1); }
// [§485] a line read at t (dB): the master's, or a folder's
const lineOf = L => t => { if (!L || !L.length) return 0; if (t <= L[0][0]) return L[0][1]; for (let i = 1; i < L.length; i++) if (t <= L[i][0]) { const u = (t - L[i - 1][0]) / Math.max(1e-6, L[i][0] - L[i - 1][0]); return L[i - 1][1] + (L[i][1] - L[i - 1][1]) * u; } return L[L.length - 1][1]; };
const lineAt = t => { const L = live.line; if (!L.length) return 0; if (t <= L[0][0]) return L[0][1]; for (let i = 1; i < L.length; i++) if (t <= L[i][0]) { const u = (t - L[i - 1][0]) / Math.max(1e-6, L[i][0] - L[i - 1][0]); return L[i - 1][1] + (L[i][1] - L[i - 1][1]) * u; } return L[L.length - 1][1]; };

const total = Math.ceil(Math.max(...elec.stems.map(s => s.at + s.len))) * SR, A = new Float32Array(total), B = new Float32Array(total);
for (const s of elec.stems) {
  if (live.tracks[s.name] == null) { console.error('no live track: ' + s.name); process.exit(1); }
  const tr = live.tracks[s.name], folderLine = lineOf((live.plines || {})[tr.parent]), b = fs.readFileSync(s.file); let p = 12, d = null;
  while (p + 8 <= b.length && !d) { const id = b.toString('latin1', p, p + 4), n = b.readUInt32LE(p + 4); if (id === 'data') d = [p + 8, Math.min(n, b.length - p - 8)]; p += 8 + n + (n & 1); }
  const f = new Float32Array(b.buffer.slice(b.byteOffset + d[0], b.byteOffset + d[0] + (d[1] & ~3)));
  let g = 1;
  for (let i = 0, w = Math.round(s.at * SR); i + 1 < f.length && w < total; i += 2, w++) { if (w % HOP === 0) g = Math.pow(10, (tr.db + folderLine(w / SR)) / 20); A[w] += f[i] * g; B[w] += f[i + 1] * g; }
}
const raw = [];
for (let h = 0; h * HOP < total; h++) {
  const g = Math.pow(10, lineAt((h + 0.5) / RATE) / 20); let m = 0;
  for (let i = h * HOP, e = Math.min(total, i + HOP); i < e; i++) { const v = Math.max(Math.abs(A[i]), Math.abs(B[i])); if (v > m) m = v; }
  raw.push(m * g);
}
const top = Math.max(...raw), peaks = raw.map(v => Math.round(v / top * FULL));
fs.writeFileSync(path.join(ROOT, 'bank', 'elec_wave.json'), JSON.stringify({ _doc: "the ELEC lane's waveform: the demo's mixed electronics, the peak of every 1/rate seconds, full = the loudest. Written by tools/elec_wave.js from the mix project's live levels.", score, rate: RATE, full: FULL, seconds: peaks.length / RATE, peaks }));
console.log(JSON.stringify({ tracks: Object.keys(live.tracks).length, masterLine: live.line, seconds: peaks.length / RATE, peakBeforeMasterFaderDb: +(20 * Math.log10(top)).toFixed(2), bytes: fs.statSync(path.join(ROOT, 'bank', 'elec_wave.json')).size }));
