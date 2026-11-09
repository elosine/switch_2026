# STARTUP — the order, every time (his word, 2026-11-07: "let's have an order. And let's assume that I've forgotten what to do")

Three windows, always in this order. The AI opens what it can; what must outlive the AI's session (the engine, the servers) he
starts by a double-click. The AI checks each step before naming the next, and ends with the link.

| step | what | who | what he should see |
|---|---|---|---|
| 1 | **Reaper with THE LAB'S PROJECT** — `reaper\icy_lab.rpp` (one track, ELEC RETURN; no instruments — the lab plays samples inside the engine). The full rack `switch_rack.rpp` is for composing; its ELEC RETURN (track 25) and the players' sends went in 2026-11-09 (RUNNING_LOG §110) and live in his save | the AI opens it | Reaper up, one track **ELEC RETURN**; nothing plays |
| 2 | **The engine** — `start_electronics.bat` | HE double-clicks (the AI opens the folder with it selected) | a black window that ends with a line beginning **`LE_READY`** |
| 3 | **The lab's server** — `start_icy_lab.bat` | HE double-clicks (same folder) | a window saying `icy lab — the page is http://localhost:5620/` |
| 4 | **The page** — http://localhost:5620/ | the AI gives the link, he opens it in Chrome | the sample box and play |

**When it works:** pressing play puts an `LE_RESULT … "did": "start"` line in the engine window and moves ELEC RETURN's meter.

**What the AI checks** (`node tools/startup_check.js`, or by hand): Reaper running · the engine's ports 57210 (server) and 57211
(language) listening · 5620 listening. A step that is not there is named, with its row above; nothing is started twice.

**If he shuts things down:** closing a window stops that step; the order is the same from the first missing step. The engine
is ended by closing its window only after Reaper is still open (never a kill while it holds ReaRoute — the standing warning).

**For composing in the score** (not the lab) loopMIDI comes FIRST, before Reaper (RUNNING_LOG §19), then Reaper, then the engine,
then `start_score_server.bat`; the page is http://localhost:5600/composer.html. The lab needs no loopMIDI.

**Why he starts the engine and the servers himself:** a process the AI starts dies when the AI's session ends — the loopMIDI lesson
of 2026-10-20 (§19). Reaper is the one thing the AI opens, because it stays open as his.
