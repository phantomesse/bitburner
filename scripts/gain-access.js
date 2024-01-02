import { getServers } from 'database/servers';
import { ONE_MINUTE } from 'utils';

/**
 * Attempts to gain root access to servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  let servers = getServers(ns);

  do {
    const serversToRemove = [];
    for (const server of servers) {
      const hostname = server.hostname;

      // Attempt to run programs to open ports and nuke to gain root access.
      runProgram(() => ns.brutessh(hostname));
      runProgram(() => ns.ftpcrack(hostname));
      runProgram(() => ns.httpworm(hostname));
      runProgram(() => ns.relaysmtp(hostname));
      runProgram(() => ns.sqlinject(hostname));
      runProgram(() => ns.nuke(hostname));

      if (ns.hasRootAccess(hostname)) {
        // Copy over scripts to faciliate hacking, weakening, and growing.
        ns.scp(['hack.js', 'grow.js', 'weaken.js'], hostname);

        serversToRemove.push(server);
      }
    }
    servers = servers.filter(server => !serversToRemove.includes(server));

    await ns.sleep(ONE_MINUTE);
  } while (servers.length > 0);
}

/** @param {function()} programFunction */
function runProgram(programFunction) {
  try {
    programFunction();
  } catch (_) {}
}
