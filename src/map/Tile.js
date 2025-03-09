/**
 * Represents a single tile in the game map
 */
class Tile {
    /**
     * Initialize a new tile
     * @param {string} terrainType - The type of terrain for this tile
     */
    constructor(terrainType = 'grass') {
        this.terrainType = terrainType;
        this.type = terrainType; // For backward compatibility
        
        // Position in the grid
        this.x = 0;
        this.y = 0;
        
        // Tile properties
        this.walkable = terrainType !== 'water' && terrainType !== 'mountain';
        this.passable = this.walkable;
        this.buildable = terrainType === 'grass';
        this.elevation = this.getDefaultElevation(terrainType);
        
        // Resource properties (if any)
        this.resourceType = null;
        this.resourceAmount = 0;
    }
    
    /**
     * Get the default elevation for a terrain type
     */
    getDefaultElevation(terrainType) {
        switch (terrainType) {
            case 'water':
                return 0;
            case 'grass':
                return 1;
            case 'forest':
                return 2;
            case 'mountain':
                return 3;
            default:
                return 1;
        }
    }
    
    /**
     * Update tile properties from server data
     */
    updateFromServer(serverTile) {
        if (!serverTile) return;
        
        this.terrainType = serverTile.terrainType || serverTile.type || this.terrainType;
        this.type = this.terrainType; // Keep in sync
        
        this.walkable = serverTile.passable !== undefined ? 
            serverTile.passable : 
            (serverTile.walkable !== undefined ? 
                serverTile.walkable : 
                this.walkable);
                
        this.passable = this.walkable;
        this.elevation = serverTile.elevation !== undefined ? 
            serverTile.elevation : 
            this.getDefaultElevation(this.terrainType);
            
        if (serverTile.x !== undefined) this.x = serverTile.x;
        if (serverTile.y !== undefined) this.y = serverTile.y;
    }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Tile };
} 