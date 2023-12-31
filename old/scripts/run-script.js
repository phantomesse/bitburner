import { getFreeRam, HOME_SERVER_NAME } from '/utils/servers.js';

/**
 * Runs a script when we have enough RAM to do so.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  const scriptName = /** @type {string} */ (ns.args[0]);
  const args = ns.args.slice(1);
  const scriptRam = ns.getScriptRam(scriptName);

  while (true) {
    const freeRam = getFreeRam(ns, HOME_SERVER_NAME);
    if (freeRam > scriptRam) {
      ns.exec(scriptName, HOME_SERVER_NAME, 1, ...args);
      return;
    }
    await ns.sleep(1000);
  }
}

/**
 * @param {Object} data
 * @returns {string[]}
 */
export const autcomplete = data => [...data.scripts];
