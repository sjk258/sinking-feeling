/**
 * Utility code for working with boards.
 */

import { _ } from 'meteor/underscore';
import * as Ship from './ship.js';

/**
 * makeBoard()
 * Returns a game board initialized with all cells empty.
 */
export function makeEmptyBoard() {
  return _.times(10, function() {
    return _.times(10, function() {
       return {state: 'E'};
    });
  });
}

/**
 * setRange(board, row, col, rowCount, colCount, field, val)
 * Updates a game board to set a rectangular region's cell's specified field to
 * have the given value.
 */
export function setRange(board, row, col, rowCount, colCount, field, value) {
  let r, c;
  for(r = row; r < row + rowCount; r++) {
    for(c = col; c < col + colCount; c++) {
      board[r][c][field] = value;
    }
  }
}

// only exported for testing, don't call this
export function addShips(board, ships, mark) {
  for(let j = 0; j < Ship.types.length; j++) {
    const type = Ship.types[j];
    if(!(type in ships)) continue;

    const ship = ships[type];
    const row = ship.row;
    const col = ship.col;
    const len = Ship.lengths[type];

    if(ship.vertical) {
      if(mark) {
        setRange(board, row, col, len, 1, 'state', 'S');
      }
      board[row][col].ship = 'Top';
      if(len > 2) {
        setRange(board, row+1, col, len-2, 1, 'ship', 'Vertical');
      }
      board[row+len-1][col].ship = 'Bottom';
    } else {
      if(mark) {
        setRange(board, row, col, 1, len, 'state', 'S');
      }
      board[row][col].ship = 'Left';
      if(len > 2) {
        setRange(board, row, col+1, 1, len-2, 'ship', 'Horizontal');
      }
      board[row][col+len-1].ship = 'Right';
    }
  }
}

// only exported for testing, don't call this
export function addShots(board, shots, ships) {
  shots.forEach(function(shot){
    if(spaceIsOnShip(shot, ships))
    {
      board[shot.row][shot.col].state = 'H';
    }
    else
    {
      board[shot.row][shot.col].state = 'M';
    }
  });
}

// only exported for testing, don't call this
export function spaceIsOnShip(space, ships){
  for(var ship in ships)
  {
    for(let i = 0; i < Ship.lengths[ship]; i++) {
      var ship_space = { row: ships[ship].row, col: ships[ship].col };
      if(ships[ship].vertical){
        ship_space.row += i;
      }
      else{
        ship_space.col += i;
      }
      if(spacesAreSame(space, ship_space))
      {
        return true;
      }
    }
  }
  return false;
}

// only exported for testing, don't call this
export function spacesAreSame(space1, space2){
  if((space1.row == space2.row) && (space1.col == space2.col))
  {
    return true;
  }
  return false;
}