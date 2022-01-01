/** Utils for formatting numbers. */

/**
 * @param {float} money
 * @param {boolean} isCompact
 * @returns {string}
 */
export function formatMoney(money, isCompact) {
  return money.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: isCompact ? 'compact' : 'standard',
  });
}

/**
 * @param {number} number
 * @param {boolean} isCompact
 * @returns {string}
 */
export function formatNumber(number, isCompact) {
  return Intl.NumberFormat('en', {
    notation: isCompact ? 'compact' : 'standard',
  }).format(number);
}

/**
 * Formats a percentage within two decimals.
 *
 * @param {float} percent
 * @returns {string}
 */
export function formatPercent(percent) {
  return (percent * 100).toFixed(2) + '%';
}

/**
 * Formats time with minutes and seconds.
 *
 * @param {number} timeMs
 * @returns {string} e.g. "43s", "4m 0s", "3m 32s"
 */
export function formatTime(timeMs) {
  const minutes = parseInt(timeMs / 1000 / 60);
  const seconds = parseInt((timeMs - minutes * 1000 * 60) / 1000);
  return (minutes > 0 ? `${minutes}m ` : '') + `${seconds}s`;
}

export const LEFT_ALIGNMENT = 'left';
export const RIGHT_ALIGNMENT = 'right';

/**
 * Formats a list of objects into a table.
 *
 * Note that all objects must have the same keys. All values must be strings.
 *
 * @param {Object[]} rows
 * @param {any} [columnHeaderToAlignmentMap] if not set, all values will be left aligned
 */
export function formatTable(ns, rows, columnHeaderToAlignmentMap) {
  const columnHeaders = Object.keys(rows[0]);

  // Set alignment.
  if (columnHeaderToAlignmentMap === undefined) {
    columnHeaderToAlignmentMap = new Map(
      columnHeaders.map(columnHeader => [columnHeader, LEFT_ALIGNMENT])
    );
  }

  // Get width of each column.
  const columnHeaderToLengthMap = {};
  for (const columnHeader of columnHeaders) {
    columnHeaderToLengthMap[columnHeader] = Math.max(
      ...[columnHeader, ...rows.map(row => row[columnHeader])].map(
        value => value.length
      )
    );
  }

  const lengths = Object.values(columnHeaderToLengthMap);
  const alignments = Object.values(columnHeaderToAlignmentMap);
  const divider =
    '-' + lengths.map(length => ''.padStart(length, '-')).join('-+-') + '-';
  const print = [
    '+' + divider + '+',
    _formatTableRow(columnHeaders, lengths, alignments),
    '│' + divider + '│',
    ...rows.map(row =>
      _formatTableRow(Object.values(row), lengths, alignments)
    ),
    '+' + divider + '+',
  ];
  return '\n' + print.join('\n');
}

function _formatTableRow(values, lengths, alignments) {
  return (
    '│ ' +
    values
      .map((value, index) =>
        alignments[index] === RIGHT_ALIGNMENT
          ? value.padStart(lengths[index])
          : value.padEnd(lengths[index])
      )
      .join(' ┊ ') +
    ' │'
  );
}
