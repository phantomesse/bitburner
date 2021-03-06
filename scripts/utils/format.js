/** Utils for formatting numbers. */

/**
 * @param {number} money
 * @param {boolean} [isCompact]
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
 * @param {boolean} [isCompact]
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
 * @param {number} percent
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
  const hours = Math.floor(timeMs / 1000 / 60 / 60);
  const minutes = Math.floor((timeMs - hours * 1000 * 60 * 60) / 1000 / 60);
  const seconds = Math.floor(
    (timeMs - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000
  );
  return (
    (hours > 0 ? `${formatNumber(hours)}h ` : '') +
    (minutes > 0 ? `${minutes}m ` : '') +
    `${seconds}s`
  );
}
