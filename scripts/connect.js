import { getPath, HOME_SERVER_NAME } from '/utils/servers.js';

/**
 * Connects to a server.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const path = getPath(ns, ns.args[0]);
  for (const server of path) ns.connect(server);
}

export const autocomplete = data => [...data.servers];
