import { getAllServers } from 'utils/servers';

/**
 * Tries to gain root access to all servers.
 *
 * @param {NS} ns
 */
export function main(ns) {
  const hostnames = getAllServers(ns)
    .filter(server => !server.hasRootAccess)
    .map(server => server.hostname);

  for (const hostname of hostnames) {
    // Run darkweb programs and nuke.
    const programFns = [
      ns.brutessh,
      ns.ftpcrack,
      ns.relaysmtp,
      ns.httpworm,
      ns.sqlinject,
      ns.nuke,
    ];
    for (const programFn of programFns) maybeRunProgram(programFn, hostname);
  }
}

/**
 * Try-catches running a program function.
 *
 * @param {function(string)} programFn
 * @param {string} hostname
 */
function maybeRunProgram(programFn, hostname) {
  try {
    programFn(hostname);
  } catch (_) {}
}
