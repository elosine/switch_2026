-- load_clarinet.lua — the Xsample CLARINET (Bb), loaded and laid out by script (the Switch~ piece RUNNING_LOG §403, 2026-11-22; the bass
-- flute's loader of piece 6, its path and tag changed and nothing else). Run inside the EMPTY Kontakt of the track "Clarinet XS":
--   KONTAKT menu -> Run Lua script... -> this file.
-- Slot 1 = Clarinet Bb.nki on MIDI channel [A] 1, then the three CURVE copies on [A] 2 . 3 . 4, same output, same volume.
-- SELF-REPORTING: writes reaper/kontakt/out/load_clarinet_START_<time>.json before it touches Kontakt, then load_clarinet_<time>.json
-- with the read-back, or the error. The AI reads that file; he sends nothing.

local OUT_DIR = 'C:/Users/jwloy/GitHub/switch_2026/reaper/kontakt/out/'
local NKI = 'C:/Users/jwloy/Documents/Xsample Sample Library/clarinet/Xsample_Collection/Instruments Elastic/Woodwinds/Clarinet Bb.nki'
local TAG = 'load_clarinet'
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
