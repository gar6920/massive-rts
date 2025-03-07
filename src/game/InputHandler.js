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
        this.clickStartTime = 0;
        this.inputEnabled = true; // Flag to control input
        
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
        // Skip if input is disabled
        if (!this.inputEnabled) return;
        
        this.keys[e.key] = true;
        
        // Handle specific key presses
        switch (e.key) {
            case 'Escape':
                // Deselect all units
                this.game.deselectAll();
                break;
            case 'c':
                // Center the camera on the map
                this.camera.centerOnMap();
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
        // Skip if input is disabled
        if (!this.inputEnabled) return;
        
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
            this.isSelecting = false; // Start false, will become true if mouse moves
            this.clickStartTime = Date.now();
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
        // Only update mouse state if input is disabled
        if (!this.inputEnabled) {
            if (e.button === 0) this.mouseDown = false;
            else if (e.button === 2) this.rightMouseDown = false;
            else if (e.button === 1) this.middleMouseDown = false;
            return;
        }
        
        if (e.button === 0) {
            this.mouseDown = false;

            // Get world coordinates for both start and end points
            const startWorld = this.camera.screenToWorld(this.selectionStartX, this.selectionStartY);
            const endWorld = this.camera.screenToWorld(this.selectionEndX, this.selectionEndY);
            
            // Calculate the size of the selection box in screen pixels
            const selectionWidth = Math.abs(this.selectionEndX - this.selectionStartX);
            const selectionHeight = Math.abs(this.selectionEndY - this.selectionStartY);
            
            // If the selection box is very small, treat it as a click
            if (selectionWidth < 5 && selectionHeight < 5) {
                const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
                this.game.handleEntitySelection(worldPos.x, worldPos.y);
            } else {
                // Otherwise use box selection
                this.game.selectEntitiesInBox(startWorld.x, startWorld.y, endWorld.x, endWorld.y);
            }
            
            this.isSelecting = false;
        } else if (e.button === 2) {
            this.rightMouseDown = false;
        } else if (e.button === 1) {
            this.middleMouseDown = false;
        }
    }
    
    /**
     * Handle mouse movement
     */
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        // Skip selection and panning if input is disabled
        if (!this.inputEnabled) {
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            return;
        }
        
        // Start selection if mouse has moved enough while button is down
        if (this.mouseDown && !this.isSelecting) {
            const mouseMoved = 
                Math.abs(e.clientX - this.selectionStartX) > 5 || 
                Math.abs(e.clientY - this.selectionStartY) > 5;
            
            if (mouseMoved) {
                this.isSelecting = true;
            }
        }
        
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
        // Skip if input is disabled
        if (!this.inputEnabled) return;
        
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
        
        // Skip if input is disabled
        if (!this.inputEnabled) return;
        
        // If we have selected entities, issue a command
        if (this.game.selectedEntities.length > 0) {
            const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
            console.log(`Right click at screen (${e.clientX}, ${e.clientY}), world (${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)})`);
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
        // Only update camera from keyboard and mouse if input is enabled
        if (this.inputEnabled) {
            this.updateCameraFromKeys();
            this.updateCameraFromMouse();
        }
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
        // Skip if input is disabled
        if (!this.inputEnabled) return;
        
        e.stopPropagation(); // Prevent event from bubbling to canvas
        
        // Get minimap dimensions
        const minimapRect = this.minimapElement.getBoundingClientRect();
        
        // Calculate relative position within minimap (0-1)
        const relativeX = (e.clientX - minimapRect.left) / minimapRect.width;
        const relativeY = (e.clientY - minimapRect.top) / minimapRect.height;
        
        // For isometric view, we need to convert differently
        // First, adjust for the minimap's isometric representation
        const adjustedX = (relativeX - 0.5) * 2; // Convert from 0-1 to -1 to 1 (centered)
        const adjustedY = (relativeY - 0.25) * 4; // Adjust for the 1/4 offset in the minimap
        
        // Convert to grid coordinates
        const gridX = Math.floor((adjustedX + adjustedY) / 2 * Config.MAP_WIDTH);
        const gridY = Math.floor((adjustedY - adjustedX) / 2 * Config.MAP_HEIGHT);
        
        // Clamp to valid grid coordinates
        const clampedGridX = Math.max(0, Math.min(gridX, Config.MAP_WIDTH - 1));
        const clampedGridY = Math.max(0, Math.min(gridY, Config.MAP_HEIGHT - 1));
        
        // Convert to isometric world coordinates
        const isoPos = this.game.map.gridToIso(clampedGridX, clampedGridY);
        
        console.log(`Minimap click: screen(${relativeX.toFixed(2)}, ${relativeY.toFixed(2)}) -> grid(${clampedGridX}, ${clampedGridY}) -> iso(${isoPos.x.toFixed(2)}, ${isoPos.y.toFixed(2)})`);
        
        // Left click - move camera to this position
        if (e.button === 0) {
            // Center camera on clicked position
            this.camera.centerOn(isoPos.x, isoPos.y);
        }
        // Right click - move selected units to this position
        else if (e.button === 2) {
            if (this.game.selectedEntities.length > 0) {
                this.game.handleCommand(isoPos.x, isoPos.y);
            }
        }
    }
    
    /**
     * Disable user input (for game end screen)
     */
    disableInput() {
        console.log('Disabling game input');
        this.inputEnabled = false;
        this.game.deselectAll(); // Clear selection when game ends
    }
    
    /**
     * Enable user input (when a new game starts)
     */
    enableInput() {
        console.log('Enabling game input');
        this.inputEnabled = true;
    }
} 