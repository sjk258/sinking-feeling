import * as AI from './ai.js';
import * as Board from './board.js';
import * as Ship from './ship.js';
import {Games} from './games.js';
import {_} from 'meteor/underscore';

export function overlap(ship, row, col, vertical, ships) {
  for(let i = 0; i < Ship.lengths[ship]; i++) {
    var ship_space = { row: row, col: col };
    if(vertical){
      ship_space.row += i;
    }
    else{
      ship_space.col += i;
    }
    if(Board.spaceIsOnShip(ship_space, ships))
    {
      return true;
    }
  }
  return false;
}

export function checkOverlap(ship_type, row, col, vertical, positions) {
  if (typeof positions[ship_type] != 'undefined'){
    // This is moving a ship, we don't want to include the pre-move ship in the
    // overlap test. This makes a copy that we can remove it from.
    positions = JSON.parse(JSON.stringify(positions));
    delete positions[ship_type];
  }
  if(overlap(ship_type, row, col, vertical, positions)){
    throw 'Ships Overlapping';
  }
}

export function placeShip(ship_type, row, col, vertical, positions) {
  checkOverlap(ship_type, row, col, vertical, positions);

  if (typeof positions[ship_type] == 'undefined') {
    positions[ship_type] = {};
  }
  if(Ship.types.indexOf(ship_type) < 0) {
    throw 'Unrecognised ship type';
  }

  positions[ship_type].row = row;
  positions[ship_type].col = col;
  positions[ship_type].vertical = vertical;
}

export function randomizeShips(ships) {
  const makePossibilities = function (length) {
    let i, j;
    const result = [];
    for (i = 0; i < 10; i++) {
      for (j = 0; j < 10 - length; j++) {
        result.push([i, j, false]);
        result.push([j, i, true]);
      }
    }
    return result;
  };
  Ship.types.forEach(type => {
    const possibs = _.shuffle(makePossibilities(Ship.lengths[type]));
    _.some(possibs, possib => {
      try {
        placeShip(type, possib[0], possib[1], possib[2], ships);
        return true;
      } catch(e) {
        return false;
      }
    });
  });
}

export function initShips() {
  const ships = {};
  placeShip("carrier", 0, 0, true, ships);
  placeShip("battleship", 0, 1, true, ships);
  placeShip("cruiser", 0, 2, true, ships);
  placeShip("submarine", 0, 3, true, ships);
  placeShip("destroyer", 0, 4, true, ships);
  return ships;
}

export function create(user, first_player='creator') {
  var game = {
    created_at: new Date(),
    creator: {
      id: user._id,
      name: user.username,
      ships: initShips(),
      ready: false,
    },
    challenger: {
      ships: initShips(),
      ready: false,
    },
    first_player: first_player,
    state: 'created',
  };

  randomizeShips(game.creator.ships);
  randomizeShips(game.challenger.ships);

  game._id = Games.insert(game);
  return game;
}

export function initVsAi(game, ai) {
  game.challenger.ai = ai;
  game.challenger.name = AI.getPlayer(ai).full_name;
  game.challenger.ready = true;
  game.state = 'setup';

  // TODO: This changes setup to active and should go away when we implement
  // ship placement in the UI.
  game.creator.ready = true;
  checkState(game);

  update(game);
  return game;
}

/* The following functions are intended to handle state changes and associated
 * changes in game data. */

export function checkStateCreated(game) {
  // Fool JShint into thinking we're using the parameter.
  game = game;
}

export function checkStateWaiting(game) {
  // Fool JShint into thinking we're using the parameter.
  game = game;
}

export function checkStatePending(game) {
  // Fool JShint into thinking we're using the parameter.
  game = game;
}

export function checkStateDeclined(game) {
  // Fool JShint into thinking we're using the parameter.
  game = game;
}

export function checkStateSetup(game) {
  if(!game.creator.ready) return;
  if(!game.challenger.ready) return;

  delete game.creator.ready;
  game.creator.shots = [];

  delete game.challenger.ready;
  game.challenger.shots = [];

  game.state = 'active';

  if(!('first_player' in game)) {
    game.first_player = 'creator';
  }
  game.current_player = game.first_player;

  game.turn_number = 0;
  game.time_started = new Date();
}

export function checkStateActive(game) {
  const creator = getAttackBoard(game, 'creator').sunk;
  const challenger = getAttackBoard(game, 'challenger').sunk;

  let winner = false;
  if(creator.length == 5) {
    winner = 'creator';
  } else if(challenger.length == 5) {
    winner = 'challenger';
  }

  if(!winner) return;

  game.state = 'ended';
  game.winner = winner;
  game.time_finished = new Date();

  delete game.current_player;
}

export function checkStateEnded(game) {
  // Fool JShint into thinking we're using the parameter.
  game = game;
}

export function checkState(game) {
  const states = {
    // created = Game has been created but not fully initialized yet. Should go
    // to waiting, pending, declined, or setup next.
    created: checkStateCreated,

    // waiting - Game listed in the waiting room. Waiting for another player to
    // join. Should go to setup next.
    waiting: checkStateWaiting,

    // pending - Creator has invited someone and is waiting for them to accept
    // or decline (i.e., the invite is pending). Should go to declined or setup
    // next.
    pending: checkStatePending,

    // declined - Creator invited someone but they declined. This is a terminal
    // state.
    declined: checkStateDeclined,

    // setup - Game is in setup phase, which means players can move their ships
    // around. Should go to active next.
    setup: checkStateSetup,

    // active - The game is on! Players may fire at one another. Should go to
    // ended next.
    active: checkStateActive,

    // ended - The game has concluded, either because a player sunk all ships
    // or because a player forfeit. This is a terminal state.
    ended: checkStateEnded,
  };

  if(game.state in states) {
    states[game.state](game);
  } else {
    throw Meteor.Error('invalid-state', 'The game has an invalid state');
  }
}

export function update(game) {
  Games.update( {_id: game._id}, game);
}

export function saveShot(shot, shots) {
  shot.time = new Date();
  shots.push(shot);
}

export function computerShot(game) {
  const ai = AI.getPlayer(game.challenger.ai);
  let state = {};
  if ('computer_state' in game) state = game.computer_state;
  const board = getAttackBoard(game, 'challenger');
  const shot = ai.makeMove(board, state);
  saveShot(shot, game.challenger.shots);
  game.computer_state = state;
}

export function checkShotUnique(shot, previous_shots)
{
  for(let i = 0; i < previous_shots.length; i++)
  {
    if((shot.row == previous_shots[i].row) &&
      (shot.col == previous_shots[i].col))
    {
      return false;
    }
  }
  return true;
}

export function playerShot(game, player, row, col) {
  if (typeof game[player] == 'undefined')
  {
    game[player] = {};
  }

  if (typeof game[player].shots == 'undefined')
  {
    game[player].shots = [];
  }

  var shot = {row: row, col: col};
  if(!checkShotUnique(shot, game[player].shots))
  {
    throw "Shot Exists";
  }

  saveShot(shot, game[player].shots);
}

export function fire(game, row, col) {
  let player = game.current_player;
  playerShot(game, player, row, col);

  if ('ai' in game.challenger) {
    computerShot(game);
    game.turn_number += 2;
  } else {
    game.current_player = oppositePlayer(player);
    game.turn_number += 1;
  }
}


// only exported for testing, don't call this
export function oppositePlayer(user){
  var opposite_user = "";
  if(user == "creator")
  {
    opposite_user = "challenger";
  }
  else
  {
    opposite_user = "creator";
  }
  return opposite_user;
}

export function getOwnBoard(game, user) {
  const board = Board.makeEmptyBoard();
  Board.addShips(board, game[user].ships, true);
  Board.addShots(board, game[oppositePlayer(user)].shots, game[user].ships);
  const sunk = Board.checkSunk(board, game[user].ships);
  return {squares: board, sunk: sunk};
}

export function getAttackBoard(game, user) {
  const board = Board.makeEmptyBoard();
  Board.addShips(board, game[oppositePlayer(user)].ships, false);
  Board.addShots(board, game[user].shots, game[oppositePlayer(user)].ships);
  const sunk = Board.checkSunk(board, game[oppositePlayer(user)].ships);
  return {squares: board, sunk: sunk};
}

export function getUserPlayer(game, user) {
  if(!user) return false;
  if(user._id === game.creator.id) return 'creator';
  if(user._id === game.challenger.id) return 'challenger';
  return false;
}

export function userIsPlayer(game, user) {
  if(!user) return false;
  if(user._id === game.creator.id) return true;
  if(user._id === game.challenger.id) return true;
  return false;
}

export function userCanFire(game, user) {
  if(!user) return false;
  if(game.state !== 'active') return false;
  if(!userIsPlayer(game, user)) return false;
  const player = getUserPlayer(game, user);
  return game.current_player === player;
}