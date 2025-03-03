/**
 * Represents a single tile on the game map
 */
class Tile {
    /**
     * Initialize a tile
     */
    constructor(type = 'grass') {
        this.type = type;
        this.walkable = this.isWalkable(type);
        this.buildable = this.isBuildable(type);
        this.resourceType = this.getResourceType(type);
        this.resourceAmount = this.resourceType ? Math.floor(Math.random() * 500) + 500 : 0;
    }
    
    /**
     * Determine if a tile type is walkable
     */
    isWalkable(type) {
        switch (type) {
            case 'water':
            case 'mountain':
                return false;
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
                break;
            case 'stone':
                this.type = 'mountain';
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