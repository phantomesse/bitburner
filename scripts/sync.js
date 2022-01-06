import { DEFAULT_PORT, LOCALHOST_PREFIX } from '/utils/misc.js';

const GITHUB_SCRIPTS_FOLDER =
  'https://raw.githubusercontent.com/phantomesse/bitburner/master/';
const SCRIPTS_TXT = 'scripts.txt';

/**
 * Copy this file to the bitburner game to sync the rest of the scripts:
 *
 * ```
 * wget https://raw.githubusercontent.com/phantomesse/bitburner/main/scripts/sync.js sync.js
 * ```
 *
 * @example run sync.js <port>
 * @param {import('index').NS } ns
 */
export async function main(ns) {
  let port = ns.args[0];
  port = typeof port !== 'number' ? DEFAULT_PORT : port;

  // Check if local server is running and set scripts prefix accordingly.
  let scriptsPrefix;
  try {
    scriptsPrefix = `${LOCALHOST_PREFIX}:${port}/`;
    await fetch(scriptsPrefix + SCRIPTS_TXT);
    ns.tprint('syncing to local server');
  } catch (_) {
    ns.tprint('no local server running, so syncing from github');
    scriptsPrefix = GITHUB_SCRIPTS_FOLDER;
  }

  // Get list of scripts to download and download each script.
  let currentScripts = await getScripts(scriptsPrefix);
  for await (const script of currentScripts) {
    await script.download(ns, scriptsPrefix);
  }

  // Watch for any changes in scripts every second and download newer copies.
  while (true) {
    let latestScripts = await getScripts(scriptsPrefix);
    for await (const latestScript of latestScripts) {
      const currentScript = currentScripts.find(
        script => script.fileName === latestScript.fileName
      );
      if (
        currentScript === undefined ||
        latestScript.lastModifiedTime !== currentScript.lastModifiedTime
      ) {
        await latestScript.download(ns, scriptsPrefix);
      }
    }

    // Delete any files that were in the current scripts but are not in the
    // latest scripts.
    for await (const currentScript of currentScripts) {
      const latestScript = latestScripts.find(
        script => script.fileName === currentScript.fileName
      );
      if (latestScript === undefined) {
        ns.rm(currentScript.fileName);
        ns.tprint(`removed ${currentScript.fileName}`);
      }
    }

    currentScripts = latestScripts;

    await ns.sleep(1000);
  }
}

class Script {
  /**
   * @param {string} fileName,
   * @param {number} lastModifiedTime
   */
  constructor(fileName, lastModifiedTime) {
    this.fileName = fileName;
    this.lastModifiedTime = lastModifiedTime;
  }

  /**
   * @param {import('index').NS } ns
   * @param {string} scriptsPrefix
   */
  async download(ns, scriptsPrefix) {
    const contents = await getFileContents(scriptsPrefix, this.fileName);
    await ns.write('/' + this.fileName, contents, 'w');
    ns.tprint(`downloaded ${this.fileName}`);
  }
}

/** @param {string} scriptsPrefix */
async function getScripts(scriptsPrefix) {
  return (await getFileContents(scriptsPrefix, SCRIPTS_TXT))
    .split('\n')
    .map(line => line.split('\t'))
    .map(args => new Script(args[0], parseFloat(args[1])));
}

/**
 * @param {string} scriptsPrefix
 * @param {string} fileName
 */
async function getFileContents(scriptsPrefix, fileName) {
  const response = await fetch(scriptsPrefix + 'scripts/' + fileName);
  return await response.text();
}
