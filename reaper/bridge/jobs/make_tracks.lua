-- make_tracks.lua — the instrument tracks of the DECIBEL rack (the new-piece protocol's 4.2, 2026-10-04;
-- RUNNING_LOG §19), idempotent. Carried from piece #6 (its PLAN 0e, 2026-09-17); the SPEC is this piece's.
-- One track per SPEC row: name · MIDI input = its DEC port BY NAME, ALL channels · input monitoring ON
-- (principle 1) · armed · fader 0 dB · the sampler inserted by name if the track has none. A track of the
-- same name is re-configured, never duplicated; new tracks are appended in SPEC order (or `after` a sibling).
-- Never saves. Returns a read-back of every track it touched and the track order of the project.
--   node tools/reaper_job.js run reaper/bridge/jobs/make_tracks.lua
--
-- HOW THE RACK IS MADE HERE: tools/build_rack.js writes reaper/decibel_rack.rpp as TEXT — the tracks an
-- earlier piece already loaded are CLONED whole (the Kontakt multi inside), the rest are bare; this job then
-- gives every track its input, arms it, and inserts the sampler into a bare one. A device NUMBER is Reaper's
-- own, so the input is set here, by port name, never in the text.
-- CAUTION: every run puts each SPEC track's fader back to 0 dB and re-arms it. After container 5 (the trims), run
-- apply_trims.lua after this job. A track NOT in SPEC (his own, the percussion's) is never touched.
-- A NEW INSTRUMENT LATER = a row here (+ `after`), run again. The percussion and the four Ricotti mallet
-- instruments (ports DECPerc · DECCrotales · DECGlock · DECMarimba · DECXylo, made 2026-10-04) get their rows
-- when the libraries are in and chosen.
local KONTAKT = { "VST3i: Kontakt 8 (Native Instruments) (64 out)", "VST3i: Kontakt 8 (Native Instruments)" }
local SPEC = {
  { name = "Bass Flute XS",    port = "DECBassFlute", fx = KONTAKT },   -- bare in the text; Xsample Bass Flute.nki by reaper/kontakt/load_xs.lua
  { name = "Bass Clarinet XS", port = "DECBassClar",  fx = KONTAKT },   -- cloned from piece #5 (the D11 slots + the strike slot on [A] 5)
  -- the Ricotti Mallets (a KONTAKT library; RUNNING_LOG §20): one Kontakt per instrument on its own port, score order high to low;
  -- each loaded by reaper/kontakt/load_rm_<instrument>.lua — one slot per patch, a MIDI channel each (bank/ricotti_catalog.json)
  { name = "Crotales RM",      port = "DECCrotales",  fx = KONTAKT, after = "Bass Clarinet XS" },
  { name = "Glockenspiel RM",  port = "DECGlock",     fx = KONTAKT, after = "Crotales RM" },
  { name = "Xylophone RM",     port = "DECXylo",      fx = KONTAKT, after = "Glockenspiel RM" },
  { name = "Marimba RM",       port = "DECMarimba",   fx = KONTAKT, after = "Xylophone RM" },
  { name = "Viola XS",         port = "DECViola",     fx = KONTAKT },   -- cloned from piece #5's "Va XS"
  { name = "Cello XS",         port = "DECCello",     fx = KONTAKT },   -- cloned from piece #6
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
