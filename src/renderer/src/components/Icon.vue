<template>
  <div>
    <i
      @click="handleClick"
      :class="`iconfont icon-component ${getIconCls()}`"
      :style="getIconStyle()"
    ></i>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: Number,
    default: 16
  },
  type: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  backdrop: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['handleClick'])
function getIconCls() {
  let cls = `icon-${props.type}`
  return cls
}

function handleClick(e) {
  emit('handleClick', e)
}
function getIconStyle() {
  const retStyle = { fontSize: props.size + 'px', color: props.color }
  return retStyle
}
</script>

<style scoped lang="scss">
.icon-component {
  cursor: pointer;
}
</style>
