/**
 * Manages all UI elements and interactions
 */
class UIManager {
  /**
   * Initialize the UI manager
   * @param {Game} game - The main game instance
   */
  constructor(game) {
    this.game = game;
    
    // UI elements
    this.notification = null;
    this.notificationTimeout = null;
    
    // UI containers
    this.resourcesElement = document.getElementById('resources-container');
    this.selectionInfoElement = document.getElementById('selection-info');
    this.notificationElement = document.getElementById('notification');
    this.gameOverElement = document.getElementById('game-over');
    
    // Create UI containers if they don't exist
    this.createUIContainers();
    
    // Hide game over screen initially
    if (this.gameOverElement) {
      this.gameOverElement.style.display = 'none';
    }
  }
  
  /**
   * Create UI containers if they don't exist
   */
  createUIContainers() {
    // Create resources container
    if (!this.resourcesElement) {
      this.resourcesElement = document.createElement('div');
      this.resourcesElement.id = 'resources-container';
      this.resourcesElement.className = 'ui-container';
      document.body.appendChild(this.resourcesElement);
    }
    
    // Create selection info container
    if (!this.selectionInfoElement) {
      this.selectionInfoElement = document.createElement('div');
      this.selectionInfoElement.id = 'selection-info';
      this.selectionInfoElement.className = 'ui-container';
      document.body.appendChild(this.selectionInfoElement);
    }
    
    // Create notification container
    if (!this.notificationElement) {
      this.notificationElement = document.createElement('div');
      this.notificationElement.id = 'notification';
      this.notificationElement.className = 'ui-notification';
      document.body.appendChild(this.notificationElement);
    }
    
    // Create game over container
    if (!this.gameOverElement) {
      this.gameOverElement = document.createElement('div');
      this.gameOverElement.id = 'game-over';
      this.gameOverElement.className = 'ui-game-over';
      document.body.appendChild(this.gameOverElement);
    }
  }
  
  /**
   * Update UI elements based on game state
   */
  update() {
    // Update resources display
    this.updateResourcesDisplay();
    
    // Update selection info
    this.updateSelectionInfo(this.game.selectedEntities);
    
    // Update game time
    this.updateGameTime();
  }
  
  /**
   * Update resources display
   */
  updateResourcesDisplay() {
    if (!this.resourcesElement) return;
    
    // Get current player's resources
    const playerData = this.game.players.get(this.game.playerId);
    if (!playerData || !playerData.resources) return;
    
    // Update resources display
    this.resourcesElement.innerHTML = `
      <div class="resource-item">Wood: ${playerData.resources.wood}</div>
      <div class="resource-item">Stone: ${playerData.resources.stone}</div>
      <div class="resource-item">Food: ${playerData.resources.food}</div>
    `;
  }
  
  /**
   * Update selection info display
   * @param {Array} selectedEntities - Array of selected entities
   */
  updateSelectionInfo(selectedEntities) {
    if (!this.selectionInfoElement) return;
    
    // Clear selection info
    this.selectionInfoElement.innerHTML = '';
    
    // If no entities selected, show message
    if (!selectedEntities || selectedEntities.length === 0) {
      this.selectionInfoElement.innerHTML = '<div class="selection-empty">No selection</div>';
      return;
    }
    
    // Show info for each selected entity
    selectedEntities.forEach(entity => {
      let infoHTML = '';
      
      if (entity.type === 'hero') {
        infoHTML = `
          <div class="selection-header">Hero</div>
          <div class="selection-stats">Health: ${entity.health}/100</div>
        `;
      } else if (entity.type === 'unit') {
        infoHTML = `
          <div class="selection-header">Unit: ${entity.type}</div>
          <div class="selection-stats">Health: ${entity.health}/50</div>
        `;
      } else if (entity.type) {
        infoHTML = `
          <div class="selection-header">Building: ${entity.type}</div>
          <div class="selection-stats">Health: ${entity.health}/200</div>
          <div class="selection-stats">Build Progress: ${entity.isComplete ? 'Complete' : Math.floor(entity.buildProgress) + '%'}</div>
        `;
      }
      
      // Add actions based on entity type
      if (entity.type === 'barracks' && entity.isComplete) {
        infoHTML += `
          <div class="selection-actions">
            <button onclick="window.gameInstance.hireUnit('grunt', '${entity.id}')">Hire Grunt</button>
            <button onclick="window.gameInstance.hireUnit('scout', '${entity.id}')">Hire Scout</button>
          </div>
        `;
      } else if (entity.type === 'factory' && entity.isComplete) {
        infoHTML += `
          <div class="selection-actions">
            <button onclick="window.gameInstance.hireUnit('tank', '${entity.id}')">Hire Tank</button>
          </div>
        `;
      }
      
      // Create and append selection info element
      const selectionElement = document.createElement('div');
      selectionElement.className = 'selection-entity';
      selectionElement.innerHTML = infoHTML;
      this.selectionInfoElement.appendChild(selectionElement);
    });
  }
  
  /**
   * Update game time display
   */
  updateGameTime() {
    // Get time element or create it
    let timeElement = document.getElementById('game-time');
    if (!timeElement) {
      timeElement = document.createElement('div');
      timeElement.id = 'game-time';
      timeElement.className = 'ui-game-time';
      document.body.appendChild(timeElement);
    }
    
    // Convert seconds to minutes and seconds
    const minutes = Math.floor(this.game.gameTime / 60);
    const seconds = this.game.gameTime % 60;
    
    // Format time as MM:SS
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update time display
    timeElement.textContent = formattedTime;
  }
  
  /**
   * Show a notification message
   * @param {string} message - The message to show
   * @param {number} duration - Duration in milliseconds to show the notification
   */
  showNotification(message, duration = 3000) {
    if (!this.notificationElement) return;
    
    // Clear any existing timeout
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    
    // Show notification
    this.notificationElement.textContent = message;
    this.notificationElement.style.display = 'block';
    
    // Hide notification after duration
    this.notificationTimeout = setTimeout(() => {
      this.notificationElement.style.display = 'none';
    }, duration);
  }
  
  /**
   * Show game over screen
   * @param {Object} data - Game over data including winner and stats
   */
  showGameOver(data) {
    if (!this.gameOverElement) return;
    
    // Create game over content
    let content = '';
    
    if (data.winner === 'human') {
      content = `
        <h2>Victory!</h2>
        <p>Humans have defeated the AI!</p>
      `;
    } else if (data.winner === 'ai') {
      content = `
        <h2>Defeat!</h2>
        <p>The AI has overwhelmed the humans!</p>
      `;
    } else {
      content = `
        <h2>Draw!</h2>
        <p>Time has run out with no clear winner.</p>
      `;
    }
    
    // Add stats
    content += `
      <div class="game-stats">
        <div>Game Time: ${Math.floor(data.gameTime / 60)}:${(data.gameTime % 60).toString().padStart(2, '0')}</div>
        <div>Human Base Health: ${data.humanBaseHealth}/1000</div>
        <div>AI Base Health: ${data.aiBaseHealth}/1000</div>
      </div>
      <button id="play-again">Play Again</button>
    `;
    
    // Set content and show game over screen
    this.gameOverElement.innerHTML = content;
    this.gameOverElement.style.display = 'flex';
    
    // Add play again button listener
    const playAgainButton = document.getElementById('play-again');
    if (playAgainButton) {
      playAgainButton.addEventListener('click', () => {
        // Reload the page to start a new game
        window.location.reload();
      });
    }
  }
}

export { UIManager }; 