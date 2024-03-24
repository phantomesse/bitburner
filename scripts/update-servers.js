import { UPDATE_SERVERS_TO_MANAGE_HACKING_PORT } from 'utils/ports';
import { HOME_HOSTNAME, SERVERS_DATABASE_FILE } from 'utils/servers';

/**
 * Takes inventory of all servers, records them in a database file
 * (database/servers.txt), and sends out a port that the servers have updated.
 *
 * @param {NS} ns
 */
export function main(ns) {
  // Get all servers.
  const serverHostnameToPathMap = getServerHostnameToPathMap(ns);
  const servers = [];
  for (const hostname in serverHostnameToPathMap) {
    const path = serverHostnameToPathMap[hostname];
    servers.push(getServerDetails(ns, hostname, path));
  }

  // Write servers to file.
  ns.write(SERVERS_DATABASE_FILE, JSON.stringify(servers), 'w');

  // Update servers port.
  ns.writePort(UPDATE_SERVERS_TO_MANAGE_HACKING_PORT, 0);
}

/**
 * @param {NS} ns
 * @param {[string[]]} path optional hostname path from HOME server thus far
 * @returns {Object.<string, string[]>}
 *          map of server hostname to path for all existing servers
 */
function getServerHostnameToPathMap(ns, path = []) {
  const rootHostname = path.slice(-1)[0];
  const childrenHostnames = ns
    .scan(rootHostname)
    .filter(hostname => hostname !== HOME_HOSTNAME && !path.includes(hostname));

  let serverHostnameToPathMap = {};
  for (const hostname of childrenHostnames) {
    const newPath = [...path, hostname];
    serverHostnameToPathMap = {
      ...serverHostnameToPathMap,
      ...{ [hostname]: newPath },
      ...getServerHostnameToPathMap(ns, newPath),
    };
  }
  return serverHostnameToPathMap;
}

/**
 * @param {NS} ns
 * @param {string} hostname server hostname
 * @param {string[]} path
 *        path of server hostnames from HOME server (does not include HOME, but
 *        does include hostname)
 * @returns {import('utils/servers.js').ServerDetails} object with server details
 */
function getServerDetails(ns, hostname, path) {
  const serverInfo = ns.getServer(hostname);
  return /** @type {import('utils/servers.js').ServerDetails} */ {
    hostname: hostname,
    path: path,
    hasRootAccess: serverInfo.hasRootAccess,
    maxRam: serverInfo.maxRam,
    cpuCores: serverInfo.cpuCores,
    maxMoney: serverInfo.moneyMax,
    minSecurity: serverInfo.minDifficulty,
    baseSecurity: serverInfo.baseDifficulty,
    hackingLevel: serverInfo.requiredHackingSkill,
  };
}
