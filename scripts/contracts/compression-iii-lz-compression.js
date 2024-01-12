/**
 * Compression III: LZ Compression
 *
 * Lempel-Ziv (LZ) compression is a data compression technique which encodes
 * data using references to earlier parts of the data. In this variant of LZ,
 * data is encoded in two types of chunk. Each chunk begins with a length L,
 * encoded as a single ASCII digit from 1 to 9, followed by the chunk data,
 * which is either:
 *
 * 1. Exactly L characters, which are to be copied directly into the
 *    uncompressed data.
 *
 * 2. A reference to an earlier part of the uncompressed data. To do this, the
 *    length is followed by a second ASCII digit X: each of the L output
 *    characters is a copy of the character X places before it in the
 *    uncompressed data.
 *
 * For both chunk types, a length of 0 instead means the chunk ends immediately,
 * and the next character is the start of a new chunk. The two chunk types
 * alternate, starting with type 1, and the final chunk may be of either type.
 *
 * You are given the following input string:
 *     s7UqDon67cXj6htLxf121v7q21v7q21v7fvflZ5W1fQufQufQuufQuu
 * Encode it using Lempel-Ziv encoding with the minimum possible output length.
 *
 * Examples (some have other possible encodings of minimal length):
 *     abracadabra     ->  7abracad47
 *     mississippi     ->  4miss433ppi
 *     aAAaAAaAaAA     ->  3aAA53035
 *     2718281828      ->  627182844
 *     abcdefghijk     ->  9abcdefghi02jk
 *     aaaaaaaaaaaa    ->  3aaa91
 *     aaaaaaaaaaaaa   ->  1a91031
 *     aaaaaaaaaaaaaa  ->  1a91041
 *
 * @param {string} input
 */
export default function compressionIIILZCompression(input) {}
