<template>
  <div>
    <div @click="progressClick" class="progress-bar" ref="progressBar">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div
          class="progress-btn-wrapper"
          ref="progressBtn"
          @mousedown="handleDown"
          :class="{ show: alwaysShowBtn }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  percent: {
    type: Number,
    default: 0
  },
  alwaysShowBtn: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const shiftX = ref(0)

const progressBtn = ref()
const progressBar = ref()
const progress = ref()
const emit = defineEmits(['percentChange'])
onMounted(() => {
  if (props.percent > 0) {
    setProgressOffset(props.percent)
  }
})
function handleDown(event) {
  event.preventDefault()
  shiftX.value = event.clientX - progressBtn.value.getBoundingClientRect().left
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  function onMouseMove(event) {
    let newLeft = event.clientX - shiftX.value - progressBar.value.getBoundingClientRect().left
    // 左边界判断
    if (newLeft < 0) {
      newLeft = 0
    }
    // 右边界判断
    const newWidth = progressBar.value.clientWidth - progressBtn.value.clientWidth
    if (newLeft > newWidth) {
      newLeft = newWidth
    }
    console.log(progressBar.value.clientWidth)
    _offset(newLeft)
    _triggerPercent()
  }
  function onMouseUp() {
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('mousemove', onMouseMove)
  }
}
function progressClick(e) {
  if (!props.disabled) {
    const rect = progressBar.value.getBoundingClientRect()
    const offsetWidth = Math.max(
      0,
      Math.min(e.pageX - rect.left - shiftX.value, progressBar.value.clientWidth)
    )

    _offset(offsetWidth)
    _triggerPercent()
  }
}
function setProgressOffset(percent) {
  if (percent >= 0) {
    const barWidth = progressBar.value.clientWidth
    const offsetWidth = percent * barWidth
    _offset(offsetWidth)
  }
}
function _triggerPercent() {
  emit('percentChange', _getPercent())
}
function _offset(offsetWidth) {
  progress.value.style.width = `${offsetWidth + 'px'}`
  progressBtn.value.style.left = `${offsetWidth + 'px'}`
}
function _getPercent() {
  const barWidth = progressBar.value.clientWidth
  return progress.value.clientWidth / barWidth
}
watch(
  () => props.percent,
  (newPercent) => {
    setProgressOffset(newPercent)
  }
)
</script>

<style scoped lang="scss">
.progress-bar {
  cursor: pointer;
  width: 100%;
  .bar-inner {
    position: relative;
    height: 3px;

    .progress {
      position: absolute;
      height: 100%;
      background: $theme-color;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: 0px;
      top: -6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: $theme-color;
      display: none;
    }
    .show {
      display: block;
    }
  }

  &:hover {
    .progress-btn-wrapper {
      display: block !important;
    }
  }
}
</style>
