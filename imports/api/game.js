 
export function shot(game, player, row, col){
  if (typeof game[player] == 'undefined')
  {
    game[player] = {};
  }
  
  if (typeof game[player].shots == 'undefined')
  {
    game[player].shots = [];
  }  
  
  var shot = {row: row, col: col};
  game[player].shots.push(shot);
};