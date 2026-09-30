@echo off
title Fluent - Mandarin Coach HSK 3-4
cd /d "%~dp0"
echo ====================================================
echo   Fluent - Coach Vocal Mandarin HSK 3-4
echo ====================================================
echo.
echo [PC] Acces direct : http://localhost:5173
echo [Mobile/Tablette] Acces WiFi local : http://10.5.180.49:5173
echo.
echo Lancement du serveur...
start "" "http://localhost:5173"
npm run dev -- --host
pause
