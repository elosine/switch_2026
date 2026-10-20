-- make_perc_tracks.lua — the UNPITCHED PERCUSSION tracks of the DECIBEL rack (the new-piece protocol's 4.2; RUNNING_LOG §21,
-- 2026-10-04), idempotent. Carried from piece #6 (its PLAN 0c/0e, 2026-09-18); the SPEC is this piece's — his list of
-- 2026-10-04, TENTATIVE (COMPOSITION_NOTES DEC-6).
-- D7: one Spitfire instance per instrument = one track per SPEC row, all on the one port DECPerc, each filtering on ITS channel
-- (Spitfire cannot switch instruments by MIDI). The block sits after the bass clarinet, before the mallets.
-- A NEW row's track is a DUPLICATE of a track named "Template" if the rack has one (his way in piece #6); with none, as here,
-- it gets an EMPTY Abbey Road Orchestra instance. The instrument is then LOADED IN THE PLUGIN'S OWN BROWSER — the only loader
-- (piece #6 §36) — or, where an earlier rack already holds it, its track chunk is cloned onto the track (tools/build_rack.js
-- --emit-src; here the bass drum alt, the wood blocks and the spring coil, from piece #6's rack).
-- A track that already exists is READ BACK ONLY — never re-configured (he is working in the rack). Never saves.
-- Add a row and re-run to add an instrument.
--   BRIDGE_TIMEOUT_MS=120000 node tools/reaper_job.js run reaper/bridge/jobs/make_perc_tracks.lua
local PORT, AFTER, TEMPLATE = "DECPerc", "Bass Clarinet XS", "Template"
local FX = "VST3i: Abbey Road Orchestra (Spitfire Audio)"
local SPEC = {   -- slug = the key in bank/aro_percussion_catalog.json ('?' = which of several is settled by what he loads)
  { name = "Bongos ARO",            channel = 1, slug = "bongos" },
  { name = "Shime Daiko ARO",       channel = 2, slug = "shime_daiko" },               -- the samples; the notes name a snare drum as the alternate (PERFORMANCE_NOTES)
  { name = "Bass Drum Alt ARO",     channel = 3, slug = "bass_drum_alt" },             -- cloned from piece #6
  { name = "Wood Blocks ARO",       channel = 4, slug = "wood_blocks" },               -- cloned from piece #6
  { name = "China Cymbal ARO",      channel = 5, slug = "china_cymbals" },                 -- his preset "China Cymbal (C)" IS the mapped entry (RUNNING_LOG §23)
  { name = "Spring Coil ARO",       channel = 6, slug = "small_metals_spring_coil" },  -- cloned from piece #6's Small Metals (C), the articulation switched
  { name = "Suspended Cymbals ARO", channel = 7, slug = "susp_cymbals_bright" },   -- his load: Suspended Cymbals (C), the BRIGHT All-in-One (§24)
  { name = "Toms ARO",              channel = 8, slug = "toms_high" },             -- his load: Toms (C), the HIGH All-in-One (§25)
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
local function indexOf(tr) return math.floor(reaper.GetMediaTrackInfo_Value(tr, 'IP_TRACKNUMBER')) - 1 end
local inSpec = {}
for _, s in ipairs(SPEC) do inSpec[s.name] = true end
local function blockEnd()   -- the index just after the last percussion track (Percussion · Template · any SPEC track)
  local last = -1
  for i = 0, reaper.CountTracks(0) - 1 do
    local _, n = reaper.GetTrackName(reaper.GetTrack(0, i))
    if n == AFTER or n == TEMPLATE or inSpec[n] then last = i end
  end
  return last + 1
end
local dev = devIndex(PORT)
if not dev then return { error = PORT .. ' not found among Reaper MIDI inputs' } end
if not findTrack(AFTER) then return { error = 'no track named ' .. AFTER } end
local tpl = findTrack(TEMPLATE)

-- his selection, restored at the end (the duplicate action works on the selection)
local sel = {}
for i = 0, reaper.CountSelectedTracks(0) - 1 do sel[#sel + 1] = reaper.GetSelectedTrack(0, i) end

reaper.Undo_BeginBlock()
reaper.PreventUIRefresh(1)
local log = {}
for _, s in ipairs(SPEC) do
  local tr = findTrack(s.name)
  local made, how = false, nil
  if not tr then
    if tpl then
      local n0 = reaper.CountTracks(0)
      reaper.SetOnlyTrackSelected(tpl)
      reaper.Main_OnCommand(40062, 0)   -- Track: Duplicate tracks — the copy lands right after the Template
      if reaper.CountTracks(0) == n0 + 1 then
        tr = reaper.GetTrack(0, indexOf(tpl) + 1)
        reaper.GetSetMediaTrackInfo_String(tr, 'P_NAME', '__dup__', true)   -- a name outside the block while it is moved
        reaper.SetOnlyTrackSelected(tr)
        reaper.ReorderSelectedTracks(blockEnd(), 0)
        reaper.GetSetMediaTrackInfo_String(tr, 'P_NAME', s.name, true)
        how = 'duplicate of ' .. TEMPLATE
      end
    else
      local at = blockEnd()
      reaper.InsertTrackAtIndex(at, true)
      tr = reaper.GetTrack(0, at)
      reaper.GetSetMediaTrackInfo_String(tr, 'P_NAME', s.name, true)
      reaper.SetMediaTrackInfo_Value(tr, 'I_RECMON', 1)
      reaper.SetMediaTrackInfo_Value(tr, 'I_RECARM', 1)
      reaper.SetMediaTrackInfo_Value(tr, 'I_RECMODE', 0)
      reaper.SetMediaTrackInfo_Value(tr, 'D_VOL', 1.0)
      reaper.TrackFX_AddByName(tr, FX, false, -1)
      how = 'empty instance'
    end
    if tr then
      reaper.SetMediaTrackInfo_Value(tr, 'I_RECINPUT', 4096 + dev * 32 + s.channel)   -- MIDI · this device · this channel
      made = true
    end
  end
  if not tr then
    log[#log + 1] = { name = s.name, error = 'the duplicate did not appear' }
  else
    local inp = reaper.GetMediaTrackInfo_Value(tr, 'I_RECINPUT')
    local d = (inp >= 4096) and math.floor((inp - 4096) / 32) or -1
    local _, dn = reaper.GetMIDIInputName(d, '')
    local fx = {}
    for f = 0, reaper.TrackFX_GetCount(tr) - 1 do
      local _, fn = reaper.TrackFX_GetFXName(tr, f, '')
      fx[#fx + 1] = fn
    end
    local ch = (inp >= 4096) and math.floor((inp - 4096) % 32) or -1
    log[#log + 1] = { name = s.name, slug = s.slug, made = made, how = how, index = indexOf(tr) + 1,
      channelOk = (ch == s.channel and dn == PORT),
      readback = { input = inp, devName = dn, channel = ch,
        monitor = reaper.GetMediaTrackInfo_Value(tr, 'I_RECMON'), armed = reaper.GetMediaTrackInfo_Value(tr, 'I_RECARM'),
        faderDb = 20 * math.log(reaper.GetMediaTrackInfo_Value(tr, 'D_VOL'), 10), fx = fx } }
  end
end
-- his selection back
reaper.Main_OnCommand(40297, 0)   -- Track: Unselect all tracks
for _, t in ipairs(sel) do if reaper.ValidatePtr(t, 'MediaTrack*') then reaper.SetTrackSelected(t, true) end end
reaper.PreventUIRefresh(-1)
reaper.Undo_EndBlock('LGMF: percussion tracks from the Template', -1)
reaper.TrackList_AdjustWindows(false)
reaper.UpdateArrange()
local order = {}
for i = 0, reaper.CountTracks(0) - 1 do
  local _, n = reaper.GetTrackName(reaper.GetTrack(0, i))
  order[#order + 1] = (i + 1) .. ' ' .. n
end
return { template = tpl and TEMPLATE or 'none — empty instances', tracks = log, order = order }
