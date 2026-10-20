-- peak_watch_take.lua (vet, 2026-10-10 RUNNING_LOG §420) — every track's peak meter through a TAKE, on the recording's own clock.
--
-- Launched right after `node tools/take.js start …` (the take's tab is current and already recording):
--   REAPER_PROJECT=<the take's project stem> node tools/reaper_job.js run tools/vet/peak_watch_take.lua
-- It answers at once and goes on watching in a defer loop. Every TICK_S it writes, for each track whose peak since the last
-- tick rose above FLOOR_DB, a row [recordPosition, trackIndex (1-based), dB]. It ENDS by itself when the transport stops after
-- having recorded (take.js stop's first act), when a track pointer dies (the tab closed), or after WATCH_S — and only then
-- writes outbox/peak_watch_take.json. Reading: score time = recordPosition − the take's align.json offset.
-- Track_GetPeakInfo reads BEFORE the fader on this rack (RUNNING_LOG §54): a row says the instrument SOUNDED, not how loud at the master.
local WATCH_S, TICK_S, FLOOR_DB = 1200, 0.05, -70

local names, trs = {}, {}
for i = 0, reaper.CountTracks(0) - 1 do
  local t = reaper.GetTrack(0, i)
  local _, nm = reaper.GetTrackName(t)
  trs[#trs + 1] = t
  names[#names + 1] = (nm or ''):gsub('"', "'")
end
if #trs == 0 then return { ok = false, err = 'no tracks in the current project' } end

local sep = package.config:sub(1, 1)
local outpath = job.root .. sep .. 'outbox' .. sep .. 'peak_watch_take.json'
os.remove(outpath)

local t0 = reaper.time_precise()
local nextAt, rows, cur, seenRec = 0, {}, {}, false
for i = 1, #trs do cur[i] = 0 end
local function dB(v) if v > 0 then return math.floor(20 * math.log(v, 10) * 10 + 0.5) / 10 end return -150 end

local function finish(why)
  local f = io.open(outpath, 'wb')
  if f then
    f:write('{\n "why": "' .. why .. '",\n "tickS": ' .. TICK_S .. ',\n "floorDb": ' .. FLOOR_DB ..
      ',\n "tracks": ["' .. table.concat(names, '","') .. '"],\n "rows": [\n  ' .. table.concat(rows, ',\n  ') .. '\n ]\n}\n')
    f:close()
  end
end

local function loop()
  local el = reaper.time_precise() - t0
  local st = reaper.GetPlayState()               -- 5 = recording, 6 = recording paused, 0 = stopped
  if st == 5 or st == 6 then seenRec = true end
  for i = 1, #trs do
    local t = trs[i]
    if not reaper.ValidatePtr2(0, t, 'MediaTrack*') then finish('a track pointer died (the tab closed?)'); return end
    local v = math.max(reaper.Track_GetPeakInfo(t, 0), reaper.Track_GetPeakInfo(t, 1))
    if v > cur[i] then cur[i] = v end
  end
  if el >= nextAt then
    local pos = reaper.GetPlayPosition()
    for i = 1, #trs do
      local d = dB(cur[i])
      if d > FLOOR_DB then rows[#rows + 1] = string.format('[%.3f,%d,%s]', pos, i, d) end
      cur[i] = 0
    end
    nextAt = nextAt + TICK_S
  end
  if seenRec and st == 0 then finish('the transport stopped'); return end
  if el >= WATCH_S then finish('watch time over (' .. WATCH_S .. ' s)'); return end
  reaper.defer(loop)
end
reaper.defer(loop)
return { ok = true, tracks = #trs, watchS = WATCH_S, tickS = TICK_S, floorDb = FLOOR_DB, file = outpath }
