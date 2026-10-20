#!/usr/bin/env node
// drone_vet.js — THE VETTING OF THE ICY STAGE under the drone section's own numbers (PLAN.md § 1.7, 15.1; his doubt, DEC-51; the
// stutter of SWEEP_LIST #12). Two measurements, each one run, each a table for the lab journal:
//
//   node tools/drone_vet.js pulse [--src bank/samples/bcl-mp-1.wav | --synth] [--len 20] [--keep]
//       15.1 (a) THE PULSE PER WINDOW, offline — safe beside his engine (no server, no port, no sound). The stage renders 20 s of
//       the source for each grain window (Hann · 3-stage linear · expodec) at each grain size (0.6 · 0.15 · 1.2 s), 17 overlaps,
//       rand 0.2, pace 1/30, from 0, looping (tools/vet/drone_vet_render.scd); HIS ORIGINAL `\icy` (github.com/elosine/freeze,
//       freeze.scd) is rendered beside each on the same input and dials. Then, on each file: the level every 2 ms over the steady
//       part (2 … 18 s) in dB, the slow trend (±100 ms) taken out, and
//           depth    the modulation depth at 10 ms — the 5th … 95th percentile spread of what is left, in dB
//           r(T)     how periodic it is at the GRAIN PERIOD T = size ÷ overlaps (the autocorrelation; 1 = a strict pulse at T)
//           best     the strongest period in 20 … 400 ms, and its r — is the pulse at the grain rate, or somewhere else
//           flutter  the same spread measured on 40 ms peaks (the scale of a "stutter" to the ear), the trend ±200 ms
//       Not pass/fail by itself: expodec pulses by nature; the verdict is THE PORT AGAINST HIS ORIGINAL (the same input, the same
//       dials, measured alike — a difference over 1.5 dB on any row is the port's) and the numbers per window, for the record.
//       --synth renders a STEADY tone made here instead of a banked sound (a multiphonic beats by nature and hides the stage's own pulse);
//       the table also measures the source itself. --keep leaves the scratch renders on disk (printed).
//
//   node tools/drone_vet.js five [--go] [--mark mp]
//       15.1 (b) FIVE AT ONCE ON HIS LIVING ENGINE — IT SOUNDS; only with --go, and only after it is announced to him. Five 20 s
//       drones from the bank (the `dr` renders of audition-drones, one per player) are played through the engine: first each ALONE
//       for 4 s at the mark (the levelling: the five should sit within ±3 dB of each other on ELEC RETURN), then THE FIVE TOGETHER
//       for 20 s, the sound server's /status read once a second (CPU average and peak, the synth count) and ELEC RETURN's meter at
//       25 Hz through the Reaper bridge (tools/vet/peak_watch.lua's shape). The verdict: CPU under 30 % · no dip more than 6 dB
//       under the running maximum while the five sound · the solos within ±3 dB. Without --go it says what it would play and stops.
//
// THE SORTING: this tool knows the piece (its bank, its route table, its rack) — the piece's. The stage it measures is the engine's.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process'), dgram = require('dgram');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const cmd = process.argv[2];
const SCLANG = process.env.SCLANG || 'C:/Program Files/SuperCollider-3.14.1/sclang.exe';
const dB = (v) => (v > 0 ? Math.round(20 * Math.log10(v) * 10) / 10 : -150);
const r1 = (x) => Math.round(x * 10) / 10, r2 = (x) => Math.round(x * 100) / 100;

// ---- a WAV, mono, as floats (int16 · int24 · int32 · float32) ------------------------------------------------------------
function readWav(f) {
    const b = fs.readFileSync(f);
    let p = 12, fmt = null, data = null;
    while (p + 8 <= b.length) {
        const id = b.toString('ascii', p, p + 4), sz = b.readUInt32LE(p + 4);
        if (id === 'fmt ') fmt = { tag: b.readUInt16LE(p + 8), ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22) };
        if (id === 'data') { data = { off: p + 8, len: Math.min(sz, b.length - p - 8) }; break; }
        p += 8 + sz + (sz & 1);
    }
    if (!fmt || !data) throw new Error('not a plain WAV: ' + f);
    const { ch, sr, bits, tag } = fmt, bps = bits / 8, frames = Math.floor(data.len / (bps * ch));
    const out = new Float32Array(frames);
    for (let i = 0; i < frames; i++) {
        let m = 0;
        for (let c = 0; c < ch; c++) {
            const o = data.off + (i * ch + c) * bps, v = (tag === 3 || (bits === 32 && tag !== 1)) ? b.readFloatLE(o) : bits === 16 ? b.readInt16LE(o) / 32768 : bits === 24 ? (((b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)) << 8) >> 8) / 8388608 : b.readInt32LE(o) / 2147483648;
            if (Math.abs(v) > Math.abs(m)) m = v;
        }
        out[i] = m;
    }
    return { sr, frames, data: out };
}

// ---- the measure: the level every stepMs, detrended, its spread and its periodicity ---------------------------------------
const pct = (a, q) => { const s = Float64Array.from(a).sort(); return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]; };
function envelope(w, stepMs, fromS, toS, kind) {
    const step = Math.max(1, Math.round(w.sr * stepMs / 1000)), a = Math.floor(fromS * w.sr), z = Math.min(w.frames, Math.floor(toS * w.sr)), out = [];
    for (let s = a; s + step <= z; s += step) {
        let acc = 0;
        if (kind === 'peak') { for (let i = s; i < s + step; i++) { const v = Math.abs(w.data[i]); if (v > acc) acc = v; } }
        else { for (let i = s; i < s + step; i++) acc += w.data[i] * w.data[i]; acc = Math.sqrt(acc / step); }
        out.push(acc > 1e-7 ? 20 * Math.log10(acc) : -140);
    }
    return out;
}
function detrend(e, half) {   // the slow trend: a centred moving average over ±half blocks, taken out
    const n = e.length, out = new Float64Array(n), pre = new Float64Array(n + 1);
    for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + e[i];
    for (let i = 0; i < n; i++) { const a = Math.max(0, i - half), z = Math.min(n, i + half + 1); out[i] = e[i] - (pre[z] - pre[a]) / (z - a); }
    return out;
}
function autocorr(x, lag) {
    const n = x.length - lag; let num = 0, d1 = 0, d2 = 0;
    for (let i = 0; i < n; i++) { num += x[i] * x[i + lag]; d1 += x[i] * x[i]; d2 += x[i + lag] * x[i + lag]; }
    return d1 > 0 && d2 > 0 ? num / Math.sqrt(d1 * d2) : 0;
}
function pulseOf(file, periodMs, fromS, toS) {
    const w = readWav(file);
    const peak = w.data.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
    const e2 = envelope(w, 10, fromS, toS, 'rms'), res2 = detrend(e2, 10);          // 10 ms RMS (above any waveform period down to 100 Hz — a 2 ms step read the waveform itself), the trend ±100 ms
    const depth = pct(res2, 0.95) - pct(res2, 0.05);
    const lagT = Math.max(1, Math.round(periodMs / 10)), rT = autocorr(res2, lagT);
    let best = { lagMs: 0, r: -2 };
    for (let L = 2; L <= 40; L++) { const r = autocorr(res2, L); if (r > best.r) best = { lagMs: L * 10, r }; }   // 20 … 400 ms
    const e40 = envelope(w, 40, fromS, toS, 'peak'), res40 = detrend(e40, 5);        // 40 ms peaks, the trend ±200 ms
    const flutter = pct(res40, 0.95) - pct(res40, 0.05);
    const e500 = envelope(w, 500, fromS, toS, 'rms');                                  // the slow shape itself: how far the drone wanders
    return { peakDb: dB(peak), depth: r2(depth), rT: r2(rT), periodMs: r1(periodMs), bestLagMs: best.lagMs, bestR: r2(best.r), flutter: r2(flutter), wander: r1(Math.max(...e500) - Math.min(...e500)), lengthS: r1(w.frames / w.sr) };
}

// ---- 15.1 (a) --------------------------------------------------------------------------------------------------------------
function synthSource(file) {   // 4 s · 44100 Hz · 16-bit: 200 Hz with three partials, 20 ms fades, peak −14 dB — as steady as a source can be
    const sr = 44100, n = sr * 4, b = Buffer.alloc(44 + n * 2);
    b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVE', 8); b.write('fmt ', 12); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
    for (let i = 0; i < n; i++) { const t = i / sr, f = Math.min(1, t / 0.02, (4 - t) / 0.02); const v = 0.2 * f * (Math.sin(2 * Math.PI * 200 * t) + 0.5 * Math.sin(2 * Math.PI * 400 * t + 1) + 0.25 * Math.sin(2 * Math.PI * 600 * t + 2) + 0.125 * Math.sin(2 * Math.PI * 800 * t + 3)) / 1.875; b.writeInt16LE(Math.round(v * 32767), 44 + i * 2); }
    fs.writeFileSync(file, b);
    return file;
}
function pulse() {
    const out = path.join(os.tmpdir(), 'le_drone_vet_' + Date.now()), lenS = +arg('len', 20);
    fs.mkdirSync(out, { recursive: true });
    // --synth: a STEADY source made here (four partials on 200 Hz, 4 s, no beating), so a pulse measured on its render is the stage's own — a
    // multiphonic beats by nature (bcl-mp-1: its own 6 … 8 ms period showed in every render, the stage's and his original's alike)
    const src = flag('synth') ? synthSource(path.join(out, 'synth-src.wav')) : path.resolve(ROOT, arg('src', 'bank/samples/bcl-mp-1.wav'));
    if (!fs.existsSync(src)) { console.error('no such source: ' + src); process.exit(2); }
    const WINS = [['hann', 0, '-'], ['3stage', 1, 'gEnv_3stageLinear.aif'], ['expodec', 4, 'gEnv_expodec.aif']], SIZES = [0.6, 0.15, 1.2], OV = 17, SPEED = 1 / 30, OV2 = 33;
    const rows = [], orig = [], tok = (x) => String(x).replace('.', '');   // a name is a FILE name: the bank's safeName drops a dot
    for (const [wn, env, envFile] of WINS) for (const sz of SIZES) {
        rows.push(['p-' + wn + '-' + tok(sz), sz, OV, env, r2(SPEED * 10000) / 10000].join(':'));
        orig.push(['o-' + wn + '-' + tok(sz), sz, OV, envFile, r2(SPEED * 10000) / 10000].join(':'));
    }
    for (const [wn, env] of WINS) rows.push(['p-' + wn + '-06-ov' + OV2, 0.6, OV2, env, r2(SPEED * 10000) / 10000].join(':'));   // the top of his overlaps band, 0.6 s: what more grains do to the pulse
    console.log('THE PULSE PER WINDOW — ' + path.relative(ROOT, src).replace(/\\/g, '/') + ' · ' + lenS + ' s a render · overlaps ' + OV + ' · rand 0.2 · pace 1/30 · from 0, looping · ' + (rows.length + orig.length) + ' renders offline (the stage, and his original beside each) …');
    const t0 = Date.now();
    const r = cp.spawnSync(SCLANG, [path.join(ROOT, 'tools', 'vet', 'drone_vet_render.scd')], {
        env: Object.assign({}, process.env, { LE_VET_SRC: src, LE_VET_OUT: out, LE_VET_ROWS: rows.join('|'), LE_VET_ORIG: orig.join('|'), LE_VET_LEN: String(lenS) }),
        encoding: 'utf8', timeout: 900000, maxBuffer: 64 * 1024 * 1024,
    });
    const text = (r.stdout || '') + (r.stderr || '');
    const files = text.split('\n').filter((l) => l.startsWith('FILE ')).map((l) => { const m = l.match(/^FILE (\S+) (.+\.wav) ([\d.]+) ms peak ([-\d.]+) dB/); return m && { name: m[1], file: m[2], lengthMs: +m[3], peakDb: +m[4] }; }).filter(Boolean);
    if (!/DRONE_VET_RENDER DONE/.test(text) || !files.length) { console.error(text.split('\n').filter((l) => /FAIL|ERROR|DRONE_VET/.test(l)).join('\n') || text.slice(-3000)); console.error('the renders did not all come: nothing measured'); process.exit(1); }
    console.log(files.length + ' renders in ' + Math.round((Date.now() - t0) / 1000) + ' s. The measure — the steady part 2 … ' + (lenS - 2) + ' s of each:');
    const pad = (s, n) => String(s).padEnd(n), num = (s, n) => String(s).padStart(n);
    console.log(pad('render', 18) + num('size', 5) + num('T ms', 7) + num('peak', 7) + num('depth', 7) + num('r(T)', 6) + num('best', 7) + num('r', 6) + num('flutter', 9) + num('wander', 8) + '   what');
    const table = [];
    for (const [wn, env] of WINS) for (const sz of SIZES) for (const who of ['p', 'o']) {
        const f = files.find((x) => x.name === who + '-' + wn + '-' + tok(sz));
        if (!f) continue;
        const m = pulseOf(f.file, sz * 1000 / OV, 2, lenS - 2);
        const what = who === 'p' ? 'the stage (' + wn + ')' : 'his original (' + wn + ')';
        table.push(Object.assign({ name: f.name, window: wn, sizeS: sz, who: who === 'p' ? 'stage' : 'original' }, m));
        console.log(pad(f.name, 18) + num(sz, 5) + num(m.periodMs, 7) + num(m.peakDb, 7) + num(m.depth, 7) + num(m.rT, 6) + num(m.bestLagMs, 7) + num(m.bestR, 6) + num(m.flutter, 9) + num(m.wander, 8) + '   ' + what);
    }
    { const w = readWav(src), L = w.frames / w.sr, m = pulseOf(src, 35.3, L * 0.2, L * 0.8); console.log(pad('THE SOURCE itself', 18) + num('', 5) + num('', 7) + num(m.peakDb, 7) + num(m.depth, 7) + num('', 6) + num(m.bestLagMs, 7) + num(m.bestR, 6) + num(m.flutter, 9) + num(m.wander, 8) + '   its own middle ' + r1(L * 0.2) + ' … ' + r1(L * 0.8) + ' s, unstretched — what the drones inherit'); }
    for (const [wn] of WINS) { const f = files.find((x) => x.name === 'p-' + wn + '-06-ov' + OV2); if (!f) continue; const m = pulseOf(f.file, 600 / OV2, 2, lenS - 2); table.push(Object.assign({ name: f.name, window: wn, sizeS: 0.6, who: 'stage', overlaps: OV2 }, m)); console.log(pad(f.name, 18) + num(0.6, 5) + num(m.periodMs, 7) + num(m.peakDb, 7) + num(m.depth, 7) + num(m.rT, 6) + num(m.bestLagMs, 7) + num(m.bestR, 6) + num(m.flutter, 9) + num(m.wander, 8) + '   the stage (' + wn + ') at ' + OV2 + ' overlaps'); }
    console.log('depth · flutter · wander in dB (5th … 95th percentile of the detrended level; wander = the 500 ms level\'s whole range). T = the grain period, size ÷ overlaps. best = the strongest period found in 20 … 400 ms (the shortest lag winning with r near 1 = no period stands out: the flutter is noise-like, not a pulse at the grain rate).');
    // the port against his original: the same input, the same dials — a difference over 1.5 dB in flutter or depth on any row is the port's
    const diffs = [];
    for (const row of table.filter((x) => x.who === 'stage' && !x.overlaps)) { const o = table.find((x) => x.who === 'original' && x.window === row.window && x.sizeS === row.sizeS); if (o) diffs.push({ name: row.name, dFlutter: r2(row.flutter - o.flutter), dDepth: r2(row.depth - o.depth) }); }
    const worst = diffs.reduce((m, d) => Math.max(m, Math.abs(d.dFlutter), Math.abs(d.dDepth)), 0);
    console.log('THE PORT AGAINST HIS ORIGINAL: the largest difference on any row ' + r2(worst) + ' dB (' + diffs.map((d) => d.name + ' ' + (d.dFlutter >= 0 ? '+' : '') + d.dFlutter).join(' · ') + ') — ' + (worst <= 1.5 ? 'the same instrument' : 'THEY DIFFER'));
    fs.writeFileSync(path.join(out, 'pulse.json'), JSON.stringify({ src: path.relative(ROOT, src), lenS, overlaps: OV, rand: 0.2, speed: SPEED, table }, null, 1));
    console.log((flag('keep') ? 'the renders and pulse.json are kept in ' : 'the table is in ') + out + (flag('keep') ? '' : ' (the renders deleted)'));
    if (!flag('keep')) for (const f of fs.readdirSync(out)) if (f !== 'pulse.json') { try { if (fs.statSync(path.join(out, f)).isDirectory()) fs.rmSync(path.join(out, f), { recursive: true, force: true }); else fs.unlinkSync(path.join(out, f)); } catch (e) { /* a lock: left */ } }
}

// ---- 15.1 (b) --------------------------------------------------------------------------------------------------------------
async function five() {
    const osc = require(path.join(ROOT, 'electronics', 'tools', 'osc.js'));
    const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8')), M = CFG.message || { host: '127.0.0.1', port: 57211 };
    const INDEX = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'samples', 'index.json'), 'utf8')).samples || [];
    const MARK = arg('mark', 'mp'), SOLO_S = 4, TOGETHER_S = 20;
    const picks = [];
    for (const p of CFG.players) {
        const rows = INDEX.filter((r) => r.player === p.name && /~dr\d+-tail$/.test(r.name) && r.lengthMs > 15000 && fs.existsSync(path.join(ROOT, 'bank', 'samples', r.file))).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        if (rows.length) picks.push(rows[0]);
    }
    if (picks.length < 5) { console.error('fewer than five 20 s drone renders in the bank (one per player; the dr rows of audition-drones): ' + picks.map((r) => r.name).join(', ')); process.exit(4); }
    const plan = 'each alone ' + SOLO_S + ' s at ' + MARK + ' — ' + picks.map((r) => r.name + ' (' + r.player + ', ' + Math.round(r.lengthMs) + ' ms, ' + r.loudDb + ' LUFS)').join(' · ') + ' — then the five together ' + TOGETHER_S + ' s';
    if (!flag('go')) { console.log('FIVE AT ONCE — would play on his engine, IT SOUNDS: ' + plan + '. Run with --go after it is announced.'); return; }
    const hello = await osc.send({ host: M.host, port: M.port, address: '/le/hello', args: ['from', 'drone_vet.js'], waitMs: 600 });
    if (!hello) { console.error('his engine does not answer on ' + M.host + ':' + M.port + ' — nothing played'); process.exit(5); }
    // the meter watch through the bridge: peak_watch.lua's shape, long enough for the whole run
    const total = picks.length * (SOLO_S + 1) + TOGETHER_S + 4;
    const lua = fs.readFileSync(path.join(ROOT, 'tools', 'vet', 'peak_watch.lua'), 'utf8').replace(/WATCH_S, STEP_S = \(job\.args and job\.args\.track\) or 'ELEC RETURN', [\d.]+, 0\.04/, "WATCH_S, STEP_S = 'ELEC RETURN', " + total + ", 0.04");
    const tmpLua = path.join(os.tmpdir(), 'le_peak_watch_' + Date.now() + '.lua');
    fs.writeFileSync(tmpLua, lua);
    const B = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'REAPER', 'bridge');
    const outFile = path.join(B, 'outbox', 'peak_watch.json');
    try { fs.unlinkSync(outFile); } catch (e) { /* none */ }
    const job = cp.spawnSync('node', [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmpLua], { encoding: 'utf8' });
    let jobOk = false; try { jobOk = JSON.parse(job.stdout).ok; } catch (e) { jobOk = false; }
    const tWatch = Date.now();
    if (!jobOk) console.log('NOTE: the meter watch did not start (' + (job.stdout || job.stderr || '').trim().slice(0, 200) + ') — the /status figures still come');
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const status = [], sock = dgram.createSocket('udp4');
    const pad = (b) => Buffer.concat([b, Buffer.alloc(4 - (b.length % 4))]), smsg = Buffer.concat([pad(Buffer.from('/status')), pad(Buffer.from(','))]);
    sock.on('message', (buf) => {
        let i = 0; const str = () => { const e = buf.indexOf(0, i); const s = buf.toString('utf8', i, e); i = e + 1; i = (i + 3) & ~3; return s; };
        str(); const tags = str().slice(1), v = [];
        for (const t of tags) { if (t === 'i') { v.push(buf.readInt32BE(i)); i += 4; } else if (t === 'f') { v.push(buf.readFloatBE(i)); i += 4; } else if (t === 'd') { v.push(buf.readDoubleBE(i)); i += 8; } }
        status.push({ at: (Date.now() - tWatch) / 1000, synths: v[2], cpuAvg: v[5], cpuPeak: v[6] });
    });
    const poll = setInterval(() => sock.send(smsg, 57210, '127.0.0.1'), 1000);
    const play = (r, id) => osc.send({ host: M.host, port: M.port, address: '/le/play', args: osc.pairs({ name: r.name, id, lane: r.lane == null ? -1 : r.lane, t: 0, dueMs: 300, dyn: 'mark:' + MARK }) });
    const marks = [];
    console.log('FIVE AT ONCE on his engine — ' + plan);
    await sleep(1000);
    for (let k = 0; k < picks.length; k++) {   // each alone
        const at = (Date.now() - tWatch) / 1000 + 0.3;
        await play(picks[k], 'vet-solo-' + (k + 1)); marks.push({ what: picks[k].name, from: at, to: at + SOLO_S });
        await sleep(SOLO_S * 1000 + 1000);
    }
    const together = (Date.now() - tWatch) / 1000 + 0.3;
    for (let k = 0; k < picks.length; k++) await play(picks[k], 'vet-five-' + (k + 1));
    await sleep(TOGETHER_S * 1000 + 1500);
    clearInterval(poll); sock.close();
    for (const r of picks) await osc.send({ host: M.host, port: M.port, address: '/le/hello', args: ['from', 'drone_vet.js'], waitMs: 100 });   // nothing to stop: a sample ends by itself
    // the meter
    let series = null;
    for (let k = 0; k < 40 && !series; k++) { if (fs.existsSync(outFile)) { try { series = JSON.parse(fs.readFileSync(outFile, 'utf8')).series; } catch (e) { series = null; } } if (!series) await sleep(250); }
    const within = (a, b) => (series || []).filter(([t]) => t >= a && t <= b).map(([, v]) => v);
    const mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN);
    const solos = marks.map((m) => ({ name: m.what, meanDb: r1(mean(within(m.from + 0.8, m.to - 0.2).filter((v) => v > -140))) }));
    const tog = within(together + 2, together + TOGETHER_S - 0.5);
    let runMax = -150, dips = 0, worst = 0;
    for (const v of tog) { if (v > runMax) runMax = v; const d = runMax - v; if (d > worst) worst = d; if (d > 6) dips++; }
    const st = status.filter((s) => s.at >= together && s.at <= together + TOGETHER_S);
    const cpuAvg = r1(Math.max(...st.map((s) => s.cpuAvg), 0)), cpuPeak = r1(Math.max(...st.map((s) => s.cpuPeak), 0)), synths = Math.max(...st.map((s) => s.synths), 0);
    console.log('THE SOLOS at ' + MARK + ' (ELEC RETURN, the mean of each 4 s): ' + solos.map((s) => s.name + ' ' + s.meanDb + ' dB').join(' · '));
    const lv = solos.map((s) => s.meanDb).filter((v) => Number.isFinite(v)), spread = lv.length ? r1(Math.max(...lv) - Math.min(...lv)) : NaN;
    console.log('  spread ' + spread + ' dB' + (spread <= 6 ? ' — within ±3 dB: the mark levels them' : ' — WIDER than ±3 dB'));
    console.log('THE FIVE TOGETHER, ' + TOGETHER_S + ' s: CPU average up to ' + cpuAvg + ' % · peak ' + cpuPeak + ' % · synths up to ' + synths + ' (' + st.length + ' readings)');
    console.log('  the meter: ' + tog.length + ' readings · max ' + r1(runMax) + ' dB · the worst dip under the running maximum ' + r1(worst) + ' dB · ' + dips + ' readings more than 6 dB under' + (dips === 0 ? ' — no dip' : ' — DIPS'));
    console.log('VERDICT: ' + [cpuAvg < 30 ? 'CPU under 30 %' : 'CPU ' + cpuAvg + ' % — OVER 30', dips === 0 ? 'no dip' : dips + ' dips', spread <= 6 ? 'levelled' : 'not levelled'].join(' · '));
    if (!series) console.log('NOTE: no meter series came back from the bridge (' + outFile + ') — the solos and the dips are unmeasured; the /status figures stand');
}

if (cmd === 'pulse') pulse();
else if (cmd === 'five') five().catch((e) => { console.error(e.message); process.exit(1); });
else { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 27).join('\n')); process.exit(cmd ? 2 : 0); }
