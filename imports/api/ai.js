/**
 * This module provides the entry point to the AI players.
 *
 * Code that wants to use AI functionality should access it through this
 * module. The individual AI players should not be accessed directly (except by
 * tests).
 */

// Import all of the AI players
import * as AI_Sue from './ai/sue.js';

// Manually map each AI player with its name
const ai_players = {
  'sue': AI_Sue,
};

/**
 * default_name is the name of the AI player that is used as a fallback if an
 * unknown AI player name is provided.
 */
export const default_name = 'sue';

/**
 * getNames()
 * Returns an array of all of the AI player names, in an arbitrary order.
 */
export function getNames() {
  return Object.keys(ai_players);
}

/**
 * getPlayer(name)
 * Return the AI player associated with the given name.
 *
 * If the name is not recognized, the default AI player is returned instead.
 *
 * An AI player 'ai' is an object with the following properties:
 *
 * ai.name
 * The name of the AI player. This will match the name provided to the function
 * if it was recognized.
 *
 * ai.makeMove(board)
 * Returns [row,col] indicating the next move the AI would like to make based
 * on the provided board data.
 */
export function getPlayer(name) {
  name = name.toLowerCase();
  if (!(name in ai_players)) {
    name = default_name;
  }
  return ai_players[name];
}