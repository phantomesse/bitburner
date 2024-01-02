/**
 * Weakens a given server.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  try {
    await ns.weaken(ns.args[0]);
  } catch (_) {
    return;
  }
}

export const autocomplete = data => data.servers;
