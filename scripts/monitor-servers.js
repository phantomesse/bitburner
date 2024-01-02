import { getServers } from 'database/servers';
import { ONE_SECOND } from 'utils';
import { printTable } from 'utils/table';

/**
 * Monitors all servers that can run scripts in the --tail.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  while (true) {
    const rootAccessServers = getServers(ns).filter(server =>
      ns.hasRootAccess(server.hostname)
    );
    const servers = rootAccessServers.filter(server => server.maxRam > 0);

    /** @type {import('utils/table').Table} */ const table = { rows: [] };
    for (const server of servers) {
      /** @type {import('utils/table').Row} */ const row = {
        cells: [
          {
            column: { name: 'Hostname', style: {} },
            content: server.hostname,
          },
          {
            column: { name: 'Used Ram', style: { textAlign: 'right' } },
            content: ns.formatRam(ns.getServerUsedRam(server.hostname), 2),
          },
          {
            column: { name: 'Max Ram', style: { textAlign: 'right' } },
            content: ns.formatRam(server.maxRam, 2),
          },
          {
            column: { name: 'Running Scripts', style: {} },
            content: getRunningScripts(
              ns,
              server.hostname,
              rootAccessServers.map(server => server.hostname)
            ),
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

/**
 * Returns a ReactElement showing the scripts that are running on a given
 * hostname.
 *
 * @param {NS} ns
 * @param {string} hostname
 * @param {string[]} rootAccessHostnames
 * @returns {import('../NetscriptDefinitions').ReactElement}
 */
function getRunningScripts(ns, hostname, rootAccessHostnames) {
  const scriptNames = ns.ls(hostname, '.js');

  const runningScripts = [];
  for (const scriptName of scriptNames) {
    if (['hack.js', 'grow.js', 'weaken.js'].includes(scriptName)) {
      for (const rootAccessHostname of rootAccessHostnames) {
        const script = ns.getRunningScript(
          scriptName,
          hostname,
          rootAccessHostname
        );
        if (script) {
          runningScripts.push(
            `${script.filename} ${script.args.join(' ')} (${script.threads})`
          );
        }
      }
    } else {
      const script = ns.getRunningScript(scriptName, hostname);
      if (script) runningScripts.push(script.filename);
    }
  }

  return runningScripts.join('\n');
}
