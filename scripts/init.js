import { updateServers } from 'database/servers';
import { writeStocks } from 'database/stocks';
import { getAllPaths } from 'utils/servers';
import { HOME_HOSTNAME, ONE_SECOND } from 'utils/constants';
import { writeGangTasks } from 'database/gang-tasks';

/**
 * Run this script at the beginning of every session.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  // Optionally clean up files in all servers if there is enough RAM to do so.
  const cleanupFilesPid = ns.run('cleanup-files.js');
  while (ns.isRunning(cleanupFilesPid)) await ns.sleep(ONE_SECOND);

  // Reset database files.
  const hostnameToPathMap = { [HOME_HOSTNAME]: [] };
  const allPaths = getAllPaths(ns, HOME_HOSTNAME);
  for (const path of allPaths) {
    hostnameToPathMap[path[path.length - 1]] = path.slice(1);
  }
  updateServers(
    ns,
    ...Object.keys(hostnameToPathMap).map(hostname =>
      getServerData(ns, hostname, hostnameToPathMap[hostname])
    )
  );
  if (ns.stock.hasWSEAccount() && ns.stock.hasTIXAPIAccess()) {
    writeStocks(ns);
    ns.run('manage-stocks.js', { preventDuplicates: true });
  }
  try {
    writeGangTasks(ns);
    if (ns.gang.inGang()) ns.run('manage-gang.js', { preventDuplicates: true });
  } catch (_) {}

  // Start scripts.
  ns.run('gain-access.js', { preventDuplicates: true });
  ns.run('manage-hacking.js', { preventDuplicates: true });
  ns.run('manage-hacknet.js', { preventDuplicates: true });
  ns.run('manage-servers.js', { preventDuplicates: true });
  ns.run('manage-life.js', { preventDuplicates: true });
}

/**
 * Get stats of a server to save to the database.
 *
 * @param {NS} ns
 * @param {string} hostname
 * @param {string[]} path
 * @returns {import('database/servers').Server} server
 */
export function getServerData(ns, hostname, path) {
  const serverData = ns.getServer(hostname);
  return {
    hostname: hostname,
    path: path,
    organization: serverData.organizationName,
    isPurchased: serverData.purchasedByPlayer,
    maxRam: serverData.maxRam,
    cpuCores: serverData.cpuCores,
    maxMoney: serverData.moneyMax,
    minSecurity: ns.getServerMinSecurityLevel(hostname),
    baseSecurity: ns.getServerBaseSecurityLevel(hostname),
    hackingLevel: ns.getServerRequiredHackingLevel(hostname),
  };
}
