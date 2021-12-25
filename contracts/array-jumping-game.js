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
 */

const maxJumps = [3, 5, 1, 2, 5, 4, 0, 8, 4, 0, 10, 1, 7, 0, 4, 3];
console.log(
  'max jumps' + maxJumps.map(maxJump => `${maxJump}`.padStart(3)).join(' ')
);
console.log(
  'index    ' + maxJumps.map((_, index) => `${index}`.padStart(3)).join(' ')
);
console.log(getPathToLastIndex(maxJumps));

/**
 * @param {int[]} maxJumps List of numbers where each number represents max jump.
 * @param {int} [currentIndex=0]
 * @returns {string[]} The path to the last index where each member of the array is
 * 									the jump. Empty if no path.
 */
function getPathToLastIndex(maxJumps, currentIndex) {
  currentIndex = currentIndex || 0;
  if (currentIndex === maxJumps.length - 1) return ['end'];

  const maxJump = maxJumps[currentIndex];
  for (let n = 1; n <= maxJump; n++) {
    const path = getPathToLastIndex(maxJumps, currentIndex + n);
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
