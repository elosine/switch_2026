#!/usr/bin/env node
// set_track_chunk.js — a track chunk from a FILE set onto a named track of the running rack (the MIDI shore-up, 2026-11-10, RUNNING_LOG
// §143). The file is what tools/build_rack.js --emit-src writes: an earlier rack's track, its plugin state carried byte-exact, NAME rewritten,
// REC cleared. The track must already exist (make_perc_tracks.lua makes the empty one); after the set its input is gone — run
// perc_inputs.lua (or make_tracks.lua) to give it back. The read-back is the verdict: the track's name and its first FX.
//
//   node tools/set_track_chunk.js "Brake Drums ARO" path/to/chunk.txt
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [track, file] = process.argv.slice(2);
if (!track || !file || !fs.existsSync(file)) { console.error('usage: set_track_chunk.js "<track>" <chunk file>'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..');
const chunk = fs.readFileSync(file, 'latin1');
if (!/^\s*<TRACK/.test(chunk)) { console.error('not a track chunk (no <TRACK at the top)'); process.exit(2); }
const tmp = path.join(ROOT, 'reaper', 'bridge', 'set_chunk_' + process.pid + '.lua');
fs.writeFileSync(tmp, 'local want = ' + JSON.stringify(track) + '\nlocal chunk = [==[\n' + chunk + '\n]==]\n' +
    'for i = 0, reaper.CountTracks(0) - 1 do\n  local tr = reaper.GetTrack(0, i); local _, n = reaper.GetTrackName(tr)\n  if n == want then\n' +
    '    local ok = reaper.SetTrackStateChunk(tr, chunk, false)\n    local _, name = reaper.GetTrackName(tr); local _, fx = reaper.TrackFX_GetFXName(tr, 0, "")\n' +
    '    reaper.TrackList_AdjustWindows(false)\n    return { index = i + 1, set = ok, name = name, fx = fx, nfx = reaper.TrackFX_GetCount(tr) }\n  end\nend\nerror("no track named " .. want)\n', 'latin1');
const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), 'run', tmp], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
try { fs.unlinkSync(tmp); } catch (e) {}
let j; try { j = JSON.parse(r.stdout); } catch (e) { console.error('the bridge did not answer: ' + (r.stdout || r.stderr).slice(0, 400)); process.exit(1); }
if (!j.ok || !j.result || !j.result.set) { console.error('not set: ' + JSON.stringify(j.result || j.error || j).slice(0, 400)); process.exit(1); }
console.log('set on track ' + j.result.index + ' "' + j.result.name + '" · FX: ' + j.result.fx + ' (' + j.result.nfx + ')');
