import {
  isHackable,
  getHackingHeuristic,
  GROW_SCRIPT,
  WEAKEN_SCRIPT,
  HACK_SCRIPT,
} from '/utils/hacking.js';
import { getAllServerNames, getPath } from '/utils/servers.js';
import { DEFAULT_PORT, LOCALHOST_PREFIX } from '/utils/misc.js';

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

    const stockInfo = ns.stock
      .getSymbols()
      .map(symbol => getStockInfo(ns, symbol));

    await fetch(`${LOCALHOST_PREFIX}:${port}/dashboard/sync`, {
      method: 'post',
      body: JSON.stringify({ servers: serverInfos, stocks: stockInfo }),
    });

    await ns.sleep(10000); // Only update every 10 seconds.
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

    path: getPath(ns, serverName),
    backdoorInstalled: server.backdoorInstalled,
    files: ns.ls(serverName),

    maxRam: server.maxRam,
    ramUsed: server.ramUsed,

    maxMoney: server.moneyMax,
    moneyAvailable: server.moneyAvailable,

    minSecurityLevel: server.minDifficulty,
    securityLevel: server.hackDifficulty,
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

/**
 * @param {import('..').NS} ns
 * @param {string} symbol
 */
function getStockInfo(ns, symbol) {
  const position = ns.stock.getPosition(symbol);
  const info = {
    symbol: symbol,
    maxShareCount: ns.stock.getMaxShares(symbol),
    askPrice: ns.stock.getAskPrice(symbol),
    bidPrice: ns.stock.getBidPrice(symbol),
    ownedLongCount: position[0],
    ownedAvgLongPrice: position[1],
    ownedShortCount: position[2],
    ownedAvgShortPrice: position[3],
  };
  info.longGain = ns.stock.getSaleGain(symbol, info.ownedLongCount, 'Long');
  info.shortGain = ns.stock.getSaleGain(symbol, info.ownedShortCount, 'Short');
  info.longProfit =
    (info.longGain - info.ownedLongCount * info.ownedAvgLongPrice) /
    (info.ownedLongCount * info.ownedAvgLongPrice);
  info.shortProfit =
    (info.shortGain - info.ownedShortCount * info.ownedAvgShortPrice) /
    (info.ownedShortCount * info.ownedAvgShortPrice);

  if (ns.stock.purchase4SMarketDataTixApi()) {
    info.forecast = ns.stock.getForecast(symbol);
    info.volatility = ns.stock.getVolatility(symbol);
  }

  return info;
}
