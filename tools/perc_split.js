#!/usr/bin/env node
// perc_split.js — ONE VOICE, ONE TRACK for the Spitfire percussion (his rule 2026-11-10, RUNNING_LOG §148: "the rim on its own track, and let this
// be a potential solution for any others as well — if woodblock felt mallets is too quiet, make another track for only woodblock felt and use
// the track's volume knob"). A Spitfire instrument's volume cannot be moved by MIDI (never CC7), so a beater block that sits far from the
// others on its track gets ITS OWN track: the source track CLONED as text (tools/aro_state.js clone — the same loaded preset, so no hand
// load), the next free channel of the percussion port as its input, the selection split (the source row keeps the other beaters, a new row
// carries this one), the recipe regenerated (tools/apply_perc.js). The notes keep their technique key; the channel comes from the recipe.
// Then section_gains.js sets the new track's level. Idempotent: a track already there is re-pointed, never cloned twice.
//
//   node tools/perc_split.js <slug> "<Beater>" [--name "<track name>"] [--dry]
//   e.g.  node tools/perc_split.js wood_blocks "Soft Mallets"        → track "Wood Blocks Soft Mallets ARO" on SWPerc ch 14
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2), dry = args.includes('--dry');
const arg = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] != null ? args[i + 1] : d; };
const [slug, beater] = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
const die = (m) => { console.error(m); process.exit(2); };
if (!slug || !beater) die('usage: perc_split.js <slug> "<Beater>" [--name "<track>"] [--dry]');
const SELF = path.join(ROOT, 'bank', 'perc_selection.json'), CAT = JSON.parse(fs.readFileSync(path.join(ROOT, 'bank', 'aro_percussion_catalog.json'), 'utf8'));
const sel = JSON.parse(fs.readFileSync(SELF, 'utf8')), port = sel.port || 'SWPerc';
const e = CAT.instruments[slug] || die('no catalog entry ' + slug);
const beaters = [...new Set(e.allInOne.map((k) => k.beater || ''))]; if (!beaters.includes(beater)) die(slug + ' has no beater "' + beater + '" — it has: ' + beaters.join(' · '));
const rows = sel.instruments.filter((r) => r.slug === slug); if (!rows.length) die(slug + ' is not in the selection');
const already = rows.find((r) => r.beaters && r.beaters.length === 1 && r.beaters[0] === beater);
const src = rows.find((r) => !r.beaters || r.beaters.includes(beater)) || rows[0];
const SPEC = fs.readFileSync(path.join(ROOT, 'reaper', 'bridge', 'jobs', 'make_perc_tracks.lua'), 'utf8');
const trackOf = (ch) => (new RegExp('\\{ name = "([^"]+)",\\s*channel = ' + ch + '\\b').exec(SPEC) || [])[1];
const srcTrack = trackOf(src.channel) || die('no track in make_perc_tracks.lua for channel ' + src.channel);
const used = new Set(sel.instruments.map((r) => r.channel)); let ch = already ? already.channel : null; if (ch == null) for (let c = 1; c <= 16; c++) if (!used.has(c)) { ch = c; break; }
if (ch == null) die('no free channel on ' + port);
const name = arg('name', e.name.replace(/\s*\(.*\)\s*/g, ' ').trim() + ' ' + beater + ' ARO');
console.log(slug + ' · "' + beater + '" ← track "' + srcTrack + '" (ch ' + src.channel + ') → track "' + name + '" on ' + port + ' ch ' + ch + (already ? ' (already in the selection)' : ''));
if (dry) { console.log('(dry: nothing done)'); process.exit(0); }
const job = (code) => { const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'reaper_job.js'), '-e', code], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); let j; try { j = JSON.parse(r.stdout); } catch (x) { die('the bridge did not answer: ' + (r.stdout || r.stderr).slice(0, 300)); } return j.result; };
// 1 · the track: cloned if absent
const exists = job('for i=0,reaper.CountTracks(0)-1 do local _,n=reaper.GetTrackName(reaper.GetTrack(0,i)) if n==' + JSON.stringify(name) + ' then return true end end return false');
if (!exists) { const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'aro_state.js'), 'clone', srcTrack, name, '--push'], { encoding: 'utf8' }); const last = (r.stdout || r.stderr).trim().split('\n').pop(); console.log('  cloned: ' + last.slice(0, 160)); }
else console.log('  the track exists — re-pointed');
// 2 · its input: the port by name, this channel, armed, monitoring
const inp = job('local dev for d=0,reaper.GetNumMIDIInputs()-1 do local ok,n=reaper.GetMIDIInputName(d,"") if ok and n==' + JSON.stringify(port) + ' then dev=d end end if not dev then return {error="no port"} end for i=0,reaper.CountTracks(0)-1 do local tr=reaper.GetTrack(0,i) local _,n=reaper.GetTrackName(tr) if n==' + JSON.stringify(name) + ' then reaper.SetMediaTrackInfo_Value(tr,"I_RECINPUT",4096+dev*32+' + ch + ') reaper.SetMediaTrackInfo_Value(tr,"I_RECMON",1) reaper.SetMediaTrackInfo_Value(tr,"I_RECARM",1) reaper.SetMediaTrackInfo_Value(tr,"I_RECMODE",0) return {ok=true,input=reaper.GetMediaTrackInfo_Value(tr,"I_RECINPUT")} end end return {error="no track"}');
console.log('  input: ' + JSON.stringify(inp));
// 3 · the selection: the beater leaves the source row, a row of its own
if (!already) {
    src.beaters = (src.beaters || beaters).filter((b) => b !== beater);
    sel.instruments.push({ slug, channel: ch, beaters: [beater], track: name, _why: '§148: one voice, one track — tools/perc_split.js ' + new Date().toISOString().slice(0, 10) });
    fs.writeFileSync(SELF, JSON.stringify(sel, null, 1) + '\n');
}
// 4 · the record in make_perc_tracks.lua (a row, so the next rebuild knows the track) and perc_inputs.lua
for (const [file, row] of [['make_perc_tracks.lua', '  { name = ' + JSON.stringify(name) + ',' + ' '.repeat(Math.max(1, 26 - name.length)) + 'channel = ' + ch + ', slug = ' + JSON.stringify(slug) + ' },   -- perc_split.js: "' + beater + '" on its own track (§148)'], ['perc_inputs.lua', '  { name = ' + JSON.stringify(name) + ',' + ' '.repeat(Math.max(1, 26 - name.length)) + 'channel = ' + ch + ' },']]) {
    const f = path.join(ROOT, 'reaper', 'bridge', 'jobs', file); let s = fs.readFileSync(f, 'utf8'); if (s.includes(JSON.stringify(name))) continue;
    const i = s.indexOf('\n}', s.indexOf('local SPEC = {')); s = s.slice(0, i) + '\n' + row + s.slice(i); fs.writeFileSync(f, s);
}
// 5 · the recipe
const ap = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools', 'apply_perc.js')], { encoding: 'utf8' }); console.log('  ' + (ap.stdout || ap.stderr).trim().split('\n')[0].slice(0, 120));
console.log('done: "' + name + '" on ' + port + ' ch ' + ch + ' · the notes keep their technique; section_gains.js sets the level; his CTRL+S saves the track');
