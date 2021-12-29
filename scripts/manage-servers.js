import {
  formatMoney,
  getAllServerNames,
  isHackable,
  sortByHackingHeuristic,
} from './utils.js';

const DISABLE_LOGGING_FUNCTIONS = [
  'nuke',
  'getHackingLevel',
  'getServerMaxMoney',
  'getServerMaxRam',
  'getServerMoneyAvailable',
  'getServerSecurityLevel',
  'getServerRequiredHackingLevel',
  'getServerUsedRam',
  'getServerMinSecurityLevel',
  'scan',
  'sleep',
  'kill',
];

const HOME_SERVER_NAME = 'home';

const GROW_SCRIPT = 'grow.js';
const HACK_SCRIPT = 'hack.js';
const WEAKEN_SCRIPT = 'weaken.js';

const MIN_AVAILABLE_MONEY = 5000000;
const MIN_HACK_CHANCE = 0.6;

/**
 * Manages hacking servers.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  while (true) {
    // Get all servers where we have root access including home.
    const rootAccessServerNames = [
      HOME_SERVER_NAME,
      ...getAllServerNames(ns),
    ].filter(serverName => gainRootAccess(ns, serverName));

    // Copy scripts to every root access server.
    for await (const serverName of rootAccessServerNames) {
      if (serverName === HOME_SERVER_NAME) continue;
      await copyScriptsToServer(ns, serverName);
    }

    const hackableServerNames = sortByHackingHeuristic(
      ns,
      rootAccessServerNames.filter(serverName => isHackable(ns, serverName))
    );
    for (const targetServerName of hackableServerNames) {
      const freeRam = rootAccessServerNames
        .map(serverName => getFreeRam(ns, serverName))
        .reduce((a, b) => a + b);
      if (freeRam === 0) break;

      const hackChance = ns.hackAnalyzeChance(targetServerName);
      const availableMoney = ns.getServerMoneyAvailable(targetServerName);

      // Grow the server until it is at least MIN_AVAILABLE_MONEY or the max.
      const minAvailableMoney = Math.min(
        MIN_AVAILABLE_MONEY,
        ns.getServerMaxMoney(targetServerName)
      );
      const needsToGrow = availableMoney < minAvailableMoney;
      if (needsToGrow) {
        grow(ns, targetServerName, rootAccessServerNames, minAvailableMoney);
      }

      // Weaken the server to hack until it is at least `MIN_HACK_CHANCE`.
      const needsToWeaken = hackChance < MIN_HACK_CHANCE;
      if (needsToWeaken) weaken(ns, targetServerName, rootAccessServerNames);

      // Hack the server.
      if (availableMoney > 0 && !needsToGrow && !needsToWeaken) {
        hack(ns, targetServerName, rootAccessServerNames);
      }
    }

    // Use up any leftover RAM.
    for (const targetServerName of hackableServerNames) {
      const freeRam = rootAccessServerNames
        .map(serverName => getFreeRam(ns, serverName))
        .reduce((a, b) => a + b);
      if (freeRam === 0) break;

      const availableMoney = ns.getServerMoneyAvailable(targetServerName);

      // Grow if server is not maxed on money.
      const maxMoney = ns.getServerMaxMoney(targetServerName);
      if (availableMoney < maxMoney) {
        grow(ns, targetServerName, rootAccessServerNames, maxMoney);
      }

      // Weaken if server is not at min security.
      if (
        ns.getServerSecurityLevel(targetServerName) >
        ns.getServerMinSecurityLevel(targetServerName)
      ) {
        weaken(ns, targetServerName, rootAccessServerNames);
      }

      // Hack the server.
      if (availableMoney > 0 && ns.hackAnalyzeChance(targetServerName) > 0) {
        hack(ns, targetServerName, rootAccessServerNames);
      }
    }

    await ns.sleep(1000); // Wait a second.
  }
}

/**
 * Open all the ports that we can open and attempt to gain root access to a
 * given server.
 *
 * @param {import('..').NS } ns
 * @param {string} serverName
 * @returns {boolean} true if we now have root access and false if otherwise
 */
function gainRootAccess(ns, serverName) {
  const server = ns.getServer(serverName);

  // Attempt to open all ports even if we already have root access.
  if (ns.fileExists('BruteSSH.exe') && !server.sshPortOpen) {
    ns.brutessh(serverName);
  }
  if (ns.fileExists('FTPCrack.exe') && !server.ftpPortOpen) {
    ns.ftpcrack(serverName);
  }
  if (ns.fileExists('relaySMTP.exe') && !server.smtpPortOpen) {
    ns.relaysmtp(serverName);
  }
  if (ns.fileExists('HTTPWorm.exe') && !server.httpPortOpen) {
    ns.httpworm(serverName);
  }
  if (ns.fileExists('SQLInject.exe') && !server.sqlPortOpen) {
    ns.sqlinject(serverName);
  }

  if (ns.hasRootAccess(serverName)) return true;
  try {
    ns.nuke(serverName);
  } catch (_) {
    return false;
  }
}

/**
 * Copies grow, hack, and weaken scripts to a given server and deletes any other
 * js scripts from that server.
 *
 * @param {import('..').NS} ns
 * @param {string} serverName
 */
async function copyScriptsToServer(ns, serverName) {
  const scriptsToCopy = [GROW_SCRIPT, HACK_SCRIPT, WEAKEN_SCRIPT];
  const scriptsOnServer = ns
    .ls(serverName)
    .filter(script => script.endsWith('.js'));

  for await (const script of scriptsToCopy) {
    // Don't copy scripts over if they already exist.
    if (scriptsOnServer.includes(script)) continue;

    // Copy script over.
    await ns.scp(script, serverName);
  }

  // Delete any other scripts on the server.
  for (const script of scriptsOnServer) {
    if (scriptsToCopy.includes(script)) continue;
    ns.rm(script, serverName);
  }
}

/**
 * @param {import('..').NS} ns
 * @param {string} targetServerName
 * @param {string[]} rootAccessServerNames
 */
function grow(ns, targetServerName, rootAccessServerNames, minAvailableMoney) {
  const availableMoney = ns.getServerMoneyAvailable(targetServerName);
  const maxMoney = ns.getServerMaxMoney(targetServerName);

  // Kill any threads that are still growing for the target server if we are at
  // max money.
  if (availableMoney === maxMoney) {
    killScript(ns, rootAccessServerNames, GROW_SCRIPT, targetServerName, 1);
  }

  // Get number of threads needed to get money to get to the min available money
  let estimatedThreadCount = Math.floor(
    ns.growthAnalyze(
      targetServerName,
      minAvailableMoney / (availableMoney === 0 ? 1 : availableMoney)
    )
  );
  if (estimatedThreadCount === 0) return;
  ns.print(
    `\nestimated ${estimatedThreadCount} threads to grow ${targetServerName} ` +
      `from ${formatMoney(availableMoney)} to ${formatMoney(minAvailableMoney)}`
  );

  // Use only the estimated thread count to grow the target server.
  for (const serverName of rootAccessServerNames) {
    estimatedThreadCount -= runScript(
      ns,
      serverName,
      GROW_SCRIPT,
      estimatedThreadCount,
      targetServerName,
      1
    );
    if (estimatedThreadCount <= 0) return;
  }
}

/**
 * @param {import('..').NS} ns
 * @param {string} targetServerName
 * @param {string[]} rootAccessServerNames
 */
function weaken(ns, targetServerName, rootAccessServerNames) {
  const currentSecurityLevel = ns.getServerSecurityLevel(targetServerName);
  const minSecurityLevel = ns.getServerMinSecurityLevel(targetServerName);

  // Kill any threads that are still weakening for the target server if we are
  // at min security.
  if (currentSecurityLevel === minSecurityLevel) {
    killScript(ns, rootAccessServerNames, WEAKEN_SCRIPT, targetServerName, 1);
  }

  // Get number of threads needed to get hack chance to get to minimum security
  // level.
  let estimatedThreadCount = 1;
  do {
    estimatedThreadCount++;
  } while (
    currentSecurityLevel - ns.weakenAnalyze(estimatedThreadCount) >
    minSecurityLevel
  );
  if (estimatedThreadCount === 0) return;
  ns.print(
    `\nestimated ${estimatedThreadCount} threads to weaken ` +
      `${targetServerName} from ${currentSecurityLevel} to ${minSecurityLevel}`
  );

  // Use only the estimated thread count to weaken the target server.
  for (const serverName of rootAccessServerNames) {
    estimatedThreadCount -= runScript(
      ns,
      serverName,
      WEAKEN_SCRIPT,
      estimatedThreadCount,
      targetServerName,
      1
    );
    if (estimatedThreadCount <= 0) return;
  }
}

/**
 * @param {import('..').NS} ns
 * @param {string} targetServerName
 * @param {string[]} rootAccessServerNames
 */
function hack(ns, targetServerName, rootAccessServerNames) {
  const availableMoney = ns.getServerMoneyAvailable(targetServerName);

  // Kill any threads that are still hacking for the target server if we are
  // at no available money.
  if (availableMoney === 0) {
    killScript(ns, rootAccessServerNames, HACK_SCRIPT, targetServerName, 1);
  }

  // Get number of threads needed to hack all the money from the server.
  let estimatedThreadCount = Math.floor(
    ns.hackAnalyzeThreads(targetServerName, availableMoney)
  );
  ns.print(
    `\nestimated ${estimatedThreadCount} threads to hack ${targetServerName}`
  );

  // Use only the estimated thread count to hack the target srver.
  for (const serverName of rootAccessServerNames) {
    estimatedThreadCount -= runScript(
      ns,
      serverName,
      HACK_SCRIPT,
      estimatedThreadCount,
      targetServerName,
      1
    );
    if (estimatedThreadCount <= 0) return;
  }
}

function getAvailableThreadCount(ns, serverName, scriptName) {
  return Math.floor(getFreeRam(ns, serverName) / ns.getScriptRam(scriptName));
}

/**
 * @param {import('..').NS} ns
 * @param {string} serverName
 * @param {string} scriptName
 * @param {number} threadCount
 * @param  {...any} args
 * @returns {number} number of threads that we were able to run the script at
 */
function runScript(ns, serverName, scriptName, threadCount, ...args) {
  if (ns.isRunning(scriptName, serverName, ...args)) {
    const script = ns.getRunningScript(scriptName, serverName, ...args);
    ns.print(
      `already running ${scriptName} ${args} on ${serverName} with ` +
        `${script.threads} threads`
    );
    return 0;
  }

  const availableThreadCount = getAvailableThreadCount(
    ns,
    serverName,
    scriptName
  );
  const actualThreadCount =
    availableThreadCount > threadCount ? threadCount : availableThreadCount;
  if (actualThreadCount <= 0) return 0;
  const success = ns.exec(scriptName, serverName, actualThreadCount, ...args);
  if (success === 0) return 0;
  ns.print(
    `running ${scriptName} ${args} on ${serverName} with ${actualThreadCount} threads`
  );
  return actualThreadCount;
}

/**
 * @param {import('..').NS} ns
 * @param {string[]} serverNames to kill scripts
 * @param {string} scriptName
 * @param  {...any} args
 */
function killScript(ns, serverNames, scriptName, ...args) {
  for (const serverName of serverNames) {
    if (!ns.isRunning(scriptName, serverName, ...args)) continue;
    ns.kill(scriptName, serverName, ...args);
  }
}

/**
 * @param {import('..').NS} ns
 * @param {string} serverName
 */
function getFreeRam(ns, serverName) {
  const maxRam = ns.getServerMaxRam(serverName);
  const usedRam = ns.getServerUsedRam(serverName);
  return (
    maxRam -
    usedRam -
    (serverName === HOME_SERVER_NAME
      ? ns
          .ls(HOME_SERVER_NAME)
          .filter(fileName => fileName.endsWith('.js'))
          .map(script => ns.getScriptRam(script))
          .reduce((a, b) => a + b)
      : 0)
  );
}
