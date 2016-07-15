/**
 * This module provides the entry point to the AI players.
 *
 * Code that wants to use AI functionality should access it through this
 * module. The individual AI players should not be accessed directly (except by
 * tests).
 */

// Import all of the AI players
import * as AI_Sue from './ai/sue.js';
import * as AI_Ralph from './ai/ralph.js';
import * as AI_Jack from './ai/jack.js';
import * as AI_Paul from './ai/paul.js';
import * as AI_Pat from './ai/pat.js';

// Manually map each AI player with its name
const ai_players = {
  'sue': AI_Sue,
  'ralph': AI_Ralph,
  'jack': AI_Jack,
  'paul': AI_Paul,
  'pat': AI_Pat,
};

export const default_name = 'sue';

export function getNames() {
  return Object.keys(ai_players);
}

export function getPlayer(name) {
  name = name.toLowerCase();
  if (!(name in ai_players)) {
    name = default_name;
  }
  return ai_players[name];
}