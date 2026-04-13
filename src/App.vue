<template>
  <div class="workflow-editor">
    <MenuBlocks />
    <div class="graph-container">
      <ToolBar @clear="handleClear" @save="handleSave" @load="handleLoad" />
      <CanvasComponent
        ref="canvasRef"
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
