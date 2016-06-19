import { assert } from 'meteor/practicalmeteor:chai';
import * as Game from './game.js';

describe('game', function() {
  describe('shot', function() {
    it('added to array', function () {
      var row = 7;
      var col = 8;
      game = {creator: {shots: [{row: 0, col: 0}]}};
      
      Game.shot(game, "creator", row, col);
      
      assert.equal(2, game.creator.shots.length);
      assert.equal(row, game.creator.shots[1].row);
      assert.equal(col, game.creator.shots[1].col);
    });
    it('challenger shot', function () {
      var row = 7;
      var col = 8;
      var player = "challenger";
      game = {};
      game[player] = {shots: [{row: 0, col: 0}]};
      
      Game.shot(game, player, row, col);
      
      assert.equal(2, game[player].shots.length);
      assert.equal(row, game[player].shots[1].row);
      assert.equal(col, game[player].shots[1].col);
    });
    it('first shot', function () {
      var row = 7;
      var col = 8;
      var player = "creator";
      game = {};
      
      Game.shot(game, player, row, col);
      
      assert.equal(1, game[player].shots.length);      
    });
  });
});

 
