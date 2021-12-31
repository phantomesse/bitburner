/**
 * Array Jumping Game
 *
 * Each element in the array represents your MAXIMUM jump length at that
 * position. This means that if you are at position i and your maximum jump
 * length is n, you can jump to any position from i to i+n.
 *
 * Assuming you are initially positioned at the start of the array, determine
 * whether you are able to reach the last index exactly.
 *
 * Your answer should be submitted as 1 or 0, representing true and false
 * respectively
 *
 * @param {int[]} input
 * @returns {int} 1 if can reach the end, 0 if not
 */
export function arrayJumpingGame(input) {
  return _getPathToLastIndex(input).length === 0 ? 0 : 1;
}

/**
 * @param {int[]} maxJumps List of numbers where each number represents max jump.
 * @param {int} [currentIndex=0]
 * @returns {string[]} The path to the last index where each member of the array is
 * 									the jump. Empty if no path.
 */
function _getPathToLastIndex(maxJumps, currentIndex) {
  currentIndex = currentIndex || 0;
  if (currentIndex === maxJumps.length - 1) return ['end'];

  const maxJump = maxJumps[currentIndex];
  for (let n = 1; n <= maxJump; n++) {
    const path = _getPathToLastIndex(maxJumps, currentIndex + n);
    if (path.length > 0)
      return [
        `jump from ${currentIndex} to ${
          currentIndex + n
        } (max jump is ${maxJump})`,
        ...path,
      ];
  }

  return [];
}
