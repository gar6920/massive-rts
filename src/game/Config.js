/**
 * Game configuration constants
 */
class Config {
    // Canvas and rendering
    static CANVAS_WIDTH = window.innerWidth;
    static CANVAS_HEIGHT = window.innerHeight;
    
    // Map settings
    static MAP_WIDTH = 100; // Number of tiles horizontally
    static MAP_HEIGHT = 100; // Number of tiles vertically
    static TILE_SIZE = 32; // Size of each tile in pixels
    
    // Camera settings
    static CAMERA_SPEED = 10; // Camera movement speed
    static CAMERA_EDGE_THRESHOLD = 50; // Pixels from edge to trigger camera movement
    
    // Unit settings
    static UNIT_SPEED = 2; // Movement speed of units
    static UNIT_SIZE = 24; // Size of units in pixels
    
    // Colors
    static COLORS = {
        GRASS: '#3a8c3a',
        WATER: '#4286f4',
        SAND: '#e6d56e',
        MOUNTAIN: '#7a7a7a',
        FOREST: '#1f5e1f',
        PLAYER_UNIT: '#ff0000',
        ENEMY_UNIT: '#0000ff',
        SELECTION: '#ffffff',
        GRID: 'rgba(0, 0, 0, 0.2)'
    };
    
    // Debug settings
    static DEBUG_MODE = true; // Enable/disable debug information
    static SHOW_GRID = true; // Show grid lines
    
    // Update the canvas dimensions when the window is resized
    static updateDimensions() {
        this.CANVAS_WIDTH = window.innerWidth;
        this.CANVAS_HEIGHT = window.innerHeight;
    }
} 