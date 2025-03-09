const { Room } = require("colyseus");
const { GameState, PlayerData, Hero, Building, Unit, Position } = require("../schema/GameState");
const { v4: uuidv4 } = require("uuid");

class GameRoom extends Room {
  constructor() {
    super();
    this.autoDispose = false; // Don't automatically dispose the room when empty
    this.maxClients = 100; // Default max clients (will be adjusted based on options)
  }

  onCreate(options) {
    console.log("GameRoom created!");
    
    // Set max clients based on options or default to 100
    this.maxClients = options.maxPlayers || 100;
    
    // Create and set the game state
    this.setState(new GameState());
    
    // Generate map size based on player count (10 tiles per expected player)
    const mapSize = Math.max(20, Math.min(100, this.maxClients * 10));
    this.generateMap(mapSize);
    
    // Set up human and AI bases
    this.setupBases(mapSize);
    
    // Set up game timer (3600 seconds = 1 hour)
    this.setMetadata({ gameTime: 0, maxTime: 3600 });
    
    // Create a timer that ticks every second
    this.clock.setInterval(() => {
      // Update game time
      this.state.gameTime++;
      
      // Run AI logic every 5 seconds
      if (this.state.gameTime % 5 === 0) {
        this.runAILogic();
      }
      
      // End game after 60 minutes
      if (this.state.gameTime >= 3600) {
        this.endGame();
      }
    }, 1000);
    
    // Set up message handlers
    this.setupMessageHandlers();
    
    console.log("GameRoom initialized with map size:", mapSize);
  }
  
  generateMap(mapSize) {
    // Simple map generation - 0 represents empty tile
    for (let i = 0; i < mapSize * mapSize; i++) {
      this.state.map.push(0);
    }
    
    // TODO: Add more complex map generation with terrain, resources, etc.
  }
  
  setupBases(mapSize) {
    // Place human base near bottom-left
    const humanBaseX = Math.floor(mapSize * 0.2);
    const humanBaseY = Math.floor(mapSize * 0.8);
    
    // Create human base building
    const humanBase = new Building(
      "human_base",
      "headquarters",
      "human",
      humanBaseX,
      humanBaseY,
      1000
    );
    humanBase.isComplete = true;
    this.state.buildings.set(humanBase.id, humanBase);
    
    // Place AI base near top-right
    const aiBaseX = Math.floor(mapSize * 0.8);
    const aiBaseY = Math.floor(mapSize * 0.2);
    
    // Create AI base building
    const aiBase = new Building(
      "ai_base",
      "headquarters",
      "ai",
      aiBaseX,
      aiBaseY,
      1000
    );
    aiBase.isComplete = true;
    this.state.buildings.set(aiBase.id, aiBase);
  }
  
  setupMessageHandlers() {
    // Handle hero movement
    this.onMessage("move_hero", (client, message) => {
      const playerData = this.state.players.get(client.sessionId);
      if (playerData && playerData.hero) {
        playerData.hero.position.x = message.x;
        playerData.hero.position.y = message.y;
      }
    });
    
    // Handle building construction
    this.onMessage("build", (client, message) => {
      const { buildingType, x, y } = message;
      const playerData = this.state.players.get(client.sessionId);
      
      if (!playerData) return;
      
      // Check if player has enough resources
      // TODO: Add resource cost checks
      
      // Create new building
      const buildingId = `building_${uuidv4()}`;
      const building = new Building(
        buildingId,
        buildingType,
        client.sessionId,
        x,
        y,
        200 // Default health
      );
      
      // Add building to state
      this.state.buildings.set(buildingId, building);
      
      // TODO: Deduct resources
    });
    
    // Handle unit hiring
    this.onMessage("hire_unit", (client, message) => {
      const { unitType, buildingId } = message;
      const playerData = this.state.players.get(client.sessionId);
      const building = this.state.buildings.get(buildingId);
      
      if (!playerData || !building || building.owner !== client.sessionId) return;
      
      // Check if building is complete
      if (!building.isComplete) return;
      
      // Check if player has enough resources
      // TODO: Add resource cost checks
      
      // Create new unit
      const unitId = `unit_${uuidv4()}`;
      const unit = new Unit(
        unitId,
        unitType,
        client.sessionId,
        building.position.x + 1, // Spawn next to building
        building.position.y + 1,
        50 // Default health
      );
      
      // Add unit to state
      this.state.units.set(unitId, unit);
      
      // TODO: Deduct resources
    });
    
    // Handle unit movement
    this.onMessage("move_unit", (client, message) => {
      const { unitId, x, y } = message;
      const unit = this.state.units.get(unitId);
      
      if (!unit || unit.owner !== client.sessionId) return;
      
      unit.position.x = x;
      unit.position.y = y;
      unit.targetId = null; // Clear any attack target
    });
    
    // Handle unit attack
    this.onMessage("attack", (client, message) => {
      const { unitId, targetId } = message;
      const unit = this.state.units.get(unitId);
      
      if (!unit || unit.owner !== client.sessionId) return;
      
      // Set attack target
      unit.targetId = targetId;
    });
  }
  
  onJoin(client, options) {
    console.log(client.sessionId, "joined!");
    
    // Create player data
    const playerData = new PlayerData();
    
    // Create hero for the player
    const hero = new Hero(
      `hero_${client.sessionId}`,
      client.sessionId,
      50 + Math.floor(Math.random() * 20), // Random position near human base
      50 + Math.floor(Math.random() * 20),
      100
    );
    
    // Add some basic abilities to the hero
    hero.abilities.push({ name: "heal", cooldown: 30, currentCooldown: 0 });
    
    // Set the hero and add player to game state
    playerData.hero = hero;
    this.state.players.set(client.sessionId, playerData);
    
    // Broadcast player join event
    this.broadcast("player_joined", { id: client.sessionId });
  }
  
  onLeave(client, consented) {
    console.log(client.sessionId, "left!");
    
    // Mark player as disconnected but keep their data
    const playerData = this.state.players.get(client.sessionId);
    if (playerData) {
      playerData.isConnected = false;
      
      // Allow a grace period for reconnection
      this.clock.setTimeout(() => {
        if (playerData.isConnected === false) {
          // If player hasn't reconnected after 30 seconds, remove them
          this.state.players.delete(client.sessionId);
          
          // Remove player's buildings and units
          this.removePlayerEntities(client.sessionId);
        }
      }, 30000);
    }
    
    // Broadcast player leave event
    this.broadcast("player_left", { id: client.sessionId });
  }
  
  removePlayerEntities(playerId) {
    // Remove all buildings owned by this player
    this.state.buildings.forEach((building, id) => {
      if (building.owner === playerId) {
        this.state.buildings.delete(id);
      }
    });
    
    // Remove all units owned by this player
    this.state.units.forEach((unit, id) => {
      if (unit.owner === playerId) {
        this.state.units.delete(id);
      }
    });
  }
  
  runAILogic() {
    // Simple AI logic to attack human base and players
    
    // Count existing AI units
    let aiUnitCount = 0;
    this.state.units.forEach(unit => {
      if (unit.owner === "ai") {
        aiUnitCount++;
      }
    });
    
    // Spawn new units if below threshold
    const maxAiUnits = 10 + Math.floor(this.state.gameTime / 300) * 5; // Scale up over time
    
    if (aiUnitCount < maxAiUnits) {
      this.spawnAIUnits(maxAiUnits - aiUnitCount);
    }
    
    // Direct existing AI units
    this.state.units.forEach(unit => {
      if (unit.owner === "ai" && !unit.targetId) {
        // Find a target for this AI unit
        const target = this.findAITarget(unit);
        if (target) {
          unit.targetId = target.id;
        }
      }
    });
  }
  
  spawnAIUnits(count) {
    // Find AI buildings to spawn from
    const aiBuildings = [];
    this.state.buildings.forEach(building => {
      if (building.owner === "ai" && building.isComplete) {
        aiBuildings.push(building);
      }
    });
    
    if (aiBuildings.length === 0) return;
    
    // Spawn units from random AI buildings
    for (let i = 0; i < count; i++) {
      const building = aiBuildings[Math.floor(Math.random() * aiBuildings.length)];
      
      // Select unit type based on game time
      let unitType = "grunt";
      if (this.state.gameTime > 1800) { // After 30 minutes, spawn powerful units
        unitType = Math.random() > 0.7 ? "tank" : "grunt";
      } else if (this.state.gameTime > 900) { // After 15 minutes, mix in some better units
        unitType = Math.random() > 0.5 ? "scout" : "grunt";
      }
      
      const unitId = `ai_unit_${uuidv4()}`;
      const unit = new Unit(
        unitId,
        unitType,
        "ai",
        building.position.x + Math.floor(Math.random() * 3) - 1,
        building.position.y + Math.floor(Math.random() * 3) - 1,
        50
      );
      
      this.state.units.set(unitId, unit);
    }
  }
  
  findAITarget(aiUnit) {
    // Target priority: Heroes > Units > Buildings
    
    // Try to find a hero to attack
    let closestDistance = Infinity;
    let closestTarget = null;
    
    // Check for player heroes
    this.state.players.forEach(playerData => {
      if (playerData.isConnected && playerData.hero) {
        const distance = this.calculateDistance(
          aiUnit.position.x, aiUnit.position.y,
          playerData.hero.position.x, playerData.hero.position.y
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestTarget = { id: playerData.hero.id, type: "hero" };
        }
      }
    });
    
    // Check for player units
    this.state.units.forEach(unit => {
      if (unit.owner !== "ai") {
        const distance = this.calculateDistance(
          aiUnit.position.x, aiUnit.position.y,
          unit.position.x, unit.position.y
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestTarget = { id: unit.id, type: "unit" };
        }
      }
    });
    
    // If no units or heroes nearby, target human base
    if (!closestTarget || closestDistance > 20) {
      // Find human base
      const humanBase = this.findHumanBase();
      if (humanBase) {
        closestTarget = { id: humanBase.id, type: "building" };
      }
    }
    
    return closestTarget;
  }
  
  findHumanBase() {
    // Find the human headquarters
    let humanBase = null;
    
    this.state.buildings.forEach(building => {
      if (building.owner === "human" && building.type === "headquarters") {
        humanBase = building;
      }
    });
    
    return humanBase;
  }
  
  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  
  endGame() {
    // Determine winner based on base health
    let winner = null;
    
    if (this.state.humanBaseHealth <= 0) {
      winner = "ai";
    } else if (this.state.aiBaseHealth <= 0) {
      winner = "human";
    } else {
      // Time ran out, compare base health
      if (this.state.humanBaseHealth > this.state.aiBaseHealth) {
        winner = "human";
      } else if (this.state.aiBaseHealth > this.state.humanBaseHealth) {
        winner = "ai";
      } else {
        winner = "draw";
      }
    }
    
    // Broadcast game end event
    this.broadcast("game_over", { 
      winner,
      humanBaseHealth: this.state.humanBaseHealth,
      aiBaseHealth: this.state.aiBaseHealth,
      gameTime: this.state.gameTime
    });
    
    // Keep the room open for a while so clients can see the results
    this.clock.setTimeout(() => {
      this.disconnect();
    }, 10000);
  }
}

module.exports = { GameRoom }; 