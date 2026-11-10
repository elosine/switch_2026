# NITS — deferred small stuff

> Things worth fixing that are **not** blocking the piece (`AI_METHODOLOGY.md` rule 1: fix
> what blocks the work or what will break; record the rest here). One bullet each: what it
> is, what was observed, why it is deferred. Enough context to act on cold. Delete when
> fixed. **Never ask the composer to triage this file.**

## From the start of this piece (2026-10-20, RUNNING_LOG §1 … §4)

### The batteries, classified once at the copy (3.2, 2026-10-20 — RUNNING_LOG §6; the table `tools/port/batt-old.tsv`)

*45 commands on the unchanged copy with the sources' data staged (`tools/port/stage32.sh`, 161 paths from three HEADs): 30 green,
15 red, none a copy defect. A check that reads another piece's pages needs them STAGED; the page-scanning checks (`check_rules` ·
`decisions_needed` · `check_screen_edges`) read ONE piece's pages alone.*

- **GREEN (30):** the tuba-page batteries on staged fixtures of piece 3 (`test_render` · `test_layout` · `test_splice` · `test_pattern_fit`
  · `test_graphic` · `test_stamps` · `ir_validate_battery`; their `tools/fixtures/*_snapshot.json` are hashes of piece 3's pages — regenerate
  with `--update` only when this piece has pages) · `test_animobj` · `test_identity` (on piece 6's `piece-Draft01d`) · `test_snapshots`
  · `test_step_dynamics` · `test_written_pitch` (+ the control) · `accel_calc_check` · `palette_check` (151 on the OLD palette; **202**
  after 3.4) · `roster_check` (310; **251** after 3.4) · `spectrum_check` · `unsaved_check` · `check_ceilings --all` (piece 6's first-sound
  score) · the five print and screen gates on piece 6's official page `approaching` · the three cresc checks · `model_bank --validate`
  (VALID with warnings) · `decisions_needed` · `beating_check` · `drone_check`. **They say the engine is whole, nothing about this piece
  yet** — re-pointed or retired at container 6, when this piece has pages of its own.
- **RETIRED at the fixes commit (`b554f90`) — piece 5's locks and protos, red in piece 6 too:** `eh_figure_check` (`piece-lgmf`) ·
  `sequence_notation_check` (`lgmf-eh-proto`) · `vib_marks_check` (`piece-Recombination-Draft01-done`); with them four generators of piece
  5's cast (`build_lgmf_ref` · `build_lgmf_transitions` · `build_transition_models` · `build_reference_chords`). Piece 6 had already
  retired the twelve of piece 4's cast — FOUR OF THEM ARE THE PIANO'S (`piano_harmonics_check` · `piano_cues_check` · `strike_chords_check`
  · `harm_source_check`): fetch them back from `septet_LGMF_2026` @ `0d70fda` the day a piano tool is used here, and re-point them at
  this piece's cast (H6-17).
- **KEPT RED, bound to another piece's data — re-pointed when its tool is first used here:** `test_surge_run` (reads piece 4's
  `piece-septet` page: 65 of 78 curves on the staged copy) · `sequence_check` (piece 5's `bank/reference_chords.json`, in no one's git —
  a new baseline with `--freeze` when the sequence tool is first used) · `vibes_pitch_check` (12 of 65: its fixtures name piece 5's
  double bass, horn, English horn, trumpet) · `three_body_check` (piece 6's bank on disk: "not a sample of its players in the bank") ·
  `sine_check` (piece 6's four bending lanes — this piece's cast when the sine tool is used) · `strike_check` (`bank/strike_responses.json`,
  piece 6's catalogue — this piece's at its strike section) · `check_rules` 30 of 32 (rule 8 wants a page with a sequence overlay —
  H6-60; the second read at container 6) · `dyn_table_check` 1 failed BY DESIGN (the UVI assertion with no UVI instrument in the rack —
  H6-30; here UVI returns at container 4, so it runs whole then).
- **KEPT RED until container 5:** `probes/selftest_bend.py` · `selftest_bend_analyzer.py` · `selftest_ranges.py` · `selftest_sweep.py` —
  each needs a schedule a probe's dry run writes (`bend_schedule.json` · `ranges_schedule.json` · `sweep_schedule.json`); none was ever in git.
- **Needed the engine (seated after 3.4):** `electronics/tools/page_test.js` PASS · `sine_page_test.js` PASS · `osc.js selftest` pass.
- **Not checks, not run:** `v0_proofs.js` · `range_check.js` · `check_print_pdf.js` · `cresc_test.js` · `cresc_secco_test.js` ·
  `cc7_ramp_test.js` (each needs a file or writes a score).

### From the re-palette and the running app (3.3 … 3.5, RUNNING_LOG §7 … §9)

- **`/bank/strike_responses.json` is a 404 at every load** — `electronics/score/le_strike.js` l. 172 reads the piece's strike catalogue
  at load and falls back to its own numbers; piece 6's file is on the leave list (its catalogue, its numbers). This piece's catalogue is
  written at its strike section (container 7); the 404 is harmless until then.
- **`/api/instructions` is a 404** — the performance instructions' page (`docs/notation_instructions/index.html`) is container 8's; the
  START is piece 6's page (8.5).
- **THE SERVER DOES NOT CREATE `scores/`** — with the folder absent a save is a 500 (`ENOENT`); piece 6 always had it. The folder exists
  here with the day-one stub; a cold clone of this repo gets it with the stub. A `mkdirSync` at the save would be the fix — at his word.
- **Two tooltips still name piece 5's instruments and ceilings** (`morph_panel.js` l. 764 · `sequence_ui.js` l. 1217 — "english horn and
  bassoon about 12 s …"). Rewrite when the ceilings here are measured (container 5).
- **`score/public/cresc_run.js`'s default players and pitches are PROVISIONAL** and its storage keys are still `septet.crescRun.*`
  (piece 4's name; per-origin, harmless).
- **The ceilings of the winds and the violin are GUESSES** (`beating_calc.js`: flute 10 s · clarinet 15 · sax 15 · violin 12) —
  container 5 measures them; the placeholder recipes' ranges and bend ranges likewise.
- **`probes/panic.ps1` defaults to piece 4's ports** (`Flute` · `Fluteb` · `BassCl` · `Piano` · `Vn1` …) — a panic that needs arguments is
  no panic, so the default stays until 4.1 names this piece's ports, then becomes them.
- **The `DEC…` port names inside the bridge's jobs and the Kontakt loaders** (`reaper/bridge/jobs/make_tracks.lua` · `make_perc_tracks.lua`
  · `reaper/kontakt/load_rm_*.lua` · `tools/ricotti_loaders.js`) — they build PIECE 6's rack. Rewritten at container 4 (4.1 · 4.2) from
  the standard name set; meanwhile the project guard (`switch_rack`) keeps every job off piece 6's open project. `tools/build_rack.js`
  still names `septet_LGMF_2026`'s and piece 6's racks as its clone sources — right: those are the racks to clone from.
- **Piece 6's section builders are carried and are piece 6's** (`build_three_body.js` · `build_drone_section.js` · `build_beating_section.js`
  · `build_strike_rig.js` · the audition builders · `strike_*.js` …): they read banks on the leave list (`three_body.json` · `drone_*.json` ·
  `beating_section.json` · `strike_*.json`). Each is re-pointed or retired when this piece reaches its own section (container 7).
- **The three design studies' pages carry no data** (`score/public/signs/` · `language/` · `palette/` read `bank/signs` · `bank/language` ·
  `bank/palette`, piece 6's, left): they 404 their JSON until the device is taken up at container 6, if it is.
- **`print/cover/cover.json` · `print/score/build.sh` carry piece 6's title** (`Approaching`) — container 8.
- **`notation/registry/ensemble.json` is STILL PIECE 6's six parts** — container 6's 6.0. Until then `tools/notate_section.js` refuses
  a Switch~ save (the registry and the score's tracks disagree), which is right. `rules.json`'s `staffLines.ensemble.ranges` are piece 6's
  absolute seconds (H6-20).
- **`bank/presets.json` is piece 6's whole working set** (433 presets, its deals, its kept and audition records) — the page needs a valid
  file at F5; this piece re-makes the set as its music asks (container 7).
- **THE ROLES HELPER (3.10) was NOT built** — the piano-role sites already find the lane by `instKey === 'piano'` in TRACKS (33 sites, 12
  modules), the fallbacks are set (`pianoLane 5, metaLayer 8`): the role IS that lookup. A helper would be a refactor with no change of
  behaviour — his rule, no work not asked for (RUNNING_LOG §7; a deviation line).
- **The bundled font for ♭ ♯ ♮ (3.9, H6-19) — not built at this port:** it changes the notation's look — with container 6.
- **`docs/HOW_WE_WORK.md`'s MACHINE LESSONS carry piece 5's and 6's names and `§N`s** — read them as history; the recipe
  (`docs/VERIFICATION_RECIPE.md`) is re-pointed.

### Open work this start created or uncovered

- **The names of 2.3, confirmed against the code at 3.3** — `docs/NAMING.md` § 1 written. The pitched lane's INTERNAL key is still
  `bowed_vibraphone` (13 sites in 9 app modules, 15 tools, the registry): cosmetic, the label is "Vibraphone"; a rename only at his word.
- **The percussion's instruments are piece 6's eight** (`bank/perc_selection.json` → `ARO_PERC`, on `SWPerc`): the call's list (bass drum ·
  vibraphone · glockenspiel · tam-tam · opera gong · woodblocks · bongos · 2 toms · snare · suspended cymbal) is chosen from at container 4,
  then `tools/apply_perc.js`; the vibraphone's and the glockenspiel's library (Abbey Road? the Ricotti stand-in? Xsample?) his.
- **`.gitignore` names folders that do not exist yet** (`docs/submission/` · `docs/call/` · the stack's) — inert until they do.
- **The UVI how-to is unwritten** (`composition-system/protocol/howto/`; the record is the tubas' and piece 4's) — written at 4.4,
  before the clarinet and the sax are loaded (H6-24).
- **Piece 6's `tools/port/` scripts name piece 6's source and ports** — re-pointed at 3.0 before they run (H6-7); the straggler audit
  greps `decibel_TENOR_2026` and `septet_LGMF_2026` both (H6-15).
- **The home's INDEX and BACKLOG carry the OLD piece numbers** — at his word only (H6-6).

### From the calibration (container 5, 2026-10-23 — RUNNING_LOG §21 … §23)

- **The six carried Abbey Road tracks may sit 1.5 … 3 dB hot.** The two re-measured here (wood blocks · bass drum alt) read +1.5 … +3.7 dB over
  piece 6's figures at the same faders — a uniform offset, so a setting in the disk rack of 10-11, not a round robin. The other six
  (bongos · shime daiko · china · spring coil · suspended · toms) keep piece 6's faders. A 40-second card on them, or his ear.
- **The violin's round robin is on** (his "a": measured as shipped) — velocity 100 read 1.3 dB under 64 on the card. A round-robin-off
  copy of its ordinary preset in all four slots (kontakt.md § 5) if it is heard.
- **The flute's Dynamic Amount is 0.80** (piece 4's hand value) on its Ordinario and copies — its span measured 14.0 dB, the narrowest; 1.00
  would widen it (and need a re-measure).
- **The vibraphone has no technique in the recipe** — the pitched lane's roster is the Ricotti stand-in; the Xsample vibraphone track
  (piece 5's bowed preset 13, trim +2.81) sounds only from its port. Its struck presets: unread, unmeasured.
- **The piano's plucked and Prepared Piano 2 tracks are unmeasured** (faders 0 dB); only its main voice is on the card.
- **The QC battery (the protocol's 5.9) is not built** — not asked.

## HELD FOR THE NEXT PIECE OR THE POSTMORTEM

*(Offers he held — not to be raised again in this piece. The harvest reads this section whole.)*

- ‹…›

### From the icy lab (2026-11-07, RUNNING_LOG §53)

- **The full rack `reaper/switch_rack.rpp` has NO `ELEC RETURN` track** — 6.1's route (`node tools/elec.js route`, then his re-save) was
  never applied in this piece. The lab uses its own one-track project (`reaper/icy_lab.rpp`); the route is applied to the rack the day
  the composer score first sends to the engine.

### From his first pass in the composer score (2026-11-09, RUNNING_LOG §110)

- **CLOSED — the full rack's ELEC RETURN** (the line above, 2026-11-07): `node tools/elec.js route` run 2026-11-09 — the sends and ELEC RETURN
  at track 25; in his save once he presses CTRL+S.
- **`bank/elec_route.json` names the piano's track `Piano`; the rack has no track of that name** (`route` said `NO TRACK named Piano`), so the
  piano has no send into the engine. Harmless until a mic opening sits on the piano lane. The fix is the track's real name in the table, then
  `route` again.
- **The twelve percussion tracks carry OLD sends to ReaRoute 4** (from before the table moved the percussionist to engineIn 5) beside the new
  ones to ReaRoute 5 — so the percussion also enters the engine on the SAX's input (engineIn 4). Harmless until a mic opening sits on the sax
  lane. The fix is `unroute` of the stale sends by hand in Reaper, or a tool that removes sends not in the table.

### From the counterpoint's volume fix (2026-11-10, RUNNING_LOG §136)

- **The glockenspiel has no measured velocity→loudness curve** (none of the pitched lane's mallet voices has): `tools/vol_fix.js` left its 62
  notes as played. The card's measurement on the Ricotti glockenspiel (a few velocities at a few pitches, through the rack, the law's
  method — `protocol/howto/measuring.md`) would let the ladder balance it with the rest; a trim by ear is the quick stand-in.
- *(2026-11-10, §137)* The glockenspiel's `glock_main_hard` now has a measured curve for the counterpoint section (`bank/section_levels/`); the
  card's full measurement of the pitched lane's mallet voices is still open. **And:** the SI2 staccatos' 14 dB of dynamic range — a level map by
  velocity alone pushes them to their softest samples; a per-section CC7 offset per wind is the lever to build if his ear objects.
- *(2026-11-10, §143)* **The piano's Kontakt instance has no curve copies** — ch 2 holds a faint slot (piece 4's plucked piano at a useless
  volume), ch 3 · 4 nothing: a SHAPED piano note (the dynamics law's curve channels) plays nothing. And `PianoPlucked Kontakt` (input ch 5)
  is silent on every channel — an empty or dead instance since piece 4. Both are Kontakt = his hand (PLAN § 1c, the hand steps); the
  recipe's `plucked` is unplaced until then.
- *(2026-11-10, §143)* The call's **opera gong** has no Abbey Road Orchestra instrument (the catalog's nearest: wind gong, tam-tams); the
  rack's tam-tam will stand in until he names a library.
