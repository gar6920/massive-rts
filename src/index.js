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
      
      // Join or create a game room
      this.room = await this.client.joinOrCreate("game_room");
      
      // Store player ID
      this.playerId = this.room.sessionId;
      console.log("Connected to server with ID:", this.playerId);
      
      // Set up state change listeners
      this.setupStateListeners();
      
      // Set up other room listeners
      this.setupRoomListeners();
      
      return true;
    } catch (error) {
      console.error("Failed to connect to server:", error);
      return false;
    }
  }
  
  setupStateListeners() {
    // Listen for game state changes
    this.room.onStateChange((state) => {
      // Update local game state from server state
      this.updateGameState(state);
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
    // Update players
    this.players.clear();
    state.players.forEach((playerData, id) => {
      this.players.set(id, playerData);
    });
    
    // Update buildings
    this.buildings.clear();
    state.buildings.forEach((building, id) => {
      this.buildings.set(id, building);
    });
    
    // Update units
    this.units.clear();
    state.units.forEach((unit, id) => {
      this.units.set(id, unit);
    });
    
    // Update map if it has changed
    if (state.map.length !== this.map.length) {
      this.map = Array.from(state.map);
    }
    
    // Update base health
    this.humanBaseHealth = state.humanBaseHealth;
    this.aiBaseHealth = state.aiBaseHealth;
    
    // Update game time
    this.gameTime = state.gameTime;
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