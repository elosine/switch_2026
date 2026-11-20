#!/usr/bin/env node
// piano_clip.js — a short film of the piano solo's page, ZOOMED and CROPPED to the piano staves, from one score time to another, with sound.
// (the Switch~ piece RUNNING_LOG §266 — his word 2026-11-20: "I want cropped versions of the zoomed score from a certain time to a certain
// time ~147.9 ~ 152 cropped like the image to the piano part".)
//
//   node tools/piano_clip.js --t0 147.9 --t1 152 [--played] [--page s2-piano-solo] [--audio notation/audio/<file>.wav] [--lead 0.5] [--tail 1]
//
//   --played   the time-accurate copy (s2-piano-solo-played) instead of the spaced page
//   --lead · --tail   seconds added before t0 and after t1 (the cursor runs in; the last note rings)
//   --band y,h  the crop's top and height in the zoomed frame (1920 x 2160); the default is the piano's two staves with their stems
//
// It runs tools/export_video.js in its zoom view (6 s of music across the frame, a page turn where the page ends), then crops with ffmpeg.
// The film goes to notation/video/clips/ (not committed) and its path is printed on the last line.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const flag = k => process.argv.includes('--' + k);
const t0 = +arg('t0'), t1 = +arg('t1');
if (!(t1 > t0)) { console.error('usage: piano_clip.js --t0 S --t1 S [--played] [--page id] [--audio wav]'); process.exit(2); }
const page = arg('page', flag('played') ? 's2-piano-solo-played' : 's2-piano-solo');
const audio = arg('audio', 'notation/audio/piece-Section03-H-addTuplets.wav');   // the players' render; its piano solo is the first draft's, note for note (§266)
const a = Math.max(0, t0 - +arg('lead', 0.5)), b = t1 + +arg('tail', 1);
// [§267] THE PASSAGE ON ONE PAGE (his SHIFT+arrows in the app): the zoom page opens at the clip's start (--zoomAnchor); a passage longer
// than the 5.5 s a 2x page holds is drawn at the largest zoom that still holds it whole (coords.js zoomCfg), down to 1. --turn = the old way.
const need = b - a, zRaw = flag('turn') ? 2 : Math.max(1, Math.min(2, 1920 / (147.33 * (need + 0.05) + 152)))   /* the zoom page holds (1920 - 152 Z) / (147.33 Z) seconds: coords.js zoomCfg, the frame 1920 wide with 152 px of label and margin */, Z = Math.floor(1080 * zRaw / 2) * 2 / 1080;
const [by0, bh0] = arg('band', '1085,420').split(',').map(Number), by = Math.round(by0 * Z / 2), bh = Math.round(bh0 * Z / 4) * 2;
const dir = path.join(ROOT, 'notation', 'video', 'clips'); fs.mkdirSync(dir, { recursive: true });
const name = page + '_' + String(t0).replace('.', '-') + '_' + String(t1).replace('.', '-');
const full = path.join(dir, name + '.full.mp4'), out = path.join(dir, name + '.mp4');
const run = (cmd, args) => { const r = spawnSync(cmd, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }); if (r.status !== 0) { console.error((r.stdout || '').slice(-600), (r.stderr || '').slice(-600)); process.exit(1); } };
run('node', ['tools/export_video.js', '--ir', page, '--view', 'zoom', '--z', String(Z), ...(flag('turn') ? [] : ['--zoomAnchor', String(a)]), '--fps', '30', '--t0', String(a), '--t1', String(b), '--fade', '0', '--audio', audio, '--out', full]);
run('ffmpeg', ['-y', '-v', 'error', '-i', full, '-vf', 'crop=1920:' + bh + ':0:' + by + ',scale=1280:-2:flags=lanczos', '-c:v', 'libx264', '-crf', '22', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out]);
fs.unlinkSync(full);
console.log(out);
