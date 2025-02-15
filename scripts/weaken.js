/**
 * Attemps to weaken a server once.
 *
 * Run: `run weaken.js <serverName>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  await ns.weaken(ns.args[0]);
}

export const autocomplete = (data) => data.servers;
