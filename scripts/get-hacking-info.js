import { getAllServerNames } from './utils.js';

const GROW_SCRIPT = 'grow.js';
const HACK_SCRIPT = 'hack.js';
const WEAKEN_SCRIPT = 'weaken.js';

/**
 * Prints out which servers are currently growing, weakening, or hacking the
 * given server.
 *
 * @param {import('..').NS} ns
 */
export async function main(ns) {
  const allServerNames = [...getAllServerNames(ns)];

  if (ns.args.length < 1 || !allServerNames.includes(ns.args[0])) {
    ns.tprint('please enter a valid target server name');
    return;
  }

  const targetServerName = ns.args[0];
  const growInfo = [];
  const weakenInfo = [];
  const hackInfo = [];
  for (const serverName of allServerNames) {
    let scriptInfo = getScriptInfo(
      ns,
      GROW_SCRIPT,
      serverName,
      targetServerName,
      1
    );
    if (scriptInfo.threadCount > 0) growInfo.push(scriptInfo);

    scriptInfo = getScriptInfo(
      ns,
      WEAKEN_SCRIPT,
      serverName,
      targetServerName,
      1
    );
    if (scriptInfo.threadCount > 0) weakenInfo.push(scriptInfo);

    scriptInfo = getScriptInfo(
      ns,
      HACK_SCRIPT,
      serverName,
      targetServerName,
      1
    );
    if (scriptInfo.threadCount > 0) hackInfo.push(scriptInfo);
  }

  const print = [targetServerName];
  if (growInfo.length > 0) {
    print.push(
      'growing on ' +
        growInfo
          .map(info => `${info.serverName} (${info.threadCount})`)
          .join(' ')
    );
  }
  if (weakenInfo.length > 0) {
    print.push(
      'weakening on ' +
        weakenInfo
          .map(info => `${info.serverName} (${info.threadCount})`)
          .join(' ')
    );
  }
  if (hackInfo.length > 0) {
    print.push(
      'hacking on ' +
        hackInfo
          .map(info => `${info.serverName} (${info.threadCount})`)
          .join(' ')
    );
  }
  ns.tprint('\n' + print.join('\n'));
}

/**
 * @param {import('..').NS} ns
 * @param {string} scriptName
 * @param {string} serverName
 * @param  {...any} args
 */
function getScriptInfo(ns, scriptName, serverName, ...args) {
  if (!ns.isRunning(scriptName, serverName, ...args)) {
    return { serverName: serverName, threadCount: 0 };
  }
  const threadCount = ns.getRunningScript(
    scriptName,
    serverName,
    ...args
  ).threads;
  return { serverName: serverName, threadCount: threadCount };
}
