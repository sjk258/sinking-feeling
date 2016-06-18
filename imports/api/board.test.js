import { assert, expect } from 'meteor/practicalmeteor:chai';
import * as Board from './board.js';

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
    describe('setRange', function	     () {
        it('works correctly for a single cell', function () {
            const board = Board.makeEmptyBoard();
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
            Board.setRange(board, 2, 4, 1, 1, 'X');
            let r, c;
            for(r = 0; r < 10; r++) {
                for(c = 0; c < 10; c++) {
                    assert(board[r][c].val, exp[r][c]);
                }
            }
        });
        it('works correctly for a horizontal ship', function () {
            const board = Board.makeEmptyBoard();
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
            Board.setRange(board, 3, 1, 1, 4, 'X');
            let r, c;
            for(r = 0; r < 10; r++) {
                for(c = 0; c < 10; c++) {
                    assert(board[r][c].val, exp[r][c]);
                }
            }
        });
        it('works correctly for a vertical ship', function () {
            const board = Board.makeEmptyBoard();
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
            Board.setRange(board, 0, 0, 5, 1, 'X');
            let r, c;
            for(r = 0; r < 10; r++) {
                for(c = 0; c < 10; c++) {
                    assert(board[r][c].val, exp[r][c]);
                }
            }
        });
        it('works correctly for a block', function () {
            const board = Board.makeEmptyBoard();
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
            Board.setRange(board, 6, 3, 2, 3, 'X');
            let r, c;
            for(r = 0; r < 10; r++) {
                for(c = 0; c < 10; c++) {
                    assert(board[r][c].val, exp[r][c]);
                }
            }
        });
    });
    describe('placeShip', function() {
      it('vertical at origin', function(){
        var game = {};
        var row = 0;
        var col = 0;
        var vertical = true;

        Board.placeShip("carrier", row, col, vertical, game);

        assert.equal(1, Object.keys(game.positions).length);
        assert.equal(row, game.positions.carrier.row);
        assert.equal(col, game.positions.carrier.col);
        assert.equal(vertical, game.positions.carrier.vertical);
      });
      it('all five', function(){
        var game = {};
        var ships = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
        var row = 0;
        var col = 0;
        var vertical = true;

        ships.forEach(function(shipType){
          Board.placeShip(shipType, row, col, vertical, game);
          col++;
        });

        assert.equal(ships.length, Object.keys(game.positions).length);
        assert.equal(0, game.positions.carrier.col);
        assert.equal(1, game.positions.battleship.col);
        assert.equal(2, game.positions.cruiser.col);
        assert.equal(3, game.positions.submarine.col);
        assert.equal(4, game.positions.destroyer.col);    		
      });
      it('change existing', function(){
        var game = {};
        var ship = "carrier";
        var row = 0;
        var col1 = 0;
        var col2 = 5;
        var vertical = true;

        Board.placeShip(ship, row, col1, vertical, game);
        Board.placeShip(ship, row, col2, vertical, game);

        assert.equal(1, Object.keys(game.positions).length);
        assert.equal(col2, game.positions.carrier.col);
      });
      it('invalid type', function(){
	var invalid_ship = "pt boat";
	expect(function(){
	  Board.placeShip(invalid_ship, 0, 0, true, {});
	}).to.throw('Unrecognised ship type');
      });
    });
});