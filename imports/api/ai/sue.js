import { Meteor } from 'meteor/meteor';

export const name = 'sue';

export function makeMove(board, state) {
  let row = 0;
  let col = 0;
  // Look for the first empty square in row-column order
  for (row = 0; row < board.length; row++) {
    for (col = 0; col < board[row].length; col++) {
      if (board[row][col].val == "E") return [row, col];
    }
  }
  throw new Meteor.Error('no-moves-left', 'No more moves are possible');
}