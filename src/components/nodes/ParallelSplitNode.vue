<template>
  <div class="parallel-split-node">
    <div class="parallel-split-node__handles">
      <Handle
        type="target"
        :position="Position.Top"
        id="top-handle"
        class="parallel-split-node__handle parallel-split-node__handle--top"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="right-handle"
        class="parallel-split-node__handle parallel-split-node__handle--right"
        :is-connectable="true"
      />
      <Handle
        type="source"
        :position="Position.Bottom"
        id="bottom-handle"
        class="parallel-split-node__handle parallel-split-node__handle--bottom"
        :is-connectable="true"
      />
      <Handle
        type="target"
        :position="Position.Left"
        id="left-handle"
        class="parallel-split-node__handle parallel-split-node__handle--left"
        :is-connectable="true"
      />
    </div>

    <!-- Ромб с плюсом (вместо креста) -->
    <div class="parallel-split-node__diamond">
      <div class="parallel-split-node__plus">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="parallel-split-node__controls">
      <button class="parallel-split-node__edit-btn" title="Редактировать" @click.stop="openEditor">
        ✎
      </button>
      <button
        class="parallel-split-node__delete-btn"
        title="Удалить блок"
        @click.stop="confirmDelete"
      >
        🗑
      </button>
    </div>

    <!-- Модальное окно для редактирования -->
    <div v-if="showEditor" class="parallel-split-node__modal" @click.stop>
      <div class="parallel-split-node__modal-content">
        <div class="parallel-split-node__modal-header">
          <h3>Редактирование Parallel Split</h3>
          <button class="parallel-split-node__modal-close" @click="closeEditor">×</button>
        </div>

        <div class="parallel-split-node__modal-body">
          <div class="parallel-split-node__modal-field">
            <label>Название:</label>
            <input type="text" v-model="nameHeader" placeholder="Название блока" />
          </div>

          <div class="parallel-split-node__modal-field">
            <label>Описание:</label>
            <textarea v-model="description" placeholder="Описание блока" rows="2"></textarea>
          </div>

          <div class="parallel-split-node__modal-field">
            <label>Ветки параллельного выполнения:</label>
            <div class="parallel-split-node__branches-editor">
              <div
                v-for="(branch, index) in branches"
                :key="branch.id"
                class="parallel-split-node__branch-row"
              >
                <input type="text" v-model="branch.name" :placeholder="`Ветка ${index + 1}`" />
                <button @click="deleteBranch(index)" v-if="branches.length > 1">×</button>
              </div>
              <button class="parallel-split-node__add-branch-btn" @click="addBranch">
                + Добавить ветку
              </button>
            </div>
          </div>
        </div>

        <div class="parallel-split-node__modal-footer">
          <button
            class="parallel-split-node__modal-btn parallel-split-node__modal-btn--cancel"
            @click="closeEditor"
          >
            Отмена
          </button>
          <button
            class="parallel-split-node__modal-btn parallel-split-node__modal-btn--save"
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
  name: 'ParallelSplitBlock',

  components: { Handle },

  props: {
    data: { type: Object, required: true },
    id: { type: String, required: true },
  },

  emits: ['delete', 'update-dimensions'],

  data() {
    return {
      nameHeader: this.data?.label || 'Parallel Split',
      description: this.data?.description || '',
      branches: this.data?.branches || [
        { id: 1, name: 'Ветка 1' },
        { id: 2, name: 'Ветка 2' },
      ],
      showEditor: false,
      nextBranchId: this.data?.branches?.length + 1 || 3,
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
    branches: {
      handler(newVal) {
        this.updateData({ branches: newVal })
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
      if (confirm(`Удалить блок Parallel Split "${this.nameHeader}"?`)) {
        this.$emit('delete', this.id)
      }
    },

    addBranch() {
      this.branches.push({
        id: this.nextBranchId++,
        name: `Ветка ${this.branches.length + 1}`,
      })
    },

    deleteBranch(index) {
      this.branches.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.parallel-split-node {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.parallel-split-node:hover {
  transform: translateY(-2px) scale(1.02);
}

/* Ромб - зеленый */
.parallel-split-node__diamond {
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

.parallel-split-node:hover .parallel-split-node__diamond {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  filter: brightness(1.05);
}

/* Плюс внутри */
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

/* Точки соединения */
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
  width: 12px !important;
  height: 12px !important;
  background: white !important;
  border: 2px solid #4caf50 !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
  cursor: crosshair !important;
  z-index: 20 !important;
}

.parallel-split-node__handle:hover {
  transform: scale(1.5) !important;
  background: #4caf50 !important;
  border-color: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
}

.parallel-split-node__handle--top {
  top: -6px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.parallel-split-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.parallel-split-node__handle--right {
  right: -6px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.parallel-split-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.parallel-split-node__handle--bottom {
  bottom: -6px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.parallel-split-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.parallel-split-node__handle--left {
  left: -6px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.parallel-split-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.parallel-split-node__handle--branch {
  position: absolute !important;
}

/* Кнопки управления */
.parallel-split-node__controls {
  position: absolute;
  top: -35px;
  right: -10px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 30;
}

.parallel-split-node:hover .parallel-split-node__controls {
  opacity: 1;
}

.parallel-split-node__edit-btn,
.parallel-split-node__delete-btn {
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

.parallel-split-node__edit-btn:hover {
  background: #4caf50;
  transform: scale(1.1);
}

.parallel-split-node__delete-btn:hover {
  background: #ef5350;
  transform: scale(1.1);
}

/* Модальное окно */
.parallel-split-node__modal {
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

.parallel-split-node__modal-content {
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

.parallel-split-node__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
}

.parallel-split-node__modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.parallel-split-node__modal-close {
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

.parallel-split-node__modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.parallel-split-node__modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.parallel-split-node__modal-field {
  margin-bottom: 20px;
}

.parallel-split-node__modal-field label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.parallel-split-node__modal-field input,
.parallel-split-node__modal-field textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.parallel-split-node__modal-field input:focus,
.parallel-split-node__modal-field textarea:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.parallel-split-node__branches-editor {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  background: #f9f9f9;
}

.parallel-split-node__branch-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.parallel-split-node__branch-row input {
  flex: 1;
  padding: 6px 10px;
  font-size: 13px;
}

.parallel-split-node__branch-row button {
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

.parallel-split-node__branch-row button:hover {
  background: #c62828;
}

.parallel-split-node__add-branch-btn {
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

.parallel-split-node__add-branch-btn:hover {
  background: #4caf50;
  color: white;
}

.parallel-split-node__modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  background: #f5f5f5;
}

.parallel-split-node__modal-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.parallel-split-node__modal-btn--cancel {
  background: #e0e0e0;
  color: #333;
}

.parallel-split-node__modal-btn--cancel:hover {
  background: #bdbdbd;
}

.parallel-split-node__modal-btn--save {
  background: #4caf50;
  color: white;
}

.parallel-split-node__modal-btn--save:hover {
  background: #388e3c;
}
</style>