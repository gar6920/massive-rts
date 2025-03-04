/**
 * Represents a single tile on the game map
 */
class Tile {
    /**
     * Initialize a tile
     */
    constructor(terrainType = 'grass') {
        // Ensure valid tile type
        this.type = this.validateTerrainType(terrainType);
        this.terrainType = this.type; // For consistency with server data
        this.walkable = this.isWalkable(this.type);
        this.buildable = this.isBuildable(this.type);
        this.resourceType = this.getResourceType(this.type);
        this.resourceAmount = this.resourceType ? Math.floor(Math.random() * 500) + 500 : 0;
        this.elevation = 0; // Default elevation
    }
    
    /**
     * Validate and normalize terrain type
     */
    validateTerrainType(type) {
        const validTypes = ['grass', 'water', 'mountain', 'forest', 'sand'];
        
        if (!type || typeof type !== 'string') {
            console.warn(`Invalid tile type: ${type}, defaulting to grass`);
            return 'grass';
        }
        
        const normalizedType = type.toLowerCase();
        
        if (!validTypes.includes(normalizedType)) {
            console.warn(`Unknown tile type: ${normalizedType}, defaulting to grass`);
            return 'grass';
        }
        
        return normalizedType;
    }
    
    /**
     * Determine if a tile type is walkable
     */
    isWalkable(type) {
        switch (type) {
            case 'water':
            case 'mountain':
                return false;
            case 'grass':
            case 'sand':
            case 'forest':
                return true;
            default:
                return true;
        }
    }
    
    /**
     * Determine if a tile type is buildable
     */
    isBuildable(type) {
        switch (type) {
            case 'grass':
            case 'sand':
                return true;
            case 'water':
            case 'mountain':
            case 'forest':
                return false;
            default:
                return false;
        }
    }
    
    /**
     * Get resource type for a tile if applicable
     */
    getResourceType(type) {
        switch (type) {
            case 'forest':
                return 'wood';
            case 'mountain':
                return 'stone';
            default:
                return null;
        }
    }
    
    /**
     * Extract resources from the tile
     */
    extractResource(amount) {
        if (!this.resourceType || this.resourceAmount <= 0) {
            return 0;
        }
        
        const extracted = Math.min(amount, this.resourceAmount);
        this.resourceAmount -= extracted;
        
        // If resources are depleted, change the tile type
        if (this.resourceAmount <= 0) {
            this.depleteResource();
        }
        
        return extracted;
    }
    
    /**
     * Handle resource depletion
     */
    depleteResource() {
        switch (this.resourceType) {
            case 'wood':
                this.type = 'grass';
                this.terrainType = 'grass';
                break;
            case 'stone':
                this.type = 'mountain';
                this.terrainType = 'mountain';
                break;
            default:
                break;
        }
        
        this.resourceType = null;
        this.resourceAmount = 0;
        this.walkable = this.isWalkable(this.type);
        this.buildable = this.isBuildable(this.type);
    }
} 