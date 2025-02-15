import { getMoneyAvailableToSpend } from 'utils/money';
import { PURCHASED_SERVER_PREFIX } from 'utils/server';

/**
 * Attempts to purchase the largest server possible.
 *
 * @param {NS} ns
 */
export async function main(ns) {
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
}
