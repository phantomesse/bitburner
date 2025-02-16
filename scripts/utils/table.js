export const LEFT_ALIGN_STYLES = {
  'justify-content': 'flex-start',
  'text-align': 'left',
};

export class Table {
  /** @param {string} [columnNameToSortBy] */
  constructor(columnNameToSortBy) {
    /** @type {Cell[]} */ this.cells = [];
    this.columnNameToSortBy = columnNameToSortBy;
  }

  /**
   * @returns {Row[]}
   */
  getRows() {
    const rowIdToRowMap = {};

    for (const cell of this.cells) {
      if (!(cell.rowId in rowIdToRowMap)) {
        rowIdToRowMap[cell.rowId] = new Row();
      }
      rowIdToRowMap[cell.rowId].columnNameToCellMap[cell.columnName] = cell;
    }

    /** @type {Row[]} */ let rows = Object.values(rowIdToRowMap);
    if (this.columnNameToSortBy) {
      rows = rows.sort((row1, row2) => {
        const value1 = row1.columnNameToCellMap[this.columnNameToSortBy].value;
        const value2 = row2.columnNameToCellMap[this.columnNameToSortBy].value;
        return typeof value1 === 'string'
          ? value1.localeCompare(value2)
          : value1 - value2;
      });
    }

    return rows;
  }

  /**
   * @returns {Column[]}
   */
  getColumns() {
    const columnNameToColumnMap = {};

    for (const cell of this.cells) {
      const columnName = cell.columnName;
      if (columnName in columnNameToColumnMap) continue;
      columnNameToColumnMap[columnName] = new Column(
        columnName,
        cell.columnStyles
      );
    }

    return Object.values(columnNameToColumnMap);
  }
}

export class Cell {
  /**
   * @param {string} rowId
   * @param {string} columnName
   * @param {string = ''} content
   * @param {string|number} [value] for sorting
   * @param {Object.<string, (string|number)> = {}} columnStyles
   * @param {Object.<string, (string|number)> = {}} cellStyles
   */
  constructor(
    rowId,
    columnName,
    content = '',
    value = 0,
    columnStyles = {},
    cellStyles = {}
  ) {
    this.rowId = rowId;
    this.columnName = columnName;
    this.content = content;
    this.value = value;
    this.columnStyles = columnStyles;
    this.cellStyles = cellStyles;
  }
}

class Row {
  constructor() {
    /** @type {Object.<string, Cell>} */ this.columnNameToCellMap = {};
  }
}

class Column {
  /**
   * @param {string} name
   * @param {Object.<string, (string|number)> = {}} styles
   */
  constructor(name, styles) {
    this.name = name;
    this.styles = styles;
  }
}

/**
 * Gets React Element for printing table.
 *
 * @param {NS} ns
 * @param {Table} table
 */
function getTableElement(ns, table) {
  const borderColor = ns.ui.getTheme().welllight;
  const cellStyles = {
    border: `1px ${borderColor} solid`,
    padding: '4px 8px',
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'text-align': 'center',
  };

  const cellElements = [];

  // Add header row cells.
  const columns = table.getColumns();
  for (const column of columns) {
    cellElements.push(
      React.createElement(
        'div',
        { style: { ...cellStyles, ...column.styles, 'font-weight': 'bold' } },
        column.name
      )
    );
  }

  // Add each row.
  const rows = table.getRows();
  for (const row of rows) {
    for (const column of columns) {
      const cell = row.columnNameToCellMap[column.name];
      const styles = {
        ...cellStyles,
        ...cell.columnStyles,
        ...cell.cellStyles,
      };
      if (!cell.content) styles['color'] = borderColor;
      cellElements.push(
        React.createElement('div', { style: styles }, cell.content ?? '-')
      );
    }
  }

  return React.createElement(
    'div',
    {
      style: {
        display: 'grid',
        'grid-template-columns': `repeat(${columns.length}, max-content)`,
      },
    },
    ...cellElements
  );
}

/**
 * Prints a table to logs.
 *
 * @param {NS} ns
 * @param {Table} table
 */
export function printTable(ns, table) {
  ns.printRaw(getTableElement(ns, table));
}

/**
 * Prints a table to terminal.
 *
 * @param {NS} ns
 * @param {Table} table
 */
export function tprintTable(ns, table) {
  ns.tprintRaw(getTableElement(ns, table));
}
