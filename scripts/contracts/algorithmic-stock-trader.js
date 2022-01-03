// Algorithmic Stock Trader I-IV

export const algorithmicStockTraderI = input => _getMaxProfit(1, input);
export const algorithmicStockTraderII = input =>
  _getMaxProfit(input.length, input);
export const algorithmicStockTraderIII = input => _getMaxProfit(2, input);
export const algorithmicStockTraderIV = input =>
  _getMaxProfit(input[0], input[1]);

function _getMaxProfit(maxTradeCount, stockPrices) {
  let profits = [];

  let day = -1;
  while (day < stockPrices.length) {
    day++;
    if (stockPrices[day + 1] >= stockPrices[day]) {
      // The next day's price is higher than today's price, so buy today.
      const minPrice = stockPrices[day];
      day++;

      while (
        day < stockPrices.length &&
        stockPrices[day + 1] >= stockPrices[day]
      ) {
        // Keep iterating through the days until the stock prices stop growing.
        day++;
      }
      const maxPrice = stockPrices[day];
      profits.push(maxPrice - minPrice);
    }
  }

  profits.sort((a, b) => b - a);
  return profits
    .slice(0, Math.min(profits.length, maxTradeCount))
    .reduce((a, b) => a + b);
}
