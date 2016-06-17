import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import * as AI from './sue.js';

describe('Sequential Sue AI', function () {
    describe('constant name', function () {
        it('should be "sue"', function () {
            assert(AI.name, 'sue');
        });
    });
    describe('function makeMove', function () {
        it('returns 0,0 for first move', function () {
            const game = {
                opponent_board: [
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"]
                ],
            };
            const move = AI.makeMove(game);
            assert.deepEqual(move, [0,0]);
        });
        it('returns 0,9 for tenth move', function () {
            const game = {
                opponent_board: [
                    ["X","X","X","X","X","X","X","X","X","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"]
                ],
            };
            const move = AI.makeMove(game);
            assert.deepEqual(move, [0,9]);
        });
        it('returns 1,0 for eleventh move', function () {
            const game = {
                opponent_board: [
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"],
                    ["E","E","E","E","E","E","E","E","E","E"]
                ],
            };
            const move = AI.makeMove(game);
            assert.deepEqual(move, [1,0]);
        });
        it('returns 9,9 for hundredth move', function () {
            const game = {
                opponent_board: [
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","E"]
                ],
            };
            const move = AI.makeMove(game);
            assert.deepEqual(move, [9,9]);
        });
        it('throws error when board full', function () {
            const game = {
                opponent_board: [
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"],
                    ["X","X","X","X","X","X","X","X","X","X"]
                ],
            };
            const makeMove = function() {
                AI.makeMove(game);
            };
            assert.throws(makeMove, Meteor.error, 'no-moves-left');
        });
    });
});