/**
 * Small script that continuously hacks the host passed in the argument.
 *
 * Usage: `run hack-host.ns <hostname>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) await ns.hack(ns.args[0]);
}
