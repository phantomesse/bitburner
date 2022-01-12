/**
 * Small script that grows the host.
 *
 * If the number of times is passed into the argument, then only runs for that
 * many times. Otherwise, runs infinitely.
 *
 * @example run grow.js <hostname> <number of times>
 * @param {import('index').NS } ns
 */
export async function main(ns) {
  const host = ns.args[0];
  const numberOfTimes = ns.args[1];
  if (typeof host !== 'string') {
    ns.tprint(`usage: run grow.js <host> <number of times>`);
    return;
  }
  let index = 0;
  while (typeof numberOfTimes !== 'number' ? true : index++ < numberOfTimes) {
    await ns.grow(host, { stock: true });
  }
}

/**
 * @param {Object} data
 * @returns {string[]}
 */
export const autocomplete = data => [...data.servers];
