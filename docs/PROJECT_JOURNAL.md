# PROJECT JOURNAL — switch_2026 (the Switch~ piece)

> One file. Seven sections. Everything important lives here.
> §2 is read at every session start — keep it ~40 lines; trim old sessions to one line each.
> The lab journal (`RUNNING_LOG.md`) is the raw trail underneath; this is the curated state.

---

## §1 Quick-Start

- **The piece:** for the [Switch~ Ensemble] — flute · clarinet · alto sax · piano · percussion · violin · cello, with live
  electronics (D1) · no title yet · the 2026 Switch~ / Overdrive call, due December 1, 2026 (his date, `next.md`); the
  submission ANONYMOUS
- **Lineage:** composition 7 (his numbers, 2026-10-11). Follows 6 *Approaching* `decibel_TENOR_2026`.
- **The profile** (the protocol's 2.1, v1 run by piece 6's deviations register): copy-forward from piece 6 · both layers · the
  animated scrolling score · the engine by subtree · the piano role ON (D2)
- **The stack:** nothing here yet — container 3 copies piece 6's engine @ `9796edd` byte-exact, proves it, turns it to seven parts
  on **5600 / 5100**
- **The live electronics:** the shared engine `live-electronics-system`, seated at `electronics/` by `git subtree add` after
  container 3 (its `docs/TAKE.md`); the engine's commit recorded here when taken
- **Libraries:** one fact each from the record, his to confirm at 4.0 — SI2 (UVI) for the flute, the clarinet, the alto sax ·
  piece 4's piano and violin · piece 6's cello · the percussion from piece 2's catalog cut to the call's list (CLAUDE.md § inherits)
- **Phases:** 0 setup (the protocol) → 1 compose → 2 notate → 3 performance score → 4 submission (his; anonymous)
- **The sketch pad** `docs/COMPOSITION_NOTES.md` opens with the brief for the three electronics pieces (LG-340 … 345, carried from
  piece 5) and the two notes he made for this piece while writing piece 6 (the flute's partials · dense counterpoint and spectral
  chords); this piece's own notes are `SW-N` (D4)
- **Reference repos** (read-only): 6 the source of the port · the home · the engine · the sandbox and `synthesi-alpha` · 5 · 4 · the
  tubas · 2 · 1 — consult per named question only. What the pieces share: `composition-system/INDEX.md`.

### The names (the protocol's 2.3 — fixed 2026-10-20, his "3a")

*They take effect when the code arrives (container 3) and move to `docs/NAMING.md` §1 with it (H6-3). "The AI's" = by the
lineage's pattern (piece 6: `decibel` · `piece-decibel` · `decibel-tenor-2026` · `decibel_rack`), his to reverse.*

| Name | Value | Whose |
|---|---|---|
| the repo and the folder | `switch_2026` — `C:\Users\jwloy\GitHub\switch_2026` · `github.com/elosine/switch_2026`, PUBLIC | his (D3) |
| the working title | none yet | his |
| the session default (the day-one stub score) | `switch` | the AI's |
| the piece chain | `piece-switch` (a save named `piece-…` is the piece); the main notation file `piece-switch.ir.json` | the AI's |
| the package name | `switch-2026` | the AI's |
| the Reaper project guard | `switch_rack` (the rack `reaper/switch_rack.rpp`) | the AI's |
| the two ports | the composer score **5600** · the sandbox **5100** · the throwaway `score-5601` | the lineage's rule |
| the loopMIDI prefix | `SW` — `SWFlute` · `SWClar` · `SWSax` · `SWPiano` · `SWPerc` … the shape, named at 4.1 from the standard set | the AI's |
| the sketch pad's note prefix | `SW-N` (D4); a carried note keeps its `LG-N` · `DEC-N` | the AI's |

### Where the record of the last start lives

- **Piece 6's start** (the protocol's FIRST RUN, 2026-10-04): `decibel_TENOR_2026/docs/RUNNING_LOG.md` §1 … §45 · its PLAN § 0 ·
  its `docs/PROTOCOL_DEVIATIONS.md` (the "for v2" lines this start runs by) · its `tools/port/` (the port's scripts).
- **The harvest handed to this piece:** `decibel_TENOR_2026/docs/HARVEST.md` — 62 items, H6-1 … H6-62; his read 2026-10-20
  *"all as proposed"* (43 take now · 8 later · 9 leave). `#6 §488`.
- **The brief for the electronics:** piece 5's sketch pad LG-340 … 351 (carried in part into this sketch pad); the engine's plan
  `live-electronics-system/docs/PLAN.md`.

---

## §2 Resume Here

**FIRST — HIS STANDING RULE (2026-09-11):** after `/clear` + `/postclear`:
play back, then **STOP and ask**. No edits, no builds, no tool calls beyond the resume
reads. Start only on his word. *(At `/session-start`: orient, agree the agenda, then work.)*

### 2026-11-23 — HIS MIX IS UNDER WAY (PLAN § 2r step 6, RUNNING_LOG §460 · §461)

- **THE LIVE PROJECT IS NOW THE TRUTH, not `build_mix.js`:** his ELEC fader −19.65 dB · a SINES folder (0 dB) with each sine set equal to its player's partial (`tools/sine_match.js`) · Realphones ON in the Monitoring FX. All of it is in the saved project. **`build_mix.js --force` would erase it: never run it here.** Changes go through the bridge (`REAPER_PROJECT=piece-FirstDraft-Final-D-ctptCello-mix`).
- **NOT CHECKED:** the beating not yet listened to. The violin and the cello match least well over a note.

### 2026-11-23 — THE FIRST BALANCE IS IN THE MIX PROJECT (PLAN § 2r step 5, RUNNING_LOG §459) — ► NEXT: STEP 6, HIS EARS

- **DONE:** every stem measured, its fader set; one rising ladder of dynamics; the sine tones kept matched to their players; the level line per section on INSTRUMENTS; the ELEC bus −26.21 dB; the master +7.47 dB (mix peak −1 dB). Read back in Reaper. The card: `docs/DEMO_MIX_CARD.md`. Reaper is open on the mix project.
- **NOT CHECKED:** nobody has listened. The electronics may read as too quiet (players about 20 dB further above them than in the rack); the ELEC bus fader is the one control.
- **THE NEXT CONCRETE STEP:** his listen in Reaper, then his word on what to move. **FROM NOW ON THE PROJECT MAY HOLD HIS FADERS: never run `build_mix.js --force` on it** without his word; a change goes through the bridge.

### 2026-11-23 — THE ELECTRONICS ARE STEMS, IN THE MIX PROJECT (PLAN § 2r step 4, RUNNING_LOG §458) — ► NEXT: STEP 5, THE FIRST BALANCE

- **DONE:** `node tools/elec_stems.js --score piece-FirstDraft-Final-D-ctptCello` — four electronics lanes + six sine stems (one per player's lane), rendered offline through the engine's own code, DRY (before its master bus), on `H:/…/<save>/elec/`; list `midi/<save>/elec_stems.json`. The mix project rebuilt and reloaded: 260 tracks, opened in Reaper on it.
- **NOT CHECKED:** not listened to; not compared against the live engine; the four lanes peak near −1 dB each, so their sum can pass 0 dB until the faders are set.
- **THE NEXT CONCRETE STEP:** step 5, each stem measured and its fader set (PLAN § 2r). `build_mix.js --force` overwrites the project, so never use it once he has mixed in it.

### 2026-11-23 — THE DEMO'S MIX PROJECT IS BUILT (PLAN § 2r step 2, RUNNING_LOG §457) — ► NEXT: STEP 4, THE ELECTRONICS STEMS

- **DONE:** `node tools/build_mix.js --score piece-FirstDraft-Final-D-ctptCello` → `H:/switch_2026/audio/demo/piece-FirstDraft-Final-D-ctptCello/piece-FirstDraft-Final-D-ctptCello-mix.rpp`: 254 tracks, 120 audio stems, each stem's muted MIDI under it, eight instrument buses under INSTRUMENTS, ELEC with four empty lanes. Opened in Reaper and read through the bridge: nothing offline. Reaper is open on this project, not on the rack.
- **NOT CHECKED:** not listened to; the MIDI's alignment against its audio not measured.
- **THE NEXT CONCRETE STEP:** step 4, the four electronics lanes as stems (the material bricks are audio files; the sine tones: ONE question to him if they cannot be recorded without him). The bridge's guard needs `REAPER_PROJECT=piece-FirstDraft-Final-D-ctptCello-mix` while this project is open.

### CHECKPOINT 2026-11-22 (near midnight; mid-session checkpoint, written by `/checkpoint`) — THE DEMO RECORDING: 120 STEMS OF AUDIO ARE ON DISK (RUNNING_LOG §455 · §456) — ► NEXT: THE MIX PROJECT

- **DONE:** PLAN § 2r step 1 (`node tools/stems_plan.js --score piece-FirstDraft-Final-D-ctptCello` — 120 stems of MIDI, a stem = a rack track · a technique · a written dynamic; `midi/<save>/stems.json`) and step 3 (`node tools/render_stems.js --score <save>` — each stem as audio, 19 passes, 12.7 minutes, none silent; `H:/switch_2026/audio/demo/<save>/stems/`, 3.2 GB; `midi/<save>/stems_audio.json` = each file, where it starts, its length).
- **THE NEXT CONCRETE STEP:** the MIX project (step 2 in its final sense) — a NEW Reaper project written as text (`tools/build_rack.js` is the pattern for a .rpp as text): a folder per instrument, a track per stem with its audio item at `at` seconds, the stem's MIDI beside it (muted, for spotting a note); an ELEC folder for step 4; an INSTRUMENTS bus above the instrument folders (step 5's level line sits there); the master. Then step 4 (the four electronics lanes as stems — the material bricks are audio files; the sine tones: ONE question to him if they cannot be recorded without him), then step 5 (measure each stem, the loudest 400 ms of each note, K-weighted; the faders).
- **KNOW BEFORE TOUCHING IT:** a new capture costs 72 minutes — never re-capture for a note fix (edit the stem's MIDI, `render_stems.js --stems N`). Opening the copy of the rack costs 7 minutes and 10 GB; one Reaper tab at a time. `RENDER_SETTINGS` 3 = stems of the selected tracks. A track with `MIDI_INPUT_CHANMAP` gets its stem on that channel.
- **Resume reads:** `docs/PLAN.md` § 2r · RUNNING_LOG §455 · §456 · `midi/piece-FirstDraft-Final-D-ctptCello/stems_audio.json` (its head) · `tools/build_rack.js` (its head, how a .rpp is written as text).
- **MODEL · CLEAR:** a good place to clear. The mix project and step 4 are execution (Opus); step 5's numbers and his mix, Fable.
- **The task is NOT finished:** steps 2 (the mix project) · 4 · 5 · 6 · 7 of PLAN § 2r remain. Nothing is running: no capture, no render; Reaper is on the rack, the render tab closed.
- **Pending with him:** which save is the recording's — `piece-FirstDraft-Final-D-ctptCello` is assumed and the stems are made from it (told to him twice, no objection). The Section 3 page's small open points stand as in the entry below.
- **Deliberately uncommitted (checked 2026-11-22 night, `git status --short`):** HIS, never the AI's to commit — `reaper/switch_rack.rpp` · `reaper/icy_lab.rpp` · `bank/panel_snapshots.json` · `bank/sequences.json` · `scores/*` (his saves and the `.before-N` copies) · `bank/set/2025-04-08c/{slow,stretch,stutter,tremolo,tuplets}/` (the lab's audio) · carried from earlier sessions, untouched here — `.gitignore` · `docs/VERIFICATION_RECIPE.md` · `tools/port/batt-old/` · `tools/port/scratch/*` · `reaper/place_piece-Section03-H-addTuplets_midi.lua` · big and re-makeable — `midi/` (the capture, the stems' MIDI, `stems.json`, `stems_audio.json`) · `notation/audio/` · `notation/video/` · `probes/*` (logs: `stems_plan.log` · `render_stems.log` · `capture_demo.log`). The stems' audio is on `H:`, outside the repo.

### CHECKPOINT 2026-11-22 (late night) — SECTION 3's PAGE REVISED WITH HIM (§434 … §451); ► THE DEMO RECORDING, PLAN § 2r, HIS GO GIVEN — STEP 1 IN HAND

- **THE TASK NOW:** the demo recording (`docs/PLAN.md` § 2r — his briefs SW-165 · SW-166 · SW-167; RUNNING_LOG §452 … §454). Seven steps; his go is given for all of them. THE DESIGN: STEMS — one audio stem per technique per WRITTEN DYNAMIC, a bus per instrument, the four electronics lanes their own stems; parity by the dynamic mark = a fader per stem, set by measurement (K-weighted, the loudest 400 ms of each note, the stem's middle value; the target per dynamic the middle of the stems, 1.5 dB left alone); the players against the electronics = ONE level line on the instruments' bus, a step per section (the section's lowest dynamic 3 dB above the electronics' usual level there); a master fader. The rack is never written (a COPY, `tools/render_reaper.js`' way).
- **WHERE STEP 1 STANDS:** the capture of the whole piece's playback was started — `node tools/capture_composer_midi.js --score piece-FirstDraft-Final-D-ctptCello --out midi/piece-FirstDraft-Final-D-ctptCello.capture.json` (log `probes/capture_demo.log`). If the file is not there, run it again (his score server on 5600 must be up). `tools/stems_plan.js` is NOT WRITTEN yet.
- **THE NEXT CONCRETE STEP:** write `tools/stems_plan.js` — each note-on / off pair of the capture given to its note of the save by `expect.notes` (id · port · ch · pitch · t0 — `tools/export_midi.js` lines 93 … 117 show the matching); the key = port · channel · technique · the written dynamic's name (this piece's bands: `container.json` engraving.layout.dynamicBands; a shaped long note = `shape`); each stem's MIDI = its notes + every non-note message of its port; out `midi/<score>/stems/…mid` + `midi/<score>/stems.json`. THEN step 2 … 3: a render project (a copy of the rack) and the stems rendered through the bridge. A THOUGHT TO CARRY (not decided): techniques that live on DIFFERENT rack tracks (a channel-filtered track each — the percussion's ARO tracks, the piano's four) can be rendered in ONE pass as per-track stems; only stems sharing one sampler track need a pass each — so the passes number the most stems on any one track, not the stems.
- **ONE QUESTION OPEN WITH HIM:** which save is the recording's — `piece-FirstDraft-Final-D-ctptCello` (the AI's copy carrying his cello take and the day's removals; the notation reads it) is assumed.
- **SECTION 3's PAGE (`s3-phase`, `node tools/build_s3_page.js`):** as revised through §451 — the tubas' ticks and ball · tuplets as clusters, the number alone (plain in a beat, the ratio over two), the bracket where there is no beam · rests kept, beams over them · accidentals per group · the vertical order · the tempo row 7.25 · the percussion staff left off the page · the ottava on the standard rule, runs joined per staff, only a crowded single sign treated · the piano's both-staff quarter groups loose. `node tools/collide_list.js s3-phase` = 2 collisions between parts. Open, small: 298.09 (two ottava brackets) · 395.75 · print and the film do not read `omitParts`. HIS SERVER must be restarted once to see the last engine changes. The page is NOT in the draft score's order yet.
- **Resume reads (for the recording):** `docs/PLAN.md` § 2r · `tools/export_midi.js` (whole, 274 lines) · `tools/render_reaper.js` (whole, 208 lines) · `tools/section_parity.js` lines 1 … 40 · RUNNING_LOG §452 … §454.
- **MODEL · CLEAR:** CLEAR NOW — this session ran the whole of Section 3's notation. The recording's steps 1 … 4 are execution of a written plan: Opus. Step 5's numbers and his mix: Fable. `/postclear go` starts at the next concrete step above.
- **Deliberately uncommitted:** as the list under the checkpoint below; plus `midi/` (the capture and the stems, large, local) and `probes/capture_demo.log`.

### 2026-11-22 (night) — THE FINAL SECTION's FIRST BUILD IS UP: the page `s3-phase` (RUNNING_LOG §433) — ► HIS REVIEW

- **Built:** `node tools/build_s3_page.js` → the page "Section 3 - THE PHASE SECTION, first build (254 to 482 s)" in the notation app's picker (under experiments; NOT yet in the draft score's order). Each part: its tempo mark at every new tempo (measured from the beats, one decimal) · a small black tick and the magenta ball on every beat, the tubas' way (his word, §434) · accel. / decel. with a dashed line over every glide (verified in LilyPond; the engine's new sign `tempospan`, `rules.json objects.tempoSpan`) · f, each crescendo a green full-lane curve, the dynamic again after it, fff where it is held. The notes are plain black notes with stems, the notes of one beat on one beam.
- **HIS SERVER on 5600 must be restarted once** (the notation engine's `layout.js` · `render.js` changed), then the page reloaded.
- **Put to him, unanswered:** the tuplets have no number or bracket · the ottava sign on every high note, also inside a beam · the dashed line crosses beams in places · 142 ink collisions the builder lists (42 are neighbouring parts' beams meeting).
- **NEXT:** his review of the page; every change is a line in `tools/build_s3_page.js` or a row of the rules. Then the page into the draft order (`notation/ir/index.json` "draft".order). Still to write: chords 460.4 → 480 · the electronics' ending.
- **Resume reads:** `tools/build_s3_page.js` (its head and THE NUMBERS) · RUNNING_LOG §433.
- **Deliberately uncommitted:** as the list below.

### CHECKPOINT 2026-11-22 (evening) — THE COUNTERPOINT IS NOTATED; NEXT: THE FINAL SECTION's NOTATION (RUNNING_LOG §388 … §432)

- **WHERE WE ARE:** Section 2's counterpoint (200 … 253 s) is notated in all eight staves and is the third page of the draft score (`s2-ctpt-heads`, "Section 2 - THE COUNTERPOINT, draft"). Built by `node tools/build_ctpt_page.js` — the flute by his hand, every other part BY RULE, his exceptions in its HANDS table with his words. The copy the notation reads: **`scores/piece-FirstDraft-Final-D-ctptCello`** (his own saves untouched: `…-FirstDraft-Final`, `…-C-cello` with his cello take).
- **THE RULES MADE TODAY** are rows and gates (`docs/NOTATION_SCHEME.md` § 2b and its 2026-11-22 table; `node tools/check_rules.js`, 41 checks, part (10) MEASURES the pages; `tools/no_rule_list.js` · `tools/fit_list.js` print at every build). The two reds of check_rules are old (no sequence page; the solo's heads past the ottava threshold by design).
- **THE RACK:** the clarinet's slap sounds from "Bass Clarinet XS" (an octave-fold effect before its Kontakt), its triple tongue from "Clarinet XS" — both on SWFluteb channels 12 · 11. A MIDI blockage is cured by `node tools/reaper_job.js run reaper/bridge/jobs/midi_reinit.lua` (never a restart). The electronics engine was DOWN at the last check (`start_electronics.bat`, his).
- **OPEN WITH HIM:** the string numeral's place ("pizz. b.b. II" on one line — 2 violin columns do not fit) · the violin's 223.35 (its stem runs into the cello's lane) · the percussion's double at 252.67 · three cross-part touches the builder prints (213.94 · 220.32) · the AI's: the levels of the new voices (NITS).
- **THE NEXT STEP — THE FINAL SECTION (Section 3, 277.8 … 480 s), his brief SW-163:** the tubas' multi-tempo notation — each part's tempo mark, the beat ticks, the tempo-change marks, a bouncing ball in each part — plus accel. / decel. (the word, a dashed line, the new tempo; VERIFY in LilyPond / Gould first); f throughout, each crescendo a curve (the green, the full lane), f marked again after it. A FIRST BUILD for him to review. The ground: RUNNING_LOG §432 (seven parts, about 650 short notes each; the crescendos are ramps of velocity 110 … 127, no crescendo object; the tempo form is `bank/phase_form.json`; the engine has tempoText · tick · beatBall and `--beatGrid` · `--cueLines`, but no changing tempo).
- **Resume reads (for THAT step):** `docs/NOTATION_SCHEME.md` · `docs/PHASE_TOOL.md` · `bank/phase_form.json` · the tubas' multi-tempo rows in `docs/NOTATION_STANDARDS.md` (grep "tempo" · "beat frame" · "ball") · `tools/notate_section.js` lines 8 … 110 (its options) · RUNNING_LOG §432.
- **MODEL · CLEAR:** clear before the final section (this session ran the whole counterpoint). Fable for the first build's design and its rules; `/postclear go` starts it.
- **(mid-session checkpoint, written by `/checkpoint` 2026-11-22)** — the task is NOT finished: the final section's notation has not begun. **The first action after the clear:** read the Resume reads above, verify the accel. / decel. convention, then write `tools/build_s3_page.js` (the tempo form → each part's tempo marks, ticks and balls; the velocity ramps → crescendo curves) and show him a first page.
- **DELIBERATELY UNCOMMITTED (`git status`, 2026-11-22) — leave every one alone:**
  - `scores/` (82 files, untracked) — HIS saves and the AI's working copies and backups (`…-D-ctptCello` and its `.before-NNN` copies among them); saves are never committed.
  - `reaper/switch_rack.rpp` · `reaper/icy_lab.rpp` (modified) — HIS racks, saved by him; never committed.
  - `bank/panel_snapshots.json` · `bank/sequences.json` (modified) — his page's own state.
  - `.gitignore` · `docs/VERIFICATION_RECIPE.md` (modified) — standing uncommitted edits from before this session; not this session's.
  - `bank/set/2025-04-08c/{slow,stretch,stutter,tremolo,tuplets}/` · `midi/` · `notation/audio/` · `notation/video/` — sound and film material, large, local.
  - `probes/` (loose logs and the folders artic_probe · ctpt · key_sweep · part_meter · rack_alive · solo_in_score) — probe outputs; `probes/quartet_signs/sheet.png` alone is committed.
  - `reaper/place_piece-Section03-H-addTuplets_midi.lua` · `tools/port/batt-old/` · `tools/port/scratch/{bisect.js, measure_flags.js, probe/, remap_new.json, shot.js, still298.js, strike_film.js}` — scratch from earlier sessions.

### CHECKPOINT 2026-11-21 — THE PIANO SOLO DONE AS A FINAL DRAFT (148.2 → 196.3 s); THE COUNTERPOINT OPENED AS NOTE HEADS *(mid-session checkpoint)*

**READ `CLAUDE.md` § THE ENGRAVING RULES and `docs/NOTATION_SCHEME.md` § 2 · § 2b · § 3 before any notation work.**

- **What happened (RUNNING_LOG §325 … §360; his words SW-105 … SW-119):** the working version was carried from 170.9 s to the end of the piano solo, 196.26 s, and then DRESSED: the notated chords that are clusters drawn as clusters (a rule), a marcato on every single struck chord and arpeggio (a rule — always above), an ff at the start, a hairpin, a slur into a pebble drop (a try), stray notes hidden. The ribbon gained its settings one by one at his word: the width designed over its length · a wave's depth and steepness · `tops` · "hit harder" (`hit` · `hits`) · a gentler fall (`falls`) · a width gain. The pebble drops took a first pass from his playing (number and where the heap lies).
- **THE SAVES:** `bank/piano_solo_done.json` = the solo's final draft, frozen (tag `piano-solo-final-draft-2026-11-21`; the bookmark before the pebble pass is tag `piano-solo-work-2026-11-21`). `bank/piano_solo_work.json` stays the live record the workshop reads, should he touch the solo again. His composer saves were not touched.
- **THE SOLO ENDS AT 196.3 s, not 251.7.** From 200 s the other players enter: the counterpoint, 200 → 253 s. (The solo's pages were built over 146 → 253 and so carry the counterpoint's 47 piano notes as loose heads at their end.)
- **THE NEXT CONCRETE STEP:** the counterpoint's RHYTHM, with him, on the page `s2-ctpt-heads` in the notation app (`http://localhost:5600/notation/app/notation.html`, his server; the picker's last entry) — every note a head at its played time. He means to work "directly in the notation score" from here.
- **THE SOLO IS IN THE REAL SCORE (§361 · §362, his go):** the notation app's page `s2-piano-solo-final` — "Section 2 - THE PIANO SOLO, final draft". `node tools/solo_to_score.js` writes the page (the standard figures; the replaced notes left out; at pitch, no 8va); the signs AND their motion (the ball, the pebbles) are drawn live by the workshop's own code, asked of the score server per window (`/api/notation/furniture`), in the VIDEO and ZOOM views. NOT YET: the plain window view, print, and the exported video (`tools/export_video.js`). **His server on 5600 must be restarted once** to have the route. Run `solo_to_score.js` again after a change that hides or shows notes or changes a figure.
- **THE DRAFT SCORE (§368):** the score so far = three pages played as one by the notation app, in `notation/ir/index.json` "draft".order — Section 1's sines → the piano solo's final draft → the counterpoint's note heads (marked "DRAFT n of 3" in the picker). EACH SECTION ITS OWN PACE (§366; the solo 4.8 s a page, the rest 12).
- **THE ELECTRONICS IN THE NOTATION SCORE (§363 · §364):** the notation app fires the save's sine and material bricks itself as it plays (the box "electronics" in its top bar), by the engine's own page code — the engine must be up (`start_electronics.bat`, after Reaper with the rack). The sound is on Reaper's ELEC RETURN; its fader is the volume. Proven by the messages, not yet heard by the AI.
- **Open, smaller:** where an ff and a hairpin stand on a grand staff (between the staves now, no rule) · the slur into a pebble drop (a sketch, no rule) · the hit at 161.9 (a try; the earlier ribbon is kept in the gesture's `_revert`) · the hidden notes (fourteen, listed in the work file's `omit`).
- **Not seen by the AI:** anything moving — the pebbles, the ball, the page turn. Stills and the served numbers only.
- **Resume reads:** `docs/NOTATION_SCHEME.md` § 2b · this checkpoint — nothing else.
- **Deliberately uncommitted:** as before (his saves, the racks, `bank/panel_snapshots.json` · `sequences.json`, `.gitignore`, `docs/VERIFICATION_RECIPE.md`, working output, `tools/port/scratch/*`).
- **Model:** Fable for the rhythm's decisions with him; a clear before the counterpoint is a good moment — this session is long.

### CHECKPOINT 2026-11-20 (night) — THE PIANO SOLO IN FOUR KINDS OF NOTATION; THE WORKING VERSION TO 170.9 s *(session wrap)*

**READ `CLAUDE.md` § THE ENGRAVING RULES and `docs/NOTATION_SCHEME.md` § 2 · § 3 before any notation work.**

- **What happened (RUNNING_LOG §262 … §322; his words SW-83 … SW-102):** the piano solo is no longer taken note by note. It is written in KINDS that alternate, each named by him: STANDARD notation for the fixed structures ("poles", "the arpeggiated strike" — figures in `notation/hand/s2-piano-solo.units.json`, 14 so far) · SHAPE ACTION NOTATION, the RIBBON (the GC arc as a band whose width is the hand's activity; one bounce or several; a tail) · the PEBBLE DROP / scattered strike (a curtain with a handful of pebbles thrown and landing together — synthesi-alpha's substrates, ballistic) · the REPEAT / stutter (the keys boxed, then running shake marks — catalog signs 29 · 30 and their opposites, `http://localhost:5650/pages/stutter`). A CHORD SYMBOL (each hand's pitch set, a cluster bar) stands at the start of every gesture. Constellation notation (SW-85) is named, not begun.
- **THE WORKING VERSION is the one place the piece is now written:** the workshop's page "working version" (`http://localhost:5650/`), built from `bank/piano_solo_work.json` (the gestures, in his words, each with the note of how his clicked times were set on the partials) + the units file. Worked from 148.2 to 170.93 s. On it: no 8va (a trial), only the piano, room above.
- **How he works there (his way since §307):** he names times "thereabouts" and a kind; the AI sets them on the partials actually played, writes the line, restarts the workshop server itself (it runs the server on 5650 at his word, §278 — launch name `notation-workshop`), renders the page to an image as its one check, and sends the picture.
- **THE NEXT CONCRETE STEP:** start the workshop server (`notation-workshop`), then go on from 170.93 s at his word, gesture by gesture. The first notes not yet placed: after 170.93 (and two small left-hand groups at 160.19 … 160.30 he has not placed).
- **His notes to come back to:** refine the pebble drops' densities for variety (SW-102) · a way to ASSIGN ribbons to sections and to get a first shape he then tweaks, with the least time a texture needs (SW-92) · the wave curve joining GC arcs (held, SW-83).
- **Open, put to him and unanswered:** whether an impact stands on a cluster's weighted middle (the AI's choice, §314) or its last note (where he clicks) · whether "no 8va" becomes the rule for the score · the page turn of the workshop (mended §312, NOT seen working by the AI — its browser pane's clock does not run) · none of the pebbles, tails or the hill were seen MOVING by the AI, only stills.
- **Not built:** the kinds live only in the workshop (`tools/notation_workshop.js` · `gravity_furniture.js` · `chord_changes.js` · `substrate.js`); nothing of them is in `layout.js`, `rules.json` or the real score, and the workshop's "Make video" carries ribbons but not pebbles (a side script does: `tools/port/scratch/strike_film.js`).
- **Resume reads:** `docs/NOTATION_SCHEME.md` § 3 · `bank/piano_solo_work.json` · RUNNING_LOG §307 … §322 only if a question about a gesture's making arises — nothing else beyond §2.
- **Deliberately uncommitted:** as the checkpoint below lists (his saves, the racks, `bank/panel_snapshots.json` · `sequences.json`, `.gitignore`, `docs/VERIFICATION_RECIPE.md`, working output); plus `tools/port/scratch/*` (the AI's scratch scripts) and `notation/video/clips/` (gitignored films).
- **Model:** Fable — every step is his ear and a judgment of notation.

### CHECKPOINT 2026-11-20 — THE NOTATION PHASE: SECTION 1 DONE AS A WORKING PAGE; THE PIANO SOLO, FIGURE BY FIGURE *(mid-session checkpoint)*

**READ `CLAUDE.md` § "Standing practice: THE ENGRAVING RULES" BEFORE ANY NOTATION WORK** — find the standard, apply the standard, and where there
is none, discuss; never show him something made up. It cost this session several rounds (RUNNING_LOG §255 … §258).

- **Where the piece stands:** the music is a first draft, whole (`scores/piece-FirstDraft-Final`; the copy `piece-FirstDraft-Final-B-noFadeAt96`
  takes out the fade at 96.6 s and is what the notation pages are built from — his saves, never committed). The harmony, tuning and dynamics passes
  of Section 3 are done (RUNNING_LOG up to §239; `docs/TUPLET_WORKSHOP.md`). The NOTATION PHASE is open (SW-71), section by section.
- **Section 1 (the sine tones), the working page `s1-sines`** (12 → 146 s, all parts): the beating gliss — one sheet, players and crotales, in
  `docs/NOTATION_SCHEME.md` § 1. Built by `node tools/notate_section.js --score piece-FirstDraft-Final-B-noFadeAt96 --w0 12 --w1 146 --parts 0,1,2,3,4,5,6,7,8 --glissGestures all --id s1-sines --label "…" --exp`.
- **Section 2 (the piano solo, 148.2 → 251.7 s), the working page `s2-piano-solo`:** black heads in two hands, both staves treble; he takes the
  figures ONE BY ONE and each goes into `notation/hand/s2-piano-solo.units.json` (six so far: 148.20 · 148.61 beamed · 149.09 · 149.98 · 151.04 ·
  the grace figure at 151.41). Rebuilt by `node tools/notate_section.js --score piece-FirstDraft-Final-B-noFadeAt96 --w0 146 --w1 253 --parts 5 --alone 146-253 --pianoHands 5 --id s2-piano-solo --label "Section 2 - the piano solo, note heads in two hands (a working page)" --exp --noFitMark`. **The played-spacing copy (§264), rebuilt after each figure taken:** the same command with `--id s2-piano-solo-played --unitsFrom s2-piano-solo --timeSpacing` and the label "Section 2 - the piano solo, PLAYED spacing (the time-accurate copy)".
  The rules every figure is built from: the table in `docs/NOTATION_SCHEME.md` § 2.
- **☑ BUILT AFTER THE CLEAR, 2026-11-20 (§262): the grace stroke's corner rule (`objects.graceSlash.cutSs` 1 · `jutSs` 0.4) and the grace group's equal spacing (`objects.handUnit.graceGroupSpacing`), measured on figure 6. Then §263: THE SCATTERED GRACE (sg, his name) — figure 7 (151.635 → 151.884 s) built by `objects.handUnit.scatteredGrace`, the wavy stroke on the corner rule. ► NEXT: his eye on figures 6 and 7, then §264 (the sg's three small waves · `--noFitMark` · the played-spacing copy) and §265 (figure 8, 152.123 → 152.226 s, a full-size beamed group spread to the right). ► NEXT: the next figure at his word (the first note after 152.226 s — 152.537).** The two lines below are the record of what was asked.
- **ALSO FIRST, WITH THE STROKE (his rule, given after the checkpoint — §261):** BUILD THE GRACE GROUP'S SPACING — equal distances, the stems clear of the neighbors' heads and ledger lines, pushed out on both sides where there is room; his words and the read-back at the end of `docs/NOTATION_SCHEME.md`. It is a rule already: build it, measure it, show it — no new discussion unless a figure has room on one side only.
- **THE NEXT CONCRETE STEP (his word at this checkpoint):** settle THE GRACE STROKE'S PLACE — read `docs/NOTATION_SCHEME.md` § 2 "OPEN" (his brief
  verbatim and the AI's two-number recommendation: one anchor at the stem–beam corner, 45 degrees, `cutSs` and `jutSs`), put it to him in a few
  lines, and at his go build it as two rows of `objects.graceSlash` used by the hand unit's stroke (`layout.js`, "THE STROKE ON A BEAMED GRACE GROUP"
  inside the hand unit's post-pass), rebuild `s2-piano-solo`, look once, show him. Then go on through the piano solo figure by figure, at his word.
- **Decisions pending him** (the OPEN table, `docs/NOTATION_SCHEME.md` § 2): the grace stroke (the grace group's spacing is HIS RULE since §261, to build; the cluster's third column and the stemmed chord's 0.25 are HIS RULES since §260, built). Also, older: how the electronics lane shows
  its waveform · the tuplet notation and the dynamics notation of Section 3 · chords 460.4 → 480 and the electronics' ending at 480 · six
  unregistered techniques (alto sax double_tonguing · slap_exploding · slap_pitched; percussion brake_drums_rubber_mallets · gran_cassa_medium_felt ·
  gran_cassa_rute_on_rim).
- **Held, his idea (SW-79):** the audio by STEMS — one file per part, the sine tones their own, mixed by him in Reaper. The notation page plays MIDI
  only; the sine tones do not sound there. Not built.
- **How he looks at a page:** `http://localhost:5600/notation/app/notation.html`, the picker, after a reload. The AI looks on the throwaway
  `score-5601` only, once per build, and stops it.
- **Resume reads:** `CLAUDE.md` § THE ENGRAVING RULES · `docs/NOTATION_SCHEME.md` (whole — it is short) · `notation/hand/s2-piano-solo.units.json` — nothing else beyond §2.
- **Deliberately uncommitted** (`git status --short`): `scores/` (his saves and the AI's copies — never committed) · `bank/panel_snapshots.json` ·
  `bank/sequences.json` · `reaper/switch_rack.rpp` · `reaper/icy_lab.rpp` (his, never without his word) · `.gitignore` · `docs/VERIFICATION_RECIPE.md`
  (modified before this session; left as found) · `bank/set/…` · `midi/` · `notation/audio/` · `probes/…` · `reaper/place_…_midi.lua` (working
  output, not the record).
- **Model:** Fable for the grace stroke's discussion and the figures (judgment on notation); the rebuilds are mechanical.

### CHECKPOINT 2026-11-12 (late) — THE PHASE WORKSHOP AND THE PHASE FORM OF SECTION 3, IN HIS SAVE *(mid-session checkpoint)*

- **The task and its state (RUNNING_LOG §167 … §214; his words SW-43 · SW-44):** the PHASE panel of SW-42 was set aside at his word
  ("too complicated"); THE PHASE WORKSHOP was built instead, a bare page of its own — `workshop/phase/index.html` served by
  `node tools/phase_workshop.js` on **5630** (he runs it by its full path; the fund served at `/fund/` for the beds) — one step at a time, each
  his: the drift on a Golomb ruler (0 1 4 10 18 23 25, every pair its own rate), LOCK · DRIFT · CAPTURE; twenty multi-tempo destinations
  (grids of 80 · 60 · 50 · 40 · 30 ms); the glides that land ON THE BEAT (the sine bulge, his "cheat" made exact, §185 · §214); the chain of
  his marks read from the beds' walls and bursts (§189 · §193 · §196 · §201 · §205); Drift 2 and Drift 3 on two more rulers; THE WHOLE FORM
  277.8 → 480 played as one with the beds, drawn at once, startable from any score time. **The form is data** (`bank/phase_form.json`) and
  `tools/phase_form_render.js` **wrote it into his save `piece-Section03-H-addTuplets`** (§214): 2050 struck D5s on the seven lanes, the
  unisons on their marks (277.8 · 341.08 · 400.3), ONE strike at 480, 17 Φ markers. Also this session: the D5 at 275 confirmed (§167), the tap
  tempo on the composer score (TAP · key K, §181), SWEEP rows 4 · 5 fixed (the hidden PHASE button; a brick's typed start moves it whole).
- **The latest deliverable:** his save `piece-Section03-H-addTuplets` with the form in it (uncommitted, his) · `bank/phase_form.json` ·
  `bank/phase_sequence.json` (the form in prose and marks) · the workshop page.
- **► THE NEXT CONCRETE STEP — his, in his order (SW-44), after he opens `piece-Section03-H-addTuplets` (File ▾ → Open) and hears it:**
  **(1) the beds' ending** — in the composer score, the four granular bricks (G5 · G9 on Elec 1 · 2 from 269, G8 Elec 3 from 296.25, B2 Elec 4
  from 300.78; they end 464 … 477 today) reshaped so everything swells and ends together at 480 — he finds clips; the AI's part is whatever he
  asks (the brick tools: the right edge, the level hairpin, `petals_segment.py`-style re-makes are in reach). **(2) the tuplet pass** — a
  CONVERSATION FIRST by the planning method: the speeds (8ths · triplets · 16ths · quintuplets …), the share of a player's hits that become
  tuplets growing through a stretch ("3 single strikes and a tuplet, then the singles diminish"); then a tool over the `phase-form` group
  (every note carries `properties.phaseForm.player · hit`). **(3) the harmony pass** — the D5s dealt around the beds' main pitches (§167 · §193,
  the roots of proposal § 10), JI or not, by experiment. Nothing of 1 … 3 is built.
- **Resume reads:** `docs/COMPOSITION_NOTES.md` SW-44 (his plan, verbatim) · `bank/phase_form.json` (the form) — nothing else beyond §2;
  the workshop's own notes are RUNNING_LOG §169 … §214 when a question about it arises.
- **Decisions pending him:** which bed clips, and how the swell is made (step 1) · the tuplet strategy (step 2) · the harmony (step 3) · still
  from before: the root map § 10 (every root is a chip already) · the cello pairs and the hills' pitches · the 8 s hold on swarm 2 was his 6.
- **Deliberately uncommitted (`git status --short`, 2026-11-12 late):** `scores/*.json` (61, among them `piece-Section03-H-addTuplets` with
  the form, and G · F · E · D before it) — HIS saves, never committed without his word · `reaper/switch_rack.rpp` · `reaper/icy_lab.rpp` — his ·
  `bank/panel_snapshots.json` · `bank/sequences.json` — his takes and rows, autosaved by the page · `.gitignore` · `docs/VERIFICATION_RECIPE.md`
  — as recorded 2026-10-23 · `bank/set/2025-04-08c/*` · `probes/*` · `tools/port/batt-old/ · scratch/` — as before. The workshop repo's two
  files (`corpus/petals_bed.scd` · `petals_segment.py`) still uncommitted there (auto mode refuses; his hand or another mode).
- **Model to resume on:** Fable — step 1 is his hands with the AI answering; step 2 opens with a design conversation (judgment).
- **Servers at the checkpoint:** his score server 5600 and his workshop server 5630 were up; the AI's previews all stopped.

### CHECKPOINT 2026-11-12 — SECTION 3: THE PETALS RING, THE HILLS, THE ROOTS, THE PHASE MACHINE *(mid-session checkpoint)*

- **2026-11-12 (later) — THE PHASE WORKSHOP, STARTED OVER (SW-43, RUNNING_LOG §167 … §170):** the PHASE panel of SW-42 set aside (found hidden — SWEEP row 4, fixed; his verdict: too much). A page of its own — `workshop/phase/index.html`, `node tools/phase_workshop.js` → `http://localhost:5630/` — D5 staccato on seven players in unison at 60, the symmetric uneven fan at 0.26 % (Reich’s tapes, §169), LOCK · DRIFT · CAPTURE (`bank/phase_locks.json`). The fan a Golomb ruler at 0.05 % (§172 · §173). THE DESTINATIONS (§174 · §175): six fixed multi-tempo sets A … F on the same page, grid 80 ms, no dials. Proven on the preview without MIDI; **► HIS EAR in his Chrome (the drift, then the six sets as units; then the transitions between sets) (loopMIDI · Reaper with the rack · the server by its full path); what he learns is step two.** The D5 at 275 s confirmed (§167). The root map (§166) still awaits his word; every root of it is already a chip.

- **The task and its state (2026-11-10 … 12, RUNNING_LOG §157 … §166):** Section 3 is being composed in his saves (`piece-Section03-…`,
  the latest `piece-Section03-C-Harmonies`: four petals layered on Elec 1 · 3 · 4, 269 … 531 s). Built for it: (a) the ringing petals —
  every brick he names made again from its bed so the resonators die after the bed stops (`live-electronics-engine/corpus/petals_segment.py`;
  nine `…-ring` materials in the fund, 66 in all; §157 · §160 · §166); (b) the cello HILLS from the petal's envelope (`tools/cello_hills.js`,
  shaped notes by the law) and the two-string pairs workshop (`tools/cello_pairs_workshop.js`; §161), and the hills as a GRAPHIC score four lanes
  tall with a catalog of eighteen shapes (`tools/hills_graphic.js`; §162); (c) the just-intonation roots: the petals analyzed, proposal A taken
  (`docs/proposals/SECTION3_JI_FUNDAMENTALS.md`), the roots as chips in the strikes drawer's HARMONIC SERIES banner (`bank/ji_roots.json`), the
  empty seven-box sequence `S3 petal roots A` in the sequence library (§163 · §164); then the SECOND READING on the layered save — the roots
  together: G♯1 (269) → B♭1 (312) → G♯1 (389) → E♭2 (409) → G♯1 (440 … 531), containers 269 · 312 · 364 · 389 · 409 · 440 · 489 · 531 (§166,
  proposal § 10) — **his word on this map is pending**; (d) **THE PHASE MACHINE** (SW-42, PLAN 1f, `docs/PHASE_TOOL.md`, §165): the PHASE button
  beside MT — a take re-articulated by every player as a pulse stream, a plan of hold · shift · cut, strategies with a seed, LOCK and CAPTURE
  while playing, favorites in `bank/phase_states.json` (a sixth store — HIS SERVER RESTARTED ONCE), Insert at playhead. Proven on the throwaway;
  the sound not yet under his hands. Standing since 2026-11-10: §159 — NO VOLUME TASK OR QUESTION REACHES HIM; the violin's fader stays +2.70.
- **The latest deliverable:** the four ringing petals of `piece-Section03-C-Harmonies` in the drawer (`petals-C3-…-seg2-ring` · `petals-B-…-
  seg1-ring` · `petals-A-…-seg1-ring` · `petals-D4-…-seg1-ring`) and the root map (proposal § 10).
- **► THE NEXT CONCRETE STEP:** wait for his word on the second root map (G♯ · B♭ · G♯ · E♭ · G♯ with its eight timings). On "yes" (or his
  changes): rewrite the sequence `S3 petal roots A` in `bank/sequences.json` as EIGHT empty boxes with those durations (43 · 52 · 25 · 20 · 31 ·
  49 · 42 s, from 269; the same node one-liner as §164's, the comment carrying the roots per box) and tell him the chart. He orchestrates each
  root from the chips and drops the takes into the boxes. Meanwhile his hands are on the phase machine: faults go to `docs/SWEEP_LIST.md`.
- **Resume reads:** `docs/proposals/SECTION3_JI_FUNDAMENTALS.md` § 10 (the map and its timings) · `docs/PHASE_TOOL.md` (if he reports on the
  phase machine) — nothing else beyond §2.
- **Decisions pending him:** the second root map (above) · the phase machine's first use (what he learns is the next part, PLAN 1f) · the
  cello pairs workshop (which intervals) · the hills' pitches (D3 + A3 are placeholders).
- **Deliberately uncommitted (`git status --short`, 2026-11-12):** `reaper/switch_rack.rpp` · `reaper/icy_lab.rpp` — HIS, saved by him ·
  `bank/panel_snapshots.json` · `bank/sequences.json` — his takes and his sequence row, autosaved by the page (the AI's row `S3 petal roots A`
  was committed at edad2fa; what changed since is his) · `.gitignore` · `docs/VERIFICATION_RECIPE.md` — as recorded 2026-10-23 · `scores/*.json`
  (59) — his saves and the AI's derived saves (`…-hills-01` · `…-pairs-01` · `…-hills-graphic-01`), never committed without his word ·
  `bank/set/2025-04-08c/*` · `probes/*` · `tools/port/batt-old/ · scratch/` — as before. **In the workshop repo `live-electronics-engine`:**
  `corpus/petals_bed.scd` (modified: a seed and a tail argument) and `corpus/petals_segment.py` (new) are UNCOMMITTED — auto mode refused the
  commit there twice ("Modify Shared Resources"); he commits them himself or switches mode: `git add corpus/petals_bed.scd corpus/petals_segment.py`.
- **Model to resume on:** Fable — his verdict on the map and the phase machine's first faults are judgment; the sequence rewrite is one line.

### CHECKPOINT 2026-11-10 — THE COUNTERPOINT DEALT AND LEVELED; THE FORM STATED (SW-36) *(mid-session checkpoint)*

- **The task and its state:** Section 2's counterpoint (200 … 253 s) is in HIS saves — `piece-Section02-B-ctpt-draft01d` is the latest: his
  articulations dealt per note (`artic_deal.js --scatter`, seed 23), the dynamics p · mf · fff dealt per lane (`dyn_deal.js`), the levels on
  PARITY BY LOUDNESS (`section_card.js` → the recorded card `bank/section_levels/piece-Section02-D-scatter-01.card.json` → `section_parity.js`:
  every written dynamic at one loudness across the parts; RUNNING_LOG §152), the recurring pitches thinned from their takes' harmonies
  (`thin_pitch.js`: the piano's G#s, the clarinet's F6, the flute's F5; §153 … §155), four two-hand mutes next to a pluck made plain. The rack
  shored up (§143 · §144) and saved through the bridge; the rack's hand-set values in RACK_SETTINGS § 0.
- **His last word:** SW-36 (`COMPOSITION_NOTES.md`) — the form: petals passages alternating with the granular; the granular a trio of
  electronics · percussion · piano (palm strikes on the strings, pedal down · bass drum rolls · maybe tambourines or crotale clusters —
  "I have to give it some thought").
- **► THE NEXT CONCRETE STEP:** his ear on `piece-Section02-B-ctpt-draft01d` (File ▾ → Open), then whatever he names — most likely the FORM
  (SW-36): a conversation first (the planning method, one topic at a time), nothing built before his word. The palm-strike piano voice
  does not exist in the rack (§156) — when he reaches it, one question.
- **Resume reads:** `docs/COMPOSITION_NOTES.md` SW-36 · `docs/PLAN.md` § 1c step 4 (his hand steps) — nothing else beyond §2.
- **Decisions pending him:** (a) the violin's track sits +6 dB from the card (parity's one global move, §152) — keep or undo after this
  section — DECIDED 2026-11-10 (§158): the fader STAYS at +2.70 dB for the piece, no separate track; each section leveled by parity;
  **§159 HIS RULE: NO VOLUME TASK OR QUESTION REACHES HIM — the AI sorts levels alone; real-but-not-blocking items to NITS;** (b) ☑ DONE 2026-11-10 20:30 … 20:33 — the curve copies (+8.2 dB), the plucked
  piano and the snare, the rack saved; NOT to be asked again; (c) the plucked piano sits 4 dB under the standard at its top.
- **Deliberately uncommitted (git status):** `reaper/switch_rack.rpp` — HIS rack, saved through the bridge, committed only at his word ·
  `.gitignore` · `bank/materials.json` · `bank/panel_snapshots.json` · `docs/VERIFICATION_RECIPE.md` · `reaper/icy_lab.rpp` — modified before
  this session's work, left for their own wrap · `scores/*.json` (48) — his saves, never committed without his word · `bank/set/2025-04-08c/*` —
  his audio set folders · `probes/*.log · *.json · artic_probe/ · part_meter/ · rack_alive/<stamps>` — the session's measurement records
  (the kept ones are committed: `probes/rack_alive/latest.md`, `probes/key_sweep/*.json`, `probes/section_card.json`) · `tools/port/batt-old/ ·
  scratch/` — the port's leftovers.
- **Model to resume on:** Fable — the next step is his ear and the form's design (judgment), not execution.

### CHECKPOINT 2026-11-09 — THE LAB'S LONG SESSION CLOSED; HE STARTS IN THE COMPOSER SCORE *(mid-session checkpoint)*

- **The task and its state:** PLAN 1a.7 THE ELECTRONIC SCORE — steps 1 … 5 BUILT and proven offline and on the throwaway (RUNNING_LOG §103);
  NOT yet under his hands with the engine up. The fund: 57 materials in `bank/materials.json` (mixes · opening · granular · petals · the ten
  kept tuplet sequences); seven candidate mixes of three and four, each part wandering round a 360° dial (§104), on the materials page
  `http://localhost:5620/files/keep/index.html` — his verdict on them is open.
- **His word for after the clear:** *"post clear I want to get started in the composer score."*
- **► THE NEXT CONCRETE STEP — his first pass, the AI walking him through `docs/STARTUP.md`'s composing order, ONE step at a time:**
  (1) loopMIDI (HE, first). (2) Reaper with `reaper\switch_rack.rpp` (the AI may open it). (3) `start_electronics.bat` (HE double-clicks; the
  window ends `LE_READY`; the engine is new since his last run — `material.scd` and the fund's index load here). (4) `start_score_server.bat`
  (HE). (5) `http://localhost:5600/composer.html` in his Chrome. `node tools/startup_check.js` names any missing step. Then: on a lane, `N` at the
  playhead places a material brick; the panel picks the material; play — the engine window shows `LE_INFO material · …`; the sound on ELEC RETURN.
  Faults → `docs/SWEEP_LIST.md`, fixed there (D13: he tests while composing). SHIFT+N splits; the left edge trims with the offset following.
- **`Resume reads:`** `docs/STARTUP.md` · `docs/PLAN.md` 1a.7 · `electronics/score/le_material.js` (its head comment only).
- **Pending him:** the seven mixes A … G (keep? which?) · the wandering's pace (one number) · step 6 the bounce, when he reaches it · the petals
  variations E … J set aside in `petals/_old/` (not deleted).
- **Deliberately uncommitted (`git status --short`, 2026-11-09):** `.gitignore` · `docs/VERIFICATION_RECIPE.md` · `reaper/switch_rack.rpp` — as
  recorded 2026-10-23 below (his files, his word) · `reaper/icy_lab.rpp` — HIS lab project, saved by him · `probes/clip_watch*.json/.txt` ·
  `probes/rec_modes_before.json` · `tools/port/batt-old/` · `tools/port/scratch/` — scratch, left · `bank/set/2025-04-08c/{slow,stretch,stutter,
  tremolo,tuplets}/` — the lab's page folders from before the audio moved to H: (small; their audio is on H:), left untracked.
- **MODEL · CLEAR:** his first pass and what he hears — **Fable** (judgment on faults and on the music); a fault's fix that is mechanical — Opus.
  Clear now; `/postclear` resumes at the step above.

- **2026-11-09 (evening) — THE SAX'S BEATING TESTS (RUNNING_LOG §114 … §122; SW-9 … SW-18; D12):** the sax's long tone on F4 with a constant sine
  (the bed measured E♭ — his ear says F4, §114 · §116); Approaching's beat rules carried (`bank/beat_shapes.json`), the roller extended
  (`beat_pair.js --line`), **`tools/beat_saw.js`** — a sawtooth of pairs under one sine, the breaths by **`bank/breath_rules.json`** (D12); the
  sine's fade from silence made right in the engine (§121, the engine's §78); the material bricks' trim together (SHIFT+click). **HIS WORKING SAVE since 18:39: `piece-Section01b-BeatingUnisonCrescendos-B`** (the D test save renamed by him; D and the earlier B · C · A are history). **► HIS EAR on the four pairs** — the sine's mark the lever; then the method's
  steps 2 … 4 (the gliss speed · one drawn crescendo for both · the electronics under them, quickly) and the other lanes by SW-15's algorithm.
  **MODEL:** his listening and the talk — Fable; the roll of the other lanes once the numbers are his — Opus.
- **2026-11-10 — HIS TASK DONE THE SECOND WAY, BY MEASUREMENT (RUNNING_LOG §136 · §137):** the ladder pass (§136, the card's curves — the wrong
  articulations for this section) UNDONE at his word; `tools/section_level.js --measure` played each part's own voice ISOLATED through the rack
  (a grid of velocities × three pitches, the track's peak read in Reaper) and `--apply` mapped every note's written velocity to the velocity on
  its lane that gives one common level (the mean curve, its top the quietest voice's top) — all 366 notes, the glockenspiel included (now
  measured for its voice). The winds' staccato is hot and narrow (14 dB of range): their sent velocities fall far below the written (the flute's
  127 → 45). In his save `piece-Section02-B-08ctpt-VolFix` (his `-preVolFix` copy beside it); re-run `--apply` after his edits; `--undo` restores.
  A verification pass (every mapped note played isolated, `tools/part_meter.js --isolate`) ran after. **► NEXT SESSION: his ear on the section;
  if the winds' soft-velocity timbre is wrong, the fader (CC7) per wind for the section is the other lever — to build.** Also open from 2026-11-09: his ear on the beating crescendos (`piece-Section01b-BeatingUnisonCrescendos-B`); the Rec row /
  flute question (one tab, F5). **MODEL:** his listening — Fable; a glock measurement — Opus.
- **2026-11-09 (late) — THE FIVE OTHER LANES ROLLED (RUNNING_LOG §123; SW-19 · SW-20):** clarinet F5 · flute F6 · cello F3 · violin F4 · the crotale F7
  (static, its sine gliding) at his entries, by SW-15's shapes (`bank/beat_saw.json`), the held tones by D12's rules (a string's bows, a
  crotale's bowings added), each lane its own seed; the pop's cause found in the page (a mid-span start rose in 15 ms) and fixed. All in
  `piece-Section01-D-saxBeatTest` (69 objects). **► HIS EAR on the whole; the sine marks per lane are the AI's starts.**
- **2026-11-09 — STILL SILENT → THE ENGINE'S CUE (RUNNING_LOG §111):** the route was necessary, not sufficient; traced by measurement to
  `Buffer.cueSoundFile`'s completion function firing before the read (the synth streamed an empty buffer). Fixed in `material.scd` (the read's
  /done awaited; VDiskIn at the file's rate — the fund is 44.1 kHz, the engine 48 kHz); the engine window now shows the server's own errors.
  The material brick's card opens on P only (the page's own rule). **► HE RESTARTS THE ENGINE, F5, plays.** The engine's files pushed.
- **2026-11-09 — HIS FIRST PASS, two faults and a revision (RUNNING_LOG §109 · §110):** the drawer's drop fixed (§109) · the electronics lanes
  FULL height at his word (twelve equal lanes) · **"I don't hear it": the full rack had no ELEC RETURN track** (the NITS line of 2026-11-07) —
  `node tools/elec.js route` run by the AI: the sends and ELEC RETURN at track 25 are in his open Reaper, **UNSAVED until his CTRL+S**. NITS:
  the route table's piano track name; the old ReaRoute 4 sends. **► He saves the rack, F5, plays.**
- **2026-11-09 — THE MATERIALS DRAWER BUILT (PLAN 1a.8 steps 1 … 4; RUNNING_LOG §108):** `▬ Materials ▾` in the bar — a full-width drawer, a row per
  material with its waveform (`bank/materials_peaks.json`, by the index tool), click the waveform to hear from there (the file itself, `/fund/`),
  drag a row onto a lane to place a brick; the brick shows its stretch's waveform; M (mute) and S on Elec 1 … 4. Proven on the throwaway; NOT
  under his hands (the drag and the sound). **► HIS FIRST PASS, on the twelve-lane page with the drawer: START (or restart) the score server
  first — `/fund/` is a new route.** The engine's `le_drawer.js` pushed to its repo at this wrap.
- **2026-11-09 (after the clear) — FOUR ELECTRONICS LANES built and proven on the throwaway (RUNNING_LOG §105, D11):** Elec 1 … 4, half height,
  below the cello; the material bricks live there. His first pass continues on the twelve-lane page (his server must be RESTARTED or the
  page reloaded — the server serves the file as it is; a reload is enough). **In the chat: THE MATERIALS DRAWER** (his wish verbatim, §106 —
  a full-width drawer from the top, collapsible; drag a material onto a lane; a rough waveform on the brick; a preview in the drawer).
  **MODEL:** the design talk — Fable; its build — Opus once the shape is settled.
- **2026-11-09 — THE ELECTRONIC SCORE BUILT (PLAN 1a.7 steps 1 … 5; RUNNING_LOG §103, the engine's §74):** the fund (`H:\switch_2026udio  set-2025-04-08c\keep\`, 47 materials) indexed in `bank/materials.json` (`node tools/materials_index.js` after the keep folder changes); the
  material brick in the composer score (key `N` at the playhead on the active lane · SHIFT+N splits the selected one · the panel: material,
  from, length, fades, trim, level flat / hairpin / curve A B C lane · ▶ hear 6 s); the engine streams a brick's stretch from disk
  (`electronics/sc/material.scd`). Proven offline (`material_test.scd` PASS) and on the throwaway page; NOT under his hands yet.
  **► NEXT: HIS FIRST PASS WITH THE ENGINE UP** — Reaper with the rack → `start_electronics.bat` (the engine restarted ONCE: the new file and the
  index load at start) → his score → `N` places a material → play. Faults to `docs/SWEEP_LIST.md`. **Also waiting on his ear:** the ten
  sequences with characters (`http://localhost:5620/files/tuplets/sequences/processed/index.html`) — the keepers by seed. **Step 6 (the bounce)
  when he reaches it.** **MODEL · CLEAR:** his pass and its faults — Fable (judgment on what he hears); the bounce is a written step — Opus.
  This is a good time to clear: the lab's long conversation is behind this entry.
  `Resume reads:` `docs/PLAN.md` 1a.7 · `docs/STARTUP.md` · `electronics/score/le_material.js` (its head) · `docs/SWEEP_LIST.md`.

- **2026-11-03 — 1a.3 IN HIS HANDS: THE ICY LAB (RUNNING_LOG §44)** — a live patch, `http://localhost:8732/engine/icy-lab.html`
  (preview name `icy-lab` = the workshop's `tools/serve.py`; or he runs it by its full path, `python C:\Users\jwloy\GitHub\live-electronics-engine\tools\serve.py`):
  1 of 12 grabs, the tree as knobs, save-to-menu. **► HE LISTENS AND SAVES SETTINGS; the menu `live-electronics-engine/voices/icy-menu.json`
  is copied to the engine's repo at the wrap. Then 1a.4.**

- **2026-11-03 — 1a.2 DONE (§37), 1a.3 BUILT (RUNNING_LOG §41):** the sources revised to the full mix's busiest seconds (§40); 56 one-second
  grabs × ×30 · ×50 · ×100 through his icy; the listening page `http://localhost:5600/bank/set/2025-04-08c/sources/index.html`
  (audio on disk, gitignored; re-made by the one command in §41). **► WAITING ON HIS EAR: which factor(s), which grabs; then 1a.4.**

- **2026-11-03 — 1a.1 DONE (§35), 1a.2 BUILT (RUNNING_LOG §36):** the capture page `bank/set/2025-04-08c/capture/index.html`
  (served by his score server at `http://localhost:5600/bank/set/2025-04-08c/capture/index.html`), `accents.json` the strongest third
  per player. **► WAITING ON HIS LOOK; then 1a.3 the sources** (the grabs by the accents in `accents.json`, 4 s windows, stretched).

- **2026-11-03 — 1a.1 BUILT (RUNNING_LOG §34):** his mix found in the session's export folder, read where it lies; `analysis.json` and
  `set.json` in `bank/set/2025-04-08c/`. Waiting on his listen. **► NEXT: 1a.2 the capture** — the four players' onsets and their three
  curves (density · loudness · centroid) drawn side by side over the mix, a tool in the workshop's corpus, its pages here in `capture/`.

### SESSION 2 — THE LAB OPENED (2026-10-23) — PLAN 1a laid out; 1a.1 WAITS FOR HIS MIX *(mid-session checkpoint)*

- **The task and its state:** the first section's electronics as a seven-step LAB, `docs/PLAN.md` § 1a (written 2026-10-23 by the planning
  method, RUNNING_LOG §26 … §31; his words SW-2). THE SET is Sound Lab 2025-04-08c (piano · baritone guitar · archtop · drums); its
  stems and analysis are on `C:\WindowsDrive\analysis export\`. **Nothing is built yet.** 1a.1 (the set read in) is first and needs
  HIS MIX — he has it at home and brings it (on his to-do list): dropped into `bank/set/2025-04-08c/` (its README says what goes there).
  No stand-in sum unless he asks.
- **The latest deliverable:** PLAN § 1a (the seven experiments, each build · hear · knobs) · `bank/set/2025-04-08c/README.md`.
- **► THE NEXT CONCRETE STEP — run 1a.1 the moment the mix is in** (`/postclear go` or his word): (1) look in `bank/set/2025-04-08c/`
  for his mix file; if absent, say so in one line and stop. (2) Copy the session's analysis JSON there as `analysis.json`, the part
  `bari-sax` → `baritone-guitar`. (3) Write `set.json` (stems' paths, the parts, the mix's name). (4) Name him the file to listen to
  (his mix as it is — nothing is rendered at 1a.1). (5) Log §32: his verdict. Then 1a.2 — the capture: read `live-electronics-engine/
  corpus/README.md` and `docs/corpus/HANDOFF.md` first, then the analysis JSON's shape; draw the four players' accents · state ·
  readings side by side; a tool in the workshop's corpus folder, its output here in `bank/set/2025-04-08c/capture/`.
- **`Resume reads:`** `docs/PLAN.md` § 1a · `bank/set/2025-04-08c/README.md`.
- **Pending him:** the mix (his to-do) · "that's the session" at 1a.1 · the two rolled-back files below ("restore") · his rack.
- **Deliberately uncommitted (git status, 2026-10-23):** `.gitignore` — rolled back on disk (lost the `tools/port/batt-*/` lines), restore
  only at his word · `docs/VERIFICATION_RECIPE.md` — rolled back to 5501, same · `reaper/switch_rack.rpp` — HIS save of 2026-10-20 22:02,
  committed at his word · `probes/clip_watch.json` · `clip_watch_s.txt` · `rec_modes_before.json` — container 5's probe outputs, scratch,
  left · `tools/port/batt-old/` · `tools/port/scratch/` — the port's battery outputs, meant to be ignored by the lost lines, left.
- **MODEL · CLEAR:** 1a.1 and 1a.2 are execution of a written step — **Opus**; the listening-and-adjusting conversation and 1a.5 (the
  tremolo's mappings — judgment) — **Fable**. Clear now (the start's whole conversation is behind this checkpoint).

### SESSION 1 CLOSES ON THIS (2026-10-23) — THE START IS DONE (containers 1 … 6 and 10.0); next: the music

- **2026-10-23 — 10.0 DONE (RUNNING_LOG §25): the protocol is v2** in the home, both runs' lessons written in; the backlog and the index
  refreshed. **THE START OF THE PIECE IS DONE.** Nothing composed. **► THE NEXT CONCRETE STEP IS HIS: the music.** When he opens it, PLAN
  § 1 is laid out by `docs/PLANNING_METHOD.md` from the sketch pad (SW-c2 the two musics · SW-c1 the flute's partials · SW-1 the tremolo
  experiment · LG-340 … 345 the electronics' brief); the first tool he reaches for runs container 7's loop (7.0 the law read first).
  `Resume reads:` CLAUDE.md · `docs/COMPOSITION_NOTES.md` · `docs/PLANNER.md`. Fable for the talk.

- **2026-10-23 — CONTAINER 6 SET UP (RUNNING_LOG §24):** the registry for eight parts, his three calls, the test page. **What is left of the
  start: 10.0 — the deviations of BOTH runs (piece 6's register and this one's) written into the protocol as v2, the eight LATER
  items to the home's BACKLOG.** Container 7 (the tools) and 8 (the deliverables) run with the music.

- **2026-10-23 — CONTAINER 5 DONE (RUNNING_LOG §21 … §23):** the card, the trims, the curves; the cello to the standard at his "a". **Next:
  container 6, the notation set-up — HIS THREE CALLS FIRST (H6-35):** the pitch form · the percussion staff · the short names; then 6.0 the
  registry for the eight parts (the piano's grand staff from piece 4) and 6.4 save → IR proved.

- **2026-10-23 — CONTAINER 4 DONE (RUNNING_LOG §13 … §20):** the read-out (`docs/INSTRUMENTS_READOUT.md`) · fourteen `SW` ports · the
  rack `reaper/switch_rack.rpp`, 24 tracks cloned from pieces 4 · 5 · 6 + his SI2 loads (clarinet 13 · alto sax 16 + 6 on a `b` instance) ·
  the SI2 state as text (Dynamic 1.00, the curve copies) · the recipes derived · **his word: "sound now, all lanes play"** ·
  `docs/RACK_SETTINGS.md` § 0. **Next: container 5 — the calibration for a composing demo** (the protocol's § 5; piece 6's way, the
  how-to `measuring.md`): the pre-flight first — the SI2 masters at −6 dB (the master read +0.75 dB on one note), the flute's Dynamic,
  the round robins — then the card, the trims, the remap, the fader curves. **Before any session: HE starts loopMIDI, then Reaper.**

*(The block below is container 3's close, kept as the trail.)*

- **The task:** the start of the Switch~ piece by the new-piece protocol, run by piece 6's deviations register (H6-1).
- **Where it stands:** container 1 the harvest ☑ (in piece 6's repo, his read "all as proposed") · container 2 the kit ☑ · **container 3
  ☑ (RUNNING_LOG §5 … §10):** piece 6's engine copied byte-exact from `9796edd` (462 / 462 by blob hash) · proven whole (45 batteries:
  30 green, 15 red, every red classified — NITS) · the fixes (seven piece-5 tools retired) · the re-palette to EIGHT lanes — flute ·
  clarinet · alto sax · percussion · vibraphone · piano · violin · cello (D7) — on 5600 / 5100 (102 files, 200 edits, every count
  asserted) · provisional recipes and skeleton banks (`palette_check` 202 · `roster_check` green) · THE ENGINE SEATED at `electronics/`
  by subtree (its repo's `a11b387`, the same commit piece 6 stands at) · verified on the throwaway `score-5601`: the page boots with the
  eight lanes, the route battery 96 / 97, every Panels ▾ and Insert ▾ entry opened clean, the piano role clicked, the ensemble warn with
  its control, the save round trip, the day-one stub written by the app (`scores/switch.json`). **Nothing sounds; nothing notates this
  ensemble yet.**
- **► THE NEXT CONCRETE STEP — CONTAINER 4, THE INSTRUMENTS, with him at the start:** **4.0 THE READ-OUT PER INSTRUMENT** (H6-22) —
  one line each, "carried from piece N: its round robin · its volume · its curve · its ranges — done / not, with the file": the flute ·
  piano · violin from piece 4 (`septet_2026`: `sandbox/instruments.js`, its `bank/instrument_card.json` · `velocity_remap.json` · its
  RACK_SETTINGS) · the cello from piece 6 (carried, measured) · the percussion from piece 2's catalog by piece 6's route (`bank/
  aro_percussion_catalog.json` · `ricotti_catalog.json`) cut to the call's list · the clarinet and the alto sax NEW on SI2 (UVI) — and
  the libraries CONFIRMED with him (Q1); the vibraphone's and the glockenspiel's library (Q2) · then **4.1** the ports made BY THE AI
  through loopMIDI's registry key (`SW…`, the standard set; piece 6's `#6 §19` is the how-to: `protocol/howto/rack.md`) · **4.2** the
  tracks by `tools/build_rack.js` — the cello cloned from piece 6's rack on disk, the flute · piano · violin from piece 4's; the clarinet
  and the sax new SI2 tracks (the UVI how-to WRITTEN first, H6-24, from the tubas' and piece 4's record) · **4.3** his loads: the
  clarinet and the sax presets in UVI's browser, and the new ports enabled in Reaper's Preferences · **4.4** the state as text ·
  **4.5** the recipes derived from the rack (`apply_uvi_parts.js` · `apply_perc.js`) · **4.6** the first sound, in HIS Chrome.
- **`Resume reads:`** `CLAUDE.md` (the profile · § Apps · the warnings) · `docs/PLAN.md` § 0 · `decibel_TENOR_2026/docs/HARVEST.md`
  § → 4 (H6-21 … H6-28) · the protocol's § 4 · `composition-system/protocol/howto/rack.md` · `kontakt.md` · `measuring.md` ·
  `decibel_TENOR_2026/docs/RUNNING_LOG.md` §18 … §25 (its rack build) · `septet_2026/sandbox/instruments.js` (the flute · piano ·
  violin recipes and their UVI record). Nothing else.
- **Pending him:** Q3 the title, when it comes · the percussion's SELECTION (unpitched from the call's list; which pitched ones) — the
  music's, later · the planning repo's "pieces in play" line (2.6 — only at his word). *(Q1 answered 2026-10-20: SI2 — D10. Q2 answered:
  two lanes, the pitched lane's roster every pitched instrument he owns — D10.)*
- **Deliberately uncommitted — none.** (`git status --short` clean at this commit; `tools/port/batt-old/` is gitignored.)

### THE SESSIONS BEFORE THIS ONE — one line each; the lab journal has them whole

- **S1 · 2026-10-20 (Fable)** — the orientation (RUNNING_LOG §1 · §2) · the harvest of piece 6 run in its repo (`#6 §488`, §3) ·
  container 2 (§4) · container 3 whole, and the engine's take (§5 … §10) — his word *"go ahead all here no need for clear and model switch"*.

**NEXT STEPS · MODEL · CLEAR** *(the running thread — THE RHYTHM, CLAUDE.md. Keep current. Brought current 2026-11-10, after the shore-up.)*

| # | Step | Model | Clear first? |
|---|---|---|---|
| ☑ | The start (containers 1 … 6, 10.0) · the lab (PLAN 1a.1 … 1a.6) · the electronic score (1a.7) · the drawer (1a.8) · the electronics lanes (D11) | — | — |
| ☑ | The beating pairs built (SW-10 … SW-31; 1a.9) · the counterpoint's volume fix (§136) | — | — |
| ☑ | THE MIDI SHORE-UP, the text half (§143 · §144; PLAN § 1c): the alive map · the prepared piano's channels · the flute's tongue ram · the jet whistle and the slaps on their own parts, no keyswitch · the battery completed (brake drums · bass drum · tam-tams cloned; the snare's track) · the lessons in the home's protocol | — | — |
| ☑ | The volume by LOUDNESS (§148 … §152: the section card · parity) · the counterpoint dealt (1d) and thinned (§153 … §155) · SW-36 the form stated | — | — |
| ☑ | 2026-11-11: SW-37 · 38 · 39 (the ringing petals · the cello hills and the pairs workshop · the hills as a graphic score) · SW-41 (the just roots, the empty containers) · **SW-42 THE PHASE MACHINE built (§165, PLAN 1f, `docs/PHASE_TOOL.md`)** | — | — |
| **►** | **His hands on the phase machine (PHASE beside MT; his server restarted once for its store) — what he learns is the next part; and the Section 3 roots into the containers** | Fable | — |
| ☑ | His hands (PLAN § 1c step 4): the curve copies · the plucked piano · the snare — all done 2026-11-10, the rack saved. The violin’s +6 dB: STAYS (§158, his word 2026-11-10) | — | — |
| ☑ | 1d the articulation deal BUILT (§145: `artic_deal.js`, the decks `bank/artic_deal.json`; the first deal `scores/piece-Section02-C-artics-01`) · 1e the level map per articulation (26 voices measured and mapped, §146) | — | — |
| — | **His ear on `piece-Section02-C-artics-01`** (the deal's markers name each container's articulation; `--seed` re-deals; the decks are his to edit) — then the next section | Fable | — |
| — | The method's steps 2 … 4 (SW-11): the gliss speed · ONE drawn crescendo read by the sine AND the sax · the electronics under them, quickly | Fable (design) · Opus (build) | at the step |
| — | The other lanes by SW-15's algorithm (`bank/beat_saw.json` to write; `beat_saw.js --roll`): clarinet F5 · flute F6 · vibraphone / glockenspiel F6–F7 (the sine moves) · violin F4 · cello F3 | Opus | yes |
| — | 1a.7 step 6 the bounce, when he reaches it · the tuplets' keepers by seed | Opus | — |

**Open questions:** Q3 — the title · Q4 — the percussion's selection, the music's (the call lists vibraphone and glockenspiel; marimba,
xylophone and crotales are not on it). *(Q1 · Q2 answered 2026-10-20 — D10.)*

**Blockers:** none.

**Standing warnings for this repo:** never bind **5500 / 5000** (piece 6's) · **5400 / 4900** (piece 5's) · **5300 / 4800**
(piece 4's) · pieces 4 and 6 hold uncommitted files that are his — never stage, move or edit anything there · this repo is PUBLIC
and the submission ANONYMOUS — nothing personal and nothing of the submission's record lands here · he keeps his own time: no
schedule keeping, no route framed around a date.

**Checks this piece owns:** none yet — they arrive with the code (3).

---

## §3 Principles

- **THE VOLUME IS THE AI'S (his rule 2026-11-10, RUNNING_LOG §159):** no volume task, check or decision is put to him unless a passage
  cannot sound or he says something is off. The AI settles levels by the law and the tools; the rest goes to NITS.

*(Lessons never to repeat. Numbered, append-only. **1–33 are inherited** — one line each here; the full text,
dates and lab-journal sections are in `septet_2026/docs/PROJECT_JOURNAL.md` §3 (1–18), `septet_LGMF_2026/docs/PROJECT_JOURNAL.md`
§3 (19–23) and `decibel_TENOR_2026/docs/PROJECT_JOURNAL.md` §3 (24–33). Most bite only once the code is here.
Verified in this repo only when they bite.)*

1. Check Reaper input monitoring before blaming the instrument (#3 P1).
2. When a working reference exists, diff the files; don't iterate guesses (#3 P2).
3. The IR schema is a gate on the file — a new overlay kind enters the schema in the same
   commit or the page is rejected and deleted. Snapshot first (#4).
4. Never `git add -A` — stage explicit paths (#4 D30).
5. Only delete IDs you created in the same breath (#4).
6. MIDI thru must never listen to the loopMIDI output ports (#4).
7. Schedule playback with a ~150 ms lead (#4).
8. Object ids are per save — never delete or replace by id alone (#5).
9. Verify against the composer's running server; never hold his port, never save from the
   AI's pane; a hidden pane never fires `requestAnimationFrame` (#5).
10. When downstream meters freeze at identical values, dump mute / solo / routing first (#5).
11. Learn a plugin's vocabulary by diffing the GUI's change, not by guessing from strings (#5).
12. Measure the layer that reaches the INSTRUMENT, not the layer you built. Print the MIDI (#5).
13. Never queue what cannot be un-queued; Chrome does not implement `MIDIOutput.clear()` (#5).
14. Where a note is started by one piece of routing, it is stopped by the same one (#5).
15. Write the assertion after the number, never before it (#5).
16. Build on a `zz-ai-` copy from the FIRST command, not the second (#5).
17. The notehead's left edge is the moment; the go line marks displacement (#5 D49).
18. A checker that tests one half of a rule is worse than no checker. When a rule names two
    classes, the gate tests both or says in writing which it does not (#5).
19. A copy-forward carries the standing RULES whole, not only the code — check the new CLAUDE.md
    against the source's, heading by heading (#6).
20. Prove the copy whole BEFORE changing it — commit the byte-exact copy, run everything against it,
    then patch; after that every red has one possible cause (#6).
21a. The file, the app's intent and the rack's layout are each necessary; only the RECORDING of the
    rack is the proof. When he says it sounds wrong and the text says it is right, record the rack (#6).
21b. `cmp` proves a file was copied; it cannot prove the LIST was right. Run what you copied (#6).
22. A rule that names a part by ID must be checked against the parts that EXIST — when a palette
    changes, grep the registries for the old instrument names, not just the code (#6).
23. When a measurement and an assertion disagree, find out which is wrong before editing either (#6).
24. An engine is a server WITH its owner — an ownerless server is cleared before a start, a living engine never touched (piece 6).
25. Say what the thing IS, in concert terms, before its plumbing (piece 6).
26. A tool run as a CHECK can write — know what a check writes before running it beside his work (piece 6).
27. LINEAGE FIRST — a wall in an inherited mechanism has usually been crossed in an earlier piece; read how, then report (piece 6).
28. A sound stage is proven on the PIECE'S OWN NUMBERS, by one real render MEASURED — not by its stage's test on small numbers (piece 6).
29. An audition is handed over RENDERED — an unrendered variant is invisible in the page and plays raw (piece 6).
30. A record that holds an ID or an ABSOLUTE TIME travels with its object — a copy remaps the references inside it (piece 6).
31. A fix that makes a thing obey its written value changes how it sounds — say the audible consequence BEFORE he hears it (piece 6).
32. The absence of a trace is not a finding (piece 6).
33. Where several players listen to each other, a section cannot be edited one player at a time (piece 6).

*(The old "#N" in 1 … 23 are the OLD numbers — #3 = the tubas, #4 = *Scattered Substance*, #5 = *Recombination*, #6 = *Approaching*
in his numbering of 2026-10-11; kept as the source files have them.)*

*This piece's own:*

34. ‹…›

---

## §4 Decisions

*(Append-only: ID, date, decision, why, what was rejected.)*

- **D1 · 2026-10-20 — THE INSTRUMENTATION: flute · clarinet · alto sax · piano · percussion · violin · cello.** His words at the
  opening: *"will write for flute, clarinet, alto sax, piano, perc, violin and cello"* — the call's seven core players minus the
  doublings and the technologists (who are the ensemble's). *(RUNNING_LOG §1)*
- **D2 · 2026-10-20 — THE PROFILE: a normal port, with the engine by subtree and the piano role on.** Copy-forward from piece 6 ·
  both layers · the animated scrolling score · `electronics/` off the byte copy, taken by `git subtree add` (H6-9) · the roles line
  `piano` on. His *"1a"*. Rejected: copying from piece 5 *Recombination* (piece 6 is the later stack and holds the electronics' seams
  and the port's own scripts). *(RUNNING_LOG §2)*
- **D3 · 2026-10-20 — THE REPO: `switch_2026` · PUBLIC · PUSH AFTER EVERY COMMIT.** His *"2a"*. The submission is anonymous: its record
  (`docs/submission/` · `docs/call/`) is gitignored. *(RUNNING_LOG §2)*
- **D4 · 2026-10-20 — THE NAMES, by the lineage's pattern:** `switch` · `piece-switch` · `switch-2026` · `switch_rack` · 5600 / 5100 ·
  the loopMIDI prefix `SW` · the notes `SW-N`. His *"3a"*. *(RUNNING_LOG §2; the table in §1)*
- **D5 · 2026-10-20 — THE HARVEST OF PIECE 6 RUN IN FULL, in its repo, read once.** His *"a for the harvest"*, then *"all as proposed"*:
  43 take now · 8 later · 9 leave. Rejected: the light read. *(`#6 §488`; RUNNING_LOG §3)*
- **D6 · 2026-10-20 — HE KEEPS HIS OWN TIME** (piece 6's D5, carried): the call's date is recorded, not managed; the order and the pace
  of the containers are his.
- **D7 · 2026-10-20 — THE LANES: EIGHT — the percussionist on two; the pitched lane is the vibraphone; the piano a role.** Score order
  flute · clarinet · alto sax · percussion · vibraphone · piano · violin · cello (winds · percussion · keyboard · strings); META 8; the
  curve windows 9 / 10 / 11 over piano · violin · cello; `layoutVersion` 9. THE AI'S CALL at the re-palette, his to reverse — he had not
  answered "one lane or two" (Q2). Why two: piece 6's shape; the call's list has two mallet instruments (vibraphone · glockenspiel);
  cutting the pitched lane would cut the tools built on its key (`bowed_vibraphone`: the strip's pitch tool, the texture panel, the
  beating tool). Rejected: one percussion lane; a rename of the key (cosmetic, 13 sites — NITS). *(RUNNING_LOG §5 · §7)*
- **D8 · 2026-10-20 — THE ENGINE IS SEATED BY SUBTREE, right after 3.4 and before 3.5** (`8c4baff`, the engine's `a11b387`): the score
  server requires the engine's relay at start, so the app cannot be verified without it; the seams were already in the copied stack.
  Rejected: copying `electronics/` with the byte copy (the subtree push would break — H6-9). *(RUNNING_LOG §9)*
- **D9 · 2026-10-20 — THE ROLES HELPER IS NOT BUILT: the role is the existing lookup** (`TRACKS.findIndex(t => t.instKey === 'piano')`,
  33 sites in 12 modules, all reading TRACKS; the three lane-number fallbacks set). A helper would change no behaviour — his rule, no
  work not asked for. The protocol's 3.10 is answered by a deviation line, not by code. *(RUNNING_LOG §7)*
- **D10 · 2026-10-20 — THE PERCUSSION: TWO LANES, THE PITCHED LANE OPEN TO ANY PITCHED INSTRUMENT; the instruments not chosen.** His words: *"I haven't decided what percussion instruments I use. So let's have a pitched lane and a non-pitched lane. And … the pitch lane could have any of the pitch instruments, like marimba, vibraphone, Glock, or crotales."* So: the Percussion lane (unpitched) and the pitched lane stand as copied (D7 confirmed); the pitched lane's ROSTER is every pitched instrument he owns — piece 6's Ricotti four (crotales · glockenspiel · xylophone · marimba, carried) plus piece 5's Xsample vibraphone (on his disk, measured there) — the way piece 6 put all four Ricotti on one lane (its DEC-5); WHICH the piece uses is the music's, later. The libraries: 1a — the clarinet and the alto sax on SI2. *The call's percussion list names the vibraphone and the glockenspiel only; marimba, xylophone and crotales are not on it ("anything large not listed may not be available") — told him, his to weigh when he chooses.* *(RUNNING_LOG §12)*
- **D11 · 2026-11-09 — FOUR ELECTRONICS LANES, HALF HEIGHT, BELOW THE CELLO (piece 6's D8 reversed for this piece).** His words:
  *"Okay, let's do 4 lanes, but they can be half lane height. And then yes, below the cello."* Why D8 does not carry: this piece's
  materials are a fund from an outside set, not a player's own input — a brick has no player to sit with. TRACKS 12 (`elec1 … elec4`,
  `elec: true`, no recipe, no port), `PLAYER_LANES` 8, META 12, the curve windows 13 / 14 / 15, `layoutVersion` 10 (a v9 save migrates).
  *(RUNNING_LOG §105)* **Revised the same day, his word (§110):** *"let's just make the electronics full height, please, lanes"* — twelve equal
  lanes of 100/12 %; the curve windows over piano · violin · cello follow.
- **D12 · 2026-11-09 — THE BREATHS OF A LONG TONE (his "numbers good").** The held tone 85 … 100 % of the player's ceiling at the written
  dynamic (the morph's table: p 15 · mf 11 · f 8 s in the sax's register — an estimate, his to correct per player); one held tone in eight
  short (50 … 70 %); the inhalation 0.4 … 0.6 s; across the ensemble no two inhalations within 1.5 s. His considerations (SW-18): sustained
  tones, no predictable rhythm of breaths, no unison breaths. `bank/breath_rules.json`; `tools/beat_saw.js`. *(RUNNING_LOG §121 · §122)*

---

## §5 Playbooks

*(Mode-specific procedures and gotchas. Piece 6's §5 holds the engine's playbooks; bring one across when its system lands here and
is first used.)*

---

## §6 Done

- 2026-10-20 — **container 1** the harvest of piece 6, `decibel_TENOR_2026/docs/HARVEST.md`, his read "all as proposed" (`#6 §488`).
- 2026-10-20 — **container 2** the repo and its kit: the profile, the names, the method docs carried, the record docs from the
  skeletons, the sketch pad gathered (RUNNING_LOG §1 … §4).
- 2026-10-20 — **container 3** the engine copied forward from piece 6 — the survey (`tools/port/classify.js`, 462 copy / 287 leave) ·
  the copy by blob hash 462 / 462 (`1395bcf`) · proven whole, 45 batteries classified (`b554f90` the fixes) · the re-palette to eight lanes
  (`59afee9`) · the recipes and skeleton banks (`851a385`) · the engine's take (`8c4baff`) · verified on `score-5601` (RUNNING_LOG §5 … §10).

---

## §7 Human Notes

*(The composer's own to-dos and reminders. Reviewed at session end.)*

- 2026-10-20 — *"the performance scores are being worked out now and tempus will be first to receive first set of performance
  scores ie parts"* — the parked performance architecture (piece 6's DEC-46; the harvest's H6-47) waits on that.
