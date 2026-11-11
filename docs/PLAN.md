# PLAN — switch_2026

> **Rules:** IDs are stable — never renumber, only append. Status: `todo` / `doing` /
> `done` / `deferred` / `dropped`. Position = order. Every item keeps a one-line ***why***.
>
> **How an item gets its sub-steps:** `docs/PLANNING_METHOD.md` — with the composer, one
> step at a time: the goal, then the sub-steps, then written here at once. An item he has
> not yet discussed carries one line: *to be laid out when we discuss it.*
>
> **Two standing rules, carried from piece 5** (this piece takes THE SCORE layer, the animated scrolling score): every
> item that draws a NEW notated class names its EDGE CLASS · a NEW notation begins with a DEVICE SHEET
> (`docs/PLANNING_METHOD.md`).
>
> **The live electronics are planned in the ENGINE's plan,** `live-electronics-system/docs/PLAN.md` (thirteen parts): what
> is generic machinery is laid out and built there; what is this piece's USE of it is an item here.

## The piece in one line

For the [Switch~ Ensemble] — flute · clarinet · alto sax · piano · percussion · violin · cello (D1) — with live electronics from the
shared engine, maybe video animation, maybe quad diffusion · for the 2026 Switch~ / Overdrive call (anonymous; 5 … 15 minutes) · an
animated scrolling score · the music so far in two notes of his (the sketch pad, SW-c1 · SW-c2): *dense counterpoint interrupted by
spectral chords* · *the flute's higher partials made audible* — and the brief for the three electronics pieces (LG-340 … 345).

## The profile (the protocol's 2.1)

- the kind of start: **copy-forward** — from piece 6 *Approaching*, `decibel_TENOR_2026` @ `9796edd` (D2)
- the layers taken: **both** — the instrument and the score
- the score type(s): **the animated scrolling score**
- the live electronics: **the shared engine by subtree** (`electronics/` off the byte copy)
- the roles line: **`piano` on** · `percussion` the percussionist's lane(s), decided at 3.0
- the protocol version run: **v1, run by piece 6's deviations register** — the protocol's SECOND run (its first was piece 6's)

## The timeline that binds everything

| | |
|---|---|
| 2026-10-20 | project opened, kit installed (2); the harvest of piece 6 read |
| December 1, 2026 — his date (`composition-planning-and-notes/docs/next.md`) | the call's due date. Recorded, not managed: he keeps his own time (D6) |
| April 8, 2027 — the call's | the performance, if selected |

---

## 0. Setup — the new-piece protocol, for this piece's profile — `doing`

> **This section IS the protocol** (`composition-system/protocol/NEW_PIECE_PROTOCOL.md`), not a copy of it.
> Its containers and step IDs are used as they stand (2.1 … 8.x) — read the steps there, **through piece 6's
> `docs/PROTOCOL_DEVIATIONS.md`** (the "for v2" lines; H6-1) **and the harvest's TAKE NOW items** (`decibel_TENOR_2026/docs/HARVEST.md`,
> listed by container — they are steps of this start).
> Here only: which containers the profile takes · each one's status · where its record is.
> A step done differently from the protocol gets ONE line in `docs/PROTOCOL_DEVIATIONS.md`, at that moment (10.2).

| Container | Taken? | Status | Record |
|---|---|---|---|
| 2 The repo and its kit | yes — every piece | `done` 2026-10-20 | RUNNING_LOG §1 … §4 |
| 3 The engine copied forward | yes — from piece 6 | `done` 2026-10-20 — the copy 462 / 462 by blob hash · proven whole (45 batteries, 15 red classified) · the fixes (seven piece-5 tools retired) · EIGHT lanes (D7) on 5600 / 5100 · provisional recipes · the engine seated by subtree (D8) · verified in the running app (the throwaway 5601) | RUNNING_LOG §5 … §10 · § 0.3 below |
| 4 The instruments | yes | `done` 2026-10-23 — the read-out (`docs/INSTRUMENTS_READOUT.md`) · 14 `SW` ports by the AI · 24 tracks cloned from three racks + his SI2 loads · the state as text · the recipes derived · the first sound, his "all lanes play" | RUNNING_LOG §13 … §20 · `docs/RACK_SETTINGS.md` § 0 |
| 5 The calibration | yes | `done` 2026-10-23 for a composing demo — the pre-flight · the card (79/79, the chain proven on the cello) · every instrument at one standard (his "a") · five dynamics curves · dyn_table 52 | RUNNING_LOG §21 … §23 · NITS |
| 7 The composing tools made the piece's | yes — one at a time, at compositional need | `todo` — H6-39 … H6-41 | |
| 6 The notation set-up — the animated scrolling score | yes | `set up` 2026-10-23 — his three calls (transposed, the presentation in C · the unpitched staff · Perc for both) · the registry for eight parts · the test page valid, looked at in the app and the film's renderer · check_rules 31/32. Open: the print page (6.5) · the app-written page at his first music · 6.6 | RUNNING_LOG §24 |
| 8 The deliverables pipeline — the animated scrolling score | yes | `todo` — H6-42 · H6-43 (the take as the audio route; anonymous) | |

*Outside this table:* container 1 (the harvest) ☑ run in piece 6's repo, 2026-10-20 · 9 (the collation) is the home's index, read at
every session start — the read-out and `uvi.md` pinned there 2026-10-23 · **10.0 ☑ 2026-10-23 — the protocol is v2** (both runs' registers
written back; the eight LATER items in `BACKLOG.md`; RUNNING_LOG §25) · 10.1 at the piece's close. **THE START IS DONE.**

**The engine, in this piece's start.** The live electronics are NOT a container of the protocol. The engine is TAKEN after container
3 (`live-electronics-system/docs/TAKE.md`: `git subtree add --prefix=electronics engine main`, the seams of `docs/SEAMS.md` applied
once, the batteries and the shield run here, the commit recorded in journal §1); from then on its code is ordinary files of this repo,
pushed to its own repo by the AI at every wrap. What this piece USES of it comes with the music (§ 1).

### 0.1 Container 2 — what was done (2026-10-20, RUNNING_LOG §4)

The profile (2.1) · the repo exists, public, pushing after every commit (2.2, D3) · the names (2.3, journal §1, D4) · the method docs
carried whole from piece 6 @ `9796edd` with one provenance line each — AI_METHODOLOGY · SESSION_HYGIENE · PLANNING_METHOD · HOW_WE_WORK ·
SESSION_PROTOCOL · MORPH_NOTES · DYNAMICS_LAW · VERIFICATION_RECIPE · the checkpoint and postclear commands · `.gitignore` (its header this
repo's; `docs/submission/` added) · `.gitattributes` (2.4) · the record docs from the home's skeletons — CLAUDE.md (checked heading by
heading against piece 6's) · README · this plan · PLANNER · PROJECT_JOURNAL · RUNNING_LOG · COMPOSITION_NOTES (gathered first, at his
ask) · NITS · SWEEP_LIST · PERFORMANCE_NOTES · PROTOCOL_DEVIATIONS (2.5) · outside the repo: no `<prev>-<port>` launch entry (piece 6 is
finished); the planning repo untouched (2.6, at his word only) · the AI's memory notes of piece 6 copied whole into this repo's
memory (H6-2).

### 0.3 Container 3 — this run's survey, copy list and leave list (3.0, 2026-10-20 — RUNNING_LOG §5)

**The source:** piece 6 *Approaching* `decibel_TENOR_2026` @ **`9796edd`** — 749 tracked files, 49.3 MB; one modified file of his in its tree
(`bank/samples/index.json`), so every file is taken from the COMMIT. **Copy: 462 files, 10.9 MB. Leave: 287 files, 39.5 MB.** The lists:
`tools/port/copy_list.txt` · `leave_list.txt`, written by `tools/port/classify.js` (the reasons are in it), from `src_ls.txt` (`git
ls-tree -r -l HEAD`); the blobs `src_blobs.txt`.

| Verdict · reason | files | KB |
|---|---|---|
| COPY the composer app (`score/`, the three design studies' pages included) | 82 | 4205 |
| COPY the tools (piece 6's section builders included — CARRY ALL, USE SOME) | 209 | 2522 |
| COPY the notation engine (`notation/app` · `lib` · `registry` · `fonts`) | 49 | 1648 |
| COPY the bank's models, presets, libraries, templates | 19 | 1201 |
| COPY the two bank files read at start / at load, skeletoned at 3.4 (`elec_route` · `presets`) | 2 | 230 |
| COPY the tool docs (19) · `instrument_map.json` · the probes (33) · the bridge and the Kontakt scripts (34) · print (4) · sandbox (4) · the launchers and the package (5) · `launch.json` | 101 | 1111 |
| LEAVE the engine `electronics/` — by subtree (H6-9) | 67 | 1152 |
| LEAVE the scores (63) · the IR pages (11) · the rack (1, 16.7 MB) · the rack as text (8) · the film's and the takes' records (3) · the printed cover and print (3) | 89 | 30 385 |
| LEAVE piece 6's records (33) · the instructions page (27, the START at 8.5) · the kit docs (8) · the root kit (5) · the commands (2) | 75 | 5679 |
| LEAVE the piece data / measurement banks (24) · the engine's index (1) · the probes' outputs (9) · the design studies' data (10) · piece 6's port scripts (11) · one `.nka` | 56 | 2306 |

**The coupling (3.0):** kind A the composer page — six lanes → eight · kind B the per-instrument tables, piece 6's ten sites and the
readers of `sine_behaviours.json` · kind C THE PIANO ROLE — 33 `instKey === 'piano'` sites in 12 modules, every one reading TRACKS; the
three lane-number fallbacks set. The lane COUNT changes (6 → 8): the literal lane lists piece 6 found are by TRACKS already.
**What the run changed in the protocol's steps:** the harvest's fixes commit between prove and re-palette · the engine's take between
3.4 and 3.5 (the server requires it) · the roles helper not built (D9) — `docs/PROTOCOL_DEVIATIONS.md`.

---

## 1. Compose — `doing`

*To be laid out when we discuss it.* The material in hand: the sketch pad's SW-c1 (the flute's partials — the engine's sine and
tracker are the nearest thing) · SW-c2 (dense counterpoint / spectral chords) · the brief LG-340 … 345 (the mic openings, the saved
impulses and the cells, the naming glyphs, the categories, the inventory on screen). The call's tech that is NOT in the engine yet:
quad diffusion (the bus is stereo) · video projection (the engine's part 12, the live graphics, `todo`) — each a conversation when the
music reaches it, then the engine's plan.

### 1a. The first section's electronics — THE LAB (seven steps, each run together: the AI builds and renders, he listens and adjusts) — `doing`

*Laid out 2026-10-23 by the planning method (RUNNING_LOG §26 … §30; his words in `COMPOSITION_NOTES.md` SW-1 · SW-2). THE SET:
Sound Lab 2025-04-08c — piano · baritone guitar · archtop · drums, 6.6 min (§27); its eight stems and its analysis are on this
machine (`C:\WindowsDrive\analysis export`); his mix is a to-do on his list — the stems summed at equal gain stand in. "All the
capture from the same set." Each step is an EXPERIMENT: what is built · what he hears · the knobs he turns. A step is done when he
says so; what he hears and says goes in the RUNNING_LOG at once.*

***why:*** *"I want to restrict the parameters and see if I cant enhance the way the electronics follows my performances"* — an
electronics part for the FIRST SECTION, the acoustic instruments built around it (SW-2).

- **1a.1 The set read in** (the mix and the data, in hand) — ☑ *2026-11-03 — the mix (his, read where it lies), the analysis and `set.json` in
  `bank/set/2025-04-08c/`; no listen needed — his mix (RUNNING_LOG §35)*
  - build: HIS MIX (his bounce of the whole session — he has it at home and brings it; his to-do) dropped into `bank/set/2025-04-08c/`;
    the session's analysis copied there, "bari-sax" named baritone guitar; `set.json` written. No stand-in sum unless he asks.
  - hear: his mix, once — is this the session he means
  - knobs: none — the mix is his
- **1a.2 The capture** (four shapes, one per player) — *2026-11-03: built — `bank/set/2025-04-08c/capture/index.html` (the page) and `accents.json`;
  the tool `live-electronics-engine/corpus/draw_capture.py`; his look 2026-11-03: "fine for now" — ☑ (RUNNING_LOG §37)*
  - build: each player's performance data from the session's analysis, the workshop's way (Paper B): the accents (WHEN) · the state
    (WHAT) · the readings (HOW FAR) — drawn, one page per player, the four side by side
  - hear / see: the drawn captures over the mix; does each look like the playing he remembers
  - knobs: the accent threshold (the strongest third, to start) · the smoothing of the readings
- **1a.3 The sources** (REVISED 2026-11-03, RUNNING_LOG §40 · §41: the busiest ONE-SECOND moments of the FULL MIX, 20 from each of the
  three busiest regions, each stretched ×30 · ×50 · ×100 through his icy — `bank/set/2025-04-08c/sources/index.html` the listening
  page, 56 grabs × 3; the tool `live-electronics-engine/corpus/icy_sources.py`; the reels heard 2026-11-03 → THE ICY LAB, a live
  patch — `http://localhost:8732/engine/icy-lab.html` (the workshop's server, launch name `icy-lab`): 1 of the 12 grabs, his hierarchy
  as knobs (duration static / variable · overlap · envelope · scatter · the read speed live, a loop back), save-to-menu →
  `live-electronics-engine/voices/icy-menu.json`, RUNNING_LOG §43 · §44; HE FINDS THE SETTINGS BY EAR) — *as first laid out:*
  - build: per player, a 4-second window round each kept accent (1 s before, 3 s after; touching windows merged), cut from the mix,
    joined in order with short crossfades → the grab (30 … 90 s); each grab stretched to the voice's length — 3 min placeholder
  - hear: the four grabs, then the four stretched sources
  - knobs: the window · the accent share · THE STRETCH IS HIS ICY (his word 2026-11-03: "my own granular synthdef icy" — the Warp1
    freeze of github.com/elosine/freeze, the engine's `icy` stage in `electronics/sc/process.scd`), rendered offline through sclang; its
    own knobs — icSpeed (how far) · icOverlaps (the overlap) · icWin · icRand · icEnv (which of his ten windows) · the voice length — his words: *"we'll streatch and I'll listen maybe stretch more, use different overlap etc"*
- **1a.4 The four streams and the voice** (each source granulated by its player's whole performance; layered)
  - build: the piano's capture granulates the piano's source beginning to end; the same for the other three; the four layered → THE VOICE
  - hear: each stream alone, then the four together
  - knobs: what the capture drives in the granulation (density · grain length · position — as few as hold) · the layering's balance
- **1a.5 THE TREMOLO — the main focus** (the drums' capture on depth and speed; his "a")
  - read first (his word 2026-11-03, RUNNING_LOG §39): *Sýnthesi Alpha*'s tremolo overlays — `trem waves` · `trem rush` · `chop accel`
    (`synthesi-alpha/engine/voices.js`, the scenario's "overlays": one LFO on the bus, its speed steady or moving in a pattern) — the
    nearest tremolo in the lineage; the engine's stage is built from them
  - build: a tremolo on the voice with TWO parameters open — depth (volume) and speed, the speed shifting — steered by the drums'
    capture: accents · state · readings mapped to the two, several mappings tried
  - hear: the voice under each mapping — does it cluster, thin, surge, flow like the playing; "like vibrato from a violinist"
  - knobs: the mapping (which reading → which parameter) · the speed range · the depth range · the smoothing · the lag
  - this step takes the time it takes — "spend some time"
- **1a.6 The other effects** (the same bed, other quick effects, each following another player → four voices)
  - build: three more effects of the tremolo's kind (ready, human-analog, not reverb) — candidates put to him first; each steered by
    one of the other three players' captures; the same two-parameter restriction
  - hear: each voice; the four voices together
  - knobs: which effect follows which player · each effect's two parameters
- **1a.7 THE ELECTRONIC SCORE — the fund into the composer score** (REVISED 2026-11-09, RUNNING_LOG §80 · §102 · §103; his word: *"the
  engine is fine … multi-track … a post-production phase … a rough mix there so that it sounds, it plays back good enough so that I can
  compose it"*) — `doing`
  ***Why:*** the materials are made (tremolo mixes · granular beds · the opening · the petals · the tuplets); composing them is placing
  them, and placing wants a brick that behaves like a note.
  THE ROAD: the engine's (the lineage's — what quad and the live electronics need): the fund stays where it lies, the engine STREAMS a
  brick's stretch from disk (`electronics/sc/material.scd`), the score sends `/le/material`; the rough mix while composing is the engine's
  master bus (the glue and the limiter); the bounce is step 6. Top line only, his word — the steps:
  1. **The fund into the engine's reach, and into the page** — `bank/materials.json` (`tools/materials_index.js`: every master of `keep/`,
     name · file · seconds · channels · note); the engine told at start (`LE_MATERIALS`); the page's picker reads the same file. A brick may
     sit on ANY lane; layers = bricks overlapping, on one lane or across lanes. ☑ 2026-11-09 (§103) — **REVISED the same day (§105, D11): FOUR
     ELECTRONICS LANES of their own below the cello (Elec 1 … 4; half height at first, FULL height the same day, §110); the bricks live there, layered across the four.**
  2. **The brick** — `elecMaterial` (`electronics/score/le_material.js`, a mixin; the key N): an OFFSET into the file and a LENGTH; dragged;
     the LEFT edge trims and the offset follows (the sound stays where it was), the RIGHT edge trims the length; never past the file's end;
     SHIFT+N splits the selected brick at the playhead, the second carrying the offset on. ☑ 2026-11-09 (§103)
  3. **The fades** — a few tens of ms at each edge by default (the engine's 30), longer by hand in the panel; a playhead that starts inside
     a brick plays what is left with a short fade in. ☑ 2026-11-09 (§103)
  4. **The level curve** — flat (a mark; mf = the file as mastered) · a hairpin · a drawn curve A | B | C | lane read through the lanes' own
     curve reader (the sine's way), 16 points, sent as a line. ☑ 2026-11-09 (§103) — his ear on it: open
  5. **Playing, layered** — from anywhere, several at once, through the engine's bus; a stop lets every material go (30 ms).
     Proven OFFLINE (`electronics/sc/material_test.scd`: the stretch is the offset's, the level, the fades, the end, a level line) and the
     page on the throwaway server (the brick, its message, the split). NOT YET: a living engine under his hands — the first time he plays
     a pass with the engine up. ☑ built 2026-11-09 (§103)
  6. **The bounce** (post-production, his word) — an offline render from the save: every brick with its offset, length, fades and level
     curve, summed, mastered (`master_mix.py`) into ONE file for the notation score and the recording. *To be laid out when he reaches it.*
  - held: quad — a stereo simulation of quad in the composer score, the real four channels at the engine; later, his word (SW-2)
- **1a.8 THE MATERIALS DRAWER — the fund in hand while composing** (2026-11-09, RUNNING_LOG §106 · §107 · §108; his words §106: *"some
  sort of easy access drawer or panel … full score width … drop down from the top … collapsible … drag the materials onto the lane … some
  rough waveform … in the drawer preview, I can hear the materials … click to a different part"*) — `done` 2026-11-09, proven on the throwaway;
  NOT under his hands yet
  ***Why:*** fifty-seven materials in a picker is a list of names; composing them wants their shapes in view, an ear on each, and a hand
  that puts one where it goes.
  1. **Solo and mute on the electronics lanes** (his word §107) — an M beside the S on Elec 1 … 4; `isPartAudible` says no for a muted lane
     and the electronics tick asks it (it always did for solo — the §107 claim corrected in §108). ☑ 2026-11-09
  2. **The waveform data** — `tools/materials_index.js` reads each master's samples once (cached by size + mtime) and writes
     `bank/materials_peaks.json`: 1200 slices a file, the loudest sample of each, 0 … 255. 57 files in 17 s. ☑ 2026-11-09
  3. **The drawer** — `electronics/score/le_drawer.js` (the ENGINE's: it knows no piece), one tag in the page and a button in the bar
     (`▬ Materials ▾`): a full-width drawer from under the bar, 42 % of the window, collapsible (✕); a row per material grouped by kind,
     its waveform on a canvas, a filter; a click on the waveform plays the file FROM THERE, straight from disk through the page's own
     player (`/fund/<file>`, served with byte ranges by the piece's server — the engine need not be up); ▶ from the start; ■ stops. ☑ 2026-11-09
  4. **The drop, and the waveform in the brick** — a row dragged onto any lane places a material brick at the drop's time
     (`materialAdd(name, layer, t)`), selected; every material brick draws the peaks of the stretch it plays inside itself, behind its
     label, cut to its offset and length, redrawn at every trim. ☑ 2026-11-09
  - his ear and hand: open — the drag gesture and the preview's sound are not run from the AI's pane (no hands, no autoplay)
  - **the card:** a click or a drop SELECTS a material brick; **P opens its card** (the page's own rule for the META curves and trills; §111)
- **1a.9 THE BEATING PAIRS — the long tones against a sine, the sax first** (2026-11-09, RUNNING_LOG §114 … §122; SW-9 … SW-18) — `doing`
  ***Why:*** SW-9's idea — a tone appears in the bed, the instruments enter on it in octaves and beat against it; Approaching's rules carried
  (`bank/beat_shapes.json`), the unit beats a second, the cents derived at each pitch.
  1. The sax on F4 with a constant sine: the balance (the sax at f, the sine's mark the lever), a two-legged rise, then a SAWTOOTH of four pairs
     (`tools/beat_saw.js`), the peaks held 1.8 … 2.6 s, the breaths by `bank/breath_rules.json` (D12). ☑ built 2026-11-09 — his ear: open
  2. The gliss speed · 3. ONE drawn crescendo read by the sine and the sax together · 4. the electronics under them, a quick fix (SW-11) — *to come*
  5. The other lanes by SW-15's two alternating shapes (A the fast finish · B the slow low one), the octaves of F: cello F3 · violin F4 · clarinet F5 ·
     flute F6 · the metal F6 / F7 with the sine moving; the ensemble's inhalations never within 1.5 s — ☑ built 2026-11-09 (§123: `beat_saw.js
     --roll` by `bank/beat_saw.json`; clarinet F5 at 26.4 s · flute F6 at 30 (the sine moves) · cello F3 at 32.8 · violin F4 at 35.9 · the crotale
     F7 at 39, static, its sine gliding — his entries SW-19); his ear: open; the piano later
  - later: the live balance's method for the performance score (DEC-64's hypothesis)

*Where the code goes (THE SORTING): the capture, the grab, the stretch and the granulation are the WORKSHOP's tools
(`live-electronics-engine/corpus/`, for any session); the tremolo and the steered effects are the ENGINE's (`electronics/`, for
any piece); this piece holds its USES — the set's files, the settings, the four voices, their place in the score.*

- **1b THE TIME-CONTAINER AND DICE STRATEGIES, GATHERED** (his goal, SW-33, 2026-11-10) — `todo`
  ***Why:*** "we've done many different versions of this" — the hexagram roll (Approaching's three-body section; the counterpoint's harmonic rhythm,
  §139) · the morph's "smaller of two rolls" · the beat shapes' pace and hold rolls · the breath rule · the sawtooth's alternation. One page that says
  what each does and when he reached for it, and a shared roller the tools read — when he reaches it; nothing standardised before.

- **1f THE PHASE MACHINE — a take re-articulated by every player as a pulse stream, the streams driven out of phase and back by a plan** (SW-42,
  2026-11-11) — `done` (first build): `score/public/phase_engine.js` (pure; `tools/phase_check.js`) · `phase_panel.js` (the PHASE button) · the store
  `bank/phase_states.json`; `docs/PHASE_TOOL.md`; RUNNING_LOG §165. ***Why:*** his words — *"the ensemble starts at a fixed tempo … they phase shift … hold
  at certain states … move to this multi-tempo configuration … converge at the same tempo … quick cuts … apply a harmony to any given time section …
  very, very minimal design."* Parts at a time, by his word: what he learns using it is the next part.
- **1c THE MIDI SHORE-UP — the rack brought to the lineage's standard, three weeks into the composing** (his ask 2026-11-10, RUNNING_LOG
  §143 · §144) — `done` but step 5's open items (the text half ☑; his hand steps ☑ 2026-11-10)
  ***Why:*** his articulation questions (§142) found a silent part and a keyswitch that switched nothing; his word: *"a very thorough review
  of all the things that got missed … every articulation on its own channel — no keyswitches … the 4-channel CC7 copies … the full
  percussion battery … fix the porting instructions so the next port carries the standard."*
  ***The standard*** (the home's `protocol/howto/`): ports by the standard set, a `b` port where an instance overflows · one track per
  instrument, input by port NAME · UVI one part per preset, three Ordinario curve copies, gain +6, inserts bypassed but the convolver,
  Dynamic 1.00 · Kontakt four slots ch 1 … 4, CC0 = preset − 1, round robin off in a saved copy · Spitfire one instance per instrument on
  its channel, never CC7 · the recipe DERIVED from the rack.
  1. ☑ **The alive map** — `tools/rack_alive.js`: every port, every channel, one note, the track's peak (`probes/rack_alive/latest.md`);
     `artic_probe.js --track` meters a track by name, `rack_inputs.lua` lists every live input. The ground truth of the rest.
  2. ☑ **Fixed as text** — the flute's tongue ram (part 13 was on a dead output pair; now main; the recipe's `tongue_ram` placed) · the
     prepared piano's parts on this piece's channels 6 · 7 (`uvi_set_channel.js`; a pushed state needs the plugin's reload — every push
     does it now) · the effects baseline on the flute and the prepared piano (his note; the PP2 convolver left as piece 4 had it) · the
     flute's jet whistle and the sax's three slaps on their OWN parts, no keyswitch (`uvi_split_ks.js`; the jet whistle PROVEN by its swell,
     the slaps as three distinct layers — WHICH is which is his ear) · `UVI_PARTS` regenerated, 78/78 placed.
  3. ☑ **The battery completed as far as text goes** — Brake Drums · Bass Drum (GC) · Tam Tams cloned from piece 5's rack onto `SWPerc`
     9 · 10 · 11 (`set_track_chunk.js`); a `Snare ARO` track on 12 awaiting his load; `perc_selection.json` 12 rows → `apply_perc.js`.
  4. ☑ **HIS HANDS — ALL DONE 2026-11-10 20:30 … 20:33** (the curve copies at +8.2 dB and the plucked piano by his Run Lua script, the reports in
     `reaper/kontakt/out/`; the snare loaded by him; the rack saved 20:33). *(The list below is the record; nothing here is to be asked again.)*
     (Kontakt and Spitfire only load from their own windows) — each a few clicks, in any order, Reaper open on the rack:
     - **the snare:** track `Snare ARO` → open the Abbey Road Orchestra plugin → its browser → High Percussion → **Snare** → the (C)
       All-in-one preset. (It shows Piatti until then — the plugin's last preset, not a load of ours.)
     - **the piano's curve copies:** track `Piano Kontakt` → Kontakt → the KONTAKT ▾ menu → Run Lua script… → `reaper/kontakt/curve_slots.lua`
       (slot 1 pinned to channel 1, three copies on 2 · 3 · 4 named "… curve A | B | C"). Until then a SHAPED piano note (a drawn or
       generated curve) plays nothing.
     - **the plucked piano:** in that same Kontakt the faint slot on channel 2 is piece 4's Spitfire Plucked Piano at no useful volume —
       set its MIDI channel to **5** and its volume to 0 dB; or load the Plucked Piano into the empty `PianoPlucked Kontakt` instance
       (channel 5). The recipe's `plucked` is channel 5 either way.
     - **the round-robin-off copies** (the standard's one by-hand item, `howto/kontakt.md` § 5): the violin's and the cello's ordinary
       voice, a copy with round robin off saved as a preset in all four slots, the recipe pointed at its number — WHEN a repeated pitch
       on the same note bothers him; Approaching skipped it.
     Then `node tools/rack_alive.js --only "Piano Kontakt,PianoPlucked Kontakt,Snare ARO"` and his CTRL+S in Reaper.
  5. **Open, with their tools:** the pitch-bend ranges — measured for the cello (1.012 st) and piece 4's flute (2.0); the clarinet's, the
     sax's and the violin's are the recipe's provisional 2 · 2 · 1 (`balance_schedule.js --bend` + `analyze_bend.py` + `apply_bend_ranges.js`
     when a glissando is written for them) · the call's opera gong (no ARO instrument — his library to name) · the SI2 masters: the clarinet
     and sax at −6, the flute's two at −2 as piece 4 left them (the calibration measured them so; a change re-measures).
  6. ☑ **Written back to the home** (`composition-system/protocol/NEW_PIECE_PROTOCOL.md` § 4 v3 entries; `howto/uvi.md` § 7 · 8;
     `howto/rack.md` § 4; `howto/kontakt.md` § 2) and to `docs/PROTOCOL_DEVIATIONS.md`: container 4's first sound becomes THE ALIVE MAP;
     every recipe technique probed; a KS preset an articulation needs is split at 4.4; a UVI push is followed by the reload.

- **1d THE ARTICULATION DEAL — his chosen articulations distributed into the counterpoint** (SW-35; his ask 2026-11-10) — ☑ built 2026-11-10
  (§145: `tools/artic_deal.js` · `bank/artic_deal.json`; the first deal in `scores/piece-Section02-C-artics-01`, seed 17, markers on — his ear;
  the decks are his to edit, the tool re-dealt with `--seed`)
  ***Why:*** *"an algorithm to distribute my chosen articulations into the counterpoint section"* — per lane a list, dealt on rolled time
  containers (the harmony roll's hexagrams, 1b), with the rules he gave: a pitch outside an articulation's range swaps the articulation
  (or folds the octave); the flutter tongues and the bow pressures want LONGER notes — a note too short for them is grown or dealt another.
  The tool reads the recipe's ranges, writes `technique` per note, keeps the old one (`properties.artic.was`), `--undo`.

- **1e THE LEVEL MAP PER ARTICULATION** (his ask 2026-11-10) — `doing` (§145: `section_level.js` measures one voice per (lane, technique);
  the 26 voices of `piece-Section02-C-artics-01` measured and mapped 2026-11-10 — §146 has the numbers)
  — ☑ 2026-11-10 (§148 … §152): THE VOLUME STANDARD BY LOUDNESS — the section’s own card recorded (`tools/section_card.js` → `probes/card_run.ps1` → `analyze_card.py`), then `tools/section_parity.js`: one loudness per written dynamic across the parts; the knobs — a UVI voice’s PROGRAM gain · a Spitfire TRACK (one voice per track, `perc_split.js`) · a Kontakt voice’s CC7 per note (`cc7Plain`) · a Kontakt track trim by his word. The peak-meter path (`section_level.js`) stays as the quick tool; the card is the judge.
  ***Why:*** *"per-articulation volume normalization against a standard level"* — `section_level.js` measured one voice per PART; with 1d a
  part plays several. The measure becomes per (lane, technique) — the curve of each voice the section uses — and the map per note by ITS
  technique; where velocity alone cannot reach the level (the SI2 staccatos' 14 dB), a CC7 offset per voice (NITS' lever).

## 2. Notate — `todo`

*To be laid out when we discuss it.* Piece 6's `docs/NOTATION_SCHEME.md` and its rules rows are the start (H6-37).

## 3. The performance score — `todo`

*To be laid out when we discuss it.* Waits on the Tempus septet's parts, his word 2026-10-20 (journal §7).

## 4. Submission — `todo`

*His. Anonymous: no name on the score, the recording or the file names; the record stays local (`docs/submission/`, gitignored).*
