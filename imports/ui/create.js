/* globals FlowRouter */
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import * as AI from '../api/ai.js';
import * as Game from '../api/game.js';

import './create.html';

Template.create_game.onCreated(function() {
  Session.set('selectedAI', null);
  Session.set('isOpponentAI', false);
  Session.set('isOpponentFriend', false);
});

Template.create_game.helpers({
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

Template.create_game.events({
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
  },

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
