@echo off
rem The live electronics, up and listening: SuperCollider on ReaRoute, fed by the rack.
rem Reaper must be running first, with decibel_rack open. Close this window to stop the engine.
cd /d C:\Users\jwloy\GitHub\decibel_TENOR_2026
node tools\elec.js start
pause
