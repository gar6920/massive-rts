import { Client } from "colyseus.js";
import { Renderer } from "./game/RendererColyseus";
import { InputHandler } from "./game/InputHandler";
import { UIManager } from "./game/UIManager";

// Create a global game instance
window.gameInstance = null;

// Initialize the game when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create game instance
  window.gameInstance = new Game();
  
  // Start the game
  window.gameInstance.start();
});

// Game class
class Game {
  constructor() {
    console.log("Initializing game...");
    
    // Colyseus client
    this.client = new Client("ws://localhost:3000");
    this.room = null;
    
    // Game components
    this.renderer = null;
    this.inputHandler = null;
    this.uiManager = null;
    
    // Game state
    this.playerId = null;
    this.players = new Map();
    this.buildings = new Map();
    this.units = new Map();
    this.map = [];
    this.humanBaseHealth = 1000;
    this.aiBaseHealth = 1000;
    this.gameTime = 0;
    
    // Selected entities
    this.selectedEntities = [];
  }
  
  async start() {
    console.log("Starting game...");
    
    try {
      // Initialize game components
      this.renderer = new Renderer(document.getElementById("game-canvas"));
      this.inputHandler = new InputHandler(this);
      this.uiManager = new UIManager(this);
      
      // Connect to Colyseus server
      await this.connectToServer();
      
      // Start game loop
      this.gameLoop();
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }
  
  async connectToServer() {
    try {
      console.log('\n=== Connecting to Server ===');
      console.log('Client initialized:', !!this.client);
      this.uiManager.showNotification("Connecting to server...");
      
      // Add debug element to the DOM for connection status
      const debugElement = document.createElement('div');
      debugElement.id = 'connection-status';
      debugElement.style.position = 'fixed';
      debugElement.style.top = '10px';
      debugElement.style.left = '10px';
      debugElement.style.padding = '10px';
      debugElement.style.background = 'rgba(0,0,0,0.7)';
      debugElement.style.color = 'white';
      debugElement.style.fontFamily = 'monospace';
      debugElement.style.zIndex = '9999';
      debugElement.innerText = 'Connecting...';
      document.body.appendChild(debugElement);
      
      // Join or create a game room
      console.log('Attempting to join game_room...');
      this.room = await this.client.joinOrCreate("game_room");
      
      // Store player ID
      this.playerId = this.room.sessionId;
      console.log('Connected successfully!');
      console.log('Session ID:', this.playerId);
      console.log('Room:', this.room.name);
      console.log('Room ID:', this.room.id);
      this.uiManager.showNotification(`Connected! Your ID: ${this.playerId}`);
      
      // Update debug element
      document.getElementById('connection-status').innerText = `Connected! ID: ${this.playerId}
Players: ${this.players.size}`;
      document.getElementById('connection-status').style.background = 'rgba(0,128,0,0.7)';
      
      // Set up state change listeners
      console.log('Setting up state listeners...');
      this.setupStateListeners();
      
      // Set up other room listeners
      console.log('Setting up room listeners...');
      this.setupRoomListeners();

      // Handle disconnection
      this.room.onLeave((code) => {
        console.log('\n=== Disconnected from Server ===');
        console.log('Disconnect code:', code);
        this.uiManager.showNotification("Disconnected from server. Attempting to reconnect...");
        
        // Update debug element
        document.getElementById('connection-status').innerText = 'Disconnected! Reconnecting...';
        document.getElementById('connection-status').style.background = 'rgba(255,0,0,0.7)';
        
        // Try to reconnect after 3 seconds
        setTimeout(() => this.connectToServer(), 3000);
      });
      
      console.log('=== Connection Complete ===\n');
      return true;
    } catch (error) {
      console.error('\n=== Connection Error ===');
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      this.uiManager.showNotification("Failed to connect. Retrying in 3 seconds...");
      
      // Update debug element
      if (document.getElementById('connection-status')) {
        document.getElementById('connection-status').innerText = `Connection error: ${error.message}`;
        document.getElementById('connection-status').style.background = 'rgba(255,0,0,0.7)';
      }
      
      // Try to reconnect after 3 seconds
      setTimeout(() => this.connectToServer(), 3000);
      console.log('=== Connection Error Handled ===\n');
      return false;
    }
  }
  
  setupStateListeners() {
    // Listen for game state changes
    this.room.onMessage("gameState", (state) => {
      console.log('\n=== Received gameState Message ===');
      console.log('Message type:', typeof state);
      console.log('Message keys:', Object.keys(state));
      console.log('PlayerId:', state.playerId);
      
      if (state.gameState) {
        console.log('GameState keys:', Object.keys(state.gameState));
        console.log('Players present:', !!state.gameState.players);
        console.log('Buildings present:', !!state.gameState.buildings);
        console.log('Units present:', !!state.gameState.units);
        
        if (state.gameState.players) {
          console.log('Players data type:', typeof state.gameState.players);
          console.log('Players has forEach?', typeof state.gameState.players.forEach === 'function');
          
          if (typeof state.gameState.players.forEach === 'function') {
            let playerCount = 0;
            state.gameState.players.forEach(() => {
              playerCount++;
            });
            console.log('Player count in message:', playerCount);
          }
        }
      }
      
      this.updateGameState(state);
    });

    // Listen for player join events
    this.room.onMessage("player_joined", (data) => {
      console.log('Player joined:', data.id);
    });

    // Listen for game over events
    this.room.onMessage("game_over", (data) => {
      console.log('Game over! Winner:', data.winner);
      console.log('Final scores - Human base:', data.humanBaseHealth, 'AI base:', data.aiBaseHealth);
      console.log('Game duration:', data.gameTime, 'seconds');
    });
  }
  
  setupRoomListeners() {
    // Player joined
    this.room.onMessage("player_joined", (message) => {
      console.log("Player joined:", message.id);
      // Update UI accordingly
      this.uiManager.showNotification(`Player ${message.id} joined the game.`);
    });
    
    // Player left
    this.room.onMessage("player_left", (message) => {
      console.log("Player left:", message.id);
      // Update UI accordingly
      this.uiManager.showNotification(`Player ${message.id} left the game.`);
    });
    
    // Game over
    this.room.onMessage("game_over", (message) => {
      console.log("Game over!", message);
      // Show game over screen
      this.uiManager.showGameOver(message);
    });
  }
  
  updateGameState(state) {
    console.log('\n=== Updating Game State ===');
    console.log('Raw state received:', state);
    
    // Extract the actual game state from the message
    const gameState = state.gameState || state;
    console.log('Processed gameState type:', typeof gameState);
    console.log('Processed gameState keys:', gameState ? Object.keys(gameState) : 'null');
    
    if (!gameState) {
      console.error('No game state data received');
      return;
    }

    try {
      // Debug players data
      console.log('Players data type:', typeof gameState.players);
      console.log('Players has forEach?', gameState.players && typeof gameState.players.forEach === 'function');
      
      // Update players
      const oldPlayerCount = this.players.size;
      this.players.clear();
      if (gameState.players && typeof gameState.players.forEach === 'function') {
        console.log('About to process players data');
        gameState.players.forEach((playerData, id) => {
          console.log('Processing player:', id, 'Hero present:', !!playerData.hero);
          this.players.set(id, playerData);
        });
        
        // Notify if player count changed
        if (this.players.size !== oldPlayerCount) {
          this.uiManager.updatePlayerCount(this.players.size);
        }
        console.log('Final player count:', this.players.size);
      } else {
        console.warn('Invalid players data:', gameState.players);
      }

      // Debug buildings data
      console.log('Buildings data type:', typeof gameState.buildings);
      console.log('Buildings has forEach?', gameState.buildings && typeof gameState.buildings.forEach === 'function');
      
      // Update buildings
      this.buildings.clear();
      if (gameState.buildings && typeof gameState.buildings.forEach === 'function') {
        console.log('About to process buildings data');
        gameState.buildings.forEach((building, id) => {
          console.log('Processing building:', id, building.type, building.position?.x, building.position?.y);
          this.buildings.set(id, building);
        });
        console.log('Final building count:', this.buildings.size);
      } else {
        console.warn('Invalid buildings data:', gameState.buildings);
      }

      // Debug units data
      console.log('Units data type:', typeof gameState.units);
      console.log('Units has forEach?', gameState.units && typeof gameState.units.forEach === 'function');
      
      // Update units
      this.units.clear();
      if (gameState.units && typeof gameState.units.forEach === 'function') {
        console.log('About to process units data');
        gameState.units.forEach((unit, id) => {
          console.log('Processing unit:', id, unit.type, unit.position?.x, unit.position?.y);
          this.units.set(id, unit);
        });
        console.log('Final unit count:', this.units.size);
      } else {
        console.warn('Invalid units data:', gameState.units);
      }

      // Update map if provided
      if (gameState.map && Array.isArray(gameState.map)) {
        this.map = Array.from(gameState.map);
        
        // Just set the flag without any camera centering
        if (!this.hasReceivedMap) {
          console.log('First map data received, setting hasReceivedMap flag');
          this.hasReceivedMap = true;
        }
      }

      // Update base health and show changes
      if (typeof gameState.humanBaseHealth === 'number' && this.humanBaseHealth !== gameState.humanBaseHealth) {
        const change = gameState.humanBaseHealth - this.humanBaseHealth;
        if (change < 0) {
          this.uiManager.showNotification(`Human base took ${-change} damage!`);
        }
        this.humanBaseHealth = gameState.humanBaseHealth;
      }
      
      if (typeof gameState.aiBaseHealth === 'number' && this.aiBaseHealth !== gameState.aiBaseHealth) {
        const change = gameState.aiBaseHealth - this.aiBaseHealth;
        if (change < 0) {
          this.uiManager.showNotification(`AI base took ${-change} damage!`);
        }
        this.aiBaseHealth = gameState.aiBaseHealth;
      }

      // Update game time
      if (typeof gameState.gameTime === 'number') {
        this.gameTime = gameState.gameTime;
        this.uiManager.updateGameTime(this.gameTime);
      }
      
      // Trigger a render update
      if (this.renderer) {
        this.renderer.render();
      }
      
    } catch (error) {
      console.error('Error updating game state:', error);
      console.error('Error stack:', error.stack);
      console.error('State that caused error:', JSON.stringify(gameState).slice(0, 200) + '...');
      this.uiManager.showNotification('Error updating game state');
    }
  }
  
  gameLoop() {
    // Render the game
    this.render();
    
    // Update UI
    this.uiManager.update();
    
    // Request next frame
    requestAnimationFrame(() => this.gameLoop());
  }
  
  render() {
    console.log('\n=== Render Called ===');
    
    // Clear canvas
    this.renderer.clear();
    
    // Render map
    console.log('Rendering map, size:', this.map?.length || 0);
    this.renderer.renderMap(this.map);
    
    // Render buildings
    console.log('Buildings to render:', this.buildings?.size || 0);
    this.buildings.forEach(building => {
      console.log('Rendering building:', building.id, building.type, building.position?.x, building.position?.y);
      this.renderer.renderBuilding(building);
    });
    
    // Render units
    console.log('Units to render:', this.units?.size || 0);
    this.units.forEach(unit => {
      console.log('Rendering unit:', unit.id, unit.type, unit.position?.x, unit.position?.y);
      this.renderer.renderUnit(unit);
    });
    
    // Render heroes
    console.log('Players to check for heroes:', this.players?.size || 0);
    this.players.forEach(playerData => {
      if (playerData.hero) {
        console.log('Rendering hero for player:', playerData.id, 'at position:', playerData.hero.position?.x, playerData.hero.position?.y);
        const isSelected = this.selectedEntities.includes(playerData.hero);
        const isOwnHero = playerData.id === this.playerId;
        this.renderer.renderHero(playerData.hero, isSelected, isOwnHero);
      } else {
        console.log('Player has no hero:', playerData.id);
      }
    });
    
    // Render selection highlight
    console.log('Selected entities:', this.selectedEntities.length);
    this.selectedEntities.forEach(entity => {
      console.log('Rendering selection for:', entity.id, entity.type);
      this.renderer.renderSelection(entity);
    });
    
    console.log('=== Render Complete ===\n');
  }
  
  // Game actions
  
  moveHero(x, y) {
    // Send move hero message to server
    this.room.send("move_hero", { x, y });
  }
  
  moveUnit(unitId, x, y) {
    // Send move unit message to server
    this.room.send("move_unit", { unitId, x, y });
  }
  
  attack(unitId, targetId) {
    // Send attack message to server
    this.room.send("attack", { unitId, targetId });
  }
  
  buildStructure(buildingType, x, y) {
    // Send build message to server
    this.room.send("build", { buildingType, x, y });
  }
  
  hireUnit(unitType, buildingId) {
    // Send hire unit message to server
    this.room.send("hire_unit", { unitType, buildingId });
  }
  
  selectEntity(entity) {
    // Clear previous selection
    this.selectedEntities = [];
    
    // Add new selection
    if (entity) {
      this.selectedEntities.push(entity);
    }
    
    // Update UI with selected entity info
    this.uiManager.updateSelectionInfo(this.selectedEntities);
  }
  
  selectMultipleEntities(entities) {
    // Clear previous selection
    this.selectedEntities = [];
    
    // Add new selections
    this.selectedEntities = [...entities];
    
    // Update UI with selected entities info
    this.uiManager.updateSelectionInfo(this.selectedEntities);
  }
}

export { Game }; 