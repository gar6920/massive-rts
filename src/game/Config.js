/**
 * Game configuration
 */
const Config = {
    // Canvas dimensions
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 768,
    
    // Map settings
    MAP_WIDTH: 100,
    MAP_HEIGHT: 100,
    TILE_SIZE: 64,
    
    // Camera settings
    ZOOM_MIN: 0.5,
    ZOOM_MAX: 2.0,
    ZOOM_DEFAULT: 1.0,
    CAMERA_SPEED: 500,
    CAMERA_ZOOM_SPEED: 0.1,
    
    // Debug settings
    DEBUG_MODE: true,
    
    // Colors
    COLORS: {
        SELECTION: '#00ff00',
        PLAYER_UNIT: '#0000ff',
        ENEMY_UNIT: '#ff0000',
        GRID: 'rgba(255, 255, 255, 0.1)',
        GRASS: '#90EE90',
        WATER: '#4169E1',
        MOUNTAIN: '#A0522D',
        FOREST: '#228B22',
        SAND: '#F4A460'
    }
};

// Export the config
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Config };
} 