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
});