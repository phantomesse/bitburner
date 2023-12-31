import { getPath } from '/utils/servers.js';

/**
 * Connects to a server.
 *
 * @param {import('index').NS} ns
 */
export function main(ns) {
  if (typeof ns.args[0] !== 'string') {
    ns.tprint(`usage: run connect.js <server name>`);
    return;
  }
  const path = getPath(ns, ns.args[0]);
  for (const server of path) ns.connect(server);
}

/**
 * @param {Object} data
 * @returns {string[]}
 */
export const autocomplete = data => [...data.servers];
