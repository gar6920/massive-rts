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
        console.log('\n=== Loading Tile Images ===');
        const terrainTypes = ['grass', 'water', 'mountain', 'forest', 'sand'];
        
        terrainTypes.forEach(terrainType => {
            const img = new Image();
            img.src = `/images/terraintiles/${terrainType}.png`;
            
            img.onload = () => {
                console.log(`Loaded image for ${terrainType} terrain`);
            };
            
            img.onerror = () => {
                console.warn(`Failed to load image for ${terrainType} terrain - will use color fallback`);
            };
            
            this.tileImages[terrainType] = img;
        });
        
        console.log(`Attempting to load ${terrainTypes.length} terrain images...`);
        console.log('=== Tile Image Loading Started ===\n');
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
        console.log('\n=== Processing Map Data ===');
        console.log('Map data received:', {
            isValid: !!mapData,
            isArray: Array.isArray(mapData),
            dimensions: mapData ? `${mapData.length}x${mapData[0]?.length}` : 'invalid',
            sampleTile: mapData && mapData[0] ? mapData[0][0] : null
        });
        
        if (!mapData || !Array.isArray(mapData) || mapData.length === 0 || !mapData[0]) {
            console.error('Invalid map data from server');
            console.error('Expected 2D array of tiles, received:', mapData);
            return;
        }
        
        // Update map dimensions
        this.height = mapData.length;
        this.width = mapData[0].length;
        
        console.log(`Setting map dimensions: ${this.width}x${this.height}`);
        
        // Initialize tiles array
        this.tiles = new Array(this.height);
        let invalidTiles = 0;
        
        // Process each tile
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                if (!mapData[y] || !mapData[y][x]) {
                    console.error(`Missing tile data at ${x},${y}`);
                    this.tiles[y][x] = new Tile('grass');
                    invalidTiles++;
                    continue;
                }
                
                const serverTile = mapData[y][x];
                const terrainType = serverTile.terrainType || serverTile.type || 'grass';
                
                // Create new tile with all properties
                this.tiles[y][x] = new Tile(terrainType);
                this.tiles[y][x].walkable = serverTile.passable !== undefined ? 
                    serverTile.passable : 
                    (serverTile.walkable !== undefined ? 
                        serverTile.walkable : 
                        (terrainType !== 'water' && terrainType !== 'mountain'));
                this.tiles[y][x].elevation = serverTile.elevation || 1;
                this.tiles[y][x].x = x;
                this.tiles[y][x].y = y;
            }
        }
        
        if (invalidTiles > 0) {
            console.warn(`Found ${invalidTiles} invalid tiles that were replaced with grass`);
        }
        
        // Log map statistics
        const terrainStats = {};
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const terrainType = this.tiles[y][x].terrainType;
                terrainStats[terrainType] = (terrainStats[terrainType] || 0) + 1;
            }
        }
        
        console.log('Map statistics:');
        console.log('Dimensions:', `${this.width}x${this.height}`);
        console.log('Total tiles:', this.width * this.height);
        console.log('Terrain distribution:', terrainStats);
        console.log('Sample tiles:');
        console.log('Top-left:', this.tiles[0][0]);
        console.log('Center:', this.tiles[Math.floor(this.height/2)][Math.floor(this.width/2)]);
        console.log('Bottom-right:', this.tiles[this.height-1][this.width-1]);
        console.log('=== Map Processing Complete ===\n');
        
        // Update Config with new map dimensions
        Config.MAP_WIDTH = this.width;
        Config.MAP_HEIGHT = this.height;
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
        const image = this.tileImages[terrainType];
        if (!image) {
            console.warn(`No image found for terrain type: ${terrainType}`);
            return this.tileImages['grass']; // Fallback to grass
        }
        return image;
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
    
    /**
     * Render the map
     */
    render(ctx, camera) {
        console.log('\n=== Rendering Map ===');
        
        // Get camera bounds
        const bounds = camera.getWorldBounds();
        
        // Calculate visible tile range
        const minGridX = Math.max(0, Math.floor(bounds.left / Config.TILE_SIZE));
        const minGridY = Math.max(0, Math.floor(bounds.top / Config.TILE_SIZE));
        const maxGridX = Math.min(this.width - 1, Math.ceil(bounds.right / Config.TILE_SIZE));
        const maxGridY = Math.min(this.height - 1, Math.ceil(bounds.bottom / Config.TILE_SIZE));
        
        console.log('Rendering tile range:', {
            x: `${minGridX} to ${maxGridX}`,
            y: `${minGridY} to ${maxGridY}`
        });
        
        // Track rendering statistics
        let tilesRendered = 0;
        const terrainStats = {};
        
        // Render tiles in isometric order (back to front)
        for (let sum = minGridX + minGridY; sum <= maxGridX + maxGridY; sum++) {
            for (let gridX = minGridX; gridX <= maxGridX; gridX++) {
                const gridY = sum - gridX;
                
                if (gridY < minGridY || gridY > maxGridY) continue;
                
                const tile = this.getTile(gridX, gridY);
                if (!tile) continue;
                
                // Convert grid coordinates to isometric world coordinates
                const isoPos = this.gridToIso(gridX, gridY);
                
                // Convert world coordinates to screen coordinates
                const screenPos = camera.worldToScreen(isoPos.x, isoPos.y);
                
                // Calculate tile dimensions with zoom
                const tileWidth = Config.TILE_SIZE * camera.zoom;
                const tileHeight = (Config.TILE_SIZE / 2) * camera.zoom;
                
                // Track terrain type
                terrainStats[tile.terrainType] = (terrainStats[tile.terrainType] || 0) + 1;
                
                // Draw the tile
                if (this.tileImages[tile.terrainType] && this.tileImages[tile.terrainType].complete) {
                    // Draw tile image
                    ctx.drawImage(
                        this.tileImages[tile.terrainType],
                        screenPos.x - tileWidth / 2,
                        screenPos.y - tileHeight / 2,
                        tileWidth,
                        tileHeight
                    );
                } else {
                    // Fallback to colored diamond
                    this.drawIsometricTile(
                        ctx,
                        screenPos.x,
                        screenPos.y,
                        tileWidth,
                        tileHeight,
                        this.getTileColor(tile.terrainType)
                    );
                }
                
                tilesRendered++;
            }
        }
        
        console.log('Rendering statistics:', {
            tilesRendered,
            terrainDistribution: terrainStats
        });
        console.log('=== Map Rendering Complete ===\n');
    }
    
    /**
     * Draw an isometric tile
     */
    drawIsometricTile(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        
        // Draw diamond shape
        ctx.beginPath();
        ctx.moveTo(x, y - height / 2); // Top
        ctx.lineTo(x + width / 2, y); // Right
        ctx.lineTo(x, y + height / 2); // Bottom
        ctx.lineTo(x - width / 2, y); // Left
        ctx.closePath();
        
        // Fill and stroke
        ctx.fill();
        ctx.stroke();
    }
    
    /**
     * Get color for terrain type
     */
    getTileColor(terrainType) {
        switch (terrainType) {
            case 'grass':
                return '#90EE90'; // Light green
            case 'water':
                return '#4169E1'; // Royal blue
            case 'mountain':
                return '#A0522D'; // Brown
            case 'forest':
                return '#228B22'; // Forest green
            case 'sand':
                return '#F4A460'; // Sandy brown
            default:
                return '#808080'; // Gray for unknown types
        }
    }
} 