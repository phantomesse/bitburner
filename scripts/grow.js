/**
 * Small script that grows the host.
 *
 * If the number of times is passed into the argument, then only runs for that
 * many times. Otherwise, runs infinitely.
 *
 * @example run grow-host.ns <hostname> <number of times>
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  const host = ns.args[0];
  const numberOfTimes = parseInt(ns.args[1]);
  let index = 0;
  while (isNaN(numberOfTimes) ? true : index++ < numberOfTimes) {
    await ns.grow(host);
  }
}

export const autocomplete = data => [...data.servers];
