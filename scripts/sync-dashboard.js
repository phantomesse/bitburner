import { getAllServerNames, isHackable, getHackingHeuristic } from './utils.js';
import { getPathCommands } from './get-path.js';

const DEFAULT_PORT = 1337;
const LOCALHOST_PREFIX = 'http://localhost';

const GROW_SCRIPT = 'grow.js';
const HACK_SCRIPT = 'hack.js';
const WEAKEN_SCRIPT = 'weaken.js';

/**
 * Syncs all stats to an external dashboard running on localhost.
 *
 * @example run sync-dashboard.js <port>
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  let port = parseInt(ns.args[0]);
  port = isNaN(port) ? DEFAULT_PORT : port;

  while (true) {
    const serverInfos = ['home', ...getAllServerNames(ns)].map(serverName =>
      getServerInfo(ns, serverName)
    );

    await fetch(`${LOCALHOST_PREFIX}:${port}/dashboard/sync`, {
      method: 'post',
      body: JSON.stringify({ servers: serverInfos }),
    });

    await ns.sleep(1000);
  }
}

/**
 * @param {import('..').NS } ns
 * @param {string} serverName
 */
function getServerInfo(ns, serverName) {
  const server = ns.getServer(serverName);

  return {
    name: serverName,
    hasRootAccess: server.hasAdminRights,
    isPurchased: server.purchasedByPlayer,
    isHackable: isHackable(ns, serverName),

    path: getPathCommands(ns, serverName),
    backdoorInstalled: server.backdoorInstalled,
    files: ns.ls(serverName),

    maxRam: server.maxRam,
    ramUsed: server.ramUsed,

    maxMoney: server.moneyMax,
    moneyAvailable: server.moneyAvailable,
    hackChance: ns.hackAnalyzeChance(serverName),

    hackTime: ns.getHackTime(serverName),
    growTime: ns.getGrowTime(serverName),
    weakenTime: ns.getWeakenTime(serverName),

    currentlyHackingThreadCount: getThreadCount(ns, HACK_SCRIPT, serverName, 1),
    currentlyGrowingThreadCount: getThreadCount(ns, GROW_SCRIPT, serverName, 1),
    currentlyWeakeningThreadCount: getThreadCount(
      ns,
      WEAKEN_SCRIPT,
      serverName,
      1
    ),

    hackHeuristic: getHackingHeuristic(ns, serverName),
  };
}

/**
 * @param {import('..').NS} ns
 * @param {string} scriptName
 * @param  {...any} args
 * @returns {number} number of threads running the script across all servers
 */
function getThreadCount(ns, scriptName, ...args) {
  const allServerNames = [...getAllServerNames(ns)];
  let threadCount = 0;
  for (const serverName of allServerNames) {
    if (!ns.isRunning(scriptName, serverName, ...args)) continue;
    threadCount += ns.getRunningScript(scriptName, serverName, ...args).threads;
  }
  return threadCount;
}
