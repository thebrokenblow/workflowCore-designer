<template>
  <div class="workflow-editor">
    <MenuBlocks />
    <div class="graph-container">
      <ToolBar @clear="handleClear" @save="handleSave" @load="handleLoad" />
      <CanvasComponent
        ref="canvasRef"
        :initial-nodes="initialNodes"
        :initial-edges="initialEdges"
        @update:nodes="handleNodesUpdate"
        @update:edges="handleEdgesUpdate"
      />
    </div>
  </div>
</template>

<script>
import CanvasComponent from './components/canvas/CanvasComponent.vue'
import ToolBar from './components/toolbar/ToolBar.vue'
import MenuBlocks from './components/toolbox/MenuBlocks.vue'

export default {
  name: 'App',

  components: {
    CanvasComponent,
    ToolBar,
    MenuBlocks,
  },

  data() {
    return {
      initialNodes: [
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
      initialEdges: [
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
      currentNodes: [],
      currentEdges: [],
    }
  },

  methods: {
    handleNodesUpdate(nodes) {
      this.currentNodes = nodes
      console.log('Nodes updated:', nodes)
    },

    handleEdgesUpdate(edges) {
      this.currentEdges = edges
      console.log('Edges updated:', edges)
    },

    handleClear() {
      if (confirm('Очистить весь холст? Все несохраненные данные будут потеряны.')) {
        this.$refs.canvasRef.clearCanvas()
      }
    },

    handleSave() {
      const nodes = this.$refs.canvasRef.getNodes()
      const edges = this.$refs.canvasRef.getEdges()

      const workflowData = {
        nodes: nodes,
        edges: edges,
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem('workflowData', JSON.stringify(workflowData))
      alert('Рабочий процесс сохранен!')
      console.log('Saved workflow:', workflowData)
    },

    handleLoad() {
      const savedData = localStorage.getItem('workflowData')
      if (savedData) {
        const workflowData = JSON.parse(savedData)
        this.$refs.canvasRef.loadWorkflow(workflowData.nodes, workflowData.edges)
        alert('Рабочий процесс загружен!')
      } else {
        alert('Нет сохраненных данных')
      }
    },
  },
}
</script>

<style scoped>
.workflow-editor {
  display: flex;
  height: 100%;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  box-sizing: border-box;
}

.graph-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

@media (max-width: 768px) {
  .workflow-editor {
    flex-direction: column;
    padding: 10px;
  }
}
</style>

<style>
/* Глобальные стили для устранения скролла */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  overflow: hidden;
}
</style>
