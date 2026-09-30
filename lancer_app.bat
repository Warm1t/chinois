@echo off
title Fluent - Mandarin Coach HSK 3-4
cd /d "%~dp0"

:: Assurer la presence de Node.js dans le PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ====================================================
echo   Fluent - Coach Vocal Mandarin HSK 3-4
echo ====================================================
echo.

:: Detection automatique de l'IP locale pour mobile / tablette
set "LOCAL_IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    if not defined LOCAL_IP set "LOCAL_IP=%%a"
)
if defined LOCAL_IP (
    set "LOCAL_IP=%LOCAL_IP: =%"
    echo [Mobile/Tablette] Acces WiFi local : http://%LOCAL_IP%:5173
) else (
    echo [Mobile/Tablette] Acces WiFi local : http://[Ton-IP-Locale]:5173
)
echo [PC] Acces direct : http://localhost:5173
echo.

:: Verification automatique de node_modules
if not exist "node_modules\" (
    echo [Initialisation] Installation des packages requis (une seule fois)...
    call npm install
)

echo Lancement du serveur Fluent...
start "" "http://localhost:5173"
call npm run dev -- --host
pause
