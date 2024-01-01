import { getAllHostnames, ONE_MINUTE } from 'utils';

/**
 * Gains root access in servers and spawn hack-server.js for each server with
 * root access.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const hostnames = getAllHostnames(ns);

  while (hostnames.length > 0) {
    const hostnamesWithRootAccess = [];

    for (const hostname of hostnames) {
      runProgram(() => ns.brutessh(hostname));
      runProgram(() => ns.nuke(hostname));

      if (ns.hasRootAccess(hostname)) {
        // Copy over hack-server.js to the new server and have it hack itself.
        ns.scp('hack-server.js', hostname);
        const availableRam =
          ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
        const hackServerRam = ns.getScriptRam('hack-server.js', hostname);
        const threads = Math.floor(availableRam / hackServerRam);
        if (threads > 0) ns.exec('hack-server.js', hostname, threads, hostname);

        // Spawn a script to hack the server.
        ns.run('hack-server.js', 1, hostname);
        hostnamesWithRootAccess.push(hostname);
      }
    }

    for (const hostname of hostnamesWithRootAccess) {
      hostnames.splice(hostnames.indexOf(hostname), 1);
    }

    await ns.sleep(ONE_MINUTE);
  }
}

/** @param {function()} programFunction */
function runProgram(programFunction) {
  try {
    programFunction();
  } catch (_) {}
}
