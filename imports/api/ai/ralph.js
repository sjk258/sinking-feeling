import {_} from 'meteor/underscore';

export const name = 'ralph';
export const full_name = 'Random Ralph';

/* jshint -W098 */
// Disable reporting of unused variables, since we need to accept state but it
// is unused here.
export function makeMove(board, state) {
/* jshint +W098 */

  let row, col;
  let squares = [];
  for (row = 0; row < 10; row++) {
    for (col = 0; col < 10; col++) {
      squares.push([row, col]);
    }
  }
  squares = _.shuffle(squares);

  for(let square of squares) {
    const row = square[0];
    const col = square[1];
    if (board[row][col].val == "E") return {row: row, col: col};
  }

  throw new Meteor.Error('no-moves-left', 'No more moves are possible');
}