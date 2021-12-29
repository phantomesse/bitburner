/**
 * Small script that hacks the host.
 *
 * If the number of times is passed into the argument, then only runs for that
 * many times. Otherwise, runs infinitely.
 *
 * @example run hack-host.ns <hostname> <number of times>
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  const host = ns.args[0];
  const numberOfTimes = parseInt(ns.args[1]);
  let index = 0;
  while (isNaN(numberOfTimes) ? true : index++ < numberOfTimes) {
    await ns.hack(host);
  }
}

export const autocomplete = data => [...data.servers];
