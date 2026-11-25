#!/usr/bin/env node
// video_workshop.js — THE VIDEO WORKSHOP's small server (the Switch~ piece SW-168, RUNNING_LOG §516 · §517; his words 2026-11-24:
// "maybe we could do a workshop … page where I can see some of these things and where changes can be made as well. I guess with the audio would be good").
//
//   node C:\Users\jwloy\GitHub\switch_2026\tools\video_workshop.js        → http://localhost:5660/
//
// Step 1 (§517): the ropes in double Dutch's look (C:\Users\jwloy\GitHub\doubleDutch, sketch 006 — the tumbleweeds, the bloom, the painters'
// palettes), live in the browser with the demo recording and a time slider. The data (onsets · grains · sines · tempos) comes at step 3.
//
// Routes: GET /          the page (workshop/video/index.html)
//         GET /audio     the demo recording (the submission's MP3, Range) — its second 0 is score time 0
//         GET /settings  · POST /settings   the page's knobs, kept in bank/video_look.json (his to change on the page)
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'workshop', 'video');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const PORT = +(process.env.PORT || arg('port', 5660));
const AUDIO = path.resolve(ROOT, arg('audio', 'docs/submission/final/Multiplicity-recording.mp3'));
const LOOK = path.join(ROOT, 'bank', 'video_look.json');
const send = (res, code, body, type) => { res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(body); };

function sendFile(req, res, file, type) {
  if (!fs.existsSync(file)) return send(res, 404, JSON.stringify({ error: 'not found: ' + path.basename(file) }));
  const size = fs.statSync(file).size, m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (!m) { res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' }); return fs.createReadStream(file).pipe(res); }
  const a = m[1] ? +m[1] : 0, b = m[2] ? Math.min(+m[2], size - 1) : size - 1;
  res.writeHead(206, { 'Content-Type': type, 'Content-Length': b - a + 1, 'Content-Range': 'bytes ' + a + '-' + b + '/' + size, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(file, { start: a, end: b }).pipe(res);
}

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html') return sendFile(req, res, path.join(DIR, 'index.html'), 'text/html; charset=utf-8');
  if (url === '/audio') return sendFile(req, res, AUDIO, /\.wav$/i.test(AUDIO) ? 'audio/wav' : 'audio/mpeg');
  if (url === '/data') return sendFile(req, res, path.join(ROOT, 'bank', 'video_data.json'), 'application/json');   // tools/video_data.js (§519)
  if (url === '/settings' && req.method === 'GET') return send(res, 200, fs.existsSync(LOOK) ? fs.readFileSync(LOOK) : '{}');
  if (url === '/settings' && req.method === 'POST') {
    const chunks = []; req.on('data', c => chunks.push(c));
    return req.on('end', () => {
      try { const j = JSON.parse(Buffer.concat(chunks).toString('utf8')); fs.writeFileSync(LOOK, JSON.stringify(j, null, 1) + '\n'); send(res, 200, '{"ok":true}'); }
      catch (e) { send(res, 400, JSON.stringify({ error: String(e.message) })); }
    });
  }
  send(res, 404, '{"error":"no route"}');
}).listen(PORT, () => console.log('video workshop: http://localhost:' + PORT + '/   (audio: ' + path.relative(ROOT, AUDIO) + ')'));
