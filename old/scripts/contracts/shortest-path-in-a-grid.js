/**
 * Shortest Path in a Grid
 *
 * You are located in the top-left corner of a grid.
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
 * @param {number[][]} input
 * @returns {string}
 */
export function shortestPathInAGrid(input) {
  const paths = _findPaths(0, 0, input);
  if (paths.length === 0) return '';
  paths.sort();
  return paths[0];
}

/**
 * @readonly
 * @enum {string}
 */
const Direction = {
  UP: 'U',
  DOWN: 'D',
  RIGHT: 'R',
};

const DIRECTION_TO_COORD_OFFSETS = {
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.DOWN]: { x: 0, y: 1 },
  [Direction.RIGHT]: { x: 1, y: 0 },
};

/**
 * @param {number} currentX
 * @param {number} currentY
 * @param {number[][]} grid
 * @returns {string[]} all possible paths
 */
function _findPaths(currentX, currentY, grid) {
  if (currentY === grid.length - 1 && currentX === grid[currentY].length - 1) {
    return [''];
  }

  const possiblePaths = [];
  for (const direction of Object.values(Direction)) {
    const newX = currentX + DIRECTION_TO_COORD_OFFSETS[direction].x;
    const newY = currentY + DIRECTION_TO_COORD_OFFSETS[direction].y;
    if (
      newX < 0 ||
      newY < 0 ||
      newY >= grid.length ||
      newX >= grid[newY].length ||
      grid[newY][newX] === 1
    ) {
      continue;
    }
    const newGrid = grid.map(row => row.slice());
    newGrid[currentY][currentX] = 1;
    const paths = _findPaths(newX, newY, newGrid);
    for (const path of paths) {
      possiblePaths.push(direction + path);
    }
  }
  return possiblePaths;
}
