import { executeTerminalCommand } from 'utils/dom';
import {
  getAllServerNames,
  getPath,
  HOME_SERVER_NAME,
  isPurchased,
} from 'utils/server';

/** @param {NS} ns */
export async function main(ns) {
  const unownedServerNames = getAllServerNames(ns).filter(
    (serverName) => !isPurchased(serverName)
  );

  const terminalCommands = [];
  for (const serverName of unownedServerNames) {
    if (ns.getServer(serverName).backdoorInstalled) continue;

    const path = getPath(ns, HOME_SERVER_NAME, serverName);
    terminalCommands.push(
      'home',
      ...path.map((pathServerName) => `connect ${pathServerName}`),
      'backdoor'
    );
  }

  executeTerminalCommand(ns, ...terminalCommands, 'home');
}
