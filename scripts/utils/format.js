/**
 * @param {number} timeInMillis
 * @returns {string}
 */
export function formatTime(timeInMillis) {
  let seconds = Math.round(timeInMillis / 1000);
  if (seconds <= 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  if (seconds === 0) return `${minutes}min`;

  return `${minutes}min ${seconds}s`;
}

/**
 * @param {NS} ns
 * @param {number} amount
 * @returns {string}
 */
export function formatMoney(ns, amount) {
  return `$${ns.formatNumber(amount, 2)}`;
}
