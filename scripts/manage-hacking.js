import { getAllServers } from 'utils/servers';

/**
 * Distribute hack/grow/weaken across all servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const serversWithRootAccess = getAllServers(ns).filter(
    server => server.hasRootAccess
  );

  ns.tprint(servers);
}
