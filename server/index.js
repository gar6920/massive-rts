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

// Game state management
const gameState = {
  players: {},
  entities: {},
  map: null,
  mapDimensions: { width: 40, height: 40, zoomFactor: 1.5 },
  lastUpdateTime: Date.now(),
  serverStartTime: Date.now(),
  isRunning: false,
  gameEndTime: null,
  countdown: null,
  winner: null,
  playersForNextGame: []
};

// Function to start the game
function startGame() {
  console.log('Starting game...');
  
  // Reset game state
  gameState.players = {};
  gameState.entities = {};
  gameState.isRunning = true;
  gameState.serverStartTime = Date.now();
  gameState.lastUpdateTime = Date.now();
  gameState.mapDimensions = getMapDimensions(0); // Initialize with default dimensions
  gameState.gameEndTime = null;
  gameState.countdown = null;
  gameState.winner = null;
  gameState.playersForNextGame = [];
  
  // Generate initial map
  console.log('Generating initial map...');
  gameState.map = generateMap(gameState.mapDimensions.width, gameState.mapDimensions.height);
  
  // Initialize game with bases
  console.log('Initializing game with bases...');
  initializeGame();
  
  // Notify all connected clients
  console.log('Notifying clients of game start...');
  io.emit('serverStarted', {
    message: 'Game started',
    gameState: {
      players: gameState.players,
      entities: gameState.entities,
      map: gameState.map,
      mapDimensions: gameState.mapDimensions,
      lastUpdateTime: gameState.lastUpdateTime,
      serverStartTime: gameState.serverStartTime
    }
  });
  
  console.log('Game started successfully');
}

// Function to stop the game
function stopGame() {
  console.log('Stopping game...');
  
  // Notify all clients before clearing state
  io.emit('serverShutdown', { 
    message: 'Server is shutting down. Please wait for reconnection.' 
  });
  
  // Clear game state
  gameState.isRunning = false;
  gameState.players = {};
  gameState.entities = {};
  
  console.log('Game stopped successfully');
}

// Start game on server initialization
startGame();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal');
  stopGame();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal');
  stopGame();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Server startup event
server.on('listening', () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
  startGame(); // Ensure game is started when server is ready
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
      width: 100, 
      height: 100,
      zoomFactor: 1.5 // Higher zoom factor for smaller maps
    };
  } else if (playerCount <= 15) {
    return { 
      width: 200, 
      height: 200,
      zoomFactor: 1.0 // Medium zoom factor
    };
  } else {
    return { 
      width: 400, 
      height: 400,
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

// Function to initialize the game with bases and AI unit
function initializeGame() {
    console.log('Initializing game with shared human base');

    // Create shared human base in the bottom-left quadrant
    const humanBaseId = uuidv4();
    const humanBaseX = Math.floor(gameState.mapDimensions.width * 0.25);
    const humanBaseY = Math.floor(gameState.mapDimensions.height * 0.75);

    // Define the human base, shared by all players
    gameState.entities[humanBaseId] = {
        id: humanBaseId,
        type: 'building',
        buildingType: 'BASE',
        playerColor: 'blue',
        x: humanBaseX * 32,
        y: humanBaseY * 32,
        width: 5 * 32,
        height: 5 * 32,
        playerId: 'human-team',  // Shared team ID, not tied to a single player
        isPlayerControlled: true,
        health: 1000,
        maxHealth: 1000
    };

    console.log('Initialized shared human base for team "human-team"');

    // Create AI base in the top-right quadrant
    const aiBaseId = uuidv4();
    const aiBaseX = Math.floor(gameState.mapDimensions.width * 0.75);
    const aiBaseY = Math.floor(gameState.mapDimensions.height * 0.25);

    // Make sure the base locations are walkable
    makeAreaWalkable(humanBaseX, humanBaseY, 5, 5);
    makeAreaWalkable(aiBaseX, aiBaseY, 5, 5);

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
        speed: 20,
        level: 1,
        experience: 0,
        targetX: null,
        targetY: null,
        isMoving: false,
        lastUpdateTime: Date.now()
    };

    console.log('Game initialized with shared human base and AI entities');
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
    console.log(`=== Creating Player Unit ===`);
    
    // Find the shared human base
    const humanBase = Object.values(gameState.entities).find(entity => 
        entity.type === 'building' && 
        entity.buildingType === 'BASE' && 
        entity.playerId === 'human-team'
    );

    if (!humanBase) {
        console.error('Failed to create unit: Shared human base not found!');
        console.log('Current entities:', Object.keys(gameState.entities));
        return null;
    }
    
    console.log(`Found shared base at position: (${humanBase.x}, ${humanBase.y})`);
    
    // Position the new unit near the base
    const unitX = humanBase.x + humanBase.width + 64;
    const unitY = humanBase.y + (humanBase.height / 2);
    
    console.log(`Positioning new unit at: (${unitX}, ${unitY})`);
    
    // Create the unit with the player's unique ID
    const unitId = uuidv4();
    const unit = {
        id: unitId,
        type: 'unit',
        unitType: 'SOLDIER',
        playerId: playerId,
        teamId: 'human-team',
        x: unitX,
        y: unitY,
        width: 32,
        height: 32,
        speed: 150,
        targetX: null,
        targetY: null,
        isMoving: false,
        health: 100,
        maxHealth: 100,
        attackRange: 60,
        attackDamage: 10,
        attackCooldown: 1000,
        lastAttackTime: null,
        targetEntityId: null,
        isAttacking: false
    };
    
    console.log(`Created unit ${unitId} for player ${playerId}`);
    return unit;
}

// AI Unit Control Functions
function findClosestEnemyBase(aiUnit, entities) {
    let closestDistance = Infinity;
    let closestBase = null;

    for (const entityId in entities) {
        const entity = entities[entityId];
        if (entity.type === 'building' && entity.buildingType === 'BASE' && entity.playerId === 'human-team') {
            const dx = entity.x - aiUnit.x;
            const dy = entity.y - aiUnit.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestBase = entity;
            }
        }
    }
    return closestBase;
}

function updateAIUnits(deltaTime) {
    for (const entityId in gameState.entities) {
        const aiUnit = gameState.entities[entityId];
        
        // Only process AI units (non-player-controlled units)
        if (aiUnit.type === 'unit' && aiUnit.playerId === 'ai-team') {
            // Find target if none exists or current target is destroyed
            if (!aiUnit.targetEntityId || !gameState.entities[aiUnit.targetEntityId]) {
                const closestBase = findClosestEnemyBase(aiUnit, gameState.entities);
                if (closestBase) {
                    aiUnit.targetEntityId = closestBase.id;
                    console.log(`AI Unit ${aiUnit.id} targeting base ${closestBase.id}`);
                }
            }

            const targetEntity = gameState.entities[aiUnit.targetEntityId];
            if (targetEntity) {
                const dx = targetEntity.x - aiUnit.x;
                const dy = targetEntity.y - aiUnit.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > aiUnit.attackRange) {
                    // Move towards target
                    const normalizedDx = dx / distance;
                    const normalizedDy = dy / distance;
                    aiUnit.x += normalizedDx * aiUnit.speed * (deltaTime / 1000);
                    aiUnit.y += normalizedDy * aiUnit.speed * (deltaTime / 1000);
                    aiUnit.isMoving = true;
                    
                    // Broadcast position update
                    io.emit('updateUnitPosition', {
                        unitId: aiUnit.id,
                        x: aiUnit.x,
                        y: aiUnit.y,
                        isMoving: true
                    });
                } else {
                    // Within attack range
                    aiUnit.isMoving = false;
                    if (!aiUnit.lastAttackTime || Date.now() - aiUnit.lastAttackTime >= aiUnit.attackCooldown) {
                        // Attack the target
                        targetEntity.health -= aiUnit.attackDamage;
                        
                        // Clamp health to zero if negative
                        if (targetEntity.health < 0) {
                            targetEntity.health = 0;
                        }
                        
                        aiUnit.lastAttackTime = Date.now();
                        
                        // Broadcast attack
                        io.emit('unitAttack', {
                            attackerId: aiUnit.id,
                            targetId: targetEntity.id,
                            damage: aiUnit.attackDamage,
                            targetHealth: targetEntity.health
                        });
                        
                        // Check if target is destroyed
                        if (targetEntity.health <= 0) {
                            // Check if this is a base building
                            if (targetEntity.type === 'building' && targetEntity.buildingType === 'BASE') {
                                // Trigger end game logic
                                if (!gameState.gameEndTime) {
                                    const winner = targetEntity.playerId === 'human-team' ? 'ai-team' : 'human-team';
                                    
                                    console.log(`Base of team ${targetEntity.playerId} has been destroyed. ${winner} wins!`);
                                    
                                    // Set the game end state
                                    gameState.gameEndTime = Date.now();
                                    gameState.winner = winner;
                                    
                                    // Start the countdown (30 seconds)
                                    gameState.countdown = 30;
                                    
                                    // Notify all clients that the game has ended
                                    io.emit('gameEnded', { 
                                        winner: winner,
                                        message: winner === 'human-team' ? 'The enemy base has fallen!' : 'Your base was destroyed!',
                                        countdown: gameState.countdown
                                    });
                                    
                                    // Start the countdown timer
                                    startEndGameCountdown();
                                }
                            } else {
                                // For non-base entities, destroy them
                                delete gameState.entities[targetEntity.id];
                                aiUnit.targetEntityId = null;
                                io.emit('entityDestroyed', { entityId: targetEntity.id });
                            }
                        }
                    }
                }
            }
        }
    }
}

// Game update loop
let lastUpdateTime = Date.now();
setInterval(() => {
    if (gameState.isRunning) {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastUpdateTime;
        lastUpdateTime = currentTime;
        
        // Check for base destruction if game is still active
        if (!gameState.gameEndTime) {
            // Check if any bases have been destroyed
            checkBaseDestruction();
            
            // Update buildings (production, etc.)
            updateBuildings(deltaTime);
            
            // Only update units if the game hasn't ended
            updateAIUnits(deltaTime);
            updatePlayerUnits(deltaTime);
        } else if (gameState.countdown) {
            // Handle countdown if game has ended
            updateEndGameCountdown();
        }
    }
}, 50);

// Function to update player-controlled units
function updatePlayerUnits(deltaTime) {
    for (const entityId in gameState.entities) {
        const unit = gameState.entities[entityId];
        
        // Only process player-controlled units that are moving or attacking
        if (unit.type === 'unit' && unit.playerId !== 'ai-team') {
            // Handle attacking logic
            if (unit.isAttacking && unit.targetEntityId) {
                const targetEntity = gameState.entities[unit.targetEntityId];
                
                // If target no longer exists, clear attack state
                if (!targetEntity) {
                    unit.targetEntityId = null;
                    unit.isAttacking = false;
                    unit.isMoving = false;
                    continue;
                }
                
                // Always update target position for attacking units to ensure they follow moving targets
                unit.targetX = targetEntity.x;
                unit.targetY = targetEntity.y;
                
                // Calculate distance to target
                const dx = targetEntity.x - unit.x;
                const dy = targetEntity.y - unit.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate attack range - use default if not set
                const attackRange = unit.attackRange || 50;
                
                // If within attack range, stop and attack
                if (distance <= attackRange) {
                    unit.isMoving = false;
                    
                    // Process attack
                    const now = Date.now();
                    const attackCooldown = unit.attackCooldown || 1000; // Default 1 second cooldown
                    
                    if (!unit.lastAttackTime || now - unit.lastAttackTime >= attackCooldown) {
                        // Apply damage to target
                        const damage = unit.attackDamage || 10; // Default damage
                        targetEntity.health -= damage;
                        
                        // Clamp health to zero if negative
                        if (targetEntity.health < 0) {
                            targetEntity.health = 0;
                        }
                        
                        unit.lastAttackTime = now;
                        
                        // Broadcast attack
                        io.emit('unitAttack', {
                            attackerId: unit.id,
                            targetId: unit.targetEntityId,
                            damage: damage,
                            targetHealth: targetEntity.health
                        });
                        
                        // Check if target is destroyed
                        if (targetEntity.health <= 0) {
                            // Check if this is a base building
                            if (targetEntity.type === 'building' && targetEntity.buildingType === 'BASE') {
                                // Trigger end game logic
                                if (!gameState.gameEndTime) {
                                    const winner = targetEntity.playerId === 'human-team' ? 'ai-team' : 'human-team';
                                    
                                    console.log(`Base of team ${targetEntity.playerId} has been destroyed. ${winner} wins!`);
                                    
                                    // Set the game end state
                                    gameState.gameEndTime = Date.now();
                                    gameState.winner = winner;
                                    
                                    // Start the countdown (30 seconds)
                                    gameState.countdown = 30;
                                    
                                    // Notify all clients that the game has ended
                                    io.emit('gameEnded', { 
                                        winner: winner,
                                        message: winner === 'human-team' ? 'The enemy base has fallen!' : 'Your base was destroyed!',
                                        countdown: gameState.countdown
                                    });
                                    
                                    // Start the countdown timer
                                    startEndGameCountdown();
                                }
                            } else {
                                // For non-base entities, destroy them
                                io.emit('entityDestroyed', {
                                    entityId: targetEntity.id
                                });
                                
                                // Remove entity from game state
                                delete gameState.entities[targetEntity.id];
                            }
                            
                            // Clear attack target
                            unit.targetEntityId = null;
                            unit.isAttacking = false;
                            unit.isMoving = false;
                        }
                    }
                } else {
                    // If not in range, keep moving toward the target
                    unit.isMoving = true;
                }
            }
            
            // Handle movement for units that are moving
            if (unit.isMoving) {
                if (unit.targetX !== null && unit.targetY !== null) {
                    const dx = unit.targetX - unit.x;
                    const dy = unit.targetY - unit.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 1) {
                        // Move towards target
                        const normalizedDx = dx / distance;
                        const normalizedDy = dy / distance;
                        unit.x += normalizedDx * unit.speed * (deltaTime / 1000);
                        unit.y += normalizedDy * unit.speed * (deltaTime / 1000);
                        
                        // Broadcast position update
                        io.emit('updateUnitPosition', {
                            unitId: unit.id,
                            x: unit.x,
                            y: unit.y,
                            isMoving: true
                        });
                    } else if (!unit.isAttacking) {
                        // Reached target without attacking
                        unit.x = unit.targetX;
                        unit.y = unit.targetY;
                        unit.isMoving = false;
                        unit.targetX = null;
                        unit.targetY = null;
                        
                        // Broadcast final position
                        io.emit('updateUnitPosition', {
                            unitId: unit.id,
                            x: unit.x,
                            y: unit.y,
                            isMoving: false
                        });
                    }
                }
            }
        }
    }
}

// Function to check if any bases have been destroyed
function checkBaseDestruction() {
    // Find all bases
    const bases = Object.values(gameState.entities).filter(
        entity => entity.type === 'building' && entity.buildingType === 'BASE'
    );
    
    // Check each base
    for (const base of bases) {
        if (base.health <= 0) {
            // Determine the winner
            const winner = base.playerId === 'human-team' ? 'ai-team' : 'human-team';
            
            console.log(`Base of team ${base.playerId} has been destroyed. ${winner} wins!`);
            
            // Set the game end state
            gameState.gameEndTime = Date.now();
            gameState.winner = winner;
            
            // Start the countdown (30 seconds)
            gameState.countdown = 30;
            
            // Notify all clients that the game has ended
            io.emit('gameEnded', { 
                winner: winner,
                message: winner === 'human-team' ? 'The enemy base has fallen!' : 'Your base was destroyed!',
                countdown: gameState.countdown
            });
            
            // Start the countdown timer
            startEndGameCountdown();
            
            // Only need to handle one base destruction
            break;
        }
    }
}

// Function to start the end game countdown
function startEndGameCountdown() {
    // Send countdown updates every second
    const countdownInterval = setInterval(() => {
        // Decrement countdown
        gameState.countdown--;
        
        // Send countdown update to all clients
        io.emit('countdownUpdate', { 
            secondsRemaining: gameState.countdown 
        });
        
        // When countdown reaches 0, reset and start a new game
        if (gameState.countdown <= 0) {
            clearInterval(countdownInterval);
            
            // Prompt players to join next game
            io.emit('prepareNextGame', {});
            
            // After 5 more seconds, start the next game
            setTimeout(() => {
                startGame();
            }, 5000);
        }
    }, 1000);
}

// Function to update the end game countdown
function updateEndGameCountdown() {
    // This is handled by the startEndGameCountdown interval
    // Function is kept for clarity in the game update loop
}

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`New player connected: ${socket.id}`);
  
  const playerId = uuidv4();
  
  // Assign the player to the human team
  gameState.players[playerId] = {
    id: playerId,
    socketId: socket.id,
    name: `Player ${Object.keys(gameState.players).length + 1}`,
    teamId: 'human-team',  // Links player to the shared base
    color: 'blue',
    connected: true,
    lastActivity: Date.now()
  };

  console.log(`Player ${playerId} joined team "human-team"`);
  
  // Send current game state to the connecting client
  socket.emit('gameState', {
    status: gameState.isRunning ? 'active' : 'ended',
    playerId: playerId,
    gameState: gameState.isRunning ? {
      players: gameState.players,
      entities: gameState.entities,
      map: gameState.map,
      mapDimensions: gameState.mapDimensions,
      lastUpdateTime: gameState.lastUpdateTime,
      serverStartTime: gameState.serverStartTime
    } : null
  });

  // Handle rejoin attempts
  socket.on('rejoinGame', (data) => {
    const { oldPlayerId } = data;
    let rejoinPlayerId = playerId;
    
    if (oldPlayerId && gameState.players[oldPlayerId] && !gameState.players[oldPlayerId].connected) {
      // Reclaim old player ID if available
      rejoinPlayerId = oldPlayerId;
      gameState.players[rejoinPlayerId].socketId = socket.id;
      gameState.players[rejoinPlayerId].connected = true;
      console.log(`Player ${rejoinPlayerId} rejoined team "human-team"`);
    } else {
      // Create new player entry
      gameState.players[rejoinPlayerId] = {
        id: rejoinPlayerId,
        socketId: socket.id,
        name: `Player ${Object.keys(gameState.players).length + 1}`,
        teamId: 'human-team',  // Links player to the shared base
        color: 'blue',
        connected: true,
        lastActivity: Date.now()
      };
      console.log(`New player ${rejoinPlayerId} joined team "human-team"`);
    }
    
    // Send current game state
    socket.emit('gameState', {
      status: 'active',
      playerId: rejoinPlayerId,
      gameState: {
        players: gameState.players,
        entities: gameState.entities,
        map: gameState.map,
        mapDimensions: gameState.mapDimensions,
        lastUpdateTime: gameState.lastUpdateTime,
        serverStartTime: gameState.serverStartTime
      }
    });
    
    // Notify other players
    socket.broadcast.emit('playerJoined', {
      player: gameState.players[rejoinPlayerId]
    });
  });
  
  // Handle join game request
  socket.on('joinGame', (data) => {
    // Check if game is running
    if (!gameState.isRunning) {
      console.log('Join game rejected: Game not running');
      socket.emit('joinGameError', { message: 'Game has ended' });
      return;
    }
    
    const playerId = data.playerId;
    console.log(`\n=== Join Game Request ===`);
    console.log(`Player ${playerId} requesting to join game`);
    console.log(`Current players:`, Object.keys(gameState.players));

    if (!gameState.players[playerId]) {
      console.error(`Join game error: Player ${playerId} not found in gameState.players`);
      socket.emit('joinGameError', { message: "Player not found." });
      return;
    }

    // Log the state before creating unit
    console.log(`Creating unit for player ${playerId}`);
    console.log(`Player team: ${gameState.players[playerId].teamId}`);

    // Create the unit explicitly
    const newUnit = createPlayerUnit(playerId);
    if (!newUnit) {
      console.error(`Failed to create unit for player ${playerId}`);
      socket.emit('joinGameError', { message: "Could not create unit." });
      return;
    }

    // Log the new unit details
    console.log(`Successfully created unit:`, {
      unitId: newUnit.id,
      playerId: newUnit.playerId,
      position: { x: newUnit.x, y: newUnit.y }
    });

    // Add unit to game state explicitly
    gameState.entities[newUnit.id] = newUnit;
    console.log(`Added unit ${newUnit.id} to game state`);
    console.log(`Total entities in game:`, Object.keys(gameState.entities).length);

    // Broadcast to ALL clients (including the one who joined)
    io.emit('unitCreated', { unit: newUnit });
    console.log(`Broadcasted unitCreated event for unit ${newUnit.id}`);

    // Confirm join to requesting client explicitly
    socket.emit('joinGameSuccess', { unit: newUnit });
    console.log(`Sent joinGameSuccess to player ${playerId}`);
    console.log(`=== Join Game Complete ===\n`);
  });
  
  // Handle unit movement
  socket.on('moveUnits', (data) => {
    // Check if game is running
    if (!gameState.isRunning) {
      socket.emit('moveUnitsError', { message: 'Game has ended' });
      return;
    }
    
    console.log(`Received moveUnits command: units ${data.unitIds.join(", ")} to target (${data.targetX}, ${data.targetY})`);
    
    // Validate the data
    if (!data.unitIds || !Array.isArray(data.unitIds) || data.targetX === undefined || data.targetY === undefined) {
      console.error('Invalid moveUnits data received');
      return;
    }

    // Find the player ID associated with this socket
    const playerId = Object.keys(gameState.players).find(
      id => gameState.players[id].socketId === socket.id
    );

    if (!playerId) {
      console.error('Player not found for socket', socket.id);
      return;
    }

    // Validate and update each unit
    data.unitIds.forEach(unitId => {
      const unit = gameState.entities[unitId];
      if (!unit) {
        console.error(`Unit ${unitId} not found`);
        return;
      }

      // Verify the unit belongs to the player and is not an AI unit
      if (unit.playerId !== playerId || unit.playerId === 'ai-team') {
        console.error(`Unit ${unitId} does not belong to player ${playerId} or is an AI unit`);
        return;
      }

      // Clear any previous attack target
      unit.targetEntityId = null;
      unit.isAttacking = false;

      // Update unit's target position and movement state
      unit.targetX = data.targetX;
      unit.targetY = data.targetY;
      unit.isMoving = true;
      console.log(`Updated unit ${unitId} target to (${data.targetX}, ${data.targetY})`);
    });

    // Broadcast the movement to all clients
    io.emit('unitsMoved', {
      unitIds: data.unitIds,
      targetX: data.targetX,
      targetY: data.targetY
    });
  });
  
  // Handle unit attack commands
  socket.on('attackTarget', (data) => {
    // Check if game is running
    if (!gameState.isRunning) {
      socket.emit('attackTargetError', { message: 'Game has ended' });
      return;
    }
    
    console.log(`Received attackTarget command: units ${data.unitIds.join(", ")} attacking entity ${data.targetEntityId}`);
    
    // Validate the data
    if (!data.unitIds || !Array.isArray(data.unitIds) || !data.targetEntityId) {
      console.error('Invalid attackTarget data received');
      return;
    }

    // Find the player ID associated with this socket
    const playerId = Object.keys(gameState.players).find(
      id => gameState.players[id].socketId === socket.id
    );

    if (!playerId) {
      console.error('Player not found for socket', socket.id);
      return;
    }
    
    // Check if target entity exists
    const targetEntity = gameState.entities[data.targetEntityId];
    if (!targetEntity) {
      console.error(`Target entity ${data.targetEntityId} not found`);
      return;
    }
    
    // Validate and update each attacking unit
    data.unitIds.forEach(unitId => {
      const unit = gameState.entities[unitId];
      if (!unit) {
        console.error(`Unit ${unitId} not found`);
        return;
      }

      // Verify the unit belongs to the player and is not an AI unit
      if (unit.playerId !== playerId || unit.playerId === 'ai-team') {
        console.error(`Unit ${unitId} does not belong to player ${playerId} or is an AI unit`);
        return;
      }

      // Set attack target
      unit.targetEntityId = data.targetEntityId;
      unit.isAttacking = true;
      
      // Set movement target to target entity's position
      unit.targetX = targetEntity.x;
      unit.targetY = targetEntity.y;
      unit.isMoving = true;
      
      console.log(`Unit ${unitId} attacking entity ${data.targetEntityId} at (${targetEntity.x}, ${targetEntity.y})`);
    });

    // Broadcast the attack command to all clients
    io.emit('unitsAttacking', {
      unitIds: data.unitIds,
      targetEntityId: data.targetEntityId
    });
  });
  
  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Find the player by socket ID
    const playerId = Object.keys(gameState.players).find(
      id => gameState.players[id].socketId === socket.id
    );
    
    if (playerId && gameState.isRunning) {
      // Mark player as disconnected but keep their data for potential rejoin
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

  // Handle player opting in for the next game
  socket.on('joinNextGame', (data) => {
    const playerId = data.playerId;
    
    if (playerId && gameState.players[playerId]) {
      console.log(`Player ${playerId} opts in for the next game`);
      
      // Add player to the list for next game if not already there
      if (!gameState.playersForNextGame.includes(playerId)) {
        gameState.playersForNextGame.push(playerId);
      }
      
      // Confirm to the player
      socket.emit('joinNextGameConfirmed', {});
    }
  });
  
  // Handle unit production queue request
  socket.on('queueUnit', (data) => {
    // Check if game is running
    if (!gameState.isRunning) {
      socket.emit('queueUnitError', { message: 'Game has ended' });
      return;
    }
    
    console.log(`Received queueUnit request: building ${data.buildingId}, unit type ${data.unitType}`);
    
    // Validate the data
    if (!data.buildingId || !data.unitType) {
      console.error('Invalid queueUnit data received');
      return;
    }
    
    // Find the player ID associated with this socket
    const playerId = Object.keys(gameState.players).find(
      id => gameState.players[id].socketId === socket.id
    );
    
    if (!playerId) {
      console.error('Player not found for socket', socket.id);
      return;
    }
    
    // Get the building
    const building = gameState.entities[data.buildingId];
    if (!building) {
      console.error(`Building ${data.buildingId} not found`);
      return;
    }
    
    // Verify the building belongs to the player's team
    if (building.playerId !== playerId && building.playerId !== 'human-team') {
      console.error(`Building ${data.buildingId} does not belong to player ${playerId} or human team`);
      return;
    }
    
    // Initialize production queue if it doesn't exist
    if (!building.productionQueue) {
      building.productionQueue = [];
    }
    
    // Add unit to production queue
    building.productionQueue.push(data.unitType);
    console.log(`Added ${data.unitType} to production queue for building ${data.buildingId}`);
    
    // Set production rate if not already set
    if (!building.productionRate) {
      building.productionRate = 0.1; // Default production rate
    }
    
    // Confirm to the player
    socket.emit('queueUnitConfirmed', {
      buildingId: data.buildingId,
      unitType: data.unitType,
      queueLength: building.productionQueue.length
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Game client available at http://localhost:${PORT}`);
  console.log(`Initial map size: ${gameState.mapDimensions.width}x${gameState.mapDimensions.height} (zoom: ${gameState.mapDimensions.zoomFactor})`);
});

// Function to update buildings (production, etc.)
function updateBuildings(deltaTime) {
  // Process each building
  Object.values(gameState.entities)
    .filter(entity => entity.type === 'building')
    .forEach(building => {
      // Skip buildings that don't produce units or have empty queues
      if (!building.productionRate || !building.productionQueue || building.productionQueue.length === 0) {
        return;
      }
      
      // Update production progress
      building.productionProgress = (building.productionProgress || 0) + (building.productionRate * deltaTime) / 1000;
      
      // Check if production is complete
      if (building.productionProgress >= 1) {
        // Get the unit type from the queue
        const unitType = building.productionQueue.shift();
        
        // Reset production progress
        building.productionProgress = 0;
        
        // Create the unit
        const unitId = uuidv4();
        
        // Calculate spawn position (near the building)
        const spawnX = building.x + building.width + 10;
        const spawnY = building.y + building.height / 2;
        
        // Get unit attributes based on type
        const unitAttributes = {
          SOLDIER: {
            health: 100,
            maxHealth: 100,
            attackDamage: 10,
            attackRange: 50,
            attackCooldown: 1000,
            speed: 20
          },
          TANK: {
            health: 200,
            maxHealth: 200,
            attackDamage: 20,
            attackRange: 60,
            attackCooldown: 1500,
            speed: 15
          },
          SCOUT: {
            health: 80,
            maxHealth: 80,
            attackDamage: 5,
            attackRange: 40,
            attackCooldown: 800,
            speed: 30
          }
        }[unitType] || {
          health: 100,
          maxHealth: 100,
          attackDamage: 10,
          attackRange: 50,
          attackCooldown: 1000,
          speed: 20
        };
        
        // Create the unit entity
        const newUnit = {
          id: unitId,
          type: 'unit',
          unitType: unitType,
          playerColor: building.playerColor,
          x: spawnX,
          y: spawnY,
          width: 32,
          height: 32,
          playerId: building.playerId,
          isPlayerControlled: building.playerId !== 'ai-team',
          health: unitAttributes.health,
          maxHealth: unitAttributes.maxHealth,
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
        
        console.log(`Building ${building.id} produced a ${unitType} unit (${unitId})`);
        
        // Broadcast the unit creation to all clients
        io.emit('unitCreated', { unit: newUnit });
      }
    });
} 