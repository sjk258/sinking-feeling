/** Configuration for JSHint to recognize automatic globals: */
/* globals FlowRouter, moment */

import { _ } from 'meteor/underscore';

import { Games } from '/imports/api/games.js';
import * as Game from '/imports/api/game.js';
import * as Log from '/imports/api/log.js';
import * as Ship from '/imports/api/ship.js';
import * as Square from '/imports/api/square.js';

import './game.html';
import './game.less';
import './board.js';
import './http404.js';

function getGame() {
  const gameID = FlowRouter.getParam('id');
  return Games.findOne({_id: gameID});
}

function getAction() {
  return FlowRouter.getQueryParam('action');
}

function getPlayerOne(game) {
  const user = Meteor.user();
  const player = Game.getUserPlayer(game, user);
  return player || 'challenger';
}

function canFire(game) {
  const user = Meteor.user();
  return Game.userCanFire(game, user);
}

Template.game.onCreated(function() {
  Session.set('move', null);
});

Template.game.helpers({
  invalid() {
    return !getGame();
  },
  game() {
    return getGame();
  },
  showBothBoards(game) {
    if(game.state === 'active') return true;
    if(game.state === 'ended') return true;
    return false;
  },
  ownBoard() {
    const game = getGame();
    return Game.getOwnBoard(game, getPlayerOne(game));
  },
  attackBoard() {
    const game = getGame();
    return Game.getAttackBoard(game, getPlayerOne(game));
  },
  title(game) {
    return Game.getTitle(game);
  },
  players(game) {
    let names = game.creator.name + " vs. " + game.challenger.name;
    if('ai' in game.challenger) {
      names += ' (AI)';
    }
    return names;
  },
  turn(game) {
    if(game.state === "active") {
      return "Move " + (game.turn_number + 1) + ": " +
        game[game.current_player].name + "'s turn.";
    }
    if(game.state === "setup") {
      if(game.creator.ready) {
        return "Waiting for " + game.challenger.name + " to finish setup.";
      } else if(game.challenger.ready) {
        return "Waiting for " + game.creator.name + " to finish setup.";
      } else {
        return "Waiting for players to finish setup.";
      }
    }
    return false;
  },
});

Template.game_confirmations.helpers({
  actionRemove() {
    return getAction() === 'remove';
  },
  actionRemoveWillDelete(game) {
    const player = Game.getUserPlayer(game, Meteor.user());
    return Game.opponentRemoved(game, player);
  },
  actionRemoveWillResign(game) {
    return game.state === 'active' || game.state === 'setup';
  },
  actionResign() {
    return getAction() === 'resign';
  },
  urlSelf() {
    const id = FlowRouter.getParam('id');
    return FlowRouter.path('game', {id});
  },
});

Template.game_confirmations.events({
  'click .removeGame'() {
    const game = getGame();
    const user = Meteor.user();
    const player = Game.getUserPlayer(game, user);
    Game.remove(game, player);
    FlowRouter.go('dashboard');
  },
  'click .resignGame'() {
    const game = getGame();
    const user = Meteor.user();
    const player = Game.getUserPlayer(game, user);
    Game.resign(game, player);
    FlowRouter.go('game', {id: game._id});
  },
});

Template.game_both_boards.helpers({
  ownPlayer(game) {
    return getPlayerOne(game);
  },
  otherPlayer(game) {
    return Game.oppositePlayer(getPlayerOne(game));
  },
});

Template.game_board.helpers({
  playerName(game, player) {
    return game[player].name;
  },
});

Template.sunk_ships.helpers({
  getUnsunk(sunk) {
    return _.difference(Ship.types, sunk);
  },
  getLengths(types) {
    const lens = _.map(types, (type) => ({
      type, len: Ship.lengths[type]
    }));
    lens.sort((a,b) => (a.len - b.len));
    return lens;
  },
});

Template.game_log.helpers({
  log(game) {
    return Log.getLog(game);
  },
  timestamp(entry) {
    return entry.time;
  },
  format(game, entry) {
    if(entry.event === 'created') {
      return "Get ready for that Sinking Feeling!";
    }
    if(entry.event === 'started') {
      return "Game setup is complete and the game begins.";
    }
    if(entry.event === 'ended') {
      return "Game over!";
    }
    if(entry.event !== 'shot') {
      //return JSON.stringify(entry);
      return false;
    }
    let result = (entry.turn + 1) + '. ';
    result += game[entry.initiator].name + ": ";
    result += Square.squareObjToName(entry.shot) + ", ";
    result += entry.result;
    if(entry.result === 'sunk') {
      const opponent = Game.oppositePlayer(entry.initiator);
      const ship = Square.spaceShip(entry.shot, game[opponent].ships);
      result += " " + ship;
    }
    return result;
  },
});

Template.game_actions.events({
  'click .fireShot'(event) {
    event.preventDefault();

    const game = getGame();
    if(!canFire(game)) {
      throw new Meteor.Error('invalid-fire', 'User tried to shoot when not their turn');
    }

    const move = Session.get('move');
    if(!move) return;

    // Get shot information (TODO: Check if shot is valid!)
    Game.fire(game, move.row, move.col);
    Game.checkState(game);
    Game.update(game);

    Session.set('move', null);
  },
  'click .joinGame'(event) {
    event.preventDefault();

    const game = getGame();
    const user = Meteor.user();
    if(!Game.userCanJoin(game, user)) {
      throw new Meteor.Error('invalid-join', 'User cannot join game');
    }

    Game.joinWaiting(game, user);
  },
  'click .acceptInvite'(event) {
    event.preventDefault();
    const game = getGame();
    const user = Meteor.user();
    if(user._id === game.challenger.id) {
      Game.respondToPending(game, true);
    } else {
      throw new Meteor.Error('not-your-game');
    }
  },
  'click .declineInvite'(event) {
    event.preventDefault();
    const game = getGame();
    const user = Meteor.user();
    if(user._id === game.challenger.id) {
      Game.respondToPending(game, false);
    } else {
      throw new Meteor.Error('not-your-game');
    }
  },
});

Template.game_actions.helpers({
  canFire(game) {
    return canFire(game);
  },
  canResign(game) {
    return game.state === 'active' && getAction() !== 'resign';
  },
  waiting(game) {
    return game.state === 'waiting';
  },
  pending(game) {
    return game.state === 'pending';
  },
  canJoin(game) {
    const user = Meteor.user();
    return Game.userCanJoin(game, user);
  },
  amInviter(game) {
    const user = Meteor.user();
    if(!user) return false;
    return game.creator.id === user._id;
  },
  amInvitee(game) {
    const user = Meteor.user();
    if(!user) return false;
    return game.challenger.id === user._id;
  },
  notMyGame(game) {
    const user = Meteor.user();
    if(!user) return true;
    if(game.creator.id === user._id) return false;
    if(game.challenger.id === user._id) return false;
    return true;
  },
  ended(game) {
    return game.state === 'ended';
  },
  move() {
    const move = Session.get('move');
    if(!move) return "";
    return Square.squareObjToName(move);
  },
  fireDisabled() {
    const move = Session.get('move');
    return move ? "" : "disabled";
  },
  urlResign(game) {
    return FlowRouter.path('game', {id: game._id}, {action: 'resign'});
  },
});

Template.game_meta_foot.helpers({
  dateFormat(ts) {
    return moment(ts).format("dddd, MMMM M, YYYY [at] h:kk A [UTC]Z");
  },
  winner(game) {
    return game[game.winner].name;
  },
  resignedPlayer(game) {
    return game[game.resignation].name;
  }
});
