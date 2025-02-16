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
  const grid = new Grid(rowCount, columnCount);
  return getUniquePathCount(grid.grid, { rowIndex: 0, columnIndex: 0 });
}

/**
 * @param {Grid} grid
 * @param {Coordinates} coords
 */
function getUniquePathCount(grid, coords) {
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
  /**
   * @param {number} rowCount
   * @param {number} columnCount
   */
  constructor(rowCount, columnCount) {
    this.grid = Array(rowCount);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Array.from('x'.repeat(columnCount));
    }
  }
}
