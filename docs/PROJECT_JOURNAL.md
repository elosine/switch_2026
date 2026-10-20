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

### SESSION 1 CLOSES ON THIS (2026-10-20, Fable) — container 2 done; container 3 next, on Opus

- **The task:** the start of the Switch~ piece by the new-piece protocol, run by piece 6's deviations register (H6-1).
- **Where it stands:** container 1 the harvest ☑ (in piece 6's repo, his read "all as proposed") · container 2 the kit ☑ (this
  commit) · containers 3 … 8 `todo`, in PLAN § 0. No code here yet.
- **► THE NEXT CONCRETE STEP — CONTAINER 3, THE COPY-FORWARD, on Opus, one sitting, from the written steps:**
  the protocol's 3.0 … 3.6 as amended by piece 6's deviations register and the harvest's H6-7 … H6-20 — in order: **3.0** the survey
  from `decibel_TENOR_2026` @ `9796edd` with `tools/port/` as the template (the copy list re-pointed; `electronics/` and the
  bank's samples ON the leave list; the leave list grepped for paths the engine reads; the lane-count greps — 6 → 7 or 8 lanes) →
  **3.1** the copy by blob hash → **3.2** prove whole, two staging passes, the batteries classified into a table → **the fixes commit**
  (the roles helper H6-14 · H6-18's stragglers · the font H6-19 if cheap) → **3.3** the re-palette (seven parts in score order:
  flute · clarinet · alto sax · piano · percussion · violin · cello; the percussionist's lanes decided at 3.0; the ports · the guard
  · the session · the package · the lane CSS · the source's folder name) → **3.4** recipes and skeleton banks (the cello carried
  verbatim; all else PROVISIONAL) → **3.5** verified in the running app on 5600 / 5100 (`score-5601` the throwaway) → **3.6** the
  record. Then **the engine's take** (`live-electronics-system/docs/TAKE.md` step 1: `git subtree add --prefix=electronics engine main`).
- **`Resume reads:`** `CLAUDE.md` (the profile · the names · the warnings) · `docs/PLAN.md` § 0 · `decibel_TENOR_2026/docs/HARVEST.md`
  § → 3 (H6-7 … H6-20) · `decibel_TENOR_2026/docs/PROTOCOL_DEVIATIONS.md` (its 3.x lines) · the protocol's § 3 · `decibel_TENOR_2026/docs/PLAN.md`
  § 0.3 (the last survey's shape) · `decibel_TENOR_2026/tools/port/` (the scripts). Nothing else.
- **Pending him:** the libraries at 4.0 (SI2 for the clarinet and the sax, as proposed?) · the percussionist's lanes (one or two) ·
  the title, when it comes · the planning repo's "pieces in play" line (2.6 — only at his word).
- **Deliberately uncommitted — none.** (`git status --short` clean at this commit.)

### THE SESSIONS BEFORE THIS ONE — one line each; the lab journal has them whole

- **S1 · 2026-10-20 (Fable)** — the orientation (RUNNING_LOG §1 · §2) · the harvest of piece 6 run in its repo (`#6 §488`, §3) ·
  container 2 (§4).

**NEXT STEPS · MODEL · CLEAR** *(the running thread — THE RHYTHM, CLAUDE.md. Keep current.)*

| # | Step | Model | Clear first? |
|---|---|---|---|
| **►** | **Container 3 — the copy-forward from piece 6, by the written steps above; ends with the engine's take** | **Opus** | **yes — clear, then `/postclear` on Opus** |
| — | Container 4 — the instruments: 4.0 the read-out per instrument (H6-22), the libraries confirmed with him · the ports by the AI · the tracks cloned · his loads (clarinet · sax) · the UVI how-to written (H6-24) · the first sound | Opus (Fable for the read-out with him) | — |
| — | Container 5 — the calibration for a composing demo; container 6 set up (the registry, the three calls BEFORE 6.0 — H6-35) | Opus | — |
| — | 10.0 — the deviations register read, v2 written into the home's protocol (both runs' lessons); the eight LATER items to BACKLOG | Fable | yes |
| — | Then the music: the profile's open questions are the sketch pad's (what the electronics take of the call's tech; the two musics) | Fable | — |

**Open questions:** Q1 — the libraries for the clarinet and the alto sax: SI2 as proposed, or a purchase? · Q2 — the
percussionist: one lane or two (unpitched + mallets, piece 6's way)? · Q3 — the title.

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

---

## §5 Playbooks

*(Mode-specific procedures and gotchas. Piece 6's §5 holds the engine's playbooks; bring one across when its system lands here and
is first used.)*

---

## §6 Done

- 2026-10-20 — **container 1** the harvest of piece 6, `decibel_TENOR_2026/docs/HARVEST.md`, his read "all as proposed" (`#6 §488`).
- 2026-10-20 — **container 2** the repo and its kit: the profile, the names, the method docs carried, the record docs from the
  skeletons, the sketch pad gathered (RUNNING_LOG §1 … §4).

---

## §7 Human Notes

*(The composer's own to-dos and reminders. Reviewed at session end.)*

- 2026-10-20 — *"the performance scores are being worked out now and tempus will be first to receive first set of performance
  scores ie parts"* — the parked performance architecture (piece 6's DEC-46; the harvest's H6-47) waits on that.
