#!/usr/bin/env node
// make_film.js — THE DEMO FILM (RUNNING_LOG §468; his word 2026-11-23: "the full score, then a couple just seated sections that are close up. But for the piano solo …
// the whole solo the zoomed in version … see if you can't work independently and print a video … I'll take your decisions about the cut and the zoom").
// The score is four pages of the notation app, each with its own pace, so the film is four renders of tools/export_video.js on ONE clock (absolute frames), joined without
// re-encoding, with the bounce laid under it whole: picture and sound cannot drift.
//
//   node tools/make_film.js --score <save> --audio <bounce.wav> --name <film name> [--seed 11] [--plan]     (--plan: print the cut, render nothing)
//
// Out: H:/switch_2026/audio/demo/<save>/film/<name>.mp4, 1920 x 1080, 30 fps. A section already rendered with the same cut is not rendered again.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : process.argv[i + 1]; };
const score = arg('score'), audioFile = arg('audio'), name = arg('name'), SEED = +arg('seed', 11), FPS = 30, END = 487;
if (!score || !audioFile || !name || !/^[A-Za-z0-9_-]+$/.test(name)) { console.error('usage: node tools/make_film.js --score <save> --audio <wav> --name <plain-name> [--seed N] [--plan]'); process.exit(1); }
const stemsDir = JSON.parse(fs.readFileSync(path.join(ROOT, 'midi', score, 'stems_audio.json'), 'utf8')).dir;
const DIR = path.join(path.dirname(stemsDir), 'film');

// the close-ups, by seated group. V-SOLO: the piano large, the ELEC lane under it (rows of the x2 master, measured on the page)
// [§469 — his "the Zoom for the piano is cutting off … the tops of the flags" · "quite a bit is cut off at the top" · "keep the staff lines"] the solo's frame reaches
// up into the percussion's staff (the solo's flags rise to 953 at the highest, measured on every screen it shows); that staff's clef stays, its name and brace do not.
// V-SOLO-OUT is the same frame at x1.4 (every row and column x0.7).
const GROUPS = { 'V-TOP': [0, 1, 2], 'V-MID': [3, 4, 5], 'V-BOT': [6, 7, 8],
  'V-SOLO': { rows: [940, 1592], at: 109, gutter: [{ x: 222, rows: [144, 727] }, { x: 165, rows: [267, 727] }], paste: [2010, 2160], pasteAt: 821 },
  'V-SOLO-OUT': { rows: [658, 1114], at: 240, gutter: [{ x: 155, rows: [264, 672] }, { x: 115, rows: [350, 672] }], paste: [1407, 1512], pasteAt: 736 } };
const SECTIONS = [
  { id: 'sines', ir: 's1-sines', from: 0, to: 146, z: 2.4, close: { n: 2, groups: ['V-TOP', 'V-BOT'], min: 20, max: 28, lead: 34, tail: 16, gap: 24 } },   // the piano does not play here: no V-MID
  // [§469 — his "zoom in all the way to that point and then zoom out so that you see the entire long, last long curve in frame"] the ribbon of 186.79 … 191.46 in one
  // screen: from 186.5 the solo at x1.4 with a 5.4 s screen (pace 7.56 s a page), the screens anchored to open at 186.5
  // [§474 — his "the whole piano solo can be the zoomed out version. We don't need to zoom in"] the solo at x1.4 throughout; the screens stay anchored at 186.5 so the long last curve is whole on one
  { id: 'solo', ir: 's2-piano-solo-final', from: 146, to: 199, z: 1.4, pageSeconds: 7.56, zoomAnchor: 186.5, whole: 'V-SOLO-OUT' },
  { id: 'counterpoint', ir: 's2-ctpt-heads', from: 199, to: 254, z: 2.4, close: { n: 1, groups: ['V-MID', 'V-TOP', 'V-BOT'], min: 16, max: 20, lead: 16, tail: 12, gap: 0 } },
  { id: 'phase', ir: 's3-phase', from: 254, to: END, z: 2.4, close: { n: 3, groups: ['V-TOP', 'V-BOT', 'V-MID'], min: 20, max: 30, lead: 24, tail: 34, gap: 26 } },   // closes wide
];
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rand = rng(SEED), F = s => Math.round(s * FPS);
function timeline(S) {
  if (S.whole) return [{ f0: F(S.from), f1: F(S.to), src: S.whole }];
  const c = S.close, lens = Array.from({ length: c.n }, () => c.min + rand() * (c.max - c.min));
  const a = S.from + c.lead, b = S.to - c.tail, slack = (b - a) - lens.reduce((x, y) => x + y, 0) - c.gap * (c.n - 1);
  if (slack < 0) throw new Error(S.id + ': the close-ups do not fit');
  const cuts = Array.from({ length: c.n }, () => rand() * slack).sort((x, y) => x - y), out = [];
  let at = F(S.from), first = rand() < 0.5 ? 0 : 1;
  lens.forEach((len, i) => {
    const s = a + cuts[i] + lens.slice(0, i).reduce((x, y) => x + y, 0) + c.gap * i, f0 = F(s), f1 = F(s + len);
    out.push({ f0: at, f1: f0, src: 'V-MAIN' }, { f0, f1, src: c.groups[(first + i) % c.groups.length] });
    at = f1;
  });
  out.push({ f0: at, f1: F(S.to), src: 'V-MAIN' });
  return out;
}
const plan = SECTIONS.map(S => Object.assign({}, S, { timeline: timeline(S) }));
const closeS = plan.reduce((n, S) => n + S.timeline.filter(x => x.src !== 'V-MAIN').reduce((m, x) => m + (x.f1 - x.f0) / FPS, 0), 0);
for (const S of plan) console.log(S.id.padEnd(13) + S.timeline.filter(x => x.src !== 'V-MAIN').map(x => x.src + ' ' + (x.f0 / FPS).toFixed(1) + '-' + (x.f1 / FPS).toFixed(1)).join(' · '));
console.log('close-up ' + closeS.toFixed(0) + ' s of ' + END + ' (' + Math.round(closeS / END * 100) + ' %)');
if (process.argv.includes('--plan')) process.exit(0);

fs.mkdirSync(DIR, { recursive: true });
const final = path.join(DIR, name + '.mp4');
if (fs.existsSync(final)) { console.error('already there, nothing overwritten: ' + final); process.exit(1); }
const parts = [], t0 = Date.now();
for (const S of plan) {
  const key = crypto.createHash('sha1').update(JSON.stringify([S.ir, S.from, S.to, S.z, S.pageSeconds, S.zoomAnchor, S.timeline, GROUPS, fs.statSync(path.join(ROOT, 'notation', 'lib', 'elec_wave.js')).mtimeMs, fs.statSync(path.join(__dirname, 'export_video.js')).mtimeMs])).digest('hex').slice(0, 10);
  const out = path.join(DIR, 'part-' + S.id + '-' + key + '.mp4'), done = out + '.done', cut = path.join(DIR, 'cut-' + S.id + '.json');
  parts.push(out);
  if (fs.existsSync(done) && fs.existsSync(out)) { console.log(S.id + ': already rendered'); continue; }
  try { fs.unlinkSync(out); } catch (e) { /* none */ }
  fs.writeFileSync(cut, JSON.stringify({ fps: FPS, seed: SEED, timeline: S.timeline }));
  console.log('rendering ' + S.id + ' (' + S.from + ' to ' + S.to + ' s)');
  const r = spawnSync(process.execPath, ['--max-old-space-size=6000', path.join(__dirname, 'export_video.js'), '--ir', S.ir, '--view', 'video', '--fps', String(FPS), '--z', String(S.z), '--groups', JSON.stringify(GROUPS), '--cut', cut, '--t0', String(S.from), '--t1', String(S.to), '--out', out, ...(S.pageSeconds ? ['--pageSeconds', String(S.pageSeconds)] : []), ...(S.zoomAnchor != null ? ['--zoomAnchor', String(S.zoomAnchor)] : [])], { stdio: ['ignore', 'inherit', 'ignore'] });
  if (r.status !== 0 || !fs.existsSync(out)) { console.error(S.id + ': the render failed (' + r.status + ')'); process.exit(1); }
  fs.writeFileSync(done, new Date().toISOString());
}
const list = path.join(DIR, 'parts.txt');
fs.writeFileSync(list, parts.map(p => "file '" + p.replace(/\\/g, '/') + "'").join('\n') + '\n');
const ff = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-n', '-f', 'concat', '-safe', '0', '-i', list, '-i', audioFile, '-map', '0:v:0', '-map', '1:a:0', '-map_metadata', '-1', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', String(END), '-movflags', '+faststart', final], { encoding: 'utf8' });
if (ff.status !== 0) { console.error('the join failed: ' + ff.stderr); process.exit(1); }
const probe = spawnSync('ffprobe', ['-v', 'error', '-count_packets', '-show_entries', 'stream=codec_type,nb_read_packets,duration,start_time,width,height', '-show_entries', 'format=duration,size', '-of', 'json', final], { encoding: 'utf8' });
console.log(probe.stdout);
console.log('FILM DONE in ' + ((Date.now() - t0) / 60000).toFixed(1) + ' min: ' + final);
