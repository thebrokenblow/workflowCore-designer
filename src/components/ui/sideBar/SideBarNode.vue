<template>
  <div class="block-menu" :class="blockMenuModifiers">
    <div class="block-menu__info">
      <div class="block-menu__name">
        {{ name }}
      </div>
      <div class="block-menu__description">{{ description }}</div>
    </div>
    <div class="block-menu__drag-handle">&#8942;&#8942;</div>
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
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped>
/* Блок */
.block-menu {
  --block-menu-primary: #4caf50;
  --block-menu-primary-rgb: 76, 175, 80;
  --block-menu-border: #e0e0e0;
  --block-menu-bg-start: #ffffff;
  --block-menu-bg-end: #f9f9f9;

  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, var(--block-menu-bg-start) 0%, var(--block-menu-bg-end) 100%);
  border: 2px solid var(--block-menu-border);
  border-radius: 12px;
  cursor: move;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Эффект свечения при наведении */
.block-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(var(--block-menu-primary-rgb), 0.1),
    transparent
  );
  transition: left 0.5s ease;
  pointer-events: none;
}

/* Модификаторы блока */
.block-menu--dragging {
  opacity: 0.5;
  cursor: grabbing;
  transform: scale(0.98);
}

.block-menu--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.block-menu--has-icon .block-menu__name {
  gap: 8px;
}

/* Состояния блока */
.block-menu:hover::before {
  left: 100%;
}

.block-menu:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(var(--block-menu-primary-rgb), 0.2);
  border-color: var(--block-menu-primary);
  background: white;
}

.block-menu:active {
  cursor: grabbing;
}

/* Элемент: информационный блок */
.block-menu__info {
  flex: 1;
}

/* Элемент: название блока */
.block-menu__name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  font-family: 'Segoe UI', sans-serif;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

/* Состояние элемента name при наведении на блок */
.block-menu:hover .block-menu__name {
  color: var(--block-menu-primary);
}

/* Элемент: описание */
.block-menu__description {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
  font-family: 'Segoe UI', sans-serif;
}

/* Элемент: ручка перетаскивания */
.block-menu__drag-handle {
  color: #999;
  font-size: 20px;
  cursor: grab;
  user-select: none;
  transition: color 0.3s ease;
  flex-shrink: 0;
}

/* Состояние элемента drag-handle при наведении на блок */
.block-menu:hover .block-menu__drag-handle {
  color: var(--block-menu-primary);
}

/* Состояние элемента drag-handle при активации */
.block-menu__drag-handle:active {
  cursor: grabbing;
}

.block-menu--theme-dark .block-menu__name {
  color: #e0e0e0;
}

.block-menu--theme-dark .block-menu__description {
  color: #999;
}

.block-menu--theme-dark .block-menu__drag-handle {
  color: #666;
}

/* Адаптивность */
@media (max-width: 768px) {
  .block-menu {
    padding: 12px;
    gap: 8px;
  }

  .block-menu__name {
    font-size: 14px;
  }

  .block-menu__icon {
    font-size: 16px;
  }

  .block-menu__description {
    font-size: 10px;
  }

  .block-menu__drag-handle {
    font-size: 18px;
  }
}
</style>
