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
    const ship = Ship.types[j];
    if(!(ship in ships)) continue;
    let row = ships[ship].row;
    let col = ships[ship].col;
    for(let i = 0; i < Ship.lengths[ship]; i++)
    {
      if(mark) {
        board[row][col].state = 'S';
      }
      if(ships[ship].vertical) {
        if(i === 0)
        {
          board[row][col].ship = 'Top';
        }
        else if(i === (Ship.lengths[ship] - 1))
        {
          board[row][col].ship = 'Bottom';
        }
        else
        {
          board[row][col].ship = 'Vertical';
        }

        row++;
      }
      else
      {
        if(i === 0)
        {
          board[row][col].ship = 'Left';
        }
        else if(mark && i === (Ship.lengths[ship] - 1))
        {
          board[row][col].ship = 'Right';
        }
        else if(mark)
        {
          board[row][col].ship = 'Horizontal';
        }

        col++;
      }
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