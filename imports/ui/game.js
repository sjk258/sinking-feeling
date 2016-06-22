/** Configuration for JSHint to recognize automatic globals: */
/* globals FlowRouter */

import { Games } from '../api/games.js';
import { getOwnBoard, getAttackBoard } from '../api/game.js';

import './game.html';

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
    //TODO: This is hard-coded to the creator, it really needs to be the current user
    const game = getGame();
    return getOwnBoard(game, game['current_player']);
  },
  attackBoard() {
    const game = getGame();
    return getAttackBoard(game, game['current_player']);
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