import { getHackColor } from 'utils/colors';
import { formatMoney, formatTime } from 'utils/format';
import { GROW_SCRIPT, HACK_SCRIPT, WEAKEN_SCRIPT } from 'utils/scripts';
import { HOME_HOSTNAME, getAllServers, getReservedRam } from 'utils/servers';
import { printTable } from 'utils/table';
import { ONE_SECOND } from 'utils/time';

const MIN_AVERAGE_HACK_MONEY_PER_SECOND = 100;

const HACK_RAM = 1.7;
const WEAKEN_RAM = 1.75;
const GROW_RAM = 1.75;

/**
 * Distribute hack/grow/weaken across all servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  while (true) {
    const rootAccessServers = getAllServers(ns).filter(
      server => server.hasRootAccess
    );

    const hackingLevel = ns.getHackingLevel();
    const hackableServers = rootAccessServers.filter(
      server => server.hackingLevel <= hackingLevel && server.maxMoney > 0
    );

    /**
     * @typedef TargetServer
     * @property {import('utils/servers').ServerDetails} server
     * @property {string} script hack / weaken / grow
     * @property {number} timeToExecute time to hack / weaken / grow
     */

    // Get list of servers to target with hack / weaken / grow intermixed and
    // all sorted by time to execute.
    /** @type {TargetServer[]} */ const serversToTarget = [];

    // Add servers to hack.
    const serversToHack = getServersToHack(ns, hackableServers);
    for (const server of serversToHack) {
      serversToTarget.push({
        server,
        script: HACK_SCRIPT,
        timeToExecute: ns.getHackTime(server.hostname),
      });
    }

    // Add servers to weaken.
    const serversToWeaken = getServersToWeaken(ns, hackableServers);
    for (const server of serversToWeaken) {
      const weakenTime = ns.getWeakenTime(server.hostname);
      const serverToTarget = {
        server,
        script: WEAKEN_SCRIPT,
        timeToExecute: weakenTime,
      };

      const indexToInsertBefore = serversToTarget.findIndex(
        serverToTarget => serverToTarget.timeToExecute > weakenTime
      );
      if (indexToInsertBefore === -1) {
        serversToTarget.push(serverToTarget);
        continue;
      }
      serversToTarget.splice(indexToInsertBefore - 1, 0, serverToTarget);
    }

    // Add servers to grow.
    const serversToGrow = getServersToGrow(ns, hackableServers);
    for (const server of serversToGrow) {
      const growTime = ns.getGrowTime(server.hostname);
      const serverToTarget = {
        server,
        script: GROW_SCRIPT,
        timeToExecute: growTime,
      };

      const indexToInsertBefore = serversToTarget.findIndex(
        serverToTarget => serverToTarget.timeToExecute > growTime
      );
      if (indexToInsertBefore === -1) {
        serversToTarget.push(serverToTarget);
        continue;
      }
      serversToTarget.splice(indexToInsertBefore - 1, 0, serverToTarget);
    }

    // Run hack / weaken / grow.
    for (const serverToTarget of serversToTarget) {
      switch (serverToTarget.script) {
        case HACK_SCRIPT:
          hackServer(ns, serverToTarget.server, rootAccessServers);
          break;
        case WEAKEN_SCRIPT:
          weakenServer(ns, serverToTarget.server, rootAccessServers);
          break;
        case GROW_SCRIPT:
          growServer(ns, serverToTarget.server, rootAccessServers);
          break;
      }
    }

    // Log to tail.
    ns.clearLog();
    logServersToHack(ns, serversToHack);
    logServersToWeaken(ns, serversToWeaken);
    logServersToGrow(ns, serversToGrow);
    await ns.sleep(ONE_SECOND);
  }
}

/**
 * Gets list of servers to hack sorted by which servers to hack first.
 *
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails[]} servers
 */
function getServersToHack(ns, servers) {
  return servers
    .filter(
      server =>
        getAverageHackMoneyPerSecond(ns, server) >
        MIN_AVERAGE_HACK_MONEY_PER_SECOND
    )
    .sort(
      (server1, server2) =>
        getAverageHackMoneyPerSecond(ns, server2) -
        getAverageHackMoneyPerSecond(ns, server1)
    );
}

/**
 * Gets list of servers to weaken sorted by which servers to weaken first.
 *
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails[]} servers
 */
function getServersToWeaken(ns, servers) {
  return servers
    .filter(
      server => ns.getServerSecurityLevel(server.hostname) > server.minSecurity
    )
    .sort(
      (server1, server2) =>
        ns.getWeakenTime(server1.hostname) - ns.getWeakenTime(server2.hostname)
    );
}

/**
 * Gets list of servers to grow sorted by which servers to grow first.
 *
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails[]} servers
 */
function getServersToGrow(ns, servers) {
  return servers.filter(
    server => ns.getServerMoneyAvailable(server.hostname) < server.maxMoney
  );
}

/**
 * Runs hack scripts across all root access servers to target the server to hack.
 *
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails} serverToHack
 * @param {import('utils/servers').ServerDetails[]} rootAccessServers
 */
function hackServer(ns, serverToHack, rootAccessServers) {
  const targetHostname = serverToHack.hostname;
  const rootAccessHostnames = rootAccessServers.map(server => server.hostname);

  // Get number of threads needed.
  let threadsNeeded = Math.floor(
    ns.hackAnalyzeThreads(
      targetHostname,
      // Don't hack the server down to $0 or else it will be difficult to grow.
      ns.getServerMoneyAvailable(targetHostname) / 2
    )
  );

  // Run hack.js on all root access servers.
  for (const rootAccessHostname of rootAccessHostnames) {
    const threads = Math.min(
      threadsNeeded,
      getAvailableThreads(ns, rootAccessHostname, HACK_RAM)
    );
    if (threads === 0) continue;

    ns.exec(HACK_SCRIPT, rootAccessHostname, threads, targetHostname);
    threadsNeeded -= threads;

    if (threadsNeeded === 0) return;
  }
}

/**
 * Runs weaken scripts across all root access servers to target the server to weaken.
 *
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails} serverToWeaken
 * @param {import('utils/servers').ServerDetails[]} rootAccessServers
 */
function weakenServer(ns, serverToWeaken, rootAccessServers) {
  // Get amount of security to decrease.
  let securityToDecrease =
    ns.getServerSecurityLevel(serverToWeaken.hostname) -
    serverToWeaken.minSecurity;

  for (const rootAccessServer of rootAccessServers) {
    // Get number of threads that we can run weaken.js on root access server.
    const threadsAvailable = getAvailableThreads(
      ns,
      rootAccessServer.hostname,
      WEAKEN_RAM
    );
    if (threadsAvailable === 0) continue;

    // Only use the amount of threads to do the security decrease we need.
    let threads = 0;
    let weakenEffect;
    do {
      threads++;
      weakenEffect = ns.weakenAnalyze(threads, rootAccessServer.cpuCores);
    } while (weakenEffect < securityToDecrease && threads < threadsAvailable);

    // Run weaken.js
    ns.exec(
      WEAKEN_SCRIPT,
      rootAccessServer.hostname,
      threads,
      serverToWeaken.hostname
    );

    securityToDecrease -= weakenEffect;
    if (securityToDecrease <= 0) return;
  }
}

/**
 * Runs grow scripts across all root access servers to target the server to
 * grow.
 *
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails} serverToGrow
 * @param {import('utils/servers').ServerDetails[]} rootAccessServers
 */
function growServer(ns, serverToGrow, rootAccessServers) {
  // Get multiplier to grow.
  let availableMoney = ns.getServerMoneyAvailable(serverToGrow.hostname);

  for (const rootAccessServer of rootAccessServers) {
    // Get number of threads that we can run grow.js on root access server.
    const threadsAvailable = getAvailableThreads(
      ns,
      rootAccessServer.hostname,
      GROW_RAM
    );
    if (threadsAvailable === 0) continue;

    // Calculate how many threads we need.
    let multiplierToGrow = serverToGrow.maxMoney / availableMoney;
    let growthMultiplier = multiplierToGrow;
    let threads;
    do {
      threads = Math.ceil(
        ns.growthAnalyze(
          serverToGrow.hostname,
          growthMultiplier,
          rootAccessServer.cpuCores
        )
      );
      growthMultiplier *= 0.9;
    } while (
      growthMultiplier > 1 &&
      growthMultiplier < multiplierToGrow &&
      threads > threadsAvailable
    );
    if (threads === 0) continue;
    growthMultiplier /= 0.9;

    // Run grow.js
    ns.exec(
      GROW_SCRIPT,
      rootAccessServer.hostname,
      threads,
      serverToGrow.hostname
    );

    availableMoney *= growthMultiplier;
    if (availableMoney >= serverToGrow.maxMoney) return;
  }
}

/**
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails[]} servers
 */
function logServersToHack(ns, servers) {
  /** @type {import('utils/table').Table} */ const table = {
    rows: [],
    name: 'Servers to Hack',
    baseColor: getHackColor(ns),
  };

  for (const server of servers) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Hostname' },
          content: server.hostname,
        },
        {
          column: {
            name: 'Money Available',
            style: { 'text-align': 'center' },
          },
          content: formatMoney(ns, ns.getServerMoneyAvailable(server.hostname)),
        },
        {
          column: { name: 'Hack %', style: { 'text-align': 'center' } },
          content: ns.formatPercent(ns.hackAnalyzeChance(server.hostname)),
        },
        {
          column: { name: 'Hack Time', style: { 'text-align': 'center' } },
          content: formatTime(ns, ns.getHackTime(server.hostname)),
        },
        {
          column: { name: 'Avg. Money/s', style: { 'text-align': 'center' } },
          content: formatMoney(ns, getAverageHackMoneyPerSecond(ns, server)),
        },
      ],
    };
    table.rows.push(row);
  }

  printTable(ns, table);
}

/**
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails[]} servers
 */
function logServersToWeaken(ns, servers) {
  /** @type {import('utils/table').Table} */ const table = { rows: [] };

  for (const server of servers) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Hostname' },
          content: server.hostname,
        },
        {
          column: { name: 'Min Security', style: { 'text-align': 'center' } },
          content: ns.formatNumber(server.minSecurity),
        },
        {
          column: {
            name: 'Current Security',
            style: { 'text-align': 'center' },
          },
          content: ns.formatNumber(ns.getServerSecurityLevel(server.hostname)),
        },
        {
          column: {
            name: 'Weaken Time',
            style: { 'text-align': 'center' },
          },
          content: formatTime(ns, ns.getWeakenTime(server.hostname)),
        },
      ],
    };
    table.rows.push(row);
  }

  printTable(ns, table);
}

/**
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails[]} servers
 */
function logServersToGrow(ns, servers) {
  /** @type {import('utils/table').Table} */ const table = { rows: [] };

  for (const server of servers) {
    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        {
          column: { name: 'Hostname' },
          content: server.hostname,
        },
        {
          column: {
            name: 'Money Available',
            style: { 'text-align': 'center' },
          },
          content: formatMoney(ns, ns.getServerMoneyAvailable(server.hostname)),
        },
        {
          column: {
            name: 'Max Money',
            style: { 'text-align': 'center' },
          },
          content: formatMoney(ns, server.maxMoney),
        },
        {
          column: {
            name: 'Grow Time',
            style: { 'text-align': 'center' },
          },
          content: formatTime(ns, ns.getGrowTime(server.hostname)),
        },
      ],
    };
    table.rows.push(row);
  }

  printTable(ns, table);
}

/**
 * @param {NS} ns
 * @param {import('utils/servers').ServerDetails} server
 * @returns {number} average money gain per second
 */
function getAverageHackMoneyPerSecond(ns, server) {
  const moneyAvailable = ns.getServerMoneyAvailable(server.hostname);
  const hackChance = ns.hackAnalyzeChance(server.hostname);
  const moneyGain = hackChance * moneyAvailable;
  const hackTimeInSeconds = ns.getHackTime(server.hostname) / 1000;
  return moneyGain / hackTimeInSeconds;
}

/**
 * Gets the number of threads that a server can run the hack/weaken/grow script.
 *
 * @param {NS} ns
 * @param {string} hostname of server to run script on
 * @param {number} scriptRam ram for script to run
 * @returns {number} threads of hack/weaken/grow script that can be run
 */
function getAvailableThreads(ns, hostname, scriptRam) {
  const usedRam = ns.getServerUsedRam(hostname);
  const maxRam = ns.getServerMaxRam(hostname);
  const availableRam =
    maxRam - usedRam - (hostname === HOME_HOSTNAME ? getReservedRam(ns) : 0);
  return Math.max(0, Math.floor(availableRam / scriptRam));
}
