import { getAllStockSymbols } from 'utils/stocks';

/** @param {NS} ns */
export async function main(ns) {
  const symbols = getAllStockSymbols(ns);

  for (const symbol of symbols) {
    const sharesOwned = ns.stock.getPosition(symbol)[0];
    if (sharesOwned === 0) continue;
    ns.stock.sellStock(symbol, sharesOwned);
  }
}
