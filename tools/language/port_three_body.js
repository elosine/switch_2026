// tools/language/port_three_body.js — THE THREE BODY PROBLEM'S BADGE, FROM THE LINEAGE (decibel PLAN 2.3 · 2.6; RUNNING_LOG §355; DEC-126).
//
//   node tools/language/port_three_body.js [--dry] [--points 70]
//
// Piece #2 (composition_for_two_pianos_and_two_percussion) has the three body problem's badge, his and finished ("locked session 63"):
// nine trajectory arcs of three bodies and the three bodies themselves, in a rounded square —
//   scripts/badges/three_body/three_body_badge.svg   (made there by build_badge.js; READ ONLY here, never edited).
// This piece's badges are a 36-unit rounded square of the format's ground with the sign in its colour (rules.json language.format).
// This tool PORTS the drawing into that format: the source's own square is mapped onto the 36 units (so the arcs keep their place
// inside the badge), each arc is thinned to about --points points (the source has 200 … 500 a path — far finer than 36 units need),
// the arcs are stroked and the bodies filled in `currentColor`. It writes ONLY the block "methods": { … } of
// notation/registry/rules.json (the rest byte for byte, in the file's own line ending) — a METHOD's badge is not one of the
// language's six types (bank/language/language.json → tools/language/to_rules.js) and not the electronics' (the table `electronics`).
// Then: node tools/gen_engraving_rules.js · node tools/check_rules.js.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..'), FILE = path.join(ROOT, 'notation', 'registry', 'rules.json');
const SRC = path.join(ROOT, '..', 'composition_for_two_pianos_and_two_percussion', 'scripts', 'badges', 'three_body', 'three_body_badge.svg');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes('--dry'), POINTS = Math.max(12, Math.round(+arg('points', 70)) || 70);
const CRLF = String.fromCharCode(13, 10), BS = String.fromCharCode(92);
if (!fs.existsSync(SRC)) throw new Error('port_three_body: piece #2\'s drawing is not at ' + SRC);
const svg = fs.readFileSync(SRC, 'utf8');
// the source's own square (its envelope): the rect with a stroke and no fill
const env = svg.match(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" rx="[-\d.]+" ry="[-\d.]+" fill="none"/);
if (!env) throw new Error('port_three_body: the source\'s envelope rect was not found');
const ex = +env[1], ey = +env[2], ew = +env[3], eh = +env[4], U = 36, k = U / Math.max(ew, eh);
const paths = [...svg.matchAll(/<path d="([^"]*)"([^>]*)>/g)].map((m) => ({ d: m[1], filled: /fill="#000"/.test(m[2]) && !/fill="none"/.test(m[2]) }));
if (paths.length !== 12) throw new Error('port_three_body: ' + paths.length + ' paths in the source, 12 expected (nine arcs, three bodies)');
const pts = (d) => { const tok = d.trim().split(/\s+/), out = []; for (let i = 0; i < tok.length;) { const c = tok[i]; if (c === 'M' || c === 'L') { out.push([+tok[i + 1], +tok[i + 2]]); i += 3; } else if (c === 'Z' || c === 'z') { i++; } else throw new Error('port_three_body: a path command this port does not know: ' + c); } return out; };
const map = ([x, y]) => [(x - ex) * k, (y - ey) * k];
const thin = (a, n) => { if (a.length <= n) return a; const out = []; for (let i = 0; i < n; i++) out.push(a[Math.round(i * (a.length - 1) / (n - 1))]); return out; };
const f2 = (v) => String(Math.round(v * 100) / 100);
const dOf = (a, close) => a.map((p, i) => (i ? 'L' : 'M') + f2(p[0]) + ' ' + f2(p[1])).join('') + (close ? 'Z' : '');
const arcs = paths.filter((p) => !p.filled).map((p) => dOf(thin(pts(p.d).map(map), POINTS), false));
// the three bodies are small bezier shapes (M · c · C · z, even-odd): kept AS DRAWN, carried into the 36 units by one transform
const bodies = paths.filter((p) => p.filled).map((p) => p.d.trim().replace(/\s+/g, ' '));
if (arcs.length !== 9 || bodies.length !== 3) throw new Error('port_three_body: ' + arcs.length + ' arcs and ' + bodies.length + ' bodies, 9 and 3 expected');
if (bodies.some((d) => /['"<>]/.test(d))) throw new Error('port_three_body: a body\'s path holds a character the sign cannot carry');
const sign = "<g fill='none' stroke='currentColor' stroke-width='0.7' stroke-linecap='round' stroke-linejoin='round'>" + arcs.map((d) => "<path d='" + d + "'/>").join('') + '</g>'
    + "<g fill='currentColor' fill-rule='evenodd' transform='scale(" + (Math.round(k * 1e6) / 1e6) + ') translate(' + f2(-ex) + ' ' + f2(-ey) + ")'>" + bodies.map((d) => "<path d='" + d + "'/>").join('') + '</g>';
const src = fs.readFileSync(FILE, 'utf8'), R = JSON.parse(src), EOL = src.includes(CRLF) ? CRLF : String.fromCharCode(10), q = (v) => JSON.stringify(v);
const COLOUR = (R.methods && R.methods.badges && R.methods.badges.threeBody && R.methods.badges.threeBody.colour) || '@colours.formatBlue.value';   // a colour he changed in the file is kept
const DOC = "THE METHODS' BADGES (decibel PLAN 2.3 · 2.6; RUNNING_LOG §355; DEC-102 · DEC-126). A METHOD is a way of playing together that a whole section runs by — not one of the language's six kinds of sound (the table `language`) and not the electronics' (the table `electronics`). Its badge ANNOUNCES the section, larger than a language badge (objects.methodBadge.scale), with the badge of the section's material beside it. The format is the language badges' (language.format: the rounded square, the ground). badges.<id>: sign = the drawing in the format's 36 units, `currentColor` its colour; colour = a pointer to a `colours` row. `threeBody` is WRITTEN BY tools/language/port_three_body.js from piece #2's own badge (scripts/badges/three_body/three_body_badge.svg there — nine trajectory arcs, three bodies; his, locked) — never by hand; its colour is a row here, his to change (the tool keeps it).";
const block = [' "methods": {', '  "_doc": ' + q(DOC) + ',', '  "badges": {',
    '   "threeBody": { "name": "the three body problem — far apart · approaching · close pass · break and rejoin", "colour": ' + q(COLOUR) + ', "sign": ' + q(sign) + ' }', '  }', ' }'].join(EOL);
const KEY = EOL + ' "methods": {', at = src.indexOf(KEY);
let out;
if (at >= 0) {
    let i = at + KEY.length, depth = 1, inStr = false;      // the brace that closes the block, strings skipped
    for (; i < src.length && depth > 0; i++) { const ch = src[i]; if (inStr) { if (ch === BS) i++; else if (ch === '"') inStr = false; } else if (ch === '"') inStr = true; else if (ch === '{') depth++; else if (ch === '}') depth--; }
    if (depth) throw new Error('port_three_body: the methods block does not close');
    out = src.slice(0, at) + EOL + block + src.slice(i);
} else {
    const ANCHOR = EOL + EOL + ' "electronics": {';
    if (src.split(ANCHOR).length !== 2) throw new Error('port_three_body: the place before "electronics" was not found once');
    out = src.replace(ANCHOR, () => EOL + EOL + block + ',' + ANCHOR);
}
JSON.parse(out);                                           // the file is still JSON, or nothing is written
console.log('the three body badge: 9 arcs of ' + POINTS + ' points, 3 bodies — ' + sign.length + ' characters (the source: ' + svg.length + ')');
if (out === src) { console.log('rules.json methods: already so'); process.exit(0); }
if (DRY) { console.log('DRY — nothing written'); process.exit(0); }
fs.writeFileSync(FILE, out);
console.log('wrote rules.json methods.badges.threeBody');
