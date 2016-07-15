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
});