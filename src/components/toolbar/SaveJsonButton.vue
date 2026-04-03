<template>
  <button class="save-json-button">
    <span class="save-json-button__icon">📄</span>
    Сохранить Workflow JSON
  </button>
</template>

<script>
export default {
  name: 'SaveJsonButton',
}
</script>

<style scoped>
/* Блок SaveJsonButton */
.save-json-button {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Hover состояние кнопки */
.save-json-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

/* Активное состояние кнопки */
.save-json-button:active {
  transform: translateY(0);
}

/* Элемент: иконка кнопки */
.save-json-button__icon {
  font-size: 18px;
}

/* Модификатор: полная ширина */
.save-json-button--full-width {
  width: 100%;
  justify-content: center;
}

/* Модификатор: маленький размер */
.save-json-button--small {
  padding: 8px 16px;
  font-size: 12px;
}

.save-json-button--small .save-json-button__icon {
  font-size: 14px;
}

/* Модификатор: отключенная кнопка */
.save-json-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Медиа-запрос для мобильных устройств */
@media (max-width: 768px) {
  .save-json-button {
    padding: 8px 16px;
    font-size: 12px;
  }

  .save-json-button__icon {
    font-size: 14px;
  }
}
</style>
