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
        
        let unitX, unitY;
        
        if (playerBase) {
            // Create unit directly adjacent to the player's base
            // Use a fixed offset that ensures the unit is in a valid position
            const offsetX = 64; // 2 tiles to the right
            
            // Calculate spawn position relative to the base
            unitX = playerBase.x + playerBase.width + offsetX;
            unitY = playerBase.y + (playerBase.height / 2);
            
            console.log(`Creating initial unit adjacent to player base at (${unitX}, ${unitY})`);
            
            // Create the unit directly without setTimeout
            this.createUnit(unitX, unitY, true, 'SOLDIER');
        } else {
            console.error('Could not find player base to spawn initial unit');
            
            // Fallback to center of map if no base found
            unitX = Config.MAP_WIDTH * Config.TILE_SIZE / 2;
            unitY = Config.MAP_HEIGHT * Config.TILE_SIZE / 2;
            
            console.log(`No player base found, creating unit at center (${unitX}, ${unitY})`);
            this.createUnit(unitX, unitY, true, 'SOLDIER');
        }
        
        // Center the camera on the unit's position and zoom in
        setTimeout(() => {
            // Convert grid coordinates to isometric coordinates for proper centering
            const tileSize = Config.TILE_SIZE;
            const gridX = unitX / tileSize;
            const gridY = unitY / tileSize;
            const isoX = (gridX - gridY) * (tileSize / 2);
            const isoY = (gridX + gridY) * (tileSize / 4);
            
            console.log(`Centering camera on player unit at isometric position (${isoX}, ${isoY})`);
            
            // Center the camera on the unit
            this.game.camera.centerOn(isoX, isoY);
            
            // Set an appropriate zoom level for the initial view
            this.game.camera.zoom = Config.ZOOM_DEFAULT * 1.5;
            
            // Ensure camera stays within boundaries
            this.game.camera.clampPosition();
        }, 100); // Short delay to ensure the unit is fully created
    }
    
    /**
     * Handle game update from server
     */
    onGameUpdate(data) {
        const currentTime = Date.now();

        Object.values(data.entities).forEach(serverEntity => {
            let localEntity = this.game.entities.find(e => e.id === serverEntity.id);

            if (localEntity) {
                if (localEntity instanceof Unit) {
                    // Explicitly store previous positions for interpolation
                    localEntity.prevX = localEntity.x;
                    localEntity.prevY = localEntity.y;
                    localEntity.serverX = serverEntity.x;
                    localEntity.serverY = serverEntity.y;
                    localEntity.interpolationStartTime = currentTime;
                }
            }
        });
        
        this.game.processServerEntities(data.entities);
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
        
        // If this is a player-controlled unit, center the camera on it
        if (data.unit.playerId === this.playerId) {
            // Convert grid coordinates to isometric coordinates for proper centering
            const tileSize = Config.TILE_SIZE;
            const gridX = data.unit.x / tileSize;
            const gridY = data.unit.y / tileSize;
            const isoX = (gridX - gridY) * (tileSize / 2);
            const isoY = (gridX + gridY) * (tileSize / 4);
            
            console.log(`Centering camera on new player unit at isometric position (${isoX}, ${isoY})`);
            
            // Center the camera on the unit
            this.game.camera.centerOn(isoX, isoY);
            
            // Set an appropriate zoom level
            this.game.camera.zoom = Config.ZOOM_DEFAULT * 1.5;
            
            // Ensure camera stays within boundaries
            this.game.camera.clampPosition();
        }
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
     * Update multiplayer state
     */
    update(deltaTime) {
        const interpolationDuration = 100; // Time between server updates in ms
        const currentTime = Date.now();

        this.game.entities.forEach(entity => {
            if (entity instanceof Unit && entity.serverX !== undefined && entity.serverY !== undefined) {
                const elapsed = currentTime - entity.interpolationStartTime;
                const t = Math.min(elapsed / interpolationDuration, 1); // interpolationDuration ~100ms

                entity.x = entity.prevX + (entity.serverX - entity.prevX) * t;
                entity.y = entity.prevY + (entity.serverY - entity.prevY) * t;

                if (t >= 1) {
                    entity.prevX = entity.serverX;
                    entity.prevY = entity.serverY;
                }
            }
        });
    }
} 