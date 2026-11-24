#!/usr/bin/env node
// ctpt_balance.js — THE COUNTERPOINT'S BALANCE, NOTE BY NOTE (PLAN 2r step 6, RUNNING_LOG §463 · §464). It replaces §459's faders for 200 … 253 s.
//
//   node tools/ctpt_balance.js --score <save> --lua <out.lua>      computes, writes midi/<save>/ctpt_balance.json and the Reaper job; touches nothing
//
// THE READING: each note (notes struck together are one) by its LOUDEST 100 ms, K-weighted, anywhere in ITS WHOLE SOUND, from its start to the stem's
// next note or 3 s, so a scrape's swell and ring are counted and a short hit is not averaged with silence.
// THE TARGET: one level per written dynamic, the middle of the stems at that dynamic in THIS section. A note within 1.5 dB is left alone; no note is raised
// more than 6 dB. THE GAIN lives on the audio item, as a take volume line (10 ms ramps just before a note). Every stem's fader goes back to 0 dB: a note
// of a stem outside this section keeps the gain §459's fader gave it, so the other sections do not change.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const arg = n => { const i = process.argv.indexOf('--' + n); return i < 0 ? null : process.argv[i + 1]; };
const score = arg('score'), luaOut = arg('lua');
if (!score || !luaOut) { console.error('usage: node tools/ctpt_balance.js --score <save> --lua <out.lua>'); process.exit(1); }
const dir = path.join(ROOT, 'midi', score), FROM = 200, TO = 253, SR = 48000, HOP = 240, WIN = 20, LEAVE = 1.5, MAXUP = 6;
const plan = JSON.parse(fs.readFileSync(path.join(dir, 'stems.json'), 'utf8')), audio = JSON.parse(fs.readFileSync(path.join(dir, 'stems_audio.json'), 'utf8'));
const bal = JSON.parse(fs.readFileSync(path.join(dir, 'mix_balance.json'), 'utf8'));
const median = a => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r2 = x => Math.round(x * 100) / 100, r4 = x => Math.round(x * 10000) / 10000;
const lufs = p => (p > 1e-20 ? -0.691 + 10 * Math.log10(p) : -200);

function readWav(file) {
  const b = fs.readFileSync(file); let p = 12, d = null;
  while (p + 8 <= b.length && !d) { const id = b.toString('latin1', p, p + 4), n = b.readUInt32LE(p + 4); if (id === 'data') d = [p + 8, Math.min(n, b.length - p - 8)]; p += 8 + n + (n & 1); }
  return new Float32Array(b.buffer.slice(b.byteOffset + d[0], b.byteOffset + d[0] + (d[1] & ~3)));
}
function running(f) {
  const s = new Float64Array(8), nh = Math.floor(f.length / 2 / HOP), sum = new Float64Array(nh + 1);
  const k = (x, c) => { const o = c * 4, y = 1.53512485958697 * x + s[o]; s[o] = -2.69169618940638 * x + 1.69065929318241 * y + s[o + 1]; s[o + 1] = 1.19839281085285 * x - 0.73248077421585 * y; const z = y + s[o + 2]; s[o + 2] = -2 * y + 1.99004745483398 * z + s[o + 3]; s[o + 3] = y - 0.99007225036621 * z; return z; };
  for (let h = 0, i = 0; h < nh; h++) { let a = 0; for (let j = 0; j < HOP; j++, i++) { const l = k(f[2 * i], 0), r = k(f[2 * i + 1], 1); a += l * l + r * r; } sum[h + 1] = sum[h] + a / HOP; }
  return { sum, nh };
}
// the onsets of a stem (notes within 20 ms are one)
function onsets(evt) {
  const on = [];
  for (const l of fs.readFileSync(evt, 'utf8').split(/\r?\n/)) { const v = l.trim().split(/\s+/).map(Number); if (v.length >= 4 && (v[1] & 0xF0) === 0x90 && v[3] > 0) on.push(v[0] / 960); }
  on.sort((a, b) => a - b);
  const out = []; for (const t of on) if (!out.length || t - out[out.length - 1] > 0.02) out.push(t);
  return out;
}

const stems = [];
for (const st of plan.stems) {
  const a = audio.stems[st.n], b = bal.stems.find(x => x.n === st.n), ts = onsets(path.join(ROOT, st.file.replace(/\.mid$/, '.evt')));
  const inside = ts.some(t => t >= FROM && t < TO), row = { n: st.n, name: st.name, track: st.track, dyn: st.dyn, at: a.at, len: a.len, wasFader: b.faderDb, inside, onsets: ts.map(t => ({ t, inside: t >= FROM && t < TO })) };
  if (inside) {
    const A = running(readWav(a.file));
    ts.forEach((t, i) => {
      if (t < FROM || t >= TO) return;
      const h0 = Math.max(0, Math.round((t - a.at) * SR / HOP)), end = Math.round((Math.min(i + 1 < ts.length ? ts[i + 1] : t + 3, t + 3) - a.at) * SR / HOP);
      let best = 0;
      for (let h = h0; h <= Math.max(h0, end - WIN) && h < A.nh; h++) { const e = Math.min(A.nh, h + WIN), v = (A.sum[e] - A.sum[h]) / WIN; if (v > best) best = v; }
      row.onsets[i].level = lufs(best);
    });
    row.level = median(row.onsets.filter(x => x.inside).map(x => x.level));
  }
  stems.push(row);
}
const live = stems.filter(s => s.inside), target = {};
for (const d of ['p', 'f', 'fff']) target[d] = r2(median(live.filter(s => s.dyn === d).map(s => s.level)));
if (!(target.p < target.f && target.f < target.fff)) throw new Error('the targets are out of order: ' + JSON.stringify(target));
for (const s of live) if (target[s.dyn] == null) throw new Error('a dynamic with no target: ' + s.name);

let capped = 0, left = 0, moved = 0; const before = {}, after = {};
const jobs = [];
for (const s of stems) {
  if (!s.inside && s.wasFader === 0) continue;
  const gains = s.onsets.map(o => {
    if (!o.inside) return s.wasFader;
    const gap = target[s.dyn] - o.level;
    let g = gap;
    if (Math.abs(gap) <= LEAVE) { g = 0; left++; } else if (gap > MAXUP) { g = MAXUP; capped++; moved++; } else moved++;
    (before[s.dyn] = before[s.dyn] || []).push(o.level + s.wasFader); (after[s.dyn] = after[s.dyn] || []).push(o.level + g);
    return r2(g);
  });
  // the line, in the item's own time: the first gain from the start, a 10 ms ramp before each note whose gain differs
  const pts = [[0, gains[0]]];
  for (let i = 1; i < gains.length; i++) {
    if (gains[i] === gains[i - 1]) continue;
    const q = s.onsets[i].t - s.at;
    pts.push([r4(Math.max(0.001, q - 0.012)), gains[i - 1]], [r4(Math.max(0.002, q - 0.002)), gains[i]]);
  }
  jobs.push({ name: s.name, was: s.wasFader, pts, check: s.onsets.map((o, i) => [r4(o.t - s.at), gains[i]]) });
}
const span = a => Math.max(...a) - Math.min(...a);
const report = { score, computed: new Date().toISOString(), window: '100 ms over the whole sound', target, notes: { moved, leftAlone: left, heldAtPlus6: capped }, spreadDb: {} };
for (const d of ['p', 'f', 'fff']) report.spreadDb[d] = { before: r2(span(before[d])), after: r2(span(after[d])) };
report.stems = live.map(s => ({ name: s.name, dyn: s.dyn, levelDb: r2(s.level), wasFader: s.wasFader }));
fs.writeFileSync(path.join(dir, 'ctpt_balance.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify({ target, notes: report.notes, spreadDb: report.spreadDb, stemsChanged: jobs.length, points: jobs.reduce((n, j) => n + j.pts.length, 0) }, null, 1));
const scr = live.filter(s => /scrape/.test(s.name)).map(s => s.name + ' read ' + r2(s.level) + ' (was treated as ' + s.wasFader + ' dB up)');
console.log(scr.join('\n'));

const Q = s => JSON.stringify(s);
const data = jobs.map(j => '{name=' + Q(j.name) + ',was=' + j.was + ',pts={' + j.pts.map(p => '{' + p[0] + ',' + p[1] + '}').join(',') + '},check={' + j.check.map(p => '{' + p[0] + ',' + p[1] + '}').join(',') + '}}').join(',\n');
fs.writeFileSync(luaOut, 'local D={' + data + `}
local function db(v) return 20 * math.log(math.max(v, 1e-9), 10) end
local T = {}
for i = 0, reaper.CountTracks(0) - 1 do local t = reaper.GetTrack(0, i); local _, n = reaper.GetTrackName(t); T[n] = t end
for _, s in ipairs(D) do
  local t = T[s.name]
  if not t then return { error = 'no track: ' .. s.name } end
  if math.abs(db(reaper.GetMediaTrackInfo_Value(t, 'D_VOL')) - s.was) > 0.05 then return { error = 'its fader was moved: ' .. s.name } end
  if reaper.CountTrackMediaItems(t) ~= 1 then return { error = 'not one item: ' .. s.name } end
  if reaper.GetTakeEnvelopeByName(reaper.GetActiveTake(reaper.GetTrackMediaItem(t, 0)), 'Volume') then return { error = 'already has a line: ' .. s.name } end
end
reaper.PreventUIRefresh(1)
reaper.Undo_BeginBlock()
reaper.Main_OnCommand(40289, 0)
for _, s in ipairs(D) do reaper.SetMediaItemSelected(reaper.GetTrackMediaItem(T[s.name], 0), true) end
reaper.Main_OnCommand(40693, 0)
local failed
for _, s in ipairs(D) do
  local it = reaper.GetTrackMediaItem(T[s.name], 0)
  local e = reaper.GetTakeEnvelopeByName(reaper.GetActiveTake(it), 'Volume')
  if not e then failed = s.name break end
  local mode = reaper.GetEnvelopeScalingMode(e)
  reaper.DeleteEnvelopePointRange(e, -1, 100000)
  for _, p in ipairs(s.pts) do reaper.InsertEnvelopePoint(e, p[1], reaper.ScaleToEnvelopeMode(mode, 10 ^ (p[2] / 20)), 0, 0, false, true) end
  reaper.Envelope_SortPoints(e)
  reaper.SetMediaTrackInfo_Value(T[s.name], 'D_VOL', 1)
end
reaper.Main_OnCommand(40289, 0)
reaper.Undo_EndBlock('Counterpoint balanced note by note', -1)
reaper.PreventUIRefresh(-1)
if failed then reaper.Undo_DoUndo2(0); reaper.UpdateArrange(); return { error = 'no take line was made on ' .. failed .. '; undone' } end
local worst, checked = 0, 0
for _, s in ipairs(D) do
  local e = reaper.GetTakeEnvelopeByName(reaper.GetActiveTake(reaper.GetTrackMediaItem(T[s.name], 0)), 'Volume')
  local mode = reaper.GetEnvelopeScalingMode(e)
  for _, c in ipairs(s.check) do
    local _, v = reaper.Envelope_Evaluate(e, c[1], 48000, 0)
    local d = math.abs(db(reaper.ScaleFromEnvelopeMode(mode, v)) - c[2])
    if d > worst then worst = d end
    checked = checked + 1
  end
end
if worst > 0.1 then reaper.Undo_DoUndo2(0); reaper.UpdateArrange(); return { error = 'the lines read back wrong by ' .. worst .. ' dB; undone', checked = checked } end
reaper.UpdateArrange()
reaper.Main_SaveProject(0, false)
return { stems = #D, notesChecked = checked, worstErrorDb = worst, dirty = reaper.IsProjectDirty(0) }
`);
