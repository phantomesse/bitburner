/**
 * Unique Paths in a Grid I
 *
 * You are in a grid with 10 rows and 6 columns, and you are positioned in the
 * top-left corner of that grid. You are trying to reach the bottom-right corner
 * of the grid, but you can only move down or right on each step. Determine how
 * many unique paths there are from start to finish.
 *
 * NOTE: The data returned for this contract is an array with the number of rows
 * and columns:
 *
 * [10, 6]
 *
 * @param {number[]} input
 * @returns {number}
 */
export function solveUniquePathsInAGridI(input) {
  const [rowCount, columnCount] = input;
  const grid = Grid.fromRowAndColumnCounts(rowCount, columnCount);
  return getUniquePathCount(grid.grid, { rowIndex: 0, columnIndex: 0 });
}

/**
 * Unique Paths in a Grid II
 *
 * You are located in the top-left corner of the following grid:
 *
 * 0,0,0,
 * 0,0,0,
 * 0,0,0,
 * 0,0,0,
 * 0,0,0,
 * 1,0,0,
 * 1,0,1,
 * 0,0,0,
 * 0,0,1,
 * 0,0,0,
 * 0,1,0,
 * 0,0,0,
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
 * @param {(0|1)[][]} input
 * @returns {number}
 */
export function solveUniquePathsInAGridII(input) {
  const grid = new Grid(input);
  return getUniquePathCount(grid.grid, { rowIndex: 0, columnIndex: 0 });
}

/**
 * @param {(0|1)[][]} grid
 * @param {Coordinates} coords
 */
function getUniquePathCount(grid, coords) {
  if (grid[coords.rowIndex][coords.columnIndex] === 1) return 0;

  if (
    coords.rowIndex === grid.length - 1 &&
    coords.columnIndex === grid[0].length - 1
  ) {
    return 1;
  }

  let pathCount = 0;

  // Move right.
  if (coords.columnIndex < grid[0].length - 1) {
    pathCount += getUniquePathCount(grid, {
      rowIndex: coords.rowIndex,
      columnIndex: coords.columnIndex + 1,
    });
  }

  // Move down.
  if (coords.rowIndex < grid.length - 1) {
    pathCount += getUniquePathCount(grid, {
      rowIndex: coords.rowIndex + 1,
      columnIndex: coords.columnIndex,
    });
  }

  return pathCount;
}

class Coordinates {
  constructor(rowIndex, columnIndex) {
    this.rowIndex = rowIndex;
    this.columnIndex = columnIndex;
  }
}

class Grid {
  /** @param {(0|1)[][]} grid */
  constructor(grid) {
    this.grid = grid;
  }

  /**
   * @param {number} rowCount
   * @param {number} columnCount
   */
  static fromRowAndColumnCounts(rowCount, columnCount) {
    const grid = Array(rowCount);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Array(columnCount);
      for (let j = 0; j < columnCount; j++) {
        grid[i][j] = 0;
      }
    }
    return new Grid(grid);
  }
}
