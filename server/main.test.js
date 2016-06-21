import { Games } from '../imports/api/games.js';
import { assert } from 'meteor/practicalmeteor:chai';

import './main.js';

describe('main_server', function() {
  it('default is initialized', function(){
    assert.equal(1, Games.find( { _id:'test' } ).count());
  });
});
