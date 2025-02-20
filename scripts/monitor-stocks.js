import { getStockDataList } from 'data/stocks';
import { formatMoney } from 'utils/format';
import { LEFT_ALIGN_STYLES, printTable, Table } from 'utils/table';

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  while (true) {
    ns.clearLog();

    const stockDataList = getStockDataList(ns);

    const table = new Table('Owned Shares');
    for (const stockData of stockDataList) {
      const symbol = stockData.symbol;
      table.cells.push({
        columnName: 'Symbol',
        rowId: symbol,
        content: symbol,
        value: symbol,
        columnStyles: LEFT_ALIGN_STYLES,
      });

      table.cells.push({
        columnName: 'Organization',
        rowId: symbol,
        content: stockData.organization,
        value: stockData.organization,
        columnStyles: LEFT_ALIGN_STYLES,
      });

      const bidPrice = ns.stock.getBidPrice(symbol);
      table.cells.push({
        columnName: 'Bid Price',
        rowId: symbol,
        content: formatMoney(ns, bidPrice),
        value: bidPrice,
      });

      const askPrice = ns.stock.getAskPrice(symbol);
      table.cells.push({
        columnName: 'Ask Price',
        rowId: symbol,
        content: formatMoney(ns, askPrice),
        value: askPrice,
      });

      const forecast = ns.stock.getForecast(symbol);
      table.cells.push({
        columnName: 'Forecast',
        rowId: symbol,
        content: ns.formatPercent(forecast, 0),
        value: forecast,
        cellStyles: {
          color:
            forecast > 0.5 ? ns.ui.getTheme().success : ns.ui.getTheme().error,
        },
      });

      const volatility = ns.stock.getVolatility(symbol);
      table.cells.push({
        columnName: 'Volatility',
        rowId: symbol,
        content: ns.formatPercent(volatility),
        value: volatility,
      });

      const ownedLongs = ns.stock.getPosition(symbol)[0];
      table.cells.push({
        columnName: 'Owned Shares',
        rowId: symbol,
        content:
          ownedLongs === 0
            ? ''
            : `${ns.formatNumber(ownedLongs, 0)} / ${ns.formatNumber(
                stockData.maxShares,
                0
              )}`,
        value: 1 / ownedLongs,
      });
    }
    printTable(ns, table);

    await ns.sleep(1000);
  }
}
