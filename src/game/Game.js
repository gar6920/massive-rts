// This file is now replaced by the Game class in src/index.js
// Keeping this file for backward compatibility but it forwards to the new Game class

import { Game as NewGame } from '../index';

// Export the same Game class from index.js
export const Game = NewGame; 