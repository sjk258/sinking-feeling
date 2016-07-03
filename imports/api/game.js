import * as Board from './board.js';
import * as AI from './ai.js';
import {Games} from './games.js';
import {_} from 'meteor/underscore';

// only exported for testing, don't call this
export function spacesAreSame(space1, space2){
  if((space1.row == space2.row) && (space1.col == space2.col))
  {
    return true;
  }
  return false;
}

// only exported for testing, don't call this
export function spaceIsOnShip(space, ships){
  for(var ship in ships)
  {
    for(let i = 0; i < Board.ship_lengths[ship]; i++) {
      var ship_space = { row: ships[ship].row, col: ships[ship].col };
      if(ships[ship].vertical){
        ship_space.row += i;
      }
      else{
        ship_space.col += i;
      }
      if(spacesAreSame(space, ship_space))
      {
        return true;
      }
    }
  }
  return false;
}

export function overlap(ship, row, col, vertical, ships) {
  for(let i = 0; i < Board.ship_lengths[ship]; i++) {
    var ship_space = { row: row, col: col };
    if(vertical){
      ship_space.row += i;
    }
    else{
      ship_space.col += i;
    }
    if(spaceIsOnShip(ship_space, ships))
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
  if(Board.ship_types.indexOf(ship_type) < 0) {
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
  Board.ship_types.forEach(type => {
    const possibs = _.shuffle(makePossibilities(Board.ship_lengths[type]));
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

export function create(creator, id=null){
  var game = {
    created_at: new Date(),
    turn_number: 0,
    creator_ready: false,
    challenger_ready: false,
    creator: {user: creator, ships: initShips(), shots: []},
    challenger: {ships: initShips(), shots: []},
    computer_id: 'sue',
    // TODO: active immediately starts the game. the initial state should
    // change as we implement more features. The time_started date also should
    // be set wherever we first change state to active.
    state: 'active',
    time_started: new Date(),
  };

  randomizeShips(game.creator.ships);
  randomizeShips(game.challenger.ships);

  if(id){
    game._id = id;
  }

  game._id = Games.insert(game);
  return game;
}

export function update(game) {
  Games.update( {_id: game['_id']}, game);
}

export function computer_shot(game) {
  const ai = AI.getPlayer(game.computer_id);
  let state = {};
  if ('computer_state' in game) state = game.computer_state;
  const board = getAttackBoard(game, 'challenger');
  const shot = ai.makeMove(board, state);
  game['challenger'].shots.push(shot);
}

export function player_shot(game, player, row, col) {
  if (typeof game[player] == 'undefined')
  {
    game[player] = {};
  }

  if (typeof game[player].shots == 'undefined')
  {
    game[player].shots = [];
  }

  var shot = {row: row, col: col};
  game[player].shots.push(shot);
}

export function fire(game, row, col) {
  let player = game.current_player;
  player_shot(game, player, row, col);

  if ('computer_id' in game) {
    computer_shot(game);
    game.turn_number += 2;
  } else {
    game.current_player = oppositeUser(player);
    game.turn_number += 1;
  }
}

// only exported for testing, don't call this
export function addOwnShips(board, ships, mark) {
  for(let j = 0; j < Board.ship_types.length; j++) {
    const ship = Board.ship_types[j];
    if(!(ship in ships)) continue;
    let row = ships[ship].row;
    let col = ships[ship].col;
    for(let i = 0; i < Board.ship_lengths[ship]; i++)
    {
      board[row][col].shipNum = j;

      if(ships[ship].vertical)
      {
        if(mark && i === 0)
        {
          // Ship at top
          board[row][col].val = 'S_Top';
        }
        else if(mark && i === (Board.ship_lengths[ship] - 1))
        {
          // Ship at bottom
          board[row][col].val = 'S_Bottom';
        }
        else if(mark)
        {
          // Mid-piece of vertical ship
          board[row][col].val = 'S_Vertical';
        }

        row++;
      }
      else
      {
        if(mark && i === 0)
        {
          // Ship at top
          board[row][col].val = 'S_Left';
        }
        else if(mark && i === (Board.ship_lengths[ship] - 1))
        {
          // Ship at bottom
          board[row][col].val = 'S_Right';
        }
        else if(mark)
        {
          // Mid-piece of vertical ship
          board[row][col].val = 'S_Horizontal';
        }

        col++;
      }
    }
  }
}

// only exported for testing, don't call this
export function addShots(board, shots, ships) {
  shots.forEach(function(shot){
    if(spaceIsOnShip(shot, ships))
    {
      board[shot.row][shot.col].val = 'H';
    }
    else
    {
      board[shot.row][shot.col].val = 'M';
    }
  });
}

// only exported for testing, don't call this
export function oppositeUser(user){
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

export function getOwnBoard(game, user){
  var board = Board.makeEmptyBoard();
  addOwnShips(board, game[user].ships, true);
  addShots(board, game[oppositeUser(user)].shots, game[user].ships);
  return board;
}

export function getAttackBoard(game, user){
  var board = Board.makeEmptyBoard();
  addOwnShips(board, game[oppositeUser(user)].ships, false);
  addShots(board, game[user].shots, game[oppositeUser(user)].ships);
  return board;
}