<template>
  <div class="condition-node">
    <!-- Точки соединения -->
    <div class="condition-node__handles">
      <Handle
        type="target"
        :position="Position.Top"
        id="top-handle"
        class="condition-node__handle condition-node__handle--top"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="right-handle"
        class="condition-node__handle condition-node__handle--right"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Bottom"
        id="bottom-handle"
        class="condition-node__handle condition-node__handle--bottom"
        :is-connectable="true"
      />
      <Handle
        type="target"
        :position="Position.Left"
        id="left-handle"
        class="condition-node__handle condition-node__handle--left"
        :is-connectable="true"
      />
    </div>

    <!-- Ромб -->
    <div class="condition-node__diamond">
      <!-- Белый квадрат внутри ромба -->
      <div class="condition-node__square">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="6"
            y1="30"
            x2="30"
            y2="6"
            stroke="#4caf50"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <!-- Подпись снизу -->
    <div class="condition-node__label">
      <span>Condition</span>
    </div>

    <!-- Кнопка удаления (появляется при наведении) -->
    <button class="condition-node__delete-btn" title="Удалить блок" @click.stop="deleteNode">
      &#x1F5D1;
    </button>
  </div>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'ConditionNode',

  components: { Handle },

  props: {
    id: { type: String, required: true },
  },

  emits: ['confirmDeleteNode'],

  data() {
    return {
      nameNode: '"Блок условия"',
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
.condition-node {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.condition-node:hover {
  transform: translateY(-2px) scale(1.05);
}

/* Ромб (внешняя форма) */
.condition-node__diamond {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.condition-node:hover .condition-node__diamond {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

/* Белый квадрат внутри ромба */
.condition-node__square {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.condition-node__square svg {
  width: 36px;
  height: 36px;
}

.condition-node__handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.condition-node__handle {
  pointer-events: auto;
  position: absolute !important;
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 2px solid #4caf50 !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
  cursor: crosshair !important;
  z-index: 20 !important;
}

.condition-node__handle:hover {
  transform: scale(1.5) !important;
  background: #4caf50 !important;
  border-color: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
}

.condition-node__handle--top {
  top: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.condition-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.condition-node__handle--right {
  right: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.condition-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.condition-node__handle--bottom {
  bottom: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.condition-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.condition-node__handle--left {
  left: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.condition-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

/* Подпись снизу */
.condition-node__label {
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

.condition-node:hover .condition-node__label {
  color: #2e7d32;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Кнопка удаления */
.condition-node__delete-btn {
  position: absolute;
  top: -12px;
  right: -12px;
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
  transition: all 0.2s;
  backdrop-filter: blur(4px);
  opacity: 0;
  z-index: 30;
}

.condition-node:hover .condition-node__delete-btn {
  opacity: 1;
}

.condition-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}
</style>
