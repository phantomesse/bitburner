import { updateServers } from 'database/servers';
import { getAllHostnames } from 'utils';

/**
 * Run this script at the beginning of every session.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // Optionally clean up files in all servers if there is enough RAM to do so.
  ns.run('cleanup-files.js');

  // Reset database files.
  const allHostnames = getAllHostnames(ns);
  updateServers(
    ns,
    ...allHostnames.map(hostname => getServerData(ns, hostname))
  );

  // Start scripts.
  ns.tprint(ns.run('gain-access.js'));
  ns.tprint(ns.run('manage-hacking.js'));
  ns.run('manage-hacknet.js');
}

/**
 * Get stats of a server to save to the database.
 *
 * @param {NS} ns
 * @param {string} hostname
 * @returns {import('database/servers').Server} server
 */
export function getServerData(ns, hostname) {
  return {
    hostname: hostname,
    maxRam: ns.getServerMaxRam(hostname),
    maxMoney: ns.getServerMaxMoney(hostname),
    minSecurity: ns.getServerMinSecurityLevel(hostname),
    baseSecurity: ns.getServerBaseSecurityLevel(hostname),
    hackingLevel: ns.getServerRequiredHackingLevel(hostname),
  };
}
