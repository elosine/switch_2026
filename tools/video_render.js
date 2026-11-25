#!/usr/bin/env node
// video_render.js — THE VISUAL VIDEO, RENDERED (the Switch~ piece SW-168, RUNNING_LOG §585 · §587; his "build the 4K render … could we do a sample
// first" · "go ahead and render the full piece").
//
//   node tools/video_render.js --t0 0 --t1 487 [--chunk 60] [--fps 30] [--w 3840] [--h 2160] [--crf 20] [--name Multiplicity-visual] [--port 5662]
//
// It serves the video workshop's page in RENDER MODE (workshop/video/index.html?render=1…) to a hidden Chrome, which steps the picture frame by
// frame on the score's clock and posts each frame here (a JPEG data URL); the frames go straight into ffmpeg (no frame files on disk).
// IN CHUNKS (§587 — a single hidden Chrome stalled after ~2 000 frames at 4K, silently): each chunk a fresh Chrome. The page is REPEATABLE in
// render mode (one seeded random sequence; every chunk starts from −6 s and runs the same steps forward, drawing nothing until its first frame),
// so a chunk begins in exactly the state the one before ended in — the seams do not show. A WATCHDOG retries a chunk that stops sending frames.
// A rerun resumes: chunks already rendered are kept. At the end the chunks are joined without re-encoding and the recording's same stretch is
// laid under them. Out: H:/switch_2026/video/<name>.mp4 (H.264, the bounce as AAC 320k, the tags cleared).
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), { spawn, spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const T0 = +arg('t0', 340), T1 = +arg('t1', 360), FPS = +arg('fps', 30), WID = +arg('w', 3840), HEI = +arg('h', 2160), PORT = +arg('port', 5662);
const CHUNK = +arg('chunk', 60), CRF = +arg('crf', 16), NAME = arg('name', 'sample-' + T0 + '-' + T1), STALL = +arg('stall', 120);
const OUTDIR = 'H:/switch_2026/video', PARTS = path.join(OUTDIR, NAME + '.parts'); fs.mkdirSync(PARTS, { recursive: true });
const OUT = path.join(OUTDIR, NAME + '.mp4');
const AUDIO = arg('audio', 'H:/switch_2026/audio/demo/piece-FirstDraft-Final-D-ctptCello/bounce/switch-demo-mix2.wav');
const CHROME = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe');
const send = (res, code, body, type) => { res.writeHead(code, { 'Content-Type': type || 'text/plain', 'Cache-Control': 'no-store' }); res.end(body); };
const body = req => new Promise(r => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => r(Buffer.concat(c))); });

// the chunks: [a, b) each, the last one to T1 inclusive
const chunks = []; for (let a = T0; a < T1 - 1e-9; a += CHUNK) chunks.push({ a, b: Math.min(T1, a + CHUNK), last: a + CHUNK >= T1 - 1e-9 });
let cur = null;
const started = Date.now();

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html') return send(res, 200, fs.readFileSync(path.join(ROOT, 'workshop', 'video', 'index.html')), 'text/html; charset=utf-8');
  if (url === '/data') return send(res, 200, fs.readFileSync(path.join(ROOT, 'bank', 'video_data.json')), 'application/json');
  if (url === '/settings') return send(res, 200, fs.existsSync(path.join(ROOT, 'bank', 'video_look.json')) ? fs.readFileSync(path.join(ROOT, 'bank', 'video_look.json')) : '{}', 'application/json');
  if (url === '/audio') return send(res, 404, '');
  if (!cur) return send(res, 409, 'no chunk');
  if (url === '/render/start') {
    cur.ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', String(CRF), '-pix_fmt', 'yuv420p', cur.file], { stdio: ['pipe', 'inherit', 'inherit'] });
    cur.lastFrame = Date.now(); cur.rendering = true;
    return send(res, 200, 'ok');
  }
  if (url === '/render/frame') {
    const raw = (await body(req)).toString('latin1'), comma = raw.indexOf(','), b = Buffer.from(comma >= 0 ? raw.slice(comma + 1) : raw, 'base64');
    if (!b.length || !cur || !cur.ff) return send(res, 400, 'empty');
    try { if (!cur.ff.stdin.write(b)) await new Promise(r => cur.ff.stdin.once('drain', r)); } catch (e) { return send(res, 500, 'encoder'); }
    if (!cur) return send(res, 409, 'gone');
    cur.frames++; cur.lastFrame = Date.now();
    if (cur.frames % FPS === 0) { const done = cur.c.a - T0 + cur.frames / FPS, el = (Date.now() - started) / 1000; process.stdout.write('\r  ' + done.toFixed(0) + ' s of ' + (T1 - T0) + ' · chunk ' + (cur.i + 1) + '/' + chunks.length + ' · ' + (el / 60).toFixed(1) + ' min so far   '); }
    return send(res, 200, 'ok');
  }
  if (url === '/render/error') { console.error('\nthe page failed: ' + (await body(req)).toString()); send(res, 200, 'ok'); if (cur) cur.fail('page error'); return; }
  if (url === '/render/end') { send(res, 200, 'ok'); const c = cur; c.ff.stdin.end(); c.ff.on('close', code => c.finish(code)); return; }
  send(res, 404, 'no route');
});
server.requestTimeout = 0; server.headersTimeout = 0; server.keepAliveTimeout = 120000;

function runChunk(i, attempt) {
  return new Promise(resolve => {
    const c = chunks[i], file = path.join(PARTS, String(i).padStart(3, '0') + '.mp4');
    const u = 'http://localhost:' + PORT + '/?render=1&t0=' + c.a + '&t1=' + c.b + '&excl=' + (c.last ? 0 : 1) + '&fps=' + FPS + '&w=' + WID + '&h=' + HEI;
    const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu-sandbox', '--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--window-size=' + WID + ',' + HEI,
      '--user-data-dir=' + path.join(os.tmpdir(), 'video-render-chrome-' + i + '-' + attempt), '--autoplay-policy=no-user-gesture-required', '--js-flags=--expose-gc', u], { stdio: 'ignore' });
    let settled = false, dog = null;
    const me = { i, c, file, chrome, ff: null, frames: 0, lastFrame: Date.now(), rendering: false };
    const end = ok => { if (settled) return; settled = true; clearInterval(dog); try { chrome.kill(); } catch (e) {} if (!ok && me.ff) { try { me.ff.kill(); } catch (e) {} } if (cur === me) cur = null; resolve(ok); };
    me.finish = code => end(!code); me.fail = why => { console.error('\nchunk ' + (i + 1) + ' failed (' + why + ')'); end(false); };
    cur = me;
    // the watchdog: once frames have begun, none for STALL seconds is a stall; before that the fast-forward may take a while (allow 15 min)
    dog = setInterval(() => { const idle = (Date.now() - me.lastFrame) / 1000; if (me.rendering ? idle > STALL : idle > 900) me.fail('no frame for ' + idle.toFixed(0) + ' s'); }, 5000);
  });
}

server.listen(PORT, async () => {
  console.log('rendering ' + T0 + ' … ' + T1 + ' s at ' + WID + ' x ' + HEI + ', ' + FPS + ' fps, in ' + chunks.length + ' chunk(s) of ' + CHUNK + ' s → ' + OUT);
  for (let i = 0; i < chunks.length; i++) {
    const file = path.join(PARTS, String(i).padStart(3, '0') + '.mp4');
    if (fs.existsSync(file + '.ok')) { console.log('\nchunk ' + (i + 1) + ' already rendered'); continue; }   // a rerun resumes
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) ok = await runChunk(i, attempt);
    if (!ok) { console.error('\nchunk ' + (i + 1) + ' failed three times — stopping; rerun the same command to resume'); process.exit(1); }
    fs.writeFileSync(file + '.ok', '');
  }
  console.log('\nall chunks rendered; joining them and laying the recording under them …');
  const list = path.join(PARTS, 'list.txt');
  fs.writeFileSync(list, chunks.map((_, i) => "file '" + path.join(PARTS, String(i).padStart(3, '0') + '.mp4').split(path.sep).join('/') + "'").join('\n') + '\n');
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-ss', String(T0), '-t', String(T1 - T0), '-i', AUDIO,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-map_metadata', '-1', '-shortest', OUT], { stdio: 'inherit' });
  if (r.status) { console.error('the join failed'); process.exit(1); }
  fs.rmSync(PARTS, { recursive: true, force: true });
  console.log('done in ' + ((Date.now() - started) / 60000).toFixed(1) + ' min: ' + OUT);
  process.exit(0);
});
