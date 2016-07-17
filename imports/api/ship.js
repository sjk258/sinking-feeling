import * as Game from './game.js';

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
