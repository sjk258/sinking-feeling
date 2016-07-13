/** Configuration for JSHint to recognize automatic globals: */
/* globals FlowRouter */

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

Template.game.helpers({
  invalid() {
    return !getGame();
  },
  game() {
    return getGame();
  },
  ownBoard() {
    const game = getGame();
    return Game.getOwnBoard(game, game.current_player);
  },
  attackBoard() {
    const game = getGame();
    return Game.getAttackBoard(game, game.current_player);
  }
});

Template.game.events({
  'submit form'(event) {
    event.preventDefault();

    const game = getGame();
    const selection = event.target.elements.selection.value;

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
  }
});

function convertToIndex(val) {
  return 'ABCDEFGHIJ'.indexOf(val);
}
