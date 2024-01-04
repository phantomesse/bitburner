/**
 * Array Jumping Game
 *
 * You are given the following array of integers:
 *
 * 4,0,0,3,3,4,7,5,0,1,2,4,5,1
 *
 * Each element in the array represents your MAXIMUM jump length at that
 * position. This means that if you are at position i and your maximum jump
 * length is n, you can jump to any position from i to i+n.
 *
 * Assuming you are initially positioned at the start of the array, determine
 * whether you are able to reach the last index.
 *
 * Your answer should be submitted as 1 or 0, representing true and false
 * respectively
 *
 * @param {number[]} maxJumps
 * @returns {0|1} representing whether able to reach the last index
 */
export default function arrayJumpingGame(maxJumps) {
  return canReachEnd(0, maxJumps) ? 1 : 0;
}

/**
 * @param {number} index
 * @param {number[]} maxJumps
 * @returns {boolean}
 */
function canReachEnd(index, maxJumps) {
  if (index === maxJumps.length - 1) return true;
  if (index >= maxJumps.length) return false;

  for (let jump = 1; jump <= maxJumps[index]; jump++) {
    if (canReachEnd(index + jump, maxJumps)) return true;
  }
  return false;
}

// console.log(arrayJumpingGame([4, 0, 0, 3, 3, 4, 7, 5, 0, 1, 2, 4, 5, 1])); // 1
// console.log(
//   arrayJumpingGame([9, 1, 2, 0, 9, 1, 6, 7, 9, 4, 0, 0, 10, 0, 7, 1, 4, 2])
// ); // 1
