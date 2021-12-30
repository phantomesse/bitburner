/** Miscellaneous utils that don't fit anywhere else. */

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
