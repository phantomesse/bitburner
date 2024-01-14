/**
 * Total Ways to Sum II
 *
 * How many different distinct ways can the number 174 be written as a sum of integers contained in the set:
 *
 * [1,2,3,4,5,7,8,9,10,13]?
 *
 * You may use each integer in the set zero or more times.
 *
 */
export default function totalWaysToSumII() {
  const integers = [1, 2, 3, 4, 5, 7, 8, 9, 10, 13];
  const sum = 174;

  const integerToMaxMultiplier = Object.fromEntries(
    integers.map(integer => [integer, Math.floor(sum / integer)])
  );

  for (let i = 0; i < integers.length; i++) {
    for ()
  }

  console.log(integerToMaxMultiplier);
}

totalWaysToSumII();
