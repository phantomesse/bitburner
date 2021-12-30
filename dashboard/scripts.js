import {
  formatPercent,
  formatTime,
  formatMoney,
  formatNumber,
} from '../scripts/utils.js';

const app = new Vue({
  el: '#app',
  data: {
    allServers: [],
    hackableServers: [],
    hackableServersSort: 'hackHeuristic',
    stocks: [],
    stocksSort: 'askPrice',
  },
  methods: {
    addOrUpdateServer: function (server) {
      _addOrUpdate(this.allServers, server, server => server.name);
      this.allServers.sort((a, b) => a.name.localeCompare(b.name));
      this.$forceUpdate();
    },
    addOrUpdateHackableServer: function (server) {
      _addOrUpdate(this.hackableServers, server, server => server.name);
      this.sortHackableServers(this.hackableServersSort);
      this.$forceUpdate();
    },
    sortHackableServers: function (property) {
      this.hackableServersSort = property;
      this.hackableServers.sort((a, b) => {
        if (property === 'name') {
          return a[property].localeCompare(b[property]);
        }
        return b[property] - a[property];
      });
    },
    addOrUpdateStock: function (stock) {
      _addOrUpdate(this.stocks, stock, stock => stock.symbol);
      this.sortStocks(this.stocksSort);
      this.$forceUpdate();
    },
    sortStocks: function (property) {
      this.stocksSort = property;
      this.stocks.sort((a, b) => {
        if (property === 'symbol') {
          return a[property].localeCompare(b[property]);
        }
        return b[property] - a[property];
      });
    },
  },
});

/**
 
 * @param {any[]} array
 * @param {any} item
 */
function _addOrUpdate(array, item, keyFn) {
  const index = array.findIndex(arrayItem => keyFn(arrayItem) === keyFn(item));
  index === -1 ? array.push(item) : (array[index] = item);
}

Vue.component('server', {
  props: ['server'],
  data: function () {
    return {
      getClasses: server => {
        return { server: true, 'no-root-access': !server.hasRootAccess };
      },
    };
  },
  template:
    '<div v-bind:class="getClasses(server)">' +
    '<div>{{server.name}}</div>' +
    '<div>{{server.ramUsed}} / {{server.maxRam}}GB RAM</div>' +
    '<div v-if="!server.isPurchased && !server.backdoorInstalled">backdoor: {{server.backdoorInstalled}}</div>' +
    '<textarea v-if="!server.isPurchased && !server.backdoorInstalled" onclick="this.select()">home; {{server.path}}backdoor</textarea>' +
    '</div>',
});

Vue.component('hackable-server', {
  props: ['server'],
  data: function () {
    return {
      renderMoney: server => {
        const availbleMoneyPercent = server.moneyAvailable / server.maxMoney;
        return `${formatMoney(server.moneyAvailable)} (${formatPercent(
          availbleMoneyPercent
        )} of max)`;
      },
      formatPercent: formatPercent,
      formatTime: formatTime,
      getTimeAndThreadCount: (time, threadCount) => {
        return (
          formatTime(time) +
          (threadCount === 0 ? '' : ` (${formatNumber(threadCount, true)})`)
        );
      },
    };
  },
  template:
    '<div class="hackable-server">' +
    '<div>{{server.name}}</div>' +
    '<div>{{renderMoney(server)}}</div>' +
    '<div>{{formatPercent(server.hackChance)}}</div>' +
    '<div>{{getTimeAndThreadCount(server.hackTime, server.currentlyHackingThreadCount)}}</div>' +
    '<div>{{getTimeAndThreadCount(server.growTime, server.currentlyGrowingThreadCount)}}</div>' +
    '<div>{{getTimeAndThreadCount(server.weakenTime, server.currentlyWeakeningThreadCount)}}</div>' +
    '<div>{{server.hackHeuristic.toFixed(2)}}</div>' +
    '</div>',
});

Vue.component('stock', {
  props: ['stock'],
  data: function () {
    return {
      getClasses: stock => {
        return { stock: true, red: stock.forecast < 0.5 };
      },
      formatMoney: formatMoney,
      formatNumber: formatNumber,
      formatPercent: formatPercent,
    };
  },
  template:
    '<div v-bind:class="getClasses(stock)">' +
    '<div>{{stock.symbol}}</div>' +
    '<div>{{formatNumber(stock.maxShareCount, true)}}</div>' +
    '<div>{{formatMoney(stock.askPrice)}}</div>' +
    '<div>{{formatNumber(stock.ownedLongCount)}}</div>' +
    '<div>{{formatMoney(stock.longGain)}}</div>' +
    '<div>{{formatPercent(stock.longProfit)}}</div>' +
    '<div>{{formatMoney(stock.bidPrice)}}</div>' +
    '<div>{{formatNumber(stock.ownedShortCount)}}</div>' +
    '<div>{{formatMoney(stock.shortGain)}}</div>' +
    '<div>{{formatPercent(stock.shortProfit)}}</div>' +
    '<div>{{formatPercent(stock.volatility)}}</div>' +
    '<div>{{stock.forecast.toFixed(2)}}</div>' +
    '</div>',
});

updateData();
function updateData() {
  fetch('/dashboard/sync')
    .then(data => data.json())
    .then(processData);
}

function processData(data) {
  const allServers = data.servers;

  for (const server of allServers) {
    app.addOrUpdateServer(server);
    if (server.isHackable) app.addOrUpdateHackableServer(server);
  }

  for (const stock of data.stocks) app.addOrUpdateStock(stock);

  window.setTimeout(updateData, 1000);
}
