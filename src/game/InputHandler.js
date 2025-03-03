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
        this.mousePosition = { x: 0, y: 0 }; // Current mouse position
        this.isMouseDown = false; // Track mouse button state
        this.isDragging = false; // Track if user is dragging
        this.selectionStart = { x: 0, y: 0 }; // Start position of selection box
        this.selectionEnd = { x: 0, y: 0 }; // End position of selection box
        
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
        
        // Prevent context menu from appearing on right-click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Window resize event
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    /**
     * Handle key down events
     */
    handleKeyDown(e) {
        this.keys[e.key] = true;
        
        // Handle camera movement with arrow keys
        this.updateCameraFromKeys();
    }
    
    /**
     * Handle key up events
     */
    handleKeyUp(e) {
        this.keys[e.key] = false;
    }
    
    /**
     * Handle mouse down events
     */
    handleMouseDown(e) {
        this.isMouseDown = true;
        
        // Store the starting position for selection box
        this.selectionStart.x = e.clientX;
        this.selectionStart.y = e.clientY;
        this.selectionEnd.x = e.clientX;
        this.selectionEnd.y = e.clientY;
        
        // Convert to world coordinates
        const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
        
        // Left click (select)
        if (e.button === 0) {
            this.game.handleSelection(worldPos.x, worldPos.y);
        }
        // Right click (command)
        else if (e.button === 2) {
            this.game.handleCommand(worldPos.x, worldPos.y);
        }
    }
    
    /**
     * Handle mouse up events
     */
    handleMouseUp(e) {
        this.isMouseDown = false;
        
        // If we were dragging, process the selection area
        if (this.isDragging) {
            const startWorld = this.camera.screenToWorld(this.selectionStart.x, this.selectionStart.y);
            const endWorld = this.camera.screenToWorld(this.selectionEnd.x, this.selectionEnd.y);
            
            this.game.handleAreaSelection(startWorld, endWorld);
            this.isDragging = false;
        }
    }
    
    /**
     * Handle mouse movement
     */
    handleMouseMove(e) {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
        
        // Update selection box if dragging
        if (this.isMouseDown) {
            this.selectionEnd.x = e.clientX;
            this.selectionEnd.y = e.clientY;
            
            // If mouse has moved enough, consider it a drag
            const dx = Math.abs(this.selectionStart.x - this.selectionEnd.x);
            const dy = Math.abs(this.selectionStart.y - this.selectionEnd.y);
            
            if (dx > 5 || dy > 5) {
                this.isDragging = true;
            }
        }
        
        // Handle camera movement when mouse is near screen edges
        this.updateCameraFromMouse();
    }
    
    /**
     * Handle right-click events
     */
    handleRightClick(e) {
        e.preventDefault();
        // Right-click functionality is handled in mouseDown
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
        if (this.mousePosition.x < threshold) dx -= Config.CAMERA_SPEED;
        if (this.mousePosition.x > Config.CANVAS_WIDTH - threshold) dx += Config.CAMERA_SPEED;
        if (this.mousePosition.y < threshold) dy -= Config.CAMERA_SPEED;
        if (this.mousePosition.y > Config.CANVAS_HEIGHT - threshold) dy += Config.CAMERA_SPEED;
        
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
        if (!this.isDragging) return null;
        
        return {
            x: Math.min(this.selectionStart.x, this.selectionEnd.x),
            y: Math.min(this.selectionStart.y, this.selectionEnd.y),
            width: Math.abs(this.selectionEnd.x - this.selectionStart.x),
            height: Math.abs(this.selectionEnd.y - this.selectionStart.y)
        };
    }
} 