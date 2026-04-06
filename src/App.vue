<template>
  <div class="workflow-editor">
    <MenuBlocks />
    <div class="graph-container">
      <ToolBar />

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
  </div>
</template>

<script>
import { VueFlow } from '@vue-flow/core'

import ActionBlockNode from './components/canvas/nodes/ActionBlockNode.vue'
import ConditionBlock from './components/canvas/nodes/ConditionBlock.vue'

import ToolBar from './components/toolbar/ToolBar.vue'
import MenuBlocks from './components/toolbox/MenuBlocks.vue'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

export default {
  name: 'WorkflowEditor',

  components: {
    VueFlow,
    ToolBar,
    MenuBlocks,
    ActionBlockNode,
    ConditionBlock,
  },

  data() {
    return {
      nodeTypes: {
        actionBlock: ActionBlockNode,
        conditionBlock: ConditionBlock,
      },
      nodes: [
        {
          id: 'LoadTradesFromReportStep',
          type: 'actionBlock',
          position: { x: 250, y: 5 },
          data: {
            nameHeader: 'LoadTradesFromReportStep',
            description: 'Загрузка сделок из отчета',
            inputsList: [{ id: 1, key: 'FilePath', value: 'data.FilePath' }],
            outputsList: [{ id: 1, key: 'TradesFromReport', value: 'step.TradesFromReport' }],
            handleTypes: {
              top: 'target',
              right: 'source',
              bottom: 'source',
              left: 'target',
            },
          },
        },
        {
          id: 'LoadTradesFromServiceStep',
          type: 'actionBlock',
          position: { x: 800, y: 400 },
          data: {
            nameHeader: 'LoadTradesFromServiceStep',
            description: 'Загрузка сделок из сервиса',
            inputsList: [],
            outputsList: [{ id: 1, key: 'TradesFromService', value: 'step.TradesFromService' }],
            handleTypes: {
              top: 'target',
              right: 'source',
              bottom: 'source',
              left: 'target',
            },
          },
        },
        {
          id: 'RevisionTradesStep',
          type: 'actionBlock',
          position: { x: 800, y: 800 },
          data: {
            nameHeader: 'RevisionTradesStep',
            description: 'Ревью и проверка сделок',
            inputsList: [
              { id: 1, key: 'TradesFromReport', value: 'data.TradesFromReport' },
              { id: 2, key: 'TradesFromService', value: 'data.TradesFromService' },
            ],
            outputsList: [],
            handleTypes: {
              top: 'target',
              right: 'source',
              bottom: 'source',
              left: 'target',
            },
          },
        },
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'LoadTradesFromReportStep',
          target: 'LoadTradesFromServiceStep',
          sourceHandle: 'bottom-handle',
          targetHandle: 'top-handle',
          animated: false,
          style: { stroke: '#4CAF50', strokeWidth: 2 },
          label: 'next',
          labelStyle: { fill: '#4CAF50', fontWeight: 'bold' },
          markerEnd: { type: 'arrowclosed', color: '#4CAF50' },
        },
        {
          id: 'e2-3',
          source: 'LoadTradesFromServiceStep',
          target: 'RevisionTradesStep',
          sourceHandle: 'bottom-handle',
          targetHandle: 'top-handle',
          animated: false,
          style: { stroke: '#4CAF50', strokeWidth: 2 },
          label: 'next',
          labelStyle: { fill: '#4CAF50', fontWeight: 'bold' },
          markerEnd: { type: 'arrowclosed', color: '#4CAF50' },
        },
      ],
    }
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

      // Определяем тип узла и смещение в зависимости от блока
      let nodeType = 'actionBlock'
      let offsetX = 140 // половина ширины action блока
      let offsetY = 120 // половина высоты action блока

      if (blockData.type === 'ConditionBlock') {
        nodeType = 'conditionBlock'
        offsetX = 50 // половина ширины ромба (100/2)
        offsetY = 50 // половина высоты ромба (100/2)
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
        label: 'next',
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
  },
}
</script>

<style scoped>
.workflow-editor {
  display: flex;
  height: 100vh;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.graph-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.vueflow-wrapper {
  flex: 1;
  position: relative;
  background: #fafafa;
}

.vueflow-wrapper :deep(.vue-flow) {
  background: radial-gradient(circle, #e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
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

@media (max-width: 768px) {
  .workflow-editor {
    flex-direction: column;
    padding: 10px;
  }
}
</style>
