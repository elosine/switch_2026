#!/usr/bin/env node
// strike_art.js — THE STRIKES OF A SCORE PUT INTO ONE ARTICULATION SET (PLAN.md 1.9 · 17.3; DEC-121, 2026-10-10: "all the ones I played in
// should be converted to the staccato type of strike. I think some of them I use Ordinario"). The Strikes drawer presses a SET at the
// insert (percussive · spiccato · staccato · ordinario — score/public/strike_drawer.js ART_SETS: one voice per instrument); a strike
// inserted in another set keeps that set's voices. This tool moves every strike note of the score to the set asked for.
//
//   node tools/strike_art.js --score sec05b [--art staccato] [--dry]
//
// A note is touched only if it is a strike's (`grp-strike-…`) AND its voice is one some set gives its instrument — a voice set by hand
// is left alone and counted. Only `technique` changes (the drawer writes the same note either way: the set is the voice). The base is
// the NEWER of the save and the page's working copy; the save is written — then File ▾ → Reload. The windows and everything else: untouched.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 && process.argv[i + 1] != null && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const die = (m) => { console.error(m); process.exit(1); };
const NAME = arg('score'); if (!NAME) die('--score <name>   (node tools/strike_art.js --score sec05b [--art staccato] [--dry])');
const ART = arg('art', 'staccato'), DRY = flag('dry');
const FILE = path.join(ROOT, 'scores', NAME + '.json'), WORK = path.join(ROOT, 'scores', NAME + '-work.json');
if (!fs.existsSync(FILE)) die('no such score: scores/' + NAME + '.json');
// the drawer's sets, read from its own file (never copied)
const src = fs.readFileSync(path.join(ROOT, 'score', 'public', 'strike_drawer.js'), 'utf8');
const def = src.match(/const STRIKE_DEFAULT = (\{[^\n]*\});/), sets = src.match(/const ART_SETS = \{[\s\S]*?\n\};/);
if (!def || !sets) die('strike_drawer.js: STRIKE_DEFAULT or ART_SETS not found');
const SETS = vm.runInNewContext(def[0] + '\n' + sets[0] + '\n;ART_SETS;', {});
if (!SETS[ART]) die('--art: none of ' + Object.keys(SETS).join(', '));
const useWork = fs.existsSync(WORK) && fs.statSync(WORK).mtimeMs > fs.statSync(FILE).mtimeMs;
const s = JSON.parse(fs.readFileSync(useWork ? WORK : FILE, 'utf8'));
const inst = (l) => (s.tracks[l] || {}).instKey, short = (l) => (s.tracks[l] || {}).short || 'L' + l;
const voicesOf = (key) => new Set(Object.values(SETS).map((S) => S[key]).filter(Boolean));
let moved = 0, kept = 0, byHand = 0, noVoice = 0; const per = {};
for (const o of s.objects) {
    if (o.type !== 'waveCurve' || o.sonifyNote == null || !/^grp-strike-/.test(String(o.groupId || ''))) continue;
    const key = inst(o.layer), want = key && SETS[ART][key];
    if (!want) { noVoice++; continue; }                       // the set gives this instrument no voice (the mallets' lane outside ordinario)
    if (!voicesOf(key).has(o.technique)) { byHand++; continue; }   // a voice no set gives: his own
    if (o.technique === want) { kept++; continue; }
    const k = short(o.layer) + ' ' + o.technique + ' → ' + want; per[k] = (per[k] || 0) + 1;
    if (!DRY) o.technique = want;
    moved++;
}
const out = [NAME + (useWork ? ' (the page\'s working copy — newer than the save)' : '') + ' → the ' + ART + ' set: ' + moved + ' notes moved · ' + kept + ' already there' + (byHand ? ' · ' + byHand + ' with a voice of his own, left' : '') + (noVoice ? ' · ' + noVoice + ' on a lane the set has no voice for, left' : '')]
    .concat(Object.entries(per).map(([k, n]) => '  ' + k + ' × ' + n));
if (DRY) { out.push('(dry — nothing written)'); console.log(out.join('\n')); process.exit(0); }
fs.writeFileSync(FILE, JSON.stringify(s));
out.push('written: scores/' + NAME + '.json — in the page: File ▾ → Reload');
console.log(out.join('\n'));
