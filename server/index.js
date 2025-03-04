const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create Socket.IO server with CORS enabled
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/src', express.static(path.join(__dirname, '../src')));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Redirect from /public to root for backward compatibility
app.get('/public', (req, res) => {
  res.redirect('/');
});

app.get('/public/index.html', (req, res) => {
  res.redirect('/');
});

// Function to determine map size based on player count
function getMapDimensions(playerCount) {
  if (playerCount <= 5) {
    return { 
      width: 40, 
      height: 40,
      zoomFactor: 1.5 // Higher zoom factor for smaller maps
    };
  } else if (playerCount <= 15) {
    return { 
      width: 60, 
      height: 60,
      zoomFactor: 1.0 // Medium zoom factor
    };
  } else {
    return { 
      width: 80, 
      height: 80,
      zoomFactor: 0.75 // Lower zoom factor for larger maps
    };
  }
}

// Generate a random map
function generateMap(width, height) {
  console.log(`Generating map with dimensions ${width}x${height}`);
  
  const tiles = [];
  const tileTypes = ['grass', 'water', 'mountain', 'forest', 'sand'];
  const tileWeights = [0.6, 0.2, 0.1, 0.08, 0.02]; // Probabilities for each tile type
  
  // Generate a seed for consistent random generation
  let seed = Math.floor(Math.random() * 1000000);
  
  // Simple random number generator with seed
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // Generate initial random tiles
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // Determine tile type based on weights
      const rand = seededRandom();
      let tileType = 'grass'; // Default
      let cumulativeWeight = 0;
      
      for (let i = 0; i < tileTypes.length; i++) {
        cumulativeWeight += tileWeights[i];
        if (rand < cumulativeWeight) {
          tileType = tileTypes[i];
          break;
        }
      }
      
      row.push({
        x: x,
        y: y,
        type: tileType,
        walkable: tileType !== 'water' && tileType !== 'mountain'
      });
    }
    tiles.push(row);
  }
  
  // Apply some smoothing to make the map more natural
  const smoothedTiles = JSON.parse(JSON.stringify(tiles)); // Deep copy
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Count neighboring tile types
      const neighbors = {};
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighborType = tiles[ny][nx].type;
            neighbors[neighborType] = (neighbors[neighborType] || 0) + 1;
          }
        }
      }
      
      // Find most common neighbor type
      let mostCommonType = tiles[y][x].type;
      let maxCount = 0;
      
      for (const type in neighbors) {
        if (neighbors[type] > maxCount) {
          maxCount = neighbors[type];
          mostCommonType = type;
        }
      }
      
      // 50% chance to change to most common neighbor type
      if (maxCount > 4 && seededRandom() < 0.5) {
        smoothedTiles[y][x].type = mostCommonType;
        smoothedTiles[y][x].walkable = mostCommonType !== 'water' && mostCommonType !== 'mountain';
      }
    }
  }
  
  console.log('Map generation complete');
  return smoothedTiles;
}

// Game state
const gameState = {
  players: {},
  entities: {},
  map: null, // Will be initialized based on player count
  mapDimensions: { width: 40, height: 40, zoomFactor: 1.5 }, // Default starting dimensions with zoom
  lastUpdateTime: Date.now()
};

// Initialize the map with default dimensions
gameState.map = generateMap(gameState.mapDimensions.width, gameState.mapDimensions.height);

// Initialize the game with bases
initializeGame();

// Function to initialize the game with bases
function initializeGame() {
  console.log('Initializing game with bases');
  
  // Create human base in the bottom-left quadrant
  const humanBaseId = uuidv4();
  const humanBaseX = Math.floor(gameState.mapDimensions.width * 0.25);
  const humanBaseY = Math.floor(gameState.mapDimensions.height * 0.75);
  
  // Create AI base in the top-right quadrant
  const aiBaseId = uuidv4();
  const aiBaseX = Math.floor(gameState.mapDimensions.width * 0.75);
  const aiBaseY = Math.floor(gameState.mapDimensions.height * 0.25);
  
  // Make sure the base locations are walkable
  makeAreaWalkable(humanBaseX, humanBaseY, 5, 5);
  makeAreaWalkable(aiBaseX, aiBaseY, 5, 5);
  
  // Add human base to entities with persistent team identifier
  gameState.entities[humanBaseId] = {
    id: humanBaseId,
    type: 'building',
    buildingType: 'BASE',
    playerColor: 'blue',
    x: humanBaseX * 32, // Convert tile coordinates to pixel coordinates
    y: humanBaseY * 32,
    width: 5 * 32, // 5x5 tiles
    height: 5 * 32,
    playerId: 'human-team', // Persistent team identifier
    isPlayerControlled: true,
    health: 1000,
    maxHealth: 1000
  };
  
  // Add AI base to entities
  gameState.entities[aiBaseId] = {
    id: aiBaseId,
    type: 'building',
    buildingType: 'BASE',
    playerColor: 'red',
    x: aiBaseX * 32,
    y: aiBaseY * 32,
    width: 5 * 32,
    height: 5 * 32,
    playerId: 'ai-team', // Persistent team identifier
    isPlayerControlled: false,
    health: 1000,
    maxHealth: 1000
  };
  
  // Create an AI unit near the AI base
  const aiUnitId = uuidv4();
  gameState.entities[aiUnitId] = {
    id: aiUnitId,
    type: 'unit',
    unitType: 'SOLDIER',
    playerColor: 'red',
    x: aiBaseX * 32 - 64, // Position to the left of the base
    y: aiBaseY * 32 + 80, // Position near the middle of the base
    width: 32, // Config.UNIT_SIZE
    height: 32, // Config.UNIT_SIZE
    playerId: 'ai',
    isPlayerControlled: false,
    health: 100,
    maxHealth: 100,
    attackDamage: 10,
    attackRange: 50,
    attackCooldown: 1000,
    speed: 2,
    level: 1,
    experience: 0,
    targetX: null,
    targetY: null,
    isMoving: false,
    lastUpdateTime: Date.now()
  };
  
  console.log('Bases created:', {
    humanBase: { x: humanBaseX, y: humanBaseY },
    aiBase: { x: aiBaseX, y: aiBaseY }
  });
  console.log('AI unit created near AI base');
}

// Function to make an area walkable (for base placement)
function makeAreaWalkable(centerX, centerY, width, height) {
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);
  
  for (let y = centerY - halfHeight; y <= centerY + halfHeight; y++) {
    for (let x = centerX - halfWidth; x <= centerX + halfWidth; x++) {
      if (y >= 0 && y < gameState.map.length && x >= 0 && x < gameState.map[0].length) {
        gameState.map[y][x].type = 'grass';
        gameState.map[y][x].walkable = true;
      }
    }
  }
}

// Function to check if map needs to be resized based on player count
function checkAndResizeMap() {
  const playerCount = Object.values(gameState.players).filter(player => player.connected).length;
  const newDimensions = getMapDimensions(playerCount);
  
  // Check if dimensions have changed
  if (newDimensions.width !== gameState.mapDimensions.width || 
      newDimensions.height !== gameState.mapDimensions.height) {
    
    console.log(`Resizing map from ${gameState.mapDimensions.width}x${gameState.mapDimensions.height} (zoom: ${gameState.mapDimensions.zoomFactor}) to ${newDimensions.width}x${newDimensions.height} (zoom: ${newDimensions.zoomFactor}) based on ${playerCount} players`);
    
    // Save old entities
    const oldEntities = { ...gameState.entities };
    
    // Update map dimensions
    gameState.mapDimensions = newDimensions;
    
    // Generate new map
    gameState.map = generateMap(newDimensions.width, newDimensions.height);
    
    // Clear entities
    gameState.entities = {};
    
    // Re-initialize game with bases
    initializeGame();
    
    // Restore player units with adjusted positions
    Object.values(oldEntities).forEach(entity => {
      if (entity.type === 'unit' && entity.playerId !== 'ai') {
        // Calculate relative position in the old map
        const oldMapWidth = gameState.map[0].length * 32;
        const oldMapHeight = gameState.map.length * 32;
        const relativeX = entity.x / oldMapWidth;
        const relativeY = entity.y / oldMapHeight;
        
        // Calculate new position in the new map
        const newMapWidth = newDimensions.width * 32;
        const newMapHeight = newDimensions.height * 32;
        const newX = Math.floor(relativeX * newMapWidth);
        const newY = Math.floor(relativeY * newMapHeight);
        
        // Create a new entity with adjusted position
        const newEntityId = uuidv4();
        gameState.entities[newEntityId] = {
          ...entity,
          id: newEntityId,
          x: newX,
          y: newY,
          targetX: null,
          targetY: null,
          isMoving: false
        };
      }
    });
    
    // Broadcast the new map and entities to all players
    io.emit('mapResized', {
      mapDimensions: gameState.mapDimensions,
      map: gameState.map,
      entities: gameState.entities
    });
    
    return true;
  }
  
  return false;
}

// Player colors for assignment
const playerColors = ['red', 'blue', 'green', 'yellow'];
let nextPlayerColorIndex = 0;

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`New player connected: ${socket.id}`);
  
  // Generate a unique player ID
  const playerId = uuidv4();
  
  // Add player to game state
  gameState.players[playerId] = {
    id: playerId,
    socketId: socket.id,
    name: `Player ${Object.keys(gameState.players).length + 1}`,
    color: 'blue', // Always blue for human player
    connected: true,
    lastActivity: Date.now()
  };
  
  // Check if map needs to be resized based on new player count
  const mapResized = checkAndResizeMap();
  
  // If map wasn't resized, we need to find the human base
  if (!mapResized) {
    // Find the human base by its persistent team identifier
    let humanBase = null;
    Object.values(gameState.entities).forEach(entity => {
      if (entity.type === 'building' && entity.buildingType === 'BASE' && 
          (entity.playerId === 'human-team' || entity.playerColor === 'blue')) {
        // Assign this player to the base
        entity.playerId = playerId;
        humanBase = entity;
        console.log(`Assigned human base to player ${playerId}`);
      }
    });
  }
  
  // Send initial game state to the new player
  socket.emit('gameState', {
    playerId: playerId,
    gameState: {
      players: gameState.players,
      entities: gameState.entities,
      map: gameState.map,
      mapDimensions: gameState.mapDimensions, // Send map dimensions with zoom factor
      lastUpdateTime: gameState.lastUpdateTime
    }
  });
  
  // Broadcast new player to all other players
  socket.broadcast.emit('playerJoined', {
    player: gameState.players[playerId]
  });
  
  // Automatically spawn a starting unit for the player near the human base
  // First, find the human base location
  let humanBase = null;
  Object.values(gameState.entities).forEach(entity => {
    if (entity.type === 'building' && entity.buildingType === 'BASE' && 
        (entity.playerId === playerId || entity.playerColor === 'blue')) {
      humanBase = entity;
      console.log(`Found human base for unit spawning`);
    }
  });
  
  if (humanBase) {
    // Create a unit ID
    const unitId = uuidv4();
    
    // Calculate position near the human base
    // Position the unit to the right of the base with some offset
    const spawnX = humanBase.x + humanBase.width + 64; // 64 pixels to the right of the base
    const spawnY = humanBase.y + (humanBase.height / 2); // Middle height of the base
    
    // Get unit attributes
    const unitAttributes = {
      health: 100,
      attackDamage: 10,
      attackRange: 50,
      attackCooldown: 1000,
      speed: 2
    };
    
    // Create a new unit in the game state
    const newUnit = {
      id: unitId,
      type: 'unit',
      unitType: 'SOLDIER',
      playerColor: 'blue',
      x: spawnX,
      y: spawnY,
      width: 32, // Unit size
      height: 32, // Unit size
      playerId: playerId,
      isPlayerControlled: true,
      health: unitAttributes.health,
      maxHealth: unitAttributes.health,
      attackDamage: unitAttributes.attackDamage,
      attackRange: unitAttributes.attackRange,
      attackCooldown: unitAttributes.attackCooldown,
      speed: unitAttributes.speed,
      level: 1,
      experience: 0,
      targetX: null,
      targetY: null,
      isMoving: false,
      lastUpdateTime: Date.now()
    };
    
    // Add the unit to the game state
    gameState.entities[unitId] = newUnit;
    
    // Broadcast the new unit to all players
    io.emit('unitCreated', {
      unit: newUnit
    });
    
    console.log(`Automatically spawned starting unit for player ${playerId} near the human base at (${spawnX}, ${spawnY})`);
  } else {
    console.error(`Could not find human base for unit spawning`);
    
    // Fallback to a fixed position in the bottom-left quadrant if base not found
    const mapWidth = gameState.mapDimensions.width * 32;
    const mapHeight = gameState.mapDimensions.height * 32;
    const spawnX = Math.floor(mapWidth * 0.25);
    const spawnY = Math.floor(mapHeight * 0.75);
    
    // Create a unit ID
    const unitId = uuidv4();
    
    // Get unit attributes
    const unitAttributes = {
      health: 100,
      attackDamage: 10,
      attackRange: 50,
      attackCooldown: 1000,
      speed: 2
    };
    
    // Create a new unit in the game state
    const newUnit = {
      id: unitId,
      type: 'unit',
      unitType: 'SOLDIER',
      playerColor: 'blue',
      x: spawnX,
      y: spawnY,
      width: 32, // Unit size
      height: 32, // Unit size
      playerId: playerId,
      isPlayerControlled: true,
      health: unitAttributes.health,
      maxHealth: unitAttributes.health,
      attackDamage: unitAttributes.attackDamage,
      attackRange: unitAttributes.attackRange,
      attackCooldown: unitAttributes.attackCooldown,
      speed: unitAttributes.speed,
      level: 1,
      experience: 0,
      targetX: null,
      targetY: null,
      isMoving: false,
      lastUpdateTime: Date.now()
    };
    
    // Add the unit to the game state
    gameState.entities[unitId] = newUnit;
    
    // Broadcast the new unit to all players
    io.emit('unitCreated', {
      unit: newUnit
    });
    
    console.log(`Fallback: Spawned starting unit for player ${playerId} in bottom-left quadrant at (${spawnX}, ${spawnY})`);
  }
  
  // Handle player movement commands
  socket.on('moveUnits', (data) => {
    const { unitIds, targetX, targetY } = data;
    
    // Update unit targets in the game state
    unitIds.forEach(unitId => {
      if (gameState.entities[unitId]) {
        gameState.entities[unitId].targetX = targetX;
        gameState.entities[unitId].targetY = targetY;
        gameState.entities[unitId].isMoving = true;
        
        // Broadcast the movement to all players
        io.emit('unitsMoved', {
          unitIds: [unitId],
          targetX: targetX,
          targetY: targetY
        });
      }
    });
  });
  
  // Handle unit creation
  socket.on('createUnit', (data) => {
    const { x, y, isPlayerControlled, unitType = 'SOLDIER' } = data;
    const unitId = uuidv4();
    
    // Get player color
    const playerColor = gameState.players[playerId].color;
    
    // Get unit attributes from config
    const unitAttributes = {
      SOLDIER: {
        health: 100,
        attackDamage: 10,
        attackRange: 50,
        attackCooldown: 1000,
        speed: 2
      }
    }[unitType] || {
      health: 100,
      attackDamage: 10,
      attackRange: 50,
      attackCooldown: 1000,
      speed: 2
    };
    
    // Create a new unit in the game state
    gameState.entities[unitId] = {
      id: unitId,
      type: 'unit',
      unitType: unitType,
      playerColor: playerColor,
      x: x,
      y: y,
      width: 32, // Config.UNIT_SIZE
      height: 32, // Config.UNIT_SIZE
      playerId: playerId,
      isPlayerControlled: isPlayerControlled,
      health: unitAttributes.health,
      maxHealth: unitAttributes.health,
      attackDamage: unitAttributes.attackDamage,
      attackRange: unitAttributes.attackRange,
      attackCooldown: unitAttributes.attackCooldown,
      speed: unitAttributes.speed,
      level: 1,
      experience: 0,
      targetX: null,
      targetY: null,
      isMoving: false,
      lastUpdateTime: Date.now()
    };
    
    // Broadcast the new unit to all players
    io.emit('unitCreated', {
      unit: gameState.entities[unitId]
    });
  });
  
  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Find the player by socket ID
    const playerId = Object.keys(gameState.players).find(
      id => gameState.players[id].socketId === socket.id
    );
    
    if (playerId) {
      // Mark player as disconnected
      gameState.players[playerId].connected = false;
      gameState.players[playerId].lastActivity = Date.now();
      
      // Broadcast player disconnection to all other players
      socket.broadcast.emit('playerLeft', {
        playerId: playerId
      });
      
      // Remove player's units but keep bases (with team identifiers)
      Object.keys(gameState.entities).forEach(entityId => {
        const entity = gameState.entities[entityId];
        // Only remove entities that belong directly to the player
        // Skip entities with team-based identifiers (bases)
        if (entity.playerId === playerId && 
            entity.playerId !== 'human-team' && 
            entity.playerId !== 'ai-team') {
          delete gameState.entities[entityId];
          
          // Broadcast entity removal
          io.emit('entityRemoved', {
            entityId: entityId
          });
        }
      });
      
      // Check if map needs to be resized after player disconnection
      checkAndResizeMap();
    }
  });
});

// Game update loop (10 updates per second)
const UPDATE_INTERVAL = 100; // ms

setInterval(() => {
  const currentTime = Date.now();
  const deltaTime = currentTime - gameState.lastUpdateTime;
  gameState.lastUpdateTime = currentTime;
  
  // Update all moving entities
  Object.keys(gameState.entities).forEach(entityId => {
    const entity = gameState.entities[entityId];
    
    if (entity.isMoving && entity.targetX !== null && entity.targetY !== null) {
      // Calculate direction to target
      const centerX = entity.x + entity.width / 2;
      const centerY = entity.y + entity.height / 2;
      const dx = entity.targetX - centerX;
      const dy = entity.targetY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If we're close enough to the target, stop moving
      if (distance < 5) {
        entity.isMoving = false;
        entity.targetX = null;
        entity.targetY = null;
        return;
      }
      
      // Normalize direction and apply speed
      const moveSpeed = entity.speed * (deltaTime / 1000);
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      
      // Update position with boundary checking
      const newX = entity.x + normalizedDx * moveSpeed;
      const newY = entity.y + normalizedDy * moveSpeed;
      
      // Ensure the entity stays within map boundaries
      const mapWidth = gameState.mapDimensions.width * 32; // Map width in pixels
      const mapHeight = gameState.mapDimensions.height * 32; // Map height in pixels
      
      entity.x = Math.max(0, Math.min(newX, mapWidth - entity.width));
      entity.y = Math.max(0, Math.min(newY, mapHeight - entity.height));
    }
  });
  
  // Broadcast updated game state to all players
  io.emit('gameUpdate', {
    entities: gameState.entities,
    timestamp: currentTime
  });
}, UPDATE_INTERVAL);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Game client available at http://localhost:${PORT}`);
  console.log(`Initial map size: ${gameState.mapDimensions.width}x${gameState.mapDimensions.height} (zoom: ${gameState.mapDimensions.zoomFactor})`);
}); 