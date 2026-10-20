-- sound_check_vkb.lua — does each track SOUND, with no MIDI port involved? (the new-piece protocol's 4.2 · 4.6;
-- RUNNING_LOG §19, 2026-10-04). Written to prove a CLONED track (tools/build_rack.js) apart from its port:
-- for each LIST row, in turn, the track's input is switched to Reaper's Virtual MIDI Keyboard, one note is
-- stuffed into that queue (reaper.StuffMIDIMessage mode 0), the track's meter is watched, the note is released
-- and the input is put back exactly as it was. Writes outbox/sound_check.json when done. Never saves.
--   node tools/reaper_job.js run reaper/bridge/jobs/sound_check_vkb.lua     (then read the file after ~3.5 s per row)
-- A row: name · note (MIDI, sounding) · ch (1-based, default 1) · cc1 (optional: the mod wheel first — an Xsample
-- `MW` preset is silent at wheel 0).
local LIST = {
  { name = 'Cello XS',         note = 57 },
  { name = 'Viola XS',         note = 64 },
  { name = 'Bass Clarinet XS', note = 50 },
}
local HOLD_S, TAIL_S, VEL = 2.0, 0.8, 80
local VKB = 4096 + 62 * 32      -- MIDI · the Virtual MIDI Keyboard · all channels

local sep = package.config:sub(1, 1)
local outpath = job.root .. sep .. 'outbox' .. sep .. 'sound_check.json'
os.remove(outpath)
local function dB(v) if v > 0 then return math.floor(20 * math.log(v, 10) * 10 + 0.5) / 10 end return -150 end
local function find(name)
  for i = 0, reaper.CountTracks(0) - 1 do
    local tr = reaper.GetTrack(0, i); local _, n = reaper.GetTrackName(tr)
    if n == name then return tr end
  end
end
local results, idx, phase, t0, cur = {}, 0, 'next', 0, nil
local function finish()
  local parts = {}
  for _, r in ipairs(results) do
    parts[#parts + 1] = string.format('  {"name": "%s", "found": %s, "note": %d, "peakDb": [%s, %s, %s, %s], "inputRestored": %s}',
      r.name, tostring(r.found), r.note, dB(r.max[1]), dB(r.max[2]), dB(r.max[3]), dB(r.max[4]), tostring(r.restored))
  end
  local f = io.open(outpath, 'wb')
  if f then f:write('{\n "rows": [\n' .. table.concat(parts, ',\n') .. '\n ]\n}\n'); f:close() end
end
local function loop()
  local now = reaper.time_precise()
  if phase == 'next' then
    idx = idx + 1
    local row = LIST[idx]
    if not row then finish(); return end
    local tr = find(row.name)
    cur = { name = row.name, note = row.note, found = tr ~= nil, max = { 0, 0, 0, 0 }, restored = false, tr = tr, st = 0x90 + ((row.ch or 1) - 1), row = row }
    results[#results + 1] = cur
    if tr then
      cur.oldInput = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
      reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', VKB)
      if row.cc1 then reaper.StuffMIDIMessage(0, 0xB0 + ((row.ch or 1) - 1), 1, row.cc1) end
      phase, t0 = 'arm', now
    end
  elseif phase == 'arm' and now - t0 > 0.3 then
    reaper.StuffMIDIMessage(0, cur.st, cur.note, VEL); phase, t0 = 'hold', now
  elseif phase == 'hold' or phase == 'tail' then
    for c = 1, 4 do local v = reaper.Track_GetPeakInfo(cur.tr, c - 1); if v > cur.max[c] then cur.max[c] = v end end
    if phase == 'hold' and now - t0 > HOLD_S then reaper.StuffMIDIMessage(0, cur.st - 0x10, cur.note, 0); phase, t0 = 'tail', now
    elseif phase == 'tail' and now - t0 > TAIL_S then
      reaper.SetMediaTrackInfo_Value(cur.tr, 'I_RECINPUT', cur.oldInput)
      cur.restored = reaper.GetMediaTrackInfo_Value(cur.tr, 'I_RECINPUT') == cur.oldInput
      phase = 'next'
    end
  end
  reaper.defer(loop)
end
reaper.defer(loop)
return { rows = #LIST, file = outpath, seconds = #LIST * (0.3 + HOLD_S + TAIL_S) }
