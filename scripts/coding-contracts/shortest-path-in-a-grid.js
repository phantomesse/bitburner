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
  const paths = getPaths(0, 0, input).sort(
    (path1, path2) => path1.length - path2.length
  );
  return paths.length === 0 ? '' : paths[0];
}

const DIRECTIONS = {
  D: { x: 0, y: 1 },
  R: { x: 1, y: 0 },
  U: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
};

const coordsToPathsMap = {};

/**
 * @param {number} x
 * @param {number} y
 * @param {(0|1)[][]} grid
 * @param {string = ''} pathThusFar
 */
function getPaths(x, y, grid, pathThusFar = '') {
  if (y === grid.length - 1 && x === grid[y].length - 1) return [pathThusFar];

  const key = JSON.stringify({ x, y, grid });
  if (key in coordsToPathsMap) {
    return coordsToPathsMap[key];
  }

  const allPaths = [];
  for (const direction in DIRECTIONS) {
    const offset = DIRECTIONS[direction];
    const [nextX, nextY] = [x + offset.x, y + offset.y];
    if (!isValid(nextX, nextY, grid)) continue;

    const newGrid = copyGrid(grid);
    newGrid[y][x] = 1;

    const paths = getPaths(nextX, nextY, newGrid, pathThusFar + direction);
    if (paths.length === 0) continue;
    paths.sort((path1, path2) => path1.length - path2.length);
    allPaths.push(paths[0]);
  }

  if (allPaths.length === 0) {
    coordsToPathsMap[key] = [];
    return coordsToPathsMap[key];
  }

  allPaths.sort((path1, path2) => path1.length - path2.length);
  coordsToPathsMap[key] = [allPaths[0]];
  return coordsToPathsMap[key];
}

/**
 * @param {number} x
 * @param {number} y
 * @param {(0|1)[][]} grid
 */
function isValid(x, y, grid) {
  if (x < 0 || y < 0) return false;
  if (y >= grid.length || x >= grid[y].length) return false;
  return grid[y][x] === 0;
}

/**
 * @param {(0|1)[][]} grid
 * @returns {(0|1)[][]}
 */
function copyGrid(grid) {
  const copy = Array(grid.length);
  for (let i = 0; i < grid.length; i++) {
    copy[i] = [...grid[i]];
  }
  return copy;
}
