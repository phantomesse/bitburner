import { getServers } from 'database/servers';
import { getPath } from 'utils';

/**
 * Prints out a command to run backdoor on all unowned servers with root access.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const servers = getServers(ns).filter(server => {
    const serverInfo = ns.getServer(server.hostname);
    return (
      !serverInfo.purchasedByPlayer &&
      !serverInfo.backdoorInstalled &&
      serverInfo.requiredHackingSkill <= ns.getHackingLevel() &&
      ns.hasRootAccess(server.hostname)
    );
  });

  for (const server of servers) {
    const path = getPath(ns, server.hostname);

    const commands = [];
    commands.push(
      'home',
      ...path.map(hostname => `connect ${hostname}`),
      'backdoor'
    );
    ns.tprintf(commands.map(command => command + ';').join(' ') + '\n');
  }
}
