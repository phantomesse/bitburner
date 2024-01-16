import { getServers, updateServers } from 'database/servers';
import {
  HOME_HOSTNAME,
  MAX_PURCHASED_SERVER_COUNT,
  ONE_SECOND,
} from 'utils/constants';
import { formatMoney } from 'utils/format';

const MAX_RAM_POWER = 20;

/**
 * Manages purchasing and upgrading servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  const purchasedHostnames = getServers(ns)
    .filter(server => server.isPurchased)
    .map(server => server.hostname);

  while (true) {
    const moneyAvailable = ns.getServerMoneyAvailable(HOME_HOSTNAME);

    for (let power = MAX_RAM_POWER; power > 1; power--) {
      const ram = Math.pow(2, power);

      // Attempt to purchase a server.
      if (purchasedHostnames.length < MAX_PURCHASED_SERVER_COUNT) {
        const cost = ns.getPurchasedServerCost(ram);
        if (cost <= moneyAvailable) {
          const hostname = ns.purchaseServer('lauren', ram);
          if (hostname.length > 0) {
            purchasedHostnames.push(hostname);
            updateServers(ns, {
              hostname: hostname,
              organization: '',
              path: [hostname],
              isPurchased: true,
              maxRam: ram,
              maxMoney: 0,
              minSecurity: 0,
              baseSecurity: 0,
              hackingLevel: 0,
            });
            ns.toast(
              `Purchased ${hostname} (${ns.formatRam(
                ram,
                0
              )}) for ${formatMoney(ns, cost)}`
            );
          }
        }
      }

      // Attempt to upgrade an existing server.
      for (const hostname of purchasedHostnames) {
        const currentRam = ns.getServerMaxRam(hostname);
        if (ram <= currentRam) continue;
        const cost = ns.getPurchasedServerUpgradeCost(hostname, ram);
        const upgradeSuccessful = ns.upgradePurchasedServer(hostname, ram);
        if (upgradeSuccessful) {
          updateServers(ns, {
            hostname: hostname,
            maxRam: ram,
          });
          ns.toast(
            `Upgraded ${hostname} from ${ns.formatRam(
              currentRam,
              0
            )} to ${ns.formatRam(ram, 0)} for ${formatMoney(ns, cost)}`
          );
        }
      }
    }

    await ns.sleep(ONE_SECOND);
  }
}
