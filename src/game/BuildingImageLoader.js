/**
 * Handles loading and managing building images
 */
class BuildingImageLoader {
    /**
     * Initialize the building image loader
     */
    constructor() {
        // Building types
        this.buildingTypes = ['BASE', 'BARRACKS', 'TOWER', 'FARM', 'MINE'];
        
        // Player colors
        this.playerColors = ['red', 'blue', 'green', 'yellow'];
        
        // Store loaded images
        this.images = {};
        
        // Load all building images
        this.loadBuildingImages();
        
        console.log('BuildingImageLoader initialized');
    }
    
    /**
     * Load all building images
     */
    loadBuildingImages() {
        // Load default building images
        this.buildingTypes.forEach(buildingType => {
            const img = new Image();
            img.src = `/images/buildings/${buildingType.toLowerCase()}.png`;
            this.images[buildingType] = img;
            
            // Log when image loads or fails
            img.onload = () => console.log(`Loaded building image: ${buildingType}`);
            img.onerror = () => console.warn(`Failed to load building image: ${buildingType}`);
            
            // Load player-colored variants
            this.playerColors.forEach(color => {
                const coloredImg = new Image();
                coloredImg.src = `/images/buildings/${buildingType.toLowerCase()}_${color}.png`;
                this.images[`${buildingType}_${color}`] = coloredImg;
                
                // Log when image loads or fails
                coloredImg.onload = () => console.log(`Loaded building image: ${buildingType}_${color}`);
                coloredImg.onerror = () => console.warn(`Failed to load building image: ${buildingType}_${color}`);
            });
        });
    }
    
    /**
     * Get the image for a specific building type and player color
     */
    getBuildingImage(buildingType, playerColor = null) {
        if (playerColor) {
            const coloredImage = this.images[`${buildingType}_${playerColor}`];
            if (coloredImage) return coloredImage;
        }
        
        return this.images[buildingType] || null;
    }
    
    /**
     * Check if all images are loaded
     */
    areAllImagesLoaded() {
        return Object.values(this.images).every(img => img.complete);
    }
} 