import {
  formatMoney,
  formatPercent,
  formatTable,
  LEFT_ALIGNMENT,
  RIGHT_ALIGNMENT,
} from '/utils/format.js';
import { getStockWorth } from '/utils/stock.js';
import { HOME_SERVER_NAME } from '/utils/servers.js';
import { sort } from '/utils/misc.js';

const SOURCE_COLUMN_HEADER = 'Source';
const MONEY_COLUMN_HEADER = 'Money';
const MONEY_ABBR_COLUMN_HEADER = 'Money (Abbr.)';
const PERCENT_NET_WORTH_COLUMN_HEADER = '% net worth';

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
      [SOURCE_COLUMN_HEADER]: LEFT_ALIGNMENT,
      [MONEY_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [MONEY_ABBR_COLUMN_HEADER]: RIGHT_ALIGNMENT,
      [PERCENT_NET_WORTH_COLUMN_HEADER]: RIGHT_ALIGNMENT,
    },
    stocks.map(stock => ({
      [SOURCE_COLUMN_HEADER]: stock.symbol,
      [MONEY_COLUMN_HEADER]: formatMoney(stock.worth),
      [MONEY_ABBR_COLUMN_HEADER]: formatMoney(stock.worth, true),
      [PERCENT_NET_WORTH_COLUMN_HEADER]: formatPercent(stock.worth / netWorth),
    })),
    [
      {
        [SOURCE_COLUMN_HEADER]: 'Cash',
        [MONEY_COLUMN_HEADER]: formatMoney(cash),
        [MONEY_ABBR_COLUMN_HEADER]: formatMoney(cash, true),
        [PERCENT_NET_WORTH_COLUMN_HEADER]: formatPercent(cash / netWorth),
      },
    ],
    [
      {
        [SOURCE_COLUMN_HEADER]: 'Net worth',
        [MONEY_COLUMN_HEADER]: formatMoney(netWorth),
        [MONEY_ABBR_COLUMN_HEADER]: formatMoney(netWorth, true),
        [PERCENT_NET_WORTH_COLUMN_HEADER]: '--',
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
