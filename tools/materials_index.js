#!/usr/bin/env node
// tools/materials_index.js — THE FUND'S INDEX for the composer score and the engine: every mastered material in the keep folder, one row
// each — name · file · seconds · channels · sr · kind · note — written to bank/materials.json. PLAN 1a.7 step 1 (RUNNING_LOG §103).
// AND THE PEAKS (PLAN 1a.8 step 2, 2026-11-09): a rough waveform per material — PEAK_BINS values 0 … 255 (the loudest sample of each
// slice of the file, every channel) — written to bank/materials_peaks.json for the drawer and the brick. The samples are read once
// per file and cached by size + mtime: a run after one new master costs that file alone. `--no-peaks` skips them.
//
//   node tools/materials_index.js [--root H:/switch_2026/audio/set-2025-04-08c/keep] [--no-peaks]
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
        let pos = 12, channels = 0, sr = 0, bits = 0, dataBytes = 0, dataOffset = 0, fmt = 1;
        const size = fs.fstatSync(fd).size;
        while (pos + 8 <= size) {
            const ch = Buffer.alloc(8); fs.readSync(fd, ch, 0, 8, pos);
            const id = ch.toString('ascii', 0, 4), len = ch.readUInt32LE(4);
            if (id === 'fmt ') {
                const f = Buffer.alloc(Math.min(len, 40)); fs.readSync(fd, f, 0, f.length, pos + 8);
                fmt = f.readUInt16LE(0); channels = f.readUInt16LE(2); sr = f.readUInt32LE(4); bits = f.readUInt16LE(14);
                if (fmt === 0xFFFE && f.length >= 26) fmt = f.readUInt16LE(24);   // WAVE_FORMAT_EXTENSIBLE: the sub-format's first word says PCM (1) or float (3)
            }
            if (id === 'data') { dataBytes = len === 0xFFFFFFFF ? size - pos - 8 : len; dataOffset = pos + 8; break; }
            pos += 8 + len + (len % 2);
        }
        if (!channels || !sr || !bits) return null;
        return { channels, sr, bits, fmt, dataOffset, dataBytes, size, seconds: Math.round(dataBytes / (channels * bits / 8) / sr * 100) / 100 };
    } finally { fs.closeSync(fd); }
}

// THE PEAKS of one file: PEAK_BINS slices, each the loudest absolute sample of every channel in it, 0 … 255. Read in 4 MB pieces.
const PEAK_BINS = 1200;
function wavPeaks(file, info) {
    const bps = info.bits / 8, frameBytes = bps * info.channels, frames = Math.floor(info.dataBytes / frameBytes);
    if (frames < 1) return null;
    const out = new Array(PEAK_BINS).fill(0), perBin = frames / PEAK_BINS;
    const fd = fs.openSync(file, 'r');
    try {
        const CH = Math.floor(4 * 1024 * 1024 / frameBytes) * frameBytes, buf = Buffer.alloc(CH);
        let frame = 0, bytePos = info.dataOffset, left = frames * frameBytes;
        while (left > 0) {
            const n = fs.readSync(fd, buf, 0, Math.min(CH, left), bytePos); if (n <= 0) break;
            const nf = Math.floor(n / frameBytes);
            for (let i = 0; i < nf; i++, frame++) {
                let peak = 0;
                for (let c = 0; c < info.channels; c++) {
                    const o = i * frameBytes + c * bps; let v;
                    if (info.bits === 16) v = buf.readInt16LE(o) / 32768;
                    else if (info.bits === 24) v = ((buf[o] | (buf[o + 1] << 8) | (buf[o + 2] << 16)) << 8 >> 8) / 8388608;
                    else if (info.bits === 32) v = info.fmt === 3 ? buf.readFloatLE(o) : buf.readInt32LE(o) / 2147483648;
                    else if (info.bits === 8) v = (buf[o] - 128) / 128;
                    else v = 0;
                    if (v < 0) v = -v; if (v > peak) peak = v;
                }
                const b = Math.min(PEAK_BINS - 1, Math.floor(frame / perBin));
                if (peak > out[b]) out[b] = peak;
            }
            bytePos += n; left -= n;
        }
    } finally { fs.closeSync(fd); }
    return out.map((v) => Math.min(255, Math.round(v * 255)));
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

const rows = [], infos = {};
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
        infos[rel] = { info, p, mtimeMs: st.mtimeMs };
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

// ---- THE PEAKS (PLAN 1a.8 step 2): bank/materials_peaks.json — { schema, bins, peaks: { name: { size, mtimeMs, p: [0 … 255 × bins] } } }
if (!args.includes('--no-peaks')) {
    const pk = path.join(ROOT, 'bank', 'materials_peaks.json');
    let old = {}; try { old = JSON.parse(fs.readFileSync(pk, 'utf8')); } catch (e) { old = {}; }
    const peaks = {}, t0 = Date.now(); let fresh = 0, kept = 0;
    for (const r of rows) {
        const x = infos[r.file], prev = old.peaks && old.peaks[r.name];
        if (prev && old.bins === PEAK_BINS && prev.size === x.info.size && Math.abs(prev.mtimeMs - x.mtimeMs) < 1 && Array.isArray(prev.p) && prev.p.length === PEAK_BINS) { peaks[r.name] = prev; kept++; continue; }
        const p = wavPeaks(x.p, x.info);
        if (!p) { console.warn('no peaks for', r.file); continue; }
        peaks[r.name] = { size: x.info.size, mtimeMs: x.mtimeMs, p }; fresh++;
        process.stdout.write('.');
    }
    if (fresh) process.stdout.write('\n');
    fs.writeFileSync(pk, JSON.stringify({ schema: 1, _what: 'THE PEAKS — a rough waveform per material of bank/materials.json (tools/materials_index.js): ' + PEAK_BINS + ' slices of the file, each the loudest sample 0 … 255. For the drawer and the brick; cached by size + mtime.', bins: PEAK_BINS, written: new Date().toISOString(), peaks }) + '\n');
    console.log('peaks: ' + fresh + ' read, ' + kept + ' kept from the cache, ' + Math.round((Date.now() - t0) / 100) / 10 + ' s → ' + path.relative(ROOT, pk));
}
