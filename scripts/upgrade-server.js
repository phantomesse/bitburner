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
    const serverSize = Math.pow(2, i);
    if (serverSize <= currentRam) return;

    const success = ns.upgradePurchasedServer(serverName, serverSize);
    if (success) {
      const oldRam = ns.formatRam(currentRam, 0);
      const upgradedRam = ns.formatRam(serverSize, 0);
      ns.toast(`upgraded ${serverName} from ${oldRam} to ${upgradedRam}`);
    }
  }
}

export const autocomplete = (data) => data.servers;
