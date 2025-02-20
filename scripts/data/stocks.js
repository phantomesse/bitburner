export const STOCK_DATA_FILE_NAME = 'data/stocks.json';

export class StockData {
  /** @type {string} */ symbol;
  /** @type {string} */ organization;
  /** @type {number} */ maxShares;
}

/**
 * @param {NS} ns
 * @returns {StockData[]}
 */
export function getStockDataList(ns) {
  return JSON.parse(ns.read(STOCK_DATA_FILE_NAME));
}
