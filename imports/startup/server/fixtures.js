import { Games } from '/imports/api/games.js';
import * as Game from '/imports/api/game.js';

Meteor.startup(() => {
  while (Games.find( { _id:'test' } ).count() === 1) {
    Games.remove( { _id:'test' } );
    console.log("Removed test game...");
  }

  const default_game = Game.create("test", "test");

  // A bit of extra stuff
  default_game.current_player = "creator";
  Games.update(default_game._id, {$set: default_game});
});