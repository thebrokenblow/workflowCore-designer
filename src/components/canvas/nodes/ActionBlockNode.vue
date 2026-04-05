<template>
  <div class="flow-node">
    <!-- Точки соединения - универсальные -->
    <div class="flow-node__handles">
      <Handle
        :type="getHandleType('top')"
        :position="Position.Top"
        id="top-handle"
        class="flow-node__handle flow-node__handle--top"
        :is-connectable="true"
        :is-connectable-start="true"
        :is-connectable-end="true"
        connectable="single"
      />
      <Handle
        :type="getHandleType('right')"
        :position="Position.Right"
        id="right-handle"
        class="flow-node__handle flow-node__handle--right"
        :is-connectable="true"
        :is-connectable-start="true"
        :is-connectable-end="true"
        connectable="single"
      />
      <Handle
        :type="getHandleType('bottom')"
        :position="Position.Bottom"
        id="bottom-handle"
        class="flow-node__handle flow-node__handle--bottom"
        :is-connectable="true"
        :is-connectable-start="true"
        :is-connectable-end="true"
        connectable="single"
      />
      <Handle
        :type="getHandleType('left')"
        :position="Position.Left"
        id="left-handle"
        class="flow-node__handle flow-node__handle--left"
        :is-connectable="true"
        :is-connectable-start="true"
        :is-connectable-end="true"
        connectable="single"
      />
    </div>

    <div class="flow-node__content">
      <!-- Шапка -->
      <div class="flow-node__header">
        <input
          v-if="isEditingNameHeader"
          ref="headerInput"
          v-model="nameHeader"
          type="text"
          class="flow-node__header-input"
          @keyup.enter="disableHeaderEditing"
        />
        <div v-else class="flow-node__header-title" @dblclick.stop="enableHeaderEditing">
          <span class="flow-node__header-icon">⚡</span>
          <span>{{ nameHeader || 'Новый шаг' }}</span>
          <button class="flow-node__edit-btn">✎</button>
        </div>
      </div>

      <!-- Описание -->
      <div class="flow-node__description">
        <textarea
          v-if="isEditingDescription"
          ref="descriptionInput"
          v-model="description"
          class="flow-node__description-textarea"
          placeholder="Описание шага..."
        ></textarea>
        <div v-else class="flow-node__description-text" @dblclick.stop="enableDescriptionEditing">
          {{ description || 'Добавить описание...' }}
        </div>
      </div>

      <!-- Inputs и Outputs -->
      <div class="flow-node__section">
        <div class="flow-node__section-header">
          <div class="flow-node__section-title">
            <span class="flow-node__section-icon">📥</span>
            Входные параметры
          </div>
          <button class="flow-node__add-btn" @click.stop="addInput">+</button>
        </div>
        <div class="flow-node__params-list">
          <div v-for="(item, index) in inputsList" :key="item.id" class="flow-node__param-row">
            <input type="text" class="flow-node__param-key" placeholder="ключ" v-model="item.key" />
            <span class="flow-node__param-colon">:</span>
            <input
              type="text"
              class="flow-node__param-value"
              placeholder="значение"
              v-model="item.value"
            />
            <button class="flow-node__remove-btn" @click.stop="deleteInput(index)">×</button>
          </div>
          <div v-if="inputsList.length === 0" class="flow-node__empty-params">
            Нет входных параметров
          </div>
        </div>
      </div>

      <div class="flow-node__section">
        <div class="flow-node__section-header">
          <div class="flow-node__section-title">
            <span class="flow-node__section-icon">📤</span>
            Выходные параметры
          </div>
          <button class="flow-node__add-btn" @click.stop="addOutput">+</button>
        </div>
        <div class="flow-node__params-list">
          <div v-for="(item, index) in outputsList" :key="item.id" class="flow-node__param-row">
            <input type="text" class="flow-node__param-key" placeholder="ключ" v-model="item.key" />
            <span class="flow-node__param-colon">:</span>
            <input
              type="text"
              class="flow-node__param-value"
              placeholder="значение"
              v-model="item.value"
            />
            <button class="flow-node__remove-btn" @click.stop="deleteOutput(index)">×</button>
          </div>
          <div v-if="outputsList.length === 0" class="flow-node__empty-params">
            Нет выходных параметров
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Handle, Position } from '@vue-flow/core'
import { onClickOutside } from '@vueuse/core'

export default {
  name: 'ActionBlock',

  components: { Handle },

  props: {
    data: { type: Object, required: true },
    id: { type: String, required: true },
  },

  emits: ['delete', 'update-dimensions'],

  data() {
    return {
      nameHeader: this.data?.nameHeader || '',
      description: this.data?.description || '',
      isEditingNameHeader: false,
      isEditingDescription: false,
      inputsList: this.data?.inputsList || [],
      outputsList: this.data?.outputsList || [],
      stopClickOutside: null,
      nextInputId: this.data?.inputsList?.length + 1 || 1,
      nextOutputId: this.data?.outputsList?.length + 1 || 1,
      Position: Position,
      handleTypes: this.data?.handleTypes || {
        top: 'target',
        right: 'source',
        bottom: 'source',
        left: 'target',
      },
    }
  },

  watch: {
    isEditingNameHeader(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$refs.headerInput) {
            if (this.stopClickOutside) this.stopClickOutside()
            this.stopClickOutside = onClickOutside(this.$refs.headerInput, () => {
              this.disableHeaderEditing()
            })
          }
        })
      } else {
        if (this.stopClickOutside) {
          this.stopClickOutside()
          this.stopClickOutside = null
        }
      }
    },

    isEditingDescription(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$refs.descriptionInput) {
            if (this.stopClickOutside) this.stopClickOutside()
            this.stopClickOutside = onClickOutside(this.$refs.descriptionInput, () => {
              this.disableDescriptionEditing()
            })
          }
        })
      } else {
        if (this.stopClickOutside) {
          this.stopClickOutside()
          this.stopClickOutside = null
        }
      }
    },

    nameHeader(newVal) {
      this.updateData({ nameHeader: newVal })
      this.emitUpdateDimensions()
    },
    description(newVal) {
      this.updateData({ description: newVal })
      this.emitUpdateDimensions()
    },
    inputsList: {
      handler(newVal) {
        this.updateData({ inputsList: newVal })
        this.emitUpdateDimensions()
      },
      deep: true,
    },
    outputsList: {
      handler(newVal) {
        this.updateData({ outputsList: newVal })
        this.emitUpdateDimensions()
      },
      deep: true,
    },
    handleTypes: {
      handler(newVal) {
        this.updateData({ handleTypes: newVal })
      },
      deep: true,
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.emitUpdateDimensions()
      this.resizeObserver = new ResizeObserver(() => {
        this.emitUpdateDimensions()
      })
      const contentElement = this.$el.querySelector('.flow-node__content')
      if (contentElement) {
        this.resizeObserver.observe(contentElement)
      }
    })
  },

  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },

  methods: {
    updateData(updates) {
      if (this.data && typeof this.data === 'object') {
        // eslint-disable-next-line vue/no-mutating-props
        Object.assign(this.data, updates)
      }
    },

    emitUpdateDimensions() {
      this.$emit('update-dimensions', this.id)
    },

    getHandleType(handleName) {
      return this.handleTypes[handleName]
    },

    toggleHandleType(handleName) {
      const currentType = this.handleTypes[handleName]
      this.handleTypes[handleName] = currentType === 'source' ? 'target' : 'source'
      this.emitUpdateDimensions()
    },

    enableHeaderEditing() {
      this.isEditingNameHeader = true
    },

    disableHeaderEditing() {
      this.isEditingNameHeader = false
      this.emitUpdateDimensions()
    },

    enableDescriptionEditing() {
      this.isEditingDescription = true
    },

    disableDescriptionEditing() {
      this.isEditingDescription = false
      this.emitUpdateDimensions()
    },

    addInput() {
      this.inputsList.push({
        id: this.nextInputId++,
        key: `input${this.inputsList.length + 1}`,
        value: '',
      })
    },

    deleteInput(index) {
      this.inputsList.splice(index, 1)
    },

    addOutput() {
      this.outputsList.push({
        id: this.nextOutputId++,
        key: `output${this.outputsList.length + 1}`,
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
.flow-node {
  position: relative;
  display: inline-block;
  min-width: 280px;
  min-height: auto;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  border-radius: 16px;
  padding: 2px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.flow-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.flow-node__content {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.flow-node__handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.flow-node__handle {
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

.flow-node__handle:hover {
  transform: scale(1.5) !important;
  background: #4caf50 !important;
  border-color: white !important;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
}

.flow-node__handle--top {
  top: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.flow-node__handle--top:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.flow-node__handle--right {
  right: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.flow-node__handle--right:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.flow-node__handle--bottom {
  bottom: -7px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
}

.flow-node__handle--bottom:hover {
  transform: translateX(-50%) scale(1.5) !important;
}

.flow-node__handle--left {
  left: -7px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.flow-node__handle--left:hover {
  transform: translateY(-50%) scale(1.5) !important;
}

.flow-node__header {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  padding: 12px 16px;
  position: relative;
}

.flow-node__header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

.flow-node__header-icon {
  font-size: 18px;
}

.flow-node__header-title span:not(.flow-node__header-icon) {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flow-node__edit-btn {
  opacity: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  transition: all 0.2s;
}

.flow-node__header-title:hover .flow-node__edit-btn {
  opacity: 1;
}

.flow-node__edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.flow-node__header-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  outline: none;
}

.flow-node__description {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.flow-node__description-text {
  color: #6c757d;
  font-size: 12px;
  line-height: 1.5;
  cursor: pointer;
  transition: color 0.2s;
  min-height: 36px;
}

.flow-node__description-text:hover {
  color: #495057;
}

.flow-node__description-textarea {
  width: 100%;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  color: #495057;
  font-size: 12px;
  font-family: inherit;
  line-height: 1.5;
  padding: 8px;
  resize: vertical;
  outline: none;
  min-height: 60px;
}

.flow-node__description-textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.flow-node__section {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.flow-node__section:last-child {
  border-bottom: none;
}

.flow-node__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.flow-node__section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
}

.flow-node__section-icon {
  font-size: 14px;
}

.flow-node__add-btn {
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
}

.flow-node__add-btn:hover {
  background: #4caf50;
  color: white;
  transform: scale(1.05);
}

.flow-node__params-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flow-node__param-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  padding: 6px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.flow-node__param-row:hover {
  background: #f1f3f5;
}

.flow-node__param-key {
  flex: 1;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: monospace;
  outline: none;
  transition: all 0.2s;
}

.flow-node__param-key:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.flow-node__param-colon {
  color: #adb5bd;
  font-weight: 600;
}

.flow-node__param-value {
  flex: 1;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: monospace;
  outline: none;
  transition: all 0.2s;
}

.flow-node__param-value:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

.flow-node__remove-btn {
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
}

.flow-node__remove-btn:hover {
  background: #ef5350;
  color: white;
  transform: scale(1.1);
}

.flow-node__empty-params {
  text-align: center;
  color: #adb5bd;
  font-size: 11px;
  font-style: italic;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
