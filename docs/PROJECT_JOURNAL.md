# PROJECT JOURNAL — switch_2026 (the Switch~ piece)

<!-- card:switch -->
<!-- Chief of Staff card: rewrite these three lines (and the date) at the end of every session on this project. Plain words, one line each. Read by home-management/tools/brief.js; list in home-management/docs/PROJECTS.md. -->
> **▶ Where I left off** · updated 2026-10-22
> - **Last:** session 1 (Oct 20) — the engine seated with eight lanes; nothing sounds yet.
> - **Decided:** clarinet + alto sax on SI2 (D10); two percussion lanes.
> - **Next:** container 4, the instruments — starts with you: the read-out per instrument, then ports and tracks.
<!-- /card -->

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

### SESSION 1 CLOSES ON THIS (2026-10-20, Fable) — containers 2 and 3 done, the engine seated; container 4 next

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

**NEXT STEPS · MODEL · CLEAR** *(the running thread — THE RHYTHM, CLAUDE.md. Keep current.)*

| # | Step | Model | Clear first? |
|---|---|---|---|
| ☑ | Container 3 — the copy-forward from piece 6, with the engine's take (RUNNING_LOG §5 … §10) | Fable, at his word | — |
| **►** | **Container 4 — the instruments: 4.0 the read-out per instrument (H6-22) and the libraries confirmed with him · 4.1 the ports by the AI · 4.2 the tracks cloned and the two new SI2 tracks · the UVI how-to written (H6-24) · 4.3 his loads · 4.5 the recipes derived · 4.6 the first sound** | **Fable for 4.0 (the talk) · Opus for 4.1 … 4.6 (a day, from the how-tos)** | **a clear before 4.1 is cheap: the docs carry everything** |
| — | Container 5 — the calibration for a composing demo; container 6 set up (the registry, the three calls BEFORE 6.0 — H6-35) | Opus | — |
| — | 10.0 — the deviations register read, v2 written into the home's protocol (both runs' lessons); the eight LATER items to BACKLOG | Fable | yes |
| — | Then the music: the profile's open questions are the sketch pad's (what the electronics take of the call's tech; the two musics) | Fable | — |

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
