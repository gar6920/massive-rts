@echo off
echo ===== Starting Massive RTS Game =====

:: Create dist and public/js directories if they don't exist
if not exist "dist" mkdir "dist"
if not exist "public\js" mkdir "public\js"

:: Build server and client
echo Building server...
call npm run build:server
if %ERRORLEVEL% neq 0 (
    echo Error building server bundle
    pause
    exit /b %ERRORLEVEL%
)

echo Building client...
call npm run build:client
if %ERRORLEVEL% neq 0 (
    echo Error building client bundle
    pause
    exit /b %ERRORLEVEL%
)

:: Run the server
echo Starting server...
start /B node dist/server.bundle.js

:: Open the browser
echo Opening browser...
timeout /t 2 >nul
start http://localhost:2567

echo ===== Game started =====
echo Use stop.bat to stop the server when done. 