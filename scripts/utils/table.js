/**
 * @typedef Table
 * @property {Row[]} rows
 * @property {[string]} name
 * @property {string} baseColor in hex form starting with '#'
 *
 * @typedef Row
 * @property {Cell} cells
 *
 * @typedef Cell
 * @property {Column} column
 * @property {string} content
 *
 * @typedef Column
 * @property {string} name
 * @property {[import('utils/dom').Style]} style
 */

import { createReactElement } from 'utils/dom';

/**
 * Prints a table to the --tail logs.
 *
 * @param {NS} ns
 * @param {Table} table
 */
export function printTable(ns, table) {
  ns.printRaw(createTableReactElement(ns, table));
}

/**
 * Prints a table to the --tail logs.
 *
 * @param {NS} ns
 * @param {Table} table
 */
export function tprintTable(ns, table) {
  ns.tprintRaw(createTableReactElement(ns, table));
}

/**
 * @param {NS} ns
 * @param {Table} table
 * @returns {import('NetscriptDefinitions').ReactElement}
 */
function createTableReactElement(ns, table) {
  const primaryColorHex = table.baseColor ?? ns.ui.getTheme().primary;
  const borderStyle = `.5px solid ${primaryColorHex}66`;
  const defaultCellStyling = {
    border: borderStyle,
    color: primaryColorHex,
    padding: '4px',
  };

  // Add column headers.
  const cellElements = [
    table.rows[0].cells.map(cell =>
      createReactElement(cell.column.name, {
        ...defaultCellStyling,
        background: `${primaryColorHex}22`,
        'font-weight': 'bold',
        ...cell.column.style,
      })
    ),
  ];

  // Add content cells.
  for (const row of table.rows) {
    cellElements.push(
      ...row.cells.map(cell =>
        createReactElement(cell.content, {
          ...defaultCellStyling,
          ...cell.column.style,
        })
      )
    );
  }

  // Add optional table name.
  if (table.name) {
    cellElements.splice(
      0,
      0,
      createReactElement(table.name, {
        ...defaultCellStyling,
        background: `${primaryColorHex}22`,
        'font-weight': 'bold',
        'grid-column': '1 / -1',
        'text-align': 'center',
      })
    );
  }

  return createReactElement(cellElements, {
    display: 'grid',
    'grid-template-columns': table.rows[0].cells.map(_ => 'auto').join(' '),
    border: borderStyle,
    width: 'max-content',
    'max-width': '100%',
  });
}
