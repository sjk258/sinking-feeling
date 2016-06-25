import { Meteor } from 'meteor/meteor';

import { Games } from '../imports/api/games.js';
import * as Game from '../imports/api/game.js';
import { makeEmptyBoard, placeShip } from '../imports/api/board.js';


Meteor.startup(() => {
  // code to run on server at startup
  console.log("Starting up...");

  while (Games.find( { _id:'test' } ).count() === 1)
  {
    Games.remove( { _id:'test' } );
    console.log("Removed test game...");
  }

  default_game = Game.create("test", "test");

  // A bit of extra stuff
  default_game.current_player = "creator";
  default_game.creator.shots = [{row: 0, col: 0}, {row: 5, col: 5}];

  Game.placeShip("carrier", 0, 0, true, default_game.creator.ships);
  Game.placeShip("battleship", 0, 1, true, default_game.creator.ships);
  Game.placeShip("cruiser", 0, 2, true, default_game.creator.ships);
  Game.placeShip("submarine", 0, 3, true, default_game.creator.ships);
  Game.placeShip("destroyer", 0, 4, true, default_game.creator.ships);

  Game.placeShip("carrier", 0, 0, true, default_game.challenger.ships);
  Game.placeShip("battleship", 0, 1, true, default_game.challenger.ships);
  Game.placeShip("cruiser", 0, 2, true, default_game.challenger.ships);
  Game.placeShip("submarine", 0, 3, true, default_game.challenger.ships);
  Game.placeShip("destroyer", 0, 4, true, default_game.challenger.ships);

  Games.update(default_game._id, {$set: default_game});

  console.log("Completing startup...");
});
