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
        
        // Preload unit images
        this.preloadUnitImages();
    }
    
    /**
     * Preload unit images for different player colors
     */
    preloadUnitImages() {
        // Preload soldier images for each player color
        Config.PLAYER_COLORS.forEach(color => {
            const img = new Image();
            img.src = `/images/units/${color}_soldier.svg`;
        });
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
        // Calculate visible tile range based on camera position and zoom
        const startCol = Math.floor(this.camera.x / Config.TILE_SIZE);
        const endCol = Math.min(
            startCol + Math.ceil((this.camera.width / this.camera.zoom) / Config.TILE_SIZE) + 1,
            Config.MAP_WIDTH
        );
        
        const startRow = Math.floor(this.camera.y / Config.TILE_SIZE);
        const endRow = Math.min(
            startRow + Math.ceil((this.camera.height / this.camera.zoom) / Config.TILE_SIZE) + 1,
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
                
                // Calculate tile size with zoom
                const tileSize = Config.TILE_SIZE * this.camera.zoom;
                
                // Draw the tile
                this.ctx.fillStyle = this.getTileColor(tile.type);
                this.ctx.fillRect(
                    screenPos.x,
                    screenPos.y,
                    tileSize,
                    tileSize
                );
                
                // Draw grid lines if enabled
                if (Config.SHOW_GRID) {
                    this.ctx.strokeStyle = Config.COLORS.GRID;
                    this.ctx.strokeRect(
                        screenPos.x,
                        screenPos.y,
                        tileSize,
                        tileSize
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
            
            // Calculate entity size with zoom
            const width = entity.width * this.camera.zoom;
            const height = entity.height * this.camera.zoom;
            
            // Draw the entity based on its type
            if (entity instanceof Unit) {
                this.renderUnit(entity, screenPos, width, height);
            } else {
                // Fallback for other entity types
                this.ctx.fillStyle = entity.isPlayerControlled ? 
                    Config.COLORS.PLAYER_UNIT : Config.COLORS.ENEMY_UNIT;
                    
                this.ctx.fillRect(
                    screenPos.x,
                    screenPos.y,
                    width,
                    height
                );
            }
            
            // Draw selection highlight if entity is selected
            if (entity.isSelected) {
                this.ctx.strokeStyle = Config.COLORS.SELECTION;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    screenPos.x - 2,
                    screenPos.y - 2,
                    width + 4,
                    height + 4
                );
                this.ctx.lineWidth = 1;
            }
        }
    }
    
    /**
     * Render a unit with its image and health bar
     */
    renderUnit(unit, screenPos, width, height) {
        // Draw unit image if available
        if (unit.image && unit.image.complete) {
            this.ctx.drawImage(
                unit.image,
                screenPos.x,
                screenPos.y,
                width,
                height
            );
        } else {
            // Fallback to colored rectangle if image not loaded
            this.ctx.fillStyle = unit.isPlayerControlled ? 
                Config.COLORS.PLAYER_UNIT : Config.COLORS.ENEMY_UNIT;
                
            this.ctx.fillRect(
                screenPos.x,
                screenPos.y,
                width,
                height
            );
        }
        
        // Draw health bar
        const healthBarWidth = width;
        const healthBarHeight = 4 * this.camera.zoom;
        const healthPercentage = unit.health / unit.maxHealth;
        
        // Health bar background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(
            screenPos.x,
            screenPos.y - healthBarHeight - 2,
            healthBarWidth,
            healthBarHeight
        );
        
        // Health bar fill
        this.ctx.fillStyle = this.getHealthColor(healthPercentage);
        this.ctx.fillRect(
            screenPos.x,
            screenPos.y - healthBarHeight - 2,
            healthBarWidth * healthPercentage,
            healthBarHeight
        );
        
        // Draw level indicator if level > 1
        if (unit.level > 1) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${10 * this.camera.zoom}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                unit.level.toString(),
                screenPos.x + width / 2,
                screenPos.y + height + 12 * this.camera.zoom
            );
        }
    }
    
    /**
     * Get color for health bar based on percentage
     */
    getHealthColor(percentage) {
        if (percentage > 0.6) {
            return 'rgb(0, 255, 0)'; // Green
        } else if (percentage > 0.3) {
            return 'rgb(255, 255, 0)'; // Yellow
        } else {
            return 'rgb(255, 0, 0)'; // Red
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
        
        // Render selected unit info
        this.renderSelectedUnitInfo();
    }
    
    /**
     * Render information about selected units
     */
    renderSelectedUnitInfo() {
        const selectedUnits = this.game.entities.filter(e => e.isSelected && e instanceof Unit);
        
        if (selectedUnits.length === 0) {
            return;
        }
        
        // If only one unit is selected, show detailed info
        if (selectedUnits.length === 1) {
            const unit = selectedUnits[0];
            const padding = 10;
            const lineHeight = 20;
            
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(
                this.canvas.width - 200 - padding,
                padding,
                200,
                150
            );
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'left';
            
            let y = padding + lineHeight;
            
            this.ctx.fillText(`Unit Type: ${unit.unitType}`, this.canvas.width - 190, y);
            y += lineHeight;
            
            this.ctx.fillText(`Level: ${unit.level}`, this.canvas.width - 190, y);
            y += lineHeight;
            
            this.ctx.fillText(`Health: ${unit.health}/${unit.maxHealth}`, this.canvas.width - 190, y);
            y += lineHeight;
            
            this.ctx.fillText(`Attack: ${unit.attackDamage}`, this.canvas.width - 190, y);
            y += lineHeight;
            
            this.ctx.fillText(`Range: ${unit.attackRange}`, this.canvas.width - 190, y);
            y += lineHeight;
            
            this.ctx.fillText(`Speed: ${unit.speed}`, this.canvas.width - 190, y);
            y += lineHeight;
            
            if (unit.level < 10) { // Max level cap
                const expNeeded = unit.level * 100;
                this.ctx.fillText(`XP: ${unit.experience}/${expNeeded}`, this.canvas.width - 190, y);
            }
        } else {
            // If multiple units are selected, show count
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(
                this.canvas.width - 200 - 10,
                10,
                200,
                40
            );
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                `${selectedUnits.length} units selected`,
                this.canvas.width - 110,
                35
            );
        }
    }
    
    /**
     * Render debug information
     */
    renderDebugInfo() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        // Display FPS
        this.ctx.fillText(`FPS: ${this.game.fps.toFixed(1)}`, 10, 20);
        
        // Display camera position
        this.ctx.fillText(`Camera: (${this.camera.x.toFixed(0)}, ${this.camera.y.toFixed(0)})`, 10, 40);
        
        // Display zoom level
        this.ctx.fillText(`Zoom: ${(this.camera.zoom * 100).toFixed(0)}%`, 10, 60);
        
        // Display entity count
        this.ctx.fillText(`Entities: ${this.game.entities.length}`, 10, 80);
        
        // Display selected entities count
        const selectedCount = this.game.entities.filter(e => e.isSelected).length;
        this.ctx.fillText(`Selected: ${selectedCount}`, 10, 100);
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.canvas.width = Config.CANVAS_WIDTH;
        this.canvas.height = Config.CANVAS_HEIGHT;
    }
} 