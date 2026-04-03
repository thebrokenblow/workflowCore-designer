<template>
  <div class="workflow-editor">
    <MenuBlocks />
    <!-- Основная область с графом -->
    <div class="graph-container">
      <ToolBar />

      <div class="vueflow-wrapper">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :default-viewport="{ zoom: 1, x: 0, y: 0 }"
          :min-zoom="0.5"
          :max-zoom="2"
          :nodes-draggable="true"
          @drop="onDrop"
          @dragover="onDragOver"
        >
          <template>
            <ActionBlockNode />
          </template>
        </VueFlow>
      </div>
    </div>
  </div>
</template>

<script>
import { VueFlow } from '@vue-flow/core'

import ActionBlockNode from './components/canvas/nodes/ActionBlockNode.vue'
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
  },

  data() {
    return {
      nodeTypes: {
        custom: ActionBlockNode,
      },
      nodes: [
        {
          id: 'LoadTradesFromReportStep',
          type: 'custom',
          position: { x: 250, y: 5 },
          data: {
            label: 'LoadTradesFromReportStep',
            description: 'Загрузка сделок из отчета',
            inputs: {
              FilePath: 'data.FilePath',
            },
            outputs: {
              TradesFromReport: 'step.TradesFromReport',
            },
          },
        },
        {
          id: 'LoadTradesFromServiceStep',
          type: 'custom',
          position: { x: 800, y: 400 },
          data: {
            label: 'LoadTradesFromServiceStep',
            description: 'Загрузка сделок из сервиса',
            inputs: {},
            outputs: {
              TradesFromService: 'step.TradesFromService',
            },
          },
        },
        {
          id: 'RevisionTradesStep',
          type: 'custom',
          position: { x: 800, y: 800 },
          data: {
            label: 'RevisionTradesStep',
            description: 'Ревью и проверка сделок',
            inputs: {
              TradesFromReport: 'data.TradesFromReport',
              TradesFromService: 'data.TradesFromService',
            },
            outputs: {},
          },
        },
      ],
      edges: [
        {
          id: 'e1-2',
          source: 'LoadTradesFromReportStep',
          target: 'LoadTradesFromServiceStep',
          animated: true,
          style: { stroke: '#4CAF50', strokeWidth: 2 },
          label: 'next',
          labelStyle: { fill: '#4CAF50', fontWeight: 'bold' },
        },
        {
          id: 'e2-3',
          source: 'LoadTradesFromServiceStep',
          target: 'RevisionTradesStep',
          animated: true,
          style: { stroke: '#4CAF50', strokeWidth: 2 },
          label: 'next',
          labelStyle: { fill: '#4CAF50', fontWeight: 'bold' },
        },
      ],
    }
  },

  methods: {
    // Обработчик перетаскивания над областью
    onDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },

    // Обработчик сброса блока на граф
    onDrop(event) {
      event.preventDefault()

      // Получаем данные блока из event
      const rawData = event.dataTransfer.getData('application/json')

      if (!rawData) {
        return
      }

      const blockData = JSON.parse(rawData)

      // Получаем позицию для нового узла
      const rect = event.currentTarget.getBoundingClientRect()

      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      this.addNode(blockData, position)
    },

    // Добавление нового узла
    addNode(block, position) {
      const nodeId = `${block.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newNode = {
        id: nodeId,
        type: 'custom',
        position: position,
        data: {
          ...block.defaultData,
          label: `${block.name}_${this.getNextNodeNumber(block.name)}`,
        },
      }

      this.nodes.push(newNode)
    },

    // Получение следующего номера для узла
    getNextNodeNumber(name) {
      const nodesOfType = this.nodes.filter(
        (node) => node.data.label && node.data.label.startsWith(name)
      )

      return nodesOfType.length + 1
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

/* Контейнер с графом */
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

/* Адаптивность */
@media (max-width: 768px) {
  .workflow-editor {
    flex-direction: column;
    padding: 10px;
  }
}
</style>
