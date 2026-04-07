<template>
  <div class="block-menu" draggable="true" @dragstart="onDragStart">
    <div class="block-menu__info">
      <div class="block-menu__name">
        <span v-if="icon" class="block-menu__icon">{{ icon }}</span>
        {{ name }}
      </div>
      <div class="block-menu__description">{{ description }}</div>
    </div>
    <div class="block-menu__drag-handle">⋮⋮</div>
  </div>
</template>

<script>
export default {
  name: 'BlockMenu',

  props: {
    name: {
      type: String,
      required: true,
      default: 'Блок',
    },
    description: {
      type: String,
      required: true,
      default: 'Описание блока',
    },
    icon: {
      type: String,
      default: '',
    },
    blockData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  methods: {
    onDragStart(event) {
      event.dataTransfer.setData('application/json', JSON.stringify(this.blockData))
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.dropEffect = 'copy'
    },
  },
}
</script>

<style scoped>
/* Блок */
.block-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: move;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Эффект волны при наведении */
.block-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.1), transparent);
  transition: left 0.5s ease;
}

/* Hover эффекты */
.block-menu:hover::before {
  left: 100%;
}

.block-menu:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
  border-color: #4caf50;
  background: white;
}

/* Активное состояние (при перетаскивании) */
.block-menu:active {
  cursor: grabbing;
}

/* Элемент: info */
.block-menu__info {
  flex: 1;
}

/* Элемент: name */
.block-menu__name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  font-family:
    Segoe UI,
    sans-serif;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.block-menu:hover .block-menu__name {
  color: #4caf50;
}

/* Элемент: icon */
.block-menu__icon {
  font-size: 18px;
}

/* Элемент: description */
.block-menu__description {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
  font-family:
    Segoe UI,
    sans-serif;
}

/* Элемент: drag-handle */
.block-menu__drag-handle {
  color: #999;
  font-size: 20px;
  cursor: grab;
  user-select: none;
  transition: color 0.3s ease;
}

.block-menu:hover .block-menu__drag-handle {
  color: #4caf50;
}

.block-menu__drag-handle:active {
  cursor: grabbing;
}
</style>
