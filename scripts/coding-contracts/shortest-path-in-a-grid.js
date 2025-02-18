/**
 * Shortest Path in a Grid
 *
 * You are located in the top-left corner of the following grid:
 *
 *   [[0,0,0,0,0,1,1,0,0,0,1,0],
 *    [1,0,0,0,0,0,0,0,0,0,0,0],
 *    [0,0,0,0,0,0,1,1,0,0,0,0],
 *    [0,0,0,1,0,1,1,1,0,0,0,0],
 *    [1,0,0,1,0,1,0,0,0,0,0,1],
 *    [0,0,0,0,1,0,1,0,0,0,0,0]]
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
 * @param {(0|1)[][]} input
 * @returns {string}
 */
export function solveShortestPathInAGrid(input) {
  return (
    getAllPaths(input, { x: 0, y: 0 }).sort((a, b) => a.length - b.length)[0] ??
    ''
  );
}

const DIRECTIONS = ['U', 'D', 'L', 'R'];

/**
 * @param {(0|1)[][]} grid
 * @param {{x: number, y: number}} coords
 * @param {string} [pathThusFar]
 * @returns {string[]} all possible paths
 */
function getAllPaths(grid, coords, pathThusFar) {
  if (coords.y === grid.length - 1 && coords.x === grid[coords.y].length - 1) {
    return [pathThusFar];
  }

  if (!pathThusFar) pathThusFar = '';
  const paths = [];
  for (const direction of DIRECTIONS) {
    const nextCoords = getNextCoords(direction, coords);
    if (!isValid(grid, nextCoords)) continue;
    grid[coords.y][coords.x] = 1;

    paths.push(...getAllPaths(grid, nextCoords, pathThusFar + direction));
  }
  return paths;
}

/**
 *
 * @param {'U'|'D'|'L'|'R'} direction
 * @param {x: number, y: number} coords
 * @returns {x: number, y: number} next coordinates
 */
function getNextCoords(direction, coords) {
  const { x, y } = coords;
  switch (direction) {
    case 'U':
      return { x, y: y - 1 };
    case 'D':
      return { x, y: y + 1 };
    case 'L':
      return { x: x - 1, y };
    case 'R':
      return { x: x + 1, y };
  }
}

/**
 * @param {(0|1)[][]} grid
 * @param {{x: number, y: number}} coords
 * @returns {boolean} whether the given coordinates is valid
 */
function isValid(grid, coords) {
  if (coords.x < 0 || coords.y < 0) return false;
  if (coords.y >= grid.length) return false;
  if (coords.x >= grid[coords.y].length) return false;
  return grid[coords.y][coords.x] === 0;
}
