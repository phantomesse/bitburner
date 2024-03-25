import { UPDATE_SERVERS_SCRIPT, queueScript } from 'utils/scripts';
import { ONE_SECOND } from 'utils/time';

/**
 * Buy darkweb access & buy programs for root access.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    // Buy TOR router for access to darkweb.
    while (!ns.singularity.purchaseTor()) {
      await ns.sleep(ONE_SECOND);
    }

    // Buy darkweb programs.
    const programs = [
      'BruteSSH.exe',
      'FTPCrack.exe',
      'relaySMTP.exe',
      'HTTPWorm.exe',
      'SQLInject.exe',
    ].filter(program => !ns.fileExists(program));
    if (programs.length === 0) return;
    for (const program of programs) {
      const wasSuccessful = ns.singularity.purchaseProgram(program);
      if (wasSuccessful) {
        queueScript(ns, 'gain-access.js');
        ns.toast(`Bought ${program}`);
      }
    }

    await ns.sleep(ONE_SECOND);
  }
}
