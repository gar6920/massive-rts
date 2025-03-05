/**
 * Main game class that coordinates all game components
 */
class Game {
    /**
     * Initialize the game
     */
    constructor() {
        // Get canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.canvas.width = Config.CANVAS_WIDTH;
        this.canvas.height = Config.CANVAS_HEIGHT;
        
        // Initialize game components
        this.camera = new Camera();
        this.map = new Map();
        this.renderer = new Renderer(this);
        this.inputHandler = new InputHandler(this);
        this.multiplayer = new Multiplayer(this);
        
        // Game state
        this.entities = [];
        this.selectedEntities = [];
        this.running = false;
        this.lastFrameTime = 0;
        this.fps = 0;
        
        // Multiplayer state
        this.playerId = null;
    }
    
    /**
     * Start the game
     */
    start() {
        // Initialize multiplayer
        this.multiplayer = new Multiplayer(this);
        this.multiplayer.connect();
        
        // Start the game loop
        this.running = true;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    /**
     * Main game loop
     */
    gameLoop(timestamp) {
        // Calculate delta time and FPS
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        this.fps = 1000 / deltaTime;
        
        // Update game state
        this.update(deltaTime);
        
        // Render the game
        this.renderer.render();
        
        // Continue the game loop
        if (this.running) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        // Update input handler
        this.inputHandler.update();
        
        // Update multiplayer
        this.multiplayer.update(deltaTime);
        
        // Update entity positions with interpolation
        this.updateEntities(deltaTime);
        
        // Update all entities
        for (const entity of this.entities) {
            entity.update(deltaTime, this);
        }
    }
    
    /**
     * Interpolate entity positions smoothly between server updates
     */
    updateEntities(deltaTime) {
        const interpolationFactor = 0.1; // adjust for smoothness
        
        for (const entity of this.entities) {
            // Only apply interpolation to units, not buildings
            if (entity instanceof Unit && entity.serverX !== undefined && entity.serverY !== undefined) {
                // Smoothly interpolate between current position and server position
                entity.x += (entity.serverX - entity.x) * interpolationFactor;
                entity.y += (entity.serverY - entity.y) * interpolationFactor;
            }
        }
    }
    
    /**
     * Process entities received from the server
     */
    processServerEntities(serverEntities) {
        if (!serverEntities) return;
        
        console.log('Processing server entities:', Object.keys(serverEntities).length);
        console.log('Entity types:', Object.values(serverEntities).map(e => e.type).join(', '));
        
        // Clear existing entities if this is a full update
        if (this.entities.length === 0) {
            this.entities = [];
        }
        
        // Process each entity from the server
        Object.values(serverEntities).forEach(serverEntity => {
            console.log(`Processing entity: ${serverEntity.id}, type: ${serverEntity.type}, position: (${serverEntity.x}, ${serverEntity.y})`);
            
            // Check if this entity already exists
            let entity = this.entities.find(e => e.id === serverEntity.id);
            
            if (!entity) {
                // Create a new entity based on its type
                if (serverEntity.type === 'unit') {
                    entity = new Unit(
                        serverEntity.x,
                        serverEntity.y,
                        serverEntity.width,
                        serverEntity.height,
                        serverEntity.playerId === this.multiplayer.playerId,
                        serverEntity.unitType,
                        serverEntity.playerColor
                    );
                    // Initialize server position properties for interpolation
                    entity.serverX = serverEntity.x;
                    entity.serverY = serverEntity.y;
                } else if (serverEntity.type === 'building') {
                    console.log(`Creating building: ${serverEntity.buildingType} at (${serverEntity.x}, ${serverEntity.y}) with color ${serverEntity.playerColor}`);
                    entity = new Building(
                        serverEntity.x,
                        serverEntity.y,
                        serverEntity.width,
                        serverEntity.height,
                        serverEntity.playerId === this.multiplayer.playerId,
                        serverEntity.buildingType,
                        serverEntity.playerColor
                    );
                }
                
                if (entity) {
                    // Set additional properties
                    entity.id = serverEntity.id;
                    entity.playerId = serverEntity.playerId;
                    entity.health = serverEntity.health;
                    entity.maxHealth = serverEntity.maxHealth;
                    
                    // Add to entities array
                    this.entities.push(entity);
                    console.log(`Added new ${serverEntity.type} from server:`, entity);
                }
            } else {
                // Update existing entity
                if (serverEntity.type === 'unit') {
                    // For units, store server position for interpolation instead of direct update
                    entity.serverX = serverEntity.x;
                    entity.serverY = serverEntity.y;
                    entity.targetX = serverEntity.targetX;
                    entity.targetY = serverEntity.targetY;
                    entity.isMoving = serverEntity.isMoving;
                } else {
                    // For non-moving entities like buildings, update position directly
                    entity.x = serverEntity.x;
                    entity.y = serverEntity.y;
                }
                
                // Update health for all entities
                entity.health = serverEntity.health;
                entity.maxHealth = serverEntity.maxHealth;
                
                // Make sure isPlayerControlled is set correctly
                entity.isPlayerControlled = serverEntity.playerId === this.multiplayer.playerId;
            }
        });
        
        console.log(`Total entities after processing: ${this.entities.length}`);
    }
    
    /**
     * Handle entity selection
     */
    handleEntitySelection(worldX, worldY) {
        console.log(`Handling selection at world coordinates (${worldX}, ${worldY})`);

        const gridPos = this.map.isoToGrid(worldX, worldY);
        const gridX = gridPos.x;
        const gridY = gridPos.y;
        
        console.log(`Converted to grid coordinates (${gridX}, ${gridY})`);

        let entitySelected = false;

        // Deselect all entities first
        for (const entity of this.entities) {
            entity.isSelected = false;
        }
        this.selectedEntities = [];

        // Check if any entity was clicked
        for (const entity of this.entities) {
            const entityGridX = Math.floor(entity.x / Config.TILE_SIZE);
            const entityGridY = Math.floor(entity.y / Config.TILE_SIZE);
            
            console.log(`Checking entity ${entity.id} at grid (${entityGridX}, ${entityGridY}), isPlayerControlled: ${entity.isPlayerControlled}, playerId: ${entity.playerId}`);

            if (gridX === entityGridX && gridY === entityGridY) {
                console.log(`Entity ${entity.id} is at the clicked grid position`);
                
                // Only select entities that belong to the player and are player-controlled
                if (entity.playerId !== this.multiplayer.playerId || !entity.isPlayerControlled) {
                    console.log(`Entity ${entity.id} belongs to player ${entity.playerId} or is not player-controlled, not selecting`);
                    continue;
                }
                
                // Select this entity
                entity.isSelected = true;
                this.selectedEntities.push(entity);
                entitySelected = true;
                
                // Log selection for debugging
                console.log(`Selected entity: ${entity.constructor.name}, ID: ${entity.id}, Player: ${entity.playerId}`);
                break; // Only select one entity for now
            }
        }
        
        // If no entity was selected, this might be a map click
        if (!entitySelected) {
            console.log(`No entity selected at grid (${gridX}, ${gridY})`);
        }
    }
    
    /**
     * Select entities within a box
     */
    selectEntitiesInBox(startX, startY, endX, endY) {
        console.log(`Selecting entities in box from world (${startX.toFixed(2)}, ${startY.toFixed(2)}) to (${endX.toFixed(2)}, ${endY.toFixed(2)})`);
        
        // Convert isometric world coordinates to grid coordinates
        const startGridPos = this.map.isoToGrid(startX, startY);
        const endGridPos = this.map.isoToGrid(endX, endY);
        
        console.log(`Selection box in grid coordinates: from (${startGridPos.x.toFixed(2)}, ${startGridPos.y.toFixed(2)}) to (${endGridPos.x.toFixed(2)}, ${endGridPos.y.toFixed(2)})`);
        
        // Deselect all entities first
        for (const entity of this.entities) {
            entity.isSelected = false;
        }
        this.selectedEntities = [];
        
        // Calculate selection rectangle in grid coordinates
        const selectionRect = {
            x: Math.min(startGridPos.x, endGridPos.x),
            y: Math.min(startGridPos.y, endGridPos.y),
            width: Math.abs(endGridPos.x - startGridPos.x),
            height: Math.abs(endGridPos.y - startGridPos.y)
        };
        
        console.log(`Selection rectangle in grid: (${selectionRect.x.toFixed(2)}, ${selectionRect.y.toFixed(2)}) with size ${selectionRect.width.toFixed(2)}x${selectionRect.height.toFixed(2)}`);
        
        // Select entities found within the selection rectangle
        let entitiesSelected = 0;
        for (const entity of this.entities) {
            // Convert entity position to grid coordinates
            const entityGridX = Math.floor(entity.x / Config.TILE_SIZE);
            const entityGridY = Math.floor(entity.y / Config.TILE_SIZE);
            
            console.log(`Checking entity ${entity.id} at grid (${entityGridX}, ${entityGridY}), isPlayerControlled: ${entity.isPlayerControlled}, playerId: ${entity.playerId}`);
            
            if (
                entityGridX >= selectionRect.x &&
                entityGridX <= selectionRect.x + selectionRect.width &&
                entityGridY >= selectionRect.y &&
                entityGridY <= selectionRect.y + selectionRect.height &&
                entity.isPlayerControlled // Only select player-controlled units
            ) {
                // Only select entities that belong to the player
                if (entity.playerId !== this.multiplayer.playerId) {
                    console.log(`Entity ${entity.id} belongs to player ${entity.playerId}, not selecting`);
                    continue;
                }
                
                // Select this entity
                entity.isSelected = true;
                this.selectedEntities.push(entity);
                entitiesSelected++;
                
                // For debugging
                console.log(`Selected entity in box: ${entity.constructor.name}, ID: ${entity.id}`);
            } else {
                console.log(`Entity ${entity.id} not in selection box or not player-controlled`);
            }
        }
        
        console.log(`Selected ${entitiesSelected} entities in box selection`);
    }
    
    /**
     * Deselect all entities
     */
    deselectAll() {
        for (const entity of this.entities) {
            entity.isSelected = false;
        }
        this.selectedEntities = [];
    }
    
    /**
     * Handle area selection
     */
    handleAreaSelection(startPos, endPos) {
        // Deselect all entities first
        for (const entity of this.entities) {
            entity.isSelected = false;
        }
        this.selectedEntities = [];
        
        // Calculate selection rectangle
        const selectionRect = {
            x: Math.min(startPos.x, endPos.x),
            y: Math.min(startPos.y, endPos.y),
            width: Math.abs(endPos.x - startPos.x),
            height: Math.abs(endPos.y - startPos.y)
        };
        
        // Select all entities within the selection rectangle
        let entitiesSelected = 0;
        for (const entity of this.entities) {
            if (
                entity.x + entity.width >= selectionRect.x &&
                entity.x <= selectionRect.x + selectionRect.width &&
                entity.y + entity.height >= selectionRect.y &&
                entity.y <= selectionRect.y + selectionRect.height &&
                entity.isPlayerControlled // Only select player-controlled units
            ) {
                // Only select entities that belong to the player
                if (entity.playerId !== this.multiplayer.playerId) {
                    continue;
                }
                
                entity.isSelected = true;
                this.selectedEntities.push(entity);
                entitiesSelected++;
                
                // For debugging
                console.log(`Selected entity in area: ${entity.constructor.name}, ID: ${entity.id}`);
            }
        }
        
        console.log(`Selected ${entitiesSelected} entities in area selection`);
    }
    
    /**
     * Handle command (right-click)
     */
    handleCommand(worldX, worldY) {
        if (this.selectedEntities.length === 0) return;

        console.log(`Command at isometric world coordinates: (${worldX.toFixed(2)}, ${worldY.toFixed(2)})`);
        
        // Correctly convert from isometric world coordinates to grid coordinates
        const gridPos = this.map.isoToGrid(worldX, worldY);
        const tileX = Math.floor(gridPos.x);
        const tileY = Math.floor(gridPos.y);
        
        console.log(`Converted to grid coordinates: (${tileX}, ${tileY})`);
        
        // Convert grid coordinates to cartesian coordinates for server
        const cartesianX = tileX * Config.TILE_SIZE;
        const cartesianY = tileY * Config.TILE_SIZE;
        
        console.log(`Units moving to cartesian coordinates: (${cartesianX}, ${cartesianY})`);

        // Get IDs of selected units for multiplayer
        const selectedUnitIds = this.selectedEntities
            .filter(entity => entity instanceof Unit)
            .map(entity => entity.id);
        
        if (selectedUnitIds.length > 0) {
            // Send movement command to server with cartesian coordinates
            this.multiplayer.moveUnits(selectedUnitIds, cartesianX, cartesianY);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.canvas.width = Config.CANVAS_WIDTH;
        this.canvas.height = Config.CANVAS_HEIGHT;
        this.renderer.handleResize();
    }
    
    /**
     * Create a test player unit
     */
    createTestUnit() {
        // In multiplayer mode, units are created by the server
        if (this.multiplayer && this.multiplayer.connected) {
            // Find the player's base
            const playerBase = this.entities.find(entity => 
                entity.buildingType === 'BASE' && 
                entity.playerId === this.playerId
            );
            
            if (playerBase) {
                // Create unit near the player's base
                const spawnX = playerBase.x + playerBase.width + 10;
                const spawnY = playerBase.y + playerBase.height / 2;
                
                console.log(`Creating unit near player base at (${spawnX}, ${spawnY})`);
                this.multiplayer.createUnit(spawnX, spawnY, true, 'SOLDIER');
            } else {
                // Fallback to center of map if no base found
                const centerX = Config.MAP_WIDTH * Config.TILE_SIZE / 2;
                const centerY = Config.MAP_HEIGHT * Config.TILE_SIZE / 2;
                
                console.log(`No player base found, creating unit at center (${centerX}, ${centerY})`);
                this.multiplayer.createUnit(centerX, centerY, true, 'SOLDIER');
            }
            return;
        }
        
        // For single player testing only
        const unit = new Unit(
            Config.MAP_WIDTH * Config.TILE_SIZE / 2,
            Config.MAP_HEIGHT * Config.TILE_SIZE / 2,
            Config.UNIT_SIZE,
            Config.UNIT_SIZE,
            true,
            'SOLDIER',
            'red'
        );
        this.entities.push(unit);
    }
    
    /**
     * Create a unit at the specified position
     */
    createUnitAt(x, y) {
        if (this.multiplayer && this.multiplayer.connected) {
            this.multiplayer.createUnit(x, y, true, 'SOLDIER');
        } else {
            const unit = new Unit(
                x,
                y,
                Config.UNIT_SIZE,
                Config.UNIT_SIZE,
                true,
                'SOLDIER',
                'blue'
            );
            this.entities.push(unit);
        }
    }
} 