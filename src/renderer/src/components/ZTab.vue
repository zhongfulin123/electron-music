<template>
  <div>
    <div v-if="isDefalut" class="container-1">
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
    <div v-else class="container-2">
      <div
        v-for="(item, index) in list"
        :key="index"
        :class="[item == modelValue ? 'active-item' : '']"
        class="item"
        @click="handleclick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    list: any[]
    modelValue: string | number
    isDefalut?: boolean
  }>(),
  {
    isDefalut: true
  }
)
const emit = defineEmits(['update:modelValue', 'handleChange'])
function handleclick(value) {
  emit('update:modelValue', value)
  emit('handleChange')
}
</script>

<style scoped lang="scss">
.container-1 {
  display: flex;
  .item {
    margin-right: 20px;
    cursor: pointer;
    position: relative;
  }
  .active-item {
    font-weight: bold;
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
.container-2 {
  display: flex;
  align-items: center;
  .item {
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    padding: 5px 10px;
  }
  .active-item {
    background-color: #fef5f5;
    color: #ec4141;
    border-radius: 20px;
  }
}
</style>
