import { executeTerminalCommand } from 'utils/dom';
import { getAllServers } from 'utils/servers';

/**
 * Connects to server by the given hostname.
 *
 * @param {NS} ns
 */
export function main(ns) {
  const path = getAllServers(ns).find(
    server => server.hostname === ns.args[0]
  ).path;
  for (const hostname of path) {
    executeTerminalCommand(ns, `connect ${hostname}`);
  }
}

export const autocomplete = data => data.servers;
