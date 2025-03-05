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
  const terrainTypes = ['grass', 'water', 'mountain', 'forest', 'sand'];
  const terrainWeights = [0.65, 0.15, 0.1, 0.08, 0.02]; // Adjusted probabilities for each terrain type
  
  // Generate a seed for consistent random generation
  let seed = Math.floor(Math.random() * 1000000);
  
  // Simple random number generator with seed
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // Create noise functions for terrain generation
  const createNoiseGenerator = (scale, amplitude, octaves) => {
    const offsets = Array(octaves).fill().map(() => ({
      x: seededRandom() * 1000,
      y: seededRandom() * 1000
    }));
    
    return (x, y) => {
      let value = 0;
      let totalAmplitude = 0;
      
      for (let i = 0; i < octaves; i++) {
        const currentScale = scale * Math.pow(2, i);
        const currentAmplitude = amplitude * Math.pow(0.5, i);
        
        const nx = (x / currentScale) + offsets[i].x;
        const ny = (y / currentScale) + offsets[i].y;
        
        // Simple value noise
        const sampleX = Math.floor(nx);
        const sampleY = Math.floor(ny);
        const fracX = nx - sampleX;
        const fracY = ny - sampleY;
        
        // Generate 4 corner values
        const hash1 = (sampleX * 12345 + sampleY * 54321) % 123456;
        const hash2 = ((sampleX + 1) * 12345 + sampleY * 54321) % 123456;
        const hash3 = (sampleX * 12345 + (sampleY + 1) * 54321) % 123456;
        const hash4 = ((sampleX + 1) * 12345 + (sampleY + 1) * 54321) % 123456;
        
        const val1 = (hash1 / 123456) * 2 - 1;
        const val2 = (hash2 / 123456) * 2 - 1;
        const val3 = (hash3 / 123456) * 2 - 1;
        const val4 = (hash4 / 123456) * 2 - 1;
        
        // Bilinear interpolation
        const v1 = val1 + fracX * (val2 - val1);
        const v2 = val3 + fracX * (val4 - val3);
        const noise = v1 + fracY * (v2 - v1);
        
        value += noise * currentAmplitude;
        totalAmplitude += currentAmplitude;
      }
      
      // Normalize to [0, 1]
      return (value / totalAmplitude + 1) / 2;
    };
  };
  
  const elevationNoise = createNoiseGenerator(10, 1.0, 3);
  const moistureNoise = createNoiseGenerator(15, 1.0, 2);
  const resourceNoise = createNoiseGenerator(8, 1.0, 2);
  
  // Generate initial random tiles in an isometric layout
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // Calculate isometric coordinates
      // In an isometric layout, the diamond shape comes from how we interpret the coordinates
      // The actual data structure remains a 2D grid
      
      // Get noise values for this position
      const elevation = Math.floor(elevationNoise(x, y) * 4); // 0-3 elevation
      const moisture = moistureNoise(x, y);
      const resourceValue = resourceNoise(x, y);
      
      // Determine terrain type based on elevation and moisture
      let terrainType;
      let passable = true;
      
      if (elevation === 0 && moisture > 0.7) {
        // Low elevation with high moisture = water
        terrainType = 'water';
        passable = false;
      } else if (elevation === 3 && moisture < 0.4) {
        // High elevation with low moisture = mountain
        terrainType = 'mountain';
        passable = false;
      } else if (elevation === 2 && moisture > 0.6) {
        // Medium-high elevation with high moisture = forest
        terrainType = 'forest';
        passable = true;
      } else if (elevation === 1 && moisture < 0.3) {
        // Low-medium elevation with low moisture = sand
        terrainType = 'sand';
        passable = true;
      } else {
        // Default is grass
        terrainType = 'grass';
        passable = true;
      }
      
      // Create the tile with the new data structure
      row.push({
        x: x,
        y: y,
        terrainType: terrainType,
        passable: passable,
        elevation: elevation,
        // Keep the old properties for backward compatibility
        type: terrainType,
        walkable: passable
      });
    }
    tiles.push(row);
  }
  
  // Apply some smoothing to make the map more natural
  const smoothedTiles = JSON.parse(JSON.stringify(tiles)); // Deep copy
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Count neighboring terrain types
      const neighbors = {};
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighborType = tiles[ny][nx].terrainType;
            neighbors[neighborType] = (neighbors[neighborType] || 0) + 1;
          }
        }
      }
      
      // Find most common neighbor type
      let mostCommonType = tiles[y][x].terrainType;
      let maxCount = 0;
      
      for (const type in neighbors) {
        if (neighbors[type] > maxCount) {
          maxCount = neighbors[type];
          mostCommonType = type;
        }
      }
      
      // 50% chance to change to most common neighbor type
      if (maxCount > 4 && seededRandom() < 0.5) {
        smoothedTiles[y][x].terrainType = mostCommonType;
        smoothedTiles[y][x].type = mostCommonType; // For backward compatibility
        
        // Update passable status based on terrain type
        smoothedTiles[y][x].passable = mostCommonType !== 'water' && mostCommonType !== 'mountain';
        smoothedTiles[y][x].walkable = smoothedTiles[y][x].passable; // For backward compatibility
        
        // Adjust elevation based on new terrain type
        if (mostCommonType === 'mountain') {
          smoothedTiles[y][x].elevation = 3;
        } else if (mostCommonType === 'forest') {
          smoothedTiles[y][x].elevation = 2;
        } else if (mostCommonType === 'water') {
          smoothedTiles[y][x].elevation = 0;
        }
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
  lastUpdateTime: Date.now(),
  serverStartTime: Date.now() // Add server start time
};

// Initialize the map with default dimensions
gameState.map = generateMap(gameState.mapDimensions.width, gameState.mapDimensions.height);

// Initialize the game with bases and AI unit
initializeGame();

// Function to initialize the game with bases and AI unit
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
    x: humanBaseX * 32,
    y: humanBaseY * 32,
    width: 5 * 32,
    height: 5 * 32,
    playerId: 'human-team',
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
    playerId: 'ai-team',
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
    x: aiBaseX * 32 - 64,
    y: aiBaseY * 32 + 80,
    width: 32,
    height: 32,
    playerId: 'ai-team',
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
  
  console.log('Game initialized with bases and AI unit');
}

// Function to make an area walkable (for base placement)
function makeAreaWalkable(centerX, centerY, width, height) {
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);
  
  for (let y = centerY - halfHeight; y <= centerY + halfHeight; y++) {
    for (let x = centerX - halfWidth; x <= centerX + halfWidth; x++) {
      if (y >= 0 && y < gameState.map.length && x >= 0 && x < gameState.map[0].length) {
        gameState.map[y][x].terrainType = 'grass';
        gameState.map[y][x].type = 'grass'; // For backward compatibility
        gameState.map[y][x].passable = true;
        gameState.map[y][x].walkable = true; // For backward compatibility
        gameState.map[y][x].elevation = 1;
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

// Function to create a unit for a player
function createPlayerUnit(playerId) {
    // Find the player's base
    const playerBase = Object.values(gameState.entities).find(entity => 
        entity.type === 'building' && 
        entity.buildingType === 'BASE' && 
        entity.playerId === playerId
    );

    if (!playerBase) {
        console.error(`Could not find base for player ${playerId}`);
        return null;
    }

    // Create unit adjacent to the player's base
    const offsetX = 64; // 2 tiles to the right
    const unitX = playerBase.x + playerBase.width + offsetX;
    const unitY = playerBase.y + (playerBase.height / 2);

    // Create the unit with a unique ID
    const unitId = uuidv4();
    const unit = {
        id: unitId,
        type: 'unit',
        unitType: 'SOLDIER',
        x: unitX,
        y: unitY,
        width: 32,
        height: 32,
        health: 100,
        maxHealth: 100,
        attackDamage: 10,
        attackRange: 50,
        attackCooldown: 1000,
        speed: 2,
        level: 1,
        experience: 0,
        isPlayerControlled: true,
        playerId: playerId,
        playerColor: 'blue',
        targetX: null,
        targetY: null,
        isMoving: false,
        lastUpdateTime: Date.now()
    };

    console.log(`Created new unit for player ${playerId} at position (${unitX}, ${unitY})`);
    return unit;
}

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

  // Filter entities to only include buildings for initial state
  const buildingEntities = {};
  Object.entries(gameState.entities).forEach(([id, entity]) => {
    if (entity.type === 'building') {
      buildingEntities[id] = entity;
    }
  });
  
  // Send initial game state to the new player (only map and buildings)
  socket.emit('gameState', {
    playerId: playerId,
    gameState: {
      players: gameState.players,
      entities: buildingEntities,
      map: gameState.map,
      mapDimensions: gameState.mapDimensions,
      lastUpdateTime: gameState.lastUpdateTime,
      serverStartTime: gameState.serverStartTime
    }
  });
  
  // Broadcast new player to all other players
  socket.broadcast.emit('playerJoined', {
    player: gameState.players[playerId]
  });

  // Handle join game request
  socket.on('joinGame', (data) => {
    const playerId = data.playerId;
    console.log(`Player ${playerId} joining game`);

    if (gameState.players[playerId]) {
      // Create the unit explicitly
      const newUnit = createPlayerUnit(playerId);
      if (!newUnit) {
        socket.emit('joinGameError', { message: "Could not create unit." });
        return;
      }

      // IMPORTANT: Add unit to game state explicitly
      gameState.entities[newUnit.id] = newUnit;
      console.log(`Added unit ${newUnit.id} to game state for player ${playerId}`);

      // Broadcast to ALL clients (including the one who joined)
      io.emit('unitCreated', { unit: newUnit });
      console.log(`Broadcasted unitCreated event for unit ${newUnit.id}`);

      // Confirm join to requesting client explicitly
      socket.emit('joinGameSuccess', { unit: newUnit });
      console.log(`Sent joinGameSuccess to player ${playerId}`);
    } else {
      console.error(`Player ${playerId} not found in gameState.players`);
      socket.emit('joinGameError', { message: "Player not found." });
    }
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
      
      // Remove player units, but NOT their base
      Object.keys(gameState.entities).forEach(entityId => {
        const entity = gameState.entities[entityId];
        if (entity.playerId === playerId && entity.buildingType !== 'BASE') {
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
    timestamp: currentTime,
    serverStartTime: gameState.serverStartTime // Include server start time
  });
}, UPDATE_INTERVAL);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Game client available at http://localhost:${PORT}`);
  console.log(`Initial map size: ${gameState.mapDimensions.width}x${gameState.mapDimensions.height} (zoom: ${gameState.mapDimensions.zoomFactor})`);
}); 