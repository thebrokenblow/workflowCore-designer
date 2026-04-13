<template>
  <div class="canvas-component">
    <div class="vueflow-wrapper">
      <VueFlow
        ref="vueFlowRef"
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :default-viewport="{ zoom: 1, x: 0, y: 0 }"
        :min-zoom="0.5"
        :max-zoom="2"
        :nodes-draggable="true"
        @drop="onDrop"
        @dragover="onDragOver"
        @connect="onConnect"
        @edge-click="onEdgeClick"
        @node-drag-stop="onNodeDragStop"
        @pan-end="forceUpdateEdges"
      >
        <template #node-actionNode="{ data, id }">
          <ActionNode
            :data="data"
            :id="id"
            @delete="deleteNode"
            @update-dimensions="onNodeDimensionsUpdate"
          />
        </template>
        <template #node-conditionNode="{ data, id }">
          <ConditionNode
            :data="data"
            :id="id"
            @delete="deleteNode"
            @update-dimensions="onNodeDimensionsUpdate"
          />
        </template>
        <template #node-parallelSplitNode="{ data, id }">
          <ParallelSplitNode
            :data="data"
            :id="id"
            @delete="deleteNode"
            @update-dimensions="onNodeDimensionsUpdate"
          />
        </template>
        <template #node-syncNode="{ data, id }">
          <SyncNode
            :data="data"
            :id="id"
            @delete="deleteNode"
            @update-dimensions="onNodeDimensionsUpdate"
          />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<script>
import { VueFlow } from '@vue-flow/core'

import ActionNode from './nodes/ActionNode.vue'
import ConditionNode from './nodes/ConditionNode.vue'
import ParallelSplitNode from './nodes/ParallelSplitNode.vue'
import SyncNode from './nodes/SyncNode.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

export default {
  name: 'CanvasComponent',

  components: {
    VueFlow,
    ActionNode,
    ConditionNode,
    ParallelSplitNode,
    SyncNode,
  },

  props: {
    initialNodes: {
      type: Array,
      default: () => [],
    },
    initialEdges: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      nodeTypes: {
        actionNode: 'actionNode',
        conditionNode: 'conditionNode',
        parallelSplitNode: 'parallelSplitNode',
        syncNode: 'syncNode',
      },
      nodes: [...this.initialNodes],
      edges: [...this.initialEdges],
    }
  },

  watch: {
    initialNodes: {
      handler(newVal) {
        this.nodes = [...newVal]
        this.forceUpdateEdges()
      },
      deep: true,
    },
    initialEdges: {
      handler(newVal) {
        this.edges = [...newVal]
        this.forceUpdateEdges()
      },
      deep: true,
    },
    nodes: {
      handler() {
        this.$emit('update:nodes', this.nodes)
      },
      deep: true,
    },
    edges: {
      handler() {
        this.$emit('update:edges', this.edges)
      },
      deep: true,
    },
  },

  mounted() {
    setTimeout(() => {
      this.forceUpdateEdges()
    }, 100)
  },

  methods: {
    onDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },

    onDrop(event) {
      event.preventDefault()

      const rawData = event.dataTransfer.getData('application/json')
      if (!rawData) {
        return
      }

      const blockData = JSON.parse(rawData)
      const vueFlowElement = this.$refs.vueFlowRef.$el
      const rect = vueFlowElement.getBoundingClientRect()
      const viewport = this.$refs.vueFlowRef.getViewport()

      // eslint-disable-next-line no-useless-assignment
      let nodeType = ''
      // eslint-disable-next-line no-useless-assignment
      let offsetX = 0
      // eslint-disable-next-line no-useless-assignment
      let offsetY = 0

      switch (blockData.type) {
        case 'ActionBlock':
          nodeType = 'actionNode' // Исправлено: было 'actionBlock'
          offsetX = 140
          offsetY = 120
          break
        case 'ConditionBlock':
          nodeType = 'conditionNode' // Исправлено: было 'conditionBlock'
          offsetX = 50
          offsetY = 50
          break
        case 'ParallelSplitBlock':
          nodeType = 'parallelSplitNode' // Исправлено: было 'parallelSplitBlock'
          offsetX = 60
          offsetY = 60
          break
        case 'SyncBlock':
          nodeType = 'syncNode' // Исправлено: было 'syncBlock'
          offsetX = 60
          offsetY = 60
          break
        default:
          return
      }

      const position = {
        x: (event.clientX - rect.left - offsetX) / viewport.zoom - viewport.x,
        y: (event.clientY - rect.top - offsetY) / viewport.zoom - viewport.y,
      }

      this.addNode(blockData, position, nodeType)
      setTimeout(() => this.forceUpdateEdges(), 50)
    },

    onConnect(connection) {
      // Проверяем, существует ли уже такое соединение
      const isDuplicate = this.edges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle
      )

      if (isDuplicate) {
        console.warn('Такое соединение уже существует')
        return
      }

      const newEdge = {
        id: `edge_${Date.now()}_${Math.random()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        animated: false,
        style: { stroke: '#4CAF50', strokeWidth: 2 },
        labelStyle: { fill: '#4CAF50', fontWeight: 'bold' },
        markerEnd: { type: 'arrowclosed', color: '#4CAF50' },
      }

      this.edges.push(newEdge)
      setTimeout(() => this.forceUpdateEdges(), 50)
    },

    onEdgeClick(edge) {
      if (confirm('Удалить соединение?')) {
        this.edges = this.edges.filter((e) => e.id !== edge.id)
        this.forceUpdateEdges()
      }
    },

    onNodeDragStop() {
      this.forceUpdateEdges()
    },

    onNodeDimensionsUpdate() {
      this.forceUpdateEdges()
    },

    forceUpdateEdges() {
      if (this.$refs.vueFlowRef) {
        this.nodes.forEach((node) => {
          if (this.$refs.vueFlowRef.updateNodeInternals) {
            this.$refs.vueFlowRef.updateNodeInternals(node.id)
          }
        })
        const currentNodes = [...this.nodes]
        this.nodes = currentNodes
      }
      this.$forceUpdate()
    },

    addNode(block, position, nodeType = 'actionNode') {
      // Исправлено: было 'actionBlock'
      const nodeId = `${block.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // eslint-disable-next-line no-useless-assignment
      let nodeData = {}

      switch (block.type) {
        case 'ConditionBlock':
          nodeData = {
            nameHeader: `${block.name}_${this.getNextNodeNumber(block.name)}`,
            description: '',
            inputsList: [],
            outputsList: [
              { id: 1, key: 'True', value: 'true' },
              { id: 2, key: 'False', value: 'false' },
            ],
            handleTypes: {
              left: 'target',
              right: 'source',
              top: null,
              bottom: null,
            },
          }
          break

        case 'ParallelSplitBlock':
          nodeData = {
            label: `${block.name}_${this.getNextNodeNumber(block.name)}`,
            description: '',
            branches: [
              { id: 1, name: 'Ветка A' },
              { id: 2, name: 'Ветка B' },
            ],
            handleTypes: {
              left: 'target',
              right: 'source',
              top: null,
              bottom: null,
            },
          }
          break

        case 'SyncBlock':
          nodeData = {
            label: `${block.name}_${this.getNextNodeNumber(block.name)}`,
            description: '',
            syncCount: 3,
            handleTypes: {
              left: 'target',
              right: 'source',
              top: null,
              bottom: null,
            },
          }
          break

        default: // ActionBlock
          nodeData = {
            nameHeader: `${block.name}_${this.getNextNodeNumber(block.name)}`,
            description: '',
            inputsList: [],
            outputsList: [],
            handleTypes: {
              left: 'target',
              right: 'source',
              top: null,
              bottom: null,
            },
          }
          break
      }

      const newNode = {
        id: nodeId,
        type: nodeType,
        position: position,
        data: nodeData,
      }

      this.nodes.push(newNode)
      setTimeout(() => this.forceUpdateEdges(), 50)
    },

    getNextNodeNumber(name) {
      const nodesOfType = this.nodes.filter(
        (node) => node.data?.nameHeader?.startsWith(name) || node.data?.label?.startsWith(name)
      )
      return nodesOfType.length + 1
    },

    deleteNode(nodeId) {
      this.nodes = this.nodes.filter((node) => node.id !== nodeId)
      this.edges = this.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      setTimeout(() => this.forceUpdateEdges(), 50)
    },

    getNodes() {
      return this.nodes
    },

    getEdges() {
      return this.edges
    },

    clearCanvas() {
      this.nodes = []
      this.edges = []
    },

    loadWorkflow(nodes, edges) {
      this.nodes = [...nodes]
      this.edges = [...edges]
      setTimeout(() => this.forceUpdateEdges(), 50)
    },
  },
}
</script>

<style scoped>
.canvas-component {
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.vueflow-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fafafa;
}

.vueflow-wrapper :deep(.vue-flow) {
  background: radial-gradient(circle, #e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
  height: 100%;
  width: 100%;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

:deep(.vue-flow__node) {
  animation: fadeInScale 0.3s ease-out;
}

:deep(.vue-flow__edge-path) {
  stroke: #4caf50;
  stroke-width: 2;
  cursor: pointer;
}

:deep(.vue-flow__edge-path:hover) {
  stroke: #ff9800;
  stroke-width: 3;
}

:deep(.vue-flow__edge-label) {
  font-size: 12px;
  font-weight: bold;
}

:deep(.vue-flow__node.selected) {
  outline: 2px solid #4caf50;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
