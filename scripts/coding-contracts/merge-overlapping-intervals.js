/**
 * Merge Overlapping Intervals
 *
 * Given the following array of arrays of numbers representing a list of
 * intervals, merge all overlapping intervals.
 *
 * [[9,12],[18,22],[3,9],[1,3],[3,5],[15,21],[2,7],[3,7],[5,10],[24,28],[2,11],[2,6],[8,18],[8,16],[5,14],[24,30],[5,7],[3,7],[3,10]]
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
 * @param {([number, number])[]} input
 * @returns {([number, number])[]}
 */
export function solveMergeOverlappingIntervals(input) {
  return mergeOverlappingIntervals(input);
}

/**
 * @param {([number, number])[]} intervals
 * @returns {([number, number])[]}
 */
function mergeOverlappingIntervals(intervals) {
  let newIntervals, hasOverlappingIntervals;

  do {
    newIntervals = [...intervals];
    hasOverlappingIntervals = false;

    for (let i = 0; i < intervals.length - 1; i++) {
      const interval1 = intervals[i];

      for (let j = i + 1; j < intervals.length; j++) {
        const interval2 = intervals[j];

        if (!hasOverlap(interval1, interval2)) continue;

        hasOverlappingIntervals = true;
        newIntervals.push(mergeIntervals(interval1, interval2));
        if (newIntervals.includes(interval1)) {
          newIntervals.splice(newIntervals.indexOf(interval1), 1);
        }
        if (newIntervals.includes(interval2)) {
          newIntervals.splice(newIntervals.indexOf(interval2), 1);
        }
        break;
      }
    }

    intervals = newIntervals;
  } while (hasOverlappingIntervals);

  return newIntervals.sort(
    (interval1, interval2) => interval1[0] - interval2[0]
  );
}

function hasOverlap(interval1, interval2) {
  const [start1, end1] = interval1;
  const [start2, end2] = interval2;
  if (end1 < start2 || end2 < start1) return false;
  return true;
}

function mergeIntervals(interval1, interval2) {
  const [start1, end1] = interval1;
  const [start2, end2] = interval2;
  return [Math.min(start1, start2), Math.max(end1, end2)];
}
