/**
 * Attemps to grow a server once.
 *
 * Run: `run grow.js <serverName>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  await ns.grow(ns.args[0]);
}

export const autocomplete = (data) => data.servers;
