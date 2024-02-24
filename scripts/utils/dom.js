/**
 * @typedef {Object.<string, (string|number)>} Style
 */

import { ONE_SECOND } from 'utils/constants';

/**
 * Creates a React element that can be appended to the terminal or --tail logs.
 *
 * @param {import("NetscriptDefinitions").ReactNode} content
 * @param {[Style]} style optional CSS
 * @param {[string]} tag to override <div>
 * @returns {import("NetscriptDefinitions").ReactElement}
 */
export function createReactElement(content, style, tag) {
  if (Array.isArray(content)) {
    return React.createElement(
      tag ?? 'div',
      { style: style ?? {} },
      ...content
    );
  } else {
    return React.createElement(tag ?? 'div', { style: style ?? {} }, content);
  }
}

/**
 * Executes terminal commands (e.g. `connect n00dles`) without RAM penalties.
 *
 * @param {NS} ns
 * @param {...string} commands
 */
export async function executeTerminalCommand(ns, ...commands) {
  for (let command of commands) {
    let wasSuccessful = executeCommand(command);
    while (!wasSuccessful) {
      await ns.sleep(ONE_SECOND / 2);
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
export const getDocument = () => eval('document');
