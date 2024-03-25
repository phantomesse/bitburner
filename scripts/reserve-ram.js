import { RESERVED_RAM_DATABASE_FILE } from 'utils/servers';

/**
 * Reserve RAM to allocate for running scripts on the HOME server.
 *
 * Amount of ram should be passed in through the argument.
 * e.g. "run reserve-ram.js 4" to reserve 4GB of ram
 *
 * @param {NS} ns
 */
export function main(ns) {
  const ramToReserve = ns.args[0];
  ns.write(RESERVED_RAM_DATABASE_FILE, ramToReserve, 'w');
}
