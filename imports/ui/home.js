/* globals FlowRouter */
import { Template } from 'meteor/templating';

import { $ } from 'meteor/jquery';

import { Games } from '../api/games.js';
import * as Game from '../api/game.js';

import './home.html';
import './home.less';

Template.home.onCreated(function bodyOnCreated() {
  //this.state = new ReactiveDict();
  
});

Template.home.helpers({
  games() {
    return Games.find({});
  },
});

Template.home_game.helpers({
  gameState(gameId) {
    const state = Games.findOne({_id: gameId}, {state: 1});

    switch(state.state)
    {
      case 'created':
        state.label_style = "label-primary";
        break;
      case 'waiting':
      case 'pending':
        state.label_style = "label-warning";
        break;
      case 'declined':
        state.label_style = "label-danger";
        break;
      case 'setup':
        state.label_style = "label-info";
        break;
      case 'active':
        state.label_style = "label-success";
        break;
      case 'ended':
        state.label_style = "label-default";
        break;
      default:
        state.label_style = "label-default";
        break;
    }
    
    return state;
  }
});

Template.home.events({
  'click #createGame'() {
    const user = Meteor.user();
    if(!user) throw Meteor.error('not-logged-in');

    const oppSelection = $("input[name='opp-radio']:checked").val();

    const game = Game.create(user, oppSelection);
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