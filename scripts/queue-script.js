import { queueScript } from 'utils/scripts';

/**
 * Queues a script to run.
 *
 * Takes in the script to run as the argument.
 *
 * @param {NS} ns
 */
export function main(ns) {
  queueScript(ns, ns.args[0], {}, ...ns.args.slice(1));
}

export const autocomplete = data => data.scripts;
