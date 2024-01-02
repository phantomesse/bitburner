import { getServers } from 'database/servers';
import { HOME_HOSTNAME, ONE_SECOND } from 'utils/constants';
import { formatTime, formatMoney } from 'utils/format';
import { printTable } from 'utils/table';

const MIN_MONEY_AMOUNT = 1000000;
const HACK_JS = 'hack.js';
const GROW_JS = 'grow.js';
const WEAKEN_JS = 'weaken.js';

/**
 * Manages hacking in all servers, reserving enough RAM in Home server to run
 * all other scripts.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  // Get all servers from database.
  const allServers = getServers(ns);

  while (true) {
    // Get amount of RAM to resolve based on the combination of all scripts in
    // the Home server.
    const ramToReserveInHome = ns
      .ls(HOME_HOSTNAME, '.js')
      .filter(
        filename =>
          !ns.isRunning(filename, HOME_HOSTNAME) ||
          [HACK_JS, GROW_JS, WEAKEN_JS, 'utils.js'].includes(filename)
      )
      .map(filename => ns.getScriptRam(filename))
      .reduce((a, b) => a + b);

    // Get servers to hack, grow, and weaken.
    const serversToHack = getServersToHack(
      ns,
      allServers.map(server => JSON.parse(JSON.stringify(server)))
    );
    const serversToGrow = getServersToGrow(
      ns,
      allServers.map(server => JSON.parse(JSON.stringify(server)))
    );
    const serversToWeaken = getServersToWeaken(
      ns,
      allServers.map(server => JSON.parse(JSON.stringify(server)))
    );

    // Log servers to hack, grow, and weaken.
    logServers(ns, serversToHack, serversToGrow, serversToWeaken);

    // Get all servers that can run scripts.
    const runnableServers = allServers.filter(
      server => ns.hasRootAccess(server.hostname) && server.maxRam > 0
    );

    for (const runnableServer of runnableServers) {
      // Copy over scripts to faciliate hacking, weakening, and growing.
      [HACK_JS, GROW_JS, WEAKEN_JS].forEach(scriptName => {
        if (!ns.fileExists(scriptName, runnableServer.hostname)) {
          ns.scp(scriptName, runnableServer.hostname);
        }
      });

      // Hack.
      if (serversToHack.length > 0) {
        const serverToHack = serversToHack.shift();
        serverToHack.threadsNeeded -= runScript(
          ns,
          HACK_JS,
          runnableServer,
          serverToHack.hostname,
          serverToHack.threadsNeeded,
          ramToReserveInHome
        );
        if (serverToHack.threadsNeeded > 0) serversToHack.unshift(serverToHack);
      }

      // Grow.
      if (serversToGrow.length > 0) {
        const serverToGrow = serversToGrow.shift();
        serverToGrow.threadsNeeded -= runScript(
          ns,
          GROW_JS,
          runnableServer,
          serverToGrow.hostname,
          serverToGrow.threadsNeeded,
          ramToReserveInHome
        );
        if (serverToGrow.threadsNeeded > 0) serversToGrow.unshift(serverToGrow);
      }

      // Weaken.
      if (serversToWeaken.length > 0) {
        const serverToWeaken = serversToWeaken.shift();
        serverToWeaken.threadsNeeded -= runScript(
          ns,
          WEAKEN_JS,
          runnableServer,
          serverToWeaken.hostname,
          serverToWeaken.threadsNeeded,
          ramToReserveInHome
        );
        if (serverToWeaken.threadsNeeded > 0) {
          serversToWeaken.unshift(serverToWeaken);
        }
      }
    }

    await ns.sleep(ONE_SECOND);
  }
}

/**
 * Runs a script on a server with the targetHostname passed as an argument.
 *
 * @param {NS} ns
 * @param {string} scriptName
 * @param {import('database/servers').Server} server
 * @param {string} targetHostname
 * @param {number} maxThreads maximum number of threads to run
 * @param {number} ramToReserveinHome
 * @returns {number} number of threads used
 */
function runScript(
  ns,
  scriptName,
  server,
  targetHostname,
  maxThreads,
  ramToReserveinHome
) {
  const threadsAvailable = Math.floor(
    (server.maxRam - ns.getServerUsedRam(server.hostname)) /
      ns.getScriptRam(scriptName, server.hostname) -
      (server.hostname === HOME_HOSTNAME ? ramToReserveinHome : 0)
  );
  const threads = Math.min(threadsAvailable, maxThreads);
  if (threads <= 0) return 0;
  const pid = ns.exec(scriptName, server.hostname, threads, targetHostname);
  return pid === 0 ? 0 : threads;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server} allServers
 * @returns {import('database/servers').Server[]}
 *          servers that can be hacked sorted from least time to hack to most
 *          adding in a `threadsNeeded` field to indicate the number of threads
 *          needed to hack half the available money
 */
function getServersToHack(ns, allServers) {
  const servers = allServers
    .filter(
      server =>
        ns.hasRootAccess(server.hostname) &&
        server.maxMoney > 0 &&
        ns.getServerMoneyAvailable(server.hostname) >
          Math.min(server.maxMoney / 2, MIN_MONEY_AMOUNT) &&
        ns.hackAnalyzeChance(server.hostname) > 0.7
    )
    .map(server => {
      server.threadsNeeded = Math.floor(
        ns.hackAnalyzeThreads(
          server.hostname,
          ns.getServerMoneyAvailable(server.hostname) / 2
        )
      );
      return server;
    })
    .filter(server => server.threadsNeeded > 0);
  servers.sort((server1, server2) => {
    ns.getHackTime(server1.hostname) - ns.getHackTime(server2.hostname);
  });
  return servers;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server} allServers
 * @returns {import('database/servers').Server[]}
 *          servers that can be grown
 */
function getServersToGrow(ns, allServers) {
  const servers = allServers
    .filter(
      server =>
        ns.hasRootAccess(server.hostname) &&
        server.hackingLevel <= ns.getHackingLevel() &&
        server.maxMoney > 0 &&
        ns.getServerMoneyAvailable(server.hostname) < server.maxMoney
    )
    .map(server => {
      server.threadsNeeded = Math.floor(
        ns.growthAnalyze(
          server.hostname,
          Math.floor(
            server.maxMoney / ns.getServerMoneyAvailable(server.hostname)
          )
        )
      );
      return server;
    })
    .filter(server => server.threadsNeeded > 0);
  servers.sort((server1, server2) => {
    ns.getGrowTime(server1.hostname) - ns.getGrowTime(server2.hostname);
  });
  return servers;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server} allServers
 * @returns {import('database/servers').Server[]}
 *          servers that can be weakened
 */
function getServersToWeaken(ns, allServers) {
  const servers = allServers
    .filter(
      server =>
        ns.hasRootAccess(server.hostname) &&
        server.hackingLevel <= ns.getHackingLevel() &&
        server.maxMoney > 0 &&
        ns.getServerSecurityLevel(server.hostname) > server.minSecurity
    )
    .map(server => {
      const securityToDecrease =
        ns.getServerSecurityLevel(server.hostname) - server.minSecurity;
      let threads = 0;
      do {
        threads++;
      } while (ns.weakenAnalyze(threads) < securityToDecrease);
      server.threadsNeeded = threads;
      return server;
    })
    .filter(server => server.threadsNeeded > 0);
  servers.sort((server1, server2) => {
    ns.getWeakenTime(server1.hostname) - ns.getWeakenTime(server2.hostname);
  });
  return servers;
}

/**
 * Log tables showing servers to hack, grow, and weaken.
 *
 * @param {NS} ns
 * @param {import('database/servers').Server[]} serversToHack
 * @param {import('database/servers').Server[]} serversToGrow
 * @param {import('database/servers').Server[]} serversToWeaken
 */
function logServers(ns, serversToHack, serversToGrow, serversToWeaken) {
  ns.clearLog();

  // Print servers to hack.
  if (serversToHack.length > 0) {
    ns.print('Servers to hack');

    const table = { rows: [] };
    for (const server of serversToHack) {
      const row = {
        cells: [
          {
            column: { name: 'Hostname', style: {} },
            content: server.hostname,
          },
          {
            column: { name: 'Available Money', style: { textAlign: 'right' } },
            content: formatMoney(
              ns,
              ns.getServerMoneyAvailable(server.hostname)
            ),
          },
          {
            column: { name: 'Hack Chance', style: { textAlign: 'right' } },
            content: ns.formatPercent(ns.hackAnalyzeChance(server.hostname)),
          },
          {
            column: { name: 'Hack Time', style: { textAlign: 'center' } },
            content: formatTime(ns, ns.getHackTime(server.hostname)),
          },
          {
            column: { name: 'Threads Needed', style: { textAlign: 'right' } },
            content: server.threadsNeeded,
          },
        ],
      };
      table.rows.push(row);
    }
    printTable(ns, table);

    ns.print(' ');
  }

  // Print servers to grow.
  if (serversToGrow.length > 0) {
    ns.print('Servers to grow');

    const table = { rows: [] };
    for (const server of serversToGrow) {
      const row = {
        cells: [
          {
            column: { name: 'Hostname', style: {} },
            content: server.hostname,
          },
          {
            column: { name: 'Available Money', style: { textAlign: 'right' } },
            content: formatMoney(
              ns,
              ns.getServerMoneyAvailable(server.hostname)
            ),
          },
          {
            column: { name: 'Max Money', style: { textAlign: 'right' } },
            content: formatMoney(ns, server.maxMoney),
          },
          {
            column: { name: 'Grow Time', style: { textAlign: 'center' } },
            content: formatTime(ns, ns.getGrowTime(server.hostname)),
          },
          {
            column: { name: 'Threads Needed', style: { textAlign: 'right' } },
            content: server.threadsNeeded,
          },
        ],
      };
      table.rows.push(row);
    }
    printTable(ns, table);

    ns.print(' ');
  }

  // Print servers to weaken.
  if (serversToWeaken.length > 0) {
    ns.print('Servers to weaken');

    const table = { rows: [] };
    for (const server of serversToWeaken) {
      const row = {
        cells: [
          {
            column: { name: 'Hostname', style: {} },
            content: server.hostname,
          },
          {
            column: { name: 'Current Security', style: { textAlign: 'right' } },
            content: ns.formatNumber(
              ns.getServerSecurityLevel(server.hostname)
            ),
          },
          {
            column: { name: 'Min Security', style: { textAlign: 'right' } },
            content: ns.formatNumber(server.minSecurity, 0),
          },
          {
            column: { name: 'Base Security', style: { textAlign: 'right' } },
            content: ns.formatNumber(server.baseSecurity, 0),
          },
          {
            column: { name: 'Hack Chance', style: { textAlign: 'right' } },
            content: ns.formatPercent(ns.hackAnalyzeChance(server.hostname)),
          },
          {
            column: { name: 'Weaken Time', style: { textAlign: 'center' } },
            content: formatTime(ns, ns.getWeakenTime(server.hostname)),
          },
          {
            column: { name: 'Threads Needed', style: { textAlign: 'right' } },
            content: server.threadsNeeded,
          },
        ],
      };
      table.rows.push(row);
    }
    printTable(ns, table);

    ns.print(' ');
  }
}
