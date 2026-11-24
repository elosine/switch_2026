#!/usr/bin/env node
// bounce_mix.js — THE DEMO'S BOUNCE (PLAN 2r step 7): the mix project's master, exactly as he approved it, rendered to one file.
//
//   node tools/bounce_mix.js --score <save> --name <file name without extension>
//
// Reaper's own render of the OPEN mix project (Monitoring FX, so Realphones, is not in a render). No processing is added: the render is 32-bit float, its peak
// and loudness are measured, and THE FILE IS WRITTEN ONLY IF THE PEAK IS UNDER 0 dB: 24-bit, 48 kHz, TPDF dither, a bare WAV header, so it carries no name,
// path, software or date (the submission is anonymous). If it is over, the float stays and the tool says so. The project's render settings are put back.
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const score = arg('score'), name = arg('name');
if (!score || !name || !/^[A-Za-z0-9_-]+$/.test(name)) { console.error('usage: node tools/bounce_mix.js --score <save> --name <plain-file-name>'); process.exit(1); }
const audio = JSON.parse(fs.readFileSync(path.join(ROOT, 'midi', score, 'stems_audio.json'), 'utf8'));
const OUT = path.join(path.dirname(audio.dir), 'bounce'), END = 487, SR = 48000;
const B = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA, 'REAPER', 'bridge');
const L = s => JSON.stringify(String(s).replace(/\\/g, '/'));
const sleep = ms => new Promise(r => setTimeout(r, ms));
function job(lua, timeoutMs = 30000) {
  const r = spawnSync(process.execPath, [path.join(__dirname, 'reaper_job.js'), '-e', lua], { encoding: 'utf8', env: Object.assign({}, process.env, { REAPER_PROJECT: score + '-mix', BRIDGE_TIMEOUT_MS: String(timeoutMs) }), timeout: timeoutMs + 10000 });
  let j; try { j = JSON.parse(r.stdout); } catch (e) { throw new Error('the bridge did not answer: ' + (r.stdout || r.stderr).slice(0, 300)); }
  if (!j.ok || (j.result && j.result.error)) throw new Error('bridge: ' + JSON.stringify(j.error || j.result));
  return j.result;
}
const heartAge = () => { try { const h = JSON.parse(fs.readFileSync(path.join(B, 'heartbeat.json'), 'utf8')); return Date.now() / 1000 - h.time; } catch (e) { return 1e9; } };

function readFloat(file) {
  const b = fs.readFileSync(file); let p = 12, d = null, fmt = null;
  while (p + 8 <= b.length && !d) { const id = b.toString('latin1', p, p + 4), n = b.readUInt32LE(p + 4); if (id === 'fmt ') fmt = { tag: b.readUInt16LE(p + 8), ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22) }; if (id === 'data') d = [p + 8, Math.min(n, b.length - p - 8)]; p += 8 + n + (n & 1); }
  if (!fmt || !d || fmt.ch !== 2 || fmt.sr !== SR || fmt.bits !== 32) throw new Error('not 48 kHz stereo 32-bit: ' + JSON.stringify(fmt));
  return new Float32Array(b.buffer.slice(b.byteOffset + d[0], b.byteOffset + d[0] + (d[1] & ~3)));
}
// BS.1770 integrated loudness with its two gates; the loudest 400 ms; the sample peak; the first and last sound
function measure(f) {
  const s = new Float64Array(8), frames = f.length / 2, HOP = 4800, e = [];
  const k = (x, c) => { const o = c * 4, y = 1.53512485958697 * x + s[o]; s[o] = -2.69169618940638 * x + 1.69065929318241 * y + s[o + 1]; s[o + 1] = 1.19839281085285 * x - 0.73248077421585 * y; const z = y + s[o + 2]; s[o + 2] = -2 * y + 1.99004745483398 * z + s[o + 3]; s[o + 3] = y - 0.99007225036621 * z; return z; };
  let acc = 0, peak = 0, at = 0, first = -1, last = -1, over = 0;
  for (let i = 0; i < frames; i++) {
    const a = f[2 * i], b = f[2 * i + 1], m = Math.max(Math.abs(a), Math.abs(b));
    if (m > peak) { peak = m; at = i / SR; }
    if (m >= 1) over++;
    if (m > 0.0001) { if (first < 0) first = i / SR; last = i / SR; }
    const l = k(a, 0), r = k(b, 1); acc += l * l + r * r;
    if ((i + 1) % HOP === 0) { e.push(acc / HOP); acc = 0; }
  }
  const blocks = []; for (let i = 0; i + 4 <= e.length; i++) blocks.push((e[i] + e[i + 1] + e[i + 2] + e[i + 3]) / 4);
  const lk = p => -0.691 + 10 * Math.log10(Math.max(p, 1e-20)), mean = a => a.reduce((x, y) => x + y, 0) / a.length;
  const g1 = blocks.filter(p => lk(p) > -70), rel = lk(mean(g1)) - 10, g2 = g1.filter(p => lk(p) > rel);
  return { seconds: frames / SR, peakDb: 20 * Math.log10(peak), peakAtS: at, samplesAtOrOver0: over, integratedLufs: lk(mean(g2)), loudest400msLufs: lk(Math.max(...blocks)), firstSoundS: first, lastSoundS: last };
}
function write24(f, file) {
  const frames = f.length / 2, size = frames * 6, h = Buffer.alloc(44), o = Buffer.alloc(size);
  h.write('RIFF', 0, 'latin1'); h.writeUInt32LE(36 + size, 4); h.write('WAVEfmt ', 8, 'latin1'); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 6, 28); h.writeUInt16LE(6, 32); h.writeUInt16LE(24, 34); h.write('data', 36, 'latin1'); h.writeUInt32LE(size, 40);
  let seed = 22222; const rnd = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
  for (let i = 0, w = 0; i < f.length; i++, w += 3) {
    const v = Math.max(-8388608, Math.min(8388607, Math.round(f[i] * 8388607 + rnd() - rnd())));
    o.writeIntLE(v, w, 3);
  }
  const fd = fs.openSync(file, 'wx'); fs.writeSync(fd, h); fs.writeSync(fd, o); fs.closeSync(fd);
}

(async () => {
  const finalFile = path.join(OUT, name + '.wav'), rawFile = path.join(OUT, name + '-float.wav');
  if (fs.existsSync(finalFile) || fs.existsSync(rawFile)) throw new Error('already there, nothing overwritten: ' + (fs.existsSync(finalFile) ? finalFile : rawFile));
  fs.mkdirSync(OUT, { recursive: true });
  const st = job(`if reaper.GetPlayState() ~= 0 then return { error = 'Reaper is playing' } end
local _, p = reaper.EnumProjects(-1, '')
if reaper.IsProjectDirty(0) ~= 0 then reaper.Main_SaveProject(0, false) end
local S = function(k, v) reaper.GetSetProjectInfo_String(0, k, v, true) end
local N = function(k, v) reaper.GetSetProjectInfo(0, k, v, true) end
S('RENDER_FILE', ${L(OUT)}) S('RENDER_PATTERN', ${L(name + '-float')}) S('RENDER_FORMAT', 'ZXZhdyAAAQ==')
N('RENDER_SETTINGS', 0) N('RENDER_BOUNDSFLAG', 0) N('RENDER_STARTPOS', 0) N('RENDER_ENDPOS', ${END}) N('RENDER_SRATE', 48000)
N('RENDER_CHANNELS', 2) N('RENDER_TAILFLAG', 0) N('RENDER_ADDTOPROJ', 0) N('RENDER_DITHER', 0)
pcall(N, 'RENDER_NORMALIZE', 0)
return { project = p }`);
  console.log('rendering from ' + path.basename(st.project));
  // REAPER TAKES ITS MEDIA OFFLINE WHILE IT IS NOT THE ACTIVE WINDOW, and a render then writes silence with no error (§467): all media online (40101), then the render
  job(`reaper.defer(function() reaper.Main_OnCommand(40101, 0) reaper.Main_OnCommand(42230, 0) end) return { queued = true }`);
  await sleep(3000);
  job('return { back = true }', 10 * 60 * 1000);   // the bridge answers only when the render has let Reaper go
  const t0 = Date.now(); let last = -1, still = 0;
  for (;;) {
    await sleep(1000);
    if (Date.now() - t0 > 10 * 60 * 1000) throw new Error('the render did not finish in 10 minutes');
    const size = fs.existsSync(rawFile) ? fs.statSync(rawFile).size : -1;
    still = size > 0 && size === last && heartAge() < 3 ? still + 1 : 0;
    last = size;
    if (still >= 3) break;
  }
  job(`local S = function(k, v) reaper.GetSetProjectInfo_String(0, k, v, true) end
local N = function(k, v) reaper.GetSetProjectInfo(0, k, v, true) end
S('RENDER_FILE', '') S('RENDER_PATTERN', '') S('RENDER_FORMAT', 'ZXZhdxgAAQ==')
N('RENDER_BOUNDSFLAG', 1) N('RENDER_STARTPOS', 0) N('RENDER_ENDPOS', 0)
return { restored = true }`);
  const f = readFloat(rawFile), m = measure(f);
  const out = { name, file: finalFile, rendered: new Date().toISOString(), seconds: +m.seconds.toFixed(2), peakDb: +m.peakDb.toFixed(2), peakAtS: +m.peakAtS.toFixed(2), samplesAtOrOver0: m.samplesAtOrOver0, integratedLufs: +m.integratedLufs.toFixed(1), loudest400msLufs: +m.loudest400msLufs.toFixed(1), firstSoundS: +m.firstSoundS.toFixed(2), lastSoundS: +m.lastSoundS.toFixed(2) };
  console.log(JSON.stringify(out, null, 1));
  if (!(m.peakDb > -60)) { console.log('SILENT: no final file written. ' + rawFile); process.exit(4); }
  if (m.peakDb >= 0) { console.log('OVER 0 dB: no final file written. The float stays: ' + rawFile); process.exit(3); }
  write24(f, finalFile);
  fs.unlinkSync(rawFile);
  fs.writeFileSync(path.join(ROOT, 'midi', score, 'bounce.json'), JSON.stringify(out, null, 1));
  console.log('written: ' + finalFile + ' · ' + (fs.statSync(finalFile).size / 1048576).toFixed(0) + ' MB');
})().catch(e => { console.error(String(e.message || e)); process.exit(1); });
