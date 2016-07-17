import { assert } from 'meteor/practicalmeteor:chai';
import * as Ship from './ship.js';

describe('api/ships.js', function() {
  describe('types', function() {
    it('is an array', function() {
      assert.isArray(Ship.types);
    });
    it('contains strings', function() {
      Ship.types.forEach(function(type) {
        assert.isString(type);
      });
    });
  });
  
  describe('lengths', function() {
    it('is an object', function() {
      assert.isObject(Ship.lengths);
    });
    describe('has entries for each type in types', function() {
      Ship.types.forEach(function(type) {
        it(type + ' exists', function() {
          assert.property(Ship.lengths, type);
        });
        it(type + ' is numeric', function() {
          assert.isNumber(Ship.lengths[type]);
        });
      });
    });
  });

  describe('create', function() {
    it('should return an object with all defined ship types', function() {
      const ships = Ship.create();
      assert.sameMembers(Object.keys(ships), Ship.types);
    });
    it('should provide each ship with keys row, col, and vertical', function() {
      const ships = Ship.create();
      Ship.types.forEach(type => {
        assert.sameMembers(Object.keys(ships[type]), ['row', 'col', 'vertical']);
      });
    });
  });

});