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
        // For isometric view, we need to calculate the center differently
        const mapWidth = Config.MAP_WIDTH;
        const mapHeight = Config.MAP_HEIGHT;
        const tileSize = Config.TILE_SIZE;
        
        // Calculate the center in grid coordinates
        const centerGridX = mapWidth / 2;
        const centerGridY = mapHeight / 2;
        
        // Convert to isometric coordinates (this is the key calculation)
        const isoX = (centerGridX - centerGridY) * (tileSize / 2);
        const isoY = (centerGridX + centerGridY) * (tileSize / 4);
        
        // Calculate the isometric map dimensions
        const isoMapWidth = (mapWidth + mapHeight) * (tileSize / 2);
        const isoMapHeight = (mapWidth + mapHeight) * (tileSize / 4);
        
        // Calculate the offset to center the map in the viewport
        // For isometric view, we need a different offset calculation
        const offsetX = -isoMapWidth / 4;
        const offsetY = -isoMapHeight / 8;
        
        // Center the camera on the isometric center with offset
        this.centerOn(isoX + offsetX, isoY + offsetY);
        
        console.log(`Camera centered on map at isometric coordinates (${isoX}, ${isoY}) with offset (${offsetX}, ${offsetY})`);
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
        
        // Calculate the offset to center the map in the viewport
        const offsetX = -isoMapWidth / 4;
        const offsetY = -isoMapHeight / 8;
        
        // Calculate maximum camera positions with extra padding
        // We need to add extra space to ensure the entire map is visible
        // For the maxY, we need to ensure the player can pan to the bottom of the map
        this.maxX = isoMapWidth;
        this.maxY = isoMapHeight;
        
        // Add negative boundaries to allow viewing the entire map
        // These boundaries should be generous to allow the map to be centered
        this.minX = -isoMapWidth / 2;
        this.minY = -isoMapHeight / 2;
        
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
     * Zoom the camera at a specific screen position
     */
    zoomAt(deltaZoom, screenX, screenY) {
        // Get world coordinates of zoom point before zoom change
        const worldBefore = this.screenToWorld(screenX, screenY);
        
        // Apply zoom change
        this.zoom = Math.max(Config.ZOOM_MIN, Math.min(Config.ZOOM_MAX, this.zoom + deltaZoom));
        
        // Get world coordinates of zoom point after zoom change
        const worldAfter = this.screenToWorld(screenX, screenY);
        
        // Adjust camera position to keep the zoom point stationary on screen
        this.x += (worldBefore.x - worldAfter.x);
        this.y += (worldBefore.y - worldAfter.y);
        
        // Ensure camera stays within map boundaries
        this.clampPosition();
    }
} 