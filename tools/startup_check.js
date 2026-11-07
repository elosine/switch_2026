#!/usr/bin/env node
// startup_check.js — docs/STARTUP.md's checks, one line each: Reaper · the engine's two ports · the lab's server. LOOKS ONLY.
//   node tools/startup_check.js            the four rows and which step is the first missing one
'use strict';
const cp = require('child_process');

function listening(port) {
    const out = cp.execSync('netstat -an -p tcp', { encoding: 'utf8' });
    return out.split('\n').some((l) => l.includes(':' + port + ' ') && l.includes('LISTENING'));
}
function running(name) {
    const out = cp.execSync('tasklist /fi "imagename eq ' + name + '"', { encoding: 'utf8' });
    return out.toLowerCase().includes(name.toLowerCase());
}
const rows = [
    ['1 Reaper with the rack', running('reaper.exe'), 'open reaper\\switch_rack.rpp'],
    ['2 the engine', listening(57210) && listening(57211), 'double-click start_electronics.bat (wait for LE_READY)'],
    ['3 the lab server', listening(5620), 'double-click start_icy_lab.bat'],
];
let first = null;
for (const [name, ok, cure] of rows) {
    console.log((ok ? '  ok   ' : '  --   ') + name + (ok ? '' : '   -> ' + cure));
    if (!ok && !first) first = name;
}
console.log(first ? 'next: ' + first : '4 the page: http://localhost:5620/');
process.exit(first ? 1 : 0);
