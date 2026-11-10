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

**NEXT STEPS · MODEL · CLEAR** *(the running thread — THE RHYTHM, CLAUDE.md. Keep current. Brought current 2026-11-09 evening.)*

| # | Step | Model | Clear first? |
|---|---|---|---|
| ☑ | The start (containers 1 … 6, 10.0) · the lab (PLAN 1a.1 … 1a.6) · the electronic score (1a.7) · the drawer (1a.8) · the electronics lanes (D11) | — | — |
| ☑ | The beating pairs built (SW-10 … SW-31; 1a.9) · the counterpoint's volume fix (§136) | — | — |
| **►** | **His ear: the beating crescendos · the counterpoint's balance (the glock by ear or measured)** (`piece-Section01-D-saxBeatTest`): the balance (the sine's mark), the pace, the breaths (D12) | Fable | — |
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
