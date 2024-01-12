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
 * @param {number[][]} grid
 * @returns {string} path
 */
export default function shortestPathInAGrid(grid) {
  const paths = getPaths(0, 0, grid, []);
  paths.sort((path1, path2) => path1.length - path2.length);
  return paths[0]?.join('') ?? '';
}

/**
 * @typedef {('U'|'L'|'D'|'R')[]} Path
 */

/**
 * @param {number} x
 * @param {number} y
 * @param {number[][]} grid
 * @param {Path} pathThusFar
 * @returns {Path[]} all possible paths from x,y to the bottom-right corner
 */
function getPaths(x, y, grid, pathThusFar) {
  if (!isValidPosition(x, y, grid)) return [];
  if (y === grid.length - 1 && x === grid[y].length - 1) return [pathThusFar];

  // Create a copy of the grid and mark the current position as an obstacle.
  const newGrid = [];
  for (let row of grid) {
    newGrid.push([...row]);
  }
  newGrid[y][x] = 1;

  const paths = [
    { x: x, y: y - 1, direction: 'U' },
    { x: x - 1, y: y, direction: 'L' },
    { x: x, y: y + 1, direction: 'D' },
    { x: x + 1, y: y, direction: 'R' },
  ]
    .map(newPosition =>
      getPaths(newPosition.x, newPosition.y, newGrid, [
        ...pathThusFar,
        newPosition.direction,
      ])
    )
    .filter(paths => paths.length > 0)
    .flat();

  return paths;
}

/**
 * Checks if a position is a valid empty space on the grid.
 *
 * @param {number} x
 * @param {number} y
 * @param {number[][]} grid
 */
function isValidPosition(x, y, grid) {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[y].length) return false;
  return grid[y][x] === 0;
}

// console.log(
//   shortestPathInAGrid([
//     [0, 1, 0, 0, 0],
//     [0, 0, 0, 1, 0],
//   ])
// );
// console.log(
//   shortestPathInAGrid([
//     [0, 1],
//     [1, 0],
//   ])
// );

// console.log(
//   shortestPathInAGrid([
//     [0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 1],
//     [0, 0, 0, 1, 0, 0],
//     [0, 0, 1, 1, 1, 0],
//     [0, 0, 0, 0, 0, 0],
//     [1, 1, 0, 0, 0, 0],
//     [0, 1, 0, 0, 0, 1],
//     [1, 1, 0, 0, 0, 0],
//   ])
// ); // DDDDRRDDDRRR

// console.log(
//   shortestPathInAGrid([
//     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1],
//     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
//     [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
//     [1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
//     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
//     [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
//   ])
// );
