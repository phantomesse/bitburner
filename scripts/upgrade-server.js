import { getMoneyAvailableToSpend } from 'utils/money';
import { PURCHASED_SERVER_PREFIX } from 'utils/server';

/**
 * Attemps to upgrade an existing purchased server.
 *
 * Run: `run upgrade-server.js <serverName>`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const serverName = ns.args[0];
  const currentRam = ns.getServerMaxRam(serverName);

  for (let i = 20; i >= 2; i--) {
    const ram = Math.pow(2, i);
    if (ram <= currentRam) return;

    if (
      ns.getPurchasedServerUpgradeCost(serverName, ram) >=
      getMoneyAvailableToSpend(ns)
    ) {
      continue;
    }

    const success = ns.upgradePurchasedServer(serverName, ram);
    if (success) {
      const oldRam = ns.formatRam(currentRam, 0);
      const upgradedRam = ns.formatRam(ram, 0);
      ns.toast(`upgraded ${serverName} from ${oldRam} to ${upgradedRam}`);
    }
  }
}

export const autocomplete = (data) => data.servers;
