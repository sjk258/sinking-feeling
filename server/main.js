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
			owner_board: {
				row: [
					{ col: [ { pos: "A0", val: "E" }, { pos: "A1", val: "E" }, { pos: "A2", val: "E" }, { pos: "A3", val: "E" }, { pos: "A4", val: "E" }, { pos: "A5", val: "E" }, { pos: "A6", val: "E" }, { pos: "A7", val: "E" }, { pos: "A8", val: "E" }, { pos: "A9", val: "E" } ] }, 
					{ col: [ { pos: "B0", val: "E" }, { pos: "B1", val: "E" }, { pos: "B2", val: "E" }, { pos: "B3", val: "E" }, { pos: "B4", val: "E" }, { pos: "B5", val: "E" }, { pos: "B6", val: "E" }, { pos: "B7", val: "E" }, { pos: "B8", val: "E" }, { pos: "B9", val: "E" } ] }, 
					{ col: [ { pos: "C0", val: "E" }, { pos: "C1", val: "E" }, { pos: "C2", val: "E" }, { pos: "C3", val: "E" }, { pos: "C4", val: "E" }, { pos: "C5", val: "E" }, { pos: "C6", val: "E" }, { pos: "C7", val: "E" }, { pos: "C8", val: "E" }, { pos: "C9", val: "E" } ] }, 
					{ col: [ { pos: "D0", val: "E" }, { pos: "D1", val: "E" }, { pos: "D2", val: "E" }, { pos: "D3", val: "E" }, { pos: "D4", val: "E" }, { pos: "D5", val: "E" }, { pos: "D6", val: "E" }, { pos: "D7", val: "E" }, { pos: "D8", val: "E" }, { pos: "D9", val: "E" } ] }, 
					{ col: [ { pos: "E0", val: "E" }, { pos: "E1", val: "E" }, { pos: "E2", val: "E" }, { pos: "E3", val: "E" }, { pos: "E4", val: "E" }, { pos: "E5", val: "E" }, { pos: "E6", val: "E" }, { pos: "E7", val: "E" }, { pos: "E8", val: "E" }, { pos: "E9", val: "E" } ] }, 
					{ col: [ { pos: "F0", val: "E" }, { pos: "F1", val: "E" }, { pos: "F2", val: "E" }, { pos: "F3", val: "E" }, { pos: "F4", val: "E" }, { pos: "F5", val: "E" }, { pos: "F6", val: "E" }, { pos: "F7", val: "E" }, { pos: "F8", val: "E" }, { pos: "F9", val: "E" } ] }, 
					{ col: [ { pos: "G0", val: "E" }, { pos: "G1", val: "E" }, { pos: "G2", val: "E" }, { pos: "G3", val: "E" }, { pos: "G4", val: "E" }, { pos: "G5", val: "E" }, { pos: "G6", val: "E" }, { pos: "G7", val: "E" }, { pos: "G8", val: "E" }, { pos: "G9", val: "E" } ] }, 
					{ col: [ { pos: "H0", val: "E" }, { pos: "H1", val: "E" }, { pos: "H2", val: "E" }, { pos: "H3", val: "E" }, { pos: "H4", val: "E" }, { pos: "H5", val: "E" }, { pos: "H6", val: "E" }, { pos: "H7", val: "E" }, { pos: "H8", val: "E" }, { pos: "H9", val: "E" } ] }, 
					{ col: [ { pos: "I0", val: "E" }, { pos: "I1", val: "E" }, { pos: "I2", val: "E" }, { pos: "I3", val: "E" }, { pos: "I4", val: "E" }, { pos: "I5", val: "E" }, { pos: "I6", val: "E" }, { pos: "I7", val: "E" }, { pos: "I8", val: "E" }, { pos: "I9", val: "E" } ] }, 
					{ col: [ { pos: "J0", val: "E" }, { pos: "J1", val: "E" }, { pos: "J2", val: "E" }, { pos: "J3", val: "E" }, { pos: "J4", val: "E" }, { pos: "J5", val: "E" }, { pos: "J6", val: "E" }, { pos: "J7", val: "E" }, { pos: "J8", val: "E" }, { pos: "J9", val: "E" } ] }, 
				]
			},
			opponent_board: {
				row: [
					{ col: [ { pos: "A0", val: "E" }, { pos: "A1", val: "E" }, { pos: "A2", val: "E" }, { pos: "A3", val: "E" }, { pos: "A4", val: "E" }, { pos: "A5", val: "E" }, { pos: "A6", val: "E" }, { pos: "A7", val: "E" }, { pos: "A8", val: "E" }, { pos: "A9", val: "E" } ] }, 
					{ col: [ { pos: "B0", val: "E" }, { pos: "B1", val: "E" }, { pos: "B2", val: "E" }, { pos: "B3", val: "E" }, { pos: "B4", val: "E" }, { pos: "B5", val: "E" }, { pos: "B6", val: "E" }, { pos: "B7", val: "E" }, { pos: "B8", val: "E" }, { pos: "B9", val: "E" } ] }, 
					{ col: [ { pos: "C0", val: "E" }, { pos: "C1", val: "E" }, { pos: "C2", val: "E" }, { pos: "C3", val: "E" }, { pos: "C4", val: "E" }, { pos: "C5", val: "E" }, { pos: "C6", val: "E" }, { pos: "C7", val: "E" }, { pos: "C8", val: "E" }, { pos: "C9", val: "E" } ] }, 
					{ col: [ { pos: "D0", val: "E" }, { pos: "D1", val: "E" }, { pos: "D2", val: "E" }, { pos: "D3", val: "E" }, { pos: "D4", val: "E" }, { pos: "D5", val: "E" }, { pos: "D6", val: "E" }, { pos: "D7", val: "E" }, { pos: "D8", val: "E" }, { pos: "D9", val: "E" } ] }, 
					{ col: [ { pos: "E0", val: "E" }, { pos: "E1", val: "E" }, { pos: "E2", val: "E" }, { pos: "E3", val: "E" }, { pos: "E4", val: "E" }, { pos: "E5", val: "E" }, { pos: "E6", val: "E" }, { pos: "E7", val: "E" }, { pos: "E8", val: "E" }, { pos: "E9", val: "E" } ] }, 
					{ col: [ { pos: "F0", val: "E" }, { pos: "F1", val: "E" }, { pos: "F2", val: "E" }, { pos: "F3", val: "E" }, { pos: "F4", val: "E" }, { pos: "F5", val: "E" }, { pos: "F6", val: "E" }, { pos: "F7", val: "E" }, { pos: "F8", val: "E" }, { pos: "F9", val: "E" } ] }, 
					{ col: [ { pos: "G0", val: "E" }, { pos: "G1", val: "E" }, { pos: "G2", val: "E" }, { pos: "G3", val: "E" }, { pos: "G4", val: "E" }, { pos: "G5", val: "E" }, { pos: "G6", val: "E" }, { pos: "G7", val: "E" }, { pos: "G8", val: "E" }, { pos: "G9", val: "E" } ] }, 
					{ col: [ { pos: "H0", val: "E" }, { pos: "H1", val: "E" }, { pos: "H2", val: "E" }, { pos: "H3", val: "E" }, { pos: "H4", val: "E" }, { pos: "H5", val: "E" }, { pos: "H6", val: "E" }, { pos: "H7", val: "E" }, { pos: "H8", val: "E" }, { pos: "H9", val: "E" } ] }, 
					{ col: [ { pos: "I0", val: "E" }, { pos: "I1", val: "E" }, { pos: "I2", val: "E" }, { pos: "I3", val: "E" }, { pos: "I4", val: "E" }, { pos: "I5", val: "E" }, { pos: "I6", val: "E" }, { pos: "I7", val: "E" }, { pos: "I8", val: "E" }, { pos: "I9", val: "E" } ] }, 
					{ col: [ { pos: "J0", val: "E" }, { pos: "J1", val: "E" }, { pos: "J2", val: "E" }, { pos: "J3", val: "E" }, { pos: "J4", val: "E" }, { pos: "J5", val: "E" }, { pos: "J6", val: "E" }, { pos: "J7", val: "E" }, { pos: "J8", val: "E" }, { pos: "J9", val: "E" } ] },
				]
			},
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
