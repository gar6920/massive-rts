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
    
    // Map data reference
    this.map = null;
    
    // Colors for different terrain types
    this.colors = {
      tile: '#4a8505', // Default grass
      tileOutline: '#45790b',
      water: '#0077be',
      mountain: '#736357',
      forest: '#1b4001',
      plains: '#90b53d',
      desert: '#d4b167',
      selection: 'rgba(255, 255, 255, 0.3)',
      hero: '#ff4444',
      heroOutline: '#aa0000',
      heroSelected: '#ffff00',
      heroAlly: '#44ff44',
      heroEnemy: '#ff4444'
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
   * @param {Array} map - 2D array of map tiles
   */
  renderMap(map) {
    console.log('=== Render Map Called ===');
    
    // Store map reference
    this.map = map;
    
    if (!Array.isArray(map)) {
      console.error('Invalid map data:', map);
      return;
    }
    
    console.log('Map data received:', map);
    console.log('Map type:', map.constructor.name);
    
    // Log the map dimensions
    const dimensions = {
      length: map.length,
      firstRowLength: map[0] ? map[0].length : 0,
      isValid2DArray: map.length > 0 && Array.isArray(map[0])
    };
    console.log('Map dimensions:', dimensions);
    
    // Log some tile data
    console.log('Sample tile data:');
    if (map.length > 0 && map[0].length > 0) {
      console.log('Top-left:', map[0][0]);
      
      const centerX = Math.floor(map.length / 2);
      const centerY = Math.floor(map[0].length / 2);
      if (map[centerX] && map[centerX][centerY]) {
        console.log('Center:', map[centerX][centerY]);
      }
      
      const lastX = map.length - 1;
      const lastY = map[0].length - 1;
      if (map[lastX] && map[lastX][lastY]) {
        console.log('Bottom-right:', map[lastX][lastY]);
      }
    }
    
    // Render each tile
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        const tile = map[x][y];
        const tileType = tile.terrainType || tile.type || 'grass';
        this.renderTile(x, y, tileType);
      }
    }
    
    console.log('=== Map Render Complete ===\n');
  }
  
  /**
   * Render a single tile at the specified position
   * @param {number} x - X coordinate in the grid
   * @param {number} y - Y coordinate in the grid
   * @param {string} tileType - Type of tile (grass, water, etc.)
   */
  renderTile(x, y, tileType) {
    // Convert grid position to screen coordinates
    const screenPos = this.gridToScreen(x, y);
    
    // Determine tile color based on type
    let fillColor;
    let strokeColor;
    
    switch (tileType) {
      case 'water':
        fillColor = this.colors.water;
        break;
      case 'mountain':
        fillColor = this.colors.mountain;
        break;
      case 'forest':
        fillColor = this.colors.forest;
        break;
      case 'plains':
        fillColor = this.colors.plains;
        break;
      case 'desert':
        fillColor = this.colors.desert;
        break;
      case 'grass':
      default:
        fillColor = this.colors.tile;
        break;
    }
    
    strokeColor = this.colors.tileOutline;
    
    // Draw isometric tile
    this.drawIsometricTile(
      screenPos.x,
      screenPos.y,
      this.tileWidth * this.zoom,
      this.tileHeight * this.zoom,
      fillColor
    );
    
    // Draw tile outline
    this.drawIsometricTileOutline(
      screenPos.x,
      screenPos.y,
      this.tileWidth * this.zoom,
      this.tileHeight * this.zoom,
      strokeColor
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
   * @param {boolean} isSelected - Whether this hero is selected
   * @param {boolean} isOwnHero - Whether this hero belongs to the current player
   */
  renderHero(hero, isSelected, isOwnHero) {
    console.log('Rendering hero:', hero);
    if (!hero || !hero.position) {
      console.error('Invalid hero object:', hero);
      return;
    }
    
    const screenPos = this.gridToScreen(hero.position.x, hero.position.y);
    
    this.ctx.save();
    
    // Draw hero body
    this.ctx.beginPath();
    this.ctx.arc(screenPos.x, screenPos.y, this.tileWidth / 3, 0, Math.PI * 2);
    
    // Set color based on ownership
    if (isOwnHero) {
      this.ctx.fillStyle = this.colors.hero;
      this.ctx.strokeStyle = this.colors.heroOutline;
    } else {
      this.ctx.fillStyle = this.colors.heroAlly;
      this.ctx.strokeStyle = this.colors.heroOutline;
    }
    
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw selection indicator if selected
    if (isSelected) {
      this.ctx.beginPath();
      this.ctx.arc(screenPos.x, screenPos.y, this.tileWidth / 2.5, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.colors.heroSelected;
      this.ctx.setLineDash([5, 5]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
    
    // Draw health bar
    const healthBarWidth = this.tileWidth / 2;
    const healthBarHeight = 4;
    const healthPercent = hero.health / 100;
    
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(
      screenPos.x - healthBarWidth / 2,
      screenPos.y - this.tileHeight / 2,
      healthBarWidth,
      healthBarHeight
    );
    
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillRect(
      screenPos.x - healthBarWidth / 2,
      screenPos.y - this.tileHeight / 2,
      healthBarWidth * healthPercent,
      healthBarHeight
    );
    
    this.ctx.restore();
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
    console.log('Rendering building:', building);
    if (!building || !building.position) {
      console.error('Invalid building object:', building);
      return;
    }
    
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
  
  /**
   * Center the camera on the center of the map
   */
  centerOnMap() {
    console.log('Centering camera on map');
    if (Array.isArray(this.map) && this.map.length > 0) {
      // Calculate center coordinates
      const centerX = this.map.length / 2;
      const centerY = this.map[0].length / 2;
      
      console.log(`Map dimensions: ${this.map.length}x${this.map[0].length}, center at (${centerX}, ${centerY})`);
      
      // Set camera position
      this.cameraX = centerX * this.tileWidth / 2;
      this.cameraY = centerY * this.tileHeight / 2;
      
      console.log(`Set camera position to (${this.cameraX}, ${this.cameraY})`);
    } else {
      console.warn('Cannot center on map: map data not available', this.map);
    }
  }
}

export { Renderer }; 