import { arrayJumpingGame } from '/contracts/array-jumping-game.js';
import { findAllValidMathExpressions } from '/contracts/find-valid-math-solutions.js';
import { findLargestPrimeFactor } from '/contracts/find-largest-prime-factor.js';
import { generateIpAddresses } from '/contracts/generate-ip-addresses.js';
import { mergeOverlappingIntervals } from '/contracts/merge-overlapping-intervals.js';
import { minimumPathSumInATriangle } from '/contracts/minimum-path-sum-in-a-triangle.js';
import { sanitizeParenthesesInExpression } from '/contracts/sanitize-parentheses-in-expression.js';
import { spiralizeMatrix } from '/contracts/spiralize-matrix.js';
import { subarrayWithMaximumSum } from '/contracts/subarray-with-maximum-sum.js';
import { totalWaysToSum } from '/contracts/total-ways-to-sum.js';
import {
  algorithmicStockTraderI,
  algorithmicStockTraderII,
  algorithmicStockTraderIV,
} from '/contracts/algorithmic-stock-trader.js';
import { algorithmicStockTraderIII } from '/contracts/algorithmic-stock-trader-iii.js';
import {
  uniquePathsInAGridI,
  uniquePathsInAGridII,
} from '/contracts/unique-paths-in-a-grid.js';
import {
  getAllServerNames,
  getPath,
  HOME_SERVER_NAME,
} from '/utils/servers.js';

const CONTRACT_TYPE_TO_SOLVER_FN_MAP = {
  'Algorithmic Stock Trader I': algorithmicStockTraderI,
  'Algorithmic Stock Trader II': algorithmicStockTraderII,
  'Algorithmic Stock Trader III': algorithmicStockTraderIII,
  'Algorithmic Stock Trader IV': algorithmicStockTraderIV,
  'Array Jumping Game': arrayJumpingGame,
  'Find All Valid Math Expressions': findAllValidMathExpressions,
  'Find Largest Prime Factor': findLargestPrimeFactor,
  'Generate IP Addresses': generateIpAddresses,
  'Merge Overlapping Intervals': mergeOverlappingIntervals,
  'Minimum Path Sum in a Triangle': minimumPathSumInATriangle,
  'Sanitize Parentheses in Expression': sanitizeParenthesesInExpression,
  'Spiralize Matrix': spiralizeMatrix,
  'Subarray with Maximum Sum': subarrayWithMaximumSum,
  'Total Ways to Sum': totalWaysToSum,
  'Unique Paths in a Grid I': uniquePathsInAGridI,
  'Unique Paths in a Grid II': uniquePathsInAGridII,
};

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
    if (!(contractType in CONTRACT_TYPE_TO_SOLVER_FN_MAP)) return false;

    const input = ns.codingcontract.getData(this.fileName, this.serverName);
    const answer = CONTRACT_TYPE_TO_SOLVER_FN_MAP[contractType](input);
    const response = ns.codingcontract.attempt(
      answer,
      this.fileName,
      this.serverName,
      { returnReward: true }
    );
    if (response === false || response === '') {
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
