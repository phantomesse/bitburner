/**
 * Merge Overlapping Intervals
 *
 * Given the following array of array of numbers representing a list of
 * intervals, merge all overlapping intervals.
 *
 * The intervals must be returned in ASCENDING order. You can assume that in an
 * interval, the first number will always be smaller than the second.
 *
 * @param {int[][]} input
 */
export function mergeOverlappingIntervals(input) {
  return _mergeOverlappingIntervals(input);
}

/**
 * @param {int[][]} intervals
 * @returns {int[][]} merged intervals
 */
function _mergeOverlappingIntervals(intervals) {
  // Sort by second number and then by first number.
  intervals.sort((a, b) => a[1] - b[1]);
  intervals.sort((a, b) => a[0] - b[0]);

  // Find any overlaps.
  let overlappingIntervals = [];
  let mergedInterval;
  for (let i = 0; i < intervals.length - 1; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (_hasOverlap(intervals[i], intervals[j])) {
        overlappingIntervals.push(intervals[i], intervals[j]);
        mergedInterval = _merge(intervals[i], intervals[j]);
        break;
      }
    }
    if (mergedInterval) break;
  }

  if (mergedInterval === undefined) return intervals;
  intervals = [
    mergedInterval,
    ...intervals.filter(interval => {
      for (const overlappingInterval of overlappingIntervals) {
        if (_equal(overlappingInterval, interval)) return false;
      }
      return true;
    }),
  ];
  return _mergeOverlappingIntervals(intervals);
}

/**
 * @param {int[]} a interval
 * @param {int[]} b interval
 * @returns {boolean} true if has overlap
 */
function _hasOverlap(a, b) {
  if (a[0] === b[0] || a[1] === b[1]) return true;
  return a[0] < b[0] ? b[0] <= a[1] : a[0] <= b[1];
}

/**
 * Merge overlapping intervals. Intervals **must** be overlapping.
 *
 * @param {int[]} a interval
 * @param {int[]} b interval
 * @returns {int[]} merged interval
 */
function _merge(a, b) {
  return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
}

function _equal(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
