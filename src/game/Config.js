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
    static TILE_SIZE = 64; // Size of each tile in pixels - increased for better isometric rendering
    
    // Camera settings
    static CAMERA_SPEED = 10; // Camera movement speed
    static CAMERA_EDGE_THRESHOLD = 50; // Pixels from edge to trigger camera movement
    static ZOOM_MIN = 0.5; // Minimum zoom level (50%)
    static ZOOM_MAX = 2.0; // Maximum zoom level (200%)
    static ZOOM_SPEED = 0.1; // How much to zoom per mouse wheel tick
    static ZOOM_DEFAULT = 0.7; // Default zoom level (70%) - reduced to show more of the map
    
    // Unit settings
    static UNIT_SPEED = 2; // Movement speed of units
    static UNIT_SIZE = 32; // Size of units in pixels
    static UNIT_ATTRIBUTES = {
        SOLDIER: {
            health: 100,
            attackDamage: 10,
            attackRange: 50,
            attackCooldown: 1000,
            speed: 2
        }
    };
    
    // Building settings
    static BUILDING_ATTRIBUTES = {
        BASE: {
            health: 1000,
            productionRate: 0.1, // Units per second
            productionType: 'SOLDIER'
        },
        BARRACKS: {
            health: 500,
            productionRate: 0.2,
            productionType: 'SOLDIER'
        }
    };
    
    // Player settings
    static PLAYER_COLORS = [
        'red',
        'blue',
        'green',
        'yellow'
    ];
    
    // Colors
    static COLORS = {
        GRASS: '#3a8c3a',
        WATER: '#4286f4',
        SAND: '#e6d56e',
        MOUNTAIN: '#7a7a7a',
        FOREST: '#1f5e1f',
        PLAYER_UNIT: '#0000ff',
        ENEMY_UNIT: '#ff0000',
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