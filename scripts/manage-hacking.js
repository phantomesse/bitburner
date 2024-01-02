import { getServers } from 'database/servers';
import { HOME_HOSTNAME, ONE_SECOND } from 'utils';

const MIN_MONEY_AMOUNT = 1000000;

/**
 * Manages hacking in all servers, reserving enough RAM in Home server to run
 * all other scripts.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  // Get all servers from database.
  const allServers = getServers(ns);

  while (true) {
    // Get amount of RAM to resolve based on the combination of all scripts in
    // the Home server.
    const ramToReserveInHome = ns
      .ls(HOME_HOSTNAME, '.js')
      .filter(filename => !ns.isRunning(filename, HOME_HOSTNAME))
      .map(filename => ns.getScriptRam(filename))
      .reduce((a, b) => Math.max(a, b));

    // Get servers to hack, grow, and weaken.
    const serversToHack = getServersToHack(ns, allServers);
    const serversToGrow = getServersToGrow(ns, allServers);
    const serversToWeaken = getServersToWeaken(ns, allServers);

    // Get all servers that can run scripts.
    const runnableServers = allServers.filter(
      server => ns.hasRootAccess(server.hostname) && server.maxRam > 0
    );

    for (const runnableServer of runnableServers) {
      // Hack.
      if (serversToHack.length > 0) {
        const serverToHack = serversToHack.shift();
        serverToHack.threadsNeeded -= runScript(
          ns,
          'hack.js',
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
          'grow.js',
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
          'weaken.js',
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

    await ns.sleep(ONE_SECOND * 10);
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
  if (threadsAvailable <= 0) return 0;
  const threads = Math.min(threadsAvailable, maxThreads);
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
        server.hackingLevel <= ns.getHackingLevel() &&
        server.maxMoney > 0 &&
        ns.getServerMoneyAvailable(server.hostname) >
          Math.min(server.maxMoney / 2, MIN_MONEY_AMOUNT) &&
        ns.getServerSecurityLevel(server.hostname) < server.baseSecurity
    )
    .map(server => {
      server.threadsNeeded = Math.floor(
        ns.hackAnalyzeThreads(
          server.hostname,
          ns.getServerMoneyAvailable(server.hostname) / 2
        )
      );
      return server;
    });
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
    });
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
    });
  servers.sort((server1, server2) => {
    ns.getWeakenTime(server1.hostname) - ns.getWeakenTime(server2.hostname);
  });
  return servers;
}
