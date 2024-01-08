import { getServers } from 'database/servers';
import { createReactElement } from 'utils/dom';
import { formatTime } from 'utils/format';
import { printTable } from 'utils/table';
import { ONE_SECOND } from 'utils/constants';
import { createColorForString } from 'utils/colors';

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
    const allServers = getServers(ns);
    const hostnameToColor = {};
    for (const server of allServers) {
      hostnameToColor[server.hostname] = createColorForString(
        ns,
        server.hostname
      );
    }

    const servers = allServers.filter(
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
            content: createReactElement(server.hostname, {
              color: hostnameToColor[server.hostname],
            }),
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
            content: getRunningScripts(ns, server.hostname, hostnameToColor),
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
 * @param {Object.<string, string>} hostnameToColor
 * @returns {import('../NetscriptDefinitions').ReactElement}
 */
function getRunningScripts(ns, hostname, hostnameToColor) {
  const elements = ns.ps(hostname).map(process => {
    const style = {};
    const message = [createReactElement(process.filename, {}, 'span')];

    for (const args of process.args) {
      message.push(
        createReactElement(
          ` ${args}`,
          {
            color: args in hostnameToColor ? hostnameToColor[args] : 'inherit',
          },
          'span'
        )
      );
    }

    message.push(
      createReactElement(` (${process.threads.toLocaleString()})`, {}, 'span')
    );

    if (['hack.js', 'grow.js', 'weaken.js'].includes(process.filename)) {
      const script = ns.getRunningScript(process.pid, hostname);
      const totalTimeMessage = script.logs[0]
        .match(/ in .* \(/)[0]
        .replace(' in ', '')
        .replace(' (', '');
      const totalSeconds = totalTimeMessage
        .match(/[0-9.]+ [a-z]+/g)
        .map(timePart => {
          const number = parseFloat(timePart.split(' ')[0]);
          if (timePart.includes('hour')) return number * 60 * 60;
          if (timePart.includes('minute')) return number * 60;
          if (timePart.includes('second')) return number;
          return number;
        })
        .reduce((a, b) => a + b);
      message.push(
        createReactElement(
          ` - ${formatTime(
            ns,
            (totalSeconds - script.onlineRunningTime) * 1000
          )} left`,
          {},
          'span'
        )
      );
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
