const PROGRAMS = [
  'SQLInject.exe',
  'HTTPWorm.exe',
  'relaySMTP.exe',
  'FTPCrack.exe',
  'BruteSSH.exe',
];

/**
 * Buys TOR router and programs.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  const player = ns.getPlayer();

  // Buy TOR router.
  if (!player.tor) {
    while (!ns.purchaseTor()) await ns.sleep(1000);
    ns.toast('Bought TOR');
  }

  // Buy programs.
  let programsToBuy;
  do {
    programsToBuy = PROGRAMS.filter(program => !ns.fileExists(program));

    for (const program of programsToBuy) {
      if (ns.isBusy() && ns.getPlayer().createProgramName === program) {
        continue;
      }
      const success = ns.purchaseProgram(program);
      if (success) ns.toast('Bought ' + program);
    }

    await ns.sleep(1000);
  } while (programsToBuy.length > 0);
}
