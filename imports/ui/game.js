/** Configuration for JSHint to recognize automatic globals: */
/* globals FlowRouter */

import { Games } from '../api/games.js';
import { getOwnBoard, getAttackBoard, fire, update } from '../api/game.js';
import { $ } from 'meteor/jquery';

import './game.html';
import './game.less';

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

    if (selection.length === 2)
    {
      const row = parseInt(selection.slice(1, 2));
      const col = convertToIndex(selection.slice(0, 1));

      console.log(game.current_player + " taking shot.\nAttempting to hit position: " + selection);

      // Get shot information (TODO: Check if shot is valid!)
      fire(game, row, col);
      update(game);

      $('#selection').val("");
    }
  }
});

Template.board_cell.helpers({
  className() {
    switch (this.ship.val) {
      case 'H': return 'hit';
      case 'M': return 'miss';
      case 'S_Top': 
      case 'S_Bottom':
      case 'S_Right':
      case 'S_Left':
      case 'S_Vertical':
      case 'S_Horizontal':
        return 'ship';
      case 'X': return 'sunk';
      case 'E': return 'empty';
      default: return '';
    }
  },
  symbol() {
    switch (this.ship.val) {
      case 'H':            return "../graphics/Hit.svg";  
      case 'E':            return "../graphics/Water.svg";  
      case 'M':            return "../graphics/Miss.svg";  
      case 'S_Top':        return "../graphics/ShipTop.svg";  
      case 'S_Bottom':     return "../graphics/ShipBottom.svg";  
      case 'S_Right':      return "../graphics/ShipRight.svg";  
      case 'S_Left':       return "../graphics/ShipLeft.svg";  
      case 'S_Vertical':   return "../graphics/ShipVertical.svg";  
      case 'S_Horizontal': return "../graphics/ShipHorizontal.svg";  
      case 'X':            return "../graphics/Sunk.svg";  
      default:             return "../graphics/Water.svg";  
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
