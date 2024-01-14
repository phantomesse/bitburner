import { HOME_HOSTNAME } from 'utils/constants';

export const HACK_JS = 'hack.js';
export const GROW_JS = 'grow.js';
export const WEAKEN_JS = 'weaken.js';
const UTILS_JS = 'utils.js';
const INIT_JS = 'init.js';

/**
 * @param {NS} ns
 * @returns {string[]} list of scripts to count towards how much RAM to reserve
 *          so we can run any script
 */
export function getScriptsCountedTowardsRAMToReserve(ns) {
  const runningScripts = ns.ps(HOME_HOSTNAME).map(process => process.filename);
  const scripts = ns
    .ls(HOME_HOSTNAME, '.js')
    .filter(
      script =>
        ![HACK_JS, GROW_JS, WEAKEN_JS, UTILS_JS, INIT_JS].includes(script)
    )
    .filter(script => !script.includes('/'))
    .filter(script => !runningScripts.includes(script));
  return scripts;
}

/**
 * @param {NS} ns
 * @returns {number} amount of RAM to reserve so that we can run any script
 */
export function getRamToReserve(ns) {
  return Math.max(
    ...getScriptsCountedTowardsRAMToReserve(ns).map(script =>
      ns.getScriptRam(script)
    )
  );
}
