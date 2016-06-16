export const AI = {
    'makeMove'(game) {
        const board = game.opponent_board;
        let row = 0;
        let col = 0;
        // Look for the first empty square in row-column order
        for (row = 0; row < board.length; row++) {
            for (col = 0; col < board[row].length; col++) {
                if (board[row][col] == "E") return [row, col];
            }
        }
        return false;
    },
};