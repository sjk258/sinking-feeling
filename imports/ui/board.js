/** Configuration for JSHint to recognize automatic globals: */

import { $ } from 'meteor/jquery';

import './board.html';
import './board.less';

Template.board_cell.helpers({
  className() {
    switch (this.ship.state) {
      case 'H': return 'hit';
      case 'M': return 'miss';
      case 'S': return 'ship';
      case 'X': return 'sunk';
      case 'E': return 'empty';
      default: return '';
    }
  },
  symbol() {
    switch (this.ship.state) {
      case 'H':            return "../graphics/Hit.svg";
      case 'E':            return "../graphics/Water.svg";
      case 'M':            return "../graphics/Miss.svg";
      case 'X':            return "../graphics/Sunk.svg";
      case 'S':
        switch (this.ship.ship) {
          case 'Top':        return "../graphics/ShipTop.svg";
          case 'Bottom':     return "../graphics/ShipBottom.svg";
          case 'Right':      return "../graphics/ShipRight.svg";
          case 'Left':       return "../graphics/ShipLeft.svg";
          case 'Vertical':   return "../graphics/ShipVertical.svg";
          case 'Horizontal': return "../graphics/ShipHorizontal.svg";
        }
        /* fall through */
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