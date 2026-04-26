<template>
  <div class="flow-canvas">
    <VueFlow
      class="flow-canvas__container"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :edge-types="edgeTypes"
      :connection-line-options="connectionLineOptions"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @connect="onConnect"
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
import { ref, markRaw } from 'vue'
import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import DropzoneBackground from '../ui/flowCanvas/DropzoneBackground.vue'
import useDragAndDrop from '../../composables/useDnD.js'

import ConfirmDeleteDialog from '../ui/flowCanvas/ConfirmDeleteDialog.vue'

import ActionNode from '../nodes/ActionNode.vue'
import ConditionNode from '../nodes/ConditionNode.vue'
import ParallelSplitNode from '../nodes/ParallelSplitNode.vue'
import SyncNode from '../nodes/SyncNode.vue'
import LoopNode from '../nodes/LoopNode.vue'

import BaseEdge from '../edges/BaseEdge.vue'
import CustomEdge from '../edges/CustomEdge.vue'

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
        (edge) => edge.source !== this.idDeletingNode && edge.target !== this.idDeletingNode
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
    const { addEdges } = useVueFlow()
    const { onDragOver, onDragLeave, onDrop } = useDragAndDrop()

    const edgeTypes = {
      base: markRaw(BaseEdge),
      custom: markRaw(CustomEdge),
    }

    const connectionLineOptions = {
      type: 'step',
      style: {
        stroke: '#4caf50',
        strokeWidth: 2,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: '#4caf50',
        orient: 'auto',
      },
    }

    const onConnect = (connection) => {
      const sourceNode = connection.source.split('_')[0]

      let typeEdge = 'base'
      if (sourceNode === 'conditionNode') {
        typeEdge = 'custom'
      }

      const newEdge = {
        id: `edge_${Date.now()}_${Math.random()}`,
        ...connection,
        type: typeEdge,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: '#4caf50',
          orient: 'auto',
        },
      }

      addEdges([newEdge])
    }

    return {
      nodes,
      edges,
      edgeTypes,
      connectionLineOptions,
      onDragOver,
      onDragLeave,
      onDrop,
      onConnect,
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

@media (max-width: 768px) {
  .flow-canvas__container {
    border-radius: 0;
  }
}
</style>
