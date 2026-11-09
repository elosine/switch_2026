#!/usr/bin/env node
// tools/materials_index.js — THE FUND'S INDEX for the composer score and the engine: every mastered material in the keep folder, one row
// each — name · file · seconds · channels · sr · kind · note — written to bank/materials.json. PLAN 1a.7 step 1 (RUNNING_LOG §103).
//
//   node tools/materials_index.js [--root H:/switch_2026/audio/set-2025-04-08c/keep]
//
// What is listed: the masters (`*-master.wav`) at the root and in every sub-folder (opening · granular · petals · …), never a raw file
// beside its master, never a `_old` folder. The name is the file's stem without `-master`, made safe for the engine (letters, digits,
// - _ ~ only — a dot becomes an underscore). The note is the page's own: the recipe.json or materials.json beside the file. The files
// stay where they are (on H:) — the engine streams them (electronics/sc/material.scd); the page reads the lengths.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const rootArg = args.includes('--root') ? args[args.indexOf('--root') + 1] : 'H:/switch_2026/audio/set-2025-04-08c/keep';
const root = rootArg.replace(/\\/g, '/').replace(/\/$/, '');
const safe = (s) => String(s).replace(/\./g, '_').replace(/[^A-Za-z0-9_~-]/g, '').slice(0, 64);

// the header of a WAV: channels · sample rate · the data chunk's frames (PCM 16/24/32 and float)
function wavInfo(file) {
    const fd = fs.openSync(file, 'r');
    try {
        const head = Buffer.alloc(12); fs.readSync(fd, head, 0, 12, 0);
        if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 8, 12) !== 'WAVE') return null;
        let pos = 12, channels = 0, sr = 0, bits = 0, dataBytes = 0;
        const size = fs.fstatSync(fd).size;
        while (pos + 8 <= size) {
            const ch = Buffer.alloc(8); fs.readSync(fd, ch, 0, 8, pos);
            const id = ch.toString('ascii', 0, 4), len = ch.readUInt32LE(4);
            if (id === 'fmt ') { const f = Buffer.alloc(16); fs.readSync(fd, f, 0, 16, pos + 8); channels = f.readUInt16LE(2); sr = f.readUInt32LE(4); bits = f.readUInt16LE(14); }
            if (id === 'data') { dataBytes = len === 0xFFFFFFFF ? size - pos - 8 : len; break; }
            pos += 8 + len + (len % 2);
        }
        if (!channels || !sr || !bits) return null;
        return { channels, sr, seconds: Math.round(dataBytes / (channels * bits / 8) / sr * 100) / 100 };
    } finally { fs.closeSync(fd); }
}

function notesOf(dir) {
    const notes = {};
    for (const f of ['recipe.json', 'materials.json']) {
        const p = path.join(dir, f);
        if (!fs.existsSync(p)) continue;
        try {
            const d = JSON.parse(fs.readFileSync(p, 'utf8'));
            if (f === 'recipe.json') { for (const [k, v] of Object.entries(d)) if (typeof v === 'string') notes[k] = v; }
            else { for (const r of (d.materials || [])) { const key = path.basename(r.file || ''); notes[key] = [r.made, r.notes].filter(Boolean).join(' · '); } }
        } catch (e) { /* a note is never a reason to fail */ }
    }
    return notes;
}

const rows = [];
function scan(dir, kind) {
    const notes = notesOf(dir);
    for (const f of fs.readdirSync(dir).sort()) {
        const p = path.join(dir, f), st = fs.statSync(p);
        if (st.isDirectory()) { if (!f.startsWith('_') && dir === root.replace(/\//g, path.sep)) scan(p, f); continue; }
        if (!/-master\.wav$/i.test(f)) continue;
        const info = wavInfo(p);
        if (!info) { console.warn('not a WAV I can read:', p); continue; }
        const rel = path.relative(root, p).replace(/\\/g, '/');
        rows.push({ name: safe(f.replace(/-master\.wav$/i, '')), file: rel, seconds: info.seconds, channels: info.channels, sr: info.sr, kind, note: notes[f] || '' });
    }
}
scan(root.replace(/\//g, path.sep), 'mix');
const seen = new Set();
for (const r of rows) { if (seen.has(r.name)) console.warn('two materials share the name', r.name); seen.add(r.name); }
const out = { schema: 1, _what: 'THE FUND\'S INDEX — every mastered material of the keep folder (tools/materials_index.js): the composer score\'s picker and the engine\'s streaming player read it (electronics/score/le_material.js · electronics/sc/material.scd). GENERATED — run the tool again after the keep folder changes.', root, written: new Date().toISOString().slice(0, 19), materials: rows };
const dst = path.join(ROOT, 'bank', 'materials.json');
fs.writeFileSync(dst, JSON.stringify(out, null, 1) + '\n');
const total = rows.reduce((a, r) => a + r.seconds, 0);
console.log(rows.length + ' materials, ' + Math.floor(total / 60) + ':' + String(Math.round(total % 60)).padStart(2, '0') + ' of sound, from ' + root + ' → ' + path.relative(ROOT, dst));
for (const k of [...new Set(rows.map((r) => r.kind))]) console.log('  ' + k + ': ' + rows.filter((r) => r.kind === k).length);
