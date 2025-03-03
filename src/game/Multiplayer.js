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
        
        // Set the map from server data
        if (data.gameState && data.gameState.map) {
            console.log('Setting map from server data');
            this.game.map.setMapFromServer(data.gameState.map);
        } else {
            console.error('No map data received from server');
        }
        
        // Clear existing entities
        this.game.entities = [];
        
        // Create entities from server data
        if (data.gameState && data.gameState.entities) {
            console.log('Creating entities from server data');
            Object.values(data.gameState.entities).forEach(entityData => {
                this.createEntityFromServer(entityData);
            });
        }
        
        // Create a player unit if none exists
        if (this.game.entities.filter(e => e.isPlayerControlled).length === 0) {
            console.log('Creating initial player unit');
            this.createUnit(
                Config.MAP_WIDTH * Config.TILE_SIZE / 2,
                Config.MAP_HEIGHT * Config.TILE_SIZE / 2,
                true
            );
        }
    }
    
    /**
     * Handle game state updates from server
     */
    onGameUpdate(data) {
        this.lastServerUpdate = Date.now();
        
        // Update entity positions from server
        Object.entries(data.entities).forEach(([entityId, entityData]) => {
            // Find matching entity in our game
            const entity = this.game.entities.find(e => e.id === entityId);
            
            if (entity) {
                // Update existing entity
                if (entityData.isMoving) {
                    entity.targetX = entityData.targetX;
                    entity.targetY = entityData.targetY;
                    entity.isMoving = true;
                } else {
                    entity.isMoving = false;
                }
                
                // Smoothly interpolate position
                entity.serverX = entityData.x;
                entity.serverY = entityData.y;
            } else {
                // Create new entity if it doesn't exist locally
                this.createEntityFromServer(entityData);
            }
        });
        
        // Remove entities that no longer exist on the server
        this.game.entities = this.game.entities.filter(entity => {
            return entity.id in data.entities || !entity.id;
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
        this.createEntityFromServer(data.unit);
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
     * Create a new unit and send to server
     */
    createUnit(x, y, isPlayerControlled) {
        if (!this.connected) {
            this.pendingCommands.push(() => this.createUnit(x, y, isPlayerControlled));
            return;
        }
        
        this.socket.emit('createUnit', {
            x,
            y,
            isPlayerControlled
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
     * Create an entity from server data
     */
    createEntityFromServer(entityData) {
        if (entityData.type === 'unit') {
            const unit = new Unit(
                entityData.x,
                entityData.y,
                entityData.width,
                entityData.height,
                entityData.playerId === this.playerId
            );
            
            // Set server-specific properties
            unit.id = entityData.id;
            unit.playerId = entityData.playerId;
            unit.health = entityData.health;
            
            // Add to game entities
            this.game.entities.push(unit);
            return unit;
        }
        
        return null;
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
            this.game.entities.forEach(entity => {
                if (entity.serverX !== undefined && entity.serverY !== undefined) {
                    // Simple linear interpolation
                    const t = 0.1; // Interpolation factor
                    entity.x += (entity.serverX - entity.x) * t;
                    entity.y += (entity.serverY - entity.y) * t;
                }
            });
        }
    }
} 