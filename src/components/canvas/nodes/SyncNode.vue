<template>
  <div class="sync-node">
    <div class="sync-node__handles">
      <Handle
        type="target"
        :position="Position.Top"
        id="top-handle"
        class="sync-node__handle sync-node__handle--top"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="right-handle"
        class="sync-node__handle sync-node__handle--right"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Bottom"
        id="bottom-handle"
        class="sync-node__handle sync-node__handle--bottom"
        :is-connectable="true"
      />
      <Handle
        type="target"
        :position="Position.Left"
        id="left-handle"
        class="sync-node__handle sync-node__handle--left"
        :is-connectable="true"
      />
    </div>

    <!-- Ромб с крестом -->
    <div class="sync-node__diamond">
      <div class="sync-node__cross">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="4"
            y1="4"
            x2="20"
            y2="20"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="20"
            y1="4"
            x2="4"
            y2="20"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="sync-node__controls">
      <button class="sync-node__edit-btn" title="Редактировать" @click.stop="openEditor">✎</button>
      <button class="sync-node__delete-btn" title="Удалить блок" @click.stop="confirmDelete">
        🗑
      </button>
    </div>

    <!-- Модальное окно для редактирования -->
    <div v-if="showEditor" class="sync-node__modal" @click.stop>
      <div class="sync-node__modal-content">
        <div class="sync-node__modal-header">
          <h3>Редактирование Sync (Синхронизация)</h3>
          <button class="sync-node__modal-close" @click="closeEditor">×</button>
        </div>

        <div class="sync-node__modal-body">
          <div class="sync-node__modal-field">
            <label>Название:</label>
            <input type="text" v-model="nameHeader" placeholder="Название блока" />
          </div>

          <div class="sync-node__modal-field">
            <label>Описание:</label>
            <textarea v-model="description" placeholder="Описание блока" rows="2"></textarea>
          </div>

          <div class="sync-node__modal-field">
            <label>Количество входящих потоков:</label>
            <input type="number" v-model.number="syncCount" min="2" max="5" />
            <small style="color: #666; display: block; margin-top: 5px">
              Блок будет ожидать завершения всех указанных потоков
            </small>
          </div>
        </div>

        <div class="sync-node__modal-footer">
          <button class="sync-node__modal-btn sync-node__modal-btn--cancel" @click="closeEditor">
            Отмена
          </button>
          <button class="sync-node__modal-btn sync-node__modal-btn--save" @click="saveEditor">
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
  name: 'SyncBlock',

  components: { Handle },

  props: {
    data: { type: Object, required: true },
    id: { type: String, required: true },
  },

  emits: ['delete', 'update-dimensions'],

  data() {
    return {
      nameHeader: this.data?.label || 'Sync',
      description: this.data?.description || '',
      syncCount: this.data?.syncCount || 3,
      showEditor: false,
      Position: Position,
    }
  },

  watch: {
    nameHeader(newVal) {
      this.updateData({ label: newVal })
      this.emitUpdateDimensions()
    },
    description(newVal) {
      this.updateData({ description: newVal })
      this.emitUpdateDimensions()
    },
    syncCount(newVal) {
      this.updateData({ syncCount: newVal })
      this.emitUpdateDimensions()
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
      if (confirm(`Удалить блок Sync "${this.nameHeader}"?`)) {
        this.$emit('delete', this.id)
      }
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
  transition: all 0.3s ease;
}

.sync-node:hover {
  transform: translateY(-2px) scale(1.02);
}

/* Ромб - ЗЕЛЁНЫЙ для синхронизации (#4caf50) */
.sync-node__diamond {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.sync-node:hover .sync-node__diamond {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  filter: brightness(1.05);
}

/* Крест внутри */
.sync-node__cross {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sync-node__cross svg {
  width: 35px;
  height: 35px;
  stroke: white;
  stroke-width: 2.5;
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
  width: 12px !important;
  height: 12px !important;
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
  top: -6px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.sync-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.sync-node__handle--right {
  right: -6px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.sync-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.sync-node__handle--bottom {
  bottom: -6px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.sync-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.sync-node__handle--left {
  left: -6px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.sync-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

/* Кнопки управления */
.sync-node__controls {
  position: absolute;
  top: -35px;
  right: -10px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 30;
}

.sync-node:hover .sync-node__controls {
  opacity: 1;
}

.sync-node__edit-btn,
.sync-node__delete-btn {
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

.sync-node__edit-btn:hover {
  background: #4caf50;
  transform: scale(1.1);
}

.sync-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}

/* Модальное окно */
.sync-node__modal {
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

.sync-node__modal-content {
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

.sync-node__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
}

.sync-node__modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.sync-node__modal-close {
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

.sync-node__modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sync-node__modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.sync-node__modal-field {
  margin-bottom: 20px;
}

.sync-node__modal-field label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.sync-node__modal-field input,
.sync-node__modal-field textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.sync-node__modal-field input:focus,
.sync-node__modal-field textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.sync-node__modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  background: #f5f5f5;
}

.sync-node__modal-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.sync-node__modal-btn--cancel {
  background: #e0e0e0;
  color: #333;
}

.sync-node__modal-btn--cancel:hover {
  background: #bdbdbd;
}

.sync-node__modal-btn--save {
  background: #4caf50;
  color: white;
}

.sync-node__modal-btn--save:hover {
  background: #388e3c;
}
</style>
