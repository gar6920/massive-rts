@echo off
echo Compiling all code into codecompilation.txt...

:: Delete existing compilation file if it exists
if exist codecompilation.txt del /f codecompilation.txt

:: Create new file with header
echo Massive RTS Game - Code Compilation > codecompilation.txt
echo Created: %date% %time% >> codecompilation.txt
echo ======================================== >> codecompilation.txt
echo. >> codecompilation.txt

:: Process all JavaScript files in src directory and subdirectories
echo Adding JavaScript files... 
for /r src %%f in (*.js) do (
    echo. >> codecompilation.txt
    echo ======================================== >> codecompilation.txt
    echo FILE: %%f >> codecompilation.txt
    echo ======================================== >> codecompilation.txt
    echo. >> codecompilation.txt
    type "%%f" >> codecompilation.txt
    echo. >> codecompilation.txt
    echo. >> codecompilation.txt
)

:: Add HTML files
echo Adding HTML files...
for /r public %%f in (*.html) do (
    echo. >> codecompilation.txt
    echo ======================================== >> codecompilation.txt
    echo FILE: %%f >> codecompilation.txt
    echo ======================================== >> codecompilation.txt
    echo. >> codecompilation.txt
    type "%%f" >> codecompilation.txt
    echo. >> codecompilation.txt
    echo. >> codecompilation.txt
)

:: Add CSS files
echo Adding CSS files...
for /r public %%f in (*.css) do (
    echo. >> codecompilation.txt
    echo ======================================== >> codecompilation.txt
    echo FILE: %%f >> codecompilation.txt
    echo ======================================== >> codecompilation.txt
    echo. >> codecompilation.txt
    type "%%f" >> codecompilation.txt
    echo. >> codecompilation.txt
    echo. >> codecompilation.txt
)

:: Add package.json
echo Adding package.json...
echo. >> codecompilation.txt
echo ======================================== >> codecompilation.txt
echo FILE: package.json >> codecompilation.txt
echo ======================================== >> codecompilation.txt
echo. >> codecompilation.txt
type "package.json" >> codecompilation.txt
echo. >> codecompilation.txt
echo. >> codecompilation.txt

echo Code compilation complete! All code has been saved to codecompilation.txt
echo. 