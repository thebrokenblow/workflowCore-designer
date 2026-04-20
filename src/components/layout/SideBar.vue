<template>
  <div class="toolbox" :class="toolboxModifiers">
    <div class="toolbox__header">
      <h3 class="toolbox__title">Блоки</h3>
    </div>

    <aside class="toolbox__content">
      <SideBarNode
        v-for="node in nodes"
        :key="node.type"
        :name="node.name"
        :description="node.description"
        :icon="node.icon"
        :draggable="true"
        @dragstart="(event) => onDragStart(event, node.type)"
      />
    </aside>
  </div>
</template>

<script>
import SideBarNode from '../ui/sideBar/SideBarNode.vue'
import useDragAndDrop from '../../composables/useDnD.js'

export default {
  name: 'SideBar',

  components: {
    SideBarNode,
  },

  data() {
    return {
      nodes: [
        {
          type: 'actionNode',
          name: 'Действие',
          description: 'Блок для выполнения операций и команд',
        },
        {
          type: 'conditionNode',
          name: 'Условие',
          description: 'Блок ветвления логики для выбора пути на основе условия',
        },
        {
          type: 'parallelSplitNode',
          name: 'Параллельное разделение',
          description: 'Блок для разделения потока на несколько параллельных веток',
        },
        {
          type: 'syncNode',
          name: 'Синхронизация',
          description: 'Блок для объединения параллельных потоков и ожидания их завершения',
        },
        {
          type: 'loopNode',
          name: 'Цикл',
          description: 'Блок для многократного выполнения действий при соблюдении условия',
        },
      ],
    }
  },

  setup() {
    const { onDragStart } = useDragAndDrop()
    return { onDragStart }
  },
}
</script>

<style scoped>
/* Блок */
.toolbox {
  --toolbox-primary-color: #4caf50;
  --toolbox-primary-dark: #45a049;

  width: 300px;
  background: var(--toolbox-bg, white);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideInLeft 0.3s ease-out;
}

/* Модификаторы блока */
.toolbox--collapsed {
  width: 60px;
}

.toolbox--collapsed .toolbox__header {
  padding: 20px 10px;
}

.toolbox--collapsed .toolbox__title {
  font-size: 14px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.toolbox--collapsed .toolbox__content {
  display: none;
}

.toolbox--mobile {
  width: 100%;
  max-height: 300px;
}

/* Элемент: хедер */
.toolbox__header {
  background: linear-gradient(
    135deg,
    var(--toolbox-primary-color) 0%,
    var(--toolbox-primary-dark) 100%
  );
  padding: 20px;
  text-align: center;
  position: relative;
  transition: padding 0.3s ease;
}

/* Элемент: заголовок */
.toolbox__title {
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.3s ease;
}

/* Элемент: контент */
.toolbox__content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Медиа-запросы с использованием БЭМ */
@media (max-width: 768px) {
  .toolbox {
    width: 100%;
    max-height: 300px;
  }

  .toolbox__content {
    max-height: 200px;
    overflow-y: auto;
  }
}

/* Анимация вынесена в отдельный глобальный класс */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
