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
        this.x = worldX - this.width / 2;
        this.y = worldY - this.height / 2;
        this.clampPosition();
    }

    /**
     * Ensure camera stays within map boundaries
     */
    clampPosition() {
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Check if a world position is visible on screen
     */
    isVisible(worldX, worldY, width, height) {
        return (
            worldX + width > this.x &&
            worldX < this.x + this.width &&
            worldY + height > this.y &&
            worldY < this.y + this.height
        );
    }

    /**
     * Update camera dimensions when window is resized
     */
    updateDimensions() {
        this.width = Config.CANVAS_WIDTH;
        this.height = Config.CANVAS_HEIGHT;
        this.maxX = Config.MAP_WIDTH * Config.TILE_SIZE - this.width;
        this.maxY = Config.MAP_HEIGHT * Config.TILE_SIZE - this.height;
        this.clampPosition();
    }
} 