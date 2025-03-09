# Massive RTS Game

A browser-based RTS game with massively multiplayer capabilities, featuring procedurally generated maps and AI-controlled opponents.

## Project Overview

This is a simplified, browser-based RTS game prototype with the following features:

- Short match length (1-hour cycles)
- Massively multiplayer with drop-in/drop-out capability
- Cooperative gameplay: Humans vs. AI-controlled opponents
- Adaptive difficulty based on human team performance
- Isometric tile-based map with varying sizes based on player count
- Building construction and unit management
- AI-controlled enemies that become stronger over time

## Current Features

- Isometric map with dynamic size based on player count
- Hero units for each player
- Building construction and unit hiring
- Resource management
- AI opponents with scaling difficulty
- 1-hour match time limit with victory conditions

## Setup and Installation

The game is designed to be self-contained with all dependencies installed locally.

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
   - Check for and install any required dependencies locally
   - Build the server and client bundles using the locally installed webpack
   - Start the Node.js multiplayer server
   - Automatically open your browser to the game

3. To stop the server when done:
   ```
   stop.bat
   ```

## Dependencies

All dependencies are installed locally in the project's node_modules folder. The game does not require any globally installed packages. The start.bat script will handle installing all necessary dependencies.

Key dependencies include:
- Colyseus (multiplayer game server framework)
- Webpack (for bundling the application)
- Babel (for transpiling modern JavaScript)
- Express (web server)

## Multiplayer System

The game uses Colyseus for multiplayer functionality:

1. The server runs on port 2567 by default
2. Players connect by opening their browser to the server URL
3. Each player gets a unique ID and controls their own hero unit
4. Game state is synchronized in real-time between all connected players
5. Players can see each other's units and buildings in the shared game world

## Controls

- **Mouse Movement**: Move the camera by moving the mouse to the screen edges
- **Arrow Keys/WASD**: Move the camera
- **Left Click**: Select units/buildings
- **Right Click**: Command selected units to move or attack
- **Click and Drag**: Select multiple units

## Project Structure

```
massive-rts/
├── dist/                   # Compiled server bundle
├── public/
│   ├── index.html          # HTML canvas container
│   ├── styles.css          # Global styles
│   └── js/                 # Compiled client bundle
├── server/
│   ├── server.js           # Main server entry point
│   ├── rooms/              # Colyseus room handlers
│   └── schema/             # State schemas for synchronization
├── src/
│   ├── game/               # Client-side game components
│   ├── entities/           # Game entity definitions
│   └── index.js            # Main client entry point
├── webpack.client.config.js # Client webpack config
├── webpack.server.config.js # Server webpack config
├── package.json            # Dependencies & project info
├── start.bat               # Script to start the game server
├── stop.bat                # Script to stop the game server
└── README.md               # This file
```

## Architecture

The game uses a client-server architecture:

- **Server**: Node.js with Colyseus
  - Maintains the authoritative game state
  - Processes player commands
  - Handles AI logic and game rules
  - Synchronizes state to all clients

- **Client**: Browser with Colyseus.js client
  - Renders the game world and entities
  - Captures user input
  - Sends commands to the server
  - Displays game UI and notifications

## Future Development

- Enhanced graphics and animations
- More building and unit types
- Advanced AI behaviors
- Chat system for player communication
- Team-based gameplay

## License

This project is licensed under the MIT License - see the LICENSE file for details. 