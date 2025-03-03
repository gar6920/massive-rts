@echo off
echo Starting Massive RTS Game Server...
echo.
echo Server will be available at: http://localhost:8080/public/index.html
echo.
echo Press Ctrl+C and then Y to stop the server when done.
echo.
start http://localhost:8080/public/index.html
python -m http.server 8080 