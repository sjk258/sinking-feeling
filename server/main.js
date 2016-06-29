import { Meteor } from 'meteor/meteor';

import { Games } from '../imports/api/games.js';
import * as Game from '../imports/api/game.js';

Meteor.startup(() => {
  // code to run on server at startup
  console.log("Starting up...");

  if (Games.find( { _id:'test' } ).count() === 1)
  {
    Games.remove( { _id:'test' } );
    console.log("Removed test game...");
  }

  const default_game = {
    _id: "test",
    owner_id: "test",
    state: "ACTIVE",
    time_created: new Date(),
    computer_id: "SUE",
    time_started: new Date(),
    turn_number: 0,
    first_player: "creator",
    current_player: "creator",
    owner_ready: false,
    opponent_ready: false,
    game_log: [
      { owner: "Sinking Feeling", text: "Welcome to the game!" },
    ],
    // I pre-loaded a couple shots just to show the display
    creator: { user_id: "test", ships: {}, shots: [{row: 0, col: 0}, {row: 5, col: 5}] },
    challenger: { user_id: null, ships: {}, shots: [] }
  };

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
  
  Games.insert(default_game);
        
  console.log("Completing startup...");
});
