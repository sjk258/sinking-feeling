/* globals FlowRouter */
import { Template } from 'meteor/templating';
import { Games } from '../api/games.js';

import './waiting.html';

Template.waiting_room.helpers({
  games() {
    const user = Meteor.user();
    let query = { 'state': 'waiting' };
    if(user) {
      query['creator.id'] = { $ne: user._id };
    }
    return Games.find(query);
  },

  linkTo(game) {
    const params = { id: game._id };
    return FlowRouter.path('game', params);
  },
});
