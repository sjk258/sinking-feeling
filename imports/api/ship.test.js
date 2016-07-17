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

  describe('overlap', function() {
    it('should return true when there is an overlap', function() {
      const expected = true;
      const positions = {cruiser: { row: 0, col: 0, vertical: true}};
      const test_type = "submarine";
      const test_row = 2;
      const test_col = 0;
      const test_vertical = true;

      const result = Ship.overlap(test_type, test_row, test_col, test_vertical,
         positions);

      assert.equal(expected, result);
    });
    it('should return false when there is not an overlap', function(){
      const expected = false;
      const positions = {cruiser: { row: 0, col: 0, vertical: true}};
      const test_type = "submarine";
      const test_row = 3;
      const test_col = 0;
      const test_vertical = true;

      const result = Ship.overlap(test_type, test_row, test_col, test_vertical,
         positions);

      assert.equal(expected, result);
    });
  });

});