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

- **1a.1 The set read in** (the mix and the data, in hand)
  - build: the eight stems summed → the stand-in mix (one stereo file); the session's analysis read; "bari-sax" named baritone guitar
  - hear: the mix, once — is this the session he means
  - knobs: the stems' balance (equal gain until his bounce arrives)
- **1a.2 The capture** (four shapes, one per player)
  - build: each player's performance data from the session's analysis, the workshop's way (Paper B): the accents (WHEN) · the state
    (WHAT) · the readings (HOW FAR) — drawn, one page per player, the four side by side
  - hear / see: the drawn captures over the mix; does each look like the playing he remembers
  - knobs: the accent threshold (the strongest third, to start) · the smoothing of the readings
- **1a.3 The four sources** (the grabs, by each player's own accents — his "a"; stretched)
  - build: per player, a 4-second window round each kept accent (1 s before, 3 s after; touching windows merged), cut from the mix,
    joined in order with short crossfades → the grab (30 … 90 s); each grab stretched to the voice's length — 3 min placeholder
  - hear: the four grabs, then the four stretched sources
  - knobs: the window · the accent share · the stretch — how far, its grain overlap, its kind (the workshop's icy read, or Reaper's
    stretch) · the voice length — his words: *"we'll streatch and I'll listen maybe stretch more, use different overlap etc"*
- **1a.4 The four streams and the voice** (each source granulated by its player's whole performance; layered)
  - build: the piano's capture granulates the piano's source beginning to end; the same for the other three; the four layered → THE VOICE
  - hear: each stream alone, then the four together
  - knobs: what the capture drives in the granulation (density · grain length · position — as few as hold) · the layering's balance
- **1a.5 THE TREMOLO — the main focus** (the drums' capture on depth and speed; his "a")
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
- **1a.7 Into the score** (the four voices in the composer score, the first section)
  - build: the voices as audio the composer score plays on its electronics path, placed on the first section's timeline; the acoustic
    lanes written around them (the music, his — PLAN 1b when it is reached)
  - hear: the section in the score, the voices under his hands
  - held: quad — a stereo simulation of quad in the composer score, the real four channels at the engine; later, his word (SW-2)

*Where the code goes (THE SORTING): the capture, the grab, the stretch and the granulation are the WORKSHOP's tools
(`live-electronics-engine/corpus/`, for any session); the tremolo and the steered effects are the ENGINE's (`electronics/`, for
any piece); this piece holds its USES — the set's files, the settings, the four voices, their place in the score.*

## 2. Notate — `todo`

*To be laid out when we discuss it.* Piece 6's `docs/NOTATION_SCHEME.md` and its rules rows are the start (H6-37).

## 3. The performance score — `todo`

*To be laid out when we discuss it.* Waits on the Tempus septet's parts, his word 2026-10-20 (journal §7).

## 4. Submission — `todo`

*His. Anonymous: no name on the score, the recording or the file names; the record stays local (`docs/submission/`, gitignored).*
