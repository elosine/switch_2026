-- perc_inputs.lua — the INPUTS of the unpitched percussion tracks that tools/build_rack.js CLONED (the SWITCH~ piece, 2026-10-20;
-- RUNNING_LOG §16). A cloned track arrives with its input set to none (build_rack.js rewrites REC — a device NUMBER is Reaper's own);
-- make_perc_tracks.lua never re-configures a track that exists (he may be working in the rack). This job does the one thing for the
-- cloned rows: MIDI input = the percussion port BY NAME on ITS channel · armed · monitoring on. Idempotent; never saves; a track not
-- in the list is never touched. The rows mirror make_perc_tracks.lua's SPEC — keep the two in step.
--   node tools/reaper_job.js run reaper/bridge/jobs/perc_inputs.lua
local PORT = "SWPerc"
local SPEC = {
  { name = "Bongos ARO",            channel = 1 },
  { name = "Shime Daiko ARO",       channel = 2 },
  { name = "Bass Drum Alt ARO",     channel = 3 },
  { name = "Wood Blocks ARO",       channel = 4 },
  { name = "China Cymbal ARO",      channel = 5 },
  { name = "Spring Coil ARO",       channel = 6 },
  { name = "Suspended Cymbals ARO", channel = 7 },
  { name = "Toms ARO",              channel = 8 },
}
local function devIndex(port)
  for d = 0, reaper.GetNumMIDIInputs() - 1 do
    local ok, n = reaper.GetMIDIInputName(d, '')
    if ok and n == port then return d end
  end
  return nil
end
local function findTrack(name)
  for i = 0, reaper.CountTracks(0) - 1 do
    local tr = reaper.GetTrack(0, i)
    local _, n = reaper.GetTrackName(tr)
    if n == name then return tr, i end
  end
  return nil
end
local dev = devIndex(PORT)
if not dev then return { error = PORT .. ' not found among Reaper MIDI inputs' } end
reaper.Undo_BeginBlock()
local log = {}
for _, s in ipairs(SPEC) do
  local tr, i = findTrack(s.name)
  if not tr then
    log[#log + 1] = { name = s.name, error = 'no such track' }
  else
    reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', 4096 + dev * 32 + s.channel)
    reaper.SetMediaTrackInfo_Value(tr, 'I_RECMON', 1)
    reaper.SetMediaTrackInfo_Value(tr, 'I_RECARM', 1)
    reaper.SetMediaTrackInfo_Value(tr, 'I_RECMODE', 0)
    local inp = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
    local d = (inp >= 4096) and math.floor((inp - 4096) / 32) or -1
    local _, dn = reaper.GetMIDIInputName(d, '')
    local ch = (inp >= 4096) and math.floor((inp - 4096) % 32) or -1
    log[#log + 1] = { name = s.name, index = i + 1, devName = dn, channel = ch, ok = (ch == s.channel and dn == PORT),
      armed = reaper.GetMediaTrackInfo_Value(tr, 'I_RECARM'), monitor = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMON') }
  end
end
reaper.Undo_EndBlock('perc_inputs: the percussion inputs on ' .. PORT, -1)
return { port = PORT, dev = dev, tracks = log }
