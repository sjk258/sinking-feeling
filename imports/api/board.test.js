import { assert } from 'meteor/practicalmeteor:chai';
import * as Board from './board.js';

describe('board', function() {
    describe('makeBoard', function() {
        it('returns an array of size 10', function () {
            const board = Board.makeBoard();
            assert.isArray(board);
            assert(board.length, 10);
        });
        it('returns an array with rows of size 10', function () {
            const board = Board.makeBoard();
            assert.isArray(board);
            for(let row of board) {
                assert.isArray(row);
                assert(row.length, 10);
            }
        });
        it('returns an array with all cells empty', function () {
            const board = Board.makeBoard();
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
        it('works correctly for a single cell', function () {
            const board = Board.makeBoard();
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
            const board = Board.makeBoard();
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
            const board = Board.makeBoard();
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
            const board = Board.makeBoard();
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
});