import { MarkerType } from '@vue-flow/core'

const defaultMarkerEnd = {
  type: MarkerType.ArrowClosed,
  width: 15,
  height: 15,
  color: '#4caf50',
  orient: 'auto',
}

export function createDefaultEdge() {
  const defaultEdge = {
    type: 'step',
    style: {
      stroke: '#4caf50',
      strokeWidth: 2,
    },
    markerEnd: defaultMarkerEnd,
  }

  return defaultEdge
}

export function createEdge(connection) {
  const id = createId()
  const sourceNode = connection.source.split('_')[0]

  if (sourceNode === 'conditionNode') {
    const labeledEdge = {
      id: id,
      ...connection,
      type: 'custom',
      data: { inputValue: '' },
      markerEnd: defaultMarkerEnd,
    }

    return labeledEdge
  }

  const baseEdge = {
    id: id,
    ...connection,
    type: 'base',
    markerEnd: defaultMarkerEnd,
  }

  return baseEdge
}

function createId() {
  return `edge_${Date.now()}_${Math.random()}`
}
