import { updateServers } from 'database/servers';
import { writeStocks } from 'database/stocks';
import { getAllHostnames } from 'utils';
import { ONE_SECOND } from 'utils/constants';

/**
 * Run this script at the beginning of every session.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // ns.disableLog('ALL');

  // Optionally clean up files in all servers if there is enough RAM to do so.
  const cleanupFilesPid = ns.run('cleanup-files.js');
  while (ns.isRunning(cleanupFilesPid)) await ns.sleep(ONE_SECOND);

  // Reset database files.
  const allHostnames = getAllHostnames(ns);
  updateServers(
    ns,
    ...allHostnames.map(hostname => getServerData(ns, hostname))
  );
  if (ns.stock.hasWSEAccount() && ns.stock.hasTIXAPIAccess()) {
    writeStocks(ns);
    ns.run('manage-stocks.js', { preventDuplicates: true });
  }

  // Start scripts.
  ns.run('gain-access.js', { preventDuplicates: true });
  ns.run('manage-hacking.js', { preventDuplicates: true });
  ns.run('manage-hacknet.js', { preventDuplicates: true });
  ns.run('manage-servers.js', { preventDuplicates: true });
}

/**
 * Get stats of a server to save to the database.
 *
 * @param {NS} ns
 * @param {string} hostname
 * @returns {import('database/servers').Server} server
 */
export function getServerData(ns, hostname, x) {
  const serverData = ns.getServer(hostname);
  return {
    hostname: hostname,
    organization: serverData.organizationName,
    isPurchased: serverData.purchasedByPlayer,
    maxRam: serverData.maxRam,
    maxMoney: serverData.moneyMax,
    minSecurity: ns.getServerMinSecurityLevel(hostname),
    baseSecurity: ns.getServerBaseSecurityLevel(hostname),
    hackingLevel: ns.getServerRequiredHackingLevel(hostname),
  };
}
