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
 * @param {Map<string:(LEFT_ALIGNMENT|RIGHT_ALIGNMENT)>} columnHeaderToAlignmentMap
 * @param {...Object[]} rowSections sections of rows, each of them will be divided by a divider
 */
export function formatTable(columnHeaderToAlignmentMap, ...rowSections) {
  const columnHeaders = Object.keys(rowSections[0][0]);

  // Get width and height of each column.
  const columnHeaderToWidthMap = {};
  for (const columnHeader of columnHeaders) {
    let maxWidth = columnHeader.length;
    for (const rows of rowSections) {
      for (const row of rows) {
        const width = Math.max(
          ...row[columnHeader].split('\n').map(line => line.length)
        );
        if (width > maxWidth) maxWidth = width;
      }
    }
    columnHeaderToWidthMap[columnHeader] = maxWidth;
  }

  const widths = Object.values(columnHeaderToWidthMap);
  const alignments = Object.values(columnHeaderToAlignmentMap);
  const divider =
    '—' + widths.map(length => ''.padStart(length, '—')).join('—+—') + '—';
  const header = _formatTableRow(
    columnHeaders,
    widths,
    alignments
  ).toUpperCase();
  const sections = [
    header,
    ...rowSections.map(rows =>
      rows
        .map(row => _formatTableRow(Object.values(row), widths, alignments))
        .join('\n')
    ),
    header,
  ].join('\n┊' + divider + '┊\n');

  const print = ['+' + divider + '+', sections, '+' + divider + '+'];
  return '\n' + print.join('\n');
}

function _formatTableRow(values, widths, alignments) {
  const print = [];
  const height = Math.max(...values.map(value => value.split('\n').length));

  for (let i = 0; i < values.length; i++) {
    const valueLines = values[i].split('\n');
    const width = widths[i];
    const alignment = alignments[i];

    for (let j = 0; j < height; j++) {
      const valueLine = valueLines[j] || '';
      if (!print[j]) print[j] = '';
      print[j] +=
        '┊ ' +
        (alignment === RIGHT_ALIGNMENT
          ? valueLine.padStart(width)
          : valueLine.padEnd(width)) +
        ' ';
    }
  }

  return print.map(line => `${line}┊`).join('\n');
}
