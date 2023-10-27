<template>
  <div
    class="searchContainer"
    :class="[searchValue ? 'searchContainer-value' : '']"
    v-if="isSearchFouce"
  >
    <div>
      <HotListVue></HotListVue>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSearchHot } from '@renderer/api'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@renderer/store/global'
import HotListVue from './HotList.vue'
import { storeToRefs } from 'pinia'
const { searchValue, isSearchFouce } = storeToRefs(useGlobalStore())
onMounted(() => {
  querySearchHot()
})

const hotList = ref<Record<string, any>>()

async function querySearchHot() {
  const res = await getSearchHot()
  if (res.code !== 200) return
  hotList.value = res.data
}
</script>

<style scoped lang="scss">
.searchContainer {
  height: calc(100% - #{$mini-player-height} - 80px);
  background-color: var(--body-bgcolor);
  z-index: 999;
  position: fixed;
  left: 22%;
  top: calc(#{$header-height} + 10px);
  width: 380px;
  border-radius: 5px;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.5s;
  padding: 20px;
}
.searchContainer-value {
  width: 400px;
}
</style>
