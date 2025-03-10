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
      console.log("Connecting to server...");
      this.uiManager.showNotification("Connecting to server...");
      
      // Join or create a game room
      this.room = await this.client.joinOrCreate("game_room");
      
      // Store player ID
      this.playerId = this.room.sessionId;
      console.log("Connected to server with ID:", this.playerId);
      this.uiManager.showNotification(`Connected! Your ID: ${this.playerId}`);
      
      // Set up state change listeners
      this.setupStateListeners();
      
      // Set up other room listeners
      this.setupRoomListeners();

      // Handle disconnection
      this.room.onLeave((code) => {
        console.log("Left room:", code);
        this.uiManager.showNotification("Disconnected from server. Attempting to reconnect...");
        // Try to reconnect after 3 seconds
        setTimeout(() => this.connectToServer(), 3000);
      });
      
      return true;
    } catch (error) {
      console.error("Failed to connect to server:", error);
      this.uiManager.showNotification("Failed to connect. Retrying in 3 seconds...");
      // Try to reconnect after 3 seconds
      setTimeout(() => this.connectToServer(), 3000);
      return false;
    }
  }
  
  setupStateListeners() {
    // Listen for game state changes
    this.room.onMessage("gameState", (state) => {
      console.log('Received gameState message:', state);
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
    
    // Extract the actual game state from the message
    const gameState = state.gameState || state;
    
    if (!gameState) {
      console.error('No game state data received');
      return;
    }

    try {
      // Update players
      const oldPlayerCount = this.players.size;
      this.players.clear();
      if (gameState.players && typeof gameState.players.forEach === 'function') {
        gameState.players.forEach((playerData, id) => {
          this.players.set(id, playerData);
        });
        
        // Notify if player count changed
        if (this.players.size !== oldPlayerCount) {
          this.uiManager.updatePlayerCount(this.players.size);
        }
      }

      // Update buildings
      this.buildings.clear();
      if (gameState.buildings && typeof gameState.buildings.forEach === 'function') {
        gameState.buildings.forEach((building, id) => {
          this.buildings.set(id, building);
        });
      }

      // Update units
      this.units.clear();
      if (gameState.units && typeof gameState.units.forEach === 'function') {
        gameState.units.forEach((unit, id) => {
          this.units.set(id, unit);
        });
      }

      // Update map if provided
      if (gameState.map && Array.isArray(gameState.map)) {
        this.map = Array.from(gameState.map);
        // Center camera on map if this is the first time receiving map data
        if (!this.hasReceivedMap) {
          this.renderer.centerOnMap();
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
    // Clear canvas
    this.renderer.clear();
    
    // Render map
    this.renderer.renderMap(this.map);
    
    // Render buildings
    this.buildings.forEach(building => {
      this.renderer.renderBuilding(building);
    });
    
    // Render units
    this.units.forEach(unit => {
      this.renderer.renderUnit(unit);
    });
    
    // Render heroes
    this.players.forEach(playerData => {
      if (playerData.hero) {
        this.renderer.renderHero(playerData.hero, playerData.id === this.playerId);
      }
    });
    
    // Render selection highlight
    this.selectedEntities.forEach(entity => {
      this.renderer.renderSelection(entity);
    });
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