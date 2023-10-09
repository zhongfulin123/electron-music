<template>
    <svg aria-hidden="true" :width="width + 'px'" :height="height + 'px'">
      <use :href="symbolId" :fill="color" />
    </svg>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue'
  
  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#333',
      },
      height:{
        type: [Number,String],
        default: '16'
      },
      width:{
        type: [Number,String],
        default: '16'
      }
    },
    setup(props) {
      const symbolId = computed(() => `#${props.prefix}-${props.name}`)
      return { symbolId }
    },
  })
  </script>