#!/usr/bin/env node
// part_meter.js — PLAY ONE PART SOLO THROUGH THE RACK AND READ ITS LEVELS (his word 2026-11-10, RUNNING_LOG §137: "play thru each part solo and
// compare velocities against recorded levels"). For each lane in a window of a save: its notes, as they would sound (velAbs, else the played
// velocity), sent to the lane's own port and channel by tools/part_meter.ps1 (winmm), while tools/part_meter.lua samples the receiving
// track's peak in Reaper every tick; each note's peak is read in its own window and the peaks are gathered BY WRITTEN MARK — so one part's
// ff can be set beside another's. Nothing in the save or the rack is changed; the engine is not involved (the rack's tracks alone).
//
//   node tools/part_meter.js --score <name> --from 195 --to 253 [--lanes flute,clarinet,…] [--lead 1] [--tail 0.4]
//   → the table on stdout; the raw series and per-note peaks in probes/part_meter/<score>-<lane>.json
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 && process.argv[i + 1] != null && !String(process.argv[i + 1]).startsWith('--') ? process.argv[i + 1] : d; };
const die = (m) => { console.error(m); process.exit(2); };
const MARKS = ['ppp', 'pp', 'p', 'mp', 'mf', 'f', 'ff', 'fff'];
const INSTRUMENTS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
const TRACKS = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'score', 'public', 'composer.html'), 'utf8').match(/const TRACKS = (\[[\s\S]*?\]);/)[1], {});
const BRIDGE = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA, 'REAPER', 'bridge');
const name = arg('score') || die('--score'), from = +arg('from', 0), to = +arg('to', 1e9), LEAD = +arg('lead', 1), TAIL = +arg('tail', 0.4);
const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'scores', name + '.json'), 'utf8'));
const lanesArg = arg('lanes') ? String(arg('lanes')).split(',') : null;
const dB = (a) => (a > 0 ? Math.round(20 * Math.log10(a) * 10) / 10 : -150);
const lua = (v) => { if (Array.isArray(v)) return '{' + v.map(lua).join(',') + '}'; if (v && typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => k + '=' + lua(x)).join(',') + '}'; if (typeof v === 'string') return JSON.stringify(v); return String(v); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const outDir = path.join(ROOT, 'probes', 'part_meter'); fs.mkdirSync(outDir, { recursive: true });

async function meter(lane) {
    const t = TRACKS[lane], inst = INSTRUMENTS[t.instKey];
    const notes = s.objects.filter((o) => o.type === 'waveCurve' && o.sonifyNote != null && o.layer === lane && o.startSeconds >= from && o.startSeconds <= to).sort((a, b) => a.startSeconds - b.startSeconds);
    if (!notes.length) return null;
    const byTech = {}; for (const n of notes) (byTech[n.technique] = byTech[n.technique] || []).push(n);
    const techKey = Object.keys(byTech).sort((a, b) => byTech[b].length - byTech[a].length)[0], tech = inst.techniques.find((q) => q.key === techKey) || inst.techniques[0];
    const port = tech.port || inst.port, ch = (tech.channel || 1) - 1, t0 = notes[0].startSeconds, span = notes[notes.length - 1].endSeconds - t0;
    const ev = [[0, 0xB0 | ch, 7, 127]];
    if (tech.cc0 != null) ev.push([0, 0xB0 | ch, 0, tech.cc0]);
    // --isolate <gap>: the notes one at a time, `gap` seconds apart (each held its own length, cut under the gap) — in a dense passage at its own
    // tempo every note's window catches its neighbours' peaks and all marks read alike (the first run, §137); isolated, each peak is its own
    const ISO = +arg('isolate', 0);
    const sched = notes.map((n, i) => { const vel = Math.max(1, Math.min(127, Math.round(n.velAbs != null ? n.velAbs : (n.recVel != null ? n.recVel : (n.nodes[0].y / 10) * 127)))); const a = ISO ? LEAD + i * ISO : LEAD + (n.startSeconds - t0), d = ISO ? Math.min(Math.max(0.05, n.endSeconds - n.startSeconds), ISO - 0.3) : Math.max(0.05, n.endSeconds - n.startSeconds); ev.push([a, 0x90 | ch, n.sonifyNote, vel], [a + d, 0x80 | ch, n.sonifyNote, 0]); return { id: n.id, t: a, d, midi: n.sonifyNote, vel, level: n.nodes[0].y / 10, mark: MARKS[Math.max(0, Math.min(7, Math.round(n.nodes[0].y / 10 * 7)))] }; });
    const spanIso = ISO ? sched[sched.length - 1].t - LEAD + ISO : span;
    ev.sort((a, b) => a[0] - b[0] || (a[1] & 0xF0) - (b[1] & 0xF0));
    const schedFile = path.join(outDir, name + '-' + t.instKey + '.events.json'); fs.writeFileSync(schedFile, JSON.stringify({ events: ev }));
    // the watch, then the player
    const seriesFile = path.join(BRIDGE, 'outbox', 'part_meter.json'); try { fs.unlinkSync(seriesFile); } catch (e) {}
    const secs = Math.ceil(LEAD + spanIso + TAIL + 2);
    const luaBody = 'CFG = ' + lua({ port, channel: ch + 1, seconds: secs }) + '\n' + fs.readFileSync(path.join(__dirname, 'part_meter.lua'), 'utf8');
    const tmp = path.join(require('os').tmpdir(), 'part_meter_' + process.pid + '.lua'); fs.writeFileSync(tmp, luaBody);
    const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmp], { encoding: 'utf8' }); try { fs.unlinkSync(tmp); } catch (e) {}
    let job; try { job = JSON.parse(r.stdout).result; } catch (e) { die('the bridge did not answer for ' + t.label + ': ' + (r.stdout || r.stderr).slice(0, 300)); }
    if (!job || !job.ok) die('the watch did not start for ' + t.label + ': ' + JSON.stringify(job || r.stdout).slice(0, 300));
    const tStart = Date.now();
    const p = cp.spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'part_meter.ps1'), '-Port', port, '-Schedule', schedFile], { encoding: 'utf8' });
    const playedSaid = (p.stdout || '').trim();
    for (let w = 0; w < (secs + 10) * 1000 && !fs.existsSync(seriesFile); w += 250) await sleep(250);
    if (!fs.existsSync(seriesFile)) die('the watch wrote nothing for ' + t.label);
    const series = JSON.parse(fs.readFileSync(seriesFile, 'utf8'));
    const rows = series.rows;   // [t, L, R]
    // align: the first sound in the series against the first note's time
    const firstSound = rows.find((x) => Math.max(x[1], x[2]) > 0.003);
    const off = firstSound ? firstSound[0] - sched[0].t : 0;
    const peaks = sched.map((n) => { const a = n.t + off - 0.05, b = n.t + off + (ISO ? Math.min(n.d + TAIL, ISO - 0.08) : n.d + TAIL); let m = 0; for (const x of rows) { if (x[0] < a) continue; if (x[0] > b) break; const v = Math.max(x[1], x[2]); if (v > m) m = v; } return Object.assign({}, n, { peakDb: dB(m) }); });
    const byMark = {}; for (const q of peaks) (byMark[q.mark] = byMark[q.mark] || []).push(q.peakDb);
    const mean = (a) => Math.round(a.reduce((x, y) => x + y, 0) / a.length * 10) / 10;
    const summary = {}; for (const [m, a] of Object.entries(byMark)) summary[m] = { n: a.length, meanDb: mean(a), minDb: Math.min(...a), maxDb: Math.max(...a) };
    fs.writeFileSync(path.join(outDir, name + '-' + t.instKey + '.json'), JSON.stringify({ lane, instKey: t.instKey, track: series.track, port, channel: ch + 1, technique: tech.key, from, to, offsetS: off, played: playedSaid, notes: peaks, byMark: summary, series: rows }, null, 0));
    return { lane: t.label, instKey: t.instKey, track: series.track, technique: tech.key, notes: peaks.length, byMark: summary, offsetS: Math.round(off * 1000) / 1000, played: playedSaid };
}

(async () => {
    const lanes = TRACKS.map((t, i) => i).filter((i) => !TRACKS[i].elec && (!lanesArg || lanesArg.includes(TRACKS[i].instKey) || lanesArg.includes(TRACKS[i].id)));
    const results = [];
    for (const l of lanes) { const r = await meter(l); if (r) { results.push(r); console.log(r.lane.padEnd(11) + ' ' + r.track.padEnd(22) + ' ' + r.technique.padEnd(16) + ' ' + r.notes + ' notes · offset ' + r.offsetS + ' s · ' + MARKS.filter((m) => r.byMark[m]).map((m) => m + ' ' + r.byMark[m].meanDb + ' dB (' + r.byMark[m].n + ')').join(' · ')); } }
    fs.writeFileSync(path.join(outDir, name + '-summary.json'), JSON.stringify({ when: new Date().toISOString(), score: name, from, to, results }, null, 1));
    console.log('written: probes/part_meter/' + name + '-*.json');
})();
