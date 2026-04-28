export class SchemaStorage {
  constructor() {
    this.nodes = new Map()
    this.edges = new Map()
  }

  setNodeCoordinate(id, xCoordinate, yCoordinate) {
    const node = this.nodes.get(id)
    if (node) {
      node.x = xCoordinate
      node.y = yCoordinate
    }
  }

  addNode(node) {
    this.nodes.set(node.id, node)
  }

  getNode(id) {
    return this.nodes.get(id)
  }

  addNode(node) {
    this.nodes.set(node.id, node)
  }

  getNodes() {
    return this.nodes
  }
}
