@echo off
echo ===== Stopping Massive RTS Game =====

:: Find and kill the Node.js process running the server
echo Finding server process...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr "LISTENING" ^| findstr ":3000"') do (
    echo Found process: %%a
    echo Terminating process...
    taskkill /F /PID %%a
    if %ERRORLEVEL% neq 0 (
        echo Warning: Unable to terminate process. It may have already been stopped.
    ) else (
        echo Process terminated successfully.
    )
)

echo ===== Game server stopped =====
timeout /t 2 >nul 