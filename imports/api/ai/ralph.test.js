import { assert } from 'meteor/practicalmeteor:chai';
import * as AI from './ralph.js';

describe('api/ai/ralph.js', function() {
  describe('intToMove', function() {
    it('should map 0 to {row: 0, col: 0}', function() {
      const move = AI.intToMove(0);
      assert.deepEqual(move, {row: 0, col: 0});
    });
    it('should map 1 to {row: 0, col: 1}', function() {
      const move = AI.intToMove(1);
      assert.deepEqual(move, {row: 0, col: 1});
    });
    it('should map 10 to {row: 1, col: 0}', function() {
      const move = AI.intToMove(1);
      assert.deepEqual(move, {row: 0, col: 1});
    });
    it('should map 99 to {row: 9, col: 9}', function() {
      const move = AI.intToMove(1);
      assert.deepEqual(move, {row: 0, col: 1});
    });
  });

  describe('firstValidMove', function() {
    it('should return the first valid move', function() {
      const moves = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}];
      const board = [[{state: "E"}, {state: "E"}, {state: "E"}]];
      const move = AI.firstValidMove(board, moves);
      assert.deepEqual(move, {row: 0, col: 0});
    });
    it('should skip invalid moves', function() {
      const moves = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}];
      const board = [[{state: "X"}, {state: "X"}, {state: "E"}]];
      const move = AI.firstValidMove(board, moves);
      assert.deepEqual(move, {row: 0, col: 2});
    });
    it('should throw Meteor.Error("no-moves-left") if all moves are invalid', function() {
      const moves = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}];
      const board = [[{state: "X"}, {state: "X"}, {state: "X"}]];
      const action = () => { AI.firstValidMove(board, moves); };
      assert.throws(action, Meteor.Error, 'no-moves-left');
    });
  });
});