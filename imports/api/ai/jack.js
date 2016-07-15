import {_} from 'meteor/underscore';

import * as Ralph from './ralph.js';

export const name = 'jack';
export const full_name = 'Geometric Jack';

export function addOpenNeighbors(targets, board, row, col) {
  if(row > 0 && board[row-1][col].state === 'E') {
    targets.push({row: row-1, col: col});
  }
  if(col > 0 && board[row][col-1].state === 'E') {
    targets.push({row: row, col: col-1});
  }
  if(row < 9 && board[row+1][col].state === 'E') {
    targets.push({row: row+1, col: col});
  }
  if(col < 9 && board[row][col+1].state === 'E') {
    targets.push({row: row, col: col+1});
  }
}

export function checkMove(board, state, move) {
  // Peek at move to see if state needs to change
  // If we hit a ship, switch to target mode
  if('ship' in board[move.row][move.col]) {
    state.mode = 'target';
    addOpenNeighbors(state.targets, board, move.row, move.col);
  }
}

export function hunt(board, state) {
  const move = Ralph.makeMove(board, {});
  checkMove(board, state, move);
  return move;
}

export function target(board, state) {
  // Randomly select a target from the list, to avoid having a set pattern
  const idx = _.random(state.targets.length-1);
  const move = state.targets[idx];
  state.targets.splice(idx, 1);

  checkMove(board, state, move);
  return move;
}

export function makeMove(board, state) {
  if(!('mode' in state)) {
    state.mode = 'hunt';
  }
  if(!('targets' in state)) {
    state.targets = [];
  }
  if(state.targets.length === 0) {
    state.mode = 'hunt';
  }

  if(state.mode === 'hunt') {
    return hunt(board, state);
  } else {
    return target(board, state);
  }
}