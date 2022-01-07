const PROGRAMS = [
  'BruteSSH.exe',
  'FTPCrack.exe',
  'relaySMTP.exe',
  'HTTPWorm.exe',
  'SQLInject.exe',
];

/**
 * Buys TOR router and programs.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  const player = ns.getPlayer();

  // Buy TOR router.
  while (!player.tor) {
    const success = ns.purchaseTor();
    if (success) ns.toast('Bought TOR router');
    await ns.sleep(1000);
  }

  // Buy programs.
  for (const program of PROGRAMS) {
    while (!ns.fileExists(program)) {
      const success = ns.purchaseProgram(program);
      if (success) ns.toast('Bought ' + program);
      await ns.sleep(1000);
    }
  }
}
