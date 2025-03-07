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
        
        // Isometric tile dimensions
        this.tileWidth = Config.TILE_SIZE;
        this.tileHeight = Config.TILE_SIZE / 2;
        
        // Preload images
        this.preloadImages();
        
        // Track loaded images
        this.imagesLoaded = false;
        this.checkImagesLoaded();
        
        this.effects = []; // Array to store visual effects
    }
    
    /**
     * Check if all images are loaded
     */
    checkImagesLoaded() {
        // Check if all tile images are loaded
        const allImagesLoaded = Object.values(this.map.tileImages).every(img => img.complete);
        
        if (allImagesLoaded) {
            this.imagesLoaded = true;
            console.log('All images loaded successfully');
        } else {
            // Check again in 100ms
            setTimeout(() => this.checkImagesLoaded(), 100);
        }
    }
    
    /**
     * Preload any additional images needed for rendering
     */
    preloadImages() {
        // Preload unit and building images here if needed
        // For now, we're just using the tile images preloaded by the Map class
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Main render method - called each frame
     */
    render() {
        this.clear();
        
        // Render map
        this.renderMap();
        
        // Render entities
        this.renderEntities();
        
        // Render visual effects
        this.renderEffects(this.ctx);
        
        // Render UI
        this.renderUI();
    }
    
    /**
     * Convert grid coordinates to screen coordinates
     */
    gridToScreen(col, row) {
        // Convert grid coordinates to isometric world coordinates
        const isoPos = this.map.gridToIso(col, row);
        
        // Convert world coordinates to screen coordinates
        return this.camera.worldToScreen(isoPos.x, isoPos.y);
    }
    
    /**
     * Render the map tiles
     */
    renderMap() {
        // Calculate visible tile range based on camera position and zoom
        // For isometric view, we need a different approach to determine visible tiles
        
        // Convert camera position to grid coordinates
        const cameraWorldPos = {
            x: this.camera.x,
            y: this.camera.y
        };
        
        // Get the viewport dimensions in world coordinates
        const viewportWidth = this.camera.width / this.camera.zoom;
        const viewportHeight = this.camera.height / this.camera.zoom;
        
        // Calculate the viewport corners in world coordinates
        const viewportCorners = [
            { x: cameraWorldPos.x, y: cameraWorldPos.y }, // Top-left
            { x: cameraWorldPos.x + viewportWidth, y: cameraWorldPos.y }, // Top-right
            { x: cameraWorldPos.x, y: cameraWorldPos.y + viewportHeight }, // Bottom-left
            { x: cameraWorldPos.x + viewportWidth, y: cameraWorldPos.y + viewportHeight } // Bottom-right
        ];
        
        // Convert viewport corners to grid coordinates
        const gridCorners = viewportCorners.map(corner => this.map.isoToGrid(corner.x, corner.y));
        
        // Find the min and max grid coordinates that cover the viewport
        let minGridX = Math.floor(Math.min(...gridCorners.map(corner => corner.x)));
        let maxGridX = Math.ceil(Math.max(...gridCorners.map(corner => corner.x)));
        let minGridY = Math.floor(Math.min(...gridCorners.map(corner => corner.y)));
        let maxGridY = Math.ceil(Math.max(...gridCorners.map(corner => corner.y)));
        
        // Add a buffer to ensure we render tiles that are partially visible
        const buffer = 15;
        minGridX = Math.max(0, minGridX - buffer);
        minGridY = Math.max(0, minGridY - buffer);
        maxGridX = Math.min(this.map.width, maxGridX + buffer);
        maxGridY = Math.min(this.map.height, maxGridY + buffer);
        
        // Render tiles in the correct order for isometric view (back to front)
        // This ensures proper overlapping of tiles
        for (let sum = minGridX + minGridY; sum <= maxGridX + maxGridY; sum++) {
            for (let gridX = minGridX; gridX <= maxGridX; gridX++) {
                const gridY = sum - gridX;
                
                if (gridY < minGridY || gridY > maxGridY) continue;
                
                // Get the tile at this grid position
                const tile = this.map.getTile(gridX, gridY);
                if (!tile) continue;
                
                // Convert grid coordinates to isometric world coordinates
                const isoPos = this.map.gridToIso(gridX, gridY);
                
                // Convert world coordinates to screen coordinates
                const screenPos = this.camera.worldToScreen(isoPos.x, isoPos.y);
                
                // Calculate tile dimensions with zoom
                const tileWidthZoomed = this.tileWidth * this.camera.zoom;
                const tileHeightZoomed = this.tileHeight * this.camera.zoom;
                
                // Draw the tile
                if (this.imagesLoaded) {
                    // Use the appropriate tile image based on terrain type
                    const terrainType = tile.terrainType || tile.type;
                    const tileImage = this.map.getTileImage(terrainType);
                    
                    if (tileImage && tileImage.complete) {
                        // Draw the isometric tile image
                        this.ctx.drawImage(
                            tileImage,
                            screenPos.x - (tileWidthZoomed / 2), // Center the image horizontally
                            screenPos.y - (tileHeightZoomed / 2), // Center the image vertically
                            tileWidthZoomed,
                            tileHeightZoomed
                        );
                    } else {
                        // Fallback to colored diamond if image not loaded
                        this.drawIsometricTile(
                            screenPos.x,
                            screenPos.y,
                            tileWidthZoomed,
                            tileHeightZoomed,
                            this.getTileColor(tile.terrainType || tile.type)
                        );
                    }
                } else {
                    // Fallback to colored diamond if images not loaded yet
                    this.drawIsometricTile(
                        screenPos.x,
                        screenPos.y,
                        tileWidthZoomed,
                        tileHeightZoomed,
                        this.getTileColor(tile.terrainType || tile.type)
                    );
                }
                
                // Draw grid lines if enabled
                if (Config.SHOW_GRID) {
                    this.drawIsometricGrid(
                        screenPos.x,
                        screenPos.y,
                        tileWidthZoomed,
                        tileHeightZoomed
                    );
                }
            }
        }
    }
    
    /**
     * Draw an isometric tile (diamond shape)
     */
    drawIsometricTile(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        
        // Draw a diamond shape
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height / 2); // Top point
        this.ctx.lineTo(x + width / 2, y); // Right point
        this.ctx.lineTo(x, y + height / 2); // Bottom point
        this.ctx.lineTo(x - width / 2, y); // Left point
        this.ctx.closePath();
        
        this.ctx.fill();
    }
    
    /**
     * Draw isometric grid lines
     */
    drawIsometricGrid(x, y, width, height) {
        this.ctx.strokeStyle = Config.COLORS.GRID;
        this.ctx.lineWidth = 1;
        
        // Draw a diamond shape
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height / 2); // Top point
        this.ctx.lineTo(x + width / 2, y); // Right point
        this.ctx.lineTo(x, y + height / 2); // Bottom point
        this.ctx.lineTo(x - width / 2, y); // Left point
        this.ctx.closePath();
        
        this.ctx.stroke();
    }
    
    /**
     * Get the color for a tile type
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
        // Sort entities by their y-coordinate for proper depth ordering in isometric view
        const sortedEntities = [...this.game.entities].sort((a, b) => a.y - b.y);
        
        for (const entity of sortedEntities) {
            if (!this.camera.isVisible(entity.x, entity.y, entity.width, entity.height)) {
                continue; // Skip this entity and move to the next one
            }
            
            let screenPos;
            
            if (entity instanceof Building) {
                // For buildings, use the grid-based conversion
                // Convert entity position to grid coordinates
                const gridX = Math.floor(entity.x / Config.TILE_SIZE);
                const gridY = Math.floor(entity.y / Config.TILE_SIZE);
                
                // Convert grid coordinates to isometric world coordinates
                const isoPos = this.map.gridToIso(gridX, gridY);
                
                // Convert world coordinates to screen coordinates
                screenPos = this.camera.worldToScreen(isoPos.x, isoPos.y);
            } else {
                // For units, use the direct Cartesian-to-isometric conversion
                const isoX = (entity.x - entity.y) / 2;
                const isoY = (entity.x + entity.y) / 4;
                
                // Convert to screen coordinates
                screenPos = this.camera.worldToScreen(isoX, isoY);
            }
            
            // Calculate entity dimensions with zoom
            const entityWidth = entity.width * this.camera.zoom;
            const entityHeight = entity.height * this.camera.zoom;
            
            // Render the entity based on its type
            if (entity instanceof Unit) {
                this.renderUnit(entity, screenPos, entityWidth, entityHeight);
            } else if (entity instanceof Building) {
                this.renderBuilding(entity, screenPos, entityWidth, entityHeight);
            }
        }
    }
    
    /**
     * Render a unit with its image and health bar
     */
    renderUnit(unit, screenPos, width, height) {
        // Debug logging for selection
        if (unit.isSelected) {
            console.log(`Rendering selected unit: ${unit.id}, isPlayerControlled: ${unit.isPlayerControlled}, playerId: ${unit.playerId}, position: (${screenPos.x}, ${screenPos.y})`);
        }
        
        // Draw unit image if available
        if (unit.image && unit.image.complete) {
            console.log(`Rendering unit image: ${unit.unitType} at (${screenPos.x}, ${screenPos.y}), size: ${width}x${height}`);
            this.ctx.drawImage(
                unit.image,
                screenPos.x - width / 2,
                screenPos.y - height / 2,
                width,
                height
            );
        } else {
            // Fallback to colored rectangle if image not loaded
            console.log(`Fallback rendering for unit: ${unit.unitType} at (${screenPos.x}, ${screenPos.y})`);
            this.ctx.fillStyle = unit.isPlayerControlled ? 
                Config.COLORS.PLAYER_UNIT : Config.COLORS.ENEMY_UNIT;
                
            this.ctx.fillRect(
                screenPos.x - width / 2,
                screenPos.y - height / 2,
                width,
                height
            );
        }
        
        // Draw red "X" over the unit if it's destroyed (dead)
        if (unit.isDestroyed) {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 4 * this.camera.zoom;
            this.ctx.beginPath();
            this.ctx.moveTo(screenPos.x - width / 2, screenPos.y - height / 2);
            this.ctx.lineTo(screenPos.x + width / 2, screenPos.y + height / 2);
            this.ctx.moveTo(screenPos.x + width / 2, screenPos.y - height / 2);
            this.ctx.lineTo(screenPos.x - width / 2, screenPos.y + height / 2);
            this.ctx.stroke();
        }
        
        // Draw selection indicator if unit is selected AND belongs to the player
        if (unit.isSelected && unit.playerId === this.game.playerId) {
            console.log(`Drawing selection indicator for unit ${unit.id} at (${screenPos.x}, ${screenPos.y}) with radius ${(width / 2) + 5 * this.camera.zoom}`);
            
            // Draw a glowing selection circle around the unit
            this.ctx.strokeStyle = Config.COLORS.SELECTION || '#00ff00';
            this.ctx.lineWidth = 2 * this.camera.zoom;
            
            // Draw circle around unit
            this.ctx.beginPath();
            this.ctx.arc(
                screenPos.x,
                screenPos.y,
                (width / 2) + 5 * this.camera.zoom,
                0,
                Math.PI * 2
            );
            this.ctx.stroke();
            
            // Add a semi-transparent fill for better visibility
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.beginPath();
            this.ctx.arc(
                screenPos.x,
                screenPos.y,
                (width / 2) + 5 * this.camera.zoom,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            console.log(`Selection indicator drawn with color ${Config.COLORS.SELECTION}`);
        }
        
        // Draw health bar only if the unit is not destroyed
        if (!unit.isDestroyed) {
            const healthBarWidth = width;
            const healthBarHeight = 4 * this.camera.zoom;
            const healthPercentage = unit.health / unit.maxHealth;
            
            // Health bar background
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(
                screenPos.x - width / 2,
                screenPos.y - height / 2 - healthBarHeight - 2,
                healthBarWidth,
                healthBarHeight
            );
            
            // Health bar fill
            this.ctx.fillStyle = this.getHealthColor(healthPercentage);
            this.ctx.fillRect(
                screenPos.x - width / 2,
                screenPos.y - height / 2 - healthBarHeight - 2,
                healthBarWidth * healthPercentage,
                healthBarHeight
            );
        }
        
        // Draw level indicator if level > 1
        if (unit.level > 1) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = `${10 * this.camera.zoom}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                unit.level.toString(),
                screenPos.x,
                screenPos.y + height / 2 + 12 * this.camera.zoom
            );
        }
    }
    
    /**
     * Render a building with its image and health bar
     */
    renderBuilding(building, screenPos, width, height) {
        // Always draw a solid base rectangle first
        this.ctx.fillStyle = building.playerColor === 'red' ? 
            '#ff0000' : building.playerColor === 'blue' ? 
            '#0000ff' : '#888888';
            
        // Draw an isometric building base
        this.drawIsometricBuilding(
            screenPos.x,
            screenPos.y,
            width,
            height / 2, // Half height for isometric look
            this.ctx.fillStyle
        );
        
        // Draw building image if available
        if (building.image && building.image.complete) {
            // For isometric view, we need to adjust the image position
            console.log(`Rendering building image: ${building.buildingType} at (${screenPos.x}, ${screenPos.y}), size: ${width}x${height}`);
            this.ctx.drawImage(
                building.image,
                screenPos.x - width / 2,
                screenPos.y - height / 2,
                width,
                height
            );
        } else {
            console.log(`Fallback rendering for building: ${building.buildingType} at (${screenPos.x}, ${screenPos.y})`);
        }
        
        // Draw health bar
        const healthPercentage = building.health / building.maxHealth;
        const healthBarWidth = width;
        const healthBarHeight = 5 * this.camera.zoom;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(
            screenPos.x - width / 2,
            screenPos.y - height / 2 - healthBarHeight - 2,
            healthBarWidth,
            healthBarHeight
        );
        
        // Health
        this.ctx.fillStyle = this.getHealthColor(healthPercentage);
        this.ctx.fillRect(
            screenPos.x - width / 2,
            screenPos.y - height / 2 - healthBarHeight - 2,
            healthBarWidth * healthPercentage,
            healthBarHeight
        );
        
        // Determine the label based on player color
        let baseLabel = building.buildingType;
        if (building.buildingType === 'BASE') {
            baseLabel = building.playerColor === 'blue' ? 'Human Base' : 'AI Base';
        }
        
        // Draw building type text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${12 * this.camera.zoom}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            baseLabel,
            screenPos.x,
            screenPos.y
        );
    }
    
    /**
     * Draw an isometric building
     */
    drawIsometricBuilding(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        
        // Draw a 3D isometric building
        // Top face (roof)
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - height); // Top point
        this.ctx.lineTo(x + width / 2, y - height / 2); // Right point
        this.ctx.lineTo(x, y); // Bottom point
        this.ctx.lineTo(x - width / 2, y - height / 2); // Left point
        this.ctx.closePath();
        this.ctx.fill();
        
        // Right face
        this.ctx.beginPath();
        this.ctx.moveTo(x, y); // Top-left
        this.ctx.lineTo(x + width / 2, y - height / 2); // Top-right
        this.ctx.lineTo(x + width / 2, y + height / 2); // Bottom-right
        this.ctx.lineTo(x, y + height); // Bottom-left
        this.ctx.closePath();
        // Darken the right face
        this.ctx.fillStyle = this.darkenColor(color, 0.7);
        this.ctx.fill();
        
        // Left face
        this.ctx.beginPath();
        this.ctx.moveTo(x, y); // Top-right
        this.ctx.lineTo(x - width / 2, y - height / 2); // Top-left
        this.ctx.lineTo(x - width / 2, y + height / 2); // Bottom-left
        this.ctx.lineTo(x, y + height); // Bottom-right
        this.ctx.closePath();
        // Darken the left face more
        this.ctx.fillStyle = this.darkenColor(color, 0.5);
        this.ctx.fill();
    }
    
    /**
     * Darken a color by a factor
     */
    darkenColor(color, factor) {
        // Convert hex to RGB
        let r, g, b;
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (color.startsWith('rgb')) {
            const match = color.match(/\d+/g);
            r = parseInt(match[0]);
            g = parseInt(match[1]);
            b = parseInt(match[2]);
        } else {
            return color; // Can't darken
        }
        
        // Darken
        r = Math.floor(r * factor);
        g = Math.floor(g * factor);
        b = Math.floor(b * factor);
        
        // Convert back to hex
        return `rgb(${r}, ${g}, ${b})`;
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
        // Render elapsed time at the top of the screen
        this.renderElapsedTime();
        
        // Render selection box if dragging
        const selectionBox = this.game.inputHandler.getSelectionBox();
        if (selectionBox) {
            // Semi-transparent fill
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
            this.ctx.fillRect(
                selectionBox.x,
                selectionBox.y,
                selectionBox.width,
                selectionBox.height
            );
            
            // Selection box border
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                selectionBox.x,
                selectionBox.y,
                selectionBox.width,
                selectionBox.height
            );
        }
        
        // Render minimap
        this.renderMinimap();
        
        // Render selected unit info
        this.renderSelectedUnitInfo();
        
        // Render debug info if enabled
        if (Config.DEBUG_MODE) {
            this.renderDebugInfo();
        }
    }
    
    /**
     * Render the elapsed time since the server started
     */
    renderElapsedTime() {
        const elapsedTime = this.game.multiplayer.getElapsedTime();
        
        // Set up text style
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        
        // Draw background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(this.canvas.width / 2 - 80, 10, 160, 30);
        
        // Draw text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`Time Elapsed: ${elapsedTime}`, this.canvas.width / 2, 30);
    }
    
    /**
     * Render the minimap
     */
    renderMinimap() {
        const minimapElement = document.getElementById('minimap');
        if (!minimapElement) return;
        
        // Create a canvas for the minimap if it doesn't exist
        if (!this.minimapCanvas) {
            this.minimapCanvas = document.createElement('canvas');
            this.minimapCanvas.width = 180; // Slightly smaller than the container
            this.minimapCanvas.height = 180;
            this.minimapCtx = this.minimapCanvas.getContext('2d');
            minimapElement.appendChild(this.minimapCanvas);
        }
        
        // Clear the minimap
        this.minimapCtx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
        
        // Calculate the isometric map dimensions
        const isoMapWidth = (this.map.width + this.map.height) * (Config.TILE_SIZE / 2);
        const isoMapHeight = (this.map.width + this.map.height) * (Config.TILE_SIZE / 4);
        
        // Calculate scale factors for the minimap
        const scaleX = this.minimapCanvas.width / isoMapWidth;
        const scaleY = this.minimapCanvas.height / isoMapHeight;
        
        // Use the smaller scale to maintain aspect ratio
        const scale = Math.min(scaleX, scaleY) * 0.8; // 80% to leave some margin
        
        // Calculate offsets to center the map in the minimap
        const offsetX = this.minimapCanvas.width / 2;
        const offsetY = this.minimapCanvas.height / 4;
        
        // Draw map tiles on minimap
        // Render in the correct order for isometric view (back to front)
        for (let sum = 0; sum < this.map.width + this.map.height; sum++) {
            for (let gridX = 0; gridX < this.map.width; gridX++) {
                const gridY = sum - gridX;
                
                if (gridY < 0 || gridY >= this.map.height) continue;
                
                const tile = this.map.getTile(gridX, gridY);
                if (!tile) continue;
                
                // Convert to isometric coordinates
                const isoPos = this.map.gridToIso(gridX, gridY);
                
                // Scale and position for minimap
                const x = offsetX + isoPos.x * scale;
                const y = offsetY + isoPos.y * scale;
                
                // Draw a small diamond for each tile
                this.minimapCtx.fillStyle = this.getTileColor(tile.terrainType || tile.type);
                this.minimapCtx.beginPath();
                this.minimapCtx.moveTo(x, y - 2); // Top
                this.minimapCtx.lineTo(x + 2, y); // Right
                this.minimapCtx.lineTo(x, y + 2); // Bottom
                this.minimapCtx.lineTo(x - 2, y); // Left
                this.minimapCtx.closePath();
                this.minimapCtx.fill();
            }
        }
        
        // Draw entities on minimap
        for (const entity of this.game.entities) {
            // Convert entity position to grid coordinates
            const gridX = Math.floor(entity.x / Config.TILE_SIZE);
            const gridY = Math.floor(entity.y / Config.TILE_SIZE);
            
            // Convert to isometric coordinates
            const isoPos = this.map.gridToIso(gridX, gridY);
            
            // Scale and position for minimap
            const x = offsetX + isoPos.x * scale;
            const y = offsetY + isoPos.y * scale;
            
            // Draw a dot for each entity
            this.minimapCtx.fillStyle = entity.playerColor === 'blue' ? 
                Config.COLORS.PLAYER_UNIT : Config.COLORS.ENEMY_UNIT;
            
            this.minimapCtx.beginPath();
            this.minimapCtx.arc(x, y, 2, 0, Math.PI * 2);
            this.minimapCtx.fill();
        }
        
        // Draw camera viewport rectangle
        // Calculate the four corners of the viewport in world coordinates
        const viewportCorners = [
            { x: this.camera.x, y: this.camera.y }, // Top-left
            { x: this.camera.x + this.camera.width / this.camera.zoom, y: this.camera.y }, // Top-right
            { x: this.camera.x, y: this.camera.y + this.camera.height / this.camera.zoom }, // Bottom-left
            { x: this.camera.x + this.camera.width / this.camera.zoom, y: this.camera.y + this.camera.height / this.camera.zoom } // Bottom-right
        ];
        
        // Convert viewport corners to grid coordinates
        const gridCorners = viewportCorners.map(corner => this.map.isoToGrid(corner.x, corner.y));
        
        // Convert back to isometric for minimap and scale
        const minimapCorners = gridCorners.map(gridPos => {
            const isoPos = this.map.gridToIso(gridPos.x, gridPos.y);
            return {
                x: offsetX + isoPos.x * scale,
                y: offsetY + isoPos.y * scale
            };
        });
        
        // Draw viewport outline
        this.minimapCtx.strokeStyle = 'white';
        this.minimapCtx.lineWidth = 1.5;
        this.minimapCtx.beginPath();
        this.minimapCtx.moveTo(minimapCorners[0].x, minimapCorners[0].y);
        this.minimapCtx.lineTo(minimapCorners[1].x, minimapCorners[1].y);
        this.minimapCtx.lineTo(minimapCorners[3].x, minimapCorners[3].y);
        this.minimapCtx.lineTo(minimapCorners[2].x, minimapCorners[2].y);
        this.minimapCtx.closePath();
        this.minimapCtx.stroke();
    }
    
    /**
     * Render information about selected units
     */
    renderSelectedUnitInfo() {
        const selectedUnits = this.game.entities.filter(e => e.isSelected && e instanceof Unit);
        
        if (selectedUnits.length === 0) {
            return;
        }
        
        // Only show info for the first selected unit
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
        
        // Display isometric rendering info
        this.ctx.fillText(`Isometric Mode: Active`, 10, 120);
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        this.canvas.width = Config.CANVAS_WIDTH;
        this.canvas.height = Config.CANVAS_HEIGHT;
    }

    /**
     * Add a visual effect at a specified position
     */
    addEffect(type, x, y) {
        const effect = {
            type,
            x,
            y,
            startTime: Date.now(),
            duration: 1000 // Default duration 1 second
        };
        
        // Customize effect based on type
        switch (type) {
            case 'moveCommand':
                effect.duration = 800;
                effect.color = 'green';
                effect.size = 20;
                break;
            case 'attackCommand':
                effect.duration = 1000;
                effect.color = '#ff3333'; // Bright red
                effect.size = 25; // Larger size
                break;
            case 'attack':
                effect.duration = 500;
                effect.color = 'orange';
                effect.size = 15;
                break;
            case 'explosion':
                effect.duration = 1200;
                effect.color = 'red';
                effect.size = 30;
                break;
            default:
                effect.color = 'white';
                effect.size = 10;
        }
        
        this.effects.push(effect);
    }

    /**
     * Update and render visual effects
     */
    renderEffects(ctx) {
        const now = Date.now();
        const camera = this.game.camera;
        
        // Update and render each effect
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            const elapsed = now - effect.startTime;
            
            // Remove expired effects
            if (elapsed > effect.duration) {
                this.effects.splice(i, 1);
                continue;
            }
            
            // Calculate progress (0 to 1)
            const progress = elapsed / effect.duration;
            
            // Get screen position
            const screenPos = camera.worldToScreen(effect.x, effect.y);
            
            // Render based on effect type
            switch (effect.type) {
                case 'moveCommand':
                    this.renderMoveCommandEffect(ctx, screenPos, effect, progress);
                    break;
                case 'attackCommand':
                    this.renderAttackCommandEffect(ctx, screenPos, effect, progress);
                    break;
                case 'attack':
                    this.renderAttackEffect(ctx, screenPos, effect, progress);
                    break;
                case 'explosion':
                    this.renderExplosionEffect(ctx, screenPos, effect, progress);
                    break;
                default:
                    this.renderDefaultEffect(ctx, screenPos, effect, progress);
            }
        }
    }

    /**
     * Render a move command effect
     */
    renderMoveCommandEffect(ctx, screenPos, effect, progress) {
        // Draw a circle that fades out
        ctx.globalAlpha = 1 - progress;
        ctx.beginPath();
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 2;
        
        // Circle expands outward
        const size = effect.size * (1 + progress);
        ctx.arc(screenPos.x, screenPos.y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Reset alpha
        ctx.globalAlpha = 1;
    }

    /**
     * Render an attack command effect
     */
    renderAttackCommandEffect(ctx, screenPos, effect, progress) {
        // Draw a red circle that fades out
        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 3;
        
        // Circle grows slightly
        const size = effect.size * (1 + progress * 0.5);
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner circle (target-like pattern)
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Reset alpha
        ctx.globalAlpha = 1;
    }

    /**
     * Render an attack effect
     */
    renderAttackEffect(ctx, screenPos, effect, progress) {
        // Draw spark/hit effect
        ctx.globalAlpha = 1 - progress;
        
        // Particles radiating outward
        const particleCount = 8;
        const size = effect.size * progress;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const x = screenPos.x + Math.cos(angle) * size;
            const y = screenPos.y + Math.sin(angle) * size;
            
            ctx.beginPath();
            ctx.fillStyle = effect.color;
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Reset alpha
        ctx.globalAlpha = 1;
    }

    /**
     * Render an explosion effect
     */
    renderExplosionEffect(ctx, screenPos, effect, progress) {
        // Draw explosion effect
        ctx.globalAlpha = 1 - progress;
        
        // Outer ring
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
        ctx.arc(screenPos.x, screenPos.y, effect.size * progress * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner ring
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 200, 0, 0.7)';
        ctx.arc(screenPos.x, screenPos.y, effect.size * progress, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset alpha
        ctx.globalAlpha = 1;
    }

    /**
     * Render a default effect
     */
    renderDefaultEffect(ctx, screenPos, effect, progress) {
        // Simple fadeout circle
        ctx.globalAlpha = 1 - progress;
        ctx.beginPath();
        ctx.fillStyle = effect.color;
        ctx.arc(screenPos.x, screenPos.y, effect.size * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
} 