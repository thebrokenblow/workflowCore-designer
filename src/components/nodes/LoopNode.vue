<template>
  <div class="loop-node" :class="{ 'loop-node--selected': selected }">
    <!-- Точки соединения -->
    <div class="loop-node__handles">
      <Handle
        type="source"
        :position="Position.Top"
        id="top-handle"
        class="loop-node__handle loop-node__handle--top"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Left"
        id="left-handle"
        class="loop-node__handle loop-node__handle--left"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="right-handle"
        class="loop-node__handle loop-node__handle--right"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Bottom"
        id="bottom-handle"
        class="loop-node__handle loop-node__handle--bottom"
        :is-connectable="true"
      />
    </div>

    <!-- Шестиугольник для цикла -->
    <div class="loop-node__hexagon">
      <!-- Поле для ввода условия с возможностью редактирования -->
      <div class="loop-node__condition">
        <input
          ref="editingCondition"
          v-if="isEditingCondition"
          v-model="condition"
          type="text"
          placeholder="Условие цикла"
          class="loop-node__condition-input loop-node__condition-input--editing"
        />
        <div v-else class="loop-node__condition-display" @dblclick.stop="enableConditionEditing">
          <span class="loop-node__condition-text">
            {{ condition || 'Условие цикла' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Подпись снизу -->
    <div class="loop-node__label">
      <span>Loop</span>
    </div>

    <!-- Кнопка удаления -->
    <button class="loop-node__delete-btn" title="Удалить блок" @click.stop="deleteNode">
      &#x1F5D1;
    </button>
  </div>
</template>

<script>
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'LoopNode',

  components: { Handle },

  props: {
    id: { type: String, required: true },
    data: {
      type: Object,
      default: () => ({}),
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ['confirmDeleteNode', 'conditionChange'],

  data() {
    return {
      nameNode: '"Блок Цикл"',
      Position: Position,
      condition: this.data.condition || '',
      isEditingCondition: false,
    }
  },

  mounted() {
    const editingNameHeader = useTemplateRef('editingCondition')
    onClickOutside(editingNameHeader, () => {
      if (this.isEditingCondition) {
        this.$emit('conditionChange', this.id, this.condition)
        this.isEditingCondition = false
      }
    })
  },

  methods: {
    deleteNode() {
      this.$emit('confirmDeleteNode', this.id, this.nameNode)
    },

    enableConditionEditing() {
      this.isEditingCondition = true
    },
  },
}
</script>

<style scoped>
.loop-node {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Выделение блока - увеличенный отступ */
.loop-node--selected {
  outline: 3px solid #ff9800;
  outline-offset: 12px;
  border-radius: 12px;
}

.loop-node:hover {
  transform: translateY(-2px);
}

/* Шестиугольник */
.loop-node__hexagon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  padding: 12px;
}

.loop-node:hover .loop-node__hexagon {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

/* Поле для условия */
.loop-node__condition {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Режим отображения (span) */
.loop-node__condition-display {
  cursor: text;
  width: 100%;
  text-align: center;
}

.loop-node__condition-text {
  display: inline-block;
  color: white;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  padding: 6px 8px;
  border-radius: 6px;
  min-width: 80px;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loop-node__condition-text:hover {
  cursor: pointer;
}

/* Режим редактирования (input) */
.loop-node__condition-input {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 6px;
  color: #2e7d32;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  padding: 6px 8px;
  outline: none;
  transition: all 0.2s ease;
  cursor: text;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.loop-node__condition-input--editing {
  background: white;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
  transform: scale(1.02);
}

.loop-node__condition-input:focus {
  background: white;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
  transform: scale(1.02);
}

.loop-node__condition-input::placeholder {
  color: #a5d6a7;
  font-weight: 500;
  font-size: 10px;
}

/* Точки соединения - исправленное позиционирование */
.loop-node__handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.loop-node__handle {
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

.loop-node__handle:hover {
  transform: scale(1.5) !important;
  background: #4caf50 !important;
  border-color: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
}

/* Верхняя точка */
.loop-node__handle--top {
  top: -20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.loop-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

/* Левая точка */
.loop-node__handle--left {
  left: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.loop-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

/* Правая точка */
.loop-node__handle--right {
  right: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.loop-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

/* Нижняя точка */
.loop-node__handle--bottom {
  bottom: -20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.loop-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

/* Подпись снизу - опущена ниже */
.loop-node__label {
  position: absolute;
  bottom: -40px;
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

.loop-node:hover .loop-node__label {
  color: #2e7d32;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Кнопка удаления - как в action-node */
.loop-node__delete-btn {
  position: absolute;
  top: -30px;
  right: -30px;
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
  opacity: 0;
  z-index: 30;
}

.loop-node:hover .loop-node__delete-btn {
  opacity: 1;
}

.loop-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}
</style>
