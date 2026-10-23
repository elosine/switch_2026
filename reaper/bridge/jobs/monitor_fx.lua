-- monitor_fx.lua — Reaper's MONITORING FX chain (the master track's input FX; View → Monitoring FX), read and optionally bypassed by name.
-- Realphones lives there, not on a master track (piece 6's journal, 2026-10-14). Never saves (the chain is global, in reaper-hwoutfx.ini).
--   node tools/reaper_job.js run reaper/bridge/jobs/monitor_fx.lua            -- list
--   with  set below: bypass every FX whose name contains it (Realphones, at his ask 2026-10-23)
local m = reaper.GetMasterTrack(0)
local want = 'realphones'   -- the FX to BYPASS by name, or nil to list only (the Lua runs inside Reaper: a shell's environment does not reach it)
local out = {}
for i = 0, reaper.TrackFX_GetRecCount(m) - 1 do
  local idx = 0x1000000 + i
  local _, name = reaper.TrackFX_GetFXName(m, idx, '')
  local before = reaper.TrackFX_GetEnabled(m, idx)
  if want and name:lower():find(want:lower(), 1, true) then reaper.TrackFX_SetEnabled(m, idx, false) end
  out[#out + 1] = { slot = i + 1, name = name, enabledBefore = before, enabledNow = reaper.TrackFX_GetEnabled(m, idx) }
end
return { monitoringFx = out, masterFx = reaper.TrackFX_GetCount(m) }
