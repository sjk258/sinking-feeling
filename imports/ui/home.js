/* globals FlowRouter */
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Games } from '../api/games.js';
import * as Game from '../api/game.js';
import * as AI from '../api/ai.js';

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

Template.game_create_form.helpers({
  aiPlayers() {
    return AI.getPlayers("difficulty");
  },
  isOpponentAi() {
    return Session.get('isOpponentAI');
  },
  isOpponentFriend() {
    return Session.get('isOpponentFriend');
  },
  selectedAi() {
    return Session.get('selectedAI');
  }
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
});

Template.list_of_wait_games.helpers({
  games() {
    if (Meteor.userId() !== null)
    {
      return Games.find( { 'state': 'waiting' } );
    }
  }
});

Template.home.events({
  'click #createGame'() {
    const user = Meteor.user();
    if(!user) throw new Meteor.error('not-logged-in');

    let gotoGame = true;
    var game;

    if (Session.get('isOpponentAI'))
    {
      game = Game.create(user, null, $("#name-input").val());
      Game.initVsAi(game, Session.get('selectedAI').name);
    }
    else if (Session.get('isOpponentFriend'))
    {
      const oppUsername = $("#friend-input").val();

      const oppUser = Meteor.users.findOne( { 'username': oppUsername } );

      if (oppUser === null || oppUser === undefined)
      {
        console.log("User doesn't exist...");
        gotoGame = false;
      }
      else if (oppUser._id === user._id)
      {
        console.log("Can't play against yourself...");
        gotoGame = false;
      }
      else
      {
        game = Game.create(user, null, $("#name-input").val());
        Game.joinWaiting(game, oppUser);
      }
    }
    else  // Post to waiting room
    {
      game = Game.create(user, null, $("#name-input").val());
      Game.initToWaiting(game);
    }

    if (gotoGame)
    {
      FlowRouter.go('game', { id: game._id });
    }
  }
});

Template.home_game.events({
  'click .deleteGame'(event) {
    event.preventDefault();
    Games.remove(this._id);
  }
});

Template.game_create_form.events({
  'change #select-opp-div'() {
    const oppSelection = $("input[name='opp-radio']:checked").val();

    if (oppSelection === 'friend')
    {
      Session.set('isOpponentAI', false);
      Session.set('isOpponentFriend', true);
    }
    else if (oppSelection === 'waiting')
    {
      Session.set('isOpponentAI', false);
      Session.set('isOpponentFriend', false);
    }
    else
    {
      Session.set('isOpponentAI', true);
      Session.set('isOpponentFriend', false);
      Session.set('selectedAI', AI.getPlayer(oppSelection));
    }
  },
});

Template.list_of_wait_games.events({
  'click .joinGame'(event) {
    event.preventDefault();

    const game = Games.findOne( { '_id': this._id } );

    if (game.creator.id === Meteor.userId())
    {
      console.log("Cant join own game!");
    }
    else
    {
      Game.joinWaiting(game, Meteor.user());
      FlowRouter.go('game', { id: game._id });
    }
  }
});