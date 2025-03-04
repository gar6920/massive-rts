const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directories if they don't exist
const unitsDir = path.join(__dirname, '../../public/images/units');
const buildingsDir = path.join(__dirname, '../../public/images/buildings');

if (!fs.existsSync(unitsDir)) {
    fs.mkdirSync(unitsDir, { recursive: true });
}

if (!fs.existsSync(buildingsDir)) {
    fs.mkdirSync(buildingsDir, { recursive: true });
}

// Create a canvas
const canvas = createCanvas(64, 64);
const ctx = canvas.getContext('2d');

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
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Base colors for different unit types
    let primaryColor, secondaryColor, detailColor;
    
    switch(unitType) {
        case 'SOLDIER':
            primaryColor = '#3366cc';
            secondaryColor = '#1a3366';
            detailColor = '#99ccff';
            break;
        case 'ARCHER':
            primaryColor = '#33cc33';
            secondaryColor = '#1a661a';
            detailColor = '#99ff99';
            break;
        case 'CAVALRY':
            primaryColor = '#cc3333';
            secondaryColor = '#661a1a';
            detailColor = '#ff9999';
            break;
        case 'TANK':
            primaryColor = '#666666';
            secondaryColor = '#333333';
            detailColor = '#cccccc';
            break;
        case 'WORKER':
            primaryColor = '#cc9933';
            secondaryColor = '#664d1a';
            detailColor = '#ffcc99';
            break;
        default:
            primaryColor = '#3366cc';
            secondaryColor = '#1a3366';
            detailColor = '#99ccff';
    }
    
    // Draw isometric unit base
    ctx.fillStyle = primaryColor;
    
    // Draw a diamond shape for the base
    ctx.beginPath();
    ctx.moveTo(width/2, height/4); // Top
    ctx.lineTo(3*width/4, height/2); // Right
    ctx.lineTo(width/2, 3*height/4); // Bottom
    ctx.lineTo(width/4, height/2); // Left
    ctx.closePath();
    ctx.fill();
    
    // Draw unit details based on type
    switch(unitType) {
        case 'SOLDIER':
            // Draw helmet
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.arc(width/2, height/2 - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw body
            ctx.fillStyle = primaryColor;
            ctx.fillRect(width/2 - 5, height/2, 10, 15);
            
            // Draw sword
            ctx.strokeStyle = detailColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width/2 + 8, height/2);
            ctx.lineTo(width/2 + 15, height/2 - 10);
            ctx.stroke();
            break;
            
        case 'ARCHER':
            // Draw hood
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.arc(width/2, height/2 - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw body
            ctx.fillStyle = primaryColor;
            ctx.fillRect(width/2 - 5, height/2, 10, 15);
            
            // Draw bow
            ctx.strokeStyle = detailColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(width/2 + 10, height/2, 8, -Math.PI/2, Math.PI/2);
            ctx.stroke();
            
            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(width/2 + 5, height/2);
            ctx.lineTo(width/2 + 15, height/2);
            ctx.stroke();
            break;
            
        case 'CAVALRY':
            // Draw horse body
            ctx.fillStyle = secondaryColor;
            ctx.beginPath();
            ctx.ellipse(width/2, height/2 + 5, 15, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw rider
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(width/2, height/2 - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw lance
            ctx.strokeStyle = detailColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width/2 + 5, height/2 - 5);
            ctx.lineTo(width/2 + 20, height/2 - 15);
            ctx.stroke();
            break;
            
        case 'TANK':
            // Draw tank body
            ctx.fillStyle = secondaryColor;
            ctx.fillRect(width/2 - 15, height/2, 30, 15);
            
            // Draw tank turret
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(width/2, height/2 - 5, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw tank cannon
            ctx.strokeStyle = detailColor;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(width/2, height/2 - 5);
            ctx.lineTo(width/2 + 20, height/2 - 5);
            ctx.stroke();
            break;
            
        case 'WORKER':
            // Draw hard hat
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(width/2, height/2 - 5, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw body
            ctx.fillStyle = primaryColor;
            ctx.fillRect(width/2 - 5, height/2, 10, 15);
            
            // Draw pickaxe
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width/2 + 5, height/2);
            ctx.lineTo(width/2 + 15, height/2 - 10);
            ctx.lineTo(width/2 + 20, height/2 - 5);
            ctx.stroke();
            break;
    }
    
    // Return the canvas
    return canvas;
}

// Function to generate a building image
function generateBuildingImage(buildingType, playerColor = null) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Base colors for different building types
    let baseColor, roofColor, detailColor;
    
    switch(buildingType) {
        case 'BASE':
            baseColor = '#666699';
            roofColor = '#333366';
            detailColor = '#9999cc';
            break;
        case 'BARRACKS':
            baseColor = '#996666';
            roofColor = '#663333';
            detailColor = '#cc9999';
            break;
        case 'TOWER':
            baseColor = '#669966';
            roofColor = '#336633';
            detailColor = '#99cc99';
            break;
        case 'FARM':
            baseColor = '#999966';
            roofColor = '#666633';
            detailColor = '#cccc99';
            break;
        case 'MINE':
            baseColor = '#666666';
            roofColor = '#333333';
            detailColor = '#999999';
            break;
        default:
            baseColor = '#666699';
            roofColor = '#333366';
            detailColor = '#9999cc';
    }
    
    // Apply player color if provided
    if (playerColor) {
        switch(playerColor) {
            case 'red':
                baseColor = '#cc3333';
                roofColor = '#661a1a';
                detailColor = '#ff9999';
                break;
            case 'blue':
                baseColor = '#3366cc';
                roofColor = '#1a3366';
                detailColor = '#99ccff';
                break;
            case 'green':
                baseColor = '#33cc33';
                roofColor = '#1a661a';
                detailColor = '#99ff99';
                break;
            case 'yellow':
                baseColor = '#cccc33';
                roofColor = '#66661a';
                detailColor = '#ffff99';
                break;
        }
    }
    
    // Draw isometric building based on type
    switch(buildingType) {
        case 'BASE':
            // Draw main building (castle-like)
            drawIsometricBuilding(width/2, height/2, 40, 30, baseColor, roofColor);
            
            // Draw towers at corners
            drawIsometricBuilding(width/2 - 15, height/2 - 10, 10, 20, baseColor, roofColor);
            drawIsometricBuilding(width/2 + 15, height/2 - 10, 10, 20, baseColor, roofColor);
            
            // Draw flag on top
            ctx.fillStyle = playerColor || detailColor;
            ctx.beginPath();
            ctx.moveTo(width/2, height/2 - 25);
            ctx.lineTo(width/2 + 10, height/2 - 20);
            ctx.lineTo(width/2, height/2 - 15);
            ctx.closePath();
            ctx.fill();
            break;
            
        case 'BARRACKS':
            // Draw main building
            drawIsometricBuilding(width/2, height/2, 40, 20, baseColor, roofColor);
            
            // Draw entrance
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(width/2, height/2 + 5);
            ctx.lineTo(width/2 + 5, height/2 + 2);
            ctx.lineTo(width/2 + 5, height/2 + 10);
            ctx.lineTo(width/2, height/2 + 13);
            ctx.closePath();
            ctx.fill();
            
            // Draw crossed swords emblem
            ctx.strokeStyle = detailColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width/2 - 10, height/2 - 5);
            ctx.lineTo(width/2 + 10, height/2 + 5);
            ctx.moveTo(width/2 + 10, height/2 - 5);
            ctx.lineTo(width/2 - 10, height/2 + 5);
            ctx.stroke();
            break;
            
        case 'TOWER':
            // Draw tower base
            drawIsometricBuilding(width/2, height/2 + 5, 20, 30, baseColor, roofColor);
            
            // Draw tower top (pointed roof)
            ctx.fillStyle = roofColor;
            ctx.beginPath();
            ctx.moveTo(width/2, height/2 - 20);
            ctx.lineTo(width/2 + 10, height/2 - 5);
            ctx.lineTo(width/2, height/2 + 5);
            ctx.lineTo(width/2 - 10, height/2 - 5);
            ctx.closePath();
            ctx.fill();
            
            // Draw windows
            ctx.fillStyle = detailColor;
            ctx.beginPath();
            ctx.arc(width/2, height/2 - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'FARM':
            // Draw main building (barn-like)
            drawIsometricBuilding(width/2, height/2, 35, 20, baseColor, roofColor);
            
            // Draw field
            ctx.fillStyle = '#cccc00';
            ctx.beginPath();
            ctx.moveTo(width/2 - 20, height/2 + 10);
            ctx.lineTo(width/2 - 5, height/2 + 2);
            ctx.lineTo(width/2 + 10, height/2 + 10);
            ctx.lineTo(width/2 - 5, height/2 + 18);
            ctx.closePath();
            ctx.fill();
            
            // Draw crop rows
            ctx.strokeStyle = '#666600';
            ctx.lineWidth = 1;
            for (let i = -15; i <= 5; i += 5) {
                ctx.beginPath();
                ctx.moveTo(width/2 + i, height/2 + 5 + i/2);
                ctx.lineTo(width/2 + i + 15, height/2 + 5 + i/2 + 7.5);
                ctx.stroke();
            }
            break;
            
        case 'MINE':
            // Draw mine entrance (mountain-like)
            ctx.fillStyle = '#666666';
            ctx.beginPath();
            ctx.moveTo(width/2, height/4);
            ctx.lineTo(3*width/4, height/2);
            ctx.lineTo(width/2, 3*height/4);
            ctx.lineTo(width/4, height/2);
            ctx.closePath();
            ctx.fill();
            
            // Draw entrance
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(width/2 - 10, height/2 + 5);
            ctx.lineTo(width/2 + 10, height/2 + 5);
            ctx.lineTo(width/2 + 10, height/2 + 15);
            ctx.lineTo(width/2 - 10, height/2 + 15);
            ctx.closePath();
            ctx.fill();
            
            // Draw support beams
            ctx.strokeStyle = '#996633';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(width/2 - 10, height/2 + 5);
            ctx.lineTo(width/2 - 10, height/2 + 15);
            ctx.moveTo(width/2 + 10, height/2 + 5);
            ctx.lineTo(width/2 + 10, height/2 + 15);
            ctx.moveTo(width/2 - 10, height/2 + 5);
            ctx.lineTo(width/2 + 10, height/2 + 5);
            ctx.stroke();
            break;
    }
    
    // Return the canvas
    return canvas;
}

// Helper function to draw an isometric building
function drawIsometricBuilding(x, y, width, height, baseColor, roofColor) {
    // Calculate dimensions
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const roofHeight = height / 3;
    
    // Draw roof (top face)
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(x, y - halfHeight - roofHeight);
    ctx.lineTo(x + halfWidth, y - halfHeight);
    ctx.lineTo(x, y - halfHeight + halfWidth);
    ctx.lineTo(x - halfWidth, y - halfHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw right face
    ctx.fillStyle = darkenColor(baseColor, 0.7);
    ctx.beginPath();
    ctx.moveTo(x + halfWidth, y - halfHeight);
    ctx.lineTo(x, y - halfHeight + halfWidth);
    ctx.lineTo(x, y + halfHeight);
    ctx.lineTo(x + halfWidth, y);
    ctx.closePath();
    ctx.fill();
    
    // Draw left face
    ctx.fillStyle = darkenColor(baseColor, 0.5);
    ctx.beginPath();
    ctx.moveTo(x - halfWidth, y - halfHeight);
    ctx.lineTo(x, y - halfHeight + halfWidth);
    ctx.lineTo(x, y + halfHeight);
    ctx.lineTo(x - halfWidth, y);
    ctx.closePath();
    ctx.fill();
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
function saveImage(canvas, filename) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
    console.log(`Generated: ${filename}`);
}

// Generate and save unit images
function generateUnitImages() {
    console.log('Generating unit images...');
    
    unitTypes.forEach(unitType => {
        const canvas = generateUnitImage(unitType);
        const filename = path.join(unitsDir, `${unitType.toLowerCase()}.png`);
        saveImage(canvas, filename);
    });
    
    console.log('Unit image generation complete!');
}

// Generate and save building images
function generateBuildingImages() {
    console.log('Generating building images...');
    
    buildingTypes.forEach(buildingType => {
        // Generate default building image
        const canvas = generateBuildingImage(buildingType);
        const filename = path.join(buildingsDir, `${buildingType.toLowerCase()}.png`);
        saveImage(canvas, filename);
        
        // Generate player-colored variants
        playerColors.forEach(color => {
            const coloredCanvas = generateBuildingImage(buildingType, color);
            const coloredFilename = path.join(buildingsDir, `${buildingType.toLowerCase()}_${color}.png`);
            saveImage(coloredCanvas, coloredFilename);
        });
    });
    
    console.log('Building image generation complete!');
}

// Generate all images
function generateAllImages() {
    generateUnitImages();
    generateBuildingImages();
}

// Run the generator
generateAllImages(); 