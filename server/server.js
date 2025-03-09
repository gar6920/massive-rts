const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('colyseus');
const { monitor } = require('@colyseus/monitor');
const { WebSocketTransport } = require('@colyseus/ws-transport');
const { GameRoom } = require('./rooms/GameRoom');

const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static('public'));

// Create HTTP server
const server = http.createServer(app);

// Create Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server
  })
});

// Register room handlers
gameServer.define('game_room', GameRoom);

// Register Colyseus monitor (accessible at /colyseus)
app.use('/colyseus', monitor());

// Define port to run server on
const port = process.env.PORT || 3000;

// Listen on specified port
gameServer.listen(port);
console.log(`Game server running on http://localhost:${port}`);

// Export for testing
module.exports = { app, server, gameServer }; 