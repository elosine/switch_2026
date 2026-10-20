// tools/signs/state_signs_to_instructions.js — THE THREE BODY PROBLEM'S FOUR STATE SIGNS AS IMAGE FILES FOR THE PERFORMANCE
// INSTRUCTIONS (decibel RUNNING_LOG §470).
//
//   node tools/signs/state_signs_to_instructions.js [--dry]
//
// The performance instructions page (docs/notation_instructions/index.html, the section Three Body Problem) shows each state's
// sign beside its name and text, as an <img>. This writes docs/notation_instructions/images/state_<state id>.svg for the four
// states, AS THE NOTATION DRAWS THEM — all from notation/registry/rules.json: the drawing (the table `stateSigns`), the colour
// (objects.stateWedge.states.<state>.colour), the ground (objects.stateSign.ground: the state's colour at its opacity) and the
// badge format's square (language.format: units and corner). The ground is see-through in the score, where it lies on a white
// lane: the file carries that white under it, so the sign looks the same on any page. Run it after a sign, a colour or the
// ground changes in the registry. The image's size is the page's business (img.zoomed, --w): the sign is objects.stateSign.sizeSs
// in the frame, shown at the score images' 2 x — the number this prints.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const R = JSON.parse(fs.readFileSync(path.join(ROOT, 'notation', 'registry', 'rules.json'), 'utf8'));
const OUT = path.join(ROOT, 'docs', 'notation_instructions', 'images');
const dry = process.argv.includes('--dry');
const deref = (v) => { const m = /^@colours\.([A-Za-z0-9_]+)\.value$/.exec(String(v)); return m && R.colours[m[1]] ? R.colours[m[1]].value : v; };

const SS = R.objects.stateSign, SW = R.objects.stateWedge, F = R.language.format, T = (R.stateSigns || {}).types;
if (!SS || !SW || !SW.states || !F || !T) throw new Error('state_signs_to_instructions: rules.json lacks objects.stateSign · objects.stateWedge.states · language.format · stateSigns.types');
const U = F.viewUnits, RX = F.cornerUnits;
// the frame's staff space in px: the language badge's own two numbers (objects.badge.sizeSs 5.3 = 41.9 px — RUNNING_LOG §351)
const SS_PX = 41.9 / 5.3, px = Math.round(SS.sizeSs * SS_PX * 2);

if (!dry) fs.mkdirSync(OUT, { recursive: true });
Object.keys(T).forEach((id) => {
  if (!SW.states[id]) throw new Error('state_signs_to_instructions: no colour for the state "' + id + '" in objects.stateWedge.states');
  const col = deref(SW.states[id].colour);
  const g = SS.ground || null, gFill = g ? (g.colour === 'state' ? col : deref(g.colour)) : deref(F.ground);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + U + ' ' + U + '" width="' + px + '" height="' + px + '">' +
    (g && g.opacity != null ? '<rect width="' + U + '" height="' + U + '" rx="' + RX + '" fill="#ffffff"/>' : '') +
    '<rect width="' + U + '" height="' + U + '" rx="' + RX + '" fill="' + gFill + '"' + (g && g.opacity != null ? ' fill-opacity="' + g.opacity + '"' : '') + '/>' +
    String(T[id].sign).split('currentColor').join(col) + '</svg>\n';
  if (!dry) fs.writeFileSync(path.join(OUT, 'state_' + id + '.svg'), svg);
  console.log((dry ? '  would write ' : '  wrote ') + 'docs/notation_instructions/images/state_' + id + '.svg  (' + col + ')');
});
console.log('  on the page: <img class="zoomed" style="--w: ' + px + '" …>   (' + SS.sizeSs + ' ss in the frame, at 2 x)');
