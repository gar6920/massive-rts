@echo off
echo ===== Starting Massive RTS Game =====

:: Create dist and public/js directories if they don't exist
if not exist "dist" mkdir "dist"
if not exist "public\js" mkdir "public\js"

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo Error installing dependencies
        pause
        exit /b %ERRORLEVEL%
    )
) else (
    :: If dependencies exist, just check if any are missing
    echo Checking dependencies...
    call npm install --no-audit --no-fund --loglevel=error
    if %ERRORLEVEL% neq 0 (
        echo Error checking dependencies
        pause
        exit /b %ERRORLEVEL%
    )
)

:: Build server and client using locally installed webpack
echo Building server...
call node_modules\.bin\webpack --config webpack.server.config.js
if %ERRORLEVEL% neq 0 (
    echo Error building server bundle
    pause
    exit /b %ERRORLEVEL%
)

echo Building client...
call node_modules\.bin\webpack --config webpack.client.config.js
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
start http://localhost:3000

echo ===== Game started =====
echo Use stop.bat to stop the server when done. 