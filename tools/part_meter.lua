-- part_meter.lua — READ ONLY: the peak of ONE track, sampled every defer tick for CFG.seconds, written as a time series to outbox/part_meter.json.
-- The track is found by its MIDI INPUT (CFG.port, a loopMIDI port name; CFG.channel 1 … 16 or 0 = any), so the measurement follows the
-- rack's own routing. Run through tools/reaper_job.js by tools/part_meter.js (RUNNING_LOG §137).
local function devOf(name) for d = 0, reaper.GetNumMIDIInputs() - 1 do local ok, n = reaper.GetMIDIInputName(d, '') if ok and n == name then return d end end return nil end
local dev = devOf(CFG.port); if not dev then return { ok = false, error = 'no MIDI input named ' .. tostring(CFG.port) } end
local tr, trName
for t = 0, reaper.CountTracks(0) - 1 do
  local x = reaper.GetTrack(0, t); local rin = math.floor(reaper.GetMediaTrackInfo_Value(x, 'I_RECINPUT'))
  local _, nm = reaper.GetSetMediaTrackInfo_String(x, 'P_NAME', '', false)
  if CFG.track then   -- CFG.track: the track BY NAME (the MIDI shore-up, §143 — a port whose first track is not the one in question)
    if nm == CFG.track then tr = x; trName = nm; break end
  elseif rin >= 4096 then
    local d = (rin - 4096) >> 5; local ch = (rin - 4096) & 31
    -- the track that filters EXACTLY this channel wins; a track on all channels is the fallback (§146: the piano's all-channel Kontakt track
    -- had been taken for every piano voice, and the prepared piano's tracks never metered)
    if d == dev and (CFG.channel or 0) ~= 0 and ch == CFG.channel then tr = x; trName = nm; break end
    if d == dev and not tr and (ch == 0 or (CFG.channel or 0) == 0) then tr = x; trName = nm end
  end
end
if not tr then return { ok = false, error = CFG.track and ('no track named ' .. CFG.track) or ('no track listens to ' .. CFG.port .. ' ch ' .. tostring(CFG.channel)) } end
local secs = CFG.seconds or 5
local sep = package.config:sub(1, 1)
local outpath = job.root .. sep .. 'outbox' .. sep .. 'part_meter.json'
os.remove(outpath)
local t0 = reaper.time_precise()
local rows = {}
local function loop()
  local now = reaper.time_precise() - t0
  rows[#rows + 1] = string.format('[%.3f,%.6f,%.6f]', now, reaper.Track_GetPeakInfo(tr, 0), reaper.Track_GetPeakInfo(tr, 1))
  if now < secs then reaper.defer(loop); return end
  local f = io.open(outpath, 'wb')
  if f then f:write('{"track":' .. string.format('%q', trName) .. ',"seconds":' .. secs .. ',"rows":[' .. table.concat(rows, ',') .. ']}'); f:close() end
end
reaper.defer(loop)
return { ok = true, track = trName, seconds = secs, file = outpath }
