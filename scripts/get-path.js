import { getPath, HOME_SERVER_NAME } from '/utils/servers.js';

/**
 * Prints the command to go to a server.
 *
 * @param {import('index').NS} ns
 */
export function main(ns) {
  const serverName = ns.args[0];
  if (typeof serverName !== 'string') {
    ns.tprint(`usage: run get-path.js <server name>`);
    return;
  }
  const path = [
    HOME_SERVER_NAME,
    ...getPath(ns, serverName).map(path => 'connect ' + path),
  ].join('; ');
  ns.tprintf('%s', path);
}

/**
 * @param {Object} data
 * @returns {string[]}
 */
export const autocomplete = data => [...data.servers];
