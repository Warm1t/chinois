@echo off
title Configuration Automatique AnkiConnect pour Fluent
echo ==========================================================
echo   Configuration AnkiConnect - Acces Universel Tout Appareil
echo ==========================================================
echo.

set "ANKI_CONFIG_DIR=%APPDATA%\Anki2\addons21\2055492159"
set "ANKI_CONFIG_FILE=%ANKI_CONFIG_DIR%\config.json"

if not exist "%ANKI_CONFIG_DIR%" (
    echo [ATTENTION] Le dossier du greffon AnkiConnect n'a pas ete trouve dans :
    echo "%ANKI_CONFIG_DIR%"
    echo.
    echo Assure-toi d'avoir installe le greffon AnkiConnect dans Anki :
    echo Dans Anki : Outils -^> Greffons -^> Telecharger des greffons -^> Code : 2055492159
    echo.
    mkdir "%ANKI_CONFIG_DIR%" 2>nul
)

echo Ecriture de la configuration universelle AnkiConnect (CORS * et Bind 0.0.0.0)...

(
echo {
echo     "apiKey": null,
echo     "apiLogPath": null,
echo     "webBindAddress": "0.0.0.0",
echo     "webBindPort": 8765,
echo     "webCorsOriginList": [
echo         "http://localhost",
echo         "*"
echo     ],
echo     "ignoreOriginList": []
echo }
) > "%ANKI_CONFIG_FILE%"

echo.
echo ==========================================================
echo  [SUCCES] AnkiConnect est maintenant configure pour :
echo   1. Accepter les connexions sans blocage CORS (Origin: *)
echo   2. Repondre sur tout le reseau local WiFi (0.0.0.0)
echo ==========================================================
echo.
echo Note : Si Anki etait ouvert, redemarre-le une fois pour activer l'ecoute 0.0.0.0.
echo.
pause
