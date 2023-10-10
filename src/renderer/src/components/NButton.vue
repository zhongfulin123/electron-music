<template>
  <div @click="handleClick" class="n-button">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'common'
  }
})
const emit = defineEmits(['handleClick'])
function handleClick() {
  emit('handleClick')
}
</script>

<style lang="scss" scoped>
.n-button {
  display: inline-block;
  padding: 5px 16px;
  border: 1px solid var(--button-border-color);
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: var(--button-hover-bgcolor);
  }
}
</style>
