import { getServers } from 'database/servers';
import { getPath } from 'utils';

/**
 * Manages contracts.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const servers = getServers(ns);
  for (const server of servers) {
    const contracts = ns.ls(server.hostname, '.cct');
    for (const contract of contracts) {
      ns.tprint(ns.codingcontract.getContractType(contract, server.hostname));
      ns.tprintf(
        'home; ' +
          getPath(ns, server.hostname)
            .map(hostname => `connect ${hostname};`)
            .join(' ') +
          ` run ${contract}`
      );
    }
  }
}
