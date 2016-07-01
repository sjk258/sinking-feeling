/* globals FlowRouter */
import { Template } from 'meteor/templating';

import { Games } from '../api/games.js';
import * as Game from '../api/game.js';

import './home.html';

Template.home.helpers({
  games() {
    return Games.find({});
  },
});

Template.home.events({
  'click #createGame'(event) {
    const game = Game.create('test');
    game.current_player = "creator";
    Games.update(game._id, {$set: game});
    FlowRouter.go('game', { id: game._id });
  }
});

Template.home_game.events({
  'click .deleteGame'(event) {
    event.preventDefault();
    Games.remove(this._id);
  }
});