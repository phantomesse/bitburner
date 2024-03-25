import { MANAGE_SCRIPTS_PORT, NULL_PORT_DATA } from 'utils/ports';
import { QUEUE_SCRIPT_RAM } from 'utils/scripts';
import { HOME_HOSTNAME } from 'utils/servers';
import { ONE_SECOND } from 'utils/time';

/**
 * Coordinate and queues running scripts on HOME server.
 *
 * Note that a script that requires less RAM may run sooner than a script that
 * requires more RAM even if the less RAM script was added to the queue later.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  ns.disableLog('ALL');

  /** @type {import('utils/scripts').QueuedScript[]} */ let scriptQueue = [];

  while (true) {
    // Add any scripts from port to the queue.
    const port = ns.getPortHandle(MANAGE_SCRIPTS_PORT);
    while (port.peek() !== NULL_PORT_DATA) {
      scriptQueue.push(JSON.parse(port.read()));
    }

    // Execute all scripts that we can run from the queue.
    const scriptsToAddBackToQueue = [];
    for (const queuedScript of scriptQueue) {
      const wasSuccessful = maybeRunScript(ns, queuedScript);
      if (wasSuccessful) {
        ns.toast(`Running ${queuedScript.script} ${queuedScript.args}`, 'info');
      } else {
        scriptsToAddBackToQueue.push(queuedScript);
      }
    }
    scriptQueue = scriptsToAddBackToQueue;

    ns.clearLog();
    ns.print(scriptQueue);

    await ns.sleep(ONE_SECOND / 2);
  }
}

/**
 * @param {NS} ns
 * @returns {number} available RAM on HOME server
 */
function getAvailableRam(ns) {
  const maxRam = ns.getServerMaxRam(HOME_HOSTNAME);
  const usedRam = ns.getServerUsedRam(HOME_HOSTNAME);
  const reservedRam = QUEUE_SCRIPT_RAM;
  return maxRam - usedRam - reservedRam;
}

/**
 * Attempts to run a queued script.
 *
 * @param {NS} ns
 * @param {import('utils/scripts').QueuedScript} queuedScript
 * @returns {boolean} whether the script was successfully run
 */
function maybeRunScript(ns, queuedScript) {
  const neededRam = ns.getScriptRam(queuedScript.script);
  const availableRam = getAvailableRam(ns);
  if (neededRam > availableRam) return false;

  const pid = ns.run(
    queuedScript.script,
    queuedScript.threadOrOptions,
    ...queuedScript.args
  );
  return pid > 0;
}
