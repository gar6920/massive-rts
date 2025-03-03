/**
 * Base class for all game entities (units, buildings, etc.)
 */
class Entity {
    /**
     * Initialize an entity
     */
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.isSelected = false;
        this.health = 100;
        this.maxHealth = 100;
    }
    
    /**
     * Update entity state
     */
    update(deltaTime, game) {
        // Base entity doesn't do anything in update
        // This method should be overridden by subclasses
    }
    
    /**
     * Check if this entity collides with another entity
     */
    collidesWith(otherEntity) {
        return (
            this.x < otherEntity.x + otherEntity.width &&
            this.x + this.width > otherEntity.x &&
            this.y < otherEntity.y + otherEntity.height &&
            this.y + this.height > otherEntity.y
        );
    }
    
    /**
     * Check if this entity contains a point
     */
    containsPoint(x, y) {
        return (
            x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height
        );
    }
    
    /**
     * Take damage
     */
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }
    
    /**
     * Entity death
     */
    die() {
        // This method should be overridden by subclasses
        console.log('Entity died');
    }
    
    /**
     * Get the center position of the entity
     */
    getCenter() {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }
    
    /**
     * Calculate distance to another entity or point
     */
    distanceTo(target) {
        let targetX, targetY;
        
        if (target instanceof Entity) {
            const targetCenter = target.getCenter();
            targetX = targetCenter.x;
            targetY = targetCenter.y;
        } else {
            targetX = target.x;
            targetY = target.y;
        }
        
        const center = this.getCenter();
        const dx = targetX - center.x;
        const dy = targetY - center.y;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
} 