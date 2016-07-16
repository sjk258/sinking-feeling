/** Configuration for JSHint to recognize automatic globals: */
/* globals FlowRouter, moment */

import { Games } from '../api/games.js';
import * as Game from '../api/game.js';
import { $ } from 'meteor/jquery';

import './game.html';
import './game.less';
import './board.js';

function getGame() {
  const gameID = FlowRouter.getParam('id');
  return Games.findOne({_id: gameID});
}

function getPlayerOne(game) {
  const user = Meteor.user();
  const player = Game.getUserPlayer(game, user);
  return player || 'creator';
}

function canFire(game) {
  const user = Meteor.user();
  return Game.userCanFire(game, user);
}

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
});

Template.game_meta_data.helpers({
  ownName(game) {
    const player = getPlayerOne(game);
    return game[player].name;
  },
  opponentName(game) {
    const player = Game.oppositePlayer(getPlayerOne(game));
    return game[player].name;
  },
  turnName(game) {
    return game[game.current_player].name;
  }
});

Template.game_boards.helpers({
  ownPlayer() {
    const game = getGame();
    return getPlayerOne(game);
  },
  otherPlayer() {
    const game = getGame();
    return Game.oppositePlayer(getPlayerOne(game));
  },
});

Template.game_actions.events({
  'click .fireShot'(event) {
    event.preventDefault();

    const game = getGame();
    if(!canFire(game)) {
      throw new Meteor.Error('invalid-fire', 'User tried to shoot when not their turn');
    }

    const selection = $('#selection').val();

    if (selection.length === 2)
    {
      const row = parseInt(selection.slice(1, 2), 10);
      const col = convertToIndex(selection.slice(0, 1));

      console.log(game.current_player + " taking shot.\nAttempting to hit position: " + selection);

      // Get shot information (TODO: Check if shot is valid!)
      Game.fire(game, row, col);
      Game.checkState(game);
      Game.update(game);

      $('#selection').val("");
    }
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
});

Template.game_actions.helpers({
  canFire(game) {
    return canFire(game);
  },
  waiting(game) {
    return game.state === 'waiting';
  },
  canJoin(game) {
    const user = Meteor.user();
    return Game.userCanJoin(game, user);
  },
  ended(game) {
    return game.state === 'ended';
  },
});

Template.game_meta_foot.helpers({
  dateFormat(ts) {
    return moment(ts).format("dddd, MMMM M, YYYY [at] h:kk A [UTC]Z");
  },
  winner() {
    return this.game[this.game.winner].name;
  },
});

function convertToIndex(val) {
  return 'ABCDEFGHIJ'.indexOf(val);
}
