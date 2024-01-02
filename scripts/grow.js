/**
 * Grows a given server.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    try {
      await ns.grow(ns.args[0]);
    } catch (_) {
      return;
    }
  }
}

export const autocomplete = data => data.servers;
