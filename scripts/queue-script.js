import { ADDITIONAL_RESERVED_RAM_PORT, QUEUE_SCRIPT_JS } from 'utils/script';
import { HOME_SERVER_NAME } from 'utils/server';

/**
 * Queues up a script to run when there is enough RAM.
 *
 * Usage: `run queue-script.js <scriptName>`
 *
 * In order to not have the logs popup, add `--quiet` flag.
 * Usage: `run queue-script.js <scriptName> --quiet`
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');
  if (!ns.flags([['quiet', false]]).quiet) ns.tail();
  ns.atExit(() => ns.closeTail());
  const scriptName = ns.args[0];

  const otherQueueScriptProcesses = ns
    .ps()
    .filter(
      (process) =>
        process.filename === QUEUE_SCRIPT_JS &&
        process.args[0] === scriptName &&
        process.pid !== ns.pid
    );
  if (otherQueueScriptProcesses.length > 0) {
    return;
  }

  let pid = 0;
  while (pid === 0) {
    pid = ns.run(scriptName, {}, ...ns.args.slice(1));
    if (pid > 0) {
      ns.clearPort(ADDITIONAL_RESERVED_RAM_PORT);
      return;
    }

    // Wait until there is enough RAM to run the script.
    const ramNeeded = ns.getScriptRam(scriptName);
    ns.writePort(ADDITIONAL_RESERVED_RAM_PORT, {
      ram: ramNeeded,
    });
    ns.print(`waiting to run ${scriptName} (${ns.formatRam(ramNeeded, 2)})`);
    await ns.sleep(500);
  }
}

export const autocomplete = (data) => data.scripts;
