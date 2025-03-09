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
    
    // Isometric tile dimensions
    this.tileWidth = 64;
    this.tileHeight = 32;
    
    // Camera position and zoom
    this.cameraX = 0;
    this.cameraY = 0;
    this.zoom = 1;
    
    // Colors
    this.colors = {
      // Tile colors
      tile: '#8fbc8f',
      tileOutline: '#2e8b57',
      
      // Entity colors
      humanHero: '#0000ff',
      humanUnit: '#4169e1',
      humanBuilding: '#4682b4',
      
      aiHero: '#ff0000',
      aiUnit: '#ff4500',
      aiBuilding: '#8b0000',
      
      // Selection color
      selection: '#ffff00'
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
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
    // Isometric projection
    const screenX = (x - y) * this.tileWidth / 2;
    const screenY = (x + y) * this.tileHeight / 2;
    
    // Apply camera position and zoom
    return {
      x: (screenX - this.cameraX) * this.zoom + this.canvas.width / 2,
      y: (screenY - this.cameraY) * this.zoom + this.canvas.height / 2
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
    if (!map || !map.length) return;
    
    // Calculate map size (assuming square map)
    const mapSize = Math.sqrt(map.length);
    
    // Render tiles
    for (let y = 0; y < mapSize; y++) {
      for (let x = 0; x < mapSize; x++) {
        const index = y * mapSize + x;
        const tileType = map[index];
        
        this.renderTile(x, y, tileType);
      }
    }
  }
  
  /**
   * Render a single tile
   * @param {number} x - Grid x coordinate
   * @param {number} y - Grid y coordinate
   * @param {number} tileType - Type of tile
   */
  renderTile(x, y, tileType) {
    const screenPos = this.gridToScreen(x, y);
    
    // Draw tile
    this.drawIsometricTile(
      screenPos.x,
      screenPos.y,
      this.tileWidth * this.zoom,
      this.tileHeight * this.zoom,
      this.colors.tile
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
    
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - halfHeight); // Top
    this.ctx.lineTo(x + halfWidth, y); // Right
    this.ctx.lineTo(x, y + halfHeight); // Bottom
    this.ctx.lineTo(x - halfWidth, y); // Left
    this.ctx.closePath();
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
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - halfHeight); // Top
    this.ctx.lineTo(x + halfWidth, y); // Right
    this.ctx.lineTo(x, y + halfHeight); // Bottom
    this.ctx.lineTo(x - halfWidth, y); // Left
    this.ctx.closePath();
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
    const color = hero.owner === 'ai' ? this.colors.aiHero : this.colors.humanHero;
    
    // Draw hero as a circle
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(
      screenPos.x,
      screenPos.y,
      this.tileWidth * 0.3 * this.zoom,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    
    // Draw outline for current player's hero
    if (isCurrentPlayer) {
      this.ctx.strokeStyle = this.colors.selection;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(
        screenPos.x,
        screenPos.y,
        this.tileWidth * 0.35 * this.zoom,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }
    
    // Draw health bar
    this.renderHealthBar(
      screenPos.x,
      screenPos.y - this.tileHeight * 0.5 * this.zoom,
      this.tileWidth * 0.6 * this.zoom,
      this.tileHeight * 0.1 * this.zoom,
      hero.health / 100
    );
  }
  
  /**
   * Render a unit
   * @param {Object} unit - Unit object
   */
  renderUnit(unit) {
    if (!unit || !unit.position) return;
    
    const screenPos = this.gridToScreen(unit.position.x, unit.position.y);
    const color = unit.owner === 'ai' ? this.colors.aiUnit : this.colors.humanUnit;
    
    // Draw unit as a small square
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      screenPos.x - this.tileWidth * 0.2 * this.zoom,
      screenPos.y - this.tileHeight * 0.2 * this.zoom,
      this.tileWidth * 0.4 * this.zoom,
      this.tileHeight * 0.4 * this.zoom
    );
    
    // Draw health bar
    this.renderHealthBar(
      screenPos.x,
      screenPos.y - this.tileHeight * 0.3 * this.zoom,
      this.tileWidth * 0.4 * this.zoom,
      this.tileHeight * 0.1 * this.zoom,
      unit.health / 50
    );
  }
  
  /**
   * Render a building
   * @param {Object} building - Building object
   */
  renderBuilding(building) {
    if (!building || !building.position) return;
    
    const screenPos = this.gridToScreen(building.position.x, building.position.y);
    const color = building.owner === 'ai' ? this.colors.aiBuilding : this.colors.humanBuilding;
    
    // Draw building as a larger diamond
    this.drawIsometricTile(
      screenPos.x,
      screenPos.y,
      this.tileWidth * 1.5 * this.zoom,
      this.tileHeight * 1.5 * this.zoom,
      color
    );
    
    // Draw building outline
    this.drawIsometricTileOutline(
      screenPos.x,
      screenPos.y,
      this.tileWidth * 1.5 * this.zoom,
      this.tileHeight * 1.5 * this.zoom,
      this.darkenColor(color, 0.5)
    );
    
    // Draw health bar
    this.renderHealthBar(
      screenPos.x,
      screenPos.y - this.tileHeight * 0.8 * this.zoom,
      this.tileWidth * 0.8 * this.zoom,
      this.tileHeight * 0.1 * this.zoom,
      building.health / 200
    );
    
    // Draw build progress if not complete
    if (!building.isComplete) {
      this.renderBuildProgress(
        screenPos.x,
        screenPos.y - this.tileHeight * 0.6 * this.zoom,
        this.tileWidth * 0.8 * this.zoom,
        this.tileHeight * 0.1 * this.zoom,
        building.buildProgress / 100
      );
    }
  }
  
  /**
   * Render a health bar
   * @param {number} x - Screen x coordinate
   * @param {number} y - Screen y coordinate
   * @param {number} width - Bar width
   * @param {number} height - Bar height
   * @param {number} percentage - Health percentage (0-1)
   */
  renderHealthBar(x, y, width, height, percentage) {
    // Clamp percentage to 0-1
    percentage = Math.max(0, Math.min(1, percentage));
    
    // Bar background
    this.ctx.fillStyle = '#333333';
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height);
    
    // Health bar color based on percentage
    let color;
    if (percentage > 0.6) {
      color = '#00ff00'; // Green
    } else if (percentage > 0.3) {
      color = '#ffff00'; // Yellow
    } else {
      color = '#ff0000'; // Red
    }
    
    // Health bar
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x - width / 2,
      y - height / 2,
      width * percentage,
      height
    );
    
    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
  }
  
  /**
   * Render a build progress bar
   * @param {number} x - Screen x coordinate
   * @param {number} y - Screen y coordinate
   * @param {number} width - Bar width
   * @param {number} height - Bar height
   * @param {number} percentage - Progress percentage (0-1)
   */
  renderBuildProgress(x, y, width, height, percentage) {
    // Clamp percentage to 0-1
    percentage = Math.max(0, Math.min(1, percentage));
    
    // Bar background
    this.ctx.fillStyle = '#333333';
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height);
    
    // Progress bar
    this.ctx.fillStyle = '#0088ff';
    this.ctx.fillRect(
      x - width / 2,
      y - height / 2,
      width * percentage,
      height
    );
    
    // Outline
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
  }
  
  /**
   * Render a selection highlight
   * @param {Object} entity - The selected entity
   */
  renderSelection(entity) {
    if (!entity || !entity.position) return;
    
    const screenPos = this.gridToScreen(entity.position.x, entity.position.y);
    
    this.ctx.strokeStyle = this.colors.selection;
    this.ctx.lineWidth = 2;
    
    if (entity.type === 'hero') {
      // Highlight hero with a circle
      this.ctx.beginPath();
      this.ctx.arc(
        screenPos.x,
        screenPos.y,
        this.tileWidth * 0.35 * this.zoom,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    } else if (entity.type === 'unit') {
      // Highlight unit with a square
      this.ctx.strokeRect(
        screenPos.x - this.tileWidth * 0.25 * this.zoom,
        screenPos.y - this.tileHeight * 0.25 * this.zoom,
        this.tileWidth * 0.5 * this.zoom,
        this.tileHeight * 0.5 * this.zoom
      );
    } else {
      // Highlight building with a diamond
      const halfWidth = this.tileWidth * 0.75 * this.zoom;
      const halfHeight = this.tileHeight * 0.75 * this.zoom;
      
      this.ctx.beginPath();
      this.ctx.moveTo(screenPos.x, screenPos.y - halfHeight);
      this.ctx.lineTo(screenPos.x + halfWidth, screenPos.y);
      this.ctx.lineTo(screenPos.x, screenPos.y + halfHeight);
      this.ctx.lineTo(screenPos.x - halfWidth, screenPos.y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
  
  /**
   * Darken a color by a factor
   * @param {string} color - CSS color string
   * @param {number} factor - Darken factor (0-1)
   * @returns {string} Darkened color
   */
  darkenColor(color, factor) {
    // Simple darkening for hex colors
    if (color.startsWith('#')) {
      let r = parseInt(color.substr(1, 2), 16);
      let g = parseInt(color.substr(3, 2), 16);
      let b = parseInt(color.substr(5, 2), 16);
      
      r = Math.floor(r * (1 - factor));
      g = Math.floor(g * (1 - factor));
      b = Math.floor(b * (1 - factor));
      
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    return color;
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