/**
 * Script to generate placeholder images for units and buildings
 * Run this script to create basic placeholder images until proper assets are available
 */

// Create a canvas element
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 64;
canvas.height = 64;

// Unit types to generate
const unitTypes = ['SOLDIER', 'ARCHER', 'CAVALRY', 'TANK', 'WORKER'];

// Building types to generate
const buildingTypes = ['BASE', 'BARRACKS', 'TOWER', 'FARM', 'MINE'];

// Player colors
const playerColors = ['red', 'blue', 'green', 'yellow'];

// Function to generate a unit image
function generateUnitImage(unitType) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background color based on unit type
    let color;
    switch(unitType) {
        case 'SOLDIER': color = '#3366cc'; break;
        case 'ARCHER': color = '#33cc33'; break;
        case 'CAVALRY': color = '#cc3333'; break;
        case 'TANK': color = '#666666'; break;
        case 'WORKER': color = '#cc9933'; break;
        default: color = '#3366cc';
    }
    
    // Draw isometric unit shape
    ctx.fillStyle = color;
    
    // Draw a diamond shape for the base
    ctx.beginPath();
    ctx.moveTo(32, 16); // Top
    ctx.lineTo(48, 32); // Right
    ctx.lineTo(32, 48); // Bottom
    ctx.lineTo(16, 32); // Left
    ctx.closePath();
    ctx.fill();
    
    // Add details based on unit type
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add unit type initial
    ctx.fillText(unitType.charAt(0), 32, 32);
    
    // Return the image data URL
    return canvas.toDataURL('image/png');
}

// Function to generate a building image
function generateBuildingImage(buildingType, playerColor = null) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set base color based on building type
    let baseColor;
    switch(buildingType) {
        case 'BASE': baseColor = '#666699'; break;
        case 'BARRACKS': baseColor = '#996666'; break;
        case 'TOWER': baseColor = '#669966'; break;
        case 'FARM': baseColor = '#999966'; break;
        case 'MINE': baseColor = '#666666'; break;
        default: baseColor = '#666699';
    }
    
    // Apply player color if provided
    if (playerColor) {
        switch(playerColor) {
            case 'red': baseColor = '#cc3333'; break;
            case 'blue': baseColor = '#3366cc'; break;
            case 'green': baseColor = '#33cc33'; break;
            case 'yellow': baseColor = '#cccc33'; break;
        }
    }
    
    // Draw isometric building
    // Base
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(32, 16); // Top
    ctx.lineTo(48, 32); // Right
    ctx.lineTo(32, 48); // Bottom
    ctx.lineTo(16, 32); // Left
    ctx.closePath();
    ctx.fill();
    
    // Right face (darker)
    ctx.fillStyle = darkenColor(baseColor, 0.7);
    ctx.beginPath();
    ctx.moveTo(32, 48); // Bottom center
    ctx.lineTo(48, 32); // Right middle
    ctx.lineTo(48, 40); // Right bottom
    ctx.lineTo(32, 56); // Bottom
    ctx.closePath();
    ctx.fill();
    
    // Left face (darkest)
    ctx.fillStyle = darkenColor(baseColor, 0.5);
    ctx.beginPath();
    ctx.moveTo(32, 48); // Bottom center
    ctx.lineTo(16, 32); // Left middle
    ctx.lineTo(16, 40); // Left bottom
    ctx.lineTo(32, 56); // Bottom
    ctx.closePath();
    ctx.fill();
    
    // Add details based on building type
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add building type initial
    ctx.fillText(buildingType.charAt(0), 32, 32);
    
    // Return the image data URL
    return canvas.toDataURL('image/png');
}

// Helper function to darken a color
function darkenColor(color, factor) {
    // Convert hex to RGB
    let r, g, b;
    if (color.startsWith('#')) {
        const hex = color.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        return color; // Can't darken
    }
    
    // Darken
    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to save an image
function saveImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Generate and save unit images
function generateUnitImages() {
    unitTypes.forEach(unitType => {
        const imageData = generateUnitImage(unitType);
        saveImage(imageData, `${unitType.toLowerCase()}.png`);
        console.log(`Generated unit image: ${unitType.toLowerCase()}.png`);
    });
}

// Generate and save building images
function generateBuildingImages() {
    buildingTypes.forEach(buildingType => {
        // Generate default building image
        const imageData = generateBuildingImage(buildingType);
        saveImage(imageData, `${buildingType.toLowerCase()}.png`);
        console.log(`Generated building image: ${buildingType.toLowerCase()}.png`);
        
        // Generate player-colored variants
        playerColors.forEach(color => {
            const coloredImageData = generateBuildingImage(buildingType, color);
            saveImage(coloredImageData, `${buildingType.toLowerCase()}_${color}.png`);
            console.log(`Generated building image: ${buildingType.toLowerCase()}_${color}.png`);
        });
    });
}

// Run the generation functions
console.log('Generating placeholder images...');
generateUnitImages();
generateBuildingImages();
console.log('Image generation complete!');

// Instructions for use
console.log('\nInstructions:');
console.log('1. Save these images to your assets folder:');
console.log('   - Unit images: assets/units/');
console.log('   - Building images: assets/buildings/');
console.log('2. Make sure the folder structure exists');
console.log('3. The game will automatically use these images'); 