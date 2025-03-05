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
        this.serverStartTime = null; // Store server start time
        
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
        this.onJoinGameSuccess = this.onJoinGameSuccess.bind(this);
        this.onJoinGameError = this.onJoinGameError.bind(this);
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
        this.socket.on('joinGameSuccess', this.onJoinGameSuccess);
        this.socket.on('joinGameError', this.onJoinGameError);
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
        
        // Store server start time
        if (data.gameState && data.gameState.serverStartTime) {
            console.log('Setting server start time:', new Date(data.gameState.serverStartTime));
            this.serverStartTime = data.gameState.serverStartTime;
        }
        
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
        
        // Clear existing entities before processing new ones
        this.game.entities = [];
        
        // Process entities from server data (should only be buildings at this point)
        if (data.gameState && data.gameState.entities) {
            console.log('Processing initial entities from server data (buildings only)');
            this.game.processServerEntities(data.gameState.entities);
        }

        // Show the join button
        this.showJoinButton();
    }
    
    /**
     * Show the join button in the UI
     */
    showJoinButton() {
        // Create join button container if it doesn't exist
        let joinContainer = document.getElementById('joinContainer');
        if (!joinContainer) {
            joinContainer = document.createElement('div');
            joinContainer.id = 'joinContainer';
            joinContainer.style.position = 'absolute';
            joinContainer.style.top = '50%';
            joinContainer.style.left = '50%';
            joinContainer.style.transform = 'translate(-50%, -50%)';
            joinContainer.style.textAlign = 'center';
            joinContainer.style.zIndex = '1000';
            document.body.appendChild(joinContainer);
        }

        // Create join button if it doesn't exist
        let joinButton = document.getElementById('joinButton');
        if (!joinButton) {
            joinButton = document.createElement('button');
            joinButton.id = 'joinButton';
            joinButton.textContent = 'Join Game';
            joinButton.style.padding = '15px 30px';
            joinButton.style.fontSize = '18px';
            joinButton.style.cursor = 'pointer';
            joinButton.style.backgroundColor = '#4CAF50';
            joinButton.style.color = 'white';
            joinButton.style.border = 'none';
            joinButton.style.borderRadius = '5px';
            joinButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            
            // Add hover effect
            joinButton.onmouseover = () => {
                joinButton.style.backgroundColor = '#45a049';
            };
            joinButton.onmouseout = () => {
                joinButton.style.backgroundColor = '#4CAF50';
            };

            // Add click handler
            joinButton.onclick = () => {
                this.requestJoinGame();
                joinContainer.remove(); // Remove the button after clicking
            };

            joinContainer.appendChild(joinButton);
        }
    }
    
    /**
     * Request to join the game and create initial unit
     */
    requestJoinGame() {
        console.log('Requesting to join game with playerId:', this.playerId);
        this.socket.emit('joinGame', { playerId: this.playerId });
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
     * Handle game update from server
     */
    onGameUpdate(data) {
        const currentTime = Date.now();
        
        // Update server start time if provided
        if (data.serverStartTime && (!this.serverStartTime || this.serverStartTime !== data.serverStartTime)) {
            this.serverStartTime = data.serverStartTime;
        }

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
        const unit = data.unit;
        console.log("Received new unit from server:", unit);

        // Explicitly process and add the new unit
        this.game.processServerEntities({ [unit.id]: unit });

        // If the unit belongs to this player, center camera on it immediately
        if (unit.playerId === this.playerId) {
            const tileSize = Config.TILE_SIZE;
            const gridX = unit.x / tileSize;
            const gridY = unit.y / tileSize;
            const isoX = (gridX - gridY) * (tileSize / 2);
            const isoY = (gridX + gridY) * (tileSize / 4);

            console.log(`Centering camera on player unit at (${isoX}, ${isoY})`);

            // Explicitly center camera
            this.game.camera.centerOn(isoX, isoY);
            this.game.camera.zoom = Config.ZOOM_DEFAULT * 1.5;
            this.game.camera.clampPosition();
        }

        // Explicitly request rendering to immediately display the unit
        this.game.renderer.render();
    }
    
    /**
     * Handle units being moved
     */
    onUnitsMoved(data) {
        const { unitIds, targetX, targetY } = data;
        
        unitIds.forEach(unitId => {
            const unit = this.game.entities.find(e => e.id === unitId);
            if (unit) {
                // Set the target for the unit to move to
                unit.targetX = targetX;
                unit.targetY = targetY;
                unit.isMoving = true;
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
    
    /**
     * Get the elapsed time since the server started
     * @returns {string} Formatted elapsed time (HH:MM:SS)
     */
    getElapsedTime() {
        if (!this.serverStartTime) {
            return "00:00:00";
        }
        
        // Calculate elapsed time in seconds
        const elapsedMs = Date.now() - this.serverStartTime;
        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        
        // Format as HH:MM:SS
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Handle successful game join
     */
    onJoinGameSuccess(data) {
        console.log('Successfully joined game, received unit:', data.unit);
        
        // Note: We don't need to process the unit here as it will come through
        // the unitCreated event that the server broadcasts to all clients
        
        // Remove the join button
        const joinContainer = document.getElementById('joinContainer');
        if (joinContainer) {
            joinContainer.remove();
        }
    }
    
    /**
     * Handle game join error
     */
    onJoinGameError(data) {
        console.error('Failed to join game:', data.message);
        alert(`Failed to join game: ${data.message}`);
        // Show join button again
        this.showJoinButton();
    }
} 