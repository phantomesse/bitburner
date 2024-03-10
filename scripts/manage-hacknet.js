import { ONE_SECOND, HOME_HOSTNAME } from 'utils/constants';
import { formatMoney } from 'utils/format';
import { printTable } from 'utils/table';

const NODE_NAME_COLUMN = { name: 'Node Name', style: { width: 'max-content' } };
const PRODUCTION_COLUMN = {
  name: 'Production',
  style: { textAlign: 'center', width: 'max-content' },
};

/**
 * Manages purchasing and upgrading Hacknet nodes.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.atExit(() => ns.closeTail());

  // const augmentations = ns.singularity.getOwnedAugmentations();
  // ns.singularity.getAugmentationStats().hackn;

  // ns.tprint(
  //   formatMoney(
  //     ns,
  //     ns.formulas.hacknetNodes.hacknetNodeCost(ns.hacknet.numNodes() + 1, 1)
  //   )
  // );

  while (true) {
    ns.clearLog();
    const moneyAvailable = ns.getServerMoneyAvailable(HOME_HOSTNAME);

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

      // Upgrade cache.
      upgrade(
        () => ns.hacknet.getCacheUpgradeCost(i) < moneyAvailable,
        () => ns.hacknet.upgradeCache(i)
      );
    }

    log(ns);
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

/**
 * Logs to tail.
 *
 * @param {NS} ns
 */
function log(ns) {
  const nodeCount = ns.hacknet.numNodes();
  let totalProduction = 0;

  /** @type {import('utils/table').Table} */ const table = { rows: [] };
  for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
    const nodeStats = ns.hacknet.getNodeStats(nodeIndex);
    totalProduction += nodeStats.production;

    /** @type {import('utils/table').Row} */ const row = {
      cells: [
        { column: NODE_NAME_COLUMN, content: `hacknet-node-${nodeIndex}` },
        {
          column: PRODUCTION_COLUMN,
          content: formatMoney(ns, nodeStats.production) + ' / s',
        },
        {
          column: { name: 'Level', style: { textAlign: 'center' } },
          content: nodeStats.level,
        },
        {
          column: { name: 'RAM', style: { textAlign: 'center' } },
          content: ns.formatRam(nodeStats.ram),
        },
        {
          column: { name: 'Cores', style: { textAlign: 'center' } },
          content: nodeStats.cores,
        },
      ],
    };
    table.rows.push(row);
  }

  // Total row.
  table.rows.push({
    cells: [
      { column: NODE_NAME_COLUMN, content: 'TOTAL' },
      {
        column: PRODUCTION_COLUMN,
        content: formatMoney(ns, totalProduction) + ' / s',
      },
    ],
    style: {
      color: ns.ui.getTheme().success,
    },
  });

  printTable(ns, table);
}
