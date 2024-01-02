/**
 * Utils for formatting for printing tables to either --tail logs or to the
 * terminal.
 */

/**
 * @typedef Column
 * @property {string} name
 * @property {Object.<string, string|number>} style
 */

/**
 * @typedef Cell
 * @property {Column} column
 * @property {import('../../NetscriptDefinitions').ReactNode} content
 */

/**
 * @typedef Row
 * @property {Cell[]} cells
 */

/**
 * @typedef Table
 * @property {Row[]} rows
 */

/**
 * Prints a table to --tail logs.
 *
 * @param {NS} ns
 * @param {Table} table
 */
export const printTable = (ns, table) =>
  ns.printRaw(getTableForPrinting(ns, table));

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
 * @returns {import('../../NetscriptDefinitions').ReactElement}
 */
function getTableForPrinting(ns, table) {
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
    })
  );
  const cellElements = table.rows
    .map(row =>
      row.cells.map(cell =>
        createReactElement(cell.content, {
          ...cellStyling,
          ...cell.column.style,
        })
      )
    )
    .flat();
  return createReactElement([...headerCellElements, ...cellElements], {
    border: border,
    display: 'grid',
    gridTemplateColumns: headerCellElements.map(_ => 'max-content').join(' '),
    width: 'max-content',
  });
}

/**
 * Creates a <div> react element.
 *
 * @param {import('../../NetscriptDefinitions').ReactNode|import('../../NetscriptDefinitions').ReactNode[]} content
 * @param {[Object.<string, string|number>]} style
 * @returns {import('../../NetscriptDefinitions').ReactElement}
 */
function createReactElement(content, style) {
  return React.createElement('div', { style: style ?? {} }, content);
}
