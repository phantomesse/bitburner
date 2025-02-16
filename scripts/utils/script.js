import { HOME_SERVER_NAME } from 'utils/server';

export const HACK_JS = 'hack.js';
export const GROW_JS = 'grow.js';
export const WEAKEN_JS = 'weaken.js';
export const QUEUE_SCRIPT_JS = 'queue-script.js';

export const ADDITIONAL_RESERVED_RAM_PORT = 123;

// const HOME_RESERVED_RAM = 2.9;
const HOME_RESERVED_RAM = 24;

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
  const portData = ns.peek(ADDITIONAL_RESERVED_RAM_PORT);
  const additionalReservedRam =
    portData === 'NULL PORT DATA' ? 0 : portData.ram;

  return (
    ns.getServerMaxRam(serverName) -
    ns.getServerUsedRam(serverName) -
    (serverName === HOME_SERVER_NAME
      ? HOME_RESERVED_RAM + additionalReservedRam
      : 0)
  );
}
