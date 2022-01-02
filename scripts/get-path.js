import { getPath, HOME_SERVER_NAME } from '/utils/servers.js';

/**
 * Prints the command to go to a server.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const path = [
    HOME_SERVER_NAME,
    ...getPath(ns, ns.args[0]).map(path => 'connect ' + path),
  ].join('; ');
  ns.tprintf('%s', path);
}

export const autocomplete = data => [...data.servers];
