@echo off
rem The live electronics, up and listening: SuperCollider on ReaRoute, fed by the rack.
rem Reaper must be running first, with switch_rack open. Close this window to stop the engine.
cd /d C:\Users\jwloy\GitHub\switch_2026
node tools\elec.js start
pause
