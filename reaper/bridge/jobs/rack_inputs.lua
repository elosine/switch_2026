-- rack_inputs.lua — EVERY track's live input, read from the running Reaper (the audit of 2026-11-10, RUNNING_LOG §143): name · MIDI input
-- device BY NAME · channel (0 = all) · armed · monitoring · the first FX. Read-only; never saves. The rack on disk may lag his CTRL+S —
-- this is the truth of the moment.
--   node tools/reaper_job.js run reaper/bridge/jobs/rack_inputs.lua
local out = {}
for i = 0, reaper.CountTracks(0) - 1 do
  local tr = reaper.GetTrack(0, i)
  local _, name = reaper.GetTrackName(tr)
  local inp = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
  local row = { index = i + 1, name = name, armed = reaper.GetMediaTrackInfo_Value(tr, 'I_RECARM'), monitor = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMON') }
  if inp >= 4096 then
    local d = math.floor((inp - 4096) / 32)
    row.channel = math.floor((inp - 4096) % 32)
    if d == 62 or d == 63 then row.device = '(all MIDI)' else local _, dn = reaper.GetMIDIInputName(d, ''); row.device = dn end
  elseif inp >= 0 then row.audio = inp else row.device = '(none)' end
  local _, fx = reaper.TrackFX_GetFXName(tr, 0, '')
  row.fx = fx
  out[#out + 1] = row
end
return { tracks = out }
