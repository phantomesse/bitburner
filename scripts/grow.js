/**
 * Grows a server by the given hostname.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  try {
    await ns.grow(ns.args[0], { stock: true });
  } catch (_) {}
}

export const autocomplete = data => data.servers;
