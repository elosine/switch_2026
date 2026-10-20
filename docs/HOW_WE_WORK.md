> **Provenance (switch 2026, 2026-10-20):** copied unchanged from piece 6 *Approaching* `decibel_TENOR_2026/docs/HOW_WE_WORK.md` @ `9796edd` (the new-piece protocol's 2.4). The inherited text is unchanged. Read it by: the **Pushes** paragraph — this repo's rule is the same, push after every commit, its own D3 · the MACHINE LESSONS and the harvest block at the end carry piece 5's and piece 6's names and `§N`s (re-pointed at the re-palette, 3.3 — the harvest's H6-5).

> **Provenance (decibel TENOR 2026, 2026-10-04):** copied from piece #6 `septet_LGMF_2026/docs/HOW_WE_WORK.md` @ `2e5ac56` (the new-piece protocol's 2.4). The inherited text is unchanged. Two things to read it by: the **Pushes** paragraph cites piece #6's D5 — this repo's rule is the same, push after every commit, and is its own D3 (his word 2026-10-04) · ONE section is ADDED at the end, the harvest's lines H-1 · H-2 · H-3 · H-6 (`septet_LGMF_2026/docs/HARVEST.md`). Section numbers cited as `RUNNING_LOG §N` in the inherited text are the TEMPUS lab journal's. `AI_METHODOLOGY.md` wins where they conflict.

> **Provenance (septet LGMF 2026, 2026-09-17):** copied from piece #5 `septet_2026/docs/HOW_WE_WORK.md` with everything the Tempus septet added (THE RHYTHM, the planning method, the panel idiom, one round per sitting). One change: the **Pushes** paragraph. Section numbers cited as `RUNNING_LOG §N` are the TEMPUS lab journal's. Lineage: piece #3's card → #4 unchanged → #5 → here. `AI_METHODOLOGY.md` wins where they conflict.

# How We Work — Reference Card

> Cheat sheet for piece #3. Adapted from piece #2's version, trimmed to what carries forward.
> Piece-2-specific machinery (servers/ports, glyph registry, notation workflows) stays in that
> repo; equivalents get added here only when the corresponding system exists in this repo.

---

## Session routines

| Routine | When | How |
|---|---|---|
| **Session Start** | Beginning of every work session | `/session-start` |
| **Session End** | Done for the day | `/session-end` |
| **Pre-compaction checkpoint** | Context running low mid-session, or say *"checkpoint"* | see `SESSION_PROTOCOL.md` |

Canonical procedures: `docs/SESSION_PROTOCOL.md`. The journal remembers so you don't have to.

**THE RHYTHM (standing, restored 2026-09-10 — CLAUDE.md § THE RHYTHM):** at every juncture the AI
states the next 2–4 steps with **model + clear** per step and announces switch/clear points without
being asked; the running thread is journal §2 → **NEXT STEPS · MODEL · CLEAR**. The rules for the
recommendation, and the Fable-credit rules that go with them (fewest round trips · no screenshots
unless they are the proof · never a subagent on Fable · wrap on Opus · a lean `Resume reads`), are in
CLAUDE.md and `docs/SESSION_HYGIENE.md` § Model strategy.

---

## The plan (`docs/PLAN.md`)

The single living plan. Stable IDs (`1c` stays `1c` forever), statuses, one-line whys.

**Building a plan item, or analyzing an issue that ends up in the plan: `docs/PLANNING_METHOD.md`** (2026-09-06) — state and
restate until the understanding is shared · the top line · one step at a time: the goal, then the sub-steps, then into the plan.

**Talk to it in plain language:**
- *"show me the plan for 1"* · *"what's left in 0?"*
- *"what did we decide about X, and why?"* (→ journal §4)
- *"mark 1b done"* · *"move 1c after 1d"* · *"drop 2a"* · *"defer 3b"*
- *"break 1e down further"* — expands sub-steps in place

---

## Working Style

> User preferences, not iron rules — if one blocks the work, **surface it for discussion**
> rather than silently routing around it. The list is expected to evolve.

**Cadence**
- **Conceptual proposal before any code edit.** Describe in plain language what would change and why; wait for approval.
- **Discuss chunks, not individual files.** Once a chunk is approved, execute without re-asking per file; narrate briefly so the user can interrupt.
- **Wrap each chunk before moving on:** update docs (plan statuses, journal), commit if a natural checkpoint, report what actually happened vs proposed, propose the next chunk.
- **Piecemeal by design.** One thing at a time; don't chase the perfect architecture. Shore up as we go.
- **A page to look at gets a CLICKABLE `http://localhost:5400/…` link** (2026-09-29, RUNNING_LOG §563 — his *"AI was always able to serve me a clickable link in the chat that I could click and would open up in Chrome"*): put the page where his running score server serves it — `notation/research/<page>.html` now, `docs/research/<page>.html` once the `/docs/` route is live (added 2026-09-29, at his next restart) — and give that link in chat. A `file:///` link and a `claude.ai/artifact` link both open INSIDE the desktop app, not in Chrome (tried, refused). Never a bare path to paste.

**Reading & analysis (this piece's addition)**
- **Orient from docs, never by scanning the codebase.** Name the specific question first, then read only what answers it.
- **High bar for subagents / background processes.** Default to doing the work directly; one fast targeted command beats an exhaustive audit.
- Prior repos are reference material, consulted per named question only.
- **Go/no-go before ANY time-consuming process** — disk searches, large codebase reads, extensive web research, long analyses. State conceptually what's needed and pause; the composer either supplies the shortcut (a path, a doc, an answer) or says *"go."* Single targeted checks of known things are always free. *(Added 2026-08-01; generalized from the disk-search case, where AI drive-crawled for libraries the composer could have pointed to instantly.)*
- **Cite IDs with names, never bare.** Decision and plan IDs in chat always carry their short name: *"D6 (Reaper session storage & backups)"*, *"S3 (MIDI out)"* — a bare "D6" forces the composer to look it up. *(Added 2026-08-01.)*

**Language**
- Plain, conversational language first; file paths and code references as anchors, not substance.
- *"Tell me in plain language"* / *"tighten it"* = calibration, not failure.

**Choices**
- **Plain-text lettered options in the message body — never a multiple-choice UI picker.** Reasoning visible next to the options. Wait for a free-text reply.

**Commits**
- Commit at the natural wrap of an approved chunk, or when asked. Never speculatively.
- Reference active plan IDs (e.g. `1c`) and decision IDs (e.g. `D2`) in messages.

**Pushes**
- ~~**AI never pushes automatically.**~~ **Superseded in this repo by D5 (composer 2026-09-17): push automatically after every commit, explicit paths only** — the rule of pieces #4 (D30) and #5 (D8), adopted here at his word. *(Inherited text: after commits, surface the unpushed count; at Session End, always ask "push now?".)*

**Before building anything new — quick pre-check**
1. What exists? 2. What changes? 3. What could break? 4. How do we verify?

**A panel borrows the score's idiom (composer, 2026-09-07 — RUNNING_LOG §182–183; the beating drawer's lesson)**
- Anything a panel needs that the score already has — curves with slope handles, zones on tracks that drag and stretch, takes, seeds,
  SPACE playing what is looked at — the panel takes AS IS, the score's behaviour and its look. No panel-only invention of the same thing.
- **A tool is planned against how the composer WORKS, not against a feature list:** before a build, his walk-through in his own words
  (first click to the result in the score) is written back as a numbered script, each line marked works · awkward · missing; the
  misses are built in ONE pass on a copy and verified by walking the script with real events; he tests once against the same script.
  The script is the unit, not the ticket (strategy A, §183).
- **His ear early:** the smallest thing that sounds comes first and is heard before the rest is built.

**Small issues, one round per sitting (composer, 2026-09-07 night — "this working process is not working … several hours … to get this
one thing right"; RUNNING_LOG §188)**
- He collects what he sees — a screenshot and one line each — and sends them together; the fix comes back as ONE commit with a
  walk of every item, not a fix per message.
- A gesture is tested as a real mouse sequence (mousedown · move · up; click then double-click, with the re-render between them),
  never only as a state call — the double-click that never fired was invisible to a state test.
- Anything that is a MODEL (how a lane, a region, a node behaves), not a control, is stated in one line and agreed before it is built;
  a control is just built.
- The tool carries its own memory of what is taken (a gesture card); the AI never asks him to remember a modifier.
- **Save, don't build (composer, 2026-09-07 night — "save all unless I say otherwise"):** a remark about the drawer is saved — the
  request in NITS, his words in MORPH_NOTES §3 — and built only when he says so; what he marks "fix now" is fixed now.
- **The takes and the ACTUALs are committed at every wrap (composer, 2026-09-07 late — "yes pls"; RUNNING_LOG §209):** `bank/panel_snapshots.json`
  and `bank/actuals/*.json` are the AI's to stage and commit at each wrap and whenever he asks — they are data with provenance, as the
  tuba piece kept them. **The SCORE files too, from 2026-09-07 late (§216):** the piece file and the named versions are committed at every wrap
  by NAMING §1's rule (no audio inside; 26 versions = 7 MB); the working copies never. Only what he NAMES is his: the versions' labels, the takes' names.

---

## If it feels like we lost the thread

1. **Correct + cite:** "We decided X — check journal §4, D-N."
2. **Re-read:** "Re-read §2 — we covered this."
3. **Override:** "The plan is X. Don't re-derive."

The journal is the recovery anchor. If a decision matters enough to survive context loss, it belongs in §2 or §4 *at the moment it's made*.

---

## You don't need to worry about…

- Forgetting the plan or its motivations — `PLAN.md` keeps both, per item.
- Forgetting decisions — journal §4, with the why and the rejected alternatives.
- Forgetting your own to-dos — journal §7, reviewed at session end.
- Losing context between sessions — §2 Resume Here, updated every session end.
- The AI not knowing what's going on — it reads the plan + journal at session start, not the codebase.

## From piece #6's harvest (added 2026-10-04 — `septet_LGMF_2026/docs/HARVEST.md` H-1 · H-2 · H-3 · H-6)

**How he works with a page, and with time (H-2):**
- His times read 0.05 … 0.2 s EARLY — list the part's events and take the nearest; "partial" in his dictation = a note.
- A rule he states may be superseded two turns later — log each, build the last.
- In an eye pass he COLLECTS; then everything is fixed at once, on his go.
- "Nothing happens" after a build is first a question of the TAB — ask for a reload before reading the code.

**A pasted image (H-3):** an image he pastes WHILE the AI is working has no file behind it; pasted when the AI is idle it
lands in the session's temp folder and can be copied.

**A gate counts presence, not the look (H-6):** at a medium's FIRST run — the first film, the first print — look at each
furniture element for what it MEANS there. In piece #6 the screen's grey page-edge bar printed as "the terminal barline"
and the pages gate counted it green (`#6 §772`).

**THE VERIFICATION RECIPE (H-1)** is a doc of its own: `docs/VERIFICATION_RECIPE.md`.

**MACHINE LESSONS (H-1)** — carried verbatim from piece #6's journal §2, the block STILL BINDING; the file names and the
`§N` in them are piece #6's:

- **Five things learned the hard way — all still true:**
  - **A Bash command longer than about 8 KB FAILS on this machine** with `unexpected EOF while looking for matching quote`. **Write
    any large text with the Write tool into the scratchpad, then splice it in with a short `node` script** that asserts each
    replacement lands exactly once.
  - **A script with BACKTICKS in it goes to a FILE** (the Write tool, or a quoted `<<'EOF'` heredoc) — **never into `node -e "…"`**.
    In a double-quoted bash string the backticks are command substitution: on 2026-09-20 that made bash try to EXECUTE
    `bank/panel_snapshots.json`, his 3 MB takes file, as a shell script (§146). Nothing ran, but it is the closest this project has
    come to losing his data.
  - **THE LINE ENDINGS ARE MIXED IN THIS REPO, and `docs/PLAN.md` is mixed WITHIN ITSELF** (797 CRLF, 59 lone LF). A splice script
    must **never normalize a whole file** — detect the file's DOMINANT ending and convert the search strings and the inserted text
    to it instead (`const crlf = nCRLF >= nLF, fix = t => crlf ? t.replace(/\r?\n/g, '\r\n') : t`). LF search strings match **zero**
    times in a CRLF file and report "not found", which reads like a missing anchor and is not. **CORRECTED 2026-09-28 (§501, measured at
    BYTE level):** `core.autocrlf` is true, so every committed blob is LF; the working copies of PLAN · CLAUDE.md · this journal · the
    RUNNING_LOG are ALL LF, `PLANNER.md` and `rules.json` ALL CRLF — the 797 / 59 above is stale, and **`grep -c $'\r$'` MISREPORTS here**
    (it counted every line of an LF file as CRLF). Count with node over the bytes (`b[i] === 10 && b[i-1] === 13`); a splice converts its
    text to the file's own ending and refuses a mixed file.
  - **The Write and Edit tools turn a typed `\uXXXX` into the literal character**, so `sequence_ui.js` holds `—` and `·`, not escapes.
  - **A PARALLEL SESSION of his may be appending to `RUNNING_LOG.md` and `COMPOSITION_NOTES.md`.** Append only; **read the last
    heading number immediately before writing** and take the next free one; explicit paths, never `git add -A`.
- **This piece's own, added as they bite:**
  - **A splice's replacement text goes through a slice or `split` / `join`, never `String.replace(a, b)`** (2026-10-04, RUNNING_LOG
    §12): in JavaScript a `$'` · `` $` `` · `$&` inside `b` is a pattern, not text — a line ending in `$'` wrote half a script twice.
  - **A DOUBLED BACKSLASH typed into a shell heredoc reaches the file as ONE** (2026-10-04, RUNNING_LOG §60) — even under a quoted
    `<<'EOF'`. A splice script so written put `~le[msgPort]` where `~le[\msgPort]` was meant; sclang stopped at the parse and printed
    nothing the runner reads (its only sign: the timeout, exit 4). **A file that carries backslashes — JavaScript with escapes,
    SuperCollider with symbols — is written by the Write tool, never through the shell.** A parse failure in a `.scd` shows only with
    `node electronics/tools/sc.js run <file> --verbose`.
