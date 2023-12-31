import {
  getAllServerNames,
  getPath,
  HOME_SERVER_NAME,
  PURCHASED_SERVER_PREFIX,
} from '/utils/servers.js';

const DISABLE_LOGGING_FUNCTIONS = ['scan', 'sleep', 'getHackingLevel'];

/**
 * Finds any servers that do not have backdoor installed and can have backdoor
 * installed.
 *
 * Run this script with `--tail`.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  const hackableServerNames = getAllServerNames(ns).filter(
    server =>
      server !== HOME_SERVER_NAME && !server.startsWith(PURCHASED_SERVER_PREFIX)
  );

  // If we have SF4, then we can automatically run the backdoors.
  try {
    const serverNames = _getBackdoorableServerNames(ns, hackableServerNames);
    for (const serverName of serverNames) {
      _connectTo(ns, serverName, ns.getCurrentServer());
      await ns.installBackdoor();
    }
    _connectTo(ns, HOME_SERVER_NAME, ns.getCurrentServer());
  } catch (_) {
    // No Source File 4 API
  }

  while (true) {
    const serverNames = _getBackdoorableServerNames(ns, hackableServerNames);

    if (serverNames.length === 0) {
      ns.print('No servers that we can install backdoor available.');
      ns.tprint('No servers that we can install backdoor available.');
      return;
    }

    ns.clearLog();
    ns.print(
      '\n' +
        serverNames
          .map(
            serverName =>
              `${serverName}\n${[
                'home',
                ...getPath(ns, serverName).map(path => `connect ${path}`),
                'backdoor',
              ].join('; ')}`
          )
          .join('\n\n')
    );

    await ns.sleep(1000);
  }
}

/** @param {import('index').NS} ns */
function _getBackdoorableServerNames(ns, hackableServerNames) {
  return hackableServerNames.filter(serverName => {
    const server = ns.getServer(serverName);
    return (
      server.hasAdminRights &&
      !server.backdoorInstalled &&
      server.requiredHackingSkill <= ns.getHackingLevel()
    );
  });
}

/** @param {import('index').NS} ns */
function _connectTo(ns, serverName, lastServerName) {
  const path = getPath(ns, serverName, lastServerName, '');
  for (const server of path) ns.connect(server);
}
