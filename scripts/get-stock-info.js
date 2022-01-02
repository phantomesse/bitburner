import { sort } from '/utils/misc.js';
import { formatMoney, formatNumber, formatPercent } from '/utils/format.js';
import { getStockWorth } from '/utils/stock.js';
import { Alignment, printTable, RowColor } from '/utils/table.js';

const SYMBOL_COLUMN_HEADER = 'Symbol';
const ASK_PRICE_COLUMN_HEADER = 'Ask price';
const BID_PRICE_COLUMN_HEADER = 'Bid price';
const OWNED_SHARE_COUNT_COLUMN_HEADER = 'Owned shares';
const MAX_SHARE_COUNT_COLUMN_HEADER = 'Max shares';
const PERCENT_MAX_SHARE_COLUMN_HEADER = '% of max';
const SHARES_WORTH_COLUMN_HEADER = 'Worth';
const SHARES_PROFIT_COLUMN_HEADER = 'Profit';

/**
 * Prints out stock info.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const stocks = ns.stock.getSymbols().map(symbol => new Stock(ns, symbol));
  sort(stocks, stock => stock.profit, true);

  printTable(
    ns,
    {
      [ASK_PRICE_COLUMN_HEADER]: Alignment.RIGHT,
      [BID_PRICE_COLUMN_HEADER]: Alignment.RIGHT,
      [OWNED_SHARE_COUNT_COLUMN_HEADER]: Alignment.RIGHT,
      [MAX_SHARE_COUNT_COLUMN_HEADER]: Alignment.RIGHT,
      [PERCENT_MAX_SHARE_COLUMN_HEADER]: Alignment.RIGHT,
      [SHARES_WORTH_COLUMN_HEADER]: Alignment.RIGHT,
      [SHARES_PROFIT_COLUMN_HEADER]: Alignment.RIGHT,
    },
    stocks.map(stock => stock.getTableRow())
  );

  // ns.tprint(table);
}

class Stock {
  /**
   * @param {import('..').NS} ns
   * @param {string} symbol
   */
  constructor(ns, symbol) {
    this.symbol = symbol;
    this.askPrice = ns.stock.getAskPrice(symbol);
    this.bidPrice = ns.stock.getBidPrice(symbol);
    this.maxShareCount = ns.stock.getMaxShares(symbol);

    const position = ns.stock.getPosition(symbol);
    this.ownedShareCount = position[0];
    this.ownedShareAvgPrice = position[1];
    this.sharesWorth = getStockWorth(ns, symbol);
    this.profit =
      (this.sharesWorth - this.ownedShareCount * this.ownedShareAvgPrice) /
      (this.ownedShareCount * this.ownedShareAvgPrice);
  }

  _getRowColor() {
    if (this.profit === 0) return RowColor.WARN;
    return this.profit > 0 ? RowColor.NORMAL : RowColor.ERROR;
  }

  getTableRow() {
    return {
      [SYMBOL_COLUMN_HEADER]: this.symbol,
      [ASK_PRICE_COLUMN_HEADER]: formatMoney(this.askPrice),
      [BID_PRICE_COLUMN_HEADER]: formatMoney(this.bidPrice),
      [OWNED_SHARE_COUNT_COLUMN_HEADER]: formatNumber(
        this.ownedShareCount,
        true
      ),
      [MAX_SHARE_COUNT_COLUMN_HEADER]: formatNumber(this.maxShareCount, true),
      [PERCENT_MAX_SHARE_COLUMN_HEADER]: formatPercent(
        this.ownedShareCount / this.maxShareCount
      ),
      [SHARES_WORTH_COLUMN_HEADER]:
        this.ownedShareCount === 0 ? '--' : formatMoney(this.sharesWorth, true),
      [SHARES_PROFIT_COLUMN_HEADER]:
        this.ownedShareCount === 0
          ? '--'
          : (this.profit > 0 ? '+' : '') + formatPercent(this.profit),
      rowColor: this._getRowColor(),
    };
  }
}
