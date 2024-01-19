import { getServers } from 'database/servers';
import { createColorForString } from 'utils/colors';
import { HOME_HOSTNAME, ONE_SECOND } from 'utils/constants';
import { createReactElement } from 'utils/dom';
import { formatMoney, formatTime } from 'utils/format';
import { GROW_JS, HACK_JS, WEAKEN_JS, getRamToReserve } from 'utils/scripts';
import { printTable } from 'utils/table';

/** Minimum amount of money on a server to allow hacking that server. */
const MIN_MONEY_AMOUNT = 1000000;

/** Minimum percentage of max money on a server to allow hacking that server. */
const MIN_MONEY_PERCENT = 0.5;

const MIN_HACK_CHANCE = 0.5;

/**
 * Manages hacking in all servers, reserving enough RAM in Home server to run
 * all other scripts.
 *
 * Override the RAM to reserve by passing as an argument.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.atExit(() => ns.closeTail());

  const hackWeakenGrowScripts = [HACK_JS, WEAKEN_JS, GROW_JS];
  const minRamNecessaryToRunHackWeakenGrow = Math.min(
    ...hackWeakenGrowScripts.map(script => ns.getScriptRam(script))
  );

  while (true) {
    const serversWithRootAccess = getServers(ns).filter(server =>
      ns.hasRootAccess(server.hostname)
    );

    // Get servers to hack, weaken, and grow.
    const hackableServers = serversWithRootAccess.filter(
      server => server.maxMoney > 0
    );

    // Get servers to hack.
    const serversToHack = getServersToHack(ns, hackableServers);
    const hostnameToHackToThreadCountMap = Object.fromEntries(
      serversToHack
        .map(server => [server.hostname, getHackThreadCount(ns, server)])
        .filter(entry => entry[1] > 0) // Make sure thread count > 0
    );
    const hostnameToHackToRunningThreadCountMap = {};

    // Get servers to weaken.
    const serversToWeaken = getServersToWeaken(ns, hackableServers);
    const hostnameToWeakenToThreadCountMap = Object.fromEntries(
      serversToWeaken
        .map(server => [server.hostname, getWeakenThreadCount(ns, server)])
        .filter(entry => entry[1] > 0) // Make sure thread count > 0
    );
    const hostnameToWeakenToRunningThreadCountMap = {};

    // Get servers to grow.
    const serversToGrow = getServersToGrow(ns, hackableServers);
    const hostnameToGrowToThreadCountMap = Object.fromEntries(
      serversToGrow
        .map(server => [server.hostname, getGrowThreadCount(ns, server)])
        .filter(entry => entry[1] > 0) // Make sure thread count > 0
    );
    const hostnameToGrowToRunningThreadCountMap = {};

    // Get runnable servers.
    const ramToReserveInHome = ns.args[0] ?? getRamToReserve(ns);
    const runnableServers = getRunnableServers(
      ns,
      serversWithRootAccess,
      minRamNecessaryToRunHackWeakenGrow,
      ramToReserveInHome
    );

    const scriptToThreadCountMapMap = {
      [HACK_JS]: hostnameToHackToThreadCountMap,
      [WEAKEN_JS]: hostnameToWeakenToThreadCountMap,
      [GROW_JS]: hostnameToGrowToThreadCountMap,
    };
    const scriptToRunningThreadCountMapMap = {
      [HACK_JS]: hostnameToHackToRunningThreadCountMap,
      [WEAKEN_JS]: hostnameToWeakenToRunningThreadCountMap,
      [GROW_JS]: hostnameToGrowToRunningThreadCountMap,
    };

    // Subtract threads that are already running.
    for (const runnableServer of runnableServers) {
      const processes = ns
        .ps(runnableServer.hostname)
        .filter(process => hackWeakenGrowScripts.includes(process.filename));
      for (const process of processes) {
        const threadCountMap = scriptToThreadCountMapMap[process.filename];
        const runningThreadCountMap =
          scriptToRunningThreadCountMapMap[process.filename];
        const targetHostname = process.args[0];

        // Add to running thread count map.
        if (!(targetHostname in runningThreadCountMap)) {
          runningThreadCountMap[targetHostname] = 0;
        }
        runningThreadCountMap[targetHostname] += process.threads;

        // Subtract from thread count map.
        if (!(targetHostname in threadCountMap)) continue;
        threadCountMap[targetHostname] -= process.threads;
        if (threadCountMap[targetHostname] <= 0) {
          delete threadCountMap[targetHostname];
        }
      }
    }

    // Determine order of hack, weaken, and grow based on the least amount of
    // time.
    const getMinTime = (hostnameToThreadCountMap, getTimeFn) => {
      const hostname = Object.keys(hostnameToThreadCountMap)[0];
      return hostname ? getTimeFn(hostname) : Infinity;
    };
    const scriptToMinTimeMap = {
      [HACK_JS]: getMinTime(hostnameToHackToThreadCountMap, ns.getHackTime),
      [WEAKEN_JS]: getMinTime(
        hostnameToWeakenToThreadCountMap,
        ns.getWeakenTime
      ),
      [GROW_JS]: getMinTime(hostnameToGrowToThreadCountMap, ns.getGrowTime),
    };
    const scriptsInOrder = Object.keys(scriptToMinTimeMap)
      .filter(script => scriptToMinTimeMap[script] < Infinity)
      .sort((a, b) => scriptToMinTimeMap[a] - scriptToMinTimeMap[b]);

    // Execute hack, weaken, and grow on runnable servers.
    for (const runnableServer of runnableServers) {
      for (const scriptName of scriptsInOrder) {
        const hostnameToThreadCountMap = scriptToThreadCountMapMap[scriptName];
        const hostnameToRunningThreadCountMap =
          scriptToRunningThreadCountMapMap[scriptName];
        for (const hostname in hostnameToThreadCountMap) {
          const threadsNeeded = hostnameToThreadCountMap[hostname];

          // Modify threads needed based on runnable server's CPU cores.
          const targetServer = hackableServers.find(
            server => server.hostname === hostname
          );
          let adjustedThreadsNeeded = threadsNeeded;
          if (scriptName === WEAKEN_JS) {
            adjustedThreadsNeeded = getWeakenThreadCount(
              ns,
              targetServer,
              runnableServer.cpuCores
            );
          }
          if (scriptName === GROW_JS) {
            adjustedThreadsNeeded = getGrowThreadCount(
              ns,
              targetServer,
              runnableServer.cpuCores
            );
          }

          const threadsUsed = runScript(
            ns,
            scriptName,
            runnableServer,
            hostname,
            threadsNeeded,
            ramToReserveInHome
          );
          if (threadsUsed > 0) {
            hostnameToThreadCountMap[hostname] -=
              threadsUsed === adjustedThreadsNeeded
                ? threadsNeeded
                : threadsUsed;
            if (hostnameToThreadCountMap[hostname] <= 0) {
              delete hostnameToThreadCountMap[hostname];
            }
            if (!(hostname in hostnameToRunningThreadCountMap)) {
              hostnameToRunningThreadCountMap[hostname] = 0;
            }
            hostnameToRunningThreadCountMap[hostname] += threadsUsed;
          }
        }
      }
    }

    // Use any unused RAM on runnable servers to weaken the server with the
    // lowest weak time even if it doesn't need weakening to gain hacking exp.
    hackableServers.sort(
      (a, b) => ns.getWeakenTime(a.hostname) - ns.getWeakenTime(b.hostname)
    );
    const serverWithLowestWeakTime = hackableServers[0];
    if (ns.getWeakenTime(serverWithLowestWeakTime.hostname) < ONE_SECOND) {
      const weakenScriptRam = ns.getScriptRam(WEAKEN_JS);
      for (const runnableServer of runnableServers) {
        const availableRam = getAvailableRam(
          ns,
          runnableServer,
          ramToReserveInHome
        );
        const threadCount = Math.floor(availableRam / weakenScriptRam);
        runScript(
          ns,
          WEAKEN_JS,
          runnableServer,
          serverWithLowestWeakTime.hostname,
          threadCount,
          ramToReserveInHome
        );
      }
    }

    // Log hack, weaken, and grow.
    ns.clearLog();
    for (const script of scriptsInOrder) {
      switch (script) {
        case HACK_JS:
          logServersToHack(
            ns,
            hackableServers,
            hostnameToHackToThreadCountMap,
            hostnameToHackToRunningThreadCountMap
          );
          break;
        case WEAKEN_JS:
          logServersToWeaken(
            ns,
            hackableServers,
            hostnameToWeakenToThreadCountMap,
            hostnameToWeakenToRunningThreadCountMap
          );
          break;
        case GROW_JS:
          logServersToGrow(
            ns,
            hackableServers,
            hostnameToGrowToThreadCountMap,
            hostnameToGrowToRunningThreadCountMap
          );
          break;
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
 * @param {Server} server
 * @param {string} targetHostname
 * @param {number} threadsNeeded number of threads needed
 * @param {number} ramToReserveinHome
 * @returns {number} number of threads used
 */
function runScript(
  ns,
  scriptName,
  server,
  targetHostname,
  threadsNeeded,
  ramToReserveinHome
) {
  // If script file doesn't exist, then copy it over to that server.
  if (!ns.fileExists(scriptName, server.hostname)) {
    ns.scp(scriptName, server.hostname);
  }

  // Get threads to use.
  const availableRam = getAvailableRam(ns, server, ramToReserveinHome);
  const threadsAvailable = Math.floor(
    availableRam / ns.getScriptRam(scriptName)
  );
  const threadsToUse = Math.min(threadsAvailable, threadsNeeded);
  if (threadsToUse <= 0) return 0;

  // Execute script.
  const pid = ns.exec(
    scriptName,
    server.hostname,
    threadsToUse,
    targetHostname
  );
  return pid === 0 ? 0 : threadsToUse;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server} server
 * @param {number} ramToReserveInHome
 * @returns {number} available RAM
 */
function getAvailableRam(ns, server, ramToReserveInHome) {
  let availableRam = server.maxRam - ns.getServerUsedRam(server.hostname);
  if (server.hostname === HOME_HOSTNAME) availableRam -= ramToReserveInHome;
  return availableRam;
}

/**
 * Get all servers that have enough RAM available to run a hack, weaken, or grow
 * script.
 *
 * @param {NS} ns
 * @param {import('database/servers').Server[]} serversWithRootAccess
 * @param {number} minRamNecessaryToRunHackWeakenGrow
 * @param {number} ramToReserveInHome
 * @returns {import('database/servers').Server[]} runnable servers
 */
function getRunnableServers(
  ns,
  serversWithRootAccess,
  minRamNecessaryToRunHackWeakenGrow,
  ramToReserveInHome
) {
  return serversWithRootAccess.filter(server => {
    if (server.maxRam <= 0) return false;

    let availableRam = getAvailableRam(ns, server, ramToReserveInHome);
    if (availableRam < minRamNecessaryToRunHackWeakenGrow) return false;

    return true;
  });
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server[]} hackableServers
 * @returns {import('database/servers').Server[]}
 *          servers to hack sorted by hack time
 */
function getServersToHack(ns, hackableServers) {
  const servers = hackableServers.filter(
    server =>
      ns.getServerMoneyAvailable(server.hostname) >
        Math.min(server.maxMoney * MIN_MONEY_PERCENT, MIN_MONEY_AMOUNT) &&
      ns.hackAnalyzeChance(server.hostname) > MIN_HACK_CHANCE
  );
  servers.sort(
    (a, b) =>
      ns.getHackTime(a.hostname) * getHackThreadCount(ns, a) -
      ns.getHackTime(b.hostname) * getHackThreadCount(ns, b)
  );
  return servers;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server} server
 * @returns {number} number of threads needed to hack the given server
 */
function getHackThreadCount(ns, server) {
  const moneyToHack =
    ns.getServerMoneyAvailable(server.hostname) -
    Math.min(server.maxMoney * MIN_MONEY_PERCENT, MIN_MONEY_AMOUNT);
  return Math.floor(ns.hackAnalyzeThreads(server.hostname, moneyToHack));
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server[]} hackableServers
 * @returns {import('database/servers').Server[]}
 *          servers to weaken sorted by weaken time
 */
function getServersToWeaken(ns, hackableServers) {
  const servers = hackableServers.filter(
    server =>
      ns.getServerSecurityLevel(server.hostname) > server.minSecurity &&
      ns.hackAnalyzeChance(server.hostname) <= MIN_HACK_CHANCE
  );
  servers.sort(
    (a, b) =>
      ns.getWeakenTime(a.hostname) * getWeakenThreadCount(ns, a) -
      ns.getWeakenTime(b.hostname) * getWeakenThreadCount(ns, b)
  );
  return servers;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server} server
 * @param {[number]} cpuCores
 * @returns {number} number of threads needed to weaken the given server
 */
function getWeakenThreadCount(ns, server, cpuCores) {
  const securityToDecrease =
    ns.getServerSecurityLevel(server.hostname) - server.minSecurity;
  let threadCount = 0;
  do {
    threadCount++;
  } while (ns.weakenAnalyze(threadCount, cpuCores) < securityToDecrease);
  return threadCount;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server[]} hackableServers
 * @returns {import('database/servers').Server[]}
 *          servers to grow sorted by grow time
 */
function getServersToGrow(ns, hackableServers) {
  const servers = hackableServers.filter(
    server =>
      ns.getServerMoneyAvailable(server.hostname) <
      server.maxMoney * MIN_MONEY_PERCENT
  );
  servers.sort(
    (a, b) =>
      ns.getGrowTime(a.hostname) * getGrowThreadCount(ns, a) -
      ns.getGrowTime(b.hostname) * getGrowThreadCount(ns, b)
  );
  return servers;
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server} server
 * @param {[number]} cpuCores
 * @returns {number} number of threads needed to grow the given server
 */
function getGrowThreadCount(ns, server, cpuCores) {
  const growMultiplier = Math.floor(
    server.maxMoney / (ns.getServerMoneyAvailable(server.hostname) || 1)
  );
  return Math.floor(
    ns.growthAnalyze(server.hostname, growMultiplier, cpuCores)
  );
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server[]} servers
 * @param {Object.<string, number>} hostnameToThreadCountMap
 * @param {Object.<string, number>} hostnameToRunningThreadCountMap
 */
function logServersToHack(
  ns,
  servers,
  hostnameToThreadCountMap,
  hostnameToRunningThreadCountMap
) {
  logServers(
    ns,
    servers,
    hostnameToThreadCountMap,
    hostnameToRunningThreadCountMap,
    'Servers to hack',
    ns.ui.getTheme().error,
    server => ({
      column: { name: 'Available Money', style: { textAlign: 'right' } },
      content: formatMoney(ns, ns.getServerMoneyAvailable(server.hostname)),
    }),
    server => ({
      column: { name: 'Hack Chance', style: { textAlign: 'right' } },
      content: ns.formatPercent(ns.hackAnalyzeChance(server.hostname)),
    }),
    server => ({
      column: { name: 'Hack Time', style: { textAlign: 'center' } },
      content: formatTime(ns, ns.getHackTime(server.hostname)),
    })
  );
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server[]} servers
 * @param {Object.<string, number>} hostnameToThreadCountMap
 * @param {Object.<string, number>} hostnameToRunningThreadCountMap
 */
function logServersToWeaken(
  ns,
  servers,
  hostnameToThreadCountMap,
  hostnameToRunningThreadCountMap
) {
  logServers(
    ns,
    servers,
    hostnameToThreadCountMap,
    hostnameToRunningThreadCountMap,
    'Servers to weaken',
    ns.ui.getTheme().warning,
    server => ({
      column: { name: 'Min Security', style: { textAlign: 'right' } },
      content: ns.formatNumber(server.minSecurity, 0),
    }),
    server => ({
      column: { name: 'Current Security', style: { textAlign: 'right' } },
      content: ns.formatNumber(ns.getServerSecurityLevel(server.hostname)),
    }),
    server => ({
      column: { name: 'Base Security', style: { textAlign: 'right' } },
      content: ns.formatNumber(server.baseSecurity, 0),
    }),
    server => ({
      column: { name: 'Hack Chance', style: { textAlign: 'right' } },
      content: ns.formatPercent(ns.hackAnalyzeChance(server.hostname)),
    }),
    server => ({
      column: { name: 'Weaken Time', style: { textAlign: 'center' } },
      content: formatTime(ns, ns.getWeakenTime(server.hostname)),
    })
  );
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server[]} servers
 * @param {Object.<string, number>} hostnameToThreadCountMap
 * @param {Object.<string, number>} hostnameToRunningThreadCountMap
 */
function logServersToGrow(
  ns,
  servers,
  hostnameToThreadCountMap,
  hostnameToRunningThreadCountMap
) {
  logServers(
    ns,
    servers,
    hostnameToThreadCountMap,
    hostnameToRunningThreadCountMap,
    'Servers to grow',
    ns.ui.getTheme().success,
    server => ({
      column: { name: 'Available Money', style: { textAlign: 'right' } },
      content: formatMoney(ns, ns.getServerMoneyAvailable(server.hostname)),
    }),
    server => ({
      column: { name: 'Max Money', style: { textAlign: 'right' } },
      content: formatMoney(ns, server.maxMoney),
    }),
    server => ({
      column: { name: 'Grow Time', style: { textAlign: 'center' } },
      content: formatTime(ns, ns.getGrowTime(server.hostname)),
    })
  );
}

/**
 * @param {NS} ns
 * @param {import('database/servers').Server[]} servers
 * @param {Object.<string, number>} hostnameToThreadCountMap
 * @param {Object.<string, number>} hostnameToRunningThreadCountMap
 * @param {string} header
 * @param {string} color
 * @param {...function(import('database/servers').Server): import('utils/table').Cell} additionalCells
 */
function logServers(
  ns,
  servers,
  hostnameToThreadCountMap,
  hostnameToRunningThreadCountMap,
  header,
  color,
  ...additionalCells
) {
  servers = servers.filter(
    server =>
      server.hostname in hostnameToThreadCountMap ||
      server.hostname in hostnameToRunningThreadCountMap
  );
  if (servers.length === 0) return;

  const borderColor = `${color}33`;
  /** @type {import('utils/table').Table} */ const table = {
    rows: [],
    style: { color: color, borderColor: borderColor },
  };
  for (const server of servers) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: {
            name: 'Hostname',
            style: { borderColor: borderColor, width: 'max-content' },
          },
          content: createReactElement(server.hostname, {
            color: createColorForString(ns, server.hostname),
          }),
        },
        ...additionalCells.map(fn => {
          const cell = fn(server);
          cell.column.style.borderColor = borderColor;
          return cell;
        }),
        {
          column: {
            name: 'Threads Needed',
            style: {
              borderColor: borderColor,
              textAlign: 'right',
              width: 'min-content',
            },
          },
          content:
            server.hostname in hostnameToThreadCountMap
              ? ns.formatNumber(hostnameToThreadCountMap[server.hostname], 0)
              : '-',
        },
        {
          column: {
            name: 'Threads Running',
            style: {
              borderColor: borderColor,
              textAlign: 'right',
              width: 'min-content',
            },
          },
          content:
            server.hostname in hostnameToRunningThreadCountMap
              ? ns.formatNumber(
                  hostnameToRunningThreadCountMap[server.hostname],
                  0
                )
              : '-',
        },
      ],
    };
    table.rows.push(row);
  }

  ns.printRaw(
    createReactElement('\n ' + header, { color: color, fontWeight: 'bold' })
  );
  printTable(ns, table);
}
