import { assert, expect } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { _ } from 'meteor/underscore';
import * as Ship from './ship.js';
import * as Board from './board.js';
import * as Game from './game.js';
import {checkBoard} from './board.test.js';
import {Games} from './games.js';

Meteor.methods({
  'test.resetDatabase': () => resetDatabase(),
});

describe('api/game.js', function() {
  describe('create', function(){
    beforeEach(function(){
      Meteor.call('test.resetDatabase');
    });
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
      var id = "test_id";
      var game = Game.create(test_creator, id);

      var result = Games.findOne({_id: id});

      assert.equal(game._id, result._id);
      assert.equal(test_creator, result.creator.user);
    });
    it('in database anonymous id', function(){
      var test_creator = "TEST_CREATOR";
      Game.create(test_creator);

      var result = Games.findOne({"creator.user": test_creator});

      assert.equal(test_creator, result.creator.user);
    });
    it('ships loaded', function(){
      var game = Game.create();

      Ship.types.forEach(function(type){
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
      var gameID = game._id;
      var turnNumber = game.turn_number;

      assert.equal(game.turn_number, turnNumber);

      game.turn_number = game.turn_number + 1;

      Game.update(game);

      var result = Games.findOne({_id: gameID});

      assert.equal(result.turn_number, turnNumber + 1);
    });
  });

  describe('computer shot', function() {
    it('first shot', function() {
      const game = {
        creator: {
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        challenger: {shots: []},
        computer_state: {},
        computer_id: 'sue',
      };
      Game.computerShot(game);
      assert.equal(1, game.challenger.shots.length);
      assert.equal(0, game.challenger.shots[0].row);
      assert.equal(0, game.challenger.shots[0].col);
    });
    it('second shot', function() {
      const game = {
        creator: {
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        challenger: {shots: [{row: 0, col: 0}]},
        computer_state: {},
        computer_id: 'sue',
      };
      Game.computerShot(game);
      assert.equal(2, game.challenger.shots.length);
      assert.equal(0, game.challenger.shots[0].row);
      assert.equal(0, game.challenger.shots[0].col);
    });
  });

  describe('check shot doesnt exit', function() {
    it('first shot', function(){
      const shot = {row: 0, col: 0};
      const shots = [];

      assert.isTrue(Game.checkShotUnique(shot, shots));
    });
    it('second shot exists', function() {
      const shot = {row: 0, col: 0};
      const shots = [shot];

      assert.isFalse(Game.checkShotUnique(shot, shots));
    });
    it('multiple shots exists', function() {
      const shot = {row: 0, col: 0};
      const shots = [{row: 1, col: 1}, shot];

      assert.isFalse(Game.checkShotUnique(shot, shots));
    });
  });

  describe('player shot', function() {
    it('added to array', function () {
      var row = 7;
      var col = 8;
      const game = {creator: {shots: [{row: 0, col: 0}]}};

      Game.playerShot(game, "creator", row, col);

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

      Game.playerShot(game, player, row, col);

      assert.equal(2, game[player].shots.length);
      assert.equal(row, game[player].shots[1].row);
      assert.equal(col, game[player].shots[1].col);
    });
    it('first shot', function () {
      var row = 7;
      var col = 8;
      var player = "creator";
      const game = {};

      Game.playerShot(game, player, row, col);

      assert.equal(1, game[player].shots.length);
    });
    it('shot exists', function() {
      const row = 1;
      const col = 1;
      const game = {creator: {shots: [{row: row, col: col}]}};

      assert.throw(function() {
        Game.playerShot(game, "creator", row, col);
      }, "Shot Exists");
    });
  });

  describe('fire', function() {
    it('works as expected for creator in two-player', function() {
      const game = {
        creator: {
          shots: [],
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        challenger: {
          shots: [],
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        current_player: 'creator',
        turn_number: 0,
      };

      Game.fire(game, 0, 0);

      assert.deepEqual(game.creator.shots, [{row: 0, col: 0}]);
      assert.deepEqual(game.challenger.shots, []);
      assert.equal(game.turn_number, 1);
      assert.equal(game.current_player, 'challenger');
    });
    it('works as expected for challenger in two-player', function() {
      const game = {
        creator: {
          shots: [],
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        challenger: {
          shots: [],
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        current_player: 'challenger',
        turn_number: 0,
      };

      Game.fire(game, 0, 0);

      assert.deepEqual(game.challenger.shots, [{row: 0, col: 0}]);
      assert.deepEqual(game.creator.shots, []);
      assert.equal(game.turn_number, 1);
      assert.equal(game.current_player, 'creator');
    });
    it('works as expected for creator versus AI', function() {
      const game = {
        creator: {
          shots: [],
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        challenger: {
          shots: [],
          ships: {
            carrier: {row: 0, col: 0},
            battleship: {row: 1, col: 0},
            cruiser: {row: 2, col: 0},
            submarine: {row: 3, col: 0},
            destroyer: {row: 4, col: 0},
          }
        },
        current_player: 'creator',
        turn_number: 0,
        computer_id: 'sue',
        computer_state: {},
      };

      Game.fire(game, 1, 1);

      assert.deepEqual(game.creator.shots, [{row: 1, col: 1}]);
      assert.deepEqual(game.challenger.shots, [{row: 0, col: 0}]);
      assert.equal(game.turn_number, 2);
      assert.equal(game.current_player, 'creator');
    });
  });

  describe('overlap', function(){
    it('single space', function(){
      const expected = true;
      const positions = {cruiser: { row: 0, col: 0, vertical: true}};
      const test_type = "submarine";
      const test_row = 2;
      const test_col = 0;
      const test_vertical = true;

      const result = Game.overlap(test_type, test_row, test_col, test_vertical,
         positions);

      assert.equal(expected, result);
    });
    it('nothing', function(){
      const expected = false;
      const positions = {cruiser: { row: 0, col: 0, vertical: true}};
      const test_type = "submarine";
      const test_row = 3;
      const test_col = 0;
      const test_vertical = true;

      const result = Game.overlap(test_type, test_row, test_col, test_vertical,
         positions);

      assert.equal(expected, result);
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
    it('ship overlaps another', function(){
      const positions = {};
      Game.placeShip("carrier", 0, 0, true, positions);
      Game.placeShip("battleship", 0, 1, true, positions);

      assert.throw(function(){
        Game.placeShip("battleship", 0, 0, true, positions);
      }, "Ships Overlapping");

      assert.equal(0, positions.carrier.col); // Still there
    });
    it('move overlaps same', function(){
      const positions = {};
      Game.placeShip("carrier", 0, 0, true, positions);
      Game.placeShip("carrier", 1, 0, true, positions);

      assert.equal(1, Object.keys(positions).length); // Still there
    });
  });

  describe('randomizeShips', function() {
    it('should change the positions of the ships', function () {
      const ships1 = Game.initShips();
      const ships2 = {};
      Ship.types.forEach(type => {
        ships2[type] = _.clone(ships1[type]);
      });
      Game.randomizeShips(ships1);
      assert(_.some(Ship.types, type => {
        return ships1[type].row != ships2[type].row ||
          ships1[type].col != ships2[type].col ||
          ships1[type].vertical != ships2[type].vertical;
      }));
    });
  });

  describe('initShips', function() {
    it('should return an object with all defined ship types', function() {
      const ships = Game.initShips();
      assert.sameMembers(Object.keys(ships), Ship.types);
    });
    it('should provide each ship with keys row, col, and vertical', function() {
      const ships = Game.initShips();
      Ship.types.forEach(type => {
        assert.sameMembers(Object.keys(ships[type]), ['row', 'col', 'vertical']);
      });
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
        ["S_Top","E","E","E","E","E","E","E","E","E"],
        ["S_Vertical","E","E","E","E","E","E","E","E","E"],
        ["S_Vertical","E","E","E","E","E","E","E","E","E"],
        ["S_Vertical","E","E","E","E","E","E","E","E","E"],
        ["S_Bottom","E","E","E","E","E","E","E","E","E"],
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
        ["S_Left","S_Horizontal","S_Horizontal","S_Horizontal",
        "S_Right","E","E","E","E","E"],
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
        ["S_Top","S_Top","S_Top","S_Top","S_Top","E","E","E","E","E"],
        ["S_Vertical","S_Vertical","S_Vertical","S_Vertical","S_Bottom","E","E","E","E","E"],
        ["S_Vertical","S_Vertical","S_Bottom","S_Bottom","E","E","E","E","E","E"],
        ["S_Vertical","S_Bottom","E","E","E","E","E","E","E","E"],
        ["S_Bottom","E","E","E","E","E","E","E","E","E"],
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
        ["S_Vertical","M","E","E","E","E","E","E","E","E"],
        ["S_Vertical","E","E","E","E","E","E","E","E","E"],
        ["S_Vertical","E","E","E","E","E","E","E","E","E"],
        ["S_Bottom","E","E","E","E","E","E","E","E","E"],
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
