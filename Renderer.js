renderEntities() {
    this.game.entities.forEach(entity => {
        if (!this.camera.isVisible(entity.x, entity.y, entity.width, entity.height)) {
            return;
        }
        const isoX = (entity.x - entity.y) / 2;
        const isoY = (entity.x + entity.y) / 4;
        const screenPos = this.camera.worldToScreen(isoX, isoY);
        // Proceed with existing rendering logic using screenPos.x, screenPos.y
        if (entity.image) {
            this.ctx.drawImage(entity.image, screenPos.x, screenPos.y);
        } else {
            this.ctx.fillStyle = entity.isPlayerControlled ? Config.COLORS.PLAYER_UNIT : Config.COLORS.ENEMY_UNIT;
            this.ctx.fillRect(screenPos.x, screenPos.y, entity.width * this.camera.zoom, entity.height * this.camera.zoom);
        }
        // Add any additional rendering (e.g., selection highlights, health bars)
    });
} 