/**
 * Camera class for handling viewport and map navigation
 */
class Camera {
    /**
     * Initialize the camera
     */
    constructor() {
        this.x = 0; // Camera's x position in the world
        this.y = 0; // Camera's y position in the world
        this.width = Config.CANVAS_WIDTH;
        this.height = Config.CANVAS_HEIGHT;
        this.maxX = Config.MAP_WIDTH * Config.TILE_SIZE - this.width;
        this.maxY = Config.MAP_HEIGHT * Config.TILE_SIZE - this.height;
        this.zoom = Config.ZOOM_DEFAULT; // Current zoom level
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
        const effectiveMaxX = (Config.MAP_WIDTH * Config.TILE_SIZE) - (this.width / this.zoom);
        const effectiveMaxY = (Config.MAP_HEIGHT * Config.TILE_SIZE) - (this.height / this.zoom);
        
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
     * Update camera dimensions when window is resized
     */
    updateDimensions() {
        this.width = Config.CANVAS_WIDTH;
        this.height = Config.CANVAS_HEIGHT;
        this.maxX = Config.MAP_WIDTH * Config.TILE_SIZE - (this.width / this.zoom);
        this.maxY = Config.MAP_HEIGHT * Config.TILE_SIZE - (this.height / this.zoom);
        this.clampPosition();
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
        
        // Update max bounds and clamp position
        this.maxX = Config.MAP_WIDTH * Config.TILE_SIZE - (this.width / this.zoom);
        this.maxY = Config.MAP_HEIGHT * Config.TILE_SIZE - (this.height / this.zoom);
        this.clampPosition();
    }
} 