import { ONE_SECOND } from 'utils/constants';

const PROGRAM_NAMES = [
  'BruteSSH.exe',
  'FTPCrack.exe',
  'relaySMTP.exe',
  'HTTPWorm.exe',
  'SQLInject.exe',
];

/**
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    // Buy programs from the dark web.
    const hasTor = ns.singularity.purchaseTor();
    if (hasTor) {
      for (const programName of PROGRAM_NAMES) {
        ns.singularity.purchaseProgram(programName);
      }
    }

    // Upgrade home server.
    ns.singularity.upgradeHomeRam();
    ns.singularity.upgradeHomeCores();

    // Join factions.
    const factionsToJoin = ns.singularity.checkFactionInvitations();
    for (const faction of factionsToJoin) {
      ns.singularity.joinFaction(faction);
    }

    await ns.sleep(ONE_SECOND);
  }
}
