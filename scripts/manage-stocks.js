import { getServers } from 'database/servers';
import { getStocks } from 'database/stocks';
import { HOME_HOSTNAME, ONE_SECOND } from 'utils/constants';
import { formatMoney } from 'utils/format';
import { printTable } from 'utils/table';

/**
 * Manages buying/selling stocks.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.atExit(() => ns.closeTail());

  const stocks = getStocks(ns);
  const servers = getServers(ns);
  const hostnameToServerMap = {};
  for (const server of servers) {
    hostnameToServerMap[server.hostname] = server;
  }
  const commission = ns.stock.getConstants().StockMarketCommission;

  while (true) {
    logStocks(ns, stocks);

    for (const stock of stocks) {
      const position = getPosition(ns, stock.symbol);
      const askPrice = ns.stock.getAskPrice(stock.symbol);

      // Sell longs.
      if (
        position.longs > 0 &&
        askPrice * position.longs >
          position.longPrice * position.longs + commission
      ) {
        ns.stock.sellStock(stock.symbol, position.longs);
      }

      // Buy longs.
      if (stock.server) {
        const serverMoneyAvailable = ns.getServerMoneyAvailable(stock.server);
        const serverMaxMoney = hostnameToServerMap[stock.server].maxMoney;
        if (serverMoneyAvailable < serverMaxMoney / 2) buyLongs(ns, stock);
      }
      if (
        ns.stock.has4SDataTIXAPI() &&
        ns.stock.getForecast(stock.symbol) > 0.5
      ) {
        buyLongs(ns, stock);
      }
    }

    await ns.stock.nextUpdate();
  }
}

/**
 * @param {NS} ns
 * @param {import('database/stocks').Stock} stock
 */
function buyLongs(ns, stock) {
  const sharesToBuy = Math.min(
    stock.maxShares - getPosition(ns, stock.symbol).longs,
    Math.floor(
      (ns.getServerMoneyAvailable(HOME_HOSTNAME) -
        ns.stock.getConstants().StockMarketCommission) /
        ns.stock.getAskPrice(stock.symbol)
    )
  );
  ns.stock.buyStock(stock.symbol, sharesToBuy);
}

/**
 * @typedef Position
 * @property {number} longs
 * @property {number} longPrice
 * @property {number} shorts
 * @property {number} shortPrice
 *
 * @param {NS} ns
 * @param {string} symbol
 * @returns {Position}
 */
function getPosition(ns, symbol) {
  const position = ns.stock.getPosition(symbol);
  return {
    longs: position[0],
    longPrice: position[1],
    shorts: position[2],
    shortPrice: position[3],
  };
}

/**
 * Logs stock data to --tail.
 *
 * @param {NS} ns
 * @param {import('database/stocks').Stock[]} stocks
 */
function logStocks(ns, stocks) {
  ns.clearLog();

  stocks.sort(
    (stock1, stock2) =>
      getPosition(ns, stock2.symbol).longs -
      getPosition(ns, stock1.symbol).longs
  );

  const table = { rows: [] };
  for (const stock of stocks) {
    const position = getPosition(ns, stock.symbol);
    const row = {
      cells: [
        {
          column: { name: 'Symbol', style: {} },
          content: stock.symbol,
        },
        {
          column: { name: 'Organization', style: {} },
          content: stock.organization,
        },
        {
          column: { name: 'Server', style: {} },
          content: stock.server,
        },
        {
          column: { name: 'Longs', style: { textAlign: 'right' } },
          content:
            position.longs === 0 ? '-' : ns.formatNumber(position.longs, 0),
        },
        {
          column: { name: 'Avg. Long Price', style: { textAlign: 'right' } },
          content:
            position.longs === 0 ? '-' : formatMoney(ns, position.longPrice),
        },
        {
          column: { name: 'Ask Price', style: { textAlign: 'right' } },
          content: formatMoney(ns, ns.stock.getAskPrice(stock.symbol)),
        },
        {
          column: { name: 'Shorts', style: { textAlign: 'right' } },
          content:
            position.shorts === 0 ? '-' : ns.formatNumber(position.shorts, 0),
        },
        {
          column: { name: 'Avg. Short Price', style: { textAlign: 'right' } },
          content:
            position.shorts === 0 ? '-' : formatMoney(ns, position.shortPrice),
        },
        {
          column: { name: 'Max Shares', style: { textAlign: 'right' } },
          content: ns.formatNumber(stock.maxShares, 0),
        },
      ],
    };
    table.rows.push(row);
  }
  printTable(ns, table);
}
