import { Meteor } from 'meteor/meteor';
import { Games } from '../api/games.js';

import './game.html';

Template.game.events({
	'submit form'(event) {
		event.preventDefault();

		var game = Games.findOne({ _id: 'test' });

		var selection = event.target.elements.selection.value;
		var nextPlayer = '';

		console.log(game);

		if (game['current_player'] === "owner")
		{
			console.log("owner turn taken");
			selection = 'owner_board.' + selection;
			nextPlayer = 'opponent';
		}
		else
		{
			console.log("opponent turn taken");
			selection = 'opponent_board.' + selection;
			nextPlayer = 'owner';
		}

		var result = event.target.elements.result.value;

		var dynamicQuery = {};
		dynamicQuery[selection] = result;
		dynamicQuery['turn_number'] = game['turn_number'] + 1;
		dynamicQuery['current_player'] = nextPlayer;

		Games.update( { _id: 'test' }, { $set:dynamicQuery } );
	}
});