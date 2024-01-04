import algorithmicStockTraderI from 'contracts/algorithmic-stock-trader-i';
import algorithmicStockTraderIII from 'contracts/algorithmic-stock-trader-iii';
import arrayJumpingGame from 'contracts/array-jumping-game';
import compressionIILZDecompression from 'contracts/compression-ii-lz-decompression';
import findLargestPrimeFactor from 'contracts/find-largest-prime-factor';
import sanitizeParenthesesInExpression from 'contracts/sanitize-parentheses-in-expression';
import shortestPathInAGrid from 'contracts/shortest-path-in-a-grid';
import totalWaysToSum from 'contracts/total-ways-to-sum';
import uniquePathsInAGridI from 'contracts/unique-paths-in-a-grid-i';

export const HOME_HOSTNAME = 'home';

/** Maximum number of servers that we can buy. */
export const MAX_PURCHASED_SERVER_COUNT = 25;

/** One second in milliseconds. */
export const ONE_SECOND = 1000;

/** One minute in milliseconds. */
export const ONE_MINUTE = ONE_SECOND * 60;

/** Port to tell other scripts that the server list has been updated. */
export const UPDATE_SERVERS_PORT = 13;

export const CONTRACT_TYPE_TO_SOLVER_MAP = {
  'Algorithmic Stock Trader I': algorithmicStockTraderI,
  'Algorithmic Stock Trader II': null,
  'Algorithmic Stock Trader III': algorithmicStockTraderIII,
  'Algorithmic Stock Trader IV': null,
  'Array Jumping Game II': null,
  'Array Jumping Game': arrayJumpingGame,
  'Compression I: RLE Compression': null,
  'Compression II: LZ Decompression': compressionIILZDecompression,
  'Compression III: LZ Compression': null,
  'Encryption I: Caesar Cipher': null,
  'Encryption II: Vigenère Cipher': null,
  'Find All Valid Math Expressions': null,
  'Find Largest Prime Factor': findLargestPrimeFactor,
  'Generate IP Addresses': null,
  'HammingCodes: Encoded Binary to Integer': null,
  'HammingCodes: Integer to Encoded Binary': null,
  'Merge Overlapping Intervals': null,
  'Minimum Path Sum in a Triangle': null,
  'Proper 2-Coloring of a Graph': null,
  'Sanitize Parentheses in Expression': sanitizeParenthesesInExpression,
  'Shortest Path in a Grid': shortestPathInAGrid,
  'Spiralize Matrix': null,
  'Subarray with Maximum Sum': null,
  'Total Ways to Sum II': null,
  'Total Ways to Sum': totalWaysToSum,
  'Unique Paths in a Grid I': uniquePathsInAGridI,
  'Unique Paths in a Grid II': null,
};
