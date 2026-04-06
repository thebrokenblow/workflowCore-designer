<template>
  <div class="condition-block" draggable="true">
    <div class="condition-block__info">
      <div class="condition-block__name">
        <span class="condition-block__icon">🔀</span>
        Условие
      </div>
      <div class="condition-block__description">Блок условия (ромб) - ветвление логики</div>
    </div>
    <div class="condition-block__drag-handle">⋮⋮</div>
  </div>
</template>

<script>
export default {
  name: 'ConditionBlockMenu',
}
</script>

<style scoped>
.condition-block {
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

.condition-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.1), transparent);
  transition: left 0.5s ease;
}

.condition-block:hover::before {
  left: 100%;
}

.condition-block:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.2);
  border-color: #ff9800;
  background: white;
}

.condition-block:active {
  cursor: grabbing;
}

.condition-block__info {
  flex: 1;
}

.condition-block__name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.condition-block:hover .condition-block__name {
  color: #ff9800;
}

.condition-block__icon {
  font-size: 18px;
}

.condition-block__description {
  font-size: 11px;
  color: #666;
  line-height: 1.4;
}

.condition-block__drag-handle {
  color: #999;
  font-size: 20px;
  cursor: grab;
  user-select: none;
  transition: color 0.3s ease;
}

.condition-block:hover .condition-block__drag-handle {
  color: #ff9800;
}

.condition-block__drag-handle:active {
  cursor: grabbing;
}
</style>
