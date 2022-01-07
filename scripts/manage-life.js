/**
 * Manages life when we're not busy playing.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  while (true) {
    const player = ns.getPlayer();
    if (ns.isBusy() && player.isWorking) {
      ns.toast('Working!');
      await ns.sleep(1000);
      continue;
    }

    // // Player is no longer working.
    // if (ns.isBusy()) {
    //   ns.toast(player.className);
    // } else if (player.charisma < 200) {
    //   ns.universityCourse('rothman university', 'Leadership');
    // }

    // await ns.sleep(1000);
  }
}
