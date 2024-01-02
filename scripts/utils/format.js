/**
 * Utils for formatting strings.
 */

/**
 * @param {NS} ns
 * @param {number} amount
 * @returns {string} e.g. "$123.45"
 */
export function formatMoney(ns, amount) {
  return '$' + ns.formatNumber(amount, 2);
}

/**
 * @param {NS} ns
 * @param {number} milliseconds
 * @returns {string} e.g. "12m 34s"
 */
export function formatTime(ns, milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `${minutes}m ${seconds}s`;
}
