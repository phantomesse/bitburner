import { PURCHASE_SERVER_JS, UPGRADE_SERVER_JS } from 'utils/script';
import {
  getAllServerNames,
  isPurchased,
  PURCHASED_SERVER_PREFIX,
} from 'utils/server';

/**
 * Manages purchasing and upgrading owned servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('scan');
  ns.clearLog();

  while (true) {
    const purchasedServerNames = getAllServerNames(ns).filter((serverName) =>
      serverName.startsWith(PURCHASED_SERVER_PREFIX)
    );

    // Attempt to purchase a new server.
    if (purchasedServerNames.length < ns.getPurchasedServerLimit()) {
      ns.run(PURCHASE_SERVER_JS);
    }

    for (const serverName of purchasedServerNames) {
      // Attempt to upgrade existing purchased servers.
      ns.run(UPGRADE_SERVER_JS, {}, serverName);
    }

    await ns.sleep(1000);
  }
}
