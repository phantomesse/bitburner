import { getServers } from 'database/servers';
import { printTable } from 'utils/table';
import { formatMoney, formatTime } from 'utils/format';
import { ONE_SECOND } from 'utils/constants';

/**
 * Monitors all servers that can be hacked in the --tail.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  ns.resizeTail(750, 1000);
  ns.moveTail(200, 50);
  ns.atExit(() => ns.closeTail());

  const allServers = getServers(ns).filter(server => server.maxMoney > 0);
  const hackColor = ns.ui.getTheme().error;
  const growColor = ns.ui.getTheme().success;
  const weakenColor = ns.ui.getTheme().warning;

  while (true) {
    const servers = allServers.filter(
      server =>
        ns.hasRootAccess(server.hostname) &&
        ns.getHackingLevel() >= server.hackingLevel
    );
    servers.sort(
      (server1, server2) =>
        ns.hackAnalyzeChance(server2.hostname) -
        ns.hackAnalyzeChance(server1.hostname)
    );

    /** @type {import('utils/table').Table} */ const table = { rows: [] };
    for (const server of servers) {
      /** @type {import('utils/table').Row} */ const row = {
        cells: [
          {
            column: { name: 'Hostname', style: { width: 'max-content' } },
            content: server.hostname,
          },
          {
            column: {
              name: 'Hack Chance',
              style: { textAlign: 'right', color: hackColor },
            },
            content: ns.formatPercent(ns.hackAnalyzeChance(server.hostname)),
          },
          {
            column: {
              name: 'Hack Time',
              style: { textAlign: 'center', color: hackColor },
            },
            content: formatTime(ns, ns.getHackTime(server.hostname)),
          },
          {
            column: {
              name: 'Available Money',
              style: { textAlign: 'right', color: growColor },
            },
            content: formatMoney(
              ns,
              ns.getServerMoneyAvailable(server.hostname)
            ),
          },
          {
            column: {
              name: 'Max Money',
              style: { textAlign: 'right', color: growColor },
            },
            content: formatMoney(ns, server.maxMoney),
          },
          {
            column: {
              name: 'Current Security',
              style: { textAlign: 'right', color: weakenColor },
            },
            content: ns.formatNumber(
              ns.getServerSecurityLevel(server.hostname)
            ),
          },
          {
            column: {
              name: 'Min Security',
              style: { textAlign: 'right', color: weakenColor },
            },
            content: ns.formatNumber(server.minSecurity, 0),
          },
          {
            column: {
              name: 'Base Security',
              style: { textAlign: 'right', color: weakenColor },
            },
            content: ns.formatNumber(server.baseSecurity, 0),
          },
          {
            column: {
              name: 'Weaken Time',
              style: { textAlign: 'center', color: weakenColor },
            },
            content: formatTime(ns, ns.getWeakenTime(server.hostname)),
          },
        ],
      };
      table.rows.push(row);
    }

    ns.clearLog();
    printTable(ns, table);
    await ns.sleep(ONE_SECOND);
  }
}
