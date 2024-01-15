import { getServers } from 'database/servers';
import { executeTerminalCommand } from 'utils/dom';

/**
 * Runs the weaken command on the given hostname in the terminal until the
 * script is stopped.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // Connect to server.
  const server = getServers(ns).find(server => server.hostname === ns.args[0]);
  const commands = [
    server.path.map(hostname => `connect ${hostname}`).join('; '),
  ];

  await executeTerminalCommand(ns, ...commands);

  while (true) {
    // Weaken server.
    await executeTerminalCommand(ns, 'weaken');
  }
}

export const autocomplete = data => data.servers;
