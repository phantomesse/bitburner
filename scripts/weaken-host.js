/**
 * Small script that continuously weakens the host passed in the argument.
 *
 * @example run weaken-host.ns <hostname>
 * @param {import('../.').NS } ns
 */
export async function main(ns) {
  while (true) await ns.weaken(ns.args[0]);
}
