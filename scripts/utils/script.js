import { getAllServerNames, HOME_SERVER_NAME } from 'utils/server';

export const HACK_JS = 'hack.js';
export const GROW_JS = 'grow.js';
export const WEAKEN_JS = 'weaken.js';
export const QUEUE_SCRIPT_JS = 'queue-script.js';

export const ADDITIONAL_RESERVED_RAM_PORT = 123;

/**
 * @param {NS} ns
 * @param {string} scriptName
 * @returns {number} number of threads
 */
export function getAvailableThreadsAcrossAllRootAccessServers(ns, scriptName) {
  const totalRam = getAllServerNames(ns)
    .filter(ns.hasRootAccess)
    .map(ns.getServerMaxRam)
    .reduce((a, b) => a + b);
  return Math.floor(totalRam / ns.getScriptRam(scriptName));
}

/**
 * @param {NS} ns
 * @param {string} scriptName
 * @param {string} serverName server to run script on
 * @returns {number} number of threads
 */
export function getThreadsAvailableToRunScript(ns, scriptName, serverName) {
  const availableRam = getAvailableRam(ns, serverName);
  const scriptRam = ns.getScriptRam(scriptName, serverName);
  return Math.floor(availableRam / scriptRam);
}

/**
 * @param {NS} ns
 * @param {string = HOME_SERVER_NAME} serverName
 * @returns {number} available RAM on given server
 */
function getAvailableRam(ns, serverName = HOME_SERVER_NAME) {
  const reservedRam = ns.getScriptRam(QUEUE_SCRIPT_JS);

  const portData = ns.peek(ADDITIONAL_RESERVED_RAM_PORT);
  const additionalReservedRam =
    portData === 'NULL PORT DATA' ? 0 : portData.ram + reservedRam;

  return (
    ns.getServerMaxRam(serverName) -
    ns.getServerUsedRam(serverName) -
    (serverName === HOME_SERVER_NAME ? reservedRam + additionalReservedRam : 0)
  );
}
