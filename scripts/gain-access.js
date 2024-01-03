import { getServers } from 'database/servers';
import { ONE_MINUTE } from 'utils';

/**
 * Attempts to gain root access to servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  let hostnames = getServers(ns).map(server => server.hostname);

  do {
    for (const hostname of hostnames) {
      runProgram(() => ns.brutessh(hostname));
      runProgram(() => ns.ftpcrack(hostname));
      runProgram(() => ns.httpworm(hostname));
      runProgram(() => ns.relaysmtp(hostname));
      runProgram(() => ns.sqlinject(hostname));
      runProgram(() => ns.nuke(hostname));
    }
    hostnames = hostnames.filter(hostname => !ns.hasRootAccess(hostname));
    if (hostnames.length > 0) await ns.sleep(ONE_MINUTE);
  } while (hostnames.length > 0);
}

/** @param {function()} programFunction */
function runProgram(programFunction) {
  try {
    programFunction();
  } catch (_) {}
}
