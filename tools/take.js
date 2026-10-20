#!/usr/bin/env node
// take.js — THE TAKE: the piece played ONCE in real time, with the live electronics, recorded in Reaper as two stems, aligned to
// score time, mixed, and written as the WAV the notation page and the video take (PLAN 2.8; RUNNING_LOG §384 … §386, 2026-10-10).
//
// WHY A TAKE AND NOT A RENDER. Pieces #4 … #6 RENDERED their audio: the page's playback captured as MIDI, rendered OFFLINE by
// Reaper (tools/render_reaper.js; docs/RENDER.md). This piece's electronics are a LIVE process — the engine hears the players over
// ReaRoute as the rack plays, it is told by the page at play time, it rolls its timings and decisions at the moment, and its sound
// comes back into the rack on the track ELEC RETURN. An offline render has no engine in it. So the piece is PLAYED, and recorded.
//
//   node tools/take.js start --score <name> [--from 0] [--to <the score's end>] [--name NN] [--tail 6] [--no-engine]
//        a COPY of the rack opens in its own Reaper tab and RECORDS, on one timeline:
//          · REC          its output — the sum of every instrument track, post-fader (piece #6's receive bus): THE PLAYERS
//          · ELEC RETURN  its output — the engine's return as it reaches the master: THE ELECTRONICS
//          · the sixteen instrument tracks' MIDI — what each one received, the alignment's reference
//        then it says: ▶ on the page, from --from. THE PLAYING IS HIS (his Chrome has the MIDI); the tool only records.
//   node tools/take.js stop
//        stops, reads what was recorded (the two files, every recorded note with its time), saves the copy, closes its tab — the
//        rack tab is current again — and runs `align`.
//   node tools/take.js align [--score <name>] [--take NN] [--tol 25] [--driftMs 16] [--resample auto|always|never]
//        the recorded note-ons against the score's note starts: THE OFFSET (where score time sits in the recording) and THE DRIFT
//        (the page's clock against the audio clock, a straight-line fit over the whole take). Both stems cut to score time —
//        sample 0 = --from — and, past --driftMs at the take's end, resampled onto the score's clock. → aligned/players.wav · elec.wav
//   node tools/take.js mix [--score <name>] [--take NN] [--out <name>] [--elec-db 0] [--peak -1] [--up] [--maxUp N]
//        the two stems summed AS HE HEARD THEM (the faders read at the take; the electronics' level a dial FOR THE MIX ONLY), 48 kHz
//        float → notation/audio/raw/<out>-float.wav, then THE GAIN STEP of every render before it (tools/lib/gain_step.js: the true
//        peak measured on the file, ONE plain gain, 24-bit) → notation/audio/<out>.wav — the name the notation page's ♪ render chip
//        and tools/export_video.js --audio look for. A take of PART of the piece must say --out (it may not write the piece's WAV).
//   node tools/take.js list [--score <name>]
//
// THE RULES. The rack is NEVER written: the take is a copy (reaper/<score>_take.rpp, gitignored) in its own tab, and a rack with
// unsaved changes refuses the take (the copy would miss them). Nothing is recorded in the rack's own tab. The engine is HIS living
// one — asked one hello, never started, never stopped. The sound path is untouched in the copy: only ELEC RETURN's record mode
// moves ("do not record" → "output"), nothing is armed or disarmed, no monitoring changes.
//
// WHY BOTH STEMS ARE RECORDED AS OUTPUTS. REC records its OUTPUT (mode 3, post-fader — make_rec_track.lua). ELEC RETURN is recorded
// the same way, not as an input: an INPUT recording is shifted by Reaper's input-latency compensation, an OUTPUT recording is not,
// and two stems recorded by two rules would not meet as he hears them. Recorded alike, their relation in the files IS the one at
// the master. The engine's own lag (two of Reaper's blocks) is in the electronics' stem, as it is in the room.
//
// A TAKE IS A PERFORMANCE: each pass is another roll of the electronics, by design. The players' part is the same every time.
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync, execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const G = require('./lib/gain_step.js');

const argv = process.argv.slice(2), cmd = argv[0];
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d; };
const flag = k => argv.includes('--' + k);
const log = s => console.log(s);
const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const die = m => { const e = new Error(m); e.plain = true; throw e; };
const iso = d => new Date(d).toISOString();
const round = (x, n) => +x.toFixed(n == null ? 3 : n);

const RACK = path.join(ROOT, 'reaper', 'decibel_rack.rpp');
const TAKES = path.join(ROOT, 'notation', 'audio', 'takes');
const CURRENT = path.join(TAKES, 'current.json');          // the take that is recording now
const AUDIODIR = path.join(ROOT, 'notation', 'audio');
const RAWDIR = path.join(AUDIODIR, 'raw');
const ROUTE = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'elec_route.json'), 'utf8'));
const REC_NAME = 'REC';
const ELEC_NAME = (ROUTE.return && ROUTE.return.track) || 'ELEC RETURN';
const FLOAT_WAV = 'ZXZhdyAAAQ==';                         // Reaper's sink config for WAV 32-bit float (the render's own string)
const rppOf = score => path.join(ROOT, 'reaper', score + '_take.rpp');

// ---------------------------------------------------------------- the bridge (render_reaper.js's own way)
const B = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA, 'REAPER', 'bridge');
const heartbeat = () => { try { const h = JSON.parse(fs.readFileSync(path.join(B, 'heartbeat.json'), 'utf8')); return Object.assign(h, { ageS: Date.now() / 1000 - h.time }); } catch (e) { return null; } };
// reaper_job.js guards on the project name; this tool moves between the rack and the take's tab, so the guard is the project that
// is open NOW, and every job that must act on one project checks the path itself
function openProjectStem() { const h = heartbeat(); return (h && h.project) ? path.basename(h.project, path.extname(h.project)) : 'decibel_rack'; }
function job(lua, timeoutMs) {
  const t = timeoutMs || 20000;
  const r = spawnSync(process.execPath, [path.join(__dirname, 'reaper_job.js'), '-e', lua],
    { encoding: 'utf8', env: Object.assign({}, process.env, { REAPER_PROJECT: openProjectStem(), BRIDGE_TIMEOUT_MS: String(t) }), timeout: t + 10000 });
  const text = (r.stdout || '') + (r.stderr || '');
  let j = null; try { j = JSON.parse(r.stdout); } catch (e) { }
  if (!j || !j.ok) throw new Error('bridge job failed: ' + text.trim().slice(0, 800));
  return j.result;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const L = s => '[[' + s + ']]';                           // a Lua long string: a Windows path goes in as it is
const samePath = (a, b) => String(a || '').toLowerCase() === String(b || '').toLowerCase();
async function waitHeartbeatNames(file) {                 // RUNNING_LOG §553 (#5): the guard reads the heartbeat; wait until it names the tab
  for (let w = Date.now(); ; await sleep(250)) {
    const h = heartbeat();
    if (h && h.project && path.basename(h.project).toLowerCase() === path.basename(file).toLowerCase()) return;
    if (Date.now() - w > 30000) throw new Error('the heartbeat never named ' + path.basename(file) + ': ' + JSON.stringify(h));
  }
}
function needBridge() {
  const hb = heartbeat();
  if (!hb || hb.ageS > 5) die('the Reaper bridge is not alive (heartbeat ' + (hb ? hb.ageS.toFixed(0) + ' s old' : 'missing') + ') — is Reaper open?');
  return hb;
}

// ---------------------------------------------------------------- the score
// what the server calls a score's essence: its content without the stamps and the view (score/server.js scoreEssence)
function essence(txt) { try { const d = JSON.parse(txt); if (d && d.metadata) { delete d.metadata.modified; delete d.metadata.created; } if (d) delete d.viewport; return JSON.stringify(d); } catch (e) { return txt; } }
function readScore(name) {
  const file = path.join(ROOT, 'scores', name + '.json'), wf = path.join(ROOT, 'scores', name + '-work.json');
  if (!fs.existsSync(file)) die('no score ' + rel(file));
  const txt = fs.readFileSync(file, 'utf8'), obj = JSON.parse(txt);
  const end = Math.max(0, ...obj.objects.map(o => +(o.endSeconds != null ? o.endSeconds : o.endTime) || 0));
  let work = null;
  if (fs.existsSync(wf)) work = { modified: iso(fs.statSync(wf).mtime), differs: essence(fs.readFileSync(wf, 'utf8')) !== essence(txt) };
  return { name, file, obj, end, saved: iso(fs.statSync(file).mtime), work };
}
// THE SCORE'S NOTE STARTS — the page sends a note-on at the note's own start (composer.html: perfAt(wc.startSeconds)). A note a
// trill has taken over (mutedBy) is silent; the trill's own notes are generated at play time and are simply not in this list.
function onsetsOf(obj, from, to) {
  return obj.objects
    .filter(o => o.type === 'waveCurve' && o.sonifyNote != null && !o.mutedBy && !o.muted && o.startSeconds >= from - 1e-6 && o.startSeconds <= to + 1e-6)
    .map(o => o.startSeconds).sort((a, b) => a - b);
}

// ---------------------------------------------------------------- the fit: recorded note-ons against the score's note starts
const median = a => { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
function nearest(R, x) {                                  // R sorted; the value of R nearest x
  let lo = 0, hi = R.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (R[mid] < x) lo = mid; else hi = mid; }
  return Math.abs(R[lo] - x) <= Math.abs(R[hi] - x) ? R[lo] : R[hi];
}
function lineFit(P) {                                     // least squares r = a + b s
  const n = P.length; let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [x, y] of P) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const den = n * sxx - sx * sx;
  if (n < 2 || Math.abs(den) < 1e-9) return { a: n ? sy / n - sx / n : 0, b: 1 };
  const b = (n * sxy - sx * sy) / den;
  return { a: (sy - b * sx) / n, b };
}
// S: the score's note starts (score seconds) · R: every recorded note-on (project seconds) · both sorted.
// By TIME alone — no pitch, no track: the page's keys, channels and trills are its own business, and a time pattern of several
// hundred onsets cannot be matched by chance. → { ok, a, b } with  recorded = a + b · score.
function fitTake(S, R, opt) {
  const tol = (opt && opt.tol) || 0.025;
  if (S.length < 3 || R.length < 3) return { ok: false, why: 'too few notes (score ' + S.length + ', recorded ' + R.length + ')' };
  // 1 · the coarse offset: the one difference (a recorded onset − a score onset) under which the most of the first notes meet
  // (the recorded side reaches a minute and a half in: a take that opens on trills has hundreds of the page's own notes first)
  const S0 = S.slice(0, Math.min(S.length, 40)), R0 = R.filter(r => r <= R[0] + 90).slice(0, 3000);
  let best = null;
  for (const r of R0) for (const s of S0.slice(0, 12)) {
    const d = r - s, res = [];
    for (const x of S0) { const v = nearest(R, x + d); if (Math.abs(v - (x + d)) <= tol) res.push(v - x); }
    if (!best || res.length > best.res.length) best = { d, res };
  }
  const need = Math.max(3, Math.ceil(S0.length * 0.5));
  if (!best || best.res.length < need) return { ok: false, why: 'the first notes of the score were not found in the recording (' + (best ? best.res.length : 0) + ' of ' + S0.length + ' met — was the page started at --from?)' };
  // 2 · through the take, the offset followed locally (a drift of tens of ms over the piece stays inside the tolerance this way)
  let recent = best.res.slice(), local = median(recent);
  const pairs = [];
  for (const s of S) {
    const v = nearest(R, s + local);
    if (Math.abs(v - (s + local)) <= tol) { pairs.push([s, v]); recent.push(v - s); if (recent.length > 31) recent.shift(); local = median(recent); }
  }
  // 3 · the straight line, the outliers dropped once (a late frame of the page is noise, not drift)
  let f = lineFit(pairs);
  const resid = p => p[1] - (f.a + f.b * p[0]);
  const mad = median(pairs.map(p => Math.abs(resid(p))));
  const cut = Math.max(0.004, 3 * 1.4826 * mad);
  const kept = pairs.filter(p => Math.abs(resid(p)) <= cut);
  if (kept.length >= 3) f = lineFit(kept);
  const spread = median(kept.map(p => Math.abs(p[1] - (f.a + f.b * p[0]))));
  return { ok: true, a: f.a, b: f.b, coarse: best.res.length, coarseOf: S0.length, matched: pairs.length, kept: kept.length, of: S.length, spreadMs: round(spread * 1000, 2) };
}

// ---------------------------------------------------------------- the takes on disk
const dirOf = (score, nn) => path.join(TAKES, score, nn);
const takeFile = (score, nn) => path.join(dirOf(score, nn), 'take.json');
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJson = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 1));
function takesOf(score) {
  const d = path.join(TAKES, score);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter(n => fs.existsSync(path.join(d, n, 'take.json'))).sort();
}
function scoresWithTakes() { return fs.existsSync(TAKES) ? fs.readdirSync(TAKES).filter(n => fs.statSync(path.join(TAKES, n)).isDirectory()).sort() : []; }
// --score / --take, else the latest take there is
function pickTake() {
  let score = arg('score', null), nn = arg('take', null);
  if (!score) {
    const all = scoresWithTakes().map(s => ({ s, t: takesOf(s) })).filter(x => x.t.length);
    if (!all.length) die('no take yet — node tools/take.js start --score <name>');
    const latest = all.map(x => ({ s: x.s, n: x.t[x.t.length - 1], m: fs.statSync(takeFile(x.s, x.t[x.t.length - 1])).mtimeMs })).sort((a, b) => b.m - a.m)[0];
    score = latest.s; if (!nn) nn = latest.n;
  }
  if (!nn) { const t = takesOf(score); if (!t.length) die('no take of ' + score); nn = t[t.length - 1]; }
  if (!fs.existsSync(takeFile(score, nn))) die('no take ' + nn + ' of ' + score);
  return { score, nn, dir: dirOf(score, nn), T: readJson(takeFile(score, nn)) };
}

// ================================================================ start
async function start() {
  const score = arg('score', null);
  if (!score) die('which score?  node tools/take.js start --score <name> [--from 0] [--to S]');
  if (fs.existsSync(CURRENT)) { const c = readJson(CURRENT); die('take ' + c.take + ' of ' + c.score + ' is recording (since ' + c.recordedAt + ') — node tools/take.js stop'); }
  const S = readScore(score);
  const from = +arg('from', 0), to = arg('to', null) != null ? +arg('to') : round(S.end), tail = +arg('tail', 6);
  if (!(to > from)) die('--to (' + to + ') must be past --from (' + from + ')');
  const onsets = onsetsOf(S.obj, from, to);
  if (onsets.length < 3) die('the score has ' + onsets.length + ' notes in ' + from + ' … ' + to + ' s — nothing to align a take by');

  // (a) the refusals
  needBridge();
  const st = job(`local _, p = reaper.EnumProjects(-1, '') local out = { path = p, dirty = reaper.IsProjectDirty(0), state = reaper.GetPlayState(), projects = {} }
local i = 0 while true do local pr, fn = reaper.EnumProjects(i, '') if not pr then break end out.projects[#out.projects + 1] = fn i = i + 1 end
local _, v = reaper.get_config_var_string('multiprojopt') out.multiprojopt = v
return out`);
  const RPP = rppOf(score);
  if ((st.projects || []).some(p => /_take\.rpp$/i.test(p))) die('a take\'s tab is already open in Reaper (' + (st.projects || []).filter(p => /_take\.rpp$/i.test(p)).map(p => path.basename(p)).join(', ') + ') — close that tab in Reaper, then start again');
  if (!samePath(st.path, RACK)) die('Reaper\'s current tab is ' + path.basename(st.path || '(none)') + ', not the rack — bring the rack\'s tab to the front');
  if (st.dirty) die('the rack has unsaved changes — CTRL+S in Reaper first (the take is recorded in a COPY of the saved file)');
  if (st.state) die('Reaper is playing or recording — stop it first');
  const bg = +st.multiprojopt || 0;
  let engine = null;
  if (!flag('no-engine')) {
    const r = spawnSync(process.execPath, [path.join(__dirname, 'elec.js'), 'ping'], { encoding: 'utf8', timeout: 15000 });
    engine = ((r.stdout || '') + (r.stderr || '')).trim().split(/\r?\n/).pop();
    if (r.status !== 0) die('the engine did not answer — ' + engine + '\n   (a take of the players alone: --no-engine)');
  }

  // the take's folder
  const nn = arg('name', null) || String((takesOf(score).map(n => parseInt(n, 10)).filter(n => !isNaN(n)).reduce((a, b) => Math.max(a, b), 0)) + 1).padStart(2, '0');
  const dir = dirOf(score, nn);
  if (fs.existsSync(dir) && fs.readdirSync(dir).length) die('the take\'s folder is not empty: ' + rel(dir));
  fs.mkdirSync(dir, { recursive: true });

  // (b) the copy, in its own tab
  fs.copyFileSync(RACK, RPP);
  log('1. ' + rel(RPP) + ' ← the rack (saved ' + iso(fs.statSync(RACK).mtime).slice(0, 16) + ')');
  log('2. opening it in a new Reaper tab (the samplers load — a minute or more) …');
  const opened = job(`reaper.Main_OnCommand(40859, 0)
reaper.Main_openProject('noprompt:' .. ${L(RPP)})
local _, p = reaper.EnumProjects(-1, '')
return { path = p, tracks = reaper.CountTracks(0) }`, 600000);
  if (!samePath(opened.path, RPP)) throw new Error('the take\'s project did not open: ' + JSON.stringify(opened));
  await waitHeartbeatNames(RPP);

  // (c) the tracks: ELEC RETURN records its output; REC and the instrument tracks are read, not changed
  const setup = job(`local _, p = reaper.EnumProjects(-1, '')
if p:lower() ~= (${L(RPP)}):lower() then return { error = 'wrong project: ' .. p } end
reaper.GetSetProjectInfo_String(0, 'RECORD_PATH', ${L(dir)}, true)
reaper.GetSetProjectInfo_String(0, 'RECORD_FORMAT', '${FLOAT_WAV}', true)
local dB = function(v) if v > 0 then return 20 * math.log(v, 10) end return -150 end
local out = { tracks = {}, items = 0 }
for i = 0, reaper.CountTracks(0) - 1 do
  local tr = reaper.GetTrack(0, i)
  local _, n = reaper.GetTrackName(tr)
  out.items = out.items + reaper.CountTrackMediaItems(tr)
  if n == ${L(ELEC_NAME)} then reaper.SetMediaTrackInfo_Value(tr, 'I_RECMODE', 3) end
  out.tracks[#out.tracks + 1] = { name = n, arm = reaper.GetMediaTrackInfo_Value(tr, 'I_RECARM'), mon = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMON'),
    mode = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMODE'), input = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT'),
    dB = dB(reaper.GetMediaTrackInfo_Value(tr, 'D_VOL')), mute = reaper.GetMediaTrackInfo_Value(tr, 'B_MUTE'), fx = reaper.TrackFX_GetCount(tr) }
end
local m = reaper.GetMasterTrack(0)
out.master = { dB = dB(reaper.GetMediaTrackInfo_Value(m, 'D_VOL')), fx = reaper.TrackFX_GetCount(m), mute = reaper.GetMediaTrackInfo_Value(m, 'B_MUTE') }
reaper.GetSet_LoopTimeRange(true, false, 0, 0, false)
reaper.GetSet_LoopTimeRange(true, true, 0, 0, false)
reaper.GetSetRepeat(0)
reaper.SetEditCurPos(0, true, false)
reaper.Main_SaveProject(0, false)
local _, rp = reaper.GetSetProjectInfo_String(0, 'RECORD_PATH', '', false)
local _, rf = reaper.GetSetProjectInfo_String(0, 'RECORD_FORMAT', '', false)
local _, sr = reaper.GetAudioDeviceInfo('SRATE', '')
out.recordPath = rp out.recordFormat = rf out.srate = sr
return out`, 120000);
  const fail = async (m) => { await closeTab(RPP); die(m); };
  if (setup.error) await fail(setup.error);
  const tr = n => (setup.tracks || []).find(t => t.name === n);
  const rec = tr(REC_NAME), elec = tr(ELEC_NAME);
  const midi = (setup.tracks || []).filter(t => t.name !== REC_NAME && t.name !== ELEC_NAME && t.arm === 1 && t.input >= 4096 && t.mode === 0);
  if (!rec) await fail('the rack has no track named ' + REC_NAME + ' — the players\' sum is recorded there (reaper/bridge/jobs/make_rec_track.lua)');
  if (rec.arm !== 1 || rec.mode !== 3) await fail(REC_NAME + ' is not armed on "record: output (stereo, latency compensated)" — arm ' + rec.arm + ', mode ' + rec.mode);
  if (!elec) await fail('the rack has no track named ' + ELEC_NAME + ' — node tools/elec.js route');
  if (elec.arm !== 1 || elec.mode !== 3) await fail(ELEC_NAME + ' did not take the record mode — arm ' + elec.arm + ', mode ' + elec.mode);
  if (!midi.length) await fail('no instrument track is armed to record its MIDI input — the alignment has no reference');
  if (setup.items) await fail('the rack holds ' + setup.items + ' media items — they would play under the take');
  if (setup.recordFormat !== FLOAT_WAV) await fail('the record format is not WAV 32-bit float: ' + setup.recordFormat);
  if (!samePath(setup.recordPath, dir)) await fail('the record path did not take: ' + setup.recordPath);
  log('3. ' + REC_NAME + ' records its output (the players\' sum, fader ' + round(rec.dB, 2) + ' dB) · ' + ELEC_NAME + ' records its output (the engine, fader ' + round(elec.dB, 2) + ' dB) · '
    + midi.length + ' instrument tracks record their MIDI · WAV 32-bit float · ' + setup.srate + ' Hz · the master ' + round(setup.master.dB, 2) + ' dB, ' + setup.master.fx + ' FX');
  if (rec.mute || elec.mute) log('   WARNING: ' + [rec.mute && REC_NAME, elec.mute && ELEC_NAME].filter(Boolean).join(' and ') + ' muted in the rack — a muted track records silence');
  if (bg) log('   WARNING: Reaper runs background projects (multiprojopt ' + bg + ') — the rack\'s own tab may sound under the take');

  // (d) record
  const r0 = job(`local _, p = reaper.EnumProjects(-1, '')
if p:lower() ~= (${L(RPP)}):lower() then return { error = 'wrong project: ' .. p } end
reaper.SetEditCurPos(0, true, false)
reaper.Main_OnCommand(1013, 0)
return { state = reaper.GetPlayState() }`);
  if (r0.error) await fail(r0.error);
  await sleep(1500);
  const r1 = job(`return { state = reaper.GetPlayState(), pos = reaper.GetPlayPosition() }`);
  if (!(r1.state & 4) || !(r1.pos > 0.3)) await fail('Reaper did not go into record (state ' + r1.state + ', position ' + r1.pos + ')');

  const T = {
    score, take: nn, state: 'recording', from, to, tail, notes: onsets.length, firstNote: onsets[0],
    scoreSaved: S.saved, workCopy: S.work, scoreEnd: round(S.end),
    rack: { file: rel(RACK), saved: iso(fs.statSync(RACK).mtime) }, rpp: rel(RPP),
    engine: flag('no-engine') ? null : { answered: engine, mode: ROUTE.mode || 'compose' },
    srate: +setup.srate, recordFormat: setup.recordFormat,
    faders: { rec: round(rec.dB, 3), elec: round(elec.dB, 3), master: round(setup.master.dB, 3) }, masterFx: setup.master.fx,
    midiTracks: midi.map(t => t.name), recordedAt: iso(Date.now()),
  };
  writeJson(takeFile(score, nn), T);
  fs.mkdirSync(TAKES, { recursive: true });
  writeJson(CURRENT, { score, take: nn, recordedAt: T.recordedAt });
  log('4. RECORDING — take ' + nn + ' of ' + score + ' · ' + rel(dir));
  if (S.work && S.work.differs) log('   NOTE: the page\'s working copy of ' + score + ' differs from its save (unsaved edits, ' + S.work.modified.slice(0, 16) + ') — the page plays the WORKING COPY; the take is aligned against the save');
  log('');
  log('   ► ON THE PAGE: the playhead at ' + from + ' s, then PLAY — through ' + to + ' s' + (to >= S.end - 0.5 ? ' (the end)' : '') + '. Leave Reaper on the take\'s tab.');
  log('   ► WHEN IT HAS PLAYED: node tools/take.js stop');
}

// the take's tab closed, the rack's tab current again. The copy is SAVED first, always: it is ours, and a tab closed with unsaved
// changes would stop on Reaper's "save?" dialog.
async function closeTab(RPP) {
  try {
    return job(`local _, p = reaper.EnumProjects(-1, '')
if p:lower() ~= (${L(RPP)}):lower() then return { closed = false, current = p } end
if reaper.GetPlayState() ~= 0 then reaper.Main_OnCommand(1016, 0) end
reaper.Main_SaveProject(0, false)
reaper.Main_OnCommand(40860, 0)
local _, q = reaper.EnumProjects(-1, '')
return { closed = true, current = q }`, 120000);
  } catch (e) { return { closed: false, error: e.message }; }
}

// ================================================================ stop
async function stop() {
  if (!fs.existsSync(CURRENT)) die('no take is recording — node tools/take.js start --score <name>');
  const cur = readJson(CURRENT), dir = dirOf(cur.score, cur.take), T = readJson(takeFile(cur.score, cur.take));
  const RPP = rppOf(cur.score);
  needBridge();
  // the take's tab to the front, whatever he looked at meanwhile
  const sel = job(`local want = (${L(RPP)}):lower() local i = 0
while true do local pr, fn = reaper.EnumProjects(i, '') if not pr then break end
  if fn:lower() == want then reaper.SelectProjectInstance(pr) local _, p = reaper.EnumProjects(-1, '') return { found = true, current = p, state = reaper.GetPlayState(), pos = reaper.GetPlayPosition() } end
  i = i + 1 end
return { found = false }`);
  if (!sel.found) { fs.unlinkSync(CURRENT); die('the take\'s tab is not open in Reaper any more — take ' + cur.take + ' is lost (its folder: ' + rel(dir) + ')'); }
  await waitHeartbeatNames(RPP);
  if (!(sel.state & 4)) log('   NOTE: Reaper was not recording when stop was asked (state ' + sel.state + ') — reading what there is');
  // Transport: Stop — 1016 saves what was recorded when Reaper does not prompt (promptendrec 0, this machine); 40667 = stop, save all
  const prompt = job(`local _, v = reaper.get_config_var_string('promptendrec') return { v = v, pos = reaper.GetPlayPosition() }`);
  job(`reaper.Main_OnCommand(${String(prompt.v) === '0' ? 1016 : 40667}, 0) return { state = reaper.GetPlayState() }`, 60000);
  for (let w = Date.now(); ; await sleep(300)) {
    const s = job(`return { state = reaper.GetPlayState() }`);
    if (!s.state) break;
    if (Date.now() - w > 30000) throw new Error('Reaper did not stop');
  }
  await sleep(800);                                       // the items land a moment after the stop
  const midiPath = path.join(dir, 'midi.json');
  const got = job(`local _, p = reaper.EnumProjects(-1, '')
if p:lower() ~= (${L(RPP)}):lower() then return { error = 'wrong project: ' .. p } end
local NL = string.char(10)
local audio, parts, nNotes, nTracks = {}, {}, 0, 0
for ti = 0, reaper.CountTracks(0) - 1 do
  local tr = reaper.GetTrack(0, ti)
  local _, name = reaper.GetTrackName(tr)
  local notes = {}
  for ii = 0, reaper.CountTrackMediaItems(tr) - 1 do
    local it = reaper.GetTrackMediaItem(tr, ii)
    local tk = reaper.GetActiveTake(it)
    if tk then
      if reaper.TakeIsMIDI(tk) then
        local _, nN = reaper.MIDI_CountEvts(tk)
        for n = 0, nN - 1 do
          local ok, _, _, s, _, chan, pitch, vel = reaper.MIDI_GetNote(tk, n)
          if ok then notes[#notes + 1] = string.format('[%.6f,%d,%d,%d]', reaper.MIDI_GetProjTimeFromPPQPos(tk, s), chan + 1, pitch, vel) end
        end
      else
        local src = reaper.GetMediaItemTake_Source(tk)
        local slen = reaper.GetMediaSourceLength(src)
        audio[#audio + 1] = { track = name, file = reaper.GetMediaSourceFileName(src, ''),
          pos = reaper.GetMediaItemInfo_Value(it, 'D_POSITION'), len = reaper.GetMediaItemInfo_Value(it, 'D_LENGTH'),
          offs = reaper.GetMediaItemTakeInfo_Value(tk, 'D_STARTOFFS'), rate = reaper.GetMediaItemTakeInfo_Value(tk, 'D_PLAYRATE'),
          srate = reaper.GetMediaSourceSampleRate(src), chans = reaper.GetMediaSourceNumChannels(src), srcLen = slen }
      end
    end
  end
  if #notes > 0 then
    nTracks = nTracks + 1 nNotes = nNotes + #notes
    local safe = name:gsub('[^%w %-_#%.]', '_')
    parts[#parts + 1] = '{"track":"' .. safe .. '","notes":[' .. table.concat(notes, ',') .. ']}'
  end
end
local f, err = io.open(${L(midiPath)}, 'w')
if not f then return { error = 'midi.json: ' .. tostring(err) } end
f:write('{"tracks":[' .. NL .. table.concat(parts, ',' .. NL) .. NL .. ']}' .. NL)
f:close()
return { audio = audio, midiTracks = nTracks, notes = nNotes, length = reaper.GetProjectLength(0) }`, 180000);
  const closed = await closeTab(RPP);
  fs.unlinkSync(CURRENT);
  if (got.error) die(got.error);
  const stem = n => (got.audio || []).filter(a => a.track === n);
  Object.assign(T, { state: 'recorded', stoppedAt: iso(Date.now()), recordedS: round(got.length), audio: got.audio || [], midiNotes: got.notes, midiTracksRecorded: got.midiTracks });
  writeJson(takeFile(cur.score, cur.take), T);
  log('1. stopped · ' + round(got.length, 1) + ' s recorded · ' + got.notes + ' notes on ' + got.midiTracks + ' tracks → ' + rel(midiPath));
  for (const n of [REC_NAME, ELEC_NAME]) log('   ' + n + ': ' + (stem(n).map(a => path.basename(a.file) + ' (' + round(a.len, 1) + ' s, ' + a.srate + ' Hz, ' + a.chans + ' ch)').join(' · ') || 'NOTHING RECORDED'));
  log('2. the take\'s tab ' + (closed.closed ? 'closed' : 'NOT closed (' + (closed.error || closed.current) + ')') + ' · current: ' + path.basename(closed.current || '?'));
  if (stem(REC_NAME).length !== 1 || stem(ELEC_NAME).length !== 1) die('a stem is missing or in pieces — the take cannot be aligned as it is');
  if (!got.notes) die('no MIDI was recorded — was the page played? (the take has no reference to align by)');
  align({ score: cur.score, nn: cur.take, dir, T });
}

// ================================================================ align
function align(pick) {
  const { score, nn, dir } = pick; let T = pick.T;
  if (!T.audio) die('take ' + nn + ' of ' + score + ' was not stopped — node tools/take.js stop');
  const S = readScore(score);
  const from = T.from, to = T.to, span = to - from, D = span + T.tail;
  const onsets = onsetsOf(S.obj, from, to);
  const midi = readJson(path.join(dir, 'midi.json'));
  const R = [].concat(...midi.tracks.map(t => t.notes.map(n => n[0]))).sort((a, b) => a - b);
  const fit = fitTake(onsets, R, { tol: +arg('tol', 25) / 1000 });
  if (!fit.ok) die('THE TAKE COULD NOT BE ALIGNED: ' + fit.why);
  const driftMs = (fit.b - 1) * span * 1000, limit = +arg('driftMs', 16), how = arg('resample', 'auto');
  const resample = how === 'always' || (how !== 'never' && Math.abs(driftMs) > limit);
  const b = resample ? fit.b : 1;
  // where score time `from` sits in the recording (project seconds). A drift that is LEFT is shared out: the stems are laid by the
  // take's MIDDLE, so the two ends are each half the drift off (under 8 ms at the limit) instead of one end exact and the other
  // the whole of it.
  const mid = (from + to) / 2;
  const offsetS = resample ? fit.a + fit.b * from : fit.a + fit.b * mid - (mid - from);
  const outDir = path.join(dir, 'aligned');
  fs.mkdirSync(outDir, { recursive: true });
  const stems = {};
  for (const [key, name] of [['players', REC_NAME], ['elec', ELEC_NAME]]) {
    const it = T.audio.filter(a => a.track === name);
    if (it.length !== 1) die(name + ' has ' + it.length + ' recorded items — one is expected');
    const a = it[0], sr = +G.probe(a.file).sample_rate;
    // score time `from` in the FILE: the fit gives its project time; the item says where the file sits in the project
    const f0 = offsetS - a.pos + a.offs;
    const nSrc = Math.round(D * b * sr), nOut = Math.round(D * sr);
    const af = [];
    if (f0 >= 0) af.push('atrim=start_sample=' + Math.round(f0 * sr) + ':end_sample=' + (Math.round(f0 * sr) + nSrc), 'asetpts=PTS-STARTPTS');
    else af.push('adelay=' + Math.round(-f0 * sr) + 'S:all=1', 'atrim=end_sample=' + nSrc, 'asetpts=PTS-STARTPTS');   // the page started before the recording did
    // the page's clock onto the score's: asetrate alone steps by 1 Hz (23 ppm at 44.1 kHz — as large as the drift itself), so the
    // stem is first raised sixteenfold, THEN re-declared (a step of 1.4 ppm), then brought back
    if (resample) af.push('aresample=' + sr * 16, 'asetrate=' + Math.round(sr * 16 * b), 'aresample=' + sr);
    af.push('apad=whole_len=' + nOut, 'atrim=end_sample=' + nOut);
    const out = path.join(outDir, key + '.wav');
    execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', a.file, '-af', af.join(','), '-c:a', 'pcm_f32le', out]);
    const m = G.measure(out), p = G.probe(out);
    stems[key] = { file: rel(out), from: rel(a.file), fileStartS: round(f0, 4), seconds: round(G.seconds(p), 3), srate: +p.sample_rate, channels: p.channels,
      firstSoundS: round(from + m.firstSound, 3), I: m.I, truePeak: m.truePeak, LRA: m.LRA };
  }
  const A = { aligned: iso(Date.now()), scoreSavedNow: S.saved, offsetS: round(offsetS, 4), a: fit.a, b: fit.b,
    matched: fit.matched, kept: fit.kept, of: fit.of, coarse: fit.coarse + '/' + fit.coarseOf, spreadMs: fit.spreadMs,
    driftMs: round(driftMs, 2), ppm: round((fit.b - 1) * 1e6, 1), resampled: resample, limitMs: limit, seconds: round(D), stems };
  writeJson(path.join(dir, 'align.json'), A);
  T = Object.assign(T, { state: 'aligned', align: { offsetS: A.offsetS, driftMs: A.driftMs, ppm: A.ppm, resampled: resample, matched: fit.matched, of: fit.of, spreadMs: fit.spreadMs } });
  writeJson(takeFile(score, nn), T);
  log('3. ALIGNED · take ' + nn + ' of ' + score + ' · score time ' + from + ' s sits ' + A.offsetS + ' s into the recording · ' + fit.matched + ' of ' + fit.of + ' notes met (±' + fit.spreadMs + ' ms)');
  log('   drift: ' + A.driftMs + ' ms over ' + round(span, 1) + ' s (' + A.ppm + ' ppm — the page\'s clock against the audio clock) → ' + (resample ? 'RESAMPLED onto the score\'s clock' : 'left (under ' + limit + ' ms)'));
  log('   players  ' + stems.players.file + ' · ' + stems.players.seconds + ' s · first sound ' + stems.players.firstSoundS + ' s (the first note ' + onsets[0] + ' s) · ' + stems.players.I + ' LUFS · ' + stems.players.truePeak + ' dBTP');
  log('   elec     ' + stems.elec.file + ' · ' + stems.elec.seconds + ' s · first sound ' + stems.elec.firstSoundS + ' s · ' + stems.elec.I + ' LUFS · ' + stems.elec.truePeak + ' dBTP');
  if (S.saved !== T.scoreSaved) log('   NOTE: ' + score + ' was saved again after the take began (' + S.saved.slice(0, 16) + ') — the alignment read the score as it is NOW');
  if (fit.matched < fit.of * 0.8) log('   WARNING: fewer than four notes in five were found in the recording — look before trusting this take');
  const silent = m => m.I == null || m.I <= -69;         // ebur128 says −70.0 LUFS for nothing at all
  if (silent(stems.elec)) log('   WARNING: THE ELECTRONICS\' STEM IS SILENT — was the engine up, and the page telling it?');
  if (silent(stems.players)) log('   WARNING: THE PLAYERS\' STEM IS SILENT');
  return A;
}

// ================================================================ mix
function mix() {
  const pick = pickTake(), { score, nn, dir, T } = pick;
  if (arg('players', 'live') !== 'live') die('--players offline is not built (PLAN 2.8, step 2 e): the players re-rendered offline under this take\'s electronics');
  if (arg('splice', null)) die('--splice is not built (PLAN 2.8, step 3 e): section takes joined — one take is the way so far');
  const af = path.join(dir, 'align.json');
  if (!fs.existsSync(af)) die('take ' + nn + ' of ' + score + ' is not aligned — node tools/take.js align --score ' + score + ' --take ' + nn);
  const A = readJson(af), S = readScore(score);
  const whole = T.from <= 1e-6 && T.to >= S.end - 0.5;
  const NAME = arg('out', null) || (whole ? score : null);
  if (!NAME) die('take ' + nn + ' covers ' + T.from + ' … ' + T.to + ' s of a piece ' + round(S.end, 1) + ' s long — a part may not write the piece\'s WAV: say --out <name>');
  const PEAK = +arg('peak', -1), UP = flag('up'), MAXUP = arg('maxUp', null) == null ? null : +arg('maxUp'), ELEC_DB = +arg('elec-db', 0);
  // AS HE HEARD THEM: both stems were recorded post-fader, before the master. REC's own fader is not in his monitoring (REC does
  // not feed the master), so it is undone; the master's fader is in it, so it is applied.
  const playersDb = round(-T.faders.rec + T.faders.master, 3), elecDb = round(ELEC_DB + T.faders.master, 3);
  fs.mkdirSync(RAWDIR, { recursive: true });
  const RAW = path.join(RAWDIR, NAME + '-float.wav'), OUT = path.join(AUDIODIR, NAME + '.wav');
  const P = path.join(ROOT, A.stems.players.file), E = path.join(ROOT, A.stems.elec.file);
  const fmt = 'aformat=sample_fmts=fltp:channel_layouts=stereo';
  // a take that begins inside the piece is laid at its own time: the WAV is on score time, sample 0 = 0 s
  const lead = T.from > 1e-6 ? ',adelay=' + Math.round(T.from * A.stems.players.srate) + 'S:all=1' : '';
  const graph = '[0:a]' + fmt + ',volume=' + playersDb + 'dB[p];[1:a]' + fmt + ',volume=' + elecDb + 'dB[e];[p][e]amix=inputs=2:normalize=0:duration=longest' + lead + ',aresample=48000[m]';
  execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-i', P, '-i', E, '-filter_complex', graph, '-map', '[m]', '-c:a', 'pcm_f32le', RAW]);
  const probe = G.probe(RAW), secs = G.seconds(probe), m = G.measure(RAW);
  const gf = G.gainFor(m.truePeak, { peak: PEAK, up: UP, maxUp: MAXUP });
  G.writeGain(RAW, OUT, gf.gain);
  const m2 = G.measure(OUT);
  const firstNote = onsetsOf(S.obj, T.from, T.to)[0];
  log('1. the mix · take ' + nn + ' of ' + score + ' · players ' + playersDb + ' dB · electronics ' + elecDb + ' dB' + (ELEC_DB ? ' (--elec-db ' + ELEC_DB + ')' : ' (as heard)'));
  log('2. ' + rel(RAW) + ' · ' + probe.codec_name + ' · ' + probe.sample_rate + ' Hz · ' + probe.channels + ' ch · ' + secs.toFixed(3) + ' s');
  log('   true peak ' + m.truePeak + ' dBTP · sample peak ' + m.samplePeak + ' dBFS · ' + m.I + ' LUFS · LRA ' + m.LRA + ' LU · first sound at ' + round(m.firstSound) + ' s');
  if (gf.gain !== gf.wanted) log('   the gain up to --peak would be ' + gf.wanted + ' dB — capped at --maxUp ' + MAXUP + ' dB');
  log('3. ' + rel(OUT) + ' · 24-bit · gain ' + gf.gain + ' dB (plain, no limiter) → true peak ' + m2.truePeak + ' dBTP · ' + m2.I + ' LUFS');
  log('   sync: the first note in the score ' + firstNote + ' s · the first sound in the file ' + round(m.firstSound) + ' s (a sampler\'s attack lands a few ms after)');
  writeJson(path.join(RAWDIR, NAME + '-render.json'), { score, name: NAME, kind: 'take', take: nn, takeDir: rel(dir), rendered: iso(Date.now()), from: T.from, to: T.to,
    stems: { playersDb, elecDb, elecDial: ELEC_DB, faders: T.faders }, align: { offsetS: A.offsetS, driftMs: A.driftMs, ppm: A.ppm, resampled: A.resampled, matched: A.matched, of: A.of, spreadMs: A.spreadMs },
    raw: probe, seconds: secs, float: m, gainDb: gf.gain, up: UP, maxUp: MAXUP, final: m2, firstNote, engine: T.engine, scoreSaved: T.scoreSaved, recordedAt: T.recordedAt });
  writeJson(takeFile(score, nn), Object.assign(T, { state: 'mixed', mixed: { name: NAME, at: iso(Date.now()), gainDb: gf.gain, elecDb: ELEC_DB } }));
}

// ================================================================ list
function list() {
  const scores = arg('score', null) ? [arg('score')] : scoresWithTakes();
  let n = 0;
  for (const s of scores) for (const nn of takesOf(s)) {
    const T = readJson(takeFile(s, nn)); n++;
    log(s + ' · take ' + nn + ' · ' + T.state + ' · ' + T.from + ' … ' + T.to + ' s · recorded ' + String(T.recordedAt).slice(0, 16)
      + (T.align ? ' · offset ' + T.align.offsetS + ' s · drift ' + T.align.driftMs + ' ms' + (T.align.resampled ? ' (resampled)' : '') + ' · ' + T.align.matched + '/' + T.align.of + ' notes' : '')
      + (T.mixed ? ' · mixed → ' + T.mixed.name + '.wav (' + T.mixed.gainDb + ' dB)' : ''));
  }
  if (!n) log('no take yet');
  if (fs.existsSync(CURRENT)) { const c = readJson(CURRENT); log('RECORDING NOW: take ' + c.take + ' of ' + c.score + ' (since ' + c.recordedAt + ')'); }
}

module.exports = { fitTake, onsetsOf, lineFit, nearest };
if (require.main === module) {
  (async () => {
    if (cmd === 'start') await start();
    else if (cmd === 'stop') await stop();
    else if (cmd === 'align') align(pickTake());
    else if (cmd === 'mix') mix();
    else if (cmd === 'list') list();
    else { log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 30).join('\n')); process.exit(cmd ? 2 : 0); }
  })().catch(e => { console.error('TAKE: ' + (e.plain ? e.message : (e.stack || e.message))); process.exit(1); });
}
