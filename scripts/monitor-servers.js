import { getServers } from 'database/servers';
import { createReactElement } from 'utils';
import { formatTime } from 'utils/format';
import { printTable } from 'utils/table';
import { ONE_SECOND } from 'utils/constants';

/**
 * Monitors all servers that can run scripts in the --tail.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  ns.resizeTail(750, 1000);
  ns.moveTail(800, 50);
  ns.atExit(() => ns.closeTail());

  while (true) {
    const servers = getServers(ns).filter(
      server => ns.hasRootAccess(server.hostname) && server.maxRam > 0
    );
    servers.sort(
      (server1, server2) =>
        ns.getServerUsedRam(server2.hostname) -
        ns.getServerUsedRam(server1.hostname)
    );

    /** @type {import('utils/table').Table} */ const table = { rows: [] };
    for (const server of servers) {
      const usedRam = ns.getServerUsedRam(server.hostname);

      /** @type {import('utils/table').Row} */ const row = {
        cells: [
          {
            column: { name: 'Hostname', style: { width: 'max-content' } },
            content: server.hostname,
          },
          {
            column: {
              name: 'Used Ram',
              style: { textAlign: 'right', width: 'max-content' },
            },
            content: ns.formatRam(usedRam, 0),
            style: { color: usedRam === 0 ? ns.ui.getTheme().error : '' },
          },
          {
            column: {
              name: 'Max Ram',
              style: { textAlign: 'right', width: 'max-content' },
            },
            content: ns.formatRam(server.maxRam, 0),
          },
          {
            column: { name: 'Running Scripts', style: {} },
            content: getRunningScripts(ns, server.hostname),
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
 * @returns {import('../NetscriptDefinitions').ReactElement}
 */
function getRunningScripts(ns, hostname) {
  const elements = ns.ps(hostname).map(process => {
    const style = {};
    let message =
      process.filename +
      (process.args.length > 0 ? ' ' + process.args.join(' ') : '') +
      ` (${process.threads.toLocaleString()})`;

    if (['hack.js', 'grow.js', 'weaken.js'].includes(process.filename)) {
      const script = ns.getRunningScript(process.pid, hostname);
      const totalTimeMessage = script.logs[0]
        .replace(
          `${process.filename.replace('.js', '')}: Executing on '${
            process.args[0]
          }' in `,
          ''
        )
        .split(' (')[0];
      const minutes =
        totalTimeMessage.indexOf('minute') > 0
          ? parseInt(totalTimeMessage.split(' minute')[0])
          : 0;
      const seconds = parseFloat(totalTimeMessage.split(' ').splice(-2, 1));
      const secondsLeft = Math.ceil(
        minutes * 60 + seconds - script.onlineRunningTime
      );
      message += ` - ${formatTime(ns, secondsLeft * 1000)} left`;
      style.color = {
        'hack.js': ns.ui.getTheme().error,
        'grow.js': ns.ui.getTheme().success,
        'weaken.js': ns.ui.getTheme().warning,
      }[process.filename];
    }

    return createReactElement(message, style);
  });
  return React.createElement('div', {}, ...elements);
}
