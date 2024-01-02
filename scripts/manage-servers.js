import { getServers, updateServers } from 'database/servers';
import { HOME_HOSTNAME, ONE_MINUTE } from 'utils';

const MAX_RAM_POWER = 20;

/**
 * Manages purchasing and upgrading servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const purchasedHostnames = getServers(ns)
    .filter(server => server.isPurchased)
    .map(server => server.hostname);

  while (true) {
    const moneyAvailable = ns.getServerMoneyAvailable(HOME_HOSTNAME);

    for (let power = MAX_RAM_POWER; power > 1; power--) {
      // Attempt to purchase a server.
      const ram = Math.pow(2, power);
      if (ns.getPurchasedServerCost(ram) <= moneyAvailable) {
        const hostname = ns.purchaseServer('lauren', ram);
        if (hostname.length > 0) {
          purchasedHostnames.push(hostname);
          updateServers(ns, {
            hostname: hostname,
            isPurchased: true,
            maxRam: ram,
            maxMoney: 0,
            minSecurity: 0,
            baseSecurity: 0,
            hackingLevel: 0,
          });
          ns.scriptKill('manage-hacking.js', HOME_HOSTNAME);
          ns.run('manage-hacking.js');
        }
      }

      // Attempt to upgrade an existing server.
      for (const hostname of purchasedHostnames) {
        if (ram <= ns.getServerMaxRam(hostname)) continue;
        const upgradeSuccssful = ns.upgradePurchasedServer(hostname, ram);
        if (upgradeSuccssful) {
          updateServers(ns, {
            hostname: hostname,
            maxRam: ram,
          });
          ns.scriptKill('manage-hacking.js', HOME_HOSTNAME);
          ns.run('manage-hacking.js');
        }
      }
    }

    await ns.sleep(ONE_MINUTE);
  }
}
