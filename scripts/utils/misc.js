/** Miscellaneous utils that don't fit anywhere else. */

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
  array.sort((a, b) => fn(reverse ? b : a) - fn(reverse ? a : b));
}

/**
 * This function allows us to reserve a certain amount of money so we don't end
 * up spending all our money buying things.
 *
 * @param {import('../..').NS} ns
 * @returns {number} money that we want to spend purchasing things
 */
export function getMoneyToSpend(ns) {
  return ns.getServerMoneyAvailable(HOME_SERVER_NAME) / 2;
}
