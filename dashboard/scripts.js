import { formatPercent, formatTime, formatMoney } from '../scripts/utils.js';

const app = new Vue({
  el: '#app',
  data: {
    allServers: [],
    hackableServers: [],
    hackableServersSort: 'hackHeuristic',
  },
  methods: {
    addOrUpdateServer: function (server) {
      _addOrUpdateServers(this.allServers, server);
      this.allServers.sort((a, b) => a.name.localeCompare(b.name));
      this.$forceUpdate();
    },
    addOrUpdateHackableServer: function (server) {
      _addOrUpdateServers(this.hackableServers, server);
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
  },
});

/**
 
 * @param {any[]} servers
 * @param {any} serverToAddOrUpdate
 */
function _addOrUpdateServers(servers, serverToAddOrUpdate) {
  const index = servers.findIndex(
    server => server.name === serverToAddOrUpdate.name
  );
  index === -1
    ? servers.push(serverToAddOrUpdate)
    : (servers[index] = serverToAddOrUpdate);
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
          (threadCount === 0
            ? ''
            : ` (${Intl.NumberFormat('en', { notation: 'compact' }).format(
                threadCount
              )})`)
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

updateData();
function updateData() {
  fetch('/dashboard/sync')
    .then(data => data.json())
    .then(processData);
}

function processData(data) {
  const allServers = data.servers;
  allServers.sort((a, b) => b.hackHeuristic - a.hackHeuristic);

  for (const server of allServers) {
    app.addOrUpdateServer(server);
    if (server.isHackable) app.addOrUpdateHackableServer(server);
  }

  window.setTimeout(updateData, 1000);
}
