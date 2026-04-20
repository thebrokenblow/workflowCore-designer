<template>
  <div class="flow-canvas">
    <VueFlow
      class="flow-canvas__container"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :edge-types="edgeTypes"
      :connection-line-options="connectionLineOptions"
      :default-edge-options="defaultEdgeOptions"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @connect="onConnect"
      @edge-update="onEdgeUpdate"
    >
      <template #node-actionNode="node">
        <ActionNode v-bind="node" @confirm-delete-node="confirmDeleteNode" />
      </template>

      <template #node-conditionNode="node">
        <ConditionNode v-bind="node" @confirm-delete-node="confirmDeleteNode" />
      </template>

      <template #node-parallelSplitNode="node">
        <ParallelSplitNode v-bind="node" @confirm-delete-node="confirmDeleteNode" />
      </template>

      <template #node-syncNode="node">
        <SyncNode v-bind="node" @confirm-delete-node="confirmDeleteNode" />
      </template>

      <template #node-loopNode="node">
        <LoopNode v-bind="node" @confirm-delete-node="confirmDeleteNode" />
      </template>

      <DropzoneBackground class="flow-canvas__background" />
    </VueFlow>

    <ConfirmDeleteDialog
      :visible="dialogVisible"
      :title="dialogTitle"
      :message="dialogMessage"
      @confirm="deleteNode"
      @cancel="cancelDeleteNode"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import DropzoneBackground from '../ui/flowCanvas/DropzoneBackground.vue'
import useDragAndDrop from '../../composables/useDnD.js'

import ConfirmDeleteDialog from '../ui/flowCanvas/ConfirmDeleteDialog.vue'

import CustomEdge from '../edges/CustomEdge.vue'

import ActionNode from '../nodes/ActionNode.vue'
import ConditionNode from '../nodes/ConditionNode.vue'
import ParallelSplitNode from '../nodes/ParallelSplitNode.vue'
import SyncNode from '../nodes/SyncNode.vue'
import LoopNode from '../nodes/LoopNode.vue'

export default {
  name: 'FlowCanvas',
  components: {
    VueFlow,
    DropzoneBackground,
    ActionNode,
    ConditionNode,
    ParallelSplitNode,
    SyncNode,
    LoopNode,
    ConfirmDeleteDialog,
  },

  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      idDeletingNode: null,
    }
  },

  methods: {
    confirmDeleteNode(id, nameBlock) {
      this.idDeletingNode = id
      this.dialogTitle = 'Подтверждение удаления'
      this.dialogMessage = `Вы уверены, что хотите удалить ${nameBlock}?`

      this.enabledConfirmDeleteDialog()
    },

    deleteNode() {
      this.edges = this.edges.filter(
        (edge) => edge.source !== this.idDeletingNode || edge.target !== this.idDeletingNode
      )
      this.nodes = this.nodes.filter((node) => node.id !== this.idDeletingNode)

      this.closeDeleteDialog()
    },
    cancelDeleteNode() {
      this.closeDeleteDialog()
    },

    closeDeleteDialog() {
      this.disabledConfirmDeleteDialog()
      this.deletingNode = null
      this.dialogTitle = ''
      this.dialogMessage = ''
    },

    enabledConfirmDeleteDialog() {
      this.dialogVisible = true
    },
    disabledConfirmDeleteDialog() {
      this.dialogVisible = false
    },
  },

  setup() {
    const nodes = ref([])
    const edges = ref([])
    const { addEdges, updateEdge, findEdge } = useVueFlow()
    const { onDragOver, onDragLeave, onDrop } = useDragAndDrop()

    const edgeTypes = {
      custom: CustomEdge,
    }

    const connectionLineOptions = {
      style: {
        stroke: '#4caf50',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#4caf50',
        orient: 'auto',
      },
    }

    const defaultEdgeOptions = {
      type: 'custom',
      style: {
        stroke: '#4caf50',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#4caf50',
        orient: 'auto',
      },
    }

    const onConnect = (connection) => {
      const newEdge = {
        id: `edge_${Date.now()}_${Math.random()}`,
        ...connection,
        type: 'custom',
        data: {
          text: '',
        },
        style: {
          stroke: '#4caf50',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#4caf50',
          orient: 'auto',
        },
      }

      addEdges([newEdge])
    }

    const onEdgeUpdate = (oldEdge, newConnection) => {
      const existingEdge = findEdge(oldEdge.id)
      const updatedEdge = {
        ...newConnection,
        id: oldEdge.id,
        type: 'custom',
        data: existingEdge?.data || { text: '' },
        style: oldEdge.style || {
          stroke: '#4caf50',
          strokeWidth: 2,
        },
        markerEnd: oldEdge.markerEnd || {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#4caf50',
          orient: 'auto',
        },
      }
      updateEdge(oldEdge.id, updatedEdge)
    }

    return {
      nodes,
      edges,
      edgeTypes,
      connectionLineOptions,
      defaultEdgeOptions,
      onDragOver,
      onDragLeave,
      onDrop,
      onConnect,
      onEdgeUpdate,
      MarkerType,
    }
  },
}
</script>

<style scoped>
.flow-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.flow-canvas__container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.flow-canvas__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.flow-canvas__container :deep(.vue-flow__edge) {
  cursor: pointer;
  z-index: 1;
}

.flow-canvas__container :deep(.vue-flow__edge-path) {
  stroke: #4caf50;
  stroke-width: 2;
}

.flow-canvas__container :deep(.vue-flow__edge.selected .vue-flow__edge-path) {
  stroke: #4caf50;
  stroke-width: 3;
}

.flow-canvas__container :deep(.vue-flow__connection-path) {
  stroke: #4caf50 !important;
  stroke-width: 2px !important;
}

/* Дополнительные стили для стрелок */
.flow-canvas__container :deep(.vue-flow__edge-path) {
  marker-end: url(#arrow-closed);
}

/* Анимация при наведении на ребро */
.flow-canvas__container :deep(.vue-flow__edge:hover .vue-flow__edge-path) {
  stroke-width: 3;
  stroke: #2e7d32;
}

@media (max-width: 768px) {
  .flow-canvas__container {
    border-radius: 0;
  }
}
</style>

<style>
/* Глобальные стили для маркеров стрелок */
.vue-flow__edge {
  marker-end: url(#arrow-closed);
}

/* Убеждаемся, что стрелка рисуется в правильном направлении */
.vue-flow__edge-path {
  marker-end: url(#arrow-closed);
}
</style>
