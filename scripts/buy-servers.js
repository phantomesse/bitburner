const DISABLE_LOGGING_FUNCTIONS = ['getServerMaxRam', 'sleep'];

const MIN_POWER = 3; // Min RAM that we want is at least 8GB
const MAX_POWER = 20; // Max RAM is 2^20
const HOSTNAME = 'lauren';

/**
 * Continuously try to buy more scripts from the dark web and servers.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);
  const purchasedServerLimit = ns.getPurchasedServerLimit();
  let lowestRamAcceptable = Math.pow(2, MIN_POWER);

  while (true) {
    for (let power = MAX_POWER; power >= MIN_POWER; power--) {
      const ram = Math.pow(2, power);
      if (ram < lowestRamAcceptable) continue;
      const cost = ns.getPurchasedServerCost(ram);
      if (ns.getPlayer().money < cost) continue;

      // Delete lowest RAM server if over server limit.
      if (ns.getPurchasedServers().length === purchasedServerLimit) {
        const lowestRamServerName = getLowestRamPurchasedServer(ns);
        const lowestRam = ns.getServerMaxRam(lowestRamServerName);
        if (ram === lowestRam) continue;
        ns.killall(lowestRamServerName);
        if (ns.deleteServer(lowestRamServerName)) {
          ns.tprint(
            `deleted server ${lowestRamServerName} which had ${lowestRam}GB RAM`
          );
        }
      }

      // Buy server.
      const server = ns.purchaseServer(HOSTNAME, ram);
      if (server !== '') {
        ns.tprint(`bought server (${server}) with ${ram}GB RAM`);

        // Update lowest RAM acceptable.
        if (ns.getPurchasedServers().length === purchasedServerLimit) {
          const lowestRamServerName = getLowestRamPurchasedServer(ns);
          const lowestRam = ns.getServerMaxRam(lowestRamServerName);
          if (lowestRam !== lowestRamAcceptable) {
            lowestRamAcceptable = lowestRam;
            ns.tprint(
              `now only buying servers >= ${lowestRamAcceptable}GB RAM`
            );
          }
        }
      }
    }

    // Wait 1 minute before buying another server.
    await ns.sleep(1000 * 60);
  }
}
/** @param {import('..').NS } ns */
function getLowestRamPurchasedServer(ns) {
  const purchasedServerNames = ns.getPurchasedServers();
  purchasedServerNames.sort((serverName1, serverName2) => {
    return ns.getServerMaxRam(serverName1) - ns.getServerMaxRam(serverName2);
  });
  return purchasedServerNames[0];
}
