#!/usr/bin/env node
// ricotti_loaders.js — the Ricotti Mallets, as a CATALOG and as Kontakt LOADERS (the new-piece protocol's 4.3 · 4.5;
// RUNNING_LOG §20, 2026-10-04). The catalog → selection → generator pattern of the percussion (piece #6's D7), for
// a KONTAKT library: Spitfire Ricotti Mallets (PP006-007) is opened as .nki files in the full Kontakt.
//
//   node tools/ricotti_loaders.js --scan    # read the library folder, write bank/ricotti_catalog.json (REFUSES to overwrite)
//   node tools/ricotti_loaders.js           # write reaper/kontakt/load_rm_<instrument>.lua from the catalog
//
// THE LAYOUT (the AI's call, his to reverse): ONE Kontakt per instrument, on the instrument's own port and track
// (Crotales RM · Glockenspiel RM · Xylophone RM · Marimba RM); inside it ONE SLOT PER PATCH, each on its own MIDI
// channel — the library's "_Individual patches_", one beater or technique each, fully loaded. So a technique is a
// CHANNEL, as every percussion voice of the lineage is: two beaters can sound at once and nothing has to be
// latched. (The library also ships one .nki per instrument that switches its articulations by keyswitch, and
// leaves some of them unloaded until a chip is clicked in its panel; the catalog names it as `full`, unused.)
// A CHANNEL, ONCE IN THE CATALOG, IS NEVER RE-DEALT: the recipe, the rack and every saved note depend on it.
// A new patch is appended by hand, on the next free channel.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LIB = 'C:/Users/jwloy/Spitfire/Spitfire Ricotti Mallets library/Instruments';
const CATALOG = path.join(ROOT, 'bank', 'ricotti_catalog.json');
const OUT_DIR = path.join(ROOT, 'reaper', 'kontakt');
// score order, high to low; `prefix` is the library's own file prefix
const INSTRUMENTS = [
  { slug: 'crotales',     name: 'Crotales',     prefix: 'c - Crotales - ',  full: 'Crotales.nki',     track: 'Crotales RM',     port: 'DECCrotales' },
  { slug: 'glockenspiel', name: 'Glockenspiel', prefix: 'b - Glock - ',     full: 'Glockenspiel.nki', track: 'Glockenspiel RM', port: 'DECGlock' },
  { slug: 'xylophone',    name: 'Xylophone',    prefix: 'd - Xylophone - ', full: 'Xylophone.nki',    track: 'Xylophone RM',    port: 'DECXylo' },
  { slug: 'marimba',      name: 'Marimba',      prefix: 'a - Marimba - ',   full: 'Marimba.nki',      track: 'Marimba RM',      port: 'DECMarimba' },
];

function scan() {
  if (fs.existsSync(CATALOG)) { console.error('refusing: ' + path.relative(ROOT, CATALOG) + ' exists — its channels are fixed; append a patch by hand'); process.exit(3); }
  const dir = LIB + '/_Individual patches_';
  const files = fs.readdirSync(dir).filter(f => /\.nki$/i.test(f)).sort();
  const cat = {
    _doc: 'The Ricotti Mallets as this piece loads them: one Kontakt per instrument (track, port), one slot per patch, the patch on its own MIDI channel. Written once by tools/ricotti_loaders.js --scan from the library folder; a channel is never re-dealt. `label` is the library\'s patch name; `slot` is the name the loader gives the Kontakt slot. After a change: node tools/ricotti_loaders.js, then the loader run again in that Kontakt (it only adds what is missing).',
    library: 'Spitfire Ricotti Mallets (PP006-007) — a Kontakt library, full Kontakt required',
    root: LIB,
    instruments: [],
  };
  const used = new Set();
  for (const I of INSTRUMENTS) {
    const mine = files.filter(f => f.startsWith(I.prefix));
    const label = f => f.slice(I.prefix.length).replace(/\.nki$/i, '');
    // the plain "Main" first, then the other Mains, then the rest — each group in the library's own order
    const rank = l => (l === 'Main' ? 0 : /^Main\b/.test(l) ? 1 : 2);
    mine.sort((a, b) => rank(label(a)) - rank(label(b)) || label(a).localeCompare(label(b)));
    if (mine.length > 16) throw new Error(I.name + ': ' + mine.length + ' patches, more than 16 channels');
    mine.forEach(f => used.add(f));
    cat.instruments.push({ slug: I.slug, name: I.name, track: I.track, port: I.port, full: I.full,
      patches: mine.map((f, i) => ({ channel: i + 1, label: label(f), slot: I.name + ' - ' + label(f), file: '_Individual patches_/' + f })) });
  }
  const orphans = files.filter(f => !used.has(f));
  if (orphans.length) throw new Error('patches no instrument claims: ' + orphans.join(', '));
  fs.writeFileSync(CATALOG, JSON.stringify(cat, null, 1) + '\n');
  console.log('wrote ' + path.relative(ROOT, CATALOG));
  for (const I of cat.instruments) console.log('  ' + I.name.padEnd(13) + I.patches.length + ' patches: ' + I.patches.map(p => p.channel + ' ' + p.label).join(' · '));
}

const luaStr = s => "'" + String(s).replace(/\\/g, '/').replace(/'/g, "' .. \"'\" .. '") + "'";
function loader(cat, I) {
  const rows = I.patches.map(p => `  { ch = ${p.channel}, name = ${luaStr(p.slot)}, nki = ROOT .. ${luaStr('/' + p.file)} },`).join('\n');
  return `-- load_rm_${I.slug}.lua — the Ricotti ${I.name.toUpperCase()}, loaded and laid out by script (the new-piece protocol's 4.3 · 4.4;
-- RUNNING_LOG §20). GENERATED by tools/ricotti_loaders.js from bank/ricotti_catalog.json — edit the catalog, not this file.
-- Run inside the Kontakt of the track "${I.track}" (port ${I.port}): KONTAKT menu -> Run Lua script... -> this file,
-- or drag this file onto that Kontakt.
-- ${I.patches.length} slots, one per patch, each on its own MIDI channel [A] 1 .. ${I.patches.length}. Idempotent: a slot of the same name is
-- re-configured, never loaded twice. Nothing is removed.
-- SELF-REPORTING: writes reaper/kontakt/out/load_rm_${I.slug}_START_<time>.json before it touches Kontakt, then
-- ALWAYS load_rm_${I.slug}_<time>.json with the read-back, or the error. The AI reads that file.

local OUT_DIR = 'C:/Users/jwloy/GitHub/decibel_TENOR_2026/reaper/kontakt/out/'
local ROOT = ${luaStr(cat.root)}
local TAG = 'load_rm_${I.slug}'
local PATCHES = {
${rows}
}

local log, made = {}, {}
local BS = string.char(92)   -- no backslash in this source
local function q(s) return '"' .. tostring(s):gsub('[%c"' .. BS .. ']', ' ') .. '"' end
local function note(k, v) log[#log + 1] = ' ' .. q(k) .. ': ' .. (type(v) == 'string' and q(v) or tostring(v)) end
local function write_out(name, body) local f = assert(io.open(OUT_DIR .. name, 'wb')); f:write(body); f:close() end
local stamp = os.date('%Y%m%d_%H%M%S')

write_out(TAG .. '_START_' .. stamp .. '.json', '{ "kontakt_api": ' .. tostring(Kontakt ~= nil) .. ', "lua": ' .. q(_VERSION) .. ' }\\n')

local function free_index()
  if Kontakt.get_free_instrument_index then return Kontakt.get_free_instrument_index() end
  return #Kontakt.get_instrument_indices() * 128
end

local function main()
  assert(Kontakt, 'no Kontakt API - developer features off, or not run inside Kontakt')
  note('instruments_before', #Kontakt.get_instrument_indices())
  for _, p in ipairs(PATCHES) do
    local idx, loaded = nil, false
    for _, i in ipairs(Kontakt.get_instrument_indices()) do if Kontakt.get_instrument_name(i) == p.name then idx = i end end
    if not idx then
      local ok, r = pcall(Kontakt.load_instrument, p.nki, free_index())
      assert(ok and type(r) == 'number', 'load failed for ' .. p.name .. ': ' .. tostring(r))
      idx, loaded = r, true
      local original = Kontakt.get_instrument_name(idx)
      pcall(Kontakt.set_instrument_name, idx, p.name)
      note('original_name_ch' .. p.ch, original)
    end
    pcall(Kontakt.set_instrument_midi_channel, idx, p.ch)
    made[#made + 1] = string.format('  {"name":%s,"idx":%d,"loaded_now":%s,"midi_channel":%s,"output_channel":%s,"volume_dB":%s}',
      q(Kontakt.get_instrument_name(idx)), idx, tostring(loaded), tostring(Kontakt.get_instrument_midi_channel(idx)), tostring(Kontakt.get_instrument_output_channel(idx)), tostring(Kontakt.get_instrument_volume(idx)))
  end
  note('instruments_after', #Kontakt.get_instrument_indices())
end

local ok, err = pcall(main)
note('ok', ok); if not ok then note('error', err) end
note('time', os.date('!%Y-%m-%dT%H:%M:%SZ'))
local text = '{\\n' .. table.concat(log, ',\\n') .. ',\\n "slots": [\\n' .. table.concat(made, ',\\n') .. '\\n ]\\n}\\n'
write_out(TAG .. '_' .. stamp .. '.json', text)
print('[' .. TAG .. '] ' .. text)
if not ok then error(err) end
`;
}

if (process.argv.includes('--scan')) { scan(); process.exit(0); }
if (!fs.existsSync(CATALOG)) { console.error('no catalog — run with --scan first'); process.exit(2); }
const cat = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
for (const I of cat.instruments) {
  const chans = I.patches.map(p => p.channel);
  if (new Set(chans).size !== chans.length || Math.max(...chans) > 16) throw new Error(I.name + ': channels must be distinct, 1..16');
  for (const p of I.patches) if (!fs.existsSync(cat.root + '/' + p.file)) throw new Error('missing on disk: ' + p.file);
  const f = path.join(OUT_DIR, 'load_rm_' + I.slug + '.lua');
  fs.writeFileSync(f, loader(cat, I));
  console.log('wrote ' + path.relative(ROOT, f) + '  (' + I.patches.length + ' slots, track "' + I.track + '", port ' + I.port + ')');
}
