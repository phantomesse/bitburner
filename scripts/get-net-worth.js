import {
  formatMoney,
  formatPercent,
  formatTable,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
} from '/utils/format.js';
import { getNetWorth, sort } from '/utils/misc.js';
import { getStockWorth } from '/utils/stock.js';
import { HOME_SERVER_NAME } from '/utils/servers.js';

/**
 * Prints out net worth along with breakdown on how much of net worth is in each
 * stock and in cash.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const stocks = ns.stock
    .getSymbols()
    .map(symbol => new Stock(ns, symbol))
    .filter(stock => stock.worth > 0);
  sort(stocks, stock => stock.symbol);
  sort(stocks, stock => stock.worth);

  const cash = ns.getServerMoneyAvailable(HOME_SERVER_NAME);
  const netWorth =
    cash + stocks.map(stock => stock.worth).reduce((a, b) => a + b);

  const table = formatTable(
    {
      Source: LEFT_ALIGNMENT,
      Money: RIGHT_ALIGNMENT,
      'Money Abbr.': RIGHT_ALIGNMENT,
      '% of net worth': RIGHT_ALIGNMENT,
    },
    stocks.map(stock => ({
      Source: stock.symbol,
      Money: formatMoney(stock.worth),
      'Money Abbr.': formatMoney(stock.worth, true),
      '% of net worth': formatPercent(stock.worth / netWorth),
    })),
    [
      {
        Source: 'Cash',
        Money: formatMoney(cash),
        'Money Abbr.': formatMoney(cash, true),
        '% of net worth': formatPercent(cash / netWorth),
      },
    ],
    [
      {
        Source: 'Net worth',
        Money: formatMoney(netWorth),
        'Money Abbr.': formatMoney(netWorth, true),
        '% of net worth': '--',
      },
    ]
  );
  ns.tprint(table);
}

const _formatMoney = money =>
  `${formatMoney(money)} (${formatMoney(money, true)})`;

class Stock {
  /**
   * @param {import('..').NS} ns
   * @param {string} symbol
   */
  constructor(ns, symbol) {
    this.symbol = symbol;
    this.worth = getStockWorth(ns, symbol);
  }
}
