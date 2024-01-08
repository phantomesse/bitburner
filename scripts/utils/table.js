/**
 * Utils for formatting for printing tables to either --tail logs or to the
 * terminal.
 */

/**
 * @typedef Column
 * @property {string} name
 * @property {[import('utils/dom').Style]} style
 */

/**
 * @typedef Cell
 * @property {Column} column
 * @property {import('../../NetscriptDefinitions').ReactNode} content
 * @property {[import('utils/dom').Style]} style
 */

/**
 * @typedef Row
 * @property {Cell[]} cells
 * @property {[import('utils/dom').Style]} style
 */

/**
 * @typedef Table
 * @property {Row[]} rows
 * @property {[import('utils/dom').Style]} style
 */

/**
 * Prints a table to --tail logs.
 *
 * @param {NS} ns
 * @param {Table} table
 */
export const printTable = (ns, table) =>
  ns.printRaw(getTableForPrinting(ns, table, true));

/**
 * Prints a table to the terminal.
 *
 * @param {NS} ns
 * @param {Table} table
 */
export const tprintTable = (ns, table) =>
  ns.tprintRaw(getTableForPrinting(ns, table));

/**
 * Gets a formatted table for printing
 *
 * @param {NS} ns
 * @param {Table} table
 * @param {[boolean]} fillWidth
 *        whether the table should take up the full width of the window
 * @returns {import('../../NetscriptDefinitions').ReactElement}
 */
function getTableForPrinting(ns, table, fillWidth) {
  if (table.rows.length === 0) return createReactElement('Nothing to print!');

  // Get border color.
  let primaryColor = ns.ui.getTheme().primary.substring(1);
  if (primaryColor.length === 3) {
    const colors = primaryColor.split('');
    primaryColor =
      colors[0] + colors[0] + colors[1] + colors[1] + colors[2] + colors[2];
  }
  const border = `.5px #${primaryColor}33 solid`;

  // Build and return ReactElement for table.
  const cellStyling = {
    border: border,
    padding: '2px 8px',
  };
  const headerCellElements = table.rows[0].cells.map(cell =>
    createReactElement(cell.column.name, {
      ...cellStyling,
      ...cell.column.style,
      fontWeight: 'bold',
      width: 'auto',
    })
  );
  const cellElements = table.rows
    .map(row => {
      const rowStyle = row.style ?? {};
      return row.cells.map(cell =>
        createReactElement(cell.content, {
          ...cellStyling,
          ...cell.column.style,
          ...rowStyle,
          ...cell.style,
          width: 'auto',
        })
      );
    })
    .flat();
  const tableStyle = table.style ?? {};
  return createReactElement([...headerCellElements, ...cellElements], {
    ...tableStyle,
    border: border,
    display: 'grid',
    gridTemplateColumns: table.rows[0].cells
      .map(cell => {
        if (cell.column.style.width) return cell.column.style.width;
        return fillWidth ? '1fr' : 'max-content';
      })
      .join(' '),
    width: fillWidth ? '100%' : 'max-content',
  });
}

/**
 * Creates a <div> react element.
 *
 * @param {import('../../NetscriptDefinitions').ReactNode|import('../../NetscriptDefinitions').ReactNode[]} content
 * @param {[import('utils/dom').Style]} style
 * @returns {import('../../NetscriptDefinitions').ReactElement}
 */
function createReactElement(content, style) {
  return React.createElement('div', { style: style ?? {} }, content);
}
