/**
 * Manages the game map
 */
class Map {
    /**
     * Initialize the map
     */
    constructor() {
        this.width = Config.MAP_WIDTH;
        this.height = Config.MAP_HEIGHT;
        this.tiles = [];
        
        // Initialize with empty tiles
        this.initializeEmptyTiles();
        
        // Preload tile images
        this.tileImages = {};
        this.preloadTileImages();
    }
    
    /**
     * Preload tile images for different terrain types
     */
    preloadTileImages() {
        const terrainTypes = ['grass', 'water', 'mountain', 'forest', 'sand'];
        
        terrainTypes.forEach(terrainType => {
            const img = new Image();
            img.src = `/images/terraintiles/${terrainType}.png`;
            this.tileImages[terrainType] = img;
        });
    }
    
    /**
     * Initialize empty tiles
     */
    initializeEmptyTiles() {
        this.tiles = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                // Initialize with grass tiles as a fallback
                this.tiles[y][x] = new Tile('grass');
            }
        }
        console.log('Initialized empty map');
    }
    
    /**
     * Set the map data from the server
     */
    setMapFromServer(mapData) {
        console.log('Received map data from server', mapData ? 'valid' : 'invalid');
        
        if (!mapData || !Array.isArray(mapData) || mapData.length === 0) {
            console.error('Invalid map data from server');
            return;
        }
        
        this.height = mapData.length;
        this.width = mapData[0].length;
        
        console.log(`Setting map from server data: ${this.width}x${this.height}`);
        
        // Convert server map data to our tile format
        this.tiles = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                if (!mapData[y] || !mapData[y][x]) {
                    console.error(`Missing tile data at ${x},${y}`);
                    this.tiles[y][x] = new Tile('grass');
                    continue;
                }
                
                const serverTile = mapData[y][x];
                // Use terrainType if available, fall back to type for backward compatibility
                const terrainType = serverTile.terrainType || serverTile.type || 'grass';
                this.tiles[y][x] = new Tile(terrainType);
                
                // Use passable if available, fall back to walkable for backward compatibility
                this.tiles[y][x].walkable = serverTile.passable !== undefined ? 
                    serverTile.passable : 
                    (serverTile.walkable !== undefined ? 
                        serverTile.walkable : 
                        (terrainType !== 'water' && terrainType !== 'mountain'));
                
                // Store elevation if available
                if (serverTile.elevation !== undefined) {
                    this.tiles[y][x].elevation = serverTile.elevation;
                }
            }
        }
        
        console.log('Map set from server data');
    }
    
    /**
     * Get the tile at the specified coordinates
     */
    getTile(x, y) {
        // Check bounds
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        
        // Check if tiles array is properly initialized
        if (!this.tiles || !this.tiles[y] || !this.tiles[y][x]) {
            console.warn(`Tile at ${x},${y} is not initialized`);
            return new Tile('grass'); // Return a default tile
        }
        
        return this.tiles[y][x];
    }
    
    /**
     * Get the tile image for a specific terrain type
     */
    getTileImage(terrainType) {
        return this.tileImages[terrainType] || this.tileImages['grass'];
    }
    
    /**
     * Convert grid coordinates to isometric world coordinates
     */
    gridToIso(x, y) {
        return {
            x: (x - y) * (Config.TILE_SIZE / 2),
            y: (x + y) * (Config.TILE_SIZE / 4)
        };
    }
    
    /**
     * Convert isometric world coordinates to grid coordinates
     */
    isoToGrid(x, y) {
        const tileHalfWidth = Config.TILE_SIZE / 2;
        const tileQuarterHeight = Config.TILE_SIZE / 4;
        
        return {
            x: Math.floor((x / tileHalfWidth + y / tileQuarterHeight) / 2),
            y: Math.floor((y / tileQuarterHeight - x / tileHalfWidth) / 2)
        };
    }
    
    /**
     * Check if a tile is walkable
     */
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        return tile && tile.walkable;
    }
    
    /**
     * Check if a tile is buildable
     */
    isBuildable(x, y) {
        const tile = this.getTile(x, y);
        return tile && tile.buildable;
    }
} 