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

    <!-- Кнопки управления (появляются при наведении) -->
    <div class="condition-node__controls">
      <button class="condition-node__edit-btn" title="Редактировать" @click.stop="openEditor">
        ✎
      </button>
      <button class="condition-node__delete-btn" title="Удалить блок" @click.stop="confirmDelete">
        🗑
      </button>
    </div>

    <!-- Модальное окно для редактирования -->
    <div v-if="showEditor" class="condition-node__modal" @click.stop>
      <div class="condition-node__modal-content">
        <div class="condition-node__modal-header">
          <h3>Редактирование условия</h3>
          <button class="condition-node__modal-close" @click="closeEditor">×</button>
        </div>

        <div class="condition-node__modal-body">
          <div class="condition-node__modal-field">
            <label>Название:</label>
            <input type="text" v-model="nameHeader" placeholder="Название блока" />
          </div>

          <div class="condition-node__modal-field">
            <label>Условие:</label>
            <textarea v-model="condition" placeholder="Например: value > 10" rows="3"></textarea>
          </div>

          <div class="condition-node__modal-field">
            <label>TRUE (зеленая ветка):</label>
            <div class="condition-node__actions-editor">
              <div
                v-for="(action, index) in trueActions"
                :key="action.id"
                class="condition-node__action-edit-row"
              >
                <input type="text" v-model="action.value" placeholder="действие" />
                <button @click="deleteTrueAction(index)">×</button>
              </div>
              <button class="condition-node__add-action-btn" @click="addTrueAction">
                + Добавить действие
              </button>
            </div>
          </div>

          <div class="condition-node__modal-field">
            <label>FALSE (красная ветка):</label>
            <div class="condition-node__actions-editor">
              <div
                v-for="(action, index) in falseActions"
                :key="action.id"
                class="condition-node__action-edit-row"
              >
                <input type="text" v-model="action.value" placeholder="действие" />
                <button @click="deleteFalseAction(index)">×</button>
              </div>
              <button class="condition-node__add-action-btn" @click="addFalseAction">
                + Добавить действие
              </button>
            </div>
          </div>
        </div>

        <div class="condition-node__modal-footer">
          <button
            class="condition-node__modal-btn condition-node__modal-btn--cancel"
            @click="closeEditor"
          >
            Отмена
          </button>
          <button
            class="condition-node__modal-btn condition-node__modal-btn--save"
            @click="saveEditor"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'

export default {
  name: 'ConditionBlock',

  components: { Handle },

  props: {
    data: { type: Object, required: true },
    id: { type: String, required: true },
  },

  emits: ['delete', 'update-dimensions'],

  data() {
    return {
      nameHeader: this.data?.nameHeader || 'Условие',
      condition: this.data?.condition || '',
      trueActions: this.data?.trueActions || [],
      falseActions: this.data?.falseActions || [],
      showEditor: false,
      nextTrueActionId: this.data?.trueActions?.length + 1 || 1,
      nextFalseActionId: this.data?.falseActions?.length + 1 || 1,
      Position: Position,
    }
  },

  watch: {
    nameHeader(newVal) {
      this.updateData({ nameHeader: newVal })
      this.emitUpdateDimensions()
    },
    condition(newVal) {
      this.updateData({ condition: newVal })
      this.emitUpdateDimensions()
    },
    trueActions: {
      handler(newVal) {
        this.updateData({ trueActions: newVal })
        this.emitUpdateDimensions()
      },
      deep: true,
    },
    falseActions: {
      handler(newVal) {
        this.updateData({ falseActions: newVal })
        this.emitUpdateDimensions()
      },
      deep: true,
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.emitUpdateDimensions()
    })
  },

  methods: {
    updateData(updates) {
      if (this.data && typeof this.data === 'object') {
        // eslint-disable-next-line vue/no-mutating-props
        Object.assign(this.data, updates)
      }
    },

    emitUpdateDimensions() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('update-dimensions', this.id)
        }, 10)
      })
    },

    openEditor() {
      this.showEditor = true
    },

    closeEditor() {
      this.showEditor = false
    },

    saveEditor() {
      this.closeEditor()
      this.emitUpdateDimensions()
    },

    confirmDelete() {
      if (confirm(`Удалить блок условия "${this.nameHeader}"?`)) {
        this.$emit('delete', this.id)
      }
    },

    addTrueAction() {
      this.trueActions.push({
        id: this.nextTrueActionId++,
        value: '',
      })
    },

    deleteTrueAction(index) {
      this.trueActions.splice(index, 1)
    },

    addFalseAction() {
      this.falseActions.push({
        id: this.nextFalseActionId++,
        value: '',
      })
    },

    deleteFalseAction(index) {
      this.falseActions.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.condition-node {
  position: relative;
  width: 120px;
  height: 120px;
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
  width: 100px;
  height: 100px;
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

/* Кнопки управления */
.condition-node__controls {
  position: absolute;
  top: -35px;
  right: -35px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 30;
}

.condition-node:hover .condition-node__controls {
  opacity: 1;
}

.condition-node__edit-btn,
.condition-node__delete-btn {
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
}

.condition-node__edit-btn:hover {
  background: #4caf50;
  transform: scale(1.1);
}

.condition-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}

/* Модальное окно */
.condition-node__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.condition-node__modal-content {
  background: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.condition-node__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.condition-node__modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.condition-node__modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.condition-node__modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.condition-node__modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.condition-node__modal-field {
  margin-bottom: 20px;
}

.condition-node__modal-field label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.condition-node__modal-field input,
.condition-node__modal-field textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.condition-node__modal-field input:focus,
.condition-node__modal-field textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.condition-node__actions-editor {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  background: #f9f9f9;
}

.condition-node__action-edit-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.condition-node__action-edit-row input {
  flex: 1;
  padding: 6px 10px;
  font-size: 13px;
}

.condition-node__action-edit-row button {
  width: 28px;
  height: 28px;
  background: #ef5350;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.condition-node__action-edit-row button:hover {
  background: #c62828;
}

.condition-node__add-action-btn {
  width: 100%;
  padding: 6px;
  background: #e8f5e9;
  border: 1px dashed #4caf50;
  border-radius: 6px;
  color: #4caf50;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.condition-node__add-action-btn:hover {
  background: #4caf50;
  color: white;
}

.condition-node__modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  background: #f5f5f5;
}

.condition-node__modal-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.condition-node__modal-btn--cancel {
  background: #e0e0e0;
  color: #333;
}

.condition-node__modal-btn--cancel:hover {
  background: #bdbdbd;
}

.condition-node__modal-btn--save {
  background: #4caf50;
  color: white;
}

.condition-node__modal-btn--save:hover {
  background: #2e7d32;
}
</style>
