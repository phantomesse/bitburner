import { totalWaysToSum } from '/contracts/total-ways-to-sum.js';
import { arrayJumpingGame } from '/contracts/array-jumping-game.js';
import { findLargestPrimeFactor } from '/contracts/find-largest-prime-factor.js';
import { generateIpAddresses } from '/contracts/generate-ip-addresses.js';
import { algorithmicStockTraderI } from '/contracts/algorithmic-stock-trader-i.js';
import { algorithmicStockTraderII } from '/contracts/algorithmic-stock-trader-ii.js';
import { algorithmicStockTraderIII } from '/contracts/algorithmic-stock-trader-iii.js';
import { subarrayWithMaximumSum } from '/contracts/subarray-with-maximum-sum.js';
import { sanitizeParenthesesInExpression } from '/contracts/sanitize-parentheses-in-expression.js';
import { uniquePathsInAGridI } from '/contracts/unique-paths-in-a-grid-i.js';
import { uniquePathsInAGridII } from '/contracts/unique-paths-in-a-grid-ii.js';
import { findAllValidMathExpressions } from '/contracts/find-valid-math-solutions.js';
import { minimumPathSumInATriangle } from '/contracts/minimum-path-sum-in-a-triangle.js';
import { mergeOverlappingIntervals } from '/contracts/merge-overlapping-intervals.js';
import {
  getAllServerNames,
  getPath,
  HOME_SERVER_NAME,
} from '/utils/servers.js';

/**
 * Finds all the contracts across all servers and solves any that we can solve
 * as we go. Print out all unsolved contracts.
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
  if (unsolvedContracts.length > 0) {
    ns.tprint(
      '\n' +
        unsolvedContracts.map(contract => contract.toString(ns)).join('\n\n')
    );
  } else {
    ns.tprint('no unsolved contracts available at the moment');
  }
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
      case 'Find Largest Prime Factor':
        answer = findLargestPrimeFactor(input);
        break;
      case 'Generate IP Addresses':
        answer = generateIpAddresses(input);
        break;
      case 'Algorithmic Stock Trader I':
        answer = algorithmicStockTraderI(input);
        break;
      case 'Algorithmic Stock Trader II':
        answer = algorithmicStockTraderII(input);
        break;
      case 'Algorithmic Stock Trader III':
        answer = algorithmicStockTraderIII(input);
        break;
      case 'Subarray with Maximum Sum':
        answer = subarrayWithMaximumSum(input);
        break;
      case 'Sanitize Parentheses in Expression':
        answer = sanitizeParenthesesInExpression(input);
        break;
      case 'Unique Paths in a Grid I':
        answer = uniquePathsInAGridI(input);
        break;
      case 'Unique Paths in a Grid II':
        answer = uniquePathsInAGridII(input);
        break;
      case 'Find All Valid Math Expressions':
        answer = findAllValidMathExpressions(input);
        break;
      case 'Minimum Path Sum in a Triangle':
        answer = minimumPathSumInATriangle(input);
        break;
      case 'Merge Overlapping Intervals':
        answer = mergeOverlappingIntervals(input);
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
    if (response === false) {
      ns.tprint(`could not solve ${this.fileName} (${contractType})`);
      return false;
    }
    ns.tprint(`solved ${this.fileName} (${contractType}): ${response}`);
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
