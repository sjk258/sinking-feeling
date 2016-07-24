/* globals FlowRouter */

import { Template } from 'meteor/templating';
import { Games } from '/imports/api/games.js';

import './listing.html';
import './listing.less';

Template.listing.helpers({
  stateStyle(state) {
    switch(state.state) {
      case 'created':
        return "label-primary";
      case 'waiting':
      case 'pending':
        return "label-warning";
      case 'declined':
        return "label-danger";
      case 'setup':
        return "label-info";
      case 'active':
        return "label-success";
      case 'ended':
        return "label-default";
      default:
        return "label-default";
    }
  },
  gameUrl(id) {
    return FlowRouter.path('game', {id});
  },
});

Template.dashboard_game.events({
  'click .deleteGame'(event) {
    event.preventDefault();
    Games.remove(this._id);
  }
});
