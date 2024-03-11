import { getServers, updateServers } from 'database/servers';
import { ONE_SECOND } from 'utils/constants';

/**
 * Selling hashes.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    const hackableServers = getServers(ns)
      .filter(
        server =>
          !server.isPurchased &&
          ns.hasRootAccess(server.hostname) &&
          server.maxMoney > 0
      )
      .map(server => ({
        hostname: server.hostname,
        minSecurityLevel: ns.getServerMinSecurityLevel(server.hostname),
        maxMoney: ns.getServerMaxMoney(server.hostname),
      }))
      .filter(server => server.minSecurityLevel > 1)
      .sort(
        (server1, server2) =>
          server2.minSecurityLevel - server1.minSecurityLevel
      );
    for (const server of hackableServers) {
      const isSuccessful = ns.hacknet.spendHashes(
        'Reduce Minimum Security',
        server.hostname
      );
      if (isSuccessful) {
        const newMinSecurity = ns.getServerMinSecurityLevel(server.hostname);
        ns.toast(
          `Reduced security level on ${server.hostname} from ${server.minSecurityLevel} to ${newMinSecurity}`
        );
        updateServers(ns, {
          hostname: server.hostname,
          minSecurity: newMinSecurity,
        });
      }
    }

    ns.hacknet.spendHashes('Sell for Money');
    await ns.sleep(ONE_SECOND / 2);
  }
}
