<script setup>
import { BaseEdge, getSmoothStepPath } from '@vue-flow/core'
import { computed } from 'vue'

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
    default: () => ({}),
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
    type: [Boolean, String],
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
</script>

<template>
  <BaseEdge :id="id" :style="edgeStyle" :path="path[0]" :marker-end="dynamicMarkerEnd" />

  <svg style="position: absolute; height: 0; width: 0">
    <defs>
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
