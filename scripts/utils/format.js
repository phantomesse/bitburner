/**
 * @param {number} timeInMillis
 * @returns {string}
 */
export function formatTime(timeInMillis) {
  let seconds = Math.round(timeInMillis / 1000);
  if (seconds <= 60) return `${seconds}s`;

  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  if (minutes <= 60) {
    return `${minutes}m` + (seconds > 0 ? ` ${seconds}s` : '');
  }

  const hours = Math.floor(minutes / 60);
  minutes -= hours * 60;
  return (
    `${hours}h` +
    (seconds > 0 || minutes > 0 ? ` ${minutes}m` : '') +
    (seconds > 0 ? ` ${seconds}s` : '')
  );
}

/**
 * @param {NS} ns
 * @param {number} amount
 * @returns {string}
 */
export function formatMoney(ns, amount) {
  return `$${ns.formatNumber(amount, 2)}`;
}
