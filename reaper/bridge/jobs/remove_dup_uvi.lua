-- remove_dup_uvi.lua — on the two flute tracks, remove the EMPTY VST3 UVI Workstation that make_tracks.lua inserted beside piece 4's
-- cloned VST2 instance (its SPEC named only the VST3 plugin, so it did not see the VST2 one as "the sampler"; RUNNING_LOG §21).
-- Only an FX whose name is EXACTLY the VST3 UVI and which is NOT the track's first FX is removed. Never saves.
local VST3 = 'VST3i: UVIWorkstation (UVI)'
local out = {}
for _, name in ipairs({ 'Flute SI2', 'Fluteb SI2' }) do
  for i = 0, reaper.CountTracks(0) - 1 do
    local tr = reaper.GetTrack(0, i)
    local _, n = reaper.GetTrackName(tr)
    if n == name then
      local removed = 0
      for f = reaper.TrackFX_GetCount(tr) - 1, 1, -1 do
        local _, fn = reaper.TrackFX_GetFXName(tr, f, '')
        if fn == VST3 then reaper.TrackFX_Delete(tr, f); removed = removed + 1 end
      end
      local left = {}
      for f = 0, reaper.TrackFX_GetCount(tr) - 1 do local _, fn = reaper.TrackFX_GetFXName(tr, f, ''); left[#left + 1] = fn end
      out[#out + 1] = { track = name, removed = removed, left = left }
    end
  end
end
return out
