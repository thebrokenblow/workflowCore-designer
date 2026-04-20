<template>
  <button class="save-json-button">
    <span class="save-json-button__text">Сохранить Workflow JSON</span>
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
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  min-width: fit-content;
  max-width: 100%;
}

/* Элемент: текст кнопки */
.save-json-button__text {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* Модификатор: полная ширина */
.save-json-button--full-width {
  width: 100%;
  justify-content: center;
}

.save-json-button--full-width .save-json-button__text {
  white-space: nowrap;
}

/* Модификатор: маленький размер */
.save-json-button--small {
  padding: 8px 16px;
  font-size: 12px;
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
    padding: 10px 16px;
    font-size: 12px;
    white-space: normal;
  }

  .save-json-button__text {
    white-space: normal;
    word-break: keep-all;
  }
}

/* Для очень маленьких экранов */
@media (max-width: 480px) {
  .save-json-button {
    padding: 8px 12px;
  }

  .save-json-button__text {
    font-size: 11px;
  }
}
</style>
