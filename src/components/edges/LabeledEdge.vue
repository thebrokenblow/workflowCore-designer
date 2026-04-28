<script setup>
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@vue-flow/core'
import { computed, ref } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  sourceX: { type: Number, required: true },
  sourceY: { type: Number, required: true },
  targetX: { type: Number, required: true },
  targetY: { type: Number, required: true },
  sourcePosition: { type: String, required: true },
  targetPosition: { type: String, required: true },
  markerEnd: { type: String, required: false },
  style: { type: Object, required: false, default: () => ({ stroke: '#4caf50', strokeWidth: 2 }) },
  data: { type: Object, required: false },
})

const editingInput = useTemplateRef('editingInput')
onClickOutside(editingInput, () => {
  if (isEditing.value) {
    disableEditing()
    emit('inputValueChange', props.id, inputValue.value)
  }
})

const emit = defineEmits(['inputValueChange'])

const inputValue = ref(props.data.inputValue || '')
const isEditing = ref(false)

const path = computed(() =>
  getSmoothStepPath({
    ...props,
    borderRadius: 0,
  })
)

const edgeStyle = {
  stroke: '#4caf50',
  strokeWidth: 2,
}

const enableEditing = () => {
  isEditing.value = true
}

const disableEditing = () => {
  isEditing.value = false
}

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <BaseEdge :id="id" :style="edgeStyle" :path="path[0]" :marker-end="markerEnd" />

  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
        background: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        zIndex: 10,
        whiteSpace: 'nowrap',
      }"
      class="nodrag nopan"
    >
      <input
        v-if="isEditing"
        ref="editingInput"
        v-model="inputValue"
        type="text"
        placeholder="Введите текст..."
        class="edge-label-input"
        @keyup.enter="disableEditing"
        @click.stop
      />

      <div v-else class="edge-label-display" @dblclick.stop="enableEditing">
        <span class="edge-label-text" :title="inputValue || 'Введите текст...'">
          {{ inputValue || 'Введите текст...' }}
        </span>
      </div>
    </div>
  </EdgeLabelRenderer>
</template>

<style scoped>
.edge-label-display,
.edge-label-text,
.edge-label-input {
  font-family: 'Segoe UI', sans-serif;
}

.edge-label-display {
  cursor: pointer;
}

.edge-label-text {
  display: inline-block;
  color: #4caf50;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  letter-spacing: 0.3px;
}

.edge-label-input {
  background: white;
  border: 2px solid #4caf50;
  border-radius: 4px;
  color: #4caf50;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  padding: 4px 8px;
  outline: none;
  width: 100%;
  min-width: 150px;
  box-sizing: border-box;
}

.edge-label-input:focus {
  border-color: #4caf50;
}

.edge-label-input::placeholder {
  color: #a5d6a7;
  font-weight: 500;
  font-size: 12px;
}
</style>
