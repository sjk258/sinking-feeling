import { Meteor } from 'meteor/meteor';

import { Games } from '../imports/api/games.js';

Meteor.startup(() => {
	// code to run on server at startup
	console.log("Starting up...");

	if (Games.find( { _id:'test' } ).count() === 1)
	{
		Games.remove( { _id:'test' } );
		console.log("Removed test game...");
	}

	Games.insert({
		  	_id: "test",
			owner_id: "test",
			state: "ACTIVE",
			time_created: new Date(),
			computer_id: "SUE",
			owner_board: [
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
			],
			opponent_board: [
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
				[ { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" }, { val: "E" } ],
			],
			time_started: new Date(),
			turn_number: 0,
			first_player: "owner",
			current_player: "owner",
			owner_ready: false,
			opponent_ready: false,
			game_log: [
				{ owner: "Sinking Feeling", text: "Welcome to the game!" },
			]
  		});

  	console.log("Completing startup...");
});
