import { executeTerminalCommand } from 'utils/dom';
import { getPath, HOME_SERVER_NAME } from 'utils/server';

/** @param {NS} ns */
export async function main(ns) {
  const targetServer = ns.args[0];
  const path = getPath(ns, HOME_SERVER_NAME, targetServer);

  const terminalCommands = path.map(
    (pathServerName) => `connect ${pathServerName}`
  );
  executeTerminalCommand(ns, ...terminalCommands);
}

export const autocomplete = (data) => data.servers;
