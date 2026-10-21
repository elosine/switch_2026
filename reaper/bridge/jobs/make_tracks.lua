-- make_tracks.lua — the instrument tracks of the DECIBEL rack (the new-piece protocol's 4.2, 2026-10-04;
-- RUNNING_LOG §19), idempotent. Carried from piece #6 (its PLAN 0e, 2026-09-17); the SPEC is this piece's.
-- One track per SPEC row: name · MIDI input = its DEC port BY NAME, ALL channels · input monitoring ON
-- (principle 1) · armed · fader 0 dB · the sampler inserted by name if the track has none. A track of the
-- same name is re-configured, never duplicated; new tracks are appended in SPEC order (or `after` a sibling).
-- Never saves. Returns a read-back of every track it touched and the track order of the project.
--   node tools/reaper_job.js run reaper/bridge/jobs/make_tracks.lua
--
-- HOW THE RACK IS MADE HERE: tools/build_rack.js writes reaper/switch_rack.rpp as TEXT — the tracks an
-- earlier piece already loaded are CLONED whole (the Kontakt multi inside), the rest are bare; this job then
-- gives every track its input, arms it, and inserts the sampler into a bare one. A device NUMBER is Reaper's
-- own, so the input is set here, by port name, never in the text.
-- CAUTION: every run puts each SPEC track's fader back to 0 dB and re-arms it. After container 5 (the trims), run
-- apply_trims.lua after this job. A track NOT in SPEC (his own, the percussion's) is never touched.
-- A NEW INSTRUMENT LATER = a row here (+ `after`), run again. The percussion and the four Ricotti mallet
-- instruments (ports DECPerc · DECCrotales · DECGlock · DECMarimba · DECXylo, made 2026-10-04) get their rows
-- when the libraries are in and chosen.
local KONTAKT = { "VST3i: Kontakt 8 (Native Instruments) (64 out)", "VST3i: Kontakt 8 (Native Instruments)" }
local UVI = { "VST3i: UVIWorkstation (UVI)" }   -- IRCAM Solo Instruments 2 · Prepared Piano 2 (the SWITCH~ piece, 2026-10-20)
-- THE SWITCH~ PIECE'S SPEC (2026-10-20, RUNNING_LOG §15): every track tools/build_rack.js wrote, in score order; the ports the SW set
-- (4.1, made 2026-10-20). The eight Abbey Road tracks are make_perc_tracks.lua's (one port, a channel each) and are not here.
local SPEC = {
  { name = "Flute SI2",            port = "SWFlute",    fx = UVI },       -- cloned from piece 4 (16 presets)
  { name = "Fluteb SI2",           port = "SWFluteb",   fx = UVI },       -- cloned from piece 4 (3 presets + the curve copies)
  { name = "Clarinet SI2",         port = "SWClar",     fx = UVI },       -- bare: his load (4.3)
  { name = "Alto Sax SI2",         port = "SWSax",      fx = UVI },       -- bare: his load (4.3)
  { name = "Vibraphone XS",        port = "SWVibes",    fx = KONTAKT },   -- cloned from piece 5 (preset 13 Bowed Velocity RRoff x4 slots)
  -- the Ricotti Mallets: one Kontakt per instrument on its own port, cloned loaded from piece 6
  { name = "Crotales RM",          port = "SWCrotales", fx = KONTAKT },
  { name = "Glockenspiel RM",      port = "SWGlock",    fx = KONTAKT },
  { name = "Xylophone RM",         port = "SWXylo",     fx = KONTAKT },
  { name = "Marimba RM",           port = "SWMarimba",  fx = KONTAKT },
  -- the piano: four tracks on ONE port, each filtering its channel inside the plugin (piece 4's way: 1 main · 2 plucked · 3 harmonics · 5 muted)
  { name = "Piano Kontakt",        port = "SWPiano",    fx = KONTAKT },
  { name = "PianoPlucked Kontakt", port = "SWPiano",    fx = KONTAKT },
  { name = "PianoHarm PP2",        port = "SWPiano",    fx = UVI },
  { name = "PianoMute PP2",        port = "SWPiano",    fx = UVI },
  { name = "Violin XS",            port = "SWViolin",   fx = KONTAKT },   -- cloned from piece 4's "Vn1 XS"
  { name = "Cello XS",             port = "SWCello",    fx = KONTAKT },   -- cloned from piece 6
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
local log = {}
local at = reaper.CountTracks(0)   -- append after the last track, in SPEC order
for _, s in ipairs(SPEC) do
  local tr = findTrack(s.name)
  local made = false
  if not tr then
    local pos = at
    if s.after then local _, ai = findTrack(s.after); if ai then pos = ai + 1 end end
    reaper.InsertTrackAtIndex(pos, true)
    tr = reaper.GetTrack(0, pos)
    reaper.GetSetMediaTrackInfo_String(tr, 'P_NAME', s.name, true)
    if pos >= at then at = pos + 1 else at = at + 1 end
    made = true
  end
  local entry = { name = s.name, made = made, port = s.port }
  local dev = devIndex(s.port)
  entry.dev = dev
  if dev then
    reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', 4096 + dev * 32 + 0)   -- MIDI · this device · all channels
  else
    entry.error = 'port not found among Reaper MIDI inputs'
  end
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECMON', 1)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECARM', 1)
  reaper.SetMediaTrackInfo_Value(tr, 'I_RECMODE', 0)
  reaper.SetMediaTrackInfo_Value(tr, 'D_VOL', 1.0)
  if s.fx then
    local have = -1
    for _, fxname in ipairs(s.fx) do
      have = reaper.TrackFX_GetByName(tr, fxname, false)
      if have >= 0 then break end
    end
    if have < 0 then
      for _, fxname in ipairs(s.fx) do
        have = reaper.TrackFX_AddByName(tr, fxname, false, -1)
        if have >= 0 then entry.fxAdded = fxname; break end
      end
    end
    entry.fxIndex = have
  end
  -- read-back
  local inp = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
  local d = (inp >= 4096) and math.floor((inp - 4096) / 32) or -1
  local _, dn = reaper.GetMIDIInputName(d, '')
  local fx = {}
  for f = 0, reaper.TrackFX_GetCount(tr) - 1 do
    local _, fn = reaper.TrackFX_GetFXName(tr, f, '')
    fx[#fx + 1] = fn
  end
  entry.readback = {
    input = inp, devName = dn, channel = (inp >= 4096) and ((inp - 4096) % 32) or -1,
    monitor = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMON'),
    armed = reaper.GetMediaTrackInfo_Value(tr, 'I_RECARM'),
    faderDb = 20 * math.log(reaper.GetMediaTrackInfo_Value(tr, 'D_VOL'), 10),
    fx = fx,
  }
  log[#log + 1] = entry
end
reaper.TrackList_AdjustWindows(false)
reaper.UpdateArrange()
local order = {}
for i = 0, reaper.CountTracks(0) - 1 do
  local _, n = reaper.GetTrackName(reaper.GetTrack(0, i))
  order[#order + 1] = (i + 1) .. ' ' .. n
end
return { tracks = log, order = order }
