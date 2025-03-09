/**
 * Handles all rendering operations for the game with Colyseus integration
 */
class Renderer {
  /**
   * Initialize the renderer
   * @param {HTMLCanvasElement} canvas - The canvas element to render on
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Tile dimensions
    this.tileWidth = 64;
    this.tileHeight = 32;
    
    // Camera position and zoom
    this.cameraX = 0;
    this.cameraY = 0;
    this.zoom = 1.0;
    
    // Colors for different terrain types
    this.colors = {
      tile: '#4a8505', // Default grass
      tileOutline: '#45790b',
      water: '#0077be',
      mountain: '#736357',
      forest: '#1b4001',
      plains: '#90b53d',
      desert: '#d4b167',
      selection: 'rgba(255, 255, 255, 0.3)'
    };
    
    // Set canvas size
    this.handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', () => this.handleResize());
  }
  
  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  /**
   * Convert grid coordinates to screen coordinates
   * @param {number} x - Grid x coordinate
   * @param {number} y - Grid y coordinate
   * @returns {Object} Screen coordinates {x, y}
   */
  gridToScreen(x, y) {
    // Convert grid coordinates to isometric screen coordinates
    const screenX = (x - y) * (this.tileWidth * this.zoom / 2);
    const screenY = (x + y) * (this.tileHeight * this.zoom / 2);
    
    // Center the map on screen
    const offsetX = this.canvas.width / 2;
    const offsetY = this.canvas.height / 4;
    
    return {
      x: screenX + offsetX,
      y: screenY + offsetY
    };
  }
  
  /**
   * Convert screen coordinates to grid coordinates
   * @param {number} screenX - Screen x coordinate
   * @param {number} screenY - Screen y coordinate
   * @returns {Object} Grid coordinates {x, y}
   */
  screenToGrid(screenX, screenY) {
    // Adjust for camera and zoom
    const adjustedX = (screenX - this.canvas.width / 2) / this.zoom + this.cameraX;
    const adjustedY = (screenY - this.canvas.height / 2) / this.zoom + this.cameraY;
    
    // Inverse isometric projection
    return {
      x: (adjustedX / (this.tileWidth / 2) + adjustedY / (this.tileHeight / 2)) / 2,
      y: (adjustedY / (this.tileHeight / 2) - adjustedX / (this.tileWidth / 2)) / 2
    };
  }
  
  /**
   * Render the map
   * @param {Array} map - Array of tile values
   */
  renderMap(map) {
    console.log('=== Render Map Called ===');
    console.log('Map data received:', map);
    console.log('Map type:', map ? (Array.isArray(map) ? 'Array' : typeof map) : 'undefined');
    
    if (!map || !map.length) {
      console.warn('No map data to render');
      console.log('Camera position:', { x: this.cameraX, y: this.cameraY });
      console.log('Zoom level:', this.zoom);
      return;
    }
    
    console.log('Map dimensions:', {
      length: map.length,
      firstRowLength: map[0]?.length,
      isValid2DArray: map.every(row => Array.isArray(row))
    });
    
    // Sample some map data
    if (map.length > 0 && map[0]?.length > 0) {
      console.log('Sample tile data:');
      console.log('Top-left:', map[0][0]);
      console.log('Center:', map[Math.floor(map.length/2)]?.[Math.floor(map[0].length/2)]);
      console.log('Bottom-right:', map[map.length-1]?.[map[0].length-1]);
    }
    
    // Iterate through the map grid
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        this.renderTile(x, y, tile);
      }
    }
    
    console.log('=== Map Render Complete ===\n');
  }
  
  /**
   * Render a single tile
   * @param {number} x - Grid x coordinate
   * @param {number} y - Grid y coordinate
   * @param {number} tileType - Type of tile
   */
  renderTile(x, y, tileType) {
    const screenPos = this.gridToScreen(x, y);
    
    // Get color based on tile type
    let color = this.colors.tile;
    switch (tileType) {
      case 1: // Water
        color = this.colors.water;
        break;
      case 2: // Mountain
        color = this.colors.mountain;
        break;
      case 3: // Forest
        color = this.colors.forest;
        break;
      case 4: // Plains
        color = this.colors.plains;
        break;
      case 5: // Desert
        color = this.colors.desert;
        break;
    }
    
    // Draw tile
    this.drawIsometricTile(
      screenPos.x,
      screenPos.y,
      this.tileWidth * this.zoom,
      this.tileHeight * this.zoom,
      color
    );
    
    // Draw tile outline
    this.drawIsometricTileOutline(
      screenPos.x,
      screenPos.y,
      this.tileWidth * this.zoom,
      this.tileHeight * this.zoom,
      this.colors.tileOutline
    );
  }
  
  /**
   * Draw an isometric tile
   * @param {number} x - Screen x coordinate of tile center
   * @param {number} y - Screen y coordinate of tile center
   * @param {number} width - Tile width
   * @param {number} height - Tile height
   * @param {string} color - Tile color
   */
  drawIsometricTile(x, y, width, height, color) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - halfHeight); // Top
    this.ctx.lineTo(x + halfWidth, y); // Right
    this.ctx.lineTo(x, y + halfHeight); // Bottom
    this.ctx.lineTo(x - halfWidth, y); // Left
    this.ctx.closePath();
    
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
  
  /**
   * Draw an isometric tile outline
   * @param {number} x - Screen x coordinate of tile center
   * @param {number} y - Screen y coordinate of tile center
   * @param {number} width - Tile width
   * @param {number} height - Tile height
   * @param {string} color - Outline color
   */
  drawIsometricTileOutline(x, y, width, height, color) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - halfHeight); // Top
    this.ctx.lineTo(x + halfWidth, y); // Right
    this.ctx.lineTo(x, y + halfHeight); // Bottom
    this.ctx.lineTo(x - halfWidth, y); // Left
    this.ctx.closePath();
    
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }
  
  /**
   * Render a hero
   * @param {Object} hero - Hero object
   * @param {boolean} isCurrentPlayer - Whether this hero belongs to the current player
   */
  renderHero(hero, isCurrentPlayer) {
    if (!hero || !hero.position) return;
    
    const screenPos = this.gridToScreen(hero.position.x, hero.position.y);
    
    // Draw hero (larger than regular units)
    this.ctx.beginPath();
    this.ctx.fillStyle = isCurrentPlayer ? "#f1c40f" : "#9b59b6";
    this.ctx.arc(screenPos.x, screenPos.y, 15 * this.zoom, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Render a unit
   * @param {Object} unit - Unit object
   */
  renderUnit(unit) {
    if (!unit || !unit.position) return;
    
    const screenPos = this.gridToScreen(unit.position.x, unit.position.y);
    
    // Draw unit (for now, just a colored circle)
    this.ctx.beginPath();
    this.ctx.fillStyle = unit.owner === "human" ? "#2ecc71" : "#e67e22";
    this.ctx.arc(screenPos.x, screenPos.y, 10 * this.zoom, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Render a building
   * @param {Object} building - Building object
   */
  renderBuilding(building) {
    if (!building || !building.position) return;
    
    const screenPos = this.gridToScreen(building.position.x, building.position.y);
    
    // Draw building (for now, just a colored rectangle)
    this.ctx.fillStyle = building.owner === "human" ? "#3498db" : "#e74c3c";
    this.drawIsometricTile(
      screenPos.x,
      screenPos.y,
      this.tileWidth * 1.2 * this.zoom,
      this.tileHeight * 1.2 * this.zoom,
      this.ctx.fillStyle
    );
  }
  
  /**
   * Render a selection highlight
   * @param {Object} entity - The selected entity
   */
  renderSelection(entity) {
    if (!entity || !entity.position) return;
    
    const screenPos = this.gridToScreen(entity.position.x, entity.position.y);
    
    // Draw selection highlight
    this.ctx.beginPath();
    this.ctx.fillStyle = this.colors.selection;
    this.ctx.arc(screenPos.x, screenPos.y, 20 * this.zoom, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  /**
   * Move the camera
   * @param {number} x - New x position
   * @param {number} y - New y position
   */
  moveCamera(x, y) {
    this.cameraX = x;
    this.cameraY = y;
  }
  
  /**
   * Pan the camera
   * @param {number} dx - Change in x
   * @param {number} dy - Change in y
   */
  panCamera(dx, dy) {
    this.cameraX += dx / this.zoom;
    this.cameraY += dy / this.zoom;
  }
  
  /**
   * Set camera zoom
   * @param {number} zoom - New zoom level
   */
  setZoom(zoom) {
    this.zoom = Math.max(0.5, Math.min(2, zoom));
  }
  
  /**
   * Adjust camera zoom
   * @param {number} delta - Change in zoom
   */
  adjustZoom(delta) {
    this.zoom = Math.max(0.5, Math.min(2, this.zoom + delta));
  }
}

export { Renderer }; 