/** Configuration for JSHint to recognize automatic globals: */

import { $ } from 'meteor/jquery';

import './board.html';
import './board.less';

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