/**
 * Handles user input (keyboard, mouse) for game interaction
 */
class InputHandler {
    /**
     * Initialize input handler and set up event listeners
     */
    constructor(game) {
        this.game = game;
        this.camera = game.camera;
        this.canvas = game.canvas;
        
        this.keys = {}; // Track pressed keys
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.rightMouseDown = false;
        this.middleMouseDown = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.selectionStartX = 0;
        this.selectionStartY = 0;
        this.selectionEndX = 0;
        this.selectionEndY = 0;
        this.isSelecting = false;
        
        // Minimap element
        this.minimapElement = document.getElementById('minimap');
        
        // Bind event handlers
        this.setupEventListeners();
    }
    
    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('contextmenu', this.handleRightClick.bind(this));
        this.canvas.addEventListener('wheel', this.handleMouseWheel.bind(this));
        
        // Prevent context menu from appearing on right-click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Minimap events
        this.minimapElement.addEventListener('mousedown', this.handleMinimapClick.bind(this));
        this.minimapElement.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Window resize event
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    /**
     * Handle key down events
     */
    handleKeyDown(e) {
        this.keys[e.code] = true;
        
        // Handle specific key presses
        switch (e.code) {
            case 'Escape':
                this.game.deselectAll();
                break;
        }
        
        // Handle camera movement with arrow keys
        this.updateCameraFromKeys();
    }
    
    /**
     * Handle key up events
     */
    handleKeyUp(e) {
        this.keys[e.code] = false;
    }
    
    /**
     * Handle mouse down events
     */
    handleMouseDown(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        // Left mouse button
        if (e.button === 0) {
            this.mouseDown = true;
            this.selectionStartX = e.clientX;
            this.selectionStartY = e.clientY;
            this.selectionEndX = e.clientX;
            this.selectionEndY = e.clientY;
            this.isSelecting = true;
            
            // Check if clicked on an entity
            const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
            this.game.handleEntitySelection(worldPos.x, worldPos.y);
        }
        // Right mouse button
        else if (e.button === 2) {
            this.rightMouseDown = true;
        }
        // Middle mouse button (rollerball)
        else if (e.button === 1) {
            this.middleMouseDown = true;
            e.preventDefault(); // Prevent default middle-click behavior
        }
    }
    
    /**
     * Handle mouse up events
     */
    handleMouseUp(e) {
        // Left mouse button
        if (e.button === 0) {
            this.mouseDown = false;
            
            if (this.isSelecting) {
                // Finalize selection box
                const startWorld = this.camera.screenToWorld(this.selectionStartX, this.selectionStartY);
                const endWorld = this.camera.screenToWorld(this.selectionEndX, this.selectionEndY);
                this.game.selectEntitiesInBox(startWorld.x, startWorld.y, endWorld.x, endWorld.y);
                this.isSelecting = false;
            }
        }
        // Right mouse button
        else if (e.button === 2) {
            this.rightMouseDown = false;
        }
        // Middle mouse button (rollerball)
        else if (e.button === 1) {
            this.middleMouseDown = false;
        }
    }
    
    /**
     * Handle mouse movement
     */
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Update selection box if selecting
        if (this.isSelecting) {
            this.selectionEndX = e.clientX;
            this.selectionEndY = e.clientY;
        }
        
        // Handle middle mouse panning
        if (this.middleMouseDown) {
            const deltaX = this.lastMouseX - e.clientX;
            const deltaY = this.lastMouseY - e.clientY;
            
            // Move camera based on mouse movement
            this.camera.move(deltaX / this.camera.zoom, deltaY / this.camera.zoom);
        }
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        // Handle camera movement when mouse is near screen edges
        this.updateCameraFromMouse();
    }
    
    /**
     * Handle mouse wheel events for zooming
     */
    handleMouseWheel(e) {
        e.preventDefault();
        
        // Determine zoom direction
        const deltaZoom = e.deltaY < 0 ? Config.ZOOM_SPEED : -Config.ZOOM_SPEED;
        
        // Zoom at the mouse position
        this.camera.zoomAt(deltaZoom, e.clientX, e.clientY);
    }
    
    /**
     * Handle right click events
     */
    handleRightClick(e) {
        e.preventDefault(); // Prevent context menu
        
        // If we have selected entities, issue a command
        if (this.game.selectedEntities.length > 0) {
            const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
            this.game.handleCommand(worldPos.x, worldPos.y);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        Config.updateDimensions();
        this.camera.updateDimensions();
        this.game.handleResize();
    }
    
    /**
     * Update camera position based on keyboard input
     */
    updateCameraFromKeys() {
        let dx = 0;
        let dy = 0;
        
        if (this.keys['ArrowUp'] || this.keys['w']) dy -= Config.CAMERA_SPEED;
        if (this.keys['ArrowDown'] || this.keys['s']) dy += Config.CAMERA_SPEED;
        if (this.keys['ArrowLeft'] || this.keys['a']) dx -= Config.CAMERA_SPEED;
        if (this.keys['ArrowRight'] || this.keys['d']) dx += Config.CAMERA_SPEED;
        
        if (dx !== 0 || dy !== 0) {
            this.camera.move(dx, dy);
        }
    }
    
    /**
     * Update camera position when mouse is near screen edges
     */
    updateCameraFromMouse() {
        let dx = 0;
        let dy = 0;
        const threshold = Config.CAMERA_EDGE_THRESHOLD;
        
        // Move camera if mouse is near the edges
        if (this.mouseX < threshold) dx -= Config.CAMERA_SPEED;
        if (this.mouseX > Config.CANVAS_WIDTH - threshold) dx += Config.CAMERA_SPEED;
        if (this.mouseY < threshold) dy -= Config.CAMERA_SPEED;
        if (this.mouseY > Config.CANVAS_HEIGHT - threshold) dy += Config.CAMERA_SPEED;
        
        if (dx !== 0 || dy !== 0) {
            this.camera.move(dx, dy);
        }
    }
    
    /**
     * Update method called each frame
     */
    update() {
        this.updateCameraFromKeys();
        this.updateCameraFromMouse();
    }
    
    /**
     * Get the current selection box in screen coordinates
     */
    getSelectionBox() {
        if (!this.isSelecting) return null;
        
        return {
            x: Math.min(this.selectionStartX, this.selectionEndX),
            y: Math.min(this.selectionStartY, this.selectionEndY),
            width: Math.abs(this.selectionEndX - this.selectionStartX),
            height: Math.abs(this.selectionEndY - this.selectionStartY)
        };
    }
    
    /**
     * Handle minimap clicks
     */
    handleMinimapClick(e) {
        e.stopPropagation(); // Prevent event from bubbling to canvas
        
        // Get minimap dimensions
        const minimapRect = this.minimapElement.getBoundingClientRect();
        
        // Calculate relative position within minimap (0-1)
        const relativeX = (e.clientX - minimapRect.left) / minimapRect.width;
        const relativeY = (e.clientY - minimapRect.top) / minimapRect.height;
        
        // Convert to world coordinates
        const worldX = relativeX * Config.MAP_WIDTH * Config.TILE_SIZE;
        const worldY = relativeY * Config.MAP_HEIGHT * Config.TILE_SIZE;
        
        // Left click - move camera to this position
        if (e.button === 0) {
            // Center camera on clicked position
            this.camera.centerOn(worldX, worldY);
        }
        // Right click - move selected units to this position
        else if (e.button === 2) {
            if (this.game.selectedEntities.length > 0) {
                this.game.handleCommand(worldX, worldY);
            }
        }
    }
} 