# RUNNING LOG — the lab journal

> **Why this exists** (composer, 2026-09-03, said at the opening of piece 4 and standing
> since): *"I'd like to keep a running journal like lab notes, so I can look back on
> decisions or comments, theory, philosophy, etcetera, or how we actually made something —
> if I wanted to write a paper later about this. And I would expect the AI agent to do this
> automatically as a habit."*
>
> Rules (from `live-electronics-engine`, piece 4's D4, carried here): written **as the work
> happens**, at the end of any exchange that produced a decision, a result, a rejection, a
> measurement, or a theoretical point — never at session end. Each entry: what prompted
> it, in the composer's words; what was tried, in order; the numbers; what was rejected
> and why; what was decided and why that rather than the alternative. **Append-only;
> corrections are new entries.** Entries are numbered §N and never renumbered.
> Current state lives in `PROJECT_JOURNAL.md` §2 and `PLAN.md`; this is the trail.
>
> **It does not pause when the building stops and the WRITING starts** (composer, 2026-09-18):
> every compositional exchange that settles something goes here as it happens. The test:
> could someone write the paper "how this piece was written" from this log alone?
>
> **A `§N` in this file is THIS piece's.** Another piece's lab journal is cited as `#N §M`
> (`#6 §488` = `decibel_TENOR_2026/docs/RUNNING_LOG.md` §488). The pieces' numbers are HIS (2026-10-11): 6 = *Approaching*,
> 5 = *Recombination*, 4 = *Scattered Substance*.

---

# 2026-10-20 — session 1 (Claude Code, Fable)

## §1. The project opens

His first message in this repo, whole — the call's text he pasted with it is in `COMPOSITION_NOTES.md` ("The call, in one block"):

> *"i want to start a new piece for the switch ensemble this is for the overdrive festival info here: [the call, pasted whole]
> I developed a porting protocol somewhere in one of the last few pieces you can access them in local repos, 1-strqtr, 2-2pno2perc,
> 3-tuba, bloom-convergence-balance, 4-tempus scattared substance, 5-recombination lake george, 6-decibel, approaching, 7 synthesi-alpla;
> I think porting protocol is ok but might need some additional things, I think the last port left some things out, but I don't
> necessarily want to trouble shoot too much , lets aim towards getting the new piece started, this piece will have live electronics,
> and maybe video animatation see live electronics engine and synethesi alpha, maybe able to do quad diffusion, will write for flute,
> clarinet, alto sax, piano, perc, violin and cello. also some composition notes for this piece scattared about decibel, synethesi
> alpha/live elec system and maybe in lake george lets pull and organize those for me to see, but lets plan the port/start of new
> piece; lets do a thorough and competent job but efficient to get started asap, most things should be in place and shouldn't involve
> too much new build"*

**What was understood.** Three asks: (1) find the porting protocol and plan this piece's start by it — "the last port left some things
out" · (2) pull the composition notes for this piece out of the other repos and organize them · (3) the piece: seven players
(the call's core minus the doublings), live electronics, maybe video animation, maybe quad. His list of the pieces is his numbering
of 2026-10-11 (`#6 §430`), plus two that are not of the notated lineage — `bloom-convergence-balance` and *Sýnthesi Alpha*.

**What was found (the orientation, on Fable, one sitting — no journal existed here; the session skill's bootstrap deferred to the
protocol's 2.5):**

- **The protocol:** `composition-system/protocol/NEW_PIECE_PROTOCOL.md`, v1 (2026-10-03), ten containers in three layers. Its first
  run was piece 6's start (2026-10-04). **What "the last port left out":** piece 6's `docs/PROTOCOL_DEVIATIONS.md` holds ~25 dated
  lines of "for v2: …" that were never written back — 10.0 (the upkeep at the end of a start) was not run there. The lessons are
  real and written; only the write-back is missing. So this start runs BY those lines (the harvest's H6-1), and 10.0 here writes v2
  for both runs. Two one-time items of the protocol that piece 6 skipped now matter: the roles helper (3.10 — this piece has a
  piano) and the bundled font (3.9).
- **The engine:** `live-electronics-system`, a git subtree at `electronics/` in each piece (`docs/TAKE.md`, proven in piece 6); the
  stand-alone mirror in step with piece 6 (both at the commit of 2026-10-10). Not in the engine: quad output (`\leMaster` is stereo),
  the live graphics (part 12 `todo`), the electronics' notation kinds (part 7 `todo`).
- **The notes for this piece:** five in piece 5's sketch pad (LG-340 … 345, the brief for all three electronics pieces, 2026-10-03)
  · two said for this piece while writing piece 6 (the flute's partials, 2026-10-12, `#6 §483`; dense counterpoint / spectral
  chords, 2026-10-14 — both filed in `composition-planning-and-notes/docs/ideas/`) · one adjacent (piece 6's DEC-46, the parked
  performance architecture). Nothing in `synthesi-alpha`; nothing in `live-electronics-engine` (its "switch" hits are the verb).
  All gathered into `docs/COMPOSITION_NOTES.md` verbatim, with what already exists in the engine beside each — written FIRST, before
  the kit, at his ask "for me to see".
- **The libraries, from the record and the disk:** piece 4's flute is SI2 (UVI), its piano 8Dio + IRCAM Prepared Piano 2, its strings
  Xsample; the cello measured in piece 6. On this machine Xsample is the BASS CLARINET and the SOLO STRINGS only
  (`C:\Users\jwloy\Documents\Xsample Sample Library`); `IRCAM Solo Instruments 2.ufs` is installed WHOLE and holds a Clarinet in B♭
  and an Alto Saxophone in E♭ (its manual, piece 3's extracted copy, lines 1426 · 1429). His question — *"does clarinet exsist in
  current libraries? or alto sax ircam?"* — and the first answer (from the manuals: "both exist") was CORRECTED the same hour
  against the disk: the Xsample catalogue lists them, he does not own them; SI2 has both and is installed. Piece 2's piano record
  (harmonics · muted · plucked · prepared) he pointed to himself: *"piano also look at piece 2, extensive things in place"*.
- **The ports:** the lineage's next pair is 5600 / 5100; 5100 was piece 3's old score port — no `launch.json` binds it today
  (every repo's `launch.json` read: 3001 · 4700 · 4760 · 4800 · 4900 · 5000 · 5200 · 5210 · 5300 · 5301 · 5400 · 5401 · 5500 · 5501 ·
  8732 · 8733).
- **Piece 6's state:** his word, 2026-10-20: *"approaching is done and will submit when call opens"* — Draft 01 stands (six
  sections, 12:59), the film and the print approved; its tree holds one modified file of his, `bank/samples/index.json`.

## §2. His five calls, and the profile

Put to him in one block (the protocol's 2.1 … 2.3 and 4.0): **1** the profile — *"1a"*: copy-forward from piece 6 · both layers · the
scrolling score · the engine by subtree · the piano as a role, on. **2** the repo — *"2a"*: public; push after every commit. **3** the
names — *"3a"*: `switch` · `piece-switch` · `switch-2026` · `switch_rack` · 5600 / 5100 · `SW` · `SW-N`. **4** the harvest — explained
again in plain words at his ask (*"not sure what 4 is pls explain more simply, what is harvest and how does it impact this"*): one
short list of what the finished piece hands on; he reads once; "take now" becomes a step at the copy — then *"a for the harvest"*,
the full one. **5** the libraries — *"tbd"*; the clarinet and sax answered above (§1). Also said: *"fyi the performance scores are
being worked out now and tempus will be first to receive first set of performance scores ie parts"* — journal §7; the parked
performance architecture of piece 6 (DEC-46) waits on that.

**One correction of the AI's, for the record:** the first reply said piece 4's flute was Xsample; it is SI2 (UVI) — read from
`septet_2026/sandbox/instruments.js`'s header the same hour. The clarinet and the sax on SI2 are therefore a KNOWN family with a
known flute beside them, not new work; the UVI how-to is still unwritten (H6-24).

## §3. The harvest of piece 6 — run in its repo

Offered as its own session in `decibel_TENOR_2026`; he chose *"do it here"*. Run on Fable in this session, the working folder
switched to that repo: `decibel_TENOR_2026/docs/HARVEST.md`, 62 items `H6-1 … H6-62` — 43 take now · 8 later · 9 leave; the record
`#6 §488`; committed and pushed there (`74a3add`, then his read `9796edd`). **His read (1.3):** *"all as proposed, go ahead with
container 2"*. The six that weigh most are in `#6 §488`; the ones that change THIS start: H6-1 (run by the deviations register) ·
H6-7 (`tools/port/` is the template) · H6-9 (`electronics/` off the byte copy) · H6-13 · H6-14 (the piano role returns) · H6-22 (the
read-out per instrument before the rack is planned) · H6-24 (the UVI how-to).

## §4. Container 2 — the repo and its kit

Done in one sitting from this repo (the protocol's 2.1 … 2.6, through piece 6's deviations lines for 2.x):

- **2.1** the profile — CLAUDE.md and PLAN.md, in plain words (piece 6's lesson).
- **2.2** the repo existed already (`github.com/elosine/switch_2026`, PUBLIC, MIT LICENSE, an initial commit of two files); the push
  rule asked and answered — after every commit (D3). `.gitignore` carried from piece 6 with this repo's header; `docs/submission/`
  added, since the call is anonymous and the repo public. `.gitattributes` verbatim.
- **2.3** the names — the table in journal §1 (D4); `NAMING.md` §1 when it arrives with the code (H6-3).
- **2.4** the method docs carried whole from piece 6 @ `9796edd`, one provenance line each: AI_METHODOLOGY · SESSION_HYGIENE ·
  PLANNING_METHOD · HOW_WE_WORK · SESSION_PROTOCOL · MORPH_NOTES (162 KB, whole — piece 6 added nothing to it) · DYNAMICS_LAW ·
  VERIFICATION_RECIPE (its names re-pointed at 3.3 — NITS) · the checkpoint and postclear commands. Each file's own line endings kept.
- **2.5** the record docs from `composition-system/skeletons/` (made 2026-10-03), every `‹…›` replaced or left honestly: CLAUDE.md —
  **checked heading by heading against piece 6's** (principle 19): carried — READ FIRST (+ "how to put things to him") · Orient ·
  the lab journal (+ the composing extension, + the engine's log beside it) · the morph notes · THE SORTING · THE RHYTHM (+ the refined
  and the stronger forms, D13) · Apps · Reference repos (+ LINEAGE FIRST) · Git; NOT carried — THE PAPER (piece 6's own) and its
  state-line history (H6-4: the state line is ONE line here). README · PROJECT_JOURNAL (seven sections; §3's principles 1 … 33
  carried one line each — 24 … 33 are piece 6's own, new since the skeleton) · PLAN (§ 0 = the protocol, with the harvest's items by
  container) · PLANNER · RUNNING_LOG (this file) · COMPOSITION_NOTES (§1, gathered first) · NITS · SWEEP_LIST · PERFORMANCE_NOTES ·
  PROTOCOL_DEVIATIONS (opened with this start's first lines).
- **2.6** outside the repo: NO `<prev>-<port>` launch entry — the protocol's wording is "for the unfinished previous piece" and piece 6
  is finished (his word); `decibel-5500` at his word only. The planning repo (`composition-planning-and-notes`): not touched — 2.6
  says "at his word"; the piece is already on its `next.md` (December 1) and in `db/opportunities.yaml` (opp-0053).
- **H6-2** piece 6's AI memory notes (21 feedback notes, all newer than the move to his user-level CLAUDE.md on 2026-10-03) copied
  whole into this repo's memory folder, with their index — the protocol's 2.8 lesson applied as a copy, not a read.

**Deviations from the protocol as written, each a line in `docs/PROTOCOL_DEVIATIONS.md`:** the sketch pad before the kit · the harvest
run from the next piece's session with "do it here" · the harvest's IDs `H6-N` · a harvest of a piece that is done but not closed (its
own 10.1 and the backlog refresh wait for its close) · DYNAMICS_LAW and VERIFICATION_RECIPE carried in the KIT (the protocol lists them
with the code, 3.1 · 3.6 — piece 6 kept them in `docs/`, and H-1 made the recipe a doc) · no `<prev>` launch entry · the memory notes
copied whole.

**Not claimed:** nothing runs; nothing of the stack is here. **Next:** container 3 on Opus (journal §2's step, written to be run cold).

## §5. Container 3 opened — his word, and the survey (3.0)

**His word** (2026-10-20, after container 2's report had set the switch point at Opus): *"go ahead all here no need for clear and model
switch"*. Container 3 run on Fable, in this session, from journal §2's written step — the protocol's 3.0 … 3.6 as amended by piece 6's
deviations register and the harvest's H6-7 … H6-20.

**The survey (3.0).** The source: piece 6 *Approaching*, `decibel_TENOR_2026` @ **`9796edd`** — 749 tracked files, 49.3 MB; its working
tree holds one modified file of his (`bank/samples/index.json`), so every file is taken from the COMMIT. `tools/port/classify.js` (piece
6's, re-pointed): **COPY 462 files, 10.9 MB · LEAVE 287 files, 39.5 MB.** What differs from piece 6's run: `electronics/` (67 files) LEFT —
the engine comes by subtree (H6-9) · the piece's electronics data left (the bank, the backup, the dealt presets, the sections' banks); the
two files the stack reads at start / at load stay ON the copy and are skeletoned at 3.4 — `bank/elec_route.json` (`score/server.js`
requires it at line 20) and `bank/presets.json` (the page reads it at F5) — found by H6-8's grep of every leave-list path against the
engine · piece 6's `tools/port/` left (this repo has its own) · the three design studies' pages and tools CARRIED as code
(`score/public/{signs,language,palette}/`, `tools/{signs,language,palette}/`), their data (`bank/signs` · `bank/language` · `bank/palette`)
left · the Kontakt preset array of the bass flute left · DYNAMICS_LAW and VERIFICATION_RECIPE left (in the kit, 2.4). 355 paths are NEW
since piece 6's own port (its electronics' tools and the engine); 14 are GONE (the twelve piece-5 checks it retired, two fixtures).
**The coupling:** kind A the composer page (six lanes → eight) · kind B the per-instrument tables, the same ten sites piece 6 turned plus
the new `sine_go.js` · `three_body_*.js` readers of `bank/sine_behaviours.json` · kind C THE PIANO ROLE: thirty-three `instKey ===
'piano'` sites in twelve modules — every one reads TRACKS, so with the piano in TRACKS they are live; the three lane-number FALLBACKS
(`cue_picker.js` · `piano_cues.js` · `piano_harmonics.js`: `pianoLane 2, metaLayer 7`) are the ones to set. The lane count changes
(6 → 8): the literal lane lists piece 6 found at its 3.5 are already by TRACKS. Ports in use on this machine read from every
`launch.json` — 5600 / 5100 are free.

**The lanes (D7, the AI's call, his to reverse):** EIGHT — flute · clarinet · alto sax · percussion · vibraphone · piano · violin ·
cello, orchestral score order (winds · percussion · keyboard · strings); the percussionist on TWO lanes as in piece 6, the pitched
lane being the call's vibraphone (and the glockenspiel beside it, container 4's question); the key `bowed_vibraphone` kept (NAMING § 1).
Rejected: one percussion lane — cutting the pitched lane would cut the tools built on its key (the strip's pitch tool, the texture
panel, the beating tool), and the call's list has two mallet instruments. META = 8; the curve windows 9 / 10 / 11 over piano · violin ·
cello; `layoutVersion` 9.

## §6. The copy (3.1) and the proof (3.2)

**3.1** `tools/port/copy31.sh`: every path from `git show 9796edd:path`; the proof the BLOB HASH of each copied file against the source
commit's `ls-tree` — **462 / 462 identical**. Committed as one commit (`1395bcf`), `npm install` after it (one dependency, resvg; the
lock file unchanged). **3.2** `tools/port/stage32.sh` (piece 6's, re-pointed): 161 paths staged from the sources' HEADs by a list
written first — piece 3's tuba pages and nine scores (the tuba-page batteries' fixtures are hashes of them), piece 4's four septet pages
and their scores, piece 6's own data from this run's leave list, its engine index too; a tracked path is never staged over. `tools/port/
run_batteries.sh old`: **45 commands — 30 green, 15 red, none a copy defect.** The classes, into NITS as the table: GREEN 30 (the
notation batteries on the staged tuba pages · the written-pitch control · `palette_check` 151 and `roster_check` 310 on the OLD
palette · the five print and screen gates on piece 6's official page `approaching` · the three cresc checks · the IR battery · the
model bank · beating_check · drone_check …) · RED, bound to piece 5's pages or scores, RETIRED at the fixes commit: `eh_figure_check` ·
`sequence_notation_check` · `vib_marks_check` (piece 5's locks and protos, red in piece 6 too) · RED, bound to piece 4's or 6's data,
KEPT and re-pointed when the tool is used here: `test_surge_run` (reads piece 4's `piece-septet` page: 65 of 78 curves) ·
`sequence_check` (piece 5's `reference_chords.json`, in no one's git) · `vibes_pitch_check` (12 of 65: piece 5's instruments) ·
`three_body_check` (piece 6's bank on disk) · `sine_check` (piece 6's four bending lanes) · `strike_check` (piece 6's catalogue
`strike_responses.json`) · `check_rules` 30 of 32 (rule 8 wants a sequence page — H6-60; one more read at 6) · `dyn_table_check` 1
failed by design — the UVI assertion, H6-30 · RED until container 5: the four python self-tests (their schedules are a probe's dry
run, never in git). The staged 161 deleted exactly by the list after 3.4's dry run; `git status` clean.

## §7. The fixes commit, and the re-palette (3.3)

**The fixes** (`b554f90`, between prove and re-palette as piece 6's v2 says): seven piece-5-bound tools retired — the three lock checks
above and four generators of piece 5's cast (`build_lgmf_ref` · `build_lgmf_transitions` · `build_transition_models` ·
`build_reference_chords`); `reextract.js`'s mention of `eh_figure_check` is a comment. KEPT: `build_1b5_score.js` (`build_first_sound.js`
requires it) · `probes/analyze_lgmf_balance.py` (`balance_run.ps1` names it). **THE ROLES HELPER (3.10, H6-14) — NOT BUILT, AND SAID
WHY:** every piano-role site already finds the lane by `TRACKS.findIndex(t => t.instKey === 'piano')` — the role IS that one lookup, in
the page's `cueLane()` and the modules' own; a helper function would be a refactor with no change of behaviour, and his rule is no work
not asked for. The profile's roles line names the mechanism; the three fallbacks are set by kind C. A deviation line.
**The re-palette** (`59afee9`): `tools/port/repalette33.js` — **102 files, 200 edits, every match count asserted** before a byte was
written (it refused once: the rhythm sequencer's pair map occurs twice). Kind A: the title · the lane CSS (eight rules at 12.5 %) · the
curve windows' CSS (62.5 / 75 / 87.5 %) · the eight lane `<div>`s · the track `<select>` (nine options, META 8) · the curve buttons' titles
· TRACKS · META_LAYER 8 · CURVE_LAYERS 9 / 10 / 11 · CURVE_OVER 5 / 6 / 7 · `layoutVersion` 9 · the session default `switch` (five
sites + the input) · the abbreviation map. Kind B: `beating_calc` ORDER and CEILINGS (flute 10 s · clarinet 15 · sax 15 · violin 12 ·
cello 15 — PROVISIONAL) · the three colour tables (winds gold and rose · the piano piece 4's · the strings green) · STRIKE_DEFAULT and
the three ART_SETS · OPEN_STRINGS (violin · cello) · the trill STAND_IN · the alias table · ART_DEFAULT · the rhythm pairs. Kind C: the
three fallbacks → `pianoLane 5, metaLayer 8`. The ports: `score/server.js` 5500 → 5600 (6) · `sandbox/serve.js` 5000 → 5100 (2) · the
three launchers · `launch.json` whole (`score` 5600 · `sandbox` 5100 · `score-5601`) · `package.json` · the lock · the guard
`decibel_rack` → `switch_rack` (8 files) · 5500 → 5600 in 26 tools (defaults and `--port` comments) · the storage keys `switch.*` (6) ·
`piece-decibel` → `piece-switch` (21 files, 44 sites) · `piece: 'switch'` (12) · THE SOURCE'S FOLDER PATH in twelve bridge and Kontakt
jobs (H6-15) · the percussion's default port `SWPerc` (apply_perc · palette_check). **The straggler audit** (`stragglers33.js`, 5 files, 9
edits): the two builders' default outputs `switch-first-*` · `check_ceilings`'s filter `^switch-` · elec.js's scratch names · the
ordinario set's pitched key `crot_main_metal` (the carried Ricotti lane's ordinary). Left, as provenance or NITS: every comment citing
piece 6's §s · the two tooltips naming piece 5's ceilings · `cresc_run.js`'s `septet.*` keys · `panic.ps1`'s piece-4 ports · the bridge's
and the Ricotti loaders' `DEC…` ports (container 4) · `print/score/build.sh`'s title line (8). `node --check` on 102 files: 0 failures.

## §8. Recipes and skeleton banks (3.4)

`tools/port/recipes34.js` (piece 6's, re-pointed; every anchor asserted; the rebuilt file EVALUATED to the eight keys in TRACKS order):
`sandbox/instruments.js` rebuilt — CARRIED verbatim: percussion (piece 6's eight Abbey Road, 29 voices) · the pitched lane (piece 6's
Ricotti mallets, 39 voices — THE STAND-IN for the vibraphone; its label now "Vibraphone", its key `bowed_vibraphone`) · the cello (88
voices, piece 5's measurements); PLACEHOLDERS: flute · clarinet · alto_sax (SI2 on UVI — two voices each, `ord` · `staccato`, the ranges
the instruments' compasses, unread) · piano (`main`, struck, no bend, not a beating partner) · violin (the strings' roster by the cello's
mechanism, 88 voices, none of the cello's measurements). Piece 6's bass flute, bass clarinet and viola GONE (H6-16). The ports `SW…`
(55 renames, counted; no `DEC` left). The banks: `velocity_remap` (the cello's row only; piece 6's three dropped) · `sample_lengths` (the
cello's, as it stood) · `perc_selection` (piece 6's eight on `SWPerc`, provisional — the call's list at 4) · `scattered_strikes` EMPTIED
(piece 6's sixty strikes stayed) · `sine_behaviours` (the vibraphone's and the cello's rows) · `elec_route.json` REWRITTEN (seven players
— fl · cl · sax · perc with its twelve tracks and five ports · pno · vn · vc; engineIn 1 2 4 5 6 7 8, the loop on 3; every track and
port the SHAPE) · `bank/samples/index.json` EMPTY (piece 6's 1701 rows stayed) · `candidates.json` EMPTY · `presets.json` carried whole
with a provenance line. `palette_check` refused twice (a trailing comment on a table row defeats its reader — the comments moved
above the rows) → **PALETTE GREEN 202 · ROSTER GREEN 251 voices, 18 pending.** Committed `851a385`.

## §9. The engine's take, and the app verified (3.5)

**The take** (`electronics/docs/TAKE.md` step 1, as proven in piece 6): `git remote add engine …` · `git subtree add --prefix=electronics
engine main` → `8c4baff`, 67 files, the mirror's HEAD `a11b387` — the same commit piece 6's `electronics/` stands at, so nothing is owed
either way. The seams were already in the copied stack (server.js's relay, the composer page's six tags and two hook lines, the route
table): the take needed nothing applied. Its page tests here: `page_test` PASS · `sine_page_test` PASS · `osc.js selftest` pass. Done
BEFORE 3.5 because `score/server.js` requires `../electronics/tools/relay.js` at start — without the engine the server does not boot.

**3.5, on the throwaway `score-5601`** (`docs/VERIFICATION_RECIPE.md`'s stubs first — autosave off, confirm stubbed, non-GET fetch
blocked but `/api/elec`): the page boots — `Composer` present · TRACKS the eight ids · META_LAYER 8 · CURVE_LAYERS 9 / 10 / 11 · eight
`.lane` divs + META + A / B / C · the session `switch` · the title. **The route battery:** 97 fetches (every `<script src>`, the
stylesheets, 26 api and bank routes) — **96 × 200; one 404, `/api/instructions`** (the notes page, container 8). The console at load:
**one 404 — `/bank/strike_responses.json`**, the strike window module's catalogue (`le_strike.js` l. 172 reads it at load, its own numbers
the fallback; piece 6's file is on the leave list) — NITS, this piece's catalogue at its strike section. `laneCanPlay` on all eight: inside
true, below and above false. The recipes the page sees: the eight keys. **THE PIANO ROLE, CLICKED:** `cueOpts()` → `pianoLane 5 ·
metaLayer 8`; CuePicker, PianoCues and PianoHarmonics loaded; the Panels ▾ menu's eight entries (Strikes · Sequence · Rhythm · Beating ·
Morph · Texture · Pulse · Multitempo) and the Insert ▾ menu's ten opened in turn — **zero errors** (the pane's one `prompt() is not
supported` is the pane's limit, from "Name version…"). **THE ENSEMBLE WARN, WITH A CONTROL:** a save with piece 6's six track ids →
`restoreData` warns `THIS SAVE WAS WRITTEN FOR A DIFFERENT ENSEMBLE — its tracks are [bass_flute, …]`; this piece's own shape → no warn.
**THE SAVE ROUND TRIP:** `POST /api/composer/save` `zz-ai-port` → 200, the file seen (281 bytes) → `GET load` 200, layoutVersion 9, the
eight tracks → `GET list` names it → deleted; `git status` clean. One thing only running found: **the server does not create `scores/`**
— with the folder gone a save is a 500 (`ENOENT`); piece 6 always had the folder. Made, and the day-one stub WRITTEN BY THE APP: the page's
own File ▾ → Save with the session default on the throwaway — `scores/switch.json` (803 bytes, layoutVersion 9, the eight tracks, no
objects). **The sandbox** on 5100: 200, its page and its menus. Viewport reset, the throwaway stopped.

## §10. The record (3.6), and where container 3 ends

NAMING.md § 1 this piece's · VERIFICATION_RECIPE re-pointed (`score-5601` · `switch.*`) · NITS: the batteries' table and this port's
own · CLAUDE.md's state line and § Apps · PLAN § 0 (container 3 `done`, 0.3 the survey) · journal §2 · the deviations register (five
lines). **Container 3 is done:** the app opens and saves on its own ports, every panel clean; the batteries' table has no unexplained
red; the engine seated. Nothing sounds (4 · 5); nothing notates this ensemble (6). **Next: container 4** — 4.0 the read-out per
instrument (H6-22) with him, then the ports by the AI, the tracks cloned, his loads of the clarinet and the sax on SI2, the UVI how-to
(H6-24), the first sound.

## §11. A composition note — SW-1, the tremolo experiment (2026-10-20)

His first note made IN this repo, right after container 3 closed — taken verbatim into `docs/COMPOSITION_NOTES.md` as **SW-1** with the
AI's reading marked: his performance-controlled electronics (the workshop's performance analysis) applied to ONE simple parameter,
tremolo — its volume and its speed, shifting speeds — to get a human, performed tremolo ("arcs and waves"); continuous beds from it,
one thought his slowed improvisations stacked; the principle: simple parameter, the complexity in the analysis (granular had many
parameters). Nothing planned; PLANNER's outline takes it as a third heading. No RUNNING_LOG reasoning yet — a note.

## §12. Container 4 opens — his two answers (2026-10-20)

Put to him after container 3: (1) the clarinet and the alto sax — *"1a"*, SI2 on UVI. (2) the pitched percussion lane — he asked first
how the composer score did it in the last two pieces; told: piece 5 gave the bowed vibraphone (Xsample Mallets Vibraphone, bought for it)
its own lane beside an Abbey Road percussion lane; piece 6 gave the percussionist two lanes, the pitched one holding all four Ricotti
mallets. Then *"So is that then a pitched lane and then a non-pitched lane?"* — yes. His word: *"I haven't decided what percussion
instruments I use. So let's have a pitched lane and a non-pitched lane. And … the pitch lane could have any of the pitch instruments,
like marimba, vibraphone, Glock, or crotales."* → D10: two lanes as copied; the pitched lane's roster = the Ricotti four (carried) + the
Xsample vibraphone (piece 5's, at container 4); the selection the music's. Told him the call's list names only the vibraphone and the
glockenspiel among them. **Next: 4.0 the read-out per instrument (H6-22), on his word.**

## §13. Container 4 — 4.0 THE READ-OUT PER INSTRUMENT (2026-10-20, Fable; his "go")

The hole piece 6 named ("what got brought over and where to look", its deviations §37; the harvest's H6-22), filled BEFORE any plan:
`docs/INSTRUMENTS_READOUT.md` — one row per instrument: the library (D10 · 1a) · carried from which piece · the round robin · the
volume · the dynamics curve · the ranges · the bend — each DONE / NOT, with the file. Read from the record only (pieces 4 · 5 · 6's
recipes, banks, RACK_SETTINGS, lab journals), one looked-up fact each, no search. **What it showed:** two methods of volume in the
record (piece 4 relative — retired; 5 and 6 absolute) · three instruments NEW to any rack (clarinet · sax · the vibraphone struck) ·
three of a known library never measured absolutely (flute · piano · violin — piece 4's) · two carried measured (the cello verbatim;
the Ricotti four on one patch each) · every unpitched instrument of the call's list is in the Abbey Road catalog · the UVI method's
record is piece 5's (§20 … §23 · §56 · §85, RACK_SETTINGS § 1 — the "Dynamic Amount" trap), not piece 4's as first thought; the
how-to `uvi.md` is owed before the two SI2 loads (H6-24). The ports: twelve (thirteen with the flute's `b`), the `SW` set.
**Next, on his word: 4.1 the ports by the AI, then 4.2 the tracks cloned from the three racks on disk.**

## §14. 4.1 — the thirteen ports, made by the AI (2026-10-20; his "a", Reaper closed)

As piece 6 did it (`#6 §19`; the how-to `rack.md` § 1), but through PowerShell natively — Git Bash turns `HKCU\…` and `/v` into paths
(the first try did nothing: "Invalid syntax" thirteen times, the registry untouched, a lesson for the how-to). Reaper was not running
(checked). The key exported first — `reaper/loopmidi_ports_before_SW_2026-10-20.reg` (59 values: piece 2's `Perc1-A …`, piece 3's
`tuba…`, piece 4's bare names, piece 5's `LG…`, piece 6's `DEC…`) · loopMIDI stopped (`Stop-Process`, pid 12052) · thirteen DWORD values
added: `SWFlute` · `SWFluteb` · `SWClar` · `SWSax` · `SWPerc` · `SWVibes` · `SWCrotales` · `SWGlock` · `SWXylo` · `SWMarimba` · `SWPiano` ·
`SWViolin` · `SWCello` (72 values now) · loopMIDI started again (pid 43300, 21:32:50). **The verification tool:** `probes/list_midi_ports.ps1`
(winmm, in and out, by name — new, 2026-10-20). At 21:34 and 21:36: the 59 old ports back in both directions; the thirteen new ones
NOT YET shown — piece 6 waited "about two minutes" for nine. Same Windows session for my shell, loopMIDI and the desktop (1). Waiting.

## §15. 4.2 — the rack as text, from the three racks on disk (2026-10-20)

`tools/build_rack.js` (piece 6's, re-pointed: three sources — piece 4 `septet_rack.rpp` saved 2026-09-17 · piece 5 `LGMF_rack.rpp` saved
2026-10-01 · piece 6 `decibel_rack.rpp` saved 2026-10-11 — the DISK files, as piece 6 chose at its §20: the last state each piece was
finished on; git may be older) → `reaper/switch_rack.rpp`: the header from piece 6, **23 tracks, 133 524 lines, 17.5 MB, every plugin
state carried byte-exact (a hash before and after each clone).** Score order: `Flute SI2` · `Fluteb SI2` (piece 4) · `Clarinet SI2` ·
`Alto Sax SI2` (BARE — his loads) · the eight Abbey Road (piece 6, PROVISIONAL — D10) · `Vibraphone XS` (piece 5, 7927 lines — the
four slots of preset 13) · the four Ricotti (piece 6) · the piano's four (piece 4: `Piano Kontakt` · `PianoPlucked Kontakt` ·
`PianoHarm PP2` · `PianoMute PP2`) · `Violin XS` (piece 4's `Vn1 XS`) · `Cello XS` (piece 6). Not carried: piece 4's `Flute strikes` and
`BassCl strikes` buses (NITS), piece 6's `ELEC RETURN` (the engine's route step makes it, `tools/elec.js route`). On every cloned track
three lines rewritten — NAME · the fader to 0 dB · the input to none; the bridge job sets inputs BY PORT NAME: `make_tracks.lua`'s SPEC
is this piece's (fifteen rows, `SW…` ports, the sampler per track — KONTAKT or UVI), `make_perc_tracks.lua` on `SWPerc` after the winds.
**What waits on him (4.3):** open Reaper on `reaper/switch_rack.rpp` · Preferences → MIDI Inputs → enable the thirteen `SW` ports
(unreachable by script) · then the bridge jobs run; then the clarinet's and the sax's presets in UVI's browser.

**— §14, later: ALL THIRTEEN SHOWN at 21:37:46** — in and out, by name (`probes/list_midi_ports.ps1 -Prefix SW`): about five minutes
after loopMIDI's restart for thirteen new names (piece 6: two minutes for nine). For the how-to: "up to five minutes; the old names
come back in seconds — a list that shows the old and not the new is not a failure yet." 4.1 done.

## §16. 4.2 — the tracks given their inputs by the bridge; the UVI how-to written (2026-10-20; his "done" after the Preferences step)

The bridge alive on `reaper/switch_rack.rpp` (23 tracks, Reaper 7.82). **`make_tracks.lua`** (this piece's SPEC, fifteen rows): every
row read back — input = its `SW` port by name (devices 66 … 78), armed, monitoring on, 0 dB, the sampler present; the two bare tracks
(`Clarinet SI2` · `Alto Sax SI2`) got an EMPTY `VST3i: UVIWorkstation (UVI)` inserted; piece 4's two flute instances carry the VST2
`VSTi: UVIWorkstation` (as cloned — fine). **`make_perc_tracks.lua`** read the eight Abbey Road tracks back and, by its rule, touched
none — they had NO input (a cloned track's REC is rewritten to none by `build_rack.js`). **New job `perc_inputs.lua`** (the one thing:
`SWPerc` on ITS channel 1 … 8, armed, monitoring; idempotent) — all eight `ok true`. The rack is whole: 23 tracks, every one on its
port. **Reaper had the thirteen `SW` ports enabled by his Preferences step** (his "done"). NOT SAVED by the AI — the rack file is his
to save from Reaper; until then `reaper/switch_rack.rpp` is the text as built. **The UVI how-to** (H6-24): written into the home,
`composition-system/protocol/howto/uvi.md` — from piece 5's §20 … §23 · §56 · §85 and RACK_SETTINGS § 1, and piece 4's flute: the
parts, the `b` instance, "a preset must be loaded once in the GUI — then everything is text", the 496-byte header, the Dynamic Amount
dial at 1.00 on the main part AND the curve copies, the masters at −6 dB, the order at a new piece. **Next: his two loads (4.3).**

## §17. 4.3 — his loads, and the sax needs a second instance (2026-10-20)

His four screenshots: the clarinet's instance holds **13 presets** (A1 Ordinario · Aeolian & Ordinario · Cresc & Decrescendo KS ·
Durations KS · Flatterzunge · Fortepiano · Glissando Menu · Key Click · Multiphonics Menu · Quartertones Ordinario · Sforzando ·
Staccato · Trills KS); the sax's holds **16** (Ordinario · Aeolian · Backwards · Bisbigliando · Blow Without Reed · Chromatic Scale ·
Cresc & Decrescendo KS · Double Tonguing · FX KS · Finger Modes KS · Flatterzunge · Fortepiano · Glissando Menu KS · Key Click ·
Moving Bell · Multiphonics Menu) — **full**; his word: *"need another sax track"*. Read back through the bridge before anything
(`uvi_state.js info`, both instances: the 496-byte header, every part named — the text path proven on this UVI). The rule from the
how-to (§ 1): more than 16 presets → a `b` instance on a `b` port; the clarinet's 13 + its three Ordinario curve copies = 16, one
instance. **The port:** he saved the rack (22:02:01, 17.7 MB — HIS file from here) and closed Reaper at my ask (a loopMIDI restart under
a running Reaper was not tried); loopMIDI stopped, `SWSaxb` added (74th value; 14 `SW`), loopMIDI started 22:02:35. `make_tracks.lua`
gained the row `Alto Sax SI2 b` (`after = "Alto Sax SI2"`). **Next:** the port shown → he reopens the rack, enables `SWSaxb` in
Preferences → the job makes the track → his loads of the remaining sax presets into it, Ordinario's copies come as text.

**— §17, later (22:10): `SWSaxb` SHOWN the moment Reaper opened** — six minutes of polling without it, then there as he opened the rack and
his Preferences step enabled it. For the how-to: the new names appear when a MIDI client (Reaper) enumerates, not on a clock; open
Reaper after the restart. `make_tracks.lua` re-run: the fifteen rows `kept` (idempotent, nothing duplicated), **`Alto Sax SI2 b` MADE** —
track 5, right after its sibling, input `SWSaxb` (device 79), armed, monitoring, an empty UVI inserted. 24 tracks. His loads of the
remaining sax presets go into it.

## §18. 4.4 · 4.5 — the state as text, and the SI2 recipes derived (2026-10-20 … 21)

**His loads read back** (`uvi_state.js info`, the 496-byte header on this UVI): the clarinet 13 parts, the sax 16 + 6. **The Dynamic
Amount was factory on every part** (0.70, with strays: 0.40 · 0.50 · 0.86 · 0.00 on the sax's Backwards) — set AS TEXT, not by hand:
a new tool `tools/uvi_dynamic.js` (the attribute once per part, asserted) → 1.00 on the parts the piece plays — the clarinet's part 1
and its copies, the sax's part 1 and its copies — the others left factory, as piece 5 did (its RACK_SETTINGS § 1). **The baseline**
(`uvi_edit.js baseline`: every part +6 dB, the inserts bypassed but the convolver — his rule of 2026-09-17) on all three instances.
**The curve copies:** `uvi_edit.js clone` — the clarinet's Ordinario into its parts 14 · 15 · 16 (126 sample players each, read back);
the sax's Ordinario FROM the first instance INTO the second's parts 14 · 15 · 16 — THE FIRST CROSS-INSTANCE CLONE, proven (141 players
each, Dynamic 1.00, +6 dB); cloned before the baseline the first time, so their inserts were open — baselined again, pushed again,
read back bypassed. Each push read back (`xml identical = false` after a push is UVI's own re-serialization; the CONTENT is the proof).
**A bug found and fixed in `uvi_state.js info`:** an EMPTY part followed by a loaded one read the NEXT part's program (parts 7 … 13 of
the second sax instance showed "Ordinario") — the read is now bounded to the part's own block; piece 5 and 6 never had an empty part
between loaded ones. **The recipes (4.5):** `tools/port/recipes44.js` — the flute's thirty rows piece 4's (the presets its two cloned
instances hold; the ports this piece's; its "Flute strikes" lane dropped; kind and loud added, the multiphonics by key) · the
clarinet's 17 and the sax's 32 written from his loads and the manual's keyswitch pages (C1 = 36 — VERIFY on the red keys) ·
`apply_uvi_parts.js` (its TRACKS table this piece's three instruments) derived every part from the RUNNING RACK into `UVI_PARTS`:
flute main ch 12, curve `SWFluteb` 4 · 5 · 6 (piece 4's layout, intact in the clone) · clarinet main 1, curve 14 · 15 · 16 · sax main 1,
curve `SWSaxb` 14 · 15 · 16. **`palette_check` 202 green · `roster_check` green** (26 by-key voices pending: their keys from his rack
at 1m.4.2; 14 recipe keys not yet in `techniques.json` — registered as material uses them, H6-38). **The rack is HIS** (saved 22:02;
the pushes live in Reaper's project — he saves again). NOT CLAIMED: a sound. **Next: 4.6 the first sound, in his Chrome.**

## §19. 4.6 — "no sound": loopMIDI had died with the AI's shell; the rack SOUNDS from a direct note (2026-10-23)

**What prompted it.** His *"no sound"* on `switch-first-sound` (built by `tools/build_first_sound.js`, re-pointed: 18 notes, 46 s, every
track in lane order). His screen first (the bar: the score open, nothing about MIDI). Then from here: the score server up (5600, 200),
the bridge alive (24 tracks) — the break between the page and Reaper. **THE CAUSE:** `elec.js meters` said `port not live: SWFlute`;
`probes/list_midi_ports.ps1`: NO loopMIDI port at all — only the UMC1820 — and **loopMIDI was not running** (registry intact, 14 `SW`
of 73). It had been started 2026-10-20 22:02 by `Start-Process` from the AI's PowerShell; when that Claude Code process ended (the
session restart) its children went with it — the background task of the first hour was reported "stopped" the same way. Reaper
(up since 22:09) had kept stale device handles. **The cure:** loopMIDI started DETACHED (through `explorer.exe`, pid 51100, 06:56:57);
all fourteen `SW` ports back within a minute (Reaper running — the enumerating client) · `make_tracks.lua` + `perc_inputs.lua` re-run
(16 + 8 inputs by name, idempotent) · a first note still silent (−150 dB) · **`reaper.midi_reinit()`** through a new bridge job
`reaper/bridge/jobs/midi_reinit.lua` (close and re-open every MIDI device; Reaper then lists the fourteen `SW` inputs) · a clarinet
note straight to `SWClar` ch 1 (`note_to_port.ps1`, winmm) while `elec.js meters` read the rack: **Clarinet SI2 −2.75 / −2.48 dB ·
Flute SI2 −3.99 / −5.46 (the tool's own note, its ch 1 = Aeolian KS) · MASTER +0.75 / +0.16 dB.** THE RACK SOUNDS from a direct note.
**Two things for the record:** the master OVER 0 dBFS on two notes — the new SI2 instances carry the baseline's +6 dB parts and no
−6 dB master yet (the how-to's § 5; container 5's pre-flight) · the page's Web MIDI enumerated while loopMIDI was dead — his Chrome tab
needs F5 before its notes can reach the ports. **For the how-to (`rack.md` § 1):** loopMIDI must be started by HIM or detached
(`explorer.exe <exe>`) — a process the AI's shell spawns dies with the session; after a loopMIDI restart under a running Reaper,
`midi_reinit.lua`. **His word meanwhile:** *"can you give me the server cmds I'll start myself"* — given. NOT CLAIMED: a note from the
app (his F5 and ▶).

## §20. 4.6 THE FIRST SOUND — "all lanes play"; CONTAINER 4 DONE (2026-10-23)

His word, after the cure of §19, his F5 and ▶ on `switch-first-sound` in his Chrome: *"sound now, all lanes play"* — the eighteen notes,
flute · clarinet · alto sax · the eight Abbey Road · the four Ricotti · piano · violin · cello, from the composer score through their own
ports. Between §19 and it: **Realphones** — at his ask (*"Can you remove real phones from the master output bus, or tell me how to do
it?"*): it was NOT on the master track (0 FX there) but in Reaper's MONITORING FX chain (piece 6's journal had placed it there,
2026-10-14); read and bypassed by a new bridge job `monitor_fx.lua` (`TrackFX_GetRecCount` on the master, index 0x1000000 + i).
A first run did nothing: the name to bypass was passed as an environment variable, which a Lua inside Reaper never sees — set in the
job itself, it read back `was true → now false`. **Container 4 is done** for a composing start: fourteen ports · 24 tracks on them ·
the two new SI2 instruments loaded by him and set as text · the recipes derived from the rack · the first sound heard by him.
`docs/RACK_SETTINGS.md` § 0 is this rack's. **Open, carried to container 5:** the SI2 masters at −6 dB (the pre-flight) · the flute's
Dynamic Amount read · the Xsample vibraphone has no technique in the recipe yet (the pitched lane's roster is the Ricotti stand-in) ·
the keyswitch notes of the clarinet and sax, unverified · his save of the rack (the pushed states live in Reaper until CTRL+S).

## §21. Container 5 — the pre-flight (2026-10-23, Opus; his "go")

The how-to `measuring.md` and piece 6's §40 … §43 read first. **Done, as text or through the bridge, nothing by his hands:**
- **The SI2 masters −6 dB** (`uvi_state.js set-master … --push`, piece 5's §52 way) on `Clarinet SI2` · `Alto Sax SI2` · `Alto Sax SI2 b`,
  each read back −6. The flute's two instances read **−2 dB**, piece 4's own fix of its clip ("#5's flute, UVI master −2 dB" in
  `clip_preflight.ps1`'s header) — kept, carried. The two Prepared Piano 2 instances read 0 dB — the pre-flight will say.
- **The flute's Dynamic Amount read: 0.80** on its Ordinario part and the three copies — piece 4's hand value, kept (the 1.00 rule is
  piece 5's; the card measures the flute as it is).
- **THE CARRIED TRIMS back on the faders** (§0 of the how-to: a clone keeps its measurement): from piece 6's `reaper/bridge/jobs/
  apply_trims.lua` (its final faders, his +12 lift on the cello included) — Cello XS +8.13 · Wood Blocks +7.05 · Bass Drum Alt −4.29 ·
  Crotales −7.18 · Glockenspiel −7.21 · Xylophone −5.65 · Marimba +9.27 · Bongos +4.35 · Shime Daiko +4.92 · China −3.99 · Spring Coil
  +6.87 · Suspended +7.53 · Toms −2.99; and piece 5's vibraphone +2.81 (its trims.json; the same −31.84 per-voice target). Read back.
- **A FAULT OF THIS PORT, FOUND IN THE READ-BACK:** the two flute tracks held TWO UVI plugins — piece 4's cloned VST2 instance and an
  EMPTY VST3 one that `make_tracks.lua` inserted on 2026-10-20 (its SPEC named only the VST3 plugin, so the VST2 did not count as "the
  sampler"). Removed by a bridge job (`remove_dup_uvi.lua`); `make_tracks.lua`'s UVI names now include the VST2. Silent, but a second
  instance on every flute note's path, and a trap for the next re-run.
- **The card's timetable** (`tools/card_schedule.js`, re-pointed by `tools/port/card55.js`): **79 notes, 9:02** — MEASURED: flute ·
  clarinet · alto sax · violin (held: curve channel A with CC7 127, three pitches × 24 · 64 · 100 · 127, a half-bend note — the SI2
  copies on their `b` port where they sit, a fix to the tool: curve A may be `{port, ch}`) · the piano (struck, own channel, no CC7,
  four velocities, a 5 s tail); CROSS-CHECK at the carried faders: cello (expect piece 6's −30.00 · −30.73 · −36.20 + 12.0) · wood blocks
  · bass drum alt. NOT measured: the Ricotti four and six Abbey Road (carried) · the vibraphone (no technique in the recipe yet).
- **The rig:** `make_rec_track.lua` (REC: 24 receives, unity, master send off) · `rec_mode_solo.lua` (REC the only writer; the modes
  saved to `probes/rec_modes_before.json`) · `card_run.ps1 -DryRun`: **all checks pass**.

**Waiting on him:** the run plays nine minutes of notes through the speakers and needs Reaper untouched; the clip pre-flight (two
minutes, meters only) goes first. And the round robin, his call (the protocol's "stop and ask"): the violin's Xsample ordinary is
piece 4's preset, round robin as shipped; piece 6 skipped the check at his word.

## §22. Container 5 — the card recorded and the rack trimmed (2026-10-23, Opus; his "a, go")

His answers: *"a"* — the violin measured with its round robin as shipped (piece 6's way) · *"go"*. **The clip pre-flight** (`clip_preflight.ps1
-Schedule probes/card_schedule.json` — it played the WHOLE card, 537 s, not two minutes, since a schedule was named): loudest the flute's
`b` instance (its curve copies) at **−1.10 dB**, REC and MASTER the same — **no clipping**, 1.1 dB of margin. **The card** (`card_run.ps1`,
rolled from 700 s): `reaper/Media/25-REC-261023_1146.wav`, 541 s, 198 MB (gitignored) → `analyze_card.py`: **79 / 79 notes measured,
every note within 40 cents of its pitch.** At velocity 127, integrated (held) / loudest 400 ms (struck), dBFS at the master, faders as
they stood: flute −8.72 · clarinet −15.90 · alto sax −13.57 · violin −28.54 · piano −32.09 · wood blocks −29.05 · bass drum alt −30.38.
**The bends, measured:** flute · clarinet · alto sax 2.00 · 1.99 · 1.99 st (SI2 at ±2) · violin 0.92 st. **The violin's round robin
shows** as expected: velocity 100 reads 1.3 dB SOFTER than 64 (−35.15 vs −33.89). **THE CROSS-CHECK:** the cello at +8.13 read
−17.74 · −17.83 · −24.28 against piece 6's figures + 12 (−18.00 · −18.73 · −24.20): **+0.26 · +0.90 · −0.08 dB — the chain IS piece 6's**,
so its `bank/reference.json` is carried (the K → LUFS offset the trims need). The two Abbey Road clones read HOTTER than in piece 6:
wood blocks +2.08 … +3.74, bass drum alt +1.47 on every key (a uniform offset, not a round robin) — their disk rack of 10-11 differs
from the state piece 6 measured on 10-04 (a Spitfire mix setting, at a guess, not read). The two are re-trimmed from THIS card; the
other six Abbey Road keep piece 6's faders and may sit ~1.5 … 3 dB hot — NITS, his ear.
**The trims** (`compute_trims.js`, its held set this rack's; `bank/perc_rack.json` carried from piece 6 on `SWPerc`; the target piece
6's −31.84 dB per voice, kept because the carried trims are exact against it): **flute −23.12 · clarinet −15.94 · alto sax −18.27 ·
violin −3.30 · piano +0.25 · wood blocks +4.26 · bass drum alt −5.75** — `gen_apply_trims.js` (this rack's tracks: a UVI instrument's `b`
instance takes its trim; the piano's main track) → `apply_trims.lua` through the bridge, every fader read back. **The remap**
(`build_remap_card.js` → `remap_merge.js`): five curves merged beside the carried cello's — flute (span 14.0 dB) · clarinet (30.9) · alto
sax (18.9) · violin (31.1) · piano (16.4); the CC7 law — piece 4's for the flute and piano, piece 5's SI2 bassoon's (UVI's own law) for the
clarinet and the sax, and for the violin KONTAKT'S as measured on the cello: piece 4's violin law stopped at −25.1 dB, short of ppp's
−28 (`dyn_table_check` caught it). The tools re-pointed on the way: `card_schedule.js` · `compute_trims.js` · `gen_apply_trims.js` ·
`remap_merge.js` · `dyn_table_check.js` (its UVI case is the clarinet). **Checks: DYN TABLE 52 · PALETTE 202 · ROSTER green.** REC's
modes restored (`rec_mode_restore.lua`). Not saved by the AI — his CTRL+S.
**ONE QUESTION FOR HIM — the cello.** It carries piece 6's fader +8.13: piece 6's trim −3.87 PLUS his +12 by hand there (its §74 · §79 —
the Xsample instances had sat at Kontakt's −6 default and he found them quiet). Measured here it sits **about 12 dB above the new
standard** every other instrument is now trimmed to.

## §23. The cello to the standard — his "a" (2026-10-23)

Put to him twice more simply (*"the decision more simply pls"* · *"how about the perc?"*): the cello sat 12 dB over the rest; (a) the
cello down, everything even — percussion, piano, mallets, winds, strings at one level; (b) the four new sustained instruments up to the
cello — the sustained 12 dB over the percussion and piano, piece 6's balance (raising the percussion too would only lift everything and
clip). **His "a".** The cello's fader from THIS card: measured −19.95 dB integrated at +8.13 → **−3.76 dB** (piece 6's own measured trim
was −3.87: the same instance, 0.11 dB apart). `bank/trims.json` carries the row (its basis says why); `apply_trims.lua` regenerated
and run; read back −3.76. **The rack is at one standard:** every instrument at velocity 127 at −31.84 dB on the card's scale (the six
carried Abbey Road possibly 1.5 … 3 dB over — NITS). **Container 5's composing demo is done but for his ear** on a chord; the QC battery
(5.9) not built — not asked.

## §24. Container 6 — the notation set-up: his three calls, the registry, the test page (2026-10-23)

His calls (put as three lettered questions; *"a, b but can this be reversed later when it comes time to notate?, perc for both no vib
and rest ok"*): **(1) a — transposed** · **(2) b — the unpitched percussion gets its own staff**, and yes, reversible: the staff is one
entry of `notation/registry/ensemble.json`, Decibel's hidden one-line form one edit away · **(3) the short names as offered, but "Perc"
for BOTH percussion staves** (not "Vib"). **The registry (6.0)** — `ensemble.json` for eight parts: Fl · Cl (+2, B♭) · A.Sx (+9, E♭) ·
Perc (piece 6's OWN eight-line Bone-Alphabet staff of its 755ed29, for the same eight Abbey Road instruments this rack carries —
PROVISIONAL until his instruments from the call's list) · Perc (the pitched five-line staff, treble) · Pno (piece 4's grand staff, one
lane, split at middle C) · Vn · Vc; groups: the winds bracketed · the percussionist's two staves in a joined BRACE · the piano's brace ·
the strings bracketed; META 8, curves 9 · 10 · 11. The composer page's TRACKS shorts follow (`A.Sx`, `Perc` — the extractor refuses a
registry whose shorts differ). **THE PRESENTATION SCORE IN C** (`notation/registry/container.json`, realization `video`: the clarinet
and the sax at transpose 0) — the lineage's form, read as part of his "a" (the working page transposed, the presentation in C, as
Decibel); his to reverse by deleting those two rows. Found because the app THREW on piece 6's override row for `bass_clarinet`.
**6.4 save → IR:** `notate_section.js` on `switch-first-sound` (the tool-written save; the app-written page with real material is owed
at his first music, as in piece 6) → `notation/ir/switch-test.ir.json` (the folder made — piece 6's pages stayed): **VALID vs source**,
18 events, in the picker. **Looked at** on the throwaway 5601 (the app) and **through the film's own renderer** (`export_video.js
--probe 3,6`, resvg): the eight staves in score order, the eight-line staff with its instrument names in the gutter, the two braces,
the grand staff, the brackets, the notes on the flute and the clarinet. **The gates:** `gen_engraving_rules.js` regenerated the rules
page → `check_rules` **31 of 32** (rule 8 wants a page with a sequence overlay — piece 6's same red, H6-60) · `palette_check` 202.
NOT done: the print exporter's page (6.5's second half) and the protocol's 6.6 file discipline — at container 8 / the first music.
