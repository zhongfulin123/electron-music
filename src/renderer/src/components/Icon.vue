<template>
  <div>
    <span v-if="backdrop">
      <i @click="handleClick" :class="`iconfont icon-component ${getIconCls()}`" :style="getIconStyle()"></i>
    </span>
    <i @click="handleClick" :class="`iconfont icon-component ${getIconCls()}`" :style="getIconStyle()" v-else></i>
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
  if (props.color) {
    cls += ` icon-color-${props.color}`
  }
  return cls
}

function handleClick (e) {
  emit('handleClick',e)
}
function getIconStyle () {
      const retStyle: {fontSize:number | string,transform?:string} = { fontSize: props.size + 'px' }
      return retStyle
}
</script>

<style scoped lang="scss">
.backdrop {
  display: inline-block;
  @include flex-center;
  border-radius: 50%;

  &:hover {
    background: var(--round-hover-bgcolor);
  }
}

.icon-component {
  cursor: pointer;
}

.icon-color {
  // 通过prop传入这几个字段
  // 可以使用默认的几个颜色
  &-theme {
    color: $theme-color;
  }
  &-white {
    color: $white;
  }
  &-shallow {
    color: var(--font-color-shallow-grey);
  }
}
</style>
