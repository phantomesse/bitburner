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
