import {
  formatMoney,
  formatPercent,
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
  'getServerRequiredHackingLevel',
  'getServerUsedRam',
  'scan',
  'sleep',
];

const HOME_SERVER_NAME = 'home';
const RESERVED_RAM_FOR_HOME_SERVER = 10;

const GROW_SCRIPT = 'grow.js';
const HACK_SCRIPT = 'hack.js';
const WEAKEN_SCRIPT = 'weaken.js';

/**
 * Manages hacking servers.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);
  let currentTargetServerName;

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

    // Select the most hackable server.
    const hackableServerNames = sortByHackingHeuristic(
      ns,
      rootAccessServerNames.filter(serverName => isHackable(ns, serverName))
    );
    const targetServerName = hackableServerNames[0];
    const hackChance = ns.hackAnalyzeChance(targetServerName);
    const availableMoney = ns.getServerMoneyAvailable(targetServerName);
    if (targetServerName !== currentTargetServerName) {
      ns.tprint(
        `targetting ${targetServerName} with ${formatMoney(
          availableMoney
        )} available and hack chance of ${formatPercent(hackChance)}`
      );
      currentTargetServerName = targetServerName;
    }

    // Grow the server until it is at least 10% of its max amount.
    const availableMoneyPercent =
      availableMoney / ns.getServerMaxMoney(targetServerName);
    const needsToGrow = availableMoneyPercent < 0.1;
    if (needsToGrow) {
      ns.print(
        `growing ${targetServerName} - ${formatMoney(
          availableMoney
        )} (${formatPercent(availableMoneyPercent)})`
      );
      executeScript(
        ns,
        rootAccessServerNames,
        GROW_SCRIPT,
        targetServerName,
        1
      );
    }

    // Weaken the server to hack until it is at least 60% hackable.
    const needsToWeaken = hackChance < 0.6;
    if (needsToWeaken) {
      ns.print(
        `weakening ${targetServerName} - hack chance ${formatPercent(
          hackChance
        )}`
      );
      executeScript(
        ns,
        rootAccessServerNames,
        WEAKEN_SCRIPT,
        targetServerName,
        1
      );
    }

    // Hack the server.
    if (!needsToGrow && !needsToWeaken) {
      ns.print(
        `hacking ${targetServerName} with ${formatMoney(
          availableMoney
        )} available and hack chance of ${formatPercent(hackChance)}`
      );
      executeScript(
        ns,
        rootAccessServerNames,
        HACK_SCRIPT,
        targetServerName,
        1
      );
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
 * Executes a script on multiple servers.
 *
 * @param {import('..').NS} ns
 * @param {string[]} serverNames
 * @param {string} script
 * @param {string[]} args
 */
function executeScript(ns, serverNames, script, ...args) {
  for (const serverName of serverNames) {
    if (ns.isRunning(script, serverName, ...args)) continue;
    const freeRam =
      ns.getServerMaxRam(serverName) -
      ns.getServerUsedRam(serverName) -
      (serverName === HOME_SERVER_NAME ? RESERVED_RAM_FOR_HOME_SERVER : 0);
    const threadCount = Math.floor(freeRam / ns.getScriptRam(script));
    if (threadCount === 0) continue;
    ns.exec(script, serverName, threadCount, ...args);
  }
}
