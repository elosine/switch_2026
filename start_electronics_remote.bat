@echo off
rem The live electronics for LISTENING FROM AFAR (Chrome Remote Desktop): SuperCollider on the Windows default device, not ReaRoute,
rem so the remote session hears the engine beside Reaper. Reaper must be on WASAPI (shared, output = the Windows default) — docs/REMOTE_LISTENING.md.
rem The microphones are off in this mode: a mic opening captures nothing; the bank and the renders play. Close this window to stop the engine.
cd /d C:\Users\jwloy\GitHub\decibel_TENOR_2026
node tools\elec.js start --remote
pause
