<template>
  <div class="flow-node">
    <!-- Точки соединения -->
    <div class="flow-node__handles"></div>
    <div class="flow-node__content">
      <!-- Шапка -->
      <div class="flow-node__header">
        <input
          v-if="isEditingNameHeader"
          v-model="nameHeader"
          type="text"
          class="flow-node__header-input"
        />
        <div v-else class="flow-node__header-title" @dblclick.stop="enableHeaderEditing">
          <span class="flow-node__header-name" :title="nameHeader">
            {{ nameHeader }}
          </span>
          <div class="flow-node__header-buttons">
            <button class="flow-node__delete-btn" title="Удалить блок" @click.stop="deleteNode">
              &#x1F5D1;
            </button>
          </div>
        </div>
      </div>

      <!-- Входные параметры и Выходные параметры -->
      <div class="flow-node__section">
        <div class="flow-node__section-header">
          <div class="flow-node__section-title">
            <span class="flow-node__section-icon">&#x1F4E5;</span>
            Входные параметры
          </div>
          <button class="flow-node__add-btn" @click.stop="addInput">+</button>
        </div>
      </div>

      <div class="flow-node__section">
        <div class="flow-node__section-header">
          <div class="flow-node__section-title">
            <span class="flow-node__section-icon">&#x1F4E4;</span>
            Выходные параметры
          </div>
          <button class="flow-node__add-btn" @click.stop="addOutput">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionNode',

  props: {
    id: { type: String, required: true },
  },

  emits: ['confirmDeleteNode'],

  data() {
    return {
      nameHeader: 'Название дейтсвия',
      nameNode: '"Блок действия"',
      isEditingNameHeader: false,
    }
  },
  methods: {
    enableHeaderEditing() {},
    deleteNode() {
      this.$emit('confirmDeleteNode', this.id, this.nameNode)
    },
    addInput() {},
    addOutput() {},
  },
}
</script>

<style scoped>
.flow-node {
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
  width: 100%;
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
  font-family: 'Segoe UI', sans-serif;
  cursor: pointer;
  position: relative;
  min-width: 0;
}

.flow-node__header-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.flow-node__header-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-shrink: 0;
}

.flow-node__delete-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
  transition: all 0.2s;
  backdrop-filter: blur(2px);
  flex-shrink: 0;
}

.flow-node__delete-btn:hover {
  background: #ef5350;
  color: white;
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
  font-family: 'Segoe UI', sans-serif;
  padding: 6px 12px;
  outline: none;
  box-sizing: border-box;
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
  font-family: 'Segoe UI', sans-serif;
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
  flex-shrink: 0;
}

.flow-node__add-btn:hover {
  background: #4caf50;
  color: white;
  transform: scale(1.05);
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
</style>
