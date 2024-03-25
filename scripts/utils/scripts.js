import { MANAGE_SCRIPTS_PORT } from 'utils/ports';

export const HACK_SCRIPT = 'hack.js';
export const WEAKEN_SCRIPT = 'weaken.js';
export const GROW_SCRIPT = 'grow.js';
export const UPDATE_SERVERS_SCRIPT = 'update-servers.js';

/**
 * @typedef QueuedScript
 * @property {string} script name of script
 * @property {number | import('NetscriptDefinitions').RunOptions} threadOrOptions
 *        either an integer number of threads for new script, or a
 *        RunOptions object. Threads defaults to 1.
 * @property {(string|number|boolean)[]} args
 *        additional arguments to pass into the new script that is being run
 *
 * Queues up a script on the HOME server.
 *
 * @param {NS} ns
 * @param {string} script name of script
 * @param {[number | import('NetscriptDefinitions').RunOptions]} threadOrOptions
 *        either an integer number of threads for new script, or a
 *        RunOptions object. Threads defaults to 1.
 * @param {[...string|number|boolean]} args
 *        additional arguments to pass into the new script that is being run
 */
export function queueScript(ns, script, threadOrOptions = 1, ...args) {
  ns.writePort(
    MANAGE_SCRIPTS_PORT,
    JSON.stringify(
      /** @type {QueuedScript} */ {
        script,
        threadOrOptions,
        args,
      }
    )
  );
}
