import { executeTerminalCommand } from 'utils/dom';
import {
  getAllServerNames,
  getPath,
  HOME_SERVER_NAME,
  isHackable,
} from 'utils/server';

/** @param {NS} ns */
export async function main(ns) {
  const serverNames = getAllServerNames(ns).filter((serverName) =>
    isHackable(ns, serverName)
  );

  const terminalCommands = [];
  for (const serverName of serverNames) {
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
