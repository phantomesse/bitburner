/**
 * Unique Paths in a Grid I
 *
 * You are in a grid with 6 rows and 2 columns, and you are positioned in the
 * top-left corner of that grid. You are trying to reach the bottom-right corner
 * of the grid, but you can only move down or right on each step. Determine how
 * many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an array with the number of rows
 * and columns:
 *
 * [6, 2]
 *
 * @param {number[]} input
 * @returns {number} number of unique paths
 */
export function uniquePathsInAGridI(input) {
  const [rows, columns] = input;
  return getPaths(0, 0, new Grid(rows, columns));
}

/**
 * Unique Paths in a Grid II
 *
 * You are located in the top-left corner of the following grid:
 *
 * 0,1,0,0,0,
 * 0,0,0,0,0,
 * 0,0,0,0,1,
 * 1,0,0,0,0,
 * 0,0,0,0,0,
 * 0,0,0,1,0,
 *
 * You are trying reach the bottom-right corner of the grid, but you can only
 * move down or right on each step. Furthermore, there are obstacles on the grid
 * that you cannot move onto. These obstacles are denoted by '1', while empty
 * spaces are denoted by 0.
 *
 * Determine how many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an 2D array of numbers
 * representing the grid.
 *
 * @param {number[][]} input
 * @returns {number} number of unique paths
 */
export function uniquePathsInAGridII(input) {
  const rows = input.length;
  const columns = input[0].length;
  return getPaths(0, 0, new Grid(rows, columns, input));
}

/**
 * Gets all possible (can have duplicates) paths from the given position to the
 * bottom-right corner ({x: columns, y: rows}).
 *
 * @param {number} x
 * @param {number} y
 * @param {Grid} grid
 * @returns {number} number of paths
 */
function getPaths(x, y, grid) {
  if (x === grid.columns - 1 && y === grid.rows - 1) return 1;

  let paths = 0;

  const rightPosition = { x: x + 1, y: y };
  if (grid.isValidPosition(rightPosition.x, rightPosition.y)) {
    paths += getPaths(rightPosition.x, rightPosition.y, grid);
  }

  const downPosition = { x: x, y: y + 1 };
  if (grid.isValidPosition(downPosition.x, downPosition.y)) {
    paths += getPaths(downPosition.x, downPosition.y, grid);
  }

  return paths;
}

class Grid {
  /**
   * @param {number} rows
   * @param {number} columns
   * @param {[number[][]]} obstacles
   */
  constructor(rows, columns, obstacles) {
    this.rows = rows;
    this.columns = columns;
    this.obstacles = obstacles;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean} whether the position is valid
   */
  isValidPosition(x, y) {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.columns &&
      y < this.rows &&
      (this.obstacles ? this.obstacles[y][x] === 0 : true)
    );
  }
}
