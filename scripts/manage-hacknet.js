import { ONE_SECOND, HOME_HOSTNAME } from 'utils';

/**
 * Manages purchasing and upgrading Hacknet nodes.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    const moneyAvailable = ns.getServerMoneyAvailable(HOME_HOSTNAME) / 2;

    // Attempt to purchase a new node.
    if (
      ns.hacknet.numNodes() < ns.hacknet.maxNumNodes() &&
      ns.hacknet.getPurchaseNodeCost() < moneyAvailable
    ) {
      ns.hacknet.purchaseNode();
    }

    const nodeCount = ns.hacknet.numNodes();
    for (let i = 0; i < nodeCount; i++) {
      // Upgrade level.
      upgrade(
        () => ns.hacknet.getLevelUpgradeCost(i) < moneyAvailable,
        () => ns.hacknet.upgradeLevel(i)
      );

      // Upgrade RAM.
      upgrade(
        () => ns.hacknet.getRamUpgradeCost(i) < moneyAvailable,
        () => ns.hacknet.upgradeRam(i)
      );

      // Upgrade cores.
      upgrade(
        () => ns.hacknet.getCoreUpgradeCost(i) < moneyAvailable,
        () => ns.hacknet.upgradeCore(i)
      );
    }

    await ns.sleep(ONE_SECOND);
  }
}

/**
 * Upgrades using the given upgrade function until it is no longer possible.
 *
 * @param {function():boolean} canUpgradeFunction
 * @param {function():boolean} upgradeFunction
 */
function upgrade(canUpgradeFunction, upgradeFunction) {
  let canUpgrade;
  do {
    canUpgrade = canUpgradeFunction();
    canUpgrade = upgradeFunction();
  } while (canUpgrade);
}
