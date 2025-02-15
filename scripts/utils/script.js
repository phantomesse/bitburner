export const HACK_JS = 'hack.js';
export const GROW_JS = 'grow.js';
export const WEAKEN_JS = 'weaken.js';

export const NUKE_JS = 'nuke.js';

export const PURCHASE_SERVER_JS = 'purchase-server.js';
export const UPGRADE_SERVER_JS = 'upgrade-server.js';

export const RESERVED_RAM = 4;

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
  return (
    ns.getServerMaxRam(serverName) -
    ns.getServerUsedRam(serverName) -
    RESERVED_RAM
  );
}
