# Remote listening — the composer score and the electronics over Chrome Remote Desktop

*Set up 2026-10-07 at his word (RUNNING_LOG §209; the engine's §55). The studio way is ASIO + ReaRoute; this is the other way, for a
remote session only. Piece #4's `docs/REMOTE_AUDITION.md` is the ancestor (Reaper alone); this adds the engine.*

## Why anything changes

- Chrome Remote Desktop carries only what goes through the **Windows mixer** — the Windows default output device. ASIO bypasses it.
- In the studio the engine's sound goes **SuperCollider → ReaRoute → Reaper's `ELEC RETURN`**, and ReaRoute exists only while Reaper
  is on ASIO. So for a remote session BOTH change device: Reaper to WASAPI (shared), the engine to the Windows default.

## The checklist (from the remote laptop)

1. **Connect:** remotedesktop.google.com → the studio desktop. Audio forwarding ON in the client's side panel (the default).
2. **Reaper → WASAPI:** Options → Preferences → Audio → Device → Audio system: **WASAPI** · Mode **Shared** · Output: the **default
   output device** · Input: none needed. OK. (The stored WASAPI settings are usually right — just flip the dropdown.)
3. **The engine, the remote way:** close the engine's window if one is up (it holds ReaRoute) · double-click
   **`start_electronics_remote.bat`** in the repo root. Its start line says `MODE … REMOTE …` and the device it opened.
4. **The score server** as always (`start_score_server.bat` if it is down) · Chrome on the desktop → `http://localhost:5500/composer.html` · F5.
5. **Windows volume UP** on the desktop — the capture follows it; muting Windows mutes the stream. The studio speakers are the UMC's own
   knob, independent.
6. **Play.** The players come from Reaper, the electronics from the engine, both through Windows → the laptop.

## What you lose remotely

- **The microphones.** In this mode an opening RECORDS NOTHING: the start sets the engine's record switch off (`LE_RECORD=0`), so a mic
  opening changes nothing and the bank is safe. (The engine's two inputs are then the Windows default input — a webcam's microphone, the
  room — not the rack; before 2026-10-07's guard an opening on the bass clarinet's or the bass flute's lane would have recorded that over
  a banked impulse. **An engine window opened before the guard: close it and start the remote bat again before playing the piece.**)
  Everything BANKED and RENDERED plays: the auditions, the opening's returns, the three body section's computer players.
- **Renders still work** (they are offline: no device). "Render all planned" and the builders with `--render` are fine.
- The engine's output is its own master straight to Windows, not Reaper's `ELEC RETURN` track: Reaper's master fader does not touch it.
- MME latency is high (tens of ms): the returns land a little late. For listening, not for judging placement.

## Back in the studio

- The engine's window closed · Reaper → Preferences → Audio → **ASIO** (the UMC) · **`start_electronics.bat`**. Nothing else moves.

## Gotchas

- **Zoom without the wheel** (Remote Desktop swallows ALT + wheel): with the score focused, **`=` or `+`** zooms in, **`-`** zooms out,
  one step a press.
- **The electronics too quiet against the players?** That is the ladder's one number, not the remote route: `bank/elec_route.json`
  `level.reference` (raised to −17.54 on 2026-10-07), then the engine restarted.
- **Nothing changes in SuperCollider's code for the switch** — the mode is the start file's. The device names are
  `bank/elec_route.json` `remote` (`inDevice` · `outDevice`); the **Microsoft Sound Mapper IS the Windows default**, whichever it is
  at the time (CRD swaps the default when sessions cycle — the Sound Mapper follows). A fixed device instead: a name as
  `node electronics/tools/sc.js devices` prints it, or `devices_all` in the engine's record (§55).
- **If the engine's start line complains about the device** (the sample rate, a channel count): paste it. (The mode's first runs were his, 2026-10-07 15:18 and 15:46:
  it opened the Sound Mapper at 44100 Hz and played the bank, the renders and the sines.)
- **After reconnecting CRD**, if Reaper's sound dies: Options → Reset all MIDI/audio devices. If the engine's dies: its window closed, the
  bat again.
- ⚠ **Reset all MIDI/audio devices re-opens MIDI inputs** — keep the Keystation input disabled in Reaper (piece #4's rule).
- **Mute the studio while listening remotely:** the UMC's monitor knob, or WIN+R → `mmsys.cpl` → Playback → the default device →
  Properties → Levels → mute (the CRD stream is unaffected). Unmute when home.
- CRD audio is compressed: fine for texture and register, not for level judgments.
