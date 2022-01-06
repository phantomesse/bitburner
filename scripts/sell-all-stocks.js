/**
 * Sell all stocks.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  const symbols = ns.stock.getSymbols();
  for (const symbol of symbols) {
    ns.stock.sell(symbol, ns.stock.getPosition(symbol)[0]);
  }
}
