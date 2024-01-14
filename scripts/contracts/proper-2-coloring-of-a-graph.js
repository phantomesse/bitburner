/**
 *
 *
 * You are given data, representing a graph. Note that “graph”, as used here,
 * refers to the field of graph theory, and has no relation to statistics or
 * plotting.
 *
 * The first element of the data represents the number of vertices in the graph.
 * Each vertex is a unique number between 0 and ${data[0] - 1}. The next element
 * of the data represents the edges of the graph.
 *
 * Two vertices u,v in a graph are said to be adjacent if there exists an edge
 * [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does
 * not matter.
 *
 * You must construct a 2-coloring of the graph, meaning that you have to assign
 * each vertex in the graph a “color”, either 0 or 1, such that no two adjacent
 * vertices have the same color. Submit your answer in the form of an array,
 * where element i represents the color of vertex i. If it is impossible to
 * construct a 2-coloring of the given graph, instead submit an empty array.
 *
 * Examples:
 *
 * Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
 * Output: [0, 0, 1, 1]
 *
 * Input: [3, [[0, 1], [0, 2], [1, 2]]]
 * Output: []
 *
 * @typedef {[number, number]} Edge
 *
 * @param {[number, Edge[]]} input
 */
export default function proper2ColoringOfAGraph(input) {
  const [vertexCount, edges] = input;
  const vertices = Array.from({ length: vertexCount }, (_, i) => new Vertex(i));
  for (const edge of edges) {
    vertices[edge[0]].adjacentVertexIds.add(edge[1]);
    vertices[edge[1]].adjacentVertexIds.add(edge[0]);
  }

  let wasSuccessful;
  do {
    const index = vertices.find(vertex => vertex.color === undefined).id;
    vertices[index].color = 0;
    wasSuccessful = setColors(index, vertices);
  } while (
    wasSuccessful &&
    vertices.find(vertex => vertex.color === undefined)
  );

  return wasSuccessful ? vertices.map(vertex => vertex.color) : [];
}

/**
 * @param {number} currentVertexId
 * @param {Vertex[]} vertices
 * @returns {boolean} whether successfully colored all vertices
 */
function setColors(currentVertexId, vertices) {
  const currentVertex = vertices[currentVertexId];
  for (const adjacentVertexId of currentVertex.adjacentVertexIds) {
    const adjacentVertex = vertices[adjacentVertexId];
    if (adjacentVertex.color === currentVertex.color) return false; // No possible construction.
    if (adjacentVertex.color === undefined) {
      adjacentVertex.color = currentVertex.color === 0 ? 1 : 0;
      if (!setColors(adjacentVertexId, vertices)) return false; // No possible construction.
    }
  }
  return true;
}

class Vertex {
  /** @param {number} id */
  constructor(id) {
    this.id = id;
    /** @type {Set<number>} */ this.adjacentVertexIds = new Set();
    /** @type {(0|1|undefined)} */ this.color = undefined;
  }
}
