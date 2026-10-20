// gain_step.js — THE MEASURE-AND-GAIN STEP of every audio file this stack hands to the notation page (2026-10-10, PLAN 2.8 step 3 c).
//
// Lifted out of tools/render_reaper.js (RUNNING_LOG §453 — piece #4's clip lesson) so that the OFFLINE render (render_reaper.js) and
// the LIVE take's mix (take.js) measure and level a file with ONE copy of the rule:
//
//   · the file is 32-BIT FLOAT, so a peak above 0 dBFS is MEASURED, not clipped
//   · ffmpeg reads the true peak (ebur128), the integrated loudness, the loudness range, and the first sound (silencedetect)
//   · ONE plain gain — no limiter, no normalize: the loudness range is the composition — brings the true peak to the ceiling
//     (down always; up only when asked, and then capped), and the result is written as 24-bit PCM
//
// Nothing here knows a piece, a rack or a score.
'use strict';
const { execFileSync, spawnSync } = require('child_process');

const FF = (() => { try { return execFileSync('where', ['ffmpeg'], { encoding: 'utf8' }).split(/\r?\n/)[0].trim(); } catch (e) { return 'ffmpeg'; } })();
const FFPROBE = FF.replace(/ffmpeg(\.exe)?$/i, 'ffprobe$1');

// the first audio stream of a file: { codec_name, sample_rate, channels, duration_ts }
function probe(file) {
  return JSON.parse(execFileSync(FFPROBE, ['-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,channels,duration_ts', '-of', 'json', file], { encoding: 'utf8' })).streams[0];
}
const seconds = p => p.duration_ts / +p.sample_rate;

// ffmpeg's report → the numbers
function readM(txt) {
  const sum = txt.slice(txt.lastIndexOf('Summary:'));
  const num = re => { const m = sum.match(re); return m ? +m[1] : null; };
  const sil = [...txt.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  const silStart0 = /silence_start: 0\b/.test(txt) || /silence_start: -?0\.0/.test(txt);
  return { I: num(/I:\s+(-?[\d.]+) LUFS/), LRA: num(/LRA:\s+(-?[\d.]+) LU/), truePeak: num(/True peak:\s+Peak:\s+(-?[\d.]+|-inf) dBFS/), samplePeak: num(/Sample peak:\s+Peak:\s+(-?[\d.]+|-inf) dBFS/), firstSound: silStart0 && sil.length ? sil[0] : 0 };
}

// measure(file)                       the whole file: true peak · sample peak · I · LRA · the first sound (after a silence from 0)
// measure(file, { window: [a, b] })   the same, read INSIDE a..b s (firstSound is then relative to a)
// measure(file, { silence: false })   without the first-sound read
function measure(file, opt) {
  const o = opt || {};
  const af = 'ebur128=peak=true+sample' + (o.silence === false ? '' : ',silencedetect=noise=-80dB:d=0.05');
  const pre = o.window ? ['-ss', String(o.window[0]), '-to', String(o.window[1])] : [];
  return readM(spawnSync(FF, ['-hide_banner', '-nostats', ...pre, '-i', file, '-af', af, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 }).stderr);
}

// the one plain gain for a measured true peak: down to `peak` when above it; up to `peak` only when `up` (or `always`, a demo
// file's window); an upward gain capped at `maxUp` dB. → { gain, wanted } (wanted = the gain before the cap)
function gainFor(truePeak, opt) {
  const o = opt || {}, peak = o.peak == null ? -1 : o.peak;
  let gain = (truePeak > peak || o.always || o.up) ? +(peak - truePeak).toFixed(2) : 0;
  const wanted = gain;
  if (o.maxUp != null && gain > o.maxUp) gain = o.maxUp;
  return { gain, wanted };
}

// the float file, one plain gain, written as 24-bit PCM
function writeGain(src, out, gainDb) {
  execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', src, '-af', 'volume=' + gainDb + 'dB', '-c:a', 'pcm_s24le', out]);
}

module.exports = { FF, FFPROBE, probe, seconds, readM, measure, gainFor, writeGain };
