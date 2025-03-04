/**
 * Building class for player bases and other structures
 */
class Building extends Entity {
  /**
   * Initialize a building
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width of the building
   * @param {number} height - Height of the building
   * @param {boolean} isPlayerControlled - Whether this building is controlled by the player
   * @param {string} buildingType - Type of building (e.g., 'BASE', 'BARRACKS')
   * @param {string} playerColor - Color of the player (e.g., 'red', 'blue')
   */
  constructor(x, y, width, height, isPlayerControlled = false, buildingType = 'BASE', playerColor = 'red') {
    super(x, y, width, height, isPlayerControlled);
    
    console.log(`Creating building: ${buildingType} at (${x}, ${y}) with color ${playerColor}`);
    
    // Building type and appearance
    this.buildingType = buildingType;
    this.playerColor = playerColor;
    this.image = null;
    this.loadImage();
    
    // Apply attributes based on building type
    const attributes = Config.BUILDING_ATTRIBUTES[buildingType] || Config.BUILDING_ATTRIBUTES.BASE;
    
    // Building properties
    this.productionRate = attributes.productionRate || 0;
    this.productionType = attributes.productionType || null;
    this.productionProgress = 0;
    this.productionQueue = [];
    
    // Health and stats
    this.health = attributes.health || 500;
    this.maxHealth = attributes.health || 500;
  }
  
  /**
   * Load the building image based on player color and building type
   */
  loadImage() {
    const imagePath = `/images/buildings/${this.playerColor}_${this.buildingType.toLowerCase()}.png`;
    console.log(`Loading building image: ${imagePath}`);
    this.image = new Image();
    this.image.src = imagePath;
    this.image.onerror = (e) => {
      console.error(`Failed to load building image: ${imagePath}`, e);
      // Fallback to a colored rectangle
      console.log(`Attempting to load fallback image: /images/buildings/${this.buildingType.toLowerCase()}.png`);
      this.image.src = `/images/buildings/${this.buildingType.toLowerCase()}.png`;
    };
    this.image.onload = () => {
      console.log(`Successfully loaded building image: ${imagePath}`);
    };
  }
  
  /**
   * Set the player color for this building
   */
  setPlayerColor(color) {
    this.playerColor = color;
    this.loadImage();
  }
  
  /**
   * Update building state
   */
  update(deltaTime, game) {
    // Handle production if this building produces units
    if (this.productionRate > 0 && this.productionQueue.length > 0) {
      this.updateProduction(deltaTime, game);
    }
  }
  
  /**
   * Update production progress
   */
  updateProduction(deltaTime, game) {
    // Increase production progress
    this.productionProgress += (this.productionRate * deltaTime) / 1000;
    
    // Check if production is complete
    if (this.productionProgress >= 1) {
      this.completeProduction(game);
      this.productionProgress = 0;
    }
  }
  
  /**
   * Complete production of a unit
   */
  completeProduction(game) {
    if (this.productionQueue.length === 0) return;
    
    // Get the unit type from the queue
    const unitType = this.productionQueue.shift();
    
    // Calculate spawn position (near the building)
    const spawnX = this.x + this.width + 10;
    const spawnY = this.y + this.height / 2;
    
    // Create the unit
    const unit = new Unit(
      spawnX,
      spawnY,
      Config.UNIT_SIZE,
      Config.UNIT_SIZE,
      this.isPlayerControlled,
      unitType,
      this.playerColor
    );
    
    // Set the player ID
    unit.playerId = this.playerId;
    
    // Add the unit to the game
    game.entities.push(unit);
    
    console.log(`Building produced a ${unitType}`);
  }
  
  /**
   * Queue a unit for production
   */
  queueUnit(unitType) {
    this.productionQueue.push(unitType);
    console.log(`Added ${unitType} to production queue`);
  }
  
  /**
   * Take damage from an attacker
   */
  takeDamage(amount, attacker) {
    this.health -= amount;
    console.log(`Building took ${amount} damage, health: ${this.health}`);
    
    // If health drops to 0 or below, destroy the building
    if (this.health <= 0) {
      this.die();
    }
  }
  
  /**
   * Handle building destruction
   */
  die() {
    console.log('Building destroyed');
    // In a real implementation, we would remove the building from the game
    // and possibly play a destruction animation
  }
  
  /**
   * Convert building to a network-friendly format
   */
  toNetworkData() {
    const data = super.toNetworkData();
    return {
      ...data,
      buildingType: this.buildingType,
      playerColor: this.playerColor,
      productionRate: this.productionRate,
      productionType: this.productionType,
      productionProgress: this.productionProgress,
      productionQueue: this.productionQueue
    };
  }
} 