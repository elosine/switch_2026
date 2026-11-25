#!/usr/bin/env node
// video_render.js — THE VISUAL VIDEO, RENDERED (the Switch~ piece SW-168, RUNNING_LOG §585; his "build the 4K render … could we do a sample first").
//
//   node tools/video_render.js --t0 340 --t1 360 [--fps 30] [--w 3840] [--h 2160] [--name sample-0540] [--port 5662]
//
// It serves the video workshop's page in RENDER MODE (workshop/video/index.html?render=1…) to a hidden Chrome, which steps the picture frame by
// frame on the score's clock and posts each frame here; the frames go straight into ffmpeg (no files on disk), and at the end the recording's same
// stretch is laid under them. Out: H:/switch_2026/video/<name>.mp4 (H.264, the bounce as AAC 320k).
// Same code as the workshop, so what is built there is what renders. Frames are drawn from the score's time, not the wall clock: a slow frame
// never slips.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const T0 = +arg('t0', 340), T1 = +arg('t1', 360), FPS = +arg('fps', 30), WID = +arg('w', 3840), HEI = +arg('h', 2160), PORT = +arg('port', 5662);
const NAME = arg('name', 'sample-' + T0 + '-' + T1);
const OUTDIR = 'H:/switch_2026/video'; fs.mkdirSync(OUTDIR, { recursive: true });
const SILENT = path.join(OUTDIR, NAME + '.video.mp4'), OUT = path.join(OUTDIR, NAME + '.mp4');
const AUDIO = arg('audio', 'H:/switch_2026/audio/demo/piece-FirstDraft-Final-D-ctptCello/bounce/switch-demo-mix2.wav');
const CHROME = arg('chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe');
const send = (res, code, body, type) => { res.writeHead(code, { 'Content-Type': type || 'text/plain', 'Cache-Control': 'no-store' }); res.end(body); };

let ff = null, frames = 0, chrome = null, started = Date.now();
const body = req => new Promise(r => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => r(Buffer.concat(c))); });

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html') return send(res, 200, fs.readFileSync(path.join(ROOT, 'workshop', 'video', 'index.html')), 'text/html; charset=utf-8');
  if (url === '/data') return send(res, 200, fs.readFileSync(path.join(ROOT, 'bank', 'video_data.json')), 'application/json');
  if (url === '/settings') return send(res, 200, fs.existsSync(path.join(ROOT, 'bank', 'video_look.json')) ? fs.readFileSync(path.join(ROOT, 'bank', 'video_look.json')) : '{}', 'application/json');
  if (url === '/audio') return send(res, 404, '');
  if (url === '/render/start') {
    ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-vcodec', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', SILENT], { stdio: ['pipe', 'inherit', 'inherit'] });
    console.log('rendering ' + T0 + ' … ' + T1 + ' s at ' + WID + ' x ' + HEI + ', ' + FPS + ' fps → ' + OUT);
    return send(res, 200, 'ok');
  }
  if (url === '/render/frame') {
    const raw = (await body(req)).toString('latin1'), comma = raw.indexOf(','), b = Buffer.from(comma >= 0 ? raw.slice(comma + 1) : raw, 'base64'); if (!b.length) return send(res, 400, 'empty'); frames++;   // [§586] a data-URL frame
    try { if (!ff.stdin.write(b)) await new Promise(r => ff.stdin.once('drain', r)); } catch (e) { console.error('\nthe encoder refused frame ' + frames + ': ' + e.message); return send(res, 500, 'encoder'); }
    if (frames % FPS === 0) { const el = (Date.now() - started) / 1000; process.stdout.write('\r  ' + (frames / FPS).toFixed(0) + ' s of ' + (T1 - T0) + ' · ' + (el / frames).toFixed(2) + ' s a frame   '); }
    return send(res, 200, 'ok');
  }
  if (url === '/render/error') { console.error('\nthe page failed: ' + (await body(req)).toString()); send(res, 200, 'ok'); finish(1); return; }
  if (url === '/render/end') {
    send(res, 200, 'ok');
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('\n' + frames + ' frames encoded; laying the recording under them …');
    const mux = spawn('ffmpeg', ['-y', '-v', 'error', '-i', SILENT, '-ss', String(T0), '-t', String(frames / FPS), '-i', AUDIO, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-map_metadata', '-1', '-shortest', OUT], { stdio: 'inherit' });
    mux.on('close', code => { if (!code) fs.unlinkSync(SILENT); console.log(code ? 'the mux failed' : 'done in ' + ((Date.now() - started) / 60000).toFixed(1) + ' min: ' + OUT); finish(code); });
    return;
  }
  send(res, 404, 'no route');
});
server.requestTimeout = 0; server.headersTimeout = 0; server.keepAliveTimeout = 120000;   // [§586] a long frame or a slow encoder never cuts the page off
server.listen(PORT, () => {
  const u = 'http://localhost:' + PORT + '/?render=1&t0=' + T0 + '&t1=' + T1 + '&fps=' + FPS + '&w=' + WID + '&h=' + HEI;
  chrome = spawn(CHROME, ['--headless=new', '--disable-gpu-sandbox', '--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--window-size=' + WID + ',' + HEI,
    '--user-data-dir=' + path.join(require('os').tmpdir(), 'video-render-chrome'), '--autoplay-policy=no-user-gesture-required', '--js-flags=--expose-gc', u], { stdio: 'ignore' });
  console.log('opened the page in a hidden Chrome: ' + u);
});
function finish(code) { try { chrome && chrome.kill(); } catch (e) {} setTimeout(() => process.exit(code || 0), 300); }
