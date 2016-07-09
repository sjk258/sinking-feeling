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
  return _.times(10, function(n) {
    return _.times(10, function(n) {
       return {val: 'E'};
    });
  });
}

/**
 * setRange(board, row, col, rowCount, colCount, val)
 * Updates a game board to set a rectangular region's cell values to the given
 * value.
 */
export function setRange(board, row, col, rowCount, colCount, val) {
  let r, c;
  for(r = row; r < row + rowCount; r++) {
    for(c = col; c < col + colCount; c++) {
      board[r][c].val = val;
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
      board[row][col].shipNum = j;

      if(ships[ship].vertical)
      {
        if(mark && i === 0)
        {
          // Ship at top
          board[row][col].val = 'S_Top';
        }
        else if(mark && i === (Ship.lengths[ship] - 1))
        {
          // Ship at bottom
          board[row][col].val = 'S_Bottom';
        }
        else if(mark)
        {
          // Mid-piece of vertical ship
          board[row][col].val = 'S_Vertical';
        }

        row++;
      }
      else
      {
        if(mark && i === 0)
        {
          // Ship at top
          board[row][col].val = 'S_Left';
        }
        else if(mark && i === (Ship.lengths[ship] - 1))
        {
          // Ship at bottom
          board[row][col].val = 'S_Right';
        }
        else if(mark)
        {
          // Mid-piece of vertical ship
          board[row][col].val = 'S_Horizontal';
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
      board[shot.row][shot.col].val = 'H';
    }
    else
    {
      board[shot.row][shot.col].val = 'M';
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