/**
 * Merge Overlapping Intervals
 *
 * Given the following array of array of numbers representing a list of
 * intervals, merge all overlapping intervals.
 *
 * The intervals must be returned in ASCENDING order. You can assume that in an
 * interval, the first number will always be smaller than the second.
 *
 * @param {int[][]} intervals
 */
export function mergeOverlappingIntervals(intervals) {
  // Order all intervals by second number and then by first number.
  intervals.sort((a, b) => a[1] - b[1]);
  intervals.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (_hasOverlap(intervals[i], intervals[j])) {
      }
    }
  }
}

function _merge(interval1, interval2) {
  return [interval1[0], interval2[1]];
}

function _hasOverlap(interval1, interval2) {
  return interval2[0] < interval1[1];
}

const input = [
  [11, 17],
  [7, 12],
  [25, 30],
  [24, 34],
  [8, 14],
  [2, 11],
  [21, 30],
  [6, 8],
  [25, 31],
  [4, 14],
  [4, 7],
];
console.log(mergeOverlappingIntervals(input));
