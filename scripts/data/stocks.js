const STOCK_DATA_FILE_NAME = 'data/stocks.json';

export class StockData {
  /** @type {string} */ symbol;
  /** @type {string} */ organization;
}

/**
 * @param {NS} ns
 * @param {StockData[]} stockDataList
 */
export function writeStockDataList(ns, stockDataList) {
  ns.write(STOCK_DATA_FILE_NAME, JSON.stringify(stockDataList), 'w');
}

/**
 * @param {NS} ns
 * @returns {StockData[]}
 */
export function getStockDataList(ns) {
  return JSON.parse(ns.read(STOCK_DATA_FILE_NAME));
}
