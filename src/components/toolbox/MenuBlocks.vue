<template>
  <div class="toolbox">
    <div class="toolbox__header">
      <h3 class="toolbox__title">Блоки</h3>
    </div>
    <div class="toolbox__content">
      <ActionBlockMenu
        draggable="true"
        :block="actionBlock"
        @dragstart="onDragStart($event, actionBlock)"
      />
      <ConditionBlockMenu
        draggable="true"
        :block="conditionBlock"
        @dragstart="onDragStart($event, conditionBlock)"
      />
    </div>
  </div>
</template>

<script>
import ActionBlockMenu from './blocks/ActionBlockMenu.vue'
import ConditionBlockMenu from './blocks/ConditionBlockMenu.vue'

export default {
  name: 'MenuBlocks',

  components: {
    ActionBlockMenu,
    ConditionBlockMenu,
  },

  data() {
    return {
      actionBlock: {
        type: 'ActionBlock',
        name: 'Действие',
        description: 'Базовый блок действия',
        icon: '⚙️',
        defaultData: {
          label: 'ActionBlock',
          description: 'Блок действия',
          inputs: {
            Input1: 'data.Input1',
            Input2: 'data.Input2',
          },
          outputs: {
            Output1: 'step.Output1',
          },
        },
      },
      conditionBlock: {
        type: 'ConditionBlock',
        name: 'Условие',
        description: 'Блок условия (ромб)',
        icon: '🔀',
        defaultData: {
          label: 'ConditionBlock',
          description: 'Блок условия',
          condition: '',
          trueActions: [],
          falseActions: [],
        },
      },
    }
  },

  methods: {
    onDragStart(event, block) {
      event.dataTransfer.setData('application/json', JSON.stringify(block))
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.dropEffect = 'copy'
    },
  },
}
</script>

<style scoped>
.toolbox {
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: toolbox__slideInLeft 0.3s ease-out;
}

@keyframes toolbox__slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toolbox__header {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  padding: 20px;
  text-align: center;
  position: relative;
}

.toolbox__title {
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-family: 'Segoe UI', sans-serif;
}

.toolbox__content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

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
</style>
