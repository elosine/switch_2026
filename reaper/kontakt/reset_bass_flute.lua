-- reset_bass_flute.lua — the Xsample BASS FLUTE put back to the FACTORY instrument, all four slots (RUNNING_LOG §43, 2026-10-04).
-- Run inside the Kontakt of the track "Bass Flute XS":  KONTAKT menu -> Run Lua script... -> this file  (or drag it onto that Kontakt).
--
-- WHY: the instrument card (§42) found the four slots in different states — preset 33 took its loudness from the mod wheel, and
-- slot 2 followed the wheel on preset 15 too. His decision: reset, and the ordinary voice goes back to the factory preset 15.
-- WHAT IT DOES: REMOVES every instrument in this Kontakt, then loads Bass Flute.nki four times, exactly as load_bass_flute.lua
-- did — slot 1 on MIDI channel [A] 1, the three curve copies of D11 on [A] 2 · 3 · 4, named "<name> curve A|B|C".
-- Everything hand-set inside the old slots is gone with them (that is the point). Nothing else in the rack is touched.
-- SELF-REPORTING: writes reaper/kontakt/out/reset_bass_flute_START_<time>.json before it touches Kontakt, then ALWAYS
-- reset_bass_flute_<time>.json with the read-back, or the error. The AI reads that file.

local OUT_DIR = 'C:/Users/jwloy/GitHub/decibel_TENOR_2026/reaper/kontakt/out/'
local NKI = 'C:/Users/jwloy/Documents/Xsample Sample Library/Xsample_AIL_Installer_Windows/Xsample_Collection/Instruments Elastic/Woodwinds/Bass Flute.nki'
local TAG = 'reset_bass_flute'
local SLOTS = { { ch = 1, tag = nil }, { ch = 2, tag = 'curve A' }, { ch = 3, tag = 'curve B' }, { ch = 4, tag = 'curve C' } }

local log, made = {}, {}
local BS = string.char(92)   -- no backslash in this source
local function q(s) return '"' .. tostring(s):gsub('[%c"' .. BS .. ']', ' ') .. '"' end
local function note(k, v) log[#log + 1] = ' ' .. q(k) .. ': ' .. (type(v) == 'string' and q(v) or tostring(v)) end
local function write_out(name, body) local f = assert(io.open(OUT_DIR .. name, 'wb')); f:write(body); f:close() end
local stamp = os.date('%Y%m%d_%H%M%S')

write_out(TAG .. '_START_' .. stamp .. '.json', '{ "kontakt_api": ' .. tostring(Kontakt ~= nil) .. ', "lua": ' .. q(_VERSION) .. ' }\n')

local function free_index()
  if Kontakt.get_free_instrument_index then return Kontakt.get_free_instrument_index() end
  return #Kontakt.get_instrument_indices() * 128
end

local function main()
  assert(Kontakt, 'no Kontakt API - developer features off, or not run inside Kontakt')
  local before = Kontakt.get_instrument_indices()
  note('instruments_before', #before)
  local names = {}
  for _, i in ipairs(before) do names[#names + 1] = Kontakt.get_instrument_name(i) end
  note('removed_names', table.concat(names, ' | '))
  -- a guard: this script is for the bass flute's Kontakt only
  for _, n in ipairs(names) do assert(tostring(n):lower():find('flute'), 'this Kontakt holds "' .. tostring(n) .. '" - not the bass flute; nothing was removed') end
  for k = #before, 1, -1 do
    local ok, e = pcall(Kontakt.remove_instrument, before[k])
    assert(ok, 'could not remove slot ' .. tostring(before[k]) .. ': ' .. tostring(e))
  end
  note('instruments_after_remove', #Kontakt.get_instrument_indices())
  note('nki', NKI)
  local base, out_ch, vol
  for _, s in ipairs(SLOTS) do
    local ok, r = pcall(Kontakt.load_instrument, NKI, free_index())
    assert(ok and type(r) == 'number', 'load failed for channel ' .. s.ch .. ': ' .. tostring(r))
    local idx = r
    if not base then base = Kontakt.get_instrument_name(idx); out_ch = Kontakt.get_instrument_output_channel(idx); vol = Kontakt.get_instrument_volume(idx) end
    if s.tag then pcall(Kontakt.set_instrument_name, idx, base .. ' ' .. s.tag) end
    pcall(Kontakt.set_instrument_midi_channel, idx, s.ch)
    pcall(Kontakt.set_instrument_output_channel, idx, out_ch)
    pcall(Kontakt.set_instrument_volume, idx, vol)
    made[#made + 1] = string.format('  {"name":%s,"idx":%d,"midi_channel":%s,"output_channel":%s,"volume_dB":%s}',
      q(Kontakt.get_instrument_name(idx)), idx, tostring(Kontakt.get_instrument_midi_channel(idx)), tostring(Kontakt.get_instrument_output_channel(idx)), tostring(Kontakt.get_instrument_volume(idx)))
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
