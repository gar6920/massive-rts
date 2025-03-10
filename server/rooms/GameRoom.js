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
    console.log("\n=== Creating Game Room ===");
    console.log("GameRoom created with options:", options);
    
    // Set max clients based on options or default to 100
    this.maxClients = options.maxPlayers || 100;
    console.log("Max clients set to:", this.maxClients);
    
    // Create and set the game state
    this.setState(new GameState());
    console.log("Game state initialized");
    
    // Generate map size based on player count (10 tiles per expected player)
    const mapSize = Math.max(20, Math.min(100, this.maxClients * 10));
    console.log("Calculated map size:", mapSize);
    
    // Generate the map
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
    
    // Log the initial state
    console.log("\nInitial Game State:");
    console.log("Map size:", mapSize);
    console.log("Map array length:", this.state.map.length);
    console.log("Sample map data:", this.state.map.slice(0, 3));
    console.log("Buildings:", this.state.buildings.size);
    console.log("=== Game Room Creation Complete ===\n");
  }
  
  generateMap(mapSize) {
    console.log('\n=== Generating Map ===');
    console.log(`Generating map with size: ${mapSize}x${mapSize}`);
    
    // Clear existing map data
    while (this.state.map.length > 0) {
      this.state.map.pop();
    }
    
    // Create 2D array for map data
    const mapData = [];
    
    // Generate map with terrain types
    for (let y = 0; y < mapSize; y++) {
      const row = [];
      for (let x = 0; x < mapSize; x++) {
        // Create tile data
        const tile = {
          terrainType: 'grass', // Default terrain
          type: 'grass', // For backward compatibility
          passable: true,
          walkable: true,
          elevation: 1,
          x: x,
          y: y
        };
        
        // Add some variety with different terrain types
        const rand = Math.random();
        if (rand < 0.1) {
          tile.terrainType = 'water';
          tile.type = 'water';
          tile.passable = false;
          tile.walkable = false;
          tile.elevation = 0;
        } else if (rand < 0.2) {
          tile.terrainType = 'forest';
          tile.type = 'forest';
          tile.elevation = 2;
        } else if (rand < 0.25) {
          tile.terrainType = 'mountain';
          tile.type = 'mountain';
          tile.passable = false;
          tile.walkable = false;
          tile.elevation = 3;
        }
        
        row.push(tile);
      }
      mapData.push(row);
    }
    
    // Store the map data in state
    this.state.map = mapData;
    
    console.log(`Generated map dimensions: ${mapSize}x${mapSize}`);
    console.log('Map structure:', {
      rows: mapData.length,
      columns: mapData[0].length,
      totalTiles: mapData.length * mapData[0].length
    });
    console.log('Sample tiles:');
    console.log('Top-left:', mapData[0][0]);
    console.log('Center:', mapData[Math.floor(mapSize/2)][Math.floor(mapSize/2)]);
    console.log('Bottom-right:', mapData[mapSize-1][mapSize-1]);
    console.log('=== Map Generation Complete ===\n');
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
    console.log('\n=== Player Joining ===');
    console.log('Client ID:', client.sessionId);
    console.log('Join options:', options);
    
    // Create player data
    const playerData = new PlayerData();
    
    // Find human base position
    let humanBaseX = 0;
    let humanBaseY = 0;
    this.state.buildings.forEach(building => {
      if (building.owner === "human" && building.type === "headquarters") {
        humanBaseX = building.position.x;
        humanBaseY = building.position.y;
      }
    });
    
    // Create hero for the player near the human base
    const hero = new Hero(
      `hero_${client.sessionId}`,
      client.sessionId,
      humanBaseX + Math.floor(Math.random() * 5), // Random position within 5 tiles of base
      humanBaseY + Math.floor(Math.random() * 5),
      100
    );
    
    // Add some basic abilities to the hero
    hero.abilities.push({ name: "attack", cooldown: 10, currentCooldown: 0 });
    
    // Set the hero and add player to game state
    playerData.hero = hero;
    this.state.players.set(client.sessionId, playerData);
    
    // Send initial game state to the joining client
    const gameState = {
      playerId: client.sessionId,
      gameState: {
        map: this.state.map,
        mapDimensions: {
          width: this.state.map.length,
          height: this.state.map[0].length,
          zoomFactor: 1.0
        },
        players: this.state.players,
        buildings: this.state.buildings,
        units: this.state.units,
        serverStartTime: this.state.serverStartTime,
        gameTime: this.state.gameTime
      }
    };
    
    console.log('Sending initial game state:');
    console.log('- Map dimensions:', `${gameState.gameState.mapDimensions.width}x${gameState.gameState.mapDimensions.height}`);
    console.log('- Players:', this.state.players.size);
    console.log('- Buildings:', this.state.buildings.size);
    console.log('- Units:', this.state.units.size);
    
    // Send the game state to the client
    client.send("gameState", gameState);
    
    // Broadcast player join event
    this.broadcast("player_joined", { id: client.sessionId });
    
    console.log('=== Player Join Complete ===\n');
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