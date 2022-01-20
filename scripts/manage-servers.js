import { MANAGE_SERVERS_TO_MANAGE_HACKING_PORT } from '/utils/ports.js';
import { getMoneyToSpend, sort } from '/utils/misc.js';
import { PURCHASED_SERVER_PREFIX } from '/utils/servers.js';
import { formatNumber } from '/utils/format.js';

const MIN_POWER = 3; // Min RAM that we want is at least 8GB
const MAX_POWER = 20; // Max RAM is 2^20

/**
 * Continuously try to buy more servers and sells any old servers with less RAM
 * than we could get with a new server.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  const purchasedServerLimit = ns.getPurchasedServerLimit();
  let lowestRamAcceptable = Math.pow(2, MIN_POWER);

  while (true) {
    // Buy / upgrade servers.
    for (let power = MAX_POWER; power >= MIN_POWER; power--) {
      const ram = Math.pow(2, power);
      if (ram < lowestRamAcceptable) continue;
      const cost = ns.getPurchasedServerCost(ram);
      if (getMoneyToSpend(ns) < cost) continue;

      // Delete lowest RAM server if over server limit.
      if (getPurchasedServerNames(ns).length === purchasedServerLimit) {
        const lowestRamServerName = getLowestRamPurchasedServer(ns);
        const lowestRam = ns.getServerMaxRam(lowestRamServerName);
        if (ram <= lowestRam) continue;
        ns.killall(lowestRamServerName);
        if (ns.deleteServer(lowestRamServerName)) {
          ns.toast(
            `deleted server ${lowestRamServerName} which had ${lowestRam}GB RAM`
          );
          await ns.writePort(
            MANAGE_SERVERS_TO_MANAGE_HACKING_PORT,
            JSON.stringify({ remove: lowestRamServerName })
          );
        }
      }

      // Buy server.
      const server = ns.purchaseServer(PURCHASED_SERVER_PREFIX, ram);
      if (server !== '') {
        ns.toast(`bought server (${server}) with ${formatNumber(ram)}GB RAM`);
        await ns.writePort(
          MANAGE_SERVERS_TO_MANAGE_HACKING_PORT,
          JSON.stringify({ add: server })
        );

        // Update lowest RAM acceptable.
        if (getPurchasedServerNames(ns).length === purchasedServerLimit) {
          const lowestRamServerName = getLowestRamPurchasedServer(ns);
          const lowestRam = ns.getServerMaxRam(lowestRamServerName);
          if (lowestRam > lowestRamAcceptable) {
            lowestRamAcceptable = lowestRam;
            ns.toast(`now only buying servers >= ${lowestRamAcceptable}GB RAM`);
          }
        }
      }
    }

    // Wait 30 seconds before buying another server.
    await ns.sleep(1000 * 30);
  }
}

function getPurchasedServerNames(ns) {
  return ns
    .scan()
    .filter(serverName => serverName.startsWith(PURCHASED_SERVER_PREFIX));
}

/** @param {import('index').NS} ns */
function getLowestRamPurchasedServer(ns) {
  const purchasedServerNames = getPurchasedServerNames(ns);
  sort(purchasedServerNames, ns.getServerMaxRam);
  return purchasedServerNames[0];
}
