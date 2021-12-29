const DISABLE_LOGGING_FUNCTIONS = ['sleep'];

/**
 * Manages buying and upgrading hacknet nodes.
 *
 * @param {import('..').NS} ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  while (true) {
    // Buy new nodes if we can.
    let nodesPurchased = 0;
    while (ns.hacknet.purchaseNode() > -1) nodesPurchased++;
    if (nodesPurchased > 0) {
      ns.print(`purchased ${nodesPurchased} new hacknet nodes`);
    }

    // Upgrade nodes.
    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      // Upgrade cores.
      let coresUpgraded = 0;
      while (ns.hacknet.upgradeCore(i, 1)) coresUpgraded++;
      if (coresUpgraded > 0) {
        ns.print(`upgraded hacknet-node-${i} cores ${coresUpgraded} times`);
      }

      // Upgrade RAM.
      let ramUpgraded = 0;
      while (ns.hacknet.upgradeRam(i, 1)) ramUpgraded++;
      if (ramUpgraded > 0) {
        ns.print(`upgraded hacknet-node-${i} RAM ${ramUpgraded} times`);
      }

      // Upgrade level.
      let levelsUpgraded = 0;
      while (ns.hacknet.upgradeLevel(i, 1)) levelsUpgraded++;
      if (levelsUpgraded > 0) {
        ns.print(`upgraded hacknet-node-${i} levels ${levelsUpgraded} times`);
      }

      await ns.sleep(1000);
    }
  }
}
