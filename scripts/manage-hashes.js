import { UPDATE_SERVERS_SCRIPT, queueScript } from 'utils/scripts';
import { getAllServers } from 'utils/servers';
import { ONE_SECOND } from 'utils/time';

/**
 * Sell hacknet hashes.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    const hackingLevel = ns.getHackingLevel();
    const servers = getAllServers(ns).filter(
      server =>
        server.hasRootAccess &&
        server.hackingLevel <= hackingLevel &&
        server.maxMoney > 0
    );

    // Spend hashes on reducing min security.
    const serversToReduceMinSecurity = servers
      .filter(server => server.minSecurity > 1)
      .sort((server1, server2) => server2.minSecurity - server1.minSecurity);
    for (const server of serversToReduceMinSecurity) {
      const wasSuccessful = ns.hacknet.spendHashes(
        'Reduce Minimum Security',
        server.hostname
      );
      if (wasSuccessful) {
        queueScript(ns, UPDATE_SERVERS_SCRIPT);
        ns.toast(
          `Reduced min security of ${server.hostname} from ${
            server.minSecurity
          } to ${ns.getServerMinSecurityLevel(server.hostname)}`,
          'success'
        );
      }
    }

    // Spend hashes on increasing maximum money.
    const serversToIncreaseMaxMoney = servers.sort(
      (server1, server2) => server1.maxMoney - server2.maxMoney
    );
    for (const server of serversToIncreaseMaxMoney) {
      const wasSuccessful = ns.hacknet.spendHashes(
        'Increase Maximum Money',
        server.hostname
      );
      if (wasSuccessful) {
        queueScript(ns, UPDATE_SERVERS_SCRIPT);
        ns.toast(
          `Increased max money of ${server.hostname} from ${
            server.maxMoney
          } to ${ns.getServerMaxMoney(server.hostname)}`,
          'success'
        );
      }
    }

    // Sell hashes for money.
    while (ns.hacknet.numHashes > ns.hacknet.hashCapacity / 2) {
      ns.hacknet.spendHashes('Sell for Money');
    }

    await ns.sleep(ONE_SECOND);
  }
}
