import { ONE_MINUTE } from 'utils';

/**
 * Manages purchasing and upgrading servers.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  while (true) {
    await ns.sleep(ONE_MINUTE);
  }
}
