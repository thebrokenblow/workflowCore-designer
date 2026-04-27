<template>
  <div class="toolbar">
    <div class="inputs-container">
      <div class="input-group">
        <label>Id:</label>
        <input type="text" v-model="formData.id" placeholder='Пример: "Report"' />
      </div>

      <div class="input-group">
        <label>Version:</label>
        <input type="number" v-model.number="formData.version" placeholder="Пример: 1" />
      </div>

      <div class="input-group">
        <label>Data Type (класс-хранилище):</label>
        <input
          type="text"
          v-model="formData.dataType"
          placeholder="Пример: Workflow.Reports.Model.ReportDataStorage, Workflow.Reports"
        />
      </div>

      <div class="input-group">
        <label>Project Name (название проекта):</label>
        <input type="text" v-model="formData.projectName" placeholder="Пример: Workflow.Reports" />
      </div>
    </div>

    <SaveJsonButton @save-scheme="saveScheme" />
  </div>
</template>

<script>
import SaveJsonButton from '../ui/toolBar/SaveJsonButton.vue'

export default {
  name: 'ToolBar',

  components: {
    SaveJsonButton,
  },

  data() {
    return {
      formData: {
        id: 'Report',
        version: 1,
        dataType: 'Workflow.Reports.Model.ReportDataStorage, Workflow.Reports',
        projectName: 'Workflow.Reports',
      },
    }
  },

  methods: {
    saveScheme() {
      this.$emit('saveScheme')
    },
  },
}
</script>

<style scoped>
/* Глобальный шрифт для всего компонента */
.toolbar,
.toolbar * {
  font-family:
    'Segoe UI',
    -apple-system,
    BlinkMacSystemFont,
    'Roboto',
    'Helvetica Neue',
    sans-serif;
}

.toolbar {
  padding: 15px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
}

.inputs-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
  align-items: flex-end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
  flex: 1;
}

.input-group label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.input-group input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  transition: all 0.2s ease;
  background: #ffffff;
  color: #1f2937;
  width: 100%;
  box-sizing: border-box;
}

.input-group input:hover {
  border-color: #9ca3af;
}

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-group input::placeholder {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 400;
}

/* Убираем переопределение стилей кнопки, чтобы использовались её родные стили */
.toolbar :deep(.save-json-button),
.toolbar button {
  align-self: flex-end;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .toolbar {
    align-items: stretch;
  }

  .toolbar :deep(.save-json-button),
  .toolbar button {
    align-self: auto;
  }
}

@media (max-width: 768px) {
  .toolbar {
    padding: 12px 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .inputs-container {
    flex-direction: column;
    gap: 12px;
  }

  .input-group {
    min-width: auto;
  }

  .input-group input {
    font-size: 14px;
    padding: 12px;
  }

  .toolbar :deep(.save-json-button),
  .toolbar button {
    width: 100%;
  }
}
</style>
