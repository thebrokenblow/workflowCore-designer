<script setup>
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@vue-flow/core'
import { computed, ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  sourcePosition: {
    type: String,
    required: true,
  },
  targetPosition: {
    type: String,
    required: true,
  },
  markerEnd: {
    type: String,
    required: false,
  },
  style: {
    type: Object,
    required: false,
    default: () => ({ stroke: '#4caf50', strokeWidth: 2 }),
  },
  data: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  selected: {
    type: Boolean,
    required: false,
    default: false,
  },
  sourceNode: {
    type: Object,
    required: false,
  },
  targetNode: {
    type: Object,
    required: false,
  },
  source: {
    type: String,
    required: false,
  },
  target: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  updatable: {
    type: Boolean,
    required: false,
  },
  animated: {
    type: Boolean,
    required: false,
  },
  label: {
    type: String,
    required: false,
  },
  labelStyle: {
    type: Object,
    required: false,
  },
  labelShowBg: {
    type: Boolean,
    required: false,
  },
  labelBgStyle: {
    type: Object,
    required: false,
  },
  labelBgPadding: {
    type: Array,
    required: false,
  },
  labelBgBorderRadius: {
    type: Number,
    required: false,
  },
  events: {
    type: Object,
    required: false,
  },
  markerStart: {
    type: String,
    required: false,
  },
  sourceHandleId: {
    type: String,
    required: false,
  },
  targetHandleId: {
    type: String,
    required: false,
  },
  interactionWidth: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits(['inputValueChange'])

const editingInput = useTemplateRef('editingInput')
const inputValue = ref(props.data.inputValue || '')
const isEditing = ref(false)

const edgeStyle = computed(() => {
  if (props.selected) {
    return {
      stroke: '#ff9800',
      strokeWidth: 2,
    }
  }
  return {
    stroke: '#4caf50',
    strokeWidth: 2,
  }
})

const dynamicMarkerEnd = computed(() => {
  if (props.selected) {
    return 'url(#arrow-orange)'
  }
  return 'url(#arrow-green)'
})

const path = computed(() =>
  getSmoothStepPath({
    ...props,
    borderRadius: 0,
  })
)

onClickOutside(editingInput, () => {
  if (isEditing.value) {
    disableEditing()
    emit('inputValueChange', props.id, inputValue.value)
  }
})

const enableEditing = () => {
  isEditing.value = true
}

const disableEditing = () => {
  isEditing.value = false
}
</script>

<template>
  <BaseEdge :id="id" :style="edgeStyle" :path="path[0]" :marker-end="dynamicMarkerEnd" />

  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
        background: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        border: props.selected ? '1px solid #ff9800' : '1px solid #e0e0e0',
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
        :class="{ 'edge-label-input--selected': props.selected }"
        @keyup.enter="disableEditing"
        @click.stop
      />

      <div v-else class="edge-label-display" @dblclick.stop="enableEditing">
        <span
          class="edge-label-text"
          :class="{ 'edge-label-text--selected': props.selected }"
          :title="inputValue || 'Введите текст...'"
        >
          {{ inputValue || 'Введите текст...' }}
        </span>
      </div>
    </div>
  </EdgeLabelRenderer>

  <!-- SVG определения маркеров -->
  <svg style="position: absolute; height: 0; width: 0">
    <defs>
      <!-- Зеленая стрелка -->
      <marker
        id="arrow-green"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#4caf50" />
      </marker>

      <!-- Оранжевая стрелка -->
      <marker
        id="arrow-orange"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff9800" />
      </marker>
    </defs>
  </svg>
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

/* Стиль для выделенного текста */
.edge-label-text--selected {
  color: #ff9800;
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

/* Стиль для выделенного инпута */
.edge-label-input--selected {
  border-color: #ff9800;
  color: #ff9800;
}

.edge-label-input:focus {
  border-color: #4caf50;
}

.edge-label-input--selected:focus {
  border-color: #ff9800;
}

.edge-label-input::placeholder {
  color: #a5d6a7;
  font-weight: 500;
  font-size: 12px;
}
</style>
