import { getMoneyToSpend, getNetWorth, sort } from '/utils/misc.js';
import { formatMoney, formatPercent } from '/utils/format.js';
import { HOME_SERVER_NAME } from '/utils/servers.js';
import { getForecast } from './utils/stock';
import {
  MANAGE_HACKING_TO_MANAGE_STOCKS_PORT,
  NULL_PORT_DATA,
} from './utils/ports';
import { getStockSymbol } from './utils/organizations';

const COMMISSION_FEE = 100000;
const PERCENT_OF_NET_WORTH_IN_STOCK = 0.99;

/**
 * Manages buying and selling stocks.
 *
 * @param {import('index').NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  let symbols;
  try {
    symbols = ns.stock.getSymbols();
  } catch (_) {
    // No stock exchange API.
    return;
  }

  while (true) {
    const manageHackingMessage = ns.readPort(
      MANAGE_HACKING_TO_MANAGE_STOCKS_PORT
    );
    if (manageHackingMessage !== NULL_PORT_DATA) {
      const response = JSON.parse(manageHackingMessage);
      if (response.buy) {
        const symbol = getStockSymbol(response.buy);
        if (symbol !== undefined) {
          buyStock(ns, symbol, ns.getServerMoneyAvailable(HOME_SERVER_NAME));
        }
      }
      if (response.sell) {
        const symbol = getStockSymbol(response.sell);
        if (symbol !== undefined) sellStock(ns, symbol);
      }
    }

    const cash = ns.getServerMoneyAvailable(HOME_SERVER_NAME);
    const netWorth = getNetWorth(ns);
    if (cash / netWorth < 1 - PERCENT_OF_NET_WORTH_IN_STOCK) {
      ns.print(
        `\nnot buying any stock because we want only ${formatPercent(
          PERCENT_OF_NET_WORTH_IN_STOCK
        )} of our net worth in stocks and we currently have ${formatMoney(
          cash,
          true
        )} in cash which is ${formatPercent(
          cash / netWorth
        )} of our net worth (${formatMoney(netWorth, true)})`
      );
    } else {
      // Sort stock symbols sorted from lowest to highest ask price and buy stock
      // starting with the cheapest stock.
      let moneyToSpend = cash - (1 - PERCENT_OF_NET_WORTH_IN_STOCK) * netWorth;
      ns.print(`\ncan spend ${formatMoney(moneyToSpend)}`);
      sort(symbols, ns.stock.getAskPrice);
      for (const symbol of symbols) {
        if (moneyToSpend <= COMMISSION_FEE) break;
        moneyToSpend -= buyStock(ns, symbol, moneyToSpend);
      }
    }

    // Sort stock symbols sorted from highest to lowest bid price and sell stock
    // starting at the most expensive stock.
    sort(symbols, ns.stock.getBidPrice);
    for (const symbol of symbols) sellStock(ns, symbol);

    await ns.sleep(6000); // Sleep for 6 seconds.
  }
}

/**
 * @param {import('index').NS} ns
 * @param {string} symbol
 * @param {number} moneyToSpend
 * @returns {number} how much we spent
 */
function buyStock(ns, symbol, moneyToSpend) {
  const ownedShareCount = ns.stock.getPosition(symbol)[0];
  let sharesToBuy = Math.min(
    Math.floor((moneyToSpend - COMMISSION_FEE) / ns.stock.getAskPrice(symbol)),
    ns.stock.getMaxShares(symbol) - ownedShareCount
  );
  if (sharesToBuy <= 0) return 0;

  const forecast = getForecast(ns, symbol);
  if (forecast < 0.5) return 0;
  sharesToBuy = Math.ceil(forecast * sharesToBuy);

  try {
    const sharePrice = ns.stock.buy(symbol, sharesToBuy);
    ns.print(
      `bought ${sharesToBuy} shares of ${symbol} at ${formatMoney(sharePrice)}`
    );
    return sharePrice * sharesToBuy + COMMISSION_FEE;
  } catch (e) {
    return 0;
  }
}

/**
 * @param {import('index').NS} ns
 * @param {string} symbol
 */
function sellStock(ns, symbol) {
  const position = ns.stock.getPosition(symbol);
  const ownedShareCount = position[0];
  if (ownedShareCount === 0) return; // Nothing to sell.

  // Panic sell.
  if (getForecast(ns, symbol) < 0.15) {
    const sharesToSell = ns.stock.getPosition(symbol)[0];
    ns.stock.sell(symbol, sharesToSell);
    ns.print(`panic sold ${sharesToSell} shares of ${symbol}`);
  }

  const ownedAvgSharePrice = position[1];
  const bidPrice = ns.stock.getBidPrice(symbol);
  if (bidPrice < ownedAvgSharePrice) return; // We won't make a profit.

  // Determine how much to sell.
  let sharesToSell = ownedShareCount;
  const forecast = getForecast(ns, symbol);
  if (forecast > 0.5) return; // Stock will go up.
  sharesToSell = Math.ceil((forecast / 0.5) * sharesToSell);

  if (sharesToSell === 0) return; // Nothing to sell.
  const gain = ns.stock.getSaleGain(symbol, sharesToSell, 'Long');
  const profit =
    (gain - ownedAvgSharePrice * ownedShareCount) /
    (ownedAvgSharePrice * ownedShareCount);
  if (profit < 0) return; // We won't make a profit.

  const sharePrice = ns.stock.sell(symbol, sharesToSell);
  ns.print(
    `sold ${sharesToSell} shares of ${symbol} at ${formatMoney(
      sharePrice
    )} with profit of ${formatPercent(profit)}`
  );
}
