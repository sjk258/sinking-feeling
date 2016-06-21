import { Meteor } from 'meteor/meteor';
import { Games } from '../api/games.js';
import { getOwnBoard, getAttackBoard } from '../api/game.js';

import './game.html';
import './game.css';

Template.game.helpers({
  ownBoard() {
    //TODO: This is hard-coded to the creator, it really needs to be the current user
    return getOwnBoard(this, this['current_player']);
  },
  attackBoard() {
    return getAttackBoard(this, this['current_player']);
  }
});

Template.game.events({
  'submit form'(event) {
    event.preventDefault();

    var game = this; //Games.findOne({ _id: 'test' });

    var selection = event.target.elements.selection.value;
    var nextPlayer = '';

    var col = convertToIndex(selection.slice(0, 1));
    var row = selection.slice(1, 2);

    var searchParam = row + '.' + col + '.val';

    if (game['current_player'] === "creator")
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
    dynamicQuery['turn_number'] = game['turn_number'] + 1;
    dynamicQuery['current_player'] = nextPlayer;

    console.log(dynamicQuery);

    Games.update( { _id: 'test' }, { $set: dynamicQuery } );
  }
});

Template.board_cell.helpers({
  className() {
    switch (this.val) {
      case 'H': return 'hit';
      case 'M': return 'miss';
      case 'S': return 'ship';
      case 'X': return 'sunk';
      case 'E': return 'empty';
      default: return '';
    }
  },
  symbol() {
    switch (this.val) {
      case 'E': return '\u00B7';
      case 'M': return '~';
      default: return this.val;
    }
  }
});

function convertToIndex(val) {
  switch(val)
  {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    case 'E':
      return 4;
    case 'F':
      return 5;
    case 'G':
      return 6;
    case 'H':
      return 7;
    case 'I':
      return 8;
    case 'J':
      return 9;
    default:
      return -1;
  }
}