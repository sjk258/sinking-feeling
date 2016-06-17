import { Meteor } from 'meteor/meteor';

import { Games } from '../imports/api/games.js';

Meteor.startup(() => {
	// code to run on server at startup
	console.log("Starting up...");

	if (Games.find().count() === 0)
	{
		Games.insert({
		  	_id: "test",
			owner_id: "test",
			state: "ACTIVE",
			time_created: new Date(),
			computer_id: "SUE",
			owner_board: {
				A0: "E", B0: "E", C0: "E", D0: "E", E0: "E", F0: "E", G0: "E", H0: "E", I0: "E", J0: "E", 
				A1: "E", B1: "E", C1: "E", D1: "E", E1: "E", F1: "E", G1: "E", H1: "E", I1: "E", J1: "E", 
				A2: "E", B2: "E", C2: "E", D2: "E", E2: "E", F2: "E", G2: "E", H2: "E", I2: "E", J2: "E", 
				A3: "E", B3: "E", C3: "E", D3: "E", E3: "E", F3: "E", G3: "E", H3: "E", I3: "E", J3: "E", 
				A4: "E", B4: "E", C4: "E", D4: "E", E4: "E", F4: "E", G4: "E", H4: "E", I4: "E", J4: "E", 
				A5: "E", B5: "E", C5: "E", D5: "E", E5: "E", F5: "E", G5: "E", H5: "E", I5: "E", J5: "E", 
				A6: "E", B6: "E", C6: "E", D6: "E", E6: "E", F6: "E", G6: "E", H6: "E", I6: "E", J6: "E", 
				A7: "E", B7: "E", C7: "E", D7: "E", E7: "E", F7: "E", G7: "E", H7: "E", I7: "E", J7: "E", 
				A8: "E", B8: "E", C8: "E", D8: "E", E8: "E", F8: "E", G8: "E", H8: "E", I8: "E", J8: "E", 
				A9: "E", B9: "E", C9: "E", D9: "E", E9: "E", F9: "E", G9: "E", H9: "E", I9: "E", J9: "E"
			},
			opponent_board: {
				A0: "E", B0: "E", C0: "E", D0: "E", E0: "E", F0: "E", G0: "E", H0: "E", I0: "E", J0: "E", 
				A1: "E", B1: "E", C1: "E", D1: "E", E1: "E", F1: "E", G1: "E", H1: "E", I1: "E", J1: "E", 
				A2: "E", B2: "E", C2: "E", D2: "E", E2: "E", F2: "E", G2: "E", H2: "E", I2: "E", J2: "E", 
				A3: "E", B3: "E", C3: "E", D3: "E", E3: "E", F3: "E", G3: "E", H3: "E", I3: "E", J3: "E", 
				A4: "E", B4: "E", C4: "E", D4: "E", E4: "E", F4: "E", G4: "E", H4: "E", I4: "E", J4: "E", 
				A5: "E", B5: "E", C5: "E", D5: "E", E5: "E", F5: "E", G5: "E", H5: "E", I5: "E", J5: "E", 
				A6: "E", B6: "E", C6: "E", D6: "E", E6: "E", F6: "E", G6: "E", H6: "E", I6: "E", J6: "E", 
				A7: "E", B7: "E", C7: "E", D7: "E", E7: "E", F7: "E", G7: "E", H7: "E", I7: "E", J7: "E", 
				A8: "E", B8: "E", C8: "E", D8: "E", E8: "E", F8: "E", G8: "E", H8: "E", I8: "E", J8: "E", 
				A9: "E", B9: "E", C9: "E", D9: "E", E9: "E", F9: "E", G9: "E", H9: "E", I9: "E", J9: "E"
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
	}
  	console.log("Completing startup...");
});
