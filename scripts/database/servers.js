/** Util functions for managing servers.txt */

/**
 * @typedef Server
 * @property {string} hostname
 * @property {[boolean]} isPurchased
 * @property {[number]} maxRam maximum RAM the server has
 * @property {[number]} maxMoney
 * @property {[number]} minSecurity
 * @property {[number]} baseSecurity
 * @property {[number]} hackingLevel required hacking level
 */

const SERVERS_FILENAME = 'database/servers.txt';

/**
 * Updates any existing servers in the database and adds any new servers to the
 * database.
 *
 * @param {NS} ns
 * @param  {...Server} serversToUpdate
 */
export function updateServers(ns, ...serversToUpdate) {
  const databaseServers = getServers(ns);

  for (const server of serversToUpdate) {
    const databaseServer = databaseServers.find(
      databaseServer => databaseServer.hostname === server.hostname
    );
    if (!databaseServer) {
      databaseServers.push(server);
    } else {
      Object.keys(server).forEach(key => (databaseServer[key] = server[key]));
    }
  }

  ns.write(SERVERS_FILENAME, JSON.stringify(databaseServers), 'w');
}

/**
 * @param {NS} ns
 * @returns {Server[]} all servers in file
 */
export function getServers(ns) {
  return JSON.parse(ns.read(SERVERS_FILENAME) || '[]');
}
