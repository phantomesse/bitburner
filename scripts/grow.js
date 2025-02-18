/**
 * Attempts to grow a server once.
 *
 * Usage: `run grow.js <serverName>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  await ns.grow(ns.args[0], { stock: true });
}

export const autocomplete = (data) => data.servers;
