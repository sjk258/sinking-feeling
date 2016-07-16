/** Configuration for JSHint to recognize automatic globals: */

import { $ } from 'meteor/jquery';

import * as Game from '/imports/api/game.js';
import * as Board from '/imports/api/board.js';

import './board.html';
import './board.less';

Template.board_row.helpers({
  rowName(row) {
    return 'ABCDEFGHIJ'[row];
  },
});

Template.board_cell.helpers({
  classes() {
    const user = Meteor.user();
    let list = "cell-" + this.ship.state;
    if(this.ship.state === "S") {
      list += " cell-S-" + this.ship.ship;
    }
    if(Game.userCanFire(this.game, user)) {
      if(!this.own) list += " clickable";
    }
    return list;
  },
  cell() {
    return Board.squareObjToName(this);
  },
});

Template.board_cell.events({
  "click .clickable.cell"(event) {
    const target = event.currentTarget;
    $('#selection').val(target.dataset.cell);
  }
});