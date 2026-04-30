<template>
  <canvas ref="canvasRef" class="vue-flow__canvas" />
</template>

<script>
import { useVueFlow } from '@vue-flow/core'
import { computed, ref, watch } from 'vue'

export default {
  name: 'HelperLines',
  props: {
    horizontal: {
      type: Number,
      default: undefined,
    },
    vertical: {
      type: Number,
      default: undefined,
    },
  },
  setup(props) {
    // Получаем данные о вьюпорте из Vue Flow
    const { viewport, dimensions } = useVueFlow()

    // Ссылка на canvas элемент
    const canvasRef = ref(null)

    // Вычисляемые свойства для удобства
    const width = computed(() => dimensions.value.width)
    const height = computed(() => dimensions.value.height)
    const x = computed(() => viewport.value.x)
    const y = computed(() => viewport.value.y)
    const zoom = computed(() => viewport.value.zoom)

    /**
     * Обновляет линии-помощники на canvas
     */
    function updateCanvasHelperLines() {
      const canvas = canvasRef.value
      const ctx = canvas?.getContext('2d')

      if (!ctx || !canvas) {
        return
      }

      // Учитываем DPI экрана для чёткости линий
      const dpi = window.devicePixelRatio
      canvas.width = width.value * dpi
      canvas.height = height.value * dpi

      // Масштабируем контекст
      ctx.scale(dpi, dpi)

      // Очищаем canvas
      ctx.clearRect(0, 0, width.value, height.value)

      // Настройки линий
      ctx.strokeStyle = '#00AF79'
      ctx.lineWidth = 2

      // Рисуем вертикальную линию
      if (typeof props.vertical === 'number') {
        ctx.beginPath()
        const lineX = props.vertical * zoom.value + x.value
        ctx.moveTo(lineX, 0)
        ctx.lineTo(lineX, height.value)
        ctx.stroke()
      }

      // Рисуем горизонтальную линию
      if (typeof props.horizontal === 'number') {
        ctx.beginPath()
        const lineY = props.horizontal * zoom.value + y.value
        ctx.moveTo(0, lineY)
        ctx.lineTo(width.value, lineY)
        ctx.stroke()
      }
    }

    // Следим за изменениями и перерисовываем canvas
    watch(
      [width, height, x, y, zoom, () => props.horizontal, () => props.vertical],
      () => updateCanvasHelperLines(),
      { immediate: true, deep: true }
    )

    return {
      canvasRef,
    }
  },
}
</script>

<style scoped>
.vue-flow__canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
}
</style>
