import { PURCHASE_SERVER_JS, UPGRADE_SERVER_JS } from 'utils/script';
import { getAllServerNames, isOwned } from 'utils/server';

/**
 * Manages purchasing and upgrading owned servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.clearLog();

  while (true) {
    // Attempt to purchase a new server.
    ns.run(PURCHASE_SERVER_JS);

    const ownedServerNames = getAllServerNames(ns).filter(isOwned);
    for (const serverName of ownedServerNames) {
      // Attempt to upgrade existing purchased servers.
      ns.run(UPGRADE_SERVER_JS, {}, serverName);
    }

    await ns.sleep(1000);
  }
}
