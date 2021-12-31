import { totalWaysToSum } from '/contracts/total-ways-to-sum.js';
import { arrayJumpingGame } from '/contracts/array-jumping-game.js';
import {
  getAllServerNames,
  getPath,
  HOME_SERVER_NAME,
} from '/utils/servers.js';

/**
 * Finds all the contracts across all servers.
 *
 * @param {import('..').NS} ns
 */
export async function main(ns) {
  const serverNames = getAllServerNames(ns).filter(serverName =>
    ns.hasRootAccess(serverName)
  );

  // Get all contracts.
  const allContracts = [];
  for (const serverName of serverNames) {
    const contracts = ns
      .ls(serverName)
      .filter(fileName => fileName.endsWith('.cct'))
      .map(fileName => new Contract(fileName, serverName));
    allContracts.push(...contracts);
  }

  // Attempt to solve contracts.
  const unsolvedContracts = allContracts.filter(
    contract => !contract.attemptToSolve(ns)
  );

  // Print out command to run any unsolved contracts.
  ns.tprint(
    '\n' + unsolvedContracts.map(contract => contract.toString(ns)).join('\n\n')
  );
}

class Contract {
  constructor(fileName, serverName) {
    this.fileName = fileName;
    this.serverName = serverName;
  }

  /**
   * Attemps to solve a contract.
   *
   * @param {import('..').NS} ns
   * @returns {boolean} true if successfully solved
   */
  attemptToSolve(ns) {
    const contractType = this._getContractType(ns);
    const input = ns.codingcontract.getData(this.fileName, this.serverName);
    let answer;
    switch (contractType) {
      case 'Total Ways to Sum':
        answer = totalWaysToSum(input);
        break;
      case 'Array Jumping Game':
        answer = arrayJumpingGame(input);
        break;
      default:
        return false;
    }
    const response = ns.codingcontract.attempt(
      answer,
      this.fileName,
      this.serverName,
      { returnReward: true }
    );
    if (response === false) return false;
    ns.tprint(response);
    return true;
  }

  toString(ns) {
    const command = [
      HOME_SERVER_NAME,
      ...getPath(ns, this.serverName).map(path => 'connect ' + path),
      'run ' + this.fileName,
    ].join('; ');
    return [this._getContractType(ns), command].join('\n');
  }

  _getContractType(ns) {
    return ns.codingcontract.getContractType(this.fileName, this.serverName);
  }
}
