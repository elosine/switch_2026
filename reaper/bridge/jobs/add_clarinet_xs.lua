-- add_clarinet_xs.lua — ONE new track, "Clarinet XS", for the Xsample Clarinet (Bb) he bought 2026-11-22 (the Switch~ piece RUNNING_LOG §405).
--   node tools/reaper_job.js run reaper/bridge/jobs/add_clarinet_xs.lua
-- The rack is HIS (saved by him), so the track is added THROUGH THE BRIDGE (the home's howto/rack.md § 2) and by a job of its own:
-- make_tracks.lua would put every SPEC track's fader back to 0 dB. This job touches NO other track.
-- The track: right after "Clarinet SI2" · MIDI input = the port SWClar, all channels (the clarinet's own port — no new loopMIDI port, so
-- nothing is restarted and he enables nothing) · monitoring on · armed · fader 0 dB · an EMPTY Kontakt 8 inserted.
-- While both clarinet tracks listen to SWClar, the old one (UVI) keeps sounding and the new one, empty, is silent: nothing changes
-- for his playing until the recipe is re-pointed. Idempotent: a track of that name is re-read, never made twice. Never saves.
local NAME, AFTER, PORT = "Clarinet XS", "Clarinet SI2", "SWClar"
local KONTAKT = { "VST3i: Kontakt 8 (Native Instruments) (64 out)", "VST3i: Kontakt 8 (Native Instruments)" }
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
local out = { name = NAME }
local tr = findTrack(NAME)
if not tr then
  local _, ai = findTrack(AFTER)
  if not ai then return { error = 'no track "' .. AFTER .. '" to stand after' } end
  local dev = devIndex(PORT)
  if not dev then return { error = 'the port ' .. PORT .. ' is not among Reaper\'s MIDI inputs' } end
  reaper.Undo_BeginBlock()
  reaper.InsertTrackAtIndex(ai + 1, true)
  tr = reaper.GetTrack(0, ai + 1)
  reaper.GetSetMediaTrackInfo_String(tr, 'P_NAME', NAME, true)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', 4096 + dev * 32 + 0)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECMON', 1)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECARM', 1)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECMODE', 0)
  reaper.SetMediaTrackInfo_Value(tr, 'D_VOL', 1.0)
  for _, fxname in ipairs(KONTAKT) do
    local have = reaper.TrackFX_AddByName(tr, fxname, false, -1)
    if have >= 0 then out.fxAdded = fxname; break end
  end
  reaper.Undo_EndBlock('add the track Clarinet XS (the Xsample clarinet)', -1)
  out.made = true
else
  out.made = false
end
local _, idx = findTrack(NAME)
local inp = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
local d = (inp >= 4096) and math.floor((inp - 4096) / 32) or -1
local _, dn = reaper.GetMIDIInputName(d, '')
local fx = {}
for f = 0, reaper.TrackFX_GetCount(tr) - 1 do local _, fn = reaper.TrackFX_GetFXName(tr, f, ''); fx[#fx + 1] = fn end
out.readback = { index = idx + 1, devName = dn, channel = (inp >= 4096) and ((inp - 4096) % 32) or -1,
  monitor = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMON'), armed = reaper.GetMediaTrackInfo_Value(tr, 'I_RECARM'),
  faderDb = 20 * math.log(reaper.GetMediaTrackInfo_Value(tr, 'D_VOL'), 10), fx = fx }
return out
