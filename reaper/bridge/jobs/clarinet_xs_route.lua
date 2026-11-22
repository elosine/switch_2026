-- clarinet_xs_route.lua — WHERE THE NEW CLARINET SOUNDS HEAR FROM (the Switch~ piece RUNNING_LOG §407, 2026-11-22).
--   node tools/reaper_job.js run reaper/bridge/jobs/clarinet_xs_route.lua
-- His word: the Xsample clarinet has no slap, so "let's use the tongue slap from the bass clarinet just for the playback"; the clarinet
-- takes the new library's TRIPLE TONGUE. Two sounds, on two tracks, both fed from FREE CHANNELS OF A PORT THIS PIECE ALREADY HAS
-- (SWFluteb: the second flute instance uses channels 1 … 6 and 10 only) — so no new loopMIDI port, nothing restarted, nothing for him
-- to enable. Each track takes ONE channel of that port and Reaper maps it to channel 1, where the Kontakt's main slot listens:
--   "Clarinet XS"       <- SWFluteb channel 11   (the Xsample Clarinet Bb he loaded; it stood on SWClar, where its channels 1 … 4
--                                                  DOUBLED the old clarinet's — that is ended here)
--   "Bass Clarinet XS"  <- SWFluteb channel 12   (a new track, CLONED WHOLE from piece 6's rack on disk — its loaded Kontakt inside,
--                                                  so no hand step; its sends and receives are stripped)
-- Idempotent. Never saves. No other track is touched.
local PORT = "SWFluteb"
local SRC = "C:/Users/jwloy/GitHub/decibel_TENOR_2026/reaper/decibel_rack.rpp"
local function findTrack(name)
  for i = 0, reaper.CountTracks(0) - 1 do
    local tr = reaper.GetTrack(0, i)
    local _, n = reaper.GetTrackName(tr)
    if n == name then return tr, i end
  end
  return nil
end
local function devIndex(port)
  for d = 0, reaper.GetNumMIDIInputs() - 1 do
    local ok, n = reaper.GetMIDIInputName(d, '')
    if ok and n == port then return d end
  end
  return nil
end
local dev = devIndex(PORT)
if not dev then return { error = 'the port ' .. PORT .. ' is not among the MIDI inputs' } end
local out = {}
local function route(tr, ch)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', 4096 + dev * 32 + ch)
  reaper.SetMediaTrackInfo_Value(tr, 'I_MIDI_INPUT_CHANMAP', 1)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECMON', 1)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECARM', 1)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECMODE', 0)
  local inp = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
  local d = math.floor((inp - 4096) / 32)
  local _, dn = reaper.GetMIDIInputName(d, '')
  local fx = {}
  for f = 0, reaper.TrackFX_GetCount(tr) - 1 do local _, fn = reaper.TrackFX_GetFXName(tr, f, ''); fx[#fx + 1] = fn end
  local _, nm = reaper.GetTrackName(tr)
  return { name = nm, devName = dn, channel = (inp - 4096) % 32, mapTo = reaper.GetMediaTrackInfo_Value(tr, 'I_MIDI_INPUT_CHANMAP'),
    armed = reaper.GetMediaTrackInfo_Value(tr, 'I_RECARM'), monitor = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMON'),
    faderDb = 20 * math.log(reaper.GetMediaTrackInfo_Value(tr, 'D_VOL'), 10), fx = fx }
end
reaper.Undo_BeginBlock()
local cl, ci = findTrack("Clarinet XS")
if not cl then return { error = 'no track "Clarinet XS"' } end
out.clarinet = route(cl, 11)
local bc = findTrack("Bass Clarinet XS")
if not bc then
  local f = io.open(SRC, 'rb'); if not f then return { error = 'cannot read ' .. SRC } end
  local text = f:read('*a'); f:close()
  local lines = {}
  for l in (text .. '\n'):gmatch('(.-)\r?\n') do lines[#lines + 1] = l end
  local at = nil
  for i, l in ipairs(lines) do if l:find('NAME "Bass Clarinet XS"', 1, true) then at = i; break end end
  if not at then return { error = 'no Bass Clarinet XS track in ' .. SRC } end
  local a = at
  while a > 0 and not lines[a]:match('^%s*<TRACK') do a = a - 1 end
  local depth, b, chunk = 0, nil, {}
  for i = a, #lines do
    local l = lines[i]
    local s = l:match('^%s*(.-)%s*$')
    if s:sub(1, 1) == '<' then depth = depth + 1 end
    if not s:match('^AUXRECV') and not s:match('^MIDIOUT') and not s:match('^MAINSEND') then chunk[#chunk + 1] = l end
    if s == '>' then depth = depth - 1; if depth == 0 then b = i; break end end
  end
  if not b then return { error = 'the track block does not close' } end
  reaper.InsertTrackAtIndex(ci + 1, true)
  bc = reaper.GetTrack(0, ci + 1)
  local okc = reaper.SetTrackStateChunk(bc, table.concat(chunk, '\n'), false)
  out.cloned = { ok = okc, lines = #chunk, from = SRC }
  reaper.GetSetMediaTrackInfo_String(bc, 'P_NAME', 'Bass Clarinet XS', true)
  reaper.SetMediaTrackInfo_Value(bc, 'B_MAINSEND', 1)
else
  out.cloned = { ok = true, already = true }
end
out.bassClarinet = route(bc, 12)
reaper.Undo_EndBlock('the Xsample clarinet and the bass clarinet slap on SWFluteb 11 / 12', -1)
return out
