import {
  getThreadsAvailableToRunScript,
  HACK_JS,
  GROW_JS,
  WEAKEN_JS,
} from 'utils/script';
import {
  getAllServerNames,
  getGrowScore,
  getHackScore,
  getWeakenScore,
  HOME_SERVER_NAME,
  isHackable,
} from 'utils/server';

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

    const rootAccessServerNames = allServerNames.filter(ns.hasRootAccess);
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

    for (const serverName of hackableServerNames) {
      const hackScore = getHackScore(ns, serverName);
      const growScore = getGrowScore(ns, serverName);
      const weakenScore = getWeakenScore(ns, serverName);
      const highestScore = Math.max(hackScore, growScore, weakenScore);

      if (highestScore === hackScore) {
        hack(ns, serverName, rootAccessServerNames);
      } else if (highestScore === growScore) {
        grow(ns, serverName, rootAccessServerNames);
      } else {
        weaken(ns, serverName, rootAccessServerNames);
      }
    }

    await ns.sleep(1000);
  }
}

/**
 * @param {NS} ns
 * @param {string} serverNameToHack
 * @param {string[]} rootAccessServerNames
 */
function hack(ns, serverNameToHack, rootAccessServerNames) {
  const currentlyAvailableMoney = ns.getServerMoneyAvailable(serverNameToHack);
  if (Math.round(currentlyAvailableMoney) === 0) {
    return;
  }

  const neededThreadCount =
    Math.floor(
      ns.hackAnalyzeThreads(serverNameToHack, currentlyAvailableMoney)
    ) -
    getAlreadyRunningThreadCount(
      ns,
      HACK_JS,
      serverNameToHack,
      rootAccessServerNames
    );
  if (neededThreadCount <= 0) return;

  runScript(
    ns,
    HACK_JS,
    serverNameToHack,
    rootAccessServerNames,
    neededThreadCount
  );
}

/**
 * @param {NS} ns
 * @param {string} serverNameToHack
 * @param {string[]} rootAccessServerNames
 */
function grow(ns, serverNameToGrow, rootAccessServerNames) {
  const availableMoney = ns.getServerMoneyAvailable(serverNameToGrow);
  const maxMoney = ns.getServerMaxMoney(serverNameToGrow);
  if (availableMoney / maxMoney > 0.5) return;

  const neededThreadCount =
    Math.floor(ns.growthAnalyze(serverNameToGrow, maxMoney / availableMoney)) -
    getAlreadyRunningThreadCount(
      ns,
      GROW_JS,
      serverNameToGrow,
      rootAccessServerNames
    );
  if (neededThreadCount <= 0) return;

  runScript(
    ns,
    GROW_JS,
    serverNameToGrow,
    rootAccessServerNames,
    neededThreadCount
  );
}

/**
 * @param {NS} ns
 * @param {string} serverNameToWeaken
 * @param {string[]} rootAccessServerNames
 */
function weaken(ns, serverNameToWeaken, rootAccessServerNames) {
  const currentSecurityLevel = ns.getServerSecurityLevel(serverNameToWeaken);
  const minSecurityLevel = ns.getServerMinSecurityLevel(serverNameToWeaken);
  if (currentSecurityLevel === minSecurityLevel) return;

  let neededThreadCount = 0;
  while (
    ns.weakenAnalyze(neededThreadCount + 1) <
    currentSecurityLevel - minSecurityLevel
  ) {
    neededThreadCount++;
  }
  neededThreadCount -= getAlreadyRunningThreadCount(
    ns,
    WEAKEN_JS,
    serverNameToWeaken,
    rootAccessServerNames
  );
  if (neededThreadCount <= 0) return;

  runScript(
    ns,
    WEAKEN_JS,
    serverNameToWeaken,
    rootAccessServerNames,
    neededThreadCount
  );
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
    const threadCount = Math.min(
      getThreadsAvailableToRunScript(ns, scriptName, rootAccessServerName),
      neededThreadCount
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
