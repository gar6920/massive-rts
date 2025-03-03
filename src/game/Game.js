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
        // Connect to multiplayer server
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
        
        // Update all entities
        for (const entity of this.entities) {
            entity.update(deltaTime, this);
        }
    }
    
    /**
     * Handle entity selection
     */
    handleEntitySelection(worldX, worldY) {
        let entitySelected = false;
        
        // Deselect all entities first
        for (const entity of this.entities) {
            entity.isSelected = false;
        }
        this.selectedEntities = [];
        
        // Check if any entity was clicked
        for (const entity of this.entities) {
            if (
                worldX >= entity.x &&
                worldX <= entity.x + entity.width &&
                worldY >= entity.y &&
                worldY <= entity.y + entity.height
            ) {
                // Only select entities that belong to the player
                if (entity.playerId !== this.multiplayer.playerId) {
                    continue;
                }
                
                // Select this entity
                entity.isSelected = true;
                this.selectedEntities.push(entity);
                entitySelected = true;
                break; // Only select one entity for now
            }
        }
        
        // If no entity was selected, this might be a map click
        if (!entitySelected) {
            // Get the tile at this position
            const tileX = Math.floor(worldX / Config.TILE_SIZE);
            const tileY = Math.floor(worldY / Config.TILE_SIZE);
            console.log(`Clicked on tile: (${tileX}, ${tileY})`);
        }
    }
    
    /**
     * Select entities within a box
     */
    selectEntitiesInBox(startX, startY, endX, endY) {
        // Deselect all entities first
        for (const entity of this.entities) {
            entity.isSelected = false;
        }
        this.selectedEntities = [];
        
        // Calculate selection rectangle
        const selectionRect = {
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY)
        };
        
        // Select all entities within the selection rectangle
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
            }
        }
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
            }
        }
    }
    
    /**
     * Handle command (right-click)
     */
    handleCommand(worldX, worldY) {
        if (this.selectedEntities.length === 0) return;

        // Get IDs of selected units for multiplayer
        const selectedUnitIds = this.selectedEntities
            .filter(entity => entity instanceof Unit)
            .map(entity => entity.id);
        
        if (selectedUnitIds.length > 0) {
            // Send movement command to server
            this.multiplayer.moveUnits(selectedUnitIds, worldX, worldY);
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
} 