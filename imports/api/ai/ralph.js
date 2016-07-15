import {_} from 'meteor/underscore';

export const name = 'ralph';
export const full_name = 'Random Ralph';

/* Converts an integer in the range 0 to 99 to a move: {row: <val>, col: <val>}
 * Each integer uniquely identifies a move
 */
export function intToMove(val) {
  return {row: Math.floor(val/10), col: (val%10)};
}

/* Converts a list of integers into a shuffled list of moves */
export function shuffleIntToMoves(vals) {
  return _.shuffle(_.map(vals, intToMove));
}

/* Returns the first valid move, or undefined if none found */
export function firstValidMove(board, moves) {
  const move = _.find(moves, (move) => {
    return board[move.row][move.col].state === "E";
  });
  if(move === undefined) {
    throw new Meteor.Error('no-moves-left', 'No more moves are possible');
  }
  return move;
}

/* jshint -W098 */
// Disable reporting of unused variables, since we need to accept state but it
// is unused here.
export function makeMove(board, state) {
/* jshint +W098 */
  let moves = shuffleIntToMoves(_.range(0, 100));
  return firstValidMove(board, moves);
}