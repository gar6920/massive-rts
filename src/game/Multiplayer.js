/**
 * Multiplayer class for handling client-side networking
 */
class Multiplayer {
    /**
     * Initialize the multiplayer system
     * @param {Game} game - Reference to the main game instance
     */
    constructor(game) {
        this.game = game;
        this.socket = null;
        this.playerId = null;
        this.connected = false;
        this.serverEntities = {}; // Entities from the server
        this.pendingCommands = []; // Commands waiting to be sent
        this.lastServerUpdate = 0;
        
        // Bind methods
        this.onConnect = this.onConnect.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.onGameState = this.onGameState.bind(this);
        this.onGameUpdate = this.onGameUpdate.bind(this);
        this.onPlayerJoined = this.onPlayerJoined.bind(this);
        this.onPlayerLeft = this.onPlayerLeft.bind(this);
        this.onUnitCreated = this.onUnitCreated.bind(this);
        this.onUnitsMoved = this.onUnitsMoved.bind(this);
        this.onEntityRemoved = this.onEntityRemoved.bind(this);
        this.onMapResized = this.onMapResized.bind(this);
    }
    
    /**
     * Connect to the game server
     */
    connect() {
        // Connect to the server on the same host and port
        // Since we're serving the client from the same server
        const serverUrl = window.location.origin;
        
        console.log(`Connecting to game server at ${serverUrl}`);
        
        // Create socket connection
        this.socket = io(serverUrl);
        
        // Set up event handlers
        this.socket.on('connect', this.onConnect);
        this.socket.on('disconnect', this.onDisconnect);
        this.socket.on('gameState', this.onGameState);
        this.socket.on('gameUpdate', this.onGameUpdate);
        this.socket.on('playerJoined', this.onPlayerJoined);
        this.socket.on('playerLeft', this.onPlayerLeft);
        this.socket.on('unitCreated', this.onUnitCreated);
        this.socket.on('unitsMoved', this.onUnitsMoved);
        this.socket.on('entityRemoved', this.onEntityRemoved);
        this.socket.on('mapResized', this.onMapResized);
    }
    
    /**
     * Disconnect from the game server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.connected = false;
    }
    
    /**
     * Handle connection to the server
     */
    onConnect() {
        console.log('Connected to game server');
        this.connected = true;
        
        // Process any pending commands
        this.processPendingCommands();
    }
    
    /**
     * Handle disconnection from the server
     */
    onDisconnect() {
        console.log('Disconnected from game server');
        this.connected = false;
    }
    
    /**
     * Handle initial game state from server
     */
    onGameState(data) {
        console.log('Received initial game state from server');
        this.playerId = data.playerId;
        this.game.playerId = data.playerId;
        
        // Update map dimensions from server data
        if (data.gameState && data.gameState.mapDimensions) {
            console.log('Setting map dimensions from server data:', data.gameState.mapDimensions);
            this.updateMapDimensions(data.gameState.mapDimensions);
        }
        
        // Set the map from server data
        if (data.gameState && data.gameState.map) {
            console.log('Setting map from server data');
            this.game.map.setMapFromServer(data.gameState.map);
        } else {
            console.error('No map data received from server');
        }
        
        // Process entities from server data
        if (data.gameState && data.gameState.entities) {
            console.log('Processing entities from server data');
            this.game.processServerEntities(data.gameState.entities);
            
            // Create initial unit after entities are processed
            console.log('Creating initial unit for player');
            this.createInitialUnit();
        }
    }
    
    /**
     * Handle map resize event from server
     */
    onMapResized(data) {
        console.log('Received map resize event from server:', data.mapDimensions);
        
        // Update map dimensions
        this.updateMapDimensions(data.mapDimensions);
        
        // Update the map tiles
        if (data.map) {
            this.game.map.setMapFromServer(data.map);
        }
        
        // Update entities
        if (data.entities) {
            this.game.processServerEntities(data.entities);
        }
        
        // Reset camera position to ensure it's within bounds
        this.game.camera.updateDimensions();
        this.game.camera.clampPosition();
    }
    
    /**
     * Update map dimensions based on server data
     */
    updateMapDimensions(mapDimensions) {
        if (!mapDimensions) return;
        
        // Update Config with new map dimensions
        Config.MAP_WIDTH = mapDimensions.width;
        Config.MAP_HEIGHT = mapDimensions.height;
        
        // Apply zoom factor if provided
        if (mapDimensions.zoomFactor) {
            this.game.camera.zoom = mapDimensions.zoomFactor;
        }
        
        console.log(`Updated map dimensions to ${Config.MAP_WIDTH}x${Config.MAP_HEIGHT}`);
        
        // Update camera boundaries
        this.game.camera.updateDimensions();
    }
    
    /**
     * Create an initial unit for the player near their base
     */
    createInitialUnit() {
        // Find the player's base
        const playerBase = this.game.entities.find(entity => 
            entity.buildingType === 'BASE' && 
            entity.playerId === this.playerId
        );
        
        if (playerBase) {
            // Create unit directly adjacent to the player's base
            // Use a fixed offset that ensures the unit is in a valid position
            const offsetX = 64; // 2 tiles to the right
            
            // Calculate spawn position relative to the base
            const spawnX = playerBase.x + playerBase.width + offsetX;
            const spawnY = playerBase.y + (playerBase.height / 2);
            
            console.log(`Creating initial unit adjacent to player base at (${spawnX}, ${spawnY})`);
            
            // Create the unit directly without setTimeout
            this.createUnit(spawnX, spawnY, true, 'SOLDIER');
        } else {
            console.error('Could not find player base to spawn initial unit');
            
            // Fallback to center of map if no base found
            const centerX = Config.MAP_WIDTH * Config.TILE_SIZE / 2;
            const centerY = Config.MAP_HEIGHT * Config.TILE_SIZE / 2;
            
            console.log(`No player base found, creating unit at center (${centerX}, ${centerY})`);
            this.createUnit(centerX, centerY, true, 'SOLDIER');
        }
    }
    
    /**
     * Handle game state updates from server
     */
    onGameUpdate(data) {
        this.lastServerUpdate = Date.now();
        
        // Store previous positions before updating
        this.game.entities.forEach(entity => {
            if (entity.type === 'unit') {
                // Store current position as previous position
                entity.prevX = entity.x;
                entity.prevY = entity.y;
                
                // Initialize interpolation time
                entity.interpolationStartTime = Date.now();
            }
        });
        
        // Update entities from server data
        this.game.processServerEntities(data.entities);
        
        // Store server positions for interpolation
        this.game.entities.forEach(entity => {
            if (entity.type === 'unit') {
                // Store server position for interpolation
                entity.serverX = entity.x;
                entity.serverY = entity.y;
                
                // Restore current position to previous position for smooth interpolation
                if (entity.prevX !== undefined && entity.prevY !== undefined) {
                    entity.x = entity.prevX;
                    entity.y = entity.prevY;
                }
            }
        });
    }
    
    /**
     * Handle new player joining
     */
    onPlayerJoined(data) {
        console.log('Player joined:', data.player);
        // Could show a notification or update player list
    }
    
    /**
     * Handle player leaving
     */
    onPlayerLeft(data) {
        console.log('Player left:', data.playerId);
        // Could show a notification or update player list
    }
    
    /**
     * Handle new unit creation
     */
    onUnitCreated(data) {
        console.log('Unit created:', data.unit);
        // Process the new unit using the same method
        this.game.processServerEntities({ [data.unit.id]: data.unit });
    }
    
    /**
     * Handle units being moved
     */
    onUnitsMoved(data) {
        const { unitIds, targetX, targetY } = data;
        
        unitIds.forEach(unitId => {
            const unit = this.game.entities.find(e => e.id === unitId);
            if (unit) {
                unit.moveTo(targetX, targetY);
            }
        });
    }
    
    /**
     * Handle entity removal
     */
    onEntityRemoved(data) {
        const entityIndex = this.game.entities.findIndex(e => e.id === data.entityId);
        if (entityIndex !== -1) {
            this.game.entities.splice(entityIndex, 1);
        }
    }
    
    /**
     * Create an entity from server data
     */
    createEntityFromServer(entityData) {
        // This method is now deprecated in favor of processServerEntities
        console.warn('createEntityFromServer is deprecated, use processServerEntities instead');
        
        if (entityData.type === 'unit') {
            const unit = new Unit(
                entityData.x,
                entityData.y,
                entityData.width,
                entityData.height,
                entityData.playerId === this.playerId,
                entityData.unitType || 'SOLDIER',
                entityData.playerColor || 'red'
            );
            
            // Set server-specific properties
            unit.id = entityData.id;
            unit.playerId = entityData.playerId;
            
            // Set unit attributes from server data
            if (entityData.health !== undefined) unit.health = entityData.health;
            if (entityData.maxHealth !== undefined) unit.maxHealth = entityData.maxHealth;
            if (entityData.attackDamage !== undefined) unit.attackDamage = entityData.attackDamage;
            if (entityData.attackRange !== undefined) unit.attackRange = entityData.attackRange;
            if (entityData.attackCooldown !== undefined) unit.attackCooldown = entityData.attackCooldown;
            if (entityData.speed !== undefined) unit.speed = entityData.speed;
            if (entityData.level !== undefined) unit.level = entityData.level;
            if (entityData.experience !== undefined) unit.experience = entityData.experience;
            
            // Set movement properties
            if (entityData.targetX !== undefined) unit.targetX = entityData.targetX;
            if (entityData.targetY !== undefined) unit.targetY = entityData.targetY;
            if (entityData.isMoving !== undefined) unit.isMoving = entityData.isMoving;
            
            // Add to game entities
            this.game.entities.push(unit);
            return unit;
        } else if (entityData.type === 'building') {
            const building = new Building(
                entityData.x,
                entityData.y,
                entityData.width,
                entityData.height,
                entityData.playerId === this.playerId,
                entityData.buildingType || 'BASE',
                entityData.playerColor || 'red'
            );
            
            // Set server-specific properties
            building.id = entityData.id;
            building.playerId = entityData.playerId;
            
            // Set building attributes from server data
            if (entityData.health !== undefined) building.health = entityData.health;
            if (entityData.maxHealth !== undefined) building.maxHealth = entityData.maxHealth;
            
            // Add to game entities
            this.game.entities.push(building);
            return building;
        }
        
        return null;
    }
    
    /**
     * Create a new unit
     */
    createUnit(x, y, isPlayerControlled, unitType = 'SOLDIER') {
        if (!this.connected) {
            console.error('Cannot create unit: not connected to server');
            return;
        }
        
        this.socket.emit('createUnit', {
            x,
            y,
            isPlayerControlled,
            unitType
        });
    }
    
    /**
     * Move units and send to server
     */
    moveUnits(unitIds, targetX, targetY) {
        if (!this.connected) {
            this.pendingCommands.push(() => this.moveUnits(unitIds, targetX, targetY));
            return;
        }
        
        this.socket.emit('moveUnits', {
            unitIds,
            targetX,
            targetY
        });
    }
    
    /**
     * Process any pending commands
     */
    processPendingCommands() {
        if (!this.connected) return;
        
        while (this.pendingCommands.length > 0) {
            const command = this.pendingCommands.shift();
            command();
        }
    }
    
    /**
     * Update method called each frame
     */
    update(deltaTime) {
        // Interpolate entity positions between server updates
        if (this.connected) {
            const currentTime = Date.now();
            
            this.game.entities.forEach(entity => {
                // Only interpolate units, not buildings
                if (entity.type === 'unit' && entity.serverX !== undefined && entity.serverY !== undefined) {
                    // Calculate interpolation progress
                    const interpolationDuration = 100; // ms, adjust based on server update frequency
                    const timeSinceUpdate = entity.interpolationStartTime ? 
                        currentTime - entity.interpolationStartTime : 0;
                    
                    // Calculate interpolation factor (0 to 1)
                    let t = Math.min(timeSinceUpdate / interpolationDuration, 1.0);
                    
                    // Apply easing function for smoother movement (ease-out)
                    t = 1 - Math.pow(1 - t, 2);
                    
                    // Apply interpolation
                    if (t < 1.0) {
                        // Interpolate between current position and server position
                        entity.x = entity.prevX + (entity.serverX - entity.prevX) * t;
                        entity.y = entity.prevY + (entity.serverY - entity.prevY) * t;
                    } else {
                        // Reached target position
                        entity.x = entity.serverX;
                        entity.y = entity.serverY;
                    }
                    
                    // If unit is not moving, ensure it's exactly at the server position
                    if (!entity.isMoving && t >= 1.0) {
                        entity.x = entity.serverX;
                        entity.y = entity.serverY;
                    }
                }
            });
        }
    }
} 