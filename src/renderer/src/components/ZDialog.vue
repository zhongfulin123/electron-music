<template>
  <div class="container" v-if="modelValue">
    <div class="close" @click="handleClose">
      <Icon type="guanbi" color="#A5A5A5"></Icon>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue', 'finish'])
function handleClose() {
  emit('update:modelValue', false)
  emit('finish')
}
</script>

<style scoped lang="scss">
.container {
  background-color: var(--body-bgcolor);
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  height: 500px;
  width: 340px;
  z-index: 1003;
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
