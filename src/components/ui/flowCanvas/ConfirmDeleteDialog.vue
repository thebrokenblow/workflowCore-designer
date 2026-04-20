<template>
  <div v-if="visible" class="dialog-overlay" @click.self="handleCancel">
    <div class="dialog">
      <div class="dialog__content">
        <!-- Шапка -->
        <div class="dialog__header">
          <h3 class="dialog__title">{{ title }}</h3>
          <button class="dialog__close-btn" @click="handleCancel">&times;</button>
        </div>

        <!-- Тело -->
        <div class="dialog__body">
          <div class="dialog__message">
            <p>{{ message }}</p>
          </div>
        </div>

        <!-- Футер -->
        <div class="dialog__footer">
          <button class="dialog__btn dialog__btn--secondary" @click="handleCancel">Отмена</button>
          <button class="dialog__btn dialog__btn--danger" @click="handleConfirm">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Подтверждение',
    },
    message: {
      type: String,
      default: 'Вы уверены?',
    },
  },
  emits: ['confirm', 'cancel'],
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped>
/* Блок: dialog-overlay */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: dialog-overlay_fadeIn 0.3s ease;
}

@keyframes dialog-overlay_fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

/* Блок: dialog */
.dialog {
  position: relative;
  display: inline-block;
  min-width: 320px;
  max-width: 450px;
  width: auto;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  border-radius: 16px;
  padding: 2px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
  animation: dialog_slideUp 0.3s ease;
}

@keyframes dialog_slideUp {
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Элемент: dialog__content */
.dialog__content {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Элемент: dialog__header */
.dialog__header {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* Элемент: dialog__title */
.dialog__title {
  margin: 0;
  color: white;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: 0.3px;
}

/* Элемент: dialog__close-btn */
.dialog__close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(2px);
  font-weight: 300;
}

.dialog__close-btn:hover {
  background: #ef5350;
  color: white;
  transform: scale(1.05);
}

/* Элемент: dialog__body */
.dialog__body {
  padding: 24px 20px;
  text-align: center;
}

/* Элемент: dialog__message */
.dialog__message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.dialog__message p {
  margin: 0;
  color: #495057;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'Segoe UI', sans-serif;
}

/* Элемент: dialog__footer */
.dialog__footer {
  padding: 16px 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fafafa;
}

/* Элемент: dialog__btn (базовый) */
.dialog__btn {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

/* Модификатор: dialog__btn--secondary */
.dialog__btn--secondary {
  background: #e9ecef;
  color: #495057;
}

.dialog__btn--secondary:hover {
  background: #dee2e6;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Модификатор: dialog__btn--danger */
.dialog__btn--danger {
  background: linear-gradient(135deg, #ef5350 0%, #c62828 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.dialog__btn--danger::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.3s ease;
}

.dialog__btn--danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(198, 40, 40, 0.3);
}

.dialog__btn--danger:hover::before {
  left: 100%;
}

.dialog__btn--danger:active {
  transform: translateY(0);
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .dialog {
    width: 90%;
    margin: 16px;
  }

  .dialog__footer {
    flex-direction: column;
  }

  .dialog__btn {
    width: 100%;
    padding: 10px 20px;
  }

  .dialog__body {
    padding: 20px 16px;
  }
}
</style>
