#!/usr/bin/env node
// elec.js — the live electronics in THIS rack: the route, its proof, the engine's start (PLAN 1.1 · 6.1; RUNNING_LOG §51).
//
//   node tools/elec.js probe      # LOOK, change nothing: is ReaRoute there, is Reaper on ASIO, what is routed — and what is missing
//   node tools/elec.js route      # make the sends and the ELEC RETURN track, through the bridge (then he re-saves the rack)
//   node tools/elec.js unroute    # take them out again
//   node tools/elec.js check      # 6.1's PROOF: one note into the rack -> heard by the engine -> heard back on ELEC RETURN
//   node tools/elec.js check --rack-only   # the rack's half alone, no engine: the note reaches the player's track
//   node tools/elec.js latency    # the round trip rack -> engine -> rack, measured (eight clicks, audible, quiet)
//   node tools/elec.js meters     # one note, and what the meters showed: the player, ELEC RETURN, the master — nothing started or stopped
//   node tools/elec.js start      # the engine up and listening — what start_electronics.bat runs
//   node tools/elec.js selftest   # the engine's own test, no hardware, no sound
//   node tools/elec.js bus        # THE BUS (the master: high-pass · low-pass · the glue · the limiter): its dials shown; with words — bus glue=off lpf=6000 — moved on the LIVING engine, by a message
//   node tools/elec.js calibrate --venue <name> --sine-bleed   # THE SINE'S BLEED (16.1 e): NO ONE PLAYS — per player the room in the band at their sine's pitch, then the sine alone at fff in it; written to the venue (roomBandDb · sineBleedDb). The tool's own engine (his must be down); IT SOUNDS  [--score beating-section | --pitches bcl=63,bfl=76] [--player bcl] [--dry]
//   node tools/elec.js calibrate --venue <name>   # THE SOUND CHECK (11.7 b): each player one mf on cue; the engine reads it and the venue's trims are written — the tool's own engine (his must be down)  [--seconds 6] [--mark mf] [--player bcl] [--sim: the rack plays the notes; it SOUNDS] [--dry]
//   node tools/elec.js tone       # the house's line-up tone from the LIVING engine: 1 kHz at −18 dBFS for 10 s, past the bus — it SOUNDS  [--seconds N] [--db -18] [--hz 1000]
//   node tools/elec.js env        # LOOK ONLY: what the engine is started with (the players, the bank, the crop, the rolls, the ladder, the bus, the venue)
//   node tools/elec.js ping       # is the engine there? one /le/hello — starts nothing, safe beside his engine window  [--via 5500: through the score server]
//   node tools/elec.js message    # 6.2's PROOF: the engine up for 20 s; a message, the note after it, and whatever the composer score sends  [--via <port>] [--seconds N] [--quiet]
//   node tools/elec.js object     # 6.3 … 6.5's PROOF, on a SCRATCH bank (the piece's is not touched): an opening, the note into the rack, the crop, the index; the sample returned and seen on ELEC RETURN; then whatever the composer score sends until the time is up  [--via <port>] [--seconds N] [--name bcl-A] [--listen: skip the tool's own part, keep the scratch bank]
//   node tools/elec.js croptest     # THE CROP, one of each kind (bank/crop_test.json) through the rack on a SCRATCH bank with the tool's own engine (his must be down): the raw window, the attack found, the sample kept — numbers and pictures on http://localhost:5500/crop_test/report.html; the piece's bank is not touched  [--only <kind>]
//
// WHAT IS THE PIECE'S AND WHAT IS THE ENGINE'S (CLAUDE.md § THE SORTING): this file, bank/elec_route.json and the bridge job
// reaper/bridge/jobs/elec_route.lua know THIS rack — its track names, its port. The SuperCollider code and its runner
// (electronics/sc/ · electronics/tools/sc.js) know no piece.
// THE SIGNAL: the composer score -> MIDI -> the player's track in Reaper -> a hardware send -> ReaRoute -> the engine
// (SuperCollider) -> its master -> ReaRoute -> the track ELEC RETURN -> the master he hears. Live, the first three become
// a microphone and the last two a PA; the engine between them is the same.
// THE MESSAGES (6.2; RUNNING_LOG §60): the composer score's page -> POST /api/elec on the score server -> OSC over UDP -> the engine's
// LANGUAGE port (57211; bank/elec_route.json "message"). Live, the page is on a tablet; the road is the same.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const sc = require(path.join(ROOT, 'electronics', 'tools', 'sc.js'));
const osc = require(path.join(ROOT, 'electronics', 'tools', 'osc.js'));
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const BRIDGE = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'REAPER', 'bridge');
const SCD = (name) => path.join(sc.SC_DIR, name);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const flagValue = (flags, name) => (flags.includes(name) ? flags[flags.indexOf(name) + 1] : null);

// what the engine is STARTED with, from this piece's route table (bank/elec_route.json): its players · the bank's folder ·
// the crop's rule where this piece overrides the engine's defaults · a route check's echo. The engine takes these at its
// start and never from a message (RUNNING_LOG §62).
const MODES = {   // §71 (2026-10-05): which bank FILLS the buffers at start · where captures are WRITTEN · whether an opening records
    'compose':        { load: 'samples', write: 'samples', record: true,  what: 'the samples recorded here from the rack; an opening records (the latest take wins)' },
    'compose-locked': { load: 'samples', write: 'samples', record: false, what: 'the samples as they are; an opening changes nothing' },
    'rehearsal':      { load: 'backup',  write: 'backup',  record: true,  what: 'the players record the BACKUP bank' },
    'concert':        { load: 'backup',  write: 'live',    record: true,  what: 'buffers full from the backup; a live capture replaces one only when it caught a sound; the captures kept in a dated folder' },
};
function modeOf() {
    const m = CFG.mode || 'compose';
    if (!MODES[m]) throw new Error('unknown mode "' + m + '" in bank/elec_route.json — one of ' + Object.keys(MODES).join(' · '));
    return Object.assign({ name: m }, MODES[m]);
}
function bankDirs() {
    const B = CFG.bank || {}, day = new Date().toISOString().slice(0, 10);
    const abs = (d) => path.resolve(ROOT, d).split(path.sep).join('/');
    return { samples: abs(B.dir || 'bank/samples'), backup: abs(CFG.backupDir || 'bank/backup'), live: abs((CFG.liveDir || 'bank/live') + '/' + day) };
}
function modeLine() {
    const m = modeOf(), d = bankDirs();
    return 'MODE       ' + m.name + ' — ' + m.what + '\n           buffers from ' + path.relative(ROOT, d[m.load]) + ' · captures to ' + path.relative(ROOT, d[m.write]) + ' · openings ' + (m.record ? 'record' : 'do NOT record');
}
// the bus's dials, the piece's words -> the engine's: { hpfHz, lpfHz, glue: { on, thresholdDb, ratio, kneeDb, attackMs, releaseMs, makeupDb }, ceilingDb, lookaheadMs, releaseMs }
function masterFlat(M) {
    const o = {}, G = (M && M.glue) || {}, num = (k, v) => { if (typeof v === 'number' && Number.isFinite(v)) o[k] = v; };
    if (!M) return o;
    num('hpfHz', M.hpfHz); num('lpfHz', M.lpfHz);
    if (G.on != null) o.glueOn = G.on ? 1 : 0;
    num('glueThr', G.thresholdDb); num('glueRatio', G.ratio); num('glueKnee', G.kneeDb); num('glueAtkMs', G.attackMs); num('glueRelMs', G.releaseMs); num('glueGainDb', G.makeupDb);
    num('ceilingDb', M.ceilingDb); num('lookaheadMs', M.lookaheadMs); num('limRelMs', M.releaseMs);
    return o;
}
// `bus`: the words he types -> the engine's dials (a filter at 0 = off; glue on | off)
const BUS_WORDS = { hpf: 'hpfHz', lpf: 'lpfHz', glue: 'glueOn', threshold: 'glueThr', ratio: 'glueRatio', knee: 'glueKnee', attack: 'glueAtkMs', release: 'glueRelMs', makeup: 'glueGainDb', ceiling: 'ceilingDb', limrelease: 'limRelMs' };
// THE HOUSE (PLAN 1.4 · 11.7): a venue's numbers for each microphone — bank/venue/<name>.json { players: { bcl: { trimDb, hpfHz, eq: [{ hz, db, q }] } } }.
// Which venue: --venue <name> on the command line, else bank/elec_route.json "venue"; none = every microphone flat (the simulation).
function venueOf() {
    const i = process.argv.indexOf('--venue'), name = i > 0 ? process.argv[i + 1] : (CFG.venue || '');
    if (!name) return null;
    const file = path.join(ROOT, 'bank', 'venue', name + '.json');
    if (!fs.existsSync(file)) throw new Error('no such venue: bank/venue/' + name + '.json  (copy bank/venue/_template.json to begin one)');
    return { name, file, doc: JSON.parse(fs.readFileSync(file, 'utf8')) };
}
// name=<n>;bcl:trimDb=-2.5:hpfHz=90:eq1=250/-3/1,bfl:…  — what electronics/sc/boot.scd takeSpecs reads
function venueSpec(V) {
    const ps = (V.doc && V.doc.players) || {}, num = (x) => typeof x === 'number' && Number.isFinite(x);
    const one = (who) => {
        const p = ps[who] || {}, f = [who];
        if (num(p.trimDb)) f.push('trimDb=' + p.trimDb);
        if (num(p.hpfHz) && p.hpfHz > 0) f.push('hpfHz=' + p.hpfHz);
        (Array.isArray(p.eq) ? p.eq : []).slice(0, 2).forEach((e, k) => { if (e && num(e.hz) && num(e.db)) f.push('eq' + (k + 1) + '=' + e.hz + '/' + e.db + '/' + (num(e.q) ? e.q : 1)); });
        // PLAN 1.8 · 16.1 e: what the tracker reads of a hall (electronics/sc/track.scd trackThr · trackGuard) — the room in the player's band and the sine's bleed
        // into it (calibrate --sine-bleed), a broadband room figure where one was written by hand, and whether this microphone's trim was calibrated
        for (const k of ['roomBandDb', 'roomDb', 'sineBleedDb']) if (num(p[k])) f.push(k + '=' + p[k]);
        if (V.doc.calibrated && num(p.trimDb)) f.push('cal=1');
        return f.join(':');
    };
    return 'name=' + String(V.name).replace(/[^A-Za-z0-9_-]/g, '') + ';' + CFG.players.map((p) => one(p.name)).join(',');
}
function engineEnv() {
    const B = CFG.bank || {}, m = modeOf(), dirs = bankDirs();
    const crop = Object.entries(B.crop || {}).filter(([k, v]) => !k.startsWith('_') && typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
    const env = { LE_PLAYERS: CFG.players.map((p) => p.name + ':' + (p.engineIn - 1)).join(','), LE_SOURCE: dirs[m.load], LE_BANK: dirs[m.write], LE_RECORD: m.record ? '1' : '0' };
    fs.mkdirSync(env.LE_SOURCE, { recursive: true }); fs.mkdirSync(env.LE_BANK, { recursive: true });
    if (crop) env.LE_CROP = crop;
    // PLAN 15.2 a (the drone section): THE REGIONS of a capture — where it sounds (bank/elec_route.json bank.regions; the engine's names, bank.scd regionsDefaults)
    const regions = Object.entries(B.regions || {}).filter(([k, v]) => !k.startsWith('_') && typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
    if (regions) env.LE_REGIONS = regions;
    // REMOTE (RUNNING_LOG §209): `start --remote` — the engine on a Windows device (bank/elec_route.json `remote`: inDevice · outDevice; the
    // Windows default by MME when absent) instead of ReaRoute, so Chrome Remote Desktop carries its sound with Reaper's on WASAPI.
    // The microphones are gone with ReaRoute: an opening captures nothing; the bank and the renders play.
    if (process.argv.includes('--remote')) {
        const R = CFG.remote || {};
        env.LE_MODE = 'remote';
        env.LE_RECORD = '0';   // THE GUARD (RUNNING_LOG §212): in this mode the engine's inputs are the WINDOWS input, not the rack — an opening must change nothing (the bank is not in git, D18)
        if (R.inDevice) env.LE_DEVICE_IN = R.inDevice;
        if (R.outDevice) env.LE_DEVICE_OUT = R.outDevice;
    }
    // §78: the return behaviour's dials (bank/elec_route.json return.ar, lettered A · B · C) flattened to the engine's names (sc/bank.scd arDefaults)
    const ar = (CFG.return && CFG.return.ar) || {}, arB = ar.B_rangesMs || {}, arC = ar.C_miss || {}, flat = Object.assign({}, ar.A_shares || {});
    for (const k of ['after', 'before', 'lazy', 'far', 'unison']) if (Array.isArray(arB[k])) { flat[k + 'Lo'] = arB[k][0]; flat[k + 'Hi'] = arB[k][1]; }   // far: the fifth tier (DEC-30)
    if (arB.skew != null) flat.skew = arB.skew;
    if (arC.rate != null) flat.missRate = arC.rate; if (arC.lateShare != null) flat.missLateShare = arC.lateShare;
    if (Array.isArray(arC.lateMs)) { flat.missLateLo = arC.lateMs[0]; flat.missLateHi = arC.lateMs[1]; } if (Array.isArray(arC.earlyMs)) { flat.missEarlyLo = arC.earlyMs[0]; flat.missEarlyHi = arC.earlyMs[1]; }
    const arSpec = Object.entries(flat).filter(([k, v]) => typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
    if (arSpec) env.LE_AR = arSpec;
    const ch = (CFG.return && CFG.return.chain) || {}, chFlat = Object.assign({}, ch.G_shares || {});   // §82: the chain's dials G · H · I
    if (ch.H_follow != null) chFlat.follow = ch.H_follow;
    if (ch.I_order != null) chFlat.shuffle = ch.I_order === 'shuffled' ? 1 : 0;
    const chSpec = Object.entries(chFlat).filter(([k, v]) => typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
    if (chSpec) env.LE_CHAIN = chSpec;
    // PLAN 10.14: THE PETALS LIVE (bank/elec_route.json return.live) — on · windowMs, the engine's own names (electronics/sc/petals_live.scd liveDefaults)
    const lvLive = Object.entries((CFG.return && CFG.return.live) || {}).filter(([k, v]) => !k.startsWith('_') && typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
    if (lvLive) env.LE_LIVE = lvLive;
    // PLAN 1.8 · 16.1: THE TRACKER (bank/elec_route.json sine.track) — the engine's own names (electronics/sc/track.scd trackDefaults); ear sim | mic goes as earSim 1 | 0
    const trk = Object.assign({}, (CFG.sine && CFG.sine.track) || {});
    if (trk.ear === 'sim' || trk.ear === 'mic') trk.earSim = trk.ear === 'sim' ? 1 : 0;
    const trSpec = Object.entries(trk).filter(([k, v]) => !k.startsWith('_') && typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
    if (trSpec) env.LE_TRACK = trSpec;
    // PLAN 1.4 · 11.2: THE LADDER OF MARKS (bank/elec_route.json level) — reference = the LUFS of the electronics' fff, the step, the lift's cap, the floor;
    // driveRef (11.4) and bleedDb (11.7) ride with it. Flat numbers, the engine's own names (electronics/sc/level.scd levelDefaults).
    const lvSpec = Object.entries(CFG.level || {}).filter(([k, v]) => !k.startsWith('_') && typeof v === 'number').map(([k, v]) => k + '=' + v).join(',');
    if (lvSpec) env.LE_LEVEL = lvSpec;
    // PLAN 1.4 · 11.6: THE BUS's dials (bank/elec_route.json master) flattened to the engine's names (electronics/sc/boot.scd masterDefaults)
    const msSpec = Object.entries(masterFlat(CFG.master)).map(([k, v]) => k + '=' + v).join(',');
    if (msSpec) env.LE_MASTER = msSpec;
    // PLAN 1.4 · 11.7: the venue's input chains, and — in a concert — a bled capture refused (the backup stands in)
    const V = venueOf();
    if (V) env.LE_VENUE = venueSpec(V);
    if (m.name === 'concert') env.LE_REFUSE_BLEED = '1';
    if (CFG.listenEchoSeconds > 0) env.LE_ECHO = String(CFG.listenEchoSeconds);
    return env;
}

// a tool's engine put down GRACEFULLY: /le/leave makes the language quit its server (the device closed properly) and exit; the kill is only
// the fallback. §71: a run ended with taskkill left ReaRoute's client side wedged — every later boot hung at its first sync until Reaper restarted.
async function stopEngine(run) {
    const M = CFG.message || {};
    try { await osc.send({ host: M.host, port: M.port, address: '/le/leave', args: [] }); } catch (e) { /* no ear: the kill below */ }
    const r = await Promise.race([run.done, sleep(8000).then(() => null)]);
    if (r == null) { run.kill(); await run.done; }
}

// one message to a score server's relay (POST /api/elec) — the road a page's message takes; null when nothing answers
function post(port, obj) {
    return new Promise((resolve) => {
        const body = JSON.stringify(obj);
        const req = http.request({ host: '127.0.0.1', port: +port, path: '/api/elec', method: 'POST', timeout: 3000,
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res) => {
            let s = ''; res.on('data', (d) => { s += d; }); res.on('end', () => { try { resolve(JSON.parse(s)); } catch (e) { resolve(null); } });
        });
        req.on('error', () => resolve(null)); req.on('timeout', () => { req.destroy(); resolve(null); });
        req.end(body);
    });
}

// a JS value as a Lua literal
function lua(v) {
    if (v == null) return 'nil';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (typeof v === 'string') return '"' + v.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    if (Array.isArray(v)) return '{ ' + v.map(lua).join(', ') + ' }';
    return '{ ' + Object.entries(v).map(([k, x]) => k + ' = ' + lua(x)).join(', ') + ' }';
}

// the bridge job in one of its modes; returns what the job returned
function job(mode, extra = {}) {
    const cfg = { mode, players: CFG.players.map((p) => ({ name: p.name, track: p.track, tracks: p.tracks || [p.track], engineIn: p.engineIn })),
        returnTrack: CFG.return.track, engineOut: CFG.return.engineOut, loopIn: CFG.latencyLoop.engineIn, ...extra };
    const body = 'CFG = ' + lua(cfg) + '\n' + fs.readFileSync(path.join(ROOT, 'reaper', 'bridge', 'jobs', 'elec_route.lua'), 'utf8');
    const tmp = path.join(os.tmpdir(), 'elec_route_' + process.pid + '_' + mode + '.lua');
    fs.writeFileSync(tmp, body);
    const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmp], { encoding: 'utf8' });
    try { fs.unlinkSync(tmp); } catch (e) {}
    if (r.status !== 0 && !r.stdout) throw new Error('the bridge did not answer — is Reaper running with decibel_rack open? ' + (r.stderr || '').trim());
    const out = JSON.parse(r.stdout);
    if (!out.ok) throw new Error('the job failed: ' + out.error);
    return out.result;
}

// (never asked while an engine is up: listing the ASIO devices loads each driver, ReaRoute among them, beside a live client)
async function engineSeesReaRoute() {
    if (sc.engineUp()) return { asio: ['not asked — the engine is running'], reaRoute: true, engineUp: true };
    const r = await sc.start(SCD('devices.scd'), { timeoutS: 60, boots: false }).done;
    return r.results[0] || { asio: [], reaRoute: false };
}

function routed(d) {
    return d.ret.found && d.players.every((p) => p.found && p.hardwareSends.some((s) => /rearoute/i.test(s.to)));
}

// what stands between here and a sounding route, in his words, in order
function missing(d, dev) {
    const m = [];
    if (!dev.reaRoute) m.push('ReaRoute is not installed. Close Reaper, run Reaper\'s installer again (the same version, ' +
        'reaper.com/download), tick "ReaRoute ASIO driver" in its list of components, finish, start Reaper.');
    if (d.audio.system !== 'ASIO') m.push('Reaper\'s audio system is ' + d.audio.system + '. ReaRoute needs ASIO: Options > Preferences > ' +
        'Audio > Device > Audio system: ASIO, ASIO driver: UMC ASIO Driver (this machine has used it before).');
    if (dev.reaRoute && d.audio.system === 'ASIO' && !d.reaRoute) m.push('ReaRoute is installed but Reaper shows none of its channels — ' +
        'restart Reaper; if they are still missing, tell the AI what Preferences > Audio > Device shows.');
    if (d.reaRoute && !routed(d)) m.push('The route is not in the rack yet:  node tools/elec.js route  (then CTRL+S in Reaper).');
    return m;
}

function show(d, dev) {
    console.log('Reaper     audio system ' + d.audio.system + ' · ' + d.audio.srate + ' Hz · block ' + d.audio.block + ' · ' + d.audio.out);
    console.log('ReaRoute   in Reaper: ' + (d.reaRoute ? 'yes' : 'NO') + (dev ? ' · seen by SuperCollider: ' + (dev.reaRoute ? 'yes' : 'NO') + '  (it sees: ' + (dev.asio.join(' | ') || 'no ASIO device') + ')' : ''));
    for (const p of d.players) {
        const s = p.hardwareSends.map((x) => x.to + ' (' + (x.mono ? 'mono' : 'stereo') + ', ' + x.dB + ' dB' + (x.sendmode === 0 ? ', post-fader' : ', sendmode ' + x.sendmode) + ')').join(' · ');
        console.log('player     ' + p.name + ' = ' + p.track + (p.found ? ' · fader ' + p.faderDb + ' dB · sends to hardware: ' + (s || 'none') : ' · NO SUCH TRACK'));
    }
    const r = d.ret;
    console.log('return     ' + r.track + (r.found ? ' · track ' + r.index + ' · input ' + r.input + (r.stereo ? ' (stereo)' : '') + ' · monitor ' + r.monitor +
        ' · recmode ' + r.recmode + ' · ' + r.faderDb + ' dB · ' + r.fx + ' effects' : ' · not in the rack'));
    if (d.did) for (const x of d.did) console.log('did        ' + x);
    if (d.error) console.log('REFUSED    ' + d.error);
}

function note(p) {
    const r = cp.spawnSync('powershell', ['-NoProfile', '-File', path.join(ROOT, 'tools', 'note_to_port.ps1'), '-Port', p.port, '-Note', String(p.testNote), '-Vel', '90', '-Ms', '1500'], { encoding: 'utf8' });
    return (r.stdout || '').trim();
}

async function readPeaks(waitMs) {
    const f = path.join(BRIDGE, 'outbox', 'elec_peaks.json');
    for (let t = 0; t < waitMs; t += 200) { if (fs.existsSync(f)) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) {} } await sleep(200); }
    throw new Error('the meter watch wrote nothing');
}

(async () => {
    const cmd = process.argv[2], flags = process.argv.slice(3);
    if (!cmd || cmd === '-h') { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 15).join('\n')); return; }

    if (cmd === 'selftest') { const r = await sc.start(SCD('selftest.scd'), { timeoutS: 90, onLine: (l) => { if (/^LE_/.test(l)) console.log(l); } }).done; process.exit(r.code); }

    if (cmd === 'start') {
        console.log(modeLine());
        if (process.argv.includes('--remote')) console.log('REMOTE     the engine on a Windows device, not ReaRoute — Reaper on WASAPI; OPENINGS DO NOT RECORD here, whatever the MODE line says (the Windows input is not the rack: the bank is safe); the bank and the renders play. docs/REMOTE_LISTENING.md');
        { const V = venueOf(); console.log('VENUE      ' + (V ? V.name + ' — bank/venue/' + V.name + '.json: each microphone\'s trim, high-pass and EQ' : 'none — every microphone flat (the simulation)')); }
        const p = sc.start(SCD('session.scd'), { timeoutS: 86400, env: engineEnv(), onLine: (l) => {
            const m = /^LE_RESULT\s+(.*)$/.exec(l);   // a tool's line, not his: nothing is shown. A route check's pairing (an onset with its sound) is kept; a capture's row is in the bank's index
            if (m) { try { const o = JSON.parse(m[1]); if (o.msg === 'onset') fs.appendFileSync(path.join(ROOT, 'probes', 'elec_message_log.jsonl'), JSON.stringify({ when: new Date().toISOString(), ...o }) + '\n'); } catch (e) {} return; }
            if (/^LE_/.test(l)) console.log(l.replace(/^LE_(INFO|READY)\s*/, '').replace(/^LE_ERROR\s*/, 'STOPPED: '));
        } });
        // the window closed (SIGHUP on Windows), CTRL+C, a kill: the engine's server goes WITH its window. Without this the
        // language dies and its server stays — holding the port and ReaRoute, reachable by nothing (RUNNING_LOG §64).
        for (const sig of ['SIGINT', 'SIGHUP', 'SIGTERM', 'SIGBREAK']) process.on(sig, () => { p.kill(); });
        const r = await p.done; process.exit(r.code == null ? 1 : r.code);
    }

    if (cmd === 'probe') {
        const d = job('probe'), dev = await engineSeesReaRoute();
        show(d, dev);
        if (dev.engineUp) console.log('engine     RUNNING (a scsynth on UDP ' + sc.PORT + ') — left alone');
        const m = missing(d, dev);
        console.log(m.length ? '\nMISSING, in order:\n' + m.map((x, i) => '  ' + (i + 1) + '. ' + x).join('\n') : '\nNothing is missing: the route is in the rack.  node tools/elec.js check');
        process.exit(m.length ? 2 : 0);
    }

    if (cmd === 'route' || cmd === 'unroute') {
        const d = job(cmd === 'route' ? 'apply' : 'remove');
        show(d);
        if (!d.error) console.log('\nThe rack is changed and NOT saved — CTRL+S in Reaper is his. (One undo point: "Electronics route".)');
        process.exit(d.error ? 2 : 0);
    }

    // one note, and what the rack's meters showed — with whatever is running left as it is (the engine up or not)
    if (cmd === 'meters') {
        const p0 = CFG.players[0];
        job('watch', { seconds: 7 });
        console.log('note       ' + note(p0));
        const pk = (await readPeaks(12000)).peakDb;
        for (const k of Object.keys(pk)) console.log('  ' + k.padEnd(20) + 'L ' + pk[k].L + '  R ' + pk[k].R + ' dB');
        process.exit(0);
    }

    if (cmd === 'check') {
        const rackOnly = flags.includes('--rack-only');
        const d = job('probe'), p0 = CFG.players[0];
        if (!rackOnly) {
            const dev = await engineSeesReaRoute(), m = missing(d, dev);
            if (m.length) { show(d, dev); console.log('\nMISSING, in order:\n' + m.map((x, i) => '  ' + (i + 1) + '. ' + x).join('\n')); process.exit(2); }
        }
        // TWO PASSES, the same note twice. Pass 1, the engine NOT running: the master holds the player alone — what he
        // hears of the note. Pass 2, the engine running: what it heard, what it sent, what came back.
        // (The track's own meter is NOT that reference: on this rack it reads BEFORE the fader — found 2026-10-04, when a
        // -26 dB track sat at -39 dB on the master, its fader at -13. The master and the engine's own meters are the truth.)
        const lr = (x) => 'L ' + x.L + '  R ' + x.R + ' dB';
        const mono = (x) => Math.round(200 * Math.log10((Math.pow(10, x.L / 20) + Math.pow(10, x.R / 20)) / 2)) / 10;   // what a mono fold of L and R peaks at, at most
        job('watch', { seconds: 7 });
        console.log('note       ' + note(p0) + '   (pass 1 — the player alone)');
        const alone = (await readPeaks(12000)).peakDb;
        const trackMeter = Math.max(alone[p0.track].L, alone[p0.track].R);
        console.log('\n  PASS 1 — the player alone\n    the track\'s own meter      ' + lr(alone[p0.track]) + '   (' + p0.track + ', before its fader)\n    at the master              ' + lr(alone.MASTER) + '   <- what he hears of the note');
        if (rackOnly) {
            const ok = trackMeter > -80;
            console.log('\n' + (ok ? 'THE RACK\'S HALF HOLDS: the note reaches the track.' : 'NOTHING on the track — is the port live, is the track armed?'));
            process.exit(ok ? 0 : 1);
        }
        const run = sc.start(SCD('check_route.scd'), { timeoutS: 90, env: { LE_SECONDS: '10', LE_IN: String(p0.engineIn - 1) } });
        try { console.log('\nengine     ' + (await run.waitFor(/^LE_READY/, 60000)).replace(/^LE_READY\s*/, '')); }
        catch (e) { const r = await run.done; console.log('STOPPED    ' + (r.errors.join(' · ') || e.message)); process.exit(r.code || 3); }
        job('watch', { seconds: 7 });
        console.log('note       ' + note(p0) + '   (pass 2 — with the engine)');
        const both = (await readPeaks(12000)).peakDb;
        const r2 = await run.done, eng = r2.results.find((x) => x.check === 'route');
        if (!eng) { console.log('STOPPED    ' + (r2.errors.join(' · ') || 'the engine gave no result')); process.exit(3); }
        const ret = both[CFG.return.track];
        console.log('\n  PASS 2 — the same note, the engine running\n    heard by the engine        ' + eng.inPeakDb + ' dB\n    sent by the engine         ' + eng.outPeakDb + ' dB' +
            '\n    back on ' + CFG.return.track + '        ' + (ret ? lr(ret) : 'no such track') + '\n    at the master              ' + lr(both.MASTER) + '   (the player and the return together)');
        const pass = trackMeter > -80 && eng.inPeakDb > -80 && !!ret && Math.max(ret.L, ret.R) > -80;
        const direct = mono(alone.MASTER), back = ret ? Math.max(ret.L, ret.R) : null;
        const gain = pass ? Math.round((back - direct) * 10) / 10 : null;
        console.log('\n' + (pass ? 'THE ROUTE HOLDS: the note is heard direct and again through the engine.\nIt comes back at ' + back + ' dB; direct, folded to mono, it is ' + direct + ' dB — ' + gain + ' dB apart.'
            : 'THE ROUTE IS BROKEN at the first line above that reads -150.'));
        fs.writeFileSync(path.join(ROOT, 'probes', 'elec_route_check.json'), JSON.stringify({ when: new Date().toISOString(), player: p0, reaper: d.audio,
            pass1: { trackMeter: alone[p0.track], master: alone.MASTER }, pass2: { engineInDb: eng.inPeakDb, engineOutDb: eng.outPeakDb, ret, master: both.MASTER },
            directMonoDb: direct, returnDb: back, returnMinusDirectDb: gain, engine: eng, pass }, null, 1) + '\n');
        process.exit(pass ? 0 : 1);
    }

    if (cmd === 'latency') {
        const d = job('probe'), dev = await engineSeesReaRoute(), m = missing(d, dev);
        if (m.length) { show(d, dev); console.log('\nMISSING, in order:\n' + m.map((x, i) => '  ' + (i + 1) + '. ' + x).join('\n')); process.exit(2); }
        let r;
        try {
            for (const x of job('loop_on').did) console.log('did        ' + x);
            r = await sc.start(SCD('latency.scd'), { timeoutS: 90, env: { LE_OUT: String(CFG.return.engineOut - 1), LE_IN: String(CFG.latencyLoop.engineIn - 1) } }).done;
        } finally { for (const x of job('loop_off').did) console.log('did        ' + x); }
        const res = r.results.find((x) => x.check === 'latency');
        if (!res || res.roundTripMs == null) { console.log('NO CLICK CAME BACK' + (r.errors.length ? ' — ' + r.errors.join(' · ') : '')); process.exit(1); }
        console.log('\n  the round trip engine -> Reaper -> engine: ' + res.roundTripMs + ' ms  (' + res.roundTripSamples + ' samples at ' + res.sr + ' Hz; ' + res.clicks + ' clicks, the median)');
        console.log('  Reaper\'s block is ' + d.audio.block + ' samples; the engine\'s is ' + res.block + '.');
        fs.writeFileSync(path.join(ROOT, 'probes', 'elec_latency.json'), JSON.stringify({ when: new Date().toISOString(), reaper: d.audio, ...res }, null, 1) + '\n');
        process.exit(0);
    }

    // IS THE ENGINE THERE? One /le/hello. It starts nothing and stops nothing — safe beside his own engine window.
    // --via <port>: the same question asked THROUGH a score server (5500 his · 5501 the throwaway), the road a page's message takes.
    if (cmd === 'env') { const E = engineEnv(); for (const k of Object.keys(E)) console.log(k.padEnd(16) + E[k]); return; }   // LOOK ONLY: what the engine is started with, from bank/elec_route.json (and --venue)

    if (cmd === 'calibrate') {   // PLAN 1.4 · 11.7 b: the sound check — the tool's own engine (sc.start refuses beside a living one)
        const V = venueOf();
        if (!V) { console.log('which venue?  --venue <name>   (bank/venue/<name>.json — copy bank/venue/_template.json to begin one)'); process.exit(2); }
        const secs = +(flagValue(flags, '--seconds') || 6), mark = flagValue(flags, '--mark') || 'mf', sim = flags.includes('--sim'), dry = flags.includes('--dry'), only = flagValue(flags, '--player');
        const players = CFG.players.filter((p) => !only || p.name === only);
        if (!players.length) { console.error('no such player: ' + only + ' — ' + CFG.players.map((p) => p.name).join(' · ')); process.exit(2); }
        const E = engineEnv(), env = { LE_PLAYERS: players.map((p) => p.name + ':' + (p.engineIn - 1)).join(','), LE_VENUE: venueSpec(V), LE_CAL_SECONDS: String(secs), LE_CAL_MARK: mark, LE_CAL_GAP: sim ? '2' : '4' };
        if (E.LE_LEVEL) env.LE_LEVEL = E.LE_LEVEL;
        if (!sim && process.env.LE_DEVICE) env.LE_MODE = 'live';
        // PLAN 1.8 · 16.1 e: THE SINE'S BLEED — with NO ONE PLAYING: for each player the room in the band at their sine's pitch, then the sine alone at fff in it.
        // The pitches: --pitches bcl=63,bfl=76,…  or the first sine brick on each player's lanes in --score (beating-section). IT SOUNDS (the sine, through the master).
        if (flags.includes('--sine-bleed')) {
            const pitches = {}, said = flagValue(flags, '--pitches');
            if (said) for (const kv of said.split(',')) { const b = kv.split('='); if (b.length === 2 && Number.isFinite(+b[1])) pitches[b[0]] = +b[1]; }
            else {
                const score = flagValue(flags, '--score') || 'beating-section', file = path.join(ROOT, 'scores', score + '.json');
                if (!fs.existsSync(file)) { console.error('no such score: scores/' + score + '.json — or say the pitches:  --pitches bcl=63,bfl=76,…'); process.exit(2); }
                const S = JSON.parse(fs.readFileSync(file, 'utf8')), INSTR = require('vm').runInNewContext(fs.readFileSync(path.join(ROOT, 'sandbox', 'instruments.js'), 'utf8') + '\n;INSTRUMENTS;', {});
                for (const z of (S.objects || []).filter((o) => o.type === 'zone' && o.midiModel === 'elecSine' && o.elec).sort((a, b) => a.startTime - b.startTime)) {
                    const port = String(((INSTR[((S.tracks || [])[z.layer] || {}).instKey] || {}).port) || '').toLowerCase();
                    const p = players.find((x) => (x.ports || [x.port]).some((q) => String(q || '').toLowerCase() === port));
                    if (p && pitches[p.name] == null && Number.isFinite(+z.elec.midi)) pitches[p.name] = +z.elec.midi;
                }
            }
            const who = players.filter((p) => pitches[p.name] != null);
            if (!who.length) { console.error('no pitch for any player — --pitches bcl=63,bfl=76,…'); process.exit(2); }
            env.LE_CAL_SINE = who.map((p) => p.name + ':' + pitches[p.name]).join(',');
            if (E.LE_TRACK) env.LE_TRACK = E.LE_TRACK;
            if (E.LE_MASTER) env.LE_MASTER = E.LE_MASTER;
            console.log('THE SINE\'S BLEED  venue ' + V.name + ' · ' + who.map((p) => p.name + ' at ' + pitches[p.name]).join(' · ') + ' · NO ONE PLAYS · the sine sounds at fff, 3 s a player' + (dry ? ' · dry: the file is not written' : ''));
            const read = [];
            const runB = sc.start(SCD('calibrate.scd'), { timeoutS: 60 + who.length * 12, env, onLine: (l) => {
                const m = /^LE_RESULT\s+(.*)$/.exec(l);
                if (m) { try { const o = JSON.parse(m[1]); if (o.msg === 'bleed') read.push(o); } catch (e) { /* not a line of ours */ } return; }
                if (/^LE_/.test(l)) console.log(l.replace(/^LE_(INFO|READY)\s*/, '').replace(/^LE_ERROR\s*/, 'STOPPED: '));
            } });
            await runB.done;
            if (!read.length) { console.log('NOTHING WAS READ — the venue\'s file is as it was.'); process.exit(1); }
            V.doc.players = V.doc.players || {};
            for (const o of read) V.doc.players[o.player] = Object.assign({ trimDb: 0, hpfHz: 0, eq: [] }, V.doc.players[o.player], { roomBandDb: o.roomBandDb, sineBleedDb: o.sineBleedDb, sineBleedMidi: o.midi });
            V.doc.sineBleed = { when: new Date().toISOString(), readings: read };
            console.log(read.map((o) => '  ' + o.player.padEnd(5) + ' the room in its band ' + o.roomBandDb + ' dB · the sine in it ' + o.sineBleedDb + ' dB (' + Math.round((o.sineBleedDb - o.roomBandDb) * 10) / 10 + ' over)').join('\n'));
            if (dry) console.log('(dry — bank/venue/' + V.name + '.json not written)');
            else { fs.writeFileSync(V.file, JSON.stringify(V.doc, null, 2) + '\n'); console.log('written: bank/venue/' + V.name + '.json — used from the engine\'s next start: each microphone\'s threshold is its own room + the gate, and one that hears the sine too well follows nothing (said in the window)'); }
            return;
        }
        console.log('CALIBRATION  venue ' + V.name + ' · ' + players.map((p) => p.name).join(' · ') + ' · one ' + mark + ' each, ' + secs + ' s' + (sim ? ' · THE RACK PLAYS THE NOTES (it sounds)' : ' · the players play on the cue NOW') + (dry ? ' · dry: the file is not written' : ''));
        const got = [];
        const run = sc.start(SCD('calibrate.scd'), { timeoutS: 90 + players.length * (secs + 10), env, onLine: (l) => {
            const m = /^LE_RESULT\s+(.*)$/.exec(l);
            if (m) {
                try {
                    const o = JSON.parse(m[1]);
                    if (o.msg === 'calibrated') got.push(o);
                    if (o.msg === 'listen' && sim) { const p = players.find((x) => x.name === o.player); if (p) setTimeout(() => cp.spawn('powershell', ['-NoProfile', '-File', path.join(ROOT, 'tools', 'note_to_port.ps1'), '-Port', p.port, '-Note', String(p.testNote), '-Vel', '100', '-Ms', '1500'], { stdio: 'ignore' }), 500); }
                } catch (e) { /* not a line of ours */ }
                return;
            }
            if (/^LE_/.test(l)) console.log(l.replace(/^LE_(INFO|READY)\s*/, '').replace(/^LE_ERROR\s*/, 'STOPPED: '));
        } });
        await run.done;
        const heard = got.filter((o) => o.heard);
        if (!heard.length) { console.log('NOTHING WAS HEARD — the venue\'s file is as it was.'); process.exit(1); }
        V.doc.players = V.doc.players || {};
        for (const o of heard) V.doc.players[o.player] = Object.assign({ hpfHz: 0, eq: [] }, V.doc.players[o.player], { trimDb: o.trimDb });
        V.doc.calibrated = { when: new Date().toISOString(), mark, seconds: secs, simulated: sim, readings: got };
        console.log(heard.map((o) => '  ' + o.player.padEnd(5) + ' read ' + o.loudDb + ' LUFS (peak ' + o.peakDb + ' dB) · trim ' + o.hadTrimDb + ' → ' + o.trimDb + ' dB').join('\n'));
        if (got.length > heard.length) console.log('  not heard: ' + got.filter((o) => !o.heard).map((o) => o.player).join(' · ') + ' — their trims are as they were');
        if (dry) console.log('(dry — bank/venue/' + V.name + '.json not written)');
        else { fs.writeFileSync(V.file, JSON.stringify(V.doc, null, 2) + '\n'); console.log('written: bank/venue/' + V.name + '.json — used from the engine\'s next start' + (CFG.venue === V.name ? '' : '  (name it in bank/elec_route.json "venue", or start with --venue ' + V.name + ')')); }
        return;
    }

    if (cmd === 'tone') {   // PLAN 1.4 · 11.7 d: the house's line-up tone — from the LIVING engine, past its bus. IT SOUNDS.
        const M = CFG.message || {}, data = { seconds: +(flagValue(flags, '--seconds') || 10), db: +(flagValue(flags, '--db') || -18), hz: +(flagValue(flags, '--hz') || 1000) };
        const r = await osc.send({ host: M.host, port: M.port, address: '/le/hello', args: ['from', 'elec.js'], waitMs: 400 });
        if (!r) { console.log('THE ENGINE DID NOT ANSWER on UDP ' + (M.port || osc.PORT) + ' — no tone  (start_electronics.bat)'); process.exit(1); }
        await osc.send({ host: M.host, port: M.port, address: '/le/tone', args: osc.pairs(data) });
        console.log('the engine is asked for ' + data.hz + ' Hz at ' + data.db + ' dBFS on both outputs for ' + data.seconds + ' s — past its bus, as it is.');
        return;
    }

    if (cmd === 'bus') {   // PLAN 1.4 · 11.6: the bus's dials — shown, or moved on the LIVING engine (a message; nothing started, nothing stopped)
        const M = CFG.message || {}, words = flags.filter((f) => /^[a-z]+=/.test(f));
        if (!words.length) {
            console.log('THE BUS, as bank/elec_route.json "master" gives it to the engine at its start:\n  ' + (Object.entries(masterFlat(CFG.master)).map(([k, v]) => k + ' ' + v).join(' · ') || '(nothing: the engine\'s neutral defaults)'));
            console.log('to move a dial on the engine that is running:  node tools/elec.js bus ' + Object.keys(BUS_WORDS).map((w) => w + '=…').slice(0, 5).join(' ') + ' …\n  words: ' + Object.keys(BUS_WORDS).join(' · ') + '   (hpf=0 · lpf=0: off · glue=on | off)');
            return;
        }
        const data = {};
        for (const w of words) {
            const [k, v] = w.split('='), key = BUS_WORDS[k];
            if (!key) { console.error('"' + k + '" is no dial of the bus — ' + Object.keys(BUS_WORDS).join(' · ')); process.exit(2); }
            const n = key === 'glueOn' ? (/^(on|1|true|yes)$/i.test(v) ? 1 : 0) : +v;
            if (!Number.isFinite(n)) { console.error(k + ': a number' + (key === 'glueOn' ? ', or on | off' : '')); process.exit(2); }
            data[key] = n;
        }
        const r = await osc.send({ host: M.host, port: M.port, address: '/le/hello', args: ['from', 'elec.js'], waitMs: 400 });
        if (!r) { console.log('THE ENGINE DID NOT ANSWER on UDP ' + (M.port || osc.PORT) + ' — nothing was moved  (start_electronics.bat)'); process.exit(1); }
        await osc.send({ host: M.host, port: M.port, address: '/le/master', args: osc.pairs(data) });
        console.log('sent to the engine: ' + Object.entries(data).map(([k, v]) => k + ' ' + v).join(' · ') + ' — its window says what the bus is now.\nIt holds until the engine stops; to make it stay, the same value goes into bank/elec_route.json "master".');
        return;
    }

    if (cmd === 'ping') {
        const via = flagValue(flags, '--via'), M = CFG.message || {};
        if (via) {
            const r = await post(via, { kind: 'hello' });
            console.log(!r ? 'no score server answered on ' + via + ' (or it was started before the message route existed — restart it)'
                : r.engine ? 'the engine answered through the score server on ' + via + ' in ' + r.ms + ' ms · players: ' + (r.reply.players || '—')
                : 'the score server on ' + via + ' has the route; THE ENGINE DID NOT ANSWER — is its window open?  (start_electronics.bat)');
            process.exit(r && r.engine ? 0 : 1);
        }
        const t0 = process.hrtime.bigint(), r = await osc.send({ host: M.host, port: M.port, address: '/le/hello', args: ['from', 'elec.js'], waitMs: 400 });
        const ms = Math.round(Number(process.hrtime.bigint() - t0) / 1e4) / 100;
        console.log(r ? 'the engine answered in ' + ms + ' ms · players: ' + (osc.unpairs(r.args).players || '—') + ' · UDP ' + (M.port || osc.PORT)
            : 'THE ENGINE DID NOT ANSWER on UDP ' + (M.port || osc.PORT) + ' — is its window open?  (start_electronics.bat)');
        process.exit(r ? 0 : 1);
    }

    // 6.2's PROOF. The engine up for --seconds (20), then it leaves by itself. First the tool's own message: one /le/onset —
    // through a score server with --via <port>, else straight to the engine — and the player's test note into the rack right
    // after it, so the engine is seen to pair a sound with its message on the REAL input. Then, for the rest of the time,
    // whatever the composer score sends is listened for. Everything seen goes to probes/elec_message.json.
    // --quiet: no hardware and no note (the messages alone). Boots a server: refused while his engine is up.
    if (cmd === 'message') {
        const secs = +(flagValue(flags, '--seconds') || 20), via = flagValue(flags, '--via'), quiet = flags.includes('--quiet');
        const p0 = CFG.players[0], M = CFG.message || {}, shown = [];
        const run = sc.start(SCD('session.scd'), { timeoutS: secs + 60,
            env: { LE_PLAYERS: CFG.players.map((p) => p.name + ':' + (p.engineIn - 1)).join(','), LE_ECHO: '0', LE_SECONDS: String(secs), ...(quiet ? { LE_MODE: 'quiet' } : {}) },
            onLine: (l) => { if (/^LE_INFO\s+(onset|heard)/.test(l)) { shown.push(l.replace(/^LE_INFO\s*/, '')); console.log('  engine   ' + shown[shown.length - 1]); } } });
        try { console.log('engine     ' + (await run.waitFor(/^LE_READY/, 60000)).replace(/^LE_READY\s*/, '')); }
        catch (e) { const r = await run.done; console.log('STOPPED    ' + (r.errors.join(' · ') || e.message)); process.exit(r.code || 3); }
        const hello = via ? await post(via, { kind: 'hello' }) : await osc.send({ host: M.host, port: M.port, address: '/le/hello', args: ['from', 'elec.js'], waitMs: 400 });
        const helloOk = via ? !!(hello && hello.engine) : !!hello;
        console.log('hello      ' + (helloOk ? 'answered' + (via ? ' through the score server on ' + via + ' in ' + hello.ms + ' ms' : ', straight') : 'NOT ANSWERED' + (via ? ' through ' + via : '')));
        const own = { player: p0.name, lane: -1, id: 'elec.js', t: 0, dueMs: 0 };
        if (via) await post(via, { kind: 'onset', data: own }); else await osc.send({ host: M.host, port: M.port, address: '/le/onset', args: osc.pairs(own) });
        if (!quiet) console.log('note       ' + note(p0) + '   (the tool\'s own: its lead is PowerShell starting, not the score\'s)');
        console.log('listening  for the composer score, until the ' + secs + ' s are up …');
        const r = await run.done, heard = r.results.filter((x) => x.msg === 'onset');
        const onsets = shown.filter((l) => /^onset/.test(l)).length;
        const fromScore = heard.filter((x) => x.id !== 'elec.js');
        console.log('\n  onsets shown by the engine        ' + onsets + '\n  of them paired with their sound   ' + heard.length +
            (fromScore.length ? '\n  THE SCORE\'S LEAD (message -> its own sound)   ' + fromScore.map((x) => x.leadMs + ' ms (sent ' + x.dueMs + ' ms ahead)').join(' · ') : ''));
        const pass = helloOk && onsets >= 1 && (quiet || heard.length >= 1);
        console.log('\n' + (pass ? 'THE MESSAGE ROUTE HOLDS: a message reaches the engine with its data' + (quiet ? '.' : ', and the engine times the sound against it.') : 'THE MESSAGE ROUTE IS BROKEN — see the first line above that is missing.'));
        fs.writeFileSync(path.join(ROOT, 'probes', 'elec_message.json'), JSON.stringify({ when: new Date().toISOString(), via: via ? 'score server ' + via : 'straight to the engine',
            mode: quiet ? 'quiet' : 'sim', seconds: secs, hello: helloOk, helloMs: via && hello ? hello.ms : null, engineLines: shown, paired: heard, pass }, null, 1) + '\n');
        process.exit(pass ? 0 : 1);
    }

    // 6.3 … 6.5's PROOF, with REAL SOUND and on a SCRATCH BANK — the piece's bank/samples is not touched.
    // THE TOOL'S OWN PART: /le/open (a long window: the note below is started by PowerShell, which is slow to start) ->
    // the player's test note into the rack -> the engine's `captured` with its row -> the scratch index read back ->
    // /le/play -> ELEC RETURN's meter. THEN, until --seconds are up, it listens: whatever the composer score sends
    // (an opening, a playback brick) is shown, and ELEC RETURN's loudest moment in that time is reported.
    // --listen skips the tool's own part and KEEPS the scratch bank as the last run left it (a sample for a page's brick to play).
    // --name the sample's name (default <player>-proof). --via <port>: the tool's messages go through a score server.
    // Boots a server: refused beside his engine window. It SOUNDS: one note of the rack, and its sample a moment later.
    if (cmd === 'object') {
        const secs = +(flagValue(flags, '--seconds') || 30), via = flagValue(flags, '--via'), listenOnly = flags.includes('--listen');
        const p0 = CFG.players[0], M = CFG.message || {}, name = flagValue(flags, '--name') || p0.name + '-proof', shown = [];
        const scratch = path.join(os.tmpdir(), 'decibel_elec_object_bank');
        if (!listenOnly) fs.rmSync(scratch, { recursive: true, force: true });
        const send = (kind, data) => (via ? post(via, { kind, data }) : osc.send({ host: M.host, port: M.port, address: '/le/' + kind, args: osc.pairs(data) }));
        const d = job('probe'), dev = await engineSeesReaRoute(), miss = missing(d, dev);
        if (miss.length) { show(d, dev); console.log('\nMISSING, in order:\n' + miss.map((x, i) => '  ' + (i + 1) + '. ' + x).join('\n')); process.exit(2); }
        const t0 = Date.now();
        const run = sc.start(SCD('session.scd'), { timeoutS: secs + 90, env: { ...engineEnv(), LE_BANK: scratch, LE_SOURCE: scratch, LE_RECORD: '1', LE_SECONDS: String(secs + 30) },
            onLine: (l) => { if (/^LE_INFO\s+(open|captured|cropped|nothing to crop|play)\b/.test(l)) { shown.push(l.replace(/^LE_INFO\s*/, '')); console.log('  engine   ' + shown[shown.length - 1]); } } });
        try { console.log('engine     ' + (await run.waitFor(/^LE_READY/, 60000)).replace(/^LE_READY\s*/, '')); }
        catch (e) { const r = await run.done; console.log('STOPPED    ' + (r.errors.join(' · ') || e.message)); process.exit(r.code || 3); }
        const out = { when: new Date().toISOString(), via: via ? 'score server ' + via : 'straight to the engine', player: p0, name, scratch, reaper: d.audio };
        let pass = true;
        if (!listenOnly) {
            await send('open', { player: p0.name, lane: -1, id: 'elec_js', name, category: 'attack', t: 0, lengthMs: 4000, dueMs: 0 });
            console.log('note       ' + note(p0) + '   (the tool\'s own, into the rack)');
            let row = null;
            try { row = JSON.parse((await run.waitFor(/^LE_RESULT .*"msg": "captured"/, 12000)).replace(/^LE_RESULT\s*/, '')); } catch (e) { /* none came */ }
            let idx = null; try { idx = JSON.parse(fs.readFileSync(path.join(scratch, 'index.json'), 'utf8')); } catch (e) { /* not written */ }
            const inIndex = !!(idx && (idx.samples || []).some((x) => x.name === name));
            const files = { raw: fs.existsSync(path.join(scratch, 'raw', 'elec_js.wav')), sample: fs.existsSync(path.join(scratch, name + '.wav')) };
            await sleep(600);   // the sample's buffer is read after the index is written
            job('watch', { seconds: 4 });
            await sleep(300);
            await send('play', { name, id: 'elec_js_play', lane: -1, t: 0, dueMs: 300 });
            const pk = (await readPeaks(9000)).peakDb, ret = pk[CFG.return.track], back = ret ? Math.max(ret.L, ret.R) : null;
            const unity = row && row.cropped && back != null ? Math.round((back - row.peakDb) * 10) / 10 : null;
            console.log('\n  THE CAPTURE     ' + (row && row.cropped ? row.lengthMs + ' ms kept of ' + row.rawMs + ' · the attack at ' + row.attackMs + ' ms · peak ' + row.peakDb + ' dB' : row ? 'NOTHING TO CROP (raw peak ' + row.rawPeakDb + ' dB)' : 'NO RESULT CAME') +
                '\n  the files       raw ' + (files.raw ? 'yes' : 'NO') + ' · sample ' + (files.sample ? 'yes' : 'NO') + ' · in the index ' + (inIndex ? 'yes' : 'NO') +
                '\n  THE RETURN      on ' + CFG.return.track + ': ' + (ret ? 'L ' + ret.L + '  R ' + ret.R + ' dB' : 'no such track') + (unity != null ? '   (' + (unity >= 0 ? '+' : '') + unity + ' dB against the captured peak)' : ''));
            pass = !!(row && row.cropped) && files.raw && files.sample && inIndex && back != null && back > -80 && Math.abs(unity) < 1.5;
            Object.assign(out, { captured: row, files, inIndex, returnPeakDb: ret, returnMinusCapturedDb: unity });
        }
        const left = Math.round(secs - (Date.now() - t0) / 1000);
        if (left > 3) {
            const n0 = shown.length;
            console.log('\nlistening  for the composer score, ' + left + ' s more …');
            job('watch', { seconds: left });
            const pk = (await readPeaks((left + 8) * 1000)).peakDb, ret = pk[CFG.return.track];
            const mine = shown.slice(n0);
            console.log('\n  from the score  ' + (mine.length ? mine.length + ' line(s), above' : 'nothing came') + '\n  ' + CFG.return.track + ' in that time   ' + (ret ? 'L ' + ret.L + '  R ' + ret.R + ' dB' : 'no such track'));
            Object.assign(out, { listenedS: left, fromTheScore: mine, returnWhileListeningDb: ret });
            if (listenOnly) pass = mine.length > 0;
        }
        await stopEngine(run);
        out.engineLines = shown; out.pass = pass;
        console.log('\n' + (pass ? (listenOnly ? 'THE SCORE\'S OBJECTS REACH THE ENGINE.' : 'THE FIRST OBJECT HOLDS: a window of the player is captured, cropped, indexed, and returned at unity.') : 'BROKEN — see the first line above that is missing.'));
        fs.writeFileSync(path.join(ROOT, 'probes', listenOnly ? 'elec_object_page.json' : 'elec_object.json'), JSON.stringify(out, null, 1) + '\n');
        process.exit(pass ? 0 : 1);
    }

    if (cmd === 'croptest') {
        // §71 (2026-10-05): THE CROP TESTED on one of each kind, with real sound through the rack, on a SCRATCH bank (the piece's is not touched)
        // and the tool's own engine (his must be down). Each kind: an opening with a 4 s window (the note's sender takes a moment to start), the
        // note into the rack by its port, channel and preset, the engine's capture; the raw window, the sample and the row are copied to
        // score/public/crop_test/ and drawn on report.html (electronics/tools/crop_report.js) — the page he opens from his score server.
        const M = CFG.message || {};
        const kinds = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'crop_test.json'), 'utf8')).kinds;
        const only = flagValue(flags, '--only');
        const list = only ? kinds.filter((k) => k.name === only) : kinds;
        if (!list.length) { console.error('no such kind' + (only ? ' "' + only + '"' : '') + ' in bank/crop_test.json'); process.exit(2); }
        const scratch = path.join(os.tmpdir(), 'decibel_elec_croptest_bank'); fs.rmSync(scratch, { recursive: true, force: true }); fs.mkdirSync(scratch, { recursive: true });
        const outDir = path.join(ROOT, 'score', 'public', 'crop_test'); fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
        const d = job('probe'), dev = await engineSeesReaRoute(), miss = missing(d, dev);
        if (miss.length) { show(d, dev); console.log('\nMISSING, in order:\n' + miss.map((x, i) => '  ' + (i + 1) + '. ' + x).join('\n')); process.exit(2); }
        const lines = [];
        const run = sc.start(SCD('session.scd'), { timeoutS: 90 + list.length * 12, env: { ...engineEnv(), LE_BANK: scratch, LE_SOURCE: scratch, LE_RECORD: '1', LE_SECONDS: String(60 + list.length * 12) },
            onLine: (l) => { if (/^LE_INFO\s+(open|captured|cropped|nothing to crop)\b/.test(l)) { lines.push(l.replace(/^LE_INFO\s*/, '')); console.log('  engine   ' + lines[lines.length - 1]); } } });
        try { console.log('engine     ' + (await run.waitFor(/^LE_READY/, 60000)).replace(/^LE_READY\s*/, '')); }
        catch (e) { const r = await run.done; console.log('STOPPED    ' + (r.errors.join(' · ') || e.message)); process.exit(r.code || 3); }
        const items = [];
        for (const k of list) {
            const p = CFG.players.find((x) => x.name === k.player);
            if (!p) { console.log('SKIPPED    ' + k.name + ' — no player ' + k.player + ' in the route table'); continue; }
            const win = k.windowMs || 4000;
            await osc.send({ host: M.host, port: M.port, address: '/le/open', args: osc.pairs({ player: p.name, lane: -1, id: k.name, name: k.name, category: k.category || 'test', t: 0, lengthMs: win, dueMs: 0 }) });
            const args = ['-NoProfile', '-File', path.join(ROOT, 'tools', 'note_to_port.ps1'), '-Port', p.port, '-Note', String(k.note), '-Channel', String(k.channel || 1), '-Vel', String(k.vel || 100), '-Ms', String(k.noteMs || 150)];
            if (k.cc0 != null) args.push('-Cc0', String(k.cc0));
            const ps = cp.spawn('powershell', args, { stdio: 'ignore' });
            console.log('kind       ' + k.name + ' — ' + p.name + ' key ' + k.note + (k.cc0 != null ? ' preset ' + (k.cc0 + 1) : '') + (k.channel ? ' ch ' + k.channel : '') + ' · ' + (k.noteMs || 150) + ' ms · window ' + win + ' ms');
            let row = null;
            const mine = new RegExp('^LE_RESULT (?=.*"msg": "captured")(?=.*"name": "' + k.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '")');   // THIS kind's capture, by name — a wait that takes any earlier line runs ahead of the engine
            try { row = JSON.parse((await run.waitFor(mine, win + 10000)).replace(/^LE_RESULT\s*/, '')); } catch (e) { console.log('           no capture came'); }
            await new Promise((r) => { if (ps.exitCode != null) r(); else { ps.on('exit', r); setTimeout(r, 4000); } });   // the sender finishes on its own: its note-off is sent (a sender killed mid-note leaves a stuck note)
            const rawRel = 'raw_' + k.name + '.wav', smpRel = k.name + '.wav';
            const rawSrc = path.join(scratch, 'raw', k.name + '.wav'), smpSrc = path.join(scratch, k.name + '.wav');
            if (fs.existsSync(rawSrc)) fs.copyFileSync(rawSrc, path.join(outDir, rawRel));
            if (row && row.cropped && fs.existsSync(smpSrc)) fs.copyFileSync(smpSrc, path.join(outDir, smpRel));
            items.push({ name: k.name, category: k.category || '', note: p.name + ' · key ' + k.note + (k.cc0 != null ? ' · preset ' + (k.cc0 + 1) : '') + ' · ' + (k.noteMs || 150) + ' ms', rawFile: rawRel, sampleFile: row && row.cropped ? smpRel : null, row });
            await sleep(400);
        }
        await stopEngine(run);
        const crop = Object.assign({ attackDb: -30, floorDb: -50, preMs: 5, endDb: -45, holdMs: 50, fadeInMs: 2, fadeOutMs: 10 }, (CFG.bank || {}).crop || {});
        const rep = require(path.join(ROOT, 'electronics', 'tools', 'crop_report.js')).report(outDir, items, { title: list.length + ' kind(s)', when: new Date().toISOString(), crop });
        fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify({ when: new Date().toISOString(), crop, items }, null, 1) + '\n');
        const ok = items.filter((x) => x.row && x.row.cropped).length;
        console.log('\n' + ok + ' of ' + items.length + ' cropped · ' + path.relative(ROOT, rep) + '\nLOOK:  http://localhost:5500/crop_test/report.html');
        process.exit(ok === items.length ? 0 : 1);
    }

    console.error('unknown command ' + cmd); process.exit(2);

})().catch((e) => { console.error(e.message); process.exit(1); });
