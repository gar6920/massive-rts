@echo off
echo Starting Massive RTS Game Server...
echo.

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed or not in the PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check for package.json
if not exist package.json (
    echo Error: package.json not found.
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

:: Install dependencies if needed
echo Checking dependencies...
call npm install --no-audit --no-fund --loglevel=error
if %ERRORLEVEL% neq 0 (
    echo Error installing dependencies.
    pause
    exit /b 1
)

:: Start the server
echo.
echo Starting server...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server when done.
echo.

:: Open the browser
start http://localhost:3000

:: Start the Node.js server
node server/index.js 