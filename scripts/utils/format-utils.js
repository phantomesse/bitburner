/**
 * Formats money.
 *
 * @param {float} money
 * @returns {string}
 */
export function formatMoney(money) {
  return money.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
