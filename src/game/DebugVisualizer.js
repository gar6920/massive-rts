import { debugLogger } from './DebugLogger.js';

/**
 * Debug visualizer class for rendering debug information
 */
class DebugVisualizer {
    /**
     * Initialize the debug visualizer
     */
    constructor() {
        this.enabled = true;
        this.displayStats = true;
        this.displayTrails = true;
        this.displayGrid = true;
        this.trailLength = 10; // Number of positions to show in the trail
        this.trailColors = {
            real: 'rgba(255, 0, 0, 0.5)',  // Red for actual positions
            interpolated: 'rgba(0, 255, 0, 0.5)' // Green for interpolated positions
        };
        
        this.setupUI();
    }
    
    /**
     * Set up debug UI
     */
    setupUI() {
        // Create debug UI container if it doesn't exist
        let debugContainer = document.getElementById('debug-container');
        if (!debugContainer && this.enabled) {
            debugContainer = document.createElement('div');
            debugContainer.id = 'debug-container';
            debugContainer.style.position = 'absolute';
            debugContainer.style.top = '10px';
            debugContainer.style.right = '10px';
            debugContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            debugContainer.style.color = 'white';
            debugContainer.style.padding = '10px';
            debugContainer.style.borderRadius = '5px';
            debugContainer.style.zIndex = '1000';
            debugContainer.style.maxHeight = '300px';
            debugContainer.style.overflowY = 'auto';
            debugContainer.style.fontSize = '12px';
            debugContainer.style.fontFamily = 'monospace';
            document.body.appendChild(debugContainer);
            
            // Add title
            const title = document.createElement('div');
            title.textContent = 'DEBUG INFO';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.style.borderBottom = '1px solid white';
            debugContainer.appendChild(title);
            
            // Add stats container
            const statsContainer = document.createElement('div');
            statsContainer.id = 'debug-stats';
            debugContainer.appendChild(statsContainer);
            
            // Add controls
            const controls = document.createElement('div');
            controls.style.marginTop = '10px';
            controls.style.display = 'flex';
            controls.style.flexDirection = 'column';
            controls.style.gap = '5px';
            
            // Toggle debug display button
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = 'Toggle Debug Display';
            toggleBtn.style.padding = '3px';
            toggleBtn.onclick = () => this.toggleEnabled();
            controls.appendChild(toggleBtn);
            
            // Toggle trails button
            const toggleTrailsBtn = document.createElement('button');
            toggleTrailsBtn.textContent = 'Toggle Position Trails';
            toggleTrailsBtn.style.padding = '3px';
            toggleTrailsBtn.onclick = () => this.toggleTrails();
            controls.appendChild(toggleTrailsBtn);
            
            // Toggle grid button
            const toggleGridBtn = document.createElement('button');
            toggleGridBtn.textContent = 'Toggle Grid';
            toggleGridBtn.style.padding = '3px';
            toggleGridBtn.onclick = () => this.toggleGrid();
            controls.appendChild(toggleGridBtn);
            
            // Print debug info button
            const printDebugBtn = document.createElement('button');
            printDebugBtn.textContent = 'Print Debug Info to Console';
            printDebugBtn.style.padding = '3px';
            printDebugBtn.onclick = () => debugLogger.printDebugInfo();
            controls.appendChild(printDebugBtn);
            
            debugContainer.appendChild(controls);
        }
    }
    
    /**
     * Update debug stats display
     */
    updateStats() {
        if (!this.enabled || !this.displayStats) return;
        
        const statsEl = document.getElementById('debug-stats');
        if (!statsEl) return;
        
        // Get interpolation stats
        const stats = debugLogger.getInterpolationStats();
        
        // Create HTML content
        let html = `
            <div>Interpolation Logs: ${stats.count}</div>
            ${stats.count > 0 ? `
                <div>Avg Distance: ${stats.averageDistance.toFixed(2)}</div>
                <div>Smoothness: ${stats.smoothnessRating} (${stats.averageProgressJump.toFixed(3)})</div>
                <div>Largest Jump: ${stats.largestJump.toFixed(3)}</div>
            ` : ''}
        `;
        
        // Add camera info if available
        if (debugLogger.cameraLogs.length > 0) {
            const latest = debugLogger.cameraLogs[debugLogger.cameraLogs.length - 1];
            html += `
                <div>Camera: (${latest.position.x.toFixed(0)}, ${latest.position.y.toFixed(0)})</div>
                <div>Zoom: ${latest.zoom.toFixed(2)}</div>
            `;
        }
        
        // Add input info
        html += `<div>Input Events: ${debugLogger.inputLogs.length}</div>`;
        
        // Show last input if available
        if (debugLogger.inputLogs.length > 0) {
            const latest = debugLogger.inputLogs[debugLogger.inputLogs.length - 1];
            html += `<div>Last Input: ${latest.type}</div>`;
        }
        
        statsEl.innerHTML = html;
    }
    
    /**
     * Render entity trails based on interpolation logs
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Camera} camera - Game camera
     */
    renderEntityTrails(ctx, camera) {
        if (!this.enabled || !this.displayTrails || debugLogger.interpolationLogs.length === 0) return;
        
        // Get recent logs, grouped by unit ID
        const unitLogs = {};
        
        // Group logs by unit ID
        debugLogger.interpolationLogs.forEach(log => {
            if (!unitLogs[log.unitId]) {
                unitLogs[log.unitId] = [];
            }
            unitLogs[log.unitId].push(log);
        });
        
        // Render trails for each unit
        Object.keys(unitLogs).forEach(unitId => {
            const logs = unitLogs[unitId];
            if (logs.length < 2) return;
            
            // Only use the most recent logs up to trailLength
            const recentLogs = logs.slice(-this.trailLength);
            
            // Draw server position trail
            ctx.beginPath();
            ctx.strokeStyle = this.trailColors.real;
            ctx.lineWidth = 2;
            
            let firstLog = recentLogs[0];
            let screenPos = camera.worldToScreen(firstLog.positions.server.x, firstLog.positions.server.y);
            
            ctx.moveTo(screenPos.x, screenPos.y);
            
            for (let i = 1; i < recentLogs.length; i++) {
                const log = recentLogs[i];
                screenPos = camera.worldToScreen(log.positions.server.x, log.positions.server.y);
                ctx.lineTo(screenPos.x, screenPos.y);
            }
            
            ctx.stroke();
            
            // Draw interpolated position trail
            ctx.beginPath();
            ctx.strokeStyle = this.trailColors.interpolated;
            ctx.lineWidth = 2;
            
            firstLog = recentLogs[0];
            screenPos = camera.worldToScreen(firstLog.positions.current.x, firstLog.positions.current.y);
            
            ctx.moveTo(screenPos.x, screenPos.y);
            
            for (let i = 1; i < recentLogs.length; i++) {
                const log = recentLogs[i];
                screenPos = camera.worldToScreen(log.positions.current.x, log.positions.current.y);
                ctx.lineTo(screenPos.x, screenPos.y);
            }
            
            ctx.stroke();
        });
    }
    
    /**
     * Render debug grid
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Camera} camera - Game camera
     * @param {number} mapWidth - Map width in tiles
     * @param {number} mapHeight - Map height in tiles
     */
    renderGrid(ctx, camera, mapWidth, mapHeight) {
        if (!this.enabled || !this.displayGrid) return;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        // Draw horizontal grid lines
        for (let y = 0; y <= mapHeight; y++) {
            const start = camera.worldToScreen(0, y);
            const end = camera.worldToScreen(mapWidth, y);
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            
            // Add coordinate text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '10px Arial';
            ctx.fillText(`y:${y}`, start.x - 25, start.y);
        }
        
        // Draw vertical grid lines
        for (let x = 0; x <= mapWidth; x++) {
            const start = camera.worldToScreen(x, 0);
            const end = camera.worldToScreen(x, mapHeight);
            
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            
            // Add coordinate text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.font = '10px Arial';
            ctx.fillText(`x:${x}`, start.x, start.y - 5);
        }
    }
    
    /**
     * Toggle whether debug visualization is enabled
     */
    toggleEnabled() {
        this.enabled = !this.enabled;
        
        // Update UI visibility
        const debugContainer = document.getElementById('debug-container');
        if (debugContainer) {
            debugContainer.style.display = this.enabled ? 'block' : 'none';
        }
        
        console.log(`Debug visualization ${this.enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Toggle whether trails are displayed
     */
    toggleTrails() {
        this.displayTrails = !this.displayTrails;
        console.log(`Position trails ${this.displayTrails ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Toggle whether grid is displayed
     */
    toggleGrid() {
        this.displayGrid = !this.displayGrid;
        console.log(`Debug grid ${this.displayGrid ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Update the visualizer
     */
    update() {
        this.updateStats();
    }
    
    /**
     * Render debug visualizations
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Camera} camera - Game camera
     * @param {number} mapWidth - Map width in tiles
     * @param {number} mapHeight - Map height in tiles
     */
    render(ctx, camera, mapWidth, mapHeight) {
        if (!this.enabled) return;
        
        this.renderGrid(ctx, camera, mapWidth, mapHeight);
        this.renderEntityTrails(ctx, camera);
    }
}

// Export a singleton instance
const debugVisualizer = new DebugVisualizer();
export { debugVisualizer }; 