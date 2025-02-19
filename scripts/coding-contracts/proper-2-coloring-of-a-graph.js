/**
 * Proper 2-Coloring of a Graph
 *
 * You are given the following data, representing a graph:
 * [8,[[1,5],[2,3],[3,6],[6,7],[2,4],[1,6],[4,6],[2,3],[2,7]]]
 *
 * Note that "graph", as used here, refers to the field of graph theory, and has
 * no relation to statistics or plotting. The first element of the data
 * represents the number of vertices in the graph. Each vertex is a unique
 * number between 0 and 7. The next element of the data represents the edges of
 * the graph. Two vertices u,v in a graph are said to be adjacent if there
 * exists an edge [u,v].
 *
 * Note that an edge [u,v] is the same as an edge [v,u], as order does not
 * matter. You must construct a 2-coloring of the graph, meaning that you have
 * to assign each vertex in the graph a "color", either 0 or 1, such that no two
 * adjacent vertices have the same color.
 *
 * Submit your answer in the form of an array, where element i represents the
 * color of vertex i. If it is impossible to construct a 2-coloring of the given
 * graph, instead submit an empty array.
 *
 * Examples:
 *
 * Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
 * Output: [0, 0, 1, 1]
 *
 * Input: [3, [[0, 1], [0, 2], [1, 2]]]
 * Output: []
 *
 * @param {[number, [number, number][]]} input
 * @returns {number[]}
 */
export function solveProper2ColoringOfAGraph(input) {
  const [vertexCount, edges] = input;

  const vertices = [...Array(vertexCount).keys()].map(
    (value) => new Vertex(value)
  );
  for (const edge of edges) {
    const [vertex1, vertex2] = edge.map((value) => vertices[value]);
    vertex1.adjacentVertices.push(vertex2);
    vertex2.adjacentVertices.push(vertex1);
  }

  for (const vertex of vertices) {
    setColor(vertex);
  }

  const colors = [];
  for (const vertex of vertices) {
    for (const adjacentVertex of vertex.adjacentVertices) {
      if (adjacentVertex.color === vertex.color) return [];
    }
    colors.push(vertex.color);
  }
  return colors;
}

/**
 * @param {Vertex} vertex
 * @returns {boolean} was successful
 */
function setColor(vertex) {
  const verticesToSetColor = [];
  for (const adjacentVertex of vertex.adjacentVertices) {
    if (adjacentVertex.color === vertex.color) {
      if (adjacentVertex.colorChangeCount === 2) return false;

      adjacentVertex.color = vertex.color === 0 ? 1 : 0;
      adjacentVertex.colorChangeCount++;
      verticesToSetColor.push(adjacentVertex);
    }
  }

  for (const adjacentVertex of verticesToSetColor) {
    if (!setColor(adjacentVertex)) return false;
  }
  return true;
}

/** @typedef {0|1} Color */

class Vertex {
  /** @param {number} value */
  constructor(value) {
    /** @type {number} */ this.value = value;
    /** @type {Color} */ this.color = 0;
    /** @type {Vertex[]} */ this.adjacentVertices = [];
    /** @type {number} */ this.colorChangeCount = 0;
  }
}
