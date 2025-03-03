/**
 * Manages the game map and terrain generation
 */
class Map {
    /**
     * Initialize the map
     */
    constructor() {
        this.width = Config.MAP_WIDTH;
        this.height = Config.MAP_HEIGHT;
        this.tiles = [];
    }
    
    /**
     * Generate a new map
     */
    generate() {
        // Initialize empty tile array
        this.tiles = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = new Array(this.width);
        }
        
        // Generate terrain using simplex noise (mocked for now)
        this.generateTerrain();
        
        // Add features like forests, mountains, etc.
        this.addFeatures();
        
        console.log('Map generated successfully');
    }
    
    /**
     * Generate basic terrain
     */
    generateTerrain() {
        // For now, we'll use a simple algorithm to generate terrain
        // In a real implementation, we would use noise functions for more natural terrain
        
        // Start with all grass
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = new Tile('grass');
            }
        }
        
        // Add some water (simple algorithm for demonstration)
        this.generateWater();
    }
    
    /**
     * Generate water bodies
     */
    generateWater() {
        // Create a few lakes/rivers
        const numWaterBodies = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < numWaterBodies; i++) {
            // Random starting point
            const startX = Math.floor(Math.random() * this.width);
            const startY = Math.floor(Math.random() * this.height);
            
            // Random size
            const size = Math.floor(Math.random() * 10) + 5;
            
            // Create water body
            this.createWaterBody(startX, startY, size);
        }
    }
    
    /**
     * Create a water body starting at (x, y) with given size
     */
    createWaterBody(x, y, size) {
        // Simple circular water body
        for (let dy = -size; dy <= size; dy++) {
            for (let dx = -size; dx <= size; dx++) {
                // Calculate distance from center
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If within radius and with some randomness
                if (distance <= size * (0.7 + Math.random() * 0.3)) {
                    const tileX = x + dx;
                    const tileY = y + dy;
                    
                    // Check bounds
                    if (tileX >= 0 && tileX < this.width && tileY >= 0 && tileY < this.height) {
                        // Set tile to water
                        this.tiles[tileY][tileX] = new Tile('water');
                    }
                }
            }
        }
    }
    
    /**
     * Add map features (forests, mountains, etc.)
     */
    addFeatures() {
        // Add forests
        this.addForests();
        
        // Add mountains
        this.addMountains();
        
        // Add sand (beaches near water)
        this.addBeaches();
    }
    
    /**
     * Add forests to the map
     */
    addForests() {
        // Number of forest clusters
        const numForests = Math.floor(Math.random() * 5) + 5;
        
        for (let i = 0; i < numForests; i++) {
            // Random starting point
            const startX = Math.floor(Math.random() * this.width);
            const startY = Math.floor(Math.random() * this.height);
            
            // Random size
            const size = Math.floor(Math.random() * 8) + 4;
            
            // Create forest
            this.createForest(startX, startY, size);
        }
    }
    
    /**
     * Create a forest starting at (x, y) with given size
     */
    createForest(x, y, size) {
        for (let dy = -size; dy <= size; dy++) {
            for (let dx = -size; dx <= size; dx++) {
                // Calculate distance from center
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If within radius and with some randomness
                if (distance <= size * (0.6 + Math.random() * 0.4)) {
                    const tileX = x + dx;
                    const tileY = y + dy;
                    
                    // Check bounds and that tile is grass
                    if (
                        tileX >= 0 && tileX < this.width && 
                        tileY >= 0 && tileY < this.height &&
                        this.tiles[tileY][tileX].type === 'grass'
                    ) {
                        // Set tile to forest with some randomness
                        if (Math.random() < 0.7) {
                            this.tiles[tileY][tileX] = new Tile('forest');
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Add mountains to the map
     */
    addMountains() {
        // Number of mountain ranges
        const numMountains = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < numMountains; i++) {
            // Random starting point
            const startX = Math.floor(Math.random() * this.width);
            const startY = Math.floor(Math.random() * this.height);
            
            // Random size
            const size = Math.floor(Math.random() * 6) + 3;
            
            // Create mountain range
            this.createMountains(startX, startY, size);
        }
    }
    
    /**
     * Create mountains starting at (x, y) with given size
     */
    createMountains(x, y, size) {
        for (let dy = -size; dy <= size; dy++) {
            for (let dx = -size; dx <= size; dx++) {
                // Calculate distance from center
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If within radius and with some randomness
                if (distance <= size * (0.5 + Math.random() * 0.5)) {
                    const tileX = x + dx;
                    const tileY = y + dy;
                    
                    // Check bounds and that tile is not water
                    if (
                        tileX >= 0 && tileX < this.width && 
                        tileY >= 0 && tileY < this.height &&
                        this.tiles[tileY][tileX].type !== 'water'
                    ) {
                        // Set tile to mountain with some randomness
                        if (Math.random() < 0.6) {
                            this.tiles[tileY][tileX] = new Tile('mountain');
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Add beaches (sand) near water
     */
    addBeaches() {
        // Create a copy of the current tiles
        const tempTiles = [];
        for (let y = 0; y < this.height; y++) {
            tempTiles[y] = [...this.tiles[y]];
        }
        
        // Check each tile
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // If tile is not water but is adjacent to water, make it sand
                if (this.tiles[y][x].type !== 'water' && this.isAdjacentToWater(x, y)) {
                    tempTiles[y][x] = new Tile('sand');
                }
            }
        }
        
        // Update tiles
        this.tiles = tempTiles;
    }
    
    /**
     * Check if a tile is adjacent to water
     */
    isAdjacentToWater(x, y) {
        // Check all 8 adjacent tiles
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                // Skip the center tile
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                // Check bounds
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                    // If adjacent tile is water, return true
                    if (this.tiles[ny][nx].type === 'water') {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * Get a tile at the specified coordinates
     */
    getTile(x, y) {
        // Check bounds
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        
        return this.tiles[y][x];
    }
    
    /**
     * Check if a position is walkable
     */
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        return tile && tile.walkable;
    }
    
    /**
     * Check if a position is buildable
     */
    isBuildable(x, y) {
        const tile = this.getTile(x, y);
        return tile && tile.buildable;
    }
} 