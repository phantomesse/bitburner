/**
 * Small script that continuously grows the host passed in the argument.
 *
 * @example run grow-host.ns <hostname>
 * @param {import('../.').NS } ns
 */
export async function main(ns) {
  while (true) await ns.grow(ns.args[0]);
}
