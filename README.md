# Massive RTS Game

A browser-based RTS game with massively multiplayer capabilities, featuring procedurally generated maps and AI-controlled opponents.

## Project Overview

This is a simplified, browser-based RTS game prototype with the following features:

- Short match length (1-hour cycles)
- Massively multiplayer with drop-in/drop-out capability
- Cooperative gameplay: Humans vs. AI-controlled opponents
- Adaptive difficulty based on human team performance
- AI-generated variation (maps, NPCs, units) via external APIs

## Current Development Phase (Phase 1)

- Basic, Warcraft-like top-down map
- Procedurally generated terrain on HTML5 Canvas
- Single controllable unit with camera panning

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd massive-rts
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080/public/
   ```

## Controls

- **Mouse Movement**: Move the camera by moving the mouse to the screen edges
- **Arrow Keys/WASD**: Move the camera
- **Left Click**: Select units
- **Right Click**: Command selected units to move
- **Click and Drag**: Select multiple units (future feature)

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
│   │   └── Config.js        # Game constants/configurations
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
├── tests/                   # Unit tests (future)
├── package.json             # Dependencies & project info
└── README.md                # This file
```

## Future Development

- Multiplayer functionality using WebSockets
- Resource gathering and base building
- Unit production and tech trees
- AI opponents with varying difficulty levels
- Enhanced graphics and animations

## License

This project is licensed under the MIT License - see the LICENSE file for details. 