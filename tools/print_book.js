#!/usr/bin/env node
// print_book.js — THE PRINT SCORE OF MULTIPLICITY AS ONE BOOK (RUNNING_LOG §471; his word 2026-11-24: "prepare the print score, we'll use the
// full 11x17"). The score is four pages of the notation app, each with its own pace (the draft order, then the phase section), so the book is
// four runs of tools/export_print.js on Tabloid landscape — the page numbers running on through all four — joined into one PDF, with the cover
// and the performance instructions in front when they exist.
//
//   node tools/print_book.js [--out print/score/Multiplicity-score.pdf] [--instructions on]
//
// The music is drawn from each page's IR (notation/ir/<id>.ir.json), not from a save: rebuild a page's IR first when its music changes.
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : process.argv[i + 1]; };
const OUT = path.resolve(ROOT, arg('out', 'print/score/Multiplicity-score.pdf'));
const FORMAT = arg('format', 'tabloid-landscape');
const INS = arg('instructions', fs.existsSync(path.join(ROOT, 'docs', 'notation_instructions', 'index.html')) ? 'on' : 'off');
const SECTIONS = ['s1-sines', 's2-piano-solo-final', 's2-ctpt-heads', 's3-phase'];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'print-book-'));
const run = a => { const r = spawnSync(process.execPath, [path.join(__dirname, 'export_print.js'), '--format', FORMAT, ...a], { encoding: 'utf8', cwd: ROOT }); if (r.status !== 0) { console.error(r.stdout + r.stderr); process.exit(1); } return r.stdout; };

const parts = [];
// the front matter: the cover, and the instructions when the page exists (drawn with the first section's frame, its music pages dropped)
const front = path.join(tmp, '0-front.pdf');
const fo = run(['--ir', SECTIONS[0], '--cover', 'on', '--instructions', INS, '--pages', '1', '--out', front]);
const nFront = +((/(\d+) front matter/.exec(fo) || [])[1] || 0);
parts.push({ file: front, keep: nFront });
let folio = 0;
SECTIONS.forEach((id, i) => {
  const f = path.join(tmp, (i + 1) + '-' + id + '.pdf');
  // [§478] the final bar line only at the end of the piece, never at the end of a section
  const o = run(['--ir', id, '--folio0', String(folio), '--finalBar', i === SECTIONS.length - 1 ? 'on' : 'off', '--out', f]);
  const n = +((/(\d+) of music/.exec(o) || [])[1] || 0);
  if (!n) { console.error(id + ': no pages written\n' + o); process.exit(1); }
  console.log(id.padEnd(22) + n + ' pages, numbered ' + (folio + 1) + ' to ' + (folio + n));
  parts.push({ file: f, keep: n });
  folio += n;
});
const py = path.join(tmp, 'join.py');
fs.writeFileSync(py, ['import json, sys', 'from pypdf import PdfReader, PdfWriter', 'parts = json.loads(sys.argv[1]); w = PdfWriter()',
  'for p in parts:', '    r = PdfReader(p["file"])', '    for k in range(p["keep"]): w.add_page(r.pages[k])', 'w.add_metadata({"/Title": "Multiplicity", "/Author": "", "/Creator": "", "/Producer": ""})',
  'w.write(sys.argv[2])'].join('\n'));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const r = spawnSync('python', [py, JSON.stringify(parts.map(p => ({ file: p.file, keep: p.keep }))), OUT], { encoding: 'utf8' });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
console.log('front matter ' + nFront + ' page(s) · music ' + folio + ' pages · ' + (fs.statSync(OUT).size / 1048576).toFixed(1) + ' MB → ' + path.relative(ROOT, OUT));
fs.rmSync(tmp, { recursive: true, force: true });
