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
