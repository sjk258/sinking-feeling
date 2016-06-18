import { Meteor } from 'meteor/meteor';

import { Games } from '../imports/api/games.js';
import { makeEmptyBoard, placeShip } from '../imports/api/board.js';


Meteor.startup(() => {
  // code to run on server at startup
  console.log("Starting up...");

  if (Games.find( { _id:'test' } ).count() === 1)
  {
    Games.remove( { _id:'test' } );
    console.log("Removed test game...");
  }

  default_game = {
    _id: "test",
    owner_id: "test",
    state: "ACTIVE",
    time_created: new Date(),
    computer_id: "SUE",
    owner_board: makeEmptyBoard(),
    opponent_board: makeEmptyBoard(),
    time_started: new Date(),
    turn_number: 0,
    first_player: "owner",
    current_player: "owner",
    owner_ready: false,
    opponent_ready: false,
    game_log: [
      { owner: "Sinking Feeling", text: "Welcome to the game!" },
    ]
  };

  placeShip("carrier", 0, 0, true, default_game);
  placeShip("battleship", 0, 1, true, default_game);
  placeShip("cruiser", 0, 2, true, default_game);
  placeShip("submarine", 0, 3, true, default_game);
  placeShip("destroyer", 0, 4, true, default_game);
        
  Games.insert(default_game);
        
  console.log("Completing startup...");
});
