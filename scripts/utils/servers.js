export const HOME_HOSTNAME = 'home';
export const SERVERS_DATABASE_FILE = 'database/servers.txt';
export const PURCHASED_SERVER_PREFIX = 'lauren';

/**
 * @typedef ServerDetails
 * @property {string} hostname
 * @property {string[]} path
 * @property {boolean} hasRootAccess
 * @property {number} maxRam
 * @property {number} cpuCores
 * @property {number} maxMoney
 * @property {number} minSecurity
 * @property {number} baseSecurity
 * @property {number} hackingLevel
 *
 * @param {NS} ns
 * @returns {ServerDetails[]} all servers not including the HOME server
 */
export function getAllServers(ns) {
  return JSON.parse(ns.read(SERVERS_DATABASE_FILE));
}
