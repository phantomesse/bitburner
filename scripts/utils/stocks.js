import { getStockDataList } from 'data/stocks';

/** @param {NS} ns */
export function getAllStockSymbols(ns) {
  return getStockDataList(ns).map((stockData) => stockData.symbol);
}
