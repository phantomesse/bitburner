/**
 * Shortest Path in a Grid
 *
 * You are located in the top-left corner of the following grid:
 *
 *   [[0,0,0,0,0,0],
 *    [0,0,0,0,0,1],
 *    [0,0,0,1,0,0],
 *    [0,0,1,1,1,0],
 *    [0,0,0,0,0,0],
 *    [1,1,0,0,0,0],
 *    [0,1,0,0,0,1],
 *    [1,1,0,0,0,0]]
 *
 * You are trying to find the shortest path to the bottom-right corner of the
 * grid, but there are obstacles on the grid that you cannot move onto. These
 * obstacles are denoted by '1', while empty spaces are denoted by 0.
 *
 * Determine the shortest path from start to finish, if one exists. The answer
 * should be given as a string of UDLR characters, indicating the moves along
 * the path
 *
 * NOTE: If there are multiple equally short paths, any of them is accepted as
 * answer. If there is no path, the answer should be an empty string.
 *
 * NOTE: The data returned for this contract is an 2D array of numbers
 * representing the grid.
 *
 * Examples:
 *
 *     [[0,1,0,0,0],
 *      [0,0,0,1,0]]
 *
 * Answer: 'DRRURRD'
 *
 *     [[0,1],
 *      [1,0]]
 *
 * Answer: ''
 *
 * @param {number[][]} input
 * @returns {string} path
 */
export default function shortestPathInAGrid(input) {
  // Starting from bottom corner of grid, get all paths possible to bottom corner.
  const grid = new Grid(input);
  return getPaths(grid.endPosition, grid, '', [], new Map());
}

/**
 * @typedef {('U'|'L'|'D'|'R')} Direction
 */

const directionToOffsetMap = {
  D: { x: 0, y: -1 },
  R: { x: -1, y: 0 },
  U: { x: 0, y: 1 },
  L: { x: 1, y: 0 },
};

/**
 *
 * @param {Position} position
 * @param {Grid} grid
 * @param {string} pathThusFar
 * @param {Position[]} visitedPositions
 * @param {Map<Position, string[]>} positionToPathsCacheMap
 * @returns {string[]}
 */
function getPaths(
  position,
  grid,
  pathThusFar,
  visitedPositions,
  positionToPathsCacheMap
) {
  console.log(`position: ${position}, ${pathThusFar}`);

  const cacheKey = [...positionToPathsCacheMap.keys()].find(key =>
    key.equals(position)
  );
  if (cacheKey) {
    console.log('getting from cache', cacheKey);
    return positionToPathsCacheMap.get(cacheKey);
  }

  if (position.equals(new Position(0, 0))) {
    console.log(`reached the end ${pathThusFar}`);
    return [pathThusFar];
  }

  let paths = [];
  for (const direction in directionToOffsetMap) {
    const offset = directionToOffsetMap[direction];
    const nextPosition = new Position(
      position.x + offset.x,
      position.y + offset.y
    );
    if (
      !grid.isValidPosition(nextPosition) ||
      visitedPositions.find(visitedPosition =>
        visitedPosition.equals(nextPosition)
      )
    ) {
      continue;
    }

    paths.push(
      ...getPaths(
        nextPosition,
        grid,
        pathThusFar + direction,
        [...visitedPositions, position],
        positionToPathsCacheMap
      )
    );
  }

  positionToPathsCacheMap.set(position, paths);
  return paths;
}

class Position {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

class Grid {
  /**
   * @param {number[][]} grid
   */
  constructor(grid) {
    this.grid = grid;
    this.endPosition = new Position(grid[0].length - 1, grid.length - 1);
  }

  /**
   * @param {Position} position
   * @returns {boolean} is valid
   */
  isValidPosition(position) {
    const [x, y] = [position.x, position.y];
    return (
      x >= 0 &&
      y >= 0 &&
      y < this.grid.length &&
      x < this.grid[y].length &&
      this.grid[y][x] === 0
    );
  }
}

console.log(
  shortestPathInAGrid([
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
  ])
);
console.log(
  shortestPathInAGrid([
    [0, 1],
    [1, 0],
  ])
);

console.log(
  shortestPathInAGrid([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0],
  ])
); // DDDDRRDDDRRR

// console.log(
//   shortestPathInAGrid([
//     [0, 0, 0, 0, 0, 1, 0, 1],
//     [1, 0, 0, 1, 0, 0, 0, 0],
//     [0, 1, 0, 1, 0, 0, 0, 0],
//     [1, 0, 0, 1, 1, 0, 0, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0],
//     [0, 0, 1, 1, 0, 0, 0, 0],
//   ])
// );
