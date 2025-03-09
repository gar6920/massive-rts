// This file is now replaced by the Game class in src/index.js
// Keeping this file for backward compatibility but it forwards to the new Game class

import { Game as NewGame } from '../index';

// Export the same Game class from index.js
export const Game = NewGame;

/**
 * Main game class
 */
class Game {
    /**
     * Initialize the game
     */
    constructor(canvas) {
        console.log('\n=== Initializing Game ===');
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        this.canvas.width = Config.CANVAS_WIDTH;
        this.canvas.height = Config.CANVAS_HEIGHT;
        
        console.log('Canvas dimensions:', `${this.canvas.width}x${this.canvas.height}`);
        
        // Initialize game components
        this.map = new Map();
        console.log('Map initialized');
        
        this.camera = new Camera(this);
        console.log('Camera initialized');
        
        // Initialize game state
        this.entities = [];
        this.selectedEntities = [];
        this.playerId = null;
        this.gameTime = 0;
        this.fps = 0;
        
        // Initialize input handler
        this.inputHandler = new InputHandler(this);
        console.log('Input handler initialized');
        
        // Initialize multiplayer
        this.multiplayer = new Multiplayer(this);
        console.log('Multiplayer initialized');
        
        // Start game loop
        this.lastFrameTime = performance.now();
        this.gameLoop();
        
        console.log('=== Game Initialization Complete ===\n');
    }
    
    /**
     * Process game state received from server
     */
    processGameState(data) {
        console.log('\n=== Processing Game State ===');
        console.log('Received data:', {
            hasPlayerId: !!data.playerId,
            hasGameState: !!data.gameState,
            mapDimensions: data.gameState?.mapDimensions,
            mapDataPresent: !!data.gameState?.map
        });
        
        // Set player ID
        if (data.playerId) {
            this.playerId = data.playerId;
            console.log('Set player ID:', this.playerId);
        }
        
        // Process game state
        if (data.gameState) {
            // Update map if provided
            if (data.gameState.map) {
                console.log('Setting map from server data');
                this.map.setMapFromServer(data.gameState.map);
                
                // Update camera after map is set
                console.log('Updating camera with new map dimensions');
                this.camera.updateDimensions();
                this.camera.centerOnMap();
            }
            
            // Update entities
            this.processServerEntities(data.gameState);
            
            // Store game time
            this.gameTime = data.gameState.gameTime || 0;
        }
        
        console.log('=== Game State Processing Complete ===\n');
    }
    
    /**
     * Process entities from server
     */
    processServerEntities(gameState) {
        console.log('\n=== Processing Server Entities ===');
        
        // Clear existing entities
        this.entities = [];
        
        // Process buildings
        if (gameState.buildings) {
            console.log('Processing buildings:', gameState.buildings.size);
            gameState.buildings.forEach((buildingData, id) => {
                const building = new Building(
                    id,
                    buildingData.type,
                    buildingData.owner,
                    buildingData.x,
                    buildingData.y,
                    buildingData.health
                );
                this.entities.push(building);
            });
        }
        
        // Process units
        if (gameState.units) {
            console.log('Processing units:', gameState.units.size);
            gameState.units.forEach((unitData, id) => {
                const unit = new Unit(
                    id,
                    unitData.type,
                    unitData.owner,
                    unitData.x,
                    unitData.y,
                    unitData.health
                );
                this.entities.push(unit);
            });
        }
        
        // Process heroes from player data
        if (gameState.players) {
            console.log('Processing heroes from players:', gameState.players.size);
            gameState.players.forEach((playerData, id) => {
                if (playerData.hero) {
                    const hero = new Hero(
                        playerData.hero.id,
                        id,
                        playerData.hero.x,
                        playerData.hero.y,
                        playerData.hero.health
                    );
                    this.entities.push(hero);
                }
            });
        }
        
        console.log('Total entities processed:', this.entities.length);
        console.log('=== Entity Processing Complete ===\n');
    }
    
    /**
     * Main game loop
     */
    gameLoop() {
        // Calculate FPS
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.fps = 1000 / deltaTime;
        this.lastFrameTime = currentTime;
        
        // Update game state
        this.update(deltaTime);
        
        // Render the game
        this.render();
        
        // Request next frame
        requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        // Update input handler
        this.inputHandler.update();
        
        // Update entities
        this.entities.forEach(entity => {
            if (typeof entity.update === 'function') {
                entity.update(deltaTime);
            }
        });
    }
    
    /**
     * Render the game
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set up transform for isometric view
        this.ctx.save();
        
        // Render map
        this.map.render(this.ctx, this.camera);
        
        // Render entities
        this.entities.forEach(entity => {
            if (typeof entity.render === 'function') {
                entity.render(this.ctx, this.camera);
            }
        });
        
        // Restore transform
        this.ctx.restore();
        
        // Render UI
        this.renderUI();
    }
    
    /**
     * Render UI elements
     */
    renderUI() {
        // Render game time
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(timeString, this.canvas.width / 2, 30);
        
        // Render FPS if in debug mode
        if (Config.DEBUG_MODE) {
            this.ctx.font = '12px Arial';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`FPS: ${Math.round(this.fps)}`, 10, 20);
        }
    }
} 