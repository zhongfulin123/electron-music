<template>
  <div class="container">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="[item.value == modelValue ? 'active-item' : '']"
      class="item"
      @click="handleclick(item.value)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
 defineProps<{
  list: any[]
  modelValue: string | number
}>()
const emit = defineEmits(['update:modelValue'])
function handleclick(value) {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  .item {
    margin-right: 20px;
    cursor: pointer;
    position: relative;
  }
  .active-item {
    font-weight: bold;
    // transform: scale(1.3);
    font-size: 20px;
    position: relative;
    &::before {
      position: absolute;
      content: '';
      width: 80%;
      height: 3px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ec4141;
      bottom: -5px;
    }
  }
}
</style>
