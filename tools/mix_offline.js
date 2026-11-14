#!/usr/bin/env node
// mix_offline.js — THE LISTENING COPY: the players' offline render (render_reaper.js, the master mix as float) summed with the
// electronics lanes rendered offline (elec_offline.js), then THE GAIN STEP of every file this stack hands out (tools/lib/gain_step.js:
// the true peak measured on the float, ONE plain gain, 24-bit) and an MP3 of it. 2026-11-14, the first copy of the piece so far.
//
//   node tools/mix_offline.js --score <save> [--elec-db 0] [--peak -1] [--up] [--maxUp 6] [--out <name>]
//
// In:  notation/audio/raw/<save>-float.wav (the players, the rack's master already in it) · notation/audio/raw/<save>-elec-float.wav
// Out: notation/audio/raw/<out>-mix-float.wav · notation/audio/<out>-mix.wav (24-bit) · notation/audio/<out>-mix.mp3 (320 kb/s)
// The electronics at unity against the players unless --elec-db says otherwise (the rack's ELEC RETURN and master faders are read
// from the .rpp and applied, as the take's mix applies them).
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const G = require('./lib/gain_step.js');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const flag = k => process.argv.includes('--' + k);
const score = arg('score', null); if (!score) { console.error('--score <save>'); process.exit(2); }
const NAME = arg('out', score), PEAK = +arg('peak', -1), UP = flag('up'), MAXUP = arg('maxUp', null) == null ? null : +arg('maxUp'), ELEC_DB = +arg('elec-db', 0);
const RAWDIR = path.join(ROOT, 'notation', 'audio', 'raw'), AUDIODIR = path.join(ROOT, 'notation', 'audio');
const P = path.join(RAWDIR, score + '-float.wav'), E = path.join(RAWDIR, score + '-elec-float.wav');
for (const f of [P, E]) if (!fs.existsSync(f)) { console.error('missing ' + path.relative(ROOT, f)); process.exit(1); }
// the rack's faders on the electronics' road: ELEC RETURN's VOLPAN and MASTER_VOLUME (linear → dB)
const rpp = fs.readFileSync(path.join(ROOT, 'reaper', 'switch_rack.rpp'), 'utf8');
const lin = re => { const m = rpp.match(re); return m ? +m[1] : 1; };
const dB = v => v <= 0 ? -150 : +(20 * Math.log10(v)).toFixed(3);
const elecFader = dB(lin(/NAME "ELEC RETURN"[\s\S]*?VOLPAN ([\d.]+)/)), master = dB(lin(/^\s*MASTER_VOLUME ([\d.]+)/m));
const elecDb = +(ELEC_DB + elecFader + master).toFixed(3);
const RAW = path.join(RAWDIR, NAME + '-mix-float.wav'), OUT = path.join(AUDIODIR, NAME + '-mix.wav'), MP3 = path.join(AUDIODIR, NAME + '-mix.mp3');
const fmt = 'aformat=sample_fmts=fltp:channel_layouts=stereo,aresample=48000';
const graph = '[0:a]' + fmt + '[p];[1:a]' + fmt + ',volume=' + elecDb + 'dB[e];[p][e]amix=inputs=2:normalize=0:duration=longest[m]';
execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', P, '-i', E, '-filter_complex', graph, '-map', '[m]', '-c:a', 'pcm_f32le', RAW]);
const mp = G.measure(P), me = G.measure(E), m = G.measure(RAW), probe = G.probe(RAW);
const gf = G.gainFor(m.truePeak, { peak: PEAK, up: UP, maxUp: MAXUP });
G.writeGain(RAW, OUT, gf.gain);
execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', OUT, '-c:a', 'libmp3lame', '-b:a', '320k', MP3]);
const m2 = G.measure(OUT);
const rel = f => path.relative(ROOT, f);
console.log('players  ' + rel(P) + ' · ' + mp.truePeak + ' dBTP · ' + mp.I + ' LUFS · first sound ' + mp.firstSound + ' s');
console.log('elec     ' + rel(E) + ' · ' + me.truePeak + ' dBTP · ' + me.I + ' LUFS · first sound ' + me.firstSound + ' s · at ' + elecDb + ' dB (ELEC RETURN ' + elecFader + ' · master ' + master + (ELEC_DB ? ' · --elec-db ' + ELEC_DB : '') + ')');
console.log('mix      ' + rel(RAW) + ' · ' + G.seconds(probe).toFixed(3) + ' s · ' + m.truePeak + ' dBTP · ' + m.I + ' LUFS · LRA ' + m.LRA + ' LU');
console.log('gain     ' + gf.gain + ' dB' + (gf.gain !== gf.wanted ? ' (wanted ' + gf.wanted + ', capped at --maxUp ' + MAXUP + ')' : '') + ' → ' + rel(OUT) + ' · ' + m2.truePeak + ' dBTP · ' + m2.I + ' LUFS');
console.log('mp3      ' + rel(MP3) + ' · ' + (fs.statSync(MP3).size / 1048576).toFixed(1) + ' MB');
