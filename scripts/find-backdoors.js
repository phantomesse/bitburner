import { getServers } from 'database/servers';
import { executeTerminalCommand } from 'utils/dom';

/**
 * Prints out a command to run backdoor on all unowned servers with root access.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const currentHackingLevel = ns.getHackingLevel();
  const servers = getServers(ns).filter(server => {
    const serverData = ns.getServer(server.hostname);
    return (
      ns.hasRootAccess(server.hostname) &&
      serverData.requiredHackingSkill <= currentHackingLevel &&
      !serverData.purchasedByPlayer &&
      !serverData.backdoorInstalled
    );
  });
  for (const server of servers) {
    const commands = [
      server.path.map(hostname => `connect ${hostname}`).join('; '),
      'backdoor',
      'home',
    ];
    await executeTerminalCommand(ns, ...commands);
  }
}
