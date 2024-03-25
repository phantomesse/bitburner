import { getAllServers } from 'utils/servers';
import { printTable } from 'utils/table';
import { ONE_SECOND } from 'utils/time';

/**
 * Monitors the RAM usage of all servers in the tail logs.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  ns.atExit(() => ns.closeTail());

  while (true) {
    const servers = getAllServers(ns)
      .filter(server => server.hasRootAccess && server.maxRam > 0)
      .sort((server1, server2) => server2.maxRam - server1.maxRam);

    /** @type {import("utils/table").Table} */ const table = { rows: [] };
    for (const server of servers) {
      /** @type {import('utils/table').Row} */ const row = {
        cells: [
          {
            column: { name: 'Hostname' },
            content: server.hostname,
          },
          {
            column: { name: 'Available RAM' },
            content: `${ns.formatRam(
              server.maxRam - ns.getServerUsedRam(server.hostname),
              0
            )} / ${ns.formatRam(server.maxRam, 0)}`,
          },
        ],
      };
      table.rows.push(row);
    }
    ns.clearLog();
    printTable(ns, table);

    await ns.sleep(ONE_SECOND / 2);
  }
}
