/**
 * @typedef Alignment
 */

/**
 * Enum for cell alignment.
 *
 * @readonly
 * @enum {Alignment}
 */
export const Alignment = Object.freeze({ LEFT: 'left', RIGHT: 'right' });

/**
 * @typedef RowColor
 */

/**
 * Enum for color of row.
 *
 * @readonly
 * @enum {RowColor}
 */
export const RowColor = Object.freeze({
  INFO: 'INFO  ',
  WARN: 'WARN  ',
  ERROR: 'ERROR ',
  NORMAL: '      ',
});

const PIPE = '┊';
const DASH = '—';
const JOIN = '+';

/**
 * Utils for printing a table in the terminal.
 *
 * @param {import('../index').NS} ns
 * @param {Object.<string, Alignment>} columnHeaderToAlignmentMap
 *        if a column header is not specified in this map, then it is assumed
 *        that it will be left-aligned
 * @param {...Object.<string, any>[]} sections
 *        sections contain rows that are divided by a divider; all rows must
 *        have the same keys (which are used for column headers)
 */
export function printTable(ns, columnHeaderToAlignmentMap, ...sections) {
  // Fill in any missing alignments. Note that the alignments are not guaranteed
  // to be in the same order as the column headers, so we cannot rely on the
  // order.
  const columnHeaders = Object.keys(sections[0][0]).filter(
    key => key !== 'rowColor'
  );
  if (!columnHeaderToAlignmentMap) columnHeaderToAlignmentMap = {};
  for (const columnHeader of columnHeaders) {
    if (!(columnHeader in columnHeaderToAlignmentMap)) {
      columnHeaderToAlignmentMap[columnHeader] = Alignment.LEFT;
    }
  }

  // Get width of each column.
  const columnHeaderToWidthMap = columnHeaders.reduce(
    (map, columnHeader) => ({ ...map, [columnHeader]: columnHeader.length }),
    {}
  );
  for (const columnHeader of columnHeaders) {
    for (const rows of sections) {
      for (const row of rows) {
        const lines = row[columnHeader].toString().split('\n');
        columnHeaderToWidthMap[columnHeader] = Math.max(
          columnHeaderToWidthMap[columnHeader],
          ...lines.map(line => line.length)
        );
      }
    }
  }

  // Print the column headers.
  _printColumnHeaders(
    ns,
    columnHeaders,
    columnHeaderToAlignmentMap,
    columnHeaderToWidthMap
  );

  // Print each section.
  for (let i = 0; i < sections.length; i++) {
    for (let j = 0; j < sections[i].length; j++) {
      _printRow(
        ns,
        sections[i][j],
        columnHeaders,
        columnHeaderToAlignmentMap,
        columnHeaderToWidthMap,
        j === sections[i].length - 1 && i !== sections.length - 1
      );
    }
  }

  // Print the column headers at the end again.
  _printColumnHeaders(
    ns,
    columnHeaders,
    columnHeaderToAlignmentMap,
    columnHeaderToWidthMap
  );
}

/**
 * @param {import('../index').NS} ns
 * @param {Object.<string, any>} row
 * @param {string[]} columnHeaders
 * @param {Object.<string, Alignment>} columnHeaderToAlignmentMap
 * @param {Object.<string, number>} columnHeaderToWidthMap
 * @param {boolean} shouldAddDivider
 */
function _printRow(
  ns,
  row,
  columnHeaders,
  columnHeaderToAlignmentMap,
  columnHeaderToWidthMap,
  shouldAddDivider
) {
  const height = Math.max(
    ...Object.values(row).map(value => value.toString().split('\n').length)
  );

  const contents = new Array(height).fill('');
  for (const columnHeader of columnHeaders) {
    const lines = row[columnHeader].split('\n');
    const width = columnHeaderToWidthMap[columnHeader];

    for (let i = 0; i < contents.length; i++) {
      let line = lines[i] || '';
      line =
        columnHeaderToAlignmentMap[columnHeader] === Alignment.RIGHT
          ? line.padStart(width)
          : line.padEnd(width);
      contents[i] += `${PIPE} ${line} `;
    }
  }
  for (let i = 0; i < contents.length; i++) {
    contents[i] =
      (i === 0 && row.rowColor ? row.rowColor : RowColor.NORMAL) +
      contents[i] +
      PIPE;
  }
  if (shouldAddDivider) {
    contents.push(
      RowColor.NORMAL + _getDivider(columnHeaders, columnHeaderToWidthMap)
    );
  }

  ns.tprintf('%s', contents.join('\n'));
}

/**
 * @param {import('../index').NS} ns
 * @param {string[]} columnHeaders
 * @param {Object.<string, Alignment>} columnHeaderToAlignmentMap
 * @param {Object.<string, number>} columnHeaderToWidthMap
 */
function _printColumnHeaders(
  ns,
  columnHeaders,
  columnHeaderToAlignmentMap,
  columnHeaderToWidthMap
) {
  const contents = columnHeaders
    .map(columnHeader => {
      const width = columnHeaderToWidthMap[columnHeader];
      return columnHeaderToAlignmentMap[columnHeader] === Alignment.RIGHT
        ? columnHeader.padStart(width)
        : columnHeader.padEnd(width);
    })
    .join(` ${PIPE} `)
    .toUpperCase();
  const divider = _getDivider(columnHeaders, columnHeaderToWidthMap);
  ns.tprintf(
    '%s',
    [
      RowColor.INFO + divider,
      RowColor.NORMAL + PIPE + ` ${contents} ` + PIPE,
      RowColor.NORMAL + divider,
    ].join('\n')
  );
}

/**
 * @param {import('..').NS} ns
 * @param {string[]} columnHeaders
 * @param {Object.<string, number>} columnHeaderToWidthMap
 */
function _printDivider(ns, columnHeaders, columnHeaderToWidthMap) {
  ns.tprintf(
    '%s%s',
    RowColor.INFO,
    _getDivider(columnHeaders, columnHeaderToWidthMap)
  );
}

/**
 * Gets just the divider string without the row color print.
 *
 * This function does not print anything.
 *
 * @param {string[]} columnHeaders
 * @param {Object.<string, number>} columnHeaderToWidthMap
 * @returns {string}
 */
function _getDivider(columnHeaders, columnHeaderToWidthMap) {
  const contents = columnHeaders
    .map(columnHeader => ''.padEnd(columnHeaderToWidthMap[columnHeader], DASH))
    .join(DASH + JOIN + DASH);
  return [JOIN, DASH, contents, DASH, JOIN].join('');
}
