/**
 * Camera class for handling viewport and map navigation
 */
class Camera {
    /**
     * Initialize the camera
     */
    constructor() {
        // Camera position (top-left corner of the viewport in world coordinates)
        this.x = 0;
        this.y = 0;
        
        // Camera dimensions (viewport size)
        this.width = Config.CANVAS_WIDTH;
        this.height = Config.CANVAS_HEIGHT;
        
        // Camera zoom level
        this.zoom = Config.ZOOM_DEFAULT;
        
        // Calculate initial boundaries based on current map dimensions
        this.updateBoundaries();
        
        // We'll center on player units later when they're created
        // Don't call centerOnMap() here
        
        console.log(`Camera initialized at position (${this.x}, ${this.y}) with zoom ${this.zoom}`);
    }

    /**
     * Center the camera on the map
     */
    centerOnMap() {
        // Calculate the map dimensions in isometric coordinates
        const mapWidth = Config.MAP_WIDTH;
        const mapHeight = Config.MAP_HEIGHT;
        const tileSize = Config.TILE_SIZE;
        
        // Calculate the isometric map width and height
        const isoMapWidth = (mapWidth + mapHeight) * (tileSize / 2);
        const isoMapHeight = (mapWidth + mapHeight) * (tileSize / 4);
        
        // Calculate the center in grid coordinates
        const centerGridX = mapWidth / 2;
        const centerGridY = mapHeight / 2;
        
        // Convert to isometric coordinates
        const isoCenterX = (centerGridX - centerGridY) * (tileSize / 2);
        const isoCenterY = (centerGridX + centerGridY) * (tileSize / 4);
        
        // Calculate the viewport dimensions in world space
        const viewportWorldWidth = this.width / this.zoom;
        const viewportWorldHeight = this.height / this.zoom;
        
        // Set camera position to center on the map
        this.x = isoCenterX - (viewportWorldWidth / 2);
        this.y = isoCenterY - (viewportWorldHeight / 2);
        
        // Ensure camera stays within boundaries
        this.clampPosition();
        
        console.log(`Camera centered on map at (${this.x.toFixed(2)}, ${this.y.toFixed(2)})`);
    }

    /**
     * Update camera boundaries based on current map dimensions
     */
    updateBoundaries() {
        // For isometric view, we need to calculate boundaries differently
        const mapWidth = Config.MAP_WIDTH;
        const mapHeight = Config.MAP_HEIGHT;
        const tileSize = Config.TILE_SIZE;
        
        // Calculate the width and height of the isometric map in world coordinates
        // In isometric view, the map width is (mapWidth + mapHeight) * tileSize / 2
        // and the map height is (mapWidth + mapHeight) * tileSize / 4
        const isoMapWidth = (mapWidth + mapHeight) * (tileSize / 2);
        const isoMapHeight = (mapWidth + mapHeight) * (tileSize / 4);
        
        // Calculate the center in grid coordinates
        const centerGridX = mapWidth / 2;
        const centerGridY = mapHeight / 2;
        
        // Convert to isometric coordinates
        const isoCenterX = (centerGridX - centerGridY) * (tileSize / 2);
        const isoCenterY = (centerGridX + centerGridY) * (tileSize / 4);
        
        // Calculate the viewport dimensions in world space
        const viewportWorldWidth = this.width / this.zoom;
        const viewportWorldHeight = this.height / this.zoom;
        
        // Calculate maximum camera positions
        // We need to ensure the camera can't move so far that the map is off-screen
        // For isometric maps, we need more generous boundaries
        const extraPadding = Math.max(viewportWorldWidth, viewportWorldHeight) * 0.5;
        
        // Set more balanced boundaries
        // The key is to make the boundaries symmetrical around the map center
        this.maxX = isoCenterX + isoMapWidth/2 + extraPadding;
        this.maxY = isoCenterY + isoMapHeight/2 + extraPadding;
        this.minX = isoCenterX - isoMapWidth/2 - extraPadding;
        this.minY = isoCenterY - isoMapHeight/2 - extraPadding;
        
        console.log(`Camera boundaries updated: minX=${this.minX}, minY=${this.minY}, maxX=${this.maxX}, maxY=${this.maxY}`);
    }

    /**
     * Move the camera by the specified delta
     */
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.clampPosition();
    }

    /**
     * Set the camera position directly
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.clampPosition();
    }

    /**
     * Center the camera on a specific world position
     */
    centerOn(worldX, worldY) {
        // Calculate the position to center the camera on the given world coordinates
        this.x = worldX - (this.width / this.zoom / 2);
        this.y = worldY - (this.height / this.zoom / 2);
        
        // Ensure camera stays within map boundaries
        this.clampPosition();
    }

    /**
     * Ensure camera stays within map boundaries
     */
    clampPosition() {
        // For isometric view, we need to allow the camera to go slightly outside the map boundaries
        // to ensure the entire map is visible
        
        // Calculate the effective maximum positions based on viewport size
        // This ensures we can see the bottom of the map
        const viewportWidth = this.width / this.zoom;
        const viewportHeight = this.height / this.zoom;
        
        // Calculate effective boundaries
        // For the max boundaries, we need to subtract the viewport size to ensure
        // we can pan all the way to the bottom/right edges
        const effectiveMinX = this.minX;
        const effectiveMinY = this.minY;
        const effectiveMaxX = Math.max(0, this.maxX - viewportWidth);
        const effectiveMaxY = Math.max(0, this.maxY - viewportHeight);
        
        // Clamp camera position to stay within map boundaries
        this.x = Math.max(effectiveMinX, Math.min(this.x, effectiveMaxX));
        this.y = Math.max(effectiveMinY, Math.min(this.y, effectiveMaxY));
        
        console.log(`Camera position clamped to (${this.x}, ${this.y})`);
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX - this.x) * this.zoom,
            y: (worldY - this.y) * this.zoom
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX / this.zoom) + this.x,
            y: (screenY / this.zoom) + this.y
        };
    }

    /**
     * Check if a world position is visible on screen
     */
    isVisible(worldX, worldY, width, height) {
        return (
            worldX + width > this.x &&
            worldX < this.x + (this.width / this.zoom) &&
            worldY + height > this.y &&
            worldY < this.y + (this.height / this.zoom)
        );
    }

    /**
     * Update camera dimensions when window is resized or map dimensions change
     */
    updateDimensions() {
        // Update viewport dimensions
        this.width = Config.CANVAS_WIDTH;
        this.height = Config.CANVAS_HEIGHT;
        
        // Update boundaries based on current map dimensions
        this.updateBoundaries();
        
        // Ensure camera position is still valid
        this.clampPosition();
        
        console.log(`Camera dimensions updated: width=${this.width}, height=${this.height}, map=${Config.MAP_WIDTH}x${Config.MAP_HEIGHT}`);
    }

    /**
     * Zoom at a specific point (mouse position)
     * @param {number} deltaZoom - Amount to change zoom by
     * @param {number} clientX - Mouse X position in screen coordinates
     * @param {number} clientY - Mouse Y position in screen coordinates
     */
    zoomAt(deltaZoom, clientX, clientY) {
        // Store the world point that we're zooming at
        const worldPoint = this.screenToWorld(clientX, clientY);
        const worldX = worldPoint.x;
        const worldY = worldPoint.y;
        
        // Store the old zoom value
        const oldZoom = this.zoom;
        
        // Update zoom level with constraints
        this.zoom += deltaZoom;
        this.zoom = Math.max(Config.ZOOM_MIN, Math.min(Config.ZOOM_MAX, this.zoom));
        
        // If zoom didn't actually change, exit early
        if (this.zoom === oldZoom) return;
        
        // Calculate new camera position to keep the mouse point fixed in world space
        const mouseXRatio = clientX / this.width;
        const mouseYRatio = clientY / this.height;
        
        // Calculate the viewport dimensions in world space
        const viewportWorldWidth = this.width / this.zoom;
        const viewportWorldHeight = this.height / this.zoom;
        
        // Set the new camera position
        this.x = worldX - (mouseXRatio * viewportWorldWidth);
        this.y = worldY - (mouseYRatio * viewportWorldHeight);
        
        // Ensure camera stays within boundaries
        this.clampPosition();
        
        console.log(`Zoomed to ${this.zoom.toFixed(2)} at world point (${worldX.toFixed(2)}, ${worldY.toFixed(2)})`);
    }

    /**
     * Center the camera on player units
     * @param {Array} entities - All game entities
     * @param {string} playerId - The current player's ID
     */
    centerOnPlayerUnits(entities, playerId) {
        if (!entities || entities.length === 0) {
            console.log("No entities to center on, centering on map instead");
            this.centerOnMap();
            return;
        }
        
        // Find player-controlled units
        const playerUnits = entities.filter(entity => 
            entity.playerId === playerId && 
            entity.type === 'UNIT'
        );
        
        // If no player units found, try to find player base
        if (playerUnits.length === 0) {
            const playerBase = entities.find(entity => 
                entity.playerId === playerId && 
                entity.type === 'BUILDING' && 
                entity.buildingType === 'BASE'
            );
            
            if (playerBase) {
                console.log(`Centering camera on player base at (${playerBase.x}, ${playerBase.y})`);
                this.centerOn(playerBase.x + playerBase.width/2, playerBase.y + playerBase.height/2);
                
                // Zoom in a bit to focus on the base
                this.zoom = Config.ZOOM_DEFAULT * 1.2;
                this.clampPosition();
                return;
            }
        } else {
            // Calculate average position of all player units
            let avgX = 0;
            let avgY = 0;
            
            playerUnits.forEach(unit => {
                avgX += unit.x;
                avgY += unit.y;
            });
            
            avgX /= playerUnits.length;
            avgY /= playerUnits.length;
            
            console.log(`Centering camera on ${playerUnits.length} player units at (${avgX}, ${avgY})`);
            this.centerOn(avgX, avgY);
            
            // Zoom in a bit to focus on the units
            this.zoom = Config.ZOOM_DEFAULT * 1.2;
            this.clampPosition();
            return;
        }
        
        // Fallback to centering on map if no player entities found
        console.log("No player entities found, centering on map instead");
        this.centerOnMap();
    }
} 