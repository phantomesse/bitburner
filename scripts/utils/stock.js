const COMMISSION_FEE = 100000;

/**
 * Gets how much a stock is worth based on how much of it we own and how much
 * the bid price is.
 *
 * @param {import ('../index').NS} ns
 * @param {string} symbol
 */
export function getStockWorth(ns, symbol) {
  const ownedShares = ns.stock.getPosition(symbol)[0];
  const bidPrice = ns.stock.getBidPrice(symbol);
  return ownedShares * bidPrice - COMMISSION_FEE;
}
