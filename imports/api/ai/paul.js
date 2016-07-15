import {_} from 'meteor/underscore';

import * as AI from '../ai.js';
import * as Ralph from './ralph.js';
import * as Jack from './jack.js';

export const name = 'paul';
export const full_name = 'Parity Paul';

export function checkParity(move, shift) {
  return (move.row + move.col + shift) % 2 === 0;
}

export function hunt(board, state) {
  const moves = _.filter(Ralph.allMoves(), (m) => checkParity(m, state.shift));
  let move;
  try {
    move = Ralph.firstValidMove(board, moves);
  } catch(err) {
    if(err.error === 'no-moves-left') {
      // This should only happen with 1-length ships. But it also fulfills the
      // expectation that eventually all squares will be targeted.
      state.ai = 'ralph';
      move = Ralph.makeMove(board, state);
    } else {
      throw err;
    }
  }
  Jack.checkMove(board, state, move);
  return move;
}

export function target(board, state) {
  return Jack.target(board, state);
}

export function initState(state, ai) {
  Jack.initState(state);
  if(!('ai' in state)) {
    state.ai = ai;
  }
  if(!('shift' in state)) {
    state.shift = _.random(0, 1);
  }
}

export function makeMove(board, state) {
  initState(state, 'paul');
  if(state.ai !== 'paul') {
    const ai = AI.getPlayer(state.ai);
    return ai.makeMove(board, state);
  }
  Jack.checkState(state);

  if(state.mode === 'hunt') {
    return hunt(board, state);
  } else {
    return target(board, state);
  }
}