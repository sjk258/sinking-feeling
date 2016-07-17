import * as Game from './game.js';
import * as Square from './square.js';

export const lengths = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};
export const types = Object.keys(lengths);

export function create() {
  const ships = {};
  Game.placeShip("carrier", 0, 0, true, ships);
  Game.placeShip("battleship", 0, 1, true, ships);
  Game.placeShip("cruiser", 0, 2, true, ships);
  Game.placeShip("submarine", 0, 3, true, ships);
  Game.placeShip("destroyer", 0, 4, true, ships);
  return ships;
}

export function overlap(ship, row, col, vertical, ships) {
  for(let i = 0; i < lengths[ship]; i++) {
    let ship_space = {row, col};
    if(vertical) {
      ship_space.row += i;
    } else {
      ship_space.col += i;
    }
    if(Square.spaceIsOnShip(ship_space, ships)) {
      return true;
    }
  }
  return false;
}
