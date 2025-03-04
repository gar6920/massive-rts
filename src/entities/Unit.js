/**
 * Unit class for player and AI controlled units
 */
class Unit extends Entity {
    /**
     * Initialize a unit
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width of the unit
     * @param {number} height - Height of the unit
     * @param {boolean} isPlayerControlled - Whether this unit is controlled by the player
     * @param {string} unitType - Type of unit (e.g., 'SOLDIER')
     * @param {string} playerColor - Color of the player (e.g., 'red', 'blue')
     */
    constructor(x, y, width, height, isPlayerControlled = false, unitType = 'SOLDIER', playerColor = 'red') {
        super(x, y, width, height, isPlayerControlled);
        
        // Unit type and appearance
        this.unitType = unitType;
        this.playerColor = playerColor;
        this.image = null;
        this.loadImage();
        
        // Apply attributes based on unit type
        const attributes = Config.UNIT_ATTRIBUTES[unitType] || Config.UNIT_ATTRIBUTES.SOLDIER;
        
        // Movement properties
        this.speed = attributes.speed || Config.UNIT_SPEED;
        this.targetX = null;
        this.targetY = null;
        this.isMoving = false;
        
        // Combat properties
        this.attackRange = attributes.attackRange || 50;
        this.attackDamage = attributes.attackDamage || 10;
        this.attackCooldown = attributes.attackCooldown || 1000; // ms
        this.lastAttackTime = 0;
        this.targetEntity = null;
        
        // Health and stats
        this.health = attributes.health || 100;
        this.maxHealth = attributes.health || 100;
        this.level = 1;
        this.experience = 0;
    }
    
    /**
     * Load the unit image based on player color and unit type
     */
    loadImage() {
        const imagePath = `/images/units/${this.playerColor}_${this.unitType.toLowerCase()}.svg`;
        this.image = new Image();
        this.image.src = imagePath;
        this.image.onerror = () => {
            console.error(`Failed to load unit image: ${imagePath}`);
            // Fallback to default image if available
            this.image.src = '/images/units/red_soldier.svg';
        };
    }
    
    /**
     * Set the player color for this unit
     */
    setPlayerColor(color) {
        this.playerColor = color;
        this.loadImage();
    }
    
    /**
     * Update unit state
     */
    update(deltaTime, game) {
        // Handle movement if we have a target
        if (this.isMoving && this.targetX !== null && this.targetY !== null) {
            this.moveTowardsTarget(deltaTime);
        }
        
        // Handle combat if we have a target entity
        if (this.targetEntity) {
            this.updateCombat(deltaTime, game);
        }
    }
    
    /**
     * Move towards the target position
     */
    moveTowardsTarget(deltaTime) {
        // Calculate direction to target
        const center = this.getCenter();
        const dx = this.targetX - center.x;
        const dy = this.targetY - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If we're close enough to the target, stop moving
        if (distance < 5) {
            this.isMoving = false;
            return;
        }
        
        // Normalize direction and apply speed
        const moveSpeed = this.speed * (deltaTime / 1000);
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        // Update position
        this.x += normalizedDx * moveSpeed;
        this.y += normalizedDy * moveSpeed;
    }
    
    /**
     * Set a movement target
     */
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;
    }
    
    /**
     * Update combat state
     */
    updateCombat(deltaTime, game) {
        // Check if target is still valid
        if (!this.targetEntity || this.targetEntity.health <= 0) {
            this.targetEntity = null;
            return;
        }
        
        // Calculate distance to target
        const center = this.getCenter();
        const targetCenter = this.targetEntity.getCenter();
        const dx = targetCenter.x - center.x;
        const dy = targetCenter.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If target is out of range, move towards it
        if (distance > this.attackRange) {
            this.setTarget(targetCenter.x, targetCenter.y);
            return;
        }
        
        // If we're in range and attack cooldown is over, attack
        const now = Date.now();
        if (now - this.lastAttackTime >= this.attackCooldown) {
            this.attack(this.targetEntity);
            this.lastAttackTime = now;
        }
    }
    
    /**
     * Attack a target entity
     */
    attack(target) {
        console.log(`Unit attacking target for ${this.attackDamage} damage`);
        target.takeDamage(this.attackDamage, this);
    }
    
    /**
     * Take damage from an attacker
     */
    takeDamage(amount, attacker) {
        this.health -= amount;
        console.log(`Unit took ${amount} damage, health: ${this.health}`);
        
        // If health drops to 0 or below, die
        if (this.health <= 0) {
            this.die();
            
            // Give experience to the attacker if it's a unit
            if (attacker instanceof Unit) {
                attacker.gainExperience(this.level * 10);
            }
        }
    }
    
    /**
     * Gain experience points
     */
    gainExperience(amount) {
        this.experience += amount;
        console.log(`Unit gained ${amount} experience, total: ${this.experience}`);
        
        // Check for level up (simple formula: 100 * current level)
        const experienceNeeded = this.level * 100;
        if (this.experience >= experienceNeeded) {
            this.levelUp();
        }
    }
    
    /**
     * Level up the unit
     */
    levelUp() {
        this.level++;
        this.experience = 0;
        
        // Increase stats
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.attackDamage += 5;
        
        console.log(`Unit leveled up to level ${this.level}`);
    }
    
    /**
     * Handle unit death
     */
    die() {
        console.log('Unit died');
        // In a real implementation, we would remove the unit from the game
        // and possibly play a death animation
    }
    
    /**
     * Convert unit to a network-friendly format
     */
    toNetworkData() {
        const data = super.toNetworkData();
        return {
            ...data,
            unitType: this.unitType,
            playerColor: this.playerColor,
            speed: this.speed,
            attackRange: this.attackRange,
            attackDamage: this.attackDamage,
            attackCooldown: this.attackCooldown,
            level: this.level,
            experience: this.experience,
            targetX: this.targetX,
            targetY: this.targetY,
            isMoving: this.isMoving
        };
    }
} 