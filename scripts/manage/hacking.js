import {
  getThreadsAvailableToRunScript,
  HACK_JS,
  GROW_JS,
  WEAKEN_JS,
  getAvailableThreadsAcrossAllRootAccessServers as getTotalThreadsAcrossAllRootAccessServers,
} from 'utils/script';
import {
  getAllServerNames,
  getGrowScore,
  getHackScore,
  getWeakenScore,
  HOME_SERVER_NAME,
  isHackable,
} from 'utils/server';

const MAX_THREAD_COUNT = Infinity;

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.clearLog();

  while (true) {
    const allServerNames = getAllServerNames(ns);

    for (const serverName of allServerNames) {
      if (!ns.hasRootAccess(serverName)) {
        runProgram(() => ns.brutessh(serverName));
        runProgram(() => ns.ftpcrack(serverName));
        runProgram(() => ns.relaysmtp(serverName));
        runProgram(() => ns.httpworm(serverName));
        runProgram(() => ns.sqlinject(serverName));
        runProgram(() => ns.nuke(serverName));
      }
    }

    // Move home server to the last in the root access server names so that we
    // save as much RAM on home as possible.
    const rootAccessServerNames = [
      ...allServerNames.filter(
        (serverName) =>
          serverName !== HOME_SERVER_NAME && ns.hasRootAccess(serverName)
      ),
      HOME_SERVER_NAME,
    ];

    const hackableServerNames = allServerNames
      .filter((serverName) => isHackable(ns, serverName))
      .sort(
        (server1, server2) =>
          Math.max(
            getHackScore(ns, server2),
            getGrowScore(ns, server2),
            getWeakenScore(ns, server2)
          ) -
          Math.max(
            getHackScore(ns, server1),
            getGrowScore(ns, server1),
            getWeakenScore(ns, server1)
          )
      );

    const hackTimeToServerNameMap = {};
    const growTimeToServerNameMap = {};
    const weakenTimeToServerNameMap = {};
    for (const targetServerName of hackableServerNames) {
      const hackScore = getHackScore(ns, targetServerName);
      const growScore = getGrowScore(ns, targetServerName);
      const weakenScore = getWeakenScore(ns, targetServerName);
      const highestScore = Math.max(hackScore, growScore, weakenScore);

      if (highestScore === hackScore) {
        hack(ns, targetServerName, rootAccessServerNames);
      } else if (highestScore === growScore) {
        grow(ns, targetServerName, rootAccessServerNames);
      } else {
        weaken(ns, targetServerName, rootAccessServerNames);
      }

      hackTimeToServerNameMap[ns.getHackTime(targetServerName)] =
        targetServerName;
      growTimeToServerNameMap[ns.getGrowTime(targetServerName)] =
        targetServerName;
      weakenTimeToServerNameMap[ns.getWeakenTime(targetServerName)] =
        targetServerName;
    }

    const fastestToHackServerName = Object.entries(
      hackTimeToServerNameMap
    ).sort((entry1, entry2) => entry1[0] - entry2[0])[0][1];
    const fastestToGrowServerName = Object.entries(
      growTimeToServerNameMap
    ).sort((entry1, entry2) => entry1[0] - entry2[0])[0][1];
    const fastestToWeakenServerName = Object.entries(
      weakenTimeToServerNameMap
    ).sort((entry1, entry2) => entry1[0] - entry2[0])[0][1];
    for (const rootAccessServerName of rootAccessServerNames) {
      let weakenThreadCount = getThreadsAvailableToRunScript(
        ns,
        WEAKEN_JS,
        rootAccessServerName
      );
      if (weakenThreadCount > 0) {
        weaken(ns, fastestToWeakenServerName, [rootAccessServerName]);
      }

      const growThreadCount = getThreadsAvailableToRunScript(
        ns,
        GROW_JS,
        rootAccessServerName
      );
      if (growThreadCount > 0) {
        grow(ns, fastestToGrowServerName, [rootAccessServerName]);
      }

      const hackThreadCount = getThreadsAvailableToRunScript(
        ns,
        HACK_JS,
        rootAccessServerName
      );
      if (hackThreadCount > 0) {
        hack(ns, fastestToHackServerName, [rootAccessServerName]);
      }

      // Weaken fastest to weaken server even if it's at the min security level
      // just for the hack skill gain.
      if (!ns.fileExists(WEAKEN_JS, rootAccessServerName)) {
        ns.scp(WEAKEN_JS, rootAccessServerName, HOME_SERVER_NAME);
      }
      weakenThreadCount = getThreadsAvailableToRunScript(
        ns,
        WEAKEN_JS,
        rootAccessServerName
      );
      if (weakenThreadCount > 0) {
        ns.exec(
          WEAKEN_JS,
          rootAccessServerName,
          weakenThreadCount,
          fastestToWeakenServerName
        );
      }
    }

    await ns.sleep(1000);
  }
}

/**
 * @param {NS} ns
 * @param {string} targetServer
 * @param {string[]} rootAccessServerNames
 */
function hack(ns, targetServer, rootAccessServerNames) {
  const currentlyAvailableMoney = ns.getServerMoneyAvailable(targetServer);
  if (Math.round(currentlyAvailableMoney) === 0) {
    return;
  }

  const maxThreadCount =
    getTotalThreadsAcrossAllRootAccessServers(ns, HACK_JS) / 2;
  const neededThreadCount =
    Math.min(
      Math.floor(
        ns.hackAnalyzeThreads(targetServer, currentlyAvailableMoney / 2)
      ),
      maxThreadCount
    ) -
    getAlreadyRunningThreadCount(
      ns,
      HACK_JS,
      targetServer,
      rootAccessServerNames
    );
  if (neededThreadCount <= 0) return;

  runScript(
    ns,
    HACK_JS,
    targetServer,
    rootAccessServerNames,
    neededThreadCount
  );
}

/**
 * @param {NS} ns
 * @param {string} targetServerName
 * @param {string[]} rootAccessServerNames
 */
function grow(ns, targetServerName, rootAccessServerNames) {
  const availableMoney = ns.getServerMoneyAvailable(targetServerName);
  const maxMoney = ns.getServerMaxMoney(targetServerName);
  if (availableMoney === maxMoney) return;

  const maxThreadCount =
    getTotalThreadsAcrossAllRootAccessServers(ns, GROW_JS) / 2;
  const neededThreadCount =
    Math.min(getThreadCountNeededToGrow(ns, targetServerName), maxThreadCount) -
    getAlreadyRunningThreadCount(
      ns,
      GROW_JS,
      targetServerName,
      rootAccessServerNames
    );
  if (neededThreadCount <= 0) return;

  runScript(
    ns,
    GROW_JS,
    targetServerName,
    rootAccessServerNames,
    neededThreadCount
  );
}

/**
 * @param {NS} ns
 * @param {string} targetServerName
 * @param {number = 1} cores
 */
function getThreadCountNeededToGrow(ns, targetServerName, cores = 1) {
  const availableMoney = ns.getServerMoneyAvailable(targetServerName);
  const maxMoney = ns.getServerMaxMoney(targetServerName);
  return Math.floor(
    ns.growthAnalyze(
      targetServerName,
      availableMoney === 0 ? 2 : maxMoney / availableMoney,
      cores
    )
  );
}

/**
 * @param {NS} ns
 * @param {string} targetServerName
 * @param {string[]} rootAccessServerNames
 */
function weaken(ns, targetServerName, rootAccessServerNames) {
  const currentSecurityLevel = ns.getServerSecurityLevel(targetServerName);
  const minSecurityLevel = ns.getServerMinSecurityLevel(targetServerName);
  if (currentSecurityLevel === minSecurityLevel) return;

  const maxThreadCount =
    getTotalThreadsAcrossAllRootAccessServers(ns, WEAKEN_JS) / 2;
  const neededThreadCount =
    Math.min(
      getThreadCountNeededToWeaken(ns, targetServerName),
      maxThreadCount
    ) -
    getAlreadyRunningThreadCount(
      ns,
      WEAKEN_JS,
      targetServerName,
      rootAccessServerNames
    );
  if (neededThreadCount <= 0) return;

  runScript(
    ns,
    WEAKEN_JS,
    targetServerName,
    rootAccessServerNames,
    neededThreadCount
  );
}

/**
 * @param {NS} ns
 * @param {string} targetServerName
 * @param {number = 1} cores
 */
function getThreadCountNeededToWeaken(ns, targetServerName, cores = 1) {
  const currentSecurityLevel = ns.getServerSecurityLevel(targetServerName);
  const minSecurityLevel = ns.getServerMinSecurityLevel(targetServerName);

  let neededThreadCount = 0;
  while (
    ns.weakenAnalyze(neededThreadCount + 1, cores) <
    currentSecurityLevel - minSecurityLevel
  ) {
    neededThreadCount++;
  }
  return neededThreadCount;
}

/**
 * @param {NS} ns
 * @param {string} scriptName
 * @param {string} targetServerName
 * @param {string[]} rootAccessServerNames
 * @param {number} neededThreadCount of threads needed
 */
function runScript(
  ns,
  scriptName,
  targetServerName,
  rootAccessServerNames,
  neededThreadCount
) {
  for (const rootAccessServerName of rootAccessServerNames) {
    if (!ns.fileExists(scriptName, rootAccessServerName)) {
      ns.scp(scriptName, rootAccessServerName, HOME_SERVER_NAME);
    }

    let threadDiscountFromCpuCores = 0; // Only for grow and weaken.
    if (scriptName === GROW_JS) {
      threadDiscountFromCpuCores =
        neededThreadCount -
        getThreadCountNeededToGrow(
          ns,
          targetServerName,
          ns.getServer(rootAccessServerName).cpuCores
        );
    }
    if (scriptName === WEAKEN_JS) {
      threadDiscountFromCpuCores =
        neededThreadCount -
        getThreadCountNeededToWeaken(
          ns,
          targetServerName,
          ns.getServer(rootAccessServerName).cpuCores
        );
    }

    const threadCount = Math.min(
      getThreadsAvailableToRunScript(ns, scriptName, rootAccessServerName),
      neededThreadCount - threadDiscountFromCpuCores
    );
    if (neededThreadCount === 0) return;
    if (threadCount <= 0) continue;
    const pid = ns.exec(
      scriptName,
      rootAccessServerName,
      threadCount,
      targetServerName
    );
    if (pid > 0) neededThreadCount -= threadCount;
  }
}

/**
 * @param {NS} ns
 * @param {string} scriptName
 * @param {string} targetServerName
 * @param {string[]} rootAccessServerNames
 * @returns {number} number of threads that are already running for a given
 *                   script and target server
 */
function getAlreadyRunningThreadCount(
  ns,
  scriptName,
  targetServerName,
  rootAccessServerNames
) {
  let alreadyRunningThreadCount = 0;
  for (const rootAccessServerName of rootAccessServerNames) {
    const processes = ns
      .ps(rootAccessServerName)
      .filter(
        (process) =>
          process.filename === scriptName &&
          process.args[0] === targetServerName
      );
    for (const process of processes) {
      alreadyRunningThreadCount += process.threads;
    }
  }
  return alreadyRunningThreadCount;
}

/** @param {function} programFn */
function runProgram(programFn) {
  try {
    programFn();
  } catch (_) {}
}
