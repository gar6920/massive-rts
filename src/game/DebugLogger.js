/**
 * Debug logger class for recording and analyzing debug information
 */
class DebugLogger {
    /**
     * Initialize the debug logger
     */
    constructor() {
        this.interpolationLogs = [];
        this.cameraLogs = [];
        this.inputLogs = [];
        this.maxLogs = 1000; // Maximum number of logs to keep
        this.enabled = true;
    }

    /**
     * Log interpolation data
     * @param {string} unitId - ID of the unit
     * @param {number} prevX - Previous X position
     * @param {number} prevY - Previous Y position
     * @param {number} serverX - Server X position
     * @param {number} serverY - Server Y position
     * @param {number} currentX - Current interpolated X position
     * @param {number} currentY - Current interpolated Y position
     * @param {number} t - Interpolation progress (0-1)
     */
    logInterpolation(unitId, prevX, prevY, serverX, serverY, currentX, currentY, t) {
        if (!this.enabled) return;

        // Add log entry with timestamp
        this.interpolationLogs.push({
            timestamp: Date.now(),
            unitId,
            positions: {
                prev: { x: prevX, y: prevY },
                server: { x: serverX, y: serverY },
                current: { x: currentX, y: currentY }
            },
            progress: t
        });

        // Cap the logs array size
        if (this.interpolationLogs.length > this.maxLogs) {
            this.interpolationLogs.shift();
        }

        // Also log to console for immediate feedback
        console.log(`[Interpolation] Unit ${unitId}: prev=(${prevX.toFixed(2)},${prevY.toFixed(2)}), server=(${serverX},${serverY}), current=(${currentX.toFixed(2)},${currentY.toFixed(2)}), t=${t.toFixed(2)}`);
    }

    /**
     * Log camera data
     * @param {number} x - Camera X position
     * @param {number} y - Camera Y position
     * @param {number} zoom - Camera zoom level
     * @param {object} viewport - Viewport information
     */
    logCamera(x, y, zoom, viewport) {
        if (!this.enabled) return;

        this.cameraLogs.push({
            timestamp: Date.now(),
            position: { x, y },
            zoom,
            viewport
        });

        // Cap the logs array size
        if (this.cameraLogs.length > this.maxLogs) {
            this.cameraLogs.shift();
        }
    }

    /**
     * Log input events
     * @param {string} type - Event type
     * @param {object} data - Event data
     */
    logInput(type, data) {
        if (!this.enabled) return;

        this.inputLogs.push({
            timestamp: Date.now(),
            type,
            data
        });

        // Cap the logs array size
        if (this.inputLogs.length > this.maxLogs) {
            this.inputLogs.shift();
        }
    }

    /**
     * Get interpolation stats for analysis
     * @returns {object} Statistics about interpolation
     */
    getInterpolationStats() {
        if (this.interpolationLogs.length === 0) {
            return { count: 0, message: "No interpolation logs recorded" };
        }

        // Calculate distances between prev and server positions
        const distances = this.interpolationLogs.map(log => {
            const dx = log.positions.server.x - log.positions.prev.x;
            const dy = log.positions.server.y - log.positions.prev.y;
            return Math.sqrt(dx * dx + dy * dy);
        });

        // Calculate average distance
        const avgDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;

        // Calculate progress jumps (how smooth the interpolation is)
        const progressJumps = [];
        for (let i = 1; i < this.interpolationLogs.length; i++) {
            if (this.interpolationLogs[i].unitId === this.interpolationLogs[i-1].unitId) {
                const jump = Math.abs(this.interpolationLogs[i].progress - this.interpolationLogs[i-1].progress);
                progressJumps.push(jump);
            }
        }

        const avgProgressJump = progressJumps.length > 0 
            ? progressJumps.reduce((sum, jump) => sum + jump, 0) / progressJumps.length
            : 0;

        return {
            count: this.interpolationLogs.length,
            averageDistance: avgDistance,
            averageProgressJump: avgProgressJump,
            smoothnessRating: avgProgressJump < 0.1 ? "Smooth" : avgProgressJump < 0.3 ? "Acceptable" : "Jerky",
            largestJump: Math.max(...progressJumps) || 0,
            message: `Analyzed ${this.interpolationLogs.length} interpolation logs`
        };
    }

    /**
     * Enable or disable the logger
     * @param {boolean} enabled - Whether the logger should be enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Clear all logs
     */
    clearLogs() {
        this.interpolationLogs = [];
        this.cameraLogs = [];
        this.inputLogs = [];
    }

    /**
     * Output debug information to the console
     */
    printDebugInfo() {
        console.log("=== DEBUG INFORMATION ===");
        
        // Print interpolation stats
        const stats = this.getInterpolationStats();
        console.log(`Interpolation Stats: ${JSON.stringify(stats, null, 2)}`);
        
        // Print camera info summary
        if (this.cameraLogs.length > 0) {
            const latest = this.cameraLogs[this.cameraLogs.length - 1];
            console.log(`Latest Camera Position: (${latest.position.x.toFixed(2)}, ${latest.position.y.toFixed(2)}), Zoom: ${latest.zoom.toFixed(2)}`);
        }
        
        // Print input info summary
        console.log(`Recorded ${this.inputLogs.length} input events`);
    }
}

// Export a singleton instance
const debugLogger = new DebugLogger();
export { debugLogger }; 