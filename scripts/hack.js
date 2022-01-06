/**
 * Small script that hacks the host.
 *
 * If the number of times is passed into the argument, then only runs for that
 * many times. Otherwise, runs infinitely.
 *
 * @example run hack.ns <hostname> <number of times>
 * @param {import('index').NS } ns
 */
export async function main(ns) {
  const host = ns.args[0];
  const numberOfTimes = ns.args[1];
  if (typeof host !== 'string' || typeof numberOfTimes !== 'number') {
    ns.tprint(`usage: run hack.ns <host> <number of times>`);
    return;
  }
  let index = 0;
  while (isNaN(numberOfTimes) ? true : index++ < numberOfTimes) {
    await ns.hack(host, { stock: true });
  }
}

/**
 * @param {Object} data
 * @returns {string[]}
 */
export const autocomplete = data => [...data.servers];
