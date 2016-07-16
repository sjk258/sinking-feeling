/** Configuration for JSHint to recognize automatic globals: */

import { $ } from 'meteor/jquery';

import './board.html';
import './board.less';

Template.board_cell.helpers({
  classes() {
    let list = "cell-" + this.ship.state;
    if(this.ship.state === "S") {
      list += " cell-S-" + this.ship.ship;
    }
    if(this.game.state === 'active') {
      if(!this.own) list += " clickable";
    }
    return list;
  },
  cell() {
    const col = 'ABCDEFGHIJ'[this.col];
    return col + this.row;
  },
});

Template.board_cell.events({
  "click .clickable.cell"(event) {
    const target = event.currentTarget;
    $('#selection').val(target.dataset.cell);
  }
});