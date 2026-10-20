// 3.0 the survey — classify every file tracked at piece 6's HEAD (Approaching, decibel_TENOR_2026 @ 9796edd) into COPY or
// LEAVE, with a reason. Reads src_ls.txt ("<size> <path>" per line, from `git ls-tree -r -l HEAD`); writes copy_list.txt,
// leave_list.txt. The shape is piece 6's tools/port/classify.js (its port from piece 5), with this run's differences:
//   - electronics/ is LEFT: the engine comes by `git subtree add` (the harvest's H6-9), never by the byte copy
//   - the piece's electronics DATA (bank/samples, bank/backup, the presets it dealt, the sections' banks) is LEFT; the two
//     files the stack READS AT START or AT LOAD stay on the copy and are skeletoned at 3.4: bank/elec_route.json (score/server.js
//     requires it), bank/presets.json (the page reads it at F5) — H6-8: grep who reads a path before leaving it
//   - piece 6's own port scripts (tools/port/) are LEFT: this repo has its own
//   - the three design studies of piece 6 (score/public/{signs,language,palette}/, tools/{signs,language,palette}/) are CARRIED as
//     code (CARRY ALL, USE SOME); their DATA (bank/signs, bank/language, bank/palette) is piece 6's and LEFT
//   - docs: only the tool docs travel (TOOL_DOCS + REMOTE_LISTENING + instrument_map.json); DYNAMICS_LAW and VERIFICATION_RECIPE are
//     in the kit already (2.4) and are LEFT here so the kit's provenance lines stand
'use strict';
const fs = require('fs'), path = require('path');
const SP = __dirname;
const rows = fs.readFileSync(path.join(SP, 'src_ls.txt'), 'utf8').split(/\r?\n/).filter(Boolean)
  .map(l => { const m = l.match(/^\s*(\d+) (.+)$/); return { size: +m[1], p: m[2] }; });

const BANK_MODELS = ['morph_models', 'morph_params', 'morph_pitches', 'morph_recipes', 'shape_presets', 'texture_models', 'texture_params',
  'pulse_palette', 'blast_taxonomy', 'cluster_bank', 'harmonies', 'ostinato_timing_db_2p2p', 'trill_timing_db', 'panel_snapshots', 'sequences',
  'aro_percussion_catalog', 'ricotti_catalog'];
const BANK_READ_AT_START = ['elec_route', 'presets'];   // skeletoned at 3.4
const TOOL_DOCS = ['BEATING_TOOL', 'CRESCENDO', 'CURVE_LOOK', 'ENGRAVING_RULES', 'GLYPH_SIZING', 'NAMING', 'NOTATION_IDENTITY',
  'NOTATION_STANDARDS', 'NOTATION_WORKFLOW', 'PANEL_CAPTURES', 'RACK_SETTINGS', 'REAPER_CONTROL', 'RENDER', 'SAMPLER_QUIRKS', 'SEQUENCE_TOOL',
  'STRIKES_TOOL', 'TRILLS_TOOL', 'TRILL_NOTATION_SPEC', 'REMOTE_LISTENING'];
const KIT_DOCS = ['AI_METHODOLOGY', 'HOW_WE_WORK', 'MORPH_NOTES', 'PLANNING_METHOD', 'SESSION_HYGIENE', 'SESSION_PROTOCOL', 'DYNAMICS_LAW', 'VERIFICATION_RECIPE'];

function verdict(p) {
  const top = p.includes('/') ? p.split('/')[0] : '(root)';
  const base = p.split('/').pop();
  if (top === '(root)') {
    if (['package.json', 'package-lock.json', 'start_score_server.bat', 'start_electronics.bat', 'start_electronics_remote.bat'].includes(p)) return ['COPY', 'root: the app\'s package and the launchers (re-pointed at 3.3)'];
    return ['LEAVE', 'root: this repo has its own (the kit)'];
  }
  if (top === '.claude') return p === '.claude/launch.json' ? ['COPY', 'launch.json (inert until 3.3)'] : ['LEAVE', 'the project commands are in the kit'];
  if (top === 'electronics') return ['LEAVE', 'THE ENGINE: taken by git subtree add, never by the copy (H6-9)'];
  if (top === 'bank') {
    const stem = base.replace(/\.json$/, '');
    if (p.startsWith('bank/samples/') || p.startsWith('bank/backup/')) return ['LEAVE', 'piece data: the electronics\' bank (an empty index at 3.4)'];
    if (p.startsWith('bank/aro_states/')) return ['LEAVE', 'the rack as text (container 4)'];
    if (p.startsWith('bank/signs/') || p.startsWith('bank/language/') || p.startsWith('bank/palette/')) return ['LEAVE', 'piece 6\'s notation design data (its badges, signs, colours) — fetched at 6 if the device is taken'];
    if (p === 'bank/passages/README.md' || p === 'bank/venue/_template.json') return ['COPY', 'bank: models, presets, libraries, templates (HEAD)'];
    if (BANK_MODELS.includes(stem)) return ['COPY', 'bank: models, presets, libraries, templates (HEAD)'];
    if (BANK_READ_AT_START.includes(stem)) return ['COPY', 'bank: read by the server at start / the page at load — skeletoned at 3.4'];
    return ['LEAVE', 'piece data / measurement banks (staged 3.2, skeleton 3.4)'];
  }
  if (top === 'docs') {
    const stem = base.replace(/\.md$/, '');
    if (p === 'docs/instrument_map.json') return ['COPY', 'docs: the app fetches it on load (H6-8)'];
    if (!p.slice(5).includes('/') && TOOL_DOCS.includes(stem)) return ['COPY', 'docs: the tool docs that travel with the code'];
    if (!p.slice(5).includes('/') && KIT_DOCS.includes(stem)) return ['LEAVE', 'docs: in the kit already (2.4)'];
    if (p.startsWith('docs/notation_instructions/')) return ['LEAVE', 'docs: the instructions page — the START of this piece\'s at 8.5'];
    return ['LEAVE', 'docs: piece 6\'s own records'];
  }
  if (top === 'midi') return ['LEAVE', 'piece data: exported MIDI'];
  if (top === 'scores') return ['LEAVE', 'piece data: the scores'];
  if (top === 'notation') {
    if (p.startsWith('notation/ir/')) return ['LEAVE', 'piece data: the IR pages (README rewritten at 6)'];
    if (p.startsWith('notation/research/')) return ['LEAVE', 'piece data: research pages'];
    if (p.startsWith('notation/video/')) return ['LEAVE', 'piece data: the film\'s cut lists and archive READMEs'];
    if (p.startsWith('notation/audio/')) return ['LEAVE', 'piece data: the takes\' records'];
    return ['COPY', 'notation: the engine'];
  }
  if (top === 'print') {
    if (p === 'print/cover/cover-a3-landscape.svg' || p.startsWith('print/score/approved/')) return ['LEAVE', 'piece data: the printed cover and the approved print'];
    return ['COPY', 'print: the pipeline and its templates'];
  }
  if (top === 'probes') {
    if (/\.(ps1|py)$/.test(base) || base === 'cc7_map.json') return ['COPY', 'probes: senders, analyzers, self-tests'];
    return ['LEAVE', 'probes: generated schedules and run outputs'];
  }
  if (top === 'reaper') {
    if (base.endsWith('.nka')) return ['LEAVE', 'piece data: a Kontakt preset array of piece 6\'s bass flute'];
    if (p.startsWith('reaper/bridge/') || p.startsWith('reaper/kontakt/')) return ['COPY', 'reaper: the bridge and the Kontakt scripts'];
    return ['LEAVE', 'piece data: the rack and its placed MIDI'];
  }
  if (top === 'sandbox') return ['COPY', 'sandbox'];
  if (top === 'score') return ['COPY', 'score: the composer app (the three design studies\' pages included — CARRY ALL, USE SOME)'];
  if (top === 'tools') {
    if (p.startsWith('tools/port/')) return ['LEAVE', 'piece 6\'s own port scripts — this repo has its own'];
    return ['COPY', 'tools (the section builders of piece 6 included — CARRY ALL, USE SOME)'];
  }
  return ['?', 'UNCLASSIFIED'];
}

const out = { COPY: [], LEAVE: [], '?': [] };
const by = {};
for (const r of rows) {
  const [v, why] = verdict(r.p);
  out[v].push(r.p);
  const k = v + ' | ' + why;
  (by[k] = by[k] || { n: 0, s: 0 }).n++; by[k].s += r.size;
}
fs.writeFileSync(path.join(SP, 'copy_list.txt'), out.COPY.join('\n') + '\n');
fs.writeFileSync(path.join(SP, 'leave_list.txt'), out.LEAVE.join('\n') + '\n');
const tot = v => Object.keys(by).filter(k => k.startsWith(v + ' ')).reduce((a, k) => ({ n: a.n + by[k].n, s: a.s + by[k].s }), { n: 0, s: 0 });
for (const k of Object.keys(by).sort()) console.log(k.padEnd(100) + String(by[k].n).padStart(4) + ' files ' + (by[k].s / 1024).toFixed(0).padStart(7) + ' KB');
for (const v of ['COPY', 'LEAVE', '?']) { const t = tot(v); console.log(('TOTAL ' + v).padEnd(100) + String(t.n).padStart(4) + ' files ' + (t.s / 1024).toFixed(0).padStart(7) + ' KB'); }
console.log('rows ' + rows.length);
