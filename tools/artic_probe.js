#!/usr/bin/env node
// artic_probe.js — DOES THIS ARTICULATION SOUND, AND HOW? A sequence of isolated items into one port (tools/part_meter.ps1), the receiving track's
// peak sampled in Reaper (tools/part_meter.lua); per item its peak and the level at a few moments after the onset — a sustaining voice holds,
// a plucked or struck one decays, a dead preset reads nothing. His questions 2026-11-10 (RUNNING_LOG §142): "tongue ram and jet whistle sound
// the same?" · "pizz not working".
//
//   node tools/artic_probe.js --port SWViolin --channel 1 --items "cc0=69 note=69 ; cc0=5 note=69 ; ks=36 note=67 ch=5" [--dur 1.5] [--gap 2.5]
//     an item: key=value pairs — note (MIDI, required) · cc0 (sent 150 ms before) · ks (a keyswitch note, 150 ms before, released with the note)
//              · ch (the item's channel, 1 … 16; else --channel) · vel (100) · dur (seconds; else --dur) · label
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const die = (m) => { console.error(m); process.exit(2); };
const BRIDGE = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA, 'REAPER', 'bridge');
const port = arg('port') || die('--port'), CH = +arg('channel', 1) - 1, DUR = +arg('dur', 1.5), GAP = +arg('gap', 2.5), LEAD = 1;
const items = String(arg('items') || die('--items')).split(';').map((q, i) => { const o = { label: 'item ' + (i + 1) }; for (const kv of q.trim().split(/\s+/)) { const [k, v] = kv.split('='); if (k) o[k] = isNaN(+v) ? v : +v; } if (o.note == null) die('an item needs note='); return o; });
const dB = (a) => (a > 0 ? Math.round(20 * Math.log10(a) * 10) / 10 : -150);
const lua = (v) => { if (Array.isArray(v)) return '{' + v.map(lua).join(',') + '}'; if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => k + '=' + lua(x)).join(',') + '}'; if (typeof v === 'string') return JSON.stringify(v); return String(v); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
    const ev = []; let t = LEAD;
    for (const it of items) {
        const ch = it.ch != null ? it.ch - 1 : CH, dur = it.dur != null ? it.dur : DUR, vel = it.vel != null ? it.vel : 100;
        const lead = it.lead != null ? it.lead : 0.15;   // lead= : how far before the note the CC0 / keyswitch goes (0 = the same instant, the drawer's audition)
        ev.push([t - 0.3, 0xB0 | ch, 7, 127]);
        if (it.cc0 != null) ev.push([t - lead, 0xB0 | ch, 0, it.cc0]);
        if (it.ks != null) ev.push([t - lead, 0x90 | ch, it.ks, 100]);
        ev.push([t, 0x90 | ch, it.note, vel], [t + dur, 0x80 | ch, it.note, 0]);
        if (it.ks != null) ev.push([t + dur + 0.05, 0x80 | ch, it.ks, 0]);
        it.t = t; it.ch = ch + 1; it.dur = dur; t += GAP;
    }
    ev.sort((a, b) => a[0] - b[0]);
    const secs = Math.ceil(t + 1.5);
    const schedFile = path.join(os.tmpdir(), 'artic_probe.events.json'); fs.writeFileSync(schedFile, JSON.stringify({ events: ev }));
    const seriesFile = path.join(BRIDGE, 'outbox', 'part_meter.json'); try { fs.unlinkSync(seriesFile); } catch (e) {}
    const body = 'CFG = ' + lua({ port, channel: 0, seconds: secs }) + '\n' + fs.readFileSync(path.join(__dirname, 'part_meter.lua'), 'utf8');
    const tmp = path.join(os.tmpdir(), 'artic_probe_' + process.pid + '.lua'); fs.writeFileSync(tmp, body);
    const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmp], { encoding: 'utf8' }); try { fs.unlinkSync(tmp); } catch (e) {}
    let job; try { job = JSON.parse(r.stdout).result; } catch (e) { die('the bridge did not answer: ' + (r.stdout || r.stderr).slice(0, 300)); }
    if (!job || !job.ok) die('the watch did not start: ' + JSON.stringify(job || r.stdout).slice(0, 300));
    const p = cp.spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'part_meter.ps1'), '-Port', port, '-Schedule', schedFile], { encoding: 'utf8' });
    for (let w = 0; w < (secs + 10) * 1000 && !fs.existsSync(seriesFile); w += 250) await sleep(250);
    if (!fs.existsSync(seriesFile)) die('the watch wrote nothing');
    const S = JSON.parse(fs.readFileSync(seriesFile, 'utf8')), rows = S.rows;
    const first = rows.find((x) => Math.max(x[1], x[2]) > 0.002), off = first ? first[0] - items[0].t : 0;
    const at = (tt) => { let m = 0; for (const x of rows) { if (x[0] < tt - 0.06) continue; if (x[0] > tt + 0.06) break; const v = Math.max(x[1], x[2]); if (v > m) m = v; } return dB(m); };
    const peakIn = (a, b) => { let m = 0; for (const x of rows) { if (x[0] < a) continue; if (x[0] > b) break; const v = Math.max(x[1], x[2]); if (v > m) m = v; } return dB(m); };
    console.log(S.track + ' on ' + port + ' · ' + (p.stdout || '').trim() + ' · aligned by ' + Math.round(off * 1000) + ' ms');
    console.log('item'.padEnd(34) + 'peak     +0.1s   +0.3s   +0.6s   +1.0s   +1.4s   verdict');
    for (const it of items) {
        const o = it.t + off, pk = peakIn(o - 0.05, o + it.dur + 0.4), L = [0.1, 0.3, 0.6, 1.0, 1.4].map((d) => at(o + d));
        const verdict = pk < -60 ? 'SILENT' : (L[4] < L[0] - 12 ? 'decays (plucked / struck)' : (L[4] > L[0] - 3 ? 'sustains' : 'fades'));
        const lab = (it.label + ' ' + Object.entries(it).filter(([k]) => ['cc0', 'ks', 'ch', 'note'].includes(k)).map(([k, v]) => k + '=' + v).join(' ')).slice(0, 33);
        console.log(lab.padEnd(34) + String(pk).padStart(6) + '  ' + L.map((x) => String(x).padStart(6)).join('  ') + '   ' + verdict);
        it.peakDb = pk; it.levels = L; it.verdict = verdict;
    }
    const outDir = path.join(ROOT, 'probes', 'artic_probe'); fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, port + '-' + Date.now() + '.json'), JSON.stringify({ port, track: S.track, items, offsetS: off, series: rows }));
})();
