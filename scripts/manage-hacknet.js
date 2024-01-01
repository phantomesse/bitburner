import { ONE_SECOND } from 'utils';

/**
 * Manages purchasing and upgrading Hacknet nodes.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    // Attempt to purchase a new node.
    if (ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()) {
      ns.hacknet.purchaseNode();
    }

    const nodeCount = ns.hacknet.numNodes();
    for (let i = 0; i < nodeCount; i++) {
      // Upgrade level.
      upgrade(() => ns.hacknet.upgradeLevel(i));

      // Upgrade RAM.
      upgrade(() => ns.hacknet.upgradeRam(i));

      // Upgrade cores.
      upgrade(() => ns.hacknet.upgradeCore(i));
    }

    await ns.sleep(ONE_SECOND);
  }
}

/**
 * Upgrades using the given upgrade function until it is no longer possible.
 *
 * @param {function():boolean} upgradeFunction
 */
function upgrade(upgradeFunction) {
  let canUpgrade;
  do {
    canUpgrade = upgradeFunction();
  } while (canUpgrade);
}
