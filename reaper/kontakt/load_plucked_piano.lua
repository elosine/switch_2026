-- load_plucked_piano.lua — the Spitfire PLUCKED PIANO loaded by script into the empty "PianoPlucked Kontakt" instance (the SWITCH~ piece,
-- 2026-11-10, RUNNING_LOG §147): one slot, MIDI channel [A] 5 (the recipe's `plucked`; the track's input filters channel 5), volume 0 dB,
-- output the main pair. Run INSIDE the Kontakt of the track "PianoPlucked Kontakt": KONTAKT ▾ menu → Run Lua script… → this file.
-- Idempotent: a slot already named "Plucked Piano" is re-configured, never loaded twice. Nothing is removed.
-- SELF-REPORTING: writes reaper/kontakt/out/load_plucked_piano_START_<time>.json before it touches Kontakt, then ALWAYS
-- load_plucked_piano_<time>.json with the read-back, or the error. The AI reads that file.
local OUT_DIR = 'C:/Users/jwloy/GitHub/switch_2026/reaper/kontakt/out/'
local NKI = 'H:/Spitfire Audio Plucked Piano KONTAKT-iPirateU/Instruments/Plucked Piano.nki'   -- piece 4's path (its curve_slots.lua), on disk 2026-11-10
local NAME, CH, VOL = 'Plucked Piano', 5, 0
local stamp = os.date('%Y%m%d_%H%M%S')
local function write_out(name, body) local f = assert(io.open(OUT_DIR .. name, 'wb')); f:write(body); f:close() end
write_out('load_plucked_piano_START_' .. stamp .. '.json', '{"started":"' .. os.date('!%Y-%m-%dT%H:%M:%SZ') .. '","kontakt_api":' .. tostring(Kontakt ~= nil) .. '}\n')
local log, slots = {}, {}
local BS = string.char(92)
local function q(s) return '"' .. tostring(s):gsub('[%c"' .. BS .. ']', ' ') .. '"' end
local function note(k, v) log[#log + 1] = ' ' .. q(k) .. ': ' .. (type(v) == 'string' and q(v) or tostring(v)) end
local function norm(s) return (tostring(s):lower():gsub('^%s+', ''):gsub('%s+$', ''):gsub('%s+', ' ')) end
local function main()
  assert(Kontakt, 'no Kontakt API - developer features off, or not run inside Kontakt')
  local idxs = Kontakt.get_instrument_indices()
  note('instruments_before', #idxs)
  local idx = nil
  for _, i in ipairs(idxs) do if norm(Kontakt.get_instrument_name(i)):find('pluck', 1, true) then idx = i end end
  if not idx then
    local ok, r = pcall(Kontakt.load_instrument, NKI, Kontakt.get_free_instrument_index and Kontakt.get_free_instrument_index() or (#idxs * 128))
    assert(ok and type(r) == 'number', 'load failed: ' .. tostring(r))
    idx = r
    pcall(Kontakt.set_instrument_name, idx, NAME)
    note('loaded', NKI)
  else
    note('found', Kontakt.get_instrument_name(idx))
  end
  pcall(Kontakt.set_instrument_midi_channel, idx, CH)
  pcall(Kontakt.set_instrument_volume, idx, VOL)
  pcall(Kontakt.set_instrument_output_channel, idx, 0)
  slots[#slots + 1] = string.format('  {"name":%s,"idx":%d,"midi_channel":%s,"output_channel":%s,"volume_dB":%s}',
    q(Kontakt.get_instrument_name(idx)), idx, tostring(Kontakt.get_instrument_midi_channel(idx)), tostring(Kontakt.get_instrument_output_channel(idx)), tostring(Kontakt.get_instrument_volume(idx)))
  note('instruments_after', #Kontakt.get_instrument_indices())
end
local ok, err = pcall(main)
note('ok', ok); if not ok then note('error', err) end
note('time', os.date('!%Y-%m-%dT%H:%M:%SZ'))
local text = '{\n' .. table.concat(log, ',\n') .. ',\n "slots": [\n' .. table.concat(slots, ',\n') .. '\n ]\n}\n'
write_out('load_plucked_piano_' .. stamp .. '.json', text)
print('[plucked piano] ' .. text)
if not ok then error(err) end
