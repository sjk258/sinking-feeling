/** Configuration for JSHint to recognize automatic globals: */
/* globals FlowRouter */

import { Games } from '../api/games.js';
import { getOwnBoard, getAttackBoard, shot, update } from '../api/game.js';
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
    const selection = event.target.elements.selection.value;
    const row = parseInt(selection.slice(1, 2));
    const col = convertToIndex(selection.slice(0, 1));

    console.log(game['current_player'] + " taking shot.\nAttempting to hit position: " + selection);

    // Get shot information (TODO: Check if shot is valid!)
    shot(game, game['current_player'], row, col);

    if(game['current_player'] === "creator")
    {
      game['current_player'] = "challenger";
    }
    else
    {
      game['current_player'] = "creator";
    }

    game['turn_number'] = game['turn_number'] + 1;

    update(game);

    $('#selection').val("");
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
      case 'H': return "../graphics/Hit.png";
      case 'E': return "../graphics/Water.png";
      case 'M': return "../graphics/Miss.png";
      case 'S': return "../graphics/Ship.png";
      case 'X': return "../graphics/Ship.png";
      default: return "../graphics/Water.png"; 
    }
  },
  cell() {
    const col = 'ABCDEFGHIJ'[this.col];
    return col + this.row;
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
