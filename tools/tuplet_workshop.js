#!/usr/bin/env node
// tuplet_workshop.js — THE TUPLET WORKSHOP's own small server (SW-48, 2026-11-18). A page of its own, players only: the phase form's single
// strikes (read from his save, never written), a strip of CHUNKS (start · end · band · players), the tuplets drawn inside each band, heard
// at once over Web MIDI in his Chrome.
//
//   node C:\Users\jwloy\GitHub\switch_2026\tools\tuplet_workshop.js        → http://localhost:5640/
//
// Routes: GET /         the page (workshop/tuplets/index.html)
//         GET /hits     the strikes of the phase form per player, from the save (--score, default piece-Section03-H-addTuplets) + the form's steps
//         GET /takes    his takes from the strikes drawer (the pitches per lane)      GET /routes   every technique's port · channel · cc0 · range
//         GET /chunks   bank/tuplet_chunks.json (+ its mtime)        POST /chunks   replace it (the page's autosave)
// The chunks file is the ONE record: the page writes it, the AI writes it, the page reloads it when it changes on disk.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'workshop', 'tuplets');
const CHUNKS = path.join(ROOT, 'bank', 'tuplet_chunks.json');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null ? process.argv[i + 1] : d; };
const SCORE = arg('score', 'piece-Section03-H-addTuplets');
const PORT = +(process.env.PORT || arg('port', 5640));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const send = (res, code, body, type) => { res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(body); };

function hits() {
    const form = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'phase_form.json'), 'utf8'));
    const save = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', SCORE + '.json'), 'utf8'));
    const by = {}; form.players.forEach((p) => { by[p] = []; });
    for (const o of save.objects) { const pf = o.properties && o.properties.phaseForm; if (o.type === 'waveCurve' && pf && by[pf.player]) by[pf.player].push(o.startSeconds); }
    form.players.forEach((p) => by[p].sort((a, b) => a - b));
    return { score: SCORE, players: form.players, hits: by, steps: form.steps, end: form.end.lastHitAt };
}
// THE TAKES (SW-51): his chords from the strikes drawer (bank/panel_snapshots.json → panels.strikes) — per take, the pitches on each lane
function takes() {
    const p = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'panel_snapshots.json'), 'utf8')).panels.strikes || {};
    const out = [];
    for (const name of Object.keys(p)) {
        const vs = ((p[name].state || {}).voices || []).filter((v) => !v.skip && v.pitch != null), lanes = {};
        for (const v of vs) for (const l of [v.lane].concat(v.also || [])) if (l != null && l >= 0) (lanes[l] = lanes[l] || []).push(v.pitch);
        if (Object.keys(lanes).length) out.push({ name, saved: p[name].saved || '', comment: String(p[name].comment || '').slice(0, 160), lanes });
    }
    return out;
}
// THE ROUTES: every technique of the seven players with where it is sent (port · channel · the Xsample cc0 · its range), from sandbox/instruments.js
function routes() {
    const I = new Function(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + ';return INSTRUMENTS')();
    const form = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'phase_form.json'), 'utf8'));
    const KEY = { flute: 'flute', clarinet: 'clarinet', alto_sax: 'alto_sax', glockenspiel: 'bowed_vibraphone', piano: 'piano', violin: 'violin', cello: 'cello' }, out = {};
    for (const p of form.players) {
        const inst = I[KEY[p]], tech = {};
        for (const q of inst.techniques) { if (q.kind && q.kind !== 'pitched') continue; tech[q.key] = { label: q.label || q.key, port: q.port || inst.port, ch: q.channel || 1, cc0: q.cc0 == null ? null : q.cc0, lo: q.rangeLow != null ? q.rangeLow : inst.rangeLow, hi: q.rangeHigh != null ? q.rangeHigh : inst.rangeHigh }; }
        out[p] = { lane: form.voices[p].layer, home: form.voices[p].technique, homeKey: form.voices[p].midi, tech };
    }
    return out;
}
function readChunks() {
    let db;
    try { db = JSON.parse(fs.readFileSync(CHUNKS, 'utf8')); }
    catch (e) { db = { _about: 'THE TUPLET CHUNKS of Section 3 (SW-48): each a stretch of score time, a band, the players it applies to. Written by the tuplet workshop page and by the AI; docs/TUPLET_BANDS.md is the rule.', ceiling: 10, bands: { slow: [1, 3], medium: [3, 6], fast: [6, 10] }, chunks: [] }; }
    let mtime = 0; try { mtime = fs.statSync(CHUNKS).mtimeMs; } catch (e) {}
    return { db, mtime };
}
http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    try {
        if (url.pathname === '/hits') return send(res, 200, JSON.stringify(hits()));
        if (url.pathname === '/takes') return send(res, 200, JSON.stringify(takes()));
        if (url.pathname === '/routes') return send(res, 200, JSON.stringify(routes()));
        if (url.pathname === '/chunks' && req.method === 'GET') return send(res, 200, JSON.stringify(readChunks()));
        if (url.pathname === '/chunks' && req.method === 'POST') {
            let body = ''; req.on('data', (c) => { body += c; if (body.length > 2e6) req.destroy(); });
            req.on('end', () => { try { const db = JSON.parse(body); if (!Array.isArray(db.chunks)) throw new Error('no chunks'); fs.writeFileSync(CHUNKS, JSON.stringify(db, null, 1) + '\n'); send(res, 200, JSON.stringify({ ok: true, mtime: fs.statSync(CHUNKS).mtimeMs })); } catch (e) { send(res, 400, JSON.stringify({ ok: false, error: String(e.message || e) })); } });
            return;
        }
        const p = url.pathname === '/' ? '/index.html' : url.pathname, file = path.normalize(path.join(DIR, p));
        if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, 'not found', 'text/plain');
        send(res, 200, fs.readFileSync(file), MIME[path.extname(file)] || 'application/octet-stream');
    } catch (e) { send(res, 500, JSON.stringify({ error: String(e.message || e) })); }
}).listen(PORT, () => console.log('THE TUPLET WORKSHOP  http://localhost:' + PORT + '/   (the strikes from scores/' + SCORE + '.json · the chunks → bank/tuplet_chunks.json)'));
