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
        this.multiplayer.connect();

        const checkResourcesLoaded = () => {
            if (this.renderer.imagesLoaded && this.map.tiles.length > 0) {
                console.log("All resources loaded, starting game loop");
                this.running = true;
                // Center camera on map when game first loads
                this.camera.centerOnMap();
                requestAnimationFrame(this.gameLoop.bind(this));
            } else {
                console.log("Waiting for resources...");
                setTimeout(checkResourcesLoaded, 100);
            }
        };

        checkResourcesLoaded();
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
        this.inputHandler.update();
        this.multiplayer.update(deltaTime);
        this.updateEntities(deltaTime);
    }
    
    /**
     * Update all entities in the game
     */
    updateEntities(deltaTime) {
        // Update each entity
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            
            // Check if entity should be removed - either if markForRemoval is set or if it's been destroyed for 3+ seconds
            if (entity.markForRemoval || 
                (entity.isDestroyed && entity.deathAnimationTime && Date.now() - entity.deathAnimationTime >= 3000)) {
                this.removeEntity(entity.id);
                continue;
            }
            
            entity.update(deltaTime, this);
        }
    }
    
    /**
     * Process entities received from the server
     */
    processServerEntities(serverEntities) {
        if (!serverEntities) return;
        
        console.log('Processing server entities:', Object.keys(serverEntities).length);
        console.log('Entity types:', Object.values(serverEntities).map(e => e.type).join(', '));
        
        // Process each entity from the server
        Object.values(serverEntities).forEach(serverEntity => {
            let entity = this.entities.find(e => e.id === serverEntity.id);

            if (entity && entity.isDestroyed) {
                return;  // STOP UPDATING DEAD UNITS FROM SERVER
            }

            // Check if this entity already exists
            if (!entity) {
                // Create a new entity based on its type
                if (serverEntity.type === 'unit') {
                    console.log(`Creating new unit: ${serverEntity.id}, playerId: ${serverEntity.playerId}`);
                    entity = new Unit(
                        serverEntity.x,
                        serverEntity.y,
                        serverEntity.width,
                        serverEntity.height,
                        serverEntity.playerId === this.multiplayer.playerId,
                        serverEntity.unitType,
                        serverEntity.playerColor
                    );
                    
                    // Set all unit properties from server
                    entity.id = serverEntity.id;
                    entity.playerId = serverEntity.playerId;
                    entity.health = serverEntity.health;
                    entity.maxHealth = serverEntity.maxHealth;
                    entity.attackDamage = serverEntity.attackDamage;
                    entity.attackRange = serverEntity.attackRange;
                    entity.attackCooldown = serverEntity.attackCooldown;
                    entity.speed = serverEntity.speed;
                    entity.level = serverEntity.level;
                    entity.experience = serverEntity.experience;
                    entity.targetX = serverEntity.targetX;
                    entity.targetY = serverEntity.targetY;
                    entity.isMoving = serverEntity.isMoving;
                    
                    // Initialize interpolation properties
                    entity.prevX = serverEntity.x;
                    entity.prevY = serverEntity.y;
                    entity.serverX = serverEntity.x;
                    entity.serverY = serverEntity.y;
                    entity.interpolationStartTime = Date.now();
                    
                    // Add to entities array
                    this.entities.push(entity);
                    console.log(`Added new unit to game:`, entity);
                    
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
                    
                    // Set building properties
                    entity.id = serverEntity.id;
                    entity.playerId = serverEntity.playerId;
                    entity.health = serverEntity.health;
                    entity.maxHealth = serverEntity.maxHealth;
                    
                    // Add to entities array
                    this.entities.push(entity);
                    console.log(`Added new building to game:`, entity);
                }
            } else {
                // Update existing entity
                if (serverEntity.type === 'unit') {
                    // For units, store server position for interpolation
                    entity.prevX = entity.x;
                    entity.prevY = entity.y;
                    entity.serverX = serverEntity.x;
                    entity.serverY = serverEntity.y;
                    entity.interpolationStartTime = Date.now();
                    entity.targetX = serverEntity.targetX;
                    entity.targetY = serverEntity.targetY;
                    entity.isMoving = serverEntity.isMoving;
                    entity.health = serverEntity.health;
                    entity.maxHealth = serverEntity.maxHealth;
                    entity.isPlayerControlled = serverEntity.playerId === this.multiplayer.playerId;
                } else {
                    // For non-moving entities like buildings, update position directly
                    entity.x = serverEntity.x;
                    entity.y = serverEntity.y;
                    entity.health = serverEntity.health;
                    entity.maxHealth = serverEntity.maxHealth;
                    entity.isPlayerControlled = serverEntity.playerId === this.multiplayer.playerId;
                }
            }
        });
        
        console.log(`Total entities after processing: ${this.entities.length}`);
    }
    
    /**
     * Handle single-click entity selection at a world coordinate
     */
    handleEntitySelection(worldX, worldY) {
        // Convert isometric world coordinates to grid coordinates
        const gridPos = this.map.isoToGrid(worldX, worldY);
        const gridX = Math.floor(gridPos.x);
        const gridY = Math.floor(gridPos.y);

        // Deselect all entities first
        this.deselectAll();

        // Iterate to find the entity at clicked location
        for (const entity of this.entities) {
            const entityGridX = Math.floor(entity.x / Config.TILE_SIZE);
            const entityGridY = Math.floor(entity.y / Config.TILE_SIZE);

            if (gridX === entityGridX && gridY === entityGridY) {
                // Allow selecting any entity (for viewing info), but only add player's units to selectedEntities
                entity.isSelected = true;
                if (entity instanceof Unit && entity.playerId === this.multiplayer.playerId) {
                    this.selectedEntities.push(entity);
                }
                console.log(`Selected entity: ${entity.constructor.name}, ID: ${entity.id}`);
                break; // Select only the first found entity
            }
        }
    }
    
    /**
     * Select entities within a box
     */
    selectEntitiesInBox(startX, startY, endX, endY) {
        // Convert isometric world coordinates to grid coordinates
        const startGridPos = this.map.isoToGrid(startX, startY);
        const endGridPos = this.map.isoToGrid(endX, endY);
        
        // Calculate selection rectangle in grid coordinates
        const selectionRect = {
            left: Math.min(startGridPos.x, endGridPos.x),
            right: Math.max(startGridPos.x, endGridPos.x),
            top: Math.min(startGridPos.y, endGridPos.y),
            bottom: Math.max(startGridPos.y, endGridPos.y)
        };

        // Deselect first
        this.deselectAll();

        // Find all client-owned units in the selection box
        const clientUnits = this.entities.filter(entity => {
            // First check if it's a client-owned unit
            if (!(entity instanceof Unit) || entity.playerId !== this.multiplayer.playerId) {
                return false;
            }

            // Then check if it's in the selection box
            const entityGridX = Math.floor(entity.x / Config.TILE_SIZE);
            const entityGridY = Math.floor(entity.y / Config.TILE_SIZE);
            
            return (
                entityGridX >= selectionRect.left &&
                entityGridX <= selectionRect.right &&
                entityGridY >= selectionRect.top &&
                entityGridY <= selectionRect.bottom
            );
        });

        // If we found any client units in the box, select them all
        if (clientUnits.length > 0) {
            clientUnits.forEach(unit => {
                unit.isSelected = true;
                this.selectedEntities.push(unit);
            });
        }

        console.log(`Selected ${this.selectedEntities.length} client-owned units in box.`);
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
        console.log(`My player ID from Game object: ${this.playerId}`);
        console.log(`My player ID from Multiplayer object: ${this.multiplayer.playerId}`);
        
        // Get IDs of selected units
        const selectedUnitIds = this.selectedEntities
            .filter(entity => entity instanceof Unit)
            .map(entity => entity.id);
        
        if (selectedUnitIds.length === 0) return;
        
        // First, check if user clicked on an entity
        const clickedEntity = this.getEntityAtPosition(worldX, worldY);
        
        // If clicked on an enemy entity, issue attack command
        if (clickedEntity && clickedEntity.playerId !== this.playerId && clickedEntity.id) {
            console.log(`Attempting to attack entity: ${clickedEntity.id}, type: ${clickedEntity instanceof Unit ? 'Unit' : 'Building'}`);
            console.log(`Selected units: ${selectedUnitIds.join(', ')}`);
            console.log(`My player ID: ${this.playerId}, target entity owner: ${clickedEntity.playerId}`);
            
            // Issue attack command to server
            this.multiplayer.attackTarget(selectedUnitIds, clickedEntity.id);
            
            // Visual feedback
            this.renderer.addEffect('attackCommand', worldX, worldY);
            
            console.log('Attack command sent to server');
            return;
        }
        
        // Otherwise, it's a movement command
        // Convert from isometric world coordinates to grid coordinates
        const gridPos = this.map.isoToGrid(worldX, worldY);
        const tileX = Math.floor(gridPos.x);
        const tileY = Math.floor(gridPos.y);
        
        console.log(`Converted to grid coordinates: (${tileX}, ${tileY})`);
        
        // Validate grid coordinates are within map bounds
        if (tileX < 0 || tileX >= Config.MAP_WIDTH || tileY < 0 || tileY >= Config.MAP_HEIGHT) {
            console.log('Target position is outside map bounds');
            return;
        }
        
        // Convert grid coordinates to cartesian coordinates for server
        const cartesianX = tileX * Config.TILE_SIZE;
        const cartesianY = tileY * Config.TILE_SIZE;
        
        console.log(`Units moving to cartesian coordinates: (${cartesianX}, ${cartesianY})`);
        
        // Send movement command to server with cartesian coordinates
        this.multiplayer.moveUnits(selectedUnitIds, cartesianX, cartesianY);
        
        // Visual feedback
        this.renderer.addEffect('moveCommand', worldX, worldY);
    }
    
    /**
     * Get entity at a specific position
     */
    getEntityAtPosition(x, y) {
        console.log(`Looking for entity at isometric position: (${x.toFixed(2)}, ${y.toFixed(2)})`);
        
        // Check all entities to see if the point is within their bounds
        for (const entity of this.entities) {
            // Skip if entity is not rendered or doesn't have position data
            if (!entity.x || !entity.y || !entity.width || !entity.height) continue;
            
            // Need to convert the cartesian entity position to isometric for comparison
            const entityIsoX = (entity.x - entity.y) / 2;
            const entityIsoY = (entity.x + entity.y) / 4;
            
            // Calculate entity bounds in isometric coordinates
            // We need to adjust the bounds as the isometric shape is different
            const margin = 30; // Give some margin for click precision
            const entityLeft = entityIsoX - margin;
            const entityRight = entityIsoX + entity.width + margin;
            const entityTop = entityIsoY - margin;
            const entityBottom = entityIsoY + entity.height + margin;
            
            // Check if the point is within the entity bounds
            if (x >= entityLeft && x <= entityRight && y >= entityTop && y <= entityBottom) {
                console.log(`Found entity: ${entity.id}, type: ${entity instanceof Unit ? 'Unit' : 'Building'}, owner: ${entity.playerId}`);
                return entity;
            }
        }
        
        console.log('No entity found at this position');
        return null;
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

    /**
     * Get entity by ID
     */
    getEntityById(entityId) {
        return this.entities.find(entity => entity.id === entityId);
    }

    /**
     * Remove entity from game
     */
    removeEntity(entityId) {
        const index = this.entities.findIndex(entity => entity.id === entityId);
        if (index !== -1) {
            // Remove from selection if selected
            const selectedIndex = this.selectedEntities.findIndex(entity => entity.id === entityId);
            if (selectedIndex !== -1) {
                this.selectedEntities.splice(selectedIndex, 1);
            }
            
            // Remove from entities array
            this.entities.splice(index, 1);
            console.log(`Removed entity ${entityId} from game`);
            return true;
        }
        return false;
    }
} 