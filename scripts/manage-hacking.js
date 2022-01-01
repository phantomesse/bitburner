import {
  GROW_SCRIPT,
  WEAKEN_SCRIPT,
  HACK_SCRIPT,
  getHackingHeuristic,
  isHackable,
} from '/utils/hacking.js';
import { HOME_SERVER_NAME, getAllServerNames } from '/utils/servers.js';
import { sort } from '/utils/misc.js';
import { formatMoney, formatPercent } from '/utils/format.js';

const HACKING_SCRIPTS = [GROW_SCRIPT, WEAKEN_SCRIPT, HACK_SCRIPT];
const MIN_HACK_CHANCE = 0.6;
const MIN_AVAILABLE_MONEY = 5000000;

const DISABLE_LOGGING_FUNCTIONS = [
  'getHackingLevel',
  'getServerMaxMoney',
  'getServerMaxRam',
  'getServerMinSecurityLevel',
  'getServerMoneyAvailable',
  'getServerRequiredHackingLevel',
  'getServerSecurityLevel',
  'getServerUsedRam',
  'kill',
  'nuke',
  'scan',
  'scp',
  'sleep',
];

/**
 * Manages hacking servers.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  while (true) {
    // Get all servers where we have root access including home.
    const rootAccessServerNames = getAllServerNames(ns).filter(serverName =>
      gainRootAccess(ns, serverName)
    );

    // Copy scripts to every root access server.
    for await (const serverName of rootAccessServerNames) {
      if (serverName === HOME_SERVER_NAME) continue;
      await copyScriptsToServer(ns, serverName);
    }

    // Check if we have any free RAM to do anything.
    if (!hasFreeRam(ns, rootAccessServerNames)) continue;

    // Get hackable servers sorted by hacking heuristic.
    const hackableServerNames = rootAccessServerNames.filter(serverName =>
      isHackable(ns, serverName)
    );
    sort(
      hackableServerNames,
      serverName => getHackingHeuristic(ns, serverName),
      true
    );

    // Grow, weaken, and hack.
    for (const targetServerName of hackableServerNames) {
      // Check if we have any free RAM to do anything.
      if (!hasFreeRam(ns, rootAccessServerNames)) break;

      // Check that we are not over-growing the server.
      const availableMoney = ns.getServerMoneyAvailable(targetServerName);
      if (availableMoney === ns.getServerMaxMoney(targetServerName)) {
        const killedServerCount = killScript(
          ns,
          rootAccessServerNames,
          GROW_SCRIPT,
          targetServerName,
          1
        );
        ns.print(
          `${targetServerName} reached max money; killed ` +
            `${killedServerCount} servers that were still trying to grow`
        );
      }

      // Grow the server until MIN_AVAILABLE_MONEY.
      if (availableMoney < MIN_AVAILABLE_MONEY) {
        ns.print(
          `\nattempting to grow ${targetServerName} from ${formatMoney(
            availableMoney
          )} to ${formatMoney(MIN_AVAILABLE_MONEY)}`
        );
        grow(ns, targetServerName, rootAccessServerNames, MIN_AVAILABLE_MONEY);
      }

      // Check that we are not over-weakening the server.
      const hackChance = ns.hackAnalyzeChance(targetServerName);
      if (
        hackChance === 1 ||
        ns.getServerSecurityLevel(targetServerName) ===
          ns.getServerMinSecurityLevel(targetServerName)
      ) {
        const killedServerCount = killScript(
          ns,
          rootAccessServerNames,
          WEAKEN_SCRIPT,
          targetServerName,
          1
        );
        ns.print(
          `${targetServerName} has reached min security; killed ` +
            `${killedServerCount} servers that were still trying to weaken`
        );
      }

      // Weaken the server until MIN_HACK_CHANCE.
      if (hackChance < MIN_HACK_CHANCE) {
        ns.print(
          `\nattempting to weaken ${targetServerName} from ${formatPercent(
            hackChance
          )} to ${formatPercent(MIN_HACK_CHANCE)} hack chance`
        );
        weaken(ns, targetServerName, rootAccessServerNames);
      }

      // Check that we are not over-hacking the server.
      if (availableMoney === 0) {
        const killedServerCount = killScript(
          ns,
          rootAccessServerNames,
          HACK_SCRIPT,
          targetServerName,
          1
        );
        ns.print(
          `${targetServerName} has reached $0; killed ` +
            `${killedServerCount} servers that were still trying to hack`
        );
      }

      // Hack the server if server has MIN_AVAILABLE_MONEY and MIN_HACK_CHANCE.
      if (
        availableMoney >= MIN_AVAILABLE_MONEY &&
        hackChance >= MIN_HACK_CHANCE
      ) {
        ns.print(
          `\nattempting to hack ${targetServerName} with ${formatMoney(
            availableMoney
          )} and ${formatPercent(hackChance)} hack chance`
        );
        hack(ns, targetServerName, rootAccessServerNames);
      }
    }

    // If we have any extra free RAM, grow and weaken hackable servers to the
    // max money and min security level.
    for (const targetServerName of hackableServerNames) {
      // Check if we have any free RAM to do anything.
      if (!hasFreeRam(ns, rootAccessServerNames)) break;

      // Grow the server until max money.
      const availableMoney = ns.getServerMoneyAvailable(targetServerName);
      const maxMoney = ns.getServerMaxMoney(targetServerName);
      if (availableMoney < maxMoney) {
        ns.print(
          `\nattempting to grow ${targetServerName} from ${formatMoney(
            availableMoney
          )} to ${formatMoney(maxMoney)}`
        );
        grow(ns, targetServerName, rootAccessServerNames);
      }

      // Weaken the server until min security level.
      const securityLevel = ns.getServerSecurityLevel(targetServerName);
      const minSecurityLevel = ns.getServerMinSecurityLevel(targetServerName);
      if (securityLevel > minSecurityLevel) {
        ns.print(
          `\nattempting to weaken ${targetServerName} from ${securityLevel.toFixed(
            2
          )} to ${minSecurityLevel} security level`
        );
        weaken(ns, targetServerName, rootAccessServerNames);
      }
    }

    await ns.sleep(3000); // Wait for 3 seconds.
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
  // Copy scripts over.
  await ns.scp(HACKING_SCRIPTS, serverName);

  // Delete any other scripts on the server.
  const otherScripts = ns
    .ls(serverName)
    .filter(
      script => script.endsWith('.js') && !HACKING_SCRIPTS.includes(script)
    );
  for (const script of otherScripts) ns.rm(script, serverName);
}

/**
 * Get amount of free RAM from list of servers or a single server.
 *
 * @param {import('..').NS} ns
 * @param {(string[]|string)} serverNames
 * @returns {number} GB of free RAM
 */
function getFreeRam(ns, serverNames) {
  if (typeof serverNames === 'string') {
    // Return free RAM for a single server.
    const serverName = serverNames;
    const freeRam =
      ns.getServerMaxRam(serverName) - ns.getServerUsedRam(serverName);
    if (serverName !== HOME_SERVER_NAME) return freeRam;

    // If home server, make sure to reserve RAM to run other scripts.
    const reservedRam = ns
      .ls(HOME_SERVER_NAME)
      .filter(fileName => fileName.endsWith('.js'))
      .filter(fileName => !ns.scriptRunning(fileName, HOME_SERVER_NAME))
      .map(script => ns.getScriptRam(script))
      .reduce((a, b) => a + b);
    return freeRam - reservedRam;
  }
  return serverNames
    .map(serverName => getFreeRam(ns, serverName))
    .reduce((a, b) => a + b);
}

/**
 * Get minimum amount of RAM to execute one of grow, weaken, or hack scripts.
 *
 * @param {import('..').NS} ns
 * @returns {number} GB of RAM
 */
function getMinRam(ns) {
  return Math.min(
    ...HACKING_SCRIPTS.map(script => ns.getScriptRam(script, HOME_SERVER_NAME))
  );
}

/**
 * Checks if we have any free RAM to do anything.
 *
 * @param {import('..').NS} ns
 * @param {string[]} rootAccessServerNames
 * @returns {boolean} true if we have free RAM
 */
function hasFreeRam(ns, rootAccessServerNames) {
  const freeRam = getFreeRam(ns, rootAccessServerNames);
  if (getFreeRam(ns, rootAccessServerNames) < getMinRam(ns)) {
    ns.print(
      `all servers are currently busy (only ${freeRam} GB RAM available)`
    );
    return false;
  }
  return true;
}

/**
 * Grow until min money.
 *
 * @param {import('..').NS} ns
 * @param {number} [minMoneyAvailable] if not set, then will grow until max
 * 																		 money
 */
function grow(ns, targetServerName, rootAccessServerNames, minMoneyAvailable) {
  const maxMoney = ns.getServerMaxMoney(targetServerName);
  if (minMoneyAvailable === undefined) minMoneyAvailable = maxMoney;
  const availableMoney = ns.getServerMoneyAvailable(targetServerName);

  // Get number of threads needed to get money to get to the min available money
  const growthAmount =
    availableMoney === 0 ? 2 : minMoneyAvailable / availableMoney;
  let estimatedThreadCount = Math.round(
    ns.growthAnalyze(targetServerName, growthAmount)
  );
  ns.print(
    `estimated ${estimatedThreadCount} threads to grow ${targetServerName} ${formatPercent(
      growthAmount
    )}`
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
 * Weaken until min security level.
 *
 * @param {import('..').NS} ns
 */
function weaken(ns, targetServerName, rootAccessServerNames) {
  const currentSecurityLevel = ns.getServerSecurityLevel(targetServerName);
  const minSecurityLevel = ns.getServerMinSecurityLevel(targetServerName);

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
 */
function hack(ns, targetServerName, rootAccessServerNames) {
  // Get number of threads needed to hack all the money from the server.
  let estimatedThreadCount = Math.round(
    ns.hackAnalyzeThreads(
      targetServerName,
      ns.getServerMoneyAvailable(targetServerName)
    )
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

function getAvailableThreadCount(ns, serverName, scriptName) {
  return Math.floor(getFreeRam(ns, serverName) / ns.getScriptRam(scriptName));
}

/**
 * @param {import('..').NS} ns
 * @param {string[]} serverNames
 * @param {string} scriptName
 * @param  {...any} args
 * @returns {number} number of servers that we killed
 */
function killScript(ns, serverNames, scriptName, ...args) {
  let killedServerCount = 0;
  for (const serverName of serverNames) {
    if (
      ns.isRunning(scriptName, serverName, ...args) &&
      ns.kill(scriptName, serverName, ...args)
    ) {
      killedServerCount++;
    }
  }
  return killedServerCount;
}
