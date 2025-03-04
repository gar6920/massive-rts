/**
 * Handles loading and managing unit images
 */
class UnitImageLoader {
    /**
     * Initialize the unit image loader
     */
    constructor() {
        // Unit types
        this.unitTypes = ['SOLDIER', 'ARCHER', 'CAVALRY', 'TANK', 'WORKER'];
        
        // Store loaded images
        this.images = {};
        
        // Load all unit images
        this.loadUnitImages();
        
        console.log('UnitImageLoader initialized');
    }
    
    /**
     * Load all unit images
     */
    loadUnitImages() {
        this.unitTypes.forEach(unitType => {
            const img = new Image();
            img.src = `/images/units/${unitType.toLowerCase()}.png`;
            this.images[unitType] = img;
            
            // Log when image loads or fails
            img.onload = () => console.log(`Loaded unit image: ${unitType}`);
            img.onerror = () => console.warn(`Failed to load unit image: ${unitType}`);
        });
    }
    
    /**
     * Get the image for a specific unit type
     */
    getUnitImage(unitType) {
        return this.images[unitType] || null;
    }
    
    /**
     * Check if all images are loaded
     */
    areAllImagesLoaded() {
        return Object.values(this.images).every(img => img.complete);
    }
} 