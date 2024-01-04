/**
 * Compression II: LZ Decompression
 *
 * Lempel-Ziv (LZ) compression is a data compression technique which encodes
 * data using references to earlier parts of the data. In this variant of LZ,
 * data is encoded in two types of chunk. Each chunk begins with a length L,
 * encoded as a single ASCII digit from 1 to 9, followed by the chunk data,
 * which is either:
 *
 * 1. Exactly L characters, which are to be copied directly into the
 *    uncompressed data.
 * 2. A reference to an earlier part of the uncompressed data. To do this, the
 *    length is followed by a second ASCII digit X: each of the L output
 *    characters is a copy of the character X places before it in the
 *    uncompressed data.
 *
 * For both chunk types, a length of 0 instead means the chunk ends immediately,
 * and the next character is the start of a new chunk. The two chunk types
 * alternate, starting with type 1, and the final chunk may be of either type.
 *
 * You are given the following LZ-encoded string:
 *     65JFyHC910796NwIZRo6117911y997Qh8e5aQ77902YQHLfWe2378BaqXHi3432AA
 *
 * Decode it and output the original string.
 *
 * Example: decoding '5aaabb450723abb' chunk-by-chunk
 *     5aaabb           ->  aaabb
 *     5aaabb45         ->  aaabbaaab
 *     5aaabb450        ->  aaabbaaab
 *     5aaabb45072      ->  aaabbaaababababa
 *     5aaabb450723abb  ->  aaabbaaababababaabb
 *
 * @param {string} encoded message
 * @returns {string} uncompressed message
 */
export default function compressionIILZDecompression(encoded) {
  let uncompressed = '';

  let index = 0;
  let chunkType = 1;
  while (index < encoded.length) {
    const l = parseInt(encoded.charAt(index));
    if (l === 0) {
      // Chunk ends.
      index++;
      chunkType = chunkType === 1 ? 2 : 1;
      continue;
    }

    switch (chunkType) {
      case 1:
        // Copy the next L characters to the uncompressed message.
        uncompressed += encoded.substring(index + 1, index + 1 + l);
        index = index + 1 + l;
        chunkType = 2;
        break;
      case 2:
        const x = parseInt(encoded.charAt(index + 1));
        const chunk = uncompressed.substring(
          uncompressed.length - x,
          uncompressed.length - x + l
        );
        for (let i = 0; i < l; i++) {
          uncompressed += chunk.charAt(i % chunk.length);
        }
        index += 2;
        chunkType = 1;
        break;
    }
  }

  return uncompressed;
}
