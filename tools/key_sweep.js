#!/usr/bin/env node
// key_sweep.js — WHICH KEYS SOUND, read from the meter, with no hands and no MIDI port (the new-piece protocol's 4.4 ·
// 4.5; RUNNING_LOG §32, 2026-10-04). Piece #6 did this by hand-run steps (its §41 · §42); here it is one command.
//
//   node tools/key_sweep.js "<track>" --channels 1-6,8-10 --keys 52,53,91-96 [--vel 100] [--hold 0.30] [--json out.json]
//                              [--cc0 14] [--cc1 100]   sent first on each channel: an Xsample PRESET (CC0 = its number − 1), the mod wheel
//
// For every channel × key: the note is put into Reaper's Virtual MIDI Keyboard queue on THAT channel
// (reaper.StuffMIDIMessage), the track's meter is watched while it sounds, the note is released, and the next key
// waits until the track has gone quiet again (or 2.5 s). The track's own input is switched to the virtual keyboard
// for the run and PUT BACK exactly as it was. Nothing is saved; nothing in the plugin is changed.
// A key SOUNDS when its peak is above --floor (default -70 dB) AND at least 12 dB above what was still ringing
// before it. The printout is one line per channel: the sounding keys as ranges, and the level of each tested key.
// USE: the edges of a range he has read from a plugin's keyboard · the keys of a by-key voice · "does it sound at all".
// NOT a loudness measurement — the meter is sampled about thirty times a second; the volume card records (container 5).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const track = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] != null ? args[i + 1] : d; };
const list = s => String(s).split(',').flatMap(p => { const m = p.trim().match(/^(\d+)-(\d+)$/); if (!m) return [Number(p)]; const o = []; for (let i = +m[1]; i <= +m[2]; i++) o.push(i); return o; });
if (!track || track.startsWith('--')) { console.error('usage: node tools/key_sweep.js "<track>" --channels 1-4 --keys 36-84 [--vel 100] [--hold 0.30] [--floor -70] [--json out.json]'); process.exit(2); }
const channels = list(opt('channels', '1')), keys = list(opt('keys', '36-96'));
const vel = Number(opt('vel', 100)), hold = Number(opt('hold', 0.30)), floor = Number(opt('floor', -70));
const cc0 = opt('cc0', null), cc1 = opt('cc1', null);
if ([...channels, ...keys].some(n => !Number.isInteger(n)) || channels.some(c => c < 1 || c > 16) || keys.some(k => k < 0 || k > 127)) { console.error('channels 1..16, keys 0..127'); process.exit(2); }

const B = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'REAPER', 'bridge');
const OUT = path.join(B, 'outbox', 'key_sweep.json');
const lua = `
local TRACK, CHANNELS, KEYS = ${JSON.stringify(track)}, { ${channels.join(', ')} }, { ${keys.join(', ')} }
local VEL, HOLD_S, QUIET, MAX_WAIT = ${vel}, ${hold}, 0.0006, 2.5        -- QUIET = about -64 dB
local CC0, CC1 = ${cc0 == null ? 'nil' : Number(cc0)}, ${cc1 == null ? 'nil' : Number(cc1)}
local VKB = 4096 + 62 * 32
local sep = package.config:sub(1, 1)
local outpath = job.root .. sep .. 'outbox' .. sep .. 'key_sweep.json'
os.remove(outpath)
local tr
for i = 0, reaper.CountTracks(0) - 1 do local t = reaper.GetTrack(0, i); local _, n = reaper.GetTrackName(t); if n == TRACK then tr = t end end
if not tr then return { error = 'no track named ' .. TRACK } end
local oldInput = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', VKB)
local function peak() return math.max(reaper.Track_GetPeakInfo(tr, 0), reaper.Track_GetPeakInfo(tr, 1)) end
local function dB(v) if v > 0 then return math.floor(20 * math.log(v, 10) * 10 + 0.5) / 10 end return -150 end
local rows, ci, ki, phase, t0, pre, mx = {}, 1, 0, 'next', 0, 0, 0
local function finish()
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', oldInput)
  local ok = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT') == oldInput
  local f = io.open(outpath, 'wb')
  if f then f:write('{"track":"' .. TRACK .. '","inputRestored":' .. tostring(ok) .. ',"rows":[' .. table.concat(rows, ',') .. ']}'); f:close() end
end
local function loop()
  local now = reaper.time_precise()
  if phase == 'next' then
    ki = ki + 1
    if ki > #KEYS then ki = 1; ci = ci + 1 end
    if ci > #CHANNELS then finish(); return end
    if ki == 1 then   -- a new channel: its preset and its wheel first
      if CC0 then reaper.StuffMIDIMessage(0, 0xB0 + CHANNELS[ci] - 1, 0, CC0) end
      if CC1 then reaper.StuffMIDIMessage(0, 0xB0 + CHANNELS[ci] - 1, 1, CC1) end
    end
    phase, t0 = 'settle', now
  elseif phase == 'settle' then
    if peak() < QUIET or now - t0 > MAX_WAIT then
      pre, mx = peak(), 0
      reaper.StuffMIDIMessage(0, 0x90 + CHANNELS[ci] - 1, KEYS[ki], VEL)
      phase, t0 = 'hold', now
    end
  elseif phase == 'hold' then
    local p = peak(); if p > mx then mx = p end
    if now - t0 > HOLD_S then
      reaper.StuffMIDIMessage(0, 0x80 + CHANNELS[ci] - 1, KEYS[ki], 0)
      rows[#rows + 1] = string.format('{"ch":%d,"key":%d,"db":%s,"pre":%s}', CHANNELS[ci], KEYS[ki], dB(mx), dB(pre))
      phase = 'next'
    end
  end
  reaper.defer(loop)
end
reaper.defer(loop)
return { track = TRACK, notes = #CHANNELS * #KEYS, file = outpath }
`;
const jobFile = path.join(os.tmpdir(), 'key_sweep_job_' + process.pid + '.lua');
fs.writeFileSync(jobFile, lua);
try { fs.unlinkSync(OUT); } catch (e) {}
const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', jobFile], { encoding: 'utf8' });
fs.unlinkSync(jobFile);
if (r.status !== 0) { console.error('bridge job failed: ' + (r.stderr || r.stdout).slice(0, 500)); process.exit(1); }
const answer = JSON.parse(r.stdout);
if (answer.result && answer.result.error) { console.error(answer.result.error); process.exit(1); }
const n = channels.length * keys.length, deadline = Date.now() + (n * (hold + 2.6) + 10) * 1000;
const sleep = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
while (!fs.existsSync(OUT) && Date.now() < deadline) sleep(300);
if (!fs.existsSync(OUT)) { console.error('no result file — the job did not finish; the track input may still be the virtual keyboard: run reaper/bridge/jobs/make_tracks.lua'); process.exit(1); }
sleep(150);
const res = JSON.parse(fs.readFileSync(OUT, 'utf8'));
const NN = m => ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][m % 12] + (Math.floor(m / 12) - 2);   // Kontakt's naming: C3 = 60
const sounds = x => x.db > floor && x.db - x.pre >= 12;
console.log(`${res.track} · ${n} notes · vel ${vel} · input restored: ${res.inputRestored} · a key sounds above ${floor} dB and 12 dB over what was ringing · names as Kontakt shows them (C3 = 60)`);
for (const ch of channels) {
  const rs = res.rows.filter(x => x.ch === ch), on = rs.filter(sounds).map(x => x.key);
  const runs = []; for (const k of on) { const last = runs[runs.length - 1]; if (last && k === last[1] + 1) last[1] = k; else runs.push([k, k]); }
  console.log(`  ch ${String(ch).padStart(2)}: sounds ${runs.map(([a, b]) => a === b ? `${a} (${NN(a)})` : `${a}–${b} (${NN(a)}–${NN(b)})`).join(', ') || '— none'}   | ` + rs.map(x => `${x.key}:${sounds(x) ? x.db : '·'}`).join(' '));
}
const j = opt('json', null); if (j) { fs.writeFileSync(j, JSON.stringify(res, null, 1) + '\n'); console.log('written: ' + j); }
