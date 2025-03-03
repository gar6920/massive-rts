# Massive RTS Game - Quick Start Guide

## Running the Game

### From File Explorer:
1. Double-click on `start.bat` to start the game server
2. A browser window will automatically open with the game
3. When done, press Ctrl+C in the command window and then press Y to confirm stopping the server
   - Alternatively, you can double-click `stop.bat` to force-stop the server

### From Terminal:

#### In Command Prompt:
1. To start the game: `start.bat`
2. To stop the game: `stop.bat`

#### In PowerShell:
1. To start the game: `.\start.bat`
2. To stop the game: `.\stop.bat`

**Note:** In PowerShell, you must use the `.\` prefix to run scripts in the current directory.

## Game Controls

- **Camera Movement**:
  - Move your mouse to the edges of the screen
  - Use arrow keys or WASD keys

- **Unit Control**:
  - Left-click to select the unit
  - Right-click to command the selected unit to move to that location

## Troubleshooting

- If the browser doesn't automatically open, manually navigate to: http://localhost:8080/public/index.html
- If you see a "port already in use" error, run the stop script first to free up port 8080
- If the stop script doesn't work, you may need to manually end the Python process in Task Manager

## Game Features

- Procedurally generated terrain with different tile types
- Basic unit movement
- Camera panning
- Selection mechanics

## Utility Scripts

### Code Compilation
To create a single text file containing all the code in the project:

1. Run `compile_code.bat` (or `.\compile_code.bat` in PowerShell)
2. This will create/update `codecompilation.txt` in the root directory
3. The file will contain all JavaScript, HTML, CSS, and package.json content

This is useful for:
- Code reviews
- Documentation
- Sharing code snippets
- Backup purposes

Enjoy playing Massive RTS! 