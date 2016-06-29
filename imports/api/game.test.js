import { assert, expect } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import * as Game from './game.js';
import {checkBoard} from './board.test.js';
import {Games} from './games.js';
import {ship_types} from './board.js';

Meteor.methods({
  'test.resetDatabase': () => resetDatabase(),
});

describe('game', function() {
  describe('create', function(){
    beforeEach(function(){
      Meteor.call('test.resetDatabase');
    })
    it('basic setup', function(){
      assert.isObject(Game.create());
    });
    it('turn data', function(){
      var game = Game.create();

      assert.equal(0, game.turn_number);
    });
    it('ready data', function(){
      var game = Game.create();

      assert.equal(false, game.creator_ready);
      assert.equal(false, game.challenger_ready);
    });
    it('player data', function(){
      var game = Game.create();

      ["creator", "challenger"].forEach(function(player){
        assert.isObject(game[player]);
        assert.isObject(game[player].ships);
        assert.isArray(game[player].shots);
      });
    });
    it('created time', function(){
      var game = Game.create();
      var now = new Date();
      console.log(now);

      assert.equal(now.getDate(), game.created_at.getDate());
      assert.equal(now.getMonth(), game.created_at.getMonth());
      assert.equal(now.getYear(), game.created_at.getYear());
      assert.equal(now.getHours(), game.created_at.getHours());
      assert.equal(now.getMinutes(), game.created_at.getMinutes());
    });
    it('set creator', function(){
      var creator = "test";
      var game = Game.create(creator);

      assert.equal(creator, game.creator.user);
    });
    it('in database', function(){
      var test_creator = "TEST_CREATOR";
      var id = "test_id"
      var game = Game.create(test_creator, id);

      var result = Games.findOne({_id: id});

      assert.equal(game._id, result._id);
      assert.equal(test_creator, result.creator.user);
    });
    it('in database anonymous id', function(){
      var test_creator = "TEST_CREATOR";
      var game = Game.create(test_creator);

      var result = Games.findOne({"creator.user": test_creator});

      assert.equal(test_creator, result.creator.user);
    });
    it('ships loaded', function(){
      var game = Game.create();

      ship_types.forEach(function(type){
        assert.isDefined(game.creator.ships[type]);
        assert.isDefined(game.challenger.ships[type]);
      });
    });
  });
  describe('update', function() {
    beforeEach(function(){
      Meteor.call('test.resetDatabase');
    });
    it('update basic game', function(){
      var game = Game.create();
      var gameID = game['_id'];
      var turnNumber = game['turn_number'];

      assert.equal(game['turn_number'], turnNumber);

      game['turn_number'] = game['turn_number'] + 1;

      Game.update(game);

      var result = Games.findOne({"_id": gameID});

      assert.equal(result['turn_number'], turnNumber + 1);
    });
  });
  describe('shot', function() {
    it('added to array', function () {
      var row = 7;
      var col = 8;
      const game = {creator: {shots: [{row: 0, col: 0}]}};

      Game.shot(game, "creator", row, col);

      assert.equal(2, game.creator.shots.length);
      assert.equal(row, game.creator.shots[1].row);
      assert.equal(col, game.creator.shots[1].col);
    });
    it('challenger shot', function () {
      var row = 7;
      var col = 8;
      var player = "challenger";
      const game = {};
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
      const game = {};

      Game.shot(game, player, row, col);

      assert.equal(1, game[player].shots.length);
    });
  });

  describe('placeShip', function() {
    it('vertical at origin', function(){
      var positions = {};
      var row = 0;
      var col = 0;
      var vertical = true;

      Game.placeShip("carrier", row, col, vertical, positions);

      assert.equal(1, Object.keys(positions).length);
      assert.equal(row, positions.carrier.row);
      assert.equal(col, positions.carrier.col);
      assert.equal(vertical, positions.carrier.vertical);
    });
    it('all five', function(){
      var positions = {};
      var ships = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
      var row = 0;
      var col = 0;
      var vertical = true;

      ships.forEach(function(shipType){
        Game.placeShip(shipType, row, col, vertical, positions);
        col++;
      });

      assert.equal(ships.length, Object.keys(positions).length);
      assert.equal(0, positions.carrier.col);
      assert.equal(1, positions.battleship.col);
      assert.equal(2, positions.cruiser.col);
      assert.equal(3, positions.submarine.col);
      assert.equal(4, positions.destroyer.col);
    });
    it('change existing', function(){
      var positions = {};
      var ship = "carrier";
      var row = 0;
      var col1 = 0;
      var col2 = 5;
      var vertical = true;

      Game.placeShip(ship, row, col1, vertical, positions);
      Game.placeShip(ship, row, col2, vertical, positions);

      assert.equal(1, Object.keys(positions).length);
      assert.equal(col2, positions.carrier.col);
    });
    it('invalid type', function(){
      var invalid_ship = "pt boat";
      expect(function(){
        Game.placeShip(invalid_ship, 0, 0, true, {});
      }).to.throw('Unrecognised ship type');
    });
    it('no overlaps', function(){
      // TODO: We need to test to see if ships are overlapping, and throw an exception
    });
  });

  describe('users board', function(){
    it('empty board', function(){
      const exp = [
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: { ships: {}, shots: []},
        challenger: { ships: {}, shots: []}
      };
      var user = 'creator';

      var board = Game.getOwnBoard(game, user);

      checkBoard(exp, board);
    });
    it('only single ship', function(){
      const exp = [
        "SEEEEEEEEE",
        "SEEEEEEEEE",
        "SEEEEEEEEE",
        "SEEEEEEEEE",
        "SEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: {
          ships: {
            carrier: { row: 0, col: 0, vertical: true }
          },
          shots: {}
        },
        challenger: { ships: {}, shots: []} };
      var user = 'creator';

      var board = Game.getOwnBoard(game, user);

      checkBoard(exp, board);
    });
    it('only single ship horizontal', function(){
      const exp = [
        "SSSSSEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: {
          ships: {
            carrier: { row: 0, col: 0, vertical: false }
          },
          shots: {}
        },
        challenger: { ships: {}, shots: []} };
      var user = 'creator';

      var board = Game.getOwnBoard(game, user);

      checkBoard(exp, board);
    });
    it('only multiple ships', function(){
      const exp = [
        "SSSSSEEEEE",
        "SSSSSEEEEE",
        "SSSSEEEEEE",
        "SSEEEEEEEE",
        "SEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: {
          ships: {
            carrier: { row: 0, col: 0, vertical: true },
            battleship: { row: 0, col: 1, vertical: true },
            cruiser: { row: 0, col: 2, vertical: true },
            submarine: { row: 0, col: 3, vertical: true },
            destroyer: { row: 0, col: 4, vertical: true }
          }
        },
        challenger: { ships: {}, shots: []} };
      var user = 'creator';

      var board = Game.getOwnBoard(game, user);

      checkBoard(exp, board);
    });
    it('with shots', function(){
      const exp = [
        "HEEEEEEEEE",
        "SMEEEEEEEE",
        "SEEEEEEEEE",
        "SEEEEEEEEE",
        "SEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: {
          ships: {
            carrier: { row: 0, col: 0, vertical: true }
          }
        },
        challenger: { ships: {}, shots: [{row: 0, col: 0}, {row: 1, col: 1}] }
      };
      var user = 'creator';

      var board = Game.getOwnBoard(game, user);

      checkBoard(exp, board);
    });
  });
  describe('shot to ship', function(){
    it('shot hit space', function(){
      var shot = {row: 1, col: 2};
      var space = {row: 1, col: 2};

      assert.equal(true, Game.shotHitInSpace(shot, space));

      shot.row = 3;
      assert.equal(false, Game.shotHitInSpace(shot, space));

      shot.row = 1;
      shot.col = 3;
      assert.equal(false, Game.shotHitInSpace(shot, space));

      shot.row = 3;
      shot.col = 3;
      assert.equal(false, Game.shotHitInSpace(shot, space));

      shot.row = 2;
      shot.col = 1;
      assert.equal(false, Game.shotHitInSpace(shot, space));
    });
    it('shot to carrier vertical', function(){
      var ships = { carrier: { row: 0, col: 0, vertical: true } };
      var shot = { row: 0, col: 0 };

      assert.equal(true, Game.shotWasHit(shot, ships));

      shot.row = 1;
      assert.equal(true, Game.shotWasHit(shot, ships));

      shot.row = 4;
      assert.equal(true, Game.shotWasHit(shot, ships));

      shot.row = 5;
      assert.equal(false, Game.shotWasHit(shot, ships));

      shot.row = 0;
      shot.col = 1;
      assert.equal(false, Game.shotWasHit(shot, ships));
    });
    it('shot to destroyer horizontal', function(){
      var ships = { destroyer: { row: 0, col: 0, vertical: false } };
      var shot = { row: 0, col: 0 };

      assert.equal(true, Game.shotWasHit(shot, ships));

      shot.row = 1;
      assert.equal(false, Game.shotWasHit(shot, ships));

      shot.row = 0;
      shot.col = 1;
      assert.equal(true, Game.shotWasHit(shot, ships));

      shot.col = 2;
      assert.equal(false, Game.shotWasHit(shot, ships));
    });
    it('multiple ships', function(){
      var ships = {
        carrier: { row: 0, col: 0, vertical: true },
        cruiser: { row: 0, col: 1, vertical: true },
        destroyer: { row: 0, col: 2, vertical: false }
      };
      var success_shots = [
        {row: 0, col: 0}, {row: 1, col: 0}, {row: 4, col: 0}, {row: 0, col: 1},
        {row: 2, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}
      ];
      var fail_shots = [
        {row: 5, col: 0}, {row: 3, col: 1}, {row: 1, col: 2}, {row: 1, col: 3},
        {row: 0, col: 4}
      ];

      success_shots.forEach( function(shot){
        assert.equal(true, Game.shotWasHit(shot, ships));
      });
      fail_shots.forEach( function(shot){
        assert.equal(false, Game.shotWasHit(shot, ships));
      });
    });
  });
  describe('opposite user', function(){
    it('creator', function(){
      var user = 'creator';
      var expected = 'challenger';

      var result = Game.oppositeUser(user);

      assert.equal(expected, result);
    });
    it('challenger', function(){
      var user = 'challenger';
      var expected = 'creator';

      var result = Game.oppositeUser(user);

      assert.equal(expected, result);
    });
  });
  describe('attack', function(){
    it('empty board', function(){
      const exp = [
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: { ships: {}, shots: []},
        challenger: { ships: {}, shots: []}
      };
      var user = 'creator';

      var board = Game.getAttackBoard(game, user);

      checkBoard(exp, board);
    });
    it('only no ships', function(){
      const exp = [
        "MEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: {
          ships: {},
          shots: [{row: 0, col: 0}]
        },
        challenger: { ships: {}, shots: []} };
      var user = 'creator';

      var board = Game.getAttackBoard(game, user);

      checkBoard(exp, board);
    });
    it('hit and miss', function(){
      const exp = [
        "HEEEEEEEEE",
        "EMEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
        "EEEEEEEEEE",
      ];

      var game = {
        creator: {
          ships: {},
          shots: [{row: 0, col: 0}, {row: 1, col: 1}]
        },
        challenger: {
          ships: {carrier: { row: 0, col: 0, vertical: true }},
          shots: []
        }
      };
      var user = 'creator';

      var board = Game.getAttackBoard(game, user);

      checkBoard(exp, board);
    });
  });
});
