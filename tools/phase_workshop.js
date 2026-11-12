#!/usr/bin/env node
// phase_workshop.js — THE PHASE WORKSHOP's own small server (SW-43, 2026-11-12; RUNNING_LOG §170). His word: a page of its own, not the
// composer score, grown one step at a time. Serves workshop/phase/ on 5630 and keeps the locks he captures in bank/phase_locks.json.
//
//   node C:\Users\jwloy\GitHub\switch_2026\tools\phase_workshop.js        → http://localhost:5630/
//
// Routes: GET /            the page            GET /locks   the captured locks (JSON)
//         POST /locks      append one lock     (the page's Capture button; the body is the lock record)
// No dependencies. The page talks Web MIDI to the rack directly (his Chrome; the in-app browser has no Web MIDI).
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'workshop', 'phase');
const LOCKS = path.join(ROOT, 'bank', 'phase_locks.json');
const PORT = +(process.env.PORT || 5630);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function readLocks() {
    try { return JSON.parse(fs.readFileSync(LOCKS, 'utf8')); }
    catch (e) { return { _about: 'THE PHASE WORKSHOP\'s captured locks (SW-43): each the lag of every player against the anchor at the moment he pressed Capture. Written by tools/phase_workshop.js; his to prune.', locks: [] }; }
}
function send(res, code, body, type) {
    res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(body);
}
http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/locks' && req.method === 'GET') return send(res, 200, JSON.stringify(readLocks(), null, 1));
    if (url.pathname === '/locks' && req.method === 'POST') {
        let body = '';
        req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
        req.on('end', () => {
            try {
                const rec = JSON.parse(body); const db = readLocks();
                rec.id = db.locks.length + 1; rec.savedAt = new Date().toISOString();
                db.locks.push(rec);
                fs.writeFileSync(LOCKS, JSON.stringify(db, null, 1));
                send(res, 200, JSON.stringify({ ok: true, id: rec.id, count: db.locks.length }));
            } catch (e) { send(res, 400, JSON.stringify({ ok: false, error: String(e.message || e) })); }
        });
        return;
    }
    let p = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = path.normalize(path.join(DIR, p));
    if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, 'not found', 'text/plain');
    send(res, 200, fs.readFileSync(file), MIME[path.extname(file)] || 'application/octet-stream');
}).listen(PORT, () => console.log('THE PHASE WORKSHOP  http://localhost:' + PORT + '/   (locks → bank/phase_locks.json)'));
