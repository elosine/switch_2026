-- load_bass_flute.lua — the Xsample BASS FLUTE, loaded and laid out by script (the new-piece protocol's 4.3 · 4.4;
-- RUNNING_LOG §19, 2026-10-04). Run inside the EMPTY Kontakt of the track "Bass Flute XS":
--   KONTAKT ▾ menu → Run Lua script… → this file.
-- It does what his hands and curve_slots.lua did in two steps for the earlier pieces: slot 1 = Bass Flute.nki on
-- MIDI channel [A] 1 (pinned — a slot left on Omni sounds on every channel, SAMPLER_QUIRKS § Kontakt 8), then the
-- three CURVE copies of D11 on [A] 2 · 3 · 4, same output, same volume, named "<name> curve A|B|C".
-- Idempotent: a slot that exists is re-configured, never loaded twice. Nothing is removed.
-- SELF-REPORTING: writes reaper/kontakt/out/load_bass_flute_START_<time>.json before it touches Kontakt, then
-- ALWAYS load_bass_flute_<time>.json with the read-back, or the error. The AI reads that file; he sends nothing.
-- The .nki sits in the AIL installer's copy of the collection (as the English Horn's did, piece #6 §26).

local OUT_DIR = 'C:/Users/jwloy/GitHub/decibel_TENOR_2026/reaper/kontakt/out/'
local NKI = 'C:/Users/jwloy/Documents/Xsample Sample Library/Xsample_AIL_Installer_Windows/Xsample_Collection/Instruments Elastic/Woodwinds/Bass Flute.nki'
local TAG = 'load_bass_flute'
local CURVES = { { ch = 2, tag = 'curve A' }, { ch = 3, tag = 'curve B' }, { ch = 4, tag = 'curve C' } }

local log, made = {}, {}
local BS = string.char(92)   -- no backslash in this source: a heredoc write flattened one once (piece #6 §28)
local function q(s) return '"' .. tostring(s):gsub('[%c"' .. BS .. ']', ' ') .. '"' end
local function note(k, v) log[#log + 1] = ' ' .. q(k) .. ': ' .. (type(v) == 'string' and q(v) or tostring(v)) end
local function write_out(name, body) local f = assert(io.open(OUT_DIR .. name, 'wb')); f:write(body); f:close() end
local stamp = os.date('%Y%m%d_%H%M%S')

-- 1. Proof the script ran at all, before Kontakt is touched.
write_out(TAG .. '_START_' .. stamp .. '.json', '{ "kontakt_api": ' .. tostring(Kontakt ~= nil) .. ', "lua": ' .. q(_VERSION) .. ' }\n')

local function free_index()
  if Kontakt.get_free_instrument_index then return Kontakt.get_free_instrument_index() end
  return #Kontakt.get_instrument_indices() * 128
end
local function row(idx)
  return string.format('  {"name":%s,"idx":%d,"midi_channel":%s,"output_channel":%s,"volume_dB":%s}',
    q(Kontakt.get_instrument_name(idx)), idx, tostring(Kontakt.get_instrument_midi_channel(idx)), tostring(Kontakt.get_instrument_output_channel(idx)), tostring(Kontakt.get_instrument_volume(idx)))
end

-- 2. The work, under pcall so any failure lands in the read-back file.
local function main()
  assert(Kontakt, 'no Kontakt API - developer features off, or not run inside Kontakt')
  note('nki', NKI)
  local idxs = Kontakt.get_instrument_indices()
  note('instruments_before', #idxs)
  local first = idxs[1]
  if not first then
    local ok, r = pcall(Kontakt.load_instrument, NKI, free_index())
    assert(ok and type(r) == 'number', 'load failed for slot 1: ' .. tostring(r))
    first = r
    note('slot1_loaded_by_script', true)
  else
    note('slot1_loaded_by_script', false)
  end
  local base = Kontakt.get_instrument_name(first)
  note('slot1_name', base)
  pcall(Kontakt.set_instrument_midi_channel, first, 1)
  note('slot1_midi_channel', Kontakt.get_instrument_midi_channel(first))
  local out_ch, vol = Kontakt.get_instrument_output_channel(first), Kontakt.get_instrument_volume(first)
  note('slot1_output_channel', out_ch); note('slot1_volume_dB', vol)
  made[#made + 1] = row(first)
  for _, c in ipairs(CURVES) do
    local want = base .. ' ' .. c.tag
    local idx = nil
    for _, i in ipairs(Kontakt.get_instrument_indices()) do if Kontakt.get_instrument_name(i) == want then idx = i end end
    if not idx then
      local ok, r = pcall(Kontakt.load_instrument, NKI, free_index())
      assert(ok and type(r) == 'number', 'load failed for ' .. want .. ': ' .. tostring(r))
      idx = r
      pcall(Kontakt.set_instrument_name, idx, want)
    end
    pcall(Kontakt.set_instrument_midi_channel, idx, c.ch)
    pcall(Kontakt.set_instrument_output_channel, idx, out_ch)
    pcall(Kontakt.set_instrument_volume, idx, vol)
    made[#made + 1] = row(idx)
  end
  note('instruments_after', #Kontakt.get_instrument_indices())
end

local ok, err = pcall(main)
note('ok', ok); if not ok then note('error', err) end
note('time', os.date('!%Y-%m-%dT%H:%M:%SZ'))
local text = '{\n' .. table.concat(log, ',\n') .. ',\n "slots": [\n' .. table.concat(made, ',\n') .. '\n ]\n}\n'
write_out(TAG .. '_' .. stamp .. '.json', text)
print('[' .. TAG .. '] ' .. text)
if not ok then error(err) end
