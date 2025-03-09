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
        this.room = null;
        this.playerId = null;
        this.connected = false;
        this.serverEntities = {}; // Entities from the server
        this.pendingCommands = []; // Commands waiting to be sent
        this.lastServerUpdate = Date.now();
        this.serverStartTime = null; // Store server start time
        
        // Connect to the server
        this.connect();
    }
    
    /**
     * Connect to the game server
     */
    async connect() {
        try {
            console.log('Connecting to game server...');
            
            // Create Colyseus client
            const client = new Colyseus.Client(window.location.protocol.replace("http", "ws") + "//" + window.location.host);
            
            // Join the game room
            this.room = await client.joinOrCreate("game");
            
            console.log("Connected to game room:", this.room.id);
            this.connected = true;
            
            // Set up message handlers
            this.setupMessageHandlers();
            
        } catch (error) {
            console.error("Failed to connect:", error);
        }
    }
    
    /**
     * Set up message handlers for the room
     */
    setupMessageHandlers() {
        // Handle state changes
        this.room.onStateChange((state) => {
            console.log("State updated:", state);
            this.processGameState(state);
        });
        
        // Handle player join/leave
        this.room.onMessage("player_joined", (data) => {
            console.log("Player joined:", data.id);
        });
        
        this.room.onMessage("player_left", (data) => {
            console.log("Player left:", data.id);
        });
        
        // Handle game state
        this.room.onMessage("gameState", (data) => {
            console.log("Received game state:", data);
            this.processGameState(data);
        });
    }
    
    /**
     * Process game state from server
     */
    processGameState(data) {
        console.log('\n=== Processing Game State ===');
        
        // Set player ID if not set
        if (!this.playerId) {
            this.playerId = this.room.sessionId;
            this.game.playerId = this.room.sessionId;
            console.log('Set player ID:', this.playerId);
        }
        
        // Process map data if available
        if (data.map) {
            console.log('Processing map data...');
            this.game.map.setMapFromServer(data.map);
            this.game.camera.centerOnMap();
        }
        
        // Process entities
        if (data.buildings || data.units) {
            console.log('Processing entities...');
            this.game.processServerEntities({
                buildings: data.buildings,
                units: data.units
            });
        }
        
        console.log('=== Game State Processing Complete ===\n');
    }
    
    /**
     * Disconnect from the game server
     */
    disconnect() {
        if (this.room) {
            this.room.leave();
            this.room = null;
        }
        this.connected = false;
    }
    
    /**
     * Move units
     */
    moveUnits(unitIds, targetX, targetY) {
        if (!this.connected) {
            this.pendingCommands.push(() => this.moveUnits(unitIds, targetX, targetY));
            return;
        }
        
        this.room.send("moveUnits", {
            unitIds,
            targetX,
            targetY
        });
    }
    
    /**
     * Attack target
     */
    attackTarget(unitIds, targetEntityId) {
        if (!this.connected) {
            this.pendingCommands.push(() => this.attackTarget(unitIds, targetEntityId));
            return;
        }
        
        this.room.send("attack", {
            unitIds,
            targetId: targetEntityId
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
}

// Export the Multiplayer class
export default Multiplayer; 