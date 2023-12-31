/** Miscellaneous utils that don't fit anywhere else. */

import { getStockWorth } from '/utils/stock.js';
import { HOME_SERVER_NAME } from '/utils/servers.js';

export const DEFAULT_PORT = 1337;
export const LOCALHOST_PREFIX = 'http://localhost';

/**
 * Sorts an array given a function to call on each item of the array.
 *
 * @param {any[]} array
 * @param {} fn
 * @param {boolean} [reverse=false]
 */
export function sort(array, fn, reverse) {
  array.sort((a, b) => {
    const first = fn(reverse ? b : a);
    const second = fn(reverse ? a : b);
    if (typeof first === 'string') return first.localeCompare(second);
    return first - second;
  });
}

/**
 * This function allows us to reserve a certain amount of money so we don't end
 * up spending all our money buying things.
 *
 * @param {import('../index').NS} ns
 * @returns {number} money that we want to spend purchasing things
 */
export function getMoneyToSpend(ns) {
  return ns.getServerMoneyAvailable(HOME_SERVER_NAME) / 2;
}

/**
 * @param {import ('../index').NS} ns
 * @returns {number} net worth including cash on hand and stocks
 */
export function getNetWorth(ns) {
  return (
    ns.getServerMoneyAvailable(HOME_SERVER_NAME) +
    ns.stock
      .getSymbols()
      .map(symbol => getStockWorth(ns, symbol))
      .reduce((a, b) => a + b)
  );
}
