import {
  solveArrayJumpingGame,
  solveArrayJumpingGameII,
} from 'coding-contracts/array-jumping-game';
import { solveEncryptionI } from 'coding-contracts/encryption-i';
import { solveEncryptionII } from 'coding-contracts/encryption-ii';
import { solveFindLargestPrimeFactor } from 'coding-contracts/find-largest-prime-factor';
import { solveMergeOverlappingIntervals } from 'coding-contracts/merge-overlapping-intervals';
import { solveMinimumPathSumInATriangle } from 'coding-contracts/minimum-path-sum-in-a-triangle';
import { solveSanitizeParenthesesInExpression } from 'coding-contracts/sanitize-parentheses-in-expression';
import { solveShortestPathInAGrid } from 'coding-contracts/shortest-path-in-a-grid';
import { solveSpiralizeMatrix } from 'coding-contracts/spiralize-matrix';
import {
  solveUniquePathsInAGridI,
  solveUniquePathsInAGridII,
} from 'coding-contracts/unique-paths-in-a-grid';

/** @type {Object<string, (input: any) => any>} */
export const CODING_CONTRACT_TYPE_TO_SOLVER_MAP = {
  'Find Largest Prime Factor': solveFindLargestPrimeFactor,
  'Subarray with Maximum Sum': null,
  'Total Ways to Sum': null,
  'Total Ways to Sum II': null,
  'Spiralize Matrix': solveSpiralizeMatrix,
  'Array Jumping Game': solveArrayJumpingGame,
  'Array Jumping Game II': solveArrayJumpingGameII,
  'Merge Overlapping Intervals': solveMergeOverlappingIntervals,
  'Generate IP Addresses': null,
  'Algorithmic Stock Trader I': null,
  'Algorithmic Stock Trader II': null,
  'Algorithmic Stock Trader III': null,
  'Algorithmic Stock Trader IV': null,
  'Minimum Path Sum in a Triangle': solveMinimumPathSumInATriangle,
  'Unique Paths in a Grid I': solveUniquePathsInAGridI,
  'Unique Paths in a Grid II': solveUniquePathsInAGridII,
  'Shortest Path in a Grid': null, //solveShortestPathInAGrid,
  'Sanitize Parentheses in Expression': null, //solveSanitizeParenthesesInExpression,
  'Find All Valid Math Expressions': null,
  'HammingCodes: Integer to Encoded Binary': null,
  'HammingCodes: Encoded Binary to Integer': null,
  'Proper 2-Coloring of a Graph': null,
  'Compression I: RLE Compression': null,
  'Compression II: LZ Decompression': null,
  'Compression III: LZ Compression': null,
  'Encryption I: Caesar Cipher': solveEncryptionI,
  'Encryption II: Vigenère Cipher': solveEncryptionII,
  'Square Root': null,
};
