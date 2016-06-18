/**
 * Utility code for working with boards.
 */

import { _ } from 'meteor/underscore';

/**
 * makeBoard()
 * Returns a game board initialized with all cells empty.
 */
export function makeBoard() {
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

export function placeShip(ship_type, row, col, vertical, game) {
  if (typeof game.positions == 'undefined')
  {
  	 game.positions = {};
  }
  if (typeof game.positions[ship_type] == 'undefined')
  {
  	 game.positions[ship_type] = {};
  }
  
  game.positions[ship_type].row = row;
  game.positions[ship_type].col = col;
  game.positions[ship_type].vertical = vertical;
}