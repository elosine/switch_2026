#!/usr/bin/env node
// render_stems.js — THE DEMO RECORDING, steps 2 … 3 (PLAN § 2r; RUNNING_LOG §456): every stem of tools/stems_plan.js played ALONE through
// a COPY of the rack and rendered to its own audio file. The rack itself is never written (tools/render_reaper.js' way).
//
//   node tools/render_stems.js --score <save> [--stems 12,45] [--out H:/switch_2026/audio/demo] [--tail 6] [--keep-tab]
//   --stems: only these stems (their numbers in midi/<save>/stems.json) — one note changed, ONLY its stem rendered again
//
// Needs: node tools/stems_plan.js first · Reaper open with the rack, saved, the bridge alive.
//
// HOW: no instrument track of the rack feeds another (each sends to the master and to REC), so a track's own output is its whole sound.
// A PASS puts ONE stem's MIDI on each rack track that still has one and renders every such track to its own file in one go (Reaper's
// "stems, selected tracks", post-FX, post-fader, no master). The passes number the most stems on any one track (19), not the stems (120).
// Each track's stems go longest-first, so the late passes end early. A pass runs from 0:00 (every CC and bend from the piece's start is
// in the stem's MIDI, so the sampler is in the state the whole piece leaves it in) to its last note-off + --tail.
// AFTER a pass each track's file is cut to its stem's own span (0.5 s before its first note … its last note-off + --tail; ffmpeg, 32-bit
// float kept, so a peak over 0 dBFS is measured, never clipped) and the pass's raw files are deleted.
// Out: <out>/<save>/stems/NN <track> - <technique> - <dyn>.wav · midi/<save>/stems_audio.json (each stem's file · where it starts · length)
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const score = arg('score') || (console.error('--score <save>'), process.exit(2));
const TAIL = +arg('tail', 6), PRE = 0.5;
const ONLY = arg('stems', null) ? arg('stems').split(',').map(Number) : null;
const OUTROOT = path.resolve(arg('out', 'H:/switch_2026/audio/demo'), score);
const STEMDIR = path.join(OUTROOT, 'stems'), RAWDIR = path.join(OUTROOT, 'raw');
const RACK = path.join(ROOT, 'reaper', 'switch_rack.rpp');
const RPP = path.join(ROOT, 'reaper', score + '_stems_render.rpp');
const AUDIOJSON = path.join(ROOT, 'midi', score, 'stems_audio.json');
const G = require('./lib/gain_step.js');
const { PLACE_LUA, writeEvt } = require('./reaper_midi_place.js');
const log = s => console.log(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const L = s => '[[' + s + ']]';

const B = process.env.REAPER_BRIDGE || path.join(process.env.APPDATA, 'REAPER', 'bridge');
const heartbeat = () => { try { const h = JSON.parse(fs.readFileSync(path.join(B, 'heartbeat.json'), 'utf8')); return Object.assign(h, { ageS: Date.now() / 1000 - h.time }); } catch (e) { return null; } };
function openProjectStem() { const h = heartbeat(); return (h && h.project) ? path.basename(h.project, path.extname(h.project)) : 'switch_rack'; }
function job(lua, timeoutMs = 20000) {
  const r = spawnSync(process.execPath, [path.join(__dirname, 'reaper_job.js'), '-e', lua],
    { encoding: 'utf8', env: Object.assign({}, process.env, { REAPER_PROJECT: openProjectStem(), BRIDGE_TIMEOUT_MS: String(timeoutMs) }), timeout: timeoutMs + 10000 });
  let j = null; try { j = JSON.parse(r.stdout); } catch (e) { }
  if (!j || !j.ok) throw new Error('bridge job failed: ' + ((r.stdout || '') + (r.stderr || '')).trim().slice(0, 800));
  return j.result;
}
const GUARD = `local _, p = reaper.EnumProjects(-1, '')\nif p:lower() ~= (${L(RPP)}):lower() then return { error = 'wrong project: ' .. p } end\n`;

(async () => {
  const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'midi', score, 'stems.json'), 'utf8'));
  let stems = plan.stems.filter(s => !ONLY || ONLY.includes(s.n));
  if (!stems.length) throw new Error('no stems' + (ONLY ? ' numbered ' + ONLY.join(',') : ''));
  // the passes: each track's stems longest-first; pass k = the k-th stem of every track that has one
  const byTrack = new Map();
  for (const s of stems) (byTrack.get(s.track) || byTrack.set(s.track, []).get(s.track)).push(s);
  for (const a of byTrack.values()) a.sort((x, y) => y.t1 - x.t1);
  const nPass = Math.max(...[...byTrack.values()].map(a => a.length));
  const passes = []; for (let k = 0; k < nPass; k++) passes.push([...byTrack.values()].filter(a => a[k]).map(a => a[k]));
  log(stems.length + ' stems on ' + byTrack.size + ' rack tracks → ' + nPass + ' passes');

  const hb = heartbeat();
  if (!hb || hb.ageS > 5) throw new Error('the Reaper bridge is not alive (heartbeat ' + (hb ? hb.ageS.toFixed(0) + ' s old' : 'missing') + ')');
  const st = job(`local _, p = reaper.EnumProjects(-1, '') return { path = p, dirty = reaper.IsProjectDirty(0) }`);
  if (String(st.path).toLowerCase() !== RPP.toLowerCase()) {
    if (/switch_rack\.rpp$/i.test(st.path) && st.dirty) throw new Error('the rack has unsaved changes — save it in Reaper first (the render copies the file)');
    fs.copyFileSync(RACK, RPP);
    const opened = job(`reaper.Main_OnCommand(40859, 0)\nreaper.Main_openProject('noprompt:' .. ${L(RPP)})\nlocal _, p = reaper.EnumProjects(-1, '')\nreturn { path = p, tracks = reaper.CountTracks(0) }`, 1200000);
    if (!opened.path || opened.path.toLowerCase() !== RPP.toLowerCase()) throw new Error('the render project did not open: ' + JSON.stringify(opened));
    for (let w = Date.now(); ; await sleep(250)) {   // the heartbeat must name the new tab before the next job's guard reads it
      const h = heartbeat();
      if (h && h.project && path.basename(h.project).toLowerCase() === path.basename(RPP).toLowerCase()) break;
      if (Date.now() - w > 30000) throw new Error('the heartbeat never named the render tab: ' + JSON.stringify(h));
    }
    log('the copy of the rack is open in a new tab · ' + opened.tracks + ' tracks · ' + path.relative(ROOT, RPP));
  } else log('the render tab is already open — going on in it');
  fs.mkdirSync(STEMDIR, { recursive: true });

  const audio = fs.existsSync(AUDIOJSON) ? JSON.parse(fs.readFileSync(AUDIOJSON, 'utf8')) : { score, dir: STEMDIR, stems: {} };
  const T0 = Date.now();
  for (let k = 0; k < passes.length; k++) {
    const P = passes[k], END = +(Math.max(...P.map(s => s.t1)) + TAIL).toFixed(3);
    const dir = path.join(RAWDIR, 'pass' + String(k + 1).padStart(2, '0'));
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const evts = P.map(s => writeEvt(path.join(ROOT, s.file)));
    const setup = job(GUARD + `reaper.PreventUIRefresh(1)
reaper.SetCurrentBPM(0, 60, false)
${PLACE_LUA}
for i = 0, reaper.CountTracks(0) - 1 do
  local tr = reaper.GetTrack(0, i)
  for j = reaper.CountTrackMediaItems(tr) - 1, 0, -1 do reaper.DeleteTrackMediaItem(tr, reaper.GetTrackMediaItem(tr, j)) end
  reaper.SetTrackSelected(tr, false)
end
local files = { ${P.map((s, i) => '{ ' + L(s.track) + ', ' + L(evts[i].file) + ', ' + L(s.name) + ' }').join(', ')} }
local placed, problems = {}, {}
for _, f in ipairs(files) do
  local tr = nil
  for i = 0, reaper.CountTracks(0) - 1 do
    local t = reaper.GetTrack(0, i)
    local _, n = reaper.GetTrackName(t)
    if n == f[1] then tr = t break end
  end
  if not tr then problems[#problems + 1] = 'no track ' .. f[1] else
    local okp, notes = pcall(place, tr, f[3], f[2], ${END})
    if not okp then problems[#problems + 1] = 'not placed ' .. f[3] .. ': ' .. tostring(notes) else
      reaper.SetTrackSelected(tr, true)
      placed[#placed + 1] = { name = f[3], notes = notes, mute = reaper.GetMediaTrackInfo_Value(tr, 'B_MUTE') }
    end
  end
end
local S = function(k, v) reaper.GetSetProjectInfo_String(0, k, v, true) end
local N = function(k, v) reaper.GetSetProjectInfo(0, k, v, true) end
S('RENDER_FILE', ${L(dir)}) S('RENDER_PATTERN', '$track') S('RENDER_FORMAT', 'ZXZhdyAAAQ==')
N('RENDER_SETTINGS', 3) N('RENDER_BOUNDSFLAG', 0) N('RENDER_STARTPOS', 0) N('RENDER_ENDPOS', ${END}) N('RENDER_SRATE', 48000)
N('RENDER_CHANNELS', 2) N('RENDER_TAILFLAG', 0) N('RENDER_ADDTOPROJ', 0) N('RENDER_DITHER', 0)
pcall(N, 'RENDER_NORMALIZE', 0)
reaper.PreventUIRefresh(-1)
reaper.UpdateArrange()
return { placed = placed, problems = problems, selected = reaper.CountSelectedTracks(0), settings = reaper.GetSetProjectInfo(0, 'RENDER_SETTINGS', 0, false) }`, 300000);
    if (setup.error) throw new Error(setup.error);
    const placed = setup.placed || [];
    if ((setup.problems || []).length || placed.length !== P.length) throw new Error('pass ' + (k + 1) + ' placement: ' + JSON.stringify(setup.problems));
    const mis = placed.filter((p, i) => p.notes !== evts[i].on);
    if (mis.length) throw new Error('pass ' + (k + 1) + ': note counts differ in Reaper: ' + JSON.stringify(mis));
    if (setup.selected !== P.length) throw new Error('pass ' + (k + 1) + ': ' + setup.selected + ' tracks selected, ' + P.length + ' wanted');
    const muted = placed.filter(p => p.mute === 1).map(p => p.name);
    if (muted.length) log('   NOTE: muted in the rack, so silent: ' + muted.join(' · '));

    const t0 = Date.now();
    job(`reaper.defer(function() reaper.Main_OnCommand(42230, 0) end) return { queued = true }`);
    const want = P.map(s => path.join(dir, s.track + '.wav'));
    // the render is over when Reaper answers again (its heartbeat stops while it renders) and the folder has stopped growing
    let last = -1, stable = 0;
    await sleep(4000);
    while (true) {
      await sleep(3000);
      const sum = fs.readdirSync(dir).reduce((a, f) => a + fs.statSync(path.join(dir, f)).size, 0);
      const h = heartbeat();
      stable = (sum > 0 && sum === last && h && h.ageS < 3) ? stable + 1 : 0;
      last = sum;
      if (stable >= 2) break;
      if (Date.now() - t0 > 60 * 60000) throw new Error('pass ' + (k + 1) + ' did not finish in 60 minutes (files: ' + fs.readdirSync(dir).join(', ') + ')');
    }
    const lack = want.filter(f => !fs.existsSync(f));
    if (lack.length) throw new Error('pass ' + (k + 1) + ': the render wrote ' + fs.readdirSync(dir).join(', ') + ' — missing ' + lack.map(f => path.basename(f)).join(', '));
    // cut each track's file to its stem's own span
    for (const s of P) {
      const at = Math.max(0, +(s.t0 - PRE).toFixed(3)), len = +(Math.min(END, s.t1 + TAIL) - at).toFixed(3);
      const out = path.join(STEMDIR, s.name + '.wav');
      execFileSync(G.FF, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(at), '-t', String(len), '-i', path.join(dir, s.track + '.wav'), '-c:a', 'pcm_f32le', out]);
      audio.stems[s.n] = { n: s.n, name: s.name, track: s.track, technique: s.technique, dyn: s.dyn, notes: s.notes, file: out, at, len, rendered: new Date().toISOString() };
    }
    fs.rmSync(dir, { recursive: true, force: true });
    fs.writeFileSync(AUDIOJSON, JSON.stringify(audio, null, 1));
    log('pass ' + String(k + 1).padStart(2) + ' of ' + passes.length + ' · ' + P.length + ' stems · 0 → ' + END + ' s · ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
  }
  if (!process.argv.includes('--keep-tab')) {
    const closed = job(GUARD + `for i = 0, reaper.CountTracks(0) - 1 do
  local tr = reaper.GetTrack(0, i)
  for j = reaper.CountTrackMediaItems(tr) - 1, 0, -1 do reaper.DeleteTrackMediaItem(tr, reaper.GetTrackMediaItem(tr, j)) end
end
reaper.Main_SaveProject(0, false)
reaper.Main_OnCommand(40860, 0)
local _, q = reaper.EnumProjects(-1, '')
return { current = q }`, 120000);
    if (closed.error) throw new Error(closed.error);
    log('the render tab is closed · current: ' + path.basename(closed.current || '?'));
  }
  try { fs.rmSync(RAWDIR, { recursive: true, force: true }); } catch (e) { }
  log('DONE · ' + stems.length + ' stems in ' + ((Date.now() - T0) / 60000).toFixed(1) + ' min · ' + STEMDIR + ' · ' + path.relative(ROOT, AUDIOJSON));
})().catch(e => { console.error('STEMS RENDER FAILED: ' + e.message); process.exit(1); });
