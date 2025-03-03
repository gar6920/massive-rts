@echo off
echo Stopping Massive RTS Game Server...
echo.

:: Find and kill the Node.js process running on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Found server process with PID: %%a
    taskkill /F /PID %%a
    if %ERRORLEVEL% equ 0 (
        echo Server stopped successfully.
    ) else (
        echo Failed to stop server. You may need to end the process manually.
    )
    goto end
)

echo No server running on port 3000.

:end
timeout /t 3 >nul 