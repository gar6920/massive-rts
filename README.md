# Massive RTS Game

A browser-based RTS game with massively multiplayer capabilities, featuring procedurally generated maps and AI-controlled opponents.

## Project Overview

This is a simplified, browser-based RTS game prototype with the following features:

- Short match length (1-hour cycles)
- Massively multiplayer with drop-in/drop-out capability
- Cooperative gameplay: Humans vs. AI-controlled opponents
- Adaptive difficulty based on human team performance
- AI-generated variation (maps, NPCs, units) via external APIs

## Current Development Phase (Phase 2)

- Basic, Warcraft-like top-down map
- Procedurally generated terrain on HTML5 Canvas
- Single controllable unit with camera panning
- **Multiplayer functionality with real-time synchronization**

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd massive-rts
   ```

2. Start the game server:
   ```
   start.bat
   ```
   This will:
   - Check for and install any required dependencies
   - Start the Node.js multiplayer server
   - Automatically open your browser to the game

3. To stop the server when done:
   ```
   stop.bat
   ```

## Multiplayer Setup

The game now supports multiplayer functionality using Node.js and Socket.IO:

1. The server runs on port 3000 by default
2. Players connect by opening their browser to the server URL
3. Each player gets a unique ID and can control their own units
4. Game state is synchronized in real-time between all connected players
5. Players can see each other's units and interact in the same game world

## Controls

- **Mouse Movement**: Move the camera by moving the mouse to the screen edges
- **Arrow Keys/WASD**: Move the camera
- **Left Click**: Select units
- **Right Click**: Command selected units to move
- **Click and Drag**: Select multiple units

## Project Structure

```
massive-rts/
├── public/
│   ├── index.html           # HTML canvas container
│   ├── styles.css           # Global styles
│   └── assets/              # Images/sprites (if any)
├── src/
│   ├── game/
│   │   ├── Game.js          # Main game loop & initialization
│   │   ├── Renderer.js      # Canvas rendering logic
│   │   ├── InputHandler.js  # User inputs (keyboard, mouse)
│   │   ├── Camera.js        # Camera panning logic
│   │   ├── Config.js        # Game constants/configurations
│   │   └── Multiplayer.js   # Client-side multiplayer integration
│   │
│   ├── entities/
│   │   ├── Entity.js        # Base class for all units/buildings
│   │   ├── Unit.js          # Player/AI controlled units
│   │   ├── Building.js      # Structures (future expansions)
│   │   └── NPC.js           # AI controlled units (future expansions)
│   │
│   ├── map/
│   │   ├── Map.js           # Map generation & management logic
│   │   └── Tile.js          # Individual map tiles
│   │
│   └── utils/
│       └── helpers.js       # Utility functions
│
├── server/
│   └── index.js             # Node.js server for multiplayer
│
├── tests/                   # Unit tests (future)
├── package.json             # Dependencies & project info
├── start.bat                # Script to start the game server
├── stop.bat                 # Script to stop the game server
└── README.md                # This file
```

## Multiplayer Architecture

The multiplayer system uses a client-server architecture:

- **Server**: Node.js with Express and Socket.IO
  - Maintains the authoritative game state
  - Processes player commands
  - Broadcasts state updates to all clients
  - Handles player connections/disconnections

- **Client**: Browser with Socket.IO client
  - Sends player commands to the server
  - Receives and renders game state updates
  - Interpolates entity positions between updates
  - Handles local input and camera controls

## Future Development

- Resource gathering and base building
- Unit production and tech trees
- AI opponents with varying difficulty levels
- Enhanced graphics and animations
- Chat system for player communication
- Team-based gameplay

## License

This project is licensed under the MIT License - see the LICENSE file for details. 