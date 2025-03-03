@echo off
echo Stopping Massive RTS Game Server...
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    taskkill /F /PID %%a
    echo Server stopped successfully.
    goto end
)
echo No server running on port 8080.
:end
timeout /t 3 >nul 