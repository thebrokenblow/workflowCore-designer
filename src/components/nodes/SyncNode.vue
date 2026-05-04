<template>
  <div class="sync-node" :class="{ 'sync-node--selected': selected }">
    <div class="sync-node__handles">
      <Handle
        type="source"
        :position="Position.Top"
        id="top-handle"
        class="sync-node__handle sync-node__handle--top"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="right-handle"
        class="sync-node__handle sync-node__handle--right"
      />
      <Handle
        type="source"
        :position="Position.Bottom"
        id="bottom-handle"
        class="sync-node__handle sync-node__handle--bottom"
      />
      <Handle
        type="source"
        :position="Position.Left"
        id="left-handle"
        class="sync-node__handle sync-node__handle--left"
      />
    </div>

    <!-- Ромб с плюсом -->
    <div class="sync-node__diamond">
      <div class="sync-node__plus">
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
    <div class="sync-node__label">
      <span>Join</span>
    </div>

    <!-- Кнопка удаления -->
    <button
      v-show="!dragging"
      class="sync-node__delete-btn"
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
  name: 'SyncNode',

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
      nameNode: '"Блок Синхронизация"',
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
.sync-node {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Выделение блока - как в parallel-split-node */
.sync-node--selected {
  outline: 3px solid #ff9800;
  border-radius: 12px;
}

.sync-node:hover {
  transform: translateY(-2px);
}

/* Ромб - ЗЕЛЁНЫЙ для синхронизации (#4caf50) */
.sync-node__diamond {
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

.sync-node:hover .sync-node__diamond {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

/* Плюс внутри */
.sync-node__plus {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sync-node__plus svg {
  width: 35px;
  height: 35px;
  stroke: white;
  stroke-width: 2.5;
}

/* Элемент: label (подпись снизу) */
.sync-node__label {
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

.sync-node:hover .sync-node__label {
  color: #2e7d32;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Точки соединения */
.sync-node__handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.sync-node__handle {
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

.sync-node__handle:hover {
  transform: scale(1.5) !important;
  background: #4caf50 !important;
  border-color: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
}

.sync-node__handle--top {
  top: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.sync-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.sync-node__handle--right {
  right: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.sync-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.sync-node__handle--bottom {
  bottom: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.sync-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.sync-node__handle--left {
  left: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.sync-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

/* Кнопка удаления - как в parallel-split-node */
.sync-node__delete-btn {
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

.sync-node:hover .sync-node__delete-btn {
  opacity: 1;
}

.sync-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}
</style>
