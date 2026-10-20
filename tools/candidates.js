#!/usr/bin/env node
// candidates.js — THE SHELF (RUNNING_LOG §109 · §113): the process-brick settings he keeps. The DATA is bank/candidates.json;
// docs/CANDIDATES.md is RENDERED from it here (never edited by hand). Two roads add a row: the AI, at his "keep this" / a
// screenshot (edit the JSON, then `node tools/candidates.js`), and the brick's "keep → shelf" button (score/server.js
// POST /api/candidates → add() below, which writes both).
//
//   node tools/candidates.js            render docs/CANDIDATES.md from the JSON
//   node tools/candidates.js --list     one line per row
//   require(...)  → { load, add, render }
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_FILE = path.join(ROOT, 'bank', 'candidates.json');
const MD_FILE = path.join(ROOT, 'docs', 'CANDIDATES.md');
const SETTING_KEYS = ['effect', 'args', 'end', 'atkMs', 'durMs', 'relMs', 'curve', 'floorDb', 'capMs', 'gainDb', 'match', 'label'];

function load() {
    try { const d = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')); return Array.isArray(d.rows) ? d.rows : []; }
    catch (e) { return []; }
}
// THE DEALS (RUNNING_LOG §137): a whole score's transformations kept at once — the command, the presets it drew from, the frozen
// score, the map brick → sample → variant. Added by the AI at his "add that one to the candidates" after a reseed; a second table.
function loadDeals() {
    try { const d = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')); return Array.isArray(d.deals) ? d.deals : []; }
    catch (e) { return []; }
}

function save(rows) {
    let d = {};
    try { d = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')); } catch (e) { d = {}; }
    d.rows = rows;
    fs.writeFileSync(JSON_FILE, JSON.stringify(d, null, 2).replace(/\r\n/g, '\n') + '\n');
}

const str = (v, n) => String(v == null ? '' : v).replace(/[\r\n|]/g, ' ').trim().slice(0, n || 200);
const isRange = (v) => Array.isArray(v) && v.length === 2 && Number.isFinite(+v[0]) && Number.isFinite(+v[1]);

// a setting as the brick's JSON box gives it: only the known keys; args numbers or [lo, hi] ranges
function cleanSetting(s) {
    const o = {};
    if (!s || typeof s !== 'object') return o;
    for (const k of SETTING_KEYS) {
        if (s[k] === undefined) continue;
        if (k === 'args') {
            o.args = {};
            if (s.args && typeof s.args === 'object') for (const a of Object.keys(s.args)) {
                if (!/^[A-Za-z][A-Za-z0-9]*$/.test(a)) continue;
                if (isRange(s.args[a])) o.args[a] = [+s.args[a][0], +s.args[a][1]];
                else if (Number.isFinite(+s.args[a])) o.args[a] = +s.args[a];
            }
        } else if (k === 'effect' || k === 'end' || k === 'label') o[k] = str(s[k], 40);
        else if (Number.isFinite(+s[k])) o[k] = +s[k];
    }
    return o;
}

// one more row — from the page's button (body: setting · heardOn · out · label · effect · render · remark) or from the AI
function add(body) {
    const rows = load();
    const n = rows.reduce((m, r) => Math.max(m, +r.n || 0), 0) + 1;
    const setting = cleanSetting(body.setting);
    const row = {
        n, kept: new Date().toISOString().slice(0, 16), heardOn: str(body.heardOn, 64), out: str(body.out, 64), label: str(body.label, 40),
        effect: str(body.effect || setting.effect, 40), setting, render: str(body.render, 120), remark: str(body.remark, 300), note: str(body.note, 300),
    };
    rows.push(row);
    save(rows);
    render(rows);
    return row;
}

const HEADER = `# CANDIDATES — settings he has heard and wants kept, for the impulse processing chain

*Opened 2026-10-05 at his word (RUNNING_LOG §109): "could you keep these as a list of candidates for this impulse processing chain?"
A candidate is a process brick's SETTING as he had it when he said keep — pasted back into any brick's JSON box → Apply → Render, or
picked from the brick panel's **Shelf** menu, it is the same sound again. A row is added by the AI whenever he says "keep this" /
"candidate" (a screenshot or the box's JSON is enough), or by the brick's **keep → shelf** button (§113). His remark is quoted; the
AI's note is in italics. Which of these go into the piece, and in what order, is his — this is the shelf.*

**THIS FILE IS RENDERED from \`bank/candidates.json\` by \`node tools/candidates.js\` — edit the JSON, not this.** The \`source\` is not
in a setting on purpose: a candidate is a TREATMENT, applied to whatever the brick's source is. The row says what it was heard on.

| # | kept | heard on | effect | the setting (paste into the box) | the render he heard | his remark |
|---|---|---|---|---|---|---|
`;

function render(rows) {
    rows = rows || load();
    const lines = rows.slice().sort((a, b) => (+a.n) - (+b.n)).map((r) => {
        const on = '`' + r.heardOn + '`' + (r.out ? ' → `' + r.out + '`' : '') + (r.label ? ', label "' + r.label + '"' : '');
        const setting = '`' + JSON.stringify(r.setting) + '`' + (r.note ? ' — *' + r.note + '*' : '');
        const remark = r.remark ? '*"' + r.remark + '"*' : '*(no words)*';
        return '| ' + r.n + ' | ' + String(r.kept).replace('T', ' ') + ' | ' + on + ' | **' + r.effect + '** | ' + setting + ' | ' + (r.render || '') + ' | ' + remark + ' |';
    });
    const deals = loadDeals().slice().sort((a, b) => (+a.n) - (+b.n)).map((d) => {
        const plays = Object.values(d.variants || {}).map((b) => b.at + ' s ' + b.lane + ' ' + (b.behaviour || '') + ': ' + Object.entries(b.variants || {}).map(([s, v]) => s + '~' + v).join(' · ')).join(' / ');
        return '| ' + d.n + ' | ' + String(d.kept).replace('T', ' ') + ' | `' + d.score + '` seed **' + d.seed + '** — `' + d.command + '` | ' + str(d.presets, 160) + ' | `' + d.frozen + '` | ' + (d.bricks || '') + ' bricks · ' + (d.plays || '') + ' plays — ' + str(plays, 4000) + ' | ' + (d.remark ? '*"' + d.remark + '"*' : '*(no words)*') + (d.note ? ' — *' + d.note + '*' : '') + ' |';
    });
    const DEALS = deals.length ? `
## THE DEALS — whole scores' transformations he has heard and wants kept (RUNNING_LOG §137)

*A deal is every return of a score given its preset at once (\`tools/deal_variants.js\`). It comes back by its command while the presets
file and the bricks are as they were; the frozen score gives it whatever changes (File ▾ → open it). The map says which preset went
on which sample of which brick.*

| # | kept | score · seed · the command | the presets it drew from | the frozen score | the map | his remark |
|---|---|---|---|---|---|---|
` + deals.join('\n') + '\n' : '';
    fs.writeFileSync(MD_FILE, HEADER + lines.join('\n') + '\n' + DEALS);
    return lines.length + deals.length;
}

if (require.main === module) {
    const rows = load();
    if (process.argv.includes('--list')) { for (const r of rows) console.log(r.n + ' · ' + r.kept + ' · ' + r.effect + ' on ' + r.heardOn + (r.remark ? ' — "' + r.remark + '"' : '')); }
    else console.log('docs/CANDIDATES.md rendered — ' + render(rows) + ' rows');
}

module.exports = { load, loadDeals, add, render, cleanSetting };
