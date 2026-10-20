// tools/language/to_instructions.js — HIS CHOSEN BADGES AS IMAGE FILES FOR THE PERFORMANCE INSTRUCTIONS (RUNNING_LOG §442).
//
//   node tools/language/to_instructions.js [--dry]
//
// bank/language/language.json holds his choice per type (a `symbol` and a `colour`). The performance instructions page
// (docs/notation_instructions/index.html, the section Language Music) shows each chosen badge beside its name, as an <img>:
// this writes docs/notation_instructions/images/badge_<type id>.svg for every chosen type, from the bank, through the same
// drawing the working page and the notation registry use (tools/language/badge_lib.js). Run it after a choice changes.
// A file is a standalone svg (the xmlns added); its size is the page's business (img.zoomed, --w 84).
'use strict';
const fs = require('fs'), path = require('path');
const { chosenBadge, chosenTypes } = require('./badge_lib');
const OUT = path.join(__dirname, '..', '..', 'docs', 'notation_instructions', 'images');
const dry = process.argv.includes('--dry');

if (!dry) fs.mkdirSync(OUT, { recursive: true });
chosenTypes().forEach(t => {
  let svg = chosenBadge(t.id, 84);
  if (!svg) { console.log('  — ' + t.id + ': not chosen, no file'); return; }
  if (!/\sxmlns=/.test(svg)) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const file = path.join(OUT, 'badge_' + t.id + '.svg');
  if (!dry) fs.writeFileSync(file, svg);
  console.log((dry ? '  would write ' : '  wrote ') + 'docs/notation_instructions/images/badge_' + t.id + '.svg  (' + t.name + ', ' + t.colour + ')');
});
