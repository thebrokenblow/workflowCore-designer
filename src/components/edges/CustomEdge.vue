<script setup>
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
    default: () => ({
      stroke: '#4caf50',
      strokeWidth: 2,
    }),
  },
  data: {
    type: Object,
    required: false,
  },
})

const inputValue = ref('')
const path = computed(() =>
  getSmoothStepPath({
    ...props,
    borderRadius: 0,
  })
)

const edgeStyle = computed(() => ({
  stroke: '#4caf50',
  strokeWidth: 2,
}))
</script>

<script>
export default {
  inheritAttrs: false,
}
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
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #ddd',
        zIndex: 10,
      }"
      class="nodrag nopan"
    >
      <input
        v-model="inputValue"
        type="text"
        placeholder="Введите текст..."
        :style="{
          border: '1px solid #ccc',
          borderRadius: '3px',
          padding: '4px 8px',
          fontSize: '12px',
          width: '150px',
          outline: 'none',
        }"
      />
    </div>
  </EdgeLabelRenderer>
</template>
