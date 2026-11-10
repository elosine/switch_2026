#!/usr/bin/env node
// uvi_split_ks.js — A KEYSWITCH PRESET SPLIT INTO ONE-LAYER PARTS, as text (the MIDI shore-up, 2026-11-10, RUNNING_LOG §143). His standard:
// "every articulation on its own channel — no keyswitches". An SI2 KS preset is ONE program holding several LAYERS (Flute FX KS: Jet
// Whistle C1 · Key Click C#1 · Tongue Ram D1), a script switching among them on the red keys. This tool clones the loaded program onto
// free parts of an instance (tools/uvi_edit.js clone — a program the GUI has loaded once can be cloned as text, uvi.md § 2) and in each
// clone BYPASSES AND MUTES every layer but one, renaming the program "<preset> · <layer>" so tools/apply_uvi_parts.js can place a
// technique on it by name. No keyswitch is ever sent to such a part. Proof: the jet whistle's swell on a part that received no key.
//
//   node tools/uvi_split_ks.js "<dst track>" "<program display name>" --parts 7,8 --layers "Jet Whistle,Tongue Ram" [--src "<track>"] [--dry]
//     --layers: one substring per part, matched against the layers' DisplayName (case-insensitive); --src: the instance that holds the
//     loaded program when it is another track of the same instrument (the sax's main instance for the b). Pushes with uvi_state.js
//     encode --push (which reloads the plugin), then prints the read-back table of the parts touched.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] != null ? args[i + 1] : d; };
const dry = args.includes('--dry');
const [track, program] = args.filter((a, i) => !a.startsWith('--') && (i === 0 || !args[i - 1].startsWith('--')));
const parts = String(opt('parts', '')).split(',').filter(Boolean).map(Number), layers = String(opt('layers', '')).split(',').map((s) => s.trim()).filter(Boolean);
if (!track || !program || !parts.length || parts.length !== layers.length) { console.error('usage: uvi_split_ks.js "<track>" "<program>" --parts 7,8 --layers "A,B" [--src "<track>"] [--dry]  (one layer per part)'); process.exit(2); }
const src = opt('src', track);
const T = path.join(__dirname), STATE = path.join(T, 'uvi_state.js'), EDIT = path.join(T, 'uvi_edit.js');
const run = (file, a) => { const r = cp.spawnSync(process.execPath, [file, ...a], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); } return r.stdout; };
const tmp = (n) => path.join(os.tmpdir(), 'uvi_split_' + process.pid + '_' + n + '.xml');
const srcXml = tmp('src'), dstXml = tmp('dst'), outXml = tmp('out');
run(STATE, ['decode', src, srcXml]); if (src !== track) run(STATE, ['decode', track, dstXml]); else fs.copyFileSync(srcXml, dstXml);
const esc = (s) => s.replace(/&/g, '&amp;');
// 1 · clone the program onto every target part (uvi_edit.js clone takes the program by its display name as stored — & is &amp;)
run(EDIT, ['clone', srcXml, esc(program), dstXml, outXml, parts.join(',')]);
let s = fs.readFileSync(outXml, 'utf8');
// 2 · in each target part: one layer live, the rest bypassed and muted; the program renamed
const partTags = [...s.matchAll(/<Part\b[^>]*>/g)];
const report = [];
for (const i of parts.map((p, k) => k).sort((a, b) => parts[b] - parts[a])) {   // highest part first: the offsets of the parts above an edit stay valid
    const tag = partTags.find((m) => new RegExp(' DisplayName="Part ' + parts[i] + '"').test(m[0]));
    if (!tag) { console.error('part ' + parts[i] + ' not in the instance after the clone'); process.exit(1); }
    const start = tag.index, end = s.indexOf('</Part>', start);
    let body = s.slice(start, end);
    const progTag = /<Program\b[^>]*>/.exec(body); if (!progTag) { console.error('part ' + parts[i] + ' holds no program'); process.exit(1); }
    const want = layers[i].toLowerCase(); let live = null, offs = [];
    body = body.replace(/<Layer\b[^>]*>/g, (lt) => {
        const name = (/ DisplayName="([^"]*)"/.exec(lt) || [])[1] || '';
        if (name.toLowerCase().includes(want) && !live) { live = name; return lt.replace(/ Bypass="\d"/, ' Bypass="0"').replace(/ Mute="\d"/, ' Mute="0"'); }
        offs.push(name); return lt.replace(/ Bypass="\d"/, ' Bypass="1"').replace(/ Mute="\d"/, ' Mute="1"');
    });
    if (!live) { console.error('part ' + parts[i] + ': no layer matches "' + layers[i] + '" — the layers are: ' + offs.join(' · ')); process.exit(1); }
    // THE ORDER (2026-11-10, §143): the layers are left IN THEIR ORDER by default — the stored Bypass/Mute flags select the layer (the flute's
    // jet whistle, first of three, proven by its swell; the sax's three slaps). An early reading that only the LAST layer sounded was the
    // instance still LOADING after the push (a reloaded instance needs seconds before it answers). Moving the live layer to the end
    // (--move-last) is kept as an experiment: on the flute it SILENCED the part (the program's routing may count layers by index).
    if (args.includes('--move-last')) {
        const L0 = body.indexOf('<Layers>'), L1 = body.indexOf('</Layers>', L0);
        if (L0 >= 0 && L1 > L0) {
            let inner = body.slice(L0 + '<Layers>'.length, L1);
            const re = /<Layer\b[^>]*>[\s\S]*?<\/Layer>/g; const blocks = inner.match(re) || [];
            const k = blocks.findIndex((b) => (/ DisplayName="([^"]*)"/.exec(b) || [])[1] === live);
            if (k >= 0 && k !== blocks.length - 1) { const moved = blocks.splice(k, 1)[0]; blocks.push(moved); inner = '\n' + blocks.join('\n') + '\n'; body = body.slice(0, L0 + '<Layers>'.length) + inner + body.slice(L1); }
        }
    }
    const newName = program + ' - ' + live.replace(/^(Flute|Saxophone Alto|Clarinet)\s+/, '').replace(/\s+[A-G]#?-?\d$/, '');
    body = body.replace(/(<Program\b[^>]*? DisplayName=")([^"]*)(")/, '$1' + esc(newName) + '$3');
    s = s.slice(0, start) + body + s.slice(end);
    report.push({ part: parts[i], live, off: offs, name: newName });
}
for (const r of report) console.log('part ' + r.part + ': live "' + r.live + '" · off ' + r.off.map((x) => '"' + x + '"').join(' ') + ' → "' + r.name + '"');
if (dry) { console.log('(dry: nothing pushed)'); process.exit(0); }
fs.writeFileSync(outXml, s);
console.log(run(STATE, ['encode', track, outXml, '--push']).trim().split('\n').slice(-2).join(' | '));
for (const f of [srcXml, dstXml, outXml]) try { fs.unlinkSync(f); } catch (e) {}
const info = JSON.parse(run(STATE, ['info', track]));
for (const r of report) { const p = info.parts[r.part - 1]; console.log('read back: part ' + r.part + ' ch' + (p.midiChannel + 1) + ' "' + (p.program || '').replace(/&amp;/g, '&') + '"'); }
