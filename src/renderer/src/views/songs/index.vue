<template>
  <div>
    <ZTab
      :list="tabs"
      v-model="activeTabValue"
      :isDefalut="3"
      @handleChange="getSongs"
      style="margin: 20px 0"
    ></ZTab>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ZTab from '@renderer/components/ZTab.vue'

const tabs = ref([
  { label: '全部', value: 0 },
  { label: '华语', value: 7 },
  { label: '欧美', value: 96 },
  { label: '日本', value: 8 }
])
const activeTabValue = ref(0)
function getSongs() {}
</script>

<style scoped></style>
