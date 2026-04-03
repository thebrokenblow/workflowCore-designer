<template>
  <div class="action-block" draggable="true">
    <div class="action-block__info">
      <div class="action-block__name">Действие</div>
      <div class="action-block__description">Базовый блок действия для выполнения операций</div>
    </div>
    <div class="action-block__drag-handle">⋮⋮</div>
  </div>
</template>

<script>
export default {
  name: 'ActionBlockToolBox',
}
</script>

<style scoped>
/* Блок */
.action-block {
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
.action-block::before {
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
.action-block:hover::before {
  left: 100%;
}

.action-block:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
  border-color: #4caf50;
  background: white;
}

/* Активное состояние (при перетаскивании) */
.action-block:active {
  cursor: grabbing;
}

/* Элемент: info */
.action-block__info {
  flex: 1;
}

/* Элемент: name */
.action-block__name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  font-family:
    Segoe UI,
    sans-serif;
  transition: color 0.3s ease;
}

.action-block:hover .action-block__name {
  color: #4caf50;
}

/* Элемент: description */
.action-block__description {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
  font-family:
    Segoe UI,
    sans-serif;
}

/* Элемент: drag-handle */
.action-block__drag-handle {
  color: #999;
  font-size: 20px;
  cursor: grab;
  user-select: none;
  transition: color 0.3s ease;
}

.action-block:hover .action-block__drag-handle {
  color: #4caf50;
}

.action-block__drag-handle:active {
  cursor: grabbing;
}
</style>
