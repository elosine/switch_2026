-- midi_reinit.lua — close and re-open every MIDI device Reaper holds (reaper.midi_reinit): after a loopMIDI restart under a running
-- Reaper, its device handles are stale and a note to a port shows no level (the Switch~ piece, 2026-10-23, RUNNING_LOG §19).
-- Never saves; touches no track.   node tools/reaper_job.js run reaper/bridge/jobs/midi_reinit.lua
reaper.midi_reinit()
local names = {}
for d = 0, reaper.GetNumMIDIInputs() - 1 do local ok, n = reaper.GetMIDIInputName(d, ''); if ok and n:sub(1, 2) == 'SW' then names[#names + 1] = n end end
return { reinit = true, swInputs = names }
