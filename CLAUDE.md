# switch_2026 — the Switch~ piece

**Title: none yet** (his to give; the file names stay `switch`).

**Composition 7** in the composer's custom-composition-system lineage — THE NUMBERS ARE HIS, since 2026-10-11 (piece 6's
RUNNING_LOG §430, DEC-196), the number always WITH its name: **1** the string quartet `string_quartet_no1-composer` · **2** the two
pianos and two percussion `composition_for_two_pianos_and_two_percussion` · **3** the tubas `for_seven_tubas` · **4** *Scattered
Substance* `septet_2026` · **5** *Recombination* `septet_LGMF_2026` · **6** *Approaching* `decibel_TENOR_2026` · **7** this piece.
(`for_bass_clarinet_harp_and_accordion` is named by its name, not counted — his to say. `composition-system`'s INDEX and the older
repos still carry the OLD numbers, one higher from the tubas on; changed only at his word.)

Written for **the [Switch~ Ensemble]**, for its 2026 call for scores with the Overdrive Festival NYC — due **December 1, 2026**, one
work selected for **April 8, 2027** at Elebash Recital Hall, CUNY Graduate Center. The AI has read the call: he pasted it whole at
the project's opening (RUNNING_LOG §1; the facts in `docs/COMPOSITION_NOTES.md` "The call, in one block"). **THE SUBMISSION IS
ANONYMOUS** — no name anywhere on the score, the recording or the file names (the profile line below; 8.8's record stays local).

**Instrumentation, fixed by him 2026-10-20 (journal D1):** flute · clarinet · alto saxophone · piano · percussion · violin · cello —
seven players, with a conductor and two technologists from the ensemble; live electronics; maybe video animation; maybe quad
diffusion (his words, RUNNING_LOG §1). The call's doublings (bass flute / piccolo · bass clarinet · baritone sax) are available and
not taken. The percussion on offer: bass drum · vibraphone · glockenspiel · large tam-tam · opera gong · woodblocks · bongos · 2 toms ·
snare · suspended cymbal. The piano may be prepared with non-metallic materials only; nothing touches the dampers.

**THE PROFILE** (the new-piece protocol's 2.1 — it decides which of containers 3 … 8 this piece runs; his "1a", 2026-10-20):

- the kind of start: **copy-forward** — from piece 6 *Approaching*, `decibel_TENOR_2026` @ `9796edd` (its code unchanged since
  `ce8665a`; one data file of his is modified in its tree and is never taken — the copy takes the COMMIT)
- the layers taken: **both** — the instrument and the score
- the score type(s): **the animated scrolling score** (pieces 3 … 6's)
- **the live electronics: the shared engine** `live-electronics-system`, taken as a git SUBTREE at `electronics/` by its own recipe
  (`docs/TAKE.md` there) — `electronics/` is OFF the byte copy (the harvest's H6-9)
- **the roles line (3.3 kind C, ONE lookup):** `piano` = the piano lane (the role is ON — the twelve piano-role modules wake up; the
  roles helper is built at the copy, H6-14) · `percussion` = the percussionist's lane(s), decided at 3.0 (piece 6 gave the
  percussionist two: the unpitched lane and the mallets) · no other role
- the protocol version run: **v1 — RUN BY PIECE 6's DEVIATIONS REGISTER** (`decibel_TENOR_2026/docs/PROTOCOL_DEVIATIONS.md`, the
  "for v2" lines, never written back — H6-1); this start's own register is `docs/PROTOCOL_DEVIATIONS.md`; 10.0 at its end writes v2
- **the call's own lines:** the submission anonymous · 5 … 15 minutes · the tech on offer (close mics + DSP · video projection · quad
  diffusion · up to 3 networked cameras · click tracks · networked computing) — what the piece takes of it is the music's, by the
  sketch pad

**What this piece inherits, and how:** THE STACK — piece 6's engine whole (the composer score · the sandbox · the notation engine ·
print · video · the tools · the probes · the Reaper bridge), copied byte-exact at container 3, proven, then re-paletted to this
ensemble (D2). THE IR CONTRACT (piece 4's D9): the composer save is the ground truth; the IR is derived from it by the extractor and
is the single source for every downstream score. THE ELECTRONICS: the engine's generic machinery lives in `electronics/`; this
piece's USES (which note · which effect · which glyph · when · the samples) live in its save and its own folders — § THE SORTING
below. THE LIBRARIES (one fact each from the record, 4.0 — his to confirm at container 4): the flute, the clarinet in B♭ and the alto
sax on **IRCAM Solo Instruments 2** (UVI — installed whole; the flute was piece 4's; the clarinet and the sax are new instruments of
a known family) · the piano from piece 4's and piece 2's record (8Dio Steinway · IRCAM Prepared Piano 2 · the Spitfire Plucked Piano ·
the harmonics piano) · the percussion from piece 2's Abbey Road catalog by piece 6's route, cut to the call's list · the violin from
piece 4's Xsample strings · the cello from piece 6's, measured. Xsample on this machine is the bass clarinet and the solo strings
ONLY (checked 2026-10-20): its clarinet and sax are not owned.

**State of the piece (keep this line ONE line — H6-4; the history is the logs):** **► 2026-10-23 (RUNNING_LOG §21 … §24): CONTAINERS 4 · 5 DONE, 6 SET UP — all lanes sound at one level; the score's registry for eight parts (transposed, the presentation in C; the unpitched staff provisional), a test page valid. THE START IS DONE BUT 10.0 (the protocol's write-back). NEXT: the music — or 10.0 first (journal §2). HE starts loopMIDI before Reaper.**

## READ FIRST — how to work here

**`docs/AI_METHODOLOGY.md`** is the composer's standing instruction on scoping, decisions,
and confidence (inherited unchanged from piece 3 by way of 4 · 5 · 6). It governs everything below
and outranks the working-preference docs where they conflict. In short: fix what blocks the
piece and flag the rest to `docs/NITS.md` · don't make the composer decide minutiae ·
prefer one robust build over a fragile one · **a confidence claim must be verified in the
running app** · no clear evidence means no diagnosis.

The composer's own rule for a port (said of piece 4's, 2026-09-03; it holds here):
*"I don't want to get too bogged down in technical details of porting and code and such,
but I want to do a good, solid job and not leave out things now that might bite later ...
leaving everything we can for when the time comes."* Keep the conversation at the
conceptual level; consult the code yourself. **His word at this start (2026-10-20):** *"lets do a thorough and competent job but
efficient to get started asap, most things should be in place and shouldn't involve too much new build."*

**How he reads (his user-level CLAUDE.md, 2026-08-24):** succinct
language, clear spatial division between chunks, short lines, one idea per chunk, bullets
first. A one-line TL;DR leads any reply over two paragraphs. One step at a time.

**A NEW NOTATION BEGINS WITH A DEVICE SHEET** (`docs/PLANNING_METHOD.md` § THE DEVICE SHEET): the rules are
`notation/registry/rules.json`, read through the generated `docs/ENGRAVING_RULES.md`; change a ROW, never a code number.
Piece 6's `docs/NOTATION_SCHEME.md` is the pattern for an electronics piece's organised notation doc (H6-37).

**How to put things to him** (his user-level CLAUDE.md, 2026-10-03): plain words · what it IS, what he is meant to
understand, THE ONE DECISION · no vocabulary the AI coined · a one-line answer must be possible · one topic at a time ·
IDs always with their names · questions as lettered options in the chat, never a picker.

## Orient from docs, not from scanning

- **What the pieces share — the index, read at every session start:** `composition-system/INDEX.md`
- **ANY WORK ON THE SOUND PATH — READ THIS FIRST:** `docs/DYNAMICS_LAW.md` — the two kinds of note, the fader on the curve channels;
  the engine's processing sits DOWNSTREAM of that sample and must not undo it
- **What now / what next:** `docs/PLANNER.md` — the **NOW ►** line, then the outline
- **Living plan:** `docs/PLAN.md` — stable IDs; rules in its header; its § 0 is the protocol, for this piece's profile
- **Session state, decisions:** `docs/PROJECT_JOURNAL.md` — §2 Resume Here first
- **The lab journal:** `docs/RUNNING_LOG.md` — append-only, written as the work happens; **a bare `§N` is THIS piece's; piece 6's is `#6 §N`**
- **The sketch pad:** `docs/COMPOSITION_NOTES.md` — his musical ideas, verbatim; it opens with the brief for the three electronics
  pieces (LG-340 … 345) and the two notes he made for this piece while writing piece 6
- **What piece 6 handed to this piece:** `decibel_TENOR_2026/docs/HARVEST.md` — H6-1 … H6-62, his read "all as proposed" (2026-10-20)
- **Building a plan item / analyzing an issue for the plan:** `docs/PLANNING_METHOD.md` — three phases, fixed formats
- **Where this start left the protocol:** `docs/PROTOCOL_DEVIATIONS.md` — one line at the moment of each deviation
- **Faults met while composing:** `docs/SWEEP_LIST.md` · **Deferred, real but not now:** `docs/NITS.md`
- **The performance notes — what they must cover, collected as decided:** `docs/PERFORMANCE_NOTES.md`
- **Working preferences & routines:** `docs/HOW_WE_WORK.md` · `docs/SESSION_PROTOCOL.md`
  · `docs/SESSION_HYGIENE.md` (clear between chunks; the docs are the handoff) · `docs/VERIFICATION_RECIPE.md` (how to verify in
  the running app without touching his work — re-pointed at 3.3)
- **The morph tool's memory:** `docs/MORPH_NOTES.md` (carried while the tool lives)
- ‹this piece's own pointers, added as the docs arrive with the code (3): `NAMING.md` · `RACK_SETTINGS.md` · the tool docs · the notation standards›

Do NOT scan or analyze the codebase unprompted. Name the question first, then read only
what answers it. High bar for subagents / background processes.

**After `/clear` + `/postclear` (his standing rule, 2026-09-11):** play back, then **STOP
and ask**. No edits, no builds, no tool calls beyond the resume reads. Start only on his
word (`/postclear <an instruction>` = start after a short playback). At `/session-start`: orient, agree the agenda, then work.

## Standing practice: the lab journal (composer, 2026-09-03 — not optional, never asked for)

> *"I'd like to keep a running journal like lab notes, so I can look back on decisions or
> comments, theory, philosophy, etcetera, or how we actually made something, if I wanted
> to write a paper later about this — and I would expect the AI agent to do this
> automatically as a habit."*

The rules, adopted from `live-electronics-engine` (its CLAUDE.md and `docs/journal/README.md`):

- **When:** at the end of any exchange that produced a decision, a result, a rejection, a
  measurement, a theoretical or philosophical point, or a question worth remembering.
  Not at session end — by then the reasoning has blurred.
- **What each entry carries:** what prompted it, in the composer's words, quoted not
  paraphrased · what was tried, in order · the numbers · what was rejected and why (dead
  ends at the same weight as successes) · what was decided, and why that rather than the
  alternative · corrections as NEW entries, never edits.

**EXTENDED TO THE COMPOSING ITSELF (composer, 2026-09-18):** *"could you remember to take
journal notes during the comp process and remind somehow future agents to do the same, lab notes so if I want to come back
and write a paper on how I wrote this piece."* The lab journal does not pause when the building stops and the WRITING
starts. Every compositional exchange that settles something goes into `RUNNING_LOG.md` as it happens — the material chosen
and why, what was tried and rejected, what he heard, the numbers behind a harmonic or rhythmic decision, the theory or the
reference behind a move. His musical ideas still go to `COMPOSITION_NOTES.md` verbatim; the RUNNING_LOG is where the
REASONING and the process live. **The test: could someone write the paper "how this piece was written" from the log alone?**
Future agents: this is not optional and he will not ask for it.

**THE ENGINE'S LOG RUNS BESIDE IT** (piece 6's practice, carried): what settles the ENGINE (a mechanism, an effect's design, a seam)
goes in `electronics/docs/RUNNING_LOG.md` once the engine is seated; what settles the PIECE goes here; each cites the other.

- **Append-only.** The journal is the record of how the thinking went; it is never tidied.
  Current state lives in the plan, the journal §2 and the READMEs, which are rewritten freely.
- **The sketch pad is the same habit for musical ideas:** every compositional idea the
  composer voices goes into `docs/COMPOSITION_NOTES.md` verbatim, dated, the moment it is
  said — with the AI's reading kept separate and marked as such. This piece's notes are **`SW-N`**; a carried note keeps its own ID.

## Standing practice: the morph notes (composer, 2026-09-06 — piece 4's CN-29)

> *"I want to institute a process where we're taking notes in a central document that will inform the eventual revision."*

Every remark about the morph tool — an awkwardness, a wish, a piece-specific adjustment made, what an all-purpose tool would
need — goes into **`docs/MORPH_NOTES.md`** §3 the moment it is said, dated, verbatim, the AI's reading marked. The tool is
adjusted for the current use now; the file is the memory for its revision into *"an easier to use all purpose tool"* (the home's
BACKLOG H-36). Not optional, never asked for — the lab journal's rule, for one tool. The file was carried WHOLE from piece 4 by way
of 5 and 6; piece 6 never used the tool. Whether this piece does is the music's.

## Standing practice: THE SORTING — where each thing goes is the AI's to decide (composer, 2026-10-04, piece 6's rule — carried)

> *"my hope is that AI can organize which things belong where. So for the live electronics is mostly what I'm talking about.
> We'll design the live electronics or the triggering systems, etc., and then you'll sort out which belongs in its own repo
> and how to put it there. And then what belongs here, or maybe it's a copy, but I would like AI to sort that out so I can
> just work uh, seamlessly without having to make too many decisions about what code goes where."* (`#6 §2`)

The rule, for every session:

- **He designs the music and the devices; the AI places the code.** He is never asked where a file goes, and never runs a
  git step for the engine. He is told in ONE line what went where, his to reverse.
- **The boundary test** (the engine plan's objective 6): does this code know THIS piece — its instruments, its lanes, its
  save, its names? → the piece (`score/`, `bank/`, `notation/`, as always). Does it work for any piece — a capture window,
  a bank, a placement algorithm, an effect, a message route, a drawn kind's machinery? → the engine's folder, `electronics/`.
  The piece's USES of the engine (which note · which effect · which glyph · when · the samples themselves) are the piece's.
- **A conversation only when the boundary is genuinely unclear** — one question, plain words, his one-line answer; never
  before each build.
- **The engine's repo is kept in step by the AI at every wrap** (`git subtree push --prefix=electronics engine main`, then the
  mirror pulled) — never a step of his. A change piece 6 or the improviser piece makes reaches this piece only when THIS piece
  pulls (`git subtree pull`), at its moment, with the batteries and the shield run here.

## THE RHYTHM — next steps · model · clear (standing, composer 2026-08-23; carried whole)

*(It was in piece 3's CLAUDE.md and the copy-forward to piece 4 dropped it, so it loaded
in no septet session for a week and the advice came only sometimes — his own verdict,
2026-09-10: "This was happening for a while, but then is inconsistent." It is carried here
from the first commit, deliberately.)*

**REFINED by him, 2026-09-18 (guidelines, not hard rules — his user-level CLAUDE.md, "The shape of a working reply"):**
*"the next model clear dialog is good, but lets keep that more focused and local, only when we are moving on to something
that needs a model change or clear"* — and *"no more things left to do, or left pending or even whats next unless I
specifically ask."* So **in the CHAT:** model / clear advice only at a real switch point, one or two lines; no next-steps
list unless he asks; replies are a goal heading, a short ✓ trail, the one thing in hand with a brief why per step, and ONE
compact notes section at the bottom for the honest side-matter. **And (2026-09-18, after the key-mapping sweeps):**
*"avoid unnessary extra work unless asked for, so like verifications and such unless we write these into a plan as necessary
verifications and qc"* — no probe, no cross-check, no QC pass that he did not ask for or that the plan does not name as a
required step; if something looks worth checking, ONE line offering it, and he decides. This does not relax
`AI_METHODOLOGY`'s rule that a confidence CLAIM must be verified in the running app — unverified simply means unclaimed.

**AND AGAIN, STRONGER (2026-10-04, piece 6's D13 — `#6 §61 · §65`):** *"no more testing unless absolutely necessary. I'll test
and troubleshoot when I'm writing, when I'm composing."* **A build is proven ONCE, by the one thing that proves it, and stops** — no
second proof of the same claim, no check that needs his hands unless he asks. A fault shows when he composes: it goes to
`docs/SWEEP_LIST.md` and is fixed there.

**In the DOCS nothing changes:** journal §2's NEXT STEPS ·
MODEL · CLEAR table is still kept current — it is the handoff, and it is what makes the chat free to stay on one thing.
The paragraph below is the 2026-08-23 original; read it through this.

At every juncture — a chunk wrap, a milestone, a mode change (execution ↔ conversation),
or when asked "where are we" — the AI **states the next 2–4 logical steps, each with a
recommended model and whether to clear before it**, and **says out loud when a good clear
or switch point has arrived** ("this is a good time to clear", "switch to Opus for this").
Not when asked — as a habit, like the lab journal. The rule for the recommendation is in
`docs/SESSION_HYGIENE.md` § Model strategy (Fable = judgment / verdicts / design;
Opus = executing a written plan; clear at milestones and mode changes; the cold-execution
test before any clear).

**The running thread lives in `docs/PROJECT_JOURNAL.md` §2 → "NEXT STEPS · MODEL · CLEAR".**
Keep it current as steps complete — it is the first thing a model reads after a clear, and
it must say what is next, with what model, right now.

**Fable's allotment is separate and is the one he watches** (composer, 2026-09-10). So the
routing advice is also credit advice, and these bind every Fable turn:
- **Fewest round trips.** Batch independent reads and tool calls into one response; no
  exploratory reads; name the question before opening anything.
- **No screenshots unless the screenshot IS the proof he asked for.** `read_page` otherwise.
- **Never spawn a subagent on Fable.** If one is ever justified, pass `model: "sonnet"`.
- **Wrap on Opus.** `/checkpoint` and `/session-end` are mechanical work at the long,
  expensive end of a session: switch to Opus, wrap, `/clear`, switch to Fable, `/postclear`.
- **A `Resume reads:` list names what the NEXT STEP needs, not what the last session wrote.**
  Every line on it is re-read in every turn of the session that follows.

## Apps

*The code is here since 2026-10-20 (container 3, RUNNING_LOG §5 … §10); the names are journal §1's (D4), `docs/NAMING.md` § 1:*

- **The composer score — `http://localhost:5600/composer.html`** (`score/server.js`; launch name `score`; he starts his own with `start_score_server.bat`). EIGHT lanes: flute · clarinet · alto sax · percussion · vibraphone · piano · violin · cello (D7); META 8, the curve windows 9 / 10 / 11; `layoutVersion` 9; the day-one empty score `scores/switch.json`. **The server needs `scores/` to exist** (RUNNING_LOG §9). **Nothing sounds yet** (containers 4 · 5). · **the sandbox — `http://localhost:5100`** (`sandbox/serve.js`; launch name `sandbox`) — one instrument, one technique at a time · **`score-5601`** the THROWAWAY for verification (`docs/VERIFICATION_RECIPE.md`). The pair 5600 / 5100 is the next in the lineage (3 5100/4600 · tubas 5200/4700 · 4 5300/4800 ·
  5 5400/4900 · 6 5500/5000); 5100 was piece 3's old score port — nothing binds it today (checked 2026-10-20).
- **`.claude/launch.json`:** `score` 5600 · `sandbox` 5100 · `score-5601` the throwaway. NO `<prev>-<port>` entry: piece 6 is finished (his word 2026-10-20); add
  `decibel-5500` only at his word.
- **The MIDI ports:** the prefix **`SW`** (D4) — made BY THE AI through loopMIDI's registry key at 4.1 (piece 6's way, H6-21); his one
  hand step: enabling them as inputs in Reaper's Preferences. loopMIDI ports are machine-global: piece 4's (bare names), piece 5's
  (`LG…`) and piece 6's (`DEC…`) are live beside them; `palette_check` refuses every earlier set.
- **The rack — `reaper/switch_rack.rpp`** (the guard `switch_rack`) — HIS since his save of 2026-10-20 22:02; 24 tracks, built as text by `tools/build_rack.js` (RUNNING_LOG §15) — the hand-set values in `docs/RACK_SETTINGS.md` § 0. **loopMIDI is started by HIM, before Reaper** (§19); after a loopMIDI restart under a running Reaper: `reaper/bridge/jobs/midi_reinit.lua`. As planned at 4.2: the cello cloned
  from piece 6's rack on disk, the flute · piano · violin from piece 4's; the clarinet and the sax loaded by him (SI2, UVI).
- **The live electronics — `electronics/`**, SEATED 2026-10-20 by `git subtree add` (the engine's `a11b387`; `git remote` `engine`); its page code served at `/electronics/`, its relay required by the score server at start; `node tools/elec.js` the piece's start tool (piece 6's, carried); SuperCollider on
  **UDP 57210**, its language on **57211**, fed by the rack over ReaRoute — the engine's numbers, the same in every piece: ONE engine
  runs at a time on this machine.
- **The notation app · print · video** — this piece's from container 6.

⚠ **Standing warnings:** never bind **5500 / 5000** (piece 6's — his server may be running), **5400 / 4900** (piece 5's) or
**5300 / 4800** (piece 4's) · the AI never holds his port and never saves from its own browser pane · the in-app browser has no
Web MIDI, so every MIDI path is verified on his Chrome · print and video share the frame math · the curve-channel map is CACHED
(`Composer.curveDirty()`) · a server route keeps the engine it started with — restart after a `notation/lib` or `server.js` change ·
a lane added to `TRACKS` needs its `<div>` and its CSS rule · a lane NUMBER written into a module is invisible to a grep for names
(H6-13) · never end an engine with a kill while it holds ReaRoute (`/le/leave` first) · a note sender killed mid-note leaves a stuck
note in Kontakt.

**Checks this piece owns:** `node tools/palette_check.js` (**202**) · `node tools/roster_check.js` (**251** voices, 18 pending) · `node tools/model_bank.js --validate` · `node tools/unsaved_check.js` (before a commit of scores) · the port's battery `bash tools/port/run_batteries.sh <tag>` (45 commands; the staged data by `stage32.sh` first; the classes in NITS) · the engine's: `node electronics/tools/page_test.js` · `sine_page_test.js` · `osc.js selftest` (and its `sclang` batteries, CLAUDE.md there) · THE SHIELD (`tools/layout_shield.js` — before and after ANY layout change; it needs pages, container 6).

## Reference repos (read-only context)

- **6** `C:\Users\jwloy\GitHub\decibel_TENOR_2026` — **the source of the port** (*Approaching*; done, to be submitted when the TENOR
  call opens). `docs/HARVEST.md` is what it hands here; `docs/PROTOCOL_DEVIATIONS.md` is the protocol's v2 in all but name;
  `tools/port/` the last port's scripts; its `RUNNING_LOG.md` §1 … §45 the record of its start. **Its tree holds one modified file
  of his (`bank/samples/index.json`, the engine's index) — never stage, move or edit anything there; the copy takes the COMMIT.**
- **The home** `C:\Users\jwloy\GitHub\composition-system` — what the pieces share: `INDEX.md` first, then
  `protocol/NEW_PIECE_PROTOCOL.md` · `protocol/howto/` (rack · kontakt · spitfire-aro · measuring; UVI to be written, H6-24) · `BACKLOG.md`.
- **The engine** `C:\Users\jwloy\GitHub\live-electronics-system` — the shared live-electronics engine; a MIRROR of `electronics/`
  once seated here: never edit it while a piece is at work; `pull --ff-only` after each subtree push.
- **The sandbox** `C:\Users\jwloy\GitHub\live-electronics-engine` — his experimental live-electronics work (the workshop); the
  improviser piece lives there. **`synthesi-alpha`** — his fixed-media piece with an animated score, extracted from the workshop
  (its player and stage set-ups are the nearest thing in hand to a projected animation).
- **The earlier pieces, each the source named:** **5** `septet_LGMF_2026` (the notation standards as data, the dynamics law) · **4**
  `septet_2026` (the flute · piano · violin recipes and the SI2 flute's UVI record; **its tree holds his uncommitted files — never
  stage, move or edit there**) · the tubas `for_seven_tubas` (the SI2 how-to's record) · **2** `composition_for_two_pianos_and_two_percussion`
  (the percussion catalog · THE PIANO: `HARMONICS_PIANO_PLAN.md` · the plucked and prepared piano · the cells LG-341 names) · **1**
  `string_quartet_no1-composer` (the Xsample strings) · `for_bass_clarinet_harp_and_accordion` (the extracted sampler manuals).
- **The planning repo** `composition-planning-and-notes` — his lists; written only at his word; fetch before a push (H6-51).

Consult only when a specific named question requires it. Never edit them.
**LINEAGE FIRST — a wall in an inherited mechanism is such a question** (his word, `#6 §263`: *"don't reinvent the wheel"*): before
proposing a way round a limit, read how the earlier pieces did it, their docs first, then this repo's copy; asked "how did we do
it", a simple list of what to check, then the report.
**The home and the engine are the two exceptions:** each is written to by its own rules (both push after every commit), in a
session opened there or at his word.

## Git

- Commit at the natural wrap of an approved chunk; reference plan IDs in messages.
- Stage **explicit paths only, never `git add -A`**.
- **Push automatically after every commit** (journal D3 — ASKED at the protocol's 2.2, never inherited: his word 2026-10-20,
  *"2a"*, to "push after every commit"). Do not ask. The user-level skills' "ask push now?" is superseded in this repo.
- **This repo is PUBLIC** (`github.com/elosine/switch_2026`): nothing personal lands here — no call screenshots, no account details,
  no licensed fonts; **and nothing of the anonymous submission's record** (`docs/submission/`, gitignored).
- **Never a history rewrite or a force-push.** If ordinary git is refused somewhere, tell him — do not work around it.
- **The engine's folder** `electronics/` is pushed to its own repo by the AI at every wrap (`git subtree push`), never by him.
