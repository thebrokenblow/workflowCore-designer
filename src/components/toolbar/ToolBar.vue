<template>
  <div class="toolbar">
    <SaveJsonButton />
  </div>
</template>

<script>
import SaveJsonButton from './SaveJsonButton.vue'

export default {
  name: 'WorkflowToolbar',

  components: {
    SaveJsonButton,
  },
}
</script>

<style scoped>
.toolbar {
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .toolbar {
    padding: 10px 15px;
  }
}
</style>
