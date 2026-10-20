@echo off
rem Remote audition helper: double-click (e.g. inside a Chrome Remote Desktop
rem session) to start the composer score server on http://localhost:5500
cd /d C:\Users\jwloy\GitHub\decibel_TENOR_2026
echo Score server starting on http://localhost:5500/composer.html
node score\server.js
pause
