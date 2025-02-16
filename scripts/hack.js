/**
 * Attempts to hack a server once.
 *
 * Usage: `run hack.js <serverName>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  await ns.hack(ns.args[0]);
}

export const autocomplete = (data) => data.servers;
