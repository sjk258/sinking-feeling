import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Games } from '../api/games.js';

import './game.js';
import './testGame.js';
import './body.html';

Template.body.helpers({
	games() {
		return Games.find({});
	},
	testGame() {
		return Games.find({});
	}
});