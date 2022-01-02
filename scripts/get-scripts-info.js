import { Alignment, printTable, RowColor } from '/utils/table.js';
import { sort } from '/utils/misc.js';
import { HOME_SERVER_NAME } from '/utils/servers.js';

const SCRIPT_NAME_COLUMN_HEADER = 'Script name';
const RAM_COLUMN_HEADER = 'RAM';
const IS_RUNNING_COLUMN_HEADER = 'Is running';

/**
 * Prints out how much RAM each script takes up.
 *
 * @param {import('..').NS} ns
 */
export function main(ns) {
  const scriptNames = ns
    .ls(HOME_SERVER_NAME)
    .filter(fileName => fileName.endsWith('.js') && !fileName.startsWith('/'));
  sort(scriptNames, scriptName => scriptName);
  const scripts = scriptNames.map(fileName => ({
    [SCRIPT_NAME_COLUMN_HEADER]: fileName,
    [RAM_COLUMN_HEADER]: ns.getScriptRam(fileName) + ' GB',
    [IS_RUNNING_COLUMN_HEADER]: ns.scriptRunning(fileName, HOME_SERVER_NAME)
      ? 'true'
      : '--',
    rowColor: ns.scriptRunning(fileName, HOME_SERVER_NAME)
      ? RowColor.NORMAL
      : RowColor.INFO,
  }));

  printTable(
    ns,
    {
      [RAM_COLUMN_HEADER]: Alignment.RIGHT,
      [IS_RUNNING_COLUMN_HEADER]: Alignment.RIGHT,
    },
    scripts,
    [
      {
        [SCRIPT_NAME_COLUMN_HEADER]: 'Total',
        [RAM_COLUMN_HEADER]:
          scriptNames
            .map(scriptName => ns.getScriptRam(scriptName, HOME_SERVER_NAME))
            .reduce((a, b) => a + b)
            .toFixed(2) + ' GB',
        [IS_RUNNING_COLUMN_HEADER]: '--',
        rowColor: RowColor.WARN,
      },
    ]
  );
}
