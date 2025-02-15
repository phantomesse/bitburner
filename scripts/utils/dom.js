/**
 * Executes terminal commands (e.g. `connect n00dles`) without RAM penalties.
 *
 * @param {NS} ns
 * @param {...string} commands
 */
export async function executeTerminalCommand(ns, ...commands) {
  for (let command of commands) {
    ns.tprint('trying to run ' + command);
    let wasSuccessful = executeCommand(command);
    ns.tprint(wasSuccessful);
    while (!wasSuccessful) {
      ns.tprint('here');
      await ns.sleep(1000);
      ns.tprint('after sleep');
      wasSuccessful = executeCommand(command);
    }
  }
}

/**
 * @param {string} command
 * @returns {boolean} whether executing the event was successful
 */
function executeCommand(command) {
  const input = getDocument().getElementById('terminal-input');
  if (input === null || input.hasAttribute('disabled')) return false;
  input.value = command;
  const handler = Object.keys(input)[1];
  input[handler].onChange({ target: input });
  input[handler].onKeyDown({
    key: 'Enter',
    code: 'Enter',
    which: 13,
    keyCode: 13,
    preventDefault: () => null,
  });
  return true;
}

/**
 * Returns DOM document without the RAM penalties.
 *
 * Note: Make sure to name the variable `doc` instead of `document` to avoid RAM
 * penalties.
 *
 * @returns {Document}
 */
const getDocument = () => eval('document');
