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

## §25. 10.0 — THE PROTOCOL IS v2; THE START IS DONE (2026-10-23, Fable; his "a")

His "a" to "the write-back now". One sitting: the two registers read line by line — piece 6's (nineteen table rows and six bullets,
2026-10-04, never written back) and this piece's (thirty rows, 2026-10-20 … 23) — and written into `composition-system/protocol/
NEW_PIECE_PROTOCOL.md` as dated "v2 entries" under the steps they touch: container 1 (the next piece runs an unclosed harvest; the IDs
carry the piece's number) · 2 (the profile in plain words, the seat and roles lines, the lanes row, the memory folder copied, the notes
gathered) · 3 (the classifier as the template lists; read-at-start greps; the blob hash; two staging passes; the fixes commit; the
roles = the lookup; the engine's take between 3.4 and 3.5) · 4 (4.0 the read-out; the ports by PowerShell, loopMIDI his or detached,
`midi_reinit`; the clone from every rack; the VST2 names; the Dynamic as text; the parts derived) · 5 (the cross-check carries the
reference; the pre-flight plays the whole card; `{port, ch}`; the CC7 law is the plugin's; the tools' lists for v3) · 6 (the three
calls before, lettered, reversible; grep the registries for the source's part ids; `mkdir notation/ir`; the film probe) · 9 (the
knowledge base's first page; `uvi.md`) · 10 (the write-back is the start's LAST STEP — skipped once, never again). The version line:
v2. The open list: the engine's home and the Decibel score type PLACED; still open — the sandbox kind's middle, the font, the QC
battery, the measuring tools' lists, the pieces' numbers in the home. `BACKLOG.md`: H6-46 … H6-53. `INDEX.md`: rows 7 · 8, the protocol
refreshed, `uvi.md`, the read-out as the knowledge base's first page. The home pushed (`2185de3`).
**THE START OF THE SWITCH~ PIECE IS DONE** — containers 1 … 6 and 10.0, 2026-10-20 … 23, four sittings: the kit · the copy · the rack
sounding at one level · the score set up · the protocol taught. Containers 7 and 8 run with the music. **Next: the music — his.**

## §26. THE COMPOSING OPENS — the first section's electronics, by the planning method (2026-10-23, Fable)

The same day the start closed (§25) he opened the music, in one message (verbatim in `COMPOSITION_NOTES.md` SW-2): the
performance-captured electronics of the workshop (`live-electronics-engine`; *Sýnthesi Alpha*'s source), with the parameters
RESTRICTED, to make the electronics follow his performances better — a running order of three: more performances in from the Logic
archive and worked in Reaper here · a bed from one session (whole-texture samples time-stretched, each granulated by a different
instrument's performance, stacked) · THE TREMOLO as the main focus — the performance capture applied to one simple parameter so the
tremolo has his performance's clustering, density, intensity, "organic wave like flow"; then other ready-responsive effects. An
electronics part for the FIRST SECTION; the acoustic instruments built around it. Quad held for later (stereo simulation in the
composer score). The AI read before answering, by the pointer rule: the workshop's CLAUDE.md and `next-session.md`, the v-alpha
reference page (what plays: the recording read in grains; the tremolos an oscillator on the level, NOT performance-steered), the
corpus (`steer.py` — a chain of players' trajectories as the steering data; `timbre.py` — ten features per frame, the archive as
"a library of shapes"; `export-procedure.md` — the Logic → stems route, Mac-side), `steered-by-the-drums.md` (his formulation,
verbatim). No "paper on synthesi alpha" exists as a file: `paperSubmissions/papers/tenor-2027/` holds Paper A (*Approaching*'s
electronics) and Paper B (*Live Electronics as Improvising Collaborator* — the corpus as shapes); the journal of 2026-10-11 … 12 in
`synthesi-alpha/docs/history/` is where "the paper" is spoken of. The planning method entered: the restate first, one topic.

## §27. THE SET: Sound Lab 2025-04-08c — piano · baritone guitar · archtop · drums (2026-10-23)

Topic 1 of the first section's electronics (§26). The data put to him: twelve sessions on this machine with stems AND analysis
done (`C:\WindowsDrive\analysis export`, `…\analysis\*.json|npz`, 2026-08-26's export); his rule on "used": *"just not the one for
v-alpha even if we made those voices already we can reuse the performances cause I haven't used those voices in a piece yet"* — so
only *Sýnthesi Alpha*'s two are off the table (2026-04-13 Bcl Arch, its recording; 2026-04-16 Piano Arch Drums, its drums driver);
ten are free. His choice: **2025-04-08c Piano Bari Arch Drums, 6.6 min, four players** (the AI's recommendation: four players, the
longest, drums in it — the capture was worked out on drums). HIS CORRECTION: *"it is baritone guitar which is played more like a
bass"* — the corpus's `parse_stems` labels the part `bari-sax` (every "Bari" stem is read as a sax); here it is a BARITONE GUITAR,
the bass of the texture. The analysis's numbers stand (the analyzer does not care what the part is called); the NAME is wrong in
the session's JSON — to be set right when the session's data is read in here, and the other "Bari" sessions (2025-04-04e,
2025-07-25c) asked about only if they come up. "All the capture from the same set": the bed's material AND the tremolo's drivers
come from this one session.

## §28. THE BED, DESIGNED BY HIM — four granular streams from the ensemble mix, one per player's capture; the voice the tremolo treats (2026-10-23)

Topic 2 (§26). His words settle it: *"grainular sources are made from time stretched samples of the full ensemble mixed audio; then
granulated with the perf-cap of one instrument, lets do 4 one from each instrument and lets do them as streams, so I don't know if
the timing of the granulation lines up, probably not, but well take the full piano perf for example and granulate its bed/source using
the full piano perf from beginning to end; repeat w/other 3 and layer them and that is the voice that will be treated with tremelo;
same bed treated with another effect, following another instrument so then 4 voices to use in piece"*. So: THE SOURCE is the
session's full mix (all four players), not a stem. SAMPLES from it are time-stretched — four granular sources. FOUR STREAMS: each
source granulated by ONE player's performance capture, the WHOLE performance beginning to end (the piano's capture over its source,
the baritone guitar's over its, the archtop's, the drums'); the streams need not line up in time — "probably not". LAYERED, the four
streams are THE VOICE; the tremolo treats it. THEN the same bed under another effect, following another player — FOUR VOICES for the
piece, by effect. How the grabs are chosen was put to him (a. the session's own accents pick them · b. the AI picks and shows · c. by
hand in Reaper); he did not take a letter — the AI goes with (a), "all the capture from the same set", his to reverse.
THE MIX: he asked the AI to look in the parent folder — *"I may need to get you the mix … otherwise make it a todo"*. Looked:
`C:\WindowsDrive\` and `analysis export\` hold no bounce of 2025-04-08c (the session's eight stems only, sample-aligned: all
52,793,110 bytes). A to-do written on his list (`home-management/todo-list.md`, Compositions: "Switch~ — Get The Session Mix
(2025-04-08c) From The Mac", replacing "Calibration Run", done). Meanwhile a SUM of the eight aligned stems at equal gain is the
stand-in mix — enough to build the chain; his bounce replaces it when it arrives.

## §29. THE DRUMS DRIVE THE TREMOLO — his "a" (2026-10-23)

Topic 3 (§26): the tremolo on the layered voice, its parameters cut to two — depth (volume) and speed, the speed shifting — steered by
ONE player's capture. Put to him: a. the drums (the capture was worked out on them; the clearest accents) · b. the piano · c. a guitar.
His "a". The restate is done (topics 1 … 3, §27 … §29); the top line of the steps follows.

## §30. THE LAB — the seven steps written into PLAN 1a as experiments (2026-10-23)

Step 3's sub-steps were put to him (the grabs by each player's own accents, his "a": 4-second windows, the strongest third of the
accents, a 3-minute placeholder stretch); his answer widened it: *"lets actually lab all of these; so what needs to be done, can you
assemble an experimental plan for each step and then we'll run thru together and I'll listen and adjust"*. So PLAN 1a holds the seven
steps of the top line (§29) each as an EXPERIMENT — build · hear · knobs — run together: the AI builds and renders, he listens, the
knobs move at his word, a step is done when he says so. The capture/grab/stretch/granulation tools are placed in the workshop's
corpus (any session); the tremolo and the steered effects in the engine (any piece); the set's files, settings and voices here.

## §31. CHECKPOINT — the lab ready to resume; 1a.1 waits for his mix (2026-10-23)

Asked the practicals of 1a.1 (the stand-in sum, the folder, his one listen), he answered: *"no I have the mix i just have to get it
when at home; pls get the lab ready for resumeing and ready to be run post clear pls"*. So: no stand-in sum; 1a.1 = his bounce
dropped into `bank/set/2025-04-08c/` (made, with a README saying what goes there and where the session's files are; the folder's
audio gitignored by `bank/set/.gitignore` — the root `.gitignore` is left as it is, rolled back and his). PLAN 1a.1 rewritten
to his mix; journal §2 "SESSION 2 — THE LAB OPENED" is the cold-start block with the next step as an instruction; PLANNER and the
state line follow. The session's start (§1 … §25) and this planning (§26 … §31) are behind this checkpoint.

## §32. A MODEL NAMED — Lachenmann's *Notturno* (2026-10-24)

His note, between sittings (the lab waits on his mix): *"Lachman Notturno as a model for this piece."* — in the sketch pad as SW-3,
verbatim, the AI's reading marked: Helmut Lachenmann, *Notturno (Musik für Julia)*, small orchestra with solo cello, 1966/68 — to
confirm that this is the work. What in it is the model is his to say; nothing is planned from it yet.

## §33. A TEXTURE NAMED — repeated-note tuplets at different tempi and phases (2026-11-02)

His note, between sittings: *"a composition note, repeated note tuplets at different tempi and different phases."* It is in the
sketch pad as SW-4, verbatim, with the AI's reading marked. Nothing is planned from it yet. Where it sits in the piece, which
players carry it, and whether it is SW-c2's dense counterpoint are his to say.

## §34. 1a.1 — THE SET READ IN (2026-11-03)

His word: *"the mix is here"* — `C:\WindowsDrive\analysis export\Sound Lab 2025-04-08c Piano Bari Arch Drums\Sound Lab 2025-04-08c
Piano Bari Arch Drums.aif`, his Logic bounce of 2025-04-08, put in the session's export folder beside the eight stems (the folder also
holds the session's video `#1102` and its `.logicx`). Measured: 398.0 s, stereo, 44.1 kHz, 24-bit — the stems' length to the sample
frame, so the analysis's times hold on the mix. It is READ WHERE IT LIES (no copy; `set.json` names it). The piece's copy of the
analysis: `bank/set/2025-04-08c/analysis.json`, `bari-sax` → `baritone-guitar` in the parts and the pairs. The four players' onset
counts: archtop 1,013 · drums 962 · piano 738 · baritone guitar 627. The analysis holds, per player, the onset times, and three
curves at one value per second — density (onsets/s), loudness (dB), spectral centroid (Hz) — plus pulse and inter-onset statistics,
and the pairs' coupling (archtop × baritone guitar: coupling 0.045, the uncoupled baseline — HANDOFF's "a finding, not a fault").
These are 1a.2's material. Waiting on his one listen: "is this the session".

## §35. 1a.1 DONE — no listen needed: the mix is his (2026-11-03)

Asked for one listen ("is this the session"), he answered: *"This is the mix I'm giving you. This, I made this mix. So I'm not, I
guess I don't need to listen. It, I think it's ready for a caption, correct?"* ("caption" = capture, a dictation slip). Right: the
listen was a check that the AI had the session he meant, and the file is his own bounce of it, so the check answers itself. 1a.1 is
done; 1a.2, the capture, is next. A lesson for the lab's later steps: a listen is asked only of what the AI MADE.

## §36. 1a.2 — THE CAPTURE DRAWN (2026-11-03, Fable; his "go for 2")

Built: `live-electronics-engine/corpus/draw_capture.py` (the workshop's, any session) → `bank/set/2025-04-08c/capture/index.html`
and `accents.json`. The page: the mix's envelope (peak per ¼ s) on top, then per player four lanes over the whole 398 s — ATTACKS (one
tick per onset, its height the loudness at the onset's frame from the analyzer's .npz; the strongest third drawn tall and dark = THE
ACCENTS, Paper B's proportion) · DENSITY (onsets/s) · LOUDNESS (dB) · BRIGHTNESS (the spectral centroid, on a log scale) — the per-
second curves of the analysis. The accents' thresholds: archtop 334 of 1,013 (≥ −39.8 dB) · baritone guitar 207 of 627 (≥ −40.1) ·
drums 317 of 962 (≥ −48.8) · piano 244 of 738 (≥ −44.3). `accents.json` holds the accent times per player — 1a.3's grabs read it.
Proven once: the page rendered on the throwaway 5601 (the mix band, the lanes, the ticks), then the server stopped. His score
server serves it at `/bank/set/2025-04-08c/capture/index.html`. Waiting on his look: does each drawing look like the playing.

## §37. 1a.2 DONE — and the lab's rule from here: he judges by ear (2026-11-03)

His look at the capture page: *"These are fine for now. However, I think I really just need to evaluate through the listening. Once we
have a strategy for developing sources, then figure out how to apply the tremolo or the analysis to the tremolo with the sources, and
I'll listen and see if there's adjustments."* So the drawings are a reference, not a gate; from 1a.3 on each step's "hear" is the
judgment and the knobs move from what he hears. 1a.3 next: the sources.

## §38. THE STRETCH IS HIS ICY (2026-11-03)

Before 1a.3's "go": *"I just want to make sure we're using the IC, my own granular synth def.icy"*. Yes — the stretch is Warp1 as he
wrote it in `freeze` (2015 … 2016: \icy · \icy_live · \icy_s), carried into the engine as the `icy` stage (`electronics/sc/process.scd`
l. 434 …; the engine's §37: long windows 0.6 … 0.8 s, 17 … 40 overlapping grains, the read point crawling at icSpeed of real time, one
of his ten grain windows — expodec his favourite). For 1a.3 it runs OFFLINE: sclang 3.14.1 with a second scsynth in NRT (the way
`sc/bus_test.scd` renders), each grab → its stretched source, both channels. Not the workshop's JavaScript read, not Reaper's
stretch. The knobs are icy's own.

## §39. SÝNTHESI ALPHA'S RECORD CONSULTED TOO — its icy renders and its tremolos (2026-11-03)

His word: *"synesthesia alpha, all of those as well. We use tremolo there, as well as the icy freeze there."* Read: (1) ITS ICY is the
same freeze as a JavaScript read (`engine/playhead-processor.js`: the read point crawling at `speed`, grains `win` long, `overlaps` at
once, through one of his windows, lengths straying by `rand`) — and it has an OFFLINE RENDER TOOL already, `tools/icy_render.py`
(journal §242: a container read through one rolled icy, start to end, into a file; the accel / decel icys that change speed by equal
ratios; THE LEVEL RULE, journal §220: a stretched render is brought to the RMS of its source). (2) ITS TREMOLOS are overlays on a
bus — `trem waves` · `trem rush` · `chop accel` (`engine/voices.js`): one LFO over everything the bus plays, 4 … 24 Hz, its speed
steady or moving in a pattern; NOT performance-steered — the thing 1a.5 changes. So 1a.3 has two offline icy routes, both his: the
workshop's proven renderer, or the engine's SC Warp1 stage through a new NRT harness. Put to him. PLAN 1a.5 now says: read the
three overlays first.

## §40. THE SOURCES RE-THOUGHT — the busiest parts of the FULL MIX, cut to the stretch's length (2026-11-03)

His revision of 1a.3, verbatim: *"let's revise the original sample strategy. I think the most interesting parts will be busy parts. And
in Synesthesy Alpha, we had certain durations, I think, that I said worked. Maybe it was like 30 times, might have even been more. I
think 30 times is the least. So that will determine the length of time stretch sample we use. So first, let's determine the length
range that we're going to use. It could be 30, but more, maybe up to 100 times, maybe. I'm not sure. Maybe not quite that much. See if
you can see if any decisions were made in Synesthesia Alpha. Then, if there's a way to find for the full mix the busiest parts, we can
take a few samples of what we decided the length should be."* And: *"Just to clarify, the busiest parts of the full mix."* So the
per-player accents (§36) are NOT the grabs; the grabs are the busiest moments of the whole texture, a few of them, each as long as the
stretch factor and the target length dictate.
THE RECORD READ. *Sýnthesi Alpha* (journal §221, 2026-10-12): his four icys — 10× (win 0.6) · 10× short (win 0.15) · 17× (win 0.6) ·
15× short (win 0.21), all 17 overlaps, rand 0.2, expodec; the moving ones 2→20× and 50→4× (speed 0.5→0.05, 0.02→0.25); page 4's reads
"10 to 17 times slower", pages 4 … 5 "slowed 2 to 50 times" — no 30× there. *Approaching* (its `bank/presets.json`, 143 icy presets):
**30× (speed 0.0333) in 41 — the most used**; 4× · 10× · 100× (0.25 · 0.1 · 0.01) in 18 each; 17 overlaps in 84; rand 0.2 in 124;
expodec in 43. So his memory is *Approaching*'s: 30× the common one, 100× present.
THE BUSIEST PARTS: the four players' onsets summed per second over the 398 s (the mix's activity as the analysis knows it — a detector
run on the mix file would merge coincident attacks; the sum is the truer count). Mean 8.4 onsets/s, the 90th percentile 13, the peak
19. The busiest windows (start, mean onsets/s): 3 s — 3:16 (15.7) · 3:12 (15.7) · 1:17 (15.0) · 3:23 (15.0) · 2:03 (15.0) · 2:47
(14.7); 5 s — 3:14 (15.0) · 3:21 (14.6) · 2:01 (14.4) · 1:17 (14.2) · 1:50 (13.4); 8 s — 3:12 (15.0) · 2:00 (13.4) · 1:50 (13.2) ·
1:15 (12.9) · 3:01 (12.8); 12 s — 3:14 (14.4) · 3:02 (13.0) · 1:54 (12.8) · 2:47 (12.5) · 1:10 (11.9). The densest stretch of the
session is 3:00 … 3:25; then 1:50 … 2:08; then 1:10 … 1:20. The arithmetic of the grab: for a 3-minute source, 30× → a 6 s grab ·
50× → 3.6 s · 100× → 1.8 s. The range is his to set; put to him.

## §41. 1a.3 BUILT — 56 busiest seconds of the mix, each stretched ×30 · ×50 · ×100 through his icy (2026-11-03)

His design: *"lets grab 1 second samples, try to grab the busiest ones you can, but all different. Let's grab, say, 20 from each of the
top three there, the 3 minutes to 325 and then 150 to 208, etc. And then let's stretch each of those seconds 30 times, 50 times, and
100 times. And then if you can produce some sort of preview page or something so I can listen to that."* Built:
`live-electronics-engine/corpus/icy_sources.py` (the workshop's — any mix with an analysis). The grabs: on a ¼ s grid inside each
region, the one-second windows ranked by the four players' summed onsets, busiest first, at least ½ s apart — 20 in 3:00 … 3:25
(14 … 19 attacks each), 20 in 1:50 … 2:08 (13 … 19), and 16 in 1:10 … 1:20 (7 … 19 — a ten-second region holds no more at that
spacing): 56, not 60. Each cut with 10 ms fades (`sources/grabs/`, 24-bit). The stretch: Sýnthesi Alpha's read (`tools/icy_render.py`'s
render(), his freeze as the playhead reads it), speed 1/30 · 1/50 · 1/100, win 0.6 s, 17 overlaps, rand 0.2, expodec — Approaching's
most-used icy; each render brought to its grab's RMS (the level rule) then peak-limited to −0.2 dBFS; the matching gains −5.5 … +1.7
dB. 168 renders (30 · 50 · 100 s), Ogg q4, 194 MB on disk, gitignored; `manifest.json` and the page in git. The page: one row per
grab — its time, its attack count, the grab, the three stretches, each a player. Re-made by one command (the tool's docstring; the
regions 180-205 · 110-128 · 70-80, 20 per region, grab 1.0, factors 30 · 50 · 100). Waiting on his ear.

## §42. The sources on his phone — three reels (2026-11-03)

*"is there a way to preview on my phone, either thru remote-control to this chat or download some how, whatever is the easiest"*. The
easiest: files sent into this chat (it follows him to his phone). Three mp3 reels, one per factor (`sources/reels/sources-x30 · x50 ·
x100.mp3`, 4.6 min and 5.5 MB each, gitignored): the four busiest grabs of each region (#3 · #8 · #10 · #16 · #21 · #22 · #24 · #38 ·
#43 · #53 · #55 · #56), each as the 1 s grab, a 0.6 s breath, then the first 20 s of its stretch, two breaths. The full page (all 56
grabs, whole renders) stays on the PC. A published page with the audio as assets (194 MB in seven uploads) was the other route — not
taken: the reels answer "which factor" in a quarter of an hour.

## §43. THE ICY SETTINGS — his hierarchy, and a rig to find them by ear (2026-11-03; a design conversation opened)

After the reels, verbatim: *"ok I think we need to work on the icy settings I would like to have a patch that can select from 1 of the
12 samples, then I would like to isolate the parameters so 2 catagories, one will be like an absolute like grain duration well let me
ask you to help me with a hiarachy, there always seems to be too many to adjust but I want to effeciently find the settings I like or
at least see how they effect the sound. so if we take grain duration, I feel like the first is a binary, so they tree, maybe that is
why they are hard to nail down, either you have static grain dur or variable, then on the static tree you have how long, and how much
they overlap, then on the variable tree you have min dur and max dur and then potentially some weighting and then you have overlap but
that will also depend on grain dur(?); then grain env, I feel like I never liked assorted grain env, so maybe I'll just test one and
prob stick with single grain env, but then the grain env I choose will have different effects on all of the grain dur trees, so a
different set of grain dur settings per grain env; then the phasor, read head speed, which I think can be the last thing and can be
variable, but I guess this is the 30 vs 50 vs 100, probably the best thing is to leave this as a 'live' knob; then I don't usually
like to modify pitch so we'll leave that, anything else? help me organize effeciant aural tests so I can pin down the settings I like
the most and make a menu of time-stretch settings and some descriptive about how they sound so I can reuse them in other pieces"*.
The AI's read of the tree, put to him (the reply of this hour): the duration branch first (static: length · overlap; variable: min ·
max · weighting · overlap), with ONE correction — overlap and duration are tied through the hop (grains start every mean-duration ÷
overlaps seconds), so "overlap" keeps its meaning in both branches if the hop is derived from the MEAN duration; the envelope one at
a time, each with its own duration settings; the read speed a live knob, last; pitch left; ONE addition — the read point's scatter
(how far a grain's start strays from the crawling head; the cloud has it, icy does not), listed, off by default. The rig: a live patch
in the browser (the workshop's icy read as a worklet, 1 of 12 samples, the tree as knobs, a save-to-menu) vs. offline render grids —
put to him. The MENU is for every piece: it will live in the engine's repo. Nothing built yet.

## §44. THE ICY LAB — a live patch for his hierarchy (2026-11-03, Fable; his "then a live patch")

His three answers to §43: *"lets stick to a linear read thru with potential loop back; for 3 lets have 1 or 2 examples of variable envs
to confirm that I don't want to use, you can design at your descression; but 6 still is a factor, scatter, if we do a linear read? then
if yes, propose what variations to listen to; then a live patch"*. Built in the workshop (any piece's samples):
`live-electronics-engine/engine/icy-lab.html` on the workshop's own playhead (his freeze as `engine/playhead-processor.js` reads it —
the same read Sýnthesi Alpha's renders came from). The page: a sample (the 12 grabs, copied to `build/icy-lab/samples/` with a
manifest; or any file dropped on the page) · 1 DURATION: static (how long) or variable (shortest · longest · weighting), and the
overlap — a new grain every mean-duration ÷ overlap, so "overlap" means the same in both branches · 2 ENVELOPE: one of his ten, the
Hann, or two ASSORTED sets (A: expodec · gauss · hanning; B: all ten — one drawn per grain) · 3 SCATTER: ± seconds of the source a
grain's start strays from the read point · 4 READ SPEED: slower by ×1 … ×200, the three buttons, a loop back; level; pitch fixed
at 1 · SAVE TO THE MENU: a name and his words → `voices/icy-menu.json` through a new `/icy-menu` route in `tools/serve.py`; a saved
entry recalls its settings by a click. Two small additions to the worklet: `skew` (the weighting: a grain's length drawn as
p^2^(−2·skew), −1 short-leaning … +1 long-leaning) and `windowSet` (the assorted envelope). Proven once in the browser pane: the
first grab loads, the read runs at ×30 (the head at 0.10 s after 3 s), the meter moves, the save route writes and deletes an entry.
Served by the workshop's `tools/serve.py` (8732; launch name `icy-lab` added to this repo's `.claude/launch.json`).
SCATTER WITH A LINEAR READ — yes, it still counts: the read point crawls on, each grain simply starts a little before or after it;
small (± 10 … 40 ms of source) softens the frozen spot into a shimmer, large (± 150 … 500 ms) blurs the order into a cloud. The
variations proposed: none · ± 10 ms · ± 40 ms · ± 150 ms · ± 400 ms, each at ×30 on one grab.

## §45. "What's the engine here?" — the icy lab is the workshop's JavaScript read, not SuperCollider (2026-11-07)

His questions, verbatim: *"what's the engine here? Are you still using SuperCollider? And if you are, then are you rendering? And are
you using my IC patch, my synth def? And then let me see the synth def in chat. And maybe we should just use the variables here. Just
help me understand what you're actually doing."* — after *"This is too busy, the IC lab, and too hard to use. Let's just do one thing
at a time"* (the page stripped to the sample and play; the knobs hidden, `?all` shows them). The answer given: the lab plays LIVE in
the browser through the workshop's `engine/playhead-processor.js` — his \icy re-written in JavaScript (Warp1 decomposed: a phasor at
the read rate, overlapped windowed taps at pitch; journal §220 there), the same read Sýnthesi Alpha used live and that `icy_sources.py`
ran offline for the 168 renders. Not SuperCollider, not rendering. His SynthDef (`freeze/freeze.scd`, 2015 … 2016) shown verbatim, its
arguments mapped to the lab's knobs: winsz · overlaps · envbuf · rand · rate (ratemin … ratemax) · pitchshift · startpos / endpos. The
SuperCollider Warp1 itself runs in the engine's `icy` stage (`electronics/sc/process.scd`) — the one the piece plays live. Proposed:
the page's knobs take his argument names.

## §46. "Can we use SuperCollider instead?" — the lab over the engine's own route (2026-11-07)

His word, verbatim: *"Is there a way we can use superclutter instead? Can we develop the web to the JavaScript web to the protocol
there? Sorry, I forgot the name of the protocol. But can we use that instead? Can we develop that and then run it through the
superclutter engine? I'd rather we do the live processing through superclutter, and we'll have to talk more about that. But I'm not
prepared to discuss the whole engine, or I think we're going to do that later for previous pieces, that like the decimal piece that's
essentially done. And when I produce the final part scores, etc., then we'll discuss how the engine should be. But for now, for the
experiments, as much as possible, I'd like to hear them as run in superclutter."*
THE ROUTE EXISTS (read: `electronics/sc/process.scd` § /le/process; `score/le_process.js`; `tools/elec.js`; Approaching's auditions):
the protocol is OSC over UDP — a page → POST /api/elec on the score server → the relay → OSC → sclang (57211). The engine renders a
sample from the bank through \leProcess — the chain's UGens, Warp1 in the icy stage — OFFLINE in SuperCollider (NRT, a second or two),
banks the result, and /le/play plays it through the engine's bus → ReaRoute → Reaper's ELEC RETURN. The icy stage's controls: icMix ·
icSpeed · icFromMs · icWin · icOverlaps · icRand · icPitch · icEnv (1 … 10 his windows, 0 the Hann) · icLoop. Approaching heard its
effects this way (its audition scores: bricks, each a render, played in the composer score — `docs/auditions/`).
WHAT DOES NOT EXIST: a LIVE SuperCollider read of a sample with the knobs turning (the live SynthDefs take the microphone; the sample
path is the render). And the chain is MONO — the icy stage reads one buffer (the engine's §37 "not yet: stereo, his \icy_s ran two").
The proposal put to him: the icy lab re-made over this route — the stripped page sends /le/process with his SynthDef's names mapped
to the stage's controls, every change re-renders through SuperCollider and plays; mono for the experiments; the live-with-knobs
version is engine work for the engine conversation he deferred.

## §47. ICY LIVE — he asks for the real-time SuperCollider architecture, an evaluation (2026-11-07)

His word, verbatim: *"There should be something called IC Live. I believe we can still do it that way. If you load the samples as
buffers and then you play them, you just run a play where it plays from the buffer. And well, let's take some time to rearrange
things. I'm open to you creating new versions, but using my basic architecture. So this is a little bit sketchy. So I haven't been
programming directly in SuperClutter, but if we run the buffers into some sort of bus, perhaps, and when we initialize the engine,
we'll just play those buffers. We'll load and play those buffers, and then I guess that those synthefs will need the read head. Or the
playhead, I guess, play buff. And then the other synthdef will sit after it and do the granulation live, right? You just do mic in,
and I'm not sure, you had mentioned this jitter from the playhead, and I don't still quite understand that, or I guess the envelope.
Anyways, let's figure it out. So what's maybe there, because I had some, you can look in the repo, in my ELO sign repo, I had some that
were just single grain generators, so that's possible too. I don't know if that's better. And we just do it at like as a some kind of
routine. Or if you just have a continuous read synthef that just triggers each individual, the sounds coming in, but you just trigger
each individual envelope. Anyways, let's discuss what the best architecture for this is so that we can do the real time. And then,
yeah, using OSC with some JavaScript page that you make. Or if you have a different recommendation, I'm open to that as well. So I
guess this is what we need to do, is we need to create an updated version of my architecture from SuperClutter, something that makes
sense, and I'll have you manage all the buses and like groups and stuff. And then whether we want just single grain generator and like
a routine that schedules all the synthdefs, if that's better, or it's better to have a single synth that triggers the grains. But I
guess if we want them overlapping, we'll need a couple. Anyways, do an evaluation, please. Let's revise the actual SuperClutter patch
so that we can do this efficiently. Then secondly, the thing you had before with the read head, I still didn't quite understand, but
help me understand that and how we implement that if we need to change my actual synthefs at all. And anything else that needs
updated there. And then let's talk about implementation."*
Read for it: `freeze/freeze_live.scd` (\icy_live — SoundIn written into a buffer by a Phasor write head; Warp1 reads behind it at
`rate`; a linen over the whole) and `freeze.scd` (\icy — Warp1 straight off a loaded buffer); the workshop's `synths/roads-cloud.scd`
(GrainBuf with a trigger, two channels). His "single grain generators" repo is not on this machine. The evaluation is the reply of
this hour (§48 records what he decides).

## §48. Stereo in, and a pan per grain — his addition to the architecture (2026-11-07)

*"Oh, and let's find a way to bring stereo in. So that was another thing I think we did in the previous repos or previous pieces to
have. It might even need to be another different UGen to have, some sort of panning per grain. And then that'll be another knob."*
In the lineage: the workshop's `synths/roads-cloud.scd` is GrainBuf in two channels with a pan per grain; the engine's cloud and icy
are mono (its §37). Design, as answered: the grabs stay stereo (two buffers, L and R, as his \icy_s ran two); the GrainBuf voice reads
both with one trigger and one position, and PANS each grain — a knob, pan spread: 0 keeps the source's own field, 1 throws each grain
anywhere; Warp1 has no pan per grain, so his \icy voice keeps the source's field only. The shape accepted by his addition; step 1
(the two SynthDefs) begins.
*(§48, continued — his addition mid-build:)* *"When this may eventually end up being a quad. So for now, we'll use the PAN2 or
whatever we decide, and then have it easily converted into a quad PAN. And my preference for that is, again, I forget all the
protocols, but the vector-based one, V something, if it's a quad."* — VBAP (vector base amplitude panning). So a grain's pan is kept as
a POSITION (an azimuth), stereo today through GrainBuf's own two-channel pan; quad later. Honest limit noted for the quad talk: a
single-synth granulator sums its grains, so a true per-grain VBAP needs per-grain synths or several grain streams each with its
own VBAP; GrainBuf's own four-channel pan (PanAz) is the cheap quad.

## §49. ICY LIVE BUILT AND PROVEN HEADLESS — the engine's §71 (2026-11-07)

Step 1 … 3 of §47's top line in one: `electronics/sc/icylab.scd` (the two voices, the loading, the ear `/le/icy`), the hooks in
boot.scd and bank.scd, `icylab_test.scd` all five checks passing on the twelve grabs (copied to `bank/set/2025-04-08c/lab/`, with
`samples.json`; the wavs stay on disk). The mechanism's record is the engine's §71. His GitHub scanned at his word (the elosine
account, 40 repos): the granular precedents are `freeze` (the lab's source), `spotlights_liveprocessing/freeze_live_spotlights.scd`
(his \icy_live with a STEREO WIDTH — the second channel a 30 ms delay of the first), `chucK_granulator_tutorial` (single-grain
generators sporked from a loop, per grain a random position · length · gap · gain · pan · rate, the read position moved by LFOs —
the routine architecture he remembered), `dsp1_processed_multigranulation` (2015: two GrainIn streams off the live input, each its
own envelope and rate, each its own processing after — grain STREAMS), `sc_concepts_utilities/8ch_panAz_test.scd` (his multichannel
pan is PanAz), `grainEnvelopes` (the ten gEnv files and their resamplers; the ChucK set has an eleventh, gEnv_pulse). Nothing newer
than freeze for the freeze itself. Next: his word on the argument names (the glossary put to him), then the page.

## §50. The names, the dials, the front end one thing at a time (2026-11-07)

His word on the glossary: *"Green envelope instead of green window, please"* (grainEnvelope) and *"let's just go ahead and use your
recommended argument names … we need to come up with the dial names … the most salient knobs, the actual knobs that I need to
change"*; the stereo: *"I want to audition here and as I'm composing in stereo, but have that pan be easily ported to quad for the
live performance … whatever I compose, the arguments, how much spread or however we randomize it will just be adapted to the quad
setup"*; the front end: *"I just want to do one thing at a time … let's just start with just a set of defaults … maybe even ones that
I had already used. And let's just do the sample box"*; and *"explain to me how you got those samples again. I've lost track of that."*
Done: the arguments renamed in `icylab.scd` and its test (grainLength · overlaps · grainEnvelope · lengthVary · lengthLean · scatter ·
envelopeSet · slowerBy · pitch · readFrom · readTo · rewind · panSpread · stereoWidth · level); the page `electronics/score/icy_lab.html`
(the engine's page code, served at /electronics/icy_lab.html): the sample box and play at the defaults — Approaching's most-used icy:
grainLength 0.6 s · overlaps 17 · lengthVary 0.2 · lengthLean even · scatter none · expodec · slowerBy 30 · panSpread 0 · stereoWidth
1 · level 1, the grain voice; every other knob hidden (`?all`). The page only sends (`LE.send('icy', …)`); the sound is the engine's.
`samples.json` carries the folder the engine loads from. The overlaps / lengthVary / lengthLean / scatter explanation and the dial
proposal are the reply of this hour.

## §51. "don't hear it" → the startup order (2026-11-07)

His *"don't hear it"*: looked before answering — the lab's server was up (his, 5620) but NO engine (nothing on 57210 · 57211, no
sclang) and no Reaper; the page only sends. Then his word: *"let's get a startup protocol … you are able to open the Reaper window
… I'll double click … the .bat. And then I'll use the link in chat … let's have an order. And let's assume that I've forgotten what
to do."* Written: `docs/STARTUP.md` — 1 Reaper with the rack (the AI opens it) · 2 `start_electronics.bat` (he double-clicks; a window
the AI starts dies with the session, §19's lesson) · 3 `start_icy_lab.bat` (new; he double-clicks) · 4 the link; what he sees at
each; `tools/startup_check.js` (new) says which step is missing. Done this hour: Reaper opened with the rack by the AI, Explorer
opened at the .bat for him.

## §52. The machine crashed at the lab's startup — the logs read (2026-11-07)

His word: *"Whatever was just happening here crashed my computer. Can you look in the logs? This is like the second crash this
week."* Read (the Windows event logs; no admin): TWO kernel crashes in 90 days, both this week — 2026-11-04 20:32, bugcheck 0xA
IRQL_NOT_LESS_OR_EQUAL (a driver-class fault), and 2026-11-07 15:33, bugcheck 0x20001 HYPERVISOR_ERROR (the hypervisor that runs
Core Isolation hit a fatal state — usually hardware or memory, not an application). The second came about five minutes after the AI
opened Reaper with the rack (STARTUP step 1, the only activity of ours in the window: no engine, no loopMIDI; the lab server idle).
No driver is named anywhere; MEMORY.DMP exists but is unreadable without admin; the WER report folders are closed to the user; no
debugger on the machine. THE ONE HARDWARE CLUE: 2026-10-28, two CORRECTED Processor Core cache-hierarchy errors on one core (APIC 10)
of the i9-9900K (BIOS 2603 of 2019), a week before the crashes — the pattern of a CPU or memory going marginal (heat, an unstable
overclock or undervolt, a failing DIMM). Nothing in the lab's code runs in the kernel; Reaper's rack loads the ASIO path, ReaRoute and
the Realphones system-wide audio driver (4.70, 2024) — the one kernel driver in our path. Put to him: the dump read with a debugger
(his admin hand), a memory test, the temperatures.
*(§52, continued)* The crash also hit THIS REPO's git: the three ref files (`refs/heads/main`, `refs/remotes/origin/main`,
`refs/remotes/origin/HEAD`) were left as 41 zero bytes each — NTFS's mark of a write cut by a crash — so git could not resolve
HEAD. The objects were whole (fsck), the reflog named the last commit (8f55c78) and GitHub held the same tip; the three pointers
were written back to it. No history changed; no tracked file was zeroed (every text file changed since Nov 6 checked for NUL bytes;
the day's files identical to HEAD). The other repos touched today are clean.
*(§52, continued)* His admin copy of `C:\Windows\MEMORY.DMP` answered "cannot find the file": the dump is GONE — no .dmp anywhere,
no minidump, the WER kernel folders empty. Two reasons on this machine: the page file is 4.8 GB on 32 GB of RAM (an automatic
kernel dump has nowhere to be written), and Windows deletes a memory dump after reporting it when space is tight. The line was the
right shape (one line, both shells); the file did not exist. So this crash cannot be read. What remains: the NEXT crash made
readable — two admin registry values, his hand (`AlwaysKeepMemoryDump` 1 · `CrashDumpEnabled` 2, a small kernel dump that always
fits) — and the memory test.
*(§52, continued, 2026-11-07 17:00)* His two admin lines are in (CrashDumpEnabled 2 · AlwaysKeepMemoryDump 1 — the next crash
leaves a small dump that is kept). The Windows Memory Diagnostic ran at his reboot, 16:58: **no errors**. So the RAM is cleared
as far as that test goes; the Oct 28 corrected cache errors stand on the CPU side. Nothing more to do until a next crash, which
would now be readable.
*(§52, continued)* *"is there a way to disable the real phones until we need it?"* — yes: the Realphones System-Wide driver is one
PnP device (`ROOT\{818C4061-A772-4B8B-9673-00129F34E083}\0000`, MEDIA class; no service, no startup entry, no process running).
Disabled and re-enabled by `pnputil /disable-device` · `/enable-device` on that id, in an admin prompt — his hand (a system
setting). The Realphones VST in the rack's Monitoring FX is already bypassed (§17) and is user-mode, not the driver. The line's
quoting tested in both shells on the harmless `/enum-devices`.

## §53. "What's actually being used in the Reaper file?" — nothing of it: the lab's own project (2026-11-07)

His question at step 1: *"It's loading my old one, which has all the virtual instruments."* What the lab needs of Reaper is ONE
thing: a track whose input is ReaRoute 1/2, where the engine's master leaves (`bank/elec_route.json` return.engineOut 1), monitoring
on, to the master — the ELEC RETURN. Found on the way: **the full rack has no ELEC RETURN track at all** (25 tracks, none the
return): PLAN 1.1 / 6.1's route (`node tools/elec.js route`) was never applied in this piece, so the engine's sound had nowhere to
land even with the rack open — a second reason for "don't hear it", on top of the engine not running. Built: `reaper/icy_lab.rpp` —
the rack's project header, ONE track ELEC RETURN cloned from piece 6's rack (`REC 1 1536 1 2 …`: input 1536 = stereo 1024 + ReaRoute
512 → ReaRoute 1/2; monitoring 1; MAINSEND 1), a new GUID, no instruments, 18 MB → a few KB. STARTUP.md step 1 and the check now name
it; the full rack stays for composing, its missing return noted for when the score first calls the engine (NITS).

## §54. THE SPECTRUM, smooth drone → texture; the smooth end first (2026-11-07, Fable)

His design, verbatim: *"let's just start with the spectrum. I'll ask you to adjust the parameters, but let's make the spectrum like
smooth/drone to texture. And then when we get to the texture, so maybe we do the two ends of the spectrum first. And when we get to
the texture, we explore different textures through different, first probably different grain envelopes, and then maybe some of the
other settings. And then we have like a spectrum slider. So the smooth or drone, I'm thinking about the amazing slow downer piece of
software. That's the software I use mostly to do time stretching. I don't know if you have any insight as to some of the settings
they use or the subtleties of the algorithms or overlaps, etc. Otherwise, we can intuit our own, and this is just like a time
stretching. I'm also thinking about the piece that the composer time stretched, I think it was Beethoven's Ninth. Maybe 1 hour into
24 hours. I don't know if there was any discussion about the algorithms that he used, but let's investigate, and then let's have
settings. And I am also open to adjusting the synth def if we need some additional parameters. But from smooth drone, basically just
very smoothly, you know, time stretched to a large degree, all the way to something that sounds much more textured, like a jet engine
or something like that, yet with a sort of an arc. But anyways, let's work on the smooth end of the spectrum first."* And on the
record: *"let's make sure we continue to journal. This is the sort of composition notes. So the idea is that if at the end of this
piece, when I'm all done, I want to write a paper or a few papers about it, then we have the archive material, the journals for it."*
(It has been kept: §26 … §53 here, the engine's §71 · §72; this entry is the composing's.)
THE INVESTIGATION (web, 2026-11-07): *9 Beet Stretch* (Leif Inge, 2002 at NOTAM; 2004 version) — Beethoven's Ninth to 24 hours; the
software was Bill Schottstaedt's (Wikipedia), i.e. CLM / Snd's granular time-stretch (the "expand"/granulate family: ramped grains
with jitter), so the famous smooth stretch was GRANULAR, like his icy, not a phase vocoder. *Amazing Slow Downer*: nothing published
on its algorithm; a phase-vocoder family (STFT, synthesis hop ÷ analysis hop = the factor; its known artifacts phasiness and smeared
transients). The one algorithm written down for EXTREME smooth stretches is PaulStretch (Nasca): very large windows (seconds), the
PHASE RANDOMIZED every frame (no phase coherence → no periodic artifact, "whisperization" at factor 1), Hann windows, heavy overlap;
Csound's opcode takes the window in seconds. The granular reading of that lesson, for icy: LONG grains · MANY overlaps · a SOFT window
(hanning / gauss, no attack) · the hop's periodicity BROKEN by length variation and a little scatter (a fixed hop with identical
grains rings at the hop rate — the flutter the engine's §60 measured at 3 … 8 dB). The textured end is the opposite: short grains,
few overlaps, expodec's attack, large scatter.
THE SMOOTH END, three proposals in the menu (`electronics/score/icy_menu.json`, new — the menu for every piece): A glass (1.2 s · 32 ·
hanning · vary 0.25 · scatter ±15 ms) · B softer (2.0 s · 40 · gauss · 0.3 · ±30 ms) · C washed (1.5 s · 48 · hanning · 0.4 · ±50 ms),
beside the default (Approaching's 0.6 · 17 · expodec). The procedure: he plays a sample from the page at the default; at his word
the AI sends a setting to his engine (`node electronics/tools/osc.js send /le/icy do=set …`, 57211) and he listens; his words go here.

## §55. HIS EAR ON THE SMOOTH END: "none of them sound terribly smooth" — the granular limit named (2026-11-07)

The buttons reached the engine (the three settings and the default heard, the page's gray line and the engine's "set" lines) and
his verdict, verbatim: *"I think the issue might be the implementation, not the speed. So let's work on that. None of them sound
terribly smooth. What I'm looking for, the results I get in the amazing slower downer, or when I listen to that stretched
Beethoven's Ninth, sounds literally like a really, really slowed down version. All of these have some sort of oscillation in them.
Is it perhaps the grain lengths aren't long enough? You mentioned the research to me, but it didn't really surface details about the
parameters you should be using. And these ones aren't right. What I'm looking for is to be able to hear like a extreme zoom in. So
in the case of Beethoven's Ninth, it's like I'm sitting in the chord and the timbres and textures are changing very, very slowly.
Here, all I hear is the sort of jitter oscillation of the algorithm. I'm just hearing sort of a pulsing, jittering thing, almost like
a stutter."*
THE DIAGNOSIS: what he hears is the granular method itself, not a setting. Every grain is a copy of the same stretch of waveform
started at a slightly different time; copies of one waveform summed at offsets BEAT with each other (comb filtering that moves as
the offsets move), and the grains arrive at a rate (overlaps ÷ length: 27 … 32 a second here) that rides on the sound as a flutter.
Longer grains do not remove either; they slow the beating. The engine's own measurement of his icy said the same (§60 there: a
stretch's flutter 3 … 8 dB at 40 ms, "the algorithm's nature"). *9 Beet Stretch*'s smoothness and PaulStretch's come from the SPECTRAL
method: a long window's MAGNITUDES kept, its PHASES thrown away and drawn fresh every frame, Hann overlap-add — no two frames are
copies of one waveform, so nothing beats and nothing pulses; the timbre sits still and moves only as the window moves. The
machine has it: the standard FFT UGens (PV_Diffuser: fresh random phases on a trigger) and Josh Parmenter's PV_RecordBuf ·
PV_PlayBuf (sc3-plugins, installed). THE PROPOSAL (built next): a third voice, \leIcyStretch — PaulStretch in the engine: each
sample analysed at load into spectral frames at a few window sizes; the voice plays the frames at 1/slowerBy with the phases
randomized every frame, Hann, two chains for stereo; its knobs windowSeconds · slowerBy · readFrom / readTo · level — nothing else,
by design. The grain voice keeps the textured end; the spectrum slider will cross between them.

## §56. THE STRETCH VOICE BUILT — the drone end, PaulStretch in the engine (2026-11-07)

§55's proposal built and proven headless (the engine's §73): three "drone" buttons on the page — A 0.74 s · B 1.49 s · C 2.97 s
windows, all ×30 — the sample's spectrum played slowly with the phases drawn fresh every frame; nothing granular in it. The first
press of a drone button on a sample pauses about a second (the analysis), then sounds. His engine must be restarted to have it.

## §57. STATIC FILES — the grabs by PaulStretch, offline, at full resolution (2026-11-07)

His turn, verbatim: *"I actually also realized that these don't need to be real time. So can you produce for me … as high
resolution, bitrate, etc., examples of the samples that you took … And algorithm we're working on now is fine. We can just keep it.
It might be interesting later if, when I have a little bit more time to explore, especially if I want to do things in real time.
Let's try it and see if it produces good results. Otherwise, I can just produce static sound files using amazing slowdowner. No,
those ones aren't, still aren't quite in. Let's go with static files."* So the live voices stay for later; the material for the
piece is rendered. Built: `live-electronics-engine/corpus/paulstretch_render.py` — Paul Nasca's algorithm as his Python reference
has it (his (1 − x²)^1.25 window, every phase random, inverse windowed, overlap-add at half a window, the read advancing half a
window ÷ the factor per hop; stereo with independent phases) — the twelve grabs × ×30 · ×50 · ×100 × windows 0.25 · 0.5 · 1.0 s
(a window longer than the one-second grab is one unmoving chord of it; shorter moves through it), 24-bit WAV at 44.1 kHz, each at
its grab's RMS under −1 dBFS: `bank/set/2025-04-08c/stretch/` (108 files, on disk; `manifest.json` in git). Named
`<grab>-w<window>-x<factor>.wav`.

## §58. His Slow Downer recipe — 20 %, three or four times over — and how to batch it (2026-11-08)

His word, verbatim: *"it looks like I can only use it on the Mac, which is fine, but what I've been doing is it only slows down to
20%. And so I did it 4 times, I guess. So I'll probably do it somewhere between 3 and 4 times. Is there any hack or anything that can
be done to do it all at once? And then could you see, if not, is there a way to batch it so I can do all those files the 3 or 4
times to 20%? I'm currently on Windows now, and I have just a demo version here."* (The licence: one email, 2020, the Mac version —
unlocked by a package tied to his Mac account, no serial; the Windows demo saves nothing.) So his material to date is a COMPOUND
stretch: a phase-vocoder music stretch applied 3 … 4 times at 20 % — ×125 or ×625 — the smearing compounding at each pass. That
is the sound he calls smooth. The Slow Downer itself has no batch and no command line. THE HACK: Rubber Band — the same family of
algorithm (a phase vocoder made for music; its floor 1 % a pass) — is inside this machine's ffmpeg (`-af rubberband`), so the recipe
runs exactly, N passes at 20 %, for every cut in one command: `live-electronics-engine/corpus/slow_passes.py` (transients smooth ·
window long · smoothing on; 24-bit). Not the Slow Downer's own code: the same kind of sound, not identical — one cut to be heard
against his own 4-pass result. First run: the twelve lab cuts at 3 and 4 passes (×125 · ×625) → `bank/set/2025-04-08c/slow/`.
*(§58, continued)* The batch, measured before trusting it: ffmpeg's rubberband filter does not flush its last block — a 1 s cut at
20 % came out 3.62 s, the END of the material gone (3 passes 82 s instead of 125). Fixed in `slow_passes.py`: each pass pads the source
with 2 s of silence and trims the result to the exact length (1 pass → 5.000 s, the sound running to 4.89 s). The twelve cuts rerun:
24 files, ×125 (125 s) and ×625 (625 s), 24-bit, in `bank/set/2025-04-08c/slow/` (1.5 GB on disk, not in git).

## §59. THE FIRST BED SEGMENT — r1-t190.0 at ×625, 4:00 … 7:00; the tremolo begins on it (2026-11-08)

His word, verbatim: *"r1-t190.0-x625 4:00 - 7:00 And you clip this one, the four pass, at this time with just a small fade and a in
and out, so there's no clipping. And let's use that segment for, let's start in on the tremolo. And I'll give you some other cuts
later."* So the first material for 1a.5 is chosen by ear from the batch of §58: the cut at 3:10 of the session (r1-t190.0, region 1,
18 attacks), stretched ×625 by four passes at 20 %, its minutes 4 … 7. Cut: `bank/set/2025-04-08c/bed/r1-t190.0-x625-4m00-7m00.wav`
— 180.000 s, 24-bit, a 250 ms fade in and a 500 ms fade out (the fades are his "small"; moved at his word). A first cut came out
SILENT: with `-ss` placed after the input, ffmpeg keeps the source's timestamps (240 s …) and the fade-out at "179.5 s" fell before
the whole cut — the seek goes before the input. The lab's 1a.3 (the sources) is, for now, this: static files by his Slow Downer
recipe; the live icy voices stay for later (§57). NEXT: 1a.5 THE TREMOLO on this bed — the drums' capture on depth and speed.

## §60. 1a.5 BEGINS — the first tremolo renders: the drums' capture on depth and speed, on the bed (2026-11-08)

The bed: §59's segment (r1-t190.0 ×625, 4:00 … 7:00, 180 s). The driver: THE DRUMS' CAPTURE AT REAL TIME — the analysis's per-second
density (attacks/s) and loudness (dB) and its onset times, read from 2:30 of the session for the bed's length (2:30 … 5:30 takes in
the session's busiest stretch, 3:00 … 3:25) — so the drumming keeps its own pace, and the tremolo breathes with it; 140 accents (the
louder third of 424 onsets) in the window. Rendered offline (`live-electronics-engine/corpus/tremolo_render.py`; a raised sine on the
level, its phase accumulated from the moving speed so a change never clicks), THREE MAPPINGS, his "restrict the parameters" kept to
two knobs: **A** speed ← density (0 … 10/s → 2 … 14 Hz, smoothed 2 s) · depth ← loudness (−50 … −20 dB → 15 … 90 %, smoothed 1 s) —
came out 2.3 … 8.3 Hz, 15 … 82 % · **B** the swap (speed ← loudness 2.0 … 11.8 Hz · depth ← density 16 … 55 %) · **C** = A, and every
accent kicks the depth to 100 % for 150 ms, falling back over 400 ms. `bank/set/2025-04-08c/tremolo/trem-{A,B,C}-…-from150s.wav`,
24-bit, each with a `.json` of its curves at 10 a second (for drawing). Waiting on his ear: does any of them have "the flow of my
performance … clustering, density and intensity, organic wave like flow" (SW-2)? Everything here is a knob: the window of the drums,
the ranges, the smoothing, which curve drives which.
*(§59, continued)* His second segment: *"3:45-9:30 r3-t071.2-x625-4pass"* → `bank/set/2025-04-08c/bed/r3-t071.2-x625-3m45-9m30.wav`
(345 s; the cut at 1:11 of the session, region 3, 14 attacks; the same fades).
*(§59, continued)* His third segment: *"r2-t124.8-x625-4pass lets use the whole except there is some silence at the end"* → the
file's sound ends at 613.547687 s of 625 (the stretched tail of the cut's own fade); cut to 613.048 s with the same fades:
`bank/set/2025-04-08c/bed/r2-t124.8-x625-whole.wav` (the cut at 2:04 of the session, region 2, 19 attacks).
*(§60, continued)* His first adjustment, before the depth: *"Can we try but with a greater max speed? Let's see what 20 hertz sounds
like. And we'll just keep the 2 hertz min."* Rendered: A · B · C again at 2 … 20 Hz (`…-s2-20.wav`; the 2 … 14 files kept as
`…-s2-14.wav` in name only — the earlier files keep their first names). Depth untouched.
*(§60, continued)* His ear on the 2 … 20 Hz set: *"Let's just stick with A. And I want the fast ones. I can't really hear the fast
ones, so it's probably a depth issue. Let's have like move up the minimum depth. I want the fast parts to sound like it's not exactly
a buzzsaw, but that's a bit of the idea. I want to really be able to hear the fast parts a little bit more pronounced. So maximum
depth is probably okay, but more min depth. And if it turns out that they converge, then we can increase the maximum as well."* So:
A only; depth 50 … 90 % (the floor up from 15); and the speed scale set so the window's own busiest second reaches 20 Hz (the drums
peaked near 6 attacks/s, so 20 Hz was never reached at a 0 … 10 scale). `trem-A-…-s2-20-d50-90.wav`. The depth's floor is the knob
he will move next; the ceiling after, if the two converge.
*(§60, continued)* His ear on d50-90: *"that's not bad, but let's just see what it sounds like to move both the min and max depth up.
… But I also want to hear a version that's controlled by another instrument. But also, are there other parameters? It would be good
to hear maybe the tremolo change, more busy, like more of it. So I don't know if there's other parameters to follow that would make
the flow a little bit more dynamic."* Three renders: A on the DRUMS at depth 65 … 100 % (came out 65 … 96) · A on the PIANO, the
same window and ranges (65 … 91 %; the piano's own pace) · a NEW MAPPING D, "the hits themselves": the speed from the density
smoothed only half a second, the depth from the analyzer's FRAME loudness (11.6 ms, the .npz) smoothed 0.15 s — every hit and every
gap shows in the depth; 65 … 100 %. WHAT ELSE THE CAPTURE HOLDS, to follow: per player, per second — density · loudness · brightness
(the spectral centroid); per frame (11.6 ms) — onset strength · loudness · centroid · flux (how fast the spectrum moves) · density;
and the onset times themselves. Brightness and flux are unused so far.
*(§60, continued)* *"let's add the brightness. And then, as you describe it, and then let me hear all four of them, all four
instruments with those mappings. And can I hear, can you mix the three you just gave me? And let me hear the mix."* BRIGHTNESS → THE
SHAPE: the player's spectral centroid (per second, smoothed 1 s, on a log scale 150 … 3000 Hz) sets how hard-edged the tremolo's
wave is — tanh(k·sin)/tanh(k), k from 0.5 (a sine) to 6 (near square): a dark passage ripples, a bright one chops. Rendered as D +
brightness (`trem-Dbr-…`) on all four players — drums · piano · archtop · baritone guitar — the same window (2:30 … 5:30), speed
2 … 20 Hz scaled to each player's own busiest second, depth 65 … 100 %. THE MIX he asked for: the three d65-100 files he had (A drums ·
A piano · D drums) summed and divided by three — `mix-A-drums+A-piano+D-drums-d65-100.wav` (peak −4.9 dBFS). Waiting on his ear.

## §61. "this last batch algorithms are good" — the D + brightness mapping on all three beds, all four players; the ×625 batch on every cut (2026-11-08)

His verdict and his two asks, verbatim: *"Okay, this last batch algorithms are good. So then can I get um, the sound files I gave
you, the clips I gave you, can I get those done this way using all four instruments? And can you do the four-pass version on the
rest of the clips?"* So THE MAPPING THAT HOLDS, for now: D + brightness — speed ← density smoothed 0.5 s (2 … 20 Hz, scaled to the
player's busiest second in the window) · depth ← frame loudness smoothed 0.15 s (65 … 100 %) · shape ← brightness (a sine when dark,
near square when bright); the drums at real time from 2:30 of the session; the player's window wraps round the session when a bed
is longer than it. Rendered: the three bed clips (§59) × the four players = 12 files `trem-Dbr-<bed>-<player>-from150s-s2-20-d65-100.wav`
(the accents in the window: drums 181 · piano 176 · archtop 198 · baritone guitar 130 for the two long beds). The ×625 four-pass
stretch of the remaining 44 cuts runs in the background into `bank/set/2025-04-08c/slow/` (about 7 GB; the twelve already there
are skipped).
*(§61, continued)* His fourth clip: *"r1-t184.2-x625-4pass Can you trim out the end of this one? I think there's a bit of silence,
or it's quite quiet for a while … process this with the 4 instruments? And then can you make me a mix of 4 instruments, but using
different clips?"* Measured in 10-s blocks: the level sits near −22 dB RMS through 9:20, falls to −31 at 9:40, −40 at 9:50, −54 at
10:00; cut at 9:45 with a 3 s fade → `bed/r1-t184.2-x625-trimmed.wav` (585 s). The four players rendered on it (D + brightness,
as §61). THE CROSS MIX he asked for: four clips, each under a different player — r1-t190.0 under the drums (3:00) · r3-t071.2 under the
piano (5:45) · r2-t124.8 under the archtop (10:13) · r1-t184.2 under the baritone guitar (9:45) — summed from a common start, each
ending in its own time, ÷ 2, peak −6.8 dBFS: `tremolo/mix-4clips-4players-Dbr-d65-100.wav` (10:13).
*(§61, continued)* *"r3-t078.8-x625-4pass same cut end and process 4 trems pls"* — its level −23 dB through 9:00, −29 at 9:30, −42
at 9:50; cut at 9:45 with a 3 s fade → `bed/r3-t078.8-x625-trimmed.wav`; the four players rendered on it (D + brightness, as §61).
Five beds now.

## §62. The four-voice mix — equal excerpts, and how to tell the voices apart (2026-11-08; a talk first, his word)

Verbatim: *"So the four mix, are those all four clips the same length? So just use four different, like the base clips should be
four different ones. I think we have four, at least four now. But the mix should just be excerpts so they're all the same length.
That makes sense. And then is there anything we can do to distinguish the voices a little bit? I don't know if there's anything we
can do with spatialization or anything like that. Discuss with me first, just to make sure we understand what I want and what is
possible."* (§61's cross mix had let each clip end in its own time — 3:00 … 10:13.) Put to him: the restate (four different beds,
each under a different player, cut to ONE length, together from start to end) and the means of telling them apart — a PLACE in the
field for each voice (a position kept as an azimuth, so the quad version is the same four numbers on four speakers, his VBAP wish);
the width of each; the tremolo's own character per player, already different; a touch of distance (level, a little reverb); tone
(a tilt per voice) — the last two change the sound itself and are offered, not recommended. His answer in §63.

## §63. The placed mix — four voices at four angles, three minutes each (2026-11-08)

His word: *"Let's try the stereo placement, or the, I guess it's the vector, and just make it the length of the shortest clip for
now."* Built `live-electronics-engine/corpus/place_mix.py`: a voice's place is an AZIMUTH in degrees (a quad render takes the same
number), rendered to stereo by an equal-power law after the voice is narrowed (width 0.4 — its stereo kept at four tenths); each cut
to 180 s (the shortest clip, r1-t190.0's) with a 2 s fade; the sum ÷ √4. The four, left to right: r1-t190.0 under the DRUMS at −60° ·
r3-t071.2 under the PIANO at −20° · r2-t124.8 under the ARCHTOP at +20° · r1-t184.2 under the BARITONE GUITAR at +60° →
`tremolo/mix-4voices-placed-3m00.wav`, its manifest beside it with the angles. Waiting on his ear: do the voices read apart; the
angles and the width are the knobs.

## §64. The full clips, trimmed; the four players on each; the moving mix (2026-11-08)

His word, verbatim: *"the clips where I gave you like an excerpt, let's grab those full clips and trim where you need to trim
beginning or end. r2-t120.5-x625-4pass This one too, and then do the 4 versions of all of those, please. And then could you make a
new 4 mix with the longer versions? You don't have to include this new one just yet … And can you do some panning too? So instead of
fixed location, let them move. They can just move at different paces. Let's keep the max quite slow, just so there's continuous
movement of all 4 parts … I don't want to hear too much panning oscillation. I just want them to be in motion."*
TRIMMED by a level profile (`live-electronics-engine/corpus/trim_quiet.py`: 10-s blocks, the body = the median of the middle half, kept
from the first to the last block within 8 dB of it, half a block of grace, fades 0.25 / 3 s): r1-t190.0 → 0:00 … 9:35 (575 s) ·
r3-t071.2 → 0:00 … 9:25 (565 s) · r2-t120.5 → 0:00 … 9:25 (565 s) — `bed/<clip>-x625-full.wav`; every one begins at its start (the
quiet is only at the end). The four players rendered on each (12 files, `trem-Dbr-<clip>-x625-full-…`).
THE MOVING MIX: `tremolo/mix-4voices-moving-9m25.wav` — 565 s (the shortest of the four longer versions), the same four voices as §63
in their longer form (r1-t190.0 / drums · r3-t071.2 / piano · r2-t124.8 / archtop · r1-t184.2 / baritone guitar; r2-t120.5 left out
at his word), each place a SLOW SINE round a centre: drums −45° ± 40° every 150 s · piano −15° ± 45° every 190 s · archtop +15° ± 45°
every 230 s · baritone guitar +45° ± 40° every 170 s, the phases spread (0° · 90° · 200° · 300°) — the fastest crossing of the field
takes over a minute; all four always in motion, never together. Width 0.4. The angles and the motion are in the manifest beside it,
for the quad. Waiting on his ear: the pace of the motion, the swings, the centres.

## §65. THE STUTTER — in tuplet steps, three envelopes (2026-11-08)

His word, verbatim: *"can you develop a stutter tool, and you can use any of these same clips or any of the clips we've made, and
same thing, you can use the variety of instruments or just one or two, or you can change them up. I just want to hear samples mostly
of just the stutter algorithm. I think we built one already. And then can you make a version that uses the, like a granular, like
the perk envelope? And then can you make one that uses the expo deck envelope? And I want the stutter to jump around in steps. And
what I mean by that is like tuplets almost. So if I had notated tuplets, like 7 in 1, and then a few beats of 9 in 3 or 9 in 2, etc.
6 in 1 or 13 in 11, these sorts of things. So a few beats of each, and then the jumping around. So there's like steps, but in complex
relationships. So it doesn't sound like it's just speeding up or slowing down. And then I'll have maybe a variation. You can re-roll
a version with each of those different envelopes and the original stutter and any other recommendations that you think might be
interesting."* THE LINEAGE: the stutter exists three times — the workshop's stutter lab (2026-09-02: a selection re-triggered at a
tempo; seven tracks in whole-number tempo relations, "numbers, not tempos" — 120 · 7 9 13) · the engine's buffer override (DEC-17,
Destroy FX's idea: forced buffers, the first mini-buffer repeated) · Sýnthesi Alpha's override unit with the rate on a curve. THE
TOOL (`live-electronics-engine/corpus/stutter_render.py`, offline): at a step's start a slice of the bed is taken at the playhead and
repeated till the step ends; the repeat's period is the tuplet's, beat·m/n (7:1 at a 1 s beat = 143 ms; 13:11 = 846 ms); a step lasts
2 … 5 beats; the tuplets are drawn denser and sparser by turns so the rate never walks one way. Three envelopes on each repeat:
orig (the override's — the slice as it is, 5 ms crossfades) · perc (2 ms up, an exponential fall to −60 dB over the repeat) ·
expodec (his gEnv_expodec, resampled to the repeat). STEERED (the recommendation): the steps change at a player's accents, the
tuplet drawn from the denser half when the player is busy. Renders in §66.

## §66. The stutter renders — fifteen 90-second samples (2026-11-08)

`bank/set/2025-04-08c/stutter/`, each 90 s at a 1 s beat, the stutter alone at the bed's level: on r1-t190.0 (full) seed 1 — orig ·
perc · expodec (27 steps: 5:1 14:3 5:1 14:3 6:1 3:1 8:1 7:2 6:1 13:11 7:1 11:3 …) · the same three re-rolled, seed 2 (25 steps) · on
r2-t124.8 (whole), seed 3, the three (26 steps) · STEERED by the drums on r1-t190.0 (the steps at 36 accents of the drums' 2:30 … 4:00,
denser tuplets when busy; the three envelopes) · steered by the piano on r3-t071.2 (26 accents; the three). The steps of each are in
a `stutter-steps-….json` beside the files. Waiting on his ear: the envelopes against each other; the fixed steps against the steered;
the beat (1 s) and the step length (2 … 5 beats) are knobs, as is the set of tuplets.

## §67. The stutters rejected; TUPLET NOTES instead; the stutter managed by the capture; an orchestrator for the four-mix (2026-11-08)

His two messages, verbatim. First: *"let's try to use the analysis, the different instrument parameters to manage the stutter. And
then can we do the same or use some analysis data to create an orchestrator for the, or various orchestrations, but for that
formix, that's pretty good … sometimes it's just one part playing, sometimes there's duets, you know, there's a decent amount of
the full group playing, things like that. And then let me hear a version, please."* Then, on hearing §66: *"those stutterings aren't
working. Let's try to make something that sounds like, I think it's the envelope. So basically, like, sounds like some instrument
that's playing, like I described, like various tuplets. So if I was to notate it out, say for the trumpet or say for the violin or the
piano, I might do like a 2 beats of 5 and 1, and then 1 beat of 3 and 2, and then 4 beats of 15 and 9 or something like that, etc. So
that it sounds like I guess it's something about the attack and then the duration. So like the whatever 3 and 2 would have longer
durations, I guess. And then I guess use the analysis to do some sort of more of the distribution of the tuplets. But if you can,
give some, try some things there to make the attack sound better and to have that variable length too. But sorry, the three we
tried, I don't think those work that well. The original stutter, nor the perk, nor the expo deck."*
THE READING: not a stutter (a sliver repeated) but NOTES — each an attack and a duration, the durations long in slow tuplets and
short in fast ones; an instrument phrasing. Built `live-electronics-engine/corpus/tuplets_render.py`: a tuplet is a run of notes a
slot of beat·m/n apart; a note's duration = the slot × a legato share (3:2 held 90 %, 13:1 55 %); the note's envelope a 4 ms rise to
a peak, a 50 ms fall to the sustain (−5 dB) — the bite of a bowed or blown attack — held to the duration, released over 12 % of the
slot. Two modes: GATE (the bed runs on underneath, each note a window onto it — the bed phrased) · RETRIGGER (each note from the
tuplet's own first slice — the stutter's way, shaped). Steps of 1 … 4 beats, dense and sparse by turns; or steered: the steps at a
player's accents, dense tuplets when busy, the level by loudness. THE STUTTER MANAGED BY THE CAPTURE was built too, before his
verdict (`stutter_render.py --follow`: the envelope by brightness, the level by loudness, the steps at the accents) — two renders in
`stutter/`, kept for the record. THE ORCHESTRATOR: `orchestrate_mix.py` — each voice of the four-mix sounds while ITS OWN PLAYER was
playing in the session (their loudness within 6 dB of their own median, smoothed 3 s, read at real time from 2:30 and wrapping),
faded over 2.5 s; so the solos, duets, trios and tutti are the session's own — who played with whom, when. Its first run was
stopped: a 2.5-s smoothing convolved at audio rate took longer than the music; smoothed at 20/s now. Renders in §68.

## §68. The renders: tuplet notes (eight) and the orchestrated mix (2026-11-08)

TUPLET NOTES, `bank/set/2025-04-08c/tuplets/`, 90 s each at a 1 s beat: on r1-t190.0 (full) seed 1 — gate · retrigger (38 steps: 6:1 11:2
13:2 6:1 7:1 7:3 9:1 5:2 6:1 3:2 …) · seed 2, both modes (33 steps) · steered by the DRUMS on r1-t190.0 (21 accents → 22 steps, the
level by their loudness), both modes · steered by the PIANO on r2-t124.8 (20 → 21), both modes. THE ORCHESTRATED MIX,
`tremolo/mix-4voices-orchestrated-9m25.wav` (565 s, the same four voices and motion as §64): the session's own texture over the window
2:30 … 11:55 (wrapping at 6:38) — silence 50 s · one voice 87 · two 154 · three 156 · all four 118; on-time by player: drums 65 % ·
piano 56 % · archtop 66 % · baritone guitar 49 %. Also finished: the ×625 four-pass stretch of all 56 cuts (`slow/`, 44 more files).
Waiting on his ear: the tuplet notes — gate against retrigger, the attack, the durations; the orchestration's floor (6 dB under each
player's median) and fade (2.5 s).

## §69. The set's audio moved to H:; a mastering chain; varied attacks for the gate tuplets (2026-11-08)

His word, verbatim: *"Extreme SSD H: I'm running out of space. Can you move all the audio to a folder here? I don't think any of
it is hitting the repo anyways, right? … And then can, since these will probably end up being static files, so that orchestrated
one is good … can we work out some sort of mastering chain, even if we have to do it in Reaper? … it is a little quiet, I think, at
times. Maybe some sort of basic mastering application. And then I think the gate one works the best. Can we vary it a little bit in
just having some sort of variation amongst the attacks, I guess, some variety of attacks?"*
THE MOVE: right, none of it was in git (`bank/set/.gitignore`); 457 audio files, 16.5 GB, moved whole by robocopy to
`H:\switch_2026\audio\set-2025-04-08c\` with the same sub-folders; nothing left on C:; the data (json · html · md · the drawn capture)
stays in the repo; `samples.json`'s `dir` points to H: (the icy lab's engine loads from there); `AUDIO_ON_H.md` says so. The tools
write to H: from here.
THE MASTERING CHAIN (`live-electronics-engine/corpus/master_mix.py`, round the workshop's `tools/master.py` — piece 6's bus on a file:
the soft-knee compressor "to its own loudness", the true-peak look-ahead limiter): compressor → a gain to a LOUDNESS TARGET,
integrated EBU R 128, −16 LUFS for listening (a hall keeps its own fader) → the limiter at −1 dB true peak → 24-bit. First master in
§70. THE ATTACKS (`tuplets_render.py --vary`): every note's rise 2 … 14 ms, fall 25 … 120 ms, bite 3 … 9 dB over the sustain, its
length ±15 %, one note in six accented +3 dB. Renders in §70.

## §70. The first master, and the varied gate tuplets (2026-11-08)

THE MASTER of the orchestrated mix: `H:\switch_2026\audio\set-2025-04-08c\tremolo\mix-4voices-orchestrated-9m25-master.wav` — the mix
measured −26.8 LUFS integrated (his "a little quiet": eleven decibels under a listening level); the compressor left its loudness at
−27.0 (it works on the range, not the level); the gain +11.0 dB; the limiter held the true peak under −1 dB; −16.0 LUFS after. THE
VARIED GATE TUPLETS (`…\tuplets\tuplets-gate-varied-…`): the fixed steps (seed 1) · steered by the drums · steered by the piano — the
same steps as §68's gate files, every note's attack now its own. Waiting on his ear: the master's level and whether the compressor is
wanted at all (it is a dial); the varied attacks against the even ones.

## §71. THE HITS — individual attacks from the stems and the mix, an auditioning page (2026-11-08)

His turn, verbatim: *"For the tuplet, for the bed, let's use, instead of those stretched ones, let's use just actual samples. So if
you could get a variety of samples from the mixed one and from each of the individual instruments, and just let me hear them. If you
can put them into some sort of auditioning page … the samples need to be longer than the longest gate … we can have like the
semblance of repeated notes. So each tuplet grouping should be one of the samples, but we'll do that next. Let me just hear the
individual hits."* Built `live-electronics-engine/corpus/hits_cut.py`: per player, the onsets weighed by the loudness at their frame
(the .npz), the strongest in each of 16 equal slices of the session, ≥ 1.5 s apart — cut from the player's OWN STEMS, 10 ms before
the attack, 1.5 s long (longer than the longest note, 3:2's 667 ms at a 1 s beat), faded; from the MIX, 16 at the session's loudest
moments across all four. 80 hits, 24-bit → `H:\switch_2026\audio\set-2025-04-08c\hits\<player>\nn-m-ss.ss.wav` + `index.html`. The
lab server now serves his drive at `/files/` (`--files`, in `start_icy_lab.bat`), so the page is
`http://localhost:5620/files/hits/index.html` after he restarts the server. Proven on a throwaway port: the page 200, a hit as audio.
Next, at his word: the tuplets on these — one hit per tuplet group, repeated notes.

## §72. A GRANULAR BED from the hits — jitter where it counts; a few settings to hear (2026-11-08)

His word, verbatim: *"I want to create another like base layer of sound using granulation. So let's try using just an assortment of
these samples, like the different instruments. You don't have to make too many, maybe just a few. So we can narrow down what
granulation we should use. I want to experiment with changing the read head speed a little bit without necessarily feeling like it's
explicitly speeding up or slowing down, so maybe relatively gradual changes. But let's have some that don't use a variable read head.
And then I want to hear texture, but not oscillation or repetition if it's possible … what happens is the grains and the grandeurs
and become dominant. The grandeur types and repetition becomes dominant. So it just sounds like the grain. So if we can have some
jitter where it counts. And then let's stick with Expo Deck, Rexpo Deck, and the perk. And then maybe experiment with different
grain overlaps and the pointer jitter and anything grain lengths too."*
THE DESIGN against repetition (`live-electronics-engine/corpus/granular_bed.py`): the grains are NOT on a clock — each start waits a
random time (exponential, mean = length ÷ overlap) so no hop rate rides on the sound; each grain's start strays ± scatter from the
head, its length ± vary, its pan and its level random; the head crawls through one hit at 1/speed and on to the next of an
assortment (eight hits, two per player and two of the mix). The head fixed, or WANDERING: a slow random walk between two speeds
smoothed over 20 s, by equal ratios, never a ramp. Six settings, 60 s each: G1 the reference (expodec · fixed ×12 · 80 ms · overlap 6 ·
±30 ms) · G2 rexpodec · G3 perc · G4 expodec with the head wandering 6 … 30× (150 ms · 10 · ±60 ms) · G5 a smooth cloud (300 ms · 20 ·
±100 ms) · G6 a gritty texture (30 ms · 2 · ±15 ms). Renders in §73.

## §73. The six granular beds rendered (2026-11-08)

`H:\switch_2026\audio\set-2025-04-08c\granular\granular-G1 … G6-<envelope>-seed1.wav`, 60 s each, ~4,000 grains each over the first four
hits of the assortment (drums 01 · piano 03 · archtop 05 · baritone guitar 07 — at ×12 a 1.5 s hit takes 18 s), with `index.html`
(`http://localhost:5620/files/granular/index.html`) and the manifest. Waiting on his ear: which direction — envelope, head, grain
length, overlap, scatter — and whether the repetition is gone.

## §74. The six beds "a bit samey"; three contrasting sets (2026-11-09)

His ear on §73, verbatim: *"the granular beds, the last three are quite good, but all six of them are a bit samey. Is that because
of the underlying samples used? … produce a few sets, maybe two or three more sets, each of them rather contrasting. And I'm not
sure, I suspect it's a granulation, but it could be just using different samples. But I suspect, well, let's just say it's the
granulation."* The AI's reading: both — the six shared one speed (×12, so sixty seconds covered the same first four hits), one pitch
(as recorded), one envelope each, and a narrow band of densities. THE LEVERS PUSHED TO THEIR ENDS, three sets of two: **A sparse and
slow** — the head near frozen (×60; A2 wandering 40 … 90×), grains 0.7 … 0.9 s with GAPS between them (overlap ~1), scattered ±0.3 …
0.4 s, the whole width, expodec and rexpodec mixed per grain, A2 half its grains an octave down. **B fast and pitched** — the head at
×3 (the playing shows through; B2 wandering 2 … 6×), short perc grains 25 … 40 ms, each at one of a few PITCHES (unison · octave up ·
octave down · a fifth; B2 up to two octaves up) — pitch is a lever he does not usually touch, so it is named on the page. **C dense
roar** — 10 … 15 ms grains, thirty to fifty at once, scatter ±0.15 … 0.25 s, each a little off pitch (±2 st; C2 ±7), a continuous
wall. The hits differ per set too (A: the slow sustained ones — piano · baritone guitar · mix; B: drums and archtop; C: all four) so
the two causes can be told apart on the page. Renders in §75.

## §75. The three contrasting sets rendered (2026-11-09)

Six more beds beside the first six, on the one page (`/files/granular/index.html`): A1 · A2 (the head so slow that sixty seconds stay
inside ONE hit, piano 03 — 102 and 62 grains in all, each 0.7 … 0.9 s, gaps between) · B1 · B2 (the head at ×3 runs through 13 … 14
hits of the drums and the archtop in a minute; 4,500 and 9,500 perc grains at four pitches) · C1 · C2 (118,000 and 295,000 grains of
10 … 15 ms, thirty to fifty at once, over three hits of all four players). Waiting on his ear: which set, which lever.

## §76. A keep folder; three more orchestrated mixes; the tuplets on SINGLE ATTACKS (2026-11-09)

His word, verbatim: *"let's have like a, I don't know, like a keep folder or materials folder. We can keep that orchestrated for voice
mix. And can you produce, say, 3 more using 4 new sound files and, you know, doing the whole thing, clipping it and running each
through a different tremolo algorithm and then doing an orchestration, and then put all 4 of those mixes into a set-aside folder …
In the granular bed, I think I'll just keep it as its own thing. Those are pretty good … However, that still leaves the sort of
tuplet version. So let's, those individual hits I think are too long to be used in the stutter. They should be like a handful of
single attacks … I like the gated version. I wanted a slightly more mix of attack times, I guess, or attack shapes, so they don't
all sound the same. But I want the sort of impression of like let's say it's the trumpet. They're doing a few beats of the same note,
so they would do like a quintuplet of C, and then they move to like 3 beats of 3 and 2 of F# or whatever, and the equivalent would be
the actual one attack … I think the issue with those individual hits is they're actually long enough to encompass like several
attacks."*
THE KEEP FOLDER: `H:\switch_2026\audio\set-2025-04-08c\keep\` — the orchestrated four-voice mix, its master and its recipe moved in.
THREE MORE MIXES (`tools/set_mixes.py`, this piece's — the recipe is the set's): sets 2 · 3 · 4, four NEW clips each (one per busy
region and a fourth: 2 = r1-t182.0 · r2-t110.0 · r3-t070.0 · r1-t198.8; 3 = r2-t116.0 · r3-t075.0 · r1-t194.0 · r2-t123.8; 4 =
r3-t073.2 · r1-t187.2 · r2-t113.8 · r3-t077.2), each trimmed by its level profile, each clip under a DIFFERENT mapping (A · B · C ·
D+brightness) and a different player, orchestrated by the session's texture with the moving places, mastered to −16 LUFS; the mix,
its master and a recipe file into `keep/`. Running as this is written. THE TUPLETS ON SINGLE ATTACKS: `attacks_cut.py` (the
workshop's) — per player the two strongest onsets whose next onset is far enough away to hold ONE attack, cut 5 ms before to at most
400 ms (`attacks/`, with a page); `tuplets_render.py` mode **hit**: every note of a tuplet group is one of those attacks, the group's
own (drawn per group, never the same twice running), shaped by the varied note envelope — a player repeating a note, then another
note. Rendered on the fixed steps and on the drums' accents (`tuplets/tuplets-hit-varied-…`). Renders in §77.

## §77. The single attacks and the tuplets on them (2026-11-09)

Eight single attacks (two a player: the strongest onsets with room after them), 70 … 400 ms each, `H:\…\attacks\` with a page
(`/files/attacks/index.html`). The tuplets in HIT mode, varied attacks, 90 s: `tuplets/tuplets-hit-varied-r1-t190.0-x625-full-seed1.wav`
(38 steps; the groups drew drums 2 · baritone guitar 1 · archtop 2 · piano 2 · archtop 2 · …) and `…-drums-seed1.wav` (the steps at the
drums' accents, the level by their loudness). Waiting on his ear; set 2 … 4's mixes render in the background for the keep folder.

## §78. The keep folder holds four mixes (2026-11-09)

`tools/set_mixes.py` done: set 2 → `mix-set2-orchestrated-8m55` (r1-t182.0 under the drums by A · r2-t110.0 / piano / B · r3-t070.0 /
archtop / C · r1-t198.8 / baritone guitar / D+brightness; texture: silence 47 s · one 75 · two 146 · three 151 · four 116) · set 3 →
`mix-set3-orchestrated-9m05` (r2-t116.0 / archtop / Dbr · r3-t075.0 / drums / B · r1-t194.0 / baritone guitar / A · r2-t123.8 / piano / C)
· set 4 → `mix-set4-orchestrated-6m35` (r3-t073.2 / piano / Dbr · r1-t187.2 / archtop / A · r2-t113.8 / drums / C · r3-t077.2 /
baritone guitar / B; the shortest clip 6:35). Each with its master (−16 LUFS, +10.7 … +11.8 dB) and a recipe file. With the first
(§64 · §68), FOUR orchestrated mixes in `H:\switch_2026\audio\set-2025-04-08c\keep\` — the materials.

## §79. His picks among the granular beds; the FUND OF MATERIALS and the road to the electronic score (2026-11-09)

His word, verbatim: *"the bs and c2 and then g4-6 And how do you recommend creating a fund of materials? So the bigger picture is what
I want to do now is once I've compiled these and made versions, I want a folder of materials, and then I want to use something like
the composer score and arrange them, basically compose an electronic score, and then I'll layer on the instrumental voices. So first,
I guess the first one is generating the granular bed ones. I don't want to be overwhelmed by them. Generate like the ones you put in
there are great, maybe just longer, and then generating some more materials, a few granular beds. We already have the tremolo ones
done. And then I'll work on the tuplet ones. I don't think we need additional articulation for the granular ones because those can be
like final materials."* THE PLAN, as read: (1) the granular keepers — B1 · B2 · C2 · G4 · G5 · G6 — rendered LONG (4 minutes each,
final materials) into `keep/granular/`, plus three more in the same directions (G7 between G4 and G5 with a wandering head and a hair
of pitch drift · B3 a B that goes down · C3 a slower, wider roar); (2) the tuplets, his to settle; (3) the fund gathered; (4) the
electronic score in the composer score — the materials as samples in the piece's bank, placed as return bricks on the electronics
lanes (the engine's existing object), the instruments written around them. The recommendation for the fund is the reply of this hour.

## §80. The electronic score's bricks — editable like MIDI, with fades; planned, not built (2026-11-09)

His word, verbatim: *"in the composer score, I should have some editing ability like I can with the MIDI. So I should be able to
shorten segments or clip them and move them around. And I guess we'll need some sort of, I don't want to build too much structure,
but maybe an easy way to have it, like if I edit one, eventually I'll need it so it has some fade in, fade out kind of thing, so it
doesn't click, if you will. But let's plan it first. You don't have to build anything just yet."*
THE RESTATE: a material placed in the score is a brick like a note — moved by dragging, shortened from either end, split in two,
and every edge fades so nothing clicks. WHAT EXISTS: the engine's return brick (`electronics/score/le_objects.js`) plays a banked
sample WHOLE from its start at its time, through `/le/play` with a level and an envelope (`dyn` · `env`); it is moved like any brick;
it has no offset, no length of its own, no split. WHAT IT NEEDS, as little as holds: per brick an OFFSET into the sample and a LENGTH
(so a shortened or split brick plays its own stretch), and a FADE at each edge (a default of a few tens of ms, set once; longer by
hand when wanted) — the edges dragged as a MIDI note's are, a split key where the playhead stands; the engine's `/le/play` takes
the offset and the length and makes the fades (the envelope it already has). The materials themselves: samples in the piece's bank
(`bank/samples`, the engine's index), long files allowed. Laid out as a PLAN item when he reaches the score (1a.7); nothing built.

## §81. The nine granular keepers, four minutes each (2026-11-09)

`H:\switch_2026\audio\set-2025-04-08c\keep\granular\` with its own page (`/files/keep/granular/index.html`): G4 · G5 · G6 · G7 (the
textures; 14 … 16 thousand grains over 12 … 14 hits) · B1 · B2 · B3 (fast and pitched; the head at 2 … 8× runs through 32 … 56
hits in four minutes, B3 downward) · C2 · C3 (the roars; 1.18 million and 314 thousand grains). Not mastered yet — the beds take the
same pass as the mixes when the fund is gathered, so everything sits at one level.

## §82. The fund's inventory page; where the tuplets stand (2026-11-09)

His ask: *"Do you have the page where you gathered everything up so far? So then I can just take an inventory of what things I have
and what I still need. And … where are we with the tuplets? I didn't see feedback on that yet."* Built `live-electronics-engine/corpus/
materials_page.py`: over `keep/` a catalogue (`materials.json`, one row a material, a `notes` field for his words that survives a
re-run) and a page (`keep/index.html` → `/files/keep/index.html`): the mixes (the masters), the granular beds with their settings, the
tuplets and attacks when they are kept, and a "still to gather" list. THE TUPLETS: nothing is pending on the AI's side — the two
hit-mode renders of §77 (fixed steps · the drums' accents, varied attacks, one single attack per group) are in `tuplets/` waiting
on HIS ear; they are not in the keep folder until he says.

## §83. The pages stall on long files; the groups filled to seven; why four minutes (2026-11-09)

His word, verbatim: *"all the pages. I don't know if it's a loading issue. I sometimes the sound files don't play, and then I can't
advance any of them. And then, can you produce a few more of the B's and C's? … let's treat G, B, and C each as one sort of group …
Let's do like 7 of each … Explain to me where we got the 4 minute length."* THE STALL: the lab server sent every file WHOLE, with no
byte ranges — a browser's audio element seeks and resumes by Range requests, so a 150 MB 24-bit WAV loaded entire, stalled at times,
and could not be advanced. `electronics/tools/icy_lab.js` now answers ranges (206, Content-Range, Accept-Ranges) and streams the file;
his server restart takes it. THE FOUR MINUTES: the AI's choice at §79 — long enough to lie under a whole section of the piece (the
call allows 5 … 15 minutes; a first section of three to five), short enough to render and to listen through (a C roar at four
minutes is over a million grains), and a bed is cut and faded in the score anyway; longer costs render time and disk and gains
nothing a loop or a second bed would not. THE GROUPS: three more G (G8 swells of rexpodec · G9 long and loose · G10 bright, an
octave up) · four more B (B4 sparse and bright · B5 close intervals · B6 the head at ×2 with everything octaves up · B7 everything
octaves down) · five more C (C4 a white roar ±12 st · C5 a roar that keeps its pitch · C6 the most smeared · C7 at two octaves · C8
frozen) — seven of each, four minutes, into `keep/granular/`. Renders in §84.
*(§83, continued)* Ranges proven on a throwaway port (206, Content-Range on a 63 MB bed); the twelve new beds render in the
background. His next word: *"Can I get the tuplets in the page … Maybe just put everything in that same page … And then I can audition
everything there. And then we can decide what's keeper. And you can update."* So the materials page carries a CANDIDATES part under
the keepers — the tuplets, the 60-second granular auditions, the tremolo mixes (fixed · moving) — each with a player; what he names
moves into `keep/` and the page is rebuilt. One page for the whole fund: `/files/keep/index.html`.

## §84. Seven of each — the granular groups complete (2026-11-09)

The twelve new beds in `keep/granular/` (G8 · G9 · G10 · B4 … B7 · C4 … C8, four minutes each); with the nine of §81, seven G, seven B,
seven C — twenty-one beds, 84 minutes. The materials page rebuilt: 25 keepers and the candidates. Waiting on his ear.

## §85. The beds mastered (2026-11-09)

His word: *"the granular bed ones, when you're done, can I get mastered versions of those? They're a fair bit quieter than the keepers
above."* The 21 beds through the same chain as the mixes (`master_mix.py`: the compressor, a gain to −16 LUFS, the limiter at −1 dB
true peak) → `keep/granular/<bed>-master.wav` beside each raw file; the materials page lists the master and keeps the raw beside it.
Running as this is written; the numbers when it ends.

## §86. The tuplets: only GATE VARIED stays; more space, a crisper release, quicker changes (2026-11-09)

His ear, verbatim: *"the tuplets, let's eliminate the varied and re-triggered. Stick with the gate ones. I think there still needs to
be some adjustment. I think they sound a bit too much like the tremolo, especially when it's fast. Maybe something needs to be done
on the release side. I'm not sure. Maybe there needs to be a little bit more space between, even at the fast times, I guess
percentage-wise then. And then could we have quicker change? So like it would be like just a few beats of each tuplet … different
size chunks. So 2 beats and then 6 beats and then 3 beats and then 1 beat … A good variety, but quicker change … you can actually
clear the whole tuplet. None of those are quite it. And just focus on the gate. And it's probably gate varied."* So: the hit and
retrigger modes set aside; the earlier tuplet files moved out of the way (`tuplets/_discarded/`, not deleted); GATE VARIED only,
with three changes in `tuplets_render.py`: the note's share of its slot is now 80 % in the slowest tuplets and 35 % in the fastest
(was 90 / 55 — the fast runs had become a tremolo); the release is an exponential fall over a quarter of the note (was a linear
fade of 12 % of the slot) — a crisper end; the fixed steps draw their length from chunks of 1 · 1 · 2 · 2 · 3 · 3 · 4 · 6 beats.
All three are knobs. Renders in §87.

## §87. The three gate-varied renders (2026-11-09)

`tuplets/tuplets-gate-varied-r1-t190.0-x625-full-l80-35-seed1.wav` (36 steps of 1 … 6 beats) · `…-seed2.wav` (28 steps) ·
`…-drums-l80-35-seed1.wav` (the steps at the drums' accents). The sixteen earlier files in `tuplets/_discarded/`. Waiting on his ear:
the space between notes (the two legato numbers), the release, the chunk sizes.
*(§85, continued)* The 21 masters made: the raw beds sat at −22 … −30 LUFS, brought up 6 … 14 dB to −16.0, peaks held under −1 dB;
the materials page now lists each bed by its master (25 keepers — four mixes and 21 beds — all at one level), the raw files beside
them; the "beds' master pass" line left the still-to-gather list.
*(§85, corrected)* Not all to −16.0: the G and C beds landed at −16.0 … −18.1 LUFS, the B beds at −17.2 … −19.6 — sparse percussive
grains are PEAKY, and the limiter (−1 dB true peak, never overshooting) holds them before the loudness target is reached; the gain the
chain could apply was +6.9 … +14.8 dB. Reaching −16 on the Bs would mean a heavier limit, a dial he can ask for; the masters are
within 3.6 dB of each other, against 8 dB before.

## §88. THE OPENING — one bed, its four stems, their orchestrated mix (2026-11-09)

His word, verbatim: *"In the materials, maybe under its own banner called opening, can I get this file mastered? r3-t078.8-x625-trimmed
And then can you put it through the 4 versions? … just correct me where I'm wrong … Just this file, raw as it is, trimmed and
mastered. And then 4 more versions, but they will have their own Tremolo, and then they will have their own wandering spatialization,
correct? And then those 4 individual files … And then can I get a mixed and orchestrated version too? So I guess that's 6 files
altogether in the opening … I want those as individual stems as well."* RIGHT, with one addition: the four versions are the one bed
under the four PLAYERS' tremolos — the same mapping (D + brightness: speed from busyness, depth from the hits, the wave's shape from
brightness) driven by the drums, the piano, the archtop, the baritone guitar in turn — each placed and slowly moving; and in the
orchestrated mix each voice is also SILENT while its player was silent in the session. So the stems are written exactly as they sit
in the mix — tremolo, gate, place, motion — and the mix is their sum; every file mastered. `keep/opening/`: the raw bed mastered · the
four stems · the mix (and its raw sum). `orchestrate_mix.py --stems`; the materials page gives any sub-folder of keep/ its own banner.
*(§88, continued)* His change of mind before the build was done: *"for the four stems in the opening, is it possible to not leave any
of them silent? … they should be four continuous sounding, just with different sets of tremolo … same bed, they were just doing
different tremolo on the same bed. And then I can layer those in as I will."* So the stems are remade CONTINUOUS — the bed under each
player's tremolo, placed and slowly moving, no gate — and mastered; the orchestrated mix stays gated as it is. And the page: *"get rid
of anything we're not actually using … the candidate granular 60-second auditions"* — off the page (the files stay). The three
tuplets on the page are §87's new gate-varied ones; which work is his to say.
*(§88, done)* The opening: `keep/opening/` — the bed mastered · four CONTINUOUS stems (`stem-<player>-continuous-master.wav`, each
−25.5 … −25.8 → −16.0 LUFS) · the orchestrated mix and its master; a recipe; its own banner on the page (31 materials, 2 h 56 min).

## §89. The tuplets, as he meant them: single samples, a different one every hit; the shaping first (2026-11-09)

His word, verbatim: *"the tuplets one doesn't sound like we're using the, I guess like the sample strategy I mentioned … I was trying
to get you to isolate individual samples that are single attacks in and of themselves. So this sounds like the tuplets are done on
that stretch bed or something more ambient below. I want each individual hit to be an actual individual samples, but I want you to
change the sample every time. So do we need to first preview a few of the samples? … let's get individual samples, maybe a couple of
each instrument, and then … just a few shaping. Either use one of the envelopes or your own envelope on it … to land on the right
kind of shaping. And then after we settle the actual samples, we'll put them into the sort of tuplet gated thing … Conceptually, it's
like they have each their own envelope."* Right: the gate-varied renders are the stretched bed phrased into notes; what he wants is
NOTES MADE OF SINGLE ATTACKS, the sample changing every hit, each hit shaped. First the shaping: `live-electronics-engine/corpus/
shape_attacks.py` — the eight single attacks of §77 (two a player) under five shapes each (natural · perc · gate · expodec · soft), one
page, a row a sample, the shapes across — forty one-shots. Then, at his word: the settled samples and shape into the tuplet machine,
a different sample on every note.

## §90. SW-5 — crescendos and decrescendos on the bricks, by curves (2026-11-09; a note to §80's plan)

His word, noted while the attacks were being shaped: *"I would like the ability to do like crescendos and decrescendos using curves …
probably using my already existing curve … the actual crescendos for the actual instruments, we can reuse those if it's possible. But
just note that for now."* Verbatim in `COMPOSITION_NOTES.md` SW-5. For §80's plan: a brick gets a level curve over its length, and the
first thing to try is the instrument lanes' own curve machinery (curve windows 9 / 10 / 11; the dynamics law) rather than a new kind.
Not built; nothing decided beyond the wish.

## §91. The petals of resonance on the stretched beds — the read of the code, before any build (2026-11-09)

His word: SW-6 (verbatim in COMPOSITION_NOTES). The question he set: *"what needs to be tweaked … designed for like impulse driven …
too much input … if they're so resonant that it doesn't matter what the driver is."* The code read: `SynthDef_petalsOfResonance.scd`
(his original and the 2025 update, `C:\Users\jwloy\GitHub\SynthDef_petalsOfResonance`) and the engine's port, `electronics/sc/process.scd`
`petalsGraph` (UGen for UGen, plus the loop around the bank — the Decibel piece's DEC-40; the engine's §40 · §52 · §57).

What the code does, as it bears on a continuous drive:
- **The input is GATED for an impulse:** `Env.perc(0.02, inputLen)` on the input — the bank hears one second, then rings. The
  output is FADED after ringL2 (`Env.linen(0.01, ringL2, 0.3)`). Both are impulse-shaped; a bed needs both gone (or the gate a slow window).
- **"Too much input" is real and has a number.** A Ringz driven steadily at its resonance reaches a gain of about T·sr/13.8 (the engine's
  own note): at ring 10 s, 48 kHz, about +91 dB, less the bank's −40 dB mix = +51 dB on a partial that the bed holds. His limiter (0.98)
  then pins — one flat mass. The fix is the DRIVE: the bank's input scaled to the ring (the engine's offline road does exactly this —
  driveRef); offline the output is mastered after, so only the limiter's and the loop's behavior depend on the absolute level.
- **"Does the driver matter?"** At ring 7 … 15 s a partial's bandwidth is 6.9/(πT) ≈ 0.15 … 0.3 Hz. The output is the bank's chord; the bed
  supplies ENERGY at those frequencies and its slow level shape — so the bed decides the BREATHING and the BALANCE among the 26 (where
  its spectrum sits), not the pitches. At a short ring (1 … 3 s) the bed's own color comes through the filter. The wobble (±0.5 semitone
  at 0.013 … 0.07 Hz) sweeps each partial's needle across the bed's spectrum — that is the shimmer, and it is the one place the driver's
  fine structure shows at long rings.
- **The loop (poBloom · poDrive · poHold)** is impulse-shaped too: a hold, then a break. On a bed the loop would be HELD (no break), its
  gain set under the bloom so the partials sing without sitting in the tanh — or at the tanh for grit, his choice by ear.
- **His harmony is in the dials:** fund 35 … 150 · firstPartial 2 … 5 · bank offset 2 … 8 semitones · spread 0.33 … 1.33 · ring 7 … 15
  (his own set line at the file's end). The engine already has A DIAL AS A LINE (`value@ms` breakpoints, the Decibel piece's 11.4) —
  moving through settings over one bed is that mechanism; DynKlank glides its frequencies.

Lineage first: the renderer should be his real graph in SuperCollider NRT (the engine's `petalsGraph` with the gate and fade switched
off and the drive set from the bed's loudness), not a Python re-implementation — the loop and its measured gain law exist only there.
Put to him as a discussion; nothing built.

## §92. The tuplets from the attacks: natural, a sample a hit, fast chunks (2026-11-09)

His word, after the shaped page: *"let's give the natural a try, and then, put them through the tuplet machine. I think the change can be
even faster … 3 or 4 beats max, maybe … 3 beats of one thing, and then maybe 1 beat of another, and then maybe 2 beats of another thing,
and then 4 beats of another, and then 2, and then 6 … a long, short sort of contrast, but no single one held too long. Let's try just a
few versions of those with the different samples … a couple with single instrument ones, and then a couple with a mix of all the
instruments, and then maybe 1 or 2 with some select group of instruments."*

Built: `tuplets_render.py` MODE `samples` — every NOTE one of the eight single attacks under its natural shape, the sample changing every
hit (never the same twice running); trimmed to the note's duration with an exponential release only where the slot is shorter than the
400 ms sample (the fast tuplets), else the attack plays whole. `--players` picks instruments by name. The step lengths: no length twice
running (long, short). No bed under it; the level −20 dBFS RMS. Six versions, 60 s each, a 1 s beat, in `tuplets/` (listed under
CANDIDATES on the materials page): drums alone (seed 1) · piano alone (seed 2) · all eight (seeds 3 · 4, chunks 1 2 3 4 and 1 1 2 3 4 6) ·
drums + baritone guitar (seed 5) · piano + archtop (seed 6). With two attacks a player, a single-instrument version alternates its two.

## §93. SW-7 — the opening's shape, said while the tuplets were auditioned (2026-11-09)

His composition note, verbatim in `COMPOSITION_NOTES.md` SW-7: the opening files (`keep/opening/`) under live instruments beating against
sine tones (piece 6's device); then the tremolo versions with trills at other intervals or ostinati in piece 2's manner; the whole tight,
brisk, full of change, each thing short. Noted; no build follows from it yet — it shapes how the bricks are laid when the composer score
takes the electronic materials (§80).

## §94. SW-8 — after the opening, granular B2 perc seed 1 at the center (2026-11-09)

His note, verbatim in `COMPOSITION_NOTES.md` SW-8. The piece's order so far, from SW-7 and SW-8: the opening files under live beats
against sines → the tremolo versions with trills or ostinati → a passage built around the granular bed B2 (perc, seed 1) with other
granular beds about it. Noted; no build.

## §95. His ear on the tuplets (seed 4 "getting there"); more attacks, a deck, two modes; the processed sample sheet; the petals heard first (2026-11-09)

His word on the tuplets: *"Seed 4 is getting there. The changes I would make would be let's have a greater variety of samples from each
instrument. And let's have the be two modes, one where the tuplet grouping is all produced with the same sample. So if it's like 2 beats
of quintuplets, all 10 of those will be one sample. And then the mode 2 will be a complete mix. But what I'm hearing is some sort of like
looping or repetition … it keeps coming back to the baritone guitar, same pitch, kind of like a loop. I want to avoid that."* And on the
timbre: *"what kind of processing can we do that essentially keeps the rhythmic, the attack intact, but changes the timbre of the notes
and maybe even keeps the pitches intact? … look at the decibel piece … The only one I would leave out is the comb filter … produce a
sample sheet … some way to identify which processing is which."*

Done:
- **The attacks: 24** — `attacks_cut.py --per 6` (six a player, the strongest onsets with room after them, spread over the session); the
  old eight's twins removed, one old cut without a twin kept. The deck is 24.
- **`tuplets_render.py`: modes `mix` and `group`, both dealt from a DECK** — shuffled, no sample again until all 24 have been used, never
  the same at the reshuffle's seam. The repetition he heard was the arithmetic of two attacks a player drawn with replacement. Eight runs
  in `tuplets/` (`tuplets-group-…`, `tuplets-mix-…`, seeds 11 … 18: all · drums · piano · drums+baritone · piano+archtop).
- **The processed sample sheet** — `attacks_process.scd`: every attack through TWELVE of the engine's processings, the chain in NRT exactly
  as the Decibel piece renders (process_test.scd's road; the comb left out at his word): drive-tanh · drive-fold · fuzz-cab · octave ·
  crush · cheby · waveloss · filter-moog · spectral-gate · noise-bed · room · resonators. `processed_sheet.py`: a row a processing, one
  attack a player, and a 20 s tuplet run of that processing's attacks. A bank name may hold no dot (safeName): the first run failed on
  "m-ss.ss" and was stopped; the dot is an underscore inside the scratch bank.
- **The petals on two beds (SW-6)** — `petals_bed.scd` + `petals_bed.py`: his bank in SuperCollider NRT with the changes §91 named — the
  input ungated, no fade, no limiter, 26 rings drawn once, stereo by his commented halves; normalized then mastered. Two beds NOT the
  opening's (r1-t190.0 from 4:00 · r2-t124.8 from 1:00), 60 s each, four settings: A his defaults (a cluster 400 … 1200 Hz, bank B a
  quarter-tone up) · B his set line low (fund 60, first 3, spread 1.33, +4 st) · C wide (fund 35, first 5, +8.1 st) · D = B with a 1.5 … 3 s
  ring. MEASURED: the raw render stands at +1 … +5 LUFS (the +50 dB a held partial gains); mastered straight, the compressor took 14 dB
  off and flattened it — so the raw is brought to −1 dBFS peak first, and the master then lifts 3 … 6 dB as on the other beds. The page
  `petals/index.html`. His question answered there: the pitches come from the settings; the bed decides the breathing.
*(§95, done)* The processed sheet: 287 renders in 261 s (one spectral-gate render of a quiet attack came out silent and was dropped);
`attacks/processed/index.html` — twelve rows plus the raw reference, one attack a player across, a 20 s tuplet run (mode mix, seed 21,
the same steps in every row) at the end of each row, so the rows differ by timbre alone.

## §96. His ear on the sheets: four processings, their variations; the tuplets extended; the petals full and varied (2026-11-09)

His word: *"fliter moog, resonators, fuzz-cab, room. Then can we do some variations on those ones that might sound a little different
from each other? And then the [tuplet] example is pretty good. Can we have a few extended versions of those? Are those the 4-minute ones
as well? … all the pedals are good. Maybe you can give me the one you did and then maybe two other beds. Ones that we haven't used yet
… give me those four for each … maybe the full pass and then the full bed. And then let's do the other bed with just harmonic variations
on these. So maybe different intervals, but also different fundamentals … it's probably got to be low to get all those upper partials
… use your judgment … And then let's have all those in the materials, the tuplets and the petals along with the rest."*

The answer to his question: the tuplet runs were 60 s (the sheet's 20 s); the beds are 4 min. Done or running:
- **Variations of the four** (three each, `attacks_fx_variations.json`, rendered by `attacks_process.scd` with its new list argument): Moog
  darker / ladder brighter / RLPFD squelchy · resonators E-based longer / short knock / under at half · fuzz soft-boxy / harsh-bright /
  dark-choked · room bigger / closet / JPverb. Onto the processed sheet as rows `<fx>-2 … -4`, each with its 20 s run.
- **Extended tuplets, 4 min:** raw mix · raw group · mix on each of the four processings (seeds 31 … 33, `…-4min` in `tuplets/`).
- **The petals FULL (625 s, the whole ×625 bed), the four settings A … D, on three beds** — r1-t190.0 · r2-t124.8 (the two heard) and
  r2-t110.0 (unused till now) — into `keep/petals/` (his "all the petals are good"), with a recipe for the materials page.
- **The harmonic variations E … J on a fourth unused bed, r3-t077.2 (120 s from 2:00):** E fund 40 +3 st (minor third) · F fund 40 +7 st
  (fifth) · G fund 55 spread 2 (wide) · H fund 80 spread 1 (a true harmonic series 160 … 1120 Hz) +2 st · I fund 30 +8.1 st (lowest) ·
  J fund 60 spread 0.5 +1 st (a dense low cluster, slow beating). The judgment on the fundamental: it transposes the whole chord and
  scales its spacing — fund × (first + spread × n) — so a lower fund with the same spread is the same chord lower AND closer; the wide
  range he wants comes from a low fund WITH a large spread (G · H), not from the fund alone. `petals/variations/`, listed as candidates.
- The materials page gains the petals (keep) and the variations and processed runs (candidates) when the renders land.

## §97. The processings as POOLS; ten pooled tuplet sequences; the petals landed (2026-11-09)

His word: *"the process variations are fine, except for the Moog 4. Let's not use that one. And then let's treat these as like one category
… the Moog or the 2 or the 3 will be just more like one choice … like a pool. And then … create a number of tuplet sequences using some
using single processing, some using a mix, and then a variety of the tuplet patterns … some that's just a mix of the various, whatever,
resonators or fuzz cabs, and then some that combines a couple different effects, and then some that uses them all."*

- Moog 4 (RLPFD) deleted from the sheet and the pools. The pools: Moog 1 … 3 · resonators 1 … 4 · fuzz-cab 1 … 4 · room 1 … 4.
- `tuplets_render.py`: `--attacks` given several times = ONE DECK dealt across every folder named (a card is folder/attack).
- Ten sequences, 90 s, in `tuplets/pools/` (candidates on the materials page): one pool each — resonators (mix · group), fuzz-cab (mix),
  Moog (group, chunks 1 2 3), room (mix) · two pools — fuzz-cab+room (mix), resonators+Moog (group) · all four — mix, group (chunks to 6),
  and mix at a 0.75 s beat. Seeds 41 … 50.
- The petals landed: twelve full passes (625 s, A … D on r1-t190.0 · r2-t124.8 · r2-t110.0) in `keep/petals/`, its banner on the
  materials page with the recipe; the six harmonic variations E … J (120 s, r3-t077.2) as candidates.

## §98. The materials page cleared of the old (2026-11-09)

His word: *"can we take out all the old materials? I'm not sure what is what."* The earlier tuplet renders (the gate-varied three, the
samples seeds 1 … 6, the first deck runs seeds 11 … 18, their step files) moved to `tuplets/_old/` — kept, not listed. The raw tremolo
mixes and the processed attacks' 20 s runs no longer listed (the latter live on their own sheet). The page now: KEEPERS — the four
orchestrated mixes · 21 granular beds · the opening's six · the petals' twelve; CANDIDATES — the six 4-minute tuplets · the ten pooled
sequences · the six petals variations.

## §100. The pool of attacks: 24 → 60; the sequences re-rendered on it (2026-11-09)

His ear: *"it sounds like the same samples are coming back again in all of them … are we using a variety of samples for each instrument?"*
The answer given: one deck of 24 (six a player) under every seed — the seeds changed the order and the rhythm, not the samples, and in a
2-minute run each of the 24 returned a dozen times. His word: *"cut the larger pool and then re-render those sequences."* Done:
`attacks_cut.py --per 15` — 60 attacks, fifteen a player (the 24 set aside in `attacks/_pool24/`); the 21 sequences re-rendered on the
60 with the same seeds and settings, the page retitled. The processed folders (`attacks/processed/`) still hold the 24 pool's renders —
the chosen sequences are processed on the 60 when he names them.

## §101. His ten sequences; raw and processed hits mixed, a character each (2026-11-09)

His word: *"21, 101, 117, 115, 114, 112, 109, 107, 103, 105. And then can I hear each of these with a mix of processed samples and
unprocessed samples? So like the unprocessed will be like one choice, like one processing choice. And you can do a random mix of the
different processing. I don't think the single processing ones worked quite as well … try some things that make each of these 10 … sound
distinctive … weighting one type or a couple types of processing more, or changing more often or less often, or alternating unprocessed
samples with processed samples."*

- The 60 attacks through the FIFTEEN kept processings (`attacks_fx_kept15.json`; 900 renders, `attacks/processed60/`).
- `tuplets_render.py`: WEIGHTED POOLS with a change policy. A pool is the same 60 hits under one processing (raw is a pool). The hit's
  SAMPLE is dealt from the deck as before; its PROCESSING is drawn across the pools by weight — changing every note, every tuplet group,
  or every N groups (`--pool-change` · `--pool-run`), or alternating the first pool with the rest (`--pool-alternate`), never twice running
  (`--pool-no-repeat`). The two rhythms are independent, so one note can repeat while its color changes. A Windows path's drive colon
  broke the FOLDER:WEIGHT parse once — the weight is the part after the LAST colon, and only when it is a number.
- `sequences_processed.py` — the ten, same seeds and patterns, a recipe each: 21 the kaleidoscope (raw a fifth, all fifteen, a color a hit) ·
  101 raw with a resonant halo (half the groups) · 103 strict alternation raw/processed hit by hit · 105 raw, the E resonators and the big
  room in turn, a color a group · 107 slow color turns (held two groups) · 109 mostly clean, spiked by the harsh fuzz and the knock · 112
  no raw, every group a new color · 114 the rooms held three groups, then dry · 115 dry and hooded (the Moogs) · 117 drums and piano, a
  raw group then a fuzz group. Rendered when the processing lands; the page `tuplets/sequences/processed/index.html`.

## §102. The composer score takes the materials: the engine road chosen; layers; a post-production bounce (2026-11-09)

Put to him (the §80 plan restated, one question): the sound out of the score through the ENGINE (the bank, `/le/play`, Reaper — the
lineage's road, what quad and the live electronics need) or through the BROWSER (the page plays the WAVs; quick, a second sound path the
concert never uses). Recommended the engine. His word: *"the engine is fine. Also, I would want to do multi-track, like I would want to
layer these things … there may be like a post-production phase … if I layer a bunch of these on, and these are already mastered, the final,
combined might be too loud or need remastering … Once things are placed and I have them more or less the way I want them to sound, then
like for the notation score, we can … remaster or remix these into a single sound file. Just as long as we have the capability of doing
that later, and for the composer score part, just like with the MIDI files … maybe just a rough mix there so that it sounds, it plays back
good enough so that I can compose it."*

The reading, for the plan: LAYERS = several electronics lanes in the score (bricks overlapping freely across them). THE ROUGH MIX while
composing = each brick's level mark plus the engine's master bus (`\leMaster`: the glue compressor and the look-ahead limiter already
there) — nothing clips, nothing is final. THE BOUNCE = post-production: an offline render FROM THE SAVE (the IR contract — the save is
the ground truth): every brick with its offset, length, fades and level curve, summed and mastered (`master_mix.py`) into ONE file for
the notation score and the recording. It is a sixth step of §80's plan, built when he reaches it; nothing in steps 1 … 5 forecloses it.
Discussion only; the plan item is written when he says go.

## §103. THE ELECTRONIC SCORE BUILT — PLAN 1a.7 steps 1 … 5: the fund indexed, the material brick, the engine streams it (2026-11-09)

His word: *"No need for the sub-steps. Go ahead and write the plan. And unless you need my input, go ahead and build as well."* The plan item
rewritten (`docs/PLAN.md` 1a.7, six steps, top line). Built in one pass — THE SORTING: what knows the fund's files and the page's keys is the
piece's; what streams a file and draws a brick is the engine's.

**The piece's:**
- `tools/materials_index.js` → `bank/materials.json`: 47 materials (4 mixes · 6 opening · 21 granular · 16 petals), name · file (relative to
  the keep folder on H:) · seconds · channels · sr · kind · note. A name is made safe for the engine (a dot → an underscore).
- `composer.html`: the tag `le_material.js` AFTER the engine's other mixins (placed before `le_objects.js` at first — it loaded with no
  LEObjects and did nothing; moved) · the key `material: 'n'` · `materialsUrl`. `tools/elec.js`: `LE_MATERIALS` handed to the engine.
- A brick may sit on ANY lane and bricks overlap freely — that is the layering; no new lanes (a layout change is his, D7).

**The engine's (`electronics/`, the engine's RUNNING_LOG §74):**
- `sc/material.scd`: `/le/material` — the file cued at the offset (DiskIn, a quarter-million frames ahead; never loaded whole — ten minutes of
  stereo float is 200 MB and the fund is hours), the synth started when the cue is in, the look-ahead less the time it took; the edge fades
  (a sine's quarter); the level a line of 16 points in decibels, mf = the file as mastered, each mark ±4 dB (the ladder's step); a trim; it
  frees itself and closes its file. `/le/materialstop` lets go in 30 ms. The index from `LE_MATERIALS`.
- `score/le_material.js`: the brick — offset · length · fades · trim · level (flat · hairpin · a curve A | B | C | lane through the lanes' own
  reader, 16 heights → marks); THE RULE OF THE EDGES in `materialDecorate` (the host's renderZone, wrapped already): a body drag moves both
  edges — the offset stays; the LEFT edge alone moves — the offset follows (the sound stays where it was); the RIGHT edge — the length; never
  past the file (clamped, re-drawn). SHIFT+N splits the selected brick at the playhead, the second carrying the offset on. A playhead that
  starts inside plays what is left (offset moved on, a 15 ms fade in). The panel: the picker by kind, the numbers, ▶ hear 6 s, ✂ split.
- Five hook lines in `le_objects.js` (the inside rule · fire · decorate · panel · the key), one each in `synths.scd` · `boot.scd` · `session.scd`.

**PROVEN:** `electronics/sc/material_test.scd` — MATERIAL_TEST PASS, ten checks: the index read · the spec · a mark as decibels (f +4, p −8) ·
the clamp to the file's end · a level line of three points · in NRT on a made file (440 Hz then 880 Hz): the stretch from 2.5 s IS the 880 Hz
half (1056 zero crossings in 0.6 s) · the level f = +4.0 dB · the first 5 ms and the last 10 ms −42.6 / −37.6 dB under the middle · it ends
at its length · p → ff over a second lifts the end 14.0 dB over the start. THE PAGE on the throwaway (5601, autosave stubbed, nothing
saved): the model present · 47 materials in the picker · a brick made by name, its label `▬ petals-A-… · from 0:00 · 0:30` · its message
{offsetMs 0, lengthMs 30000, fades 30/30, level "4"} · started 10 s inside: offset 10000, length 20000, fade in 15 · the left edge moved 5 s →
offset 5000 · a 2000 s brick clamped to the file (629.5 s left) · a hairpin p → ff wired "0:2,end:6" · the panel's eleven rows.
**MEASURED ON THE WAY:** an NRT `s_new` with a NESTED ARRAY argument kills the render (0 frames, no error) — bus_test's `asOSCArgArray`
(`$[ … $]`) is the way; the real-time `newMsg` flattens by itself.
**NOT CLAIMED:** a living engine under his hands; his ear on a brick; the curve mode on a real drawn curve (the reader is the sine's, proven
there). **HIS ONE HAND STEP:** the engine must be restarted once (`start_electronics.bat`) — `material.scd` and the index load at start.

## §104. The ten sequences kept; two mixes of three to hear (2026-11-09)

His word: *"those sequences are good. You can add them to the materials. And can you make a mix, like 2 mixes of 3, just for me to hear?"*
The ten character sequences mastered (−16 LUFS, as every material) into `keep/tuplets/` — on the materials page under KEEPERS · tuplets with
each one's character, and in the fund's index for the composer score (57 materials now). Two mixes of three, each sequence at equal gain
(÷√3), mastered, as candidates: A = seeds 21 (the kaleidoscope, 4 min) + 105 (halos and halls) + 115 (dry and hooded) · B = 103 (raw ·
processed alternating) + 109 (mostly clean, spiked) + 117 (drums and piano, raw then fuzz). `tuplets/sequences/processed/mixes/`.
*(§104, more)* His word: *"those are great. Can you do a few mixes of four, like maybe three, and then maybe like two more mixes of three?"*
Five more, same way (equal gain ÷√n, mastered), as candidates: C = 21 + 101 + 112 + 114 · D = 103 + 105 + 107 + 109 · E = 101 + 112 + 115 + 117 ·
F = 107 + 112 + 114 · G = 21 + 101 + 109.
*(§104, the mixes redone)* His word: *"have each part wander in the stereo field … easily convertible to the quad … like a 360 dial."* All seven
mixes (A … G) remade by `mix_wander.py`: each part on the full circle (0 front · 90 right · 180 back · 270 left), spread evenly to start, then a
slow random walk (a step every half second, smoothed over 6 s — about ±120° in a minute, never a jump); stereo by folding the circle (left–right
from sin, the back a shade quieter and narrower); every mix writes its parts' angles once a second to `<name>.json` beside it — the numbers a
quad panner reads later. Equal gain, mastered, as before. (The first run smoothed at the sample rate — a ten-minute convolution that would have
taken hours; the walk is made at 20 points a second and interpolated.)

## §105. FOUR ELECTRONICS LANES, half height, below the cello — piece 6's D8 reversed for this piece (2026-11-09, D11)

**What prompted it.** His first pass in the composer score, after the clear: *"Where is the electronics lane?"* Told there is none (the brick
goes on any lane, §103's inherited line), he asked for the lineage: *"Let's look at the most recent, the decibel score. How did we handle
electronics there? Or have we not talked about how to manage electronics in the composer score?"*

**What the lineage says.** Piece 6's D8 (2026-10-04, his words DEC-4): *"I don't think there needs to be an electronics lane. We can just
incorporate the electronics per instrument lane because they'll always be based … on the performer's own input."* Every electronic sound sat
on the lane of the player whose input made it, with a sign of origin; the AI's proposed electronics lane was rejected. This piece inherited
that at §103 without a conversation (*"a brick may sit on ANY lane … no new lanes"*).

**Why it does not carry.** This piece's materials are a fund from an OUTSIDE set (Sound Lab 2025-04-08c: piano · baritone guitar · archtop ·
drums), not a player's input. A brick belongs to no flute and no cello; the sign-of-origin reasoning that made D8 right has nothing to point
at. Put to him with one recommendation (one or two lanes of their own, below the cello).

**His decision:** *"Okay, let's do 4 lanes, but they can be half lane height. And then yes, below the cello."* — D11.

**The build (one script, 25 edits in 7 files, every anchor checked first):**
- `TRACKS` 8 → 12: `elec1 … elec4` (labels Elec 1 … 4, short E1 … E4, `instKey: 'electronics'`, `elec: true`) APPENDED after the cello, so no
  player's lane index moved. `PLAYER_LANES` (8) beside it — the count the compiler's parts and the multitempo's streams now use, never
  the electronics lanes. No recipe, no port: `INSTRUMENTS['electronics']` is undefined and every lookup in the page already guards.
- META 8 → 12; the curve windows A / B / C 9 / 10 / 11 → 13 / 14 / 15 (`CURVE_LAYERS` · `CURVE_NAMES` · `CURVE_COLORS`); `layoutVersion` 9 → 10;
  `restoreData` migrates a v9 save by one uniform shift of every layer >= 8 by four (the two v9 saves on disk have no META object; the
  rule is written anyway).
- The CSS: twelve `.lane:nth-child` rules — the players at 10 %, the four electronics lanes at 5 % (80 · 85 · 90 · 95); the curve windows
  at 50 / 60 / 70 %, 10 % high, still exactly over piano · violin · cello; the electronics lanes tinted the brick's brown at 3.5 %, a 9 px
  label, no solo button. Four `<div class="lane">` after the cello's.
- `tools/palette_check.js`: §§ 1 … 6 run over the PLAYERS (`t.elec` filtered out — no recipe is owed to an electronics lane); § 7 counts
  every lane and that they tile to 100 %. **GREEN, 202.**
- `compiler.js`: `partsDefault` = PLAYER_LANES; its META read (`o.layer === partsDefault()`) split off to `metaLayer()` = META_LAYER — the one
  place that used the part count as the META index. `multitempo.js`: LANES = PLAYER_LANES.
- The docs: NAMING § 1 the lanes row · CLAUDE.md § Apps · PLAN 1a.7 step 1 amended.

**Proven once (D13), on the throwaway 5601:** the page boots; 12 lanes, labels Flute … Cello, Elec 1 … 4; tops 0 … 70 by 10, then 80 · 85 · 90 ·
95; heights 10 ×8, 5 ×4; the curve windows' tops 50 / 60 / 70 %; META_LAYER 12, PLAYER_LANES 8, CURVE_LAYERS 13,14,15; `Composer.lanes` 16, every
element found. Console: two 404s for `bank/strike_responses.json` — an optional file, there before this change. NOT CLAIMED: a brick placed on
Elec 1 under his hands with the engine up (that is his first pass).

**Rejected:** a separate electronics lane list beside TRACKS (would break the invariant META_LAYER === TRACKS.length that a dozen modules
read at call time) · a stub recipe `electronics` in `sandbox/instruments.js` to satisfy palette_check § 1 (a port that does not exist, a
range that means nothing — the check was taught the truth instead).

## §106. THE MATERIALS DRAWER — his wish, verbatim, before the design talk (2026-11-09)

**His words, whole:** *"And then let's discuss the materials. I would like to have some sort of easy access drawer or panel, maybe a drop
down or something from above, maybe, or let's discuss. You give me some options too. Initially, I think it might be best if it's a full,
full score width or screen width, drop down from the top, and then, collapsible, so I can collapse it with a click. And then I'd like to
be able to drag the materials onto the lane. And then actually, I would like to see some rough waveform, if I could, for each of the
materials I drag in. So let's start there. Oh yeah, and then in the drawer preview, I can hear the materials, and I can actually both
preview and click to a different part of the preview. So maybe they have their waveforms there as well, I guess. Well, whatever's
feasible and not too onerous will be fine. It wouldn't be the worst thing for me to have to drag it in to see the waveform. But if it's
easy enough, then yeah, the preview, and then I can advance ahead."*

**The AI's reading (marked as such):** five wishes, in his order of weight — (1) a full-width drawer from the top, collapsible with a click;
(2) drag a material from it onto a lane (today: key N, then the panel's picker); (3) a rough waveform ON THE BRICK; (4) hear a material
in the drawer; (5) click into the preview to start from elsewhere, so a waveform in the drawer too. His own priority: (3) over (4)/(5)
("it wouldn't be the worst thing for me to have to drag it in to see the waveform"). The design talk follows in the chat; the decisions
land here as they are made.

## §107. The drawer talk, continued — nothing of the brick changes; solo AND mute for the electronics lanes (2026-11-09)

**His words:** *"And then there's no change to the other things I asked for, like I can splice, click and edit, and I can, there'll be
auto fades, but also I can do my own sort of fades or crescendos somehow. And then can we find a different way if, I mean, oh, for the,
I mean, for the solo button, it would be, ideally I would have solo and mute for those lanes as well."*

**The answer given:** the brick keeps everything §103 built — split at the playhead (SHIFT+N), trims from either edge, the default fades
(the engine's 30 ms), longer fades by hand in the panel, the level flat · hairpin · a drawn curve A / B / C / the lane's own. The drawer
only changes how a brick ARRIVES (a drag instead of N + the picker) and adds the waveform. **Found while answering:** the lane SOLO of the
page gates the NOTES only (`composer.html` ~3992) — the electronics tick (`le_objects.js` tick) never asks it, so soloing a lane today does
not silence a brick; and there is no per-lane MUTE at all (mute exists per object, `midiMute`). So his wish is a build of its own: S and M
on each electronics lane, and the electronics tick gating every electronics object by the host's solo set and the new mute set. (The §105
line "no solo button" on the electronics lanes is reversed by this.)

## §108. THE MATERIALS DRAWER BUILT — PLAN 1a.8 steps 1 … 4, proven on the throwaway (2026-11-09)

**What prompted it.** His word on the plan's top line: *"You can go ahead and plan if you need, and then do the whole build as much as you
can."* The plan's shape is §106's reading, his picks of the chat (a drop-down from the top · the sound straight from the file · the
waveform computed once into a side file), and §107's solo-and-mute.

**A correction of §107 (a new entry, never an edit):** §107 said the electronics tick "never asks" the lane solo. It does — `le_objects.js`
tick has `if (host.isPartAudible && !host.isPartAudible(z.layer)) continue;` since the Decibel piece. What was missing was MUTE alone. The
build is the smaller one: a mute set on the host, an M button, one line in `isPartAudible`.

**Step 1 — mute.** `composer.html`: `this.mutedParts` beside `soloParts`; an M button on every lane whose track is `elec: true`; `isPartAudible`
returns false for a muted lane before the solo rule; `updateSoloVisuals` lights the M and dims the lane (`.muteDim`, 0.22). The S stays on the
electronics lanes (§105's "no solo button" reversed). Not built: mute on the instrument lanes — not asked.

**Step 2 — the peaks.** `tools/materials_index.js`: `wavInfo` now returns the data chunk's offset and length, the bits and the format
(WAVE_FORMAT_EXTENSIBLE's sub-format read); `wavPeaks` reads the data in 4 MB pieces — PCM 8 / 16 / 24 / 32 and float — the loudest absolute
sample of every channel per slice, PEAK_BINS = 1200 slices, 0 … 255; written to `bank/materials_peaks.json` keyed by name with the file's
size and mtime, so a later run re-reads only what changed (`--no-peaks` skips). **Measured:** 57 masters (3.6 GB) in 17.4 s; the file 230 KB;
the first material's slices min 0 · max 227 · mean 101.

**Step 3 — the drawer.** `electronics/score/le_drawer.js` (new, the engine's — THE SORTING: a fund, an index, a player and a drop are any
piece's; it knows this piece by nothing but the three URLs and a button id handed in at attach: `peaksUrl` · `fundUrl` · `drawerButton`). A
mixin on LEObjects after `le_material.js`, wrapping `attach` as the brick does. The drawer: `#leDrawer`, fixed under the bar at `--barH`, 42 vh,
scrolling, a sticky head (the count and the total length · a filter · the now-playing · ■ · ✕); rows grouped under their kind; a row = name ·
length · a canvas (the peaks mirrored round the middle; the playhead a 2 px orange line) · ▶ · the note. ONE `Audio` element: a click at
x on the canvas sets `currentTime = x/width × duration` (after `loadedmetadata` on a new file) and plays; the server's existing byte-range
branch (the film's, 2026-10-10) makes the seek work. The rows are HTML5-draggable (`text/x-le-material` = the name); the lanes 0 … lanes−1
take `dragover` / `drop`, the hovered lane outlined in the brick's brown. `composer.html`: the button `#leDrawerBtn` after the bar's gap, the
script tag, the three options on the attach line. `score/server.js`: `/fund/<rel>` → the index's `root` on H:, read from `bank/materials.json`
at each request; the existing startsWith guard keeps it inside the root.

**Step 4 — the drop and the brick's waveform.** `le_material.js`: `materialAdd(name, layer, t)` — the key's call is unchanged (active lane,
playhead), the drop's gives both; `peaksLoad` · `peaksOf` beside `materialLoad`; `materialWave(zone, row)` called from `materialDecorate` at
every render: the main rect found by its fill color, up to 600 points of the stretch `offset → offset + length` as a fraction of the file,
a closed path mirrored round the brick's middle, `#4a2f27` at 0.35, inserted right after the rect so the hit areas and the label stay on top.

**Proven ONCE (D13), on the throwaway 5601, by script in the pane:** the button is there · 57 peaks loaded · the drawer opens: 57 rows under
granular · mix · opening · petals · tuplets · the first canvas 394 × 34 with 7846 inked pixels · `GET /fund/<first file>` with `Range: bytes=0-1023`
→ 206, `bytes 0-1023/63504102`, audio/wav · the filter "tremolo" leaves 5 rows · `materialAdd(name, 8, 12)` → a brick on Elec 1 at 12 … 42 s with a
`path.leWave` of 10 020 characters · M on Elec 1 → `isPartAudible(8)` false, lane 0 still true, un-muted true again · the S is on the lane ·
✕ collapses. palette_check 202 green; the engine's `page_test` PASS. **NOT CLAIMED:** the drag gesture itself and the sound of the preview —
neither runs from the AI's pane (no hands; no autoplay); his first pass is the proof. **His server must be restarted** for `/fund/` (a route);
the page reloaded for the rest.

**Rejected:** the preview through the engine (as the panel's "hear 6 s") — it needs the engine up and a message per seek; the file itself
seeks for free · the waveform computed in the page from the audio (3.6 GB through the browser) · a drawer in the piece's folder (nothing
in it is this piece's).

## §109. The first fault of the drawer, from his hands: "the drag doesn't land on the lane" — fixed (2026-11-09)

**His words:** *"The drawer works, but the drag doesn't land on the lane."*

**What was suspected first, and ruled out:** a document-level drop handler eating the event (none: the page's only drag handlers are a
list's own rows) · an overlay over the lanes (none: the playhead and the floating time are the only siblings). **Then the rewrite** of the drop
the robust way — ONE listener on the lanes' container, the lane found from the cursor's Y against the lanes' boxes, the drag known by a flag
set at dragstart rather than by `dataTransfer.types` — and a synthetic drag on the throwaway (DragEvent dragstart → dragover → drop on the
element under the cursor) STILL placed nothing, though a capture listener saw the event reach the container with the right Y.

**The cause, found from the page's order:** the attach line runs BEFORE `Composer.init()` (deliberately — "so the first drawing of a loaded
score already has the bricks' labels", composer.html ~17969), and `Composer.lanes` is made IN init. So at `drawerInit` `h.lanes` was undefined;
the drop block read its length and threw, inside the attach wrapper's try — the drawer (built before that line) worked, and nothing after it
(the lane listeners, the resize) was ever wired. The first build had the same fault, hidden by its proof: §108 called `materialAdd` directly
and never sent a drag event. **The fix:** the wiring is a function that waits, 150 ms at a time, until the host's lanes exist. The robust
listener stays (it is the better design either way).

**Proven ONCE on the throwaway, by a synthetic drag:** dragstart on a row → dragover over Elec 2's svg: the lane outlined · drop: ONE brick on
layer 9 at 3.4 s = `clientXToTime` of the cursor, the dragged material's name, its waveform drawn, selected · the outline and the flag
cleared · a drop on the drawer itself places nothing. `page_test` PASS. **NOT CLAIMED:** his real gesture (a synthetic DragEvent is the pane's
nearest thing to it). **For the record (SWEEP_LIST):** the class of fault — code that touches the host's DOM at attach must wait for init.

## §110. "I don't hear it when I play the score" — the rack had no ELEC RETURN; and the electronics lanes go full height (2026-11-09)

**His words:** *"I don't hear it when I play the score. And can we revise, let's just make the electronics full height, please, lanes."*

**The lanes first (a decision):** twelve EQUAL lanes of 100/12 % (8.3333 %), the curve windows over piano · violin · cello at the same height
(`composer.html`'s CSS alone; the half-height label and button rules dropped; the brown tint stays). palette_check 202 green — § 7 holds the
tiling. D11 amended with a dated line, his words kept. *(A slip on the way: the rules were written `nth-child(1 )` with a space, which § 7's
regex does not read — 3 rules found of 12, RED; unpadded, GREEN.)*

**The silence — what was suspected first:** the drawer and the brick (the newest code). Ruled out by one fact from the docs: `docs/STARTUP.md`
row 1 and `docs/NITS.md` (2026-11-07) both say **the full rack `switch_rack.rpp` has NO `ELEC RETURN` track** — only the lab's one-track project
has it. The engine's master comes back into Reaper on ReaRoute 1 / 2; with no track listening, nothing sounds, whatever the score sends.
`node tools/elec.js probe` (look only) confirmed: `return ELEC RETURN · not in the rack`, and named the cure in its own MISSING list.

**What was run:** `node tools/elec.js route` — through the bridge, into his OPEN Reaper: the sends (flute → ReaRoute 1, clarinet → 2, sax → 4,
the twelve percussion tracks → 5, violin → 7, cello → 8) and **the track ELEC RETURN at 25** (input ReaRoute 1 stereo, monitor on, 0 dB). ONE
undo point, "Electronics route". **The rack is changed and NOT saved — his CTRL+S.** The probe after: the return is there; the MISSING line
still prints because of the piano (below).

**Two things seen on the way, to NITS, not fixed (D13):** the route table's piano track is named `Piano` and the rack has no such track
(`NO TRACK named Piano`) · the percussion tracks still carry OLD sends to ReaRoute 4 (the sax's input) beside the new ones to 5. Neither
touches the materials.

**NOT CLAIMED:** the sound under his hands — his save, F5, play is the proof. If it is still silent after that, the engine window is the next
read (an engine started before `material.scd` existed knows no `/le/material`): its startup lines say `LE_MATERIALS` or not.

## §111. STILL SILENT — the trace to the engine's cue; the material at the file's rate; the card on P (2026-11-09)

**His words, with a screenshot of the engine window:** *"still cant hear. And then can you make it so that the card doesn't pop up every
time I click the brick? Maybe relegate it to a key instead. Just make sure there's no conflicts."* The window showed the engine is the new
one and receives the brick: `material · r3-t078_8-x625-trimmed · in 0 ms · 0.0 s into it · 30.0 s · fades 30/30 ms`, then `1 let go — the
score stopped`. So the route (§110) was necessary and not sufficient: the sound is MADE and never ARRIVES.

**The trace, by measurement (no hands of his — each step read from the rack through the bridge's own meter watch, `elec_route.lua watch`):**
1. A six-second audition of his material through the living engine, the rack's meters watched: **ELEC RETURN −150 / −150** (exactly nothing;
   the idle tracks' noise floors read −154). The engine's return track is the same as the lab's (REC input 1536 = ReaRoute 1/2 stereo, monitor
   on, armed, recmode 2) — the route job sets what the lab project has.
2. The server asked directly (`/status` · `/g_queryTree` on 57210): during the audition a `leMaterial2` node stands in grpFx (1001) BEFORE the
   master group (1002, `leMaster`) — the synth exists, in the right place.
3. **The line-up tone** (`elec.js tone`, past the bus) watched: **ELEC RETURN −18.24 dB** — THE WIRE IS GOOD (engine → ReaRoute → the return →
   the master). The icy lab's synths go into busMaster the same way and were heard.
4. The server asked to open the file itself (`/b_alloc` · `/b_read` leaveOpen · `/b_query`): 262144 frames · 2 ch · 44100 — **the file reads.**
5. **The live `leMaterial2` driven BY HAND** (my own cued buffer, then `/s_new` into busMaster): **ELEC RETURN −8.5 dB — IT SOUNDS.** Then with
   the engine's extra arguments added one group at a time — the fades and envCurve · + envDb [0 × 16] · + envDt [0.01 × 15], as OSC arrays —
   **all three sound.** The arguments are innocent.
6. What was left between the hand test and the engine's call: THE ORDER. By hand the read was waited for before the synth started.

**THE CAUSE (confirmed in SuperCollider's own source, `Buffer.sc` 164 … 173):** `Buffer.cueSoundFile(s, path, frame, ch, size, completion)`
= `alloc(…, { buffer.cueSoundFileMsg(path, startFrame, completion) })` — the completion FUNCTION is evaluated when the `/b_read` message is
BUILT, inside the alloc's completion, i.e. BEFORE the read. The engine's function sent the `s_new` right there: the synth started on an empty
buffer, DiskIn streamed silence, and nothing ever said so. The NRT test never met it (a Score has no asynchronous cue). The Decibel piece
never met it (no material brick there).

**The fix (`electronics/sc/material.scd` materialPlay):** `Buffer.alloc(…, { |b| b.readMsg(path, frame, cueFrames, 0, true) })`, then an
`OSCFunc` on `/done` with argTemplate `['/b_read', bufnum]`, one shot: the synth's bundle is sent when the READ is done, the lead less the
time it took, as before. **Seen beside it, fixed in the same def:** `/b_query` said the file is 44.1 kHz and the server runs at Reaper's
48 kHz — DiskIn plays at the server's rate: every material would have come 8.8 % fast and 147 cents sharp. `VDiskIn.ar(nCh, buf, rate, 0)`
with `rate` = the file's rate over the server's, passed at play (1 = as before; the test's case). **And the blindness fixed (`tools/elec.js`
start):** the engine window showed only `LE_` lines, so the server's own complaints (a file it could not open, an unknown SynthDef, a
buffer fault) were invisible — now shown, marked `server:`. `material_test.scd` PASS with the new def (ten checks).

**THE CARD on a click — his second ask.** The page already has the rule for the META curves, the trills and the beating (2026-08-13):
the card opens ONLY on P, the selection is silent. The material brick joins that line (`showPropertyPanel`, one condition): a click or a
drop selects it, **P opens its card**; P is the page's own panel key, so no new key and no conflict (the electronics' keys m · r · e · s · w ·
n untouched; the free letters were not needed).

**NOT CLAIMED:** his ear — the engine must be RESTARTED for `material.scd` (the sc files load at start); then play. SWEEP_LIST 2 stays open
until he hears it. **Rejected on the way:** asking him for more screenshots (the rack could be read from here) · a stub recipe or a new key.

## §112. The material brick at full lane height, the ticks above it; how a fade is made (2026-11-09)

**His words:** *"Then can we make the electric bricks taller so I can see the waveform better? You can make it the full lane height, I guess,
just as long as they're behind the time ticks. And then can you tell me how to do a fade, please?"*

**The brick:** `le_material.js` — BRICK_H 0.94 · BRICK_Y 0.5 (nearly the lane, centred, a hair of lane above and below so the border reads),
used by the key, the split and the drop; `materialDecorate` enforces it at every render, so bricks saved at the old 0.22 grow at their first
draw. **The ticks:** on the electronics lanes the `tickGroup` is moved after the `contentGroup` at init (`composer.html`), so the ticks draw
ABOVE the bricks; `.tickGroup { pointer-events: none }` so a tick line never takes a click meant for a brick. The player lanes keep their order.

**Proven once on the throwaway:** the electronics lane's svg order contentGroup · tickGroup (a player lane's unchanged) · a new brick 0.94 of the
lane with its waveform · an old-size brick set back to 0.22 grows to 0.94 at its render · the tick group's pointer-events none · no card on the
add (P opens it, §111). page_test PASS · palette_check 202.

**The fade, as told to him (the panel's rows, nothing new built):** select the brick, P for its card. **Fades** row: `in` and `out` in
milliseconds (30 by default) — type 2000 for a two-second fade. A fade over the WHOLE brick is the **Level** row: `hairpin — from one dynamic to
another`, then the two marks (ppp → mf is a fade-in, mf → ppp a fade-out). A shaped fade: Level → `curve A` (or B · C · lane), then draw the
curve in that window over the brick; the brick reads it where it stands. mf = the file as mastered.

## §113. A placed material is the WHOLE file (2026-11-09)

**His words:** *"And then why are the bricks so short? The brick says 9 minutes, 45 seconds, but it only stretches to 35 seconds."* — then,
put to him (the brick a 30-second window by the AI's choice at §103, against the DAW's convention): *"yes, make it the whole file."*

**The change:** `le_material.js` materialAdd — a brick opens at the file's full length (the edges trim it; the split cuts it); 30 s only for a
name not in the index. The key, the drop and the split share the one line. page_test PASS. Logged as D11's companion, not a decision of
its own: the brick's model is unchanged, only its default.

## §114. SW-10 — the bed's pitch MEASURED (E♭, not F); the sax's long tone with a continuous sine, by the morph's breath rule (2026-11-09)

**What prompted it.** His SW-10 (the sketch pad, verbatim): the alto sax's long tone ordinario at 16 s on the tone that appears in the
electronic material at about 11 s — *"I think it's F4 … just confirm the pitch"* — a sine with it (a couple of seconds' fade-in, continuous),
the breaths scattered as the morphs do; Approaching's way read first.

**The pitch, measured** (`pitch_peaks.js`, a Hann FFT of 2.97 s windows, bin 0.34 Hz, the spectrum averaged, peaks named): the brick on Elec 1 is
`r3-t078_8-x625-trimmed` from 5 s with a 9 s fade-in, offset 0 — so score 11 s = file 6 s. **Score 9 … 14 s:** D♯3 +20c strongest (157.3 Hz),
C♯3 +6c at −10 dB, D♯4 −6c at −15 dB. **Score 14 … 18 s:** **D♯3 +1c (155.7 Hz) strongest, D♯4 −13c (308.9 Hz) at −10 dB**, C♯3 at −12, A♯3 at −17.
F appears in neither window's top eight. **So the tone is E♭ — E♭3 with its octave E♭4 above it.** Built on E♭4 (MIDI 63); F4 is one word of his
(the build script takes the pitch as its argument).

**Approaching's way, read** (its RUNNING_LOG §173 … §178; its save `beating-section.json`, 36 sine bricks): his DEC-35b rejected the beating tool
for the sines — *"simple generated electronics"* — so the SINE BRICK (`elecSine`) on the player's lane whose tone it is: a pitch with cents, a
length, a gliss, a level flat · hairpin · following a DRAWN CURVE (curve A read at the fire); the player tunes against it. Carried here as it
is: the same brick, the same module (the engine's `le_sine.js`).

**The breaths, the morph's rule** (`morph.js` BREATH_TABLE · `maxBreath` · the carrier's "breath round the player's own maximum", 2026-09-20): the
ceiling for MIDI 53 … 65 at mp (level 0.43, over the p row's 0.4) is the mf row, **11 s**; the aim three-quarters of it, **8.25 s ± 2 s**; a
comfortable gap **0.75 … 1.2 s**; a remainder under 1.5 s is not a note. Seeded (11). The sequence drawer's `dealSpan` is the twin.

**Built — a NEW save, his working file untouched:** `scores/piece-Section01-C-saxBeats.json` = his `piece-Section01-B-addAudBt` + three things:
- **the sine brick** on the alto sax lane (lane 2 — Approaching's convention: the tone belongs to the player who beats against it; his to drag
  to an electronics lane), E♭4, 16 … 36 s (to the bed brick's end), level `curve A`, tracker off (continuous, not following the player);
- **curve A** over 16 … 36 s: ppp (y 0.05) → mp (y 4.2857 = 10 · 3/7) in 2.5 s, then held — the sine's fade-in; the ladder's ppp is a sounding
  level, 28 dB under the ceiling, so the entry is soft, not from nothing;
- **the alto sax**, E♭4 ordinario at mp (y 4.2857), two breaths: **16 → 24.86 s (8.86 s) · 25.78 → 35.36 s (9.58 s)**, the gap 0.92 s.
Opened from Piece ▾. **Proof on the throwaway follows in this entry's wake (the save loads, the eleven objects draw).** NOT CLAIMED: his ear
on the beating (the sax's sample against a sine at 311.1 Hz — the bed's E♭4 is 13 cents under it, 2.3 Hz of beat with the bed as well).
**Proven on the throwaway (one load):** `/api/composer/load/piece-Section01-C-saxBeats` 200, eleven objects; `restoreData` draws all eleven; the
sine's label `∿ the tone the sax beats against · D#4 · 20.0 s · curve A ▁▄▄▄▄▄▄▄`; the curve read for it at the fire: 0.005 → 0.4286 held (ppp →
mp); the two breaths on lane 2 at 16 → 24.86 and 25.78 → 35.36 rendered; the seven material bricks as his. The save itself is HIS (scores/ is
his to commit, `unsaved_check` first) — not committed here.

## §115. THE BEATS' PACING, AS APPROACHING SETTLED IT — read back from its journal for this piece's tests (2026-11-09)

**His words:** *"Also, for the audible beats section in Approaching, there was a whole working out of the pacing, how I like the pacing for the
beats growing or, you know, speeding up and slowing down. And I think it might have been frequency dependent. So, and maybe depends on what
octave or whatever I was in. Can you look at the conversations around that time? I don't know if, I'm sure we have a journal there, and see if
we can nail down the kind of pacing that I like by frequency. Let's see if we can't codify it a little bit more, and we'll do some tests here
to see if those ranges work."*

**Where it lives (the question named: what did he decide about the beats' pace, and was it by frequency?):** Approaching's RUNNING_LOG §262
(his first hearing, the cello) · §268 (the dictated pair tool) · §269 (his rules fed back as arithmetic) · §270 (the roller built, three
pairs) · DEC-62 … DEC-73 (the sketch pad); the rules AS DATA in `decibel_TENOR_2026/bank/beat_shapes.json`; the roller `tools/beat_pair.js`.
It IS codified already — his numbers, each with its line of provenance:
- **THE UNIT IS BEATS A SECOND, NEVER CENTS** — his word at the cello (§262): *"let's do that beats per second. And then let's do it by pitch or
  frequency."* A beat is a difference in Hz; a bend in cents is a ratio; so the same beating is more cents the lower the note (1 beat/s at D2
  = 24 c; at E♭4 ≈ 5.6 c). THIS is the frequency dependence he remembers: the rule is written in Hz and the cents are derived at each note's
  own pitch. The shapes and the pace are the same at every octave.
- **THE PACE** (DEC-62): the beating rate changes at most 1 beat/s per 2.5 s (0.4 Hz/s); slower is free, rolled 2.5 … 6 s per Hz, leaning fast.
- **A HOLD or PLATEAU** at least 2.5 s, plus 0 … 8 s leaning short.
- **THE PEAK** 3 … 10 beats/s, leaning low (a high peak forces a long note: a rise to P takes at least 2.5 · P seconds).
- **A DESCENT never reaches the unison** — it ends at 0.6 beats/s or above, at most half its peak.
- **THREE SHAPES, equally likely:** up and hold · down and hold (begins AT the peak) · up, plateau, down, a last hold.
- **THE LENGTH IS NEVER ROLLED** — it is the sum of the parts; over 60 s is rolled again. **THE GAP** between pairs on a lane 6 … 11 s (DEC-71).
- **BY LANE, his ear:** the LEVELS — the cello's sine fff over a p note (a low sine is hard to hear), the viola's mf / pp, the bass flute's
  mf / pp, the crotales' mp / mp; and the SIDE for a very low note (the sine over, never under). What octave changed was the level and the
  side, not the pace. Nothing after §270 moved peakHz, the pace or the holds (DEC-66 … 78 are levels, gaps, pairs and chords).

**Here:** `tools/beat_pair.js` came across in the copy-forward; `bank/beat_shapes.json` did not (the bank was skeletonised at container 3) —
one copy, with this piece's lanes' levels, and the roller runs on the alto sax (its `playerBendSt` 1 = 100 cents ≈ 18 beats/s at E♭4, so the
whole 3 … 10 range is the player's to bend; the sine static). Proposed to him: the file copied, three pairs rolled on E♭4 for the sax, then
the same on E♭3 and E♭5 to hear whether the pace wants to differ by octave — his tests.

## §116. F4 at his word; the method laid out in his order; the ceiling of beats a second answered (2026-11-09)

**His words:** SW-11, verbatim in the sketch pad. **Done at once:** `piece-Section01-C-saxBeats` rebuilt on F4 (MIDI 65; the sine and the two
breaths — the build script takes the pitch). The bed's E♭ (§114) stands as a measurement; his ear decides the pitch.

**THE CEILING OF BEATS A SECOND, for the sax on F4 (349.2 Hz):**
- **The player's limit:** the recipe caps the sax's bend at 100 cents (`playerBendSt` 1) — a semitone sharp is F♯4 370.0 Hz → **20.8 beats a
  second at the most.** (The sampler's range is 2 semitones; the roller re-keys past it anyway.)
- **The ear's limit:** beats stop being countable and turn into roughness somewhere around **15 … 20 a second** (Approaching's own note, §301:
  *"above ~20 Hz beating is timbre"*). His rule there set the PEAK at **3 … 10**, leaning low — the useful range.
- **The cents for a beat at F4:** 1 /s ≈ 5 c · 3 ≈ 15 c · 5 ≈ 25 c · 7 ≈ 34 c · 10 ≈ 49 c · 15 ≈ 72 c · 20 ≈ 96 c (a beat is a difference in Hz:
  cents = 1200 · log2(1 + beats / 349.2)).
**So:** the maximum is about 20 a second; the test's slow gliss runs from the unison up to 10 at the most.

**THE ORDER, his (one step at a time; each heard once):** 0 the ceiling (answered) · **1 the balance** sax ↔ sine on F4 with a SLOW upward
gliss — the roller's dictated mode (`tools/beat_pair.js --pitch F4 --from 0 --to <n> --at …`, after `bank/beat_shapes.json` is copied from
Approaching with this piece's lanes' levels); the levers: the sine brick's mark, the note's dynamic · **2 the gliss speed** (the pace rule's
2.5 … 6 s per Hz, his ear here) · **3 one drawn crescendo for BOTH** — the sine already reads curve A; the sax note must read the same curve
(the stack's lane curves: a note's dynamic from a drawn curve — to look up how a held note takes a curve, before building anything) · **4 the
electronics under them, quickly** — the candidates: the material bricks' Trim (dB) in their cards, or ONE number: the engine's master bus
(`node tools/elec.js bus …`) — but the bus carries the sine too, so the bricks' own trim or a per-lane gain is the right lever; chosen when
he reaches it · **later** the live-balance method for the performance score (DEC-64's hypothesis stands: a gain threshold with a margin).

## §117. THE FIRST BEATING TEST BUILT — a two-legged rise on F4, the sax ff, the sine ff to start (2026-11-09)

**His words:** SW-12, verbatim. **Answered first:** Approaching's quickest pace 1 beat/s per 2.5 s (DEC-62), the rolls 2.7 · 2.7 · 3.9 s per beat
(§270 there); a rise to 9 at the quickest 22.5 s. His choice: faster, and in two legs.

**The tool, extended (`tools/beat_pair.js`, the lineage's roller — carried in the copy, its data not):** a dictated LINE — `--line t:beats,…`
(seconds from the note's start · beats a second), the last value held `--hold` s (the rules' 2.5 unsaid); nothing rolled, the length the sum.
The read of `bank/beating_section.json` guarded (this piece has none). **The data:** `bank/beat_shapes.json` carried WHOLE from Approaching, its
`levels.lanes` this piece's — alto_sax { sine ff · note ff } for the test; `bank/sine_behaviours.json` gains the alto sax (voice `ord`, who
`player`, cents 8 … 50 — the derived cents are the tool's). **His save untouched:** `piece-Section01-D-saxBeatTest` = his `B` + the pair.

**The pair written** (`--pitch F4 --start 16 --line 0:0,10:5,16:9 --hold 6 --sine ff --note ff`): **Alto Sax F4 · 16 → 38 s** (22 s = the line's 16 +
a hold of 6) — **0 beats/s at 16 s → 5 at 26 s → 9 at 32 s, held to 38** · the bend up to 44.1 c, one note inside the sampler's ±2 st · velocity
109 (the ladder's ff for the sax) · the sine brick static F4 at ff. The bend is sampled every 0.25 s (straight in Hz is a curve in cents).
**The first leg is 1 per 2 s — a shade faster than Approaching's fastest (2.5); the second 1 per 1.5 s.** His to hear.

**The order he set for the balance:** the sax fixed at ff; the sine's mark the one lever (P on the brick → Level → Mark). NOT CLAIMED: the
sound. **NEXT at his word:** step 2 the gliss speed · 3 one drawn crescendo for both · 4 the electronics under them.

## §118. SW-13 applied to the test pair — the sine's early fade, 2 dB under; the sax in breaths along its own bend (2026-11-09)

**His words:** SW-13, verbatim. **Done on `piece-Section01-D-saxBeatTest` (a script on the save; his page reloads it):**
- **The sine** 15 → 38 s, level `curve A`: a curve A object over the brick — ppp (y 0.05) → mark 5.5 in one second, held. **2 dB = half a mark:**
  the engine's level law steps 4 dB a mark (material_test: f = +4, p = −8 against mf), so ff − 2 dB is 5.5, a height of 5.5 / 7 (y 7.857).
  The lever from here: curve A's top (drag its points), or the brick's mark if it goes back to flat.
- **The sax in breaths** — the morph's rule at ff (level 0.86 → the f row's 8 s ceiling; the aim 6 s ± 2; gaps 0.75 … 1.2 s; seed 23): the one
  22-second note cut into three — **16 → 21.69 (0 → 28.5 c) · 22.47 → 29.76 (32.4 → 54.9 c… )** *(the printed line below has the exact figures)* —
  each breath's bend the piece of the whole it covers, re-based, with the boundary cents interpolated, so a breath begins ON the pitch the
  gliss had reached and the beating resumes where it was; the first breath keeps the note's id (the brick's reference). The brick's `beat`
  carries `sineFadeS 1` · `sineDbUnderFf 2`.
**NOT CLAIMED:** the sound; his ear says whether 2 dB is the number.
**The breaths as written:** 16–23.276 (0 → 18 c) · 24.308–28.934 (20.4 → 34.2 c) · 29.705–35.477 (36.7 → 44.1 c)

## §119. SW-14 — the sine's fade from silence (the engine); the breaths shortened; a sawtooth of four pairs under one sine (2026-11-09)

**His words:** SW-14, verbatim. **The pop, read:** the sine brick's level cannot start under ppp (height 0 of a curve = mark 0, a sounding
level 28 dB under the ceiling) and `\leSine` rose in 10 ms — so a "fade" on curve A was a jump to ppp then a rise. The cure is a rise FROM
SILENCE: **`fadeIn` on `\leSine`** (`synths.scd`: the guard envelope's first segment, 10 ms unless said), **`fadeInMs` on `/le/sine`**
(`sine.scd` sineSpec · sineArgs), **`elec.fadeInMs` on the brick** (`le_sine.js`: the message; a playhead starting inside the brick comes in
over 15 ms; the card's row `Fade in (ms)`). `sine_test` · `sine_page_test` · `page_test` PASS. The engine's §77.

**The sawtooth — `tools/beat_saw.js` (new, the piece's):** ONE static sine brick across every pair (his "keep the sine constant"), the long
tone a pair at a time, each from the unison along his line in beats a second (the cents derived at F4, sampled every 0.25 s), each in
BREATHS — the morph's rule with his numbers: **4.5 s ± 0.75** (a quarter under the 6 s aim; the jitter a quarter of before), the gap between
breaths 0.75 … 1.2 s, each breath re-articulating on the cents reached. `--replace` takes the lane's earlier pair out.

**Written into `piece-Section01-D-saxBeatTest`** (the sine 15 → 99.4 s, mark **6.25** = ff + 1 dB, in over **1000 ms**; the sax ff, velocity 109;
the gap between pairs 1 s; seed 23):
| pair | when | the beating | bend to | breaths |
|---|---|---|---|---|
| 1 (his first) | 16 → 38 s | 0 → 5 at +10 s → 9 at +16 s, held 6 | 44.1 c | 5 · 4 · 4.4 · 4.9 s |
| 2 | 39 → 56.5 s | 0 → 6 over 15 s (2.5 s per beat), held 2.5 | 29.5 c | 4.2 · 4.5 · 3.9 · 2.2 s |
| 3 (a variation of 1) | 57.5 → 78.4 s | 0 → 7 over 15.4 s (2.2 s per beat) → 10 over 3 s (1 per beat), held 2.5 | 48.9 c | 4.4 · 4.5 · 4.4 · 4.8 s |
| 4 (slower, lower) | 79.4 → 99.4 s | 0 → 5 over 17.5 s (3.5 s per beat), held 2.5 | 24.6 c | 3.8 · 4.6 · 5.2 · 3.2 s |
**His reading of "the pace of 2.5 beats a second" taken as 2.5 s per beat gained** (his unit of SW-12); said to him. NOT CLAIMED: the sound —
the engine restarts for the fade (sc files), the page reloads the save.

## §120. SW-15 — the sawtooth algorithm for the other lanes, proposed; the ranges by octave; the instruments advised (2026-11-09; a talk, nothing built)

**His words:** SW-15, verbatim. **His unit held throughout:** "N beats per second" as a PACE = N seconds for the beating to gain one beat a
second (SW-12's "1 beat per second every 2 seconds").

**THE ALGORITHM, as read back (to become `bank/beat_saw.json` when he says so; `tools/beat_saw.js --roll` would read it):**
- **Shape A — the fast finish.** The peak P rolled in [8, 10] (so the knee lands above his threshold). The knee K = two-thirds of P (5.3 … 6.7).
  Leg 1: 0 → K at a pace rolled in [1.8, 2.6] s per beat (K · pace ≈ 10 … 17 s). Leg 2: K → P "much quicker", a pace rolled in [0.8, 1.2] s per
  beat (≈ 2 … 4 s). Then a hold 2.5 s + 0 … 2 s. The quick leg exists only because K ≥ 5: his condition built in by the peak's range.
- **Shape B — the slow, low one.** The peak rolled in [4.8, 6.5] (under or at the threshold; the fast leg never comes). One leg: 0 → P at a
  pace rolled in [2.6, 3.6] s per beat (≈ 12 … 23 s). A hold 2.5 s + 0 … 2 s.
- **The alternation** A B A B …, each from the unison (the sawtooth), a gap of 1 s between (the player breathes; the sine holds); every roll
  seeded; the breaths inside by the morph's rule with his numbers (4.5 ± 0.75 s). The lengths come out different by construction.
- **Open numbers (the AI's starts, his to move):** the fast leg's pace [0.8, 1.2] · the hold's extra 0 … 2 s · A's peak [8, 10] · B's pace [2.6, 3.6].

**THE RANGES — cents for a beat at each octave of F** (a beat is a difference in Hz; the cents shrink by half each octave up):
| | Hz | 1 /s | 2.6 /s | 5 /s | 6.5 /s | 10 /s |
|---|---|---|---|---|---|---|
| F3 | 174.6 | 9.9 c | 25.6 c | 48.9 c | 63.3 c | 96.5 c |
| F4 | 349.2 | 5.0 c | 12.9 c | 24.6 c | 31.9 c | 48.9 c |
| F5 | 698.5 | 2.5 c | 6.4 c | 12.4 c | 16.0 c | 24.6 c |
| F6 | 1396.9 | 1.2 c | 3.2 c | 6.2 c | 8.0 c | 12.3 c |
| F7 | 2793.8 | 0.6 c | 1.6 c | 3.1 c | 4.0 c | 6.2 c |
**What it means for who moves:** at F3 and F4 the player's bend is a real, playable thing (a quarter-tone and under); at F5 it is 12 … 25 c —
a flutist can lip that much, with care; **at F6 and F7 the bend is 1 … 12 c, under any player's control — there the SINE should glide and the
player hold** (Approaching's crotales rule, `who: sine`). The pace is the same at every octave; only who moves changes.

**THE INSTRUMENTS, advised (his to decide):**
- **F3 — the cello**, bending itself (its reach a semitone; 10 /s is 96 c, just inside). **F4 — the sax** (in hand) **and the violin doubling**
  (the violin bends itself, easily).
- **F5 and F6 — swap his first thought:** the CLARINET on F5 (sounding; the clarion register — stable, warm, bends well) and the FLUTE on F6
  (an easy, clear note for the flute; the clarinet's sounding F6 is altissimo, hard to hold still, harder to bend by 3 cents). At F6 the sine
  moves; at F5 the clarinet may bend itself (6 … 16 c) or the sine may — his ear's call at the test.
- **F7 — not the vibraphone:** a standard vibraphone runs F3 … F6 (three octaves); F6 is its TOP bar, bowable but no F7. **The call's list has
  no crotales.** F7 sounding IS on the GLOCKENSPIEL (its range G5 … C8 sounding; written two octaves lower) — bowed, a glockenspiel bar sings
  but thinly; struck, it decays too fast to beat against. So: the demo on crotales as he asks (the switch his to negotiate), with the
  glockenspiel the fallback in the call's own list; the sine moves in either case. The bowed VIBRAPHONE takes F6 if he wants a metal F6
  beside the flute — its top bar.
- **The piano** has no bend: no pair unless the sine moves against a struck F (its decay works against beating) — left out of this.
**Nothing built — "hold until we sort out the sax."** Put to him: the algorithm's numbers and the assignment above.

## §121. The sine's fade, measured and made right; the peaks held; the sax at f; trim together; the breath question prepared (2026-11-09)

**His words:** *"Sine is still quite abrupt."* (after the engine's restart — sclang up since 16:14, the fade edit 16:06: the fade WAS live) · SW-16
(the holds) · SW-17 (one f; the levels in the card, several bricks) · SW-18 (the breaths, to decide with him).

**THE FADE — three shapes, measured in NRT (`sine_probe.scd`, a 3 s sine at 220 Hz, the peak read in windows):**
1. The first fix (§119): the guard Env's first segment lengthened to `fadeIn`, the segment `\\sin` in AMPLITUDE — a sine-shaped amplitude rise is at
   −7 dB a quarter of the way in: loud almost at once. His ear was right: "still quite abrupt".
2. Linear in dB inside the Env (`[-60, 0, 0, -60] \\lin .dbamp`), then exponential (`[0.001, 1, 1, 0] [\\exp, \\lin, \\sin]`): `sine_test` FAILED on its
   level checks — the steady level 0.13 … 0.19 dB low, the LUFS 0.5 dB low, at C7 2 … 2.4 dB low. Probed: with fadeIn 0.01 the level was −7.4 dB at
   0.05 s, −4.3 at 1 s, −0.3 at 2.5 s — THE RISE NEVER FINISHED; it crept over the whole note.
3. The rise as its own `Line.kr(-60, 0, fadeIn).dbamp`, the guard's first segment 2 ms: the creep still there (−2.8 dB at 0.05 s, −0.02 at 2.5 s).
**The mechanism (SuperCollider, control rate):** an EnvGen.kr segment that is very short, or shaped in dB / exponentially from near zero, does
not land on its end level; the NEXT segment then interpolates from where the envelope actually is to its own end — a 1 → 1 "flat" segment
becomes a slow creep up to 1 over the note. The original 10 ms `\\sin` guard (7 control blocks) had a residue of it too: −0.36 dB at 0.05 s,
−0.27 at 1 s, 0 at 2.5 s — inside the test's tolerance, never heard.
**The fix that holds (`synths.scd` `\\leSine`):** the guard EXACTLY as it was (10 ms sine rise, 30 ms fall — proven), and **the fade a separate
`Line.kr(-60, 0, fadeIn).dbamp` multiplied in** — linear in decibels from −60, which the ear hears as an even swell. Measured: fadeIn 1.0 →
−42.4 dB at 0.25 s · −21.3 at 0.6 s · 0.0 at 2.5 s (the line's own numbers −45 · −24 · 0, read in windows); the engine's path at ff −32.64 dB
against the formula's −32.64. **`sine_test` PASS.** The engine's §78.

**The holds (SW-16):** `tools/beat_saw.js --hold lo,hi` — every peak held a rolled 1.8 … 2.6 s over a pair's own; the sax's four pairs re-rolled:
holds 2.5 · 2.4 · 2.2 · 2.5 s, the sine 15 → 95.5 s. **One f (SW-17):** `--note f`, velocity 91 by the page's rule. **Trim together (SW-17):** the page
already gathers bricks with SHIFT+click (zones have had additive selection since piece 4); the material card's Trim (dB), typed with several
material bricks selected, lands on every one of them and says so (`le_material.js`; the row shows "→ all N selected").

**The breaths (SW-18) — the data for his decision, read from the morph's own table (`morph.js` BREATH_TABLE, an ESTIMATE for a wind at MIDI
53 … 65):** the held tone's ceiling **p 15 s · mf 11 s · f 8 s**; the inhalation `BREATH_GAP_MIN` 0.75 s "comfortable", `BREATH_GAP_FLOOR` 0.40 s
"a snatch breath — flagged if used". His two considerations → a first set, put to him: the held tone **85 … 100 % of the player's ceiling at
the written dynamic** (the sax at f: 6.8 … 8 s; at mf 9.4 … 11); one breath in eight SHORT, 50 … 70 % (so the rhythm never settles); the inhalation
**0.4 … 0.6 s** (a snatch); across the ensemble each lane its own seeded stream, each starting at its own time (his), and a RULE: no two players
inhale within 1.5 s of each other (the later one's tone stretched or shortened within its range to clear it). Whether the ceilings are
right for THIS ensemble's players is his (the table is a guess from piece 5).

## §122. THE BREATH RULE APPLIED — his "numbers good"; the rules as data; the sax re-cut (2026-11-09; journal D12)

**His word on §121's set:** *"numbers good go ahead and apply pls."*

**As data — `bank/breath_rules.json`** (every number his or the morph's estimate, marked): the ceiling by register and dynamic (the morph's
BREATH_TABLE — p 15 · mf 11 · f 8 s for MIDI 53 … 65; the dynamic column p for marks under mp, mf for mp … mf, f for f and over) · the held
tone 85 … 100 % of it · one in eight short, 50 … 70 % · the inhalation 0.4 … 0.6 s · a remainder under 1.5 s is not a note · across the
ensemble no two inhalations within 1.5 s (the rule written; applied when a second lane is cut beside the first — `--avoid`, to come).
**The tool:** `tools/beat_saw.js` reads it (the count of held tones runs across the pairs, so "one in eight" is of the whole); `--breath
aim,jitter` stays as a plain-roll override.

**The sax re-cut** (f → the 8 s ceiling; seed 23): the four pairs 16 → 94.5 s, the sine 15 → 94.5 at mark 6.25, in over 1 s; the held tones
**7.6 · 6.9 · 3.2 | 7.1 · 7.4 · 1.6 | 7.9 · 4.3 · 7.1 | 7.7 · 6.9 · 3.9 s** (the 4.3 is the one-in-eight short; the 3.2 · 1.6 · 3.9 are each pair's
remainder before its end), the inhalations 0.4 … 0.6 s. NOT CLAIMED: his ear — whether 85 … 100 % of an 8 s guess is this player's breath.

## §123. The pop's real cause — a mid-span start came in over 15 ms; the five lanes rolled by SW-15's shapes, each under its sine (2026-11-09)

**His words:** SW-19 · SW-20. **The engine checked first:** sclang up since 17:29, the fade fix committed 16:24 — the fix WAS running. So the fade
itself was right and he still heard a pop. **The cause, in the page (`le_sine.js` sineMessage):** my own rule of §119 — *"a playhead that starts
INSIDE the brick comes in over 15 ms — the sine is already meant to be sounding there"*. He presses play inside the sine's span almost every time
(the sine begins at 15 s, the sax at 16; he starts at the sax, or anywhere after). Every such start was a 15 ms rise: the pop, "not starting
from zero". **Fixed:** a start inside the brick fades like its beginning — the brick's own fadeInMs (1 s here); 15 ms only for a brick with
none. His volume-bus picture is what the engine does (a Line in dB, §121); the page just never asked for it mid-span. SWEEP_LIST 3.

**His questions answered:** F5 — the CLARINET (sounding; the clarion register, stable, bends its 6 … 16 cents); F6 — the FLUTE, holding
STRAIGHT while the sine glides (a bend of 1 … 12 cents is under any player's control, §120); the violin on F4 and the cello on F3 as he settled;
the crotale on F7 — the sounding pitch; its key F5 (the Ricotti crotale sounds two octaves above its key, `sine_behaviours` sineOctave 24,
measured in Approaching), bowed (`crot_bowed`), **the pitch static — NO bend on any crotale note** (his SW-20; the tool writes none for a
`who: sine` lane), the SINE glides. The vibraphone's F6 is its top bar; the glockenspiel is the call's fallback for F7 (§120).

**The tool (`tools/beat_saw.js`, rewritten):** `--roll --until S` by `bank/beat_saw.json` — SW-15's shapes A (peak 8 … 10; the knee at two-thirds;
pace 1.8 … 2.6 s per beat, then 0.8 … 1.2) and B (peak 4.8 … 6.5; pace 2.6 … 3.6), alternating, which first rolled per lane; the holds 1.8 … 2.6;
the gaps 0.8 … 1.2 · `who: sine` lanes — a sine brick a PAIR (its gliss the pair's line in cents at the sine's pitch, ≤ 8 points), the note held
straight · the held tones by `bank/breath_rules.json` — a wind's breaths; **a string's BOWS** (new rows: a bow 14 · 11 · 8 s at p · mf · f, the
change 0.05 … 0.12 s — the AI's starts); **a crotale's bowings** (about 5.8 s, never past 8, 0.6 between — Approaching's numbers) · `--avoid`: no
inhalation within 1.5 s of another lane's (the save read), a held tone slid inside its range to clear; what could not be cleared is counted ·
each lane its own seed (23 + 101 × lane; on one seed five lanes rolled alike — seen and fixed). **The sine marks (the AI's starts, after
Approaching's ear — a low sine louder, a high one softer; `bank/beat_saw.json`):** sax 6.25 · clarinet 6 · flute 5.5 · violin 6.25 · cello 7 ·
crotale 4.5; the notes f, the crotale mp.

**Written into `piece-Section01-D-saxBeatTest` (69 objects: 9 sine bricks, 53 notes; his seven bricks):**
| lane | pitch | enters | pairs (shape · to … beats/s) | ends | who moves |
|---|---|---|---|---|---|
| Alto Sax | F4 | 16 s | the four dictated (SW-14) | 94.5 | the player |
| Clarinet | F5 | 26.4 s | A → 8.4 · B → 5.6 · A → 9.3 | 86.1 | the player (≤ 23 c) |
| Flute | F6 | 30 s | A → 9.3 · B → 6.1 · A → 9 | 84.6 | THE SINE (≤ 11.5 c); the flute straight |
| Cello | F3 | 32.8 s | B → 6 · A → 8.7 · B → 5.7 | 91.1 | the player (≤ 84 c) |
| Violin | F4 | 35.9 s | B → 5 · A → 8.6 · B → 4.8 | 86.6 | the player (≤ 42 c) |
| Crotale | F7 (key F5) | 39 s | B → 6.4 · A → 10 | 82.9 | THE SINE (≤ 6.1 c); the bar static, bowed ×7 |
The ensemble rule cleared most inhalations; a few could not be (said per lane). **NOT CLAIMED:** the sound of any of it — his ear.

## §124. The flute bends itself at F6 (his word, SW-21) — the AI's "sine moves" there reversed (2026-11-09)

**His words:** SW-21. **His question first:** F6 on the clarinet — a sounding F6 is the written G6 of the B♭ clarinet, altissimo, the recipe's top
note (89); holdable by a professional, thin and unstable for a 20-second tone, and no bend of a few cents is placeable there; the flute's F6 is
mid-high and easy. His call: the flute stays on F6 and GLISSES ITSELF. **Done:** `bank/sine_behaviours.json` flute `who: player`; the flute's lane
re-rolled on its own seed (23 — lane 0): the same three pairs (A → 9.3 · B → 6.1 · A → 9), now as the flute's bend (≤ 11.5 c) under ONE constant
sine 29 → 84.6 s at mark 5.5. The §120 advice stands in the record as the dead end it was for him: the smallness of the bend is the player's
problem to solve, and he trusts the flautist.

## §125. SW-22 — the six lanes carried to 96.6 s, every part fading over its last two seconds; the sine gains a fade-out (2026-11-09)

**His words:** SW-22. **The engine (`\leSine`, synths.scd):** `fadeOut` — a fall LINEAR IN DECIBELS to −60 over the last seconds, as `fall`, an Env
whose FIRST segment is flat (0 → 0 over dur − fadeOut: it lands exactly; §121's creep was a short or dB-shaped first segment) then −60 over
fadeOut; 0 = none, every earlier score as before. `fadeOutMs` on `/le/sine` (`sineSpec` · `sineArgs`) and on the brick (`le_sine.js`: the message,
the card's `Fade out (ms)` row). `sine_test` · `sine_page_test` PASS. The engine's §80.

**The tool (`tools/beat_end.js`, new, the piece's):** for each lane with a sine brick — the held tones go ON past the last pair by D12's rules
(a wind's breaths · a string's bows · a crotale's bowings), holding the beating where it stood (the bend flat at its last cents; the crotale
straight), the last one ending exactly at --end with a DIMINUENDO TO NIENTE over its last --fade seconds (the note's nodes: its height held,
then 0.05 — the stack performs a shape through the fader, the law's niente at the edge); the sine to --end (a constant sine's brick stretched;
the crotale's last gliding brick stretched with its line kept in TIME and its last value held) with `fadeOutMs` = the fade.

**Written into `piece-Section01-D-saxBeatTest`:** sax +1.6 s at 24.6 c · clarinet +10 s at 22.9 c (over its 8 s ceiling by the remainder rule —
the previous tone takes the rest; his ear) · flute 7.8 + 3 s at 11.1 c · cello 5.4 s at 55.6 c · violin 8 + 1.9 s at 23.6 c · crotale 4.8 + 8.7 s
straight — every lane's final tone dim. 94.6 → 96.6, every sine out 94.6 → 96.6. NOT CLAIMED: the sound — the engine restarts for the fade-out.

## §126. SW-23 — fifths up from the cello's lowest F: the range check (2026-11-09; a check, nothing built)

**The series:** the cello's lowest F is F2 (41, on the C string); up in fifths: F2 · C3 · G3 · D4 · A4 · E5 (41 · 48 · 55 · 62 · 69 · 76). **Against
the recipes' sounding ranges** (`sandbox/instruments.js`; the call's instruments):
| slot | note | his instrument | the instrument's range | verdict |
|---|---|---|---|---|
| 1 | F2 (87.3 Hz) | cello | C2 … B5 (36 … 83) | ✓ — its lowest F; a semitone bend = 100 c, fine |
| 2 | C3 (130.8 Hz) | alto saxophone | D♭3 … A5 (49 … 81) | ✗ — a semitone UNDER the alto's bottom (written B♭3 = sounding D♭3). The BARITONE sax (the call's doubling) has it; so would the bass clarinet, the cello, the piano |
| 3 | G3 (196 Hz) | clarinet | D3 … F6 (50 … 89) | ✓ — the chalumeau, warm, bends well |
| 4 | D4 (293.7 Hz) | violin | G3 … E7 (55 … 100) | ✓ — but it is the OPEN D string: an open string cannot be bent; the player takes it on the G string (4th finger) — a note for the part |
| 5 | A4 (440 Hz) | flute | C4 … C7 (60 … 96) | ✓ — the low register, soft and breathy at f; the sine should sit under it in level |
| 6 | E5 (659.3 Hz) | crotales | sounding C6 … C8 (the keys 60 … 84 two octaves up) | ✗ — a fifth and more under the lowest crotale. The bowed VIBRAPHONE (F3 … F6) has E5 — live; in the simulation the vibraphone lane's recipe has no bowed-vibraphone voice yet (crot_bowed · mar_fx_bows only — the roster's pending list), so a stand-in would sound it |
**The AI's recommendation, put to him (the one decision):** keep the series and the order, with two instruments moved to what reaches: **cello
F2 · BARITONE sax C3 · clarinet G3 · violin D4 (on the G string) · flute A4 · bowed VIBRAPHONE E5** — or, if the alto and the crotales must
stay, start the fifths a fifth higher (C3 · G3 · D4 · A4 · E5 · B5: the alto on G3, the crotales still short of B5 — the crotales want C6 or
higher whatever the series). Nothing changed in the saves.

## §127. SW-24 — the fifths placed, the crescendo pair in every part; the strikes drawer checked (2026-11-09)

**The pitches (his octave displacement):** cello F2 · alto sax C4 · clarinet G3 · violin D4 · flute A4 · crotales E6 (sounding; the key E4, inside
`crot_bowed`). **The build (`tools/beat_saw.js`, two options added):** `--cresc from,to` — the note's dynamic SHAPED p → fff over the pair (the
nodes' heights 2.857 → 10; no struck-sound override: the law performs a shape through the fader), the sine's level a HAIRPIN over the same span
with its distance from the note kept (the lane's sine mark less the note's) and capped at fff — so the balance holds at the start and
closes toward the top: cello 4 → 7 · sax 3.25 → 7 · clarinet 3 → 7 · violin 3.25 → 7 · flute 2.5 → 7 · crotale 3.5 → 7; `--one` — a pair is one held
tone (a crescendo sung in one breath; 8.7 s is inside every ceiling but the winds' at fff — his ear). **The beating:** every part 0 → 6 a second
over 8.7 s (1.45 s per beat), the cents its own: cello 115 · sax 39 · clarinet 52 · violin 35 · flute 23 · the crotale's SINE 7.8 (the bar straight).
**The cello's 115 c passes the sampler's wheel (±1.012 st):** the note is played on F♯2 (key 42) with its bend re-based −100 → +15 c — the string
quartet's one-key rule (beat_pair / sine_go `rekeyChain`), now in beat_saw for any pair that needs it; the written note is F2. The sines
100.3 → 110 s, in over 1 s. Written into `piece-Section01-D-saxBeatTest` (88 objects).

**THE STRIKES DRAWER, checked, nothing to build:** the drawer's `ordinario` set (`strike_drawer.js` ART_SETS) is ALREADY senza vibrato where it
exists — violin and cello on `senza_vel`, the winds on their `ord` (the SI2 flute, clarinet and sax have no separate vibrato / non-vibrato
sustain — `ord` is the one), the percussion `main`, the pitched lane `crot_main_metal`, the piano `main`; `spiccato` · `staccato` · `percussive`
beside it (palette_check § 3 holds every key against the recipes). **The harmonies:** `bank/harmonies.json` is ONE file, byte-identical in
pieces 4 · 5 · 6 and here (generated 2026-09-07, PLAN 1d of piece 4): blasts 45 entries · chordShapes 54 entries · the strikes' `live` list
filled at run time — everything he had, up to the latest, is here. **The drawer's TAKES** (`bank/panel_snapshots.json` panels.strikes — the
named chords he dealt) are per piece: piece 6's 70 are here as carried (beating01 …, strikes01 …, on piece 6's lanes); piece 5's 239 are in
`septet_LGMF_2026` and would need their lanes re-mapped to come over — offered, not done.

## §128. The strike banks of Scattered Substance and Approaching carried into the drawer (2026-11-09)

**His words:** *"Can you look in Scattered Substance as well as the Approaching piece and those scattered strikes, harmonies that I played in?
Can you add all the different ones to the drawer?"*

**Where they live (the question named: what does the Strikes drawer read?):** `bank/scattered_strikes.json` — THE strike bank, read live by the
drawer (`strike_drawer.js` DB_URL; its ↻ db button), the beating panel, the chord run, the fill and the morph. Here it was the port's EMPTY
skeleton (piece 6's record: "recorded strikes are a piece's own"). Piece 4's holds **46 strikes** (`ScatteredStrikes01` — his keyboard into
the piano lane, 2026-09-03; 577 notes); piece 6's **60** (his marimba strikes played into the page, 2026-10-09; 429 notes). Piece 5's bank is
empty (its opening came from the piano strikes of piece 4's db by another route).

**Done:** both banks merged WHOLE into this piece's file — 106 strikes, 2 sequences, 2 ingestions; every strike keeps its id (the sources'
prefixes make them unique), its notes (midi · vel · dur · the displacements; the source lane and instKey stay as provenance), its timing; the
label and `_from` say the piece. The drawer deals a strike's PITCHES to this ensemble by its own rules, so the source lanes do not bind.
His page: ↻ db in the drawer, or F5. NOT CLAIMED: a deal from them heard.

## §129. The drawer: a hand-picked technique STICKS through the shuffle; the range is the technique's (2026-11-09)

**His words:** *"In the drawer, if I assign the vibraphone one crotales bowed, is it sensing that range as well, or is it still in the vibraphone
range? And then each time I shuffle, I have to reset it to crotales bowed. Is there any way to make it stick?"*

**The range — read (`strike_drawer.js` 132):** a row's range is the TECHNIQUE's own when the recipe gives it one (`crot_bowed` 60 … 84 — the
crotale keys, sounding two octaves up), else the instrument's. So yes: with crotales bowed on the row, the drawer fits and folds into the
crotales' range, not the vibraphone's.

**The reset — why:** a shuffle (or a chord's deal) hands every row its technique from the ARTICULATION SET in force (`setTech(cfg.artSet, lane)`:
the ordinario set's `crot_main_metal` for the pitched lane), so a hand choice on a row's menu was lost at the next shuffle. **Made to stick:**
`cfg.laneTech` — a lane's pinned technique, set when he picks one on the row's menu, honored by `setTech` for every shuffle and deal; a SET
button (ordinario · spiccato · staccato · percussive) is the one thing that clears the pins (pressing a set is an explicit word). cfg is saved
with a take and remembered in the browser, so the pin outlives the session. palette_check 202. His page: F5. NOT CLAIMED: his hand on it.

## §130. SW-27 — crescendo 02 (112 → 118 s, → 7 beats/s) from his take SwCres02a; the sine's fade-in halved (2026-11-09)

**His words:** SW-27. **The take** (`bank/panel_snapshots.json` panels.strikes `SwCres02a`, saved 23:31, "harmony S025 · BLASTS · the tuba piece"):
ten voices of the blasts harmony, six placed on lanes — flute F4 · clarinet G3 · sax F5 · violin D♯6 · cello D♯2 · the pitched lane F♯4 on
`crot_bowed` = the KEY, sounding F♯6 (the harmony's own F♯6, unplaced, is that pitch class); four voices unplaced (the piano among them). The
beat_saw tool takes the SOUNDING pitch, so the crotale was given F♯6.

**Built:** six pairs 112 → 118 s, 0 → 7 beats/s over 6 s (0.86 s per beat — his series: one beat faster each time), p → fff, one held tone each,
the sines 111 → 118 in over 500 ms, hairpins with the balance kept and capped at fff. The cello's 149 c at D♯2 passes the wheel: played on E2
with its bend −100 → +49 c (the one-key re-key). **The fade halved:** `bank/beat_saw.json` fadeInMs 500 — the default from here; the FIRST
crescendo's six sines (100.3 s) set to 500 by hand; the 15 s sines keep their second (his "leave the rest"). The save: 101 objects.
`piece-Section01-D-saxBeatTest`; his page: File ▾ → Reload. NOT CLAIMED: the sound.
**Correction to the line above:** the first crescendo has SIX sines — five constant ones from 100.3 s and the crotale's gliding one from 101.3 s (a brick a pair starts at the pair); the sixth was set to 500 ms after the count read five.

**His working save moved (2026-11-09, late): `piece-Section01b-BeatingUnisonCrescendos-B` — the D test save as he saved it at 18:39, his from here. Crescendo 02 and the halved fades were written to D first and then to B at his word ("I didn't see it in the reload"); every tool from now targets B (the name in the journal §2).**

## §131. SW-29 — crescendo 03 from SwCres03a; the crescendos' sines start WITH the notes, from silence over 500 ms (2026-11-09)

**His words:** SW-29. **The fix on the two crescendos (his save `piece-Section01b-BeatingUnisonCrescendos-B`):** the ten sines of crescendos 01
and 02 moved to begin AT their notes (101.3 · 112, not a second before), `fadeInMs` 500 — the engine's rise is a Line in dB from −60 (§121),
"essentially nothing"; the first section's sines (15 s, a second early at 1000 ms) left as he asked. **Crescendo 03** from his take `SwCres03a`
(six placed: flute F6 · clarinet B3 · sax G♯5 · violin F5 · cello C3 · the crotale key A5 bowed, sounding A7): 119.5 → 124.25 s (4.75 s), 0 → 8
beats/s (0.59 s per beat), p → fff, one held tone each, the sines WITH the notes, in over 500 ms. The cello's 103 c at C3 is re-keyed to C♯3
with its bend −100 → +3. The save: 112 objects. **His musing on 350 ms, answered by the choice of 500:** the engine's dB-linear rise is at
−30 dB halfway, so 500 ms is already soft at the start and present by its end; 350 would be hardly different to the ear — his to say after
hearing. NOT CLAIMED: the sound.

## §132. SW-30 — crescendo 05 from SwCres05a, 127 → 134 s, → 9 beats a second (2026-11-09)

**His words:** *"127 to 134 c5"* — the take `SwCres05a` (his c5), the series' next rate 9 (6 · 7 · 8 · 9); `SwCres04a` stands unused. **The take's six placed:**
flute F♯6 · clarinet D6 · sax C♯4 · violin C♯5 · cello F♯2 · the crotale key F♯4 bowed (sounding F♯6). **Built:** 127 → 134 s (7 s), 0 → 9 beats/s
(0.78 s per beat), p → fff, one held tone each, the sines with the notes, in over 500 ms. The cello's 162 c at F♯2 re-keyed to G2 (−100 → +62).
The clarinet's D6 is high (sounding; the recipe's range reaches F6) — his take, his call. The save: 124 objects. NOT CLAIMED: the sound.

## §133. SW-31 — the C-octave crescendo, 137 → 144.15 s, → 10 beats a second (2026-11-09)

**His words:** *"137 144.15 c octaves c3 up as best as can fit"*. **The ladder, by range** (the recipes' sounding ranges): cello C3 (the C string's
octave) · alto sax C4 (its middle) · clarinet C5 (the clarion) · flute C6 (clear and easy) · violin C7 (high, inside its E7 top — a bend of
8 c there) · the crotale C8 (the key C6 — the top of the bowed crotale's roster, sounding two octaves up). The alternative with the flute on
C7 (its very top) was set aside: a 7-second crescendo to fff on the flute's highest note is a strain; the violin's C7 is ordinary.
**Built:** 137 → 144.15 s (7.15 s), 0 → 10 beats/s (0.72 s per beat — the series 6 · 7 · 8 · 9 · 10), p → fff, one held tone each, the sines with
the notes, in over 500 ms; the cello's 128 c at C3 re-keyed to C♯3 (−100 → +28). The save: 136 objects. NOT CLAIMED: the sound.

## §134. The C-octave crescendo ends with the electronic zone, 144.45 s (2026-11-09)

**His words:** *"The card on the electronic zone, zone 35, shows me it ends at 144.45. But the C crescendos don't end at the same time. Can we
extend those so they all end at the same time as the electronic zone?"* **Done on his save:** zn-35 is the material brick `opening-mix-orchestrated-9m45`
(85.05 → 144.45); the C crescendo's six notes and six sines (137 →) now end at 144.45 — the notes' shapes reach fff at the new end, the bend's
last cents held over the extra 0.3 s; the crotale's gliding sine keeps its line in time and holds its last value. The tool's end for a
dictated pair is the line's; a `--end` that snaps to a brick's end is a line to add when it comes up again.

## §135. His keyboard sounds the piano AND the flute; the piano's four tracks were all on every channel; the piano's four voices (2026-11-09)

**His words:** *"When I have piano on, it plays all the MIDI. It's like Omni … piano only has the one struck playing the placeholder. It'd be good to
have the plucked piano and then the muted or harmonic as well as an option."* Then: *"It's still just playing piano and flute."* His screenshot:
the Rec row on Piano · struck; the status line *"key 58 is outside Ordinario (60–96) — not sent"* — the FLUTE's ordinario range: at that key the
page's echo went to the flute.

**Read (the rack through the bridge, read-only):** the four piano tracks — Piano Kontakt · PianoPlucked Kontakt · PianoHarm PP2 · PianoMute PP2 —
ALL on `SWPiano · all channels`: one piano note sounded all four instruments (his "omni"). The keyboard reaches the rack ONLY through the
page (`onHwMidi` → `recRouting` → the Rec row's lane and technique); no Reaper track listens to the Keystation.
**Done in his open Reaper (unsaved, his CTRL+S):** the three other piano tracks on their own channels — plucked 5 · harmonics 6 · muted 7; the
struck piano keeps all channels (its flat notes on 1, its curve copies 2 … 4). **The recipe (`sandbox/instruments.js` piano):** the four voices
as techniques on those channels, `curveTechniques: ["main"]` (the law: a voice with no curve copy is sampled once on its own channel); piece 4
had them on 2 · 3 · 5 — here 2 … 4 are the struck piano's curves, so they moved. The Rec row's technique list and the drawer's row menus read
the recipe, so the three appear as options at once. palette_check 202 (14 recipe keys unregistered — noted by the check, as before); roster 327.
**The flute (`composer.html`):** a guard — the record target follows what the Rec row SHOWS at init and on every return to the page
(`pageshow`), since a browser may restore a select's shown value without a `change`. Whether that was the flute's path, or a SECOND composer
tab echoing on its default lane (the flute), his one check tells: one tab open, a key pressed. NOT CLAIMED: the cause of the flute.

## §136. HIS TASK — the counterpoint from 199 s on one loudness scale: the dynamics law's ladder written into the played-in notes (2026-11-10)

**His words (dictated, light corrections):** *"There's a counterpuntal section beginning around 199 seconds. Can you find a relatively simple way to
get a better volume balance between these six parts? I'll task you with this, and then I'll pick up next session so you can take your time to
figure it out. But maybe something not too complex that takes a lot of redoing things … maybe scan each part and see which is the loudest and
try to match the fortes across the board, or the three Fs across the board, or even the velocity numbers across the board by volume. And
even if we just make some adjustments just for this section, because I'm probably going to have some sort of redistribution of the velocities
or the dynamic marks anyways — just as long as the p's across these are the same and the fff's across these are the same."* The save:
`piece-Section02-B-08ctpt-VolFix` (his `-preVolFix` copy beside it).

**What the section is (the save read):** 366 played-in notes, 195 … 253 s, six lanes — flute (staccato) 44 · clarinet (staccato) 42 · alto sax
(staccato) 54 · the pitched lane on `glock_main_hard` 62 · piano (main) 117 · violin (stac_vel) 47; every note `sonifyMode: plain` with `recVel`
— **a played-in note SOUNDS AT THE VELOCITY HE STRUCK** (the sender: `velAbs`, else a plain note's `recVel`), and the same velocity is a different
loudness on every instrument; its HEIGHT is the page's own rule, y = recVel / 127 · 10, so the written marks are his dynamics as played (mostly
ff and fff here).

**The simple way, the stack's own:** THE LADDER of the dynamics law — `TextureDyn.ladderVel(remap, instKey, midi, level)` → `VelocityRemap.velocityFor`
through the MEASURED velocity→loudness curves of `bank/velocity_remap.json` (container 5's card: cello · flute · clarinet · alto sax · violin ·
piano; K-weighted, inverted against the ensemble target) — the velocity that makes a given written dynamic the SAME loudness on each instrument.
`tools/vol_fix.js` (new): for each plain note in the window, the written level from its height, `velAbs` = the ladder's velocity for that level
on that instrument and pitch; the height, the time and the technique untouched (the notation unchanged); the played velocity kept in
`properties.volFix` (`--undo` restores). The residual fader step (the law's 2.29 dB a mark on CC7) is not sent for a plain note — the scale is
a little compressed, EQUALLY for all five, which is his condition. **The ladder at C5:** flute p 49 · mf 75 · fff 120 · clarinet p 71 · mf 85 ·
fff 118 · sax p 47 · mf 57 · fff 98 · piano p 89 · mf 109 · fff 123 · violin p 77 · mf 93 · fff 120.

**Applied:** piano 117 notes, mean velocity 103 → 116 · flute 44, 108 → 104 · clarinet 42, 113 → 112 · alto sax 54, 105 → 99 · violin 47, 109 → 109 —
304 notes on the ladder. **The glockenspiel's 62 LEFT AS PLAYED:** the pitched lane's mallet voices have no measured curve (the law's "not
reached"); the ladder's fallback, the anchor scale, would have sent its fff to 127 — too loud to trust unmeasured. NITS: measure the
glockenspiel (the card's method on the Ricotti glock, a few velocities at a few pitches) and run the tool again on that lane.
**Rejected:** matching by the loudest part or by raw velocities (his first thoughts) — the same velocity is not the same loudness; the law has the
measured answer. NOT CLAIMED: his ear — next session. `--undo` is one command.

## §137. The task done the second way — the section's parts MEASURED through the rack and mapped to one level (2026-11-10)

**His words:** *"Did you actually take measurements? If not, can you play thru each part solo and compare velocities against recorded levels."*
Then: *"Yes, that's what I was looking for. I think the issue is they're using a different set of articulations. So that's why I say just for
this section — if we can just calibrate this particular section and find a way to swap volumes when we run this section. I want velocity 100
in each of these parts to sound approximately the same actual measured level, as much as you can. I'm eventually going to change pitch,
probably, but I want to at least start with a level playing field. And I'm going to go through and change the dynamics of these. But when I
change to, for example, velocity 70, I want that velocity 70 to be about the same volume across all six parts."*

**The honest answer first:** §136 measured nothing — it leaned on the calibration card's curves, which were measured on the ordinary voices,
not on this section's staccato · stac_vel · glock_main_hard. UNDONE (`vol_fix.js --undo`; every note back to its played velocity).

**The measurement (`tools/section_level.js --measure`, with `tools/part_meter.ps1` — a winmm player, the probes' way — and `tools/part_meter.lua` — the
receiving track's peak sampled every defer tick in Reaper, found by the lane's port and channel):** each lane's voice as the section uses it,
ISOLATED notes 0.75 s apart (a first pass at the passage's own tempo had every note's window catch its neighbours — all marks read alike; the
flaw found and dropped), eight velocities × three pitches of the lane's own range in the section, CC7 127 first, CC0 where the voice needs it.
**The curves (the track's peak, dBFS, the mean over the pitches):**
| | 16 | 32 | 48 | 64 | 80 | 96 | 112 | 127 | spread over pitches |
|---|---|---|---|---|---|---|---|---|---|
| Flute · staccato (Fluteb SI2) | −16 | −13.6 | −10.7 | −7.9 | −5.8 | −4.4 | −3.1 | −2 | 0.7 dB |
| Clarinet · staccato (ch 12) | −18 | −16.8 | −15 | −13.2 | −11.2 | −9.4 | −7.9 | −6.7 | 2.7 |
| Alto Sax · staccato (Sax b) | −18.3 | −16.8 | −14.8 | −13.1 | −10.7 | −9 | −7.8 | −6.5 | 2.8 |
| Glockenspiel · main hard | −37.7 | −38.4 | −38.1 | −31.7 | −28.9 | −24.1 | −16.2 | −9.4 | 23.4 |
| Piano · main (Kontakt) | −32 | −27.2 | −22.2 | −19.1 | −19.1 | −13.4 | −9.3 | −10.5 | 10.5 |
| Violin · stac_vel (Xsample) | −32 | −28.1 | −25.3 | −19.9 | −17.9 | −15.7 | −14 | −10.5 | 7 |
**What it says:** the three SI2 staccatos are HOT and NARROW — 14 dB from velocity 16 to 127, the flute at −2 dBFS on a single note — while
the piano, the violin and the glockenspiel span 22 … 29 dB and top out at −9 … −10. The same velocity was 15 … 20 dB apart between a wind and a
string. That is the imbalance he heard.

**The map (`--apply`):** the TARGET curve = the mean of the six, shifted −3.1 dB so its top is the quietest voice's top (−10.5 at 127) — every part
can reach every level; each note's WRITTEN velocity (recVel — what he struck or types) is read on the target, and `velAbs` becomes the velocity
on its own lane's curve that gives that level. Sent velocities against written, on average: flute −76 · sax −51 · clarinet −46 · piano −12 ·
violin +3 · glockenspiel +11; e.g. written 100 → flute 23 · clarinet 48 · sax 48 · piano 92 · violin 104 · glock 115; written 127 → 45 · 80 · 77 ·
106 · 124 · 123. The notation and the written velocities unchanged; `properties.sectionLevel` on each note; `--undo` restores; **re-run `--apply`
after his edits** (his "swap volumes when we run this section"). The measurement: `bank/section_levels/piece-Section02-B-08ctpt-VolFix.json`.

**The cost, said:** level by velocity alone squeezes the winds to the soft end of their samples (the flute's loud notes at velocity 23 … 45) — the
same loudness, a softer tongue. If that timbre is wrong, the other lever is the FADER: a CC7 offset per wind for the section (the law's own
device, level on the fader, timbre on the velocity) — to build at his word. **Verification:** every mapped note played isolated through the
rack (`part_meter.js --isolate 0.75`), the levels by written mark across the six — its line follows.
**VERIFIED (every mapped note played isolated through the rack, `part_meter.js --isolate 0.75`, the level by WRITTEN mark, dBFS peak):**
| | mf | f | ff | fff |
|---|---|---|---|---|
| Flute | −16.6 (1) | −19.0 (8) | −14.3 (26) | −11.9 (9) |
| Clarinet | −18.5 (1) | −17.9 (3) | −12.8 (24) | −11.6 (14) |
| Alto Sax | −17.6 (2) | −16.7 (15) | −13.7 (26) | −11.5 (11) |
| Glockenspiel | — | −16.7 (12) | −13.4 (44) | −9.9 (6) |
| Piano | −19.2 (12) | −14.1 (18) | −13.0 (45) | −13.2 (34) |
| Violin | — | −19.5 (8) | −14.5 (26) | −13.7 (13) |
**At ff — the section's bulk, 191 notes — the six parts lie within 1.7 dB of each other (−12.8 … −14.5); at fff within 3.8 (the piano and the violin
at their ceilings, −13); at f within 5 (few notes, pitch-dependent).** Before the map the same written velocity stood 15 … 20 dB apart. The pass's
raw series and per-note peaks: `probes/part_meter/piece-Section02-B-08ctpt-VolFix-*.json` (scratch, not committed).

## §138. SW-32 held; the drawer's staccato set carries the glockenspiel's hard mallet (2026-11-10)

**His words:** SW-32 (verbatim in the sketch pad). *"And then is there a staccato one in the strikes drawer? You may need to revise it with the
instruments or the articulations I currently have. I think it's mostly staccato, it might be spiccato for the strings — one of those group
articulation settings, so I can choose chords using those articulations in the strikes drawer."*

**The drawer's sets (`strike_drawer.js` ART_SETS):** `staccato` — flute · clarinet · alto sax `staccato`, violin · cello `stac_vel`, percussion
and piano `main`; `spiccato` — the strings `spicc_vel`, the rest as staccato; `ordinario`; `percussive`. The pitched lane had NO entry in the
staccato set and fell to its ordinary (the crotales' metal mallet); the counterpoint plays that lane on `glock_main_hard`. **Added:** the
staccato set now names `bowed_vibraphone: 'glock_main_hard'` — one click puts the section's six voices on every row and on everything the
shuffle deals; a hand pick on a row still sticks (§129). palette_check 202 (§ 3 holds the key against the recipe). The spiccato set left as it
is (the strings' spiccato, the pitched lane its ordinary).

## §139. SW-33 — the counterpoint's harmonies dealt from his sixteen takes on hexagram-rolled containers (2026-11-10)

**His words:** SW-33. **Lineage first (his "I think it was with the live electronics"):** the time-container roll of the stack is Approaching's
three-body section — `score/public/three_body_roll.js` (carried here, pure, node-loadable): `hexagram(rnd)` = Cage's three coins six times → the
King Wen number 1 … 64, read across a container's range `lo + (n − 1)/63 · (hi − lo)`. The asymmetric run of lengths he remembers is this roll's
nature. Used as it is.

**`tools/harmony_roll.js` (new, the piece's):** containers over 200 … 253 s, each a hexagram across 1.5 … 3.5 s (seed 17); a DECK of the sixteen
takes `SW-ctpt-01 … 16` shuffled, one dealt at each container's start, re-shuffled when spent (its first never the one just dealt — his
"exhaustive"); every played-in note inside a container takes a pitch of its container's take: the take's voice ON THE NOTE'S LANE nearest the
note's own pitch (the counterpoint's contour kept; several voices on a lane → the nearest), a lane the take left unplaced → the harmony's
nearest pitch folded into the voice's range; the old pitch kept in `properties.harmony.was`, `--undo` restores; a MARKER at each container
start names the take and its hexagram. **Written into `piece-Section02-B-08ctpt-harmonies01`:** 22 containers — 3.28 · 3.02 · 1.63 · 2.52 · 1.56 ·
2.93 · 1.79 · 2.10 · 2.80 · 1.69 · 2.14 · 2.99 · 2.93 · 2.77 · 2.77 · 3.47 · 1.63 · 2.33 · 1.94 · 2.68 · 2.01 · 2.04 s — the deal 12 13 07 01 05 08 02 14 15
16 09 04 10 06 03 11 | 08 14 03 09 13 06; 296 notes, 285 pitches changed, 8 on lanes a take left unplaced (folded). The takes' pitched-lane
voice is the crotales' (crot_main_felt); the notes keep THEIR technique (glock_main_hard) and take the pitch, folded into the glock's range.
NOT CLAIMED: his ear — "let me hear those and then see". **The goal he names** (the dice and time-container strategies gathered): PLAN, a
line under § 2 when he reaches it.

## §140. SW-34 — the harmonic rhythm re-rolled with contrast: runs of longs broken by shorts, 0.6 … 2.5 s (2026-11-10)

**His words:** SW-34. **`harmony_roll.js --contrast`:** two classes — LONG containers, a hexagram across 1.5 … 2.5 s, in runs of 2 … 3; SHORT ones,
across 0.6 … 1.0 s, in runs of 1 … 3; the run lengths rolled from the same seeded stream (the AI's class bounds inside his 0.6 … 2.5; his to
move with `--long-lo` · `--short-hi`). The re-roll reads each note's ORIGINAL pitch (`properties.harmony.was`) for the nearest-voice choice, so a
re-deal keeps the counterpoint's contour and not the previous deal's. **Written (seed 17):** 37 containers — 0.96s 0.65s 0.84s | 2.26 2.17 |
0.66s 0.91s | 1.68 2.01 | 0.63s | 2.44 1.83 | 0.86s 0.61s | 2.31 2.26 1.56 | 0.85s 0.88s 0.94s | 1.64 2.09 2.10 | 0.89s | 1.71 1.99 | 0.99s 0.99s
0.87s | 2.18 2.01 2.31 | 0.61s 0.80s 0.99s | 1.96 1.57 — the deal 10 07 06 12 13 02 05 16 08 04 01 03 14 11 15 09 | 12 09 02 13 14 07 11 05 04 06
15 03 16 01 08 10 | 06 05 08 01 04; 249 pitches changed. NOT CLAIMED: his ear.

## §141. The harmonic rhythm quicker still: 0.5 … 1.5 s (2026-11-10)

**His words:** *"Okay, let's do the longest — let's make them 1.5 seconds. And then we'll take shorts down to 0.5."* **Re-rolled:** longs 1.1 … 1.5 s,
shorts 0.5 … 0.8 (the class bounds scaled inside his 0.5 … 1.5), the same runs rule, seed 17 — the containers and the deal in the tool's line
above this entry's commit. NOT CLAIMED: his ear.

## §142. His three articulation questions, measured: the flute's tongue ram, the jet whistle, the violin's pizzicato (2026-11-10)

**His words:** *"Harmonies good. Articulations: keep flatterzunge, staccato for flute; flute tongue ram and jet whistle sound the same? Can you work
out if one of them needs changing? Pizz not working."*

**The tool (`tools/artic_probe.js`, new):** isolated items into one port — a CC0 or a keyswitch at a lead, a note, its length — the receiving track's
peak sampled in Reaper; per item the peak and the level at 0.1 · 0.3 · 0.6 · 1.0 · 1.4 s after the onset: a sustaining voice holds, a plucked or
struck one decays, a dead preset reads nothing (`part_meter.ps1` · `.lua` behind it).

**The flute's FX KS part (ch 5), G4 at 100:** jet whistle (C1 = 36): −5.1 peak, −15.9 → −8 → −15 → −28 — a SWELL, its own shape · key click (C#1 =
37): −6.8, −8 → −14 → −24 → −35 · tongue ram (D1 = 38): −6, −6 → −12 → −22 → −34 · NO keyswitch: −6, −7 → −13 → −21 → −34. **So D1 switches nothing —
tongue ram and the bare preset are the same sound (the key click's), and only C1 is a switch that changes it.** The recipe had said so since
piece 4 ("UNVERIFIED … his word 2026-09-04: i dont see a tongue ram in the sampler"). SI2's tongue ram is its "Flute Pizzicato" preset (the
recipe's `pizzicato` key, `notate: "tongue ram"`, part 13): **SILENT here** (−79 dB: the part is not loaded in this rack's UVI). **Done:** the
recipe's `tongue_ram` now IS the Flute Pizzicato preset on channel 13 (`placed: false` until his hand loads it; the duplicate `pizzicato` key
folded in). His hand: UVI, the flute instance, part 13 ← "Flute Pizzicato", MIDI channel 13. The jet whistle stays as it is — it works.

**The violin's pizzicato, A4 at 100 (`cc0` = the preset − 1):** senza (5) SUSTAINS −24 … −25; pizz #70 (69) DECAYS −15 → −21 → −30 → −42 → −56; pizz
vib #71, pizz open #72 (an open A), sul pont #77 — all decay; a note with no CC0 after keeps the last preset. With the CC0 at the SAME INSTANT as the
note (the drawer's audition sends them back to back): still a pizz, 3 dB softer at the attack. **The sampler's pizzicato works by every road
measured.** Not found: WHERE his pizz failed — the drawer's row, the Rec row, or playback — and WHICH entry: the open-strings and harmonics
pizzicati are FIXED-pitch presets (`kind: "fixed"` — only their own strings sound; any other pitch is silent), and `pizz_x_sp_mw` needs the wheel.
Asked.

## §143. THE MIDI SHORE-UP, part 1 — the rack audited against the lineage's standard; what was text is fixed (2026-11-10)

**His words (the ask, while away):** *"a very thorough review of all the things that got missed and try to implement them … loopMIDI ports
including the b versions, Reaper tracks, every articulation on its own channel — no keyswitches, CC0 for Xsample, the 4-channel CC7
round-robin copies, round robin volume copies, the full percussion battery in the session, glissando done right, instrument volumes and
masters … fix the porting instructions so the next port carries the standard … please just continue through as much as you can do
independently."* And later: *"there are a number of like effects to turn off in the UVI or to bypass … pay attention to the effects that we
turned off in the previous ones too."*

**The standard, read from the record** (the home's `protocol/howto/` rack · uvi · kontakt · spitfire-aro, protocol § 4, this piece's
RACK_SETTINGS § 0): ports by the standard set, a `b` port where a UVI instance overflows 16 parts · one track per instrument, input by
port NAME · UVI: one part per preset, the three Ordinario curve copies, gain +6, every insert bypassed but the convolver, Dynamic 1.00 ·
Kontakt (Xsample): four slots ch 1 … 4 of the same instrument, CC0 = preset − 1, round robin off in a saved copy · Spitfire ARO: one
instance per instrument on its channel of the percussion port, never CC7 · the recipe DERIVED from the rack.

**The rack as it stands (`reaper/bridge/jobs/rack_inputs.lua`, new — every track's LIVE input through the bridge):** 26 tracks; 14 `SW` ports in
loopMIDI; the five SI2 instances on their ports, all channels; eight ARO tracks on `SWPerc` ch 1 … 8; five Kontakt mallet instances; the
piano's four tracks on `SWPiano` — `Piano Kontakt` all channels, `PianoPlucked Kontakt` ch 5, `PianoHarm PP2` ch 6, `PianoMute PP2` ch 7;
violin and cello Kontakt; ELEC RETURN; REC. Every UVI part listed (`uvi_state.js info`): Flute SI2 16 parts (10 of them KS presets),
Fluteb 6 (staccato · trills KS · whistle tones · three Ordinario copies), Clarinet 16 (copies 14 … 16; no `b`), Alto Sax 16, Alto Sax b
6 + copies 14 … 16, parts 7 … 13 EMPTY.

**Found, and fixed as text:**
- **The flute's tongue ram (Flute Pizzicato, part 13) was SILENT** (§142) because its OUTPUT was `$Engine/Out 2`, not the main pair —
  piece 4 had routed it to a separate output. `uvi_state.js set-output "Flute SI2" 13 "" --push` → it sounds (−6.6 dB peak at 100,
  decays). Its EQ and Maximizer were ACTIVE where every other part had them bypassed — `uvi_edit.js baseline` run on the whole instance
  (idempotent for the rest). The flute's `UVI_PARTS` row still said `tongue_ram` = ch 5; regenerated below.
- **The prepared piano was SILENT on its new channels.** The recipe and the tracks say harmonics ch 6, muted ch 7 (this session's
  piano fix); the PP2 instances' parts still listened on piece 4's channels 3 · 4 and 5 — a track filtering channel 6 passed channel-6
  notes to a part listening on 3. `tools/uvi_set_channel.js` (new): the part's MidiChannel rewritten and pushed. **Then still silent** —
  and the probe with the track opened to all channels showed the LIVE instance answering on 3 and 5 while Reaper's chunk said 6 and 7:
  the 15 MB Prepared Piano 2 instance STORED the pushed state and kept PLAYING its old one. Taking the FX offline and back
  (`TrackFX_SetOffline`) re-instantiates it from the stored state — then harmonics on 6 and mutes on 7 SOUND (−9.8 · −10 dB peaks). The
  cycle is now part of every `uvi_state.js` push. His note on the effects: PP2's Maximizer was active on the mutes and on the second
  harmonics part — baselined (the convolver's flag on PP2 did not take the edit; it stays as piece 4 left it, bypassed — a dry prepared
  piano; noted in RACK_SETTINGS, his to turn on).
- **The piano's Kontakt map, measured (`artic_probe.js --track`, new — the meter on a track BY NAME, needed where several tracks share
  a port):** `Piano Kontakt` sounds ch 1 (−14.8) and a FAINT ch 2 (−58.9 — piece 4's plucked-piano slot in the same instance, at a
  volume that is no use); ch 3 … 8 nothing. So the piano has NO curve copies on 2 · 3 · 4 — a SHAPED piano note (the dynamics law
  sends it to a curve channel) plays nothing, or the faint slot. `PianoPlucked Kontakt`: nothing on any channel 1 … 8 — an empty or
  silent instance (piece 4's record already said "plucked: NOTHING sounded"). **Kontakt is his hand** (a script runs only inside
  Kontakt): the slots to make are listed in PLAN § 1c.
- **The keyswitch presets in use** — his articulations on a shared KS part: the flute's jet whistle (FX KS, C1) and the sax's slap
  pitched + exploding slap (Slap Modes KS, C1 · D1). The XML of a KS program shows the mechanism: ONE program, several LAYERS (Flute FX
  KS: "Flute Jet Whistle C1" · "Flute Key Click C#1" · "Flute Tongue Ram D1"; Slap Modes KS: Slap Pitched C1 · Slap Unpitched C#1 ·
  Exploding Slap Pitched D1), the script choosing among them on the red keys. `tools/uvi_split_ks.js` (new): the program cloned onto
  free parts, every layer but one bypassed and muted, the clone renamed "<preset> - <layer>", so `apply_uvi_parts.js` places the
  technique by name and no keyswitch is ever sent. To be run and PROVEN after the alive sweep (the jet whistle's swell on a part that
  received no key is the proof — the meter can tell a swell from a decay, §142).

**The alive map (`tools/rack_alive.js`, new):** every port, every channel that could hold a voice, one note each, the receiving track's
peak — the ground truth the rest of the review stands on; running as this is written, its table to `probes/rack_alive/latest.md` and
§144.

**Not text — his hands, collected in PLAN § 1c:** the Kontakt slots (the piano's three Steinway copies on ch 2 · 3 · 4 and the plucked
slot moved to ch 5 at a usable volume, or loaded into the empty instance; the violin's and cello's round-robin-off copies in all four
slots) · the percussion the call names that no earlier rack holds (snare · tam-tam · opera gong · a bass drum beside the alt) loaded in
Spitfire's browser; what piece 5's rack holds (Brake Drums · Bass Drum · Tam Tams) is cloned as text.

## §144. THE MIDI SHORE-UP, part 2 — the alive map, the keyswitch presets split and proven, the battery completed (2026-11-10)

**The alive map (`tools/rack_alive.js`, every port, every channel, one note each; `probes/rack_alive/latest.md`):** every SI2 part
answers (the flute's Finger Modes KS part 6 reads nothing at C5 — a by-key preset, its keys are the music's); Fluteb's three Ordinario
copies · the clarinet's 14 … 16 · the sax b's 14 … 16 all at one level; **the vibraphone and the violin have their four slots** (ch 1 … 4
within 0.1 dB — the standard holds); the cello four; the Ricotti mallets' slots all live (crotales 9 · glockenspiel 12 · xylophone 10 ·
marimba 8); the eight ARO tracks each on its channel. **The piano: `Piano Kontakt` ch 1 only** (no curve copies; the ch 2 slot too faint
to register), `PianoPlucked Kontakt` nothing, `PianoHarm PP2` ch 6 and `PianoMute PP2` ch 7 (after §143's fix).

**Two lessons of the meter, both fixed in `artic_probe.js`:** (1) THE ALIGNMENT — the first sound heard was taken for item 1; when the
leading items were dead channels every reading shifted one item early (the prepared piano "answering on channel 3" was channel 6 read
through a dead 3 · 4 · 5). Now the first sound goes to the item whose offset is nearest the player's start, and the items must sit at
least 3 s apart (the player starts within about ±1.2 s of the watch — a 2 s gap is ambiguous); (2) THE LOADING — a reloaded instance
answers nothing for some seconds; a probe straight after a push reads SILENT. Both had produced false "silent" verdicts in part 1's
first readings; the settled re-probes are the ones that count.

**The keyswitch presets split (`tools/uvi_split_ks.js`) — what the meter proved, and what it did not:**
- **The flute's jet whistle on Fluteb part 10** — the FX KS program cloned across instances, the Key Click and Tongue Ram layers bypassed
  and muted, the layers in their original order: G4 at 100 reads −5.1 → −12.8 → −8 → −16.4 → −29.1 → −40.4 — the SWELL, and to the
  decimal the numbers of §142's keyswitched jet whistle (C1 held). **Proven: the jet whistle without a key.** The same program with the
  Tongue Ram layer live (index 2) reads NOTHING; with the jet whistle moved last, nothing either (the test parts 7 · 8 · 9 emptied —
  `tools/uvi_empty_part.js`). The FX KS layers hold 1 · 15 · 15 sample players — the jet whistle is one sample, stretched.
- **The sax's three slaps on Alto Sax SI2 b parts 7 · 8 · 9** — Slap Modes KS cloned within the instance. In the original layer order
  only the part whose live layer is LAST (the exploding slap) sounded; with the live layer MOVED LAST each part sounds (`--move-last`).
  Their readings differ by part and by pitch (pitched F4 −10.3 / F5 −8.1 · unpitched −8.8 / −10.7 · exploding −10.1 / −9.6), so three
  layers play, not one. **What the meter cannot say is WHICH slap each part plays — his ear, when he writes them.** The mechanism (why the
  flute's program wants its live layer first and the sax's wants it last) is NOT understood; the position that sounds was found by trial,
  the layers' internal Names (`Layer0` · `Layer 0` · `Layer 1`) the one clue. The recipe: `jet_whistle` → "Flute FX KS - Jet Whistle"
  (Fluteb ch 10), the three slaps → their parts; no `ks` on any of them; `apply_uvi_parts.js`: flute 29/29 · clarinet 17/17 · sax 32/32
  placed, the whole Slap Modes KS on b part 4 the one unused part. `palette_check` green (208).

**The battery completed — three cloned as text, one his:** `make_perc_tracks.lua` grew four rows (channels 9 … 12 of `SWPerc`); the
empty tracks it made took piece 5's track chunks (`build_rack.js --emit-src p5` → `tools/set_track_chunk.js`, new): **Brake Drums (C)** ·
**Bass Drum (GC) (C)** (the Gran Cassa All-in-one active — the catalog's `gran_cassa`) · **Tam Tams (C)** (Tam Tam A AIO active —
`tam_tams_a`, piece 5's slug); each sounds at C2 (−14.8 · −15.9 · −25.6). **The snare:** no earlier rack holds one, and a preset never
loaded cannot be set as text (piece 5 §35) — the fresh instance came up with the plugin's last preset, Piatti (C); HIS LOAD in Spitfire's
browser, then `aro_state.js info "Snare ARO"` confirms. The call's **opera gong** has no ARO instrument (NITS). `perc_selection.json` 12
rows → `apply_perc.js`: 42 techniques on the percussion lane; `roster_check` green (339 voices, 27 pending).

**Standing in the record:** the Spitfire plugin's "empty instance" is never empty — it loads whatever it last held; read it back before
trusting a name. A track clone from an earlier rack may carry a second FX (the brake drums came with a JS Volume Adjustment from piece
5's trims — left as it came, 0 dB would be the baseline; RACK_SETTINGS).

## §145. PLAN 1d · 1e built — his articulations dealt into the counterpoint; the level map goes per articulation (2026-11-10)

**His words (SW-35 and the ask):** *"an algorithm to distribute my chosen articulations into the counterpoint section"* — with *"ranges, swaps,
longer notes for flz / bow pressure"*, then *"per-articulation volume normalization against a standard level."*

**The deal (`tools/artic_deal.js`, the lists in `bank/artic_deal.json` — his SW-35 as data):** per lane the section is cut into time containers
by the hexagram roll (the lineage's; 1.5 … 6 s here), each container dealt the next articulation of a shuffled, exhaustive deck; every note in
the container takes it. The rules as he gave them: a pitch outside the articulation's range is folded by octaves into it, or the note takes the
next articulation that can hold it (a SWAP); the flutter tongues and the bow overpressure want a LONGER note — a note under 0.5 s is GROWN
toward 0.5 within the lane's room (the next note's start less 30 ms), or, with no room, takes another articulation. A deck entry may name
another LANE: the percussionist's strikes (china scrape · brake drums poly beater and rubber mallets · spring coil · the gran cassa's medium
felt and its rute on the rim) are dealt among the GLOCKENSPIEL's notes and the dealt notes MOVE to the percussion lane, the pitch becoming
the strike's nearest key — his *"we can keep the glockenspiel, just mix those in"*, read as one player's two lanes. Every change under
`properties.artic.was`; `--undo`; markers per container (`--markers`).

**The first deal, seed 17, on `piece-Section02-B-08ctpt-harmonies01` → `scores/piece-Section02-C-artics-01` (a NEW save; his stays):** 366 notes,
230 changed · 53 grown (the clarinet's and the sax's flutters from 0.1 … 0.27 s to 0.5) · 13 folded · 10 swapped · 51 glockenspiel notes
become strikes. Per lane: flute jet whistle 11 · staccato 11 · tongue ram 12 · flz 10; clarinet staccato 21 · flz 21; sax double tonguing 11 ·
staccato 12 · flz 10 · slap pitched 12 · exploding 9; piano main 81 · muted 17 · plucked 19 (the plucked SILENT until his Kontakt step, PLAN 1c
step 4); violin behind-the-bridge 10 · bartók 5 · overpressure 12 · col legno gettato 13 · gettato 7; glockenspiel 11 kept. The cello has no
notes in the section as saved. **26 voices** where the volume fix had six.

**What I decided for him, his to reverse:** the ordinary is NOT in a lane's deck unless he lists it (the piano's `main` is listed; the flute's,
clarinet's, sax's and violin's decks are his articulations only — the staccato he said to keep is there) · the bass drum "plain" is the gran
cassa's medium felt · one roll per lane (each lane changes articulation at its own moments) · the deal writes a new save.

**The level map per articulation (1e) — `section_level.js` extended:** a VOICE is now (lane, technique) — one curve per articulation the section
uses, keyed `instKey:technique`; `--apply` maps each note by its own technique's curve; an older per-lane file still reads. Two details from
§144's lessons: the grid plays its loudest velocity first in each pitch block (the series aligns on the first sound heard; a velocity-16 note can
be under the threshold), and no CC7 is sent on the Spitfire port. The measure of the 26 voices runs after the alive sweep (the meter is one).

## §146. The level map per articulation, first run — what the measure found, and the three fixes it forced (2026-11-10)

**The first measure of the 26 voices** (`section_level.js --measure` on `piece-Section02-C-artics-01`) read three voices at NOTHING and
several far down; the first `--apply` then put the target 120 dB under the floor — every note sent at velocity 1. Three faults, each fixed:
1. **The meter took the wrong track for the piano's voices.** `part_meter.lua` found the first track on the port that matched the channel
   OR listened to all channels — on `SWPiano` that is `Piano Kontakt` (all channels) for EVERY channel, so the prepared piano's muted and
   plucked voices were metered on the Steinway's track and read −150. Now a track filtering exactly the channel wins; the all-channel track
   is the fallback.
2. **A voice that reads nothing must not shape the field.** `--apply` now leaves out any voice whose top is under −60 dB (a dead part, an
   unloaded preset, dead keys — the plucked piano until his Kontakt step) and takes the target as the mean of the LIVE voices.
3. **Two percussion key maps were wrong, and one by-key voice had no keys.** `tools/key_sweep.js` on the three cloned instruments: the
   brake drums' All in One sounds 36 … 39 · 41 · 43 (poly beater) and 48 … 51 · 53 · 55 (rubber — the catalog had that block at 60 … 67, an
   octave up, so every rubber-mallet note was dead); the gran cassa sounds 36 … 45 · 48 … 57 · 60 … 65 · 67 · 69 · 71 … 75 (the catalog's
   "predicted" map had every other key — the rute on the rim at 72 · 74 · 76 half dead); the tam-tam A's sweep is masked by its own ring
   (keys 42 · 43 · 45 … 59 read under the ringing — the sweep waits 2.5 s at most; its catalog entry, verified in piece 5, stands).
   `bank/aro_percussion_catalog.json` corrected for the two (the catalog's names kept where its key sounds, the rest named by their block;
   the gran cassa's status `partial`), `apply_perc.js` re-run (44 techniques). **The violin's pizzicato behind the bridge** is a BY-KEY voice
   whose keys the recipe held as "pending" since the start — the deal had folded pitches into a range the sampler does not play. Swept with
   its preset (CC0 80): **55 … 76 sound** (G2 … E4, −23.6 … −26.4 dB at 100), nothing outside. A new mechanism on the lineage's pattern:
   `bank/measured_keys.json` → `tools/apply_keys.js` → a MEASURED_KEYS block in the recipe (`applyMeasuredKeys` gives the voice its key
   table and the keys' span as its range) — the first of the 27 pending by-key voices measured; the rest go the same way as the music
   asks for them. `artic_deal.js` deals a by-key voice onto its nearest key (its behind-the-bridge notes now on 55 · 64 · 71 · 76).
**The deal re-run** (seed 17, the same containers): 366 notes · 230 changed · 53 grown · 13 folded · 10 swapped · 51 strikes. **The re-measure
of the percussion, piano and violin voices** (`--lanes` now MERGES into the existing measurement) and the map follow below.

**The re-measure (percussion · piano · violin), and the map.** The prepared piano's muted voice now reads on ITS track (−27 … −4.7 dB, 16 … 127);
the plucked piano reads nothing (the dead instance — his Kontakt step) and is left out; the brake drums' rubber block sounds (−38 … −13.3);
the rute on the rim −50 … −22; the violin's behind-the-bridge keys −35 … −19.7. **One more rule the field needed:** three voices sit far under
everyone — the china scrape (top −36.9), the spring coil (−26.8), the gran cassa's medium felt (−27.9, flat across velocity) — and the rule
"the ceiling is the quietest voice's top" sank every other voice to velocity 1. Now a SOFT VOICE (its top more than 12 dB under the mean top,
`--soft-floor`) stays in the map but does not set the ceiling: it is sent at 127 where the target is above it and reported. The field's top
is then −22.1 dB (the rute on the rim); 347 notes mapped. **What this means, and his one decision:** the SI2 voices (tops −2 … −8 dB) reach
−22 only near the bottom of their velocity range — the winds' staccati and flutters are sent at written −85 … −100, their softest samples
(SECTION_LEVEL.md "what 127 means"). The other lever is a CC7 OFFSET PER VOICE (level on the fader, timbre on the velocity; Kontakt and UVI
take CC7, Spitfire does not) — the composer's notes carry `cc7Abs` already; a `--cc7` mode of the apply would send each voice's offset and keep
the velocities near the written ones. Built at his word (NITS has the row); until then the field stands as mapped, his ear to judge.

## §147. His run of the Kontakt script; the quiet voices; two SI2 dials behind the flutters (2026-11-10)

**His words:** *"lua curv slots not working"* — then *"I ran the lua … no need to introduce a different work flow, I did it with run lua script.
was I meant to run it on the other piano tracks?"* — *"which are the quiet instrument/articulations?"*

**The script had failed on ITS FIRST LINE, mine:** this piece had no `reaper/kontakt/out/` folder for the report it writes before touching
Kontakt, and its instrument table had no entry for the Steinway. Folder made; piece 4's `.nki` paths (the Steinway, the plucked piano) added;
the plucked slot handled in the same run (any slot named "pluck" → channel 5, 0 dB). **His second run worked** (`out/curve_slots_20261110_154033`):
one slot before, FOUR after — the Steinway's copies on channels 2 · 3 · 4, same output, same volume. The alive map: ch 1 −14.8 · 2 −23.3 · 3 −23.3
· 4 −23 dB. **The copies read 8 dB under the main at EVERY velocity** (40: −31.4 / −39.7 · 80: −25.9 / −34 · 120: −8.2 / −16.4 — a pure volume
gap; the main slot carries something the .nki does not). The script now lifts the copies' slot volume by 8.2 dB (`TRIM_DB`); his re-run sets it.
**The main instance held ONLY the Steinway** — so the faint channel-2 reading of §143 was not a plucked piano; the plucked piano goes into the
empty `PianoPlucked Kontakt` instance by `reaper/kontakt/load_plucked_piano.lua` (the Spitfire .nki on H:, channel 5, 0 dB), his Run Lua
script there. Run Lua script is his workflow; the drag-and-drop line is withdrawn.

**The quiet voices, from the measurement (tops at 127):** loud −2 … −10 (the flute's staccato · tongue ram · jet whistle, the piano's muted,
the clarinet's staccato, the sax's five, the violin's bartók, the brake drums' poly beater, the piano, the glockenspiel) · middle −13 … −22
(brake drums rubber · the violin's bow pressure · gettato · behind the bridge · col legno gettato · the gran cassa's rim) · quiet −27 … −37
(the spring coil · the gran cassa's medium felt — key 52 is a ROLL, flat at every velocity · the china cymbal's scrape).

**Two dials behind the flutters.** The flute's and the clarinet's Flatterzunge read FLAT across velocity (−8.7 · −17.8 at every step). Their
parts sat at the factory **Dynamic Amount** 0.43 and 0.50 (uvi.md § 4 — the dial piece 5 found; this piece set 1.00 only on the Ordinarios and
their copies). Set to 1.00 on every part his articulations use (`tools/uvi_dynamic.js`: Flute 7 · 13, Fluteb 1 · 10, Clarinet 5 · 12, Sax 8 · 11,
Sax b 5 · 7 · 8 · 9). Re-measured: the staccati, slaps, double tonguing, jet whistle, tongue ram and the sax's flutter now span about 40 dB from
16 to 127 — **but the two flutters went FLAT at −43 and −51.** The script blocks compared attribute by attribute: Ordinario `MidiModeMenu="1"`,
the two Flatterzunge `"2"` — the EXPRESSION MODE, Velocity against Mod Wheel: in wheel mode velocity moves nothing and the wheel at 0 leaves
the part 40 dB down (the sax's Flatterzunge ships in velocity mode, hence its 36 dB span). `tools/uvi_script_attr.js` (new — any attribute of
the script block, as text): both set to 1. Still in wheel mode, not in his lists: Flute Ord & Flatterzunge KS · Play & Sing KS · Trills KS (both
instruments) · Sax Aeolian · Sax FX KS — left, named here for the day one is wanted. The flutes and clarinets re-measured and the map re-applied
below.

## §148. THE VOLUME STANDARD — his decision, and how it is built (2026-11-10)

**His words:** *"volume knob but lets have a different solution for the spitfire; and maybe in general, like maybe rute sits on its own track and we
up the level at the track … I really need the volume situation to be solved. we rehash this every time and it has taken many many hours …
please make all p and ff and mp etc be at approximately the same loudness and bring everything into a volume standard, its no good if the ctpt
section is quieter than the rest of the music. also I don't want to wrangle with the cc7 round robin not working right; this is a short section
lets get it to sound as good as possible and move on."* And on the instructions: *"please give these instructions and future instructions in
clearer and more well defined simple terms."*

**THE STANDARD, defined.** A plain played-in note sounds at its written velocity on the instrument's ORDINARY voice, and the rack's trims (the
card, PLAN 1b.3) set the ordinaries against the piece's absolute reference. So the standard for an articulation is: *velocity v on the flutter
should be as loud as velocity v on the ordinary of the same instrument.* Each lane's ordinary is measured at the same grid as its articulations
(`section_level.js --measure` now adds it); a lane with no ordinary (the percussion, the mallets lane under the glockenspiel) takes the mean of
the ordinaries. No "quietest voice sets the ceiling" any more — the standard is absolute, so the section lands where the rest of the music is.

**THE KNOBS, by plugin family** (`tools/section_gains.js`, new — one gain per articulation voice, the mean over the velocities the section
actually writes of [ordinary − voice]):
- **UVI (the winds' articulations, the prepared piano's muted):** the PART's gain, as text (`tools/uvi_part_gain.js`, new — the baseline's
  +6 dB plus or minus the voice's gap). The velocities stay what he wrote; the samples keep their character.
- **Spitfire (the percussion):** the TRACK — the fader to +12 dB, the remainder in a stock "JS: Volume Adjustment" FX (the lineage's
  apply_trims rule), capped at +20 in all; one gain per track. His word made it one voice per track where levels differ: the gran cassa's
  rute on the rim CLONED onto its own track `Bass Drum Rim ARO` (`aro_state.js clone`, `SWPerc` ch 13; the selection's beaters filter splits
  the two rows; `palette_check` learned that one instrument may sit on two channels).
- **Kontakt (the violin's articulations, the glockenspiel, the piano):** no knob per articulation — one slot holds every preset — so these
  are mapped by VELOCITY against the same ordinary (`section_level.js --apply`); the violin's articulations are all LOUDER than its senza
  (−7 … −20 dB), so velocity down costs no timbre.
- Then `--measure` again (the curves are now real), then `--apply` for the fine map. No CC7 anywhere — his word.

**The first measure with the ordinaries** (26 voices + 5 ordinaries): the flute's ord −2.3 at 127, the crotales −11, the piano −9.9, the
violin's senza −25.7 — the ORDINARIES THEMSELVES stand 23 dB apart on a PEAK meter (the card equalised K-weighted loudness, and a bowed
string's peak sits far under its loudness where a staccato's does not); within an instrument the comparison holds, across instruments the
mean target is approximate — his ear's call after. The clarinet's ord read −55 at 127: three grid notes had DROPPED (the player stalled); the
direct probe gives −5.3. The mean over pitches now leaves a dropped reading out (a reading of nothing while another pitch sounded). The
Spitfire gains asked: china scrape +30 (capped at +20), spring coil +20, the gran cassa's felt roll and rim +13.5, brake drums +1 · +5.6.

**The plucked piano and the piano's copies** are his two Run Lua script runs (his workflow, kept); the rack is left alone while he runs them.

## §149. The volume pass, first run — three faults of mine, fixed before the second (2026-11-10)

**The pass as run:** the clarinet's ordinary re-measured (−9.3 at 127, the dropped grid healed) · the brake drums' rubber mallets split onto
their own track (`Brake Drums Rubber Mallets ARO`, ch 14 — `section_gains.js --split`, his rule applied by the tool) · the gains written ·
everything measured again · the map applied. **The articulations' curves came back UNCHANGED** — the UVI part gains had done nothing.
1. **The Part's Gain is CC7's target.** The baseline's +6 dB is "the value CC7 = 127 leaves a part at" (uvi_edit.js said so), and the
   composer sends CC7 127 before every plain note — so a Part-gain edit is undone at the first note. The knob is the PROGRAM's Gain inside the
   part (factory 0 dB everywhere, untouched by CC7): `uvi_part_gain.js` sets that now (`--part` keeps the old attribute for a reset; the
   eleven parts put back to +6).
2. **The percussion lane's "ordinary" is a placeholder.** Its recipe says `ordinary: "main"` — channel 1, whatever track sits there (the bongos).
   The measure took it for a real ordinary and the percussion's standard became the bongos' curve (with fourteen dropped notes in it); the
   trims then chased that. A placeholder (its label says so) is no ordinary: the percussion takes the mean of the real ones, in both tools.
3. **The trims were absolute where the measurement was relative.** The second gap was read with the first trims in the path, and the tool set
   the fader to the gap — undoing its own work. The new level is the present fader + FX + the gap; the tool reads the present through the
   bridge first.
**And the Kontakt knob, built:** a Kontakt voice LOUDER than its ordinary (the violin's articulations, −7 … −20 dB against the senza) no longer
has its velocity crushed to single digits: the composer's plain note may carry `cc7Plain` — CC7 sent just before the note, in place of the
127 it always sent (`composer.html`, pre-arm and `heldCc7`); `section_level.js --apply` writes it from the instrument's measured CC7 law
(`bank/velocity_remap.json`, the card's) and leaves the velocity as written. A voice QUIETER than the target still climbs the velocity — CC7
cannot add. **His page needs a reload (F5) for the new field.** The second pass runs on these.

## §150. The volume pass, second run — the section on the piece's standard (2026-11-10)

**The winds, on the knob:** the program gains written (sax double tonguing +3.3 · flutter +2 · the three slaps +2.4 … +2.8 · staccato +2.4; clarinet
flutter −1.8 · staccato −3.5; flute flutter −0.2 · staccato +0.1 · jet whistle +2.6 · tongue ram +2); measured again, the map sends every
wind articulation within about ±2 of its WRITTEN velocity (the jet whistle +5, the tongue ram −6, the pitched slap +5 — the shapes of their
curves against the ordinary's). **The strings, on CC7:** the violin's five articulations keep their written velocity and carry CC7 60 … 104
(bartók 60 · bow pressure 82 · gettato 82 · col legno gettato 95 · behind the bridge 104). The prepared piano's muted: CC7 116 — it answers
CC7 as a UVI part does, so its small gap went that way. **The quiet ones, on velocity:** the glockenspiel +11 · the plucked piano +15 (18 of 19
notes at its 127 — its slot sits 4 dB under the Steinway; his Kontakt run of `load_plucked_piano.lua` could carry +4 dB, next time).

**The percussion, on the track — and where the meter stops being a judge.** China cymbal and spring coil at the cap (fader +12 · FX +8); the gran
cassa's felt roll fader +12 · FX +3.9, its rim +12 · FX +6.5 on its own track; the brake drums −5.4 and their rubber mallets +3.6 on theirs.
The re-measure reads them still 12 … 24 under the ordinaries' mean at 127 — but the readings of a one-shot's PEAK move 2 … 6 dB between passes
with nothing changed, and a scrape or a coil sits higher in loudness than its peak says. So the meter has done what it can for the one-shots:
they are up by 15 … 20 dB and on their own faders; the card's own rule says a one-shot's velocity is its dynamic and its balance is a trim. His
ear sets the last few dB, on the fader, per track — no tool between him and it.

**The state:** 285 notes mapped on `piece-Section02-C-artics-01` (the ordinaries sent as written); the rack's new levels and parts UNSAVED until
his CTRL+S; his page needs F5 for `cc7Plain`. PLAN 1e ☑ as a method; his ear next.

## §151. The scattered deal and the dealt dynamics — `piece-Section02-D-scatter-01` (2026-11-10)

**His words:** *"make a new save file, and then drawing from that list of articulations for each instrument, you just do a scattered distribution of
various ones, and then pitched, if possible, at the designated pitch, the ones I have now, or you might have to change the pitch to get some of the
other techniques. And then can you do distribution of dynamics? Just going to use P, MF, and FFF. Just those three … a random distribution across
each part."*

**Built:** `artic_deal.js --scatter` — no runs: every note dealt on its own from the lane's shuffled, exhaustive deck (never the same twice in a row);
the pitch kept where the articulation's range holds it, folded by octaves where not, swapped where no fold fits (as before). `tools/dyn_deal.js`
(new) — per lane a shuffled, exhaustive deck of the named dynamics; each note's WRITTEN velocity becomes the score's own anchor (p 83 · mf 100 ·
fff 127, dyn_ui.js's ladder), the struck velocity kept under `properties.dyn.was`; `--undo`. Then the level map (`section_level.js --apply`, the
measurement of the C save copied to the new name — the same rack) puts the three dynamics on the standard: every p one loudness, every fff one
loudness, across the parts, each against its instrument's ordinary.

**The deal (seed 23, from the harmonies save):** 366 notes · 274 changed · 48 grown · 13 folded · 5 swapped · 53 glockenspiel notes to the
percussion lane. Per lane: flute staccato 12 · flz 10 · tongue ram 11 · jet whistle 11; clarinet staccato 22 · flz 20; sax slap pitched 11 ·
exploding 11 · staccato 10 · double tonguing 14 · flz 8; piano main 39 · muted 39 · plucked 39; violin col legno gettato 9 · bartók 9 · gettato 9 ·
behind the bridge 10 · bow pressure 10; the mallets lane: glock 9, the six strikes 8 … 9 each. **The dynamics:** p · mf · fff a third each on every
lane (the piano 39 · 39 · 39). **The map:** the winds within ±3 of written (the slaps ±10 — their curves bend against the ordinary's), the violin
and the muted piano on CC7 (60 … 109), the glockenspiel and the plucked up by velocity, the percussion at its 127 where the standard asks more
(the faders are its knob, §150). One fix in the deal on the way: a note an earlier deal had MOVED belongs to its original lane when re-dealt.

## §152. PARITY BY LOUDNESS, for this save — the section's own card, and the knobs set from it (2026-11-10)

**His words:** *"the message to change to plucked piano goes in too early because the end of that solo is plucked … the flute is so much quieter
than everything. The percussion is way too loud … just do an analysis of each of the notes that we have now in this save file … whichever notes
are P, they should all sound P together … I want the FF bass drum notes to come out at the same LUFS as the flutter tongue flute … a solution
just for what's there now, instead of some universal solution."*

**The window was wrong, mine:** the deal ran from 195 s; the counterpoint starts at **200.19** (the first note not the piano's) and the piano solo's
tail (195.04 … 196.23, a hundred notes) had been dealt plucked and muted. Re-dealt from 200 (seed 23, scattered; the dynamics p · mf · fff dealt
per lane): 296 notes, 54 of the glockenspiel's to the percussion lane; the solo untouched.

**THE SECTION'S OWN CARD — the lineage's loudness measure, not the peak meter:** `tools/section_card.js` writes the card recorder's timetable for
every voice the save plays (31 voices with the lanes' ordinaries, each at its own three pitches at the written p 83 · mf 100 · fff 127); the REC
track rebuilt for the new tracks, REC the only writer, `probes/card_run.ps1` recorded 465 s (`reaper/Media/32-REC-261110_1826.wav`), `probes/
analyze_card.py` read every note (252/252), K-weighted, the loudest 400 ms taken for all (every note of the section is short). **What it read —
his ear was right and the peak meter wrong:** at fff the flute's staccato −39 · tongue ram −43 · jet whistle −40 against its ordinary −30 and
flutter −32; the percussion rim −19 · the gran cassa's felt roll −27 · the brake drums' rubber −26 · the muted piano −22 · the plucked −26; the
violin's behind-the-bridge −47.5 · col legno gettato −42. A scrape or a drum peaks low and sounds loud; a flute staccato the reverse.

**`tools/section_parity.js` — one loudness per written dynamic, for every note:** the target per dynamic = the mean of the voices (p −40.2 · mf −37 ·
fff −33 dB); then, per voice, the knob that reaches it: a UVI voice's PROGRAM gain moved by its mean gap (`uvi_part_gain.js --add`: the flute's
tongue ram +11.1 · staccato +4.6 · jet whistle +6.1 · the sax's staccato +5.6 · slaps +4.2 · +4.8 · its flutter −4.3 · double tonguing −3.2 · the
clarinet's staccato +3.9 · flutter −1.8 · the flute's flutter −3.1 · the muted piano −11.8), then the velocity on the shifted curve; a Spitfire
track's level from its notes' mean gap (the rim −10.4 · the gran cassa −8.4 · the rubber −7.4 · the spring coil −3.4 · the brake drums +7.2 · the
china +2.4 — relative to the present, the fader then the JS FX); a Kontakt voice louder than the target by CC7 per note (the bartók, gettato, bow
pressure, the plucked and the Steinway where loud), softer by velocity — and the violin's track **+6 dB** (`--kontakt-trim`, the one global move:
the senza elsewhere in the piece is 6 dB hotter than the card set it; his to hear). Every note keeps its written dynamic; what is sent changed.
**Still short at 127 after all that:** the violin's behind-the-bridge (−47.5 — a quiet sound by nature), the gran cassa's felt roll (flat across
velocity), a few flute staccati and jet whistles at fff, three glockenspiel notes. The rack saved through the bridge.

## §153. Two piano asks on his draft — the G#s thinned from the harmony, the two-hand mutes next to a pluck made plain (2026-11-10)

**His words:** *"In the piano there is a lot of G-sharp of various octaves. Can you swap some of those out? Look up the harmony it's meant to be
in — not just the lane, the full strike it comes from — and replace it with another note from that harmony. And there are some very close
muted notes with plucked; the mute is a two-hand thing. Where there's successive close ones — only the very close ones — make the mute a
standard note. Use piece-Section02-B-ctpt-draft01b."*

**The G#s:** 17 of the piano's 47 notes were G# (G#2 · G#3) — the harmony roll had folded each take's piano voice to the nearest pitch, and five
takes (02 · 12 · 13 · 14 · 15) put the piano on G#. Every SECOND G# in time order (eight) takes another pitch of ITS take's full voice set (all
lanes, `bank/panel_snapshots.json`), the nearest to the original that is not a G#; the odd ones stay. The old pitch under `properties.gsSwap`.
**The mutes:** four muted notes sat within 0.4 s of a plucked one (0.14 · 0.20 · 0.36 · 0.39 s) — made `main`; their parity recomputed on the
Steinway's card curve (CC7 where it is louder than the note's target, velocity where softer). A copy of the save as it was is in the session's
scratchpad. His step: File ▾ → Open the save again.

## §154. The clarinet's F6 thinned the same way; the piano fixes carried onto his draft01c (2026-11-10)

**His words:** *"around 212.2 in the clarinet, and it could be other instruments as well, but I think it's mostly clarinet, there's a lot of F6. Can
you do the same thing — keep the same articulation, a different pitch from that pitch set. Then it is piece-Section02-B-ctpt-draft01c."*

His 01c had been saved from the page before §153's edits reached 01b, so both piano fixes were applied to 01c again (the four mutes next to a
pluck → plain; the G#s thinned, the same eight). **The tool, now general: `tools/thin_pitch.js`** — a pitch (or a pitch class at every octave)
that recurs on a lane, every Nth occurrence swapped for the nearest other pitch of ITS take's full voice set, inside the technique's range;
articulation, dynamic and level untouched; `--undo`. **The clarinet's F6:** 11 of its 42 notes (the harmony roll folding takes 02 · 09 · 16 onto
F6); every second one swapped — 206.69 → B5 · 213.31 → E6 · 215.86 → E6 · 226.15 → B5 · 241.29 → B5; six F6 stay. Seen and not touched: the
flute's F5 recurs just as often (11 of 44) — the same folding; offered. A copy of 01c as it was is in the session's scratchpad.

## §155. The flute's F5 thinned, on his draft01d (2026-11-10)

**His words:** *"yes pls do for flute — piece-Section02-B-ctpt-draft01d."* 01d carries the earlier edits (13 thinned, 4 mutes made plain). The
flute's F5: 11 of 44, every second one swapped from its take — 201.61 → F#5 (tongue ram) · 210.44 → E5 (tongue ram) · 228.66 → E5 (staccato) ·
234.07 → F#5 (jet whistle) · 246.74 → D#5 (tongue ram); six F5 stay. A copy of 01d as it was in the session's scratchpad.

## §156. SW-36 — the form: petals passages alternating with the granular, the granular a trio (2026-11-10)

His composition note, verbatim in `COMPOSITION_NOTES.md` SW-36: the petals with all the sustaining instruments; the granular as electronics ·
percussion · piano (palm strikes on the strings, pedal down · bass drum rolls · maybe tambourines or crotale clusters — "I have to give it some
thought"). Nothing built; the note is the form's first statement. A palm-strike piano voice does not exist in the rack: when he reaches it, a
sample or a prepared-piano preset (PP2 has none named so; the catalog's percussion has no piano) — a conversation then.

## §157. SW-37 — four petals segments that ring out (2026-11-10)

**His words:** *"in the save file on Elec 1, starting at 269 seconds, there are 4 segments cut from one of the petals … just your standard,
I think it was 30 milliseconds, fade in. But where they end, is there any way you can let them ring? … stop play on the underlying sound file
bed, but you'd let the harmonic filters ring until they're done."* (SW-37; the save `piece-Section03-a-petalsGrain`.)

**Where the segments come from** (the save's four material bricks on Elec 1, all of `petals-A4-r3-t077.2-x625-4pass-from0`; a brick's offset
is the file's time, and the file's time is the bed's — the long render started the bed at 0):

| brick | in the score | in the file / the bed |
|---|---|---|
| zn-3100 | 269.0 … 300.6 s | 0 … 31.6 s |
| zn-3107 | 307.1 … 362.3 | 293.7 … 348.9 |
| zn-3108 | 364.5 … 417.7 | 388.5 … 441.7 |
| zn-3110 | 419.7 … 451.7 | 441.7 … 473.7 |

**How they were made again** (`live-electronics-engine/corpus/petals_segment.py`, round `petals_bed.scd`): the same bank (A4: fund 200 ·
first 2 · spread 0.5 · bank B +0.25 st · ring 7.75 … 9.5 s) on the same bed, from 20 s BEFORE the segment so the 26 resonators hold the bed's
energy at the cut as they did in the long render (a cold start would spend the first ring time building up — segment 1 starts cold, as the
long file did); the pre-roll cut off; the bed STOPS at the segment's end and the ring is left 1.5 × ringHi = 14.25 s (−90 dB), its last second
faded; 30 ms fade in. Then the long render's road: −1 dBFS peak → `master_mix.py` → and the level MATCHED by RMS to the long master over the
same stretch, so each sits where he heard it (the match: −6.5 · −0.1 · −0.6 · −11.5 dB — the first and the last stretches are quiet in the
long file; the middle two were already at the master's level). `petals_bed.scd` took two optional arguments for it — a seed (the rings · wobble
rates · shuffle drawn once; the four share seed 7 — the long render's own draw was never seeded, so the pitches are the same and the shimmer
differs) and the tail's length.

**The result:** four materials in the fund (`keep/petals/petals-A4-r3-t077.2-x625-4pass-seg1-ring-master.wav` … `seg4`; 45.9 · 69.4 · 67.5 ·
46.3 s — each the segment plus its ring), their notes in the folder's `recipe.json`, the index re-run (61 materials; `bank/materials.json`,
the peaks). In the drawer as `petals-A4-r3-t077_2-x625-4pass-seg1-ring` … `seg4-ring`. His to drag over the four bricks; the engine
restarted once for the new rows. Nothing in his save touched.

## §158. The violin's +6 dB stays — the fader is the piece's floor, parity brings the rest down (2026-11-10)

**His words:** *"what we should do for the violin is have a separate violin track for just this section … However, again, I don't want to get
lost in this volume morass. It's just become a unending rabbit hole. But how confident are we that the original violin setting is good for
the other sections? … why is it need to be +6 here? Or does it actually need to be +6 everywhere else? … why don't you go ahead and make
this separate track … we'll just leave it at +6 for this section, use the separate track, but then reevaluate later for the violin for the
rest of the piece."* — then, on the analysis: *"ok leave it at +2.7, no separate track."*

**The analysis put to him.** The +6 (§152, `--kontakt-trim "Violin XS:6"`) was for the violin's quiet extended articulations in Section 2
(gettato · col legno · bow pressure · behind the bridge), 6 dB under the other parts at the same written dynamic; a Kontakt voice is lowered per
note by CC7 but cannot be lifted past its ceiling, so the only lift was the track's fader: calibrated −3.30 dB (`apply_trims.lua`), now +2.70.
The ordinary violin (senza · spiccato) was calibrated at the start at −3.30, so with the fader at +2.70 it plays 6 dB hot wherever a section is
NOT leveled — but the leveling pass (the section card → parity) lowers any voice above target per note, so with every section through that
pass the fader can stay: it is the floor for the quietest voice, everything louder comes down per note. The one stretch known hot now: Section
1's violin long tones (34.9 … 137 s, shaped notes whose CC7 table came from the old calibration), his to hear when he passes it.
**Why no separate track:** the Reaper half is easy (a clone at +2.70, a `b` port); the score half is the morass he named — every save holds the
whole piece (0 … 610 s), and the violin's route is resolved per instrument in about a dozen tools (sonify_core · morph_emit · the cresc,
strike, swell, texture, sequence and trill tools …), so one section's violin on another track needs a time-based redirect across all of them.

**DECIDED (his word):** the Violin XS fader stays at +2.70 dB for the piece; no separate track; each section leveled by parity as Section 2
was; Section 1's violin re-heard later. Nothing built.

## §159. HIS STANDING RULE — the volume is the AI's; no volume task or decision reaches him unless crucial or he hears something off (2026-11-10)

**His words:** *"let's just, if I can be protected a little bit from these little volume tasks. Like I said, we've been working on this for
months and months now. So let's, unless it's crucial or unless I say something is off, let's just put aside all these volume things. The
original mandate was AI was meant to sort it. I didn't want to be bothered with it anymore, and I didn't have time or didn't want to invest
any more time in it because it's just not working out correctly. We were able to get that passage working, but let's not carry on any of
these decisions unless they're absolutely necessary."*

**The rule, from now on:** the sound path's levels are the AI's to sort and to settle, by the law and the tools in hand (DYNAMICS_LAW ·
SECTION_LEVEL · the card and parity), without a question to him. A level item that is real but not blocking goes to `docs/NITS.md`, not
to the chat. He hears the music; a fault reaches the AI only when HE says something is off, and then it is fixed, not discussed. The violin
re-hear of §158 is withdrawn from his list (it was the AI's note). What counts as crucial: a passage that cannot sound at all, or a level
that would wreck a take he is about to keep — and then one line, the fix proposed, his one-word answer.

## §160. The second ringing petal — C3 on Elec 1, 269 … 454.9 s (2026-11-10)

**His words:** *"piece-Section03-a-petalsGrain-02 Can you do the ringing with the pedals that is an electric one and ends around 454.86? Just the
same thing. Let the resonators ring. You can cut the sound file, stop the sound file playing at that point, but let the resonators ring."*

The brick (zn-3126): `petals-C3-r2-t110_0-x625-4pass-from0`, the file's 0 … 185.9 s, placed at 269 … 454.9. Made again by §157's road
(`petals_segment.py`): C3's bank (fund 35 · first 5 · spread 1.33 · bank B +3 st · ring 7 … 15 s) on the bed `r2-t110.0-x625-4pass` from 0 (cold,
as the long render), the bed stopped at 185.889 s, the ring left 22.5 s (1.5 × 15), 30 ms in, mastered, matched to the long master over the
stretch (−0.3 dB). **The result:** `keep/petals/petals-C3-r2-t110.0-x625-4pass-seg1-ring-master.wav`, 208.4 s; indexed (62 materials); in the
drawer as `petals-C3-r2-t110_0-x625-4pass-seg1-ring`. His to drag over the brick at 269; the engine restarted once. His save untouched.

## §161. SW-38 — the cello hills from the petal's envelope; the two-string pairs workshop (2026-11-10)

**His words:** SW-38 (`COMPOSITION_NOTES.md`), the save `piece-Section03-w_cello`.

**The hills (`tools/cello_hills.js`):** the brick under the window is the ringing C3 petal (zn-3129, 269 … 477.4 s); its file read over
275 … 465 s — a 1 s RMS envelope, smoothed over 9 s; the local peaks and valleys at least 6 s apart are the nodes (19 of them, 275 … 464 s:
the rise from −31.8 dB to the plateau of hills at −18 … −26 dB, then the ring's fall). Written by the DYNAMICS LAW as a SHAPED note (Rules
1 · 2): struck at mf for its pitch (`velAbs` 86 / 89), the fader between the two written dynamics **p … f** (`cc7Abs` 59 … 94 on the cello's
measured curve), every node on its own table value, the segments bezier, the nodes smooth 0.25. The envelope's quietest point before the end
is written p, its loudest f; the tail lands on p (a first pass squeezed every valley up to mf because the ring's dying tail set the bottom —
corrected, the inner nodes set it). TWO shaped notes with the same shape, the open D and A strings (50 · 57) on the tremolo voice
`trem_vel` — provisional pitches, the two strings of the tremolo, his to change after the workshop. In `scores/piece-Section03-w_cello-hills-01`
(a new save beside his, his untouched), a marker HILLS at 275. Piece 2's hills: its human journal names them (waves of the percussion with
instruments joining, two hills in quick alternation); its saves hold no multi-node curves to read — not duplicated, as he said.

**The workshop (`tools/cello_pairs_workshop.js`):** the four strings C2 · G2 · D3 · A3, three adjacent pairs; a double stop = the lower string
stopped p semitones up, the upper q (0 = open), the interval 7 + q − p. The hand shapes: the open fifth · the unison (the lower string a fifth
up, the upper open) · the seconds and thirds (the lower stopped 3 … 6 up, the upper open) · the fourth · the sixths and the seventh (one to
three fingers apart across the strings) · the octave (the big stretch, the upper stopped 5 up over the open lower). Each shape also shifted up
a fourth and a fifth where it still reads as a hand. Not exhaustive: 8 per pair drawn at random (seed 3), the open fifth, the unison, the
tight 2nd and the octave always in — 24 samples, shuffled, 4 s each, 1.5 s between, both notes STRUCK at mf (the ladder velocity per pitch)
on `trem_vel`, a marker naming each (`01 C–G · minor 2nd · F#2+G2`). In `scores/piece-Section03-w_cello-pairs-01` (the cello alone, from
1 s, 133 s long); the sheet `docs/workshops/piece-Section03-w_cello-pairs-01.md`. `--seed` re-draws; `--per` sets how many a pair.

## §162. SW-39 — the hills as a graphic score in the composer score, four lanes tall; the catalog of eighteen shapes (2026-11-10)

**His words:** SW-39 (`COMPOSITION_NOTES.md`).

**The mechanism — no app change:** a `waveCurve` with NO pitch is silent (`sonify_core.js` line 207 skips it). So a tall shape is drawn as
FOUR silent curves, one per lane, each lane showing its own horizontal band of the height (the bottom lane 0 … ¼, the next ¼ … ½ …), filled
to the lane's floor; stacked, they read as one silhouette four lanes high. The shape is sampled every 0.5 s so the bands clip it exactly
(straight segments between the samples). The four lanes: percussion · vibraphone · piano · violin (3 … 6), the ones directly above the cello,
so the mountain stands over the lane he records into; the cello keeps its SOUNDING shaped notes (§161's, the law's Rules 1 · 2) beneath.
`tools/hills_graphic.js`. The petal hills are redrawn tall from the shaped notes' recorded nodes (a cosine ease between them).

**The catalog, from 480 s, 4 s between (each a marker, a tall picture, a sounding pair D3 + A3 on `trem_vel`):** short hill 6 s p … mp · the
same tall p … f · medium 15 s p … mf · medium tall pp … ff · long 30 s p … mf · long tallest ppp … fff · sawtooth short 10 s and long 25 s
(a slow climb, straight down) · reverse sawtooth short and long (straight up, a slow fall) · square short 12 s (up 2, plateau 8, down 2) and
long 28 s (4 · 20 · 4) · plateau rounded 40 s pp … f · slow up quick down 18 s · quick up slow down 18 s · double hill 20 s · hill with a
shoulder 24 s · stair up, straight down 16 s. Eighteen shapes, 480 … 896 s. The sheet `docs/workshops/piece-Section03-w_cello-hills-graphic-01.md`.

**Proven once on the throwaway (5601, the recipe's stubs):** the save opens (1632 objects), the silhouette stands four lanes tall over 275 …
465 s with the cello's pink swells under it and the petal brick on Elec 1 — the screenshot sent to him. In `scores/piece-Section03-w_cello-hills-graphic-01`
(from the hills save; his `w_cello` untouched). He opens it with File ▾ → Open; the curves on the four lanes are silent and his to delete or move.

## §163. SW-41 — the petals analyzed; a sequence of just fundamentals proposed over the C3 petal (2026-11-11)

**His words:** SW-41. **The page:** `docs/proposals/SECTION3_JI_FUNDAMENTALS.md`.

**What is in the score:** every current Section 3 save carries ONE petal on Elec 1 — C3 (269 … 477 s); the four A4 cuts of the earlier
`petalsGrain` are gone from the saves (analyzed too). **Measured (an averaged 65536-point spectrum of each clip, the peaks above −40 dB):**
C3's strongest partials 472 (0 dB) · 316 (−5) · 211 (−7) · 632 (−9) · 328 · 658 · 442 · 422 · 367 Hz — ONE series: 4 · 6 · 9 · 12 × 52.6 Hz =
G♯1 (+23 c), with 7 and 8 weaker. The design's 35 Hz × (5 + 1.33 n) lands on that series by its spacing (46.5 Hz); the bed chose which sing.
A4: a plain G2 (99 Hz) series, partials 4 … 9, with its quarter-tone shadow. The two roots a semitone apart — neighbors in Recombination's
semi-cluster. **The method read from piece 5 (LG-18 … LG-28):** a semi-cluster of roots F♯1 G♯1 A1 B♭1 B1 C2, a path through them (middle,
outward, the bottom last), chords of the colored partials 5 · 7 · 10 · 11 · 14, the bass on the root, tempered doublings beating at the
deviation. **The containers:** the petal's own hills (§161's nodes) — seven: 275 · 325 · 355 · 371 · 414 · 430 · 457 … 477.
**Each root's partials laid against the petal's peaks (a hit within 30 c):** G♯1 hits 4 6 7 8 9 12 (home) · B♭1 8 (= the petal's peak) 11 ·
C2 5 10 · F♯1 7 9 14 · A1 6 7 8 12 but a semitone off everywhere (friction) · G1 9 13 (almost nothing) · B1 only weak ones (left out).
**Proposal A (recommended):** G♯1 · C2 · F♯1 · B♭1 · A1 · G♯1 · G1 — home, outward, the friction chord before the return, home with the
full series on the loudest hills, a semitone under as the ring dies. **Proposal B:** the drift G♯1 · A1 · B♭1 · B1 · C2 · G♯1 · G1.
Winds and strings just (the samplers bend per note), piano and vibraphone tempered doublings. His one decision: A, B, or another path.

## §164. Proposal A taken: the roots at hand in the strikes drawer; the empty containers in the sequence library; the chart (2026-11-11)

**His words:** *"Ok for proposal A … in the strikes drawer, there's the just intonation harmony section. Can you make sure all of those roots
are available there? … it puts the root and then the full just intonation harmonic series above it. And then I can orchestrate from that.
And then secondly, can you create in the sequences drawer … a sequence … just put in the time containers from those petals fragments as you
propose in A? Don't fill them yet … give me a chart or something about what roots to use in each block. … I'm going to try a couple
different orchestrations of the roots, and then I'll insert them in to those containers."*

**The roots.** The HARMONIC SERIES banner (spectrum_ui.js, piece 5's 1c.4) takes ANY fundamental typed into its box — so every root was
already reachable; what was missing was having them at hand. Built: a chip per root beside the box, read from the piece's
`bank/ji_roots.json` (F♯1 · G1 · G♯1 · A1 · A♯1 · C2, each with its why in the hover), a click types it (`setSpecFund`); the current one
lit. The file is the piece's (THE SORTING: it knows this piece's roots); the chip code is the drawer's, six lines, no chips when the file
is absent. A root is spelled as the box accepts it (A#1, not B♭1).

**The sequence.** `S3 petal roots A` written into `bank/sequences.json` under the library panel (the drawer's own row shape: seven boxes
`take ''` · `chord []` — RESTS until he drops a take in each — `dur` 50 · 30 · 16 · 43 · 16 · 27 · 20 s, change `attack`; the breath, waves,
edges and roll dials take the drawer's defaults when it loads the row). 202 s, to be inserted at 275. The comment carries the roots per box.
**The chart:** the proposal page § 9. Nothing in his saves touched. **His server must be RESTARTED or the page reloaded** for the chips
(spectrum_ui.js is a page file — a reload is enough; the library is read from disk when the sequence drawer opens).

## §165. SW-42 BUILT — THE PHASE MACHINE: a take re-articulated as pulse streams, driven out of phase and back by a plan (2026-11-11)

**His words:** SW-42 and its continuation (`COMPOSITION_NOTES.md`): *"plan this out, scope it, and then build it yourself … minimal GUI."*

**Lineage read first:** piece 5's `multitempo_panel.js` (several tempi by small-integer RATIOS against one bpm, a repeating cycle — audition
only, writes nothing) and `pulse_seq_panel.js` (its measured lookahead scheduler); the strikes drawer's `notesFor('orch')` (a take's notes
per lane with technique · velocity anchor · cents · the articulation's own length) and its `playNotes` (the routes, the remapped velocity
and CC7, the CC0 and the bend); the sequence drawer's `insert` (notes into the score as one group, the recipe into `databases`).
Drift — tempi that never realign — was exactly what the multitempo rig put OUT of scope ("drift belongs to the phase machinery"). Built here.

**The engine (`score/public/phase_engine.js`, pure, node-loadable; `tools/phase_check.js` eight checks, all green):** N streams, each a
tempo T and a phase P (beats elapsed); an attack when P crosses an integer. A PLAN of segments: `hold D` · `shift D → target` · `cut →
target`. A shift's tempo profile is a straight ramp T0 → T1 plus a parabolic bulge k·u(1−u); when the target names PHASES, k is solved in
closed form so the beats travelled land on the asked fraction — the nearest count whose bulge keeps the mid-tempo within ½ … 1½ of the
ramp's mean (a glide, not a lurch); none reachable → a warning, k = 0. The attacks of a segment are the integer crossings of the analytic
P(u), found by bisection. STRATEGIES → a state {tempi, offsets}: unison (aligned, or lags kept) · phase fan · random · pairs · canon · tempi
neighbors (his "everyone accelerates at a pace slightly greater than its neighbor") · ratios (the rig's repeating sets) · spread · random ·
cycle (tempi snapped to multiples of 60/C so the pattern repeats every C s — his "12-second cycle") · a favorite by name. `stateAt(t)` gives
the tempi, phases and lags at any moment (CAPTURE); `lockAt(t)` cuts the plan at t — a shift to the state reached, a cut to the reference
tempo keeping the lags, a hold for the segment's remaining time, the later segments unchanged (his LOCK).

**The panel (`score/public/phase_panel.js`, the PHASE button beside MT):** take · bpm · note length (the articulation's own, or a fraction of
the beat) · the streams as chips (a take's placed lanes; a click mutes one) · the plan as lines (kind · seconds · target with AMOUNT and a
seed re-rolled by ⟳ · a take for the line) with the resolved tempi and lags shown live on each line · favorites (capture phase · capture
tempi · click to hear one held 12 s) · save/load plan · Play · Stop · LOCK · Insert at playhead. Playing: every attack scheduled on one
absolute base through the drawer's routes exactly as Hear sends them; LOCK cancels the pending timers and re-schedules the locked plan from
that moment; the status line reads the tempi and lags four times a second. INSERT: plain struck notes (`recVel` the take's anchor, a bend
for a just note) in `grp-phase-<id>`, a marker per line naming its kind and tempi, the plan into `databases.phase`. The library: a SIXTH
snapshot store, `bank/phase_states.json` (`score/snapshots.js`; favorites and plans; his server restarted once).

**Proven once on the throwaway (5601):** the store answers; the take `SW-ctpt-01` gives 7 streams (flute F♯6 · clarinet D3 · sax G4 ·
perc E4 · piano G2 · violin D♯6 · cello E3); an eight-line plan (hold · neighbors 2 % · hold · phase fan · hold · cut 3:4:5 · hold · unison)
resolves to 842 attacks over 112 s with the fan's lags 0 · 1/7 · 2/7 … exact and the converge landing every stream on the beat; Insert at
500 s wrote 842 notes on the seven lanes with the markers and the database entry. The sound itself is his Chrome's (no Web MIDI in the pane).

**Decided by the AI, his to reverse:** LOCK means "every stream back to the bpm, the lags as they stand" (a phase pattern, not a tempi
pattern — he said *"they won't accelerate or decelerate anymore"*); a line's harmony is its take's; the cut's marker names the hold after
it; the plan is the truth on Insert (an insert replaces its own group). `docs/PHASE_TOOL.md` is the page.

## §166. `piece-Section03-C-Harmonies`: four petals ringing out; the roots read TOGETHER over the layers (2026-11-11)

**His words:** *"There is a new assortment of petals there in Elec 1, 3, and 4. Some of them are layered on top of each other. So at the end,
there's 4 petals parts together. It ends at 531 about. It starts at 269. First, the ending ones: can you snip all four of those so the
resonators continue to resonate at the end, like you've done before. And then can you reanalyze the harmony throughout, not individually,
but together, and see if there's a changing of roots. It's longer now. And come up with the root map and the timings for those root changes
for the just intonation. You don't have to build the sequence yet."*

**The four rings (§157's road, `petals_segment.py`, seed 7, each matched to its long master):** C3 on r2-t110 0 … 262.5 s (+0.9 dB, 285 s with
its 22.5 s ring) · B on r1-t190 0 … 219.2 s (+0.2 dB, 242 s) · A on r1-t190 0 … 167.6 s (−3.5 dB, 182 s) · D4 on r3-t077 0 … 90.9 s (−4.9 dB,
94 s — its ring is 1 … 2 s, so 3 s of tail). In the drawer: `petals-C3-…-seg2-ring` · `petals-B-…-seg1-ring` · `petals-A-…-seg1-ring` ·
`petals-D4-…-seg1-ring` (66 materials). His to drag over the four bricks (C3 at 269 on Elec 1 · B at 312.2 on Elec 3 · A at 363.9 on Elec 4 ·
D4 at 440.6 on Elec 1); the engine restarted once. **Note:** his bricks carry long fade-ins (1.2 · 2.7 · 2.45 · 2.0 s); those are the brick's
own and stay.

**The reading together** (`docs/proposals/SECTION3_JI_FUNDAMENTALS.md` § 10): the four files summed at their offsets; a root scored per layer
state and per 20 s block by the peak energy within ±22 c of its partials 1 … 16, lower partials weighted 1/n, a tie within 10 % to the
simpler root (a first scoring with 1/√n let C1 and D♯1 "win" by claiming G♯1's notes as their partials 8 … 20 — corrected). **The caveat:**
every partial wobbles ± ½ semitone by design and B · D4 are inharmonic combs, so the margins are small and a root is a central tendency.
**The result:** C3 alone 269 … 312 is two strands (G♯3 + A♯4 against E4 + E5: A2 0.55 · D♯2 0.49 · G♯1 0.45); B's comb at 312 puts A♯3 on top
— A♯2 0.81 against 0.54, the one clear change; with A (364 …) A♯ still leads (0.46 vs G♯1 0.37), G♯ coming forward 389 … 409 and D♯ (the fifth)
409 … 440; with D4 (440 … 531) G♯ wins every block (G♯2 0.44 … 0.73), clearest at 489 … 509. **The map:** G♯1 (269) → B♭1 (312) → G♯1 (389) →
E♭2 (409) → G♯1 (440, to the end; the rings die ≈ 554). Container timings 269 · 312 · 364 · 389 · 409 · 440 · 489 · 531. Proposal A's F♯1 · C2 ·
A1 are not supported by the layered sound; its B♭1 is. The chips gained `D#2` and `A2`. Nothing built; his word on the map.

## §167. The prominent pitch at 275 s in `piece-Section03-F-MultiTempo01` — D5, confirmed by measurement (2026-11-12)

**His ask (after the clear):** *"around 275 seconds at my latest save file in the composer. I just want to confirm there's a prominent pitch.
I'm hearing that as D5 … It comes in and then it holds."*

**What sounds there:** two granular beds only, no instrument notes 262 … 300 s — `granular-G5-expodec-seed1` on Elec 1 (from 269.05, file
offset 36.97 s) and `granular-G9-expodec+perc-seed1` on Elec 3 (from 269.15, offset 44.82 s). **How read:** both files sliced at their score
offsets, summed, averaged spectra (16384-point Hann, half overlap) over 270 … 300 s and per 2 s block. **The result:** the strong peak in the
500 … 700 Hz band is **592 Hz = D5 +14 cents** (D5 = 587.3), present from 274 s, rising to its top 278 … 283 s (−3.5 dB under the loudest peak
of the whole spectrum, which is the low cluster A♯3 237 Hz · B3 · C4 · D4 296 · C♯4 · D♯4), gone by 284; from 290 s the band's peak moves to
619 Hz = D♯5 −9 c. Both beds carry the 592: G5 louder (−4.8 dB under its own top) than G9 (−8.2). **So his ear is right: D5, a shade sharp
(+14 c), 274 … 284 s, the clearest 278 … 283, over a low cluster whose top note is D4 +14 c — the same D an octave down.**

## §168. He could not find the phase machine — the PHASE button was hidden by the Panels ▾ menu (2026-11-12)

**His words:** *"No, I don't think the multi-tempo is the one I'm looking for … I wanted something very, very simple, not using the previous
builds … find that prompt … If you find it, feed it back to me and summarize."* Then, with a screenshot of his bar and its Panels ▾ menu:
*"I just can't find it then, if that's the case. Could you show me how to get here?"*

**The prompt is SW-42** (COMPOSITION_NOTES, 2026-11-11, two parts), fed back in the chat in short. **The build against it is the PHASE button**
(§165) — but his bar showed neither PHASE nor MT, and Panels ▾ listed Strikes … Multitempo and no Phase. **The cause:** since the bar's tidy
(composer.html line 202 · 365) the panel buttons live in `#barHidden` and are reached through Panels ▾, whose entries are a FIXED list
(`menuPanels`, line 458); `phase_panel.js` anchored its button after `mtBtn`, in the hidden bar, and the list never named it. The throwaway
proof (§165) clicked the button by its id, so it never met the menu. **The fix:** `['phBtn', 'Phase']` added to the list (one line). He
reloads (F5) and opens Panels ▾ → Phase. SWEEP_LIST row 4. His verdict on the build itself is still to come; a bare rebuild from the brief
is the fallback he named.

## §169. The phase workshop started over (SW-43): the Reich benchmark looked up; the drift strategy put to him (2026-11-12)

**What prompted it:** SW-43 — *"let's start over … its own page … one step at a time … hear those in unison, 60 BPM, then gradually shift out of
phase … look up the speed of the phase shift [in Reich] … a logical strategy for all the parts going out of phase with each other, not at the
same pace."* The PHASE panel (§165) is set aside: a page he did not ask for in that shape, built whole where he wanted parts.

**The benchmark, looked up (web, 2026-11-12; no primary measurement of Reich's tapes exists in print — the figures are secondary analyses):**
*It's Gonna Rain* (1965, the first phase piece; *Come Out* 1966 the second): the two loops repeat 392 against 393 times over the main phasing
section, i.e. a speed difference of 1/392 ≈ **0.26 %**; that section takes about five minutes to come round one whole loop, which makes the
loop ≈ 0.77 s (arithmetic from the two figures, not a sourced length). *Come Out*'s later loop ≈ 610 ms (a performance-practice note). Reich's
own account: two machines not quite the same speed, one loop slipping slightly behind. **Carried to 60 BPM:** a 0.26 % difference between two
players = one beat apart after ≈ 390 beats (6½ min); half a beat apart (the farthest) after ≈ 3¼ min. *Piano Phase* (1967) is the other model
and a different mechanism: the mover accelerates for some seconds, arrives a sixteenth ahead, and LOCKS — a step every ten to thirty seconds,
a tempo difference of the order of 1 … 3 % while moving.

**The strategy, as reasoned:** (1) *constant* small tempo differences (the tapes), not continuous acceleration — a part that keeps
accelerating runs away in tempo within minutes, and the drift is then heard as a tempo change, not as phase. (2) Seven parts at seven tempi
spaced evenly (60 · 60+d · 60+2d …) all pass through moments where several re-coincide (when the +d part is one beat ahead, the +2d part is
two beats ahead — everyone together again); uneven spacing (the steps growing by a factor ≈ 1.3 … 1.6) keeps the pairs from realigning at
one moment. (3) One-sided (one stays, six faster, his first idea) drags the ensemble's felt tempo upward; symmetric (one stays, three a
little faster, three a little slower) keeps the center at 60 and the spread reads as the ensemble widening about a still point —
recommended. (4) "Stay out of phase" is impossible with constant tempi (every pair realigns every 1/δ beats); it is what LOCK is for:
when the spread is right, every part snaps to 60 and keeps its lag — the next step, by his word.
**Put to him:** the neighbor step d at Reich's 0.26 % as the one number, symmetric and uneven; his word pending.

## §170. THE PHASE WORKSHOP BUILT — step one: D5 staccato in unison at 60, the fan drifts, LOCK · DRIFT · CAPTURE (2026-11-12)

**His word:** *"Good analysis. Yes, let's go with that recommendation. And is there a lock button as well? … keep it at the fixed rate, but then
lock at those tempo … 60 beats per minute then. And also a way to gather data from those locks … lock and then listen to it continue at that
phase shift and then capture what distance they're at. And then continue from there if I wanted to. So just that much."*

**Built:** `workshop/phase/index.html` (a page of its own) served by `tools/phase_workshop.js` on **5630** (the next free port; launch name
`phase-workshop`); the locks he captures in `bank/phase_locks.json` (POST `/locks`). **The seven voices** from `sandbox/instruments.js` — flute
staccato `SWFluteb` 1 · clarinet staccato `SWClar` 12 · alto sax staccato `SWSaxb` 5 · glockenspiel Shorts (Hard) `SWGlock` 9 · piano struck
`SWPiano` 1 · violin and cello Staccato Velocity (#19) CC0 18 on `SWViolin` · `SWCello` 1. The key is 74 (D5) everywhere but the glockenspiel: it
is mapped at WRITTEN pitch (range 55 … 84), so it gets 62 and sounds D6, an octave over the rest — the nearest octave it has. **The fan** (§169):
the piano the anchor at the bpm; the others at bpm × (1 + f·step %), f = +1 flute · −1.3 clarinet · +1.69 sax · −2.2 glock · +2.86 violin · −3.71
cello — symmetric, the steps growing by 1.3; the step 0.26 % (Reich's tapes). **The scheduler** is the proven shape (morph_emit §319 · §320): a
60 ms timer fills a 250 ms horizon, every note stamped on the Web MIDI clock; the note 180 ms long (the staccato samples are short anyway).
**LOCK:** every stream's period set to the bpm's, its next beat left where it is — the lag holds. **DRIFT:** each stream's own period again,
from where it stands. **CAPTURE:** the lag of every player against the piano (beats, folded to ±½, + = ahead; and ms), the elapsed time,
bpm, step, locked or drifting — saved and listed on the page. **Stop:** all-notes-off and all-sound-off on every route. Keys: SPACE · L · D · C.
Velocity 100 flat for every voice — the level is the AI's (§159); if a voice stands out, a trim here, not a question.

**Proven once, on the preview (no Web MIDI there):** at step 5 % for 2.9 s the seven periods 952 · 1070 · 922 · 1124 · 1000 · 875 · 1228 ms, the
lags spread (flute 0.19 ahead … violin 0.5); LOCK → every period 1000; DRIFT → the fan's periods back; Stop clean; the POST to `/locks` saved
record 1 (then emptied). The sound and the ports are his Chrome's to prove. The preview server was stopped: 5630 is his.

## §171. The fan made one-sided at his word: no tempo slower than 60 (2026-11-12)

**His words:** *"can we, at least for the initial one, can we have everyone … not accelerating, everyone faster than 60 is all I mean to say.
No tempo slower than 60."* **Done:** the piano stays at the bpm; the others at bpm × (1 + f·step %), f = +1 flute · +1.3 clarinet · +1.69
sax · +2.2 glockenspiel · +2.86 violin · +3.71 cello (the same uneven steps, all upward). The symmetric fan of §169 is recorded there as the
alternative, his to ask for. The page is served as it is on disk: F5, no restart.

## §172. "Can the fan be irregular?" — every pair its own relationship: a Golomb ruler for the tempi (2026-11-12, his word pending)

**His words:** *"like this with the fixed tempo, but … can the fan be irregular? What I'm interested in is a totally irregular sort of rhythm,
so that each part has a slightly different rhythm relationship to all the others … if it's symmetric, then the flute and the clarinet will have
a similar relationship to the flute and the alto sax and the clarinet and the alto sax … let's see if we can zero in on what I'm looking for."*

**The reading:** two pulses at tempi a and b make one "phase rhythm" whose period is 1/(b − a) beats; seven players make 21 pairs, 21 such
rhythms. He wants all 21 DIFFERENT. The geometric fan (steps × 1.3) fails that quietly: its differences 0.69 vs 0.66, 1.17 vs 1.2, 1.51 vs 1.56
are the same rhythm to the ear. **The answer is a Golomb ruler** — marks on a line with every distance between two marks distinct; the best
seven-mark ruler is 0 · 1 · 4 · 10 · 18 · 23 · 25, its 21 differences 1 … 10, 13, 14, 15, 17 … 19, 21 … 25, all distinct. Tempo offsets in those
proportions give every pair its own rate. **The price:** the widest pair is 25 × the narrowest; the ear also needs the rates to differ by a
ratio (≈ 15 %) not a count, which the ruler's small differences 1 · 2 · 3 do not quite keep — a seeded search for sets whose 21 differences
all differ by ≥ 15 % is the shuffle version. **Put to him:** the ruler as the fan, the unit 0.05 % (pairs from 0.05 % — 33 min to come round — to
1.25 % — 80 s; the median pair 0.65 %), the piano at 0, then flute 1 · clarinet 4 · sax 10 · glock 18 · violin 23 · cello 25; a ⟳ shuffle
with a seed for variety later if he wants it.

## §173. The ruler in, at 0.05 % (2026-11-12)

**His word:** *"Yes, put the ruler in at 0.05%."* **Done:** the fan is the Golomb ruler 0 · 1 · 4 · 10 · 18 · 23 · 25 — piano 0 · flute 1 · clarinet 4 ·
alto sax 10 · glockenspiel 18 · violin 23 · cello 25 — the page's knob now **unit %** (0.05; the cello +1.25 %). The capture record's field keeps
its name `stepPct` (now the unit). F5, no restart.

## §174. The multi-tempos — his brief; the strikes measured for tightness; the grid-and-periods reading put to him (2026-11-12)

**His words (the drift held where it is):** *"let's discuss how to get some interesting multi-tempos and then transition between them … in a way
similar to those scattered strikes … fast enough or slow enough where the strikes are quite clustered, quite close to each other, but maybe
they're repeats … a local complexity where the strikes are all kind of in interesting clusters, close enough that you can still hear the
individual articulations … look at some of those strikes I made to get a sense of the tightness of the rhythm or the margins … with the
repetitions, be somewhat interesting … I'll probably resolve number 2 by having them change between tempi, accelerate or decelerate into
tempos. But they'll need to rest a little bit just for performability. Let's find some interesting destination tempos, then work on shifting
between those, then maybe eventually introduce this phase drift … sketch a simple way to audition these things."*

**His strikes measured** (`bank/scattered_strikes.json`, 106 strikes, 900 note-to-note gaps): a strike is ~8 notes (median; up to 35) inside
~180 ms (10 % … 90 %: 53 … 622 ms); the gaps inside it are mostly chordal — median 10 ms, 90 % under 83 ms — with 500 ms between strikes.
So "close enough to hear each articulation" sits around **50 … 80 ms** between hits; under ~20 ms it is a chord.

**The reading put to him:** any multi-tempo set is two numbers — the GRID (the tightest gap allowed between two hits, in ms) and each player's
PERIOD as a whole number of grid steps. From those: the DENSITY (hits/s = the sum of 1/period), the CYCLE (the whole pattern repeats after
the least common multiple of the periods), and the BUNCHING — periods that share factors pile their hits around the common beats
(clusters) and thin out between; periods with nothing in common interleave evenly. Hence "interesting" = mostly shared factors (clusters
that come round every few seconds) plus one or two odd periods (so the whole never quite repeats). Example at an 80 ms grid: 6 · 8 · 9 · 10 ·
12 · 14 · 15 steps = 125 · 94 · 83 · 75 · 62 · 54 · 50 bpm, nine hits a second, the five even-ish ones back together every 29 s, the full
cycle 3.4 min. Transitions: each player glides its own period from set A to set B over N seconds (its own accelerando or ritardando), or
cuts. The audition: a second block on the workshop page — grid · the seven periods · ⟳ (a seeded roll within a density and a cycle
length) · Play · a B set and "shift A → B over N s" · capture as favorites. Piece 5's multitempo rig had the ratio idea; this is built bare
on the workshop page at his word (SW-43). His word pending.

## §175. THE DESTINATIONS BUILT — six fixed multi-tempo sets on the workshop page, no dials (2026-11-12)

**His word:** *"I don't necessarily want too many dials. I accept your analysis … start with the destination ones … a few different ones [that]
sound different to each other in your estimation, and let me hear those as just units themselves … if a phase is an issue, then that too
should sound different from each other … I think what I really need to do is hear things and then decide what those dials need to be."*

**Built** (`workshop/phase/index.html`, the block "Multi-tempo destinations"): the grid 80 ms; six sets, each the seven periods in grid steps
(flute · clarinet · sax · glock · piano · violin · cello) with a start offset in steps where a shared beat would otherwise be a chord — the
offset of one step (80 ms) makes it a flam, the "close enough to hear each articulation" of §174. A set is a button; ▶ Play set; ■ Stop;
keys 1 … 6 and ENTER. The page states each set's density, its full cycle and its bpm per player:

| set | periods (steps) | hits/s | the whole repeats | bpm fl cl sax glk pno vn vc | the character |
|---|---|---|---|---|---|
| A loop | 4 6 8 12 16 24 48 | 9.4 | 3.8 s | 188 125 94 63 47 31 16 | every period divides the next — a tight metric loop |
| B clusters | 6 8 9 10 12 14 15 | 9.1 | 3.4 min | 125 94 83 75 63 54 50 | shared factors bunch; 14 and 15 stray |
| C even | 5 7 9 11 13 16 17 | 9.3 | hours | 150 107 83 68 58 47 44 | nothing shared — an even interleave, the far end |
| D slow | 10 12 15 16 18 20 24 | 5.7 | 58 s | 75 63 50 47 42 38 31 | the bunching an octave slower; the big recurrence every 4.8 s |
| E two speeds | 5 6 7 20 24 28 30 | 8.4 | 67 s | 150 125 107 38 31 27 25 | a fast trio over a slow quartet |
| F swarm | 12 13 14 15 16 17 18 | 5.9 | a day | 63 58 54 50 47 44 42 | one cluster that smears over three beats — the drift at speed |

The scheduler is the drift's (`startStreams`); LOCK · DRIFT · CAPTURE belong to the drift block and are off while a set plays. Proven
once on the preview (his server held 5630, so the preview took 5631): the six buttons, set B's periods 480 … 1200 ms and offsets, the beat
counts after 2 s (5 4 3 3 3 2 2), Stop clean, no console errors. **► HIS EAR on the six as units; then the transitions (each player's own
glide from set to set, or a cut).**

## §176. Five more destinations at his word: a second clusters, a second even, a second two speeds, a second swarm, and three speeds (2026-11-12)

**His words:** *"put aside the loop and the slow … give me like a different version of the remaining … clusters, an alternative not quite the
same as the original … same with the even, and then the rest, two speeds and swarm. And then is there a three speeds? Can I hear something
like that?"* A and D stay on the page, set aside by him. **Added** (grid 80 ms, periods in steps fl cl sax glk pno vn vc):

| set | periods | hits/s | repeats | bpm | the difference from its first |
|---|---|---|---|---|---|
| B2 clusters ii | 7 8 10 12 14 16 21 | 7.9 | 2.2 min | 107 94 75 63 54 47 36 | two families — the sevens (7 14 21) bunch together, the eights (8 16) together; slower |
| C2 even ii | 6 7 11 13 17 19 23 | 7.9 | days | 125 107 68 58 44 39 33 | wider and thinner: fast winds over a sparse low end |
| E2 two speeds ii | 20 24 30 · 6 7 8 9 | 8.4 | 3.4 min | 38 31 25 · 125 107 94 83 | the layers swapped: a fast quartet (glock piano strings) over a slow wind trio |
| F2 swarm ii | 8 9 10 11 12 13 14 | 8.2 | hours | 94 … 54 | the swarm faster and tighter; it smears within two beats |
| G three speeds | 4 5 · 9 10 12 · 24 30 | 10.2 | 29 s | 188 150 · 83 75 63 · 31 25 | a fast pair, a middle trio, a slow pair |

Eleven sets on the page; keys 1 … 9 reach the first nine, the buttons all. Proven by the page's own numbers (the script parsed and run
offline); the sound is his.

## §177. THE TRANSITION BUILT — hold · glide · hold, with a bar; three speeds (2026-11-12)

**His words:** *"let me hear a transition from two speeds to swarm. Just the originals is fine. Put some kind of graphic there, like you did
before with the phase part, so I can see when they've reached the destination. A couple variations: quite slow, a Goldilocks middle, and
relatively quick. Hold the original a few seconds, then the transition, then hold the destination."*

**Built** (the block "Transition"): from · to (any two sets; E two speeds → F swarm preset) · **slow 40 s · middle 20 s · quick 8 s** · Stop.
The first set holds 6 s; then every player's tempo moves in a STRAIGHT LINE IN BPM from its period in the first set to its period in the
second over T seconds (its own accelerando or ritardando — in E → F the fast wind trio slows 150 → 63 … 107 → 54 while the slow quartet
speeds up 38 → 50 … 25 → 42); then the second set holds. The bar: three zones (the hold · the glide, lit · 20 s of the last hold) and a
marker; the text "holding E" → "E → F · 50 %" → "AT F". The phase at arrival is whatever the glides leave; no snap. Proven once on the preview:
periods 400 … 2400 at the start, 565 … 1800 at 50 % (linear in rate), exactly F's 960 … 1440 at the end, the bar's widths 21 · 7 · 71 %
for 6 · 2 · 20 s, Stop clean, no console errors. **► HIS EAR: the three speeds; then whatever he names — a snap to the set's offsets at
arrival, rests, or the drift between.**

## §178. THE CHAIN — four slots, five speeds, the holds and the glides jittered by fixed factors (2026-11-12)

**His words:** *"let's put 4 slots in then, and a couple more steps towards faster, around a 4-second and around a 2-second. And for each
transition, just a little bit of jitter … if it's the 2-second one, the next one is some variation of that, like 2.5 seconds or 1.8 seconds.
And the resting time is somewhere around 2 seconds, same, some variation. You can just fix those … just so they're not exactly the same."*

**Built** (the Transition block remade): four slot pull-downs (E two speeds · F swarm · B clusters · G three speeds preset), a speed
pull-down between each pair — **slow 40 · middle 20 · quick 8 · 4 s · 2 s** — ▶ Play chain · Stop. The plan: hold slot 1 · glide · hold ·
glide · hold · glide · hold the last. The holds ≈ 2 s × the fixed factors 1.0 · 0.8 · 1.3 · 0.9; the glides = the chosen seconds × 1.25 ·
0.9 · 1.1 — so the "2 s" glides come as 2.5 · 1.8 · 2.2 s, his own numbers. The bar: seven zones in proportion (the holds dark, the glides lit),
the marker, the text "holding E" · "E → F · 50 %" · "AT F" · … · "AT G". Proven once on the preview with 2 s everywhere: the segments
2000 · 2500 · 1600 · 1800 · 2600 · 2200 · (12000 shown) ms, 50 % through the first glide the periods half-way in rate (565 … 1800), at the
end exactly G's (320 … 2400), Stop clean, no console errors.

## §179. The holds chosen per slot; the animation back — every row flashes on its hit (2026-11-12)

**His words:** *"can I have some choices for the holds as well? All four. And then can I get the animation back so I can see visually where
they are?"* **Built:** a hold pull-down after each slot — 1 · 2 · 4 · 8 · 15 · 30 s (× the fixed jitter 1.0 · 0.8 · 1.3 · 0.9); the chain now
ENDS with the last hold (Stop is sent). The table's last column lives again in every mode: each player's bar LIGHTS on its hit and fades
over a quarter second (the latest hit that has sounded, not the one 250 ms ahead in the driver), so the clusters are seen as they are
heard; in a glide the bar's marker crosses from left to right as that player's tempo goes from one set's to the next; in the drift it is
the lag about the middle, as before. Proven once on the preview: the holds 1 s → segments 1000 · 2500 · 800 · 1800 · 1300 · 2200 · 900 ms,
the chain ended by itself, the rows' flashes and the glide marker at 40 %, no console errors.

## §180. The pace of the granular section from 269 s (`piece-Section03-F-MultiTempo01`), measured on the four beds summed (2026-11-12)

**His ask:** *"look at the section starting around 269 and give me a general tempo. It's not super regular, but it has a general pace, or
even a couple tempos as you go through. There's the four granular parts, so they're combined."* **The four:** `granular-G5-expodec` (Elec,
269.05 → 472, offset 36.97 s) · `G9-expodec+perc` (269.15 → 464, offset 44.82) · `G8-rexpodec` (296.25 → 477, offset 0) · `B2-perc` (301.59 →
477, offset 32.59), summed at their score offsets. **Two readings.** (1) Spectral flux at 10 ms, the autocorrelation 0.25 … 2 s per 15 s
window: NO regular pulse — the strongest repeat's strength 0.05 … 0.18 against 1 for a clock; the grains run at ≈ 13 onsets/s, median gap
60 ms (the tightness of his strikes, §174). (2) The loud SWELLS (RMS at 20 ms, the 2 s local mean removed, peaks over the 85th percentile at
least 250 ms apart), per 30 s: 269–299 2.1/s, median gap 380 ms · 299–329 1.5/s, 520 ms · 329–359 2.0/s, 360 · 359–389 2.0/s, 360 · 389–419
1.5/s, 560 · 419–449 2.3/s, 360. The envelope's slow repeats sit at 1.6 … 3.5 s but weakly (r ≤ 0.14). Each bed alone: G5 2.0 swells/s · G9
1.6 · G8 2.2 · B2 1.1. **So:** no tempo in the clock sense; a general pace of about two swells a second (a 360 ms gap ≈ 165 bpm if counted
as beats, or ≈ 83 as half-beats), slackening twice to about 110 (299–329 and 389–419) — those are the "couple of tempos"; under it the
grain rattle at 13/s; over it a loose swell cycle of 2 … 3½ s.

## §181. A tap tempo on the composer score — the button TAP after Panels ▾, the key K (2026-11-12)

**His words:** *"Can you put a tap tempo button on the composer score? … use the space bar or something — oh no, that's to play — any other
key then. Because it's just when I leave the browser window, it stops playing."* **Built:** `score/public/tap_tempo.js`, loaded by
`composer.html` after the phase panel: a TAP button in the bar right after Panels ▾ with its readout, and the key **K** (free — T is the
trill, SPACE play, C · B · M · R taken); a run of taps within 2.5 s of each other, the readout the mean of the last eight gaps in bpm with the
count; a pause over 2.5 s starts a new run; nothing written anywhere. The listener runs in the capture phase so no panel swallows K; it
ignores taps typed into a field. Proven once on the throwaway 5601: four taps 500 ms apart → "119.8 bpm · 4", a 2.7 s pause → "— bpm";
one 404 in the page's own loads (`bank/strike_responses.json`) is older than this and not touched. His server serves the file as it is: F5.

## §182. His first state saved — 68 bpm, unit 0.095 %, 70 s in; FROM THE DRIFT: start there, hold, glide to a set, hold until Stop (2026-11-12)

**His words:** *"just save this for me. 68 BPM at 0.095 unit percentage, for 70 seconds. And then build me a transition to go from that state
right there — I don't want to have to play through 70 seconds every time. Freeze it there for maybe a second or two, then a transition to
swarm 2, a dial for the amount of time it takes, and when it gets there it can just hold there until I stop."*

**Saved:** `bank/phase_locks.json` record 1 — the Golomb drift at 68 bpm, unit 0.095 %, after 70 s. The lags are arithmetic (70 s × 68/60
beats × the ruler mark × 0.095 %): flute +0.075 beat · clarinet +0.301 · sax +0.754 (reads −0.246) · glock +1.357 (reads +0.357) · piano 0 ·
violin +1.733 (−0.267) · cello +1.884 (−0.116). **Built** (the block "From the drift"): bpm 68 · unit 0.095 · after 70 s · hold 2 s · to (F2
swarm ii preset) · over 20 s (his dial) · ▶ Play · Stop. It starts AT that state — every player's first beat placed at its lag, all locked at
the bpm — holds, glides every player from 68 to the set's tempo over the dial's seconds, then holds the set until he stops (no end). Under
the hood the plan's segments now carry their own rate tables (rA → rB) so a plan can start from any state, not only from a set; the bar
draws an endless hold as 12 s. Proven once on the preview: the first beats at 0.925 · 0.699 · 0.246 · 0.643 · 1 · 0.267 · 0.116 of a beat
(each = 1 − its lag), 50 % through the glide the periods 742 … 987 (linear in rate from 882 to F2's 640 … 1120), at the end exactly F2's,
still playing after; the four-slot chain still ends by itself; no console errors.

## §183. State 1 settled: no hold, 32 s to swarm 2; the median tempo of swarm 2 (2026-11-12)

**His words:** *"Let's do it over 32 seconds. Keep track of all this: 68 BPM, 0.095 for 70 seconds. No need to hold them, they can go
immediately over 32 seconds to swarm 2. Then from there, let's just start there. First tell me the median tempo of swarm 2."*
**Kept:** the From-the-drift defaults now hold 0 · over 32; lock record 1 carries `then: {hold 0, to F2 swarm ii, over 32 s}`. **F2 swarm ii:**
periods 8 … 14 steps of 80 ms = 94 · 83 · 75 · 68 · 63 · 58 · 54 bpm (flute … cello); the median is the glockenspiel's, 11 steps = 880 ms =
**68.2 bpm** — the same 68 his drift sits at, so the piano's tempo barely moves in the glide (68 → 62.5) while the winds rise and the strings fall.

## §184. Swarm 2 → unison at 78; THE SEQUENCE compiled on the page and in `bank/phase_sequence.json` (2026-11-12)

**His words:** *"let's go to 78 then. Can you do swarm 2 and then adjustable duration to 78 unison? And keep the whole sequence somewhere.
For this one let me just hear the transition. But also somewhere else on the page, compile the whole sequence so I can listen to it."*

**Built:** (1) the block "Swarm 2 → unison": start at F2 swarm ii (its own offsets), every player glides to ONE tempo (78, a field) over the
dial's seconds (20 preset), then holds until Stop — the same tempo, the lags as the glides leave them (an aligned arrival is a later
ask). (2) "The sequence": a line stating the order and ▶ Play the sequence, which plays it WHOLE from the top — unison at 68 → the drift
live for 70 s (unit 0.095 %) → 32 s to F2 swarm ii → hold F2 (a field, 8 s — not his number yet) → to unison at 78 over a field's seconds (20)
→ hold until Stop. The order is kept in `bank/phase_sequence.json` and in the page's `SEQ`; a general `runPlan` runs any list of holds
and glides from any start. Proven once on the preview: swarm 2 → 78 at 50 % the periods 699 … 912 (linear in rate), at the end all 769 ms
(= 78); the sequence's five segments as kept, the drift's tempi 68.06 … 69.61 at the start, 50 % into the first glide 742 … 974 ms, 75 % into
the second 81.9 … 71.9 bpm, the end all 78 and still playing; the sequence line was blank at load (ui() not run at start) — fixed.

## §185. "They don't reach perfect unison" — the cheat: a bulge on each ramp, the glide arrives ON THE BEAT (2026-11-12)

**His words:** *"I think there's some phase shifting, so you have to cheat a little bit. They don't reach perfect unison. The way I used to do
it was find out how much extra needs to be accommodated for in the phase, and then add that little tiny bit to the acceleration or
deceleration amount. There must be a way to calculate so they can be in total unison instead of at the same tempo but out of phase."*

**The reasoning:** the beats a player makes during a glide are the area under its tempo ramp; a straight ramp therefore fixes where its
phase lands, and seven straight ramps land seven different fractions of a beat. The fix is his, made exact: a sine bulge on the ramp
(zero at both ends, so the start and end tempi stay what they were) adds or removes any fraction up to half a beat; its size is δ·π/(2T),
where δ is the fraction needed (folded to ±½) and T the glide's seconds. **Built:** the plan runner now integrates each player's PHASE
(2 ms steps, a beat fired where it crosses a whole number — the old next += period could not place an arrival exactly); on entering a
glide it predicts every player's landing, sets the target — unison: the piano's own landing, all on one beat; a set: the set's flam offsets
— and lays the bulge. Every glide on the page arrives aligned now: the chain, from the drift, swarm 2 → unison, the sequence. **Proven
once on the preview:** swarm 2 → unison 78 over 20 s: the bulges −0.47 … +0.49 beat, the tempo's peak deviation ≤ 3 % (the clarinet −2.85,
the cello +2.95), at the end all seven periods 769 ms and their last beats within **0.5 ms** of each other, the phases 0.087 … 0.086; the
sequence's glide to F2 swarm ii lands every player on F2's grid within 0.3 ms. No console errors.

## §186. The last glide 18 s; the sequence in one line (2026-11-12)

**His words:** *"let's do it over 18 seconds, and then can you put everything together into one line?"* **Kept** (the page's defaults, `SEQ`,
`bank/phase_sequence.json`): **unison 68 → the drift (unit 0.095 %) 70 s → 32 s to F2 swarm ii → hold 8 s → 18 s to unison 78 → hold until Stop.**
The 8 s hold on swarm 2 is still the AI's placeholder.

## §187. A total on the sequence; the granular section's length (2026-11-12)

**His words:** *"put a total duration box as we add. And what is the duration of that section from the start of the two granulars at 269
until the end of the last one?"* **Built:** the sequence block shows "total m:ss (N s) to the last hold", the sum of the drift, the glides and
the hold, live as the fields change — 70 + 32 + 8 + 18 = 128 s = 2:08 today. **The section** (`piece-Section03-F-MultiTempo01`): the first
granular bricks start at 269.05 (G5) and 269.15 (G9); the last to end is G8 at 477.03 — **208 s = 3:28** (G5 ends 472.08, B2 476.67, G9 464.33).

## §188. The sequence heard WITH THE BEDS, in the workshop — the first hit at score 277.8 (2026-11-12)

**His words:** *"can I hear that inside the composer score, the sequence so far, with the first hit hitting at 277.8, whatever's easier for now,
I'll probably change it a fair bit"* — then: *"or if it's easier to bring the granular clips into the workshop, that's fine too."* **The
workshop was the easier and the right one for changing it a fair bit** (a render into his save is one tool away when it settles: struck notes
per lane from the same plan runner). **Built:** the server serves the fund at `/fund/<file>` (the root from `bank/materials.json`, with
Range requests so the browser can seek — HIS SERVER MUST BE RESTARTED ONCE for the route); the sequence block gained "with the beds" (on),
"first hit at score 277.8" and a beds level slider (0.8). On ▶ Play the sequence the four bricks of `piece-Section03-F-MultiTempo01` play in
the page at their score positions relative to that first hit: G5 from file position 45.72 s and G9 from 53.47 s at once (they began at
269), G8 18.45 s in from its start, B2 23.79 s in from 32.59 s — the same offsets his bricks carry. Stop pauses them. Their level is the
browser's, beside the rack's; the slider is the balance for now. **Proven once on the preview:** the Range route 206 / audio/wav; four
beds loaded (readyState 4, 240 s each); after Play the plan as above, G5 · G9 playing (positions 47.0 · 54.8 after 1.5 s — a 0.2 s play
latency, fine for a workshop), G8 · B2 waiting on their timers; Stop paused all four; no console errors. A note: the §27 server edit
collapsed two backslashes in the route's regexes (the machine's known fault) — fixed by the file tool before the proof.

## §189. Lining up the walls at 301.4 (`piece-Section03-G-GrainBaseAlign`); the brick that grew back (2026-11-12)

**His words:** *"help me line things up. Around 301.4, Elec 1 has kind of a wall there, and I want Elec 4's wall to coincide, lined up in
unison. Tell me where to move the bottom one. And there's an issue with the panel: if I sliced it, when I put in a new start time, it grows
back the part I sliced off instead of moving the whole brick."*

**The walls, by measurement** (RMS at 5 ms, the step = the 150 ms after a point minus the 150 ms before): **Elec 1** (`granular-G5-expodec`,
start 269.05, offset 36.97 s) has its wall at file 69.580 s = **score 301.660** (+22 dB; nothing comparable near 301.4 — his eye read the
waveform's drawn edge). **Elec 4** (`granular-B2-perc`, start 301.6, offset 32.589 s) has only a +5 dB bump at its start; its wall is at file
33.467 s, **0.878 s into the brick** (+54 dB), landing today at 302.478. **So:** the bottom brick's start = 301.660 − 0.878 = **300.78 s**, its
offset untouched (the sound moves with it), and the two walls fall together at 301.66.

**The grow-back:** the panel's Start (s) field set `startTime` alone; `le_material.js`'s rule of the edges reads "start moved, end not" as a
LEFT-EDGE drag — the sound stays, the brick shows more of it — which is right for the edge and wrong for a typed start. Fixed in
`composer.html` `applyPanelField`: a material brick's typed start shifts its end by the same amount (a move; the offset stays). SWEEP row 5.
He reloads (F5) the composer score; the file is served as it is.
**Proven once on the throwaway 5601** (his save loaded read-only, nothing saved): the brick `zn-3155` given start 300.78 in the panel went
from 301.6 … 476.678 to 300.78 … 475.858 — the length 175.078 kept, the offset 32589 kept. Nothing else touched.

## §190. Coordinated: the first hit kept at 277.8; the glide to swarm 2 begins at the wall, 301.66 (2026-11-12)

**His words:** *"help me coordinate all this. The starting point for the sequence was good — whatever that starting point was, let's mark
that. And I want the transition to swarm 2 to start right at that point of that wall."* **Built:** two marks in the sequence block — "first
hit at score" 277.8 (kept) and "glide starts at score" 301.66 (Elec 1's wall, §189); the drift now lasts the distance between them, **23.86 s**,
and the line, the total (23.86 + 32 + 8 + 18 = 81.86 s → the unison at 78 arrives at score 359.66) and the beds follow the marks live.
`bank/phase_sequence.json` carries the marks. **A consequence put to him in one line:** at 23.86 s the fan has a third of the spread he saved
at 70 s (state 1); the unit 0.28 % would reach that spread by the wall — his call, the unit left at 0.095.

## §191. The same drift by the wall: the unit 0.279 % (2026-11-12)

**His words:** *"calculate for me how to get to the same drift, the same amount of drift by that amount of time instead of 70 seconds. Before
it was 0.095 for 70 seconds. I want to get to the same place, over however many seconds it is."* **The arithmetic:** the spread is unit ×
seconds (each player's lead = seconds × bpm/60 × its mark × unit), so the same place in 23.86 s needs 0.095 × 70 / 23.86 = **0.279 %** (the
cello then +7 % faster than 68, at 72.7, for those 24 s). Set as the sequence's unit; the drift block and state 1 keep 0.095 / 70 as the
record. Also: §190's edit left a comment mid-line in `SEQ` (half the object commented out) — caught by the parse check, fixed here.
**Proven once on the preview:** the line reads the marks, the drift 23.86 s at 0.279 %, the total 1:22 (81.86 s); the plan 23.86 · 32 · 8 · 18 · ∞;
the leads at the wall 0.076 · 0.304 · 0.759 · 1.365 · 0 · 1.745 · 1.896 beats — state 1's 0.075 · 0.301 · 0.754 · 1.357 · 0 · 1.733 · 1.884 within 1 %.

## §192. Swarm 2 by 324.27 (2026-11-12)

**His words:** *"324.27. Let's get to swarm 2 by this time."* **Built:** a third mark, "at swarm 2 by score" 324.27; the glide lasts from the
wall to it, 324.27 − 301.66 = **22.61 s**; the line and the total follow (23.86 + 22.61 + 8 + 18 = 72.47 s; the unison at 78 at 350.27 as the
hold stands). The record updated.

## §193. "341.67 — the pitch kicks in around here": measured, not yet marked (2026-11-12)

**His words:** *"341.67. The pitch kicks in around here. I think it's D5 again. Find the precise time, mark that as the unison point … just
mark that we want to get to D5 at this point or some version of it. Tell me first, before you change anything, how many seconds that is
from the last marker point."* **Measured** (the D5 band 560 … 610 Hz at 5 ms, the step 100 ms after minus before): the sustained pitch
enters at **score 341.90** with the save as it is — and it is **Elec 4's bed (B2) that carries it** (its band 28 dB against G5's −1 and G9's
−9), so when he moves that brick to 300.78 (§189) the entry moves with it, to **341.08**. An earlier spike in the band at 338.85 is a single
grain (gone by 339.6). **The pitch:** the resonators wobble ± ½ st by design; B2 alone over the first 3 s peaks at 555 Hz (C♯5 +3 c), the
summed frames swing 576 … 608 Hz — a note sitting between C♯5 and D5, a quarter tone under D5 at its center, D5 at its top. **From the
last mark (324.27):** 17.62 s as the save stands, 16.80 s with the brick moved. Nothing changed on the page; his word on which time to mark.

## §194. The sequence rebuilt on the marks: hold 6 s, the unison on the beat at 341.08 (D5); every number a box; the wide bar with the lights (2026-11-12)

**His words:** *"6 seconds, hold swarm 2. And yes, that is the unison point, let's hit there. Rebuild the sequence with the new bed, put
in number boxes for all the relevant units, and bring that animation back — a colored bar and something that follows it."*

**Built:** the sequence block remade — boxes: start at score 277.8 · unison 68 bpm · drift unit 0.279 % · the wall 301.66 · at swarm 2 by
324.27 · hold swarm 2 6 s · unison at 341.08 · at 78 bpm; every stretch derived from the marks (23.86 · 22.61 · 6 · 10.81 s; the total
1:03 = 63.28 s to the unison) and stated in the line; the beds as his save now has them (B2 at 300.78). The bar 900 px wide, holds dark
and glides lit, a yellow follower, the score time of each mark under it (277.80 · 301.66 · 324.27 · 330.27 · 341.08) and the live score
time in the state ("score 340.7 · F2 swarm ii → unison 78 (D5) · 96 %"); under the bar seven lights, one per player, each flashing on its hit.
Proven once on the preview: the five segments as above, the marks at their places, the lights present and lit by the hits, the tempi
converging on 78 near the end (the exact arrival proven at §185). `bank/phase_sequence.json` rewritten with the marks and the beds.

## §195. The scrolling strip: the sequence's stretches as colored bands sliding past a playhead (2026-11-12)

**His words:** *"You can keep that animation, but that's not exactly what I meant. I just want a scrolling bar, and some shaded areas,
different colors of shading, to show me where in the sequence I am — as it's drifting to the wall it might be going through a green
shaded area, moving towards swarm 2 a different shade, and when it gets to the unison, etc."* **Built:** a canvas strip under the
sequence (900 × 72): time slides right to left past a fixed yellow playhead at 30 %; 36 px per second, about 25 s in view; each stretch a
band of its own color — the drift green · the glide to swarm 2 blue · swarm 2 held purple · the glide to the unison orange · the unison
held gold — with its name and its score times written in it; a ruler ticked every second, the score time every five; the score time at
the playhead. The wide bar, the marks and the lights stay. Proven once on the preview (a picture of the strip mid-sequence: the blue
glide under the playhead, the purple hold and the orange glide ahead, the ruler 320 … 335).

## §196. "A burst in Elec 1 around 3:54" = score 353.89; DRIFT 2 — a second ruler, reached at the burst (2026-11-12)

**His words:** *"There's a moment, like a burst in electronic one around 3:54. Find the precise moment. At that moment I want to start another
phase shifting sequence, the same method, a variation slightly different in character. Some slight accelerations for a moment — they should
reach their target tempos by this point. Add just that phase shift sequence into the workshop so I can dial in where I want it to get to,
the rhythm that I like."*

**The moment.** "3:54" was the dictation's hearing of *three fifty-four*: the composer's time display is in seconds, and Elec 1 has nothing
at 234 s (G5 begins at 269); at file 3:54 of G5 (score 466) there are only +7 dB bumps. At **score 353.89** G5 steps +26 dB (30 ms RMS,
100 ms after minus before), its loudest frame at 354.09 — the burst. (Also seen and set aside: Elec 2's B4 has a +53 dB burst at 232.35.)

**The variation.** The first ruler was 0 · 1 · 4 · 10 · 18 · 23 · 25. The second is **0 · 1 · 7 · 11 · 20 · 23 · 25** — another perfect
seven-mark Golomb ruler of the same length (every pair still its own rate), its gaps dealt differently: the flute and clarinet far apart
now (1 and 7 against 1 and 4), the sax near the clarinet (11 against 7), the glock up at 20; the same order of players, the piano the anchor.
Slightly different in character, not another thing.

**Built** (the block "Drift 2 — from the unison at 78, at the burst"): unison 78 bpm · unit 0.279 % · unison for 4 s · ramp 3 s · the burst at
score 353.89 · ▶ Play drift 2 · LOCK · DRIFT · CAPTURE · Stop. The streams start in unison at 78 (score 346.89 with those numbers), hold it
`pre` seconds, then each slides linear in tempo into its fan-2 tempo, arriving exactly at the burst, then drift; LOCK · DRIFT · CAPTURE are
the first drift's (a capture now records the ruler and the score time); the beds play underneath from the same score origin, so he hears
it in place. The drift block's table shows the tempi and the lags as before. Proven once on the preview: unison 78 → mid-ramp 78.1 … 80.5 →
at score 353.87 the fan's own tempi 78.22 · 79.51 · 80.38 · 82.32 · 78 · 82.97 · 83.4 (ruler 2 at 0.279 %); LOCK → every period 769 ms;
DRIFT → the fan back; Stop clean; no console errors. (The preview's fast-forward does not advance the drift's beats, so its lag readout
stayed at zero there — the drift's own lags were proven at §170.)

## §197. THE FORM: the whole sequence drawn once, a cursor crossing it; Drift 2's Stop and its beds (2026-11-12)

**His words:** *"what I meant was the reverse: scroll the cursor, that's better, so I can see when it's going to hit the next one, or see
the whole form … the width can be longer … watch the cursor scroll."* Then, mid-build: *"Drift 2 is playing the bed as well — I don't need
the bed, I just want to hear the rhythms of the ensemble. And the stop doesn't seem to work."*

**Built:** the strip of §195 reversed — the whole sequence drawn once across the window's width (900 … 1800 px), every stretch a band of
its own color with its name, its score times and its length written in it, the endless last hold drawn as 20 s, a ruler every 5 s, and
the yellow cursor crossing it slowly (63 s for the form). **Drift 2:** its Stop · LOCK · CAPTURE buttons were drawn before its state was
set and stayed disabled — fixed (the buttons redrawn after); and Drift 2 no longer starts the beds, his word. Proven once on the preview:
the form's five bands in order with the cursor inside the blue glide at score 308; Drift 2's Stop enabled and stopping, no bed element
playing, no console errors.

## §198. Drift 2 drifts 55 s, then locks (2026-11-12)

**His words:** *"55. Just hold 55 seconds under the current settings for drift 2."* **Built:** a box "drift for 55 s, then LOCK" on Drift 2:
from the burst (353.89) the fan runs 55 s, to score 408.89, then LOCK fires by itself — every player at 78, its lag kept — and holds until
he stops or presses DRIFT; 0 = never. Recorded in `bank/phase_sequence.json` as `drift2`. (His browser had crashed; both servers were still
up — 5600 and 5630 — the links given again.)

## §199. A set's tempi shown in the table on the click, before Play (2026-11-12)

**His words:** *"if I click on one of these multi-tempo destinations, the tempi change up in the players before — now they change when I hit
play set, but not if I click on the button. Start there."* **Built:** clicking a set (or its number key) while idle shows that set's tempo per
player in the table at once; touching the drift's bpm or unit, or playing the drift, brings the drift's tempi back. Also pending from the same
message, held for after he sees the tempi: Elec 2's wall after 371 (Drift 2 to last until it); closer-knit destinations in the categories.

## §200. Four closer-knit destinations, one per category; a set may have its own grid (2026-11-12)

**His words:** *"Swarm 2 had 93 down to 53 and converged on 78. Give me versions of the other ones — clusters, even, two speeds, and swarm —
that are slightly closer; clusters 2 is 35 to 107. So they don't have to go quite as far from where they are now, and they don't have to
converge quite as much. But the distance could be slightly greater than swarm 2 — I don't mind slightly more acceleration."*

**The target:** medians near 78 (the unison they leave), the widest pair about 2 : 1 (swarm 2 is 1.75 : 1). At the common 80 ms grid the
periods for that sit at 7 … 15 steps, too few whole numbers to build a "clusters" or an "even" character in; so a set may now carry **its own
grid** (`grid`), the engine reading it everywhere (the periods, the offsets, the flam targets, the readouts). **Added:**

| set | grid | periods | bpm fl cl sax glk pno vn vc | median | widest : narrowest |
|---|---|---|---|---|---|
| B3 clusters iii | 60 ms | 9 10 12 14 15 16 18 | 111 100 83 71 67 63 56 | 71 | 2.0 — the threes bunch, the twos bunch, 14 strays |
| C3 even iii | 40 ms | 14 16 17 19 21 23 25 | 107 94 88 79 71 65 60 | 79 | 1.8 — almost nothing shared |
| E3 two speeds iii | 80 ms | 7 8 9 10 · 13 14 15 | 107 94 83 75 · 58 54 50 | 75 | 2.1 — a fast quartet over a slow trio |
| F3 swarm iii | 80 ms | 7 8 9 10 11 12 13 | 107 94 83 75 68 63 58 | 75 | 1.86 — swarm 2 a little wider |

Fifteen sets on the page. Proven once on the preview: B3 clicked → the table's tempi 111.1 … 55.6 at once; Play set → the periods 540 …
1080 ms (the 60 ms grid), the flam offsets on that grid; no console errors.

## §201. Elec 2's wall at 372.10; Drift 2 lasts until it; swarm 3 the next destination (2026-11-12)

**His words:** *"In Elec 2 there's a wall around 371 or after. Find that point, and we'll make drift 2 last until then."* Then: *"let's go with
swarm 3 and remind me where we are in the sequence."* **Measured:** Elec 2 (G9, start 269.15, offset 44.822) steps +49 dB at **score 372.10**
(peak −9 dBFS); smaller steps at 371.16 (+17), 374.75 (+14), 376.12 (+15). **Set:** Drift 2's "drift for" 18.21 s — from the burst 353.89 to the
wall 372.10 — where it LOCKS (the page's way of holding the state) until the glide to **F3 swarm iii** is built in; that glide's length is
his to say. The record carries `next`.

## §202. The block "Drift 2 → swarm 3": the tail of Drift 2 at the wall, the glide over his dial, swarm 3 held (2026-11-12)

**His words:** *"set up in the workshop just that transition from the end of drift 2 to swarm 3, and let me adjust the time, so I can hear it."*
**Built:** the wall at 372.10 · drift before it 4 s · to (F3 swarm iii preset) · over T (20 s preset) · ▶ Play · Stop · its bar. The state of
Drift 2 at (wall − before) is arithmetic, not played through: each player's beats since Drift 2 began = unison × pre + the ramp's mean rate ×
ramp + its own rate × the drift so far; the fraction of that places its next beat. The fan keeps drifting to the wall; at the wall every
player glides to the set over T, landing on the set's grid (§185); the set holds until Stop. The beds under it if "with the beds" is on.
Proven once on the preview: the start at ruler 2's tempi 78.22 … 83.44 (score 368.10), "Drift 2, drifting" before the wall, 49 % through
the glide 94.1 … 70.0, at the end exactly F3's 107.14 · 93.75 · 83.33 · 75 · 68.18 · 62.5 · 57.69 and every player on F3's grid within 0.4 ms;
no console errors.

## §203. The beds out of "Drift 2 → swarm 3"; the ground Drift 2 covers in 18.21 s — not yet adjusted (2026-11-12)

**His words:** *"let me verify the 18.21 seconds of drift 2: they're covering the equivalent ground of 55 seconds of the previous setting? Do we
make that adjustment? And drift 2 → swarm 3 is playing the bed too."* **The beds** taken out of that block (they belong to The sequence
only). **The ground:** NOT adjusted — the unit stayed 0.279 %, so 18.21 s reaches a third of what 55 s reached. The same ground in 18.21 s
needs 0.279 × 55 / 18.21 = **0.843 %** (the cello then 25 × 0.843 = +21 % at the burst, 94 bpm — reached inside the 3 s ramp, no longer slight);
the FIRST drift's ground (0.279 × 23.86 = 6.66 %·s) in 18.21 s needs **0.366 %** (the cello 85). Put to him; recommended 0.366 unless the
bigger spread is the point.

## §204. Drift 2 compensated: unit 0.843 % — the 55-second ground by the wall (2026-11-12)

**His words:** *"check that we did compensate for the first drift — I wanted it to reach the same place. And do the same with drift 2: cover
the same amount of ground up to 55 seconds, but in 18 seconds."* **The first drift:** yes — 0.279 % = 0.095 × 70 / 23.86 (§191), the leads at
the wall matching state 1's within 1 %. **Drift 2:** the unit set to **0.843 %** = 0.279 × 55 / 18.21; at the burst the fan runs 78 · 78.7 · 82.6 ·
85.2 · 91.1 · 93.1 · 94.4 (piano · flute · clarinet · sax · glock · violin · cello), reached inside the 3 s ramp — the ramp box is there if that
jump is too much. The "Drift 2 → swarm 3" block reads the same unit, so its start follows.

## §205. Swarm 3 by 383, held to Elec 1's wall at 388.72, a new unison at 400.3 (2026-11-12)

**His words:** *"reach swarm iii by 383 · sustain until ~388 wall · find moment of wall in e1 · 400.3 new unison · what are the swarm 3 tempos?"*
**Measured:** Elec 1 (G5) steps +32 dB at **score 388.72** (peak −9 dBFS; nothing comparable at 386 … 391 besides a +10 at 390.80). Around
400.3 Elec 1 has no step (+3 … +5 dB only) — 400.3 is his mark, not the bed's. **Built** (the block renamed "Drift 2 → swarm 3 → the new
unison"): boxes at swarm 3 by 383 · held to the wall at 388.72 · new unison at 400.3 · at 75 bpm (swarm 3's median, the AI's default — his to
set). The stretches derive: 10.9 s to swarm 3 · 5.72 s held · 11.58 s to the unison, on the beat. Swarm 3's tempi: 107 · 94 · 83 · 75 · 68 ·
63 · 58 (flute … cello). Proven once on the preview: the five segments 4 · 10.9 · 5.72 · 11.58 · ∞; at swarm 3 its tempi exactly; 51 % through
the last glide 86.3 … 67.0; at the end all 75, the seven last beats within 0.7 ms; no console errors.

## §206. The new unison 90; THE WHOLE FORM played as one, with the beds, drawn at once (2026-11-12)

**His words:** *"let's make 90 the new unison, and the full sequence with bed visual — could I see the whole form at once? and make the
cursor as slow as necessary."* **Built:** the unison box at 90. A block "The whole form": every box above read once and played as ONE plan
from the first hit to the new unison, the beds under it (if on), the whole drawn at once on its own wide canvas, the cursor crossing it at
the form's own pace (≈ 122 s across): **277.8 unison 68 → drift 23.86 s → 301.66 wall: 22.61 s to F2 swarm ii → 324.27 hold 6 → 10.81 s
to unison 78, on the beat at 341.08 → hold 9.81 → 350.89 the ramp 3 s into ruler 2 → 353.89 the burst: drift 2 18.21 s → 372.10 wall: 10.9 s to
F3 swarm iii → 383 hold 5.72 → 388.72 wall: 11.58 s to unison 90, on the beat at 400.3 → hold.** 122.5 s to the last unison. A ramp into a
fan now carries `noAlign` (tempi only, no bulge); a plan draws on its own canvas. If the marks are out of order the block says where and
does not start. Proven once on the preview: the eleven segments as above; at 324.3 F2's tempi; at 341.2 unison 78, the seven within
0.5 ms; at 353.95 ruler 2's tempi (78.7 … 94.4, the piano 78); at 383.1 F3's; at 400.4 all 90 within 0.5 ms; the form drawn on its canvas;
no console errors.

## §207. A level slider by the whole form (2026-11-12)

**His words:** *"vol slider pls."* **Built:** beside ▶ Play the whole form, a second handle of the beds' level (the same level as the sequence
block's slider, the two mirrored, live while playing) and a second box of the players' velocity (mirrored with the top one; it takes effect on
the next hits, as the top one does).

## §208. DRIFT 3 — a third ruler dealt the other way round, from the unison at 90 (2026-11-12)

**His words:** *"find me a new drift, and set up the drift from the 90, and let me hear it. It looks like there's about 39 and a half seconds left."*
**The new drift:** the ruler **0 · 1 · 11 · 16 · 19 · 23 · 25** (a third perfect seven-mark ruler) dealt the OTHER way round — piano 0 · cello 1 ·
violin 11 · glockenspiel 16 · sax 19 · clarinet 23 · flute 25 — so this time the bass holds with the piano and the treble runs: a different
character from the first two, where the cello flew. **Built** (the block "Drift 3 — from the unison at 90"): unison 90 · at score 400.3 ·
unison for 2 s · ramp 3 s · unit 0.389 % (drift 2's ground, 0.843 × 18.21, spread over his 39.5 s; drift 1's ground would be 0.169) · drift for
39.5 s, then LOCK (to score 444.8) · LOCK · DRIFT · CAPTURE · Stop; no beds. At the ramp's end the fan runs 90 · 90.35 · 93.85 · 95.6 · 96.65 ·
98.05 · 98.75 (piano · cello · violin · glock · sax · clarinet · flute). Proven once on the preview: unison 90 → after the ramp exactly those
tempi; the lock by itself after 39.5 s (all 667 ms, "DRIFT 3 · LOCKED at 90", score 445.0); the buttons live; no console errors. Not yet in the
whole form — at his word, once heard.

## §209. Drift 3 set: 0.917 % for 33 s, the lock held 4 s; the unison at 90 lasts three beats and the fourth is drift; four destinations above 90 (2026-11-12)

**His words:** *"the unit is going to be 0.917, drift for 33 seconds and then lock it at that point for 4 seconds. Can you make the previous
section, the swarm 3 to the new unison, go to the new drift — they play 3 at unison and then the 4th one they're already at drift. And give me
some new multi-tempo destinations, the same categories, all with tempos above the 90, several buttons so I can listen."* (The 0.917 came
from his own numbers in the chat: 0.55 × 50 / 30.)

**Built:** Drift 3's boxes — unison for 2 s (three beats at 90 = 2.000 s), ramp 0.1 s (a cut: the fourth beat is already at the fan), unit
0.917, drift for 33, **lock for 4 s** (a new box). A shared tail `drift3Tail` — three beats of 90 · the cut into ruler 3 · 33 s of drift · 4 s locked
· until Stop — is now the end of BOTH the chained block ("Drift 2 → swarm 3 → the unison → drift 3") and the whole form, read from Drift 3's
boxes; the form runs 277.8 … 439.4 (157.6 s to the end of the lock). At the cut the fan is 90 · 90.8 · 99.1 · 103.2 · 105.7 · 109 · 110.6 (piano ·
cello · violin · glock · sax · clarinet · flute). **The destinations above 90**, each on a finer grid so seven distinct periods fit:

| set | grid | periods | bpm fl … vc | median |
|---|---|---|---|---|
| B4 clusters iv | 40 ms | 8 9 10 12 14 15 16 | 188 167 150 125 107 100 94 | 125 — the fours and the threes bunch, 14 strays |
| C4 even iv | 30 ms | 11 13 14 15 17 19 21 | 182 154 143 133 118 105 95 | 133 — almost nothing shared |
| E4 two speeds iv | 40 ms | 8 9 10 · 13 14 15 16 | 188 167 150 · 115 107 100 94 | 115 — a fast wind trio over a slower quartet |
| F4 swarm iv | 40 ms | 9 10 11 12 13 14 15 | 167 150 136 125 115 107 100 | 125 — the swarm, fast |

Nineteen sets on the page (about 15 hits/s each above 90 — the price of seven players all over 90). Proven once on the preview: the
chained block's segments … 11.58 → unison 90 · 2 (3 beats) · 0.1 into drift 3 · 33 · 4 LOCKED · ∞; at 401.5 all 90; at 402.6 the fan's tempi
above; at 436.5 all 90 again (the lock); the whole form 15 segments ending the same way; 19 set buttons; no console errors.

## §210. Swarm 5: the top at about 135, the rest down through the 90 (2026-11-12)

**His words:** *"that's maybe a little too fast. Let's do a swarm 5, but let's have the max tempo be about 135. You can go below the 90."*
**Added:** F5 swarm v — grid 50 ms, periods 9 … 15 — **133 · 120 · 109 · 100 · 92 · 86 · 80** (flute … cello), median 100, 12 hits/s. Twenty sets.

## §211. The block "Drift 3 → swarm 5" (2026-11-12)

**His words:** *"let's go with the swarm 5. Can I get the row for the drift 3 to the new swarm?"* **Built:** to (F5 swarm v preset) · over T
(12 s preset) · ▶ Play · Stop · its bar; the line says "from score 435.40 · at F5 swarm v by 451.40". It starts at Drift 3's lock — the lags by
arithmetic (the three beats, the cut's mean, 33 s of ruler 3 at 0.917 %), all at 90 — holds the lock its 4 s, glides every player to the set over
T landing on its grid, holds the set. Proven once on the preview: the lock's offsets 0.985 · 0.894 · 0.713 · 1.076 · 0.35 · 0.349 · 0.895 of a
beat, all at 90; 49 % through the glide 109.4 … 84.1; at the end F5's 133.3 · 120 · 109.1 · 100 · 92.3 · 85.7 · 80, every player on its grid
within 0.3 ms; no console errors. The whole form still ends at the lock; swarm 5 joins it when T is his.

## §212. 21 s to swarm 5, then at once to unison 120, on the beat at 480 (2026-11-12)

**His words:** *"let's go 21 seconds. But as soon as it reaches swarm 5, let's start moving to unison, to 120, and have 120 hit at 480 in the
composer score. Let me hear how that sounds."* **Built:** the block "Drift 3 → swarm 5 → unison 120": over 21 · then unison at score 480 · at
120 bpm; the lock 4 s (435.4 → 439.4), 21 s to swarm 5 (arriving 460.4 on its grid), 19.6 s on to unison 120 on the beat at 480, held. The whole
form grows the same way and now runs **277.8 → 480, 202.2 s**. Proven once on the preview: the segments 4 · 21 · 19.6 · ∞; at 460.5 swarm 5's
tempi (133.2 … 80.7, the next glide 1 % in); at 480.2 all 120 within 0.4 ms; the whole form's last segments the same, ending at 480.00; no
console errors.

## §213. The whole form from any score time (2026-11-12)

**His words:** *"give me a way to advance in the whole score, so if I want to just hear the end, I can."* **Built:** a box "from score" beside
▶ Play the whole form (277.8 by default). The plan is first run SILENTLY up to that time, the same way it runs live (2 ms steps, the bulges
planned as the glides come), so the players begin already where the form would have them — the lags, the tempi, the alignments; the
beds start at their place; the cursor and the state read the score time. A start inside a glide plans that glide's bulge from the remaining
time, so the arrival still aligns. Proven once on the preview: from 439 → "LOCKED at 90", every player at 90, 29 ms to get there, the next
beats 122 … 606 ms ahead (nothing fired from the past), then 480 reached with all seven at 120 within 0.4 ms; from 470 (49 % into the last
glide, 128.2 … 99.6) → 480 within 0.4 ms as well; no console errors.

## §214. THE FORM WRITTEN INTO THE COMPOSER SCORE — `piece-Section03-H-addTuplets`; the last hit one unison strike at 480 (2026-11-12)

**His words:** *"let's have the last hit be right at the unison 120, right at 480. Just one strike in unison. And then if it's easy enough to
work in the composer score, put them in there. The next pass will be changing those to tuplets, and the next the harmonies. New name:
piece-Section03-H-addTuplets."*

**Built:** `bank/phase_form.json` — the form as data (the sixteen steps with their marks, the three rulers, the voices per player, the
end); `tools/phase_form_render.js` — the page's plan arithmetic ported (2 ms phase integration, the bulges) that writes a struck note per
hit per player into a COPY of a save: flute · clarinet · sax staccato on their lanes, the glockenspiel Shorts (Hard) on the mallets lane
(written D4 → D6), the piano struck, violin and cello Staccato Velocity, D5 (74) everywhere but the glock (62), velocity 100, 0.12 s long,
group `phase-form`, a marker per step (Φ …) and one at the last hit. **One change of rule, in the tool AND the page:** a glide to a UNISON
now lands every player on the beat AT THE MARK (each phase a whole number at the glide's end, the piano too), not merely together at the
piano's phase — so the hits at 341.08 and 400.3 are on the marks exactly; the last hit is set to 480.000 and nothing follows. The workshop's
whole form ends the same way (one strike, then it stops). **His H save** existed already — his own copy of G, saved 22:51, empty of the form —
and his word named it: rendered into it through a temp file (the tool itself refuses to overwrite). **The result:** 2050 notes (flute 320 ·
clarinet 310 · sax 299 · glock 294 · piano 274 · violin 280 · cello 273) and 17 markers; the first hit 277.8 on all seven, 341.08 on all seven,
480.000 on all seven. Proven once on the throwaway 5601: the save loads (3567 objects, 2067 in the group), the seven at 277.8 · 341.08 · 480,
the glock note as specified; nothing saved there. He opens it in his composer (File ▾ → Open). The save is his and stays uncommitted.

## §215. THE FIRST LISTENING COPY OF THE PIECE SO FAR — an offline render of `piece-Section03-H-addTuplets`, 0 → 486 s, the electronics laid from the fund (2026-11-14)

**What prompted it (his words, from his phone):** *"Can you render an MP3 of the complete piece so far and then send it to me, or actually pop it
into the chat if you can?"* Nothing was running on the machine (no Reaper, no engine, no loopMIDI, no score server) and he was away from it,
so the lineage's TAKE (`docs/RENDER.md` § 0 — the piece played once in real time, his ▶ in his Chrome) was not available. The question asked
first: can this piece be rendered OFFLINE and be faithful? **Yes, for this piece as it stands:** its electronics are MATERIAL BRICKS only —
a stretch of a mastered file from the fund, streamed at the file's own rate, faded at the edges, trimmed by gainDb, at a flat mark (all
twelve are mf = as mastered; `electronics/sc/material.scd` · `electronics/score/le_material.js`). No live input, no capture, no roll of the
dice: the offline sum IS what the engine streams. (A hairpin or a drawn curve on a brick is not followed by the offline tool — none exists yet.)

**The route, in order:**
1. **The players, the lineage's three commands** (`docs/RENDER.md` "The audio render"), run here for the first time. `tools/export_midi.js`'s
   `RACK_PORT` was still piece 5's (`LG…` names, the LGMF rack) — RE-POINTED to this rack: Flute SI2 → SWFlute · Fluteb SI2 → SWFluteb ·
   Clarinet SI2 → SWClar · Alto Sax SI2 / b → SWSax / SWSaxb · every `… ARO` track → SWPerc (its channel from the rack) · Vibraphone XS →
   SWVibes · Crotales / Glockenspiel / Xylophone / Marimba RM → SWCrotales / SWGlock / SWXylo / SWMarimba · the four piano tracks → SWPiano ·
   Violin XS → SWViolin · Cello XS → SWCello (the map is `tools/rack_alive.js`'s PLAN). The capture ran on the throwaway server 5601 (his 5600
   never bound): **14,357 messages · 28,988 frames in 1,173 s · 54 writes refused** (the page's `POST /api/elec` — the bricks' relay, refused
   as every non-GET is). The export's checks: **notes 3,449 / 3,449 · 78 bent notes every bend in place · 0 hanging · read-back ok**; 30 tracks,
   483.13 s. Reaper opened by the AI with the rack (`Start-Process`; the bridge's heartbeat came ~2 min after launch, once the samplers had
   loaded — until then the window is an empty, dimmed project and `heartbeat.json` does not exist: NOT a fault, wait). `render_reaper.js`:
   a copy of the rack in its own tab, 30 items by name, offline render **129 s · 486.120 s · −4.2 dBTP · −23.4 LUFS · LRA 8.9 · first sound
   16.001 s against the first onset 16.000** (the sampler's attack, as always). The rack itself untouched; the render tab closed.
2. **The electronics, NEW — `tools/elec_offline.js`:** every `elecMaterial` zone of the save → one ffmpeg graph: the fund file from `offsetMs`
   for the brick's length, `aformat` stereo · `aresample` 48 kHz (the fund is 44.1; the engine's VDiskIn does the same, §111) · quarter-sine
   fades in and out (the engine's `\sin` envelope) · `volume` = gainDb + the mark's step (mf = 0) · `adelay` to the brick's start; `amix
   normalize=0`; padded and trimmed to `--end`. Twelve bricks (5 → 477 s) in 2 s: `notation/audio/raw/<save>-elec-float.wav` · 486 s ·
   **+4.5 dBTP · −14.8 LUFS · first sound 5.043 s** (the opening bed fades in over 9 s from 5.0).
3. **The mix, NEW — `tools/mix_offline.js`:** the take's mix rule (`take.js`) for two offline stems: the players' float (the rack's master
   already in it) + the electronics at ELEC RETURN's fader + the master's, both read from the .rpp (both 0 dB) → `amix normalize=0` → the
   shared gain step (`tools/lib/gain_step.js`): the float measured **+4.7 dBTP · −14.6 LUFS · LRA 11.8**, ONE plain gain **−5.7 dB** →
   `notation/audio/piece-Section03-H-addTuplets-mix.wav` (24-bit, **−1.0 dBTP · −20.3 LUFS**) → the MP3 at 320 kb/s, **18.5 MB**, sent into
   the chat. (`--up --maxUp 6` passed as the piece's render does since Draft 01; the gain went down, so it did not matter.)

**What the copy is and is not.** It is the save as it stood 2026-11-12 22:54 — Sections 1 · 2 · 3 with the phase form's 2,050 D5s, the beds
ending 464 … 477 (his step 1, the swell to 480, not yet made). The balance is the rack's at unity: the electronics measure ~8.6 LU louder
than the players over the whole, which is the beds against sparse strikes, not a fader's doing — a listening copy, not a mix decision; the
room's balance is his at the take. §159 stands: no volume question put to him.

**Where things were left:** Reaper open on the rack (his, as STARTUP has it; nothing saved); the throwaway server stopped; the engine never
started. The float files and the MP3 are under `notation/audio/` (the WAVs gitignored; the MP3 left untracked beside them). The two tools are
the piece's (`tools/`): they read the save's shape; the brick's semantics they copy are the engine's and are cited above — if a second piece
needs them, that is the day they move to `electronics/tools/`.

**The sorting, one line:** `elec_offline.js` · `mix_offline.js` → the piece's `tools/`; `export_midi.js`'s port map re-pointed in place.

## §216. THE TUPLET PASS OPENS — the ladder, the section's tempo range, the ceiling, the bands and the conversion chart (2026-11-14)

**From his phone, after the listening copy (§215).** The conversation of SW-45 · SW-46, in order, with what each settled:
1. *"List the basic tuplets in order of speed … let's just go into 2"* → the ladder of SUBDIVISIONS OF THE BEAT, then widened at his word
   (*"numerator to denominator is two … three in the space of two, five in the space of two"*) to every n:1 and odd n:2: **1 · 1.5 · 2 · 2.5 ·
   3 · 3.5 · 4 · 4.5 · 5 · 5.5 · 6 · 7 · 8 strikes per beat** — the odd n:2 fill the half-steps. "The space of two" taken as two BEATS (a beat =
   one strike of the phase form); if he means two eighths the n:2 steps are the plain ones again.
2. *"This gives me the range of tempi in the last section."* → the pulse × the ladder. The pulses the form holds (`bank/phase_form.json` and
   the workshop's sets): **slowest 53.6 bpm** (swarm ii's slowest player, period 14 × 80 ms) · **fastest 133.3 bpm** (swarm v's fastest, 9 × 50
   ms) · the unisons 78 · 90 · 120 · the drifts' tops 72.7 · 94.4 · 110.6. In order through the section: drift 68 → swarm ii 54 … 94 → unison
   78 → drift 78 … 94 → swarm iii 58 … 107 → unison 90 → drift 90 … 111 → locked 90 → swarm v 80 … 133 → unison 120 at 480.
3. Two click tracks sent into the chat so he could HEAR the top of the ladder: eighths at 135 (0.222 s each) and sixteenths at 133.3 (0.1125 s,
   ~9 a second). His verdict: **"let's do the max tempo be 10 a second"** — THE CEILING, for every player, always.
4. *"Create a slow, medium, and fast band … time containers where we change those single strikes into tuplets … 1 second slow, 2 seconds
   fast, 3 seconds medium … everyone's playing at various tempi, and there's some acceleration"* → THE DESIGN: the bands are in STRIKES PER
   SECOND (the heard speed), so one band gives a different tuplet at a different pulse — that is what lets a container hold across a drift or a
   swarm, where every player's pulse differs. **Proposed bands: slow 1 … 3 · medium 3 … 6 · fast 6 … 10 strikes a second** (roughly even on a
   log scale across the 1 … 10 range; his word pending). THE PICK: the ladder step whose rate (step × pulse ÷ 60) lands inside the band,
   nearest the band's geometric middle; none inside → the nearest step; never above 10/s. THE BEAT a tuplet divides is the gap to the
   player's next strike (so a glide accelerates the tuplets strike by strike — the acceleration he described, by construction).
   **Built:** `tools/tuplet_bands.js` (the numbers: ceiling, bands, ladder, the section's 19 pulses) → `docs/TUPLET_BANDS.md` (the rule, the
   chart: 19 pulses × 3 bands, each cell the pick and the alternatives that also land inside, and the first step over the ceiling; and how a
   container is applied, for the AI that builds the pass). `--pick <bpm> <band>` gives one answer.
   What the chart shows at a glance: SLOW is nearly always the strike itself or 3-in-2 / eighths; FAST tops out at eighths-and-a-half (3.5)
   at 133 bpm and reaches thirty-seconds only under 60 bpm; at 120 bpm and above, 5.5 per beat is already over the ceiling.

**Open, his:** the band edges · the containers (start · length · band) · the share of strikes that become tuplets through a container (SW-44's
"3 singles and a tuplet, then the singles diminish") · whether "the space of two" is two beats. The beds' ending (SW-44 step 1) deferred to his
desktop at his word.

## §217. THE TUPLET WORKSHOP — a page of its own: chunks, the draw inside a band, heard at once (2026-11-18)

**What prompted it (SW-48, his words at the desktop):** *"what's the best way to quickly preview these things. I just really want to hear the
instrumental part … start tuplets at this second, and I'll be like, oh no, that's too long, or let's make that one medium, or let's alternate
more quickly"*; then the clarification — a band holds SEVERAL tuplets (*"eighth notes and then triplets … there could be some repeats … just as
long as all of them stay within that speed range"*), the alternation is BY CHUNKS a few beats long (singles · medium · singles · fast), a chunk
applies to the whole ensemble or to the players he ticks; and the AI must be able to write a sequence (the teeter-totter: mostly singles with
tuplet interruptions, crossing to the inverse). His go: *"Yes, go ahead and build it."*

**Why a page of its own and not the composer score (the recommendation he took):** in the composer score every change rewrites 2,050 notes
into his save and needs a reload; in a workshop the chunks are a short list, the tuplets are worked out as it plays, and nothing touches a save
until a stretch is settled. Not grafted onto the phase workshop page either (774 lines of plan runners): the tuplet pass needs only the strikes'
TIMES, which the save already holds (`properties.phaseForm.player · hit`, §214).

**Built:**
- `tools/tuplet_workshop.js` — its server, **5640** (he runs it by its full path): `/hits` (the 2,050 strikes per player read from
  `piece-Section03-H-addTuplets`, never written, + the form's steps) · `/chunks` GET / POST → **`bank/tuplet_chunks.json`**, the ONE record
  (ceiling 10 · the bands slow 1–3 · medium 3–6 · fast 6–10 · the chunks). The page autosaves into it; the AI writes it; the page reloads it
  within 1.5 s when it changes on disk.
- `workshop/tuplets/tuplets.js` — THE DRAW, one copy for the page and for node. A player's beat = the gap to its next strike. A chunk claims
  the strikes of its players inside it (a later chunk wins an overlap). A claimed strike becomes a tuplet with the chunk's SHARE (sliding from
  `shareFrom` to `shareTo` across the chunk — the slide he described); the step is drawn among every ladder step whose speed (step ÷ beat)
  lies in the band and under the ceiling; with the chunk's HOLD chance (0.45) the step of the beat before is kept if it still fits (the
  repeats). A half step (3 in 2 … 11 in 2) spans two beats and uses up the next strike. Nothing fits → the nearest whole step under the
  ceiling. Seeded per chunk and player: the same chunk gives the same tuplets until "new draw" moves its seed.
- `workshop/tuplets/index.html` — a big score clock · Play / Stop / SPACE · the strip of the form with the chunks on it (a click sets the
  start) · a 14 s detail of the seven players' strikes colored by band · the chunk table (▶ from 2 s before · start · end · band · the seven
  checkboxes and "all" · tuplets % start → end · repeat % · new draw · ×). A change is heard WHILE it plays (the events are rebuilt and the
  scheduler re-seated past what is already sent). Players only; the routes are the phase workshop's (D5 on seven ports).
- Two EXAMPLE chunks seeded so the page has something to hear: 284–288 medium · 292–296 fast, all seven.

**Proven once:** the draw in node on the real strikes — 2,050 singles → 2,310 strikes; inside 284–288 the players draw 2.5 · 3 · 3.5 · 4 · 4.5 ·
5 per beat, inside 292–296 5 · 5.5 · 6 · 7 · 8; **the fastest gap anywhere 9.70 strikes a second** (under the ceiling). The page on the throwaway
port 5641 (launch `tuplet-5641`): no console error, 2 rows, 2,310 events. The SOUND is his Chrome's (the in-app browser has no Web MIDI).

**Not built yet, at his word (after he has heard a plain chunk):** the pattern writer (the teeter-totter first) and the step that writes a
settled stretch into his save.

## §218. The tuplet workshop: moving about, mute and solo, chunks by hand, zoom (2026-11-18)

**His words, on first use:** *"how do I scroll/navigate simply pls"*, then *"In the main part, can we use side-to-side scroll, please, and to
navigate? And can you allow me to solo or mute players? And then how do I delete or add or move the chunks, the tuplet chunks? And then can we
get a zoom to both parts, the top chunk part and the main part?"* — the first page had only a click on the strip and a typed second.
**Built (the page only, `workshop/tuplets/index.html`):** the players view is its own window (not glued to the playhead): the wheel or the bar
under it scrolls side to side, CTRL+wheel or − / + zooms (2 s … the whole form), a click sets the playhead, and while playing the view follows
in pages; the form's strip zooms the same way and shows a frame for what the players view holds. LEFT / RIGHT 1 s, SHIFT 10 s. MUTE · SOLO
per player (heard only, never saved). THE CHUNKS BY HAND on a colored bar at the top of the players view: drag the middle to move, an end to
resize, double-click an empty spot to add, click then DELETE to remove (to 0.1 s; the tuplets redraw while dragging, the file is written on
release). Proven once on the throwaway port: loads with no console error; zoom, solo and go-to run. The drag itself is his hand's to try.

## §219. The tuplet draw: THE CONTRAST RULE; the n:3 ladder weighed and left out; the start marked at 292 (2026-11-18)

**His ear on the two example chunks:** *"each instrument is just playing one type of tuplet."* The cause, from the draw's own numbers (§217):
a 4 s chunk at 68 is ~4 beats a player; the band admits ~4 steps at that pulse, neighbors a half step apart (4 and 4.5 per beat — the piano
drew 4.5 · 5); a two-beat step uses two of the four beats; and repeat 45 % keeps the last one half the time. So the change was there and
inaudible.
**His proposal:** the denominator 3 (n in 3 beats) for more types at fast tempos — *"or you tell me if there's a better method."* Weighed: at 120
the fast band holds 3 · 3.5 · 4 · 4.5 per beat (6 · 7 · 8 · 9 a second); thirds add 6.7 · 7.3 · 8.7 · 9.3 — between them. The band (6 … 10, a ratio
of 1.67) holds about four clearly different speeds whatever the ladder; a three-beat group also rarely fits a short chunk. LEFT OUT, said to him
with the reason; the next lever if needed is a wider band.
**Built instead, at his "yes let's try the contrast rule"** (`workshop/tuplets/tuplets.js`): when the step changes, it is drawn among the fitting
steps at least a QUARTER faster or slower than the last (ratio ≥ 1.25; if the band has none, any other step), whole steps weighted 3 to the
half steps' 1. A test chunk 284 … 296 medium, all seven: flute 3.5 5 3.5 3.5 5 5 4 5 5 3 · alto sax 5 5 3 4 3 4.5 3 5 3.5 4.5 3 · cello 3.5 2.5
4.5 4.5 4.5 2.5 2.5 4 — triplets against quintuplets against sixteenths; fastest 5.95 a second (inside medium).
**Also:** the mark **292 s — the tuplets start here** (his word) in `bank/tuplet_chunks.json` (`marks`), drawn pink on both views; ALT+wheel
zooms as in the composer score (right in, left out); the up-and-down wheel no longer moves the views (his word: it got in the way) — only a
sideways scroll and the bar do. The repeat's alternatives were put to him (a chance · a count · a range · a written pattern; recommended: the
range "lasts 1 to 3 beats") — his word pending. He had removed the two example chunks; the file holds none.

## §220. The tuplet draw: THE RATE OF CHANGE (one slider), always uneven, never a round; always a subdivision; the chunk's end cuts (2026-11-18)

**His ear and his words, in order (SW-49 and after):** the tuplets ran past a chunk's end (his screenshot) — real: a beat that began inside was
played whole; **now the end cuts the tuplet**. *"Slow seems to still include the quarter note … the tuplet sections are some subdivision
always"* — **the single strike is out of the ladder inside a chunk** (2 … 8 per beat, 3 · 5 · 7 · 9 · 11 in two); where slow admits nothing at
a fast pulse the slowest subdivision is taken (slow reaches ~4 a second near 120). Then the changing: *"I would like the tuplets to change
frequently … sort of non-periodic … 1 beat of eighth notes, 2 beats of triplets, a quintuplet … pace of change is maybe one of the variables,
and maybe that's the only one … make it asymmetric, so you wouldn't have a triplet and then a quadruplet and then a triplet again … no one
figure would come back too often"*; and, refining the AI's first answer: *"one factor, like a slider, the rate of change … if slow, 3 beats of
one tuplet and 4 beats of another and 2 beats of another, but never 2 beats of one thing and 2 beats of another. The fastest will just be a
change per beat."* His go: *"Yes, go ahead and build it."*
**Built (`workshop/tuplets/tuplets.js`, rewritten whole; the page's repeat % box → a slider):** `chunk.rate` 1 … 5 — 5 every beat · 4: 1–2
beats · 3: 1–3 · 2: 2–4 · 1: 2–5; a new length is never the last length (where the range has two). The figure: the last two set aside and the
new one a quarter faster or slower while that leaves two or more to choose from, else the last one only; and nothing that would complete a
round of two or three (A B A B · A B C A B C).
**A dead end on the way, kept:** the first version (last two set aside + contrast + whole steps weighted 3:1) fell into a FIXED ROUND in a
band of three plain figures — the piano at 68 in medium played 5 4 3 5 4 3 5 4 3: each rule alone was right, together they left one choice at
every step. The round check and "a real choice or relax" cured it: the piano now 3.5 4.5 3 4 3 4.5 3 4 5 3 4 3 5 4 3 4.5 3 4 5.
**Checked on the real strikes:** medium at the fastest and at 2–4 beats, fast at 68 (5 … 8 per beat, fastest 9.70 a second), fast toward 120
(3 … 6 per beat, 9.85), slow (1.5 · 2 · 2.5; under 3 a second at 68). Where a band holds only two figures (slow, some players) A B A B is
unavoidable — said to him. `hold` (the old chance) is no longer read.

## §221. The tuplets into the composer score — an experimental save, to hear them with the electronics (2026-11-18)

**His word (SW-50)**, after placing 24 chunks by ear in the workshop (291.8 … 392.2 — slow · fast · medium alternating, 1 … 4 s each, rates
mostly 4 and 5): hear them WITH the electronics, in the workshop or in the composer score. **Chosen: the composer score** — the bricks there
are the real ones, played by the engine; porting the beds into the workshop would be a second, lesser copy of them. Also in the page since
§220: the form's header in the players view (his word: "to see the form of the piece too … all the drifts and swarms").
**Built:** `tools/tuplet_render.js` — the phase form's strikes of `piece-Section03-H-addTuplets` replaced by the workshop's draw (the same
`tuplets.js`), every other object carried; each note a copy of its source strike (lane · pitch · technique · velocity), `properties.phaseForm`
gaining `step · k · band`. The target **`piece-Section03-X-tuplets`** is the tool's own and is overwritten on every run (`metadata.tupletRender`);
his H save is never written. First run: 24 chunks · 2,050 strikes → the count below.

## §222. The tuplet workshop grows a HARMONY lane and ARTICULATION SETS (SW-51) (2026-11-18)

**His words (SW-51, whole in the sketch pad):** the passes to come (the end's electronics · harmony · crescendo · accents), then for the harmony:
takes collected in the strikes drawer, and in the workshop *"select a range and apply that harmony … the bricks as they are here for the tuplets
… change the size or move them around and change the take"*; and *"can I change the articulations here, like as a set?"* (a staccato set, a
spiccato one for the strings, maybe a percussive one he will make). His answer to the one question — fresh deal or the take's own assignment:
***"Keep the take's own assignment."*** Also this hour: rate 0 on the slider (*"all one pattern … it doesn't change the tuplet, but then I can
re-roll"* — one tuplet per player for the whole chunk); the 49 chunks bookmarked (`bank/tuplet_versions/2026-11-18-a-first-pass-292-392.json`).
**Built:**
- **the server** (`tools/tuplet_workshop.js`): `/takes` — every take of the strikes drawer (`bank/panel_snapshots.json` → `panels.strikes`), its
  pitches per LANE (the voices not skipped; `also` lanes counted); `/routes` — every pitched technique of the seven players with its port ·
  channel · Xsample cc0 · range, from `sandbox/instruments.js`. **HIS SERVER MUST BE RESTARTED ONCE** for these.
- **the rule, one copy** (`workshop/tuplets/tuplets.js`): `keysAt` — a player's keys at a time = its lane's pitches in the take of the harmony
  brick there (a later brick wins), folded by octaves into the technique's range; no brick, or no pitch on its lane → its own D. `SETS` — a set is
  one technique per player: `staccato` (what the phase form plays) · `spiccato strings` (violin · cello `spicc_vel`, cc0 15).
- **the page:** a purple HARMONY lane between the form's header and the chunks — drag, resize, double-click in the lane to add, DELETE; the
  selected harmony's row: start · end · the take (the list, newest first, and ◀ ▶ to step through takes while it plays) · what each player
  gets, in note names. An ARTICULATION switch beside Play (the set for the whole workshop). The file gains `harmonies`, `sets`, `artic`.
- **the render** (`tools/tuplet_render.js`): the experimental save carries the pitches (a note per pitch where a lane has several) and the set's
  technique.
**Proven once, without sound:** with `SW-ctpt-16` on 300 … 306 the seven play 90 · 89 · 61 · 72 · 53 · 55 · 70 at 302 and the glockenspiel its 62
at 295; the set `spiccato strings` routes the violin to cc0 15; the render of his 49 chunks: 4,606 notes, fastest 10.00 a second. The take's
own techniques are NOT used (the set decides); velocities are still one number for all.

## §223. INTERVAL STACKS in the strikes drawer — the stack · its transposition · the order up the ensemble · the octaves (SW-52) (2026-11-19)

**What prompted it (SW-52, whole in the sketch pad; "let's discuss this next bit first before implementing"):** harmonies for the harmony pass
made as STACKS OF ONE INTERVAL sized to the ensemble (7 here; 5 or 9 elsewhere) — the cluster, then fifths, minor and major thirds, fourths,
minor and major sevenths; all the transpositions "until it repeats … a little bit like the Messiaen limited transposition"; the notes dealt up
the ensemble "like a tone row", in order bottom to top or shuffled; then the octave as its own stage — "present all the available C's in its
range", a shuffle that keeps the note, an assign by hand.
**The arithmetic put to him before any code** (pitch classes, a stack of 7): cluster 7 notes · fifths 7 (a diatonic collection) · fourths the
same seven as fifths read downward · minor thirds 4 (a diminished seventh, three doubled) · major thirds 3 (an augmented triad) · minor
sevenths 6 (whole-tone, one doubled) · major sevenths the SAME seven as the cluster. As SETS the thirds and the minor sevenths are limited (3 ·
4 · 2 transpositions); but which note carries the extra copy differs with the starting note — his word: *"the extra copy of another note can
be considered a different transposition … at least I'll have that option"* → every stack lists its TWELVE.
**The limited stacks, discussed:** his own proposal taken as the rule — *"make sure the same note in any given octave maybe isn't present if
possible, and maybe have a way of showing that in the available octaves"*: never two players on one key while another octave is free; a
unison only by hand. Two further distributions (wide · close) named and left for after. Bottom to top, his "y": cello · piano · alto sax ·
clarinet · violin · flute · glockenspiel.
**Lineage read first** (`strike_drawer.js` · `spectrum.js` · `spectrum_ui.js`): a harmony is a strike whose notes become voices (`pitch` · `lane`
· `fold`); the harmonic series is a category added as a mixin that wraps `strikeById` · `select` · `renderBanners` · `renderKeyboard`. The
stacks follow that pattern exactly — **`score/public/interval_stacks.js`, one new file, nothing of the core edited** (one `<script>` line in
`composer.html`, after `spectrum_ui.js`).
**Built:** the banner INTERVAL STACKS (interval · size · transposition · choose) and under it `stacked` · `shuffle order` · `shuffle octaves`;
ids `is:<kind>:<size>:<transposition>`; the deal (`stackDeal`) puts voice k of the stack — or of a seeded row — on the k-th TICKED player
from the bottom; the octaves (`stackPickOctaves`): each player's note in an octave of its technique's range, the players with the fewest
octaves choosing first, a key never taken twice while one is free; a COLUMN PER PLAYER to the right of the keys with a dot on every octave it
could take (filled = playing · small = free · hollow with a name = another player is there); a double-click puts the player there. Takes,
Hear and Insert are the drawer's own (the strike has the harmonic series' shape).
**Proven once, on the throwaway 5601 (every write refused, the autosave stubbed):** the drawer opens with its other categories intact
(strikes · harmonic series · starters · stacks · modes · blasts · chord shapes); `is:cluster:7:0` dealt stacked gives voices 0 · 1 · 2 to alto
sax · clarinet · flute (only three rows were ticked — the other four BUSY at the working copy's playhead, the drawer's own rule); 7 major
thirds from C: three players, three different keys; `shuffle order` → the row 0 · 5 · 4; `shuffle octaves` → the same notes on other keys;
the columns drawn (the keyboard widened 150 → 237); no console error of the stacks'. NOT proven: seven ticked players together, the sound,
his hand on the dots.
**Known, said to him:** the deal counts only ticked rows (a busy row is not ticked); a voicing preset or transpose of the core re-voices from
the stack as written.

## §224. The strikes drawer: the switch `ignore the score` (2026-11-19)

**His words:** *"can you provide some sort of toggle for the rule where if my current cursor is somewhere in the score that other players are
playing, it doesn't let those players be available in the strikes drawer? That might sometime eventually be useful, but can I just toggle that
on and off so I can create a strike regardless of what the cursor is on in the score?"* — met at once by the interval stacks (§223: four of
seven rows busy at the playhead, three players dealt). **Built** in `strike_drawer.js` (the core, two small places): `cfg.ignoreBusy` — when on,
`busyLanes()` answers "nobody is busy", so every row is available to the tick, the shuffle and the stacks; a checkbox `ignore the score` beside
`may fold`. Off by default: the drawer as it was. Checked: the file parses; not opened in a browser.

## §225. Interval stacks, second pass: THE MAP OF KEYS (one click) and SHAPES (SW-53) (2026-11-19)

**His ear and words after §223 (SW-53, whole in the sketch pad):** the cluster wants the ACTUAL PITCHES first — *"the actual cluster in the same
octave … then C5 to F5 … different versions"*; the old voicing presets *"in the past wasn't enough"* and *"I don't necessarily think musically
in those terms"*; two things were missing from the old system: *"it doesn't give me enough pitches to manually assign to get the harmony I
want. And then the voicing is too limited."* His own model for narrowing the possibilities: *"I start initially manually and then establish a
pattern"* — a chord placed by hand becomes a SHAPE, shuffled within, the shape kept for any stack. On assigning: *"the double click sometimes
doesn't work, and there's just too many clicks … more visual feedback and fewer clicks."* On the AI's writing: *"I'm starting to get a little
bit lost in analysis … more broken down and stated more simply."*
**Two proposals of the AI's that he turned down or widened, kept here:** (a) reuse the drawer's voicing row (`cluster` · `oct` · `Hear piano`)
for "pitches first" — no: those categories are not how he hears; (b) a shuffle with two dials, "together" and "where" — too narrow: *"those
are just some examples … there might be a number of variations."* What stood: groups read from an example.
**Built (`score/public/interval_stacks.js`; the core untouched):**
- THE MAP OF KEYS — the columns beside the keyboard now show EVERY key of the chord each player can reach (a colour per note of the chord;
  the key in play a big ringed dot; a hollow dot = another player holds it; a faint mark on every chord key of the keyboard itself). ONE
  CLICK puts the player on a key and sounds it; a click on its own key RESTS the player (its column stays; a click brings it back). A voice
  is from now on a player's slot: a click may give it any note of the chord, so two players may share a note by his hand.
- SHAPES — `save shape` reads the chord as placed, bottom to top: a jump of a fourth or more starts a new group; a group = how many notes ·
  its lowest key · its width; named by itself (`1 in oct 2 - 5 in oct 4 - 1 in oct 6`); kept with the takes (`bank/panel_snapshots.json`,
  panel `stackShapes`). A shape is a button under INTERVAL STACKS for any stack; `shuffle in shape` draws again: the stack's notes dealt into
  the groups, each on its key nearest the group's middle, then every key to a player who can reach it (the keys with the fewest able players
  first, a search) — the groups stay, the notes and the players change.
**Proven once on the throwaway 5601 (writes refused):** `ignore the score` on → all seven dealt (Vc · Pno · A.Sx · Cl · Vn · Fl · the Vibraphone
row); the columns hold 15 … 50 keys a player for the cluster; his scenario placed by clicks (36 · 60 61 62 63 64 · 84) reads as the shape
above; two draws in the shape: 41 | 60 61 62 63 64 | 90 and 41 | 60 61 62 63 66 | 88, each on players who reach them; the same shape on 7
fifths from C: 35 | 57 60 62 66 67 | 88; a click on the cello's own key rests it. NOT proven: the shape's save to the server (the POST was
refused by the test's own guard), the sound of a click, seven players under his hand.
**Limits said to him:** a shape of 7 notes on a stack of 7; no delete for a shape yet; the Vibraphone row's column is headed `Perc` (its own
short name).

## §226. Interval stacks: a free `shuffle`, and THE VERSIONS — back and forward through every chord of a stack (2026-11-19)

**His words:** with a new chord chosen, *"I just wanted the first initial shuffle or just a random shuffle, right now it has one of my shapes
selected, and the button says chosen. So what do I do instead?"* → a button `shuffle` (a new order and new octaves together, no shape); a
shape button is lit only while the chord is IN that shape (a plain deal or a new stack turns it off; `chosen` only names the loaded stack).
Then: *"some kind of collective seed … I'm shuffling in shape and I want to go back to the one 2 shuffles ago. Or same with the regular
shuffle."* → not a seed but a LIST: every deal, shuffle, shape draw and click on the map is a version of the stack (the last 60); `◀` `▶` and a
counter `2 / 4` in the row. A seed per kind of shuffle would not have brought back a chord that came from several kinds in a row; a list does.
A new stack starts a new list. **Proven once on the throwaway:** a deal and three shuffles = 4 versions; two steps back give version 2
exactly; one forward gives version 3; the counter and the status follow.

## §227. NINETY-TWO TAKES MADE FOR HIM — the 46 strikes of ScatteredStrikes01, each in its original spread and spread out, all seven players covered (`MTchord56st` … `MTchord147st`) (2026-11-19)

**His words:** *"I'm on take MT chord 55D. D is for dissonant and C is for consonant. So you would start on 56, but let's make the suffix ST.
Can you go through all of the initial strikes — 46 of them — and make a new take from each of these strikes, one in its original spread, and
then one in its spread out version? But shuffle each one until all instruments are covered. And if there's an instrument that's forcibly left
out because you just can't get it in or there's not enough notes, then just double one of the notes … each version won't have the same seed.
Just keep advancing the seeds … the next one will be MT chord 56 ST, then 57 ST, etc."*
**How (the real drawer, driven on the throwaway 5601; only the takes' POST let through; a copy of the takes file kept first):** his take
`MTchord55d` loaded first, so every new take carries HIS settings (the `ordinario` set, no folding, `ignore the score`). For each strike #0 …
#45 and each of `original` · `spread`: the drawer's own `select` → the voicing → the drawer's own `shuffle` on the seven players' rows only
(flute · clarinet · alto sax · the Vibraphone row · piano · violin · cello), the seed advanced at every try (from 116 on; the spread's own seed
advanced too) until all seven have a note, at most 60 tries, the best kept; a player still without a note takes a note nobody plays that it
reaches as written, else DOUBLES a note somebody plays (in its own octave where it reaches, else an octave away) — the drawer's own doubling
(`also`). Saved through the takes' own route, the comment saying the strike, the voicing, the seed and any doubling.
**The numbers:** 92 takes · all 92 cover the seven players · 72 by the shuffle alone · 20 with a doubling (59 · 60 · 61 · 90 · 91 · 100 · 101 ·
104 · 105 · 115 · 122 · 123 · 127 · 130 … 133 · 138 · 139 · 141 — the strikes with 2 … 7 notes, or with notes few players reach). Even numbers =
the original spread, odd = spread out; strike #k is `MTchord(56 + 2k)st` and `(57 + 2k)st`. His earlier takes untouched (checked against the
copy). Notes beyond the seven players' stay unplayed, as the drawer leaves them.

## §228. The tuplet workshop's clock moved into a worker; late notes dropped, never bunched (2026-11-19)

**His report** (in full in `docs/SWEEP_LIST.md`): the page went quiet mid-play, a blip when its server closed, blips still through the rack;
everything closed, the machine restarted. **No evidence, so no diagnosis** — but the first suspect is what the AI had just made, and reading
it showed a true weakness: `setInterval(tick, 40)` on the page, looking 0.25 s ahead. Chrome slows a page's timers to 1 Hz (later far less)
when its tab is behind another; every note that fell between two slow ticks then went out with a time already past — Web MIDI sends such a
note at once, so: silence, then a bunch. **Cured, whether or not it was the cause:** the 40 ms clock runs in a WORKER (not slowed with the
tab); a note more than 60 ms past its time is DROPPED and counted, the count shown under Play. Proven once on the throwaway port: 50 ticks
in 2 s from the worker, the playhead and the note index advancing, no tick after Stop. NOT explained: the blips after the page was closed.

## §229. The harmonic rhythm of the tuplet section, by ear and by rule; a brick of NOTE NAMES (SW-54 · SW-55) (2026-11-19)

**The chords of 291.8 → 324.3 placed in one sitting, his words in the sketch pad (SW-54 · SW-55). In order, with what each try taught:**
1. *Two buckets of beats at 68, a coin flip, the takes dealt without repeats* → `tools/harmony_fill.js` (the deck kept in the file). First
   draw, 1 beat or 1.5 … 3.5: nearly all one-beat chords. The AI had dealt from the 92 `st` takes only; he asked — corrected to the full set
   (his 52 and the 92: 144).
2. He kept the quick one-beat changes from 298.4 (the fast chunk) and slowed the beginning: 2 beats, or 2.5 · 3 · 3.5 — then *"jitter so
   they don't seem like the same length"*, a sixteenth either way.
3. Then BY EAR, on events of the players: 295.2 (a violin note) · 296 · 296.8 · 297.7 · 301.3 · 302.1 · 310.3 · 311.1 (two clusters).
4. Then BY RULE again, three kinds: a steady quick pulse (303 → 305.5: every 0.75 beat, a 32nd of jitter); a GROWING series (305.5 →
   311.9: 0.70 s, each next about a sixteenth longer, the step itself varied — 0.70 · 0.92 · 1.20 · 1.44 · the last run to the chunk's edge);
   and THE PACE BY BAND (311.9 → 317.6): fast = a change every beat (0.88 s), medium a sixteenth longer (1.10), slow another (1.32).
5. 317.6 → 324.3: *"GD, the fifths … spread and shuffle … every articulation per instrument, so they'll play a different octave if they have
   it"* — a new kind of harmony brick: `pcs` instead of a take (`tuplets.js` `keysAt`): on every strike the player takes one key of those
   notes in its technique's range, drawn by a hash of the brick, the player and the strike's time, never its last key. On the real strikes
   the flute's first run reads G6 D6 G6 D6 G5 G6 D5 D4 …, the piano's D4 G7 D4 D3 G5 D5 D2 G1 … (the piano's range is the whole keyboard).
**The page since §228:** an Undo (CTRL+Z, the file as it was before each change, 80 deep); no adding by double-click (an accident of his);
a notes-brick's own row (what it does · new draw).
**A slip of the AI's, caught at once:** the brick before 301.3 was dropped by a filter one hundredth too tight; put back.

## §230. The electronics heard IN the tuplet workshop; the technique named (octave scatter); the working copy's trap (SW-56) (2026-11-19)

**His words:** *"I like that technique. I don't know if we can give it a name or codify it somewhere … remember it and I can call on it"* →
`docs/TUPLET_WORKSHOP.md` (the workshop, its one file, the techniques by name; a pointer in CLAUDE.md); the name OCTAVE SCATTER is the AI's
proposal, his to change. Then: *"can I hear this in its own experimental file in the composer score with the electronics? Or is it very
complicated to put the electronics into the workshop … as long as it's synced in time? Well, you advise. I know last time you had said it's
better to put in the composer score, but evaluate and advise."*
**The advice, and why it changed since §221:** then he wanted one check of a result — the composer score, the real engine. Now he places
chords BY EAR against the beds, change after change; the composer route costs a render and a reload each time. So BOTH: the composer score
stays the true version; the workshop plays the beds itself for the working loop. His go: *"yes, go ahead … if it's not too difficult."*
**Built (the phase workshop's way, §188, made to read the save):** the server's `/beds` — the save's `elecMaterial` bricks that sound in
Section 3 (file · place in the file · start · end · trim) and `/fund/…` (Range); the page starts an `<audio>` per brick at the players'
start time, at the file position the score time calls for, a later brick on a timer, each paused at its end; a checkbox `electronics` and a
level slider. Six bricks listed (four sound after 269). Close to the composer score, NOT the engine: no fades, levels by the slider and the
brick's trim only, the start within the browser's audio latency. **Checked:** the list and a ranged request of a 63 MB file answer (206).
The sound and the sync are his ear's. **His server restarted once more for this.**
**A trap he met:** the experimental save, re-made by `tuplet_render.js`, showed nothing new in the composer score — every open goes through
the WORKING COPY (`…-X-tuplets-work.json`, from his first open), which was the old chord. The cure is the composer's own: File ▾ → Reload.

## §231. The beds' pitches under two gray stretches of Section 3 — measured (`tools/beds_pitches.py`) (2026-11-19)

**His words:** *"The four gray sections starting on 295.3 around, and then the four together there after that. Can you analyze the electronics
and see if there's any pitches going on during those four sections?"* — read as the two runs of single strikes: 295.3 → 298.4 (between the slow
and the fast chunk) and 300.9 → 303.0 (between the fast and the medium).
**The tool (new, reads only):** each material brick that sounds in the stretch read from the fund at its own place, summed with its trim; the
long-term spectrum (16,384-point Hann windows, averaged); a PEAK counts when it stands 9 dB or more above the median of the spectrum around
it — a pitch told from a wash; each peak as its nearest note, cents off, dB above the wash, dB under the strongest. Also per brick.
**295.3 → 298.4 (the beds at −18.9 dB):** a clear **E♭ with its fifth B♭** — E♭5 (−2 c, the strongest) · B♭5 (+3 c, 11 dB under) · E♭6 (−1 c,
14 dB under) · a faint C♯7 (−20 c). It is the brick G5 (lane 8); G9 has the same two notes smeared a quarter-tone either way; G8, just in at
296.25, has no pitch yet.
**300.9 → 303.0 (louder, −10.1 dB — B2 has entered at 300.78):** less of a chord: **B♭6** the strongest (−2 c, 13 dB above the wash), then
high partials G♯7 (−44 c) · A7 (+5 c); inside it G5 gives C6 (+16 c) · F♯5 · B♭6 · G6, G9 still E♭4 / E♭5 (a quarter-tone wide), B2 a noisy A7.
**So:** under the first run the electronics say E♭ – B♭; under the second B♭ is the one note that stands out, in a brighter, noisier field.
The chords now there (SW-54) were dealt without regard to this. Not listened to; the numbers are the spectrum's.

## §232. The beds' pitches, two more stretches; the gray strikes tuned to them (SW-62) (2026-11-19)

**Placed at his word:** an octave scatter on E♭ · B♭ over 295.3 → 298.4 and on B♭ over 300.9 → 303 (the chords dealt there by §229 given up).
**Measured next (`tools/beds_pitches.py`):**
- **305.5 → 307.4 (−10.2 dB):** C, G and B♭ over a low C — C3 (−34 c, the strongest) · C6 (+16 … +26 c) · B♭6 (−4 c, 22 dB above the wash:
  the clearest single line) · G5 (+13 c) · G6 (+21 … +25 c). Read as partials 1 · 3 · 7 over C (a dominant-seventh colour without its third),
  the upper notes a sixth of a tone sharp. Bricks G5 and G9 both carry the C6; G8 and B2 no pitch.
- **309.7 → 311.7 (−11.1 dB):** G♯ — G♯4 (+4 c, the strongest), and in brick G9 alone G♯2 · G♯3 · G♯4 · G♯5 (octaves of it); above, a bright
  cluster around B♭7 (+30 c) · B7 · D8 · G7, and C6 (+18 c) still in G5; B2 gives A7 · D7.

## §233. The beds under the G · D scatter (317.6 → 324.3) — is there a better fifth? (2026-11-19)

**His words:** *"the section starting on 317.5, the GD, new octave every strike, for that whole section all the way up to the F2 swarm 2. Let's
see if there's a better fifth that corresponds more with the electronics there."* **Measured in two halves (`tools/beds_pitches.py`):**
317.6 → 321.0 (−12.9 dB): a low D2 (−26 c; the strongest, but only 9 dB above the wash — a rumble more than a note) · **B♭6** three times
over (−1 … +17 c, 9 … 12 dB above the wash) · high B♭7 · D8 · B7; per brick: G5 holds C4 · G5 (+15 c), G9 D2 · C3 · G♯4 · G5, **B2 holds B♭6 and
F7 (+8 … +23 c)**. 321.0 → 324.3 (−16.8 dB, thinner): **B♭6 (+16 c) the strongest, F7 (+19 c) the only other peak**; the low D2 gone from the sum.
**Reading:** the one fifth present through the whole stretch is **B♭ – F** (brick B2, a sixth of a tone sharp). His G · D has some ground in the
first half (the D2 rumble, a G5 in two bricks) and none in the second. Put to him: B♭ · F for the whole stretch; or G · D → B♭ · F at 321.

## §234. The stacked fifths of 335.2 → 383 against the beds — an assessment, before and after (SW-63) (2026-11-19)

**His words:** *"for the stacked fifth sections starting around 335, I want to keep the stacked fifth, but for each of those sections, see if
there's a better fifth … up through at swarm 3 at 382.9. Just give me the assessment first … a row for each one … the start time, and then A,
E, B, that's the before, and then what you recommend the after should be."* Earlier the same hour: only the single strikes take the beds'
notes, never a tuplet chunk; and the AI's answers on this are to be short.
**The measure (`beds_pitches.py --fifths`, new):** under each `pcs` brick the beds' clear peaks folded to the twelve note names by power (a
peak over 35 cents off, or under 100 Hz, counted less); every stack of the same size scored by the square roots of its notes' shares summed
(so one loud note cannot carry a stack alone); "clear" when the best beats the present by 0.6 and the runner-up by 0.15.
**The rows (now → fits best):** 335.2 A E B → keep (quiet beds; a faint E6 and A7, both in the stack) · 341.08 F♯ C♯ → keep (C♯ heard) ·
342.6 C♯ G♯ → **D A** (clear: D · A · B♭) · 346.4 G♯ E♭ → **C♯ G♯** (clear: C♯ · B♭ · A · G♯) · 352.5 E♭ B♭ → **F♯ C♯** (clear: F♯ · C♯ · B♭) ·
356.2 B♭ F → keep (B♭ · A) · 360.0 F C → no clear pitch (0.7 s of wash) · 363.7 C G → B F♯ (slight: B · D · G) · 368.3 G D → B♭ F (slight:
B♭ · B) · 379 D A → B♭ F (slight: only F) · 382 A E → B F♯ (slight: only B). Not applied — his word first.

## §235. The stacked fifths of 383 → 415.2 against the beds — the assessment (2026-11-19)

`beds_pitches.py --fifths 383-415.2` (now → fits best · what the beds hold): 383 B F♯ C♯ (gray) → no clear pitch · 390.5 C♯ G♯ E♭ (FAST
tuplets) → C G D, clear (C · D · A · B) · 392.2 E♭ B♭ F (gray) → G D A, slight (D · A · B♭) · 397.4 F C G (fast tuplets) → G D A, slight ·
398.9 G D A (gray) → keep (D · F♯ · C♯ · F · A) · 405.3 A E B (fast tuplets) → B F♯ C♯, slight (B · C) · 407.1 B F♯ C♯ (gray) → G D A, slight
(D · F♯ · A) · 412.7 C♯ G♯ E♭ (fast tuplets) → B♭ F C, slight (B♭ · F · A) · 414.9 E♭ B♭ F (gray, a sliver) → keep. Around 390 … 408 the beds
sit on D and A throughout. By his rule only the gray stretches may change: 392.2 and 407.1 → G D A. Put to him; not applied.

## §236. The beds under the held B♭ (415.2 → 425.9), in five slices (2026-11-19)

His question: do the electronics' most prominent pitches change through that section? **Yes.** 415.2 → 417.4: B♭6 (−7 … +43 c, a band of
it) · 417.4 → 419.6: B♭6 still (+17 … +34 c), weaker · 419.6 → 421.8: the B♭ is gone — C♯7 (−30 c) · E7 (+22 c) · F♯7 (+13 c) · 421.8 → 424.0:
thinner and higher, C♯8 (+25 c) · B7 · 424.0 → 425.9: a band around C6 (−26 … +20 c, with a C♯6 a quarter-tone flat) · E6 (−27 c). So: B♭ to
~419.6; then a C♯ – E – F♯ region (F♯ · C♯ a fifth, E between); the last two seconds C with E. Put to him; nothing changed.

## §237. The harmonies of Section 3 kept; THE ELECTRONICS' SWELLS measured and drawn (SW-64) (2026-11-19)

**The harmony pass stands** (291.8 → 460.4; 460.4 → 480 still on D): bookmarked, and written into a composer save of its own,
`piece-Section03-I-harmoniesDone` (`tuplet_render.js --to`; 49 chunks · 162 harmony bricks · 4,606 notes; the fastest 10.00 a second).
**The swells (`tools/beds_envelope.py`, new):** the save's bricks summed (as `beds_pitches.py`), the mean power in 0.1 s steps; a FINE curve
(0.3 s smoothing) for the picture and a BROAD one (2 s) for the swells; a swell = a low point of the broad curve followed by a high point 6 dB
or more above it, with a 3 dB hysteresis. **Fourteen, start → peak (rise):** 269.0 → 279.6 (+34.5 dB, the beds' entry) · 281.7 → 284.9 (+7.0) ·
289.0 → 291.1 (+8.2) · 300.1 → 302.4 (+12.9, brick B2 enters at 300.78) · 322.1 → 325.1 (+6.2) · 339.4 → 342.6 (+19.3) · 353.0 → 357.5 (+18.3) ·
359.1 → 363.6 (+11.6) · 366.4 → 367.5 (+11.5) · 368.6 → 372.6 (+21.1) · 386.6 → 399.8 (+14.8, 13 s) · 411.7 → 413.1 (+8.3) · 438.9 → 451.9
(+19.1, 13 s) · 462.0 → 466.5 (+7.7). Several peaks sit on the form's own marks (341.08 the unison at 78; 372.1 the wall; 400.3 the unison at 90).
**The page:** a strip `El` under the players view (`workshop/tuplets/beds_envelope.json`, read as a static file — no server restart): the fine
curve filled, each swell drawn over it in orange along the broad curve, a dot at its start and its peak, both times written; a click sets the
playhead. Seen once on the throwaway port (the swells at 339.4 → 342.6, 353 → 357.5, 386.6 → 399.8 … in place); no console error.

## §238. The players' dynamics of Section 3 — by velocity, from the electronics' swells; no tests (SW-65 · SW-66) (2026-11-19)

**His frame, which decides the method:** a reasonable approximation for the demo, the written marks kept for the notation, and NO measuring
campaign (*"it takes hours, sometimes days … if worse comes to worse, I'll just leave it as is"*). So: velocity only (every voice of these
sets is a `loud: vel` voice — the dynamics law's struck kind; no curve channel, no CC7 lane touched), one rule, proven once by its numbers.
**The baseline (his question):** the beds' peaks stand at −8 … −9 dB, their median at −14.8 (one 6 dB step under), the quiet quarter under
−18.9. The players' baseline is his `mf` — under the electronics most of the time, so a swell has room.
**The plan, as data (`bank/tuplet_chunks.json` → `dynamics`):** `mf` from 277.8; each of the thirteen swells of §237 after the entry is `mf <
fff` from its start to its peak, then `fff > mf` within 3 s (or up to the next swell); before the three deep valleys a decrescendo `mf > p`
from where the beds begin to fall — 338.2 → 339.4 · 351.3 → 353.0 · 431.7 → 438.9 — and the swell then `p < fff`. 43 points, 30 marks.
**The rule (`tuplets.js`):** `levelAt` (a line through the points, in marks: p 3 · mf 4 · fff 7) and `velOf` with two scales — the
WORKSHOP's, sent raw to the rack (p 44 · mf 70 · fff 127: wide on purpose, so a swell is heard on short notes) and the SAVE's (his p 83 · mf
100 · fff 127, the phase form's own 100 = mf). The page sends each strike at its moment's velocity (the `vel` box now scales the whole, 100 =
as written) and draws the players' dynamic as a white line on the electronics' strip, the marks at its turns. `tuplet_render.js` writes
`recVel` per note and a marker per mark. In `piece-Section03-X-tuplets`: velocities 83 … 127, 2,471 notes at 100, 30 markers.
**Not done, by his word:** no listening pass, no level check against the beds, no balance of players and electronics (the piece's, later).
The workshop's two velocity numbers for mf and p (70 · 44) are a guess of the AI's — one place to change if a swell is too flat or too steep.

## §239. THE FIRST DRAFT KEPT; the notation's readiness reviewed by running it (SW-68 … SW-70) (2026-11-19)

**Two trials set aside by his ear:** dynamics by the strike (p · f · fff per strike in two tuplet chunks, SW-68) — *"let's not do that"*; accents
along the ensemble as one line, occasional with a cluster in the medium chunk (SW-69) — *"I don't think that works. I think the orchestration
is going to do the accenting."* Both are out of the data; their code stays inert in `tuplets.js` (`chunk.dyn`, `db.accents`).
**The first draft:** the workshop as it stands → `piece-FirstDraft-Final` (4,619 notes of the phase form with tuplets, harmonies and
dynamics; Sections 1 · 2 and the bricks carried from `piece-Section03-H-addTuplets`); the workshop's bookmark `2026-11-19 first draft final`.
Still owed in the music: the chords of 460.4 → 480; the beds' ending.
**The review (`docs/NOTATION_READINESS.md`) — done by running the notation's tools on the draft, at his "fairly careful":** `check_rules`
31 / 32 (the red wants a just-intonation sequence page) · the registry holds eight parts, the composer twelve lanes since §110 · an
extraction with every lane is REFUSED by the page format (`source.parts` up to 9; the electronics lanes are 8 … 11) · the eight players'
lanes alone extract and validate (285 → 305 s: 325 events, 39 chunks, many short notes reported at rung 8 — they spill their lanes) · the
whole draft stops at `slap_exploding` (CL-5: no rule claims it) — six techniques of the draft are unregistered · the material brick has no
drawing in the notation at all (the sine zone has) · the short articulations have no measured sample length (a warning a note). The
registry's `metaLayer 8 · curveLayers 9 10 11` are stale (12 · 13 14 15); `notate_section` reads the lane count from the save, so the
players extract — but every other reader of those numbers is to be READ, not grepped (H6-13).
**Read as:** no broken port; the remainder is what the protocol left for the first real music (6.4 the app-written page with real kinds ·
6.5 the print page · 6.6 the main file · container 8) plus the one structural change made since the set-up — the four electronics lanes.
His two notation questions: the tuplets on a proportional score; the dynamics. The two test pages the review made were removed.

## §240. The notation phase opens: the staff throughout; the first working page (SW-71) (2026-11-19)

**His method for the notation (SW-71):** section by section; settle the paradigm on one case, then propagate. The electronics are a TAPE PART
— one half-height lane in the conductor's score with the mix's waveform, a placeholder for now. First case: the alto sax's first note.
**The working page `s1-sax-first-note`** (`notate_section --score piece-FirstDraft-Final --w0 14 --w1 26 --parts 2`): the note `wc-94` (F4,
16.0 → 23.55 s, +18.6 c) and its sine brick, both still unresolved (parachute bricks) — nothing notated, at his word.
**His first look:** *"there are no staff lines?"* — the rule row `staff … ensemble` still carried piece 6's ranges (a staff only in ITS beating
section, 423.3 … 668 s; 0.25 s of lines at a page's start, then none: that piece is graphic). CHANGED THE ROW, not the code: `ranges: [{ fromS:
0, to: "end" }]` — the staff throughout; `ENGRAVING_RULES.md` regenerated; `check_rules` 31 / 32 as before. Seen on the throwaway: the test
page's staves run the whole width. *The same family as piece 6's own §45 (a staff that lost its lines after the clef): a rule row carried
whole holds the last piece's times.*
**The lineage of the gliss figure, reviewed for him:** the quartet — a gliss line note to note · the tubas — a header whose short gliss line
slopes to show the direction, then the curve · the septets (pieces 4 · 5) — the morph header (two open heads in time order, a gliss line, the
cents over the destination) before the go line, then the orange gliss curve and its meter (`byEnv.morph`) · piece 6 — the sine tone's unit
(`byEnv.sine`: the pitch header, the box the sine's length with the go line inside, the player's line, the audible-beats badge). This note
needs a gliss figure AND the sine at once — no earlier piece joined them.

## §241. The page's furniture, two rows: the dividing lines from the staves; the end line only at the end — and his word on the review (2026-11-19)

**His eye on the first working page:** the dividing lines between the parts *"pierce the brackets … they don't look quite right"*; a line at
the right end of every page — *"I know we decided something about the ending line for each page."* And, while the fix ran: *"these were the
types of issues I was hoping to avoid … this is what I meant by doing a careful review of the other scores. I just want to make sure we have
all the parts in place and you're not just making up new now … I'm sure there was a precedent for that … if little problems like this keep
cropping up, let's develop a better review."*
**What the lineage holds (read, both rows compared across pieces 5 · 6 · 7):** THE DIVIDING LINE (`objects.laneLine`) exists since piece 6 only
(DEC-88, "the string quartet's look"), drawn from the page's LEFT MARGIN — in piece 6 the lanes had no staves there, so nothing was crossed;
carried here unchanged, it runs through this piece's brackets, brace and names. THE END LINE (`systemEndBar`): on the SCREEN and the FILM every
page has had an edge bar at its right since piece 4; what was "decided" is the PRINT's (piece 5 §772 · piece 6 §411 · §476): no edge bar on a
print page, a final bar line only where the piece ends. So neither was made up here and neither was broken by the port — both are the last
piece's page on a different kind of score. **The AI's miss:** the readiness review (§239) ran the tools and never LOOKED at a page's furniture.
**Changed as rows (with the one reader each):** `laneLine.from: "staff"` — the line begins at the music's left edge (`view.musicX0Px`);
`systemEndBar.everyPage: false` — the line stands only on the page the material ends on (the print's rule made the screen's too; `static_page.js`
and the app's own copy in `notation.html`). `check_rules` 31 / 32 as before. Seen on the throwaway's test page: the lines start at the staves,
clear of the brackets; no line at the right edge.
**If more of these come:** the proposal put to him — before he sees a section's first page, the AI goes through the page's furniture item by
item (names · brackets · brace · clefs · staves · dividers · edges · the cursor · the lanes' heights) against the last piece that had staves
throughout (piece 5), and reports the differences as a list.

## §242. The furniture check against piece 5; the electronics' placeholder lane (2026-11-19)

**The check he asked for (§241), done as a comparison of every furniture value** — the two registries' leaves whose names say label · bracket
· brace · margin · gutter · lane · clef · staff · cursor · frame · pad · gap · edge, this repo against piece 5 (`septet_LGMF_2026`, the last
piece with staves throughout): `container.json` 17 differ, `rules.json` 36. **Every one is piece 6's addition or this session's two rows** —
the dividing line (piece 5 had NONE; piece 6 introduced it), the staff rule's row `ensemble` (now "throughout"), the sine box · the electronics'
window and bracket · piece 6's badges, state signs and language names (data unused until a page asks for them). Two values piece 5 had are
gone since piece 6: the trill pitch's `groupPadSs` · `accPadSs` (piece 6 re-made the trill; to be read when a trill is first notated here).
**The names, the brackets and braces, the margins and the gutter, the clefs, the lanes' weights, the cursor: identical to piece 5.**
**The electronics' placeholder (SW-71):** `ensemble.json` part 8 — `elec1`, weight 0.5 (half a player's lane), `staff.hidden`, no clef; the
other three electronics lanes are not parts (the tape part is their mix; its waveform is not drawn yet). The registry's stale layer numbers
corrected on the way (`metaLayer 8 → 12`, `curveLayers 9 10 11 → 13 14 15`: the notation app reads `metaLayer` for its META overlay — with 8 it
would have taken the first electronics lane for META). A nine-part page extracts and validates (`s1-opening-furniture`, 14 … 26 s).
**Seen on the throwaway:** nine lanes; the last one half as high, no staff, its short name `E1` at the left, a dividing line above it; the
dividers begin at the staves; no line at the right edge. The name `E1` is the composer lane's own (the registry must match the score's
tracks) — a display name for the tape part is a row to add when he names it.

## §243. THE RULE: a page with staves has no dividing lines; ELEC and its bracket; the gliss "as before" on the sax's first note (2026-11-19)

**His word (the sketch pad, SW-71's last entry):** the dividing lines were piece 6's because its lanes had no staves — *"when there's staff,
we don't need a dividing line. The staff version of the score should look just like any concert score."* **As a row:**
`objects.laneLine.onlyWithoutStaff: true` — a page that shows any staff draws no divider; a page without staves keeps them (`render.js`, the
one reader). The electronics' lane: the page's name **ELEC** (a new optional `name` on a registry part — `short` stays the composer lane's
`E1`, which the registry check compares) and its own bracket (`groups`). `check_rules`'s furniture test taught the name form.
**"How did we show the curve before?"** — shown ON HIS NOTE rather than described: a trial copy of the draft (`scores/x-notation-trial.json`,
the AI's; `wc-94 … 96` given the group `sax-gliss-1`) and the lineage's own command, `notate_section --morph sax-gliss-1` → the working page
`s1-sax-gliss-as-before` (14 … 36 s, the alto sax): the septets' MORPH BLOCK as it stands in this engine — the go line at the note's start;
the ORANGE GLISS CURVE running on from it (scale `travel`: the part's own travel fills the top of the lane; here 44 cents over three
breaths); under the staff, before the go line, the pitch figure (two heads and a gliss line, start → destination) and the dynamic figure
(the block's default, niente → fff — the septets', not this piece's). The tool reports one unit at rung 8 (the dynamic figure spills the
lane's bottom) and `check_rules` flags the page's header heads as beyond the ottava threshold — both are the old figure on a new lane, left
as they are: the page is there to be LOOKED at, not kept. `check_rules` otherwise as before (the sequence check still wants a page).

## §244. The beating gliss, begun again from nothing: the go line and the written pitch before it (2026-11-19)

**His correction of the AI's course (the sketch pad, SW-72's last entry):** shown the septets' block and piece 6's sine sign on his note, then
told the new figure was "an hour or two of careful work" on the drawing code, he stopped it: *"I'm a little surprised that if I want to build a
new notation, it has to be like a system overhaul … let's just build the actual notation … get rid of everything. Let me just see the go line
and the pitch the saxophone will play to the left of the go line."* **The AI's error was one of FRAMING, and the fix shows it:** the figure
was treated as a variant of the big morph block; taken one element at a time it is small. The element he asked for took ONE line in
`layout.js` — a device flag `headBefore` that calls the sequence block's own `justHead` (an open head at the written pitch on the staff, its
right edge a standard gap before the go line, accidental · ledgers · ottava fold included) — and one hand on the page tool:
`--hand wc-94:{"goLine":true,"headBefore":true,"brick":false}`. The working page `s1-sax-first-note` now shows the alto sax's staff, the go
line at 16.0 s and the open head before it, nothing else (seen on the throwaway). The two comparison pages (the septets' block; with piece
6's sine sign) are removed from the picker. DEVICE SHEET 1 stays as the list of elements still to add, one at a time, at his word:
the gliss line rising from the head · the one pitch curve · niente → fff · the badge · the sine's own sign (his to think about).
**For the method:** a new sign is built on the working page element by element with `--hand` and small device flags; it becomes a named
device (a row set in `rules.json`) only once he has settled it — the device sheet's "lock", not its start.

## §245. The beating gliss, elements 2 and 3; the percussion staff cut to four (2026-11-19)

**Element 2 — the gliss line** (his: "one note head and the gliss up … the same width … up to about a third … a standard space and then the go
line"): device flag `glissUp` — the septets' chain with the destination head out. **His eye (a screenshot): TWO heads** — the page's ordinary
note already draws its own head before the go line (`byTechnique.ord`: `nhUnit`); the new head stood beside it. Cured on the hand
(`nhUnit: false`, `dynMark: false`): the ONE head is the new one. *The lesson, and his words with it:* "as much as possible, we should be
using whatever standards are in place and not just free drawing these things."
**Element 3 — niente → fff with the arrow, "in its standard location":** device flag `dynFigure` — the tubas' / septets' header figure taken
number for number (the dynamic row `dynY`; the arrow's `objects.dynArrow`; the circle's `sectionHead.circleDiaSs`; right to left from the
go line: spacer · the end mark · spacer · the arrow · spacer · the circle; lowered a spacer under the head's low ink where that reaches the row).
**The page tool's hand for the case:** `--hand wc-94:{"goLine":true,"headBefore":true,"glissUp":1,"dynFigure":"fff","nhUnit":false,"dynMark":false,"brick":false}`.
**The percussion staff:** the draft plays four instruments (201 … 253 s): spring coil · China cymbal · brake drums (two beaters) · bass drum
(two beaters). The staff carried from piece 6 had eight lines, two of them used. Cut to FOUR at his word (`ensemble.json` part 3; the old
lines kept in `_staffWas`; weight 1.18, the AI's, by height). Seen on the throwaway: one head, the slanted line, the go line; the circle,
the arrow and fff under the staff; the percussion staff four lines.

## §246. The beating gliss, element 4: the orange pitch curve on the whole lane (2026-11-19)

**His word:** *"now add the orange pitch curve, full lane height."* The lineage's `glisscurve` (the pitch's orange, `objects.glissCurve`) with
one new field, `band: 'lane'` — the curve's floor is the lane's bottom edge and its top the lane's top (without the field: the top half,
the bottom being the crescendo's, as the septets drew it); device flag `pitchCurve` = the samples. For the case: `wc-94`'s own bend from the
save (0 → 18.6 cents over 7.55 s), 48 points, 0 … 1 of the note's travel — so the curve says the SHAPE of the glide; the lane's height is
this note's travel, not a number of cents. Seen on the throwaway: the fill rises from the lane's floor at the go line.
**Still by hand:** the samples are computed outside the page tool and passed in the note's hand; when the figure is settled the tool reads
them from the save itself.

## §247. The beating gliss: the second note; the curve read from the save; the moving meter on the whole lane; the cursor checked (2026-11-19)

**His words:** *"can you build the second note … and can you make the curve follower the right color and to actually follow that curve full
height?"* · *"can you double check the cursor's the same color it always was?"*
**The curve is now the page tool's own:** `notate_section --pitchCurves id,id,…` writes one `gliss` overlay per named note (`band: 'lane'`,
64 samples of the note's own bend from the save) — the layout's curve AND the animated meter both read it, so they cannot differ. THE SCALE
IS THE GESTURE'S: the notes of one gesture (the same sine brick and pair) share one travel — here 44.1 cents over three breaths — so the first
note runs 0 → 0.42 of the lane and the second 0.45 → 0.91: a second breath begins where the first stopped. (Until now the single note filled
the lane with its own 18.6 cents; said to him, his to reverse — the other reading is one breath, one full lane.)
**The moving meter** (`glissMeter`, the lineage's: an outlined bar left of the cursor whose fill is the curve's height now, the pitch's
orange `#F04B00`): `band: 'lane'` in `animobj.js` — the bar spans the whole lane. Seen on the throwaway at 18.3 s: the outline 126 px (the
lane), the fill 16 px, beside the cursor.
**The cursor:** `#FF15A0`, 3 px, opacity 1 — the same row, value for value, in pieces 5, 6 and here (`colours.cursor`, his D48 of piece 4).
**The second note** (`wc-95`, 23.99 → 30.84 s) carries the same hand as the first — the head, the gliss line, niente → fff, the go line.
The working page `s1-sax-first-note` now runs 12 … 31.3 s.

## §248 · 2026-11-19 · the beating gliss is ONE GESTURE: one header, one smooth curve, go lines at the re-breaths

**What prompted it (his words):** "this is not so different from a lot of the morph sections where it's one continuous gliss, and those are just rearticulations. So we would just get go lines every time there's meant to be a new breath, but just one pitch … each gliss is one thing. So it would get a header, a one continuous curve all the way to 35. And then at 35 … it's a new entity, a new curve, a new header." Then: "the curve has reverted to the half height curve … It's meant to be the full lane." Then: "The curves are meant to be smooth. There seems to be a little divot there at the breath line. No divots, just smooth curve … all the morph sections have our standard habits of behavior."

**What was wrong:** §247 built a header per breath and one curve per note. That ignored the lineage's own rule (`NOTATION_STANDARDS.md` §3, the morph section: a header at the entry, one go line per breath, one gliss curve), which the AI had read and not applied. The "half height" was the per-note curves on a shared scale: the first breath's curve reached only 18.6 of 44.1 cents. The "divot" was the AI's first gesture curve holding flat through each breath gap.

**What was built:** `tools/notate_section.js --glissGestures id,…`. A gesture = the notes of one sine brick and pair (`properties.sine`). Its first note carries the header (head · gliss line up · niente → fff). Later notes carry a go line alone. ONE pitch curve from the first start to the last end, on the whole lane, floor = the gesture's lowest pitch, top = its highest. Across a breath gap the curve runs straight on from where one breath stopped to where the next begins (the save's own numbers: 18.6 → 19.7 c; 40.3 → 41.9 c).

**The page:** `s1-sax-first-note`, 12 → 53.4 s, the sax's first two gestures. Gesture 1: 16.00 → 34.50, re-breaths 23.99 · 31.33, 44.1 c. Gesture 2: 35.50 → 52.60, re-breaths 43.20 · 51.04, 29.5 c. Looked at once on the throwaway: two headers, go lines alone at the breaths, each curve smooth to the lane's top.

**The remedy for the missing background (his question):** before a section's first page, the AI reads `docs/NOTATION_STANDARDS.md` for that KIND of material and states in one line which standing rule it will follow, then builds. Written into `docs/NOTATION_SCHEME.md` §0.

**Next, his:** the sine tone on each part's lane (his words: "It's not part of the electronics below … each part will have its own sine tone. And for the percussion, the sine tone glisses rather than the percussion instrument"). Piece 6's purple box (`NOTATION_STANDARDS.md` §7, `--sines`) is the machinery in hand.

## §249 · 2026-11-19 · the beating gliss: the small badge, and the sine tone as a purple line on its player's lane

**His words:** "let's do a badge at the top of the lane to the left of the go line with the same space there you use, just a standard space, horizontal gap. And let's make it quite small … about 60% of what the one in approaching was. And then we'll just designate the sine tone with … that purple color, same transparency, everything as approaching, no outline, and the same height as the duration lines we use … let's just have that run at the top of the lane, like from the middle of the badge about, so it's a little below the top. And let's have it be the same coordinates as the curve … Its X1 and X2 should be the same as the curve." The sine's earlier start in the composer score (its fade in) is his to work out with the electronics.

**Built, from what stands:** the badge is piece 6's audible-beats badge (`language.types.beats`), in the lane's top row, at 0.6 of `objects.badge.sizeSs`, its right edge the header's own space (`nhGapSs`) before the gesture's first go line. The sine tone is a new long kind `sineline`: a plain bar in the sine box's purple at its fill opacity (0.18), no outline, the duration line's height (`objects.ringBar.hSs` 0.667), its center the badge's center, its ends the gesture curve's ends. One row `objects.sineLine` in `rules.json`; `container.json` · `page_rules.json` (cut like paper) · the IR schema's overlay kind `sineLine`. `--glissGestures` writes both per gesture.

**Seen once on the throwaway:** the badge left of the first go line at the lane's top; the purple line from the go line onward through the badge's middle.

## §250 · 2026-11-19 · Section 1's sine tones, every part; the crotales, where the SINE glides

**His words:** "that looks good. You can do all the rest of the parts in the same way for that whole section. And with the crotales, let's make the purple line the same thickness as the badge, except we'll just turn that purple line into a curve. And you won't have the header for the crotales. You'll just have the pitch, but you'll have the dynamic and no glissando line. And can you put a text there above or below, wherever it belongs, the first pitch, and just say crotales? And I think we have some precedents there for how to name the percussion instruments in staff. It might be piece number 2."

**Built:** `--glissGestures all` = every gesture that begins in the window, every part. The page `s1-sines`, 12 → 146 s, parts 0 … 8: 48 gestures (the pairs to 96.6 s, then the five dictated chords 101.3 … 144.45). A gesture whose `properties.sine.who` is `sine` (the crotales, lane 4) is written the other way round: the pitch before the go line, ONE dynamic (the brick's own mark, mp — device `dynPlain`), no gliss line, no figure, no orange curve; the word "crotales" (the engine's standing technique word, device `techText`); the badge; and the sine's own glide (the brick's `elec.gliss`, 3.9 … 10.4 cents) as a purple CURVE in the badge's band — the line's height where the sine has not moved, the badge's whole height at its furthest (`sineline` with `samples`).

**The precedent read (piece 2, `NOTATION_SYSTEM_PLAN.md` · `NOTATION_MODEL_SYSTEM.md`):** the instrument's name at its FIRST appearance only, not repeated while the instrument stays; in a small-caps label font (Cormorant SC Light, 1.1 ss). This engine has no such font; the word is in the engine's own technique-word style, at every crotales gesture. Put to him.

**Seen once on the throwaway (two pages):** the players' gestures as the sax's. On the mallets lane, which is low, the badge lies on the staff's top lines and the fit moved the mp above it (the tool's own report: rung 3 at each crotales entry). Put to him; no rule made.

## §251 · 2026-11-19 · Section 1's dynamics corrected: one swell into ff for the opening; p → fff for the single crescendos; "crotales" once

**His words:** "Yes, first entry only. And then I'm in error about the dynamics … at least for that first chunk, all the way through to 96 seconds, it just crescendos into, I'm going to say 2Fs, and then holds at 2F all the way through … let's take away that dynamic with the arrow, and … just to the right of the go line, just at the first instance, the onset … have the niente sign, have a hairpin that lasts about 1 or 1.5 seconds, and then the 2Fs, and then that's it for that first chunk. And then after that, starting at about 101, those are all individual crescendos … let's do the P to arrow to FF, I think. Can you look it up if I talked at all when I was composing … about what those dynamics should be?"

**What the record says (SW-24, 2026-11-09):** "Let's do from piano to — I think three Fs is the loudest, right? — to whatever the loudest dynamic. We'll crescendo both the sine tone and the instrument tones." So the crescendos from 101.3 s were composed p → fff, and the save sounds that way. Built as the record has it (p → fff), put to him against his "P to FF, I think".

**Built:** device `dynSwell {to, s}` — right of the go line: the niente circle, the standing timed hairpin (1.25 s), the mark. `dynFigure` may now begin on a mark (`{from:'p', to:'fff'}`). In `--glissGestures`: a part's FIRST gesture of the opening carries the swell into ff, its later gestures to 96.6 s carry no dynamic; each 'dictated' gesture (101.3 … 144.45) carries p → arrow → fff before its go line. The word "crotales" at the first crotales entry only (piece 2's rule). The crotales' own mp left as it stood.

**Seen once on the throwaway:** the sax's first entry (circle · hairpin · ff right of the go line) and the chord at 101.3 (p → fff in three parts).

## §252 · 2026-11-19 · the crotales take the same dynamics as the rest; the space before "crotales"; one sheet for the beating gliss

**His words:** "let's keep as composed and the crotales should be the same. They should have that just like the other ones. The hairpin P to FFF with the hairpin in between. And take away the MP. And … there's meant to be some space … between the go line and the left of the word, crotales. But I guess what is a bigger issue is just we should have these standards in place. But it's fine. Let's put the space there and just try to … have some consistency about the way we're applying notation."

**Decided:** the single crescendos stay p → fff (as composed, SW-24). The crotales carry the SAME dynamics as every other part (the swell into ff at their first entry; p → arrow → fff from 101.3 s); the mp is gone.

**Built:** the dynamics rule moved ahead of the who-glides fork in `--glissGestures`, so one rule serves every part. "crotales" stands the house space (`nhGapSs`) right of the go line (device `techTextGap`). Two faults met and fixed on the low, joined mallets lane: (1) the dynamic row spilled 1.7 ss past the lane and the fit ladder split the figure (the circle flipped to the top) — a nudge of 1.3 ss up, the ladder's own rung 4 (`dynNudgeSs`, `--crotDynNudge`); tried first and rejected: a lane weight (a joined lane ignores it). (2) the badge lay ON the crotales' note head (found by reading the page's own boxes) — on that lane the badge stands left of the head (`gap: 'nhHead'`). The fit report: every unit at rung 0.

**For consistency (his "we should have these standards in place"):** the beating gliss written as ONE sheet in `docs/NOTATION_SCHEME.md` — the players' column and the crotales' column, row by row.

**Seen once on the throwaway:** the crotales' first entry — badge · head · go line · "crotales" · circle, hairpin, ff on one row.

## §253 · 2026-11-19 · no follower on the crotales; the fade at 96.6 s taken out (a copy of the save); the sine tones' sound in the notation page — status

**His words:** "can you take out the curve follower from the percussion? It doesn't need it because it's just a sine tone. And then … how do we get the actual sine tones in here? … I might want to put the electronics mix in eventually. And … at the end of that first section, there's a weird fade out. Can we just have them go, full volume, 2 Fs until the end, and then just cut at the end? … I didn't realize that was there."

**The follower:** the crotales' notes carried the generic hold wedge (`animobj.js`, `s1-hold`). A device that says `follower: false` now rides nothing; `--glissGestures` sets it (with `curve: false`) on a gesture whose sine glides.

**The fade:** in `piece-FirstDraft-Final` the last note of each of the six parts (wc-165 · 166 · 168 · 169 · 171 · 173, all ending 96.6 s) had its level drawn down to 0.05 over its last stretch, and the six sine bricks ending there had `fadeOutMs` 2000. A COPY, `scores/piece-FirstDraft-Final-B-noFadeAt96.json` (his save untouched): those six notes held flat at their level to the end; the six sines' fade out 0 (in `elec` and in `properties.beat`). The page `s1-sines` is now built from the copy.

**The sine tones' sound, status:** the notation page plays by MIDI, or slaves its clock to an audio file in `notation/audio/<save name>.wav|mp3` (its "♪ render" button). The sines are made live by the engine and are in neither. The offline chain (`elec_offline.js`) renders the material bricks only, not the sine bricks. The way in: render the players through Reaper (the chain in hand), synthesize the sine bricks offline from the save (pitch · glide · level · fades), mix, and put the file where the page finds it; the electronics mix joins the same file later. Not built — put to him.

## §254 · 2026-11-20 · Section 2, the piano solo: black note heads in two hands; the audio by stems (held); a carried fault in the page tool

**His words:** "let's just move on with the notation … maybe we generate everything as its own stem audio file, because I think we need to do some work on the MIDI volumes as well, but maybe each part can be its own stem, and then the sine tones can be their own stems as well. And I can just mix everything in Reaper. But for now, I don't necessarily need the preview … as long as I can basically hear the MIDI. So I think next is the piano solo. I want to develop a new kind of style of notation for this. Can you just put the black note heads … they're sort of tight formation, but I don't think I ever crossed hands, and so they should fall into left and right hand parts. See if you can't tease that out. I think there's a pretty clear line. Maybe it's like the B or the B flat … put the left hand in the lower staff. You might have to change it to treble clef … Actually, never mind on the stems. Let's just do note heads for now."

**The material:** the piano lane, 148.2 → 251.7 s, 1058 notes (main 1031 · plucked 15 · muted 12), played in live in layers (SW-28); most between D4 and F6.

**Is there one line between the hands? Measured — no.** A fixed split was tried at every pitch from A♭4 to A♭5, counting the moments (0.35 s) where one hand would have to stretch past a ninth: at B♭4 / B4 (his guess) the right hand is too wide 431 / 412 times; the best fixed line, E♭5, still 127. The largest gap in the pitches moves from window to window (no valley in the histogram). So the hands are DEALT, chord by chord.

**The deal (`--pianoHands <part>`):** notes within 0.08 s are one chord; its pitches, low to high, are cut at ONE point — low side left, high side right, so the hands never cross. The cut that costs least is taken: a hand stretched past an octave costs most, then each side's distance from where that hand last was (a running center per hand, starting F♯4 and A♭5). Result: right hand 528, left hand 530, NO chord where a hand passes an octave.

**The page `s2-piano-solo` (146 → 253 s):** each note on its hand's staff (an engraving overlay's new `staff`), the lower staff in treble for this page (a new overlay kind `staffClef`, applied to a copy of the ensemble — the registry untouched), a filled head alone: no stem, no dynamic, no let-ring slur. `--alone 146-253`: no pulse is read into freely played notes.

**A CARRIED FAULT FOUND AND FIXED:** `notate_section.js` applied the ensemble's rules only when the save had exactly as many lanes as the registry has parts. This piece's save has twelve lanes and nine parts, so for EVERY page so far the chords were not grouped and the ranges not checked. It showed here as 261 validator findings (chords cut out of their own chunks). The test is now "every registered part is the save's own track of that number". `s1-sines` rebuilt under it: valid, every unit at rung 0.

**Held, his:** stems (one audio file per part, the sine tones their own) to mix in Reaper, with work on the MIDI volumes; the stems / beams of the piano solo ("I have to figure out").

## §255 · 2026-11-20 · the piano solo, unit by unit: the first three figures; half-size heads; the heads' places against the MIDI

**His words:** "Is there a slightly smaller notehead? … we'll just take this unit by unit. The first should be downstem. Most of the bottom ones will be downstem, and the top staff will be upstem. And then the arpeggio line. I think that's from piece number 2. You can put that on that first gesture. And then the second one stems up the three notes, the one, the B in the top staff, and then the two, the chord in the bottom staff. Just beam those together, 16th note beam, stems up … a decent up stem and then a really long stem from the bottom two notes. And then the third figure is like the first one, single stem up, 16 flag, and the arpeggio line … from the top note, the F and the F sharp, just above that, down to just below the G." Then: "we have a very small note head … reduce the size of the note head … to maybe about 50% … and accidentals just do the same. And can you confirm that the rhythmic locations are precise? … the left edge of the new note head … should line up precisely with where the MIDI says it should be on the timeline."

**What the engine had:** a smaller head (the cue head, 0.844 — piece 2's, by way of piece 4); stems, flags, beams as primitives; a cross-staff beamed group (2i.4) — but every note draws its OWN stem (the engine was built on single lines); no chord on one stem, no stem through both staves, no arpeggio. **Piece 2's arpeggio read** (`tools/notation_studio/engine/arpeggio.js`, its session 66): a stack of LilyPond's arpeggio unit, one per staff space, RIGHT of the chord ("arpeggio symbol always on the right"), 0.225 ss from its ink.

**Built — THE HAND UNIT** (`layout.js`, after every staff is laid out; the row `objects.handUnit`): notes that share a unit are one figure whatever staff each head is on — ONE stem through all its heads (up or down), a 16th flag, or two beams to the other units of its beam group (every stem up to one level line), and an arpeggio line the height of its heads plus 0.75 ss each end, right of the chord (piece 2's rule and gap; drawn with the engine's own wave, one wave a staff space). The heads stay the note unit's own. The units are a hand file beside the page, `notation/hand/s2-piano-solo.units.json`, one entry per unit, added as he names them. The first three: (1) 148.20 s, four notes on the lower staff, stem down, flag, arpeggio · (2) the B at 148.61 beamed to the chord at 148.71, stems up, the long stem from the lower staff · (3) 149.09 s, F · F♯ above and G · A below, one stem up, flag, the arpeggio across both staves.

**The heads:** 0.5 of the normal head, the accidentals 0.5 (`nhHeadScale` · the new `nhAccScale`; row `handUnit.headSize · accSize`). Stems, flags and beams are still full size.

**ARE THE PLACES PRECISE? Measured:** the piano's device puts the head's LEFT EDGE on the onset (D49, `nhAnchor leftEdge`, at the head's own scaled width). But the chord rule was pulling notes within 50 ms of each other onto one column: 642 of the 1058 notes drawn EARLIER than played, 20.7 ms on average, 50 ms at most. Changed: a note outside a unit is no chord member — every such head's left edge is on its own onset. A unit's heads share the unit's first onset (they are on one stem): unit 1's four notes span 29 ms, unit 3's 6 ms.

**Seen once on the throwaway:** the three figures as described. A red "fit?" stands by the first figure: the layout's own flag that it could not place that unit by its ladder (4 units on the page, rung 8). Left for his eye.

## §256 · 2026-11-20 · the piano figures rebuilt ON THE STANDING RULES; the LilyPond arpeggio from piece 2; figures 4 and 5

**His words:** "No, those look like hand-drawn lines … Could you grab the ones that we got from Lily Pond? This is in the two piano piece … And then can you do a more careful scan for all the sort of engraving rules we've come up with through the pieces? … there's some rule about the stem, minimum stem length, and with flags clearing by a certain amount, the staff lines … I shouldn't have to go through this middle stage where I have to … look at hand-drawn arpeggio lines and missed rules … It looks like this is just a little bit improvised, like kind of made up. So let's stick to the engraving rules. Let's get them all. Let's stick to them. And where there isn't any, let's discuss … the flags aren't clearing the staffs and the stems are too short. The arpeggio lines aren't right … The spacing isn't right. It's touching the flag … those ones, the three you've done so far, instead of being at their precise rhythmic location, let's just make those all part of the same column … if the notes are vertically too close together, there's these offset rules … eventually I'll make the note heads bigger … the fourth figure, let's make that stem up, 16th flag, and all of those notes the same column … The sharp for the F sharp is too far … I don't think any of these are mistakes that should be made at this point." Then: "the next figure will be at 151 … push the … C, in the bottom staff … into the same column as the top staff, all those notes … 8th note, flag, stem up, connected, and arpeggio, covering all the notes."

**What §255 got wrong:** it drew the unit's stem, flag, beam and arpeggio with its own numbers and the engine's hand-wave stroke. Every one of those already had a rule.

**The scan (what was found, and where):** `docs/ENGRAVING_RULES.md` rows `stem` (3.5, to the middle line) · `flag` (clears the staff by 0.38; max 10.5) · `beam` · `accidental` (0.1 beside the head in a column, 0.2 between two, the natural in the column) · `chordColumn` (piece 2's locked chord rules, ported as `chord_column.js`: a head a step or less away steps to the other side of the stem; the accidentals packed) · the beam at the flagged stem's height (#4 day 23). In piece 2: the LilyPond arpeggio unit (`tools/notation_studio/engine/glyphs/arpeggio_paths.json`), stacked 1 ss, RIGHT of the chord, 0.225 ss from its ink (`CHORD_SPACING_RULES.md` §5c.D). All of it written as one table in `docs/NOTATION_SCHEME.md` § 2, to be read before any figure.

**Rebuilt:** the hand unit now computes ONE column for all its heads on both staves with `ChordColumn.noteColumn` (by the unit's stem direction) and packs the accidentals with `ChordColumn.accidentalColumn` at the accidentals' own small size (the F-sharp's sharp had been packed at full width against half-size heads — "too far"). Stem, flag clearance and beam height by the standing functions and numbers. The arpeggio is LilyPond's unit (now `glyphs.json arpeggio.unit`, a new item kind `arpeggio`), ceil(span) + 1 units centered on the chord, right of the chord's rightmost ink — the flag's edge where the flag hangs beside it. The row `objects.handUnit` holds only the head size and piece 2's arpeggio side and gap; the rest are pointers.

**Figures:** 4 — 149.98 s, three notes, stem up, 16th flag, one column. 5 — 151.04 s, the five on the upper staff and the C of 151.17 on the lower in one column, stem up, an 8TH flag (his word), the arpeggio across both staves.

**Seen once on the throwaway:** flags clear the staves; the columns step aside at seconds; the arpeggios are LilyPond's and clear of the flags. The red "fit?" still stands by figure 1 (the lane's room; his).

## §257 · 2026-11-20 · the five figures at full size; figure 5 a 16th; THE FLAG RULE MEASURED on the page; a longer-stem rule put to him

**His words:** "we can convert those first 5 figures to full-size note heads, and just if you can push everything over. And then, yes, that's meant to be a 16th flag. And let's discuss the stem length. Just confirm that you found the rule and are applying it. It doesn't look like you are … for example, that first figure. It was something to do with like the top of the flags. And just confirm we're using the right flags, the same one we've been using … there should be a minimum gap between … the tails of the flags and the lowest staff line … However, for this part, I do want to make the stems even longer, since we don't have any notation in the above or below. So let's discuss a rule to make those stems longer so that it could be consistently applied. So the bottom stems should go a fair bit lower, and the top stems should go a fair bit higher."

**Built:** a figure that has been taken (a unit of the hand file) has full-size heads and accidentals (`handUnit.unitHeadSize` 1); the notes not yet taken stay at 0.5. Figure 5's flag is a 16th.

**THE FLAG RULE, measured on the page (the throwaway, staff space 7.315 px):** the rule is `objects.flag.staff` 0.38 — the flag's tail stands 0.38 ss clear of the staff's outer line (#4 day 23, his "just like three pixels or so — maybe not the full typical gap"; piece 2's own number was 1.0). The flags are the engine's own (`glyphs.json flag`, LilyPond, ported from piece 2 on 2026-08-22): up 16th 3.508 ss tall, down 16th 3.008.
- Figure 1 (stem down, lower staff): the stem's tip 3.38 ss under the bottom line = 0.38 + 3.008. The rule, exactly.
- Figure 3 (stem up): the tip 3.89 ss over the top line = 0.38 + 3.508. The rule, exactly.
- Figures 4 · 5: the tips 4.64 ss over the top line — the stem's base length (3.5 past the top head) is the longer of the two, so the flag's tail stands 1.13 ss clear.
So the rule is applied; 0.38 ss is simply a small gap (2.8 px on this page).

**The longer stems — put to him, not built:** ONE number for this section, the flag's clearance from the staff. Raised from 0.38 to about 2 ss, every flag's tail (and every beam) stands the same distance outside the staff: the upper staff's tips on one line 7.5 ss over its middle, the lower staff's stems mirrored below. The same law, one row; nothing else changes.

## §258 · 2026-11-20 · the stems 2 ss clear; piece 2's respelling rule applied; the grace figure at 151.4 by the standing grace rules; three cases with no rule put to him

**His words:** "Yes, let's try 2 staff spaces. And then the first figure, there's the vertical collision rules aren't being respected. And the accidentals are crowding the note heads. We really do need to find a way to make sure standards and everything are robustly applied … you should collect all the engraving rules in one place. They should be all followed … And when there isn't a rule in place, or if AI is not sure what to do, there should be a discussion and a new rule made, and then that's done and dusted … And then the next figure, look at the recombination piece. We developed a number of grace note figures. So look at the note head size, stem size, beam size, all that, and how to place the diagonal line that bisects the corner of the stems and beams … the two notes in the bottom at 151.4 about, that should be a chord … the ones at 151.5 are its own chord too. And then let's beam those three partials, the two chords with the C, the high C in the top part. Let's stem and beam all those 16th note again, but the grace note … I think there was some trouble with the slash line that cuts the beams. So let's try to figure out a reliable, robust placement for that."

**Built:**
- `objects.handUnit.flagClearSs` 2 — in the piano solo the flag's tail, and a beam, stand 2 ss clear of the staff (the standing flag law, this section's number).
- **Piece 2's respelling rule for a tight cluster** (`CHORD_SPACING_RULES.md` §5b, locked there, never ported): a sharp whose letter another note of the chord has is written as the flat of the next letter when that letter is free. Figure 3's F · F-sharp is now F · G-flat: two positions, no natural, no unison pair.
- **The grace figure**, by the rules already in this engine from Recombination (`objects.graceHead` 0.707 · `graceSlash`; §550 · §591 · §592 · §601 … §604 · §666): heads and accidentals 0.707; the stems' base length and the flags at that scale; the beam at the heads' scale; the stroke on the FIRST stem only, centered on the corner where that stem meets the beam stack, slid 0.5 ss toward the heads, the far half longer by twice that so it juts equally past both faces, rising to the right. A unit of the hand file says `grace: true`. Figure 6 = three units beamed: G-sharp 4 · E4 (151.405) · the high C6 (151.424) · F4 · C5 (151.482).

**Three cases where the standing rule does not give a good figure — put to him, nothing invented:**
1. **Figure 1's pile (A · A-sharp · B).** Piece 2 measured LilyPond on exactly this (its chord 9, C · C-sharp · D): "C4 and D4 share X; C-sharp shifts right" — the two outer notes, a step apart, share one column and overlap. The respelling rule does not help (B-flat meets the B). So the pile IS the locked rule; it has no better one.
2. **The accidentals' gap in a column** is 0.1 ss (`objects.accidental.besideUnit`, his tightening at §482, made on stemless chords); a single note's is 0.25. With a stem at the head's edge 0.1 reads as crowded.
3. **Figure 6's spacing.** The three partials are 19 ms and 58 ms apart: on the timeline their stems stand 0.35 and 1.1 ss apart, so the first chord's long stem runs beside the high C's head. Recombination's grace figures had no minimum distance between beamed members.

## §259 · 2026-11-20 · the grace figure's middle note placed by hand; the grace stroke's brief; THE ENGRAVING RULES made a standing practice; checkpoint

**His words:** "for that middle grace note, in that grace note figure, let's just make it directly in the center between those two chords. And then when we get back after the checkpoint clear, could you put it on the to-do to figure out a consistent placement for the slash and how to do it? … we'll figure out the angle and then some measurement, maybe from the point, the top beam, left topmost point. Maybe we can do some sort of coordinate at a certain angle. And then I want like an equal amount jutting out to the left and an equal amount jutting out above to the right. And that one might be potentially a little too long … can you make sure … all the sort of shoring up about the engraving rules … gets passed on to the agent that picks up after clear. So we don't have to revisit all these things. in particular, the idea of finding the standards, applying the standards, and when there isn't a proper engraving standard, then flagging it for discussion rather than making something up."

**Built:** a unit of the hand file may say `at <seconds>` — it is drawn at that time instead of its own (device `puT`). Figure 6's high C (played 151.424) is drawn at 151.4435, midway between the two chords (151.405 · 151.482). Rebuilt; valid; NOT looked at again.

**Written down, not built:** the grace stroke — his brief verbatim and the AI's recommendation (one anchor at the outer corner of the first stem and the top beam, 45 degrees, two numbers `cutSs` · `jutSs`, equal juts by construction) in `docs/NOTATION_SCHEME.md` § 2 OPEN, with the three other cases that have no rule yet (the chromatic cluster · the accidentals' gap in a stemmed chord · the distance between beamed grace notes). None of his answers to those three is in hand: he placed figure 6's note by hand and left the rest.

**Passed on:** `CLAUDE.md` § "Standing practice: THE ENGRAVING RULES" (find · apply · discuss · say which rule · measure a claim), its pointer in the orient list, the state line; the journal's checkpoint of this date; the auto-memory note `engraving-rules-first-never-improvised`.

## §260 · 2026-11-20 · two rules made at his word: the third column; the accidental's gap beside a stemmed chord

**His words (at the checkpoint):** "And then, yes, the 1 and 2 rules is good. Sorry, I didn't see those. Let's implement those rules as well."

**The rules (§258's recommendations 1 and 2, now HIS; rows of `objects.handUnit`, in the table of `docs/NOTATION_SCHEME.md` § 2):**
- **`thirdColumn`** — where the two-column walk would put two notes a step or less apart in one column (three notes a half step apart), the later one takes a third column: one head width beyond the default column, on the side away from the stem. The stem stays on the default column.
- **`accGapStemmedSs`** — an accidental beside a chord that has a stem stands 0.25 ss from its head (the single note's `objects.accidental.beside`); a stemless column keeps 0.1.

**Seen once on the throwaway:** figure 1 (A · A-sharp · B · D-sharp) in three columns, no head on another; the grace figure with its middle note between the two chords. The grace figure's two chords are 77 ms apart, so it is still narrow — the minimum distance between beamed grace notes stays open, with the stroke's place (the next session's first task).

## §261 · 2026-11-20 · his rule for the spacing of a beamed grace group — written, to build after the clear

**His words (after the checkpoint):** "Yes, the beamed grace notes minimum distance. I guess there'll need to be clearance for the ledger too. And let's make, well, it depends, but for these ones, let's make everything, or there'll be one version that's equal horizontal distance. So these ones should have equal horizontal distance. And this is hard to codify in a rule, but I guess we'll have to push where there's room. In this case, there's room to the left and to the right. So I guess if that's the case, we'll push out both sides. So the leftmost will go a little bit more left, the rightmost chord will go a little bit more right, and there'll be enough space so that the stems clear the ledger lines and the note head in the middle will be in between."

**Decided:** the fourth open case of §258 is settled as a rule: equal horizontal distances; enough that each stem clears the neighbor's head and its ledger lines; pushed out on both sides where there is room on both sides. One side only: no rule yet. He names a second version to come (not equal distances) without describing it.

**Not built in this session** (the context is at its end; the stroke's place and this spacing touch the same figure and are the next session's first task). Written into `docs/NOTATION_SCHEME.md` with the AI's read-back, the journal's checkpoint, and SW-82.

## §262 · 2026-11-20 · the grace stroke's corner rule and the grace group's equal spacing — built, measured on the page

**What prompted it:** after the clear, the playback put the stroke's two-number recommendation to him (one anchor at the stem–beam corner, 45 degrees, cut 1.0, jut 0.4) with the spacing rule of §261 to build beside it. **His word:** "go ahead".

**Built (the rows first, then the code):**
- `objects.graceSlash.cutSs` 1 · `jutSs` 0.4 (the corner rule; `at` · `reachSs` · `beamInsetSs` stay for the septets' older figures and are not read by a hand unit). The anchor P = the first stem's LEFT edge on the TOP face of the top beam (the renderer draws a beam downward from its tips, so the tip's height is the top face). The stroke runs from (P.x − jut, P.y − cut − jut) to (P.x + cut + jut, P.y + jut). A flagged single grace in a hand unit takes the same rule from the stem's tip.
- `objects.handUnit.graceGroupSpacing` "equal" · `graceGroupClearSs` 0.45 (the house space). In `layout.js`, the hand unit's pre-pass: each unit keeps its ink as boxes (heads · ledger lines · accidentals); for a beamed grace group the stems are set at one distance D, the least at which (a) each stem clears every later member's ink that stands beside it (above the stem's lowest head) and (b) no two members' ink at the same height meets — each by the clearance; non-neighbors count at their multiple of D. The group takes ONE time, the middle of the span it was played in, and its members stand symmetric about it — so it is pushed out on both sides.
- The hand `at` of the high C (figure 6b) retired from `notation/hand/s2-piano-solo.units.json`.

**Measured on the page (`s2-piano-solo`, the throwaway 5601, one look; staff space 4.22 px on that screen):** the three stems at x 795.7 · 801.5 · 807.3 — 5.8 px and 5.8 px, 1.37 ss each. The first stem's right edge to the high C's ledger lines: 1.9 px = 0.45 ss (the binding case, as he foresaw: "the stems clear the ledger lines"). The stroke: 1.7 px (0.40 ss) left of the stem's left edge, 1.7 px above the beam's top face, crossing the stem 1.0 ss under the corner. Its length 1.8 ss on each axis (the old one was 2.2).

**Seen, not decided:** with stems 1.37 ss apart and cut + jut 1.4 ss, the stroke's upper end stands directly over the SECOND stem's top, 0.4 ss above the beam. Nothing touches. Put to him in one line.

**Not built:** the room check. The rule centers the group whatever stands beside it; "room on one side only" has no rule yet and nothing detects it — his eye on the page until a figure meets it.

**The checks:** `gen_engraving_rules.js` regenerated the rules page; `check_rules.js` 31 of 32, the one red ("no sequence page to compare", check 8) red before this change as well.

## §263 · 2026-11-20 · THE SCATTERED GRACE (sg) — his name and his rule; figure 7 of the piano solo built

**His words (on his screenshot of figure 6 and the notes after it):** "the next figure, 1st confirm that you will have a record of their rhythmic positions, then the top 2nd partial is a chord, the bottom 3rd partial is a chord, the span will be the left most note to the right most note of either; lets call these scattered grace (sg), evenly space the partials across the span, top stems up bottom stems down always, we have that new 2ss rule yes? get the wavy slash from reconstitution, could you implement the grace slash placement rule for that one as well, use the grace sizes for the sgs"

**The AI's reading:** "reconstitution" = piece 5, *Recombination* (a dictation slip): its uneven-group sign's wavy stroke (`objects.groupStub`, its §557 … §562). "The new 2ss rule" = `objects.handUnit.flagClearSs` 2 (§258) — yes, and it holds for a beam.

**The record of the rhythm (his first question): yes, three places.** His save holds each note's start; the IR keeps each event's `onset` unchanged (only the DRAWN place moves); and each sg unit in `notation/hand/s2-piano-solo.units.json` now carries `played` — its played times.

**The figure (151.635 → 151.884 s):** the upper hand E5 (151.635), then the cluster G#5 · A5 · A#5 (151.754 … .763); the lower hand G#4 (151.751), A4 (151.792), then the chord D5 · C5 · B4 (151.879 … .884). Five units, `sg: "sg7"`, the beams `u7t` · `u7b`.

**The rule as built (`objects.handUnit.scatteredGrace`, the row carries his words):** one figure in two hands, each hand its own beam; the upper hand's stems up, the lower hand's down; the span from the first played unit to the last of either hand; each hand's units at EVEN times across the span — the first on its start, the last on its end (so the upper hand's two stand at the two ends, the lower hand's three at start · middle · end); grace sizes; the beam by the standing law at 2 ss clear, mirrored below the lower staff for stems down (new in the hand unit's post-pass: a beam on down stems); on each beam's first stem the wavy stroke, placed by the corner rule (cut 1.0, jut 0.4), mirrored for stems down — it falls to the right, as Recombination's did under the heads. The waves are counted so the wavelength stays Recombination's (1.75 waves on its 4.24 ss → 1.05 on 2.55 ss).

**Measured on the page (the throwaway 5601, one look, 1 px = 1 page px, the staff space 7.9 px):** the lower hand's columns at x 1531.6 · 1549.5 · 1567.5 — 17.9 and 18.0 px, 2.27 ss each; the upper hand's at 1531.6 and 1567.5, the same two ends. The upper beam's top face at y 556.7, its stroke from (1534.0, 568.5) to (1547.7, 553.8); the lower beam's bottom face at 738.1, its stroke from (1527.6, 727.7) to (1542.3, 741.4) — each 0.4 ss past the stem's edge and past the beam's outer face.

**What "evenly" was taken to mean, and the alternative not built:** the COLUMNS' left edges are even (the standing rule: a head's left edge on its moment, D49). The STEMS therefore are not quite even in the lower hand (18 px, then 23.8 px), because the last chord's stem stands inside its two-column cluster. Even stems would be the other reading — put to him in one line.

**Not looked at as a picture:** the preview pane would not give a readable zoom at this size; the numbers above are the check. His eye on his own page is the look.

## §264 · 2026-11-20 · the sg's smaller waves · the red "fit?" left out · a played-spacing copy of the piano solo

**His words (after figure 7):** "can we make the waves smaller so a slash can have a few of them and there is a text fit? that appears in the score can we supress that; and then can we keep an experiments file that has the original time accurate spacing?"

**Built, three things:**
- **The waves.** The scattered grace's stroke has its own wave now: `objects.handUnit.sgStrokeWaves` 3 · `sgStrokeAmpSs` 0.08 · `sgStrokeHand` false. Before: about one wave (1.05) at 0.12, with Recombination's second "hand-drawn" wave on top. The AI's call, his to move: the second wave is left off for the sg, because at three waves on a stroke 2.55 ss long it blurs the first. `objects.groupStub` keeps Recombination's numbers.
- **The red "fit?".** It is the layout's own mark on a unit that does not fit its lane (the ladder's last rung, piece 5's red idiom). A page can now leave it out: `--noFitMark` → `ir.layoutPolicy.fitMark` false. Only the TEXT is left out; the units it marked still do not fit their lane (4 on this page at §259) — the OPEN table's "a long figure's room in the lane" stands.
- **The played-spacing copy.** A second page, `s2-piano-solo-played` ("Section 2 - the piano solo, PLAYED spacing (the time-accurate copy)", under experiments in the picker): the same notes and the same hand file (`--unitsFrom s2-piano-solo`), with `--timeSpacing` → `ir.layoutPolicy.timeSpacing`: the grace group's equal spacing (§262) and the scattered grace's even spacing (§263) are both off, so every unit stands at its played time. Stems, beams, strokes and sizes are the same as the main page. It is rebuilt by the main page's command with `--id s2-piano-solo-played --unitsFrom s2-piano-solo --timeSpacing` added; it is NOT rebuilt by itself when a figure is taken.
- The schema (`notation/schema/ir_v0.schema.json`) takes the two new policy keys. The first build was refused by the validator for the unknown key, and the IR removed, until the schema had them.

**Checked once on the throwaway (5601):** "fit?" texts 0 on both pages; on the played copy figure 6's stroke stands at x 1499.4 (the main page 1488.7) and the lower sg stroke at 1545.3 (main 1528.3) — the played places.

**The main page's command from here on** carries `--noFitMark`.

## §265 · 2026-11-20 · figure 8 of the piano solo — a full-size beamed group spread to the RIGHT; the rightward case made a rule

**His words:** "next figure dyad bottom 2 notes top, all 3 beamed together 16th, spread for fit, but this time to right, we have an algo but not sure if there is a rightward only case, these will be standard noteheads and even spacing"

**The answer to his doubt:** there was no rightward case. §262's spacing centered the group always, and "room on one side only" was written as NO RULE YET. His word here is that rule's first half.

**The figure (152.123 → 152.226 s):** the dyad A#4 · D5 on the lower staff (152.123 · .131), then F#5 (152.146) and G5 (152.226) on the upper. Three units, the beam `u8`, stems up, two beams (a 16th), full-size heads, `spread: "right"`, each with its `played` times.

**Built:** the equal spacing of §262 (the least equal stem distance that clears every member's ink by the house space, 0.45 ss) now serves a full-size beamed group when its units say `spread`; `spread: "right"` keeps the FIRST member on its played place and sets the others to its right. The side is said per figure in the hand file — nothing chooses it. The row: `objects.handUnit.spreadSides` with his words. A leftward-only case has not been met and has no rule.

**Measured on the page (the throwaway 5601, one look):** the three stems at x 1610.6 · 1628.6 · 1646.7 — 18.0 and 18.1 px, 2.28 ss each; the first on the dyad's played place; the beams' top face at y 548.6, one height for the three.

**Both pages rebuilt:** `s2-piano-solo` (spread) and `s2-piano-solo-played` (the figure at its played times, as §264).

## §266 · 2026-11-20 · films for his phone — the whole piano solo, then clips by time (`tools/piano_clip.js`)

**His words:** "can you make me a video, small is fine, of the piano solo and the time-accurate notation with the scroll … I don't know if you can zoom in on the piano staff, I'll be looking at it on my phone" · then "I want cropped versions of the zoomed score from a certain time to a certain time ~147.9 ~ 152 cropped like the image to the piano part".

**The first film:** `tools/export_video.js --ir s2-piano-solo-played --view video --t0 146 --t1 253` with the players' render `notation/audio/piece-Section03-H-addTuplets.wav` (its piano solo checked note for note against the first draft's: 1058 of 1058 the same), then an ffmpeg crop of 480 × 270 that follows the cursor, doubled to 960 × 540. Sent in the chat. Soft, because it is an enlargement.

**The clips, the way from here on:** `node tools/piano_clip.js --t0 S --t1 S [--played]` — the export's ZOOM view (6 s of music across the frame, drawn at that size, so sharp), cropped to the piano's two staves (the band 1085 … 1505 of the 2160 frame), 1280 wide, with sound, half a second of lead and one of tail. Into `notation/video/clips/` (gitignored). He names two times; the AI runs it and sends the file. Screen recording (Game Bar is installed; nothing else) is not needed for this.

**Made:** 147.9 → 152 s, the spaced page and the time-accurate copy.

## §267 · 2026-11-20 · a clip keeps its passage on ONE page — the app's SHIFT+arrow pan, in the film tools

**His words:** "so I am able to use the zoom feature and shift arrow keys to keep my passage on the same page, are you able to if not then the screen recording options"

**Built:** `tools/export_video.js --zoomAnchor T` — the zoom pages are shifted so that one opens at T (the app's SHIFT+arrow pan, to any time, not whole seconds). `tools/piano_clip.js` now opens the page at the clip's start and, when the passage is longer than a 2× page holds, draws it at the largest zoom that still holds it whole; `--turn` gives the old paged way.

**A wrong number on the way:** the first build assumed a 2× page holds 6 s and the page still turned 0.4 s before the end. `coords.js zoomCfg` has it: the labels and margins are zoomed too, so a page holds (1920 − 152 Z) / (147.33 Z) seconds — 5.48 s at 2×. With that sum the clip 151.49 → 156.12 (6.13 s with its lead and tail) is drawn at 1.82× on one page; the last frame checked — the cursor at the right edge, the same page.

**So no screen recording is needed for these clips.**

## §268 · 2026-11-20 · looped clips

**His words:** "can I get 147.6 to 152.88 looped 6 times and with a 2 second gap between?" — `tools/piano_clip.js --loop N --gap S`: the clip N times over, its last frame held S seconds in silence after each pass (`<name>_xN.mp4`). Made for 147.6 → 152.88, both pages: 52.7 s each, on one page at about 1.67×.

## §269 · 2026-11-20 · THE NOTATION WORKSHOP — the piano staves, a sideways stretch, a speed slider, loop points, a video of what it shows

**His words:** "can we build a notation workshop for this, just the piano staff, if I can have a zoom so spaces between noteheads will shrink/grow, and a playback speed slider and then I'll take a phrase at a time and at the zoom level for the videos? lets discuss 1st" · after the read-back and one question: "like we are doing today, yes sideways stretch, and can I set loop points too go an build if you have no more questions".

**Settled in the discussion:** the workshop LOOKS and LISTENS only; the figures are still taken in the chat (his "like we are doing today"). The zoom is a sideways stretch, not a magnifying glass. Loop points are his to set.

**The AI's decisions (said to him, his to reverse):** the sound is the recorded players' render, slowed with its pitch kept by the browser — no Reaper, no loopMIDI, the same sound as the clips; both spacings on one switch; a page and a port of its own (5650; the throwaway 5651), the notation app untouched.

**How it is made:** `tools/notation_workshop.js` + `workshop/notation/index.html`.
- THE PICTURE is the notation app's own page: the same layout of the WHOLE ensemble at the 1080 frame (so every fit decision is the score's, not a piano-only frame's), drawn by `static_page.js` for a window of the page's choosing and cut to the piano's band by the SVG's viewBox (y 546 … 772). The STRETCH is that window's length — the seconds across the page (1 … 24); the staff and the heads keep their size. SIZE is a plain enlargement beside it.
- The engine is re-read when the IR or the notation code changes on disk, so a figure taken in the chat shows after a reload of the picture, without restarting the server.
- THE SOUND: a 16-bit cut of the render, 146 → 258 s, made once (`notation/audio/cuts/workshop-piano-146-258.wav`), served with ranges; the cursor is the audio's own clock. Speed 20 … 150 %.
- THE LOOP: start and end by number, by "= cursor", or SHIFT+click and ALT+click on the score; a gap in seconds between passes; "Fit the page to the loop".
- THE VIDEO: the picture rasterized once, the cursor drawn on each frame, piped to ffmpeg with the cut's sound at the same speed (`atempo`), the loop's gap held on the last frame, N times. The file goes to `notation/video/clips/` and `latest.json` there names it — "send the clip" in the chat is that file.

**Proven once, on the throwaway (5651):** the page drew both staves at a 3 s stretch with the heads unchanged; `/audio` answered a range request (206); a video was made from the page's own request — 147.9 → 152 at half speed, twice, 20.4 s, picture and sound — and one frame of it looked at. NOT proven: the sound under his hands in his Chrome (play, the loop's gap, the speed by ear).

## §270 · 2026-11-20 · the notation workshop made compact; a phrase selected by dragging

**His words:** "its a little hard to use … I want to select a phrase to work on but the zoom isnt right … there is a marquee there but I cant figure out what it does" · then, on his screenshot: "I have to scroll to use it so 1st lets some how reduce the vert space, maybe top bar to bottom less white space at bottom of staff lane maybe controls in horiz rows, less text smaller font simpler labels, most pertinent controls in toprow/bar, if we can compress a bit the vert space of the notation thats ok too, slightly smaller noteheads ok".

**Changed:** the four boxed panels are two thin rows above the score. Top row, the ones he reaches for: Play · Speed · Stretch · Size · Loop · Fit phrase · Make video. Second row: spaced / as played · Page from · Phrase (from, to) · Gap · the cursor's and the mouse's time. The hints are gone but one line. Font 12.5 px. The score's band cut 22 px shorter under the lower staff (546 … 750 of the frame). The default size 1.5× (was 2×), the slider down to 0.8×.
**Added (the AI's, offered in the last turn, unanswered — his to refuse):** DRAG across the score selects the phrase (the "loop" is called the phrase now; SHIFT+click and ALT+click still set its two ends); a plain click still moves the cursor.
**Checked on the throwaway, 1024 × 768:** the whole page stands in the window without scrolling (document height = window height); a drag set the phrase to 149.53 → 151.90 and the shaded area followed.

## §271 · 2026-11-20 · SW-83, the gravity notation — the first look at what he played, before any proposal

**What prompted it:** SW-83 (`COMPOSITION_NOTES.md`, his words whole): long GC arcs as a gravity to play into and out of, fixed structures as bearing walls; "lets figure out a way to isolate what parts I'm doing in the playing … give me your thoughts first".

**Looked at (his save `piece-FirstDraft-Final-B-noFadeAt96`, the piano lane, 152.4 → 166 s; notes within 40 ms counted as one event; times, gaps and sizes only — loudness NOT yet read):**
- The events come in RUNS: small events (one or two notes, sometimes three or four) 0.04 … 0.17 s apart.
- Most runs END on a large cluster in both hands, then silence: 153.06 (6 notes) then 0.64 s · 155.65 (10 notes) then 0.76 s · 160.40 (14 notes) · 163.64 (16 notes) then 0.70 s · 165.58 (12 notes).
- Two chords stand ALONE, silence on both sides: 156.41 (5 notes; 0.76 s before, 1.27 s after) · 164.34 (9 notes; 0.70 s before, 0.44 s after).
- After the 160.40 cluster the run thins out (160.66 … 161.23: 2 · 5 · 2 · 1 · 2 notes) before a 0.56 s silence — a tail.
- In 157.68 → 160.14 the two registers interleave (59 … 67 below, 81 … 89 above): two lines at once, one per hand.

**The AI's thoughts, put to him (not decided):** three kinds separate by measurement — a lone chord between silences (a wall), a run of small quick events (a flow), and the big cluster a run lands on (the candidate for the bounce); the open point is whether that landing cluster is the BOUNCE or a WALL. A prototype passage proposed: 156.41 → 161.23 (a wall, the long two-hand flow, the 14-note landing at 160.40, the tail). A way to isolate: the AI marks each note by kind and hand from timing, size, loudness and register, shown in color on the workshop page; he corrects by ear.

## §272 · 2026-11-20 · the loudness read; THE FIRST SORTING (`tools/gravity_sort.js`) and its marks in the workshop

**His words:** "yes good analysis, lets read loudness, this will have inpact; I'm having trouble sorting out things from current visual and the sound maybe we put into the workshop the gcs and small vert rects for the fixed structures? over just the noteheads, you can eliminate the accidentals, or leave them in if that is tricky". (The AI's question of §271 — is the landing cluster the bounce or a wall — was not answered; the sorting shows BOTH marks where both rules hold, for his eye to decide.)

**The loudness (the save's `recVel`, the IR's `vel`; 152.4 → 166 s):** he plays loud throughout — most flow notes 50 … 100 — so loudness alone does not find a wall. What it adds: (a) the loud chords that OPEN after a silence — 153.85 (4 notes, mean 116) · 157.68 (3, 111) · 161.79 (2, 105) · 164.78 (3, 105) — "a jab, then the flow follows", his own description; (b) the landings are loud AND large (155.65: 10 notes, mean 114; 160.40: 14, mean 103); (c) single notes at full force inside a flow (158.54 at 125, 158.82 at 127) — accents, left as flow notes for now.

**The rules of the first sorting** (every number in `bank/gravity_sort.json` `params`, his to move): an EVENT = one hand's notes within 40 ms; a MOMENT = both hands'. A WALL = a moment ALONE (0.4 s of silence each side), or STRONG (mean loudness ≥ 104 with ≥ 3 notes), or an OPENER (after ≥ 0.4 s, mean ≥ 100, ≥ 2 notes). A RUN = one hand's events less than 0.5 s apart; its BOUNCE = its heaviest event (the sum of its notes' loudness); ARC IN = the run's first note → the bounce, ARC OUT = the bounce → its last note; under three events, no arc. The hand is the page's own split.

**The result, the whole solo (146 → 253 s):** 1058 notes · 338 moments · 40 walls (3 alone) · 35 arcs (right hand 16, left 19). In the passage proposed as the prototype: the wall at 156.41 (alone) and at 157.68 (the opener); the right hand's arc 157.68 → the bounce 160.40 → 161.12; the left hand's 157.71 → 159.16 → 159.64, then a second 160.19 → 160.43 → 161.23.
**Known weak points, not tuned:** one arc per run — a long run (the right hand's 164.34 → 169.76, 28 events) surely holds several waves; the bounce is "the heaviest event", which is not always where the ear puts it.

**In the workshop:** a third page, HEADS ONLY (`s2-piano-solo-heads`: no figures, the heads at 0.8 at their played times, the accidentals gone — `--handHeadSize 0.8 --handAccSize 0.001 --unitsFrom none --timeSpacing`), and a GRAVITY checkbox on any page: the walls as amber upright boxes on the hand's staff (both staves when both hands), the right hand's arcs above the upper staff (teal), the left hand's below the lower (purple), each arc a ball's path — falling from rest into the bounce, leaving it fast — with a ring at the bounce and a BALL riding the arc while it plays. The marks are the page's overlay; they are not in the video yet.
**Checked once on the throwaway:** the heads page at 156 s, 6 s across — 4 walls and 5 arcs drawn in place, no error.

## §273 · 2026-11-20 · SW-83 slowed down — ONE gravity moment in ONE hand, the prototype page

**His words (SW-83's third word, whole in the sketch pad):** the wave curve joining the GC arcs — "Hold this"; then "lets take a step back and proceed more slowly … isolate one gravity moment in one hand, decide which notes belong on which side of impact, could be all on one side; next draw the arc from the moment of the 1st note of the cluster through to the moment of the last note; next decide on how to decide on the physics and shape of the arc; lets do this much and lets use the gc design I've been using … take out all the rest, let me have a few of the lead in and lead out notes, nothing from the second hand, make sure all fits on the page and reduce the notehead transparency, 60%".

**The example chosen (the AI's, his to change):** the LEFT hand, 157.82 → 159.64 s. Why this one: it is one hand's wave with notes on BOTH sides of a clear heaviest moment, so the question "which side of the impact" has something to decide; it is short (1.8 s); and the same hand gives lead-in and lead-out notes close by.
- lead in: the chord at 156.41 (G3 · D4 · E4) and the E4 at 157.705 (the left hand's note of the opening jab)
- before the impact, 12 notes: 157.821 … 158.381 (D#4 · F4 · B3 · D4 · E4 · C4 · B3 · F4 · G4 · D4 · E4), then E4 alone at 158.820 (loudness 127)
- THE IMPACT, 159.159 … 159.168: D#4 · E4 · C#4 (106 · 127 · 102) — the hand's heaviest event
- after it, 6 notes: 159.281 … 159.641 (D4 · C4 · E4 · D4 · C4 · E4)
- lead out: 160.19 … 160.98 (the left hand's part of the run into the big cluster)

**The arc:** from the first note (157.821) through the impact (159.159) to the last note (159.641), in the lineage's GC — `notation/lib/gc.js`'s own curve with the registry's preset (piece 2's: ictus 120 → the fall 1 − u^3.4, stiffness 50 → the rise power 2, damping 80 → the rebound to 80 % of the drop), the fall stretched to 1.34 s and the rebound to 0.48 s; its look the GC's (magenta, 1.5 px, the ring at the impact, the ball). The apex at the top of the picture, the impact under the staff.

**Built:** `bank/gravity_proto.json` (the example as data: hand · window · arc · the note lists per side — his to edit by word) and the workshop's fourth page, "prototype": the server filters the heads-only IR to that hand and window and lays it out; the picture is cut to the lower staff (the band 628 … 752); the heads at 60 % opacity; nothing else is drawn — no walls, no other arc, no right hand. Picking the page sets the view to the window and the phrase to the arc.
**Checked once on the throwaway:** the page drew the left hand's notes of 156.1 → 161.2 on one staff, 53 heads lightened, the one arc with its ring, the ball at the arc's start; all inside the window, no scrolling.

**Open, his (the method's steps 3 and 5):** which notes stand on which side — the first reading puts the impact on the heaviest event; and how the arc's shape is decided — today it is the GC's fixed curve stretched in time.

## §274 · 2026-11-20 · the prototype in the film — the arc, the ball and the lighter heads

**His words:** "can i still see a video, of that passage 7 times at 50%". The workshop's film drew the page without its overlay, so the prototype's arc was not in it. Now: on the prototype page the lighter heads are in the picture itself (every glyph stamp right of the music's start takes the opacity, server side — the page and the film agree), the arc and its ring are drawn into the film's picture by `gc.js`'s own `heightFrac`, and the ball is drawn on each frame beside the cursor. Made and sent: 156.1 → 161.2 s (the whole prototype window, lead-in and lead-out included), 7 times at 50 %, 2 s gap, 85 s. One frame looked at: the ball on the arc at the cursor, the ring under the staff, the heads gray.

## §275 · 2026-11-20 · SW-83, layer 2 — what the left hand does inside the prototype's arc (read before the discussion)

**What prompted it:** SW-83's fourth word (the sketch pad): the hand in a position, the fingers wiggling into the gravity; how to write the position and the wiggle so a pianist reads it fast; and the chords the wiggle makes.

**The prototype's 21 notes, read for this (the left hand, 157.82 → 159.64 s):**
- EIGHT pitches inside a minor sixth, B3 … G4: E4 six times (the loudest, 127 twice) · D4 four · C4 three · B3, D#4, F4 twice each · C#4, G4 once.
- NOT one position: eight keys are more than a hand's five. Read in order — D#4 · F4 · B3 at the entry; then the white keys C4 · D4 · E4 with B3, F4, G4; the impact C#4 · D#4 · E4; after it only C4 · D4 · E4. The hand shifts by a half step at the entry and at the impact; E4 is in every stage.
- AFTER the impact the order is a clean rotation: D4 · C4 · E4 · D4 · C4 · E4. Before it the order is scattered.
- The "chords" of the wiggle: five times two notes fall within 3 … 46 ms of each other, every time a whole tone or a neighbor pair (D#4 + F4 · D4 + E4 twice · D4 + C4 twice) — two adjacent fingers together, not a planned chord.

**The AI's thoughts, put to him (nothing decided):** two layers for two needs — WHERE the hand is, written exactly and once (the keys under the hand, as a stacked cluster in a box at the arc's start; a second box where the hand shifts), and WHAT the fingers do, written as a contour (the gray heads along the arc, without accidentals, read as shape). A dyad of the wiggle = two heads stacked in the contour; no sign of its own. The open point: must a player keep his ORDER of notes, or only the position, the number of attacks and the contour.

## §276 · 2026-11-20 · the prototype's layer 2, first try — the flow as a star chart, the hand's shape as boxed chords

**His words:** SW-83's fifth word (the sketch pad, whole): the gray heads stay for his reference; the internal flow "like a star chart … vert is not pitch here but flow … a curved line representing the waves within the gc arc, then dots … a at a glance sense of business or density"; the shape "as a vertical chord on the staff enclosed in a thin rectangle, tightly around", with accidentals, "a new one when the shape changes, but I want to find a ballance … it sounds like this is 2 chords in the prototype lets give it a try".

**Built (`tools/gravity_furniture.js`, drawn by the workshop's server into the picture itself, so the page and the film agree):**
- THE FLOW, in a strip of its own under the staff (46 px, the part below covered in white), over the arc's span only. The curve = how busy the hand is: each played note a bell 0.12 s wide and as tall as its loudness, all summed, scaled to the strip. A DOT on the curve at each played event; two notes together (within 50 ms) a bigger dot. In the prototype it reads: busy at the entry, a trough around 158.6 s (the 0.44 s with one note), the peak at the impact, falling away after.
- THE SHAPES, on the staff, each ending 0.6 ss before its moment. The rule tried (in `bank/gravity_proto.json` `shapeRule`, the AI's, his to move): ONE SHAPE PER SIDE OF THE IMPACT — the pitches played before it; the impact's and those after — and the second is drawn only if the two sets differ by 3 pitches or more, counting added and dropped; otherwise its new pitches join the first. Here: before = B3 · C4 · D4 · D#4 · E4 · F4 · G4; from the impact = C4 · C#4 · D4 · D#4 · E4 — one added (C#4), three dropped (B3 · F4 · G4), so TWO shapes, as he heard it.
- THE RULES THE CHORDS ARE BUILT FROM: LilyPond's filled head and accidentals (`glyphs.json`); the column — a head a step or less from one already in its column moves to the next (piece 2's column, then the third column of §260); the accidentals packed by `chord_column.js`'s own `accidentalColumn` with the registry's gaps; a natural beside a same-line neighbor's sharp; ledger lines at the registry's length. Full-size black heads (the gray ones are his reference).
- **NO RULE YET — put to him:** the second shape is five chromatic notes inside a third (C4 … E4). Three columns cannot hold them without two heads a step apart in one column, so a FOURTH column was taken, provisionally; the result carries the flag. Piece 2's respelling (C# → D♭, D# → E♭) does not remove it.
- The GC arc and its ring moved from the page's overlay into the same server drawing; the page's overlay draws only the ball.

**Checked once on the throwaway:** the page shows the two boxed chords, the arc, the strip with its curve and 14 dots, no error; the flag "a fourth column at 159.159 s" returned.

## §277 · 2026-11-20 · the shapes as CLUSTER BARS — piece 2's bar, with the top and bottom heads

**His words:** "lets write clusters as a bar with noteheads on top and bottom the actual top note and bottom note of the cluster, including accidentals, I believe we made this shape at some point or maybe I did in my legacy lilypond work".

**Lineage first — found:** piece 2 has it. `composition_for_two_pianos_and_two_percussion/docs/NOTATION_SYSTEM_PLAN.md` §17e.1, the plucked-piano cluster (the palm slap, locked its session 78): `makeClusterBarGlyph` in its `engine/glyphs/library.js` — a FILLED RECTANGLE one head wide (1.04 ss) over the cluster's whole written span, NO noteheads, no stem; its left edge on the go line. His legacy LilyPond work was not searched (not on this machine's repos by that name).

**What is new against piece 2's rule, and so the AI's, flagged to him:** with the two heads shown, a bar one head wide would swallow them; the bar is drawn HALF a head wide (`shapeRule.clusterBarW` 0.5) and runs from the bottom head's center to the top head's center. And WHEN a shape is a cluster: four pitches or more with no gap wider than a whole tone (`clusterMinNotes` 4 · `clusterMaxGap` 2); anything else stays a chord of all its notes.
**The accidentals:** each of the two heads carries its own (a sharp or a flat); the natural-beside-a-neighbor rule does not apply, the neighbors are not written.

**The prototype now:** shape 1 = B3 and G4 with the bar (it stands for B3 · C4 · D4 · D#4 · E4 · F4 · G4); shape 2 = C4 and E4 with the bar (C4 · C#4 · D4 · D#4 · E4). Neither end note has an accidental here. The fourth-column question of §276 is gone with it (flags: none).
**Checked once:** the page rendered to an image from the throwaway's own answer — both bars in their boxes, heads at both ends, the ledger line under the lower ones.
**What the bar does NOT say:** which notes inside are played. Shape 1 has no C#4 and no F#4; the bar reads as "everything from B3 to G4".

## §278 · 2026-11-20 · the workshop's server is the AI's to run, for now

**His words:** "since there is continuous restarting of the server can you handle that for the next while, I'll take over when it is more infrequent". The port 5650 was free (his server stopped). The AI started the notation workshop there (launch name `notation-workshop`) and restarts it itself whenever a change needs it; he only reloads his Chrome page. This is HIS word for THIS server and this while — the standing rule (the AI never holds his score port, 5600) is unchanged. When he takes it back: the AI stops its copy and he runs the line by its full path.

## §279 · 2026-11-20 · the prototype: no played heads, the flow a filled curve, the second shape on the rising arc

**His words:** SW-83's seventh word (the sketch pad): "take out the ref noteheads, take out the dots, lets use the internal curve as the ebb and flow within the larger gc, so maybe a filled in curve, an exaggerated version of my playing and the player can intrepret the curve freely, density of action acceleration or loudness; and lets try to avoid chord changes near the impact so you can move the 2nd to a point on the up arc and if it is less than 4 note cluster just include all 3 pitches offset as typical".

**Changed (`bank/gravity_proto.json` carries each number):**
- `refHeads` false — the arc's own played notes are no longer drawn. The AI's reading: the LEAD-IN and LEAD-OUT notes stay (gray), as the passage's context; his to say if they go too.
- THE EBB AND FLOW — the dots gone; the busyness curve stretched between its own low and high, raised to the power 1.6 (the exaggeration), never under 6 % of the strip, FILLED. It still stands in the strip under the staff, across the arc's span. It carries no instruction of its own: he names three readings (density of action, acceleration, loudness) and leaves the choice to the player.
- THE SHAPES — the impact's notes now belong to the FIRST shape; the second is the notes AFTER the impact and its box BEGINS 30 % of the way up the rising arc (`afterImpact`), not at the impact. Shape 1 = B3 … G4 as a cluster bar (it now holds eight pitches, the impact's C#4 with them). Shape 2 = C4 · D4 · E4: three pitches, under the cluster's four, so all three are written, the middle one offset to the right — the standing column (a head a step from the one below moves over).
**Checked once:** the page rendered to an image from the server's own answer.

## §280 · 2026-11-20 · the prototype: no played note at all; the shape boxes held inside the arc

**His words:** "take out the lead in and lead out notes too and keep the chord boxes in the gc horizontal so the shape box in drawn after the start of the gc arc and ends before the end of gc arc".

**Changed:** `leadHeads` false — the page draws no played note; what stands on the staff is the notation alone (the arc, the two shapes, the ebb and flow). THE BOXES' PLACE, now one rule for every shape: a box BEGINS at its moment (shape 1 at the arc's first note; shape 2 at 30 % of the rise) and is held INSIDE the arc's span — 0.3 ss in from the arc's first note, and never past 0.3 ss before its last (`shapeRule.insetSs`). Before this, shape 1 stood to the LEFT of the arc's start.
**Checked once:** the page rendered to an image — the cluster bar's box just inside the arc's start, the three-note chord's box inside its end, an empty staff either side.

## §281 · 2026-11-20 · the brainstorm — one movement with an inner movement, how other fields draw it

**What prompted it:** SW-83's eighth word: the filled curve under the staff and the GC arc "seam to confuse the message"; the overall acceleration into the impact "comes in 2 bursts"; "lets brainstorm, looking at design for graphs or animations, how do other domains tackel this".

**The AI's ideas, from what it knows (nothing was looked up), put to him:**
- THE DIAGNOSIS: two separate drawings read as two instructions. Every field below solves it the same way — the inner movement is drawn ON the main one, as a property of the same mark.
- Flow maps (Minard's map of Napoleon's march): the path is the journey, its WIDTH a second quantity → the arc as a ribbon, fat where the hand is busy.
- Stroboscopic motion pictures (Marey; motion-capture trails): marks along the path at each event; their crowding shows the speed → ticks across the arc, one per attack, two clumps for two bursts.
- Signals (a carrier and its modulation): a ripple riding the main curve, its height the activity → the arc itself wavy, like his wavy slash, larger where busier.
- Statistics (trend and deviation): the trend line with a shaded band around it.
- Animation (primary and secondary action; squash and stretch): the BALL carries it — it pulses or grows twice on the way down; the static page shows nothing extra.
- Music's own: one slur over two feathered beams — an accelerando in two groups under one phrase.
**The recommendation made:** the ribbon — the arc's own thickness is the activity — because it stays one object and needs no reading of a second graph; the strip under the staff then goes. **Not built; his word first.**

## §282 · 2026-11-20 · the inner movement ON the arc — the ribbon, and the stroboscopic version beside it

**His words:** "yes lets try the ribbon and then can I see a stroboscopic version".

**Built (`tools/gravity_furniture.js`, `flow.style`; two pages in the workshop, "prototype: ribbon" and "prototype: strobe"):**
- THE RIBBON — the GC arc itself drawn as a filled band, magenta: its width runs from the GC line's own 1.5 px to 13 px at the hand's busiest, by the same busyness as §279 (each played note a bell 0.12 s wide, as tall as its loudness, summed, stretched between its low and high over the arc, power 1.6). The fall and the rebound are two bands meeting at the impact; the impact's ring stays, filled white. In the prototype it reads: fat at the entry (the first burst), thinning to a line through the middle of the fall, swelling into the impact (the second burst), and still broad up the rebound to the last note (the six notes after the impact are close together and loud).
- THE STROBE — the arc the thin GC line, with a TICK across it at each played event, 11 px long, at right angles to the arc; two or more notes together a heavier tick. Six ticks crowd at the entry, one stands alone halfway down, one sits on the impact, four on the rebound.
- The strip under the staff is gone from both (kept as `style: "strip"`, the page name `gravity-proto-strip`, not in the picker).
**Checked once:** both pages rendered to images from the server's own answers.
**Seen, for his eye:** on the ribbon the broad rebound makes the end of the arc as heavy as its start; on the strobe the ticks at the entry sit on the flat top of the arc, where the arc itself shows no motion yet — the GC's fall (power 3.4) keeps the ball high for the first half of its time.

## §283 · 2026-11-20 · the ribbon taken (his "maybe") — more contrast, a ball that shows outside it, the top of the picture in view

**His words (on his screenshot of the ribbon page, its top cut off):** "lets go with the ribbon, maybe, let exaggerate the contrast , I guess make the thickest part thicker, and can you do something with the ball, like a certian amount of the balls area should be visible outside the ribbon, and can you fix my view so I can see more of the top of the image".

**Changed (`bank/gravity_proto.json`):**
- THE CONTRAST — the ribbon's greatest width 13 → 24 px (three staff spaces) and the exaggeration's power 1.6 → 2.4, so the thin stretch stays a line and the two bursts stand out more.
- THE BALL — its radius is the GC's own 5 px or 1.35 × the ribbon's half width where it rides + 2 px, whichever is larger (`flow.ballOverRibbon`), with a white rim 1.6 px wide, so a ring of the ball always shows outside the ribbon. The same on the page and in the film.
- THE VIEW — the arc's top was cut because its apex stood 8 px under the picture's edge and the ribbon is wider than that. Now the arc keeps clear of both edges by the ribbon's half width, and the picture runs lower: the band 628 … 780 (was … 752), what stands under the piano's lane covered in white (`coverFrom` 752). The arc's fall is the same height as before (116 px).
**Checked once:** the page rendered to an image — the whole ribbon inside the picture, top and bottom. The ball's new size was not seen moving (the same function in the page and the film; his eye).
**Seen:** the rebound's ribbon is at its widest right after the impact and passes behind the second shape's box.

## §284 · 2026-11-20 · the name: ACTION NOTATION; the stutter notation held

**His words:** SW-84 (the sketch pad): "Let's call this shape action notation. We have the standard notation for these fixed structures, and that can be interspersed with this type of notation … one other, which is kind of like a stutter notation, or kind of quick repetitive shake. But just hold that. Let's finish this one up". Written down as it stands in `docs/NOTATION_SCHEME.md` § 3 — each part with whose decision it is, and what is still open. Nothing built.

## §285 · 2026-11-20 · the name corrected: SHAPE ACTION NOTATION

**His word:** "Shape Action Notation". §284 took "Let's call this shape action notation" as naming it "action notation"; the name is all three words. `docs/NOTATION_SCHEME.md` § 3's heading and the sketch pad carry the correction; §284 stands as written (append-only).

## §286 · 2026-11-20 · a fourth kind named: the pointillistic, CONSTELLATION NOTATION, over a zone

**His words:** SW-85 (the sketch pad): "a fourth, which is more of a pointillistic. Maybe this is where we use the constellation notation … a sort of pointillistic density rather than providing precise rhythmic locations. Over a zone." The four kinds, as the AI reads them: standard notation (the fixed structures) · Shape Action Notation (a hand's flow into a gravity) · a stutter notation (held) · constellation notation (density over a zone, named for later). The star chart of §276 — dots joined by thin lines, taken out of the arc at §279 — is the nearest thing already drawn. Nothing built.

## §287 · 2026-11-20 · constellation notation, a second thought — the points are notes on the staff, joined by lines or spokes

**His words:** SW-85's second word (the sketch pad): each unit of the constellation "instead of a dot being the actual note on a staff or a few notes on the staff connected like with a constellation type of thing or spokes". The AI's reading there: exact pitches on the staff, thin joining lines for belonging, no rhythm in the horizontal; two forms, a web and a hub with spokes. Noted; nothing built.

## §288 · 2026-11-20 · Shape Action Notation locked; the stutter and the short burst — what the playing after the prototype shows

**His words:** SW-86 (the sketch pad): "I think we can lock that for now … the gestures that follow are good to test the repeated sort of stutter … And then there's maybe a shorter arc that just bursts … probably just a shorter GC, but let's consider if it should be something different".

**Read (the heads page's IR, each hand's events — notes within 45 ms one event — 158.4 → 170 s):**
- A STUTTER, clear: the RIGHT hand, 159.27 → 160.28 s — B5 · B5 · B5 · A#5 · A#5+B5 · A#5 · A#5+B5 · A#5+B5: eight strikes on two neighboring keys in 1.0 s, 0.10 … 0.27 s apart (mostly about 0.13 s, near eight a second), loudness 53 … 125, running straight into the big landing at 160.40. A shorter one: the LEFT hand, 161.88 → 162.10 — E5+F5 · E5 · E5+F5, three strikes. What marks it: the PITCH stays (one or two adjacent keys), only the striking repeats — unlike a flow, where the fingers move through a hand's shape.
- SHORT BURSTS: the LEFT hand, 160.19 → 160.43 — A#3+F4 · F#4+F#4+G4 · a seven-note cluster C5 … E5: three events in 0.24 s, sweeping UP a twelfth into a cluster. The LEFT hand, 160.96 → 161.23 — C#5+D5+E5 · F5 · E5 · C5+D5: four events in 0.27 s inside a fourth, no heavy moment. The RIGHT hand, 160.40 → 160.66 — three events in 0.26 s.

**The AI's thoughts, put to him (nothing decided, nothing built):**
- THE STUTTER as a member of the same family: the key or two keys written once (a small boxed shape, or plain notes), and for the motion a LINE WITH TICKS across it — the stroboscopic marks of §282, which he asked to see: evenly spaced ticks read as repeated strikes; not counted, only "about this fast"; the line as long as the stutter lasts, bending into an impact where it runs into one. Considered and set beside it: the standard tremolo (three slashes — says "as fast as possible", loses his rate) and Recombination's uneven-group sign (a floating beam with one stub per strike and the wavy stroke — it counts the strikes).
- THE SHORT BURST is probably NOT a shorter GC: the GC is read by following the ball's fall, and piece 2's preset gives that fall 0.6 s; these bursts are over in a quarter of a second — nothing to follow. It reads better as a FIXED thing: where the notes matter, the scattered grace of §263; where only the sweep matters, piece 2's own sign for a strum — the cluster bar with an arrowed arpeggio (`PERCUSSION_STAFF_SCHEMA.md`: "cluster bar + up-arrow arpeggio"), the arrow saying up or down.

## §289 · 2026-11-20 · the burst at 160.19 s — a grace group, not a strum (the AI's answer, his to confirm)

**His question:** "let's do the burst. Which one is this? Is this the scattered grace note or the arpeggio strum?"
**The burst read again (the left hand, 160.187 → 160.537 s):** A#3 (160.187) and F4 (160.213) · F#4 · G4 · F#4 again (160.277 … 160.299) · then C5 · C#5 · D5 · D#5 · E5 with two doubled strikes (160.428 … 160.537). Three placements of the hand climbing a twelfth: a wide pair, a tight group a half step above its top, then a chromatic cluster a fourth higher.
**The answer given:** the grace kind. A strum's sign (the cluster bar with an arrow) says "every key from the bottom to the top"; here that would claim nineteen keys where three separate groups were played, with a fifth and a fourth left empty between them. Written as a beamed grace group in ONE hand — the form of figure 6 (§262), three partials at equal distances — with the third partial, five chromatic notes, as the CLUSTER BAR of §277. Strictly it is not the "scattered grace" of §263, which is two hands across a shared span. Not built; his word first.

## §290 · 2026-11-20 · the burst is TWO hands — a correction; and a page that shows the burst alone

**His words:** "1 or 2 hands there?" — the AI first answered about the moment as a whole, then: "no I mean burst" — and: "can I just see just the burst, the no heads for the burst in the respective hands? … plain small node heads, but put them in appropriate staff."
**The correction to §289:** the burst is in BOTH hands. The lower hand's three groups (160.19 → 160.54 s: A#3 + F4 · F#4 + G4 · the cluster C5 … E5) and the upper hand's two (160.40: A#5 · B5 · F6 · G6; 160.50: F5 · C#6 · D6) — so it is the scattered grace of §263 after all (two hands over a shared span), not a one-hand grace group. The upper hand comes into it straight out of its B5 / A#5 stutter, which so ends at 160.40.
**Built:** the workshop's page "burst" (`bank/burst_proto.json`: each hand's own span — the lower 160.18 … 160.56, the upper 160.39 … 160.56 — and the view 159.95 … 160.85): only those notes, as plain heads at 0.8 on their own staves, at their played times, no accidentals (the heads page's IR). Nothing else is drawn. **Checked once:** rendered to an image — three groups climbing on the lower staff, two on the upper (the engine's own 8va signs stand over the high ones).

## §291 · 2026-11-20 · the burst's notes on the ribbon page, just after the ribbon

**His words:** "And you put them in with the ribbon. And can you put them in just after, just the burst ones, just after the ribbon?"
**Built:** the prototype page now also draws the burst's notes (`bank/gravity_proto.json` `also`: the lower hand 160.18 … 160.56, the upper 160.39 … 160.56 — §290's spans) as plain black heads at their played times, each on its own staff; nothing else played is drawn. For the upper hand's notes the picture shows BOTH staves (the band 546 … 780); the arc keeps its own lane on the lower staff (`arcBand` 628 … 780), so the ribbon is where it was. The upper staff is empty until the burst.
**Checked once:** rendered to an image — the ribbon and its two shapes on the lower staff, then, 0.55 s after the ribbon's end, three groups on the lower staff and two on the upper.

## §292 · 2026-11-20 · the scattered strike — what synthesi-alpha's animation does, and the brainstorm

**What prompted it:** SW-87 (the sketch pad): the scattered strike, "throwing a handful of pebbles in the air"; look at the animations of *synthesi-alpha*; open to alternatives; the GC with the grace may be enough.

**Lineage first — read: `synthesi-alpha/engine/score-anim.js`** (the shared animation core of that piece's score). Its unit is a GRAIN drawn as up to four pieces. As the cursor reaches a grain its pieces LEAP and come back by one function, `flight(dt, rise, settle)`: out fast (u·(2 − u) over the rise), then "gravity home" ((1 − v)^1.6 over the settle); the animation is LED by the grain's own rise so that the PEAK of the leap lands exactly as the cursor arrives (its comment: triggering at the true time "read as late"). With it: a swell and a paling that relax over the tail, blades that sway at rest, ripple rings on a 0.28 s grid, and a "leaf-blower" swirl of particles. So the pebble throw exists there as motion: fast out, gravity home, the peak on the cursor.

**The AI's ideas, put to him (nothing built):**
- The note heads themselves as the pebbles: at rest they stand in their places on the staff; as the cursor arrives they leap and fall back by synthesi-alpha's `flight`. On paper nothing shows of it, so a still sign is needed with it.
- A still sign for the throw: thin lines fanning from ONE point to each head — a hub with spokes (his own second thought for the constellation, SW-85), the point being the hand that throws. It says one impulse, many arrivals.
- What it sits beside: the scattered grace of §263 (stems, beams, the wavy slash — the notes exact and in order), the arrowed arpeggio (too orderly: it promises bottom to top), several small GC balls landing a hair apart (precise, likely overdone).
- The GC stays for the WHEN, as in his ensemble writing; the new sign says the HOW.
**The recommendation:** the fan — plain heads, exact pitches, thin lines from one point under them — with the heads' leap as its animation, and one GC ball for the moment; to try on the burst at 160.19 s that is on the ribbon page now.

## §293 · 2026-11-20 · the rethink (SW-88) — the chord changes of both hands, three alternatives to look at

**His words:** SW-88 (the sketch pad): the action gesture for both hands together "in the middle, sort of", his playing "a sort of guideline"; the chord changes "in the different hands"; "give me a couple alternatives of what the [chord] changes would look like … how often I want them to be. Does it make sense to have them? … maybe just for these 3 parts."

**The passage read: 157.6 → 160.7 s, both hands** (the flow, the stutter, the burst).
- THE RIGHT HAND keeps one small place for most of it: A5 · B5 · C6 with one F6 (157.68 … 158.69), then B5 and A#5 struck over and over (159.04 … 160.28, the stutter) — and changes only in the burst: A#5 · B5 · F6 · G6 (160.40), F5 · C#6 · D6 (160.50), F5 · G5 (160.66).
- THE LEFT HAND covers B3 … G4 through the whole flow (the half-step shifts of §275 inside it), then climbs in the burst: A#3 + F4 (160.19), F#4 + G4 (160.28), the cluster C5 … E5 (160.43).
- So the shape changes are RARE through the flow and the stutter (about 2.5 s on one place per hand) and CROWDED in the burst (three changes per hand in 0.4 s).

**The alternatives' one knob (`tools/chord_changes.js`, `bank/chord_changes.json`):** SPAN — how many semitones a hand may reach before its shape is written again. Each hand's events are read in order (notes within 45 ms are one event, never split); an event joins the current shape while the shape stays within the span; the first that would stretch it further begins a new shape, written at its own moment. Drawn as Shape Action Notation draws a shape (the cluster bar for four pitches or more a whole step apart at most; otherwise all the notes; accidentals; the thin box); a box that would run into the one before it stands just after it.
- **FEW (an octave, 12):** right 2 shapes (157.68: six notes A5 … G6 · 160.50) — left 2 (157.71: the bar A#3 … G4 · 160.43: the bar C5 … E5).
- **SOME (8):** right 4 (157.68 · 160.40 · 160.50 · 160.66) — left 4 (157.71: the bar B3 … G4 · 160.19 · 160.28 · 160.43).
- **MANY (6):** right 6 (157.68 · 158.69: the single F6 · 159.04 · 160.40 · 160.50 · 160.66) — left 6 (157.71 · 158.33 · 159.28 · 160.19 · 160.28 · 160.43).
Tried and not kept as alternatives: 14 (one shape for the whole right hand — it says nothing), 9 and 7 (between the three).

**Seen on the three pages:** in FEW the right hand's first shape is six notes that are not a cluster (A5 · A#5 · B5 · C6 with F6 and G6 far above) — a wide box that reads as a chord, which it never was; in SOME and MANY the burst's boxes crowd so that three of them had to be pushed right of their moments; MANY's extra changes in the flow (158.33, 159.28 in the left hand) are the half-step shifts he asked NOT to mark near the impact.
**The pages:** "chords: few / some / many" in the workshop — the played notes kept faint (30 %) under the boxes, both staves. **A known flaw of the reference:** the engine folds the right hand's high notes under an 8va, the shapes are written at pitch with ledger lines — the faint heads and the boxes sit an octave apart on the upper staff.
**Not done:** the one gesture in the middle; looking wider than this passage.

## §294 · 2026-11-20 · the shapes by HIS criterion — a pitch set that lasts; 152.4 → 170 s

**His words:** SW-89 (the sketch pad): "the criteria should be if it's like a pitch set … a group of notes that is used for a certain duration … does that group of notes change at a certain point? Or it could be that it's just mostly a bottom and the top cluster all the time … the specific harmonies for certain points, we'll just write those in as actual notated gestures … a second pass … can you do a slightly longer pass? … take out all the other graphics then, all the lines and yellow boxes".
**Rejected by him:** §293's span alternatives ("your approach to these is maybe not the correct one"). The three pages are out of the picker; the code stays.

**The rule built (`tools/chord_changes.js` `persistent`, the numbers in `bank/chord_changes.json` `sets`):** a hand's set is FOUNDED on what it plays in its first 0.8 s (while that stays within 9 semitones) and then HELD — it does not grow. A later note within 2 semitones of the place belongs to it. An event outside it begins a NEW set only if at least 60 % of the notes of the next second are outside it too; otherwise it was a passing REACH and is left out of the shape. A set lasting under 0.8 s is BRIEF — one of his particular harmonies, for the second pass — and gets no box.
**A dead end on the way:** the first version let the place grow by 2 semitones with every note that touched its edge; over 17 s it swallowed the whole right hand (C#5 … A6, 21 pitches) and most of the left. Holding the founded place is what makes a wandering hand visible.

**The result, 152.4 → 170 s:**
- THE RIGHT HAND: ONE set for the whole 17 s — E5 … F6, fourteen pitches, 180 notes, with 27 reaches beyond it. His "it could be that it's just mostly a bottom and the top cluster all the time".
- THE LEFT HAND: FOUR sets — C#4 … A4 (152.65 → 159.49, 6.8 s, 12 reaches) · A#4 … F#5 (160.43 → 163.25, 2.8 s) · E4 … D5 (163.51 → 167.65, 4.1 s) · A#4 … F5 (167.75 → 169.36, 1.6 s) — and TWO brief ones left for the second pass: 159.54 → 160.30 (the reach down to A#3 before the burst) and 169.45 → 169.95.
- All five are cluster bars. A change of shape comes every 2 … 7 s in the left hand and never in the right.

**The page:** "chords: pitch sets" — the five bars boxed where each begins, the played notes faint under them; the first sorting's arcs and amber boxes are never drawn on the chord and burst pages now (they were the Gravity overlay, still on). The faint heads now stand at pitch: the engine's 8va folding is off on these pages, so heads and shapes agree on the upper staff (§293's flaw).
**Seen:** the right hand's one bar begins at 152.54 and says nothing for 17 s — whether a shape is said AGAIN after a wall or a silence is not decided.

## §295 · 2026-11-20 · the ribbon for BOTH hands — it moves and doubles in length; three vertical placements

**His words:** SW-90 (the sketch pad): the pitch sets "for now"; the specific harmonies as poles in "the afterpass"; "can you do an assessment of whether it still stays there for including both hands? And then let's reposition the ribbon. And also like its length and arc … let's find the proper vertical placement. I guess in between for now … give me some options."

**The assessment — NO, it does not stay (both hands' notes, 157.4 → 161.5 s; notes within 45 ms one moment; the weight of a moment = the sum of its notes' loudness):**
- The heaviest moment of both hands is the 14-note landing at 160.40 (weight 1444). The left hand's impact at 159.16, where the one-hand arc landed, weighs 335 — a quarter of it, and no more than the opening jab at 157.68 (332).
- The run has no silence over 0.3 s from 157.68 to 161.23: one gesture, 3.55 s long (the one-hand arc was 1.82 s).
- So the arc becomes 157.683 → THE IMPACT 160.404 → 161.23: the fall 2.72 s (was 1.34), the rebound 0.83 s (was 0.48); the impact one and a quarter seconds later.
- The busyness of both hands (the bell sum of §279, read every 0.1 s, in tens): 45 through 157.7 … 158.3 · a dip to 22 at 158.6 … 158.8 · 60 at 159.2 (the left hand's old impact — now a swell on the way) · a dip to 25 at 159.8 … 159.9 · then 53 · 86 · 122 · 150 at 160.1 … 160.4 · 49 at 160.7 · a last swell of 65 at 161.0. His "the overall accel comes in bursts": three, each larger.

**Built (`bank/gravity_both.json`; the pages "both hands: ribbon between / inner / across"):** one ribbon for both hands on that arc, drawn by the same `gravity_furniture.js` (its own shapes switched off); each hand's shapes are §294's pitch sets — the set in use at the gesture's start SAID at its start (the right hand's E5 … F6, the left's C#4 … A4), a change inside the gesture at its own moment (the left hand's A#4 … F#5 at 160.43); no played note drawn. The three placements differ only in the ribbon's lane:
- BETWEEN — inside the gap between the staves (the upper staff's bottom line to the lower staff's top line): the fall is 28 px, the ribbon at most 12 px. Nothing crosses a staff; the arc is nearly flat.
- INNER — from the upper staff's middle line to the lower staff's middle line: a fall of 72 px, the ribbon to 18 px. It crosses the inner half of each staff.
- ACROSS — from above the upper staff to below the lower: a fall of 198 px, the ribbon to 24 px. A true arc; it crosses both staves and passes the shapes.
**Checked once:** the three pages rendered to images.
**Seen, for his word:** (1) with the landing four times heavier than anything before it and the exaggeration at 2.4, the ribbon is a hair until its last half second — the two earlier swells do not show; a lower power would bring them back. (2) In INNER and ACROSS the ribbon's thick part meets the left hand's new shape at 160.43 (the box stands over it). (3) The ball's fall now lasts 2.7 s on piece 2's curve (power 3.4): it hangs near the top for the first second and a half.

## §296 · 2026-11-20 · the method stated — playing suggests, the shape is designed; the ribbon re-drawn by his edit; the scattered strike's curtain and pebbles

**His words:** SW-91 (the sketch pad, whole). The points acted on: "let's go with the last one, the full grand staff" · "the bounding box should be completely transparent. So just a border, no fill" · "my playing will suggest certain shapes and then we'll develop those into more substantial shapes that really look like some kind of action that the player can follow" · the ribbon's edit (the fall thin while almost level, then growing all the way down, the thickest thicker; the rebound matched at the impact, to none, then medium at the tail) · "maybe as a first pass, and then I can look at the actual shapes that get generated and do an edit like this" · the scattered strike as "a curtain, like a shower … a transparent block", the pebbles rising in a backswing and dropped.

**THE METHOD, as it now stands (his, in the AI's words):** (1) the playing is measured — the gesture's span, its heaviest moment, its busyness (§295); (2) that gives a FIRST-PASS shape; (3) he looks and edits the shape IN WORDS; (4) the edit is kept as the gesture's own DESIGNED PROFILE, and the measured curve is no longer drawn. The profile is data per gesture (`flow.profile`), so each ribbon carries its own dynamic.

**The ribbon re-drawn (`bank/gravity_both.json`; one page now, "both hands: ribbon", the lane across the grand staff):**
- THE FALL: the width follows the DROP ITSELF — how far the arc has fallen, to the power 1.3 — so it is a hair along the level top and grows continuously to the impact. Measured half widths along it: 0.75 px to 158.1 s · 1.3 at 158.96 · 2.8 at 159.39 · 6.2 at 159.81 · 13 at 160.24 · 17 at the impact (the greatest width 24 → 34 px).
- THE REBOUND: keyframes [how far up, width]: 0 → full · 0.42 → none · 0.62 → none · 1 → half; eased between. It leaves the impact at the fall's full width, thins to the bare line through the middle, and ends at a medium width.
- Rejected for this gesture: the measured busyness as the width (§295: a hair until the last half second, the early bursts lost).
**The shapes' boxes:** no ground any more — a border only, the staff lines through them (`chord_changes.js`). The locked one-hand prototype (§283) keeps its own.

**THE SCATTERED STRIKE (the workshop's page "scattered strike", `bank/burst_proto.json` `curtain`):**
- THE CURTAIN: a transparent slate block (13 %) with a faint border, in the picture itself: from 0.8 ss before the strike's first note to past its last, at least 6 ss wide, over the grand staff and 3 ss beyond each staff. The strike's notes stay as plain heads inside it.
- THE PEBBLES (the page's animation; eleven small slate ovals): at rest in a little pile at the curtain's foot, left; from 0.605 s before the strike they RISE together to the curtain's top — 0.605 s is the GC's own fall time in piece 2's preset, and the rise is the GC's rebound curve (fast, then slowing), so the backswing matches the arc's physics; then each DROPS at its own moment, spread across the strike's 0.36 s, by the GC's fall curve (power 3.4), drifting to its own place along the curtain's foot. One pebble's drop lasts 0.38 s.
- First drawn dark like the note heads — at once mistakable for notes; tinted slate.
**Checked once:** the ribbon page rendered to an image; the strike's curtain rendered with the pebbles placed by the same arithmetic at two moments (0.3 s before the strike, 0.2 s into it). NOT seen: the pebbles moving on the page; they are not in the film yet.
**Open:** the first-pass generator of step 2 for a NEW gesture is not built — this ribbon's profile was written from his words.

## §297 · 2026-11-20 · the ribbon back on its first span; the three-part prototype on one page

**His words:** SW-92 (the sketch pad): "I was wrong about changing the … position of the ribbon … Did you move the ribbon to include what I considered the pebbles? … let's do this as a prototype, these three sections … keep that gesture just with the new vertical size, that ribbon, and then can you put the curtain over those notes to the right … the third part of that sequence"; and for later: assigning ribbons to sections, an initial shape to tweak, "the minimum amount of time for transitions or to hold a certain texture … that final tail is too short … It's hard to increase activity for that small amount of time."

**The answer to his question:** yes — §295's both-hands arc landed at 160.40, the middle of the burst (160.19 … 160.55), because by weight that IS both hands' heaviest moment. So the measurement and his ear part ways here: the weight says one gesture into the landing; he hears a flow, then repeated notes, then a strike of its own. His ear decides; the both-hands page stays in the picker as the record of the other reading.

**Built — the page "prototype: ribbon" is now the three-part prototype (`bank/gravity_proto.json`):**
1. THE RIBBON — its span unchanged (157.821 → 159.159 → 159.641); its lane now the full grand staff (the arc's top above the upper staff, its impact below the lower: a fall of 188 px, was 116); its width by the designed profile of §296 (the fall growing with the drop; the rebound full → none → half), the greatest width 34 px. Its two shapes as before, their boxes now without ground.
2. THE REPEATED NOTES — nothing drawn yet: 159.64 … 160.19 is empty staff.
3. THE SCATTERED STRIKE — the curtain over the burst's notes (160.19 … 160.55, both staves) with the eleven pebbles; on this page the pebbles and the ribbon's ball animate together.
**Checked once:** the page rendered to an image.
**Seen, and it is his own point:** on this ribbon the rebound lasts 0.48 s, so "full → none → half" happens in under half a second — a thin line and then a sudden wedge at the very end. The least time a change of thickness needs is not yet a rule.

## §298 · 2026-11-20 · the scattered strike on synthesi-alpha's substrate and flight — read from the code, ported

**His words:** SW-93 (the sketch pad): "have a closer look at Synesthesia Alpha … the cursor would run through and sweep up the substrate, and then they would fall … I want a proper like substrate, not the one you just made … the physics we came up with there … it'll just have to be like before the cursor gets there" · "It's probably the actual code you need to look at" · two screenshots.

**Read — the code (lineage first):**
- THE FLIGHT, `synthesi-alpha/engine/score-anim.js`: one function, `flight(dt, rise, settle)` — out fast, u·(2 − u) over the rise; then "gravity home", (1 − v)^1.6 over the settle. A sound grain is a small cluster of four rocks; each rock rises to ITS OWN fraction of the cloud (in the data the four lifts of one cluster run about 110 · 74 · 33 · 3 px), the cluster's direction is +1 or −1 (up or down from the center line — the columns above and below it in his screenshots), and while aloft each rock "boils" (a small sine wobble on its own seeded frequency and phase) and drifts sideways. The animation is LED by the rock's own rise plus 0.05 s so the peak of the throw lands as the cursor arrives. The data's own numbers: rise 0.43 s, settle 0.25 s (its journal: dry sand drops in about 0.35 s). Seven "wind" variants beside it (suction, reverse pull, vortex, gusts, creep, leaf-blower) — not taken.
- THE SUBSTRATES, the generator `live-electronics-engine/tools/score_valpha.py`: eleven species as path recipes — `sand` (6 … 9 corners at random radii 0.45 … 1.35 r, straight edges: his "sand under a microscope — jagged, rock-like") · `smooth_rock`, the boulder (the same skeleton, the corners curved) · shards · commas · chains (two) · rings · tangles · blades · blocks · crosses · burrs. Grays 17 (near black) and 97.
- THE VIDEOS: none found in the repos by file search; his two screenshots stood in for them (the AI can read a video only as frames pulled from it).

**Built:**
- `tools/substrate.js` — seven of the species ported recipe for recipe (sand · boulders · shards · commas · rings · blocks · burrs). Not the identical rocks: that generator's random numbers are numpy's; the shapes are the same species.
- THE STRIKE (the workshop's curtain, both pages that carry it): a BED of rocks along the curtain's middle line (90 by default; about a fifth of them large), each with its own height (to half the curtain), up or down, its own boil and drift, 80 % near black and 20 % gray. THE FLIGHT is `flight` with rise 0.43 s and settle 0.35 s. THE ONE CHANGE he asked for: the whole bed is thrown BEFORE the strike — the rise begins 0.48 s before the strike's first note so the peak is on it — the rocks hang, boiling, and each comes HOME as the cursor reaches its own place across the curtain. The curtain itself is paler (7 %).
- Two small controls appear where a curtain is on the page: SUBSTRATE (the seven species) and × (how many), for his "find the right shape and the right density".
- The eleven slate ovals of §296 are gone.
**Checked once:** three stills drawn with the page's own arithmetic (at rest, at the top of the throw, mid-fall with the cursor inside the curtain) — at the top of the throw the sand fills the curtain above and below the middle line; mid-fall the rocks behind the cursor are home on the line and those ahead still hang. NOT seen moving.

## §299 · 2026-11-20 · the scattered strike as a real throw — ballistic pebbles, one scattered impact at the curtain's middle

**His words:** SW-94 (the sketch pad): "nail the physics of exactly as I described, throwing a handful of pebbles into the air … they sort of hang … the player can see them hit right about when the cursor is about middle of the container … like a single ball that's thrown up and there's an impact … a little bit scattered"; "the first one you did was too ordered"; a pebble-like substrate "with a little bit more weight"; "I don't know if we can look up or if there's physics that simulate that actual action".

**The physics — yes, and it is simple; nothing was looked up:** a thrown thing under gravity alone flies a PARABOLA. Its height over its flight is H · 4u(1 − u), u from 0 to 1: fastest off the hand, slowing to nothing at the top — that slowing IS the hang, it needs no extra pause — then falling faster and faster. Its flight time fixes its height (H grows as the square of the time) and the reverse. A handful leaves one hand at one moment at nearly one speed, so the pebbles' flight times differ by a few per cent: they land nearly together, a little spread in time and over the ground. That is the "single ball … a little bit scattered" he describes.
**What §298 had instead, rejected:** synthesi-alpha's `flight` (out fast, an eased return) thrown early and each rock coming home as the cursor passed ITS place — the returns marched left to right with the cursor: his "too ordered", and no single impact.

**Built (the curtain's pebbles, both pages; every number in `curtain` of `bank/burst_proto.json` and `bank/gravity_proto.json`):**
- THE THROW: sixteen pebbles in a small pile at the middle of the curtain's foot; each flies its own parabola — its flight about 1.0 s (`flightS`), differing pebble to pebble by 5 % (`flightSpread`, normally spread), its height following from its flight time, up to the curtain's top; they leave within 30 ms of each other; each lands at its own place across the floor (spread 17 % of the curtain's width either side of the middle, `landSpread`) and tumbles as it flies.
- THE IMPACT: the moment the cursor reaches the MIDDLE of the curtain (160.384 s here); the throw begins one flight time before it (159.38 — while the ribbon's gesture has just ended). With a 5 % spread the landings fall within about ± 0.1 s of it.
- AFTER IT: one small bounce each — a rebound keeping 0.28 of the speed, so 8 % of the height, lasting 0.28 of the flight — then still, where it fell.
- THE SUBSTRATE: synthesi-alpha's BOULDER recipe (the smooth rock: the sand's skeleton with its corners curved) at a small size, 2.6 px ± (the boulders there are about 20 px), grays 17 … 67: a pebble. The chooser and the count stay on the page (count now 3 … 400).
**Checked:** a film made with the page's own arithmetic, with the sound (`notation/video/clips/strike_throw.mp4`, 159.0 → 161.2 s; a scratch script, the workshop's own film still lacks the pebbles) — sent; two frames of it looked at: the handful hanging near the curtain's top at 160.02, and lying scattered along the floor with the cursor at the middle at 160.42.
**His to judge, by eye and ear:** the flight's length (1.0 s — a real throw this high on a page has no true scale; longer = slower and higher-feeling), the spread, the bounce. And one thing seen: the strike's NOTES begin at 160.19, 0.2 s BEFORE the impact at the curtain's middle — the pebbles land in the middle of the sounding strike, not at its start.

## §300 · 2026-11-20 · the throw taken ("that's the one") — denser, wider, the notes out of the curtain

**His words:** "Okay, that's the one. That looks good. Um, Let's see if we can't make it just slightly denser, slightly more pebbles. And then I don't know if you could have them have slightly more spread. They're sort of a little bit more around the middle … spread out a little wider and fall more or less across the whole curtain. Though the motion is nice, so if that's going to mess up the motion, we don't necessarily want to do that … And then, I don't know if you can put that animation into the workshop and you can remove those notes out of there."
**DECIDED by him:** the ballistic throw of §299 is the scattered strike's motion.
**Changed (`curtain` in both prototype files):** the pebbles 16 → 22; the landing spread 17 % → 27 % of the curtain's width either side of the middle (the landings now reach nearly both edges; a pebble that would land outside is held 5 px inside). The motion is untouched: only where each parabola ends is wider, so at the top the handful is about half as wide as on the floor. The strike's NOTES are no longer drawn in the curtain, on either page (`heads` false · `alsoHeads` false); they still give the curtain its place and width.
**The animation IS in the workshop** — the pages "scattered strike" and "prototype: ribbon" run it as the cursor plays (since §299); what he was sent was a film made beside it, because the workshop's "Make video" does not yet carry the pebbles.
**Checked:** the film remade and two frames looked at — the handful near the top, and lying across the curtain's floor after the impact.

## §301 · 2026-11-20 · the proper chord changes on the three-part prototype

**His words:** "And let's put in the proper chord. Put in the proper chord changes in there, even if they were going to be shown earlier. Just show me theirs for the prototype so I can just sort of see how everything sits."
**Built (`bank/gravity_proto.json` `pitchSets` true):** the prototype page's shapes are now §294's pitch sets, BOTH hands, each on its own staff — the one hand's two shapes of §276 … §280 are no longer drawn there. The set each hand is using when the ribbon begins is SAID at the ribbon's start though it began earlier (the right hand's since 152.54, the left's since 152.65): the right hand's cluster bar E5 … F6 on the upper staff, the left's C#4 … A4 on the lower. A change later on the page stands at its own moment: the left hand's A#4 … F#5 at 160.43 — which falls INSIDE the scattered strike's curtain. The boxes have no ground.
**Checked once:** the page rendered to an image.
**Seen, for his eye:** (1) the right hand's box at the ribbon's start sits where the ribbon begins — the hair of the ribbon runs out of its top; (2) the left hand's new shape stands inside the curtain, where the pebbles fall through it.

## §302 · 2026-11-20 · the pebbles at rest spread out; a fifth more of them

**His words (while §301 was being built):** "Then they're in a clump when they start. Maybe have them a little bit less of a clump, maybe spread out a little bit, just so it's clear that it's like a collection of pebbles. And you can actually increase the density a little bit more. You're like 20% of what's current."
**Changed:** the handful at rest lies along the curtain's floor about its middle — each pebble's place spread by 10 % of the curtain's width (`pileSpread`; it was 3 px, one clump) — and each still flies from where it lies to where it lands. The count 22 → 26 (a fifth more).

## §303 · 2026-11-20 · the stutter — a catalog of nineteen still signs for repetition

**His words:** SW-95 (the sketch pad): "What kind of comic book style, static notation is there for repetition? … Let's do something like the workshop where I did substrates … a page of various types of possibilities."
**Built:** `workshop/stutter/` — `candidates.js` (one drawing function per sign, the same file for the page and for a contact sheet) and `index.html`, served by the workshop's server at `http://localhost:5650/pages/stutter` (a new route `/pages/<name>` for catalog pages). Every candidate on the same small staff: the two neighboring keys of his stutter as a plain dyad, then about a second of repetition. Numbered only so one can be named in the chat; nothing is decided.
- **A · the comic's own marks:** 1 ghost copies (the note again and again, fading — afterimages) · 2 shake brackets (curved marks each side of the note) · 3 shake brackets, running · 4 speed lines · 5 radiating ticks (the ringing bell) · 6 impact stars in a row (a burst per strike) · 7 jitter outline (the note drawn off itself — a blur) · 8 zigzag.
- **B · marks along a line:** 9 ticks on a line (the strobe of §282) · 10 ticks, gathering (crowding toward the end) · 11 dots in a row · 12 broken bar · 13 chevrons · 14 coil · 15 wavy line.
- **C · music's own, for comparison:** 16 tremolo strokes · 17 beam with stubs (his uneven-group sign from Recombination, §557 there) · 18 feathered beam · 19 repeat box with a running line.
**Drawn from what the AI knows of comic conventions; nothing was looked up.** The drawings are plain SVG sketches, not engraved: the heads are ellipses, not LilyPond's glyph — a catalog for choosing a KIND; the chosen one is then built by the engraving rules.
**Checked once:** a contact sheet of the nineteen rendered and looked at; the two routes answer 200.

## §304 · 2026-11-20 · the stutter — he takes up 1 and 3; fourteen variations

**His words:** "1 and 3 are interesting. Can you maybe produce some variations or ones along those lines?" (1 = ghost copies, 3 = shake brackets running along.)
**Added to the catalog (`workshop/stutter/candidates.js`, family D, shown first on the page; numbers 20 … 33):**
- from the ghosts: 20 close (the copies overlap into one smear) · 21 hollow (the first note solid, the repeats outlines) · 22 shrinking · 23 gathering (crowding toward the end) · 24 the two keys in turn (the copies show which key — lower, upper, both — as he played it) · 25 ghosts in brackets (1 and 3 together).
- from the brackets: 26 both ways (pairs facing each other) · 27 doubled · 28 fading · 29 growing · 30 gathering · 31 tall (across the whole staff) · 32 on a ghost trail (a pale smear under the marks) · 33 the note at each end (a drawn stop).
What the variations vary: how the repeat is shown (copy · mark · both), and what else the sign can carry — a change over its length (fading, growing, speeding up), which key, a clear end.
**Checked once:** a contact sheet of the fourteen rendered and looked at.

## §305 · 2026-11-20 · the stutter's signs kept — 29, 23, 30 and their opposites; 29 in the prototype's middle part

**His words:** "Let's keep 29, 23, and 30, and their sort of inverses or variations. And let's put in 29 there and see how that looks."
**Kept (the sketch pad, SW-95):** 29 the shake marks GROWING · 23 the ghost copies GATHERING · 30 the shake marks GATHERING — with their opposites (28 fading; copies thinning out; marks spreading apart). The other candidates stay on the catalog page as the record.
**Built — 29 in the prototype (`bank/gravity_proto.json` `stutter`; the page "prototype: ribbon"):** the right hand's two keys, A#5 and B5, written once as PLAIN notes (no box — they are the notes themselves, not a hand's shape) by the same chord drawing as the shapes (LilyPond's heads, the upper one offset, the sharp, the ledger line); then the running shake marks, each taller and heavier than the one before (half height 0.6 → 2.1 ss, stroke 0.6 → 2.0 px), ending before the curtain.
**The fit, and what it shows:** the gap between the ribbon's end (159.64) and the curtain (160.19) is 0.45 s — at this page's scale about 9 staff spaces. At the catalog's spacing (2.1 ss between marks) only TWO marks fitted and the sign did not read; drawn at 0.95 ss, six do. The stutter he played is longer than its place here: it began at 159.27, under the ribbon's tail, and ran to 160.28, into the strike. So the three parts as they stand OVERLAP in the playing and are laid end to end on the page — his "figure out … the minimum amount of time … to hold a certain texture" (SW-92) meets this at once.
**Checked once:** the page rendered to an image (both spacings).

## §306 · 2026-11-20 · a chord symbol at the start of EVERY gesture, repeats included

**His words:** "Okay, and I think we should have, even if they're repeats, the chord symbols at the beginning of each gesture. And then let's go back to the beginning. Or if it's there, I'll find it. I just want to hear the opening part."
**HIS RULE:** each gesture begins with its chord symbol (the boxed shape), also when it only repeats the one before. It answers the question left open at §294 (whether a shape is said again): yes, at every gesture.
**Built (the prototype page):** a hand's shape stands at the start of every gesture it plays in, and it is the set the hand uses THROUGH that gesture — a change that falls inside a gesture is said at the gesture's start, not at its own moment (the left hand's A#4 … F#5, played from 160.43, now stands at the strike's start, 160.19). So: at the ribbon, both hands' clusters; at the stutter, the right hand's two keys A#5 · B5, now in a box as its symbol; at the scattered strike, both hands' again — the right hand's a repeat of the ribbon's. The left hand has no symbol at the stutter: it does not play in it.
**Checked once:** the page rendered to an image.
**His second sentence** (to hear the opening): the workshop's sound and pages cover the piano solo only, 146 → 258 s; its beginning is the page "spaced" from 147.4. The piece's own opening (Section 1, 12 → 146 s) is not in the workshop — told to him.

## §307 · 2026-11-20 · THE WORKING VERSION of the piano solo — one page that keeps the decisions; a ribbon, a pole, a pebble drop

**His words:** SW-96 (the sketch pad): "can we get like a working version that we work in and that keeps all our changes? … the first gestures are fine up to … the third arpeggio … don't include all the extra graphics, except for the ones we're going to add"; the ribbon about 151.2 → 152.5 with its hit at the two notes of 152.12; the three notes at 152.55 "beamed normal size notes … like a pole"; 152.9 → about 153.2 "a pebble drop accent"; "just thereabouts".

**Built — the workshop's page "working version" (first in the picker), from ONE file, `bank/piano_solo_work.json`:** the page of the standard figures (`s2-piano-solo`, the units file) with a list of GESTURES drawn over it. A gesture hides the played notes inside its span; nothing else is drawn (no first-sorting marks, no faint heads). From here on a decision of his is a line in that file or a unit in the units file — the page is rebuilt from them, so it keeps everything.
- THE FIGURES 1 … 5 (148.20 … 151.04) as taken. Figures 6, 7 and 8 (the grace figure, the scattered grace, the beamed three of 152.12) lie INSIDE the ribbon's span: they stay in the units file and on the page "spaced", and are not drawn here.
- THE RIBBON: 151.2 → the impact 152.123 → 152.5, across the grand staff; its width by the designed profile (the fall growing with the drop; the rebound from full down to 0.3 — a simple taper, because the rebound is only 0.38 s: §297's lesson). Fall 0.92 s.
- THE POLE: units 9a · 9b · 9c — G5 (152.537), D#4 (152.651), F#5 (152.731) — stems up, one 16th beam across the two staves, full-size heads, at their played places (no spreading asked). By the standing rules of the hand unit.
- THE PEBBLE DROP: the scattered strike's curtain and its 26 pebbles; his 152.9 … 153.2 widened to 152.82 … 153.23, the run actually played there (ten notes, 152.839 … 153.213), so none of it is left outside. Its impact — the cursor at the curtain's middle — falls at about 153.05.
- THE CHORD SYMBOLS: at the ribbon's start and at the strike's start, each hand's pitch set through that gesture (the sets now read over the whole solo, 146 → 253 s).
- After 153.23 the notes not yet taken stand as before (small heads) — the material still to be worked.
**In the code:** the workshop's server takes a list of gestures per page (several ribbons, several strikes; the page animates every ball and every handful); the curtain became a function. The pages "spaced" and "as played" were rebuilt for the pole.
**Checked once:** the page rendered to an image, 147.6 → 154.2 s.
**Seen, for his eye:** the ribbon's first chord symbols stand at 151.2, hard against the third arpeggio's wavy line; the pole's first note stands 0.04 s after the ribbon's end.

## §308 · 2026-11-20 · the working version, 153.7 → 155.7 s — three drop clusters, two repeats, a notated cluster on one stem

**His words:** SW-97 (the sketch pad): "the cluster at in both hands at 155.66. That's a notated one. One stem going up … starting at 153.7, there's two notes. That's one drop cluster. At 154.19, there's 3 … another drop cluster. then 2 at 154.7 … two different repeats starting at 155 all the way through to just before that notated bit … whatever clusters in the left and the right hand there."

**Written into the working version (`bank/piano_solo_work.json`, the units file):**
- DROP CLUSTERS (the scattered strike), each a curtain with its pebbles and both hands' chord symbols at its start: 153.7 → 154.1 (the chord of 153.85 and the note at 154.02) · 154.15 → 154.62 (the six notes of 154.23 … .33 and the note at 154.48) · 154.68 → 154.98 (154.74, the six notes of 154.79 … .82, the two at 154.91). Their impacts — the cursor at each curtain's middle — at 153.93 · 154.41 · 154.86.
- TWO REPEATS, 155.0 → 155.6, one per hand, a different kept sign each (the AI's reading of "two different"): the RIGHT hand sign 30, the shake marks GATHERING; the LEFT hand sign 29, the marks GROWING. Each begins with its chord symbol: the keys that hand plays in the span — the right hand's seven (E5 … C#6 with gaps: a chord of all its notes, not a cluster bar), the left hand's four (G4 … D5). A new gesture kind in the workshop, `stutter`; a repeat hides only its own hand's played notes. Signs 28 and 31 (their opposites) are drawn by the same code when asked.
- THE NOTATED CLUSTER: unit 10 — the ten notes of 155.646 … 155.695, both hands, ONE stem, up, with a 16th flag as the other single figures have (he did not name a flag: the AI's, his to change).
**Checked once:** the page rendered to an image, 150.8 → 156.2 s.
**Seen, for his eye:** (1) the three drop clusters stand so close that their curtains OVERLAP (each has a least width of 6 ss and a pad each side); (2) with a one-second flight, a drop cluster's pebbles are thrown while the one before is still falling; (3) the right hand's repeat has room for six marks only, after its wide chord symbol; (4) the engine writes an 8va over the notated cluster's top notes.

## §309 · 2026-11-20 · the working version tidied at his word — slivers, trimmed repeats, no 8va, room above, the second drop earlier

**His words:** "you can just go ahead and narrow those pebbles. So there's a bit of a gap between all three. And you can end the one before the chord boxes … the repeated ones, you can scoot them over to the right a little bit and … the top one, you can take out a few of the ending ones, and the bottom one, you can take out a few of the beginning ones … shrink that third blue pebbles one. So there's … just a sliver between all four of those. And it's unclear what the Ottawa in that notated one goes to. Why don't, since we'll have room, why don't we not use, especially on chords, not use Ottawas? Let's see how that looks … for the workshop, actually, can you make the lane or just give me more room? They're pushing right up against the top of the page … maybe all the way to the what would have been the next staff up. And I'd say the second pebbles is late … I hear like a stripe towards the beginning of that container. You don't have to worry about like creating a principle just for that one. Let's make it a little earlier."

**Changed (`bank/piano_solo_work.json`; the workshop's server):**
- THE SLIVERS: a curtain now ends half a staff space (`sliverSs`) before the next gesture begins — the next curtain's own front edge, or a repeat's chord symbol — and a curtain's least width went 6 → 3 ss so it can be that narrow. The three drop clusters and the repeats' boxes no longer touch.
- THE REPEATS: drawn from 155.08 (were 155.0; they still take their keys and hide their hand's notes from 155.0); the right hand's without its last mark, the left hand's without its first three (`dropEnd` · `dropStart`). He said "a few" off the top one's end: after the move right only four fitted, so ONE was taken, leaving three.
- NO 8va ON THIS PAGE (`noOttava`): the engine's octave folding is off for the working version — every note at pitch with its ledger lines. A TRIAL at his word ("Let's see how that looks"), on this page only; the pages "spaced" and "as played" and the score keep the standing rule until he decides.
- ROOM ABOVE: the picture begins 76 px higher (the band 470 … 780, was 546 … 780) — up into the space of the percussion staff above; the other parts' staves are not drawn on this page (`onlyPiano`: a style line in the picture hides their systems; a white patch covers the brace of the part above).
- THE SECOND DROP CLUSTER'S IMPACT set by hand to 153.86 (it was the curtain's middle, 153.93). The analysis he asked for: the container holds the four-note chord struck at 153.853 … .887 (loudness 116) and one soft note at 154.02 — his "stripe towards the beginning" is that chord. No principle made of it, as he said; but it is the same thing §299 noted of the first strike (the notes begin before the curtain's middle).
**Checked once:** the page rendered to an image, twice (a stray note at 155.079 and the upper part's brace showed in the first; both gone).

## §310 · 2026-11-20 · the working version, 156.4 → 161.3 s — an arpeggiated chord, a ribbon drawn from the playing, a repeat, two pebble drops

**His words:** SW-98 (the sketch pad): "156.39, make that a chord with the arpeggio symbol … a ribbon from 157.66 … let's make these from the times of the actual partials … to the ones at 159.66. impact at the partial at 158.55 … Try to get the ribbon to reflect some of the changes there … the thickness and thinness. repeated notes from 159.79 to 160.3 And the chunk from 160.4 to 160.68 pebble drop." · "And then from 160.96 to 161.26, another pebble drop."
**HIS STANDING INSTRUCTION, now a habit of the build:** the times he gives are clicked approximations; each gesture is set on the partials actually played (and a gesture hides the notes within 20 ms of its ends).

**Written into the working version:**
- UNIT 11 — the five notes of both hands at 156.409 … 156.471 (G3 · D4 · E4 below, A5 · E6 above): one chord, stem up with a 16th flag, the arpeggio sign.
- THE RIBBON 157.683 → the impact 158.544 → 159.641 (his 157.66 · 158.55 · 159.66 on the partials; the impact is the C6 struck at 158.544, loudness 125). `fromPlaying`: its width is the MEASURED busyness of both hands inside its span (the bell sum of §279, exaggerated only a little, power 1.3), not the designed profile of §296. What it shows: broad through the first 0.7 s (half width about 8 px), thinning to a HAIR from 158.5 to 158.8, swelling to its widest at 159.2 (the left hand's old impact), tapering to the end.
- **A thing he should know of it:** the impact he chose is where the ribbon is THINNEST. The C6 at 158.544 is a single loud note in a sparse half second; the busyness measures how MUCH is played, and there it is least. So this ribbon falls broad and lands on a hair — the opposite of the designed one. Whether the impact should carry its own weight on a played ribbon (loudness, not count) is open.
- THE REPEAT, the right hand, 159.786 → 160.28: its two keys A#5 · B5 boxed, then sign 29, growing, into the pebble drop.
- THE PEBBLE DROPS: 160.4 → 160.67 (the landing and the two notes at 160.665) and 160.96 → 161.24.
- CHORD SYMBOLS: `shapeRule.clusterMaxGap` 2 → 3 on this page — a set of four pitches or more with no gap over a minor third is a cluster bar. The left hand's set read over the whole solo came out as a nine-note chord with six accidentals at the ribbon's start; as a bar it is C#4 … A4.
**Left on the page, his to place:** the left hand's notes of 160.19 … 160.30 (the first two events of its climb) stand as small heads between the repeat and the pebble drop — the repeat is the right hand's only.
**In the code:** a gesture that began before the page's left edge is clipped at the music's start.
**Checked once:** the page rendered to an image, 155.9 → 161.7 s.

## §311 · 2026-11-20 · THE MULTI-BOUNCE RIBBON — three impacts in one ribbon, 161.79 → 163.95 s

**His words:** SW-99 (the sketch pad): "can you make a ribbon with like a multi-bounce? … the first bounce is at 162.46. It starts at the partial there at 161.79. Another bounce at 163.09. And the final bounce at 163.71 with just a small tail up … if you need to make [chord] changes throughout that three bounce, please do. It seems … around like 163, the notes seem a little bit denser. I could be wrong."

**His ear checked (both hands, 161.7 → 164.0 s):** notes per quarter second from 161.75 — 5 · 4 · 8 · 9 · 4 · 12 · 3 · 17 · 2. He is right: the quarter from 163.0 holds 12 notes, three times its neighbors (4 before, 3 after) — the ten-note cluster at 163.04. It is not the densest moment of the passage (the seventeen-note landing at 163.60 is), but it is a clear swell in the middle.
**The bounces, set on the partials:** his 162.46 lies between two heavy moments 0.1 s apart — five notes at 162.409 (weight 509) and seven at 162.513 (652); the bounce is put on the heavier, 162.513. His 163.09 → the ten notes at 163.040 (939). His 163.71 → the seventeen notes beginning 163.596 (1541), struck through 163.67. Start 161.789; a short tail to 163.95.

**Built (a ribbon gesture with `bounces`):** between two bounces the ball rises to the FULL height and falls again, turning at the midpoint between them (162.78 · 163.32); after the last bounce a small tail, 30 % of the height (`tailPct`). Each stretch is one arc of the GC's own curve — the rise is the GC's rebound with its damping at 100 instead of piece 2's 80, so the next fall starts where the rise ended. The width is the measured busyness (`fromPlaying`), on ONE scale over the whole ribbon (`normSpan`), so the three impacts can be compared: each is broad, the third broadest. One ball rides it; three rings.
**The chord symbols inside it:** at its start both hands' sets; at a later stretch's start only where a hand's set has changed — the left hand's new cluster (E4 … D5, used from 163.51) stands at the third stretch's start.
**Open, seen while building:** real bounces lose height each time; these three are equal. Whether a multi-bounce should decay, or its heights say something (the weight of each impact), is his.
**Checked once:** the page rendered to an image, 160.2 → 164.6 s.

## §312 · 2026-11-20 · the arpeggiated strike at 164.34; the workshop's page turn mended

**His words (while §311 was being built):** "And then the figure at 164.34 is, again, the arpeggiated strike And then the score doesn't seem to, or flip pages are advanced with the cursor. If we can get that working, that'd be good."
- UNIT 12 — the nine notes of both hands at 164.340 … 164.380 (F4 · F#4 · G4 below; E6 · F#6 · G6 · G#6 · A6 · B6 above): one chord, stem up with a 16th flag, the arpeggio sign — as unit 11 at 156.41. "The arpeggiated strike" is his name for this kind of notated figure; the pages rebuilt.
- THE PAGE TURN: the workshop page was meant to move on when the cursor passed its right edge, and never did. The fault, in the AI's own page code (§269): on every animation frame past the edge it asked the server for the next page AGAIN, and each new asking discards the answer to the one before — so no answer was ever kept. Now it asks once and waits (a flag, cleared when the picture arrives, or after 3 s).
**NOT verified by the AI:** in its hidden browser pane the playback clock does not run (the cursor stayed at 151.60 through a 2.5 s play), so the turn could not be watched. The fix is his to see: play across a page's right edge.

## §313 · 2026-11-20 · 164.8 → 166.3 s — a ribbon whose line grows with time, a short tail, a repeat moved over for it

**His words:** SW-100 (the sketch pad): "a ribbon that hits at 165.9 starts at the partials at 164.77 … a growing line, starts thin and progressively grows until impact. a short up tail … those next two will be a repeat … move them over a little bit so we have … room for the tail … until somewhere around like 166.2 … the partials are like at 166.02 and 166.28".
**Written into the working version:**
- THE RIBBON 164.781 → the impact 165.785 → 166.0. Its width is DESIGNED, a new form of the fall: `profile.in` "time" — the width grows steadily with the time gone by from the start to the impact, so it is already growing along the level top (the form of §296, "depth", stays a hair until the arc drops). The tail: 30 % of the height (`tailPct`, now for a one-bounce ribbon too), 0.2 s long, thinning.
- THE IMPACT's place: his 165.9 is a cluster struck in two waves — nine notes of both hands from 165.785, four more of the left hand at 165.89. The impact is put on its beginning, 165.785.
- THE REPEAT: the right hand's five notes of 166.038 (G#5 … C6), boxed as its symbol at 166.1 — moved right of the ribbon's tail — then sign 29, growing, to 166.3.
- **Told to him:** no partial stands at 166.28. After 166.038 the next one is the ten notes of both hands at 166.525. So the repeat as built holds ONE partial; whether it should run on to 166.53, or that cluster is something of its own, is his.
**A fault found and mended on the way:** the image rasterizer (the film's too) crashed on this page — a clipped group with nothing left inside it, once the earlier gestures lay wholly off the page to the left. A gesture wholly outside the page is no longer drawn.
**Checked once:** the page rendered to an image, 163.9 → 167.3 s.

## §314 · 2026-11-20 · the working version, 166.5 → 170 s — two pebble drops, two growing ribbons, a pole, a note left out; where an impact stands in a cluster

**His words:** SW-101 (the sketch pad): "From 166.52 to the one at 166.82, that's a pebble drop. 167.02 to 167.33 … another pebble drop. from 167.56 to 168.59. That's a ribbon. Again, an accelerating … thin into thick and short uptail. the two figures at 169.7 and then 169.93 … a poll, notated, just two notated chords … eat that extra F … at 170. ribbon from 168.83 impact at 169.46 short tail again."
(It also answers §313's question: the ten-note cluster at 166.525 is a pebble drop of its own; the repeat before it holds one partial.)

**Written into the working version:**
- PEBBLE DROPS 166.525 → 166.82 and 167.023 → 167.33.
- RIBBON 167.555 → impact 168.509 → 168.74, and RIBBON 168.83 → impact 169.415 → 169.62: both with the growing line of §313 (`in` "time") and a short tail (30 % of the height).
- A POLE: units 13 and 14 — A5 · A#5 · B5 at 169.752 (upper staff) and D#4 · F4 · F#4 · G4 at 169.930 (lower staff), each a notated chord, stem up, a 16th flag.
- A NOTE LEFT OUT: the left hand's F4 at 170.042 (`omit`, wc-2093) — a played note removed from the piece at his word; it stays in his save and on the pages "spaced" and "as played".

**WHERE AN IMPACT STANDS IN A CLUSTER — a pattern seen, and the AI's choice:** three times now his impact time is the END of a cluster that is struck over a tenth of a second or more: 165.9 (the cluster runs 165.785 … 165.89) · "to 168.59" (168.425 … 168.606) · 169.46 (169.354 … 169.451). He clicks on what he sees, and the last heads of a cluster stand at its right. The impact is put at the cluster's LOUDNESS-WEIGHTED MIDDLE — the mean of its notes' times, each weighted by its loudness: 165.833 · 168.509 · 169.415 (§313's 165.785, the cluster's beginning, is moved to 165.833). Between his reading and the first note; his to overrule.
**Checked once:** the page rendered to an image, 166.0 → 170.6 s.

## §315 · 2026-11-20 · the pole's two chords beamed

**His words:** "Beam those last two clusters together, please." Units 13 and 14 (169.752 · 169.930) lose their flags and share one 16th beam (`u13`), stems up, across the two staves — the beam at the standing height above the upper staff, the second chord's stem running up from the lower staff. By the hand unit's standing rules; the pages rebuilt. **Checked once:** the spot rendered to an image.

## §316 · 2026-11-20 · the short tails lengthened to one length, 0.46 s

**His words:** "And the short tails can be maybe about 30% longer, even if it goes in a little bit into the space of the next thing, it's fine. Looks like they'll clear. So the short tail at 163.6. I don't know if they're all the same length, but even longer than that one. That seems a little longer."
**They were not the same length:** after the impacts at 163.596 · 165.833 · 168.509 · 169.415 the tails lasted 0.354 · 0.167 · 0.231 · 0.205 s (each had been cut to what followed it). The one at 163.6 was the longest, as he saw.
**Changed:** every short tail now lasts 0.46 s (`shortTailS` — the longest one plus 30 %), whatever follows; so the tails run to 164.056 · 166.293 · 168.969 · 169.875. `hideTo` keeps each ribbon's span of replaced notes where it was, so a longer tail does not swallow the notes after it (the pole's first chord at 169.75 stays).
**Checked once:** the page rendered to an image, 163.0 → 170.4 s. **Seen:** the tails end low, about the lower staff's bottom line; three of them now reach under or through what follows on the LOWER staff — the left hand's chord symbol at 168.83 (the tail of the ribbon before passes through its box) and the pole's second chord at 169.93 (the last tail ends at its accidentals). On the upper staff everything clears, as he judged.

## §317 · 2026-11-20 · a hill of pebbles — the pebble drop that grows like a crescendo, 170.31 → 170.93 s

**His words:** SW-102 (the sketch pad): "from 170.3 to 170.93 with the back half being fairly bit more dense … a substrate that … starts thin and grows like a crescendo … like a hill of pebbles. So it's thicker and denser towards the right. And then just make a note, I want to go back and refine some of the densities … a variety in the pebble drops."
**Built (a curtain with `shape` "hill"):** the pebbles lie along the curtain's floor as a hill — their places drawn so that the crowding grows to the right (a pebble's place = its rank to the power 1/2.6 of the width: `hillPower`), and where they crowd they are piled on one another. Each is thrown straight up from where it lies (a parabola of 0.6 s, its height random between about half and the full curtain) and lands there again AS THE CURSOR REACHES IT. So the landings come thin at the start and thick at the end — a crescendo of impacts, where the plain drop has one scattered impact.
- First drawn with 46 pebbles and power 2.2: a low slope that did not read as a hill; now 75 and 2.6.
- The drop's own curtain data: `shape` · `density` · `hillPower` · `flightS` on the gesture.
**HIS NOTE, written into `docs/NOTATION_SCHEME.md` § 3:** to come back and refine the pebble drops' densities — to reflect the playing, and for variety among them. Today every other drop has the same 26 pebbles.
**Checked:** two stills drawn with the page's own arithmetic — at rest (the hill), and with the cursor two thirds through (the pebbles behind it landed, those ahead rising in a wave). NOT seen moving.

## §318 · 2026-11-20 · the tails leave the bounce faster — a stronger bounce

**His words (while §317 was being built):** "Okay, but the longer tails, they seem to be slower. So I don't know if we need to change the angle or speed up. They should be coming off those bounces at a higher velocity, so it feels like more of a stronger bounce, I guess."
**Why they were slower:** §316 made each tail longer in TIME and left its HEIGHT at 30 % of the fall, so the same small rise was spread over more time — a shallower angle off the bounce, a slower ball.
**Changed:** a tail's leaving speed is its height over its time, times the power of the GC's rise curve. Every short tail now rises to 58 % of the fall (`tailPct`, was 30) and leaves by a steeper curve (`tailStiffness` 110 → the rise's power 3.2, was 2: off the bounce fast, levelling sooner). At the bounce the ball now leaves about three times as fast as after §316. The fall and the bounces between the multi-bounce's impacts are untouched.
**Checked once:** the page rendered to an image, 163.0 → 170.4 s — the tails stand off the impacts steeply and level out about the top of the lower staff. The speed itself is his to judge in motion.

## §319 · 2026-11-20 · the three-bounce ribbon's tail 15 % longer at the same speed

**His words (while §318 was being built):** "Like the three bounce one, though, that those physics feel pretty good. And that tail can be just ever so slightly longer, maybe like another 15%, but with the same sort of velocity."
**Noted:** the three-bounce ribbon's motion is the one that feels right to him — its bounces between impacts rise to the full height by the GC's own rise. **Changed:** its last tail lasts 0.529 s (0.46 + 15 %) and rises to 67 % of the fall (58 + 15 %), so the speed off the bounce is unchanged. The other tails stay at 0.46 s and 58 %.
**Said to him:** this message and §318's crossed — he may have judged the tail before it was made faster; the 15 % is applied on top of the faster tail.

## §320 · 2026-11-20 · the three-bounce ribbon's third bounce made like the first two

**His words:** "Or I guess maybe the first two bounces, that velocity is pretty good. And that third bounce could have a, be closer to the first two bounces."
**Measured:** the first two bounces rise to the FULL height in 0.26 s and 0.28 s (half the gap to the next bounce), by the GC's own rise (power 2). The third's tail, after §319, rose to 67 % in 0.53 s by a steeper curve — about half their speed off the bounce, and a different shape.
**Changed (this ribbon only):** its tail uses the SAME rise curve as the bounces (`tailStiffness` 50), to 85 % of the height in 0.30 s — about three quarters of their speed, and the same shape. It is no longer "small": it ends just under the height of the two turns before it. §319's version is replaced. The other ribbons' tails stay as §318 left them (58 %, 0.46 s).
**Checked once:** the ribbon rendered to an image.

## §321 · 2026-11-20 · one tail for every ribbon — the three-bounce ribbon's

**His words:** "The three bounce is better, but the subsequent ones, maybe they're a little too long or something about them isn't quite right. The velocity isn't quite right … I think it's more just the velocity needs to come up. You can adjust the angle as however you see fit. And maybe they're slightly too long. But the three bounce one seems good. So whatever is going on there in terms of speed, velocity,"
**Done as he says — whatever is going on there, everywhere:** the three later ribbons' tails (after the impacts at 165.833 · 168.509 · 169.415) take the three-bounce ribbon's tail whole: the GC's own rise curve (power 2), to 85 % of the fall, in 0.30 s (they were 58 %, a steeper curve, 0.46 s). It is now the page's default (`tailPct` 85 · `tailStiffness` 50 · `shortTailS` 0.30), so a new ribbon with a tail gets it too.
**The trail of the tail, for the record:** 30 % cut to what followed (§313) → 0.46 s for all (§316: too slow) → 58 % on a steeper curve (§318) → the bounce's own curve, 85 % in 0.30 s (§320 for the three-bounce, §321 for all). What settled it was matching the tail to the bounces he already liked, not tuning it by itself.
**Checked once:** the page rendered to an image, 163.0 → 170.4 s. **Seen:** at 85 % the tails now end in the UPPER staff — the tail after 165.83 ends at the repeat's chord box (166.1), and the tails before 168.83 and before the pole end at the next chord symbol and under the pole's first chord.

## §322 · 2026-11-20 · the hill of pebbles keeps the pebble drop's throw — only its density differs

**His words:** "And that denser one isn't quite right. It kind of goes up in a wave. I still wanted to have the same feel as the other pebble drops, where they all kind of fall almost at the same time. And I think they kind of go up at the same time. So I didn't mean for the timing to change, just the sort of density to change."
**The AI's mistake in §317:** "grows like a crescendo" was read as a crescendo in TIME — each pebble landing as the cursor reached it, a wave. He meant the SUBSTRATE: where the pebbles lie, thin to dense. The timing was never to change.
**Changed:** the hill is thrown as one handful like every pebble drop — all leave together, fly about one second (each a few per cent different), and land together at the moment the cursor reaches the curtain's middle; each falls back onto its own place in the hill. What is left of "hill" is the layout only: few pebbles at the left, crowding and piled to the right.
**Checked:** the server's answer for the page — 75 pebbles, none with a moment of its own; the landings fall within about ± 0.1 s of the one impact. Not seen moving.

## §323 · 2026-11-21 · the working version, 171.7 → 175.7 s — a ribbon with a WAVE that stops at 60 %, an arpeggiated chord, three beamed figures, a falling ribbon

**His words:** SW-103 (the sketch pad): "a two-wave ribbon, but the first one doesn't go all the way down … like a 60% down … 172.2. And then the ending is 172.79. and one of those short tails that we refined earlier. the cluster … around 173.71 … an arpeggiated chord. The ones in the left hand, three of them at around 173.88, just its own struck chord, and beam those together with the partial on 173.97 and 174.1 … evenly space those three … 16th … 174.23 … 175.52, just a ribbon going down, impacting at 175.52 and a short tail up."

**A new form — THE WAVE (`depths` on a ribbon's `bounces`):** a turn that goes only part of the way down is not a bounce: it turns SMOOTHLY (a cosine — level at the bottom of the dip, where a bounce has its corner) and carries no impact ring. After it the line rises to the full height and the next stretch falls as a ribbon does. The ball rides the same curve.
**Written into the working version:**
- THE TWO-WAVE RIBBON 171.741 → a wave to 60 % at 172.2 → the impact 172.755 → the refined tail (85 % in 0.30 s). Its width from the playing (as the three-bounce ribbon's). His 172.2 is KEPT as given: it lies between the partials of 172.104 and 172.305 and no partial stands on it — a wave's low point is not a struck moment.
- UNIT 15 — the six notes of both hands at 173.694 … .735: a chord with the arpeggio sign, stem up, a 16th flag.
- UNITS 16a · 16b · 16c — the left hand's D5 · F#4 · B4 (173.848 … .902) as one chord, then G5 (173.950) and F5 (174.096) on the upper staff: one 16th beam, stems up, the three at equal distances (`spread` "both": the least equal distance, centered on the span they were played in — §262's rule).
- THE RIBBON 174.243 → the impact 175.44 → the refined tail. The designed line of §296 (a hair while level, growing with the drop). His 175.52 is the END of the seven-note cluster 175.393 … 175.503; the impact stands at its loudness-weighted middle (§314's choice, still unanswered by him).
**Checked once:** the page rendered to an image, 171.2 → 176.1 s.
**Seen, for his eye:** the three beamed figures stand very close (equal, but only about 2.3 ss apart, right after the arpeggio's wavy line); the falling ribbon's first chord symbols stand under its level start.

## §324 · 2026-11-21 · a pebble drop at 175.9, two sparse repeats at 176.77; the second pass named — a spectrum of each kind

**His words:** SW-104 (the sketch pad): "175.9 to 176.21, that's a pebble drop. the notes at 176.77 to maybe about 176.99 … a repeat, but like a more sparse one … things we'll maybe refine at a second pass … I want a spectrum, a gradation of the pebble drops of like density or … weighted in the front or weighted in the back … And same with the repeats … sparsely repeated, ones that grow bigger … put in some kind of sparsely repeated one for now."
**Written into the working version:** the pebble drop 175.898 → 176.21 (the partials of 175.898 … 176.205) · the repeat 176.762 → 176.99 in BOTH hands, since both play there — the right hand's single F#5 (struck twice), the left hand's E4 · F4 · G4 — each with the new sign "sparse": few marks, 2.6 ss apart, one modest size (two marks fit). A placeholder, as he says.
**THE SECOND PASS, written into `docs/NOTATION_SCHEME.md` § 3:** a spectrum of each kind — pebble drops by density and by where the weight lies; repeats by sparseness and by what they do. What exists to draw on: the plain drop and the hill; the repeat signs sparse · 29 · 28 · 30 · 31 and the catalog.
**Checked once:** the page rendered to an image, 174.0 → 177.6 s.

## §325 · 2026-11-21 · the working version to 180.74 s — a ribbon, a struck chord, a two-wave ribbon, a growing repeat, a struck chord

**His words:** SW-105 (the sketch pad): "ribbon starting at 177.71, impact at 177.98, and a rise to 178.2. The notes at 178.83 … a struct chord … starting on 179.02 … a two-wave one again, like an undulating one that strikes at 179.29, and, well, it descends to there. And then at 179.69 is where it strikes. And then the tail goes up to about 179.97. The notes at 180.74 is just a notated struct chord. And … a repeat from 180.19 to somewhere around 180.64 or 66."
**Set on the played partials (his times are thereabouts):**
- the ribbon 177.729 → impact 177.971 (the left hand's G4 · E4 · F4, 177.963 … .981) → 178.2. The tail ends where he said, 0.23 s after the impact, a little shorter than the one tail of §321 (0.30 s); it takes the B4 of 178.187 with it.
- unit 17, a struck chord at 178.81: the right hand's G4 · A4 · A#4 · D#5 · F5 (178.808 … .842), one stem up, a 16th flag. The lone D#5 that follows at 178.912 is NOT in the chord; it stands as a small head beside it.
- the two-wave ribbon 179.022 → a wave to 60 % at 179.323 (the middle of the left hand's four notes 179.290 … .344, as the wave of 171.7) → the impact 179.709 (the seven notes of both hands, 179.682 … .718) → 179.97; its width from the playing (power 1.3), as the earlier two-wave ribbon.
- the repeat 180.205 → 180.65, right hand: B5, then the cluster A#5 … D#6 struck three times (180.36 · 180.46 · 180.59). He named no sign; sign 29 (growing) is put in, since each strike is fuller than the last. The left hand plays F4 · E4 · A4 · G4 once, at 180.36; it is no repeat and stands as small heads under the marks.
- unit 18, a struck chord at 180.72: the eight notes of both hands (A#5 · B5 · C6 · G6 over C5 · C#5 · D#5 · E5), one stem up, a 16th flag.
**Checked once:** the page rendered to an image, 177.2 → 181.2 s.
**Seen, for his eye:** two leftovers stand as small heads (the D#5 after the chord of 178.81; the left hand's four notes under the repeat). The repeat's sign is the AI's pick.

## §326 · 2026-11-21 · the working version to 184.63 s — and a ribbon's width designed over its whole length (thick to thin)

**His words:** SW-106 (the sketch pad): a grace figure 181.38 … 181.52 "evenly spaced" · "From 181.55 to 182.03 … a repeated figure" · 182.09, 182.24 and "the two ones in 182.34 … 3 strikes" beamed, "include that G sharp in the bass in the second chord" · "a ribbon with impact at 183.6 and a short tail. start at 182.4 an undulation into 182.78. But overall, let's go from thick to thin … Start thick at the beginning and thin out through the undulation and then into the final hit" · the cluster at 183.84 and the notes at 184 "as two chords" · "a short pebble drop from 184.19 to 184.35 … centered between the two chords … and then what's to come" · two chords at 184.52 (with "those first two notes that follow") and 184.64 ("including the two at the bottom") "beamed together as a strike".
**Set on the played partials:**
- unit 19a … c, the grace figure: G5 · F5 (181.386) · F#5 (181.442) · D#5 (181.497) — three partials beamed, the grace group's equal spacing (§262), the corner-rule stroke.
- the repeat 181.589 → 181.93 (right hand; the notes hidden to 182.03): A#5 · B5 · C6 struck again and again. He named no sign; sign 29 (growing) put in. First drawn to 182.03, its marks ran into the accidentals of the first strike, so they end at 181.93.
- unit 20a … c, THREE STRIKES on one 16th beam, spread evenly: G5 · G#5 · A#5 · B5 · C6 (182.09) · G#5 · C6 · D6 · G6 · A6 (182.21, the G# with it) · F#5 · A5 (182.33).
- the ribbon 182.401 → a wave to 60 % at 182.773 → the impact 183.636 (A6 · G#6 · G6) → 183.79.
- unit 21a · 21b, two chords, each its own stem and 16th flag (he did not say beamed): the seven notes of 183.803 … .870, the four of 183.995 … 184.015.
- the pebble drop 184.18 → 184.34: his width (0.16 s), centered between the chord of 184.0 and the chord of 184.5 — where the two notes of 184.255 … .280 are played.
- unit 22a · 22b, two chords on one beam: D#5 · D5 · C#5 with C5 · B4 (184.504 … .569) · F6 · G6 · C7 · C#7 with G4 · A4 (184.607 … .630). The C7 struck again at 184.664 (wc-2368) is left out — the same key twice in one chord (the "eat that extra F" case of §314).
**NEW IN THE RIBBON — the width designed over the whole length.** Until now a ribbon's width came from the drop (thin level, growing down), from the time (growing to the impact), or from the playing. `flow.profile.over` (`tools/gravity_furniture.js`) is a list of [time, width 0 … 1], eased between, running across every stretch of a many-turn ribbon. Here: 1 at the start · 0.5 at the wave · 0.16 from 183.45 · 0.1 at the tail's end.
**A choice the AI made:** the tail is 0.15 s, not the one tail of §321 (0.30 s): at 0.30 it would run into the chord of 183.80.
**Checked once:** the page rendered to an image, 181.0 → 185.0 s.
**Seen, for his eye:** the two notes of 184.107 (D5 · C5) are in no gesture and stand as small heads before the pebble drop; the first two of the three strikes stand close.

## §327 · 2026-11-21 · a ribbon that falls INTO a notated chord; the two chords beamed; the pebbles land at 184.21

**His words:** SW-107 (the sketch pad): "the strike at 183.64. Let's make it at the strike point of 183.81, or whatever the time of that chord is, and no tail. And then can you beam the two figures? … the main sort of fall of the pebbles? They're a little late, so make them mostly down by 184.21."
**Done:**
- the ribbon of 182.401: its impact from 183.636 to 183.81 (the chord of 183.803 … .870, unit 21a), and it ENDS there — no tail. The width's keyframes follow: 1 at the start · 0.5 at the wave · 0.16 from 183.5 · 0.12 at the impact. The three notes of 183.633 … .639 stay hidden inside the fall.
- units 21a · 21b on one beam (u21), the flags gone.
- the pebble drop of 184.18 … 184.34: the landing at 184.21 (`impact`), not the curtain's middle (184.26). The curtain stays where it is.
**A fault met and fixed:** with the ribbon's notes hidden up to 183.79, the chord's first two notes (183.803 · .810) vanished — the hiding has 20 ms of grace for his clicked times. The hiding now stops at 183.7.
**What is new in the notation:** a ribbon's impact can BE a standard figure. Until now a ribbon replaced the notes at its impact.
**Checked once:** the page rendered to an image, 181.0 → 185.0 s.

## §328 · 2026-11-21 · the working version to 186.0 s — a struck chord at 185.13, a ribbon 185.31 → 185.75 → 186.0

**His words:** SW-108 (the sketch pad): "The notes around 185.15 are a notated chord, struct chord. ribbon impact at 185.77, starting at 185.31, tail up to about 185.97, maybe a little bit more."
**Set on the played partials:**
- unit 23, a struck chord at 185.13: G6 · D6 over F4 · E4 · D4 (185.130 … .172), one stem up, a 16th flag.
- the ribbon 185.310 (the B4) → the impact 185.75 → 186.0. His 185.77 lies between two partials: E5 · D5 at 185.746 (velocities 103 · 112, the loudest of the passage) and the four notes of 185.811 … .857. The impact stands on the first. The tail runs to 186.0 ("maybe a little bit more" than 185.97) and takes the notes of 185.811 … .913 with it. The standing line: thin while level, growing with the drop.
**Checked once:** the page rendered to an image, 183.4 → 187.0 s.

## §329 · 2026-11-21 · the pebble drop of 184.18 lands at 184.30

**His words:** "Okay, now the pebble strike is too early. Maybe somewhere 184.3, maybe, or 31. Give that a try. Let's see how that looks."
**Done:** the landing (`impact`) from 184.21 (§327, too early) to 184.30. The record of the three tries: the curtain's middle 184.26 (late, he said — though the fall was judged by eye against the sound) · 184.21 (too early) · 184.30 (a try). The two notes it stands for are played at 184.255 and 184.280.
**Not checked:** it shows only when the page plays; his to see.

## §330 · 2026-11-21 · a wave with steeper sides (the ribbon of 182.4)

**His words:** "the curve around 182.49. Can we have a sort of faster, steeper decrease? So maybe it goes down a little bit lower and a steeper, faster up on the upside of that curve."
**Done:** the wave of the thick-to-thin ribbon (§326) goes down to 78 % of the drop (it was 60 %), and its sides are steeper. NEW: `waveSharp` on a gesture (`tools/gravity_furniture.js`; the page's ball follows the same curve) — the wave's cosine h is reshaped to h^k / (h^k + (1 − h)^k); k = 1 is the plain cosine, k = 1.7 here. The wave stays level longer at the top, drops faster through the middle, and climbs out as fast. Its turn stays at 182.773.
**Checked once:** the page rendered to an image, 181.0 → 185.0 s.

## §331 · 2026-11-21 · the pebble drop of 184.18 lands at 184.32

**His words:** "The pebbles are just about there. Let's move it another like 0.01 maybe. What is that, 10 milliseconds? So then 20 milliseconds, 0.02."
**Done:** the landing 20 ms LATER, 184.30 → 184.32 — "another" read as the same way as the last move (184.21 → 184.30). The tries: 184.26 · 184.21 · 184.30 · 184.32.
**Not checked:** it shows only when the page plays; his to see.

## §332 · 2026-11-21 · the wave's way down eased, its way up kept

**His words:** "That curve 182.8, the descent is too fast now. So somewhere in between the last two, the ascent is fine."
**Done:** `waveSharp` may be a pair, [the way down, the way up]. The ribbon of 182.4: down 1.35 (halfway between the plain cosine, 1, and §330's 1.7), up 1.7 as it was. The depth stays 78 %.
**Checked once:** the page rendered to an image, 181.0 → 185.0 s.

## §333 · 2026-11-21 · the working version to 191.46 s — two long ribbons; a ribbon's TOPS can be given

**His words:** SW-109 (the sketch pad): "Impact at 188.21. The ribbon starts at 186.8. And the tail till 188.67. A new ribbon starts at 188.76. impact at 189.38 … go back up to peak at or top at 189.56. undulate to 189.99. up by 190.57 impact again at 191.24. and then tail to 191.46."
**Set on the played partials:**
- the ribbon 186.792 → the impact 188.20 (the partial of 188.193 … .211) → 188.67. The tail is 0.47 s, his word, longer than the one tail of §321.
- the ribbon 188.757 → the impact 189.38 (his time, said twice; the end of the seven notes 189.329 … .383) → the top 189.56 → a wave to 60 % at 189.985 → the top 190.57 → the impact 191.235 (the six notes 191.219 … .254) → 191.46. The width from the playing (power 1.3).
**NEW: `tops` on a many-turn ribbon** (`tools/notation_workshop.js`). Until now the ribbon stood at its top halfway between two turns. He gives the tops himself here (189.56 is 0.18 s after the impact and 0.43 s before the wave: a fast rise, a slow fall), so `tops[i]` says where the top lies between turn i and turn i + 1.
**The wave's depth (60 %) is the AI's**, the standing value; he said only "undulate".
**Checked once:** the page rendered to an image, 186.4 → 191.8 s.
**For the paper:** the passage 186.8 … 191.5 is the densest of the solo so far (some 140 notes in 4.7 s) and he gives it to two ribbons only, no chord, no pebbles.

## §334 · 2026-11-21 · "hit harder" — one setting for a ribbon's strike

**His words:** SW-110 (the sketch pad): "The one at 188.21, it could hit harder, and I guess instead of me saying like ascent, descend, and ascent, it can just hit harder. So I guess it would be a harder descent and a quicker ascent, whatever that works out to be."
**Built:** `hit` on a ribbon gesture (`tools/notation_workshop.js`), 1 = the standing curve. It scales the gestural curve's own two powers together (`notation/lib/gc.js`: the fall is 1 − u^descentPower, the rise 1 − (1 − u)^ascentPower): both powers are multiplied by `hit`. A higher fall power keeps the ribbon near its top longer and brings it down faster into the impact; a higher rise power takes it off the impact faster and levels it sooner. The page's ball follows the same curve.
**The ribbon of 186.8:** hit 1.8 — the fall's power 2.8 → 5.0, the tail's 2.0 → 3.6. The times are unchanged (186.792 · 188.20 · 188.67).
**Why one word:** it is his way of speaking, and it keeps the fall and the rise in one character. The wave's steepness (§330 · §332) stays a separate setting; a wave does not strike.
**Checked once:** the page rendered to an image, 186.3 → 191.9 s.

## §335 · 2026-11-21 · the two long ribbons joined into one, 186.8 → 191.46

**His words:** "And then let's connect those two curves around 188.7. Let's just make them all one curve."
**Done:** the two ribbons of §333 are ONE gesture of four turns: the impact 188.20 → the top 188.7 → the impact 189.38 → the top 189.56 → a wave at 189.985 → the top 190.57 → the impact 191.235 → the tail to 191.46. Where the first ribbon's tail stopped at 85 % (188.67) and the second began level (188.757), the line now rises to the full top at 188.7 and falls again.
**What follows from it:** the harder hit of §334 belongs to the first impact only, so `hits` gives one value per turn (1.8 · 1 · 1 · 1). The width is now the playing's over the whole length, on one scale (the first part was the plain designed line). The chord symbols stand at the start of a gesture, so the pair at 188.76 is gone with the join.
**Checked once:** the page rendered to an image, 186.3 → 191.9 s. The longest ribbon so far: 4.7 s, some 140 notes.

## §336 · 2026-11-21 · the first impact of the long ribbon moved onto the loud pair, 188.134

**His words:** "The hit at 188.2 is a tiny bit late. See if you can hear where it should hit. It's probably just a slight bit before that."
**Read from the played notes (the AI cannot hear; it reads the velocities):** just before 188.2 stand F5 · G5 at 188.132 … .136, velocities 119 · 121 — the loudest notes of that second. The partial the impact stood on, F5 at 188.193, is softer (98), with a D#4 of 33 after it. So the accent he hears is the pair at 188.134, 66 ms earlier.
**Done:** the first impact 188.20 → 188.134. Nothing else moved.
**For the next placements:** where his clicked time lies near two partials, the LOUDER one is the likelier impact.
**Checked once:** the page rendered to an image, 186.3 → 191.9 s.

## §337 · 2026-11-21 · the first impact back onto the second of the two repeated strikes, 188.185 — §336 corrected

**His words:** "There's like two kind of repeated things, and it's the second where the hit is."
**The AI's reading:** the two repeated things are F5 · G5 at 188.132 … .136 and the F5 struck again at 188.193. §336 put the impact on the FIRST (the louder); he hears it on the second. So the rule of thumb written in §336 ("the louder partial is the likelier impact") is WRONG here and is withdrawn: a repeated strike can carry the accent on its second.
**Done:** the first impact 188.134 → 188.185 — on the second strike, 8 ms ahead of its note and 15 ms ahead of the 188.20 he found "a tiny bit late".
**Not checked:** it shows only when the page plays; his to see.

## §338 · 2026-11-21 · the working version to 192.72 s — two pebble drops, a chord as a pickup, a SLUR INTO A PEBBLE DROP (a try); the 188.2 hit to 188.16

**His words:** SW-111 (the sketch pad): "the notes from 192.13 to 192.28, Pebble Drop. And from 192.57 to 192.72, another Pebble Drop. And then the chord at 192.4. Let's make that a strike. I don't know if we can make it seem like a pickup. Maybe like a, let me try a slur into the pebble drop. I don't know how that would look." · and, of the long ribbon: "The one at 188.2 is maybe a little late still. So maybe it's the first of the two repeated things. Anyways, let's try a time slightly earlier. We'll get it."
**Set on the played partials:**
- the pebble drop 192.13 → 192.29 (the twelve notes of 192.146 … .279) · the pebble drop 192.57 → 192.72 (the twelve of 192.572 … .699).
- unit 24, a struck chord at 192.41: B4 · C5 · D5, one stem up, a 16th flag.
**THE SLUR — a try, and NOT by an engraving rule.** A new gesture kind in the workshop, `slur` (`tools/notation_workshop.js`): from a notated chord (`t0`) to the edge of the gesture that begins at `to`. Drawn under the heads (the stem goes up), from 1.7 ss right of the chord's time and 1 ss under its lowest head, to a quarter ss before the curtain; a thin lens, its sag growing with its length. The standing slur of the engine (`layout.js`, a slur between two units) joins two note heads and has no notion of a curtain, so it could not be called; these numbers are the AI's and stand in no row. BY THE ENGRAVING RULES' STEP 3 (discuss): if he keeps the figure, its side, its ends and its thickness are to be decided with him and written as rows.
**What is new in the notation:** a standard sign (the slur) joining a figure of one kind (a notated chord) to a figure of another (a pebble drop) — the kinds until now only stood side by side.
**The long ribbon's first impact:** 188.185 → 188.16 — between the two repeated strikes (188.134, the first, and 188.193, the second). The tries: 188.20 (a tiny bit late) · 188.134 (not it) · 188.185 (a little late still) · 188.16.
**Checked once:** the page rendered to an image, 191.0 → 194.0 s.

## §339 · 2026-11-21 · the working version to 194.44 s — a pebble drop, a ribbon, five figures on one beam at their played places

**His words:** SW-112 (the sketch pad): "pebb drop from 193.11 to 193.28. ribbon impact at 193.69 starts at 193.36. There's a chord at around 193.96. Include that high E just before it and that B just after it. Actually, sorry, put the B in with the next one. And then a strike at 194.08. And then at 194.21. And then 194.36 and the node at 194.44 … kind of interpolate a rhythmic position for each of those and beam those together. Let's just see what it looks like."
**Set on the played partials:**
- the pebble drop 193.11 → 193.28 (the seven notes of 193.161 … .230).
- the ribbon 193.364 (the F4) → the impact 193.686 (the eight notes of 193.682 … .702) → 193.86. He named no tail; a short one of 0.17 s, so it stops before the E6 of 193.883, which belongs to the next chord.
- units 25a … e on one 16th beam (u25), each drawn at its played place — no `spread`: 25a E5 · F5 · D5 · C5 with the E6 before it, drawn at 193.951 · 25b G#4 · A4 · G4 with the B4 before it, at 194.078 · 25c G#5 · A5 · A#5 · B5 · F6 (194.204) · 25d B4 · D5 (194.360) · 25e C#5 (194.442). The gaps between them: 127 · 126 · 156 · 82 ms.
**How "interpolate a rhythmic position" was read:** the figures stand where they are played, as the pole of §307 (units 9a … c); a note taken into a chord from just before it (the E6, the B4) is drawn on the chord's own place (`at`).
**Checked once:** the page rendered to an image, 192.7 → 195.3 s.
**Seen, for his eye:** the beam runs level over all five; the third figure's accidentals reach back toward the second's stem.

## §340 · 2026-11-21 · the notated chord drawn in AT a ribbon's impact (193.68)

**His words:** "At the point of impact at 193.68, can you draw in the notated chord that's there? If you can't figure it out, just show me the notes again, and I'll select."
**Done:** unit 26, the eight notes of 193.682 … .702 (A5 · A#5 · B5 · C6 · C#6 · D6 · D#6 · F6, all in the upper staff), one stem up, a 16th flag. The ribbon of 193.364 keeps its impact and its tail; it now hides its notes only up to 193.6, so the chord shows.
**What it is:** the second form of a ribbon WITH a standard figure at its impact. §327's ribbon falls into a chord and ends there; this one strikes, shows what is struck, and rebounds. The chord stands above the impact point (it is high; the impact is at the band's floor), a little right of it.
**Checked once:** the page rendered to an image, 192.7 → 195.3 s.

## §341 · 2026-11-21 · the working version to 196.26 s — a ribbon 194.62 → 195.83 → 196.26

**His words:** SW-113 (the sketch pad): "a ribbon to impact around 195.83 starts at 194.62 and ends, goes up to 196.26."
**Set on the played partials:** the start 194.622 · the impact 195.83, on the eleven notes of 195.822 … .868 (the low cluster E4 … E5, velocities to 127) · the tail to 196.26 (0.43 s). The standing line: thin while level, growing with the drop.
**Seen, for his eye:** the tail passes over a second loud cluster, the ten notes of 196.098 … .115 (G5 … F6, velocities 122 … 127) — as loud as the impact. It is inside the tail now and shows no strike of its own.
**Checked once:** the page rendered to an image, 194.2 → 197.0 s.

## §342 · 2026-11-21 · an undulation at 195.58 in the ribbon of 194.62

**His words:** "And then let's have an undulation to 195.58."
**Done:** the ribbon of §341 has two turns: a WAVE to 60 % at 195.585 — the ten high notes of 195.576 … .593 (G#5 … F6) — then up (the top halfway, 195.71) and down into the impact at 195.83, the tail to 196.26 as before. The depth is the standing 60 %; he gave none. The width is now the playing's (power 1.3), as for every many-turn ribbon.
**Checked once:** the page rendered to an image, 194.2 → 197.0 s.

## §343 · 2026-11-21 · TWO ENGRAVING RULES, his: the cluster in a notated chord; the flag 4 ss clear of a head outside the staff — and a go line on a chord

**His words:** SW-114 (the sketch pad): "could you do a check throughout if there are actual clusters in any of the notated out chords? Just notate them as clusters. We had talked about that. And then for that cluster that hits at the impact, the notated one, just draw a go line … the stem can be quite a bit longer … In that case, even more than 2 staff spaces. So let's give something like 4 staff spaces at least between the top of the top note and the bottom of the flag."
**FIND (the standing rules read first):** the cluster bar exists already for the chord symbols (`tools/chord_changes.js`; NOTATION_SCHEME § 3: four or more pitches no more than a whole step apart = the lowest and highest note, a bar between, half a head wide — piece 2's bar; SW-84). The stem of a hand unit: `objects.stem.lengthSs` 3.5, and the flag 2 ss clear of the STAFF (`objects.handUnit.flagClearSs`, §258). The go line is the engine's own item (`goline`), until now given by a technique, never by a hand unit.
**APPLY — built in the engine (`notation/lib/layout.js`, the hand unit's pre-pass and its stem pass):**
1. **THE CLUSTER** (rows `objects.handUnit.clusterMinNotes` 4 · `clusterMaxGap` 2 semitones · `clusterBarW` 0.5). Within ONE staff, a run of four or more of a unit's notes, each within a whole step of the next, is drawn as its two ends in one column with a bar between; the inner notes draw nothing; the ends keep their accidentals. A chord may hold a cluster and other notes (the run is the cluster, the rest stay heads). The bar is the stem item made thick (`thickSs`, `render.js`), so no new drawn kind.
2. **THE FLAG AND A HEAD OUTSIDE THE STAFF** (row `objects.handUnit.flagHeadClearSs` 4). Where the head nearest the flag lies outside the staff, the staff-clear law gives nothing and the flag hung on the head. There the stem is long enough that the flag's near end stands 4 ss from that head's far edge. Scoped to that case — a chord inside the staff keeps the 2 ss law, so the figures he has passed do not move. A grace and a beamed unit are untouched.
3. **A GO LINE ON A UNIT:** `go: true` in the units file (`notate_section.js` → `goLine`); one line per unit.
**The check he asked for — the notated chords that hold a cluster (by the rule, a run of ≥ 4):** unit 10 (155.65, 5 of its 10 notes) · 12 (164.34, 6 of 9) · 14 (169.93, all 4) · 18 (180.72, 4 of 8) · 20a (182.09, all 5) · 21a (183.80, 6 of 7) · 22a (184.51, all 5) · 25a (193.95, 4 of 5) · 25b (194.08, all 4) · 25c (194.21, 4 of 5) · 26 (193.68, all 8). The run is counted per staff, so a chord split between the hands may show fewer.
**Unit 26, the chord at the impact:** it IS a cluster (A5 … F6, eight notes, every step a half or whole step) — two heads and a bar; a go line; its stem by rule 2.
**MEASURE:** the page rendered to an image, 192.7 → 196.5 s and 181.0 → 185.0 s: the bars stand, the go line runs from the chord down to the lower staff, the stem of unit 26 is the long one. NOT measured in the page's own boxes (the 4 ss between head and flag is by construction, not by a measurement); the layout shield was not run — no baseline was written before the change.
**The ribbon of 194.62 (his second message):** NEW `flow.gain` (`tools/gravity_furniture.js`) — keyframes [time, factor] that multiply the width, whatever it came from. Here × 1.45 at 195.12 (eased from 1 at 194.85, back by 195.4), and the tail from 1 at the impact to 0.25 at its end.
**Seen, for his eye:** the go line stops at the lower staff, above the ribbon's impact point at the floor; unit 25b is so small a cluster (G4 … B4) that its bar is barely longer than a head.

## §344 · 2026-11-21 · a review of the ledger lines on the clusters — nothing wrong in them; the odd look is the bar beside the stem

**His words:** "The ledger lines are meant to be drawn behind, right? I don't think they're drawn behind … Something looks a little funny with the ledger lines and the clusters. But if everything is correct, then just leave it. Like the clusters and the [chord] changes, they look pretty good. But something about the ones with ledger lines, I'm not sure if something's wrong there."
**Looked at (a close-up of 193.4 … 194.3 s, the chord symbol's cluster beside unit 26):**
- THE LEDGER LINES are the same in both: one for every line between the staff and each end of the cluster, the standard length past the head on both sides, the same ink as the bar. Since bar and ledger are the same black, which is drawn first makes no visible difference. Nothing is wrong there; nothing was changed.
- WHAT DOES LOOK ODD, and only on a notated cluster WITH A STEM: the bar is half a head wide and centered on the heads; the stem stands at the heads' right edge. Between them is a hairline of white, so the two read as a DOUBLE LINE, and the short ledger lines cross both. A chord symbol has no stem, so its bar reads cleanly — which is why those look right to him.
- Also on unit 26: the go line stands just left of the chord and touches the ends of its ledger lines.
**No rule covers a bar beside a stem (piece 2's cluster bars carry no stem). Put to him, not built:** the AI's one recommendation — the bar reaches to the stem, so bar and stem are one solid shape.

## §345 · 2026-11-21 · the cluster bar joined to the stem — his rule

**His words:** "yes, join the bar to the stem" (to §344's one recommendation).
**The rule (row `objects.handUnit.clusterBarToStem`, the scheme's table):** where a notated cluster has a stem, and stands in the stem's column, its bar keeps its far edge and reaches to the stem's outer edge. Bar and stem are one solid shape. A cluster with no stem (the chord symbols) keeps its centered bar, half a head wide.
**Built** in `notation/lib/layout.js` (the cluster bar's pass): the bar's width and middle are computed from the two edges; with an up stem the right edge goes to the stem's right edge, with a down stem the left edge to the stem's left.
**Checked once:** a close-up of 193.4 … 194.3 s rendered to an image.

## §346 · 2026-11-21 · the ribbon into the chord of 183.81: a gentler fall and a small tail, so that it HITS there

**His words:** "the curve at 183.43. I think it's too steep down … It seems to like fall down quickly and kind of sit at the bottom. So maybe it needs a bit of a tail. What I want it to feel like is that it hits at that first partial of those two. Like the impact is there. So maybe it needs a little bit of a tail, maybe a little bit less steep."
**The AI's reading:** §327 ended this ribbon AT its impact, on the first of the two beamed chords (183.81), with no tail, at his word. Without a rebound the eye reads an arrival and a stop, not a strike: the line comes down and "sits". A strike is read from what follows it.
**Done:** (1) the last fall gentler — NEW `falls`, one factor per turn on the fall's power alone (here 0.65: 2.8 → 1.8), the rise untouched; (2) a small tail: up 45 % of the height by 183.97, thinning to almost nothing, ending just before the second chord (184.0). The impact stays on 183.81; the wave of §330 · §332 is untouched.
**For the paper:** a ribbon's IMPACT is legible only through its rebound — the no-tail form (§327) reads as a landing.
**Checked once:** the page rendered to an image, 181.0 → 185.0 s.

## §347 · 2026-11-21 · the first dynamic of the piano solo: ff at 148.2

**His words:** SW-115 (the sketch pad): "Let's have the initial dynamic be FF."
**Read as** the solo's opening dynamic. (The played velocities agree: the first figure is 99 … 122, and the solo's clusters run to 127.)
**Built on the working version:** a gesture kind `dyn` (`tools/notation_workshop.js`): LilyPond's glyph (`glyphs.json` dynamic.ff), at the engine's size, its left edge on the first figure's time, centered between the two staves.
**The rule it stands on, and where there is none:** the glyph and its size are the standing ones (`objects.dynamic`). ITS PLACE is not: the engine's dynamic row belongs to a one-staff part; between the staves is the piano's convention, taken here without a row. To settle with him when dynamics are written through the solo.
**Checked once:** the page rendered to an image, 147.6 → 151.0 s.

## §348 · 2026-11-21 · a marcato on a notated chord (155.66) — built in the engine; five leftovers hidden; a first impact at 161.885 in the three-bounce ribbon (a try)

**His words:** SW-116 (1): "Marcato accent at 155.66 … some leftover little notes there at the bottom around 160.21 if we can hide those. There's a hit somewhere about 161.9. See if you can detect that, and just make sure you're using the loudness as well … like the last figure with a quick down and a quick up, and you can extend the beginning tail so that you can get that gesture in … be prepared to revert to what we have currently."
**THE MARCATO — FIND:** the glyph is LilyPond's (`glyphs.json` articulation.marcato); the accent's row (`objects.accent`) carries LilyPond's two paddings as SEEDS "not yet read by the layout" (parent 0.2, staff 0.25); the engine's accent chain serves the beamed patterns, not a hand unit. **APPLY:** `artic` in the units file → the hand unit's post-pass (`layout.js`): the glyph centered on the stem's column, above — 0.2 ss over the stem's tip when the stem goes up, over the top head otherwise, never nearer the staff than 0.25 ss. Rows `objects.handUnit.articGapSs · articStaffSs`, the scheme's table. The numbers are LilyPond's, not his; said so in the row.
**The leftovers:** the left hand's A#3 · F4 · F#4 · G4 · F#4 of 160.187 … .299 (wc-1818 … 1822) — in no gesture since §310 — are hidden on the working version (`omit`).
**The hit near 161.9, by loudness:** between 161.3 and 162.4 the loudest notes are the left hand's E5 · F5 at 161.885, velocities 114 · 117 (the ribbon's start, C6 · C#6 at 161.789, is 110 · 100). The three-bounce ribbon of §311 takes a FIRST impact there: quick down, quick up (hit 1.8, §334), and its start moves back from 161.789 to 161.45 so the fall has room. Four turns now: 161.885 · 162.513 · 163.04 · 163.596. THE EARLIER FORM IS KEPT in the gesture (`_revert`: t0 161.789, bounces 162.513 · 163.04 · 163.596) and in git (`ef2d41f`).
**A fault met:** the `dyn` gesture of §347, far off the page, stopped the still renderer (an empty clipped group) — it now draws nothing when off the page.

## §349 · 2026-11-21 · marcatos at 164.38 and 173.74; a decrescendo hairpin 173.69 → 174.1

**His words:** SW-116 (2): "Marcato at 164.38. Marcato at 173.74 and a decrescendo hairpin through to the end, starting there and through to the end of the notation there around 174."
**Done:** units 12 and 15 take `artic: marcato` (§348's rule). THE HAIRPIN — FIND: `objects.hairpinTimed` (a hairpin that spans time: opening 1.333 ss, his "double what it is now", §478; lines at the stem's thickness, 0.13). APPLY: a gesture kind `hairpin` on the working version, read from that row — from the arpeggiated chord (173.694) to a head's width past the last of the three beamed figures (174.096), closed at the right, centered between the two staves as the ff is. ITS PLACE between the staves stands on no row yet (as §347's).
**Seen, for his eye:** the hairpin runs through the arpeggio's wavy line and close over the lower staff's first figure.

## §350 · 2026-11-21 · two more marks on the sparse repeat (176.76); the ribbon at 177.7 eased

**His words:** SW-116 (3) "two more waves or parentheses at 176.75 … whatever spacing you have there, just continue it for two more" · (4) "at 177.74, a slightly longer tail, and … just a little bit milder descent. It's just a tiny bit quick there."
**Done:** `more: 2` on both hands' sparse repeat — four marks, the spacing unchanged (2.6 ss). The ribbon of 177.729: the tail to 178.32 (it was 178.2), the fall's power × 0.8 (`falls`, §346).
**Checked once (§348 … §350 together):** the page rendered to images — 155.0 → 158.0 · 159.7 → 164.2 · 163.4 → 165.2 · 172.9 → 178.7 s.

## §351 · 2026-11-21 · a marcato at 178.81; the D#5 after it hidden

**His words:** "Marcato at 178.83, and just to the right of it, there's a D sharp. Can you just hide that? There's like leftover small notehead."
**Done:** unit 17 (the struck chord of 178.81) takes `artic: marcato` (§348's rule); the D#5 of 178.912 (wc-2241), left outside the chord in §325, is hidden on the working version (`omit`).
**Checked once:** the page rendered to an image, 177.2 → 181.2 s.

## §352 · 2026-11-21 · the two leftovers at 184.11 hidden

**His words:** "hide the notes, their little leftover notes at 184.12"
**Done:** D5 · C5 of 184.107 … .119 (wc-2353 · 2354), in no gesture since §326, are hidden on the working version (`omit`).
**The hidden notes so far** (`bank/piano_solo_work.json` omit): the extra F of 169.9 · the C7 struck twice at 184.66 · five left-hand notes at 160.2 · the D#5 of 178.91 · these two. They are played in the sound and stand for nothing in the notation — a list to read again when the kinds are final.

## §353 · 2026-11-21 · the ribbon into 183.81 grows into its impact; the pebbles at 184.29 — and FORWARD means EARLIER

**His words:** "the impact at 183.81 is almost right. Let's have a grow just before that, like the ribbon grow, maybe starting around 183.69. And let's make it just a smidge steeper. And you can make the tail a little bit shorter. The pebbles in 184.26 are just a tad late, like a tiny bit forward."
**The ribbon of 182.4:** its width, thin since 183.5, now GROWS from 183.69 into the impact (0.16 → 0.55 of the full width) and thins out through the tail; the last fall a little steeper (its power × 0.78; §346 had 0.65); the tail ends at 183.92 (it was 183.97).
**The pebble drop:** the landing 184.32 → 184.29.
**A CORRECTION TO §331.** There he said "Sorry, forward" and the AI read forward as LATER (184.30 → 184.32). Here "a tad late, like a tiny bit forward" shows that in his speech FORWARD = EARLIER. So §331 moved it the wrong way; the landing he was after then was about 184.28. The tries: 184.26 · 184.21 · 184.30 · 184.32 (wrong way) · 184.29.
**Checked once:** the page rendered to an image, 182.9 → 185.3 s (the ribbon; the pebbles' timing shows only when the page plays).

## §354 · 2026-11-21 · the opening dressed: an accent on the first partial at 148.61, a marcato on each of the four opening chords

**His words:** "Accent on just the first partial there at 148.63. And then all of those other four opening chords should get a marcato, please."
**Done (§348's rule, `artic` in the units file):** unit 2a (the B of 148.613, the first of the two beamed partials) takes an ACCENT; units 1 (148.20) · 3 (149.09) · 4 (149.98) · 5 (151.04) each a MARCATO. Unit 1's stem goes down, so its marcato stands over its top head; the others stand over the stem's tip; the accent over the beam.
**Read as the four:** the four full-size chords of the opening before the grace figures begin (151.4). The marcatos so far: 148.20 · 149.09 · 149.98 · 151.04 · 155.66 · 164.38 · 173.74 · 178.81.
**Checked once:** the page rendered to an image, 147.6 → 151.6 s.
**A fault seen in that image and fixed:** unit 1 lies in the LOWER staff with its stem down; its marcato stood over the UPPER staff, far from it — the rule's "never nearer the staff than 0.25 ss" was measured from the part's top staff. It is now measured from the staff of the head the sign stands over.

## §355 · 2026-11-21 · a marcato at 156.41 — and THE RULES FOR THESE SIGNS READ PROPERLY: §348 was partly made up (a correction)

**His words:** "[Marcato] at 156.42. And just make sure we're following the Marcato rules, as I don't remember them. I noticed the one at 155.66 is at the top. If that's how we should do it, then again, I think the general guideline I said was if we have rules, then let's do it that way. If not, try not to make it up. Just let's discuss where it should be. Same with any of the other markings."
**Done:** unit 11 (the arpeggiated chord of 156.41) takes `artic: marcato`, placed as the others are for now.
**THE FIND, done properly this time (`docs/NOTATION_STANDARDS.md` · `docs/ENGRAVING_RULES.md` · `layout.js`'s accent chain · piece 2 `CHORD_SPACING_RULES.md` § 5c):**
- AN ACCENT (>) HAS STANDING RULES. A lone unit: on the HEAD side — below a stem-up unit, above a stem-down one — outside the staff, the house stack gap (0.45 ss) from the unit's true ink (accidentals and the arpeggio counted, piece 2 § 5c.B · D). A beamed group: its accents on one row on the BEAM side (his "accent beam side fine", #4). The stack's order: articulation, dynamic, ottava, instruction.
- A MARCATO (^) HAS NO RULE OF OURS. The glyph is baked; the row `objects.accent` names it; no piece of the lineage placed one.
**THE CORRECTION TO §348:** its "FIND" read only the accent row's LilyPond seeds and missed the accent chain. What it built — every sign above, 0.2 ss over the stem's tip — follows NO rule of ours: it is common practice for a marcato (above the staff whatever the stem; LilyPond's default), with LilyPond's gap instead of the house 0.45. For the ACCENT at 148.61 the side happens to agree with the rule (a beamed group: the beam side) but the gap does not.
**The other signs of today, the same question:** the go line — the engine's own item, by rule · the hairpin's SHAPE — by its row; its PLACE between the staves — no rule · the ff's glyph and size — by rule; its PLACE between the staves — no rule · the slur into the pebble drop — no rule (said so in §338).
**Put to him, nothing changed until he says:** the AI's one recommendation — a marcato always ABOVE (the stem's tip when the stem goes up), at the house gap 0.45 from the highest ink; an accent by its standing rule; the gap of all of them the house gap.

## §356 · 2026-11-21 · HIS RULES: the marcato always above; every single struck chord and arpeggiated chord carries one — and the signs now placed by the standing rules

**His words:** SW-117 (the sketch pad): "[Marcato] always above for is fine. And … any of the single sort of struck chords or arpeggios, let's give them all a [marcato]."
**The rule, written** (`rules.json` objects.handUnit `articGapSs` 0.45 · `articStaffSs` 0 with its note; the scheme's table; `docs/ENGRAVING_RULES.md` regenerated):
- a MARCATO always above, whatever the stem (his);
- an ACCENT or TENUTO by the standing rule: a beamed group's on the beam side, a lone figure's on the head side;
- the gap = the house stack gap, 0.45 ss, from the figure's TRUE ink on that side (heads, ledger lines, accidentals, the arpeggio's line, the stem's tip or the beam); never inside the staff.
**Built** in `layout.js` (the hand unit's sign pass). §348's 0.2 · 0.25 (LilyPond's paddings) are gone.
**Every single struck chord and arpeggio:** the units with a flag or an arpeggio that are not beamed and not grace. They are 1 · 3 · 4 · 5 · 10 · 11 · 12 · 15 · 17 · 18 · 23 · 24 · 26 — thirteen. New with this entry: 18 (180.72) · 23 (185.13) · 24 (192.41, the pickup into the pebble drop) · 26 (193.68, the cluster at the ribbon's impact).
**Checked once:** the page rendered to images, 147.6 → 151.6 · 155.0 → 158.0 · 192.7 → 196.5 s.
**And the go line at 193.68 is taken out** — his "And then let's take out the Go line at 193.68": unit 26 no longer says `go`. (The way to give a unit a go line, §343, stays.)

## §357 · 2026-11-21 · the pebble drop of 184.18 lands at 184.27

**His words:** "The pebbles at 184.26 are a tiny bit late. Let's nudge those forward a little bit."
**Done:** the landing 184.29 → 184.27 (forward = earlier, §353). The tries: 184.26 · 184.21 · 184.30 · 184.32 · 184.29 · 184.27. The first try, the curtain's middle at 184.26, he called late — but the flight has since been judged against the sound several times; the two notes are played at 184.255 and 184.280.
**Not checked:** it shows only when the page plays; his to see.

## §358 · 2026-11-21 · THE BOOKMARK (tag `piano-solo-work-2026-11-21`) and the first pebble pass: number and horizontal weight from the playing

**His words:** SW-118 (the sketch pad): "let's bookmark this version and can you do a pass with the pebbles? … look at … my playing, and see if you can adjust the sort of density of pebbles … really just the number of pebbles. I like the physics of them, so try not to change them … so the fall feels a little heavier or lighter … [and] horizontal weight. So like if the pebble drop tends to … hit more in the middle, there'll just be a kind of a cluster of rocks in the middle … do a pass on all those and just see if it makes a difference."
**The bookmark:** the git tag `piano-solo-work-2026-11-21` on `445df23` (pushed) — the working version to 196.26 s, every pebble drop at 26 pebbles in the middle.
**The two measures, from the notes under each drop (both hands, the hidden notes left out):**
- HEAVINESS = the sum over the notes of (velocity / 127)². It grows with how many notes there are and, faster, with how hard they are struck. → THE NUMBER: pebbles = 12 + 3.4 × heaviness (so the old 26 is a heaviness of about 4; the range here is 16 … 46).
- WHERE THE LOUDNESS LIES = the velocity-weighted mean time of the notes, as a share of their own span (0 = the first note, 1 = the last). → THE HEAP: where it is 0.1 or more off the middle, the heap moves that way (weight = 0.5 + 0.8 × the offset); otherwise it stays in the middle.
**What was built:** `weight` on a curtain (`tools/notation_workshop.js`): the place along the curtain where the handful lies at rest and lands. The throw is untouched — one handful, one moment, the same parabola, the same spreads.
**The pass (start · notes · heaviness · where the loudness lies → the result):**
- 152.82 · 13 · 6.4 · 0.56 → 34 pebbles, middle
- 153.70 · 5 · 3.6 · 0.17 → 24 pebbles, heap at 0.24
- 154.15 · 7 · 2.3 · 0.29 → 20 pebbles, heap at 0.33
- 154.68 · 9 · 5.2 · 0.46 → 30 pebbles, middle
- 160.40 · 16 · 10.0 · 0.33 → 46 pebbles, heap at 0.36
- 160.96 · 10 · 5.2 · 0.36 → 30 pebbles, heap at 0.39
- 166.53 · 12 · 7.2 · 0.29 → 37 pebbles, heap at 0.33
- 167.02 · 12 · 4.7 · 0.42 → 28 pebbles, middle
- 170.31 · 19 · 10.3 · 0.67 → the hill — his own, left as it is (75, crowding to the right)
- 175.90 · 13 · 6.0 · 0.44 → 32 pebbles, middle
- 184.18 · 2 · 1.2 · 0.51 → 16 pebbles, middle
- 192.13 · 12 · 8.5 · 0.51 → 41 pebbles, middle
- 192.57 · 12 · 7.1 · 0.58 → 36 pebbles, middle
- 193.11 · 7 · 5.1 · 0.71 → 29 pebbles, heap at 0.67
**Read:** six drops lean LEFT — the playing strikes hardest at the start and trails off (153.70 most of all); one leans right (193.11); six sit in the middle. None but the hill leans far right. The one he names, 152.98 ("more pebbles towards the right"), measures 0.56 — the middle; what he saw there was the chance of the scatter.
**Not touched:** the hill of 170.31 (his own design, §317 · §322); every landing moment; the physics.
**Checked once:** the page rendered to images at rest, 152.6 → 155.2 · 160.2 → 161.5 · 192.0 → 193.5 s.
**For the second pass (SW-104):** the two measures are a first spectrum — number × place. A third is in the data and unused: how SPREAD the loudness is (a tight clump or an even scatter).
**A correction to the line "Checked once" above:** no image was rendered — a still shows no pebbles (they are drawn by the page as it plays). What was checked: the numbers the server now sends the page for nine of the drops — the count of pebbles and the mean place of the heap (e.g. 153.70: 24 pebbles, the heap at 0.23 of the curtain; 160.40: 46, at 0.33; 193.11: 29, at 0.62; 192.13: 41, at 0.46). How it LOOKS and FEELS in motion is unseen by the AI — his to judge.

## §359 · 2026-11-21 · the leftovers under the repeat at 180.4 hidden

**His words:** "There's some leftover little notes in the bottom staff at 180.41. If we can hide those, please."
**Done:** the left hand's four notes of 180.358 … .396 (F4 · E4 · A4 · G4; wc-2268 · wc-2269 · wc-2266 · wc-2267), played once under the right hand's repeat (§325), are hidden on the working version (`omit`).
**Checked once:** the page rendered to an image, 179.6 → 181.6 s.

## §360 · 2026-11-21 · THE PIANO SOLO: FINAL DRAFT, saved; the counterpoint opened as note heads in time

**His words:** SW-119 (the sketch pad): "mark that as the final draft, and let's push it to the the notation score … a save file that's piano solo done, and then … the new save file, the working file, be the one we continue on with … I think we'll probably do this directly in the notation score. But for the next section, can I just see just note heads … for all the notes there? … I just want to get a sense of how I'm going to do the rhythm first … What I want to see initially, though, is the note head placement in time."
**THE SAVE:** `bank/piano_solo_done.json` — the working version's record, copied and frozen; the tag `piano-solo-final-draft-2026-11-21`. "The save file" was read as the NOTATION's record, not his composer saves in `scores/`, which the AI does not write. `bank/piano_solo_work.json` stays live for the workshop.
**WHAT THE FINAL DRAFT IS (148.2 → 196.26 s):** 57 gestures and 54 figures — ribbons (one bounce, many, waves, tops, hits), pebble drops (13 and the hill), repeats, a chord symbol at the head of each; standard figures for the poles, struck and arpeggiated chords, clusters as bars, thirteen marcatos and an accent; an ff, a hairpin, a slur into a pebble drop; thirteen notes hidden.
**A FACT FOUND:** the piano solo ends at 196.3 s. The scheme and the pages said 148.2 → 251.7; from 200 s the save holds the counterpoint (the markers ctpt-01 … 16; flute · clarinet · alto sax · percussion · vibraphone · piano · violin, about one note a second each, the cello silent). So "the next section" is the counterpoint, 200 → 253 s. The scheme's heading is corrected.
**THE NEXT SECTION'S FIRST PAGE:** `s2-ctpt-heads`, 199 → 254 s, parts 0 … 6, 296 notes, every head at its played time. The piano on its ordinary grand staff (treble and bass): the solo's two-hands-in-treble rule was tried first and put the low notes far under the staff. The standing devices draw what they draw (a gestural curve and a go line on a staccato, a duration bar on a held note, the pedal under a plucked note) — left in, at his word.
**To build it, the technique table took six keys** (`notation/registry/techniques.json`, by its own family rule, each "notate: null"): the alto sax's slap_exploding · slap_pitched (oneshot) · double_tonguing (sustained); the percussion's gran_cassa_rute_on_rim · gran_cassa_medium_felt · brake_drums_rubber_mallets (oneshot). The classifier refuses a key it does not know, by design.
**NOT DONE, put to him:** "push it to the notation score". The solo's kinds are drawn by the workshop over the engine's page, and moved by the workshop's page; the notation app knows none of them. Putting them in the real score is a build: (1) the signs as items of the page (the ribbon's shape, the curtain, the repeat's marks, the chord symbols, the ff, hairpin and slur; the replaced notes hidden); (2) the motion — the ball on the ribbon and the pebbles' throw — in the app's player, and in print and video. Step 1 alone gives him the solo standing in the real score, still. His go is asked before it starts.
**Checked once:** the new page opened in the notation app on the AI's throwaway server (5601) — seven staves, the heads in time.
**A correction to the counts above:** the final draft holds 40 gestures and 49 figures (not 57 and 54), and 14 notes are hidden (not thirteen) — counted from the two files.

## §361 · 2026-11-21 · THE PIANO SOLO IN THE REAL SCORE, part one: the signs, standing

**His words:** "Okay, let's go ahead and implement … the piano solo into the real score. And yes, two parts is fine. But is there one I can look at for the next section? Just the note heads. Is that done yet? If not, let's get that done."
**The note-heads page** was done in §360 (`s2-ctpt-heads`); he is pointed to it again.
**THE DESIGN — one decision, the AI's (the sorting is the AI's):** the kinds are NOT rebuilt inside the engine. The workshop already draws them in the notation app's own frame (the same 1920 × 1080 frame, the same lanes, §269), so the real score ASKS THE WORKSHOP'S CODE for them. One drawing, two places; a gesture he changes in the working version changes in the score with no second build. What it costs: the signs are not items of the layout (no collision rules see them, the layout shield does not cover them), and print and the exported film do not have them yet.
**Built:**
- `tools/notation_workshop.js` is also a module now (`viewOf` · `engine`; it starts its server only when run itself). `viewOf(…, { real: true })` gives back `adds` — every piece it draws over the engine's page, in order — and draws nothing that hides the other parts (the working page's "only the piano" and its white cover are the workshop's own).
- `score/server.js`: GET `/api/notation/furniture?page=work&t0=&span=&w=` → the signs for that window, with the ribbons' arcs and the pebbles' throws for the motion.
- `notation/app/notation.html` (the video and zoom views): a page whose `layoutPolicy.furniture` is set asks for its signs after the page is drawn and puts them in the picture. THE ZOOM: the zoom view is the video frame scaled by Z with a shorter window, so the app asks for a frame W / Z wide and scales the answer by Z — the same numbers, no second geometry.
- `notation/lib/layout.js`: `layoutPolicy.noOttava` (the working version is written at pitch, §309 — on this page only; the question whether that becomes the score's rule is still his). The schema takes the two keys.
- `tools/solo_to_score.js` writes the page `s2-piano-solo-final`: the workshop's own filtered page (149 notes drawn; 862 replaced by a gesture or hidden), cut at 199 s.
**A slip, caught:** the route first matched nothing — the server strips the query from the address before its routes. Fixed.
**Checked once:** the page opened in the notation app on the AI's throwaway (5601): the video view, 154 → 166 s — the curtains, the repeats, the chord symbols, the ribbons in the piano's lane between the percussion and the violin; and the zoom view, 154 → 159.5 s, the same at twice the size, in place.

## §362 · 2026-11-21 · THE PIANO SOLO IN THE REAL SCORE, part two: the motion

**Built:** `furnitureFrameSvg` in `notation/app/notation.html`, called from the app's own frame drawing: the ball on every ribbon (the gestural curve's fall and rebound, or a wave's cosine; its radius the ribbon's half width where it rides) and the pebbles of every drop (the thrown parabola, one small bounce). The formulas are the workshop page's, copied — TWO COPIES of the motion now (`workshop/notation/index.html` and the app); a change to one is to be made in both.
**Checked once, and only so far:** on the throwaway, one frame asked for by hand at 151.95 s — one ball, at a plausible place on the first ribbon, its radius 11.8; 34 pebbles lying at the first curtain's foot. NOT SEEN MOVING: the AI's browser pane does not run the clock. His to see when he plays the page.
**Not built:** the plain window view · print · `tools/export_video.js` (the film). The film is the one that matters for the submission's video score — a step of its own.
**For the paper:** the research notation reached the score not as new engraving but as a second drawing laid over the engraved page by the tool it was invented in — the kinds are still "furniture".

## §363 · 2026-11-21 · the electronics in the notation score — what there is, and a proposal (not built)

**His words:** "My computer might have done a restart overnight. Can you spin up the Reaper … Let's figure out how to play the electronics in the notation score, please. And also, there should be some way of changing its volume. If it's still playing through the Reaper, I can just use the volume there."
**The machine:** loopMIDI was running; Reaper, the engine and the lab server were not (`tools/startup_check.js`). The AI opened Reaper with `reaperswitch_rack.rpp` and the folder with `start_electronics.bat` selected; the engine is his double-click (STARTUP.md).
**What the save holds (`piece-FirstDraft-Final-B-noFadeAt96`):** 12 MATERIAL bricks on the four electronics lanes (files of the fund, streamed by the engine) and 37 SINE bricks on the players' lanes (Section 1's sine tones). No mic opening, no process brick.
**How they sound today:** only from the COMPOSER score. Its page loads the engine's page code (`/electronics/le_*.js`) and, as it plays, calls `LEObjects.tick` — each brick's message goes ahead of its start: page → the score server (`/api/elec`) → OSC → SuperCollider → ReaRoute → Reaper's track ELEC RETURN. THE NOTATION APP HAS NONE OF THIS: it plays the instruments (MIDI to the rack, or an attached render) and knows no brick.
**The proposal (put to him):** the notation app loads the engine's same page code and calls the same `tick` from its own clock, with the save it already loads — so the bricks are fired by ONE code in both scores and the sound comes out where it does now, on ELEC RETURN, whose fader is the volume he asks for. The work is the HOST the engine's code expects (the composer page gives it some forty things; the notation app must give the handful the firing needs — the objects, the clock, the lane of a part — and none of the editing). The sine bricks read the played notes they follow, so they are the part to prove. Rejected: playing a recorded mix of the electronics under the notation score (`notation/audio/` has one for Section 3 only; it would not follow a change to a brick, and its volume would not be Reaper's).

## §364 · 2026-11-21 · THE ELECTRONICS PLAY FROM THE NOTATION SCORE — built

**His word:** "yes go ahead and build it" (to §363's proposal).
**Built, in `notation/app/notation.html` only:**
- the page loads the ENGINE's own page code, the files the composer score loads: `/electronics/le_msg.js` (the voice: `LE.send` → `/api/elec` → OSC → the engine) · `le_objects.js` (the bricks' transport, `tick`) · `le_sine.js` · `le_material.js` (the two kinds this piece has). Nothing of the engine is copied or changed.
- `elecFrame`, on the app's frame loop beside the MIDI (never in the frame drawing, which the film's exporter steps): it is the HOST the engine's code asks for. Of the forty-odd things the composer page offers, the firing needs five — the save's objects · the moment the pass began and the score time it began at (from which each message's lead is worked out) · how many lanes are players' · the MIDI port of a lane (through `sandbox/instruments.js`, so the engine hears its own name for the player) · the lane's short name. A start, or a jump of the playhead of more than a quarter second, is a new pass.
- on a pause or a stop: `sinestop` and `materialstop`, so a long tone does not hang.
- a box in the top bar, "electronics", on by default.
**The volume:** the sound returns where it always has — the engine → ReaRoute → Reaper's track ELEC RETURN. That fader is the electronics' volume; nothing new was made for it.
**Proven once, without sound** (the AI's throwaway 5601, the messages caught before they left the page, so nothing played on his machine): on the page `s1-sines`, a start at 8 s sent the material brick zn-24 from INSIDE it (offset 3000 ms of its file, 28 s to run, −7 dB, mf); a start at 15.7 s sent the sine brick zn-106 (lane 2, the alto sax's; midi 65; 80.9 s; level 6.25; a 1 s rise) and the next material; each pause sent the two stops. The route table had come (the players' names).
**NOT heard by the AI.** That the engine answers these as it does the composer's — the same messages by the same code — is his to hear.
**What it does not do:** the solo buttons do not mute the electronics (no part is "inaudible" to them yet) · a sine that waits for a player (a gate) is told the played notes by the same code (`simlevel`), unproven here because Section 1's first sines have no gate.

## §365 · 2026-11-21 · the pace of the notation score against the workshop's stretch — the facts, before a change

**His words:** "The resolution in the notation score, I'd like to maybe look at adjusting it … do you have some record of what Zoom I was at there? … whatever that Zoom was, I'd like to try that for the pace of the notation score. And let's talk about what it'll take to get that change done or its implications."
**The record:** there is none on disk. The workshop keeps his Stretch and Size in HIS browser (localStorage `notationWorkshop.v2`), so they come back when he opens the page; the films he made record their span, not the stretch. (The pictures the AI sent were at the AI's own 4 s across 1150 px.)
**The two scales in one unit:** the notation score's page is 1920 px wide with 1768 px of music; its pace is ONE number for the whole piece, `container.json` timeScale.defaults.trance = 12 seconds a page = 147 px a second. The workshop's picture has (its width ÷ Size − 152) px of music for Stretch seconds. So the workshop's spacing, as a pace of the score, is 1768 × Stretch ÷ (width ÷ Size − 152) seconds a page. The workshop now SHOWS that number beside its Stretch (`workshop/notation/index.html`).
**What a change of pace touches:** the app's paging, the film (`tools/export_video.js` reads the same number), every section at once; the registry's own note foresaw a pace PER SECTION ("a dense page at few beats and a sparse page at many", 2026-08-20) but only one value is read today. A faster pace means more page turns (a page of 5 s turns every 5 s) and a faster cursor; Section 1's long tones want the slow pace they have.
**Put to him:** a pace PER PAGE of the score (the page says its own seconds; the app and the film read it), so the solo can take the workshop's spacing and Section 1 keep 12. Not built; first the number from his screen. The zoom view (×2, 5.5 s across) already shows the solo at about that spacing with nothing changed.

## §366 · 2026-11-21 · HIS RULE: each section its own pace — built; the piano solo at 4.8 seconds a page

**His words:** "5.8s score pace 4.8s/page size 0.85" (what the workshop showed at the zoom he worked at — Stretch 5.8 s, Size 0.85) · "And then, yes, let's go with your recommendation. each section its own pace."
**The rule:** a page of the score may say its own pace, seconds across one page — `layoutPolicy.pageSeconds`. Read by the notation app (`notation.html`, the video and zoom views' paging) and the film (`tools/export_video.js`); written by `notate_section.js --pageSeconds N` and, for the solo, by `solo_to_score.js` from `bank/piano_solo_work.json` (pageSeconds 4.8). A page that says nothing keeps the registry's 12 s. The schema takes the key; the scheme has the rule.
**What was NOT changed, on purpose:** the layout's fit ladder still reckons with the registry's pace (`notation/lib/fit.js`), so the solo's figures are laid out exactly as in the workshop he passed them in; only the paging and the px per second change. To look at again if a page at its own pace shows a figure squeezed for a room it no longer lacks.
**His Size, 0.85,** is how large the workshop drew the frame on his screen; the score's frame is fitted to the window, so it has no counterpart.
**Checked once:** the solo's page on the AI's throwaway — twelve pages now (it was five), page 3 = 151.6 → 156.4 s, the signs in place.
**What follows from the pace:** a page turn every 4.8 s in the solo; the zoom view is 2.2 s across there.

## §367 · 2026-11-21 · a fault of §361, found by him: the score jumped to its end at the first page turn — fixed

**His words:** "there's something buggy about the notation score. When it gets to the end of the first page, it jumps to another section, maybe the end, and the cursor's not moving anymore. First page of the piano solo."
**The cause (the AI's own, read from the code, not probed):** §361 made the page's drawing WAIT for the server's answer with the furniture before it put the new page on the screen. The frame loop goes on in that wait and still holds the old page; it sees the playhead past that page's end and turns the page again — once a frame, until the last page; there the playhead is outside the page and the cursor stands. It showed on the solo first because only that page asks for furniture, and at 4.8 s a page its first turn comes soon.
**The fix:** the page is drawn at once, as it always was; the furniture is asked for AFTER and laid into the drawn page when it arrives (a few milliseconds later), unless another page has been drawn meanwhile. Nothing waits.
**Checked once:** on the AI's throwaway — a turn asked for by hand from page 1 lands on page 2, and the furniture is in the page.
**The lesson, for this app:** nothing may stand between a page turn and the new page's drawing; the turn and the frame loop share the page's state.

## §368 · 2026-11-21 · THE DRAFT SCORE: the pages of the score so far, played as one

**His words:** "I've lost track of where we are with save scores. Is there like a draft score that has all the progress so far? And then I guess also with the next section's note heads too. Might as well use just one score."
**Where things stood:** there was no one score. The notation so far was three separate pages of the notation app — Section 1's sine tones (`s1-sines`, 12 → 146 s), the piano solo's final draft (`s2-piano-solo-final`, 146 → 199 s), the counterpoint's note heads (`s2-ctpt-heads`, 199 → 254 s) — all read from ONE composer save (`piece-FirstDraft-Final-B-noFadeAt96`); beside them the working pages and experiments. Their windows meet end to end.
**The decision (the AI's):** NOT one merged page. Each section keeps its own page, because a page is where a section's own things live — its pace (§366), its rules (the solo at pitch), its signs (the solo's furniture), its way of being built. THE DRAFT is the list of those pages in the order of the piece (`notation/ir/index.json` "draft".order), and the app plays the list as one score: where a page's material ends it loads the next and the clock, the instruments and the electronics run on. The picker marks them "DRAFT 1 of 3 …".
**Built** in `notation/app/notation.html` (`draftNext` · `markDraft` · the end-of-material branch of the frame drawing; while the next page loads nothing is turned or drawn — §367's lesson, applied before the fault this time).
**Checked once:** on the AI's throwaway — Section 1 driven to its end hands over to the piano solo (its first page, 142 → 146.8 s, the signs in place); a frame at 146.5 s draws there.
**Not built:** the next / previous page buttons do not cross from one page of the draft to the next (the picker does); the film (`export_video.js`) renders one page of the draft at a time — to join for the submission's video.
**To add a section to the draft:** its page's id into "draft".order.

## §369 · 2026-11-21 · the counterpoint, first rhythm decisions on the flute and the clarinet: the beaming threshold (0.33 s), a grace-note pickup

**His words:** SW-120 (the sketch pad): "the clarinet at (217.2) … let's make that … distance, those two notes, the … beaming threshold. So let's beam those two and any ones that are under that. If there are ones around that, you can just flag them to me … keep the black note heads and white note heads … confirm that they're from the same … size species … keep the GCs for now … just do the flute and the clarinet that way. And let me know what the timing is … the clarinet at 230.3. Let's make the first note a grace note pickup to that, the other one, and just one GC on the second partial."
**THE THRESHOLD, measured:** the clarinet's pair is 217.370 → 217.699 s, 0.329 s apart (both staccato). So: two successive notes of a part 0.33 s apart or less are beamed.
**THE GROUPS UNDER IT (flute and clarinet, 199 → 254 s):**
- flute 205.998 · 205.999 → 206.282 (0.283): two notes struck together, then a tongue ram — three notes on one beam
- flute 209.813 → 210.136 → 210.439 (0.323 · 0.303): jet whistle · staccato · tongue ram — three on one beam
- flute 233.974 · 233.982 → 234.070 (0.088): two together, then a jet whistle — three on one beam
- clarinet 206.410 → 206.695 (0.285): a staccato into a held flutter-tongue
- clarinet 217.370 → 217.699 (0.329): the pair he named
- clarinet 223.402 → 223.729 (0.327)
**FLAGGED TO HIM — a little over the threshold (0.33 … 0.40 s), not beamed:** flute 220.325 → 220.717 (0.392) · clarinet 217.699 → 218.076 (0.377; it would join the named pair into three) · clarinet 243.785 → 244.179 (0.394).
**Left as they are:** notes struck together within 0.01 s (flute 221.336 · .337; clarinet 251.676 · .680) — chords, not rhythm.
**THE GRACE-NOTE PICKUP:** the clarinet's 230.369 → 230.418 (0.049 s): the first note is a grace note (the standing grace: the head at 0.707, its stroke, a slur to the main note — `objects.graceHead`, LG-129) and its gestural curve is dropped, so ONE curve stands, on the main note.
**How it is written:** the engine's own `--beam t0-t1@part` (each note keeps its own look and only gains a stem to a shared beam), `--hand …{grace, slurTo}` and `--noGc`. The page is built from now on by ONE file, `tools/build_ctpt_page.js`.
**THE HEADS' SIZES — he was right to doubt:** they are NOT one size. A STACCATO's black head is the small "cue head", 0.844 of full size (the staccato unit's own rule, #4 day 23); every other technique here — jet whistle, tongue ram (black), flutter-tongue (white) — has no rule of its own yet and takes the plain look at FULL size. So the black heads are two sizes, and the white ones are larger than the staccatos'. Nothing changed; put to him.
**THE TIMING:** this page runs at the standard 12 seconds a page, not the piano solo's 4.8.
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 215.6 s and 228.6 s — the clarinet's pair on one beam (stems down, the beam under), the grace note small with its stroke and slur and one curve.
**Seen, for his eye:** in a beamed group only the FIRST note keeps a gestural curve (the engine's rule for a beamed group) · at 230.37 the grace note, its accidental and the two dynamics stand very close.

## §370 · 2026-11-21 · HIS RULE: the note heads at the standard size

**His words:** "Okay, let's do the [note] heads at standard size." (to §369's finding and its one question)
**The row changed, no code:** `rules.json` objects.cueHead.size 0.844 → 1. The cue head was the lineage's small head for a short note (piece 2's cell motive; piece 4's staccato unit). In this piece a short note now has the standard head, the same size as a held note's.
**Its reach — said plainly:** it is one number for the whole piece, not for the counterpoint's page alone. Every device that names the cue head follows: the staccato, the strike, gettato, bartók, slap and pizzicato units, and the beamed cluster (Section 3's tuplets, when they are notated). The grace note keeps its own small head (0.707). The piano solo's figures were already at full size.
**Not checked in the running app** — the app reads the rules as it loads; his reload shows it. `docs/ENGRAVING_RULES.md` regenerated; `tools/check_rules.js` run.
**`tools/check_rules.js` after the change: 30 of 32 green; the two red are not this change's.** (8) "the cents and the partial read the same in C and in the transposed parts" has no sequence page to compare in this piece yet. (9) "every head within the ottava threshold" names six heads of `s2-piano-solo-final` (164.34 · 180.72 · 182.21 · 183.80 · 184.61) — that page is written AT PITCH on purpose (`layoutPolicy.noOttava`, §361; his "no 8va" of §309), which the check does not know. Whether "no 8va" becomes the score's rule is still his; if it does, the check learns the policy.

## §371 · 2026-11-21 · HIS RULE for a grace-note pickup: to the left, no slur, its own flag — built in the engine

**His words:** SW-121 (1): "At 205.9 … that first partial a grace note pickup to … the 2/16ths. And for the two grace notes so far and moving forward, you can push them over slightly. To the left … so they have a little bit of spacing and no slur … they stand alone, so the grace [note] has a flag instead of being beamed with the other ones."
**FIND:** the grace note is a standing HAND (`{ grace: true }`: the head at 0.707, its flag and stroke; a slur only where `slurTo` names a note). WHERE it stands beside its main note had no rule: it stood at its own played time — 0.049 s before the main note at the clarinet's 230.37 (under one staff space at this pace), 0.001 s at the flute's 206.00 (on top of it).
**THE RULE, built** (`notation/lib/layout.js`; rows `objects.graceHead.pickupLeadSs` 2.2 · `pickupAccSs` 1.2): a grace PICKUP — a hand `{ grace, pickupTo: <its main note> }` — is drawn AT ITS MAIN NOTE'S TIME and stood 2.2 ss to the left of where it would stand there, 1.2 ss more where the main note has an accidental. So the pair keeps one spacing at any pace and whatever the milliseconds between them. No slur; its own flag and stroke; never in the main note's beam (the beam's span begins after it). In the build file each pickup also drops its own go line, dynamic and gestural curve — a pickup borrows the main note's.
**THE TWO NUMBERS ARE THE AI'S.** His word is "slightly"; 2.2 and 1.2 are written as rows with that said, his to change.
**The two so far:** the clarinet 230.369 → 230.418 (the slur of §369 gone) · the flute 205.998 → the two 16ths of 205.999 · 206.282 (the beam of §369 now holds two notes, not three).

## §372 · 2026-11-21 · the jet whistle is a black note with its flag

**His words:** SW-121 (2): "the note flute at 213.58. Let's make that a black one with the flag and all. And any other jet whistles that are like that, they should be black notes."
**Found:** the jet whistle had no look of its own; the technique table calls it "sustained", so it drew as a held note — a white head and a bar. All eleven jet whistles of the counterpoint are short (0.05 … 0.20 s; the one he names, 213.67 s, is 0.18).
**Done:** a device of its own, `container.json` devices.byTechnique.jet_whistle — the staccato unit's look (black head, stem, 16th flag clear of the staff, go line, gestural curve, dynamic) WITHOUT the staccato dot: it is a short note, not a staccato. All eleven follow. Its family in the technique table is left "sustained" (that governs how its length is read, not its look).
**Checked once (§371 · §372):** the page in the notation app on the AI's throwaway, zoom view at 204.2 · 228.6 · 211.5 s — the flute's grace note left of its two beamed 16ths; the clarinet's grace note left of its main note, no slur, one curve; the flute's jet whistle at 213.67 black with its flag and curve.
**Also said to him:** the electronics are muted by the box "electronics" in the notation app's top bar (§364) — unticked while playing, it sends the two stops.

## §373 · 2026-11-21 · the tongue ram is the flagged staccato

**His words:** "The tongue rams should be the flag staccato [too], for example, 201.56."
**Found:** like the jet whistle (§372), the tongue ram had no look of its own; the technique table calls it a one-shot, so it drew as a bare black head with its bar — no stem, flag, go line or curve.
**Done:** `container.json` devices.byTechnique.tongue_ram — the staccato unit's look WHOLE (black head, staccato dot, stem and 16th flag, go line, gestural curve, dynamic). The dot is kept here, by his word "staccato"; the jet whistle of §372 has none. All eleven tongue rams of the counterpoint follow (the flute's, 201.56 among them).
**Not checked in the running app** — the same mechanism as §372's, proven there; his reload shows it.
**The flute's three looks so far in the counterpoint:** staccato (the unit) · tongue ram (the unit, §373) · jet whistle (the unit without its dot, §372) · flutter-tongue (a white head and its bar — no rule yet).

## §374 · 2026-11-21 · the grace pickup's stem; THE BEAMED GROUP'S REGIME written down as the standard; two more beams; two notes explained

**His words:** SW-122 (the sketch pad).
**1 · THE GRACE PICKUP'S STEM (his rule; row `objects.graceHead.pickupStemToMain`):** the stem's tip stands at the height of its main note's stem tip — the far end of that note's flag, or its beam — when both stems go the same way; only ever lengthened; the flag and the stroke go with the tip. Built in `layout.js` in the pass where the beams are already levelled (the slurs' pass).
**2 · THE BEAMED GROUP'S REGIME — FIND:** it IS a standing rule, as he remembered: `docs/NOTATION_STANDARDS.md` ("left edges on go times"), the lineage's D43 (the beamed group's regime) and D49 ("THE NOTEHEAD'S LEFT EDGE IS THE MOMENT · THE GO LINE MARKS DISPLACEMENT"), first made for the tubas' clusters. It is applied by the engine to a `--cluster`. This page's groups are made with `--beam`, which keeps each note's own look — so the staccato unit's own regime stood (the head LEFT of its moment, with a go line). **APPLY:** every member of a beamed group takes `{ nhAnchor: "leftEdge", goLine: false }`; the build file writes it for every note of every group. Now in the scheme's table as the standard, with its sources.
**3 · Two more beams, his by name, both wider than the threshold:** the flute's 220.325 → 220.717 (0.39 s; a tongue ram C♯5, a staccato C♯6) and 248.951 → 249.445 (0.49 s; a tongue ram and a staccato, both A♯5). So the threshold is a first sieve, not the rule: he beams by ear and eye past it. Eight groups now.
**4 · THE NOTE "AT 205.79" THAT DOES NOT SOUND:** it is the flute's wc-2692, a STACCATO D5 at 205.998 s — in range (the flute's staccato runs C4 … C7). It does not sound on its own because the note it now leads to, wc-2691, is ALSO a staccato D5, one millisecond later (205.999): the same key struck twice within a millisecond is one note. Its history is in the save: the dealing had made it a flutter-tongue, found no room, and swapped it to a staccato ("no-room swapped(flz→staccato)"). Two notes of one harmony take (SW-ctpt-03) that landed on one pitch. As a grace pickup it is a D5 before a D5. Put to him: keep it, or leave it out.
**5 · THE THREE AT 233.85 (the flute):** a jet whistle F5 at 233.974 · a staccato F6 at 233.982 · a jet whistle F♯5 at 234.070. The first two are 8 ms apart — together; one flute cannot play both, so one of them is a question for the part.
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 204.2 and 218.6 s — the flute's grace stem down to its group's beam; the beamed groups with the first head's left edge on the curve's point and no go line; the pair at 220.33 on one beam.

## §375 · 2026-11-21 · the recipe for a part of the counterpoint, written down

**His words:** "And then please keep track of like the process and the decisions, because then we'll repeat, you know, something similar with the other parts. So hopefully I get most of the issues worked out here, and then you can just generate the other parts more or less."
**Done:** `docs/NOTATION_SCHEME.md` § 2b now opens with THE RECIPE FOR A PART OF THE COUNTERPOINT — eight steps in order (heads in time · one look per technique · beams by the 0.33 s measure, wider pairs listed · the beamed group's regime · the grace-note pickup · same-instant notes listed · the curves · then the markings), each saying where the AI stops and lists a case for him. The decisions' table follows it.
**The method, for the paper:** he works ONE part to the end by eye on the page — a threshold from a pair he points at, a rule from each case he meets — and the rules then generate the other six. The cases the rules cannot settle are what he is shown.
**His other sentence** — "I don't quite understand the first question, the flute note" — is answered in the chat in plain words: at 206.00 the flute has two notes on the same pitch one millisecond apart, so the small one is the same note twice.

## §376 · 2026-11-21 · THE RULES, MEASURED on the counterpoint's page: the flags hold, two slips found and fixed (the ottava's hook · the dot beside a line), three measured gates added; the flute's two notes changed in the save; the flute's words

**His words:** SW-123 (1) and (3).
**WHY THE RULES KEEP SLIPPING — the AI's answer, from what was found:** a rule lives in the engine for the figure it was made on. The ottava's "the hook is ink" was built for the folded sequence heads (§528) and never reached the staccato unit; the dot's "in a space, never on a line" was coded as "moves only if it TOUCHES a line". Each new kind of figure meets the rule's edge. And `check_rules.js` checked that the rules are WRITTEN and wired — not that the drawn page obeys them. THE QUICK REMEDY: gates that MEASURE the drawn page, run after every build (below). Not a revision.
**MEASURED (the counterpoint's page, the layout's own items, `tools/port/scratch/measure_flags.js`):**
- THE FLAGS — FOLLOWED. All 72 flags clear their staff's outer line: 70 by exactly 0.38 ss (`objects.flag.staff`), two by more. What he sees as "not far enough down" is the rule's own number: 0.38 ss is a third of a space. (The piano solo's figures use 2 ss — `objects.handUnit.flagClearSs`, his of §258.) Put to him: whether the score's flags take the solo's 2 ss.
- THE OTTAVA BRACKETS — A SLIP. Of ten brackets beside a go line, five ended 0.30 … 0.39 ss before it; the standard is the spacer, 0.45. FIXED: the bracket's end is the unit's ink on every unit before a go line (`layout.js`); all ten now end 0.45 or more before it.
- THE STACCATO DOTS — A SLIP, as he saw. Of 78 dots, 16 (a head in a space, the dot on the stem's far side) stood with their edge 0.09 ss over the next staff line. FIXED by a row, `objects.staccatoDot.lineClearSs` 0.15: the dot keeps from a line the gap it keeps from its head; nearer, it takes the middle of the next space. Now none is nearer than 0.30.
- THE DYNAMICS — FOLLOWED. All on their head's column. Below a unit: 0.45 ss (the house gap) under its outer ink, 45 of them; the held notes' on their row. Above a note under a flag: 0.30 (`chainAboveGapSs`, its own standing value).
**THREE GATES ADDED to `tools/check_rules.js`, part (10), measured on every page:** every flag clears its staff · every ottava bracket beside a go line ends the spacer before it · every dot keeps its clearance from a line. All green. (The check's two reds are the old two, §370.)
**THE MUSIC, changed in the save the notation reads** (`scores/piece-FirstDraft-Final-B-noFadeAt96.json`; the file as it was kept beside it as `…-B-noFadeAt96.before-376.json`; neither is committed — the saves never are): the flute's doubled D5 (wc-2692, 205.998) removed · the first jet whistle of 233.97 (wc-2715, F5) removed · the second (wc-2907, F♯5) moved from 234.070 to 234.132, 0.15 s after the staccato F6 of 233.982 — "a fast 16th". 294 notes in the counterpoint now. HIS OWN save `piece-FirstDraft-Final` was NOT touched and does not have these three changes.
**THE FLUTE'S WORDS:** by the standing change rule (`instrFirst`: at the part's first note and wherever the technique changes — Gould) — tongue ram "T. R." (the lineage's word, #5 §401g) · jet whistle "jet wh." · flutter-tongue "flz." (the technique table's `notate`; it shows on the clarinet's and the sax's flutter-tongues too, the same key). "jet wh." and "flz." are the AI's spellings. NO WORD YET for "ordinary again" on a staccato that follows one of them — put to him.
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 207.6 and 231.2 s — the words under the flute's beamed group, the pair at 233.98 a 16th apart on one beam.

## §377 · 2026-11-21 · a performance note saved: the counterpoint's dynamics are relative

**His words:** SW-123 (2): "in this section, the dynamic range is somewhat relative, that all notes are meant to be heard above the electronics, but then try to have a dynamic contrast according to the way they're marked … P should be quieter than F … But try to make P still audible above the electronics."
**Saved** as a row of `docs/PERFORMANCE_NOTES.md` (the notes are written when he sits down to them). Dynamics are the next pass on the counterpoint.

## §378 · 2026-11-21 · HIS RULE: the flags 2 staff spaces clear, in the whole score; "jet whistle" looked up and written in full; the words on every note (a try)

**His words:** "yes, 2 staff spaces for the flags. and Is a mechanism in place for per notation type scan, the thing you say, the quick remedy for flags, brackets, etc.? The jet whistle, can we, if we haven't looked it up, is that the standard way to say jet whistle? Let's look it up if you don't have a good reference for that. Let's see what it looks like to write it on every note, because the techniques are changing quite a bit."
**THE FLAGS (a row, no code):** `objects.flag.staff` 0.38 → 2. Measured after: all 70 flags of the counterpoint's page stand exactly 2.00 ss clear of their staff's outer line (one more by 2.88); none had to give way to the longest-stem limit (`clearMaxSs` 10.5), so that limit was left alone. The beams stand at the flagged stem's height and moved with them. It is the whole score's rule, not this page's.
**THE MECHANISM — his question, answered:** yes. `tools/check_rules.js` part (10), added in §376, lays out EVERY page of the score and measures three things on each — the flags, the ottava brackets beside a go line, the staccato dots beside a line — against the rows; a figure that breaks one is named with its page, part and time. The AI runs it after every notation build (the recipe's step 9). What it does NOT measure yet: the dynamics, the accents and marcatos, the technique words, the grace pickup's distances — each can be added as a gate when its rule is settled.
**"JET WHISTLE" — LOOKED UP (a web search, 2026-11-21):** no standard sign or abbreviation was found. The sources agree that composers name it in WORDS and explain it in the score's key: a score's notation guide lists "Jet whistle" among its marks; a composer's guide to the flute's extended techniques says there is no standard for these notations and that a key should explain them; the fullest catalogue of contemporary flute signs found is a 2019 thesis (Koehler and Collins, West Virginia University), which chooses its signs for clarity, not from a standard. Villa-Lobos's *Assobio a Jato* is the early example in the repertoire. So "jet wh." (the AI's, §376) is withdrawn and the word is written IN FULL; the key must say how it is made (a row of the performance notes).
**THE WORDS ON EVERY NOTE (a try, his):** the tongue ram and the jet whistle now carry their word on each note (`instrText`, centered on the head — the lineage's own way for "T. R.", #5 §401g), not only at a change. The flutter-tongue's "flz." was on every note already.
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 207.6 s — "jet whistle" and "T. R." over their notes in the flute's beamed group; the beam lower by the new 2 ss.

## §379 · 2026-11-21 · HIS RULE: a word never stands on its note's moment — built, measured; and the question of what is drawn on top, the curve or the notation (assessed, put to him)

**His words:** "The one at 199.9. The jet whistle is obscured by the GC. Let's figure out how to avoid those conflicts and then write it into the standard. I guess we can just simply push it to the left. Okay, I see the revised version just came in with the full jet whistle. Let's make sure it clears the go line in this case, then, and then have some way of um, standardizing that. Make sure that happens. And also, can you give me an evaluation of whether the notation should be written on top of the GC, or it seems as now the GC is written on top of the notation? Let's assess which way and then make sure that the decision gets standardized as well."
**FIND:** the answer was already in the lineage for one word. #5 §401b: "tongue ram right-justified (clear of the GC)" — a device's word may be right-justified on its head (`instrAlign` "end"), so that it ends at the head's right edge, before the go line. And D49: on a unit whose head's left edge is the moment (the beamed group's), a technique's word BEGINS at that edge (Gould). Neither was a general rule; each device had to ask for it, and my two new devices (§372 · §373) asked for "middle".
**THE RULE, made general** (`layout.js`; row `objects.instruction.goLineClearSs` 0.45, the house gap): (a) over a unit that stands before a go line, a centred word that would come within the gap of the line is right-justified on the head instead; (b) over a unit whose head's left edge is the moment, the word begins at that edge. No device has to ask.
**THE GATE:** `check_rules.js` (10) now also measures every technique word beside a go line: none may stand across it. 25 words on the pages; none across.
**Checked once:** the flute's first note (200.19) in the notation app on the AI's throwaway — "jet whistle" ends at the head's right edge, left of the go line.
**WHAT THE RULE DOES NOT DO — said plainly:** the gestural curve comes DOWN from the upper left into the moment, so a word standing above and left of its note still lies under the falling curve. At 200.19 the curve still crosses the left part of "jet whistle". No place above the note is clear of both the curve and the go line except far to the left (three to eight staff spaces from its note at this pace, and the distance changes with the pace). That is why the second question matters.
**WHAT IS ON TOP — the assessment he asked for:**
- TODAY: the curve is drawn OVER the notation, everywhere — his own decision in piece 6 (`render.js` LAYER: "on everywhere in the score, let's put the GCs on top", DEC-181, #6 §411), made there so that nothing hides the curve.
- For the curve on top: it is the line the player's eye rides; it is never broken; it is thin (1.5 px) and pink, so it covers little.
- For the notation on top: a word, a dynamic or a small head struck through by a pink line is harder to read than a curve that passes behind a word — the eye completes a curve easily, it does not complete a letter. Black ink over pink stays crisp; pink over black is nearly invisible anyway, so "on top" buys the curve almost nothing where it crosses ink. And the MOVING ball is a separate layer that stays on top either way — the cue that moves is never hidden.
- THE AI'S ONE RECOMMENDATION: the still curve BEHIND the notation, the moving ball in front. It reverses DEC-181 for this piece; whatever was hiding the curve in piece 6 (its white-filled boxes) is to be looked at before the switch. Not built: his decision first, then the row and the gate.

## §380 · 2026-11-21 · THE STACK ABOVE A NOTE built by its standing order; a COLLISION GATE; what was a slip, what was a rule, what was never built

**His words:** SW-124 (the sketch pad).
**THE RULE FOR THE VERTICAL STACK — it exists:** `rules.json` column.order, his of §420 · §421 (LilyPond's own order, checked on his 2.24.4): outward from the note — articulation (the dot, the accent) · DYNAMIC · OTTAVA · the instruction's WORD. So: the dynamic is nearest the note, the ottava bracket OUTSIDE it, the word outside both. The dynamic does not move to the other side.
**WHY IT WAS NOT APPLIED HERE — the honest finding:** the stack was built for the marks UNDER a note (the lineage's notes had their stems up and their marks below). ABOVE a note the engine's own comment on the ottava says "above — no above-chrome yet": each mark above was placed from the head alone. The counterpoint is the first page with beamed, stem-down notes that carry a dynamic, an ottava and a word all above. Not a slip in a rule: a part of the rule that was never built — and the AI drew it without saying so. That is the failure he names.
**BUILT (`layout.js`, "THE STACK ABOVE A NOTE"):** per moment, the marks above are read outward in the column's order, and each that stands nearer than the gap to the one inside it is moved out: the ottava's hook ends 0.45 ss above the dynamic; a word stands 0.45 ss above whatever is under it and never under 1 ss above the top staff line (`objects.instruction.aboveNoteSs · staffClearSs`, his §561). Nothing that stands clear is moved.
**THE COLLISION GATE (`check_rules.js` (10)):** at every moment of every page, a dynamic, an ottava bracket and a word may not share ink. BEFORE the pass it named NINE clashes on the counterpoint's page — the two he saw (the flute's 210.14 and 233.98, ottava × dynamic) and seven he had not yet reached (the flute's 222.27 · 225.63 · 252.09 and the clarinet's 206.41 · 212.46 · 213.99 · 226.72). AFTER: none, over 1966 moments on all pages.
**HIS POINTS, ONE BY ONE:**
- THE FLUTTER-TONGUE'S WORD TOO NEAR ITS HEAD (208.0 · 208.6): a rule was being followed, but the WRONG one. The word of a technique with no look of its own went by the tubas' rule for "cuivré" (the medium gap, 0.3 ss over the head, day 39); the later standard for a technique's word over its note is his §561 (0.45 ss over the note's top ink, at least 1 ss above the staff). §561 now governs it. He is right about the cause: flutter-tongue was a new notation and should have been put to him before it was drawn.
- THE OTTAVA IN THE DYNAMIC (210.13), THE FIGURE AT 234: the unbuilt stack, above. Fixed.
- THE BRACKET INTO THE FLUTTER-TONGUE'S SPACE (222.23): the same. The word now stands outside the bracket.
- THE BEAMED PAIR AT 220.3 · 220.7, the dynamic farther from its dot on the first note: NOT a slip. On the first note the dot is inside the staff and the dynamic may not be: it stands 0.30 ss above the top line. On the second, above the staff, it stands 0.30 ss above the dot. Both by the same number.
  — but that number, 0.30 (`column.stack.underFlag`, the gap for a mark tucked under a flag), is being used here for a mark above a BEAMED note that has no flag; the house gap is 0.45. Flagged to him, not changed.
- THE "DUPLICATES" AT 221.27: not something put back. The save has TWO flute notes at one instant: a tongue ram C♯5 (wc-2706, 221.336, 0.34 s) and a jet whistle C♯5 (wc-2705, 221.337, 0.05 s). The dealing of techniques folded one staccato C♯6 into both. One flute cannot play both; on the page they lie on top of each other with two dynamics and two words. His to say which stays (the AI would keep the tongue ram, the longer one).
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 207.6 · 219.6 · 231.6 s.

## §381 · 2026-11-21 · how the engraving is to be made trustworthy — what was said to him

**The three kinds of fault met today, and what stops each:**
1. A RULE EXISTS BUT ITS BUILD STOPS SHORT (the ottava's hook, the dot beside a line, the stack above a note). Stopped by MEASURED GATES: `check_rules.js` (10) now measures flags, hooks, dots, words against go lines, and collisions — on every page, after every build. A gate is added with every rule from now on: a rule is not "in" until a gate measures it.
2. TWO RULES COULD APPLY AND THE OLDER ONE WON (the flutter-tongue's word). Stopped by ONE findable table: `docs/NOTATION_SCHEME.md` "THE RULES A FIGURE IS BUILT FROM", which names for each thing the one rule that governs and its row.
3. NO RULE AT ALL, AND THE AI DREW ANYWAY (the flutter-tongue's look, the word's place, "jet wh."). Stopped only by the AI's own discipline, so it is made mechanical: the page builder is to LIST, before the page is shown, (a) every technique drawn by the provisional family look, (b) every mark placed by a number that is not a row — and those go to him as questions, not as pictures.
**Proposed to him as the next build (not built):** that list — "what on this page has no rule" — printed by the build itself.

## §382 · 2026-11-21 · "NO RULE YET" — the list the build prints before a page is shown; the tongue ram kept at 221.3

**His words:** "yes, build the no-rule list, and keep the tongue ram"
**THE MUSIC:** the jet whistle C♯5 of 221.337 (wc-2705) is out of the save the notation reads; the tongue ram C♯5 of 221.336 stays. 293 notes in the counterpoint.
**BUILT: `tools/no_rule_list.js <page> [--parts …]`**, run by the counterpoint's builder at the end of every build. It reads the page and the rules and lists, per part:
1. a playing technique with NO LOOK of its own (it was drawn by the provisional family look — a plain black or white head and its bar);
2. a technique with NO WORD and no sign that says it;
3. two notes of one part at ONE INSTANT (under 0.01 s);
4. a note JUST BEFORE another (to 0.06 s) that is not a grace note;
5. a pair within the beaming measure (0.33 s) that is not beamed, and a pair a little wider (to 0.5 s) that is not.
Each with the first time and the count. It changes nothing.
**ITS FIRST RUN — 46 questions on the counterpoint's page:**
- FLUTE (41 notes): ONE — the flutter-tongue has no look of its own (9 notes, first at 208.13).
- CLARINET (42): the flutter-tongue (17 notes, first at 200.68) · two notes at one instant at 251.68 · three pairs a little wider than the measure (217.70 · 243.78 · 250.29).
- ALTO SAX (54): four techniques with no look (slap exploding · slap pitched · flutter-tongue · double tonguing), three of them with no word · four same-instant pairs · eight unbeamed pairs.
- PERCUSSION (54 + the glockenspiel's 8): seven instruments' strokes with no look and no word · one same-instant pair · eleven unbeamed pairs.
- PIANO (47): three ways of playing with no word (the keys · plucked · muted), one with no look · seven unbeamed pairs.
- VIOLIN (47): three techniques with no look and no word (pizzicato behind the bridge · overpressure · col legno gettato) · one same-instant pair · three unbeamed pairs.
**What this is, for the paper:** the list turns "the AI should have asked" into a thing the build does. On the flute, after a day of his proofreading, one question is left; on the parts not yet taken, the list is the agenda.
**Written where a future AI finds it:** `CLAUDE.md` § THE ENGRAVING RULES (the two machines) · `docs/NOTATION_SCHEME.md` § 2b, the recipe's step 0.

## §383 · 2026-11-21 · HIS RULE: the gestural curve behind the notation, the ball on top

**His words:** "Okay, and then the GC, let's go with the recommendation. Curve behind notation, ball stays on top. That's fine."
**The row:** `rules.json` objects.gc.layer "behind" → `engraving.render.gcLayer`. `render.js` draws the still curve after the electronics' layer and before every mark and the staff; "top" restores piece 6's DEC-181. The moving ball is the animation's own layer (`animobj.js` draws only balls) and is over the page either way.
**Why it was safe to reverse DEC-181 here:** what that decision guarded against in *Approaching* were its filled boxes (the sine boxes, the mic openings) hiding the curve; the counterpoint has none, and the electronics' own layer is still drawn under the curve.
**Checked once:** on the AI's throwaway, the counterpoint's page — in the page's drawing order the first curve is the 7th of 319 elements (it was among the last), and the flute's "jet whistle" at 200.19 reads over the curve.

## §384 · 2026-11-21 · the counterpoint's dynamics dealt on the flute (p · f · fff, seeded; close partials share one) — and A FAULT FOUND: the notation was naming this piece's dynamics by another piece's scale

**His words:** SW-125 (the sketch pad).
**A FAULT FOUND FIRST (measured, not seen by him yet):** every dynamic on the counterpoint's page was NAMED WRONG. The save's notes carry the dynamics dealt on 2026-11-10 (p · mf · fff) as written velocities on the composer score's scale (ppp 65 · pp 74 · p 83 · mp 92 · mf 100 · f 109 · ff 118 · fff 127). The notation reads a note's name from its velocity by `engraving.layout.dynamicBands` — and that table was still piece 5's scale (ppp 0 … fff 127 in steps of 18). On the flute: 13 notes dealt p were drawn "f", 10 dealt mf were drawn "ff", 9 dealt fff were right. FIXED: the bands are this piece's scale, each band's max the midpoint to the next step. It holds for every page of the piece.
**THE DRAW (the flute; the other parts by the same line):** `tools/dyn_deal.js --levels p,f,fff --seed 1121 --lanes flute --tie 0.2` on the save the notation reads (a copy kept, `…before-384.json`). The tool's own way: per part a shuffled deck of the three, used up before it is shuffled again, never the same level twice running. Result on the flute's 41 notes: f 14 · fff 14 · p 13.
**CLOSE PARTIALS SHARE ONE (`--tie`, new):** a note that begins within 0.2 s of the one before it in its part takes that note's dynamic and writes no mark. The number comes from his example, the pair at 233.98 → 234.13 (0.15 s); the other beamed pairs are 0.28 s apart or more and keep a mark each. On the flute ONE note is tied (234.13). The save records it (`properties.dyn.tied`), the builder reads it.
**THE SOUND, re-leveled without touching the rack:** `section_parity.js` (the loudness parity of 2026-11-10) was NOT run — its run adds to the rack's gains, and they are set. Each flute note's sent velocity was moved along the parity its own voice already has (its three measured points: 83 · 100 · 127): an f (109) is sent between the mf and the fff points — flutter-tongue 105 · jet whistle 106 · staccato 108 · tongue ram 105. Not heard by the AI.
**MEASURED AFTER:** on the flute every drawn name is the dealt name (p 11 · f 10 · fff 10 marks drawn). The rules check: the collision gate green; the old two reds.
**THE FLUTTER-TONGUE QUESTION, explained to him:** "look" = the picture of the note, not its word. A flutter-tongue is drawn today as a white head, a gray bar for its length and "flz." — a stand-in the engine gives a technique nobody has designed. The common engraving is a note with a stem and three slashes through it (the tremolo sign) and "flz.". His to choose.

## §385 · 2026-11-21 · HIS RULE: the flutter-tongue — three slashes on the stem, with flz.

**His words:** "yes, three slashes on the stem with flz." (to the build's own question, the flute's one line on the "no rule yet" list)
**FIND (before drawing):** this engine had no tremolo slash. Piece 2 has one, measured from LilyPond and agreed there (its `dimensions_table.json` slash, probe `slash_basic.js` on b'4:32, 2026-05-04): thickness 0.4 ss and stack step 0.81 (the beam's own), the slash 1.42 ss long, rising 14.8° to the right; and its rule for the stem that carries a slash stack (session 65): 1.5 × the default length, so the slashes crowd neither the head nor the tip.
**APPLY:** a row `objects.tremoloSlash` with those numbers and their source; a device `byTechnique.flz` — a white head (it is a held note), a plain stem of 5.25 ss (1.5 × 3.5), three slashes, "flz." as its word, its dynamic; the bar for its length stays; no go line and no gestural curve (a held note's regime: the head's left edge is its moment). `layout.js` draws the slashes as the engine's own slash item.
**THE ONE THING WITH NO RULE, said:** where the stack stands along the stem. No measured rule was found; it is centred between the head's far edge and the stem's tip. In the row's own note; his to change.
**What it changed beyond the look:** the flutter-tongues had NO dynamic at all (the provisional look draws none); they have their dealt one now. It holds for the clarinet's and the alto sax's flutter-tongues too — the same technique.
**MEASURED:** `check_rules.js` — every gate of part (10) green (the old two reds elsewhere); the row passes the tables' own gates (a drawn kind with a row, an anchor, a sheet). **"NO RULE YET" after it: 43 questions (it was 46); the FLUTE HAS NONE.**
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 206.9 s — the flute's flutter-tongue at 208.1 and the clarinet's.
**Seen, for his eye:** the clarinet's beamed pair at 206.4 joins a staccato to a flutter-tongue, and that beam looks wrong (the clarinet is not taken yet).

## §386 · 2026-11-21 · the ESTABLISHED slash found and built — §385's drawing was wrong; where piece 2's signs live, written down

**His words:** SW-126 (the sketch pad): "those aren't the right slashes … these were worked on for quite a while … definitely not the round corners. Please find the established slashes … get it into the standards so that these types of mistakes don't continue to happen."
**WHAT §385 DID WRONG:** it took piece 2's NUMBERS for a slash (thickness, step, length, slant) from the dimensions table and drew them with this engine's nearest thing — the grace note's stroke, a line with ROUND ends — and it said the stack's place on the stem had "no rule". It never opened the file that draws piece 2's slash.
**FOUND (piece 2, `tools/notation_studio/engine/slash.js`; its `docs/GLYPH_REGISTRY.md` lists it as `proc/slash`; its ND-10, 2026-05-04):** a slash is NOT a shape of its own — it is a BEAM-SHAPE PARALLELOGRAM (LilyPond draws StemTremolo as the same four-point polygon as a Beam), in THREE placements: `slashOnStem` (N slashes riding the stem, centred on the stem's MIDPOINT, fixed length and slant) · `slashAboveNotehead` (over or under a stemless head, its own numbers) · `slashBetweenStems` (a tremolo between two chords — a beam stack). And `idioms/percussionCellMotive.js` (the composer's session-65 rule): the stem that carries slashes is 1.5 × the default, the stack is centred on that full stem's midpoint, and the VISIBLE stem is drawn 1 ss shorter at its free end, so the slashes ride midway between the head and the visible tip.
**BUILT:** `render.js` draws a tremolo slash as a parallelogram with vertical ends, its thickness the height of each end; `layout.js` centres the stack on the stem's midpoint and shortens the visible stem by `objects.tremoloSlash.stemShortenSs` (1). The row's note is rewritten with the source of each number and of the shape; its false "the AI's" is gone.
**SO THAT IT IS NOT MISSED AGAIN:** `docs/NOTATION_SCHEME.md` has a section "WHAT IS ALREADY ESTABLISHED — look here before drawing any sign": piece 2's `GLYPH_REGISTRY.md` is the index; take the PRIMITIVE (the file that draws), not only the numbers; the list of what is there. `CLAUDE.md` § THE ENGRAVING RULES, step 1, carries the same pointer.
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 206.9 s — the flute's and the clarinet's flutter-tongue with three square-ended slanted slashes at the stem's middle. `check_rules.js`: every measured gate green (the old two reds elsewhere).
**For the paper:** the same fault three times in one day (the ottava's hook, the word of the flutter-tongue, the slash): a standard taken HALF — its number without its shape, or its rule without its scope. The remedy each time was to read the thing that draws, not the table beside it.

## §387 · 2026-11-22 · the flute's principles gathered as FOUR LAYERS; the clarinet, the alto sax and the violin built from them by rule; the duplicates listed

**His words:** SW-127 (the sketch pad).
**THE PRINCIPLES, GATHERED (`docs/NOTATION_SCHEME.md` § 2b, now opening with "THE FOUR LAYERS"):** 1 the spacing — the rhythm (heads in time; the beaming measure; the grace pickup; the beamed group's regime) · 2 the articulations (one look and one word per technique; none drawn by guess) · 3 the dynamics (p · f · fff, seeded; close notes share one) · 4 the duplicates (his to decide). Each layer names its rule and the place it is done. Checked against the day's entries (§369 … §386): every decision of his on the flute is a row of the rules, a line of the recipe, or a group in the builder.
**ONE RULE MADE EXPLICIT BY THE GATHERING:** the beaming measure joins SHORT notes only. The flute's groups were all short notes; the clarinet's first automatic beam (§369) had joined a staccato to a held flutter-tongue and looked wrong (§385). A short note is one whose look takes a flag, or — with no look yet — a one-shot. A short note running into a held one within the measure is LISTED, not beamed.
**THE THREE PARTS, BY RULE (`tools/build_ctpt_page.js`: AUTO_PARTS 1 · 2 · 6):** nothing of theirs is written out by hand — the builder reads the save and applies the measure, the grace rule and the group's regime. Beamed groups: clarinet 3 · alto sax 5 · violin 2 (the flute's 5 are his own). Grace pickups: 1 (the clarinet's, 230.37). The clarinet's old hand-written groups are gone; its 206.41 → 206.70 is no longer beamed.
**THE DYNAMICS:** `dyn_deal.js --levels p,f,fff --seed 1121 --lanes clarinet,alto_sax,violin --tie 0.2` — clarinet f 15 · fff 13 · p 14; alto sax fff 17 · p 19 · f 18; violin fff 15 · p 16 · f 16 (143 notes). The sound re-leveled per voice along its own parity (`tools/port/scratch/relevel.js`: velocity for the winds and two of the violin's voices, CC7 for the violin's Kontakt voices), the rack untouched. The save as it was: `…before-387.json`.
**THE DUPLICATES, LISTED FOR HIM (two notes of one part at one instant — "no rule yet", line 3):**
- clarinet 251.68: staccato E3 twice (the same note; one is heard)
- alto sax 211.81: slap exploding D♯5 | staccato D♯5
- alto sax 213.96: double tonguing C♯4 | slap pitched C♯4
- alto sax 232.35: double tonguing D4 | slap pitched D4
- alto sax 248.67: double tonguing E5 | slap pitched E5
- violin 239.76: col legno gettato A4 | Bartók pizzicato A4
Each pair is the same pitch in two ways of playing: one player cannot do both.
**THE REST OF THE LIST for the three parts (23 questions):** the alto sax's slap exploding · slap pitched · double tonguing and the violin's pizzicato behind the bridge · overpressure · col legno gettato have NO LOOK AND NO WORD yet (drawn as plain heads with their bars — placeholders, said as such) · short notes into held ones within the measure: clarinet 206.41, alto sax 206.48 · 208.68 · 215.00 · pairs a little wider than the measure: clarinet 217.70 · 243.78 · 250.29, alto sax 234.44, violin 223.35 · 246.21.
**MEASURED:** `check_rules.js` — every gate of part (10) green on the rebuilt page; the old two reds.
**Checked once:** the page in the notation app on the AI's throwaway, zoom view at 215.6 s.

## §388 · 2026-11-22 · the clarinet's techniques re-rolled WITH THE SLAP — written as a slap, sounding as the staccato until the new library is in

**His words:** SW-128 (the sketch pad).
**WHAT WAS FOUND FIRST:** the clarinet's deck for the counterpoint held two techniques, flutter-tongue and staccato (`bank/artic_deal.json`, §145), because the IRCAM clarinet has no slap. Its other voices are key clicks, multiphonics, fortepiano, sforzando, aeolian, glissando, trills and swells — nothing percussive that sounds like a slap. He has bought a clarinet library that has one; it is not installed.
**DECIDED BY THE AI (his "whatever's most expedient"): DO IT NOW, AS A STAND-IN.** Why now and not when the library arrives: the technique is the FIRST thing a note is given — whether it is short or held decides its length, its beams and its look — so a roll made later would undo the notation built on top. The clarinet is built by rule (§387), so a new roll costs the notation nothing today. Rejected: waiting (the clarinet's page would be made twice) · moving the clarinet's slaps onto another instrument's sample (a wrong timbre he would then have to un-hear).
**HOW:** a technique `slap` added to the clarinet in `sandbox/instruments.js`, marked STAND-IN: the staccato's preset and part (channel 12), so a slap SOUNDS as a staccato for now. The deck is now flz · staccato · slap. The clarinet's 42 notes (199 … 254 s) put back as before the first deal and dealt again, scattered, seed 1122: **flz 12 · slap 14 · staccato 16** (it was flz 17 · staccato 25); 12 short notes grown for the flutter-tongue, 2 swapped. Only the clarinet's lane was touched. ONE TRAP MET: `artic_deal.js --undo` ignores `--lanes` and restores EVERY lane (its dry run said 293 notes) — it was not run; the one lane was restored by a scratch script.
**THE DYNAMICS** are the same notes' own (the draw of §387 stands: p · f · fff); each note's sent velocity now comes from its new technique's level map, the slap's being the staccato's.
**THE NOTATION:** the slap needed no decision — its look is established (*Recombination* §400 · §401b, `devices.byTechnique.slap`): a black head with a flag, a staccato dot and an accent, the "+" sign, the word "(slap)". The technique table's `slap` now names the clarinet among its players. The page rebuilt (`build_ctpt_page.js`): the clarinet has 3 beamed groups and 1 grace pickup. "No rule yet" for the clarinet: the duplicate at 251.68 is now a slap E3 and a staccato E3 at one instant (his to say which stays) · 206.41 a slap into a held flutter-tongue · three pairs a little wider than the measure. `check_rules.js`: every measured gate of part (10) green; the old two reds. Palette green 210; roster green, 342 voices.
**The save as it was:** `…before-388.json`.
**WHEN THE NEW LIBRARY IS IN (the conversion, all the AI's):** 1 the clarinet's entries in `sandbox/instruments.js` take the new library's presets and parts, the slap its own · 2 the rack's clarinet tracks rebuilt · 3 the slap's RANGE read from the library — a slap dealt outside it is folded by octaves or swapped, and those notes are told to him · 4 the levels measured again for every clarinet voice (`section_card.js`) · 5 the notation does not change unless step 3 swaps a note.
**NOT HEARD:** nothing was played.

**ADDED THE SAME HOUR — the double at 251.68, his words:** "And then there seems to be like a double at 251.7. It's like it's been engraved twice. for the clarinet." It was the same E3 entered twice in the save (wc-2757 at 251.676, wc-2756 at 251.680; listed at §387). The second, wc-2756 (dealt the staccato), is out of the notation's copy of the save; the one that stays was dealt the slap. The clarinet has 41 notes; its duplicates line is empty. `docs/ENGRAVING_RULES.md` generated again (the technique table changed); `check_rules.js` back to the old two reds.

## §389 · 2026-11-22 · his rule — the alto sax's pitched slap and exploding slap take THE slap's look; double tonguing put to him

**His words:** SW-129 (the sketch pad). He had seen bare black heads in the alto sax: the placeholders of §387 for techniques with no look.
**CHECKED, as he asked ("make sure that that's the right tongue slap notation"):** the slap's look is one row, `devices.byTechnique.slap`, settled in *Recombination* (#5 §400 · §401b) for the bass clarinet: the staccato unit (a filled head, a 16th flag on a flag-clear stem, a staccato dot) with an accent, the "+" sign and the word "(slap)" centred on the head. The clarinet's slap of §388 uses that row. No other slap notation exists in the rules.
**BUILT:** two rows, `slap_pitched` and `slap_exploding`, each the slap's row whole, their `sheet` his words. The player reads one technique; which sample sounds is the save's. The alto sax's 21 slaps are drawn so; "no rule yet" for the alto sax drops from six technique lines to two (double tonguing). `check_rules.js`: part (10) green on the rebuilt page (83 flags · 102 dots · 50 words); the old two reds.
**DOUBLE TONGUING — what the convention is (the AI's knowledge, not looked up in a source this turn):** it is a way of ARTICULATING fast repeated notes (t-k-t-k), not a sign. Conventionally the fast rhythm itself is written — the repeated notes written out, or abbreviated as one note with tremolo slashes that count the subdivision (one slash eighths, two sixteenths, three thirty-seconds or unmeasured) — and the player chooses double tonguing when the speed asks; a composer who wants it for certain adds the words "double tongue" (d.t.) or the syllables. Three slashes with "flz." is already this score's flutter-tongue, so three slashes cannot also mean this. PUT TO HIM, not built: the 13 notes stay placeholders (a plain white head).

## §390 · 2026-11-22 · his rule — double tonguing: a white head, two slashes, "d.t."; the slap and the double tongue checked against convention (a web lookup); the cello on the counterpoint's page

**His words:** SW-130 (the sketch pad).
**BUILT (his "use your recommendations"):** `devices.byTechnique.double_tonguing` — the flutter-tongue's figure with TWO slashes (a new row, `objects.tremoloSlash.countDouble` 2) and the word "d.t."; the slashes are the established ones (§386). The alto sax's 13 double-tongued notes are drawn so. The alto sax now has no technique without a look.
**THE LOOKUP (three web searches; the sources are teaching hand-outs, a font standard and a file-format standard — no engraving manual was reached, Gould's *Behind Bars* was NOT consulted):**
- THE SLAP: a small "+" above the note, or an x-shaped head, with the word "slap" written at least at its first use, are the two common ways; sources call it "fairly standardized" (a players' guide) and "There is no standardization!" (the clarinet association's hand-out *Slap Tongue 101*) — both advise the word beside the sign. This score's slap (a "+", the word "(slap)" on every note, an accent, a staccato dot) is INSIDE that practice, and safer than most since the word never leaves. Not anomalous.
- DOUBLE TONGUING: no source gave a rule for scores. What IS standardized is a SIGN: two dots side by side over the note (SMuFL `doubleTongueAbove` U+E5F0; MusicXML `<double-tongue>`; Unicode U+1D18A since 2001) — it lives mostly in brass method books. Slashes on a stem for a repeated note are the general convention, and "d.t." / "double tongue" as words is common. So two slashes with "d.t." does not go AGAINST anything; it is not THE standardized sign either. NOT ADOPTED BY THE AI, put to him: on this page two dots over a note would read as staccato dots, of which the section is full.
**ONE MEASURED GATE NOW RED, and why:** "no technique word across its own go line" — "d.t." at 232.35 and 248.67. Both are the DUPLICATES of §387 (a double-tongued note and a slap at one instant on one pitch): the word of one lies on the go line of the other. It clears when he says which note stays; nothing was moved to hide it.
**THE CELLO'S SOLO BUTTON:** the page was built from parts 0 … 6, and the app makes a solo button per part of the page, so the cello had none (it has no notes in 200 … 253 s). The builder now takes parts 0 … 7: the cello's staff and its button are on the page, empty.
**Also seen:** the clarinet's beamed groups are 2, not 3 — the third was the double at 251.68 (two entries 4 ms apart read as a group), gone with §388's removal.

## §391 · 2026-11-22 · the string quartet's own figures for overpressure, col legno and behind-the-bridge pizzicato, gathered on one sheet for him to look at

**His words:** SW-131 (the sketch pad). Nothing built into the score; nothing researched — his order: "Let me see what I have first."
**WHAT PIECE 1 HAS (`string_quartet_no1-composer/lilypond_code/`, its LilyPond sources and their SVGs; `docs/Notation_Research.md` for the reasoning):**
- BOW OVERPRESSURE — one figure in four states (`BowOverpressureAccent_*`, `m4_ / m6_…bowOverpressureAccent…_final`, `short_accented_overpressure`): a BLACK SQUARE head, a flagged stem (a 16th), THREE DOWN-BOW signs stacked above, a marcato under the head, and sfz (one state: pp (sfz); one: p). His memory "several down bow symbols" is this.
- COL LEGNO — `clb_template_*`: an X head, a plain stem, the word "c.l.b. jeté", a dynamic · `col legno battuto ricochet`: the words "col Legno battuto ricochet" over an X with a marcato · `M2a_ricochet_inkscape`: the word "ricochet", a round head, a marcato, sfz. There is no figure named "gettato": the quartet's word for the thrown bow is jeté / ricochet (its research file lists c.l.g. as the same family: "Text + staccato dots or z-stroke").
- PIZZICATO BEHIND THE BRIDGE — only inside the two-handed pizzicato clusters (`Two-Handed Pizzicato Clusters_render`): the right hand's line is split in two rows labelled "f.b." and "b.b." (in front of / behind the bridge), X heads beamed. His memory "pizz and BB" is this; there is no stand-alone single-note figure. The research file's § "Playing Behind the Bridge" lists the options he read then (the text "b.b.", x heads, Lachenmann's bridge clef).
**SHOWN:** `probes/quartet_signs/sheet.png` — the eight figures cut to their ink, side by side (`tools/port/scratch/quartet_signs.js`; it reads piece 1 and writes only here). Not placed in the score: these are whole LilyPond figures, and putting them on this piece's staves means building them as rows — after his choice.

## §392 · 2026-11-22 · the alto sax's 206.48 a grace note that keeps its slashes; the word centred on a held note; THE SIDEWAYS AUDIT; the slashes against the ledger lines measured

**His words:** SW-132 (the sketch pad).
**1 · THE GRACE AT 206.48 (built, his word):** the double-tongued F5 there is 0.07 s long. A hand in the builder (`build_ctpt_page.js` HANDS, `wc-2762`): the grace figure in use (a small black head, a 16th flag, the stroke) at its own time, with its two slashes kept (a new hand key `graceTremolo`; the slashes drawn at the grace's scale) and its "d.t." and its p. The next note is 0.26 s later, so it is not stood off as a pickup.
**2 · THE AUDIT (`tools/port/scratch/audit_horizontal.js s2-ctpt-heads` — it reads the drawn page and gives, per technique, each mark's centre against its head's centre):**
- every DYNAMIC, every staccato DOT, every ACCENT and every SIGN ("+", the Bartók sign) is centred on its head — offset 0.00 on all 250-odd of them, in every technique.
- THE WORDS stand in THREE ways, by two standing rules: (a) centred on the head — the row's own alignment (§401h); (b) RIGHT-JUSTIFIED, ending at the head's right edge, when the note stands just before its go line and a centred word would come within 0.45 ss of the line (§379, his rule after "The jet whistle is obscured by the GC"): "(slap)" 24 of 31, "jeté" 7, "jet whistle" 7, "T. R." 7; (c) BEGINNING at the head's left edge on a beamed note whose left edge is the moment (§379 b): 6 words. So one word, "(slap)", is seen three ways on one page. That is what his eye caught; it is the rules working, not a slip — and it is put to him.
- ONE CHANGE MADE: on a HELD note (the flutter-tongue, double tonguing: no go line, no gestural curve) the word began at the head's left edge by rule (c), which was written for beamed notes the curve lands on. A held note has nothing at its moment to keep clear of: its word is now CENTRED on the head (rows `flz` and `double_tonguing` take `instrAlign: middle`; layout.js § "THE HAND UNIT"'s word placement). Measured after: "flz." 30 of 30 and "d.t." 11 of 11 at 0.00.
**3 · THE SLASHES AND THE LEDGER LINES (measured, NOT changed — no rule exists):** a tremolo stack is centred on its stem's midpoint (piece 2's rule, §386), whatever is behind it. On the 15 slashed notes that carry ledger lines the nearest slash edge is 0.00 ss from a ledger line twice (clarinet 210.53 · 228.55, three ledger lines), 0.13 ss four times (clarinet 204.01 · 239.35, alto sax 216.80 · 241.48), 0.53 … 0.63 five times, more than 1.6 four times. Piece 2's slash rules say nothing of ledger lines (its slashes were on percussion and piano cells). What the AI believes the convention to be (Gould, from memory, NOT looked up): tremolo strokes stay clear of ledger lines — the stem is lengthened so the strokes sit beyond them. Put to him as one recommendation.
**MEASURED:** `check_rules.js` — part (10) as before: the one red is the two "d.t." words at the duplicates (§390); the old two reds. **NOT LOOKED AT:** the grace note was read from the drawn items, not seen as a picture.

## §393 · 2026-11-22 · bow overpressure and c.l.b. jeté built from the quartet's figures; the slashes past the ledger lines (his rule); the words' TRUE widths; the single grace note's stroke is LilyPond's glyph; a lookup of the three string techniques

**His words:** SW-133 (the sketch pad).
**1 · BOW OVERPRESSURE (`devices.byTechnique.bow_op_vel`, to be re-evaluated by him on the page):** the quartet's figure — a black SQUARE head (a new head, `glyphs.json notehead.square`, 0.8 × 0.8 ss, measured in the quartet's own drawing), a flagged stem, THREE DOWN-BOW signs past the stem's tip (LilyPond `scripts.downbow`, baked by `tools/glyph_scripts.py`; a new row `objects.bowStack`: 3 signs, scale 0.63, one staff space apart, the house 0.45 past the tip — the quartet's own numbers), a marcato at the head, the dynamic. A held note here, so its bar for its length stays. SEEN ON THE PAGE (the throwaway, zoom view, 205 … 210.5 s): the violin's stems go DOWN on its high notes, so the three down-bows stand BELOW the staff at the stem's tip, not above the note as in the quartet — said to him.
**2 · COL LEGNO GETTATO (`devices.byTechnique.col_legno_gett_vel`):** the quartet's CROSS head (LilyPond `noteheads.s2cross` at the house heads' size, baked) and its words "c.l.b. jeté", on this score's short-note unit (flag, go line, curve); no dot, no accent, as in the quartet. Two new head rows: `objects.crossHead` · `objects.squareHead`; the engine draws any head the glyph table holds (`stamps.noteheadKind`).
**3 · THE SLASHES PAST THE LEDGER LINES (his "that's fine. Let's go with that"):** `objects.tremoloSlash.pastLedgers` — on a note outside the staff the whole stack stands inside the staff's outer line and the stem grows by as much as the stack moved. A NEW MEASURED GATE in `check_rules.js` part (10): 42 slashes on notes outside the staff, none among ledger lines (it was red on 15 notes before the rule ran).
**4 · "(slap)" CENTRED — HIS EYE WAS RIGHT:** the rule that right-justifies a word near its go line (§379) took a word's width as half an em per character. Measured in the score's italic face (`tools/word_widths.py`, new): "(slap)" is 2.14 em, not 3.0; "jeté" 1.27, not 2.0; "T. R." 1.68, not 2.5; "jet whistle" 3.61, not 5.5 — the guess was about 40 % wide. The true widths are a row (`objects.instruction.widthEm`), read by the layout and by the gate. After: "(slap)" is centred on all 20 of the alto sax's unbeamed slaps and on "jeté" 8 of 8; it stays right-justified where a centred word really would come within 0.45 ss of the line — the clarinet's 9 stem-down slaps, whose head stands nearer the line (1.2 ss), "jet whistle" (7), "c.l.b. jeté" (9), "T. R." (5). His 206.7 is centred now; his 211.84 is one of the DUPLICATES (a slap and a staccato on one pitch at one instant), still his to decide.
**5 · THE SINGLE GRACE NOTE (his "get a standard … for the single Grace note slash"):** measured first — LilyPond's own stroke (`flags.ugrace`) is 1.62 × 1.36 ss, rising about 40°, its centre 1.58 ss below the tip; the house stroke was a drawn line at 45°, 1.2 × 1.2, placed by a fraction of the stem. Close, but a stand-in. NOW the stroke of a single flagged grace IS LilyPond's glyph (`glyphs.json flag.graceUp · graceDown`), at the stem's tip like the flag, at the grace's scale. (A beamed grace group keeps its corner rule, §262.) AND, for a grace that keeps tremolo slashes: the order along the stem is head · slashes · flag, each the house gap at the grace's scale from the next (`objects.graceHead.slashGapSs` 0.45), the stem as long as that needs. The alto sax's 206.48, read from the drawn items: the stem 4.19 ss, the slashes 0.32 from the head, the flag's inner end 0.32 from the slashes. This changes every single grace on every page (the flute's two and the clarinet's pickup here).
**6 · THE DUPLICATE AT 213.96 (his word):** the double-tongued C♯4 (`wc-2772`) is out of the notation's copy of the save; the pitched slap stays. The save as it was: `…before-393.json`.
**7 · THE LOOKUP (three web searches; forum answers, players' guides, theses' titles, the SMuFL font standard — no engraving manual reached):**
- BOW OVERPRESSURE: not standardized ("the notation for Crunch Tone is not standardized"); composers use words (overpressure · hard pressure · scratch tone), a thick black line for pressure, or their own sign. SMuFL does hold standard signs, "stringsOverpressureDownBow / UpBow / NoDirection" — a DOWN-BOW SIGN MADE HEAVY. His three stacked down-bows are of that family (down-bow = pressure); a square head is his own. Not against any convention; a word in the performance notes is what the sources advise.
- COL LEGNO: "c.l.b." is the common abbreviation (battuto; "c.l.t." tratto); written above the staff where it starts; "col legno gettato" is described as ricochet/jeté with col legno battuto. A cross head for it was NOT confirmed by any source reached (it is widespread in my own knowledge; unverified). His "c.l.b. jeté" is within practice.
- PIZZICATO BEHIND THE BRIDGE: no standard sign or abbreviation; the advice found is to WRITE IT OUT ("pizz. behind bridge") WITH THE OPEN STRING SHOWN IN THE MUSIC — his own idea. Which string: Roman numerals I … IV are the general convention for naming a string (my knowledge; not confirmed by these results). NOT BUILT — one point is his: see the chat.
**MEASURED:** `check_rules.js` — every gate of part (10) green but the one "d.t." word at the duplicate 232.35 · 248.67; the old two reds. **LOOKED AT ONCE:** the page on the throwaway at 205 … 212.5 s — the new heads, stacks and moved slashes are drawn; the picture was too small to judge fine spacing, so the gaps above are from the drawn numbers.

**ADDED THE SAME HOUR — the double-tongued notes longer, his words:** "Can we increase the length of the double tongue notes in the composer score or the IR just for the playback, for the demo? So the one at 212.88, that's pretty good length, I'd say. If there are ones longer than that, just leave them. But for example, the one at 215.18 should be longer if possible." The note at 212.88 is 0.33 s long. In the notation's copy of the save, the alto sax's 9 double-tongued notes shorter than that are now 0.33 s (209.88 · 215.19 · 222.21 · 226.01 · 232.35 · 235.69 · 244.07 · 247.56 · 248.67 · 250.19 were 0.11 … 0.31 s; each has at least 0.7 s of room before the next note); each keeps its old end under properties.lengthened. Left alone: the grace at 206.48 (his word, a grace) and 212.89. Their bars on the page are as long as the notes. Not heard.

**A correction to the line above:** the script lengthened 11 notes, not 9 (the line lists ten times; the count there was wrong).

## §394 · 2026-11-22 · his word — the alto sax's 224.99 a grace note into the slap at 225.27

**His words:** SW-134 (the sketch pad).
**BUILT (`build_ctpt_page.js` HANDS — now read BEFORE the rule's beaming, so a note made a grace by his word is out of it):** the staccato G4 at 224.993 (`wc-2782`) is a grace note — the small head, the flag, LilyPond's stroke (§393), no go line, no dynamic, no gestural curve of its own — at its own time, 0.275 s before the slap. The slap at 225.268 (`wc-2783`) carries the one gestural curve, its head's LEFT EDGE on the moment, no go line (the beamed group's regime, §374). The rule's beam over the two is gone: the alto sax has 4 beamed groups. Read from the drawn items: the slap's head centre 0.52 ss right of its moment (its left edge on it), a curve, no go line; the grace with no curve and no go line. "(slap)" there begins at the head's left edge (the rule for a head on its moment). `check_rules.js`: as before (the one "d.t." at the duplicates; the old two).
**NOT LOOKED AT as a picture.**

## §395 · 2026-11-22 · his figure at 232.35 — a slap tied into a double-tongued note; his rule — a word with no go line is centred on its head

**His words:** SW-135 (the sketch pad).
**1 · THE FIGURE (the alto sax, 232.348: a pitched slap D4 and a double-tongued D4 at one instant — one of §387's duplicates, now DECIDED by him: both stay):** hands in `build_ctpt_page.js` — the slap's head on the moment (its left edge; no go line; the curve where it was), the double-tongued note's whole column 2.4 ss to the right (a new hand key `nhShiftSs`: a note's column moved sideways), so the two heads stand 2.43 ss apart as before; a curve from the slap's head to the other; the f under the slap, none under the double-tongued note.
**THE "TIE" IS THE ENGINE'S SLUR (said to him):** this engine has no tie of its own; the curve drawn is the slur between two heads (`slurTo`, *Recombination* §550). On one pitch it reads as a tie. A tie's own shape and ends are a rule not yet made.
**A FAULT MET AND MENDED (`notation/lib/fit.js`):** the fit took every mark at one instant as ONE stack, so the two columns' marks were squeezed together and the f lay on "(slap)". Now two heads standing more than 1.5 ss apart at one moment are two columns, each fitted alone.
**STILL RED, AND WHY:** the check "no dynamic and word share ink" at 232.35 — under the low D4 the slap's column is five marks deep (dot · accent · + · f · "(slap)") and would run into the staff below, so the fit closes its gaps to 0.2 ss; by the checker's own (rougher) boxes the f and the word touch. Not hidden; put to him.
**2 · HIS RULE — A WORD WITH NO GO LINE IS CENTRED (242.72, "that one doesn't actually have a … Go line"):** the rule of §379 had a second half — on a note whose head's left edge is the moment, the word BEGAN at that edge. It is withdrawn. THE RULE IS NOW ONE LINE: a word is right-justified only beside a DRAWN go line it would come within 0.45 ss of (by its measured width, §393); everywhere else it is centred on its head. Measured after (`audit_horizontal.js`): no word begins at a head's edge any more; right-justified only "(slap)" 9 (the clarinet's stem-down slaps) · "jet whistle" 7 · "c.l.b. jeté" 9 · "T. R." 5 — every one beside a go line.
**MEASURED:** `check_rules.js` — the two old reds, "d.t." at the last duplicate (248.67), and the clash above. **NOT LOOKED AT as a picture.**

## §396 · 2026-11-22 · THE TIED ATTACK is a rule (his "extrapolate that figure into the standard"); 248.67 built by it; the squeezed stack mended

**His words:** SW-136 (the sketch pad).
**THE RULE (`rules.json objects.tiedAttack`; applied by `tools/build_ctpt_page.js`, no note written out by hand):** a SHORT note and a HELD note of one part, on one pitch, at one instant are ONE figure — an attack that rings on. The short note: its head's left edge on the moment, no go line, the gestural curve on it, the figure's one dynamic. The held note: its whole column 2.4 ss to the right (the heads 2.43 ss apart, centre to centre), no dynamic. A curve joins the heads (the engine's slur, until a tie has its own rule). The builder finds such pairs itself: 2 on the page — the alto sax's 232.35 (its two hand lines are gone, the rule makes them) and 248.67 (his word today). `no_rule_list.js` no longer lists such a pair as a duplicate.
**WHAT IS LEFT OF THE DUPLICATES:** two, both a pair of SHORT notes, where the rule does not reach and the choice is his — alto sax 211.81 (exploding slap | staccato, D♯5) · violin 239.76 (col legno gettato | Bartók pizzicato, A4).
**245.04:** "(slap)" there is centred since §395's rule (a beamed note, no go line) — read from the drawn items: anchor middle, on the head's centre.
**THE SQUEEZED STACK OF §395, FOUND AND MENDED:** it was not the lane. The slur's pass lifts a note's marks clear of the curve and lets what stacks beyond them ride along — the ottava and the section's word — but not a technique's own word, so the dynamic was lifted INTO "(slap)". The word rides too now (`layout.js`, the slur's pass). §395's reading ("it would run into the staff below") was wrong for the cause of the clash; the fit's split into columns stands on its own.
**MEASURED:** `check_rules.js` — every gate of part (10) GREEN (no word across a go line, no shared ink, no slash among ledger lines); only the old two reds. **NOT LOOKED AT as a picture.**

## §397 · 2026-11-22 · his word — the alto sax's 211.81 is the slap; pizzicato behind the bridge built (cross head on the open string, "pizz. b.b.", the string's Roman numeral)

**His words:** SW-137 (the sketch pad).
**211.81:** the staccato D♯5 (`wc-2768`) is out of the notation's copy of the save; the exploding slap stays. The save as it was: `…before-397.json`.
**PIZZICATO BEHIND THE BRIDGE (`devices.byTechnique.pizz_behind_bridge_vel`; a new row `objects.stringNumeral`):** the short-note unit with the CROSS head (§393's), the words "pizz. b.b.", and the string's Roman numeral read from the note's own pitch (I = the highest string: the violin's E5 · A4 · D4 · G3; the cello's A3 · D3 · G2 · C2), upright, the word's size, centred on the head. The words' widths measured and added (`word_widths.py`).
**THE NOTES ON OPEN STRINGS:** of the violin's 9, seven were already on an open string's pitch (the deal had landed them on 55 · 69 · 76); two moved to the nearest — 217.80 E4 → D4 (III) · 234.18 C5 → A4 (II), each with its old pitch kept under properties.openString. The sample is one recorded pluck per key (55 … 76), so the sound of those two changes; not heard.
**WHERE THE NUMERAL LANDS — NOT AS RECOMMENDED, said to him:** "above the note" was the recommendation. On a stem-up note the stem is this score's long flag-clear stem, the numeral above its tip would leave the lane, and the fit carries it to the head's side, under "pizz. b.b.". So the numeral reads under the word there. His to judge on the page.
**WHAT IS LEFT:** one duplicate, the violin's 239.76 (col legno gettato | Bartók pizzicato, A4). "No rule yet" for the four parts: 6 lines, that one and the pairs near the beaming measure. `check_rules.js`: every gate of part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §398 · 2026-11-22 · his figure — the alto sax's 208.54: the staccato out, the slap on its moment, tied into the flutter-tongue (the tied attack, by its rule)

**His words:** SW-138 (the sketch pad).
**WHAT WAS THERE:** three A4s — a staccato at 208.543, an exploding slap at 208.678, a flutter-tongue at 208.783 (held to 209.283); the curve on the staccato.
**DONE IN THE NOTATION'S COPY OF THE SAVE (as it was: `…before-398.json`):** the staccato (`wc-2763`) is out; the slap (`wc-2766`) starts at 208.543, its length kept; the flutter-tongue (`wc-2764`) starts at 208.543 and ends where it ended. Each moved note keeps its old times under properties.moved. So "keep the GC where it is" is literal: the moment is the same 208.543. THE SOUND MOVES WITH IT — the slap 0.135 s earlier, the flutter-tongue's start 0.24 s earlier; not heard.
**THE FIGURE IS MADE BY THE RULE, nothing by hand:** a short and a held note on one pitch at one instant = the tied attack (§396) — the builder now counts 3. Read from the drawn items: the slap's head on the moment with its flag, the curve, no go line, the p and "(slap)" under it; the flutter-tongue's head 2.43 ss to the right with "flz.", no dynamic; a curve between the heads. The alto sax has 2 beamed groups (the staccato and the slap had been one).
**MEASURED:** `check_rules.js` — part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §399 · 2026-11-22 · his word — the alto sax's 215.00 a tied attack: a staccato tied into the double-tongued note

**His words:** SW-139 (the sketch pad).
**WHAT WAS THERE:** a staccato E5 at 214.995 and a double-tongued E5 at 215.191 (0.2 s on), each its own figure.
**DONE in the notation's copy of the save:** the double-tongued note (`wc-2774`) starts at 214.995 with the staccato and ends where it ended (215.521); its old start under properties.moved. Nothing removed. Its sound starts 0.2 s earlier; not heard.
**THE FIGURE by the rule (§396):** the builder counts 4 tied attacks. Read from the drawn items: the staccato's head on the moment with the curve, no go line, the fff; the double-tongued head 2.43 ss to the right with "d.t.", no dynamic; a curve between them. `check_rules.js`: part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §400 · 2026-11-22 · his word — the alto sax's slap and staccato at 234.44 → 234.79 beamed; one curve, on the first

**His words:** SW-140 (the sketch pad).
**BUILT (`build_ctpt_page.js`: his own beam, listed with its entry; the rule had left the pair apart, 0.35 s being wider than the 0.33 s measure — it was on the "a little wider than the measure" list since §387):** the two A4s are one beamed group — both heads' left edges on their moments, no go lines (the group's regime, §374); the second note's gestural curve is off (a hand, noGc), the first keeps its own. Read from the drawn items: one curve at 234.439, no go line at either, both heads at their left edge. The alto sax has 3 beamed groups. `check_rules.js`: part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §401 · 2026-11-22 · the column at 238.24: THE STANDARD EXISTS (the fit ladder) AND IT FAILS HERE, SILENTLY, ON 24 NOTES — found, listed, put to him

**His words:** SW-141 (the sketch pad).
**FOUND — his memory is right:** the standard is THE FIT LADDER (*Recombination* PLAN 2e.4; `rules.json ladder`; `notation/lib/fit.js`; applied at the end of `layoutSection`). A note's column that leaves its part's lane is (1) closed up, 0.45 → 0.3 → 0.2 ss; (3) its annotation flipped to the other side of the note, the pitch data kept by the head; (2) made a size smaller; (3) flipped whole; and when nothing fits it KEEPS ITS PLACE, is reported (`model.fit`, rung 8) and marked "fit?" in red — until he gives an override.
**WHY HE SAW NOTHING:** this working page is built with `--noFitMark` (the red marks switched off, §264, his "can we suppress that"), and neither "no rule yet" nor `check_rules.js` read the ladder's report. So a column left out of its lane was silent.
**MEASURED (a new tool, `tools/fit_list.js`, now printed by the builder):** on the four parts 57 columns leave their lane; the ladder placed 33; **24 do not fit** — clarinet 6 · alto sax 8 · violin 10 — by 0.9 … 3.7 ss.
**THE ONE AT 238.24 (the alto sax, an exploding slap on a low D3, written with an 8vb):** the lane is 15.9 ss tall (7.94 each side of the middle line) with 0.5 ss of free gap. The stem goes UP and is this score's long stem — its flag clears the staff by 2 ss (§378) — so its tip stands at +7.5, the lane's top. Below the head hangs a column SIX deep: dot · accent · + · fff · "(slap)" · 8vb, down to −11.2: 3.23 ss past the lane, into the percussion's staff. The ladder's own record: closed to 0.2 ss it still passes by 2.14; flipped to the other side it passes the TOP by 4.95, because the stem's tip is already there. So neither side has room BEYOND the note; the room is BESIDE the long stem.
**WHAT THE LINEAGE ALREADY HAS FOR THAT:** `dynBesideStem` (piece 4, day 23) — the dynamic stands beside the stem, on the stem's side, not beyond its tip. It is in these rows; it is used on the beamed notes here and not on the lone ones.
**PUT TO HIM, NOT BUILT (one recommendation):** a new first step for a column that leaves its lane — the dynamic, then the word, move BESIDE THE STEM (in the empty space next to it); the signs that name the note (dot · accent · +) and the ottava stay with the head. With the fff and "(slap)" beside the stem, 238.24's column ends near −8.1, inside the lane and its gap.
**ALSO:** the builder prints the list at every build, so a column that does not fit is never silent again.

## §402 · 2026-11-22 · his rule — BESIDE THE STEM, the fit ladder's first step: 24 columns that did not fit become 2

**His words:** SW-142 (the sketch pad).
**BUILT (`rules.json ladder.besideStem`; `layout.js`, where the ladder is applied):** for a column that leaves its lane, BEFORE the older rungs — the dynamic, then the technique's word, move beside the stem: on the stem's side of the note, outside the staff by 1 ss, their right edge 0.15 ss left of the stem (the flag is on its right; 0.15 is the lineage's dynStemGapSs), the dynamic nearer the staff, the word beyond it, 0.45 apart. The marks that name the note (dot · accent · sign) and the ottava stay with the head; what stood beyond the two closes up. If that alone is not enough, the column that is left may be closed up by the ladder's own rung 1; if it takes more than that, everything is put back and the older rungs run as before.
**MEASURED (`tools/fit_list.js`):** 57 columns leave their lane; the ladder now places 55 (it was 33); **2 do not fit**, both the violin's bow overpressure on a high note (205.86 · 237.79, 3.71 ss below) — the square head's stem goes down and the three down-bows stand past its tip (§393), which he is to re-evaluate anyway.
**238.24, the figure he named:** the fff and "(slap)" stand beside the stem above the staff (the fff at y 3.49, the word above it, both ending 0.15 left of the stem); under the head dot · accent · + · 8vb, closed to 0.3 ss, the 8vb's label inside the lane's gap.
**LOOKED AT ONCE** (the throwaway, zoom view, 236 … 241.5 s): the figure is drawn so; the column no longer reaches the percussion's staff. `check_rules.js`: part (10) green; the old two reds.
**A NOTE FOR LATER:** the gestural curve passes through the room beside the stem on some notes; it is drawn behind the notation (§383), so the marks stay readable — his eye to confirm.

## §403 · 2026-11-22 · the new clarinet library FOUND — it is the Xsample Clarinet (Bb), and ITS MANUAL LISTS NO SLAP TONGUE; the rack work prepared, not begun

**His words:** SW-142 ("the Clarinet is installed now. So let's set that up in the Reaper rack. It should be something similar to the base Clarinet. And let me know when you need me to do whatever steps.").
**FOUND ON DISK (installed today, 12:56):** `C:/Users/jwloy/Documents/Xsample Sample Library/clarinet/Xsample_Collection/` — the elastic instrument `Instruments Elastic/Woodwinds/Clarinet Bb.nki`, its manual `Documentation/Xsample_Woodwinds_Clarinet_Bb.pdf`. The same maker and the same kind of instrument as the bass clarinet and the bass flute (Kontakt, CC0 selects the preset).
**THE MANUAL'S ROSTER (read whole, 3 pages) — 28 factory presets:** 1 Senza Vibrato MW · 2 · 3 Staccato Velocity 1 · 2 MW Shape · 4 Natural Vibrato MW · 5 Flutter Tongue MW · 6 Crescendo · 7 Key Noises Velocity · 8 Multiphonics Velocity · 9 Undefined Tones Velocity · 10 Air Noises Velocity · 11 Mouthpiece Tones Velocity · 12 Slides Down Velocity · 13 Slides Up Velocity · 14 Senza Vibrato Velocity · 15 Senza Vibrato Velocity + MW inverted · 16 Flutter Tongue Velocity · 17 Senza Vibrato + Flutter Tongue Velocity X MW · 18 Triple Tongue 16T · 19 Staccato Velocity · 20 With Accent Velocity · 21 Multiphonics MW · 22 Air Noises MW · 23 Vibrato MW · 24 Vibrato Velocity · 25 Vibrato Velocity + MW inverted · 26 Secco Velocity · 27 Portato Velocity · 28 Flutter Tongue Velocity + MW inverted.
**THERE IS NO SLAP TONGUE IN IT.** (The bass clarinet's Xsample roster has one, "Slap Tongue Velocity"; this one's playing styles are senza vibrato · vibrato · crescendo · staccato · flutter tongue · multiphonics · slides · air · key · mouthpiece · breath · playing noises · undefined tones.) The how-to's warning stands — "the menu is the truth" (the bass flute's manual listed 30, its menu had 32) — so ONE screenshot of the Preset Menu settles it. He bought it for the slap (§388): told to him FIRST, before any rack work.
**THE NEAREST THINGS IN IT TO A SLAP, to be heard, not assumed:** 26 Secco Velocity · 20 With Accent Velocity · 11 Mouthpiece Tones Velocity · 7 Key Noises Velocity.
**PREPARED:** `reaper/kontakt/load_clarinet.lua` — the bass flute's loader with the path and the tag changed (slot 1 on channel 1, three curve copies on 2 · 3 · 4). Not run.
**THE WORK, IN ORDER (the home's how-tos rack.md · kontakt.md), none begun:** 1 a new loopMIDI port for it (the AI; Reaper CLOSED; then HIS one step — Preferences → MIDI Inputs → enable it) · 2 a new track "Clarinet XS" with an empty Kontakt, through the bridge (the AI) · 3 HIS: Kontakt's menu → Run Lua script → load_clarinet.lua · 4 HIS: one screenshot of the Preset Menu, and of the lit keys · 5 the recipe (`sandbox/instruments.js`) re-pointed, the old UVI clarinet left in the rack unused · 6 the alive map and the levels measured (the AI).

## §404 · 2026-11-22 · his three rules — the figure of several notes (no go line, the main head on its moment) · this piece's one grace-note distance · every grace note's flag clear of its head

**His words:** SW-143 (the sketch pad).
**1 · THE FIGURE OF SEVERAL NOTES (`build_ctpt_page.js`):** a beamed group (§374), a tied attack (§396), and now A GRACE NOTE WITH ITS MAIN NOTE: no go line, the MAIN note's head with its LEFT EDGE on the moment, the one gestural curve on it. A single note keeps its go line. Applied to the two hand figures (the alto sax's 206.48 → 206.74 and 224.99 → 225.27) and to every grace pickup the rule finds (the clarinet's at 230.4).
**2 · THIS PIECE'S GRACE-NOTE DISTANCE (`objects.graceHead.pickupLeadSs` 2.2 → 2.6):** measured first in the figure he named, as it stood — the grace's head 2.6 ss left of the slap's, centre to centre (0.26 s of time, less the two heads' own places). Now every grace note is drawn at ITS MAIN NOTE's moment, 2.6 ss to its left (1.2 more where the main note has an accidental, §371), whatever the played gap: the grace moves, the main note never. Marked in the row as THIS PIECE's, another piece's only at his word.
**3 · THE GRACE NOTE'S FLAG (measured, then a rule):** at 224.99 the stem was 2.47 ss (the standard 3.5 × the grace's 0.707) and a 16th flag at that scale is 2.48 ss tall — so the flag reached the head. He had seen it right. The rule that the slashed grace already had (§393: head · gap · … · flag) is now EVERY flagged grace's: the stem is at least the head's half height + 0.45 ss at the grace's scale + the flag (`objects.graceHead.flagHeadGapSs`). A NEW MEASURED GATE in `check_rules.js` part (10): 3 grace flags on the page, all clear.
**WHAT THE TWO FIGURES ARE NOW (read from the drawn items):** 206.74 — the slap's head on the moment, the curve, no go line; the double-tongued grace 3.95 ss to its left (2.6 and the accidental's 1.2, at the grace's scale of head), its stem down with its two slashes. 225.27 — the slap on the moment, no go line; the staccato grace 2.75 ss to its left, its stem reaching the slap's stem tip (the flute's rule, §374), the flag far from the head.
**FOR HIM TO JUDGE (his "Let's discuss it"):** the gap 0.45 ss between flag and head is the house stack gap, taken, not chosen by him · a grace pickup's stem reaches its main note's stem tip (§374), so at 225.27 the grace's stem is as tall as the slap's.
**TWO SLIPS MET, MENDED:** a regex of the AI's cut the container's grace row at a brace inside its note and broke the file for one build; a backslash lost in a heredoc made the new gate count 0 flags (the trap of the memory note "backslashes go through the file tool") — both caught by the build and the gate's own count.
**MEASURED:** `check_rules.js` — part (10) green, 39 checks, the old two reds. `fit_list`: 2 columns do not fit (the violin's overpressure, §402). **NOT LOOKED AT as a picture.**

## §405 · 2026-11-22 · the clarinet's new track is in the rack — "Clarinet XS", an empty Kontakt on the clarinet's own port; his two hand steps next

**His words:** SW-143 ("go ahead and set up the clarinet. I'll look at it once it's in the rack and see if there is actually a slap tone one or not. Either way … it's probably a better sample library to use for the clarinet moving forward").
**A LIGHTER WAY THAN §403 PLANNED, and why:** no new loopMIDI port. The new track listens to the clarinet's OWN port, SWClar, beside the old UVI track. A new port would have meant closing Reaper, restarting loopMIDI, and his step in Preferences; this needs none of it. While both listen, the old track sounds as before and the new one, empty, is silent — nothing changes for his playing until the recipe is re-pointed, and then the old track is taken off the port (left in the rack, unused).
**DONE THROUGH THE BRIDGE (`reaper/bridge/jobs/add_clarinet_xs.lua` — a job of its own: `make_tracks.lua` would have put every track's fader back to 0 dB):** one track, "Clarinet XS", track 4, right after "Clarinet SI2": input SWClar, all channels; monitoring on; armed; fader 0 dB; an empty Kontakt 8 (64 out). No other track touched. NOT SAVED — the rack is saved by him.
**THE LOADER parses** (`loadfile` through the bridge): `reaper/kontakt/load_clarinet.lua`.
**HIS, NEXT:** in the Kontakt of "Clarinet XS": menu → Run Lua script… → that file; then one screenshot of the instrument's Preset Menu (is there a slap?), and of the lit keys (the range).

## §406 · 2026-11-22 · his correction — beside the stem is the ladder's LAST step, not its first; his rule — nothing is written across a stem (a new gate)

**His words:** SW-144 (the sketch pad).
**WHAT HE SAW, AND THE CAUSE (the AI's fault of §402):** on the flute's beamed notes (206.28 · 209.81 · 210.44 · 220.33 · 248.95) the word stood ACROSS the stem. Traced with the new step off, then with the whole ladder off: as the rules stack it, such a note (stem down, in a beam) has its dynamic over the head and its word under the beam, 1.01 ss past the lane; the ladder's own FLIP carried the word up over the dynamic, in the head's column — a good figure, the one he had before today. §402 put "beside the stem" FIRST: it took the dynamic out of that column and stood it beside the stem, and the closing-up that followed pulled the word up the stem's side, across it.
**THE ORDER NOW (`layout.js`, where the ladder is applied; `rules.json ladder.besideStem` reworded):** 1 the column as the rules stack it · 2 the ladder's column steps — closed up, flipped to the other side of the note, a size smaller · 3 ONLY WHEN NONE OF THAT FITS: beside the stem, and only for the marks on the side that spills. The five flute notes are as they were before §402 (read from the drawn items: 209.81's word at y 4.06 over its dynamic at 3.07, both on the head's centre). The alto sax's 238.24 — which the column steps cannot mend — still has its fff and "(slap)" beside the stem.
**NOTHING ACROSS A STEM (his rule; a NEW MEASURED GATE, `check_rules.js` part (10)):** no technique's word and no dynamic whose height lies within its own note's stem spans that stem sideways. 468 marks on the pages, none across. Beside a stem a mark is RIGHT-JUSTIFIED against the stem's LEFT side, 0.15 ss from it — the flag hangs on the right, so the left is the free side on an up stem and a down stem alike. That answers his "whether it gets right or left justified" for now; put to him.
**THE COST, SAID:** with the fallback narrowed to the spilling side, 6 columns do not fit (it was 2 under §402's wider use): all the violin's — the two overpressure notes, and four pizzicato-behind-the-bridge / col legno notes that spill ABOVE (211.29 · 223.35 · 242.63 · 247.64), where the string's numeral stands over the long stem. They wait on his word about the numeral (§397) and the overpressure figure (§393).
**MEASURED:** `check_rules.js` — 40 checks, part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §407 · 2026-11-22 · the clarinet's slap sounds from the BASS CLARINET's sample (folded by octaves, for the sound only); TRIPLE TONGUE joins the clarinet; the clarinet re-rolled

**His words:** SW-145 (the sketch pad). He had run `load_clarinet.lua` (its read-back: "Clarinet Bb" on channel 1 and three curve copies on 2 · 3 · 4, each −6 dB) and saved the rack; he confirmed the library has no slap (§403's reading of its manual).
**A FAULT OF §405 FOUND AND ENDED:** the new track listened to the clarinet's own port, SWClar. Once it was loaded on channels 1 … 4 it DOUBLED the old clarinet's four parts there (ord · aeolian · crescendo · durations). It is off that port.
**THE RACK (through the bridge — `reaper/bridge/jobs/clarinet_xs_route.lua`; NOT SAVED, his):**
- "Clarinet XS" (the Xsample Clarinet Bb) ← SWFluteb channel 11, mapped by Reaper to channel 1.
- "Bass Clarinet XS" — a NEW track after it, CLONED WHOLE from piece 6's rack on disk (`decibel_TENOR_2026/reaper/decibel_rack.rpp`, 11 761 lines of its chunk, its loaded Kontakt inside, its sends stripped; its fader as it came, −1.16 dB) ← SWFluteb channel 12, mapped to channel 1. No hand step.
- WHY THAT PORT: the second flute instance uses channels 1 … 6 and 10 of SWFluteb; 11 and 12 are free and the flute's plugin holds nothing there. So NO NEW loopMIDI PORT — nothing restarted, nothing for him to enable (§403's step 1 is not needed). Named plainly: two clarinet voices ride the flute's second port.
**THE RECIPE (`sandbox/instruments.js`, the clarinet):** `slap` — port SWFluteb, channel 12, CC0 5 (the bass clarinet's preset 6 "Slap Tongue Velocity"), its range 34 … 65, `playFold: true` · `triple_tongue` — port SWFluteb, channel 11, CC0 17 (the clarinet's preset 18 "Triple Tongue 16T"). The staccato, the flutter-tongue and the ordinary voice STAY on the old clarinet: 675 staccatos elsewhere in the piece are leveled on it; moving the whole clarinet to the new library is its own job, not begun.
**THE OCTAVE FOLD, FOR THE SOUND ONLY (`score/public/composer.html` the live sender · `score/public/sonify_core.js` the compiled one):** a technique marked `playFold` sends its note folded by octaves into its own range; the note in the save — and so the notation — is untouched. `artic_deal.js` deals such a voice in the INSTRUMENT's range, so the deal never folds the written note either (0 pitches changed).
**THE NOTATION:** `devices.byTechnique.triple_tongue` — the double-tonguing figure with THREE slashes and "t.t." (its width measured, 1.0 em); the technique table's `triple_tongue` (clarinet). The slap's look is unchanged.
**THE RE-ROLL (the deck flz · staccato · slap · triple_tongue; triple tongue among the techniques that want a longer note; scattered, seed 1123; the save as it was: `…before-407.json`):** the clarinet's 41 notes — **staccato 13 · slap 10 · flz 9 · triple tongue 9** (it was staccato 15 · slap 14 · flz 12); 18 short notes grown, 3 swapped. The dynamics are the same notes' own. Sent velocities by the old maps (the slap by the staccato's, the triple tongue by the flutter-tongue's) — NOT MEASURED on the two new voices.
**PROVEN ONCE (`tools/key_sweep.js`, the tracks' own Kontakts, velocity 100):** the bass clarinet's slap sounds on 34 … 66 (−27.1 dB at 34, −23.6 at 65; nothing at 33) · the clarinet's triple tongue sounds on 50 … 94 (−21.9 at 50, −14.1 at 89; nothing at 49 or 95). Both tracks' inputs read back afterwards: SWFluteb 11 → 1 and 12 → 1. NOT PROVEN: the path from his page through the port — he hears it or he does not.
**MEASURED:** palette green 210 · roster green, 343 voices · `check_rules.js` the old two reds · the page: 2 beamed groups and 1 grace pickup in the clarinet; "no rule yet" has one line for it (217.37, a slap into a held triple tongue).
**LEFT, the AI's (NITS):** the two new voices' levels against the old clarinet's (the slap reads about 8 dB under the triple tongue at one velocity) · rows for the two tracks in `rack_alive.js`.

## §408 · 2026-11-22 · his figure — the tied attack's MIRROR (the clarinet's 217.70 → 218.08); the silent slap traced as far as the AI can reach

**His words:** SW-146 (the sketch pad).
**THE FIGURE (`build_ctpt_page.js` HANDS; a new hand key `drawAt` in `layout.js` — a note drawn at ANOTHER note's moment, resolved by `notate_section.js`):** what the alto sax's tied attacks have, he asked for here — no go line, everything moved to the curve. The staccato G4 (`wc-2732`, 218.076): its head's left edge on its moment, its gestural curve where it was, no go line, no dynamic. The triple-tongued G4 (`wc-2731`, 217.699, 0.38 s before): drawn AT the staccato's moment and stood to its LEFT by the tied attack's own distance (`objects.tiedAttack.shiftSs`; the heads 2.43 ss apart, centre to centre — read from the drawn items: −1.91 and 0.52), with the figure's one dynamic (its p) and "t.t.", and a curve to the staccato. So the held note stands 0.25 s later on the page than it sounds; its sound is not moved.
**NOT MADE A RULE:** a held note followed by a short note of the same pitch is not found by the builder; this one pair is written out with his words. The tied attack's row carries the distance for both.
**THE SILENT SLAP — what was checked, in order, and what was found:**
- THE RACK, through the REAL port (`tools/artic_probe.js --port SWFluteb --channel 12 --track "Bass Clarinet XS"`, CC0 5): 60 · 61 · 62 · 54 · 65 · 50 all sound, −14 … −20 dB; 72 sounds too (−20.2); **86 is silent (−62)**. So the sample reaches above the 65 the lineage's record gives it, and stops somewhere under 86.
- THE COMPILED SENDER (`sonify_core.compileScore` run in node over 230 … 240 s of the clarinet): 230.42 → SWFluteb channel 12, CC0 5, note **60** (72 folded) · 239.35 → note **62** (86 folded). Right.
- THE LIVE SENDER (`composer.html`): the same expression, on the technique object itself (`curveTechniqueFor`); the route is the technique's own port and channel (no curve bank for a slap); no range guard on playback.
- THE SERVER serves the new page and the new sender (`Cache-Control: no-store`, both hold `playFold`).
- **WHAT HIS REPORT MATCHES:** "230.46 sounds, the next doesn't" is exactly a page that sends the slaps UNFOLDED — 72 sounds, 86 does not. So the page he listened on was running without the fold. (Also seen: at 230.37 a staccato grace of the old clarinet sounds 50 ms before that slap.)
- NOT FOUND: why. Reaper's recent-input list held nothing from the port when asked. Put to him in one question — which page he plays from.
**MEASURED:** `check_rules.js` — part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §409 · 2026-11-22 · the octave move now lives IN THE RACK — a small effect before the bass clarinet's Kontakt; the silent slap sounds

**His words:** SW-147 (the sketch pad). The clarinet's first slap is at 200.68, a C♯6 (MIDI 85); from his page it was silent after his reload too — so the page was still sending it unmoved, for a reason not found (§408).
**THE ANSWER TO "can we just get a routing in there":** yes, and it no longer depends on any page. `reaper/jsfx/switch_octave_fold.jsfx` (a copy in Reaper's Effects folder), inserted through the bridge as the FIRST effect on "Bass Clarinet XS", before its Kontakt: every note-on and note-off outside 34 … 65 is moved by whole octaves into it; a note inside passes as it is; nothing else is touched. The save and the notation never see it.
**PROVEN ONCE, through the real port, the notes sent UNMOVED as his page sends them (`artic_probe.js`, SWFluteb channel 12, CC0 5):** 85 → −15.1 dB · 86 → −16.6 (it was −62, silent, §408) · 89 → −15.3 · 50 → −14.2. Every slap of the clarinet sounds whatever the page does.
**THE PAGE'S OWN FOLD (§407) stays** — where it runs, the note arrives already inside the range and the effect passes it. Why his page did not run it is still not known; it no longer matters for the sound.
**NOT SAVED:** the effect is in the open rack; the rack is saved by him.

## §410 · 2026-11-22 · his rule — bow overpressure: the down-bows ABOVE the note, the marcato and the dynamic BELOW, whichever way the stem goes

**His words:** SW-148 (the sketch pad). What his picture showed: with the stem down (the violin's high notes) the three down-bows hung past the stem's tip under the staff, and on the next note the marcato stood inside the down-bow stack over the head.
**BUILT (`devices.byTechnique.bow_op_vel`: `tipSignsSide: above` · `chainSide: below`; `layout.js`):** the stack of three down-bows stands above the note always — over the head when the stem goes down, over the stem's tip when it goes up, the house 0.45 ss off, one staff space apart. The note's other marks (the marcato, the dynamic) go below. Read from the drawn items at 205.86: the down-bows at y 5.27 · 6.27 · 7.27 over the head at 4.
**THE FALLBACK WIDENED BY ONE CASE (`ladder.besideStem`, §406):** below a stem-down note "below" is past the stem's tip, where this score's long stem leaves under one staff space — the marcato and the dynamic left the lane by 1.72 ss. So when the side that spills is the STEM TIP's side, the articulation moves beside the stem too (nearest the staff, then the dynamic, then the word); on the head's side it stays with the head, as before. At 205.86: the marcato at y −3.55 and the p at −4.88, right-justified against the stem's left. AND A GUARD: the closing-up that may follow is run without the marks that moved, so nothing is dragged toward them along the stem (the fault of §402, met again here on the marcato and caught before the page was shown).
**MEASURED (`fit_list`):** 60 columns leave their lane, the ladder places 56; 4 do not fit — the violin's 211.29 · 223.35 · 242.63 · 247.64, all spilling ABOVE: the string's numeral over a long stem (§397), waiting on his word about the numeral's place. `check_rules.js`: part (10) green; the old two reds.
**NOT LOOKED AT as a picture.** Not checked by a gate: an articulation sign across a stem (the gate of §406 measures words and dynamics).

## §411 · 2026-11-22 · the last duplicate out (the violin's 239.76 is the Bartók pizzicato); THE MIDI BLOCKAGE CURED WITHOUT A RESTART; the cello has no notes here

**His words:** SW-149 (the sketch pad).
**239.76:** the col legno gettato A4 (`wc-2895`) is out of the notation's copy of the save; the Bartók pizzicato stays. The save as it was: `…before-411.json`. "No rule yet" has no duplicate left on the four parts. He approves the violin ("the violin looks good").
**THE MIDI BLOCKAGE — measured, then cured:** Reaper and loopMIDI were both running. A note sent straight to each port (`tools/artic_probe.js`) read SILENT (−150 dB) on the old clarinet, the flute, the alto sax and both new clarinet tracks; only the violin sounded — and those tracks had sounded minutes before. So the block was in the rack's MIDI inputs, not in his page. `node tools/reaper_job.js run reaper/bridge/jobs/midi_reinit.lua` (the job of §19: Reaper closes and re-opens every MIDI device) — then the same notes: clarinet −8.7 dB · flute −6.5 · alto sax −6.3 · bass clarinet slap −16.3 (sent as the high C♯6, moved by the rack's octave effect, §409) · the Xsample clarinet −19.9 · violin −16.7. All sound. NO RESTART of the computer, of Reaper or of loopMIDI. Kept as a memory note for the next time.
**A THOUGHT ON §408 · §409, not proven:** some of the "silent slap" reports may have been this blockage and not the octave; the rack-side octave move stands either way.
**THE CELLO:** it has NO notes between 199 and 254 s in the save (646 in the whole piece: a few up to 140 s, then from 260 s on). There is nothing to notate here; its staff on the page is empty. Put to him: is that a rest, or is a cello part wanted in this section.

## §412 · 2026-11-22 · THE PIANO'S NOTATION SCANNED across the lineage, before any of it is drawn — what stands, and five discrepancies for him

**His words:** SW-150 (the sketch pad).
**WHAT THE PIANO PLAYS IN THE COUNTERPOINT (199 … 254 s, 47 notes):** the ordinary note (`main`) 20 · plucked 15 · muted 12.
**WHERE IT WAS LOOKED FOR:** this piece's rows (`devices.byTechnique`) and `docs/NOTATION_STANDARDS.md` (the rows *Recombination* settled, §485 … §504 there) · piece 2: `docs/GLYPH_REGISTRY.md`, `engine/idioms/pluckedPianoChord.js` · `pluckedPianoCluster` · `pluckedPianoHarmonic` · `pluckedPianoHarmonicChord` · `pianoSingleNoteRoll` · `pianoAccelDecel`.
**WHAT STANDS:**
- THE ORDINARY NOTE (*Recombination* D49 · §486): an open head, its left edge on the moment; no stem, no go line, no gestural curve, no bar for its length; its dynamic; an l.v. slur (piece 2's LilyPond crescent). In force here (`main`).
- THE CHORD (§488): one dynamic under the lowest note; an l.v. slur on every note; no stems.
- THE PLUCKED NOTE, *Recombination*'s (§490): the ordinary note's look plus "pizz." above the top note (piece 2's baked text) and "Ped." under it; no release sign. In force here (`plucked`). Two plucked notes under 0.25 s: filled heads, two beamed 8ths, stems up, pizz. on both, Ped. on the first.
- THE PLUCKED NOTE, piece 2's (`pluckedPianoChord`, its session 49): a FILLED head with a stem DOWN and an 8th flag, "pizz." above, the dynamic and "Ped." below the stem's tip. Also there: the plucked cluster · the plucked harmonic (a diamond head) · the harmonic chord.
- THE MUTED NOTE: NO LOOK in this piece's rows (drawn today as a plain black head and its bar — a placeholder). Piece 2's registry holds the "+" sign as "stopped / muted" and names it for the muted piano; no figure was ever built with it.
**THE DISCREPANCIES, for him:**
1. THE PLUCKED NOTE HAS TWO LOOKS — piece 2's flagged black note, *Recombination*'s open ringing head. The later one is in force.
2. THE MUTED NOTE HAS NONE — and its one registered sign, "+", is already the SLAP's sign in this score's winds.
3. THE REGIME: in this section every other part's short note is a flagged note with a gestural curve and (alone) a go line; the piano's standing regime has none of the three. The plucked and the muted notes are short notes.
4. THE DYNAMIC: *Recombination* took the piano's dynamic from the ensemble (D50); here the four parts done were dealt p · f · fff per note, the piano not yet.
5. THE BEAMING MEASURE: the piano's standing pair rule is 0.25 s; this section's is 0.33 s.
**NOTHING DRAWN.** The AI's one recommendation per point is in the chat; the piano is notated on his word.

## §413 · 2026-11-22 · verified — the cello was never played into the counterpoint; nothing was erased

**His words:** "Sorry, when you say there's no cello part, I didn't play one in into the composer score. Can you look back to see if ever there was one? Maybe it got erased. Basically, at some point when I made this section, I played each part. And then we went through a series of changes where you added the articulations, etc. So just verify that I never played the part and it got erased."
**CHECKED:** every save in `scores/` that holds notes between 195 and 256 s — 40 files of the section, from the first (`piece-Section02-a-pnoSolo-01a`, 2026-11-10 03:43) through each of his takes (`…B-ctpt-01` → `01a` the flute → `01b` the clarinet → `01c` the alto sax → `01d` the violin; then the second pass `…B-01-flA` … `B-06` the bowed vibraphone), every articulation and scatter save, to `piece-FirstDraft-Final` and its copies — counted by instrument. The parts he played in: piano · flute · clarinet · alto sax · violin · bowed vibraphone (part of it later moved to the percussion by the deal). **The cello has no note there in any of the 40.** The deal's own record of 2026-11-10 says the same (`bank/artic_deal.json`: "The cello has no notes in the section as saved; its deck waits"). Nothing was erased.

## §414 · 2026-11-22 · THE CELLO in the counterpoint — his take brought through the section's steps and notated by the rules

**His words:** SW-151 (the sketch pad). His take: `piece-FirstDraft-Final-C-cello` (saved by him from the notation's copy, so it holds the day's work) — 47 cello notes, 200.65 … 251.99 s, MIDI 36 … 79, captured on the lane's default voice. His save is not touched.
**THE STEPS THE OTHER PARTS HAD, found in the log (§139 … §155) and run for the one lane (`tools/port/scratch/cello_ctpt.js`, in a copy, `piece-FirstDraft-Final-D-ctptCello`, now the copy the notation reads):**
1. THE HARMONY (§139 … §141) — the section's own roll, not a new one: `harmony_roll.js --contrast`, 0.5 … 1.5 s, seed 17, run on a temporary file holding the cello's notes alone. Its deal printed 13 01 14 12 11 10 03 02 05 07 06 04 15 09 16 08 | 09 13 06 … — the same sequence the other parts' notes carry in their `properties.harmony` (checked before it was used). 45 of the 47 pitches fitted, each to the take's own cello voice nearest the played note; none on a lane a take had left empty. The other lanes were not re-rolled (that would have undone the thinning of §153 … §155 and today's changes).
2. THE TECHNIQUES (§145 · §151) — `artic_deal.js --scatter`, the cello's deck (the violin's five), seed 1124: col legno gettato 9 · jeté 9 · Bartók pizzicato 10 · bow overpressure 9 · pizzicato behind the bridge 10; 9 short notes grown for the overpressure, 2 folded into a technique's range.
3. THE DYNAMICS (§151 · §384) — `dyn_deal.js` p · f · fff, seed 1125, notes within 0.2 s sharing one: p 17 · f 15 · fff 15.
4. THE LEVELS — each note sent by the VIOLIN's map for the same technique (the same library, the same presets); NOT measured on the cello (NITS).
5. BEHIND THE BRIDGE (§397) — its 10 notes written on the nearest open string (C2 · G2 · D3 · A3); proven once that the cello's sample sounds on those four keys (`key_sweep.js "Cello XS" --cc0 80`: −13.2 · −15.7 · −17.4 · −18.3 dB; nothing on 60).
**NOT DONE, and why:** the thinning of an over-used pitch (§153 … §155) was his ear's, one pitch at a time — none asked. The section's loudness parity (§152) is the AI's, still to run with the cello in.
**THE NOTATION (`build_ctpt_page.js`: the save's name; AUTO_PARTS now 1 · 2 · 6 · 7):** the cello's 47 notes by the rules settled today — 2 beamed groups, 1 grace pickup, every technique with its look and word. "No rule yet": ONE duplicate, 212.08 s — a jeté F3 and a col legno gettato F3 at one instant (his to say which stays). `fit_list`: 10 columns do not fit — the violin's 4 and the cello's 6 (204.31 · 208.84 · 215.91 · 226.56 · 235.35 · 241.27), all spilling ABOVE: the string's numeral over a long stem, the open question of §397. `check_rules.js`: part (10) green; the old two reds.
**NOT LOOKED AT as a picture; not heard.**

## §415 · 2026-11-22 · his word — the cello's 212.08 is the jeté

**His words:** "keep the jeté at 212.08". The col legno gettato F3 of the pair is out of the notation's copy (`piece-FirstDraft-Final-D-ctptCello`; as it was: `…before-415.json`); the jeté stays. The cello has 46 notes; no duplicate is left on the five parts. `check_rules.js`: the old two reds.

## §416 · 2026-11-22 · his eye — the down-bows too high over a beam: the stack is placed from the stem's tip AS IT STANDS (the standard mended)

**His words:** SW-152 (the sketch pad). His picture: the cello's Bartók pizzicato and overpressure beamed at 215.62 → 215.91; over the second, a marcato on the beam, then a wide gap, then the three down-bows, then the p.
**THE CAUSE, measured:** the stack was set when the note was drawn, from the note's OWN stem — this score's long flag-clear stem, its tip at 7.5 ss. In a beam the tip is the beam's, and the beams are levelled afterwards: the tip came down to 3.54 and the stack stayed at 8.38 … 10.38 — 4.8 ss too high. And the marcato of a beamed note went to the group's row over the beam, which is where the down-bows belong.
**THE STANDARD NOW (`layout.js`, a pass after the beams are level; `objects.bowStack` unchanged):** a stack over an up stem is re-set to the house gap (0.45 ss) over the stem's tip as it stands — the beam's outer edge in a beam. A beamed note whose row sends its marks BELOW (the overpressure's `chainSide: below`, §410) keeps its articulation in its own column under the head, not in the group's row. At 215.91, read from the drawn items: the down-bows at 4.67 · 5.67 · 6.67 over the tip at 3.80; the marcato at −5.4 under the head.
**LEFT AS THE GROUP'S RULE, said to him:** the dynamic of a beamed note in this section stands over the beam (the p is above the down-bows, as the f is above the first note's accent).
**MEASURED:** `fit_list` — that column now fits (9 do not: the numerals over long stems, §397). `check_rules.js`: part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §417 · 2026-11-22 · his exception — the cello's overpressure at 223.33: stem down, every mark over the staff

**His words:** SW-153 (the sketch pad). What his picture showed: the C3 sits in the staff; by rule its stem went UP, long, into the part above; the stack over its tip could not fit and the fit threw the marcato, the f and the down-bows under the staff.
**THE EXCEPTION (`build_ctpt_page.js` HANDS, `wc-9862`, with his words):** `nhStemDir: down` · `chainSide: above`. Read from the drawn items: the stem down to −7.0; the down-bows at 2.87 · 3.87 · 4.87; the marcato at 6.29; the f at 7.77 — all over the staff, in the cello's own lane; the column fits.
**ONE THING MADE STANDARD BY IT (`layout.js`, the stack's placing):** a stack over a head that stands INSIDE the staff begins the house gap over the staff's TOP LINE, never among its lines — his "above, but above the staff".
**NOT TOUCHED:** the violin's overpressure 30 ms later (223.35, a G3 under its staff) — still on the list of columns that do not fit; said to him.
**MEASURED:** `fit_list` 9 (the violin's 4, the cello's 5) · `check_rules.js` part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §418 · 2026-11-22 · his LOCAL rule — the cello's bow-overpressure notes in this section: stems down, the marks over the staff

**His words:** SW-154 (the sketch pad).
**BUILT (`build_ctpt_page.js`, by a loop with his words — no note written out, and nothing in the rules' tables: it is this section's cello only):** every bow-overpressure note of the cello between 199 and 254 s takes `nhStemDir: down` · `chainSide: above`. 9 notes; 8 of them lone — stem down to −7.0 (into the electronics' lane where the head is low, which he allows), the three down-bows over the staff's top line (2.87 · 3.87 · 4.87), the marcato, then the dynamic above them. The ninth (215.91) is BEAMED with a Bartók pizzicato: it keeps the beam's stem and §416's figure (the down-bows over the beam, the marcato under the head) — with the rule applied to it the marcato went back onto the down-bows; caught in the drawn items and excluded.
**A CORRECTION to §414 · §416 · §417:** the cello's columns that did not fit were NOT the string's numerals — they were these overpressure notes, their stems up and their stacks above the lane. With the stems down the cello has NO column out of its lane. `fit_list`: 4 remain, all the violin's (211.29 · 247.64 behind the bridge; 223.35 · 242.63 overpressure).
**MEASURED:** `check_rules.js` — part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §419 · 2026-11-22 · his word — the violin's two overpressure notes, the cello's treatment

**His words:** "yes, same for the violin's two Then can I see the piano analysis and recommendations?"
**BUILT (`build_ctpt_page.js` HANDS, `wc-2878` · `wc-2897`):** stem down, the marks over the staff. 242.63 (E4): fits — the down-bows at 2.87 · 3.87 · 4.87, the marcato 6.29, the f 7.77. 223.35 (G3, two ledger lines under the staff): the marks are over the staff, but its stem, down from so low a head, ends at −9.0 and passes the violin's lane by 1.06 ss toward the cello (and 0.32 above) — `fit_list` still names it. Said to him; his to judge on the page (with the stem up it was the marks that left the lane, by 2.86).
**`fit_list`:** 3 — that one, and the two behind-the-bridge notes with the numeral above (211.29 · 247.64). `check_rules.js`: the old two reds.
**THE PIANO:** §412's scan and its five recommendations given to him again in the chat, as he asks; nothing drawn.

## §420 · 2026-11-22 · THE PIANO of the counterpoint notated — his five decisions on §412's scan

**His words:** SW-155 (the sketch pad).
**1 · THE PLUCKED NOTE:** *Recombination*'s (§490 there), already this piece's row `plucked` — an open head on its moment, "pizz." over it, "Ped." under, the let-ring slur. Nothing to build.
**2 · 3 · THE MUTED NOTE (a new row, `devices.byTechnique.muted`):** this section's short-note unit — a filled head, a 16th flag on the flag-clear stem, the go line, the gestural curve — with the "+" sign and the word "(mute)" (its width measured); NO staccato dot and NO accent ("just with a plus and" the word — the slap's row less those two). The "+" is piece 2's registered sign for the stopped / muted string (its GLYPH_REGISTRY), the same glyph the slap carries. ONE READING OF THE AI's, said to him: "the mute and short notes" is taken as the muted notes — the plucked note he chose in the same breath is *Recombination*'s ringing one, and the ordinary note is held.
**4 · THE DYNAMICS:** `dyn_deal.js --levels p,f,fff --seed 1126 --lanes piano --tie 0.2` — fff 18 · p 15 · f 14 on the 47 notes; each note re-leveled along its own voice's parity (`tools/port/scratch/relevel.js`), the rack untouched. SEEN IN THE MAPS, the AI's to look into (NITS): the plucked voice's map sends a p at CC7 100 and an fff at 98 — the parity of §152 had levelled the three written dynamics to one loudness there.
**5 · THE 0.33 s BEAMING:** the piano joins the parts built by rule (AUTO_PARTS 1 · 2 · 5 · 6 · 7). The rule beams SHORT notes only, and the piano's only short notes are the 12 muted ones: NO two of them lie within 0.33 s, so the piano has NO beamed group. What it does have, listed for him: 6 pairs within the measure where one of the two is a ringing note (203.27 · 208.54 · 217.08 · 217.21 · 225.65 · 235.98) and one pair a little wider (227.21, 0.39 s).
**`no_rule_list.js` taught two things:** the piano's ordinary voice (`main`) needs no word; a baked word over the note (`textAbove`, the plucked note's pizz.) is a word.
**MEASURED:** "no rule yet" on the six parts — no technique without a look or a word, no duplicate; the lines left are the near pairs. `fit_list` 3 (the violin's, §419). `check_rules.js` part (10) green; the old two reds. The save as it was: `…D-ctptCello.before-420.json`. **NOT LOOKED AT as a picture; not heard.** The percussion is the one part of the section not yet notated by rule.

## §421 · 2026-11-22 · his correction — the piano's ordinary notes in the counterpoint are single hits (the staccato unit); the mutes take the dot; only the pluck rings

**His words:** SW-156 (the sketch pad). §420 had kept the ordinary note open and ringing; he had meant it among "the mute and short notes".
**BUILT:**
- THE ORDINARY NOTE, IN THIS SECTION (`build_ctpt_page.js`, by a loop with his words — NOT the row: `main` is the whole piece's open ringing head, the other sections' and *Recombination*'s): each of the piano's 20 ordinary notes between 199 and 254 s takes THE STACCATO UNIT's look as a hand — the row `devices.byTechnique.staccato` itself, read from the rules (a filled head, a 16th flag on the flag-clear stem, the staccato dot, the go line, the gestural curve, the dynamic), with the ringing note's own keys switched off (no let-ring slur, no chord rule, its head no longer on the moment).
- THE MUTED NOTE (`devices.byTechnique.muted`): the staccato dot added — the staccato unit with "+" and "(mute)"; still no accent.
- THE PLUCKED NOTE: unchanged — the open head, pizz., Ped., the let-ring slur. Read from the drawn items: 15 let-ring slurs in the piano, the plucked notes' own.
- THE RULE'S BEAMING now counts the ordinary notes as short: the piano has 2 beamed groups at the 0.33 s measure (it had none, §420). `no_rule_list.js` reads a hand that makes a note short.
**MEASURED:** "no rule yet" — no technique without a look or a word on the six parts. `fit_list` 3 (the violin's). `check_rules.js` part (10) green; the old two reds. **NOT LOOKED AT as a picture.**

## §422 · 2026-11-22 · the notation app's bar shows the time (a bug since the bar was built); his exception at the piano's 203.47

**His words:** SW-157 (the sketch pad).
**THE TIME ON THE BAR:** the bar HAS a readout (`#tbar`, "playhead time") and the pill at the bottom right is hidden while the bar is up "because the bar carries the same number" — but the bar never showed it: the view switch set its `style.display` to the empty string, which falls back to the stylesheet's `display: none`. Now `inline-block`; and made easy to see (white on black, 15 px, a fixed width). PROVEN ONCE on the throwaway, zoom view: computed display block, text "t 0.00 s", inside the bar.
**THE EXCEPTION (`build_ctpt_page.js` HANDS, `wc-2814`, with his words):** the piano's ordinary B2 at 203.470 — `nhAnchor: leftEdge` · `goLine: false`: its head's left edge on its moment, its gestural curve kept, no go line. The plucked G♯2 at 203.271 is as it was (its head on its own moment, its let-ring slur). Read from the drawn items: the two heads 0.2 s apart, each on its moment. Nothing else of the figure changed.
**MEASURED:** `check_rules.js` — the old two reds. **NOT LOOKED AT as a picture** (the figure).

## §423 · 2026-11-22 · his word — the piano's 208.55 a muted grace note into the ordinary note at 208.73

**His words:** SW-158 (the sketch pad).
**BUILT (`build_ctpt_page.js` HANDS, `wc-2817` · `wc-2818`, by §404's three rules — nothing new made):** the muted B5 (208.545) is a grace note: the small head, the flag, LilyPond's stroke, its dot, its "+" and "(mute)"; no go line, no gestural curve, and no dynamic of its own (as the alto sax's staccato grace; the figure's dynamic is the main note's fff). It is drawn at its main note's moment, the piece's grace distance to its left (the heads at −2.23 and 0.52). The ordinary B5 (208.726): its head's left edge on its moment, the curve on it, no go line. `check_rules.js`: part (10) green — 4 grace flags, each clear of its head; the old two reds. **NOT LOOKED AT as a picture.**

## §424 · 2026-11-22 · his word — the piano's 217.08 a plucked grace note into the ordinary G2 at 217.44; the G♯2 between them out

**His words:** SW-159 (the sketch pad).
**WHAT STOOD THERE:** a plucked G2 (217.080) · an ordinary G♯2 (217.207, `wc-2825`) · an ordinary G2 (217.444).
**DONE:** the G♯2 is out of the notation's copy of the save (as it was: `…D-ctptCello.before-424.json`) — the AI's reading of "there's a duplicate … keep the plucked one as the grace note one, and then just the standard played G for the second one"; said to him. The plucked G2 is a grace note (`build_ctpt_page.js` HANDS, `wc-2824`): the small black head, the flag, LilyPond's stroke, its "pizz."; no go line, no dynamic, no let-ring slur, no Ped. — drawn at the main note's moment, the piece's grace distance to its left (heads at −2.23 and 0.52), its stem reaching the main note's stem tip (§374). The ordinary G2 (`wc-2826`): its head's left edge on its moment, the curve on it, no go line, its dot and its f.
**FOR HIM TO SEE (his "let me look at it"):** the grace is a PLUCKED note written as a flagged grace — its "pizz." stands over the long stem's tip.
**MEASURED:** `check_rules.js` — the old two reds. **NOT LOOKED AT as a picture.**

## §425 · 2026-11-22 · his word — the piano's 225.65 a plucked grace note into the G2 at 225.83

**His words:** "Same with the 225.8, plucked Grace into the muted main node, I guess. Yeah."
**BUILT (`build_ctpt_page.js` HANDS, `wc-2834` · `wc-2835`, §424's figure):** the plucked G2 (225.647) a grace note — small black head, flag, stroke, "pizz." — at the piece's grace distance left of the G2 at 225.825, whose head's left edge is on its moment, no go line, the curve on it. THE MAIN NOTE IS AN ORDINARY NOTE in the save, not a muted one (his "muted … I guess"); it is drawn as what it is, and said to him. `check_rules.js`: the old two reds. **NOT LOOKED AT as a picture.**

## §426 · 2026-11-22 · his word — the piano's 235.98 an ordinary grace note into the plucked E4 at 236.12, which takes the curve

**His words:** "At 235.89 about. Let's make the first one a grace note, and then, you know, move the GC to the second one, get rid of the go line, etc."
**WHAT STOOD THERE:** an ordinary E4 (235.984, a staccato unit here, §421) and a plucked E4 (236.122).
**BUILT (`build_ctpt_page.js` HANDS, `wc-2844` · `wc-2845`):** the ordinary E4 is a grace note — small black head, flag, stroke, its dot; no go line, no dynamic, no curve — at the piece's grace distance left of the plucked E4. THE PLUCKED NOTE IS THE MAIN NOTE and keeps its own look (the open head on its moment, pizz., Ped., the let-ring slur); by his word it takes the GESTURAL CURVE, which the plucked note's row does not have (a hand, `gc: true`) — the one plucked note on the page with a curve.
**A SLIP CAUGHT IN THE DRAWN ITEMS:** the grace kept its curve at first — its hand carried the staccato row's own `gc`; the builder now switches it off wherever a hand says `noGc`.
**MEASURED:** `check_rules.js` — the old two reds. **NOT LOOKED AT as a picture.**

## §427 · 2026-11-22 · THE PERCUSSION of the counterpoint — single strikes black, the scrape white; dynamics dealt; the pitched staff named "Glock"; the scraped cymbal looked up

**His words:** SW-160 (the sketch pad).
**WHAT THE PERCUSSION PLAYS (199 … 254 s):** the unpitched staff (four lines: Coil · China · Brake · BD), 54 notes, nine of each of six sounds — spring coil · China cymbal scrape · brake drums with a poly beater · brake drums with rubber mallets · bass drum with a medium felt beater · bass drum, rute on the rim. The pitched staff: 8 notes, ALL the glockenspiel (hard mallet).
**HIS QUESTION, 202.3 — "the two bass drums … what's going on there?":** two notes on the bass drum's line, 0.175 s apart: 202.448 the RUTE ON THE RIM (0.11 s) and 202.623 the MEDIUM FELT beater on the head (0.43 s). Two different sounds on one line with nothing on the page to tell them apart — the question he is really asking; see the open point below.
**BUILT (rows `devices.byTechnique`, his words their sheet):** the five strikes and the glockenspiel — a black head, its left edge on its moment, its dynamic; no stem, no go line, no curve, no bar. The China scrape — a WHITE head, the word "scrape" (its width measured), its dynamic, its bar for its length.
**THE DYNAMICS:** `dyn_deal.js --levels p,f,fff --seed 1127 --lanes percussion,vibraphone --tie 0.2` — unpitched fff 20 · p 17 · f 17; glockenspiel fff 3 · f 3 · p 2; notes within 0.2 s share one (so 202.623 shows none: it shares 202.448's p). Re-leveled along each voice's own map.
**THE HEADER:** the pitched staff has one instrument here, so on this page it is named "Glock" — a page's own name for a staff (`notate_section.js --partName 4:Glock` → `ir.layoutPolicy.partNames` → the layout hands it to the system, the renderer draws it; declared in `notation/schema/ir_v0.schema.json`). The ensemble's name "Perc" stands everywhere else.
**A PAGE LOST FOR A MINUTE, and found by the validator:** the first build wrote `partNames` before the schema knew it; the IR validator removed the page. The schema line was added and the page rebuilt.
**THE SCRAPED CYMBAL — the lookup (one web search; a composers' forum, Indiana's style guide, the SMuFL font standard — Gould and Solomon were NOT reached):** no standard sign was found. What the sources agree on is a WORD: "scrape", with the tool where it matters ("scrape with coin", "with triangle beater"). One writer draws an upward curve like a jazz scoop and calls it his own preference. SMuFL holds pictograms for beaters and for instruments, none for a scrape. His piece 2 holds no drawn scrape either (its docs list only the samples' names). So: the word alone, on a white head, is inside common practice.
**OPEN, put to him:** (a) the unpitched sounds have NO WORD — on one line the rute-on-rim and the felt beater look alike, and so do the brake drums' two beaters (5 lines on "no rule yet") · (b) ONE duplicate, 252.67 — a brake drum and the bass drum's rim at one instant.
**ALSO SEEN — the page builder's own collision check, which the build's printout had been hiding since §369 (it prints now):** three places where one part's ink meets the next part's in the band between them — the alto sax's accent and the clarinet's p at 213.94 (0.36 ss) · the flute's beam and the clarinet's accent at 220.32 (0.37 · 0.26 ss).
**MEASURED:** `fit_list` 3 (the violin's) · `check_rules.js` part (10) green; the old two reds. The save as it was: `…D-ctptCello.before-427.json`. **NOT LOOKED AT as a picture; not heard.**

## §428 · 2026-11-22 · the percussion — "rim"; no beater words; the word UNDER the dynamic row; the spring coil's rake; piece 2's roll surveyed; scraped instruments looked up; the vertical standard put to him

**His words:** SW-161 (the sketch pad).
**"RIM", AND NO BEATER WORDS (his decision):** `gran_cassa_rute_on_rim` takes the word "rim" (its width measured). The other five rows carry `noWord` with his words ("We'll leave the mallets out"), and `no_rule_list.js` reads it — they are decided, not questions.
**HIS QUESTION, 208.84:** that note is the bass drum struck ON THE RIM; the sample's beater is a RUTE — a bundle of thin rods, between a stick and a brush, not a wire brush. So "rim" is right; "brush" would not be.
**214.57 — "the rim is over the dynamic":** one note there, not a double (the rim, 214.532). The fault was real: on the lined staff the dynamics keep ONE ROW under the staff (§657 of *Approaching*), and the word was set where the dynamic would have stood in the column — on the row. FIXED (`layout.js`): on a lined staff a note's word ALWAYS stands the stack gap (0.45 ss) UNDER the dynamic row — one height for every word along the staff. Read from the drawn items: 9 "rim" and 15 "scrape", all at −7.30; every dynamic at −5.59.
**THE SPRING COIL IS TWO SOUNDS (found in the recipe's key table):** key 63 "Muted Hit" and key 68 "Muted Rake Slow". Of its 9 notes, 2 are hits (201.00 · 225.28) and 7 are rakes (212.95 — his "particular case" — 220.17 · 226.46 · 236.96 · 246.34 · 250.14 · 250.88). By his rule of §427 the rakes are white heads with "scrape" and their bar (a loop in `build_ctpt_page.js`, by the sample's key); the hits stay black.
**PIECE 2'S ROLL, SURVEYED (`engine/idioms/percussionRoll.js`, its session 58, first used for a shime-daiko roll with rods):** one STEMLESS WHOLE-NOTE head on the line; a stack of THREE tremolo slashes ABOVE or BELOW the head (below for a note on or above the middle, above for one below — LilyPond's virtual stem direction; the slashes' sizes in its `dims.slash.aboveBelowNotehead`, the gap to the head an exception to the 0.45 rule, measured from LilyPond); an optional beater word, the dynamic. His memory "we just do the tremolo slashes" is right, and they are the same parallelograms this piece already draws on stems (§386). NO ROLL IS IN THIS SECTION'S PERCUSSION, so nothing is built; the figure is ready to be taken when one comes.
**SCRAPED INSTRUMENTS, LOOKED UP (one web search: Timbre & Orchestration's page on non-struck percussion, LilyPond's percussion list, General MIDI, a notation forum — no engraving manual reached):** there is NO special sign. A scrape is written as A NOTE OF ITS LENGTH: LilyPond and General MIDI both keep two güiros, "short" and "long"; a long scrape is a longer note, a tap a short one, with staccato marks to set the short ones apart; the tool or the word is written out. A down-bow / up-bow sign may show the direction of the stroke, though players usually choose. So his white head with its bar and the word is the convention.
**THE VERTICAL STANDARD — measured, and PUT TO HIM (not changed):** the unpitched staff's bottom line is 6.0 ss above the glockenspiel staff's top line. In that band stand: the dynamic row — the top of the tallest dynamic 2.1 ss under the bottom line (§657) — and now the word row 0.45 under it. Together the two rows are 2.4 ss tall and sit 0.3 ss LOW of the band's centre (2.1 above them, 1.5 below). His eye is right: "generally in the center … but not quite". The glockenspiel's own notes reach 1 ss above its top line (its high C), 0.5 ss from the word row.
**MEASURED:** "no rule yet" — the percussion has one line left (the double at 252.67). `check_rules.js` the old two reds. **NOT LOOKED AT as a picture.**

## §429 · 2026-11-22 · his rule — the percussion's two rows CENTRED between the staves (a measured gate); "rute on rim" looked up and put to him

**His words:** SW-162 (the sketch pad).
**THE VERTICAL STANDARD (his "let's go with your recommendation"; `rules.json column.rows.dynamicLinedBelowSs` 2.1 → 1.8):** the dynamics' row and the words' row 0.45 ss under it are ONE BLOCK, centred in the 6.0 ss between the unpitched staff's bottom line and the pitched staff's top line — 1.8 ss above the block, 1.8 below. Read from the drawn items on the counterpoint's page: all 48 dynamics at −5.29, all 25 words at −7.00. It holds on every page of the piece that draws the lined staff. A NEW MEASURED GATE (`check_rules.js` part (10), 41 checks now): on a lined staff every dynamic on one row, every word on one row, the stack gap between them — green.
**THE SPRING COIL:** left as built (§428) — the rakes white with "scrape", the hits black; his "just essentially leave it".
**"RUTE ON RIM" — WHERE THE BEATER GOES AND WHERE THE PLACE GOES (looked up; nothing built — the word on the page is still "rim"):**
- HIS OWN PIECE 2 HAS A SETTLED ANSWER (`docs/PERCUSSION_STAFF_SCHEMA.md`, the single-stroke and roll idioms): two slots. ABOVE the note head — WHAT YOU STRIKE WITH: a beater picture, or its word (`textInstruction`; piece 2 wrote "rods" there for exactly this beater, on the shime-daiko roll). BELOW the note and its dynamic — the other instruction, in italics (`textBelow`, e.g. "snares on").
- OUTSIDE (one web search; *Extreme Orchestration*'s scoring page, the MusicXML standard, a style guide — Gould's percussion chapter NOT reached): no single rule for the place of "on rim". The advice found: write the instrument and the mallet at each new entrance, above it or at the staff's left, and keep one place throughout. MusicXML keeps the beater and the stick's location as two separate things.
- So the convention, his and the general one, is TWO indications, not one phrase: the beater above, the place with the other instructions. Put to him with one recommendation.
**MEASURED:** `check_rules.js` — the old two reds only. **NOT LOOKED AT as a picture.**

## §430 · 2026-11-22 · his word — "rute" above the note head, "rim" below; the electronics silent in the notation app: the engine is not running

**His words:** "yes, rute above and rim below And the electronics aren't playing anymore in the notation score."
**BUILT (a new object row `objects.beaterWord`; `devices.byTechnique.gran_cassa_rute_on_rim.beaterText`; `layout.js`):** piece 2's two slots. The BEATER's word, "rute", over the note head — italic, the word's size, centred, its baseline the house 0.45 ss above the head; its own kind (`beaterText`), so the lined staff's one word row is not its row. The PLACE, "rim", is the note's word under the dynamics (§428 · §429). Read from the drawn items at 208.84: "rute" at −1.91 over the head at −3; the f at −5.29; "rim" at −7.00. SEEN IN THE NUMBERS, said to him: the bass drum's line is the staff's lowest, so "rute" stands INSIDE the four-line staff, its top 0.13 ss under the brake drums' line.
**THE ELECTRONICS — the fact found first:** the engine is NOT RUNNING. `tools/startup_check.js`: step 1 (Reaper with the rack) ok; step 2 (the engine) missing; no SuperCollider process on the machine. The notation app sends its bricks to the engine; with none up nothing can sound. Nothing in the page's own electronics code was changed today (the box, `elecFrame`). Whether today's MIDI re-opening (§411) or something else ended the engine is NOT known — no evidence either way. His step: `start_electronics.bat`, as `docs/STARTUP.md` has it.
**MEASURED:** `check_rules.js` — the old two reds. **NOT LOOKED AT as a picture.**

## §431 · 2026-11-22 · every percussion note its own dynamic (the six that shared a neighbour's)

**His words:** "At 230.83, there's no dynamic." — and, of the percussion at §427: "Let's give them all individual dynamics."
**THE CAUSE:** §427 dealt the percussion with the other parts' rule that notes within 0.2 s share one mark (§384); six percussion notes drew none — 202.62 · 205.90 · 230.83 · 248.65 · 250.14 · 252.67. That rule was the AI's to carry over; his word for the percussion was "individual".
**DONE (the notation's copy of the save; as it was: `…D-ctptCello.before-431.json`):** each of the six takes a dynamic of its own, different from the notes on either side of it, and is sent at the level of another note of the same sound with that dynamic. 230.83 (the rim) now reads its own mark. The other parts keep the sharing rule. `check_rules.js`: the old two reds. **NOT LOOKED AT as a picture.**

## §432 · 2026-11-22 · the counterpoint is in the score; THE FINAL SECTION's notation opened — his brief taken, the ground surveyed, nothing built

**His words:** SW-163 (the sketch pad).
**THE COUNTERPOINT IN THE SCORE:** the page `s2-ctpt-heads` has been the third page of the draft score since §368 (`notation/ir/index.json` draft.order: s1-sines > s2-piano-solo-final > s2-ctpt-heads); it is now named for what it is — "Section 2 - THE COUNTERPOINT, draft (200 to 253 s)". Eight staves, every part notated by the day's rules.
**THE FINAL SECTION — WHAT IS THERE (read from the notation's copy of the save, 254 … 482 s):** seven parts — flute 669 notes · clarinet 675 · alto sax 678 · glockenspiel 646 · piano 654 · violin 653 · cello 631 — every one a short note (staccato, the glockenspiel's hard shorts, the piano's ordinary note). The written velocity is 109 (f) on about 57 % of them; the rest run 110 … 127 in ramps — the crescendos he remembers. No crescendo OBJECT is in the save: the crescendos are ramps of velocity, to be found by reading the notes. The tempo form is data: `bank/phase_form.json` (the players, the Golomb rulers, the steps — hold · glide — with their bpm; written into the save by `tools/phase_form_render.js`, §214).
**WHAT THE ENGINE ALREADY HAS FOR IT (the tubas' multi-tempo section and after):** the rows `tempoText` · `tick` · `beatBall` · `gcBall`; the page builder's `--beatGrid` (a tick at every unit, the beat every n) · `--beatGridFit` · `--cueLines` (a beat-frame line and its ball) · `--cluster` with its fitted tempo. What it does NOT have: a tempo that CHANGES — the word and the dashed line.
**ACCEL. / DECEL. — not yet verified:** the LilyPond install's own definitions were not found where looked (one attempt). To be done first next session: LilyPond's text spanner for "accel." (its default line style), then Gould.
**NOT BEGUN, and why:** this is a new page builder (the tempo form → each part's tempo marks, ticks and balls; the velocity ramps → the crescendo curves) and it wants the lineage read first — `docs/PHASE_TOOL.md`, `docs/TUPLET_WORKSHOP.md`, the tubas' multi-tempo rows in `docs/NOTATION_STANDARDS.md`, `docs/NOTATION_SCHEME.md`. The session that made the counterpoint is very long; the AI's advice to him is to clear here and start the section fresh (the journal's §2 below is the handoff).

## §433 · 2026-11-22 · THE FINAL SECTION's notation, a FIRST BUILD — the page `s3-phase`: tempo marks, beat lines and balls, accel. / decel., the crescendo curves

**What prompted it:** his brief SW-163 (§432), and his `/postclear go`.
**ACCEL. / DECEL. VERIFIED (his "let's just verify that either in LilyPond or look it up"):** LilyPond 2.24.4, `scm/define-grobs.scm`, `TextSpanner` — `font-shape italic` · `style dashed-line` · `dash-fraction 0.2` × `dash-period 3.0` (a dash 0.6 ss long every 3 ss) · bound padding 0.25 · `direction UP` · the line on the word's baseline. So his memory is right: the word, a dashed line, then the new tempo. Gould was not consulted (no copy at hand); LilyPond's own default is what is built.
**WHAT THE SAVE GIVES (read, not guessed):** every note of the section carries `properties.phaseForm` — `player · hit · step · k`. `hit` is the beat's number in that player's stream; `step` is the notes to the beat (1 a single strike · 2 … 8 · and 1.5 · 2.5 · 3.5 · 4.5 · 5.5 = 3 · 5 · 7 · 9 · 11 notes over TWO beats); `k` the note's place in its group. So the beats are in the save: a hit's first note says its time, and a hit with no first note (the second beat of a two-beat group) lies between its neighbours. 2050 beats, 4606 notes, seven parts. The census of groups: 1 × 723 · 1.5 × 170 · 2 × 220 · 2.5 × 35 · 3 × 148 · 3.5 × 40 · 4 × 143 · 4.5 × 19 · 5 × 129 · 5.5 × 14 · 6 × 75 · 7 × 41 · 8 × 15.
**THE DYNAMICS WERE ALREADY DATA:** `bank/tuplet_chunks.json` `dynamics.marks` (his, 2026-11-19): f · six crescendos f < fff with their two times (291.8 → 302.4 · 339.4 → 342.6 · 353 → 357.5 · 368.6 → 372.6 · 386.6 → 399.8 · 437.1 → 442.2) · "sub. f" after each of the first five · fff held from 442.2 to the end. §432's "ramps of velocity, to be found by reading the notes" was not needed.
**WHAT WAS BUILT:**
- **The engine, one new sign — `tempospan`** (the Switch~ piece's; `rules.json objects.tempoSpan`, `page_rules.json` edge class cut · stub, the timed hairpin's): the word in italics on the tempo mark's row at its size, then the dashed line to 2 ss before the new tempo's moment. The overlay `tempoSpan` {part, span, word}; `layout.js` makes the item, `render.js` draws it. The words' widths measured (`tools/word_widths.py`: accel. 1.96 em · decel. 1.989 em).
- **`notate_section.js --argsFile <file>`** — more arguments from a JSON file: 818 beams and 4606 hands do not fit a Windows command line.
- **`tools/build_s3_page.js`** — the page, with every decision on it. The notes as PLAIN NOTES (`--plainNotes`, *Recombination*'s §547: a black head with a plain stem, its left edge on its moment, no go line, no gestural curve); a staccato keeps its dot. The notes of one hit on one BEAM (`--beam`). Then the overlays: a `beatGrid` of ONE line on every beat (the cue line's mechanism, §651, with the frame's olive — his "olive for when there's an actual tempo", #5 §653), its ball in flight for exactly that beat, so a changing tempo needs nothing new from the ball · a `tempo` mark (the tubas' bar line and ♩ = N in the part's own lane) at every hold of `bank/phase_form.json` whose tempo differs from the part's last · a `tempoSpan` over every glide · a `cresc` curve, full lane, for each crescendo · the dynamic written on each part's first note, on the first note after each curve, and where the fff is reached.
**THE TEMPI ARE MEASURED FROM THE BEATS,** not taken from the form's names: a hold's tempo is 60 × (its beats − 1) / their span, to one decimal (the tubas' printing). The flute: 68.2 → accel. → 93.7 → decel. → 78 → accel. → 78.7 → accel. → 107.1 → decel. → 90 → 110.6 → 90 → accel. → 132.7 → decel. → 120. In all 67 tempo marks, 48 accel. / decel., 42 curves, 49 dynamics.
**THE AI's OWN NUMBERS, his to move (none of them his word):** a change shorter than 2 beats takes the new tempo mark alone (the 0.1 s step into drift 3) · where two glides meet (460.4) the tempo reached is marked and the next word stands 6 ss to its right · the dashed line ends 2 ss before the new tempo's moment · A BEAT'S WRITTEN VALUE: 2 or 3 to the beat one beam (eighths), 4 and more two beams (sixteenths — the lineage's "nothing shorter than a 16th", #5 §528), three over two beats unbeamed.
**NOT DECIDED, put to him:** the tuplets carry NO NUMBER and NO BRACKET (the tuplet notation of Section 3 has been open since 2026-11-20) · the ottava sign stands on every high note by the standing rule, also inside a beamed group · the dashed line runs at the height where the beams are and crosses them in places · the builder reports 142 ink collisions, 42 of them beams of neighbouring parts meeting between the lanes.
**SEEN:** on the throwaway 5601, stills at 278 · 300 · 458 · 476 s — the marks, lines, curves and words are there. Nothing was seen moving (the pane's clock does not run). `check_rules`: 2 red of 41, the two old ones.
**NOT DONE:** the page is not in the draft score's order (his review first) · the pace is the registry's 12 s a page.

## §434 · 2026-11-22 · Section 3's beat marks and ball made THE TUBAS' — his word; the curves' look checked across the pieces

**What prompted it (his words):** "Can you look into the tuba piece and see that the sizes and colors are consistent there? I'm not sure that we used this green and the size of the ball and all that. Just don't change anything just yet." Then, to the report: "Yes, let's use the Tuba's way. Small black ticks. It looks like we just drew the notation over them, which is fine. So you can leave ticks behind everything. And then the magenta ball, same size as the tuba piece, and the connected cursor. And then the green for the curves should be consistent with the curves we used in all the other pieces. So I know there was one of the pieces we missed it, and then we had to go back to it. So just check maybe more of the recent pieces and just make sure that transparency, the border, everything's consistent."
**THE COMPARISON (read in `for_seven_tubas`: `notation/registry/container.json`, `notation/lib/render.js`, `tools/notate_section.js` --trance):**
- the tempo mark — the same drawing and numbers here (bar line 0.13 ss · the quarter head at 0.7 · the text 1.0 ss at 4.4 ss);
- the ball — the tubas': the gestural curve's own ball, `rgb(255, 21, 160)`, 5 px, opacity 0.85, one `gc` device per beat on the part's chunk, its duration the beat. §433 had drawn *Recombination*'s later beat ball (olive, 5 px, opacity 0.3);
- the beat mark — the tubas': a black tick 0.12 × 0.8 ss on the tick row, above the staff. §433 had drawn *Recombination*'s beat frame (an olive band 0.3 ss wide through the staff);
- the green — `#99FF00` in both; the tubas' look is fill 0.22 with no border, the later pieces' is D42's.
**WHY §433 DIFFERED:** the AI took the newest form in the rules (the beat frame, #5 §564 … §653) for "the tubas' multi-tempo notation". Wrong reading: he meant the tubas' own.
**CHANGED (`tools/build_s3_page.js`):** the 2050 `beatGrid` overlays are gone; each beat is a `gc` device (mode `landing`, `preset.duration` the beat) on the chunk that holds its moment — the tubas' mechanism, which this engine carries whole (`layout.js` draws the tick from it, `animobj.js` the ball). The ticks are drawn before the notation, so the notation lies over them — his "leave ticks behind everything". No engine change.
**THE CURVES, CHECKED (the registries read):** piece 4 *Scattered Substance* · piece 5 *Recombination* · piece 6 *Approaching* · this piece all carry ONE look — lime green `#99FF00`, fill 0.3, a 2 px border at full strength, 0.3 on the path (D42), and the meter at the cursor 8 px wide, 3 px from it, fill 0.3, outline 1.5 px at 0.8. This piece's rows point at the same values. The tubas (fill 0.22, no border) are the one piece on the older look. Nothing to change here.
**"THE CONNECTED CURSOR" — the AI's reading:** the level meter that rides the cursor over a crescendo curve (the `cresc` overlay brings it). It is there in the still at 296 s. If he meant something else, his to say.
**THE BALL'S FLIGHT** takes this piece's gestural-curve preset (piece 2's shape, *Approaching*'s DEC-160), not the tubas' own preset; the size and the color are the tubas'.
**SEEN:** one still at 296 s on the throwaway 5601 — black ticks above the staves, magenta balls at the cursor, the green meter beside it. Not seen moving.

## §435 · 2026-11-22 · the beat ball's MOTION made the tubas'; his worry that parts of the first build were made up; the tuplets taken as a brief, not yet built

**His words (the ball):** "Now the ball has some strange jagged upswing. Let's try to get the same sort of motion from the tuba piece. I'm a little worried some of this was just made up by AI. So let's make sure we're conforming to previous decisions, or, you know, check in with me and see that we come up with new decisions or look at the right place."
**THE CAUSE:** §434 gave the ball the tubas' size and color but left its flight on THIS piece's gestural-curve preset (piece 2's shape, taken in *Approaching* — stiffness 50 · damping 80 · ictus 120 · descentRatio 55), squeezed into one beat. The tubas' ball flew on piece 1's Short preset: stiffness 62 · damping 100 · ictus 90 · descentRatio 60 (`for_seven_tubas/notation/registry/container.json` animated.gc.preset).
**THE FIX:** a row, `rules.json objects.gcBall.beatPreset`, with the tubas' four numbers; `tools/build_s3_page.js` writes them on every beat's ball with the beat as the duration. A note's own gestural curve elsewhere in the piece keeps this piece's preset. NOT SEEN MOVING by the AI (its pane's clock does not run) — his eye.
**HIS WORRY, ANSWERED PLAINLY — what in §433 was the AI's own and not a standing decision:** the olive beat frame and pale ball (the newest rule taken instead of the tubas' — undone, §434) · the ball's motion (undone, here) · which groups take one beam or two · "a change shorter than 2 beats takes no word" · the 6 ss stand-off and the 2 ss line end of accel. / decel. · the plain note without a dot for the strings and the glockenspiel. Each was listed in §433 as the AI's; none is a rule until he says so.
**HIS BRIEF FOR THE TUPLETS (verbatim, given while §434 was being built):** "And then the tuplets should not be beamed together. Each rhythmic group should be its own, or each beat should be its own grouping, even if it's the same. And the Ottava can be one bracket over all the ones that have Ottava. And let's use the tuplet. We built those for several pieces. Let's make sure we build the tuplets properly. And just heed the vertical spacing rules. You'll have to make the stem shorter, etc., or move the things above, or, you know, to a different side, I guess. Like a 2-beat grouping could be beat together, so they don't have to be every beat. So if it's like 7 and 2, then it could be two beats together, beamed, 7 beamed together."
**WHAT THE LINEAGE HAS FOR IT (read, nothing built):** the tuplet bracket is piece 4's day-23 standard (`rules.json objects.tuplet` — his LilyPond standard: a flat bracket, hooks toward the notes, the numeral in the gap) and it is drawn only for a CLUSTER (`figures.cluster`: the members on one grid, each device carrying `tupletGroup · tupletNum · tupletDen · tupletStartPos · tupletSlot`); the `--beam` path §433 used cannot carry one. The cluster's group pass already places a group's ottava past the beam, the bracket and the dynamics (`layout.js` g.ottBeam, #5 §527) — per note, not yet as ONE bracket over the group. The engine's default numeral is the ratio (3:2), from the pattern analyser.
**NOT BUILT — put to him first:** what the numeral says (3 or 3:2) · how a group of eight to the beat is written · whether three over two beats takes a bracket on unbeamed quarters.

## §436 · 2026-11-22 · Section 3: the tuplet's number DECIDED (his); the vertical order and bar lines put to him — nothing built

**His words:** SW-164 (the sketch pad), whole.
**DECIDED BY HIM:** the number is PLAIN for a group inside one beat (5 sixteenths in the space of 4 = "5"); a group over TWO beats takes the RATIO (3 quarters in the space of 2 = "3:2", and so on); NO BRACKET — the number alone, centered over the group. Each beat its own beam; a two-beat group one beam. One ottava bracket over the notes of a group that take it.
**THE VERTICAL ORDER — what the standing rules give (read, for the discussion):** the column's order outward from a note is dot · accent · dynamic · ottava · word, each the house gap 0.45 ss from the one inside it, none inside the staff (§380, `column.order`) · a flag or a beam stands 2 ss clear of the staff (§378, `objects.flag.staff`) · on the beam side of a group the ottava's hook sits the house gap past everything the group keeps there — beam, accent row, tuplet bracket, dynamics (#5 §527) · the tempo mark sits on ONE fixed row, 4.4 ss above the middle line (the tubas', `barLine.tempoYSs`). WHERE THEY COLLIDE: the fixed tempo row (and §433's dashed line on it) is at the height where a stems-up beam stands (4 ss and more). The tubas never met this: their in-tempo notes were single stemmed notes, no beams above the staff. No rule says who yields.
**THE AI's RECOMMENDATION, put to him:** above the staff, outward — the beam · the tuplet's number · the ottava bracket · then the tempo row (the mark, accel. / decel. and its line) on top of all, at one height for the whole lane; below the staff — the dynamics. Stems go DOWN where a group is high, so the beam side is free where it can be.
**BAR LINES — the analysis put to him:** each part runs at its own tempo, so bar lines would be per part and would not line up down the score; a meter would have to be chosen for music made as a stream of beats; a time signature is new ink in seven parts. What he wants from them is fewer accidentals. Counted on the page: 1532 of the 4606 notes carry a sharp or a flat; 573 of those repeat a note already marked inside its own beamed group. The AI's recommendation: NO bar lines; an accidental holds for its beamed group (one beat, or the two-beat group) and is written again in the next — the common convention of unmetered scores, said once in the performance notes. That removes those 573 with nothing new on the page.
**NOT BUILT:** the tuplets (they need the cluster figure — §435), the group ottava, the vertical order. All wait on his word on the order.

## §437 · 2026-11-22 · two of the AI's own choices on Section 3 settled by him — the short tempo change, the staccato dot

**His words (verbatim, quoting the AI's list of its own choices):** "no accel. / decel. word on a change shorter than 2 beats this is fine; no staccato dot on the strings and the glockenspiel — yes on strings no on glock".
**DECIDED:** a tempo change shorter than 2 beats takes the new tempo mark alone (`objects.tempoSpan.minBeats` 2 is now his) · the violin's and the cello's notes of Section 3 carry the staccato dot; the glockenspiel's do not. The piano's were not named and stay without.
**BUILT:** `tools/build_s3_page.js` DOT_PARTS (the violin and the cello) — a hand `nhDot` with the staccato unit's own gap on each of their notes; the page rebuilt. Not looked at by the AI.
**STILL WAITING ON HIM (§436):** the vertical order above the staff · bar lines or the accidental that holds for its group.

## §438 · 2026-11-22 · Section 3: the tuplets' numbers, one ottava bracket over a run, the accidental that holds for its group, the tempo row on top, the dynamics on a curve's two ends — BUILT

**His words (verbatim), in the order given:** to §436's question — "yes on the order, no bar lines, accidentals per group" · "piano yes stacatto dot" · "f at the beginning and fff at the end fo the curves centered on the start/end time".
**DECIDED BY HIM:** above the staff, outward — the beam · the tuplet's number · the ottava bracket · the tempo row on top of everything, one height for the lane; below — the dynamics · NO BAR LINES · an accidental holds for its beamed group and is written again in the next · the piano's notes carry the staccato dot · each crescendo curve has f centered on its start and fff centered on its end.
**BUILT — the engine (each a small addition to what stands):**
- THE NUMBER WITHOUT A BRACKET (`rules.json objects.tuplet.look.bracket` false): the group pass sets the number's foot the house gap (0.45 ss) past the beam; the renderer leaves the bracket out and centers the number from the group's first head to its last.
- A GROUP WITH NO BEAM (a hand `groupNoBeam`): three quarters over two beats — the stems and the number, no beam.
- ONE OTTAVA BRACKET OVER A RUN: the notes of a group that stand next to each other with the same sign on the same side share one bracket — the first note's sign, the last note's hook, at the height of the one furthest from the staff. On the beam side the bracket now clears the group's number too.
- THE ACCIDENTAL A HAND MAY DROP OR FORCE (`noAcc` · `accForce: natural`).
- THE TEMPO ROW AT A PAGE'S OWN HEIGHT (`layoutPolicy.tempoRowSs`; `objects.tempoSpan.rowSs` 6.6 — the AI's number) for the tempo mark and accel. / decel. with its line.
- A DYNAMIC CENTERED ON A TIME (the overlay `dynAt`), on the house dynamic row.
**BUILT — the page (`tools/build_s3_page.js`):** each group is now a CLUSTER of its own (piece 4's figure, the one that carries a tuplet) on a grid of sixteenths, 4 to the beat or 8 over two beats. The number: plain inside a beat (3 · 5 · 6 · 7), the ratio over two beats (3:2 · 5:4 · 7:4 · 9:8 · 11:8); 2, 4 and 8 to the beat take none. THE WRITTEN VALUES (the AI's, from ordinary practice, his to move): 2 or 3 to the beat eighths · 4 to 7 sixteenths · 8 thirty-seconds (three beams) · over two beats: 3 quarters, 5 and 7 eighths, 9 and 11 sixteenths. 988 groups, 658 with a number. Accidentals: 569 left out (the sign already in the group), 25 naturals written (a note taking a sign back inside its group).
**SEEN (stills on the throwaway 5601 at 291 · 296 · 320 · 325 s):** the numbers stand alone, on the beam side; the single ottava bracket over a run; f centered on the curve's start; the tempo row above the stacks.
**WHAT STILL COLLIDES — put to him, none settled by the AI:**
1. A BEAM THAT STANDS HIGH meets the tempo row (the clarinet at 325.2, the sax at 325.2: "= 83.3" and "= 75" on a beam). The row is at 6.6 ss; a stems-up group whose top note is high puts its beam there. No rule says the stem shortens for it; his "you'll have to make the stem shorter" names the direction, the measure is not set.
2. A DYNAMIC CENTERED ON A CURVE'S START lands on a low note's 8vb sign (the clarinet at 291.8; `check_rules` (10) names one: part 1 at 372.94).
3. INSIDE ONE GROUP some notes take 8va and a higher neighbour does not (the flute at 292: two brackets with a note at pitch between). The ottava is decided per note today.
**`check_rules`:** 3 red of 41 — the two old ones and the dynamic × ottava clash of point 2.

## §439 · 2026-11-22 · the rests at 300 s on the Section 3 page — what they are

**His question:** "At 300, second 300, there's a bunch of rests. Can you tell me what those rests are? Is that something just because I changed tempos or something at that point?"
**READ FROM THE SAVE:** 185 of the section's 1049 groups are INCOMPLETE — a group's `step` says how many notes go to the beat, and the save holds fewer. At 300.5 … 300.9 s: the glockenspiel 4 of 8 · the clarinet 4 of 7 · the flute 2 of 6 · the piano 2 of 8 · the cello 1 of 6. It is where the first tuplet stretch ends (the drift ends at 301.66): the tuplet render stopped each player's last group at the stretch's end time, in mid-beat. By 20 s: 280 → 4 · 300 → 26 · 320 → 35 · 340 → 8 · 360 → 23 · 380 → 17 · 400 → 15 · 420 → 40 · 440 → 12 · 460 → 5.
**WHY RESTS:** §438 made each group a cluster (piece 4's figure). That figure writes a rest in every empty place of its grid — its standing rule (#4 day 23 · D62). So an incomplete group shows its missing notes as rests inside the tuplet. Not a tempo matter; the rests say what sounds: a few fast notes, then silence to the next beat.
**NOT CHANGED.** Put to him: keep them (true to the sound), or leave them out and let the next beat's tick say where the beat is.

## §440 · 2026-11-22 · "keep the rests" — his; the flute at 304.97: a plain group that stops early had no closing rest — mended

**His words:** "keep the rests Then explain to me in the flute at 304.97, there's three partials, but no either rests or tuplet."
**DECIDED:** the rests of an incomplete group stay (§439).
**THE FLUTE AT 304.97, READ FROM THE SAVE:** a group of FOUR to the beat (four sixteenths — no number, by his rule: 2, 4 and 8 take none) that holds THREE notes (304.969 · 305.174 · 305.379); the fourth is not in the save. So no tuplet is right. The missing rest was the AI's fault in §438: the cluster figure writes rests BETWEEN its notes by itself, and a tuplet's empty places too, but a plain group's empty END only when told (`restAfter`, #5 §458) — and the builder did not tell it.
**MENDED (`tools/build_s3_page.js`):** a plain group that stops early carries `restAfter` on its last note — the rest of the beat written as a rest. 27 groups. Seen once on the throwaway: the flute's three sixteenths at 304.97 end in a sixteenth rest.
**NOT TOUCHED, said to him:** a group of which ONE note is left (the cello at 300.89, 1 of 6) is drawn as a single note with no rest.

## §441 · 2026-11-22 · the bracket stays on a group with no beam — his

**His words:** "or quarter notes should the tuplet number be on the note head side? Just give me a valuation, or stay on the stem side. They seem less visible when there's not a beam." Then: "yes, bracket on the unbeamed groups".
**THE AI's VALUATION (given, he agreed):** stay on the stem side — the head side holds the dots, the accidentals, the dynamics and the ottava signs, the heads stand at different heights, and every other group's number is on the stem side. What makes the number weak is not the side but the missing bracket: a beam ties its notes, three loose quarters have nothing. So: the bracket only where there is no beam — ordinary practice; LilyPond names the setting (`bracket-visibility` `if-no-beam`; checked that the name exists in 2.24.4, not that it is the default).
**BUILT:** `layout.js` — a group with no beam keeps the standard bracket (the stack's standard line, the number in its gap); every beamed group keeps the number alone. The 170 groups of three quarters over two beats. `rules.json objects.tuplet.bracketRef` says it. The page rebuilt; NOT looked at by the AI.

## §442 · 2026-11-22 · Section 3's vertical rules from his eye on the page — the number on the beam side, the ottava clear of the ticks and joined over a run, the tempo row raised, beams over the rests

**His words (verbatim), with his pictures of the page:**
- at 351.7 (a 9:8 standing above, beside the 8va, its beam below): "351.7 9:8 to beam side?"
- to the AI's answer ("number always on the beam side, stems down to 2.5?"): "on the beam side, stems down to 2.5? yes"
- with two pictures of ottava brackets among the beat ticks: "part of a clearance should be, when possible, from the bottom edge of the bracket and the top edge of the 8. So if you draw a tight bounding box around the 8VA and enclose the bracket as well. And then we should include the dashes, the beat dashes, in the clearance regime. So you can see those two [ottavas], and even the last one there, all should be raised up. And of course, this is when possible." · "366.33 single Ottawa, please. That one got missed, I think."
- at 372.48: "Is there room to clear the [accel.] and dotted line? Move it up so it doesn't intersect the F. And the last two partials there can be a single Ottawa."
- "And extend the beams over the rest, please. And shift the tuplet number so it's centered on the full tuplet."
**WHY THE 9:8 STOOD ABOVE:** piece 4's wide-register repair (day 31) — when the beam side has no room inside the lane, a row flips to the head side. Here that put the number beside the 8va.
**BUILT (all in `layout.js`; the page says which apply — `layoutPolicy` written by `tools/build_s3_page.js`):**
- THE NUMBER ALWAYS ON THE BEAM SIDE (`tupletBeamSide`): the side is dictated, so the repair cannot flip it. The stems shorten by the lineage's own floor — `beamStemSs` 2.5, already in the engine since piece 4 — and no further; past that the number may run over the lane's edge.
- A BEAM ABOVE THE STAFF STAYS UNDER THE TEMPO ROW: with its number it is held the house gap under the row; the stems shorten for it, to the same floor.
- THE TEMPO ROW RAISED: `objects.tempoSpan.rowSs` 6.6 → 7.25, so the dashed line clears a dynamic standing over a note above the staff (the f at 372.48). The lane's top is at about 8 ss on this page (read from his picture).
- THE OTTAVA CLEARS THE BEAT TICKS: on a part that carries ticks, an ottava above the staff has its lowest ink (the hook's end, the sign's foot) the house gap above the ticks' top — the ticks are ink in the stack. Applied to every such ottava of the part, so they stand at one height (the AI's simplification of his "when possible": not only those a tick stands under).
- ONE BRACKET OVER A RUN OF THE PART'S NOTES (`ottavaRuns`): notes that follow each other with the same sign on the same side share one bracket whatever group each is in; a run ends at a note without the sign, and at a silence over 1.5 s (the AI's number). This replaces §438's run inside one group for this page.
- THE BEAM OVER THE RESTS: a group that stops early carries the lineage's `beamOverRest` (#4 day 29) — the beam runs on over its closing rests.
- THE NUMBER CENTERED ON THE FULL TUPLET: to the tuplet's last place, its rests included.
**SEEN (stills on the throwaway 5601 at 350.5 · 365 · 371 · 303.5 s):** the 9:8 under its beam; one 8va over the flute's three groups at 366; the accel. line above the f at 372.5; the beams over the rests and the numbers centered over notes and rests.
**NOT DONE, said to him:** a bracket that runs past a page's edge is drawn on the page that owns its start only — the edge rule for a long ottava is not built · his "tight bounding box" clearance is applied against the ticks; the bracket against its own notes keeps the standing rule (the hook's end the house gap above the note's ink).

## §443 · 2026-11-22 · his word on the ottava at 456.1 — two notes of different pitch share one bracket

**His words (given while §442 was being built):** "The two partials starting at 456.1, they can just share one ottava, even though it's a different pitch."
**THE AI's READING:** §442's run already joins neighbours with the SAME sign whatever their pitch; his page showed the build before it. Looked once at 455 … 460 s on the throwaway: the same-sign neighbours share a bracket. WHAT IS STILL NOT JOINED: a note under 8va next to a note under 15ma (the cello and the piano at 455.3 … 456) — two different signs; one bracket there means writing one of the two notes in another octave. Put to him; nothing built.

## §444 · 2026-11-22 · the ottava's last two rules on Section 3 — one sign for a run of mixed signs; a lone note inside a group at pitch

**His words (verbatim):** on the bunched little brackets at 458.6 — "Same with for partial starting at 458.66. Five. Yeah, four of them. Well, actually, sorry. No, actually, when it's just single pitches like that, how do we handle that? Should it be... Well, then that's a lot to redo. They mostly look okay when they're isolated like that, but when they're bunched up, like at 458.6, let me get your recommendation. Should we raise those ones up or maybe get rid of the bracket? What's the convention there? Probably get rid of the bracket, right? Because it's ambiguous, which notes the things belong to, or even just dispense with [the ottava] on those cases and just write them without it." · to the AI's two recommendations: "put both under the 15ma, so the lower note moves down into the staff and no note gains ledger lines. ok" · "My recommendation: drop the ottava in those bunched cases and write the notes at pitch, with ledger lines. good".
**THE AI's RECOMMENDATION, as given (the convention from memory, not looked up):** an ottava sign is for a stretch, not for single notes inside a fast group; the sign without its bracket is ambiguous there; players read four or five ledger lines more easily than a contour that jumps in and out of 8va. So: a run keeps one bracket · a lone note inside a group goes to pitch · a single note standing by itself keeps its small bracket (his "they mostly look okay when they're isolated").
**BUILT (`layout.js`, a pass before the part's notes are drawn, on a page that says `layoutPolicy.ottavaRuns`):** each note's own sign is worked out first; then (1) a run of neighbours whose signs differ on the same side is written whole under the LARGER sign — the 8va notes beside a 15ma note move down an octave on the page; (2) a run of ONE note inside a beamed group is written at pitch, when that needs no more than 5 ledger lines (`objects.ottava.loneMaxLedgers`, the AI's number). §442's pass then joins each run under one bracket.
**SEEN (one look, 455 … 460 s on the throwaway):** the cello's 455.3 … 456 under one 15ma; the flute's and the violin's lone high notes at pitch with their ledger lines, the little brackets gone. The cello keeps several small brackets later in the passage — lone notes that would need more than 5 ledger lines in the bass clef.
**NOT DONE:** the list of the lone notes that kept their sign (over 5 ledger lines) — not produced; the cello's high passage may want another clef, his to say.

## §445 · 2026-11-22 · the cello of Section 3 in treble clef — a TRY, at his word; what the count says

**His words:** "cello notes where?" (to §444's remark on the cello's leftover brackets) · then "yes, try the cello in treble clef".
**WHERE (a count outside the engine, a note or two of slack):** 25 lone notes needing 6 or 7 ledger lines in bass clef, spread through the whole section (305.93 … 456.99). The larger fact: 317 of the cello's 631 notes of the section need an ottava sign in bass clef (30 of them 15ma) — the part lies half above the bass staff. Its range here is C2 … B5.
**BUILT:** a page may write a one-staff part in another clef — `layoutPolicy.clefs` (`layout.js`, where a part's staves are made); `tools/build_s3_page.js` CLEFS says the cello in treble. Seen on the throwaway at 455 and 320 s: the treble clef stands, the high notes lie on the staff.
**WHAT THE COUNT SAYS (notes needing a sign, of 631):** bass clef 317, all above · treble clef 181, all BELOW (8vb and 15mb under the low notes) · tenor clef 181 (141 above, 40 below). With a clef change every time a note leaves its clef: no sign at all, but 117 changes. The part leaps between its registers note by note (the octave scatter), so no one clef holds it.
**NOT DECIDED.** Put to him.

## §446 · 2026-11-22 · the cello stays in bass clef — his; the piano at 373.4 (a group on both staves) mended in part

**His words:** with a picture of the piano at 373.4 — "Something happened, I think, with the piano in 373.4." · on the clef — "Okay, let's skip the clef. We'll just stay in the bass clef and use Ottawa and try to get it so that if there's a string of Ottawas, they cover all the notes that have it. I don't want to get too hung up on this. I think we've already spent enough time. Just make sure things don't collide and just leave the Ottawas as they are. This is not a crucial aspect. It's just got to look legible, and I don't want to spend any more time than we need to now."
**DECIDED:** the cello in BASS clef; the ottava rules as built (§442 · §444) stand — a run of signs is one bracket over all its notes; no more work on the ottava. The treble try of §445 is undone (`tools/build_s3_page.js` CLEFS empty; the engine's `layoutPolicy.clefs` stays, unused).
**THE PIANO AT 373.4 — WHAT IT WAS:** a group of three quarters over two beats (3:2, no beam) with notes on BOTH staves. The lineage lays such a group out whole on the top staff, every stem up to one level (#5 §463). With no beam, that level fell INSIDE the treble staff — the stems of the bass notes stopped in the staff and the bracket ran through it.
**MENDED IN PART (`layout.js`):** a group on both staves has its level above the top staff by the flag's clearance, whatever its notes (the lineage's "above the treble", now also where there is no beam). Seen once at 372.6 s: the stems reach above the treble staff, the bracket is over it.
**WHAT IS LEFT, PARKED (`docs/SWEEP_LIST.md`):** where such a group's top note is very high, the level and the bracket reach the staff of the part above (at 373.4 the glockenspiel's). An unbeamed group need not level its stems at all; that rule is not built.

## §447 · 2026-11-22 · a collision detector for a page — `tools/collide_list.js`; Section 3 measured: 98 between parts, 86 of them the glockenspiel against the piano

**His words:** "Seems like lots of collisions between piano and Glock. Can you review and revise and recommend? And can you just do an overall review? I don't know how much access you have to, or how, if you can, if you're able to analyze whether things are colliding vertically or not. If we can try to do that, so I don't have to. It's not up to me to catch every collision. I don't know if you can detect collisions somehow and find some ways to resolve them if possible."
**BUILT — `node tools/collide_list.js <page>`:** the page is laid out in node exactly as the rules check lays it out; every item's ink box is taken (`fit.js inkOf`, plus the kinds it does not know: the beam, the tuplet's number, the tempo mark, accel. / decel., the joined ottava); each staff is set at its height on the page (`fit.js boxesFor`); every pair of boxes from two DIFFERENT parts overlapping by more than 0.15 ss both ways is a collision. It lists by pair of parts, by what meets what, by time, and prints the lanes. It measures; it changes nothing. LIMITS: between parts only (ink of one part against itself is the rules check's part (10) and the fit ladder); the boxes are rectangles (a beam's box is its whole span); curves, go lines, ticks and bar lines are left out.
**SECTION 3 MEASURED (19081 boxes):** 98 collisions — 86 glockenspiel / piano · 6 piano / violin · 3 violin / cello · 2 flute / clarinet · 1 clarinet / sax. The twelve outside the first pair are listed by the tool with their times (298.09 … 452.39 s), each under 1.3 ss deep.
**THE CAUSE OF THE 86, READ FROM THE LANES:** every wind and string has 7.9 ss above its middle line and 7.9 below. The glockenspiel has 5.0 above and 3.4 below — 1.4 ss under its staff — because it shares ONE lane with the unpitched percussion staff (the joined mallets lane, #5 §332), and that staff holds NO NOTE in this section yet takes 10.4 ss. Under the glockenspiel stands the piano's treble staff with its tempo row at 7.25.
**TRIED AND UNDONE:** leaving part 3 out of the page's parts (`--parts`) — the app frames every part of the ensemble whatever the page holds; nothing moved. The lanes are the realization's (`coords.js`, weights and the joined group), not the page's.
**THE AI's RECOMMENDATION, put to him, NOT built:** a page may leave an EMPTY member of a joined lane out — on this page the unpitched percussion staff — so the glockenspiel has the lane whole, as tall as the others.

## §448 · 2026-11-22 · the page without the empty percussion staff — 98 collisions between parts down to 7; the accidental's rule said back to him

**His words:** on the accidentals, with two pictures (a 3:2 of three notes under one sharp; a 5 and a 7:4 each under one sharp) — "We have to work out how to consistently apply the one accidental per rhythmic grouping, because I guess if I tell them in the instructions that that's the way it is, and that you know, has to be applied consistently. So here, I guess I'm not sure what's going on there. Do we need the naturals on the two middle ones? And then the next one here, are those all C sharps?" · then "yes, build the page without the empty percussion staff".
**THE ACCIDENTAL'S RULE, AS BUILT AND SAID TO HIM (§438):** a sign holds to the end of its beamed or bracketed group, at its own octave, and no further; the next group writes it again; a note that takes the sign back inside its group writes a natural (25 in the section). So his three notes under 3:2 are all C♯ and no natural is wanted; the 5 and the 7:4 are all C♯. One rule in the builder for every group. FOR THE PERFORMANCE NOTES: "An accidental holds for its beamed or bracketed group, at its own octave, and no further."
**BUILT:** a page may leave a part out of its frame — `layoutPolicy.omitParts`. `layout.js ensembleForPage(ens, ir)` takes the part from the ensemble's parts and groups; a joined group left with one part is an ordinary lane. The app makes each page's frame from the whole ensemble at the page's load (`notation.html applyPageFrame`), so the other pages keep the percussion staff. `tools/build_s3_page.js` OMIT_PARTS [3]; `tools/collide_list.js` reads the page's frame.
**MEASURED AFTER:** the glockenspiel's lane 8.1 · 8.1 ss, as every wind and string (it was 5.0 · 3.4). Collisions between parts: 98 → 7 — glockenspiel / piano 5 · piano / violin 1 (298.09) · clarinet / sax 1 (395.75). Seen once in the app at 372.6 s: no percussion staff, the glockenspiel in a lane of its own.
**NOT DONE:** print and the exported film do not read the page's frame yet · the seven left are listed by the tool, not mended.

## §449 · 2026-11-22 · the piano on Section 3's page — a quarter group on both staves as notes with their own stems; its ottava ALWAYS

**His words (verbatim):** with a picture of the piano at 373.41 — "at 373.41. You can just have regular stems for the first two partials, just normal size staying in the base clef. And you can do stem down on the last partial and put an Ottava there. And that'll bring the brackets down." · then — "So in the piano, the ottavas are being applied inconsistently. I think the main thing to do is to apply them consistently. So either we never use them or we always use them. I think it looks like, let's try to always use them, whatever the standard rule is, 3 ledger lines or whatever it is."
**BUILT, the group on both staves:** the piano's three quarters over two beats with notes on BOTH staves are no longer one cross-staff figure (§446's parked fault, now mended). Each note is a single note — its own stem at the standard length in its own staff, its own direction, its own ottava — and the standard bracket stands over the part's top staff (a new overlay, `tupletMark`; `layout.js`): its padding above the highest ink of that staff inside its span, never inside the staff; an ottava inside the span stands above the bracket (his order: the number, then the ottava). Five such groups in the section (`tools/build_s3_page.js` LOOSE). The accidental's rule holds for them as for any group.
**BUILT, the piano's ottava:** `layoutPolicy.ottavaAlways` names the piano — every note past the threshold (three ledger lines, the standing rule) takes the sign; §444's lone note at pitch does not apply to it. Runs still share one bracket. The other parts keep §444's rule (his "good" there); he said "in the piano".
**MEASURED (`tools/collide_list.js`):** 2 collisions between parts left on the page — piano / violin at 298.09 (two ottava brackets, 0.82 ss) · clarinet / sax at 395.75 (the dashed tempo line and a tuplet's number, 0.24 ss).
**SEEN:** 372.6 s — the two bass notes with their own stems in the bass staff, the high note stem down under its 8va, the bracket over the treble staff under the dashed line; 455 s — the piano's high notes under their signs.

## §450 · 2026-11-22 · the lone ottava — he had not meant a rule across the board; the crowded ones counted

**His words (verbatim):** "I think I misunderstood this rule. And it's hard to think about these things in terms of hard rules. So let's talk a little bit about this. Again, I don't want to spend too much time on this. Let's talk a little bit about this. What should be done? Why did we revert to having individual? I don't think all the individual ones should not have [ottavas]. I just think in those fast passages, it became hard to cram those in when one has an [ottava] and then the next one doesn't, and the next one, especially when it's a fast rhythm, if it's like every other one. So I think I was mostly just trying to address that one. And I wanted to consider a variety of solutions, including losing the bracket maybe, and I wanted to see what was common practice there. Or the other alternative was to keep certain ones just without the [ottava]. But I didn't realize we were applying it as a rule across the board. I think we should go back to the standard rule of, you know, when to have an [ottava] and when not to. And then, I don't know how we're going to identify those problematic areas where every other one alternates or something like that. But I don't think, and only at like the faster rhythms, I don't think there's that many, but let's see if we can identify those ones. And then just address those problematic areas that are faster rhythms with alternating notes, where it's confusing which notes the [ottava] applies to. So in other words, try to find where the horizontal space between notes isn't enough to accommodate the [ottava] symbol and the bracket, and then. If there's precedent for it, we should consider in those cases maybe just using the [ottava] symbol, but rather closer to the note head, like vertically closer, but also more centered on the actual note head it applies to without the bracket. Or alternatively, we can just, put it up so many ledger lines."
**THE AI's FAULT, named:** §444 turned his question about ONE kind of place (fast groups where the sign alternates note by note) into a rule for every lone note inside any group. He had asked for a recommendation on those places; the AI's "rule I would build" read wider than he meant, and his "good" was to the narrower thing.
**COUNTED (a one-off, the page laid out in node with the STANDARD rule on every part):** 111 joined brackets (runs) · 244 single-note brackets · of those, 73 have NO ROOM beside a neighbour (the sign reaches back over the note before it, or the next note's sign runs into this bracket): piano 28 · alto sax 11 · clarinet 9 · violin 9 · flute 8 · cello 8; in 320 … 340 s (14), 380 … 420 s (41), 440 … 460 s (16). His guess holds: not many, and in the fast stretches.
**PUT TO HIM, nothing built:** the standard rule on every part, every note; ONLY the 73 crowded ones treated — the AI's recommendation: written at pitch with ledger lines where that needs no more than five, else the sign alone, small, centered close over its head (the sign without a line over a single note is seen in published scores; not looked up).

## §451 · 2026-11-22 · the ottava back on the STANDARD rule; only the crowded single signs treated — his rule, built

**His words (verbatim), to §450's recommendation:** "write the note at pitch with ledger lines, where that takes five lines or fewer — Okay, good. But this rule, instead of that, let's just make sure it's not colliding. That's the main criteria. I think 5 lines or fewer is fine, but even fewer where it collides vertically with the part above it or below. So in other words, let's apply this rule except where there's a vertical collision, and then let's have that fallback with the [ottava] symbol alone. So I could close over its [note] head, no bracket, and then like a smaller vertical gap between the [note] head and the symbol itself."
**DECIDED BY HIM:** the standard rule on every part and every note (past three ledger lines, the sign); a run shares one bracket. ONLY a single-note sign with no room beside its neighbour is treated: at pitch with its ledger lines, five or fewer, and only where that meets no other part; otherwise the sign alone — no bracket, centered on its head, a smaller gap.
**BUILT:** `layout.js` — §444's lone-note rule and §449's "always" for the piano are GONE (`layoutPolicy.ottavaAlways` no longer read); the pass before the notes now works out, for a single-note sign, whether the note before it stands closer than the least bracket with its sign (`objects.ottava.crowdSlackSs`): if so, at pitch (up to `loneMaxLedgers` 5) or the sign alone (`octBare`). The item carries `bare`; `render.js` draws the sign centered on the head, no dashes, no hook; its near edge 0.3 ss from the note's ink (`objects.ottava.bareGapSs`; the bracket's own is 0.45 + the hook). RUNS ARE NOW COUNTED WITHIN A STAFF — on the piano, bass notes are neighbours though treble notes sound between them (both passes). THE VERTICAL COLLISION: `tools/collide_list.js --json` names the at-pitch heads (past three ledger lines) that meet another part's ink; `tools/build_s3_page.js` gives those the sign alone (`notation/hand/s3-phase.bare.json`) and builds once more. On this page it named NONE.
**MEASURED:** 117 brackets over a run · 165 single-note brackets · 15 notes with the sign alone (those needing more than five ledger lines: piano 5 · violin 4 · cello 6) · about 50 crowded notes at pitch. Collisions between parts: 2 (298.09 piano / violin, two ottava brackets · 395.75 clarinet / sax, the dashed tempo line and a number).
**SEEN:** one still at 405.6 s before the per-staff correction — the sign alone over and under piano notes, drawn as meant. Not looked at after it.
**THE AI's NUMBERS, his to move:** the gap of the sign alone 0.3 ss · the slack in "no room" 0.3 ss.

## §452 · 2026-11-22 · the demo recording — a plan drafted at his word (PLAN § 2r), his go pending

**His words:** SW-165 (the sketch pad), whole.
**WHAT STANDS ALREADY (read, not scanned):** `tools/export_midi.js` (the save as MIDI, a file per track, 60 BPM · 960 PPQ) and `tools/render_reaper.js` (a COPY of the rack opened in a new tab, each file on the track of its name, the render — the rack never written); the bridge (`tools/reaper_job.js`); the level tools of the composing (`part_meter.js` · `section_card.js` · `section_parity.js`). The rack holds several techniques of one instrument in ONE sampler (its parts on their own channels, no keyswitch — §143), so a technique has no track of its own there.
**THE AI's ONE CHANGE TO HIS IDEA, and why:** STEMS. A technique per sampler track means rebuilding the rack by hand; playing each technique alone through the rack as it is and recording it gives the same tracks — one per technique, a bus per instrument — as AUDIO, with the rack untouched and the faders working on sound. A note that is off: its MIDI changed and that one stem rendered again.
**THE PLAN:** seven steps, `docs/PLAN.md` § 2r — the MIDI per technique · the recording project · the stems · the electronics' four lanes · the first balance by measurement · his mix · the bounce.
**NOT KNOWN, said to him:** the stems' render time · whether the sine tones can be recorded lane by lane without him.

## §453 · 2026-11-22 · the demo recording — his go; parity by the dynamic mark worked into the plan; the capture started

**His words:** SW-166 (the sketch pad), whole.
**HOW PARITY BY THE DYNAMIC MARK IS MET WITHOUT NUDGING:** a fader acts on a whole stem, and a technique's stem holds notes at several written dynamics — so the stems are cut finer: ONE STEM PER TECHNIQUE PER WRITTEN DYNAMIC. Then "p alike across the techniques" is one fader per stem, set from a measurement. A shaped long note (its dynamic a curve) is a stem of its own.
**THE MEASURE, DECIDED (he left it to the AI: "LUFS or actual RMS or whatever … let's decide what's going to be the best"):** K-weighted loudness, the loudest 400 ms of each note, the stem's middle value. Why: it is the measure he already chose for the counterpoint's parity (§152 — "the card's loudest 400 ms"), it weighs frequencies as the ear does (RMS does not), and it reads a short strike and a long tone alike; a whole-file LUFS would mostly measure a stem's silence. The target for a dynamic: the middle of the stems at that dynamic; within 1.5 dB a stem is left alone (his "within a reasonable margin").
**WHAT STANDS FOR STEP 1 (read):** `tools/capture_composer_midi.js` plays the composer's own page headless under a virtual clock and records every MIDI message, with `expect.notes` (each note's id, port, channel, pitch, time); `tools/export_midi.js` lays a capture out by the rack's tracks and checks it by those ids. So a note-on can be given to its note of the save, and from the save come its technique and its written dynamic.
**STARTED:** the capture of `piece-FirstDraft-Final-D-ctptCello` (the whole piece with his cello take and his removals of the day — WHICH SAVE IS THE RECORDING'S is put to him) → `midi/piece-FirstDraft-Final-D-ctptCello.capture.json`; the log `probes/capture_demo.log`.
**THE PLAN:** `docs/PLAN.md` § 2r, step 1 written out.

## §454 · 2026-11-22 · the demo recording — the players above the electronics, section by section: the AI's recommendation, in the plan

**His words:** SW-167 (the sketch pad), whole.
**THE RECOMMENDATION (he asked for it: "I'll take your recommendations on this"), written into PLAN § 2r step 5:** three layers, each one kind of control, so nothing is nudged note by note.
- (a) THE STEM FADERS — parity by the written dynamic across the techniques, piece-wide, set once from the measurement (§453).
- (b) ONE LEVEL LINE ON THE INSTRUMENTS' BUS — a step per section, moving all the players together: the section's LOWEST written dynamic 3 dB above the electronics' usual level in that section. "Usual" = the level the electronics are at or under three quarters of the time there (short-term loudness), NOT their peaks: at the top of a swell nothing soft stands above them, and the swells are composed (his crescendos were set against them, SW-66 … SW-67).
- (c) THE MASTER FADER.
**WHY THE PLAYERS MOVE AND NOT THE ELECTRONICS:** the electronics' own rises and falls are his; a step on the players' bus keeps every relation among the players (the parity of layer a) and every relation inside the electronics.
**WHY SECTIONS AND NOT A CONTINUOUS FOLLOW:** a line that followed the electronics moment by moment would flatten the very swells the players' crescendos answer. A step per section — cut finer only where the measurement shows the electronics differing much inside one.
**THE AI's NUMBERS, his to move:** the margin 3 dB · the three-quarters level. NOTHING BUILT of it yet; step 1 (the capture, then the cut into stems) is in hand.

## §455 · 2026-11-22 · the demo recording — step 1 done: the whole piece captured and cut into 120 stems

**Prompted by:** his `/postclear go` on the checkpoint (PLAN § 2r step 1); then his question "Is a capture meant to be happening in Reaper? Because I don't see any activity in Reaper."
**THE CAPTURE:** `node tools/capture_composer_midi.js --score piece-FirstDraft-Final-D-ctptCello` — a headless Chrome plays the composer's own ▶ on a virtual clock; nothing sounds, Reaper is not involved. 22,943 messages · 28,988 frames · **4311.7 s of wall time (72 minutes)** for 483 s of music → `midi/piece-FirstDraft-Final-D-ctptCello.capture.json` (1.35 MB, local). The page tried 54 writes (`POST /api/elec`), all refused, as designed.
**A MISTAKE OF THE AI's, kept at full weight:** at the resume the capture file was not there and the checkpoint said "if the file is not there, run it again" — so a second capture was started while the first (started four minutes earlier, in the session before the clear) was still running. Two headless Chromes ran side by side for about 25 minutes and slowed each other; the second was killed when his question made the AI look (`wmic` showed two processes; the first's renderer was at full CPU, at 140 s of the piece after 31 minutes). LESSON: a missing output is not a dead process — look for the process before starting it again. And the capture is SLOW for the whole piece (about 9 s of wall time per second of music; Section 3's own capture of 2026-11-14 was not timed): a re-capture after an edit of the save costs over an hour, which bears on step 6's "that note's MIDI is changed and only its stem rendered again" — a single note is better changed in the stem's own MIDI than by a new capture.
**THE CUT — `tools/stems_plan.js` (new):** each note-on of the capture given to its note of the save by `expect.notes` (port · channel · pitch · onset within 3 ms — `export_midi.js`' matching), its note-off the next on that slot. THE KEY of a stem: the RACK TRACK that takes the note's port and channel · the technique · the written dynamic — the band of `recVel` in this piece's eight `dynamicBands` (ppp … fff); a note with no plain velocity (the long tones of Section 1, their dynamic a CC curve) is `shape`. Each stem's file: its notes + every non-note message of its port. 60 BPM / 960 PPQ, format 0.
**TWO THINGS THE DATA TAUGHT:**
- the long tones of one instrument are spread over three curve channels (the flute's 4 · 5 · 6, the violin's 2 · 3 · 4 …) — keyed by port and CHANNEL they made three stems of one technique; keyed by the rack TRACK they are one. The key is the track.
- the clarinet's slap is SENT two octaves under its written pitch (the bass clarinet's sampler behind the octave fold, SWFluteb channel 12): 9 notes had no note-on at their own pitch. They are matched by pitch class at the same port · channel · onset; the tool says how many.
**THE RESULT:** **120 stems · 6042 notes of 6042 · 20 rack tracks · the last note-off 480.12 s** (`midi/<score>/stems/NN <track> - <technique> - <dyn>.mid` · `midi/<score>/stems.json`; the list `probes/stems_plan.log`). The written dynamics that occur: the counterpoint's techniques at p · f · fff; the phase section's short notes at f · ff · fff; the piano's `main` at all eight; five `shape` stems (the long tones) and the bowed crotales. The most stems on one rack track: 19 (the violin) — so a render that takes one stem per track per pass needs 19 passes, not 120.
**ALSO:** the rack's layout table (track name → port, the .rpp reader, the format-0 writer) is now ONE file, `tools/lib/rack_layout.js`, read by `export_midi.js` and `stems_plan.js`; `Clarinet XS` · `Bass Clarinet XS` (SWFluteb) were missing from the table and are added. The stem files are named with a plain hyphen, not the plan's long dash (a file name that crosses the bridge into Lua stays ASCII).
**The rack's routing, read for step 2:** every instrument track sends to the master and to REC (the last track, 16 receives); no instrument track feeds another — a track's own output is its whole sound, so a per-track stem render loses nothing.

## §456 · 2026-11-22 · the demo recording — steps 2 … 3: all 120 stems rendered to audio through a copy of the rack (12.7 minutes)

**THE TOOL — `tools/render_stems.js` (new):** the rack copied to `reaper/<save>_stems_render.rpp` and opened in a second tab (`render_reaper.js`' way — the rack is never written); a PASS puts one stem's MIDI on each rack track that still has one, selects those tracks and renders them as Reaper's "stems, selected tracks" (post-FX, post-fader, no master; 32-bit float, 48 kHz); then ffmpeg cuts each track's file to its stem's own span (0.5 s before its first note … its last note-off + 6 s) and the raw pass is deleted. Why passes work: no instrument track of this rack feeds another (§455), so a track's output is its whole sound. Each track's stems go longest-first, so the late passes are short. Every pass runs from 0:00 — the stem's MIDI carries every CC and bend from the piece's start, so the sampler is in the state the whole piece leaves it in. `--stems 12,45` renders only those again (step 6's "only its stem").
**THE RUN:** 120 stems · 19 passes · **12.7 minutes** (the three long passes 97 … 110 s each, 0 → 486 s with 18 … 20 tracks; the rest 22 … 41 s) → `H:\switch_2026\audio\demo\piece-FirstDraft-Final-D-ctptCello\stems\` (3.2 GB, local) · `midi/<save>/stems_audio.json` (each stem's file · where it starts · its length). **No stem is silent:** sample peaks from −34.5 dB (the flute's flutter at p) to −3.4 dB (the violin's staccato at fff); nothing over 0.
**WHAT WENT WRONG ON THE WAY, at full weight:**
- **Opening the copy took 6.7 minutes** (Reaper "Not Responding" while a second set of every sampler loads; memory 9.8 GB, 5 GB of 33 free) — the tool's 5-minute wait gave up; raised to 20. The tool goes on in a render tab that is already open.
- **`RENDER_SETTINGS` 2 rendered the MASTER MIX** (`Master.wav`), not the tracks; **3** is "stems, selected tracks". And the tool's wait looked only for the files it expected, so it sat for its full 60 minutes before saying so — AN HOUR LOST. Now: the render is over when Reaper's heartbeat is back and the folder has stopped growing; missing files fail at once, naming what was written.
- **The clarinet's two Xsample tracks were silent** (`Clarinet XS` · `Bass Clarinet XS`, the triple tongue and the slap). Two causes, both from the rule "a stem's track must get exactly what it hears live": (a) a track whose input names ONE channel hears only that channel — the whole port's messages were on the stem (fixed: one channel's messages on such a track, `export_midi.js`' own rule); (b) those two tracks carry `MIDI_INPUT_CHANMAP 1` — their input passes every message on to channel 1, where the sampler listens; an item on the track is not remapped (fixed: the stem's messages are written on that channel). The piano's three channel tracks and the percussion's sounded without (b).
- A `\s` lost its backslash in a script written through a heredoc (the standing memory note; the Edit tool put it back) — it hid fix (b) for one try.
**ALSO SETTLED:** a re-capture is never needed for a note fix (72 minutes, §455) — the stem's MIDI is edited and that stem rendered again (about 25 s once the tab is open; the tab's opening is the cost, 7 minutes).
**NEXT (not built):** the recording project — a track per stem under a bus per instrument, the audio at its place, the MIDI beside it; the four electronics lanes; then the measurement and the faders (step 5).

## §457 · 2026-11-23 · the demo recording — step 2: the mix project built and opened in Reaper

**Prompted by:** his "yes pls" to building the mix project (PLAN § 2r step 2).
**BUILT:** `node tools/build_mix.js --score piece-FirstDraft-Final-D-ctptCello` writes a NEW Reaper project as text, next to the stems on `H:` (`…/piece-FirstDraft-Final-D-ctptCello-mix.rpp`). The rack is neither read nor written. The tool refuses to overwrite an existing mix, because that file will hold his faders.
**THE SHAPE:** INSTRUMENTS (the bus for step 5's level line) → eight instrument folders (flute · clarinet · alto sax · percussion · mallets · piano · violin · cello) → a track per stem with its audio at its place → under each, a thin muted track with the stem's MIDI, hidden from the mixer. ELEC holds the four empty lanes for step 4. 254 tracks.
**DECIDED, and why:** the percussion and the mallets are separate buses, because the score gives the percussionist those two lanes. The MIDI sits directly under its stem rather than in a far-off folder, so a note can be spotted beside its sound. The project runs at 60 BPM because the stems' MIDI files are written at 60, so one beat is one second.
**PROVEN ONCE, in Reaper itself (the project opened, read through the bridge):** 254 tracks · 120 audio items · 120 MIDI items · none offline · every audio item's length equal to its file · all 120 MIDI tracks muted · the folders close correctly · tempo 60.
**NOT CHECKED:** nobody has listened to it, and the MIDI's alignment against its audio was not measured.
**NEXT (not built):** step 4, the four electronics lanes as stems.

## §458 · 2026-11-23 · the demo recording — step 4: the electronics as ten stems, rendered offline (23 s), in the mix project

**Prompted by:** his "yes pls" to going on to the electronics stems (PLAN § 2r step 4).
**WHAT THE SAVE HOLDS:** 12 material bricks on the four electronics lanes, and 37 sine bricks on the players' lanes (flute · clarinet · alto sax · the mallets' lane · violin · cello; all of them end by 144.45 s). No sine follows a player, so none depends on a live ear.
**THE QUESTION THE PLAN HELD OPEN, SETTLED:** the sine tones CAN be recorded without him. No live engine, no Reaper, no hand step.
**BUILT:** `node tools/elec_stems.js --score <save>` builds each brick's message the way the page does and `tools/elec_stems.scd` renders them in SuperCollider's offline mode, through the engine's own `materialSpec` · `sineSpec` · `\leSine`, with the piece's level ladder from `bank/elec_route.json`. Out: `H:/switch_2026/audio/demo/<save>/elec/` (ten files) and `midi/<save>/elec_stems.json`. `tools/build_mix.js` now places them in ELEC.
**DECIDED, and why:**
- the sine tones are six stems, one per player's lane, because each is the tone that player beats against, so its balance is that player's.
- the stems are DRY, before the engine's master bus (its high-pass, glue and limiter), because that bus acts on a whole mix and would print its reaction to one lane into that lane. Step 7 decides what stands in for it.
- a material is played by PlayBuf from a buffer holding its stretch, where the live engine streams it with VDiskIn. Same rate and interpolation, same envelopes. A long stream in offline mode was never proven; the engine's test only runs one second.
**THE RUN:** 23 s. Peaks: Elec 1 … 4 at −0.9 … −1.1 dB · the sines at −15.1 … −18.5 dB. Read back from the files.
**A FAULT ON THE WAY:** the first try stopped at its own count (37 of 49 bricks), because the save's track entries are objects, not names. Fixed in one line.
**THE MIX PROJECT REBUILT** after checking Reaper showed no unsaved change and the file was still the tool's own; reloaded, 260 tracks.
**NOT CHECKED:** nobody has listened; the render was not compared against the live engine's output. The four lanes each peak near −1 dB, so their sum can pass 0 dB until step 5's faders and the master.
**NEXT (not built):** step 5, the measurement and the first balance.

## §459 · 2026-11-23 · the demo recording — step 5: the first balance, by measurement, in the mix project

**Prompted by:** his "yes pls" to going on to the first balance (PLAN § 2r step 5; his requirements SW-166 · SW-167).
**MEASURED:** `node tools/mix_measure.js --score <save>` (54 s) — every note of every stem, its loudest 400 ms, K-weighted, the stem's middle value; the four material lanes summed, their usual level per section (at or under it 75 % of the time they sound).
**WHAT THE PLAN'S TARGET GAVE, AND WHY IT WAS CHANGED:** "the middle of the stems at that dynamic" fell out of order: ppp −33.7 · pp −32.1 · p −38.5 · mp −26.4 · mf −27.5 · f −34.4 · ff −31.0 · fff −32.0. The cause is who plays each mark. ppp, pp, mp and mf are ONE stem each (the piano, which sits hot), ff is seven, while p, f and fff are 33 … 36 stems across the whole ensemble. Applied as written, a ppp in the solo would have sounded louder than a p.
**DECIDED (the AI's, by his standing rule that the volume is the AI's, §159):** ONE RISING LADDER. The plan's middle is kept for p (−38.46), f (−34.37) and fff (−31.95); the other five are read off the straight lines through those three. Rejected: pooling the out-of-order marks (it flattens the dynamics to nearly one level) · a fixed 4 dB a step (it would move almost every stem far from where it stands, for a contrast nobody asked for). The ladder spans 9.2 dB from ppp to fff; the piano's own span was 10.7.
**THE SHAPED LONG NOTES** have no written dynamic: the six are leveled among themselves (−27.87).
**THE SINE TONES MOVE WITH THEIR PLAYERS:** the beating depends on the tone and the long note being matched. So each sine keeps the level it had against its player's long note in the rack (ELEC RETURN's −5 dB counted), and the "usual level of the electronics" is measured on the four material lanes alone.
**THE LEVEL LINE:** the section's lowest dynamic 3 dB above the electronics' usual level. Players against the electronics: sine section +14.34 · solo +25.20 · counterpoint +24.63 · phase section +26.21 dB. Built as the ELEC bus at −26.21 dB and a line on INSTRUMENTS at or under 0 dB (−11.87 · −1.01 · −1.58 · 0), so no fader or envelope runs past its range; each step is a one-second ramp in the gap before its section.
**THE MASTER:** the whole mix summed in the tool, peak −8.47 dB at 243.45 s, master +7.47 dB for a peak of −1 dB.
**THE LARGEST MOVES:** the violin's staccato −14 … −15 dB (390 notes at f, the one real outlier) · the china scrape and the flute's tongue ram up to +11.9 dB.
**APPLIED AND READ BACK IN REAPER:** the project rebuilt (it had no unsaved change), reloaded: 94 faders moved (87 stems · the ELEC bus · six sines), the line's four values, the master, each as computed. The card: `docs/DEMO_MIX_CARD.md`.
**NOT CHECKED:** nobody has listened. **THE RISK, plainly:** his 3 dB rule puts the players about 20 dB further above the electronics than the rack had them, because the electronics are mastered files and the softest written notes are far below them. The electronics may read as too quiet; the ELEC bus fader is the one control for it.
**NEXT:** step 6, his ears.

## §460 · 2026-11-23 · the demo recording — Realphones on for his listen

**Prompted by:** *"Can you put the real phones on the, I forgot which bus it was, the output bus?"*
**DONE:** the Realphones plugin was already in Reaper's Monitoring FX, bypassed since §17. Its bypass was taken off through the bridge. That chain is global and comes after the master, so it colors what he hears and never reaches a render or the bounce. The mix project is unchanged.

## §461 · 2026-11-23 · the demo recording — the sine tones on their own bus, set for the beating

**Prompted by:** *"Can we put the sine tones on a different bus than the electronics? When I turn up the electronics, I'm turning up the sine tones too. And then can you, well, I just turned up the master fader only, so let's put the sine tones in their own bus back to their own level. And then can you mix assign tones, I guess, on their own, apart from the electronics, so they are at the right level for the beating to occur?"*
**READ FIRST, in the live project:** the master was still +7.47 dB as built. The fader he had moved was the ELEC folder's, −26.21 → −19.65 dB. It was kept as he left it; the sines were taken back out from under it.
**THE MEASURE:** beating is deepest when the two tones are equally loud, and what beats against a sine is the player's PARTIAL at that pitch, not the player's whole sound. So `tools/sine_match.js` reads a narrow band (Q 10) round each sine's pitch, on the player's long-note stem and on the sine's stem, every 100 ms while the player sounds (the first 300 ms of each note left out), with every gain in each path counted. The sine's move is the middle of the differences. 800 … 989 readings a lane.
**WHAT IT FOUND:** §459's rule (keep the rack's relation) was right for the flute only. Sine against the player's partial: flute +0.43 · clarinet +8.02 · alto sax +9.00 · crotales −4.93 · violin +9.10 · cello +9.10 dB. Four sines were 8 … 9 dB too loud to beat fully and the crotale's was 5 dB too soft.
**SET:** a new SINES folder after ELEC, its fader at 0 dB, so it is one control. Inside: flute −17.30 · clarinet −22.88 · alto sax −24.18 · crotales −14.04 · violin −25.97 · cello −27.50 dB. Read back in Reaper, the project saved through the bridge (his ELEC fader with it).
**WHAT ONE FADER CANNOT DO:** the player's partial moves against the sine through each note. Share of the time within 3 dB of equal, after the move: alto sax 83 % · flute 77 % · clarinet 64 % · crotales 61 % · cello 55 % · violin 48 %. The violin swings most (10 … 90 % of the time −4.3 … +11.4 dB). Closer would need the sine's level to follow the note, which is an automation per note, not done.
**A FAULT ON THE WAY:** a newline escape written through a heredoc collapsed and the Lua did not load (the standing memory note). Nothing had run; fixed.
**NOT CHECKED:** the beating has not been listened to, by anyone. Equal level is the physics of the deepest beat, not a claim about how deep he wants it.

## §462 · 2026-11-23 · the demo recording — the piano's -4 dB for the solo only

**Prompted by:** *"I just moved the electronics and the piano for the piano solo. Let's hold those levels for now. But then I guess reset the piano for the next section. So it's maybe just, I don't know if it was -3 or -4 dB just for the solo. And then the ensemble seems like much louder. Well, I'll just use the master fader, that's fine."*
**READ IN THE LIVE PROJECT:** the Piano folder -4.00 dB (it was 0) · ELEC -13.00 (it was -19.65) · SINES +2.00 (it was 0) · the master unchanged at +7.47.
**DONE:** his -4 dB became a volume line on the Piano folder: -4 dB up to 199 s, a one-second ramp, 0 dB from 200 s. The folder's fader is back at 0. The solo's last note ends at 196.28 and the piano's next note is at 201.18, so the ramp crosses no note. ELEC and SINES are held where he put them, for the whole piece. The master is his to move. Read back in Reaper; project saved.

## §463 · 2026-11-23 · the demo recording — why the counterpoint is out of balance (an evaluation; nothing changed)

**Prompted by:** *"the next section after the piano solo, uh, the balance is all out of whack there. It's hard to mix ... the scrapes are really loud, and I don't know what kind of detection or balancing was done there ... some elements, especially the percussion, are way too loud ... see what's going on first. Give me an evaluation first, and then let's see if we can't get everything in a better parity."*
**MEASURED (97 stems, 200 … 253 s, read-only):** by the meter §459 used, the section looks in parity (one dynamic spans 3.6 dB at p, 5.2 at f, 9.9 at fff). By sample peak the same stems span 16.7 … 20.0 dB. The meter is what is wrong.
**THE FAULTS, IN ORDER OF SIZE:**
1. **THE AI'S READING MISSED THE SCRAPES.** §459 read a note's loudest 400 ms only from windows STARTING inside the written note. A scrape is written 0.1 s long and sounds 2 … 3 s, swelling after its start. Read through its ring, the china scrape is 17.1 dB louder (the middle of its stems) than the reading said. Taking it for the quietest sound in the section, the balance RAISED it by 6.6 … 11.9 dB. No other family was missed by more than 3.6 dB.
2. **A 400 MS WINDOW UNDER-READS EVERY SHORT SOUND.** A 0.1 s hit is averaged with 0.3 s of silence, so tongue rams and exploding slaps read low and were raised 7.6 … 11.9 dB. Their loudest 100 ms stands 6.0 dB over the reading.
3. **ONE FADER SERVED TWO SECTIONS.** Nine stems (the winds' staccato, the piano) play a handful of notes here and hundreds in the phase section, so the phase section set their fader. The piano's fff here (7 of 288 notes) was pulled down 9 dB and is the quietest thing at fff.
4. **ONE FADER CANNOT LEVEL A STEM WHOSE NOTES DIFFER.** Inside single stems the notes differ by up to 13.2 dB.
5. **THE SECTION WAS ALREADY LEVELED.** All 333 notes carry the composing pass's parity (§152). §459 moved them a second time, on the faulty reading: 27 stems up 3 dB or more, 20 down.
**RECOMMENDED, NOT DONE, PUT TO HIM:** the counterpoint on its own values, each NOTE measured over its whole sound by its loudest 100 ms and given its own gain on the audio, raises capped at +6 dB. What is uncertain: 100 ms is the AI's stand-in for the ear.

## §464 · 2026-11-23 · the demo recording — the counterpoint rebalanced note by note

**Prompted by:** his "yes pls" to §463's recommendation.
**BUILT:** `tools/ctpt_balance.js`. Each onset of 200 … 253 s read by its loudest 100 ms, K-weighted, anywhere in its whole sound (to the stem's next note, 3 s at most). One target per written dynamic, the middle of the stems in THIS section: p -35.19 · f -31.84 · fff -28.83. Within 1.5 dB left alone; no raise over +6 dB. The gain is a take volume line on the audio item, a 10 ms ramp before each note whose gain differs.
**THE STEM FADERS ARE ALL BACK AT 0 dB.** A stem's notes outside this section keep, on the same line, the gain §459's fader gave them, so the other sections do not change.
**RESULT, by the new reading:** the spread inside one dynamic fell from 17.6 / 22.6 / 22.2 dB (p / f / fff) to 4.6 / 4.6 / 4.8. 261 notes moved, 72 left alone, 19 held at +6 dB. The china scrape, by the middle of its notes: f and fff about 16 dB lower than §459 had them, p 6.6 dB lower.
**HIS MOVES, KEPT:** he had taken the INSTRUMENTS fader to -6 dB, unsaved, while this was computed. It stayed, and is now saved. ELEC -13 · SINES +2 · the piano's solo line · the master +7.47 all as he left them.
**PROVEN ONCE:** the lines read back in Reaper at all 5315 onsets of the 115 stems changed, against the computed gains (error under 0.001 dB). The project saved. The state before it: `…-mix.before-464.rpp` beside the project.
**NOT CHECKED:** nobody has listened. The final section still carries §459's faders and so very likely the same fault.

## §465 · 2026-11-23 · the demo recording — his levels for the first two sections, recorded

**His words:** *"Okay, so the signs are +3. The electronics are at -13. And the piano in the piano solo is -2 dB. But then does it go back up? I don't know if I made the change right. I'd like it to go back up for the ensemble part. And that's those first two sections done. I believe for whatever reason, I think the whole volume needs to come down for the last two sections. But let's just record those for now."*
**READ IN THE LIVE PROJECT:** SINES +3 · ELEC -13 · INSTRUMENTS fader back at 0 · the master +7.47. The piano's line stood at -2.2 dB for the solo and +1.8 dB from 200 s: his drag had moved the whole line up 1.8 dB, so it did come back up, but past where it was.
**DONE:** the piano's line from 200 s set to 0 dB. The solo stays at his -2.2. Project saved.
**SETTLED BY HIS WORD:** the sine-tone section and the piano solo are DONE for the demo.
**HIS NOTE, NOT ACTED ON:** the whole volume needs to come down for the last two sections (the counterpoint, 200 ... 253 s, and the phase section, 277.8 ... 480 s).

## §466 · 2026-11-23 · the demo recording — the master steps down for the last two sections

**His words:** *"the penultimate section, everything should come down 4 dB. It's already messed with the master fader there, so you can put it back. I think it was at 7.47, but it's got to come down to, I guess, 3.47, and then the final section all together 6 dB, so whatever, 1.47."*
**READ:** the master fader stood at +4.00 dB (his move while listening). Put back to +7.47.
**DONE:** a volume line on the master: 0 dB to 199 s, -4 dB from 200 s, -6 dB from 277.8 s, each step a one-second ramp before its section. So the master is +7.47 for the first two sections, +3.47 for the counterpoint, +1.47 for the phase section. Read back in Reaper; project saved.
**NOTE:** the master's fader now moves the whole piece, the steps riding on it.

## §467 · 2026-11-23 · the demo recording — step 7: THE BOUNCE

**His word:** *"ok thats good to bounce"*.
**BUILT:** `node tools/bounce_mix.js --score <save> --name switch-demo-mix1`: Reaper renders the open mix project's master to 32-bit float (the Monitoring FX, so Realphones, is not in a render), the tool measures it and writes a 24-bit, 48 kHz WAV with TPDF dither and a bare header, so the file holds no name, path, software or date. The file: `H:/switch_2026/audio/demo/piece-FirstDraft-Final-D-ctptCello/bounce/switch-demo-mix1.wav` (134 MB, outside the repo).
**DECIDED:** NO glue and no limiter, though the plan's step 7 named them. He approved the mix as he heard it, and the peak needs neither. The file starts at the score's 0 s, so it stays aligned with the score.
**MEASURED, the bounce:** 487.00 s · sample peak -4.55 dB at 177.91 s · no sample at or over 0 · integrated -21.5 LUFS · loudest 400 ms -14.0 LUFS · first sound 5.24 s · last 482.05 s.
**WHAT WENT WRONG, at full weight:** the first render was PURE SILENCE with no error. Reaper had taken its media offline because it was not the active window (`Audio_IsRunning` 0, the source offline). Found by a six-second test and by reading a take directly. The tool now brings all media online (action 40101) in the same call as the render, and refuses to write a silent file. The silent file was confirmed silent and removed.
**NOT CHECKED:** the AI has not heard the file. The numbers are read from the file itself.

## §468 · 2026-11-23 · the demo film: the waveform in the score, the solo zoomed whole, the cut, the sound under it

**His words:** *"can you work on trying to do a video cut? So like we did with the previous videos, like the full score, then a couple just seated sections that are close up. But for the piano solo, can you make the whole solo the zoomed in version? Oh, and then I think we need to put the waveform into the notation score for the electronics. So we need the waveform of the demo in the score, and then, yeah, see if you can't work independently and print a video. You can go ahead and I'll take your decisions about the cut and the zoom, the random zooms, and then, you know, zoom the piano solo, and then, you know, mix it or sync it with the audio, please."*
**LINEAGE FIRST:** the way is the earlier pieces': `tools/export_video.js` with a seeded cut list (`make_cut.js`), close-ups as seated groups, an 8-frame dip through paper at each cut, every source on one clock.
**THE WAVEFORM IN THE SCORE:** `node tools/elec_wave.js --score <save>` sums the ten electronics stems at the mix project's LIVE levels (ELEC −13 · SINES +3 · the master's steps), the peak of every 10 ms, into `bank/elec_wave.json`. `notation/lib/elec_wave.js` draws it in the ELEC lane, one gray shape mirrored round the middle, for the film and the notation app; its look is one row, `rules.json objects.elecWave`. The AI's call: a display curve of 0.6, so the quiet stretches can be read beside the swells. Seen in the app's page on the throwaway.
**WHAT THE FILM TOOL LACKED, ADDED:** a page's `omitParts` · the solo's signs and their motion (the ball, the thrown pebbles; until now in the app only, §362's note) by the workshop's own code · close-up groups per section · a framed close-up.
**THE CUT (the AI's, at his word; `tools/make_film.js`, seed 11):** four renders, one per page of the score, on one frame clock, joined without re-encoding, the bounce laid under the whole.
- the sine tones: wide, with strings + ELEC 48.0 … 72.1 and winds 96.5 … 120.7. The piano group is left out here because the piano does not play.
- the piano solo: ZOOMED WHOLE, 146 … 199, x2 (2.4 s a screen, his pace of 4.8 s a page at the zoom). The piano large with the ELEC lane moved up under it, so the waveform stays in sight.
- the counterpoint: wide, winds 215.7 … 233.9.
- the phase section: wide, strings + ELEC 298.0 … 324.1 · percussion + piano 362.0 … 386.5 · winds 420.7 … 445.5. It closes wide.
- close-ups x2.4; 195 s of 487 in close-up (40 %, the solo's 53 s included).
**THE FILE:** `H:/switch_2026/audio/demo/piece-FirstDraft-Final-D-ctptCello/film/switch-demo-film1.mp4` · 1920 x 1080 · 30 fps · 14,610 frames · 487.000 s, picture and sound both starting at 0 and equal in length · 44 MB · no name or date in its tags · rendered in 9.2 minutes. Twelve frames across the film read back from the file.
**FAULTS ON THE WAY:** the first solo frame showed neighbors' clefs at its edges and pebbles flying over the clef: the gutter and the motion are now clipped. The new rule row lacked its `basis`, caught by `check_rules` (its two remaining reds are the two old ones).
**NOT CHECKED:** nobody has watched it through. The AI saw stills only, so the motion (the ball, the pebbles, the page turns at speed) and the felt sync are unproven. The solo turns a screen every 2.4 s, which may be quick to read. Print does not carry the waveform yet.

## §469 · 2026-11-24 · the demo film, second cut: waveform style F, the solo zooms out for its last long curve, nothing cut off in a close-up

**His words:** *"lets do f ; and then for the piano solo … zoom in all the way to that point and then zoom out so that you see the entire long, last long curve in frame … the video's pretty good. Let's recut that version."* · *"the Zoom for the piano is cutting off … the tops of the flags"* · *"No, keep the staff lines. Things are drawn on the staff in the piano solo."* · *"quite a bit is cut off at the top"* · *"Looks like the bottom is cut here too. So just check the I guess margins … You're not getting the full image into the frame."*
**THE WAVEFORM, STYLE F (his pick of six drawn on one sheet):** the peaks pale, and a body averaged over 0.15 s either side drawn dark inside them at 0.8 of the height. It is one row (`rules.json objects.elecWave`), drawn by `notation/lib/elec_wave.js` in the film and the app alike.
**THE SOLO:** zoomed x2 from 146 to 186.5 s. From 186.5 it zooms out to x1.4 with a 5.4 s screen opening at 186.5, so the ribbon of 186.79 … 191.46 stands whole in one screen; then on to 199 at that size.
**WHAT WAS CUT, AND WHY:**
- the solo's frame began at the piano lane's top, while its flags rise to 953 at the highest (measured on every screen it shows). The frame now reaches up into the percussion's staff, every staff line kept at his word, and its clef shows.
- every other close-up was cut at its own lane's box, so whatever is written outside a staff (dynamics, words, the ball's curves, ledger notes) was lost at the edge. First fix: reach to the neighbors' staff lines. That showed the neighbors' own ink at the edges.
- second fix, the one kept: A GROUP'S CLOSE-UP DRAWS ONLY ITS OWN PARTS (the other systems are left off its page and their motion off its overlay; the layout is unchanged). It is centred on the band between its neighbors' staves, and only the gutter's other brackets and names are masked. Two measures on the way: the percussion's four single lines stand 2 ss apart (half-height 3 ss, not 2), and a grand staff is its two staves, not the lane that holds them.
- every band fits the frame at x2.4 (the tallest is 445 px at x1, the winds of the phase section: 1068 of 1080).
**THE FILE:** `…/film/switch-demo-film2.mp4` · 487.000 s · 14,610 frames, picture and sound equal and from 0 · 8.3 minutes to render. Twelve frames read back across the film.
**NOT CHECKED:** the AI saw stills only. The hard cut at 186.5 (zoom in to zoom out) has no dip, because the two halves are separate renders.

## §470 · 2026-11-24 · the title: *Multiplicity*

**His words:** *"for the switch piece lets call it Multiplicity"*.
**Recorded:** the piece is *Multiplicity*. The file and repo names stay `switch` (CLAUDE.md's standing rule). Q3 of the journal is answered. The title is not a name, so it may appear on the anonymous submission.

## §471 · 2026-11-24 · the print score of Multiplicity, 11 x 17, one book

**His words:** *"could you prepare the print score we'll use the full 11x17, american ensemble … I'll proof from the print score so be prepared to make changes across the system and maybe reprint video and print"*.
**READ AS:** Tabloid landscape, 17 x 11 in, the US sheet (the ensemble is American). The presentation score is in C (the registry's realization), as the film.
**BUILT:** `node tools/print_book.js` — four runs of `tools/export_print.js` (one per page of the score: the sine tones · the piano solo · the counterpoint · the phase section), the page numbers running on (`--folio0`), joined into one PDF with pypdf, its properties cleared. Out: `print/score/Multiplicity-score.pdf` (gitignored).
**WHAT PAPER LACKED, ADDED TO `export_print.js`:** the ELEC waveform (style F) · the piano solo's signs (the workshop's own drawing, carried onto the page by one uniform scale and a shift measured from both views, so a ribbon keeps its shape; the motion stays the film's) · a page's `omitParts` · a page's own pace setting its printed density (the solo at 4.8 s).
**THE COVER:** `print/cover/cover.json` — Multiplicity, the instruments on three rows (on two the title shrank to 68.5 pt), NO NAME (anonymous; public repo).
**THE BOOK:** 1 front page + 52 pages of music (the sine tones 12 · the solo 11 · the counterpoint 6 · the phase section 23), 1224 x 792 pt. One proof page per section looked at as an image.
**NOT CHECKED:** the print gates of Approaching's build (`check_print_pdf` · `check_print_pages` · `check_print_edges`) were not run; his proof is the check asked for.

## §472 · 2026-11-24 · the performance instructions' edit sheet, and the posting order

**His words:** *"prep order and instructions for posting like we did with tenor, youtube + the oc?? for academic anoym posting … we still have to do the performance instructions, could you prep a html edit sheet like we did for previous instructions and collect pertinant instructions from other pieces and but it at the bottom as notes, but make the print scores anyway"*.
**THE EDIT SHEET:** `docs/notation_instructions/` — Approaching's frame, stylesheet and edit switch (byte for byte, decibel @ e3ae3e6); the body THE AI's first draft from this piece's decisions (NOTATION_SCHEME, the tracker), each paragraph's source in a comment; no name; image places marked. At the bottom "Notes for Revision (delete before submission)": the tracker's open rows, the call's percussion check, and twelve lines collected from Approaching, Recombination, Scattered Substance and the tubas, verbatim where marked. The print book carries it as its front matter.
**THE POSTING ORDER:** `docs/submission/POSTING.md` (local; the folder is gitignored) — Approaching's TENOR way: the proof · the instructions · the final anonymous files · YouTube unlisted on a second, neutral channel · OSF private with an anonymized view-only link · the link into the instructions · the call's form by December 1.
**READ AS:** "the oc??" = OSF, the host Approaching used.

## §473 · 2026-11-24 · the ELEC waveform as an outline (not yet drawn into the print or the film)

**His words:** *"tets try the outline but wait to redraw"* (after seeing the six styles again).
**DONE:** `rules.json objects.elecWave.style` is now `outline` (his B: the peaks' shape, its edge only, 1.3 px, in the lane's gray); `notation/lib/elec_wave.js` draws it. Style F (peak and body) stays in the code, one word away. The notation app shows it at its next page load.
**NOT DONE, AT HIS WORD:** the print book and the film are not made again yet.

## §474 · 2026-11-24 · the film's piano solo zoomed out throughout (not yet rendered)

**His words:** *"And actually, the whole piano solo can be the zoomed out version. We don't need to zoom in for the piano solo."*
**DONE:** `tools/make_film.js` — the solo is one render, 146 … 199 s, at x1.4 with a 5.4 s screen (the V-SOLO-OUT frame of §469), the screens still anchored to open at 186.5 so the ribbon of 186.79 … 191.46 stays whole on one screen. The x2 close-up (V-SOLO) stays defined, unused. This also removes the hard cut at 186.5.
**NOT DONE, AT HIS WORD ("wait to redraw"):** the film is not rendered again yet.

## §475 · 2026-11-24 · the last section: the ensemble 1 dB down, the electronics 1 dB up (in the mix project; nothing rendered)

**His words:** *"and then lets try for the last section The ensemble down 1 dB and electronics up 1 dB, just for that section."*
**DONE (Reaper was closed; the AI opened it on the mix project):** the INSTRUMENTS line from 277.8 s at −1 dB (it was 0 there), and a new line on the ELEC folder, 0 dB to 276.8 s, +1 dB from 277.8 s, each a one-second glide in the gap before the section. Saved.
**A FAULT OF THE AI's, FOUND AND MENDED THE SAME TURN:** making the ELEC line (action 40406) moved the folder's fader into the line and set the fader to 0 dB; the script then wrote its own points, so his −13 dB was lost. Read back, seen, the fader set back to −13. ELEC now: −13 dB to 276.8 s, −12 dB in the last section. A memory note now says to read a fader before making its line.
**NOT DONE:** no new bounce, print or film; the ELEC waveform for the score is made from the folder's fader, not its new line, so it does not show this 1 dB yet.

## §476 · 2026-11-24 · the crotales' first word: "crotales (bowed)"

**His words:** *"For the opening section, the announcement of the Crotales, the first one, we should say bowed too."*
**DONE:** `tools/notate_section.js` writes "crotales (bowed)" at the crotales' first entry in Section 1 (piece 2's rule of the name at the first entry, §251, now with how it is played; the same wording as the instructions page). The page `s1-sines` rebuilt by its own recorded command: compared with the page before, identical but for the build date and the word.
**NOT DONE:** the print and the film are not made again yet (his "wait to redraw").

## §477 · 2026-11-24 · the notation on top: every curve behind, the badges last

**His words:** *"Can you double check and see that all the notation is on top, especially when it comes to the Audible Beats badges? They might be, but if they're not, let's make sure they get printed on top of them."*
**WHAT THE CHECK FOUND (read in `render.js`):** the renderer draws a lane's marks in layers. The Audible Beats badge, the pitch curve (orange), the sine tone's line (purple) and Section 3's crescendo curves all sat in ONE layer, so the order of the list decided which lay on top. The volume curve sat ABOVE the notation (its layer 1). Only the GC's still curve was already behind (§383).
**HIS RULE, AS A ROW:** `rules.json objects.layers` — curves "behind" (every drawn curve under the notation, beside the GC's still curve) · badge "top" (a player's badge drawn last in its lane, over the curves and the go lines); `container.json` render.curvesLayer · badgeLayer; `render.js` reads them. The film, the print and the app share it.
**MEASURED ONCE:** on a page of Section 1 every badge is drawn after every curve in its system (3 systems of 3).

## §478 · 2026-11-24 · the double bar only at the end of the piece

**His words:** *"Not meant to be a double bar at the end of section 1, just at the end of the piece."* (with a picture of the print's last page of Section 1)
**THE CAUSE:** `export_print.js` drew the final bar line at the end of EVERY page set it was given, and the book prints the score as four sets.
**DONE:** `--finalBar off`; `tools/print_book.js` gives it to the first three sections, so the thin-and-thick bar stands only at the end of the phase section. Checked on the two ends: none at 145 s, one at 480 s.
**NOT DONE (his "wait to redraw"):** the print and the film are not made again yet.

## §479 · 2026-11-24 · no bar line anywhere but the final double at the end of the piece

**His words:** *"Same with section 2 and any other sections that you draw double bar. Just the end of the piece. And I guess no bar at all, right? It looks like every page is just open staff lines. So the only bar you'll draw is at the end of the piece, and it'll be a double."*
**WHAT WAS LEFT AFTER §478:** a single thin line at the end of each section's material (`static_page.js`, and the app's own copy), in the film, the app and the print alike.
**DONE:** `container.json systemEndBar.atMaterialEnd false` (his word in its note); `static_page.js` and `notation.html` read it; the film draws the final double bar on the section that ends the piece (`export_video.js --finalBar on`, given by `make_film.js`). Checked: Section 1's end in the film and the print — no bar; the phase section's end in the film — the double bar.
**STILL HIS TO SAY:** the short bar lines Section 3 draws before each new tempo mark (§433's "a bar line and ♩ = N").

## §480 · 2026-11-24 · the piano's pizz. centered on its note; ord. after a pizz. or a mute inside one figure

**His words:** *"This is on page 24. So can we center the pizz over the note head? And I forgot we should do ord for the next note if it's like pizz and then a non-pizz after. It should say ord or whatever it is. You know, if it's mute or whatever. I think there's just pizz ord. So can you find all the instances of those and update?"* · then, while it was being built: *"I should be clear, only the ones that are like in the same grouping, either tied to each other or beamed together. You don't have to, like, if there's a pizz, the next note doesn't have to be ord. … if it has its own articulation."*
**THE RULES, AS ROWS:** `objects.techWordAbove.align headCenter` (a device's word above its note, "pizz.", is centered on the head; it began at the head's left edge, Gould's way, D49) — read through `container.json` layout.textAboveAlign · `objects.returnWord` (on the piano, ord. on the first ordinary note after a plucked or muted one, ONLY inside one figure: tied, beamed together, or a grace into its main note).
**BUILT:** `layout.js` (the two places "pizz." is drawn) · `tools/build_ctpt_page.js` (the figure test from its own GRACES · tiedPairs · BEAMS · his pickup hands). The first pass, before his narrowing, found 15 notes; narrowed, THREE: 208.73 (after the muted grace) · 217.44 and 225.82 (after a plucked grace). 203.27 → 203.47 is two notes with their own articulations, so none.
**A FAULT OF THE AI's ON THE WAY:** an inserted comment cut a line of `layout.js` in two; the page builder does not load that code, so it showed only at the print. Mended, the syntax checked.
**SEEN ONCE, ON THE PRINTED PAGE:** the pizz. at 203.27 centered over its head; ord. under the main note of the 217.4 figure.
**NOT DONE (his "wait to redraw"):** the book and the film.

## §481 · 2026-11-24 · the print's pages run to their end: the counterpoint mended, the phase section's cause found

**His words:** *"Same strange page cut on 36, and there might have been some others. I missed them. … In general, we should try to go to the end of the page if we can with these."*
**MEASURED (every printed page, the plan the print itself uses):** short by more than 1 s — the counterpoint's pages 24 (5.0 s blank) and 26 (7.5 s); the phase section's 33 · 34 · 36 · 40 · 41 · 42 · 46 · 47 · 48 · 50 · 51 (1.1 … 6.1 s). The sine tones and the solo: none.
**CAUSE 1, the counterpoint:** a block of joined marks (the ball curves' reach, chained across eight parts) crossing a page's end was PUSHED whole to the next page however much page that left blank. **MENDED:** `page_rules.json pushMaxBlankSeconds 1.0` (his words in its note) — a block is pushed only when that leaves at most 1 s blank; past that the planner's own "forced" cut is used (inside the block where it breaks the fewest beams and tuplets; every mark whole on one page or the next) — `splice.js`. The counterpoint is now 5 pages, none short.
**CAUSE 2, the phase section — FOUND, NOT MENDED:** each short page ends at a short note whose OCTAVE BRACKET runs on far past the page (§442's one bracket over a run of the part's notes; page 50: the cello's 8va line across the whole page, ~20 s). On paper the bracket is a "whole" mark of its note, so the page must end before that note. The standard answer is to break the bracket at the page's end and restate it — (8va) — at the next page's start; the print cannot do that yet, and simply cutting the bracket would leave the next page's notes with no octave sign (wrong pitches on the page). Put to him.

## §482 · §483 · §484 · 2026-11-24 · his three answers: the 8va on paper, the overpressure note, the tempo bar lines

**His words:** *"1 yes, 2 yes, 3 remove them then go for 1-4 pls ty"* — to: (1) the overpressure figure a go line and a curve · (2) a long octave bracket broken at the page's end and restated · (3) the short bar lines before each new tempo mark.
**§482, THE OCTAVE BRACKET ON PAPER:** `render.js` (print pages only): a run's bracket that crosses the page runs open to the system's end with no hook, and is restated on the next page (the label at the music's start, the line on to the run's end). `page_rules.json edge.ottava.print` "continue" (was "whole"), so the planner no longer holds a page back for it. Seen on the cello at 465.65 s: open at the end of page 50, restated on page 51. **WHAT IT DID NOT DO:** the phase section's pages stay 1 … 6 s short. Asked of the planner (`splice.js`, the plan dump now names each mark's span and what held a cut back): nothing reaches past the page — the cut is placed early because in that section all seven parts are in the middle of a beamed or tuplet group almost everywhere (seven independent tempos), and the planner never splits a group across two pages; it takes the last moment no group crosses. The counterpoint is unaffected by this and fills its pages (§481). Breaking a beamed group across a page is the remaining lever; his to raise.
**§483, THE OVERPRESSURE NOTE:** `container.json byTechnique.bow_op_vel` — the go line and the gestural curve, the head off its moment on the C anchor (as the gettato beside it); the square head, the three down-bows and the marcato kept. Seen at the cello's 235.35 s.
**§484, THE TEMPO BAR LINES:** `layout.js` reads `layoutPolicy.tempoBars`; `tools/build_s3_page.js` sets it false — the tempo mark stands alone. The page rebuilt; no bar line kind left on it.

## §485 · 2026-11-24 · redrawn: the bounce, the waveform, the print, the film

**His word:** *"then go for 1-4 pls ty"* — the bounce, the waveform, the film, the print.
**THE BOUNCE:** `…/bounce/switch-demo-mix2.wav` — 487 s · peak −4.55 dB · −21.5 LUFS (both as mix1: the last section's change is small); compared with mix1: identical to 270 s, the last section 0.2 dB fuller (ensemble −1, electronics +1).
**THE WAVEFORM:** `tools/elec_wave.js` now reads each folder's own volume line too (ELEC's last-section step, §475), then `bank/elec_wave.json` remade; drawn as the outline (§473).
**THE PRINT:** `print/score/Multiplicity-score.pdf` — 2 front pages + 51 of music (the counterpoint 5 pages, was 6); every change since §471 in it: the outline, the curves behind the notation, no bar but the final double, crotales (bowed), the pizz. centered and ord. in three figures, the overpressure's go line and curve, no tempo bar lines, the 8va restated across a page.
**THE FILM:** `…/film/switch-demo-film3.mp4` — 487.000 s, 14,610 frames, picture and sound equal and from 0, 8.9 minutes; the solo zoomed out throughout, the new bounce under it. Six frames read back.

## §486 · 2026-11-24 · the waveform as bars — ready, used at the next film only

**His words:** *"lets try bars if we have to reprint the film, otherwise we'll leave for now"*.
**DONE:** `notation/lib/elec_wave.js` draws style `bars` (his E: a bar every 0.1 s, a quarter of each bar's width a gap, mirrored); `rules.json objects.elecWave` carries `barSeconds` · `barGapFrac` and a note `styleNext`. **The style stays `outline`** in the delivered film3 and the print: switch `style` to `bars` only when the film is rendered again.

## §487 · 2026-11-24 · the waveform as bars in the film; the print held

**His words:** *"Actually, go ahead and switch to bars and reprint the film, please."* · then *"a hold on the print score, and we'll put the bars in for when I have the performance notes and if there's any additional corrections."* · then *"That's okay, then just leave it. We'll reprint it. I just meant you didn't have to reprint it now."*
**DONE:** `rules.json objects.elecWave.style` = `bars`; the film rendered again as `…/film/switch-demo-film4.mp4` (mix2 under it). The print had been rebuilt with the bars before his hold; the AI added `--waveStyle` to `export_print.js` and `print_book.js` and rebuilt it with the outline, as he had it — his "leave it" came while that ran. **The print in hand now carries the outline;** the next `node tools/print_book.js` (no --waveStyle) draws the bars.

## §488 · 2026-11-24 · the solo's pebbles at rest on paper

**His words:** *"Can you put the pebbles into the piano solo boxes just at the bottom?"*
**DONE:** `tools/export_print.js` (the solo's signs on paper, §471) draws each pebble drop's pebbles where the film's motion leaves them — landed, the small bounce done, on the box's floor; the same shapes and grays as the film (notation.html's last state). The film is untouched. Seen on one page (the drop at ~170.3): the heap along the bottom of its box. **Not reprinted** (his hold, §487): the next `node tools/print_book.js` carries it.

## §489 · 2026-11-24 · pages 25 and 27: the push limit to 0.5 s

**His words:** *"And can you explain to me why page 25 is short?"* · *"27 also"*.
**THE CAUSE (read from the plan):** page 25 — a block of ball curves crossing its end was pushed whole, leaving 0.97 s blank, just under §481's 1 s limit; and the page starts 0.64 s before its first owned moment, because page 24 was cut inside a block and the next page shows those curves' approach whole. Page 27 — the same, 0.67 s blank.
**DONE (under his §481 "go to the end of the page if we can"):** `page_rules.json pushMaxBlankSeconds` 1.0 → 0.5. Measured: the counterpoint's blank at a page's end now 0.47 · 0.31 · 0.08 · 0.03 s (pages 24 … 27); each page still opens 0.64 s early for the curves' approach — that is the curve's own reach, not blank. Not reprinted (his hold).

## §490 · 2026-11-24 · on paper the curve's arms may split at a page; its impact never

**His words:** *"Can you check … I thought we had discussed this, that I guess is it the impact point? Like the curves can be split, right? They're like Matisse, but impact point shouldn't be split."* — the AI found his two rules in Recombination's log (`septet_LGMF_2026` RUNNING_LOG, 2c): the SCREEN's Matisse cut (an arc split across screens, its impact on the screen before the turn) and PRINT's whole GC (*"full magenta arc start and finish on the page … push entire gc to next page"*). Then: *"okay to split curves on paper, but … only let's split the arms of the arc … you wouldn't want to split any of the like notation words … or split the notation on the go line … and you wouldn't want to split the impact point. But the tails after and before the curve, you can split for the GCs. Is there anything else that is preventing you from splitting at this point or making the page short?"*
**HIS NEW RULE, AS A ROW:** `page_rules.json edge.gc.print` "arms" (was "whole"). **The planner** (`splice.js`): an arms-GC holds only its impact (padded) — the note, its words and its go line stay one whole unit of their own. **The print** (`render.js`): the arc is drawn on every page it crosses, clipped to the page's music; the impact dot only on its own page. The screen and the film are unchanged (they already cut the arc).
**MEASURED:** the counterpoint's pages no longer open early (the reach-back was the whole-GC rule) and end within 0.6 s of the edge (0.59 · 0.10 · 0.18 · 0.21). Seen at the turn 209.81: the flute's descending arm cut at page 24's edge, page 25 opening on its impact and rising arm.
**WHAT ELSE HOLDS A PAGE SHORT (his question):** only in the phase section — a beamed group, a tuplet bracket and the IR's beam-adjacent pairs are never split across a page, and with seven parts in seven tempos one of them is almost always open. Pages 32 … 50 there stay 1.1 … 6.1 s short. Not reprinted (his hold).

## §491 · 2026-11-24 · film4: the waveform as bars

`…/film/switch-demo-film4.mp4` (§487's render) — 487.000 s, 14,610 frames, picture and sound equal and from 0, 9.2 minutes; mix2 under it; the ELEC lane as bars. Three frames read back (60 · 170 · 310 s). It is the current film. The print is held (§487) and will take the bars, the pebbles at rest (§488), the 0.5 s push limit (§489) and the split arms (§490) at its next build.

## §492 · 2026-11-24 · the print rebuilt now (his: "if you need to reprint it now, that's fine … We'll eventually reprint the final version with the instructions"); the beams left as they are

`print/score/Multiplicity-score.pdf` — with the bars, the pebbles at rest, the 0.5 s push limit and the split arms. His word on the phase section's short pages: *"okay, leave the beams"* — a beamed group or tuplet is still never split across a page. The final reprint comes with the performance instructions.

## §493 · 2026-11-24 · the instructions: the percussion line pared

**His words:** *"For the percussion, take out the scraped and take out the poly beater and rubber mallets and for bass drum, you can put rute. And I don't know if what typically if you see mallet or just rute, whatever the convention is. And then take away crotales bowed and the hard mallets from glock."*
**DONE:** the Instrumentation line now reads *spring coil, China cymbal, brake drums, bass drum (with rute), crotales, glockenspiel*. **THE CONVENTION (the AI's answer):** an instrument list names a beater only when it is not the instrument's usual one — the felt mallet on a bass drum is, the rute is not — so "with rute" alone tells the player what to bring.

## §494 · 2026-11-24 · the instructions: the piano line out of the instrumentation

**His words:** *"piano, just take the whole piano thing away."* — read as the Instrumentation section's piano line (keys, muted and plucked strings, no preparation): removed. The counterpoint's key of words (pizz. · (mute)) stays.

## §495 · 2026-11-24 · the instructions: the electronics in one line

**His words:** *"For the electronics, you can just say electronics is fixed media synced with the animated score."* — the section now reads *The electronics are fixed media, synced with the animated score.* The AI's two paragraphs went (the second described the waveform as style F, no longer the drawn style). Asked in passing whether orange pitch curves are used: only in Section One's beating glissandos; the line stays (his "just leave it").

## §496 · 2026-11-24 · the instructions: Audible Beats in his own words, no second person

**His words:** *"Each player holds its long tones against a sine tone, creates audible beating against it, and then end the sentence there. Get rid of using small glissandos. I'm trying to avoid … the you. Is this the way I stated it in the other instructions, a useful analogy, you play two strings? … If it is, then you can keep that you. And then just get rid of that whole sentence, you're not listening for tiny change. But better to replicate my language that I used in previous piece."*
**FOUND:** his Recombination page (`septet_LGMF_2026`) has the analogy with "You would play two strings …"; Scattered Substance and the tubas put it without "you". **DONE:** the first sentence ends at "against it"; the analogy is Recombination's first two sentences verbatim; the "not listening" sentence gone; the curves' paragraph without your/you ("the lane · the glissando · the distance from the sine's pitch · the volume").

## §497 · 2026-11-24 · the instructions: the curves of Audible Beats, his dictation

**His words:** *"So the sine tone is the purple line at the top of the lane. The orange curve represents beating speed. The maximum beating speed is at the player's discretion. The orange curve describes from unison, no beating, to maximum beating. The green curve represents volume. Just put that in there. It probably needs to be rewritten."*
**SET AS:** *The sine tone is the purple line at the top of the lane. The orange curve represents beating speed, from unison with no beating at the bottom of the curve to maximum beating at the top. The maximum beating speed is at the player's discretion. The green curve represents volume.* — his sentences, the two on the orange curve joined; "at the bottom … at the top" the AI's, from how the curve is drawn (its height is the bend from the sine).

## §498 · 2026-11-24 · the instructions: the go lines in his latest words

**His words:** *"the dotted vertical go lines, all that. Just, can you grab my language from before? And let's just use the precise language I used before in the most recent version of this concept."*
**FOUND:** the concept in four pages — the tubas (08-31) · Scattered Substance (09-17) · Recombination (10-03, the latest) · not in Approaching. **DONE:** Recombination's sentence verbatim: *During the gradient curves, the dotted vertical go-lines are rearticulation points — the rearticulation should happen at the go-line: breathe or retake the bow before, and rearticulate at the line.* Its second sentence (the animated dial counting down) left out: this score draws no dial (the opening's animated kinds are the curve meters only, measured). The AI's sentence on the pitch curve across a breath went with the paragraph.

## §499 · 2026-11-24 · the instructions: the bowed crotales

**His words:** *"The bowed crotales will hold their pitch, the sine tone is changing pitch and will create beating against the held pitch in the bowed crotales."* — set as *The bowed crotales hold their pitch. The sine tone changes pitch and creates beating against the held pitch of the bowed crotales.* (his sentence in the present tense, split in two), replacing the AI's line.

## §500 · 2026-11-24 · the instructions: no section numbers

**His words:** *"Can you take out all the section 1, section 2, anytime we refer to a section? We don't need to do that."* — the four headings lose their "(Section …)"; "In section one," goes; "The final section consists of …" becomes *Every part plays a steady pulse, each in its own changing tempo. Each part's tempo is marked in its own lane …* (no "your", his §496 wish); "The section is f throughout" becomes *The dynamic is f throughout*; the two notes at the bottom named by their material. The quoted words of earlier pages are left verbatim.

## §501 · 2026-11-24 · the instructions: the piano solo in his words, a picture of the hand shapes, his scattered-strike text

**His words:** *"The piano solo uses a form of action notation using animation to describe playing action. the notation in a box before an action describes a cluster of notes or a handshake to use for the action in either hand. And then if you can get a small clip of those two boxes in the left and right hand with a little bit of context … the pianist will use the notes in the hand shape to execute the action. We can keep the ribbon paragraph and just get rid of everything, a ball rides a curve and after."* · *"Pebble drop, can you pull my precise text from the scattered strike from one of my recent scores? Just check them in order and get the most recent, and then I'll edit that text when I see it."*
**DONE:** the opening paragraph his ("handshake" read as hand shape) · the picture `images/solo_handshape_186.svg`: the two boxes at the start of the long ribbon, 186.5 s, a crop of the zoomed-out film's own page (the command in the page's comment) · the ribbon paragraph ends at "how busy the hand is" · the pebble drop carries his scattered-strike text VERBATIM from the most recent page that has it — Approaching (2026-10-11; Recombination's page has none) — for his edit.

## §502 — 2026-11-24 — the instructions: three piano-solo pictures (ribbon · pebble drop · repeat)

- His ask: *"for each of these things, please get images. So an image of the ribbon with the ball in motion somewhere. Image of the pebbles, like mid-drop. And then the repeat, full shake mark."*
- How: `tools/export_video.js --dumpPage` gained `--frameAt T` (the page plus its moving layer at time T). Zoomed-out solo view (`--z 1.4 --pageSeconds 7.56 --zoomAnchor 186.5`), frames at 187.6 · 170.2 · 180.5 s, each cropped to the piano rows.
- Files: `docs/notation_instructions/images/solo_ribbon_187.svg` (the ball on the long ribbon at the go line) · `solo_pebbles_170.svg` (the pebbles mid-flight in their box) · `solo_repeat_180.svg` (the boxed chord and its full row of marks). Each placed under its paragraph; the "IMAGES TO MAKE" note removed.
- His other ask, same message: better names for "repeat" and "shake marks" — options given in the chat; his choice to come. *"that repeat sentence is fine. Repeat the boxed notes. We'll keep that."*

## §503 — 2026-11-24 — the instructions: cut to what the notation does not say

- His words: *"since I talked about the [chord] symbol above, you can get rid of that sentence. move the dynamics or relative sentence somewhere, maybe at the top. That's more of a general instruction for the whole piece. And you can get rid of the whole counterpoint section. It's all in the notation."* · *"Take out the tempo mark. That's self-explanatory in the notation. Take out the [dynamic] is f throughout … the number group over [tuplet] … the technical requirements. We'll work all that out if it gets accepted … how to present the electronics … multi-channel … how to sync with the score. But you can leave that out of this presentation first score."*
- Done: the chord-symbol line gone (his opening paragraph of the solo covers the boxes) · "Dynamics are relative" moved to the top, after the opening paragraph, as a rule for the whole piece · the Counterpoint section gone whole (the technique key included) · Multiple Tempos keeps only its first paragraph (no "your" in it) · Technical Requirements gone — the house, the electronics' format and sync are for after acceptance.

## §504 — 2026-11-24 — the instructions: "ripple marks"

- His word: *"You can use ripple marks."* — "shake marks" replaced on the page. The name for "repeat" still open: he wants *"something like rapid repeat, but that conveys the pecking more"*; not "peck", not "rattle repeat"; new options given in the chat.

## §505 — 2026-11-24 — the instructions: "Rapid-fire repeat"

- His word: *"let's go with rapid-fire repeat"* — the piano solo figure "Repeat" is named **Rapid-fire repeat** on the page; its sentence ("Repeat the boxed notes …") kept, at his word §502.

## §506 — 2026-11-24 — the instructions: Audible Beats, two sentences in his words

- His words: *"the [sine] tone generated by the electronics is represented by a purple line at the top of the lane … get rid of during the gradient curves … The dotted vertical lines, no go, are rearticulation points."* Both applied; the rest of each paragraph kept.

## §507 — 2026-11-24 — the instructions: the pebble drop in his words

- His words: *"The pebble drop will be produce a clustered impulse, and the rest of the sentence."* Read as: the paragraph starts at "Produce a clustered impulse"; the Approaching sentence about the ensemble language type dropped.

## §508 — 2026-11-24 — the instructions: the rapid-fire repeat picture whole

- His word: *"A rapid fire repeat image is cut off a bit. Can you get a full one, please?"* The old crop (frame 180.5) cut the last ripple marks and had the go line through them. Re-made from frame 179.6 (the go line not yet at the figure), crop viewBox 1482 770 181 330: the box, its sharps and the full row of ripple marks.

## §509 — 2026-11-24 — the instructions: Multiple Tempos in the tubas' words, his edit

- His words: *"replace that paragraph with the 7 tubas, the final section of the piece … The pulse you are playing in is marked with hashes at the top of the staff. And the animated bouncing ball provides a conducted pulse to assist with accelerations, decelerations, and rapidly changing tempos."* The paragraph now: the tubas' first sentence ("of the piece"), then his new second sentence.

## §510 — 2026-11-24 — the instructions: the percussion line

- His words: *"bass drum with [rute] for rim shot. And then a final sentence can be all other mallets are at the player's discretion."* Applied to the Instrumentation's percussion line ("root" heard as rute).

## §511 — 2026-11-24 — the instructions: the curve's dynamic header; the anonymity scan

- His words: *"In the audible beats section, it says the green curve represents volume. The notation header indicates the dynamic range, and just that whole rest of that part from recombination, but don't include, sometimes there is a fade in or fade out."* Added after "represents volume": Recombination's two sentences (the header; ppp → f), the fade sentence left out.
- The anonymity scan he asked for: the visible text above the Notes for Revision names no person, no other piece, no account, no link; the title is "Performance Instructions — Multiplicity"; the four pictures carry only the lane labels. Flagged: the Notes for Revision name his earlier pieces (deleted before print, as planned); the HTML comments name pieces and paths (not printed; the page source is never sent).

## §512 — 2026-11-24 — the waveform as light fill with an edge (print); the notes deleted

- His words: *"let's try light fill with an edge. If you can update the print score with that, then I'll just take a look at how it looks in there before we redo the film."* New style `lightFill` (his C of the six) in `notation/lib/elec_wave.js`: the same shape, a pale body `#C9CFD4` and a 1 px edge in the wave's gray; `rules.json objects.elecWave.style` = `lightFill` (was bars, kept in styleWas3). The print rebuilt (`node tools/print_book.js`: 2 front pages + 51 music pages, 3.9 MB). The film is NOT re-rendered — at his word after he sees the print.
- *"I think all the notes are done, just delete those."* The Notes for Revision section removed from the instructions page.
- A slip: my first cut matched the page's top comment and emptied the body; restored from the commit (§511 — no saves from the page since, no versions folder) and cut again at the right place. Nothing of his lost.
- His ask for a top-level copy edit: given in the chat, nothing changed on the page.

## §513 — 2026-11-24 — the instructions: copy edits 1 · 2 · 3 · 6

- His word: *"go ahead with 1, 2, 3, 6"*. Applied: "should be heard above the electronics" · "For example, ppp with an arrow to f means the volume change for that curve spans from ppp to f" · "should happen at the line" · "Gradient Curves:" (colon, as the others). Item 4 (hashes at the top of the staff) not taken up; item 5 (shaking stutter) — he asked for the two versions in full, given in the chat.

## §514 — 2026-11-24 — the instructions: "rapid-fire stutter"

- His word: *"go ahead with the rapid-fire stutter"* — copy edit 5: "a quick, shaking stutter" → "a quick, rapid-fire stutter", to match the name. (§513's check of the opening sentence: verbatim Approaching's final page, title changed; Recombination had the earlier "served from the cloud" wording.)

## §515 — 2026-11-24 — the waveform fit to each page; the media made again

- His words: *"the humps that come out of the big gray line are too slight … can you advise about if more contrast can be made in the … more consistently loud sections?"* The AI's read, measured from bank/elec_wave.json: every page was scaled to the WHOLE PIECE's peak; page 38 reaches about 40% of it, drawn at 13 … 59% of the lane through the curve 0.6; page 13 reads well because the solo has real silences. Recommended: each page fit to its own loudest moment, the gain capped at 4x. His: *"ok with your recommendation let me see a sample first pls"* — the sample (page 13 unchanged; page 38 about a third taller), then *"that's all good."*
- Built: `elec_wave.js` rule `fit: page` · `fitMaxGain 4` (rules.json elecWave). The print and the film (switch-demo-film5) made again at his word *"regenerate all the media, new film and the new print score"*.

## §516 — 2026-11-24 — a video component: the assessment (double Dutch read; the data; the proposal)

- Prompt: his SW-168 (verbatim in COMPOSITION_NOTES) — a video for Multiplicity from his double Dutch (openFrameworks), following the electronics, the streams on different ropes, a rubber-band physics (tension → faster, narrower), a change of form for the final section, NOT a visualizer; a few days; a workshop page with audio.
- **Double Dutch, read (`C:\Users\jwloy\GitHub\doubleDutch`, sketches 001 … 006 + three .scd):** openFrameworks with ofxBullet (soft-body physics), ofxPostProcessing (bloom), ofxOsc. Nine ropes of 27 nodes, pinned at both ends across the width at random height and depth, sagging under gravity. Each node drawn as a "tumbleweed" — a wireframe sphere with its vertices scattered, re-scattered on a random 20 … 120-frame timer. One colour per rope from a painter's palette (de Kooning Seated Woman · Kandinsky · Jasper Johns Target · Klee Southern Tunisian Gardens · white); SuperCollider changes the palette rope by rope every 80 … 150 onsets. LIVE PITCH drives it: each rope owns a pitch band; a pitch in the band kicks the rope (an upward force at its middle). The form is five modes on a clock (110 · 160 · 210 · 300 s): pinned → ends released, kicks pushed in a direction chosen every 0.5 … 1.1 s → gravity off → each node grows a comb of short hanging sub-ropes (the "dissolve") → all white. Sketch 001 moved the rope ends by amplitude. Nothing in 006 turns like a jump rope; the jumping is the kicks.
- **The data this piece holds (the electronics' timeline, from the save `piece-FirstDraft-Final-D-ctptCello`):** Elec 1 … 4 as four stems (`elec_stems.json`) — 5 … 144 s the OPENING: the four players of Sound Lab 2025-04-08c each on its own lane (archtop · baritone guitar · drums · piano, "continuous" stems), then the orchestrated mix 85 … 144; 147 … 266 granular beds B4 · B6 under the solo and the counterpoint; 269 … 477 four granular beds G5 · G9 · G8 · B2. The six SINE TONES 15 … 144 s, one per player (fixed pitches, hairpins 101 … 144, the mallets' gliss). THE CAPTURE'S ANALYSIS per player (`bank/set/2025-04-08c/analysis.json` · `capture/accents.json`): ~1000 onsets each, the accents, density · loudness · brightness curves, an implied pulse. THE GRANULAR RECIPES (`keep/granular/manifest.json`): ~16 000 grains a bed, each drawn from a named hit of a named player (drums/01 · piano/03 · archtop/05 …), seeded — the grain list can be made again exactly. THE FINAL SECTION: the seven players' tempo form (`bank/phase_form.json`: the drift at 68, glides, a unison at 78 at 341 s, the fans) and every beat of every part in the page `s3-phase`.
- **The AI's proposal (given in the chat):** port to the browser (Three.js + a deterministic rope of its own — not Bullet, which is real-time and never the same twice), rendered OFFLINE frame by frame on the score's clock at 3840 x 2160 with the bounce, by the film's own route; the workshop page is the same code live with the audio. The ropes are the PLAYERS of the capture — kicked by their own onsets and accents, their nodes re-scattered by the grains drawn from them; the sines are TENSION (a held sine draws its rope taut). THE CHANGE OF FORM at 277.8: the ropes are TURNED like jump ropes, one per player of the final section, one turn per beat — tempo is turning speed, the rubber band's tension rising with it (faster, narrower); the unison at 341 turns them together; a second change at the chords 460 … 480 (the comb dissolve or the white). His word awaited on the reading and on step 1.

## §517 — 2026-11-24 — the video workshop, step 1: double Dutch's look in the browser

- His word: *"yes, go ahead with step 1"* (§516's steps).
- Built: `tools/video_workshop.js` (port 5660; launch name `video-workshop`) serving `workshop/video/index.html` and the demo recording (the submission MP3, Range). The page: Three.js 0.160 (from the CDN, pinned), its bloom (UnrealBloomPass), a rope of its own — Verlet, a fixed step of 1/120 s, 24 constraint passes, the ends pinned — so the same input gives the same motion (Bullet never does; the offline render needs it). Double Dutch's parts carried: nine ropes across the width at seeded heights and depths; a TUMBLEWEED at every point (a sphere's triangle edges, its points scattered within a random radius), a random number of a rope's tumbleweeds re-scattered every 30 … 120 frames; the five palettes with their painters' names; the kick (up and toward the viewer, strongest at one point, falling off either side). Step 1 kicks at random (a rate per rope); the data comes at step 3. Knobs for each, saved to `bank/video_look.json` by "Save this look".
- Tuned once in the AI's pane: the bloom at the first numbers (1.1 · 0.55 · threshold 0.05) washed the picture out; set to 0.5 · 0.25 · 0.35, line opacity 0.75. The audio loads (487 s). Seen at 1280 x 760 with a "Kick all".

## §518 — 2026-11-24 — the video workshop: the rope at rest; the tremolo data found

- His words: *"the motion is slightly clunky, especially at rest … slightly less agitated at rest … something about its attachment point … big polygons that come out of the attachment points … the polygons don't feel part of the rope … smooth out some of that just basic behavior … pretty subtle motion at rest."* · *"I don't want to mess with the dials … any dial change to … come from my … sense of how things should be, but also from the actual electronics and the data there."*
- Done in `workshop/video/index.html`: NO random kicks at rest (the rate 0 — a kick will come from the music, step 3); a BREEZE at rest (two slow sines per rope, its own phases, 0.12 cycles a second, strongest mid-rope); damping 0.985, gravity 500; a re-scramble GLIDES from the old shape to the new over 40 frames, and comes less often (90 … 300 frames); the tumbleweeds SMALLER TOWARD THE PINNED ENDS (taper 0.8) and never wider than the gap to the next point; a faint LINE through the points in the rope's colour (opacity 0.3); the picture drawn between the last two physics steps (no judder). Seen once on the throwaway port 5661.
- His other ask, the tremolo: what the data holds — the opening's four stems (Elec 1 … 4, 17 … 89 s; the orchestrated mix of all four 85 … 144 s) are each a player's TREMOLO on the stretched bed (`H:/switch_2026/audio/set-2025-04-08c/keep/opening/`): per player a speed curve 2 … 20 Hz from that player's density in the session, a depth 0.65 … 1 from its loudness, its accents, a hardness curve, all ten values a second (`bank/set/2025-04-08c/tremolo/trem-Dbr-…-<part>-….json`), and its place in the field (an azimuth swinging 40 … 45 degrees over 150 … 230 s). Proposed in the chat; his word awaited.

## §519 — 2026-11-24 — the video workshop: the tremolo drives the four player ropes

- His word: *"yes, hook up the tremolo data"* (§518's proposal).
- `tools/video_data.js` → `bank/video_data.json` (336 KB): per player of the session (archtop · baritone guitar · drums · piano), ten values a second of SCORE time: ON (the stem brick's fades, and in the orchestrated mix 85 … 144 s the mix's own gate — on while the player was within 6 dB of their median loudness in the session, smoothed 3 s, faded 2.5 s, redone from `analysis.json` as `orchestrate_mix.py` does it) · SPEED 2 … 20 Hz · DEPTH 0.65 … 1 · HARDNESS · AZIMUTH (the voice's swing in the field) · the ACCENTS in score time where the player sounds. Sounding: archtop 121 s (128 accents) · baritone guitar 98 s (98) · drums 90 s (110) · piano 76 s (88). The accents and curves read as MATERIAL time (the brick's start and offset added) — an assumption from the files' shape, not measured against the audio.
- The page (ropes 1 … 4 = the four players, in that order): the QUIVER — a standing wave on the rope, its speed the tremolo's scaled to 1 … 7 a second (a picture cannot show 20), its size the depth, nothing while the player is silent, a second faster shape on top; each ACCENT a kick, stronger with the hardness; the AZIMUTH moves the pinned ends forward and back (±300 at 90 degrees); a busy player stirs its tumbleweeds sooner. A legend at the top left names each player, its colour, its speed and depth live. The knobs set only the scale. Seen once at 60 … 63 s on the throwaway 5661: the four players read live, no errors.

## §520 — 2026-11-24 — the video workshop: the tremolo as a cranked jump rope; speed through tautness

- His words: *"it's kind of stiff and it's almost like it's wire. Maybe tremolo corresponding to like a push … like a swing … a like sort of cranking motion … incorporate the tautness … as it speeds up, or it speeds up through tension … more natural motion, more of a jump rope swing kind of motion. And maybe the tremolo acceleration achieved through tautness."*
- Rejected: §519's QUIVER (a drawn standing wave laid over the rope) — it moved like wire because nothing in it was physical. Removed.
- Built (the four player ropes only): THE CRANK — both ends turn together in a small circle (38 units) like a jump rope's two handles, and the rope itself swings round from the physics; its turning speed follows the tremolo, 0.35 … 2.4 turns a second from the tremolo's 2 … 20 Hz (a little less at low depth), WITH INERTIA (1.2 a second: pushed up to speed, coasting down); a silent player's crank coasts to rest and the rope hangs. THE TENSION — the faster it turns, the further the ends pull apart (to 70 units each side), so a rope of 1.1 slack narrows its loop as it speeds up. THE ACCENT — a push on the crank (+0.8 turns a second at full hardness), the kick kept small (250). The player ropes have their own air (0.996) so a turning rope is not braked. Seen once at 95 … 108 s on the throwaway 5661: the ends crank and pull (0 … 12 units at ~6 Hz tremolo), the archtop at 13 Hz turning 1.9 a second, the loops swinging in depth.

## §521 — 2026-11-24 — the video workshop: the frame centred; the other five ropes follow the ensemble

- His words: *"that motion's good. First, can you center it better so the lowest one doesn't hang down below the bottom, and there's not as much black space on the top? And then let's do the other five following the instruments … either do an estimate of the sign speed beating, or … a reading of the audio … scaled … have those correspond to the instruments."*
- The frame: the camera looks lower, a knob `frameY` (−160; it was 0).
- The five: read from the SCORE, not the audio — the save's notes are exact and the same every render; a reading of the audio would mostly be its loudness (the visualizer he does not want). Five groups: winds (flute · clarinet · alto sax) · percussion (the battery and the mallets) · piano · violin · cello — ropes 5 … 9. Their speed: in Section 1 the BEATING of each note against its sine (the breath's cents from `properties.sine.breath`, the sine's pitch from its brick, beats = f · |2^(c/1200) − 1|, 10 beats a second = full speed); elsewhere how BUSY the group is (onsets a second over 1.5 s against the group's own busiest, 95th percentile). Depth and hardness from the written velocity; the accents the notes at velocity 96+ (winds 967 · percussion 640 · piano 758 · violin 617 · cello 613); an ensemble accent pushes at 0.3 of a session accent's push (they are many). `tools/video_data.js` → `bank/video_data.json` (807 KB). The legend names each rope electronics · … or ensemble · …. A stray apostrophe in a knob title broke the page once; fixed. Seen at 100 … 107 s on the throwaway 5661.

## §522 — 2026-11-24 — the video workshop: the ensemble ropes shaken, not cranked

- His words: *"the instrumental ones barely move … more tension or more vigor … moved more, but in a slightly different way than the tremolo ones … a more even increase in speed … definitely more amplitude … give some things a try … more vigorous, but still give it a different feel."*
- Measured first (`bank/video_data.json`, the share of full speed while sounding): the ensemble's medians were low — winds 0.30, percussion · violin · cello 0.18, piano 0.10; Section 1's beating 0 … 0.14 (each held tone's breath starts at 0 cents, and 10 beats a second was full speed).
- The data: full speed at 7 beats a second; a note with no breath written takes its own text ("0 → 6.4 beats/s", the crotales' sine), ramped across the note; the busyness LIFTED by a square root (a median 0.18 reads 0.42).
- THE DIFFERENT MOTION: the ensemble's ropes are SHAKEN like battle ropes — one end moves up and down (alternate ropes from alternate ends), the other is pinned and pulls away with speed (to 45), the waves run along a tauter rope (slack 1.035); the shaking 0.7 … 4.2 a second, speeding up EVENLY (an inertia of 0.8 against the crank's 1.2); its size 95 at full velocity; an accent a SNAP (a moment of up to 2.5 x the size, fading in about 0.4 s) instead of a push. Seen at 215 … 221 s on the throwaway 5661: shaking 0.4 … 1.9 a second, the waves visible.

## §523 — 2026-11-24 — the video: his note for the piano solo (SW-169); the proposal

- His note verbatim in COMPOSITION_NOTES SW-169: the solo's ropes taut, shaken from one variable end, one fixed; ripples from the piano's notation (the rapid-fire, the curve "already self-describing", the static notation and the rocks); loops sent down; ONE long rope as a daisy chain — a loop runs down one rope, and at its fixed end it does not bounce back but continues on the next rope, from the same side.
- The data in hand: `bank/piano_solo_done.json` gestures — 15 ribbons (each with its own curve), 14 strikes (the pebble drops), 8 stutters (the rapid-fire repeats), plus the standard figures in the page's notes.
- The AI's proposal (in the chat): the chain as a WAVE THAT IS HANDED ON — each rope's far end, instead of reflecting, passes the wave's height to the next rope's near end after the time it took to cross (no reflection: the end is absorbing); each figure a different shape sent from the head of the chain: ribbon = one long loop shaped by its own curve · rapid-fire = a burst of small fast ripples for the length of its marks · pebble drop = a scatter of little flicks at the drop · a standard note = one clean pulse, its size the written dynamic. His word awaited.

## §524 — 2026-11-24 — the video workshop: the frame follows the ropes; the crescendos and the beating drive the ensemble

- His words: *"the center is perhaps a little too high … a way to get it pretty centered … one row in the middle, it's like one of the yellow gold ones, isn't moving at all. Is that because we have too many ropes? … the beating motion still isn't quite right. It needs to be even more responsive, especially for the crescendos … more motion even to the … slowest beating as well, all the way up to the fastest … those crescendo … the ropes hardly move at all."*
- The still gold rope: the ENSEMBLE PIANO rope (the palette's seventh colour), silent in that passage — the legend said so; not the number of ropes.
- The frame: it now FOLLOWS THE ROPES — the middle of their highest and lowest points, eased (0.6 a second), the view moved by the difference so a turned view stays turned; the knob a nudge (0).
- The data: each note's own WRITTEN DYNAMIC CURVE (its nodes, 0 … 10; p 2.9, fff 10) read where the note is — the Section 1 crescendos 101 … 144 s are p → fff over 5 … 9 s; it drives the size (the depth) and the speed. The beating: a floor of a quarter the moment a pair sounds, full at 6 beats a second (was 7, square-rooted), the crescendo at 0.9 of full speed; elsewhere the crescendo at 0.6. 101 … 110 s now runs 0.26 → 1.00 of full speed (was flat and low). The page: shake size 130 (95), the shaking follows twice as fast (inertia 1.6). Seen at 104 … 109 s on the throwaway 5661: the four sounding groups shaking 3.7 a second, the frame centred.

## §525 — 2026-11-24 — the video workshop: the electronics ropes hidden; a character for each instrument

- His words: *"one of the ropes still isn't moving … the ensemble piano. Okay, yeah, let's just leave it … give it slightly more breeze motion, so it's not completely static … still not quite sure which represents the tremolo, which represents the instruments. So can we just turn off the tremolo ones for now? … change something about each instrument's rope's behavior a little bit … blinking speed or … the type of motion, like the number of nodes … or the smoothness or the amplitude … a different kind of feel … subtle."*
- Two buttons in the bar: "Electronics: off" (the default now) and "Ensemble: on"; the frame centres on the visible ropes only.
- A silent ensemble rope's hand drifts slowly with the breeze (a third of the breeze knob, fading out as the shaking grows).
- THE CHARACTERS (the AI's first reading, multipliers of the shared knobs, his to change): winds AIRY (smaller tumbleweeds, a glide 2.2 x as slow, re-scrambled less often, a sideways sway nearly as wide as the shake, a little paler) · percussion CRISP (fewer points, angular lines at 0.6 the detail, re-scrambles that snap — a glide of 0.12 — 2.5 x as often, the snap dying in a sixth of a second) · piano STRUCK (rounder at 1.35 the detail, the strongest snap 1.5 x) · violin FINE AND QUICK (1.3 x the points, smaller, a shake 1.3 x as fast and 0.7 x the size) · cello HEAVY (0.75 x the points, 1.35 x larger, a shake 0.7 x as fast and 1.35 x as wide, a long glide). Points per rope seen: winds 27 · percussion 23 · piano 27 · violin 35 · cello 20. Seen at 213 … 219 s on the throwaway 5661.

## §526 — 2026-11-24 — the video workshop: a rope for every instrument; the beating in proportion

- His words: *"there are 6 instruments, right? So 7 including the piano. So let's make sure we give a rope to every instrument … cello, violin, alto sax, clarinet, flute, and then the crotales … I think I was wrong about what was going on. So we can make these less vigorous, perhaps … even more corresponding to the increasing and beating … so you can see the change."*
- Seven ensemble ropes: flute · clarinet · alto sax · percussion (the battery and the mallets together — the crotales in Section 1) · piano · violin · cello; eleven ropes in all (the four electronics ropes hidden by default). The winds' one character split three ways: flute the airiest and finest · clarinet smooth and round (more detail) · alto sax warmer, the widest sway.
- THE BEATING IN PROPORTION: in Section 1 the beating alone drives the speed, a straight line — 0 … 8 beats a second is 0.05 … 1 of full speed (no floor, no square root, the crescendo no longer adding speed; it drives only the size). Less vigorous: shake size 85 (130), slowest shake 0.35 (0.7); the shaking follows the music faster (inertia 3). Read on the throwaway 5661 across the crescendo 102 … 110 s: flute 0.55 → 1.18 → 1.86 → 2.56 shakes a second, violin 0.65 → 3.03, cello 0.35 → 1.63 — a steady climb.

## §527 — 2026-11-24 — the video workshop: the electronics ropes alone; the air the moving ropes stir

- His words: *"those are great. Let's keep that … the nodes are drifting a little to the right … just leave it for now. We might have to adjust the horizontal position eventually … can you just show me just the tremolo ones now? And can you simulate maybe a very light breeze from the spinning ropes? … some sort of collective … so that that static rope gets pushed just a little bit based on the activity going on amongst all the ropes. but not necessarily so vigorous."*
- Kept as it is: the ensemble ropes of §526. Noted, not acted on: the drift to the right (his "leave it for now").
- The page opens on the ELECTRONICS ropes alone (the buttons the other way round: electronics on, ensemble off).
- THE STIRRED AIR: each shown rope's activity, 0 … 1 (a cranked rope its turning against the fastest turn; a shaken rope its shaking against the fastest times its size), averaged over the shown ropes, doubled, capped at 1, eased over about two seconds — added to EVERY rope's breeze as a quicker, less regular push (2.3 x the breeze's speed, its strength wavering), the knob "The air the moving ropes stir" at 90. A still rope among busy ones stirs, gently. Loaded once on the throwaway 5661 at 40 … 46 s: the four electronics ropes turning 0.34 … 0.59 a second.

## §528 — 2026-11-24 — the video workshop: all the ropes shown

- His words: *"Okay, good. That's pretty good. Let's see all the ropes now, please."* — the page opens with both families shown again (electronics on · ensemble on); the stirred air of §527 now counts all eleven.

## §529 — 2026-11-24 — the video workshop: the piano solo as one long rope, pulses sent from the piano rope

- His words: *"the piano chain, let's make that one piano rope the initiator … instead of moving the whole rope … sending a pulse … a really long jump rope … tied the end to … a pole … a quick whip … the long rope out of … the combined length of all the ropes … it starts on the piano chain and it pulses to another chain and then to another chain, but always from left to right … a bounce … from the very end of the whole … all 11 ropes and then bounce back … every like strike is sending a kind of slightly different pulse … the ribbons … a wider, broader motion for the curve parts. And then the pulse comes on the impact … the repeated ones are, sort of shakes … the falling pebbles … a bigger, slower upswing and then a whip … give a few different things a try."*
- The data (`tools/video_data.js` → `out.solo`): from `bank/piano_solo_done.json` and the save's piano notes, 148.2 … 196.3 s — 15 ribbons (their impact where he set one), 14 pebble drops (the landing where the run is loudest: its notes' times weighted by velocity squared), 8 rapid-fire repeats (with the hand), and 44 standard pulses (every onset outside a figure, a chord within 40 ms one pulse, its strength the loudest note).
- The page: ONE LONG STRING of all eleven ropes end to end — the ensemble piano rope first, then the others from the top of the frame down — a 1-D wave in two directions (up-down, toward-away), a rope's length every 0.75 s, the far end TIED (the bounce, inverted; a knob lets it go instead), drawn on top of each rope's own motion and faded toward each rope's pinned ends so the pulse leaves one rope and appears on the next. THE HAND at its head: a note a whip (a pulse 55 ms wide, each a little different in width and lean) · a rapid-fire repeat small even pulses, 12 a second, for its length (the left hand downward) · a ribbon a broad swing down and round (a loop) across its span, the whip on its impact · a pebble drop a big slow upswing to the landing, then a downward whip. In the solo the ropes are pulled taut (+50 at the ends) and the piano rope's own shake is off (the chain carries it), both fading in over 1.5 s before the solo and out over 2 s after.
- A fault on the first try, found by measuring the wave: the update read neighbours it had already overwritten and the wave GREW without bound within a second (the stray long lines on his screen). Fixed — every new value from the old ones only; measured after: pulses of 75 … 230 crossing rope after rope, one rope every ~0.5 … 0.75 s, no growth. Seen at 150.8 … 169.5 s on the throwaway 5661.
