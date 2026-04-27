<template>
  <div class="action-node">
    <!-- Точки соединения -->
    <div class="action-node__handles">
      <Handle
        type="source"
        :position="Position.Top"
        id="top-handle"
        class="action-node__handle action-node__handle--top"
      />
      <Handle
        type="source"
        :position="Position.Left"
        id="left-handle"
        class="action-node__handle action-node__handle--left"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="right-handle"
        class="action-node__handle action-node__handle--right"
      />
      <Handle
        type="source"
        :position="Position.Bottom"
        id="bottom-handle"
        class="action-node__handle action-node__handle--bottom"
      />
    </div>

    <div class="action-node__content">
      <!-- Шапка -->
      <div class="action-node__header">
        <input
          ref="editingNameHeader"
          v-if="isEditingNameHeader"
          v-model="nameHeader"
          type="text"
          class="action-node__header-input"
        />
        <div v-else class="action-node__header-title" @dblclick.stop="enableHeaderEditing">
          <span class="action-node__header-name" :title="nameHeader">
            {{ nameHeader }}
          </span>
        </div>
      </div>

      <!-- Входные параметры -->
      <div class="action-node__section">
        <div class="action-node__section-header">
          <div class="action-node__section-title">
            <span class="action-node__section-icon">&#x1F4E5;</span>
            Входные параметры
          </div>
          <button class="action-node__add-btn" @click.stop="addInput">+</button>
        </div>
        <div class="action-node__params-list">
          <div v-for="inputParam in inputsList" :key="inputParam.id" class="action-node__param-row">
            <input
              type="text"
              class="action-node__param-variable-name"
              placeholder="название переменной"
              v-model="inputParam.variableName"
            />
            <span class="action-node__param-colon">:</span>
            <input
              type="text"
              class="action-node__param-value"
              placeholder="значение"
              v-model="inputParam.value"
            />
            <button class="action-node__remove-param-btn" @click.stop="deleteInput(index)">
              ×
            </button>
          </div>
          <div v-if="inputsList.length === 0" class="action-node__empty-params">
            Нет входных параметров
          </div>
        </div>
      </div>

      <!-- Выходные параметры -->
      <div class="action-node__section">
        <div class="action-node__section-header">
          <div class="action-node__section-title">
            <span class="action-node__section-icon">&#x1F4E4;</span>
            Выходные параметры
          </div>
          <button class="action-node__add-btn" @click.stop="addOutput">+</button>
        </div>
        <div class="action-node__params-list">
          <div
            v-for="outputParam in outputsList"
            :key="outputParam.id"
            class="action-node__param-row"
          >
            <input
              type="text"
              class="action-node__param-variable-name"
              placeholder="название переменной"
              v-model="outputParam.variableName"
            />
            <span class="action-node__param-colon">:</span>
            <input
              type="text"
              class="action-node__param-value"
              placeholder="значение"
              v-model="outputParam.value"
            />
            <button class="action-node__remove-param-btn" @click.stop="deleteOutput(index)">
              ×
            </button>
          </div>
          <div v-if="outputsList.length === 0" class="action-node__empty-params">
            Нет выходных параметров
          </div>
        </div>
      </div>
    </div>

    <!-- Подпись снизу -->
    <div class="action-node__label">
      <span>Action</span>
    </div>

    <!-- Кнопка удаления (появляется при наведении) -->
    <button class="action-node__delete-btn" title="Удалить блок" @click.stop="deleteNode">
      &#x1F5D1;
    </button>
  </div>
</template>

<script>
import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'ActionNode',

  components: { Handle },

  props: {
    id: { type: String, required: true, default: () => '' },
  },

  emits: ['confirmDeleteNode', 'inputsListChange', 'outputsListChange'],

  data() {
    return {
      nameHeader: 'Название действия',
      nameNode: '"Блок действия"',
      isEditingNameHeader: false,
      Position: Position,
      nextInputId: 0,
      nextOutputId: 0,
      inputsList: [],
      outputsList: [],
    }
  },

  watch: {
    inputsList: {
      handler(newinputsList) {
        this.$emit('inputsListChange', this.id, newinputsList)
      },
      deep: true,
    },
    outputsList: {
      handler(newOutputsList) {
        this.$emit('outputsListChange', this.id, newOutputsList)
      },
      deep: true,
    },
  },

  mounted() {
    const editingNameHeader = useTemplateRef('editingNameHeader')
    onClickOutside(editingNameHeader, () => {
      if (this.isEditingNameHeader) {
        this.isEditingNameHeader = false
      }
    })
  },

  methods: {
    enableHeaderEditing() {
      this.isEditingNameHeader = true
    },
    deleteNode() {
      this.$emit('confirmDeleteNode', this.id, this.nameNode)
    },
    addInput() {
      this.inputsList.push({
        id: this.nextInputId++,
        variableName: '',
        value: '',
      })
    },
    deleteInput(index) {
      this.inputsList.splice(index, 1)
    },
    addOutput() {
      this.outputsList.push({
        id: this.nextOutputId++,
        variableName: '',
        value: '',
      })
    },
    deleteOutput(index) {
      this.outputsList.splice(index, 1)
    },
  },
}
</script>

<style scoped>
/* Базовый блок */
.action-node {
  position: relative;
  display: inline-block;
  min-width: 280px;
  max-width: 400px;
  width: auto;
  min-height: auto;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  border-radius: 16px;
  padding: 2px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-family: 'Segoe UI', sans-serif;
}

.action-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

/* Элементы блока */
.action-node__content {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.action-node__handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.action-node__handle {
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

.action-node__handle:hover {
  transform: scale(1.5) !important;
  background: #4caf50 !important;
  border-color: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
}

/* Модификаторы handle */
.action-node__handle--top {
  top: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.action-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.action-node__handle--right {
  right: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.action-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.action-node__handle--bottom {
  bottom: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.action-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.action-node__handle--left {
  left: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.action-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

/* Шапка */
.action-node__header {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  padding: 12px 16px;
  position: relative;
}

.action-node__header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Segoe UI', sans-serif;
  cursor: pointer;
  position: relative;
  min-width: 0;
}

.action-node__header-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.action-node__header-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
  padding: 6px 12px;
  outline: none;
  box-sizing: border-box;
}

/* Секции */
.action-node__section {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.action-node__section:last-child {
  border-bottom: none;
}

.action-node__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.action-node__section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
  color: #495057;
}

.action-node__section-icon {
  font-size: 14px;
}

/* Кнопки */
.action-node__add-btn {
  width: 22px;
  height: 22px;
  background: #e8f5e9;
  border: none;
  border-radius: 6px;
  color: #4caf50;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.action-node__add-btn:hover {
  background: #4caf50;
  color: white;
  transform: scale(1.05);
}

/* Список параметров */
.action-node__params-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Строка параметра */
.action-node__param-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  padding: 6px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.action-node__param-row:hover {
  background: #f1f3f5;
}

/* Поле ввода названия переменной */
.action-node__param-variable-name {
  flex: 1;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: 'Segoe UI', monospace;
  outline: none;
  transition: all 0.2s;
  min-width: 0;
}

.action-node__param-variable-name:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

/* Двоеточие */
.action-node__param-colon {
  color: #adb5bd;
  font-weight: 600;
  flex-shrink: 0;
}

/* Поле ввода значения */
.action-node__param-value {
  flex: 1;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: 'Segoe UI', monospace;
  outline: none;
  transition: all 0.2s;
  min-width: 0;
}

.action-node__param-value:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

/* Кнопка удаления параметра */
.action-node__remove-param-btn {
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #adb5bd;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.action-node__remove-param-btn:hover {
  background: #ef5350;
  color: white;
  transform: scale(1.1);
}

/* Пустой список параметров */
.action-node__empty-params {
  text-align: center;
  color: #adb5bd;
  font-size: 11px;
  font-style: italic;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-family: 'Segoe UI', sans-serif;
}

/* Подпись снизу */
.action-node__label {
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

.action-node:hover .action-node__label {
  color: #2e7d32;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* Кнопка удаления блока */
.action-node__delete-btn {
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
  transition: all 0.2s;
  backdrop-filter: blur(4px);
  opacity: 0;
  z-index: 30;
}

.action-node:hover .action-node__delete-btn {
  opacity: 1;
}

.action-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}
</style>
