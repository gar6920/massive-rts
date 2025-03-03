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
                this.tiles[y][x] = new Tile(serverTile.type || 'grass');
                this.tiles[y][x].walkable = serverTile.walkable !== undefined ? 
                    serverTile.walkable : 
                    (serverTile.type !== 'water' && serverTile.type !== 'mountain');
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