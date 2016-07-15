import { assert } from 'meteor/practicalmeteor:chai';
import * as Log from './log.js';

describe('log', function() {
  describe('create log', function() {
    const start = new Date(2016, 01, 01, 01, 01, 01);
    function startGame(game) {
      game.created = start;
      game.state = 'setup';
      return game;
    }

    const creator_ready = new Date(2016, 01, 01, 01, 01, 02);
    function creatorReady(game) {
      game.creator = {};
      game.creator.ready = true;
      game.creator.ready_at = creator_ready;
      return game;
    }

    const challenger_ready = new Date(2016, 01, 01, 01, 01, 03);
    function challengerReady(game) {
      game.challenger = {};
      game.challenger.ready = true;
      game.challenger.ready_at = challenger_ready;
      return game;
    }

    it('created game', function() {
      const game = startGame({});

      var value = Log.getLog(game);

      assert.lengthOf(value, 1);
      assert.equal(value[0].time, start);
      assert.equal(value[0].event, 'created');
    });
    it('creator ready', function() {
      const game = creatorReady(startGame({}));

      var value = Log.getLog(game);

      assert.lengthOf(value, 2);
      assert.equal(value[1].time, creator_ready);
      assert.equal(value[1].event, 'creator ready');
    });
    it('both ready', function() {
      const game = challengerReady(creatorReady(startGame({})));

      var value = Log.getLog(game);

      assert.lengthOf(value, 3);
      assert.equal(value[1].time, creator_ready);
      assert.equal(value[1].event, 'creator ready');
      assert.equal(value[2].time, challenger_ready);
      assert.equal(value[2].event, 'challenger ready');
    });
    it('challenger ready', function() {
      const game = challengerReady(startGame({}));

      var value = Log.getLog(game);

      assert.lengthOf(value, 2);
      assert.equal(value[1].time, challenger_ready);
      assert.equal(value[1].event, 'challenger ready');
    });
    it('both ready other order', function() {
      const game = challengerReady(creatorReady(startGame({})));
      game.challenger.ready_at = new Date(2016, 01, 01, 01, 01, 06);
      game.creator.ready_at = new Date(2016, 01, 01, 01, 01, 07);

      var value = Log.getLog(game);

      assert.lengthOf(value, 3);
      assert.equal(value[1].event, 'challenger ready');
      assert.equal(value[2].event, 'creator ready');
    });
    it('miss taken', function() {

    });
    it('multiple misses taken', function() {

    });
    it('hit taken', function() {

    });
    it('hits and misses', function(){

    });
    it('shots sunk', function() {

    });
  });
});
