import { executeTerminalCommand } from 'utils/dom';
import { getAllServers } from 'utils/servers';

/**
 * Run backdoor script on all servers that we can.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const hackingLevel = ns.getHackingLevel();
  const servers = getAllServers(ns).filter(server => {
    const serverData = ns.getServer(server.hostname);
    return (
      server.hasRootAccess &&
      server.hackingLevel <= hackingLevel &&
      !serverData.purchasedByPlayer &&
      !serverData.backdoorInstalled
    );
  });

  for (const server of servers) {
    const commands = [
      'home',
      ...server.path.map(hostname => `connect ${hostname}`),
      'backdoor',
    ].join('; ');
    await executeTerminalCommand(ns, commands);
  }

  await executeTerminalCommand(ns, 'home');
}
