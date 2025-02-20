import { getMoneyAvailableToSpend } from 'utils/money';
import { getAllServerNames, PURCHASED_SERVER_PREFIX } from 'utils/server';

/**
 * Continuously attemps to upgrade purchased servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    const purchasedServerNames = getAllServerNames(ns).filter((serverName) =>
      serverName.startsWith(PURCHASED_SERVER_PREFIX)
    );

    for (const serverName of purchasedServerNames) {
      const currentRam = ns.getServerMaxRam(serverName);

      for (let i = 20; i >= 2; i--) {
        const ram = Math.pow(2, i);
        if (ram <= currentRam) break;

        if (
          ns.getPurchasedServerUpgradeCost(serverName, ram) >=
          getMoneyAvailableToSpend(ns)
        ) {
          continue;
        }

        const success = ns.upgradePurchasedServer(serverName, ram);
        if (success) {
          const oldRam = ns.formatRam(currentRam, 0);
          const upgradedRam = ns.formatRam(ram, 0);
          ns.toast(`upgraded ${serverName} from ${oldRam} to ${upgradedRam}`);
        }
      }
    }

    await ns.sleep(1000);
  }
}
