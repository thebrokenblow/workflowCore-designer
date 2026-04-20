<template>
  <div class="dropzone-background">
    <Background class="dropzone-background__canvas" :size="2" :gap="20" pattern-color="#BDBDBD" />
  </div>
</template>

<script>
import { Background } from '@vue-flow/background'

export default {
  name: 'DropzoneBackground',
  components: {
    Background,
  },
}
</script>

<style scoped>
.dropzone-background {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.dropzone-background__canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
