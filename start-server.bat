@echo off
title Osobni web - server
cd /d "%~dp0"

rem Ukonci pripadny server, ktery uz na portu 3210 visi
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3210 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }" >nul 2>&1

if not exist "node_modules" (
  echo Prvni spusteni - instaluji zavislosti...
  call npm install
)

if not exist ".next\BUILD_ID" (
  echo Pripravuji build - muze to chvili trvat...
  call npm run build
)

echo.
echo  ------------------------------------------
echo   Osobni web bezi na http://localhost:3210
echo   Pro ukonceni zavri toto okno.
echo  ------------------------------------------
echo.

rem Otevri prohlizec po 2 sekundach, az nabehne server
start "" /min cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3210"

call npm run start -- -p 3210
pause
