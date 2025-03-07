/**
 * Quadtree for spatial partitioning of game entities
 * Optimized for isometric rendering and camera visibility queries
 */
class Quadtree {
    /**
     * Create a new quadtree
     * @param {Object} bounds - {x, y, width, height}
     * @param {number} maxObjects - Max objects per node before splitting
     * @param {number} maxLevels - Max subdivision levels
     * @param {number} level - Current level (for internal use)
     */
    constructor(bounds, maxObjects = 10, maxLevels = 4, level = 0) {
        this.bounds = bounds;
        this.maxObjects = maxObjects;
        this.maxLevels = maxLevels;
        this.level = level;
        this.objects = [];
        this.nodes = [];
    }

    /**
     * Split the node into four quadrants
     */
    split() {
        const nextLevel = this.level + 1;
        const subWidth = this.bounds.width / 2;
        const subHeight = this.bounds.height / 2;
        const x = this.bounds.x;
        const y = this.bounds.y;

        // Top right
        this.nodes[0] = new Quadtree(
            { x: x + subWidth, y: y, width: subWidth, height: subHeight },
            this.maxObjects,
            this.maxLevels,
            nextLevel
        );

        // Top left
        this.nodes[1] = new Quadtree(
            { x: x, y: y, width: subWidth, height: subHeight },
            this.maxObjects,
            this.maxLevels,
            nextLevel
        );

        // Bottom left
        this.nodes[2] = new Quadtree(
            { x: x, y: y + subHeight, width: subWidth, height: subHeight },
            this.maxObjects,
            this.maxLevels,
            nextLevel
        );

        // Bottom right
        this.nodes[3] = new Quadtree(
            { x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight },
            this.maxObjects,
            this.maxLevels,
            nextLevel
        );
    }

    /**
     * Determine which node the object belongs to
     * @param {Object} rect - {x, y, width, height}
     * @returns {number} - Index of the subnode (0-3), or -1 if object cannot completely fit in a subnode
     */
    getIndex(rect) {
        let index = -1;
        const verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
        const horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);

        // Object can completely fit within the top quadrants
        const topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
        // Object can completely fit within the bottom quadrants
        const bottomQuadrant = (rect.y > horizontalMidpoint);

        // Object can completely fit within the left quadrants
        if (rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        }
        // Object can completely fit within the right quadrants
        else if (rect.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    }

    /**
     * Insert an object into the quadtree
     * @param {Object} object - {x, y, width, height, ...}
     */
    insert(object) {
        // If we have subnodes, try to insert into them
        if (this.nodes.length) {
            const index = this.getIndex(object);

            if (index !== -1) {
                this.nodes[index].insert(object);
                return;
            }
        }

        // If it doesn't fit into a subnode or we don't have subnodes, add it to this node
        this.objects.push(object);

        // Split if we exceed the capacity and haven't reached max levels
        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            // Split if we don't already have subnodes
            if (!this.nodes.length) {
                this.split();
            }

            // Attempt to redistribute objects to subnodes
            for (let i = 0; i < this.objects.length; i++) {
                const index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                    i--;
                }
            }
        }
    }

    /**
     * Get all objects that could collide with the given rect
     * @param {Object} rect - {x, y, width, height}
     * @returns {Array} - Array of objects that could collide
     */
    retrieve(rect) {
        let returnObjects = [];
        const index = this.getIndex(rect);

        // If we have subnodes and this object could fit in a subnode, check there
        if (this.nodes.length) {
            // If the object fits into a subnode, retrieve from there
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(rect));
            } else {
                // If the object doesn't fit into a specific subnode, check all subnodes
                for (let i = 0; i < this.nodes.length; i++) {
                    returnObjects = returnObjects.concat(this.nodes[i].retrieve(rect));
                }
            }
        }

        // Return all objects in this node
        returnObjects = returnObjects.concat(this.objects);
        return returnObjects;
    }

    /**
     * Get all objects that intersect the given rectangle
     * @param {Object} rect - {x, y, width, height}
     * @returns {Array} - Array of objects that intersect
     */
    query(rect) {
        // First, get all potential objects using retrieve
        const potentialObjects = this.retrieve(rect);
        
        // Then filter out objects that don't actually intersect
        return potentialObjects.filter(object => this.intersects(rect, object));
    }

    /**
     * Check if two rectangles intersect
     * @param {Object} rect1 - {x, y, width, height}
     * @param {Object} rect2 - {x, y, width, height}
     * @returns {boolean} - True if the rectangles intersect
     */
    intersects(rect1, rect2) {
        return !(
            rect1.x > rect2.x + rect2.width ||
            rect1.x + rect1.width < rect2.x ||
            rect1.y > rect2.y + rect2.height ||
            rect1.y + rect1.height < rect2.y
        );
    }

    /**
     * Clear the quadtree, removing all objects and subnodes
     */
    clear() {
        this.objects = [];

        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i]) {
                this.nodes[i].clear();
            }
        }

        this.nodes = [];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Quadtree };
} else {
    // For browser use
    window.Quadtree = Quadtree;
} 