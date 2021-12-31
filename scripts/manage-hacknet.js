import { getMoneyToSpend } from '/utils/misc.js';

const DISABLE_LOGGING_FUNCTIONS = ['sleep', 'getServerMoneyAvailable'];

/**
 * Manages buying and upgrading hacknet nodes.
 *
 * @param {import('..').NS} ns
 */
export async function main(ns) {
  DISABLE_LOGGING_FUNCTIONS.forEach(ns.disableLog);

  while (true) {
    // Buy new nodes if we can.
    const moneyToSpend = getMoneyToSpend(ns);
    let nodesPurchased = 0;
    while (ns.hacknet.getPurchaseNodeCost() < moneyToSpend) {
      if (ns.hacknet.purchaseNode() === -1) break;
      nodesPurchased++;
    }
    if (nodesPurchased > 0) {
      ns.print(`purchased ${nodesPurchased} new hacknet nodes`);
    }

    // Upgrade nodes.
    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      // Upgrade cores.
      const coresUpgraded = upgrade(
        ns,
        i,
        ns.hacknet.getCoreUpgradeCost,
        ns.hacknet.upgradeCore
      );
      if (coresUpgraded > 0) {
        ns.print(`upgraded hacknet-node-${i} cores ${coresUpgraded} times`);
      }

      // Upgrade RAM.
      const ramUpgraded = upgrade(
        ns,
        i,
        ns.hacknet.getRamUpgradeCost,
        ns.hacknet.upgradeRam
      );
      if (ramUpgraded > 0) {
        ns.print(`upgraded hacknet-node-${i} RAM ${ramUpgraded} times`);
      }

      // Upgrade level.
      const levelsUpgraded = upgrade(
        ns,
        i,
        ns.hacknet.getLevelUpgradeCost,
        ns.hacknet.upgradeLevel
      );
      if (levelsUpgraded > 0) {
        ns.print(`upgraded hacknet-node-${i} levels ${levelsUpgraded} times`);
      }

      await ns.sleep(1000);
    }
  }
}

/**
 * Calculates the cost of upgrading an aspect of a node.
 *
 * @typedef UpgradeCostFn
 * @param {number} nodeIndex
 * @param {number} upgradeCount
 * @returns {number} cost of upgrade
 */

/**
 * Upgrades an aspect of a node.
 *
 * @typedef UpgradeFn
 * @param {number} nodeIndex
 * @param {number} upgradeCount
 * @returns {boolean} whether the upgrade was successful
 */

/**
 * @param {import('..').NS} ns
 * @param {int} nodeIndex
 * @param {UpgradeCostFn} getUpgradeCostFn
 * @param {UpgradeFn} upgradeFn
 * @param {number} moneyToSpend
 * @returns {number} number of upgrades successful
 */
function upgrade(ns, nodeIndex, getUpgradeCostFn, upgradeFn) {
  const moneyToSpend = getMoneyToSpend(ns);
  let upgradeCount = 0;
  while (getUpgradeCostFn(nodeIndex, ++upgradeCount) < moneyToSpend);
  if (upgradeCount === 0) return 0;
  return upgradeFn(nodeIndex, upgradeCount) ? upgradeCount : 0;
}
