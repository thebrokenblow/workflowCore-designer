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
        <template #node-actionBlock="{ data, id }">
          <ActionBlockNode
            :data="data"
            :id="id"
            @delete="deleteNode"
            @update-dimensions="onNodeDimensionsUpdate"
          />
        </template>
        <template #node-conditionBlock="{ data, id }">
          <ConditionBlock
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
import ActionBlockNode from './nodes/ActionBlockNode.vue'
import ConditionBlock from './nodes/ConditionBlock.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

export default {
  name: 'CanvasComponent',

  components: {
    VueFlow,
    ActionBlockNode,
    ConditionBlock,
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
        actionBlock: ActionBlockNode,
        conditionBlock: ConditionBlock,
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

      let nodeType = ''
      let offsetX = 0
      let offsetY = 0

      if (blockData.type == 'ActionBlock') {
        nodeType = 'actionBlock'
        offsetX = 140
        offsetY = 120
      } else if (blockData.type === 'ConditionBlock') {
        nodeType = 'conditionBlock'
        offsetX = 50
        offsetY = 50
      }

      const position = {
        x: (event.clientX - rect.left - offsetX) / viewport.zoom - viewport.x,
        y: (event.clientY - rect.top - offsetY) / viewport.zoom - viewport.y,
      }

      this.addNode(blockData, position, nodeType)
      setTimeout(() => this.forceUpdateEdges(), 50)
    },

    onConnect(connection) {
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

    addNode(block, position, nodeType = 'actionBlock') {
      const nodeId = `${block.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // eslint-disable-next-line no-useless-assignment
      let nodeData = {}

      if (block.type === 'ConditionBlock') {
        nodeData = {
          nameHeader: `${block.name}_${this.getNextNodeNumber(block.name)}`,
          condition: '',
          trueActions: [],
          falseActions: [],
        }
      } else {
        nodeData = {
          nameHeader: `${block.name}_${this.getNextNodeNumber(block.name)}`,
          description: '',
          inputsList: [],
          outputsList: [],
          handleTypes: {
            top: 'target',
            right: 'source',
            bottom: 'source',
            left: 'target',
          },
        }
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
        (node) => node.data.nameHeader && node.data.nameHeader.startsWith(name)
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
</style>
