import { PURCHASED_SERVER_PREFIX } from 'utils/server';

/**
 * Attempts to purchase the largest server possible.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  for (let i = 20; i >= 2; i--) {
    const serverSize = Math.pow(2, i);
    const serverName = ns.purchaseServer(PURCHASED_SERVER_PREFIX, serverSize);
    if (serverName) {
      ns.toast(`purchased ${serverName} (${ns.formatRam(serverSize, 0)})`);
      return;
    }
  }
}
