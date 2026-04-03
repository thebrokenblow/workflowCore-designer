<template>
  <div class="action-block">
    <div class="action-block__header">
      <input
        v-if="isEditingNameHeader"
        ref="headerInput"
        v-model="nameHeader"
        type="text"
        class="action-block__header-input"
        @keyup.enter="disableHeaderEditing"
      />
      <strong v-else class="action-block__header-text" @dblclick.stop="enableHeaderEditing">
        {{ nameHeader || 'Двойной клик для названия шага' }}
        <span class="action-block__header-icon">✎</span>
      </strong>
    </div>

    <div class="action-block__description">
      <textarea
        v-if="isEditingDescription"
        ref="descriptionInput"
        v-model="description"
        class="action-block__description-input"
      ></textarea>
      <div v-else class="action-block__description-text" @dblclick.stop="enableDescriptionEditing">
        {{ description || 'Двойной клик для редактирования описания' }}
        <span class="action-block__description-icon">✎</span>
      </div>
    </div>

    <div class="action-block__io-section">
      <div class="action-block__inputs">
        <div class="action-block__section-header">
          <div class="action-block__section-title">📥 Inputs:</div>
          <button
            class="action-block__add-btn"
            title="Добавить входной параметр"
            @click.stop="addInput"
          >
            +
          </button>
        </div>

        <div v-for="(item, index) in inputsList" :key="item.id" class="action-block__input-row">
          <input type="text" class="action-block__input-key" placeholder="ключ" :value="item.key" />
          <span class="action-block__input-separator">:</span>
          <input
            type="text"
            class="action-block__input-value"
            placeholder="значение"
            :value="item.value"
          />
          <button
            class="action-block__delete-btn"
            title="Удалить параметр"
            @click.stop="deleteInput(index)"
          >
            ×
          </button>
        </div>

        <div v-if="inputsList.length === 0" class="action-block__empty-message">
          Нет входных параметров
        </div>
      </div>

      <div class="action-block__outputs">
        <div class="action-block__section-header">
          <div class="action-block__section-title">📤 Outputs:</div>
          <button
            class="action-block__add-btn"
            title="Добавить выходной параметр"
            @click.stop="addOutput"
          >
            +
          </button>
        </div>

        <div v-for="(item, index) in outputsList" :key="item.id" class="action-block__output-row">
          <input
            type="text"
            class="action-block__output-key"
            placeholder="ключ"
            :value="item.key"
          />
          <span class="action-block__output-separator">:</span>
          <input
            type="text"
            class="action-block__output-value"
            placeholder="значение"
            :value="item.value"
          />
          <button
            class="action-block__delete-btn"
            title="Удалить параметр"
            @click.stop="deleteOutput(index)"
          >
            ×
          </button>
        </div>

        <div v-if="outputsList.length === 0" class="action-block__empty-message">
          Нет выходных параметров
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onClickOutside } from '@vueuse/core'

export default {
  name: 'ActionBlock',

  data() {
    return {
      nameHeader: '',
      description: '',
      isEditingNameHeader: false,
      isEditingDescription: false,
      inputsList: [],
      outputsList: [],
      stopClickOutside: null,
      nextInputId: 1,
      nextOutputId: 1,
    }
  },

  watch: {
    isEditingNameHeader(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$refs.headerInput) {
            if (this.stopClickOutside) {
              this.stopClickOutside()
            }
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
            if (this.stopClickOutside) {
              this.stopClickOutside()
            }
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
  },

  methods: {
    enableHeaderEditing() {
      this.isEditingNameHeader = true
    },

    disableHeaderEditing() {
      this.isEditingNameHeader = false
    },

    enableDescriptionEditing() {
      this.isEditingDescription = true
    },

    disableDescriptionEditing() {
      this.isEditingDescription = false
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
.action-block {
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  min-width: 350px;
  max-width: 100%;
  overflow-x: auto;
  padding: 10px;
  position: relative;
}

.action-block__header {
  background-color: #4caf50;
  border-radius: 6px 6px 0 0;
  color: white;
  margin: -10px -10px 10px -10px;
  overflow: hidden;
  padding: 8px;
  position: relative;
  text-align: center;
}

.action-block__header-input {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #fff;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  outline: none;
  padding: 4px 8px;
  text-align: center;
  transition: all 0.2s;
  width: 90%;
}

.action-block__header-input:focus {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  outline: none;
}

.action-block__header-text {
  cursor: pointer;
  display: block;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  padding: 4px 24px 4px 8px;
  position: relative;
  word-break: break-word;
  word-wrap: break-word;
}

.action-block__header-text:hover .action-block__header-icon {
  opacity: 1;
}

.action-block__header-icon {
  display: inline-block;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.2s;
}

.action-block__description {
  color: #666;
  font-size: 11px;
  font-style: italic;
  margin-bottom: 10px;
  min-height: 32px;
  overflow: hidden;
}

.action-block__description-input {
  border: 1px solid #4caf50;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 11px;
  font-style: italic;
  min-height: 20px;
  outline: none;
  padding: 4px;
  resize: vertical;
  width: 100%;
}

.action-block__description-input:focus {
  border-color: #45a049;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  outline: none;
}

.action-block__description-text {
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  line-height: 1.4;
  max-width: 100%;
  overflow-wrap: break-word;
  padding: 4px 24px 4px 4px;
  position: relative;
  word-break: break-word;
  word-wrap: break-word;
}

.action-block__description-text:hover .action-block__description-icon {
  opacity: 1;
}

.action-block__description-icon {
  font-size: 10px;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 8px;
  top: 4px;
  transition: opacity 0.2s;
}

.action-block__io-section {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.action-block__inputs {
  background: #f9f9f9;
  border-radius: 4px;
  flex: 1;
  padding: 8px;
}

.action-block__input-row {
  align-items: center;
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.action-block__input-key {
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  padding: 4px;
}

.action-block__input-key:focus {
  border-color: #4caf50;
  outline: none;
}

.action-block__input-separator {
  color: #666;
}

.action-block__input-value {
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  padding: 4px;
}

.action-block__input-value:focus {
  border-color: #4caf50;
  outline: none;
}

.action-block__outputs {
  background: #f9f9f9;
  border-radius: 4px;
  flex: 1;
  padding: 8px;
}

.action-block__output-row {
  align-items: center;
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.action-block__output-key {
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  padding: 4px;
}

.action-block__output-key:focus {
  border-color: #2196f3;
  outline: none;
}

.action-block__output-separator {
  color: #666;
}

.action-block__output-value {
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  padding: 4px;
}

.action-block__output-value:focus {
  border-color: #2196f3;
  outline: none;
}

.action-block__section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.action-block__section-title {
  color: #333;
  font-size: 12px;
  font-weight: bold;
}

.action-block__add-btn {
  align-items: center;
  background-color: #4caf50;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 20px;
  justify-content: center;
  line-height: 1;
  width: 20px;
}

.action-block__add-btn:hover {
  background-color: #45a049;
  transform: scale(1.1);
}

.action-block__delete-btn {
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  padding: 0 4px;
}

.action-block__delete-btn:hover {
  color: #d32f2f;
  transform: scale(1.1);
}

.action-block__empty-message {
  color: #999;
  font-style: italic;
  padding: 8px;
  text-align: center;
}
</style>
