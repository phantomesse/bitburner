import { formatMoney } from 'utils/format';
import { getMoneyAvailableToSpend } from 'utils/money';

/**
 * Manages purchasing and upgrading hacknet nodes.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.clearLog();

  while (true) {
    // Purchase new hacknet nodes.
    const purchaseNodeCost = ns.hacknet.getPurchaseNodeCost();
    while (purchaseNodeCost <= getMoneyAvailableToSpend(ns)) {
      const nodeIndex = ns.hacknet.purchaseNode();
      if (nodeIndex === -1) break;
      ns.print(
        `purchased ${getHacknetNodeName(nodeIndex)} for ${formatMoney(
          ns,
          purchaseNodeCost
        )}`
      );
    }

    for (let nodeIndex = 0; nodeIndex < ns.hacknet.numNodes(); nodeIndex++) {
      // Upgrade level.
      upgrade(
        ns,
        nodeIndex,
        'level',
        ns.hacknet.getLevelUpgradeCost,
        ns.hacknet.upgradeLevel,
        (level) => level
      );

      // Upgrade RAM.
      upgrade(
        ns,
        nodeIndex,
        'ram',
        ns.hacknet.getRamUpgradeCost,
        ns.hacknet.upgradeRam,
        (ram) => ns.formatRam(ram, 0)
      );

      // Upgrade cores.
      upgrade(
        ns,
        nodeIndex,
        'cores',
        ns.hacknet.getCoreUpgradeCost,
        ns.hacknet.upgradeCore,
        (cores) => cores
      );
    }

    await ns.sleep(1000);
  }
}
/**
 * Calculates the number of times to upgrade an aspect of a hacknet node based
 * on the available money to spend and attempts to perform the upgrade.
 *
 * @param {NS} ns
 * @param {number} nodeIndex
 * @param {('level'|'ram'|'cores')} aspectName
 * @param {(index: number, n?: number) => number} getUpgradeCostFn
 * @param {(index: number, n?: number) => number} upgradeFn
 * @param {(n: number) => string} formatAspect
 */
function upgrade(
  ns,
  nodeIndex,
  aspectName,
  getUpgradeCostFn,
  upgradeFn,
  formatAspect
) {
  // Do not upgrade hacknet nodes if the production time for 1 hour does not
  // account for the amount spent to upgrade.
  const productionPerSecond = ns.hacknet.getNodeStats(nodeIndex).production;
  const productionInOneHour = productionPerSecond * 60 * 60;

  // Calculate how many times we can upgrade.
  const moneyAvailableToSpend = Math.min(
    productionInOneHour,
    getMoneyAvailableToSpend(ns)
  );
  let upgradeAmount = 0;
  while (
    getUpgradeCostFn(nodeIndex, upgradeAmount + 1) <= moneyAvailableToSpend
  ) {
    upgradeAmount++;
  }
  if (upgradeAmount === 0) return;

  // Attempt to perform the upgrade.
  const upgradeCost = formatMoney(
    ns,
    getUpgradeCostFn(nodeIndex, upgradeAmount)
  );
  const success = upgradeFn(nodeIndex, upgradeAmount);
  if (!success) return;

  // Log the upgrade.
  const upgradedAspect = ns.hacknet.getNodeStats(nodeIndex)[aspectName];
  const oldAspect = upgradedAspect - upgradeAmount;
  const nodeName = getHacknetNodeName(nodeIndex);
  ns.print(
    `upgraded ${nodeName} ${aspectName} from ${formatAspect(
      oldAspect
    )} to ${formatAspect(upgradedAspect)} for ${upgradeCost}`
  );
}

/**
 * @param {number} nodeIndex
 * @returns {string}
 */
function getHacknetNodeName(nodeIndex) {
  return `hacknet-node-${nodeIndex}`;
}
