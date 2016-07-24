import { Template } from 'meteor/templating';
import { Games } from '/imports/api/games.js';
import * as Game from '/imports/api/game.js';

import './dashboard.html';
import './dashboard.less';
import './listing.js';

Template.dashboard.helpers({
  games() {
    if (Meteor.userId() !== null) {
      return Games.find({
        $or: [
          {
            'creator.id': Meteor.userId(),
            'creator.remove': { $exists: false },
          },
          {
            'challenger.id': Meteor.userId(),
            'challenger.remove': { $exists: false },
          },
        ]
      });
    } else {
      return [];
    }
  },
  title(game) {
    return Game.getTitle(game);
  },
  players(game) {
    const player = Game.getUserPlayer(game, Meteor.user());
    switch(game.state) {
      case 'created':
        return "Created by " + game.creator.name;
      case 'waiting':
        return "Waiting on player to join";
      case 'pending':
        if(player === 'creator') {
          return "You are waiting on " + game.challenger.name;
        } else {
          return game.creator.name + " is waiting on you";
        }
      case 'declined':
        if(player === 'creator') {
          return game.challenger.name + " declined your invitation";
        } else {
          return "You declined " + game.creator.name + "'s invitation";
        }
      case 'setup':
      case 'active':
      case 'ended':
      default:
        return game.creator.name + " vs. " + game.challenger.name;
    }
  },
});
