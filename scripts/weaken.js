/**
 * Attempts to weaken a server once.
 *
 * Usage: `run weaken.js <serverName>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  await ns.weaken(ns.args[0], { stock: true });
}

export const autocomplete = (data) => data.servers;
