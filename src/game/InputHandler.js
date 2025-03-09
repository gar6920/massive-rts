/**
 * Handles all user input (mouse, keyboard) for the game
 */
class InputHandler {
    /**
     * Initialize the input handler
     * @param {Game} game - The main game instance
     */
    constructor(game) {
        this.game = game;
        
        // Keyboard state
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            shift: false
        };
        
        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            leftDown: false,
            rightDown: false,
            dragStart: null,
            dragging: false
        };
        
        // Selection box
        this.selectionBox = null;
        
        // Camera movement speed
        this.cameraSpeed = 10;
        
        // Input enabled flag
        this.inputEnabled = true;
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners for user input
     */
    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events
        const canvas = this.game.renderer.canvas;
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick(e);
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    /**
     * Handle keydown events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (!this.inputEnabled) return;
        
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                this.keys.up = true;
                break;
            case 'ArrowDown':
            case 's':
                this.keys.down = true;
                break;
            case 'ArrowLeft':
            case 'a':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
                this.keys.right = true;
                break;
            case 'Shift':
                this.keys.shift = true;
                break;
        }
    }
    
    /**
     * Handle keyup events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyUp(e) {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                this.keys.up = false;
                break;
            case 'ArrowDown':
            case 's':
                this.keys.down = false;
                break;
            case 'ArrowLeft':
            case 'a':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
                this.keys.right = false;
                break;
            case 'Shift':
                this.keys.shift = false;
                break;
        }
    }
    
    /**
     * Handle mousedown events
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseDown(e) {
        if (!this.inputEnabled) return;
        
        // Get mouse position relative to canvas
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Store mouse state
        this.mouse.x = x;
        this.mouse.y = y;
        
        // Handle different mouse buttons
        if (e.button === 0) { // Left click
            this.mouse.leftDown = true;
            this.mouse.dragStart = { x, y };
            
            // If not holding shift, clear selection for new selection
            if (!this.keys.shift) {
                this.game.selectEntity(null);
            }
        } else if (e.button === 2) { // Right click
            this.mouse.rightDown = true;
            
            // Right click is handled in context menu event to prevent the default menu
        }
    }
    
    /**
     * Handle mouseup events
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseUp(e) {
        // Get mouse position relative to canvas
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Handle different mouse buttons
        if (e.button === 0) { // Left click
            this.mouse.leftDown = false;
            
            // If dragging, handle selection box
            if (this.mouse.dragging) {
                this.handleSelectionBox();
            } else {
                // Single click selection
                const gridPos = this.game.renderer.screenToGrid(x, y);
                this.handleSelectionClick(gridPos);
            }
            
            // Reset dragging state
            this.mouse.dragging = false;
            this.mouse.dragStart = null;
            this.selectionBox = null;
        } else if (e.button === 2) { // Right click
            this.mouse.rightDown = false;
        }
    }
    
    /**
     * Handle selection box selection
     */
    handleSelectionBox() {
        if (!this.selectionBox) return;
        
        // Convert selection box to grid coordinates
        const topLeft = this.game.renderer.screenToGrid(this.selectionBox.x, this.selectionBox.y);
        const bottomRight = this.game.renderer.screenToGrid(
            this.selectionBox.x + this.selectionBox.width,
            this.selectionBox.y + this.selectionBox.height
        );
        
        // Find entities in selection box
        const selectedEntities = [];
        
        // Check units
        this.game.units.forEach(unit => {
            if (unit.owner === this.game.playerId) {
                const pos = unit.position;
                if (pos.x >= topLeft.x && pos.x <= bottomRight.x &&
                    pos.y >= topLeft.y && pos.y <= bottomRight.y) {
                    selectedEntities.push(unit);
                }
            }
        });
        
        // If entities are found, select them
        if (selectedEntities.length > 0) {
            this.game.selectMultipleEntities(selectedEntities);
        }
    }
    
    /**
     * Handle mousemove events
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
        // Get mouse position relative to canvas
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update mouse position
        this.mouse.x = x;
        this.mouse.y = y;
        
        // Check if dragging with left mouse button
        if (this.mouse.leftDown && this.mouse.dragStart) {
            // Set dragging flag
            this.mouse.dragging = true;
            
            // Calculate selection box
            this.selectionBox = {
                x: Math.min(this.mouse.dragStart.x, x),
                y: Math.min(this.mouse.dragStart.y, y),
                width: Math.abs(x - this.mouse.dragStart.x),
                height: Math.abs(y - this.mouse.dragStart.y)
            };
        }
        
        // Screen edge camera panning
        const edgeSize = 50;
        if (x < edgeSize) {
            this.game.renderer.panCamera(-this.cameraSpeed, 0);
        } else if (x > this.game.renderer.canvas.width - edgeSize) {
            this.game.renderer.panCamera(this.cameraSpeed, 0);
        }
        
        if (y < edgeSize) {
            this.game.renderer.panCamera(0, -this.cameraSpeed);
        } else if (y > this.game.renderer.canvas.height - edgeSize) {
            this.game.renderer.panCamera(0, this.cameraSpeed);
        }
    }
    
    /**
     * Handle mousewheel events
     * @param {WheelEvent} e - Wheel event
     */
    handleMouseWheel(e) {
        if (!this.inputEnabled) return;
        
        // Prevent default scrolling
        e.preventDefault();
        
        // Adjust zoom level
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.game.renderer.adjustZoom(delta);
    }
    
    /**
     * Handle right-click events
     * @param {MouseEvent} e - Mouse event
     */
    handleRightClick(e) {
        if (!this.inputEnabled) return;
        
        // Get mouse position relative to canvas
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert screen position to grid position
        const gridPos = this.game.renderer.screenToGrid(x, y);
        
        // Check for selected entities
        if (this.game.selectedEntities.length > 0) {
            // Check if clicking on an enemy entity (for attack)
            const targetEntity = this.findEntityAtPosition(gridPos);
            
            if (targetEntity && targetEntity.owner !== this.game.playerId) {
                // Attack the target
                this.game.selectedEntities.forEach(entity => {
                    if (entity.id !== this.game.players.get(this.game.playerId).hero.id) {
                        this.game.attack(entity.id, targetEntity.id);
                    }
                });
            } else {
                // Move to position
                this.game.selectedEntities.forEach(entity => {
                    if (entity.id === this.game.players.get(this.game.playerId).hero.id) {
                        // Move hero
                        this.game.moveHero(gridPos.x, gridPos.y);
                    } else {
                        // Move unit
                        this.game.moveUnit(entity.id, gridPos.x, gridPos.y);
                    }
                });
            }
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Update canvas size in renderer
        this.game.renderer.handleResize();
    }
    
    /**
     * Update camera position based on keyboard input
     */
    updateCameraFromKeys() {
        if (!this.inputEnabled) return;
        
        let dx = 0;
        let dy = 0;
        
        if (this.keys.up) dy -= this.cameraSpeed;
        if (this.keys.down) dy += this.cameraSpeed;
        if (this.keys.left) dx -= this.cameraSpeed;
        if (this.keys.right) dx += this.cameraSpeed;
        
        if (dx !== 0 || dy !== 0) {
            this.game.renderer.panCamera(dx, dy);
        }
    }
    
    /**
     * Handle selection click
     * @param {Object} gridPos - Grid position {x, y}
     */
    handleSelectionClick(gridPos) {
        // Find entity at clicked position
        const entity = this.findEntityAtPosition(gridPos);
        
        if (entity) {
            // If entity belongs to player or is a building that can be selected
            if (entity.owner === this.game.playerId || entity.type === 'building') {
                this.game.selectEntity(entity);
            }
        }
    }
    
    /**
     * Find entity at a grid position
     * @param {Object} gridPos - Grid position {x, y}
     * @returns {Object|null} Entity found at position or null
     */
    findEntityAtPosition(gridPos) {
        // Check for the player's hero
        const playerData = this.game.players.get(this.game.playerId);
        if (playerData && playerData.hero) {
            const heroPos = playerData.hero.position;
            if (Math.abs(heroPos.x - gridPos.x) < 0.5 && Math.abs(heroPos.y - gridPos.y) < 0.5) {
                return playerData.hero;
            }
        }
        
        // Check for units
        for (const [id, unit] of this.game.units) {
            const unitPos = unit.position;
            if (Math.abs(unitPos.x - gridPos.x) < 0.5 && Math.abs(unitPos.y - gridPos.y) < 0.5) {
                return unit;
            }
        }
        
        // Check for buildings
        for (const [id, building] of this.game.buildings) {
            const buildingPos = building.position;
            // Buildings are larger, so check a wider area
            if (Math.abs(buildingPos.x - gridPos.x) < 1.5 && Math.abs(buildingPos.y - gridPos.y) < 1.5) {
                return building;
            }
        }
        
        return null;
    }
    
    /**
     * Update input state
     */
    update() {
        // Update camera based on keys
        this.updateCameraFromKeys();
    }
    
    /**
     * Get current selection box
     * @returns {Object|null} Selection box or null if not dragging
     */
    getSelectionBox() {
        return this.selectionBox;
    }
    
    /**
     * Disable input handling
     */
    disableInput() {
        this.inputEnabled = false;
    }
    
    /**
     * Enable input handling
     */
    enableInput() {
        this.inputEnabled = true;
    }
}

export { InputHandler }; 