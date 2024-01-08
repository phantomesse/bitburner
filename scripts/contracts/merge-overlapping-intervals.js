/**
 * Merge Overlapping Intervals
 *
 * Given the following array of arrays of numbers representing a list of
 * intervals, merge all overlapping intervals.
 *
 * [[7,12],[25,35],[9,15],[22,24],[18,23],[8,17],[11,21],[16,24],[9,10],[4,8]]
 *
 * Example:
 *
 * [[1, 3], [8, 10], [2, 6], [10, 16]]
 *
 * would merge into [[1, 6], [8, 16]].
 *
 * The intervals must be returned in ASCENDING order. You can assume that in an
 * interval, the first number will always be smaller than the second.
 *
 * @typedef {[number, number]} Interval
 *
 * @param {Interval[]} input
 */
export default function mergeOverlappingIntervals(input) {
  const intervals = [...input];

  // Sort intervals by first number.
  intervals.sort((a, b) => a[0] - b[0]);

  let i = 0;
  while (i < intervals.length - 1) {
    const a = intervals[i];
    const b = intervals[i + 1];
    if (isOverlapping(a, b)) {
      intervals.splice(i, 2, mergeIntervals(a, b));
      i = 0;
    } else {
      i++;
    }
  }
  return intervals;
}

/**
 * @param {Interval} a
 * @param {Interval} b
 * @returns {boolean} whether the intervals are overlapping
 */
function isOverlapping(a, b) {
  // If 'a' is inside 'b'.
  if (b[0] <= a[0] && a[1] <= b[1]) return true;

  // If 'b' is inside 'a'.
  if (a[0] <= b[0] && b[1] <= a[1]) return true;

  // If 'a' is before 'b'.
  if (b[0] <= a[1]) return true;

  return false;
}

/**
 * @param {Interval} a
 * @param {Interval} b
 * @returns {Interval} merged interval
 */
function mergeIntervals(a, b) {
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
}
