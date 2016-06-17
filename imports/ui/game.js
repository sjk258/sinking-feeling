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

		var col = convertToIndex(selection.slice(0, 1));
		var row = selection.slice(1, 2);

		var searchParam = 'row.' + row + '.col.' + col + '.val';

		if (game['current_player'] === "owner")
		{
			console.log("owner turn taken");

			searchParam = 'owner_board.' + searchParam;
			nextPlayer = 'opponent';
		}
		else
		{
			console.log("opponent turn taken");
			searchParam = 'opponent_board.' + searchParam;
			nextPlayer = 'owner';
		}

		var result = event.target.elements.result.value;

		var dynamicQuery = {};
		dynamicQuery[searchParam] = result;
		dynamicQuery['turn_number'] = game['turn_number'] + 1;
		dynamicQuery['current_player'] = nextPlayer;

		console.log(dynamicQuery);

		Games.update( { _id: 'test' }, { $set: dynamicQuery } );
	}
});

function convertToIndex(val) {
	switch(val)
	{
		case 'A':
			return 0;
		case 'B':
			return 1;
		case 'C':
			return 2;
		case 'D':
			return 3;
		case 'E':
			return 4;
		case 'F':
			return 5;
		case 'G':
			return 6;
		case 'H':
			return 7;
		case 'I':
			return 8;
		case 'J':
			return 9;
		default:
			return -1;
	}
}