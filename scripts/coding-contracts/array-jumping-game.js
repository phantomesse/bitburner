/**
 * Array Jumping Game
 *
 * You are given the following array of integers:
 *
 * 5,2,0,7,0,0,0,7,0,0,0,5,3,4,0,6
 *
 * Each element in the array represents your MAXIMUM jump length at that
 * position. This means that if you are at position i and your maximum jump
 * length is n, you can jump to any position from i to i+n.
 *
 * Assuming you are initially positioned at the start of the array, determine
 * whether you are able to reach the last index.
 *
 * Your answer should be submitted as 1 or 0, representing true and false
 * respectively.
 *
 * @param {number[]} input
 * @returns {number}
 */
export function solveArrayJumpingGame(input) {
  return getJumpCount(0, input) === 0 ? 0 : 1;
}

/**
 * Array Jumping Game II
 *
 * You are given the following array of integers:
 *
 * 4,5,2,1,6,2,2,2,5,0,1,3,1,2,6,6,6
 *
 * Each element in the array represents your MAXIMUM jump length at that
 * position. This means that if you are at position i and your maximum jump
 * length is n, you can jump to any position from i to i+n.
 *
 * Assuming you are initially positioned at the start of the array, determine
 * the minimum number of jumps to reach the end of the array.
 *
 * If it's impossible to reach the end, then the answer should be 0.
 *
 * @param {number[]} input
 * @returns {number}
 */
export function solveArrayJumpingGameII(input) {
  return getJumpCount(0, input);
}

/**
 * @param {number} currentIndex
 * @param {number[]} array
 * @param {number = 0} jumpsThusFar
 */
function getJumpCount(currentIndex, array, jumpsThusFar = 0) {
  if (currentIndex === array.length - 1) return jumpsThusFar;

  const maxJumpLength = array[currentIndex];
  if (maxJumpLength === 0) return 0;

  const jumpCounts = [];
  for (let jumpLength = maxJumpLength; jumpLength > 0; jumpLength--) {
    const jumpCount = getJumpCount(
      currentIndex + jumpLength,
      array,
      jumpsThusFar + 1
    );
    if (jumpCount === 0) continue;
    jumpCounts.push(jumpCount);
  }

  return jumpCounts.length === 0 ? 0 : Math.min(...jumpCounts);
}
