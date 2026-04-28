<template>
  <div class="workflow-editor">
    <MenuBlocks class="workflow-editor__menu-blocks" />
    <div class="workflow-editor__graph-container">
      <ToolBar @save-scheme="saveScheme" class="workflow-editor__toolbar" />
      <FlowCanvas ref="flowCanvas" class="workflow-editor__canvas" />
    </div>
  </div>
</template>

<script>
import FlowCanvas from './components/layout/FlowCanvas.vue'
import ToolBar from './components/layout/ToolBar.vue'
import MenuBlocks from './components/layout/SideBar.vue'

export default {
  name: 'App',

  components: {
    FlowCanvas,
    ToolBar,
    MenuBlocks,
  },

  mounted() {
    window.addEventListener('beforeunload', this.saveBeforeUnload)
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.saveBeforeUnload)
  },

  methods: {
    saveBeforeUnload() {
      const workflowData = this.$refs.flowCanvas.getWorkflowData()
      localStorage.setItem('workflowScheme', JSON.stringify(workflowData))
    },
    saveScheme() {
      const workflowData = this.$refs.flowCanvas.getWorkflowData()
      console.log(workflowData.nodes)
      console.log(workflowData.edges)
    },
  },
}
</script>

<style scoped>
/* Блок */
.workflow-editor {
  display: flex;
  height: 100%;
  gap: 10px;
  padding: 10px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  box-sizing: border-box;
}

/* Элемент: панель с блоками (MenuBlocks) */
.workflow-editor__menu-blocks {
  flex-shrink: 0;
}

/* Элемент: контейнер для графа */
.workflow-editor__graph-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}

/* Элемент: тулбар */
.workflow-editor__toolbar {
  flex-shrink: 0;
}

/* Элемент: канвас */
.workflow-editor__canvas {
  flex: 1;
  min-height: 0;
  position: relative;
}

/* Глубокие стили для VueFlow */
.workflow-editor__canvas :deep(.vue-flow) {
  width: 100%;
  height: 100%;
}

/* Адаптивность */
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
