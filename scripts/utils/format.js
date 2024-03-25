/**
 * Formats a number as money (e.g. $100.00).
 *
 * @param {NS} ns
 * @param {number} number
 * @returns {string} formatted string
 */
export function formatMoney(ns, number) {
  return `$${ns.formatNumber(number, 2)}`;
}

/**
 * Formats a number as time (e.g. 1h 3m 3s)
 *
 * @param {NS} ns
 * @param {number} timeInMillis
 * @returns {string} formatted string
 */
export function formatTime(ns, timeInMillis) {
  let seconds = Math.round(timeInMillis / 1000);

  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return [minutes > 0 ? `${minutes}m` : '', seconds > 0 ? `${seconds}s` : '']
    .filter(part => part.length > 0)
    .join(' ');
}
