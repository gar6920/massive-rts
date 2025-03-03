/**
 * Handles all rendering operations for the game
 */
class Renderer {
    /**
     * Initialize the renderer
     */
    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.ctx = game.ctx;
        this.camera = game.camera;
        this.map = game.map;
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Render the entire game scene
     */
    render() {
        this.clear();
        
        // Render map tiles
        this.renderMap();
        
        // Render entities (units, buildings)
        this.renderEntities();
        
        // Render UI elements
        this.renderUI();
        
        // Render debug information if enabled
        if (Config.DEBUG_MODE) {
            this.renderDebugInfo();
        }
    }
    
    /**
     * Render the map tiles
     */
    renderMap() {
        // Calculate visible tile range based on camera position
        const startCol = Math.floor(this.camera.x / Config.TILE_SIZE);
        const endCol = Math.min(
            startCol + Math.ceil(this.camera.width / Config.TILE_SIZE) + 1,
            Config.MAP_WIDTH
        );
        
        const startRow = Math.floor(this.camera.y / Config.TILE_SIZE);
        const endRow = Math.min(
            startRow + Math.ceil(this.camera.height / Config.TILE_SIZE) + 1,
            Config.MAP_HEIGHT
        );
        
        // Render only visible tiles
        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const tile = this.map.getTile(col, row);
                if (!tile) continue;
                
                const worldX = col * Config.TILE_SIZE;
                const worldY = row * Config.TILE_SIZE;
                
                // Convert world coordinates to screen coordinates
                const screenPos = this.camera.worldToScreen(worldX, worldY);
                
                // Draw the tile
                this.ctx.fillStyle = this.getTileColor(tile.type);
                this.ctx.fillRect(
                    screenPos.x,
                    screenPos.y,
                    Config.TILE_SIZE,
                    Config.TILE_SIZE
                );
                
                // Draw grid lines if enabled
                if (Config.SHOW_GRID) {
                    this.ctx.strokeStyle = Config.COLORS.GRID;
                    this.ctx.strokeRect(
                        screenPos.x,
                        screenPos.y,
                        Config.TILE_SIZE,
                        Config.TILE_SIZE
                    );
                }
            }
        }
    }
    
    /**
     * Get color for a tile type
     */
    getTileColor(tileType) {
        switch (tileType) {
            case 'grass': return Config.COLORS.GRASS;
            case 'water': return Config.COLORS.WATER;
            case 'sand': return Config.COLORS.SAND;
            case 'mountain': return Config.COLORS.MOUNTAIN;
            case 'forest': return Config.COLORS.FOREST;
            default: return Config.COLORS.GRASS;
        }
    }
    
    /**
     * Render all game entities
     */
    renderEntities() {
        // Render all entities that are in the visible area
        for (const entity of this.game.entities) {
            // Skip entities outside the visible area
            if (!this.camera.isVisible(
                entity.x,
                entity.y,
                entity.width,
                entity.height
            )) {
                continue;
            }
            
            // Convert world coordinates to screen coordinates
            const screenPos = this.camera.worldToScreen(entity.x, entity.y);
            
            // Draw the entity
            this.ctx.fillStyle = entity.isPlayerControlled ? 
                Config.COLORS.PLAYER_UNIT : Config.COLORS.ENEMY_UNIT;
                
            this.ctx.fillRect(
                screenPos.x,
                screenPos.y,
                entity.width,
                entity.height
            );
            
            // Draw selection highlight if entity is selected
            if (entity.isSelected) {
                this.ctx.strokeStyle = Config.COLORS.SELECTION;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    screenPos.x - 2,
                    screenPos.y - 2,
                    entity.width + 4,
                    entity.height + 4
                );
                this.ctx.lineWidth = 1;
            }
        }
    }
    
    /**
     * Render UI elements
     */
    renderUI() {
        // Render selection box if dragging
        const selectionBox = this.game.inputHandler.getSelectionBox();
        if (selectionBox) {
            this.ctx.strokeStyle = Config.COLORS.SELECTION;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                selectionBox.x,
                selectionBox.y,
                selectionBox.width,
                selectionBox.height
            );
            
            // Semi-transparent fill
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.fillRect(
                selectionBox.x,
                selectionBox.y,
                selectionBox.width,
                selectionBox.height
            );
        }
    }
    
    /**
     * Render debug information
     */
    renderDebugInfo() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        
        // Display FPS
        this.ctx.fillText(`FPS: ${this.game.fps.toFixed(1)}`, 10, 20);
        
        // Display camera position
        this.ctx.fillText(`Camera: (${this.camera.x.toFixed(0)}, ${this.camera.y.toFixed(0)})`, 10, 40);
        
        // Display entity count
        this.ctx.fillText(`Entities: ${this.game.entities.length}`, 10, 60);
        
        // Display selected entities count
        const selectedCount = this.game.entities.filter(e => e.isSelected).length;
        this.ctx.fillText(`Selected: ${selectedCount}`, 10, 80);
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.canvas.width = Config.CANVAS_WIDTH;
        this.canvas.height = Config.CANVAS_HEIGHT;
    }
} 