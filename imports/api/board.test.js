import { assert } from 'meteor/practicalmeteor:chai';
import * as Board from './board.js';

export function checkBoard(expected, board)
{
  let r, c;
  for(r = 0; r < 10; r++) {
    for(c = 0; c < 10; c++) {
      assert.equal(expected[r][c], board[r][c].val, "row: " + r.toString() + " col: " + c.toString());
    }
  }
}

describe('board', function() {
  describe('makeBoard', function() {
    it('returns an array of size 10', function () {
      const board = Board.makeEmptyBoard();
      assert.isArray(board);
      assert(board.length, 10);
    });
    it('returns an array with rows of size 10', function () {
      const board = Board.makeEmptyBoard();
      assert.isArray(board);
      for(let row of board) {
        assert.isArray(row);
        assert(row.length, 10);
      }
    });
    it('returns an array with all cells empty', function () {
      const board = Board.makeEmptyBoard();
      assert.isArray(board);
      for(let row of board) {
        assert.isArray(row);
        for(let cell of row) {
          assert.propertyVal(cell, 'val', 'E');
        }
      }
    });
  });

  describe('setRange', function() {
    function testBoard(expected, x, y, len, width, value)
    {
      const board = Board.makeEmptyBoard();
      Board.setRange(board, x, y, len, width, value);
      checkBoard(expected, board);
    }

    it('works correctly for a single cell', function () {
      const exp = [
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEXEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];
      testBoard(exp, 2, 4, 1, 1, 'X');
    });
    it('works correctly for a horizontal ship', function () {
      const exp = [
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EXXXXEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];
      testBoard(exp, 3, 1, 1, 4, 'X');
    });
    it('works correctly for a vertical ship', function () {
      const exp = [
        "XEEEEEEEEE",
        "XEEEEEEEEE",
        "XEEEEEEEEE",
        "XEEEEEEEEE",
        "XEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",	
        "EEEEEEEEEE",
      ];
      testBoard(exp, 0, 0, 5, 1, 'X');
    });
    it('works correctly for a block', function () {
      const exp = [
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEXXXEEEE",
        "EEEXXXEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];
      testBoard(exp, 6, 3, 2, 3, 'X');
    });
  });

  describe('spacesAreSame', function() {
    it('spaces are the same', function(){
      var space1 = {row: 1, col: 2};
      var space2 = {row: 1, col: 2};

      assert.equal(true, Board.spacesAreSame(space1, space2));

      space1.row = 3;
      assert.equal(false, Board.spacesAreSame(space1, space2));

      space1.row = 1;
      space1.col = 3;
      assert.equal(false, Board.spacesAreSame(space1, space2));

      space1.row = 3;
      space1.col = 3;
      assert.equal(false, Board.spacesAreSame(space1, space2));

      space1.row = 2;
      space1.col = 1;
      assert.equal(false, Board.spacesAreSame(space1, space2));
    });
  });
  describe('spaceIsOnShip', function() {
    it('shot to carrier vertical', function(){
      var ships = { carrier: { row: 0, col: 0, vertical: true } };
      var shot = { row: 0, col: 0 };

      assert.equal(true, Board.spaceIsOnShip(shot, ships));

      shot.row = 1;
      assert.equal(true, Board.spaceIsOnShip(shot, ships));

      shot.row = 4;
      assert.equal(true, Board.spaceIsOnShip(shot, ships));

      shot.row = 5;
      assert.equal(false, Board.spaceIsOnShip(shot, ships));

      shot.row = 0;
      shot.col = 1;
      assert.equal(false, Board.spaceIsOnShip(shot, ships));
    });
    it('shot to destroyer horizontal', function(){
      var ships = { destroyer: { row: 0, col: 0, vertical: false } };
      var shot = { row: 0, col: 0 };

      assert.equal(true, Board.spaceIsOnShip(shot, ships));

      shot.row = 1;
      assert.equal(false, Board.spaceIsOnShip(shot, ships));

      shot.row = 0;
      shot.col = 1;
      assert.equal(true, Board.spaceIsOnShip(shot, ships));

      shot.col = 2;
      assert.equal(false, Board.spaceIsOnShip(shot, ships));
    });
    it('multiple ships', function(){
      var ships = {
        carrier: { row: 0, col: 0, vertical: true },
        cruiser: { row: 0, col: 1, vertical: true },
        destroyer: { row: 0, col: 2, vertical: false }
      };
      var success_shots = [
        {row: 0, col: 0}, {row: 1, col: 0}, {row: 4, col: 0}, {row: 0, col: 1},
        {row: 2, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}
      ];
      var fail_shots = [
        {row: 5, col: 0}, {row: 3, col: 1}, {row: 1, col: 2}, {row: 1, col: 3},
        {row: 0, col: 4}
      ];

      success_shots.forEach( function(shot){
        assert.equal(true, Board.spaceIsOnShip(shot, ships));
      });
      fail_shots.forEach( function(shot){
        assert.equal(false, Board.spaceIsOnShip(shot, ships));
      });
    });
  });

});