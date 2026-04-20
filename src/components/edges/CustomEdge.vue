<!-- CustomEdge.vue -->
<template>
  <!-- Рисуем линию со стрелкой -->
  <BezierEdge
    :source-x="sourceX"
    :source-y="sourceY"
    :target-x="targetX"
    :target-y="targetY"
    :source-position="sourcePosition"
    :target-position="targetPosition"
    :style="edgeStyle"
    :marker-end="markerEndUrl"
  />
  
  <!-- Добавляем текстовое поле -->
  <EdgeLabelRenderer>
    <div
      :style="{
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        position: 'absolute',
        pointerEvents: 'all'
      }"
      class="nodrag nopan custom-edge__label-container"
    >
      <input
        :value="data?.text || ''"
        @input="onInputChange"
        class="custom-edge__input"
        placeholder="Введите текст..."
      />
    </div>
  </EdgeLabelRenderer>
  
  <!-- Определяем маркер стрелки (уменьшенный) -->
  <defs>
    <marker
      id="arrow-closed"
      viewBox="0 0 10 10"
      refX="6"
      refY="5"
      markerWidth="0.5"
      markerHeight="0.5"
      orient="auto"
    >
      <path
        d="M 0 0 L 10 5 L 0 10 z"
        :fill="edgeStyle.stroke"
      />
    </marker>
  </defs>
</template>

<script setup>
import { BezierEdge, EdgeLabelRenderer, getBezierPath, useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps({
  id: String,
  source: String,
  target: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  style: Object,
  data: Object,
  markerEnd: String,
})

const { updateEdgeData } = useVueFlow()

// Стили для линии
const edgeStyle = computed(() => ({
  stroke: '#4caf50',
  strokeWidth: 2,
  ...props.style,
}))

// URL для маркера стрелки
const markerEndUrl = computed(() => 'url(#arrow-closed)')

// Вычисляем позицию для текстового поля
const labelX = computed(() => {
  const [_, x] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  })
  return x
})

const labelY = computed(() => {
  const [_, __, y] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  })
  return y
})

// Обработчик изменения текста
const onInputChange = (event) => {
  updateEdgeData(props.id, { text: event.target.value })
}
</script>

<script>
export default {
  name: 'CustomEdge',
}
</script>

<style scoped>
.custom-edge__label-container {
  background: white;
  border-radius: 4px;
  padding: 4px 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.custom-edge__input {
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  min-width: 120px;
  background: white;
  transition: all 0.2s ease;
}

.custom-edge__input:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.custom-edge__input:hover {
  border-color: #2e7d32;
}

.custom-edge__input::placeholder {
  color: #999;
  font-size: 11px;
}

/* Стили для стрелки */
:deep(marker) {
  stroke: none;
}
</style>