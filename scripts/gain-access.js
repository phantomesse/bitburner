import { GROW_SCRIPT, HACK_SCRIPT, WEAKEN_SCRIPT } from 'utils/scripts';
import { getAllServers } from 'utils/servers';

/**
 * Tries to gain root access to all servers.
 *
 * @param {NS} ns
 */
export function main(ns) {
  const servers = getAllServers(ns);

  for (const server of servers) {
    // Run darkweb programs and nuke.
    if (!server.hasRootAccess) {
      const programFns = [
        ns.brutessh,
        ns.ftpcrack,
        ns.relaysmtp,
        ns.httpworm,
        ns.sqlinject,
        ns.nuke,
      ];
      for (const programFn of programFns) {
        maybeRunProgram(programFn, server.hostname);
      }
    }

    // Copy over hack/weaken/grow scripts.
    if (ns.hasRootAccess(server.hostname)) {
      copyHackWeakenGrowScripts(ns, server.hostname);
    }
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

/**
 * Copies over hack/weaken/grow scripts to a server.
 *
 * @param {NS} ns
 * @param {string} hostname
 */
function copyHackWeakenGrowScripts(ns, hostname) {
  ns.scp([HACK_SCRIPT, WEAKEN_SCRIPT, GROW_SCRIPT], hostname);
}
