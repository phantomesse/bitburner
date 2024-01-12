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
export default function uniquePathsInAGridI(input) {
  const [rows, columns] = input;
  return new Set(getPaths(0, 0, new Grid(rows, columns), [])).size;
}

/**
 * @typedef {('d'|'r')[]} Path
 */

/**
 * Gets all possible (can have duplicates) paths from the given position to the
 * bottom-right corner ({x: columns, y: rows}).
 *
 * @param {number} x
 * @param {number} y
 * @param {Grid} grid
 * @param {Path[]} pathThusFar
 */
function getPaths(x, y, grid, pathThusFar) {
  if (x === grid.columns - 1 && y === grid.rows - 1) return [pathThusFar];

  const paths = [];

  const rightPosition = { x: x + 1, y: y };
  if (grid.isValidPosition(rightPosition.x, rightPosition.y)) {
    paths.push(
      ...getPaths(rightPosition.x, rightPosition.y, grid, [...pathThusFar, 'r'])
    );
  }

  const downPosition = { x: x, y: y + 1 };
  if (grid.isValidPosition(downPosition.x, downPosition.y)) {
    paths.push(
      ...getPaths(downPosition.x, downPosition.y, grid, [...pathThusFar, 'd'])
    );
  }

  return paths;
}

class Grid {
  /**
   * @param {number} rows
   * @param {number} columns
   */
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean} whether the position is valid
   */
  isValidPosition(x, y) {
    return x >= 0 && y >= 0 && x < this.columns && y < this.rows;
  }
}
