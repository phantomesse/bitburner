import { getServers } from 'database/servers';

/**
 * Connects to a server given in the argument.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const server = getServers(ns).find(server => server.hostname === ns.args[0]);
  const commands = [
    server.path.map(hostname => `connect ${hostname}`).join('; '),
  ];
  await executeTerminalCommand(ns, ...commands);
}

export const autocomplete = data => data.servers;
