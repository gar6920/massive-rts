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
  map: generateMap(100, 100), // Generate a 100x100 map
  lastUpdateTime: Date.now()
};

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Create a new player
  const playerId = uuidv4();
  gameState.players[playerId] = {
    id: playerId,
    socketId: socket.id,
    name: `Player ${Object.keys(gameState.players).length + 1}`,
    connected: true,
    lastActivity: Date.now()
  };
  
  // Send initial game state to the new player
  socket.emit('gameState', {
    playerId: playerId,
    gameState: {
      players: gameState.players,
      entities: gameState.entities,
      map: gameState.map,
      lastUpdateTime: gameState.lastUpdateTime
    }
  });
  
  // Broadcast new player to all other players
  socket.broadcast.emit('playerJoined', {
    player: gameState.players[playerId]
  });
  
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
    const { x, y, isPlayerControlled } = data;
    const unitId = uuidv4();
    
    // Create a new unit in the game state
    gameState.entities[unitId] = {
      id: unitId,
      type: 'unit',
      x: x,
      y: y,
      width: 24, // Config.UNIT_SIZE
      height: 24, // Config.UNIT_SIZE
      playerId: playerId,
      isPlayerControlled: isPlayerControlled,
      health: 100,
      speed: 2, // Config.UNIT_SPEED
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
      
      // Remove player's units
      Object.keys(gameState.entities).forEach(entityId => {
        if (gameState.entities[entityId].playerId === playerId) {
          delete gameState.entities[entityId];
          
          // Broadcast entity removal
          io.emit('entityRemoved', {
            entityId: entityId
          });
        }
      });
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
        return;
      }
      
      // Normalize direction and apply speed
      const moveSpeed = entity.speed * (deltaTime / 1000);
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      
      // Update position
      entity.x += normalizedDx * moveSpeed;
      entity.y += normalizedDy * moveSpeed;
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
}); 