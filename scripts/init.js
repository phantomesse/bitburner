import { updateServers } from 'database/servers';
import { ONE_SECOND, getAllHostnames } from 'utils';

/**
 * Run this script at the beginning of every session.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.enableLog('run');

  // Optionally clean up files in all servers if there is enough RAM to do so.
  const cleanupFilesPid = ns.run('cleanup-files.js');
  while (ns.isRunning(cleanupFilesPid)) await ns.sleep(ONE_SECOND);

  // Reset database files.
  const allHostnames = getAllHostnames(ns);
  const purchasedHostnames = ns.getPurchasedServers();
  updateServers(
    ns,
    ...allHostnames.map(hostname =>
      getServerData(ns, hostname, purchasedHostnames)
    )
  );

  // Start scripts.
  ns.run('gain-access.js');
  ns.run('manage-hacking.js');
  ns.run('manage-hacknet.js');
  ns.run('manage-servers.js');
}

/**
 * Get stats of a server to save to the database.
 *
 * @param {NS} ns
 * @param {string} hostname
 * @param {string[]} purchasedHostnames
 * @returns {import('database/servers').Server} server
 */
export function getServerData(ns, hostname, purchasedHostnames) {
  return {
    hostname: hostname,
    isPurchased: purchasedHostnames.includes(hostname),
    maxRam: ns.getServerMaxRam(hostname),
    maxMoney: ns.getServerMaxMoney(hostname),
    minSecurity: ns.getServerMinSecurityLevel(hostname),
    baseSecurity: ns.getServerBaseSecurityLevel(hostname),
    hackingLevel: ns.getServerRequiredHackingLevel(hostname),
  };
}
