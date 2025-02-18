import { StockData, writeStockDataList } from 'data/stocks';

/** @param {NS} ns */
export async function main(ns) {
  writeStockData(ns);

  runScript(ns, 'manage/hacknet.js');
  runScript(ns, 'manage/purchase-servers.js');
  runScript(ns, 'manage/upgrade-servers.js');
  runScript(ns, 'manage/stocks.js');
  runScript(ns, 'manage/hacking.js');
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
  writeStockDataList(ns, stockDataList);
}
