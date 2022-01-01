import { getAllServerNames, getPath } from '/utils/servers.js';

/**
 * Finds any servers that do not have backdoor installed and can have backdoor
 * installed.
 *
 * @param {import('..').NS} ns
 */
export async function main(ns) {
  const serverNames = getAllServerNames(ns).filter(serverName => {
    const server = ns.getServer(serverName);
    return (
      server.hasAdminRights &&
      !server.backdoorInstalled &&
      server.requiredHackingSkill <= ns.getHackingLevel() &&
      !server.purchasedByPlayer
    );
  });

  if (serverNames.length === 0) {
    ns.tprint('No servers that we can install backdoor available.');
    return;
  }

  ns.tprint(
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
}
