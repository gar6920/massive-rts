/**
 * Unit class for player and AI controlled units
 */
class Unit extends Entity {
    /**
     * Initialize a unit
     */
    constructor(x, y, width, height, isPlayerControlled = false) {
        super(x, y, width, height, isPlayerControlled);
        
        // Movement properties
        this.speed = Config.UNIT_SPEED;
        this.targetX = null;
        this.targetY = null;
        this.isMoving = false;
        
        // Combat properties
        this.attackRange = 50;
        this.attackDamage = 10;
        this.attackCooldown = 1000; // ms
        this.lastAttackTime = 0;
        this.targetEntity = null;
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
    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;
        this.targetEntity = null; // Clear combat target when moving
    }
    
    /**
     * Set a target entity to attack
     */
    attackEntity(entity) {
        this.targetEntity = entity;
        // Move within attack range
        const targetCenter = entity.getCenter();
        const center = this.getCenter();
        const dx = targetCenter.x - center.x;
        const dy = targetCenter.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > this.attackRange) {
            // Calculate position at attack range
            const ratio = this.attackRange / distance;
            const moveToX = center.x + dx * ratio;
            const moveToY = center.y + dy * ratio;
            this.moveTo(moveToX, moveToY);
        } else {
            // Already in range, stop moving
            this.isMoving = false;
        }
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
        
        // Check if we're in attack range
        const distance = this.distanceTo(this.targetEntity);
        if (distance > this.attackRange) {
            // Move closer to target
            this.attackEntity(this.targetEntity);
            return;
        }
        
        // Stop moving if we're in attack range
        this.isMoving = false;
        
        // Attack if cooldown has elapsed
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime >= this.attackCooldown) {
            this.performAttack();
            this.lastAttackTime = currentTime;
        }
    }
    
    /**
     * Perform an attack on the target entity
     */
    performAttack() {
        if (this.targetEntity) {
            this.targetEntity.takeDamage(this.attackDamage);
            console.log(`Unit attacked for ${this.attackDamage} damage`);
        }
    }
    
    /**
     * Handle unit death
     */
    die() {
        console.log('Unit died');
        // In a real implementation, we would remove the unit from the game
        // and possibly play a death animation
    }
} 