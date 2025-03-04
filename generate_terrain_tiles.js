/**
 * Isometric Terrain Tile Generator
 * 
 * This script generates basic isometric terrain tiles (grass, mountain, water)
 * as PNG files for use in an isometric game.
 * 
 * Dependencies:
 * - Node.js
 * - canvas npm package (install with: npm install canvas)
 * 
 * Usage:
 * 1. Install dependencies: npm install canvas
 * 2. Run script: node generate_terrain_tiles.js
 * 3. Check current directory for generated PNG files
 */

const fs = require('fs');
const { createCanvas } = require('canvas');

// Configuration
const TILE_WIDTH = 128;
const TILE_HEIGHT = 64;
const OUTPUT_DIR = './';

// Define terrain types with their properties
const terrainTypes = [
    {
        name: 'grass',
        baseColor: '#7CBA3D',
        patternColor: '#8BC34A',
        patternType: 'noise'
    },
    {
        name: 'mountain',
        baseColor: '#8D6E63',
        patternColor: '#6D4C41',
        patternType: 'rocky'
    },
    {
        name: 'water',
        baseColor: '#4B93D1',
        patternColor: '#64B5F6',
        patternType: 'waves'
    },
    {
        name: 'forest',
        baseColor: '#2E7D32',
        patternColor: '#1B5E20',
        patternType: 'trees'
    },
    {
        name: 'sand',
        baseColor: '#FDD835',
        patternColor: '#F9A825',
        patternType: 'noise'
    }
];

/**
 * Main function to generate all terrain tiles
 */
function generateTerrainTiles() {
    console.log('Generating isometric terrain tiles...');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Generate each terrain type
    terrainTypes.forEach(terrain => {
        generateTile(terrain);
    });
    
    console.log('Tile generation complete! Files saved to:', OUTPUT_DIR);
}

/**
 * Generate a single terrain tile
 * @param {Object} terrain - Terrain configuration object
 */
function generateTile(terrain) {
    console.log(`Generating ${terrain.name} tile...`);
    
    // Create canvas with specified dimensions
    const canvas = createCanvas(TILE_WIDTH, TILE_HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with transparency
    ctx.clearRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    
    // Draw the isometric diamond shape
    drawIsometricTile(ctx, terrain);
    
    // Save the canvas as a PNG file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`${OUTPUT_DIR}${terrain.name}.png`, buffer);
    
    console.log(`✓ ${terrain.name}.png created`);
}

/**
 * Draw an isometric tile with the specified terrain properties
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} terrain - Terrain configuration object
 */
function drawIsometricTile(ctx, terrain) {
    // Draw the diamond shape
    ctx.beginPath();
    ctx.moveTo(TILE_WIDTH / 2, 0);              // Top point
    ctx.lineTo(TILE_WIDTH, TILE_HEIGHT / 2);    // Right point
    ctx.lineTo(TILE_WIDTH / 2, TILE_HEIGHT);    // Bottom point
    ctx.lineTo(0, TILE_HEIGHT / 2);             // Left point
    ctx.closePath();
    
    // Fill with base color
    ctx.fillStyle = terrain.baseColor;
    ctx.fill();
    
    // Add pattern based on terrain type
    switch (terrain.patternType) {
        case 'noise':
            drawNoisePattern(ctx, terrain);
            break;
        case 'rocky':
            drawRockyPattern(ctx, terrain);
            break;
        case 'waves':
            drawWavePattern(ctx, terrain);
            break;
        case 'trees':
            drawTreePattern(ctx, terrain);
            break;
    }
    
    // Add shading for 3D effect
    addShading(ctx);
    
    // Add border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

/**
 * Draw a noise pattern (for grass and sand)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} terrain - Terrain configuration object
 */
function drawNoisePattern(ctx, terrain) {
    ctx.save();
    
    // Clip to the diamond shape
    clipToDiamond(ctx);
    
    ctx.fillStyle = terrain.patternColor;
    
    // Create a noise pattern with small dots
    for (let i = 0; i < 500; i++) {
        const x = Math.random() * TILE_WIDTH;
        const y = Math.random() * TILE_HEIGHT;
        const size = Math.random() * 1.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

/**
 * Draw a rocky pattern (for mountains)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} terrain - Terrain configuration object
 */
function drawRockyPattern(ctx, terrain) {
    ctx.save();
    
    // Clip to the diamond shape
    clipToDiamond(ctx);
    
    // Draw mountain peak
    const gradient = ctx.createLinearGradient(
        TILE_WIDTH / 2, 0,
        TILE_WIDTH / 2, TILE_HEIGHT
    );
    gradient.addColorStop(0, terrain.patternColor);
    gradient.addColorStop(1, terrain.baseColor);
    
    ctx.fillStyle = gradient;
    
    // Draw a triangular mountain shape
    ctx.beginPath();
    ctx.moveTo(TILE_WIDTH / 2, TILE_HEIGHT / 4);
    ctx.lineTo(TILE_WIDTH * 0.7, TILE_HEIGHT * 0.7);
    ctx.lineTo(TILE_WIDTH * 0.3, TILE_HEIGHT * 0.7);
    ctx.closePath();
    ctx.fill();
    
    // Add some rocky details
    ctx.fillStyle = terrain.patternColor;
    for (let i = 0; i < 15; i++) {
        const x = TILE_WIDTH * 0.3 + Math.random() * (TILE_WIDTH * 0.4);
        const y = TILE_HEIGHT * 0.4 + Math.random() * (TILE_HEIGHT * 0.3);
        const size = 2 + Math.random() * 5;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y - size / 2);
        ctx.lineTo(x + size * 1.5, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.closePath();
        ctx.fill();
    }
    
    // Add snow cap
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(TILE_WIDTH / 2, TILE_HEIGHT / 4);
    ctx.lineTo(TILE_WIDTH / 2 + 10, TILE_HEIGHT / 4 + 10);
    ctx.lineTo(TILE_WIDTH / 2 - 10, TILE_HEIGHT / 4 + 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

/**
 * Draw a wave pattern (for water)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} terrain - Terrain configuration object
 */
function drawWavePattern(ctx, terrain) {
    ctx.save();
    
    // Clip to the diamond shape
    clipToDiamond(ctx);
    
    // Create a gradient for water depth
    const gradient = ctx.createLinearGradient(
        0, TILE_HEIGHT / 2,
        TILE_WIDTH, TILE_HEIGHT / 2
    );
    gradient.addColorStop(0, terrain.baseColor);
    gradient.addColorStop(0.5, terrain.patternColor);
    gradient.addColorStop(1, terrain.baseColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    
    // Draw wave lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
        const yPos = TILE_HEIGHT * 0.3 + i * (TILE_HEIGHT * 0.5 / 8);
        
        ctx.beginPath();
        ctx.moveTo(TILE_WIDTH * 0.3, yPos);
        
        // Create a wavy line
        for (let x = 0; x < TILE_WIDTH * 0.4; x += 5) {
            ctx.lineTo(
                TILE_WIDTH * 0.3 + x,
                yPos + Math.sin(x * 0.1) * 2
            );
        }
        
        ctx.stroke();
    }
    
    ctx.restore();
}

/**
 * Draw a tree pattern (for forests)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} terrain - Terrain configuration object
 */
function drawTreePattern(ctx, terrain) {
    ctx.save();
    
    // Clip to the diamond shape
    clipToDiamond(ctx);
    
    // Draw base gradient
    const gradient = ctx.createLinearGradient(
        0, 0,
        TILE_WIDTH, TILE_HEIGHT
    );
    gradient.addColorStop(0, terrain.baseColor);
    gradient.addColorStop(1, terrain.patternColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    
    // Draw tree trunks
    ctx.fillStyle = '#795548';
    
    for (let i = 0; i < 10; i++) {
        const x = 15 + Math.random() * (TILE_WIDTH - 30);
        const y = 10 + Math.random() * (TILE_HEIGHT - 20);
        
        ctx.fillRect(x, y, 3, 6);
    }
    
    // Draw tree tops
    ctx.fillStyle = terrain.patternColor;
    
    for (let i = 0; i < 10; i++) {
        const x = 15 + Math.random() * (TILE_WIDTH - 30);
        const y = 8 + Math.random() * (TILE_HEIGHT - 20);
        
        ctx.beginPath();
        ctx.arc(x + 1, y, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

/**
 * Add shading to create a 3D effect
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function addShading(ctx) {
    ctx.save();
    
    // Clip to the diamond shape
    clipToDiamond(ctx);
    
    // Add highlight on top-left edge
    const highlightGradient = ctx.createLinearGradient(
        0, TILE_HEIGHT / 2,
        TILE_WIDTH / 2, 0
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = highlightGradient;
    ctx.beginPath();
    ctx.moveTo(0, TILE_HEIGHT / 2);
    ctx.lineTo(TILE_WIDTH / 2, 0);
    ctx.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
    ctx.closePath();
    ctx.fill();
    
    // Add shadow on bottom-right edge
    const shadowGradient = ctx.createLinearGradient(
        TILE_WIDTH / 2, TILE_HEIGHT / 2,
        TILE_WIDTH, TILE_HEIGHT / 2
    );
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.moveTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
    ctx.lineTo(TILE_WIDTH, TILE_HEIGHT / 2);
    ctx.lineTo(TILE_WIDTH / 2, TILE_HEIGHT);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

/**
 * Helper function to clip the canvas to the diamond shape
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function clipToDiamond(ctx) {
    ctx.beginPath();
    ctx.moveTo(TILE_WIDTH / 2, 0);              // Top point
    ctx.lineTo(TILE_WIDTH, TILE_HEIGHT / 2);    // Right point
    ctx.lineTo(TILE_WIDTH / 2, TILE_HEIGHT);    // Bottom point
    ctx.lineTo(0, TILE_HEIGHT / 2);             // Left point
    ctx.closePath();
    ctx.clip();
}

// Run the generator
generateTerrainTiles(); 