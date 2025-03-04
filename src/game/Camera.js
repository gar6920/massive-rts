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
        
        // Set initial position to center on the map
        this.centerOnMap();
        
        console.log(`Camera initialized at position (${this.x}, ${this.y}) with zoom ${this.zoom}`);
    }

    /**
     * Center the camera on the map
     */
    centerOnMap() {
        // Calculate the center of the map in world coordinates
        const mapCenterX = (Config.MAP_WIDTH * Config.TILE_SIZE) / 2;
        const mapCenterY = (Config.MAP_HEIGHT * Config.TILE_SIZE) / 2;
        
        // Center the camera on the map
        this.centerOn(mapCenterX, mapCenterY);
    }

    /**
     * Update camera boundaries based on current map dimensions
     */
    updateBoundaries() {
        // Calculate maximum camera positions based on map dimensions and zoom
        this.maxX = Math.max(0, (Config.MAP_WIDTH * Config.TILE_SIZE) - (this.width / this.zoom));
        this.maxY = Math.max(0, (Config.MAP_HEIGHT * Config.TILE_SIZE) - (this.height / this.zoom));
        
        console.log(`Camera boundaries updated: maxX=${this.maxX}, maxY=${this.maxY}`);
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
        // Recalculate effective boundaries based on current zoom
        const effectiveMaxX = Math.max(0, (Config.MAP_WIDTH * Config.TILE_SIZE) - (this.width / this.zoom));
        const effectiveMaxY = Math.max(0, (Config.MAP_HEIGHT * Config.TILE_SIZE) - (this.height / this.zoom));
        
        // Clamp camera position to stay within map boundaries
        this.x = Math.max(0, Math.min(this.x, effectiveMaxX));
        this.y = Math.max(0, Math.min(this.y, effectiveMaxY));
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
     * Zoom the camera centered on a specific screen position
     */
    zoomAt(deltaZoom, screenX, screenY) {
        // Get world position before zoom
        const worldX = (screenX / this.zoom) + this.x;
        const worldY = (screenY / this.zoom) + this.y;
        
        // Adjust zoom level
        const oldZoom = this.zoom;
        this.zoom += deltaZoom;
        this.zoom = Math.max(Config.ZOOM_MIN, Math.min(Config.ZOOM_MAX, this.zoom));
        
        // If zoom didn't change, exit early
        if (oldZoom === this.zoom) return;
        
        // Adjust camera position to keep the point under the mouse in the same position
        this.x = worldX - (screenX / this.zoom);
        this.y = worldY - (screenY / this.zoom);
        
        // Update boundaries and clamp position
        this.updateBoundaries();
        this.clampPosition();
    }
} 