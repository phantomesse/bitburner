import {
  getThreadsAvailableToRunScript,
  HACK_JS,
  GROW_JS,
  WEAKEN_JS,
  NUKE_JS,
} from 'utils/script';
import {
  getAllServerNames,
  HOME_SERVER_NAME,
  isHackable,
  isOwned,
} from 'utils/server';

/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    const allServerNames = getAllServerNames(ns);

    const ownedServerNames = allServerNames.filter(isOwned);
    const unownedServerNames = allServerNames.filter(
      (serverName) => !isOwned(serverName)
    );
    for (const serverName of unownedServerNames) {
      if (!ns.hasRootAccess(serverName)) ns.run(NUKE_JS, {}, serverName);

      if (isHackable(ns, serverName)) {
        if (ns.hackAnalyzeChance(serverName) > 0.5) {
          hack(ns, serverName, ownedServerNames);
        }

        weaken(ns, serverName, ownedServerNames);
        grow(ns, serverName, ownedServerNames);
      }
    }

    await ns.sleep(1000);
  }
}

/**
 * @param {NS} ns
 * @param {string} serverNameToHack
 * @param {string[]} ownedServerNames
 */
function hack(ns, serverNameToHack, ownedServerNames) {
  const currentlyAvailableMoney = ns.getServerMoneyAvailable(serverNameToHack);
  if (Math.round(currentlyAvailableMoney) === 0) {
    return;
  }

  const neededThreadCount = Math.floor(
    ns.hackAnalyzeThreads(serverNameToHack, currentlyAvailableMoney)
  );

  runScript(ns, HACK_JS, serverNameToHack, ownedServerNames, neededThreadCount);
}

/**
 * @param {NS} ns
 * @param {string} serverNameToHack
 * @param {string[]} ownedServerNames
 */
function grow(ns, serverNameToGrow, ownedServerNames) {
  const currentlyAvailableMoney = ns.getServerMoneyAvailable(serverNameToGrow);
  const maxMoney = ns.getServerMaxMoney(serverNameToGrow);
  if (currentlyAvailableMoney / maxMoney > 0.5) return;

  const neededThreadCount = Math.floor(
    ns.growthAnalyze(serverNameToGrow, maxMoney / currentlyAvailableMoney)
  );

  runScript(ns, GROW_JS, serverNameToGrow, ownedServerNames, neededThreadCount);
}

/**
 * @param {NS} ns
 * @param {string} serverNameToWeaken
 * @param {string[]} ownedServerNames
 */
function weaken(ns, serverNameToWeaken, ownedServerNames) {
  const currentSecurityLevel = ns.getServerSecurityLevel(serverNameToWeaken);
  const minSecurityLevel = ns.getServerMinSecurityLevel(serverNameToWeaken);
  if (currentSecurityLevel === minSecurityLevel) return;
  runScript(ns, WEAKEN_JS, serverNameToWeaken, ownedServerNames, 1);
}

/**
 * @param {NS} ns
 * @param {string} scriptName
 * @param {string} targetServerName
 * @param {string[]} ownedServerNames
 * @param {number} neededThreadCount of threads needed
 */
function runScript(
  ns,
  scriptName,
  targetServerName,
  ownedServerNames,
  neededThreadCount
) {
  for (const ownedServerName of ownedServerNames) {
    if (!ns.fileExists(scriptName, ownedServerName)) {
      ns.scp(scriptName, ownedServerName, HOME_SERVER_NAME);
    }
    const threadCount = Math.min(
      getThreadsAvailableToRunScript(ns, scriptName, ownedServerName),
      neededThreadCount
    );
    if (neededThreadCount === 0) return;
    if (threadCount <= 0) continue;
    const pid = ns.exec(
      scriptName,
      ownedServerName,
      threadCount,
      targetServerName
    );
    if (pid > 0) neededThreadCount -= threadCount;
  }
}
