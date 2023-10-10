<template>
  <div class="volume">
    <Icon :size="20" :type="getIconType" @click="toggleSilence" class="icon" />
    <div class="progress-wrap">
      <ProgressBar :percent="volumePercent" @percentChange="onProgressChange" alwaysShowBtn />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ProgressBar from './progress-bar.vue'

const props = defineProps({
  volume: {
    type: Number,
    default: 1
  }
})
const volumePercent = ref(props.volume)
let lastvolume = 0
const emit = defineEmits(['volumeChange'])
function toggleSilence() {
  if (volumePercent.value > 0) {
    lastvolume = volumePercent.value
    volumePercent.value = 0
  } else {
    volumePercent.value = lastvolume
  }
  emit('volumeChange', volumePercent.value)
}

function onProgressChange(percent) {
  volumePercent.value = percent
  emit('volumeChange', percent)
}
const getIconType = computed(() => {
  return volumePercent.value > 0 ? 'horn' : 'silence'
})
</script>

<style lang="scss" scoped>
.volume {
  display: flex;
  align-items: center;
  width: 150px;

  .icon {
    color: var(--font-color);
    cursor: pointer;
    margin-right: 8px;
  }
  .progress-wrap {
    flex: 1;
  }
}
</style>
