import {
  algorithmicStockTraderI,
  algorithmicStockTraderII,
  algorithmicStockTraderIII,
  algorithmicStockTraderIV,
} from 'contracts/algorithmic-stock-trader';
import arrayJumpingGame from 'contracts/array-jumping-game';
import compressionIRLECompression from 'contracts/compression-i-rle-compression';
import compressionIILZDecompression from 'contracts/compression-ii-lz-decompression';
import encryptionICaesarCipher from 'contracts/encryption-i-caesar-cipher';
import encryptionIIVigenereCipher from 'contracts/encryption-ii-vigenere-cipher';
import findAllValidMathExpressions from 'contracts/find-all-valid-math-expressions';
import findLargestPrimeFactor from 'contracts/find-largest-prime-factor';
import generateIPAddresses from 'contracts/generate-ip-addresses';
import mergeOverlappingIntervals from 'contracts/merge-overlapping-intervals';
import minimumPathSumInATriangle from 'contracts/minimum-path-sum-in-a-triangle';
import proper2ColoringOfAGraph from 'contracts/proper-2-coloring-of-a-graph';
import sanitizeParenthesesInExpression from 'contracts/sanitize-parentheses-in-expression';
import spiralizeMatrix from 'contracts/spiralize-matrix';
import subarrayWithMaximumSum from 'contracts/subarray-with-maximum-sum';
import totalWaysToSum from 'contracts/total-ways-to-sum';
import {
  uniquePathsInAGridI,
  uniquePathsInAGridII,
} from 'contracts/unique-paths-in-a-grid';

export const HOME_HOSTNAME = 'home';

/** Maximum number of servers that we can buy. */
export const MAX_PURCHASED_SERVER_COUNT = 26;

/** One second in milliseconds. */
export const ONE_SECOND = 1000;

/** One minute in milliseconds. */
export const ONE_MINUTE = ONE_SECOND * 60;

export const CONTRACT_TYPE_TO_SOLVER_MAP = {
  // 'Algorithmic Stock Trader I': algorithmicStockTraderI,
  'Algorithmic Stock Trader II': algorithmicStockTraderII,
  // 'Algorithmic Stock Trader III': algorithmicStockTraderIII,
  // 'Algorithmic Stock Trader IV': algorithmicStockTraderIV,
  'Array Jumping Game II': null,
  'Array Jumping Game': arrayJumpingGame,
  'Compression I: RLE Compression': compressionIRLECompression,
  'Compression II: LZ Decompression': compressionIILZDecompression,
  'Compression III: LZ Compression': null,
  'Encryption I: Caesar Cipher': encryptionICaesarCipher,
  'Encryption II: Vigenère Cipher': encryptionIIVigenereCipher,
  'Find All Valid Math Expressions': findAllValidMathExpressions,
  'Find Largest Prime Factor': findLargestPrimeFactor,
  'Generate IP Addresses': generateIPAddresses,
  'HammingCodes: Encoded Binary to Integer': null,
  'HammingCodes: Integer to Encoded Binary': null,
  'Merge Overlapping Intervals': mergeOverlappingIntervals,
  'Minimum Path Sum in a Triangle': minimumPathSumInATriangle,
  'Proper 2-Coloring of a Graph': proper2ColoringOfAGraph,
  'Sanitize Parentheses in Expression': sanitizeParenthesesInExpression,
  // 'Shortest Path in a Grid': shortestPathInAGrid,
  'Spiralize Matrix': spiralizeMatrix,
  'Subarray with Maximum Sum': subarrayWithMaximumSum,
  'Total Ways to Sum II': null,
  'Total Ways to Sum': totalWaysToSum,
  'Unique Paths in a Grid I': uniquePathsInAGridI,
  'Unique Paths in a Grid II': uniquePathsInAGridII,
};

export const CRIME_TYPES = [
  'Shoplift',
  'Rob Store',
  'Mug',
  'Larceny',
  'Deal Drugs',
  'Bond Forgery',
  'Traffick Arms',
  'Homicide',
  'Grand Theft Auto',
  'Kidnap',
  'Assassination',
  'Heist',
];

export const COMPANY_NAMES = [
  'ECorp',
  'MegaCorp',
  'Bachman & Associates',
  'Blade Industries',
  'NWO',
  'Clarke Incorporated',
  'OmniTek Incorporated',
  'Four Sigma',
  'KuaiGong International',
  'Fulcrum Technologies',
  'Storm Technologies',
  'DefComm',
  'Helios Labs',
  'VitaLife',
  'Icarus Microsystems',
  'Universal Energy',
  'Galactic Cybersystems',
  'AeroCorp',
  'Omnia Cybersystems',
  'Solaris Space Systems',
  'DeltaOne',
  'Global Pharmaceuticals',
  'Nova Medical',
  'Central Intelligence Agency',
  'National Security Agency',
  'Watchdog Security',
  'LexoCorp',
  'Rho Construction',
  'Alpha Enterprises',
  'Aevum Police Headquarters',
  'SysCore Securities',
  'CompuTek',
  'NetLink Technologies',
  'Carmichael Security',
  'FoodNStuff',
  "Joe's Guns",
  'Omega Software',
  'Noodle Bar',
];
