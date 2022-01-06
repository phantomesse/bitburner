import { formatMoney, formatPercent } from '/utils/format.js';
import { getStockWorth } from '/utils/stock.js';
import { HOME_SERVER_NAME } from '/utils/servers.js';
import { sort } from '/utils/misc.js';
import { Alignment, printTable, RowColor } from '/utils/table.js';

const SOURCE_COLUMN_HEADER = 'Source';
const MONEY_COLUMN_HEADER = 'Money';
const MONEY_ABBR_COLUMN_HEADER = 'Money (Abbr.)';
const PERCENT_NET_WORTH_COLUMN_HEADER = '% net worth';

/**
 * Prints out net worth along with breakdown on how much of net worth is in each
 * stock and in cash.
 *
 * @param {import('index').NS} ns
 */
export function main(ns) {
  let stocks = [];
  try {
    const stocks = ns.stock
      .getSymbols()
      .map(symbol => new Stock(ns, symbol))
      .filter(stock => stock.worth > 0);
    sort(stocks, stock => stock.symbol);
    sort(stocks, stock => stock.worth);
  } catch (_) {}

  const cash = ns.getServerMoneyAvailable(HOME_SERVER_NAME);
  const netWorth =
    cash + stocks.map(stock => stock.worth).reduce((a, b) => a + b, 0);

  const sections = [
    [
      {
        [SOURCE_COLUMN_HEADER]: 'Cash',
        [MONEY_COLUMN_HEADER]: formatMoney(cash),
        [MONEY_ABBR_COLUMN_HEADER]: formatMoney(cash, true),
        [PERCENT_NET_WORTH_COLUMN_HEADER]: formatPercent(cash / netWorth),
        rowColor: RowColor.WARN,
      },
    ],
    [
      {
        [SOURCE_COLUMN_HEADER]: 'Net worth',
        [MONEY_COLUMN_HEADER]: formatMoney(netWorth),
        [MONEY_ABBR_COLUMN_HEADER]: formatMoney(netWorth, true),
        [PERCENT_NET_WORTH_COLUMN_HEADER]: '--',
        rowColor: RowColor.WARN,
      },
    ],
  ];
  if (stocks.length > 0) {
    sections.unshift(
      stocks.map(stock => ({
        [SOURCE_COLUMN_HEADER]: stock.symbol,
        [MONEY_COLUMN_HEADER]: formatMoney(stock.worth),
        [MONEY_ABBR_COLUMN_HEADER]: formatMoney(stock.worth, true),
        [PERCENT_NET_WORTH_COLUMN_HEADER]: formatPercent(
          stock.worth / netWorth
        ),
      }))
    );
  }
  printTable(
    ns,
    {
      [MONEY_COLUMN_HEADER]: Alignment.RIGHT,
      [MONEY_ABBR_COLUMN_HEADER]: Alignment.RIGHT,
      [PERCENT_NET_WORTH_COLUMN_HEADER]: Alignment.RIGHT,
    },
    ...sections
  );
}

class Stock {
  /**
   * @param {import('index').NS} ns
   * @param {string} symbol
   */
  constructor(ns, symbol) {
    this.symbol = symbol;
    this.worth = getStockWorth(ns, symbol);
  }
}
