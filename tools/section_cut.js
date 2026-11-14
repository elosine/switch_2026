#!/usr/bin/env node
// section_cut.js — A WORKING CUT FOR HIS PHONE (his word 2026-11-14, SW-47): a stretch of the players' offline render (render_reaper.js's
// float, no electronics unless --mix) cut from a round score second, leveled by the shared gain step, with THE SCORE TIME SPOKEN every N
// seconds under the music ("two eighty", "two ninety" …) so he can say "from this second to this second" by ear; the file starts at --from,
// so his player's clock + --from is the score time too.
//
//   node tools/section_cut.js --score <save> --from 270 --to 486 [--voice 10] [--voiceDb -10] [--mix] [--out <name>]
//
// Out: notation/audio/cuts/<out>.mp3 (192 kb/s) and its 24-bit WAV beside it. The voice is Windows' own (System.Speech), one clip per mark,
// made in a scratch folder and mixed in with ffmpeg; nothing of the save or the renders is written.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const G = require('./lib/gain_step.js');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const flag = k => process.argv.includes('--' + k);
const score = arg('score', null); if (!score) { console.error('--score <save>'); process.exit(2); }
const FROM = +arg('from', 0), TO = +arg('to', null), VOICE = +arg('voice', 10), VDB = +arg('voiceDb', -10);
const SRC = path.join(ROOT, 'notation', 'audio', 'raw', score + (flag('mix') ? '-mix-float.wav' : '-float.wav'));
if (!fs.existsSync(SRC)) { console.error('missing ' + path.relative(ROOT, SRC) + ' — run render_reaper.js' + (flag('mix') ? ' and mix_offline.js' : '') + ' first'); process.exit(1); }
const total = G.seconds(G.probe(SRC)), to = TO == null ? total : Math.min(TO, total);
const NAME = arg('out', score + '-' + FROM + '-' + Math.round(to) + (flag('mix') ? '-mix' : '-players') + (VOICE ? '-spoken' + VOICE : ''));
const DIR = path.join(ROOT, 'notation', 'audio', 'cuts'); fs.mkdirSync(DIR, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'section-cut-'));

// 1. the stretch, leveled (up allowed — a working copy of the players alone sits low; the piece's render keeps its own rule)
const cutF = path.join(tmp, 'cut-float.wav');
execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(FROM), '-to', String(to), '-i', SRC, '-c:a', 'pcm_f32le', cutF]);
const m = G.measure(cutF), gf = G.gainFor(m.truePeak, { peak: -1, up: true, maxUp: 12 });
const cutL = path.join(tmp, 'cut-leveled.wav');
execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', cutF, '-af', 'volume=' + gf.gain + 'dB', '-c:a', 'pcm_f32le', cutL]);

// 2. the spoken marks: every VOICE seconds from the first round mark after FROM, the score second in plain words
const words = n => { const h = Math.floor(n / 100), r = n % 100; if (h === 0) return String(n); if (r === 0) return ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][h] + ' hundred'; return ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][h] + ' ' + (r < 10 ? 'oh ' + r : String(r)); };
const marks = []; if (VOICE > 0) for (let t = Math.ceil(FROM / VOICE) * VOICE; t < to; t += VOICE) if (t > FROM) marks.push(t);
const clips = [];
if (marks.length) {
  const ps = marks.map((t, i) => `$s.SetOutputToWaveFile('${path.join(tmp, 'v' + i + '.wav').replace(/\\/g, '/')}'); $s.Speak('${words(t)}');`).join(' ');
  execFileSync('powershell', ['-NoProfile', '-Command', `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = 2; ${ps} $s.Dispose()`], { stdio: 'inherit' });
  marks.forEach((t, i) => clips.push({ t, file: path.join(tmp, 'v' + i + '.wav') }));
}

// 3. the mix: the music, each clip at its mark (its onset on the second), the voice at VDB under
const inputs = ['-i', cutL]; const parts = ['[0:a]aformat=sample_fmts=fltp:channel_layouts=stereo:sample_rates=48000[m]'];
clips.forEach((c, i) => { inputs.push('-i', c.file); const d = Math.round((c.t - FROM) * 1000); parts.push(`[${i + 1}:a]aformat=sample_fmts=fltp:channel_layouts=stereo:sample_rates=48000,volume=${VDB}dB,adelay=${d}|${d}[v${i}]`); });
const graph = parts.join(';') + ';[m]' + clips.map((_, i) => `[v${i}]`).join('') + `amix=inputs=${clips.length + 1}:normalize=0:duration=first[out]`;
const WAV = path.join(DIR, NAME + '.wav'), MP3 = path.join(DIR, NAME + '.mp3');
execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph, '-map', '[out]', '-c:a', 'pcm_s24le', WAV]);
execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', WAV, '-c:a', 'libmp3lame', '-b:a', '192k', MP3]);
const m2 = G.measure(WAV);
console.log(`${path.relative(ROOT, MP3)} · ${(to - FROM).toFixed(1)} s from score ${FROM} · gain ${gf.gain} dB → ${m2.truePeak} dBTP · ${m2.I} LUFS · ${clips.length} spoken marks every ${VOICE} s at ${VDB} dB · ${(fs.statSync(MP3).size / 1048576).toFixed(1)} MB`);
fs.rmSync(tmp, { recursive: true, force: true });
