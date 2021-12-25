import {
  formatMoney,
  formatPercent,
  getAllServers,
  sortByHackGrowWeakenTime,
} from './utils.js';

const DISABLE_LOGGING_FUNCTIONS = [
  'getHackingLevel',
  'getServerMaxMoney',
  'getServerMaxRam',
  'getServerMoneyAvailable',
  'getServerRequiredHackingLevel',
  'getServerUsedRam',
  'sleep',
  'scan',
];
const GROW_HOST_SCRIPT = 'grow-host.js';
const HACK_HOST_SCRIPT = 'hack-host.js';
const WEAKEN_HOST_SCRIPT = 'weaken-host.js';
const MIN_MONEY_TO_CONSIDER_HACKABLE = 10000;

/**
 * Manages hacking servers.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  while (true) {
    const allServers = [...getAllServers(ns)].filter(
      server => server !== 'home'
    );

    const rootAccessServers = [];
    for await (const server of allServers) {
      // Attempt to gain root access to any servers without root access.
      const serverInfo = ns.getServer(server);
      if (ns.fileExists('BruteSSH.exe') && !serverInfo.sshPortOpen) {
        ns.brutessh(server);
      }
      if (ns.fileExists('FTPCrack.exe') && !serverInfo.ftpPortOpen) {
        ns.ftpcrack(server);
      }
      if (ns.fileExists('relaySMTP.exe') && !serverInfo.smtpPortOpen) {
        ns.relaysmtp(server);
      }
      if (ns.fileExists('HTTPWorm.exe') && !serverInfo.httpPortOpen) {
        Pns.httpworm(server);
      }
      if (ns.fileExists('SQLInject.exe') && !serverInfo.sqlPortOpen) {
        ns.sqlinject(server);
      }
      if (!ns.hasRootAccess(server)) {
        try {
          ns.nuke(server);
        } catch (_) {}
      }

      // Install hack-host.js, grow-host.js, and weaken-host.js on each server
      // that we have root access for.
      if (ns.hasRootAccess(server)) {
        rootAccessServers.push(server);
        await copyScriptsToServer(ns, server);

        // Kill all scripts on this server.
        ns.killall(server);
      }
    }

    // Get all servers that we can hack sorted by least amount of time it takes
    // to hack, weaken, and grow.
    const hackableServers = allServers.filter(
      server =>
        ns.getServerMoneyAvailable(server) > MIN_MONEY_TO_CONSIDER_HACKABLE &&
        ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()
    );
    sortByHackGrowWeakenTime(ns, hackableServers);
    if (hackableServers.length === 0) return;
    const serverToHack = hackableServers[0];
    ns.tprint(
      `targetting ${serverToHack} with ${formatPercent(
        ns.hackAnalyzeChance(serverToHack)
      )} and ${formatMoney(ns.getServerMoneyAvailable(serverToHack))}`
    );

    // Grow the server until it is at least 5% of its max amount.
    while (
      ns.getServerMoneyAvailable(serverToHack) <
      ns.getServerMaxMoney(serverToHack) * 0.05
    ) {
      ns.print(
        `growing ${serverToHack} - ${formatMoney(
          ns.getServerMoneyAvailable(serverToHack)
        )} available`
      );
      executeScript(ns, rootAccessServers, GROW_HOST_SCRIPT, serverToHack);
      await ns.sleep(1000 * 60); // Wait a minute.
    }
    killScript(ns, rootAccessServers, GROW_HOST_SCRIPT);

    // Weaken the server to hack until it is at least 60% hackable.
    while (ns.hackAnalyzeChance(serverToHack) < 0.6) {
      ns.print(
        `weakening ${serverToHack} - hack chance ${formatPercent(
          ns.hackAnalyzeChance(serverToHack)
        )}`
      );
      executeScript(ns, rootAccessServers, WEAKEN_HOST_SCRIPT, serverToHack);
      await ns.sleep(1000 * 60); // Wait a minute.
    }
    killScript(ns, rootAccessServers, WEAKEN_HOST_SCRIPT);

    // Hack the server until it's completely depleted.
    while (
      Math.floor(
        ns.hackAnalyze(serverToHack) * ns.getServerMoneyAvailable(serverToHack)
      ) > 0
    ) {
      ns.print(
        `hacking ${serverToHack} - ${formatMoney(
          ns.getServerMoneyAvailable(serverToHack)
        )} available`
      );
      executeScript(ns, rootAccessServers, HACK_HOST_SCRIPT, serverToHack);
      await ns.sleep(1000 * 60); // Wait a minute.
    }
    killScript(ns, rootAccessServers, HACK_HOST_SCRIPT);
  }
}

/**
 * @param {import('..').NS} ns
 * @param {string} server
 */
async function copyScriptsToServer(ns, server) {
  const scripts = [GROW_HOST_SCRIPT, HACK_HOST_SCRIPT, WEAKEN_HOST_SCRIPT];
  for await (const script of scripts) await ns.scp(script, server);
}

/**
 * Executes a script on multiple servers.
 *
 * @param {import('..').NS} ns
 * @param {string[]} servers
 * @param {string} fileName
 * @param {string[]} args
 */
function executeScript(ns, servers, fileName, ...args) {
  for (const server of servers) {
    if (ns.isRunning(fileName, server, ...args)) continue;
    const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const threadCount = Math.floor(freeRam / ns.getScriptRam(fileName));
    if (threadCount === 0) continue;
    ns.exec(fileName, server, threadCount, ...args);
  }
}

/**
 * Kills a script on multiple servers.
 *
 * @param {import('..').NS} ns
 * @param {string[]} servers
 * @param {string} fileName
 */
function killScript(ns, servers, fileName) {
  for (const server of servers) ns.scriptKill(fileName, server);
}
