-- elec_route.lua — THE ELECTRONICS' ROUTE in this rack (PLAN 1.1 · 6.1 c; the engine's docs/SEAMS.md, the sound path).
-- Idempotent, self-reporting, never saves — his CTRL+S is his. One undo point per change ("Electronics route").
--
-- WHAT THE ROUTE IS. The engine (SuperCollider) runs on ReaRoute, Reaper's own ASIO bridge: 16 channels each way.
--   · A PLAYER'S MICROPHONE = a HARDWARE SEND from that player's instrument track to one ReaRoute channel — mono,
--     POST-FADER, unity. Post-fader on purpose: the faders are the rack's loudness calibration (bank/trims.json), so the
--     engine hears each player at the level he does, and a sample the engine plays back at unity is as loud as the note was.
--   · THE LOUDSPEAKER = one track, "ELEC RETURN": its input the ReaRoute pair the engine's master leaves on, monitoring ON,
--     record mode NONE (it is armed only because Reaper monitors armed tracks; it never writes a file), 0 dB, NO effects.
--     What he hears from it is the engine's master exactly as it would leave for the PA.
--
-- MODES (tools/elec.js sets CFG and sends this file; run bare, it only looks):
--   probe        look, change nothing: the audio system, the hardware channels, whether ReaRoute is there, what is routed
--   apply        make the sends and the return track (refuses when Reaper shows no ReaRoute channels)
--   remove       take them out again (the return track only if it holds no items and no effects)
--   loop_on      the latency loop: ELEC RETURN also sends to a ReaRoute channel the engine listens on  ·  loop_off
--   watch        the live meters of the player tracks and the return for CFG.seconds -> outbox/elec_peaks.json
--
--   node tools/elec.js probe | route | unroute | check | latency          (the piece's own tool; bank/elec_route.json)
--   node tools/reaper_job.js run reaper/bridge/jobs/elec_route.lua         (bare = probe)
local CFG = CFG or { mode = 'probe' }
local MODE = CFG.mode or 'probe'
local RAW = CFG.players or { { name = 'bcl', track = 'Bass Clarinet XS', engineIn = 1 } }
local PLAYERS = {}   -- one row per TRACK: a player with several tracks (the percussionist's two lanes, §78) sends each into the same channel
for _, p in ipairs(RAW) do
  for _, t in ipairs(p.tracks or { p.track }) do PLAYERS[#PLAYERS + 1] = { name = p.name, track = t, engineIn = p.engineIn } end
end
local RET = CFG.returnTrack or 'ELEC RETURN'
local RET_CH = CFG.engineOut or 1        -- the engine's master leaves on this ReaRoute channel and the next (1-based)
local LOOP_CH = CFG.loopIn or 3          -- the latency loop's channel back to the engine (1-based)

local function findTrack(name)
  for i = 0, reaper.CountTracks(0) - 1 do
    local tr = reaper.GetTrack(0, i)
    local _, n = reaper.GetTrackName(tr)
    if n == name then return tr, i end
  end
  return nil
end
-- a MAP hardware index -> name. The device's own channels are 0 … n-1; ReaRoute's sit at 512 … 527, where ReWire's do
-- (found 2026-10-04 on Reaper 7.82: GetNumAudioOutputs counts 12, and GetOutputChannelName(512) is "ReaRoute 1").
local function list(n, fn)
  local t = {}
  for i = 0, n - 1 do t[i] = fn(i) end
  for i = 512, 575 do local s = fn(i); if s and s ~= '' then t[i] = s end end
  return t
end
local function dB(v) if v and v > 0 then return math.floor(20 * math.log(v, 10) * 100 + 0.5) / 100 end return -150 end

local nOut, nIn = reaper.GetNumAudioOutputs(), reaper.GetNumAudioInputs()
local outs = list(nOut, reaper.GetOutputChannelName)
local ins = list(nIn, reaper.GetInputChannelName)
local function firstReaRoute(names)
  local best = nil
  for i, n in pairs(names) do if tostring(n):lower():find('rearoute', 1, true) and (best == nil or i < best) then best = i end end
  return best
end
local rrOut, rrIn = firstReaRoute(outs), firstReaRoute(ins)   -- the hardware index of ReaRoute 1 (512), or nil
local _, aMode = reaper.GetAudioDeviceInfo('MODE', '')
local _, aRate = reaper.GetAudioDeviceInfo('SRATE', '')
local _, aSize = reaper.GetAudioDeviceInfo('BSIZE', '')
local _, aOut = reaper.GetAudioDeviceInfo('IDENT_OUT', '')

local function hwSends(tr)
  local t = {}
  for i = 0, reaper.GetTrackNumSends(tr, 1) - 1 do
    local d = math.floor(reaper.GetTrackSendInfo_Value(tr, 1, i, 'I_DSTCHAN'))
    t[#t + 1] = { index = i, to = outs[d & 1023] or ('hardware ' .. (d & 1023)), dst = d & 1023, mono = (d & 1024) ~= 0,
      dB = dB(reaper.GetTrackSendInfo_Value(tr, 1, i, 'D_VOL')), sendmode = reaper.GetTrackSendInfo_Value(tr, 1, i, 'I_SENDMODE'),
      mute = reaper.GetTrackSendInfo_Value(tr, 1, i, 'B_MUTE') }
  end
  return t
end
local function findHwSend(tr, dst)
  for i = 0, reaper.GetTrackNumSends(tr, 1) - 1 do
    if (math.floor(reaper.GetTrackSendInfo_Value(tr, 1, i, 'I_DSTCHAN')) & 1023) == dst then return i end
  end
  return nil
end
local function ensureHwSend(tr, dst)
  local i = findHwSend(tr, dst)
  local made = false
  if not i then i = reaper.CreateTrackSend(tr, nil); made = true end
  reaper.SetTrackSendInfo_Value(tr, 1, i, 'I_SRCCHAN', 0)             -- the track's channels 1/2
  reaper.SetTrackSendInfo_Value(tr, 1, i, 'I_DSTCHAN', dst | 1024)    -- one hardware channel, mixed to mono
  reaper.SetTrackSendInfo_Value(tr, 1, i, 'I_SENDMODE', 0)            -- post-fader
  reaper.SetTrackSendInfo_Value(tr, 1, i, 'D_VOL', 1.0)
  reaper.SetTrackSendInfo_Value(tr, 1, i, 'B_MUTE', 0)
  return made
end

local function describe()
  local players = {}
  for _, p in ipairs(PLAYERS) do
    local tr = findTrack(p.track)
    players[#players + 1] = { name = p.name, track = p.track, found = tr ~= nil, engineIn = p.engineIn,
      faderDb = tr and dB(reaper.GetMediaTrackInfo_Value(tr, 'D_VOL')) or nil, hardwareSends = tr and hwSends(tr) or {} }
  end
  local rt, ri = findTrack(RET)
  local ret = { track = RET, found = rt ~= nil }
  if rt then
    local rin = math.floor(reaper.GetMediaTrackInfo_Value(rt, 'I_RECINPUT'))
    ret.index = ri + 1
    ret.input = (rin >= 0 and (rin & 4096) == 0) and (ins[rin & 1023] or ('hardware ' .. (rin & 1023))) or 'none'
    ret.stereo = rin >= 0 and (rin & 1024) ~= 0
    ret.monitor = reaper.GetMediaTrackInfo_Value(rt, 'I_RECMON')
    ret.arm = reaper.GetMediaTrackInfo_Value(rt, 'I_RECARM')
    ret.recmode = reaper.GetMediaTrackInfo_Value(rt, 'I_RECMODE')
    ret.faderDb = dB(reaper.GetMediaTrackInfo_Value(rt, 'D_VOL'))
    ret.fx = reaper.TrackFX_GetCount(rt)
    ret.items = reaper.CountTrackMediaItems(rt)
    ret.toMaster = reaper.GetMediaTrackInfo_Value(rt, 'B_MAINSEND')
    ret.hardwareSends = hwSends(rt)
  end
  return { mode = MODE, audio = { system = aMode, srate = aRate, block = aSize, out = aOut },
    hardwareOuts = nOut, hardwareIns = nIn, reaRoute = (rrOut ~= nil and rrIn ~= nil),
    reaRouteOutAt = rrOut, reaRouteInAt = rrIn, firstOuts = { outs[0], outs[1] }, players = players, ret = ret }
end

if MODE == 'probe' then return describe() end

if MODE == 'watch' then
  local secs = CFG.seconds or 4
  local watched = {}
  for _, p in ipairs(PLAYERS) do local tr = findTrack(p.track); if tr then watched[#watched + 1] = { name = p.track, tr = tr, max = { 0, 0 } } end end
  local rt = findTrack(RET); if rt then watched[#watched + 1] = { name = RET, tr = rt, max = { 0, 0 } } end
  watched[#watched + 1] = { name = 'MASTER', tr = reaper.GetMasterTrack(0), max = { 0, 0 } }
  local sep = package.config:sub(1, 1)
  local outpath = job.root .. sep .. 'outbox' .. sep .. 'elec_peaks.json'
  os.remove(outpath)
  local t0, ticks = reaper.time_precise(), 0
  local function loop()
    ticks = ticks + 1
    for _, w in ipairs(watched) do
      for c = 1, 2 do local v = reaper.Track_GetPeakInfo(w.tr, c - 1); if v > w.max[c] then w.max[c] = v end end
    end
    if reaper.time_precise() - t0 < secs then reaper.defer(loop); return end
    local parts = {}
    for _, w in ipairs(watched) do parts[#parts + 1] = string.format('  "%s": {"L": %s, "R": %s}', w.name, dB(w.max[1]), dB(w.max[2])) end
    local f = io.open(outpath, 'wb')
    if f then f:write('{\n "ticks": ' .. ticks .. ',\n "seconds": ' .. secs .. ',\n "peakDb": {\n' .. table.concat(parts, ',\n') .. '\n }\n}\n'); f:close() end
  end
  reaper.defer(loop)
  return { watching = #watched, seconds = secs, file = outpath }
end

-- everything below changes the rack, and needs ReaRoute to be there
if not (rrOut and rrIn) then
  local d = describe()
  d.error = 'Reaper shows no ReaRoute channels — nothing was changed. ReaRoute must be installed (Reaper\'s installer, the box "ReaRoute ASIO driver") and Reaper\'s audio system must be ASIO (it is ' .. tostring(aMode) .. ').'
  return d
end

reaper.Undo_BeginBlock()
local did = {}

if MODE == 'apply' then
  for _, p in ipairs(PLAYERS) do
    local tr = findTrack(p.track)
    if not tr then did[#did + 1] = 'NO TRACK named ' .. p.track
    else
      local made = ensureHwSend(tr, rrOut + p.engineIn - 1)
      did[#did + 1] = (made and 'made' or 'kept') .. ' the send ' .. p.track .. ' -> ' .. tostring(outs[rrOut + p.engineIn - 1])
    end
  end
  local rt = findTrack(RET)
  if not rt then
    local n = reaper.CountTracks(0)
    local _, lastName = reaper.GetTrackName(reaper.GetTrack(0, n - 1))
    local at = (lastName == 'REC') and (n - 1) or n          -- REC stays the last track (make_rec_track.lua's place for it)
    reaper.InsertTrackAtIndex(at, true)
    rt = reaper.GetTrack(0, at)
    reaper.GetSetMediaTrackInfo_String(rt, 'P_NAME', RET, true)
    did[#did + 1] = 'made the track ' .. RET .. ' at ' .. (at + 1)
  else
    did[#did + 1] = 'kept the track ' .. RET
  end
  reaper.SetMediaTrackInfo_Value(rt, 'I_RECINPUT', 1024 | (rrIn + RET_CH - 1))   -- a stereo pair of hardware inputs
  reaper.SetMediaTrackInfo_Value(rt, 'I_RECMON', 1)
  reaper.SetMediaTrackInfo_Value(rt, 'I_RECMODE', 2)                             -- none: it monitors, it never records
  reaper.SetMediaTrackInfo_Value(rt, 'I_RECARM', 1)
  reaper.SetMediaTrackInfo_Value(rt, 'D_VOL', 1.0)
  reaper.SetMediaTrackInfo_Value(rt, 'D_PAN', 0)
  reaper.SetMediaTrackInfo_Value(rt, 'B_MAINSEND', 1)

elseif MODE == 'remove' then
  for _, p in ipairs(PLAYERS) do
    local tr = findTrack(p.track)
    local i = tr and findHwSend(tr, rrOut + p.engineIn - 1)
    if i then reaper.RemoveTrackSend(tr, 1, i); did[#did + 1] = 'removed the send from ' .. p.track end
  end
  local rt = findTrack(RET)
  if rt then
    if reaper.CountTrackMediaItems(rt) == 0 and reaper.TrackFX_GetCount(rt) == 0 then reaper.DeleteTrack(rt); did[#did + 1] = 'removed the track ' .. RET
    else did[#did + 1] = 'LEFT the track ' .. RET .. ' — it holds items or effects' end
  end

elseif MODE == 'loop_on' or MODE == 'loop_off' then
  local rt = findTrack(RET)
  if not rt then did[#did + 1] = 'NO TRACK named ' .. RET
  elseif MODE == 'loop_on' then
    ensureHwSend(rt, rrOut + LOOP_CH - 1); did[#did + 1] = 'loop on: ' .. RET .. ' -> ' .. tostring(outs[rrOut + LOOP_CH - 1])
  else
    local i = findHwSend(rt, rrOut + LOOP_CH - 1)
    if i then reaper.RemoveTrackSend(rt, 1, i); did[#did + 1] = 'loop off' else did[#did + 1] = 'loop was not on' end
  end
else
  did[#did + 1] = 'unknown mode ' .. tostring(MODE)
end

reaper.Undo_EndBlock('Electronics route (' .. MODE .. ')', -1)
reaper.TrackList_AdjustWindows(false)
reaper.UpdateArrange()
local d = describe()
d.did = did
return d
