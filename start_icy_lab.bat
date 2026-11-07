@echo off
rem THE ICY LAB's own server (electronics/tools/icy_lab.js): the page at http://localhost:5620/ and the road to the engine.
rem Step 3 of docs/STARTUP.md. Started by HIM (a window the AI starts dies with the AI's session). Close this window to stop it.
cd /d "%~dp0"
title icy lab 5620
echo icy lab — the page is http://localhost:5620/   (close this window to stop it)
node electronics\tools\icy_lab.js --samples bank\set\2025-04-08c\lab\samples.json --config bank\elec_route.json --port 5620
pause
