import { GANG_DATA_FILE_NAME, GangData, GangEquipmentData } from 'data/gang';
import { STOCK_DATA_FILE_NAME, StockData } from 'data/stocks';
import { GANG_EQUIPMENT_NAME_TO_TYPE_MAP, GangTaskName } from 'utils/gang';

/** @param {NS} ns */
export async function main(ns) {
  writeStockData(ns);
  writeGangData(ns);

  runScript(ns, 'manage-hacknet.js');
  runScript(ns, 'purchase-servers.js');
  runScript(ns, 'upgrade-servers.js');
  runScript(ns, 'manage-stocks.js');
  runScript(ns, 'manage-gang.js');
  runScript(ns, 'manage-hacking.js');
}

/**
 * @param {NS} ns
 * @param {string} scriptName
 */
function runScript(ns, scriptName) {
  if (!ns.isRunning(scriptName)) ns.run(scriptName);
}

/**
 * Saves information about the stock market to a file so that they can be
 * accessed without RAM penalties.
 *
 * @param {NS} ns
 */
function writeStockData(ns) {
  if (!ns.stock.hasTIXAPIAccess()) return;

  const stockDataList = [];
  const symbols = ns.stock.getSymbols();
  for (const symbol of symbols) {
    /** @type {StockData} */ const stockData = {
      symbol,
      organization: ns.stock.getOrganization(symbol),
      maxShares: ns.stock.getMaxShares(symbol),
    };
    stockDataList.push(stockData);
  }

  ns.write(STOCK_DATA_FILE_NAME, JSON.stringify(stockDataList), 'w');
}

/** @param {NS} ns  */
function writeGangData(ns) {
  if (!ns.gang.inGang()) return;

  // Task stats.
  const taskStatsList = Object.values(GangTaskName).map(ns.gang.getTaskStats);

  // Equipment stats.
  /** @type {GangEquipmentData[]} */ const equipmentDataList = [];
  const equipmentNames = Object.keys(GANG_EQUIPMENT_NAME_TO_TYPE_MAP);
  for (const equipmentName of equipmentNames) {
    equipmentDataList.push({
      name: equipmentName,
      type: GANG_EQUIPMENT_NAME_TO_TYPE_MAP[equipmentName],
      cost: ns.gang.getEquipmentCost(equipmentName),
      stats: ns.gang.getEquipmentStats(equipmentName),
    });
  }

  /** @type {GangData} */ const gangData = {
    taskStatsList,
    equipmentDataList,
  };

  ns.write(GANG_DATA_FILE_NAME, JSON.stringify(gangData), 'w');
}
