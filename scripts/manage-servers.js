import { UPDATE_SERVERS_SCRIPT, queueScript } from 'utils/scripts';
import { PURCHASED_SERVER_PREFIX, getAllServers } from 'utils/servers';
import { ONE_SECOND } from 'utils/time';

const MAX_RAM_EXPONENT = 20;

/**
 * Buy & upgrade servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    // Purchase new servers.
    for (let i = MAX_RAM_EXPONENT; i > 0; i--) {
      const ram = Math.pow(2, i);
      try {
        const serverName = ns.purchaseServer(PURCHASED_SERVER_PREFIX, ram);

        // If here, then purchasing the server was successful.
        if (serverName) {
          queueScript(ns, UPDATE_SERVERS_SCRIPT);
          ns.toast(
            `Purchased ${serverName} with ${ns.formatRam(ram, 0)}`,
            'success'
          );
        }
      } catch (_) {}
    }

    // Upgrade servers.
    const purchasedServers = getAllServers(ns).filter(server =>
      server.hostname.startsWith(PURCHASED_SERVER_PREFIX)
    );
    for (const server of purchasedServers) {
      const currentExp = Math.log2(server.maxRam);
      for (let i = MAX_RAM_EXPONENT; i > currentExp; i--) {
        const ram = Math.pow(2, i);
        const wasSuccessful = ns.upgradePurchasedServer(server.hostname, ram);
        if (wasSuccessful) {
          queueScript(ns, UPDATE_SERVERS_SCRIPT);
          ns.toast(
            `Upgraded ${serverName} to ${ns.formatRam(ram, 0)}`,
            'success'
          );
        }
      }
    }

    await ns.sleep(ONE_SECOND);
  }
}
