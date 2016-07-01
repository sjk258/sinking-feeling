/** Configuration for JSHint to recognize automatic globals: */
/* globals FlowRouter */

import { Games } from '../api/games.js';
import { getOwnBoard, getAttackBoard } from '../api/game.js';
import { $ } from 'meteor/jquery';

import './game.html';
import './game.css';

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
    return getOwnBoard(game, game.current_player);
  },
  attackBoard() {
    const game = getGame();
    return getAttackBoard(game, game.current_player);
  }
});

Template.game.events({
  'submit form'(event) {
    event.preventDefault();

    const game = getGame();

    var selection = event.target.elements.selection.value;
    var nextPlayer = '';

    var col = convertToIndex(selection.slice(0, 1));
    var row = selection.slice(1, 2);

    var searchParam = row + '.' + col + '.val';

    if (game.current_player === "creator")
    {
      console.log("owner turn taken");

      searchParam = 'owner_board.' + searchParam;
      nextPlayer = 'challenger';
    }
    else
    {
      console.log("opponent turn taken");
      searchParam = 'opponent_board.' + searchParam;
      nextPlayer = 'creator';
    }

    var result = event.target.elements.result.value;

    var dynamicQuery = {};
    dynamicQuery[searchParam] = result;
    dynamicQuery.turn_number = game.turn_number + 1;
    dynamicQuery.current_player = nextPlayer;

    console.log(dynamicQuery);

    Games.update( { _id: 'test' }, { $set: dynamicQuery } );
  }
});

Template.board_cell.helpers({
  className() {
    switch (this.ship.val) {
      case 'H': return 'hit';
      case 'M': return 'miss';
      case 'S': return 'ship';
      case 'X': return 'sunk';
      case 'E': return 'empty';
      default: return '';
    }
  },
  symbol() {
    switch (this.ship.val) {
      case 'E': return '\u00B7';
      case 'M': return '~';
      case 'S': return this.ship.shipNum;
      case 'X': return this.ship.shipNum;
      default: return this.ship.val;
    }
  },
  cell() {
    const row = 'ABCDEFGHIJ'[this.row];
    return row + this.col;
  },
  selected() {
    return false;
  },
});

Template.board_cell.events({
  "click .cell"(event) {
    const target = event.currentTarget;
    $('#selection').val(target.dataset.cell);
  }
});

function convertToIndex(val) {
  return 'ABCDEFGHIJ'.indexOf(val);
}
