// composables/useDnD.js
import { useVueFlow } from '@vue-flow/core'
import { ref, watch } from 'vue'

let myShemaStorage = null

function getId(draggedType) {
  return `${draggedType}_${Date.now()}_${Math.random()}`
}

const state = {
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
}

export default function useDragAndDrop() {
  function setShemaStorage(shemaStorage) {
    myShemaStorage = shemaStorage
  }

  const { draggedType, isDragOver, isDragging } = state
  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

  watch(isDragging, (dragging) => {
    if (dragging) {
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.userSelect = ''
    }
  })

  function onDragStart(event, type) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true
    document.addEventListener('drop', onDragEnd)
  }

  function onDragOver(event) {
    event.preventDefault()

    if (draggedType.value) {
      isDragOver.value = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false
  }

  function onDragEnd() {
    isDragging.value = false
    isDragOver.value = false
    draggedType.value = null
    document.removeEventListener('drop', onDragEnd)
  }

  function onDrop(event) {
    if (!myShemaStorage) {
      return
    }

    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodeId = getId(draggedType.value)

    const newNode = {
      id: nodeId,
      type: draggedType.value,
      position,
    }

    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }))
      off()
    })

    if (myShemaStorage) {
      myShemaStorage.addNode(newNode)
    }

    addNodes(newNode)
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
    setShemaStorage, // ✅ Нужно вернуть эту функцию!
  }
}
