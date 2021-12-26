const MIN_POWER = 3; // Min RAM that we want is at least 8GB
const MAX_POWER = 20; // Max RAM is 2^20
const HOSTNAME = 'lauren';

/**
 * Continuously try to buy more servers.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  while (true) {
    for (let power = MAX_POWER; power >= MIN_POWER; power--) {
      const ram = Math.pow(2, power);
      const cost = ns.getPurchasedServerCost(ram);
      if (ns.getPlayer().money > cost) {
        const server = ns.purchaseServer(HOSTNAME, ram);
        ns.tprint(`bought server (${server}) with ${ram} RAM`);
      }
    }

    // Wait 5 minutes before buying another server.
    await ns.sleep(1000 * 60 * 5);
  }
}
