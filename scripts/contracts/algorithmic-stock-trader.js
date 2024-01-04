export class Transaction {
  constructor(stockPrices, buyDay, sellDay) {
    this.buyDay = buyDay;
    this.buyPrice = stockPrices[buyDay];

    this.sellDay = sellDay;
    this.sellPrice = stockPrices[sellDay];

    this.profit = this.sellPrice - this.buyPrice;
  }

  toString() {
    return [
      `buy day ${this.buyDay} ($${this.buyPrice})`,
      `sell day ${this.sellDay} ($${this.sellPrice})`,
      `profit $${this.profit}`,
    ].join(', ');
  }
}

export class Permutation {
  /**
   * @param  {...Transaction} transactions
   */
  constructor(...transactions) {
    this.transactions = transactions;
    this.profit = transactions
      .map(transaction => transaction.profit)
      .reduce((a, b) => a + b);
  }

  toString() {
    return [
      '\n{',
      ...this.transactions.map(transaction => `${transaction}`),
      `total profit $${this.profit}`,
      '}\n',
    ].join('\n');
  }
}
