import { Template } from 'meteor/templating';
import { Games } from '/imports/api/games.js';
import * as Game from '/imports/api/game.js';

import './home.html';
import './home.less';

Template.home.onCreated(function() {
  Session.set('selectedAI', null);
  Session.set('isOpponentAI', false);
  Session.set('isOpponentFriend', false);
});

Template.home.helpers({
  games() {
    if (Meteor.userId() !== null)
    {
      return Games.find( { $or: [ {'creator.id': Meteor.userId()}, {'challenger.id': Meteor.userId() } ] } );
    }
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
  },

  title(game) {
    return Game.getTitle(game);
  },
});

Template.home_game.events({
  'click .deleteGame'(event) {
    event.preventDefault();
    Games.remove(this._id);
  }
});
