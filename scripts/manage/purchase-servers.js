import { getMoneyAvailableToSpend } from 'utils/money';
import { getAllServerNames, PURCHASED_SERVER_PREFIX } from 'utils/server';

/**
 * Attempts to purchase the largest server possible until we've reached the max
 * number of servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    // Do not exceed the max number of purchased servers.
    const purchasedServerCount = getAllServerNames(ns).filter((serverName) =>
      serverName.startsWith(PURCHASED_SERVER_PREFIX)
    ).length;
    if (purchasedServerCount === ns.getPurchasedServerLimit()) return;

    // Attempt to purchase the largest server possible within our budget.
    for (let i = 20; i >= 2; i--) {
      const ram = Math.pow(2, i);
      if (ns.getPurchasedServerCost(ram) > getMoneyAvailableToSpend(ns)) {
        continue;
      }
      const serverName = ns.purchaseServer(PURCHASED_SERVER_PREFIX, ram);
      if (serverName) {
        ns.toast(`purchased ${serverName} (${ns.formatRam(ram, 0)})`);
        return;
      }
    }

    await ns.sleep(1000);
  }
}
