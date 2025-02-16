import {
  solveArrayJumpingGame,
  solveArrayJumpingGameII,
} from 'coding-contracts/array-jumping-game';
import { solveEncryptionI } from 'coding-contracts/encryption-i';
import { solveFindLargestPrimeFactor } from 'coding-contracts/find-largest-prime-factor';
import { solveUniquePathsInAGridI } from 'coding-contracts/unique-paths-in-a-grid';

/** @type {Object<string, (input: any) => any>} */
export const CODING_CONTRACT_TYPE_TO_SOLVER_MAP = {
  'Find Largest Prime Factor': solveFindLargestPrimeFactor,
  'Subarray with Maximum Sum': null,
  'Total Ways to Sum': null,
  'Total Ways to Sum II': null,
  'Spiralize Matrix': null,
  'Array Jumping Game': solveArrayJumpingGame,
  'Array Jumping Game II': solveArrayJumpingGameII,
  'Merge Overlapping Intervals': null,
  'Generate IP Addresses': null,
  'Algorithmic Stock Trader I': null,
  'Algorithmic Stock Trader II': null,
  'Algorithmic Stock Trader III': null,
  'Algorithmic Stock Trader IV': null,
  'Minimum Path Sum in a Triangle': null,
  'Unique Paths in a Grid I': solveUniquePathsInAGridI,
  'Unique Paths in a Grid II': null,
  'Shortest Path in a Grid': null,
  'Sanitize Parentheses in Expression': null,
  'Find All Valid Math Expressions': null,
  'HammingCodes: Integer to Encoded Binary': null,
  'HammingCodes: Encoded Binary to Integer': null,
  'Proper 2-Coloring of a Graph': null,
  'Compression I: RLE Compression': null,
  'Compression II: LZ Decompression': null,
  'Compression III: LZ Compression': null,
  'Encryption I: Caesar Cipher': solveEncryptionI,
  'Encryption II: Vigenère Cipher': null,
  'Square Root': null,
};
