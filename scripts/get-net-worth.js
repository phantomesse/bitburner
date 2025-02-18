import { formatMoney } from 'utils/format';
import { HOME_SERVER_NAME } from 'utils/server';
import { getAllStockSymbols } from 'utils/stocks';

/** @param {NS} ns */
export async function main(ns) {
  const cash = ns.getServerMoneyAvailable(HOME_SERVER_NAME);
  if (!ns.stock.has4SDataTIXAPI()) {
    ns.tprintf(`Net worth: ${formatMoney(ns, cash)}`);
    return;
  }

  let netWorth = cash;
  const symbols = getAllStockSymbols(ns);
  for (const symbol of symbols) {
    const sharesOwned = ns.stock.getPosition(symbol)[0];
    if (sharesOwned === 0) continue;

    netWorth +=
      ns.stock.getBidPrice(symbol) * sharesOwned -
      ns.stock.getConstants().StockMarketCommission;
  }

  ns.tprintf(`Net worth: ${formatMoney(ns, netWorth)}`);
  ns.tprintf(`Cash: ${formatMoney(ns, cash)}`);
  ns.tprintf(`Stock: ${formatMoney(ns, netWorth - cash)}`);
}
