#!/usr/bin/env node
// build_rack.js — THE RACK AS TEXT: reaper/decibel_rack.rpp built from the lineage's racks (the new-piece
// protocol's 4.2; RUNNING_LOG §19, 2026-10-04). His idea, his words: "copy previous racks and then just copy
// the instrument lanes back and forth".
//
// A Reaper track chunk carries its plugin WITH its state: the Kontakt multi, every slot loaded, the curve copies
// and their channels (D11), every hand-set knob. Copied whole, a track arrives loaded — so an instrument a
// previous piece already set up costs no load here. The plugin state is never edited, only carried byte-exact
// (docs/REAPER_CONTROL.md § 2, mechanism 9: never EDIT the blob; mechanism 1: the .rpp as text for structure).
//
//   node tools/build_rack.js                 # build reaper/decibel_rack.rpp; REFUSES if the file exists
//   node tools/build_rack.js --source disk   # take the old racks from their working files instead of git
//   node tools/build_rack.js --dry           # report only, write nothing
//   node tools/build_rack.js --force         # overwrite — ONLY before he has saved the rack from Reaper
//
// WHAT IT WRITES: the project header of piece #6's rack (120 BPM, master 0 dB, no master FX) and the TRACKS
// below in score order. On each cloned track three lines are rewritten and nothing else: NAME · VOLPAN (the
// fader to 0 dB — the old piece's balance is not this piece's; container 5 measures) · REC (no input, not
// armed — a MIDI device NUMBER is Reaper's own and is not known until Reaper has seen the DEC ports; the bridge
// job reaper/bridge/jobs/make_tracks.lua sets each input BY PORT NAME, arms and monitors).
// An `empty` row is a bare track: the bridge job inserts the sampler, he (or a Kontakt Lua loader) loads it.
//
// THE SOURCE IS GIT BY DEFAULT (CLAUDE.md: "a copy-forward takes the piece's files from GIT or asks him").
// The old racks' working files are NEWER than git and are his; `--source disk` READS them, never writes.
// Once he has saved the rack from Reaper the file is HIS: this tool is then only a record of how it was made —
// a track is added or re-cloned through the bridge, never by rebuilding the file.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'reaper', 'decibel_rack.rpp');
const SOURCES = {
  p5: { repo: path.resolve(ROOT, '..', 'septet_2026'), file: 'reaper/septet_rack.rpp', piece: 'piece #5 septet_2026' },
  p6: { repo: path.resolve(ROOT, '..', 'septet_LGMF_2026'), file: 'reaper/LGMF_rack.rpp', piece: 'piece #6 septet_LGMF_2026' },
};
const HEADER_FROM = 'p6';
// Score order. `nth` picks among same-named source tracks (piece #5 has TWO "Bass Clarinet XS": the first holds
// the four D11 slots and the strike slot; the second, a single slot, is not carried — RUNNING_LOG §19).
const TRACKS = [
  { name: 'Bass Flute XS', empty: true },
  { name: 'Bass Clarinet XS', from: 'p5', src: 'Bass Clarinet XS', nth: 0 },
  { name: 'Viola XS', from: 'p5', src: 'Va XS', nth: 0 },
  { name: 'Cello XS', from: 'p6', src: 'Cello XS', nth: 0 },
];

const args = process.argv.slice(2);
const flag = f => args.includes(f);
const SOURCE = args.includes('--source') ? args[args.indexOf('--source') + 1] : 'git';
if (!['git', 'disk'].includes(SOURCE)) { console.error('--source git|disk'); process.exit(2); }

function load(key) {
  const s = SOURCES[key];
  let text, rev;
  if (SOURCE === 'git') {
    text = execFileSync('git', ['-C', s.repo, 'show', 'HEAD:' + s.file], { maxBuffer: 1 << 29, encoding: 'latin1' });
    rev = execFileSync('git', ['-C', s.repo, 'log', '-1', '--format=%h %ad', '--date=short', '--', s.file], { encoding: 'utf8' }).trim();
  } else {
    const p = path.join(s.repo, s.file);
    text = fs.readFileSync(p, 'latin1');
    rev = 'working file, saved ' + fs.statSync(p).mtime.toISOString().slice(0, 16).replace('T', ' ');
  }
  const lines = text.split(/\r?\n/);
  const tracks = [];
  let depth = 0, cur = null;
  lines.forEach((l, i) => {
    const t = l.trim();
    if (t.startsWith('<')) { depth++; if (depth === 2 && t.startsWith('<TRACK')) cur = { start: i }; }
    else if (t === '>') { if (cur && depth === 2) { cur.end = i; tracks.push(cur); cur = null; } depth--; }
    else if (cur && depth === 2 && t.startsWith('NAME ')) cur.name = t.slice(5).replace(/^"|"$/g, '');
  });
  if (depth !== 0 || !tracks.length) throw new Error(key + ': not a balanced Reaper project');
  return { ...s, lines, tracks, rev };
}
const fxHash = chunk => {
  const j = chunk.findIndex(l => l.trim().startsWith('<FXCHAIN'));
  return j < 0 ? null : crypto.createHash('sha1').update(chunk.slice(j).map(l => l.trim()).join('\n')).digest('hex').slice(0, 12);
};
const guid = () => '{' + crypto.randomUUID().toUpperCase() + '}';

function clone(src, row) {
  const hits = src.tracks.filter(t => t.name === row.src);
  const t = hits[row.nth || 0];
  if (!t) throw new Error(`"${row.src}" not found in ${src.file}`);
  const chunk = src.lines.slice(t.start, t.end + 1);
  const before = fxHash(chunk);
  let depth = 0, seen = { NAME: 0, VOLPAN: 0, REC: 0 };
  const out = chunk.map(l => {
    const s = l.trim(), ind = l.slice(0, l.length - l.trimStart().length);
    if (s.startsWith('<')) { depth++; return l; }
    if (s === '>') { depth--; return l; }
    if (depth !== 1) return l;                                   // only the track's own lines; never inside FXCHAIN
    if (s.startsWith('NAME ')) { seen.NAME++; return ind + `NAME "${row.name}"`; }
    if (s.startsWith('VOLPAN ')) { seen.VOLPAN++; const p = s.split(' '); p[1] = '1'; return ind + p.join(' '); }
    if (s.startsWith('REC ')) { seen.REC++; return ind + 'REC 0 -1 1 0 0 0 0 0'; }
    if (s.startsWith('AUXRECV ')) throw new Error(`"${row.src}" has a receive — a track index would dangle`);
    return l;
  });
  if (seen.NAME !== 1 || seen.VOLPAN !== 1 || seen.REC !== 1) throw new Error(`"${row.src}": expected one NAME, VOLPAN, REC — saw ${JSON.stringify(seen)}`);
  const after = fxHash(out);
  if (before !== after) throw new Error(`"${row.src}": the plugin state changed in the copy`);
  return { lines: out, report: `${row.name.padEnd(18)} <- ${src.piece} "${row.src}"${hits.length > 1 ? ' (1 of ' + hits.length + ')' : ''} · ${chunk.length} lines · plugin state ${after} carried byte-exact` };
}
function empty(row) {
  const g = guid();
  return { lines: [`  <TRACK ${g}`, `    NAME "${row.name}"`, '    VOLPAN 1 0 -1 -1 1', '    MUTESOLO 0 0 0', '    ISBUS 0 0', '    REC 0 -1 1 0 0 0 0 0', '    NCHAN 2', '    FX 1', `    TRACKID ${g}`, '    MAINSEND 1 0', '  >'],
    report: `${row.name.padEnd(18)} <- a bare track (the bridge inserts the sampler; the load is his, or a Kontakt Lua loader's)` };
}

// --emit "<track name>" <file>: ONE cloned track chunk to a file, for a rack he has already saved — the chunk is
// then set on the existing track through the bridge (reaper.SetTrackStateChunk), and make_tracks.lua run after it
// to give the track its input back. This is how a track is re-cloned without rebuilding the file (RUNNING_LOG §20).
// --emit-src <p5|p6> "<source track>" "<new name>" <file>: the same, for ANY track of an old rack (not only the
// TRACKS rows) — a percussion instrument an earlier piece already loaded, a second instance. Same three rewrites.
if (flag('--emit-src')) {
  const i = args.indexOf('--emit-src'), key = args[i + 1], srcName = args[i + 2], name = args[i + 3], file = args[i + 4];
  if (!SOURCES[key] || !srcName || !name || !file) { console.error('--emit-src <' + Object.keys(SOURCES).join('|') + '> "<source track>" "<new name>" <outfile>'); process.exit(2); }
  const s = load(key), r = clone(s, { name, src: srcName, nth: 0 });
  fs.writeFileSync(file, r.lines.join('\n') + '\n', 'latin1');
  console.log(`source: ${SOURCE} · ${s.piece} ${s.file} @ ${s.rev}\n  ${r.report}\n  -> ${file}`);
  process.exit(0);
}
if (flag('--emit')) {
  const i = args.indexOf('--emit'), name = args[i + 1], file = args[i + 2];
  const row = TRACKS.find(t => t.name === name && t.from);
  if (!row || !file) { console.error('--emit "<a cloned track of TRACKS>" <outfile>'); process.exit(2); }
  const s = load(row.from), r = clone(s, row);
  fs.writeFileSync(file, r.lines.join('\n') + '\n', 'latin1');
  console.log(`source: ${SOURCE} · ${s.piece} ${s.file} @ ${s.rev}\n  ${r.report}\n  -> ${file}`);
  process.exit(0);
}

const src = {};
for (const k of new Set([HEADER_FROM, ...TRACKS.filter(t => t.from).map(t => t.from)])) src[k] = load(k);
const h = src[HEADER_FROM];
const header = h.lines.slice(0, h.tracks[0].start);
const tail = h.lines.slice(h.tracks[h.tracks.length - 1].end + 1).filter((l, i, a) => !(i === a.length - 1 && l === ''));
const body = [], report = [];
for (const row of TRACKS) { const r = row.empty ? empty(row) : clone(src[row.from], row); body.push(...r.lines); report.push(r.report); }
const all = [...header, ...body, ...tail];
let depth = 0; for (const l of all) { const t = l.trim(); if (t.startsWith('<')) depth++; else if (t === '>') depth--; }
if (depth !== 0) throw new Error('the built project is not balanced');
const text = all.join('\r\n') + '\r\n';

console.log(`source: ${SOURCE}`);
for (const k of Object.keys(src)) console.log(`  ${src[k].piece} ${src[k].file} @ ${src[k].rev}`);
console.log(`header: ${header.length} lines from ${h.piece}`);
report.forEach(r => console.log('  ' + r));
console.log(`total: ${all.length} lines, ${(text.length / 1048576).toFixed(1)} MB, ${TRACKS.length} tracks`);
if (flag('--dry')) { console.log('dry run — nothing written'); process.exit(0); }
if (fs.existsSync(OUT) && !flag('--force')) { console.error(`refusing: ${path.relative(ROOT, OUT)} exists — once saved from Reaper it is his (--force only before that)`); process.exit(3); }
fs.writeFileSync(OUT, text, 'latin1');
console.log('wrote ' + path.relative(ROOT, OUT));
