import { assert } from 'meteor/practicalmeteor:chai';
import * as Log from './log.js';

describe('log', function() {
  describe('create log', function() {
    it('created game', function() {
      const at = new Date(2016, 01, 01, 01, 01, 01);
      const game = {created: at, state: 'setup'};

      var value = Log.getLog(game);

      assert.lengthOf(value, 1);
      assert.equal(value[0].time, at);
      assert.equal(value[0].event, 'created');
    });
  });
});
