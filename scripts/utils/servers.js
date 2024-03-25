export const HOME_HOSTNAME = 'home';
export const PURCHASED_SERVER_PREFIX = 'lauren';

export const SERVERS_DATABASE_FILE = 'database/servers.txt';
export const RESERVED_RAM_DATABASE_FILE = 'database/reserved-ram.txt';

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

/**
 * Get RAM to reserve in HOME server.
 *
 * @param {NS} ns
 */
export function getReservedRam(ns) {
  const queueScriptRam = 1.6;
  return queueScriptRam + parseInt(ns.read(RESERVED_RAM_DATABASE_FILE));
}
