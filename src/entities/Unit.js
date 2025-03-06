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
        
        // Animation properties
        this.isAttacking = false;
        this.attackAnimationTime = null;
        this.attackAnimationDuration = 500; // Animation lasts 500ms
        this.isDestroyed = false;
        this.deathAnimationTime = null;
        this.deathAnimationDuration = 1000; // Animation lasts 1 second
    }
    
    /**
     * Load the unit image based on player color and unit type
     */
    loadImage() {
        const imagePath = `/images/units/${this.playerColor}_${this.unitType.toLowerCase()}.png`;
        console.log(`Loading unit image: ${imagePath}`);
        this.image = new Image();
        this.image.src = imagePath;
        this.image.onerror = () => {
            console.error(`Failed to load unit image: ${imagePath}`);
            // Fallback to default image if available
            console.log(`Attempting to load fallback image: /images/units/${this.unitType.toLowerCase()}.png`);
            this.image.src = `/images/units/${this.unitType.toLowerCase()}.png`;
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
        // Only use local movement if we're not receiving server updates
        // This prevents conflicts with the interpolation in Game.updateEntities
        if (this.serverX === undefined && this.isMoving && this.targetX !== null && this.targetY !== null) {
            this.moveTowardsTarget(deltaTime);
        }
        
        // Handle combat if we have a target entity
        if (this.targetEntity) {
            this.updateCombat(deltaTime, game);
        }
        
        // Update any active animations
        if (this.isAttacking && this.attackAnimationTime) {
            this.updateAttackAnimation(deltaTime);
        }
        
        if (this.isDestroyed && this.deathAnimationTime) {
            this.updateDeathAnimation(deltaTime);
        }
    }
    
    /**
     * Move towards the target position
     */
    moveTowardsTarget(deltaTime) {
        // Calculate direction to target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If we're close enough to the target, stop moving
        if (distance < 1) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isMoving = false;
            this.targetX = null;
            this.targetY = null;
            return;
        }
        
        // Normalize direction and apply speed
        const moveSpeed = Config.UNIT_SPEED * (deltaTime / 1000);
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        // Calculate new position
        const newX = this.x + normalizedDx * moveSpeed;
        const newY = this.y + normalizedDy * moveSpeed;
        
        // Ensure the unit stays within map boundaries
        const mapWidth = Config.MAP_WIDTH * Config.TILE_SIZE;
        const mapHeight = Config.MAP_HEIGHT * Config.TILE_SIZE;
        
        this.x = Math.max(0, Math.min(newX, mapWidth - this.width));
        this.y = Math.max(0, Math.min(newY, mapHeight - this.height));
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
        this.performAttackAnimation();
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
        this.playDeathAnimation();
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
            isMoving: this.isMoving,
            isAttacking: this.isAttacking,
            attackAnimationTime: this.attackAnimationTime,
            attackAnimationDuration: this.attackAnimationDuration,
            isDestroyed: this.isDestroyed,
            deathAnimationTime: this.deathAnimationTime,
            deathAnimationDuration: this.deathAnimationDuration
        };
    }
    
    /**
     * Perform attack animation
     */
    performAttackAnimation() {
        this.isAttacking = true;
        this.attackAnimationTime = Date.now();
        this.attackAnimationDuration = 500; // Animation lasts 500ms
    }
    
    /**
     * Update attack animation
     */
    updateAttackAnimation(deltaTime) {
        const now = Date.now();
        const elapsed = now - this.attackAnimationTime;
        
        if (elapsed >= this.attackAnimationDuration) {
            // Animation complete
            this.attackAnimationTime = null;
        }
    }
    
    /**
     * Play death animation
     */
    playDeathAnimation() {
        this.isDestroyed = true;
        this.deathAnimationTime = Date.now();
        this.deathAnimationDuration = 1000; // Animation lasts 1 second
    }
    
    /**
     * Update death animation
     */
    updateDeathAnimation(deltaTime) {
        const now = Date.now();
        const elapsed = now - this.deathAnimationTime;
        
        if (elapsed >= this.deathAnimationDuration) {
            // Animation complete, unit should be removed
            this.deathAnimationTime = null;
        }
    }
    
    /**
     * Render the unit
     */
    render(ctx, camera) {
        // If unit is destroyed and playing death animation, modify rendering
        if (this.isDestroyed) {
            // Skip rendering if death animation is complete
            if (!this.deathAnimationTime) return;
            
            // Apply death animation effects
            const elapsed = Date.now() - this.deathAnimationTime;
            const progress = Math.min(1, elapsed / this.deathAnimationDuration);
            
            // Fade out as animation progresses
            ctx.globalAlpha = 1 - progress;
        }
        
        // Get screen position
        const screenPos = camera.worldToScreen(this.x, this.y);
        
        // Draw selection indicator if selected
        if (this.isSelected) {
            ctx.beginPath();
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.arc(
                screenPos.x + this.width / 2,
                screenPos.y + this.height / 2,
                this.width / 1.5,
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
        
        // Draw attack indicator if attacking
        if (this.isAttacking && this.attackAnimationTime) {
            const elapsed = Date.now() - this.attackAnimationTime;
            const progress = Math.min(1, elapsed / this.attackAnimationDuration);
            
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2 * (1 - progress);
            ctx.arc(
                screenPos.x + this.width / 2,
                screenPos.y + this.height / 2,
                this.width / 1.2 * (1 + progress * 0.5),
                0,
                Math.PI * 2
            );
            ctx.stroke();
        }
        
        // Draw the unit image
        if (this.image && this.image.complete) {
            ctx.drawImage(
                this.image,
                screenPos.x,
                screenPos.y,
                this.width,
                this.height
            );
        } else {
            // Fallback if image is not loaded
            ctx.fillStyle = this.playerColor || 'blue';
            ctx.fillRect(
                screenPos.x,
                screenPos.y,
                this.width,
                this.height
            );
        }
        
        // Draw health bar
        this.renderHealthBar(ctx, screenPos);
        
        // Reset alpha if modified
        if (this.isDestroyed) {
            ctx.globalAlpha = 1;
        }
    }
} 