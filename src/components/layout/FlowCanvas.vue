<template>
  <div class="flow-canvas">
    <VueFlow
      class="flow-canvas__container"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :edge-types="edgeTypes"
      :connection-line-options="connectionLineOptions"
      :is-valid-connection="isValidConnection"
      fit-view-on-init
      @nodes-change="onNodesChange"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @connect="onConnect"
    >
      <template #node-actionNode="node">
        <ActionNode
          v-bind="node"
          @change-name-header="changeNameHeader"
          @inputs-list-change="inputsListChange"
          @outputs-list-change="outputsListChange"
          @confirm-delete-node="confirmDeleteNode"
        />
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
        <LoopNode
          v-bind="node"
          @condition-change="conditionChange"
          @confirm-delete-node="confirmDeleteNode"
        />
      </template>

      <template #edge-custom="edge">
        <LabeledEdge v-bind="edge" @input-value-change="handleEdgeInputChange" />
      </template>

      <template #edge-base="edge">
        <BaseEdge v-bind="edge" />
      </template>

      <HelperLines :horizontal="helperLineHorizontal" :vertical="helperLineVertical" />

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
import { createDefaultEdge, createEdge } from '../../core/factories/EdgeFactory.js'

import ConfirmDeleteDialog from '../ui/flowCanvas/ConfirmDeleteDialog.vue'

import ActionNode from '../nodes/ActionNode.vue'
import ConditionNode from '../nodes/ConditionNode.vue'
import ParallelSplitNode from '../nodes/ParallelSplitNode.vue'
import SyncNode from '../nodes/SyncNode.vue'
import LoopNode from '../nodes/LoopNode.vue'

import BaseEdge from '../edges/BaseEdge.vue'
import LabeledEdge from '../edges/LabeledEdge.vue'

import HelperLines from '../ui/flowCanvas/HelperLines.vue'
import { getHelperLines } from '../../utils/helperLines.js'

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
    BaseEdge,
    LabeledEdge,
    HelperLines,
  },

  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      idDeletingNode: null,
    }
  },

  mounted() {
    const workflowSchemeJson = localStorage.getItem('workflowScheme')
    const workflowScheme = JSON.parse(workflowSchemeJson)
    this.nodes = workflowScheme.nodes
    this.edges = workflowScheme.edges

    window.addEventListener('beforeunload', this.saveBeforeUnload)
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.saveBeforeUnload)
  },

  methods: {
    isValidConnection(connection) {
      if (connection.source === connection.target) {
        return false
      }

      return true
    },
    conditionChange(id, condition) {
      const loopNode = this.nodes.find((node) => node.id === id)
      loopNode.data.condition = condition
    },

    changeNameHeader(id, nameHeader) {
      const actionNode = this.nodes.find((node) => node.id === id)
      actionNode.data.nameHeader = nameHeader
    },

    saveBeforeUnload() {
      localStorage.setItem(
        'workflowScheme',
        JSON.stringify({
          nodes: this.nodes,
          edges: this.edges,
        })
      )
    },

    getWorkflowData() {
      return {
        nodes: this.nodes,
        edges: this.edges,
      }
    },

    handleEdgeInputChange(id, inputValue) {
      const edge = this.edges.find((edge) => edge.id === id)
      edge.data.inputValue = inputValue
    },

    inputsListChange(id, inputsList) {
      const actionNode = this.nodes.find((node) => node.id === id)
      if (actionNode) {
        actionNode.data.inputsList = inputsList
      }
    },

    outputsListChange(id, outputsList) {
      const actionNode = this.nodes.find((node) => node.id === id)
      if (actionNode) {
        actionNode.data.outputsList = outputsList
      }
    },

    confirmDeleteNode(id, nameBlock) {
      this.idDeletingNode = id
      this.dialogTitle = 'Подтверждение удаления'
      this.dialogMessage = `Вы уверены, что хотите удалить ${nameBlock}?`

      this.enabledConfirmDeleteDialog()
    },

    loopNode(id, condition) {
      const loopNode = this.nodes.find((node) => node.id === id)
      if (loopNode) {
        loopNode.condition = condition
      }
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
      custom: markRaw(LabeledEdge),
    }

    const connectionLineOptions = createDefaultEdge()

    const onConnect = (connection) => {
      const newEdge = createEdge(connection)
      addEdges([newEdge])
    }

    const { applyNodeChanges } = useVueFlow()

    const helperLineHorizontal = ref(undefined)
    const helperLineVertical = ref(undefined)

    /**
     * Обновляет линии-помощники при перемещении узла
     * @param {Array} changes - массив изменений узлов
     * @param {Array} nodesList - список всех узлов
     * @returns {Array} изменённый массив с поправленными позициями
     */
    function updateHelperLines(changes, nodesList) {
      // Сбрасываем линии-помощники
      helperLineHorizontal.value = undefined
      helperLineVertical.value = undefined

      // Проверяем, что это перемещение узла с перетаскиванием
      if (
        changes.length === 1 &&
        changes[0].type === 'position' &&
        changes[0].dragging &&
        changes[0].position
      ) {
        // Получаем линии-помощники и позицию для привязки
        const helperLines = getHelperLines(changes[0], nodesList)

        // Привязываем узел к позиции линии-помощника
        if (helperLines.snapPosition.x !== undefined) {
          changes[0].position.x = helperLines.snapPosition.x
        }
        if (helperLines.snapPosition.y !== undefined) {
          changes[0].position.y = helperLines.snapPosition.y
        }

        // Устанавливаем линии для отображения
        helperLineHorizontal.value = helperLines.horizontal
        helperLineVertical.value = helperLines.vertical
      }

      return changes
    }

    /**
     * Обработчик изменения узлов
     * @param {Array} changes - массив изменений
     */
    function onNodesChange(changes) {
      const updatedChanges = updateHelperLines(changes, nodes.value)
      nodes.value = applyNodeChanges(updatedChanges)
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
      onNodesChange,
      helperLineHorizontal,
      helperLineVertical,
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
