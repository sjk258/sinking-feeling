/**
 * Utility code for working with boards.
 */

import { _ } from 'meteor/underscore';

/**
 * makeBoard()
 * Returns a game board initialized with all cells empty.
 */
export function makeBoard() {
    return _.times(10, function(n) {
        return _.times(10, function(n) {
            return {val: 'E'};
        });
    });
}