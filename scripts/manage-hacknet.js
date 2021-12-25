/**
 * Manages buying and upgrading hacknet nodes.
 *
 * @param {import('..').NS } ns
 */
export async function main(ns) {
  while (true) {
    // Buy new nodes if we can.
    do {
      ns.hacknet.purchaseNode();
    } while (ns.hacknet.purchaseNode() > -1);

    // Upgrade nodes.
    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      ns.hacknet.upgradeCore(i, 1);
      ns.hacknet.upgradeRam(i, 1);
      ns.hacknet.upgradeLevel(i, 1);
      await ns.sleep(1000);
    }
  }
}
