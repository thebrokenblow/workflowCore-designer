<template>
  <div class="parallel-split-node" :class="{ 'parallel-split-node--selected': selected }">
    <!-- Точки соединения -->
    <div class="parallel-split-node__handles">
      <Handle
        type="source"
        :position="Position.Top"
        id="top-handle"
        class="parallel-split-node__handle parallel-split-node__handle--top"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="right-handle"
        class="parallel-split-node__handle parallel-split-node__handle--right"
      />
      <Handle
        type="source"
        :position="Position.Bottom"
        id="bottom-handle"
        class="parallel-split-node__handle parallel-split-node__handle--bottom"
      />
      <Handle
        type="source"
        :position="Position.Left"
        id="left-handle"
        class="parallel-split-node__handle parallel-split-node__handle--left"
      />
    </div>

    <!-- Ромб с плюсом -->
    <div class="parallel-split-node__diamond">
      <div class="parallel-split-node__plus">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
    </div>

    <!-- Подпись снизу -->
    <div class="parallel-split-node__label">
      <span>Parallel</span>
    </div>

    <!-- Кнопка удаления (появляется при наведении) -->
    <button
      v-show="!dragging"
      class="parallel-split-node__delete-btn"
      title="Удалить блок"
      @click.stop="deleteNode"
    >
      &#x1F5D1;
    </button>
  </div>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'ParallelSplitBlock',

  components: { Handle },

  props: {
    id: {
      type: String,
      required: true,
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
    dragging: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ['confirmDeleteNode'],

  data() {
    return {
      nameNode: '"Блок Параллельное разделение"',
      Position: Position,
    }
  },

  methods: {
    deleteNode() {
      this.$emit('confirmDeleteNode', this.id, this.nameNode)
    },
  },
}
</script>

<style scoped>
/* Базовый блок */
.parallel-split-node {
  position: relative;
  width: 100px;
  height: 100px;
  display: inline-block;
  background: transparent;
  font-family: 'Segoe UI', sans-serif;
}

/* Выделение блока */
.parallel-split-node--selected {
  outline: 3px solid #ff9800;
  border-radius: 12px;
}

/* Трансформация при наведении */
.parallel-split-node:hover {
  transform: translateY(-2px);
}

/* Ромб (внешняя форма) */
.parallel-split-node__diamond {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.parallel-split-node:hover .parallel-split-node__diamond {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

/* Плюс внутри ромба */
.parallel-split-node__plus {
  display: flex;
  align-items: center;
  justify-content: center;
}

.parallel-split-node__plus svg {
  width: 35px;
  height: 35px;
  stroke: white;
  stroke-width: 2.5;
}

/* Хендлы (точки соединения) */
.parallel-split-node__handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.parallel-split-node__handle {
  pointer-events: auto;
  position: absolute !important;
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 2px solid #4caf50 !important;
  border-radius: 50% !important;
  cursor: crosshair !important;
  transition: all 0.2s ease !important;
  z-index: 20 !important;
}

.parallel-split-node__handle:hover {
  transform: scale(1.5) !important;
  background: #4caf50 !important;
  border-color: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
}

.parallel-split-node__handle--top {
  top: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.parallel-split-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.parallel-split-node__handle--right {
  right: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.parallel-split-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.parallel-split-node__handle--bottom {
  bottom: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.parallel-split-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.parallel-split-node__handle--left {
  left: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.parallel-split-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

/* Подпись снизу */
.parallel-split-node__label {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
  color: #4caf50;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 12px;
  backdrop-filter: blur(2px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 25;
}

.parallel-split-node:hover .parallel-split-node__label {
  color: #2e7d32;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Кнопка удаления блока */
.parallel-split-node__delete-btn {
  position: absolute;
  top: -20px;
  right: -20px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  opacity: 0;
  z-index: 30;
}

.parallel-split-node:hover .parallel-split-node__delete-btn {
  opacity: 1;
}

.parallel-split-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}
</style>
