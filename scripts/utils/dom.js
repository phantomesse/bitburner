/**
 * @typedef {Object.<string, (string|number)>} Style
 */

/**
 * Creates a React element that can be appended to the terminal or --tail logs.
 *
 * @param {import("NetscriptDefinitions").ReactNode} content
 * @param {[Style]} style optional CSS
 * @returns {import("NetscriptDefinitions").ReactElement}
 */
export function createReactElement(content, style) {
  if (Array.isArray(content)) {
    return React.createElement('div', { style: style ?? {} }, ...content);
  } else {
    return React.createElement('div', { style: style ?? {} }, content);
  }
}
